import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, Crown, Rocket, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { trackUserAction, trackConversion } from "@/utils/analytics";

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  // Track page view
  useEffect(() => {
    trackUserAction("view_pricing_page");
  }, []);

  const plans = [
    {
      id: "free",
      name: "Basic Plan",
      tagline: "Free Trial – 3 Days",
      price: {
        monthly: "Free",
        annual: "Free"
      },
      credits: 100,
      description: "Perfect for trying out our AI tools",
      features: [
        "100 Credits Free",
        "Access to AI tools, chat, and limited service requests",
        "Auto-deactivate after 3 days or after 100 credits used",
        "Basic support"
      ],
      cta: "Start Free Trial",
      popular: false,
      icon: <Zap className="h-5 w-5" />,
      badge: "Free Trial"
    },
    {
      id: "starter",
      name: "Starter Plan",
      tagline: "For growing businesses",
      price: {
        monthly: "₹2,999",
        annual: "₹2,699" // 10% discount
      },
      credits: 1000,
      description: "Great for regular use of our AI services",
      features: [
        "1,000 Credits/month",
        "Priority AI Support (Dizi chatbot always available)",
        "Standard turnaround time",
        "Monthly auto-renew",
        "Credits reset every 30 days"
      ],
      cta: "Get Started",
      popular: true,
      icon: <Star className="h-5 w-5" />,
      badge: "Most Popular"
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      tagline: "For large scale operations",
      price: {
        monthly: "₹9,999",
        annual: "₹8,999" // 10% discount
      },
      credits: 5000,
      description: "Complete access to all our AI capabilities",
      features: [
        "5,000 Credits/month",
        "Dedicated project manager (human + AI hybrid)",
        "Access to automation dashboard + API tools",
        "Premium delivery speed",
        "Advanced analytics of usage and lead tracking",
        "Early access to new features"
      ],
      cta: "Go Enterprise",
      popular: false,
      icon: <Crown className="h-5 w-5" />,
      badge: "Enterprise"
    }
  ];

  const extraCredits = [
    { id: 1, credits: 500, price: "₹1,499", planRestriction: "starter" },
    { id: 2, credits: 1000, price: "₹2,799", planRestriction: "starter" },
    { id: 3, credits: 2000, price: "₹5,299", planRestriction: "enterprise" }
  ];

  const handlePlanSelect = (planId: string) => {
    trackUserAction("select_pricing_plan", { planId });
    
    // Redirect to checkout or login if not authenticated
    if (!user) {
      trackUserAction("redirect_to_login_from_pricing");
      navigate("/admin/login");
      return;
    }
    
    // In a real implementation, this would redirect to a checkout page
    trackConversion("plan_selection", plans.find(p => p.id === planId)?.credits);
    alert(`Redirecting to checkout for ${plans.find(p => p.id === planId)?.name}`);
  };

  const handleCreditPurchase = (credits: number, price: string, planRestriction: string) => {
    trackUserAction("initiate_credit_purchase", { credits, price, planRestriction });
    
    // Check if user is logged in
    if (!user) {
      trackUserAction("redirect_to_login_from_credits");
      navigate("/admin/login");
      return;
    }
    
    // In a real implementation, this would check the user's current plan
    // and restrict purchases based on plan restrictions
    if (planRestriction === "enterprise") {
      trackUserAction("upgrade_required_for_credits", { restriction: "enterprise" });
      alert(`This credit pack requires the Enterprise plan. Redirecting to upgrade...`);
      return;
    }
    
    if (planRestriction === "starter") {
      trackUserAction("upgrade_required_for_credits", { restriction: "starter" });
      alert(`This credit pack requires the Starter plan or higher. Redirecting to upgrade...`);
      return;
    }
    
    // Process purchase
    trackConversion("credit_purchase", credits);
    alert(`Processing purchase of ${credits} credits for ${price}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.15)_0%,rgba(0,0,0,0)_70%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
            Credit-Based Pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Flexible plans designed to scale with your business. Try free for 3 days, then choose the plan that fits your needs.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 font-medium ${billingCycle === "monthly" ? "text-white" : "text-gray-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => {
                setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly");
                trackUserAction("toggle_billing_cycle", { cycle: billingCycle === "monthly" ? "annual" : "monthly" });
              }}
              className="relative rounded-full w-14 h-7 bg-red-900/50 border border-red-500/30"
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-red-500 transition-transform duration-300 ${
                  billingCycle === "monthly" ? "left-1" : "left-8"
                }`}
              ></div>
            </button>
            <span className={`ml-3 font-medium ${billingCycle === "annual" ? "text-white" : "text-gray-400"}`}>
              Annual <span className="text-red-400 text-sm">(Save 10%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`bg-black/50 border border-red-500/30 backdrop-blur-xl relative overflow-hidden ${
                plan.popular ? "ring-2 ring-red-500/50 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-4 py-1 transform translate-x-6 -translate-y-2 rotate-45 origin-top-right">
                  POPULAR
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-red-500/15 flex items-center justify-center">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-gray-300 mb-4">{plan.tagline}</CardDescription>
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    {billingCycle === "monthly" ? plan.price.monthly : plan.price.annual}
                  </span>
                  {plan.price.monthly !== "Free" && (
                    <span className="text-gray-400">/month</span>
                  )}
                </div>
                <Badge variant="secondary" className="mb-4">
                  {plan.credits.toLocaleString()} Credits
                </Badge>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full ${
                    plan.popular 
                      ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900" 
                      : "bg-red-900/50 hover:bg-red-800/50 border border-red-500/30"
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Extra Credits Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Need More Credits?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Purchase additional credits anytime. Starter plan users can only buy extra credits after their 30-day cycle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {extraCredits.map((credit) => (
              <Card key={credit.id} className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold">{credit.credits.toLocaleString()} Credits</CardTitle>
                  {credit.planRestriction === "starter" && (
                    <Badge variant="outline" className="mb-2">Starter Plan Required</Badge>
                  )}
                  {credit.planRestriction === "enterprise" && (
                    <Badge variant="outline" className="mb-2">Enterprise Plan Required</Badge>
                  )}
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <div className="text-3xl font-bold text-red-500 mb-4">{credit.price}</div>
                  <p className="text-gray-400 text-sm">One-time purchase</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleCreditPurchase(credit.credits, credit.price, credit.planRestriction)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                  >
                    {user ? "Buy Now" : "Login to Buy"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Credit Purchase Restrictions Info */}
          <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 text-red-500 mr-2" />
                Credit Purchase Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Free trial users can purchase credits after upgrading to a paid plan</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Starter plan users can purchase additional credits anytime</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Enterprise plan users get priority access to large credit packs</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Credits expire at the end of each billing cycle</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How Credits Work */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="bg-black/50 border border-red-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="h-5 w-5 text-red-500 mr-2" />
                How Our Credit System Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-red-900/10 rounded-lg">
                  <div className="text-3xl font-bold text-red-500 mb-2">1</div>
                  <h3 className="font-bold mb-2">Earn Your Free Trial</h3>
                  <p className="text-gray-400 text-sm">
                    Sign up and get 100 credits free for 3 days to try our services.
                  </p>
                </div>
                <div className="text-center p-6 bg-red-900/10 rounded-lg">
                  <div className="text-3xl font-bold text-red-500 mb-2">2</div>
                  <h3 className="font-bold mb-2">Choose Your Plan</h3>
                  <p className="text-gray-400 text-sm">
                    Select a plan that gives you the credits you need each month.
                  </p>
                </div>
                <div className="text-center p-6 bg-red-900/10 rounded-lg">
                  <div className="text-3xl font-bold text-red-500 mb-2">3</div>
                  <h3 className="font-bold mb-2">Use & Renew</h3>
                  <p className="text-gray-400 text-sm">
                    Use your credits for services. Credits reset monthly with auto-renewal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of businesses already leveraging our AI-powered solutions to drive growth and innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => {
                navigate("/ai");
                trackUserAction("click_cta", { action: "start_free_trial" });
              }}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 px-8 py-6 text-lg"
            >
              Start Free Trial
            </Button>
            <Button 
              onClick={() => {
                navigate("/contact");
                trackUserAction("click_cta", { action: "contact_sales" });
              }}
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-8 py-6 text-lg"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;