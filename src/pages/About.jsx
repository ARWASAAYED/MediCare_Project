import React from "react";
import {
  Heart,
  Activity,
  Award,
  Users,
  Shield,
  Smile,
  CheckCircle2,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto text-center mb-20">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-4"
          style={{
            backgroundColor: "oklch(0.77 0.18 186.55 / 0.1)",
            color: "oklch(0.77 0.18 186.55)",
          }}
        >
          <Sparkles className="w-4 h-4 " /> About Our Clinic
        </div>
        <h1 className="text-4xl md:text-6xl font-bold   mb-6 text-[oklch(0.77_0.18_186.55)]">
          Caring For You Every Step of The Way
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          We are committed to delivering world-class healthcare with compassion
          and excellence. Our team of specialists and modern facilities ensure a
          comfortable, safe, and effective medical experience.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 mb-24">
        <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
          <div className="flex items-center gap-4 mb-4">
            <Heart className="w-10 h-10 text-brand-red" />
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To provide premium medical care backed by compassion, innovation,
            and advanced technology—ensuring every patient receives
            personalized and effective treatment.
          </p>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To become a leading healthcare provider recognized for excellence,
            innovation, and patient-centered medical services across the region.
          </p>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="max-w-7xl mx-auto mb-24">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          What Makes Us Different
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Expert Medical Team",
              desc: "Highly qualified doctors and specialists dedicated to your well-being.",
              color: "from-blue-500 to-indigo-600",
            },
            {
              icon: Activity,
              title: "Advanced Equipment",
              desc: "We use modern medical technologies for accurate diagnosis and treatment.",
              color: "from-green-500 to-teal-600",
            },
            {
              icon: Award,
              title: "Certified & Trusted",
              desc: "Internationally recognized and ISO certified for quality healthcare standards.",
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: Smile,
              title: "Patient-Centered Care",
              desc: "Friendly service and personalized treatment tailored to your needs.",
              color: "from-pink-500 to-pink-600",
            },
            {
              icon: Stethoscope,
              title: "Comprehensive Services",
              desc: "From routine checkups to specialized surgeries—all in one place.",
              color: "from-brand-red to-pink-600",
            },
            {
              icon: CheckCircle2,
              title: "High Success Rate",
              desc: "A proven track record of effective treatments and satisfied patients.",
              color: "from-yellow-500 to-yellow-600",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div
                className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-12 rounded-3xl shadow-lg border border-gray-100">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded with a mission to make healthcare more accessible and
              trustworthy, our clinic started as a small medical center and
              expanded into a full-service facility serving thousands of
              patients every year.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With a dedicated team and world-class resources, we continue to
              grow while staying true to our values: compassion, innovation,
              and excellence.
            </p>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-200 to-indigo-200 opacity-20 blur-2xl"
            ></div>
            <img
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="About Us"
              className="relative rounded-3xl shadow-xl w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;