import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import DataTable from '../../components/ui/DataTable';
import { apiRequest } from '../../api/api';
import './Users.css';

const OwnersTable = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/Admin/view_all_owners');
      setOwners(data.owners || []);
    } catch (err) {
      console.error('Failed to fetch owners:', err);
      // Fallback
      setOwners([
          { id: 'OW-01', name: 'Mario Rossi', email: 'mario@pasta.it', phone: '+1-555-0199', company: 'Mario\'s Italian Catering', joinedDate: '2025-10-12', verified: true },
          { id: 'OW-02', name: 'Suki Yamamoto', email: 'suki@zen.jp', phone: '+1-555-0102', company: 'Zen Fusion Events', joinedDate: '2026-01-05', verified: true },
          { id: 'OW-03', name: 'Robert Fox', email: 'robert@fox.com', phone: '+1-555-0123', company: 'Fox Party Rentals', joinedDate: '2026-02-28', verified: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this owner? This action cannot be undone.')) {
      try {
        await apiRequest(`/Admin/delete_owner/${id}`, { method: 'DELETE' });
        setOwners(owners.filter(o => o.id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete owner. Please try again.');
      }
    }
  };

  const columns = [
    { 
      header: 'Owner', 
      cell: (row) => (
        <div className="user-profile">
          <div className="user-avatar">{row.name.charAt(0)}</div>
          <div className="user-info">
             <div className="user-name">{row.name} {row.verified && <ShieldCheck size={14} className="verified-icon" />}</div>
             <div className="user-email">{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Catering Entity', 
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={16} className="text-dim" />
          <span>{row.company}</span>
        </div>
      )
    },
    { 
      header: 'Contact', 
      cell: (row) => (
         <div className="contact-info">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {row.phone}</span>
         </div>
      )
    },
    { header: 'Joined', accessor: 'joinedDate' },
    { 
      header: 'Management', 
      cell: (row) => (
        <div className="table-actions">
          <button className="action-btn-view"><ExternalLink size={18} /></button>
          <button className="action-btn-delete" onClick={() => handleDelete(row.id)}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="user-section">
      <header className="page-header">
        <div className="header-text">
          <h1>Catering Partners</h1>
          <p>Control partner access and view business performance</p>
        </div>
      </header>

      <GlassCard className="table-card" delay={0.1}>
        <DataTable columns={columns} data={owners} loading={loading} />
      </GlassCard>
    </div>
  );
};

export default OwnersTable;
