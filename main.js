import './style.css';
import THREEx from './threex.bubble';
import * as THREE from 'three';
import Fish from './fish';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(95, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// const pointLight1 = new THREE.PointLight(0Xffffff);
// pointLight1.position.set(0,10,5);
// const pointLight2 = new THREE.PointLight(0Xffffff);
// pointLight2.position.set(-20,10,5);
// const pointLight3 = new THREE.PointLight(0Xffffff);
// pointLight3.position.set(20,10,5);
const ambientight = new THREE.AmbientLight(0Xffffff);

// scene.add(pointLight1);
// scene.add(pointLight2);
// scene.add(pointLight3);
// const directionLight = new THREE.DirectionalLight(0X3EADCA);
// directionLight.position.set( 0, 1, 2 ).normalize();
scene.add(ambientight);

renderer.render(scene, camera);

const waterTexture2 = new THREE.CubeTextureLoader().setPath('/')
  .load(['underwater-background-square.jpg','underwater-background-square.jpg','underwater-background-square.jpg','underwater-background-square.jpg','underwater-background-square.jpg','underwater-background-square.jpg']);

const waterTexture = new THREE.TextureLoader().load('/underwater-background-square.jpg');
scene.background = waterTexture;

let fishes = [];

function animate() {
  requestAnimationFrame(animate);
  fishes.forEach(fish => {
    fish.animate();
  })
  renderer.render(scene, camera);
}


function addBubble(isBottomOfPage = false) {
  const geomatry = new THREE.SphereGeometry(0.25, 25, 25);
  const bubbleMaterial = new THREEx.BubbleMaterial(waterTexture2);
  const bubble = new THREE.Mesh(geomatry, bubbleMaterial);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(50));
  if (!isBottomOfPage) {
    bubble.position.set(x,y,z);
  } else {
    bubble.position.set(x,-35,z);
  }
  scene.add(bubble);
  animateBubble(bubble);
}

function animateBubble(bubble) {
  bubble.position.y += 0.03;
  if (bubble.position.y >= 35) {
    scene.remove(bubble);
    addBubble(true);
    return;
  }
  setTimeout(() => animateBubble(bubble), 50);
}

function addFish(fishX=null, fishY=null) {
  const newFish = new Fish(scene,generateRandomNumber());
  fishes.push(newFish);
  newFish.create(fishX, fishY);
}
function generateRandomNumber() {
  var min = 0.08,
      max = 0.1;
  return Math.random() * (max - min) + min;
};
function randomX() {
  return Math.round(Math.random() * 8) * -1;
}
addFish(randomX(), 0);
addFish(randomX(), 3);
addFish(randomX(), -3);
addFish(randomX(), 6);
addFish(randomX(), -6);
Array(90).fill().forEach(addBubble)
addBubble();

animate()