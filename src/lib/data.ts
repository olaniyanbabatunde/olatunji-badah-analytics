// Telecom KPI Data
export const telecomKPIData = [
  {
    month: "2024-10",
    region: "North",
    uptime_pct: 99.6,
    uptime_target_pct: 99.5,
    uptime_delta_vs_target: 0.1,
    uptime_delta_vs_last_month: 0.2,
    sla_status: "healthy",
    risk_level: "low",
  },
  {
    month: "2024-10",
    region: "South",
    uptime_pct: 99.8,
    uptime_target_pct: 99.5,
    uptime_delta_vs_target: 0.3,
    uptime_delta_vs_last_month: 0.1,
    sla_status: "healthy",
    risk_level: "low",
  },
  {
    month: "2024-11",
    region: "North",
    uptime_pct: 99.5,
    uptime_target_pct: 99.5,
    uptime_delta_vs_target: 0.0,
    uptime_delta_vs_last_month: -0.1,
    sla_status: "healthy",
    risk_level: "low",
  },
  {
    month: "2024-11",
    region: "South",
    uptime_pct: 99.7,
    uptime_target_pct: 99.5,
    uptime_delta_vs_target: 0.2,
    uptime_delta_vs_last_month: -0.1,
    sla_status: "healthy",
    risk_level: "low",
  },
  {
    month: "2024-12",
    region: "North",
    uptime_pct: 99.4,
    uptime_target_pct: 99.5,
    uptime_delta_vs_target: -0.1,
    uptime_delta_vs_last_month: -0.1,
    sla_status: "warning",
    risk_level: "low",
  },
  {
    month: "2024-12",
    region: "South",
    uptime_pct: 99.6,
    uptime_target_pct: 99.5,
    uptime_delta_vs_target: 0.1,
    uptime_delta_vs_last_month: -0.1,
    sla_status: "healthy",
    risk_level: "low",
  },
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
  { month: "2024-10", region: "North", incident_type: "Power Failure", incident_count: 8, avg_resolution_hours: 5.2, pct_of_total_incidents: 0.35 },
  { month: "2024-10", region: "North", incident_type: "Fiber Cut", incident_count: 6, avg_resolution_hours: 9.8, pct_of_total_incidents: 0.26 },
  { month: "2024-10", region: "North", incident_type: "Equipment Failure", incident_count: 5, avg_resolution_hours: 4.1, pct_of_total_incidents: 0.22 },
  { month: "2024-10", region: "North", incident_type: "Software Issue", incident_count: 4, avg_resolution_hours: 2.3, pct_of_total_incidents: 0.17 },
  { month: "2024-10", region: "South", incident_type: "Power Failure", incident_count: 4, avg_resolution_hours: 4.8, pct_of_total_incidents: 0.31 },
  { month: "2024-10", region: "South", incident_type: "Fiber Cut", incident_count: 3, avg_resolution_hours: 8.5, pct_of_total_incidents: 0.23 },
  { month: "2024-10", region: "South", incident_type: "Equipment Failure", incident_count: 4, avg_resolution_hours: 3.9, pct_of_total_incidents: 0.31 },
  { month: "2024-10", region: "South", incident_type: "Software Issue", incident_count: 2, avg_resolution_hours: 2.1, pct_of_total_incidents: 0.15 },
  { month: "2024-11", region: "North", incident_type: "Power Failure", incident_count: 10, avg_resolution_hours: 5.8, pct_of_total_incidents: 0.38 },
  { month: "2024-11", region: "North", incident_type: "Fiber Cut", incident_count: 7, avg_resolution_hours: 10.2, pct_of_total_incidents: 0.27 },
  { month: "2024-11", region: "North", incident_type: "Equipment Failure", incident_count: 5, avg_resolution_hours: 4.5, pct_of_total_incidents: 0.19 },
  { month: "2024-11", region: "North", incident_type: "Software Issue", incident_count: 4, avg_resolution_hours: 2.5, pct_of_total_incidents: 0.15 },
  { month: "2024-11", region: "South", incident_type: "Power Failure", incident_count: 5, avg_resolution_hours: 5.0, pct_of_total_incidents: 0.33 },
  { month: "2024-11", region: "South", incident_type: "Fiber Cut", incident_count: 4, avg_resolution_hours: 9.0, pct_of_total_incidents: 0.27 },
  { month: "2024-11", region: "South", incident_type: "Equipment Failure", incident_count: 3, avg_resolution_hours: 4.0, pct_of_total_incidents: 0.20 },
  { month: "2024-11", region: "South", incident_type: "Software Issue", incident_count: 3, avg_resolution_hours: 2.2, pct_of_total_incidents: 0.20 },
  { month: "2024-12", region: "North", incident_type: "Power Failure", incident_count: 12, avg_resolution_hours: 6.0, pct_of_total_incidents: 0.40 },
  { month: "2024-12", region: "North", incident_type: "Fiber Cut", incident_count: 8, avg_resolution_hours: 10.8, pct_of_total_incidents: 0.27 },
  { month: "2024-12", region: "North", incident_type: "Equipment Failure", incident_count: 6, avg_resolution_hours: 4.8, pct_of_total_incidents: 0.20 },
  { month: "2024-12", region: "North", incident_type: "Software Issue", incident_count: 4, avg_resolution_hours: 2.6, pct_of_total_incidents: 0.13 },
  { month: "2024-12", region: "South", incident_type: "Power Failure", incident_count: 5, avg_resolution_hours: 5.2, pct_of_total_incidents: 0.31 },
  { month: "2024-12", region: "South", incident_type: "Fiber Cut", incident_count: 4, avg_resolution_hours: 9.2, pct_of_total_incidents: 0.25 },
  { month: "2024-12", region: "South", incident_type: "Equipment Failure", incident_count: 4, avg_resolution_hours: 4.2, pct_of_total_incidents: 0.25 },
  { month: "2024-12", region: "South", incident_type: "Software Issue", incident_count: 3, avg_resolution_hours: 2.3, pct_of_total_incidents: 0.19 },
  { month: "2025-01", region: "North", incident_type: "Power Failure", incident_count: 14, avg_resolution_hours: 6.4, pct_of_total_incidents: 0.42 },
  { month: "2025-01", region: "North", incident_type: "Fiber Cut", incident_count: 8, avg_resolution_hours: 11.2, pct_of_total_incidents: 0.24 },
  { month: "2025-01", region: "North", incident_type: "Equipment Failure", incident_count: 7, avg_resolution_hours: 5.2, pct_of_total_incidents: 0.21 },
  { month: "2025-01", region: "North", incident_type: "Software Issue", incident_count: 4, avg_resolution_hours: 2.8, pct_of_total_incidents: 0.12 },
  { month: "2025-01", region: "South", incident_type: "Power Failure", incident_count: 5, avg_resolution_hours: 5.0, pct_of_total_incidents: 0.29 },
  { month: "2025-01", region: "South", incident_type: "Fiber Cut", incident_count: 5, avg_resolution_hours: 9.5, pct_of_total_incidents: 0.29 },
  { month: "2025-01", region: "South", incident_type: "Equipment Failure", incident_count: 4, avg_resolution_hours: 4.0, pct_of_total_incidents: 0.24 },
  { month: "2025-01", region: "South", incident_type: "Software Issue", incident_count: 3, avg_resolution_hours: 2.0, pct_of_total_incidents: 0.18 },
];

