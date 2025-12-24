import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import logo from '@/assets/logo.png';
import { NavAction } from '@/components/molecules/NavAction';
import { UserMenu } from '@/components/molecules/UserMenu';

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
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <img
              src={logo}
              className="w-8 h-8 rounded-full"
              style={{
                filter:
                  'brightness(var(--logo-brightness,0)) invert(var(--logo-invert,1))',
              }}
            />
            ZapURL
          </Link>
        </div>

        <div className="navbar-end gap-1 ">
          <ThemeToggle />

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
