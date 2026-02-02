import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AdminCard from '../ui/AdminCard';
import AdminInput from '../ui/AdminInput';

const GeneralContentForm = () => {
    const [formData, setFormData] = useState({
        hero: {
            name: '',
            greeting: '',
            title_en: '',
            title_fr: '',
            quote_en: '',
            quote_fr: ''
        },
        about: {
            description_en: '',
            description_fr: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, "content", "general");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    // Initialize with defaults if empty
                    console.log("No content found, using defaults");
                }
            } catch (error) {
                console.error("Error fetching content:", error);
            }
            setLoading(false);
        };
        fetchContent();
    }, []);

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus({ type: '', message: '' });

        try {
            await setDoc(doc(db, "content", "general"), formData);
            setStatus({ type: 'success', message: 'Content updated successfully!' });
        } catch (error) {
            console.error("Error updating content:", error);
            setStatus({ type: 'error', message: 'Error updating content.' });
        }
        setSaving(false);
    };

    if (loading) return <div className="text-white">Loading content...</div>;

    return (
        <AdminCard title="General Site Content">
            {status.message && (
                <div className={`p-4 rounded-lg mb-6 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Section */}
                <div className="space-y-4">
                    <h4 className="text-accent font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Hero Section</h4>

                    <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput
                            label="Name (Brand)"
                            value={formData.hero.name}
                            onChange={(e) => handleChange('hero', 'name', e.target.value)}
                            placeholder="Yasser"
                        />
                        <AdminInput
                            label="Greeting (Top Label)"
                            value={formData.hero.greeting}
                            onChange={(e) => handleChange('hero', 'greeting', e.target.value)}
                            placeholder="Hello World"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput
                            label="Job Title (English)"
                            value={formData.hero.title_en}
                            onChange={(e) => handleChange('hero', 'title_en', e.target.value)}
                            placeholder="Full Stack Developer"
                        />
                        <AdminInput
                            label="Job Title (French)"
                            value={formData.hero.title_fr}
                            onChange={(e) => handleChange('hero', 'title_fr', e.target.value)}
                            placeholder="Développeur Full Stack"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput
                            label="Main Quote (English)"
                            value={formData.hero.quote_en}
                            onChange={(e) => handleChange('hero', 'quote_en', e.target.value)}
                            placeholder="Building the future"
                        />
                        <AdminInput
                            label="Main Quote (French)"
                            value={formData.hero.quote_fr}
                            onChange={(e) => handleChange('hero', 'quote_fr', e.target.value)}
                            placeholder="Bâtir le futur"
                        />
                    </div>
                </div>

                {/* About Section */}
                <div className="space-y-4">
                    <h4 className="text-accent font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">About Section</h4>

                    <AdminInput
                        label="Description (English)"
                        value={formData.about.description_en}
                        onChange={(e) => handleChange('about', 'description_en', e.target.value)}
                        textarea
                        className="min-h-[150px]"
                    />
                    <AdminInput
                        label="Description (French)"
                        value={formData.about.description_fr}
                        onChange={(e) => handleChange('about', 'description_fr', e.target.value)}
                        textarea
                        className="min-h-[150px]"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50"
                    >
                        {saving ? 'Saving Changes...' : 'Save All Changes'}
                    </button>
                </div>
            </form>
        </AdminCard>
    );
};

export default GeneralContentForm;
