/**
 * مدیر ویژوال‌سازی داده‌های ذهن‌آینه
 * در این نسخه آزمایشی، از خروجی کنسول برای نمایش اطلاعات استفاده می‌کنیم
 */

class VisualizationManager {
    constructor() {
        console.log("راه‌اندازی مدیر ویژوال‌سازی...");
        this.dataHistory = [];
        this.maxHistoryLength = 100;
    }

    updateEEGVisualizations(cognitiveState) {
        console.log("به‌روزرسانی ویژوال‌سازی EEG:", JSON.stringify(cognitiveState, null, 2));
    }

    updateSpeechVisualizations(speechAnalysis) {
        console.log("به‌روزرسانی ویژوال‌سازی گفتار:", JSON.stringify(speechAnalysis, null, 2));
    }

    updateVisualizations(data) {
        // به‌روزرسانی داده‌های تاریخچه
        this.updateDataHistory(data);
        console.log("به‌روزرسانی ویژوال‌سازی‌ها با داده‌های جدید");
    }

    updateDataHistory(data) {
        this.dataHistory.push({
            timestamp: new Date(),
            ...data
        });
        
        if (this.dataHistory.length > this.maxHistoryLength) {
            this.dataHistory.shift();
        }
    }
}

export { VisualizationManager }; 