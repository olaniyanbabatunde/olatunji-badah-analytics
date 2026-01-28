import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "healthy" | "warning" | "risk" | "good" | "fair" | "low" | "medium" | "high" | "neutral";
  label?: string;
  className?: string;
}

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  healthy: { bg: "bg-status-healthy-bg", text: "text-status-healthy", label: "Healthy" },
  good: { bg: "bg-status-healthy-bg", text: "text-status-healthy", label: "Good" },
  low: { bg: "bg-status-healthy-bg", text: "text-status-healthy", label: "Low" },
  warning: { bg: "bg-status-warning-bg", text: "text-status-warning", label: "Warning" },
  fair: { bg: "bg-status-warning-bg", text: "text-status-warning", label: "Fair" },
  medium: { bg: "bg-status-warning-bg", text: "text-status-warning", label: "Medium" },
  risk: { bg: "bg-status-risk-bg", text: "text-status-risk", label: "Risk" },
  high: { bg: "bg-status-risk-bg", text: "text-status-risk", label: "High" },
  neutral: { bg: "bg-status-neutral-bg", text: "text-status-neutral", label: "Neutral" },
};

const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const config = statusMap[status] || statusMap.neutral;
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.text.replace("text-", "bg-"))} />
      {label || config.label}
    </span>
  );
};

export default StatusBadge;
