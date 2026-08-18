const base = import.meta.env.BASE_URL;
export const sitePath = (path = '/') => `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

export const site = {
  name: 'Pimpinan Cabang Muhammadiyah Somagede Kabupaten Banyumas',
  shortName: 'PC Muhammadiyah Somagede',
  address: 'Masjid Darul Arqom Komplek SMK Muhammadiyah Somagede, Jl. Raya Somagede Km. 5, Kode Pos 53193',
  whatsapp: ['081542889595', '081391329139'],
  email: 'pcmsomagede@gmail.com',
  url: 'https://pcmsomagede.github.io/',
  description: 'Website resmi Pimpinan Cabang Muhammadiyah Somagede Kabupaten Banyumas.',
  heroImage: '/hero.webp',
  ticker: 'Selamat Datang di website PCM Somagede, Hidup hidupilah Muhammadiyah carilah penghidupan yang layak untuk menghidupkan Muhammadiyah',
};

const QURAN_REF = 'https://www.pcmcepu.com/p/quranmu-muhammadiyah.html';
const PUSTAKA_REF = 'https://www.pcmcepu.com/p/pustaka-digital-download-naskah-khutbah.html';

export const navGroups = [
  { label: 'Beranda', icon: '⌂', href: sitePath('/'), items: [{ label: 'Selayang Pandang', href: sitePath('/#selayang-pandang') }, { label: 'Jejak Sejarah Muhammadiyah di Somagede', href: sitePath('/#sejarah-somagede') }] },
  { label: 'PustakaMu', icon: '✦', href: sitePath('/pustaka'), items: [
    { label: 'Arab Dasar → Mahir', href: sitePath('/pustaka#arab') },
    { label: 'Kitab Kuning', href: sitePath('/pustaka#kitab') },
    { label: 'BukuMu — Pustaka Digital', href: PUSTAKA_REF },
    { label: 'Al Qur’anMu — 114 Surah', href: QURAN_REF },
    { label: 'Khutbah & Kultum', href: PUSTAKA_REF },
    { label: 'HaditsMu — Referensi', href: PUSTAKA_REF }
  ]},
  { label: 'Organisasi', icon: '◎', href: sitePath('/organisasi'), items: [
    { label: 'Kajian Rutin', href: sitePath('/organisasi#kajian') },
    { label: 'Rapat Rutin', href: sitePath('/organisasi#rapat') },
    { label: 'Kartu Anggota Muhammadiyah', href: sitePath('/organisasi#anggota') },
    { label: 'Organisasi Otonom', href: sitePath('/organisasi#ortom') },
    { label: 'Profil Pimpinan', href: sitePath('/pimpinan') }
  ]},
  { label: 'ArsipMu', icon: '▥', href: sitePath('/arsip'), items: [
    { label: 'Surat Menyurat', href: sitePath('/arsip#surat') },
    { label: 'Surat Keluar', href: sitePath('/arsip#keluar') },
    { label: 'Surat Masuk', href: sitePath('/arsip#masuk') },
    { label: 'Surat Keputusan & Surat Tugas', href: sitePath('/arsip#keputusan') },
    { label: 'Notulensi', href: sitePath('/arsip#notulensi') },
    { label: 'Daftar & Sertifikat Wakaf', href: sitePath('/arsip#wakaf') },
    { label: 'Surat Aktif Organisasi', href: sitePath('/arsip#aktif-organisasi') },
    { label: 'Pedoman Surat Menyurat', href: sitePath('/arsip#pedoman') }
  ]},
  { label: 'KabarMu', icon: '▤', href: sitePath('/berita'), items: [
    { label: 'Berita', href: sitePath('/berita') },
    { label: 'Kegiatan', href: sitePath('/kegiatan') },
    { label: 'Agenda', href: sitePath('/agenda') }
  ]},
  { label: 'Kontak', icon: '⌕', href: sitePath('/kontak'), items: [
    { label: 'WhatsApp & Telepon', href: sitePath('/kontak#hubungi') },
    { label: 'SuaraMu', href: sitePath('/kontak#suaramu') }
  ]},
];
export const navItems = navGroups.map(({ label, icon, href }) => ({ label, icon, href }));
