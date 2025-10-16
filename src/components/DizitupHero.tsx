import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import dizitupSymbol from "@/assets/dizitup-symbol-transparent.png";
import AnimatedWaveBackground from "@/components/AnimatedWaveBackground";

const DizitupHero = () => {
  const navigate = useNavigate();
  
  const handleBookService = () => {
    navigate('/services');
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
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
      
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center z-10">
        {/* Logo with clean design */}
        <div className="bounce-in mb-6 sm:mb-8 relative group logo-container">
          
          {/* Main logo */}
          <img 
            src={dizitupSymbol} 
            alt="DizItUp Logo - AI-Powered Digital Marketing and Automation Solutions" 
            className="mx-auto h-20 sm:h-24 md:h-32 lg:h-40 hover-scale relative z-10 transition-all duration-300 logo-main"
          />
          
          {/* Scanline overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent opacity-30 animate-pulse scanline-sweep pointer-events-none"></div>
        </div>
        
        {/* Main tagline with enhanced text shadows for readability */}
        <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 slide-up relative leading-tight" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.4)' }}>
          <span className="text-primary glitch-text hover:neon-flicker cursor-default">Future of AI</span>
          <br />
          <span className="text-foreground hover:glitch-text cursor-default">Experience how AI transforms your business — intelligently, beautifully, and automatically.</span>
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-20 animate-pulse pointer-events-none"></div>
        </h1>
        
        {/* Value proposition with text shadow */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto slide-up delay-150 relative px-4" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)' }}>
          <span className="relative z-10">
            Transform your business with workflow automation, digital solutions, and creative branding services that drive growth 24/7.
          </span>
        </p>
        
        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-up delay-300 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse opacity-50"></div>
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate('/pricing')}
              className="pulse-red hover-glow text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 relative z-10 neon-flicker border border-primary/30 backdrop-blur-sm"
            >
              <span className="relative z-10">Try Free for 3 Days</span>
              {/* Button glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse opacity-50"></div>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                // This will open the chatbot
                const event = new CustomEvent('openChatbot');
                window.dispatchEvent(event);
              }}
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 relative z-10 border border-primary/30 backdrop-blur-sm hover:bg-primary/10"
            >
              <span className="relative z-10">Meet Your AI Agent</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator with glitch effect */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce glitch">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center neon-flicker relative">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          {/* Glow effect for scroll indicator */}
          <div className="absolute inset-0 border-2 border-primary/50 rounded-full blur-sm"></div>
        </div>
      </div>
      
      {/* Corner accent elements */}
      <div className="absolute top-0 left-0 w-40 h-40 border-l-2 border-t-2 border-primary/30 opacity-50"></div>
      <div className="absolute top-0 right-0 w-40 h-40 border-r-2 border-t-2 border-primary/30 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 border-l-2 border-b-2 border-primary/30 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 border-r-2 border-b-2 border-primary/30 opacity-50"></div>
    </section>
  );
};

export default DizitupHero;