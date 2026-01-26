import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { projects } from '../../data/projects'

function ProjectCard({ project, isDark }) {
  const { language, t } = useLanguage()

  // Use Microlink for more accurate previews, or local image if available
  const hasCustomImage = project.image && !project.image.includes('placeholder');
  const previewUrl = hasCustomImage
    ? project.image
    : `https://api.microlink.io?url=${encodeURIComponent(project.liveUrl)}&screenshot=true&embed=screenshot.url`;

  return (
    <motion.div
      className={`overflow-hidden group relative rounded-2xl ${isDark ? 'card-minimal' : 'card-minimal-light border border-dark/5'}`}
      whileHover={{ y: -12, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${project.isHosted
        ? 'bg-green-500/90 text-white'
        : 'bg-amber-500/90 text-white'
        }`}>
        {project.isHosted ? t('projects.status.completed') : t('projects.status.working')}
      </div>

      {/* Image / Preview */}
      <div className={`relative h-48 overflow-hidden ${isDark ? 'bg-white/10' : 'bg-dark/10'}`}>
        <img
          src={previewUrl}
          alt={project.title[language]}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/projects/placeholder.jpg';
          }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-accent text-white rounded-full flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaExternalLinkAlt />
              <span className="text-sm font-medium">Preview</span>
            </motion.a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white text-dark rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub />
            </motion.a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={`text-xl font-display font-semibold mb-2 group-hover:text-accent transition-colors ${isDark ? 'text-white' : 'text-dark'}`}>
          {project.title[language]}
        </h3>
        <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
          {project.description[language]}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const [filter, setFilter] = useState('all')

  const filters = ['all', 'games', 'web', 'hardware']

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className={`py-24 ${isDark ? 'section-dark' : 'section-light'}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>
            {t('projects.title')}
          </h2>
          <p className={`text-lg mb-4 ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>{t('projects.subtitle')}</p>
          <div className="divider mx-auto" />
        </motion.div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === f
                ? 'bg-accent text-white'
                : isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-dark/5 text-dark hover:bg-dark/10'
                }`}
              whileTap={{ scale: 0.95 }}
            >
              {t(`projects.${f}`)}
            </motion.button>
          ))}
        </div>

        {/* Projects grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} isDark={isDark} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.p
            className={`text-center text-lg ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Aucun projet dans cette catégorie pour le moment.
          </motion.p>
        )}
      </div>
    </section>
  )
}
