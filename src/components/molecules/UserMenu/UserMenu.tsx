import { NavLink } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';

interface UserMenuProps {
  user: {
    name?: string;
    email?: string;
    profilePic?: string;
  };
  onLogout?: () => void;
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  return (
    <div className="dropdown dropdown-end ">
      <Button
        size="sm"
        variant="neutral"
        style="ghost"
        className="gap-2 normal-case py-2"
      >
        <Avatar
          src={user.profilePic}
          name={user.name}
          email={user.email}
          size="sm"
        />
        <span className="hidden sm:block font-medium">
          {user.name || user.email || 'User'}
        </span>
        <span className="material-symbols-outlined text-[18px] opacity-60">
          expand_more
        </span>
      </Button>

      <ul className="menu dropdown-content mt-3 w-48 rounded-box bg-base-100 p-2 shadow">
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
  );
};
