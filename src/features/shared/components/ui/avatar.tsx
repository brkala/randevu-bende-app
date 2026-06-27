import { Avatar as ArkAvatar, type AvatarRootProps } from '@ark-ui/react/avatar';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const avatarStyles = tv({
  slots: {
    root: 'relative inline-flex items-center justify-center overflow-hidden',
    image: 'w-full h-full object-cover',
    fallback: 'flex items-center justify-center w-full h-full text-fg-muted font-medium',
  },
  variants: {
    variant: {
      circle: { root: 'rounded-full' },
      square: { root: 'rounded-l2' },
    },
  },
  defaultVariants: {
    variant: 'circle',
  },
});

interface AvatarProps extends AvatarRootProps, VariantProps<typeof avatarStyles> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const AvatarField = ({ src, alt, fallback, variant, className, ...props }: AvatarProps) => {
  const { root, image, fallback: fallbackClass } = avatarStyles({ variant });

  return (
    <ArkAvatar.Root className={root({ className })} {...props}>
      <ArkAvatar.Image className={image()} src={src} alt={alt} />
      <ArkAvatar.Fallback className={fallbackClass()}>
        {fallback ? fallback.slice(0, 2).toUpperCase() : null}
      </ArkAvatar.Fallback>
    </ArkAvatar.Root>
  );
};
