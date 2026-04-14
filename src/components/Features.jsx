import React from "react";
import {
  Stethoscope,
  Heart,
  Clock,
  Activity,
  Award,
  Users,
  CheckCircle2
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Stethoscope,
      title: "Expert Specialists",
      desc: "Our board-certified physicians bring years of experience across various medical disciplines.",
    },
    {
      icon: Heart,
      title: "Patient-Centered Care",
      desc: "We develop personalized treatment plans tailored to your unique health needs and goals.",
    },
    {
      icon: Clock,
      title: "24/7 Emergency Support",
      desc: "Round-the-clock rapid response teams ready for any medical emergency.",
    },
    {
      icon: Activity,
      title: "Advanced Technology",
      desc: "Equipped with the latest diagnostic and surgical technologies for precise treatment.",
    },
    {
      icon: Award,
      title: "Accredited Excellence",
      desc: "Recognized internationally for maintaining the highest standards of medical safety.",
    },
    {
      icon: Users,
      title: "Compassionate Staff",
      desc: "A dedicated team committed to making your hospital stay comfortable and stress-free.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
             <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase mb-6">
              <Activity className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Dedicated to Your Health, <br/> Committed to Care.
            </h2>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              We combine years of experience with modern technology to provide the best medical care possible. Your health is our top priority, and we strive to deliver excellence in every interaction.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Top-rated medical facility in the region",
                "State-of-the-art diagnostic equipment",
                "Highly experienced medical professionals"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition shadow-lg font-semibold flex items-center gap-2 group">
              Learn more about us 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.slice(0, 4).map((f, i) => (
              <div key={i} className={`p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow ${i % 2 === 1 ? 'sm:translate-y-8' : ''}`}>
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mb-4">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
