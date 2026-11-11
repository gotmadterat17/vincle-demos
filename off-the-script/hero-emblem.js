import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const hero = document.querySelector('[data-hero]');
const stage = document.getElementById('heroStage');
const hit = document.getElementById('heroHit');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = navigator.connection?.saveData;
const params = new URLSearchParams(location.search);
const rawVariant = (params.get('variant') || 'nebula').toLowerCase();
const nonebula = rawVariant === 'nonebula' || rawVariant === 'flat' || rawVariant === 'b' || rawVariant === 'no-nebula';
if (hero) {
  hero.classList.toggle('variant-nonebula', nonebula);
  hero.classList.toggle('variant-nebula', !nonebula);
  hero.dataset.variant = nonebula ? 'nonebula' : 'nebula';
}
document.documentElement.classList.toggle('variant-nonebula', nonebula);
document.documentElement.classList.toggle('variant-nebula', !nonebula);

function fallback() {
  hero?.classList.add('is-fallback');
}

/* Layout always keeps 3D when possible — A/B only toggles nebula atmosphere */
if (!stage || !hero || reduce || saveData) {
  fallback();
} else {
  try {
    boot();
  } catch (err) {
    console.warn('hero emblem failed', err);
    fallback();
  }
}

function boot() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  const isMobile = matchMedia('(max-width:960px)').matches || (navigator.maxTouchPoints > 1 && innerWidth < 900);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(-0.35, 0.15, 6.2);

  if (!isMobile) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.HemisphereLight(0xc8b0e0, 0x200820, 1));
    const c1 = new THREE.Mesh(new THREE.SphereGeometry(2, 12, 12), new THREE.MeshBasicMaterial({ color: 0xdc0cc4 }));
    c1.position.set(3, 2, -2); envScene.add(c1);
    const c2 = new THREE.Mesh(new THREE.SphereGeometry(2, 12, 12), new THREE.MeshBasicMaterial({ color: 0x3aa3e0 }));
    c2.position.set(-3, 1, -1); envScene.add(c2);
    const c3 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 12), new THREE.MeshBasicMaterial({ color: 0x18d090 }));
    c3.position.set(0, -2, 2); envScene.add(c3);
    scene.environment = pmrem.fromScene(envScene, 0.06).texture;
    pmrem.dispose();
  }

  scene.add(new THREE.AmbientLight(0x8060a8, 0.55));
  const key = new THREE.DirectionalLight(0xe8eef6, 1.45);
  key.position.set(3.5, 5, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0x3aa3e0, 0.85);
  fill.position.set(-4, 1.5, -2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xdc0cc4, 1.05);
  rim.position.set(0, 2, -5); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xc8b0e0, 0x200820, 0.5));

  function glassMat(opts = {}) {
    return new THREE.MeshPhysicalMaterial({
      color: opts.color ?? 0xc8b0e0,
      metalness: 0,
      roughness: opts.roughness ?? 0.045,
      transmission: opts.transmission ?? 1,
      thickness: opts.thickness ?? 1.5,
      ior: opts.ior ?? 1.52,
      transparent: true,
      opacity: 1,
      envMapIntensity: opts.env ?? 2.1,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: opts.iridescence ?? 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: opts.irRange ?? [120, 640],
      attenuationColor: opts.atten ?? new THREE.Color(0x6020a0),
      attenuationDistance: opts.attenDist ?? 1.15,
      specularIntensity: 1,
      specularColor: new THREE.Color(0xe8eef6),
      emissive: opts.emissive ?? new THREE.Color(0x402060),
      emissiveIntensity: opts.ei ?? 0.2,
    });
  }

  function glowMat(hex, op = 0.95) {
    return new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: op });
  }

  function extrudeShape(shape, depth = 0.42) {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.035,
      bevelSegments: isMobile ? 2 : 4,
      curveSegments: isMobile ? 2 : 4,
    });
    g.center();
    return g;
  }

  /* Faithful brand speech-bubble: left magenta shard + right body + teal tail */
  const leftShard = new THREE.Shape();
  leftShard.moveTo(-1.55, 0.55);
  leftShard.lineTo(-0.35, 0.95);
  leftShard.lineTo(-0.72, -0.05);
  leftShard.lineTo(-1.48, -0.42);
  leftShard.closePath();

  const rightBody = new THREE.Shape();
  rightBody.moveTo(-0.15, 0.92);
  rightBody.lineTo(1.35, 1.02);
  rightBody.lineTo(1.55, 0.25);
  rightBody.lineTo(1.22, -0.62);
  rightBody.lineTo(0.28, -0.72);
  rightBody.lineTo(-0.42, -0.18);
  rightBody.closePath();

  const tail = new THREE.Shape();
  tail.moveTo(0.05, 0.28);
  tail.lineTo(0.78, -0.08);
  tail.lineTo(0.12, -0.52);
  tail.closePath();

  const leftGeo = extrudeShape(leftShard, 0.38);
  const rightGeo = extrudeShape(rightBody, 0.44);
  const tailGeo = extrudeShape(tail, 0.34);

  const mark = new THREE.Group();
  scene.add(mark);

  const shellL = new THREE.Mesh(leftGeo, glassMat({
    color: 0xe090d8,
    thickness: 1.5,
    irRange: [80, 620],
    atten: new THREE.Color(0x580058),
    emissive: new THREE.Color(0xdc0cc4),
    ei: 0.28,
  }));
  shellL.position.set(-0.72, 0.18, 0);
  shellL.name = 'MARK · LEFT';
  mark.add(shellL);

  const shell = new THREE.Mesh(rightGeo, glassMat({
    color: 0xb0c8e8,
    thickness: 1.75,
    irRange: [120, 780],
    atten: new THREE.Color(0x201060),
    emissive: new THREE.Color(0x3010d0),
    ei: 0.22,
  }));
  shell.position.set(0.28, 0.08, 0.02);
  shell.name = 'MARK · SPEECH';
  mark.add(shell);

  const tailMesh = new THREE.Mesh(tailGeo, glassMat({
    color: 0x18d090,
    thickness: 1.3,
    atten: new THREE.Color(0x0a6040),
    emissive: new THREE.Color(0x18d090),
    ei: 0.48,
    irRange: [150, 700],
  }));
  tailMesh.position.set(0.95, -0.95, 0.04);
  tailMesh.rotation.z = -0.35;
  tailMesh.name = 'TAIL · TEAL';
  mark.add(tailMesh);

  function addEdges(geo, color, op, mesh) {
    const e = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 18),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: op })
    );
    e.position.copy(mesh.position);
    e.rotation.copy(mesh.rotation);
    mark.add(e);
    return e;
  }
  addEdges(leftGeo, 0xdc0cc4, 0.55, shellL);
  addEdges(rightGeo, 0x3aa3e0, 0.5, shell);
  addEdges(tailGeo, 0x18d090, 0.7, tailMesh);

  /* Internal spectrum bands — clipped visually as diagonal glass plates INSIDE the bubble */
  const bandSpecs = [
    { hex: 0xdc0cc4, x: -0.55, y: 0.2, w: 0.28, h: 1.15 },
    { hex: 0x9810d8, x: -0.05, y: 0.15, w: 0.28, h: 1.25 },
    { hex: 0x3010d0, x: 0.42, y: 0.12, w: 0.3, h: 1.3 },
    { hex: 0x1088d0, x: 0.88, y: 0.05, w: 0.28, h: 1.15 },
    { hex: 0x18d090, x: 1.15, y: -0.55, w: 0.22, h: 0.7 },
  ];
  const facets = [];
  bandSpecs.forEach((b, i) => {
    const geo = new THREE.BoxGeometry(b.w, b.h, 0.07);
    const m = glassMat({
      color: b.hex,
      thickness: 0.55,
      transmission: 0.88,
      irRange: [90 + i * 40, 480 + i * 70],
      atten: new THREE.Color(b.hex),
      emissive: new THREE.Color(b.hex),
      ei: 0.32,
      roughness: 0.05,
    });
    const f = new THREE.Mesh(geo, m);
    f.position.set(b.x, b.y, 0.06);
    f.rotation.z = -0.42;
    f.name = `BAND 0${i + 1}`;
    mark.add(f);
    facets.push(f);
  });

  /* Soft cores at logo hotspots */
  [
    { c: 0xdc0cc4, p: [-0.7, 0.25, 0.12], r: 0.08 },
    { c: 0x3aa3e0, p: [0.45, 0.12, 0.14], r: 0.07 },
    { c: 0x18d090, p: [0.95, -0.9, 0.1], r: 0.065 },
  ].forEach((o) => {
    const seg = isMobile ? 10 : 20;
    const s = new THREE.Mesh(new THREE.SphereGeometry(o.r, seg, seg), glowMat(o.c));
    s.position.set(...o.p);
    mark.add(s);
    const soft = new THREE.Mesh(
      new THREE.SphereGeometry(o.r * 2.1, isMobile ? 8 : 16, isMobile ? 8 : 16),
      new THREE.MeshBasicMaterial({ color: o.c, transparent: true, opacity: 0.09, depthWrite: false })
    );
    soft.position.copy(s.position);
    mark.add(soft);
  });

  const coreLight = new THREE.PointLight(0xdc0cc4, 4.2, 5, 1.5);
  coreLight.position.set(-0.35, 0.2, 0.55); mark.add(coreLight);
  const cyanLight = new THREE.PointLight(0x3aa3e0, 2.9, 4.5, 1.5);
  cyanLight.position.set(0.5, 0.08, 0.55); mark.add(cyanLight);
  const tealLight = new THREE.PointLight(0x18d090, 2.6, 4, 1.5);
  tealLight.position.set(0.95, -0.85, 0.4); mark.add(tealLight);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.65, 0.012, isMobile ? 6 : 8, isMobile ? 48 : 96),
    new THREE.MeshBasicMaterial({ color: 0x3aa3e0, transparent: true, opacity: 0.32 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.4;
  scene.add(ring);
  const floorGlow = new THREE.Mesh(
    new THREE.CircleGeometry(1.9, isMobile ? 24 : 48),
    new THREE.MeshBasicMaterial({ color: 0x6020a0, transparent: true, opacity: 0.1, side: THREE.DoubleSide })
  );
  floorGlow.rotation.x = -Math.PI / 2;
  floorGlow.position.y = -1.41;
  scene.add(floorGlow);

  mark.position.set(-0.45, 0.15, 0);
  mark.scale.setScalar(1.28);
  mark.rotation.y = 0.32;
  mark.rotation.x = -0.06;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), isMobile ? 0.22 : 0.34, 0.4, 0.82);
  if (!isMobile) composer.addPass(bloom);
  composer.addPass(new OutputPass());
  let useBloom = !isMobile;

  const pickables = [shell, shellL, tailMesh, ...facets];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(0, 0);
  let hovered = null;
  let dragging = false;
  let lastX = 0, lastY = 0;
  let velY = 0, velX = 0;
  let targetRotY = 0.32;
  let targetRotX = -0.06;
  let rotY = 0.32, rotX = -0.06;
  let pulseT = 0;
  let pulseTarget = null;
  let idle = 0;
  let lastInteract = performance.now();
  let visible = true;

  function setPointerFromEvent(e) {
    const el = renderer.domElement;
    const rect = el.getBoundingClientRect();
    const cx = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - rect.left;
    const cy = (e.clientY ?? e.touches?.[0]?.clientY ?? 0) - rect.top;
    pointer.x = (cx / rect.width) * 2 - 1;
    pointer.y = -(cy / rect.height) * 2 + 1;
  }

  function highlight(obj, on) {
    if (!obj?.material) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const m of mats) {
      if ('emissive' in m) {
        if (!m.userData._baseEm) m.userData._baseEm = m.emissive.clone();
        if (m.userData._baseEi === undefined) m.userData._baseEi = m.emissiveIntensity ?? 0;
        if (on) {
          m.emissive.copy(m.userData._baseEm);
          m.emissiveIntensity = m.userData._baseEi + 0.035;
        } else {
          m.emissive.copy(m.userData._baseEm);
          m.emissiveIntensity = m.userData._baseEi;
        }
      }
    }
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    const hitObj = hits[0]?.object ?? null;
    if (hitObj !== hovered) {
      if (hovered) highlight(hovered, false);
      hovered = hitObj;
      if (hovered) highlight(hovered, true);
      const label = document.querySelector('.hud-callout.c1');
      if (label && hovered) label.childNodes[label.childNodes.length - 1].textContent = hovered.name;
    }
  }

  const surface = hit || renderer.domElement;

  surface.addEventListener('pointerdown', (e) => {
    dragging = true;
    resume();
    lastX = e.clientX; lastY = e.clientY;
    lastInteract = performance.now();
    hero.classList.add('is-dragged');
    surface.setPointerCapture?.(e.pointerId);
    setPointerFromEvent(e);
    pick();
    if (hovered) {
      pulseTarget = hovered;
      pulseT = 1;
    }
  });
  surface.addEventListener('pointerup', (e) => {
    dragging = false;
    surface.releasePointerCapture?.(e.pointerId);
  });
  function clearHighlight() {
    if (hovered) highlight(hovered, false);
    hovered = null;
    if (pulseTarget?.material) pulseTarget.material.emissiveIntensity = pulseTarget.material.userData._baseEi ?? 0.2;
    pulseTarget = null; pulseT = 0;
  }
  surface.addEventListener('pointerleave', () => { dragging = false; clearHighlight(); });
  surface.addEventListener('pointercancel', () => { dragging = false; clearHighlight(); });
  surface.addEventListener('pointermove', (e) => {
    setPointerFromEvent(e);
    if (!dragging) { pick(); return; }
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    targetRotY += dx * 0.006;
    targetRotX += dy * 0.0035;
    targetRotX = Math.max(-0.12, Math.min(0.02, targetRotX));
    targetRotY = Math.max(0.22, Math.min(0.42, targetRotY));
    velY = dx * 0.0004;
    velX = dy * 0.0002;
    lastInteract = performance.now();
  });

  function resize() {
    const w = stage.clientWidth || innerWidth;
    const h = stage.clientHeight || innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    if (useBloom) bloom.setSize(w, h);
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  let raf = 0;
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    if (visible) resume(); else pause();
  }, { threshold: 0.05 });
  io.observe(hero);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else resume(); });

  // Motion offsets never accumulate into drag state. Active time pauses offscreen.
  let activeTime = 0, lastFrame = performance.now(), scrollPose = 0, mobileFrames = 0;
  const updateScrollPose = () => {
    const rect = hero.getBoundingClientRect();
    hero.dataset.motionProgress = String(Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height))));
  };
  addEventListener('scroll', updateScrollPose, { passive: true });
  updateScrollPose();
  function frame(now) {
    raf = 0;
    const dt = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    if (!visible || document.hidden) return;
    activeTime += dt;
    const t = activeTime;
    scrollPose += ((Number(hero.dataset.motionProgress) || 0) - scrollPose) * (1 - Math.exp(-7 * dt));

    if (!dragging) {
      targetRotY += velY;
      targetRotX += velX;
      velY *= Math.exp(-3.5 * dt);
      velX *= Math.exp(-3.5 * dt);
      if (performance.now() - lastInteract > 1800) {
        idle += dt;
        // Bounded analytic idle instead of unbounded frame-rate-dependent drift.
      }
    }

    targetRotY = Math.max(0.22, Math.min(0.42, targetRotY));
    targetRotX = Math.max(-0.12, Math.min(0.02, targetRotX));
    rotY += (targetRotY - rotY) * (1 - Math.exp(-8 * dt));
    rotX += (targetRotX - rotX) * (1 - Math.exp(-8 * dt));
    const idleWeight = dragging ? 0 : Math.min(1, Math.max(0, (performance.now() - lastInteract - 1800) / 1400));
    const phase = t * Math.PI * 2 / 24;
    mark.rotation.y = rotY + Math.sin(phase) * 0.010 * idleWeight + scrollPose * 0.025;
    mark.rotation.x = rotX + Math.sin(phase * 2) * 0.004 * idleWeight - scrollPose * 0.012;
    mark.position.y = 0.15 + Math.sin(t * Math.PI * 2 / 24) * 0.025 - scrollPose * 0.08;
    ring.rotation.z = t * 0.08;
    coreLight.intensity = 3.6 + Math.sin(t * Math.PI * 2 / 24) * 0.08 + scrollPose * 0.025;
    cyanLight.intensity = 2.4 + Math.sin(t * Math.PI * 2 / 24) * 0.06;
    tealLight.intensity = 2.2 + Math.sin(t * Math.PI * 2 / 24) * 0.05;

    if (pulseT > 0 && pulseTarget) {
      pulseT = Math.max(0, pulseT - dt * 1.6);
      const mats = Array.isArray(pulseTarget.material) ? pulseTarget.material : [pulseTarget.material];
      mats.forEach((m) => {
        if ('emissiveIntensity' in m) m.emissiveIntensity = (m.userData._baseEi ?? 0.2) + pulseT * 0.04;
      });
    }

    composer.render();
    if (isMobile) mobileFrames += 1;
    if (!isMobile || dragging || mobileFrames < 2) raf = requestAnimationFrame(frame);
  }
  function resume() {
    if (raf || !visible || document.hidden) return;
    lastFrame = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    cancelAnimationFrame(raf);
    raf = 0;
  }
  resume();
  hero.classList.add('is-ready');
}
