import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

interface NavActionProps {
  to: string;
  icon: string;
  children: React.ReactNode;
  hidden?: boolean;
  activeClass?: string;
  variant?: 'primary' | 'ghost';
}

export const NavAction = ({
  to,
  icon,
  children,
  hidden,
  variant = 'ghost',
  activeClass = 'btn-active',
}: NavActionProps) => {
  if (hidden) return null;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'hidden md:flex',
          'btn btn-sm',
          variant === 'ghost' ? 'btn-ghost' : 'btn-primary',
          isActive && activeClass
        )
      }
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {children}
    </NavLink>
  );
};
