import React, { useState, useEffect } from 'react';
import { profileApi } from '../../api';
import { CandidateProfile as CandidateProfileType, ProfileUpdateRequest } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { User, Mail, Briefcase, GraduationCap, MapPin, DollarSign, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const CandidateProfile: React.FC = () => {
  const [profile, setProfile] = useState<CandidateProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateRequest>({});

  useEffect(() => {
    profileApi.getProfile()
      .then((res) => {
        setProfile(res.data.data);
        setFormData(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await profileApi.updateProfile(formData);
      setProfile(res.data.data);
      toast.success('Profile updated');
      setEditing(false);
    } catch { toast.error('Failed to update profile'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <p>No profile found. Please complete your registration.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your candidate profile</p>
        </div>
        <button onClick={() => setEditing(!editing)} className="btn-primary">
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
              <input type="text" className="input-field" value={formData.fullName || ''} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Gender</label>
              <select className="input-field" value={formData.gender || ''} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Highest Qualification</label>
              <input type="text" className="input-field" value={formData.highestQualification || ''} onChange={(e) => setFormData({...formData, highestQualification: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Specialization</label>
              <input type="text" className="input-field" value={formData.specialization || ''} onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Total Experience (years)</label>
              <input type="number" step="0.5" className="input-field" value={formData.totalExperienceYears || ''} onChange={(e) => setFormData({...formData, totalExperienceYears: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Current Position</label>
              <input type="text" className="input-field" value={formData.currentPosition || ''} onChange={(e) => setFormData({...formData, currentPosition: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Current Employer</label>
              <input type="text" className="input-field" value={formData.currentEmployer || ''} onChange={(e) => setFormData({...formData, currentEmployer: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">City</label>
              <input type="text" className="input-field" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Preferred Subjects</label>
              <input type="text" className="input-field" value={formData.preferredSubjects || ''} onChange={(e) => setFormData({...formData, preferredSubjects: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Expected Salary (min)</label>
              <input type="number" className="input-field" value={formData.expectedSalaryMin || ''} onChange={(e) => setFormData({...formData, expectedSalaryMin: Number(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Skills (comma separated)</label>
            <textarea className="input-field" rows={2} value={formData.skills || ''} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Bio</label>
            <textarea className="input-field" rows={3} value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="relocate" checked={formData.openToRelocate || false} onChange={(e) => setFormData({...formData, openToRelocate: e.target.checked})} />
            <label htmlFor="relocate">Open to relocate</label>
          </div>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      ) : (
        <div className="card">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">{profile.fullName || profile.userEmail}</h2>
              <p className="text-muted-foreground">{profile.currentPosition || 'Not specified'} {profile.currentEmployer ? `at ${profile.currentEmployer}` : ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <GraduationCap className="w-5 h-5 text-muted-foreground" />
              <span><strong>Qualification:</strong> {profile.highestQualification || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <span><strong>Experience:</strong> {profile.totalExperienceYears ? `${profile.totalExperienceYears} years` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span><strong>Location:</strong> {profile.city || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span><strong>Expected:</strong> {profile.expectedSalaryMin ? `₹${profile.expectedSalaryMin}` : 'Negotiable'}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <span><strong>Relocate:</strong> {profile.openToRelocate ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {profile.skills && (
            <div className="mt-4">
              <h4 className="font-medium text-muted-foreground mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.split(',').map((skill, idx) => (
                  <span key={idx} className="badge-info">{skill.trim()}</span>
                ))}
              </div>
            </div>
          )}
          {profile.bio && (
            <div className="mt-4">
              <h4 className="font-medium text-muted-foreground mb-1">About</h4>
              <p className="text-muted-foreground text-sm">{profile.bio}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;
