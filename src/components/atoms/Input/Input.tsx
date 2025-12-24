import clsx from 'clsx';
import type { InputProps } from './InputProps';

export const Input = ({
  value,
  placeholder,
  onChange,
  className,
  error,
  type = 'text',
  disabled = false,
}: InputProps) => {
  const inputClasses = clsx(
    'input input-bordered w-full bg-base-100 text-base-content',
    {
      'input-error': Boolean(error),
      'input-disabled opacity-60 cursor-not-allowed': disabled,
    },
    className
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={inputClasses}
        type={type}
        disabled={disabled}
      />

      {error && (
        <span className="text-xs text-error font-medium pl-1">{error}</span>
      )}
    </div>
  );
};
