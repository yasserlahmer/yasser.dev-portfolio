import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { useAdmin } from '../../context/AdminContext'
import { projects as staticProjects } from '../../data/projects'
import { db } from '../../config/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

function ProjectCard({ project, isDark, onEdit }) {
  const { language, t } = useLanguage()
  const { editMode } = useAdmin()
  const [imgError, setImgError] = useState(false)

  // Use custom image, or Microlink for preview if liveUrl exists
  const hasCustomImage = project.image && !project.image.includes('placeholder') && project.image.trim() !== '';
  const hasLiveUrl = project.liveUrl && project.liveUrl.trim() !== '';

  const previewUrl = hasCustomImage
    ? project.image
    : hasLiveUrl
      ? `https://api.microlink.io?url=${encodeURIComponent(project.liveUrl)}&screenshot=true&embed=screenshot.url`
      : null;

  return (
    <motion.div
      className={`overflow-hidden group relative rounded-2xl ${isDark ? 'card-minimal' : 'card-minimal-light border border-dark/5'}`}
      whileHover={{ y: -12, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Edit Button */}
      {editMode && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={(e) => { e.stopPropagation(); onEdit(project); }}
          className="absolute top-4 left-4 z-30 p-2 bg-accent hover:bg-accent-dark text-white rounded-full shadow-lg transition-all hover:scale-110"
        >
          <FiEdit2 className="w-4 h-4" />
        </motion.button>
      )}

      {/* Status Badge */}
      <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${project.isHosted
        ? 'bg-green-500/90 text-white'
        : 'bg-amber-500/90 text-white'
        }`}>
        {project.isHosted ? t('projects.status.completed') : t('projects.status.working')}
      </div>

      {/* Image / Preview */}
      <div className={`relative h-48 overflow-hidden ${isDark ? 'bg-white/10' : 'bg-dark/10'}`}>
        {previewUrl && !imgError ? (
          <img
            src={previewUrl}
            alt={project.title[language] || project.title.en}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-purple-500/20">
            <span className="text-4xl font-display font-bold text-white/20">
              {(project.title[language] || project.title.en || '?').charAt(0)}
            </span>
          </div>
        )}
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
          {project.title[language] || project.title.en}
        </h3>
        <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
          {project.description[language] || project.description.en}
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
  const { editMode, openModal } = useAdmin()
  const [filter, setFilter] = useState('all')
  const [projects, setProjects] = useState(staticProjects)

  const handleEditProject = (project) => {
    openModal('project', project)
  }

  const handleAddProject = () => {
    openModal('project', null)
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const firebaseProjects = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Transform Firebase data to match expected format
          return {
            id: doc.id,
            title: typeof data.title === 'string'
              ? { fr: data.title, en: data.title }
              : data.title,
            description: typeof data.description === 'string'
              ? { fr: data.description, en: data.description }
              : data.description,
            image: data.image || '',
            tags: data.tags || [],
            category: data.category || 'web',
            liveUrl: data.link || data.liveUrl || '',
            githubUrl: data.github || data.githubUrl || '#',
            featured: data.featured || false,
            isHosted: data.isHosted !== undefined ? data.isHosted : !data.featured,
          };
        });

        if (firebaseProjects.length > 0) {
          setProjects([...firebaseProjects, ...staticProjects]);
        }
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  const filters = ['all', 'games', 'web', 'hardware']

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className={`py-24 ${isDark ? 'section-dark' : 'section-light'}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>
            {t('projects.title')}
          </h2>
          <p className={`text-lg mb-4 ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>{t('projects.subtitle')}</p>
          <div className="divider mx-auto" />

          {/* Add Project Button */}
          {editMode && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleAddProject}
              className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg shadow-lg transition-all hover:scale-105"
            >
              <span className="text-xl">+</span>
              <span className="font-medium">Add Project</span>
            </motion.button>
          )}
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
                <ProjectCard project={project} isDark={isDark} onEdit={handleEditProject} />
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
