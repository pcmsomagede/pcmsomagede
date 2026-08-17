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
  heroImage: 'https://res.cloudinary.com/v6hqki7m/image/upload/f_auto,q_auto,w_1600/profil-1-1024x490',
};

export const navItems = [
  { label: 'Beranda', href: sitePath('/') },
  { label: 'Berita', href: sitePath('/berita') },
  { label: 'Kegiatan', href: sitePath('/kegiatan') },
  { label: 'Agenda', href: sitePath('/agenda') },
  { label: 'Organisasi', href: sitePath('/organisasi') },
  { label: 'Pimpinan', href: sitePath('/pimpinan') },
  { label: 'Galeri', href: sitePath('/galeri') },
  { label: 'Arsip', href: sitePath('/arsip') },
  { label: 'Kontak', href: sitePath('/kontak') },
];
