import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Zap, Globe, Smartphone, Film, Palette, Target } from "lucide-react";

const services = [
  {
    icon: Film,
    title: "Video Editing Services",
    description: "From short-form edits to long-form storytelling — crafted with precision and creativity for businesses and creators.",
    cta: "Edit Video",
    glitchDelay: "0s"
  },
  {
    icon: Palette,
    title: "Graphic Design Services",
    description: "Eye-catching creatives, posters, and complete brand kits tailored to your style and business needs.",
    cta: "Design Graphics",
    glitchDelay: "0.5s"
  },
  {
    icon: Globe,
    title: "Website Development",
    description: "Responsive, modern, SEO-optimized websites for startups, businesses, and personal brands in India.",
    cta: "Build Website",
    glitchDelay: "1s"
  },
  {
    icon: Smartphone,
    title: "App Development",
    description: "Mobile & web apps built for growth — from MVPs to enterprise-level solutions with AI integration.",
    cta: "Create App",
    glitchDelay: "1.5s"
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "AI-powered business automations to save time, reduce costs, and scale operations smarter.",
    cta: "Automate Workflow",
    glitchDelay: "2s"
  },
  {
    icon: Target,
    title: "Branding & Strategy",
    description: "From social media strategy to full brand identity — everything to grow your business and digital presence.",
    cta: "Build Brand",
    glitchDelay: "2.5s"
  }
];

const ServicesGrid = () => {
  const navigate = useNavigate();
  
  const handleBookService = () => {
    navigate('/services');
  };

  const handleCustomProject = () => {
    // Smooth scroll to the booking form section
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden cyber-grid">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Vertical data streams */}
        <div className="absolute top-1/4 left-10 w-2 h-32 bg-primary/30 blur-sm animate-pulse neon-flicker"></div>
        <div className="absolute bottom-1/4 right-10 w-2 h-24 bg-primary/30 blur-sm animate-pulse delay-300 neon-flicker"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-20 bg-primary/40 blur-sm animate-pulse delay-150"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-16 bg-primary/40 blur-sm animate-pulse delay-450"></div>
        
        {/* Horizontal data streams */}
        <div className="absolute top-1/6 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent data-stream"></div>
        <div className="absolute bottom-1/6 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent data-stream" style={{ animationDelay: '4s' }}></div>
        
        {/* Central ping effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary animate-ping"></div>
        
        {/* Enhanced digital rain effect */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-px bg-primary/30 matrix-rain"
            style={{
              left: `${5 + Math.random() * 90}%`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Floating glitch particles */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/50 hologram-flicker"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16 relative">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-glitch hologram-flicker">
            AI-Powered <span className="text-primary glitch-text neon-flicker">Digital Solutions</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto relative px-4">
            <span className="relative z-10">Comprehensive digitalisation and automation services to accelerate your business growth in India and beyond</span>
            {/* Text glow effect */}
            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-50"></div>
          </p>
          
          {/* Enhanced subtitle effects */}
          <div className="relative mt-6">
            <div className="absolute inset-0 scanlines opacity-40"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 card-glitch group relative overflow-hidden shadow-card"
              style={{ animationDelay: service.glitchDelay }}
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full neon-flicker">
                    <service.icon className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-display text-xl text-card-foreground text-glitch">
                  {service.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center relative z-10">
                <CardDescription className="text-muted-foreground mb-4 text-base leading-relaxed">
                  {service.description}
                </CardDescription>
                
                
                <Button 
                  variant="outline" 
                  onClick={handleBookService}
                  className="hover-glow border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:shadow-red-glow"
                >
                  <span className="relative z-10">{service.cta}</span>
                </Button>
              </CardContent>
              
              {/* Corner accent lines */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base text-muted-foreground mb-4 relative px-4">
            <span className="relative z-10">Need something custom?</span>
            <div className="absolute inset-0 bg-primary/5 blur-lg opacity-50"></div>
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleCustomProject}
            className="pulse-red hover-glow neon-flicker text-base sm:text-lg"
          >
            <span className="relative z-10">Let's Build Together</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;