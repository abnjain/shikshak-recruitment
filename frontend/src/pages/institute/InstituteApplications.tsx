import React, { useState, useEffect } from 'react';
import { applicationApi } from '../../api';
import { Application } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const InstituteApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationApi.getInstituteApplications()
      .then((res) => setApplications(res.data.data?.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { header: 'Candidate', accessor: 'candidateName' as keyof Application },
    { header: 'Email', accessor: 'candidateEmail' as keyof Application },
    { header: 'Job Title', accessor: 'jobTitle' as keyof Application },
    { header: 'Status', accessor: (app: Application) => <StatusBadge status={app.status} /> },
    { header: 'Applied', accessor: (app: Application) => new Date(app.appliedAt).toLocaleDateString() },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground">Applications received for your jobs</p>
      </div>
      <DataTable columns={columns} data={applications} keyExtractor={(a) => a.id} emptyMessage="No applications received yet" />
    </div>
  );
};

export default InstituteApplications;
