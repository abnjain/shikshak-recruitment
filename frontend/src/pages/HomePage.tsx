import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { publicApi } from '../api';
import { Job, Institute } from '../types';
import {
  GraduationCap,
  ArrowRight,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  Search,
  FileText,
  Building2,
  Menu,
  X,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  BookOpen,
  ChevronRight,
  Sigma,
  Atom,
  Leaf,
  Monitor,
  FlaskConical,
  Backpack,
  ScrollText,
} from 'lucide-react';

interface Subject {
  name: string;
  icon: React.ElementType;
  color: string;
}

interface FeaturedJob {
  id: number;
  subject: string;
  title: string;
  institute: string;
  type: string;
  location: string;
  experience: string;
  salary: string;
  deadline: string;
  subjectColor: string;
}

interface FeaturedInstitute {
  name: string;
  location: string;
  type: string;
}

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700',
  Physics: 'bg-purple-100 text-purple-700',
  English: 'bg-amber-100 text-amber-700',
  Biology: 'bg-emerald-100 text-emerald-700',
  'Computer Science': 'bg-cyan-100 text-cyan-700',
  Chemistry: 'bg-rose-100 text-rose-700',
  'Primary Education': 'bg-orange-100 text-orange-700',
  History: 'bg-teal-100 text-teal-700',
};

const getSubjectColor = (subject: string): string =>
  subjectColors[subject] || 'bg-gray-100 text-gray-700';

const mapJobToFeatured = (job: Job): FeaturedJob => ({
  id: job.id,
  subject: job.subject,
  title: job.title,
  institute: job.instituteName,
  type: job.employmentType,
  location: job.location,
  experience: `${job.minExperienceYears} - ${job.maxExperienceYears} yrs`,
  salary: `₹${(job.minSalary / 100000).toFixed(1)}L – ₹${(job.maxSalary / 100000).toFixed(1)}L`,
  deadline: job.applicationDeadline,
  subjectColor: getSubjectColor(job.subject),
});

const mapInstituteToFeatured = (inst: Institute): FeaturedInstitute => ({
  name: inst.instituteName,
  location: `${inst.city}, ${inst.state}`,
  type: inst.instituteType,
});

