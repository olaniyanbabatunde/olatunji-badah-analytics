import { financeDataQualityData } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
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
} from "recharts";

const FinanceDataQualityDashboard = () => {
  const avgTrustScore =
    financeDataQualityData.reduce((sum, d) => sum + d.overall_trust_score, 0) /
    financeDataQualityData.length;

  const radarData = financeDataQualityData.map((d) => ({
    dataset: d.dataset_name,
    Completeness: d.completeness_pct,
    Validity: d.validity_pct,
    Timeliness: d.timeliness_score,
  }));

  return (
    <div className="space-y-8">
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
          value={financeDataQualityData.length}
          status="healthy"
        />
        <MetricCard
          title="Quality Issues"
          value="1"
          status="warning"
        />
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
              <BarChart data={financeDataQualityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="dataset_name"
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
                  formatter={(value: number) => [`${value}`, "Trust Score"]}
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
              <RadarChart data={financeDataQualityData}>
                <PolarGrid className="stroke-border" />
                <PolarAngleAxis
                  dataKey="dataset_name"
                  className="text-muted-foreground text-xs"
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
              {financeDataQualityData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground capitalize">
                    {row.dataset_name.replace("_", " ")}
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
          The customer_master dataset maintains excellent quality (97/100 trust score), 
          while the transactions dataset requires attention with a timeliness score of 88, 
          pulling the overall trust score down to 92 ("fair"). This delay in transaction 
          data availability could impact regulatory reporting timelines.
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
            Prioritize transactions dataset for next audit cycle review
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FinanceDataQualityDashboard;
