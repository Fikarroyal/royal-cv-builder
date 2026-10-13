/* ATS checker rule-based (lokal, tanpa AI/API), kelengkapan CV, dan analisis keyword */
const KW = 'python javascript typescript java sql docker kubernetes aws gcp azure git linux api rest react node fastapi django flask machine learning deep learning llm rag nlp tensorflow pytorch pandas ci/cd agile scrum postgresql mongodb'.split(' ');
const ACT = 'membangun mengembangkan memimpin merancang meningkatkan mengelola menganalisis membuat menerapkan mengoptimalkan menyusun mengurangi menciptakan mengimplementasikan mengkoordinasikan built developed led designed improved managed analyzed created implemented optimized reduced delivered launched deployed'.split(' ');
const SECS = ['experience', 'education', 'projects', 'certifications', 'skills', 'achievements', 'languages', 'organizations'];

const cvText = c => [c.summary, ...Object.values(c.personal).filter(v => !String(v).startsWith('data:')),
  ...SECS.flatMap(k => (c[k] || []).flatMap(o => Object.values(o)))].join(' ');

function comp(c) {
  const p = c.personal;
  const L = [['Informasi Pribadi', p.name && p.email && p.phone], ['Ringkasan', c.summary.length > 40], ['Pengalaman', c.experience.length],
    ['Pendidikan', c.education.length], ['Keahlian', c.skills.length >= 3], ['Proyek', c.projects.length], ['Sertifikasi', c.certifications.length],
    ['Prestasi', c.achievements?.length], ['Bahasa', c.languages?.length]]
    .map(([n, ok]) => ({ n, ok: !!ok }));
  return { L, pct: Math.round(L.filter(x => x.ok).length / L.length * 100) };
}

function ats(c) {
  const p = c.personal, tx = cvText(c).toLowerCase(), items = [...c.experience, ...c.projects];
  const lines = items.flatMap(x => (x.desc || '').split('\n').map(l => l.trim()).filter(Boolean));
  const withBullets = items.filter(x => (x.desc || '').split('\n').filter(l => l.trim()).length >= 2).length;
  const nums = lines.filter(l => /\d/.test(l)).length;
  const act = lines.filter(l => ACT.includes(l.split(/\s+/)[0].toLowerCase())).length;
  const hits = KW.filter(k => tx.includes(k)).length, words = tx.split(/\s+/).filter(Boolean).length;
  const sentences = c.summary.split(/[.!?]+/).filter(s => s.trim());
  const avgWords = sentences.length ? c.summary.split(/\s+/).length / sentences.length : 0;
  const L = c.summary.length, tpl = TPL.find(t => t.id === c.template);
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email || ''), phoneOk = (p.phone || '').replace(/\D/g, '').length >= 9;
  const showsPhoto = c.settings.photo && p.photo && tpl?.photo !== false;
  const pos = p.target || 'yang dilamar';
  const K = [
    ['Informasi Kontak', 12, Math.round([p.name, p.email, p.phone, p.location, p.linkedin || p.github].filter(Boolean).length * 12 / 5), 'Pastikan nama, email, telepon, lokasi, dan LinkedIn/GitHub tersedia.'],
    ['Ringkasan Profesional', 8, L >= 150 ? 8 : L >= 50 ? 5 : L ? 2 : 0, 'Tambahkan professional summary sepanjang 150–500 karakter.'],
    ['Pengalaman', 16, Math.min(c.experience.length, 2) * 5 + (c.experience.some(e => e.start) ? 3 : 0) + (c.experience.some(e => e.desc) ? 3 : 0), 'Tambahkan pengalaman lengkap dengan periode dan deskripsi.'],
    ['Pendidikan', 8, c.education.length ? (c.education.some(e => e.degree) ? 4 : 2) + (c.education.some(e => e.start || e.end) ? 2 : 0) + (c.education.some(e => e.field || e.gpa) ? 2 : 0) : 0, 'Lengkapi gelar, bidang studi, IPK, dan periode pendidikan.'],
    ['Keahlian', 12, Math.round(Math.min(c.skills.length, 8) * 12 / 8), 'Tambahkan minimal 8 skill yang relevan dengan posisi target.'],
    ['Proyek', 6, Math.min(c.projects.length, 2) * 3, 'Tambahkan minimal 2 proyek beserta teknologi yang dipakai.'],
    ['Keyword', 8, Math.round(Math.min(hits, 10) * .8), `Tambahkan lebih banyak keyword yang relevan dengan posisi ${pos}.`],
    ['Format Poin', 6, items.length ? Math.round(withBullets / items.length * 6) : 0, 'Gunakan bullet point (minimal 2 poin) pada pengalaman dan proyek.'],
    ['Keterbacaan', 4, sentences.length && avgWords <= 25 ? 4 : sentences.length ? 2 : 0, 'Gunakan kalimat singkat (maksimal 25 kata) pada ringkasan.'],
    ['Capaian Terukur', 6, lines.length ? Math.min(6, Math.round(nums / lines.length * 12)) : 0, 'Sertakan angka atau persentase pada pencapaian, misalnya "meningkatkan akurasi 18%".'],
    ['Kata Kerja Aksi', 4, lines.length ? Math.min(4, Math.round(act / lines.length * 8)) : 0, 'Awali poin dengan kata kerja aksi seperti "Membangun", "Memimpin", atau "Meningkatkan".'],
    ['Kontak & Format ATS', 5, (emailOk ? 2 : 0) + (phoneOk ? 1 : 0) + (showsPhoto ? 0 : 2), showsPhoto ? 'Foto dapat mengganggu ATS. Gunakan template ATS atau sembunyikan foto.' : 'Pastikan format email dan nomor telepon valid.'],
    ['Panjang CV', 5, words >= 250 && words <= 900 ? 5 : words >= 120 ? 3 : words ? 1 : 0, 'Isi CV idealnya 250–900 kata (sekitar 1–2 halaman).']
  ].map(([n, max, pts, tip]) => ({ n, max, pts: Math.min(max, pts), tip }));
  return { score: K.reduce((a, x) => a + x.pts, 0), items: K };
}

const STOP = new Set('dan atau yang untuk dengan the and for with you our are will have from this that your dari pada dalam akan kami anda minimal experience years work team ability strong good berpengalaman memiliki kemampuan mampu serta dapat sebagai'.split(' '));

function jdAnalyze(c, jd) {
  const tx = cvText(c).toLowerCase(), cnt = {};
  (jd.toLowerCase().match(/[a-z][a-z0-9+#.\/-]{2,}/g) || []).forEach(w => { w = w.replace(/[.\/-]+$/, ''); if (w.length > 2 && !STOP.has(w)) cnt[w] = (cnt[w] || 0) + 1; });
  const ks = Object.entries(cnt).sort((a, b) => b[1] - a[1] || KW.includes(b[0]) - KW.includes(a[0])).slice(0, 25).map(x => x[0]);
  const m = ks.filter(k => tx.includes(k)), x = ks.filter(k => !tx.includes(k));
  return { m, x, pct: ks.length ? Math.round(m.length / ks.length * 100) : 0 };
}
