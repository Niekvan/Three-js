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
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new WebGLRenderer({ antialias: true });
const raycaster = new Raycaster();
const scene = new Scene();
const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;

const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.61);
const directionalLight = new DirectionalLight(0xffffff, 0.54);

export const init = () => {
  scene.background = new Color(0xf1f1f1);

  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  const d = 8.25;
  directionalLight.position.set(-8, 12, 8);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize = new Vector2(1024, 1024);
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 3000;
  directionalLight.shadow.camera.left = d * -1;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = d * -1;

  scene.add(directionalLight);

  camera.position.set(0, 0, 5);

  const loader = new GLTFLoader();
  loader.load(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb',
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(2, 2, 2);
      model.position.y = -1;
      model.rotation.y = Math.PI;

      scene.add(model);
      document.addEventListener('click', onMouseClick);
      render();
    }
  );

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = sRGBEncoding;

  document.getElementById('three').appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
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
      }
    });
  }
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
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}
