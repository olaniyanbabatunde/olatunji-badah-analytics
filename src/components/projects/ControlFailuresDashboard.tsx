import { financeRiskData } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ControlFailuresDashboard = () => {
  const mediumRisks = financeRiskData.filter((r) => r.risk_level === "medium").length;
  const lowRisks = financeRiskData.filter((r) => r.risk_level === "low").length;
  const highRisks = financeRiskData.filter((r) => r.risk_level === "high").length;
  const totalRisks = financeRiskData.length;

  // Risk trend data
  const riskTrendData = [
    { month: "Oct", high: 0, medium: 1, low: 2 },
    { month: "Nov", high: 0, medium: 2, low: 1 },
    { month: "Dec", high: 1, medium: 1, low: 1 },
    { month: "Jan", high: 0, medium: 1, low: 1 },
  ];

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

  const getRiskBorderColor = (level: string) => {
    switch (level) {
      case "high":
        return "border-l-status-risk";
      case "medium":
        return "border-l-status-warning";
      default:
        return "border-l-status-healthy";
    }
  };

  return (
    <div className="space-y-8">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Risk Items"
          value={totalRisks}
          status="neutral"
        />
        <MetricCard
          title="High Risk"
          value={highRisks}
          status={highRisks > 0 ? "risk" : "healthy"}
        />
        <MetricCard
          title="Medium Risk"
          value={mediumRisks}
          status={mediumRisks > 0 ? "warning" : "healthy"}
        />
        <MetricCard
          title="Low Risk"
          value={lowRisks}
          status="healthy"
        />
      </div>

      {/* Risk Trend Chart */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Risk Level Trend
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Monthly count of risk items by severity
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground text-xs" />
              <YAxis className="text-muted-foreground text-xs" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="high"
                name="High Risk"
                stroke="hsl(var(--status-risk))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--status-risk))", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="medium"
                name="Medium Risk"
                stroke="hsl(var(--status-warning))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--status-warning))", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="low"
                name="Low Risk"
                stroke="hsl(var(--status-healthy))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--status-healthy))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Risk Cards */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Risk Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financeRiskData.map((risk, index) => (
            <div
              key={index}
              className={`bg-card p-6 rounded-lg border-l-4 ${getRiskBorderColor(risk.risk_level)} border border-border`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getRiskIcon(risk.risk_level)}
                  <h4 className="font-semibold text-foreground">{risk.risk_area}</h4>
                </div>
                <StatusBadge status={risk.risk_level as any} />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Driver</p>
                  <p className="text-foreground">{risk.driver}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Recommended Action</p>
                  <p className="text-foreground">{risk.recommended_action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Register Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Risk Register</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk Area</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Level</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Driver</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {financeRiskData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">{row.risk_area}</td>
                  <td className="py-3 px-4"><StatusBadge status={row.risk_level as any} /></td>
                  <td className="py-3 px-4 text-foreground">{row.driver}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.recommended_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">What This Means</h3>
        <p className="text-muted-foreground mb-4">
          The current risk profile shows one medium-level concern in Liquidity driven by delayed 
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

export default ControlFailuresDashboard;