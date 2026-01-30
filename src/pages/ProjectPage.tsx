import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Target, AlertTriangle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProjectById } from "@/lib/data";
import NetworkBillingDashboard from "@/components/projects/NetworkBillingDashboard";
import RevenueRiskDashboard from "@/components/projects/RevenueRiskDashboard";
import RevenueLeakageDashboard from "@/components/projects/RevenueLeakageDashboard";
import ControlFailuresDashboard from "@/components/projects/ControlFailuresDashboard";
import SupportRetentionDashboard from "@/components/projects/SupportRetentionDashboard";

const dashboardComponents: Record<string, React.ComponentType> = {
  "telecom-network-billing": NetworkBillingDashboard,
  "telecom-revenue-risk": RevenueRiskDashboard,
  "finance-revenue-leakage": RevenueLeakageDashboard,
  "finance-control-failures": ControlFailuresDashboard,
  "cx-support-retention": SupportRetentionDashboard,
};

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const project = getProjectById(id || "");

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  const DashboardComponent = dashboardComponents[project.id];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="section-container py-6">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <section className="section-container pb-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider mb-4">
              {project.industryLabel}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {project.description}
            </p>
          </div>
        </section>

        {/* Business Context */}
        <section className="bg-secondary/30 py-12">
          <div className="section-container">
            <h2 className="text-xl font-semibold text-foreground mb-8">Business Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-status-warning-bg rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-status-warning" />
                  </div>
                  <h3 className="font-semibold text-foreground">Business Problem</h3>
                </div>
                <p className="text-muted-foreground">{project.businessProblem}</p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Target Audience</h3>
                </div>
                <p className="text-muted-foreground">{project.audience}</p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-status-healthy-bg rounded-lg">
                    <Target className="h-5 w-5 text-status-healthy" />
                  </div>
                  <h3 className="font-semibold text-foreground">Decision Supported</h3>
                </div>
                <p className="text-muted-foreground">{project.decisionSupported}</p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-status-risk-bg rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-status-risk" />
                  </div>
                  <h3 className="font-semibold text-foreground">Risk of Ignoring</h3>
                </div>
                <p className="text-muted-foreground">{project.riskOfIgnoring}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section className="py-12">
          <div className="section-container">
            <h2 className="text-xl font-semibold text-foreground mb-8">Performance Dashboard</h2>
            {DashboardComponent && <DashboardComponent />}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectPage;
