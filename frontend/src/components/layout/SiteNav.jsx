import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/button';
import Logo from './Logo';

const SiteNav = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isSystemPage = location.pathname === '/system';
  const isLiveDemoPage = location.pathname === '/demo';
  const isOnboardPage = location.pathname === '/onboard';

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
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-ink/20 backdrop-blur-md border-b border-border'
          : 'bg-ink/10 backdrop-blur-md border-b border-transparent'
      }`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo size="md" />

          

        
          <div className="flex items-center gap-3">
           
              {!isOnboardPage && (
                <Link
                  to="/onboard"
                  className={`cg-label text-base font-medium transition-colors ${
                    isScrolled ? 'text-primary hover:text-primary/80' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span className="hidden sm:inline">Start free trial</span>
                  <span className="sm:hidden">Start trial</span>
                </Link>
              )}

              {!isLiveDemoPage && (
                <Button
                  onClick={() => navigate('/demo')}
                  variant="outline"
                  size="sm"
                  className={`text-base transition-all rounded-xl ${
                    isScrolled
                      ? 'border-border text-white hover:bg-surface2 bg-primary'
                      : 'border-white/40 text-black hover:bg-white/10 bg-white'
                  }`}
                >
                  Try demo
                </Button>
              )}

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
                  See the 5 second demo
                </a>
              </>
            )}
<Button
              onClick={handleCTAClick}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-6 rounded-xl"
            >
              Book 5 min fit check
            </Button>
          </nav>
        </div>
      )}
    </motion.header>
  );
};

export default SiteNav;
