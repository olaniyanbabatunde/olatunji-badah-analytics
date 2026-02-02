import { motion, Variants } from "framer-motion";
import { FileText, TrendingUp, Shield, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const capabilities = [
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Monitoring service levels, operational efficiency, and KPI performance across enterprise systems with clear trend analysis and target tracking.",
    },
    {
      icon: Shield,
      title: "Risk & Data Quality",
      description: "Identifying control failures, data quality gaps, and compliance risks before they impact business outcomes, with actionable remediation insights.",
    },
    {
      icon: Users,
      title: "Customer & Operational Insights",
      description: "Translating customer journey data and operational metrics into retention strategies and process improvements that drive measurable value.",
    },
    {
      icon: BarChart3,
      title: "Data Storytelling for Decision-Makers",
      description: "Presenting complex analysis in executive-friendly formats that support informed decision-making, not just data display.",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="about" className="py-24 md:py-32 bg-secondary/40 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-primary/3 to-transparent blur-3xl" />

      <div className="section-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
              About
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Data Analyst – Performance, Risk & Decision Intelligence
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experienced delivering analytics across Telecommunications, Financial Services, 
              and Customer Experience — and adaptable to new domains and problem spaces. 
              I focus on turning data into clear, actionable insights that support real business decisions.
            </p>
          </motion.div>

          {/* Capability Cards */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-lg font-semibold text-foreground mb-8 text-center">
              What I Deliver
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group bg-card p-6 rounded-xl border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="p-3 bg-primary/8 rounded-lg flex-shrink-0 group-hover:bg-primary/12 transition-colors duration-300"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <capability.icon className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {capability.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Approach Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-card p-8 rounded-xl border border-border shadow-card mb-12 relative overflow-hidden"
          >
            {/* Accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            
            <h3 className="text-lg font-semibold text-foreground mb-5">
              How I Work
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I approach analytics with a focus on clarity and business impact. Every metric 
                should support a decision, and every dashboard should tell a story that stakeholders 
                can act on without needing to interpret raw data themselves.
              </p>
              <p>
                My experience spans regulated industries where data quality, governance, and 
                compliance are non-negotiable. I understand the constraints of working with 
                real-world data — messy, incomplete, and often spread across multiple systems.
              </p>
              <p>
                The projects in this portfolio demonstrate how I think about analytics problems: 
                from understanding business context, to structuring the right metrics, to 
                presenting insights in ways that enable confident decision-making.
              </p>
            </div>
          </motion.div>

          {/* CV Link */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-muted-foreground mb-5">
              For detailed work experience, education, and technical skills:
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                <a href="/cv/olatunji_badah.pdf" target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full CV (PDF)
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
