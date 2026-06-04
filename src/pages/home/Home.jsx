import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Phone,
  Star,
  Heart,
  Clock,
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Brain,
  Baby,
  Bone,
  Smile,
  Eye,
  Quote,
  Search,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doctorApi } from "../../api/doctorApi";
import { reviewApi } from "../../api/reviewApi";
import { serviceApi } from "../../api/serviceApi";

import AppointmentBooking from "../../components/AppointmentBooking";
import Button from "../../components/common/Button";
import ServicesSection from "../../components/ServicesSection";
import CTA from "../../components/CTA";

const Home = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);


  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [doctorsData, reviewsData, servicesData] = await Promise.all([
          doctorApi.getAll(),
          reviewApi.getAll(),
          serviceApi.getAll(),
        ]);

        setServices(servicesData);
        // Sort by rating descending and take top 3
        const topReviews = [...reviewsData]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);
        setReviews(topReviews);

        // Calculate ratings
        const doctorsWithRatings = doctorsData.map(doc => {
          const docReviews = reviewsData.filter(r => r.doctorId === doc.id);
          const avgRating = docReviews.length > 0
            ? docReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / docReviews.length
            : 0;
          return { ...doc, rating: avgRating, reviewCount: docReviews.length };
        });

        // Filter out doctors without proper data, sort by rating, and take first 6
        const validDoctors = doctorsWithRatings
          .filter((doc) => doc.name && doc.specialty)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6);
        setDoctors(validDoctors);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (
          error.code === "ECONNREFUSED" ||
          error.message.includes("Network Error")
        ) {
          setError(
            "Cannot connect to server. Please make sure JSON Server is running on http://localhost:3000"
          );
        } else {
          setError("Failed to load doctors. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };


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

  const handleBookAppointment = (doctor = null) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    // Refresh doctors list or show success message
    setShowBookingModal(false);
    setSelectedDoctor(null);
  };

  const iconMap = {
    Heart: Heart,
    Brain: Brain,
    Baby: Baby,
    Bone: Bone,
    Smile: Smile,
    Eye: Eye,
    Stethoscope: Stethoscope,
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{ backgroundColor: "oklch(0.77 0.18 186.55 / 0.3)" }}
        />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm"
                style={{
                  backgroundColor: "oklch(0.77 0.18 186.55 / 0.1)",
                  color: "oklch(0.77 0.18 186.55)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Trusted by 10,000+ Patients
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Your Health is Our{" "}
                <span className="text-[oklch(0.77_0.18_186.55)]">Priority</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Experience world-class medical care with our team of expert
                physicians and state-of-the-art facilities. We're committed to
                providing the best healthcare solutions for you and your family.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleBookAppointment()}
                  variant="primary"
                  size="lg"
                  className="group"
                >
                  Book Appointment
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => scrollToSection("about")}
                  variant="white"
                  size="lg"
                  className="text-gray-700 hover:border-[oklch(0.77 0.18 186.55 / 0.1)] hover:text-oklch(0.77 0.18 186.55 / 0.1)"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">
                    4.9/5 Rating
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700 font-semibold">
                    ISO Certified
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl transform rotate-3 opacity-20"
                  style={{ backgroundColor: "oklch(0.77 0.18 186.55 / 0.3)" }}
                />
                <div
                  className="relative rounded-3xl p-10 text-white shadow-2xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.77 0.18 186.55), oklch(0.70 0.20 200))",
                  }}
                >
                  {/* Medical Illustration Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src="/hero.png"
                      alt="Modern Hospital"
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-oklch(0.77 0.18 186.55 / 0.1)/90 to-oklch(0.77 0.18 186.55 / 0.1)/80 mix-blend-multiply" />
                  </div>

                  {/* Medical illustration SVG - Background Pattern */}
                  <div className="absolute top-0 right-0 w-64 h-64 opacity-10 z-0">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="white"
                        opacity="0.1"
                      />
                      <path
                        d="M100 40 L120 80 L160 85 L130 115 L135 160 L100 140 L65 160 L70 115 L40 85 L80 80 Z"
                        fill="white"
                        opacity="0.2"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="30"
                        fill="white"
                        opacity="0.15"
                      />
                    </svg>
                  </div>

                  {/* Medical Icons Illustration */}
                  <div className="absolute top-8 left-8 w-32 h-32 opacity-15">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <path
                        d="M30 50 L45 65 L70 35"
                        stroke="white"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="relative space-y-6 z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Activity className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold">
                        Advanced Healthcare
                      </h3>
                    </div>
                    <p className="text-white/90 text-lg">
                      Latest technology and proven methods for your recovery
                    </p>
                    <div className="pt-4 space-y-3">
                      {[
                        "24/7 Emergency Services",
                        "Expert Medical Team",
                        "Modern Facilities",
                        "Personalized Care",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decorative medical icons - Floating */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-20 animate-pulse">
                    <Stethoscope className="w-12 h-12" />
                    <Heart className="w-12 h-12" />
                  </div>

                  {/* Additional decorative elements */}
                  <div className="absolute top-1/2 right-8 w-16 h-16 opacity-10">
                    <svg viewBox="0 0 60 60" className="w-full h-full">
                      <rect
                        x="10"
                        y="10"
                        width="40"
                        height="40"
                        rx="5"
                        fill="white"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r="8"
                        fill="white"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
       {/* Key Features */}
      <section
        id="about"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
      >
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
              on patient satisfaction and health outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Stethoscope,
                title: "Expert Doctors",
                desc: "Highly qualified specialists with years of experience in their respective fields",
                color: "from-brand-red to-brand-red",
              },
              {
                icon: Heart,
                title: "Patient Care",
                desc: "Personalized treatment plans designed for optimal results and recovery",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: Clock,
                title: "24/7 Available",
                desc: "Round-the-clock emergency and support services whenever you need us",
                color: "from-blue-500 to-blue-600",
              },
              
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Services Section */}
      <ServicesSection services={services} limit={6} showViewAll={true} />

      {/* How it Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Your journey to better health in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0" />
            {[
              { step: "1", icon: Search, title: "Find a Doctor", desc: "Search by specialty, name, or rating to find the perfect specialist for your needs." },
              { step: "2", icon: Calendar, title: "Book Online", desc: "Choose an available time slot and book your appointment instantly online." },
              { step: "3", icon: Heart, title: "Get Care", desc: "Visit the hospital and receive world-class medical care from our experts." }
            ].map((s, idx) => (
              <div key={idx} className="text-center relative">
                 <div className="w-24 h-24 mx-auto bg-white border-4 border-[oklch(0.77_0.18_186.55)] rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10 transition-transform hover:scale-110 ">
                    <s.icon className="w-10 h-10 text-[oklch(0.77_0.18_186.55)]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold">{s.step}</div>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-3">{s.title}</h3>
                 <p className="text-gray-600 max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Doctors Section */}
      <section
        id="doctors"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-purple-700 font-semibold text-sm mb-4">
              Our Team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              Experienced medical professionals dedicated to your health and
              well-being
            </p>
            <Button
              onClick={() => navigate("/doctors")}
              variant="primary"
              size="lg"
            >
              View All Doctors
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
              <p className="mt-4 text-gray-600">Loading doctors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 font-semibold mb-2">
                  Connection Error
                </p>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <Button
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    const fetchDoctors = async () => {
                      try {
                        const data = await doctorApi.getAll();
                        const validDoctors = data
                          .filter((doc) => doc.name && doc.specialty)
                          .slice(0, 6);
                        setDoctors(validDoctors);
                      } catch (err) {
                        if (
                          err.code === "ECONNREFUSED" ||
                          err.message.includes("Network Error")
                        ) {
                          setError(
                            "Cannot connect to server. Please make sure JSON Server is running on http://localhost:3000"
                          );
                        } else {
                          setError(
                            "Failed to load doctors. Please try again later."
                          );
                        }
                      } finally {
                        setLoading(false);
                      }
                    };
                    fetchDoctors();
                  }}
                  variant="primary"
                  size="sm"
                >
                  Retry Connection
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Run:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    npm run server
                  </code>
                </p>
              </div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No doctors available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {doctors.map((doctor, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:border-brand-red/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="h-96 bg-gray-100 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <svg
                          width="120"
                          height="120"
                          viewBox="0 0 120 120"
                          className="opacity-50"
                          role="img"
                          aria-label={`Avatar for ${doctor.name}`}
                        >
                          <rect
                            x="10"
                            y="10"
                            width="100"
                            height="100"
                            rx="20"
                            fill="currentColor"
                          />
                          <text
                            x="50%"
                            y="55%"
                            textAnchor="middle"
                            fill="white"
                            fontSize="32"
                            fontWeight="700"
                            fontFamily="Inter, system-ui"
                          >
                            {getInitials(doctor.name)}
                          </text>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {doctor.name.startsWith("Dr.")
                        ? doctor.name
                        : `Dr. ${doctor.name}`}
                    </h3>
                    <p className="text-brand-red font-semibold mb-4">
                      {doctor.specialty || "General Practice"}
                    </p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(doctor.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-gray-600 ml-2 text-sm">
                        {doctor.rating ? doctor.rating.toFixed(1) : "N/A"}
                        {doctor.reviewCount > 0 && ` (${doctor.reviewCount})`}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/doctors/${doctor.id}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleBookAppointment(doctor)}
                        variant="primary"
                        size="sm"
                        className="flex-1"
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Patient Reviews Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full text-yellow-700 font-semibold text-sm mb-4">
              Patient Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Read authentic reviews from patients who have experienced our care firsthand.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.length > 0  ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 relative"
                >
                  <Quote className="absolute top-8 right-8 w-12 h-12 text-gray-200" />
                  <div className="flex items-center gap-1 mb-6">
                    { [...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed relative z-10">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red font-bold text-xl">
                      {getInitials(review.patientName || "Anonymous")}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {review.patientName || "Anonymous Patient"}
                      </h4>
                      <p className="text-sm text-gray-500">Verified Patient</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No reviews yet. Be the first to share your experience!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA 
        onPrimaryClick={() => handleBookAppointment()} 
        onSecondaryClick={() => scrollToSection("contact")} 
      />

      {/* Appointment Booking Modal */}
      {showBookingModal && (
        <AppointmentBooking
          doctorId={selectedDoctor?.id}
          doctorName={selectedDoctor?.name}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDoctor(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Trust Banner / Partners */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
           <h3 className="text-xl font-bold text-gray-400 mb-8 uppercase tracking-widest">Recognized By & Accepted Insurances</h3>
           <div className="flex flex-wrap justify-center gap-12 items-center opacity-60 hover:opacity-100 transition-all duration-500">
             {["AETNA", "BLUECROSS", "CIGNA", "MEDICARE", "UNITEDHEALTH"].map(partner => (
               <div key={partner} className="text-2xl md:text-3xl font-black text-gray-400 hover:text-[oklch(0.77_0.18_186.55)] transition-colors cursor-default">
                 {partner}
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Floating CTA for Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => handleBookAppointment()}
          variant="primary"
          className="shadow-2xl rounded-full h-14 w-14 flex items-center justify-center p-0"
        >
          <Calendar className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Home;
