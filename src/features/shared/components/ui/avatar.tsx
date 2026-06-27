import { Avatar as ArkAvatar, type AvatarRootProps } from '@ark-ui/react/avatar';
import { tv } from '@/features/style/utils/tv';

const avatarStyles = tv({
  slots: {
    root: 'relative inline-flex items-center justify-center rounded-full bg-bg-subtle overflow-hidden',
    image: 'w-full h-full object-cover',
    fallback: 'flex items-center justify-center w-full h-full text-fg-muted font-medium',
  },
});

interface AvatarProps extends AvatarRootProps {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const AvatarField = ({ src, alt, fallback, className, ...props }: AvatarProps) => {
  const { root, image, fallback: fallbackClass } = avatarStyles();

  return (
    <ArkAvatar.Root className={root({ className })} {...props}>
      <ArkAvatar.Image className={image()} src={src} alt={alt} />
      <ArkAvatar.Fallback className={fallbackClass()}>
        {fallback ? fallback.slice(0, 2).toUpperCase() : null}
      </ArkAvatar.Fallback>
    </ArkAvatar.Root>
  );
};
