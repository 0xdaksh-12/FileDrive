import React from 'react';
import { cn } from '@/lib/utils';
import { ICON_SIZES, type IconName, type IconSize } from '@/lib/constants';

export interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  ariaLabel?: string;
  decorative?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className,
  ariaLabel,
  decorative = false,
}) => (
  <span
    className={cn(
      'material-symbols-outlined inline-flex leading-none',
      ICON_SIZES[size],
      className
    )}
    aria-hidden={decorative}
    aria-label={decorative ? undefined : ariaLabel}
    role={decorative ? 'presentation' : undefined}
  >
    {name}
  </span>
);
