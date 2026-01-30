import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { businessInfo } from '../data/mock';

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const isDemoPage = location.pathname === '/demo-electrician-site';
  
  const quickLinks = isDemoPage 
    ? [
        { label: 'Services', href: '#services' },
        { label: 'Why Us', href: '#why-us' },
        { label: 'Reviews', href: '#reviews' },
        { label: 'Contact', href: '#contact' }
      ]
    : [
        { label: 'System', href: '/system' },
        { label: 'How It Works', href: '/system#how-it-works' },
        { label: 'Proof', href: '/system#proof' },
        { label: 'Contact', href: '/system#contact' }
      ];

  return (
    <footer className="bg-ink text-muted border-t border-border">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold">BE</span>
              </div>
              <span className="font-semibold text-lg text-text">{businessInfo.name}</span>
            </div>
            <p className="text-muted mb-6 max-w-md leading-relaxed">
            The safety net that stops missed calls turning into lost jobs
            </p>
            {/* <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface2 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface2 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div> */}
          </div>

         

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-text mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${businessInfo.phone}`} className="hover:text-primary transition-colors">
                  {businessInfo.phoneFormatted}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${businessInfo.email}`} className="hover:text-primary transition-colors text-sm">
                  {businessInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 min-w-4 min-h-4" />
                <span>{businessInfo.location} and surrounding areas</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span>24/7 Emergency Service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted text-sm">
              © {currentYear} {businessInfo.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted hover:text-text transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted hover:text-text transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
