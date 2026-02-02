import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Projects from '../components/sections/Projects'
import Experience from '../components/sections/Experience'
import Certificates from '../components/sections/Certificates'
import Contact from '../components/sections/Contact'
import { useTheme } from '../context/ThemeContext'
import { useAdmin } from '../context/AdminContext'
import AdminToolbar from '../components/admin/AdminToolbar'
import ProjectModal from '../components/admin/ProjectModal'
import CertificateModal from '../components/admin/CertificateModal'
import ContentModal from '../components/admin/ContentModal'

function Home() {
    const { isDark } = useTheme()
    const { isAdmin, setEditMode, editMode } = useAdmin()
    const [refreshKey, setRefreshKey] = useState(0)

    const handleDataChange = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-dark' : 'bg-light'}`}>
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main>
                <Hero />
                <About />
                <Skills />
                <Projects key={`projects-${refreshKey}`} />
                <Experience />
                <Certificates key={`certificates-${refreshKey}`} />
                <Contact />
            </main>

            {/* Footer */}
            <Footer />

            {/* Admin Components */}
            {isAdmin && (
                <>
                    <AdminToolbar editMode={editMode} setEditMode={setEditMode} />
                    <ProjectModal onSuccess={handleDataChange} />
                    <CertificateModal onSuccess={handleDataChange} />
                    <ContentModal onSuccess={handleDataChange} />
                </>
            )}
        </div>
    )
}

export default Home
