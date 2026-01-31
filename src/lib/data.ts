// Telecom KPI Data (high-level summary)
export const telecomKPIData = [
  {
    month: "2025-01",
    region: "North",
    uptime_pct: 99.2,
    uptime_target_pct: 99.5,
    uptime_delta_vs_target: -0.3,
    uptime_delta_vs_last_month: -0.2,
    sla_status: "warning",
    risk_level: "medium",
  },
  {
    month: "2025-01",
    region: "South",
    uptime_pct: 99.7,
    uptime_target_pct: 99.5,
    uptime_delta_vs_target: 0.2,
    uptime_delta_vs_last_month: 0.1,
    sla_status: "healthy",
    risk_level: "low",
  },
];

export const telecomIncidentData = [
  {
    month: "2025-01",
    region: "North",
    incident_type: "Power Failure",
    incident_count: 14,
    avg_resolution_hours: 6.4,
    pct_of_total_incidents: 0.42,
  },
  {
    month: "2025-01",
    region: "North",
    incident_type: "Fiber Cut",
    incident_count: 8,
    avg_resolution_hours: 11.2,
    pct_of_total_incidents: 0.24,
  },
];

// Telecom Revenue Risk Trends (monthly trend data)
export const telecomRevenueRiskTrends = [
  { month: "Jan", region: "North", expected_revenue_usd: 420, actual_revenue_usd: 410, revenue_at_risk_usd: 10, leakage_rate_pct: 2.4 },
  { month: "Feb", region: "North", expected_revenue_usd: 430, actual_revenue_usd: 415, revenue_at_risk_usd: 15, leakage_rate_pct: 3.5 },
  { month: "Mar", region: "North", expected_revenue_usd: 440, actual_revenue_usd: 420, revenue_at_risk_usd: 20, leakage_rate_pct: 4.5 },
  { month: "Apr", region: "North", expected_revenue_usd: 450, actual_revenue_usd: 430, revenue_at_risk_usd: 20, leakage_rate_pct: 4.4 },
  { month: "May", region: "North", expected_revenue_usd: 455, actual_revenue_usd: 428, revenue_at_risk_usd: 27, leakage_rate_pct: 5.9 },
  { month: "Jun", region: "North", expected_revenue_usd: 460, actual_revenue_usd: 440, revenue_at_risk_usd: 20, leakage_rate_pct: 4.3 },
  { month: "Jul", region: "North", expected_revenue_usd: 465, actual_revenue_usd: 445, revenue_at_risk_usd: 20, leakage_rate_pct: 4.3 },
  { month: "Aug", region: "North", expected_revenue_usd: 470, actual_revenue_usd: 448, revenue_at_risk_usd: 22, leakage_rate_pct: 4.7 },
  { month: "Sep", region: "North", expected_revenue_usd: 475, actual_revenue_usd: 450, revenue_at_risk_usd: 25, leakage_rate_pct: 5.2 },
  { month: "Oct", region: "North", expected_revenue_usd: 480, actual_revenue_usd: 460, revenue_at_risk_usd: 20, leakage_rate_pct: 4.1 },
  { month: "Nov", region: "North", expected_revenue_usd: 485, actual_revenue_usd: 470, revenue_at_risk_usd: 15, leakage_rate_pct: 3.1 },
  { month: "Dec", region: "North", expected_revenue_usd: 490, actual_revenue_usd: 472, revenue_at_risk_usd: 18, leakage_rate_pct: 3.7 },
];

// Telecom Service Error Trends (monthly trend data)
export const telecomServiceErrorTrends = [
  { month: "Jan", billing_errors_count: 85, error_rate_pct: 4.2, avg_error_loss_usd: 1.1 },
  { month: "Feb", billing_errors_count: 90, error_rate_pct: 4.6, avg_error_loss_usd: 1.2 },
  { month: "Mar", billing_errors_count: 110, error_rate_pct: 5.5, avg_error_loss_usd: 1.3 },
  { month: "Apr", billing_errors_count: 120, error_rate_pct: 5.9, avg_error_loss_usd: 1.4 },
  { month: "May", billing_errors_count: 140, error_rate_pct: 6.3, avg_error_loss_usd: 1.6 },
  { month: "Jun", billing_errors_count: 135, error_rate_pct: 6.0, avg_error_loss_usd: 1.5 },
  { month: "Jul", billing_errors_count: 128, error_rate_pct: 5.7, avg_error_loss_usd: 1.4 },
  { month: "Aug", billing_errors_count: 122, error_rate_pct: 5.4, avg_error_loss_usd: 1.4 },
  { month: "Sep", billing_errors_count: 118, error_rate_pct: 5.1, avg_error_loss_usd: 1.3 },
  { month: "Oct", billing_errors_count: 105, error_rate_pct: 4.8, avg_error_loss_usd: 1.2 },
  { month: "Nov", billing_errors_count: 98, error_rate_pct: 4.5, avg_error_loss_usd: 1.1 },
  { month: "Dec", billing_errors_count: 95, error_rate_pct: 4.4, avg_error_loss_usd: 1.1 },
];

