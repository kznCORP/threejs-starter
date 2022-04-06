import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats.js";

import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let canvas, stats;
let camera, scene, renderer, mesh;

init();
animate();

function init() {
  canvas = document.querySelector("canvas.webgl");

  // Debug
  const gui = new dat.GUI({ width: 340 });

  //
  scene = new THREE.Scene();

  //
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
  // camera.position.set(0, 0, 0.5); 
  camera.position.set(0, 0, 2);
  scene.add(camera);

  //
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  //
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //
  const geometry = new THREE.PlaneGeometry(2, 2, 128, 128);

  //
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("white") },
    },
  });

  //
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  //
  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  //
  window.addEventListener("resize", onWindowResize);
}

function animate() {
  const clock = new THREE.Clock();
  const elapsedTime = clock.getElapsedTime();

  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

// Event Listener Functions
function onWindowResize() {
  // Update sizes
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  // Update camera
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
