import React from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const items = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      text: "The level of care I received was outstanding. The team made me feel comfortable and well-informed throughout my entire recovery process.",
      initials: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Patient",
      text: "State-of-the-art facilities and truly compassionate doctors. I'm grateful for the quick diagnosis and effective treatment plan.",
      initials: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Parent",
      text: "Bringing my child here was the best decision. The pediatric team was incredibly gentle and made the experience stress-free for us.",
      initials: "ER"
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Patient Success Stories
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg font-light">
            Don't just take our word for it. Hear what our patients have to say about their experience with us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" />
                ))}
              </div>
              
              <p className="text-blue-50 mb-8 text-lg italic leading-relaxed">
                "{t.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-blue-200 text-sm font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
