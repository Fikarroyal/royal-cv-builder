/* Bagian CV, 50 template (layout + kelas komposisi di templates.css), dan renderer CV */
const LV = ['Pemula', 'Menengah', 'Mahir', 'Fasih', 'Penutur asli'];
const SD = {
  education: { l: 'Pendidikan', i: 'mortarboard', t: 'school', f: [['school', 'Institusi'], ['degree', 'Gelar'], ['field', 'Bidang studi'], ['gpa', 'IPK / GPA'], ['start', 'Mulai'], ['end', 'Selesai'], ['desc', 'Deskripsi', 't']] },
  experience: { l: 'Pengalaman', i: 'briefcase', t: 'role', f: [['role', 'Posisi'], ['company', 'Perusahaan'], ['location', 'Lokasi'], ['type', 'Tipe pekerjaan', ['Penuh waktu', 'Paruh waktu', 'Magang', 'Kontrak', 'Freelance']], ['start', 'Mulai'], ['end', 'Selesai'], ['desc', 'Deskripsi (satu poin per baris)', 't']] },
  skills: { l: 'Keahlian', i: 'lightning-charge', t: 'name', f: [['name', 'Nama skill'], ['cat', 'Kategori'], ['level', 'Level (1-5)', 'n']] },
  projects: { l: 'Proyek', i: 'kanban', t: 'name', f: [['name', 'Nama proyek'], ['role', 'Peran'], ['tech', 'Teknologi'], ['url', 'URL proyek'], ['github', 'URL GitHub'], ['date', 'Tanggal'], ['desc', 'Deskripsi (satu poin per baris)', 't']] },
  certifications: { l: 'Sertifikasi', i: 'patch-check', t: 'name', f: [['name', 'Sertifikasi'], ['org', 'Organisasi'], ['date', 'Tanggal'], ['cid', 'ID kredensial'], ['url', 'URL kredensial']] },
  achievements: { l: 'Prestasi', i: 'trophy', t: 'title', f: [['title', 'Judul'], ['date', 'Tanggal'], ['desc', 'Deskripsi', 't']] },
  languages: { l: 'Bahasa', i: 'languages', t: 'name', f: [['name', 'Bahasa'], ['level', 'Tingkat', LV]] },
  organizations: { l: 'Organisasi', i: 'users', t: 'name', f: [['name', 'Organisasi'], ['role', 'Posisi'], ['period', 'Periode'], ['desc', 'Deskripsi', 't']] }
};
const CATN = { ats: 'ATS', professional: 'Profesional', creative: 'Kreatif', academic: 'Akademik', tech: 'Tech', minimalist: 'Minimalis', elegant: 'Elegan' };

