import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Star,
  Stethoscope,
  Search,
  Filter,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";
import { doctorApi } from "../../api/doctorApi";
import { reviewApi } from "../../api/reviewApi";
import AppointmentBooking from "../../components/AppointmentBooking";
import Button from "../../components/common/Button";

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const specialtyParam = searchParams.get("specialty");
    if (specialtyParam) {
      setSelectedSpecialty(specialtyParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [doctorsData, reviewsData] = await Promise.all([
          doctorApi.getAll(),
          reviewApi.getAll()
        ]);

        // Calculate ratings
        const validDoctors = doctorsData
          .filter((doc) => doc.name && doc.specialty)
          .map(doc => {
            const docReviews = reviewsData.filter(r => r.doctorId === doc.id);
            const avgRating = docReviews.length > 0
              ? docReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / docReviews.length
              : 0;
            return { ...doc, rating: avgRating, reviewCount: docReviews.length };
          });

        setDoctors(validDoctors);
        setFilteredDoctors(validDoctors);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.code === "ECONNREFUSED" || err.message.includes("Network Error")) {
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

  useEffect(() => {
    let filtered = doctors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(
        (doc) => doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, doctors]);

  const getUniqueSpecialties = () => {
    const specialties = doctors.map((doc) => doc.specialty);
    return [...new Set(specialties)].sort();
  };

  const getGradient = (index) => {
    const gradients = [
      "from-brand-red to-pink-600",
      "from-blue-500 to-indigo-600",
      "from-green-500 to-teal-600",
      "from-purple-500 to-purple-600",
      "from-orange-500 to-orange-600",
      "from-yellow-500 to-yellow-600",
    ];
    return gradients[index % gradients.length];
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleViewDetails = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <p className="text-red-800 font-semibold mb-2">Connection Error</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[oklch(0.77_0.18_186.55)] mb-4">
              Our Medical Team
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Experienced medical professionals dedicated to providing the best
              healthcare services
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Specialties</option>
                {getUniqueSpecialties().map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No doctors found</p>
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-600">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, idx) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:border-brand-red/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
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
                    <p className="text-brand-red font-semibold mb-3">
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
                        onClick={() => handleViewDetails(doctor.id)}
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
                        className="flex-1 gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <AppointmentBooking
          doctorId={selectedDoctor?.id}
          doctorName={selectedDoctor?.name}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDoctor(null);
          }}
          onSuccess={() => {
            setShowBookingModal(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
};

export default DoctorsPage;

