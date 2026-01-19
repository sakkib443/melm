// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Get auth token
const getToken = () => {
    if (typeof window !== "undefined") {
        const auth = localStorage.getItem("creativehub-auth");
        if (auth) {
            try {
                return JSON.parse(auth).token;
            } catch {
                return null;
            }
        }
    }
    return null;
};

// Fetch wrapper with auth
export const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

// ==================== AUTH SERVICE ====================
export const authService = {
    login: (credentials) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

    register: (userData) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

    getMe: () => apiFetch('/api/users/me'),

    updateProfile: (data) => apiFetch('/api/users/me', { method: 'PATCH', body: JSON.stringify(data) }),

    changePassword: (data) => apiFetch('/api/users/change-password', { method: 'PATCH', body: JSON.stringify(data) }),
};

// ==================== USER SERVICE ====================
export const userService = {
    getAll: (params = "") => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/users/admin/all${queryString}`);
    },

    getById: (id) => apiFetch(`/api/users/admin/${id}`),

    update: (id, data) => apiFetch(`/api/users/admin/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id) => apiFetch(`/api/users/admin/${id}`, { method: 'DELETE' }),

    getStats: () => apiFetch('/api/users/admin/stats'),
};

// ==================== WISHLIST SERVICE ====================
export const wishlistService = {
    getWishlist: () => apiFetch('/api/wishlist'),
    addToWishlist: (data) => apiFetch('/api/wishlist', { method: 'POST', body: JSON.stringify(data) }),
    removeFromWishlist: (productId) => apiFetch(`/api/wishlist/${productId}`, { method: 'DELETE' }),
    checkWishlist: (productId) => apiFetch(`/api/wishlist/check/${productId}`),
};

// ==================== DOWNLOAD SERVICE ====================
export const downloadService = {
    getMyDownloads: () => apiFetch('/api/downloads'),
    getDownloadLink: (id) => apiFetch(`/api/downloads/${id}/link`),
    checkAccess: (productId) => apiFetch(`/api/downloads/access/${productId}`),
};

