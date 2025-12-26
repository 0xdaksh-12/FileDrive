import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-base-200 font-sans text-base-content antialiased transition-colors duration-200">
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 w-full">
        <Outlet />

        {/* Page Footer */}
        <footer className="mt-8 text-center text-sm text-base-content/60">
          <p>
            © {new Date().getFullYear()} PhishGuard AI. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a
              className="hover:text-base-content/80 transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <span className="text-base-content/40">•</span>
            <a
              className="hover:text-base-content/80 transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <span className="text-base-content/40">•</span>
            <a
              className="hover:text-base-content/80 transition-colors"
              href="#"
            >
              Contact Support
            </a>
          </div>
        </footer>
      </div>

      {/* Decorative Background Graphic */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[80px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[90px]"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
