/**
 * کلاس‌های پردازش سیگنال برای تحلیل داده‌های EEG
 */

class PowerSpectralDensity {
    /**
     * ایجاد یک نمونه از کلاس محاسبه طیف توان
     * @param {number} samplingRate - نرخ نمونه‌برداری سیگنال به هرتز
     */
    constructor(samplingRate = 256) {
        this.samplingRate = samplingRate;
    }
    
    /**
     * محاسبه طیف توان با استفاده از الگوریتم FFT
     * @param {Array} signal - سیگنال ورودی
     * @returns {Object} نتایج PSD شامل فرکانس‌ها و مقادیر توان
     */
    calculate(signal) {
        const n = signal.length;
        
        // محاسبه FFT
        const fft = this.computeFFT(signal);
        
        // محاسبه توان طیف
        const magnitudes = fft.map(complex => 
            Math.sqrt(complex.re * complex.re + complex.im * complex.im)
        );
        
        // نرمال‌سازی توان
        const normalizedPower = magnitudes.map(mag => (mag * mag) / n);
        
        // محاسبه فرکانس‌های متناظر
        const frequencies = Array(Math.floor(n / 2))
            .fill(0)
            .map((_, i) => i * this.samplingRate / n);
        
        // فقط نیمی از طیف را برمی‌گردانیم (به خاطر تقارن FFT)
        const halfLength = Math.floor(normalizedPower.length / 2);
        
        return {
            frequencies: frequencies.slice(0, halfLength),
            power: normalizedPower.slice(0, halfLength)
        };
    }
    
    /**
     * شبیه‌سازی ساده FFT (در نسخه نهایی از کتابخانه‌های تخصصی استفاده خواهد شد)
     * @param {Array} signal - سیگنال ورودی
     * @returns {Array} مقادیر FFT با بخش حقیقی و موهومی
     */
    computeFFT(signal) {
        // پیاده‌سازی ساده FFT برای نمونه سازی
        // در نسخه نهایی از کتابخانه‌های تخصصی FFT استفاده خواهد شد
        
        const n = signal.length;
        const result = [];
        
        // شبیه‌سازی ساده FFT برای نمونه‌سازی
        for (let k = 0; k < n; k++) {
            let sumRe = 0;
            let sumIm = 0;
            
            for (let t = 0; t < n; t++) {
                const angle = 2 * Math.PI * t * k / n;
                sumRe += signal[t] * Math.cos(angle);
                sumIm -= signal[t] * Math.sin(angle);
            }
            
            result.push({ re: sumRe, im: sumIm });
        }
        
        return result;
    }
    
    /**
     * محاسبه توان در یک باند فرکانسی خاص
     * @param {Object} psdResult - نتیجه محاسبه PSD
     * @param {number} fMin - حداقل فرکانس باند
     * @param {number} fMax - حداکثر فرکانس باند
     * @returns {number} توان متوسط در باند فرکانسی مشخص شده
     */
    getBandPower(psdResult, fMin, fMax) {
        const { frequencies, power } = psdResult;
        
        // یافتن اندیس‌های محدوده فرکانسی
        const indices = frequencies.reduce((acc, f, i) => {
            if (f >= fMin && f <= fMax) {
                acc.push(i);
            }
            return acc;
        }, []);
        
        // اگر هیچ فرکانسی در محدوده نباشد
        if (indices.length === 0) {
            return 0;
        }
        
        // محاسبه میانگین توان در محدوده فرکانسی
        const bandPower = indices.reduce((sum, i) => sum + power[i], 0) / indices.length;
        
        return bandPower;
    }
}

/**
 * کلاس فیلترهای دیجیتال برای پیش‌پردازش سیگنال‌های EEG
 */
