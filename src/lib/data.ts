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
