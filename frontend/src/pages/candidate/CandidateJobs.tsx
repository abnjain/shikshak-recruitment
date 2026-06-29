import React, { useState, useEffect } from 'react';
import { jobApi, applicationApi } from '../../api';
import { Job } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { Search, MapPin, Briefcase, DollarSign, Calendar, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const CandidateJobs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    title: '', location: '', subject: '', employmentType: '', minExperience: '',
  });

  useEffect(() => {
    const applyId = searchParams.get('apply');
    if (applyId) {
      handleApply(Number(applyId));
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {};
      if (filters.title) params.title = filters.title;
      if (filters.location) params.location = filters.location;
      if (filters.subject) params.subject = filters.subject;
      if (filters.employmentType) params.employmentType = filters.employmentType;
      if (filters.minExperience) params.minExperience = Number(filters.minExperience);

      const res = Object.keys(params).length > 0
        ? await jobApi.search(params)
        : await jobApi.getAllActive(0, 20);

      setJobs(res.data.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      await applicationApi.apply({ jobId });
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Browse Jobs</h1>
        <p className="text-muted-foreground">Find teaching opportunities that match your skills</p>
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by job title..."
              value={filters.title}
              onChange={(e) => setFilters({...filters, title: e.target.value})}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button onClick={fetchJobs} className="btn-primary">Search</button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
              <input type="text" className="input-field text-sm" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Subject</label>
              <input type="text" className="input-field text-sm" value={filters.subject} onChange={(e) => setFilters({...filters, subject: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Employment Type</label>
              <select className="input-field text-sm" value={filters.employmentType} onChange={(e) => setFilters({...filters, employmentType: e.target.value})}>
                <option value="">All</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="VISITING">Visiting</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Min Experience (yrs)</label>
              <input type="number" className="input-field text-sm" value={filters.minExperience} onChange={(e) => setFilters({...filters, minExperience: e.target.value})} />
            </div>
          </div>
        )}
      </div>

      {/* Job Listings */}
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="card text-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No jobs found matching your criteria</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-display font-semibold text-foreground">{job.title}</h3>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{job.instituteName}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.employmentType?.replace(/_/g, ' ')}</span>
                      {job.subject && <span className="flex items-center gap-1"><span className="font-medium">Subject:</span> {job.subject}</span>}
                      {job.minSalary && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.minSalary} - {job.maxSalary}</span>}
                      {job.applicationDeadline && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>}
                    </div>
                    {job.description && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{job.description}</p>
                    )}
                  </div>
                  <button onClick={() => handleApply(job.id)} className="btn-primary ml-4 whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateJobs;
