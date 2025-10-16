import { useState } from "react";

const PortfolioMasonry = () => {
  // Sample portfolio data - in a real app this would come from an API or CMS
  const portfolioItems = [
    {
      id: 1,
      title: "E-commerce Website Redesign",
      category: "Web Development",
      description: "Complete redesign of an online retail platform with improved UX and performance.",
      image: "https://placehold.co/600x400/1a1a1a/ffffff?text=E-commerce+Project",
    },
    {
      id: 2,
      title: "Social Media Campaign",
      category: "Digital Marketing",
      description: "3-month social media strategy that increased engagement by 150%.",
      image: "https://placehold.co/600x800/1a1a1a/ffffff?text=Social+Media+Campaign",
    },
    {
      id: 3,
      title: "Brand Identity Design",
      category: "Branding",
      description: "Complete brand identity including logo, color palette, and brand guidelines.",
      image: "https://placehold.co/600x600/1a1a1a/ffffff?text=Brand+Identity",
    },
    {
      id: 4,
      title: "Mobile App Development",
      category: "App Development",
      description: "Cross-platform mobile application for fitness tracking and coaching.",
      image: "https://placehold.co/600x900/1a1a1a/ffffff?text=Mobile+App",
    },
    {
      id: 5,
      title: "Content Marketing Strategy",
      category: "Content Creation",
      description: "6-month content strategy that drove 200% more organic traffic.",
      image: "https://placehold.co/600x500/1a1a1a/ffffff?text=Content+Marketing",
    },
    {
      id: 6,
      title: "Business Automation Solution",
      category: "Automation",
      description: "Custom workflow automation that saved 20+ hours per week.",
      image: "https://placehold.co/600x700/1a1a1a/ffffff?text=Business+Automation",
    },
  ];

  const [filter, setFilter] = useState("All");

  const categories = ["All", "Web Development", "Digital Marketing", "Branding", "App Development", "Content Creation", "Automation"];

  const filteredItems = filter === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
              filter === category
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="group overflow-hidden rounded-xl bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-4 sm:p-6">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-2">
                {item.category}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioMasonry;