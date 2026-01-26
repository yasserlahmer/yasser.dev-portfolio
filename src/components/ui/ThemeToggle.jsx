import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-colors duration-300 ${
        isDark
          ? 'bg-white/10 hover:bg-white/20 text-yellow-400'
          : 'bg-dark/5 hover:bg-dark/10 text-indigo-600'
      }`}
      whileTap={{ scale: 0.9 }}
      whileHover={{ rotate: 15 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <FiMoon size={18} /> : <FiSun size={18} />}
      </motion.div>
    </motion.button>
  )
}
