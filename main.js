import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

// VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;

console.log(width, height);



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

// Create a white circle
const circleGeometry = new THREE.CircleGeometry(10, 32); // radius: 10, segments: 32
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // white color
const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
scene.add(circleMesh);

// Generate two random angles
const angle1 = Math.random() * Math.PI * 2;
const angle2 = Math.random() * Math.PI * 2;

// Calculate corresponding points on the circle
const point1 = new THREE.Vector3(10 * Math.cos(angle1), 10 * Math.sin(angle1), 0);
const point2 = new THREE.Vector3(10 * Math.cos(angle2), 10 * Math.sin(angle2), 0);

// Create a black line between the two points
const lineGeometry = new THREE.BufferGeometry().setFromPoints([point1, point2]);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // black color
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);



// Render the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  renderer.render(scene, camera);
}

animate();

// EVENT LISTENERS
window.addEventListener('resize', handleResize);