const subjects: Subject[] = [
  { name: 'Mathematics', icon: Sigma, color: 'bg-blue-50 text-blue-600' },
  { name: 'Physics', icon: Atom, color: 'bg-purple-50 text-purple-600' },
  { name: 'English', icon: BookOpen, color: 'bg-amber-50 text-amber-600' },
  { name: 'Biology', icon: Leaf, color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Computer Science', icon: Monitor, color: 'bg-cyan-50 text-cyan-600' },
  { name: 'Chemistry', icon: FlaskConical, color: 'bg-rose-50 text-rose-600' },
  { name: 'Primary Education', icon: Backpack, color: 'bg-orange-50 text-orange-600' },
  { name: 'History', icon: ScrollText, color: 'bg-teal-50 text-teal-600' },
];

const howItWorks = [
  {
    icon: FileText,
    title: 'Build your teaching resume',
    desc: 'Add your subjects, certifications, and experience. Export a polished PDF in seconds.',
    color: 'bg-primary-50 text-primary-600',
  },
  {
    icon: Search,
    title: 'Discover matched roles',
    desc: 'Search by subject, location, board, salary, and experience — filters made for education.',
    color: 'bg-accent-50 text-accent-600',
  },
  {
    icon: TrendingUp,
    title: 'Track your hiring pipeline',
    desc: 'Institutes and recruiters can move candidates through applied → interview → offered → hired.',
    color: 'bg-purple-50 text-purple-600',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState<FeaturedJob[]>([]);
  const [featuredInstitutes, setFeaturedInstitutes] = useState<FeaturedInstitute[]>([]);
  const [jobCount, setJobCount] = useState(0);
  const [instituteCount, setInstituteCount] = useState(0);
  const [userCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    Promise.all([
      publicApi.getActiveJobs(0, 4),
      publicApi.getVerifiedInstitutes(),
    ])
      .then(([jobsRes, instRes]) => {
        const jobs = (jobsRes.data.data?.content || []).map(mapJobToFeatured);
        setFeaturedJobs(jobs);
        setJobCount(jobsRes.data.data?.totalElements || 0);

        const institutes = (instRes.data.data || []).map(mapInstituteToFeatured);
        setFeaturedInstitutes(institutes);
        setInstituteCount(institutes.length);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-card/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-semibold tracking-tight text-foreground">Shikshak.</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/jobs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Browse Jobs
              </Link>
              <a href="#how" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                How it works
              </a>
              <a href="#institutes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                For Institutes
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-muted-foreground hover:text-primary px-4 py-2 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-700 px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                Get started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/jobs"
                className="block text-sm font-medium text-muted-foreground hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Jobs
              </Link>
              <a
                href="#how"
                className="block text-sm font-medium text-muted-foreground hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </a>
              <a
                href="#institutes"
                className="block text-sm font-medium text-muted-foreground hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                For Institutes
              </a>
              <hr className="border-border" />
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                className="w-full text-sm font-medium text-muted-foreground hover:text-primary py-2"
              >
                Sign in
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                className="w-full text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-700 px-5 py-2.5 rounded-xl"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-background to-accent-50/30" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent-100/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full text-sm font-medium text-primary-700 mb-6">
                <Sparkles className="w-4 h-4" />
                India's recruitment portal for educators
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-medium text-foreground leading-[1.05] tracking-tight">
                The hiring home for{' '}
                <span className="text-primary not-italic">teachers</span>,<br />
                institutes & recruiters.
              </h1>

              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                Post teaching jobs, discover qualified educators, build resumes, and run hiring pipelines — all from one warm, well-lit place.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-primary-foreground font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  <BookOpen className="w-4 h-4" />
                  I'm a teacher
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-2 border-2 border-border hover:border-primary/40 text-foreground hover:text-primary font-medium px-6 py-3 rounded-xl transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  I'm hiring
                </button>
              </div>

              {/* Stats */}
              <div className="mt-10 flex items-center gap-8">
                <div>
                  <strong className="text-2xl font-display font-semibold text-foreground">{jobCount}+</strong>
                  <p className="text-sm text-muted-foreground mt-0.5">open positions</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <strong className="text-2xl font-display font-semibold text-foreground">{instituteCount}+</strong>
                  <p className="text-sm text-muted-foreground mt-0.5">institutes</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <strong className="text-2xl font-display font-semibold text-foreground">{userCount}+</strong>
                  <p className="text-sm text-muted-foreground mt-0.5">verified users</p>
                </div>
              </div>
            </div>

            {/* Right: Images / Cards */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-border/50">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop"
                  alt="Teacher in classroom"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating card 1 */}
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg shadow-border/50 p-4 flex items-center gap-3 border border-border">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-xl font-display font-semibold text-foreground">2</p>
                  <p className="text-xs text-muted-foreground">STEM openings this week</p>
                </div>
              </div>

              {/* Floating card 2 */}
              <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-lg shadow-border/50 p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-display font-semibold text-foreground">Hiring pipeline</span>
                </div>
                <p className="text-2xl font-display font-semibold text-primary">73%</p>
                <p className="text-xs text-muted-foreground">faster shortlist with Shikshak</p>
              </div>

              {/* Bottom image */}
              <div className="mt-4 rounded-2xl overflow-hidden shadow-lg shadow-border/50">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop"
                  alt="Campus"
                  className="w-full h-32 sm:h-40 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUBJECTS SECTION ===== */}
      <section className="py-16 lg:py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {subjects.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.name}
                  to={`/jobs?subject=${encodeURIComponent(s.name)}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-muted transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground text-center leading-tight">{s.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED JOBS SECTION ===== */}
      <section className="py-16 lg:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-foreground">Featured teaching roles</h2>
              <p className="mt-2 text-muted-foreground">Hand-picked openings from verified institutes across India.</p>
            </div>
            <Link
              to="/jobs"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-700 transition-colors"
            >
              View all jobs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredJobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/j-${job.id}`}
                className="group bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-border/50 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${job.subjectColor}`}>
                      {job.subject}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {job.type}
                  </span>
                </div>

                <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm font-display font-semibold text-muted-foreground mt-1">{job.institute}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                    {job.experience}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground/60" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                    {job.deadline}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-700"
            >
              View all jobs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section id="how" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-foreground">A workflow built for educators</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center p-8 rounded-2xl hover:bg-muted transition-all">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${item.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mt-5">{item.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FOR INSTITUTES SECTION ===== */}
      <section id="institutes" className="py-16 lg:py-20 bg-gradient-to-br from-primary-800 to-primary-900 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white/90 mb-4">
                <Building2 className="w-4 h-4" />
                For Institutes & Recruiters
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif-display font-medium leading-tight">Hire faculty that fits.</h2>
              <p className="mt-4 text-white/80 max-w-md leading-relaxed">
                Institutes and coaching centres run their entire hiring stack on Shikshak — from job posting to offer letter.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="mt-6 inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-medium px-6 py-3 rounded-xl transition-all"
              >
                Post your first job <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {featuredInstitutes.map((inst, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-all"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-display font-semibold text-white">{inst.name}</p>
                  <p className="text-sm text-white/60 mt-1">
                    {inst.location} • {inst.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t border-border bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-semibold tracking-tight text-foreground">Shikshak.</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Shikshak Recruitment — built for educators.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Made with care for teachers, institutes & recruiters.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
