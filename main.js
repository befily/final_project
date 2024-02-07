// IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

// GUI PARAMETERS
const parameters = {
  squareSize: 1,
  numIterations: 3
};

// CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
let gui;
let scene;
let camera;
let renderer;
let container;
let control;
let ambientLight;
let directionalLight;
let squareMesh;
let lines = [];

function main() {
  // CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 5);

  // LIGHTING
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(2, 5, 5);
  directionalLight.target.position.set(-1, -1, 0);
  scene.add(directionalLight);
  scene.add(directionalLight.target);

  // GEOMETRY INITIATION
  createSquare();
  createLines();

  // GUI SETUP
  gui = new GUI();
  gui.add(parameters, 'squareSize', 1, 20, 1).onChange(updateSquareSize);
  gui.add(parameters, 'numIterations', 1, 10, 1).onChange(createLines);

  // RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);

  // CREATE RENDERER
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x8b0000); 
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);

  // CREATE MOUSE CONTROL
  control = new OrbitControls(camera, renderer.domElement);

  // EXECUTE THE UPDATE
  animate();
}

function createSquare() {
  const squareGeometry = new THREE.BoxGeometry(parameters.squareSize, parameters.squareSize, 0);
  const squareMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
  scene.add(squareMesh);
}

function createLines() {
  // Clear existing lines
  lines.forEach(line => scene.remove(line));
  lines = [];

  // Create initial Line
  const startPoint = getRandomEdgePoint();
  const endPoint = getRandomEdgePoint();
  createLine(startPoint, endPoint);
}

function getRandomEdgePoint() {
  const side = Math.floor(Math.random() * 4); // Randomly pick a side (0, 1, 2, or 3)
  const halfSize = parameters.squareSize / 2;

  let x, y;

  switch (side) {
    case 0: // Top side
      x = Math.random() * parameters.squareSize - halfSize;
      y = halfSize;
      break;
    case 1: // Right side
      x = halfSize;
      y = Math.random() * parameters.squareSize - halfSize;
      break;
    case 2: // Bottom side
      x = Math.random() * parameters.squareSize - halfSize;
      y = -halfSize;
      break;
    case 3: // Left side
      x = -halfSize;
      y = Math.random() * parameters.squareSize - halfSize;
      break;
  }

  return new THREE.Vector3(x, y, 0);
}


function createLine(startPoint, endPoint, iterations) {
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
  lines.push(line);

  //Calculate angle
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const angle = Math.atan2(dy, dx);
  const angleDegrees = THREE.MathUtils.radToDeg(angle);

  console.log("Angle:", angleDegrees);



  // Calculate new angle (original angle + 90 degrees)
  const newAngle = angle + Math.PI / 2; // Adding 90 degrees in radians
  const newAngleDegrees = THREE.MathUtils.radToDeg(newAngle);

  console.log("New Angle:", newAngleDegrees);

  const randomPoint = newStartPoint(lines[0].geometry.attributes.position.array);
  



  //calculate new start point on first line
  function newStartPoint(linePositions) {

    // Extracting start and end points of the line from the linePositions array
    const startX = linePositions[0];
    const startY = linePositions[1];
    const endX = linePositions[3];
    const endY = linePositions[4];

    // Generating a random t value to interpolate along the line segment
    const t = Math.random();

    // Interpolating to find the random point
    
    const randomX = startX + t * (endX - startX);
    const randomY = startY + t * (endY - startY);

    console.log("new Start Point:", randomX, randomY);

    // Create a sphere geometry representing the point
    const pointGeometry = new THREE.SphereGeometry(0.03, 10, 10);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 });
    const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
 
    // Position the sphere at the random point
    pointMesh.position.set(randomX, randomY, 0);
 
    // Add the sphere to the scene
    scene.add(pointMesh);
 
    // Return the random point
    return new THREE.Vector3(randomX, randomY, 0);
    
  }

    
  //New Line
  function newLine(){

    // Length of the new line
    const newLineLength = 2;

    // Calculate the end point of the new line based on the new start point and angle
    const newEndPoint = new THREE.Vector3(
      randomPoint.x + newLineLength * Math.cos(newAngle),
      randomPoint.y + newLineLength * Math.sin(newAngle),
      0
    );

    // Create the new line geometry
    const newLineGeometry = new THREE.BufferGeometry().setFromPoints([randomPoint, newEndPoint]);
    const newLineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const newLine = new THREE.Line(newLineGeometry, newLineMaterial);

    // Add the new line to the scene
    scene.add(newLine);
  }

  newLine();  

}



function updateSquareSize() {
  squareMesh.scale.set(parameters.squareSize, parameters.squareSize, 1);
}

// RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}

// ANIMATE AND RENDER
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// EXECUTE MAIN
main();