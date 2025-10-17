import { useEffect, useRef } from 'react';

const FluidDynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Plasma effect variables
    let time = 0;
    let animationId: number;

    // Create gradient textures with red, silver, and black colors
    const createPlasmaTexture = () => {
      const width = 256;
      const height = 256;
      const plasmaCanvas = document.createElement('canvas');
      plasmaCanvas.width = width;
      plasmaCanvas.height = height;
      const plasmaCtx = plasmaCanvas.getContext('2d');
      if (!plasmaCtx) return null;

      const imageData = plasmaCtx.createImageData(width, height);
      const data = imageData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          
          // Create complex plasma pattern
          const value = Math.sin(x / 32) + 
                       Math.sin(y / 24) + 
                       Math.sin((x + y) / 16) + 
                       Math.sin(Math.sqrt(x * x + y * y) / 8);
          
          // Normalize to 0-255 range
          const normalized = Math.floor((Math.sin(value) + 1) * 127.5);
          
          // Create dynamic gradient with red, silver, and black
          // Red tones
          if (normalized > 180) {
            data[idx] = 220; // R
            data[idx + 1] = 38;  // G
            data[idx + 2] = 38;  // B
          } 
          // Silver/Gray tones
          else if (normalized > 100) {
            data[idx] = 192; // R
            data[idx + 1] = 192; // G
            data[idx + 2] = 192; // B
          }
          // Black tones
          else {
            data[idx] = normalized * 0.2; // R
            data[idx + 1] = normalized * 0.2; // G
            data[idx + 2] = normalized * 0.2; // B
          }
          
          // Adjust alpha for smoother transitions
          data[idx + 3] = 30 + normalized * 0.4; // A
        }
      }

      plasmaCtx.putImageData(imageData, 0, 0);
      return plasmaCanvas;
    };

    const plasmaTexture = createPlasmaTexture();

    // Particle system for energy flows
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
      hue: number;
      saturation?: number;
      lightness?: number;
      colorType?: number;
    }> = [];

    // Initialize particles with red, silver, and black colors
    const initParticles = () => {
      for (let i = 0; i < 50; i++) {
        // Randomly assign color type (0 = red, 1 = silver, 2 = black)
        const colorType = Math.floor(Math.random() * 3);
        let hue, saturation, lightness;
        
        if (colorType === 0) {
          // Red particles
          hue = 0;
          saturation = 100;
          lightness = 70;
        } else if (colorType === 1) {
          // Silver particles
          hue = 0;
          saturation = 0;
          lightness = 85;
        } else {
          // Black particles
          hue = 0;
          saturation = 0;
          lightness = 20;
        }
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 2 + Math.random() * 8,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          life: Math.random() * 100,
          maxLife: 100,
          hue: hue,
          saturation: saturation,
          lightness: lightness,
          colorType: colorType
        });
      }
    };

    initParticles();

    // Mouse interaction
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render function
    const render = () => {
      if (!ctx) return;
      
      time += 0.01;
      
      // Clear with subtle black background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw plasma background
      if (plasmaTexture) {
        for (let i = 0; i < 10; i++) {
          const offsetX = Math.sin(time * 0.3 + i) * 50;
          const offsetY = Math.cos(time * 0.2 + i) * 50;
          const scale = 0.8 + Math.sin(time * 0.1 + i) * 0.2;
          
          ctx.globalAlpha = 0.1;
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(
            plasmaTexture,
            0, 0, plasmaTexture.width, plasmaTexture.height,
            offsetX, offsetY,
            canvas.width * scale, canvas.height * scale
          );
        }
      }
      
      // Draw energy particles
      ctx.globalCompositeOperation = 'screen';
      particles.forEach((particle, index) => {
        // Update particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life -= 0.5;
        
        // Reset dead particles
        if (particle.life <= 0 || 
            particle.x < -50 || particle.x > canvas.width + 50 ||
            particle.y < -50 || particle.y > canvas.height + 50) {
          // Randomly assign color type (0 = red, 1 = silver, 2 = black)
          const colorType = Math.floor(Math.random() * 3);
          let hue, saturation, lightness;
          
          if (colorType === 0) {
            // Red particles
            hue = 0;
            saturation = 100;
            lightness = 70;
          } else if (colorType === 1) {
            // Silver particles
            hue = 0;
            saturation = 0;
            lightness = 85;
          } else {
            // Black particles
            hue = 0;
            saturation = 0;
            lightness = 20;
          }
          
          particles[index] = {
            x: mouse.x + (Math.random() - 0.5) * 200,
            y: mouse.y + (Math.random() - 0.5) * 200,
            size: 2 + Math.random() * 8,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            life: 100,
            maxLife: 100,
            hue: hue,
            saturation: saturation,
            lightness: lightness,
            colorType: colorType
          };
        }
        
        // Draw particle with glow
        const lifeRatio = Math.max(0, particle.life / particle.maxLife); // Ensure non-negative
        const size = Math.max(0.1, particle.size * lifeRatio); // Ensure minimum size to prevent negative radius
        
        // Create radial gradient for glow effect based on color type
        // Ensure radii are positive to prevent IndexSizeError
        const innerRadius = 0;
        const outerRadius = Math.max(0.1, size); // Ensure minimum radius of 0.1
        
        if (outerRadius > 0 && particle.x >= 0 && particle.y >= 0) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, innerRadius,
            particle.x, particle.y, outerRadius
          );
          
          if (particle.colorType === 0) {
            // Red particles
            gradient.addColorStop(0, `hsla(0, 100%, 70%, ${lifeRatio * 0.8})`);
            gradient.addColorStop(0.5, `hsla(0, 100%, 50%, ${lifeRatio * 0.4})`);
            gradient.addColorStop(1, `hsla(0, 100%, 30%, 0)`);
          } else if (particle.colorType === 1) {
            // Silver particles
            gradient.addColorStop(0, `hsla(0, 0%, 85%, ${lifeRatio * 0.6})`);
            gradient.addColorStop(0.5, `hsla(0, 0%, 70%, ${lifeRatio * 0.3})`);
            gradient.addColorStop(1, `hsla(0, 0%, 50%, 0)`);
          } else {
            // Black particles
            gradient.addColorStop(0, `hsla(0, 0%, 20%, ${lifeRatio * 0.4})`);
            gradient.addColorStop(0.5, `hsla(0, 0%, 15%, ${lifeRatio * 0.2})`);
            gradient.addColorStop(1, `hsla(0, 0%, 10%, 0)`);
          }
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, outerRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Draw flowing energy lines with red, silver, and black gradient
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) {
        const offsetX = Math.sin(time * 0.5 + i) * 100;
        const offsetY = Math.cos(time * 0.3 + i) * 100;
        
        ctx.beginPath();
        ctx.lineWidth = 2;
        
        // Alternate between red and silver lines
        if (i % 2 === 0) {
          ctx.strokeStyle = `rgba(220, 38, 38, ${0.1 + Math.sin(time + i) * 0.1})`;
        } else {
          ctx.strokeStyle = `rgba(192, 192, 192, ${0.05 + Math.sin(time + i) * 0.05})`;
        }
        
        for (let j = 0; j < 20; j++) {
          const x = (canvas.width / 20) * j + offsetX;
          const y = (canvas.height / 2) + 
                   Math.sin(time * 2 + j * 0.5) * 50 + 
                   Math.cos(time * 1.5 + j * 0.3) * 30 + 
                   offsetY;
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
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

export default FluidDynamicBackground;