/* Urutan bagian: [kolom utama, kolom samping]. Layout 'one' menggabungkan keduanya. */
const ORD = {
  std: [['summary', 'experience', 'projects', 'education'], ['skills', 'certifications']],
  proj: [['summary', 'projects', 'experience', 'education'], ['skills', 'certifications']],
  edu: [['summary', 'education', 'experience', 'projects'], ['skills', 'certifications']],
  acad: [['summary', 'education', 'projects', 'certifications', 'experience'], ['skills']],
  cmp: [['summary', 'experience', 'projects'], ['skills', 'education', 'certifications']],
  all: [['summary', 'experience', 'education', 'projects', 'skills', 'certifications'], []],
  allp: [['summary', 'projects', 'experience', 'education', 'skills', 'certifications'], []],
  alla: [['summary', 'education', 'projects', 'certifications', 'experience', 'skills'], []]
};
const T = (id, name, cat, layout, ord, cls, o = {}) => {
  const [m, s] = ORD[ord], main = [...m, 'achievements', 'organizations'], side = [...s];
  (layout === 'one' ? main : side).push('languages');
  return { id, name, cat, layout, main, side, cls, ...o };
};
const AT = { ats: 1, photo: false };
const TPL = [
  /* ATS: satu kolom, tanpa ikon, tanpa foto */
  T('ats', 'ATS Classic', 'ats', 'one', 'all', 'hs-line nm-bold no-ic sk-line', { ...AT, bw: 1 }),
  T('ats-serif', 'ATS Serif', 'ats', 'one', 'all', 'hd-c hs-dbl fh-lora no-ic sk-line', { ...AT, bw: 1 }),
  T('ats-compact', 'ATS Compact', 'ats', 'one', 'all', 'dn-s hd-split hs-line no-ic sk-line', { ...AT, bw: 1 }),
  T('ats-bold', 'ATS Bold', 'ats', 'one', 'all', 'hs-bar nm-bold no-ic sk-line it-bar', AT),
  T('ats-clean', 'ATS Clean', 'ats', 'one', 'all', 'hd-line hs-plain no-ic sk-line', AT),
  T('ats-corp', 'ATS Corporate', 'ats', 'one', 'all', 'hd-band hs-line no-ic sk-line', AT),
  T('ats-line', 'ATS Garis Aksen', 'ats', 'one', 'all', 'hs-under it-bar no-ic sk-line', AT),
  T('ats-mono', 'ATS Mono', 'ats', 'one', 'all', 'nm-light hs-plain no-ic sk-line', { ...AT, bw: 1 }),
  /* Profesional */
  T('exec', 'Executive', 'professional', 'top', 'std', 'hd-band hs-line nm-bold fh-serif sb-light'),
  T('modern', 'Modern Professional', 'professional', 'left', 'std', 'sb-light it-bar sk-pill nm-pri hs-plain'),
  T('sidebar', 'Modern Sidebar', 'professional', 'left', 'std', 'sb-pri sk-bar hs-line nm-pri'),
  T('timeline', 'Timeline', 'professional', 'one', 'all', 'it-tl hs-pill sk-chip nm-bold'),
  T('compact', 'Compact One Page', 'professional', 'top', 'cmp', 'dn-s hd-split hs-line sk-chip sb-none', { ats: 1 }),
  T('corporate', 'Corporate Blue', 'professional', 'topL', 'std', 'hd-band hs-box sk-tag sb-tint'),
  T('pro-right', 'Professional Right', 'professional', 'right', 'std', 'sb-tint it-bar hs-bar sk-chip nm-bold'),
  T('manager', 'Manager', 'professional', 'top', 'std', 'hd-tint hs-bar it-bar sk-chip sb-none nm-pri'),
  T('consultant', 'Consultant', 'professional', 'one', 'all', 'hd-split hs-under it-top sk-line nm-bold'),
  T('business', 'Business', 'professional', 'left', 'edu', 'sb-navy hs-line sk-bar fh-sora'),
  T('fresh', 'Fresh Graduate', 'professional', 'top', 'edu', 'hd-c hs-pill it-card sk-chip sb-none'),
  T('career', 'Career Changer', 'professional', 'topL', 'std', 'hd-line hs-dot it-tl sk-pill sb-light'),
  /* Kreatif */
  T('creative', 'Creative Portfolio', 'creative', 'top', 'proj', 'hd-tint hs-dot it-card sk-pill nm-pri fh-sora sb-none'),
  T('portfolio', 'Portfolio Showcase', 'creative', 'left', 'proj', 'sb-tint it-card hs-pill sk-tag nm-bold fh-out'),
  T('designer', 'Designer', 'creative', 'right', 'proj', 'sb-sand it-bar hs-under sk-chip nm-light fh-sora'),
  T('bold-band', 'Bold Band', 'creative', 'one', 'allp', 'hd-band hs-box it-card sk-pill nm-caps'),
  T('color-block', 'Color Block', 'creative', 'topL', 'proj', 'hd-band sb-pri hs-line sk-chip'),
  T('studio', 'Studio', 'creative', 'one', 'allp', 'hd-c hs-under it-date sk-tag nm-light fh-out'),
  T('magazine', 'Magazine', 'creative', 'top', 'proj', 'hd-split hs-dbl fh-serif it-top sk-line nm-caps sb-none'),
  T('freelancer', 'Freelancer', 'creative', 'left', 'proj', 'sb-light hs-bar it-card sk-pill nm-pri'),
  /* Akademik */
  T('academic', 'Academic', 'academic', 'one', 'alla', 'hd-c hs-line fh-lora no-ic sk-line', { ...AT, bw: 1 }),
  T('scholar', 'Scholar', 'academic', 'one', 'alla', 'hd-line hs-serif fh-serif it-date sk-line nm-bold no-ic', AT),
  T('researcher', 'Researcher', 'academic', 'topL', 'acad', 'hs-bar fh-lora sb-light it-bar sk-chip'),
  T('lecturer', 'Lecturer', 'academic', 'one', 'alla', 'hd-split hs-under fh-lora it-top no-ic', AT),
  T('thesis', 'Thesis Formal', 'academic', 'one', 'alla', 'hd-c hs-dbl fh-serif no-ic sk-line', { ...AT, bw: 1 }),
  /* Tech */
  T('tech', 'Tech Resume', 'tech', 'left', 'std', 'sb-dark it-bar hs-line sk-bar nm-pri fh-sora'),
  T('dev', 'Developer', 'tech', 'left', 'std', 'sb-navy hs-bar sk-tag fh-sora nm-pri'),
  T('terminal', 'Terminal', 'tech', 'one', 'all', 'hd-dark hs-box sk-tag it-bar fh-sora'),
  T('data', 'Data Scientist', 'tech', 'topL', 'std', 'hd-band sb-dark hs-pill sk-chip it-card'),
  T('devops', 'DevOps', 'tech', 'right', 'std', 'sb-dark hs-line sk-bar it-tl nm-bold'),
  T('engineer', 'Engineer', 'tech', 'top', 'std', 'hd-line hs-box sk-tag it-bar sb-light fh-sora'),
  T('ai', 'AI Engineer', 'tech', 'left', 'std', 'sb-dark hs-dot sk-pill it-tl nm-bold fh-out'),
  /* Minimalis */
  T('minimal', 'Minimalist', 'minimalist', 'one', 'all', 'nm-light hs-plain no-ic sk-line dn-l', AT),
  T('whitespace', 'Whitespace', 'minimalist', 'one', 'all', 'nm-light hs-plain it-date sk-line no-ic dn-l', AT),
  T('garis-tipis', 'Garis Tipis', 'minimalist', 'one', 'all', 'hd-line hs-line nm-light no-ic sk-line', AT),
  T('nordic', 'Nordic', 'minimalist', 'left', 'std', 'sb-none hs-plain nm-light'),
  T('swiss', 'Swiss', 'minimalist', 'topL', 'std', 'hd-split hs-plain it-date sk-line sb-none nm-bold'),
  /* Elegan */
  T('elegant', 'Elegant', 'elegant', 'one', 'all', 'hd-c hs-serif fh-serif sk-line nm-light'),
  T('royal', 'Royal', 'elegant', 'left', 'std', 'sb-navy fh-serif hs-line nm-caps'),
  T('luxe', 'Luxe', 'elegant', 'top', 'std', 'hd-dark fh-serif hs-under sk-tag sb-sand nm-caps'),
  T('classic-serif', 'Classic Serif', 'elegant', 'right', 'std', 'sb-sand fh-serif hs-dbl nm-bold'),
  T('heritage', 'Heritage', 'elegant', 'one', 'all', 'hd-band fh-serif hs-serif it-tl sk-chip nm-bold')
];

