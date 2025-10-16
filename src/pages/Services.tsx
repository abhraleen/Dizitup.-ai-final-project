import { useState } from "react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Globe, Smartphone, Zap, Palette, Target, Film, Play, Sparkles, Code, Palette as PaletteIcon, Smartphone as SmartphoneIcon, Video, Wrench } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import AnimatedWaveBackground from "@/components/AnimatedWaveBackground";
import { useNavigate } from "react-router-dom";
import { SparkleButton, ProcessingModal } from "@/components/SparkleButton";

const services = [
  {
    icon: Film,
    title: "Video Editing Services",
    description: "Professional edits for every format — quick reels, promos, weddings, and documentaries.",
    features: [
      "Short edits (1–5 min) — ₹600",
      "Medium edits (5–15 min) — ₹1,200", 
      "Extended edits (15–30 min) — ₹2,500",
      "Long-form (30–60 min) — ₹4,500",
      "1 hr+ / documentary — From ₹8,000 (custom)"
    ],
    glitchDelay: "0s",
    editTask: "Edit Video",
    editIcon: <Video className="w-5 h-5" />
  },
  {
    icon: Palette,
    title: "Graphic Design Services",
    description: "Creative visuals that capture attention and communicate brand identity.",
    features: [
      "Small one-off design (posts/banners) — ₹200 – ₹500",
      "Thumbnails (YouTube) — ₹250 – ₹500",
      "Multi-page design (brochures, packaging) — ₹500 – ₹1,500 / page",
      "Logo & branding starter — ₹1,500 – ₹5,000"
    ],
    glitchDelay: "0.5s",
    editTask: "Design Graphics",
    editIcon: <PaletteIcon className="w-5 h-5" />
  },
  {
    icon: Globe,
    title: "Website Development India",
    description: "Responsive, SEO-friendly websites tailored for businesses of any size.",
    features: [
      "Basic Landing Page (1 page) — ₹7,000 – ₹10,000",
      "Small Business Site (3–5 pages) — ₹15,000 – ₹30,000",
      "Complete Business Website (5–10 pages) — Starting from ₹30,000",
      "Add-ons: SEO setup / analytics / payment integration — ₹1,500 – ₹4,000 each"
    ],
    glitchDelay: "1s",
    editTask: "Build Website",
    editIcon: <Code className="w-5 h-5" />
  },
  {
    icon: Smartphone,
    title: "App Development Services",
    description: "Custom apps to take your business from MVP to scale.",
    features: [
      "Simple app / MVP — From ₹60,000",
      "Mid-complexity app — ₹1.5 Lakh – ₹3 Lakh",
      "Complex / enterprise apps — From ₹5 Lakh+ (custom quoting)"
    ],
    glitchDelay: "1.5s",
    editTask: "Develop App",
    editIcon: <SmartphoneIcon className="w-5 h-5" />
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Save time and streamline operations with smart automations.",
    features: [
      "One-time small workflow setup — ₹3,000 – ₹10,000",
      "Monthly maintenance/support — ₹2,000 – ₹8,000 / month",
      "Large-scale automation projects — From ₹20,000+"
    ],
    glitchDelay: "2s",
    editTask: "Automate Workflow",
    editIcon: <Wrench className="w-5 h-5" />
  },
  {
    icon: Target,
    title: "Branding & Strategy", 
    description: "Comprehensive plans to define and grow your brand.",
    features: [
      "Starter social strategy plan — ₹3,000 – ₹7,000 (one-time)",
      "Full branding & go-to-market — ₹12,000 – ₹40,000",
      "Ongoing SMM retainer — ₹8,000 – ₹25,000 / month"
    ],
    glitchDelay: "2.5s",
    editTask: "Create Branding",
    editIcon: <Sparkles className="w-5 h-5" />
  }
];

