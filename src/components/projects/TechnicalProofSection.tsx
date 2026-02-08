import { useState } from "react";
import { ChevronDown, Copy, Check, Database, Code2, Wrench, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProofCard {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

interface TechnicalProofSectionProps {
  projectId: string;
}

// Tool badge component with tooltip
const ToolBadge = ({ 
  name, 
  icon, 
  description 
}: { 
  name: string; 
  icon: string; 
  description: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-lg cursor-help transition-colors">
            <span className="text-sm">{icon}</span>
            <span className="text-sm font-medium text-foreground">{name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Code block with copy functionality
const CodeBlock = ({ 
  code, 
  label, 
  language = "sql" 
}: { 
  code: string; 
  label: string;
  language?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-status-healthy" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <pre className="bg-secondary/30 border border-border rounded-lg p-4 overflow-x-auto text-sm">
          <code className={`language-${language} text-foreground/90`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

// Collapsible card component
const CollapsibleCard = ({ 
  card, 
  isOpen, 
  onToggle 
}: { 
  card: ProofCard; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  const Icon = card.icon;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-inset"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{card.title}</span>
        </div>
        <ChevronDown 
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-5 pt-0 border-t border-border">
          {card.content}
        </div>
      </div>
    </div>
  );
};

// Project-specific data configurations
const getProjectProofData = (projectId: string) => {
  const proofDataMap: Record<string, {
    rawQuery: { code: string; label: string };
    cleanQuery: { code: string; label: string };
    tools: Array<{ name: string; icon: string; description: string }>;
    visuals: Array<{ name: string; description: string }>;
  }> = {
    "telecom-network-billing": {
      rawQuery: {
        code: `-- Raw extract from network monitoring system
SELECT 
    region_id,
    timestamp,
    uptime_status,
    sla_threshold,
    incident_flag
FROM network_performance_log
WHERE timestamp >= '2024-01-01';

-- Issues: Nulls in uptime_status, duplicates from polling intervals`,
        label: "Source extract from network monitoring — unclean, contains nulls & duplicate polling entries"
      },
      cleanQuery: {
        code: `WITH cleaned AS (
    SELECT DISTINCT
        region_id,
        DATE_TRUNC('month', timestamp) AS month,
        CAST(uptime_status AS NUMERIC) AS uptime_pct,
        sla_threshold
    FROM network_performance_log
    WHERE uptime_status IS NOT NULL
),
monthly_avg AS (
    SELECT 
        region_id,
        month,
        AVG(uptime_pct) AS avg_uptime,
        MAX(sla_threshold) AS target
    FROM cleaned
    GROUP BY region_id, month
)
SELECT 
    month,
    region_id,
    ROUND(avg_uptime, 2) AS uptime_pct,
    target AS uptime_target_pct,
    CASE 
        WHEN avg_uptime >= target THEN 'healthy'
        WHEN avg_uptime >= target - 0.5 THEN 'warning'
        ELSE 'risk'
    END AS sla_status
FROM monthly_avg;`,
        label: "Duplicates removed, uptime averaged per month, SLA status derived"
      },
      tools: [
        { name: "SQL (T-SQL)", icon: "🗄️", description: "Data extraction & aggregation from network monitoring databases" },
        { name: "Python (pandas)", icon: "🐍", description: "Data cleaning, null handling, and trend calculations" },
        { name: "Excel", icon: "📊", description: "Reconciliation checks and stakeholder spot validation" },
        { name: "Power BI", icon: "📈", description: "Executive dashboard visuals and SLA compliance reporting" }
      ],
      visuals: [
        { name: "Regional Uptime Trend", description: "Monthly line chart showing uptime percentage vs SLA target" },
        { name: "SLA Status KPIs", description: "Tile cards with current status, delta vs target, and trend indicators" },
        { name: "Incident Breakdown", description: "Bar chart of incident types with resolution time overlay" }
      ]
    },
    "telecom-revenue-risk": {
      rawQuery: {
        code: `-- Raw billing transaction extract
SELECT 
    transaction_id,
    customer_id,
    billing_date,
    expected_amount,
    actual_amount,
    error_code
FROM billing_transactions
WHERE billing_date >= '2024-01-01';

-- Issues: Currency format inconsistencies, null error codes`,
        label: "Source extract from billing system — currency format issues, incomplete error codes"
      },
      cleanQuery: {
        code: `WITH cleaned_billing AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', billing_date) AS month,
        CAST(REPLACE(expected_amount, '£', '') AS NUMERIC) AS expected_gbp,
        CAST(REPLACE(actual_amount, '£', '') AS NUMERIC) AS actual_gbp,
        COALESCE(error_code, 'NONE') AS error_flag
    FROM billing_transactions
    WHERE expected_amount IS NOT NULL
),
monthly_risk AS (
    SELECT 
        month,
        SUM(expected_gbp) AS expected_revenue,
        SUM(actual_gbp) AS actual_revenue,
        SUM(expected_gbp - actual_gbp) AS revenue_at_risk,
        COUNT(CASE WHEN error_flag != 'NONE' THEN 1 END) AS error_count
    FROM cleaned_billing
    GROUP BY month
)
SELECT 
    month,
    expected_revenue,
    actual_revenue,
    revenue_at_risk,
    ROUND(revenue_at_risk / expected_revenue * 100, 2) AS leakage_rate_pct
FROM monthly_risk;`,
        label: "Currency normalised, risk aggregated monthly, leakage rate calculated"
      },
      tools: [
        { name: "SQL (PostgreSQL)", icon: "🗄️", description: "Billing data extraction and revenue aggregation" },
        { name: "Python (pandas)", icon: "🐍", description: "Currency parsing, error classification, and trend analysis" },
        { name: "Excel", icon: "📊", description: "Finance team reconciliation and spot checks" },
        { name: "Power BI", icon: "📈", description: "Revenue risk dashboards for operations leadership" }
      ],
      visuals: [
        { name: "Revenue at Risk Trend", description: "Area chart showing expected vs actual revenue with risk highlighted" },
        { name: "Error Rate Trend", description: "Line chart tracking billing error rate over time" },
        { name: "Risk KPI Tiles", description: "Current revenue at risk, leakage rate, and month-on-month change" }
      ]
    },
    "finance-revenue-leakage": {
      rawQuery: {
        code: `-- Raw transaction extract
SELECT 
    transaction_id,
    account_id,
    transaction_date,
    amount_gbp,
    status,
    data_quality_flag
FROM financial_transactions
WHERE transaction_date >= '2024-01-01';

-- Issues: Duplicate transaction IDs, null amounts, delayed records`,
        label: "Source extract from transaction system — duplicates, nulls, and timing issues"
      },
      cleanQuery: {
        code: `WITH deduplicated AS (
    SELECT DISTINCT ON (transaction_id)
        transaction_id,
        account_id,
        DATE_TRUNC('month', transaction_date) AS month,
        CAST(amount_gbp AS NUMERIC) AS revenue_gbp,
        status
    FROM financial_transactions
    WHERE amount_gbp IS NOT NULL
    ORDER BY transaction_id, transaction_date DESC
),
monthly_revenue AS (
    SELECT 
        month,
        SUM(CASE WHEN status = 'expected' THEN revenue_gbp ELSE 0 END) AS expected_revenue,
        SUM(CASE WHEN status = 'actual' THEN revenue_gbp ELSE 0 END) AS actual_revenue
    FROM deduplicated
    GROUP BY month
)
SELECT 
    month,
    expected_revenue,
    actual_revenue,
    expected_revenue - actual_revenue AS leakage_gbp,
    ROUND((expected_revenue - actual_revenue) / expected_revenue * 100, 2) AS leakage_pct
FROM monthly_revenue;`,
        label: "Deduplicated by transaction ID, revenue matched, leakage quantified"
      },
      tools: [
        { name: "SQL (T-SQL)", icon: "🗄️", description: "Transaction data extraction and deduplication" },
        { name: "Python (pandas)", icon: "🐍", description: "Data quality scoring and trend calculations" },
        { name: "Excel", icon: "📊", description: "Audit trail and reconciliation with finance team" },
        { name: "Power BI", icon: "📈", description: "Revenue leakage dashboards for finance controllers" }
      ],
      visuals: [
        { name: "Revenue Leakage Trend", description: "Monthly comparison of expected vs actual revenue" },
        { name: "Data Quality Score", description: "Completeness, validity, and timeliness indicators" },
        { name: "Leakage KPIs", description: "Total leakage (£), leakage rate, and status indicators" }
      ]
    },
    "finance-control-failures": {
      rawQuery: {
        code: `-- Raw control monitoring extract
SELECT 
    control_id,
    control_area,
    check_date,
    pass_fail_status,
    severity_level,
    financial_impact_gbp
FROM control_monitoring_log
WHERE check_date >= '2024-01-01';

-- Issues: Inconsistent severity labels, missing impact values`,
        label: "Source extract from control monitoring — inconsistent severity, gaps in impact data"
      },
      cleanQuery: {
        code: `WITH standardised AS (
    SELECT
        control_id,
        control_area,
        DATE_TRUNC('month', check_date) AS month,
        CASE 
            WHEN UPPER(pass_fail_status) IN ('FAIL', 'FAILED', 'F') THEN 'fail'
            ELSE 'pass'
        END AS status,
        CASE 
            WHEN UPPER(severity_level) IN ('H', 'HIGH', 'CRITICAL') THEN 'high'
            WHEN UPPER(severity_level) IN ('M', 'MEDIUM', 'MED') THEN 'medium'
            ELSE 'low'
        END AS severity,
        COALESCE(financial_impact_gbp, 0) AS impact_gbp
    FROM control_monitoring_log
),
monthly_failures AS (
    SELECT 
        month,
        COUNT(*) AS total_failures,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) AS high_severity_count,
        AVG(impact_gbp) AS avg_impact
    FROM standardised
    WHERE status = 'fail'
    GROUP BY month
)
SELECT 
    month,
    total_failures,
    ROUND(high_severity_count::NUMERIC / total_failures * 100, 0) AS high_severity_pct,
    ROUND(avg_impact, 2) AS avg_financial_impact_gbp
FROM monthly_failures;`,
        label: "Severity standardised, impacts filled, monthly failure trends calculated"
      },
      tools: [
        { name: "SQL (PostgreSQL)", icon: "🗄️", description: "Control data extraction and failure aggregation" },
        { name: "Python (pandas)", icon: "🐍", description: "Severity standardisation and risk scoring" },
        { name: "Excel", icon: "📊", description: "Risk register reconciliation with compliance team" },
        { name: "Power BI", icon: "📈", description: "Operational risk dashboards for CRO reporting" }
      ],
      visuals: [
        { name: "Control Failure Trend", description: "Monthly failure count with severity breakdown" },
        { name: "High Severity Trend", description: "Percentage of high-severity failures over time" },
        { name: "Risk KPIs", description: "Current failures, severity mix, and average financial impact" }
      ]
    },
    "cx-support-retention": {
      rawQuery: {
        code: `-- Raw customer support extract
SELECT 
    ticket_id,
    customer_id,
    created_date,
    resolved_date,
    satisfaction_score,
    churn_flag
FROM support_tickets
WHERE created_date >= '2024-01-01';

-- Issues: Null resolution dates for open tickets, score format varies`,
        label: "Source extract from support system — open tickets without dates, inconsistent scores"
      },
      cleanQuery: {
        code: `WITH cleaned_tickets AS (
    SELECT
        ticket_id,
        customer_id,
        DATE_TRUNC('month', created_date) AS month,
        CASE 
            WHEN resolved_date IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (resolved_date - created_date)) / 3600
            ELSE NULL
        END AS resolution_hours,
        CAST(REPLACE(satisfaction_score, '/5', '') AS NUMERIC) AS csat_score
    FROM support_tickets
    WHERE satisfaction_score IS NOT NULL
),
monthly_metrics AS (
    SELECT 
        month,
        COUNT(*) AS ticket_count,
        AVG(resolution_hours) AS avg_resolution_hrs,
        AVG(csat_score) AS avg_csat
    FROM cleaned_tickets
    GROUP BY month
)
SELECT 
    month,
    ticket_count AS support_tickets,
    ROUND(avg_resolution_hrs, 1) AS avg_resolution_hours,
    ROUND(avg_csat, 1) AS csat_score
FROM monthly_metrics;`,
        label: "Resolution time calculated, CSAT normalised, monthly trends aggregated"
      },
      tools: [
        { name: "SQL (PostgreSQL)", icon: "🗄️", description: "Support ticket data extraction and aggregation" },
        { name: "Python (pandas)", icon: "🐍", description: "Resolution time calculations and retention analysis" },
        { name: "Excel", icon: "📊", description: "Customer segment validation with CX team" },
        { name: "Power BI", icon: "📈", description: "Customer journey dashboards for VP of Success" }
      ],
      visuals: [
        { name: "Support Volume Trend", description: "Monthly ticket count with resolution time overlay" },
        { name: "Customer Satisfaction Trend", description: "CSAT score trajectory over time" },
        { name: "Revenue Impact", description: "Revenue at risk vs retained revenue comparison" }
      ]
    }
  };

  return proofDataMap[projectId] || proofDataMap["telecom-network-billing"];
};

const TechnicalProofSection = ({ projectId }: TechnicalProofSectionProps) => {
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  const proofData = getProjectProofData(projectId);

  const toggleCard = (cardId: string) => {
    setOpenCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const proofCards: ProofCard[] = [
    {
      id: "raw",
      title: "Raw Extracts & Queries",
      icon: Database,
      content: (
        <div className="space-y-4 pt-4">
          <CodeBlock 
            code={proofData.rawQuery.code}
            label="Raw SQL extract"
          />
          <p className="text-sm text-muted-foreground italic">
            {proofData.rawQuery.label}
          </p>
        </div>
      )
    },
    {
      id: "clean",
      title: "Cleaned Queries",
      icon: Code2,
      content: (
        <div className="space-y-4 pt-4">
          <CodeBlock 
            code={proofData.cleanQuery.code}
            label="Clean SQL / Python processing"
          />
          <p className="text-sm text-muted-foreground italic">
            {proofData.cleanQuery.label}
          </p>
        </div>
      )
    },
    {
      id: "tools",
      title: "Tools Used",
      icon: Wrench,
      content: (
        <div className="space-y-4 pt-4">
          <div className="flex flex-wrap gap-3">
            {proofData.tools.map((tool) => (
              <ToolBadge 
                key={tool.name}
                name={tool.name}
                icon={tool.icon}
                description={tool.description}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Hover over each tool to see how it was used in this project.
          </p>
        </div>
      )
    },
    {
      id: "visuals",
      title: "Visuals (Reporting)",
      icon: BarChart3,
      content: (
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proofData.visuals.map((visual) => (
              <div 
                key={visual.name}
                className="p-4 bg-secondary/30 border border-border rounded-lg"
              >
                <h4 className="font-medium text-foreground mb-1">{visual.name}</h4>
                <p className="text-sm text-muted-foreground">{visual.description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground italic mt-2">
            Visuals created with Power BI for executive reporting.
          </p>
        </div>
      )
    }
  ];

  return (
    <section className="py-12">
      <div className="section-container">
        <h2 className="text-xl font-semibold text-foreground mb-2">How This Was Built</h2>
        <p className="text-muted-foreground mb-8">
          Technical transparency: from raw data to executive insights.
        </p>
        
        <div className="space-y-4">
          {proofCards.map((card) => (
            <CollapsibleCard
              key={card.id}
              card={card}
              isOpen={openCards.has(card.id)}
              onToggle={() => toggleCard(card.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicalProofSection;
