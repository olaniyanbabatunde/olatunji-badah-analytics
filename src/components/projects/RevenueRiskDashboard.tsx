import { telecomIncidentData, telecomRevenueRiskTrends, telecomServiceErrorTrends } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from "recharts";

const COLORS = ["hsl(var(--status-risk))", "hsl(var(--status-warning))", "hsl(var(--status-healthy))", "hsl(var(--muted-foreground))"];

const RevenueRiskDashboard = () => {
  const totalIncidents = telecomIncidentData.reduce((sum, d) => sum + d.incident_count, 0);
  const avgResolution = (
    telecomIncidentData.reduce((sum, d) => sum + d.avg_resolution_hours, 0) /
    telecomIncidentData.length
  ).toFixed(1);

  // Calculate totals from trend data
  const totalRevenueAtRisk = telecomRevenueRiskTrends.reduce((sum, d) => sum + d.revenue_at_risk_usd, 0);
  const currentMonthRisk = telecomRevenueRiskTrends[telecomRevenueRiskTrends.length - 1];
  const previousMonthRisk = telecomRevenueRiskTrends[telecomRevenueRiskTrends.length - 2];
  const riskDelta = currentMonthRisk.revenue_at_risk_usd - previousMonthRisk.revenue_at_risk_usd;

  const pieData = telecomIncidentData.map((d) => ({
    name: d.incident_type,
    value: d.incident_count,
    pct: Math.round(d.pct_of_total_incidents * 100),
  }));

  return (
    <div className="space-y-8">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="YTD Revenue at Risk"
          value={`$${(totalRevenueAtRisk / 1000).toFixed(0)}k`}
          status="risk"
        />
        <MetricCard
          title="Dec Revenue at Risk"
          value={`$${currentMonthRisk.revenue_at_risk_usd}k`}
          delta={riskDelta}
          deltaLabel="vs Nov"
          status={riskDelta > 0 ? "warning" : "healthy"}
        />
        <MetricCard
          title="Avg Resolution Time"
          value={avgResolution}
          unit=" hrs"
          status="warning"
        />
        <MetricCard
          title="Leakage Rate (Dec)"
          value={currentMonthRisk.leakage_rate_pct.toFixed(1)}
          unit="%"
          status={currentMonthRisk.leakage_rate_pct > 4 ? "warning" : "healthy"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Type Distribution */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Service Error Distribution
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Breakdown by error type this month
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number, name: string) => [`${value} incidents`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue at Risk Trend - from new dataset */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Revenue at Risk Trend
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Monthly revenue exposure (North region)
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={telecomRevenueRiskTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground text-xs" />
                <YAxis
                  yAxisId="left"
                  className="text-muted-foreground text-xs"
                  tickFormatter={(v) => `$${v}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  className="text-muted-foreground text-xs"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "Revenue at Risk") return [`$${value}k`, name];
                    return [`${value}%`, name];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue_at_risk_usd"
                  name="Revenue at Risk"
                  fill="hsl(var(--status-risk) / 0.2)"
                  stroke="hsl(var(--status-risk))"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="leakage_rate_pct"
                  name="Leakage Rate %"
                  stroke="hsl(var(--status-warning))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--status-warning))", strokeWidth: 2, r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Billing Error Trends - from new dataset */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Billing Error Trends
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Monthly billing errors and average loss per error
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={telecomServiceErrorTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground text-xs" />
              <YAxis
                yAxisId="left"
                className="text-muted-foreground text-xs"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-muted-foreground text-xs"
                tickFormatter={(v) => `$${v}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="billing_errors_count"
                name="Error Count"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avg_error_loss_usd"
                name="Avg Loss (k)"
                stroke="hsl(var(--status-risk))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--status-risk))", strokeWidth: 2, r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution Time by Error Type */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Resolution Time by Error Type
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Average hours to resolve each error category
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={telecomIncidentData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="incident_type" className="text-muted-foreground text-xs" tick={{ fontSize: 11 }} />
              <YAxis className="text-muted-foreground text-xs" tickFormatter={(v) => `${v}h`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number) => [`${value} hours`, "Avg Resolution"]}
              />
              <Bar dataKey="avg_resolution_hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Risk Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Revenue Risk Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Month</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Expected Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actual Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue at Risk</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Leakage Rate</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {telecomRevenueRiskTrends.slice(-6).map((row, index) => {
                const status = row.leakage_rate_pct > 5 ? "risk" : row.leakage_rate_pct > 4 ? "warning" : "healthy";
                return (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium text-foreground">{row.month}</td>
                    <td className="py-3 px-4 text-foreground">${row.expected_revenue_usd}k</td>
                    <td className="py-3 px-4 text-foreground">${row.actual_revenue_usd}k</td>
                    <td className="py-3 px-4 text-status-risk font-medium">${row.revenue_at_risk_usd}k</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.leakage_rate_pct}%</td>
                    <td className="py-3 px-4"><StatusBadge status={status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">What This Means</h3>
        <p className="text-muted-foreground mb-4">
          Year-to-date revenue at risk totals ${(totalRevenueAtRisk / 1000).toFixed(0)}k, with the highest 
          exposure in May ($27k, 5.9% leakage rate). Billing errors peaked at 140 in May but have declined 
          44% to 95 in December. The correlation between billing errors and revenue risk is clear — 
          continued error reduction directly protects revenue.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Maintain billing process improvements to sustain the downward error trend
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Target leakage rate below 4% — currently at 3.7%, meeting benchmark
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Pre-position fiber repair teams to reduce 11.2-hour resolution time for fiber cuts
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RevenueRiskDashboard;
