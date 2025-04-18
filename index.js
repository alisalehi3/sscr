/**
 * فایل اصلی اجرای پروژه MindMirror
 */

import { MindMirrorAgent } from './src/core/MindMirrorAgent.js';

// ایجاد نمونه از عامل اصلی
const mindMirror = new MindMirrorAgent();

// داده‌های نمونه برای تست
const sampleEEGDataArray = Array(256).fill(0).map(() => Math.random() * 100 - 50);
const sampleAudioData = Buffer.from(new Float32Array(16000).map(() => Math.random() * 2 - 1));

async function runDemo() {
    try {
        console.log('شروع تست MindMirror...');
        
        // پردازش داده‌های EEG
        console.log('پردازش داده‌های EEG...');
        const cognitiveState = await mindMirror.processEEGData(sampleEEGDataArray, 'test-user');
        console.log('وضعیت شناختی:', cognitiveState);
        
        // پردازش داده‌های گفتار
        console.log('پردازش داده‌های گفتار...');
        const speechAnalysis = await mindMirror.processSpeechData(sampleAudioData, 'test-user');
        console.log('تحلیل گفتار:', speechAnalysis);
        
        // ایجاد پروفایل کاربر
        console.log('ایجاد پروفایل کاربر...');
        const userProfile = await mindMirror.generateUserProfile('test-user');
        console.log('پروفایل کاربر:', userProfile);
        
        console.log('تست با موفقیت به پایان رسید!');
    } catch (error) {
        console.error('خطا در اجرای تست:', error);
    }
}

// اجرای تست
runDemo(); 