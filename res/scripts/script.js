(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  const REDUCED_MOTION = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const root = document.documentElement;
  const booting = () => root.classList.contains('booting');


  const MARQUEE_1 = 'FULL STACK ✶ DEVOPS ✶ REVERSE ENGINEERING ✶ BOTS ✶ ';
  const MARQUEE_2 = 'CONTAINMENT FAILURE ✶ DO NOT LOOK AWAY ✶ IT SEES YOU ✶ ';

  $('#m1').textContent = MARQUEE_1.repeat(8);
  $('#m2').textContent = MARQUEE_2.repeat(8);


  const SKILLS = {
    l: [
      ['py', 'Python', 'https://www.python.org/'],
      ['go', 'Go', 'https://go.dev/'],
      ['js', 'JavaScript', 'https://developer.mozilla.org/docs/Web/JavaScript'],
      ['dart', 'Dart', 'https://dart.dev/'],
      ['cpp', 'C++', 'https://isocpp.org/'],
      ['c', 'C', 'https://en.cppreference.com/w/c'],
      ['html', 'HTML', 'https://developer.mozilla.org/docs/Web/HTML'],
      ['css', 'CSS', 'https://developer.mozilla.org/docs/Web/CSS'],
      [0, 'NASM', 'https://www.nasm.us/', 'ASM'],
      [0, 'Smali', 'https://github.com/JesusFreke/smali', 'smali'],
    ],
    f: [
      ['fastapi', 'FastAPI', 'https://fastapi.tiangolo.com/'],
      [0, 'aiohttp', 'https://docs.aiohttp.org/', 'aio'],
      ['flask', 'Flask', 'https://flask.palletsprojects.com/'],
      ['flutter', 'Flutter', 'https://flutter.dev/'],
      ['postgres', 'Postgres', 'https://www.postgresql.org/'],
      ['mongodb', 'MongoDB', 'https://www.mongodb.com/'],
      ['redis', 'Redis', 'https://redis.io/'],
      ['mysql', 'MySQL', 'https://www.mysql.com/'],
      ['sqlite', 'SQLite', 'https://www.sqlite.org/'],
      [0, 'JSON', 'https://www.json.org/', '{ }'],
      [0, 'gRPC', 'https://grpc.io/', 'gRPC'],
    ],
    t: [
      ['docker', 'Docker', 'https://www.docker.com/'],
      ['linux', 'Linux', 'https://www.kernel.org/'],
      ['git', 'Git', 'https://git-scm.com/'],
      ['windows', 'Windows', 'https://www.microsoft.com/windows'],
      ['vscode', 'VS Code', 'https://code.visualstudio.com/'],
      ['apple', 'macOS', 'https://www.apple.com/macos/', 'mac'],
      [0, 'Android', 'https://www.android.com/', 'and'],
      [0, 'iOS', 'https://www.apple.com/ios/', 'iOS'],
      ['arduino', 'Arduino', 'https://www.arduino.cc/'],
    ],
  };

  function renderSkill([icon, name, url, badge]) {
    const fallback = badge || name.slice(0, 3);
    const visual = icon
      ? `<img loading="lazy" src="https://skillicons.dev/icons?i=${icon}&theme=dark" alt="" width="40" height="40"
              data-b="${fallback}"
              onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'b',textContent:this.dataset.b}))">`
      : `<span class="b">${badge}</span>`;

    return `<a href="${url}" target="_blank" rel="noopener" aria-label="${name} (official site)">${visual}${name}</a>`;
  }

  $$('.sk').forEach((grid) => {
    grid.innerHTML = SKILLS[grid.dataset.k].map(renderSkill).join('');
  });

  const FOCUS_BARS = [
    ['Backend / API', 95],
    ['Bots / automation', 90],
    ['Reverse eng.', 85],
    ['DevOps', 75],
    ['Low-level C/ASM', 70],
    ['Frontend', 40],
  ];

  $('#bars').innerHTML =
    '<h3>core focus // load</h3>' +
    FOCUS_BARS.map(([label, value]) => `
      <div class="bar${value < 50 ? ' lo' : ''}">
        <span>${label}</span>
        <i><b data-w="${value}"></b></i>
        <em>${value}%</em>
      </div>`).join('');


  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      $$('b[data-w]', entry.target).forEach((bar) => {
        bar.style.width = bar.dataset.w + '%';
      });
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .15 });

  $$('.r').forEach((el) => revealObserver.observe(el));



  {
    const canvas = $('#noise');
    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(160, 90);

    const drawNoise = () => {
      const d = image.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i]     = v;
        d[i + 1] = v * (Math.random() > .9 ? .2 : 1);
        d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    };

    if (REDUCED_MOTION) drawNoise();
    else setInterval(drawNoise, 90);
  }


  setInterval(() => {
    $('#clk').textContent = new Date().toTimeString().slice(0, 8);
  }, 1000);



  const Sound = (() => {
    let audioCtx, master, noiseBuffer;
    let enabled = false;

    function getCtx() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        master = audioCtx.createGain();
        master.gain.value = .9;

        const lowpass = audioCtx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 7000;
        master.connect(lowpass);
        lowpass.connect(audioCtx.destination);

        noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function tone(freq, dur, type = 'sine', vol = .2, freqEnd, filter) {
      if (!enabled) return;
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(.0008, now + dur);

      let node = osc;
      if (filter) {
        const biquad = ctx.createBiquadFilter();
        biquad.type = filter[0];
        biquad.frequency.value = filter[1];
        osc.connect(biquad);
        node = biquad;
      }

      node.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + dur + .03);
    }

    function noise(dur, vol, filterType = 'bandpass', freq = 1500, q = 1, freqEnd) {
      if (!enabled) return;
      const ctx = getCtx();
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      src.buffer = noiseBuffer;
      filter.type = filterType;
      filter.frequency.setValueAtTime(freq, now);
      if (freqEnd) filter.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);
      filter.Q.value = q;

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(.0008, now + dur);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      src.start(now, Math.random() * .5, dur + .02);
    }

    return {
      set(on) {
        enabled = on;
        if (on) {
          getCtx();
          noise(.6, .07, 'bandpass', 200, 1, 2600);
        }
      },
      tick: () => noise(.008, .012, 'highpass', 6000),
      hit: () => {
        noise(.014, .15, 'highpass', 3500);
        setTimeout(() => noise(.01, .1, 'highpass', 5200), 24);
      },
      zap: () => {
        noise(.06, .06, 'bandpass', 140, 2);
        tone(100, .08, 'sawtooth', .04, 60, ['lowpass', 300]);
      },
      glitch: () => {
        noise(.35, .12, 'bandpass', 4200, 1.2, 320);
        setTimeout(() => noise(.12, .08, 'highpass', 2500), 130);
      },
      beep: () => tone(1000, .14, 'square', .05),
      key: () => noise(.012, .05, 'highpass', 4000),
      hdd: () => {
        noise(.02, .06, 'bandpass', rand(600, 1400), 2);
        tone(rand(60, 100), .04, 'square', .02);
      },
      power: () => {
        tone(45, .6, 'sine', .22, 110);
        noise(.5, .07, 'bandpass', 300, 1, 3500);
      },
      alarm: () => {
        tone(440, .16, 'square', .06);
        setTimeout(() => tone(310, .3, 'square', .06), 170);
      },
    };
  })();

  const sfxButton = $('#snd');
  const setSfx = (on) => {
    sfxButton.setAttribute('aria-pressed', on);
    Sound.set(on);
  };
  sfxButton.onclick = () => setSfx(sfxButton.getAttribute('aria-pressed') !== 'true');

  const TRACKS = ['res/music/loop.mp3'];

  const Music = (() => {
    const audio = new Audio();
    let index = 0;
    let enabled = false;
    let fadeTimer;

    audio.preload = 'none';
    audio.loop = TRACKS.length === 1;
    audio.src = TRACKS[0];
    audio.volume = 0;

    audio.onended = () => {
      index = (index + 1) % TRACKS.length;
      audio.src = TRACKS[index];
      if (enabled) audio.play().catch(() => {});
    };

    function fadeTo(target) {
      clearInterval(fadeTimer);
      fadeTimer = setInterval(() => {
        const diff = target - audio.volume;
        audio.volume = Math.abs(diff) < .03
          ? target
          : Math.max(0, Math.min(1, audio.volume + Math.sign(diff) * .03));
      }, 60);
      setTimeout(() => clearInterval(fadeTimer), 1800);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) audio.pause();
      else if (enabled) audio.play().catch(() => {});
    });

    return {
      set(on, level = .55) {
        enabled = on;
        if (on) {
          audio.play().then(() => fadeTo(level)).catch(() => {});
        } else {
          fadeTo(0);
          setTimeout(() => { if (!enabled) audio.pause(); }, 1800);
        }
      },
      level(v) { if (enabled) fadeTo(v); },
    };
  })();

  const musicButton = $('#mus');
  const setMusic = (on, level) => {
    musicButton.setAttribute('aria-pressed', on);
    Music.set(on, level);
  };
  musicButton.onclick = () => setMusic(musicButton.getAttribute('aria-pressed') !== 'true');

  (async () => {
    const boot = $('#boot');
    if (REDUCED_MOTION) {
      root.classList.remove('booting');
      boot.remove();
      return;
    }

    const out = $('#bt');
    const SKIP = Symbol('skip');
    let skipped = false;
    let done = false;
    let wake;

    const sleep = (ms) => new Promise((res) => { wake = res; setTimeout(res, ms); })
      .then(() => { if (skipped) throw SKIP; });
    const print = (html = '') => out.insertAdjacentHTML('beforeend', html + '\n');
    const type = async (text, ms = 22) => {
      for (const ch of text) {
        out.append(ch);
        Sound.key();
        await sleep(ms);
      }
    };

    function onSkip() {
      skipped = true;
      if (wake) wake();
    }

    function finish() {
      if (done) return;
      done = true;
      ['click', 'touchend', 'keydown'].forEach((t) => removeEventListener(t, onSkip));
      root.classList.remove('booting');
      boot.classList.add('out');
      document.body.classList.add('tear');
      Sound.glitch();
      Music.level(.55);
      setTimeout(() => {
        document.body.classList.remove('tear');
        boot.remove();
      }, 450);
    }

    async function sequence() {
      await sleep(350);
      Sound.beep();
      print('ALX0RR BIOS v2.6.0');
      print('<span class="d">(C) 1994-2026 Alx0rr Systems</span>');
      print();
      await sleep(300);

      print('CPU ........ 486DX2-66 ok');
      await sleep(180);

      print('MEMORY ..... <span id="bm">    0</span>K<span id="bmo"></span>');
      const mem = $('#bm');
      for (let k = 1; k <= 16; k++) {
        mem.textContent = String(k * 4096).padStart(5, ' ');
        Sound.tick();
        await sleep(40);
      }
      $('#bmo').textContent = ' ok';
      await sleep(150);

      print('VIDEO ...... CRT 640x480 ok');
      await sleep(180);
      print('DRIVES ..... HDD0 HDD1 ok');
      for (let k = 0; k < 4; k++) { Sound.hdd(); await sleep(70); }
      print('NETWORK .... link up <span class="d">(why?)</span>');
      await sleep(250);

      print();
      print('LOADING ALX0RR.SYS');
      print('[<span id="bb"></span>] <span id="bpc">0</span>%');
      const bar = $('#bb');
      const pc = $('#bpc');
      const draw = (n) => {
        bar.textContent = '#'.repeat(n) + '-'.repeat(20 - n);
        pc.textContent = n * 5;
      };
      for (let n = 0; n <= 17; n++) {
        draw(n);
        if (Math.random() < .7) Sound.hdd();
        await sleep(rand(30, 80));
      }
      await sleep(450);

      boot.classList.add('err');
      out.textContent = '';
      Sound.glitch();
      Sound.alarm();
      print('<span class="i"> FATAL EXCEPTION 0E </span>');
      print('at 0028:C0011E36');
      print('<span class="d">module: CONTAINMENT.SYS</span>');
      print();
      print('<span class="e">CONTAINMENT FAILURE</span>');
      await sleep(300);
      print('SUBJECT DETECTED.');
      await sleep(300);
      print('TRACKING ENABLED.');
      print();
      await sleep(450);

      await type('> abort? [Y/N] ');
      await sleep(400);
      await type('n', 120);
      print();
      await sleep(300);
      print('> abort denied.');
      await sleep(350);
      print('> no one is coming.');
      await sleep(500);
      print('> resuming anyway<span class="cur"></span>');
      await sleep(700);
    }

    await new Promise((resolve) => {
      const go = (e) => {
        if (e.type === 'keydown' && e.key === 'Escape') return;
        ['click', 'touchend', 'pointerup', 'keydown'].forEach((t) => removeEventListener(t, go));
        resolve();
      };
      ['click', 'touchend', 'pointerup', 'keydown'].forEach((t) => addEventListener(t, go));
    });

    setSfx(true);
    setMusic(true, .12);
    Sound.power();
    $('#bgo').remove();
    boot.classList.add('run');
    setTimeout(() => {
      if (done) return;
      ['click', 'touchend', 'keydown'].forEach((t) => addEventListener(t, onSkip));
    }, 600);

    try {
      await sequence();
    } catch (e) {
      if (e !== SKIP) throw e;
    }
    finish();
  })();

  $$('a,.btn').forEach((el) => el.addEventListener('pointerenter', () => Sound.tick()));
  $$('a.btn,.pj a,#contact a').forEach((el) => el.addEventListener('pointerdown', () => Sound.hit()));


  {
    const canvas = document.createElement('canvas');
    canvas.id = 'trk';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const GLITCH_COLORS = ['#8c0e18', '#8c0e18', '#3d0008', '#4a0f80', '#a88884', '#8a5c00'];
    const TARGETS = $$('h1 .g,.btn,.sub,.pj a,.sk a,h2,#contact a.big,.q');

    let enabled = !REDUCED_MOTION;
    let W, H;
    let mouseX, mouseY;
    let glitchBlocks = [];
    let fakeBoxes = [];
    let frame = 0;
    let lastDraw = 0;

    function resize() {
      W = innerWidth;
      H = innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    addEventListener('resize', resize);

    mouseX = W * .6;
    mouseY = H * .4;
    addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });


    function label(text, x, y) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000';
      ctx.strokeText(text, x, y);
      ctx.fillStyle = '#dcc4c0';
      ctx.fillText(text, x, y);
    }

    function brackets(left, top, w, h, k) {
      ctx.beginPath();
      [
        [left,     top,      1,  1],
        [left + w, top,     -1,  1],
        [left,     top + h,  1, -1],
        [left + w, top + h, -1, -1],
      ].forEach(([x, y, dx, dy]) => {
        ctx.moveTo(x + dx * k, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + dy * k);
      });
      ctx.stroke();
    }

    function questionMark(x, y, size) {
      ctx.save();
      ctx.font = size + 'px "Space Mono",monospace';
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#fff';
      ctx.strokeText('?', x, y);
      ctx.restore();
    }

    function nearestTargets() {
      const visible = [];
      TARGETS.forEach((el) => {
        const r = el.getBoundingClientRect();
        const onScreen = r.bottom > 40 && r.top < H && r.right > 0 && r.left < W;
        if (onScreen && r.width > 40 && r.height > 16) {
          const dist = Math.hypot(r.left + r.width / 2 - mouseX, r.top + r.height / 2 - mouseY);
          visible.push([dist, r]);
        }
      });
      visible.sort((a, b) => a[0] - b[0]);
      return visible.slice(0, W < 760 ? 3 : 4);
    }

    function drawTargets(targets) {

      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -frame;
      ctx.beginPath();
      targets.forEach(([, r]) => {
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(r.left, r.top);
      });
      ctx.globalAlpha = .5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      targets.forEach(([, r], i) => {
        const jitter = Math.random() > .93 ? rand(-7, 7) : 0;
        const left = r.left + jitter;
        const top = r.top;
        const k = Math.min(9, r.width / 4, r.height / 3);

        brackets(left, top, r.width, r.height, k);
        ctx.strokeRect(left - .5, top - .5, r.width, r.height);
        ctx.globalAlpha = .25;
        ctx.strokeRect(left - .5, top - .5, r.width, r.height);
        ctx.globalAlpha = 1;

        label('x:' + (left | 0) + ' y:' + (top | 0), Math.max(2, left), Math.max(44, top - 16));
        if (i % 3 === 0) questionMark(left + r.width - 12, top - 6, 20);
      });
    }

    function drawPointer() {
      ctx.strokeStyle = '#9c6b00';
      brackets(mouseX - 20, mouseY - 20, 40, 40, 8);
      ctx.strokeStyle = '#fff';
      label('x:' + (mouseX | 0) + ' y:' + (mouseY | 0), mouseX + 26, mouseY - 5);
    }

    function drawFakeDetections() {
      if (fakeBoxes.length < 2 && Math.random() < .025) {
        fakeBoxes.push({
          x: rand(0, W - 120),
          y: rand(60, H - 80),
          w: rand(30, 90),
          h: rand(24, 60),
          life: rand(14, 34) | 0,
          question: Math.random() > .5,
        });
      }

      fakeBoxes = fakeBoxes.filter((b) => b.life-- > 0);
      fakeBoxes.forEach((b) => {
        brackets(b.x, b.y, b.w, b.h, 10);
        label('x:' + (b.x | 0) + ' y:' + (b.y | 0), b.x, b.y - 15);
        if (b.question) questionMark(b.x + b.w / 2 - 6, b.y + b.h / 2 - 10, 20);
      });
    }

    function drawGlitchBlocks() {
      if (Math.random() < .1) {
        const count = 1 + ((Math.random() * 2) | 0);
        for (let i = 0; i < count; i++) {
          const isBar = Math.random() > .55;
          glitchBlocks.push(isBar
            ? { x: rand(0, W * .4), y: rand(50, H), w: rand(W * .1, W * .45), h: rand(2, 7), c: pick(GLITCH_COLORS), life: rand(2, 5) | 0 }
            : { x: rand(0, W - 80), y: rand(50, H - 60), w: rand(16, 70), h: rand(8, 30), c: pick(GLITCH_COLORS), life: rand(2, 6) | 0, mosaic: Math.random() > .6 });
        }
      }

      glitchBlocks = glitchBlocks.filter((b) => b.life-- > 0).slice(-6);

      glitchBlocks.forEach((b) => {
        ctx.globalAlpha = .7;
        ctx.fillStyle = b.c;
        if (b.mosaic) {
          const s = 6;
          for (let dx = 0; dx < b.w; dx += s) {
            for (let dy = 0; dy < b.h; dy += s) {
              ctx.fillStyle = pick(GLITCH_COLORS);
              ctx.fillRect(b.x + dx, b.y + dy, s - 1, s - 1);
            }
          }
        } else {
          ctx.fillRect(b.x, b.y, b.w, b.h);
        }
      });
      ctx.globalAlpha = 1;
    }

    function draw(time) {
      requestAnimationFrame(draw);
      if (!enabled || time - lastDraw < 45) return;
      lastDraw = time;
      frame++;

      ctx.clearRect(0, 0, W, H);
      ctx.textBaseline = 'top';
      ctx.font = '10px "Space Mono",monospace';
      ctx.strokeStyle = 'rgba(215,185,180,.8)';
      ctx.lineWidth = 1.3;

      drawTargets(nearestTargets());
      drawPointer();
      drawFakeDetections();
      drawGlitchBlocks();
    }
    requestAnimationFrame(draw);

    const toggle = $('#trkb');
    toggle.setAttribute('aria-pressed', enabled);
    toggle.onclick = () => {
      enabled = !enabled;
      toggle.setAttribute('aria-pressed', enabled);
      if (!enabled) ctx.clearRect(0, 0, W, H);
    };
  }



  {
    const canvas = document.createElement('canvas');
    canvas.id = 'pcb';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    const base = document.createElement('canvas');
    const baseCtx = base.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);


    const DIRS = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];

    let W, H, grid;
    let paths = [];
    let pulses = [];
    let drips = [];
    let resizeTimer;
    let lastFrame = 0;

    function newPulse() {
      return { path: pick(paths), seg: 0, t: 0, speed: rand(60, 140), trail: [] };
    }

    function pulsePosition(p) {
      const a = p.path[p.seg];
      const b = p.path[p.seg + 1];
      return [a[0] + (b[0] - a[0]) * p.t, a[1] + (b[1] - a[1]) * p.t];
    }

    function generatePath() {
      let gx = rand(0, W / grid) | 0;
      let gy = rand(0, H / grid) | 0;
      let dir = ((Math.random() * 4) | 0) * 2;
      const points = [[gx * grid, gy * grid]];
      const segments = rand(4, 12) | 0;

      for (let s = 0; s < segments; s++) {
        const len = rand(2, 7) | 0;
        gx += DIRS[dir][0] * len;
        gy += DIRS[dir][1] * len;
        points.push([gx * grid, gy * grid]);

        const turn = Math.random() < .5 ? 1 : 7;
        const extra = Math.random() < .25 ? (Math.random() < .5 ? 1 : 7) : 0;
        dir = (dir + turn + extra) % 8;
      }
      return points;
    }

    function drawStaticLayer(count) {
      baseCtx.lineJoin = 'miter';
      baseCtx.lineWidth = 1.3;

      paths.forEach((p) => {
        baseCtx.strokeStyle = 'rgba(105,12,22,.5)';
        baseCtx.beginPath();
        p.forEach(([x, y], i) => (i ? baseCtx.lineTo(x, y) : baseCtx.moveTo(x, y)));
        baseCtx.stroke();

        const [ex, ey] = p[p.length - 1];
        baseCtx.beginPath();
        baseCtx.arc(ex, ey, 4, 0, 7);
        baseCtx.stroke();
        baseCtx.fillStyle = 'rgba(120,14,26,.6)';
        baseCtx.beginPath();
        baseCtx.arc(ex, ey, 1.6, 0, 7);
        baseCtx.fill();
      });

      const chips = Math.max(2, (count / 10) | 0);
      for (let i = 0; i < chips; i++) {
        const w = ((rand(4, 8) | 0) * grid);
        const h = ((rand(3, 5) | 0) * grid);
        const left = rand(0, W - w) | 0;
        const top = rand(60, H - h) | 0;

        baseCtx.fillStyle = 'rgba(3,0,1,.82)';
        baseCtx.fillRect(left, top, w, h);
        baseCtx.strokeStyle = 'rgba(110,12,22,.55)';
        baseCtx.strokeRect(left + .5, top + .5, w, h);

        baseCtx.beginPath();
        for (let k = grid / 2; k < w; k += grid / 1.5) {
          baseCtx.moveTo(left + k, top);
          baseCtx.lineTo(left + k, top - 6);
          baseCtx.moveTo(left + k, top + h);
          baseCtx.lineTo(left + k, top + h + 6);
        }
        baseCtx.stroke();
      }
    }

    function build() {
      W = innerWidth;
      H = innerHeight;
      grid = W < 760 ? 20 : 26;

      [canvas, base].forEach((c) => {
        c.width = W * dpr;
        c.height = H * dpr;
      });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseCtx.clearRect(0, 0, W, H);

      const count = Math.round((W * H) / (grid * grid * 34));
      paths = Array.from({ length: count }, generatePath);
      drawStaticLayer(count);

      const pulseCount = Math.min(paths.length, W < 760 ? 14 : 24);
      pulses = Array.from({ length: pulseCount }, newPulse);
    }

    function advancePulse(p, index, dt) {
      let dist = p.speed * dt;

      while (dist > 0) {
        const a = p.path[p.seg];
        const b = p.path[p.seg + 1];
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const remaining = len * (1 - p.t);

        if (dist < remaining) {
          p.t += dist / len;
          dist = 0;
        } else {
          dist -= remaining;
          p.seg++;
          p.t = 0;

          if (p.seg >= p.path.length - 1) {
            const end = p.path[p.path.length - 1];
            if (Math.random() < .4 && drips.length < 14) {
              drips.push({ x: end[0], y: end[1], len: 0, max: rand(25, 110), alpha: 1 });
            }
            pulses[index] = newPulse();
            return false;
          }
        }
      }
      return true;
    }

    function drawPulse(p) {
      const pos = pulsePosition(p);
      p.trail.push(pos);
      if (p.trail.length > 9) p.trail.shift();

      p.trail.forEach(([x, y], k) => {
        ctx.fillStyle = 'rgba(150,12,24,' + (k / p.trail.length * .4) + ')';
        ctx.beginPath();
        ctx.arc(x, y, 1 + k / 9 * 1.4, 0, 7);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(150,12,24,.14)';
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], 6, 0, 7);
      ctx.fill();

      ctx.fillStyle = 'rgba(190,20,34,.8)';
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], 2, 0, 7);
      ctx.fill();
    }

    function drawDrips(dt) {
      drips = drips.filter((d) => d.alpha > 0);
      drips.forEach((d) => {
        if (d.len < d.max) d.len += 40 * dt;
        else d.alpha -= dt * .5;

        ctx.strokeStyle = 'rgba(140,10,22,' + d.alpha * .8 + ')';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.len);
        ctx.stroke();

        ctx.fillStyle = 'rgba(150,12,24,' + d.alpha * .9 + ')';
        ctx.beginPath();
        ctx.arc(d.x, d.y + d.len, 2.8, 0, 7);
        ctx.fill();
      });
    }

    function draw(time) {
      requestAnimationFrame(draw);
      if (time - lastFrame < 33) return;

      const dt = Math.min(.08, (time - lastFrame) / 1000);
      lastFrame = time;

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(base, 0, 0, W, H);

      pulses.forEach((p, i) => {
        if (advancePulse(p, i, dt)) drawPulse(p);
      });
      drawDrips(dt);
    }

    build();
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    });

    if (REDUCED_MOTION) ctx.drawImage(base, 0, 0, W, H);
    else requestAnimationFrame(draw);
  }

  {
    const panel = $('#prof');
    if (panel) {
      const nav = navigator;
      const ua = nav.userAgent;
      const conn = nav.connection || {};
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const setValue = (id, value) => {
        const el = $('#p-' + id);
        if (el) el.textContent = value;
      };

      const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
      }[m]));

      const gpu = (() => {
        try {
          const gl = document.createElement('canvas').getContext('webgl');
          const ext = gl.getExtension('WEBGL_debug_renderer_info');
          return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'hidden';
        } catch (e) {
          return 'hidden';
        }
      })();

      const os =
        /Windows/.test(ua) ? 'Windows' :
        /Android/.test(ua) ? 'Android' :
        /iPhone|iPad|iPod/.test(ua) ? 'iOS' :
        /Mac/.test(ua) ? 'macOS' :
        /Linux/.test(ua) ? 'Linux' : 'unknown';

      const browser =
        /Edg\//.test(ua) ? 'Edge' :
        /OPR\//.test(ua) ? 'Opera' :
        /Firefox\//.test(ua) ? 'Firefox' :
        /Chrome\//.test(ua) ? 'Chrome' :
        /Safari\//.test(ua) ? 'Safari' : 'unknown';

      const hash = (str) => {
        let h = 2166136261;
        for (const ch of str) {
          h ^= ch.charCodeAt(0);
          h = Math.imul(h, 16777619);
        }
        return (h >>> 0).toString(16).toUpperCase().padStart(8, '0');
      };

      const rows = [
        ['subject',    '#' + hash(ua + screen.width + screen.height + tz + gpu)],
        ['ip',         'scanning...', 'ip'],
        ['location',   'scanning...', 'loc'],
        ['provider',   'scanning...', 'isp'],
        ['device',     os + ' / ' + browser],
        ['screen',     screen.width + 'x' + screen.height + ' @' + (devicePixelRatio || 1) + 'x'],
        ['language',   (nav.languages || [nav.language]).slice(0, 3).join(', ')],
        ['timezone',   tz],
        ['local time', '', 'clk'],
        ['cpu cores',  nav.hardwareConcurrency || 'hidden'],
        ['memory',     nav.deviceMemory ? nav.deviceMemory + ' GB' : 'hidden'],
        ['gpu',        gpu],
        ['network',    conn.effectiveType ? conn.effectiveType + (conn.downlink ? ', ' + conn.downlink + ' Mbps' : '') : 'hidden'],
        ['battery',    'hidden', 'bat'],
        ['touch',      ('ontouchstart' in window || nav.maxTouchPoints > 0) ? 'yes' : 'no'],
        ['theme',      matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'],
        ['came from',  (document.referrer || 'direct').slice(0, 60)],
        ['time here',  '0 s', 'tm'],
        ['scrolled',   '0 px', 'sy'],
      ];

      panel.innerHTML =
        '<div class="pr f" style="color:var(--a)">&gt; SUBJECT FOUND. NO CONSENT REQUIRED.</div>' +
        rows.map(([key, value, id]) => `
          <div class="pr h">
            <span class="k">${key}</span>
            <b id="p-${id || key.replace(/\W/g, '')}">${escapeHtml(value)}</b>
          </div>`).join('') +
        '<div class="pr f h" style="color:#a52a34">&gt; it already knew.<span class="cur"></span></div>';

      const startTime = Date.now();
      const updateClock = () => setValue('clk', new Date().toLocaleTimeString());
      updateClock();
      setInterval(updateClock, 1000);
      setInterval(() => setValue('tm', (((Date.now() - startTime) / 1000) | 0) + ' s'), 1000);
      addEventListener('scroll', () => setValue('sy', (scrollY | 0) + ' px'), { passive: true });

      if (nav.getBattery) {
        nav.getBattery()
          .then((b) => setValue('bat', Math.round(b.level * 100) + '%' + (b.charging ? ' (charging)' : ' (draining)')))
          .catch(() => {});
      }

      const fetchJson = (url) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 6000);
        return fetch(url, { signal: controller.signal }).then((r) => r.json());
      };

      (async () => {
        try {
          const j = await fetchJson('https://ipwho.is/');
          if (j.success === false) throw 0;
          setValue('ip', j.ip);
          setValue('loc', [j.city, j.region, j.country].filter(Boolean).join(', ') || 'unknown');
          setValue('isp', (j.connection && (j.connection.isp || j.connection.org)) || 'unknown');
        } catch (e) {
          try {
            const j = await fetchJson('https://api.ipify.org?format=json');
            setValue('ip', j.ip);
            setValue('loc', 'unknown');
            setValue('isp', 'unknown');
          } catch (e2) {
            setValue('ip', 'blocked');
            setValue('loc', 'blocked');
            setValue('isp', 'blocked');
          }
        }
      })();

      const revealRows = () => {
        const hidden = $$('.h', panel);
        let i = 0;
        (function next() {
          if (i < hidden.length) {
            hidden[i++].classList.remove('h');
            Sound.tick();
            setTimeout(next, REDUCED_MOTION ? 0 : 110);
          }
        })();
      };

      new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          revealRows();
        }
      }, { threshold: .2 }).observe(panel);
    }
  }


  if (!REDUCED_MOTION) {
    const dimmer = $('#dim');


    (function flicker() {
      setTimeout(() => {
        if (booting()) { flicker(); return; }
        const levels = [.55, 0, .8, .1, .5, 0].slice(0, 3 + ((Math.random() * 4) | 0));
        let i = 0;

        (function step() {
          dimmer.style.opacity = levels[i++];
          Sound.zap();
          if (i < levels.length) setTimeout(step, 40 + Math.random() * 90);
          else dimmer.style.opacity = 0;
        })();

        flicker();
      }, 3500 + Math.random() * 8000);
    })();

    (function tearLoop() {
      setTimeout(() => {
        if (booting()) { tearLoop(); return; }
        document.body.classList.add('tear');
        Sound.glitch();
        setTimeout(() => document.body.classList.remove('tear'), 360);
        tearLoop();
      }, 5000 + Math.random() * 9000);
    })();
  }

  {
    let lastScrollY = scrollY;
    let cooldown = false;

    addEventListener('scroll', () => {
      if (REDUCED_MOTION) return;

      const delta = Math.abs(scrollY - lastScrollY);
      lastScrollY = scrollY;

      if (delta > 400 && !cooldown) {
        cooldown = true;
        document.body.classList.add('tear');
        Sound.glitch();
        setTimeout(() => {
          document.body.classList.remove('tear');
          cooldown = false;
        }, 500);
      }
    }, { passive: true });
  }

})();