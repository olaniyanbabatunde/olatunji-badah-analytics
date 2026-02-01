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

const industryAccents = {
  telecommunications: {
    border: "border-l-primary",
    iconBg: "bg-primary/8",
    iconColor: "text-primary",
  },
  "financial-services": {
    border: "border-l-status-warning",
    iconBg: "bg-status-warning/10",
    iconColor: "text-status-warning",
  },
  "customer-experience": {
    border: "border-l-status-healthy",
    iconBg: "bg-status-healthy/10",
    iconColor: "text-status-healthy",
  },
};

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const Icon = industryIcons[project.industry];
  const accent = industryAccents[project.industry];

  return (
    <Link
      to={`/project/${project.id}`}
      className={cn(
        "group block bg-card p-6 rounded-xl border border-border border-l-4 shadow-card transition-all duration-300 ease-out",
        "hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-0.5",
        accent.border,
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={cn("p-1.5 rounded-md", accent.iconBg)}>
            <Icon className={cn("h-3.5 w-3.5", accent.iconColor)} />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {project.industryLabel}
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {project.title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {project.description}
      </p>
    </Link>
  );
};

export default ProjectCard;