class DigitalFilters {
    /**
     * اعمال فیلتر میانگین متحرک
     * @param {Array} signal - سیگنال ورودی
     * @param {number} windowSize - سایز پنجره فیلتر
     * @returns {Array} سیگنال فیلتر شده
     */
    static movingAverage(signal, windowSize = 5) {
        const result = [];
        
        for (let i = 0; i < signal.length; i++) {
            let sum = 0;
            let count = 0;
            
            for (let j = Math.max(0, i - Math.floor(windowSize / 2)); 
                 j <= Math.min(signal.length - 1, i + Math.floor(windowSize / 2)); 
                 j++) {
                sum += signal[j];
                count++;
            }
            
            result.push(sum / count);
        }
        
        return result;
    }
    
    /**
     * پیاده‌سازی ساده فیلتر باندپس
     * @param {Array} signal - سیگنال ورودی
     * @param {number} lowCut - فرکانس قطع پایین
     * @param {number} highCut - فرکانس قطع بالا
     * @param {number} samplingRate - نرخ نمونه‌برداری
     * @returns {Array} سیگنال فیلتر شده
     */
    static bandpassFilter(signal, lowCut, highCut, samplingRate) {
        // در نسخه MVP، از یک تقریب ساده استفاده می‌کنیم
        // در نسخه‌های بعدی، پیاده‌سازی کامل فیلتر باندپس قرار خواهد گرفت
        
        // محاسبه PSD
        const psd = new PowerSpectralDensity(samplingRate);
        const psdResult = psd.calculate(signal);
        
        // ایجاد یک نسخه جدید از سیگنال در دامنه فرکانس
        const { frequencies, power } = psdResult;
        const filteredPower = power.map((p, i) => {
            const f = frequencies[i];
            return (f >= lowCut && f <= highCut) ? p : 0;
        });
        
        // شبیه‌سازی ساده برگشت به دامنه زمان
        // این یک تقریب ساده است و در نسخه نهایی باید از IFFT استفاده شود
        return signal.map((_, i) => {
            const factor = Math.pow(filteredPower[i % filteredPower.length] / (power[i % power.length] || 1), 0.5);
            return signal[i] * factor;
        });
    }
}

/**
 * کلاس حذف آرتیفکت برای پاکسازی سیگنال‌های EEG
 */
class ArtifactRemoval {
    /**
     * حذف آرتیفکت با روش آستانه‌گذاری
     * @param {Array} signal - سیگنال ورودی
     * @param {number} threshold - آستانه برای تشخیص آرتیفکت
     * @returns {Array} سیگنال پاکسازی شده
     */
    static thresholdFiltering(signal, threshold) {
        const mean = signal.reduce((sum, value) => sum + value, 0) / signal.length;
        const stdDev = Math.sqrt(
            signal.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / signal.length
        );
        
        const limit = threshold * stdDev;
        
        return signal.map(sample => {
            if (Math.abs(sample - mean) > limit) {
                return mean + Math.sign(sample - mean) * limit;
            }
            return sample;
        });
    }
    
    /**
     * حذف نویز خط برق (50/60 هرتز)
     * @param {Array} signal - سیگنال ورودی
     * @param {number} lineFrequency - فرکانس خط برق (50 یا 60 هرتز)
     * @param {number} samplingRate - نرخ نمونه‌برداری
     * @returns {Array} سیگنال پاکسازی شده
     */
    static removeLineNoise(signal, lineFrequency = 50, samplingRate = 256) {
        // محاسبه PSD
        const psd = new PowerSpectralDensity(samplingRate);
        const psdResult = psd.calculate(signal);
        
        // ایجاد یک فیلتر ناچ برای فرکانس خط برق
        const { frequencies, power } = psdResult;
        const filteredPower = power.map((p, i) => {
            const f = frequencies[i];
            const isLineFrequency = Math.abs(f - lineFrequency) < 1.0;
            return isLineFrequency ? 0 : p;
        });
        
        // شبیه‌سازی ساده برگشت به دامنه زمان
        return signal.map((_, i) => {
            const factor = filteredPower[i % filteredPower.length] / (power[i % power.length] || 1);
            return signal[i] * factor;
        });
    }
}

export {
    PowerSpectralDensity,
    DigitalFilters,
    ArtifactRemoval
}; 