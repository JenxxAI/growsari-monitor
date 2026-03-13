import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, Users, Link2, LogOut, ShieldCheck, ChevronRight, Settings
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const NAV = [
  { to: '/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/integrations', label: 'Jira & Testpad', icon: Link2 },
];
const MANAGER_NAV = [
  { to: '/dashboard/manage', label: 'Manage Accounts', icon: Users },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'QA';

  return (
    <div className="flex min-h-screen" style={{ background: '#0F1117' }}>
      {/* Sidebar */}
      <aside
        className="w-60 flex flex-col shrink-0 py-6"
        style={{ background: '#171B26', borderRight: '1px solid #252A38' }}
      >
        {/* Logo */}
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #4CBFB1, #3AA89B)' }}>
              <ShieldCheck size={18} color="white" />
            </div>
            <div>
              <p className="font-display text-sm font-700 text-white leading-tight">GrowSari</p>
              <p className="text-[10px] leading-tight" style={{ color: '#4CBFB1' }}>QA Monitor</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          <p className="px-2 pb-2 text-[10px] font-600 uppercase tracking-widest" style={{ color: '#8B95A8' }}>Navigation</p>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                  ? 'text-white font-500'
                  : 'text-[#8B95A8] hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'rgba(76,191,177,0.12)', color: '#4CBFB1' } : {}}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}

          {user?.role === 'manager' && (
            <>
              <p className="px-2 pt-4 pb-2 text-[10px] font-600 uppercase tracking-widest" style={{ color: '#8B95A8' }}>Admin</p>
              {MANAGER_NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                      ? 'text-white font-500'
                      : 'text-[#8B95A8] hover:text-white hover:bg-white/5'
                    }`
                  }
                  style={({ isActive }) => isActive ? { background: 'rgba(76,191,177,0.12)', color: '#4CBFB1' } : {}}
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User card */}
        <div className="px-3 mt-4">
          <div className="rounded-xl p-3" style={{ background: '#0F1117', border: '1px solid #252A38' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-700 shrink-0"
                style={{ background: 'linear-gradient(135deg, #4CBFB1, #3AA89B)', color: 'white', fontFamily: 'Space Grotesk' }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-500 text-white truncate">{user?.name}</p>
                <p className="text-[10px]" style={{ color: '#8B95A8' }}>
                  {user?.role === 'manager' ? '👑 Manager' : `${user?.squad} Squad`}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                style={{ color: '#8B95A8' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
