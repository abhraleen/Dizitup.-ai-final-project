import { useEffect, useRef } from 'react';

const AnimatedWaveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let wavePoints: Array<{
      amplitude: number;
      wavelength: number;
      speed: number;
      phase: number;
      colorOffset: number;
    }> = [];

    let orbs: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    const waveCount = 8;
    const orbCount = 4;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initWaves() {
      wavePoints = [];
      for (let i = 0; i < waveCount; i++) {
        wavePoints.push({
          amplitude: 40 + Math.random() * 60,
          wavelength: 200 + Math.random() * 300,
          speed: 0.015 + Math.random() * 0.015, // Slower animation
          phase: Math.random() * 2 * Math.PI,
          colorOffset: i / waveCount
        });
      }
    }

    function initOrbs() {
      orbs = [];
      for (let i = 0; i < orbCount; i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 100 + Math.random() * 200,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: 0.15 + Math.random() * 0.1,
          color: Math.random() > 0.5 ? 'red' : 'black'
        });
      }
    }

    function drawWaves(time: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create base gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      bgGradient.addColorStop(0, 'rgba(26, 0, 0, 0.8)');
      bgGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.9)');
      bgGradient.addColorStop(1, 'rgba(51, 0, 0, 0.7)');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and animate orbs
      for (let orb of orbs) {
        // Update orb position
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Bounce off edges
        if (orb.x <= 0 || orb.x >= canvas.width) orb.speedX *= -1;
        if (orb.y <= 0 || orb.y >= canvas.height) orb.speedY *= -1;

        // Keep orbs in bounds
        orb.x = Math.max(0, Math.min(canvas.width, orb.x));
        orb.y = Math.max(0, Math.min(canvas.height, orb.y));

        // Create orb gradient
        const orbGradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.size
        );
        
        if (orb.color === 'red') {
          orbGradient.addColorStop(0, `rgba(150, 0, 0, ${orb.opacity})`);
          orbGradient.addColorStop(0.5, `rgba(80, 0, 0, ${orb.opacity * 0.6})`);
          orbGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          orbGradient.addColorStop(0, `rgba(40, 40, 40, ${orb.opacity})`);
          orbGradient.addColorStop(0.5, `rgba(20, 20, 20, ${orb.opacity * 0.6})`);
          orbGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw flowing waves
      for (let wave of wavePoints) {
        ctx.beginPath();
        
        // Create wave path
        for (let x = 0; x <= canvas.width; x += 2) {
          const y1 = canvas.height * 0.3 + wave.amplitude * Math.sin((x / wave.wavelength) + wave.phase + time * wave.speed);
          const y2 = canvas.height * 0.7 + wave.amplitude * 0.8 * Math.sin((x / wave.wavelength) * 1.5 + wave.phase + time * wave.speed * 0.7);
          const y = (y1 + y2) / 2;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        // Connect to bottom for fill
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        // Create flowing gradient for each wave
        const waveGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const redIntensity = 0.15 + wave.colorOffset * 0.25;
        const blackIntensity = 0.2 + wave.colorOffset * 0.15;
        const whiteIntensity = 0.008 + wave.colorOffset * 0.015; // Reduced white intensity for subtle blend
        
        waveGradient.addColorStop(0, `rgba(${Math.floor(255 * redIntensity)}, 0, 0, ${0.4 + wave.colorOffset * 0.2})`);
        waveGradient.addColorStop(0.3, `rgba(0, 0, 0, ${0.5 + wave.colorOffset * 0.2})`);
        waveGradient.addColorStop(0.6, `rgba(${Math.floor(255 * redIntensity * 0.8)}, 0, 0, ${0.3 + wave.colorOffset * 0.15})`);
        waveGradient.addColorStop(0.8, `rgba(${Math.floor(255 * whiteIntensity)}, ${Math.floor(255 * whiteIntensity)}, ${Math.floor(255 * whiteIntensity)}, ${0.02 + wave.colorOffset * 0.02})`); // Reduced white opacity
        waveGradient.addColorStop(1, `rgba(0, 0, 0, ${0.6 + wave.colorOffset * 0.1})`);
        
        // Add subtle blur effect for soft edges
        ctx.filter = 'blur(1.5px)';
        ctx.fillStyle = waveGradient;
        ctx.fill();
        ctx.filter = 'none'; // Reset filter
      }
      
      animationId = requestAnimationFrame(() => drawWaves(time + 1));
    }

    function handleResize() {
      resizeCanvas();
      initWaves();
      initOrbs();
    }

    // Initialize
    resizeCanvas();
    initWaves();
    initOrbs();
    drawWaves(0);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedWaveBackground;