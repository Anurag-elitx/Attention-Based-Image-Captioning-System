import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlogVisual } from '../components/capgen/BlogCard';
import { Footer } from '../components/capgen/Footer';
import { Header } from '../components/capgen/Header';
import { ArrowRightIcon } from '../components/capgen/NetIcon';
import { BLOG_POSTS } from '../data/posts';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? BLOG_POSTS[0];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen">
      <Header variant="public" />

      <main className="py-12 md:py-16">
        <article className="container max-w-[780px]!">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.14em] uppercase">
            <Link to="/blog" className="text-muted hover:text-paper no-underline">
              BLOG
            </Link>
            <span className="text-muted">/</span>
            <span className="text-[#C13584]">{post.category}</span>
          </div>

          {/* Meta Pill + Reading Time */}
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-[#C13584] px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
              {post.category}
            </span>
            <span className="text-muted font-mono text-[10.5px] tracking-[0.14em]">
              {post.readTime} READ · {post.date}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-instrument-serif text-paper m-0 leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(38px, 5.2vw, 62px)' }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-paper-dim mt-5 mb-7 text-[17px] leading-[1.6]">{post.excerpt}</p>

          {/* Author & Share Bar */}
          <div className="border-line flex flex-wrap items-center justify-between gap-4 border-y py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#1a8299] text-xs font-semibold text-white">
                {post.author.initials}
              </div>
              <div>
                <div className="text-paper text-[13.5px] font-medium">{post.author.name}</div>
                <div className="text-muted font-mono text-[10px] tracking-[0.12em]">
                  WRITTEN · {post.date}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted mr-1 font-mono text-[10px] tracking-[0.14em]">
                SHARE
              </span>
              {['𝕏', 'in', 'f'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={handleCopyLink}
                  className="border-line bg-ink-2 text-paper-dim hover:text-paper grid h-8 w-8 cursor-pointer place-items-center rounded-full border text-xs transition-colors"
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={handleCopyLink}
                className="border-line bg-ink-2 text-paper-dim hover:text-paper cursor-pointer rounded-full border px-3.5 py-1.5 text-xs transition-colors"
              >
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>

          {/* Visual Hero */}
          <div className="border-line my-9 h-[300px] overflow-hidden rounded-3xl border md:h-[360px]">
            <BlogVisual type={post.visualType} />
          </div>

          {/* Body Blocks */}
          <div className="space-y-5 text-[16px] leading-[1.72] text-paper-dim">
            {post.body.map((block, i) => {
              switch (block.type) {
                case 'heading':
                  return (
                    <h2
                      key={i}
                      className="font-instrument-serif text-paper mt-10 mb-3 text-[28px] leading-tight tracking-[-0.01em] md:text-[32px]"
                    >
                      {block.text}
                    </h2>
                  );
                case 'paragraph':
                  return (
                    <p key={i} className="m-0">
                      {block.text}
                    </p>
                  );
                case 'tip':
                  return (
                    <div
                      key={i}
                      className="bg-ink-2 border-line my-7 flex items-start gap-4 rounded-2xl border p-5"
                    >
                      <span className="bg-lime text-lime-ink grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold">
                        ⚡
                      </span>
                      <div>
                        <div className="text-lime font-mono text-[10px] tracking-[0.14em] uppercase">
                          CAPTIO TIP
                        </div>
                        <div className="text-paper mt-1 text-[15px] font-semibold">
                          {block.title}
                        </div>
                        <p className="text-paper-dim mt-1 mb-0 text-[14px] leading-[1.6]">
                          {block.text}
                        </p>
                      </div>
                    </div>
                  );
                case 'steps':
                  return (
                    <div key={i} className="my-5 space-y-3">
                      {block.items?.map((item, j) => (
                        <div
                          key={j}
                          className="bg-ink-2 border-line flex items-start gap-3.5 rounded-xl border px-4 py-3.5"
                        >
                          <span className="text-lime mt-0.5 font-mono text-xs font-semibold">
                            {item.num}
                          </span>
                          <div className="text-[14.5px] leading-[1.6]">
                            {item.lead && (
                              <strong className="text-paper mr-1 font-semibold">
                                {item.lead}
                              </strong>
                            )}
                            <span>{item.body}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                case 'list':
                  return (
                    <ul key={i} className="my-4 list-disc space-y-2 pl-6">
                      {block.items?.map((item, j) => (
                        <li key={j}>
                          {item.lead && (
                            <strong className="text-paper mr-1.5 font-semibold">
                              {item.lead}
                            </strong>
                          )}
                          <span>{item.body}</span>
                        </li>
                      ))}
                    </ul>
                  );
                case 'quote':
                  return (
                    <blockquote
                      key={i}
                      className="border-lime my-8 border-l-2 pl-6"
                    >
                      <p className="font-instrument-serif text-paper m-0 text-[28px] leading-[1.25] italic">
                        &ldquo;{block.text}&rdquo;
                      </p>
                      {block.author && (
                        <footer className="text-muted mt-3 font-mono text-[10.5px] tracking-[0.14em]">
                          {block.author}
                        </footer>
                      )}
                    </blockquote>
                  );
                case 'samples':
                  return (
                    <div
                      key={i}
                      className="bg-ink-2 border-line my-6 space-y-2.5 rounded-2xl border p-5 font-mono text-[12.5px]"
                    >
                      {block.samples?.map((s) => (
                        <div key={s.network} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                          <span className="text-lime w-28 shrink-0">[{s.network}]</span>
                          <span className="text-paper">{s.caption}</span>
                        </div>
                      ))}
                    </div>
                  );
              }
            })}
          </div>

          {/* Try It Yourself CTA Card */}
          <div className="bg-ink-2 border-line-2 mt-14 rounded-3xl border p-8">
            <div className="text-lime font-mono text-[10.5px] tracking-[0.16em]">
              TRY IT YOURSELF
            </div>
            <h3 className="font-instrument-serif text-paper mt-2 mb-2 text-[36px] leading-tight">
              Drop a photo in, <span className="text-lime italic">get eight captions.</span>
            </h3>
            <p className="text-paper-dim m-0 mb-6 text-[14.5px]">
              Thirty free captions. No card. One less thing to think about before you post.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="bg-lime text-lime-ink inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium no-underline transition-transform duration-150 hover:-translate-y-px"
              >
                <span>Open the studio</span>
                <ArrowRightIcon size={14} />
              </Link>
              <Link
                to="/"
                className="border-line-2 text-paper hover:border-paper-dim rounded-full border px-5 py-3 text-sm font-medium no-underline transition-colors"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link to="/blog" className="text-paper-dim hover:text-lime text-sm no-underline">
              ← Back to all articles
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
