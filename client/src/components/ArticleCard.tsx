import { useState } from "react";
import { Bookmark, ExternalLink, Eye, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Article } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useSavedArticles } from "@/hooks/use-articles";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const categoryColors: Record<string, string> = {
  technology: "bg-accent text-white",
  business: "bg-orange-500 text-white",
  sports: "bg-green-500 text-white",
  health: "bg-red-500 text-white",
  politics: "bg-blue-600 text-white",
  entertainment: "bg-purple-500 text-white",
  trending: "bg-yellow-500 text-white",
};

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { user, isLoggedIn } = useAuth();
  const { saveArticle, unsaveArticle, isArticleSaved } = useSavedArticles(user?.id || null);
  const [isToggling, setIsToggling] = useState(false);

  const isSaved = isArticleSaved(article.id);

  const handleSaveToggle = async () => {
    if (!isLoggedIn || isToggling) return;
    
    setIsToggling(true);
    try {
      if (isSaved) {
        await unsaveArticle(article.id);
      } else {
        await saveArticle(article.id);
      }
    } finally {
      setIsToggling(false);
    }
  };

  const handleReadMore = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  if (featured) {
    return (
      <Card className={`article-card ${featured ? 'md:col-span-2 xl:col-span-3' : ''}`}>
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
        )}
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Badge className={categoryColors[article.category] || "bg-gray-500 text-white"}>
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </Badge>
              <span className="text-sm text-gray-500">{article.source}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{article.publishedAt}</span>
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`save-btn ${isSaved ? 'save-btn-saved' : ''}`}
                  onClick={handleSaveToggle}
                  disabled={isToggling}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-[hsl(var(--news-primary))] mb-3 leading-tight">
            {article.title}
          </h3>
          
          <p className="text-[hsl(var(--news-secondary))] mb-4 leading-relaxed">
            {article.description}
          </p>
          
          <div className="flex items-center justify-between">
            <Button
              variant="link"
              className="p-0 h-auto text-accent hover:text-blue-600 font-medium"
              onClick={handleReadMore}
            >
              Read Full Article
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span><Eye className="inline mr-1 h-3 w-3" /> 2.4k views</span>
              <span><MessageSquare className="inline mr-1 h-3 w-3" /> 156 comments</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="article-card">
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge className={categoryColors[article.category] || "bg-gray-500 text-white"}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Badge>
          {isLoggedIn && (
            <Button
              variant="ghost"
              size="sm"
              className={`save-btn ${isSaved ? 'save-btn-saved' : ''}`}
              onClick={handleSaveToggle}
              disabled={isToggling}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-[hsl(var(--news-primary))] mb-2 leading-tight">
          {article.title}
        </h3>
        
        <p className="text-[hsl(var(--news-secondary))] text-sm mb-3 line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{article.source} • {article.publishedAt}</span>
          <Button
            variant="link"
            className="p-0 h-auto text-accent hover:text-blue-600"
            onClick={handleReadMore}
          >
            Read more
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
