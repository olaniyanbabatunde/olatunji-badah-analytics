import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";
import { BarChart3, Shield, Users } from "lucide-react";

const ProjectsSection = () => {
  const telecomProjects = projects.filter((p) => p.industry === "telecommunications");
  const financeProjects = projects.filter((p) => p.industry === "financial-services");
  const cxProjects = projects.filter((p) => p.industry === "customer-experience");

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="section-container">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Portfolio
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise analytics projects demonstrating real-world decision intelligence 
            across telecommunications, financial services, and customer experience.
          </p>
        </div>

        {/* Telecommunications */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Telecommunications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {telecomProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Financial Services */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-status-warning/10 rounded-lg">
              <Shield className="h-5 w-5 text-status-warning" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Financial Services</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Customer Experience */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-status-healthy/10 rounded-lg">
              <Users className="h-5 w-5 text-status-healthy" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Customer Experience</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cxProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
