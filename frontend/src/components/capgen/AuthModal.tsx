import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '../../config/site';

interface AuthModalProps {
  open: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
}

export function AuthModal({ open, initialMode = 'signin', onClose }: AuthModalProps) {
  const [overrideMode, setOverrideMode] = useState<'signin' | 'signup' | null>(null);
  const mode = overrideMode ?? initialMode;
  const setMode = (next: 'signin' | 'signup') => setOverrideMode(next);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    navigate('/dashboard');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="bg-ink-2 border-line-2 relative w-full max-w-[420px] rounded-3xl border p-7 shadow-[0_32px_80px_rgba(0,0,0,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="border-line text-muted hover:text-paper absolute top-5 right-5 grid h-8 w-8 cursor-pointer place-items-center rounded-full border bg-transparent"
        >
          ×
        </button>

        <div className="mb-5 flex items-center gap-2">
          <img src={siteConfig.logoSrc} alt="" width={22} height={22} />
          <span className="font-instrument-serif text-[22px] italic">{siteConfig.name}</span>
        </div>

        <h2 id="auth-modal-title" className="font-instrument-serif m-0 text-[34px] leading-tight">
          {mode === 'signin' ? (
            <>
              Welcome <span className="text-lime italic">back.</span>
            </>
          ) : (
            <>
              Start with <span className="text-lime italic">2 free credits.</span>
            </>
          )}
        </h2>
        <p className="text-paper-dim mt-2 mb-6 text-sm">
          {mode === 'signin'
            ? 'Sign in to open your caption studio and collections.'
            : 'No credit card required. Enter the studio in one click.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-muted mb-1.5 block font-mono text-[10.5px] tracking-[0.14em] uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-ink-3 border-line text-paper placeholder:text-muted focus:border-lime w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-muted mb-1.5 block font-mono text-[10.5px] tracking-[0.14em] uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-ink-3 border-line text-paper placeholder:text-muted focus:border-lime w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-lime text-lime-ink w-full cursor-pointer rounded-full py-3 text-sm font-medium transition-transform duration-150 hover:-translate-y-px"
          >
            {mode === 'signin' ? 'Continue to Studio →' : 'Create free account →'}
          </button>
        </form>

        <div className="text-muted mt-5 text-center text-xs">
          {mode === 'signin' ? (
            <>
              New here?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-lime cursor-pointer border-0 bg-transparent underline"
              >
                Start free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-lime cursor-pointer border-0 bg-transparent underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
