import React from 'react';

const AdminInput = ({ label, type = 'text', textarea = false, className = '', ...props }) => {
    const Component = textarea ? 'textarea' : 'input';

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    {label}
                </label>
            )}
            <Component
                type={!textarea ? type : undefined}
                className={`w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 ${textarea ? 'min-h-[120px]' : ''}`}
                {...props}
            />
        </div>
    );
};

export default AdminInput;
