/* 10 fitur tambahan di sidebar: 7 modul CRUD generik + Riwayat Versi, Backup & Impor, Pengaturan */
const FQ = {};
const STATUS = ['Dikirim', 'Screening', 'Wawancara', 'Penawaran', 'Diterima', 'Ditolak'];
const FX = {
  apps: { t: 'Pelacak Lamaran', i: 'briefcase-business', d: 'Catat lamaran kerja dan pantau statusnya.', f: [['company', 'Perusahaan'], ['role', 'Posisi'], ['status', 'Status', STATUS], ['date', 'Tanggal lamar', 'date'], ['link', 'Tautan lowongan'], ['note', 'Catatan', 't']], s: 'status', sub: ['role', 'date'], body: 'note' },
  letters: { t: 'Surat Lamaran', i: 'mail', d: 'Susun surat lamaran dan cetak langsung.', f: [['title', 'Judul surat'], ['company', 'Perusahaan'], ['body', 'Isi surat', 't']], sub: ['company'], body: 'body', x: [['print', 'printer', 'Cetak']] },
  jobs: { t: 'Lowongan Tersimpan', i: 'bookmark', d: 'Simpan job description dan lihat kecocokannya dengan CV aktif.', f: [['title', 'Posisi'], ['company', 'Perusahaan'], ['jd', 'Job description', 't']], sub: ['company'], body: 'jd', x: [['match', 'search', 'Analisis di ATS']] },
  bank: { t: 'Bank Poin', i: 'library', d: 'Kumpulkan poin pencapaian dan tambahkan ke CV.', f: [['text', 'Poin pencapaian', 't'], ['tag', 'Kategori', ['Teknis', 'Kepemimpinan', 'Hasil terukur', 'Kolaborasi', 'Lainnya']]], s: 'tag', x: [['use', 'file-plus', 'Tambah ke CV']] },
  ivs: { t: 'Jadwal Wawancara', i: 'calendar-clock', d: 'Atur jadwal wawancara dan catatannya.', f: [['company', 'Perusahaan'], ['when', 'Jadwal', 'dt'], ['kind', 'Jenis', ['Online', 'Onsite', 'Telepon']], ['link', 'Lokasi / tautan'], ['note', 'Catatan', 't']], s: 'kind', sub: ['when', 'link'], body: 'note' },
  refs: { t: 'Referensi', i: 'users', d: 'Simpan kontak referensi profesional.', f: [['name', 'Nama'], ['pos', 'Jabatan'], ['org', 'Instansi'], ['email', 'Email'], ['phone', 'Telepon']], sub: ['pos', 'org', 'email', 'phone'] },
  prep: { t: 'Persiapan Wawancara', i: 'messages-square', d: 'Siapkan jawaban untuk pertanyaan wawancara.', f: [['q', 'Pertanyaan'], ['a', 'Jawaban saya', 't'], ['cat', 'Kategori', ['Umum', 'Teknis', 'Perilaku', 'Gaji']]], s: 'cat', body: 'a' },
  vers: { t: 'Riwayat Versi', i: 'history', d: 'Simpan snapshot CV dan pulihkan kapan saja.' },
  backup: { t: 'Backup & Impor', i: 'database-backup', d: 'Simpan data ke file JSON atau pulihkan dari file.' },
  set: { t: 'Pengaturan', i: 'settings', d: 'Atur bawaan untuk CV baru dan sapaan dashboard.' }
};

const head = (id, btn = `<button class="btn pri" data-a="fx" data-f="${id}" data-o="add">${ic('plus')}Tambah</button>`) =>
  `<div class="head"><div><h2>${FX[id].t}</h2><p class="mut">${FX[id].d}</p></div>${btn}</div>`;
const fb = (id, o, i, l, x = '') => `<button class="ib" data-a="fx" data-f="${id}" data-o="${o}" data-id="${x}" aria-label="${l}" title="${l}">${ic(i)}</button>`;
const ftime = t => new Date(t).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

