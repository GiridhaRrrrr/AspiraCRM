import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/customers'
    },
    {
      icon: MessageSquare,
      label: 'Interactions',
      path: '/interactions'
    },
    {
      icon: BarChart3,
      label: 'Reports',
      path: '/reports'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile'
    }
  ];

  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '4rem' }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto'
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {!isCollapsed && (
              <span className="font-heading font-bold text-lg text-foreground">
                AspiraCRM
              </span>
            )}
          </motion.div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth group ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <motion.span
              animate={{
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : 'auto'
              }}
              transition={{ duration: 0.2 }}
              className="font-medium whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          {/* User Info */}
          <motion.div
            animate={{
              opacity: isCollapsed ? 0 : 1,
              height: isCollapsed ? 0 : 'auto'
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive flex-1"
            >
              <LogOut className="h-4 w-4" />
              <motion.span
                animate={{
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto'
                }}
                transition={{ duration: 0.2 }}
                className="ml-2 whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-card border-r border-border h-screen sticky top-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50"
          >
            <SidebarContent />
          </motion.aside>
        </>
      )}
    </>
  );
};

export default Sidebar;