import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Institute } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Building2, Globe, MapPin, Phone, Calendar, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const InstituteProfile: React.FC = () => {
  const [profile, setProfile] = useState<Institute | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Institute>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/v1/institute/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile(res.data.data);
      setFormData(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/api/v1/institute/profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Profile updated');
      setEditing(false);
      fetchProfile();
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <p>No institute profile found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Institute Profile</h1>
          <p className="text-muted-foreground">Manage your institute details</p>
        </div>
        <button onClick={() => setEditing(!editing)} className="btn-primary">
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Institute Name</label>
              <input type="text" className="input-field" value={formData.instituteName || ''} onChange={(e) => setFormData({...formData, instituteName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Institute Type</label>
              <select className="input-field" value={formData.instituteType || ''} onChange={(e) => setFormData({...formData, instituteType: e.target.value})}>
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="University">University</option>
                <option value="Academy">Academy</option>
                <option value="Coaching">Coaching Institute</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">City</label>
              <input type="text" className="input-field" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">State</label>
              <input type="text" className="input-field" value={formData.state || ''} onChange={(e) => setFormData({...formData, state: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Website</label>
              <input type="url" className="input-field" value={formData.website || ''} onChange={(e) => setFormData({...formData, website: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
              <input type="text" className="input-field" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea className="input-field" rows={4} value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      ) : (
        <div className="card">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-10 h-10 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-display font-bold text-foreground">{profile.instituteName}</h2>
              <p className="text-muted-foreground mt-1">{profile.instituteType}</p>
              {profile.description && <p className="text-muted-foreground mt-3">{profile.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span>{profile.city}, {profile.state} {profile.pincode}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <span>{profile.website || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span>{profile.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>Est. {profile.establishedYear || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Award className="w-5 h-5 text-muted-foreground" />
              <span>{profile.affiliation || 'No affiliation'}</span>
            </div>
          </div>

          <div className="mt-4">
            {profile.verified ? (
              <span className="badge-success">Verified Institute</span>
            ) : (
              <span className="badge-warning">Pending Verification</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteProfile;
