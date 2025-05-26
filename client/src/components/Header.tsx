import { useState } from "react";
import { Search, Newspaper, User, ChevronDown, Bookmark, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { AuthModals } from "./AuthModals";
import { ProfileModal } from "./ProfileModal";
import { SavedArticlesModal } from "./SavedArticlesModal";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function Header({ onSearch, searchQuery }: HeaderProps) {
  const { user, isLoggedIn, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Newspaper className="text-accent text-2xl mr-3" />
              <h1 className="text-2xl font-bold text-[hsl(var(--news-primary))]">NewsHub</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search news articles..."
                  className="w-full pl-10 pr-4 py-2"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAuthModal('login')}
                    className="text-accent border-accent hover:bg-accent hover:text-white"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setShowAuthModal('signup')}
                    className="bg-accent text-white hover:bg-blue-600"
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-[hsl(var(--news-secondary))] hover:text-[hsl(var(--news-primary))]">
                      <User className="h-6 w-6" />
                      <span>{user?.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSavedModal(true)}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Saved Articles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModals
        mode={showAuthModal}
        onClose={() => setShowAuthModal(null)}
        onSwitchMode={(mode) => setShowAuthModal(mode)}
      />
      
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
      
      {showSavedModal && (
        <SavedArticlesModal onClose={() => setShowSavedModal(false)} />
      )}
    </>
  );
}
