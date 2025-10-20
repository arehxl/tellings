// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f4f4);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

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
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0, 0);
scene.add(box);

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

  renderer.render(scene, camera);
}

animate();

// Responsive handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

