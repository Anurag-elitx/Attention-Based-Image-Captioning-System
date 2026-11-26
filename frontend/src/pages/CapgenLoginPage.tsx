import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/capgen/AuthShell';
import { siteConfig } from '../config/site';
import { useAuth } from '../hooks/useAuth';

export function CapgenLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ username: identifier.trim(), password });
      navigate('/dashboard');
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(
        typeof detail === 'string' && detail
          ? detail
          : 'Invalid email/username or password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      headline="Pick up right where the scroll left off."
      initialSlideIndex={0}
      quote="I used to spend 20 minutes staring at a blank caption box. Now I pick one, tweak a word, post. My Sunday mornings are mine again."
      quoteAuthor="Maren Ebert"
      quoteRole="FOOD CREATOR · @MARENEATS"
      quoteAvatar="/images/avatars/maren.webp"
      topRightPrompt="New here?"
      topRightLinkLabel="Create account"
      topRightLinkTo="/signup"
    >
      <div className="text-lime mb-2 font-mono text-[10.5px] tracking-[0.16em] uppercase">
        SIGN IN TO {siteConfig.name.toUpperCase()}
      </div>

      <h2 className="font-instrument-serif text-paper m-0 text-[38px] leading-[1.05] tracking-[-0.015em]">
        Welcome <span className="text-lime italic">back.</span>
      </h2>

      <p className="text-paper-dim mt-1.5 mb-7 text-[13.5px] leading-relaxed">
        Your collections and credits are right where you left them.
      </p>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-[10px] border border-[#5a2323] bg-[#2a1212] px-3.5 py-2.5 text-[12.5px] text-[#ff8a8a]"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="text-muted mb-1.5 block font-mono text-[10px] tracking-[0.14em] uppercase"
          >
            EMAIL OR USERNAME
          </label>
          <input
            id="login-email"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@yourdomain.com"
            required
            className="bg-ink-3 border-line text-paper placeholder:text-muted focus:border-lime w-full rounded-[10px] border px-3.5 py-3 text-[13.5px] transition-colors outline-none"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-muted font-mono text-[10px] tracking-[0.14em] uppercase"
            >
              PASSWORD
            </label>
            <a
              href="#forgot"
              onClick={(e) => e.preventDefault()}
              className="text-muted hover:text-paper text-[11px] underline underline-offset-4 transition-colors"
            >
              Forgot?
            </a>
          </div>

          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-ink-3 border-line text-paper placeholder:text-muted focus:border-lime w-full rounded-[10px] border py-3 pr-14 pl-3.5 text-[13.5px] transition-colors outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted hover:text-paper absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-0 bg-transparent font-mono text-[10px] tracking-[0.12em] uppercase"
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-lime text-lime-ink mt-2 w-full cursor-pointer rounded-[10px] border-0 py-3.5 text-[14px] font-semibold transition-transform duration-150 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-muted mt-4 text-[11.5px]">
        Your photos are never used to train models
      </p>
    </AuthShell>
  );
}
