/* 鷹眼中的榮耀 — 中文朗讀 (Web Speech API, no server needed) */
(function () {
  var bar = document.getElementById('tts');
  if (!bar) return;
  // Same player for 繁體 (zh-Hant) and 简体 (zh-Hans) pages.
  var SIMP = /hans|cn/i.test(document.documentElement.lang || '');
  var T = SIMP ? {
    nosupport: '这个浏览器不支持朗读。请改用 Chrome、Edge 或 Safari。',
    play: '▶ 朗读本章', resume: '▶ 继续', pause: '⏸ 暂停', done: '本章朗读完毕。',
    paused: '已暂停', hint: '点任一段文字，可从那里开始朗读。', para: ['第 ', ' / ', ' 段'], dflt: '系统默认中文'
  } : {
    nosupport: '這個瀏覽器不支援朗讀。請改用 Chrome、Edge 或 Safari。',
    play: '▶ 朗讀本章', resume: '▶ 繼續', pause: '⏸ 暫停', done: '本章朗讀完畢。',
    paused: '已暫停', hint: '點任一段文字，可從那裡開始朗讀。', para: ['第 ', ' / ', ' 段'], dflt: '系統預設中文'
  };
  var VKEY = SIMP ? 'eagle-zhs-voice' : 'eagle-zh-voice';
  var synth = window.speechSynthesis;
  var msg = bar.querySelector('.tts-msg');
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
    bar.classList.add('tts-off');
    msg.textContent = T.nosupport;
    return;
  }

  var btnPlay = bar.querySelector('[data-tts="play"]');
  var btnStop = bar.querySelector('[data-tts="stop"]');
  var selRate = bar.querySelector('[data-tts="rate"]');
  var selVoice = bar.querySelector('[data-tts="voice"]');
  var paras = Array.prototype.slice.call(document.querySelectorAll('.chapter-text .read'));

  // Break paragraphs into short sentence chunks: long utterances get cut off in Chrome.
  var queue = [];
  paras.forEach(function (el, pi) {
    var text = el.textContent.replace(/\s+/g, '');
    var parts = text.match(/[^。！？；]+[。！？；」』]*|[。！？；」』]+/g) || [text];
    var buf = '';
    parts.forEach(function (p) {
      if ((buf + p).length > 90 && buf) { queue.push({ el: el, pi: pi, text: buf }); buf = ''; }
      buf += p;
    });
    if (buf) queue.push({ el: el, pi: pi, text: buf });
  });

  var idx = 0, playing = false, token = 0, voices = [];
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function rank(v) {
    var l = (v.lang || '').toLowerCase().replace('_', '-');
    var tw = l === 'zh-tw' || /taiwan|臺灣|台灣/i.test(v.name);
    var cn = l === 'zh-cn' || l === 'cmn-cn' || /mainland|普通话|china/i.test(v.name);
    if (SIMP ? cn : tw) return 0;
    if (SIMP ? tw : cn) return 1;
    if (l.indexOf('zh') === 0 || l.indexOf('cmn') === 0) return 2;
    return 9;
  }
  function loadVoices() {
    voices = synth.getVoices().filter(function (v) { return rank(v) < 9; })
      .sort(function (a, b) { return rank(a) - rank(b); });
    selVoice.innerHTML = '';
    if (!voices.length) {
      var o = document.createElement('option'); o.textContent = T.dflt;
      selVoice.appendChild(o); return;
    }
    var saved = load(VKEY);
    voices.forEach(function (v, i) {
      var o = document.createElement('option');
      o.value = i; o.textContent = v.name + ' (' + v.lang + ')';
      if (v.name === saved) o.selected = true;
      selVoice.appendChild(o);
    });
  }
  loadVoices();
  if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;

  var savedRate = load('eagle-zh-rate');
  if (savedRate) selRate.value = savedRate;

  function mark(el) {
    paras.forEach(function (p) { p.classList.remove('reading'); });
    if (el) {
      el.classList.add('reading');
      var r = el.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight - 120) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  function setUI() {
    btnPlay.textContent = playing ? T.pause : (idx > 0 ? T.resume : T.play);
    btnPlay.setAttribute('aria-pressed', playing ? 'true' : 'false');
    bar.classList.toggle('is-playing', playing);
  }
  function speakNext() {
    if (!playing) return;
    if (idx >= queue.length) {
      playing = false; idx = 0; mark(null); setUI();
      msg.textContent = T.done;
      return;
    }
    var item = queue[idx];
    var u = new SpeechSynthesisUtterance(item.text);
    var v = voices[selVoice.value];
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = SIMP ? 'zh-CN' : 'zh-TW'; }
    u.rate = parseFloat(selRate.value) || 1;
    var my = ++token;
    u.onend = function () { if (my !== token || !playing) return; idx++; speakNext(); };
    u.onerror = function (e) {
      if (my !== token || !playing) return;
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      idx++; speakNext();
    };
    mark(item.el);
    msg.textContent = T.para[0] + (item.pi + 1) + T.para[1] + paras.length + T.para[2];
    synth.speak(u);
  }
  function play() { synth.cancel(); playing = true; setUI(); speakNext(); }
  // Pause = cancel and remember position (synth.pause() is unreliable on Android/Chrome).
  function pause() { playing = false; token++; synth.cancel(); setUI(); msg.textContent = T.paused; }
  function stop() { playing = false; token++; synth.cancel(); idx = 0; mark(null); setUI(); msg.textContent = T.hint; }

  btnPlay.addEventListener('click', function () { playing ? pause() : play(); });
  btnStop.addEventListener('click', stop);
  selRate.addEventListener('change', function () { store('eagle-zh-rate', selRate.value); if (playing) play(); });
  selVoice.addEventListener('change', function () {
    var v = voices[selVoice.value]; if (v) store(VKEY, v.name);
    if (playing) play();
  });
  paras.forEach(function (el) {
    el.addEventListener('click', function () {
      if (window.getSelection && String(window.getSelection()).length) return;
      for (var i = 0; i < queue.length; i++) { if (queue[i].el === el) { idx = i; break; } }
      play();
    });
  });
  window.addEventListener('pagehide', function () { token++; synth.cancel(); });
  setUI();
})();
