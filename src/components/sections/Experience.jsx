import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaBriefcase } from 'react-icons/fa'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { experiences } from '../../data/experience'

function ExperienceCard({ experience, index, isDark }) {
  const { language } = useLanguage()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 md:pl-12 pb-12 last:pb-0"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/20" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-2 w-2 h-2 -translate-x-1/2 bg-accent rounded-full" />

      <div className={`p-6 ${isDark ? 'card-minimal' : 'card-minimal-light border border-dark/5'}`}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-accent/10 rounded-lg">
            <FaBriefcase className="text-accent" />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-display font-semibold ${isDark ? 'text-white' : 'text-dark'}`}>
              {experience.title[language]}
            </h3>
            <p className="text-accent font-medium">
              {experience.company}
            </p>
            <p className="text-text-muted text-sm">
              {experience.location} • {experience.period[language]}
            </p>
          </div>
        </div>

        {/* Description */}
        <ul className="space-y-2 mb-4">
          {experience.description[language].map((item, i) => (
            <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
              <span className="text-accent mt-1">-</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className={`px-2 py-1 text-xs rounded-md ${isDark ? 'bg-white/5 text-text-muted-light' : 'bg-dark/5 text-text-muted'}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const { t } = useLanguage()
  const { isDark } = useTheme()

  return (
    <section id="experience" className={`py-24 ${isDark ? 'section-dark' : 'section-light'}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>
            {t('experience.title')}
          </h2>
          <p className={`text-lg mb-4 ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
            {t('experience.subtitle')}
          </p>
          <div className="divider mx-auto" />
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              index={index}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Note if no experiences */}
        {experiences.length === 0 && (
          <p className={`text-center ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
            Ajoutez vos expériences dans src/data/experience.js
          </p>
        )}
      </div>
    </section>
  )
}
