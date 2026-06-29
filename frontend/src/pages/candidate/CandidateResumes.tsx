import React, { useState, useEffect } from 'react';
import { resumeApi } from '../../api';
import { Resume, ResumeRequest } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Edit2, Trash2, FileText, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const CandidateResumes: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Resume | null>(null);
  const [formData, setFormData] = useState<ResumeRequest>({
    title: '', professionalSummary: '', education: '', experience: '',
    certifications: '', achievements: '', projects: '', languages: '',
    templateId: 'modern', primary: false,
  });

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await resumeApi.getAll();
      setResumes(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await resumeApi.update(editing.id, formData);
        toast.success('Resume updated');
      } else {
        await resumeApi.create(formData);
        toast.success('Resume created');
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchResumes();
    } catch { toast.error('Operation failed'); }
  };

  const deleteResume = async (id: number) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await resumeApi.delete(id);
      toast.success('Resume deleted');
      fetchResumes();
    } catch { toast.error('Failed to delete'); }
  };

  const editResume = (resume: Resume) => {
    setEditing(resume);
    setFormData({
      title: resume.title, professionalSummary: resume.professionalSummary,
      education: resume.education, experience: resume.experience,
      certifications: resume.certifications, achievements: resume.achievements,
      projects: resume.projects, languages: resume.languages,
      templateId: resume.templateId, primary: resume.primary,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '', professionalSummary: '', education: '', experience: '',
      certifications: '', achievements: '', projects: '', languages: '',
      templateId: 'modern', primary: false,
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Resume Builder</h1>
          <p className="text-muted-foreground">Create and manage your teaching resumes</p>
        </div>
        <button onClick={() => { setEditing(null); resetForm(); setShowForm(!showForm); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Resume
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="font-display font-semibold text-foreground mb-4">{editing ? 'Edit Resume' : 'Create Resume'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Resume Title</label>
              <input type="text" className="input-field" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g., Teaching Resume 2024" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Professional Summary</label>
              <textarea className="input-field" rows={3} value={formData.professionalSummary || ''} onChange={(e) => setFormData({...formData, professionalSummary: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Education</label>
                <textarea className="input-field" rows={4} value={formData.education || ''} onChange={(e) => setFormData({...formData, education: e.target.value})} placeholder="Degrees, institutions, years" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Experience</label>
                <textarea className="input-field" rows={4} value={formData.experience || ''} onChange={(e) => setFormData({...formData, experience: e.target.value})} placeholder="Teaching positions, schools, years" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Certifications</label>
                <textarea className="input-field" rows={3} value={formData.certifications || ''} onChange={(e) => setFormData({...formData, certifications: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Achievements</label>
                <textarea className="input-field" rows={3} value={formData.achievements || ''} onChange={(e) => setFormData({...formData, achievements: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Languages</label>
              <input type="text" className="input-field" value={formData.languages || ''} onChange={(e) => setFormData({...formData, languages: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="primary" checked={formData.primary} onChange={(e) => setFormData({...formData, primary: e.target.checked})} />
              <label htmlFor="primary">Set as primary resume</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editing ? 'Update Resume' : 'Create Resume'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumes.length === 0 ? (
          <div className="card col-span-2 text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No resumes created yet</p>
          </div>
        ) : (
          resumes.map((resume) => (
            <div key={resume.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{resume.title || 'Untitled Resume'}</h3>
                    <p className="text-xs text-muted-foreground">Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
                    {resume.primary && (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-600 mt-1">
                        <Star className="w-3 h-3" /> Primary
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editResume(resume)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => deleteResume(resume.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateResumes;
