import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  FileText, 
  Building2, 
  Mail,
  Clock,
  AlertCircle
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import DataTable from '../../components/ui/DataTable';
import { apiRequest } from '../../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const VerificationCenter = () => {
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  const fetchPendingOwners = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/v1/admin/pending-owners');
      setPendingOwners(response.data || response || []);
    } catch (err) {
      console.error('Failed to fetch pending owners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (owner, status) => {
    setSelectedOwner(owner);
    setSelectedStatus(status);
    setRemarks('');
    setShowRemarksModal(true);
  };

  const submitVerification = async () => {
    if (!selectedOwner) return;
    
    setActioningId(selectedOwner._id);
    try {
      await apiRequest(`/api/v1/admin/verify-owner/${selectedOwner._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          status: selectedStatus, 
          remarks: remarks 
        })
      });
      
      // Update local state
      setPendingOwners(prev => prev.filter(o => o._id !== selectedOwner._id));
      setShowRemarksModal(false);
      setSelectedOwner(null);
    } catch (err) {
      console.error('Verification failed:', err);
      alert('Action failed. Please check the console for details.');
    } finally {
      setActioningId(null);
    }
  };

  const columns = [
    {
      header: 'Business Details',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={20} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#fff' }}>{row.companyName || row.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={12} /> {row.email}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Documentation',
      cell: (row) => (
        <a 
          href={row.license_document} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: '#6366f1',
            textDecoration: 'none',
            fontSize: '0.9rem',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(99, 102, 241, 0.05)'
          }}
        >
          <FileText size={16} />
          <span>View License</span>
          <ExternalLink size={14} />
        </a>
      )
    },
    {
      header: 'Submitted At',
      cell: (row) => (
        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} />
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => handleActionClick(row, 'verified')}
            disabled={actioningId === row._id}
            style={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.1)', 
              color: '#22c55e', 
              border: '1px solid rgba(34, 197, 94, 0.2)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem'
            }}
          >
            <CheckCircle size={16} /> Approve
          </button>
          <button 
            onClick={() => handleActionClick(row, 'rejected')}
            disabled={actioningId === row._id}
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem'
            }}
          >
            <XCircle size={16} /> Reject
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="verification-page" style={{ padding: '20px' }}>
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div className="header-text">
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff' }}>Verification Center</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Review and validate business applications for the platform</p>
        </div>
      </header>

      {pendingOwners.length === 0 && !loading ? (
        <GlassCard style={{ padding: '48px', textAlign: 'center' }}>
          <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h2 style={{ color: '#fff', fontSize: '1.25rem' }}>All Caught Up!</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>There are no pending owner applications at the moment.</p>
        </GlassCard>
      ) : (
        <GlassCard className="table-card">
          <DataTable columns={columns} data={pendingOwners} loading={loading} />
        </GlassCard>
      )}

      {/* Modal for Remarks */}
      <AnimatePresence>
        {showRemarksModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: '#1a1a1c',
                borderRadius: '16px',
                padding: '24px',
                width: '100%',
                maxWidth: '450px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>
                Confirm {selectedStatus === 'verified' ? 'Approval' : 'Rejection'}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Are you sure you want to {selectedStatus === 'verified' ? 'approve' : 'reject'} <strong>{selectedOwner?.companyName}</strong>?
              </p>
              
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>
                Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter any feedback for the owner..."
                style={{
                  width: '100%',
                  height: '100px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#fff',
                  resize: 'none',
                  marginBottom: '24px',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowRemarksModal(false)}
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: 'rgba(255,255,255,0.5)', 
                    border: 'none',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={submitVerification}
                  disabled={actioningId !== null}
                  style={{ 
                    backgroundColor: selectedStatus === 'verified' ? '#22c55e' : '#ef4444', 
                    color: '#fff', 
                    border: 'none',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {actioningId ? 'Processing...' : `Confirm ${selectedStatus === 'verified' ? 'Approve' : 'Reject'}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationCenter;
