/* State aplikasi, LocalStorage, dan riwayat undo/redo */
const KEY = 'cvforge.v1';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
/* Ubah <i data-lucide> menjadi SVG; atribut dilepas agar tidak diproses ulang */
const lcr = () => { window.lucide?.createIcons(); document.querySelectorAll('svg[data-lucide]').forEach(e => e.removeAttribute('data-lucide')); };
const uid = () => Math.random().toString(36).slice(2, 9);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const DEF = { primary: '#2563eb', font: 'Plus Jakarta Sans', size: 10.5, line: 1.45, margin: 14, gap: 14, photo: true, circle: true, pageNum: false };

const blank = (name = 'CV Baru') => ({
  id: uid(), name, created: Date.now(), updated: Date.now(), template: S.set?.tpl || 'ats', hide: [],
  personal: { name: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', photo: '' },
  summary: '', education: [], experience: [], skills: [], projects: [], certifications: [], achievements: [], languages: [], organizations: [],
  settings: { ...DEF, ...(S.set?.color ? { primary: S.set.color } : {}) }
});

function demo() {
  const c = blank('CV Fikar Royal');
  c.template = 'modern';
  c.personal = { name: 'Fikar Royal', title: 'Pengangguran Sukses', email: 'fikar.royal@email.com', phone: '+62 812-0000-0000', location: 'Yogyakarta, Indonesia', website: '', linkedin: 'linkedin.com/in/fikar-royal', github: 'github.com/fikar-royal', photo: '' };
  c.summary = 'Pengangguran sukses yang selalu produktif: membangun sistem RAG, LLM, dan pipeline machine learning dengan Python dan FastAPI. Terbiasa mengubah waktu luang menjadi layanan yang andal, terukur, dan siap produksi.';
  c.experience = [{ company: 'PT Teknologi Nusantara', role: 'AI Engineer Intern', start: 'Jan 2025', end: 'Jun 2025', desc: 'Membangun layanan RAG dengan FastAPI dan vector database\nMeningkatkan akurasi retrieval 18% lewat evaluasi dan tuning chunking\nMengemas layanan dengan Docker dan menulis dokumentasi API' }];
  c.education = [{ school: 'Universitas Amikom Yogyakarta', degree: 'Bachelor of Informatics', start: '2022', end: '2026', desc: 'IPK 3.80 / 4.00' }];
  c.skills = [['Python', 'Programming', 5], ['SQL', 'Programming', 4], ['Machine Learning', 'AI', 4], ['RAG', 'AI', 4], ['LLM', 'AI', 4], ['FastAPI', 'Tools', 4], ['Docker', 'Tools', 3]].map(([name, cat, level]) => ({ name, cat, level: String(level) }));
  c.projects = [
    { name: 'AI Recruitment System', role: 'Developer', tech: 'Python, FastAPI, scikit-learn', url: 'github.com/fikar-royal/ai-recruit', desc: 'Mencocokkan CV dengan lowongan memakai embedding\nMenyediakan skor kecocokan dan penjelasan per kandidat' },
    { name: 'RAG Knowledge Assistant', role: 'Developer', tech: 'LLM, RAG, Docker', url: '', desc: 'Asisten tanya jawab untuk dokumen internal\nMenampilkan sumber jawaban untuk tiap respons' },
    { name: 'Recommendation System', role: 'Developer', tech: 'Python, SQL', url: '', desc: 'Rekomendasi produk berbasis collaborative filtering' }
  ];
  c.certifications = [{ name: 'TensorFlow Developer Certificate', org: 'Google', date: '2025', cid: 'TF-123456', url: '' }];
  c.experience[0].location = 'Yogyakarta'; c.experience[0].type = 'Magang';
  c.education[0].field = 'Informatika'; c.education[0].gpa = '3.80 / 4.00'; c.education[0].desc = '';
  c.personal.target = 'Pengangguran Sukses';
  c.achievements = [{ title: 'Finalis Hackathon AI Nasional', date: '2025', desc: 'Membangun prototipe asisten RAG dalam 48 jam' }];
  c.languages = [{ name: 'Indonesia', level: 'Penutur asli' }, { name: 'Inggris', level: 'Mahir' }];
  c.organizations = [{ name: 'Komunitas AI Kampus', role: 'Koordinator Riset', period: '2023 – 2025', desc: 'Memimpin 12 anggota dalam kajian mingguan machine learning' }];
  return c;
}

const S0 = () => ({ cvs: [], cur: null, fav: [], log: [], undo: [], redo: [], apps: [], letters: [], jobs: [], bank: [], ivs: [], refs: [], prep: [], vers: [], set: {} });
const S = S0();
const cv = () => S.cvs.find(c => c.id === S.cur);

function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d) Object.assign(S, d); } catch { }
  if (!cv()) S.cur = S.cvs[0]?.id || null;
}

function save() {
  try { const { undo, redo, ...d } = S; localStorage.setItem(KEY, JSON.stringify(d)); return true; }
  catch { toast('Penyimpanan penuh. Gunakan foto yang lebih kecil.', 'exclamation-triangle'); return false; }
}

/* Riwayat: snapshot diambil sebelum perubahan; ketikan beruntun digabung per 800ms */
let lastHist = 0;
function hist(force) {
  const t = Date.now();
  if (force || t - lastHist > 800) { S.undo.push(JSON.stringify(cv())); if (S.undo.length > 30) S.undo.shift(); S.redo = []; }
  lastHist = t;
}
function swap(from, to) {
  if (!S[from].length) return;
  S[to].push(JSON.stringify(cv()));
  const i = S.cvs.findIndex(c => c.id === S.cur);
  S.cvs[i] = JSON.parse(S[from].pop());
  save();
}
