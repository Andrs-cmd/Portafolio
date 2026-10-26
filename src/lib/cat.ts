// @ts-nocheck
/* eslint-disable */
/* Gato procedural portado de bigotes-web/cat.js (modelo Three.js del usuario). */
import * as THREE from 'three';

const D = THREE.MathUtils.degToRad;
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
export const CAT_H = 2.6; // altura sentado, en unidades

export const FUR = {
  naranja: ['#e3883b', '#a4501b', '#f6d1a0'],
  negro: ['#242022', '#0d0b0c', '#47403f'],
  gris: ['#8e9098', '#55575e', '#c9cbd0'],
  crema: ['#ecdcc2', '#c4a77d', '#faf2e4'],
  blanco: ['#f1eee9', '#cfc8bf', '#ffffff'],
  chocolate: ['#6e4834', '#3e271b', '#a07058'],
  marron: ['#8b6546', '#3b281b', '#cfac86'],
  piel: ['#e6b5a3', '#c38976', '#f5d5c9'],
};
export const EYES = { ambar: '#e2a224', verde: '#82c046', azul: '#5aa6ec', cobre: '#cf6a26' };
const POINT = '#4a3428', WHITE = '#f4f1ec', PINK = '#e7a08f', INNER = '#e9a9a0';

export const POSES = {
  sit: { pitch: 50, bodyY: 0.85, bodyZ: -0.15, headUp: 0.48, headFwd: 0.1, headPitch: 0, headTilt: 0, reach: 1, footFwd: 0.5, earUp: 0, eyeOpen: 1, pupil: 0.38, lookAmt: 1, tailYaw: 15, tailPitch: -55, tailLift: 58, tailCurl: 150, tailWave: 8, tailSpeed: 1.4, tailHook: 0, squash: 1 },
  loaf: { pitch: 4, bodyY: 0.56, bodyZ: -0.2, headUp: 0.34, headFwd: 0.16, headPitch: 4, headTilt: 0, reach: 0, footFwd: 0.25, earUp: 0, eyeOpen: 0.55, pupil: 0.3, lookAmt: 0.5, tailYaw: 20, tailPitch: -30, tailLift: 30, tailCurl: 170, tailWave: 4, tailSpeed: 1, tailHook: 0, squash: 1 },
  alert: { pitch: 58, bodyY: 0.88, bodyZ: -0.15, headUp: 0.56, headFwd: 0.06, headPitch: -8, headTilt: 0, reach: 1, footFwd: 0.5, earUp: 1, eyeOpen: 1.2, pupil: 0.85, lookAmt: 1, tailYaw: 0, tailPitch: 80, tailLift: -5, tailCurl: 0, tailWave: 14, tailSpeed: 3, tailHook: -120, squash: 1 },
  sleep: { pitch: 0, bodyY: 0.5, bodyZ: -0.2, headUp: 0.1, headFwd: 0.26, headPitch: 28, headTilt: 32, reach: 0, footFwd: 0.22, earUp: -0.3, eyeOpen: 0, pupil: 0.3, lookAmt: 0, tailYaw: 30, tailPitch: -25, tailLift: 25, tailCurl: 200, tailWave: 2, tailSpeed: 0.6, tailHook: 0, squash: 0.92 },
};
export const lerpPose = (a, b, k) => { for (const key in b) a[key] += (b[key] - a[key]) * k; return a; };

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a, b, t) => '#' + hex(a).map((c, i) => Math.round(c + (hex(b)[i] - c) * t).toString(16).padStart(2, '0')).join('');