/* ----- CRUD generik ----- */
function fxView(id) {
  $('#v-' + id).innerHTML = `${head(id)}<div class="bar2"><input data-fq="${id}" type="search" placeholder="Cari…" value="${esc(FQ[id] || '')}" aria-label="Cari"></div><div id="fl-${id}" class="grid"></div>`;
  fxList(id);
}
function fxList(id) {
  const D = FX[id], q = FQ[id] || '', k0 = D.f[0][0];
  const a = S[id].filter(x => JSON.stringify(x).toLowerCase().includes(q));
  $('#fl-' + id).innerHTML = a.map(x => {
    const sub = (D.sub || []).map(k => String(x[k] || '').replace('T', ' ')).filter(Boolean).join(' · ');
    return `<div class="card fxc"><div class="row"><b>${esc(String(x[k0] || '').split('\n')[0]) || 'Tanpa judul'}</b>${D.s && x[D.s] ? `<span class="bd">${esc(x[D.s])}</span>` : ''}</div>${sub ? `<small class="mut">${esc(sub)}</small>` : ''}${D.body && x[D.body] && D.body !== k0 ? `<p>${esc(x[D.body])}</p>` : ''}${id === 'jobs' ? `<small>Kecocokan dengan CV aktif: <b>${cv() ? jdAnalyze(cv(), x.jd || '').pct + '%' : 'buat CV dulu'}</b></small>` : ''}<div class="ia"><span>${(D.x || []).map(([o, i, l]) => fb(id, o, i, l, x.id)).join('')}</span><span>${fb(id, 'edit', 'pencil', 'Edit', x.id)}${fb(id, 'dup', 'copy', 'Duplikat', x.id)}${fb(id, 'del', 'trash-2', 'Hapus', x.id)}</span></div></div>`;
  }).join('') || `<div class="empty">${ic('inbox')}<h2>Belum ada data</h2><p class="mut">Klik Tambah untuk membuat data pertama.</p></div>`;
}
const ff = (k, l, ty, v = '') => Array.isArray(ty)
  ? `<label>${l}<select data-ff="${k}">${ty.map(o => `<option ${o == v ? 'selected' : ''}>${o}</option>`).join('')}</select></label>`
  : ty === 't' ? `<label>${l}<textarea data-ff="${k}" rows="6">${esc(v)}</textarea></label>`
    : `<label>${l}<input data-ff="${k}" type="${ty === 'date' ? 'date' : ty === 'dt' ? 'datetime-local' : 'text'}" value="${esc(v)}"></label>`;
function fxForm(id, item, pre) {
  const D = FX[id], base = item || pre || {};
  modal((item ? 'Edit ' : 'Tambah ') + D.t, D.f.map(([k, l, ty]) => ff(k, l, ty, base[k] ?? '')).join(''), 'Simpan', () => {
    const o = {}; $$('#modal [data-ff]').forEach(e => o[e.dataset.ff] = e.value.trim());
    if (!o[D.f[0][0]]) { toast('Kolom pertama wajib diisi', 'triangle-alert'); return false; }
    if (item) Object.assign(item, o); else S[id].unshift({ id: uid(), ...o, at: Date.now() });
    note(D.t + ' disimpan'); fxView(id);
  });
}
const STD = {
  add: d => fxForm(d.f),
  edit: d => fxForm(d.f, S[d.f].find(x => x.id === d.id)),
  dup: d => { const a = S[d.f], i = a.findIndex(x => x.id === d.id); a.splice(i, 0, { ...a[i], id: uid() }); note('Data diduplikasi'); fxView(d.f); },
  del: d => modal('Hapus data', 'Hapus data ini? Tindakan ini tidak dapat dibatalkan.', 'Hapus', () => { S[d.f] = S[d.f].filter(x => x.id !== d.id); note('Data dihapus', 'trash-2'); fxView(d.f); })
};

