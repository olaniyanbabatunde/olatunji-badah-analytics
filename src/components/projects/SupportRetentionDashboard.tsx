import { cxJourneyFunnelData, cxRetentionCohortData, cxSupportTrendMetrics, cxRevenueImpactTrends } from "@/lib/data";
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
  Legend,
  ComposedChart,
  Area,
} from "recharts";

const SupportRetentionDashboard = () => {
  const initialUsers = cxJourneyFunnelData[0].users;
  const retainedUsers = cxJourneyFunnelData[cxJourneyFunnelData.length - 1].users;
  const conversionRate = ((retainedUsers / initialUsers) * 100).toFixed(1);

  const maxDropoff = Math.max(...cxJourneyFunnelData.map((d) => d.dropoff_pct));
  const biggestDropStage = cxJourneyFunnelData.find((d) => d.dropoff_pct === maxDropoff)?.stage;

  // Get current month stats from trend data
  const currentSupport = cxSupportTrendMetrics[cxSupportTrendMetrics.length - 1];
  const previousSupport = cxSupportTrendMetrics[cxSupportTrendMetrics.length - 2];
  const ticketDelta = currentSupport.support_tickets - previousSupport.support_tickets;

  const currentRevenue = cxRevenueImpactTrends[cxRevenueImpactTrends.length - 1];

  // Funnel colors
  const getFunnelColor = (dropoff: number) => {
    if (dropoff > 30) return "hsl(var(--status-risk))";
    if (dropoff > 20) return "hsl(var(--status-warning))";
    return "hsl(var(--primary))";
  };

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
          title="CSAT Score (Dec)"
          value={currentSupport.csat_score.toFixed(1)}
          unit="/5"
          delta={0.1}
          deltaLabel="vs Nov"
          status={currentSupport.csat_score >= 4 ? "healthy" : "warning"}
        />
        <MetricCard
          title="Support Tickets (Dec)"
          value={currentSupport.support_tickets}
          delta={ticketDelta}
          deltaLabel="vs Nov"
          status={ticketDelta < 0 ? "healthy" : "warning"}
        />
        <MetricCard
          title="Revenue at Risk (Dec)"
          value={`$${(currentRevenue.revenue_at_risk_usd / 1000).toFixed(1)}k`}
          status="warning"
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

        {/* Support Trend - from new dataset */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Support Operations Trend
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Monthly tickets, resolution time, and CSAT
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cxSupportTrendMetrics}>
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
                  domain={[3.5, 4.5]}
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
                  dataKey="support_tickets"
                  name="Support Tickets"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="csat_score"
                  name="CSAT Score"
                  stroke="hsl(var(--status-healthy))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--status-healthy))", strokeWidth: 2, r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Impact Trend - from new dataset */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Revenue Impact Trend
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Monthly revenue at risk vs retained revenue
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cxRevenueImpactTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground text-xs" />
              <YAxis
                className="text-muted-foreground text-xs"
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number) => [`$${(value / 1000).toFixed(1)}k`]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="retained_revenue_usd"
                name="Retained Revenue"
                fill="hsl(var(--status-healthy) / 0.2)"
                stroke="hsl(var(--status-healthy))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="revenue_at_risk_usd"
                name="Revenue at Risk"
                stroke="hsl(var(--status-risk))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--status-risk))", strokeWidth: 2, r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution Time Trend */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Resolution Time Trend
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Average hours to resolve support tickets
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cxSupportTrendMetrics}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground text-xs" />
              <YAxis
                className="text-muted-foreground text-xs"
                tickFormatter={(v) => `${v}h`}
                domain={[5, 8]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number) => [`${value} hours`, "Avg Resolution"]}
              />
              <Line
                type="monotone"
                dataKey="avg_resolution_hours"
                stroke="hsl(var(--status-warning))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--status-warning))", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
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

      {/* Support Trend Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Support Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Month</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tickets</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg Resolution</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">CSAT Score</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Active Customers</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue at Risk</th>
              </tr>
            </thead>
            <tbody>
              {cxSupportTrendMetrics.slice(-6).map((row, index) => {
                const revenueData = cxRevenueImpactTrends.find(r => r.month === row.month);
                return (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium text-foreground">{row.month}</td>
                    <td className="py-3 px-4 text-foreground">{row.support_tickets}</td>
                    <td className="py-3 px-4 text-foreground">{row.avg_resolution_hours}h</td>
                    <td className="py-3 px-4">
                      <span className={row.csat_score >= 4 ? "text-status-healthy" : "text-status-warning"}>
                        {row.csat_score}/5
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground">{revenueData?.active_customers.toLocaleString()}</td>
                    <td className="py-3 px-4 text-status-warning font-medium">
                      ${((revenueData?.revenue_at_risk_usd || 0) / 1000).toFixed(1)}k
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
              </tr>
            </thead>
            <tbody>
              {cxJourneyFunnelData.map((row, index) => (
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
          Support operations improved significantly from May (820 tickets, 7.5h resolution, 3.8 CSAT) 
          to December (670 tickets, 6.2h resolution, 4.4 CSAT). Revenue at risk declined from 
          $5.3k to $4.4k as retention improved. The subscription stage remains the biggest 
          conversion challenge at 37.2% drop-off.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            A/B test subscription page to reduce 37.2% drop-off rate
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Maintain CSAT improvements — now at 4.4, above 4.0 target
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Continue ticket reduction efforts to sustain the downward trend
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SupportRetentionDashboard;
