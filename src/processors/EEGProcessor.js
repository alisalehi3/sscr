/**
 * پردازشگر داده‌های EEG برای تحلیل سیگنال‌های مغزی
 */

import { PowerSpectralDensity } from '../utils/SignalProcessing.js';
import * as tf from '@tensorflow/tfjs-node';

class EEGProcessor {
    constructor() {
        this.bandRanges = {
            delta: [0.5, 4],
            theta: [4, 8],
            alpha: [8, 13],
            beta: [13, 30],
            gamma: [30, 50]
        };
        this.model = null;
        this.initialize();
    }

    /**
     * بارگذاری مدل دسته‌بندی حالت شناختی
     */
    async initialize() {
        try {
            // در نسخه MVP از یک مدل ساده استفاده می‌کنیم
            // این مدل در نسخه‌های آینده با مدل پیچیده‌تر جایگزین خواهد شد
            this.model = await this.createSimpleModel();
        } catch (error) {
            console.error("خطا در راه‌اندازی EEG پردازشگر:", error);
        }
    }

    /**
     * ایجاد یک مدل ساده SVM برای دسته‌بندی حالت‌های شناختی
     */
    async createSimpleModel() {
        // در MVP از یک مدل ساده استفاده می‌کنیم
        // این مدل بر اساس نسبت باندهای فرکانسی کار می‌کند
        const model = tf.sequential();
        model.add(tf.layers.dense({ 
            units: 16, 
            activation: 'relu', 
            inputShape: [5]  // 5 باند فرکانسی
        }));
        model.add(tf.layers.dense({ 
            units: 8, 
            activation: 'relu' 
        }));
        model.add(tf.layers.dense({ 
            units: 2, 
            activation: 'softmax'  // دسته‌بندی دوتایی (تمرکز/آرامش)
        }));

        model.compile({
            optimizer: 'adam',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }

    /**
     * پردازش داده‌های خام EEG
     * @param {Buffer|Array} eegData - داده‌های خام EEG
     * @returns {Object} داده‌های پردازش شده
     */
    async process(eegData) {
        try {
            // تبدیل داده‌های خام به آرایه
            const rawSignal = this.convertToArray(eegData);
            
            // فیلتر کردن سیگنال (باندپس 0.1 تا 50 هرتز)
            const filteredSignal = await this.filterSignal(rawSignal);
            
            // حذف آرتیفکت‌ها (حرکات چشم، عضلات، و...)
            const cleanSignal = await this.removeArtifacts(filteredSignal);
            
            // محاسبه PSD برای باندهای مختلف فرکانسی
            const psd = await this.calculatePSD(cleanSignal);
            
            return {
                rawSignal,
                filteredSignal,
                cleanSignal,
                psd
            };
        } catch (error) {
            console.error("خطا در پردازش سیگنال EEG:", error);
            throw error;
        }
    }

    /**
     * تبدیل داده‌های خام به آرایه برای پردازش
     * @param {Buffer|Array|Float32Array} eegData - داده‌های خام
     * @returns {Array} آرایه داده‌های عددی
     */
    convertToArray(eegData) {
        if (eegData instanceof Buffer) {
            // تبدیل بافر به آرایه اعداد با دقت مناسب
            return Array.from(new Float32Array(eegData.buffer));
        } else if (Array.isArray(eegData)) {
            return eegData;
        } else if (eegData instanceof Float32Array) {
            return Array.from(eegData);
        } else {
            console.error("نوع داده EEG:", typeof eegData, eegData.constructor.name);
            throw new Error("فرمت داده EEG غیرقابل پردازش است");
        }
    }

    /**
     * فیلتر کردن سیگنال EEG با فیلتر باندپس
     * @param {Array} signal - سیگنال خام
     * @returns {Array} سیگنال فیلتر شده
     */
    async filterSignal(signal) {
        // پیاده‌سازی فیلتر باندپس دیجیتال
        // در نسخه MVP از یک فیلتر ساده استفاده می‌کنیم
        // این بخش در نسخه‌های بعدی با کتابخانه‌های پیشرفته‌تر جایگزین خواهد شد
        
        // شبیه‌سازی فیلتر باندپس 0.1-50 هرتز
        return signal.map(s => s * 0.95); // شبیه‌سازی ساده
    }

    /**
     * حذف آرتیفکت‌ها از سیگنال EEG
     * @param {Array} signal - سیگنال فیلتر شده
     * @returns {Array} سیگنال پاکسازی شده
     */
    async removeArtifacts(signal) {
        // در نسخه MVP از یک الگوریتم ساده حذف آرتیفکت استفاده می‌کنیم
        // در نسخه‌های آینده از الگوریتم‌های پیشرفته‌تر مانند ICA استفاده خواهد شد
        
        // حذف ساده آرتیفکت‌ها با آستانه‌گذاری
        const threshold = 100; // آستانه تشخیص آرتیفکت
        return signal.map(sample => 
            Math.abs(sample) > threshold ? threshold * Math.sign(sample) : sample
        );
    }

    /**
     * محاسبه طیف توان (PSD) برای باندهای مختلف فرکانسی
     * @param {Array} signal - سیگنال پاکسازی شده
     * @returns {Object} طیف توان در باندهای مختلف
     */
    async calculatePSD(signal) {
        // استفاده از کلاس PowerSpectralDensity برای محاسبه PSD
        const psdCalculator = new PowerSpectralDensity(256); // نرخ نمونه‌برداری 256 هرتز
        const psdResult = psdCalculator.calculate(signal);
        
        // استخراج توان در باندهای مختلف فرکانسی
        const bandPowers = {};
        for (const [band, [fMin, fMax]] of Object.entries(this.bandRanges)) {
            bandPowers[band] = psdCalculator.getBandPower(psdResult, fMin, fMax);
        }
        
        return {
            fullSpectrum: psdResult,
            bandPowers
        };
    }

    /**
     * دسته‌بندی حالت شناختی بر اساس PSD
     * @param {Object} processedData - داده‌های پردازش شده
     * @returns {Object} حالت شناختی و اطمینان
     */
    async classifyCognitiveState(processedData) {
        const { bandPowers } = processedData.psd;
        
        // محاسبه نسبت‌های کلیدی
        const alphaTheta = bandPowers.alpha / bandPowers.theta;
        const betaTheta = bandPowers.beta / bandPowers.theta;
        
        // استفاده از مدل یادگیری ماشین برای دسته‌بندی
        const features = tf.tensor2d([
            [
                bandPowers.delta,
                bandPowers.theta,
                bandPowers.alpha,
                bandPowers.beta,
                bandPowers.gamma
            ]
        ]);
        
        const prediction = this.model.predict(features);
        const probabilities = prediction.dataSync();
        
        // تعیین حالت شناختی بر اساس خروجی مدل
        const cognitiveState = probabilities[0] > probabilities[1] ? 'focused' : 'relaxed';
        const confidence = Math.max(probabilities[0], probabilities[1]);
        
        // در حالت MVP می‌توانیم از قوانین ساده نیز استفاده کنیم
        let stateFromRules;
        if (alphaTheta > 1.0 && betaTheta < 0.8) {
            stateFromRules = 'relaxed';
        } else if (betaTheta > 1.5) {
            stateFromRules = 'focused';
        } else {
            stateFromRules = 'neutral';
        }
        
        return {
            state: cognitiveState,
            confidence,
            stateFromRules,
            ratios: {
                alphaTheta,
                betaTheta
            },
            bandPowers
        };
    }
}

export { EEGProcessor }; 