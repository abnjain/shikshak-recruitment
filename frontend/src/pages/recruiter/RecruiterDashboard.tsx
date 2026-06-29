import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api';
import { DashboardStats } from '../../types';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';

const RecruiterDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getRecruiterDashboard()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Recruiter Dashboard</h1>
        <p className="text-muted-foreground">Review and manage candidate applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Assigned Jobs" value={stats?.assignedJobs || 0} icon={Briefcase} color="primary" />
        <StatCard title="Reviews This Month" value={stats?.reviewedApplications || 0} icon={CheckCircle} color="green" />
        <StatCard title="Pending Reviews" value={0} icon={Clock} color="yellow" />
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-foreground mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <a href="/recruiter/applications" className="p-4 bg-primary-50 rounded-xl text-center hover:bg-primary-100 transition-colors">
            <FileText className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-700">Review Applications</span>
          </a>
          <a href="/recruiter/jobs" className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
            <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-700">My Assigned Jobs</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