const Services = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingTask, setProcessingTask] = useState<string | null>(null);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBookingClick = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setFormData(prev => ({ ...prev, service: serviceTitle }));
    setIsBookingOpen(true);
  };

  const handleEditTask = (taskName: string) => {
    setProcessingTask(taskName);
    setIsProcessingModalOpen(true);
    
    // Simulate processing for 5 seconds
    setTimeout(() => {
      setIsProcessingModalOpen(false);
      toast({
        title: "Task Completed!",
        description: `Your ${taskName.toLowerCase()} request has been processed successfully.`,
      });
    }, 5000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format preferred date/time for storage
      const preferredDateTime = date ? format(date, "PPP") : null;
      
      // Save to Supabase service_requests table
      const { error: dbError } = await supabase
        .from('service_requests')
        .insert({
          name: formData.fullName,
          email: formData.email,
          whatsapp: formData.phone,
          service: formData.service,
          message: formData.message ? `Preferred Date/Time: ${preferredDateTime}\n\n${formData.message}` : `Preferred Date/Time: ${preferredDateTime}`,
          enquiry_number: '', // Will be auto-generated by trigger
        });

      if (dbError) throw dbError;

      toast({
        title: "Thank you for showing your interest.",
        description: "We will get back to you ASAP. You will receive an email confirmation from our team shortly.",
      });

      // Reset form
      setFormData({ fullName: "", email: "", phone: "", service: "", message: "" });
      setDate(undefined);
      setIsBookingOpen(false);
    } catch (error) {
      console.error('Booking submission error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Our Services - Video Editing, Web Development, Branding & Automation"
        description="Professional digital services including video editing, graphic design, website development, app development, workflow automation, and branding strategy. Affordable solutions for businesses in India. Custom quotes available."
        keywords="video editing services, graphic design services, website development India, app development services, workflow automation, branding strategy, affordable marketing solutions, custom website builder, creative branding"
        canonical="/services"
      />
      <div className="min-h-screen text-foreground">
        <AnimatedWaveBackground />
        <Header />
        
        {/* AI Banner */}
        <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border-b border-red-500/30 py-3">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-300 font-medium">Experience our new AI-powered services</span>
            </div>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white rounded-full"
              onClick={() => navigate("/ai")}
            >
              Try dizitup.ai
            </Button>
          </div>
        </div>
        
      {/* Header Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Digital rain effect */}
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-px bg-primary/30 digital-rain"
              style={{
                left: `${5 + Math.random() * 90}%`,
                height: `${20 + Math.random() * 40}px`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          ))}
          
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-primary/40 hologram-flicker"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-glitch hologram-flicker leading-tight">
            Professional <span className="text-primary glitch-text neon-flicker">Digital Services</span> in India
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto relative px-4">
            <span className="relative z-10">
              From video editing to app development - choose the perfect digital solution for your business. Affordable, professional, and results-driven.
            </span>
            <div className="absolute inset-0 bg-primary/5 blur-xl opacity-50"></div>
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Data streams */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent data-stream"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent data-stream" style={{ animationDelay: '4s' }}></div>
          
          {/* Central ping effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary animate-ping"></div>
        </div>

        <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 card-glitch group relative overflow-hidden shadow-card"
                style={{ animationDelay: service.glitchDelay }}
              >
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="text-center pb-3 sm:pb-4 relative z-10 p-4 sm:p-6">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-primary/10 rounded-full neon-flicker">
                      <service.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-display text-base sm:text-lg text-card-foreground text-glitch">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center relative z-10 p-4 sm:p-6 pt-0">
                  <CardDescription className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                  
                  <ul className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center text-left">
                        <span className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                        <span className="break-words">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Sparkle Edit Button */}
                  <div className="mb-4">
                    <SparkleButton
                      onClick={() => handleEditTask(service.editTask)}
                      icon={service.editIcon}
                    >
                      {service.editTask}
                    </SparkleButton>
                  </div>
                  
                  <Dialog open={isBookingOpen && selectedService === service.title} onOpenChange={(open) => {
                    if (!open) setIsBookingOpen(false);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => handleBookingClick(service.title)}
                        className="hover-glow border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:shadow-red-glow w-full"
                      >
                        <span className="relative z-10">Book a Meeting</span>
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
                
                {/* Corner accent lines */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-sm border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary glitch-text">Book a Meeting</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="bg-input border-primary/20 focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-input border-primary/20 focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone/WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-input border-primary/20 focus:border-primary"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">Service Interested</Label>
              <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                <SelectTrigger className="bg-input border-primary/20 focus:border-primary">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  {services.map((service, idx) => (
                    <SelectItem key={idx} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Preferred Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-input border-primary/20 focus:border-primary",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-primary/20" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Short Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="bg-input border-primary/20 focus:border-primary"
                placeholder="Tell us about your project..."
                rows={3}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full pulse-red hover-glow neon-flicker"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Confirm Booking"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Processing Modal */}
      <ProcessingModal 
        isOpen={isProcessingModalOpen}
        onClose={() => setIsProcessingModalOpen(false)}
        taskName={processingTask || ""}
      />

        <Footer />
      </div>
    </>
  );
};

export default Services;