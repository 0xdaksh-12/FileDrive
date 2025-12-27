import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

interface LogoProps {
  className?: string;
  imgClassName?: string;
}

export const Logo = ({
  className = '',
  imgClassName = 'w-8 h-8',
}: LogoProps) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 text-lg font-bold ${className}`}
    >
      <img
        src={logo}
        alt="ZapURL Logo"
        className={`rounded-full ${imgClassName}`}
        style={{
          filter:
            'brightness(var(--logo-brightness,1)) invert(var(--logo-invert,1))',
        }}
      />
      ZapURL
    </Link>
  );
};
