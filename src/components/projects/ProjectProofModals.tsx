import { useState } from "react";
import { Database, Sparkles, Wrench, BarChart3, Copy, Check, ExternalLink } from "lucide-react";
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

// Raw SQL snippets by project
const rawQuerySnippets: Record<string, { query: string; issues: string[] }> = {
  "telecom-network-billing": {
    query: `-- Raw extract from network monitoring system
SELECT *
FROM network_performance_log
WHERE log_date >= '2024-01-01'
  AND region_code IN ('N', 'S', 'E', 'W');

-- Issues: Mixed region codes, null uptime values, 
-- duplicate entries from failover logging`,
    issues: [
      "Inconsistent region codes (N vs North)",
      "Null uptime values for partial outages",
      "Duplicate rows from failover systems",
    ],
  },
  "telecom-revenue-risk": {
    query: `-- Raw billing transaction extract
SELECT 
    customer_id,
    transaction_date,
    amount,
    currency,
    error_flag
FROM billing_transactions
WHERE transaction_date BETWEEN '2024-01-01' AND '2024-12-31';

-- Issues: Mixed currencies, missing error descriptions,
-- amount stored as VARCHAR`,
    issues: [
      "Currency stored as text (USD, GBP, EUR mixed)",
      "Amount field is VARCHAR, requires casting",
      "Error codes not standardised across systems",
    ],
  },
  "finance-revenue-leakage": {
    query: `-- Raw transaction extract from core banking
SELECT *
FROM gl_transactions t
LEFT JOIN customer_master c ON t.cust_id = c.id
WHERE t.posting_date >= '2024-01-01';

-- Issues: Orphaned transactions, null customer refs,
-- duplicate posting from batch retries`,
    issues: [
      "Orphaned transactions (missing customer refs)",
      "Batch retry duplicates not flagged",
      "Null values in mandatory fields",
    ],
  },
  "finance-control-failures": {
    query: `-- Risk register extract
SELECT 
    risk_id,
    risk_category,
    severity,
    control_status,
    last_review_date
FROM operational_risk_register
WHERE is_active = 1;

-- Issues: Inconsistent severity labels, 
-- stale review dates, missing control owners`,
    issues: [
      "Severity labels inconsistent (High/H/3)",
      "Review dates >12 months old",
      "Control owner field 40% null",
    ],
  },
  "cx-support-retention": {
    query: `-- Customer journey events extract
SELECT 
    user_id,
    event_type,
    event_timestamp,
    session_id,
    revenue_value
FROM customer_events
WHERE event_timestamp >= '2024-01-01';

-- Issues: Timezone inconsistencies, 
-- duplicate session IDs, revenue in multiple currencies`,
    issues: [
      "Timestamps in mixed timezones (UTC/BST)",
      "Duplicate session IDs from mobile + web",
      "Revenue values in USD, EUR, GBP",
    ],
  },
};

// Cleaned SQL snippets by project
const cleanedQuerySnippets: Record<string, { query: string; transformations: string[] }> = {
  "telecom-network-billing": {
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
  "telecom-revenue-risk": {
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
  "finance-revenue-leakage": {
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
      "Orphaned transactions identified",
      "Duplicate batch entries flagged",
      "Monthly aggregation with quality metrics",
    ],
  },
  "finance-control-failures": {
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
  "cx-support-retention": {
    query: `-- Customer retention cohort analysis with revenue
WITH events_cleaned AS (
  SELECT
    user_id,
    event_type,
    -- Normalise to UTC
    event_timestamp AT TIME ZONE 'UTC' AS event_ts,
    -- Dedupe sessions
    FIRST_VALUE(session_id) OVER (
      PARTITION BY user_id, DATE(event_timestamp)
      ORDER BY event_timestamp
    ) AS session_id,
    -- Convert to GBP
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
};

// Tools used by project
const toolsUsed = [
  { name: "SQL", icon: Database, description: "Data extraction & aggregation from source systems" },
  { name: "Python", icon: Sparkles, description: "Data cleaning, validation & pandas transformations" },
  { name: "Excel", icon: BarChart3, description: "Reconciliation checks & spot validation" },
  { name: "Power BI", icon: BarChart3, description: "Executive dashboard & visual reporting" },
];

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
        className="absolute top-3 right-3 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
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

interface RawDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export const RawDataModal = ({ open, onOpenChange, projectId }: RawDataModalProps) => {
  const data = rawQuerySnippets[projectId];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Raw Data & Queries
          </DialogTitle>
          <DialogDescription>
            Source SQL extracts before cleaning — includes data quality issues
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <CodeBlock code={data?.query || "-- No query available"} />
          
          {data?.issues && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Data Quality Issues Identified:</h4>
              <ul className="space-y-1">
                {data.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-status-warning mt-0.5">⚠</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface CleanedDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export const CleanedDataModal = ({ open, onOpenChange, projectId }: CleanedDataModalProps) => {
  const data = cleanedQuerySnippets[projectId];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-status-healthy" />
            Cleaned & Transformed Queries
          </DialogTitle>
          <DialogDescription>
            Production-ready SQL with data quality transformations applied
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <CodeBlock code={data?.query || "-- No query available"} />
          
          {data?.transformations && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Transformations Applied:</h4>
              <ul className="space-y-1">
                {data.transformations.map((transform, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-status-healthy mt-0.5">✓</span>
                    {transform}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ToolsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ToolsModal = ({ open, onOpenChange }: ToolsModalProps) => {
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
            {toolsUsed.map((tool) => (
              <Tooltip key={tool.name}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-help">
                    <div className="p-2 rounded-md bg-primary/10">
                      <tool.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{tool.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
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

interface DashboardPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
}

export const DashboardPreviewModal = ({ open, onOpenChange, projectTitle }: DashboardPreviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Power BI Dashboard
          </DialogTitle>
          <DialogDescription>
            Executive dashboard for {projectTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video bg-muted/30 rounded-lg border border-border flex items-center justify-center">
            <div className="text-center space-y-2">
              <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto" />
              <p className="text-sm text-muted-foreground">Power BI dashboard preview</p>
              <Badge variant="outline" className="text-xs">
                Executive Reporting
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Visuals created in Power BI for executive reporting
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
