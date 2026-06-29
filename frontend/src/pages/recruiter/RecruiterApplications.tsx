import React, { useState, useEffect } from 'react';
import { applicationApi } from '../../api';
import { Application } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const RecruiterApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    applicationApi.getInstituteApplications()
      .then((res) => setApplications(res.data.data?.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (app: Application) => {
    try {
      await applicationApi.updateStatus({
        applicationId: app.id,
        status: statusUpdate || app.status,
        feedback,
      });
      toast.success('Status updated');
      setSelectedApp(null);
      setStatusUpdate('');
      setFeedback('');
      // Refresh
      const res = await applicationApi.getInstituteApplications();
      setApplications(res.data.data?.content || []);
    } catch { toast.error('Failed to update status'); }
  };

  const columns = [
    { header: 'Candidate', accessor: 'candidateName' as keyof Application },
    { header: 'Job', accessor: 'jobTitle' as keyof Application },
    { header: 'Status', accessor: (app: Application) => <StatusBadge status={app.status} /> },
    { header: 'Applied', accessor: (app: Application) => new Date(app.appliedAt).toLocaleDateString() },
    {
      header: 'Actions',
      accessor: (app: Application) => (
        <button onClick={() => setSelectedApp(app)} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Review & Update
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground">Review and manage candidate applications</p>
      </div>

      {selectedApp && (
        <div className="card">
          <h3 className="font-display font-semibold text-foreground mb-2">Update Application</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {selectedApp.candidateName} - {selectedApp.jobTitle}
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
              <select className="input-field" value={statusUpdate || selectedApp.status} onChange={(e) => setStatusUpdate(e.target.value)}>
                <option value="APPLIED">Applied</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="INTERVIEWED">Interviewed</option>
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
                <option value="OFFERED">Offered</option>
                <option value="HIRED">Hired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Feedback / Notes</label>
              <textarea className="input-field" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Add feedback or notes..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => updateStatus(selectedApp)} className="btn-primary">Update</button>
              <button onClick={() => setSelectedApp(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={applications} keyExtractor={(a) => a.id} emptyMessage="No applications to review" />
    </div>
  );
};

export default RecruiterApplications;
