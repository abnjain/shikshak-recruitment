import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api';
import { DashboardStats } from '../../types';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Briefcase, FileText, Clock, TrendingUp } from 'lucide-react';

const InstituteDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getInstituteDashboard()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Institute Dashboard</h1>
        <p className="text-muted-foreground">Manage your job listings and applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Jobs Posted" value={stats?.totalJobs || 0} icon={Briefcase} color="primary" />
        <StatCard title="Active Jobs" value={stats?.activeJobs || 0} icon={TrendingUp} color="green" />
        <StatCard title="Total Applications" value={stats?.totalApplications || 0} icon={FileText} color="purple" />
        <StatCard title="New This Week" value={stats?.lastWeekApplications || 0} icon={Clock} color="yellow" />
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-foreground mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <a href="/institute/jobs" className="p-4 bg-primary-50 rounded-xl text-center hover:bg-primary-100 transition-colors">
            <Briefcase className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-700">Post New Job</span>
          </a>
          <a href="/institute/applications" className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-700">View Applications</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;
