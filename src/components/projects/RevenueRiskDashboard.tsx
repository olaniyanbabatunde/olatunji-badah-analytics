import { telecomIncidentData, telecomKPIData } from "@/lib/data";
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
} from "recharts";

const COLORS = ["hsl(var(--status-risk))", "hsl(var(--status-warning))", "hsl(var(--status-healthy))", "hsl(var(--muted-foreground))"];

const RevenueRiskDashboard = () => {
  const totalIncidents = telecomIncidentData.reduce((sum, d) => sum + d.incident_count, 0);
  const avgResolution = (
    telecomIncidentData.reduce((sum, d) => sum + d.avg_resolution_hours, 0) /
    telecomIncidentData.length
  ).toFixed(1);

  // Estimate revenue at risk (enterprise context)
  const estimatedRevenueAtRisk = (totalIncidents * 850).toLocaleString(); // £850 per incident avg

  const pieData = telecomIncidentData.map((d) => ({
    name: d.incident_type,
    value: d.incident_count,
    pct: Math.round(d.pct_of_total_incidents * 100),
  }));

  // Simulated monthly error trend
  const errorTrendData = [
    { month: "Oct", incidents: 25, revenue_risk: 21250 },
    { month: "Nov", incidents: 28, revenue_risk: 23800 },
    { month: "Dec", incidents: 20, revenue_risk: 17000 },
    { month: "Jan", incidents: 22, revenue_risk: 18700 },
  ];

  return (
    <div className="space-y-8">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Service Errors"
          value={totalIncidents}
          delta={2}
          deltaLabel="vs last month"
          status="warning"
        />
        <MetricCard
          title="Avg Resolution Time"
          value={avgResolution}
          unit=" hrs"
          status="warning"
        />
        <MetricCard
          title="Revenue at Risk"
          value={`£${estimatedRevenueAtRisk}`}
          status="risk"
        />
        <MetricCard
          title="Top Error Type"
          value="Power Failure"
          status="risk"
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

        {/* Revenue at Risk Trend */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Revenue at Risk Trend
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Monthly estimated revenue exposure from service errors
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground text-xs" />
                <YAxis
                  className="text-muted-foreground text-xs"
                  tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`£${value.toLocaleString()}`, "Revenue at Risk"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue_risk"
                  stroke="hsl(var(--status-risk))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--status-risk))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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

      {/* Incident Detail Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Service Error Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Error Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Region</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Count</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg Resolution</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">% of Total</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Est. Revenue Impact</th>
              </tr>
            </thead>
            <tbody>
              {telecomIncidentData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">{row.incident_type}</td>
                  <td className="py-3 px-4 text-foreground">{row.region}</td>
                  <td className="py-3 px-4 text-foreground">{row.incident_count}</td>
                  <td className="py-3 px-4 text-foreground">{row.avg_resolution_hours} hrs</td>
                  <td className="py-3 px-4 text-muted-foreground">{Math.round(row.pct_of_total_incidents * 100)}%</td>
                  <td className="py-3 px-4 text-status-risk font-medium">£{(row.incident_count * 850).toLocaleString()}</td>
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
          Power failures account for 42% of service errors with estimated revenue exposure of 
          £{(14 * 850).toLocaleString()} this month. While power failures resolve faster (6.4 hours), 
          fiber cuts take 75% longer (11.2 hours), extending customer impact and increasing 
          contract penalty risk for enterprise accounts.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Invest in backup power infrastructure for high-incident regions
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Pre-position fiber repair teams to reduce 11.2-hour resolution time
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Create proactive communication protocols for affected enterprise customers
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RevenueRiskDashboard;