// This file is intentionally minimal as the app uses real backend data
// The MemStorage in server/storage.ts already provides initial articles
// No mock data is needed on the frontend since we have a fully functional backend

export const categories = [
  { id: 'all', label: 'All News' },
  { id: 'trending', label: 'Trending' },
  { id: 'technology', label: 'Technology' },
  { id: 'politics', label: 'Politics' },
  { id: 'sports', label: 'Sports' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'health', label: 'Health' },
];

export const categoryColors: Record<string, string> = {
  technology: "bg-accent text-white",
  business: "bg-orange-500 text-white",
  sports: "bg-green-500 text-white",
  health: "bg-red-500 text-white",
  politics: "bg-blue-600 text-white",
  entertainment: "bg-purple-500 text-white",
  trending: "bg-yellow-500 text-white",
};
