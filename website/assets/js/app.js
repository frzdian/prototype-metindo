/* ==========================================================================
   METINDO — app shell + page renderers (vanilla JS, no build step)
   Each page sets <body data-page="..."> and the matching renderer runs.
   ========================================================================== */
(function () {
  'use strict';

  const D = window.METINDO;
  const DICT = window.I18N;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const params = new URLSearchParams(location.search);
  const page = document.body.dataset.page;

  /* ---------- storage (safe) ---------- */
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------- i18n ---------- */
  let lang = store.get('metindo-lang', null) || ((navigator.language || '').toLowerCase().startsWith('id') ? 'id' : 'en');
  const t = (k) => (DICT[lang] && DICT[lang][k]) || DICT.en[k] || k;
  const L = (o) => (o == null ? '' : typeof o === 'string' ? o : (o[lang] || o.en));
  function applyI18n(root = document) {
    $$('[data-i18n]', root).forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]', root).forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.documentElement.lang = lang;
  }
  function setLang(l) { lang = l; store.set('metindo-lang', l); boot(); }

  /* ---------- helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rupiah = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  const catById = (id) => D.categories.find(c => c.id === id);
  const productById = (id) => D.products.find(p => p.id === id);
  const catIndex = (id) => D.categories.findIndex(c => c.id === id) + 1;
  const pad = (n) => String(n).padStart(2, '0');
  function findSub(cat, sid) {
    for (const s of cat.subs) {
      if (s.id === sid) return { sub: s, parent: null };
      for (const c of (s.children || [])) if (c.id === sid) return { sub: c, parent: s };
    }
    return null;
  }
  function subIds(sub) { return [sub.id].concat((sub.children || []).map(c => c.id)); }
  function subName(p) {
    const c = catById(p.cat); if (!c || !p.sub) return '';
    const f = findSub(c, p.sub); return f ? L(f.sub.name) : '';
  }
  const minPrice = (p) => (p.packs.length ? Math.min.apply(null, p.packs.map(x => x.price)) : Infinity);

  /* ---------- icons ---------- */
  const I = {
    arrowUR: '<path d="M7 17 17 7M8 7h9v9"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    cart: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    badgeCheck: '<path d="M12 3l2.4 1.8 3-.2.9 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.9 2.9-3-.2L12 21l-2.4-1.8-3 .2-.9-2.9-2.4-1.8 1-2.8-1-2.8 2.4-1.8.9-2.9 3 .2z"/><path d="m9 12 2 2 4-4"/>',
    play: '<path d="M7 4v16l13-8z" fill="currentColor" stroke="none"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>',
    send: '<path d="m4 12 16-8-6 16-2.5-6.5z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
    whatsapp: '<path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-3.7A8.5 8.5 0 1 1 20 11.5z"/><path d="M9 8.5c0 3.5 2.5 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1-.4-2.4-1.8-2.8-2.8l.9-1-1-2z"/>',
    store: '<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5V20h16V9.5M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M10 20v-5h4v5"/>',
    // category icons
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
    beaker: '<path d="M5 3h14M6 3v15a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3"/><path d="M6 12h12M10 7h4"/>',
    atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9" ry="3.8"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)"/>',
    shield: '<path d="M12 3 4.5 6v6c0 4.5 3.2 8 7.5 9 4.3-1 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    sparkle: '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/><path d="M19 16c.2 1.6.8 2.2 2.4 2.4-1.6.2-2.2.8-2.4 2.4-.2-1.6-.8-2.2-2.4-2.4 1.6-.2 2.2-.8 2.4-2.4z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3"/>',
    droplet: '<path d="M12 3s-6.5 7.2-6.5 11.5a6.5 6.5 0 0 0 13 0C18.5 10.2 12 3 12 3z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
    tube: '<path d="M14.5 3 21 9.5M15.5 4 6 13.5a3.5 3.5 0 0 0 5 5L20.5 9"/><path d="M8 11.5h7"/>',
    hexagon: '<path d="m12 2.8 8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><path d="m12 7.5 4 2.3v4.4l-4 2.3-4-2.3V9.8z"/>',
    bolt: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
    bubbles: '<circle cx="9" cy="14" r="5.5"/><circle cx="17" cy="7" r="3.5"/><circle cx="18" cy="16.5" r="2"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L21 10a5.5 5.5 0 0 1-7.4-7.4L12 4.1"/><path d="m14 10-9.3 9.3a1.8 1.8 0 0 1-2.5-2.5L11.5 7.5"/>'
  };
  const icon = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;

  /* ---------- packaging illustration ---------- */
  let gid = 0;
  function packSVG(p) {
    const id = 'g' + (++gid);
    const c = p.color || '#c8281e';
    // wrap product name onto max 2 label lines
    const lines = [];
    (p.name || '').split(' ').forEach(w => {
      const last = lines[lines.length - 1];
      if (last && (last + ' ' + w).length <= 13) lines[lines.length - 1] = last + ' ' + w; else lines.push(w);
    });
    if (lines.length > 2) { lines.length = 2; lines[1] += '…'; }
    const longest = Math.max.apply(null, lines.map(l => l.length).concat(6));
    const defs = `<defs>
      <linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="#e9eaec"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#c9ccd0"/></linearGradient>
      <linearGradient id="${id}d" x1="0" x2="1"><stop offset="0" stop-color="#2a2b2f"/><stop offset=".5" stop-color="#4a4c52"/><stop offset="1" stop-color="#1c1d20"/></linearGradient>
      <linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="rgba(0,0,0,.18)"/><stop offset=".3" stop-color="rgba(255,255,255,0)"/><stop offset=".8" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,.22)"/></linearGradient></defs>`;
    const lbl = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h * .26}" rx="6" fill="${c}"/><rect x="${x}" y="${y + h * .18}" width="${w}" height="${h * .08}" fill="${c}"/>
      <text x="${x + w / 2}" y="${y + h * .19}" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="${h * .13}" fill="#fff" letter-spacing="1.5">${esc((p.brand || 'METINDO').toUpperCase())}</text>
      ${lines.map((ln, i) => `<text x="${x + w / 2}" y="${y + h * (lines.length > 1 ? .47 + i * .14 : .55)}" text-anchor="middle" font-family="Manrope, Arial" font-weight="800" font-size="${Math.min(h * .12, w * 1.55 / longest)}" fill="#111214">${esc(ln)}</text>`).join('')}
      <rect x="${x + w * .2}" y="${y + h * .7}" width="${w * .6}" height="${h * .05}" rx="2" fill="#d0d2d5"/><rect x="${x + w * .3}" y="${y + h * .8}" width="${w * .4}" height="${h * .05}" rx="2" fill="#d0d2d5"/>`;
    let body = '';
    switch (p.shape) {
      case 'bottle':
        body = `<rect x="82" y="18" width="36" height="22" rx="4" fill="url(#${id}d)"/><path d="M76 40h48l10 22v118a10 10 0 0 1-10 10H76a10 10 0 0 1-10-10V62z" fill="url(#${id}b)"/><path d="M76 40h48l10 22v118a10 10 0 0 1-10 10H76a10 10 0 0 1-10-10V62z" fill="url(#${id}s)"/>${lbl(72, 82, 56, 82)}`;
        break;
      case 'sack':
        body = `<path d="M44 34c20-8 92-8 112 0l-4 24 6 112c-26 12-90 12-116 0l6-112z" fill="#f4f1ea"/><path d="M44 34c20-8 92-8 112 0l-4 24 6 112c-26 12-90 12-116 0l6-112z" fill="url(#${id}s)"/><path d="M48 52c24 6 80 6 104 0" stroke="#d9d4c8" stroke-width="2" fill="none"/>${lbl(62, 74, 76, 78)}`;
        break;
      case 'box':
        body = `<path d="M40 64 100 40l60 24v96l-60 24-60-24z" fill="#e6e1d6"/><path d="M100 88v96l60-24V64z" fill="#cdc6b6"/><path d="M40 64l60 24 60-24" stroke="#bfb7a5" stroke-width="2" fill="none"/><path d="M46 92l48 19v40l-48-19z" fill="${c}"/><text x="70" y="128" transform="rotate(21 70 128)" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="10" fill="#fff" letter-spacing="1">METINDO</text>`;
        break;
      case 'machine':
        body = `<rect x="34" y="60" width="132" height="104" rx="12" fill="url(#${id}b)"/><rect x="34" y="60" width="132" height="104" rx="12" fill="url(#${id}s)"/><rect x="34" y="60" width="132" height="22" rx="10" fill="${c}"/><text x="100" y="76" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="11" fill="#fff" letter-spacing="1.5">METINDO</text><circle cx="68" cy="118" r="20" fill="#26272b"/><circle cx="68" cy="118" r="12" fill="#5a5d63"/><rect x="104" y="100" width="46" height="10" rx="3" fill="#cfd2d6"/><rect x="104" y="118" width="46" height="10" rx="3" fill="#cfd2d6"/><rect x="104" y="136" width="28" height="10" rx="3" fill="${c}" opacity=".8"/><rect x="48" y="164" width="16" height="14" fill="#2a2b2f"/><rect x="136" y="164" width="16" height="14" fill="#2a2b2f"/>`;
        break;
      default: // jerry can
        body = `<rect x="118" y="20" width="28" height="18" rx="4" fill="url(#${id}d)"/><path d="M58 38h70l14 14v124a12 12 0 0 1-12 12H58a12 12 0 0 1-12-12V50a12 12 0 0 1 12-12z" fill="url(#${id}b)"/><path d="M58 38h70l14 14v124a12 12 0 0 1-12 12H58a12 12 0 0 1-12-12V50a12 12 0 0 1 12-12z" fill="url(#${id}s)"/><path d="M62 38V26a8 8 0 0 1 8-8h30a8 8 0 0 1 8 8v12h-10V28H72v10z" fill="#d5d8dc"/>${lbl(58, 74, 72, 92)}`;
    }
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.name)}">${defs}${body}</svg>`;
  }
  const packHTML = (p, extra = '') => `<div class="pack">${extra}${packSVG(p)}</div>`;

  /* ---------- cart ---------- */
  const cart = {
    items() { return store.get('metindo-cart', []); },
    save(items) { store.set('metindo-cart', items); updateCartBadge(); },
    count() { return this.items().reduce((a, b) => a + b.qty, 0); },
    add(id, size, qty) {
      const items = this.items();
      const f = items.find(i => i.id === id && i.size === size);
      if (f) f.qty += qty; else items.push({ id, size, qty });
      this.save(items);
    },
    setQty(idx, qty) { const items = this.items(); if (items[idx]) { items[idx].qty = Math.max(1, Math.min(999, qty)); this.save(items); } },
    remove(idx) { const items = this.items(); items.splice(idx, 1); this.save(items); },
    clear() { this.save([]); },
    lines() {
      return this.items().map(i => {
        const p = productById(i.id); if (!p) return null;
        const pk = p.packs.find(x => x.size === i.size) || p.packs[0];
        return { ...i, p, price: pk.price, total: pk.price * i.qty };
      }).filter(Boolean);
    },
    subtotal() { return this.lines().reduce((a, b) => a + b.total, 0); }
  };
  function updateCartBadge() {
    const n = cart.count();
    $$('.cart-count').forEach(b => {
      b.textContent = n || ''; b.dataset.count = n; b.setAttribute('aria-hidden', 'true');
      const link = b.closest('a'); if (link) link.setAttribute('aria-label', `${t('nav.cart')}${n ? ` (${n} ${t('cart.items')})` : ''}`);
    });
  }

  /* ---------- toast + modal ---------- */
  let toastTimer;
  function toast(html) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.innerHTML = icon('checkCircle') + '<span>' + html + '</span>';
    el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  }
  function openModal(html) {
    closeModal();
    const m = document.createElement('div');
    m.className = 'modal'; m.id = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="modal-box">${html}</div>`;
    document.body.appendChild(m);
    requestAnimationFrame(() => m.classList.add('open'));
    document.body.classList.add('no-scroll');
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) closeModal(); });
    const first = $('input, select, textarea, button', m); if (first) setTimeout(() => first.focus(), 50);
    return m;
  }
  function closeModal() { const m = $('#modal'); if (m) m.remove(); document.body.classList.toggle('no-scroll', !!$('#sheet')); }
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if ($('#modal')) { closeModal(); return; }
    closeSheet(); closeChat(); closeDrawer(); closeMega();
  });

  /* ---------- form validation ---------- */
  function fieldError(inp) {
    const v = inp.value.trim();
    if (!v) return t('f.required');
    if (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) return t('f.emailInvalid');
    if (inp.type === 'tel' && v.replace(/\D/g, '').length < 8) return t('f.phoneInvalid');
    return '';
  }
  function showFieldError(inp, msg) {
    const field = inp.closest('.field'); if (!field) return;
    let err = $('.err', field);
    if (err) {
      if (!err.id) err.id = (inp.id || inp.name) + '-err';
      err.setAttribute('role', 'alert');
      if (msg) err.textContent = msg;
      inp.setAttribute('aria-describedby', err.id);
    }
    field.classList.toggle('invalid', !!msg);
    inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  // inline errors under each field; focus moves to the first invalid one
  function validate(form) {
    let first = null;
    $$('[required]', form).forEach(inp => {
      const msg = fieldError(inp);
      showFieldError(inp, msg);
      if (msg && !first) first = inp;
    });
    if (first) first.focus();
    return !first;
  }
  // re-check a field when the user leaves it, once it has been marked invalid
  document.addEventListener('focusout', e => {
    const inp = e.target;
    if (inp.matches && inp.matches('[required]') && inp.getAttribute('aria-invalid') === 'true') showFieldError(inp, fieldError(inp));
  });
  // submit feedback: disable the button and show progress before the result
  function busy(form) {
    const btn = $('button[type=submit]', form);
    if (btn) { btn.disabled = true; btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true'); }
    return new Promise(r => setTimeout(r, 650));
  }
  const field = (name, label, opts = {}) => {
    const req = opts.required !== false;
    const type = opts.type || 'text';
    const ctl = type === 'textarea'
      ? `<textarea class="textarea" id="f-${name}" name="${name}" ${req ? 'required' : ''} placeholder="${esc(opts.ph || '')}"></textarea>`
      : type === 'select'
        ? `<select class="select" id="f-${name}" name="${name}" ${req ? 'required' : ''}>${opts.options}</select>`
        : `<input class="input" id="f-${name}" name="${name}" type="${type}" ${req ? 'required' : ''} autocomplete="${opts.ac || 'on'}" value="${esc(opts.value || '')}" placeholder="${esc(opts.ph || '')}">`;
    return `<div class="field"><label for="f-${name}">${esc(label)}${req ? ' <span class="req">*</span>' : ''}</label>${ctl}<div class="err">${t('f.required')}</div></div>`;
  };

  /* ---------- layout: header / footer / chat ---------- */
  const NAV_ACTIVE = { services: 'services', news: 'news', post: 'news', process: 'process', category: 'process', sub: 'process', product: 'process', store: 'store', 'store-item': 'store', cart: 'store', checkout: 'store', order: 'store', account: 'store', consultation: 'consult' };

  function renderHeader() {
    const host = $('#layout-header'); if (!host) return;
    const active = NAV_ACTIVE[page] || '';
    const mega = D.categories.map((c, i) => `<a href="category.html?c=${c.id}"><span class="num">${pad(i + 1)}</span>${esc(L(c.name))}</a>`).join('');
    host.innerHTML = `
      <div class="announce"><b>${t('announce.label')}</b><span class="a-text">${t('announce.text')}</span><a href="consultation.html">${t('announce.link')}</a></div>
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="PT Metindo Perkasa — ${t('common.home')}"><img src="assets/img/logo.jpg" alt="PT Metindo Perkasa — Doctors Up All Metals" width="554" height="97"></a>
          <nav class="nav" aria-label="Main">
            <a href="index.html#about" class="${page === 'home' ? 'active' : ''}">${t('nav.company')}</a>
            <div class="nav-drop" id="nav-drop">
              <button type="button" class="${active === 'process' ? 'active' : ''}" aria-expanded="false" aria-haspopup="true">${t('nav.process')} ${icon('chevron')}</button>
              <div class="mega" role="menu"><div class="mega-grid">${mega}</div>
                <div class="mega-foot"><span class="muted" style="font-size:.85rem">${t('nav.allCategories')}</span><a class="link-arrow" href="process.html" style="padding:0">${t('nav.process')} ${icon('arrowR')}</a></div>
              </div>
            </div>
            <a href="services.html" class="${active === 'services' ? 'active' : ''}">${t('nav.services')}</a>
            <a href="store.html" class="${active === 'store' ? 'active' : ''}">${t('nav.store')}</a>
            <a href="news.html" class="${active === 'news' ? 'active' : ''}">${t('nav.news')}</a>
            <a href="consultation.html" class="${active === 'consult' ? 'active' : ''}">${t('nav.consult')}</a>
          </nav>
          <div class="header-actions">
            <div class="lang" role="group" aria-label="Language">
              <button type="button" data-lang="en" class="${lang === 'en' ? 'on' : ''}">EN</button><button type="button" data-lang="id" class="${lang === 'id' ? 'on' : ''}">ID</button>
            </div>
            <a class="icon-btn acc-btn" href="account.html" aria-label="${t('nav.account')}">${icon('user')}</a>
            <a class="icon-btn" href="cart.html" aria-label="${t('nav.cart')}">${icon('cart')}<span class="badge cart-count"></span></a>
            <a class="btn btn-dark header-cta" href="consultation.html">${t('nav.cta')}</a>
            <button class="icon-btn menu-toggle" type="button" aria-label="Menu" id="menu-open">${icon('menu')}</button>
          </div>
        </div>
      </header>
      <div class="drawer" id="drawer" aria-hidden="true"><div class="drawer-panel">
        <div class="drawer-head"><img src="assets/img/logo.jpg" alt="METINDO" style="height:28px;width:auto"><button class="icon-btn" type="button" id="menu-close" aria-label="${t('common.close')}">${icon('close')}</button></div>
        <a class="d-link" href="index.html#about">${t('nav.company')}</a>
        <details><summary>${t('nav.process')} ${icon('chevron').replace('<svg', '<svg style="width:18px"')}</summary>
          <a href="process.html"><b>${t('nav.allCategories')}</b></a>${D.categories.map((c, i) => `<a href="category.html?c=${c.id}">${pad(i + 1)} · ${esc(L(c.name))}</a>`).join('')}</details>
        <a class="d-link" href="services.html">${t('nav.services')}</a>
        <a class="d-link" href="store.html">${t('nav.store')}</a>
        <a class="d-link" href="news.html">${t('nav.news')}</a>
        <a class="d-link" href="consultation.html">${t('nav.consult')}</a>
        <a class="d-link" href="account.html">${t('nav.account')}</a>
        <div class="lang" role="group" aria-label="Language" style="margin-top:18px">
          <button type="button" data-lang="en" class="${lang === 'en' ? 'on' : ''}">English</button><button type="button" data-lang="id" class="${lang === 'id' ? 'on' : ''}">Bahasa Indonesia</button>
        </div>
        <a class="btn btn-red btn-block" href="consultation.html">${t('nav.cta')}</a>
      </div></div>`;

    $$('[data-lang]', host).forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    const drop = $('#nav-drop');
    const btn = $('button', drop);
    btn.addEventListener('click', e => { e.stopPropagation(); const o = drop.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
    drop.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) { drop.classList.add('open'); btn.setAttribute('aria-expanded', true); } });
    drop.addEventListener('mouseleave', () => { if (matchMedia('(hover:hover)').matches) closeMega(); });
    $('#menu-open').setAttribute('aria-expanded', 'false');
    $('#menu-open').setAttribute('aria-controls', 'drawer');
    $('#menu-open').addEventListener('click', () => {
      const d = $('#drawer'); d.classList.add('open'); d.setAttribute('aria-hidden', 'false');
      $('#menu-open').setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      d.addEventListener('transitionend', () => $('#menu-close').focus({ preventScroll: true }), { once: true });
      requestAnimationFrame(() => $('#menu-close').focus({ preventScroll: true }));
    });
    $('#menu-close').addEventListener('click', closeDrawer);
    $('#drawer').addEventListener('click', e => { if (e.target.id === 'drawer') closeDrawer(); });
    updateCartBadge();
  }
  function closeMega() { const d = $('#nav-drop'); if (d) { d.classList.remove('open'); $('button', d).setAttribute('aria-expanded', false); } }
  function closeDrawer() {
    const d = $('#drawer'); if (!d || !d.classList.contains('open')) return;
    d.classList.remove('open'); d.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    const b = $('#menu-open'); if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
  }
  document.addEventListener('click', e => { if (!e.target.closest('#nav-drop')) closeMega(); });

  function renderFooter() {
    const host = $('#layout-footer'); if (!host) return;
    const C = D.company;
    host.innerHTML = `<footer class="site-footer">
      <div class="container">
        <div class="footer-main">
          <div><a class="footer-logo" href="index.html"><img src="assets/img/logo.jpg" alt="PT Metindo Perkasa"></a><p>${t('footer.about')}</p></div>
          <div><h4>${t('footer.explore')}</h4><ul>
            <li><a href="index.html#about">${t('nav.company')}</a></li>
            <li><a href="process.html">${t('nav.process')}</a></li>
            <li><a href="services.html">${t('nav.services')}</a></li>
            <li><a href="store.html">${t('nav.store')}</a></li>
            <li><a href="news.html">${t('nav.news')}</a></li>
            <li><a href="consultation.html">${t('nav.consult')}</a></li>
            <li><a href="account.html">${t('nav.account')}</a></li></ul></div>
          <div><h4>${t('footer.contact')}</h4><ul>
            ${C.offices.slice(0, 2).map(o => `<li class="f-addr"><b>${esc(L(o.label))}</b>${esc(o.addr)}</li>`).join('')}
            <li><a href="tel:+62214213676">${esc(C.phone)}</a></li>
            <li><a href="mailto:${C.email}">${esc(C.email)}</a></li></ul></div>
          <div><h4>${t('footer.follow')}</h4>
            <div class="f-pills" style="margin-bottom:12px"><a href="${C.social.youtube}" target="_blank" rel="noopener">${icon('youtube')} YouTube</a><a href="${C.social.instagram}" target="_blank" rel="noopener">${icon('instagram')} Instagram</a></div>
            <div class="f-pills"><a href="${C.marketplace.tokopedia}" target="_blank" rel="noopener"><i style="background:#42b549"></i>Tokopedia</a><a href="${C.marketplace.shopee}" target="_blank" rel="noopener"><i style="background:#ee4d2d"></i>Shopee</a><a href="${C.marketplace.blibli}" target="_blank" rel="noopener"><i style="background:#0095da"></i>Blibli</a></div>
          </div>
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${C.name}. ${t('footer.rights')}</span><span class="tagline">${C.tagline}</span></div>
      </div></footer>`;
  }

  /* ---------- chatbot ---------- */
  function renderChat() {
    let fab = $('#chat-fab');
    if (fab) { fab.remove(); $('#chat-panel').remove(); }
    document.body.insertAdjacentHTML('beforeend', `
      <button class="chat-fab" id="chat-fab" type="button" aria-controls="chat-panel" aria-expanded="false">${icon('chat')}<span>${lang === 'id' ? 'Tanya kami' : 'Ask us'}</span></button>
      <section class="chat-panel" id="chat-panel" aria-label="${t('chat.title')}">
        <div class="chat-head"><div class="av"><img src="assets/img/logo.jpg" alt=""></div><div><b>${t('chat.title')}</b><small>${t('chat.status')}</small></div>
          <button class="icon-btn" type="button" id="chat-close" aria-label="${t('common.close')}">${icon('close')}</button></div>
        <div class="chat-body" id="chat-body" aria-live="polite"></div>
        <form class="chat-form" id="chat-form"><input id="chat-input" type="text" placeholder="${t('chat.ph')}" aria-label="${t('chat.ph')}" autocomplete="off"><button type="submit" aria-label="Send">${icon('send')}</button></form>
      </section>`);
    const body = $('#chat-body');
    const say = (html, who = 'bot') => { body.insertAdjacentHTML('beforeend', `<div class="msg ${who}">${html}</div>`); body.scrollTop = body.scrollHeight; };
    say(t('chat.hello'));
    body.insertAdjacentHTML('beforeend', `<div class="quick">${['chat.q1', 'chat.q2', 'chat.q3', 'chat.q4'].map(k => `<button type="button">${t(k)}</button>`).join('')}</div>`);
    const answer = (q) => {
      const s = q.toLowerCase();
      if (/harga|price|cost|berapa|quot/.test(s)) return t('chat.price');
      if (/tds|data sheet|msds|sds|coa|dokumen|document/.test(s)) return t('chat.tds');
      if (/kantor|office|alamat|address|lokasi|where|dimana|di mana|phone|telp/.test(s)) return t('chat.office');
      if (/alkal|flow|alur|chromat|zinc|seng/.test(s)) return t('chat.flow');
      if (/beli|buy|order|pesan|store|toko|checkout|kirim|ship/.test(s)) return t('chat.store') + ` <a href="store.html">${t('nav.store')} →</a>`;
      return t('chat.fallback') + ` <a href="consultation.html">${t('chat.toConsult')} →</a>`;
    };
    const ask = (q) => { if (!q.trim()) return; say(esc(q), 'me'); setTimeout(() => say(answer(q)), 450); };
    $$('.quick button', body).forEach(b => b.addEventListener('click', () => ask(b.textContent)));
    $('#chat-form').addEventListener('submit', e => { e.preventDefault(); const i = $('#chat-input'); ask(i.value); i.value = ''; });
    $('#chat-fab').addEventListener('click', () => { const open = $('#chat-panel').classList.toggle('open'); $('#chat-fab').setAttribute('aria-expanded', open); document.body.classList.toggle('chat-open', open); if (open) $('#chat-input').focus(); });
    $('#chat-close').addEventListener('click', closeChat);
  }
  function closeChat() { const p = $('#chat-panel'); if (p) { p.classList.remove('open'); $('#chat-fab').setAttribute('aria-expanded', false); document.body.classList.remove('chat-open'); } }

  /* ---------- floating header state + back to top ---------- */
  function renderToTop() {
    const old = $('#to-top'); if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', `<button class="to-top" id="to-top" type="button" aria-label="${t('common.top')}" title="${t('common.top')}">${icon('arrowR')}</button>`);
    $('#to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
    onScroll();
  }
  function onScroll() {
    const y = window.scrollY;
    const h = $('.site-header'); if (h) h.classList.toggle('scrolled', y > 24);
    const b = $('#to-top'); if (b) b.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    const els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
  }

  /* ---------- shared partials ---------- */
  const catCard = (c, i) => `
    <a class="card cat-card reveal ${c.pending ? 'pending' : ''}" href="category.html?c=${c.id}">
      <div class="icon-chip">${icon(c.icon)}</div>${icon('arrowUR', 'corner')}
      <h3>${esc(L(c.name))}</h3><p>${esc(L(c.desc))}</p>
      <div class="meta"><span class="num">${pad(i + 1)}</span>${c.pending ? `<span class="tag">${t('process.soon')}</span>` : `<span>${c.subs.length} ${t('process.subs')}</span>`}</div>
    </a>`;
  const productCard = (p, mode = 'tech') => {
    const href = mode === 'store' ? `store-item.html?p=${p.id}` : `product.html?p=${p.id}`;
    const c = catById(p.cat);
    return `<article class="card product-card is-link reveal">
      <a href="${href}" aria-label="${esc(p.name)}">${packHTML(p, p.sample || !p.brand ? '' : `<span class="tag red">${esc(p.brand)}</span>`)}</a>
      <div class="pc-body"><span class="pc-cat">${esc(L(c.name))}</span><h3><a href="${href}">${esc(p.name)}</a></h3>
        <div class="pc-foot">${mode === 'store'
          ? p.quote ? `<span class="price quote">${t('prod.quote')}</span><a class="btn btn-dark btn-sm" href="${href}">${t('prod.view')}</a>`
          : `<span class="price"><small>${t('store.from')}</small>${rupiah(minPrice(p))}</span><button class="btn btn-dark btn-sm" type="button" data-add="${p.id}" aria-label="${t('store.add')}: ${esc(p.name)}">${icon('cart')}</button>`
          : `<a class="link-arrow" href="${href}">${t('sub.viewProduct')} ${icon('arrowR')}</a>`}</div></div>
    </article>`;
  };
  function bindAddButtons(root) {
    $$('[data-add]', root).forEach(b => b.addEventListener('click', () => {
      const p = productById(b.dataset.add); cart.add(p.id, p.packs[0].size, 1);
      toast(`${t('store.added')} · <a href="cart.html">${t('cart.checkout')}</a>`);
    }));
  }
  const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map((it, i) => (i ? '<span class="sep">/</span>' : '') + (it[1] ? `<a href="${it[1]}">${esc(it[0])}</a>` : `<span aria-current="page">${esc(it[0])}</span>`)).join('')}</nav>`;
  const notFound = (msg) => `<section class="section"><div class="container"><div class="empty-state">${icon('info')}<p>${msg}</p><a class="btn btn-dark" href="process.html">${t('cat.back')}</a></div></div></section>`;


  /* ---------- news & articles ---------- */
  const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const postsSorted = () => D.posts.slice().sort((a, b) => b.date.localeCompare(a.date));
  const typeLabel = (p) => p.type === 'news' ? t('news.news') : t('news.article');
  const postMeta = (p) => `<div class="post-meta"><span class="tag ${p.type === 'news' ? 'dark' : 'red'}">${typeLabel(p)}</span><span>${fmtDate(p.date)}</span><span class="dot"></span><span>${p.read} ${t('news.minRead')}</span></div>`;
  const postCard = (p) => `<a class="card post-card reveal" href="post.html?id=${p.id}">
      <div class="post-img"><img src="assets/img/${p.img}.jpg" alt="" loading="lazy"></div>
      <div class="post-body">${postMeta(p)}<h3>${esc(L(p.title))}</h3><p>${esc(L(p.excerpt))}</p><span class="link-arrow">${t('news.read')} ${icon('arrowR')}</span></div></a>`;

  /* ======================================================================
     PAGE RENDERERS
     ====================================================================== */
  const R = {};

  R.process = () => {
    $('#cat-grid').innerHTML = D.categories.map(catCard).join('');
  };


  const TOGGLE = (withId = true) => `<button class="sim-toggle" type="button" ${withId ? 'id="sim-toggle"' : ''} aria-pressed="false" aria-label="${t('cat.simPlay')}">
          <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor"/></svg>
          <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor"/></svg>
        </button>`;

  // The simulation block: an interactive figure when the item has one, otherwise the video.
  function simHTML(name, item) {
    const fig = item.figure;
    const media = fig
      ? `<figure class="sim-frame sim-figure reveal">
        <div class="hl-stage" data-figure="${fig}"></div>
        <span class="tag sim-read"></span>
        <span class="sim-hint">${figHint(fig)}</span>
        ${TOGGLE(false)}
      </figure>`
      : `<figure class="sim-frame reveal">
        <video id="sim-video" muted loop playsinline preload="metadata" poster="assets/video/sim/${item.sim || D.defaultSim}.jpg" aria-label="${esc(t('cat.simEyebrow') + ': ' + name)}">
          <source src="assets/video/sim/${item.sim || D.defaultSim}.mp4" type="video/mp4">
        </video>
        ${item.sim ? '' : `<span class="tag sim-tag">${t('cat.simSample')}</span>`}
        ${TOGGLE()}
      </figure>`;
    return `<section class="section-tight sim-section"><div class="container"><div class="sim-wrap">
      <div class="sim-copy reveal">
        <div class="eyebrow">${t('cat.simEyebrow')}</div>
        <h2 class="display">${t(fig ? 'fig.simTitle' : 'cat.simTitle')}</h2>
        <p class="lead">${esc(t(fig ? 'fig.simText' : 'cat.simText').replace('{name}', name))}</p>
      </div>
      ${media}
    </div></div></section>`;
  }

  R.category = () => {
    const c = catById(params.get('c')) || D.categories[0];
    document.title = `${L(c.name)} — METINDO`;
    const idx = catIndex(c.id);
    const prods = D.products.filter(p => p.cat === c.id);
    let html = `
      <section class="page-hero" style="padding-bottom:0"><div class="container">
        ${crumbs([[t('common.home'), 'index.html'], [t('nav.process'), 'process.html'], [L(c.name)]])}
        <div class="hero-band reveal"><img src="assets/img/${c.img}.jpg" alt="">
          <div class="inner"><div class="icon-chip">${icon(c.icon)}</div><div class="eyebrow">${t('nav.process')} · ${pad(idx)} / ${pad(D.categories.length)}</div>
          <h1 class="display">${esc(L(c.name))}</h1><p class="lead">${esc(L(c.desc))}</p></div></div>
      </div></section>`;

    // process simulation: introduces every process before its content
    html += simHTML(L(c.name), c);

    if (c.pending) {
      html += `<section class="section"><div class="container"><div class="pending-box reveal">
        <div class="icon-chip">${icon(c.icon)}</div><h2 class="display" style="font-size:clamp(1.6rem,3vw,2.2rem)">${t('cat.pendingTitle')}</h2>
        <p>${t('cat.pendingText')}</p><a class="btn btn-red btn-lg" href="consultation.html?topic=${c.id}">${t('cat.askExpert')} ${icon('arrowR')}</a></div></div></section>`;
    } else {
      // sub-categories (boxes) — nested groups for Polishing
      const nested = c.subs.some(s => s.children);
      html += `<section class="section"><div class="container"><div class="section-head"><div class="eyebrow">${t('cat.subTitle')}</div>
        <h2 class="display">${esc(L(c.name))}</h2></div>`;
      if (nested) {
        html += c.subs.map((s, i) => `<div class="sub-group reveal"><div class="sub-group-head"><span class="idx">${i + 1}.</span><h3>${esc(L(s.name))}</h3><span class="muted">${esc(L(s.desc))}</span></div>
          <div class="grid grid-3">${s.children.map((ch, j) => `<a class="card compact" href="sub.html?c=${c.id}&s=${ch.id}"><div class="code">${i + 1}.${j + 1}</div>${icon('arrowUR', 'corner')}<h3>${esc(L(ch.name))}</h3><p>${esc(L(ch.desc))}</p></a>`).join('')}</div></div>`).join('');
      } else {
        html += `<div class="grid grid-3">${c.subs.map((s, i) => `<a class="card reveal" href="sub.html?c=${c.id}&s=${s.id}"><div class="icon-chip dark"><span style="font-family:var(--font-display);font-weight:800">${pad(i + 1)}</span></div>${icon('arrowUR', 'corner')}<h3>${esc(L(s.name))}</h3><p>${esc(L(s.desc))}</p>
          <div class="meta"><span>${D.products.filter(p => p.sub === s.id).length} ${t('store.results')}</span></div></a>`).join('')}</div>`;
      }
      html += `</div></section>`;

      if (c.flow && D.zincLine) {
        const fl = D.zincLine.steps, lineHref = `sub.html?c=${c.id}&s=alkaline-zinc`;
        html += `<section class="section bg-surface"><div class="container">
          <div class="section-head row" style="justify-content:space-between;align-items:flex-end;gap:20px"><div><div class="eyebrow">${t('cat.flowTitle')}</div><h2 class="display">${t('cat.flowTitle')}</h2><p class="lead">${t('cat.flowLead')}</p></div>
            <a class="btn btn-red" href="${lineHref}">${t('line.open')} ${icon('arrowR')}</a></div>
          <div class="flow-wrap reveal"><ol class="flow" style="list-style:none;margin:0;padding:0;--n:${fl.length}">${fl.map(st => `
            <li class="flow-step ${st.groups ? 'final' : ''}"><a class="flow-link" href="${lineHref}&step=${st.id}${st.black ? '&black=1' : ''}"><div class="node">${st.id.toUpperCase()}</div><div class="lbl">${st.black ? t('line.blackOnly') : `${t('cat.step')} ${st.id.toUpperCase()}`}</div><h4>${esc(L(st.name))}</h4></a>
            ${st.groups ? `<div class="variants">${st.groups.map(v => `<span><i style="background:${v.color}"></i>${esc(L(v.name))}</span>`).join('')}</div>` : ''}</li>`).join('')}</ol></div>
        </div></section>`;
      }

      if (prods.length) {
        html += `<section class="section ${c.flow ? '' : 'divided'}"><div class="container">
          <div class="section-head row" style="justify-content:space-between;align-items:flex-end"><div><div class="eyebrow">${t('cat.productsTitle')}</div><h2 class="display">${t('cat.productsTitle')}</h2></div>
          <a class="link-arrow" href="store.html?cat=${c.id}">${t('nav.store')} ${icon('arrowR')}</a></div>
          <div class="grid grid-4">${prods.map(p => productCard(p)).join('')}</div></div></section>`;
      }
    }

    const next = D.categories[idx % D.categories.length];
    html += `<section class="section-tight divided" style="border-top:1px solid var(--line)"><div class="container next-bar">
      <a class="btn btn-outline" href="process.html">${icon('arrowL')} ${t('cat.back')}</a>
      <a class="btn btn-dark" href="category.html?c=${next.id}">${pad(catIndex(next.id))} · ${esc(L(next.name))} ${icon('arrowR')}</a></div></section>`;
    $('#app').innerHTML = html;
    initSim();
    initFigures();
  };


  // Hairline figures (assets/js/hairline): the kernel and each figure load once;
  // a figure file calls hairline({...}) to register itself. A figure frame is a
  // <figure> holding .hl-stage[data-figure], and optionally .sim-read (the
  // read-out) and .sim-toggle (play/pause of the tour, an unseen pointer that
  // walks the figure while it is on screen until a real pointer takes over).
  const FIGS = {};
  let figMounts = [];
  window.hairline = (fig) => { FIGS[fig.name] = fig; };
  const ASSET_V = ((document.querySelector('script[src*="app.js"]') || {}).src || '').split('v=')[1] || '1';
  // Figures load as modules, as on the hairline bench: each keeps its own top-level names.
  const loadScript = (src, module) => new Promise((ok, fail) => {
    const old = document.querySelector(`script[data-src="${src}"]`);
    if (old) { if (old.dataset.ready) ok(); else { old.addEventListener('load', ok); old.addEventListener('error', fail); } return; }
    const s = document.createElement('script');
    if (module) s.type = 'module';
    s.src = `${src}?v=${ASSET_V}`; s.dataset.src = src;
    s.onload = () => { s.dataset.ready = '1'; ok(); }; s.onerror = fail;
    document.head.appendChild(s);
  });
  const hasKey = (k) => Object.prototype.hasOwnProperty.call(DICT.en, k);
  const figLabel = (text) => (text === 'rest' ? t('fig.rest') : text.replace(/^[a-z]+/, (w) => (hasKey(`fig.${w}`) ? t(`fig.${w}`) : w)));
  const figHint = (name) => t(name === 'soak' ? 'fig.hint' : `fig.hint_${name}`);

  async function mountFigure(stage, opts = {}) {
    const name = stage.dataset.figure;
    stage.dataset.mounting = '1';
    try {
      await loadScript('assets/js/hairline/kernel.js');
      await loadScript(`assets/js/hairline/${name}.js`, true);
    } catch (e) { const f = stage.closest('figure'); if (f) f.hidden = true; return null; }
    const fig = FIGS[name];
    if (!fig || !document.body.contains(stage)) return null;
    HL.inject(document);
    stage.replaceChildren();
    stage.setAttribute('data-hairline', fig.name);
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', hasKey(`fig.${name}Means`) ? t(`fig.${name}Means`) : fig.means);
    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
    const frame = stage.closest('figure') || stage.parentNode;
    const out = $('.sim-read', frame), btn = $('.sim-toggle', frame);
    let text = null;
    const read = {
      get textContent() { return text; },
      set textContent(v) {
        text = v == null ? '' : String(v);
        if (out) out.textContent = (opts.label || figLabel)(text);
        if (opts.onRead) opts.onRead(text);
      },
    };
    const handle = fig.mount({ stage, svg, read }, fig.range[1]);
    if (text === null) read.textContent = 'rest';

    let tour = null, io = null, userPaused = opts.tour === false || matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sync = () => {
      if (!btn) return;
      btn.setAttribute('aria-pressed', !!tour);
      btn.setAttribute('aria-label', tour ? t('cat.simPause') : t('cat.simPlay'));
      btn.classList.toggle('is-playing', !!tour);
    };
    const play = () => { if (!tour) tour = HL.tour(stage, fig.tour || HL.LAP, () => {}); sync(); };
    const stop = () => { if (tour) { tour.stop(); tour = null; } sync(); };
    if (btn) btn.addEventListener('click', () => { if (tour) { userPaused = true; stop(); } else { userPaused = false; play(); } });
    if (opts.tour !== false && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting && !userPaused) play();
        else if (!en.isIntersecting) stop();
      }), { threshold: .35 });
      io.observe(stage);
    }
    sync();
    const m = {
      fig, stage, read, stop,
      destroy() { stop(); if (io) io.disconnect(); handle.destroy(); stage.replaceChildren(); figMounts = figMounts.filter(x => x !== m); },
    };
    figMounts.push(m);
    return m;
  }
  const destroyFigures = () => figMounts.slice().forEach(m => m.destroy());
  function initFigures() {
    figMounts.filter(m => !document.body.contains(m.stage)).forEach(m => m.destroy());
    $$('.hl-stage[data-figure]:not([data-mounting]):not([data-manual])').forEach(st => mountFigure(st));
  }

  // Autoplay (muted, looping) only while on screen and when motion is allowed;
  // the button gives a manual play/pause either way.
  function initSim() {
    const v = $('#sim-video'), btn = $('#sim-toggle');
    if (!v || !btn) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let userPaused = reduce;
    const sync = () => {
      const playing = !v.paused;
      btn.setAttribute('aria-pressed', playing);
      btn.setAttribute('aria-label', playing ? t('cat.simPause') : t('cat.simPlay'));
      btn.classList.toggle('is-playing', playing);
    };
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    btn.addEventListener('click', () => { if (v.paused) { userPaused = false; v.play().catch(() => {}); } else { userPaused = true; v.pause(); } });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting && !userPaused) v.play().catch(() => {});
        else if (!en.isIntersecting) v.pause();
      }), { threshold: .35 }).observe(v);
    } else if (!reduce) v.play().catch(() => {});
    sync();
  }

  R.sub = () => {
    const c = catById(params.get('c'));
    const f = c && findSub(c, params.get('s'));
    if (!f) { $('#app').innerHTML = notFound(t('prod.notFound')); return; }
    const { sub, parent } = f;
    if (sub.line && D.zincLine) { R.line(c, sub); return; }
    document.title = `${L(sub.name)} — METINDO`;
    const ids = subIds(sub);
    const prods = D.products.filter(p => ids.includes(p.sub));
    const trail = [[t('common.home'), 'index.html'], [t('nav.process'), 'process.html'], [L(c.name), `category.html?c=${c.id}`]];
    if (parent) trail.push([L(parent.name), `category.html?c=${c.id}`]);
    trail.push([L(sub.name)]);
    const siblings = (parent ? parent.children : c.subs).filter(s => s.id !== sub.id);
    let html = `<section class="page-hero"><div class="container">${crumbs(trail)}
      <div class="split"><div><div class="eyebrow">${esc(L(c.name))}${parent ? ' · ' + esc(L(parent.name)) : ''}</div><h1 class="display">${esc(L(sub.name))}</h1><p class="lead">${esc(L(sub.desc))}</p>
        <div class="row" style="margin-top:28px"><a class="btn btn-dark" href="consultation.html?topic=${c.id}">${t('cat.askExpert')} ${icon('arrowR')}</a><a class="btn btn-outline" href="store.html?cat=${c.id}">${t('nav.store')}</a></div></div>
      <div class="media media-wide reveal"><img src="assets/img/${c.img}.jpg" alt=""></div></div></div></section>
      ${sub.figure ? simHTML(L(sub.name), sub) : ''}
      <section class="section divided" style="border-top:1px solid var(--line)"><div class="container">
        <div class="section-head"><div class="eyebrow">${t('sub.products')}</div><h2 class="display">${t('sub.products')}</h2></div>
        ${prods.length ? `<div class="grid grid-4">${prods.map(p => productCard(p)).join('')}</div>` : `<div class="pending-box"><p style="margin-top:0">${t('sub.noProducts')}</p><a class="btn btn-red" href="consultation.html?topic=${c.id}">${t('cat.askExpert')}</a></div>`}
      </div></section>`;
    if (siblings.length) {
      html += `<section class="section bg-surface"><div class="container"><div class="section-head"><div class="eyebrow">${t('cat.other')}</div></div>
        <div class="grid grid-3">${siblings.map(s => `<a class="card compact reveal" href="sub.html?c=${c.id}&s=${s.id}">${icon('arrowUR', 'corner')}<h3>${esc(L(s.name))}</h3><p>${esc(L(s.desc))}</p></a>`).join('')}</div></div></section>`;
    }
    $('#app').innerHTML = html;
    initFigures();
  };

  /* ---------- treatment line (alkaline zinc) ---------- */
  // The line figure answers hover; a click (or the step list) picks a step and
  // the figure keeps the hoist over it. The panel below shows that step's own
  // figure and its products; a product opens in the side sheet.
  R.line = (c, sub) => {
    const steps = D.zincLine.steps;
    const stepById = (id) => steps.find(s => s.id === id);
    const letter = (s) => s.id.toUpperCase();
    const prodsOf = (s) => (s.groups ? s.groups.flatMap(g => g.products) : s.products);
    let black = params.get('black') === '1';
    let cur = stepById((params.get('step') || '').toLowerCase()) ? params.get('step').toLowerCase() : 'a';
    if (stepById(cur).black) black = true;
    const visible = () => steps.filter(s => !s.black || black);
    const total = D.products.filter(p => p.line === 'zinc').length;
    document.title = `${L(sub.name)} — METINDO`;

    const railHTML = () => visible().map(s => `
      <li role="presentation"><button class="ln-step ${s.black ? 'is-black' : ''}" type="button" role="tab" id="ln-tab-${s.id}" data-step="${s.id}"
          aria-selected="${s.id === cur}" aria-controls="ln-panel" tabindex="${s.id === cur ? 0 : -1}">
        <span class="ln-letter">${letter(s)}</span><span class="ln-name">${esc(L(s.name))}</span>
        <span class="ln-meta">${prodsOf(s).length ? `${prodsOf(s).length} ${t(prodsOf(s).length === 1 ? 'line.productShort' : 'line.productsShort')}` : t('line.noChem')}</span></button>
        ${s.rinse ? `<span class="ln-rinse">${icon('droplet')}${t('line.rinseShort')}</span>` : ''}</li>`).join('');

    $('#app').innerHTML = `
      <section class="page-hero ln-hero"><div class="container">
        ${crumbs([[t('common.home'), 'index.html'], [t('nav.process'), 'process.html'], [L(c.name), `category.html?c=${c.id}`], [L(sub.name)]])}
        <div class="ln-hero-grid"><div><div class="eyebrow">${esc(L(c.name))}</div><h1 class="display">${esc(L(sub.name))}</h1><p class="lead">${t('line.lead')}</p>
          <div class="row" style="margin-top:28px"><a class="btn btn-dark" href="consultation.html?topic=${c.id}">${t('cat.askExpert')} ${icon('arrowR')}</a><a class="btn btn-outline" href="store.html?cat=${c.id}">${t('nav.store')}</a></div></div>
          <dl class="ln-facts"><div><dt>${steps.filter(s => !s.black).length}</dt><dd>${t('line.factSteps')}</dd></div><div><dt>${steps.filter(s => s.rinse).length * 2}</dt><dd>${t('line.factRinses')}</dd></div><div><dt>${total}</dt><dd>${t('line.factProducts')}</dd></div></dl></div>
      </div></section>
      <section class="section-tight ln-section"><div class="container"><div class="ln-grid">
        <div class="ln-side">
          <div class="eyebrow">${t('line.eyebrow')}</div><h2 class="display">${t('line.title')}</h2>
          <div class="ln-black"><span class="label-sm" id="ln-black-label">${t('line.black')}</span>
            <div class="seg" role="group" aria-labelledby="ln-black-label"><button type="button" data-black="0">${t('line.no')}</button><button type="button" data-black="1">${t('line.yes')}</button></div></div>
          <ol class="ln-rail" role="tablist" aria-orientation="vertical" aria-label="${esc(t('line.eyebrow'))}"></ol>
        </div>
        <figure class="sim-frame sim-figure ln-figure">
          <div class="hl-stage" data-figure="line" data-manual></div>
          <span class="tag sim-read"></span><span class="sim-hint">${t('line.hint')}</span>
        </figure>
      </div></div></section>
      <section class="section ln-panel-wrap" id="ln-panel" role="tabpanel" tabindex="-1"><div class="container" id="ln-panel-inner"></div></section>`;

    const rail = $('.ln-rail'), panel = $('#ln-panel-inner');
    let stepM = null;

    function drawRail() {
      rail.innerHTML = railHTML();
      $$('[data-black]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.black === (black ? '1' : '0'))));
      $('#ln-panel').setAttribute('aria-labelledby', `ln-tab-${cur}`);
    }

    function drawPanel() {
      const s = stepById(cur), vis = visible(), i = vis.indexOf(s), prev = vis[i - 1], next = vis[i + 1];
      const row = (id) => {
        const p = productById(id); if (!p) return '';
        return `<li class="ln-prod"><button class="ln-prod-main" type="button" data-sheet="${p.id}">
            <span class="ln-thumb">${packSVG(p)}</span><span class="ln-prod-txt"><b>${esc(p.name)}</b><small>${p.brand ? esc(p.brand) + ' · ' : ''}${t('prod.quote')}</small></span>${icon('arrowR', 'ln-go')}</button>
          <a class="btn btn-outline btn-sm" href="store-item.html?p=${p.id}" aria-label="${esc(t('prod.buy') + ': ' + p.name)}">${t('prod.buy')}</a></li>`;
      };
      const list = s.groups
        ? s.groups.map(g => `<div class="ln-group"><h3 class="ln-group-h"><i style="background:${g.color}"></i>${esc(L(g.name))}</h3><ul class="ln-prods">${g.products.map(row).join('')}</ul></div>`).join('')
        : s.products.length ? `<ul class="ln-prods">${s.products.map(row).join('')}</ul>` : `<p class="ln-empty">${icon('info')}${t('line.noProducts')}</p>`;
      const media = s.figure
        ? `<figure class="sim-frame sim-figure"><div class="hl-stage" data-figure="${s.figure}" data-manual></div><span class="tag sim-read"></span><span class="sim-hint">${figHint(s.figure)}</span>${TOGGLE(false)}</figure>`
        : `<div class="ln-nofig"><span class="ln-letter big">${letter(s)}</span><p>${esc(L(s.desc))}</p></div>`;
      panel.innerHTML = `<div class="ln-panel">
        <div class="ln-media">${media}</div>
        <div class="ln-copy">
          <div class="eyebrow">${t('line.step')} ${letter(s)} · ${i + 1} / ${vis.length}</div>
          <h2 class="display" id="ln-title">${esc(L(s.name))}</h2>
          <p class="lead">${esc(L(s.desc))}</p>
          ${s.rinse ? `<p class="ln-note" id="ln-rinse-note">${icon('droplet')}<span>${t('line.rinseNote')}</span></p>` : ''}
          ${s.black ? `<p class="ln-note">${icon('info')}<span>${t('line.blackNote')}</span></p>` : ''}
          <div class="ln-prods-head"><span class="label-sm">${t('line.products')}</span>${prodsOf(s).length ? `<span class="muted">${prodsOf(s).length} · ${t('prod.quote')}</span>` : ''}</div>
          ${list}
          <div class="ln-nav">${prev ? `<button class="btn btn-outline" type="button" data-go="${prev.id}">${icon('arrowL')} ${letter(prev)} · ${esc(L(prev.name))}</button>` : '<span></span>'}
            ${next ? `<button class="btn btn-dark" type="button" data-go="${next.id}">${letter(next)} · ${esc(L(next.name))} ${icon('arrowR')}</button>` : ''}</div>
        </div></div>`;
      $$('[data-sheet]', panel).forEach(b => b.addEventListener('click', () => openSheet(productById(b.dataset.sheet), b)));
      $$('[data-go]', panel).forEach(b => b.addEventListener('click', () => { select(b.dataset.go); $('#ln-panel').focus({ preventScroll: true }); const top = $('#ln-panel').getBoundingClientRect().top; if (top < 0) $('#ln-panel').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }));
      if (stepM) { stepM.destroy(); stepM = null; }
      const st = $('.hl-stage', panel);
      if (st) mountFigure(st).then(m => { if (m && document.body.contains(st)) stepM = m; else if (m) m.destroy(); });
    }

    function select(id, how = {}) {
      const s = stepById(id); if (!s) return;
      if (s.black) black = true;
      const changed = id !== cur;
      cur = id;
      drawRail();
      if (changed || how.force) drawPanel();
      if (how.rinse) { const n = $('#ln-rinse-note'); if (n) { n.classList.remove('flash'); void n.offsetWidth; n.classList.add('flash'); } }
      const q = new URLSearchParams(location.search); q.set('step', cur); if (black) q.set('black', '1'); else q.delete('black');
      history.replaceState(null, '', `${location.pathname}?${q}`);
      goTo(cur);
      if (lineM) drawChips();
    }

    // the step list: arrow keys move along it and select as they go
    // a click on a step (list, letter chip or tank) brings its explanation into view; arrow keys stay put
    const toPanel = () => $('#ln-panel').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    rail.addEventListener('click', e => { const b = e.target.closest('[data-step]'); if (b) { select(b.dataset.step); toPanel(); } });
    rail.addEventListener('keydown', e => {
      const ids = visible().map(s => s.id), i = ids.indexOf(cur);
      const to = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: ids.length - 1 }[e.key];
      if (to == null) return;
      e.preventDefault();
      select(ids[Math.max(0, Math.min(ids.length - 1, to))]);
      $(`#ln-tab-${cur}`).focus();
    });
    $$('[data-black]').forEach(b => b.addEventListener('click', () => {
      black = b.dataset.black === '1';
      if (!black && stepById(cur).black) select('g'); else select(cur);
    }));

    // the line figure: hover answers, click picks, and the hoist returns to the picked step when the pointer leaves
    const lineStage = $('.ln-figure .hl-stage'), lineFrame = $('.ln-figure');
    let lineM = null, last = '';
    const centres = {};
    const station = (id) => (id === 'g' ? 'oven g' : `step ${id}`);
    const parse = (txt) => { const m = /^(step|oven|rinse) ([a-gx])(\d)?$/.exec(txt || ''); return m ? { step: m[2], rinse: m[1] === 'rinse' ? m[3] : null } : null; };
    const lineLabel = (txt) => {
      const r = parse(txt) || { step: cur }, s = stepById(r.step);
      return r.rinse ? `${t('line.rinseN').replace('{n}', r.rinse)} · ${letter(s)}` : `${letter(s)} · ${L(s.name)}${s.black && !black ? ` · ${t('line.blackOnly')}` : ''}`;
    };
    const fire = (type, vx) => {
      const r = lineStage.getBoundingClientRect();
      lineStage.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: r.left + (vx / 400) * r.width, clientY: r.top + r.height * 0.6, pointerType: 'mouse' }));
    };
    function goTo(id) { if (lineM && centres[station(id)] != null) fire('pointermove', centres[station(id)]); }

    // Where each process tank's front face sits in the line figure's 400 × 320 view.
    // Same camera, fit and tank positions as figures/line.js: keep the two in step.
    const chipsAt = () => {
      const C = HL.Cam(45, 0.5, 1.12);
      HL.fit(C, [[-6, -6, -5], [393, 36, -5], [393, -6, -5], [-6, 36, -5], [-6, 15, 70], [393, 15, 70]], 200, 166);
      const P = HL.proj(C), at = {};
      ['a', 'b', 'c', 'd', 'e', 'f'].forEach((id, i) => { at[id] = P(i * 54 + 13, 30, 13); });
      at.x = P(337, 30, 13); at.g = P(371, 30, 20);
      return at;
    };
    const chipsBox = document.createElement('div');
    chipsBox.className = 'ln-chips';
    lineFrame.appendChild(chipsBox);
    function drawChips() {
      if (!window.HL) return;
      const at = chipsAt(), hover = parse(last);
      chipsBox.innerHTML = steps.map(s => `<button class="ln-chip ${s.id === cur ? 'on' : ''} ${s.black && !black ? 'off' : ''} ${hover && hover.step === s.id && !hover.rinse ? 'is-hover' : ''}" type="button" data-chip="${s.id}"
        style="left:${(at[s.id][0] / 400 * 100).toFixed(2)}%;top:${(at[s.id][1] / 320 * 100).toFixed(2)}%" aria-label="${esc(`${t('line.step')} ${letter(s)} · ${L(s.name)}`)}">${letter(s)}</button>`).join('');
    }
    chipsBox.addEventListener('click', e => { const b = e.target.closest('[data-chip]'); if (b) { select(b.dataset.chip); toPanel(); } });

    drawRail(); drawPanel();
    mountFigure(lineStage, { tour: false, label: lineLabel, onRead: (txt) => { const was = (parse(last) || {}).step; last = txt; if (lineM && (parse(txt) || {}).step !== was) drawChips(); } }).then(m => {
      if (!m) return;
      lineM = m;
      // find each station's place on screen once: the figure picks by screen x alone
      const acc = {};
      for (let vx = 0; vx <= 400; vx += 2) { fire('pointermove', vx); (acc[last] = acc[last] || []).push(vx); }
      Object.keys(acc).forEach(k => { centres[k] = acc[k].reduce((x, y) => x + y, 0) / acc[k].length; });
      goTo(cur);
      drawChips();
    });
    lineStage.addEventListener('click', () => { const r = parse(last); if (r) { select(r.step, { rinse: !!r.rinse }); toPanel(); } });
    lineFrame.addEventListener('pointerleave', e => { if (e.isTrusted && e.target === lineStage) { e.stopPropagation(); goTo(cur); } }, true);
  };

  /* ---------- product side sheet ---------- */
  let sheetReturn = null;
  function openSheet(p, opener) {
    if (!p) return;
    closeSheet(true);
    const s = D.zincLine && D.zincLine.steps.find(x => x.id === p.step);
    const g = s && s.groups && p.group != null ? s.groups[p.group] : null;
    const C = D.company;
    const docRow = (name, sub, ico, action, locked) => `<div class="doc ${locked ? 'locked' : ''}"><span class="d-ico">${icon(ico)}</span><span class="d-name">${name}<small>${sub}</small></span>${action}</div>`;
    const soon = (key) => `<button class="btn btn-outline btn-sm" type="button" data-soon="${key}">${t('prod.view')}</button><button class="btn btn-dark btn-sm" type="button" data-soon="${key}">${t('prod.download')}</button>`;
    const wrap = document.createElement('div');
    wrap.className = 'sheet-wrap'; wrap.id = 'sheet';
    wrap.innerHTML = `<div class="sheet-scrim" data-close-sheet></div>
      <aside class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1">
        <div class="sheet-head"><span class="eyebrow">${s ? `${t('line.step')} ${s.id.toUpperCase()} · ${esc(L(s.name))}` : esc(L(catById(p.cat).name))}</span>
          <button class="icon-btn" type="button" data-close-sheet aria-label="${t('common.close')}">${icon('close')}</button></div>
        <div class="sheet-body">
          ${packHTML(p)}
          <h3 class="display" id="sheet-title">${esc(p.name)}</h3>
          <div class="meta-row">${p.brand ? `<span class="tag dark">${t('prod.brand')}: ${esc(p.brand)}</span>` : ''}${g ? `<span class="tag"><i class="swatch" style="background:${g.color}"></i>${esc(L(g.name))}</span>` : ''}<span class="tag">${t('prod.quote')}</span></div>
          <p>${esc(L(p.desc))}</p>
          <div class="pd-section"><span class="label-sm">${t('prod.docs')}</span><div class="doc-list">
            ${docRow(t('prod.brochure'), 'PDF', 'file', `<div class="row">${soon('brochure')}</div>`)}
            ${docRow(t('prod.coa'), 'PDF', 'badgeCheck', `<div class="row">${soon('coa')}</div>`)}
            ${docRow(t('prod.tds'), t('prod.request'), 'lock', `<button class="btn btn-red btn-sm" type="button" data-request="TDS">${t('prod.request')}</button>`, true)}
            ${docRow(t('prod.price'), t('prod.request'), 'lock', `<button class="btn btn-red btn-sm" type="button" data-request="Price">${t('prod.request')}</button>`, true)}
          </div></div>
          <div class="pd-section"><span class="label-sm">${t('prod.video')}</span>
            <a class="video-card" href="${p.youtube || C.social.youtube}" target="_blank" rel="noopener" aria-label="${t('prod.video')}"><img src="assets/img/${catById(p.cat).img}.jpg" alt=""><span class="play"><span>${icon('play')}</span></span></a></div>
        </div>
        <div class="sheet-foot"><a class="btn btn-red" href="store-item.html?p=${p.id}">${icon('store')} ${t('prod.buy')}</a><a class="btn btn-outline" href="product.html?p=${p.id}">${t('prod.details')}</a></div>
      </aside>`;
    document.body.appendChild(wrap);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => wrap.classList.add('open'));
    sheetReturn = opener || null;
    const box = $('.sheet', wrap);
    box.focus();
    wrap.addEventListener('click', e => { if (e.target.closest('[data-close-sheet]')) closeSheet(); });
    $$('[data-soon]', wrap).forEach(b => b.addEventListener('click', () => toast(`${b.dataset.soon === 'coa' ? 'COA' : t('prod.brochure')} · ${t('common.comingSoon')}`)));
    $$('[data-request]', wrap).forEach(b => b.addEventListener('click', () => requestModal(p, b.dataset.request)));
    // keep Tab inside the sheet while it is open
    box.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const f = $$('a[href], button:not([disabled])', box);
      if (e.shiftKey && (document.activeElement === f[0] || document.activeElement === box)) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }
  function closeSheet(silent) {
    const w = $('#sheet'); if (!w) return;
    w.remove();
    document.body.classList.toggle('no-scroll', !!$('#modal'));
    if (!silent && sheetReturn && document.body.contains(sheetReturn)) sheetReturn.focus();
    sheetReturn = null;
  }

  R.product = () => {
    const p = productById(params.get('p'));
    if (!p) { $('#app').innerHTML = notFound(t('prod.notFound')); return; }
    const c = catById(p.cat);
    document.title = `${p.name} — METINDO`;
    const C = D.company;
    const sn = subName(p);
    const doc = (name, sub, ico, action, locked) => `<div class="doc ${locked ? 'locked' : ''}"><span class="d-ico">${icon(ico)}</span><span class="d-name">${name}<small>${sub}</small></span>${action}</div>`;
    const fileBtn = (url, key) => url
      ? `<a class="btn btn-outline btn-sm" href="${url}" target="_blank" rel="noopener">${t('prod.view')}</a><a class="btn btn-dark btn-sm" href="${url}" download>${t('prod.download')}</a>`
      : `<button class="btn btn-outline btn-sm" type="button" data-soon="${key}">${t('prod.view')}</button><button class="btn btn-dark btn-sm" type="button" data-soon="${key}">${t('prod.download')}</button>`;
    const related = D.products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    $('#app').innerHTML = `
      <section class="page-hero"><div class="container">
        ${crumbs([[t('common.home'), 'index.html'], [t('nav.process'), 'process.html'], [L(c.name), `category.html?c=${c.id}`]].concat(p.sub ? [[sn, `sub.html?c=${c.id}&s=${p.sub}`]] : []).concat([[p.name]]))}
        <div class="pd">
          <div class="pd-gallery">${packHTML(p, p.sample ? `<span class="tag">${t('prod.sample')}</span>` : '')}
            <div class="pd-thumbs"><div>${packSVG(p)}</div><div><img src="assets/img/${c.img}.jpg" alt="" loading="lazy"></div><div><img src="assets/img/chemstock.jpg" alt="" loading="lazy"></div><div><img src="assets/img/lab.jpg" alt="" loading="lazy"></div></div></div>
          <div>
            <div class="eyebrow">${esc(L(c.name))}${sn ? ' · ' + esc(sn) : ''}</div>
            <h1 class="display">${esc(p.name)}</h1>
            <div class="meta-row">${p.brand ? `<span class="tag dark">${t('prod.brand')}: ${esc(p.brand)}</span>` : ''}${p.quote ? `<span class="tag">${t('prod.quote')}</span>` : ''}${p.packs.map(k => `<span class="tag">${esc(k.size)}</span>`).join('')}</div>
            <p class="lead" style="margin-top:22px">${esc(L(p.desc))}</p>

            <div class="pd-section"><span class="label-sm">${t('prod.uses')}</span>
              <ul class="uses">${(p.uses[lang] || p.uses.en).map(u => `<li>${icon('check')}<span>${esc(u)}</span></li>`).join('')}</ul></div>

            <div class="pd-section"><span class="label-sm">${t('prod.docs')}</span><div class="doc-list">
              ${doc(t('prod.brochure'), 'PDF', 'file', `<div class="row">${fileBtn(p.brochure, 'brochure')}</div>`)}
              ${doc(t('prod.coa'), 'PDF', 'badgeCheck', `<div class="row">${fileBtn(p.coa, 'coa')}</div>`)}
              ${doc(t('prod.tds'), t('prod.request'), 'lock', `<button class="btn btn-red btn-sm" type="button" data-request="TDS">${t('prod.request')}</button>`, true)}
              ${doc(t('prod.price'), t('prod.request'), 'lock', `<button class="btn btn-red btn-sm" type="button" data-request="Price">${t('prod.request')}</button>`, true)}
            </div></div>

            <div class="buy-box">
              <a class="btn btn-dark btn-lg btn-block" href="store-item.html?p=${p.id}">${icon('store')} ${t('prod.buyStore')}</a>
              <div style="margin-top:18px" class="label-sm">${t('prod.marketplace')}</div>
              <div class="mkt"><a href="${C.marketplace.tokopedia}" target="_blank" rel="noopener"><i style="background:#42b549"></i>Tokopedia</a><a href="${C.marketplace.shopee}" target="_blank" rel="noopener"><i style="background:#ee4d2d"></i>Shopee</a><a href="${C.marketplace.blibli}" target="_blank" rel="noopener"><i style="background:#0095da"></i>Blibli</a></div>
            </div>

            <div class="pd-section"><span class="label-sm">${t('prod.video')}</span><p class="muted" style="margin:0 0 14px">${t('prod.videoText')}</p>
              <div class="social-row"><a class="social-btn yt" href="${p.youtube || C.social.youtube}" target="_blank" rel="noopener">${icon('youtube')} YouTube</a><a class="social-btn ig" href="${p.instagram || C.social.instagram}" target="_blank" rel="noopener">${icon('instagram')} Instagram</a></div>
              <a class="video-card" href="${p.youtube || C.social.youtube}" target="_blank" rel="noopener" aria-label="${t('prod.video')}"><img src="assets/img/${c.img}.jpg" alt=""><span class="play"><span>${icon('play')}</span></span></a>
            </div>
          </div>
        </div></div></section>
      ${related.length ? `<section class="section bg-surface"><div class="container"><div class="section-head"><div class="eyebrow">${t('prod.related')}</div></div><div class="grid grid-4">${related.map(x => productCard(x)).join('')}</div></div></section>` : ''}`;

    $$('[data-soon]').forEach(b => b.addEventListener('click', () => toast(`${b.dataset.soon === 'coa' ? 'COA' : t('prod.brochure')} · ${t('common.comingSoon')}`)));
    $$('[data-request]').forEach(b => b.addEventListener('click', () => requestModal(p, b.dataset.request)));
  };

  function requestModal(p, what) {
    const m = openModal(`<div class="modal-head"><div><div class="eyebrow" style="margin-bottom:.6rem">${what === 'TDS' ? 'TDS' : t('prod.price')}</div><h3 style="font-size:1.4rem">${t('req.title')}</h3></div>
        <button class="icon-btn" type="button" data-close aria-label="${t('common.close')}">${icon('close')}</button></div>
      <p class="muted" style="margin-top:0">${t('req.lead')}</p>
      <form class="form" novalidate id="req-form">
        <div class="field"><label>Product</label><input class="input" value="${esc(p.name)} — ${what}" readonly></div>
        ${field('rname', t('f.name'), { ac: 'name' })}
        <div class="two">${field('rcompany', t('f.company'), { ac: 'organization' })}${field('rphone', t('f.phone'), { type: 'tel', ac: 'tel' })}</div>
        ${field('remail', t('f.email'), { type: 'email', ac: 'email' })}
        <button class="btn btn-red btn-lg" type="submit">${t('req.send')}</button></form>`);
    $('#req-form', m).addEventListener('submit', async e => {
      e.preventDefault(); if (!validate(e.target)) return; await busy(e.target);
      const log = store.get('metindo-requests', []); log.push({ product: p.id, what, at: Date.now() }); store.set('metindo-requests', log);
      $('.modal-box', m).innerHTML = `<div class="success">${icon('checkCircle')}<span>${t('req.done')}</span></div><button class="btn btn-dark btn-block" style="margin-top:18px" data-close type="button">${t('common.close')}</button>`;
    });
  }

  R.consultation = () => {
    const sel = $('#f-interest');
    const topic = params.get('topic');
    sel.innerHTML = `<option value="">${t('f.choose')}</option>` + D.categories.map((c, i) => `<option value="${c.id}" ${c.id === topic ? 'selected' : ''}>${pad(i + 1)} · ${esc(L(c.name))}</option>`).join('');
    const form = $('#consult-form');
    form.onsubmit = async (e) => {
      e.preventDefault(); if (!validate(form)) return; await busy(form);
      const data = Object.fromEntries(new FormData(form).entries());
      const log = store.get('metindo-consultations', []); log.push({ ...data, at: Date.now() }); store.set('metindo-consultations', log);
      // TODO: POST `data` to the client's form backend / CRM endpoint here.
      form.innerHTML = `<div class="success">${icon('checkCircle')}<span>${t('consult.done')}</span></div>`;
    };
    $$('.field input, .field select, .field textarea', form).forEach(i => i.addEventListener('input', () => i.closest('.field').classList.remove('invalid')));
  };


  R.services = () => {
    $('#service-grid').innerHTML = D.services.map(sv => `
      <article class="card service-card reveal">
        <div class="service-img"><img src="assets/img/${sv.img}.jpg" alt="${esc(L(sv.alt))}" loading="lazy"></div>
        <div class="service-body"><div class="icon-chip">${icon(sv.icon)}</div><h3>${esc(L(sv.name))}</h3>
          <ol class="service-list">${(sv.items[lang] || sv.items.en).map(it => `<li>${esc(it)}</li>`).join('')}</ol></div>
      </article>`).join('');
  };

  R.home = () => {
    const host = $('#home-posts'); if (!host) return;
    host.innerHTML = postsSorted().slice(0, 3).map(postCard).join('');
  };

  R.news = () => {
    const state = { type: params.get('type') || 'all' };
    const draw = () => {
      $$('#news-tabs button').forEach(b => { b.classList.toggle('on', b.dataset.type === state.type); b.setAttribute('aria-selected', b.dataset.type === state.type); });
      const list = postsSorted().filter(p => state.type === 'all' || p.type === state.type);
      const [first, ...rest] = list;
      $('#news-list').innerHTML = !first ? '' : `
        <a class="card post-featured is-link reveal" href="post.html?id=${first.id}">
          <div class="post-img"><img src="assets/img/${first.img}.jpg" alt=""></div>
          <div class="post-body">${postMeta(first)}<h3 style="margin-top:18px">${esc(L(first.title))}</h3><p>${esc(L(first.excerpt))}</p><span class="link-arrow">${t('news.read')} ${icon('arrowR')}</span></div></a>
        <div class="grid grid-3">${rest.map(postCard).join('')}</div>`;
      reveal();
    };
    $$('#news-tabs button').forEach(b => b.addEventListener('click', () => { state.type = b.dataset.type; draw(); }));
    draw();
  };

  R.post = () => {
    const p = D.posts.find(x => x.id === params.get('id'));
    if (!p) { $('#app').innerHTML = `<section class="section"><div class="container"><div class="empty-state">${icon('info')}<p>${t('news.notFound')}</p><a class="btn btn-dark" href="news.html">${t('news.back')}</a></div></div></section>`; return; }
    document.title = `${L(p.title)} — METINDO`;
    const body = (p.body[lang] || p.body.en).map(b => b.startsWith('## ') ? `<h2>${esc(b.slice(3))}</h2>` : `<p>${esc(b)}</p>`).join('');
    const related = postsSorted().filter(x => x.id !== p.id).slice(0, 3);
    $('#app').innerHTML = `
      <section class="page-hero" style="padding-bottom:0"><div class="container">
        ${crumbs([[t('common.home'), 'index.html'], [t('nav.news'), 'news.html'], [L(p.title)]])}
        <div class="article-hero">${postMeta(p)}<h1 class="display">${esc(L(p.title))}</h1><p class="lead">${esc(L(p.excerpt))}</p></div>
        <div class="article-cover reveal"><img src="assets/img/${p.img}.jpg" alt=""></div>
        <div class="article-layout">
          <aside class="article-aside">
            <span class="label-sm">PT Metindo Perkasa</span>
            <button class="btn btn-outline btn-sm" type="button" id="copy-link">${t('news.copy')}</button>
            <a class="link-arrow" href="news.html">${icon('arrowL')} ${t('news.back')}</a>
          </aside>
          <article class="prose">${body}</article>
        </div>
      </div></section>
      <section class="section-tight"><div class="container"><div class="dark-panel reveal"><div class="next-bar" style="position:relative;z-index:1">
        <div><h2 class="display" style="font-size:clamp(1.6rem,3vw,2.4rem)">${t('news.ctaTitle')}</h2><p style="margin:12px 0 0;max-width:40rem">${t('news.ctaText')}</p></div>
        <a class="btn btn-red btn-lg" href="consultation.html">${t('nav.cta')} ${icon('arrowR')}</a></div></div></div></section>
      <section class="section bg-surface"><div class="container"><div class="news-head"><div><div class="eyebrow">${t('news.related')}</div></div><a class="link-arrow" href="news.html">${t('home.viewAll')} ${icon('arrowR')}</a></div>
        <div class="grid grid-3">${related.map(postCard).join('')}</div></div></section>`;
    $('#copy-link').addEventListener('click', () => {
      const done = () => toast(t('news.copied'));
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done();
    });
  };

  /* ---------- store ---------- */
  R.store = () => {
    const state = { cat: params.get('cat') || '', q: '', sort: 'featured' };
    $('#store-chips').innerHTML = `<button class="chip" data-cat="">${t('store.all')}</button>` + D.categories.map(c => `<button class="chip" data-cat="${c.id}">${esc(L(c.name))}</button>`).join('');
    const draw = () => {
      let list = D.products.filter(p => (!state.cat || p.cat === state.cat) && (!state.q || (p.name + ' ' + L(p.desc) + ' ' + L(catById(p.cat).name)).toLowerCase().includes(state.q)));
      if (state.sort === 'low' || state.sort === 'high') {
        const dir = state.sort === 'low' ? 1 : -1;
        list = list.filter(p => !p.quote).sort((a, b) => dir * (minPrice(a) - minPrice(b))).concat(list.filter(p => p.quote));
      }
      if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
      $$('#store-chips .chip').forEach(ch => ch.classList.toggle('on', ch.dataset.cat === state.cat));
      $('#result-count').textContent = `${list.length} ${t('store.results')}`;
      $('#store-grid').innerHTML = list.length ? list.map(p => productCard(p, 'store')).join('') : `<div class="empty-state" style="grid-column:1/-1">${icon('search')}<p>${t('store.empty')}</p></div>`;
      bindAddButtons($('#store-grid')); reveal();
    };
    $$('#store-chips .chip').forEach(ch => ch.addEventListener('click', () => { state.cat = ch.dataset.cat; draw(); }));
    $('#store-search').addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); draw(); });
    $('#store-sort').addEventListener('change', e => { state.sort = e.target.value; draw(); });
    draw();
  };

  R['store-item'] = () => {
    const p = productById(params.get('p'));
    if (!p) { $('#app').innerHTML = notFound(t('prod.notFound')); return; }
    const c = catById(p.cat);
    document.title = `${p.name} — METINDO Store`;
    $('#app').innerHTML = `<section class="page-hero"><div class="container">
      ${crumbs([[t('nav.store'), 'store.html'], [L(c.name), `store.html?cat=${c.id}`], [p.name]])}
      <div class="pd"><div class="pd-gallery">${packHTML(p, p.sample ? `<span class="tag">${t('prod.sample')}</span>` : '')}</div>
        <div><div class="eyebrow">${t('store.eyebrow')}</div><h1 class="display">${esc(p.name)}</h1>
          <p class="lead" style="margin-top:18px">${esc(L(p.desc))}</p>
          ${p.quote ? `<div style="margin-top:20px"><span class="price quote" style="font-size:1.6rem">${t('prod.quote')}</span></div>
          <p class="muted" style="margin-top:8px">${t('store.quoteText')}</p>
          <div class="row pd-section" style="gap:12px"><button class="btn btn-red btn-lg" type="button" id="si-quote">${t('prod.requestPrice')}</button><a class="btn btn-outline btn-lg" href="consultation.html?topic=${c.id}">${t('cat.askExpert')}</a></div>` : `
          <div style="margin-top:20px"><span class="price" id="si-price" style="font-size:2rem"></span></div>
          <div class="stock" style="margin-top:8px">${t('store.inStock')}</div>
          <form id="si-form" class="pd-section">
            <span class="label-sm">${t('store.size')}</span>
            <div class="size-opts">${p.packs.map((k, i) => `<label><input type="radio" name="size" value="${esc(k.size)}" ${i === 0 ? 'checked' : ''}><span>${esc(k.size)}<small>${rupiah(k.price)}</small></span></label>`).join('')}</div>
            <div class="row" style="margin-top:22px;gap:14px"><div class="qty"><button type="button" data-q="-1" aria-label="-">−</button><input id="si-qty" type="number" min="1" max="999" value="1" aria-label="${t('store.qty')}"><button type="button" data-q="1" aria-label="+">+</button></div>
              <button class="btn btn-red btn-lg" type="submit" style="flex:1">${icon('cart')} ${t('store.add')}</button></div>
          </form>`}
          <div class="pd-section"><ul class="uses">${(p.uses[lang] || p.uses.en).map(u => `<li>${icon('check')}<span>${esc(u)}</span></li>`).join('')}</ul>
            <div style="margin-top:20px"><a class="link-arrow" href="product.html?p=${p.id}">${t('store.techDetail')} ${icon('arrowR')}</a></div></div>
          <div class="buy-box"><div class="label-sm">${t('prod.marketplace')}</div><div class="mkt"><a href="${D.company.marketplace.tokopedia}" target="_blank" rel="noopener"><i style="background:#42b549"></i>Tokopedia</a><a href="${D.company.marketplace.shopee}" target="_blank" rel="noopener"><i style="background:#ee4d2d"></i>Shopee</a><a href="${D.company.marketplace.blibli}" target="_blank" rel="noopener"><i style="background:#0095da"></i>Blibli</a></div></div>
          <p class="note" style="margin-top:16px">${icon('info')}${t('store.demo')}</p>
        </div></div></div></section>`;
    if (p.quote) { $('#si-quote').addEventListener('click', () => requestModal(p, 'Price')); return; }
    const form = $('#si-form'), qty = $('#si-qty');
    const upd = () => { const k = p.packs.find(x => x.size === form.size.value); $('#si-price').textContent = rupiah(k.price * Math.max(1, +qty.value || 1)); };
    $$('[data-q]', form).forEach(b => b.addEventListener('click', () => { qty.value = Math.max(1, Math.min(999, (+qty.value || 1) + +b.dataset.q)); upd(); }));
    form.addEventListener('change', upd); qty.addEventListener('input', upd); upd();
    form.addEventListener('submit', e => { e.preventDefault(); cart.add(p.id, form.size.value, Math.max(1, +qty.value || 1)); toast(`${t('store.added')} · <a href="cart.html">${t('cart.checkout')}</a>`); });
  };

  R.cart = () => {
    const draw = () => {
      const lines = cart.lines();
      if (!lines.length) { $('#app').innerHTML = `<section class="section"><div class="container"><h1 class="display" style="margin-bottom:28px">${t('cart.title')}</h1><div class="empty-state">${icon('cart')}<p>${t('cart.empty')}</p><a class="btn btn-dark" href="store.html">${t('cart.continue')}</a></div></div></section>`; return; }
      $('#app').innerHTML = `<section class="section"><div class="container"><h1 class="display" style="margin-bottom:28px">${t('cart.title')}</h1>
        <div class="cart-layout"><div><div class="cart-items">${lines.map((l, i) => `<div class="cart-item"><a href="store-item.html?p=${l.p.id}">${packHTML(l.p)}</a>
          <div><h3><a href="store-item.html?p=${l.p.id}">${esc(l.p.name)}</a></h3><div class="ci-meta">${esc(l.size)} · ${rupiah(l.price)}</div>
            <div class="ci-actions"><div class="qty sm"><button type="button" data-dec="${i}" aria-label="-">−</button><input type="number" min="1" value="${l.qty}" data-idx="${i}" aria-label="${t('store.qty')}"><button type="button" data-inc="${i}" aria-label="+">+</button></div><button class="remove" type="button" data-rm="${i}">${t('cart.remove')}</button></div></div>
          <div class="price ci-price">${rupiah(l.total)}</div></div>`).join('')}</div>
          <a class="link-arrow" style="margin-top:18px" href="store.html">${icon('arrowL')} ${t('cart.continue')}</a></div>
        <aside class="summary"><h3>${t('co.summary')}</h3><div class="sum-row"><span>${t('cart.subtotal')} (${cart.count()} ${t('cart.items')})</span><b>${rupiah(cart.subtotal())}</b></div>
          <div class="sum-row total"><span>${t('co.total')}</span><span>${rupiah(cart.subtotal())}</span></div>
          <a class="btn btn-red btn-lg btn-block" style="margin-top:18px" href="checkout.html">${t('cart.checkout')} ${icon('arrowR')}</a>
          <p class="note" style="margin-top:14px">${icon('info')}${t('store.demo')}</p></aside></div></div></section>`;
      $$('[data-inc]').forEach(b => b.onclick = () => { const it = cart.items()[b.dataset.inc]; cart.setQty(+b.dataset.inc, it.qty + 1); draw(); });
      $$('[data-dec]').forEach(b => b.onclick = () => { const it = cart.items()[b.dataset.dec]; cart.setQty(+b.dataset.dec, it.qty - 1); draw(); });
      $$('[data-idx]').forEach(inp => inp.onchange = () => { cart.setQty(+inp.dataset.idx, +inp.value || 1); draw(); });
      $$('[data-rm]').forEach(b => b.onclick = () => { cart.remove(+b.dataset.rm); draw(); });
    };
    draw();
  };

  const SHIPPING = [
    { id: 'jne', name: 'JNE REG', eta: { en: '2–4 days', id: '2–4 hari' }, fee: 45000 },
    { id: 'jnt', name: 'J&T Cargo', eta: { en: '3–5 days', id: '3–5 hari' }, fee: 60000 },
    { id: 'sicepat', name: 'SiCepat BEST', eta: { en: '1–2 days', id: '1–2 hari' }, fee: 75000 },
    { id: 'pickup', name: null, eta: { en: 'Same day', id: 'Hari yang sama' }, fee: 0 }
  ];
  const PAYMENTS = [
    { id: 'bank', key: 'co.bank', sub: 'BCA · Mandiri · BNI' },
    { id: 'va', key: 'co.va', sub: 'BCA · BRI · Permata' },
    { id: 'qris', key: 'co.qris', sub: 'GoPay · OVO · DANA · ShopeePay' },
    { id: 'invoice', key: 'co.invoice', sub: '' }
  ];

  R.checkout = () => {
    const lines = cart.lines();
    if (!lines.length) { location.replace('cart.html'); return; }
    const user = store.get('metindo-user', null) || {};
    $('#app').innerHTML = `<section class="section"><div class="container"><h1 class="display" style="margin-bottom:28px">${t('co.title')}</h1>
      <form id="co-form" novalidate class="cart-layout"><div>
        <div class="co-section"><h3><span class="n">1</span>${t('co.customer')}</h3><div class="form">
          <div class="two">${field('name', t('f.name'), { ac: 'name', value: user.name })}${field('company', t('f.company'), { ac: 'organization', required: false, value: user.company })}</div>
          <div class="two">${field('email', t('f.email'), { type: 'email', ac: 'email', value: user.email })}${field('phone', t('f.phone'), { type: 'tel', ac: 'tel' })}</div></div></div>
        <div class="co-section"><h3><span class="n">2</span>${t('co.shipping')}</h3><div class="form">
          ${field('address', t('co.address'), { ac: 'street-address' })}
          <div class="two">${field('city', t('co.city'), { ac: 'address-level2' })}${field('province', t('co.province'), { ac: 'address-level1' })}</div>
          <div class="two">${field('postal', t('co.postal'), { ac: 'postal-code' })}<div></div></div>
          ${field('notes', t('co.notes'), { type: 'textarea', required: false })}</div></div>
        <div class="co-section"><h3><span class="n">3</span>${t('co.method')}</h3><div class="choice-list">${SHIPPING.map((s, i) => `<label class="choice"><input type="radio" name="ship" value="${s.id}" ${i === 0 ? 'checked' : ''}><span class="c-main">${s.name || t('co.pickup')}<small>${L(s.eta)}</small></span><span class="c-side">${s.fee ? rupiah(s.fee) : 'Rp 0'}</span></label>`).join('')}</div></div>
        <div class="co-section"><h3><span class="n">4</span>${t('co.payment')}</h3><div class="choice-list">${PAYMENTS.map((pm, i) => `<label class="choice"><input type="radio" name="pay" value="${pm.id}" ${i === 0 ? 'checked' : ''}><span class="c-main">${t(pm.key)}${pm.sub ? `<small>${pm.sub}</small>` : ''}</span></label>`).join('')}</div></div>
      </div>
      <aside class="summary"><h3>${t('co.summary')}</h3>
        ${lines.map(l => `<div class="sum-line">${packHTML(l.p)}<span class="sl-name">${esc(l.p.name)}<small>${esc(l.size)} × ${l.qty}</small></span><b>${rupiah(l.total)}</b></div>`).join('')}
        <div class="sum-row" style="margin-top:10px"><span>${t('cart.subtotal')}</span><b>${rupiah(cart.subtotal())}</b></div>
        <div class="sum-row"><span>${t('co.shippingFee')}</span><b id="co-ship"></b></div>
        <div class="sum-row total"><span>${t('co.total')}</span><span id="co-total"></span></div>
        <button class="btn btn-red btn-lg btn-block" style="margin-top:18px" type="submit">${t('co.place')} ${icon('arrowR')}</button>
        <p class="note" style="margin-top:14px">${icon('info')}${t('store.demo')}</p></aside></form></div></section>`;
    const form = $('#co-form');
    const fee = () => SHIPPING.find(s => s.id === form.ship.value).fee;
    const upd = () => { $('#co-ship').textContent = rupiah(fee()); $('#co-total').textContent = rupiah(cart.subtotal() + fee()); };
    form.addEventListener('change', upd); upd();
    $$('.field input, .field textarea', form).forEach(i => i.addEventListener('input', () => i.closest('.field').classList.remove('invalid')));
    form.addEventListener('submit', async e => {
      e.preventDefault(); if (!validate(form)) return; await busy(form);
      const d = new Date();
      const no = `MTD-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
      const data = Object.fromEntries(new FormData(form).entries());
      const order = { no, at: d.toISOString(), customer: data, lines: cart.items(), subtotal: cart.subtotal(), shipping: fee(), total: cart.subtotal() + fee(), status: 'pending' };
      const orders = store.get('metindo-orders', []); orders.unshift(order); store.set('metindo-orders', orders);
      store.set('metindo-last-order', no);
      // TODO: send `order` to the backend / payment gateway (Midtrans, Xendit…) here.
      cart.clear();
      location.href = 'order.html?no=' + encodeURIComponent(no);
    });
  };

  R.order = () => {
    const no = params.get('no') || store.get('metindo-last-order', null);
    const o = store.get('metindo-orders', []).find(x => x.no === no);
    if (!o) { $('#app').innerHTML = `<section class="section"><div class="container"><div class="empty-state"><p>${t('order.none')}</p><a class="btn btn-dark" href="store.html">${t('cart.continue')}</a></div></div></section>`; return; }
    const pay = PAYMENTS.find(p => p.id === o.customer.pay);
    $('#app').innerHTML = `<section class="section"><div class="container"><div class="order-hero">
      <div class="ok">${icon('check')}</div><h1 class="display" style="font-size:clamp(2rem,4.5vw,3.2rem)">${t('order.title')}</h1><p class="lead" style="margin:18px auto 0">${t('order.lead')}</p>
      <div class="order-no">${t('order.number')}: ${esc(o.no)}</div></div>
      <div class="summary" style="max-width:560px;margin:40px auto 0;position:static">
        ${o.lines.map(i => { const p = productById(i.id); if (!p) return ''; const pk = p.packs.find(x => x.size === i.size) || p.packs[0]; return `<div class="sum-line">${packHTML(p)}<span class="sl-name">${esc(p.name)}<small>${esc(i.size)} × ${i.qty}</small></span><b>${rupiah(pk.price * i.qty)}</b></div>`; }).join('')}
        <div class="sum-row" style="margin-top:10px"><span>${t('cart.subtotal')}</span><b>${rupiah(o.subtotal)}</b></div>
        <div class="sum-row"><span>${t('co.shippingFee')}</span><b>${rupiah(o.shipping)}</b></div>
        <div class="sum-row"><span>${t('co.payment')}</span><b>${pay ? t(pay.key) : ''}</b></div>
        <div class="sum-row total"><span>${t('co.total')}</span><span>${rupiah(o.total)}</span></div></div>
      <div class="row" style="justify-content:center;margin-top:28px"><a class="btn btn-dark" href="store.html">${t('cart.continue')}</a><a class="btn btn-outline" href="account.html">${t('acc.orders')}</a></div>
      </div></section>`;
  };

  R.account = () => {
    const user = store.get('metindo-user', null);
    if (user) {
      const orders = store.get('metindo-orders', []);
      $('#app').innerHTML = `<section class="section"><div class="container" style="max-width:860px">
        <div class="row" style="justify-content:space-between;margin-bottom:28px"><div><div class="eyebrow">${t('acc.title')}</div><h1 class="display">${t('acc.hello')}, ${esc(user.name.split(' ')[0])}</h1><p class="muted" style="margin:8px 0 0">${esc(user.email)}${user.company ? ' · ' + esc(user.company) : ''}</p></div>
          <button class="btn btn-outline" type="button" id="logout">${t('acc.logout')}</button></div>
        <div class="co-section"><h3>${t('acc.orders')}</h3>${orders.length ? orders.map(o => `<a class="order-row" href="order.html?no=${encodeURIComponent(o.no)}"><span><b>${esc(o.no)}</b><br><span class="muted" style="font-size:.85rem">${new Date(o.at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span><span class="status">${lang === 'id' ? 'Menunggu pembayaran' : 'Awaiting payment'}</span><b>${rupiah(o.total)}</b></a>`).join('') : `<p class="muted">${t('acc.noOrders')}</p>`}</div>
        <p class="note" style="margin-top:16px">${icon('info')}${t('acc.demo')}</p></div></section>`;
      $('#logout').onclick = () => { store.set('metindo-user', null); R.account(); };
      return;
    }
    const mode = params.get('mode') === 'register' ? 'register' : 'login';
    const draw = (m) => {
      $('#app').innerHTML = `<section class="section"><div class="container" style="max-width:520px">
        <div class="eyebrow">${t('acc.title')}</div><h1 class="display" style="margin-bottom:24px">${m === 'login' ? t('acc.login') : t('acc.register')}</h1>
        <div class="tabs" role="tablist"><button type="button" class="${m === 'login' ? 'on' : ''}" data-m="login">${t('acc.login')}</button><button type="button" class="${m === 'register' ? 'on' : ''}" data-m="register">${t('acc.register')}</button></div>
        <form class="form form-card" id="acc-form" novalidate>
          ${m === 'register' ? field('name', t('f.name'), { ac: 'name' }) + field('company', t('f.company'), { ac: 'organization', required: false }) : ''}
          ${field('email', t('f.email'), { type: 'email', ac: 'email' })}
          ${field('password', t('acc.password'), { type: 'password', ac: m === 'login' ? 'current-password' : 'new-password' })}
          <button class="btn btn-dark btn-lg" type="submit">${m === 'login' ? t('acc.login') : t('acc.register')}</button>
          <p class="note">${icon('info')}${t('acc.demo')}</p></form></div></section>`;
      $$('[data-m]').forEach(b => b.onclick = () => draw(b.dataset.m));
      $('#acc-form').addEventListener('submit', async e => {
        e.preventDefault(); const f = e.target; if (!validate(f)) return; await busy(f);
        // Prototype only: no password is stored. Replace with real auth.
        const email = f.email.value.trim();
        store.set('metindo-user', { name: f.name ? f.name.value.trim() : email.split('@')[0], company: f.company ? f.company.value.trim() : '', email });
        R.account();
      });
    };
    draw(mode);
  };

  /* ---------- boot ---------- */
  function motionPrefs() {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    $$('video[autoplay]').forEach(v => { v.removeAttribute('autoplay'); v.pause(); v.setAttribute('controls', ''); });
  }

  function boot() {
    destroyFigures();
    closeSheet(true);
    applyI18n();
    renderHeader();
    renderFooter();
    renderChat();
    renderToTop();
    if (R[page]) R[page]();
    reveal();
    updateCartBadge();
    motionPrefs();
    $$('main img:not([loading])').forEach(img => { img.decoding = 'async'; });
  }
  boot();

  // expose for inline use / debugging
  window.MTD = { t, cart, setLang, toast };
})();
