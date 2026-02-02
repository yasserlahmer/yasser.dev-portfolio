import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload } from 'react-icons/fi';
import { db, storage } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAdmin } from '../../context/AdminContext';
import AdminInput from '../ui/AdminInput';

const ContentModal = ({ onSuccess }) => {
    const { modalType, closeModal } = useAdmin();
    const isOpen = modalType === 'content';

    const [activeTab, setActiveTab] = useState('hero');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        hero: {
            name: '',
            greeting_en: '',
            greeting_fr: '',
            title_en: '',
            title_fr: '',
            quote_en: '',
            quote_fr: ''
        },
        about: {
            description_en: '',
            description_fr: '',
            profileImage: '',
            stats: {
                projects: '10+',
                experience: '3+',
                technologies: '10+',
                coffee: '∞'
            }
        },
        contact: {
            email: '',
            phone: '',
            location: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            fetchContent();
        }
    }, [isOpen]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "content", "general");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData(prev => ({
                    hero: { ...prev.hero, ...data.hero },
                    about: { ...prev.about, ...data.about },
                    contact: { ...prev.contact, ...data.contact }
                }));
                if (data.about?.profileImage) {
                    setImagePreview(data.about.profileImage);
                }
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        }
        setLoading(false);
    };

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleStatChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            about: {
                ...prev.about,
                stats: {
                    ...prev.about.stats,
                    [field]: value
                }
            }
        }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.about.profileImage;

        const fileName = `profile/${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, imageFile);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let profileImageUrl = formData.about.profileImage;
            if (imageFile) {
                profileImageUrl = await uploadImage();
            }

            const dataToSave = {
                ...formData,
                about: {
                    ...formData.about,
                    profileImage: profileImageUrl
                },
                updatedAt: new Date()
            };

            await setDoc(doc(db, "content", "general"), dataToSave);
            onSuccess?.();
            closeModal();
        } catch (error) {
            console.error("Error saving content:", error);
            alert('Error saving content');
        }
        setSaving(false);
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'hero', label: 'Hero' },
        { id: 'about', label: 'About' },
        { id: 'contact', label: 'Contact' }
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-stretch justify-start bg-black/60 backdrop-blur-sm"
                onClick={closeModal}
            >
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="w-full max-w-lg h-full overflow-hidden bg-[#1a1a1a] border-r border-white/10 shadow-2xl flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <h2 className="text-xl font-display font-bold text-white">
                            Edit Site Content
                        </h2>
                        <button
                            onClick={closeModal}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <FiX className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-accent border-b-2 border-accent bg-accent/5'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="text-center text-gray-400 py-12">Loading...</div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Hero Tab */}
                                {activeTab === 'hero' && (
                                    <div className="space-y-4">
                                        <AdminInput
                                            label="Name"
                                            value={formData.hero.name}
                                            onChange={(e) => handleChange('hero', 'name', e.target.value)}
                                            placeholder="Yasser"
                                        />

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <AdminInput
                                                label="Greeting (English)"
                                                value={formData.hero.greeting_en}
                                                onChange={(e) => handleChange('hero', 'greeting_en', e.target.value)}
                                                placeholder="Hello World"
                                            />
                                            <AdminInput
                                                label="Greeting (French)"
                                                value={formData.hero.greeting_fr}
                                                onChange={(e) => handleChange('hero', 'greeting_fr', e.target.value)}
                                                placeholder="Bonjour le Monde"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <AdminInput
                                                label="Title (English)"
                                                value={formData.hero.title_en}
                                                onChange={(e) => handleChange('hero', 'title_en', e.target.value)}
                                                placeholder="Full Stack Developer"
                                            />
                                            <AdminInput
                                                label="Title (French)"
                                                value={formData.hero.title_fr}
                                                onChange={(e) => handleChange('hero', 'title_fr', e.target.value)}
                                                placeholder="Développeur Full Stack"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <AdminInput
                                                label="Quote (English)"
                                                value={formData.hero.quote_en}
                                                onChange={(e) => handleChange('hero', 'quote_en', e.target.value)}
                                                placeholder="Building the future"
                                                textarea
                                            />
                                            <AdminInput
                                                label="Quote (French)"
                                                value={formData.hero.quote_fr}
                                                onChange={(e) => handleChange('hero', 'quote_fr', e.target.value)}
                                                placeholder="Construire le futur"
                                                textarea
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* About Tab */}
                                {activeTab === 'about' && (
                                    <div className="space-y-4">
                                        {/* Profile Image */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                                                Profile Image
                                            </label>
                                            {imagePreview ? (
                                                <div className="relative w-40 h-52 rounded-lg overflow-hidden border border-white/10">
                                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                        className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full"
                                                    >
                                                        <FiX className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-40 h-52 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-accent/50 transition-colors bg-black/20">
                                                    <FiUpload className="w-6 h-6 mb-2 text-gray-500" />
                                                    <span className="text-xs text-gray-400">Upload</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageSelect}
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        <AdminInput
                                            label="Description (English)"
                                            value={formData.about.description_en}
                                            onChange={(e) => handleChange('about', 'description_en', e.target.value)}
                                            placeholder="About me..."
                                            textarea
                                        />

                                        <AdminInput
                                            label="Description (French)"
                                            value={formData.about.description_fr}
                                            onChange={(e) => handleChange('about', 'description_fr', e.target.value)}
                                            placeholder="À propos de moi..."
                                            textarea
                                        />

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <AdminInput
                                                label="Projects"
                                                value={formData.about.stats?.projects || ''}
                                                onChange={(e) => handleStatChange('projects', e.target.value)}
                                                placeholder="10+"
                                            />
                                            <AdminInput
                                                label="Experience"
                                                value={formData.about.stats?.experience || ''}
                                                onChange={(e) => handleStatChange('experience', e.target.value)}
                                                placeholder="3+"
                                            />
                                            <AdminInput
                                                label="Technologies"
                                                value={formData.about.stats?.technologies || ''}
                                                onChange={(e) => handleStatChange('technologies', e.target.value)}
                                                placeholder="10+"
                                            />
                                            <AdminInput
                                                label="Coffee"
                                                value={formData.about.stats?.coffee || ''}
                                                onChange={(e) => handleStatChange('coffee', e.target.value)}
                                                placeholder="∞"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Contact Tab */}
                                {activeTab === 'contact' && (
                                    <div className="space-y-4">
                                        <AdminInput
                                            label="Email"
                                            type="email"
                                            value={formData.contact.email}
                                            onChange={(e) => handleChange('contact', 'email', e.target.value)}
                                            placeholder="contact@example.com"
                                        />
                                        <AdminInput
                                            label="Phone"
                                            value={formData.contact.phone}
                                            onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                                            placeholder="+1 234 567 890"
                                        />
                                        <AdminInput
                                            label="Location"
                                            value={formData.contact.location}
                                            onChange={(e) => handleChange('contact', 'location', e.target.value)}
                                            placeholder="City, Country"
                                        />
                                    </div>
                                )}
                            </form>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10">
                        <button
                            onClick={handleSubmit}
                            disabled={saving || loading}
                            className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ContentModal;
