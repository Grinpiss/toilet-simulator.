let isPlaying = false, isMouseDown = false, audioCtx = null, tapNoise = null, sharedNoiseBuffer = null;

window.startGame = function() {
 isPlaying = true;
 const s = document.getElementById('start');
 if (s) s.remove();
 initAudio();
};


window.addEventListener('keydown', (e) => {
 if (!isPlaying && (e.code === 'Space' || e.code === 'Enter')) window.startGame();
});

function initAudio() {
 try {
  if (!audioCtx) {
   audioCtx = new (window.AudioContext || window.webkitAudioContext)();
   sharedNoiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
   const d = sharedNoiseBuffer.getChannelData(0);
   for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
 } catch (e) {}
}

const sfx = {
 flush() {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime, n = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
  n.buffer = sharedNoiseBuffer; n.loop = true;
  f.type = 'bandpass'; f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(300, t + 2.5);
  g.gain.setValueAtTime(0.01, t); g.gain.linearRampToValueAtTime(0.4, t + 0.3); g.gain.exponentialRampToValueAtTime(0.001, t + 2.6);
  n.connect(f); f.connect(g); g.connect(audioCtx.destination); n.start(t); n.stop(t + 2.6);
 },
 toggleTap(on) {
  initAudio(); if (!audioCtx) return;
  if (on && !tapNoise) {
   const n = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
   n.buffer = sharedNoiseBuffer; n.loop = true; f.type = 'highpass'; f.frequency.value = 1000; g.gain.value = 0.15;
   n.connect(f); f.connect(g); g.connect(audioCtx.destination); n.start(); tapNoise = n;
  } else if (!on && tapNoise) {
   try { tapNoise.stop(); } catch (e) {}
   tapNoise = null;
  }
 },
 gulp(d = 0) {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime + d, o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(380, t + 0.12); o.frequency.exponentialRampToValueAtTime(110, t + 0.25);
  g.gain.setValueAtTime(0.01, t); g.gain.linearRampToValueAtTime(0.35, t + 0.05); g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
  o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.27);
 },
 coffee() {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime, n = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
  n.buffer = sharedNoiseBuffer; f.type = 'bandpass'; f.frequency.setValueAtTime(800, t); f.frequency.linearRampToValueAtTime(2200, t + 0.25);
  g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  n.connect(f); f.connect(g); g.connect(audioCtx.destination); n.start(t); n.stop(t + 0.25);
  this.gulp(0.28);
 },
 beer() {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime, n = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
  n.buffer = sharedNoiseBuffer; f.type = 'highpass'; f.frequency.value = 3000;
  g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  n.connect(f); f.connect(g); g.connect(audioCtx.destination); n.start(t); n.stop(t + 0.2);
  this.gulp(0.3); this.gulp(0.65);
 },
 fart() {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain(), lfo = audioCtx.createOscillator(), lg = audioCtx.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(95, t); o.frequency.linearRampToValueAtTime(45, t + 0.55);
  lfo.frequency.value = 28; lg.gain.value = 25; lfo.connect(lg); lg.connect(o.frequency);
  g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  o.connect(g); g.connect(audioCtx.destination); lfo.start(t); o.start(t); lfo.stop(t + 0.6); o.stop(t + 0.6);
 },
 click() {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(100, t + 0.04);
  g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.05);
 }
};

