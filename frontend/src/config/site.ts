export interface NavLinkItem {
  label: string;
  to: string;
}

export interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  heading: string;
  links: FooterLinkItem[];
}

export type NetworkId =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'twitter'
  | 'snapchat'
  | 'linkedin'
  | 'threads'
  | 'whatsapp';

export interface NetworkMeta {
  id: NetworkId;
  name: string;
  shortName: string;
  bg: string;
  ink: string;
  color: string;
  chip: string;
}

export const NETWORKS: NetworkMeta[] = [
  { id: 'instagram', name: 'Instagram', shortName: 'INSTAGRAM', handle: '@', color: '#C13584', bg: '#C13584', ink: '#FFFFFF', chip: 'IG' },
  { id: 'facebook', name: 'Facebook', shortName: 'FACEBOOK', handle: 'fb', color: '#1877F2', bg: '#1877F2', ink: '#FFFFFF', chip: 'FB' },
  { id: 'tiktok', name: 'TikTok', shortName: 'TIKTOK', handle: '@', color: '#FE2C55', bg: '#FE2C55', ink: '#FFFFFF', chip: 'TT' },
  { id: 'twitter', name: 'X (Twitter)', shortName: 'X', handle: '𝕏', color: '#E6E8EA', bg: '#000000', ink: '#FFFFFF', chip: '𝕏' },
  { id: 'snapchat', name: 'Snapchat', shortName: 'SNAPCHAT', handle: '👻', color: '#FFFC00', bg: '#FFFC00', ink: '#0A0A0B', chip: 'SN' },
  { id: 'linkedin', name: 'LinkedIn', shortName: 'LINKEDIN', handle: 'in', color: '#0A66C2', bg: '#0A66C2', ink: '#FFFFFF', chip: 'IN' },
  { id: 'threads', name: 'Threads', shortName: 'THREADS', handle: '@', color: '#F5F3EC', bg: '#0A0A0B', ink: '#F5F3EC', chip: 'TH' },
  { id: 'whatsapp', name: 'WhatsApp', shortName: 'WHATSAPP', handle: '✓', color: '#25D366', bg: '#25D366', ink: '#0A0A0B', chip: 'WA' },
] as (NetworkMeta & { handle: string })[];

export const DASHBOARD_NETWORK_ORDER: string[] = [
  'INSTAGRAM',
  'TIKTOK',
  'FACEBOOK',
  'X',
  'THREADS',
  'WHATSAPP',
  'SNAPCHAT',
  'LINKEDIN',
];

export const siteConfig = {
  name: 'Captio',
  logoSrc: '/capgen-icon.svg',
  tagline: 'An AI caption studio for people who post everywhere.',
  copyright: '© 2026 CAPTIO',
  navLinks: [
    { label: 'Pricing', to: '/pricing' },
    { label: 'Blog', to: '/blog' },
  ] as NavLinkItem[],
  publicActions: {
    signInLabel: 'Sign in',
    primaryCtaLabel: 'Start free',
  },
  footerColumns: [
    {
      heading: 'PRODUCT',
      links: [
        { label: 'Studio', href: '/dashboard' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      heading: 'RESOURCES',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '#contact' },
        { label: 'Terms', href: '#terms' },
        { label: 'Privacy', href: '#privacy' },
      ],
    },
    {
      heading: 'OUR SITES',
      links: [
        { label: 'Twitter Downloader', href: 'https://tweeload.com/', external: true },
        { label: 'Threads Downloader', href: 'https://threadster.app/', external: true },
        { label: 'Image Compressor', href: 'https://mb2kb.com/', external: true },
        { label: 'Image to Text', href: '#image-to-text', external: true },
        { label: 'DNS Checker', href: '#dns-checker', external: true },
      ],
    },
  ] as FooterColumn[],
};
