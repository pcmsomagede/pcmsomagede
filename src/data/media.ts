export const mediaFolders = {
  berita: 'pcmsomagede/berita',
  kegiatan: 'pcmsomagede/kegiatan',
  agenda: 'pcmsomagede/agenda',
  organisasi: 'pcmsomagede/organisasi',
  pimpinan: 'pcmsomagede/pimpinan',
  galeri: 'pcmsomagede/galeri',
  poster: 'pcmsomagede/poster',
  dokumen: 'pcmsomagede/dokumen',
} as const;

export type MediaFolder = keyof typeof mediaFolders;

export interface MediaRecord {
  id: string;
  publicId: string;
  folder: MediaFolder;
  title: string;
  alt: string;
  year: number;
  tags: string[];
  resourceType: 'image' | 'video' | 'raw';
}

// Registry metadata stays in GitHub; binary media stays in Cloudinary.
export const mediaRegistry: MediaRecord[] = [];

export const archiveCategories = [
  { slug: 'berita', label: 'Berita & Artikel', folder: mediaFolders.berita },
  { slug: 'kegiatan', label: 'Dokumentasi Kegiatan', folder: mediaFolders.kegiatan },
  { slug: 'agenda', label: 'Agenda & Pengumuman', folder: mediaFolders.agenda },
  { slug: 'organisasi', label: 'Dokumen Organisasi', folder: mediaFolders.organisasi },
  { slug: 'pimpinan', label: 'Dokumentasi Pimpinan', folder: mediaFolders.pimpinan },
  { slug: 'galeri', label: 'Galeri Foto & Video', folder: mediaFolders.galeri },
  { slug: 'poster', label: 'Poster & Publikasi', folder: mediaFolders.poster },
  { slug: 'dokumen', label: 'Dokumen / PDF', folder: mediaFolders.dokumen },
] as const;