// Finance Data Quality (high-level summary)
export const financeDataQualityData = [
  {
    dataset_name: "transactions",
    month: "2025-01",
    completeness_pct: 96.4,
    validity_pct: 97.1,
    timeliness_score: 88,
    overall_trust_score: 92,
    quality_status: "fair",
  },
  {
    dataset_name: "customer_master",
    month: "2025-01",
    completeness_pct: 99.1,
    validity_pct: 98.8,
    timeliness_score: 95,
    overall_trust_score: 97,
    quality_status: "good",
  },
];

export const financeRiskData = [
  {
    month: "2025-01",
    risk_area: "Liquidity",
    risk_level: "medium",
    driver: "Delayed settlements",
    recommended_action: "Increase monitoring of clearing timelines",
  },
  {
    month: "2025-01",
    risk_area: "Operational",
    risk_level: "low",
    driver: "Stable processing volumes",
    recommended_action: "Maintain current controls",
  },
];

// Finance Revenue Leakage Trends (monthly trend data)
export const financeRevenueLeakageTrends = [
  { month: "Jan", expected_revenue_usd: 780, actual_revenue_usd: 760, revenue_leakage_usd: 20, leakage_rate_pct: 2.6 },
  { month: "Feb", expected_revenue_usd: 800, actual_revenue_usd: 770, revenue_leakage_usd: 30, leakage_rate_pct: 3.8 },
  { month: "Mar", expected_revenue_usd: 820, actual_revenue_usd: 785, revenue_leakage_usd: 35, leakage_rate_pct: 4.3 },
  { month: "Apr", expected_revenue_usd: 840, actual_revenue_usd: 810, revenue_leakage_usd: 30, leakage_rate_pct: 3.6 },
  { month: "May", expected_revenue_usd: 860, actual_revenue_usd: 820, revenue_leakage_usd: 40, leakage_rate_pct: 4.7 },
  { month: "Jun", expected_revenue_usd: 880, actual_revenue_usd: 850, revenue_leakage_usd: 30, leakage_rate_pct: 3.4 },
  { month: "Jul", expected_revenue_usd: 900, actual_revenue_usd: 860, revenue_leakage_usd: 40, leakage_rate_pct: 4.4 },
  { month: "Aug", expected_revenue_usd: 910, actual_revenue_usd: 870, revenue_leakage_usd: 40, leakage_rate_pct: 4.4 },
  { month: "Sep", expected_revenue_usd: 920, actual_revenue_usd: 880, revenue_leakage_usd: 40, leakage_rate_pct: 4.3 },
  { month: "Oct", expected_revenue_usd: 940, actual_revenue_usd: 900, revenue_leakage_usd: 40, leakage_rate_pct: 4.2 },
  { month: "Nov", expected_revenue_usd: 960, actual_revenue_usd: 920, revenue_leakage_usd: 40, leakage_rate_pct: 4.1 },
  { month: "Dec", expected_revenue_usd: 980, actual_revenue_usd: 930, revenue_leakage_usd: 50, leakage_rate_pct: 5.1 },
];

