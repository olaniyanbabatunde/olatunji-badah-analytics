import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "healthy" | "warning" | "risk" | "good" | "fair" | "low" | "medium" | "high" | "neutral";
  label?: string;
  className?: string;
}

const statusMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  healthy: { 
    bg: "bg-status-healthy-bg border-status-healthy/20", 
    text: "text-status-healthy", 
    dot: "bg-status-healthy",
    label: "Healthy" 
  },
  good: { 
    bg: "bg-status-healthy-bg border-status-healthy/20", 
    text: "text-status-healthy", 
    dot: "bg-status-healthy",
    label: "Good" 
  },
  low: { 
    bg: "bg-status-healthy-bg border-status-healthy/20", 
    text: "text-status-healthy", 
    dot: "bg-status-healthy",
    label: "Low" 
  },
  warning: { 
    bg: "bg-status-warning-bg border-status-warning/20", 
    text: "text-status-warning", 
    dot: "bg-status-warning",
    label: "Warning" 
  },
  fair: { 
    bg: "bg-status-warning-bg border-status-warning/20", 
    text: "text-status-warning", 
    dot: "bg-status-warning",
    label: "Fair" 
  },
  medium: { 
    bg: "bg-status-warning-bg border-status-warning/20", 
    text: "text-status-warning", 
    dot: "bg-status-warning",
    label: "Medium" 
  },
  risk: { 
    bg: "bg-status-risk-bg border-status-risk/20", 
    text: "text-status-risk", 
    dot: "bg-status-risk",
    label: "Risk" 
  },
  high: { 
    bg: "bg-status-risk-bg border-status-risk/20", 
    text: "text-status-risk", 
    dot: "bg-status-risk",
    label: "High" 
  },
  neutral: { 
    bg: "bg-status-neutral-bg border-status-neutral/20", 
    text: "text-status-neutral", 
    dot: "bg-status-neutral",
    label: "Neutral" 
  },
};

const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const config = statusMap[status] || statusMap.neutral;
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {label || config.label}
    </span>
  );
};

export default StatusBadge;