import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Zap, Cpu, Brain, ArrowRight, BarChart3, Palette, Film, Globe, Smartphone, Target, Code, Wrench, Sparkles, CreditCard, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SparkleButton, ProcessingModal } from "@/components/SparkleButton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const AIDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [processingTask, setProcessingTask] = useState<string | null>(null);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    // Add a slight delay to ensure smooth transition from welcome animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Load API keys from localStorage if available
    const savedApiKeys = localStorage.getItem('dizitup_api_keys');
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleAITask = async (taskName: string, serviceType: string) => {
    setProcessingTask(taskName);
    setIsProcessingModalOpen(true);
    
    // Check if we have an API key for this service
    const apiKey = apiKeys[serviceType];
    if (!apiKey) {
      // Show API key setup modal
      setTimeout(() => {
        setIsProcessingModalOpen(false);
        toast({
          title: "API Key Required",
          description: `Please set up your API key for ${taskName} in the settings.`,
          variant: "destructive"
        });
      }, 2000);
      return;
    }
    
    // Simulate API call processing for 5 seconds
    setTimeout(() => {
      setIsProcessingModalOpen(false);
      toast({
        title: "AI Task Completed!",
        description: `Your ${taskName.toLowerCase()} request has been processed successfully by our AI.`,
      });
    }, 5000);
  };

  const services = [
    {
      icon: Film,
      title: "AI Video Editing",
      description: "Automated video editing with smart scene detection and enhancement",
      delay: 100,
      task: "Video Editing",
      serviceType: "video",
      iconComponent: <Film className="w-5 h-5" />
    },
    {
      icon: Palette,
      title: "Creative Design",
      description: "AI-generated graphics, logos, and marketing materials",
      delay: 200,
      task: "Design Creation",
      serviceType: "design",
      iconComponent: <Palette className="w-5 h-5" />
    },
    {
      icon: Globe,
      title: "Website Development",
      description: "Intelligent website creation with optimized UX/UI",
      delay: 300,
      task: "Website Building",
      serviceType: "website",
      iconComponent: <Code className="w-5 h-5" />
    },
    {
      icon: Smartphone,
      title: "App Development",
      description: "AI-assisted mobile app creation and deployment",
      delay: 400,
      task: "App Development",
      serviceType: "app",
      iconComponent: <Smartphone className="w-5 h-5" />
    },
    {
      icon: Brain,
      title: "Workflow Automation",
      description: "Smart automation solutions for business processes",
      delay: 500,
      task: "Workflow Automation",
      serviceType: "automation",
      iconComponent: <Wrench className="w-5 h-5" />
    },
    {
      icon: Target,
      title: "Digital Strategy",
      description: "Data-driven marketing and growth strategies",
      delay: 600,
      task: "Strategy Planning",
      serviceType: "strategy",
      iconComponent: <BarChart3 className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Enhanced Dynamic Gradient Background */}
      <div className="fixed inset-0 z-0">
        {/* Primary gradient with enhanced animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/30 to-black animate-gradient-move-slow"></div>
        
        {/* Secondary overlay gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.15)_0%,rgba(0,0,0,0)_70%)] animate-pulse-slow"></div>
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.1)_0%,transparent_40%)] animate-float-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(153,27,27,0.1)_0%,transparent_40%)] animate-float-2"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,rgba(220,38,38,0.05)_0%,transparent_40%)] animate-float-3"></div>
        </div>
        
        {/* Floating particles with enhanced animation */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-red-500/30 animate-pulse-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay with enhanced effect */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(185,28,28,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(185,28,28,0.15)_1px,transparent_1px)] bg-[size:30px_30px] animate-grid-move"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        {/* Enhanced Header with better navigation */}
        <div 
          className={`flex justify-between items-center mb-12 sm:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent tracking-wider">
            dizitup<span className="font-light">.ai</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="nav-link">Services</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#portfolio" className="nav-link">Portfolio</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button 
                onClick={() => navigate("/dashboard")}
                variant="outline" 
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 nav-button flex items-center"
              >
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            ) : (
              <Button 
                onClick={() => navigate("/admin/login")}
                variant="outline" 
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 nav-button"
              >
                Login
              </Button>
            )}
            <Button 
              onClick={() => navigate("/")}
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 nav-button"
            >
              Classic Version
            </Button>
          </div>
        </div>

        {/* Enhanced Hero Section with staggered animations */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
          <div 
            className={`mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-red-500/15 border border-red-500/40 backdrop-blur-sm nav-glow">
              <Zap className="h-5 w-5 text-red-400 mr-3 animate-pulse-glow" />
              <span className="text-red-300 text-base font-medium tracking-wide">AI-Powered Digital Solutions</span>
            </div>
          </div>

          <h1 
            className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-red-300 bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '500ms' }}
          >
            Welcome to the
            <span className="block mt-2 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent animate-text-glow">
              Future of Digital
            </span>
          </h1>

          <p 
            className={`text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '700ms' }}
          >
            Experience the power of AI-driven digital solutions that transform your business with 
            <span className="text-red-400 font-medium"> cutting-edge automation</span>, 
            <span className="text-red-400 font-medium"> creative design</span>, and 
            <span className="text-red-400 font-medium"> intelligent workflows</span>.
          </p>

          <div 
            className={`flex flex-col sm:flex-row gap-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '900ms' }}
          >
            <SparkleButton
              onClick={() => handleAITask("Video Editing", "video")}
              icon={<Play className="w-5 h-5" />}
              className="px-8 py-6 text-xl"
            >
              Start AI Editing
            </SparkleButton>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-8 py-6 text-xl rounded-full nav-button"
              onClick={() => navigate("/pricing")}
            >
              <CreditCard className="mr-3 h-6 w-6" />
              View Pricing
            </Button>
          </div>
        </div>

        {/* Services Section */}
        <section id="services" className="mb-24">
          <div 
            className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '1100ms' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              AI-Powered Services
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover how our artificial intelligence can transform your digital presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-500 group hover:transform hover:scale-105 nav-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${1300 + service.delay}ms` }}
              >
                <div className="bg-red-500/15 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-red-500/25 transition-colors nav-icon-bg">
                  <service.icon className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <SparkleButton
                  onClick={() => handleAITask(service.task, service.serviceType)}
                  icon={service.iconComponent}
                  className="w-full"
                >
                  Start {service.task}
                </SparkleButton>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "1000+", label: "Projects Completed" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "50%", label: "Time Saved" },
              { value: "24/7", label: "AI Availability" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`text-center p-8 bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl nav-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${2000 + index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-red-500 mb-3 animate-count-up">{stat.value}</div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-24">
          <div 
            className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '2500ms' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              Advanced AI Capabilities
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Cutting-edge technology powering our digital solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div 
              className={`bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-10 nav-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '2700ms' }}
            >
              <div className="flex items-start mb-8">
                <Brain className="h-10 w-10 text-red-500 mr-6 flex-shrink-0 nav-icon" />
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Machine Learning Algorithms</h3>
                  <p className="text-gray-400 text-lg">
                    Our AI continuously learns from industry trends and client feedback to deliver increasingly effective solutions.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <BarChart3 className="h-10 w-10 text-red-500 mr-6 flex-shrink-0 nav-icon" />
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Data Analytics</h3>
                  <p className="text-gray-400 text-lg">
                    Real-time insights and performance metrics to optimize your digital strategy.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-10 nav-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '2900ms' }}
            >
              <div className="space-y-8">
                <div>
                  <h4 className="text-2xl font-bold mb-4 text-red-400">Natural Language Processing</h4>
                  <p className="text-gray-400 text-lg">
                    Advanced text generation and analysis for compelling content creation.
                  </p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-4 text-red-400">Computer Vision</h4>
                  <p className="text-gray-400 text-lg">
                    Intelligent image and video processing for stunning visual content.
                  </p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-4 text-red-400">Predictive Modeling</h4>
                  <p className="text-gray-400 text-lg">
                    Forecasting tools to anticipate market trends and customer behavior.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20 mb-16">
          <div 
            className={`bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/40 rounded-3xl p-12 sm:p-16 backdrop-blur-xl nav-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '3100ms' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Business?
            </h2>
            <p className="text-gray-300 text-xl mb-10 max-w-3xl mx-auto">
              Join thousands of businesses already leveraging our AI-powered solutions to drive growth and innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <SparkleButton
                onClick={() => handleAITask("Project Creation", "general")}
                icon={<Zap className="w-5 h-5" />}
                className="px-10 py-7 text-xl"
              >
                Get Started Today
              </SparkleButton>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-10 py-7 text-xl rounded-full nav-button"
                onClick={() => {
                  const event = new CustomEvent('openChatbot');
                  window.dispatchEvent(event);
                }}
              >
                Chat with Dizi
              </Button>
            </div>
          </div>
        </section>

        {/* Floating AI Elements with enhanced animation */}
        <div className="absolute top-1/4 left-10 w-6 h-6 bg-red-500 rounded-full animate-ping-glow"></div>
        <div className="absolute top-1/3 right-20 w-8 h-8 bg-red-500/60 rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-red-400 rounded-full animate-bounce-glow"></div>
      </div>

      {/* Processing Modal */}
      <ProcessingModal 
        isOpen={isProcessingModalOpen}
        onClose={() => setIsProcessingModalOpen(false)}
        taskName={processingTask || ""}
      />

      {/* Custom Styles */}
      <style>{`
        @keyframes gradient-move-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse-slow {
          0% { opacity: 0.15; }
          50% { opacity: 0.25; }
          100% { opacity: 0.15; }
        }
        
        @keyframes float-1 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-2 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-30px, -10px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-3 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, -30px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes pulse-particle {
          0% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.5); }
          100% { opacity: 0.2; transform: scale(1); }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
        
        @keyframes pulse-glow {
          0% { opacity: 0.6; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
          50% { opacity: 1; box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); }
          100% { opacity: 0.6; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
        }
        
        @keyframes ping-glow {
          0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          75%, 100% { transform: scale(2); opacity: 0; box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
        }
        
        @keyframes bounce-glow {
          0%, 100% { transform: translateY(0); box-shadow: 0 0 10px rgba(248, 113, 113, 0.5); }
          50% { transform: translateY(-20px); box-shadow: 0 0 20px rgba(248, 113, 113, 0.8); }
        }
        
        @keyframes text-glow {
          0% { text-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
          50% { text-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.6); }
          100% { text-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
        }
        
        @keyframes count-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-gradient-move-slow {
          background: linear-gradient(-45deg, #000000, #7f1d1d, #000000, #b91c1c, #000000);
          background-size: 600% 600%;
          animation: gradient-move-slow 20s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-float-1 {
          animation: float-1 15s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 18s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 20s ease-in-out infinite;
        }
        
        .animate-pulse-particle {
          animation: pulse-particle 3s ease-in-out infinite;
        }
        
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-ping-glow {
          animation: ping-glow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-bounce-glow {
          animation: bounce-glow 3s ease-in-out infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        
        .animate-count-up {
          animation: count-up 1s ease-out;
        }
        
        /* Enhanced Navigation Styles */
        .nav-link {
          position: relative;
          color: #9ca3af;
          font-weight: 500;
          padding: 0.5rem 0;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          color: #f87171;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ef4444, #f87171);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-button {
          transition: all 0.3s ease;
          border-radius: 50px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        
        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        }
        
        .nav-glow {
          transition: all 0.3s ease;
        }
        
        .nav-glow:hover {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
        }
        
        .nav-card {
          transition: all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .nav-card:hover {
          box-shadow: 0 20px 40px rgba(239, 68, 68, 0.2);
        }
        
        .nav-icon {
          transition: all 0.3s ease;
        }
        
        .nav-card:hover .nav-icon {
          transform: scale(1.1);
        }
        
        .nav-icon-bg {
          transition: all 0.3s ease;
        }
        
        .nav-card:hover .nav-icon-bg {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AIDashboard;