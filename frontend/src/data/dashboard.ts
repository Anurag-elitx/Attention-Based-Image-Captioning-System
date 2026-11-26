export interface SelectOption {
  value: string;
  label: string;
}

export interface DashboardUser {
  name: string;
  email: string;
  initials: string;
  avatarUrl: string;
  credits: number;
  plan: string;
}

export interface DashboardCollectionItem {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
  captionsCount: number;
}

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: 'English (US)', label: 'English (US)' },
  { value: 'English (UK)', label: 'English (UK)' },
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Español' },
  { value: 'French', label: 'Français' },
  { value: 'German', label: 'Deutsch' },
  { value: 'Italian', label: 'Italiano' },
  { value: 'Portuguese', label: 'Português' },
  { value: 'Dutch', label: 'Nederlands' },
  { value: 'Polish', label: 'Polski' },
  { value: 'Turkish', label: 'Türkçe' },
  { value: 'Arabic', label: 'العربية' },
  { value: 'Hindi', label: 'हिन्दी' },
  { value: 'Japanese', label: '日本語' },
  { value: 'Korean', label: '한국어' },
  { value: 'Chinese', label: '中文' },
  { value: 'Vietnamese', label: 'Tiếng Việt' },
  { value: 'Indonesian', label: 'Bahasa Indonesia' },
];

export const TONE_OPTIONS: SelectOption[] = [
  'Default',
  'Authoritative',
  'Clinical',
  'Cold',
  'Confident',
  'Cynical',
  'Emotional',
  'Empathetic',
  'Formal',
  'Friendly',
  'Humorous',
  'Informal',
  'Ironic',
  'Optimistic',
  'Pessimistic',
  'Playful',
  'Sarcastic',
  'Serious',
  'Sympathetic',
  'Tentative',
  'Warm',
].map((t) => ({ value: t, label: t }));

export const LENGTH_OPTIONS: SelectOption[] = ['Default', 'Short', 'Medium', 'Long'].map((l) => ({
  value: l,
  label: l,
}));

export const MOCK_DASHBOARD_USER: DashboardUser = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  initials: 'AR',
  avatarUrl: '/images/avatars/beanie.webp',
  credits: 10,
  plan: 'Free',
};

export const MOCK_DASHBOARD_STATS = {
  creditsLeft: 10,
  creditsMax: 10,
  creditsNote: 'Free trial credits',
  generationsThisMonth: 0,
  generationsNote: 'None yet, try one',
  favoriteNetwork: '—',
  favoriteNetworkNote: 'Copy a caption to discover',
  plan: 'Free',
  planNote: 'Upgrade anytime',
};

// Empty by default to match dashboard-bottom.png empty state
export const MOCK_COLLECTIONS: DashboardCollectionItem[] = [];
