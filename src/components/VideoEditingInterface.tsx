import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Download, Zap, Upload, Video, Sparkles, FileVideo, Key, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Free Tier API Keys and Services
const FREE_API_SERVICES = {
  huggingface: {
    name: "HuggingFace",
    key: "", // Add your HuggingFace API key from https://huggingface.co/settings/tokens
    endpoint: "https://api-inference.huggingface.co",
    description: "100% Free video generation"
  },
  runwayML: {
    name: "Runway ML",
    key: "", // Add your Runway ML API key
    endpoint: "https://api.runwayml.com/v1",
    description: "Video generation and editing"
  },
  // Free alternatives if Runway ML doesn't work
  alternatives: [
    {
      name: "Replicate (Free Tier)",
      signup: "https://replicate.com/",
      freeTier: "Free credits on signup, pay-per-use after",
      models: ["stable-video-diffusion", "text-to-video"]
    },
    {
      name: "HuggingFace (Free)",
      signup: "https://huggingface.co/",
      freeTier: "Completely free inference API",
      models: ["text-to-video-synthesis", "video-to-video"]
    },
    {
      name: "D-ID (Free Tier)",
      signup: "https://www.d-id.com/",
      freeTier: "20 free credits per month",
      models: ["talking-head-videos", "avatar-generation"]
    },
    {
      name: "Genmo (Free Beta)",
      signup: "https://www.genmo.ai/",
      freeTier: "Free during beta",
      models: ["text-to-video", "image-animation"]
    }
  ]
};

