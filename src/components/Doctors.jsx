import React from "react";
import { useSelector } from "react-redux";
import { Star, Calendar, UserRound } from "lucide-react";

const Doctors = () => {
  const doctors = useSelector((s) => s.doctors.doctors);

  return (
    <section id="doctors" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Our Medical Team</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            Meet Our Specialists
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg font-light">
            Dedicated professionals committed to providing the highest standard of healthcare.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="flex flex-col items-center p-8 pb-0">
                <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center mb-6 relative group-hover:scale-105 transition-transform duration-300 ring-4 ring-blue-50/50">
                   {/* Professional Avatar Placeholder */}
                   <span className="text-3xl font-bold text-blue-600">
                     {doctor.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                   </span>
                   <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-white w-6 h-6 rounded-full" title="Available"></div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 text-center mb-1">{doctor.name}</h3>
                <p className="text-slate-500 font-medium text-sm uppercase tracking-wide text-center mb-4">{doctor.specialty}</p>
                
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full mb-6">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-bold text-slate-900 text-sm">{doctor.rating}</span>
                  <span className="text-slate-400 text-xs">Rating</span>
                </div>
              </div>

              <div className="p-6 border-t border-slate-50 bg-slate-50/50">
                <button className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all duration-200 font-semibold flex items-center justify-center gap-2 group/btn">
                  <Calendar className="w-4 h-4 group-hover/btn:text-blue-600 transition-colors" />
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
