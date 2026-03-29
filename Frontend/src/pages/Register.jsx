import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { USER_PATH } from "../constant";
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${USER_PATH}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, role: "BIDDER" })
            });
            if (response.ok) {
                toast.success("Registration successful! Please login.");
                navigate("/login");
            } else {
                toast.error("Registration failed. Email may already exist.");
            }
        } catch (error) {
            console.error("Error registering:", error);
            toast.error("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 33, label: 'Weak', color: 'bg-[var(--color-error)]' };
        if (password.length < 10) return { strength: 66, label: 'Medium', color: 'bg-[var(--color-warning)]' };
        return { strength: 100, label: 'Strong', color: 'bg-[var(--color-success)]' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg-primary)] p-4">
            <div className="bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-lg)] w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="inline-block p-3 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-xl)] mb-3 shadow-[var(--shadow-neu-md)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Create Account</h2>
                    <p className="text-[var(--color-text-secondary)] mt-1">Join our auction platform</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[var(--color-text-primary)] font-medium mb-2">Full Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Enter your full name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-3 pl-11 bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] transition ${
                                    errors.name ? 'ring-1 ring-[var(--color-error)]' : 'focus:ring-1 focus:ring-[var(--color-accent-primary)]'
                                }`}
                                required 
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        {errors.name && <p className="text-[var(--color-error)] text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-[var(--color-text-primary)] font-medium mb-2">Email</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Enter your email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-3 pl-11 bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] transition ${
                                    errors.email ? 'ring-1 ring-[var(--color-error)]' : 'focus:ring-1 focus:ring-[var(--color-accent-primary)]'
                                }`}
                                required 
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        {errors.email && <p className="text-[var(--color-error)] text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-[var(--color-text-primary)] font-medium mb-2">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                placeholder="Create a password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-3 pl-11 pr-11 bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] transition ${
                                    errors.password ? 'ring-1 ring-[var(--color-error)]' : 'focus:ring-1 focus:ring-[var(--color-accent-primary)]'
                                }`}
                                required 
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-[var(--color-error)] text-sm mt-1">{errors.password}</p>}
                        
                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-[var(--color-text-secondary)]">Password Strength:</span>
                                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{passwordStrength.label}</span>
                                </div>
                                <div className="w-full bg-[var(--color-bg-inset)] rounded-full h-2 shadow-[var(--shadow-neu-inset-sm)]">
                                    <div 
                                        className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                                        style={{ width: `${passwordStrength.strength}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white py-3 rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-md)] hover:shadow-[var(--shadow-neu-hover)] active:shadow-[var(--shadow-neu-active)] transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-[var(--color-text-secondary)]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] font-medium transition">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
