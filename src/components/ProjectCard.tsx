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

// Dashboard preview SVG patterns for each industry
const DashboardPreview = ({ industry }: { industry: Project["industry"] }) => {
  const getPreviewColor = () => {
    switch (industry) {
      case "telecommunications":
        return "hsl(var(--primary))";
      case "financial-services":
        return "hsl(var(--status-warning))";
      case "customer-experience":
        return "hsl(var(--status-healthy))";
      default:
        return "hsl(var(--primary))";
    }
  };

  const color = getPreviewColor();

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-[0.20] transition-opacity duration-300 ease-out"
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      style={{ filter: "blur(1px) saturate(0.6)" }}
    >
      {/* KPI Tiles - top row */}
      <rect x="20" y="20" width="80" height="45" rx="6" fill={color} opacity="0.3" />
      <rect x="110" y="20" width="80" height="45" rx="6" fill={color} opacity="0.25" />
      <rect x="200" y="20" width="80" height="45" rx="6" fill={color} opacity="0.2" />
      <rect x="290" y="20" width="90" height="45" rx="6" fill={color} opacity="0.15" />

      {/* Line chart area */}
      <path
        d="M30 120 Q60 100, 90 110 T150 95 T210 105 T270 85 T330 100 T380 90"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M30 120 Q60 100, 90 110 T150 95 T210 105 T270 85 T330 100 T380 90 V180 H30 Z"
        fill={color}
        opacity="0.08"
      />

      {/* Bar chart silhouettes - bottom */}
      <rect x="30" y="150" width="25" height="35" rx="3" fill={color} opacity="0.25" />
      <rect x="65" y="140" width="25" height="45" rx="3" fill={color} opacity="0.3" />
      <rect x="100" y="155" width="25" height="30" rx="3" fill={color} opacity="0.2" />
      <rect x="135" y="135" width="25" height="50" rx="3" fill={color} opacity="0.35" />
      <rect x="170" y="145" width="25" height="40" rx="3" fill={color} opacity="0.25" />
      <rect x="205" y="160" width="25" height="25" rx="3" fill={color} opacity="0.2" />
      <rect x="240" y="130" width="25" height="55" rx="3" fill={color} opacity="0.3" />
      <rect x="275" y="150" width="25" height="35" rx="3" fill={color} opacity="0.25" />

      {/* Small metric indicators */}
      <circle cx="320" cy="140" r="20" fill={color} opacity="0.15" />
      <circle cx="360" cy="160" r="15" fill={color} opacity="0.12" />
    </svg>
  );
};

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const Icon = industryIcons[project.industry];
  const accent = industryAccents[project.industry];

  return (
    <Link
      to={`/project/${project.id}`}
      className={cn(
        "group relative block bg-card p-6 rounded-xl border border-border border-l-4 transition-all duration-200 ease-out overflow-hidden",
        "shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
        accent.border,
        className
      )}
    >
      {/* Dashboard preview - fades in on hover */}
      <DashboardPreview industry={project.industry} />

      {/* Content - always dominant */}
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
          <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
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
