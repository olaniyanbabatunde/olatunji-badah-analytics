import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  delta?: number;
  deltaLabel?: string;
  status?: "healthy" | "warning" | "risk" | "good" | "fair" | "low" | "medium" | "high" | "neutral";
  className?: string;
  onClick?: () => void;
}

const MetricCard = ({
  title,
  value,
  unit,
  target,
  delta,
  deltaLabel,
  status,
  className,
  onClick,
}: MetricCardProps) => {
  const getTrendIcon = () => {
    if (delta === undefined || delta === 0) return <Minus className="h-3 w-3" />;
    return delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (delta === undefined || delta === 0) return "text-muted-foreground";
    return delta > 0 ? "text-status-healthy" : "text-status-risk";
  };

  return (
    <div
      className={cn(
        "metric-card cursor-pointer hover:border-primary/30",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {status && <StatusBadge status={status} />}
      </div>

      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-sm">
        {target !== undefined && (
          <span className="text-muted-foreground">
            Target: {target}{unit}
          </span>
        )}
        {delta !== undefined && (
          <span className={cn("flex items-center gap-1", getTrendColor())}>
            {getTrendIcon()}
            {delta > 0 ? "+" : ""}{delta}{unit || "%"} {deltaLabel || ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
