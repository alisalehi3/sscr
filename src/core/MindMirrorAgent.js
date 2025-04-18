/**
 * عامل اصلی MindMirror - هسته مرکزی پردازش و مدیریت داده‌ها
 */

import { MemorySystem } from './MemorySystem.js';
import { NLPProcessor } from '../nlp/NLPProcessor.js';
import { EEGProcessor } from '../processors/EEGProcessor.js';
import { SpeechProcessor } from '../processors/SpeechProcessor.js';
import { UserProfileManager } from '../models/UserProfileManager.js';
import { VisualizationManager } from '../visualization/VisualizationManager.js';

class MindMirrorAgent {
    constructor() {
        this.memory = new MemorySystem();
        this.nlpProcessor = new NLPProcessor();
        this.eegProcessor = new EEGProcessor();
        this.speechProcessor = new SpeechProcessor();
        this.profileManager = new UserProfileManager();
        this.visualizationManager = new VisualizationManager();
    }

    /**
     * پردازش داده‌های EEG و تشخیص وضعیت شناختی
     * @param {Buffer} eegData - داده‌های خام EEG از هدست
     * @param {string} userId - شناسه کاربر
     * @returns {Object} وضعیت شناختی و اطلاعات تحلیل PSD
     */
    async processEEGData(eegData, userId) {
        try {
            // پیش‌پردازش و تحلیل سیگنال EEG
            const processedData = await this.eegProcessor.process(eegData);
            
            // تشخیص وضعیت شناختی (تمرکز/آرامش)
            const cognitiveState = await this.eegProcessor.classifyCognitiveState(processedData);
            
            // ذخیره نتایج در پروفایل کاربر
            await this.profileManager.updateCognitiveState(userId, cognitiveState);
            
            // به‌روزرسانی ویژوالایزرها
            this.visualizationManager.updateEEGVisualizations(cognitiveState);
            
            return cognitiveState;
        } catch (error) {
            console.error("خطا در پردازش داده‌های EEG:", error);
            throw error;
        }
    }

    /**
     * پردازش داده‌های گفتار و تحلیل احساسات و ویژگی‌های صوتی
     * @param {Buffer} audioData - داده‌های صوتی
     * @param {string} userId - شناسه کاربر
     * @returns {Object} نتایج تحلیل احساسات و ویژگی‌های صوتی
     */
    async processSpeechData(audioData, userId) {
        try {
            // تبدیل گفتار به متن
            const transcription = await this.speechProcessor.transcribe(audioData);
            
            // تحلیل احساسات متن
            const sentiment = await this.nlpProcessor.detectEmotions(transcription);
            
            // استخراج ویژگی‌های صوتی (تن، ارتفاع، انرژی)
            const audioFeatures = await this.speechProcessor.extractAudioFeatures(audioData);
            
            // ترکیب نتایج
            const speechAnalysis = {
                text: transcription,
                sentiment,
                audioFeatures
            };
            
            // به‌روزرسانی پروفایل کاربر
            await this.profileManager.updateSpeechAnalysis(userId, speechAnalysis);
            
            // به‌روزرسانی ویژوالایزرها
            this.visualizationManager.updateSpeechVisualizations(speechAnalysis);
            
            return speechAnalysis;
        } catch (error) {
            console.error("خطا در پردازش داده‌های گفتار:", error);
            throw error;
        }
    }

    /**
     * ایجاد پروفایل کاربر با ترکیب داده‌های EEG و گفتار
     * @param {string} userId - شناسه کاربر
     * @returns {Object} پروفایل ترکیبی شناختی-عاطفی
     */
    async generateUserProfile(userId) {
        try {
            // بازیابی اطلاعات کاربر
            const userProfile = await this.profileManager.getUserProfile(userId);
            
            // ترکیب داده‌های EEG و گفتار برای ایجاد پروفایل جامع
            const cognitiveProfile = await this.profileManager.generateCognitiveProfile(userProfile);
            
            // ذخیره در حافظه برای استفاده آینده
            await this.memory.update({
                userId,
                profile: cognitiveProfile,
                timestamp: new Date().toISOString()
            });
            
            return cognitiveProfile;
        } catch (error) {
            console.error("خطا در ایجاد پروفایل کاربر:", error);
            throw error;
        }
    }
}

export { MindMirrorAgent }; 