// ==================== REVIEW SERVICE ====================
export const reviewService = {
    getByProduct: (productId, productType) => apiFetch(`/api/reviews/product/${productId}?productType=${productType}`),
    getMyReviews: () => apiFetch('/api/reviews/my'),
    create: (data) => apiFetch('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/api/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id) => apiFetch(`/api/reviews/${id}`, { method: 'DELETE' }),
    markHelpful: (id) => apiFetch(`/api/reviews/${id}/helpful`, { method: 'POST' }),
};

// ==================== ANALYTICS SERVICE ====================
export const analyticsService = {
    getDashboard: () =>
        apiFetch("/api/analytics/dashboard"),

    getRevenue: (period = "monthly") =>
        apiFetch(`/api/analytics/revenue?period=${period}`),

    getTopProducts: (limit = 5) =>
        apiFetch(`/api/analytics/top-products?limit=${limit}`),

    getRecentPurchases: (limit = 5) =>
        apiFetch(`/api/analytics/recent-purchases?limit=${limit}`),
};

// ==================== GRAPHICS SERVICE ====================
export const graphicsService = {
    getAll: (params = "") =>
        apiFetch(`/api/graphics${params}`),

    getById: (id) =>
        apiFetch(`/api/graphics/${id}`),

    getBySlug: (slug) =>
        apiFetch(`/api/graphics/slug/${slug}`),

    create: (data) =>
        apiFetch("/api/graphics", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/graphics/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/graphics/${id}`, { method: "DELETE" }),

    getMyGraphics: () =>
        apiFetch("/api/graphics/seller/my"),

    updateStatus: (id, status) =>
        apiFetch(`/api/graphics/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

// ==================== VIDEO TEMPLATE SERVICE ====================
export const videoTemplateService = {
    getAll: (params = "") =>
        apiFetch(`/api/video-templates${params}`),

    getById: (id) =>
        apiFetch(`/api/video-templates/${id}`),

    create: (data) =>
        apiFetch("/api/video-templates", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/video-templates/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/video-templates/${id}`, { method: "DELETE" }),
};

// ==================== UI KIT SERVICE ====================
export const uiKitService = {
    getAll: (params = "") =>
        apiFetch(`/api/ui-kits${params}`),

    getById: (id) =>
        apiFetch(`/api/ui-kits/${id}`),

    create: (data) =>
        apiFetch("/api/ui-kits", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/ui-kits/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/ui-kits/${id}`, { method: "DELETE" }),
};

// ==================== APP TEMPLATE SERVICE ====================
export const appTemplateService = {
    getAll: (params = "") =>
        apiFetch(`/api/app-templates${params}`),

    getById: (id) =>
        apiFetch(`/api/app-templates/${id}`),

    create: (data) =>
        apiFetch("/api/app-templates", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/app-templates/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/app-templates/${id}`, { method: "DELETE" }),
};

// ==================== AUDIO SERVICE ====================
export const audioService = {
    getAll: (params = "") =>
        apiFetch(`/api/audio${params}`),

    getById: (id) =>
        apiFetch(`/api/audio/${id}`),

    create: (data) =>
        apiFetch("/api/audio", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/audio/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/audio/${id}`, { method: "DELETE" }),
};

// ==================== PHOTO SERVICE ====================
export const photoService = {
    getAll: (params = "") =>
        apiFetch(`/api/photos${params}`),

    getById: (id) =>
        apiFetch(`/api/photos/${id}`),

    create: (data) =>
        apiFetch("/api/photos", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/photos/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/photos/${id}`, { method: "DELETE" }),
};

// ==================== FONT SERVICE ====================
export const fontService = {
    getAll: (params = "") =>
        apiFetch(`/api/fonts${params}`),

    getById: (id) =>
        apiFetch(`/api/fonts/${id}`),

    create: (data) =>
        apiFetch("/api/fonts", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/fonts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/fonts/${id}`, { method: "DELETE" }),
};

// ==================== COURSE SERVICE ====================
export const courseService = {
    getAll: (params = {}) => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/courses${queryString}`);
    },

    getById: (id) =>
        apiFetch(`/api/courses/${id}`),

    getBySlug: (slug) =>
        apiFetch(`/api/courses/slug/${slug}`),

    create: (data) =>
        apiFetch("/api/courses", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/courses/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/courses/${id}`, { method: "DELETE" }),

    enroll: (id) =>
        apiFetch("/api/enrollments", { method: "POST", body: JSON.stringify({ courseId: id }) }),
};

// ==================== CATEGORY SERVICE ====================
export const categoryService = {
    getAll: (params = "") =>
        apiFetch(`/api/categories${params}`),

    getHierarchical: () =>
        apiFetch("/api/categories/hierarchical"),

    getParents: () =>
        apiFetch("/api/categories/parents"),

    getChildren: (parentId) =>
        apiFetch(`/api/categories/children/${parentId}`),

    getBySlug: (slug) =>
        apiFetch(`/api/categories/slug/${slug}`),

    // Admin routes
    getAllAdmin: () =>
        apiFetch("/api/categories/admin/all"),

    getById: (id) =>
        apiFetch(`/api/categories/admin/${id}`),

    create: (data) =>
        apiFetch("/api/categories/admin", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/categories/admin/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/categories/admin/${id}`, { method: "DELETE" }),
};

// ==================== ORDER SERVICE ====================
export const orderService = {
    getAll: (params = {}) => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/orders/admin/all${queryString}`);
    },

    getById: (id) =>
        apiFetch(`/api/orders/${id}`),

    getMyOrders: () =>
        apiFetch("/api/orders/my"),

    create: (data) =>
        apiFetch("/api/orders", { method: "POST", body: JSON.stringify(data) }),

    updateStatus: (id, status) =>
        apiFetch(`/api/orders/admin/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

// ==================== NOTIFICATION SERVICE ====================
export const notificationService = {
    getAll: (limit = 10) =>
        apiFetch(`/api/notifications?limit=${limit}`),

    markAsRead: (id) =>
        apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" }),

    markAllAsRead: () =>
        apiFetch("/api/notifications/read-all", { method: "PATCH" }),
};

// ==================== DESIGN/THEME SERVICE ====================
export const designService = {
    get: () =>
        apiFetch("/api/design"),

    update: (data) =>
        apiFetch("/api/design", { method: "PATCH", body: JSON.stringify(data) }),
};

// ==================== MODULE SERVICE ====================
export const moduleService = {
    getByCourse: (courseId) =>
        apiFetch(`/api/modules/course/${courseId}`),

    getById: (id) =>
        apiFetch(`/api/modules/${id}`),

    create: (data) =>
        apiFetch("/api/modules", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/modules/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/modules/${id}`, { method: "DELETE" }),
};

// ==================== LESSON SERVICE ====================
export const lessonService = {
    getAll: () =>
        apiFetch("/api/lessons"),

    getByCourse: (courseId) =>
        apiFetch(`/api/lessons/course/${courseId}`),

    getGroupedByCourse: (courseId) =>
        apiFetch(`/api/lessons/course/${courseId}/grouped`),

    getFreeLessons: (courseId) =>
        apiFetch(`/api/lessons/course/${courseId}/free`),

    getById: (id) =>
        apiFetch(`/api/lessons/${id}`),

    create: (data) =>
        apiFetch("/api/lessons", { method: "POST", body: JSON.stringify(data) }),

    bulkCreate: (data) =>
        apiFetch("/api/lessons/bulk", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/lessons/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/lessons/${id}`, { method: "DELETE" }),

    togglePublish: (id) =>
        apiFetch(`/api/lessons/${id}/toggle-publish`, { method: "PATCH" }),

    reorder: (data) =>
        apiFetch("/api/lessons/reorder", { method: "PATCH", body: JSON.stringify(data) }),

    // Question management
    addQuestion: (lessonId, data) =>
        apiFetch(`/api/lessons/${lessonId}/questions`, { method: "POST", body: JSON.stringify(data) }),

    updateQuestion: (lessonId, questionId, data) =>
        apiFetch(`/api/lessons/${lessonId}/questions/${questionId}`, { method: "PATCH", body: JSON.stringify(data) }),

    deleteQuestion: (lessonId, questionId) =>
        apiFetch(`/api/lessons/${lessonId}/questions/${questionId}`, { method: "DELETE" }),

    reorderQuestions: (lessonId, data) =>
        apiFetch(`/api/lessons/${lessonId}/questions/reorder`, { method: "PATCH", body: JSON.stringify(data) }),

    // Document management
    addDocument: (lessonId, data) =>
        apiFetch(`/api/lessons/${lessonId}/documents`, { method: "POST", body: JSON.stringify(data) }),

    updateDocument: (lessonId, documentId, data) =>
        apiFetch(`/api/lessons/${lessonId}/documents/${documentId}`, { method: "PATCH", body: JSON.stringify(data) }),

    deleteDocument: (lessonId, documentId) =>
        apiFetch(`/api/lessons/${lessonId}/documents/${documentId}`, { method: "DELETE" }),

    // Text block management
    addTextBlock: (lessonId, data) =>
        apiFetch(`/api/lessons/${lessonId}/text-blocks`, { method: "POST", body: JSON.stringify(data) }),

    updateTextBlock: (lessonId, textBlockId, data) =>
        apiFetch(`/api/lessons/${lessonId}/text-blocks/${textBlockId}`, { method: "PATCH", body: JSON.stringify(data) }),

    deleteTextBlock: (lessonId, textBlockId) =>
        apiFetch(`/api/lessons/${lessonId}/text-blocks/${textBlockId}`, { method: "DELETE" }),

    // Quiz
    getQuiz: (lessonId) =>
        apiFetch(`/api/lessons/${lessonId}/quiz`),

    submitQuiz: (lessonId, answers) =>
        apiFetch(`/api/lessons/${lessonId}/quiz/submit`, { method: "POST", body: JSON.stringify({ answers }) }),
};

// ==================== ENROLLMENT SERVICE ====================
export const enrollmentService = {
    getAll: (params = "") =>
        apiFetch(`/api/enrollments${params}`),

    getMyEnrollments: () =>
        apiFetch("/api/enrollments/my"),

    getById: (id) =>
        apiFetch(`/api/enrollments/${id}`),

    create: (courseId) =>
        apiFetch("/api/enrollments", { method: "POST", body: JSON.stringify({ courseId }) }),

    checkEnrollment: (courseId) =>
        apiFetch(`/api/enrollments/check/${courseId}`),

    updateProgress: (enrollmentId, lessonId) =>
        apiFetch(`/api/enrollments/${enrollmentId}/progress`, { method: "PATCH", body: JSON.stringify({ lessonId }) }),
};

// ==================== STATS SERVICE ====================
export const statsService = {
    getUserStats: () =>
        apiFetch("/api/stats/user"),
    getDashboardStats: () =>
        apiFetch("/api/stats/dashboard"),
};

// ==================== PLATFORM/MODULE SERVICE ====================
export const platformService = {
    getEnabledModules: () =>
        apiFetch("/api/platforms/settings/modules"),

    updateEnabledModules: (modules) =>
        apiFetch("/api/platforms/settings/modules", {
            method: "PATCH",
            body: JSON.stringify(modules),
        }),
};