// Finance Data Quality
export const financeDataQualityData = [
  { dataset_name: "transactions", month: "2024-10", completeness_pct: 94.2, validity_pct: 95.8, timeliness_score: 82, overall_trust_score: 88, quality_status: "fair" },
  { dataset_name: "transactions", month: "2024-11", completeness_pct: 95.1, validity_pct: 96.2, timeliness_score: 84, overall_trust_score: 90, quality_status: "fair" },
  { dataset_name: "transactions", month: "2024-12", completeness_pct: 95.8, validity_pct: 96.8, timeliness_score: 86, overall_trust_score: 91, quality_status: "fair" },
  { dataset_name: "transactions", month: "2025-01", completeness_pct: 96.4, validity_pct: 97.1, timeliness_score: 88, overall_trust_score: 92, quality_status: "fair" },
  { dataset_name: "customer_master", month: "2024-10", completeness_pct: 98.5, validity_pct: 97.9, timeliness_score: 92, overall_trust_score: 95, quality_status: "good" },
  { dataset_name: "customer_master", month: "2024-11", completeness_pct: 98.8, validity_pct: 98.2, timeliness_score: 93, overall_trust_score: 96, quality_status: "good" },
  { dataset_name: "customer_master", month: "2024-12", completeness_pct: 99.0, validity_pct: 98.5, timeliness_score: 94, overall_trust_score: 96, quality_status: "good" },
  { dataset_name: "customer_master", month: "2025-01", completeness_pct: 99.1, validity_pct: 98.8, timeliness_score: 95, overall_trust_score: 97, quality_status: "good" },
  { dataset_name: "accounts_payable", month: "2024-10", completeness_pct: 91.2, validity_pct: 93.5, timeliness_score: 78, overall_trust_score: 84, quality_status: "warning" },
  { dataset_name: "accounts_payable", month: "2024-11", completeness_pct: 92.0, validity_pct: 94.0, timeliness_score: 80, overall_trust_score: 86, quality_status: "fair" },
  { dataset_name: "accounts_payable", month: "2024-12", completeness_pct: 93.1, validity_pct: 94.8, timeliness_score: 82, overall_trust_score: 87, quality_status: "fair" },
  { dataset_name: "accounts_payable", month: "2025-01", completeness_pct: 94.0, validity_pct: 95.2, timeliness_score: 84, overall_trust_score: 89, quality_status: "fair" },
  { dataset_name: "market_data", month: "2024-10", completeness_pct: 99.5, validity_pct: 99.2, timeliness_score: 98, overall_trust_score: 99, quality_status: "excellent" },
  { dataset_name: "market_data", month: "2024-11", completeness_pct: 99.6, validity_pct: 99.3, timeliness_score: 98, overall_trust_score: 99, quality_status: "excellent" },
  { dataset_name: "market_data", month: "2024-12", completeness_pct: 99.5, validity_pct: 99.1, timeliness_score: 97, overall_trust_score: 98, quality_status: "excellent" },
  { dataset_name: "market_data", month: "2025-01", completeness_pct: 99.7, validity_pct: 99.4, timeliness_score: 99, overall_trust_score: 99, quality_status: "excellent" },
  { dataset_name: "regulatory_reports", month: "2024-10", completeness_pct: 97.0, validity_pct: 96.5, timeliness_score: 88, overall_trust_score: 93, quality_status: "good" },
  { dataset_name: "regulatory_reports", month: "2024-11", completeness_pct: 97.5, validity_pct: 97.0, timeliness_score: 90, overall_trust_score: 94, quality_status: "good" },
  { dataset_name: "regulatory_reports", month: "2024-12", completeness_pct: 98.0, validity_pct: 97.5, timeliness_score: 91, overall_trust_score: 95, quality_status: "good" },
  { dataset_name: "regulatory_reports", month: "2025-01", completeness_pct: 98.2, validity_pct: 97.8, timeliness_score: 92, overall_trust_score: 95, quality_status: "good" },
];