function tex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function fuzz(x, w, h, light, dark, n) {
  for (let i = 0; i < n; i++) {
    x.strokeStyle = Math.random() < 0.5 ? light : dark;
    x.globalAlpha = 0.07 + Math.random() * 0.08; x.lineWidth = 1 + Math.random() * 1.5;
    const px = Math.random() * w, py = Math.random() * h;
    x.beginPath(); x.moveTo(px, py); x.lineTo(px + (Math.random() - 0.5) * 4, py + 4 + Math.random() * 8); x.stroke();
  }
  x.globalAlpha = 1;
}
function wave(x, y0, x0, x1, amp, f, ph) {
  x.beginPath();
  for (let px = x0; px <= x1; px += 6) { const py = y0 + Math.sin(px * f + ph) * amp; px === x0 ? x.moveTo(px, py) : x.lineTo(px, py); }
  x.stroke();
}

// Cuerpo: eje X = alrededor (0-0.5 panza, 0.5-1 lomo), eje Y = de pecho (arriba) a cola (abajo)
function bodyTexture(cfg, [base, dark, light]) {
  return tex(512, 512, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, light); g.addColorStop(0.25, mix(base, light, 0.6)); g.addColorStop(0.5, base); g.addColorStop(0.75, mix(base, dark, 0.25)); g.addColorStop(1, base);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    if (cfg.pattern === 'tabby') {
      x.strokeStyle = dark; x.lineCap = 'round';
      for (let k = 0; k < 10; k++) { x.globalAlpha = 0.85; x.lineWidth = 12 + (k % 3) * 5; wave(x, 30 + k * 48, w * 0.36, w * 1.02, 10, 0.03, k); }
      x.globalAlpha = 0.5; x.fillStyle = dark; x.fillRect(w * 0.7, 0, w * 0.1, h); x.globalAlpha = 1;
    }
    if (cfg.pattern === 'bicolor') {
      x.fillStyle = WHITE;
      x.beginPath(); x.moveTo(0, 0); x.lineTo(w * 0.62, 0);
      for (let py = 0; py <= h; py += 16) x.lineTo(w * (0.42 + Math.sin(py * 0.03) * 0.04 + (py < 120 ? 0.18 * (1 - py / 120) : 0)), py);
      x.lineTo(0, h); x.fill();
    }
    if (cfg.pattern === 'points') {
      const p = x.createLinearGradient(0, 0, 0, h);
      p.addColorStop(0, 'rgba(74,52,40,0)'); p.addColorStop(0.75, 'rgba(74,52,40,0.12)'); p.addColorStop(1, 'rgba(74,52,40,0.55)');
      x.fillStyle = p; x.fillRect(0, 0, w, h);
    }
    fuzz(x, w, h, light, dark, cfg.fur === 'piel' ? 300 : 2600);
  });
}
// Cabeza: cara centrada en x = 0.25
function headTexture(cfg, [base, dark, light]) {
  return tex(512, 256, (x, w, h) => {
    x.fillStyle = base; x.fillRect(0, 0, w, h);
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, light + '88');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    if (cfg.pattern === 'tabby') {
      x.strokeStyle = dark; x.lineCap = 'round'; x.lineWidth = 9;
      for (const dx of [-22, -8, 8, 22]) { x.beginPath(); x.moveTo(128 + dx, 18); x.lineTo(128 + dx * 0.7, 74); x.stroke(); }
      x.lineWidth = 7;
      for (const s of [-1, 1]) for (let k = 0; k < 3; k++) wave(x, 120 + k * 16, 128 + s * 62 - 22, 128 + s * 62 + 22, 3, 0.2, k);
      x.lineWidth = 11;
      for (let k = 0; k < 6; k++) { x.beginPath(); x.moveTo(270 + k * 34, 10); x.lineTo(262 + k * 34, 110); x.stroke(); }
    }
    if (cfg.pattern === 'bicolor') {
      x.fillStyle = WHITE;
      x.beginPath(); x.moveTo(121, 58); x.lineTo(135, 58); x.quadraticCurveTo(150, 120, 214, h); x.lineTo(42, h); x.quadraticCurveTo(106, 120, 121, 58); x.fill();
    }
    if (cfg.pattern === 'points') {
      const r = x.createRadialGradient(128, 160, 10, 128, 160, 112);
      r.addColorStop(0, POINT); r.addColorStop(0.6, POINT + 'ee'); r.addColorStop(1, POINT + '00');
      x.fillStyle = r; x.fillRect(0, 0, w, h);
    }
    fuzz(x, w, h, light, dark, cfg.fur === 'piel' ? 120 : 1200);
  });
}
function shadowTexture() {
  return tex(256, 256, (x) => {
    const r = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, 'rgba(0,0,0,0.42)'); r.addColorStop(0.55, 'rgba(0,0,0,0.16)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = r; x.fillRect(0, 0, 256, 256);
  });
}

