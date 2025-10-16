import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { analytics, trackPageView } from "@/utils/analytics";
const CustomCursor = lazy(() => import("@/components/CustomCursor"));
import Index from "./pages/Index";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import VideoEditingInterface from "@/components/VideoEditingInterface";
import AIDashboard from "@/pages/AIDashboard";
import Settings from "@/pages/Settings";
import DiziChatbot from "@/components/DiziChatbot";
import PricingPage from "@/pages/PricingPage";
import ProfilePage from "@/pages/ProfilePage";
import UserDashboard from "@/pages/UserDashboard";

// Page view tracking component
const PageViewTracker = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Track page views
    trackPageView(location.pathname);
    
    // Set user ID for analytics
    if (user) {
      analytics.setUserId(user.id);
    } else {
      analytics.setUserId(null);
    }
    
    // Track specific user flow events
    const page = location.pathname;
    
    if (page === "/") {
      analytics.track("landing_page_view");
    } else if (page === "/ai") {
      analytics.track("ai_dashboard_view");
    } else if (page === "/pricing") {
      analytics.track("pricing_page_view");
    } else if (page === "/dashboard") {
      analytics.track("user_dashboard_view");
    } else if (page === "/profile") {
      analytics.track("profile_page_view");
    } else if (page === "/admin" || page === "/admin/dashboard") {
      analytics.track("admin_dashboard_view");
    } else if (page === "/admin/login") {
      analytics.track("admin_login_view");
    }
  }, [location, user]);

  // Track user authentication state changes
  useEffect(() => {
    if (user) {
      analytics.track("user_logged_in", {
        userId: user.id,
        email: user.email
      });
    } else {
      analytics.track("user_logged_out");
    }
  }, [user]);

  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={null}>
            <CustomCursor />
          </Suspense>
          <DiziChatbot />
          <BrowserRouter>
            <PageViewTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ai" element={<AIDashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/video-editing" element={<VideoEditingInterface />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;