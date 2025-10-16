const AboutSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-primary">
            About DizItUp - Your Digital Transformation Partner
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed mb-4 sm:mb-6">
              We're a young, AI-driven digitalisation agency revolutionizing how brands grow online. 
              Our smart workflow automation and digital marketing solutions handle your social media, content creation, 
              and development needs while you focus on what matters most—growing your business.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              By leveraging cutting-edge AI-powered marketing tools and business automation, we deliver 
              cost-effective growth strategies that work around the clock, 
              ensuring your brand stays ahead in the competitive digital landscape.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;