const bl = t => { const a = (t || '').split('\n').map(x => x.trim()).filter(Boolean); return a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''; };
const per = (a, b) => [a, b].filter(Boolean).join(' – ');
const sec = (t, b) => `<section><h3>${t}</h3>${b}</section>`;
const lnk = (...a) => { a = a.filter(Boolean); return a.length ? `<div class="lnk">${a.map(esc).join(' · ')}</div>` : ''; };

const SEC = {
  summary: c => c.summary ? sec('Ringkasan', `<p>${esc(c.summary)}</p>`) : '',
  experience: c => c.experience.length ? sec('Pengalaman', c.experience.map(e => `<article><div class="row"><b>${esc(e.role)}</b><em>${esc(per(e.start, e.end))}</em></div><div class="sub">${esc([e.company, e.location, e.type].filter(Boolean).join(' · '))}</div>${bl(e.desc)}</article>`).join('')) : '',
  education: c => c.education.length ? sec('Pendidikan', c.education.map(e => `<article><div class="row"><b>${esc(e.school)}</b><em>${esc(per(e.start, e.end))}</em></div><div class="sub">${esc([e.degree, e.field].filter(Boolean).join(', '))}${e.gpa ? ' · IPK ' + esc(e.gpa) : ''}</div>${bl(e.desc)}</article>`).join('')) : '',
  projects: c => c.projects.length ? sec('Proyek', c.projects.map(p => `<article><div class="row"><b>${esc(p.name)}</b><em>${esc([p.role, p.date].filter(Boolean).join(' · '))}</em></div>${p.tech ? `<div class="sub">${esc(p.tech)}</div>` : ''}${bl(p.desc)}${lnk(p.url, p.github)}</article>`).join('')) : '',
  certifications: c => c.certifications.length ? sec('Sertifikasi', c.certifications.map(x => `<article><div class="row"><b>${esc(x.name)}</b><em>${esc(x.date)}</em></div><div class="sub">${esc([x.org, x.cid && 'ID ' + x.cid].filter(Boolean).join(' · '))}</div>${lnk(x.url)}</article>`).join('')) : '',
  skills: c => {
    if (!c.skills.length) return '';
    const g = {}; c.skills.forEach(s => (g[s.cat || 'Keahlian'] ??= []).push(s));
    return sec('Keahlian', Object.entries(g).map(([k, a]) => `<div class="sg"><h4>${esc(k)}</h4>${a.map(s => `<span class="sk">${esc(s.name)}${s.level ? `<i class="bar"><u style="width:${s.level * 20}%"></u></i>` : ''}</span>`).join('')}</div>`).join(''));
  },
  achievements: c => c.achievements.length ? sec('Prestasi', c.achievements.map(a => `<article><div class="row"><b>${esc(a.title)}</b><em>${esc(a.date)}</em></div>${bl(a.desc)}</article>`).join('')) : '',
  organizations: c => c.organizations.length ? sec('Organisasi', c.organizations.map(o => `<article><div class="row"><b>${esc(o.name)}</b><em>${esc(o.period)}</em></div><div class="sub">${esc(o.role)}</div>${bl(o.desc)}</article>`).join('')) : '',
  languages: c => c.languages.length ? sec('Bahasa', c.languages.map(l => `<div class="row lg"><span>${esc(l.name)}</span><em>${esc(l.level)}</em></div>`).join('')) : ''
};

