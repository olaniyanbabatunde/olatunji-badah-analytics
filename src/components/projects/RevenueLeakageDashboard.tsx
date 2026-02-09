import { financeDataQualityData, financeRevenueLeakageTrends } from "@/lib/data";
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
  LineChart,
  Line,
  Legend,
  ComposedChart,
  Area,
} from "recharts";

const RevenueLeakageDashboard = () => {
  const avgTrustScore = (
    financeDataQualityData.reduce((sum, d) => sum + d.overall_trust_score, 0) /
    financeDataQualityData.length
  ).toFixed(0);

  const issueCount = financeDataQualityData.filter(d => d.quality_status === "fair").length;
  
  const totalLeakage = financeRevenueLeakageTrends.reduce((sum, d) => sum + d.revenue_leakage_usd, 0);
  const currentMonth = financeRevenueLeakageTrends[financeRevenueLeakageTrends.length - 1];
  const previousMonth = financeRevenueLeakageTrends[financeRevenueLeakageTrends.length - 2];
  const leakageDelta = currentMonth.revenue_leakage_usd - previousMonth.revenue_leakage_usd;

  const qualityDimensions = financeDataQualityData.map(d => ({
    dataset: d.dataset_name.replace("_", " "),
    completeness: d.completeness_pct,
    validity: d.validity_pct,
    timeliness: d.timeliness_score,
    trust: d.overall_trust_score,
    status: d.quality_status,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="YTD Revenue Leakage" value={`£${totalLeakage}k`} status="risk" />
        <MetricCard title="Dec Leakage" value={`£${currentMonth.revenue_leakage_usd}k`} delta={leakageDelta} deltaLabel="vs Nov" status={leakageDelta > 0 ? "risk" : "healthy"} />
        <MetricCard title="Leakage Rate (Dec)" value={currentMonth.leakage_rate_pct.toFixed(1)} unit="%" target={3} status={currentMonth.leakage_rate_pct > 4 ? "risk" : "warning"} />
        <MetricCard title="Avg Trust Score" value={avgTrustScore} unit="/100" target={98} status="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Revenue Leakage Trend</h3>
          <p className="text-sm text-muted-foreground mb-6">Monthly leakage and rate</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={financeRevenueLeakageTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground text-xs" />
                <YAxis yAxisId="left" className="text-muted-foreground text-xs" tickFormatter={(v) => `£${v}k`} />
                <YAxis yAxisId="right" orientation="right" className="text-muted-foreground text-xs" tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}
                  formatter={(value: number, name: string) => {
                    if (name === "Leakage") return [`£${value}k`, name];
                    return [`${value}%`, name];
                  }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue_leakage_usd" name="Leakage" fill="hsl(var(--status-risk) / 0.2)" stroke="hsl(var(--status-risk))" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="leakage_rate_pct" name="Leakage Rate %" stroke="hsl(var(--status-warning))" strokeWidth={2} dot={{ fill: "hsl(var(--status-warning))", strokeWidth: 2, r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Expected vs Actual Revenue</h3>
          <p className="text-sm text-muted-foreground mb-6">Monthly revenue comparison</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financeRevenueLeakageTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground text-xs" />
                <YAxis className="text-muted-foreground text-xs" tickFormatter={(v) => `£${v}k`} domain={[700, 1000]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}
                  formatter={(value: number) => [`£${value}k`]}
                />
                <Legend />
                <Line type="monotone" dataKey="expected_revenue_usd" name="Expected" stroke="hsl(var(--status-healthy))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="actual_revenue_usd" name="Actual" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Data Quality Dimensions</h3>
        <p className="text-sm text-muted-foreground mb-6">Completeness, validity, and timeliness scores by dataset</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityDimensions} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" domain={[80, 100]} className="text-muted-foreground text-xs" />
              <YAxis type="category" dataKey="dataset" className="text-muted-foreground text-xs" width={100} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }} />
              <Legend />
              <Bar dataKey="completeness" name="Completeness" fill="hsl(var(--status-healthy))" />
              <Bar dataKey="validity" name="Validity" fill="hsl(var(--primary))" />
              <Bar dataKey="timeliness" name="Timeliness" fill="hsl(var(--status-warning))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Revenue Leakage Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Month</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Expected Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actual Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Leakage</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Leakage Rate</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {financeRevenueLeakageTrends.slice(-6).map((row, index) => {
                const status = row.leakage_rate_pct > 4.5 ? "risk" : row.leakage_rate_pct > 3.5 ? "warning" : "healthy";
                return (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium text-foreground">{row.month}</td>
                    <td className="py-3 px-4 text-foreground">£{row.expected_revenue_usd}k</td>
                    <td className="py-3 px-4 text-foreground">£{row.actual_revenue_usd}k</td>
                    <td className="py-3 px-4 text-status-risk font-medium">£{row.revenue_leakage_usd}k</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.leakage_rate_pct}%</td>
                    <td className="py-3 px-4"><StatusBadge status={status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Data Quality Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Dataset</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Completeness</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Validity</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Timeliness</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trust Score</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {financeDataQualityData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground capitalize">{row.dataset_name.replace("_", " ")}</td>
                  <td className="py-3 px-4 text-foreground">{row.completeness_pct}%</td>
                  <td className="py-3 px-4 text-foreground">{row.validity_pct}%</td>
                  <td className="py-3 px-4">
                    <span className={row.timeliness_score < 90 ? "text-status-warning" : "text-foreground"}>
                      {row.timeliness_score}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-foreground">{row.overall_trust_score}</td>
                  <td className="py-3 px-4"><StatusBadge status={row.quality_status as any} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">What This Means</h3>
        <p className="text-muted-foreground mb-4">
          Year-to-date revenue leakage totals £{totalLeakage}k, with December showing the highest 
          monthly loss at £50k (5.1% leakage rate). The upward trend in leakage rate since September 
          requires attention. Data quality issues in the transactions dataset (timeliness score: 88) 
          correlate with reconciliation delays contributing to leakage.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Investigate December spike — £50k leakage is highest of the year
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Address transaction data pipeline delays to improve timeliness score above 90
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Set up automated alerts when leakage rate exceeds 4% threshold
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RevenueLeakageDashboard;
