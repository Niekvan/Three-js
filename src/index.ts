import { init, render } from './three';

import './css/main.css';

import { WEBGL } from 'three/examples/jsm/WebGL';

if (WEBGL.isWebGLAvailable) {
  init();
  render();
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}
