/* worldbg.js — "Latent World & Token Flow" background.
   - Drifting, softly linked nodes  = a world model's latent state space.
   - Pulses hopping node-to-node    = an LLM generating / propagating tokens.
   - Rings where a pulse lands      = next-state prediction (activation).
   Kept as an external file so comments survive the site's HTML compression. */
(function () {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // ---- Tunables (edit these to change the feel) ----
  var CFG = {
    linkDist: 140,      // max distance for a link between two nodes (px)
    nodeArea: 17000,    // one node per this many px² of screen
    minNodes: 36,
    maxNodes: 110,
    drift: 0.16,        // node drift speed
    hopMs: 340,         // time for a token pulse to travel one link (ms)
    hopsMin: 3,         // shortest token sequence (links)
    hopsMax: 6,         // longest token sequence (links)
    spawnMinMs: 850,    // gap between new token sequences (ms)
    spawnMaxMs: 1700,
    maxWalks: 3         // concurrent token sequences
  };

  var W = 0, H = 0, DPR = 1;
  var nodes = [], walks = [], rings = [];
  var lastSpawn = 0, nextGap = 1000;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }
  function palette() {
    return isDark()
      ? { node: '159,211,226', edge: '127,196,216', pulse: '#9fe0ef', ring: '127,196,216' }
      : { node: '31,78,95',    edge: '31,78,95',    pulse: '#2ba7cc', ring: '82,173,200' };
  }

  function buildNodes() {
    var target = Math.round((W * H) / CFG.nodeArea);
    target = Math.max(CFG.minNodes, Math.min(CFG.maxNodes, target));
    nodes = [];
    for (var i = 0; i < target; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * CFG.drift * 2,
        vy: (Math.random() - 0.5) * CFG.drift * 2,
        r: 1.4 + Math.random() * 1.3,
        act: 0
      });
    }
    walks = []; rings = [];
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildNodes();
  }

  function neighbors(idx) {
    var out = [], a = nodes[idx], lim = CFG.linkDist * CFG.linkDist;
    for (var j = 0; j < nodes.length; j++) {
      if (j === idx) continue;
      var dx = a.x - nodes[j].x, dy = a.y - nodes[j].y;
      if (dx * dx + dy * dy < lim) out.push(j);
    }
    return out;
  }

  // A token sequence: a short path through nearby nodes (autoregressive hops).
  function spawnWalk(now) {
    if (nodes.length < 2) return;
    var path = [Math.floor(Math.random() * nodes.length)];
    var hops = CFG.hopsMin + Math.floor(Math.random() * (CFG.hopsMax - CFG.hopsMin + 1));
    for (var h = 0; h < hops; h++) {
      var nb = neighbors(path[path.length - 1]).filter(function (n) { return path.indexOf(n) === -1; });
      if (!nb.length) break;
      path.push(nb[Math.floor(Math.random() * nb.length)]);
    }
    if (path.length >= 2) walks.push({ path: path, seg: 0, t0: now });
  }

  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    var p = palette();
    var lim = CFG.linkDist * CFG.linkDist;

    // move nodes (wrap at edges) and decay activation
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!reduce) { n.x += n.vx; n.y += n.vy; }
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
      if (n.act > 0) n.act = Math.max(0, n.act - 0.02);
    }

    // latent links
    ctx.lineWidth = 1;
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y, d2 = dx * dx + dy * dy;
        if (d2 < lim) {
          var al = (1 - Math.sqrt(d2) / CFG.linkDist) * 0.18;
          ctx.strokeStyle = 'rgba(' + p.edge + ',' + al.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke();
        }
      }
    }

    // nodes (brighten briefly when "activated")
    for (var k = 0; k < nodes.length; k++) {
      var nn = nodes[k];
      ctx.fillStyle = 'rgba(' + p.node + ',' + (0.5 + nn.act * 0.5).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(nn.x, nn.y, nn.r + nn.act * 2, 0, Math.PI * 2); ctx.fill();
    }

    if (!reduce) {
      // token pulses travelling along their paths
      for (var w = walks.length - 1; w >= 0; w--) {
        var wk = walks[w];
        var A = nodes[wk.path[wk.seg]], B = nodes[wk.path[wk.seg + 1]];
        if (!A || !B) { walks.splice(w, 1); continue; }
        var t = (now - wk.t0) / CFG.hopMs, tc = t < 0 ? 0 : (t > 1 ? 1 : t);

        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = p.pulse; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        ctx.globalAlpha = 1; ctx.lineWidth = 1;

        ctx.save();
        ctx.shadowBlur = 10; ctx.shadowColor = p.pulse; ctx.fillStyle = p.pulse;
        ctx.beginPath(); ctx.arc(A.x + (B.x - A.x) * tc, A.y + (B.y - A.y) * tc, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        if (t >= 1) {
          B.act = 1;
          rings.push({ x: B.x, y: B.y, r: 2, a: 0.6 });
          wk.seg++; wk.t0 = now;
          if (wk.seg >= wk.path.length - 1) walks.splice(w, 1);
        }
      }

      if (walks.length < CFG.maxWalks && now - lastSpawn > nextGap) {
        spawnWalk(now);
        lastSpawn = now;
        nextGap = CFG.spawnMinMs + Math.random() * (CFG.spawnMaxMs - CFG.spawnMinMs);
      }
    }

    // prediction rings
    for (var r = rings.length - 1; r >= 0; r--) {
      var rg = rings[r];
      rg.r += 0.8; rg.a -= 0.018;
      if (rg.a <= 0) { rings.splice(r, 1); continue; }
      ctx.strokeStyle = 'rgba(' + p.ring + ',' + rg.a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2); ctx.stroke();
    }

    if (!reduce) requestAnimationFrame(frame);
  }

  function start() {
    resize();
    lastSpawn = performance.now();
    if (reduce) { frame(lastSpawn); return; }   // a single still frame
    requestAnimationFrame(frame);
  }

  var rz;
  window.addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(function () { resize(); if (reduce) frame(performance.now()); }, 200);
  });
  // repaint the still frame when the theme flips (reduced-motion users)
  if (reduce && window.MutationObserver) {
    new MutationObserver(function () { frame(performance.now()); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
