import { financeDataQualityData } from "@/lib/data";
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
} from "recharts";

const RevenueLeakageDashboard = () => {
  const avgTrustScore = (
    financeDataQualityData.reduce((sum, d) => sum + d.overall_trust_score, 0) /
    financeDataQualityData.length
  ).toFixed(0);

  const issueCount = financeDataQualityData.filter(d => d.quality_status === "fair").length;
  
  // Estimated leakage based on trust score gap
  const trustGap = 100 - Number(avgTrustScore);
  const estimatedLeakage = (trustGap * 2500).toLocaleString(); // £2,500 per trust point gap

  // Quality dimension comparison
  const qualityDimensions = financeDataQualityData.map(d => ({
    dataset: d.dataset_name.replace("_", " "),
    completeness: d.completeness_pct,
    validity: d.validity_pct,
    timeliness: d.timeliness_score,
    trust: d.overall_trust_score,
    status: d.quality_status,
  }));

  // Simulated monthly trend
  const trendData = [
    { month: "Oct", trust_score: 93 },
    { month: "Nov", trust_score: 94 },
    { month: "Dec", trust_score: 92 },
    { month: "Jan", trust_score: 94.5 },
  ];

  return (
    <div className="space-y-8">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Trust Score"
          value={avgTrustScore}
          unit="/100"
          target={98}
          delta={-3.5}
          deltaLabel="vs target"
          status="warning"
        />
        <MetricCard
          title="Datasets Monitored"
          value={financeDataQualityData.length}
          status="healthy"
        />
        <MetricCard
          title="Quality Issues"
          value={issueCount}
          status={issueCount > 0 ? "warning" : "healthy"}
        />
        <MetricCard
          title="Est. Leakage Risk"
          value={`£${estimatedLeakage}`}
          status="risk"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trust Score by Dataset */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Trust Score by Dataset
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Target: 98+ for all critical datasets
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityDimensions}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="dataset" className="text-muted-foreground text-xs" />
                <YAxis domain={[80, 100]} className="text-muted-foreground text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value}`, "Trust Score"]}
                />
                <Bar dataKey="trust" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trust Score Trend */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Trust Score Trend
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Monthly average across all datasets
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground text-xs" />
                <YAxis domain={[90, 100]} className="text-muted-foreground text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`${value}`, "Trust Score"]}
                />
                <Line
                  type="monotone"
                  dataKey="trust_score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quality Dimensions Comparison */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Quality Dimensions Analysis
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Completeness, validity, and timeliness scores by dataset
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityDimensions} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" domain={[80, 100]} className="text-muted-foreground text-xs" />
              <YAxis type="category" dataKey="dataset" className="text-muted-foreground text-xs" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="completeness" name="Completeness" fill="hsl(var(--status-healthy))" />
              <Bar dataKey="validity" name="Validity" fill="hsl(var(--primary))" />
              <Bar dataKey="timeliness" name="Timeliness" fill="hsl(var(--status-warning))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Quality Summary Table */}
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

      {/* Executive Summary */}
      <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">What This Means</h3>
        <p className="text-muted-foreground mb-4">
          The transactions dataset has a timeliness score of 88, pulling its trust score down 
          to 92 ("fair" status). This delayed data availability creates revenue leakage risk 
          through late reconciliation, duplicate processing, and missed billing windows. 
          The customer master dataset maintains strong quality (97/100).
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Investigate transaction data pipeline delays causing timeliness gap
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Set up automated alerts when timeliness drops below 90
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Prioritise transactions dataset for next audit cycle review
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RevenueLeakageDashboard;