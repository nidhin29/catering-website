import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  CalendarCheck, 
  Users, 
  UserCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  ChefHat
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { name: 'Owners', path: '/owners', icon: ChefHat },
    { name: 'Customers', path: '/customers', icon: Users },
  ];

  return (
    <motion.div 
      className={`sidebar glass-effect ${isCollapsed ? 'collapsed' : ''}`}
      animate={{ width: isCollapsed ? 80 : 280 }}
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
              <div className="logo-icon"><ChefHat size={32} color="#10b981" /></div>
              <span>EVENT<span>ADMIN</span></span>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
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
            <item.icon className="nav-icon" size={24} />
            {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{item.name}</motion.span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <motion.div className="admin-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="admin-avatar">
               <UserCircle size={32} color="#94a3b8" />
            </div>
            <div className="admin-details">
              <p className="admin-name">{adminUser?.name || 'Admin'}</p>
              <p className="admin-role">{adminUser?.role || 'Administrator'}</p>
            </div>
          </motion.div>
        )}
        <button className="logout-btn" onClick={logout}>
          <LogOut size={24} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
