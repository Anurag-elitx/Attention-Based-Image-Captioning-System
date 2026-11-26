import type { NetworkId } from '../config/site';

export interface HeroSlide {
  id: string;
  src: string;
  title: string;
  captions: Record<NetworkId, string>;
}

export interface ShowcaseItem {
  src: string;
  title: string;
  net: NetworkId;
  caption: string;
  colSpan: string;
  rowSpan: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  color: string;
  avatar: string;
}

export interface LanguageChip {
  code: string;
  name: string;
  native: string;
  dir: 'ltr' | 'rtl';
  text: string;
}

export interface FaqItem {
  num?: string;
  question: string;
  answer: string;
}

export const HERO_CREATOR_AVATARS = [
  '/images/avatars/freckles.webp',
  '/images/avatars/beanie.webp',
  '/images/avatars/longhair.webp',
  '/images/avatars/sage.webp',
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'd1',
    src: '/images/dog-beach.webp',
    title: 'Beach zoomies',
    captions: {
      instagram:
        'Endless summer vibes with this happy pup! Nothing beats a beach run and feeling the waves. ☀️🌊🐾 #beachdog #doglife #goldenhour #happydog #zoomies',
      tiktok:
        'POV: You’re this dog at the beach! Drop a 😍 for peak happiness and tag someone who needs a beach day! #dogtok #beachvibes',
      facebook:
        'Look at this absolute unit of joy! 😍 Does anyone else’s pup get this excited at the beach? Share your beachy pics in the comments! 🏖️',
      twitter:
        'This dog is living its BEST life. ✨ Who else needs a beach day ASAP? 🐶🌊 #beachlife #dogsoftwitter',
      threads: 'That feeling when the ocean breeze hits just right. 🤩 #dogbeach',
      whatsapp: 'Look at this happy face! 🐶☀️',
      snapchat: 'Beach zoomies are the BEST zoomies! 🤩🌊',
      linkedin:
        'Embrace moments of pure joy and recharge your spirit. A little fun can spark creativity and productivity. #worklifebalance #inspiration #dogsofinstagram',
    },
  },
  {
    id: 'd2',
    src: '/images/sunset-surf.webp',
    title: 'Golden hour ride',
    captions: {
      instagram:
        "Chasing the last light! Nothing beats a sunset surf session. 🏄‍♂️🌊🌅 What's your favorite way to unwind? #sunsetsurf #surfinglife #goldenhour #oceanvibes #beachlife",
      tiktok: "Vibing with the sunset waves! 🌊 Drop a 😍 if you'd be here! #sunsetsurf #oceanlife",
      facebook:
        'Is there anything more magical than a sunset over the ocean? ✨ Share your favorite beach memory with us in the comments! ⬇️',
      twitter: 'Riding into the weekend like… ✨🌊 Golden hour hits different. #sunset #surfing',
      threads: 'Just a surfer and a sunset. Pure bliss. ✨ #sunsetvibes',
      whatsapp: 'Epic sunset surf today! 🤙',
      snapchat: 'Sunsets & surf? YES PLEASE! 🤩',
      linkedin:
        'Finding focus and inspiration in the rhythm of the waves. Pursuing passions outside of work fuels creativity and drive. #worklifebalance #inspiration #passion',
    },
  },
  {
    id: 'd3',
    src: '/images/ramen-night.webp',
    title: 'Ramen night',
    captions: {
      instagram:
        'Diving into a bowl of creamy goodness with perfect eggs and savory pork. Who else is craving this right now? #ramenlover #foodstagram #slurp #comfortfood',
      tiktok: 'POV: You found the perfect bowl of ramen. Tag someone who owes you a dinner date! #ramen #foodtok',
      facebook:
        'Nothing beats a cozy ramen night to end the day! Do you prefer your broth spicy or creamy? Let us know below!',
      twitter:
        'Current status: In a committed relationship with this bowl of ramen. Send help (and more chopsticks). #ramennight #foodie',
      threads: 'Is there anything more comforting than a steaming bowl of ramen on a chilly evening? #foodies',
      whatsapp: 'Look at this ramen! We need to go here next time we hang out.',
      snapchat: 'Ramen goals 🍜🤤',
      linkedin:
        'Finding balance through great food and focused relaxation. Quality nourishment fuels professional productivity and creativity. #worklifebalance #wellness #culinaryexperience',
    },
  },
  {
    id: 'd4',
    src: '/images/cappadocia.webp',
    title: 'Cappadocia sunrise',
    captions: {
      instagram:
        'Waking up with this view in Cappadocia is a dream! Soaking up the golden hour amidst the fairy chimneys. 🎈✨ #cappadocia #hotairballoon #turkeytravel #sunrise #travelphotography',
      tiktok:
        "Cappadocia giving main character energy! ✨ Drop a 😍 if you'd take a ride! Tag someone who needs to see this! #cappadocia #traveltok",
      facebook:
        "Good morning from Cappadocia! 😍 What's on *your* bucket list? Share your dream travel destination in the comments! Let's inspire each other.✈️",
      twitter:
        'Cappadocia is seriously unreal. Hot air balloons + fairy chimneys = absolute magic! ✨ Who needs a vacation?! #cappadocia #travel',
      threads: 'Cappadocia sunrise hits different. 🧡 Anyone else explored Turkey? #cappadocia',
      whatsapp: 'Look at this incredible sunrise from Cappadocia! 🤩',
      snapchat: 'Cappadocia views are EVERYTHING! 🎈😎',
      linkedin:
        'Witnessing the breathtaking views of Cappadocia reminds us to always reach for new heights, both personally and professionally. #travel #inspiration #cappadocia',
    },
  },
];

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    src: '/images/dinner-spread.webp',
    title: 'Friends, food, fluorescent light',
    net: 'instagram',
    caption:
      "So many choices, so little time! 🍔🥗🌶️ From juicy burgers to fresh salads and spicy wings, we've got something for everyone. #foodphotography #eatlocal #foodlover #happyhour #delicious",
    colSpan: 'span 2',
    rowSpan: 'span 2',
  },
  {
    src: '/images/pizza.webp',
    title: 'Pepperoni, wood-fired',
    net: 'instagram',
    caption:
      "Fresh ingredients, a golden crust, and bubbly cheese – this pizza is calling your name! 🍕 What's your favorite topping? #pizza #pizzalover #foodphotography #comfortfood #eeeeeats",
    colSpan: 'span 2',
    rowSpan: 'span 1',
  },
  {
    src: '/images/desk-setup.webp',
    title: 'Desk, finally dialed in',
    net: 'linkedin',
    caption:
      'A well-designed workspace can significantly boost productivity and creativity. Investing in your environment is investing in your success. #workspace #productivity #innovation',
    colSpan: 'span 1',
    rowSpan: 'span 1',
  },
  {
    src: '/images/cat-blep.webp',
    title: 'Caught mid-blep',
    net: 'facebook',
    caption:
      "Is anyone else's cat this judgmental? 😂 This little one is giving us serious side-eye and we can't help but laugh! Share a pic of your sassy feline friend below! 👇",
    colSpan: 'span 1',
    rowSpan: 'span 2',
  },
  {
    src: '/images/skater.webp',
    title: 'Mid-kickflip',
    net: 'twitter',
    caption: "Level up your day with a bit of aerial artistry! 🛹 Life's about finding your flow. #skateboarding #streetlife",
    colSpan: 'span 1',
    rowSpan: 'span 1',
  },
  {
    src: '/images/tent.webp',
    title: 'View from the tent',
    net: 'threads',
    caption: 'That feeling when you find your perfect escape…😌 #wanderlust',
    colSpan: 'span 1',
    rowSpan: 'span 1',
  },
  {
    src: '/images/concert.webp',
    title: 'Phones up, front row',
    net: 'snapchat',
    caption: 'Vibes are HIGH at the concert tonight! 🎶🤩',
    colSpan: 'span 1',
    rowSpan: 'span 1',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      'I used to spend 20 minutes staring at a blank caption box. Now I pick one, tweak a word, post. My Sunday mornings are mine again.',
    name: 'Maren Ebert',
    role: 'FOOD CREATOR · @MARENEATS',
    color: 'linear-gradient(135deg,#E1306C 0%,#F58529 100%)',
    avatar: '/images/avatars/maren.webp',
  },
  {
    quote:
      "The LinkedIn caption Captio writes is almost always better than mine. I've quietly stopped arguing with it.",
    name: 'Theo Agapov',
    role: 'GROWTH LEAD · KLIMT STUDIO',
    color: 'linear-gradient(135deg,#0A66C2 0%,#4A7CFF 100%)',
    avatar: '/images/avatars/theo.webp',
  },
  {
    quote:
      'The tonal range is honestly uncanny. The X caption sounds like me at midnight, the LinkedIn one like me at 9am.',
    name: 'Priya Sood',
    role: 'BRAND DESIGNER',
    color: 'linear-gradient(135deg,#C8FF4D 0%,#8CE000 100%)',
    avatar: '/images/avatars/priya.webp',
  },
  {
    quote: 'I run six client accounts. This tool turned a two-hour job into a twenty-minute one.',
    name: 'Dominic Ramírez',
    role: 'SOCIAL AGENCY FOUNDER',
    color: 'linear-gradient(135deg,#FFFC00 0%,#FFE600 100%)',
    avatar: '/images/avatars/dominic.webp',
  },
];

