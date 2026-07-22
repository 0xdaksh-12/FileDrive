import { RegisterForm } from '@/components/features/RegisterForm/RegisterForm';
import { AuthLayout } from '@/components/layouts/AuthLayout/AuthLayout';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
