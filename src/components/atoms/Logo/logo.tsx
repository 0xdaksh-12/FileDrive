import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 text-lg font-bold">
      <img
        src={logo}
        alt="ZapURL Logo"
        className="w-8 h-8 rounded-full"
        style={{
          filter:
            'brightness(var(--logo-brightness,0)) invert(var(--logo-invert,1))',
        }}
      />
      ZapURL
    </Link>
  );
};