export const financeRiskData = [
  { month: "2024-10", risk_area: "Liquidity", risk_level: "low", driver: "Stable cash positions", recommended_action: "Maintain current monitoring" },
  { month: "2024-10", risk_area: "Operational", risk_level: "low", driver: "Normal processing volumes", recommended_action: "Continue standard controls" },
  { month: "2024-10", risk_area: "Credit", risk_level: "low", driver: "Strong counterparty ratings", recommended_action: "Monitor quarterly" },
  { month: "2024-10", risk_area: "Market", risk_level: "medium", driver: "Elevated volatility", recommended_action: "Increase hedging positions" },
  { month: "2024-11", risk_area: "Liquidity", risk_level: "low", driver: "Healthy settlement flows", recommended_action: "Maintain current monitoring" },
  { month: "2024-11", risk_area: "Operational", risk_level: "low", driver: "Stable processing volumes", recommended_action: "Continue standard controls" },
  { month: "2024-11", risk_area: "Credit", risk_level: "low", driver: "Counterparty stability", recommended_action: "Monitor quarterly" },
  { month: "2024-11", risk_area: "Market", risk_level: "low", driver: "Volatility normalized", recommended_action: "Reduce hedging costs" },
  { month: "2024-12", risk_area: "Liquidity", risk_level: "medium", driver: "Year-end settlement spikes", recommended_action: "Increase liquidity buffer" },
  { month: "2024-12", risk_area: "Operational", risk_level: "low", driver: "Stable processing volumes", recommended_action: "Maintain current controls" },
  { month: "2024-12", risk_area: "Credit", risk_level: "medium", driver: "Counterparty downgrade", recommended_action: "Increase collateral requirements" },
  { month: "2024-12", risk_area: "Market", risk_level: "low", driver: "Stable conditions", recommended_action: "Maintain positions" },
  { month: "2025-01", risk_area: "Liquidity", risk_level: "medium", driver: "Delayed settlements", recommended_action: "Increase monitoring of clearing timelines" },
  { month: "2025-01", risk_area: "Operational", risk_level: "low", driver: "Stable processing volumes", recommended_action: "Maintain current controls" },
  { month: "2025-01", risk_area: "Credit", risk_level: "low", driver: "Improved counterparty outlook", recommended_action: "Return to standard monitoring" },
  { month: "2025-01", risk_area: "Market", risk_level: "low", driver: "Low volatility regime", recommended_action: "Optimize hedging costs" },
];

