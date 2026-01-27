import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { certificates } from '../../data/certificates'
import { FiExternalLink, FiAward } from 'react-icons/fi'

function CertificateCard({ cert, isDark, t }) {
    return (
        <motion.div
            className={`p-6 rounded-2xl ${isDark ? 'card-minimal' : 'card-minimal-light border border-dark/5'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div className="relative aspect-video mb-6 overflow-hidden rounded-xl bg-accent/5">
                <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-accent p-2 rounded-lg shadow-lg">
                    <FiAward className="text-white text-xl" />
                </div>
            </div>

            <div className="flex flex-col h-full">
                <h3 className={`text-xl font-display font-semibold mb-2 ${isDark ? 'text-white' : 'text-dark'}`}>
                    {cert.name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                    <span className={`text-sm ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
                        {t('certificates.issuedBy')} <span className="text-accent font-medium">{cert.issuer}</span>
                    </span>
                    <span className={`text-xs ${isDark ? 'text-white/30' : 'text-dark/30'}`}>•</span>
                    <span className={`text-sm ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
                        {cert.date}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                    {cert.skills.map(skill => (
                        <span
                            key={skill}
                            className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-white/5 text-white/70' : 'bg-dark/5 text-dark/70'
                                } border border-transparent hover:border-accent/30 transition-colors`}
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {cert.link && cert.link !== '#' && (
                    <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-medium transition-all group shadow-lg shadow-accent/20"
                    >
                        {t('certificates.viewCert')}
                        <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                )}
            </div>
        </motion.div>
    )
}

export default function Certificates() {
    const { t } = useLanguage()
    const { isDark } = useTheme()

    return (
        <section id="certificates" className={`py-24 ${isDark ? 'section-dark' : 'section-light'}`}>
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>
                        {t('certificates.title')}
                    </h2>
                    <p className={`text-lg mb-4 ${isDark ? 'text-text-muted-light' : 'text-text-muted'}`}>
                        {t('certificates.subtitle')}
                    </p>
                    <div className="divider mx-auto" />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <CertificateCard
                            key={cert.id}
                            cert={cert}
                            isDark={isDark}
                            t={t}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