export const FEATURE_NETWORK_CARDS: {
  id: NetworkId;
  name: string;
  count: number;
  caption: string;
  metric: string;
  bg: string;
  ink: string;
  rot: string;
}[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    count: 58,
    caption: 'Endless summer vibes with this happy pup! ☀️🌊🐾 #beachdog',
    metric: '♡ 2.4k',
    bg: '#C13584',
    ink: '#FFFFFF',
    rot: '-1.5deg',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    count: 37,
    caption: 'Look at this absolute unit of joy! 😍',
    metric: '👍 842',
    bg: '#1877F2',
    ink: '#FFFFFF',
    rot: '1.2deg',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    count: 54,
    caption: 'POV: You’re this dog at the beach! #dogtok #beachvibes',
    metric: '▶ 128k',
    bg: '#FE2C55',
    ink: '#FFFFFF',
    rot: '1deg',
  },
  {
    id: 'twitter',
    name: 'X',
    count: 46,
    caption: 'This dog is living its BEST life. ✨ #beachlife',
    metric: '↻ 340',
    bg: '#000000',
    ink: '#FFFFFF',
    rot: '-1deg',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    count: 40,
    caption: 'Beach zoomies are the BEST zoomies! 🤩🌊',
    metric: '👻 24',
    bg: '#FFFC00',
    ink: '#0A0A0B',
    rot: '-1.2deg',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    count: 70,
    caption: 'Embrace moments of pure joy and recharge your spirit. #worklifebalance',
    metric: 'in 128',
    bg: '#0A66C2',
    ink: '#FFFFFF',
    rot: '1.5deg',
  },
  {
    id: 'threads',
    name: 'Threads',
    count: 64,
    caption: 'That feeling when the ocean breeze hits just right. 🤩 #dogbeach',
    metric: '◉ 512',
    bg: '#0A0A0B',
    ink: '#F5F3EC',
    rot: '0.8deg',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    count: 29,
    caption: 'Look at this happy face! 🐶☀️',
    metric: '✓✓',
    bg: '#25D366',
    ink: '#0A0A0B',
    rot: '-0.8deg',
  },
];

