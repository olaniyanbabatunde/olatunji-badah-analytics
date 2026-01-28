import { Download, Briefcase, GraduationCap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const experience = [
    {
      role: "Data & Performance Analyst",
      company: "Neueda Ltd",
      period: "May 2023 – Present",
      highlights: [
        "Engineered SQL-based pipelines reducing manual processing by 60%",
        "Developed AI-driven Power BI dashboards for KPI tracking",
        "Implemented data quality frameworks ensuring 99% accuracy",
      ],
    },
    {
      role: "Data & Insight Support",
      company: "BT Enterprise",
      period: "Apr 2021 – Apr 2023",
      highlights: [
        "Processed datasets exceeding 100k records",
        "Optimized database queries improving report speed by 40%",
        "Supported audit and governance processes",
      ],
    },
    {
      role: "Customer Experience Analyst Lead",
      company: "Tuteria Ltd",
      period: "Aug 2017 – Jul 2021",
      highlights: [
        "Built data-driven systems reducing operational costs by 30%",
        "Achieved $100k revenue through data-informed strategies",
        "Onboarded 1,200+ learners in first year",
      ],
    },
  ];

  const skills = [
    { category: "Analytics", items: ["SQL", "Python", "Excel/VBA", "Power BI", "DAX"] },
    { category: "Governance", items: ["Data Quality", "GDPR", "Audit & Compliance", "Risk Monitoring"] },
    { category: "AI & ML", items: ["LLM Integration", "Prompt Engineering", "Automated Insights"] },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
              About
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Enterprise Analytics Professional
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Progressive expertise in data analytics, AI engineering, and performance intelligence 
              across regulated industries. Translating complex data into actionable insights for 
              senior stakeholders.
            </p>
          </div>

          {/* Experience timeline */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Experience</h3>
            </div>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2 border-border hover:border-primary transition-colors"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-background border-2 border-primary rounded-full" />
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h4 className="font-semibold text-foreground">{exp.role}</h4>
                      <span className="text-sm text-muted-foreground">{exp.period}</span>
                    </div>
                    <p className="text-primary font-medium text-sm mb-3">{exp.company}</p>
                    <ul className="space-y-1">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-8">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Technical Skills</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <div key={index} className="bg-card p-6 rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-4">{skill.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CV Download */}
          <div className="text-center">
            <Button asChild size="lg">
              <a href="/cv/olatunji_badah.pdf" download>
                <Download className="h-4 w-4 mr-2" />
                Download Full CV
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
