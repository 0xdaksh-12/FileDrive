import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '../organisms/Navbar';
import { Footer } from '../organisms/Footer';

export const Dashboard = () => {
  const [url, setUrl] = useState('');
  const { isAuth, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuth) {
      navigate('/');
    }
  }, [isAuth, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-base-100">
      <Navbar />

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full bg-linear-to-b from-base-100 to-base-200 py-16 px-4">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
            {/* Status Badge */}
            <div className="badge badge-success gap-2 p-3 bg-green-100 text-green-800 border-green-200">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              System Operational
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight text-base-content">
              Is this link safe?
            </h1>

            <p className="text-base-content/70 text-lg max-w-2xl">
              ZapURL uses advanced machine learning to detect zero-day phishing
              attacks and malicious domains instantly. Paste a URL below to
              start a deep scan.
            </p>

            {/* Scanner Input */}
            <div className="w-full max-w-2xl mt-4">
              <div className="bg-base-100 p-2 rounded-2xl shadow-xl border border-base-200 flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 bg-transparent">
                  <span className="material-symbols-outlined text-base-content/40 mr-2">
                    link
                  </span>
                  <input
                    type="url"
                    placeholder="https://suspicious-link.com/login"
                    className="w-full bg-transparent border-none outline-none text-base-content placeholder:text-base-content/40 h-12"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary rounded-xl px-8 h-12 text-lg normal-case font-bold shadow-lg hover:shadow-primary/30 transition-all group">
                  Scan URL
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between px-4 mt-3 text-xs text-base-content/50 font-medium">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    info
                  </span>
                  Supports HTTP/HTTPS protocols
                </div>
                <span>v2.4.1 (Stable)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 px-4 bg-base-100 border-t border-base-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                How the scan works
              </h2>
              <p className="text-base-content/60">
                Our multi-layered approach ensures no threat goes unnoticed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card bg-base-200/50 border border-base-200 hover:shadow-lg transition-all p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">
                    smart_toy
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Real-time AI Analysis
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  We simulate user behavior to trigger hidden threats and
                  analyze scripts dynamically using our proprietary ML models.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card bg-base-200/50 border border-base-200 hover:shadow-lg transition-all p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">
                    domain_verification
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Domain Reputation</h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  We cross-reference global blocklists, historical WHOIS data,
                  and SSL certificate validity for domain reliability.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card bg-base-200/50 border border-base-200 hover:shadow-lg transition-all p-6">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">
                    visibility
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Visual Inspection</h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  Our engine uses computer vision to detect visual spoofing of
                  popular brands like banks and login portals.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
