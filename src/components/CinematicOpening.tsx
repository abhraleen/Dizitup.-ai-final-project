import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicOpeningProps {
  onComplete: () => void;
}

const CinematicOpening = ({ onComplete }: CinematicOpeningProps) => {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Initialize canvas for fluid water-like animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Water ripple animation
    let time = 0;
    const animate = () => {
      if (!ctx || !canvas) return;
      
      time += 0.02;
      
      // Clear with deep black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create fluid water-like effect
      ctx.globalCompositeOperation = 'screen';
      
      // Draw multiple fluid layers
      for (let i = 0; i < 3; i++) {
        const offsetX = Math.sin(time * 0.2 + i * 0.7) * 50;
        const offsetY = Math.cos(time * 0.15 + i * 0.5) * 50;
        const waveHeight = 15 + Math.sin(time * 0.1 + i) * 10;
        
        ctx.beginPath();
        ctx.lineWidth = 1;
        
        // Deep black to dark red gradient for water effect
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `rgba(0, 0, 0, ${0.1 + Math.sin(time + i) * 0.05})`);
        gradient.addColorStop(0.5, `rgba(100, 0, 0, ${0.05 + Math.sin(time + i + 1) * 0.03})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, ${0.1 + Math.sin(time + i + 2) * 0.05})`);
        ctx.strokeStyle = gradient;
        
        // Draw fluid wave pattern
        for (let x = 0; x < canvas.width; x += 5) {
          const y = (canvas.height / 2) + 
                   Math.sin(x * 0.01 + time * (0.5 + i * 0.2)) * waveHeight + 
                   Math.cos(time * 0.3 + x * 0.008) * 15 +
                   offsetY;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      // Draw subtle water ripples
      for (let i = 0; i < 5; i++) {
        const rippleX = (canvas.width / 6) * (i + 1);
        const rippleY = canvas.height / 2 + Math.sin(time * 0.4 + i) * 30;
        const rippleSize = 30 + Math.sin(time * 0.6 + i) * 20;
        
        const rippleGradient = ctx.createRadialGradient(
          rippleX, rippleY, 0,
          rippleX, rippleY, rippleSize
        );
        rippleGradient.addColorStop(0, `rgba(180, 20, 20, ${0.1 + Math.sin(time + i) * 0.05})`);
        rippleGradient.addColorStop(1, 'rgba(180, 20, 20, 0)');
        
        ctx.fillStyle = rippleGradient;
        ctx.beginPath();
        ctx.arc(rippleX, rippleY, rippleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Progress through animation stages with smoother timing
  useEffect(() => {
    const timers = [
      // Stage 0: Initial black screen (0-1 seconds)
      setTimeout(() => setStage(1), 1000),
      
      // Stage 1: Water ripples begin (1-2 seconds)
      setTimeout(() => setStage(2), 2000),
      
      // Stage 2: Dizitup.ai logo emerges (2-4 seconds)
      setTimeout(() => setStage(3), 4000),
      
      // Stage 3: "Welcome to the Future of AI" text emerges (4-6 seconds)
      setTimeout(() => setStage(4), 6000),
      
      // Stage 4: "Let's build your business, intelligently" text emerges (6-8 seconds)
      setTimeout(() => setStage(5), 8000),
      
      // Stage 5: Smooth transition to main interface (8-10 seconds)
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 1500);
      }, 10000)
    ];

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Canvas for fluid water background animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Skip button */}
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }}
        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-300"
        aria-label="Skip animation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Main content with smooth emergence animation */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {stage >= 2 && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut",
                delay: 0.3
              }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-wider">
                <span className="bg-gradient-to-r from-white via-gray-200 to-red-300 bg-clip-text text-transparent">
                  DIZITUP
                </span>
                <span className="text-red-400">.AI</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {stage >= 3 && (
            <motion.div
              key="welcome-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ 
                duration: 1.2, 
                ease: "easeInOut",
                delay: 0.5
              }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl text-gray-300 font-light mb-4 tracking-wide">
                Welcome to the Future of AI
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {stage >= 4 && (
            <motion.div
              key="business-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ 
                duration: 1.2, 
                ease: "easeInOut",
                delay: 0.7
              }}
              className="text-center"
            >
              <p className="text-lg md:text-xl text-red-300 font-light tracking-wide">
                Let's build your business, intelligently
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle water reflection effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes pulse-slow {
          0% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.05); }
          100% { opacity: 0.05; transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CinematicOpening;