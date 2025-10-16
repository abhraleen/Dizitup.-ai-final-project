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
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    life: number;
    maxLife: number;
  }>>([]);

  // Initialize canvas for fluid animation
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

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 100; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 1 + Math.random() * 3,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100,
          maxLife: 100
        });
      }
    };

    initParticles();

    // Animation loop
    let time = 0;
    const animate = () => {
      if (!ctx || !canvas) return;
      
      time += 0.01;
      
      // Clear with subtle fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw fluid waves
      ctx.globalCompositeOperation = 'lighter';
      
      // Draw multiple wave layers
      for (let i = 0; i < 3; i++) {
        const offsetX = Math.sin(time * 0.2 + i) * 50;
        const offsetY = Math.cos(time * 0.15 + i) * 50;
        const waveHeight = 30 + Math.sin(time * 0.1 + i) * 20;
        
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(220, 38, 38, ${0.1 + i * 0.05})`;
        
        for (let x = 0; x < canvas.width; x += 5) {
          const y = (canvas.height / 2) + 
                   Math.sin(x * 0.01 + time * (0.5 + i * 0.2)) * waveHeight + 
                   offsetY;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life -= 0.5;
        
        // Reset dead particles
        if (particle.life <= 0 || 
            particle.x < -50 || particle.x > canvas.width + 50 ||
            particle.y < -50 || particle.y > canvas.height + 50) {
          particlesRef.current[index] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 1 + Math.random() * 3,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            life: 100,
            maxLife: 100
          };
        }
        
        // Draw particle with glow
        const lifeRatio = particle.life / particle.maxLife;
        const size = particle.size * lifeRatio;
        
        // Create radial gradient for glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size * 3
        );
        gradient.addColorStop(0, `rgba(220, 38, 38, ${lifeRatio * 0.6})`);
        gradient.addColorStop(0.5, `rgba(220, 38, 38, ${lifeRatio * 0.3})`);
        gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
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

  // Progress through animation stages
  useEffect(() => {
    const timers = [
      // Stage 0: Initial black screen (0-1 seconds)
      setTimeout(() => setStage(1), 1000),
      
      // Stage 1: Liquid black waves slowly moving (1-3 seconds)
      setTimeout(() => setStage(2), 3000),
      
      // Stage 2: Dizitup.ai logo appears (3-5 seconds)
      setTimeout(() => setStage(3), 5000),
      
      // Stage 3: "Welcome to the Future of AI" text (5-7 seconds)
      setTimeout(() => setStage(4), 7000),
      
      // Stage 4: "Let's build your business, intelligently" text (7-9 seconds)
      setTimeout(() => setStage(5), 9000),
      
      // Stage 5: Transition to main interface (9-10 seconds)
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 1000);
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
      {/* Canvas for fluid background animation */}
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

      {/* Main content with animation stages */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {stage >= 2 && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold tracking-wider">
                <span className="bg-gradient-to-r from-white via-red-200 to-red-500 bg-clip-text text-transparent">
                  DIZITUP
                </span>
                <span className="text-red-500">.AI</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {stage >= 3 && (
            <motion.div
              key="welcome-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl text-gray-300 font-light mb-4">
                Welcome to the Future of AI
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {stage >= 4 && (
            <motion.div
              key="business-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl text-red-400 font-light">
                Let's build your business, intelligently
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-red-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes pulse-slow {
          0% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
          100% { opacity: 0.1; transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CinematicOpening;