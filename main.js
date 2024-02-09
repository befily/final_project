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

function createPoint(point) {
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

  // GEOMETRY INITIATIONth
  
  // GUI SETUP
  gui = new GUI();

  // RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);

  // CREATE RENDERER
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0xC70039); 
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);

  // CREATE MOUSE CONTROL
  control = new OrbitControls(camera, renderer.domElement);

  // EXECUTE THE UPDATE
  animate();

  // Call initialSquare and chooseRandomPoints once
  const { point1, point2, point3, point4 } = initialSquare();
  const { point5 } = choosePoint5();
  const { point6 } = choosePoint6();

  // Create the first square
  createSquare(point1, point2, point3, point4);

  

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

    // Initialize variables to store the random points
    let point5, sideName;

    // Generate random point5 from top or left side
    switch (side) {
      case 0: // Top side
        point5 = new THREE.Vector3(Math.random() * parameters.squareSize - halfSize, halfSize, 0);
        sideName = 'top';
        break;
      case 1: // Left side
        point5 = new THREE.Vector3(-halfSize, Math.random() * parameters.squareSize - halfSize, 0);
        sideName = 'left';
        break;
    }

    // Place small point at point5
    createPoint(point5);

    console.log ('Point 5:', sideName);

    return { point5, side1: sideName  };
  }

  //choosePoint5();

  function choosePoint6() {
    // Define the size of the square
    const halfSize = parameters.squareSize / 2;

    // Select a random side of the square (bottom or left)
    const side = Math.floor(Math.random() * 2); // 0: bottom, 1: left

    // Initialize variables to store the random points
    let point6, sideName;

    // Generate random point 6
    switch (side) {
      case 0: // Bottom side
        point6 = new THREE.Vector3(Math.random() * parameters.squareSize - halfSize, -halfSize, 0);
        sideName = 'bottom';
        break;
      case 1: // Left side
        point6 = new THREE.Vector3(halfSize, Math.random() * parameters.squareSize - halfSize, 0);
        sideName = 'right';
        break;
    }
    

    // Place small points at point5 and point6
    createPoint(point6);

    console.log ('Point 6:', sideName);

    return { point6, side2: sideName };
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


function createSecondPolygon(point1, point3, point5, point6) {
    // Create the geometry for the second polygon
    const secondPolygonGeometry = new THREE.BufferGeometry();
    let vertices, indices;

    // Check the sides of point5 and point6
    //if (point5.side1 === 'top' && point6.side2 === 'bottom') {
        vertices = new Float32Array([
            point1.x, point1.y, point1.z,
            point5.x, point5.y, point5.z,
            point6.x, point6.y, point6.z,
            point3.x, point3.y, point3.z,
            point1.x, point1.y, point1.z // closing the loop
        ]);

        indices = new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 4, 4, 0
        ]);
      //} else {
        // Handle other cases or provide a default behavior
        //console.log('Invalid combination of sides for creating the second polygon.');
        //return; // Exit the function if sides don't match
    //}
  
    // Set attributes and indices for the geometry
    secondPolygonGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    secondPolygonGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
  
    // Create a material for the second polygon
    const secondPolygonMaterial = new THREE.LineBasicMaterial({ color: 0x4fa75a });
  
    // Create the mesh for the second polygon
    const secondPolygonMesh = new THREE.Line(secondPolygonGeometry, secondPolygonMaterial);
  
    // Add the second polygon mesh to the scene
    scene.add(secondPolygonMesh);
}

  createSecondPolygon(point1, point3, point5, point6);

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