// CX Data
export const cxJourneyFunnelData = [
  { month: "2024-10", stage: "Signup", users: 980, dropoff_pct: 0.0 },
  { month: "2024-10", stage: "First Activity", users: 686, dropoff_pct: 30.0 },
  { month: "2024-10", stage: "Subscription", users: 402, dropoff_pct: 41.4 },
  { month: "2024-10", stage: "Retention (30d)", users: 305, dropoff_pct: 24.1 },
  { month: "2024-11", stage: "Signup", users: 1050, dropoff_pct: 0.0 },
  { month: "2024-11", stage: "First Activity", users: 756, dropoff_pct: 28.0 },
  { month: "2024-11", stage: "Subscription", users: 462, dropoff_pct: 38.9 },
  { month: "2024-11", stage: "Retention (30d)", users: 355, dropoff_pct: 23.2 },
  { month: "2024-12", stage: "Signup", users: 1120, dropoff_pct: 0.0 },
  { month: "2024-12", stage: "First Activity", users: 817, dropoff_pct: 27.1 },
  { month: "2024-12", stage: "Subscription", users: 506, dropoff_pct: 38.1 },
  { month: "2024-12", stage: "Retention (30d)", users: 389, dropoff_pct: 23.1 },
  { month: "2025-01", stage: "Signup", users: 1200, dropoff_pct: 0.0 },
  { month: "2025-01", stage: "First Activity", users: 860, dropoff_pct: 28.3 },
  { month: "2025-01", stage: "Subscription", users: 540, dropoff_pct: 37.2 },
  { month: "2025-01", stage: "Retention (30d)", users: 410, dropoff_pct: 24.1 },
];

