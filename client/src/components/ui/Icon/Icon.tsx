import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Icon.module.css';

interface BaseIconProps {
  /** The name of the Material Symbol ligature (e.g., 'search', 'close') */
  name: string;
}

export type InteractiveIconProps = BaseIconProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  };

export type DecorativeIconProps = BaseIconProps &
  React.HTMLAttributes<HTMLSpanElement> & {
    onClick?: never;
    disabled?: never;
  };

export type IconProps = InteractiveIconProps | DecorativeIconProps;

export const Icon = forwardRef<HTMLButtonElement | HTMLSpanElement, IconProps>(
  ({ name, className, ...props }, ref) => {
    if ('onClick' in props && props.onClick) {
      const {
        type = 'button',
        disabled,
        onClick,
        ...buttonProps
      } = props as InteractiveIconProps;
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type}
          className={clsx(styles.iconButton, 'material-symbols-outlined', className)}
          onClick={onClick}
          disabled={disabled}
          {...(buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {name}
        </button>
      );
    }

    const { ...spanProps } = props as DecorativeIconProps;
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={clsx('material-symbols-outlined', className)}
        {...(spanProps as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {name}
      </span>
    );
  },
);

Icon.displayName = 'Icon';
