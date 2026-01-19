// Live Classes, Webinars, Certificates, Quiz Results API Services

import { apiFetch } from './api';

// ==================== LIVE CLASS SERVICE ====================
export const liveClassService = {
    getAll: (params = {}) => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/live-classes${queryString}`);
    },

    getById: (id) =>
        apiFetch(`/api/live-classes/${id}`),

    create: (data) =>
        apiFetch("/api/live-classes", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/live-classes/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/live-classes/${id}`, { method: "DELETE" }),

    join: (id) =>
        apiFetch(`/api/live-classes/${id}/join`, { method: "POST" }),

    leave: (id) =>
        apiFetch(`/api/live-classes/${id}/leave`, { method: "POST" }),

    getUpcoming: () =>
        apiFetch("/api/live-classes/upcoming"),
};

// ==================== WEBINAR SERVICE ====================
export const webinarService = {
    getAll: (params = {}) => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/webinars${queryString}`);
    },

    getById: (id) =>
        apiFetch(`/api/webinars/${id}`),

    create: (data) =>
        apiFetch("/api/webinars", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/api/webinars/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) =>
        apiFetch(`/api/webinars/${id}`, { method: "DELETE" }),

    register: (id) =>
        apiFetch(`/api/webinars/${id}/register`, { method: "POST" }),
};

// ==================== CERTIFICATE SERVICE ====================
export const certificateService = {
    getAll: (params = {}) => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/certificates${queryString}`);
    },

    getById: (id) =>
        apiFetch(`/api/certificates/${id}`),

    getMyCertificates: () =>
        apiFetch("/api/certificates/my"),

    verify: (certificateId) =>
        apiFetch(`/api/certificates/verify/${certificateId}`),

    generate: (data) =>
        apiFetch("/api/certificates/generate", { method: "POST", body: JSON.stringify(data) }),

    download: (id) =>
        apiFetch(`/api/certificates/${id}/download`),
};

// ==================== QUIZ RESULT SERVICE ====================
export const quizResultService = {
    getAll: (params = {}) => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/quiz-results${queryString}`);
    },

    getById: (id) =>
        apiFetch(`/api/quiz-results/${id}`),

    getMy: (courseId) =>
        apiFetch(`/api/quiz-results/my/${courseId}`),

    submit: (lessonId, answers) =>
        apiFetch(`/api/quiz-results/${lessonId}/submit`, { method: "POST", body: JSON.stringify({ answers }) }),
};
