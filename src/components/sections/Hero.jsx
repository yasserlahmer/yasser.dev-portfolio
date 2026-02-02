import { motion } from 'framer-motion'
import { FaArrowDown } from 'react-icons/fa'
import { FiSettings } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { useAdmin } from '../../context/AdminContext'
import { useContent } from '../../hooks/useContent'
import Button from '../ui/Button'

export default function Hero() {
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const { editMode, openModal } = useAdmin()
  const { content } = useContent()

  // Use Firebase content if available, otherwise fallback to translations
  const heroContent = {
    name: content?.hero?.name || t('hero.name'),
    greeting: content?.hero?.[`greeting_${language}`] || t('hero.greeting'),
    title: content?.hero?.[`title_${language}`] || t('hero.title'),
    quote: content?.hero?.[`quote_${language}`] || t('hero.quote')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section
      id="home"
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-[#0b0b0b]' : 'section-light'}`}
    >
      {/* Glint-inspired Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]" />

        {/* Animated Lines/Mesh */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M-100 100 Q 250 50 600 200 T 1200 100"
            fill="none"
            stroke={isDark ? "white" : "black"}
            strokeWidth="0.5"
            animate={{
              d: [
                "M-100 100 Q 250 50 600 200 T 1200 100",
                "M-100 150 Q 250 100 600 250 T 1200 150",
                "M-100 100 Q 250 50 600 200 T 1200 100"
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M-100 300 Q 350 250 700 400 T 1300 300"
            fill="none"
            stroke={isDark ? "white" : "black"}
            strokeWidth="0.5"
            animate={{
              d: [
                "M-100 300 Q 350 250 700 400 T 1300 300",
                "M-100 250 Q 350 200 700 350 T 1300 250",
                "M-100 300 Q 350 250 700 400 T 1300 300"
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Floating Blobs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10 py-20">
        {/* Edit Content Button */}
        {editMode && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => openModal('content')}
            className="absolute top-24 right-6 z-30 flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg shadow-lg transition-all hover:scale-105"
          >
            <FiSettings className="w-4 h-4" />
            <span className="font-medium">Edit Content</span>
          </motion.button>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Greeting */}
          <motion.p
            variants={itemVariants}
            className="text-accent font-display font-medium tracking-[0.3em] uppercase text-sm mb-6"
          >
            {heroContent.greeting}
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className={`text-6xl md:text-8xl lg:text-9xl font-display font-black mb-8 tracking-tighter ${isDark ? 'text-white' : 'text-dark'}`}
          >
            {heroContent.name}<span className="text-accent">.</span>
          </motion.h1>

          {/* Quote - GIANT STYLE */}
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mb-12 relative"
          >
            <h2 className={`text-3xl md:text-5xl lg:text-6xl font-display font-black leading-tight uppercase ${isDark ? 'text-white' : 'text-dark'}`}>
              {heroContent.quote}
            </h2>
            <div className="w-24 h-1.5 bg-accent mx-auto mt-8 rounded-full" />
          </motion.div>

          {/* Title Area */}
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            <p className={`text-lg md:text-xl font-medium tracking-wide uppercase ${isDark ? 'text-white/60' : 'text-dark/60'}`}>
              {heroContent.title}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button href="#projects" variant="primary" size="xl" className="min-w-[240px]">
              {t('hero.cta')}
            </Button>
            <Button href="#contact" variant="outline" size="xl" dark={isDark} className="min-w-[240px]">
              {t('hero.contact')}
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <a
            href="#about"
            className={`transition-colors duration-300 ${isDark ? 'text-white/20 hover:text-white' : 'text-dark/20 hover:text-dark'}`}
          >
            <FaArrowDown size={24} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
