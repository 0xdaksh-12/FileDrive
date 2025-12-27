import { Logo } from '@/components/atoms/Logo';

export const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-100 text-base-content border-t border-base-300">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap justify-center gap-6">
          <a className="link link-hover text-base-content/70 hover:text-primary">
            Privacy Policy
          </a>
          <a className="link link-hover text-base-content/70 hover:text-primary">
            Terms of Use
          </a>
          <a className="link link-hover text-base-content/70 hover:text-primary">
            Contact Support
          </a>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Logo />
          <p className="text-sm opacity-60">
            © 2025 ZapURL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
