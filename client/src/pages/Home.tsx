import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ArticleCard } from "@/components/ArticleCard";
import { SavedArticlesModal } from "@/components/SavedArticlesModal";
import { useArticles } from "@/hooks/use-articles";
import { useAuth } from "@/hooks/use-auth";

const categoryTitles: Record<string, string> = {
  all: 'All News',
  trending: 'Trending',
  technology: 'Technology',
  politics: 'Politics',
  sports: 'Sports',
  business: 'Business',
  entertainment: 'Entertainment',
  health: 'Health',
};

export default function Home() {
  const { initialize } = useAuth();
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedModal, setShowSavedModal] = useState(false);

  const { articles, loading, error, refetch } = useArticles({
    category: currentCategory,
    search: searchQuery,
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    refetch();
  };

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar
            currentCategory={currentCategory}
            onCategoryChange={handleCategoryChange}
            onRefresh={handleRefresh}
            onShowSaved={() => setShowSavedModal(true)}
          />
          
          <div className="flex-1">
            {/* Current Category Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[hsl(var(--news-primary))] mb-2">
                {categoryTitles[currentCategory]}
              </h2>
              <p className="text-[hsl(var(--news-secondary))]">
                Stay updated with the latest news from around the world
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mr-3"></div>
                <span className="text-[hsl(var(--news-secondary))]">Loading articles...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-[hsl(var(--news-secondary))]">{error}</p>
              </div>
            )}

            {/* Articles Grid */}
            {!loading && !error && articles.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {featuredArticle && (
                  <ArticleCard article={featuredArticle} featured />
                )}
                {regularArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* No Articles State */}
            {!loading && !error && articles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📰</div>
                <p className="text-[hsl(var(--news-secondary))]">
                  No articles found for the current filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showSavedModal && (
        <SavedArticlesModal onClose={() => setShowSavedModal(false)} />
      )}
    </div>
  );
}
