import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface AuthModalsProps {
  mode: 'login' | 'signup' | null;
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export function AuthModals({ mode, onClose, onSwitchMode }: AuthModalsProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data.user);
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        onClose();
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both password fields are identical.",
        variant: "destructive",
      });
      return;
    }
    
    if (!signupData.agreedToTerms) {
      toast({
        title: "Terms required",
        description: "You must agree to the terms of service.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          preferences: ['technology', 'sports', 'health'],
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data.user);
        toast({
          title: "Account created!",
          description: "Welcome to NewsHub. Your account has been created successfully.",
        });
        onClose();
      } else {
        toast({
          title: "Signup failed",
          description: data.message || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={mode === 'login'} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[hsl(var(--news-primary))]">Welcome Back</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="loginEmail">Email</Label>
              <Input
                id="loginEmail"
                type="email"
                required
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="loginPassword">Password</Label>
              <Input
                id="loginPassword"
                type="password"
                required
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={loginData.remember}
                  onCheckedChange={(checked) => setLoginData(prev => ({ ...prev, remember: !!checked }))}
                />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              <Button variant="link" className="text-sm p-0 h-auto">Forgot password?</Button>
            </div>
            
            <Button type="submit" className="w-full bg-accent hover:bg-blue-600" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <p className="text-center text-sm text-[hsl(var(--news-secondary))]">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-accent hover:text-blue-600 font-medium"
              onClick={() => onSwitchMode('signup')}
            >
              Sign up
            </Button>
          </p>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={mode === 'signup'} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[hsl(var(--news-primary))]">Create Account</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="signupName">Full Name</Label>
              <Input
                id="signupName"
                type="text"
                required
                placeholder="Enter your full name"
                value={signupData.name}
                onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="signupEmail">Email</Label>
              <Input
                id="signupEmail"
                type="email"
                required
                placeholder="Enter your email"
                value={signupData.email}
                onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="signupPassword">Password</Label>
              <Input
                id="signupPassword"
                type="password"
                required
                placeholder="Create a password"
                value={signupData.password}
                onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                placeholder="Confirm your password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                required
                checked={signupData.agreedToTerms}
                onCheckedChange={(checked) => setSignupData(prev => ({ ...prev, agreedToTerms: !!checked }))}
              />
              <Label htmlFor="terms" className="text-sm leading-5">
                I agree to the{' '}
                <Button variant="link" className="p-0 h-auto text-accent hover:text-blue-600">Terms of Service</Button>
                {' '}and{' '}
                <Button variant="link" className="p-0 h-auto text-accent hover:text-blue-600">Privacy Policy</Button>
              </Label>
            </div>
            
            <Button type="submit" className="w-full bg-accent hover:bg-blue-600" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <p className="text-center text-sm text-[hsl(var(--news-secondary))]">
            Already have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-accent hover:text-blue-600 font-medium"
              onClick={() => onSwitchMode('login')}
            >
              Sign in
            </Button>
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
