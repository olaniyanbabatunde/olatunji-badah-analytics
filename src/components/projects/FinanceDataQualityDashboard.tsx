import { useState, useMemo } from "react";
import { financeDataQualityData } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import MonthSelector from "@/components/MonthSelector";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";

const FinanceDataQualityDashboard = () => {
  const months = useMemo(() => {
    return [...new Set(financeDataQualityData.map((d) => d.month))].sort();
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const filteredData = useMemo(() => {
    return financeDataQualityData.filter((d) => d.month === selectedMonth);
  }, [selectedMonth]);

  const avgTrustScore =
    filteredData.reduce((sum, d) => sum + d.overall_trust_score, 0) /
    (filteredData.length || 1);

  const qualityIssues = filteredData.filter(
    (d) => d.quality_status === "warning" || d.quality_status === "fair"
  ).length;

  // Trend data for line chart
  const trendData = useMemo(() => {
    const datasets = [...new Set(financeDataQualityData.map((d) => d.dataset_name))];
    return months.map((month) => {
      const entry: Record<string, any> = { month };
      datasets.forEach((dataset) => {
        const record = financeDataQualityData.find(
          (d) => d.month === month && d.dataset_name === dataset
        );
        entry[dataset] = record?.overall_trust_score || null;
      });
      return entry;
    });
  }, [months]);

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  const formatDatasetName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const DATASET_COLORS: Record<string, string> = {
    transactions: "hsl(38, 90%, 50%)",
    customer_master: "hsl(145, 60%, 40%)",
    accounts_payable: "hsl(0, 70%, 55%)",
    market_data: "hsl(220, 60%, 50%)",
    regulatory_reports: "hsl(280, 60%, 50%)",
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
          title="Avg Trust Score"
          value={avgTrustScore.toFixed(0)}
          unit="/100"
          status="good"
        />
        <MetricCard
          title="Datasets Monitored"
          value={filteredData.length}
          status="healthy"
        />
        <MetricCard
          title="Quality Issues"
          value={qualityIssues}
          status={qualityIssues > 2 ? "risk" : qualityIssues > 0 ? "warning" : "healthy"}
        />
      </div>

      {/* Trust Score Trend */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Trust Score Trend by Dataset
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                className="text-muted-foreground text-xs"
              />
              <YAxis
                domain={[80, 100]}
                className="text-muted-foreground text-xs"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                labelFormatter={(label) => formatMonth(label as string)}
                formatter={(value: number, name: string) => [value, formatDatasetName(name)]}
              />
              <Legend formatter={formatDatasetName} />
              {Object.keys(DATASET_COLORS).map((dataset) => (
                <Line
                  key={dataset}
                  type="monotone"
                  dataKey={dataset}
                  stroke={DATASET_COLORS[dataset]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trust Score by Dataset */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Trust Score by Dataset
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="dataset_name"
                  className="text-muted-foreground text-xs"
                  tickFormatter={formatDatasetName}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  domain={[80, 100]}
                  className="text-muted-foreground text-xs"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value}`, "Trust Score"]}
                  labelFormatter={formatDatasetName}
                />
                <Bar
                  dataKey="overall_trust_score"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Dimensions */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Quality Dimensions Comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={filteredData}>
                <PolarGrid className="stroke-border" />
                <PolarAngleAxis
                  dataKey="dataset_name"
                  className="text-muted-foreground text-xs"
                  tickFormatter={formatDatasetName}
                  tick={{ fontSize: 9 }}
                />
                <PolarRadiusAxis
                  domain={[80, 100]}
                  className="text-muted-foreground text-xs"
                />
                <Radar
                  name="Completeness"
                  dataKey="completeness_pct"
                  stroke="hsl(145, 60%, 40%)"
                  fill="hsl(145, 60%, 40%)"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Validity"
                  dataKey="validity_pct"
                  stroke="hsl(220, 60%, 50%)"
                  fill="hsl(220, 60%, 50%)"
                  fillOpacity={0.3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Data Quality Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Dataset
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Completeness
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Validity
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Timeliness
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Trust Score
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground capitalize">
                    {formatDatasetName(row.dataset_name)}
                  </td>
                  <td className="py-3 px-4 text-foreground">
                    {row.completeness_pct}%
                  </td>
                  <td className="py-3 px-4 text-foreground">{row.validity_pct}%</td>
                  <td className="py-3 px-4 text-foreground">
                    {row.timeliness_score}
                  </td>
                  <td className="py-3 px-4 font-semibold text-foreground">
                    {row.overall_trust_score}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={row.quality_status as any} />
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
          The trend analysis shows consistent improvement across all datasets over the 4-month 
          period. Market data maintains excellent quality (99), while accounts payable shows the 
          most improvement, rising from 84 to 89. Transactions and accounts payable remain areas 
          requiring attention to meet the 95+ trust score threshold for regulatory confidence.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Investigate transaction data pipeline delays
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Set up automated alerts when timeliness drops below 90
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Prioritize accounts payable for next audit cycle review
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FinanceDataQualityDashboard;
