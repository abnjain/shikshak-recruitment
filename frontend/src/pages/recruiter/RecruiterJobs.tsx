import React, { useState, useEffect } from 'react';
import { jobApi } from '../../api';
import { Job } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const RecruiterJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobApi.getRecruiterJobs()
      .then((res) => setJobs(res.data.data?.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { header: 'Title', accessor: 'title' as keyof Job },
    { header: 'Institute', accessor: 'instituteName' as keyof Job },
    { header: 'Location', accessor: 'location' as keyof Job },
    { header: 'Subject', accessor: 'subject' as keyof Job },
    { header: 'Status', accessor: (job: Job) => <StatusBadge status={job.status} /> },
    { header: 'Applications', accessor: 'applicationCount' as keyof Job },
    {
      header: 'Actions',
      accessor: (job: Job) => (
        <a href={`/recruiter/applications?jobId=${job.id}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View Applications
        </a>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Assigned Jobs</h1>
        <p className="text-muted-foreground">Jobs assigned to you for recruitment</p>
      </div>
      <DataTable columns={columns} data={jobs} keyExtractor={(j) => j.id} emptyMessage="No jobs assigned yet" />
    </div>
  );
};

export default RecruiterJobs;
