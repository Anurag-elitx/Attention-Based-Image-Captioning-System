export type BlogCategory =
  | 'Basics'
  | 'Instagram'
  | 'LinkedIn'
  | 'Facebook'
  | 'X (Twitter)'
  | 'Strategy'
  | 'Guides'
  | 'Productivity';

export interface BlogArticleBlock {
  type: 'paragraph' | 'heading' | 'tip' | 'steps' | 'list' | 'quote' | 'samples';
  title?: string;
  text?: string;
  author?: string;
  items?: { num?: string; lead?: string; body: string }[];
  samples?: { network: string; caption: string }[];
}

export interface BlogPost {
  slug: string;
  category: BlogCategory;
  categoryColor: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    initials: string;
  };
  featured?: boolean;
  visualType:
    | 'robot'
    | 'workflow'
    | 'ideas'
    | 'linkedin'
    | 'facebook'
    | 'twitter'
    | 'snap-threads'
    | 'good-caption'
    | 'save-hours'
    | 'analyze-photo'
    | 'hashtags'
    | 'followers';
  body: BlogArticleBlock[];
}

export const BLOG_CATEGORIES: { label: string; count: string }[] = [
  { label: 'All posts', count: '12' },
  { label: 'Basics', count: '02' },
  { label: 'Instagram', count: '03' },
  { label: 'LinkedIn', count: '01' },
  { label: 'Facebook', count: '01' },
  { label: 'X (Twitter)', count: '01' },
  { label: 'Strategy', count: '01' },
  { label: 'Guides', count: '02' },
  { label: 'Productivity', count: '01' },
];

