import { cxJourneyFunnelData, cxRetentionCohortData } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
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
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
} from "recharts";

const FUNNEL_COLORS = [
  "hsl(220, 60%, 50%)",
  "hsl(220, 55%, 55%)",
  "hsl(220, 50%, 60%)",
  "hsl(220, 45%, 65%)",
];

const CXJourneyDashboard = () => {
  const conversionRate = (
    (cxJourneyFunnelData[cxJourneyFunnelData.length - 1].users /
      cxJourneyFunnelData[0].users) *
    100
  ).toFixed(1);

  const maxDropoff = Math.max(...cxJourneyFunnelData.map((d) => d.dropoff_pct));
  const biggestDropStage = cxJourneyFunnelData.find(
    (d) => d.dropoff_pct === maxDropoff
  )?.stage;

  const thirtyDayRetention =
    cxRetentionCohortData[cxRetentionCohortData.length - 1].retention_pct;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="Overall Conversion"
          value={conversionRate}
          unit="%"
          status="warning"
        />
        <MetricCard
          title="30-Day Retention"
          value={thirtyDayRetention}
          unit="%"
          status="warning"
        />
        <MetricCard
          title="Biggest Drop-off"
          value={biggestDropStage || "N/A"}
          status="risk"
        />
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
              <BarChart data={cxJourneyFunnelData} layout="vertical">
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
                  formatter={(value: number, name: string) => [
                    `${value} users`,
                    "Count",
                  ]}
                />
                <Bar dataKey="users" radius={[0, 4, 4, 0]}>
                  {cxJourneyFunnelData.map((_, index) => (
                    <Cell key={index} fill={FUNNEL_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention Curve */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Cohort Retention Curve (Nov 2024)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cxRetentionCohortData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month_number"
                  className="text-muted-foreground text-xs"
                  tickFormatter={(v) => `Month ${v}`}
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
                <Line
                  type="monotone"
                  dataKey="retention_pct"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                />
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
              {cxJourneyFunnelData.map((row, index) => (
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
                    {((row.users / cxJourneyFunnelData[0].users) * 100).toFixed(1)}
                    %
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
          Retention by Month
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
                    {row.cohort_month}
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
          The subscription stage shows the highest drop-off at 37.2%, indicating friction 
          in the conversion process. Combined with declining retention (55.1% at month 3), 
          this suggests that while users are interested, the value proposition may not be 
          clear enough to drive commitment and long-term engagement.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            A/B test subscription page to reduce 37.2% drop-off
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
