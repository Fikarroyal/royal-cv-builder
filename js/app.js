/* Aplikasi utama: navigasi, editor, halaman, aksi, PDF, shortcut */
const LU = {"file-earmark-person": "file-user", "grid": "layout-dashboard", "pencil-square": "square-pen", "layout-text-window": "layout-template", "folder2-open": "folder-open", "check2": "check", "arrow-counterclockwise": "undo-2", "arrow-clockwise": "redo-2", "dash-lg": "minus", "plus-lg": "plus", "share": "share-2", "eye-slash": "eye-off", "check2-circle": "circle-check", "exclamation-triangle": "triangle-alert", "trash": "trash-2", "hourglass-split": "loader", "files": "files", "list-check": "list-checks", "input-cursor-text": "text-cursor-input", "person": "user", "card-text": "text", "mortarboard": "graduation-cap", "lightning-charge": "zap", "patch-check": "badge-check", "link-45deg": "link", "file-earmark-pdf": "file-text", "file-earmark-plus": "file-plus", "check-circle": "circle-check", "arrow-repeat": "refresh-cw"};
const ic = n => `<i data-lucide="${LU[n] || n}"></i>`;
const FR = {};
let view = 'dashboard', zm = 0, tf = 'all', tq = '', jd = '', tm;
const OPEN = new Set(['personal']);
const FONTS = ['Plus Jakarta Sans', 'Sora', 'DM Sans', 'Manrope', 'Outfit', 'Lora', 'Playfair Display'];
const PRE = [['Biru Profesional', '#2563eb'], ['Navy', '#1e3a8a'], ['Hitam', '#111827'], ['Hijau', '#047857'], ['Burgundy', '#881337'], ['Abu-abu', '#4b5563']];
const CATS = [['all', 'Semua', 'layout-grid'], ['fav', 'Favorit', 'star'], ['ats', 'ATS', 'shield-check'], ['professional', 'Profesional', 'briefcase'], ['creative', 'Kreatif', 'palette'], ['academic', 'Akademik', 'graduation-cap'], ['tech', 'Tech', 'code-xml'], ['minimalist', 'Minimalis', 'minus'], ['elegant', 'Elegan', 'gem']];
const tn = id => TPL.find(t => t.id === id)?.name || 'Bawaan';
const find = id => S.cvs.find(c => c.id === id);
const fdate = t => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const filled = c => !!(c && c.personal.name && (c.summary || c.experience.length || c.education.length));
const prevCV = () => filled(cv()) ? cv() : { ...demo(), ...(cv() ? { settings: cv().settings } : {}) };
const pz = () => Math.min(.7, (Math.min(innerWidth, 640) - 76) / 794);
const hello = () => { const h = new Date().getHours(); return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam'; };

/* ---------- Notifikasi & modal ---------- */
function toast(m, i = 'check2-circle') {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `${ic(i)}${esc(m)}`;
  $('#toasts').append(t); setTimeout(() => t.remove(), 2800);
}
function note(m, i) { S.log.unshift({ t: Date.now(), m }); S.log.length = Math.min(S.log.length, 8); save(); toast(m, i); }
function modal(title, body, ok, fn, cls = '') {
  const m = $('#modal'); m.hidden = false; m._fn = fn;
  m.innerHTML = `<div class="dlg ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h3>${title}</h3><div class="mb">${body}</div><div class="act"><button class="btn" data-m="x">${ok ? 'Batal' : 'Tutup'}</button>${ok ? `<button class="btn pri" data-m="ok">${ok}</button>` : ''}</div></div>`;
  (m.querySelector('input,textarea') || m.querySelector('.pri,.btn'))?.focus();
}
const closeModal = () => { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; };

/* ---------- Perubahan data & preview ---------- */
function sync() { $('#undo').disabled = !S.undo.length; $('#redo').disabled = !S.redo.length; }
function changed() {
  cv().updated = Date.now(); sync();
  $('#saveState').innerHTML = '<i data-lucide="refresh-cw"></i>Menyimpan…';
  clearTimeout(tm); tm = setTimeout(() => { save(); $('#saveState').innerHTML = '<i data-lucide="check"></i>Tersimpan'; }, 500);
}
const zv = () => zm || Math.min(1, Math.max(.3, ($('#preview').clientWidth - 32) / 794));
function paint() {
  const c = cv(); if (!c || view !== 'editor') return;
  const z = zv(); $('#paper').innerHTML = renderCV(c); $('#paper').style.zoom = z; $('#zl').textContent = Math.round(z * 100) + '%';
  const p = comp(c).pct; if ($('#cbar')) { $('#cbar').style.width = p + '%'; $('#cpct').textContent = p + '%'; }
}

/* ---------- Navigasi: rail ikon di tablet/mobile ---------- */
const mq = matchMedia('(max-width:1024px)');
function toggleNav(f) {
  const o = f ?? !document.body.classList.contains('nav-open'), t = $('#navToggle');
  document.body.classList.toggle('nav-open', o); if (o) $('#navtip').classList.remove('on'); t.setAttribute('aria-expanded', o); t.setAttribute('aria-label', o ? 'Tutup menu' : 'Buka menu');
}
const closeNav = () => toggleNav(false);
const syncSeg = () => $$('.segb button').forEach(b => b.classList.toggle('on', b.dataset.pane === document.body.dataset.pane));
function navTip(b) {
  if (!mq.matches || document.body.classList.contains('nav-open')) return;
  const t = $('#navtip'), r = b.getBoundingClientRect();
  t.textContent = b.getAttribute('aria-label') || b.textContent; t.style.top = r.top + r.height / 2 + 'px'; t.style.left = r.right + 12 + 'px';
  t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 1800);
}
mq.addEventListener?.('change', () => { closeNav(); $('#navtip').classList.remove('on'); paint(); });

