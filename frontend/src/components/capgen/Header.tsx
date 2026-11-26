import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { siteConfig } from '../../config/site';
import { MOCK_DASHBOARD_USER } from '../../data/dashboard';
import { useAuth } from '../../hooks/useAuth';
import { CreditsPill } from './CreditsPill';

interface HeaderProps {
  variant?: 'public' | 'dashboard';
  credits?: number;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export function Header({
  variant = 'public',
  credits = MOCK_DASHBOARD_USER.credits,
}: HeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.username ?? MOCK_DASHBOARD_USER.name;
  const displayEmail = user?.email ?? MOCK_DASHBOARD_USER.email;
  const displayInitials = displayName
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    navigate(mode === 'signin' ? '/login' : '/signup');
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b py-4 transition-[background-color,border-color] duration-200 md:py-6 ${
        scrolled
          ? 'border-line bg-ink/85 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between gap-3">
        <Link
          to={variant === 'dashboard' ? '/dashboard' : '/'}
          className="text-paper flex items-center gap-2.5 no-underline"
        >
          <img
            alt={siteConfig.name}
            width={26}
            height={26}
            src={siteConfig.logoSrc}
            className="h-[26px] w-[26px] shrink-0"
          />
          <span className="font-instrument-serif text-[26px] leading-none italic">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {siteConfig.navLinks.map((link) => {
            const active = pathname === link.to || pathname.startsWith(`${link.to}/`);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`no-underline transition-colors duration-150 ${
                  active ? 'text-lime' : 'text-paper-dim hover:text-lime'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          {variant === 'dashboard' ? (
            <>
              <div className="hidden sm:inline-flex">
                <CreditsPill credits={credits} onClick={() => navigate('/pricing')} />
              </div>

              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="text-ink grid h-[34px] w-[34px] cursor-pointer place-items-center overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(135deg,#C8FF4D,#4A7CFF)] text-[13px] font-semibold"
                >
                  {MOCK_DASHBOARD_USER.avatarUrl ? (
                    <img
                      src={MOCK_DASHBOARD_USER.avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    displayInitials
                  )}
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="bg-ink-2 border-line absolute top-11 right-0 z-50 min-w-60 rounded-[14px] border p-1.5 shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
                  >
                    <div className="border-line mb-1.5 border-b px-3 pt-2.5 pb-2">
                      <div className="text-paper text-[13.5px] font-medium">
                        {displayName}
                      </div>
                      <div className="text-muted mt-0.5 text-xs">
                        {displayEmail}
                      </div>
                      <div className="text-lime mt-1 font-mono text-[10.5px] tracking-[1.4px]">
                        {credits} CREDITS · {MOCK_DASHBOARD_USER.plan.toUpperCase()}
                      </div>
                    </div>
                    <Link
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className="text-paper-dim hover:text-paper block rounded-lg px-3 py-2 text-[13.5px] no-underline transition-colors hover:bg-white/4"
                    >
                      Home
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={() => setMenuOpen(false)}
                      className="text-paper-dim hover:text-paper block rounded-lg px-3 py-2 text-[13.5px] no-underline transition-colors hover:bg-white/4"
                    >
                      Billing & credits
                    </Link>
                    <div className="border-line mt-1.5 border-t pt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="text-paper-dim hover:text-paper block w-full cursor-pointer rounded-lg border-0 bg-transparent px-3 py-2 text-left text-[13.5px] transition-colors hover:bg-white/4"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleAuthClick('signin')}
                className="text-paper-dim hover:text-paper hidden cursor-pointer border-0 bg-transparent px-3 py-2 text-[13.5px] font-medium transition-colors duration-150 md:inline-flex"
              >
                {siteConfig.publicActions.signInLabel}
              </button>
              <button
                type="button"
                onClick={() => handleAuthClick('signup')}
                className="bg-lime text-lime-ink border-lime inline-flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-[13px] leading-none font-medium whitespace-nowrap transition-transform duration-150 hover:-translate-y-px"
              >
                {siteConfig.publicActions.primaryCtaLabel}
              </button>
            </>
          )}

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="bg-ink-2 border-line text-paper grid h-9 w-9 cursor-pointer place-items-center rounded-full border md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-line bg-ink-2 mt-3 border-t px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-paper-dim hover:text-lime py-1.5 text-sm no-underline"
              >
                {link.label}
              </Link>
            ))}
            {variant === 'public' ? (
              <div className="border-line mt-2 flex items-center gap-3 border-t pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleAuthClick('signin');
                  }}
                  className="text-paper-dim border-line-2 flex-1 rounded-full border py-2 text-sm"
                >
                  {siteConfig.publicActions.signInLabel}
                </button>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="bg-lime text-lime-ink flex-1 rounded-full py-2 text-center text-sm font-medium no-underline"
                >
                  Studio
                </Link>
              </div>
            ) : (
              <div className="border-line mt-2 flex items-center justify-between border-t pt-3">
                <CreditsPill credits={credits} onClick={() => navigate('/pricing')} />
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-paper-dim text-sm no-underline"
                >
                  Landing
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
