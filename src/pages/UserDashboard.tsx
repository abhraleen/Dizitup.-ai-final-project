import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Zap, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Activity,
  Rocket,
  Crown,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackUserAction } from "@/utils/analytics";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "earned" | "used" | "purchased";
  description: string;
  created_at: string;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCredits: 100,
    usedCredits: 25,
    remainingCredits: 75,
    plan: "free"
  });

  // Track page view
  useEffect(() => {
    trackUserAction("view_user_dashboard");
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch recent transactions (in a real app, you would have a transactions table)
      // For now, we'll simulate some transactions
      const simulatedTransactions: CreditTransaction[] = [
        {
          id: "1",
          user_id: user.id,
          amount: 100,
          type: "earned",
          description: "Free trial credits",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2",
          user_id: user.id,
          amount: -15,
          type: "used",
          description: "AI video editing service",
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          user_id: user.id,
          amount: -10,
          type: "used",
          description: "Website optimization",
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setTransactions(simulatedTransactions);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      trackUserAction("dashboard_data_error", { error: (error as Error).message });
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const planDetails = {
    free: {
      name: "Free Trial",
      credits: 100,
      icon: <Zap className="h-5 w-5" />,
      color: "text-gray-400",
      features: ["Basic AI tools", "Limited support", "3-day trial"]
    },
    starter: {
      name: "Starter Plan",
      credits: 1000,
      icon: <Star className="h-5 w-5" />,
      color: "text-blue-400",
      features: ["Priority AI support", "Standard turnaround", "Monthly credits"]
    },
    enterprise: {
      name: "Enterprise Plan",
      credits: 5000,
      icon: <Crown className="h-5 w-5" />,
      color: "text-purple-400",
      features: ["Dedicated manager", "Premium speed", "API access"]
    }
  };

  const currentPlan = planDetails[stats.plan as keyof typeof planDetails] || planDetails.free;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome back, {profile?.full_name || "User"}!</h1>
            <p className="text-gray-400">Here's what's happening with your AI services today.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
                <CreditCard className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCredits.toLocaleString()}</div>
                <p className="text-xs text-gray-400">All-time credits</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Used Credits</CardTitle>
                <Activity className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.usedCredits.toLocaleString()}</div>
                <p className="text-xs text-gray-400">This billing cycle</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <TrendingUp className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.remainingCredits.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Available to use</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
                <Calendar className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{stats.plan}</div>
                <p className="text-xs text-gray-400">Current subscription</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Plan Overview */}
              <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      {currentPlan.icon}
                      <span className="ml-2">{currentPlan.name} Overview</span>
                    </span>
                    <Button 
                      onClick={() => {
                        navigate("/pricing");
                        trackUserAction("click_upgrade_plan");
                      }}
                      variant="outline" 
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      Upgrade Plan
                    </Button>
                  </CardTitle>
                  <CardDescription>Manage your subscription and credits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Credit Usage Bar */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Credit Usage</span>
                        <span className="text-sm text-gray-400">
                          {stats.usedCredits} of {currentPlan.credits} used
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-red-600 to-red-800 h-3 rounded-full" 
                          style={{ width: `${(stats.usedCredits / currentPlan.credits) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Plan Features */}
                    <div>
                      <h3 className="font-medium mb-3">Plan Features</h3>
                      <ul className="space-y-2">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Plan Actions */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button 
                        onClick={() => {
                          navigate("/pricing");
                          trackUserAction("click_buy_credits");
                        }}
                        className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                      >
                        <Rocket className="h-4 w-4 mr-2" />
                        Buy More Credits
                      </Button>
                      <Button 
                        onClick={() => {
                          const event = new CustomEvent('openChatbot');
                          window.dispatchEvent(event);
                          trackUserAction("click_chat_with_dizi");
                        }}
                        variant="outline" 
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Chat with Dizi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 text-red-500 mr-2" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest credit transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-red-900/10 rounded-lg">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`font-medium ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-red-500 mr-2" />
                    Usage Analytics
                  </CardTitle>
                  <CardDescription>How you're using your AI services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Video Editing</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Website Tools</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Design Services</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Automation</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Services */}
              <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 text-red-500 mr-2" />
                    AI Services
                  </CardTitle>
                  <CardDescription>Available tools in your plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "AI Video Editing", credits: 15, available: true },
                      { name: "Website Builder", credits: 20, available: true },
                      { name: "Graphic Design", credits: 10, available: true },
                      { name: "Social Media Automation", credits: 25, available: true },
                      { name: "SEO Optimization", credits: 30, available: stats.plan !== "free" },
                      { name: "API Access", credits: 50, available: stats.plan === "enterprise" }
                    ].map((service, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          service.available 
                            ? "bg-red-900/10 hover:bg-red-900/20 cursor-pointer" 
                            : "bg-gray-900/10 opacity-50"
                        }`}
                        onClick={() => {
                          if (service.available) {
                            navigate("/ai");
                            trackUserAction("click_ai_service", { service: service.name });
                          } else {
                            trackUserAction("click_restricted_service", { service: service.name });
                          }
                        }}
                      >
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-400">{service.credits} credits per use</p>
                        </div>
                        <div className={`text-sm ${service.available ? 'text-green-400' : 'text-gray-500'}`}>
                          {service.available ? "Available" : "Upgrade Plan"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Plan Expiration */}
              <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Plan Expiration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Calendar className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <p className="text-lg font-medium mb-2">Free Trial Ends</p>
                    <p className="text-2xl font-bold text-red-500 mb-4">3 days</p>
                    <p className="text-gray-400 text-sm mb-4">
                      Upgrade to a paid plan to continue using our AI services
                    </p>
                    <Button 
                      onClick={() => {
                        navigate("/pricing");
                        trackUserAction("click_upgrade_from_expiration");
                      }}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;