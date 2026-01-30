import { financeRiskData } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

const FinanceRiskDashboard = () => {
  const mediumRisks = financeRiskData.filter((r) => r.risk_level === "medium").length;
  const lowRisks = financeRiskData.filter((r) => r.risk_level === "low").length;
  const highRisks = financeRiskData.filter((r) => r.risk_level === "high").length;

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-status-risk" />;
      case "medium":
        return <Info className="h-5 w-5 text-status-warning" />;
      default:
        return <CheckCircle className="h-5 w-5 text-status-healthy" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="High Risk Items"
          value={highRisks}
          status={highRisks > 0 ? "risk" : "healthy"}
        />
        <MetricCard
          title="Medium Risk Items"
          value={mediumRisks}
          status={mediumRisks > 0 ? "warning" : "healthy"}
        />
        <MetricCard
          title="Low Risk Items"
          value={lowRisks}
          status="healthy"
        />
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {financeRiskData.map((risk, index) => (
          <div
            key={index}
            className={`bg-card p-6 rounded-lg border-l-4 ${
              risk.risk_level === "high"
                ? "border-l-status-risk"
                : risk.risk_level === "medium"
                ? "border-l-status-warning"
                : "border-l-status-healthy"
            } border border-border`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getRiskIcon(risk.risk_level)}
                <h3 className="font-semibold text-foreground">{risk.risk_area}</h3>
              </div>
              <StatusBadge status={risk.risk_level as any} />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Driver
                </p>
                <p className="text-foreground">{risk.driver}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Recommended Action
                </p>
                <p className="text-foreground">{risk.recommended_action}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Register Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Risk Register
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Risk Area
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Level
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Driver
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {financeRiskData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">
                    {row.risk_area}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={row.risk_level as any} />
                  </td>
                  <td className="py-3 px-4 text-foreground">{row.driver}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {row.recommended_action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          What This Means
        </h3>
        <p className="text-muted-foreground mb-4">
          The risk profile shows one medium-level concern in Liquidity driven by delayed 
          settlements. While operational risk remains low due to stable processing volumes, 
          the liquidity situation requires active monitoring to prevent escalation that could 
          impact capital allocation decisions.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Increase monitoring frequency for clearing timeline metrics
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Escalate to Treasury if settlement delays exceed 48 hours
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Maintain current operational controls given stable volumes
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FinanceRiskDashboard;
