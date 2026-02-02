import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../../components/admin/ProjectForm';
import CertificateForm from '../../components/admin/CertificateForm';
import GeneralContentForm from '../../components/admin/GeneralContentForm';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiLayout, FiAward, FiSettings, FiGrid } from 'react-icons/fi';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const tabs = [
        { id: 'projects', label: 'Projects', icon: FiLayout },
        { id: 'certificates', label: 'Certificates', icon: FiAward },
        { id: 'general', label: 'General Content', icon: FiSettings },
        // { id: 'skills', label: 'Skills', icon: FiGrid }, // Coming soon
    ];

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-accent selection:text-white">
            {/* Top Navigation Bar */}
            <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-display font-bold">
                            Admin<span className="text-accent">.Console</span>
                        </span>
                        <div className="hidden md:flex items-center gap-1 pl-8 border-l border-white/10">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-accent/10 text-accent ring-1 ring-accent/50'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <tab.icon />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg"
                    >
                        <FiLogOut />
                        <span className="hidden md:inline">Disconnect</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Tab Navigation */}
            <div className="md:hidden p-4 overflow-x-auto flex gap-2 border-b border-white/5 bg-black/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                            ? 'bg-accent/10 text-accent ring-1 ring-accent/50'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <main className="container mx-auto px-6 py-12 relative">
                {/* Background Ambience */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'projects' && <ProjectForm />}
                        {activeTab === 'certificates' && <CertificateForm />}
                        {activeTab === 'general' && <GeneralContentForm />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Dashboard;
