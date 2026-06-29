import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Briefcase, Users, Building2, FileText,
  LogOut, Menu, GraduationCap, Search
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const role = user?.roles?.[0]?.replace('ROLE_', '')?.toLowerCase() || '';

  const navItems = [
    ...(role === 'admin'
      ? [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
          { label: 'Users', icon: Users, path: '/admin/users' },
          { label: 'Institutes', icon: Building2, path: '/admin/institutes' },
          { label: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
        ]
      : []),
    ...(role === 'institute'
      ? [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/institute/dashboard' },
          { label: 'My Jobs', icon: Briefcase, path: '/institute/jobs' },
          { label: 'Applications', icon: FileText, path: '/institute/applications' },
          { label: 'Profile', icon: Building2, path: '/institute/profile' },
        ]
      : []),
    ...(role === 'recruiter'
      ? [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/recruiter/dashboard' },
          { label: 'Assigned Jobs', icon: Briefcase, path: '/recruiter/jobs' },
          { label: 'Applications', icon: FileText, path: '/recruiter/applications' },
        ]
      : []),
    ...(role === 'candidate'
      ? [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/candidate/dashboard' },
          { label: 'Browse Jobs', icon: Search, path: '/candidate/jobs' },
          { label: 'My Applications', icon: FileText, path: '/candidate/applications' },
          { label: 'My Resumes', icon: FileText, path: '/candidate/resumes' },
          { label: 'Profile', icon: Users, path: '/candidate/profile' },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground">Shikshak</h1>
            <p className="text-xs text-muted-foreground">Recruitment Portal</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
            <button onClick={logout} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between lg:justify-end">
          <button className="lg:hidden p-2 hover:bg-muted rounded-lg" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.firstName || 'User'}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
