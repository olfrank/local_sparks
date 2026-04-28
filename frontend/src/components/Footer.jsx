import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { businessInfo } from '../data/mock';
import Logo from './Logo';
import { motion, useReducedMotion } from 'framer-motion';

const Footer = () => {
  const prefersReducedMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-muted border-t border-border">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo size="md" />
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
                <a href={`mailto:${businessInfo.email}`} className="hover:text-primary transition-colors text-base">
                  {businessInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted text-base">
              © {currentYear} {businessInfo.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-base">
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
