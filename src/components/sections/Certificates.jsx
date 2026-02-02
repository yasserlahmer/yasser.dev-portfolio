import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { useAdmin } from '../../context/AdminContext'
import { certificates as staticCertificates } from '../../data/certificates'
import { FiExternalLink, FiAward, FiEdit2 } from 'react-icons/fi'
import { db } from '../../config/firebase'
import { collection, getDocs } from 'firebase/firestore'

function CertificateCard({ cert, isDark, t, onEdit }) {
    const { editMode } = useAdmin()

    return (
        <motion.div
            className={`p-6 rounded-2xl overflow-hidden relative ${isDark ? 'card-minimal' : 'card-minimal-light border border-dark/5'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            {/* Edit Button */}
            {editMode && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => onEdit(cert)}
                    className="absolute top-2 left-2 z-30 p-2 bg-accent hover:bg-accent-dark text-white rounded-full shadow-lg transition-all hover:scale-110"
                >
                    <FiEdit2 className="w-4 h-4" />
                </motion.button>
            )}

            <div className="relative aspect-video mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-[#0077B5] to-[#00A0DC] flex items-center justify-center">
                {cert.image ? (
                    <img
                        src={cert.image}
                        alt={cert.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-white p-4">
                        <svg className="w-16 h-16 mb-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8.5 8.5c.83 0 1.5-.67 1.5-1.5S9.33 5.5 8.5 5.5 7 6.17 7 7s.67 1.5 1.5 1.5zM10 16H7v-6h3v6zm7 0h-2.7v-3.2c0-1.6-1.9-1.5-1.9 0V16H10v-6h2.4v1c.8-1.4 4.6-1.5 4.6 2.2V16z" />
                        </svg>
                        <span className="text-sm font-medium opacity-90">LinkedIn Learning</span>
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-accent p-2 rounded-lg shadow-lg">
                    <FiAward className="text-white text-xl" />
                </div>
            </div>

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

            <div className="flex flex-wrap gap-2 mb-4">
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
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-medium transition-all group shadow-lg shadow-accent/20"
                >
                    {t('certificates.viewCert')}
                    <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
            )}
        </motion.div>
    )
}

export default function Certificates() {
    const { t } = useLanguage()
    const { isDark } = useTheme()
    const { editMode, openModal } = useAdmin()
    const [certificates, setCertificates] = useState(staticCertificates)

    const handleEditCertificate = (cert) => {
        openModal('certificate', cert)
    }

    const handleAddCertificate = () => {
        openModal('certificate', null)
    }

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "certificates"));
                const firebaseCerts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                if (firebaseCerts.length > 0) {
                    setCertificates([...firebaseCerts, ...staticCertificates]);
                }
            } catch (error) {
                console.error("Error fetching certificates:", error);
            }
        };
        fetchCertificates();
    }, []);

    return (
        <section id="certificates" className={`py-24 ${isDark ? 'section-dark' : 'section-light'}`}>
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16 relative"
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

                    {/* Add Certificate Button */}
                    {editMode && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={handleAddCertificate}
                            className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg shadow-lg transition-all hover:scale-105"
                        >
                            <span className="text-xl">+</span>
                            <span className="font-medium">Add Certificate</span>
                        </motion.button>
                    )}
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <CertificateCard
                            key={cert.id}
                            cert={cert}
                            isDark={isDark}
                            t={t}
                            onEdit={handleEditCertificate}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
