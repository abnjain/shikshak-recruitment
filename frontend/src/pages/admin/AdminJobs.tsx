import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Job } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { Briefcase, Building2, MapPin } from 'lucide-react';

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/v1/jobs?page=0&size=50', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setJobs(res.data.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof Job },
    { header: 'Title', accessor: 'title' as keyof Job },
    { header: 'Institute', accessor: 'instituteName' as keyof Job },
    { header: 'Location', accessor: 'location' as keyof Job },
    { header: 'Status', accessor: (job: Job) => <StatusBadge status={job.status} /> },
    { header: 'Applications', accessor: 'applicationCount' as keyof Job },
    { header: 'Created', accessor: (job: Job) => new Date(job.createdAt).toLocaleDateString() },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">All Jobs</h1>
        <p className="text-muted-foreground">Overview of all job listings on the platform</p>
      </div>
      <DataTable columns={columns} data={jobs} keyExtractor={(j) => j.id} emptyMessage="No jobs found" />
    </div>
  );
};

export default AdminJobs;
