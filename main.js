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

function drawPoint(point) {
  const pointGeometry = new THREE.SphereGeometry(0.03, 8, 8); // Adjust radius and segments as needed
  const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 }); // Red color, you can change it
  const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
  pointMesh.position.copy(point);
  scene.add(pointMesh);
}

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
  
  // GUI SETUP
  gui = new GUI();

  // RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);

  // CREATE RENDERER
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000); 
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);

  // CREATE MOUSE CONTROL
  control = new OrbitControls(camera, renderer.domElement);

  // EXECUTE THE UPDATE
  animate();


  const angle1 = randomAngle1();
  const angle2 = calculateAngle2();
  const angle3 = calculateAngle3();

  console.log('Angle 1:', angle1);
  console.log('Angle 2:', angle2);
  console.log('Angle 3:', angle3);
  
  const point1A =  new THREE.Vector3(0, 0, 0);
  const point1B = createPoint1B(angle1);
  const point1C = createPoint1C(angle2);
  const point1D = createPoint1D(angle3);

  const point2A = createPoint2A(angle1);
  
  
  drawPoint(point1A);
  drawPoint(point1B);
  drawPoint(point1C);
  drawPoint(point1D);
  drawPoint(point2A);


// Generate a random angle in radians between 10 and 90
  function randomAngle1() {
    const degrees = Math.random() * (80 - 10) + 10;
    const angle1 = degrees * (Math.PI / 180);
    
    return angle1;
  }

  function calculateAngle2() {
    const angle2 = angle1 + Math.PI / 2;
    
    return angle2;
  }

  function calculateAngle3() {
    const angle3 = angle1 + Math.PI / 4;

    return angle3;
  }


  function createPoint1B(angle1) {
    const x = Math.sin(angle1);
    const y = Math.cos(angle1);
    const point1B = new THREE.Vector3(x, y, 0);
  
    return point1B;
  }

  function createPoint1C(angle2) {
    const x = Math.sin(angle2);
    const y = Math.cos(angle2);
    const point1C = new THREE.Vector3(x, y, 0);
  
    return point1C;
  }

  function createPoint1D(angle3) {
    const x = Math.sin(angle3)* Math.sqrt(2);
    const y = Math.cos(angle3)* Math.sqrt(2);
    const point1D = new THREE.Vector3(x, y, 0);
  
    return point1D;
  }

  function createSquare(point1A, point1B, point1C, point1D) {
  
    // Create square Polygon from 4 points
    const squareGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      point1A.x, point1A.y, point1A.z,
      point1B.x, point1B.y, point1B.z,
      point1D.x, point1D.y, point1D.z,
      point1C.x, point1C.y, point1C.z,
      point1A.x, point1A.y, point1A.z // closing the loop
    ]);

    const indices = new Uint16Array([
      0, 1, 1, 2, 2, 3, 3, 0
    ]);

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);
  }

  createSquare(point1A, point1B, point1C, point1D);


  function createPoint2A(angle1) {

    const randomDistance = Math.random() * 0.8 +0.1;
    const x = Math.sin(angle1) * randomDistance;
    const y = Math.cos(angle1) * randomDistance;
    const point2A = new THREE.Vector3(x, y, 0);
  
    return point2A;
  }
  
  function createPoint2B(){
    let point2B;
    let side;
    if (point2A.x <= point1C.x)
    {
    // Steigung P1A - P1C
    const m1 = (point1C.y - point1A.y) / (point1C.x - point1A.x);
    // x Abstand P2A - P1A
    const dx2 = point2A.x - point1A.x;
    const y2 = point1A.y + m1 * dx2;
    point2B = new THREE.Vector3(point2A.x, y2, 0);
    side = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1C.y) / (point1D.x - point1C.x);
    // x Abstand P2A - P1A
    const dx2 = point2A.x - point1C.x;
    const y2 = point1C.y + m1 * dx2;
    point2B = new THREE.Vector3(point2A.x, y2, 0);
    side = 1;
    }
    console.log(point2B);
    return {point2B, side};
  }
  const { point2B, side } = createPoint2B();
  drawPoint(point2B);
  console.log(side, point2B);


  function createPolygon1A(side){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    switch (side) {
      case 0: //left
        vertices = new Float32Array([
          point1A.x, point1A.y, point1A.z,
          point2A.x, point2A.y, point2A.z,
          point2B.x, point2B.y, point2B.z,
          point1A.x, point1A.y, point1A.z // closing the loop
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 0
        ]);
      break;

      case 1: //right
        vertices = new Float32Array([
          point1A.x, point1A.y, point1A.z,
          point2A.x, point2A.y, point2A.z,
          point2B.x, point2B.y, point2B.z,
          point1C.x, point1C.y, point1C.z,
          point1A.x, point1A.y, point1A.z // closing the loop
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);
      break;
    }
    
    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);
  }

  createPolygon1A(side);

  function createPolygon1B(side){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    switch (side) {
      case 0: //left
        vertices = new Float32Array([
          point2A.x, point2A.y, point2A.z,
          point1B.x, point1B.y, point1B.z,
          point1D.x, point1D.y, point1D.z,
          point1C.x, point1C.y, point1C.z,
          point2B.x, point2B.y, point2B.z,
          point2A.x, point2A.y, point2A.z // closing the loop
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 4, 4, 0
        ]);
      break;

      case 1: //right
        vertices = new Float32Array([
          point2A.x, point2A.y, point2A.z,
          point1B.x, point1B.y, point2B.z,
          point1D.x, point1D.y, point1D.z,
          point2B.x, point2B.y, point2B.z,
          point2A.x, point2A.y, point2A.z // closing the loop
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);
      break;
    }
    
    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xfff000 }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);
  }

  createPolygon1B(side);


  function createPoint2C(point2A, point2B) {

    const x = point2A.x;
    const y = (point2A.y - point2B.y) * Math.random() + point2B.y;
    const point2C = new THREE.Vector3(x, y, 0);

    return point2C;
  }

  const point2C = createPoint2C(point2A, point2B);
  drawPoint(point2C);

  function createPoint2D(point2A, point2B) {

    const x = point2A.x;
    const y = (point2A.y - point2B.y) * Math.random() + point2B.y;
    const point2D = new THREE.Vector3(x, y, 0);

    return point2D;
  }

  const point2D = createPoint2D(point2A, point2B);
  drawPoint(point2D);

   function createPoint3A(){
    let point3A;
    let side2;
    if (point2C.y > point1D.y)
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1B.y) / (point1D.x - point1B.x);
    // x Abstand P2A - P1A
    const dy2 = point2C.y - point1B.y;
    const x2 = point1B.x + dy2 / m1;
    point3A = new THREE.Vector3(x2, point2C.y, 0);
    side2 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1C.y) / (point1D.x - point1C.x);
    // x Abstand P2A - P1A
    const dy2 = point2C.y - point1C.y;
    const x2 = point1C.x + dy2 / m1;
    point3A = new THREE.Vector3(x2, point2C.y, 0);
    side2 = 1;
    }
    console.log(point3A);
    return {point3A, side2};
  }
  const { point3A, side2 } = createPoint3A();
  drawPoint(point3A);
  console.log(side2, point3A); 

  function createPoint3B(){
    let point3B;
    let side3;
    if (point2D.y > point1A.y)
    {
    // Steigung P1A - P1C
    const m1 = (point1B.y - point1A.y) / (point1B.x - point1A.x);
    // x Abstand P2A - P1A
    const dy2 = point2D.y - point1A.y;
    const x2 = point1A.x + dy2 / m1;
    point3B = new THREE.Vector3(x2, point2D.y, 0);
    side3 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1C.y - point1A.y) / (point1C.x - point1A.x);
    // x Abstand P2A - P1A
    const dy2 = point2D.y - point1A.y;
    const x2 = point1A.x + dy2 / m1;
    point3B= new THREE.Vector3(x2, point2D.y, 0);
    side3 = 1;
    }
    console.log(point3B);
    return {point3B, side3};
  }
  const { point3B, side3 } = createPoint3B();
  drawPoint(point3B);
  console.log(side3, point3B); 

  










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