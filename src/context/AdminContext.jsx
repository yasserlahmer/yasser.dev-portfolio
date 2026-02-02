import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export function useAdmin() {
    return useContext(AdminContext);
}

export function AdminProvider({ children }) {
    const { currentUser } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalType, setModalType] = useState(null);

    const isAdmin = !!currentUser;

    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);
    };

    const closeModal = () => {
        setModalType(null);
        setEditingItem(null);
    };

    const value = {
        isAdmin,
        editMode: isAdmin && editMode,
        setEditMode,
        editingItem,
        modalType,
        openModal,
        closeModal
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}
