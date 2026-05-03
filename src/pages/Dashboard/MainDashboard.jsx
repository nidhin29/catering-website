import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import StatCard from '../../components/ui/StatCard';
import GlassCard from '../../components/ui/GlassCard';
import { apiRequest } from '../../api/api';
import './Dashboard.css';

const MainDashboard = () => {
  const [analytics, setAnalytics] = useState({
    revenue: [],
    totalOwners: 0,
    totalBookings: 0,
    totalRevenue: 0,
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiRequest('/api/v1/admin/dashboard-stats');
        const data = response.data || response;
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const formattedRevenue = (data.revenueTrend || []).map(item => ({
          name: monthNames[item._id - 1] || `Month ${item._id}`,
          amount: item.totalRevenue,
          count: item.bookingCount
        }));

        setAnalytics({
          revenue: formattedRevenue,
          totalOwners: data.totalOwners ?? 0,
          totalBookings: data.totalBookings ?? 0,
          totalRevenue: data.totalRevenue ?? 0,
          loading: false,
          error: ''
        });

      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setAnalytics(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Live data sync failed. Some metrics may be unavailable.' 
        }));
      }
    };

    fetchAnalytics();
  }, []);

  const chartData = analytics.revenue;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-text">
          <h1>Executive Overview</h1>
          <p>Real-time performance and financial analytics</p>
        </div>
        <div className="header-date">
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </header>

      {analytics.error && (
        <div className="dashboard-alert">
          <AlertCircle size={18} />
          <span>{analytics.error}</span>
        </div>
      )}

      <div className="dashboard-grid">
        <StatCard 
          title="Platform Earnings" 
          value={`₹${(analytics.totalRevenue ?? 0).toLocaleString()}`} 
          trend={12.5} 
          icon={IndianRupee} 
          delay={0.1}
        />
        <StatCard 
          title="Total Owners" 
          value={analytics.totalOwners ?? 0} 
          trend={4.2} 
          icon={Users} 
          delay={0.2}
        />
        <StatCard 
          title="Total Bookings" 
          value={analytics.totalBookings ?? 0} 
          trend={8.1} 
          icon={CalendarCheck} 
          delay={0.3}
        />
      </div>

      <div className="dashboard-charts-row">
        <GlassCard 
          className="revenue-chart-card"
          title="Earnings Growth" 
          subtitle="Monthly earnings trend analysis"
          icon={TrendingUp}
          delay={0.4}
        >
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1c', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default MainDashboard;
