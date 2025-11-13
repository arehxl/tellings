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
  updateRoutePaths(); // Update paths on resize
});

// Route paths - lines from sphere converging towards "tellings"
function updateRoutePaths() {
  const svg = document.querySelector('.route-svg');
  const line1 = document.querySelector('.route-line1');
  const line2 = document.querySelector('.route-line2');
  const line3 = document.querySelector('.route-line3');
  
  if (!svg || !line1 || !line2 || !line3) return;
  
  // Set SVG size to viewport
  svg.setAttribute('width', window.innerWidth);
  svg.setAttribute('height', window.innerHeight);
  svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
  
  // Sphere position (bottom: 40px, left: 40px, size: 100px)
  const sphereX = 40 + 50; // center X
  const sphereY = window.innerHeight - 40 - 50; // center Y
  const sphereRightX = 140; // right edge
  const sphereTopY = window.innerHeight - 140; // top edge
  const sphereBottomY = window.innerHeight - 40; // bottom edge
  
  // "Tellings" approximate center (centered on page)
  const tellingsX = window.innerWidth / 2;
  const tellingsY = window.innerHeight / 2;
  const endX = window.innerWidth - 100; // end point to the right
  
  // Path 1: From top of sphere, goes UP first, then curves right, passes above tellings, continues right
  const path1StartY = sphereTopY - 5;
  const path1UpY = sphereTopY - 150;
  const path1TurnX = sphereRightX + 250;
  const path1AboveTellingsY = tellingsY - 50;
  const path1 = `M ${sphereRightX} ${path1StartY} Q ${sphereRightX + 80} ${path1UpY}, ${path1TurnX} ${path1UpY + 30} Q ${tellingsX - 100} ${path1AboveTellingsY}, ${tellingsX - 30} ${tellingsY - 35} Q ${tellingsX + 60} ${tellingsY - 30}, ${endX} ${tellingsY - 25}`;
  line1.setAttribute('d', path1);
  
  // Path 2: From middle/side of sphere, goes RIGHT (horizontal), then curves up under tellings, continues right
  const path2StartY = sphereY;
  const path2HorizontalEndX = tellingsX - 140;
  const path2UnderTellingsY = tellingsY + 50;
  const path2PassY = tellingsY + 35;
  const path2 = `M ${sphereRightX} ${path2StartY} L ${path2HorizontalEndX} ${path2StartY + 10} Q ${tellingsX - 80} ${path2UnderTellingsY}, ${tellingsX - 40} ${path2PassY} Q ${tellingsX + 40} ${path2PassY - 5}, ${tellingsX + 100} ${tellingsY + 30} L ${endX} ${tellingsY + 28}`;
  line2.setAttribute('d', path2);
  
  // Path 3: From lower part of sphere, curves right and slightly down, then up toward tellings area from below
  const path3StartY = sphereBottomY - 10;
  const path3DownY = path3StartY + 100;
  const path3RightX = sphereRightX + 220;
  const path3ApproachY = tellingsY + 60;
  const path3 = `M ${sphereRightX} ${path3StartY} Q ${path3RightX - 50} ${path3DownY}, ${path3RightX} ${path3DownY - 20} Q ${tellingsX - 90} ${path3ApproachY}, ${tellingsX - 50} ${tellingsY + 55} Q ${tellingsX + 20} ${tellingsY + 52}, ${tellingsX + 120} ${tellingsY + 48} L ${endX} ${tellingsY + 50}`;
  line3.setAttribute('d', path3);
}

// Initialize paths on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateRoutePaths);
} else {
  updateRoutePaths();
}

// Also update on window load to ensure everything is rendered
window.addEventListener('load', () => {
  setTimeout(updateRoutePaths, 100);
});
