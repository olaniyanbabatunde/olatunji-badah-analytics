import { useState, useMemo } from "react";
import { financeRiskData } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import MonthSelector from "@/components/MonthSelector";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const FinanceRiskDashboard = () => {
  const months = useMemo(() => {
    return [...new Set(financeRiskData.map((d) => d.month))].sort();
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const filteredData = useMemo(() => {
    return financeRiskData.filter((d) => d.month === selectedMonth);
  }, [selectedMonth]);

  const mediumRisks = filteredData.filter((r) => r.risk_level === "medium").length;
  const lowRisks = filteredData.filter((r) => r.risk_level === "low").length;
  const highRisks = filteredData.filter((r) => r.risk_level === "high").length;

  // Trend data for risk level changes
  const trendData = useMemo(() => {
    return months.map((month) => {
      const monthData = financeRiskData.filter((d) => d.month === month);
      return {
        month,
        high: monthData.filter((d) => d.risk_level === "high").length,
        medium: monthData.filter((d) => d.risk_level === "medium").length,
        low: monthData.filter((d) => d.risk_level === "low").length,
      };
    });
  }, [months]);

  // Risk area trend
  const riskAreaTrend = useMemo(() => {
    const areas = [...new Set(financeRiskData.map((d) => d.risk_area))];
    return months.map((month) => {
      const entry: Record<string, any> = { month };
      areas.forEach((area) => {
        const record = financeRiskData.find(
          (d) => d.month === month && d.risk_area === area
        );
        // Convert risk level to numeric for trend visualization
        const levelMap: Record<string, number> = { low: 1, medium: 2, high: 3 };
        entry[area] = record ? levelMap[record.risk_level] : 0;
      });
      return entry;
    });
  }, [months]);

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-status-risk" />;
      case "medium":
        return <Info className="h-5 w-5 text-status-warning" />;
      default:
        return <CheckCircle className="h-5 w-5 text-status-healthy" />;
    }
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  const getBarColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "hsl(0, 70%, 55%)";
      case "medium":
        return "hsl(38, 90%, 50%)";
      default:
        return "hsl(145, 60%, 40%)";
    }
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
          title="High Risk Items"
          value={highRisks}
          status={highRisks > 0 ? "risk" : "healthy"}
        />
        <MetricCard
          title="Medium Risk Items"
          value={mediumRisks}
          status={mediumRisks > 0 ? "warning" : "healthy"}
        />
        <MetricCard
          title="Low Risk Items"
          value={lowRisks}
          status="healthy"
        />
      </div>

      {/* Risk Level Trend */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Risk Level Distribution Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                className="text-muted-foreground text-xs"
              />
              <YAxis className="text-muted-foreground text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                labelFormatter={(label) => formatMonth(label as string)}
              />
              <Legend />
              <Bar dataKey="high" stackId="a" fill="hsl(0, 70%, 55%)" name="High" />
              <Bar dataKey="medium" stackId="a" fill="hsl(38, 90%, 50%)" name="Medium" />
              <Bar dataKey="low" stackId="a" fill="hsl(145, 60%, 40%)" name="Low" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Area Status Chart */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Current Risk Status by Area
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" domain={[0, 3]} hide />
              <YAxis
                type="category"
                dataKey="risk_area"
                className="text-muted-foreground text-xs"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number) => {
                  const levels = ["", "Low", "Medium", "High"];
                  return [levels[value], "Risk Level"];
                }}
              />
              <Bar
                dataKey={(d) => {
                  const levelMap: Record<string, number> = { low: 1, medium: 2, high: 3 };
                  return levelMap[d.risk_level];
                }}
                radius={[0, 4, 4, 0]}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.risk_level)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.map((risk, index) => (
          <div
            key={index}
            className={`bg-card p-6 rounded-lg border-l-4 ${
              risk.risk_level === "high"
                ? "border-l-status-risk"
                : risk.risk_level === "medium"
                ? "border-l-status-warning"
                : "border-l-status-healthy"
            } border border-border`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getRiskIcon(risk.risk_level)}
                <h3 className="font-semibold text-foreground">{risk.risk_area}</h3>
              </div>
              <StatusBadge status={risk.risk_level as any} />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Driver
                </p>
                <p className="text-foreground">{risk.driver}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Recommended Action
                </p>
                <p className="text-foreground">{risk.recommended_action}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Register Table */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Risk Register
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Risk Area
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Level
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Driver
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">
                    {row.risk_area}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={row.risk_level as any} />
                  </td>
                  <td className="py-3 px-4 text-foreground">{row.driver}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {row.recommended_action}
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
          The historical view reveals that risk levels fluctuate month-to-month. December 2024 
          showed elevated risk in both Liquidity and Credit areas due to year-end pressures. 
          While Credit risk has normalized, Liquidity remains at medium due to ongoing settlement 
          delays requiring active monitoring.
        </p>
        <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Increase monitoring frequency for clearing timeline metrics
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Escalate to Treasury if settlement delays exceed 48 hours
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
            Maintain current operational controls given stable volumes
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FinanceRiskDashboard;
