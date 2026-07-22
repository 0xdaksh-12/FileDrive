import React, { useState } from 'react';
import clsx from 'clsx';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { FormField } from '../../ui/FormField/FormField';
import { Button } from '../../ui/Button/Button';
import { Icon } from '../../ui/Icon/Icon';
import { useAuthStore } from '@/store/auth';
import { ROUTES } from '@/lib/constants';
import styles from './RegisterForm.module.css';

import { getErrorMessage } from '@/lib/error';

// Validation Schema
const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(10, 'Password must be at least 10 characters')
      .refine(
        (val) => /[a-zA-Z]/.test(val),
        'Password must contain at least one letter',
      )
      .refine((val) => /[0-9]/.test(val), 'Password must contain at least one number')
      .refine(
        (val) => /[^a-zA-Z0-9]/.test(val),
        'Password must contain at least one special symbol',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// Password rules configurations
const PASSWORD_RULES = [
  { label: '10+ characters', test: (val: string) => val.length >= 10 },
  { label: 'At least 1 letter', test: (val: string) => /[a-zA-Z]/.test(val) },
  { label: 'At least 1 number', test: (val: string) => /[0-9]/.test(val) },
  {
    label: 'At least 1 special symbol',
    test: (val: string) => /[^a-zA-Z0-9]/.test(val),
  },
] as const;

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dirtyPassword, setDirtyPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  // Password rules evaluated in real-time
  const ruleStates = PASSWORD_RULES.map((rule) => ({
    label: rule.label,
    met: rule.test(password),
  }));

  const score = ruleStates.filter((r) => r.met).length;

  const isPasswordFulfilled = score === PASSWORD_RULES.length;

  const getProgressBarClass = () => {
    if (!dirtyPassword) return styles.barMuted;
    if (isPasswordFulfilled) return styles.barFulfilled;
    return styles.barIncomplete;
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitError(null);
    try {
      await registerUser({
        name: data.fullName,
        email: data.email,
        password: data.password,
      });
      // Registration successful, navigate to dashboard
      navigate({ to: ROUTES.dashboard });
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Failed to register. Please try again.'));
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>
        Create your
        <br />
        FileDrive
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormField
          label="Full Name"
          placeholder="Full Name"
          errorText={errors.fullName?.message}
          leftIcon={<Icon name="person" />}
          {...register('fullName')}
          required
        />

        <FormField
          label="Email"
          type="email"
          placeholder="Email"
          errorText={errors.email?.message}
          leftIcon={<Icon name="mail" />}
          {...register('email')}
          required
        />

        <div className={styles.passwordContainer}>
          <FormField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            errorText={errors.password?.message}
            leftIcon={<Icon name="key" />}
            rightIcon={
              <Icon
                name={showPassword ? 'visibility_off' : 'visibility'}
                onClick={() => setShowPassword(!showPassword)}
              />
            }
            {...register('password', {
              onChange: (e) => {
                if (e.target.value.length > 0) {
                  setDirtyPassword(true);
                }
              },
            })}
            required
          />

          {/* Strength Progress Bar */}
          <div className={styles.progressWrapper}>
            <div className={styles.progressTrack}>
              <div
                className={clsx(styles.progressBar, getProgressBarClass())}
                style={{
                  width: `${dirtyPassword ? (score / PASSWORD_RULES.length) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Checklist */}
            <ul className={styles.checklist}>
              {ruleStates.map((rule, idx) => (
                <li key={idx} className={clsx(rule.met && styles.checked)}>
                  <Icon
                    name={rule.met ? 'check_circle' : 'circle'}
                    className={styles.checkIcon}
                  />
                  <span>{rule.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FormField
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          errorText={errors.confirmPassword?.message}
          leftIcon={<Icon name="lock" />}
          rightIcon={
            <Icon
              name={showConfirmPassword ? 'visibility_off' : 'visibility'}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          {...register('confirmPassword')}
          required
        />

        {submitError && <p className={styles.error}>{submitError}</p>}

        <Button
          type="submit"
          variant="primary"
          size="md"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Get Started'}
        </Button>
      </form>

      <p className={styles.footer}>
        Already have an account? <span className={styles.link}>Sign In</span>
      </p>
    </div>
  );
};
