import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Shield, Users, TrendingUp, PieChart, Activity } from "lucide-react";
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
    previewBg: "from-primary/5 to-primary/10",
  },
  "financial-services": {
    border: "border-l-status-warning",
    iconBg: "bg-status-warning/10",
    iconColor: "text-status-warning",
    previewBg: "from-status-warning/5 to-status-warning/10",
  },
  "customer-experience": {
    border: "border-l-status-healthy",
    iconBg: "bg-status-healthy/10",
    iconColor: "text-status-healthy",
    previewBg: "from-status-healthy/5 to-status-healthy/10",
  },
};

// Preview icons for each project type
const previewIcons = {
  telecommunications: [BarChart3, TrendingUp, Activity],
  "financial-services": [Shield, PieChart, TrendingUp],
  "customer-experience": [Users, Activity, PieChart],
};

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const Icon = industryIcons[project.industry];
  const accent = industryAccents[project.industry];
  const PreviewIcons = previewIcons[project.industry];

  return (
    <Link
      to={`/project/${project.id}`}
      className={cn(
        "group relative block bg-card p-6 rounded-xl border border-border border-l-4 shadow-card transition-all duration-300 ease-out overflow-hidden",
        "hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-0.5",
        accent.border,
        className
      )}
    >
      {/* Hover preview background */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          accent.previewBg
        )}
      />
      
      {/* Decorative preview icons - appear on hover */}
      <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-20 transition-all duration-500 blur-[1px]">
        {PreviewIcons.map((PreviewIcon, idx) => (
          <PreviewIcon 
            key={idx} 
            className={cn(
              "h-8 w-8 transition-all duration-500",
              accent.iconColor
            )}
            style={{
              transitionDelay: `${idx * 50}ms`,
              transform: `translateY(${idx % 2 === 0 ? '-2px' : '2px'})`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
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
      </div>
    </Link>
  );
};

export default ProjectCard;