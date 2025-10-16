import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
import CinematicWelcome from "@/components/CinematicWelcome";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <CinematicWelcome />
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
    </div>
  );
};

export default Index;