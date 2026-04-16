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
      const response = await apiRequest('/api/v1/admin/view_all_owners');
      setOwners(response.data || response || []);
    } catch (err) {
      console.error('Failed to fetch owners:', err);
      // Fallback
      setOwners([
          { _id: '1', companyName: "Mario's Italian", username: 'mario_rossi', email: 'mario@pasta.it', verificationStatus: 'verified', createdAt: '2025-10-12T00:00:00Z' },
          { _id: '2', companyName: 'Zen Fusion', username: 'suki_y', email: 'suki@zen.jp', verificationStatus: 'verified', createdAt: '2026-01-05T00:00:00Z' },
          { _id: '3', companyName: 'Fox Party', username: 'robert_fox', email: 'robert@fox.com', verificationStatus: 'pending', createdAt: '2026-02-28T00:00:00Z' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.companyName || user.username}? This action cannot be undone.`)) {
      try {
        await apiRequest(`/api/v1/admin/delete_owner`, { 
          method: 'DELETE',
          body: JSON.stringify({ email_id_owner: user.email })
        });
        setOwners(owners.filter(o => o.email !== user.email));
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
          <div className="user-avatar">{(row.companyName || row.username || 'O').charAt(0)}</div>
          <div className="user-info">
             <div className="user-name">
               {row.companyName} 
               {row.verificationStatus === 'verified' && <ShieldCheck size={14} className="verified-icon" />}
             </div>
             <div className="user-email">{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Username', 
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-dim">@</span>
          <span>{row.username}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      hideOnMobile: true,
      cell: (row) => (
         <div className="contact-info">
            <span className={`status-badge ${row.verificationStatus}`}>
              {row.verificationStatus?.toUpperCase() || 'UNKNOWN'}
            </span>
         </div>
      )
    },
    { 
      header: 'Joined', 
      cell: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'
    },
    { 
      header: 'Management', 
      cell: (row) => (
        <div className="table-actions">
          <button className="action-btn-view" title="View Details"><ExternalLink size={18} /></button>
          <button className="action-btn-delete" title="Delete Owner" onClick={() => handleDelete(row)}><Trash2 size={18} /></button>
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