/* ---------- Navigasi ---------- */
function go(v) {
  view = v; document.body.dataset.view = v;
  $$('#side [data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === v));
  $$('.fx').forEach(x => x.classList.toggle('on', x.id === 'v-' + v));
  closeNav(); syncSeg();
  render(); $('#v-' + v).scrollTop = 0;
}
function render() {
  ({ dashboard: rDash, editor: rEditor, templates: rTpl, cvs: rCvs, ats: rAts, ...FR })[view]();
  $('#cvName').value = cv()?.name || ''; $('#cvName').disabled = !cv(); sync();
}

const empty = () => `<div class="empty"><i data-lucide="file-plus"></i><h2>Mulai buat CV profesional Anda</h2><p>Buat CV pertama Anda dan susun dengan template yang rapi.</p><div class="acts"><button class="btn pri" data-a="new"><i data-lucide="plus"></i>Buat CV Baru</button></div></div>`;
const stat = (l, v, i) => `<div class="card stat">${ic(i)}<div><small>${l}</small><b>${v}</b></div></div>`;

const tplCard = (t, c) => `<div class="card tc"><div class="thumb" data-a="tprev" data-id="${t.id}" role="button" tabindex="0" aria-label="Pratinjau ${t.name}" title="Klik untuk melihat pratinjau"><div>${renderCV({ ...c, template: t.id })}</div></div><div class="row"><b>${t.name}</b><button class="ib" data-a="fav" data-id="${t.id}" aria-label="Favorit"><i data-lucide="star"${S.fav.includes(t.id) ? ' class="fav"' : ''}></i></button></div><div class="tags"><span class="bd">${CATN[t.cat]}</span>${t.ats ? '<span class="bd ok">ATS Friendly</span>' : ''}</div><button class="btn pri" data-a="use" data-id="${t.id}">Gunakan Template</button></div>`;

function cvCard(x) {
  const ib = (a, i, l, cl = '') => `<button class="ib ${cl}" data-a="${a}" data-id="${x.id}" aria-label="${l}" title="${l}">${ic(i)}</button>`;
  return `<div class="card cc"><div class="thumb" data-a="prev" data-id="${x.id}" role="button" tabindex="0" aria-label="Pratinjau ${esc(x.name)}" title="Klik untuk melihat CV"><div>${renderCV(x)}</div></div><input class="nm" data-rn="${x.id}" value="${esc(x.name)}" maxlength="60" aria-label="Nama CV (klik untuk mengganti)" title="Klik untuk mengganti nama"><small class="mut">${tn(x.template)} · ${fdate(x.updated)}</small><div class="tags"><span class="bd">ATS ${ats(x).score}</span><span class="bd">Lengkap ${comp(x).pct}%</span></div><div class="ia"><span>${ib('edit', 'pencil', 'Edit CV')}${ib('cdup', 'copy', 'Duplikat')}</span><span>${ib('del', 'trash', 'Hapus CV', 'danger')}</span></div></div>`;
}

/* ---------- Halaman ---------- */
function rDash() {
  const el = $('#v-dashboard'), c = cv(); if (!c) { el.innerHTML = empty(); return; }
  const nm = S.set?.name || (c.personal.name || 'Fikar').split(' ')[0];
  const recent = S.cvs.slice().sort((a, b) => b.updated - a.updated);
  el.innerHTML = `<h2 class="hi">${hello()}, ${esc(nm)}</h2><p class="mut">Bangun CV yang dilirik rekruter. Terakhir diedit: ${esc(recent[0].name)} (${fdate(recent[0].updated)}).</p>
  <div class="stats">${stat('Total CV', S.cvs.length, 'files')}${stat('Skor ATS', ats(c).score, 'clipboard-check')}${stat('Kelengkapan', comp(c).pct + '%', 'list-check')}${stat('Template aktif', tn(c.template), 'layout-text-window')}</div>
  <h3>Aksi Cepat</h3><div class="acts"><button class="btn pri" data-a="new"><i data-lucide="plus"></i>Buat CV Baru</button><button class="btn" data-go="templates"><i data-lucide="layout-template"></i>Pilih Template</button><button class="btn" data-go="ats"><i data-lucide="clipboard-check"></i>Cek ATS</button></div>
  <h3>CV Terbaru</h3><div class="grid">${recent.slice(0, 3).map(cvCard).join('')}</div>
  <h3>Template Populer</h3><div class="grid">${['ats', 'modern', 'tech', 'exec'].map(id => tplCard(TPL.find(t => t.id === id), prevCV())).join('')}</div>
  <h3>Riwayat Aktivitas</h3>${S.log.length ? `<ul class="log">${S.log.map(l => `<li><span>${esc(l.m)}</span><small class="mut">${fdate(l.t)}</small></li>`).join('')}</ul>` : '<p class="mut">Belum ada aktivitas.</p>'}`;
}

function rTpl() {
  $('#v-templates').innerHTML = `<div class="bar2"><input id="tq" type="search" placeholder="Cari template…" value="${esc(tq)}" aria-label="Cari template"><div class="chips">${CATS.map(([k, l, i]) => `<button class="chip ${tf === k ? 'on' : ''}" data-a="filt" data-k="${k}">${ic(i)}${l}</button>`).join('')}</div></div><p class="mut" id="tcount"></p><div id="tgrid" class="grid"></div>`;
  tGrid();
}
function tGrid() {
  const c = prevCV();
  const l = TPL.filter(t => (tf === 'all' || (tf === 'fav' ? S.fav.includes(t.id) : tf === 'ats' ? t.ats : t.cat === tf)) && (t.name + ' ' + CATN[t.cat]).toLowerCase().includes(tq));
  $('#tcount').textContent = `${l.length} dari ${TPL.length} template` + (filled(cv()) ? '' : ' · Pratinjau memakai data contoh');
  $('#tgrid').innerHTML = l.map(t => tplCard(t, c)).join('') || '<p class="mut">Tidak ada template yang cocok.</p>';
}

function rCvs() {
  $('#v-cvs').innerHTML = S.cvs.length ? `<div class="head"><h2>CV Saya</h2><button class="btn pri" data-a="new"><i data-lucide="plus"></i>Buat CV Baru</button></div><div class="grid">${S.cvs.map(cvCard).join('')}</div>` : empty();
}

function rAts() {
  const el = $('#v-ats'), c = cv(); if (!c) { el.innerHTML = empty(); return; }
  const r = ats(c), k = comp(c), j = jd ? jdAnalyze(c, jd) : null;
  const chips = (a, cl) => a.map(x => `<span class="kw ${cl}">${esc(x)}</span>`).join('') || '<small class="mut">Tidak ada</small>';
  el.innerHTML = `<div class="two"><div class="card"><div class="ring" style="--v:${r.score}"><b>${r.score}</b><small>/ 100</small></div><h3 class="ct2">Skor ATS</h3><p class="mut ct2">Analisis berbasis aturan yang berjalan di perangkat Anda.</p>
  ${r.items.map(x => `<div class="cat"><div class="row"><span>${x.n}</span><b>${x.pts}/${x.max}</b></div><div class="pb"><i style="width:${x.pts / x.max * 100}%"></i></div>${x.pts < x.max * .7 ? `<small class="tip"><i data-lucide="lightbulb"></i>${x.tip}</small>` : ''}</div>`).join('')}</div>
  <div><div class="card"><div class="row"><h3>Kelengkapan CV</h3><b>${k.pct}%</b></div><div class="pb"><i style="width:${k.pct}%"></i></div><ul class="chk">${k.L.map(x => `<li class="${x.ok ? 'ok' : ''}">${ic(x.ok ? 'check-circle' : 'circle')}${x.n}</li>`).join('')}</ul></div>
  <div class="card"><h3>Analisis Job Description</h3><textarea id="jd" rows="6" placeholder="Tempel job description di sini" aria-label="Job description">${esc(jd)}</textarea><button class="btn pri" data-a="jd"><i data-lucide="search"></i>Analisis Keyword</button>
  ${j ? `<div class="jr"><div class="row"><b>Kecocokan keyword</b><b>${j.pct}%</b></div><div class="pb"><i style="width:${j.pct}%"></i></div><h4>Cocok</h4><div>${chips(j.m, 'ok')}</div><h4>Belum ada</h4><div>${chips(j.x, 'no')}</div><h4>Disarankan ditambahkan</h4><div>${chips(j.x.slice(0, 5), 'rec')}</div></div>` : ''}</div></div></div>`;
}

/* ---------- Editor ---------- */
const fld = (s, k, l, v, ty, i) => {
  const a = `data-s="${s}" data-k="${k}"${i != null ? ` data-i="${i}"` : ''}`;
  return ty === 't' ? `<label class="full">${l}<textarea ${a} rows="4">${esc(v)}</textarea></label>`
    : Array.isArray(ty) ? `<label>${l}<select ${a}><option value=""></option>${ty.map(o => `<option ${v == o ? 'selected' : ''}>${o}</option>`).join('')}</select></label>`
      : ty === 'n' ? `<label>${l}<select ${a}><option value="">Pilih level</option>${[1, 2, 3, 4, 5].map(n => `<option ${v == n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`
      : `<label>${l}<input ${a} value="${esc(v)}"></label>`;
};

function rEditor() {
  const c = cv(); if (!c) { go('dashboard'); return; }
  const p = c.personal, st = c.settings;
  const det = (id, n, t, body, extra = '') => `<details data-d="${id}" ${OPEN.has(id) ? 'open' : ''}><summary>${ic(n)}${t}<span class="sx">${extra}</span></summary><div class="body">${body}</div></details>`;
  const eye = k => `<button class="ib" data-a="vis" data-s="${k}" aria-label="Tampilkan atau sembunyikan bagian" title="Tampilkan/sembunyikan di CV">${ic(c.hide.includes(k) ? 'eye-slash' : 'eye')}</button>`;
  const list = k => {
    const D = SD[k];
    return det(k, D.i, D.l, c[k].map((it, i) => `<div class="item" data-s="${k}" data-i="${i}"><div class="ih"><i data-lucide="grip-vertical" class="grip"></i><b>${esc(it[D.t]) || 'Tanpa judul'}</b><span>${[['up', 'chevron-up', 'Naik'], ['down', 'chevron-down', 'Turun'], ['dup', 'copy', 'Duplikat'], ['rm', 'trash', 'Hapus']].map(([a, n, l]) => `<button class="ib" data-a="${a}" data-s="${k}" data-i="${i}" aria-label="${l}" title="${l}">${ic(n)}</button>`).join('')}</span></div><div class="fg">${D.f.map(([f, l, ty]) => fld(k, f, l, it[f] || '', ty, i)).join('')}</div></div>`).join('')
      + `<button class="btn" data-a="add" data-s="${k}"><i data-lucide="plus"></i>Tambah ${D.l}</button>`, `<span class="cnt">${c[k].length}</span>${eye(k)}`);
  };
  const rg = (k, l, min, max, step) => `<label>${l} <output>${st[k]}</output><input type="range" data-s="settings" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${st[k]}"></label>`;
  const pf = [['name', 'Nama lengkap'], ['title', 'Judul profesional'], ['email', 'Email'], ['phone', 'Telepon'], ['location', 'Lokasi'], ['website', 'Website'], ['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['target', 'Posisi yang dilamar (untuk ATS)']];
  const pct = comp(c).pct;
  $('#editor').innerHTML = `<div class="comp"><div class="row"><b>Kelengkapan CV</b><b id="cpct">${pct}%</b></div><div class="pb"><i id="cbar" style="width:${pct}%"></i></div></div>
  ${det('personal', 'person', 'Informasi Pribadi', `<div class="phb">${p.photo ? `<img src="${p.photo}" alt="Foto profil">` : '<span class="av"><i data-lucide="user"></i></span>'}<button class="btn" data-a="photo"><i data-lucide="upload"></i>Unggah</button><button class="btn" data-a="rmphoto" ${p.photo ? '' : 'disabled'}>Hapus</button><label class="chk"><input type="checkbox" data-s="settings" data-k="photo" ${st.photo ? 'checked' : ''}>Tampilkan</label><label class="chk"><input type="checkbox" data-s="settings" data-k="circle" ${st.circle ? 'checked' : ''}>Bulat</label></div><div class="fg">${pf.map(([k, l]) => fld('personal', k, l, p[k])).join('')}</div>`)}
  ${det('summary', 'card-text', 'Ringkasan Profesional', `<label class="full">Ringkasan<textarea data-s="summary" rows="5">${esc(c.summary)}</textarea></label><small class="mut" id="cc">${c.summary.length} karakter (ideal 150–500)</small>`, eye('summary'))}
  ${['experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'languages', 'organizations'].map(list).join('')}
  ${det('look', 'palette', 'Tampilan & Template', `<label>Template<select id="tplSel">${Object.entries(CATN).map(([k, n]) => `<optgroup label="${n}">${TPL.filter(t => t.cat === k).map(t => `<option value="${t.id}" ${t.id === c.template ? 'selected' : ''}>${t.name}</option>`).join('')}</optgroup>`).join('')}</select></label>
  <div class="sw">${PRE.map(([n, h]) => `<button class="swb ${st.primary === h ? 'on' : ''}" style="background:${h}" data-a="pre" data-c="${h}" aria-label="${n}" title="${n}"></button>`).join('')}<input type="color" data-s="settings" data-k="primary" value="${st.primary}" aria-label="Warna utama"></div>
  <label>Font<select data-s="settings" data-k="font">${FONTS.map(f => `<option ${f === st.font ? 'selected' : ''}>${f}</option>`).join('')}</select></label>
  ${rg('size', 'Ukuran font (pt)', 8, 13, .5)}${rg('line', 'Tinggi baris', 1.1, 1.9, .05)}${rg('margin', 'Margin halaman (mm)', 8, 24, 1)}${rg('gap', 'Jarak antar bagian (px)', 6, 28, 1)}
  <label class="chk"><input type="checkbox" data-s="settings" data-k="pageNum" ${st.pageNum ? 'checked' : ''}>Nomor halaman pada PDF</label>
  <button class="btn" data-a="reset"><i data-lucide="undo-2"></i>Reset tampilan</button>`)}`;
  paint();
}

function mv(d, n) {
  const a = cv()[d.s], i = +d.i, j = i + n; if (j < 0 || j >= a.length) return;
  hist(1); [a[i], a[j]] = [a[j], a[i]]; changed(); rEditor();
}
const afterEdit = () => { changed(); rEditor(); };

/* ---------- Aksi ---------- */
const A = {
  new() { const c = blank(); S.cvs.push(c); S.cur = c.id; S.undo = []; S.redo = []; note('CV baru dibuat'); OPEN.add('personal'); go('editor'); },
  edit(d) { S.cur = d.id; S.undo = []; S.redo = []; go('editor'); },
  cdup(d) { const c = JSON.parse(JSON.stringify(find(d.id))); c.id = uid(); c.name += ' (Salinan)'; c.updated = Date.now(); S.cvs.push(c); note('CV diduplikasi'); render(); },
  del(d) { const c = find(d.id); modal('Hapus CV', `Hapus "${esc(c.name)}"? Tindakan ini tidak dapat dibatalkan.`, 'Hapus', () => { S.cvs = S.cvs.filter(x => x.id !== c.id); if (S.cur === c.id) S.cur = S.cvs[0]?.id || null; note('CV dihapus', 'trash'); render(); }); },
  prev(d) { const c = find(d.id); modal(esc(c.name), `<div class="mprev"><div style="zoom:${pz()}">${renderCV(c)}</div></div>`, 'Edit CV', () => A.edit({ id: c.id }), 'wide'); },
  tprev(d) {
    const t = TPL.find(x => x.id === d.id);
    modal(t.name, `<div class="tags"><span class="bd">${CATN[t.cat]}</span>${t.ats ? '<span class="bd ok">ATS Friendly</span>' : ''}</div><div class="mprev"><div style="zoom:${pz()}">${renderCV({ ...prevCV(), template: t.id })}</div></div>`, 'Gunakan Template', () => A.use({ id: t.id }), 'wide');
  },
  use(d) {
    if (!cv()) { const c = blank(); c.template = d.id; S.cvs.push(c); S.cur = c.id; } else { hist(1); cv().template = d.id; changed(); }
    note('Template diganti: ' + tn(d.id), 'layout-text-window'); go('editor');
  },
  fav(d) { const i = S.fav.indexOf(d.id); i < 0 ? S.fav.push(d.id) : S.fav.splice(i, 1); save(); render(); },
  filt(d) { tf = d.k; rTpl(); },
  add(d) { hist(1); const o = {}; SD[d.s].f.forEach(([k]) => o[k] = ''); cv()[d.s].push(o); OPEN.add(d.s); afterEdit(); },
  rm(d) { hist(1); cv()[d.s].splice(+d.i, 1); afterEdit(); },
  dup(d) { hist(1); const a = cv()[d.s]; a.splice(+d.i + 1, 0, { ...a[+d.i] }); afterEdit(); },
  up(d) { mv(d, -1); }, down(d) { mv(d, 1); },
  vis(d) { hist(1); const h = cv().hide, i = h.indexOf(d.s); i < 0 ? h.push(d.s) : h.splice(i, 1); afterEdit(); },
  pre(d) { hist(1); cv().settings.primary = d.c; afterEdit(); },
  reset() { modal('Reset tampilan', 'Kembalikan semua pengaturan tampilan ke bawaan?', 'Reset', () => { hist(1); cv().settings = { ...DEF }; afterEdit(); note('Pengaturan direset', 'arrow-counterclockwise'); }); },
  photo() { $('#photoIn').click(); },
  rmphoto() { hist(1); cv().personal.photo = ''; afterEdit(); },
  undo() { if (cv()) { swap('undo', 'redo'); render(); } },
  redo() { if (cv()) { swap('redo', 'undo'); render(); } },
  zin() { zm = Math.min(1.5, zv() + .1); paint(); },
  zout() { zm = Math.max(.3, zv() - .1); paint(); },
  jd() { jd = $('#jd').value; rAts(); },
  share() {
    const c = cv(); if (!c) return;
    const u = `https://royalcvbuilder.app/s/${c.id}`;
    modal('Bagikan CV', `<p class="mut">Simulasi: tautan ini hanya contoh dan tidak mengunggah data ke server.</p><input id="mi" value="${u}" readonly aria-label="Tautan CV">`, 'Salin tautan', () => { navigator.clipboard?.writeText(u); toast('Tautan (simulasi) disalin', 'link-45deg'); });
  },
  print() { if (!cv()) return; $('#pr').innerHTML = renderCV(cv()); lcr(); setTimeout(() => print(), 60); },
  pdf() { pdf(); }
};

async function pdf() {
  const c = cv(); if (!c) return;
  const b = $('#pdfBtn'); b.disabled = true; b.innerHTML = ic('loader') + '<span>Memproses</span>'; lcr();
  const h = document.createElement('div'); h.style.cssText = 'position:fixed;left:-9999px;top:0;width:210mm';
  try {
    h.innerHTML = renderCV(c); document.body.append(h); lcr(); await document.fonts.ready;
    const root = h.firstChild, W = root.offsetWidth, PH = W * 297 / 210, H = root.scrollHeight, y0 = root.getBoundingClientRect().top;
    /* Titik potong halaman: awal bagian/artikel/poin di kolom utama, agar blok tidak terpotong di tengah */
    const main = root.querySelector('main') || root.querySelector('.one') || root;
    const ys = [...main.querySelectorAll('section, article, li')].filter(e => e.previousElementSibling && e.previousElementSibling.tagName !== 'H3' || e.tagName === 'SECTION').map(e => e.getBoundingClientRect().top - y0).sort((p, q) => p - q);
    const cuts = [0];
    while (H - cuts.at(-1) > PH + 1) { const s = cuts.at(-1), lim = s + PH; cuts.push([...ys].reverse().find(v => v <= lim && v > s + PH * .5) ?? lim); }
    cuts.push(H);
    const cn = await html2canvas(root, { scale: 2, useCORS: true, backgroundColor: '#fff' }), k = cn.width / W;
    const d = new window.jspdf.jsPDF('p', 'mm', 'a4'), n = cuts.length - 1;
    for (let i = 0; i < n; i++) {
      const sy = Math.round(cuts[i] * k), sh = Math.max(1, Math.round((cuts[i + 1] - cuts[i]) * k));
      const q = document.createElement('canvas'); q.width = cn.width; q.height = sh;
      q.getContext('2d').drawImage(cn, 0, sy, cn.width, sh, 0, 0, cn.width, sh);
      if (i) d.addPage();
      d.addImage(q.toDataURL('image/jpeg', .95), 'JPEG', 0, 0, 210, sh * 210 / cn.width);
      if (c.settings.pageNum) { d.setFontSize(8); d.setTextColor(120); d.text(`${i + 1} / ${n}`, 105, 291, { align: 'center' }); }
    }
    d.save((c.personal.name || c.name).trim().replace(/\s+/g, '-') + '-CV.pdf'); note('PDF berhasil dibuat', 'file-earmark-pdf');
  } catch (e) { console.error(e); toast('Gagal membuat PDF. Periksa koneksi internet.', 'exclamation-triangle'); }
  h.remove(); b.disabled = false; b.innerHTML = '<i data-lucide="download"></i><span>Unduh PDF</span>'; lcr();
}

/* ---------- Event ---------- */
document.addEventListener('click', e => {
  const sg = e.target.closest('.segb button');
  if (sg) { document.body.dataset.pane = sg.dataset.pane; syncSeg(); paint(); return; }
  if (e.target.closest('#navToggle')) { toggleNav(); return; }
  if (e.target.id === 'scrim') { closeNav(); return; }
  const m = e.target.closest('[data-m]');
  if (m) { const f = $('#modal')._fn; if (m.dataset.m === 'ok' && f?.() === false) return; closeModal(); return; }
  if (e.target.id === 'modal') return closeModal();
  const b = e.target.closest('[data-a],[data-go]'); if (!b) return;
  if (b.dataset.a) { e.preventDefault(); A[b.dataset.a]?.(b.dataset); return; }
  if (b.dataset.pane) document.body.dataset.pane = b.dataset.pane;
  const tip = b.closest('#side') && !document.body.classList.contains('nav-open');
  go(b.dataset.go); if (tip) navTip(b);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeNav(); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.thumb')) { e.preventDefault(); A[e.target.dataset.a](e.target.dataset); }
  if (e.key === 'Enter' && e.target.id === 'mi') $('#modal .pri')?.click();
  if (e.key === 'Enter' && e.target.id === 'cvName') e.target.blur();
  if (e.target.dataset?.rn) { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { e.target.value = find(e.target.dataset.rn).name; e.target.blur(); } }
  if (!(e.ctrlKey || e.metaKey)) return;
  const k = e.key.toLowerCase(), f = { s: () => { if (cv()) { save(); toast('CV disimpan'); } }, z: () => e.shiftKey ? A.redo() : A.undo(), p: A.print, e: pdf }[k];
  if (f) { e.preventDefault(); f(); }
});
document.addEventListener('toggle', e => { const d = e.target.dataset?.d; if (d) e.target.open ? OPEN.add(d) : OPEN.delete(d); }, true);
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'cvName') { if (!cv()) return; hist(); cv().name = t.value; changed(); return; }
  if (t.id === 'tq') { tq = t.value.toLowerCase(); tGrid(); return; }
  if (!t.dataset.s || !cv()) return;
  hist(); const c = cv(), s = t.dataset.s, k = t.dataset.k;
  const v = t.type === 'checkbox' ? t.checked : t.type === 'range' ? +t.value : t.value;
  if (s === 'summary') { c.summary = v; $('#cc').textContent = `${v.length} karakter (ideal 150–500)`; }
  else if (s === 'settings') c.settings[k] = v;
  else if (t.dataset.i != null) c[s][t.dataset.i][k] = v;
  else c[s][k] = v;
  if (t.type === 'range') t.parentNode.querySelector('output').textContent = v;
  changed(); paint();
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.rn) {
    const c = find(t.dataset.rn), v = t.value.trim();
    if (v && v !== c.name) { c.name = v; c.updated = Date.now(); if (c.id === S.cur) $('#cvName').value = v; note('Nama CV diperbarui'); } else t.value = c.name;
    return;
  }
  if (t.id === 'tplSel') A.use({ id: t.value });
  if (t.id === 'photoIn' && t.files[0] && cv()) {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const s = Math.min(im.width, im.height), q = document.createElement('canvas'); q.width = q.height = 320;
        q.getContext('2d').drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, 320, 320);
        hist(1); cv().personal.photo = q.toDataURL('image/jpeg', .85); afterEdit(); note('Foto profil diunggah', 'image');
      };
      im.src = r.result;
    };
    r.readAsDataURL(t.files[0]); t.value = '';
  }
});
/* Drag and drop: hanya lewat gagang (grip) agar teks di dalam input tetap bisa dipilih */
let dg = null;
const noDrag = () => $$('.item').forEach(i => i.draggable = false);
document.addEventListener('mousedown', e => { const g = e.target.closest?.('.grip'); if (g) g.closest('.item').draggable = true; });
document.addEventListener('mouseup', noDrag);
document.addEventListener('dragstart', e => { const it = e.target.closest?.('.item'); dg = it?.draggable ? { s: it.dataset.s, i: +it.dataset.i } : null; });
document.addEventListener('dragend', () => { dg = null; noDrag(); });
document.addEventListener('dragover', e => { if (dg && e.target.closest?.('.item')) e.preventDefault(); });
document.addEventListener('drop', e => {
  const it = e.target.closest?.('.item'); if (!dg || !it || it.dataset.s !== dg.s) return;
  e.preventDefault(); hist(1); const a = cv()[dg.s]; a.splice(+it.dataset.i, 0, a.splice(dg.i, 1)[0]); dg = null; afterEdit();
});
addEventListener('resize', () => paint());

function migrate() { S.cvs.forEach(c => { ['achievements', 'languages', 'organizations'].forEach(k => c[k] ??= []); if (!FONTS.includes(c.settings.font)) c.settings.font = DEF.font; }); }
load(); migrate(); go('dashboard');
