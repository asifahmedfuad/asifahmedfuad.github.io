/* incidents.js — click the empty background to trigger a random "incident".
   Builds on the Constellation (particles.js) + Light Shoots background:
     1. Neural Avalanche — light cascades outward through the network from the nearest node
     2. Singularity      — nearby nodes spiral into a tiny black hole, then burst out (supernova)
     3. Shockwave        — a ring of force blasts outward, scattering nodes and firing rays
     4. Oracle           — a cryptic line "generates" token by token where you clicked
     *  Every 7th click  — Dimension Shift: the whole network glitches into another palette
   Only clicks on empty background count (not the content card, menu, links or buttons).
   Kept as an external file so comments survive the site's HTML compression. */
(function () {
  var cv = document.getElementById('incident-canvas');
  var oracle = document.getElementById('incident-oracle');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');

  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduce) return;   // no surprise motion for reduced-motion users

  // Clicks on any of these are normal page clicks, never incidents.
  var IGNORE = 'a, button, input, textarea, select, label, summary, #main, .masthead, .page__footer, #theme-toggle';

  var PHRASES = [
    'predicting the next state…',
    'dreaming in latent space',
    'what happens next?',
    'every token is a choice',
    'the world, compressed',
    'inferring hidden causes…',
    'I imagine, therefore I plan',
    'attention is all you need',
    'the map is not the territory',
    'hello, world model'
  ];
  var SHIFT = [{ r: 167, g: 139, b: 250 }, { r: 236, g: 72, b: 153 }, { r: 250, g: 204, b: 21 }];

  var active = [], impulses = [];
  var running = false, clicks = 0, lastKind = -1, lastPhrase = -1, oracleTimers = [];

  function pjs() {
    return (window.pJSDom && pJSDom.length && pJSDom[0] && pJSDom[0].pJS) ? pJSDom[0].pJS : null;
  }
  function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
  function palette() {
    return isDark() ? { main: '#c9f1fb', rgb: '201,241,251' } : { main: '#2ba7cc', rgb: '43,167,204' };
  }
  function sync(P) {
    var el = P.canvas.el;
    if (cv.width !== el.width || cv.height !== el.height) { cv.width = el.width; cv.height = el.height; }
  }
  function easeOut(s) { return 1 - Math.pow(1 - s, 3); }
  function nearest(arr, x, y) {
    var best = -1, bd = Infinity;
    for (var i = 0; i < arr.length; i++) {
      var dx = arr[i].x - x, dy = arr[i].y - y, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }
  function spark(x, y, r, c, k) {
    ctx.save();
    ctx.shadowBlur = 10 * k; ctx.shadowColor = c.main; ctx.fillStyle = c.main;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function ring(x, y, r, a, w, c) {
    if (a <= 0 || r <= 0) return;
    ctx.lineWidth = w;
    ctx.strokeStyle = 'rgba(' + c.rgb + ',' + a.toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  }
  // nudge a particle; the nudge decays over the next frames
  function push(p, vx, vy) { impulses.push({ p: p, vx: vx, vy: vy }); }

  // ---------- 1. Neural Avalanche ----------
  function avalanche(P, x, y, now) {
    var arr = P.particles.array, lim = P.particles.line_linked.distance, lim2 = lim * lim;
    var start = nearest(arr, x, y);
    if (start < 0) return null;
    var level = [], edges = [], q = [start], maxL = 0, seen = 1;
    level[start] = 0;
    while (q.length && seen < 120) {              // breadth-first wave over the link graph
      var u = q.shift();
      if (level[u] >= 16) continue;
      for (var j = 0; j < arr.length; j++) {
        if (level[j] !== undefined) continue;
        var dx = arr[u].x - arr[j].x, dy = arr[u].y - arr[j].y;
        if (dx * dx + dy * dy < lim2) {
          level[j] = level[u] + 1;
          if (level[j] > maxL) maxL = level[j];
          edges.push([u, j, level[j]]); q.push(j); seen++;
        }
      }
    }
    var STEP = 110, FADE = 700, s0 = arr[start];
    return {
      P: P, t0: now, dur: maxL * STEP + FADE + 300,
      draw: function (now, k, c) {
        var t = now - this.t0;
        ring(s0.x, s0.y, (4 + t * 0.05) * k, 0.7 * Math.max(0, 1 - t / 900), 1.5 * k, c);
        for (var e = 0; e < edges.length; e++) {
          var A = arr[edges[e][0]], B = arr[edges[e][1]];
          var p = (t - (edges[e][2] - 1) * STEP) / STEP;
          if (p < 0) continue;
          var pc = p > 1 ? 1 : p;
          var fade = p <= 1 ? 1 : 1 - (p - 1) * STEP / FADE;
          if (fade <= 0) continue;
          var ex = A.x + (B.x - A.x) * pc, ey = A.y + (B.y - A.y) * pc;
          ctx.globalAlpha = 0.65 * fade;
          ctx.strokeStyle = c.main; ctx.lineWidth = 1.5 * k;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.globalAlpha = 1;
          if (p <= 1) spark(ex, ey, 2.3 * k, c, k);
          else ring(B.x, B.y, (2 + (p - 1) * 10) * k, 0.55 * fade, 1 * k, c);
        }
      }
    };
  }

  // ---------- 2. Singularity ----------
  function singularity(P, x, y, now) {
    var arr = P.particles.array, k0 = P.canvas.pxratio || 1, R = 320 * k0, caught = [];
    for (var i = 0; i < arr.length; i++) {
      var dx = arr[i].x - x, dy = arr[i].y - y;
      if (dx * dx + dy * dy < R * R) caught.push(arr[i]);
    }
    var PULL = 1300, BURST = 1500, burst = false;
    return {
      P: P, t0: now, dur: PULL + BURST,
      draw: function (now, k, c) {
        var t = now - this.t0;
        if (t < PULL) {
          var s = t / PULL;
          for (var i = 0; i < caught.length; i++) {        // spiral inwards
            var p = caught[i], dx = x - p.x, dy = y - p.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
            var pull = 0.03 + 0.06 * s, swirl = 2.4 * k * (1 - s * 0.4);
            p.x += dx * pull + (-dy / d) * swirl;
            p.y += dy * pull + (dx / d) * swirl;
          }
          var rr = (6 + 16 * s) * k, rot = t / 180;
          ctx.lineWidth = 1.4 * k;
          ctx.strokeStyle = 'rgba(' + c.rgb + ',' + (0.25 + 0.5 * s).toFixed(3) + ')';
          for (var a = 0; a < 3; a++) {                     // accretion swirl
            ctx.beginPath(); ctx.arc(x, y, rr * (2 + a * 0.9), rot + a * 2.1, rot + a * 2.1 + 1.6); ctx.stroke();
          }
          ctx.fillStyle = 'rgba(4,8,12,' + (0.9 * s).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
          ring(x, y, rr + 1.5 * k, 0.9 * s, 1.5 * k, c);   // event horizon
        } else {
          if (!burst) {                                      // supernova: fling them out
            burst = true;
            for (var j = 0; j < caught.length; j++) {
              var q = caught[j], bx = q.x - x, by = q.y - y, bd = Math.sqrt(bx * bx + by * by);
              if (bd < 0.5) { var ang = Math.random() * Math.PI * 2; bx = Math.cos(ang); by = Math.sin(ang); bd = 1; }
              var f = (14 + Math.random() * 12) * k;
              push(q, bx / bd * f, by / bd * f);
            }
          }
          var s2 = (t - PULL) / BURST, e2 = easeOut(s2);
          ctx.fillStyle = 'rgba(' + c.rgb + ',' + (0.35 * (1 - s2)).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(x, y, (10 + 90 * e2) * k, 0, Math.PI * 2); ctx.fill();
          ring(x, y, (10 + 380 * e2) * k, 0.85 * (1 - s2), 2.2 * k, c);
          ring(x, y, (10 + 240 * e2) * k, 0.5 * (1 - s2), 1.2 * k, c);
        }
      }
    };
  }

  // ---------- 3. Shockwave ----------
  function shockwave(P, x, y, now) {
    var arr = P.particles.array, k0 = P.canvas.pxratio || 1, MAXR = 560 * k0, hit = [], rays = [];
    for (var r = 0; r < 14; r++) {
      var ang = (r / 14) * Math.PI * 2 + Math.random() * 0.25;
      rays.push({ c: Math.cos(ang), s: Math.sin(ang), len: (70 + Math.random() * 110) * k0 });
    }
    return {
      P: P, t0: now, dur: 1600,
      draw: function (now, k, c) {
        var s = (now - this.t0) / 1600, R = MAXR * easeOut(s);
        for (var i = 0; i < arr.length; i++) {             // the wave front shoves nodes outward
          if (hit[i]) continue;
          var p = arr[i], dx = p.x - x, dy = p.y - y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < R) {
            hit[i] = 1;
            var f = (4 + 12 * Math.max(0, 1 - d / MAXR)) * k;
            push(p, (dx / (d || 1)) * f, (dy / (d || 1)) * f);
          }
        }
        ring(x, y, R, 0.85 * (1 - s), 2.4 * k, c);
        ring(x, y, R * 0.72, 0.45 * (1 - s), 1.2 * k, c);
        if (s < 0.45) {
          var ra = 1 - s / 0.45;
          ctx.lineWidth = 1.6 * k;
          ctx.strokeStyle = 'rgba(' + c.rgb + ',' + (0.8 * ra).toFixed(3) + ')';
          for (var q = 0; q < rays.length; q++) {
            var ry = rays[q], r0 = R * 0.35, r1 = r0 + ry.len * ra;
            ctx.beginPath(); ctx.moveTo(x + ry.c * r0, y + ry.s * r0); ctx.lineTo(x + ry.c * r1, y + ry.s * r1); ctx.stroke();
          }
        }
        if (s < 0.2) spark(x, y, (6 * (1 - s / 0.2) + 2) * k, c, k);
      }
    };
  }

  // ---------- 4. Oracle ----------
  function blip(x, y, now) {
    return {
      t0: now, dur: 900,
      draw: function (now, k, c) {
        var s = (now - this.t0) / 900;
        ring(x, y, (3 + 26 * easeOut(s)) * k, 0.7 * (1 - s), 1.2 * k, c);
      }
    };
  }
  function tokenize(str) {              // split into 1–3 character "sub-word tokens"
    var out = [], i = 0;
    while (i < str.length) { var n = 1 + Math.floor(Math.random() * 3); out.push(str.slice(i, i + n)); i += n; }
    return out;
  }
  function oracleSpeak(cx, cy) {        // cx, cy in CSS pixels
    if (!oracle) return;
    for (var t = 0; t < oracleTimers.length; t++) clearTimeout(oracleTimers[t]);
    oracleTimers = [];
    var idx;
    do { idx = Math.floor(Math.random() * PHRASES.length); } while (idx === lastPhrase);
    lastPhrase = idx;

    var vw = window.innerWidth, vh = window.innerHeight;
    oracle.className = '';
    oracle.style.left = ''; oracle.style.right = '';
    if (cx < vw / 2) oracle.style.left = Math.min(cx + 12, vw - 60) + 'px';     // grow rightwards
    else oracle.style.right = Math.min(vw - cx + 12, vw - 60) + 'px';          // grow leftwards
    oracle.style.top = Math.max(8, Math.min(cy - 16, vh - 48)) + 'px';
    oracle.innerHTML = '<span class="txt"></span><span class="caret"></span>';
    var txt = oracle.firstChild, shown = '';
    void oracle.offsetWidth;            // restart the CSS transition
    oracle.className = 'show';

    var at = 250;
    tokenize(PHRASES[idx]).forEach(function (tok) {
      at += 60 + Math.random() * 70;
      oracleTimers.push(setTimeout(function () { shown += tok; txt.textContent = shown; }, at));
    });
    oracleTimers.push(setTimeout(function () { oracle.className = 'show fade'; }, at + 1800));
    oracleTimers.push(setTimeout(function () { oracle.className = ''; oracle.innerHTML = ''; }, at + 2800));
  }

  // ---------- * Dimension Shift (every 7th click) ----------
  function shift(P, now) {
    var arr = P.particles.array, ll = P.particles.line_linked;
    var savedLine = ll.color_rgb_line ? { r: ll.color_rgb_line.r, g: ll.color_rgb_line.g, b: ll.color_rgb_line.b } : null;
    var saved = [];
    for (var i = 0; i < arr.length; i++) {
      var cr = arr[i].color && arr[i].color.rgb;
      saved.push(cr ? { r: cr.r, g: cr.g, b: cr.b } : null);
      if (cr) { var h = SHIFT[i % SHIFT.length]; cr.r = h.r; cr.g = h.g; cr.b = h.b; }
    }
    if (savedLine) ll.color_rgb_line = { r: SHIFT[0].r, g: SHIFT[0].g, b: SHIFT[0].b };
    var DUR = 3200;
    return {
      kind: 'shift', P: P, t0: now, dur: DUR,
      draw: function (now, k) {
        var t = now - this.t0;
        if (t < 600 || t > DUR - 450) {                     // glitch bars on entry and exit
          for (var g = 0; g < 5; g++) {
            var h = SHIFT[Math.floor(Math.random() * SHIFT.length)];
            ctx.fillStyle = 'rgba(' + h.r + ',' + h.g + ',' + h.b + ',' + (0.06 + Math.random() * 0.1).toFixed(3) + ')';
            ctx.fillRect(0, Math.random() * cv.height, cv.width, (2 + Math.random() * 18) * k);
          }
        }
        ctx.fillStyle = 'rgba(167,139,250,0.035)';          // faint scanlines
        for (var y = 0; y < cv.height; y += 4 * k) ctx.fillRect(0, y, cv.width, k);
      },
      end: function () {                                     // snap back to the real palette
        for (var i = 0; i < arr.length; i++) {
          var cr = arr[i].color && arr[i].color.rgb;
          if (cr && saved[i]) { cr.r = saved[i].r; cr.g = saved[i].g; cr.b = saved[i].b; }
        }
        if (savedLine) ll.color_rgb_line = savedLine;
      }
    };
  }

  // ---------- engine ----------
  function loop(now) {
    var P = pjs(), k = (P && P.canvas && P.canvas.pxratio) || 1, c = palette();
    if (P && P.canvas && P.canvas.el) sync(P);
    ctx.clearRect(0, 0, cv.width, cv.height);

    for (var m = impulses.length - 1; m >= 0; m--) {
      var im = impulses[m];
      im.p.x += im.vx; im.p.y += im.vy;
      im.vx *= 0.9; im.vy *= 0.9;
      if (Math.abs(im.vx) + Math.abs(im.vy) < 0.05 * k) impulses.splice(m, 1);
    }
    for (var a = active.length - 1; a >= 0; a--) {
      var inc = active[a];
      // an incident ends when its time is up, or when the particles were rebuilt (theme toggle)
      var dead = (inc.P && inc.P !== P) || now - inc.t0 > inc.dur;
      if (!dead) { try { inc.draw(now, k, c); } catch (e) { dead = true; } }
      if (dead) { try { if (inc.end) inc.end(); } catch (e) {} active.splice(a, 1); }
    }
    ctx.globalAlpha = 1;

    if (active.length || impulses.length) requestAnimationFrame(loop);
    else { running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }

  document.addEventListener('click', function (e) {
    if (e.button !== 0) return;
    var tgt = e.target;
    if (tgt && tgt.closest && tgt.closest(IGNORE)) return;
    try { var sel = window.getSelection && window.getSelection(); if (sel && !sel.isCollapsed) return; } catch (err) {}
    var P = pjs();
    if (!P || !P.canvas || !P.canvas.el || !P.particles || !P.particles.array) return;
    if (active.length >= 3) return;                          // keep it from piling up

    clicks++;
    sync(P);
    var k = P.canvas.pxratio || 1, x = e.clientX * k, y = e.clientY * k, now = performance.now();
    var shifting = active.some(function (z) { return z.kind === 'shift'; });
    var inc;

    if (clicks % 7 === 0 && !shifting) {
      inc = shift(P, now);
      active.push(blip(x, y, now));
    } else {
      var kind;
      do { kind = Math.floor(Math.random() * 4); } while (kind === lastKind);
      lastKind = kind;
      if (kind === 0) inc = avalanche(P, x, y, now);
      else if (kind === 1) inc = singularity(P, x, y, now);
      else if (kind === 2) inc = shockwave(P, x, y, now);
      else { oracleSpeak(e.clientX, e.clientY); inc = blip(x, y, now); }
    }
    if (inc) active.push(inc);
    kick();
  });
})();
