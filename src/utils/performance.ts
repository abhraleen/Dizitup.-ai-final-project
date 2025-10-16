// Performance optimization utilities

// Debounce function to limit how often a function can be called
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function to limit the rate at which a function can fire
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy load images for better performance
export function lazyLoadImages() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Optimize scroll performance
export function optimizeScrollPerformance() {
  let ticking = false;
  
  function updateScrollPosition() {
    // Perform scroll-related updates here
    // This will only run once per frame
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
}

// Memory usage tracking
export function trackMemoryUsage() {
  // @ts-ignore
  if ('memory' in performance && performance.memory) {
    // @ts-ignore
    const memory = performance.memory;
    // @ts-ignore
    console.log(`Memory Usage: ${Math.round(memory.usedJSHeapSize / 1048576)} MB`);
    // @ts-ignore
    return memory;
  }
  return null;
}

// FPS monitoring
export function monitorFPS() {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  
  function updateFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;
      
      // Log FPS if it drops below 30
      if (fps < 30) {
        console.warn(`Low FPS detected: ${fps}`);
      }
    }
    
    requestAnimationFrame(updateFPS);
  }
  
  requestAnimationFrame(updateFPS);
  return () => {}; // Return cleanup function
}

// Component rendering optimization
export class RenderOptimizer {
  private static instance: RenderOptimizer;
  private renderQueue: Set<() => void> = new Set();
  private isProcessing = false;
  
  private constructor() {}
  
  public static getInstance(): RenderOptimizer {
    if (!RenderOptimizer.instance) {
      RenderOptimizer.instance = new RenderOptimizer();
    }
    return RenderOptimizer.instance;
  }
  
  public queueRender(callback: () => void) {
    this.renderQueue.add(callback);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }
  
  private async processQueue() {
    this.isProcessing = true;
    
    // Process all queued renders in a single animation frame
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        this.renderQueue.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('Error in render callback:', error);
          }
        });
        
        this.renderQueue.clear();
        this.isProcessing = false;
        resolve(null);
      });
    });
  }
}

// Smooth scrolling utility
export function smoothScrollTo(element: HTMLElement, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Animation frame utility for smooth animations
export function animateWithRAF(
  duration: number,
  easingFunction: (t: number) => number,
  update: (progress: number) => void,
  complete?: () => void
) {
  const startTime = performance.now();
  
  function animationStep(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunction(progress);
    
    update(easedProgress);
    
    if (progress < 1) {
      requestAnimationFrame(animationStep);
    } else if (complete) {
      complete();
    }
  }
  
  requestAnimationFrame(animationStep);
}

// Easing functions
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};