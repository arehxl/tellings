// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f4f4);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Floating spheres
const spheres = [];
for (let i = 0; i < 8; i++) {
  const geometry = new THREE.SphereGeometry(0.3, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(Math.random() * 8 - 4, Math.random() * 6 - 3, Math.random() * 4 - 2);
  scene.add(sphere);
  spheres.push(sphere);
}

// Rotating box
const boxGeometry = new THREE.BoxGeometry(1, 0.7, 0.5);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// Metallic silver lines (left to right)
const lines = [];
const lineMaterial = new THREE.MeshStandardMaterial({
  color: 0xb0b0b0,
  metalness: 1,
  roughness: 0.2,
  emissive: 0x555555,
  emissiveIntensity: 0.3,
});

for (let i = 0; i < 10; i++) {
  const geometry = new THREE.BoxGeometry(8, 0.02, 0.02); // thin rectangle
  const line = new THREE.Mesh(geometry, lineMaterial);
  line.position.set(-1, (i - 5) * 0.6, -1.5 + Math.random() * 1); // slightly behind sphere
  scene.add(line);
  lines.push(line);
}

// Animate loop
function animate() {
  requestAnimationFrame(animate);

  // Animate floating spheres
  spheres.forEach((sphere, i) => {
    sphere.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
    sphere.position.x += Math.cos(Date.now() * 0.001 + i) * 0.002;
  });

  // Rotate box
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  // Slight shimmer for the lines
  lines.forEach((line, i) => {
    line.material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.002 + i) * 0.2;
  });

  renderer.render(scene, camera);
}

animate();

// Responsive handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
