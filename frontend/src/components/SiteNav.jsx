import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { businessInfo } from '../data/mock';
import Logo from './Logo';

const SiteNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isSystemPage = location.pathname === '/system';
  const isDemoPage = location.pathname === '/demo-electrician-site';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-ink/20 backdrop-blur-md border-b border-border'
          : 'bg-ink/10 backdrop-blur-md border-b border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isSystemPage && (
              <a
                href="#demo"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-muted' : 'text-white/90'
                }`}
              >
                See the 10-second demo
              </a>
            )}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCTAClick}
              className={`transition-all rounded-xl ${
                isScrolled
                  ? 'bg-primary hover:bg-primary/90 text-white'
                  : 'bg-white text-ink hover:bg-white/90'
              }`}
            >
              Book 5-min fit check
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`hidden p-2 rounded-lg transition-colors ${
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
            {isSystemPage && (
              <>
                <a
                  href="#demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-text font-medium rounded-lg hover:bg-surface2 transition-colors"
                >
                  See the 10-second demo
                </a>
              </>
            )}
            {isDemoPage && (
              <>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-text font-medium rounded-lg hover:bg-surface2 transition-colors"
                >
                  Services
                </a>
                <a
                  href="#reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-text font-medium rounded-lg hover:bg-surface2 transition-colors"
                >
                  Reviews
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-text font-medium rounded-lg hover:bg-surface2 transition-colors"
                >
                  Contact
                </a>
              </>
            )}
            <Button
              onClick={handleCTAClick}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-6 rounded-xl"
            >
              Book 5-min fit check
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteNav;
