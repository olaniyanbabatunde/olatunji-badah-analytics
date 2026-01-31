import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FileText, Moon, Sun, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#projects", label: "Projects" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname + location.hash === href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg md:text-xl font-semibold text-foreground hover:text-primary transition-colors"
          >
            Olatunji Badah
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="mailto:olatunji.badah@gmail.com">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </a>
            </Button>
            <Button asChild variant="default" size="sm">
              <a href="/cv/olatunji_badah.pdf" target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4 mr-2" />
                View CV
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-2">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                  <a href="mailto:olatunji.badah@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </a>
                </Button>
                <Button asChild variant="default" size="sm" className="w-fit">
                  <a href="/cv/olatunji_badah.pdf" target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    View CV (PDF)
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
