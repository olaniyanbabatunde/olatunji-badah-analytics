import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Download, FileSpreadsheet } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProjectById } from "@/lib/data";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// CSV data mapped to projects
const projectCsvFiles: Record<string, { filename: string; description: string; data: string[][] }[]> = {
  "telecom-network-billing": [
    {
      filename: "telecom_kpi_overview_monthly.csv",
      description: "Monthly KPI overview by region — uptime, SLA status, and risk levels",
      data: [
        ["month", "region", "uptime_pct", "uptime_target_pct", "uptime_delta_vs_target", "uptime_delta_vs_last_month", "sla_status", "risk_level"],
        ["2025-01", "North", "99.2", "99.5", "-0.3", "-0.2", "warning", "medium"],
        ["2025-01", "South", "99.7", "99.5", "0.2", "0.1", "healthy", "low"],
      ],
    },
    {
      filename: "telecom_service_error_trends.csv",
      description: "Monthly billing error counts and error rates across service lines",
      data: [
        ["month", "billing_errors_count", "error_rate_pct", "avg_error_loss_gbp"],
        ["Jan", "85", "4.2", "1.1"],
        ["Feb", "90", "4.6", "1.2"],
        ["Mar", "110", "5.5", "1.3"],
        ["Apr", "120", "5.9", "1.4"],
        ["May", "140", "6.3", "1.6"],
        ["Jun", "135", "6.0", "1.5"],
        ["Jul", "128", "5.7", "1.4"],
        ["Aug", "122", "5.4", "1.4"],
        ["Sep", "118", "5.1", "1.3"],
        ["Oct", "105", "4.8", "1.2"],
        ["Nov", "98", "4.5", "1.1"],
        ["Dec", "95", "4.4", "1.1"],
      ],
    },
    {
      filename: "telecom_incident_summary_monthly.csv",
      description: "Incident breakdown by type — count, resolution time, and percentage of total",
      data: [
        ["month", "region", "incident_type", "incident_count", "avg_resolution_hours", "pct_of_total_incidents"],
        ["2025-01", "North", "Power Failure", "14", "6.4", "0.42"],
        ["2025-01", "North", "Fiber Cut", "8", "11.2", "0.24"],
      ],
    },
  ],
  "telecom-revenue-risk": [
    {
      filename: "telecom_revenue_risk_trends.csv",
      description: "Monthly revenue exposure — expected vs actual revenue with leakage rate",
      data: [
        ["month", "region", "expected_revenue_gbp", "actual_revenue_gbp", "revenue_at_risk_gbp", "leakage_rate_pct"],
        ["Jan", "North", "420", "410", "10", "2.4"],
        ["Feb", "North", "430", "415", "15", "3.5"],
        ["Mar", "North", "440", "420", "20", "4.5"],
        ["Apr", "North", "450", "430", "20", "4.4"],
        ["May", "North", "455", "428", "27", "5.9"],
        ["Jun", "North", "460", "440", "20", "4.3"],
        ["Jul", "North", "465", "445", "20", "4.3"],
        ["Aug", "North", "470", "448", "22", "4.7"],
        ["Sep", "North", "475", "450", "25", "5.2"],
        ["Oct", "North", "480", "460", "20", "4.1"],
        ["Nov", "North", "485", "470", "15", "3.1"],
        ["Dec", "North", "490", "472", "18", "3.7"],
      ],
    },
    {
      filename: "telecom_service_error_trends.csv",
      description: "Billing error trend data — monthly error counts and average loss per error",
      data: [
        ["month", "billing_errors_count", "error_rate_pct", "avg_error_loss_gbp"],
        ["Jan", "85", "4.2", "1.1"],
        ["Feb", "90", "4.6", "1.2"],
        ["Mar", "110", "5.5", "1.3"],
        ["Apr", "120", "5.9", "1.4"],
        ["May", "140", "6.3", "1.6"],
        ["Jun", "135", "6.0", "1.5"],
        ["Jul", "128", "5.7", "1.4"],
        ["Aug", "122", "5.4", "1.4"],
        ["Sep", "118", "5.1", "1.3"],
        ["Oct", "105", "4.8", "1.2"],
        ["Nov", "98", "4.5", "1.1"],
        ["Dec", "95", "4.4", "1.1"],
      ],
    },
  ],
  "finance-revenue-leakage": [
    {
      filename: "finance_revenue_leakage_trends.csv",
      description: "Monthly revenue leakage — expected vs actual with leakage rate tracking",
      data: [
        ["month", "expected_revenue_gbp", "actual_revenue_gbp", "revenue_leakage_gbp", "leakage_rate_pct"],
        ["Jan", "780", "760", "20", "2.6"],
        ["Feb", "800", "770", "30", "3.8"],
        ["Mar", "820", "785", "35", "4.3"],
        ["Apr", "840", "810", "30", "3.6"],
        ["May", "860", "820", "40", "4.7"],
        ["Jun", "880", "850", "30", "3.4"],
        ["Jul", "900", "860", "40", "4.4"],
        ["Aug", "910", "870", "40", "4.4"],
        ["Sep", "920", "880", "40", "4.3"],
        ["Oct", "940", "900", "40", "4.2"],
        ["Nov", "960", "920", "40", "4.1"],
        ["Dec", "980", "930", "50", "5.1"],
      ],
    },
    {
      filename: "finance_data_quality_report.csv",
      description: "Data quality dimensions by dataset — completeness, validity, timeliness, trust scores",
      data: [
        ["dataset_name", "month", "completeness_pct", "validity_pct", "timeliness_score", "overall_trust_score", "quality_status"],
        ["transactions", "2025-01", "96.4", "97.1", "88", "92", "fair"],
        ["customer_master", "2025-01", "99.1", "98.8", "95", "97", "good"],
      ],
    },
  ],
  "finance-control-failures": [
    {
      filename: "finance_control_failure_trends.csv",
      description: "Monthly control failures — severity distribution and financial impact",
      data: [
        ["month", "control_failures", "high_severity_pct", "avg_financial_impact_gbp"],
        ["Jan", "14", "28", "1.3"],
        ["Feb", "16", "30", "1.4"],
        ["Mar", "18", "35", "1.5"],
        ["Apr", "20", "38", "1.6"],
        ["May", "23", "42", "1.7"],
        ["Jun", "21", "40", "1.6"],
        ["Jul", "19", "37", "1.5"],
        ["Aug", "18", "36", "1.5"],
        ["Sep", "17", "34", "1.4"],
        ["Oct", "16", "32", "1.4"],
        ["Nov", "15", "30", "1.3"],
        ["Dec", "14", "29", "1.3"],
      ],
    },
    {
      filename: "finance_risk_register.csv",
      description: "Active risk items — area, severity, driver, and recommended actions",
      data: [
        ["month", "risk_area", "risk_level", "driver", "recommended_action"],
        ["2025-01", "Liquidity", "medium", "Delayed settlements", "Increase monitoring of clearing timelines"],
        ["2025-01", "Operational", "low", "Stable processing volumes", "Maintain current controls"],
      ],
    },
  ],
  "cx-support-retention": [
    {
      filename: "cx_support_trend_metrics.csv",
      description: "Monthly support operations — ticket volume, resolution time, and CSAT scores",
      data: [
        ["month", "support_tickets", "avg_resolution_hours", "csat_score"],
        ["Jan", "680", "6.2", "4.2"],
        ["Feb", "700", "6.4", "4.1"],
        ["Mar", "740", "6.8", "4.0"],
        ["Apr", "780", "7.1", "3.9"],
        ["May", "820", "7.5", "3.8"],
        ["Jun", "800", "7.3", "3.9"],
        ["Jul", "770", "7.0", "4.0"],
        ["Aug", "750", "6.8", "4.1"],
        ["Sep", "720", "6.6", "4.2"],
        ["Oct", "700", "6.5", "4.3"],
        ["Nov", "690", "6.3", "4.3"],
        ["Dec", "670", "6.2", "4.4"],
      ],
    },
    {
      filename: "cx_revenue_impact_trends.csv",
      description: "Customer revenue impact — active customers, revenue at risk, and retained revenue",
      data: [
        ["month", "active_customers", "revenue_at_risk_gbp", "retained_revenue_gbp"],
        ["Jan", "3200", "4200", "7800"],
        ["Feb", "3300", "4500", "7900"],
        ["Mar", "3400", "4800", "8000"],
        ["Apr", "3500", "5100", "8200"],
        ["May", "3550", "5300", "8300"],
        ["Jun", "3600", "5200", "8400"],
        ["Jul", "3650", "5000", "8500"],
        ["Aug", "3680", "4900", "8550"],
        ["Sep", "3700", "4700", "8600"],
        ["Oct", "3720", "4600", "8700"],
        ["Nov", "3750", "4500", "8800"],
        ["Dec", "3800", "4400", "8900"],
      ],
    },
    {
      filename: "cx_journey_funnel.csv",
      description: "Customer journey funnel — stage progression and drop-off rates",
      data: [
        ["stage", "users", "dropoff_pct"],
        ["Signup", "1200", "0.0"],
        ["First Activity", "860", "28.3"],
        ["Subscription", "540", "37.2"],
        ["Retention (30d)", "410", "24.1"],
      ],
    },
    {
      filename: "cx_retention_cohorts.csv",
      description: "Retention cohort analysis — monthly retention rates for November 2024 cohort",
      data: [
        ["cohort_month", "month_number", "retention_pct"],
        ["2024-11", "1", "78.4"],
        ["2024-11", "2", "64.2"],
        ["2024-11", "3", "55.1"],
      ],
    },
  ],
};

const RawDataPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = getProjectById(id || "");

  const handleBack = () => {
    navigate("/#projects");
    setTimeout(() => {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project not found</h1>
          <Link to="/" className="text-primary hover:underline">Return to homepage</Link>
        </div>
      </div>
    );
  }

  const csvFiles = projectCsvFiles[project.id] || [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          {/* Breadcrumb */}
          <div className="section-container py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-0 hover:bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
              <span className="text-muted-foreground/50">|</span>
              <Link
                to={`/project/${project.id}`}
                className="text-sm text-primary hover:underline"
              >
                View Full Case Study
              </Link>
            </div>
          </div>

          {/* Header */}
          <section className="section-container pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-status-warning/10 rounded-lg">
                <Database className="h-5 w-5 text-status-warning" />
              </div>
              <Badge variant="outline" className="text-xs uppercase tracking-wider">
                {project.industryLabel}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Raw Data — {project.title}
            </h1>
            <p className="text-muted-foreground max-w-3xl">
              Source CSV datasets used in this analysis. These represent the curated analytical outputs 
              extracted from operational systems before dashboard visualisation.
            </p>
          </section>

          {/* CSV Files */}
          <section className="section-container pb-16 space-y-8">
            {csvFiles.map((file, fileIdx) => (
              <div
                key={fileIdx}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                {/* File Header */}
                <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                    <div>
                      <h3 className="font-mono text-sm font-semibold text-foreground">
                        {file.filename}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {file.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {file.data.length - 1} rows
                  </Badge>
                </div>

                {/* Table */}
                <ScrollArea className="max-h-[400px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          {file.data[0].map((header, idx) => (
                            <th
                              key={idx}
                              className="text-left py-2.5 px-4 font-mono text-xs font-medium text-muted-foreground whitespace-nowrap"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {file.data.slice(1).map((row, rowIdx) => (
                          <tr
                            key={rowIdx}
                            className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                          >
                            {row.map((cell, cellIdx) => (
                              <td
                                key={cellIdx}
                                className="py-2 px-4 text-foreground font-mono text-xs whitespace-nowrap"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </div>
            ))}

            {/* Data Note */}
            <div className="bg-muted/30 p-5 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span>{" "}
                These datasets represent curated analytical outputs. Raw source extracts from operational 
                systems contained additional data quality issues (nulls, duplicates, mixed formats) which 
                were addressed during the cleaning and transformation phase.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default RawDataPage;
