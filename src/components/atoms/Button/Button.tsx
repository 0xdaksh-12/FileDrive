import clsx from 'clsx';
import type { ButtonProps } from './ButtonProps';

export const Button = ({
  children,
  size = 'md',
  variant = 'primary',
  style = 'default',
  loading = false,
  disabled = false,
  onClick,
  className,
  type = 'button',
}: ButtonProps) => {
  const sizeMap = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const styleMap = {
    default: '',
    outline: 'btn-outline',
    soft: 'btn-soft',
    ghost: 'btn-ghost',
    link: 'btn-link',
  };

  const classes = clsx(
    'btn',
    `btn-${variant}`,
    sizeMap[size],
    styleMap[style],
    loading && 'loading',
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
