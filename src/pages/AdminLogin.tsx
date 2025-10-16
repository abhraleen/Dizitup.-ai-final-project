import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AnimatedWaveBackground from "@/components/AnimatedWaveBackground";
import { Lock, Mail, Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  const { signIn, user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && isAdmin && !redirecting) {
      setRedirecting(true);
      
      // Smooth animated redirect
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 800);
    }
  }, [user, isAdmin, loading, navigate, redirecting]);

  // Handle admin role check after successful login
  useEffect(() => {
    if (user && !loading && isCheckingAdmin) {
      const checkAdminAndRedirect = async () => {
        // Wait a bit for admin role to be verified
        let attempts = 0;
        const maxAttempts = 10; // 5 seconds max wait
        
        const checkAdmin = () => {
          attempts++;
          
          if (isAdmin) {
            setIsCheckingAdmin(false);
            setRedirecting(true);
            
            toast({
              title: "Welcome Admin!",
              description: "Redirecting to dashboard...",
            });
            
            // Smooth animated redirect
            setTimeout(() => {
              navigate("/admin/dashboard");
            }, 800);
          } else if (attempts < maxAttempts) {
            setTimeout(checkAdmin, 500);
          } else {
            // Admin check failed
            setIsCheckingAdmin(false);
            toast({
              title: "Access Denied",
              description: "You don't have admin privileges.",
              variant: "destructive",
            });
          }
        };
        
        checkAdmin();
      };
      
      checkAdminAndRedirect();
    }
  }, [user, isAdmin, loading, isCheckingAdmin, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
      } else {
        // Login successful, start admin check process
        setIsCheckingAdmin(true);
        toast({
          title: "Login Successful",
          description: "Verifying admin privileges...",
        });
        
        // Keep loading state during admin verification
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground flex items-center justify-center px-4 relative overflow-hidden">
      <AnimatedWaveBackground />
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-2 h-32 bg-primary/20 blur-sm animate-pulse neon-flicker"></div>
        <div className="absolute bottom-1/4 right-10 w-2 h-24 bg-primary/20 blur-sm animate-pulse delay-300"></div>
        
        {/* Digital rain effect */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-px bg-primary/20 matrix-rain"
            style={{
              left: `${10 + Math.random() * 80}%`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className={`w-full max-w-md transition-all duration-700 ${redirecting ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
        <Card className="bg-card/90 backdrop-blur-sm border-primary/20 shadow-card hover-glow relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
          
          <CardHeader className="text-center space-y-4 relative z-10">
            <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit neon-flicker">
              {isCheckingAdmin ? (
                <Shield className="h-8 w-8 text-primary animate-pulse" />
              ) : (
                <Lock className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="font-display text-2xl text-card-foreground glitch-text">
              Admin Login
            </CardTitle>
            <p className="text-muted-foreground">
              {isCheckingAdmin 
                ? "Verifying admin access..." 
                : "Enter your credentials to access the admin panel"
              }
            </p>
          </CardHeader>
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading || isCheckingAdmin || redirecting}
                    className="pl-10 bg-input/80 backdrop-blur-sm border-primary/20 focus:border-primary focus:ring-primary"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading || isCheckingAdmin || redirecting}
                    className="pl-10 bg-input/80 backdrop-blur-sm border-primary/20 focus:border-primary focus:ring-primary"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full pulse-red hover-glow neon-flicker relative"
                disabled={isLoading || isCheckingAdmin || redirecting}
              >
                <span className="relative z-10">
                  {redirecting ? "Redirecting..." : 
                   isCheckingAdmin ? "Verifying Access..." : 
                   isLoading ? "Signing In..." : "Sign In"}
                </span>
                {(isLoading || isCheckingAdmin || redirecting) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-md animate-pulse"></div>
                )}
              </Button>
            </form>
          </CardContent>
          
          {/* Corner accent lines */}
          <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-primary/50 opacity-60"></div>
          <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-primary/50 opacity-60"></div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;