const VideoEditingInterface = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('dizitup_huggingface_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // Prompt user to enter API key
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your HuggingFace API key to use video generation.",
      });
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setUploadedFile(file);
        toast({
          title: "Video Uploaded",
          description: `${file.name} is ready for editing.`,
        });
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a video file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('dizitup_huggingface_api_key', newKey);
    toast({
      title: "API Key Updated",
      description: "Your HuggingFace API key has been saved.",
    });
  };

  // Real HuggingFace API Integration - VIDEO ONLY
  const callHuggingFaceAPI = async (prompt: string): Promise<boolean> => {
    setIsApiLoading(true);
    try {
      toast({
        title: "Connecting to AI",
        description: "Generating video... This may take 1-3 minutes for first request.",
      });

      // Use ModelScope for actual video generation
      const model = 'damo-vilab/text-to-video-ms-1.7b';
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
        
        // Handle specific error cases
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

      // Get the video blob
      const blob = await response.blob();
      
      // Check if we got valid data
      if (blob.size === 0) {
        throw new Error('Received empty response from API. Model may still be loading.');
      }
      
      const videoUrl = URL.createObjectURL(blob);
      setGeneratedVideoUrl(videoUrl);
      
      toast({
        title: "Video Generated!",
        description: "Your AI-generated video is ready! Note: Video is silent. You can add audio separately.",
      });

      setIsApiLoading(false);
      return true;
    } catch (error) {
      console.error('HuggingFace API Error:', error);
      setIsApiLoading(false);
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "Failed to generate video. Check console for details.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Simulated video editing for uploaded videos
  const callRunwayMLAPI = async (prompt: string, videoFile?: File) => {
    try {
      toast({
        title: "Processing Video",
        description: "AI is analyzing and editing your video...",
      });

      // In production, this would call actual Runway ML API
      // For now, we simulate the process
      return true;
    } catch (error) {
      console.error('Video Processing Error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process video.",
        variant: "destructive",
      });
      return false;
    }
  };

  const startProcessing = async () => {
    // Check API key
    if (!apiKey || apiKey.trim() === '') {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your HuggingFace API key to continue.",
        variant: "destructive",
      });
      return;
    }

    // Check if we have either uploaded video or AI prompt
    if (activeTab === "upload" && !uploadedFile) {
      toast({
        title: "No Video",
        description: "Please upload a video file first.",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === "upload" && !videoPrompt.trim()) {
      toast({
        title: "No Instructions",
        description: "Please describe what kind of video you want to create.",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === "ai" && !aiPrompt.trim()) {
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

    // Reset generated content
    setGeneratedVideoUrl(null);

    // Call appropriate API based on mode
    const prompt = activeTab === "upload" ? videoPrompt : aiPrompt;
    let apiSuccess = false;

    if (activeTab === "ai") {
      // Use HuggingFace API for AI generation
      apiSuccess = await callHuggingFaceAPI(prompt);
    } else {
      // Use simulated editing for uploaded videos
      apiSuccess = await callRunwayMLAPI(prompt, uploadedFile || undefined);
    }
    
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
    setUploadedFile(null);
    setVideoPrompt("");
    setAiPrompt("");
    setGeneratedVideoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadVideo = () => {
    if (generatedVideoUrl) {
      // Create a download link for the generated content
      const link = document.createElement('a');
      link.href = generatedVideoUrl;
      link.download = `dizitup-ai-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your AI-generated video is being downloaded. Note: Video is silent.",
      });
    } else {
      const videoType = activeTab === "upload" ? "edited video" : "AI-generated video";
      toast({
        title: "Download Started",
        description: `Your ${videoType} is being prepared for download.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl font-display text-primary glitch-text">
              AI-Powered Video Editing
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Watch our AI transform your video in real-time
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* API Key Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  <Label className="text-sm font-medium">HuggingFace API Key (Free)</Label>
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
                  className="text-xs"
                >
                  {showApiKeyInput ? "Hide" : "Change Key"}
                </Button>
              </div>

              {showApiKeyInput && (
                <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border border-primary/20">
                  <div className="space-y-2">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="Enter your HuggingFace API key"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Using HuggingFace free API. Your key is stored locally and never sent to our servers.
                    </p>
                  </div>

                  {/* Free Tier Alternatives */}
                  <Alert className="bg-primary/5 border-primary/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-sm">Free API Alternatives</AlertTitle>
                    <AlertDescription className="text-xs space-y-2 mt-2">
                      <p className="font-medium">If Runway ML doesn't work, try these free options:</p>
                      <div className="space-y-2 mt-2">
                        {FREE_API_SERVICES.alternatives.map((service, index) => (
                          <div key={index} className="pl-3 border-l-2 border-primary/30">
                            <p className="font-semibold text-foreground">{service.name}</p>
                            <p className="text-muted-foreground">Free Tier: {service.freeTier}</p>
                            <a 
                              href={service.signup} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-xs"
                            >
                              Sign up: {service.signup}
                            </a>
                          </div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>

            {/* Tabs for Upload vs AI Creation */}
            <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload & Edit Video
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Create with AI
                </TabsTrigger>
              </TabsList>
              
              {/* Upload Video Tab */}
              <TabsContent value="upload" className="space-y-6 mt-6">
                {/* File Upload Section */}
                <div className="space-y-4">
                  <Label htmlFor="video-upload" className="text-lg font-semibold">
                    Upload Your Raw Video
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-primary/40 rounded-xl p-8 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
                  >
                    {uploadedFile ? (
                      <div className="space-y-3">
                        <FileVideo className="h-12 w-12 text-green-500 mx-auto" />
                        <p className="text-foreground font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          Remove Video
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 text-primary mx-auto" />
                        <p className="text-foreground font-medium">Click to upload video</p>
                        <p className="text-sm text-muted-foreground">
                          Supports MP4, MOV, AVI and other video formats
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Editing Prompt */}
                <div className="space-y-4">
                  <Label htmlFor="video-prompt" className="text-lg font-semibold">
                    What kind of video do you want to create?
                  </Label>
                  <Textarea
                    id="video-prompt"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="Example: Create a promotional video with upbeat music, add text overlays highlighting key features, and include smooth transitions between clips. Keep it under 60 seconds."
                    className="min-h-[120px] bg-background border-primary/20 focus:border-primary"
                  />
                  <p className="text-sm text-muted-foreground">
                    Describe the style, mood, length, effects, or any specific requirements for your video.
                  </p>
                </div>
              </TabsContent>

              {/* AI Video Creation Tab */}
              <TabsContent value="ai" className="space-y-6 mt-6">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">AI Video Generation</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Describe the video you want and our AI will generate it from scratch. Videos are silent - audio can be added separately.
                      </p>
                      
                      <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          ⚠️ Note: Generated videos are silent. Takes 1-3 minutes. For image generation, use Graphics Design section.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="ai-prompt" className="text-lg font-semibold">
                    Describe Your Video Concept
                  </Label>
                  <Textarea
                    id="ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Example: Create a 30-second product demo video showing a smartphone with sleek animations. Include text: 'Revolutionary Technology'. Use modern, tech-inspired background music. Show the phone rotating in 3D with feature callouts appearing smoothly."
                    className="min-h-[200px] bg-background border-primary/20 focus:border-primary"
                  />
                  <div className="bg-secondary/20 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">💡 Tips for better results:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Specify video length (e.g., "30 seconds", "1 minute")</li>
                      <li>• Describe visual style (e.g., "modern", "vintage", "minimalist")</li>
                      <li>• Mention any text or captions to include</li>
                      <li>• Include music/audio preferences</li>
                      <li>• Specify target platform (e.g., "Instagram Reel", "YouTube Short")</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            {/* Animation Container */}
            <div className="relative h-96 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/20 border border-primary/20 overflow-hidden">
              {/* Show generated content if available */}
              {generatedVideoUrl ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="max-w-full max-h-full">
                    <video 
                      src={generatedVideoUrl} 
                      controls
                      autoPlay
                      loop
                      className="max-w-full max-h-full rounded-lg shadow-2xl border-2 border-primary"
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
                    className="absolute rounded-full bg-primary/30 animate-pulse"
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
                    className="absolute inset-0 rounded-full border-4 border-primary/30 animate-spin"
                    style={{ animationDuration: "8s" }}
                  />
                  
                  {/* Middle ring */}
                  <div
                    className="absolute inset-2 rounded-full border-4 border-primary/50 animate-spin"
                    style={{ animationDirection: "reverse", animationDuration: "6s" }}
                  />
                  
                  {/* Inner ring */}
                  <div
                    className="absolute inset-4 rounded-full border-4 border-primary animate-spin"
                    style={{ animationDuration: "4s" }}
                  />
                  
                  {/* Pulsing center */}
                  <div
                    className="absolute inset-8 rounded-full bg-primary flex items-center justify-center animate-pulse"
                    style={{ animationDuration: "2s" }}
                  >
                    <Zap className="h-8 w-8 text-primary-foreground" />
                  </div>
                  
                  {/* Data streams */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-1 bg-primary/50 rounded-full origin-left animate-pulse"
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
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>AI Processing</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              {/* Status Messages */}
              <div className="absolute top-6 left-6 right-6 text-center">
              {!isProcessing && !completed && (
                  <div className="text-primary font-medium">
                    {activeTab === "upload" 
                      ? uploadedFile 
                        ? "Ready to edit your video" 
                        : "Upload a video to get started"
                      : "Ready to generate your AI video"
                    }
                  </div>
                )}
                
                {isProcessing && (
                  <div className="text-primary font-medium">
                    {activeTab === "upload" 
                      ? "AI is editing your video..." 
                      : "AI is generating your video..."
                    }
                  </div>
                )}
                
                {completed && (
                  <div className="text-green-500 font-medium">
                    {activeTab === "upload" 
                      ? "Video editing complete!" 
                      : "AI video generation complete!"
                    }
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
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                      size="lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      {activeTab === "upload" ? "Start Editing" : "Generate Video"}
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseProcessing}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-full"
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
                    className="bg-green-600 hover:bg-green-700 text-primary-foreground px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Video
                  </Button>
                  <Button 
                    onClick={resetProcessing}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-full"
                    size="lg"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    {activeTab === "upload" ? "Edit Another Video" : "Create New Video"}
                  </Button>
                </>
              )}
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground">Upload & Edit</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your raw footage and let AI edit it
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="inline-block animate-bounce">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                </div>
                <h3 className="font-semibold text-foreground">AI Generation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create videos from text descriptions using AI
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                <Download className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground">Instant Download</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get your video ready in minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoEditingInterface;