import React from "react";
import { ChevronRight, Star, Activity, ShieldCheck } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-slate-50/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Trusted Healthcare Excellence
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Advanced Care for a <br/>
              <span className="text-blue-600 relative">
                Better Tomorrow
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-100 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                </svg>
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed font-light">
              We combine world-class medical expertise with compassionate care to ensure the best outcomes for you and your family.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="bg-blue-600 text-white px-8 py-3.5 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 font-medium text-lg">
                Book Consultation <ChevronRight className="w-4 h-4" />
              </button>
              <button className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition shadow-sm font-medium text-lg flex items-center justify-center">
                Explore Services
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
              <div>
                <div className="flex items-center gap-1 font-bold text-2xl text-slate-900">
                  4.9 <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
                <p className="text-sm text-slate-500 font-medium">Patient Rating</p>
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-2xl text-slate-900">
                  10k<span className="text-blue-600 text-lg">+</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Recovered Patients</p>
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-2xl text-slate-900">
                  50<span className="text-blue-600 text-lg">+</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Top Specialists</p>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="aspect-[4/5] md:aspect-square relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10">
              <img 
                src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=1000" 
                alt="Medical Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent"></div>
            </div>

             {/* Floating Badge */}
            <div className="absolute bottom-6 -left-6 md:left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-50 flex items-center gap-4 max-w-[220px]">
               <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-green-600" />
               </div>
               <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Success Rate</p>
                  <p className="text-lg font-bold text-slate-900">99.5%</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
