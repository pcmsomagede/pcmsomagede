export type CmsContentType = 'berita' | 'kegiatan' | 'agenda';
export type CmsStatus = 'draft' | 'published';
export type CmsMediaType = 'image' | 'video' | 'audio' | 'document';

export interface CmsMedia {
  type: CmsMediaType;
  publicId: string;
  secureUrl: string;
  originalFilename?: string;
  resourceType?: string;
  format?: string;
}

export interface CmsRecord {
  id: string;
  type: CmsContentType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  date: string;
  updated: string;
  status: CmsStatus;
  tags: string[];
  location?: string;
  time?: string;
  media: CmsMedia[];
}

export const cmsDefaults: Record<CmsContentType, Partial<CmsRecord>> = {
  berita: {
    category: 'Organisasi',
    author: 'Pimpinan Cabang Muhammadiyah Somagede',
  },
  kegiatan: {
    category: 'Kegiatan',
    author: 'Pimpinan Cabang Muhammadiyah Somagede',
  },
  agenda: {
    category: 'Agenda',
    author: 'Pimpinan Cabang Muhammadiyah Somagede',
  },
};
