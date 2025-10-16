import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const CinematicWelcome = () => {
  const navigate = useNavigate();
  const [animationStage, setAnimationStage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stage 1: Liquid waves (0-2 seconds)
    const timer1 = setTimeout(() => {
      setAnimationStage(1);
    }, 500);

    // Stage 2: Red energy streaks (2-4 seconds)
    const timer2 = setTimeout(() => {
      setAnimationStage(2);
    }, 2000);

    // Stage 3: Particle explosion and logo formation (4-6 seconds)
    const timer3 = setTimeout(() => {
      setAnimationStage(3);
    }, 4000);

    // Stage 4: Tagline fade in (6-7 seconds)
    const timer4 = setTimeout(() => {
      setAnimationStage(4);
    }, 6000);

    // Stage 5: Transition to main page (7-8 seconds)
    const timer5 = setTimeout(() => {
      setAnimationStage(5);
      setIsTransitioning(true);
      
      // Hide welcome after transition completes
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [navigate]);

  const skipAnimation = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      ref={animationRef}
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-1000 ${
        isTransitioning ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
    >
      {/* Skip button */}
      <button
        onClick={skipAnimation}
        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-300"
        aria-label="Skip animation"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Main black background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Liquid waves background - Stage 1 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          animationStage >= 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Primary wave layer */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl animate-pulse-wave-1"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-red-900/15 rounded-full blur-3xl animate-pulse-wave-2"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-900/10 rounded-full blur-3xl animate-pulse-wave-3"></div>
        </div>
        
        {/* Secondary wave layer */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-red-800/15 rounded-full blur-3xl animate-pulse-wave-4"></div>
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-red-800/10 rounded-full blur-3xl animate-pulse-wave-5"></div>
        </div>
      </div>
      
      {/* Red energy streaks - Stage 2 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          animationStage >= 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Energy streaks */}
        <div className="absolute top-0 left-1/4 w-1 h-32 bg-gradient-to-b from-red-500 to-transparent animate-streak-1"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-40 bg-gradient-to-b from-red-500 to-transparent animate-streak-2"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-36 bg-gradient-to-b from-red-500 to-transparent animate-streak-3"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-44 bg-gradient-to-b from-red-500 to-transparent animate-streak-4"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-38 bg-gradient-to-b from-red-500 to-transparent animate-streak-5"></div>
      </div>
      
      {/* Particle explosion and formation - Stage 3 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          animationStage >= 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Central particle explosion */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Explosion rings */}
          <div className="absolute inset-0 w-96 h-96 rounded-full border-2 border-red-500/30 animate-explode-1"></div>
          <div className="absolute inset-0 w-80 h-80 rounded-full border-2 border-red-500/40 animate-explode-2"></div>
          <div className="absolute inset-0 w-64 h-64 rounded-full border-2 border-red-500/50 animate-explode-3"></div>
          
          {/* Particle bursts */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-500 rounded-full animate-particle-burst"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 18}deg) translate(80px)`,
                animationDelay: `${i * 0.05}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Logo formation - Stage 3 */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
          animationStage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-125"
        }`}
      >
        {/* DIZITUP.AI text */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-white mb-4 animate-text-glow">
          <span className="bg-gradient-to-r from-white via-red-200 to-red-500 bg-clip-text text-transparent">
            DIZITUP
          </span>
          <span className="text-red-500">.AI</span>
        </h1>
        
        {/* Tagline - Stage 4 */}
        <p 
          className={`text-xl md:text-2xl text-gray-300 mt-6 transition-opacity duration-1000 ${
            animationStage >= 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          Redefining the Future with Intelligence
        </p>
      </div>
      
      {/* Ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-ambient-glow-1"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-ambient-glow-2"></div>
      </div>
      
      {/* Custom Styles */}
      <style>{`
        @keyframes pulse-wave-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { transform: translate(10px, 15px) scale(1.1); opacity: 0.3; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        }
        
        @keyframes pulse-wave-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(-15px, -10px) scale(1.05); opacity: 0.25; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
        }
        
        @keyframes pulse-wave-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
          50% { transform: translate(5px, -15px) scale(1.15); opacity: 0.2; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
        }
        
        @keyframes pulse-wave-4 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(20px, 5px) scale(1.1); opacity: 0.25; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
        }
        
        @keyframes pulse-wave-5 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
          50% { transform: translate(-10px, 20px) scale(1.05); opacity: 0.2; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
        }
        
        @keyframes streak-1 {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes streak-2 {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes streak-3 {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes streak-4 {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes streak-5 {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes explode-1 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        
        @keyframes explode-2 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        
        @keyframes explode-3 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes particle-burst {
          0% { transform: rotate(var(--rotate)) translate(0) scale(1); opacity: 1; }
          100% { transform: rotate(var(--rotate)) translate(120px) scale(0); opacity: 0; }
        }
        
        @keyframes text-glow {
          0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(220, 38, 38, 0.6); }
          100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
        }
        
        @keyframes ambient-glow-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
          50% { transform: translate(15px, -15px) scale(1.2); opacity: 0.15; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
        }
        
        @keyframes ambient-glow-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.05; }
          50% { transform: translate(-15px, 15px) scale(1.1); opacity: 0.1; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.05; }
        }
        
        .animate-pulse-wave-1 {
          animation: pulse-wave-1 8s ease-in-out infinite;
        }
        
        .animate-pulse-wave-2 {
          animation: pulse-wave-2 10s ease-in-out infinite;
        }
        
        .animate-pulse-wave-3 {
          animation: pulse-wave-3 12s ease-in-out infinite;
        }
        
        .animate-pulse-wave-4 {
          animation: pulse-wave-4 9s ease-in-out infinite;
        }
        
        .animate-pulse-wave-5 {
          animation: pulse-wave-5 11s ease-in-out infinite;
        }
        
        .animate-streak-1 {
          animation: streak-1 3s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        
        .animate-streak-2 {
          animation: streak-2 3.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .animate-streak-3 {
          animation: streak-3 4s ease-in-out infinite;
          animation-delay: 0.8s;
        }
        
        .animate-streak-4 {
          animation: streak-4 3.2s ease-in-out infinite;
          animation-delay: 1.2s;
        }
        
        .animate-streak-5 {
          animation: streak-5 3.8s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        
        .animate-explode-1 {
          animation: explode-1 1.5s ease-out forwards;
        }
        
        .animate-explode-2 {
          animation: explode-2 1.5s ease-out 0.2s forwards;
        }
        
        .animate-explode-3 {
          animation: explode-3 1.5s ease-out 0.4s forwards;
        }
        
        .animate-particle-burst {
          --rotate: 0deg;
          animation: particle-burst 1.5s ease-out forwards;
        }
        
        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        
        .animate-ambient-glow-1 {
          animation: ambient-glow-1 6s ease-in-out infinite;
        }
        
        .animate-ambient-glow-2 {
          animation: ambient-glow-2 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CinematicWelcome;