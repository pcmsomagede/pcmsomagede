export type CloudinaryMediaType = 'image' | 'video' | 'raw';

export interface CloudinaryAsset {
  publicId: string;
  type?: CloudinaryMediaType;
  format?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export const CLOUDINARY_CLOUD_NAME = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'v6hqki7m';

export const CLOUDINARY_PRESETS = {
  image: import.meta.env.PUBLIC_CLOUDINARY_IMAGE_PRESET ?? 'pcmsomagede_image',
  video: import.meta.env.PUBLIC_CLOUDINARY_VIDEO_PRESET ?? 'pcmsomagede_video',
  audio: import.meta.env.PUBLIC_CLOUDINARY_AUDIO_PRESET ?? 'pcmsomagede_audio',
  document: import.meta.env.PUBLIC_CLOUDINARY_DOCUMENT_PRESET ?? 'pcmsomagede_document',
} as const;

export function cloudinaryConfigured() {
  return Boolean(CLOUDINARY_CLOUD_NAME);
}

export function cloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string; quality?: string; format?: string } = {},
) {
  if (!CLOUDINARY_CLOUD_NAME || !publicId) return '';

  const transformations = [
    options.width ? `w_${options.width}` : '',
    options.height ? `h_${options.height}` : '',
    options.crop ? `c_${options.crop}` : '',
    options.quality ? `q_${options.quality}` : 'q_auto',
    options.format ? `f_${options.format}` : 'f_auto',
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}

export function cloudinaryRawUrl(publicId: string) {
  if (!CLOUDINARY_CLOUD_NAME || !publicId) return '';
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`;
}

export function cloudinaryVideoUrl(publicId: string) {
  if (!CLOUDINARY_CLOUD_NAME || !publicId) return '';
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto/${publicId}`;
}

export function cloudinaryAudioUrl(publicId: string) {
  if (!CLOUDINARY_CLOUD_NAME || !publicId) return '';
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/q_auto/${publicId}`;
}
