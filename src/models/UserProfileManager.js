/**
 * مدیریت پروفایل کاربران و داده‌های مرتبط با آن‌ها
 */

class UserProfileManager {
    constructor() {
        this.profiles = new Map();
    }

    /**
     * به‌روزرسانی وضعیت شناختی کاربر
     * @param {string} userId - شناسه کاربر
     * @param {Object} cognitiveState - وضعیت شناختی جدید
     */
    async updateCognitiveState(userId, cognitiveState) {
        const profile = this.profiles.get(userId) || {};
        profile.cognitiveState = cognitiveState;
        profile.lastUpdated = new Date();
        this.profiles.set(userId, profile);
    }

    /**
     * به‌روزرسانی تحلیل گفتار کاربر
     * @param {string} userId - شناسه کاربر
     * @param {Object} speechAnalysis - نتایج تحلیل گفتار
     */
    async updateSpeechAnalysis(userId, speechAnalysis) {
        const profile = this.profiles.get(userId) || {};
        profile.speechAnalysis = speechAnalysis;
        profile.lastUpdated = new Date();
        this.profiles.set(userId, profile);
    }

    /**
     * دریافت پروفایل کاربر
     * @param {string} userId - شناسه کاربر
     * @returns {Object} پروفایل کاربر
     */
    async getUserProfile(userId) {
        return this.profiles.get(userId) || null;
    }

    /**
     * تولید پروفایل شناختی بر اساس داده‌های موجود
     * @param {Object} userProfile - پروفایل خام کاربر
     * @returns {Object} پروفایل شناختی پردازش شده
     */
    async generateCognitiveProfile(userProfile) {
        if (!userProfile) return null;

        return {
            cognitiveState: userProfile.cognitiveState || {},
            speechAnalysis: userProfile.speechAnalysis || {},
            lastUpdated: userProfile.lastUpdated,
            analysisTimestamp: new Date()
        };
    }
}

export { UserProfileManager }; 