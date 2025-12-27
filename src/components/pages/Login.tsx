import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { loginSchema } from '@/lib/validation';
import type { ZodIssue } from 'zod';
import {
  FormField,
  type FieldDefinition,
} from '../molecules/FormField/FormField';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string | boolean>>({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields: FieldDefinition[] = [
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
      placeholder: 'Enter your password',
      required: true,
      icon: 'lock',
    },
  ];

  const validate = () => {
    const result = loginSchema.safeParse(formData);
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
    // Clear error when user types
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
      await login({
        email: String(formData.email),
        password: String(formData.password),
      });
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      // For demo purposes, if login fails we might want to shake the form or show a global error
      // But here we rely on the specific field errors if applicable, or generic fallback
      setErrors((prev) => ({
        ...prev,
        email: 'Invalid credentials or server error',
      }));
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-base-100 dark:bg-base-200 rounded-xl shadow-2xl border border-base-300 overflow-hidden relative mx-auto">
      {/* Top Decorative Line */}
      <div className="h-1.5 w-full bg-primary absolute top-0 left-0"></div>

      <div className="p-8 sm:p-10 flex flex-col gap-6">
        {/* Logo & Header Section */}
        <div className="flex flex-col items-center text-center gap-4">
          <Logo className="text-3xl" imgClassName="w-12 h-12" />
          <Link
            to="/"
            className="absolute top-4 right-4 text-base-content/40 hover:text-base-content transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </Link>
        </div>

        {/* Welcome Text */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-base-content">
            Welcome back
          </h3>
          <p className="text-sm mt-1 text-base-content/60">
            Enter your credentials to access the threat dashboard.
          </p>
        </div>

        {/* Form Section */}
        <form
          className="flex flex-col gap-5 mt-2"
          onSubmit={handleSubmit}
          noValidate
        >
          <FormField
            fields={fields}
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />

          {/* Additional Actions */}
          <div className="flex items-center justify-between">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                checked={!!formData.remember}
                onChange={handleChange}
                className="checkbox checkbox-xs rounded border-base-300"
                id="remember"
              />
              <span className="text-sm text-base-content/70">Remember me</span>
            </label>
            <a
              className="text-sm font-medium text-primary hover:text-primary-focus transition-colors"
              href="#"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            className="w-full shadow-lg hover:shadow-xl transition-all duration-200 group"
            type="submit"
          >
            <span>Sign In</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Button>

          {/* Social Login */}
          <div className="flex items-center gap-4 my-2 w-full">
            <div className="h-px flex-1 bg-base-300"></div>
            <span className="text-xs font-medium uppercase tracking-wider text-base-content/50">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-base-300"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              type="button"
              className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-200 hover:border-base-300 text-base-content/70 font-medium h-11 min-h-11"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-200 hover:border-base-300 text-base-content/70 font-medium h-11 min-h-11"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-xs text-center mt-2 text-base-content/60">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
      {/* Security Badge Footer within Card */}
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

export default Login;
