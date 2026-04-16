import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  CalendarCheck, 
  Users, 
  UserCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  ChefHat,
  ShieldCheck,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isMobile = false, isOpen = false, onClose = () => {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard',    path: '/',          icon: LayoutDashboard },
    { name: 'Verification', path: '/verify',    icon: ShieldCheck },
    { name: 'Bookings',     path: '/bookings',  icon: CalendarCheck },
    { name: 'Owners',       path: '/owners',    icon: ChefHat },
    { name: 'Customers',    path: '/customers', icon: Users },
  ];

  const handleNavClick = () => {
    if (isMobile) onClose();
  };

  // On mobile: fixed drawer driven by isOpen prop
  // On desktop: sticky sidebar driven by isCollapsed state
  const desktopWidth = isCollapsed ? 80 : 280;

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar sidebar-mobile"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            {/* Close button */}
            <div className="sidebar-header">
              <div className="logo">
                <div className="logo-icon"><ChefHat size={24} color="#6366f1" /></div>
                <span>EVENT<span>ADMIN</span></span>
              </div>
              <button className="collapse-btn" onClick={onClose} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <item.icon className="nav-icon" size={22} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="sidebar-footer">
              <div className="admin-info">
                <div className="admin-avatar">
                  <UserCircle size={30} color="#6366f1" />
                </div>
                <div className="admin-details">
                  <p className="admin-name">{adminUser?.name || 'Admin'}</p>
                  <p className="admin-role">{adminUser?.role || 'Administrator'}</p>
                </div>
              </div>
              <button className="logout-btn" onClick={logout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop / Tablet sidebar
  return (
    <motion.div
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      animate={{ width: desktopWidth }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="sidebar-header">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="logo-icon"><ChefHat size={24} color="#6366f1" /></div>
              <span>EVENT<span>ADMIN</span></span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" size={22} />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <motion.div className="admin-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="admin-avatar">
              <UserCircle size={30} color="#6366f1" />
            </div>
            <div className="admin-details">
              <p className="admin-name">{adminUser?.name || 'Admin'}</p>
              <p className="admin-role">{adminUser?.role || 'Administrator'}</p>
            </div>
          </motion.div>
        )}
        <button className="logout-btn" onClick={logout}>
          <LogOut size={isCollapsed ? 22 : 20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
