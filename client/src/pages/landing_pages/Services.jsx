import React from 'react';
import { Link } from 'react-router';
import { 
  Calendar, 
  UserCheck, 
  Briefcase, 
  Star, 
  ArrowRight, 
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ChevronRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const Services = () => {
  const services = [
    {
      title: "Short-term Rental",
      desc: "Flexible daily and weekly options for city exploration or weekend getaways with full coverage.",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      title: "Chauffeur Service",
      desc: "Professional multilingual drivers for airport transfers and executive travel requirements.",
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      title: "Corporate Fleet",
      desc: "Customized management solutions for business teams and dedicated executive support.",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      title: "Luxury Events",
      desc: "Exclusive vehicle selection for weddings, galas, and red-carpet appearances.",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-blue-600 font-sans antialiased text-white">
      <Navbar />

      {/* --- Hero Section: Dynamic Blue --- */}
      <section className="relative pt-32 pb-24 flex items-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
        {/* Decorative Light Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/20 blur-[100px] rounded-full -ml-32 -mb-32"></div>
        
        <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-md">
               <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
               <span className="text-white font-bold uppercase tracking-widest text-[10px]">Premium Services</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Premium Mobility <br/> 
              <span className="opacity-80">Tailored for You.</span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-10 max-w-lg leading-relaxed font-medium">
              Experience the next level of automotive luxury. We provide world-class 
              solutions for every journey, driven by excellence.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link to="/cars" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 text-sm shadow-xl shadow-blue-900/20">
                EXPLORE FLEET <ChevronRight size={18} />
              </Link>
              <Link to="/contacts" className="bg-blue-500/30 hover:bg-blue-500/50 text-white border border-white/30 backdrop-blur-md px-8 py-4 rounded-2xl font-bold transition-all text-sm">
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Services Grid: White Cards for High Contrast --- */}
      <section className="py-24 bg-blue-50">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((item, idx) => (
              <div key={idx} className="group relative p-10 bg-white hover:bg-blue-600 border border-blue-100 rounded-[2rem] transition-all duration-500 shadow-xl shadow-blue-900/5 hover:-translate-y-2">
                
                <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl mb-8 group-hover:bg-white/20 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 group-hover:text-blue-100 transition-colors">
                  {item.desc}
                </p>
                
                <Link to="/contacts" className="text-blue-600 group-hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                  Details <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer: Deep Blue --- */}
      <footer className="bg-blue-900 pt-24 pb-12">
        <div className="w-full max-w-[1200px] mx-auto px-6 text-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            
            <div className="col-span-1">
              <h3 className="text-2xl font-black tracking-tighter text-white mb-8">CAR<span className="text-blue-400">RENTAL</span></h3>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-8">
                The leading provider of luxury automotive experiences. Excellence in every mile.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-900 transition-all cursor-pointer">
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-8 uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
                <li><Link to="/cars" className="hover:text-blue-400 transition">Fleet</Link></li>
                <li><Link to="/services" className="hover:text-blue-400 transition">Services</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-8 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li className="hover:text-blue-400 cursor-pointer transition">Privacy Policy</li>
                <li className="hover:text-blue-400 cursor-pointer transition">Terms of Use</li>
                <li className="hover:text-blue-400 cursor-pointer transition">Refund Policy</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-8 uppercase tracking-widest">Contact</h4>
              <ul className="space-y-6 text-sm">
                <li className="flex items-center gap-3"><Mail size={18} className="text-blue-400" /> info@carrental.com</li>
                <li className="flex items-center gap-3"><Phone size={18} className="text-blue-400" /> +91 902 541 1792</li>
              </ul>
            </div>

          </div>

          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-blue-300/50">
            <p>© 2026 CARRENTAL ELITE. OPERATED BY BLUE DRIVE.</p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer">INSTAGRAM</span>
              <span className="hover:text-white cursor-pointer">LINKEDIN</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;