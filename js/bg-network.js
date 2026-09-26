/**
 * bg-network.js — the same constellation particle background used on
 * index.html, extracted so login.html and admin.html can share it.
 * Expects <div id="sky"></div>, <canvas id="netCanvas"></canvas>,
 * <div id="scrim"></div> to exist in the page.
 */
(function () {
  const netCanvas = document.getElementById('netCanvas');
  if (!netCanvas) return;
  const nctx = netCanvas.getContext('2d');
  let netW, netH, netParticles = [];
  let scrollDrift = 0;

  function initNet() {
    netW = netCanvas.width = window.innerWidth;
    netH = netCanvas.height = window.innerHeight;
    const count = window.innerWidth < 700 ? 40 : 75;
    netParticles = Array.from({ length: count }, () => ({
      x: Math.random() * netW,
      y: Math.random() * netH,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.8
    }));
  }
  initNet();
  window.addEventListener('resize', initNet);
  window.addEventListener('scroll', () => { scrollDrift = window.scrollY * 0.03; }, { passive: true });

  let netMouseX = -9999, netMouseY = -9999;
  window.addEventListener('mousemove', (e) => { netMouseX = e.clientX; netMouseY = e.clientY; });

  function drawNet() {
    nctx.clearRect(0, 0, netW, netH);
    const linkDist = 130;
    for (let i = 0; i < netParticles.length; i++) {
      const p = netParticles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > netW) p.vx *= -1;
      if (p.y < 0 || p.y > netH) p.vy *= -1;
      const py = p.y - (scrollDrift % netH);
      nctx.beginPath();
      nctx.arc(p.x, ((py % netH) + netH) % netH, p.r, 0, Math.PI * 2);
      nctx.fillStyle = 'rgba(218,120,255,0.6)';
      nctx.fill();
    }
    for (let i = 0; i < netParticles.length; i++) {
      for (let j = i + 1; j < netParticles.length; j++) {
        const a = netParticles[i], b = netParticles[j];
        const ay = ((a.y - (scrollDrift % netH)) % netH + netH) % netH;
        const by = ((b.y - (scrollDrift % netH)) % netH + netH) % netH;
        const dx = a.x - b.x, dy = ay - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          nctx.beginPath();
          nctx.moveTo(a.x, ay);
          nctx.lineTo(b.x, by);
          nctx.strokeStyle = `rgba(151,51,238,${(1 - dist / linkDist) * 0.35})`;
          nctx.lineWidth = 1;
          nctx.stroke();
        }
      }
      const a = netParticles[i];
      const ay = ((a.y - (scrollDrift % netH)) % netH + netH) % netH;
      const dmx = a.x - netMouseX, dmy = ay - netMouseY;
      const md = Math.sqrt(dmx * dmx + dmy * dmy);
      if (md < 150) {
        nctx.beginPath();
        nctx.moveTo(a.x, ay);
        nctx.lineTo(netMouseX, netMouseY);
        nctx.strokeStyle = `rgba(218,34,255,${(1 - md / 150) * 0.4})`;
        nctx.lineWidth = 1;
        nctx.stroke();
      }
    }
    requestAnimationFrame(drawNet);
  }
  drawNet();
})();
