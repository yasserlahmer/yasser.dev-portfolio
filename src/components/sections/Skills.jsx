import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { skills } from '../../data/skills'

function SkillBar({ skill, index, isDark }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      className="mb-5"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <skill.icon className="text-lg" style={{ color: skill.color }} />
        <span className={`font-medium ${isDark ? 'text-white' : 'text-dark'}`}>{skill.name}</span>
        <span className={`ml-auto text-sm font-mono ${isDark ? 'text-accent' : 'text-accent-dark'}`}>{skill.level}%</span>
      </div>
      <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-dark/10'}`}>
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
          style={{
            backgroundColor: 'var(--accent)',
            boxShadow: '0 0 15px var(--accent)'
          }}
        />
      </div>
    </motion.div>
  )
}

function SkillCategory({ title, skillList, isDark }) {
  return (
    <motion.div
      className={`p-6 rounded-2xl ${isDark ? 'card-minimal' : 'card-minimal-light border border-dark/5'}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3 className={`text-lg font-display font-semibold mb-6 ${isDark ? 'text-white' : 'text-dark'}`}>
        {title}
      </h3>
      <div>
        {skillList.map((skill, index) => (
          <SkillBar key={skill.name} skill={skill} index={index} isDark={isDark} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const { t } = useLanguage()
  const { isDark } = useTheme()

  const categories = [
    { key: 'languages', skills: skills.languages },
    { key: 'frameworks', skills: skills.frameworks },
    { key: 'tools', skills: skills.tools },
    { key: 'hardware', skills: skills.hardware },
  ]

  return (
    <section id="skills" className={`py-24 ${isDark ? 'section-dark' : 'section-light'}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>
            {t('skills.title')}
          </h2>
          <p className={`text-lg mb-4 ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
            {t('skills.subtitle')}
          </p>
          <div className="divider mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <SkillCategory
              key={category.key}
              title={t(`skills.categories.${category.key}`)}
              skillList={category.skills}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
