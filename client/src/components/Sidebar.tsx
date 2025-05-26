import { Globe, TrendingUp, Cpu, Landmark, Gamepad2, TrendingDown, Film, Heart, Bookmark, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SidebarProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  onRefresh: () => void;
  onShowSaved: () => void;
}

const categories = [
  { id: 'all', label: 'All News', icon: Globe },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'politics', label: 'Politics', icon: Landmark },
  { id: 'sports', label: 'Sports', icon: Gamepad2 },
  { id: 'business', label: 'Business', icon: TrendingDown },
  { id: 'entertainment', label: 'Entertainment', icon: Film },
  { id: 'health', label: 'Health', icon: Heart },
];

export function Sidebar({ currentCategory, onCategoryChange, onRefresh, onShowSaved }: SidebarProps) {
  return (
    <aside className="lg:w-64 flex-shrink-0">
      <Card className="sticky top-24">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--news-primary))] mb-4">Categories</h2>
          
          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = currentCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`w-full justify-start px-3 py-2 ${
                    isActive 
                      ? 'bg-accent text-white hover:bg-accent hover:text-white' 
                      : 'text-[hsl(var(--news-secondary))] hover:bg-gray-100'
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-[hsl(var(--news-secondary))] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-[hsl(var(--news-secondary))] hover:bg-gray-100"
                onClick={onShowSaved}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Saved Articles
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-[hsl(var(--news-secondary))] hover:bg-gray-100"
                onClick={onRefresh}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh News
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
