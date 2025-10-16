import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SparkleButton } from "@/components/SparkleButton";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    video: "",
    design: "",
    website: "",
    app: "",
    automation: "",
    strategy: "",
    general: ""
  });

  useEffect(() => {
    // Load API keys from localStorage
    const savedApiKeys = localStorage.getItem('dizitup_api_keys');
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }
  }, []);

  const handleApiKeyChange = (service: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [service]: value
    }));
  };

  const saveApiKeys = () => {
    localStorage.setItem('dizitup_api_keys', JSON.stringify(apiKeys));
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully.",
    });
  };

  const services = [
    { id: "video", name: "Video Editing API", placeholder: "Enter your video editing API key" },
    { id: "design", name: "Design API", placeholder: "Enter your design API key" },
    { id: "website", name: "Website Builder API", placeholder: "Enter your website builder API key" },
    { id: "app", name: "App Development API", placeholder: "Enter your app development API key" },
    { id: "automation", name: "Automation API", placeholder: "Enter your automation API key" },
    { id: "strategy", name: "Strategy API", placeholder: "Enter your strategy API key" },
    { id: "general", name: "General AI API", placeholder: "Enter your general AI API key" }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-400 mt-2">Manage your API keys and preferences</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/ai")}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Back to Dashboard
          </Button>
        </div>

        <Card className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">API Key Management</CardTitle>
            <CardDescription>
              Enter your API keys for each service to enable full functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {services.map((service) => (
              <div key={service.id} className="space-y-2">
                <Label htmlFor={service.id} className="text-lg">{service.name}</Label>
                <div className="flex gap-4">
                  <Input
                    id={service.id}
                    type="password"
                    placeholder={service.placeholder}
                    value={apiKeys[service.id] || ""}
                    onChange={(e) => handleApiKeyChange(service.id, e.target.value)}
                    className="bg-black/30 border-red-500/30 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
            ))}
            
            <div className="pt-6">
              <SparkleButton
                onClick={saveApiKeys}
                className="w-full py-6 text-xl"
              >
                Save API Keys
              </SparkleButton>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Your API keys are stored locally in your browser and are never sent to our servers.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;