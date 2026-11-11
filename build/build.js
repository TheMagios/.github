// Genera las tarjetas SVG animadas del perfil de TheMagios en profile/assets/.
// Uso: node build/build.js
// Datos tomados de la API de GitHub (gh api) el 10 nov 2026: fechas de la org, del repo
// MProspector y de sus commits, integrantes y lenguajes. Si cambian, se actualizan aquí.
const fs = require('fs');
const path = require('path');
const { W, C, frame, card, pill, cloud, icon, odometer, esc } = require('./lib');

const OUT = path.join(__dirname, '..', 'profile', 'assets');
fs.mkdirSync(OUT, { recursive: true });
const out = (name, svg) => fs.writeFileSync(path.join(OUT, name), svg);
const PAD = 48, GAP = 24;

const dataUri = f => {
  const b = fs.readFileSync(path.join(__dirname, f));
  const mime = b[0] === 0x89 ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${b.toString('base64')}`;
};

// Iconos dibujados a mano, contorno grueso (caja 64x64).
const glyph = {
  web: (x, y) => `<g transform="translate(${x} ${y})">
    <rect x="2" y="6" width="60" height="50" rx="8" fill="#fff" stroke="${C.ink}" stroke-width="4"/>
    <path d="M2 20 V14 a8 8 0 0 1 8 -8 H54 a8 8 0 0 1 8 8 V20 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="12" cy="13" r="2.6" fill="${C.red}"/><circle cx="20" cy="13" r="2.6" fill="${C.orange}"/><circle cx="28" cy="13" r="2.6" fill="${C.green}"/>
    <text x="32" y="46" text-anchor="middle" class="lg" font-size="20" fill="${C.blue}">&lt;/&gt;</text>
    <rect x="44" y="34" width="3" height="14" fill="${C.ink}" class="blink"/>
  </g>`,
  gear: (x, y) => {
    const teeth = n => Array.from({ length: n }, (_, i) => `<rect x="-5" y="-24" width="10" height="10" rx="2" transform="rotate(${(360 / n) * i})"/>`).join('');
    return `<g transform="translate(${x} ${y})">
    <g transform="translate(26 30)"><g style="animation:spin 6s linear infinite" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3.5">${teeth(8)}<circle r="17"/><circle r="6" fill="#fff"/></g></g>
    <g transform="translate(50 50) scale(.6)"><g style="animation:spin 4s linear infinite reverse" fill="${C.orange}" stroke="${C.ink}" stroke-width="5">${teeth(8)}<circle r="17"/><circle r="6" fill="#fff"/></g></g>
  </g>`;
  },
  bot: (x, y) => `<g transform="translate(${x} ${y})"><g class="bob">
    <line x1="32" y1="4" x2="32" y2="14" stroke="${C.ink}" stroke-width="4"/><circle cx="32" cy="5" r="5" fill="${C.red}" stroke="${C.ink}" stroke-width="3" class="blink"/>
    <rect x="8" y="14" width="48" height="38" rx="12" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4"/>
    <circle cx="23" cy="32" r="7" fill="#fff" stroke="${C.ink}" stroke-width="3"/><circle cx="41" cy="32" r="7" fill="#fff" stroke="${C.ink}" stroke-width="3"/>
    <circle cx="24" cy="33" r="2.6" fill="${C.ink}"/><circle cx="42" cy="33" r="2.6" fill="${C.ink}"/>
    <path d="M24 45 q8 5 16 0" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
  </g></g>`,
};

// ─── Qué hacemos ──────────────────────────────────────────────────────────
{
  const items = [
    ['web', 'Apps web a medida', ['Paneles, herramientas internas', 'y sitios con Laravel, PHP', 'y Tailwind.'], C.yellow],
    ['gear', 'Backends y APIs', ['Servicios con Java, Spring Boot', 'y PHP, pensados para crecer', 'sin romperse.'], '#ffe9a8'],
    ['bot', 'Automatización con IA', ['Agentes con Claude Code y MCP,', 'RPA con Playwright y pipelines', 'de datos.'], C.yellow],
  ];
  const cw = (W - 2 * PAD - 2 * GAP) / 3, cy = 156, ch = 250;
  const body = items.map(([g, title, lines, band], i) => {
    const x = PAD + i * (cw + GAP), d = 0.25 + i * 0.18;
    return `<g class="rise" style="--d:${d}s">
      ${card({ x, y: cy, w: cw - 8, h: ch })}
      <path d="M${x + 2.5} ${cy + 96} H${x + cw - 10.5}" stroke="${C.ink}" stroke-width="4"/>
      <rect x="${x + 2.5}" y="${cy + 2.5}" width="${cw - 13}" height="91" rx="17" fill="${band}"/>
      <rect x="${x + 2.5}" y="${cy + 60}" width="${cw - 13}" height="34" fill="${band}"/>
      ${glyph[g](x + 22, cy + 16)}
      <text x="${x + 98}" y="${cy + 59}" class="lg" font-size="${title.length > 18 ? 20 : 24}" fill="${C.ink}">${esc(title)}</text>
      ${lines.map((l, k) => `<text x="${x + 26}" y="${cy + 138 + k * 30}" font-size="20" fill="${C.soft}">${esc(l)}</text>`).join('')}
    </g>`;
  }).join('');
  out('services.svg', frame({ h: 444, kicker: 'QUÉ HACEMOS', title: 'Software a la medida, sin trucos de magia', body, seed: 1 }));
}

// ─── Integrantes ──────────────────────────────────────────────────────────
{
  const people = [
    { name: 'Brian A', login: 'brianacevedo2001-lab', avatar: 'avatar-brianacevedo2001-lab.png',
      quote: ['«Automatizo con IA lo que hoy', 'se hace a mano.»'], note: 'De su bio de GitHub',
      tags: ['Python', 'Claude Code', 'Playwright'], ring: C.yellow },
    { name: 'Andrés F', login: 'Program0017', avatar: 'avatar-Program0017.png',
      quote: ['Su bio dice «Idk i like programm».', 'Le creemos.'], note: 'Arrancó MProspector',
      tags: ['Java', 'Spring Boot', 'Laravel'], ring: C.orange },
  ];
  const cw = (W - 2 * PAD - GAP) / 2, cy = 156, ch = 260;
  let defs = '';
  const body = people.map((p, i) => {
    const x = PAD + i * (cw + GAP), d = 0.25 + i * 0.25, ax = x + 112, ay = cy + 120;
    defs += `<clipPath id="av${i}"><circle cx="${ax}" cy="${ay}" r="74"/></clipPath>`;
    let tx = x + 216;
    const tags = p.tags.map(t => { const r = pill(tx, cy + 198, t, i ? '#ffe0b0' : C.yellow, 16); tx += r.w + 10; return r.svg; }).join('');
    return `<g class="rise" style="--d:${d}s">
      ${card({ x, y: cy, w: cw - 8, h: ch })}
      <g class="pop" style="--d:${d + 0.3}s">
        <circle cx="${ax + 6}" cy="${ay + 6}" r="86" fill="${C.ink}"/>
        <circle cx="${ax}" cy="${ay}" r="86" fill="${p.ring}" stroke="${C.ink}" stroke-width="5"/>
        <image href="${dataUri(p.avatar)}" x="${ax - 74}" y="${ay - 74}" width="148" height="148" clip-path="url(#av${i})" preserveAspectRatio="xMidYMid slice"/>
        <circle cx="${ax}" cy="${ay}" r="74" fill="none" stroke="${C.ink}" stroke-width="5"/>
      </g>
      <text x="${x + 216}" y="${cy + 66}" class="lg out" font-size="40" stroke-width="9" fill="${C.yellow}">${esc(p.name)}</text>
      <text x="${x + 218}" y="${cy + 96}" font-size="18" font-weight="700" fill="${C.blue}">@${esc(p.login)}</text>
      ${p.quote.map((l, k) => `<text x="${x + 218}" y="${cy + 134 + k * 26}" font-size="19" fill="${C.soft}">${esc(l)}</text>`).join('')}
      ${tags}
    </g>`;
  }).join('');
  out('team.svg', frame({ h: 460, kicker: 'EL EQUIPO', title: 'Dos magos, cero conejos en el sombrero', body, defs, seed: 2 }));
}

// ─── Proyectos ────────────────────────────────────────────────────────────
{
  const cy = 156, ch = 344, mw = 840, x = PAD;
  let px = x + 32;
  const stack = ['Laravel 13', 'PHP 8.3', 'Blade', 'Tailwind 4', 'Vite'].map(t => { const r = pill(px, cy + 222, t, '#fff', 16); px += r.w + 10; return r.svg; }).join('');
  const stages = ['Prospección', 'Calificación', 'Propuesta', 'Contacto'];
  const sx = x + 32, sy = cy + 306, sw = (mw - 64 - 3 * 14) / 4;
  const funnel = stages.map((s, i) => {
    const bx = sx + i * (sw + 14), on = i === 0;
    return `<g class="pop" style="--d:${1.1 + i * 0.15}s">
      <rect x="${bx}" y="${sy - 22}" width="${sw}" height="34" rx="10" fill="${on ? C.yellow : '#efe8cf'}" stroke="${C.ink}" stroke-width="3" ${on ? '' : 'stroke-dasharray="7 5"'}/>
      <text x="${bx + sw / 2}" y="${sy + 1}" text-anchor="middle" font-size="16" font-weight="700" fill="${on ? C.ink : C.dim}">${i + 1}. ${esc(s)}</text>
      ${on ? `<circle cx="${bx + sw - 14}" cy="${sy - 5}" r="5" fill="${C.red}" class="blink"/>` : ''}
    </g>`;
  }).join('');
  const lock = `<g transform="translate(${x + mw - 200} ${cy + 26})"><g class="wob">
      <rect x="4" y="4" width="160" height="44" rx="22" fill="${C.ink}"/>
      <rect width="160" height="44" rx="22" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/>
      <rect x="18" y="20" width="18" height="15" rx="3" fill="#fff" stroke="${C.ink}" stroke-width="2.5"/>
      <path d="M21.5 20 v-4 a5.5 5.5 0 0 1 11 0 v4" fill="none" stroke="#fff" stroke-width="3"/>
      <text x="96" y="31" text-anchor="middle" class="lg" font-size="20" fill="#fff">PRIVADO</text>
    </g></g>`;
  const desc = ['Herramienta interna de prospección comercial: crea campañas', 'por nicho, busca marcas en varios motores, las enriquece y', 'las ordena con un puntaje para saber a quién contactar primero.'];
  const main = `<g class="rise" style="--d:.25s">
      ${card({ x, y: cy, w: mw, h: ch })}
      <text x="${x + 32}" y="${cy + 66}" class="lg out" font-size="46" stroke-width="10" fill="${C.yellow}">MProspector</text>
      ${lock}
      ${desc.map((l, k) => `<text x="${x + 34}" y="${cy + 110 + k * 30}" font-size="20" fill="${C.soft}">${esc(l)}</text>`).join('')}
      ${stack}
      ${funnel}
    </g>`;
  const ox = x + mw + 32, ow = W - PAD - ox - 8;
  const other = `<g class="rise" style="--d:.55s">
      <rect x="${ox}" y="${cy}" width="${ow}" height="${ch}" rx="20" fill="#ffffff" fill-opacity=".55" stroke="${C.ink}" stroke-width="5" stroke-dasharray="16 10"/>
      <g class="bob" style="--d:.3s"><g transform="translate(${ox + ow / 2 - 50} ${cy + 70})">${cloud(0, 0, 1)}</g></g>
      <text x="${ox + ow / 2}" y="${cy + 86}" text-anchor="middle" class="lg" font-size="30" fill="${C.blue}">?</text>
      <text x="${ox + ow / 2}" y="${cy + 178}" text-anchor="middle" class="lg out" font-size="30" stroke-width="8" fill="${C.yellow}">¿TU PROYECTO</text>
      <text x="${ox + ow / 2}" y="${cy + 214}" text-anchor="middle" class="lg out" font-size="30" stroke-width="8" fill="${C.yellow}">AQUÍ?</text>
      <text x="${ox + ow / 2}" y="${cy + 256}" text-anchor="middle" font-size="18" fill="${C.ink}">Este espacio está libre.</text>
      <text x="${ox + ow / 2}" y="${cy + 282}" text-anchor="middle" font-size="18" fill="${C.ink}">Por ahora.</text>
    </g>`;
  out('projects.svg', frame({ h: cy + ch + 46, kicker: 'PROYECTOS', title: 'En el horno (y huele bien)', body: main + other, seed: 3 }));
}

// ─── Stack ────────────────────────────────────────────────────────────────
{
  // Lenguajes de MProspector + repos públicos de los integrantes.
  const items = [
    ['laravel', 'Laravel', '#FF2D20'], ['php', 'PHP', '#777BB4'], ['tailwindcss', 'Tailwind CSS', '#06B6D4'],
    ['vite', 'Vite', '#9135FF'], ['javascript', 'JavaScript', '#E8B400'], ['typescript', 'TypeScript', '#3178C6'],
    ['openjdk', 'Java', '#1b1b1f'], ['springboot', 'Spring Boot', '#4E9A1E'], ['python', 'Python', '#3776AB'],
    ['playwright', 'Playwright', '#2EAD33'], ['claude', 'Claude Code', '#D97757'], ['modelcontextprotocol', 'MCP', '#1b1b1f'],
  ];
  const cols = 6, gx = 20, tw = (W - 2 * PAD - (cols - 1) * gx - 6) / cols, th = 136, top = 156;
  const body = items.map(([ic, label, col], i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const x = PAD + c * (tw + gx), y = top + r * (th + 22), mid = x + tw / 2, d = 0.2 + i * 0.07;
    return `<g class="pop" style="--d:${d}s">
      ${card({ x, y, w: tw, h: th, fill: (r + c) % 2 ? C.cream : C.yellow, r: 18, sw: 4, sh: 6 })}
      <g class="bob" style="--d:${(i % 5) * 0.4}s">
        <circle cx="${mid}" cy="${y + 50}" r="32" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/>
        ${icon(ic, mid - 19, y + 31, 38, col)}
      </g>
      <text x="${mid}" y="${y + 116}" text-anchor="middle" font-size="19" font-weight="700" fill="${C.ink}">${esc(label)}</text>
    </g>`;
  }).join('');
  out('stack.svg', frame({ h: top + 2 * th + 22 + 52, kicker: 'STACK', title: 'Con qué construimos', body, seed: 4 }));
}

// ─── Logros ───────────────────────────────────────────────────────────────
{
  const items = [
    ['', 2, 'integrantes', 'y contando', C.yellow],
    ['', 1, 'proyecto en marcha', 'MProspector (privado)', C.orange],
    ['', 2, 'commits', 'en MProspector', '#7dd3fc'],
    ['', 28, 'minutos', 'de crear la org a Laravel', '#86efac'],
  ];
  const cw = (W - 2 * PAD - 3 * GAP - 8) / 4, cy = 156, ch = 214;
  const body = items.map(([pre, val, l1, l2, col], i) => {
    const x = PAD + i * (cw + GAP), mid = x + cw / 2, d = 0.25 + i * 0.15;
    return `<g class="rise" style="--d:${d}s">
      ${card({ x, y: cy, w: cw, h: ch })}
      ${odometer({ x: mid, y: cy + 100, value: val, prefix: pre, size: 74, color: col, d: d + 0.2 })}
      <text x="${mid}" y="${cy + 148}" text-anchor="middle" class="lg" font-size="24" fill="${C.ink}">${esc(l1)}</text>
      <text x="${mid}" y="${cy + 178}" text-anchor="middle" font-size="17" fill="${C.dim}">${esc(l2)}</text>
    </g>`;
  }).join('');
  const foot = `<text x="${W / 2}" y="${cy + ch + 46}" text-anchor="middle" font-size="18" font-weight="700" fill="#fff" stroke-width="5" class="out fade" style="--d:1.6s">Cifras reales al 10 nov 2026. Recién salidas del horno: crecen con cada commit.</text>`;
  out('achievements.svg', frame({ h: cy + ch + 74, kicker: 'LOGROS', title: 'Números chiquitos, pero honestos', body: body + foot, seed: 5 }));
}

// ─── Línea de tiempo ──────────────────────────────────────────────────────
{
  // Horas en Colombia (UTC-5) a partir de created_at de la API.
  const ev = [
    ['6:47 p. m.', 'Nace TheMagios', 'se crea la organización'],
    ['7:12 p. m.', 'MProspector', 'primer repo del equipo'],
    ['7:14 p. m.', 'Primer commit', '«first commit», un clásico'],
    ['7:16 p. m.', 'Esqueleto listo', 'Laravel 13 en pie'],
    ['PRÓXIMO', 'Etapa 1', 'prospección de marcas'],
  ];
  const ly = 250, x1 = PAD + 110, x2 = W - PAD - 110, len = x2 - x1;
  const nodes = ev.map(([t, a, b], i) => {
    const nx = x1 + (len * i) / (ev.length - 1), d = 0.6 + i * 0.4, next = i === ev.length - 1;
    return `<g class="pop" style="--d:${d}s">
        <circle cx="${nx + 4}" cy="${ly + 4}" r="20" fill="${C.ink}"/>
        <circle cx="${nx}" cy="${ly}" r="20" fill="${next ? '#fff' : C.yellow}" stroke="${C.ink}" stroke-width="5" ${next ? 'stroke-dasharray="6 5"' : ''}/>
        <circle cx="${nx}" cy="${ly}" r="7" fill="${next ? C.red : C.ink}" class="${next ? 'blink' : ''}"/>
      </g>
      <g class="rise" style="--d:${d + 0.1}s">
        <rect x="${nx - 62}" y="${ly - 76}" width="124" height="32" rx="16" fill="${next ? C.red : C.cream}" stroke="${C.ink}" stroke-width="3"/>
        <text x="${nx}" y="${ly - 53}" text-anchor="middle" font-size="16" font-weight="700" fill="${next ? '#fff' : C.ink}">${esc(t)}</text>
        <text x="${nx}" y="${ly + 60}" text-anchor="middle" class="lg out" font-size="25" stroke-width="7" fill="${next ? '#fff' : C.yellow}">${esc(a)}</text>
        <text x="${nx}" y="${ly + 90}" text-anchor="middle" class="out" stroke-width="5" font-size="18" font-weight="700" fill="#fff">${esc(b)}</text>
      </g>`;
  }).join('');
  const track = `
    <line x1="${x1}" y1="${ly}" x2="${x2}" y2="${ly}" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>
    <line x1="${x1}" y1="${ly}" x2="${x2}" y2="${ly}" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-opacity=".6"/>
    <line x1="${x1}" y1="${ly}" x2="${x2 - len / 4}" y2="${ly}" stroke="${C.yellow}" stroke-width="7" stroke-linecap="round" class="draw" style="--len:${len * 0.75};--dur:1.8s;--d:.5s"/>`;
  const sub = `<g class="fade" style="--d:2.8s">
      ${card({ x: W / 2 - 330, y: ly + 128, w: 660, h: 48, fill: C.yellow, r: 24, sw: 4, sh: 5 })}
      <text x="${W / 2}" y="${ly + 159}" text-anchor="middle" font-size="19" font-weight="700" fill="${C.ink}">10 de noviembre de 2026 · todo en una tarde (hora de Colombia)</text>
    </g>`;
  out('timeline.svg', frame({ h: ly + 210, kicker: 'LÍNEA DE TIEMPO', title: 'De cero a Laravel en una tarde', body: track + nodes + sub, seed: 6 }));
}

// ─── Divisor ──────────────────────────────────────────────────────────────
{
  const h = 56, pts = [];
  for (let x = 20; x <= W - 20; x += 16) pts.push(`${x},${(h / 2 + Math.sin(x / 60) * 10).toFixed(1)}`);
  const d = 'M' + pts.join(' L');
  out('divider.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}">
<style>.run{animation:run 3s linear infinite}@keyframes run{to{stroke-dashoffset:-1000}}
@media (prefers-reduced-motion:reduce){.run{animation:none}}</style>
<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${C.yellow}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" pathLength="1000" stroke-dasharray="40 210" class="run"/>
</svg>`);
}

console.log('SVG generados en profile/assets/');
