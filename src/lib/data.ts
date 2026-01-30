// Telecom KPI Data
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

// Finance Data Quality
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

// CX Data
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
    title: "Network & Billing Performance Overview",
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
    title: "Revenue at Risk & Service Error Trends",
    industry: "telecommunications",
    industryLabel: "Telecommunications",
    description: "Incident pattern analysis to quantify revenue exposure from service disruptions",
    businessProblem: "Service errors and incident patterns accumulate into revenue risk that only becomes visible after customer complaints or contract disputes arise.",
    audience: "Revenue Assurance Teams, Account Management, Operations Leadership",
    decisionSupported: "Proactive customer retention interventions, service improvement prioritisation, incident escalation protocols",
    riskOfIgnoring: "Revenue leakage from undetected service failures, contract penalties, erosion of customer trust",
  },
  {
    id: "finance-revenue-leakage",
    title: "Revenue Leakage & Performance Monitoring",
    industry: "financial-services",
    industryLabel: "Financial Services",
    description: "Data quality monitoring to identify revenue leakage risks in financial datasets",
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
    description: "Risk register monitoring for liquidity and operational control effectiveness",
    businessProblem: "Operational and liquidity risks emerge gradually across multiple systems. Without consolidated visibility, risk escalation happens too late for effective mitigation.",
    audience: "Chief Risk Officer, Treasury, Operations Directors, Compliance Teams",
    decisionSupported: "Capital allocation adjustments, control remediation prioritisation, board-level risk escalation",
    riskOfIgnoring: "Unmitigated risk exposure, liquidity constraints, regulatory compliance failures",
  },
  {
    id: "cx-support-retention",
    title: "Customer Support, Retention & Revenue Impact",
    industry: "customer-experience",
    industryLabel: "Customer Experience",
    description: "Customer journey analytics with cohort-based retention and revenue impact analysis",
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