// Finance Control Failure Trends (monthly trend data)
export const financeControlFailureTrends = [
  { month: "Jan", control_failures: 14, high_severity_pct: 28, avg_financial_impact_usd: 1.3 },
  { month: "Feb", control_failures: 16, high_severity_pct: 30, avg_financial_impact_usd: 1.4 },
  { month: "Mar", control_failures: 18, high_severity_pct: 35, avg_financial_impact_usd: 1.5 },
  { month: "Apr", control_failures: 20, high_severity_pct: 38, avg_financial_impact_usd: 1.6 },
  { month: "May", control_failures: 23, high_severity_pct: 42, avg_financial_impact_usd: 1.7 },
  { month: "Jun", control_failures: 21, high_severity_pct: 40, avg_financial_impact_usd: 1.6 },
  { month: "Jul", control_failures: 19, high_severity_pct: 37, avg_financial_impact_usd: 1.5 },
  { month: "Aug", control_failures: 18, high_severity_pct: 36, avg_financial_impact_usd: 1.5 },
  { month: "Sep", control_failures: 17, high_severity_pct: 34, avg_financial_impact_usd: 1.4 },
  { month: "Oct", control_failures: 16, high_severity_pct: 32, avg_financial_impact_usd: 1.4 },
  { month: "Nov", control_failures: 15, high_severity_pct: 30, avg_financial_impact_usd: 1.3 },
  { month: "Dec", control_failures: 14, high_severity_pct: 29, avg_financial_impact_usd: 1.3 },
];

// CX Data (high-level summary)
export const cxJourneyFunnelData = [
  { stage: "Signup", users: 1200, dropoff_pct: 0.0 },
  { stage: "First Activity", users: 860, dropoff_pct: 28.3 },
  { stage: "Subscription", users: 540, dropoff_pct: 37.2 },
  { stage: "Retention (30d)", users: 410, dropoff_pct: 24.1 },
];

export const cxRetentionCohortData = [
  { cohort_month: "2024-11", month_number: 1, retention_pct: 78.4 },
  { cohort_month: "2024-11", month_number: 2, retention_pct: 64.2 },
  { cohort_month: "2024-11", month_number: 3, retention_pct: 55.1 },
];

// CX Support Trend Metrics (monthly trend data)
export const cxSupportTrendMetrics = [
  { month: "Jan", support_tickets: 680, avg_resolution_hours: 6.2, csat_score: 4.2 },
  { month: "Feb", support_tickets: 700, avg_resolution_hours: 6.4, csat_score: 4.1 },
  { month: "Mar", support_tickets: 740, avg_resolution_hours: 6.8, csat_score: 4.0 },
  { month: "Apr", support_tickets: 780, avg_resolution_hours: 7.1, csat_score: 3.9 },
  { month: "May", support_tickets: 820, avg_resolution_hours: 7.5, csat_score: 3.8 },
  { month: "Jun", support_tickets: 800, avg_resolution_hours: 7.3, csat_score: 3.9 },
  { month: "Jul", support_tickets: 770, avg_resolution_hours: 7.0, csat_score: 4.0 },
  { month: "Aug", support_tickets: 750, avg_resolution_hours: 6.8, csat_score: 4.1 },
  { month: "Sep", support_tickets: 720, avg_resolution_hours: 6.6, csat_score: 4.2 },
  { month: "Oct", support_tickets: 700, avg_resolution_hours: 6.5, csat_score: 4.3 },
  { month: "Nov", support_tickets: 690, avg_resolution_hours: 6.3, csat_score: 4.3 },
  { month: "Dec", support_tickets: 670, avg_resolution_hours: 6.2, csat_score: 4.4 },
];

// CX Revenue Impact Trends (monthly trend data)
export const cxRevenueImpactTrends = [
  { month: "Jan", active_customers: 3200, revenue_at_risk_usd: 4200, retained_revenue_usd: 7800 },
  { month: "Feb", active_customers: 3300, revenue_at_risk_usd: 4500, retained_revenue_usd: 7900 },
  { month: "Mar", active_customers: 3400, revenue_at_risk_usd: 4800, retained_revenue_usd: 8000 },
  { month: "Apr", active_customers: 3500, revenue_at_risk_usd: 5100, retained_revenue_usd: 8200 },
  { month: "May", active_customers: 3550, revenue_at_risk_usd: 5300, retained_revenue_usd: 8300 },
  { month: "Jun", active_customers: 3600, revenue_at_risk_usd: 5200, retained_revenue_usd: 8400 },
  { month: "Jul", active_customers: 3650, revenue_at_risk_usd: 5000, retained_revenue_usd: 8500 },
  { month: "Aug", active_customers: 3680, revenue_at_risk_usd: 4900, retained_revenue_usd: 8550 },
  { month: "Sep", active_customers: 3700, revenue_at_risk_usd: 4700, retained_revenue_usd: 8600 },
  { month: "Oct", active_customers: 3720, revenue_at_risk_usd: 4600, retained_revenue_usd: 8700 },
  { month: "Nov", active_customers: 3750, revenue_at_risk_usd: 4500, retained_revenue_usd: 8800 },
  { month: "Dec", active_customers: 3800, revenue_at_risk_usd: 4400, retained_revenue_usd: 8900 },
];

