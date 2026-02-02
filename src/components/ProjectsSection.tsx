import { motion, Variants } from "framer-motion";
import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";
import { BarChart3, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ProjectsSection = () => {
  const telecomProjects = projects.filter((p) => p.industry === "telecommunications");
  const financeProjects = projects.filter((p) => p.industry === "financial-services");
  const cxProjects = projects.filter((p) => p.industry === "customer-experience");

  const industryGroups = [
    {
      title: "Telecommunications",
      projects: telecomProjects,
      icon: BarChart3,
      iconBg: "bg-primary/8",
      iconColor: "text-primary",
    },
    {
      title: "Financial Services",
      projects: financeProjects,
      icon: Shield,
      iconBg: "bg-status-warning/10",
      iconColor: "text-status-warning",
    },
    {
      title: "Customer Experience",
      projects: cxProjects,
      icon: Users,
      iconBg: "bg-status-healthy/10",
      iconColor: "text-status-healthy",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-1/3 h-96 bg-gradient-to-l from-primary/3 to-transparent blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-1/4 h-64 bg-gradient-to-r from-primary/2 to-transparent blur-3xl" />

      <div className="section-container relative z-10">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.p 
            variants={itemVariants}
            className="text-sm font-medium text-primary uppercase tracking-widest mb-4"
          >
            Portfolio
          </motion.p>
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-foreground mb-6"
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Enterprise analytics projects demonstrating real-world decision intelligence 
            across telecommunications, financial services, and customer experience.
          </motion.p>
        </motion.div>

        {/* Industry groups */}
        <div className="space-y-16">
          {industryGroups.map((group) => (
            <motion.div 
              key={group.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
            >
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-3 mb-6"
              >
                <motion.div 
                  className={cn("p-2.5 rounded-lg", group.iconBg)}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <group.icon className={cn("h-5 w-5", group.iconColor)} />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground">{group.title}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-4" />
              </motion.div>
              
              <motion.div 
                variants={cardContainerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {group.projects.map((project) => (
                  <motion.div key={project.id} variants={cardVariants}>
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
