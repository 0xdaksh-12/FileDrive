import type { ReactNode } from 'react';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type ButtonStyle = 'default' | 'outline' | 'soft' | 'ghost' | 'link';

export interface ButtonProps {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  style?: ButtonStyle;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}
