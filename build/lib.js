// Piezas compartidas por las tarjetas SVG de TheMagios: paleta, fuentes incrustadas,
// fondo de cielo con nubes y tarjetas con contorno grueso estilo caricatura.
// Las fuentes van en base64 porque GitHub muestra los SVG como <img>, que no carga
// recursos externos. Fuentes de licencia libre: Luckiest Guy (Apache 2.0) y Fredoka (OFL).
const fs = require('fs');
const path = require('path');

const W = 1280;
const C = {
  ink: '#1b1b1f',
  sky0: '#6cc9ff', sky1: '#2f8fe6',
  cloud: '#ffffff', cloudShade: '#dff1ff',
  yellow: '#ffd90f', yellowDeep: '#ffc400', orange: '#ff9f1c',
  cream: '#fffbea', paper: '#fff4c2',
  red: '#ef4135', green: '#3fbf5f', blue: '#2563eb', violet: '#8b5cf6', pink: '#ff6fae',
  text: '#1b1b1f', soft: '#3d3a33', dim: '#6b6455',
};

const font = f => fs.readFileSync(path.join(__dirname, 'fonts', f)).toString('base64');
const FONTS = `
@font-face{font-family:LG;src:url(data:font/woff2;base64,${font('luckiest-guy-latin-400-normal.woff2')}) format('woff2')}
@font-face{font-family:FR;font-weight:500;src:url(data:font/woff2;base64,${font('fredoka-latin-500-normal.woff2')}) format('woff2')}
@font-face{font-family:FR;font-weight:700;src:url(data:font/woff2;base64,${font('fredoka-latin-700-normal.woff2')}) format('woff2')}`;

// Animaciones reutilizables. --d es el retraso de cada elemento (cascada).
const BASE_CSS = `
${FONTS}
text{font-family:FR,'Comic Sans MS','Segoe UI',sans-serif;font-weight:500}
.lg{font-family:LG,'Arial Black',Impact,sans-serif;font-weight:400}
.out{paint-order:stroke fill;stroke:${C.ink};stroke-linejoin:round;stroke-linecap:round}
.rise{opacity:0;animation:rise .8s cubic-bezier(.3,1.4,.5,1) var(--d,0s) both}
.pop{opacity:0;transform-box:fill-box;transform-origin:center;animation:pop .7s cubic-bezier(.3,1.7,.5,1) var(--d,0s) both}
.fade{opacity:0;animation:fade 1s ease var(--d,0s) both}
.draw{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:draw var(--dur,1.6s) cubic-bezier(.6,0,.2,1) var(--d,0s) forwards}
.bob{transform-box:fill-box;transform-origin:center bottom;animation:bob 3s ease-in-out var(--d,0s) infinite}
.wob{transform-box:fill-box;transform-origin:center;animation:wob 4s ease-in-out var(--d,0s) infinite}
.blink{animation:blink 1.2s steps(2) var(--d,0s) infinite}
.drift{animation:drift var(--t,60s) linear var(--d,0s) infinite}
.spin{transform-box:fill-box;transform-origin:center;animation:spin 40s linear infinite}
@keyframes rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:scale(.3) rotate(-8deg)}100%{opacity:1;transform:none}}
@keyframes fade{to{opacity:1}}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes wob{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes blink{0%{opacity:1}100%{opacity:.2}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(${W + 400}px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){*{animation-duration:1ms!important;animation-iteration-count:1!important}}`;

const DEFS = `
<linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky0}"/><stop offset="1" stop-color="${C.sky1}"/></linearGradient>
<pattern id="pDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="2.2" fill="#000" fill-opacity=".09"/></pattern>`;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Nube de caricatura: círculos negros un poco más grandes debajo de los blancos,
// así el contorno queda continuo y sin líneas internas.
const PUFFS = [[0, 0, 26], [30, -14, 32], [66, -6, 28], [92, 6, 20], [46, 10, 24], [14, 12, 20], [76, 14, 18]];
function cloud(x, y, s = 1, sw = 4) {
  const k = PUFFS.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r + sw / s}" fill="${C.ink}"/>`).join('');
  const w = PUFFS.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.cloud}"/>`).join('');
  const sh = `<ellipse cx="50" cy="20" rx="44" ry="9" fill="${C.cloudShade}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${k}${w}${sh}</g>`;
}

// Nubes que cruzan el cielo en bucle (salen por la derecha y vuelven a entrar).
function skyClouds(h, seed = 1) {
  const rows = [[0.18, 0.55, 70], [0.42, 0.8, 95], [0.7, 0.45, 60], [0.88, 0.65, 85]];
  return rows.map(([fy, s, t], i) => {
    const y = Math.round(h * fy), off = ((i * 37 + seed * 53) % 100) / 100;
    return `<g class="drift" style="--t:${t}s;--d:${-(off * t).toFixed(1)}s" opacity=".95">${cloud(-260, y, s)}</g>`;
  }).join('');
}

