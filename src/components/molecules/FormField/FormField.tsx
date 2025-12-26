import React, { useState } from 'react';

export interface FieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'checkbox' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  icon?: string; // Material Symbol name
}

interface FormFieldProps {
  fields: FieldDefinition[];
  formData: Record<string, string | boolean>;
  errors?: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  fields,
  formData,
  errors = {},
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const togglePassword = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {fields.map((field) => (
        <div key={field.id} className="form-control w-full">
          {field.type !== 'checkbox' && (
            <div className="label pb-1.5 flex justify-between items-center">
              <span className="label-text font-medium text-base-content/80">
                {field.label}
              </span>
            </div>
          )}

          {field.type === 'checkbox' ? (
            <label className="cursor-pointer flex items-center gap-3">
              <input
                type="checkbox"
                id={field.id}
                name={field.name}
                checked={!!formData[field.name]}
                onChange={onChange}
                className="checkbox checkbox-primary checkbox-sm border-base-300 rounded"
              />
              <span className="label-text text-base-content/70 text-sm">
                {field.label}
              </span>
            </label>
          ) : (
            <div className="relative flex flex-col items-start w-full">
              <div className="relative w-full">
                <input
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={String(formData[field.name] || '')}
                  onChange={onChange}
                  type={
                    field.type === 'password' && showPassword[field.id]
                      ? 'text'
                      : field.type
                  }
                  className={`input input-bordered w-full bg-base-100/50 dark:bg-base-200/50 text-base-content placeholder:text-base-content/40 focus:outline-hidden focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200 pl-4 ${
                    field.icon || field.type === 'password' ? 'pr-10' : ''
                  } ${
                    errors[field.name]
                      ? 'input-error animate-shake border-error bg-error/5 focus:border-error focus:ring-error/10'
                      : ''
                  }`}
                />

                {field.type === 'password' ? (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 transition-colors p-1"
                    onClick={() => togglePassword(field.id)}
                    aria-label="Toggle password visibility"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword[field.id] ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                ) : field.icon ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[20px]">
                      {field.icon}
                    </span>
                  </div>
                ) : null}
              </div>
              {errors[field.name] && (
                <span className="text-xs text-error mt-1 ml-1 animate-pulse font-medium flex items-center gap-1">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '14px' }}
                  >
                    error
                  </span>
                  {errors[field.name]}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};
