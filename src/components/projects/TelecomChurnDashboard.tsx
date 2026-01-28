import { telecomIncidentData } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
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
} from "recharts";

const COLORS = ["hsl(0, 70%, 55%)", "hsl(38, 90%, 50%)", "hsl(145, 60%, 40%)", "hsl(215, 20%, 55%)"];

const TelecomChurnDashboard = () => {
  const totalIncidents = telecomIncidentData.reduce(
    (sum, d) => sum + d.incident_count,
    0
  );
  const avgResolution =
    telecomIncidentData.reduce((sum, d) => sum + d.avg_resolution_hours, 0) /
    telecomIncidentData.length;

  const pieData = telecomIncidentData.map((d) => ({
    name: d.incident_type,
    value: d.incident_count,
    pct: Math.round(d.pct_of_total_incidents * 100),
  }));

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="Total Incidents"
          value={totalIncidents}
          status="warning"
        />
        <MetricCard
          title="Avg Resolution Time"
          value={avgResolution.toFixed(1)}
          unit=" hrs"
          status="warning"
        />
        <MetricCard
          title="Top Incident Type"
          value="Power Failure"
          status="risk"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Breakdown */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Incident Distribution
          </h3>
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
                  formatter={(value: number, name: string) => [
                    `${value} incidents`,
                    name,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Times */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Resolution Time by Type
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={telecomIncidentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="incident_type"
                  className="text-muted-foreground text-xs"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  className="text-muted-foreground text-xs"
                  tickFormatter={(v) => `${v}h`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value} hours`, "Avg Resolution"]}
                />
                <Bar
                  dataKey="avg_resolution_hours"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Incident Detail
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Incident Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Region
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Count
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Avg Resolution
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {telecomIncidentData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">
                    {row.incident_type}
                  </td>
                  <td className="py-3 px-4 text-foreground">{row.region}</td>
                  <td className="py-3 px-4 text-foreground">{row.incident_count}</td>
                  <td className="py-3 px-4 text-foreground">
                    {row.avg_resolution_hours} hrs
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {Math.round(row.pct_of_total_incidents * 100)}%
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
          Power failures account for 42% of all incidents with the fastest resolution time 
          (6.4 hours), while fiber cuts take nearly twice as long to resolve (11.2 hours). 
          This pattern suggests potential infrastructure vulnerabilities that, if repeated, 
          could erode customer trust and trigger churn among enterprise accounts.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Invest in backup power infrastructure for high-incident regions
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Create proactive communication protocols for affected enterprise customers
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Reduce fiber cut resolution time through pre-positioned repair teams
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TelecomChurnDashboard;
