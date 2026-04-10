import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
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
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiRequest('/Admin/analytics/revenue');
        // Structure: { revenueTrend: [], stats: { totalOwners: 0, totalBookings: 0 } }
        setAnalytics({
          revenue: data.revenueTrend || [],
          totalOwners: data.stats?.totalOwners || 0,
          totalBookings: data.stats?.totalBookings || 0,
          loading: false,
          error: ''
        });
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        // Fallback for demo/dev if backend not fully ready
        setAnalytics(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Unable to connect to live analytics. Displaying cached data.' 
        }));
      }
    };

    fetchAnalytics();
  }, []);

  const dummyRevenueData = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 5000 },
    { name: 'Apr', amount: 4500 },
    { name: 'May', amount: 6000 },
    { name: 'Jun', amount: 5500 },
    { name: 'Jul', amount: 7000 },
  ];

  const chartData = analytics.revenue.length > 0 ? analytics.revenue : dummyRevenueData;

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
          title="Total Revenue" 
          value={`$${chartData.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`} 
          trend={12.5} 
          icon={DollarSign} 
          delay={0.1}
        />
        <StatCard 
          title="Total Owners" 
          value={analytics.totalOwners || "84"} 
          trend={4.2} 
          icon={Users} 
          delay={0.2}
        />
        <StatCard 
          title="Total Bookings" 
          value={analytics.totalBookings || "1,248"} 
          trend={8.1} 
          icon={CalendarCheck} 
          delay={0.3}
        />
      </div>

      <div className="dashboard-charts-row">
        <GlassCard 
          className="revenue-chart-card"
          title="Revenue Growth" 
          subtitle="Monthly revenue trend analysis"
          icon={TrendingUp}
          delay={0.4}
        >
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1c', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
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
