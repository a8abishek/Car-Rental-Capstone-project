import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Navbar from "./../../components/Navbar";

function Contacts() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    // UPDATED: Background is now exactly #f8fafc
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900">
      <Navbar />

      <section className="relative pt-24 pb-24 overflow-hidden">
        {/* Soft Blue glow to keep the brand color present */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 blur-[100px] rounded-full z-0"></div>
        
        <div className="max-w-300 mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: Text Info */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-200">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                 <span className="text-blue-700 font-bold uppercase tracking-widest text-[10px]">24/7 Concierge</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                Get in <span className="text-blue-600">Touch.</span>
              </h1>
              
              <p className="text-xl text-slate-500 max-w-md leading-relaxed">
                Experience the gold standard of customer support. We are ready to assist with your premium travel needs.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-white shadow-md border border-slate-100 text-blue-600 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                    <Mail size={18} />
                  </div>
                  <span className="font-bold text-slate-700">info@carrental.com</span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-white shadow-md border border-slate-100 text-blue-600 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                    <Phone size={18} />
                  </div>
                  <span className="font-bold text-slate-700">+91 (902) 541-1792</span>
                </div>
              </div>
            </div>

            {/* Right Side: The Form Card */}
            <div className="relative">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50">
                {submitted ? (
                  <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                    <p className="text-slate-500">Thank you for choosing CarRental Elite.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          type="text" 
                          placeholder="John Doe" 
                          className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <input 
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email" 
                          placeholder="john@example.com" 
                          className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                      <textarea 
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5" 
                        placeholder="How can we assist you today?" 
                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none placeholder:text-slate-400"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                    >
                      SEND INQUIRY <Send size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Contacts;