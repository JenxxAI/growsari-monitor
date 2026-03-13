import { useState } from 'react';
import { DEMO_USERS, SQUADS_CONFIG, SQUAD_COLORS } from '../lib/data';
import { User, MemberStatus } from '../types';
import { Plus, Pencil, Trash2, X, Check, Search, Shield, User as UserIcon } from 'lucide-react';

const STATUS_OPTIONS: MemberStatus[] = ['active', 'available', 'busy', 'on_leave'];
const STATUS_LABEL: Record<MemberStatus, string> = {
  active: 'Active',
  available: 'Available',
  busy: 'Busy',
  on_leave: 'On Leave',
};
const ALL_SQUADS = Object.keys(SQUADS_CONFIG);

function EditModal({ user, onClose, onSave }: {
  user: Partial<User> | null;
  onClose: () => void;
  onSave: (u: Partial<User>) => void;
}) {
  const [form, setForm] = useState<Partial<User>>(user || {
    name: '', username: '', role: 'qa', squad: 'OPS', status: 'active', projects: [], capacity: 50
  });
  const [projectInput, setProjectInput] = useState('');

  const squadProjects = form.squad ? SQUADS_CONFIG[form.squad] || [] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6 animate-fade-in"
        style={{ background: '#171B26', border: '1px solid #252A38' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-700 text-white">{user?.id ? 'Edit QA Engineer' : 'Add QA Engineer'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: '#8B95A8' }}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8B95A8' }}>Full Name</label>
              <input type="text" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                style={{ background: '#0F1117', border: '1px solid #252A38', fontFamily: 'DM Sans' }}
                onFocus={e => e.target.style.borderColor = '#4CBFB1'}
                onBlur={e => e.target.style.borderColor = '#252A38'} />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8B95A8' }}>Username</label>
              <input type="text" value={form.username || ''} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="qa.firstname"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none font-mono"
                style={{ background: '#0F1117', border: '1px solid #252A38', fontFamily: 'JetBrains Mono' }}
                onFocus={e => e.target.style.borderColor = '#4CBFB1'}
                onBlur={e => e.target.style.borderColor = '#252A38'} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8B95A8' }}>Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as 'qa' | 'manager' }))}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                style={{ background: '#0F1117', border: '1px solid #252A38', fontFamily: 'DM Sans' }}>
                <option value="qa">QA Engineer</option>
                <option value="manager">QE Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8B95A8' }}>Squad</label>
              <select value={form.squad} onChange={e => setForm(f => ({ ...f, squad: e.target.value, projects: [] }))}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                style={{ background: '#0F1117', border: '1px solid #252A38', fontFamily: 'DM Sans' }}>
                {ALL_SQUADS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8B95A8' }}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as MemberStatus }))}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                style={{ background: '#0F1117', border: '1px solid #252A38', fontFamily: 'DM Sans' }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8B95A8' }}>Capacity ({form.capacity}%)</label>
              <input type="range" min={0} max={100} value={form.capacity || 0}
                onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))}
                className="w-full mt-2" style={{ accentColor: '#4CBFB1' }} />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B95A8' }}>Projects (select all that apply)</label>
            <div className="flex flex-wrap gap-1.5">
              {squadProjects.map(p => {
                const selected = form.projects?.includes(p);
                return (
                  <button key={p} type="button"
                    onClick={() => setForm(f => ({
                      ...f,
                      projects: selected
                        ? (f.projects || []).filter(x => x !== p)
                        : [...(f.projects || []), p]
                    }))}
                    className="text-xs px-2.5 py-1 rounded-lg transition-all font-500"
                    style={selected
                      ? { background: 'rgba(76,191,177,0.15)', color: '#4CBFB1', border: '1px solid rgba(76,191,177,0.35)' }
                      : { background: '#252A38', color: '#8B95A8', border: '1px solid transparent' }
                    }>
                    {selected && <span className="mr-1">✓</span>}{p}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B95A8' }}>Current Task (optional)</label>
            <input type="text" value={form.currentTask || ''} onChange={e => setForm(f => ({ ...f, currentTask: e.target.value }))}
              placeholder="What are they working on?"
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
              style={{ background: '#0F1117', border: '1px solid #252A38', fontFamily: 'DM Sans' }}
              onFocus={e => e.target.style.borderColor = '#4CBFB1'}
              onBlur={e => e.target.style.borderColor = '#252A38'} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm transition-colors"
            style={{ background: '#252A38', color: '#8B95A8' }}>Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 rounded-xl text-sm font-500 text-white flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #4CBFB1, #3AA89B)' }}>
            <Check size={14} /> {user?.id ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManagePage() {
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [editTarget, setEditTarget] = useState<Partial<User> | null | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [squadFilter, setSquadFilter] = useState('ALL');

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.squad.toLowerCase().includes(search.toLowerCase());
    const matchSquad = squadFilter === 'ALL' || u.squad === squadFilter;
    return matchSearch && matchSquad;
  });

  const handleSave = (form: Partial<User>) => {
    if (form.id) {
      setUsers(us => us.map(u => u.id === form.id ? { ...u, ...form } as User : u));
    } else {
      const newUser: User = {
        id: `u${Date.now()}`,
        username: form.username || 'qa.new',
        name: form.name || 'New QA',
        role: form.role || 'qa',
        squad: form.squad || 'OPS',
        status: form.status || 'active',
        projects: form.projects || [],
        currentTask: form.currentTask,
        capacity: form.capacity || 50,
      };
      setUsers(us => [...us, newUser]);
    }
    setEditTarget(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this QA engineer from the monitor?')) {
      setUsers(us => us.filter(u => u.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-screen-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-700 text-white">Manage Accounts</h1>
          <p className="text-sm mt-1" style={{ color: '#8B95A8' }}>Add, edit, or remove QA engineers from the monitor</p>
        </div>
        <button
          onClick={() => setEditTarget(null)}
          className="px-4 py-2 rounded-xl text-sm font-500 text-white flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #4CBFB1, #3AA89B)' }}
        >
          <Plus size={15} /> Add QA Engineer
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B95A8' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search members…"
            className="rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none"
            style={{ background: '#171B26', border: '1px solid #252A38', fontFamily: 'DM Sans', width: '220px' }}
            onFocus={e => e.target.style.borderColor = '#4CBFB1'}
            onBlur={e => e.target.style.borderColor = '#252A38'}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['ALL', ...ALL_SQUADS].map(s => (
            <button key={s} onClick={() => setSquadFilter(s)}
              className="px-3 py-2 rounded-xl text-xs font-500 transition-all"
              style={squadFilter === s
                ? { background: `${SQUAD_COLORS[s] || '#4CBFB1'}20`, color: SQUAD_COLORS[s] || '#4CBFB1', border: `1px solid ${SQUAD_COLORS[s] || '#4CBFB1'}40` }
                : { background: '#171B26', color: '#8B95A8', border: '1px solid #252A38' }
              }>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-5 text-sm">
        <span style={{ color: '#8B95A8' }}><span className="text-white font-600">{filtered.length}</span> members shown</span>
        <span style={{ color: '#8B95A8' }}><span className="text-white font-600">{filtered.filter(u => u.status === 'available').length}</span> available</span>
        <span style={{ color: '#8B95A8' }}><span className="text-white font-600">{filtered.filter(u => u.status === 'on_leave').length}</span> on leave</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #252A38' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#171B26', borderBottom: '1px solid #252A38' }}>
              {['Member', 'Squad', 'Role', 'Projects', 'Status', 'Capacity', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-600" style={{ color: '#8B95A8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}
                style={{ background: i % 2 === 0 ? '#0F1117' : '#171B26', borderBottom: '1px solid #252A38' }}
                className="hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-700 shrink-0"
                      style={{ background: `${SQUAD_COLORS[u.squad]}22`, color: SQUAD_COLORS[u.squad], fontFamily: 'Space Grotesk' }}>
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-white font-500 text-sm">{u.name}</p>
                      <p className="text-[10px] font-mono" style={{ color: '#8B95A8' }}>@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-500" style={{ color: SQUAD_COLORS[u.squad] }}>{u.squad}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs flex items-center gap-1" style={{ color: u.role === 'manager' ? '#FCD34D' : '#8B95A8' }}>
                    {u.role === 'manager' ? <Shield size={11} /> : <UserIcon size={11} />}
                    {u.role === 'manager' ? 'Manager' : 'QA Engineer'}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-[180px]">
                  <div className="flex flex-wrap gap-1">
                    {u.projects.slice(0, 2).map(p => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 rounded-md"
                        style={{ background: '#252A38', color: '#8B95A8' }}>{p}</span>
                    ))}
                    {u.projects.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: '#252A38', color: '#8B95A8' }}>
                        +{u.projects.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1.5 text-xs`}>
                    <span className={`status-dot status-${u.status}`} />
                    <span style={{ color: '#8B95A8' }}>{STATUS_LABEL[u.status]}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="capacity-bar w-16">
                      <div className="capacity-fill" style={{
                        width: `${u.capacity}%`,
                        background: u.capacity >= 85 ? '#F87171' : u.capacity >= 60 ? '#FCD34D' : '#4CBFB1'
                      }} />
                    </div>
                    <span className="text-xs" style={{ color: '#8B95A8' }}>{u.capacity}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditTarget(u)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      style={{ color: '#8B95A8' }}>
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      style={{ color: '#8B95A8' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm" style={{ color: '#8B95A8', background: '#0F1117' }}>No members found.</div>
        )}
      </div>

      {/* Modal */}
      {editTarget !== undefined && (
        <EditModal user={editTarget} onClose={() => setEditTarget(undefined)} onSave={handleSave} />
      )}
    </div>
  );
}