if (typeof THREE !== 'undefined') {
 const scene = new THREE.Scene();
 scene.background = new THREE.Color(0x9ca7aa);
 scene.fog = new THREE.Fog(0x9ca7aa, 10, 24);

 const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
 camera.position.set(0, 1.65, 2.5);
 camera.rotation.order = 'YXZ';

 const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
 renderer.setSize(innerWidth, innerHeight);
 renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = THREE.BasicShadowMap;
 document.body.appendChild(renderer.domElement);

 scene.add(new THREE.HemisphereLight(0xffffff, 0x60616b, 1.2));
 const mainLight = new THREE.PointLight(0xffedcf, 1.5, 18);
 mainLight.position.set(0, 4.5, 0);
 mainLight.castShadow = true;
 mainLight.shadow.mapSize.width = 512;
 mainLight.shadow.mapSize.height = 512;
 scene.add(mainLight);

 const mat = {
  tile: new THREE.MeshStandardMaterial({ color: 0xc5c9c8, roughness: 0.3 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xadb8b8, roughness: 0.8 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf0eee8, roughness: 0.2 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x999fa3, metalness: 0.85, roughness: 0.2 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x343b40, roughness: 0.5 }),
  water: new THREE.MeshStandardMaterial({ color: 0x53c8ee, transparent: true, opacity: 0.5 })
 };

 function box(x, y, z, sx, sy, sz, m, shadow = false) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m);
  mesh.position.set(x, y, z); mesh.castShadow = shadow; mesh.receiveShadow = true; scene.add(mesh); return mesh;
 }
 function cyl(x, y, z, rt, rb, h, m, shadow = false) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 20), m);
  mesh.position.set(x, y, z); mesh.castShadow = shadow; mesh.receiveShadow = true; scene.add(mesh); return mesh;
 }

 box(0, -0.15, 0, 8, 0.3, 8, mat.tile);
 box(0, 2, -4, 8, 4, 0.2, mat.wall);
 box(-4, 2, 0, 0.2, 4, 8, mat.wall);
 box(4, 2, 0, 0.2, 4, 8, mat.wall);
 box(0, 4.1, 0, 8, 0.2, 8, mat.white);

 const grid = new THREE.GridHelper(8, 16, 0x8e9999, 0x8e9999);
 grid.position.y = 0.005; scene.add(grid);

 const toilet = new THREE.Group(); toilet.position.set(1.5, 0, -1.7); scene.add(toilet);
 const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.65, 20), mat.white);
 base.position.y = 0.34; base.scale.z = 1.3; base.castShadow = true; toilet.add(base);
 const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.36, 0.2, 20), mat.white);
 bowl.position.set(0, 0.68, -0.08); bowl.scale.z = 1.15; toilet.add(bowl);
 const seat = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.055, 10, 24), mat.dark);
 seat.rotation.x = Math.PI / 2; seat.position.set(0, 0.81, -0.08); seat.scale.set(1, 1.18, 1); toilet.add(seat);
 const tank = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.85, 0.3), mat.white);
 tank.position.set(0, 1.05, 0.38); tank.castShadow = true; toilet.add(tank);
 const flushButton = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.05), mat.metal);
 flushButton.position.set(0.27, 1.5, 0.21); toilet.add(flushButton);
 flushButton.userData = { action: "flush", label: "Нажми E — смыть воду" };

 box(-2, 0.45, -1.65, 0.9, 0.9, 0.65, mat.white, true);
 const basin = cyl(-2, 0.96, -1.65, 0.58, 0.58, 0.16, mat.white); basin.scale.z = 0.72;
 const tap = cyl(-2, 1.25, -1.88, 0.045, 0.045, 0.35, mat.metal);
 tap.userData = { action: "water", label: "Нажми E — включить кран" };
 box(-2, 1.4, -1.72, 0.35, 0.06, 0.06, mat.metal);
 const sinkWater = cyl(-2, 1.15, -1.6, 0.02, 0.02, 0.4, mat.water); sinkWater.visible = false;

 box(-2, 2.25, -3.88, 1.3, 1.3, 0.06, new THREE.MeshStandardMaterial({ color: 0x9ac6d0, metalness: 0.9, roughness: 0.08 }));

 const doorPivot = new THREE.Group(); doorPivot.position.set(-1.5, 0, 3.88); scene.add(doorPivot);
 const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3, 0.12), new THREE.MeshStandardMaterial({ color: 0x795c45, roughness: 0.65 }));
 door.position.set(0.75, 1.5, 0); door.castShadow = true; doorPivot.add(door);
 const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), mat.metal);
 knob.position.set(1.3, 1.5, -0.1); doorPivot.add(knob);
 door.userData = { action: "door", label: "Нажми E — открыть дверь" };

 const switchPlate = box(-3.88, 1.5, 0.8, 0.06, 0.35, 0.22, mat.white);
 switchPlate.userData = { action: "light", label: "Нажми E — выключить свет" };

 const water = cyl(1.5, 0.79, -1.78, 0.38, 0.38, 0.015, mat.water); water.visible = false;

 const coffee = cyl(-2, 1.15, -1.05, 0.13, 0.13, 0.3, mat.white);
 coffee.userData = { action: "coffee", label: "Нажми E — выпить кофе" };
 const coffeeLiquid = cyl(-2, 1.305, -1.05, 0.105, 0.105, 0.012, new THREE.MeshStandardMaterial({ color: 0x4b2410 }));
 coffeeLiquid.userData = { action: "coffee", label: "Нажми E — выпить кофе" };

 const spray = cyl(-2.8, 1.05, -1.5, 0.09, 0.09, 0.38, mat.white);
 spray.userData = { action: "spray", label: "Нажми E — освежитель воздуха" };
 box(-2.8, 1.25, -1.5, 0.12, 0.06, 0.12, mat.metal);

 const paper = cyl(3.75, 1.15, -1.7, 0.16, 0.16, 0.24, mat.white);
 paper.rotation.z = Math.PI / 2; paper.userData = { action: "paper", label: "Нажми E — оторвать бумагу" };
 const strip = box(3.75, 0.85, -1.7, 0.12, 0.35, 0.025, mat.white); strip.visible = false;

 const beerBottle = new THREE.Group(); beerBottle.position.set(2.95, 1.1, -1.7); scene.add(beerBottle);
 const body = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.32, 16), new THREE.MeshStandardMaterial({ color: 0x63351b, roughness: 0.2 }));
 body.userData = { action: "beer", label: "Нажми E — выпить пиво СК" };
 beerBottle.add(body);

 const interactables = [flushButton, tap, door, switchPlate, coffee, coffeeLiquid, spray, paper, body];


 let lastMouseX = null, lastMouseY = null;
 document.addEventListener('mousemove', (e) => {
  if (!isPlaying) return;
  if (lastMouseX !== null && lastMouseY !== null) {
   const dx = e.clientX - lastMouseX;
   const dy = e.clientY - lastMouseY;
   camera.rotation.y -= dx * 0.004;
   camera.rotation.x = Math.max(-1.4, Math.min(1.4, camera.rotation.x - dy * 0.004));
  }
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
 });

 document.addEventListener('mouseleave', () => {
  lastMouseX = null;
  lastMouseY = null;
 });
 const keys = {};
 let doorOpen = false, lightOn = true, currentTarget = null;
 document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (!isPlaying) return;
  if (e.code === 'KeyE' && currentTarget) {
   const a = currentTarget.userData.action;
   if (a === "flush") { sfx.flush(); water.visible = true; setTimeout(() => water.visible = false, 2500); }
   if (a === "water") { sinkWater.visible = !sinkWater.visible; sfx.toggleTap(sinkWater.visible); }
   if (a === "door") { sfx.click(); doorOpen = !doorOpen; doorPivot.rotation.y = doorOpen ? -1.3 : 0; }
   if (a === "light") { sfx.click(); lightOn = !lightOn; mainLight.intensity = lightOn ? 1.5 : 0.1; }
   if (a === "coffee" && coffeeLiquid.visible) { sfx.coffee(); coffeeLiquid.visible = false; coffee.userData.label = "Кружка пуста"; }
   if (a === "paper") { sfx.click(); strip.visible = !strip.visible; }
   if (a === "beer") { sfx.beer(); beerBottle.visible = false; }
   if (a === "spray") { sfx.click(); spray.position.y = 1.12; setTimeout(() => spray.position.y = 1.05, 200); }
  }
  if (e.code === 'KeyF') sfx.fart();
 });
 document.addEventListener('keyup', (e) => keys[e.code] = false);

 const raycaster = new THREE.Raycaster();
 raycaster.far = 3.5;
 const centerVec = new THREE.Vector2(0, 0);
 const fwd = new THREE.Vector3();
 const rgt = new THREE.Vector3();
 const promptEl = document.getElementById('prompt');
 const clock = new THREE.Clock();

 function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  if (isPlaying) {
   const spd = 3.5 * dt;
   fwd.set(0, 0, -1).applyQuaternion(camera.quaternion); fwd.y = 0; fwd.normalize();
   rgt.set(1, 0, 0).applyQuaternion(camera.quaternion); rgt.y = 0; rgt.normalize();
   if (keys['KeyW']) camera.position.addScaledVector(fwd, spd);
   if (keys['KeyS']) camera.position.addScaledVector(fwd, -spd);
   if (keys['KeyD']) camera.position.addScaledVector(rgt, spd);
   if (keys['KeyA']) camera.position.addScaledVector(rgt, -spd);
   camera.position.x = Math.max(-3.5, Math.min(3.5, camera.position.x));
   camera.position.z = Math.max(-3.5, Math.min(3.5, camera.position.z));
  }
  raycaster.setFromCamera(centerVec, camera);
  const hits = raycaster.intersectObjects(interactables);
  if (hits.length > 0 && hits[0].object.visible) {
   currentTarget = hits[0].object;
   promptEl.textContent = currentTarget.userData.label;
   promptEl.style.display = 'block';
  } else {
   currentTarget = null;
   promptEl.style.display = 'none';
  }
  renderer.render(scene, camera);
 }

 window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);
 });
 animate();
}
