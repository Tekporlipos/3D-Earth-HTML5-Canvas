let camera, scene, renderer;
let earthMesh, cloudMesh;
let pointLight, ambientLight;
let isMouseDown = false, prevMouseX = 0, prevMouseY = 0;

init();
animate();

function init() {
  // Initialization
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 100);

  // Earth terrain
  let earthTexture = new THREE.TextureLoader().load("src/images/earth.jpeg");
  let earthBump = new THREE.TextureLoader().load("src/images/bump.jpeg");
  let earthSpecular = new THREE.TextureLoader().load("src/images/spec.jpeg");
  let earthGeometry = new THREE.SphereGeometry(30, 32, 32);
  let earthMaterial = new THREE.MeshPhongMaterial({
    shininess: 40,
    bumpScale: 1,
    map: earthTexture,
    bumpMap: earthBump,
    specularMap: earthSpecular
  });
  earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);

  // Earth cloud
  let cloudTexture = new THREE.TextureLoader().load('src/images/cloud.png');
  let cloudGeometry = new THREE.SphereGeometry(31, 32, 32);
  let cloudMaterial = new THREE.MeshBasicMaterial({
    shininess: 10,
    map: cloudTexture,
    transparent: true,
    opacity: 0.8
  });
  cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(cloudMesh);

  // Point light (upper left)
  pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(-400, 100, 150);
  scene.add(pointLight);

  // Ambient light
  ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);

  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Event handlers
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mouseup', onMouseUp, false);
  document.addEventListener('wheel', onMouseWheel, false);
}

function animate() {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.001;
  cloudMesh.rotation.y += 0.001;
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(evt) {
  if (!isMouseDown) return;
  evt.preventDefault();
  let deltaX = evt.clientX - prevMouseX, deltaY = evt.clientY - prevMouseY;
  prevMouseX = evt.clientX;
  prevMouseY = evt.clientY;
  rotateScene(deltaX, deltaY);
}

function onMouseDown(evt) {
  evt.preventDefault();
  isMouseDown = true;
  prevMouseX = evt.clientX;
  prevMouseY = evt.clientY;
}

function onMouseUp(evt) {
  evt.preventDefault();
  isMouseDown = false;
}

function rotateScene(deltaX, deltaY) {
  earthMesh.rotation.y += deltaX / 300;
  earthMesh.rotation.x += deltaY / 300;
  cloudMesh.rotation.y += deltaX / 300;
  cloudMesh.rotation.x += deltaY / 300;
}

function onMouseWheel(evt) {
  evt.preventDefault();
  let zoomFactor = 1.1;
  let delta = evt.deltaY || evt.wheelDelta;
  let zoomAmount = (delta > 0) ? 1 / zoomFactor : zoomFactor;

  // Adjust the camera's position based on zoom amount.
  camera.position.z *= zoomAmount;

  // Limit the zoom range to prevent going too far or too close.
  let maxZoom = 1000;
  let minZoom = 50;
  camera.position.z = Math.min(Math.max(camera.position.z, minZoom), maxZoom);
}