const CT = [['email', 'mail'], ['phone', 'phone'], ['location', 'map-pin'], ['website', 'globe'], ['linkedin', 'link'], ['github', 'git-branch']];
const contact = p => `<div class="ct">${CT.filter(([k]) => p[k]).map(([k, i]) => `<span><i class="ic" data-lucide="${i}"></i>${esc(p[k])}</span>`).join('')}</div>`;

/* Turunan warna: tint transparan dan versi terang (tanpa color-mix agar aman untuk html2canvas) */
const rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) || 0); };
const tint = (h, a) => `rgba(${rgb(h).join(',')},${a})`;
const light = (h, k) => `rgb(${rgb(h).map(v => Math.round(v + (255 - v) * k)).join(',')})`;

function renderCV(c) {
  const t = TPL.find(x => x.id === c.template) || TPL[0], s = c.settings, p = c.personal, L = t.layout;
  const pc = t.bw ? '#111827' : s.primary;
  const m = k => c.hide.includes(k) ? '' : SEC[k](c);
  const M = t.main.map(m).join(''), Sd = t.side.map(m).join('');
  const ph = s.photo && t.photo !== false && p.photo ? `<img class="ph" src="${p.photo}" alt="Foto profil">` : '';
  const nm = `<div class="nb"><h1>${esc(p.name || 'Nama Lengkap')}</h1><p class="ttl">${esc(p.title || 'Posisi Profesional')}</p></div>`;
  const hd = `<header class="hd">${ph}<div>${nm}${contact(p)}</div></header>`;
  const side = `<aside>${ph}${contact(p)}${Sd}</aside>`;
  const h = L === 'left' ? `${side}<main>${nm}${M}</main>`
    : L === 'right' ? `<main>${nm}${M}</main>${side}`
      : L === 'top' ? `${hd}<div class="cols"><main>${M}</main><aside>${Sd}</aside></div>`
        : L === 'topL' ? `${hd}<div class="cols"><aside>${Sd}</aside><main>${M}</main></div>`
          : `${hd}<div class="one">${M}${Sd}</div>`;
  return `<div class="cv l-${L} ${t.cls}" style="--p:${pc};--p10:${tint(pc, .1)};--p20:${tint(pc, .24)};--pl:${light(pc, .55)};--f:'${s.font}';--fs:${s.size}pt;--lh:${s.line};--m:${s.margin}mm;--g:${s.gap}px;--pr:${s.circle ? '50%' : '6px'}">${h}</div>`;
}
