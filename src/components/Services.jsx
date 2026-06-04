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
import ServicesSection from "./ServicesSection";

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
  "from-rose-400 to-pink-500",
  "from-blue-400 to-indigo-500",
  "from-green-400 to-teal-500",
  "from-purple-400 to-purple-500",
  "from-orange-400 to-orange-500",
  "from-yellow-300 to-amber-400",
  "from-cyan-400 to-sky-500",
  "from-red-400 to-rose-500",
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
      <ServicesSection
        services={services}
        loading={loading}
        error={error}
        onRetry={fetchServices}
        showViewAll={false}
        description="Each department is staffed with highly qualified specialists committed to delivering the best outcomes."
      />

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
