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
<<<<<<< HEAD
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Proof', href: '#proof' },
=======
    { label: 'Why Us', href: '#why-us' },
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
<<<<<<< HEAD
          ? 'bg-ink/95 backdrop-blur-md shadow-sm border-b border-border'
=======
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
<<<<<<< HEAD
              isScrolled ? 'bg-primary' : 'glass-card'
            }`}>
              <span className="text-xl font-bold text-white">BE</span>
            </div>
            <span className={`font-semibold text-lg hidden sm:block transition-colors ${
              isScrolled ? 'text-text' : 'text-white'
=======
              isScrolled ? 'bg-blue-600' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <span className={`text-xl font-bold ${
                isScrolled ? 'text-white' : 'text-white'
              }`}>BE</span>
            </div>
            <span className={`font-semibold text-lg hidden sm:block transition-colors ${
              isScrolled ? 'text-slate-800' : 'text-white'
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
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
<<<<<<< HEAD
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-muted' : 'text-white/90'
=======
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  isScrolled ? 'text-slate-600' : 'text-white/90'
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
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
<<<<<<< HEAD
                className={`transition-all rounded-xl ${
                  isScrolled
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-white text-ink hover:bg-white/90'
=======
                className={`transition-all ${
                  isScrolled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white text-slate-800 hover:bg-blue-50'
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
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
<<<<<<< HEAD
                isScrolled ? 'text-text hover:bg-surface2' : 'text-white hover:bg-white/10'
=======
                isScrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
<<<<<<< HEAD
        <div className="md:hidden bg-ink border-t border-border shadow-lg animate-in slide-in-from-top-2 duration-200">
=======
        <div className="md:hidden bg-white border-t shadow-lg animate-in slide-in-from-top-2 duration-200">
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
                className="block py-3 px-4 text-text font-medium rounded-lg hover:bg-surface2 transition-colors"
=======
                className="block py-3 px-4 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${businessInfo.phone}`}
              className="block mt-4"
            >
<<<<<<< HEAD
              <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl">
=======
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
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
