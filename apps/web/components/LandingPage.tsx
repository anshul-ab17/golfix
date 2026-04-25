import React from 'react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-emerald-400">GOLFIX</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide uppercase">
            <a href="#performance" className="hover:text-emerald-400 transition-colors">Performance</a>
            <a href="#philanthropy" className="hover:text-emerald-400 transition-colors">Philanthropy</a>
            <a href="#draw" className="hover:text-emerald-400 transition-colors">The Draw</a>
            <a href="#membership" className="hover:text-emerald-400 transition-colors">Membership</a>
          </div>
          <Link href="/auth/signup" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            Join the Atelier
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-500/10 blur-[120px] rounded-full"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            Redefine Your Game. <br />
            <span className="text-emerald-500">Elevate Your Impact.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            A digital clubhouse where elite performance meets meaningful philanthropy. 
            Track your stats, win premium rewards, and fuel global change with every swing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth/signup" className="w-full sm:w-auto bg-emerald-500 text-slate-950 px-10 py-4 rounded-full text-lg font-black hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              Start Your Journey
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-slate-50 px-10 py-4 rounded-full text-lg font-black hover:bg-slate-800 transition-all backdrop-blur-sm">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">The Atelier Ecosystem</h2>
            <p className="text-xl text-slate-400 max-w-2xl font-light">
              We&apos;ve bridged the gap between personal excellence and collective good through three core pillars.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800/50 hover:border-emerald-500/50 transition-all hover:-translate-y-2 backdrop-blur-sm">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Play & Sync</h3>
              <p className="text-slate-400 font-light leading-relaxed">
                Sync your scores effortlessly through our encrypted performance engine. Real-time data visualization at your fingertips.
              </p>
            </div>
            {/* Card 2 */}
            <div className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800/50 hover:border-emerald-500/50 transition-all hover:-translate-y-2 backdrop-blur-sm">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">The Monthly Draw</h3>
              <p className="text-slate-400 font-light leading-relaxed">
                Automated entry for premium prizes including bespoke gear, private club access, and exclusive atelier events.
              </p>
            </div>
            {/* Card 3 */}
            <div className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800/50 hover:border-emerald-500/50 transition-all hover:-translate-y-2 backdrop-blur-sm">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Fuel the Change</h3>
              <p className="text-slate-400 font-light leading-relaxed">
                A portion of every subscription supports global charities. Watch your impact grow as you perfect your game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Charities Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div className="mb-8 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Featured Charities</h2>
              <p className="text-xl text-slate-400 max-w-xl font-light">
                Our collective impact is measured by the lives we touch and the ecosystems we protect.
              </p>
            </div>
            <button className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-2">
              View All Partners
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: 'Green Fairways Initiative', desc: 'Restoring biodiversity in coastal ecosystems through sustainable irrigation and reforestation.' },
              { name: 'Kinetic Scholars', desc: 'Providing technology-driven education and sports mentorship to underprivileged youth.' },
              { name: 'Aqua Pure Tech', desc: 'Deploying solar-powered water filtration systems in remote global communities.' }
            ].map((charity, i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] bg-slate-900 rounded-[2rem] overflow-hidden mb-8 border border-slate-800 group-hover:border-emerald-500/30 transition-all relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-slate-800 text-6xl font-black opacity-10 uppercase tracking-tighter rotate-[-10deg]">
                     IMPACT
                   </div>
                </div>
                <h4 className="text-2xl font-bold mb-4">{charity.name}</h4>
                <p className="text-slate-400 font-light leading-relaxed mb-6">{charity.desc}</p>
                <div className="h-[2px] w-full bg-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500 w-1/3 group-hover:w-full transition-all duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="text-3xl font-black tracking-tighter text-emerald-500 mb-8">GOLFIX</div>
            <p className="text-slate-400 max-w-sm font-light leading-relaxed">
              The Kinetic Atelier is a global collective of performance-driven individuals committed to excellence and impact.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-500">Navigation</h5>
            <ul className="space-y-4 text-slate-400 font-light">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Performance</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Philanthropy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">The Draw</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Membership</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-500">Legal</h5>
            <ul className="space-y-4 text-slate-400 font-light">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 text-sm font-light">
          <div>© 2026 GOLFIX. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-500 transition-colors">Instagram</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Twitter</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
