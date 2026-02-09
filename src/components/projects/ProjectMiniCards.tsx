import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Sparkles, Wrench, BarChart3 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CleanedDataModal, ToolsModal } from "./ProjectProofModals";

interface ProjectMiniCardsProps {
  projectId: string;
  projectTitle: string;
}

const ProjectMiniCards = ({ projectId, projectTitle }: ProjectMiniCardsProps) => {
  const [cleanedDataOpen, setCleanedDataOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const navigate = useNavigate();

  const miniCards = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      tooltip: "Executive Power BI dashboard showing final insights",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/project/${projectId}`);
      },
      color: "text-primary",
      bgColor: "bg-primary/8 hover:bg-primary/15",
    },
    {
      id: "raw-data",
      label: "Raw Data",
      icon: Database,
      tooltip: "Raw CSV datasets from source systems",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/project/${projectId}/raw-data`);
      },
      color: "text-status-warning",
      bgColor: "bg-status-warning/10 hover:bg-status-warning/20",
    },
    {
      id: "cleaned-queries",
      label: "Cleaned Queries",
      icon: Sparkles,
      tooltip: "Cleaned and transformed queries used to generate the dashboard",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCleanedDataOpen(true);
      },
      color: "text-status-healthy",
      bgColor: "bg-status-healthy/10 hover:bg-status-healthy/20",
    },
    {
      id: "tools",
      label: "Tools",
      icon: Wrench,
      tooltip: "Tools used across extraction, cleaning, and reporting",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setToolsOpen(true);
      },
      color: "text-muted-foreground",
      bgColor: "bg-muted hover:bg-muted/80",
    },
  ];

  return (
    <>
      <TooltipProvider>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {miniCards.map((card) => (
            <Tooltip key={card.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={card.onClick}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all duration-200",
                    "border border-border/50 hover:border-border",
                    "hover:shadow-sm hover:-translate-y-0.5",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-background",
                    card.bgColor
                  )}
                >
                  <card.icon className={cn("h-4 w-4", card.color)} />
                  <span className="text-[10px] font-medium text-foreground/80 leading-tight text-center">
                    {card.label}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px] text-center">
                <p className="text-xs">{card.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Modals */}
      <CleanedDataModal 
        open={cleanedDataOpen} 
        onOpenChange={setCleanedDataOpen} 
        projectId={projectId}
      />
      <ToolsModal 
        open={toolsOpen} 
        onOpenChange={setToolsOpen}
        projectId={projectId}
      />
    </>
  );
};

export default ProjectMiniCards;
