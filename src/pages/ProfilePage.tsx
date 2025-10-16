import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, UserCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // First, try to get existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || ""
        });
      } else {
        // Create new profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || ""
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        setProfile(newProfile);
        setFormData({
          full_name: newProfile.full_name || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      setUpdating(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/20 to-black"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Your Profile</h1>
              <p className="text-gray-400">Manage your account and subscription settings</p>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="mt-4 sm:mt-0 border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Card */}
              <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCircle className="h-5 w-5 text-red-500 mr-2" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email || ""}
                        disabled
                        className="bg-black/30 border-red-500/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="bg-black/30 border-red-500/30"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      disabled={updating}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                    >
                      {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Profile
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Subscription Card */}
              <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 text-red-500 mr-2" />
                    Subscription & Credits
                  </CardTitle>
                  <CardDescription>Manage your plan and credits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-red-900/20 rounded-lg">
                      <div>
                        <h3 className="font-bold text-lg">Free Trial Plan</h3>
                        <p className="text-gray-400 text-sm">Current subscription</p>
                      </div>
                      <Button 
                        onClick={() => navigate("/pricing")}
                        variant="outline" 
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Upgrade Plan
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-red-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Available Credits</span>
                        <span className="text-2xl font-bold text-red-500">100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full" 
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        Free trial credits expire in 3 days
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <Button 
                        onClick={() => navigate("/pricing")}
                        className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                      >
                        Buy More Credits
                      </Button>
                      <Button 
                        onClick={() => navigate("/pricing")}
                        variant="outline" 
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        View Pricing Plans
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 text-red-500 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => navigate("/ai")}
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                  >
                    Chat with Dizi
                  </Button>
                  <Button 
                    onClick={() => navigate("/services")}
                    variant="outline" 
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Request Services
                  </Button>
                  <Button 
                    onClick={() => navigate("/portfolio")}
                    variant="outline" 
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    View Portfolio
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Benefits */}
              <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Plan Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <span>AI-powered digital solutions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <span>Workflow automation tools</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <span>Priority AI support</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <span>Advanced analytics</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;