/**
 * سیستم مدیریت حافظه برای ذخیره و بازیابی داده‌ها
 */

class MemorySystem {
    constructor() {
        this.memory = new Map();
    }

    /**
     * به‌روزرسانی داده‌ها در حافظه
     * @param {Object} data - داده‌های جدید برای ذخیره
     */
    async update(data) {
        const key = data.userId || 'default';
        this.memory.set(key, {
            ...data,
            timestamp: new Date()
        });
    }

    /**
     * بازیابی داده‌ها از حافظه
     * @param {string} userId - شناسه کاربر
     * @returns {Object} داده‌های ذخیره شده
     */
    async retrieve(userId) {
        return this.memory.get(userId || 'default');
    }

    /**
     * پاک کردن داده‌های قدیمی
     * @param {number} ageInMinutes - حداکثر سن داده‌ها به دقیقه
     */
    async cleanup(ageInMinutes = 60) {
        const now = new Date();
        for (const [key, value] of this.memory.entries()) {
            const age = (now - value.timestamp) / (1000 * 60);
            if (age > ageInMinutes) {
                this.memory.delete(key);
            }
        }
    }
}

export { MemorySystem }; 