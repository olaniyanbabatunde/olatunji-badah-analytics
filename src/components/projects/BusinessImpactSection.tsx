import { TrendingUp, Lightbulb, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessImpactSectionProps {
  projectId: string;
}

const impactData: Record<string, {
  keyOutcome: string;
  decisionEnabled: string;
  recommendations: string[];
}> = {
  "telecom-network-billing": {
    keyOutcome: "Reduced SLA breach penalties by £180K annually through proactive uptime monitoring and early warning alerts.",
    decisionEnabled: "Operations teams now prioritise maintenance based on regional risk scores rather than reactive incident reports, reducing mean time to resolution by 35%.",
    recommendations: [
      "Implement automated alerting when uptime falls below 99.3%",
      "Schedule preventive maintenance during predicted low-usage windows",
      "Renegotiate SLA terms for high-variance regions"
    ]
  },
  "telecom-revenue-risk": {
    keyOutcome: "Identified £420K in annual revenue at risk from billing errors, enabling targeted intervention for top 50 affected accounts.",
    decisionEnabled: "Account management now receives weekly risk scores per customer, allowing proactive outreach before contract renewal periods.",
    recommendations: [
      "Prioritise error resolution for high-value enterprise accounts",
      "Implement automated billing reconciliation checks",
      "Create customer-facing transparency reports for trust building"
    ]
  },
  "finance-revenue-leakage": {
    keyOutcome: "Reduced revenue leakage from 4.7% to 2.9% within 6 months through improved data quality controls and reconciliation processes.",
    decisionEnabled: "Finance controllers now have daily visibility into data quality scores, enabling immediate escalation when thresholds are breached.",
    recommendations: [
      "Automate duplicate detection at point of entry",
      "Establish data quality SLAs with upstream systems",
      "Implement real-time leakage monitoring dashboards"
    ]
  },
  "finance-control-failures": {
    keyOutcome: "Reduced high-severity control failures by 40% through early detection and prioritised remediation workflows.",
    decisionEnabled: "Risk committee now receives monthly control effectiveness scores, enabling proactive capital allocation adjustments.",
    recommendations: [
      "Implement control testing automation for high-risk areas",
      "Create escalation protocols tied to severity thresholds",
      "Align control monitoring with regulatory reporting cycles"
    ]
  },
  "cx-support-retention": {
    keyOutcome: "Improved customer retention rate by 12% through targeted intervention at high-risk journey stages.",
    decisionEnabled: "Customer success teams now receive churn risk scores, enabling proactive outreach before customers reach cancellation intent.",
    recommendations: [
      "Focus retention efforts on 30-60 day cohort window",
      "Reduce average resolution time target to under 6 hours",
      "Implement satisfaction score follow-up for scores below 4.0"
    ]
  }
};

const BusinessImpactSection = ({ projectId }: BusinessImpactSectionProps) => {
  const impact = impactData[projectId] || impactData["telecom-network-billing"];

  return (
    <section className="py-12 bg-secondary/30">
      <div className="section-container">
        <h2 className="text-xl font-semibold text-foreground mb-8">Business Impact & Takeaway</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Outcome */}
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-status-healthy-bg rounded-lg">
                <TrendingUp className="h-5 w-5 text-status-healthy" />
              </div>
              <h3 className="font-semibold text-foreground">Key Outcome</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {impact.keyOutcome}
            </p>
          </div>

          {/* Decision Enabled */}
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Decision Enabled</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {impact.decisionEnabled}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-status-warning-bg rounded-lg">
              <CheckCircle className="h-5 w-5 text-status-warning" />
            </div>
            <h3 className="font-semibold text-foreground">Recommended Actions</h3>
          </div>
          <ul className="space-y-3">
            {impact.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary text-sm font-medium rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BusinessImpactSection;
