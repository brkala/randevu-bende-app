import type { ImgHTMLAttributes } from 'react';
import { clientEnv } from '@/features/shared/lib/client-env';

interface CdnImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fileKey: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
  responsiveWidths?: number[];
}

export function CdnImage({
  fileKey,
  width,
  height,
  quality = 75,
  format = 'auto',
  responsiveWidths,
  alt,
  ...props
}: CdnImageProps) {
  const baseUrl = clientEnv.VITE_R2_PUBLIC_DOMAIN.replace(/\/$/, '');

  const generateUrl = (w?: number, h?: number) => {
    if ((!w && !h) || !clientEnv.VITE_R2_RESIZING) {
      return `${baseUrl}/${fileKey}`;
    }

    const options = [
      w ? `width=${w}` : '',
      h ? `height=${h}` : '',
      `quality=${quality}`,
      `format=${format}`,
    ]
      .filter(Boolean)
      .join(',');

    return `${baseUrl}/cdn-cgi/image/${options}/${fileKey}`;
  };

  const src = generateUrl(width, height);

  let generatedSrcSet = props.srcSet;
  if (
    !generatedSrcSet &&
    responsiveWidths &&
    responsiveWidths.length > 0 &&
    clientEnv.VITE_R2_RESIZING
  ) {
    generatedSrcSet = responsiveWidths.map((w) => `${generateUrl(w)} ${w}w`).join(', ');
  }

  return (
    <img
      src={src}
      srcSet={generatedSrcSet}
      width={width}
      height={height}
      alt={alt ?? ''}
      {...props}
    />
  );
}
