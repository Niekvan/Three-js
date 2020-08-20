import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  sRGBEncoding,
  Raycaster,
  Color,
  SkinnedMesh,
  HemisphereLight,
  DirectionalLight,
  Vector2,
  Renderer,
  AnimationMixer,
} from 'three';

import Modal from './modal';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const renderer = new WebGLRenderer({ antialias: true });
const raycaster = new Raycaster();
const scene = new Scene();
const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

let mouse = [0.5, 0.5];

// const hemiLight = new HemisphereLight(0xe6e210, 0xf0f0f0, 0.61);
// const directionalLight = new DirectionalLight(0xffffff, 0.1);

export const init = () => {
  scene.background = new Color(0x000000);

  // scene.add(hemiLight);

  // const d = 8.25;
  // directionalLight.position.set(-8, 12, 2000);
  // directionalLight.castShadow = true;
  // directionalLight.shadow.mapSize = new Vector2(1024, 1024);
  // directionalLight.shadow.camera.near = 0.1;
  // directionalLight.shadow.camera.far = 3000;
  // directionalLight.shadow.camera.left = d * -1;
  // directionalLight.shadow.camera.right = d;
  // directionalLight.shadow.camera.top = d;
  // directionalLight.shadow.camera.bottom = d * -1;

  // scene.add(directionalLight);

  camera.position.set(0, 0, 300);

  const loader = new GLTFLoader();
  loader.load('/public/200819_ISLAND_TEST.glb', (gltf) => {
    const model = gltf.scene;
    model.rotation.x = Math.PI / 4;

    // const mixer = new AnimationMixer(model);
    // const action = mixer.clipAction(gltf.animations[0]);
    // action.play();

    scene.add(model);
    document.addEventListener('click', onMouseClick);
    render();
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = sRGBEncoding;

  document.getElementById('three').appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
};

const onMouseClick = (e: MouseEvent) => {
  const mouse = {
    x: 0,
    y: 0,
  };
  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects[0]) {
    const object = intersects[0].object;
    object.traverse((o: SkinnedMesh) => {
      if (o.isMesh) {
        console.log(o.name);
        Modal.showModal(o.name);
      }
    });
  }
};

const onMouseMove = (e: MouseEvent) => {
  mouse[0] = e.clientX / window.innerWidth;
  mouse[1] = e.clientY / window.innerHeight;
};

function resizeRendererToDisplaySize(renderer: Renderer) {
  const canvas = renderer.domElement;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let canvasPixelWidth = canvas.width / window.devicePixelRatio;
  let canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export function render() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  camera.position.x = Math.sin(0.5 * Math.PI * (mouse[0] - 0.5)) * 300;
  camera.position.y = Math.sin(0.25 * Math.PI * (mouse[1] - 0.5)) * 300;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
