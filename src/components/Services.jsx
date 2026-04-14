import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Heart,
  Brain,
  Baby,
  Bone,
  Smile,
  Eye,
  ChevronRight,
  Sparkles,
  Activity,
  Shield,
  Clock,
  Users,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { serviceApi } from "../api/serviceApi";
import Button from "./common/Button";

const iconMap = {
  Heart,
  Brain,
  Baby,
  Bone,
  Smile,
  Eye,
  Stethoscope,
};

const gradients = [
  "from-rose-500 to-pink-600",
  "from-blue-500 to-indigo-600",
  "from-green-500 to-teal-600",
  "from-purple-500 to-purple-700",
  "from-orange-500 to-orange-600",
  "from-yellow-400 to-amber-500",
  "from-cyan-500 to-sky-600",
  "from-red-500 to-rose-600",
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await serviceApi.getAll();
      setServices(data);
    } catch (err) {
      setError("Failed to load services. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-20 animate-blob"
          style={{ backgroundColor: "oklch(0.77 0.18 186.55 / 0.3)" }}
        />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 animate-blob" />

        <div className="max-w-7xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-6"
            style={{
              backgroundColor: "oklch(0.77 0.18 186.55 / 0.1)",
              color: "oklch(0.77 0.18 186.55)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Centre of Excellence
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Our Medical{" "}
            <span style={{ color: "oklch(0.77 0.18 186.55)" }}>Services</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From routine checkups to specialized treatments, we offer a wide
            range of world-class medical services tailored to you.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users,      value: "10K+", label: "Happy Patients", color: "text-blue-600" },
              { icon: Stethoscope,value: "50+",  label: "Expert Doctors",  color: "text-rose-500" },
              { icon: Award,      value: "15+",  label: "Years Experience",color: "text-yellow-600" },
              { icon: Activity,   value: "100%", label: "Success Rate",    color: "text-green-600" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-semibold text-sm mb-4">
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each department is staffed with highly qualified specialists
              committed to delivering the best outcomes.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                <p className="text-red-800 font-semibold mb-2">Connection Error</p>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <Button onClick={fetchServices} variant="primary" size="sm">
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => {
                const Icon = iconMap[service.icon] || Stethoscope;
                return (
                  <div
                    key={service.id || idx}
                    className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent cursor-pointer transition-all duration-300 hover:shadow-2xl overflow-hidden"
                    onClick={() => navigate(`/doctors?specialty=${service.title}`)}
                  >
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradients[idx % gradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    <div className="relative z-10">
                      <div className="text-blue-600 group-hover:text-white mb-4 transform group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-12 h-12" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-1 mt-4 text-gray-400 group-hover:text-white transition-colors">
                        <span className="text-sm font-medium">View Doctors</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-4"
              style={{
                backgroundColor: "oklch(0.77 0.18 186.55 / 0.1)",
                color: "oklch(0.77 0.18 186.55)",
              }}
            >
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Excellence in Healthcare
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're dedicated to providing exceptional medical care with a focus
              on patient satisfaction and health outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Stethoscope, title: "Expert Doctors",         desc: "Highly qualified specialists with years of experience in their respective fields.",       color: "from-rose-500 to-rose-600" },
              { icon: Heart,       title: "Patient-First Care",     desc: "Personalized treatment plans designed for optimal recovery and long-term well-being.",      color: "from-pink-500 to-pink-600" },
              { icon: Clock,       title: "24/7 Available",         desc: "Round-the-clock emergency and support services whenever you need us.",                       color: "from-blue-500 to-blue-600" },
              { icon: Activity,    title: "Modern Equipment",       desc: "Latest technology and advanced equipment for accurate diagnosis and treatment.",              color: "from-green-500 to-green-600" },
              { icon: Shield,      title: "Certified Quality",      desc: "ISO certified and internationally recognized healthcare standards.",                          color: "from-purple-500 to-purple-600" },
              { icon: Award,       title: "Award-Winning Care",     desc: "Consistently recognised for clinical excellence and outstanding patient outcomes.",           color: "from-orange-500 to-orange-600" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, oklch(0.77 0.18 186.55), oklch(0.65 0.22 220))" }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white filter blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white filter blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Book an Appointment?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Our specialists are available 24/7 to provide you with the best
              possible care.
            </p>
            <Button
              onClick={() => navigate("/doctors")}
              variant="white"
              size="lg"
              className="text-blue-700 font-bold"
            >
              Browse Our Doctors
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
