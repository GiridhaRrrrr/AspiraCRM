import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-card border-b border-border' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              AspiraCRM
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Contact
            </button>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleAuthAction}
                    variant="ghost"
                    className="font-medium"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="font-medium"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => navigate('/register')}
                    variant="ghost"
                    className="font-medium"
                  >
                    Register
                  </Button>
                  <Button
                    onClick={handleAuthAction}
                    className="bg-gradient-primary hover:shadow-primary font-medium"
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-border"
            >
              <div className="py-4 space-y-4">
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left px-4 py-2 text-foreground hover:text-primary transition-smooth font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="block w-full text-left px-4 py-2 text-foreground hover:text-primary transition-smooth font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left px-4 py-2 text-foreground hover:text-primary transition-smooth font-medium"
                >
                  Contact
                </button>
                
                <div className="px-4 pt-2 border-t border-border space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Button
                        onClick={handleAuthAction}
                        variant="ghost"
                        className="w-full justify-start font-medium"
                      >
                        Dashboard
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-start font-medium"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => { navigate('/register'); setIsOpen(false); }}
                        variant="ghost"
                        className="w-full justify-start font-medium"
                      >
                        Register
                      </Button>
                      <Button
                        onClick={() => { handleAuthAction(); setIsOpen(false); }}
                        className="w-full justify-start bg-gradient-primary hover:shadow-primary font-medium"
                      >
                        Login
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;