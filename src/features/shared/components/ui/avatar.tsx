import { Avatar as ArkAvatar, type AvatarRootProps } from '@ark-ui/react/avatar';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const avatarVariants = tv({
  slots: {
    root: 'relative inline-flex items-center justify-center rounded-full bg-bg-subtle overflow-hidden',
    image: 'w-full h-full object-cover',
    fallback: 'flex items-center justify-center w-full h-full text-fg-muted font-medium',
  },
  variants: {
    size: {
      sm: { root: 'w-8 h-8', fallback: 'text-xs' },
      md: { root: 'w-10 h-10', fallback: 'text-sm' },
      lg: { root: 'w-12 h-12', fallback: 'text-base' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface AvatarProps extends Omit<AvatarRootProps, 'size'>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const AvatarField = ({ size, src, alt, fallback, ...props }: AvatarProps) => {
  const { root, image, fallback: fallbackClass } = avatarVariants({ size });

  return (
    <ArkAvatar.Root className={root()} {...props}>
      <ArkAvatar.Image className={image()} src={src} alt={alt} />
      <ArkAvatar.Fallback className={fallbackClass()}>
        {fallback ? fallback.slice(0, 2).toUpperCase() : null}
      </ArkAvatar.Fallback>
    </ArkAvatar.Root>
  );
};
