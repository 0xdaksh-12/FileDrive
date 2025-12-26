import { useState } from 'react';
import { Navbar } from '../organisms/Navbar';
import { InputGroup } from '../molecules/InputGroup';
import { Logo } from '../atoms/Logo';

export const Home = () => {
  const [url, setUrl] = useState('');

  return (
    <div className="bg-base-200 min-h-screen">
      <Navbar />

      <section className="py-10 md:py-16 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="badge badge-primary badge-outline gap-2 mx-auto lg:mx-0">
              <span className="animate-ping h-2 w-2 rounded-full bg-primary" />
              Real-time Threat Detection Active
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Shorten & Secure Your Links with{' '}
              <span className="text-primary">AI-Powered</span> Protection
            </h1>

            <p className="text-base-content/70 max-w-xl mx-auto lg:mx-0">
              Create short URLs and instantly analyze suspicious links to
              protect your organization from phishing attacks and unsafe
              websites.
            </p>

            <div className="max-w-xl mx-auto lg:mx-0">
              <InputGroup
                icon="link"
                placeholder="Paste a suspicious link here..."
                buttonText="Scan URL Now"
                value={url}
                className="border-0 focus:outline-none focus:ring-0 focus:border-0"
                onChange={(e) => setUrl(e.target.value)}
                onAction={() => alert(`Scanning: ${url}`)}
              />

              <p className="text-xs opacity-60 mt-2 flex items-center gap-1 justify-center lg:justify-start">
                <span className="material-symbols-outlined text-sm">lock</span>
                Scans are private and secure.
              </p>
            </div>

            <div className="pt-6 flex flex-wrap gap-6 justify-center lg:justify-start opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {['SOC2', 'GDPR', 'ISO 27001'].map((item) => (
                <div
                  key={item}
                  className="h-8 flex items-center font-bold text-xl text-base-content/50"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="aspect-4/3 rounded-2xl bg-linear-to-br from-primary/10 to-base-100 dark:to-base-200 border border-base-300 shadow-2xl overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"
                alt="Cybersecurity network visualization"
                className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-overlay"
              />

              <div className="absolute inset-0 bg-linear-to-t from-base-200 dark:from-base-300 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[80%] bg-base-100 dark:bg-base-200 rounded-t-xl shadow-2xl border-t border-x border-base-300 p-4">
                <div className="flex items-center gap-2 mb-4 border-b border-base-300 pb-2">
                  <span className="w-3 h-3 rounded-full bg-error" />
                  <span className="w-3 h-3 rounded-full bg-warning" />
                  <span className="w-3 h-3 rounded-full bg-success" />
                </div>

                <div className="space-y-3">
                  <div className="h-8 bg-base-300 rounded w-1/3 animate-pulse" />

                  <div className="h-32 bg-primary/10 rounded border border-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-primary mb-2">
                        shield_lock
                      </span>
                      <p className="text-sm font-medium text-primary">
                        System Secure
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 bg-base-300 rounded w-full" />
                    <div className="h-2 bg-base-300 rounded w-5/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-16 px-6 bg-base-100 border-y border-base-300"
      >
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="opacity-70 max-w-2xl mx-auto">
              Our platform uses advanced machine learning to dissect URLs in
              real-time, giving you a verdict before you click.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-base-300 -z-10" />

            {[
              {
                icon: 'content_paste',
                title: '1. Paste URL',
                desc: 'Paste any long or suspicious link into ZipURL.',
              },
              {
                icon: 'compress',
                title: '2. Shorten & Scan',
                desc: 'ZipURL instantly shortens your link and runs a security scan.',
              },
              {
                icon: 'verified_user',
                title: '3. Get Safe Link',
                desc: 'Receive a short, secure URL with a safety verdict.',
              },
            ].map((step) => (
              <div
                key={step.icon}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm opacity-70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 px-6 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2">
              Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              Comprehensive Protection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: 'link',
                title: 'Smart URL Shortener',
                desc: 'Create short, shareable links while keeping them protected.',
              },
              {
                icon: 'bug_report',
                title: 'Zero-Day Detection',
                desc: 'Detects never-before-seen phishing pages by analyzing visual and structural patterns, not just blacklists.',
              },
              {
                icon: 'dashboard',
                title: 'Admin Dashboard',
                desc: 'Centralized view for IT admins to monitor scan history, flagged threats, and user activity across the org.',
              },
              {
                icon: 'api',
                title: 'API Integration',
                desc: 'Seamlessly integrate PhishGuard scanning into your existing security stack or custom apps.',
              },
              {
                icon: 'assessment',
                title: 'Forensic Reports',
                desc: 'Detailed breakdown of why a URL was flagged, including screenshot evidence and hosting details.',
              },
              {
                icon: 'extension',
                title: 'Browser Extension',
                desc: 'Lightweight browser plugin that scans links on hover to protect employees instantly.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-base-100 border-t border-base-300 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <Logo />
              </div>
              <p className="text-sm opacity-60">
                Protecting the modern web with intelligent, real-time threat
                detection.
              </p>
            </div>

            <div className="flex flex-wrap gap-12 sm:gap-24">
              {[
                {
                  title: 'Product',
                  links: ['Features', 'API', 'Pricing', 'Extension'],
                },
                {
                  title: 'Company',
                  links: ['About', 'Blog', 'Careers', 'Contact'],
                },
                {
                  title: 'Legal',
                  links: ['Privacy', 'Terms', 'Security'],
                },
              ].map((section) => (
                <div key={section.title} className="flex flex-col gap-3">
                  <h4 className="font-bold">{section.title}</h4>
                  {section.links.map((l) => (
                    <a
                      key={l}
                      href="#"
                      className="text-sm opacity-70 hover:text-primary"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-base-300 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs opacity-50">
              © 2025 ZipURL. All rights reserved.
            </p>
            <div className="flex gap-4 text-base-content/50">
              <a href="#" className="hover:text-primary">
                Twitter
              </a>
              <a href="#" className="hover:text-primary">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
