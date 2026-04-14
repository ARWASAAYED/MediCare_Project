import React from "react";
import { Phone, Mail, MapPin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-brand-red" />
              <span className="text-2xl font-bold">MediCare</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Providing excellence in healthcare services with compassion,
              innovation, and dedication to patient care.
            </p>
            <div className="flex gap-4">
              {[
                { icon: "", label: "Facebook" },
                { icon: "", label: "Instagram" },
                { icon: "", label: "Twitter" },
              ].map((social, idx) => (
                <button
                  key={idx}
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-brand-red transition-colors flex items-center justify-center text-lg"
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              {[
                "About Us",
                "Services",
                "Doctors",
                "Contact",
                "Careers",
              ].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(" ", "")}`} className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-3 text-gray-400">
              {[
                "Emergency Care",
                "General Surgery",
                "Cardiology",
                "Neurology",
                "Pediatrics",
              ].map((service) => (
                <li key={service}>
                  <a href="#" className="hover:text-white transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Phone</div>
                  <div>+1 (555) 123-4567</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Email</div>
                  <div>info@medicare.com</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Address</div>
                  <div>123 Health Street, Medical City</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-center md:text-left">
            &copy; 2025 MediCare Hospital. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
