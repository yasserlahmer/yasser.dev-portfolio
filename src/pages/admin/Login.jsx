import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminInput from '../../components/ui/AdminInput';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="glass rounded-2xl p-8 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-gray-400">Welcome back, Commander.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <AdminInput
                            label="Email Access"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@yasser.dev"
                            required
                        />

                        <AdminInput
                            label="Security Key"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent-dark text-white py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Initialize Session'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <a href="/" className="text-gray-500 hover:text-white transition-colors text-sm">Return to Public Interface</a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
