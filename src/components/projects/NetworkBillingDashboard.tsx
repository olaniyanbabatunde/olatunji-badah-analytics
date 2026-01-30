import { telecomKPIData, telecomIncidentData } from "@/lib/data";
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
  Cell,
  LineChart,
  Line,
} from "recharts";

const NetworkBillingDashboard = () => {
  // Aggregate KPIs
  const avgUptime = (
    telecomKPIData.reduce((sum, d) => sum + d.uptime_pct, 0) / telecomKPIData.length
  ).toFixed(2);
  
  const regionsAtRisk = telecomKPIData.filter(d => d.sla_status !== "healthy").length;
  const totalIncidents = telecomIncidentData.reduce((sum, d) => sum + d.incident_count, 0);
  
  const chartData = telecomKPIData.map((d) => ({
    region: d.region,
    uptime: d.uptime_pct,
    target: d.uptime_target_pct,
    status: d.sla_status,
  }));

  // Simulated monthly trend data (enterprise dashboards show trends)
  const trendData = [
    { month: "Oct", uptime: 99.4 },
    { month: "Nov", uptime: 99.5 },
    { month: "Dec", uptime: 99.3 },
    { month: "Jan", uptime: 99.45 },
  ];

  const getBarColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "hsl(var(--status-healthy))";
      case "warning":
        return "hsl(var(--status-warning))";
      default:
        return "hsl(var(--status-risk))";
    }
  };

  return (
    <div className="space-y-8">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Network Uptime"
          value={avgUptime}
          unit="%"
          target={99.5}
          delta={-0.05}
          deltaLabel="vs target"
          status="warning"
        />
        <MetricCard
          title="Regions at Risk"
          value={regionsAtRisk}
          status={regionsAtRisk > 0 ? "warning" : "healthy"}
        />
        <MetricCard
          title="Service Incidents"
          value={totalIncidents}
          delta={-3}
          deltaLabel="vs last month"
          status="warning"
        />
        <MetricCard
          title="SLA Compliance"
          value="50"
          unit="%"
          status="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Regional Uptime vs Target
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Target: 99.5% uptime across all regions
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  type="number"
                  domain={[98, 100]}
                  tickFormatter={(v) => `${v}%`}
                  className="text-muted-foreground text-xs"
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  className="text-muted-foreground text-xs"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value}%`, "Uptime"]}
                />
                <Bar dataKey="uptime" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Uptime Trend */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Network Uptime Trend
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Monthly average across all regions
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  className="text-muted-foreground text-xs"
                />
                <YAxis
                  domain={[99, 100]}
                  className="text-muted-foreground text-xs"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value}%`, "Uptime"]}
                />
                <Line
                  type="monotone"
                  dataKey="uptime"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SLA Status Summary */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          SLA Status by Region
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Region</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Uptime</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Target</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Delta</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {telecomKPIData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">{row.region}</td>
                  <td className="py-3 px-4 text-foreground">{row.uptime_pct}%</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.uptime_target_pct}%</td>
                  <td className="py-3 px-4">
                    <span className={row.uptime_delta_vs_target >= 0 ? "text-status-healthy" : "text-status-risk"}>
                      {row.uptime_delta_vs_target > 0 ? "+" : ""}{row.uptime_delta_vs_target}%
                    </span>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={row.sla_status as any} /></td>
                  <td className="py-3 px-4"><StatusBadge status={row.risk_level as any} /></td>
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
          The North region is operating 0.3% below SLA target (99.2% vs 99.5%), placing it in 
          a warning state with medium risk. This gap, while appearing small, translates to 
          approximately 2.2 hours of additional downtime per month and potential SLA penalty 
          exposure for enterprise customers.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Prioritise maintenance resources in the North region to close the 0.3% gap
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Review incident patterns contributing to downtime (Power Failures, Fiber Cuts)
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Proactively communicate with enterprise customers about service improvements
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkBillingDashboard;