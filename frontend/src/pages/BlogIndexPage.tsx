import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogCard, BlogVisual } from '../components/capgen/BlogCard';
import { CtaBanner } from '../components/capgen/CtaBanner';
import { Footer } from '../components/capgen/Footer';
import { Header } from '../components/capgen/Header';
import { ArrowRightIcon } from '../components/capgen/NetIcon';
import { BLOG_CATEGORIES, BLOG_POSTS } from '../data/posts';

export function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All posts');

  const featuredPost = BLOG_POSTS[0];
  const gridPosts = BLOG_POSTS.filter((p) => {
    if (selectedCategory === 'All posts') return !p.featured;
    return p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen">
      <Header variant="public" />

      <main>
        {/* Header / Intro */}
        <section className="section-pad pt-14 pb-12">
          <div className="container">
            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.35fr_1fr]">
              <h1
                className="font-instrument-serif text-paper m-0 leading-[0.94] tracking-[-0.025em]"
                style={{ fontSize: 'clamp(46px, 6vw, 76px)' }}
              >
                Guides, tips, and caption ideas that{' '}
                <span className="text-lime italic">actually</span> help.
              </h1>

              <div>
                <p className="text-paper-dim m-0 max-w-[420px] text-[15px] leading-[1.6]">
                  Straight-talking posts about AI caption generators, writing good captions for
                  every network, and building a social workflow that doesn&apos;t eat your whole
                  week. Pick one and dive in.
                </p>

                <div className="mt-6 flex flex-wrap gap-8">
                  <div>
                    <div className="text-muted font-mono text-[10px] tracking-[0.14em]">
                      WEEKLY
                    </div>
                    <div className="font-instrument-serif text-paper mt-0.5 text-[24px] italic">
                      One post
                    </div>
                  </div>
                  <div>
                    <div className="text-muted font-mono text-[10px] tracking-[0.14em]">
                      AVG READ
                    </div>
                    <div className="font-instrument-serif text-paper mt-0.5 text-[24px] italic">
                      7 min
                    </div>
                  </div>
                  <div>
                    <div className="text-muted font-mono text-[10px] tracking-[0.14em]">
                      UPDATED
                    </div>
                    <div className="font-instrument-serif text-paper mt-0.5 text-[24px] italic">
                      Jul &apos;26
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Post */}
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="bg-ink-2 border-line hover:border-line-2 group mt-12 grid grid-cols-1 overflow-hidden rounded-3xl border no-underline transition-colors lg:grid-cols-[1.15fr_1fr]"
            >
              <div className="border-line relative flex min-h-[290px] flex-col justify-between border-b lg:border-r lg:border-b-0">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="rounded-full bg-[#C13584] px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
                    {featuredPost.category}
                  </span>
                  <span className="border-line-2 bg-ink-3 text-paper-dim rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.12em]">
                    FEATURED
                  </span>
                </div>

                <BlogVisual type={featuredPost.visualType} />

                <div className="text-muted pointer-events-none absolute bottom-4 left-4 z-10 font-mono text-[10px] tracking-[0.14em]">
                  {featuredPost.date} · {featuredPost.readTime} READ
                </div>
              </div>

              <div className="flex flex-col justify-between p-7 lg:p-10">
                <div>
                  <div className="text-lime mb-3 font-mono text-[10.5px] tracking-[0.14em]">
                    EDITOR&apos;S PICK
                  </div>
                  <h2
                    className="font-instrument-serif text-paper group-hover:text-lime m-0 leading-[1.06] tracking-[-0.02em] transition-colors"
                    style={{ fontSize: 'clamp(30px, 3.6vw, 42px)' }}
                  >
                    {featuredPost.title}
                  </h2>
                  <p className="text-paper-dim mt-4 text-[14.5px] leading-[1.6]">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8.5 w-8.5 place-items-center rounded-full bg-[#1a8299] text-[11px] font-semibold text-white">
                      {featuredPost.author.initials}
                    </div>
                    <div>
                      <div className="text-paper text-[13px] font-medium">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-muted font-mono text-[10px] tracking-[0.12em]">
                        {featuredPost.readTime} · {featuredPost.date}
                      </div>
                    </div>
                  </div>

                  <span className="text-paper inline-flex items-center gap-1.5 text-[13px] font-medium">
                    <span>Read the article</span>
                    <ArrowRightIcon size={14} />
                  </span>
                </div>
              </div>
            </Link>

            {/* Filter Chips */}
            <div className="mt-9 flex flex-wrap items-center gap-2">
              <span className="text-muted mr-2 font-mono text-[10.5px] tracking-[0.14em]">
                FILTER
              </span>
              {BLOG_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] transition-colors ${
                      active
                        ? 'border-paper bg-paper text-ink font-medium'
                        : 'border-line bg-ink-2 text-paper-dim hover:text-paper'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="font-mono text-[10px] opacity-60">{cat.count}</span>
                  </button>
                );
              })}
            </div>

            {/* Posts Grid */}
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
