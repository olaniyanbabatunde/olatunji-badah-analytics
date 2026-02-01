import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";
import { BarChart3, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ProjectsSection = () => {
  const telecomProjects = projects.filter((p) => p.industry === "telecommunications");
  const financeProjects = projects.filter((p) => p.industry === "financial-services");
  const cxProjects = projects.filter((p) => p.industry === "customer-experience");

  const industryGroups = [
    {
      title: "Telecommunications",
      projects: telecomProjects,
      icon: BarChart3,
      iconBg: "bg-primary/8",
      iconColor: "text-primary",
    },
    {
      title: "Financial Services",
      projects: financeProjects,
      icon: Shield,
      iconBg: "bg-status-warning/10",
      iconColor: "text-status-warning",
    },
    {
      title: "Customer Experience",
      projects: cxProjects,
      icon: Users,
      iconBg: "bg-status-healthy/10",
      iconColor: "text-status-healthy",
    },
  ];

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="section-container">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
            Portfolio
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Enterprise analytics projects demonstrating real-world decision intelligence 
            across telecommunications, financial services, and customer experience.
          </p>
        </div>

        {/* Industry groups */}
        <div className="space-y-16">
          {industryGroups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("p-2.5 rounded-lg", group.iconBg)}>
                  <group.icon className={cn("h-5 w-5", group.iconColor)} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{group.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {group.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;