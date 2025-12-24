import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { NavAction } from '@/components/molecules/NavAction';
import { UserMenu } from '@/components/molecules/UserMenu';
import { Logo } from '@/components/atoms/Logo';

interface NavbarProps {
  isAuth?: boolean;
  user?: { name?: string; email?: string; profilePic?: string };
  onLogout?: () => void;
}

export function Navbar({ isAuth, user, onLogout }: NavbarProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-base-100">
      <div className="navbar px-5">
        <div className="navbar-start">
          <Logo />
        </div>

        <div className="navbar-end gap-1 px-1">
          <ThemeToggle />
          <span className="px-1"></span>
          {isAuth ? (
            <>
              <NavAction to="/dashboard" icon="dashboard">
                Dashboard
              </NavAction>

              {user && <UserMenu user={user} onLogout={onLogout} />}
            </>
          ) : (
            <>
              <NavAction
                to="/auth/login"
                icon="login"
                hidden={location.pathname === '/auth/login'}
              >
                Login
              </NavAction>

              <NavAction
                to="/auth/register"
                icon="person_add"
                variant="primary"
                hidden={location.pathname === '/auth/register'}
              >
                Register
              </NavAction>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
