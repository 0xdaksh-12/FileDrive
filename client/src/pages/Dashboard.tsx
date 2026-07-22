import { Button } from '@/components/ui/Button/Button';
import { useAuthStore } from '@/store/auth';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/lib/constants';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: ROUTES.root });
  };

  return (
    <div>
      {user?.email}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
