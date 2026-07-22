import React, { useId, forwardRef } from 'react';
import clsx from 'clsx';
import { Input, type InputProps } from '../Input/Input';
import styles from './FormField.module.css';

export interface FormFieldProps extends InputProps {
  /** The label text for the field */
  label: string;
  /** An error message */
  errorText?: string;
  /** Optional helper text displayed below the field */
  helperText?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, errorText, required, id, className, helperText, ...inputProps }, ref) => {
    // Generate a unique ID if one wasn't explicitly provided
    const generatedId = useId();
    const fieldId = id || generatedId;
    const errorId = `${fieldId}-error`;

    return (
      <div className={clsx(styles.wrapper, className)}>
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
        
        <Input 
          id={fieldId} 
          ref={ref} 
          required={required} 
          error={!!errorText || inputProps.error} 
          aria-describedby={errorText ? errorId : undefined}
          aria-invalid={!!errorText || undefined}
          {...inputProps} 
        />

        {errorText ? (
          <p id={errorId} className={styles.errorText}>{errorText}</p>
        ) : helperText ? (
          <p className={styles.helperText}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
