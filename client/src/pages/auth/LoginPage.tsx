import { LoginForm } from '@/components/features/LoginForm/LoginForm';
import { AuthLayout } from '@/components/layouts/AuthLayout/AuthLayout';

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