// Project definitions
export interface Project {
  id: string;
  title: string;
  industry: "telecommunications" | "financial-services" | "customer-experience";
  industryLabel: string;
  description: string;
  businessProblem: string;
  audience: string;
  decisionSupported: string;
  riskOfIgnoring: string;
}

export const projects: Project[] = [
  {
    id: "telecom-network-billing",
    title: "Service Performance & Billing Health",
    industry: "telecommunications",
    industryLabel: "Telecommunications",
    description: "Regional uptime monitoring and SLA compliance tracking for network operations",
    businessProblem: "Network performance directly impacts billing accuracy and customer satisfaction. Without visibility into uptime trends and SLA breaches, operations teams react to issues rather than preventing them.",
    audience: "Network Operations Directors, Service Delivery Managers, Finance Controllers",
    decisionSupported: "Resource allocation for maintenance, SLA renegotiation timing, capacity investment planning",
    riskOfIgnoring: "Unexpected SLA penalty costs, billing disputes with enterprise customers, reactive maintenance cycles",
  },
  {
    id: "telecom-revenue-risk",
    title: "Revenue at Risk & Error Trends",
    industry: "telecommunications",
    industryLabel: "Telecommunications",
    description: "Incident pattern analysis to quantify revenue exposure from service disruptions and billing errors",
    businessProblem: "Service errors and billing discrepancies accumulate into revenue risk that only becomes visible after customer complaints or contract disputes arise.",
    audience: "Revenue Assurance Teams, Account Management, Operations Leadership",
    decisionSupported: "Proactive customer retention interventions, service improvement prioritisation, incident escalation protocols",
    riskOfIgnoring: "Revenue leakage from undetected service failures, contract penalties, erosion of customer trust",
  },
  {
    id: "finance-revenue-leakage",
    title: "Revenue Leakage & Performance Monitoring",
    industry: "financial-services",
    industryLabel: "Financial Services",
    description: "Data quality monitoring and revenue tracking to identify leakage risks in financial datasets",
    businessProblem: "Data quality issues in transaction and customer systems create revenue leakage through processing errors, duplicate records, and delayed reconciliation.",
    audience: "Finance Controllers, Data Governance Officers, Revenue Assurance Teams",
    decisionSupported: "Data remediation prioritisation, system investment decisions, process improvement initiatives",
    riskOfIgnoring: "Undetected revenue leakage, audit failures, incorrect financial reporting",
  },
  {
    id: "finance-control-failures",
    title: "Control Failures & Operational Risk Trends",
    industry: "financial-services",
    industryLabel: "Financial Services",
    description: "Risk register monitoring for control effectiveness and operational risk trends",
    businessProblem: "Operational and liquidity risks emerge gradually across multiple systems. Without consolidated visibility, risk escalation happens too late for effective mitigation.",
    audience: "Chief Risk Officer, Treasury, Operations Directors, Compliance Teams",
    decisionSupported: "Capital allocation adjustments, control remediation prioritisation, board-level risk escalation",
    riskOfIgnoring: "Unmitigated risk exposure, liquidity constraints, regulatory compliance failures",
  },
  {
    id: "cx-support-retention",
    title: "Support Operations, Retention & Revenue Impact",
    industry: "customer-experience",
    industryLabel: "Customer Experience",
    description: "Customer journey analytics with support metrics, retention trends, and revenue impact analysis",
    businessProblem: "Customer acquisition investment is wasted when retention rates are unclear. Without journey visibility, marketing spend is disconnected from long-term customer value.",
    audience: "VP of Customer Success, Marketing Directors, Product Managers",
    decisionSupported: "Retention intervention timing, funnel optimisation investment, customer segment prioritisation",
    riskOfIgnoring: "Rising acquisition costs with declining lifetime value, misallocated marketing budget, hidden churn drivers",
  },
];

export const getProjectsByIndustry = (industry: string) =>
  projects.filter((p) => p.industry === industry);

export const getProjectById = (id: string) =>
  projects.find((p) => p.id === id);
