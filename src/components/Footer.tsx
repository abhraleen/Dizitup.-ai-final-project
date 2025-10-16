import { Instagram, Linkedin, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import dizitupLogo from "@/assets/dizitup-logo.png";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  const handleGetQuote = () => {
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/#contact');
      setTimeout(() => {
        const element = document.getElementById('contact');
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('contact');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return <footer className="bg-background border-t border-border py-12">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <img 
              src={dizitupLogo} 
              alt="DizItUp - AI-Powered Digital Marketing and Automation Agency" 
              className="h-12 mb-4 hover-scale cursor-pointer" 
              onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} 
            />
            <p className="text-muted-foreground mb-4 max-w-md">
              AI-powered digitalisation agency helping brands scale smart with 
              cutting-edge automation technology, digital marketing, and creative services in India.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/dizitup?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover-scale group" 
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6 group-hover:neon-flicker group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]" />
              </a>
              <a 
                href="https://www.linkedin.com/company/dizitup/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover-scale group" 
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6 group-hover:neon-flicker group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]" />
              </a>
              <a 
                href="https://www.youtube.com/@dizitup-official"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover-scale group" 
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6 group-hover:neon-flicker group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services" className="text-muted-foreground hover:text-primary transition-colors block">
                  Video Editing Services
                </a>
              </li>
              <li>
                <a href="/services" className="text-muted-foreground hover:text-primary transition-colors block">
                  Graphic Design
                </a>
              </li>
              <li>
                <a href="/services" className="text-muted-foreground hover:text-primary transition-colors block">
                  Website Development
                </a>
              </li>
              <li>
                <a href="/services" className="text-muted-foreground hover:text-primary transition-colors block">
                  Workflow Automation
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors block">
                  View Portfolio
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#contact" className="text-muted-foreground hover:text-primary transition-colors block">
                  Get a Quote
                </a>
              </li>
              <li>
                <a href="mailto:dizitup@outlook.com" className="text-muted-foreground hover:text-primary transition-colors block">dizitup@outlook.com</a>
              </li>
              <li>
                
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-muted-foreground hover:text-primary transition-colors text-left">
                      Privacy Policy
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">Privacy Policy</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <p className="text-foreground font-medium">Effective Date: September 26, 2025</p>
                        
                        <p>At DizItUp, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.</p>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">1. Information We Collect</h4>
                          <p>- Personal Information: such as your name, email address, phone number, billing details, or any other details you provide when contacting us or purchasing our services.</p>
                          <p>- Non-Personal Information: such as browser type, device information, IP address, and usage data when you interact with our website.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">2. How We Use Your Information</h4>
                          <p>We use the information we collect for:</p>
                          <p>- Providing and managing our services.</p>
                          <p>- Processing payments and invoices.</p>
                          <p>- Responding to your inquiries or support requests.</p>
                          <p>- Improving our website and user experience.</p>
                          <p>- Sending you updates, promotions, or important policy changes (only if you opt in).</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">3. Sharing of Information</h4>
                          <p>We do not sell or rent your personal information to third parties. We may share data with trusted partners and service providers who help us operate our business, such as payment processors or hosting providers, but only as necessary to provide our services.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">4. Data Security</h4>
                          <p>We implement reasonable technical and organizational measures to protect your information from unauthorized access, loss, misuse, or alteration. However, no method of transmission over the internet is 100% secure.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">5. Your Rights</h4>
                          <p>You have the right to:</p>
                          <p>- Access the information we hold about you.</p>
                          <p>- Request correction or deletion of your data.</p>
                          <p>- Opt-out of receiving promotional communications.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">6. Cookies & Tracking</h4>
                          <p>Our website may use cookies and similar technologies to improve user experience, analyze traffic, and personalize content.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">7. Third-Party Links</h4>
                          <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these external websites.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">8. Updates to This Policy</h4>
                          <p>We may update this Privacy Policy from time to time. Any changes will be posted here with a revised "Effective Date."</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Contact Us</h4>
                          <p>📧 dizitup@outlook.com</p>
                          <p>📍 Made with love in India</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-muted-foreground hover:text-primary transition-colors text-left">
                      Terms of Service
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">Terms of Service</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <p className="text-foreground font-medium">Effective Date: September 26, 2025</p>
                        
                        <p>Welcome to DizItUp. By accessing or using our website and services, you agree to comply with and be bound by the following Terms of Service.</p>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">1. Acceptance of Terms</h4>
                          <p>By booking a meeting, using our website, or purchasing any of our services, you agree to these Terms of Service, including our pricing, policies, and conditions as outlined on our website and in our communications.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">2. Services Provided</h4>
                          <p>DizItUp offers Social Media Management and Business Management services, including but not limited to:</p>
                          <p>- Video editing</p>
                          <p>- Graphic design</p>
                          <p>- Website/App development</p>
                          <p>- Scheduled posting</p>
                          <p>- Facebook ad campaigns</p>
                          <p>- Invoicing, payment tracking, order management, inventory tracking, payroll, CRM, and marketing automations</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">3. Booking Meetings</h4>
                          <p>When a customer books a meeting through our website:</p>
                          <p>- It is considered a binding agreement to our Terms of Service.</p>
                          <p>- The customer acknowledges and accepts our pricing, refund policies, and conditions associated with the services.</p>
                          <p>- Any changes to meeting schedules should be communicated at least 24 hours in advance.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">4. Payments</h4>
                          <p>- 50% payment must be made upfront unless otherwise agreed.</p>
                          <p>- Invoices must be cleared within 2–3 business days.</p>
                          <p>- Late payments may attract additional charges or service suspension.</p>
                          <p>- Subscription payments must be made on the day the billing cycle starts.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">5. Refunds & Cancellations</h4>
                          <p>Refunds will be processed according to our Refund Policy, available on our website.</p>
                          <p>Completed projects are non-refundable.</p>
                          <p>For ongoing services, partial refunds may be applicable under certain conditions.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">6. Use of Services</h4>
                          <p>You agree not to misuse our services. Prohibited actions include, but are not limited to:</p>
                          <p>- Copying, redistributing, or reselling our work without consent.</p>
                          <p>- Using our services for unlawful or harmful activities.</p>
                          <p>- Attempting to breach our systems or misuse our platform.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">7. Intellectual Property</h4>
                          <p>All content, designs, and deliverables created by DizItUp remain our intellectual property until full payment is received. After payment, ownership is transferred to the client unless otherwise agreed.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">8. Limitation of Liability</h4>
                          <p>DizItUp will not be held responsible for:</p>
                          <p>- Losses arising from delays due to third-party platforms or tools.</p>
                          <p>- Misuse of deliverables once handed over.</p>
                          <p>- Any indirect or incidental damages related to use of our services.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">9. Updates to Terms</h4>
                          <p>We may update these Terms of Service at any time. The revised terms will be effective immediately upon posting.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Contact Us</h4>
                          <p>📧 dizitup@outlook.com</p>
                          <p>📍 Made with love in India</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © {currentYear} Dizitup. All rights reserved. 
            <span className="text-primary font-semibold"> Built with AI-powered automation.</span>
          </p>
          <div className="mt-2">
            <a href="/admin/login" className="text-xs text-muted-foreground/50 hover:text-primary transition-colors">
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;