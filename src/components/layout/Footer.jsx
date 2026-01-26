import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'

export default function Footer() {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/yasserlahmer', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/yassir-lahmer-43149b191/', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://www.instagram.com/yasseeeer_01', label: 'Instagram' },
    { icon: FaWhatsapp, href: 'https://wa.me/15063770268', label: 'WhatsApp' },
  ]

  return (
    <footer className={`transition-colors duration-300 border-t ${isDark ? 'bg-dark border-white/5' : 'bg-light-100 border-dark/5'}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a href="#home" className={`text-xl font-display font-bold inline-block mb-2 ${isDark ? 'text-white' : 'text-dark'}`}>
              Yasser<span className="text-accent">.Dev</span>
            </a>
            <p className={`text-sm ${isDark ? 'text-text-muted' : 'text-text-muted'}`}>
              &copy; {currentYear} Yasser.Dev {t('footer.rights')}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-300 text-lg ${isDark ? 'text-text-muted hover:text-white' : 'text-text-muted hover:text-accent'}`}
                whileHover={{ y: -3 }}
                aria-label={social.label}
              >
                <social.icon />
              </motion.a>
            ))}
          </div>


        </div>
      </div>
    </footer>
  )
}
