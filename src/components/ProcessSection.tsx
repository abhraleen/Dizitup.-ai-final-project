import { ArrowRight, Target, Cog, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Tell Us Your Goal",
    description: "Share your vision and objectives with our team"
  },
  {
    icon: Cog,
    title: "We Automate",
    description: "Our AI-driven systems get to work building your solution"
  },
  {
    icon: TrendingUp,
    title: "You Grow",
    description: "Watch your business scale while you focus on what matters"
  }
];

const ProcessSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-secondary">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
            How We <span className="text-primary">Digitalize Your Business</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Three simple steps to transform your digital presence with our AI-powered automation solutions
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center">
              {/* Step Card */}
              <div className="text-center group hover-scale">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-red-glow group-hover:shadow-red-pulse transition-all duration-300">
                    <step.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground max-w-xs">
                  {step.description}
                </p>
              </div>
              
              {/* Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block mx-8">
                  <ArrowRight className="h-8 w-8 text-primary animate-pulse" />
                </div>
              )}
              
              {/* Mobile arrow */}
              {index < steps.length - 1 && (
                <div className="md:hidden my-6 rotate-90">
                  <ArrowRight className="h-8 w-8 text-primary animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;