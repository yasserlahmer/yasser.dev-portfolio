import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { imageToDataUrl } from '../../utils/imageToDataUrl';
import { FiUpload, FiX } from 'react-icons/fi';
import AdminCard from '../ui/AdminCard';
import AdminInput from '../ui/AdminInput';

const ProjectForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        tags: '',
        link: '',
        github: '',
        featured: false,
        isHosted: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setStatus({ type: 'error', message: 'Image must be less than 5MB' });
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, image: '' }));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.image;

        setUploading(true);
        try {
            const downloadURL = await imageToDataUrl(imageFile);
            setUploading(false);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploading(false);
            throw error;
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const imageUrl = await uploadImage();

            await addDoc(collection(db, "projects"), {
                ...formData,
                image: imageUrl,
                tags: formData.tags.split(',').map(tag => tag.trim()),
                createdAt: new Date()
            });
            setStatus({ type: 'success', message: 'Project added successfully!' });
            setFormData({
                title: '',
                description: '',
                image: '',
                tags: '',
                link: '',
                github: '',
                featured: false,
                isHosted: true
            });
            setImageFile(null);
            setImagePreview(null);
        } catch (error) {
            console.error("Error adding project:", error);
            setStatus({ type: 'error', message: 'Error adding project. See console.' });
        }
        setLoading(false);
    };

    return (
        <AdminCard title="Add New Project">
            {status.message && (
                <div className={`p-4 rounded-lg mb-6 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <AdminInput
                    label="Project Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Portfolio V2"
                    required
                />

                <AdminInput
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief overview..."
                    textarea
                    required
                />

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                        Project Image
                    </label>
                    {imagePreview ? (
                        <div className="relative rounded-lg overflow-hidden border border-white/10">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                            >
                                <FiX />
                            </button>
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white">Uploading...</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-accent/50 transition-colors bg-black/20">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FiUpload className="w-10 h-10 mb-3 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-400">
                                    <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                            </div>
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
                    label="Tags (comma separated)"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="React, Firebase, Tailwind"
                    required
                />

                <div className="grid md:grid-cols-2 gap-4">
                    <AdminInput
                        label="Live URL"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                    <AdminInput
                        label="GitHub URL"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="https://github.com/..."
                    />
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-600 bg-black/20 text-accent focus:ring-accent"
                        />
                        <label htmlFor="featured" className="text-gray-300">Featured Project</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isHosted"
                            name="isHosted"
                            checked={formData.isHosted}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-600 bg-black/20 text-accent focus:ring-accent"
                        />
                        <label htmlFor="isHosted" className="text-gray-300">Completed (uncheck for "In Progress")</label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Add Project'}
                </button>
            </form>
        </AdminCard>
    );
};

export default ProjectForm;
