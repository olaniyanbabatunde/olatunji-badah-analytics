import { financeRiskData, financeControlFailureTrends } from "@/lib/data";
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
  Legend,
  ComposedChart,
  Bar,
  Area,
} from "recharts";

const ControlFailuresDashboard = () => {
  const mediumRisks = financeRiskData.filter((r) => r.risk_level === "medium").length;
  const lowRisks = financeRiskData.filter((r) => r.risk_level === "low").length;
  const highRisks = financeRiskData.filter((r) => r.risk_level === "high").length;
  const totalRisks = financeRiskData.length;

  const totalFailures = financeControlFailureTrends.reduce((sum, d) => sum + d.control_failures, 0);
  const currentMonth = financeControlFailureTrends[financeControlFailureTrends.length - 1];
  const previousMonth = financeControlFailureTrends[financeControlFailureTrends.length - 2];
  const failureDelta = currentMonth.control_failures - previousMonth.control_failures;

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high": return <AlertTriangle className="h-5 w-5 text-status-risk" />;
      case "medium": return <Info className="h-5 w-5 text-status-warning" />;
      default: return <CheckCircle className="h-5 w-5 text-status-healthy" />;
    }
  };

  const getRiskBorderColor = (level: string) => {
    switch (level) {
      case "high": return "border-l-status-risk";
      case "medium": return "border-l-status-warning";
      default: return "border-l-status-healthy";
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="YTD Control Failures" value={totalFailures} status="warning" />
        <MetricCard title="Dec Failures" value={currentMonth.control_failures} delta={failureDelta} deltaLabel="vs Nov" status={failureDelta > 0 ? "warning" : "healthy"} />
        <MetricCard title="High Severity %" value={currentMonth.high_severity_pct} unit="%" status={currentMonth.high_severity_pct > 35 ? "risk" : "warning"} />
        <MetricCard title="Avg Financial Impact" value={`£${currentMonth.avg_financial_impact_usd}M`} status="warning" />
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Control Failure Trend</h3>
        <p className="text-sm text-muted-foreground mb-6">Monthly failures and severity distribution</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={financeControlFailureTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground text-xs" />
              <YAxis yAxisId="left" className="text-muted-foreground text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-muted-foreground text-xs" tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }} />
              <Legend />
              <Bar yAxisId="left" dataKey="control_failures" name="Control Failures" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="high_severity_pct" name="High Severity %" stroke="hsl(var(--status-risk))" strokeWidth={2} dot={{ fill: "hsl(var(--status-risk))", strokeWidth: 2, r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Financial Impact Trend</h3>
        <p className="text-sm text-muted-foreground mb-6">Average financial impact per control failure (£M)</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={financeControlFailureTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground text-xs" />
              <YAxis className="text-muted-foreground text-xs" tickFormatter={(v) => `£${v}M`} domain={[1, 2]} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }} formatter={(value: number) => [`£${value}M`, "Avg Impact"]} />
              <Area type="monotone" dataKey="avg_financial_impact_usd" fill="hsl(var(--status-warning) / 0.2)" stroke="hsl(var(--status-warning))" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Risk Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financeRiskData.map((risk, index) => (
            <div key={index} className={`bg-card p-6 rounded-lg border-l-4 ${getRiskBorderColor(risk.risk_level)} border border-border`}>
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

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Control Failure Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Month</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Failures</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">High Severity %</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg Impact</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {financeControlFailureTrends.slice(-6).map((row, index) => {
                const status = row.high_severity_pct > 38 ? "risk" : row.high_severity_pct > 32 ? "warning" : "healthy";
                return (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium text-foreground">{row.month}</td>
                    <td className="py-3 px-4 text-foreground">{row.control_failures}</td>
                    <td className="py-3 px-4">
                      <span className={row.high_severity_pct > 35 ? "text-status-risk" : "text-foreground"}>
                        {row.high_severity_pct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-status-warning font-medium">£{row.avg_financial_impact_usd}M</td>
                    <td className="py-3 px-4"><StatusBadge status={status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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

      <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">What This Means</h3>
        <p className="text-muted-foreground mb-4">
          Control failures peaked at 23 in May (42% high severity) but have improved to 14 in December 
          (29% high severity). The downward trend indicates remediation efforts are working. However, 
          the liquidity risk from delayed settlements remains at medium level and requires continued 
          monitoring to prevent escalation.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Continue control remediation efforts — 39% reduction since May peak
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Increase monitoring frequency for clearing timeline metrics
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Escalate to Treasury if settlement delays exceed 48 hours
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ControlFailuresDashboard;
