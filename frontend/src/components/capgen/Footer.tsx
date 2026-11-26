import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';

export function Footer() {
  return (
    <footer className="border-line border-t pt-10 pb-8">
      <div className="grid-footer container">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              alt={siteConfig.name}
              width={22}
              height={22}
              src={siteConfig.logoSrc}
              className="h-[22px] w-[22px] shrink-0"
            />
            <div className="font-instrument-serif text-[22px] italic">{siteConfig.name}</div>
          </div>
          <p className="text-paper-dim mt-3.5 max-w-[320px] text-[13px] leading-normal">
            {siteConfig.tagline}
          </p>
          <div className="text-muted mt-6 font-mono text-[11px] tracking-[0.08em]">
            {siteConfig.copyright}
          </div>
        </div>

        {siteConfig.footerColumns.map((col) => (
          <div key={col.heading}>
            <div className="text-muted mb-3.5 font-mono text-[10.5px] tracking-[0.14em]">
              {col.heading}
            </div>
            {col.links.map((item) =>
              item.external || item.href.startsWith('#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-paper-dim hover:text-paper block py-1 text-[13px] no-underline transition-colors duration-150"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-paper-dim hover:text-paper block py-1 text-[13px] no-underline transition-colors duration-150"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
