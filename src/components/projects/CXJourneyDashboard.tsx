import { useState, useMemo } from "react";
import { cxJourneyFunnelData, cxRetentionCohortData } from "@/lib/data";
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
  LineChart,
  Line,
  Cell,
  Legend,
} from "recharts";

const FUNNEL_COLORS = [
  "hsl(220, 60%, 50%)",
  "hsl(220, 55%, 55%)",
  "hsl(220, 50%, 60%)",
  "hsl(220, 45%, 65%)",
];

const COHORT_COLORS = [
  "hsl(220, 60%, 50%)",
  "hsl(145, 60%, 40%)",
  "hsl(38, 90%, 50%)",
  "hsl(0, 70%, 55%)",
  "hsl(280, 60%, 50%)",
  "hsl(180, 60%, 40%)",
];

const CXJourneyDashboard = () => {
  const months = useMemo(() => {
    return [...new Set(cxJourneyFunnelData.map((d) => d.month))].sort();
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const filteredFunnelData = useMemo(() => {
    return cxJourneyFunnelData.filter((d) => d.month === selectedMonth);
  }, [selectedMonth]);

  const conversionRate = useMemo(() => {
    if (filteredFunnelData.length === 0) return "0";
    const firstStage = filteredFunnelData[0]?.users || 1;
    const lastStage = filteredFunnelData[filteredFunnelData.length - 1]?.users || 0;
    return ((lastStage / firstStage) * 100).toFixed(1);
  }, [filteredFunnelData]);

  const maxDropoff = useMemo(() => {
    return Math.max(...filteredFunnelData.map((d) => d.dropoff_pct));
  }, [filteredFunnelData]);

  const biggestDropStage = filteredFunnelData.find(
    (d) => d.dropoff_pct === maxDropoff
  )?.stage;

  const latestRetention = cxRetentionCohortData.find(
    (d) => d.month_number === 1
  )?.retention_pct || 0;

  // Funnel trend data
  const funnelTrendData = useMemo(() => {
    return months.map((month) => {
      const monthData = cxJourneyFunnelData.filter((d) => d.month === month);
      const signup = monthData.find((d) => d.stage === "Signup")?.users || 0;
      const retention = monthData.find((d) => d.stage === "Retention (30d)")?.users || 0;
      return {
        month,
        signups: signup,
        retained: retention,
        conversion: signup > 0 ? parseFloat(((retention / signup) * 100).toFixed(1)) : 0,
      };
    });
  }, [months]);

  // Cohort comparison data
  const cohortComparisonData = useMemo(() => {
    const cohorts = [...new Set(cxRetentionCohortData.map((d) => d.cohort_month))];
    const maxMonths = Math.max(...cxRetentionCohortData.map((d) => d.month_number));
    
    return Array.from({ length: maxMonths }, (_, i) => {
      const monthNum = i + 1;
      const entry: Record<string, any> = { month_number: monthNum };
      cohorts.forEach((cohort) => {
        const record = cxRetentionCohortData.find(
          (d) => d.cohort_month === cohort && d.month_number === monthNum
        );
        entry[cohort] = record?.retention_pct || null;
      });
      return entry;
    });
  }, []);

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  const formatCohort = (cohort: string) => {
    const [year, monthNum] = cohort.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
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
          title="Overall Conversion"
          value={conversionRate}
          unit="%"
          status="warning"
        />
        <MetricCard
          title="Month 1 Retention"
          value={latestRetention}
          unit="%"
          status="warning"
        />
        <MetricCard
          title="Biggest Drop-off"
          value={biggestDropStage || "N/A"}
          status="risk"
        />
      </div>

      {/* Conversion Trend */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Funnel Performance Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={funnelTrendData}>
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
                tickFormatter={(v) => `${v}%`}
                domain={[0, 50]}
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
                dataKey="signups"
                stroke="hsl(220, 60%, 50%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Signups"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="retained"
                stroke="hsl(145, 60%, 40%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Retained (30d)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversion"
                stroke="hsl(38, 90%, 50%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                name="Conversion %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Journey Funnel */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Customer Journey Funnel
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredFunnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  type="number"
                  className="text-muted-foreground text-xs"
                />
                <YAxis
                  type="category"
                  dataKey="stage"
                  className="text-muted-foreground text-xs"
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value} users`, "Count"]}
                />
                <Bar dataKey="users" radius={[0, 4, 4, 0]}>
                  {filteredFunnelData.map((_, index) => (
                    <Cell key={index} fill={FUNNEL_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cohort Retention Curves */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Cohort Retention Curves
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cohortComparisonData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month_number"
                  className="text-muted-foreground text-xs"
                  tickFormatter={(v) => `M${v}`}
                />
                <YAxis
                  domain={[0, 100]}
                  className="text-muted-foreground text-xs"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value}%`, "Retention"]}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Legend formatter={formatCohort} />
                {[...new Set(cxRetentionCohortData.map((d) => d.cohort_month))].map(
                  (cohort, index) => (
                    <Line
                      key={cohort}
                      type="monotone"
                      dataKey={cohort}
                      stroke={COHORT_COLORS[index % COHORT_COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                  )
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Funnel Detail Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Funnel Stage Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Stage
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Users
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Drop-off %
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Conversion from Start
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFunnelData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">
                    {row.stage}
                  </td>
                  <td className="py-3 px-4 text-foreground">{row.users}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        row.dropoff_pct > 30
                          ? "text-status-risk"
                          : row.dropoff_pct > 20
                          ? "text-status-warning"
                          : "text-status-healthy"
                      }
                    >
                      {row.dropoff_pct}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {((row.users / (filteredFunnelData[0]?.users || 1)) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retention Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Retention by Cohort
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Cohort
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Month
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Retention %
                </th>
              </tr>
            </thead>
            <tbody>
              {cxRetentionCohortData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">
                    {formatCohort(row.cohort_month)}
                  </td>
                  <td className="py-3 px-4 text-foreground">{row.month_number}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        row.retention_pct > 70
                          ? "text-status-healthy"
                          : row.retention_pct > 55
                          ? "text-status-warning"
                          : "text-status-risk"
                      }
                    >
                      {row.retention_pct}%
                    </span>
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
          Cohort analysis reveals improving retention trends—month 1 retention increased from 
          75.2% (Aug '24) to 80.1% (Jan '25). The funnel shows steady growth in signups 
          (980 → 1,200) with improving conversion rates. However, the subscription stage 
          remains the primary friction point with 37%+ drop-off consistently.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            A/B test subscription page to reduce 37% drop-off
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Implement onboarding improvements targeting "First Activity" stage
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Launch re-engagement campaign at day 21 to improve 30-day retention
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CXJourneyDashboard;
