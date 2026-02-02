import React from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';

export const EditButton = ({ onClick, className = '' }) => {
    const { editMode } = useAdmin();

    if (!editMode) return null;

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={onClick}
            className={`p-2 bg-accent hover:bg-accent-dark text-white rounded-full shadow-lg transition-all hover:scale-110 ${className}`}
        >
            <FiEdit2 className="w-4 h-4" />
        </motion.button>
    );
};

export const AddButton = ({ onClick, label = "Add", className = '' }) => {
    const { editMode } = useAdmin();

    if (!editMode) return null;

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg shadow-lg transition-all hover:scale-105 ${className}`}
        >
            <FiPlus className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </motion.button>
    );
};

export const DeleteButton = ({ onClick, className = '' }) => {
    const { editMode } = useAdmin();

    if (!editMode) return null;

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={onClick}
            className={`p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all hover:scale-110 ${className}`}
        >
            <FiTrash2 className="w-4 h-4" />
        </motion.button>
    );
};
