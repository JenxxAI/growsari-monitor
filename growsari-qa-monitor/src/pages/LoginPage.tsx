import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = login(username.trim(), password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center px-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#4CBFB1 1px, transparent 1px), linear-gradient(90deg, #4CBFB1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 pulse-teal"
            style={{ background: 'linear-gradient(135deg, #4CBFB1, #3AA89B)' }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <h1 className="font-display text-2xl font-700 text-white tracking-tight">GrowSari</h1>
          <p className="text-sm mt-1" style={{ color: '#4CBFB1' }}>QA Monitor Platform</p>
        </div>

        {/* Card */}
        <div className="card-glow rounded-2xl p-8" style={{ background: '#171B26', border: '1px solid #252A38' }}>
          <h2 className="font-display text-xl font-600 text-white mb-1">Sign in</h2>
          <p className="text-sm mb-6" style={{ color: '#8B95A8' }}>
            Use your QA team credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-500 mb-1.5 uppercase tracking-wider" style={{ color: '#8B95A8' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. qa.you or admin"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  background: '#0F1117',
                  border: '1px solid #252A38',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={e => e.target.style.borderColor = '#4CBFB1'}
                onBlur={e => e.target.style.borderColor = '#252A38'}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-500 mb-1.5 uppercase tracking-wider" style={{ color: '#8B95A8' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none transition-all"
                  style={{
                    background: '#0F1117',
                    border: '1px solid #252A38',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                  onFocus={e => e.target.style.borderColor = '#4CBFB1'}
                  onBlur={e => e.target.style.borderColor = '#252A38'}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                  style={{ color: '#8B95A8' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-600 text-sm text-white transition-all mt-2"
              style={{
                background: loading ? '#3AA89B' : 'linear-gradient(135deg, #4CBFB1, #3AA89B)',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-xl p-3 text-xs space-y-1" style={{ background: 'rgba(76,191,177,0.06)', border: '1px solid rgba(76,191,177,0.15)' }}>
            <p className="font-600" style={{ color: '#4CBFB1' }}>Demo credentials</p>
            <p style={{ color: '#8B95A8' }}><span className="text-white font-mono text-[11px]">admin</span> / test123 — Manager access</p>
            <p style={{ color: '#8B95A8' }}><span className="text-white font-mono text-[11px]">qa.you</span> / test123 — QA (OPS squad)</p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#8B95A8' }}>
          GrowSari Tech QA Team · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
