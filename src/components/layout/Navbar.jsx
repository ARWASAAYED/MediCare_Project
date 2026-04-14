import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Heart, LogOut, User, Menu, X, Sparkles, Calendar } from "lucide-react";
import Button from "../common/Button";

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClasses = "text-gray-600 hover:text-brand-red transition-colors duration-200 font-medium relative group py-2";
  const activeIndicator = "absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full";

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative transform transition-transform group-hover:scale-110 duration-200">
              <Heart className="w-8 h-8 text-[oklch(0.88_0.08_186.55)] fill-brand-red/10" aria-hidden />
              <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.88_0.08_186.55)] to-pink-200 bg-clip-text text-transparent">
              MediCare
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLinkClasses} >
              Home
              <span className={activeIndicator} />
            </Link>
            <Link to="/services" className={navLinkClasses}>
              Services
              <span className={activeIndicator} />
            </Link>
            <Link to="/doctors" className={navLinkClasses}>
              Doctors
              <span className={activeIndicator} />
            </Link>
            <Link to="/about" className={navLinkClasses}>
              About
              <span className={activeIndicator} />
            </Link>
            <Link to="/contact" className={navLinkClasses}>
              Contact
              <span className={activeIndicator} />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:inline">{user.name || user.username}</span>
                </Link>
                <Link
                  to={user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium"
                >
                  appointments
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-red/5 rounded-xl transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="hidden md:inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[oklch(0.77_0.18_186.55)] hover:opacity-90 rounded-xl shadow-lg hover:shadow-brand-red/20 transition-all duration-200"
                >
                  <Calendar className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out absolute w-full shadow-xl`}
      >
        <div className="px-4 py-6 space-y-3">
          {["Home", "Services", "Doctors", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : item === "Services" ? "/services" : item === "Doctors" ? "/doctors" : item === "Contact" ? "/contact" : item === "About" ? "/about" : "/"}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-brand-red/5 hover:text-brand-red transition-all"
            >
              {item}
            </Link>
          ))}
          
          <div className="h-px bg-gray-100 my-4" />

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-brand-red/5 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red">
                  <User className="w-4 h-4" />
                </div>
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl text-gray-700 font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl bg-brand-red text-white font-semibold shadow-lg hover:opacity-90 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
