import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Palette, 
  Film, 
  Globe, 
  Smartphone, 
  Brain, 
  Target, 
  Zap, 
  TrendingUp,
  Users,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  recommendations: string[];
  metrics: Array<{ label: string; value: string; change: string }>;
}

const BusinessAnalysisSlides = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Market Analysis",
      description: "AI-powered insights into your industry landscape and competitive positioning",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-red-600 to-red-800",
      recommendations: [
        "Expand into emerging market segments",
        "Optimize pricing strategy based on competitor analysis",
        "Leverage seasonal trends for maximum impact"
      ],
      metrics: [
        { label: "Market Growth", value: "12.4%", change: "+3.2%" },
        { label: "Competitive Position", value: "Top Tier", change: "+2 ranks" },
        { label: "Customer Sentiment", value: "87%", change: "+5%" }
      ]
    },
    {
      id: 2,
      title: "Creative Strategy",
      description: "Data-driven creative direction to maximize engagement and brand impact",
      icon: <Palette className="w-8 h-8" />,
      color: "from-purple-600 to-purple-800",
      recommendations: [
        "Adopt bold color schemes for higher engagement",
        "Implement micro-animations in digital assets",
        "Focus on authentic storytelling in campaigns"
      ],
      metrics: [
        { label: "Engagement Rate", value: "8.7%", change: "+2.1%" },
        { label: "Brand Recognition", value: "76%", change: "+8%" },
        { label: "Creative ROI", value: "342%", change: "+45%" }
      ]
    },
    {
      id: 3,
      title: "Content Optimization",
      description: "AI-enhanced content strategy for maximum reach and conversion",
      icon: <Film className="w-8 h-8" />,
      color: "from-blue-600 to-blue-800",
      recommendations: [
        "Increase video content by 40% for better engagement",
        "Optimize posting times based on audience activity",
        "Diversify content formats to include interactive elements"
      ],
      metrics: [
        { label: "Content Reach", value: "2.4M", change: "+1.2M" },
        { label: "Conversion Rate", value: "5.3%", change: "+1.7%" },
        { label: "Audience Growth", value: "42%", change: "+18%" }
      ]
    },
    {
      id: 4,
      title: "Digital Presence",
      description: "Comprehensive digital ecosystem optimization",
      icon: <Globe className="w-8 h-8" />,
      color: "from-green-600 to-green-800",
      recommendations: [
        "Implement progressive web app features",
        "Optimize for voice search and mobile-first indexing",
        "Integrate AI chatbots for 24/7 customer support"
      ],
      metrics: [
        { label: "Site Performance", value: "98/100", change: "+12 pts" },
        { label: "SEO Ranking", value: "Top 3", change: "↑ 5 positions" },
        { label: "Bounce Rate", value: "24%", change: "-16%" }
      ]
    },
    {
      id: 5,
      title: "Growth Strategy",
      description: "Predictive growth models and execution roadmap",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-yellow-600 to-yellow-800",
      recommendations: [
        "Deploy AI-driven personalization engines",
        "Establish strategic partnerships in adjacent markets",
        "Implement data-driven customer retention programs"
      ],
      metrics: [
        { label: "Projected Growth", value: "34%", change: "+12%" },
        { label: "Customer Lifetime", value: "$1,240", change: "+$320" },
        { label: "Market Share", value: "8.7%", change: "+2.3%" }
      ]
    }
  ];

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = dragStart - clientX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1);
      }
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          AI Business Analysis
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Interactive insights and recommendations powered by our advanced AI algorithms
        </p>
      </div>

      {/* Slide Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-red-500 w-8' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3D Slide Container */}
      <div 
        ref={containerRef}
        className="relative h-[600px] perspective-1000"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ 
              opacity: 0, 
              rotateY: 90,
              scale: 0.8
            }}
            animate={{ 
              opacity: 1, 
              rotateY: 0,
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              rotateY: -90,
              scale: 0.8
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="absolute inset-0"
          >
            <div className={`h-full bg-gradient-to-br ${slides[currentSlide].color} rounded-3xl shadow-2xl overflow-hidden`}>
              {/* Slide Content */}
              <div className="h-full flex flex-col md:flex-row">
                {/* Left Panel - Visual */}
                <div className="w-full md:w-2/5 p-8 flex flex-col justify-center items-center bg-black/20">
                  <div className="relative w-64 h-64 rounded-full bg-black/30 flex items-center justify-center mb-8">
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping-slow"></div>
                    <div className="absolute inset-4 rounded-full border-2 border-white/30"></div>
                    <div className="text-white z-10">
                      {slides[currentSlide].icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white text-center">
                    {slides[currentSlide].title}
                  </h3>
                </div>
                
                {/* Right Panel - Content */}
                <div className="w-full md:w-3/5 p-8 bg-black/40 backdrop-blur-xl">
                  <p className="text-gray-200 text-lg mb-8">
                    {slides[currentSlide].description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {slides[currentSlide].metrics.map((metric, index) => (
                      <div key={index} className="bg-white/10 rounded-xl p-4">
                        <p className="text-gray-300 text-sm mb-1">{metric.label}</p>
                        <p className="text-white text-xl font-bold">{metric.value}</p>
                        <p className="text-green-400 text-sm flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {metric.change}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                      AI Recommendations
                    </h4>
                    <ul className="space-y-3">
                      {slides[currentSlide].recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mt-1 w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-gray-200">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Controls */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="flex items-center px-6 py-3 bg-black/50 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Zap className="w-5 h-5 mr-2" />
          Previous
        </button>
        
        <div className="text-gray-400 self-center">
          {currentSlide + 1} of {slides.length}
        </div>
        
        <button
          onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
          <Zap className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center">
          <Rocket className="mr-2 h-5 w-5" />
          Activate AI Recommendations
        </button>
        <button className="px-8 py-4 border-2 border-red-500 text-red-400 rounded-full hover:bg-red-500/10 transition-all flex items-center justify-center">
          <Users className="mr-2 h-5 w-5" />
          Schedule Strategy Session
        </button>
      </div>

      {/* Custom Styles */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes ping-slow {
          0% { transform: scale(0.8); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default BusinessAnalysisSlides;