/* ----- Aksi khusus per modul ----- */
const XA = {
  letters: {
    add: () => { const p = cv()?.personal || {}, n = p.name || '[Nama]'; fxForm('letters', null, { body: `Yth. Tim Rekrutmen,\n\nDengan hormat,\n\nSaya ${n}, tertarik melamar posisi ${p.target || p.title || '[Posisi]'} di perusahaan Bapak/Ibu. Dengan latar belakang ${p.title || '[bidang]'}, saya yakin dapat memberi kontribusi nyata.\n\nCV terlampir untuk pertimbangan. Terima kasih atas waktu dan kesempatan yang diberikan.\n\nHormat saya,\n${n}` }); },
    print: d => { const x = S.letters.find(i => i.id === d.id); $('#pr').innerHTML = `<div class="lt"><b>${esc(x.title)}</b>\n\n${esc(x.body)}</div>`; setTimeout(() => print(), 60); }
  },
  jobs: { match: d => { jd = S.jobs.find(x => x.id === d.id).jd || ''; go('ats'); } },
  bank: {
    use: d => {
      const c = cv(); if (!c) return toast('Buat CV terlebih dahulu', 'triangle-alert');
      const t = S.bank.find(x => x.id === d.id).text;
      const o = [...c.experience.map((e, i) => ['experience', i, (e.role || 'Pengalaman ' + (i + 1)) + ' (Pengalaman)']), ...c.projects.map((e, i) => ['projects', i, (e.name || 'Proyek ' + (i + 1)) + ' (Proyek)'])];
      if (!o.length) return toast('Tambahkan pengalaman atau proyek dulu', 'triangle-alert');
      modal('Tambah poin ke CV', `<label>Tujuan<select id="tg">${o.map((x, i) => `<option value="${i}">${esc(x[2])}</option>`).join('')}</select></label>`, 'Tambah', () => { const [s, i] = o[+$('#tg').value]; hist(1); const it = c[s][i]; it.desc = [it.desc, t].filter(Boolean).join('\n'); changed(); note('Poin ditambahkan ke CV'); });
    }
  },
  vers: {
    add: () => modal('Simpan versi', `<label>Nama versi<input id="mi" value="Versi ${S.vers.filter(v => v.cv === S.cur).length + 1}"></label>`, 'Simpan', () => {
      const c = cv(); S.vers.unshift({ id: uid(), cv: c.id, name: $('#mi').value.trim() || 'Versi', at: Date.now(), data: JSON.stringify(c) });
      const mine = S.vers.filter(v => v.cv === c.id); mine.slice(10).forEach(v => S.vers.splice(S.vers.indexOf(v), 1));
      note('Versi disimpan', 'history'); FR.vers();
    }),
    edit: d => { const v = S.vers.find(x => x.id === d.id); modal('Ganti nama versi', `<input id="mi" value="${esc(v.name)}" aria-label="Nama versi">`, 'Simpan', () => { v.name = $('#mi').value.trim() || v.name; save(); FR.vers(); }); },
    del: d => modal('Hapus versi', 'Hapus versi ini?', 'Hapus', () => { S.vers = S.vers.filter(x => x.id !== d.id); note('Versi dihapus', 'trash-2'); FR.vers(); }),
    restore: d => { const v = S.vers.find(x => x.id === d.id); modal('Pulihkan versi', `CV aktif akan diganti dengan "${esc(v.name)}". Anda masih bisa membatalkannya dengan Undo.`, 'Pulihkan', () => { hist(1); S.cvs[S.cvs.findIndex(x => x.id === S.cur)] = JSON.parse(v.data); changed(); save(); note('Versi dipulihkan', 'history'); }); }
  },
  backup: {
    exp: () => dl('royal-cv-builder-backup.json', JSON.stringify((({ undo, redo, ...d }) => d)(S))),
    expcv: () => cv() ? dl((cv().personal.name || cv().name).replace(/\s+/g, '-') + '-cv.json', JSON.stringify({ cvs: [cv()] })) : toast('Belum ada CV aktif', 'triangle-alert'),
    imp: () => $('#impIn').click(),
    wipe: () => modal('Hapus semua data', 'Semua CV dan data fitur akan dihapus permanen dari perangkat ini. Pertimbangkan membuat backup dulu.', 'Hapus semua', () => { Object.assign(S, S0()); localStorage.removeItem(KEY); toast('Semua data dihapus', 'trash-2'); go('dashboard'); })
  },
  set: { reset: () => { S.set = {}; save(); note('Pengaturan direset', 'undo-2'); FR.set(); } }
};
function dl(name, text) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' })); a.download = name; a.click(); URL.revokeObjectURL(a.href); toast('File diunduh', 'download'); }

