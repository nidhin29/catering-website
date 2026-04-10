import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <motion.main 
        className="main-viewport"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="content-wrap">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;