const DEFAULT_ARTICLE_BODY = (topic: string): BlogArticleBlock[] => [
  {
    type: 'paragraph',
    text: `We get asked about ${topic} captions a lot. This post is the short, opinionated version of everything we've learned from writing thousands of captions at Captio, for every feed, in every voice, at every time of night.`,
  },
  {
    type: 'heading',
    text: 'Start where the scroll starts',
  },
  {
    type: 'paragraph',
    text: "The first line of a caption is doing ninety percent of the work. If it doesn't earn the pause, nothing the rest of the caption says matters. Every framework below assumes you've nailed that first line. If you haven't, go back and rewrite it before anything else.",
  },
  {
    type: 'heading',
    text: "Match the platform's native voice",
  },
  {
    type: 'paragraph',
    text: 'Each network has its own rhythm. Shorter than you think, more specific than you want, and always tuned to what the reader was doing five seconds before your post appeared. The examples below follow that rhythm; feel free to steal them wholesale.',
  },
  {
    type: 'tip',
    title: 'One edit that always helps',
    text: "Read your caption out loud before you post. If you stumble over a word, cut it. If it sounds like something you'd text a friend, it's ready.",
  },
  {
    type: 'heading',
    text: 'Three patterns that consistently work',
  },
  {
    type: 'steps',
    items: [
      {
        num: '01',
        lead: 'Specific detail + emotion.',
        body: 'Name the thing, then name the feeling. "Iced americano, the kind of Tuesday that should be illegal."',
      },
      {
        num: '02',
        lead: 'Tiny story + turn.',
        body: 'Set up one beat, flip it. "Said I\'d just stop by. Four hours later, here we are."',
      },
      {
        num: '03',
        lead: 'Direct address.',
        body: 'Write like you\'re talking to one person, not a feed. "You\'re allowed to take the nap."',
      },
    ],
  },
  {
    type: 'heading',
    text: 'What to avoid',
  },
  {
    type: 'list',
    items: [
      { lead: 'Brand-voice filler.', body: 'Delete any word you wouldn’t say out loud.' },
      { lead: 'Lesson endings.', body: "Captions that end on a moral are not captions, they're newsletters." },
      { lead: 'Generic emoji stacks.', body: 'Pick one that actually belongs to the photo, or none.' },
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'instagram-captions-with-ai',
    category: 'Instagram',
    categoryColor: '#C13584',
    readTime: '8 MIN',
    date: 'MAY 4, 2026',
    title: 'How to Write Instagram Captions With AI (Without Sounding Like a Robot)',
    excerpt:
      'A practical guide to writing Instagram captions using AI tools. Includes prompts, examples, and the edits that separate decent captions from scroll-stopping ones.',
    author: { name: 'Maya Iyer', initials: 'MI' },
    featured: true,
    visualType: 'robot',
    body: [
      {
        type: 'paragraph',
        text: 'AI caption generators will write you a hundred captions in a minute. Ninety-eight of them will sound like nobody you know. This guide is about the two.',
      },
      {
        type: 'paragraph',
        text: "Instagram rewards captions that sound like a person. Not a brand, not a copywriter, not a caption generator trying its best. A person with a phone, a slightly sunburned shoulder, and an opinion. That's the voice AI can get you to, but only if you drive it there.",
      },
      {
        type: 'paragraph',
        text: 'Below is the workflow we actually use at Captio, distilled into five steps. Each step takes about thirty seconds. Do all of them and your captions will feel native to your feed.',
      },
      { type: 'heading', text: 'Step 1 · Pick the photo before you pick the caption' },
      {
        type: 'paragraph',
        text: "This sounds obvious. It isn't. Most people generate ten captions first, then choose a photo to make them work, and end up with captions that are almost, but not quite, about the image.",
      },
      {
        type: 'paragraph',
        text: "Pick the photo first. Look at it. Decide what you want someone scrolling to feel when they land on it. That feeling is your caption's job. The AI's job is to phrase it.",
      },
      { type: 'heading', text: 'Step 2 · Upload to an AI caption generator' },
      {
        type: 'paragraph',
        text: "Drop the image into Captio (or whatever you use). Let the model read it. A good caption tool doesn't just see a pool, it sees the light, the composition, the mood, and the fact that your hand is holding a coconut and half your face is in the frame. That context is what keeps the output from being generic.",
      },
      { type: 'heading', text: 'Step 3 · Read every option out loud' },
      {
        type: 'paragraph',
        text: "Captions live in someone's thumb-scroll. They get half a second. Reading options aloud is the fastest way to feel which ones actually land, and which ones have the word elevate in them, which no human has said out loud since 2019.",
      },
      {
        type: 'tip',
        title: "The 'text thread' test",
        text: "If you'd send the caption to a friend in a text and they wouldn't reply 'who wrote this for you', it's a keeper.",
      },
      { type: 'heading', text: 'Step 4 · Make it yours' },
      {
        type: 'paragraph',
        text: "This is the step that most people skip, and it's the step that matters most. Take the strongest option and edit it in three ways:",
      },
      {
        type: 'steps',
        items: [
          { num: '01', body: 'Replace one word with a word you actually say.' },
          { num: '02', body: 'Cut the last line if it ends on a lesson. Lessons feel like captions.' },
          {
            num: '03',
            body: 'Add one specific detail only you would know: the smell, the name of the dog, the price of the coffee.',
          },
        ],
      },
      {
        type: 'paragraph',
        text: "After those three edits it's your caption, not AI's. Ninety-eight percent gap, closed in thirty seconds.",
      },
      { type: 'heading', text: 'Step 5 · Check your hashtags' },
      {
        type: 'paragraph',
        text: "A great caption with terrible hashtags is a room full of people you don't want at your party. A few rules:",
      },
      {
        type: 'list',
        items: [
          { body: 'Five to eight hashtags beats thirty.' },
          { body: 'One hashtag should describe the photo literally (#brunch, #goldenhour).' },
          { body: 'One should describe the vibe, not the subject (#slowmorning).' },
          { body: 'One can be funny / specific to you. Those build a following faster than the broad ones ever will.' },
        ],
      },
      { type: 'heading', text: 'What to avoid when using AI captions' },
      {
        type: 'list',
        items: [
          { lead: 'Elevate, unleash, embrace.', body: 'These are caption-generator words. Delete on sight.' },
          { lead: 'Lesson endings.', body: 'Remember: the journey matters more than the destination. No it doesn’t, you went to brunch.' },
          { lead: 'Generic emoji combos (✨ + 🙌 + 💫).', body: 'Pick one that specifically belongs to the photo.' },
          { lead: 'Hashtags in the caption.', body: 'Put them in a comment or on a new line.' },
          { lead: 'Anything that reads like a motivational speaker wrote it.', body: 'Captions are not TED talks.' },
        ],
      },
      {
        type: 'quote',
        text: 'A caption is a voice memo with more punctuation. Write it that way.',
        author: 'MAYA IYER, CAPTIO',
      },
      { type: 'heading', text: 'Using AI for captions across different photo types' },
      {
        type: 'paragraph',
        text: "One of the reasons we built Captio per-network is because the same photo needs a different caption for Instagram than for TikTok than for LinkedIn. Here's a quick translation of the same beach photo across voices, all from one upload.",
      },
      {
        type: 'samples',
        samples: [
          { network: 'Instagram', caption: 'chlorine, coconut, catch me outside ☀️🌴 #slowmorning' },
          { network: 'TikTok', caption: 'POV: the pool said rest 🌴 #summer #vibes' },
          { network: 'X', caption: 'the pool said rest. who am i to argue.' },
          { network: 'LinkedIn', caption: 'Small rituals. The compounding return of an unplugged afternoon.' },
        ],
      },
      {
        type: 'paragraph',
        text: "Same photo, four audiences, four voices. That's what AI should be doing for you, not writing one caption and calling it posted.",
      },
    ],
  },
  {
    slug: 'what-is-ai-caption-generator',
    category: 'Basics',
    categoryColor: '#c8ff4d',
    readTime: '6 MIN',
    date: 'APR 27, 2026',
    title: 'What Is an AI Caption Generator and How Does It Actually Work?',
    excerpt:
      'A plain-English walkthrough of how AI caption generators read your photos, pick their moods, and write captions that sound like a human wrote them.',
    author: { name: 'Dev Patel', initials: 'DP' },
    visualType: 'workflow',
    body: DEFAULT_ARTICLE_BODY('AI caption generator'),
  },
  {
    slug: '120-instagram-caption-ideas',
    category: 'Instagram',
    categoryColor: '#C13584',
    readTime: '9 MIN',
    date: 'MAY 11, 2026',
    title: '120 Instagram Caption Ideas for Every Type of Photo You Post',
    excerpt:
      'Caption ideas for selfies, food, travel, pets, gym, sunsets, couples, business, and every other thing else. Copy, tweak, and paste into your next post.',
    author: { name: 'Maya Iyer', initials: 'MI' },
    visualType: 'ideas',
    body: DEFAULT_ARTICLE_BODY('instagram'),
  },
  {
    slug: 'linkedin-post-captions',
    category: 'LinkedIn',
    categoryColor: '#0A66C2',
    readTime: '8 MIN',
    date: 'MAY 18, 2026',
    title: 'LinkedIn Post Captions That Actually Build Your Brand',
    excerpt:
      "Most captions on LinkedIn sound like a LinkedIn post about a LinkedIn post. Here's how to write captions that feel human, land their point, and get the right people replying.",
    author: { name: 'Theo Agapov', initials: 'TA' },
    visualType: 'linkedin',
    body: DEFAULT_ARTICLE_BODY('LinkedIn'),
  },
  {
    slug: 'facebook-caption-comments',
    category: 'Facebook',
    categoryColor: '#1877F2',
    readTime: '7 MIN',
    date: 'MAY 25, 2026',
    title: 'Facebook Caption Ideas That Spark Comments (Not Crickets)',
    excerpt:
      'Facebook rewards captions that start real conversations. These caption formats consistently get comments, and examples help you reach more people in the feed.',
    author: { name: 'Maya Iyer', initials: 'MI' },
    visualType: 'facebook',
    body: DEFAULT_ARTICLE_BODY('Facebook'),
  },
  {
    slug: 'twitter-x-caption-tips',
    category: 'X (Twitter)',
    categoryColor: '#888891',
    readTime: '5 MIN',
    date: 'JUN 1, 2026',
    title: 'Twitter (X) Caption Tips: Short, Punchy, and Actually Shareable',
    excerpt:
      'Writing a good tweet is a craft. This guide breaks down structure, hooks, and the small edits that turn one-like drafts into posts people actually retweet.',
    author: { name: 'Dev Patel', initials: 'DP' },
    visualType: 'twitter',
    body: DEFAULT_ARTICLE_BODY('Twitter (X)'),
  },
  {
    slug: 'snapchat-threads-captions',
    category: 'Strategy',
    categoryColor: '#c8ff4d',
    readTime: '6 MIN',
    date: 'JUN 8, 2026',
    title: 'Snapchat and Threads Caption Ideas Worth Actually Saving',
    excerpt:
      "Snap and Threads behave differently than you think. Here are examples and prompts for both: short, native, and tuned to each platform's weird little rhythm.",
    author: { name: 'Maya Iyer', initials: 'MI' },
    visualType: 'snap-threads',
    body: DEFAULT_ARTICLE_BODY('Snapchat and Threads'),
  },
  {
    slug: 'what-makes-good-caption',
    category: 'Guides',
    categoryColor: '#f5f3ec',
    readTime: '7 MIN',
    date: 'JUN 15, 2026',
    title: 'What Makes a Good Social Media Caption? A Clear Breakdown',
    excerpt:
      'Good captions share five things in common across every platform. This is the framework for writing captions that actually pull their weight.',
    author: { name: 'Dev Patel', initials: 'DP' },
    visualType: 'good-caption',
    body: DEFAULT_ARTICLE_BODY('social media'),
  },
  {
    slug: 'save-hours-every-week',
    category: 'Productivity',
    categoryColor: '#F58529',
    readTime: '5 MIN',
    date: 'JUN 22, 2026',
    title: 'Save Hours Every Week by Writing Captions With AI',
    excerpt:
      "If you post daily, captions eat up your whole week. Here's the workflow we use to cut caption time from hours to minutes without losing quality.",
    author: { name: 'Maya Iyer', initials: 'MI' },
    visualType: 'save-hours',
    body: DEFAULT_ARTICLE_BODY('batch captioning'),
  },
  {
    slug: 'how-ai-analyzes-photos',
    category: 'Basics',
    categoryColor: '#c8ff4d',
    readTime: '6 MIN',
    date: 'JUN 29, 2026',
    title: 'How AI Analyzes Your Photos to Generate Captions (In Plain English)',
    excerpt:
      'A friendly, low-jargon look at what actually happens when you upload a photo to a caption generator. No heavy jargon, just the full picture.',
    author: { name: 'Dev Patel', initials: 'DP' },
    visualType: 'analyze-photo',
    body: DEFAULT_ARTICLE_BODY('photo analysis'),
  },
  {
    slug: 'hashtag-strategy-instagram-2025',
    category: 'Instagram',
    categoryColor: '#C13584',
    readTime: '7 MIN',
    date: 'JUL 6, 2026',
    title: 'The Best Hashtag Strategy for Instagram in 2026',
    excerpt:
      "Hashtags still matter on Instagram, but not the way they used to. Here's a hashtag playbook that actually moves the needle right now.",
    author: { name: 'Maya Iyer', initials: 'MI' },
    visualType: 'hashtags',
    body: DEFAULT_ARTICLE_BODY('Instagram hashtag'),
  },
  {
    slug: 'captions-that-get-followers',
    category: 'Guides',
    categoryColor: '#f5f3ec',
    readTime: '7 MIN',
    date: 'JUL 13, 2026',
    title: 'How to Write Captions That Get More Followers',
    excerpt:
      'Followers follow for a reason. This post breaks down caption patterns that turn one-time viewers into long-term fans.',
    author: { name: 'Dev Patel', initials: 'DP' },
    visualType: 'followers',
    body: DEFAULT_ARTICLE_BODY('guides'),
  },
];
