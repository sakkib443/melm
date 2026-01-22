"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Comprehensive Translations for all home page sections
const translations = {
    en: {
        // Navbar
        home: "Home",
        design: "Design",
        course: "Course",
        pricing: "Pricing",
        uiKits: "UI Kits",
        about: "About",
        contact: "Contact",
        products: "Products",
        blog: "Blog",
        login: "Login",
        register: "Register",
        letsTalk: "Let's Talk",
        myDashboard: "My Dashboard",
        myLearning: "My Learning",
        orderHistory: "Order History",
        myWishlist: "My Wishlist",
        accountSettings: "Account Settings",
        signOut: "Sign Out",

        // Hero Section
        heroDescription: "CreativeHub Pro, Premium graphic design templates, fonts & creative assets for designers.",
        heroCrafting: "CRAFTING",
        heroCreative: "CREATIVE",
        heroGraphics: "GRAPHICS",
        heroDesign: "DESIGN",
        heroSolution: "SOLUTION",
        heroSolutions: "SOLUTIONS.",
        heroWith: "with",
        heroAbuSayeed: "SAKIB",
        heroAssetsCount: "50K+",
        heroAssetsSold: "design assets sold.",
        heroWeAreGlobal: "We are Global",
        heroBrandAgency: "Brand Design Agency.",
        heroAwwwards: "Awwwards",
        heroAwwwardsDesc: "Top Contributor since 2019 to current.",

        // Agency Intro Section
        aboutUs: "About Us",
        premiumDesign: "PREMIUM",
        designMarketplace: "DESIGN",
        marketplaceText: "MARKETPLACE.",
        introDescription: "Discover thousands of premium graphic design templates, fonts, icons, illustrations, and creative assets. Perfect for designers, marketers, and businesses worldwide.",
        designAssets: "Design Assets",
        topDesigners: "Top Designers",
        happyBuyers: "Happy Buyers",
        exploreAllAssets: "Explore All Assets",

        // Expertise Cards
        instantDownload: "Instant Download",
        instantDownloadDesc: "Download your purchased assets instantly. All files come in multiple formats ready for use in any design software.",
        premiumQuality: "Premium Quality",
        premiumQualityDesc: "Every asset is carefully curated and reviewed by our team to ensure the highest quality standards.",
        commercialLicense: "Commercial License",
        commercialLicenseDesc: "Use our assets in unlimited personal and commercial projects with our comprehensive licensing.",

        // Scrolling Ticker
        templates: "TEMPLATES",
        fonts: "FONTS",
        graphicsWord: "GRAPHICS",
        icons: "ICONS",
        illustrations: "ILLUSTRATIONS",
        mockups: "MOCKUPS",
        uiKitsWord: "UI KITS",
        branding: "BRANDING",

        // Services (Browse by Category)
        browseBy: "BROWSE BY",
        category: "CATEGORY.",
        viewAllCategories: "View All Categories",
        graphicTemplates: "Graphic Templates",
        graphicTemplatesDesc: "Professional design templates for social media, presentations, posters, and more.",
        socialMedia: "Social Media",
        presentations: "Presentations",
        printReady: "Print Ready",
        fontsTypography: "Fonts & Typography",
        fontsTypographyDesc: "Beautiful fonts for every project - from elegant serifs to modern sans-serifs and display typefaces.",
        displayFonts: "Display Fonts",
        scriptFonts: "Script Fonts",
        sansSerif: "Sans Serif",
        uiKitsMockups: "UI Kits & Mockups",
        uiKitsMockupsDesc: "Complete UI kits and realistic mockups for web, mobile, and product design projects.",
        webUI: "Web UI",
        mobileUI: "Mobile UI",
        mockupsWord: "Mockups",
        illustrationsIcons: "Illustrations & Icons",
        illustrationsIconsDesc: "Hand-crafted illustrations and icon sets to bring your designs to life.",
        vectorIcons: "Vector Icons",
        illustrationsWord: "Illustrations",
        threeDAassets: "3D Assets",
        brandIdentity: "Brand Identity",
        brandIdentityDesc: "Complete branding packages including logos, stationery, and brand guidelines.",
        logoTemplates: "Logo Templates",
        brandKits: "Brand Kits",
        stationery: "Stationery",

        // Project Counter
        designsDownloaded: "DESIGNS",
        downloaded: "DOWNLOADED",

        // Portfolio (Trending Products)
        featured: "Featured",
        trending: "TRENDING",
        products: "PRODUCTS.",
        viewAll: "View All",
        premiumUIKit: "Premium UI Kit Bundle",
        creativeFontCollection: "Creative Font Collection",
        socialMediaTemplates: "Social Media Templates",
        brandIdentityPack: "Brand Identity Pack",

        // Testimonials
        customerReviews: "Customer Reviews",
        testimonial1: "The quality of templates here is incredible. I've saved countless hours on my design projects. This is my go-to marketplace for graphics!",
        testimonial2: "Best font collection I've ever found. The licensing is clear, the quality is top-notch, and the variety is amazing. Highly recommend!",
        testimonial3: "As a startup founder, this marketplace saved me thousands on design costs. Professional assets at unbeatable prices!",
        freelanceDesigner: "Freelance Designer",
        creativeDirector: "Creative Director, Studio X",
        founderTechStart: "Founder, TechStart",

        // Client Logos
        trustedByIndustry: "Trusted by industry leaders worldwide",
        recognizedBy: "Recognized by",
        and: "and",

        // Blog Section
        weProvide: "WE PROVIDE SMART",
        solutionWord: "SOLUTION.",
        blogDescription: "Strategists dedicated to creating stunning, functional websites that align with your unique business goals.",
        viewOurBlog: "View Our Blog",
        webDesign: "Web Design",
        blogTitle1: "The Future of Web Design: Trends to Watch in 2025",
        blogTitle2: "Top 5 Mistakes to Avoid When Create Business Website.",
        readMore: "Read More",

        // Footer CTA
        start: "START",
        creating: "CREATING.",
        footerDescription: "Join thousands of designers and get access to premium creative assets today.",
        getDesignUpdates: "Get Design Updates",
        subscribeDescription: "Subscribe to get notified about new assets and special deals.",
        enterEmail: "Enter your email",
        marketplace: "Marketplace",
        support: "Support",
        helpCenter: "Help Center",
        licensing: "Licensing",
        refundPolicy: "Refund Policy",
        contactUs: "Contact Us",
        becomeASeller: "Become a Seller",
        allRightsReserved: "All rights reserved.",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        licenseAgreement: "License Agreement",

        // About Founder Section
        aboutMe: "About Me",
        creativeDesigner: "Creative Designer",
        andEntrepreneur: "& Entrepreneur",
        aboutFounderDesc1: "Hi, I'm SAKIB — a passionate graphic designer and entrepreneur from Bangladesh. I specialize in creating premium design templates, branding assets, and creative solutions that help businesses and individuals stand out.",
        aboutFounderDesc2: "With over 14 years of experience in the design industry, I've helped thousands of clients worldwide achieve their creative goals. My mission is to make professional design accessible to everyone through high-quality, affordable templates and resources.",
        yearsExperience: "Years Experience",
        happyClients: "Happy Clients",
        downloads: "Downloads",
        avgRating: "Average Rating",
        learnMoreAboutMe: "Learn More About Me",
        projectsCompleted: "Projects Completed",
    },
    bn: {
        // Navbar
        home: "হোম",
        design: "ডিজাইন",
        course: "কোর্স",
        pricing: "প্রাইসিং",
        uiKits: "ইউআই কিটস",
        about: "অ্যাবাউট",
        contact: "যোগাযোগ",
        products: "প্রোডাক্ট",
        blog: "ব্লগ",
        login: "লগইন",
        register: "রেজিস্টার",
        letsTalk: "যোগাযোগ করুন",
        myDashboard: "আমার ড্যাশবোর্ড",
        myLearning: "আমার শিক্ষা",
        orderHistory: "অর্ডার ইতিহাস",
        myWishlist: "আমার উইশলিস্ট",
        accountSettings: "একাউন্ট সেটিংস",
        signOut: "লগ আউট",

        // Hero Section
        heroDescription: "ক্রিয়েটিভহাব প্রো, ডিজাইনারদের জন্য প্রিমিয়াম গ্রাফিক ডিজাইন টেমপ্লেট, ফন্ট এবং ক্রিয়েটিভ অ্যাসেট।",
        heroCrafting: "ক্র্যাফটিং",
        heroCreative: "ক্রিয়েটিভ",
        heroGraphics: "গ্রাফিক্স",
        heroDesign: "ডিজাইন",
        heroSolution: "সল্যুশন",
        heroSolutions: "সল্যুশন।",
        heroWith: "সাথে",
        heroAbuSayeed: "SAKIB",
        heroAssetsCount: "৫০K+",
        heroAssetsSold: "ডিজাইন অ্যাসেট বিক্রি হয়েছে।",
        heroWeAreGlobal: "আমরা গ্লোবাল",
        heroBrandAgency: "ব্র্যান্ড ডিজাইন এজেন্সি।",
        heroAwwwards: "অ্যাওয়ার্ডস",
        heroAwwwardsDesc: "২০১৯ থেকে বর্তমান পর্যন্ত শীর্ষ অবদানকারী।",

        // Agency Intro Section
        aboutUs: "আমাদের সম্পর্কে",
        premiumDesign: "প্রিমিয়াম",
        designMarketplace: "ডিজাইন",
        marketplaceText: "মার্কেটপ্লেস।",
        introDescription: "হাজার হাজার প্রিমিয়াম গ্রাফিক ডিজাইন টেমপ্লেট, ফন্ট, আইকন, ইলাস্ট্রেশন এবং ক্রিয়েটিভ অ্যাসেট আবিষ্কার করুন। ডিজাইনার, মার্কেটার এবং বিশ্বব্যাপী ব্যবসায়ীদের জন্য উপযুক্ত।",
        designAssets: "ডিজাইন অ্যাসেট",
        topDesigners: "শীর্ষ ডিজাইনার",
        happyBuyers: "সন্তুষ্ট ক্রেতা",
        exploreAllAssets: "সব অ্যাসেট দেখুন",

        // Expertise Cards
        instantDownload: "তাৎক্ষণিক ডাউনলোড",
        instantDownloadDesc: "আপনার ক্রয়কৃত অ্যাসেট তাৎক্ষণিক ডাউনলোড করুন। সব ফাইল যেকোনো ডিজাইন সফটওয়্যারে ব্যবহারের জন্য একাধিক ফরম্যাটে প্রস্তুত।",
        premiumQuality: "প্রিমিয়াম কোয়ালিটি",
        premiumQualityDesc: "প্রতিটি অ্যাসেট আমাদের টিম দ্বারা সর্বোচ্চ মানদণ্ড নিশ্চিত করতে যত্নসহকারে কিউরেট এবং পর্যালোচনা করা হয়।",
        commercialLicense: "কমার্শিয়াল লাইসেন্স",
        commercialLicenseDesc: "আমাদের ব্যাপক লাইসেন্সিং সহ সীমাহীন ব্যক্তিগত এবং বাণিজ্যিক প্রকল্পে আমাদের অ্যাসেট ব্যবহার করুন।",

        // Scrolling Ticker
        templates: "টেমপ্লেট",
        fonts: "ফন্ট",
        graphicsWord: "গ্রাফিক্স",
        icons: "আইকন",
        illustrations: "ইলাস্ট্রেশন",
        mockups: "মকআপ",
        uiKitsWord: "ইউআই কিটস",
        branding: "ব্র্যান্ডিং",

        // Services (Browse by Category)
        browseBy: "ব্রাউজ করুন",
        category: "ক্যাটাগরি।",
        viewAllCategories: "সব ক্যাটাগরি দেখুন",
        graphicTemplates: "গ্রাফিক টেমপ্লেট",
        graphicTemplatesDesc: "সোশ্যাল মিডিয়া, প্রেজেন্টেশন, পোস্টার এবং আরও অনেক কিছুর জন্য পেশাদার ডিজাইন টেমপ্লেট।",
        socialMedia: "সোশ্যাল মিডিয়া",
        presentations: "প্রেজেন্টেশন",
        printReady: "প্রিন্ট রেডি",
        fontsTypography: "ফন্ট ও টাইপোগ্রাফি",
        fontsTypographyDesc: "প্রতিটি প্রকল্পের জন্য সুন্দর ফন্ট - এলিগ্যান্ট সেরিফ থেকে আধুনিক সান্স-সেরিফ এবং ডিসপ্লে টাইপফেস।",
        displayFonts: "ডিসপ্লে ফন্ট",
        scriptFonts: "স্ক্রিপ্ট ফন্ট",
        sansSerif: "সান্স সেরিফ",
        uiKitsMockups: "ইউআই কিটস ও মকআপ",
        uiKitsMockupsDesc: "ওয়েব, মোবাইল এবং প্রোডাক্ট ডিজাইন প্রকল্পের জন্য সম্পূর্ণ ইউআই কিট এবং বাস্তবসম্মত মকআপ।",
        webUI: "ওয়েব ইউআই",
        mobileUI: "মোবাইল ইউআই",
        mockupsWord: "মকআপ",
        illustrationsIcons: "ইলাস্ট্রেশন ও আইকন",
        illustrationsIconsDesc: "আপনার ডিজাইনকে জীবন্ত করতে হাতে তৈরি ইলাস্ট্রেশন এবং আইকন সেট।",
        vectorIcons: "ভেক্টর আইকন",
        illustrationsWord: "ইলাস্ট্রেশন",
        threeDAassets: "থ্রিডি অ্যাসেট",
        brandIdentity: "ব্র্যান্ড আইডেন্টিটি",
        brandIdentityDesc: "লোগো, স্টেশনারি এবং ব্র্যান্ড গাইডলাইন সহ সম্পূর্ণ ব্র্যান্ডিং প্যাকেজ।",
        logoTemplates: "লোগো টেমপ্লেট",
        brandKits: "ব্র্যান্ড কিটস",
        stationery: "স্টেশনারি",

        // Project Counter
        designsDownloaded: "ডিজাইন",
        downloaded: "ডাউনলোড হয়েছে",

        // Portfolio (Trending Products)
        featured: "ফিচার্ড",
        trending: "ট্রেন্ডিং",
        products: "প্রোডাক্ট।",
        viewAll: "সব দেখুন",
        premiumUIKit: "প্রিমিয়াম ইউআই কিট বান্ডল",
        creativeFontCollection: "ক্রিয়েটিভ ফন্ট কালেকশন",
        socialMediaTemplates: "সোশ্যাল মিডিয়া টেমপ্লেট",
        brandIdentityPack: "ব্র্যান্ড আইডেন্টিটি প্যাক",

        // Testimonials
        customerReviews: "গ্রাহক রিভিউ",
        testimonial1: "এখানে টেমপ্লেটের মান অবিশ্বাস্য। আমি আমার ডিজাইন প্রকল্পে অগণিত ঘন্টা বাঁচিয়েছি। গ্রাফিক্সের জন্য এটি আমার প্রধান মার্কেটপ্লেস!",
        testimonial2: "সেরা ফন্ট কালেকশন যা আমি কখনো পেয়েছি। লাইসেন্সিং স্পষ্ট, মান শীর্ষস্থানীয় এবং বৈচিত্র্য অসাধারণ। অত্যন্ত সুপারিশ করি!",
        testimonial3: "একজন স্টার্টআপ প্রতিষ্ঠাতা হিসাবে, এই মার্কেটপ্লেস আমার ডিজাইন খরচে হাজার হাজার টাকা বাঁচিয়েছে। অপরাজেয় মূল্যে পেশাদার অ্যাসেট!",
        freelanceDesigner: "ফ্রিল্যান্স ডিজাইনার",
        creativeDirector: "ক্রিয়েটিভ ডিরেক্টর, স্টুডিও এক্স",
        founderTechStart: "প্রতিষ্ঠাতা, টেকস্টার্ট",

        // Client Logos
        trustedByIndustry: "বিশ্বব্যাপী শিল্প নেতাদের দ্বারা বিশ্বস্ত",
        recognizedBy: "স্বীকৃত",
        and: "এবং",

        // Blog Section
        weProvide: "আমরা স্মার্ট প্রদান করি",
        solutionWord: "সমাধান।",
        blogDescription: "আপনার অনন্য ব্যবসায়িক লক্ষ্যের সাথে সামঞ্জস্যপূর্ণ অত্যাশ্চর্য, কার্যকরী ওয়েবসাইট তৈরিতে নিবেদিত কৌশলবিদ।",
        viewOurBlog: "আমাদের ব্লগ দেখুন",
        webDesign: "ওয়েব ডিজাইন",
        blogTitle1: "২০২৫ সালে ওয়েব ডিজাইনের ভবিষ্যত: যে ট্রেন্ডগুলো দেখতে হবে",
        blogTitle2: "ব্যবসায়িক ওয়েবসাইট তৈরি করার সময় শীর্ষ ৫টি ভুল এড়িয়ে চলুন।",
        readMore: "আরো পড়ুন",

        // Footer CTA
        start: "শুরু",
        creating: "করুন।",
        footerDescription: "হাজার হাজার ডিজাইনারদের সাথে যোগ দিন এবং আজই প্রিমিয়াম ক্রিয়েটিভ অ্যাসেট অ্যাক্সেস করুন।",
        getDesignUpdates: "ডিজাইন আপডেট পান",
        subscribeDescription: "নতুন অ্যাসেট এবং বিশেষ অফার সম্পর্কে তথ্য পেতে সাবস্ক্রাইব করুন।",
        enterEmail: "আপনার ইমেইল লিখুন",
        marketplace: "মার্কেটপ্লেস",
        support: "সাপোর্ট",
        helpCenter: "হেল্প সেন্টার",
        licensing: "লাইসেন্সিং",
        refundPolicy: "রিফান্ড পলিসি",
        contactUs: "যোগাযোগ করুন",
        becomeASeller: "বিক্রেতা হন",
        allRightsReserved: "সর্বস্বত্ব সংরক্ষিত।",
        privacyPolicy: "গোপনীয়তা নীতি",
        termsOfService: "সেবার শর্তাবলী",
        licenseAgreement: "লাইসেন্স চুক্তি",

        // About Founder Section
        aboutMe: "আমার সম্পর্কে",
        creativeDesigner: "ক্রিয়েটিভ ডিজাইনার",
        andEntrepreneur: "ও উদ্যোক্তা",
        aboutFounderDesc1: "আমি SAKIB — বাংলাদেশের একজন আবেগী গ্রাফিক ডিজাইনার ও উদ্যোক্তা। আমি প্রিমিয়াম ডিজাইন টেমপ্লেট, ব্র্যান্ডিং অ্যাসেট এবং ক্রিয়েটিভ সমাধান তৈরিতে বিশেষজ্ঞ যা ব্যবসা ও ব্যক্তিদের আলাদা করে তোলে।",
        aboutFounderDesc2: "ডিজাইন ইন্ডাস্ট্রিতে ১৪+ বছরের অভিজ্ঞতা নিয়ে, আমি বিশ্বব্যাপী হাজার হাজার ক্লায়েন্টকে তাদের ক্রিয়েটিভ লক্ষ্য অর্জনে সাহায্য করেছি। আমার লক্ষ্য হল উচ্চমানের, সাশ্রয়ী টেমপ্লেট এবং রিসোর্সের মাধ্যমে সবার কাছে পেশাদার ডিজাইন পৌঁছে দেওয়া।",
        yearsExperience: "বছরের অভিজ্ঞতা",
        happyClients: "সন্তুষ্ট ক্লায়েন্ট",
        downloads: "ডাউনলোড",
        avgRating: "গড় রেটিং",
        learnMoreAboutMe: "আমার সম্পর্কে আরো জানুন",
        projectsCompleted: "প্রজেক্ট সম্পন্ন",
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load saved language preference
        const savedLang = localStorage.getItem('language');
        if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
            setLanguage(savedLang);
            // Update HTML lang attribute for CSS font switching
            document.documentElement.lang = savedLang;
        }
    }, []);

    // Update HTML lang attribute when language changes
    useEffect(() => {
        if (mounted) {
            document.documentElement.lang = language;
        }
    }, [language, mounted]);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'bn' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    const setLanguageDirectly = (lang) => {
        if (lang === 'en' || lang === 'bn') {
            setLanguage(lang);
            localStorage.setItem('language', lang);
        }
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage: setLanguageDirectly, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    // Return safe defaults if context is not available (SSR or outside provider)
    if (!context) {
        return {
            language: 'en',
            toggleLanguage: () => { },
            setLanguage: () => { },
            t: (key) => key,
        };
    }

    return context;
}

export default LanguageProvider;
