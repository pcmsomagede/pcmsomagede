import { sitePath } from './site';

export type ContentStatus = 'draft' | 'published';

export interface Article { slug:string; title:string; date:string; updated?:string; category:string; author:string; excerpt:string; image:string; body:string[]; tags:string[]; status:ContentStatus; media?:string[] }
export interface Activity { slug:string; title:string; date:string; category:string; description:string; image?:string; gallery?:string[]; status:ContentStatus }
export interface AgendaItem { slug:string; title:string; date:string; time:string; location:string; description:string; image?:string; status:ContentStatus }

const fallbackNews: Article[] = [
  { slug:'selamat-datang-di-website-resmi-pc-muhammadiyah-somagede', title:'Selamat Datang di Website Resmi PC Muhammadiyah Somagede', date:'2026-08-16', category:'Organisasi', author:'Pimpinan Cabang Muhammadiyah Somagede', excerpt:'Website ini disiapkan sebagai pusat informasi publik, dokumentasi kegiatan, dan arsip digital Pimpinan Cabang Muhammadiyah Somagede.', image:sitePath('/logo.webp'), body:['Website resmi Pimpinan Cabang Muhammadiyah Somagede Kabupaten Banyumas hadir sebagai ruang informasi dan dokumentasi digital persyarikatan.','Ke depan, halaman ini akan memuat berita, kegiatan, agenda, publikasi, galeri, serta arsip organisasi yang tersusun berdasarkan kategori dan tahun.','Pengelolaan media dipisahkan dari kode website. Foto, video, dan dokumen akan disimpan di Cloudinary, sedangkan metadata dan struktur konten tetap tercatat di repository GitHub.'], tags:['website','organisasi','muhammadiyah'], status:'published' },
  { slug:'arsip-digital-pc-muhammadiyah-somagede', title:'Membangun Arsip Digital Persyarikatan yang Rapi', date:'2026-08-16', category:'Publikasi', author:'Pimpinan Cabang Muhammadiyah Somagede', excerpt:'Arsip digital akan disusun berdasarkan jenis dokumen, kegiatan, dan tahun untuk memudahkan pencarian kembali.', image:sitePath('/logo.webp'), body:['Arsip merupakan bagian penting dari keberlanjutan organisasi. Sistem website ini disiapkan agar dokumentasi dapat ditemukan kembali dengan mudah.','Foto, poster, dan dokumen akan dikelola melalui penyimpanan media terpisah, sementara metadata dan struktur konten tetap tercatat di repository.'], tags:['arsip','dokumentasi','digital'], status:'published' },
  { slug:'portal-informasi-dan-komunikasi-publik', title:'Portal Informasi dan Komunikasi Publik', date:'2026-08-16', category:'Website', author:'Pimpinan Cabang Muhammadiyah Somagede', excerpt:'Website PC Muhammadiyah Somagede dikembangkan dengan pendekatan ringan, responsif, dan mudah dipelihara.', image:sitePath('/logo.webp'), body:['Website dirancang untuk perangkat desktop maupun telepon genggam. Struktur halaman dibuat sederhana agar pengunjung dapat menemukan informasi penting dengan cepat.','Tahap berikutnya adalah panel editor sehingga pengurus dapat memperbarui konten tanpa harus memahami kode program.'], tags:['website','komunikasi','publik'], status:'published' }
];

const fallbackActivities: Activity[] = [
  { slug:'dokumentasi-kegiatan', title:'Dokumentasi Kegiatan', date:'2026-08-16', category:'Dokumentasi', description:'Kumpulan foto dan media kegiatan PC Muhammadiyah Somagede.', status:'published' },
  { slug:'publikasi-persyarikatan', title:'Publikasi Persyarikatan', date:'2026-08-16', category:'Publikasi', description:'Poster, pengumuman, dan materi publikasi organisasi.', status:'published' },
  { slug:'program-organisasi', title:'Program Organisasi', date:'2026-08-16', category:'Organisasi', description:'Informasi program kerja dan aktivitas majelis atau lembaga.', status:'published' }
];
const fallbackAgenda: AgendaItem[] = [{ slug:'agenda-akan-diumumkan', title:'Agenda akan diumumkan', date:'', time:'', location:'', description:'Belum ada agenda publik yang dimasukkan. Data agenda akan dikelola melalui sistem konten.', status:'published' }];

const files = import.meta.glob('../content/**/*.json', { eager:true, import:'default' }) as Record<string, any>;
const published = Object.values(files).filter((item) => item?.status === 'published');
const bodyArray = (body: unknown) => Array.isArray(body) ? body.map(String) : String(body || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
const mediaUrls = (media: unknown) => Array.isArray(media) ? media.map((m:any) => typeof m === 'string' ? m : m?.secureUrl).filter(Boolean) : [];

const externalNews: Article[] = published.filter((x) => x.type === 'berita').map((x) => ({ ...x, image: x.image || mediaUrls(x.media)[0] || sitePath('/logo.webp'), body: bodyArray(x.body), tags: Array.isArray(x.tags) ? x.tags : [], status:'published' }));
const externalActivities: Activity[] = published.filter((x) => x.type === 'kegiatan').map((x) => ({ ...x, description: x.description || x.excerpt || '', status:'published' }));
const externalAgenda: AgendaItem[] = published.filter((x) => x.type === 'agenda').map((x) => ({ ...x, description: x.description || x.excerpt || '', status:'published' }));

export const news: Article[] = [...externalNews, ...fallbackNews.filter((item) => !externalNews.some((x) => x.slug === item.slug))];
export const activities: Activity[] = [...externalActivities, ...fallbackActivities.filter((item) => !externalActivities.some((x) => x.slug === item.slug))];
export const agenda: AgendaItem[] = [...externalAgenda, ...fallbackAgenda.filter((item) => !externalAgenda.some((x) => x.slug === item.slug))];

export const leaders = [
  { name:'Drs. Bambang Budiarso', role:'Ketua Pimpinan Cabang Muhammadiyah Somagede' },
  { name:'—', role:'Sekretaris · data akan dilengkapi' },
  { name:'—', role:'Bendahara · data akan dilengkapi' }
];
export const archiveYears = ['2026','2025','2024'];
