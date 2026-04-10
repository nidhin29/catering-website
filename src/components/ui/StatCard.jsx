import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, trend, icon: Icon, trendType = 'up', delay = 0 }) => {
  return (
    <motion.div 
      className="stat-card glass-effect"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="stat-header">
        <div className="stat-icon-wrap">
          <Icon size={24} className="stat-icon" />
        </div>
        {trend && (
           <div className={`stat-trend ${trendType}`}>
             {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
             <span>{trend}%</span>
           </div>
        )}
      </div>
      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <h2 className="stat-value">{value}</h2>
      </div>
      <div className="stat-visual-glow"></div>
    </motion.div>
  );
};

export default StatCard;
