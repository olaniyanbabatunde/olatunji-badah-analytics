import { motion, Variants } from "framer-motion";
import { Database, Code, FileSpreadsheet, PieChart, BarChart3, CheckCircle2 } from "lucide-react";

interface TechSkill {
  name: string;
  label: string;
  icon: typeof Database;
}

const techStack: TechSkill[] = [
  {
    name: "SQL & Database Querying",
    label: "Extensive production use",
    icon: Database,
  },
  {
    name: "Python (Pandas, NumPy)",
    label: "Regular analytical work",
    icon: Code,
  },
  {
    name: "Power BI / Tableau",
    label: "Daily executive reporting",
    icon: PieChart,
  },
  {
    name: "Excel & Advanced Formulas",
    label: "Extensive production use",
    icon: FileSpreadsheet,
  },
  {
    name: "Data Quality & Validation",
    label: "Regular analytical work",
    icon: CheckCircle2,
  },
  {
    name: "Statistical Analysis",
    label: "Regular analytical work",
    icon: BarChart3,
  },
];

const TechStackSection = () => {
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
    <section id="tech-stack" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-1/3 h-96 bg-gradient-to-r from-primary/3 to-transparent blur-3xl" />

      <div className="section-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
              Tools & Technologies
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Technical Proficiency
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Core tools and technologies used in production environments for data analysis,
              visualization, and decision support.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {techStack.map((skill) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-card-hover hover:border-primary/30"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                    <skill.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{skill.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