/* ----- Tampilan khusus ----- */
FR.vers = () => {
  const c = cv(), el = $('#v-vers'); if (!c) { el.innerHTML = empty(); return; }
  const a = S.vers.filter(v => v.cv === c.id);
  el.innerHTML = `${head('vers', `<button class="btn pri" data-a="fx" data-f="vers" data-o="add">${ic('plus')}Simpan versi</button>`)}<div class="grid">${a.map(v => `<div class="card fxc"><b>${esc(v.name)}</b><small class="mut">${ftime(v.at)}</small><div class="ia"><span>${fb('vers', 'restore', 'history', 'Pulihkan', v.id)}</span><span>${fb('vers', 'edit', 'pencil', 'Ganti nama', v.id)}${fb('vers', 'del', 'trash-2', 'Hapus', v.id)}</span></div></div>`).join('') || '<div class="empty">' + ic('history') + '<h2>Belum ada versi</h2><p class="mut">Simpan versi sebelum melakukan perubahan besar. Maksimal 10 versi per CV.</p></div>'}</div>`;
};
FR.backup = () => {
  const kb = Math.round(JSON.stringify(localStorage).length / 1024), b = (o, i, t, cl = '') => `<button class="btn ${cl}" data-a="fx" data-f="backup" data-o="${o}">${ic(i)}${t}</button>`;
  $('#v-backup').innerHTML = `${head('backup', '')}<div class="grid"><div class="card"><b>Ekspor semua data</b><p class="mut">Seluruh CV dan data fitur dalam satu file JSON.</p>${b('exp', 'download', 'Ekspor semua', 'pri')}</div><div class="card"><b>Ekspor CV aktif</b><p class="mut">Hanya CV yang sedang dibuka.</p>${b('expcv', 'file-down', 'Ekspor CV')}</div><div class="card"><b>Impor dari file</b><p class="mut">Data dari file digabung tanpa menimpa data yang ada.</p>${b('imp', 'upload', 'Pilih file')}</div><div class="card"><b>Hapus semua data</b><p class="mut">Menghapus semuanya dari perangkat ini.</p>${b('wipe', 'trash-2', 'Hapus semua')}</div></div><p class="mut">Penyimpanan terpakai: ${kb} KB dari ±5.000 KB.</p>`;
};
FR.set = () => {
  const s = S.set;
  $('#v-set').innerHTML = `${head('set', '')}<div class="card" style="max-width:520px"><div class="mb"><label>Nama sapaan di dashboard<input data-sf="name" value="${esc(s.name || '')}"></label><label>Template bawaan CV baru<select data-sf="tpl">${TPL.map(t => `<option value="${t.id}" ${t.id === (s.tpl || 'ats') ? 'selected' : ''}>${t.name}</option>`).join('')}</select></label><label>Warna utama bawaan<input type="color" data-sf="color" value="${s.color || DEF.primary}"></label><div><button class="btn" data-a="fx" data-f="set" data-o="reset">${ic('undo-2')}Reset pengaturan</button></div></div></div>`;
};
Object.keys(FX).forEach(k => { if (!FR[k]) FR[k] = () => fxView(k); });

/* ----- Pasang ke UI ----- */
Object.keys(FX).forEach(k => { const s = document.createElement('section'); s.id = 'v-' + k; s.className = 'view fx'; s.setAttribute('aria-label', FX[k].t); $('#main').append(s); });
$('#side').insertAdjacentHTML('beforeend', '<div class="sl">Alat Karier</div>' + Object.entries(FX).map(([k, D]) => `<button data-go="${k}"><i data-lucide="${D.i}"></i><span>${D.t}</span></button>`).join(''));
document.body.insertAdjacentHTML('beforeend', '<input type="file" id="impIn" accept="application/json" hidden>');
Object.assign(A, {
  fx: d => (XA[d.f]?.[d.o] || STD[d.o])(d)
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.fq) { FQ[t.dataset.fq] = t.value.toLowerCase(); fxList(t.dataset.fq); }
  if (t.dataset.sf) { S.set[t.dataset.sf] = t.value; save(); }
});
document.addEventListener('change', e => {
  if (e.target.id !== 'impIn' || !e.target.files[0]) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result); if (!Array.isArray(d.cvs)) throw 0; let n = 0;
      ['cvs', 'apps', 'letters', 'jobs', 'bank', 'ivs', 'refs', 'prep', 'vers'].forEach(k => (d[k] || []).forEach(x => { if (x?.id && !S[k].some(y => y.id === x.id)) { S[k].push(x); n++; } }));
      S.cur ||= S.cvs[0]?.id; migrate(); save(); note(n + ' data diimpor', 'upload'); FR.backup();
    } catch { toast('File tidak valid', 'triangle-alert'); }
  };
  r.readAsText(e.target.files[0]); e.target.value = '';
});

/* Label & aksesibilitas tombol rail */
$$('#side button[data-go]').forEach(b => { const l = b.querySelector('span').textContent; b.title = l; b.setAttribute('aria-label', l); });

/* Ubah <i data-lucide> menjadi SVG setiap kali DOM berubah */
let lt;
const lr = () => { clearTimeout(lt); lt = setTimeout(lcr, 0); };
new MutationObserver(() => { if (document.querySelector('i[data-lucide]')) lr(); }).observe(document.body, { childList: true, subtree: true });
lr();
go(view);
