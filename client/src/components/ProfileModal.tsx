import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface ProfileModalProps {
  onClose: () => void;
}

const availablePreferences = [
  { id: 'technology', label: 'Technology' },
  { id: 'politics', label: 'Politics' },
  { id: 'sports', label: 'Sports' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'health', label: 'Health' },
];

export function ProfileModal({ onClose }: ProfileModalProps) {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const [preferences, setPreferences] = useState<string[]>(user?.preferences || []);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      });
      setPreferences(user.preferences || []);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          preferences,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        updateUser(data.user);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Update failed",
          description: data.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    setPreferences(prev => 
      checked 
        ? [...prev, preferenceId]
        : prev.filter(p => p !== preferenceId)
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[hsl(var(--news-primary))]">
            Profile & Preferences
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div>
            <h3 className="text-lg font-semibold text-[hsl(var(--news-primary))] mb-4">
              Profile Information
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label htmlFor="profileName">Full Name</Label>
                <Input
                  id="profileName"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="profileEmail">Email</Label>
                <Input
                  id="profileEmail"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </div>
          
          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-[hsl(var(--news-primary))] mb-4">
              News Preferences
            </h3>
            <div className="space-y-3">
              {availablePreferences.map((preference) => (
                <div key={preference.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={preference.id}
                    checked={preferences.includes(preference.id)}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange(preference.id, !!checked)
                    }
                  />
                  <Label htmlFor={preference.id} className="text-sm">
                    {preference.label}
                  </Label>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
              onClick={handleProfileUpdate}
              disabled={loading}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
