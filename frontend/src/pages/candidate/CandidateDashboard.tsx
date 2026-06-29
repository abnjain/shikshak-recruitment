import React, { useState, useEffect } from 'react';
import { dashboardApi, jobApi } from '../../api';
import { DashboardStats, Job } from '../../types';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Briefcase, FileText, Search, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getCandidateDashboard(),
      jobApi.getAllActive(0, 5),
    ])
      .then(([statsRes, jobsRes]) => {
        setStats(statsRes.data.data);
        setRecentJobs(jobsRes.data.data?.content || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Candidate Dashboard</h1>
        <p className="text-muted-foreground">Find your dream teaching job</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Active Jobs" value={stats?.totalJobs || 0} icon={Briefcase} color="primary" />
        <StatCard title="My Applications" value={stats?.myApplications || 0} icon={FileText} color="green" />
        <StatCard title="New This Week" value={stats?.lastWeekJobs || 0} icon={TrendingUp} color="purple" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground">Recent Job Openings</h3>
          <Link to="/candidate/jobs" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors">
              <div>
                <p className="font-medium text-foreground">{job.title}</p>
                <p className="text-sm text-muted-foreground">{job.instituteName} · {job.location}</p>
              </div>
              <Link to={`/candidate/jobs?apply=${job.id}`} className="btn-outline text-sm py-1 px-3">
                Apply Now
              </Link>
            </div>
          ))}
          {recentJobs.length === 0 && <p className="text-muted-foreground text-sm">No jobs available at the moment</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/candidate/jobs" className="p-4 bg-primary-50 rounded-xl text-center hover:bg-primary-100 transition-colors">
          <Search className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-primary-700">Browse Jobs</span>
        </Link>
        <Link to="/candidate/applications" className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
          <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-green-700">My Applications</span>
        </Link>
        <Link to="/candidate/resumes" className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors">
          <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-purple-700">Build Resume</span>
        </Link>
        <Link to="/candidate/profile" className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-colors">
          <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-yellow-700">My Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default CandidateDashboard;
