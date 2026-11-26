import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/capgen/AuthShell';
import { siteConfig } from '../config/site';
import { useAuth } from '../hooks/useAuth';

export function CapgenSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        username: name.trim(),
        email: email.trim(),
        password,
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      if (typeof detail === 'string' && detail) {
        setError(detail);
      } else if (Array.isArray(detail) && detail[0]?.msg) {
        setError(String(detail[0].msg));
      } else {
        setError('Could not create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="GET STARTED IN 60 SECONDS"
      headline="Captions, in your voice. From day one."
      initialSlideIndex={1}
      quote="The tonal range is honestly uncanny. The X caption sounds like me at midnight, the LinkedIn one like me at 9am."
      quoteAuthor="Priya Sood"
      quoteRole="BRAND DESIGNER"
      quoteAvatar="/images/avatars/priya.webp"
      topRightPrompt={`Already on ${siteConfig.name}?`}
      topRightLinkLabel="Sign in"
      topRightLinkTo="/login"
    >
      <div className="text-lime mb-2 font-mono text-[10.5px] tracking-[0.16em] uppercase">
        CREATE YOUR ACCOUNT
      </div>

      <h2 className="font-instrument-serif text-paper m-0 text-[38px] leading-[1.05] tracking-[-0.015em]">
        Start writing <span className="text-lime italic">captions like you.</span>
      </h2>

      <p className="text-paper-dim mt-1.5 mb-7 text-[13.5px] leading-relaxed">
        Free forever. 10 credits on us, no card needed to try.
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
            htmlFor="signup-name"
            className="text-muted mb-1.5 block font-mono text-[10px] tracking-[0.14em] uppercase"
          >
            NAME / USERNAME
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jordan Lee"
            required
            className="bg-ink-3 border-line text-paper placeholder:text-muted focus:border-lime w-full rounded-[10px] border px-3.5 py-3 text-[13.5px] transition-colors outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="text-muted mb-1.5 block font-mono text-[10px] tracking-[0.14em] uppercase"
          >
            EMAIL
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourdomain.com"
            required
            className="bg-ink-3 border-line text-paper placeholder:text-muted focus:border-lime w-full rounded-[10px] border px-3.5 py-3 text-[13.5px] transition-colors outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="text-muted mb-1.5 block font-mono text-[10px] tracking-[0.14em] uppercase"
          >
            PASSWORD
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
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
          <div className="text-muted mt-1.5 text-[11px]">At least 8 characters.</div>
        </div>

        <label className="text-paper-dim flex cursor-pointer items-center gap-2.5 pt-1 text-[12px]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
            className="border-line-2 bg-ink-3 accent-lime h-4 w-4 rounded"
          />
          <span>
            I agree to the{' '}
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="text-paper underline underline-offset-4"
            >
              Terms
            </a>{' '}
            and{' '}
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="text-paper underline underline-offset-4"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-lime text-lime-ink mt-1 w-full cursor-pointer rounded-[10px] border-0 py-3.5 text-[14px] font-semibold transition-transform duration-150 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
