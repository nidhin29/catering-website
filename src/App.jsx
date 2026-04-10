import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import LoginPage from './pages/Login/LoginPage';
import MainDashboard from './pages/Dashboard/MainDashboard';
import BookingManager from './pages/Bookings/BookingManager';
import OwnersTable from './pages/Users/OwnersTable';
import CustomersTable from './pages/Users/CustomersTable';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><MainDashboard /></Layout>} />
            <Route path="/bookings" element={<Layout><BookingManager /></Layout>} />
            <Route path="/owners" element={<Layout><OwnersTable /></Layout>} />
            <Route path="/customers" element={<Layout><CustomersTable /></Layout>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
