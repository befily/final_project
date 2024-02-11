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
  const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x5b2c6f }); // Red color, you can change it
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

  // Call initialSquare and chooseRandomPoints once
  const { point1, point2, point3, point4 } = initialSquare();
  const { point5, side1 } = choosePoint5();
  const { point6, side2 } = choosePoint6();
  const point7 = choosePoint7(point5, point6);

  // Create the first square
  //createSquare(point1, point2, point3, point4);

  createPoint7And8(point5, point6);

  function initialSquare() {
    const halfSize = parameters.squareSize / 2;

    // Define the corner points of the square
    const point1 = new THREE.Vector3(-halfSize, halfSize, 0);
    const point2 = new THREE.Vector3(halfSize, halfSize, 0);
    const point3 = new THREE.Vector3(-halfSize, -halfSize, 0);
    const point4 = new THREE.Vector3(halfSize, -halfSize, 0);

    return { point1, point2, point3, point4 };
  }

  function choosePoint5() {

    // Define the size of the square
    const halfSize = parameters.squareSize / 2;

    // Select a random side of the square (top or right)
    const side = Math.floor(Math.random() * 2); // 0: top, 1: left

    // Declare variables to store the random points
    let point5, side1;

    // Generate random point5 from top or left side
    switch (side) {
      case 0: // Top side
        point5 = new THREE.Vector3(Math.random() * parameters.squareSize - halfSize, halfSize, 0);
        side1 = 'top';
        break;
      case 1: // Left side
        point5 = new THREE.Vector3(-halfSize, Math.random() * parameters.squareSize - halfSize, 0);
        side1 = 'left';
        break;
    }

    // Place small point at point5
    drawPoint(point5);

    console.log ('Point 5:', side1);

    return { point5, side1  };
  }


  function choosePoint6() {
    // Define the size of the square
    const halfSize = parameters.squareSize / 2;

    // Select a random side of the square (bottom or left)
    const side = Math.floor(Math.random() * 2); // 0: bottom, 1: left

    // Initialize variables to store the random points
    let point6, side2;

    // Generate random point 6
    switch (side) {
      case 0: // Bottom side
        point6 = new THREE.Vector3(Math.random() * parameters.squareSize - halfSize, -halfSize, 0);
        side2 = 'bottom';
        break;
      case 1: // Left side
        point6 = new THREE.Vector3(halfSize, Math.random() * parameters.squareSize - halfSize, 0);
        side2 = 'right';
        break;
    }
    

    // Place small points at point5 and point6
    drawPoint(point6);

    console.log ('Point 6:', side2);

    return { point6, side2 };
  }

  //choosePoint6();

  function createSquare(point1, point2, point3, point4) {
  
    // Create square Polygon from 4 points
    const squareGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      point1.x, point1.y, point1.z,
      point2.x, point2.y, point2.z,
      point4.x, point4.y, point4.z,
      point3.x, point3.y, point3.z,
      point1.x, point1.y, point1.z // closing the loop
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



  function createSecondPolygon() {
    let secondPolygonGeometry;
    let vertices;
    let indices;

    // Check the sides of point5 and point6
    if (side1 === 'top' && side2 === 'bottom') {
      // Create the geometry for the second polygon
      secondPolygonGeometry = new THREE.BufferGeometry();
      vertices = new Float32Array([
          point1.x, point1.y, point1.z,
          point5.x, point5.y, point5.z,
          point6.x, point6.y, point6.z,
          point3.x, point3.y, point3.z,
          point1.x, point1.y, point1.z // closing the loop
      ]);
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
        ]);
    } 
    
    else if (side1 === 'top' && side2 === 'right') {
      // Create the geometry for the second polygon
      secondPolygonGeometry = new THREE.BufferGeometry();
      vertices = new Float32Array([
          point1.x, point1.y, point1.z,
          point5.x, point5.y, point5.z,
          point6.x, point6.y, point6.z,
          point4.x, point4.y, point4.z,
          point3.x, point3.y, point3.z,
          point1.x, point1.y, point1.z // closing the loop
      ]);
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
    } 

    else if (side1 === 'left' && side2 === 'right') {
      // Create the geometry for the second polygon
      secondPolygonGeometry = new THREE.BufferGeometry();
      vertices = new Float32Array([
          point1.x, point1.y, point1.z,
          point2.x, point2.y, point2.z,
          point6.x, point6.y, point6.z,
          point5.x, point5.y, point5.z,
          point1.x, point1.y, point1.z // closing the loop
      ]);
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    else if (side1 === 'left' && side2 === 'bottom') {
      // Create the geometry for the second polygon
      secondPolygonGeometry = new THREE.BufferGeometry();
      vertices = new Float32Array([
          point5.x, point5.y, point5.z,
          point6.x, point6.y, point6.z,
          point3.x, point3.y, point3.z,
          point5.x, point5.y, point5.z // closing the loop
      ]);
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 0
      ]);
    }


    // Set attributes and indices for the geometry
    secondPolygonGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    secondPolygonGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // Create a material for the second polygon
    const secondPolygonMaterial = new THREE.LineBasicMaterial({ color: 0x4fa75a });

    // Create the mesh for the second polygon
    const secondPolygonMesh = new THREE.Line(secondPolygonGeometry, secondPolygonMaterial);

    // Add the second polygon mesh to the scene
    scene.add(secondPolygonMesh);

    return secondPolygonGeometry;
  }

  createSecondPolygon();

  // Call createSecondPolygon to get the geometry of the second polygon
