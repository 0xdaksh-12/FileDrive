import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import {
  FormField,
  type FieldDefinition,
} from '../molecules/FormField/FormField';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema } from '@/lib/validation';
import type { ZodIssue } from 'zod';
import { useState } from 'react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string | boolean>>({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields: FieldDefinition[] = [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'John Doe',
      required: true,
      icon: 'person',
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'name@company.com',
      required: true,
      icon: 'mail',
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Create a password',
      required: true,
      icon: 'lock',
    },
    {
      id: 'confirm_password',
      name: 'confirm_password',
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      required: true,
      icon: 'lock_reset',
    },
  ];

  const validate = () => {
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({
        name: String(formData.name),
        email: String(formData.email),
        password: String(formData.password),
      });
      // Assuming register logs user in or requires redirect to login?
      // User request says "Redirect logic would go here" for alert
      // AuthProvider register returns payload (token), so logged in.
      navigate('/');
    } catch (error) {
      console.error('Register failed:', error);
      setErrors((prev) => ({
        ...prev,
        email: 'Registration failed. Try again.',
      }));
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-base-100 dark:bg-base-200 rounded-xl shadow-2xl border border-base-300 overflow-hidden relative mx-auto">
      <div className="h-1.5 w-full bg-primary absolute top-0 left-0"></div>
      <div className="p-8 sm:p-10 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px' }}
            >
              shield_lock
            </span>
          </div>
          <Link
            to="/"
            className="absolute top-4 right-4 text-base-content/40 hover:text-base-content transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-base-content">
              PhishGuard AI
            </h2>
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-base-content">
            Create an Account
          </h3>
          <p className="text-sm mt-1 text-base-content/60">
            Start your 14-day free trial.
          </p>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-5 mt-2"
          id="registerForm"
          onSubmit={handleSubmit}
          noValidate
        >
          <FormField
            fields={fields}
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />

          <Button
            variant="primary"
            className="w-full shadow-lg hover:shadow-xl transition-all duration-200 group mt-2"
            type="submit"
          >
            <span>Create Account</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Button>

          <p className="text-xs text-center mt-2 text-base-content/60">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>

      <div className="bg-base-200/50 border-t border-base-300 py-3 px-8 flex items-center justify-center gap-2">
        <span
          className="material-symbols-outlined text-base-content/40"
          style={{ fontSize: '16px' }}
        >
          lock
        </span>
        <p className="text-xs text-base-content/50">
          Secure 256-bit encrypted connection
        </p>
      </div>
    </div>
  );
};

export default Register;
