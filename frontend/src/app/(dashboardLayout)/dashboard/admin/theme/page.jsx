"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSave,
    FiRefreshCw,
    FiCheck,
    FiEye,
    FiDroplet,
    FiType,
    FiImage,
} from "react-icons/fi";
import { useTheme, colorPresets, fontOptions } from "@/context/ThemeContext";

export default function ThemeSettingsPage() {
    const { theme, setTheme, resetTheme } = useTheme();

    const [primaryColor, setPrimaryColor] = useState(theme.primaryColor);
    const [secondaryColor, setSecondaryColor] = useState(theme.secondaryColor);
    const [headingFont, setHeadingFont] = useState(theme.headingFont);
    const [bodyFont, setBodyFont] = useState(theme.bodyFont);
    const [logoText, setLogoText] = useState(theme.logoText);
    const [isSaving, setIsSaving] = useState(false);

    // Sync with theme context
    useEffect(() => {
        setPrimaryColor(theme.primaryColor);
        setSecondaryColor(theme.secondaryColor);
        setHeadingFont(theme.headingFont);
        setBodyFont(theme.bodyFont);
        setLogoText(theme.logoText);
    }, [theme]);

    // Generate color variations
    const generateColorVariations = (hex) => {
        // Simple variation generator
        const lighten = (color, percent) => {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R < 255 ? R : 255) * 0x10000 + (G < 255 ? G : 255) * 0x100 + (B < 255 ? B : 255)).toString(16).slice(1);
        };

        const darken = (color, percent) => {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) - amt;
            const G = (num >> 8 & 0x00FF) - amt;
            const B = (num & 0x0000FF) - amt;
            return "#" + (0x1000000 + (R > 0 ? R : 0) * 0x10000 + (G > 0 ? G : 0) * 0x100 + (B > 0 ? B : 0)).toString(16).slice(1);
        };

        return {
            light: lighten(hex, 20),
            dark: darken(hex, 15),
        };
    };

    // Live Preview - Apply changes immediately
    const handlePreview = () => {
        const primaryVariations = generateColorVariations(primaryColor);
        const secondaryVariations = generateColorVariations(secondaryColor);

        setTheme({
            primaryColor,
            primaryLight: primaryVariations.light,
            primaryDark: primaryVariations.dark,
            secondaryColor,
            secondaryLight: secondaryVariations.light,
            secondaryDark: secondaryVariations.dark,
            headingFont,
            bodyFont,
            logoText,
        });

        toast.success("Preview applied!");
    };

    // Save to Backend
    const handleSave = async () => {
        setIsSaving(true);

        try {
            const primaryVariations = generateColorVariations(primaryColor);
            const secondaryVariations = generateColorVariations(secondaryColor);

            // Apply to context
            setTheme({
                primaryColor,
                primaryLight: primaryVariations.light,
                primaryDark: primaryVariations.dark,
                secondaryColor,
                secondaryLight: secondaryVariations.light,
                secondaryDark: secondaryVariations.dark,
                headingFont,
                bodyFont,
                logoText,
            });

            // Save to backend API
            // Get token from creativehub-auth localStorage
            let authToken = "";
            try {
                const auth = localStorage.getItem("creativehub-auth");
                if (auth) {
                    authToken = JSON.parse(auth).token;
                }
            } catch (e) {
                console.error("Failed to get auth token");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/design/theme`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        section: "theme",
                        themeContent: {
                            colors: {
                                primary: primaryColor,
                                primaryLight: primaryVariations.light,
                                primaryDark: primaryVariations.dark,
                                secondary: secondaryColor,
                                secondaryLight: secondaryVariations.light,
                                secondaryDark: secondaryVariations.dark,
                            },
                            fonts: {
                                heading: headingFont,
                                body: bodyFont,
                            },
                            branding: {
                                name: logoText,
                            },
                        },
                        isActive: true,
                    }),
                }
            );

            if (response.ok) {
                toast.success("Theme settings saved successfully! All users will see this theme.");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to save theme settings");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save theme settings. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // Reset to defaults
    const handleReset = () => {
        resetTheme();
        toast.success("Theme reset to defaults");
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Theme Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Customize the website colors and fonts. Changes will apply to the entire site.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Settings Panel */}
                <div className="space-y-6">
                    {/* Color Presets */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary-10 flex items-center justify-center">
                                <FiDroplet className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Color Presets
                            </h2>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {colorPresets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => {
                                        setPrimaryColor(preset.primary);
                                        setSecondaryColor(preset.secondary);
                                    }}
                                    className={`relative p-3 rounded-xl border-2 transition-all ${primaryColor === preset.primary
                                        ? "border-primary shadow-lg"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex gap-1 mb-2">
                                        <div
                                            className="w-6 h-6 rounded-full"
                                            style={{ backgroundColor: preset.primary }}
                                        />
                                        <div
                                            className="w-6 h-6 rounded-full"
                                            style={{ backgroundColor: preset.secondary }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                        {preset.name}
                                    </span>
                                    {primaryColor === preset.primary && (
                                        <FiCheck className="absolute top-2 right-2 w-4 h-4 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Custom Colors */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Custom Colors
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Primary Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="input flex-1"
                                        placeholder="#6366f1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Secondary Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="input flex-1"
                                        placeholder="#f97316"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Fonts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-secondary-10 flex items-center justify-center">
                                <FiType className="w-5 h-5 text-secondary" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Typography
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Heading Font
                                </label>
                                <select
                                    value={headingFont}
                                    onChange={(e) => setHeadingFont(e.target.value)}
                                    className="input w-full"
                                >
                                    {fontOptions.map((font) => (
                                        <option key={font.value} value={font.value}>
                                            {font.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Body Font
                                </label>
                                <select
                                    value={bodyFont}
                                    onChange={(e) => setBodyFont(e.target.value)}
                                    className="input w-full"
                                >
                                    {fontOptions.map((font) => (
                                        <option key={font.value} value={font.value}>
                                            {font.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Branding */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-accent-10 flex items-center justify-center">
                                <FiImage className="w-5 h-5 text-accent" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Branding
                            </h2>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={logoText}
                                onChange={(e) => setLogoText(e.target.value)}
                                className="input w-full"
                                placeholder="CreativeHub Pro"
                            />
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handlePreview}
                            className="btn btn-outline flex items-center gap-2"
                        >
                            <FiEye className="w-4 h-4" />
                            Preview
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            {isSaving ? (
                                <FiRefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <FiSave className="w-4 h-4" />
                            )}
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            onClick={handleReset}
                            className="btn btn-ghost flex items-center gap-2 text-red-600 hover:bg-red-50"
                        >
                            <FiRefreshCw className="w-4 h-4" />
                            Reset to Default
                        </button>
                    </div>
                </div>

                {/* Live Preview */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:sticky lg:top-24"
                >
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Live Preview
                        </h3>

                        {/* Preview Card */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-6">
                            {/* Header Preview */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                                >
                                    C
                                </div>
                                <span
                                    className="text-xl font-bold"
                                    style={{ fontFamily: `${headingFont}, sans-serif` }}
                                >
                                    {logoText}
                                </span>
                            </div>

                            {/* Heading Preview */}
                            <div>
                                <h2
                                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                                    style={{ fontFamily: `${headingFont}, sans-serif` }}
                                >
                                    Beautiful Heading Text
                                </h2>
                                <p
                                    className="text-gray-600 dark:text-gray-300"
                                    style={{ fontFamily: `${bodyFont}, sans-serif` }}
                                >
                                    This is how your body text will look across the website.
                                </p>
                            </div>

                            {/* Button Preview */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    className="px-6 py-2.5 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Primary Button
                                </button>
                                <button
                                    className="px-6 py-2.5 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                                    style={{ backgroundColor: secondaryColor }}
                                >
                                    Secondary Button
                                </button>
                            </div>

                            {/* Color Swatches */}
                            <div className="flex gap-2">
                                <div
                                    className="w-12 h-12 rounded-lg"
                                    style={{ backgroundColor: primaryColor }}
                                    title="Primary"
                                />
                                <div
                                    className="w-12 h-12 rounded-lg"
                                    style={{ backgroundColor: generateColorVariations(primaryColor).light }}
                                    title="Primary Light"
                                />
                                <div
                                    className="w-12 h-12 rounded-lg"
                                    style={{ backgroundColor: generateColorVariations(primaryColor).dark }}
                                    title="Primary Dark"
                                />
                                <div className="w-px bg-gray-300 mx-2" />
                                <div
                                    className="w-12 h-12 rounded-lg"
                                    style={{ backgroundColor: secondaryColor }}
                                    title="Secondary"
                                />
                                <div
                                    className="w-12 h-12 rounded-lg"
                                    style={{ backgroundColor: generateColorVariations(secondaryColor).light }}
                                    title="Secondary Light"
                                />
                                <div
                                    className="w-12 h-12 rounded-lg"
                                    style={{ backgroundColor: generateColorVariations(secondaryColor).dark }}
                                    title="Secondary Dark"
                                />
                            </div>

                            {/* Text Preview */}
                            <div
                                className="p-4 rounded-xl"
                                style={{ backgroundColor: `${primaryColor}15` }}
                            >
                                <p
                                    style={{ color: primaryColor, fontFamily: `${bodyFont}, sans-serif` }}
                                    className="text-sm font-medium"
                                >
                                    This text uses your primary color.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
