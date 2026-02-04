import { motion, Variants } from "framer-motion";

interface TechSkill {
  name: string;
  level: number; // 1-5 scale
  label: string;
}

const techStack: TechSkill[] = [
  { name: "SQL & Database Querying", level: 5, label: "Extensive production use" },
  { name: "Python (Pandas, NumPy)", level: 4, label: "Regular analytical work" },
  { name: "Power BI / Tableau", level: 5, label: "Daily executive reporting" },
  { name: "Excel & Advanced Formulas", level: 5, label: "Extensive production use" },
  { name: "Data Quality & Validation", level: 4, label: "Regular analytical work" },
  { name: "Statistical Analysis", level: 4, label: "Regular analytical work" },
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

  const barVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: (level: number) => ({
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
      },
    }),
  };

  return (
    <section id="tech-stack" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-1/3 h-96 bg-gradient-to-r from-primary/3 to-transparent blur-3xl" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-3xl mx-auto"
        >
          {/* Section header */}
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

          {/* Tech stack bars */}
          <motion.div variants={containerVariants} className="space-y-6">
            {techStack.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                className="group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {skill.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {skill.label}
                  </span>
                </div>
                <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full origin-left"
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Note */}
          <motion.p 
            variants={itemVariants}
            className="text-sm text-muted-foreground text-center mt-10"
          >
            Proficiency reflects practical usage depth in real-world projects, not rankings.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
