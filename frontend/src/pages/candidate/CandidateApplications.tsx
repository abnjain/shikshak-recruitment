import React, { useState, useEffect } from 'react';
import { applicationApi } from '../../api';
import { Application } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const CandidateApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationApi.getMyApplications()
      .then((res) => setApplications(res.data.data?.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { header: 'Job Title', accessor: 'jobTitle' as keyof Application },
    { header: 'Institute', accessor: 'instituteName' as keyof Application },
    { header: 'Status', accessor: (app: Application) => <StatusBadge status={app.status} /> },
    { header: 'Stage', accessor: (app: Application) => app.currentStage || '-' },
    { header: 'Applied On', accessor: (app: Application) => new Date(app.appliedAt).toLocaleDateString() },
    { header: 'Feedback', accessor: (app: Application) => app.feedback || '-' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground">Track your job applications</p>
      </div>
      <DataTable
        columns={columns}
        data={applications}
        keyExtractor={(a) => a.id}
        emptyMessage="You haven't applied to any jobs yet"
      />
    </div>
  );
};

export default CandidateApplications;
