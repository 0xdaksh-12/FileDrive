import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  /** Applies red border and error focus ring */
  error?: boolean;
  /** Controls padding and font size */
  size?: 'sm' | 'md' | 'lg';
  /** Icon element to display on the left */
  leftIcon?: React.ReactNode;
  /** Icon element to display on the right */
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, size = 'md', leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className={clsx(styles.wrapper, className)}>
        {leftIcon && (
          <div className={clsx(styles.iconWrapper, styles.leftIcon)}>{leftIcon}</div>
        )}
        <input
          ref={ref}
          className={clsx(
            styles.input,
            styles[`size-${size}`],
            error && styles['input-error'],
            leftIcon && styles.hasLeftIcon,
            rightIcon && styles.hasRightIcon,
          )}
          {...props}
        />
        {rightIcon && (
          <div className={clsx(styles.iconWrapper, styles.rightIcon)}>{rightIcon}</div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
