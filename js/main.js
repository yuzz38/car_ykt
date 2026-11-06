/* MY CAR — 5D-коврики Якутск. © 2026 Полунин Лев */
(function () {
  'use strict';
  var WA_PHONE = '79142619326';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* header + burger */
  var hdr = $('.hdr'), burger = $('#burger'), nav = $('#nav');
  function onScroll() { hdr.classList.toggle('is-solid', window.pageYOffset > 20); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('is-lock', open);
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });

  /* reveal */
  var rvEls = $$('.h2, .ticket, .perk, .dir, .compare, .steps li, .work, .rcard, .faq__list details, .form, .where__card, .mat');
  if ('IntersectionObserver' in window) {
    rvEls.forEach(function (el) { el.classList.add('rv'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rvEls.forEach(function (el) { io.observe(el); });
  }

  /* before / after */
  var cmp = $('#compare');
  if (cmp) {
    var range = $('.compare__range', cmp);
    var setPos = function () { cmp.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', setPos); range.addEventListener('change', setPos);
  }

  /* video modal */
  var modal = $('#modal'), mv = $('#modalVideo'), lastFocus = null;
  function openVideo(src, poster, sound) {
    lastFocus = document.activeElement;
    mv.poster = poster || '';
    mv.src = src;
    mv.muted = !sound;
    modal.hidden = false;
    document.body.classList.add('is-lock');
    var p = mv.play(); if (p && p.catch) p.catch(function () {});
    $('.modal__x', modal).focus();
  }
  function closeVideo() {
    mv.pause(); mv.removeAttribute('src'); mv.load();
    modal.hidden = true;
    if (!nav.classList.contains('is-open')) document.body.classList.remove('is-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('.js-video').forEach(function (b) {
    b.addEventListener('click', function () { openVideo(b.dataset.src, b.dataset.poster, b.dataset.sound === '1'); });
  });
  $$('[data-close]', modal).forEach(function (el) { el.addEventListener('click', closeVideo); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!modal.hidden) closeVideo(); else if (nav.classList.contains('is-open')) setMenu(false); }
  });

  /* pause hero video when offscreen (battery on phones) */
  var hv = $('.phone__v');
  if (hv && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { var p = hv.play(); if (p && p.catch) p.catch(function () {}); } else hv.pause(); });
    }).observe(hv);
  }

  /* configurator */
  var cfg = { leather: '#1b1b1d', leatherN: 'Чёрная', stitch: '#d4143a', stitchN: 'красная', shape: '34', shapeN: 'ромб' };
  var rhomb = $('#rhomb'), rhombBg = $('#rhombBg'), rhombLine = $('#rhombLine'), wall = $('#matWall'), edge = $('#matEdge'), note = $('#buildNote');
  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(v * k))); };
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  }
  function cfgText() { return cfg.leatherN + ' экокожа · ' + cfg.stitchN + ' нить · ' + cfg.shapeN; }
  function render() {
    rhombBg.setAttribute('fill', cfg.leather);
    wall.setAttribute('fill', shade(cfg.leather, .7));
    edge.setAttribute('stroke', cfg.stitch);
    rhombLine.setAttribute('stroke', cfg.stitch);
    var s = parseInt(cfg.shape, 10);
    if (s > 0) {
      rhomb.setAttribute('width', s); rhomb.setAttribute('height', s);
      rhombBg.setAttribute('width', s); rhombBg.setAttribute('height', s);
      rhombLine.setAttribute('d', 'M0 0H' + s + 'M0 0V' + s);
      rhombLine.style.display = '';
      $('rect:nth-child(2)', rhomb).style.display = '';
    } else {
      rhombLine.style.display = 'none';
      $('rect:nth-child(2)', rhomb).style.display = 'none';
    }
    note.textContent = cfgText();
  }
  $$('[data-group]').forEach(function (g) {
    var key = g.dataset.group;
    $$('button', g).forEach(function (b) {
      b.setAttribute('aria-pressed', b.classList.contains('is-on') ? 'true' : 'false');
      b.addEventListener('click', function () {
        $$('button', g).forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true');
        cfg[key] = b.dataset.v; cfg[key + 'N'] = b.dataset.n;
        render();
      });
    });
  });
  if (rhomb) render();
  var cfgField = $('#cfgField'), cfgShow = $('#cfgShow');
  $$('.js-take').forEach(function (b) {
    b.addEventListener('click', function () {
      cfgField.value = cfgText();
      cfgShow.textContent = 'Ваш вариант: ' + cfgText();
      cfgShow.hidden = false;
      setTimeout(function () { var i = $('#orderForm input[name=car]'); if (i) i.focus({ preventScroll: true }); }, 600);
    });
  });

  /* reviews slider */
  var sl = $('#revSlider'), dotsWrap = $('#revDots');
  if (sl) {
    var cards = $$('.rcard', sl);
    cards.forEach(function (_, i) { var d = document.createElement('span'); if (!i) d.className = 'is-on'; dotsWrap.appendChild(d); });
    var dots = $$('span', dotsWrap);
    var step = function () { return cards[0].getBoundingClientRect().width + 20; };
    var cur = function () { return Math.round(sl.scrollLeft / step()); };
    var go = function (i) {
      var max = sl.scrollWidth - sl.clientWidth;
      var x = Math.max(0, Math.min(i * step(), max));
      if ('scrollBehavior' in document.documentElement.style) sl.scrollTo({ left: x, behavior: 'smooth' }); else sl.scrollLeft = x;
    };
    var atEnd = function () { return sl.scrollLeft + sl.clientWidth >= sl.scrollWidth - 4; };
    $('#revNext').addEventListener('click', function () { atEnd() ? go(0) : go(cur() + 1); });
    $('#revPrev').addEventListener('click', function () { go(cur() - 1); });
    var t;
    sl.addEventListener('scroll', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var i = atEnd() ? cards.length - 1 : cur();
        dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
      }, 60);
    }, { passive: true });
    sl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur() - 1); }
    });
    var auto = setInterval(function () { atEnd() ? go(0) : go(cur() + 1); }, 6000);
    ['pointerdown', 'touchstart', 'focusin', 'mouseenter'].forEach(function (ev) {
      sl.addEventListener(ev, function () { clearInterval(auto); }, { passive: true });
    });
  }

  /* lazy map */
  var map = $('#map');
  if (map) {
    var loadMap = function () {
      if (map.dataset.done) return; map.dataset.done = '1';
      var f = document.createElement('iframe');
      f.src = map.dataset.src; f.title = 'MY CAR на карте: Якутск, ул. Дежнёва, 30'; f.loading = 'lazy';
      f.setAttribute('allowfullscreen', '');
      map.appendChild(f);
    };
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { loadMap(); mo.disconnect(); } }, { rootMargin: '400px' });
      mo.observe(map);
    } else loadMap();
  }

  /* form -> WhatsApp */
  var form = $('#orderForm'), err = $('#formErr');
  if (form) {
    var car = form.elements.car;
    car.addEventListener('input', function () { car.classList.remove('is-bad'); err.hidden = true; });
    form.elements.year.addEventListener('input', function (e) { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = car.value.trim();
      if (!c) { car.classList.add('is-bad'); err.hidden = false; car.focus(); return; }
      var y = form.elements.year.value.trim(), n = form.elements.name.value.trim();
      var what = $$('input[name=what]:checked', form).map(function (i) { return i.value; });
      var lines = ['Здравствуйте! Хочу рассчитать стоимость.', 'Авто: ' + c + (y ? ', ' + y + ' г.' : '')];
      if (what.length) lines.push('Нужно: ' + what.join(', '));
      if (cfgField.value) lines.push('Вариант: ' + cfgField.value);
      if (n) lines.push('Меня зовут ' + n);
      lines.push('(заявка с сайта)');
      var url = 'https://api.whatsapp.com/send/?phone=' + WA_PHONE + '&text=' + encodeURIComponent(lines.join('\n')) + '&type=phone_number&app_absent=0';
      var w = window.open(url, '_blank');
      if (!w) window.location.href = url;
    });
  }
})();
