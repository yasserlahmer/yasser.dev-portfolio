import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'

export default function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage()
  const { isDark } = useTheme()

  return (
    <motion.button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-300 ${
        isDark
          ? 'bg-white/5 hover:bg-white/10'
          : 'bg-dark/5 hover:bg-dark/10'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <span
        className={`text-sm font-medium transition-colors duration-300 ${
          language === 'fr'
            ? isDark ? 'text-white' : 'text-dark'
            : 'text-text-muted'
        }`}
      >
        FR
      </span>
      <div className={`w-px h-3 ${isDark ? 'bg-white/20' : 'bg-dark/20'}`} />
      <span
        className={`text-sm font-medium transition-colors duration-300 ${
          language === 'en'
            ? isDark ? 'text-white' : 'text-dark'
            : 'text-text-muted'
        }`}
      >
        EN
      </span>
    </motion.button>
  )
}
