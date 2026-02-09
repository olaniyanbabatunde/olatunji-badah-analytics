import { Mail, MapPin, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Olatunji Badah
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Data Analyst turning complex data into clear decisions for 
              performance, risk, and customer intelligence.
            </p>
          </div>

          {/* Capabilities */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Capabilities
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Performance Analytics</li>
              <li>Risk & Data Quality</li>
              <li>Customer Insights</li>
              <li>Data Storytelling</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                United Kingdom
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:olatunji.badah@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  olatunji.badah@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a
                  href="https://wa.me/447943982963"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Olatunji Badah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
