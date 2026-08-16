export type CloudinaryMediaType = 'image' | 'video' | 'raw';

export interface CloudinaryAsset {
  publicId: string;
  type?: CloudinaryMediaType;
  format?: string;
  alt?: string;
  width?: number;
  height?: number;
}

const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';

export function cloudinaryConfigured() {
  return Boolean(cloudName);
}

export function cloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string; quality?: string; format?: string } = {},
) {
  if (!cloudName || !publicId) return '';

  const transformations = [
    options.width ? `w_${options.width}` : '',
    options.height ? `h_${options.height}` : '',
    options.crop ? `c_${options.crop}` : '',
    options.quality ? `q_${options.quality}` : 'q_auto',
    options.format ? `f_${options.format}` : 'f_auto',
  ].filter(Boolean).join(',');

  const extension = options.format && options.format !== 'auto' ? `.${options.format}` : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}${extension}`;
}

export function cloudinaryRawUrl(publicId: string) {
  if (!cloudName || !publicId) return '';
  return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
}

export function cloudinaryVideoUrl(publicId: string) {
  if (!cloudName || !publicId) return '';
  return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto/${publicId}`;
}
