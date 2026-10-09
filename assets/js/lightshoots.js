/* lightshoots.js — "Light Shoots" layer for the Constellation background.
   Reads the live particle positions from particles.js and sends short bursts of
   light hopping node-to-node along existing links, with a small ripple where each
   hop lands. Draws on its own transparent canvas (#shoot-canvas), so the original
   particles.js animation is left completely untouched.
   Kept as an external file so comments survive the site's HTML compression. */
(function () {
  var cv = document.getElementById('shoot-canvas');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');

  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduce) return;   // no extra motion for reduced-motion users

  // ---- Tunables (edit these to change the feel) ----
  var CFG = {
    hopMs: 340,         // time for light to travel one link (ms)
    hopsMin: 3,         // shortest shoot (links)
    hopsMax: 6,         // longest shoot (links)
    spawnMinMs: 850,    // gap between new shoots (ms)
    spawnMaxMs: 1700,
    maxShoots: 3,       // shoots on screen at once
    lightLight: '#2ba7cc',          // shoot colour, light mode
    lightDark:  '#c9f1fb'           // shoot colour, dark mode
  };

  var shoots = [], rings = [];
  var lastArr = null, lastSpawn = 0, nextGap = 900;

  function pjs() {
    return (window.pJSDom && pJSDom.length && pJSDom[0] && pJSDom[0].pJS) ? pJSDom[0].pJS : null;
  }
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }
  function hexToRgb(h) {
    var n = parseInt(h.slice(1), 16);
    return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
  }

  function neighbors(arr, i, lim2, used) {
    var out = [], a = arr[i];
    for (var j = 0; j < arr.length; j++) {
      if (j === i || used.indexOf(j) !== -1) continue;
      var dx = a.x - arr[j].x, dy = a.y - arr[j].y;
      if (dx * dx + dy * dy < lim2) out.push(j);
    }
    return out;
  }

  // A shoot is a short path through linked nodes, travelled hop by hop.
  function spawn(arr, lim, now) {
    if (arr.length < 2) return;
    var path = [Math.floor(Math.random() * arr.length)];
    var hops = CFG.hopsMin + Math.floor(Math.random() * (CFG.hopsMax - CFG.hopsMin + 1));
    for (var h = 0; h < hops; h++) {
      var nb = neighbors(arr, path[path.length - 1], lim * lim, path);
      if (!nb.length) break;
      path.push(nb[Math.floor(Math.random() * nb.length)]);
    }
    if (path.length >= 2) shoots.push({ path: path, seg: 0, t0: now });
  }

  function frame(now) {
    requestAnimationFrame(frame);

    var P = pjs();
    if (!P || !P.particles || !P.particles.array || !P.canvas || !P.canvas.el) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      return;                                   // particles not ready yet
    }
    var el = P.canvas.el, arr = P.particles.array, k = P.canvas.pxratio || 1;

    // match the particles canvas exactly (same pixel grid, incl. retina scaling)
    if (cv.width !== el.width || cv.height !== el.height) { cv.width = el.width; cv.height = el.height; }
    // particles get rebuilt on theme toggle: drop shoots that point at old nodes
    if (arr !== lastArr) { shoots = []; rings = []; lastArr = arr; }

    ctx.clearRect(0, 0, cv.width, cv.height);
    var col = isDark() ? CFG.lightDark : CFG.lightLight, rgb = hexToRgb(col);
    var lim = (P.particles.line_linked && P.particles.line_linked.distance) || 130 * k;

    for (var s = shoots.length - 1; s >= 0; s--) {
      var sh = shoots[s];
      var A = arr[sh.path[sh.seg]], B = arr[sh.path[sh.seg + 1]];
      if (!A || !B) { shoots.splice(s, 1); continue; }
      var t = (now - sh.t0) / CFG.hopMs, tc = t < 0 ? 0 : (t > 1 ? 1 : t);

      // light up the link being travelled
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = col; ctx.lineWidth = 1.6 * k;
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      ctx.globalAlpha = 1;

      // the travelling spark
      ctx.save();
      ctx.shadowBlur = 10 * k; ctx.shadowColor = col; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(A.x + (B.x - A.x) * tc, A.y + (B.y - A.y) * tc, 2.6 * k, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      if (t >= 1) {
        rings.push({ x: B.x, y: B.y, r: 2 * k, a: 0.6 });
        sh.seg++; sh.t0 = now;
        if (sh.seg >= sh.path.length - 1) shoots.splice(s, 1);
      }
    }

    // ripples where a hop lands
    ctx.lineWidth = 1 * k;
    for (var r = rings.length - 1; r >= 0; r--) {
      var rg = rings[r];
      rg.r += 0.8 * k; rg.a -= 0.018;
      if (rg.a <= 0) { rings.splice(r, 1); continue; }
      ctx.strokeStyle = 'rgba(' + rgb + ',' + rg.a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2); ctx.stroke();
    }

    if (shoots.length < CFG.maxShoots && now - lastSpawn > nextGap) {
      spawn(arr, lim, now);
      lastSpawn = now;
      nextGap = CFG.spawnMinMs + Math.random() * (CFG.spawnMaxMs - CFG.spawnMinMs);
    }
  }

  requestAnimationFrame(frame);
})();
