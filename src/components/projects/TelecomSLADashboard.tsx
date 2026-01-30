import { telecomKPIData } from "@/lib/data";
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
} from "recharts";

const TelecomSLADashboard = () => {
  const chartData = telecomKPIData.map((d) => ({
    region: d.region,
    uptime: d.uptime_pct,
    target: d.uptime_target_pct,
    status: d.sla_status,
  }));

  const getBarColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "hsl(145, 60%, 40%)";
      case "warning":
        return "hsl(38, 90%, 50%)";
      default:
        return "hsl(0, 70%, 55%)";
    }
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {telecomKPIData.map((kpi, index) => (
          <MetricCard
            key={index}
            title={`${kpi.region} Region Uptime`}
            value={kpi.uptime_pct}
            unit="%"
            target={kpi.uptime_target_pct}
            delta={kpi.uptime_delta_vs_target}
            deltaLabel="vs target"
            status={kpi.sla_status as any}
          />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Regional Uptime vs Target
        </h3>
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

      {/* Summary Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          SLA Status Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Region
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Uptime
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Target
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Delta
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Risk
                </th>
              </tr>
            </thead>
            <tbody>
              {telecomKPIData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">
                    {row.region}
                  </td>
                  <td className="py-3 px-4 text-foreground">{row.uptime_pct}%</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {row.uptime_target_pct}%
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        row.uptime_delta_vs_target >= 0
                          ? "text-status-healthy"
                          : "text-status-risk"
                      }
                    >
                      {row.uptime_delta_vs_target > 0 ? "+" : ""}
                      {row.uptime_delta_vs_target}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={row.sla_status as any} />
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={row.risk_level as any} />
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
          The North region is currently operating below SLA targets (-0.3% vs target), 
          indicating medium risk. Immediate attention is required to prevent SLA breach 
          penalties and maintain customer satisfaction. The South region is performing 
          within healthy parameters.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Prioritize maintenance resources in the North region
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Review incident patterns contributing to downtime
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Proactively communicate with affected enterprise customers
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TelecomSLADashboard;
