import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SparkleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const SparkleButton = ({ children, onClick, className = "", icon }: SparkleButtonProps) => {
  return (
    <button 
      className={`sparkle-button ${className}`}
      onClick={onClick}
    >
      <span className="text">{children}</span>
      {icon && <span className="sparkle">{icon}</span>}
      <span className="spark"></span>
    </button>
  );
};

interface ProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskName: string;
}

const ProcessingModal = ({ isOpen, onClose, taskName }: ProcessingModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-primary/20 rounded-xl p-6 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Processing {taskName}</h3>
          
          {/* Browser Loader Animation */}
          <div className="main-container">
            <div className="loader">
              <svg id="browser" viewBox="0 0 200 140">
                {/* Grid background */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path className="grid-line" d="M 10 0 L 0 0 0 10" />
                  </pattern>
                  <linearGradient id="traceGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff0055" />
                    <stop offset="100%" stopColor="#ff00cc" />
                  </linearGradient>
                  <linearGradient id="traceGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00ccff" />
                    <stop offset="100%" stopColor="#0066ff" />
                  </linearGradient>
                  <linearGradient id="traceGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00ff99" />
                    <stop offset="100%" stopColor="#00cc66" />
                  </linearGradient>
                  <linearGradient id="traceGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffcc00" />
                    <stop offset="100%" stopColor="#ff9900" />
                  </linearGradient>
                </defs>
                
                {/* Browser frame */}
                <rect x="10" y="10" width="180" height="120" rx="8" className="browser-frame" />
                <rect x="10" y="10" width="180" height="20" className="browser-top" />
                
                {/* Loading text */}
                <text x="100" y="25" textAnchor="middle" className="loading-text">
                  {taskName} in progress...
                </text>
                
                {/* Content area with grid */}
                <rect x="20" y="35" width="160" height="85" fill="url(#grid)" />
                
                {/* Skeleton elements */}
                <rect x="30" y="45" width="140" height="15" className="skeleton" />
                <rect x="30" y="65" width="100" height="10" className="skeleton" />
                <rect x="30" y="80" width="120" height="10" className="skeleton" />
                <rect x="30" y="95" width="80" height="10" className="skeleton" />
                
                {/* Animated trace flows */}
                <path className="trace-flow" d="M 30 50 Q 60 40, 90 50 T 150 50" />
                <path className="trace-flow" d="M 30 70 Q 70 60, 110 70 T 170 70" />
                <path className="trace-flow" d="M 30 90 Q 80 80, 130 90 T 170 90" />
                <path className="trace-flow" d="M 30 110 Q 90 100, 150 110 T 170 110" />
              </svg>
            </div>
          </div>
          
          <p className="mt-6 text-muted-foreground">
            Our AI is working on your {taskName.toLowerCase()}. This may take a few moments...
          </p>
          
          <Button 
            onClick={onClose}
            className="mt-6 bg-primary hover:bg-primary/90"
          >
            Cancel Processing
          </Button>
        </div>
      </div>
    </div>
  );
};

export { SparkleButton, ProcessingModal };