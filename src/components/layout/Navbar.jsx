import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { FiSettings } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { useAdmin } from '../../context/AdminContext'
import LanguageSwitch from './LanguageSwitch'
import ThemeToggle from '../ui/ThemeToggle'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const { isAdmin, editMode, setEditMode } = useAdmin()
  const navigate = useNavigate()

  // Secret keyboard shortcut: Ctrl + Shift + A to access admin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        navigate('/ysr-x7k9')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'skills', href: '#skills' },
    { key: 'projects', href: '#projects' },
    { key: 'experience', href: '#experience' },
    { key: 'contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? isDark
            ? 'bg-dark/80 backdrop-blur-lg border-b border-white/5'
            : 'bg-white/80 backdrop-blur-lg border-b border-dark/5 shadow-sm'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-dark'}`}
            whileHover={{ opacity: 0.8 }}
          >
            Yasser<span className="text-accent">.Dev</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.key}
                href={item.href}
                className={`transition-colors duration-300 text-sm font-medium link-hover ${
                  isDark
                    ? 'text-text-muted-light hover:text-white'
                    : 'text-text-muted hover:text-dark'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {t(`nav.${item.key}`)}
              </motion.a>
            ))}
            <ThemeToggle />
            <LanguageSwitch />

            {/* Admin Button - Only visible when logged in */}
            {isAdmin && (
              <motion.button
                onClick={() => setEditMode(!editMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  editMode
                    ? 'bg-accent text-white'
                    : isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-dark/10 text-dark hover:bg-dark/20'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FiSettings className={`w-4 h-4 ${editMode ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                <span>{editMode ? 'Editing' : 'Admin'}</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitch />
            {isAdmin && (
              <button
                onClick={() => setEditMode(!editMode)}
                className={`p-2 rounded-lg transition-all ${
                  editMode
                    ? 'bg-accent text-white'
                    : isDark
                      ? 'text-white/50 hover:text-white'
                      : 'text-dark/50 hover:text-dark'
                }`}
              >
                <FiSettings className={`w-5 h-5 ${editMode ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`text-2xl ${isDark ? 'text-white' : 'text-dark'}`}
            >
              {isMobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={`md:hidden backdrop-blur-lg border-t ${
              isDark
                ? 'bg-dark-100/98 border-white/5'
                : 'bg-white/98 border-dark/5'
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  className={`transition-colors duration-300 py-3 text-lg ${
                    isDark
                      ? 'text-text-muted-light hover:text-white'
                      : 'text-text-muted hover:text-dark'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(`nav.${item.key}`)}
                </motion.a>
              ))}

              {/* Admin Link removed - use Ctrl+Shift+A to access */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
