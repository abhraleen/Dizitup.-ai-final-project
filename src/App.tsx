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
const FluidDynamicBackground = lazy(() => import("@/components/FluidDynamicBackground"));
import PageTransition from "@/components/PageTransition";
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
            <FluidDynamicBackground />
          </Suspense>
          <DiziChatbot />
          <BrowserRouter>
            <PageViewTracker />
            <Routes>
              <Route path="/" element={<PageTransition key="index"><Index /></PageTransition>} />
              <Route path="/ai" element={<PageTransition key="ai-dashboard"><AIDashboard /></PageTransition>} />
              <Route path="/settings" element={<PageTransition key="settings"><Settings /></PageTransition>} />
              <Route path="/services" element={<PageTransition key="services"><Services /></PageTransition>} />
              <Route path="/portfolio" element={<PageTransition key="portfolio"><Portfolio /></PageTransition>} />
              <Route path="/pricing" element={<PageTransition key="pricing"><PricingPage /></PageTransition>} />
              <Route path="/profile" element={<PageTransition key="profile"><ProfilePage /></PageTransition>} />
              <Route path="/dashboard" element={<PageTransition key="user-dashboard"><UserDashboard /></PageTransition>} />
              <Route path="/admin" element={<PageTransition key="admin"><AdminDashboard /></PageTransition>} />
              <Route path="/admin/login" element={<PageTransition key="admin-login"><AdminLogin /></PageTransition>} />
              <Route path="/admin/dashboard" element={<PageTransition key="admin-dashboard"><AdminDashboard /></PageTransition>} />
              <Route path="/video-editing" element={<PageTransition key="video-editing"><VideoEditingInterface /></PageTransition>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<PageTransition key="not-found"><NotFound /></PageTransition>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;