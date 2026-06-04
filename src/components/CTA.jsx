import React from "react";
import { CalendarCheck, Phone } from "lucide-react";

const CTA = ({ onPrimaryClick, onSecondaryClick }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[oklch(0.77_0.18_186.55)] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[oklch(0.77_0.18_186.55)] rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-[oklch(0.77_0.18_186.55)] rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to Prioritize Your Health?
            </h2>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Schedule a consultation with our expert doctors today and take the first step towards a healthier life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onPrimaryClick} className="bg-white text-[oklch(0.77_0.18_186.55)] px-8 py-4 rounded-xl hover:bg-blue-50 transition shadow-xl font-bold text-lg flex items-center justify-center gap-2">
                <CalendarCheck className="w-5 h-5" />
                Book Appointment
              </button>
              <button onClick={onSecondaryClick} className="bg-[oklch(0.71_0.19_186)] text-white border border-[oklch(0.77_0.18_186.55)] px-8 py-4 rounded-xl hover:bg-[oklch(0.71_0.11_186)] transition font-semibold text-lg flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
