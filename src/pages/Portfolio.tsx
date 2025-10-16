import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedWaveBackground from "@/components/AnimatedWaveBackground";
import PortfolioMasonry from "@/components/PortfolioMasonry";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Portfolio = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Portfolio - Creative Digital Projects & Success Stories"
        description="Explore DizItUp's portfolio showcasing successful digital marketing campaigns, website development projects, branding work, and creative content. See how we've helped businesses grow with our digital solutions."
        keywords="portfolio, digital marketing projects, website development portfolio, branding projects, creative agency work, DizItUp projects"
        canonical="/portfolio"
      />
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <AnimatedWaveBackground />
      
      {/* Digital rain background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-px h-px bg-primary/30 digital-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse neon-flicker"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-75 neon-flicker"></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-primary/5 rounded-full blur-2xl float"></div>
        <div className="absolute bottom-1/3 left-1/5 w-60 h-60 bg-primary/5 rounded-full blur-2xl float delay-300"></div>
      </div>
      
      {/* Corner accent elements */}
      <div className="absolute top-0 left-0 w-40 h-40 border-l-2 border-t-2 border-primary/30 opacity-50"></div>
      <div className="absolute top-0 right-0 w-40 h-40 border-r-2 border-t-2 border-primary/30 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 border-l-2 border-b-2 border-primary/30 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 border-r-2 border-b-2 border-primary/30 opacity-50"></div>
      
      <Header />
      
      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 content-overlay">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="text-primary text-sm font-medium">Our Work</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4 sm:mb-6 text-primary glitch-text hover:neon-flicker" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.4)' }}>
              Creative <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)' }}>
              Discover our creative journey through digital marketing campaigns, website development, 
              branding projects, and content creation that drives business growth.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/ai")} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full"
              >
                Experience AI Version
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/services")}
                className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-full"
              >
                View Services
              </Button>
            </div>
          </div>
        </section>

        {/* Portfolio Masonry Grid */}
        <section className="relative py-8 sm:py-12">
          <PortfolioMasonry />
        </section>
      </main>
      
      <Footer />
    </div>
    </>
  );
};

export default Portfolio;