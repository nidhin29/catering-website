import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, User, Search } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import DataTable from '../../components/ui/DataTable';
import { apiRequest } from '../../api/api';
import './Users.css';

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/Admin/get_all_customers');
      setCustomers(data.customers || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      // Fallback
      setCustomers([
          { id: 'C-001', name: 'Alice Walker', email: 'alice@gmail.com', phone: '+1-202-555-0158', lastOrder: '2026-03-22', totalSpent: 1250 },
          { id: 'C-002', name: 'James Wilson', email: 'james.w@outlook.com', phone: '+1-202-555-0172', lastOrder: '2026-04-05', totalSpent: 450 },
          { id: 'C-003', name: 'Maria Garcia', email: 'maria.garcia@icloud.com', phone: '+1-202-555-0104', lastOrder: '2026-02-14', totalSpent: 890 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      header: 'Customer', 
      cell: (row) => (
        <div className="user-profile">
          <div className="user-avatar" style={{ backgroundColor: 'var(--accent-secondary)' }}><User size={20} /></div>
          <div className="user-info">
             <div className="user-name">{row.name}</div>
             <div className="user-email">{row.email}</div>
          </div>
        </div>
      )
    },
    { header: 'Contact', accessor: 'phone' },
    { 
      header: 'Recent Activity', 
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
          <Calendar size={14} /> {row.lastOrder}
        </div>
      )
    },
    { 
      header: 'Spend', 
      cell: (row) => <span style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>${row.totalSpent.toLocaleString()}</span>
    }
  ];

  return (
    <div className="user-section">
      <header className="page-header">
        <div className="header-text">
          <h1>Platform Customers</h1>
          <p>Monitor customer engagement and transaction history</p>
        </div>
      </header>

      <div className="filter-bar glass-effect" style={{ marginBottom: '24px' }}>
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by Name or Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <GlassCard className="table-card" delay={0.2}>
        <DataTable columns={columns} data={filteredCustomers} loading={loading} />
      </GlassCard>
    </div>
  );
};

export default CustomersTable;
