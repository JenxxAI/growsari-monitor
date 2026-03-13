import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DEMO_USERS, DEMO_TASKS, SQUADS_CONFIG, SQUAD_COLORS } from '../lib/data';
import { User, MemberStatus } from '../types';
import {
  Users, CheckCircle2, AlertCircle, Clock, Zap, ChevronDown, ChevronUp, Search
} from 'lucide-react';

const STATUS_LABEL: Record<MemberStatus, string> = {
  active: 'Active',
  available: 'Available',
  busy: 'Busy',
  on_leave: 'On Leave',
};

function capacityColor(n: number) {
  if (n >= 85) return '#F87171';
  if (n >= 60) return '#FCD34D';
  return '#4CBFB1';
}

function MemberCard({ member }: { member: User }) {
  const tasks = DEMO_TASKS.filter(t => t.assigneeId === member.id);
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const blocked = tasks.filter(t => t.status === 'blocked').length;

  return (
    <div className="rounded-xl p-4 transition-all hover:border-[#4CBFB1]/30"
      style={{ background: '#0F1117', border: '1px solid #252A38' }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-700 shrink-0"
          style={{ background: `${SQUAD_COLORS[member.squad]}22`, color: SQUAD_COLORS[member.squad], fontFamily: 'Space Grotesk' }}>
          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`status-dot status-${member.status}`} />
            <p className="text-sm font-500 text-white truncate">{member.name}</p>
          </div>
          <p className="text-xs mt-0.5 font-mono" style={{ color: '#8B95A8' }}>@{member.username}</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-500 ${
          member.status === 'available' ? 'bg-teal-500/10 text-teal-400' :
          member.status === 'busy' ? 'bg-yellow-500/10 text-yellow-400' :
          member.status === 'on_leave' ? 'bg-gray-500/10 text-gray-400' :
          'bg-green-500/10 text-green-400'
        }`}>
          {STATUS_LABEL[member.status]}
        </span>
      </div>

      {/* Projects */}
      <div className="mt-3 flex flex-wrap gap-1">
        {member.projects.map(p => (
          <span key={p} className="text-[10px] px-2 py-0.5 rounded-md font-500"
            style={{ background: 'rgba(76,191,177,0.1)', color: '#4CBFB1', border: '1px solid rgba(76,191,177,0.2)' }}>
            {p}
          </span>
        ))}
      </div>

      {/* Current task */}
      {member.currentTask && (
        <div className="mt-2.5 flex items-start gap-1.5">
          <Clock size={11} className="shrink-0 mt-0.5" style={{ color: '#8B95A8' }} />
          <p className="text-[11px] leading-tight" style={{ color: '#8B95A8' }}>{member.currentTask}</p>
        </div>
      )}

      {/* Capacity */}
      <div className="mt-3">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: '#8B95A8' }}>Capacity</span>
          <span className="text-[10px] font-600" style={{ color: capacityColor(member.capacity) }}>{member.capacity}%</span>
        </div>
        <div className="capacity-bar">
          <div className="capacity-fill" style={{ width: `${member.capacity}%`, background: capacityColor(member.capacity) }} />
        </div>
      </div>

      {/* Task counts */}
      <div className="mt-3 flex gap-3">
        <div className="flex items-center gap-1">
          <CheckCircle2 size={11} style={{ color: '#4CBFB1' }} />
          <span className="text-[11px]" style={{ color: '#8B95A8' }}>{inProgress} active</span>
        </div>
        {blocked > 0 && (
          <div className="flex items-center gap-1">
            <AlertCircle size={11} style={{ color: '#F87171' }} />
            <span className="text-[11px]" style={{ color: '#F87171' }}>{blocked} blocked</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SquadCard({ name, projects }: { name: string; projects: string[] }) {
  const [expanded, setExpanded] = useState(true);
  const members = DEMO_USERS.filter(u => u.squad === name);
  const color = SQUAD_COLORS[name] || '#4CBFB1';
  const available = members.filter(m => m.status === 'available').length;
  const busy = members.filter(m => m.status === 'busy').length;

  return (
    <div className="rounded-2xl overflow-hidden animate-fade-in" style={{ border: '1px solid #252A38' }}>
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between cursor-pointer"
        style={{ background: `${color}0D`, borderBottom: expanded ? `1px solid ${color}22` : 'none' }}
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <h3 className="font-display font-600 text-white text-sm">{name}</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-600"
            style={{ background: `${color}22`, color }}>
            {members.length} QA{members.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {available > 0 && (
            <span className="text-[11px] flex items-center gap-1" style={{ color: '#4CBFB1' }}>
              <Zap size={10} /> {available} available
            </span>
          )}
          {busy > 0 && (
            <span className="text-[11px] flex items-center gap-1" style={{ color: '#F59E0B' }}>
              {busy} busy
            </span>
          )}
          {expanded ? <ChevronUp size={14} color="#8B95A8" /> : <ChevronDown size={14} color="#8B95A8" />}
        </div>
      </div>

      {expanded && (
        <div style={{ background: '#171B26' }}>
          {/* Projects row */}
          <div className="px-5 py-3 flex flex-wrap gap-1.5" style={{ borderBottom: '1px solid #252A38' }}>
            {projects.map(p => (
              <span key={p} className="text-[11px] px-2.5 py-1 rounded-lg"
                style={{ background: '#252A38', color: '#8B95A8' }}>
                {p}
              </span>
            ))}
          </div>

          {/* Members grid */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {members.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OverviewPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const totalQAs = DEMO_USERS.filter(u => u.role === 'qa').length;
  const activeQAs = DEMO_USERS.filter(u => u.status === 'active' || u.status === 'busy').length;
  const availableQAs = DEMO_USERS.filter(u => u.status === 'available').length;
  const blockedTasks = DEMO_TASKS.filter(t => t.status === 'blocked').length;

  const filteredSquads = Object.entries(SQUADS_CONFIG).filter(([name]) => {
    if (!search) return true;
    const members = DEMO_USERS.filter(u => u.squad === name);
    return name.toLowerCase().includes(search.toLowerCase()) ||
      members.some(m => m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.projects.some(p => p.toLowerCase().includes(search.toLowerCase())));
  });

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-700 text-white">
          {user?.role === 'manager' ? 'QA Team Overview' : `Welcome, ${user?.name.split(' ')[0]}`}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8B95A8' }}>
          {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total QA Engineers', value: totalQAs, icon: Users, color: '#4CBFB1' },
          { label: 'Active / Working', value: activeQAs, icon: CheckCircle2, color: '#10B981' },
          { label: 'Available Capacity', value: availableQAs, icon: Zap, color: '#6B8EFF' },
          { label: 'Blocked Tasks', value: blockedTasks, icon: AlertCircle, color: '#F87171' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl p-4 card-glow"
            style={{ background: '#171B26', border: '1px solid #252A38' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wider" style={{ color: '#8B95A8' }}>{label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15` }}>
                <Icon size={14} style={{ color }} />
              </div>
            </div>
            <p className="font-display text-3xl font-700" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-5 relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B95A8' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search squads, members, projects..."
          className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none"
          style={{ background: '#171B26', border: '1px solid #252A38', fontFamily: 'DM Sans' }}
          onFocus={e => e.target.style.borderColor = '#4CBFB1'}
          onBlur={e => e.target.style.borderColor = '#252A38'}
        />
      </div>

      {/* Squad cards */}
      <div className="space-y-4">
        {filteredSquads.map(([name, projects]) => (
          <SquadCard key={name} name={name} projects={projects} />
        ))}
        {filteredSquads.length === 0 && (
          <div className="text-center py-16" style={{ color: '#8B95A8' }}>
            <p>No results for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
