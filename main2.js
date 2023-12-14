import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

// VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;

console.log(width, height);

// GUI PARAMETERS
let gui;
const parameters = {
  numberOfSpheres: 50,
  rotationSpeed: 0.005,
};

// CREATE SCENE AND CAMERA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
camera.position.set(0, 0, 50);

// CREATE RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const container = document.querySelector('#threejs-container');
container.append(renderer.domElement);

// CREATE MOUSE CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

// RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}

// GUI
function setupGUI() {
  gui = new GUI();
  gui.add(parameters, 'numberOfSpheres', 1, 100, 1).name('Number of Spheres').onChange(() => {
    clearSpheres();
    createSpheres();
  });
  gui.add(parameters, 'rotationSpeed', 0, 0.1, 0.001).name('Rotation Speed'); // New slider for rotation speed
}

// CREATE SPHERES IN A SPIRAL
function createSpheres() {
  const numberOfSpheres = parameters.numberOfSpheres;
  const angleIncrement = 0.1;
  const radiusIncrement = 0.1;

  // Create Spheres in a spiral pattern
  for (let i = 0; i < numberOfSpheres; i++) {
    const angle = i * angleIncrement;
    const radius = i * radiusIncrement;

    // Convert polar coordinates to Cartesian coordinates
    const x = radius * Math.cos(angle) * 5;
    const y = radius * Math.sin(angle) * 5;

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff1493 });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, 0);
    scene.add(sphere);
  }
}

// CLEAR SPHERES
function clearSpheres() {
  scene.children.forEach((object) => {
    if (object instanceof THREE.Mesh) {
      scene.remove(object);
    }
  });
}

// EVENT LISTENERS
window.addEventListener('resize', handleResize);

// ANIMATE AND RENDER
function animate() {
  requestAnimationFrame(animate);

  controls.update();

//ROTATE THE ENTIRE SPIRAL
  scene.rotation.z += parameters.rotationSpeed;

  renderer.render(scene, camera);
}


// INITIALIZATION
setupGUI();
createSpheres();
animate();