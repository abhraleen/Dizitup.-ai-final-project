import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
const pricingOptions = [{
  service: "Social Automation",
  priceUSD: "$199",
  priceINR: "₹14,999",
  features: ["AI Content Creation", "Auto Scheduling", "Analytics Dashboard"]
}, {
  service: "Website Development",
  priceUSD: "$899",
  priceINR: "₹74,999",
  features: ["Responsive Design", "AI Integration", "SEO Optimized"]
}, {
  service: "Complete Package",
  priceUSD: "$1,499",
  priceINR: "₹1,24,999",
  features: ["Everything Included", "Priority Support", "Custom AI Tools"]
}];
const PricingTeaser = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    element?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
            Affordable <span className="text-primary">Digital Solutions</span> for Every Business
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Custom pricing tailored to your specific needs. From startup growth to enterprise automation solutions.
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
            Need a custom solution for your digital transformation? Let's discuss your project!
          </p>
          <Button onClick={scrollToBooking} variant="hero" size="lg" className="pulse-red hover-glow text-base sm:text-lg">
            Get Custom Quote
          </Button>
        </div>
      </div>
    </section>;
};
export default PricingTeaser;