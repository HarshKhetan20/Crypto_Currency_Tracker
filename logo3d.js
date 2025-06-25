// Render a 3D neon Bitcoin logo using SVG
const logoDiv = document.getElementById('logo3d');
logoDiv.innerHTML = `
<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="btcGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F7931A" stop-opacity="1"/>
      <stop offset="100%" stop-color="#232946" stop-opacity="0.2"/>
    </radialGradient>
    <filter id="btcNeon" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#F7931A"/>
      <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#ffe082"/>
    </filter>
  </defs>
  <circle cx="40" cy="40" r="36" fill="url(#btcGlow)" filter="url(#btcNeon)"/>
  <text x="50%" y="54%" text-anchor="middle" font-size="38" font-family="Segoe UI, Arial, sans-serif" font-weight="bold" fill="#fff" filter="url(#btcNeon)" dy=".3em">₿</text>
</svg>
`; 