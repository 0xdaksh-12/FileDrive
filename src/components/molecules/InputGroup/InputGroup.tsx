import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

interface InputGroupProps {
  icon: string;
  placeholder?: string;
  buttonText: string;
  onAction?: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const InputGroup = ({
  icon,
  placeholder,
  buttonText,
  onAction,
  value,
  onChange,
  disabled,
  error,
  className = 'grow focus:outline-none focus:ring-0',
}: InputGroupProps) => {
  return (
    <label className="flex flex-col sm:flex-row items-stretch bg-base-100 rounded-xl shadow-lg border border-base-300 p-1.5 gap-2 w-full">
      <div className="flex items-center pl-3 text-base-content/40">
        <span className="material-symbols-outlined">{icon}</span>
      </div>

      <Input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={className}
        disabled={disabled}
        error={error}
      />

      <Button size="md" onClick={onAction} disabled={disabled}>
        {buttonText}
      </Button>
    </label>
  );
};