export const cxRetentionCohortData = [
  { cohort_month: "2024-08", month_number: 1, retention_pct: 75.2 },
  { cohort_month: "2024-08", month_number: 2, retention_pct: 60.5 },
  { cohort_month: "2024-08", month_number: 3, retention_pct: 51.8 },
  { cohort_month: "2024-08", month_number: 4, retention_pct: 45.2 },
  { cohort_month: "2024-08", month_number: 5, retention_pct: 40.1 },
  { cohort_month: "2024-08", month_number: 6, retention_pct: 36.5 },
  { cohort_month: "2024-09", month_number: 1, retention_pct: 76.8 },
  { cohort_month: "2024-09", month_number: 2, retention_pct: 62.1 },
  { cohort_month: "2024-09", month_number: 3, retention_pct: 53.4 },
  { cohort_month: "2024-09", month_number: 4, retention_pct: 46.8 },
  { cohort_month: "2024-09", month_number: 5, retention_pct: 41.5 },
  { cohort_month: "2024-10", month_number: 1, retention_pct: 77.5 },
  { cohort_month: "2024-10", month_number: 2, retention_pct: 63.0 },
  { cohort_month: "2024-10", month_number: 3, retention_pct: 54.2 },
  { cohort_month: "2024-10", month_number: 4, retention_pct: 47.5 },
  { cohort_month: "2024-11", month_number: 1, retention_pct: 78.4 },
  { cohort_month: "2024-11", month_number: 2, retention_pct: 64.2 },
  { cohort_month: "2024-11", month_number: 3, retention_pct: 55.1 },
  { cohort_month: "2024-12", month_number: 1, retention_pct: 79.2 },
  { cohort_month: "2024-12", month_number: 2, retention_pct: 65.0 },
  { cohort_month: "2025-01", month_number: 1, retention_pct: 80.1 },
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
    id: "telecom-sla-intelligence",
    title: "Service Performance & SLA Intelligence",
    industry: "telecommunications",
    industryLabel: "Telecommunications",
    description: "Real-time monitoring of network uptime and SLA compliance across regions",
    businessProblem: "Network operations teams struggle to identify SLA breaches before they impact customer contracts and trigger financial penalties.",
    audience: "Network Operations Managers, Service Delivery Directors, Executive Leadership",
    decisionSupported: "Resource allocation for proactive maintenance, contract renegotiation timing, and capacity planning",
    riskOfIgnoring: "SLA breach penalties, customer churn due to service quality issues, reactive rather than proactive incident management",
  },
  {
    id: "telecom-churn-risk",
    title: "Churn & Early Risk Signal Monitoring",
    industry: "telecommunications",
    industryLabel: "Telecommunications",
    description: "Incident pattern analysis to identify early warning signs of service degradation",
    businessProblem: "High-value enterprise customers experience repeated incidents that erode trust, but the pattern is only visible in hindsight.",
    audience: "Account Management, Customer Success, Operations Leadership",
    decisionSupported: "Proactive customer outreach, targeted service improvements, incident escalation protocols",
    riskOfIgnoring: "Customer churn from accumulated service failures, loss of enterprise contracts, damaged reputation in the market",
  },
  {
    id: "finance-data-governance",
    title: "Data Quality & Governance Control Tower",
    industry: "financial-services",
    industryLabel: "Financial Services",
    description: "Comprehensive data quality monitoring across critical financial datasets",
    businessProblem: "Regulatory reporting depends on data accuracy, but quality issues are discovered too late in the reporting cycle.",
    audience: "Data Governance Officers, Compliance Teams, CFO Office",
    decisionSupported: "Data remediation prioritization, audit preparation, system investment decisions",
    riskOfIgnoring: "Regulatory fines, audit failures, incorrect financial statements, loss of stakeholder trust",
  },
  {
    id: "finance-risk-warning",
    title: "Performance Risk Early-Warning System",
    industry: "financial-services",
    industryLabel: "Financial Services",
    description: "Risk register with actionable insights for operational and liquidity risks",
    businessProblem: "Emerging risks across operations, liquidity, and compliance are siloed, making enterprise-wide risk visibility difficult.",
    audience: "Chief Risk Officer, Treasury, Operations Directors",
    decisionSupported: "Capital allocation, operational process changes, escalation to board-level risk committees",
    riskOfIgnoring: "Unmitigated risk exposure, liquidity crises, operational failures with downstream financial impact",
  },
  {
    id: "cx-journey-retention",
    title: "Customer Journey & Retention Intelligence",
    industry: "customer-experience",
    industryLabel: "Customer Experience",
    description: "End-to-end customer journey analysis with cohort-based retention tracking",
    businessProblem: "Customer acquisition costs are rising, but retention rates vary significantly without clear understanding of the drop-off points.",
    audience: "VP of Customer Success, Marketing Leadership, Product Managers",
    decisionSupported: "Funnel optimization investments, retention intervention timing, product feature prioritization",
    riskOfIgnoring: "Rising CAC with declining LTV, misallocated marketing spend, product-market fit blind spots",
  },
];

export const getProjectsByIndustry = (industry: string) =>
  projects.filter((p) => p.industry === industry);

export const getProjectById = (id: string) =>
  projects.find((p) => p.id === id);

// Helper functions
export const getLatestMonth = () => "2025-01";

export const getMonths = () => ["2024-10", "2024-11", "2024-12", "2025-01"];

export const getDataByMonth = <T extends { month: string }>(data: T[], month: string) =>
  data.filter((d) => d.month === month);

export const getLatestData = <T extends { month: string }>(data: T[]) =>
  data.filter((d) => d.month === getLatestMonth());
