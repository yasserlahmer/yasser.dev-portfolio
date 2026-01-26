import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaEnvelope, FaGithub, FaLinkedin, FaInstagram, FaPhone, FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import Button from '../ui/Button'

export default function Contact() {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    // Simulate form submission
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus(null), 3000)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      label: t('contact.location'),
      value: 'Moncton, NB',
    },
    {
      icon: FaPhone,
      label: t('contact.phone'),
      value: '+1 506 377 0268',
      href: 'tel:+15063770268',
    },
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      value: '+1 506 377 0268',
      href: 'https://wa.me/15063770268',
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'yasser99lahmer@gmail.com',
      href: 'mailto:yasser99lahmer@gmail.com',
    },
  ]

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/yasserlahmer', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/yassir-lahmer-43149b191/', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://www.instagram.com/yasseeeer_01', label: 'Instagram' },
  ]

  return (
    <section id="contact" className={`py-24 ${isDark ? 'section-dark' : 'section-light'}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>
            {t('contact.title')}
          </h2>
          <p className={`text-lg mb-4 ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
            {t('contact.subtitle')}
          </p>
          <div className="divider mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className={`text-2xl font-display font-semibold mb-8 ${isDark ? 'text-white' : 'text-dark'}`}>
              {t('contact.subtitle')}
            </h3>

            {/* Contact details */}
            <div className="space-y-6 mb-8">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <info.icon className="text-accent text-lg" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className={`font-medium transition-colors ${isDark ? 'text-white hover:text-accent' : 'text-dark hover:text-accent'}`}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-dark'}`}>{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 rounded-xl transition-all duration-300 ${isDark ? 'bg-white/5 text-white hover:bg-accent' : 'bg-dark/5 text-dark hover:bg-accent hover:text-white'
                    }`}
                  whileHover={{ y: -4 }}
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className={`p-8 rounded-2xl ${isDark ? 'card-minimal' : 'card-minimal-light border border-dark/5'}`}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-5">
              {/* Name field */}
              <div>
                <label className={`block text-sm mb-2 font-medium ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg px-4 py-3 transition-all duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${isDark
                    ? 'bg-dark-100 border-white/10 text-white'
                    : 'bg-light-100 border-dark/10 text-dark'
                    }`}
                />
              </div>

              {/* Email field */}
              <div>
                <label className={`block text-sm mb-2 font-medium ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg px-4 py-3 transition-all duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${isDark
                    ? 'bg-dark-100 border-white/10 text-white'
                    : 'bg-light-100 border-dark/10 text-dark'
                    }`}
                />
              </div>

              {/* Message field */}
              <div>
                <label className={`block text-sm mb-2 font-medium ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
                  {t('contact.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`w-full border rounded-lg px-4 py-3 transition-all duration-300 resize-none focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${isDark
                    ? 'bg-dark-100 border-white/10 text-white'
                    : 'bg-light-100 border-dark/10 text-dark'
                    }`}
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? t('contact.sending') : t('contact.send')}
              </Button>

              {/* Status messages */}
              {status === 'success' && (
                <motion.p
                  className="text-green-500 text-center font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {t('contact.success')}
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  className="text-red-500 text-center font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {t('contact.error')}
                </motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
