import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { FiLogOut, FiEdit3 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminToolbar = ({ editMode, setEditMode }) => {
    const { currentUser } = useAuth();

    if (!currentUser) return null;

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-50"
            >
                <div className="flex flex-col items-center gap-3 px-3 py-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                    <span className="text-xs text-accent font-medium">
                        ysr
                    </span>

                    <div className="w-6 h-px bg-white/10" />

                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={`flex items-center justify-center p-3 rounded-xl text-sm font-medium transition-all ${
                            editMode
                                ? 'bg-accent text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        title={editMode ? 'Exit Edit Mode' : 'Edit Mode'}
                    >
                        <FiEdit3 className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-sm font-medium transition-all"
                        title="Logout"
                    >
                        <FiLogOut className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AdminToolbar;
