const { OpenAI } = require('langchain/llms/openai');

class SocraticEngine {
    constructor() {
        this.model = new OpenAI({
            temperature: 0.7,
            modelName: "gpt-4"
        });
        this.distortionQuestions = {
            overgeneralization: [
                "آیا می‌توانید زمانی را به یاد بیاورید که این اتفاق نیفتاده باشد؟",
                "آیا این الگو همیشه درست است؟"
            ],
            catastrophizing: [
                "بدترین نتیجه ممکن چیست؟",
                "محتمل‌ترین نتیجه چیست؟"
            ],
            blackAndWhite: [
                "آیا سایه‌های خاکستری در این موقعیت وجود دارد؟",
                "آیا می‌توانید راه‌های میانه را ببینید؟"
            ],
            mentalFiltering: [
                "آیا فقط روی جنبه‌های منفی تمرکز می‌کنید؟",
                "آیا جنبه‌های مثبت را نادیده می‌گیرید؟"
            ]
        };
    }

    async generateResponse(cognitiveAnalysis) {
        const { cognitiveDistortions, emotionalState } = cognitiveAnalysis;
        
        // انتخاب سوالات مناسب بر اساس تحریفات شناختی شناسایی شده
        const relevantQuestions = this.selectQuestions(cognitiveDistortions);
        
        // تولید پاسخ شخصی‌سازی شده با استفاده از مدل زبان
        const prompt = this.constructPrompt(cognitiveAnalysis, relevantQuestions);
        
        try {
            const response = await this.model.call(prompt);
            return this.formatResponse(response);
        } catch (error) {
            console.error("Error generating Socratic response:", error);
            return this.getFallbackResponse();
        }
    }

    selectQuestions(distortions) {
        const questions = [];
        for (const distortion of distortions) {
            if (this.distortionQuestions[distortion]) {
                questions.push(...this.distortionQuestions[distortion]);
            }
        }
        return questions;
    }

    constructPrompt(analysis, questions) {
        return `
        بر اساس تحلیل شناختی زیر، یک پاسخ سقراطی مناسب تولید کن:
        
        حالت عاطفی: ${analysis.emotionalState}
        تحریفات شناختی: ${analysis.cognitiveDistortions.join(', ')}
        
        سوالات پیشنهادی:
        ${questions.join('\n')}
        
        لطفاً یک پاسخ طبیعی و همدلانه تولید کن که شامل یکی از این سوالات باشد.
        `;
    }

    formatResponse(response) {
        // پاکسازی و فرمت‌بندی پاسخ
        return response.trim();
    }

    getFallbackResponse() {
        return "می‌توانید بیشتر در مورد این موضوع صحبت کنید؟";
    }
}

module.exports = SocraticEngine; 