export const FEATURE_LANGUAGES: LanguageChip[] = [
  { code: 'EN', name: 'English', native: 'English', dir: 'ltr', text: 'Look at this happy guy! 😄' },
  { code: 'ES', name: 'Spanish', native: 'Español', dir: 'ltr', text: '¡Mira esta carita! 😍 ¡Qué feliz se ve!' },
  { code: 'FR', name: 'French', native: 'Français', dir: 'ltr', text: 'Trop mignon, non ? 🥰' },
  { code: 'JA', name: 'Japanese', native: '日本語', dir: 'ltr', text: 'わんこかわいすぎ注意報🚨🐶' },
  { code: 'AR', name: 'Arabic', native: 'العربية', dir: 'rtl', text: 'شوفوا هالجمال! 😍 يجنن' },
  { code: 'HI', name: 'Hindi', native: 'हिन्दी', dir: 'ltr', text: 'वाह! ये कितना खुश लग रहा है! 🐶' },
  { code: 'KO', name: 'Korean', native: '한국어', dir: 'ltr', text: '이 강아지 진짜 귀엽다 ㅋㅋㅋ' },
  { code: 'PT', name: 'Portuguese', native: 'Português', dir: 'ltr', text: 'Olha essa lindeza correndo na praia! 🥰' },
  { code: 'DE', name: 'German', native: 'Deutsch', dir: 'ltr', text: 'Schau mal, wie süß! 😍' },
  { code: 'ZH', name: 'Chinese', native: '中文', dir: 'ltr', text: '看到这只狗狗，心情都变好了！🐶🌊' },
];

export const FEATURE_TONES = ['Playful', 'Professional', 'Witty', 'Poetic', 'Hype', 'Minimal'];

export const FEATURE_ARCHIVE_THUMBS = [
  '/images/sq/dog-beach-sq.webp',
  '/images/sq/ramen-sq.webp',
  '/images/sq/cappadocia-sq.webp',
  '/images/sq/cat-sq.webp',
  '/images/sq/surf-sq.webp',
  '/images/sq/concert-sq.webp',
];

export const LANDING_FAQS: FaqItem[] = [
  {
    num: '01',
    question: 'How does Captio generate captions from my image?',
    answer:
      'Captio uses a vision-language model to read your photo (subject, mood, composition, lighting) and then writes a caption for each network that matches its voice, length and hashtag conventions.',
  },
  {
    num: '02',
    question: 'Which social networks are supported?',
    answer:
      "Instagram, TikTok, Facebook, X (Twitter), Threads, WhatsApp, Snapchat, and LinkedIn. Each caption is tuned to the platform's native tone and character limits.",
  },
  {
    num: '03',
    question: 'Does it work for any kind of photo?',
    answer:
      'Yes. Portraits, food, landscapes, products, events, pets. Captio handles them all, and the tone and hashtag strategy adapts to the subject.',
  },
  {
    num: '04',
    question: 'Is my data safe when I upload a photo?',
    answer:
      'Your photo is processed only to generate your captions, then stored in your account so it appears in your collections. Delete a generation and its image is removed; delete your account and everything goes. Nothing you upload is used to train AI models.',
  },
  {
    num: '05',
    question: 'How good are the captions?',
    answer:
      'For most everyday photos, they land on the first try. You can regenerate any network’s caption in one click, or set the tone and length before generating.',
  },
  {
    num: '06',
    question: 'Can I steer the captions toward a tone or theme?',
    answer:
      'Yes. Set a tone, theme, or the tags you want in the controls, and Captio leans into those cues while staying true to what is in the photo.',
  },
  {
    num: '07',
    question: 'Can I add a personal signature or brand voice?',
    answer:
      'On any paid plan, yes. Save a signature or brand-voice note and Captio applies it to every caption on your account.',
  },
];
