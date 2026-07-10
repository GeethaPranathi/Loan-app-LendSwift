import React from 'react';
import Wizard from './components/Wizard';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Phone, User, Home, Briefcase } from 'lucide-react';
import Button from './components/common/Button';

const App: React.FC = () => {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top trust bar */}
      <div className="bg-primary text-white py-2 px-6 text-center text-xs font-medium flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-accent" /> Bank-grade 256-bit AES Encryption</span>
        <span className="hidden md:flex items-center gap-1.5">• RBI Regulated & Compliant</span>
        <span className="hidden md:flex items-center gap-1.5">• Zero Paperwork</span>
        <span className="hidden md:flex items-center gap-1.5"><Phone size={12} className="text-accent" /> 1800-XXX-XXXX (Toll Free)</span>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
            <span className="text-white font-extrabold text-xl leading-none">L</span>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-primary">LendSwift</span>
            <span className="text-xs text-slate-400 font-medium block -mt-0.5">Instant Loans · Smart Approvals</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <button onClick={() => scrollToSection('products')} className="hover:text-primary transition-colors duration-200">Products</button>
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary transition-colors duration-200">How it Works</button>
          <button onClick={() => scrollToSection('emi-calc')} className="hover:text-primary transition-colors duration-200">EMI Calculator</button>
          <button onClick={() => scrollToSection('support')} className="hover:text-primary transition-colors duration-200">Support</button>
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => scrollToSection('wizard-section')}
            variant="accent" 
            size="sm"
            className="font-bold shadow-md shadow-accent/20"
          >
            Check Eligibility
          </Button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-[#0d2540] text-white py-10 md:py-14 px-6 text-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-light rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Instant approval in as little as 10 minutes
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
            Your Dream, Our <span className="text-accent">Loan</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-lg mx-auto">
            Apply for a Personal, Home, or Business Loan with zero paperwork. 
            Fully online, 100% secure, approved in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm font-semibold text-white/80">
            <span>✓ Up to ₹1 Crore</span>
            <span>✓ Interest from 8.5% p.a.</span>
            <span>✓ Flexible Tenure</span>
            <span>✓ No Hidden Charges</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Loan Products</h2>
            <p className="text-slate-500 max-w-xl mx-auto">We offer a range of financial products tailored to your specific needs, with competitive rates and flexible terms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Personal Loan', rate: '10.5%', max: '₹10 Lakh', icon: <User className="text-primary" /> },
              { name: 'Home Loan', rate: '8.5%', max: '₹1 Crore', icon: <Home className="text-primary" /> },
              { name: 'Business Loan', rate: '12.0%', max: '₹50 Lakh', icon: <Briefcase className="text-primary" /> }
            ].map((p, i) => (
              <div key={i} className="glass-card p-8 border border-slate-100 hover:border-primary/20 transition-all duration-300 hover:shadow-2xl group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  {p.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{p.name}</h3>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Interest Rate</span>
                    <span className="text-slate-800 font-bold">from {p.rate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Max Amount</span>
                    <span className="text-slate-800 font-bold">{p.max}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => scrollToSection('wizard-section')}>Apply Now</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-16">Simple 3-Step Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-slate-200 -translate-y-12" />
            {[
              { step: '01', title: 'Check Eligibility', desc: 'Fill in your basic details and get instant loan offers.' },
              { step: '02', title: 'Verify KYC', desc: 'Securely upload your PAN and Aadhaar for instant verification.' },
              { step: '03', title: 'Get Funded', desc: 'Digitally sign your agreement and receive funds in your bank.' }
            ].map((s, i) => (
              <div key={i} className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 text-primary font-extrabold text-xl">{s.step}</div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h4>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form Area */}
      <section id="wizard-section" className="py-20 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Loan Application Form</h2>
            <p className="text-slate-500">Complete the 8 simple steps below to submit your application.</p>
          </div>
          <Wizard />
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section id="emi-calc" className="py-20 bg-slate-900 text-white scroll-mt-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Plan Your Loan</h2>
            <p className="text-white/60">Use our calculator to see how much you will pay each month.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Loan Amount</span>
                  <span className="font-bold text-accent">₹ 10,00,000</span>
                </div>
                <input type="range" className="w-full accent-accent" min="50000" max="5000000" step="50000" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Tenure (Months)</span>
                  <span className="font-bold text-accent">60 Months</span>
                </div>
                <input type="range" className="w-full accent-accent" min="12" max="120" step="12" />
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Estimated Monthly EMI</p>
              <p className="text-4xl font-extrabold text-accent mb-4">₹ 21,494</p>
              <p className="text-xs text-white/40">Interest rate starts from 8.5% p.a.*</p>
              <Button variant="accent" size="sm" className="mt-8 px-10" onClick={() => scrollToSection('wizard-section')}>Get Precise Quote</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Need Assistance?</h2>
              <p className="text-slate-500 mb-8">Our customer support team is available 24/7 to help you with your loan application or any queries you might have.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Phone size={20} /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Call Us</p>
                    <p className="text-slate-800 font-bold">1800-123-4567 (Toll Free)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><ShieldCheck size={20} /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Email Support</p>
                    <p className="text-slate-800 font-bold">care@lendswift.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8">
              <h4 className="text-lg font-bold text-slate-800 mb-6">Submit a Query</h4>
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-primary outline-none transition-all shadow-sm" />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-primary outline-none transition-all shadow-sm" />
                <textarea placeholder="How can we help?" rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-primary outline-none transition-all shadow-sm resize-none"></textarea>
                <Button className="w-full">Send Message</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm text-slate-500">
            <div>
              <p className="font-bold text-slate-700 mb-2">LendSwift</p>
              <p className="text-xs leading-relaxed">
                LendSwift Algorithms Pvt. Ltd. is a registered NBFC under the Reserve Bank of India. 
                CIN: U74120DL2020PTC123456 · NBFC Reg: N-13.01234
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-700 mb-2">Regulatory</p>
              <ul className="space-y-1 text-xs">
                <li><button onClick={() => scrollToSection('support')} className="hover:text-primary">Privacy Policy</button></li>
                <li><button onClick={() => scrollToSection('support')} className="hover:text-primary">Terms & Conditions</button></li>
                <li><button onClick={() => scrollToSection('support')} className="hover:text-primary">Grievance Redressal</button></li>
                <li><button onClick={() => scrollToSection('support')} className="hover:text-primary">Fair Practice Code</button></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate-700 mb-2">Security</p>
              <div className="flex flex-wrap gap-2">
                {['256-bit AES', 'ISO 27001', 'RBI Compliant', 'UIDAI Partner'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} LendSwift Algorithms Private Limited. All rights reserved. 
            NBFC-ND-SI registered with the Reserve Bank of India. Loan disbursal subject to credit assessment and RBI guidelines.
          </div>
        </div>
      </footer>
      {/* App-level Toast - kept for general messages if needed */}
      <AnimatePresence>
        {false && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-medium">Notification</span>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default App;
