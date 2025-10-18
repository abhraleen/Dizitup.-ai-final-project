import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Download, Zap, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VideoEditingInterface = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  // Initialize particles for background animation
  useEffect(() => {
    const initialParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1
    }));
    setParticles(initialParticles);
  }, []);

  // Animation for processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing && !completed) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 3;
          if (newProgress >= 100) {
            clearInterval(interval);
            setCompleted(true);
            setIsProcessing(false);
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, completed]);

  // Backend API Integration
  const callBackendAPI = async (prompt: string): Promise<boolean> => {
    setIsApiLoading(true);
    
    try {
      toast({
        title: "Connecting to Backend",
        description: "Sending request to video generation server...",
      });

      const BACKEND_URL = 'http://localhost:3001';
      
      const response = await fetch(`${BACKEND_URL}/api/video/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend API Error:', response.status, errorData);
        
        if (response.status === 503 || response.status === 404) {
          // Model is sleeping or loading
          throw new Error(
            errorData.suggestion || 
            '🛌 Model is in sleep mode. Please wait 1-2 minutes and try again. Your first request is waking up the model!'
          );
        } else if (response.status === 401) {
          throw new Error('Backend authentication error. Please check server configuration.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a few minutes.');
        } else {
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }
      }

      const videoBlob = await response.blob();
      
      if (videoBlob.size === 0) {
        throw new Error('Received empty response from backend. Please try again.');
      }
      
      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoUrl);
      
      const generationTime = response.headers.get('X-Generation-Time') || 'unknown';
      const videoSize = response.headers.get('X-Video-Size') || 'unknown';
      
      toast({
        title: "Video Generated!",
        description: `Your AI video is ready! (${videoSize}, took ${generationTime})`,
      });

      setIsApiLoading(false);
      return true;

    } catch (error) {
      console.error('Backend API Error:', error);
      setIsApiLoading(false);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Backend Not Running",
          description: "Please start the backend server: cd server && npm start",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Video Generation Failed",
          description: error instanceof Error ? error.message : "Failed to generate video. Please try again.",
          variant: "destructive",
        });
      }
      
      return false;
    }
  };

  const startProcessing = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "No Prompt",
        description: "Please describe the video you want to create.",
        variant: "destructive",
      });
      return;
    }
    
    if (completed) {
      resetProcessing();
    }

    setGeneratedVideoUrl(null);

    const apiSuccess = await callBackendAPI(aiPrompt);
    
    if (!apiSuccess) {
      return;
    }

    setIsProcessing(true);
    setCompleted(false);
  };

  const pauseProcessing = () => {
    setIsProcessing(false);
  };

  const resetProcessing = () => {
    setIsProcessing(false);
    setProgress(0);
    setCompleted(false);
    setAiPrompt("");
    setGeneratedVideoUrl(null);
  };

  const downloadVideo = () => {
    if (generatedVideoUrl) {
      const link = document.createElement('a');
      link.href = generatedVideoUrl;
      link.download = `dizitup-ai-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your AI-generated video is being downloaded.",
      });
    } else {
      toast({
        title: "Download Started",
        description: "Your AI-generated video is being prepared for download.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden py-12 px-4 sm:px-6">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/20 to-black animate-gradient-move-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.1)_0%,rgba(0,0,0,0)_70%)] animate-pulse-slow"></div>
        
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.1)_0%,transparent_40%)] animate-float-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(153,27,27,0.1)_0%,transparent_40%)] animate-float-2"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,rgba(220,38,38,0.05)_0%,transparent_40%)] animate-float-3"></div>
        </div>
        
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-red-500/20 animate-pulse-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(185,28,28,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(185,28,28,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-move"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Card className="bg-black/60 backdrop-blur-xl border-red-500/30 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl font-display bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              AI-Powered Video Generation
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-gray-300">
              Create stunning videos from text descriptions using AI
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Backend Status Indicator */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white">Backend Server Connected</span>
                </div>
                <span className="text-xs text-gray-400">http://localhost:3001</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Using backend API for secure video generation. API token is managed server-side.
              </p>
            </div>

            {/* AI Video Generation Section */}
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">AI Video Generation</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Describe the video you want and our AI will generate it from scratch. Videos are silent - audio can be added separately.
                    </p>
                    
                    <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-xs text-yellow-400">
                        ⚠️ <strong>First-time users:</strong> Models sleep when inactive. Your first request wakes them up (takes 2-3 minutes). Subsequent requests are much faster!
                      </p>
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-xs text-blue-400">
                        💡 <strong>Pro tip:</strong> If you see "sleep mode" error, wait 2 minutes and click Generate again with the same prompt. The model is warming up!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="ai-prompt" className="text-lg font-semibold text-white">
                  Describe Your Video Concept
                </Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Example: A beautiful sunset over the ocean with waves crashing on the shore"
                  className="min-h-[150px] bg-black/40 border-red-500/30 focus:border-red-500 text-white placeholder:text-gray-500"
                />
                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-white">💡 Tips for better results:</p>
                  <ul className="text-sm text-gray-300 space-y-1 ml-4">
                    <li>• Keep descriptions concise and visual</li>
                    <li>• Describe the scene, lighting, and atmosphere</li>
                    <li>• Mention camera movements (e.g., "slow pan", "zoom in")</li>
                    <li>• Specify mood (e.g., "dramatic", "peaceful", "energetic")</li>
                    <li>• First request may take 2-3 minutes (model warm-up)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Animation Container */}
            <div className="relative h-96 rounded-xl bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 overflow-hidden">
              {generatedVideoUrl ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="max-w-full max-h-full">
                    <video 
                      src={generatedVideoUrl} 
                      controls
                      autoPlay
                      loop
                      className="max-w-full max-h-full rounded-lg shadow-2xl border-2 border-red-500"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              ) : (
                <>
                  {/* Animated Background Particles */}
                  <div className="absolute inset-0">
                    {particles.map((particle) => (
                      <div
                        key={particle.id}
                        className="absolute rounded-full bg-red-500/30 animate-pulse"
                        style={{
                          left: `${particle.x}%`,
                          top: `${particle.y}%`,
                          width: `${particle.size}px`,
                          height: `${particle.size}px`,
                          animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Central Processing Animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-spin" style={{ animationDuration: "8s" }} />
                      <div className="absolute inset-2 rounded-full border-4 border-red-500/50 animate-spin" style={{ animationDirection: "reverse", animationDuration: "6s" }} />
                      <div className="absolute inset-4 rounded-full border-4 border-red-500 animate-spin" style={{ animationDuration: "4s" }} />
                      <div className="absolute inset-8 rounded-full bg-red-500 flex items-center justify-center animate-pulse" style={{ animationDuration: "2s" }}>
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute h-1 bg-red-500/50 rounded-full origin-left animate-pulse"
                          style={{
                            width: `${30 + Math.random() * 40}px`,
                            top: `${20 + (i * 10)}%`,
                            left: "50%",
                            transformOrigin: "left center",
                            animationDuration: "2s",
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Progress Visualization */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>AI Processing</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-red-500/20">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Status Messages */}
                  <div className="absolute top-6 left-6 right-6 text-center">
                    {!isProcessing && !completed && (
                      <div className="text-red-400 font-medium text-lg">
                        Ready to generate your AI video
                      </div>
                    )}
                    
                    {isProcessing && (
                      <div className="text-red-400 font-medium text-lg">
                        AI is generating your video...
                      </div>
                    )}
                    
                    {completed && (
                      <div className="text-green-400 font-medium text-lg">
                        AI video generation complete!
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!completed ? (
                <>
                  {!isProcessing ? (
                    <Button 
                      onClick={startProcessing}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                      size="lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Generate Video
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseProcessing}
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-6 py-3 rounded-full"
                      size="lg"
                    >
                      <Pause className="mr-2 h-5 w-5" />
                      Pause Processing
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    onClick={downloadVideo}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Video
                  </Button>
                  <Button 
                    onClick={resetProcessing}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-6 py-3 rounded-full"
                    size="lg"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Create New Video
                  </Button>
                </>
              )}
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <Sparkles className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">AI Generation</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Create videos from text descriptions using AI
                </p>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="inline-block animate-bounce">
                  <Zap className="h-8 w-8 text-red-400 mx-auto mb-2" />
                </div>
                <h3 className="font-semibold text-white">Fast Processing</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Get your video ready in 1-3 minutes
                </p>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <Download className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Instant Download</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Download your AI-generated video instantly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes gradient-move-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse-slow {
          0% { opacity: 0.1; }
          50% { opacity: 0.2; }
          100% { opacity: 0.1; }
        }
        
        @keyframes float-1 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(15px, 15px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-2 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -10px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-3 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, -20px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes pulse-particle {
          0% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.5); }
          100% { opacity: 0.1; transform: scale(1); }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
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
      `}</style>
    </div>
  );
};

export default VideoEditingInterface;
