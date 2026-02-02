import React from 'react';
import { motion } from 'framer-motion';

const AdminCard = ({ children, className = '', title }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass rounded-2xl p-6 relative overflow-hidden ${className}`}
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
        >
            {/* Neon Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

            {title && (
                <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                    {title}
                </h3>
            )}

            {children}
        </motion.div>
    );
};

export default AdminCard;
