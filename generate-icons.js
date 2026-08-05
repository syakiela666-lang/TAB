// Generate PWA Icons via Node.js canvas-like approach
// We'll create simple SVG-based icons and save as files

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function createIconSVG(size) {
  const pad = size * 0.15;
  const cx = size / 2;
  const cy = size / 2;
  const pickW = size * 0.38;
  const pickH = size * 0.48;

  // Guitar pick path (centered)
  const pickX = cx;
  const pickTopY = cy - pickH * 0.45;
  const pickBotY = cy + pickH * 0.55;

  // String lines
  const lineStartX = cx - pickW * 0.5;
  const lineEndX = cx + pickW * 0.5;
  const lineSpacing = pickH * 0.11;
  const linesStartY = cy - lineSpacing * 2.5;

  let lines = '';
  for (let i = 0; i < 6; i++) {
    const y = linesStartY + i * lineSpacing;
    lines += `<line x1="${lineStartX}" y1="${y}" x2="${lineEndX}" y2="${y}" stroke="#F8FAFC" stroke-width="${size * 0.008}" stroke-opacity="0.6" />`;
  }

  // Fret number dots
  const dotR = size * 0.022;
  const dots = [
    { x: cx - pickW * 0.15, y: linesStartY + 1 * lineSpacing },
    { x: cx + pickW * 0.1, y: linesStartY + 3 * lineSpacing },
    { x: cx - pickW * 0.05, y: linesStartY + 4 * lineSpacing },
  ];

  let dotsSvg = '';
  dots.forEach(d => {
    dotsSvg += `<circle cx="${d.x}" cy="${d.y}" r="${dotR}" fill="#22C55E" />`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#0F0F23"/>
    </linearGradient>
    <linearGradient id="pick" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4338CA"/>
      <stop offset="100%" stop-color="#22C55E"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#bg)"/>

  <!-- Guitar pick shape -->
  <path d="M${pickX} ${pickTopY}
    C${pickX + pickW * 0.6} ${pickTopY + pickH * 0.05}
     ${pickX + pickW * 0.55} ${cy + pickH * 0.1}
     ${pickX} ${pickBotY}
    C${pickX - pickW * 0.55} ${cy + pickH * 0.1}
     ${pickX - pickW * 0.6} ${pickTopY + pickH * 0.05}
     ${pickX} ${pickTopY}Z"
    fill="url(#pick)" opacity="0.25" />

  <!-- Tab lines -->
  ${lines}

  <!-- Note dots -->
  ${dotsSvg}

  <!-- Music note icon -->
  <g transform="translate(${cx + pickW * 0.25}, ${cy - pickH * 0.35})" fill="#22C55E" opacity="0.9">
    <ellipse cx="0" cy="${size * 0.04}" rx="${size * 0.03}" ry="${size * 0.022}" />
    <rect x="${size * 0.025}" y="${-size * 0.08}" width="${size * 0.008}" height="${size * 0.12}" />
  </g>
</svg>`;
}

// Write SVG icons (these work as PWA icons in modern browsers)
const svg192 = createIconSVG(192);
const svg512 = createIconSVG(512);

fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), svg192);
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), svg512);

console.log('SVG icons generated successfully!');

// Also create PNG-compatible versions using a simple approach:
// Create an HTML file that can render and download the icons
const converterHtml = `<!DOCTYPE html>
<html>
<head><title>Icon Converter</title></head>
<body style="background:#0F0F23;display:flex;gap:20px;padding:20px;">
<div>
  <h3 style="color:white;font-family:sans-serif;">192x192</h3>
  <canvas id="c192" width="192" height="192"></canvas>
</div>
<div>
  <h3 style="color:white;font-family:sans-serif;">512x512</h3>
  <canvas id="c512" width="512" height="512"></canvas>
</div>
<script>
function drawIcon(canvas, size) {
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#1E1B4B');
  bgGrad.addColorStop(1, '#0F0F23');

  // Rounded rect background
  const r = size * 0.18;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = bgGrad;
  ctx.fill();

  const cx = size / 2;
  const cy = size / 2;
  const pickW = size * 0.38;
  const pickH = size * 0.48;

  // Tab lines
  const lineStartX = cx - pickW * 0.6;
  const lineEndX = cx + pickW * 0.6;
  const lineSpacing = pickH * 0.12;
  const linesStartY = cy - lineSpacing * 2.5;

  ctx.strokeStyle = 'rgba(248, 250, 252, 0.35)';
  ctx.lineWidth = Math.max(1, size * 0.006);
  for (let i = 0; i < 6; i++) {
    const y = linesStartY + i * lineSpacing;
    ctx.beginPath();
    ctx.moveTo(lineStartX, y);
    ctx.lineTo(lineEndX, y);
    ctx.stroke();
  }

  // Note dots
  const dots = [
    { x: cx - pickW * 0.2, y: linesStartY + 1 * lineSpacing, label: '3' },
    { x: cx + pickW * 0.05, y: linesStartY + 2 * lineSpacing, label: '5' },
    { x: cx - pickW * 0.1, y: linesStartY + 3 * lineSpacing, label: '7' },
    { x: cx + pickW * 0.25, y: linesStartY + 0 * lineSpacing, label: '0' },
    { x: cx + pickW * 0.4, y: linesStartY + 4 * lineSpacing, label: '2' },
  ];

  const dotR = size * 0.025;
  ctx.font = Math.round(size * 0.04) + 'px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  dots.forEach(d => {
    // Glow
    ctx.shadowColor = '#22C55E';
    ctx.shadowBlur = size * 0.02;
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.arc(d.x, d.y, dotR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = '#0F0F23';
    ctx.fillText(d.label, d.x, d.y + 1);
  });

  // Guitar pick subtle outline
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
  ctx.lineWidth = Math.max(1, size * 0.005);
  const pickTopY = cy - pickH * 0.5;
  const pickBotY = cy + pickH * 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, pickTopY);
  ctx.bezierCurveTo(cx + pickW * 0.6, pickTopY + pickH * 0.05, cx + pickW * 0.55, cy + pickH * 0.1, cx, pickBotY);
  ctx.bezierCurveTo(cx - pickW * 0.55, cy + pickH * 0.1, cx - pickW * 0.6, pickTopY + pickH * 0.05, cx, pickTopY);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

const d192 = drawIcon(document.getElementById('c192'), 192);
const d512 = drawIcon(document.getElementById('c512'), 512);

// Show download links
document.body.innerHTML += '<div style="color:white;font-family:sans-serif;padding:20px;">' +
  '<a href="' + d192 + '" download="icon-192.png" style="color:#22C55E;">Download 192</a> | ' +
  '<a href="' + d512 + '" download="icon-512.png" style="color:#22C55E;">Download 512</a></div>';
<\/script>
</body>
</html>`;

fs.writeFileSync(path.join(iconsDir, 'generate-icons.html'), converterHtml);
console.log('Icon converter HTML created at icons/generate-icons.html');
console.log('Open it in a browser to download PNG icons.');
