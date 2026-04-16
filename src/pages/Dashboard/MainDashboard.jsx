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
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiRequest('/api/v1/admin/analytics/revenue');
        // Backend returns an array of { _id (month), totalRevenue, count }
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const formattedRevenue = (data.data || data).map(item => ({
          name: monthNames[item._id - 1] || `Month ${item._id}`,
          amount: item.totalRevenue,
          count: item.count
        }));

        setAnalytics({
          revenue: formattedRevenue,
          totalOwners: 0, // Will fetch separately or from same endpoint if updated
          totalBookings: formattedRevenue.reduce((acc, curr) => acc + curr.count, 0),
          loading: false,
          error: ''
        });

        // Fetch other stats
        const ownersData = await apiRequest('/api/v1/admin/view_all_owners');
        const ownersCount = (ownersData.owners || ownersData.data || []).length;
        
        setAnalytics(prev => ({
          ...prev,
          totalOwners: ownersCount
        }));

      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setAnalytics(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Live data sync failed. Some metrics may be simulated.' 
        }));
      }
    };

    fetchAnalytics();
  }, []);

  const dummyRevenueData = [
    { name: 'Jan', amount: 4000, count: 10 },
    { name: 'Feb', amount: 3000, count: 8 },
    { name: 'Mar', amount: 5000, count: 12 },
    { name: 'Apr', amount: 4500, count: 11 },
    { name: 'May', amount: 6000, count: 15 },
    { name: 'Jun', amount: 5500, count: 14 },
    { name: 'Jul', amount: 7000, count: 18 },
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
          value={`₹${chartData.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`} 
          trend={12.5} 
          icon={IndianRupee} 
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
