import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload } from 'react-icons/fi';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAdmin } from '../../context/AdminContext';
import AdminInput from '../ui/AdminInput';

const ProjectModal = ({ onSuccess }) => {
    const { modalType, editingItem, closeModal } = useAdmin();
    const isOpen = modalType === 'project';

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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                title: editingItem.title?.fr || editingItem.title || '',
                description: editingItem.description?.fr || editingItem.description || '',
                image: editingItem.image || '',
                tags: Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : '',
                link: editingItem.liveUrl || editingItem.link || '',
                github: editingItem.githubUrl || editingItem.github || '',
                featured: editingItem.featured || false,
                isHosted: editingItem.isHosted !== undefined ? editingItem.isHosted : true
            });
            if (editingItem.image) {
                setImagePreview(editingItem.image);
            }
        } else {
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
            setImagePreview(null);
        }
        setImageFile(null);
    }, [editingItem, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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
        if (!imageFile) return formData.image;

        const fileName = `projects/${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, imageFile);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const imageUrl = await uploadImage();
            const projectData = {
                ...formData,
                image: imageUrl,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                updatedAt: new Date()
            };

            // Check if it's a valid Firebase document ID (string, not number)
            const isFirebaseDoc = editingItem?.id && typeof editingItem.id === 'string';

            if (isFirebaseDoc) {
                await updateDoc(doc(db, "projects", editingItem.id), projectData);
            } else {
                // Create new document (for both new items and static items being "edited")
                projectData.createdAt = new Date();
                await addDoc(collection(db, "projects"), projectData);
            }

            onSuccess?.();
            closeModal();
        } catch (error) {
            console.error("Error saving project:", error);
            alert('Error saving project: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const isFirebaseDoc = editingItem?.id && typeof editingItem.id === 'string';

        if (!isFirebaseDoc) {
            alert('This is a static project and cannot be deleted from here. Edit the source code instead.');
            return;
        }

        if (!confirm('Are you sure you want to delete this project?')) return;

        setLoading(true);
        try {
            await deleteDoc(doc(db, "projects", editingItem.id));
            onSuccess?.();
            closeModal();
        } catch (error) {
            console.error("Error deleting project:", error);
            alert('Error deleting project: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Check if current item is a Firebase document (can be edited/deleted)
    const isFirebaseDoc = editingItem?.id && typeof editingItem.id === 'string';

    if (!isOpen) return null;

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
                    className="w-full max-w-md h-full overflow-y-auto bg-[#1a1a1a] border-r border-white/10 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a1a1a]">
                        <h2 className="text-xl font-display font-bold text-white">
                            {editingItem ? 'Edit Project' : 'Add New Project'}
                        </h2>
                        <button
                            onClick={closeModal}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <FiX className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <AdminInput
                            label="Project Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. NextTrip"
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
                                        onClick={() => { setImageFile(null); setImagePreview(null); setFormData(prev => ({ ...prev, image: '' })); }}
                                        className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-accent/50 transition-colors bg-black/20">
                                    <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                                    <p className="text-sm text-gray-400">Click to upload</p>
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

                        <div className="flex flex-wrap items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-600 bg-black/20 text-accent focus:ring-accent"
                                />
                                <span className="text-gray-300">Featured</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isHosted"
                                    checked={formData.isHosted}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-600 bg-black/20 text-accent focus:ring-accent"
                                />
                                <span className="text-gray-300">Completed</span>
                            </label>
                        </div>

                        {/* Warning for static items */}
                        {editingItem && !isFirebaseDoc && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
                                ⚠️ This is a static project. Changes will create a new copy in Firebase.
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (editingItem && isFirebaseDoc ? 'Update' : editingItem ? 'Save Copy' : 'Add Project')}
                            </button>
                            {editingItem && isFirebaseDoc && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProjectModal;