const secondPolygonGeometry = createSecondPolygon();

// Extract vertices from the geometry to define the polygon boundary
const positions = secondPolygonGeometry.getAttribute('position');
const count = positions.count;
const polygonBoundary = [];
for (let i = 0; i < count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positions, i);
    polygonBoundary.push(vertex);
}



  function createThirdPolygon() {
    let secondPolygonGeometry;
    let vertices;
    let indices;

    // Check the sides of point5 and point6
    if (side1 === 'top' && side2 === 'bottom') {
      // Create the geometry for the second polygon
      secondPolygonGeometry = new THREE.BufferGeometry();
      vertices = new Float32Array([
          point5.x, point5.y, point5.z,
          point2.x, point2.y, point2.z,
          point4.x, point4.y, point4.z,
          point6.x, point6.y, point6.z,
          point5.x, point5.y, point5.z // closing the loop
      ]);
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
        ]);
    } 
    
    else if (side1 === 'top' && side2 === 'right') {
      // Create the geometry for the second polygon
      secondPolygonGeometry = new THREE.BufferGeometry();
      vertices = new Float32Array([
          point5.x, point5.y, point5.z,
          point2.x, point2.y, point2.z,
          point6.x, point6.y, point6.z,
          point5.x, point5.y, point5.z // closing the loop
      ]);
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 0
      ]);
    } 

    else if (side1 === 'left' && side2 === 'right') {
      // Create the geometry for the second polygon
      secondPolygonGeometry = new THREE.BufferGeometry();
      vertices = new Float32Array([
          point5.x, point5.y, point5.z,
          point6.x, point6.y, point6.z,
          point4.x, point4.y, point4.z,
          point3.x, point3.y, point3.z,
          point5.x, point5.y, point5.z // closing the loop
      ]);
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0
      ]);
    }

    else if (side1 === 'left' && side2 === 'bottom') {
      // Create the geometry for the second polygon
      secondPolygonGeometry = new THREE.BufferGeometry();
      vertices = new Float32Array([
          point5.x, point5.y, point5.z,
          point1.x, point1.y, point1.z,
          point2.x, point2.y, point2.z,
          point4.x, point4.y, point4.z,
          point6.x, point6.y, point6.z,
          point5.x, point5.y, point5.z // closing the loop
      ]);
      indices = new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0
      ]);
    }


    // Set attributes and indices for the geometry
    secondPolygonGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    secondPolygonGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // Create a material for the second polygon
    const secondPolygonMaterial = new THREE.LineBasicMaterial({ color: 0xFF0066 });

    // Create the mesh for the second polygon
    const secondPolygonMesh = new THREE.Line(secondPolygonGeometry, secondPolygonMaterial);

    // Add the second polygon mesh to the scene
    scene.add(secondPolygonMesh);
  }

  createThirdPolygon();

  function choosePoint7(point5, point6) {

    // Generate a random value between 0 and 1
    const t = Math.random();

    // Calculate the coordinates of the random point
    const x = point5.x + t * (point6.x - point5.x);
    const y = point5.y + t * (point6.y - point5.y);
    const z = point5.z + t * (point6.z - point5.z);

    // Create a vector for the random point
    const point7 = new THREE.Vector3(x, y, z);
    
    return point7;
  }

  function createPoint7And8(point5, point6) {
    // Generate point7 first
  
    // Generate point8 with a minimum distance from point7
    let point8;
    do {
        point8 = choosePoint7(point5, point6);
    } while (point7.distanceTo(point8) < 0.05); // Repeat until point8 is far enough from point7
    
    console.log('Points 7 and 8:', point7, point8);

    drawPoint(point7);
    drawPoint(point8);

    return point8;
  }

  // Function to calculate angle in degrees between point5 and point6
  function calculateInitialAngle(point5, point6) {
    // Calculate the differences in coordinates
    const dx = point6.x - point5.x;
    const dy = point6.y - point5.y;

    // Use atan2 to get the angle in radians
    const angleRadians = Math.atan2(dy, dx);

    // Convert radians to degrees
    const angleDegrees = THREE.MathUtils.radToDeg(angleRadians);

    // Ensure the angle is between 0 and 360 degrees
    const positiveAngle = angleDegrees >= 0 ? angleDegrees : angleDegrees + 360;

    return positiveAngle;
  }

  // Call the function with point5 and point6
  const initialAngle = calculateInitialAngle(point5, point6);
  console.log("Angle between point5 and point6:", initialAngle, "degrees");


  const newAngle = initialAngle + 90; // Adding 90 degrees in radians
  const newVector = createVectorFromAngle(newAngle);
  newVector.add(point7); // Set the starting point of the vector to point7


  function createVectorFromAngle(newAngle) {
    // Convert angle from degrees to radians
    const angleRadians = THREE.MathUtils.degToRad(newAngle);

    // Calculate the components of the vector
    const x = Math.cos(angleRadians); // X-component
    const y = Math.sin(angleRadians); // Y-component

    // Create and return the vector
    const vector = new THREE.Vector3(x, y, 0);
    
    console.log('Vector:', vector);
    return vector;
  }

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