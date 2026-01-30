import React, { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { businessInfo } from '../data/mock';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Proof', href: '#proof' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-ink/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isScrolled ? 'bg-primary' : 'glass-card'
            }`}>
              <span className="text-xl font-bold text-white">BE</span>
            </div>
            <span className={`font-semibold text-lg hidden sm:block transition-colors ${
              isScrolled ? 'text-text' : 'text-white'
            }`}>
              {businessInfo.name}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-muted' : 'text-white/90'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${businessInfo.phone}`}
              className="hidden md:flex items-center gap-2"
            >
              <Button
                className={`transition-all rounded-xl ${
                  isScrolled
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-white text-ink hover:bg-white/90'
                }`}
              >
                <Phone className="w-4 h-4 mr-2" />
                {businessInfo.phoneFormatted}
              </Button>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-text hover:bg-surface2' : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ink border-t border-border shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-text font-medium rounded-lg hover:bg-surface2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${businessInfo.phone}`}
              className="block mt-4"
            >
              <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl">
                <Phone className="w-5 h-5 mr-2" />
                Call {businessInfo.phoneFormatted}
              </Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
