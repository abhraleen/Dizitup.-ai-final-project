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
    <div className="min-h-screen bg-black">
      <CinematicOpening onComplete={() => setShowMainContent(true)} />
      
      {showAIOnboarding && <AIOnboarding />}
      
      {showMainContent && !showAIOnboarding && (
        <>
          <Header />
          <main>
            <DizitupHero />
            <AboutSection />
            <ServicesGrid />
            <ProcessSection />
            <div className="py-16 bg-gradient-to-b from-black to-red-900/10">
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

export default Index;