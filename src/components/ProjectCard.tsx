import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const industryIcons = {
  telecommunications: BarChart3,
  "financial-services": Shield,
  "customer-experience": Users,
};

const industryColors = {
  telecommunications: "border-l-primary",
  "financial-services": "border-l-status-warning",
  "customer-experience": "border-l-status-healthy",
};

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const Icon = industryIcons[project.industry];

  return (
    <Link
      to={`/project/${project.id}`}
      className={cn(
        "group block bg-card p-6 rounded-lg border border-border border-l-4 transition-all duration-300 hover:shadow-card-hover hover:border-primary/30",
        industryColors[project.industry],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <Icon className="h-4 w-4" />
          {project.industryLabel}
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {project.title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {project.description}
      </p>
    </Link>
  );
};

export default ProjectCard;
