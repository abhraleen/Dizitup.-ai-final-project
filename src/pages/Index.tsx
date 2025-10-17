import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import Header from "@/components/Header";
import DizitupHero from "@/components/DizitupHero";
import AboutSection from "@/components/AboutSection";
import ServicesGrid from "@/components/ServicesGrid";
import ProcessSection from "@/components/ProcessSection";
import PricingTeaser from "@/components/PricingTeaser";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import CinematicOpening from "@/components/CinematicOpening";
import AIOnboarding from "@/components/AIOnboarding";

const Index = () => {
  const navigate = useNavigate();
  const [showMainContent, setShowMainContent] = useState(false);
  const [showAIOnboarding, setShowAIOnboarding] = useState(false);

  // Listen for AI onboarding event from chatbot
  useEffect(() => {
    const handleOpenAIOnboarding = () => {
      setShowAIOnboarding(true);
    };

    window.addEventListener('openAIOnboarding', handleOpenAIOnboarding);
    return () => {
      window.removeEventListener('openAIOnboarding', handleOpenAIOnboarding);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Primary gradient with cinematic animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/20 to-black animate-gradient-move"></div>
        
        {/* Secondary overlay gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.1)_0%,rgba(0,0,0,0)_70%)] animate-pulse-slow"></div>
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.1)_0%,transparent_40%)] animate-float-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(153,27,27,0.1)_0%,transparent_40%)] animate-float-2"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,rgba(220,38,38,0.05)_0%,transparent_40%)] animate-float-3"></div>
        </div>
        
        {/* Floating particles with enhanced animation */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-red-500/20 animate-pulse-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay with enhanced effect */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(185,28,28,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(185,28,28,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-move"></div>
      </div>

      <CinematicOpening onComplete={() => setShowMainContent(true)} />
      
      {showAIOnboarding && <AIOnboarding />}
      
      {showMainContent && !showAIOnboarding && (
        <>
          <Header />
          <main className="relative z-10">
            <DizitupHero />
            <AboutSection />
            <ServicesGrid />
            <ProcessSection />
            <div className="py-16 bg-gradient-to-b from-black to-red-900/10 relative">
              <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center">
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                    Experience the <span className="text-primary">Future of AI</span>
                  </h2>
                  <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-10">
                    Our credit-based system makes it easy to scale your business with AI-powered solutions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate("/pricing")}
                      className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-medium rounded-full hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      View Pricing Plans
                    </button>
                    <button
                      onClick={() => {
                        const event = new CustomEvent('openChatbot');
                        window.dispatchEvent(event);
                      }}
                      className="px-8 py-4 border-2 border-red-500 text-red-400 font-medium rounded-full hover:bg-red-500/10 transition-all duration-300"
                    >
                      Chat with Dizi
                    </button>
                    <button
                      onClick={() => setShowAIOnboarding(true)}
                      className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-medium rounded-full hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      AI Analysis
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <BookingForm />
          </main>
          <Footer />
          <SEO 
            title="Future of AI - DizItUp Digital Solutions"
            description="Experience the future of AI with DizItUp's digital solutions. Transform your business with our AI-powered services including workflow automation, digital marketing, and creative design."
            keywords="AI, artificial intelligence, digital solutions, workflow automation, digital marketing, creative design, business transformation"
          />
          <StructuredData />
        </>
      )}
    </div>
  );
};

// Add global styles for animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes gradient-move {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes pulse-slow {
    0% { opacity: 0.1; }
    50% { opacity: 0.2; }
    100% { opacity: 0.1; }
  }
  
  @keyframes float-1 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(15px, 15px); }
    100% { transform: translate(0, 0); }
  }
  
  @keyframes float-2 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(-20px, -10px); }
    100% { transform: translate(0, 0); }
  }
  
  @keyframes float-3 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(10px, -20px); }
    100% { transform: translate(0, 0); }
  }
  
  @keyframes pulse-particle {
    0% { opacity: 0.1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.5); }
    100% { opacity: 0.1; transform: scale(1); }
  }
  
  @keyframes grid-move {
    0% { transform: translate(0, 0); }
    100% { transform: translate(40px, 40px); }
  }
  
  .animate-gradient-move {
    background: linear-gradient(-45deg, #000000, #7f1d1d, #000000, #b91c1c, #000000);
    background-size: 400% 400%;
    animation: gradient-move 15s ease infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 6s ease-in-out infinite;
  }
  
  .animate-float-1 {
    animation: float-1 12s ease-in-out infinite;
  }
  
  .animate-float-2 {
    animation: float-2 15s ease-in-out infinite;
  }
  
  .animate-float-3 {
    animation: float-3 18s ease-in-out infinite;
  }
  
  .animate-pulse-particle {
    animation: pulse-particle 4s ease-in-out infinite;
  }
  
  .animate-grid-move {
    animation: grid-move 25s linear infinite;
  }
`;
document.head.appendChild(style);

export default Index;