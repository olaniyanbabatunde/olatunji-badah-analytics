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
  Cell,
} from "recharts";

const SupportRetentionDashboard = () => {
  const initialUsers = cxJourneyFunnelData[0].users;
  const retainedUsers = cxJourneyFunnelData[cxJourneyFunnelData.length - 1].users;
  const conversionRate = ((retainedUsers / initialUsers) * 100).toFixed(1);

  const maxDropoff = Math.max(...cxJourneyFunnelData.map((d) => d.dropoff_pct));
  const biggestDropStage = cxJourneyFunnelData.find((d) => d.dropoff_pct === maxDropoff)?.stage;

  const thirtyDayRetention = cxRetentionCohortData[cxRetentionCohortData.length - 1].retention_pct;

  // Estimated revenue impact
  const lostCustomers = initialUsers - retainedUsers;
  const avgCustomerValue = 125; // £125 monthly value
  const revenueImpact = (lostCustomers * avgCustomerValue).toLocaleString();

  // Funnel colors
  const getFunnelColor = (dropoff: number) => {
    if (dropoff > 30) return "hsl(var(--status-risk))";
    if (dropoff > 20) return "hsl(var(--status-warning))";
    return "hsl(var(--primary))";
  };

  // Monthly retention trend
  const retentionTrendData = [
    { month: "Oct", retention: 58.2 },
    { month: "Nov", retention: 55.1 },
    { month: "Dec", retention: 52.8 },
    { month: "Jan", retention: 55.1 },
  ];

  return (
    <div className="space-y-8">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          delta={-3.1}
          deltaLabel="vs target"
          status="warning"
        />
        <MetricCard
          title="Biggest Drop-off"
          value={biggestDropStage || "N/A"}
          status="risk"
        />
        <MetricCard
          title="Revenue at Risk"
          value={`£${revenueImpact}`}
          status="risk"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Journey Funnel */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Customer Journey Funnel
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            User progression through key stages
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cxJourneyFunnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-muted-foreground text-xs" />
                <YAxis type="category" dataKey="stage" className="text-muted-foreground text-xs" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value} users`, "Count"]}
                />
                <Bar dataKey="users" radius={[0, 4, 4, 0]}>
                  {cxJourneyFunnelData.map((entry, index) => (
                    <Cell key={index} fill={getFunnelColor(entry.dropoff_pct)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention Trend */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            30-Day Retention Trend
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Monthly retention rate for acquired users
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground text-xs" />
                <YAxis domain={[40, 70]} className="text-muted-foreground text-xs" tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value}%`, "Retention"]}
                />
                <Line
                  type="monotone"
                  dataKey="retention"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cohort Retention Curve */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Cohort Retention Curve (Nov 2024)
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Retention decay over first 3 months
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cxRetentionCohortData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month_number"
                className="text-muted-foreground text-xs"
                tickFormatter={(v) => `Month ${v}`}
              />
              <YAxis domain={[0, 100]} className="text-muted-foreground text-xs" tickFormatter={(v) => `${v}%`} />
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

      {/* Funnel Analysis Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Funnel Stage Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stage</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Users</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Drop-off</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Conversion from Start</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue Impact</th>
              </tr>
            </thead>
            <tbody>
              {cxJourneyFunnelData.map((row, index) => {
                const droppedUsers = index === 0 ? 0 : cxJourneyFunnelData[index - 1].users - row.users;
                const revenueImpactValue = droppedUsers * avgCustomerValue;
                return (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium text-foreground">{row.stage}</td>
                    <td className="py-3 px-4 text-foreground">{row.users}</td>
                    <td className="py-3 px-4">
                      <span className={
                        row.dropoff_pct > 30 ? "text-status-risk" :
                        row.dropoff_pct > 20 ? "text-status-warning" :
                        "text-status-healthy"
                      }>
                        {row.dropoff_pct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {((row.users / initialUsers) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-status-risk font-medium">
                      {revenueImpactValue > 0 ? `£${revenueImpactValue.toLocaleString()}` : "—"}
                    </td>
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
          The subscription stage shows the highest drop-off at 37.2%, losing 320 users and 
          £{(320 * avgCustomerValue).toLocaleString()} in potential monthly revenue. Combined with 
          declining cohort retention (55.1% by month 3), this suggests friction in the conversion 
          process and unclear value proposition for long-term engagement.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            A/B test subscription page to reduce 37.2% drop-off rate
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

export default SupportRetentionDashboard;