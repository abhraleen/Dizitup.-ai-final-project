import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Download, Zap } from "lucide-react";

const VideoEditingInterface = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);

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

  const startProcessing = () => {
    if (completed) {
      resetProcessing();
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
  };

  const downloadVideo = () => {
    // This will be connected to the actual API later
    alert("Video download would start here. In a real implementation, this would connect to the Dizitup AI API.");
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
            {/* Animation Container */}
            <div className="relative h-96 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/20 border border-primary/20 overflow-hidden">
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
                    Ready to process your video
                  </div>
                )}
                
                {isProcessing && (
                  <div className="text-primary font-medium">
                    AI is editing your video...
                  </div>
                )}
                
                {completed && (
                  <div className="text-green-500 font-medium">
                    Video editing complete!
                  </div>
                )}
              </div>
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
                      Start AI Editing
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
                    Edit Another Video
                  </Button>
                </>
              )}
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground">AI-Powered</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Advanced algorithms for automatic editing
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="inline-block animate-bounce">
                  <Play className="h-8 w-8 text-primary mx-auto mb-2" />
                </div>
                <h3 className="font-semibold text-foreground">Real-time Preview</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Watch the editing process as it happens
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                <Download className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground">Instant Download</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get your edited video in minutes
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