// Lienzo: cielo, nubes, marco negro grueso y título de sección.
function frame({ h, kicker, title, body, css = '', defs = '', seed = 1 }) {
  const head = kicker ? `
  <g class="rise" style="--d:0s">
    <g class="wob" style="--d:.4s">
      <rect x="44" y="34" width="${kicker.length * 13.2 + 40}" height="40" rx="20" fill="${C.ink}" transform="translate(4 4)"/>
      <rect x="44" y="34" width="${kicker.length * 13.2 + 40}" height="40" rx="20" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4"/>
      <text x="64" y="63" class="lg" font-size="22" letter-spacing="1.5" fill="${C.ink}">${esc(kicker)}</text>
    </g>
    <text x="48" y="122" class="lg out" font-size="38" stroke-width="9" fill="${C.cream}">${esc(title)}</text>
  </g>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-label="${esc(title || kicker || '')}">
<style>${BASE_CSS}${css}</style>
<defs>${DEFS}${defs}<clipPath id="clipF"><rect width="${W}" height="${h}" rx="26"/></clipPath></defs>
<g clip-path="url(#clipF)">
<rect width="${W}" height="${h}" fill="url(#gSky)"/>
${skyClouds(h, seed)}
</g>
<rect x="3" y="3" width="${W - 6}" height="${h - 6}" rx="24" fill="none" stroke="${C.ink}" stroke-width="6"/>
${head}
${body}
</svg>`;
}

// Tarjeta caricatura: sombra dura desplazada + relleno claro + contorno grueso.
function card({ x, y, w, h, fill = C.cream, r = 20, sw = 5, sh = 8 }) {
  return `
  <rect x="${x + sh}" y="${y + sh}" width="${w}" height="${h}" rx="${r}" fill="${C.ink}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${C.ink}" stroke-width="${sw}"/>`;
}

// Etiqueta tipo píldora con contorno.
function pill(x, y, label, fill = C.yellow, size = 16) {
  const w = label.length * size * 0.56 + 26;
  return { w, svg: `<g><rect x="${x}" y="${y}" width="${w}" height="${size + 16}" rx="${(size + 16) / 2}" fill="${fill}" stroke="${C.ink}" stroke-width="3"/>
    <text x="${x + w / 2}" y="${y + size + 3}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${C.ink}">${esc(label)}</text></g>` };
}

// Icono de simple-icons (viewBox 24) escalado a `size`.
function icon(name, x, y, size, color) {
  const svg = fs.readFileSync(path.join(__dirname, 'icons', name + '.svg'), 'utf8');
  const d = svg.match(/ d="([^"]+)"/)[1];
  return `<path transform="translate(${x} ${y}) scale(${size / 24})" d="${d}" fill="${color}"/>`;
}

// Contador tipo odómetro: cada dígito es una columna 0–9 (x2) que se desliza.
let odoId = 0;
function odometer({ x, y, value, size, color = C.ink, d = 0, prefix = '', anchor = 'middle' }) {
  const str = String(value), cw = size * 0.62, lh = size * 1.6, win = size * 1.0;
  const total = (prefix.length + str.length) * cw;
  const cx = anchor === 'middle' ? x - total / 2 : x;
  const id = `odo${odoId++}`;
  const top = y - size * 0.86, base = size * 0.86;
  let out = `<svg x="${cx - 8}" y="${top}" width="${total + 16}" height="${win}" overflow="hidden"><g class="lg out" font-size="${size}" fill="${color}" stroke-width="7">`;
  let lx = 8;
  for (const ch of prefix) { out += `<text x="${lx}" y="${base}" class="lg out fade" style="--d:${d}s">${esc(ch)}</text>`; lx += cw; }
  [...str].forEach((ch, i) => {
    const steps = 10 + +ch;
    const col = Array.from({ length: 20 }, (_, k) => `<tspan x="${lx}" y="${base + k * lh}">${k % 10}</tspan>`).join('');
    out += `<text style="animation:${id}_${i} ${1.4 + i * 0.25}s cubic-bezier(.2,.7,.2,1) ${d}s both">${col}</text>
    <style>@keyframes ${id}_${i}{from{transform:translateY(0)}to{transform:translateY(${-steps * lh}px)}}</style>`;
    lx += cw;
  });
  return out + '</g></svg>';
}

module.exports = { W, C, frame, card, pill, cloud, icon, odometer, esc };