function placeLimb(mesh, a, b) {
  const d = b.clone().sub(a), len = Math.max(d.length(), 0.001);
  mesh.position.copy(a).addScaledVector(d, 0.5);
  mesh.quaternion.setFromUnitVectors(UP, d.normalize());
  mesh.scale.set(1, len, 1);
}

export function buildCat(cfg) {
  const pal = FUR[cfg.fur] || FUR.naranja, [base, dark, light] = pal;
  const skin = cfg.fur === 'piel', pat = cfg.pattern, fluff = cfg.fluff || 0, slim = cfg.slim || 0;
  const ext = pat === 'points' ? POINT : base;
  const pawC = pat === 'bicolor' ? WHITE : pat === 'points' ? POINT : base;
  const chestC = pat === 'bicolor' ? WHITE : pat === 'points' ? light : pat === 'tabby' ? mix(base, light, 0.45) : base;
  const muzzleC = pat === 'bicolor' ? WHITE : pat === 'points' ? POINT : mix(base, light, 0.55);

  const furMat = (opts) => new THREE.MeshPhysicalMaterial({
    roughness: skin ? 0.55 : 0.92, sheen: skin ? 0.25 : 1, sheenRoughness: 0.55,
    sheenColor: new THREE.Color(light), ...opts,
  });
  const bodyMat = furMat({ map: bodyTexture(cfg, pal) });
  const headMat = furMat({ map: headTexture(cfg, pal) });
  const colMat = {};
  const solid = (c) => (colMat[c] ||= furMat({ color: c }));
  const plain = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o });

  const root = new THREE.Group();
  root.scale.setScalar(cfg.size || 1);
  const sph = (r, ws = 32, hs = 20) => new THREE.SphereGeometry(r, ws, hs);

  const bodyGeo = sph(1, 48, 32); bodyGeo.rotateX(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  const bs = [0.56 * (1 - slim * 0.45) + fluff * 0.06, 0.56 * (1 - slim * 0.35) + fluff * 0.05, 0.98];
  const chest = new THREE.Mesh(sph(0.42 * (1 - slim * 0.3) + fluff * 0.14), solid(chestC));
  root.add(body, chest);

  const legGeo = new THREE.CylinderGeometry(0.082 * (1 - slim * 0.25) + fluff * 0.014, 0.092 * (1 - slim * 0.25) + fluff * 0.016, 1, 14);
  const pawGeo = sph(0.1, 20, 12);
  const legs = [-1, 1].map((s) => {
    const leg = new THREE.Mesh(legGeo, solid(ext)), paw = new THREE.Mesh(pawGeo, solid(pawC));
    paw.scale.set(1.05, 0.7, 1.35);
    const haunch = new THREE.Mesh(sph(1, 28, 18), bodyMat);
    haunch.scale.set(0.3 + fluff * 0.04, 0.4 + fluff * 0.04, 0.46);
    const foot = new THREE.Mesh(pawGeo, solid(pawC)); foot.scale.set(1, 0.65, 1.7);
    root.add(leg, paw, haunch, foot);
    return { s, leg, paw, haunch, foot };
  });

  // cabeza
  const head = new THREE.Group(); root.add(head);
  const skull = new THREE.Mesh(sph(0.42, 40, 28), headMat);
  skull.scale.set(1.1 - slim * 0.08, 0.95, 1);
  head.add(skull);
  if (fluff) {
    const ruff = new THREE.Mesh(sph(0.36, 24, 16), solid(mix(base, light, 0.5)));
    ruff.scale.set(1.45, 0.8, 1.0); ruff.position.set(0, -0.3, 0.02); head.add(ruff);
  }
  for (const s of [-1, 1]) {
    const pad = new THREE.Mesh(sph(0.115, 20, 14), solid(muzzleC)); pad.position.set(s * 0.075, -0.13, 0.33); head.add(pad);
    const cheek = new THREE.Mesh(sph(0.2, 20, 14), headMat); cheek.position.set(s * 0.2, -0.12, 0.2); cheek.scale.set(1, 0.8, 0.9); head.add(cheek);
  }
  const chin = new THREE.Mesh(sph(0.08, 16, 10), solid(muzzleC)); chin.position.set(0, -0.23, 0.29); head.add(chin);
  const nose = new THREE.Mesh(sph(0.045, 16, 10), plain(skin ? '#c97b6c' : pat === 'points' || cfg.fur === 'negro' ? '#2b1f1f' : PINK, { roughness: 0.35 }));
  nose.scale.set(1.3, 0.75, 0.7); nose.position.set(0, -0.06, 0.42); head.add(nose);

  const eyes = [-1, 1].map((s) => {
    const g = new THREE.Group(); g.position.set(s * 0.16, 0.04, 0.32); g.rotation.y = s * 0.32;
    const iris = new THREE.Mesh(sph(0.085, 24, 16), new THREE.MeshPhysicalMaterial({ color: EYES[cfg.eyes] || EYES.ambar, roughness: 0.15, clearcoat: 1, emissive: EYES[cfg.eyes] || EYES.ambar, emissiveIntensity: 0.18 }));
    const pupil = new THREE.Mesh(sph(0.05, 16, 12), plain('#070707', { roughness: 0.2 }));
    pupil.position.z = 0.055; pupil.scale.set(0.38, 1, 0.45);
    const shine = new THREE.Mesh(sph(0.016, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
    shine.position.set(0.024, 0.03, 0.078);
    g.add(iris, pupil, shine); head.add(g);
    return { g, pupil, shine };
  });

  const earScale = cfg.ears === 'big' ? 1.35 : cfg.ears === 'fold' ? 0.62 : 1;
  const ears = [-1, 1].map((s) => {
    const g = new THREE.Group(); g.position.set(s * 0.23, 0.28, -0.02);
    const og = new THREE.ConeGeometry(0.17, 0.34, 18); og.translate(0, 0.17, 0);
    const outer = new THREE.Mesh(og, solid(pat === 'points' ? POINT : base)); outer.scale.set(1, 1, 0.45);
    const ig = new THREE.ConeGeometry(0.115, 0.25, 14); ig.translate(0, 0.13, 0);
    const inner = new THREE.Mesh(ig, plain(skin ? '#d99a8a' : INNER, { roughness: 0.8 })); inner.scale.set(1, 1, 0.3); inner.position.z = 0.035;
    g.add(outer, inner);
    if (cfg.ears === 'tufted' || fluff) {
      const tg = new THREE.ConeGeometry(0.025, 0.14, 8); tg.translate(0, 0.07, 0);
      const tuft = new THREE.Mesh(tg, solid(dark)); tuft.position.y = 0.32; g.add(tuft);
    }
    g.scale.setScalar(earScale); head.add(g);
    return { s, g };
  });

  const wpos = [];
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) wpos.push(s * 0.12, -0.12 - k * 0.025, 0.4, s * (0.58 + k * 0.03), -0.06 - k * 0.07, 0.36 - k * 0.04);
  const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(wpos, 3));
  head.add(new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ color: cfg.fur === 'blanco' || cfg.fur === 'crema' ? '#b9b0a4' : '#f4f0ea', transparent: true, opacity: 0.75 })));

  // cola
  const N = 16, tail = [];
  for (let i = 0; i < N; i++) {
    const k = i / (N - 1), r = (0.085 - k * 0.035) * (1 + fluff * 0.7);
    let c = ext;
    if (pat === 'tabby') c = Math.floor(i / 2) % 2 ? dark : base;
    if (pat === 'bicolor' && i > N - 4) c = WHITE;
    const m = new THREE.Mesh(sph(r, 18, 12), solid(c)); m.userData.r = r;
    root.add(m); tail.push(m);
  }

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.6), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, 0.005, -0.1); shadow.renderOrder = -1;
  root.add(shadow);

  const tmp = { chest: V(), rear: V() };
  return {
    group: root, cfg,
    update(t, P, look, fx) {
      const pitch = D(P.pitch), fwd = V(0, Math.sin(pitch), Math.cos(pitch));
      const br = 1 + Math.sin(t * (P.eyeOpen < 0.1 ? 1.4 : 2.2)) * 0.018;
      body.position.set(0, P.bodyY, P.bodyZ); body.rotation.x = -pitch;
      body.scale.set(bs[0] * br, bs[1] * br * P.squash, bs[2]);
      const c = tmp.chest.copy(body.position).addScaledVector(fwd, 0.7);
      const rear = tmp.rear.copy(body.position).addScaledVector(fwd, -0.66);
      chest.position.copy(c).add(V(0, -0.03, 0.03));
      chest.scale.setScalar(br);

      head.position.copy(c).add(V(0, P.headUp, P.headFwd));
      head.rotation.set(D(P.headPitch) + look.pitch * P.lookAmt, look.yaw * P.lookAmt, D(P.headTilt) + fx.happy * 0.22, 'YXZ');

      for (const l of legs) {
        const sh = c.clone().add(V(l.s * 0.19, -0.12, 0.06));
        const paw = V(l.s * 0.2, 0.1, c.z - 0.02).lerp(V(l.s * 0.21, 0.07, c.z + 0.14), P.reach);
        placeLimb(l.leg, sh, paw);
        l.paw.position.copy(paw);
        l.haunch.position.set(l.s * 0.3, Math.max(rear.y, 0.36), rear.z + 0.12);
        l.haunch.rotation.x = -pitch * 0.4;
        l.foot.position.set(l.s * 0.3, 0.065, rear.z + P.footFwd);
      }

      const blink = fx.blink, open = Math.max(0.06, P.eyeOpen * (1 - blink) * (1 - fx.happy * 0.85));
      for (const e of eyes) {
        e.g.scale.set(1, Math.min(open, 1.25), 1);
        e.pupil.position.x = look.px * 0.028; e.pupil.position.y = look.py * 0.022;
        e.pupil.scale.x = P.pupil;
        e.shine.visible = open > 0.3;
      }
      for (const e of ears) {
        const fold = cfg.ears === 'fold';
        e.g.rotation.set(fold ? 1.15 : -0.18 * P.earUp + fx.happy * 0.25, 0, e.s * (-0.32 - fx.happy * 0.25 - (e.s > 0 ? fx.twitch * 0.35 : 0)));
      }

      const p = rear.clone().add(V(0, 0.04, -0.06));
      const seg = 0.1 * (1 + fluff * 0.1);
      for (let i = 0; i < N; i++) {
        const k = i / (N - 1);
        const yaw = D(P.tailYaw + P.tailCurl * k) + D(P.tailWave) * Math.sin(t * P.tailSpeed - i * 0.45) * k;
        const pt = D(P.tailPitch + P.tailLift * k + (k > 0.7 ? P.tailHook * (k - 0.7) / 0.3 : 0));
        p.x += Math.sin(yaw) * Math.cos(pt) * seg;
        p.y += Math.sin(pt) * seg;
        p.z += -Math.cos(yaw) * Math.cos(pt) * seg;
        const r = tail[i].userData.r;
        if (p.y < r) p.y = r;
        tail[i].position.copy(p);
      }
    },
    dispose() {
      root.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { o.material.map?.dispose(); o.material.dispose(); } });
    },
  };
}
