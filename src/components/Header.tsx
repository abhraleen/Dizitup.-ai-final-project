import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md py-2 border-b border-border/50" : "py-4"}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
              DizItUp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "text-primary" : "text-foreground/80"}`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* AI Version Link */}
            <Link to="/ai" className="flex items-center text-red-400 hover:text-red-300 transition-colors nav-link">
              <Sparkles className="h-4 w-4 mr-1" />
              <span>AI Version</span>
            </Link>
            
            {/* Settings Link */}
            <Link to="/settings" className="flex items-center text-gray-400 hover:text-gray-300 transition-colors nav-link">
              <Settings className="h-4 w-4 mr-1" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="sm" className="nav-button">Dashboard</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="nav-button">Logout</Button>
              </>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="nav-button">Admin</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <nav className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium transition-colors hover:text-primary ${location.pathname === item.path ? "text-primary" : "text-foreground/80"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* AI Version Link */}
              <Link 
                to="/ai" 
                className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                <span>AI Version</span>
              </Link>
              
              {/* Settings Link */}
              <Link 
                to="/settings" 
                className="flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-1" />
                <span>Settings</span>
              </Link>
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                  <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full nav-button">Dashboard</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full nav-button">Logout</Button>
                </div>
              ) : (
                <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full mt-4 nav-button">Admin</Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
      
      {/* Custom Styles */}
      <style>{`
        .nav-link {
          position: relative;
          font-weight: 500;
          padding: 0.5rem 0;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          color: #f87171;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ef4444, #f87171);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-button {
          transition: all 0.3s ease;
          border-radius: 50px;
          font-weight: 500;
        }
        
        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </header>
  );
};

export default Header;