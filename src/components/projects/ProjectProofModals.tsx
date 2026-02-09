import { useState } from "react";
import { Database, Sparkles, Wrench, BarChart3, Copy, Check, ExternalLink, Code, FileSpreadsheet, PieChart, LineChart, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Cleaned SQL snippets by project — expanded with multiple queries
const cleanedQuerySnippets: Record<string, { query: string; transformations: string[] }[]> = {
  "telecom-network-billing": [
    {
      query: `-- Cleaned and standardised network performance
WITH standardised AS (
  SELECT
    DATE_TRUNC('month', log_date) AS month,
    CASE 
      WHEN region_code IN ('N', 'North') THEN 'North'
      WHEN region_code IN ('S', 'South') THEN 'South'
      ELSE region_code 
    END AS region,
    COALESCE(uptime_pct, 0) AS uptime_pct,
    99.5 AS target_pct
  FROM network_performance_log
  WHERE log_date >= '2024-01-01'
),
deduplicated AS (
  SELECT DISTINCT * FROM standardised
)
SELECT 
  month,
  region,
  AVG(uptime_pct) AS avg_uptime,
  target_pct,
  AVG(uptime_pct) - target_pct AS delta_vs_target
FROM deduplicated
GROUP BY month, region, target_pct;`,
      transformations: [
        "Region codes standardised to full names",
        "Null uptime values defaulted to 0",
        "Duplicates removed via DISTINCT",
        "Monthly aggregation applied",
      ],
    },
    {
      query: `-- SLA breach detection with rolling average
WITH monthly_uptime AS (
  SELECT
    region,
    DATE_TRUNC('month', log_date) AS month,
    AVG(uptime_pct) AS avg_uptime
  FROM network_performance_log
  WHERE log_date >= '2024-01-01'
  GROUP BY region, DATE_TRUNC('month', log_date)
),
rolling AS (
  SELECT
    *,
    AVG(avg_uptime) OVER (
      PARTITION BY region 
      ORDER BY month 
      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS rolling_3m_avg,
    CASE 
      WHEN avg_uptime < 99.5 THEN 'BREACH'
      WHEN avg_uptime < 99.7 THEN 'WARNING'
      ELSE 'COMPLIANT'
    END AS sla_status
  FROM monthly_uptime
)
SELECT * FROM rolling ORDER BY region, month;`,
      transformations: [
        "3-month rolling average calculated per region",
        "SLA breach thresholds applied (99.5% / 99.7%)",
        "Window function for trend detection",
      ],
    },
  ],
  "telecom-revenue-risk": [
    {
      query: `-- Revenue at risk calculation with currency normalisation
WITH cleaned AS (
  SELECT
    customer_id,
    DATE_TRUNC('month', transaction_date) AS month,
    CAST(amount AS NUMERIC) AS amount_raw,
    CASE 
      WHEN currency = 'USD' THEN CAST(amount AS NUMERIC) * 0.79
      WHEN currency = 'EUR' THEN CAST(amount AS NUMERIC) * 0.86
      ELSE CAST(amount AS NUMERIC)
    END AS amount_gbp,
    error_flag
  FROM billing_transactions
  WHERE amount IS NOT NULL
    AND transaction_date BETWEEN '2024-01-01' AND '2024-12-31'
)
SELECT 
  month,
  SUM(amount_gbp) AS total_revenue_gbp,
  SUM(CASE WHEN error_flag = 1 THEN amount_gbp ELSE 0 END) AS revenue_at_risk_gbp,
  ROUND(100.0 * SUM(CASE WHEN error_flag = 1 THEN amount_gbp ELSE 0 END) / 
        NULLIF(SUM(amount_gbp), 0), 2) AS risk_pct
FROM cleaned
GROUP BY month
ORDER BY month;`,
      transformations: [
        "Currency converted to GBP using fixed rates",
        "Amount cast from VARCHAR to NUMERIC",
        "Null amounts filtered out",
        "Error transactions flagged for risk calculation",
      ],
    },
    {
      query: `-- Top accounts by revenue exposure (Python pandas)
# pandas transformation for account-level risk
import pandas as pd

df = pd.read_sql("SELECT * FROM billing_transactions", conn)

# Clean and convert
df['amount_gbp'] = df.apply(
    lambda r: r['amount'] * 0.79 if r['currency'] == 'USD'
    else r['amount'] * 0.86 if r['currency'] == 'EUR'
    else r['amount'], axis=1
)

# Flag errors and rank accounts
risk_df = (
    df[df['error_flag'] == 1]
    .groupby('customer_id')
    .agg(
        total_risk_gbp=('amount_gbp', 'sum'),
        error_count=('error_flag', 'count')
    )
    .sort_values('total_risk_gbp', ascending=False)
    .head(50)
)
print(f"Top 50 accounts: £{risk_df['total_risk_gbp'].sum():,.0f} at risk")`,
      transformations: [
        "Python pandas used for account-level aggregation",
        "Currency normalisation applied in-memory",
        "Top 50 at-risk accounts ranked by exposure",
        "Exported for Power BI account drill-down",
      ],
    },
    {
      query: `-- Error pattern detection with lag analysis
WITH error_events AS (
  SELECT
    customer_id,
    transaction_date,
    error_flag,
    LAG(error_flag) OVER (
      PARTITION BY customer_id ORDER BY transaction_date
    ) AS prev_error,
    CAST(amount AS NUMERIC) * 
      CASE WHEN currency = 'USD' THEN 0.79
           WHEN currency = 'EUR' THEN 0.86
           ELSE 1 END AS amount_gbp
  FROM billing_transactions
  WHERE transaction_date >= '2024-01-01'
)
SELECT
  DATE_TRUNC('month', transaction_date) AS month,
  COUNT(*) FILTER (WHERE error_flag = 1 AND prev_error = 1) AS repeat_errors,
  COUNT(*) FILTER (WHERE error_flag = 1 AND prev_error = 0) AS new_errors,
  SUM(CASE WHEN error_flag = 1 THEN amount_gbp ELSE 0 END) AS total_risk_gbp
FROM error_events
GROUP BY 1 ORDER BY 1;`,
      transformations: [
        "LAG function to detect repeat vs new errors",
        "Pattern analysis for recurring billing issues",
        "Monthly error classification breakdown",
      ],
    },
  ],
  "finance-revenue-leakage": [
    {
      query: `-- Revenue leakage identification with data quality scoring
WITH validated AS (
  SELECT
    t.transaction_id,
    t.posting_date,
    CAST(t.amount AS NUMERIC) AS amount_gbp,
    c.customer_name,
    CASE 
      WHEN c.id IS NULL THEN 'orphaned'
      WHEN t.is_duplicate = 1 THEN 'duplicate'
      WHEN t.amount <= 0 THEN 'invalid_amount'
      ELSE 'valid'
    END AS record_status
  FROM gl_transactions t
  LEFT JOIN customer_master c ON t.cust_id = c.id
  WHERE t.posting_date >= '2024-01-01'
)
SELECT
  DATE_TRUNC('month', posting_date) AS month,
  SUM(CASE WHEN record_status = 'valid' THEN amount_gbp ELSE 0 END) AS valid_revenue,
  SUM(CASE WHEN record_status != 'valid' THEN amount_gbp ELSE 0 END) AS leaked_revenue,
  COUNT(*) FILTER (WHERE record_status != 'valid') AS issue_count
FROM validated
GROUP BY DATE_TRUNC('month', posting_date);`,
      transformations: [
        "Record status classification applied",
        "Orphaned transactions identified via LEFT JOIN",
        "Duplicate batch entries flagged",
        "Monthly aggregation with quality metrics",
      ],
    },
    {
      query: `-- Excel Power Query reconciliation logic
// Power Query M — batch reconciliation check
let
    Source = Sql.Database("server", "finance_db"),
    GLData = Source{[Schema="dbo", Item="gl_transactions"]}[Data],
    Filtered = Table.SelectRows(GLData, each [posting_date] >= #date(2024,1,1)),
    Grouped = Table.Group(Filtered, {"posting_date"}, {
        {"total_amount", each List.Sum([amount]), type number},
        {"record_count", each Table.RowCount(_), type number},
        {"duplicate_count", each List.Sum(
            List.Transform([is_duplicate], each if _ = 1 then 1 else 0)
        ), type number}
    }),
    AddLeakage = Table.AddColumn(Grouped, "leakage_flag", 
        each if [duplicate_count] > 0 then "Review" else "OK")
in
    AddLeakage`,
      transformations: [
        "Power Query M used for batch reconciliation",
        "Daily grouping with duplicate detection",
        "Leakage flag added for manual review",
        "Exported to Excel for spot-check validation",
      ],
    },
  ],
  "finance-control-failures": [
    {
      query: `-- Control failure trend analysis with severity normalisation
WITH normalised AS (
  SELECT
    risk_id,
    risk_category,
    CASE 
      WHEN UPPER(severity) IN ('HIGH', 'H', '3') THEN 'High'
      WHEN UPPER(severity) IN ('MEDIUM', 'M', '2') THEN 'Medium'
      ELSE 'Low'
    END AS severity_std,
    control_status,
    last_review_date,
    CASE 
      WHEN last_review_date < CURRENT_DATE - INTERVAL '365 days' 
      THEN 'stale'
      ELSE 'current'
    END AS review_status
  FROM operational_risk_register
  WHERE is_active = 1
)
SELECT
  DATE_TRUNC('month', last_review_date) AS month,
  COUNT(*) FILTER (WHERE control_status = 'Failed') AS control_failures,
  ROUND(100.0 * COUNT(*) FILTER (WHERE severity_std = 'High') / 
        NULLIF(COUNT(*), 0), 1) AS high_severity_pct
FROM normalised
GROUP BY DATE_TRUNC('month', last_review_date);`,
      transformations: [
        "Severity labels standardised (High/Medium/Low)",
        "Stale reviews flagged (>12 months)",
        "Control failure count aggregated monthly",
        "High severity percentage calculated",
      ],
    },
    {
      query: `-- Financial impact estimation using T-SQL
-- T-SQL procedure for impact calculation
WITH impact_calc AS (
  SELECT
    r.risk_id,
    r.risk_category,
    r.severity,
    ISNULL(f.exposure_gbp, 0) AS exposure_gbp,
    ISNULL(f.mitigation_cost_gbp, 0) AS mitigation_cost_gbp,
    CASE 
      WHEN r.severity = 'High' THEN f.exposure_gbp * 0.8
      WHEN r.severity = 'Medium' THEN f.exposure_gbp * 0.5
      ELSE f.exposure_gbp * 0.2
    END AS expected_loss_gbp
  FROM operational_risk_register r
  INNER JOIN financial_impact f ON r.risk_id = f.risk_id
  WHERE r.is_active = 1
)
SELECT
  risk_category,
  COUNT(*) AS risk_count,
  SUM(expected_loss_gbp) / 1000000.0 AS total_expected_loss_m_gbp,
  AVG(expected_loss_gbp) / 1000000.0 AS avg_expected_loss_m_gbp
FROM impact_calc
GROUP BY risk_category
ORDER BY total_expected_loss_m_gbp DESC;`,
      transformations: [
        "T-SQL used (Microsoft SQL Server environment)",
        "Expected loss weighted by severity level",
        "Financial impact joined from separate register",
        "Category-level aggregation for board reporting",
      ],
    },
  ],
  "cx-support-retention": [
    {
      query: `-- Customer retention cohort analysis with revenue
WITH events_cleaned AS (
  SELECT
    user_id,
    event_type,
    event_timestamp AT TIME ZONE 'UTC' AS event_ts,
    FIRST_VALUE(session_id) OVER (
      PARTITION BY user_id, DATE(event_timestamp)
      ORDER BY event_timestamp
    ) AS session_id,
    CASE 
      WHEN currency = 'USD' THEN revenue_value * 0.79
      WHEN currency = 'EUR' THEN revenue_value * 0.86
      ELSE revenue_value
    END AS revenue_gbp
  FROM customer_events
  WHERE event_timestamp >= '2024-01-01'
)
SELECT
  DATE_TRUNC('month', event_ts) AS cohort_month,
  COUNT(DISTINCT user_id) AS active_users,
  SUM(revenue_gbp) AS total_revenue_gbp,
  AVG(revenue_gbp) AS avg_revenue_per_user
FROM events_cleaned
GROUP BY DATE_TRUNC('month', event_ts);`,
      transformations: [
        "Timestamps normalised to UTC",
        "Session IDs deduplicated per user per day",
        "Revenue converted to GBP",
        "Cohort aggregation applied",
      ],
    },
    {
      query: `# Python — churn prediction feature engineering
import pandas as pd
import numpy as np

events = pd.read_csv('customer_events_cleaned.csv')
events['event_ts'] = pd.to_datetime(events['event_ts'])

# Feature engineering for churn model
features = (
    events.groupby('user_id')
    .agg(
        total_sessions=('session_id', 'nunique'),
        total_revenue_gbp=('revenue_gbp', 'sum'),
        avg_session_gap_days=('event_ts', lambda x: x.diff().dt.days.mean()),
        last_active=('event_ts', 'max'),
        first_active=('event_ts', 'min'),
    )
    .assign(
        tenure_days=lambda df: (df['last_active'] - df['first_active']).dt.days,
        is_churned=lambda df: (pd.Timestamp.now() - df['last_active']).dt.days > 30,
        revenue_per_session=lambda df: df['total_revenue_gbp'] / df['total_sessions']
    )
)
print(f"Churn rate: {features['is_churned'].mean():.1%}")`,
      transformations: [
        "Python pandas for feature engineering",
        "Session gap analysis for churn prediction",
        "Tenure and activity metrics derived",
        "30-day inactivity threshold for churn definition",
      ],
    },
    {
      query: `-- Funnel drop-off analysis with conversion rates
WITH funnel_events AS (
  SELECT
    user_id,
    MIN(CASE WHEN event_type = 'signup' THEN event_ts END) AS signup_ts,
    MIN(CASE WHEN event_type = 'first_activity' THEN event_ts END) AS activity_ts,
    MIN(CASE WHEN event_type = 'subscription' THEN event_ts END) AS sub_ts,
    MIN(CASE WHEN event_type = 'retention_30d' THEN event_ts END) AS retention_ts
  FROM events_cleaned
  GROUP BY user_id
)
SELECT
  'Signup' AS stage, COUNT(*) AS users, 0.0 AS dropoff_pct
FROM funnel_events WHERE signup_ts IS NOT NULL
UNION ALL
SELECT
  'First Activity', COUNT(*),
  ROUND(100.0 * (1 - COUNT(activity_ts)::FLOAT / NULLIF(COUNT(signup_ts), 0)), 1)
FROM funnel_events
UNION ALL
SELECT
  'Subscription', COUNT(sub_ts),
  ROUND(100.0 * (1 - COUNT(sub_ts)::FLOAT / NULLIF(COUNT(activity_ts), 0)), 1)
FROM funnel_events
UNION ALL
SELECT
  'Retention (30d)', COUNT(retention_ts),
  ROUND(100.0 * (1 - COUNT(retention_ts)::FLOAT / NULLIF(COUNT(sub_ts), 0)), 1)
FROM funnel_events;`,
      transformations: [
        "UNION-based funnel construction from events",
        "Stage-by-stage drop-off percentage calculated",
        "NULL handling for incomplete journeys",
        "Conversion rates derived per stage transition",
      ],
    },
  ],
};

// Tools used — varied per project
const toolsByProject: Record<string, { name: string; icon: typeof Database; description: string }[]> = {
  "telecom-network-billing": [
    { name: "PostgreSQL", icon: Database, description: "Data extraction & aggregation from network monitoring systems" },
    { name: "Python", icon: Code, description: "pandas for automated KPI calculations and anomaly detection" },
    { name: "Power BI", icon: PieChart, description: "Executive dashboard with regional drilldowns and SLA tracking" },
    { name: "Excel", icon: FileSpreadsheet, description: "Ad-hoc SLA compliance checks and regional comparisons" },
  ],
  "telecom-revenue-risk": [
    { name: "PostgreSQL", icon: Database, description: "Revenue extraction and billing error aggregation queries" },
    { name: "Python (pandas)", icon: Code, description: "Account-level risk scoring and currency normalisation" },
    { name: "Power BI", icon: PieChart, description: "Revenue risk dashboards with error trend visualisation" },
    { name: "DAX", icon: Layers, description: "Custom DAX measures for leakage rate calculations in Power BI" },
  ],
  "finance-revenue-leakage": [
    { name: "T-SQL", icon: Database, description: "Core banking data extraction via SQL Server stored procedures" },
    { name: "Excel (Power Query)", icon: FileSpreadsheet, description: "Batch reconciliation and duplicate detection workflows" },
    { name: "Power BI", icon: PieChart, description: "Revenue leakage monitoring with data quality overlays" },
    { name: "Python", icon: Code, description: "Automated validation scripts for orphaned transaction detection" },
  ],
  "finance-control-failures": [
    { name: "T-SQL", icon: Database, description: "Risk register queries from Microsoft SQL Server environment" },
    { name: "Power BI", icon: PieChart, description: "Control effectiveness dashboards for board-level reporting" },
    { name: "Excel", icon: FileSpreadsheet, description: "Manual control testing documentation and evidence tracking" },
    { name: "SharePoint", icon: Layers, description: "Risk register management and control owner assignment workflows" },
  ],
  "cx-support-retention": [
    { name: "PostgreSQL", icon: Database, description: "Customer event extraction and funnel query construction" },
    { name: "Python (pandas)", icon: Code, description: "Churn feature engineering, cohort analysis, and data cleaning" },
    { name: "Power BI", icon: PieChart, description: "Customer journey dashboards with retention curve visualisation" },
    { name: "Jupyter Notebook", icon: LineChart, description: "Exploratory analysis of churn drivers and retention patterns" },
  ],
};

interface CodeBlockProps {
  code: string;
  className?: string;
}

const CodeBlock = ({ code, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group", className)}>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 z-10"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-status-healthy" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <ScrollArea className="h-[300px]">
        <pre className="p-4 bg-muted/30 rounded-lg border border-border text-sm font-mono overflow-x-auto">
          <code className="text-foreground/90 whitespace-pre">{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
};

interface CleanedDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export const CleanedDataModal = ({ open, onOpenChange, projectId }: CleanedDataModalProps) => {
  const queries = cleanedQuerySnippets[projectId] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-status-healthy" />
            Cleaned & Transformed Queries
          </DialogTitle>
          <DialogDescription>
            Production-ready SQL and transformation logic — {queries.length} queries
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {queries.map((data, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Query {idx + 1} of {queries.length}
                </Badge>
              </div>
              <CodeBlock code={data.query} />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Transformations Applied:</h4>
                <ul className="space-y-1">
                  {data.transformations.map((transform, tidx) => (
                    <li key={tidx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-status-healthy mt-0.5">✓</span>
                      {transform}
                    </li>
                  ))}
                </ul>
              </div>
              {idx < queries.length - 1 && (
                <div className="border-t border-border/50 pt-2" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ToolsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export const ToolsModal = ({ open, onOpenChange, projectId }: ToolsModalProps) => {
  const tools = toolsByProject[projectId] || toolsByProject["telecom-network-billing"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Tools Used
          </DialogTitle>
          <DialogDescription>
            Technologies used across extraction, cleaning, and reporting
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <TooltipProvider>
            {tools.map((tool) => (
              <Tooltip key={tool.name}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-help">
                    <div className="p-2 rounded-md bg-primary/10">
                      <tool.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{tool.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[220px]">
                  <p>{tool.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};
