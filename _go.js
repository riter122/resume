const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  const src = 'index_source.html';
  const out = 'resume-raoyifan.html';

  let html = fs.readFileSync(src, 'utf8');

  const imgDir = path.join(__dirname, 'images');
  const files = fs.readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  for (const f of files) {
    const fp = path.join(imgDir, f);
    const buf = await sharp(fp)
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();
    const dataUri = 'data:image/jpeg;base64,' + buf.toString('base64');

    // Escape regex special chars in filename
    const escaped = f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('src="images/' + escaped + '"', 'g');

    html = html.replace(re, () => 'src="' + dataUri + '"');
  }

  fs.writeFileSync(out, html);
  const sizeMB = (fs.statSync(out).size / 1024 / 1024).toFixed(1);
  console.log(`Done: ${out} (${sizeMB} MB, ${files.length} images)`);
})();
