import { useState } from 'react';
import { MOCK_JIRA_TICKETS, MOCK_TESTPAD_RUNS } from '../lib/data';
import { ExternalLink, RefreshCw, BarChart3, AlertTriangle, CheckCircle, Clock, Search } from 'lucide-react';

const PRIORITY_CLASS: Record<string, string> = {
  Critical: 'priority-critical',
  High: 'priority-high',
  Medium: 'priority-medium',
  Low: 'priority-low',
};

const STATUS_COLOR: Record<string, string> = {
  'In Progress': '#4CBFB1',
  'To Do': '#8B95A8',
  'Done': '#10B981',
  'Blocked': '#F87171',
};

function TestpadProgressBar({ passed, failed, blocked, total }: { passed: number; failed: number; blocked: number; total: number }) {
  const pPct = (passed / total) * 100;
  const fPct = (failed / total) * 100;
  const bPct = (blocked / total) * 100;
  return (
    <div className="flex h-2 rounded-full overflow-hidden gap-px" style={{ background: '#252A38' }}>
      <div style={{ width: `${pPct}%`, background: '#10B981' }} />
      <div style={{ width: `${fPct}%`, background: '#F87171' }} />
      <div style={{ width: `${bPct}%`, background: '#F59E0B' }} />
    </div>
  );
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'jira' | 'testpad'>('jira');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [configOpen, setConfigOpen] = useState(false);
  const [jiraUrl, setJiraUrl] = useState('https://growsari.atlassian.net');
  const [testpadUrl, setTestpadUrl] = useState('https://app.testpad.com');

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const filteredJira = MOCK_JIRA_TICKETS.filter(t =>
    !search || t.key.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase()) ||
    t.assignee.toLowerCase().includes(search.toLowerCase()) ||
    t.project.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTestpad = MOCK_TESTPAD_RUNS.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.assignee.toLowerCase().includes(search.toLowerCase()) ||
    r.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-screen-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-700 text-white">Jira & Testpad</h1>
          <p className="text-sm mt-1" style={{ color: '#8B95A8' }}>Live integration via API proxy routes</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfigOpen(v => !v)}
            className="px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
            style={{ background: '#252A38', color: '#8B95A8', border: '1px solid #2E3447' }}
          >
            Configure
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
            style={{ background: 'rgba(76,191,177,0.12)', color: '#4CBFB1', border: '1px solid rgba(76,191,177,0.25)' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Config panel */}
      {configOpen && (
        <div className="mb-5 p-4 rounded-xl" style={{ background: '#171B26', border: '1px solid #252A38' }}>
          <p className="font-display font-600 text-sm text-white mb-3">Integration Settings</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={{ color: '#8B95A8' }}>Jira Base URL</label>
              <input
                type="text"
                value={jiraUrl}
                onChange={e => setJiraUrl(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                style={{ background: '#0F1117', border: '1px solid #252A38', fontFamily: 'DM Sans' }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#8B95A8' }}>Testpad Base URL</label>
              <input
                type="text"
                value={testpadUrl}
                onChange={e => setTestpadUrl(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                style={{ background: '#0F1117', border: '1px solid #252A38', fontFamily: 'DM Sans' }}
              />
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: '#8B95A8' }}>
            API keys are set via environment variables. See <code className="font-mono text-[11px] px-1 py-0.5 rounded" style={{ background: '#252A38', color: '#4CBFB1' }}>.env.local</code> in the README.
          </p>
        </div>
      )}

      {/* Info banner */}
      <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl text-xs" style={{ background: 'rgba(76,191,177,0.06)', border: '1px solid rgba(76,191,177,0.2)' }}>
        <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: '#4CBFB1' }} />
        <span style={{ color: '#8B95A8' }}>
          Showing <span className="text-white">mock data</span>. Connect real credentials via Vercel API routes <code className="font-mono text-[11px] px-1 py-0.5 rounded" style={{ background: '#252A38', color: '#4CBFB1' }}>/api/jira/tickets</code> and <code className="font-mono text-[11px] px-1 py-0.5 rounded" style={{ background: '#252A38', color: '#4CBFB1' }}>/api/testpad/runs</code>.
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-5" style={{ borderBottom: '1px solid #252A38' }}>
        {(['jira', 'testpad'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSearch(''); }}
            className={`px-5 py-2.5 text-sm font-500 transition-all capitalize ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}
          >
            {tab === 'jira' ? 'Jira Tickets' : 'Testpad Runs'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B95A8' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${activeTab === 'jira' ? 'tickets' : 'runs'}…`}
          className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none"
          style={{ background: '#171B26', border: '1px solid #252A38', fontFamily: 'DM Sans' }}
          onFocus={e => e.target.style.borderColor = '#4CBFB1'}
          onBlur={e => e.target.style.borderColor = '#252A38'}
        />
      </div>

      {/* Jira table */}
      {activeTab === 'jira' && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #252A38' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#171B26', borderBottom: '1px solid #252A38' }}>
                {['Key', 'Summary', 'Project', 'Assignee', 'Status', 'Priority', 'Updated', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-600" style={{ color: '#8B95A8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredJira.map((t, i) => (
                <tr key={t.key}
                  style={{ background: i % 2 === 0 ? '#0F1117' : '#171B26', borderBottom: '1px solid #252A38' }}
                  className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-600" style={{ color: '#4CBFB1' }}>{t.key}</span>
                  </td>
                  <td className="px-4 py-3 text-white max-w-xs truncate">{t.summary}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8B95A8' }}>{t.project}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: '#8B95A8' }}>{t.assignee}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-500"
                      style={{ color: STATUS_COLOR[t.status] || '#8B95A8', background: `${STATUS_COLOR[t.status] || '#8B95A8'}15` }}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-500 ${PRIORITY_CLASS[t.priority] || ''}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8B95A8' }}>{t.updated}</td>
                  <td className="px-4 py-3">
                    <a href={`${jiraUrl}/browse/${t.key}`} target="_blank" rel="noopener noreferrer"
                      className="p-1 rounded hover:bg-white/10 inline-flex" style={{ color: '#8B95A8' }}>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredJira.length === 0 && (
            <div className="py-10 text-center text-sm" style={{ color: '#8B95A8', background: '#0F1117' }}>No tickets found.</div>
          )}
        </div>
      )}

      {/* Testpad runs */}
      {activeTab === 'testpad' && (
        <div className="space-y-3">
          {filteredTestpad.map(run => {
            const notRun = run.total - run.passed - run.failed - run.blocked;
            return (
              <div key={run.id} className="rounded-xl p-4 transition-all"
                style={{ background: '#171B26', border: '1px solid #252A38' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${run.status === 'running' ? 'bg-teal-400' : 'bg-yellow-400'}`} />
                      <p className="font-500 text-white text-sm truncate">{run.name}</p>
                    </div>
                    <p className="text-xs font-mono" style={{ color: '#8B95A8' }}>
                      {run.project} · @{run.assignee}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1" style={{ color: '#34D399' }}>
                        <CheckCircle size={12} /> {run.passed}
                      </span>
                      <span className="flex items-center gap-1" style={{ color: '#F87171' }}>
                        <AlertTriangle size={12} /> {run.failed}
                      </span>
                      <span className="flex items-center gap-1" style={{ color: '#F59E0B' }}>
                        <Clock size={12} /> {run.blocked}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-700 text-white">{run.progress}%</p>
                      <p className="text-[10px]" style={{ color: '#8B95A8' }}>{run.passed}/{run.total}</p>
                    </div>
                    <a href={`${testpadUrl}/runs/${run.id}`} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: '#8B95A8' }}>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
                <div className="mt-3">
                  <TestpadProgressBar {...run} />
                </div>
                <div className="mt-1 flex justify-between text-[10px]" style={{ color: '#8B95A8' }}>
                  <span>{notRun} not run</span>
                  <span>{run.total} total cases</span>
                </div>
              </div>
            );
          })}
          {filteredTestpad.length === 0 && (
            <div className="py-10 text-center text-sm" style={{ color: '#8B95A8' }}>No test runs found.</div>
          )}
        </div>
      )}
    </div>
  );
}
