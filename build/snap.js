// Captura cada SVG de profile/assets como <img> (igual que GitHub) tras las animaciones de entrada.
// Uso: node build/snap.js <carpeta-salida>
const path = require('path'), fs = require('fs'), { pathToFileURL } = require('url');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
(async () => {
  const outDir = process.argv[2]; fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge' });
  const p = await b.newPage({ viewport: { width: 1280, height: 700 } });
  const dir = path.join(__dirname, '..', 'profile', 'assets');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    const tmp = path.join(outDir, '_snap.html');
    fs.writeFileSync(tmp, `<body style="margin:0;background:#888"><img id="i" src="${pathToFileURL(path.join(dir, f)).href}" style="display:block;width:1280px"></body>`);
    await p.goto(pathToFileURL(tmp).href);
    await p.waitForTimeout(4500);
    await p.locator('#i').screenshot({ path: path.join(outDir, f.replace('.svg', '.png')), animations: 'allow' });
  }
  await b.close();
})();
