import { ArrowDown, FileText, BarChart3, Shield, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="section-container relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground animate-fade-in">
            <span className="w-2 h-2 bg-status-healthy rounded-full animate-pulse" />
            Available for opportunities
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-slide-up">
            Olatunji Badah
          </h1>

          {/* Subtitle - domain-flexible positioning */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Data Analyst turning{" "}
            <span className="text-foreground font-medium">complex data into clear decisions</span>{" "}
            for performance, risk, and customer intelligence
          </p>

          {/* Capability pills - NOT industries */}
          <div className="flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Performance Analytics</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Risk & Data Quality</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Customer Insights</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Data Storytelling</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="min-w-[180px]">
              <a href="#projects">
                View Projects
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px]">
              <a href="/cv/olatunji_badah.pdf" target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4 mr-2" />
                View CV (PDF)
              </a>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="pt-12 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <a
              href="#about"
              className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
