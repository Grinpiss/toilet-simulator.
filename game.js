let isPlaying = false, audioCtx = null, tapNoise = null, sharedNoiseBuffer = null;

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
  } else if (!on && tapNoise) { try { tapNoise.stop(); } catch (e) {} tapNoise = null; }
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
  this.gulp(0.3);
  this.gulp(0.62);
  this.gulp(0.94);
  this.burp(1.35);
  this.fart(2.35);
 },
 smoke() {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const n1 = audioCtx.createBufferSource(), f1 = audioCtx.createBiquadFilter(), g1 = audioCtx.createGain();
  n1.buffer = sharedNoiseBuffer; n1.loop = true;
  f1.type = 'bandpass'; f1.frequency.setValueAtTime(1800, t); f1.frequency.linearRampToValueAtTime(3200, t + 0.7);
  g1.gain.setValueAtTime(0.01, t); g1.gain.linearRampToValueAtTime(0.28, t + 0.25); g1.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  n1.connect(f1); f1.connect(g1); g1.connect(audioCtx.destination); n1.start(t); n1.stop(t + 0.8);

  const n2 = audioCtx.createBufferSource(), f2 = audioCtx.createBiquadFilter(), g2 = audioCtx.createGain();
  n2.buffer = sharedNoiseBuffer; n2.loop = true;
  f2.type = 'lowpass'; f2.frequency.setValueAtTime(900, t + 1.0); f2.frequency.linearRampToValueAtTime(350, t + 2.1);
  g2.gain.setValueAtTime(0.01, t + 1.0); g2.gain.linearRampToValueAtTime(0.32, t + 1.25); g2.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
  n2.connect(f2); f2.connect(g2); g2.connect(audioCtx.destination); n2.start(t + 1.0); n2.stop(t + 2.2);
 },
 fart(delay = 0) {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime + delay;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain(), lfo = audioCtx.createOscillator(), lg = audioCtx.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(95, t); o.frequency.linearRampToValueAtTime(45, t + 0.65);
  lfo.frequency.value = 28; lg.gain.value = 25; lfo.connect(lg); lg.connect(o.frequency);
  g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
  o.connect(g); g.connect(audioCtx.destination); lfo.start(t); o.start(t); lfo.stop(t + 0.7); o.stop(t + 0.7);
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
 scene.background = new THREE.Color(0x141d19);
 scene.fog = new THREE.Fog(0x141d19, 3, 14);

 const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
 camera.position.set(0, 1.65, 2.5);
 camera.rotation.order = 'YXZ';

 const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
 renderer.setSize(innerWidth, innerHeight);
 renderer.setPixelRatio(1);
 document.body.appendChild(renderer.domElement);

 scene.add(new THREE.HemisphereLight(0x88b09b, 0x1a2420, 0.65));
 const mainLight = new THREE.PointLight(0xc2f0d5, 1.3, 15);
 mainLight.position.set(0, 3.8, 0);
 scene.add(mainLight);

 const lampFixture = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.25), new THREE.MeshStandardMaterial({ color: 0x2b3330 }));
 lampFixture.position.set(0, 3.96, 0); scene.add(lampFixture);
 const lampBulb = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 0.12), new THREE.MeshBasicMaterial({ color: 0xd8f3dc }));
 lampBulb.position.set(0, 3.91, 0); scene.add(lampBulb);

 const mat = {
  tile: new THREE.MeshStandardMaterial({ color: 0x3b4742, roughness: 0.4 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x4b5c55, roughness: 0.75 }),
  wainscot: new THREE.MeshStandardMaterial({ color: 0x293832, roughness: 0.3 }),
  white: new THREE.MeshStandardMaterial({ color: 0xcfd6d2, roughness: 0.25 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x6b7570, metalness: 0.8, roughness: 0.3 }),
  rust: new THREE.MeshStandardMaterial({ color: 0x5c3a28, roughness: 0.85 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x1b211e, roughness: 0.6 }),
  water: new THREE.MeshStandardMaterial({ color: 0x3a86ff, transparent: true, opacity: 0.55 })
 };

 function box(x, y, z, sx, sy, sz, m) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m);
  mesh.position.set(x, y, z); scene.add(mesh); return mesh;
 }
 function cyl(x, y, z, rt, rb, h, m) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 20), m);
  mesh.position.set(x, y, z); scene.add(mesh); return mesh;
 }

 box(0, -0.15, 0, 8, 0.3, 8, mat.tile);
 box(0, 2, -4, 8, 4, 0.2, mat.wall);
 box(-4, 2, 0, 0.2, 4, 8, mat.wall);
 box(4, 2, 0, 0.2, 4, 8, mat.wall);
 box(0, 4.1, 0, 8, 0.2, 8, mat.dark);

 box(0, 0.75, -3.88, 7.8, 1.5, 0.04, mat.wainscot);
 box(-3.88, 0.75, 0, 0.04, 1.5, 7.8, mat.wainscot);
 box(3.88, 0.75, 0, 0.04, 1.5, 7.8, mat.wainscot);

 cyl(-3.7, 2, -3.7, 0.08, 0.08, 4, mat.rust);
 cyl(3.7, 2, -3.7, 0.06, 0.06, 4, mat.rust);
 const topPipe = cyl(0, 3.7, -3.7, 0.06, 0.06, 7.6, mat.rust); topPipe.rotation.z = Math.PI / 2;

 const grid = new THREE.GridHelper(8, 16, 0x222b27, 0x222b27);
 grid.position.y = 0.005; scene.add(grid);

 const toilet = new THREE.Group(); toilet.position.set(1.5, 0, -1.7); scene.add(toilet);
 const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.65, 20), mat.white);
 base.position.y = 0.34; base.scale.z = 1.3; toilet.add(base);
 const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.36, 0.2, 20), mat.white);
 bowl.position.set(0, 0.68, -0.08); bowl.scale.z = 1.15; toilet.add(bowl);
 const seat = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.055, 10, 24), mat.dark);
 seat.rotation.x = Math.PI / 2; seat.position.set(0, 0.81, -0.08); seat.scale.set(1, 1.18, 1); toilet.add(seat);
 const tank = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.85, 0.3), mat.white);
 tank.position.set(0, 1.05, 0.38); toilet.add(tank);
 const flushButton = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.05), mat.metal);
 flushButton.position.set(0.27, 1.5, 0.21); toilet.add(flushButton);
 flushButton.userData = { action: "flush", label: "Нажми E — смыть воду" };
 const water = cyl(1.5, 0.79, -1.78, 0.38, 0.38, 0.015, mat.water); water.visible = false;

 function createUrinal(zPos, id) {
  const uGroup = new THREE.Group(); uGroup.position.set(3.75, 1.1, zPos); scene.add(uGroup);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.45), mat.white); uGroup.add(back);
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.35, 16), mat.white);
  lip.position.set(-0.15, -0.22, 0); uGroup.add(lip);
  const inner = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.32), mat.dark);
  inner.position.set(-0.04, 0.05, 0); uGroup.add(inner);
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 10), mat.metal);
  pipe.position.set(-0.05, 0.55, 0); uGroup.add(pipe);
  const btn = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), mat.metal);
  btn.position.set(-0.08, 0.5, 0);
  btn.userData = { action: "urinal", label: "Нажми E — смыть писсуар №" + id };
  uGroup.add(btn);
  return btn;
 }
 const urinal1 = createUrinal(-0.2, 1);
 const urinal2 = createUrinal(0.9, 2);
 box(3.65, 1.2, 0.35, 0.45, 1.1, 0.04, mat.metal);
 box(-2, 0.45, -1.65, 0.9, 0.9, 0.65, mat.white);
 const basin = cyl(-2, 0.96, -1.65, 0.58, 0.58, 0.16, mat.white); basin.scale.z = 0.72;
 const tap = cyl(-2, 1.25, -1.88, 0.045, 0.045, 0.35, mat.metal);
 tap.userData = { action: "water", label: "Нажми E — включить кран" };
 box(-2, 1.4, -1.72, 0.35, 0.06, 0.06, mat.metal);
 const sinkWater = cyl(-2, 1.15, -1.6, 0.02, 0.02, 0.4, mat.water); sinkWater.visible = false;
 box(-2, 2.25, -3.86, 1.3, 1.3, 0.06, new THREE.MeshStandardMaterial({ color: 0x5c7a73, metalness: 0.85, roughness: 0.25 }));

 const doorPivot = new THREE.Group(); doorPivot.position.set(-1.5, 0, 3.88); scene.add(doorPivot);
 const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3, 0.12), new THREE.MeshStandardMaterial({ color: 0x3d2e22, roughness: 0.8 }));
 door.position.set(0.75, 1.5, 0); doorPivot.add(door);
 const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), mat.metal);
 knob.position.set(1.3, 1.5, -0.1); doorPivot.add(knob);
 door.userData = { action: "door", label: "Нажми E — открыть дверь" };

 const switchPlate = box(-3.86, 1.5, 0.8, 0.06, 0.35, 0.22, mat.white);
 switchPlate.userData = { action: "light", label: "Нажми E — выключить свет" };

 const coffee = cyl(-2, 1.15, -1.05, 0.13, 0.13, 0.3, mat.white);
 coffee.userData = { action: "coffee", label: "Нажми E — выпить кофе" };
 const coffeeLiquid = cyl(-2, 1.305, -1.05, 0.105, 0.105, 0.012, new THREE.MeshStandardMaterial({ color: 0x36180a }));
 coffeeLiquid.userData = { action: "coffee", label: "Нажми E — выпить кофе" };

 const spray = cyl(-2.8, 1.05, -1.5, 0.09, 0.09, 0.38, mat.white);
 spray.userData = { action: "spray", label: "Нажми E — освежитель воздуха" };
 box(-2.8, 1.25, -1.5, 0.12, 0.06, 0.12, mat.metal);

 const paper = cyl(3.75, 1.15, -1.7, 0.16, 0.16, 0.24, mat.white);
 paper.rotation.z = Math.PI / 2; paper.userData = { action: "paper", label: "Нажми E — оторвать бумагу" };
 const strip = box(3.75, 0.85, -1.7, 0.12, 0.35, 0.025, mat.white); strip.visible = false;

 // БУТЫЛКА «СК — СТАРАЯ КРЕПОСТЬ» НА ТУМБОЧКЕ РЯДОМ С СИГАРЕТАМИ
 const beerBottle = new THREE.Group();
 beerBottle.position.set(2.38, 0.7, -1.85);
 scene.add(beerBottle);

 const petGlass = new THREE.MeshStandardMaterial({ color: 0x5c2c0e, roughness: 0.15, metalness: 0.1 });
 const body = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.26, 20), petGlass);
 body.position.y = 0.13;
 body.userData = { action: "beer", label: "Нажми E — выпить пиво СК Старая Крепость" };
 beerBottle.add(body);

 // Сужающееся плечо и горлышко
 const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.085, 0.11, 20), petGlass);
 shoulder.position.y = 0.315;
 beerBottle.add(shoulder);

 // Темно-зеленая крышка
 const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.03, 16), new THREE.MeshStandardMaterial({ color: 0x133822, roughness: 0.4 }));
 cap.position.y = 0.385;
 beerBottle.add(cap);

 // Фирменная зелено-золотая этикетка СК
 const label = new THREE.Mesh(new THREE.CylinderGeometry(0.087, 0.087, 0.13, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0x163020, roughness: 0.5 }));
 label.position.y = 0.13;
 beerBottle.add(label);

 const goldBadge = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.08, 0.06), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.6, roughness: 0.3 }));
 goldBadge.position.set(-0.085, 0.13, 0);
 beerBottle.add(goldBadge);

 // ТУМБОЧКА, ПЕПЕЛЬНИЦА, СИГАРЕТЫ И ДЫМ
 box(2.5, 0.35, -1.7, 0.65, 0.7, 0.65, mat.dark);
 const ashtray = cyl(2.4, 0.73, -1.62, 0.14, 0.12, 0.06, mat.metal);
 ashtray.userData = { action: "smoke", label: "Нажми E — затянуться" };
 cyl(2.4, 0.745, -1.62, 0.11, 0.11, 0.035, mat.dark);
 const cig = box(2.44, 0.765, -1.62, 0.14, 0.018, 0.018, mat.white); cig.rotation.y = 0.4;
 const ember = box(2.38, 0.765, -1.59, 0.025, 0.019, 0.019, new THREE.MeshBasicMaterial({ color: 0xff4500 })); ember.rotation.y = 0.4;
 const smokeParticle = cyl(2.38, 0.82, -1.59, 0.015, 0.005, 0.08, new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.35 }));

 const cigPack = box(2.62, 0.77, -1.72, 0.11, 0.14, 0.045, new THREE.MeshStandardMaterial({ color: 0x9e1b1b, roughness: 0.4 }));
 cigPack.rotation.y = -0.3; cigPack.userData = { action: "smoke", label: "Нажми E — затянуться" };
 const cigPackTop = box(2.62, 0.845, -1.72, 0.105, 0.02, 0.04, mat.white); cigPackTop.rotation.y = -0.3;

 const interactables = [flushButton, urinal1, urinal2, tap, door, switchPlate, coffee, coffeeLiquid, spray, paper, body, ashtray, cigPack];


 box(2.5, 0.35, -1.7, 0.65, 0.7, 0.65, mat.dark);
 const ashtray = cyl(2.4, 0.73, -1.65, 0.14, 0.12, 0.06, mat.metal);
 ashtray.userData = { action: "smoke", label: "Нажми E — затянуться" };
 cyl(2.4, 0.745, -1.65, 0.11, 0.11, 0.035, mat.dark);
 const cig = box(2.44, 0.765, -1.65, 0.14, 0.018, 0.018, mat.white); cig.rotation.y = 0.4;
 const ember = box(2.38, 0.765, -1.62, 0.025, 0.019, 0.019, new THREE.MeshBasicMaterial({ color: 0xff4500 })); ember.rotation.y = 0.4;
 const smokeParticle = cyl(2.38, 0.82, -1.62, 0.015, 0.005, 0.08, new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.35 }));

 const cigPack = box(2.62, 0.77, -1.75, 0.11, 0.14, 0.045, new THREE.MeshStandardMaterial({ color: 0x9e1b1b, roughness: 0.4 }));
 cigPack.rotation.y = -0.3; cigPack.userData = { action: "smoke", label: "Нажми E — затянуться" };
 const cigPackTop = box(2.62, 0.845, -1.75, 0.105, 0.02, 0.04, mat.white); cigPackTop.rotation.y = -0.3;

 const interactables = [flushButton, urinal1, urinal2, tap, door, switchPlate, coffee, coffeeLiquid, spray, paper, body, ashtray, cigPack];

 let lastMouseX = null, lastMouseY = null;
 document.addEventListener('mousemove', (e) => {
  if (!isPlaying) return;
  if (lastMouseX !== null && lastMouseY !== null) {
   camera.rotation.y -= (e.clientX - lastMouseX) * 0.004;
   camera.rotation.x = Math.max(-1.4, Math.min(1.4, camera.rotation.x - (e.clientY - lastMouseY) * 0.004));
  }
  lastMouseX = e.clientX; lastMouseY = e.clientY;
 });
 document.addEventListener('mouseleave', () => { lastMouseX = null; lastMouseY = null; });

 const keys = {};
 let doorOpen = false, lightOn = true, currentTarget = null;
 document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (!isPlaying) return;
  if (e.code === 'KeyE' && currentTarget) {
   const a = currentTarget.userData.action;
   if (a === "flush" || a === "urinal") { sfx.flush(); water.visible = true; setTimeout(() => water.visible = false, 2500); }
   if (a === "water") { sinkWater.visible = !sinkWater.visible; sfx.toggleTap(sinkWater.visible); }
   if (a === "door") { sfx.click(); doorOpen = !doorOpen; doorPivot.rotation.y = doorOpen ? -1.3 : 0; }
   if (a === "light") { sfx.click(); lightOn = !lightOn; mainLight.intensity = lightOn ? 1.3 : 0.08; lampBulb.visible = lightOn; }
   if (a === "coffee" && coffeeLiquid.visible) { sfx.coffee(); coffeeLiquid.visible = false; coffee.userData.label = "Кружка пуста"; }
   if (a === "paper") { sfx.click(); strip.visible = !strip.visible; }
   if (a === "beer") { sfx.beer(); beerBottle.visible = false; }
   if (a === "spray") { sfx.click(); spray.position.y = 1.12; setTimeout(() => spray.position.y = 1.05, 200); }
   if (a === "smoke") { sfx.smoke(); ember.scale.set(1.6, 1.6, 1.6); setTimeout(() => ember.scale.set(1, 1, 1), 600); }
  }
  if (e.code === 'KeyF') sfx.fart();
 });
 document.addEventListener('keyup', (e) => keys[e.code] = false);

 const raycaster = new THREE.Raycaster(); raycaster.far = 3.5;
 const centerVec = new THREE.Vector2(0, 0), fwd = new THREE.Vector3(), rgt = new THREE.Vector3();
 const promptEl = document.getElementById('prompt'), clock = new THREE.Clock();

 function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  if (lightOn && Math.random() < 0.03) mainLight.intensity = 0.7 + Math.random() * 0.6;
  smokeParticle.position.y += dt * 0.25;
  smokeParticle.material.opacity = Math.max(0, 0.4 - (smokeParticle.position.y - 0.8) * 0.8);
  if (smokeParticle.position.y > 1.3) smokeParticle.position.y = 0.8;

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
   if (hits.length > 0 && hits.at(0).object.visible) {
   currentTarget = hits.at(0).object;

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
