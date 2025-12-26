import clsx from 'clsx';
import type { AvatarProps } from './AvatarProps';

export const Avatar = ({
  name,
  email,
  src,
  size = 'sm',
  className,
}: AvatarProps) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const initials = name?.[0] || email?.[0] || 'U';

  return src ? (
    <img
      src={src}
      alt="Profile"
      className={clsx('rounded-full object-cover', sizeMap[size], className)}
    />
  ) : (
    <div className={clsx('avatar placeholder', className)}>
      <div
        className={clsx(
          'bg-base-300 text-base-content rounded-full flex items-center justify-center font-semibold uppercase',
          sizeMap[size]
        )}
      >
        {initials}
      </div>
    </div>
  );
};
