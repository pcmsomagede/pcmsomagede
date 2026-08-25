import menu from './menu.json';

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

export type NavItem = { label:string; href:string };
export type NavGroup = { label:string; icon:string; href:string; items:NavItem[] };
export const navGroups: NavGroup[] = menu.map((group:any) => ({
  label: String(group.label), icon: String(group.icon || '•'), href: sitePath(String(group.href || '/')),
  items: Array.isArray(group.items) ? group.items.map((item:any) => ({ label:String(item.label), href:sitePath(String(item.href || '/')) })) : []
}));
export const navItems = navGroups.map(({ label, icon, href }) => ({ label, icon, href }));
