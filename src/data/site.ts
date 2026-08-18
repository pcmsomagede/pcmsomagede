const base = import.meta.env.BASE_URL;
export const sitePath = (path = '/') => `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

export const site = {
  name: 'Pimpinan Cabang Muhammadiyah Somagede Kabupaten Banyumas',
  shortName: 'PC Muhammadiyah Somagede',
  address: 'Masjid Darul Arqom Komplek SMK Muhammadiyah Somagede, Jl. Raya Somagede Km. 5, Kode Pos 53193',
  whatsapp: ['081542889595', '081391329139'],
  email: '',
  url: 'https://pcmsomagede.github.io/',
  description: 'Website resmi Pimpinan Cabang Muhammadiyah Somagede Kabupaten Banyumas.',
  heroImage: 'https://res.cloudinary.com/v6hqki7m/image/upload/f_auto,q_auto,w_1600/profil-1-1024x490',
  ticker: 'Selamat Datang di website PCM Somagede, Hidup hidupilah Muhammadiyah carilah penghidupan yang layak untuk menghidupkan Muhammadiyah',
};

export const navGroups = [
  {
    label: 'Beranda',
    icon: '⌂',
    href: sitePath('/'),
    items: [{ label: 'Selayang Pandang', href: sitePath('/#selayang-pandang') }],
  },
  {
    label: 'PustakaMu',
    icon: '✦',
    href: sitePath('/pustaka'),
    items: [
      { label: 'Arab Dasar → Mahir', href: sitePath('/pustaka#arab') },
      { label: 'Kitab Kuning', href: sitePath('/pustaka#kitab') },
      { label: 'BukuMu', href: sitePath('/pustaka#bukumu') },
      { label: 'Al Qur’anMu', href: sitePath('/pustaka#quranmu') },
      { label: 'HaditsMu', href: sitePath('/pustaka#haditsmu') },
    ],
  },
  {
    label: 'Organisasi',
    icon: '◎',
    href: sitePath('/organisasi'),
    items: [
      { label: 'Kajian Rutin', href: sitePath('/organisasi#kajian') },
      { label: 'Rapat Rutin', href: sitePath('/organisasi#rapat') },
      { label: 'Kartu Anggota Muhammadiyah', href: sitePath('/organisasi#anggota') },
      { label: 'Organisasi Otonom', href: sitePath('/organisasi#ortom') },
      { label: 'Profil Pimpinan', href: sitePath('/pimpinan') },
    ],
  },
  {
    label: 'ArsipMu',
    icon: '▥',
    href: sitePath('/arsip'),
    items: [
      { label: 'Surat Menyurat', href: sitePath('/arsip#surat') },
      { label: 'Surat Keluar', href: sitePath('/arsip#keluar') },
      { label: 'Surat Masuk', href: sitePath('/arsip#masuk') },
      { label: 'Pedoman Surat Menyurat', href: sitePath('/arsip#pedoman') },
    ],
  },
  {
    label: 'KabarMu',
    icon: '▤',
    href: sitePath('/berita'),
    items: [
      { label: 'Berita', href: sitePath('/berita') },
      { label: 'Kegiatan', href: sitePath('/kegiatan') },
      { label: 'Agenda', href: sitePath('/agenda') },
    ],
  },
  {
    label: 'Kontak',
    icon: '⌕',
    href: sitePath('/kontak'),
    items: [
      { label: 'WhatsApp & Telepon', href: sitePath('/kontak#hubungi') },
      { label: 'SuaraMu', href: sitePath('/kontak#suaramu') },
    ],
  },
];

export const navItems = navGroups.map(({ label, icon, href }) => ({ label, icon, href }));
