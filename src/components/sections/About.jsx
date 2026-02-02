import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaGamepad, FaCode, FaClock, FaCoffee } from 'react-icons/fa'
import { FiSettings } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { useAdmin } from '../../context/AdminContext'
import { useContent } from '../../hooks/useContent'

export default function About() {
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const { editMode, openModal } = useAdmin()
  const { content } = useContent()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Use Firebase content if available
  const aboutContent = {
    description: content?.about?.[`description_${language}`] || t('about.description'),
    profileImage: content?.about?.profileImage || '/images/profile/yasser.jpg',
    stats: content?.about?.stats || {}
  }

  const stats = [
    { icon: FaGamepad, value: aboutContent.stats.projects || '10+', label: t('about.stats.projects') },
    { icon: FaClock, value: aboutContent.stats.experience || '3+', label: t('about.stats.experience') },
    { icon: FaCode, value: aboutContent.stats.technologies || '10+', label: t('about.stats.technologies') },
    { icon: FaCoffee, value: aboutContent.stats.coffee || '∞', label: t('about.stats.coffee') },
  ]

  return (
    <section id="about" className={`py-24 relative ${isDark ? 'section-primary' : 'section-light'}`}>
      <div className="container mx-auto px-6">
        {/* Edit Content Button */}
        {editMode && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => openModal('content')}
            className="absolute top-8 right-6 z-30 flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg shadow-lg transition-all hover:scale-105"
          >
            <FiSettings className="w-4 h-4" />
            <span className="font-medium">Edit About</span>
          </motion.button>
        )}

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>
            {t('about.title')}
          </h2>
          <div className="divider mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center" ref={ref}>
          {/* Image Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className={`relative rounded-2xl overflow-hidden aspect-[3/4] flex items-center justify-center shadow-xl ${isDark ? 'bg-dark-100' : 'bg-light-200'}`}>
                <img
                  src={aboutContent.profileImage}
                  alt="Yasser"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out hover:scale-105"
                />
                {/* Visual overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent pointer-events-none" />
              </div>
              {/* Decorative background element */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-accent/40 rounded-tl-2xl -z-10" />
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent/20 rounded-2xl -z-10" />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-text-muted text-lg leading-relaxed mb-10">
              {aboutContent.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`p-6 text-center rounded-2xl glass premium-hover ${isDark ? '' : 'shadow-sm'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <stat.icon className="text-accent text-3xl mx-auto mb-3" />
                  <div className={`text-3xl font-display font-bold mb-1 ${isDark ? 'text-white' : 'text-dark'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
