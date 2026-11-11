// Arma build/preview.html con profile/README.md dentro de un contenedor parecido al de GitHub
// (claro u oscuro con ?tema=claro|oscuro) y, con --capturas <carpeta>, saca capturas con Playwright
// a 1280 y 390 px en ambos temas.
// Uso: node build/preview.js [--capturas <carpeta>]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const root = path.join(__dirname, '..');
const readme = fs.readFileSync(path.join(root, 'profile', 'README.md'), 'utf8').replace(/src="assets\//g, 'src="../profile/assets/');
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vista previa TheMagios</title><style>
:root{--bg:#fff;--fg:#1f2328;--box:#d1d9e0}
:root[data-tema=oscuro]{--bg:#0d1117;--fg:#f0f6fc;--box:#3d444d}
body{margin:0;background:var(--bg);color:var(--fg);font:14px -apple-system,'Segoe UI',sans-serif}
.box{max-width:1012px;margin:24px auto;border:1px solid var(--box);border-radius:6px;padding:24px;box-sizing:border-box}
.box p{margin:0 0 16px}.box>img{display:block;max-width:100%;margin:0 0 16px}img{max-width:100%;box-sizing:content-box}
@media(max-width:700px){.box{margin:16px;padding:16px}}
</style><script>document.documentElement.dataset.tema=new URLSearchParams(location.search).get('tema')||'oscuro'</script></head>
<body><div class="box">
${readme}
</div></body></html>`;
const out = path.join(__dirname, 'preview.html');
fs.writeFileSync(out, html);
console.log('Vista previa →', out);

const i = process.argv.indexOf('--capturas');
if (i > 0) (async () => {
  const dir = process.argv[i + 1]; fs.mkdirSync(dir, { recursive: true });
  const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
  const b = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge' });
  for (const w of [1280, 390]) for (const tema of ['claro', 'oscuro']) {
    const p = await b.newPage({ viewport: { width: w, height: w === 390 ? 2600 : 3400 } });
    await p.goto(pathToFileURL(out).href + '?tema=' + tema);
    await p.waitForTimeout(5000);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    await p.screenshot({ path: path.join(dir, `preview-${w}-${tema}.png`), fullPage: true, animations: 'allow' });
    console.log(w, tema, 'scrollWidth', sw);
    await p.close();
  }
  await b.close();
})();
