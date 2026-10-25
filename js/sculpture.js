/* ==========================================================================
   PHILNEX — glass sculptures
   A small raymarched WebGL renderer (no library). Each <canvas class="sculpt">
   draws one slowly morphing, refracting glass object lit by a procedural
   studio environment in the brand palette. Renders only while visible,
   at ~30 fps, at reduced resolution; static frame for prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var VERT = "attribute vec2 p; varying vec2 vUv; void main(){ vUv = p; gl_Position = vec4(p, 0.0, 1.0); }";

  var FRAG = [
    "precision highp float;",
    "varying vec2 vUv;",
    "uniform vec2 uRes;",
    "uniform float uTime;",
    "uniform vec3 uRot;",
    "uniform float uShape;",
    "uniform vec3 uAbsorb;",
    "uniform vec3 uRim;",
    "uniform vec3 uMix;", /* warm, green, violet */

    "mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }",
    "float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }",

    /* organic fluid form */
    "float sdBlob(vec3 p){",
    "  float t = uTime * 0.32;",
    "  float d = length(p - vec3(sin(t) * 0.35, cos(t * 1.1) * 0.3, sin(t * 0.7) * 0.3)) - 0.62;",
    "  d = smin(d, length(p - vec3(cos(t * 0.8) * 0.55, sin(t * 0.9) * 0.45, cos(t * 1.3) * 0.35)) - 0.5, 0.5);",
    "  d = smin(d, length(p - vec3(sin(t * 1.2 + 2.0) * 0.5, -0.35 + cos(t) * 0.25, sin(t * 0.6) * 0.5)) - 0.45, 0.5);",
    "  d = smin(d, length(p - vec3(-0.4 + sin(t * 0.5) * 0.2, 0.4 + cos(t * 0.9) * 0.3, -0.2)) - 0.38, 0.45);",
    "  d = smin(d, length(p - vec3(0.1, 0.0, 0.45 + sin(t) * 0.2)) - 0.34, 0.4);",
    "  d += 0.028 * sin(p.x * 6.0 + t * 2.0) * sin(p.y * 5.0 + t) * sin(p.z * 6.0);",
    "  return d * 0.85;",
    "}",

    /* interlaced twisted glass ribbons */
    "float sdRibbon(vec3 p){",
    "  float d = 1e5;",
    "  for (int i = 0; i < 2; i++){",
    "    vec3 q = p;",
    "    if (i == 1){ q.xy *= rot(1.35); q.yz *= rot(0.9); q.x += 0.18; }",
    "    float a = atan(q.z, q.x);",
    "    vec2 w = vec2(length(q.xz) - 0.62, q.y);",
    "    w *= rot(a * 1.5 + uTime * 0.14);",
    "    float db = length(max(abs(w) - vec2(0.045, 0.2), 0.0)) - 0.045;",
    "    d = smin(d, db, 0.08);",
    "  }",
    "  return d * 0.9;",
    "}",

    /* cluster of glass bubbles */
    "float sdBubbles(vec3 p){",
    "  float t = uTime * 0.2;",
    "  float d = length(p) - 0.5;",
    "  d = smin(d, length(p - vec3(0.58 + sin(t) * 0.05, 0.28, -0.1)) - 0.34, 0.08);",
    "  d = smin(d, length(p - vec3(-0.5, 0.35 + cos(t * 1.2) * 0.04, 0.18)) - 0.3, 0.08);",
    "  d = smin(d, length(p - vec3(-0.22, -0.52, 0.1 + sin(t) * 0.05)) - 0.32, 0.08);",
    "  d = smin(d, length(p - vec3(0.38, -0.42, 0.28)) - 0.24, 0.06);",
    "  d = smin(d, length(p - vec3(0.05, 0.62, 0.3)) - 0.2, 0.06);",
    "  d = smin(d, length(p - vec3(-0.7, -0.12, -0.2)) - 0.2, 0.06);",
    "  return d;",
    "}",

    "float map(vec3 p){",
    "  p.xz *= rot(uRot.x); p.yz *= rot(uRot.y); p.xy *= rot(uRot.z);",
    "  if (uShape < 0.5) return sdBlob(p);",
    "  if (uShape < 1.5) return sdRibbon(p);",
    "  return sdBubbles(p);",
    "}",

    "vec3 calcNormal(vec3 p){",
    "  vec2 e = vec2(1.0, -1.0) * 0.0016;",
    "  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));",
    "}",

    /* procedural studio: dark forest room, warm softbox, window bars, green rim, a trace of violet */
    "vec3 env(vec3 d){",
    "  vec3 col = mix(vec3(0.012, 0.02, 0.014), vec3(0.04, 0.07, 0.045), d.y * 0.5 + 0.5);",
    "  vec3 L1 = normalize(vec3(-0.55, 0.65, 0.5));",
    "  float k1 = max(dot(d, L1), 0.0);",
    "  col += vec3(1.0, 0.44, 0.14) * (pow(k1, 6.0) * 0.9 + pow(k1, 60.0) * 2.2) * uMix.x;",
    "  float bars = smoothstep(0.6, 0.9, sin(d.x * 9.0 + 1.0) * 0.5 + 0.5) * smoothstep(-0.1, 0.4, d.y + 0.1) * smoothstep(1.0, 0.2, abs(d.z + 0.3));",
    "  col += vec3(1.0, 0.78, 0.5) * bars * 0.32 * step(0.0, d.x) * uMix.x;",
    "  vec3 L2 = normalize(vec3(0.85, 0.15, -0.35));",
    "  col += vec3(0.16, 0.75, 0.36) * pow(max(dot(d, L2), 0.0), 10.0) * 0.9 * uMix.y;",
    "  vec3 L3 = normalize(vec3(-0.2, -0.7, -0.7));",
    "  col += vec3(0.42, 0.2, 0.78) * pow(max(dot(d, L3), 0.0), 7.0) * 0.4 * uMix.z;",
    "  col += vec3(0.5, 0.18, 0.06) * smoothstep(-0.2, -0.9, d.y) * 0.3 * uMix.x;",
    "  return col;",
    "}",

    "void main(){",
    "  vec2 uv = vUv; uv.x *= uRes.x / uRes.y;",
    "  vec3 ro = vec3(0.0, 0.0, 3.8);",
    "  vec3 rd = normalize(vec3(uv, -2.9));",
    "  float b = dot(ro, rd); float c = dot(ro, ro) - 1.7 * 1.7; float h = b * b - c;",
    "  if (h < 0.0){ gl_FragColor = vec4(0.0); return; }",
    "  float t = -b - sqrt(h); float tf = -b + sqrt(h);",
    "  float minD = 1e5; float tMin = t; bool hit = false;",
    "  for (int i = 0; i < 72; i++){",
    "    float d = map(ro + rd * t);",
    "    if (d < minD){ minD = d; tMin = t; }",
    "    if (d < 0.0012){ hit = true; break; }",
    "    t += d; if (t > tf) break;",
    "  }",
    "  float pix = (2.0 / uRes.y) * 3.8 / 2.9;",
    "  float alpha = hit ? 1.0 : 1.0 - smoothstep(0.4 * pix, 1.4 * pix, minD);",
    "  if (alpha <= 0.0){ gl_FragColor = vec4(0.0); return; }",
    "  vec3 p = ro + rd * (hit ? t : tMin);",
    "  vec3 n = calcNormal(p);",
    "  float cosT = clamp(dot(n, -rd), 0.0, 1.0);",
    "  float fres = 0.04 + 0.96 * pow(1.0 - cosT, 5.0);",
    "  vec3 refl = env(reflect(rd, n));",
    "  vec3 rdIn = refract(rd, n, 1.0 / 1.45);",
    "  vec3 rpos = p - n * 0.004; float tt = 0.02;",
    "  for (int i = 0; i < 34; i++){",
    "    float d = -map(rpos + rdIn * tt);",
    "    if (d < 0.002) break;",
    "    tt += max(d, 0.012); if (tt > 3.5) break;",
    "  }",
    "  vec3 ex = rpos + rdIn * tt;",
    "  vec3 nEx = calcNormal(ex);",
    "  vec3 outR = refract(rdIn, -nEx, 1.45);",
    "  vec3 tr;",
    "  if (dot(outR, outR) < 0.001){ tr = env(reflect(rdIn, -nEx)) * 0.55; }",
    "  else {",
    "    vec3 rr = refract(rdIn, -nEx, 1.43); vec3 rb = refract(rdIn, -nEx, 1.48);",
    "    vec3 e0 = env(outR);",
    "    float cr = dot(rr, rr) > 0.001 ? env(rr).r : e0.r;",
    "    float cb = dot(rb, rb) > 0.001 ? env(rb).b : e0.b;",
    "    tr = vec3(cr, e0.g, cb);",
    "  }",
    "  tr *= exp(-tt * uAbsorb);",
    "  vec3 col = mix(tr, refl, fres) + refl * 0.05;",
    "  col += uRim * pow(1.0 - cosT, 3.0);",
    "  col = 1.0 - exp(-col * 1.05);",
    "  col = pow(col, vec3(0.4545));",
    "  gl_FragColor = vec4(col * alpha, alpha);",
    "}"
  ].join("\n");

  /* palettes: absorb, rim, mix(warm, green, violet) */
  var PALETTES = [
    { absorb: [2.7, 0.8, 2.1], rim: [0.04, 0.55, 0.26], mix: [0.7, 1.15, 0.4] },   /* 0 emerald black glass */
    { absorb: [0.9, 0.25, 1.9], rim: [0.3, 0.34, 0.04], mix: [1.0, 0.8, 0.15] },   /* 1 olive glass ribbons */
    { absorb: [0.25, 0.9, 2.6], rim: [0.5, 0.2, 0.02], mix: [1.45, 0.45, 0.45] },  /* 2 amber orange glass */
    { absorb: [2.7, 0.8, 1.8], rim: [0.05, 0.5, 0.26], mix: [0.6, 1.0, 1.1] }     /* 3 emerald, a trace more violet */
  ];

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = window.matchMedia("(max-width: 760px)").matches;
  var items = [], running = false, last = 0;
  var mouse = { x: 0, y: 0, sx: 0, sy: 0 };

  window.addEventListener("mousemove", function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }

  function Sculpt(canvas) {
    this.canvas = canvas;
    this.shape = parseFloat(canvas.dataset.shape || 0);
    this.pal = PALETTES[parseInt(canvas.dataset.pal || 0, 10)] || PALETTES[0];
    this.seed = Math.random() * 20;
    this.visible = false;
    this.ok = false;

    var gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return this.fallback();
    var vs = compile(gl, gl.VERTEX_SHADER, VERT), fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return this.fallback();
    var pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return this.fallback();
    gl.useProgram(pr);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    this.gl = gl;
    this.u = {};
    var self = this;
    ["uRes", "uTime", "uRot", "uShape", "uAbsorb", "uRim", "uMix"].forEach(function (n) { self.u[n] = gl.getUniformLocation(pr, n); });
    gl.uniform1f(this.u.uShape, this.shape);
    gl.uniform3fv(this.u.uAbsorb, this.pal.absorb);
    gl.uniform3fv(this.u.uRim, this.pal.rim);
    gl.uniform3fv(this.u.uMix, this.pal.mix);
    this.ok = true;
    this.resize();

    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); self.fallback(); });
    new IntersectionObserver(function (es) {
      self.visible = es[0].isIntersecting;
      if (self.visible) { self.render(performance.now()); start(); }
    }, { rootMargin: "240px 0px" }).observe(canvas);
    items.push(this);
  }

  Sculpt.prototype.fallback = function () {
    this.ok = false;
    this.canvas.classList.add("is-fallback");
    return this;
  };

  Sculpt.prototype.resize = function () {
    if (!this.ok) return;
    var c = this.canvas;
    var w = c.clientWidth || 300, h = c.clientHeight || 300;
    var s = Math.min(window.devicePixelRatio || 1, 1.25) * (small ? 0.75 : 1);
    c.width = Math.max(64, Math.round(w * s));
    c.height = Math.max(64, Math.round(h * s));
    this.gl.viewport(0, 0, c.width, c.height);
    this.gl.uniform2f(this.u.uRes, c.width, c.height);
  };

  Sculpt.prototype.render = function (now) {
    if (!this.ok) return;
    var r = this.canvas.getBoundingClientRect();
    var vh = window.innerHeight;
    var scrollAng = ((r.top + r.height / 2 - vh / 2) / vh) * -1.4;
    var t = reduce ? 4.0 + this.seed : now * 0.001 + this.seed;
    var gl = this.gl;
    gl.uniform1f(this.u.uTime, t);
    gl.uniform3f(this.u.uRot,
      t * 0.1 + scrollAng + mouse.sx * 0.5,
      0.35 + Math.sin(t * 0.12) * 0.18 + mouse.sy * 0.3,
      0.15 * Math.sin(t * 0.07));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  function loop(now) {
    if (document.hidden) { requestAnimationFrame(loop); return; }
    if (now - last >= 32) {
      last = now;
      mouse.sx += (mouse.x - mouse.sx) * 0.05;
      mouse.sy += (mouse.y - mouse.sy) * 0.05;
      for (var i = 0; i < items.length; i++) if (items[i].visible) items[i].render(now);
    }
    requestAnimationFrame(loop);
  }
  function start() {
    if (running || reduce) return;
    running = true;
    requestAnimationFrame(loop);
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      small = window.matchMedia("(max-width: 760px)").matches;
      items.forEach(function (s) { s.resize(); if (s.visible) s.render(performance.now()); });
    }, 150);
  });

  function mountAll() {
    Array.prototype.forEach.call(document.querySelectorAll("canvas.sculpt"), function (c) { new Sculpt(c); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAll); else mountAll();
  window.Sculpture = { count: function () { return items.length; } };
})();
