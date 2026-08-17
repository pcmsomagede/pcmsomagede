const base = import.meta.env.BASE_URL;
export const sitePath = (path = '/') => `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

export const site = {
  name: 'Pimpinan Cabang Muhammadiyah Somagede Kabupaten Banyumas',
  shortName: 'PC Muhammadiyah Somagede',
  chair: 'Drs. Bambang Budiarso',
  address: 'Masjid Darul Arqom Komplek SMK Muhammadiyah Somagede, Jl. Raya Somagede Km. 5, Kode Pos 53193',
  whatsapp: ['081542889595', '081391329139'],
  email: '',
  url: 'https://pcmsomagede.github.io/pcmsomagede/',
  description: 'Website resmi Pimpinan Cabang Muhammadiyah Somagede Kabupaten Banyumas sebagai pusat berita, kegiatan, agenda, dokumentasi, dan arsip digital.',
  heroImage: sitePath('/hero.webp'),
};

export const navItems = [
  { label: 'Beranda', icon: '⌂', href: sitePath('/') },
  { label: 'Berita', icon: '▤', href: sitePath('/berita') },
  { label: 'Kegiatan', icon: '✦', href: sitePath('/kegiatan') },
  { label: 'Agenda', icon: '▣', href: sitePath('/agenda') },
  { label: 'Organisasi', icon: '◎', href: sitePath('/organisasi') },
  { label: 'Pimpinan', icon: '♙', href: sitePath('/pimpinan') },
  { label: 'Galeri', icon: '▧', href: sitePath('/galeri') },
  { label: 'Arsip', icon: '▥', href: sitePath('/arsip') },
  { label: 'Kontak', icon: '⌕', href: sitePath('/kontak') },
];
