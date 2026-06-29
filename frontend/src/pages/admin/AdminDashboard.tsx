import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api';
import { DashboardStats } from '../../types';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Users, Building2, Briefcase, FileText, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getAdminDashboard()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="primary" />
        <StatCard title="Active Jobs" value={stats?.activeJobs || 0} icon={Briefcase} color="green" />
        <StatCard title="Total Applications" value={stats?.totalApplications || 0} icon={FileText} color="purple" />
        <StatCard title="Verified Institutes" value={stats?.verifiedInstitutes || 0} icon={CheckCircle} color="indigo" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Institutes" value={stats?.totalInstitutes || 0} icon={Building2} color="yellow" />
        <StatCard title="Total Recruiters" value={stats?.totalRecruiters || 0} icon={Users} color="primary" />
        <StatCard title="Total Candidates" value={stats?.totalCandidates || 0} icon={Users} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <div className="card">
          <h3 className="font-display font-semibold text-foreground mb-4">Application Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.applicationStatusDistribution ? Object.entries(stats.applicationStatusDistribution).map(([name, value]) => ({ name, value })) : []}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name }) => name.replace(/_/g, ' ')}
              >
                {stats?.applicationStatusDistribution && Object.keys(stats.applicationStatusDistribution).map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Applications */}
        <div className="card">
          <h3 className="font-display font-semibold text-foreground mb-4">Monthly Applications</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.monthlyApplications ? Object.entries(stats.monthlyApplications).map(([month, count]) => ({ month, count })) : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
