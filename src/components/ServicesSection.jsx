import React from "react";
import { ChevronRight, Heart, Brain, Baby, Bone, Smile, Eye, Stethoscope, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./common/Button";

const iconMap = { Heart, Brain, Baby, Bone, Smile, Eye, Stethoscope };

const getServiceLightGradient = (index) => {
  const gradients = [
    "from-rose-300 to-pink-100",
    "from-blue-50 to-indigo-300",
    "from-green-300 to-teal-100",
    "from-purple-300 to-purple-100",
    "from-orange-50 to-orange-300",
    "from-yellow-300 to-amber-100",
  ];
  return gradients[index % gradients.length];
};

const getServiceGradient = (index) => {
  const gradients = [
    "from-rose-400 to-pink-500",
    "from-blue-400 to-indigo-500",
    "from-green-400 to-teal-500",
    "from-purple-400 to-purple-500",
    "from-orange-400 to-orange-500",
    "from-yellow-300 to-amber-400",
  ];
  return gradients[index % gradients.length];
};

const ServicesSection = ({ 
  services = [], 
  loading = false, 
  error = null, 
  onRetry = null, 
  limit, 
  showViewAll = false,
  description = "From routine checkups to specialized treatments, we offer a wide range of medical services"
}) => {
  const navigate = useNavigate();
  const displayServices = limit ? services.slice(0, limit) : services;

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-semibold text-sm mb-4">
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            {description}
          </p>
          {showViewAll && (
            <Button
              onClick={() => navigate("/services")}
              variant="primary"
              size="lg"
            >
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
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
              {onRetry && (
                <Button onClick={onRetry} variant="primary" size="sm">
                  Retry
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service, idx) => {
              const Icon = iconMap[service.icon] || Stethoscope;
              return (
                <div key={service.id || idx} className="group relative h-full">
                  <div className={`absolute -inset-1 bg-gradient-to-br ${getServiceGradient(idx)} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition duration-300`} />
                  <div
                    className={`relative h-full bg-gradient-to-br ${getServiceLightGradient(idx)} rounded-2xl p-8 border border-gray-100 group-hover:border-transparent cursor-pointer transition-all duration-300 group-hover:-translate-y-1 overflow-hidden`}
                    onClick={() => navigate(`/doctors?specialty=${service.title}`)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${getServiceGradient(idx)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative z-10 transition-all duration-300 group-hover:drop-shadow-md">
                      <div className="text-gray-700 group-hover:text-white mb-4 transform group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-12 h-12" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-1 mt-4 text-gray-700 group-hover:text-white transition-colors font-semibold">
                        <span className="text-sm">View Doctors</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
