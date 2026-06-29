import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'CANDIDATE',
    // Institute fields
    instituteName: '',
    instituteType: 'School',
    instituteAddress: '',
    instituteCity: '',
    instituteState: '',
    institutePincode: '',
    instituteWebsite: '',
    establishedYear: '',
    affiliation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const requestData: any = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        roles: [formData.role],
      };

      if (formData.role === 'INSTITUTE') {
        requestData.instituteName = formData.instituteName;
        requestData.instituteType = formData.instituteType;
        requestData.instituteAddress = formData.instituteAddress;
        requestData.instituteCity = formData.instituteCity;
        requestData.instituteState = formData.instituteState;
        requestData.institutePincode = formData.institutePincode;
        requestData.instituteWebsite = formData.instituteWebsite;
        requestData.establishedYear = formData.establishedYear ? parseInt(formData.establishedYear) : undefined;
        requestData.affiliation = formData.affiliation;
      }

      await authApi.register(requestData);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">Create Account</h2>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-6 gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
        <div className="h-1 w-12 bg-muted rounded"><div className={`h-full bg-primary rounded transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} /></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
        {formData.role === 'INSTITUTE' && (
          <>
            <div className="h-1 w-12 bg-muted rounded"><div className={`h-full bg-primary rounded transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} /></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">I want to register as</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                <option value="CANDIDATE">Candidate / Teacher</option>
                <option value="INSTITUTE">Institute</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
            </div>
            <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">Next</button>
          </>
        )}

        {/* Step 2: Account Details */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Username *</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="input-field pr-10" required minLength={6} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm Password *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field" required />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              {formData.role === 'INSTITUTE' ? (
                <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">Next</button>
              ) : (
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Create Account'}
                  <UserPlus className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        )}

        {/* Step 3: Institute Details */}
        {step === 3 && formData.role === 'INSTITUTE' && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Institute Name *</label>
              <input type="text" name="instituteName" value={formData.instituteName} onChange={handleChange} className="input-field" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Institute Type</label>
                <select name="instituteType" value={formData.instituteType} onChange={handleChange} className="input-field">
                  <option value="School">School</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                  <option value="Academy">Academy</option>
                  <option value="Coaching">Coaching Institute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Established Year</label>
                <input type="number" name="establishedYear" value={formData.establishedYear} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Address</label>
              <input type="text" name="instituteAddress" value={formData.instituteAddress} onChange={handleChange} className="input-field" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">City</label>
                <input type="text" name="instituteCity" value={formData.instituteCity} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">State</label>
                <input type="text" name="instituteState" value={formData.instituteState} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Pincode</label>
                <input type="text" name="institutePincode" value={formData.institutePincode} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Website</label>
                <input type="url" name="instituteWebsite" value={formData.instituteWebsite} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Affiliation</label>
                <input type="text" name="affiliation" value={formData.affiliation} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
              <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Create Account'}
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Google Sign-In */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              try {
                setIsLoading(true);
                const res = await authApi.googleLogin({ credential: credentialResponse.credential, role: formData.role === 'INSTITUTE' ? 'institute' : formData.role });
                login(res.data.data.token, res.data.data);
                toast.success('Registration successful!');
                navigate('/dashboard');
              } catch (err: any) {
                toast.error(err.response?.data?.message || 'Google registration failed');
              } finally {
                setIsLoading(false);
              }
            }
          }}
          onError={() => toast.error('Google Sign-In failed')}
          theme="outline"
          size="large"
          text="signup_with"
          shape="rectangular"
        />
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
