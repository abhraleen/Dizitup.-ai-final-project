import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{ x: number; y: number; opacity: number; size: number }>>([]);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    let currentPosition = { x: 0, y: 0 };
    
    const updatePosition = (e: MouseEvent) => {
      currentPosition = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      
      // Cancel previous frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame((timestamp) => {
        // Throttle trail updates to every 16ms (60fps)
        if (timestamp - lastUpdateRef.current > 16) {
          setPosition(currentPosition);
          
          setTrail(prev => {
            const newTrail = [
              { x: currentPosition.x, y: currentPosition.y, opacity: 1, size: 8 },
              ...prev.slice(0, 10).map((point, index) => ({
                ...point,
                opacity: Math.max(0, point.opacity - 0.05),
                size: Math.max(2, point.size - 0.2)
              }))
            ].filter(point => point.opacity > 0);
            return newTrail;
          });
          
          lastUpdateRef.current = timestamp;
        }
      });
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updatePosition, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Enhanced magnetic trail effect */}
      {trail.map((point, index) => (
        <div
          key={`trail-${index}`}
          className="absolute bg-primary rounded-full will-change-transform"
          style={{
            left: point.x - point.size/2,
            top: point.y - point.size/2,
            width: point.size,
            height: point.size,
            opacity: point.opacity * 0.7,
            boxShadow: `0 0 ${point.size}px hsl(var(--primary) / ${point.opacity * 0.5}), 0 0 ${point.size * 2}px hsl(var(--primary) / ${point.opacity * 0.3})`,
            transform: `translate3d(0, 0, 0)`
          }}
        />
      ))}
      
      {/* Main cursor circle and dot - grouped together */}
      <div
        className="absolute will-change-transform"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        {/* Outer circle */}
        <div
          className="absolute w-8 h-8 border-2 border-primary rounded-full"
          style={{
            left: -16,
            top: -16,
            boxShadow: '0 0 20px hsl(var(--primary) / 0.5), 0 0 40px hsl(var(--primary) / 0.3)',
            background: 'transparent',
          }}
        />
        
        {/* Inner dot */}
        <div
          className="absolute w-1 h-1 bg-primary rounded-full"
          style={{
            left: -2,
            top: -2,
          }}
        />
      </div>
    </div>
  );
};

export default CustomCursor;