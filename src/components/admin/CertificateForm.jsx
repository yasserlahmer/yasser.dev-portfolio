import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import AdminCard from '../ui/AdminCard';
import AdminInput from '../ui/AdminInput';

const CertificateForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        issuer: '',
        date: '',
        link: '',
        skills: '' // We will save this as an array
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await addDoc(collection(db, "certificates"), {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()),
                createdAt: new Date()
            });
            setStatus({ type: 'success', message: 'Certificate added successfully!' });
            setFormData({
                name: '',
                issuer: '',
                date: '',
                link: '',
                skills: ''
            });
        } catch (error) {
            console.error("Error adding certificate:", error);
            setStatus({ type: 'error', message: 'Error adding certificate.' });
        }
        setLoading(false);
    };

    return (
        <AdminCard title="Add New Certificate">
            {status.message && (
                <div className={`p-4 rounded-lg mb-6 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <AdminInput
                    label="Certificate Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    required
                />

                <div className="grid md:grid-cols-2 gap-4">
                    <AdminInput
                        label="Issuer Organization"
                        name="issuer"
                        value={formData.issuer}
                        onChange={handleChange}
                        placeholder="Amazon Web Services"
                        required
                    />
                    <AdminInput
                        label="Date Issued"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="Jan 2024"
                        required
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <AdminInput
                        label="Certificate URL"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                    <AdminInput
                        label="Related Skills (comma separated)"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Cloud Computing, Security"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Add Certificate'}
                </button>
            </form>
        </AdminCard>
    );
};

export default CertificateForm;
