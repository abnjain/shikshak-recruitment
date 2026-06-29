import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Job, JobRequest } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const InstituteJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobRequest>({
    title: '', description: '', requirements: '', responsibilities: '',
    location: '', employmentType: 'FULL_TIME', positionsAvailable: 1,
    minSalary: undefined, maxSalary: undefined, subject: '',
    minExperienceYears: undefined, maxExperienceYears: undefined,
    qualificationRequired: '', status: 'DRAFT', remote: false,
  });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/v1/institute/jobs/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setJobs(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await axios.put(`/api/v1/jobs/${editingJob.id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Job updated');
      } else {
        await axios.post('/api/v1/institute/jobs', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Job created');
      }
      setShowForm(false);
      setEditingJob(null);
      resetForm();
      fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const deleteJob = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/v1/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Job deleted');
      fetchJobs();
    } catch { toast.error('Failed to delete'); }
  };

  const editJob = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title, description: job.description,
      requirements: job.requirements || '', responsibilities: job.responsibilities || '',
      location: job.location, employmentType: job.employmentType,
      positionsAvailable: job.positionsAvailable,
      minSalary: job.minSalary, maxSalary: job.maxSalary,
      subject: job.subject || '',
      minExperienceYears: job.minExperienceYears, maxExperienceYears: job.maxExperienceYears,
      qualificationRequired: job.qualificationRequired || '',
      status: job.status, remote: job.remote,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', requirements: '', responsibilities: '',
      location: '', employmentType: 'FULL_TIME', positionsAvailable: 1,
      minSalary: undefined, maxSalary: undefined, subject: '',
      minExperienceYears: undefined, maxExperienceYears: undefined,
      qualificationRequired: '', status: 'DRAFT', remote: false,
    });
  };

  const columns = [
    { header: 'Title', accessor: 'title' as keyof Job },
    { header: 'Location', accessor: 'location' as keyof Job },
    { header: 'Subject', accessor: 'subject' as keyof Job },
    { header: 'Status', accessor: (job: Job) => <StatusBadge status={job.status} /> },
    { header: 'Applications', accessor: 'applicationCount' as keyof Job },
    {
      header: 'Actions',
      accessor: (job: Job) => (
        <div className="flex gap-2">
          <button onClick={() => editJob(job)} className="p-1 hover:bg-blue-50 rounded text-blue-600"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => deleteJob(job.id)} className="p-1 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Jobs</h1>
          <p className="text-muted-foreground">Manage your job listings</p>
        </div>
        <button onClick={() => { setEditingJob(null); resetForm(); setShowForm(!showForm); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Post New Job
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="font-display font-semibold text-foreground mb-4">{editingJob ? 'Edit Job' : 'Post New Job'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Title *</label>
                <input type="text" className="input-field" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Location *</label>
                <input type="text" className="input-field" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
                <input type="text" className="input-field" value={formData.subject || ''} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Employment Type</label>
                <select className="input-field" value={formData.employmentType} onChange={(e) => setFormData({...formData, employmentType: e.target.value})}>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="VISITING">Visiting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Min Experience (years)</label>
                <input type="number" className="input-field" value={formData.minExperienceYears || ''} onChange={(e) => setFormData({...formData, minExperienceYears: Number(e.target.value) || undefined})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Max Experience (years)</label>
                <input type="number" className="input-field" value={formData.maxExperienceYears || ''} onChange={(e) => setFormData({...formData, maxExperienceYears: Number(e.target.value) || undefined})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Min Salary</label>
                <input type="number" className="input-field" value={formData.minSalary || ''} onChange={(e) => setFormData({...formData, minSalary: Number(e.target.value) || undefined})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Max Salary</label>
                <input type="number" className="input-field" value={formData.maxSalary || ''} onChange={(e) => setFormData({...formData, maxSalary: Number(e.target.value) || undefined})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Positions Available</label>
                <input type="number" className="input-field" value={formData.positionsAvailable} onChange={(e) => setFormData({...formData, positionsAvailable: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Qualification Required</label>
                <input type="text" className="input-field" value={formData.qualificationRequired || ''} onChange={(e) => setFormData({...formData, qualificationRequired: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Description *</label>
              <textarea className="input-field" rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Requirements</label>
              <textarea className="input-field" rows={3} value={formData.requirements || ''} onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Responsibilities</label>
              <textarea className="input-field" rows={3} value={formData.responsibilities || ''} onChange={(e) => setFormData({...formData, responsibilities: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remote" checked={formData.remote} onChange={(e) => setFormData({...formData, remote: e.target.checked})} />
              <label htmlFor="remote">Remote position</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editingJob ? 'Update Job' : 'Create Job'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingJob(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <DataTable columns={columns} data={jobs} keyExtractor={(j) => j.id} emptyMessage="No jobs posted yet" />
    </div>
  );
};

export default InstituteJobs;
