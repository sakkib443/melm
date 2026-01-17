"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiPhone, FiCheckCircle } from "react-icons/fi";
import { authService } from "@/services/api";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const userData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                phone: data.phone,
                role: "buyer", // Always buyer
            };

            const response = await authService.register(userData);

            if (response.success) {
                toast.success("Registration successful! Please login.");
                router.push("/login");
            }
        } catch (error) {
            toast.error(error.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div className="absolute inset-0 gradient-mixed" />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center text-white max-w-md"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Join Our Learning Community
                        </h2>
                        <p className="text-lg opacity-90 mb-8">
                            Access premium courses, digital assets, and grow your skills with expert-led training.
                        </p>
                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <FiCheckCircle size={20} />
                                </div>
                                <span>Access to all premium courses</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <FiCheckCircle size={20} />
                                </div>
                                <span>Download digital assets & templates</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <FiCheckCircle size={20} />
                                </div>
                                <span>Track your learning progress</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <FiCheckCircle size={20} />
                                </div>
                                <span>Get certificates upon completion</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto bg-white dark:bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">eJobs IT</span>
                    </Link>

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        {...register("firstName", { required: "First name is required" })}
                                        className="input pl-11"
                                        placeholder="John"
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    {...register("lastName", { required: "Last name is required" })}
                                    className="input"
                                    placeholder="Doe"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    className="input pl-11"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{11}$/,
                                            message: "Enter a valid 11-digit phone number",
                                        },
                                    })}
                                    className="input pl-11"
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    className="input pl-11 pr-11"
                                    placeholder="Min 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) =>
                                            value === password || "Passwords do not match",
                                    })}
                                    className="input pl-11"
                                    placeholder="Confirm your password"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                {...register("terms", { required: "You must agree to the terms" })}
                                className="w-4 h-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label className="text-sm text-gray-600 dark:text-gray-400">
                                I agree to the{" "}
                                <Link href="/terms" className="text-primary hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="text-red-500 text-xs">{errors.terms.message}</p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-3.5 text-base mt-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create Account
                                    <FiArrowRight />
                                </span>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
