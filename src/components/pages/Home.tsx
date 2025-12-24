export default function Home() {
  return (
    <div className="bg-base-100 text-base-content antialiased overflow-x-hidden transition-colors duration-300 font-['Inter',sans-serif]">
      

      {/* ================= HERO ================= */}
      <section className="relative py-12 md:py-24 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
            {/* TEXT */}
            <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-semibold mx-auto lg:mx-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Real-time Threat Detection Active
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Secure Your Digital Workspace with{' '}
                <span className="text-primary">AI-Powered</span> Protection
              </h1>

              <p className="text-lg text-base-content/80 max-w-2xl mx-auto lg:mx-0">
                Instantly analyze suspicious links and protect your organization
                from zero-day phishing attacks and real-time threats.
              </p>

              {/* URL INPUT */}
              <div className="w-full max-w-xl mx-auto lg:mx-0 mt-4">
                <label className="flex flex-col sm:flex-row bg-base-100 rounded-xl shadow-lg border border-base-300 p-1.5 gap-2">
                  <div className="flex items-center pl-3 text-base-content/40">
                    <span className="material-symbols-outlined">link</span>
                  </div>
                  <input
                    className="flex-1 bg-transparent focus:ring-0 px-3 h-12 text-base text-base-content placeholder:text-base-content/40"
                    placeholder="Paste a suspicious link here..."
                  />
                  <button className="h-12 px-6 rounded-lg bg-primary text-primary-content font-semibold hover:brightness-95">
                    Scan URL Now
                  </button>
                </label>

                <p className="text-xs text-base-content/60 mt-3 flex items-center gap-1 justify-center lg:justify-start">
                  <span className="material-symbols-outlined text-[14px]">
                    lock
                  </span>
                  Scans are private and secure.
                </p>
              </div>

              {/* TRUST */}
              <div className="pt-6 flex gap-6 justify-center lg:justify-start text-base-content/40 font-bold text-lg">
                <span>SOC2</span>
                <span>GDPR</span>
                <span>ISO 27001</span>
              </div>
            </div>

            {/* IMAGE */}
            <div className="flex-1 w-full max-w-[600px]">
              <div className="aspect-4/3 rounded-2xl border border-base-300 shadow-2xl relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')",
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-base-100 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="py-16 px-4 md:px-10 border-y border-base-300 bg-base-200"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-base-content/80 max-w-2xl mx-auto mb-12">
            Our platform uses advanced machine learning to dissect URLs in
            real-time, giving you a verdict before you click.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              ['content_paste', 'Paste URL'],
              ['psychology', 'AI Analysis'],
              ['verified_user', 'Instant Verdict'],
            ].map(([icon, title], i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 border border-primary/20">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    {icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{`${
                  i + 1
                }. ${title}`}</h3>
                <p className="text-sm text-base-content/80 max-w-xs">
                  Secure and instant phishing detection using AI intelligence.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-16 md:py-24 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold uppercase text-sm">
              Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Comprehensive Protection
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Zero-Day Detection',
              'Admin Dashboard',
              'API Integration',
              'Forensic Reports',
              'Low Latency',
              'Browser Extension',
            ].map((title, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-base-100 border border-base-300 shadow-sm hover:shadow-md"
              >
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-base-content/80">
                  Enterprise-grade protection designed for modern organizations.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-base-300 py-10 text-center text-sm text-base-content/60">
        © 2023 PhishGuard AI. All rights reserved.
      </footer>
    </div>
  );
}
