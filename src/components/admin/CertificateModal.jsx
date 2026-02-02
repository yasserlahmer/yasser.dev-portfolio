import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload } from 'react-icons/fi';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAdmin } from '../../context/AdminContext';
import AdminInput from '../ui/AdminInput';

const CertificateModal = ({ onSuccess }) => {
    const { modalType, editingItem, closeModal } = useAdmin();
    const isOpen = modalType === 'certificate';

    const [formData, setFormData] = useState({
        name: '',
        issuer: '',
        date: '',
        link: '',
        skills: '',
        image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name || '',
                issuer: editingItem.issuer || '',
                date: editingItem.date || '',
                link: editingItem.link || '',
                skills: Array.isArray(editingItem.skills) ? editingItem.skills.join(', ') : '',
                image: editingItem.image || ''
            });
            if (editingItem.image) {
                setImagePreview(editingItem.image);
            }
        } else {
            setFormData({
                name: '',
                issuer: '',
                date: '',
                link: '',
                skills: '',
                image: ''
            });
            setImagePreview(null);
        }
        setImageFile(null);
    }, [editingItem, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        const fileName = `certificates/${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, imageFile);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const imageUrl = await uploadImage();
            const certData = {
                ...formData,
                image: imageUrl,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                updatedAt: new Date()
            };

            // Check if it's a valid Firebase document ID (string, not number)
            const isFirebaseDoc = editingItem?.id && typeof editingItem.id === 'string';

            if (isFirebaseDoc) {
                await updateDoc(doc(db, "certificates", editingItem.id), certData);
            } else {
                certData.createdAt = new Date();
                await addDoc(collection(db, "certificates"), certData);
            }

            onSuccess?.();
            closeModal();
        } catch (error) {
            console.error("Error saving certificate:", error);
            alert('Error saving certificate: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const isFirebaseDoc = editingItem?.id && typeof editingItem.id === 'string';

        if (!isFirebaseDoc) {
            alert('This is a static certificate and cannot be deleted from here.');
            return;
        }

        if (!confirm('Are you sure you want to delete this certificate?')) return;

        setLoading(true);
        try {
            await deleteDoc(doc(db, "certificates", editingItem.id));
            onSuccess?.();
            closeModal();
        } catch (error) {
            console.error("Error deleting certificate:", error);
            alert('Error deleting certificate: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Check if current item is a Firebase document
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
                            {editingItem ? 'Edit Certificate' : 'Add New Certificate'}
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
                            label="Certificate Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. AWS Certified Solutions Architect"
                            required
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                            <AdminInput
                                label="Issuer"
                                name="issuer"
                                value={formData.issuer}
                                onChange={handleChange}
                                placeholder="Amazon Web Services"
                                required
                            />
                            <AdminInput
                                label="Date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                placeholder="Jan 2024"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                                Certificate Image (optional)
                            </label>
                            {imagePreview ? (
                                <div className="relative rounded-lg overflow-hidden border border-white/10">
                                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null); setFormData(prev => ({ ...prev, image: '' })); }}
                                        className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-accent/50 transition-colors bg-black/20">
                                    <FiUpload className="w-6 h-6 mb-2 text-gray-500" />
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
                            placeholder="Cloud Computing, Security, AWS"
                            required
                        />

                        {/* Warning for static items */}
                        {editingItem && !isFirebaseDoc && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
                                ⚠️ This is a static certificate. Changes will create a new copy in Firebase.
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (editingItem && isFirebaseDoc ? 'Update' : editingItem ? 'Save Copy' : 'Add Certificate')}
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

export default CertificateModal;
