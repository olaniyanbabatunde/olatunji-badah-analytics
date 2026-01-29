import { useState, useMemo } from "react";
import { telecomIncidentData } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
import MonthSelector from "@/components/MonthSelector";
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

const COLORS = ["hsl(0, 70%, 55%)", "hsl(38, 90%, 50%)", "hsl(145, 60%, 40%)", "hsl(215, 20%, 55%)"];

const TelecomChurnDashboard = () => {
  const months = useMemo(() => {
    return [...new Set(telecomIncidentData.map((d) => d.month))].sort();
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const filteredData = useMemo(() => {
    return telecomIncidentData.filter((d) => d.month === selectedMonth);
  }, [selectedMonth]);

  const totalIncidents = filteredData.reduce(
    (sum, d) => sum + d.incident_count,
    0
  );
  const avgResolution =
    filteredData.reduce((sum, d) => sum + d.avg_resolution_hours, 0) /
    (filteredData.length || 1);

  const pieData = useMemo(() => {
    const byType: Record<string, number> = {};
    filteredData.forEach((d) => {
      byType[d.incident_type] = (byType[d.incident_type] || 0) + d.incident_count;
    });
    const total = Object.values(byType).reduce((a, b) => a + b, 0);
    return Object.entries(byType).map(([name, value]) => ({
      name,
      value,
      pct: Math.round((value / total) * 100),
    }));
  }, [filteredData]);

  // Trend data for line chart - total incidents per month
  const trendData = useMemo(() => {
    return months.map((month) => {
      const monthData = telecomIncidentData.filter((d) => d.month === month);
      const total = monthData.reduce((sum, d) => sum + d.incident_count, 0);
      const avgRes =
        monthData.reduce((sum, d) => sum + d.avg_resolution_hours, 0) /
        (monthData.length || 1);
      return {
        month,
        incidents: total,
        avgResolution: parseFloat(avgRes.toFixed(1)),
      };
    });
  }, [months]);

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  return (
    <div className="space-y-8">
      {/* Month Selector */}
      <div className="flex justify-end">
        <MonthSelector
          months={months}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

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

      {/* Trend Chart */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Incident Trend Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                className="text-muted-foreground text-xs"
              />
              <YAxis
                yAxisId="left"
                className="text-muted-foreground text-xs"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(v) => `${v}h`}
                className="text-muted-foreground text-xs"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                labelFormatter={(label) => formatMonth(label as string)}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="incidents"
                stroke="hsl(0, 70%, 55%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Total Incidents"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgResolution"
                stroke="hsl(220, 60%, 50%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Avg Resolution (hrs)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
              <BarChart data={filteredData}>
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
              {filteredData.map((row, index) => (
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
          The trend shows a concerning increase in total incidents from 36 in Oct 2024 to 50 in 
          Jan 2025. Power failures remain the dominant incident type while fiber cuts take 
          the longest to resolve. This escalating pattern suggests potential infrastructure 
          vulnerabilities that, if repeated, could erode customer trust and trigger churn.
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
