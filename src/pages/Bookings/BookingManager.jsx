import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Eye, Clock, Mail } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import DataTable from '../../components/ui/DataTable';
import { apiRequest } from '../../api/api';
import './Bookings.css';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiRequest('/api/v1/admin/view_all_bookings');
        setBookings(response.data || response || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        // Fallback for demo
        setBookings([
          { id: 'BK-101', customer: 'John Doe', event: 'Corporate Gala', date: '2026-05-15', status: 'Completed', amount: 4500, location: 'San Francisco' },
          { id: 'BK-102', customer: 'Sarah Smith', event: 'Wedding Reception', date: '2026-06-20', status: 'Process', amount: 8200, location: 'New York' },
          { id: 'BK-103', customer: 'Tech Corp', event: 'Annual Summit', date: '2026-05-28', status: 'Pending', amount: 3100, location: 'Chicago' },
          { id: 'BK-104', customer: 'Emma Watson', event: 'Birthday Party', date: '2026-04-12', status: 'Cancelled', amount: 1500, location: 'Los Angeles' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.service?.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || b.work_status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const columns = [
    { 
      header: 'Booking ID', 
      accessor: '_id',
      cell: (row) => <span style={{ fontFamily: 'Outfit', fontWeight: 'bold', color: 'var(--accent-primary)' }}>#{row._id?.slice(-6).toUpperCase()}</span>
    },
    { 
      header: 'Customer', 
      accessor: 'customer_email',
      cell: (row) => (
        <div style={{ fontWeight: '500' }}>{row.customer_email}</div>
      )
    },
    { 
      header: 'Service', 
      accessor: 'service.service_name',
      cell: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ color: '#fff' }}>{row.service?.service_name || 'N/A'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} /> {row.datetime ? new Date(row.datetime).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      )
    },
    { 
      header: 'Owner', 
      accessor: 'owner_email',
      hideOnMobile: true,
      cell: (row) => (
        <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Mail size={14} className="text-muted" /> {row.owner_email}
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'work_status',
      cell: (row) => (
        <span className={`status-badge ${(row.work_status || 'Pending').toLowerCase().replace(' ', '-')}`}>
          {row.work_status || 'Pending'}
        </span>
      )
    },
    { 
      header: 'Payment', 
      accessor: 'payment_status',
      cell: (row) => (
        <span className={`status-badge ${(row.payment_status || 'Unpaid').toLowerCase()}`}>
          {row.payment_status || 'Unpaid'}
        </span>
      )
    },
    { 
      header: 'Total Earnings', 
      accessor: 'owner_payout',
      cell: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>₹{(row.owner_payout || (row.service?.rate * 0.9) || 0).toLocaleString()}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Value: ₹{(row.service?.rate || 0).toLocaleString()}</span>
        </div>
      )
    },
    { 
      header: 'Actions', 
      cell: (row) => (
        <button className="action-btn-view">
          <Eye size={18} />
        </button>
      )
    }
  ];

  return (
    <div className="bookings-page">
      <header className="page-header">
        <div className="header-text">
          <h1>Booking Manager</h1>
          <p>Supervise and coordinate event reservations</p>
        </div>
      </header>

      <div className="filter-bar glass-effect">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by ID, Customer, or Event..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <div className="filter-group">
            <Filter size={18} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="In Kitchen">In Kitchen</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <GlassCard className="table-card">
        <DataTable 
          columns={columns} 
          data={filteredBookings} 
          loading={loading} 
        />
      </GlassCard>
    </div>
  );
};

export default BookingManager;
