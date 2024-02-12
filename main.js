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

function drawPoint(point) {
  const pointGeometry = new THREE.SphereGeometry(0.01, 8, 8); // Adjust radius and segments as needed
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
    const degrees = Math.random() * (90 - 30) + 30;
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

  //createSquare(point1A, point1B, point1C, point1D);


  function createPoint2A(angle1) {

    const randomDistance = Math.random() * 0.7 + 0.2;
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

    return {point2B, side};
  }
  const { point2B, side } = createPoint2B();
  drawPoint(point2B);
  console.log('Side:', side);


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

  //createPolygon1A(side);

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

  //createPolygon1B(side);


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
    
    return {point3A, side2};
  }
  const { point3A, side2 } = createPoint3A();
  drawPoint(point3A);
  console.log('Side 2:', side2); 

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
    
    return {point3B, side3};
  }
  const { point3B, side3 } = createPoint3B();
  drawPoint(point3B);
  console.log('Side 3:', side3);

  function createPolygon2A(side, side2){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side2 === 0){
        vertices = new Float32Array([
          point2C.x, point2C.y, point2C.z,
          point3A.x, point3A.y, point3A.z,
          point1B.x, point1B.y, point1B.z,
          point2A.x, point2A.y, point2A.z,
          point2C.x, point2C.y, point2C.z
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);

      }else if(side === 0 && side2 === 1){
        vertices = new Float32Array([
          point2C.x, point2C.y, point2C.z,
          point3A.x, point3A.y, point3A.z,
          point1D.x, point1D.y, point1D.z,
          point1B.x, point1B.y, point1B.z,
          point2A.x, point2A.y, point2A.z,
          point2C.x, point2C.y, point2C.z
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 4, 4, 0
        ]);
      
      }else if(side === 1 && side2 === 0){
        vertices = new Float32Array([
          point2C.x, point2C.y, point2C.z,
          point3A.x, point3A.y, point3A.z,
          point1B.x, point1B.y, point1B.z,
          point2A.x, point2A.y, point2A.z,
          point2C.x, point2C.y, point2C.z
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);

      }else if(side === 1 && side2 === 1){
        vertices = new Float32Array([
          point2C.x, point2C.y, point2C.z,
          point3A.x, point3A.y, point3A.z,
          point1D.x, point1D.y, point1D.z,
          point1B.x, point1B.y, point1B.z,
          point2A.x, point2A.y, point2A.z,
          point2C.x, point2C.y, point2C.z
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 4, 4, 0
        ])
      }

  squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const squareMaterial = new THREE.LineBasicMaterial({ color: 0x008000 }); // White color, you can change it
  const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
  scene.add(squareMesh);

  }

  //createPolygon2A(side, side2);

  function createPolygon2B(side, side2){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side2 === 0){
        vertices = new Float32Array([
          point2C.x, point2C.y, point2C.z,
          point3A.x, point3A.y, point3A.z,
          point1D.x, point1D.y, point1D.z,
          point1C.x, point1C.y, point1C.z,
          point2B.x, point2B.y, point2B.z,
          point2C.x, point2C.y, point2C.z
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 4, 4, 0
        ]);

      }else if(side === 0 && side2 === 1){
        vertices = new Float32Array([
          point2C.x, point2C.y, point2C.z,
          point3A.x, point3A.y, point3A.z,
          point1C.x, point1C.y, point1C.z,
          point2B.x, point2B.y, point2B.z,
          point2A.x, point2A.y, point2A.z
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);
      
      }else if(side === 1 && side2 === 0){
        vertices = new Float32Array([
          point2C.x, point2C.y, point2C.z,
          point3A.x, point3A.y, point3A.z,
          point1D.x, point1D.y, point1D.z,
          point2B.x, point2B.y, point2B.z,
          point2C.x, point2C.y, point2C.z
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);

      }else if(side === 1 && side2 === 1){
        vertices = new Float32Array([
          point2C.x, point2C.y, point2C.z,
          point3A.x, point3A.y, point3A.z,
          point2B.x, point2B.y, point2B.z,
          point2C.x, point2C.y, point2C.z
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 0
        ])
      }

  squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const squareMaterial = new THREE.LineBasicMaterial({ color: 0x008000 }); // White color, you can change it
  const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
  scene.add(squareMesh);

  }

  //createPolygon2B(side, side2);

  function createPolygon2C(side, side3){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side3 === 0){
        vertices = new Float32Array([
          point2D.x, point2D.y, point2D.z,
          point3B.x, point3B.y, point3B.z,
          point2A.x, point2A.y, point2A.z,
          point2D.x, point2D.y, point2D.z
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 0
        ]);

      }else if(side === 0 && side3 === 1){
        vertices = new Float32Array([
          point2D.x, point2D.y, point2D.z,
          point3B.x, point3B.y, point3B.z,
          point1A.x, point1A.y, point1A.z,
          point2A.x, point2A.y, point2A.z,
          point2D.x, point2D.y, point2D.z
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);
      
      }else if(side === 1 && side3 === 0){
        vertices = new Float32Array([
          point2D.x, point2D.y, point2D.z,
          point3B.x, point3B.y, point3B.z,
          point2A.x, point2A.y, point2A.z,
          point2D.x, point2D.y, point2D.z
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 0
        ]);

      }else if(side === 1 && side3 === 1){
        vertices = new Float32Array([
          point2D.x, point2D.y, point2D.z,
          point3B.x, point3B.y, point3B.z,
          point1A.x, point1A.y, point1A.z,
          point2A.x, point2A.y, point2A.z,
          point2D.x, point2D.y, point2D.z
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ])
      }

  squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const squareMaterial = new THREE.LineBasicMaterial({ color: 0x008000 }); // White color, you can change it
  const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
  scene.add(squareMesh);

  }

  //createPolygon2C(side, side3);

  function createPolygon2D(side, side3){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side3 === 0){
        vertices = new Float32Array([
          point2D.x, point2D.y, point2D.z,
          point3B.x, point3B.y, point3B.z,
          point1A.x, point1A.y, point1A.z,
          point2B.x, point2B.y, point2B.z,
          point2D.x, point2D.y, point2D.z
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);

      }else if(side === 0 && side3 === 1){
        vertices = new Float32Array([
          point2D.x, point2D.y, point2D.z,
          point3B.x, point3B.y, point3B.z,
          point1A.x, point1A.y, point1A.z,
          point2B.x, point2B.y, point2B.z,
          point2D.x, point2D.y, point2D.z
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);
      
      }else if(side === 1 && side3 === 0){
        vertices = new Float32Array([
          point2D.x, point2D.y, point2D.z,
          point3B.x, point3B.y, point3B.z,
          point1A.x, point1A.y, point1A.z,
          point1C.x, point1C.y, point1C.z,
          point2B.x, point2B.y, point2B.z,
          point2D.x, point2D.y, point2D.z
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 4, 4, 0
        ]);

      }else if(side === 1 && side3 === 1){
        vertices = new Float32Array([
          point2D.x, point2D.y, point2D.z,
          point3B.x, point3B.y, point3B.z,
          point1C.x, point1C.y, point1C.z,
          point2B.x, point2B.y, point2B.z,
          point2D.x, point2D.y, point2D.z
        ]);
  
        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ])
      }

  squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const squareMaterial = new THREE.LineBasicMaterial({ color: 0x008000 }); // White color, you can change it
  const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
  scene.add(squareMesh);

  }

  //createPolygon2D(side, side3);

  function createPoint3C(point2C, point3A) {

    const x = (point3A.x - point2C.x) * Math.random() + point2C.x;
    const y = point2C.y;
    const point3C = new THREE.Vector3(x, y, 0);

    return point3C;
  }

  const point3C = createPoint3C(point2C, point3A);
  drawPoint(point3C);

  function createPoint3D(point2C, point3A) {

    const x = (point3A.x - point2C.x) * Math.random() + point2C.x;
    const y = point2C.y;
    const point3D = new THREE.Vector3(x, y, 0);

    return point3D;
  }

  const point3D = createPoint3D(point2C, point3A);
  drawPoint(point3D);


  function createPoint3E(point2D, point3B) {

    const x = (point3B.x - point2D.x) * Math.random() + point2D.x;
    const y = point2D.y;
    const point3E = new THREE.Vector3(x, y, 0);

    return point3E;
  }

  const point3E = createPoint3E(point2D, point3B);
  drawPoint(point3E);

  function createPoint3F(point2D, point3B) {

    const x = (point3B.x - point2D.x) * Math.random() + point2D.x;
    const y = point2D.y;
    const point3F = new THREE.Vector3(x, y, 0);

    return point3F;
  }

  const point3F = createPoint3F(point2D, point3B);
  drawPoint(point3F);

  function createPoint4A(){
    let point4A;
    let side4;
    if (point3C.x <= point1B.x)
    {
    // Steigung P1A - P1C
    const m1 = (point1B.y - point1A.y) / (point1B.x - point1A.x);
    // x Abstand P2A - P1A
    const dx2 = point3C.x - point1A.x;
    const y2 = point1A.y + m1 * dx2;
    point4A = new THREE.Vector3(point3C.x, y2, 0);
    side4 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1B.y) / (point1D.x - point1B.x);
    // x Abstand P2A - P1A
    const dx2 = point3C.x - point1D.x;
    const y2 = point1D.y + m1 * dx2;
    point4A = new THREE.Vector3(point3C.x, y2, 0);
    side4 = 1;
    }

    return {point4A, side4};
  }
  const { point4A, side4 } = createPoint4A();
  drawPoint(point4A);
  console.log('Side 4:', side4);

  function createPoint4B(){
    let point4B;
    let side5;
    if (point3D.x <= point1C.x)
    {
    // Steigung P1A - P1C
    const m1 = (point1C.y - point1A.y) / (point1C.x - point1A.x);
    // x Abstand P2A - P1A
    const dx2 = point3D.x - point1A.x;
    const y2 = point1A.y + m1 * dx2;
    point4B = new THREE.Vector3(point3D.x, y2, 0);
    side5 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1C.y) / (point1D.x - point1C.x);
    // x Abstand P2A - P1A
    const dx2 = point3D.x - point1C.x;
    const y2 = point1C.y + m1 * dx2;
    point4B = new THREE.Vector3(point3D.x, y2, 0);
    side5 = 1;
    }

    return {point4B, side5};
  }
  const { point4B, side5 } = createPoint4B();
  drawPoint(point4B);
  console.log('Side 5:', side5);

  function createPoint4C(){
    let point4C;
    let side6;
    if (point3E.x <= point1B.x)
    {
    // Steigung P1A - P1C
    const m1 = (point1B.y - point1A.y) / (point1B.x - point1A.x);
    // x Abstand P2A - P1A
    const dx2 = point3E.x - point1A.x;
    const y2 = point1A.y + m1 * dx2;
    point4C = new THREE.Vector3(point3E.x, y2, 0);
    side6 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1B.y) / (point1D.x - point1B.x);
    // x Abstand P2A - P1A
    const dx2 = point3D.x - point1D.x;
    const y2 = point1D.y + m1 * dx2;
    point4C = new THREE.Vector3(point3D.x, y2, 0);
    side6 = 1;
    }

    return {point4C, side6};
  }
  const { point4C, side6 } = createPoint4C();
  drawPoint(point4C);
  console.log('Side 6:', side6);

  function createPoint4D(){
    let point4D;
    let side7;
    if (point3F.x <= point1C.x)
    {
    // Steigung P1A - P1C
    const m1 = (point1C.y - point1A.y) / (point1C.x - point1A.x);
    // x Abstand P2A - P1A
    const dx2 = point3F.x - point1A.x;
    const y2 = point1A.y + m1 * dx2;
    point4D = new THREE.Vector3(point3F.x, y2, 0);
    side7 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1C.y) / (point1D.x - point1C.x);
    // x Abstand P2A - P1A
    const dx2 = point3F.x - point1C.x;
    const y2 = point1C.y + m1 * dx2;
    point4D = new THREE.Vector3(point3F.x, y2, 0);
    side7 = 1;
    }

    return {point4D, side7};
  }
  const { point4D, side7 } = createPoint4D();
  drawPoint(point4D);
  console.log('Side 7:', side7);

  function createPolygon3A(side, side2, side4){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side2 === 0 && side4 === 0){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point3A.x, point3A.y, point3A.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 0 && side2 === 0 && side4 === 1){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point3A.x, point3A.y, point3A.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ]);
      
    }else if(side === 0 && side2 === 1 && side4 === 0){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point3A.x, point3A.y, point3A.z,
        point1D.x, point1D.y, point1D.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);

      indices = new Uint16Array([
           0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);

    }else if(side === 0 && side2 === 1 && side4 === 1){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point3A.x, point3A.y, point3A.z,
        point1D.x, point1D.y, point1D.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

    }else if(side === 1 && side2 === 0 && side4 === 0){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point3A.x, point3A.y, point3A.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

    }else if(side === 1 && side2 === 0 && side4 === 1){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point3A.x, point3A.y, point3A.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ])

    }else if(side === 1 && side2 === 1 && side4 === 0){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point3A.x, point3A.y, point3A.z,
        point1D.x, point1D.y, point1D.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ])

    }else if(side === 1 && side2 === 1 && side4 === 1){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point3A.x, point3A.y, point3A.z,
        point1D.x, point1D.y, point1D.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xff007f }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon3A(side, side2, side4);

  function createPolygon3B(side, side2, side4){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side2 === 0 && side4 === 0){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point2C.x, point2C.y, point2C.z,
        point2A.x, point2A.y, point2A.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 0 && side2 === 0 && side4 === 1){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point2C.x, point2C.y, point2C.z,
        point2A.x, point2A.y, point2A.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else if(side === 0 && side2 === 1 && side4 === 0){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point2C.x, point2C.y, point2C.z,
        point2A.x, point2A.y, point2A.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);

      indices = new Uint16Array([
           0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 0 && side2 === 1 && side4 === 1){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point2C.x, point2C.y, point2C.z,
        point2A.x, point2A.y, point2A.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ])

    }else if(side === 1 && side2 === 0 && side4 === 0){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point2C.x, point2C.y, point2C.z,
        point2A.x, point2A.y, point2A.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

    }else if(side === 1 && side2 === 0 && side4 === 1){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point2C.x, point2C.y, point2C.z,
        point2A.x, point2A.y, point2A.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ])

    }else if(side === 1 && side2 === 1 && side4 === 0){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point2C.x, point2C.y, point2C.z,
        point2A.x, point2A.y, point2A.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

    }else if(side === 1 && side2 === 1 && side4 === 1){
      vertices = new Float32Array([
        point3C.x, point3C.y, point3C.z,
        point2C.x, point2C.y, point2C.z,
        point2A.x, point2A.y, point2A.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point3C.x, point3C.y, point3C.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ])


    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xff007f }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon3B(side, side2, side4);

  function createPolygon3C(side, side2, side5){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side2 === 0 && side5 === 0){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point3A.x, point3A.y, point3A.z,
        point1D.x, point1D.y, point1D.z,
        point1C.x, point1C.y, point1C.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z,
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);

    }else if(side === 0 && side2 === 0 && side5 === 1){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point3A.x, point3A.y, point3A.z,
        point1D.x, point1D.y, point1D.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z,
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
      
    }else if(side === 0 && side2 === 1 && side5 === 0){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point3A.x, point3A.y, point3A.z,
        point1C.x, point1C.y, point1C.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z,
      ]);

      indices = new Uint16Array([
           0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 0 && side2 === 1 && side5 === 1){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point3A.x, point3A.y, point3A.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z,
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 0
      ])

    }else if(side === 1 && side2 === 0 && side5 === 1){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point3A.x, point3A.y, point3A.z,
        point1D.x, point1D.y, point1D.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z,
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

}else if(side === 1 && side2 === 1 && side5 === 1){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point3A.x, point3A.y, point3A.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z,
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 0
      ])

    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xff007f }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon3C(side, side2, side5);

  function createPolygon3D(side, side2, side5){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side2 === 0 && side5 === 0){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point2C.x, point2C.y, point2C.z,
        point2B.x, point2B.y, point2B.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 0 && side2 === 0 && side5 === 1){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point2C.x, point2C.y, point2C.z,
        point2B.x, point2B.y, point2B.z,
        point1C.x, point1C.y, point1C.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else if(side === 0 && side2 === 1 && side5 === 0){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point2C.x, point2C.y, point2C.z,
        point2B.x, point2B.y, point2B.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z
      ]);

      indices = new Uint16Array([
           0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 0 && side2 === 1 && side5 === 1){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point2C.x, point2C.y, point2C.z,
        point2B.x, point2B.y, point2B.z,
        point1C.x, point1C.y, point1C.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 4, 4, 0
      ])

    }else if(side === 1 && side2 === 0 && side5 === 1){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point2C.x, point2C.y, point2C.z,
        point2B.x, point2B.y, point2B.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

    }else if(side === 1 && side2 === 1 && side5 === 1){
      vertices = new Float32Array([
        point3D.x, point3D.y, point3D.z,
        point2C.x, point2C.y, point2C.z,
        point2B.x, point2B.y, point2B.z,
        point4B.x, point4B.y, point4B.z,
        point3D.x, point3D.y, point3D.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 0
      ])

    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xff007f }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon3D(side, side2, side5);

  function createPolygon3E() {
  
    // Create square Polygon from 4 points
    const squareGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      point2D.x, point2D.y, point2D.z,
      point3E.x, point3E.y, point3E.z,
      point4C.x, point4C.y, point4C.z,
      point2A.x, point2A.y, point2A.z,
      point2D.x, point2D.y, point2D.z
    ]);

    const indices = new Uint16Array([
      0, 1, 1, 2, 2, 3, 3, 0
    ]);

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xff007f }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);
  }

  createPolygon3E();

  function createPolygon3F(side, side3, side6){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side3 === 0 && side6 === 0){
      vertices = new Float32Array([
        point3E.x, point3E.y, point3E.z,
        point3B.x, point3B.y, point3B.z,
        point4C.x, point4C.y, point4C.z,
        point3E.x, point3E.y, point3E.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ]);
      
    }else if(side === 0 && side3 === 1 && side6 === 0){
      vertices = new Float32Array([
        point3E.x, point3E.y, point3E.z,
        point3B.x, point3B.y, point3B.z,
        point1A.x, point1A.y, point1A.z,
        point4C.x, point4C.y, point4C.z,
        point3E.x, point3E.y, point3E.z
      ]);

      indices = new Uint16Array([
           0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 1 && side3 === 0 && side6 === 0){
      vertices = new Float32Array([
        point3E.x, point3E.y, point3E.z,
        point3B.x, point3B.y, point3B.z,
        point4C.x, point4C.y, point4C.z,
        point3E.x, point3E.y, point3E.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ])

    }else if(side === 1 && side3 === 0 && side6 === 1){
      vertices = new Float32Array([
        point3E.x, point3E.y, point3E.z,
        point3B.x, point3B.y, point3B.z,
        point1B.x, point1B.y, point1B.z,
        point4C.x, point4C.y, point4C.z,
        point3E.x, point3E.y, point3E.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])
      
    }else if(side === 1 && side3 === 1 && side6 === 0){
      vertices = new Float32Array([
        point3E.x, point3E.y, point3E.z,
        point3B.x, point3B.y, point3B.z,
        point1A.x, point1A.y, point1A.z,
        point4C.x, point4C.y, point4C.z,
        point3E.x, point3E.y, point3E.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

    }else if(side === 1 && side3 === 1 && side6 === 1){
      vertices = new Float32Array([
        point3E.x, point3E.y, point3E.z,
        point3B.x, point3B.y, point3B.z,
        point1A.x, point1A.y, point1A.z,
        point1B.x, point1B.y, point1B.z,
        point4C.x, point4C.y, point4C.z,
        point3E.x, point3E.y, point3E.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 3,3, 4, 4, 0
      ])

    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xff007f }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon3F(side, side3, side6);

  function createPolygon3G(side, side3, side7){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side3 === 0 && side7 === 0){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point4D.x, point4D.y, point4D.z,
        point2B.x, point2B.y, point2B.z,
        point2D.x, point2D.y, point2D.z,
        point3F.x, point3F.y, point3F.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
      
    }else if(side === 0 && side3 === 1 && side7 === 0){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point4D.x, point4D.y, point4D.z,
        point2B.x, point2B.y, point2B.z,
        point2D.x, point2D.y, point2D.z,
        point3F.x, point3F.y, point3F.z
      ]);

      indices = new Uint16Array([
           0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 1 && side3 === 0 && side7 === 0){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point4D.x, point4D.y, point4D.z,
        point1C.x, point1C.y, point1C.z,
        point2B.x, point2B.y, point2B.z,
        point2D.x, point2D.y, point2D.z,
        point3F.x, point3F.y, point3F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ])

    }else if(side === 1 && side3 === 0 && side7 === 1){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point4D.x, point4D.y, point4D.z,
        point2B.x, point2B.y, point2B.z,
        point2D.x, point2D.y, point2D.z,
        point3F.x, point3F.y, point3F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])
      
    }else if(side === 1 && side3 === 1 && side7 === 0){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point4D.x, point4D.y, point4D.z,
        point1C.x, point1C.y, point1C.z,
        point2B.x, point2B.y, point2B.z,
        point2D.x, point2D.y, point2D.z,
        point3F.x, point3F.y, point3F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ])

    }else if(side === 1 && side3 === 1 && side7 === 1){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point4D.x, point4D.y, point4D.z,
        point2B.x, point2B.y, point2B.z,
        point2D.x, point2D.y, point2D.z,
        point3F.x, point3F.y, point3F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 0
      ])

    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xff007f }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon3G(side, side3, side7);

  function createPolygon3H(side, side3, side7){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side3 === 0 && side7 === 0){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point3B.x, point3B.y, point3B.z,
        point1A.x, point1A.y, point1A.z,
        point4D.x, point4D.y, point4D.z,
        point3F.x, point3F.y, point3F.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
      
    }else if(side === 0 && side3 === 1 && side7 === 0){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point3B.x, point3B.y, point3B.z,
        point4D.x, point4D.y, point4D.z,
        point3F.x, point3F.y, point3F.z
      ]);

      indices = new Uint16Array([
           0, 1, 1, 2, 2, 0
      ]);

    }else if(side === 1 && side3 === 0 && side7 === 0){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point3B.x, point3B.y, point3B.z,
        point1A.x, point1A.y, point1A.z,
        point4D.x, point4D.y, point4D.z,
        point3F.x, point3F.y, point3F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

    }else if(side === 1 && side3 === 0 && side7 === 1){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point3B.x, point3B.y, point3B.z,
        point1A.x, point1A.y, point1A.z,
        point1C.x, point1C.y, point1C.z,
        point4D.x, point4D.y, point4D.z,
        point3F.x, point3F.y, point3F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ])
      
    }else if(side === 1 && side3 === 1 && side7 === 0){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point3B.x, point3B.y, point3B.z,
        point4D.x, point4D.y, point4D.z,
        point3F.x, point3F.y, point3F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ])

    }else if(side === 1 && side3 === 1 && side7 === 1){
      vertices = new Float32Array([
        point3F.x, point3F.y, point3F.z,
        point3B.x, point3B.y, point3B.z,
        point1C.x, point1C.y, point1C.z,
        point4D.x, point4D.y, point4D.z,
        point3F.x, point3F.y, point3F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ])

    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0xff007f }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon3H(side, side3, side7);

  function createPoint4E(point3C, point4A) {

    const x = point3C.x;
    const y = (point4A.y - point3C.y) * Math.random() + point3C.y;
    const point4E = new THREE.Vector3(x, y, 0);

    return point4E;
  }

  const point4E = createPoint4E(point3C, point4A);
  drawPoint(point4E);

  function createPoint4F(point3C, point4A) {

    const x = point3C.x;
    const y = (point4A.y - point3C.y) * Math.random() + point3C.y;
    const point4F = new THREE.Vector3(x, y, 0);

    return point4F;
  }

  const point4F = createPoint4F(point3C, point4A);
  drawPoint(point4F);

  function createPoint4G(point3D, point4B) {

    const x = point3D.x;
    const y = (point3D.y - point4B.y) * Math.random() + point4B.y;
    const point4G = new THREE.Vector3(x, y, 0);

    return point4G;
  }

  const point4G = createPoint4G(point3D, point4B);
  drawPoint(point4G);

  function createPoint4H(point3D, point4B) {

    const x = point3D.x;
    const y = (point3D.y - point4B.y) * Math.random() + point4B.y;
    const point4H = new THREE.Vector3(x, y, 0);

    return point4H;
  }

  const point4H = createPoint4H(point3D, point4B);
  drawPoint(point4H);
  
  function createPoint4I(point3E, point4C) {

    const x = point3E.x;
    const y = (point4C.y - point3E.y) * Math.random() + point3E.y;
    const point4I = new THREE.Vector3(x, y, 0);

    return point4I;
  }

  const point4I = createPoint4I(point3E, point4C);
  drawPoint(point4I);

  function createPoint4J(point3E, point4C) {

    const x = point3E.x;
    const y = (point4C.y - point3E.y) * Math.random() + point3E.y;
    const point4J = new THREE.Vector3(x, y, 0);

    return point4J;
  }

  const point4J = createPoint4J(point3E, point4C);
  drawPoint(point4J);

  function createPoint4K(point3F, point4D) {

    const x = point3F.x;
    const y = (point3F.y - point4D.y) * Math.random() + point4D.y;
    const point4K = new THREE.Vector3(x, y, 0);

    return point4K;
  }

  const point4K = createPoint4K(point3F, point4D);
  drawPoint(point4K);

  function createPoint4L(point3F, point4D) {

    const x = point3F.x;
    const y = (point3F.y - point4D.y) * Math.random() + point4D.y;
    const point4L = new THREE.Vector3(x, y, 0);

    return point4L;
  }

  const point4L = createPoint4L(point3F, point4D);
  drawPoint(point4L);

  function createPoint5A(){
    let point5A;
    let side8;
    if (point4E.y > point1D.y)
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1B.y) / (point1D.x - point1B.x);
    // x Abstand P2A - P1A
    const dy2 = point4E.y - point1B.y;
    const x2 = point1B.x + dy2 / m1;
    point5A = new THREE.Vector3(x2, point4E.y, 0);
    side8 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1C.y) / (point1D.x - point1C.x);
    // x Abstand P2A - P1A
    const dy2 = point4E.y - point1C.y;
    const x2 = point1C.x + dy2 / m1;
    point5A = new THREE.Vector3(x2, point4E.y, 0);
    side8 = 1;
    }
    
    return {point5A, side8};
  }
  const { point5A, side8 } = createPoint5A();
  drawPoint(point5A);
  console.log('Side 8:', side8);

  function createPoint5B(){
    let point5B;
    let side9;
    if (point4F.y > point2A.y)
    {
    // Steigung P1A - P1C
    const m1 = (point1B.y - point1A.y) / (point1B.x - point1A.x);
    // x Abstand P2A - P1A
    const dy2 = point4F.y - point1A.y;
    const x2 = point1A.x + dy2 / m1;
    point5B = new THREE.Vector3(x2, point4F.y, 0);
    side9 = 0;
    }
    else
    {
    point5B = new THREE.Vector3(point2A.x, point4F.y, 0);
    side9 = 1;
    }
    
    return {point5B, side9};
  }
  const { point5B, side9 } = createPoint5B();
  drawPoint(point5B);
  console.log('Side 9:', side9);

  function createPoint5C(){
    let point5C;
    let side10;
    if (point4G.y > point1D.y)
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1B.y) / (point1D.x - point1B.x);
    // x Abstand P2A - P1A
    const dy2 = point4G.y - point1B.y;
    const x2 = point1B.x + dy2 / m1;
    point5C = new THREE.Vector3(x2, point4G.y, 0);
    side10 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1D.y - point1C.y) / (point1D.x - point1C.x);
    // x Abstand P2A - P1A
    const dy2 = point4G.y - point1C.y;
    const x2 = point1C.x + dy2 / m1;
    point5C = new THREE.Vector3(x2, point4G.y, 0);
    side10 = 1;
    }
    
    return {point5C, side10};
  }
  const { point5C, side10 } = createPoint5C();
  drawPoint(point5C);
  console.log('Side 10:', side10);

  function createPoint5D(){
    let point5D;
    let side11;
    if (point4H.y < point2B.y)
    {
    // Steigung P1A - P1C
    const m1 = (point1C.y - point1A.y) / (point1C.x - point1A.x);
    // x Abstand P2A - P1A
    const dy2 = point4H.y - point1A.y;
    const x2 = point1A.x + dy2 / m1;
    point5D = new THREE.Vector3(x2, point4H.y, 0);
    side11 = 0;
    }
    else
    {
    point5D = new THREE.Vector3(point2B.x, point4H.y, 0);
    side11 = 1;
    }
    
    return {point5D, side11};
  }
  const { point5D, side11 } = createPoint5D();
  drawPoint(point5D);
  console.log('Side 11:', side11);
  
  const point5E = new THREE.Vector3(point2A.x, point4I.y, 0);
  drawPoint(point5E);

  function createPoint5F(){
    let point5F;
    let side12;
    if (point4J.y > point1A.y)
    {
    // Steigung P1A - P1C
    const m1 = (point1B.y - point1A.y) / (point1B.x - point1A.x);
    // x Abstand P2A - P1A
    const dy2 = point4J.y - point1A.y;
    const x2 = point1A.x + dy2 / m1;
    point5F = new THREE.Vector3(x2, point4J.y, 0);
    side12 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1C.y - point1A.y) / (point1C.x - point1A.x);
    // x Abstand P2A - P1A
    const dy2 = point4J.y - point1A.y;
    const x2 = point1A.x + dy2 / m1;
    point5F= new THREE.Vector3(x2, point4J.y, 0);
    side12 = 1;
    }
    
    return {point5F, side12};
  }
  const { point5F, side12 } = createPoint5F();
  drawPoint(point5F);
  console.log('Side 12:', side12);

  function createPoint5G(){
    let point5G;
    let side13;
    if (point4K.y < point2B.y){
      // Steigung P1A - P1C
      const m1 = (point1D.y - point1C.y) / (point1D.x - point1C.x);
      // x Abstand P2A - P1A
      const dy2 = point4K.y - point1C.y;
      const x2 = point1C.x + dy2 / m1;
      point5G = new THREE.Vector3(x2, point4K.y, 0);
      side13 = 0;
    }
    else
    {
      point5G = new THREE.Vector3(point2B.x, point4K.y, 0);
      side13 = 1;
    }
    
    return {point5G, side13};
  }
  const { point5G, side13 } = createPoint5G();
  drawPoint(point5G);
  console.log('Side 13:', side13);

  function createPoint5H(){
    let point5H;
    let side14;
    if (point4L.y > point1A.y)
    {
    // Steigung P1A - P1C
    const m1 = (point1B.y - point1A.y) / (point1B.x - point1A.x);
    // x Abstand P2A - P1A
    const dy2 = point4L.y - point1A.y;
    const x2 = point1A.x + dy2 / m1;
    point5H = new THREE.Vector3(x2, point4L.y, 0);
    side14 = 0;
    }
    else
    {
    // Steigung P1A - P1C
    const m1 = (point1C.y - point1A.y) / (point1C.x - point1A.x);
    // x Abstand P2A - P1A
    const dy2 = point4L.y - point1A.y;
    const x2 = point1A.x + dy2 / m1;
    point5H = new THREE.Vector3(x2, point4L.y, 0);
    side14 = 1;
    }
    
    return {point5H, side14};
  }
  const { point5H, side14 } = createPoint5H();
  drawPoint(point5H);
  console.log('Side 14:', side14);

  function createPolygon4A(side4, side8){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side4 === 0 && side8 === 0){
      vertices = new Float32Array([
        point4E.x, point4E.y, point4E.z,
        point5A.x, point5A.y, point5A.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point4E.x, point4E.y, point4E.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side4 === 0 && side8 === 1){
      vertices = new Float32Array([
        point4E.x, point4E.y, point4E.z,
        point5A.x, point5A.y, point5A.z,
        point1D.x, point1D.y, point1D.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point4E.x, point4E.y, point4E.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else if(side4 === 1 && side8 === 0){
      vertices = new Float32Array([
        point4E.x, point4E.y, point4E.z,
        point5A.x, point5A.y, point5A.z,
        point4A.x, point4A.y, point4A.z,
        point4E.x, point4E.y, point4E.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ]);

    }else if(side4 === 1 && side8 === 1){
      vertices = new Float32Array([
        point4E.x, point4E.y, point4E.z,
        point5A.x, point5A.y, point5A.z,
        point1D.x, point1D.y, point1D.z,
        point4A.x, point4A.y, point4A.z,
        point4E.x, point4E.y, point4E.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4A(side4, side8);

  function createPolygon4B(side4, side9){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if(side4 === 0 && side9 === 0){
      vertices = new Float32Array([
        point4F.x, point4F.y, point4F.z,
        point5B.x, point5B.y, point5B.z,
        point4A.x, point4A.y, point4A.z,
        point4F.x, point4F.y, point4F.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 0
      ]);

    }else if(side4 === 0 && side9 === 1){
      vertices = new Float32Array([
        point4F.x, point4F.y, point4F.z,
        point5B.x, point5B.y, point5B.z,
        point2A.x, point2A.y, point2A.z,
        point4A.x, point4A.y, point4A.z,
        point4F.x, point4F.y, point4F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
      
    }else if(side4 === 1 && side9 === 0){
      vertices = new Float32Array([
        point4F.x, point4F.y, point4F.z,
        point5B.x, point5B.y, point5B.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point4F.x, point4F.y, point4F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side4 === 1 && side9 === 1){
      vertices = new Float32Array([
        point4F.x, point4F.y, point4F.z,
        point5B.x, point5B.y, point5B.z,
        point2A.x, point2A.y, point2A.z,
        point1B.x, point1B.y, point1B.z,
        point4A.x, point4A.y, point4A.z,
        point4F.x, point4F.y, point4F.z
      ]);
  
      indices = new Uint16Array([
        0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4B(side4, side9);

  function createPolygon4C(side2, side8){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if(side2 === 0 && side8 === 0){
      vertices = new Float32Array([
        point4E.x, point4E.y, point4E.z,
        point5A.x, point5A.y, point5A.z,
        point3A.x, point3A.y, point3A.z,
        point3C.x, point3C.y, point3C.z,
        point4E.x, point4E.y, point4E.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 0
      ]);

    }else if(side2 === 1 && side8 === 0){
      vertices = new Float32Array([
        point4E.x, point4E.y, point4E.z,
        point5A.x, point5A.y, point5A.z,
        point1D.x, point1D.y, point1D.z,
        point3A.x, point3A.y, point3A.z,
        point3C.x, point3C.y, point3C.z,
        point4E.x, point4E.y, point4E.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else if(side2 === 1 && side8 === 1){
      vertices = new Float32Array([
        point4E.x, point4E.y, point4E.z,
        point5A.x, point5A.y, point5A.z,
        point3A.x, point3A.y, point3A.z,
        point3C.x, point3C.y, point3C.z,
        point4E.x, point4E.y, point4E.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4C(side2, side8);

  function createPolygon4D(side9){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if(side9 === 0){
      vertices = new Float32Array([
        point4F.x, point4F.y, point4F.z,
        point5B.x, point5B.y, point5B.z,
        point2A.x, point2A.y, point2A.z,
        point2C.x, point2C.y, point2C.z,
        point3C.x, point3C.y, point3C.z,
        point4F.x, point4F.y, point4F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else{
      vertices = new Float32Array([
        point4F.x, point4F.y, point4F.z,
        point5B.x, point5B.y, point5B.z,
        point2C.x, point2C.y, point2C.z,
        point3C.x, point3C.y, point3C.z,
        point4F.x, point4F.y, point4F.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4D(side9);

  function createPolygon4E(side2, side10){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if(side2 === 0 && side10 === 0){
      vertices = new Float32Array([
        point4G.x, point4G.y, point4G.z,
        point5C.x, point5C.y, point5C.z,
        point3A.x, point3A.y, point3A.z,
        point3D.x, point3D.y, point3D.z,
        point4G.x, point4G.y, point4G.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 0
      ]);

    }else if(side2 === 0 && side10 === 1){
      vertices = new Float32Array([
        point4G.x, point4G.y, point4G.z,
        point5C.x, point5C.y, point5C.z,
        point1D.x, point1D.y, point1D.z,
        point3A.x, point3A.y, point3A.z,
        point3D.x, point3D.y, point3D.z,
        point4G.x, point4G.y, point4G.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else if(side2 === 1 && side10 === 1){
      vertices = new Float32Array([
        point4G.x, point4G.y, point4G.z,
        point5C.x, point5C.y, point5C.z,
        point3A.x, point3A.y, point3A.z,
        point3D.x, point3D.y, point3D.z,
        point4G.x, point4G.y, point4G.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4E(side2, side10);

  function createPolygon4G(side5, side10){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if(side5 === 0 && side10 === 0){
      vertices = new Float32Array([
        point4G.x, point4G.y, point4G.z,
        point5C.x, point5C.y, point5C.z,
        point1D.x, point1D.y, point1D.z,
        point1C.x, point1C.y, point1C.z,
        point4B.x, point4B.y, point4B.z,
        point4G.x, point4G.y, point4G.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 4, 4, 0
      ]);

    }else if(side5 === 0 && side10 === 1){
      vertices = new Float32Array([
        point4G.x, point4G.y, point4G.z,
        point5C.x, point5C.y, point5C.z,
        point1C.x, point1C.y, point1C.z,
        point4B.x, point4B.y, point4B.z,
        point4G.x, point4G.y, point4G.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 0
      ]);
      
    }else if(side5 === 1 && side10 === 0){
      vertices = new Float32Array([
        point4G.x, point4G.y, point4G.z,
        point5C.x, point5C.y, point5C.z,
        point1D.x, point1D.y, point1D.z,
        point4B.x, point4B.y, point4B.z,
        point4G.x, point4G.y, point4G.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side5 === 1 && side10 === 1){
      vertices = new Float32Array([
        point4G.x, point4G.y, point4G.z,
        point5C.x, point5C.y, point5C.z,
        point4B.x, point4B.y, point4B.z,
        point4G.x, point4G.y, point4G.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4G(side5, side10);

  function createPolygon4F(side11){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if(side11 === 0){
      vertices = new Float32Array([
        point4H.x, point4H.y, point4H.z,
        point5D.x, point5D.y, point5D.z,
        point2B.x, point2B.y, point2B.z,
        point2C.x, point2C.y, point2C.z,
        point3D.x, point3D.y, point3D.z,
        point4H.x, point4H.y, point4H.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else{
      vertices = new Float32Array([
        point4H.x, point4H.y, point4H.z,
        point5D.x, point5D.y, point5D.z,
        point2C.x, point2C.y, point2C.z,
        point3D.x, point3D.y, point3D.z,
        point4H.x, point4H.y, point4H.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4F(side11);

  function createPolygon4H(side, side5){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side5 === 0){
      vertices = new Float32Array([
        point4H.x, point4H.y, point4H.z,
        point5D.x, point5D.y, point5D.z,
        point2B.x, point2B.y, point2B.z,
        point4B.x, point4B.y, point4B.z,
        point4H.x, point4H.y, point4H.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 0 && side5 === 1){
      vertices = new Float32Array([
        point4H.x, point4H.y, point4H.z,
        point5D.x, point5D.y, point5D.z,
        point2B.x, point2B.y, point2B.z,
        point1C.x, point1C.y, point1C.z,
        point4B.x, point4B.y, point4B.z,
        point4H.x, point4H.y, point4H.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else if(side === 1 && side5 === 1){
      vertices = new Float32Array([
        point4H.x, point4H.y, point4H.z,
        point5D.x, point5D.y, point5D.z,
        point2B.x, point2B.y, point2B.z,
        point4B.x, point4B.y, point4B.z,
        point4H.x, point4H.y, point4H.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4H(side, side5);

  function createPolygon4I(){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

      vertices = new Float32Array([
        point5E.x, point5E.y, point5E.z,
        point4I.x, point4I.y, point4I.z,
        point4C.x, point4C.y, point4C.z,
        point2A.x, point2A.y, point2A.z,
        point5E.x, point5E.y, point5E.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 0
      ]);

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);
  }
  createPolygon4I();

  function createPolygon4K(){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

      vertices = new Float32Array([
        point5E.x, point5E.y, point5E.z,
        point4I.x, point4I.y, point4I.z,
        point3E.x, point3E.y, point3E.z,
        point2D.x, point2D.y, point2D.z,
        point5E.x, point5E.y, point5E.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 0
      ]);

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);
  }
  createPolygon4K();

  function createPolygon4J(side12){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side12 === 0){
      vertices = new Float32Array([
        point4J.x, point4J.y, point4J.z,
        point5F.x, point5F.y, point5F.z,
        point4C.x, point4C.y, point4C.z,
        point4J.x, point4J.y, point4J.z,
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ]);

    }else{
      vertices = new Float32Array([
        point4J.x, point4J.y, point4J.z,
        point5F.x, point5F.y, point5F.z,
        point1A.x, point1A.y, point1A.z,
        point4C.x, point4C.y, point4C.z,
        point4J.x, point4J.y, point4J.z,
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4J(side12);

  function createPolygon4L(side3, side12){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if(side3 === 0 && side12 === 0){
      vertices = new Float32Array([
        point4J.x, point4J.y, point4J.z,
        point5F.x, point5F.y, point5F.z,
        point3B.x, point3B.y, point3B.z,
        point3E.x, point3E.y, point3E.z,
        point4J.x, point4J.y, point4J.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 0
      ]);

    }else if(side3 === 1 && side12 === 0){
      vertices = new Float32Array([
        point4J.x, point4J.y, point4J.z,
        point5F.x, point5F.y, point5F.z,
        point1A.x, point1A.y, point1A.z,
        point3B.x, point3B.y, point3B.z,
        point3E.x, point3E.y, point3E.z,
        point4J.x, point4J.y, point4J.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else if(side3 === 1 && side12 === 1){
      vertices = new Float32Array([
        point4J.x, point4J.y, point4J.z,
        point5F.x, point5F.y, point5F.z,
        point3B.x, point3B.y, point3B.z,
        point3E.x, point3E.y, point3E.z,
        point4J.x, point4J.y, point4J.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4L(side3, side12);

  function createPolygon4M(side13){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side13 === 0){  
      vertices = new Float32Array([
        point5G.x, point5G.y, point5G.z,
        point4K.x, point4K.y, point4K.z,
        point3F.x, point3F.y, point3F.z,
        point2D.x, point2D.y, point2D.z,
        point2B.x, point2B.y, point2B.z,
        point5G.x, point5G.y, point5G.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);

    }else{
      vertices = new Float32Array([
          point5G.x, point5G.y, point5G.z,
          point4K.x, point4K.y, point4K.z,
          point3F.x, point3F.y, point3F.z,
          point2D.x, point2D.y, point2D.z,
          point5G.x, point5G.y, point5G.z
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0
        ]);
    }
    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);
  }
  
  createPolygon4M();

  function createPolygon4N(side3, side14){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if(side3 === 0 && side14 === 0){
      vertices = new Float32Array([
        point4L.x, point4L.y, point4L.z,
        point5H.x, point5H.y, point5H.z,
        point3B.x, point3B.y, point3B.z,
        point3F.x, point3F.y, point3F.z,
        point4L.x, point4L.y, point4L.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 3, 3, 0
      ]);

    }else if(side3 === 0 && side14 === 1){
      vertices = new Float32Array([
        point4L.x, point4L.y, point4L.z,
        point5H.x, point5H.y, point5H.z,
        point1A.x, point1A.y, point1A.z,
        point3B.x, point3B.y, point3B.z,
        point3F.x, point3F.y, point3F.z,
        point4L.x, point4L.y, point4L.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else if(side3 === 1 && side14 === 1){
      vertices = new Float32Array([
        point4L.x, point4L.y, point4L.z,
        point5H.x, point5H.y, point5H.z,
        point3B.x, point3B.y, point3B.z,
        point3F.x, point3F.y, point3F.z,
        point4L.x, point4L.y, point4L.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4N(side3, side14);

  function createPolygon4O(side, side7){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side === 0 && side7 === 0){
      vertices = new Float32Array([
        point4K.x, point4K.y, point4K.z,
        point5G.x, point5G.y, point5G.z,
        point2B.x, point2B.y, point2B.z,
        point4D.x, point4D.y, point4D.z,
        point4K.x, point4K.y, point4K.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side === 1 && side7 === 0){
      vertices = new Float32Array([
        point4K.x, point4K.y, point4K.z,
        point5G.x, point5G.y, point5G.z,
        point2B.x, point2B.y, point2B.z,
        point1C.x, point1C.y, point1C.z,
        point4D.x, point4D.y, point4D.z,
        point4K.x, point4K.y, point4K.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
      
    }else if(side === 1 && side7 === 1){
      vertices = new Float32Array([
        point4K.x, point4K.y, point4K.z,
        point5G.x, point5G.y, point5G.z,
        point2B.x, point2B.y, point2B.z,
        point4D.x, point4D.y, point4D.z,
        point4K.x, point4K.y, point4K.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4O(side, side7);

  function createPolygon4P(side7, side14){

    const squareGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    if (side7 === 0 && side14 === 0){
      vertices = new Float32Array([
        point4L.x, point4L.y, point4L.z,
        point5H.x, point5H.y, point5H.z,
        point1A.x, point1A.y, point1A.z,
        point4D.x, point4D.y, point4D.z,
        point4L.x, point4L.y, point4L.z
      ]);

      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side7 === 0 && side14 === 1){
      vertices = new Float32Array([
        point4L.x, point4L.y, point4L.z,
        point5H.x, point5H.y, point5H.z,
        point4D.x, point4D.y, point4D.z,
        point4L.x, point4L.y, point4L.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ]);
      
    }else if(side7 === 1 && side14 === 0){
      vertices = new Float32Array([
        point4L.x, point4L.y, point4L.z,
        point5H.x, point5H.y, point5H.z,
        point1C.x, point1C.y, point1C.z,
        point4D.x, point4D.y, point4D.z,
        point4L.x, point4L.y, point4L.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);

    }else if(side7 === 1 && side14 === 1){
      vertices = new Float32Array([
        point4L.x, point4L.y, point4L.z,
        point5H.x, point5H.y, point5H.z,
        point1A.x, point1A.y, point1A.z,
        point1C.x, point1C.y, point1C.z,
        point4D.x, point4D.y, point4D.z,
        point4L.x, point4L.y, point4L.z
      ]);
  
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
    }

    squareGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const squareMaterial = new THREE.LineBasicMaterial({ color: 0x7DF9FF }); // White color, you can change it
    const squareMesh = new THREE.Line(squareGeometry, squareMaterial);
    scene.add(squareMesh);

  }

  createPolygon4P(side7, side14);
  
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