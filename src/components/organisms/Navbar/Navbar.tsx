import { Link, NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import logo from '@/assets/logo.png';

interface NavbarProps {
  isAuth?: boolean;
  user?: {
    name?: string;
    email?: string;
    profilePic?: string;
  };
  onLogout?: () => void;
}

export function Navbar({ isAuth, user, onLogout }: NavbarProps) {
  const location = useLocation();
  const hideLogin = location.pathname === '/auth/login';
  const hideRegister = location.pathname === '/auth/register';

  return (
    <header className="sticky top-0 z-50 border-b bg-base-100/90 backdrop-blur supports-backdrop-filter:bg-base-100/60">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold select-none"
        >
          <img
            src={logo}
            alt="ZapURL"
            className="w-8 h-8 rounded-full invert dark:invert-0"
            style={{
              filter:
                'brightness(var(--logo-brightness,0)) invert(var(--logo-invert,1))',
            }}
          />
          <span>ZapURL</span>
        </Link>

        {/* Right Navigation */}
        <nav className="flex items-center gap-2">
          <ThemeToggle />

          {isAuth ? (
            <>
              {/* Desktop Dashboard */}
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `btn btn-sm btn-ghost hidden md:flex gap-1 ${
                    isActive ? 'btn-active' : ''
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">
                  dashboard
                </span>
                Dashboard
              </NavLink>

              {/* User Dropdown */}
              {user && (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-sm btn-ghost gap-2 pl-2"
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        className="w-8 h-8 rounded-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-base-300 text-base-content rounded-full w-8 flex items-center justify-center text-xs font-semibold uppercase">
                          {user.name?.[0] || user.email?.[0] || 'U'}
                        </div>
                      </div>
                    )}
                    <span className="font-medium hidden sm:block">
                      {user.name || user.email || 'User'}
                    </span>
                    <span className="material-symbols-outlined text-[18px] opacity-60">
                      expand_more
                    </span>
                  </label>

                  <ul
                    tabIndex={0}
                    className="menu dropdown-content mt-3 w-48 rounded-box bg-base-100 p-2 shadow"
                  >
                    {/* Mobile Dashboard */}
                    <li className="md:hidden">
                      <NavLink to="/dashboard" className="flex gap-2">
                        <span className="material-symbols-outlined text-[18px]">
                          dashboard
                        </span>
                        Dashboard
                      </NavLink>
                    </li>

                    <li>
                      <button
                        onClick={onLogout}
                        className="flex gap-2 text-error hover:bg-error/10"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          logout
                        </span>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              {!hideLogin && (
                <NavLink
                  to="/auth/login"
                  className="btn btn-sm btn-ghost gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    login
                  </span>
                  Login
                </NavLink>
              )}

              {!hideRegister && (
                <NavLink
                  to="/auth/register"
                  className="btn btn-sm btn-primary gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    person_add
                  </span>
                  Register
                </NavLink>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
