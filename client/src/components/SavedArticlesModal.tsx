import { Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useSavedArticles } from "@/hooks/use-articles";

interface SavedArticlesModalProps {
  onClose: () => void;
}

export function SavedArticlesModal({ onClose }: SavedArticlesModalProps) {
  const { user } = useAuth();
  const { savedArticles, loading, unsaveArticle } = useSavedArticles(user?.id || null);

  const handleUnsave = async (articleId: number) => {
    await unsaveArticle(articleId);
  };

  const handleReadArticle = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[hsl(var(--news-primary))]">
            Saved Articles
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            <div className="md:col-span-2 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-[hsl(var(--news-secondary))]">Loading saved articles...</p>
            </div>
          ) : savedArticles.length === 0 ? (
            <div className="text-center py-12 md:col-span-2">
              <div className="text-4xl text-gray-300 mb-4">📚</div>
              <p className="text-[hsl(var(--news-secondary))]">
                No saved articles yet. Start saving articles you want to read later!
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <Card key={article.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-[hsl(var(--news-primary))] mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--news-secondary))] mb-3 line-clamp-3">
                    {article.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {article.source} • {article.publishedAt}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReadArticle(article.url)}
                        className="text-accent hover:text-blue-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnsave(article.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
