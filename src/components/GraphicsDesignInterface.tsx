import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Zap, Sparkles, Key, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GraphicsDesignInterface = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  const [imagePrompt, setImagePrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('dizitup_huggingface_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter your HuggingFace API key to generate images.",
        variant: "destructive",
      });
      setShowApiKeyInput(true);
    }
  }, []);

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

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('dizitup_huggingface_api_key', newKey);
    toast({
      title: "API Key Updated",
      description: "Your HuggingFace API key has been saved.",
    });
  };

  // Real HuggingFace API Integration - IMAGE GENERATION
  const callHuggingFaceAPI = async (prompt: string): Promise<boolean> => {
    setIsApiLoading(true);
    try {
      toast({
        title: "Connecting to AI",
        description: "Generating image... This may take 30-60 seconds for first request.",
      });

      // Use Stable Diffusion XL for image generation
      const model = 'stabilityai/stable-diffusion-xl-base-1.0';
      const endpoint = `https://api-inference.huggingface.co/models/${model}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HuggingFace API Error:', response.status, errorText);
        
        if (response.status === 404) {
          throw new Error(`Model not found. The model may be loading. Please wait 30 seconds and try again.`);
        } else if (response.status === 503) {
          throw new Error(`Model is loading. Please wait 60-120 seconds and try again.`);
        } else if (response.status === 401) {
          throw new Error(`Invalid API key. Please check your HuggingFace token.`);
        } else {
          throw new Error(`API Error ${response.status}: ${errorText}`);
        }
      }

      // Get the image blob
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Received empty response from API. Model may still be loading.');
      }
      
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImageUrl(imageUrl);
      
      toast({
        title: "Image Generated!",
        description: "Your AI-generated image is ready!",
      });

      setIsApiLoading(false);
      return true;
    } catch (error) {
      console.error('HuggingFace API Error:', error);
      setIsApiLoading(false);
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "Failed to generate image. Check console for details.",
        variant: "destructive",
      });
      return false;
    }
  };

  const startProcessing = async () => {
    if (!apiKey || apiKey.trim() === '') {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your HuggingFace API key to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!imagePrompt.trim()) {
      toast({
        title: "No Prompt",
        description: "Please describe the image you want to create.",
        variant: "destructive",
      });
      return;
    }
    
    if (completed) {
      resetProcessing();
    }

    // Reset generated content
    setGeneratedImageUrl(null);

    // Call HuggingFace API for image generation
    const apiSuccess = await callHuggingFaceAPI(imagePrompt);
    
    if (!apiSuccess) {
      return;
    }

    setIsProcessing(true);
    setCompleted(false);
  };

  const resetProcessing = () => {
    setIsProcessing(false);
    setProgress(0);
    setCompleted(false);
    setImagePrompt("");
    setGeneratedImageUrl(null);
  };

  const downloadImage = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
      link.download = `dizitup-ai-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your AI-generated image is being downloaded.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Primary gradient with cinematic animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/20 to-black animate-gradient-move"></div>
        
        {/* Secondary overlay gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.1)_0%,rgba(0,0,0,0)_70%)] animate-pulse-slow"></div>
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.1)_0%,transparent_40%)] animate-float-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(153,27,27,0.1)_0%,transparent_40%)] animate-float-2"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,rgba(220,38,38,0.05)_0%,transparent_40%)] animate-float-3"></div>
        </div>
        
        {/* Floating particles with enhanced animation */}
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

      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <Card className="bg-black/80 backdrop-blur-sm border-red-500/30 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl font-display text-red-400 glitch-text">
              AI-Powered Graphics Design
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-gray-300">
              Create stunning images with AI from text descriptions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* API Key Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-red-400" />
                  <Label className="text-sm font-medium text-gray-200">HuggingFace API Key (Free)</Label>
                  {apiKey && (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                      Connected
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  {showApiKeyInput ? "Hide" : "Change Key"}
                </Button>
              </div>

              {showApiKeyInput && (
                <div className="space-y-3 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                  <div className="space-y-2">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="Enter your HuggingFace API key"
                      className="font-mono text-sm bg-black/50 border-red-500/30 text-white focus:border-red-500 focus:ring-red-500"
                    />
                    <p className="text-xs text-gray-400">
                      Get your free API key from{" "}
                      <a 
                        href="https://huggingface.co/settings/tokens" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-red-400 hover:underline"
                      >
                        HuggingFace
                      </a>
                      . Your key is stored locally and never sent to our servers.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Generation Section */}
            <div className="space-y-6 mt-6">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">AI Image Generation</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Describe the image you want and our AI will generate it from scratch using Stable Diffusion XL.
                    </p>
                    
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-xs text-red-300">
                        💡 Tip: Be specific with details like style, colors, mood, and composition for best results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="image-prompt" className="text-lg font-semibold text-white">
                  Describe Your Image
                </Label>
                <Textarea
                  id="image-prompt"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Example: A modern minimalist logo for a tech startup, featuring geometric shapes in blue and silver, clean lines, professional, on white background"
                  className="min-h-[150px] bg-black/50 border-red-500/30 text-white focus:border-red-500 focus:ring-red-500 placeholder:text-gray-500"
                />
                <div className="bg-red-900/20 rounded-lg p-4 space-y-2 border border-red-500/30">
                  <p className="text-sm font-medium text-white">💡 Tips for better results:</p>
                  <ul className="text-sm text-gray-300 space-y-1 ml-4">
                    <li>• Specify art style (e.g., "photorealistic", "watercolor", "3D render", "minimalist")</li>
                    <li>• Describe colors and mood (e.g., "vibrant colors", "dark and moody", "pastel tones")</li>
                    <li>• Include composition details (e.g., "centered", "close-up", "wide angle")</li>
                    <li>• Mention quality keywords (e.g., "high detail", "professional", "sharp focus")</li>
                    <li>• Specify background if needed (e.g., "white background", "blurred cityscape")</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Animation Container */}
            <div className="relative h-96 rounded-xl bg-gradient-to-br from-red-900/30 to-black border border-red-500/30 overflow-hidden">
              {/* Show generated image if available */}
              {generatedImageUrl ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="max-w-full max-h-full">
                    <img 
                      src={generatedImageUrl} 
                      alt="AI Generated"
                      className="max-w-full max-h-full rounded-lg shadow-2xl border-2 border-red-500 object-contain"
                    />
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
                      {/* Outer ring */}
                      <div
                        className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-spin"
                        style={{ animationDuration: "8s" }}
                      />
                      
                      {/* Middle ring */}
                      <div
                        className="absolute inset-2 rounded-full border-4 border-red-500/50 animate-spin"
                        style={{ animationDirection: "reverse", animationDuration: "6s" }}
                      />
                      
                      {/* Inner ring */}
                      <div
                        className="absolute inset-4 rounded-full border-4 border-red-500 animate-spin"
                        style={{ animationDuration: "4s" }}
                      />
                      
                      {/* Pulsing center */}
                      <div
                        className="absolute inset-8 rounded-full bg-red-500 flex items-center justify-center animate-pulse"
                        style={{ animationDuration: "2s" }}
                      >
                        <ImageIcon className="h-8 w-8 text-red-50" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Visualization */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>AI Processing</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Status Messages */}
                  <div className="absolute top-6 left-6 right-6 text-center">
                    {!isProcessing && !completed && (
                      <div className="text-red-300 font-medium">
                        Ready to generate your AI image
                      </div>
                    )}
                    
                    {isProcessing && (
                      <div className="text-red-300 font-medium">
                        AI is generating your image...
                      </div>
                    )}
                    
                    {completed && (
                      <div className="text-green-500 font-medium">
                        AI image generation complete!
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!completed ? (
                <Button 
                  onClick={startProcessing}
                  disabled={isApiLoading}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 border border-red-500/50"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isApiLoading ? "Generating..." : "Generate Image"}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={downloadImage}
                    className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 border border-green-500/50"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Image
                  </Button>
                  <Button 
                    onClick={resetProcessing}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20 px-6 py-3 rounded-full border"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create New Image
                  </Button>
                </>
              )}
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                <Sparkles className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">AI Generation</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Create images from text descriptions
                </p>
              </div>
              <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                <Zap className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Fast Processing</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Get results in 30-60 seconds
                </p>
              </div>
              <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                <Download className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">High Quality</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Download in PNG format
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes gradient-move {
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
        
        .animate-gradient-move {
          background: linear-gradient(-45deg, #000000, #7f1d1d, #000000, #b91c1c, #000000);
          background-size: 400% 400%;
          animation: gradient-move 15s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-float-1 {
          animation: float-1 12s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 15s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 18s ease-in-out infinite;
        }
        
        .animate-pulse-particle {
          animation: pulse-particle 4s ease-in-out infinite;
        }
        
        .animate-grid-move {
          animation: grid-move 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GraphicsDesignInterface;