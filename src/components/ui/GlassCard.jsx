import React from 'react';
import { motion } from 'framer-motion';
import './GlassCard.css';

const GlassCard = ({ children, title, subtitle, icon: Icon, className = '', delay = 0 }) => {
  return (
    <motion.div 
      className={`glass-card-container ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {(title || Icon) && (
        <div className="card-header">
          <div className="header-info">
            {Icon && <Icon className="title-icon" size={20} />}
            <div className="text-content">
              {title && <h3>{title}</h3>}
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
