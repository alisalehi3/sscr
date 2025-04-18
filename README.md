# MindMirror AI

پروژه MindMirror AI یک سیستم یکپارچه برای تحلیل و پردازش داده‌های چند حسی است که با استفاده از هوش مصنوعی، پروفایل شناختی کاربران را ایجاد می‌کند.

## ویژگی‌ها

- پردازش داده‌های EEG
- تحلیل گفتار و صدا
- یکپارچه‌سازی داده‌های چند حسی
- ایجاد پروفایل شناختی
- داشبورد تعاملی

## پیش‌نیازها

- Python 3.10+
- Node.js 16+
- PostgreSQL
- Redis
- InfluxDB
- Kafka

## راه‌اندازی

### بک‌اند

```bash
cd backend
python -m venv venv
source venv/bin/activate  # در ویندوز: .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# تنظیم متغیرهای محیطی در فایل .env
python init_db.py
uvicorn main:app --reload
```

### فرانت‌اند

```bash
cd frontend
npm install
npm run dev
```

## ساختار پروژه

```
.
├── backend/              # سرویس‌های بک‌اند
│   ├── app/             # کد اصلی برنامه
│   ├── tests/           # تست‌ها
│   └── requirements.txt # وابستگی‌های پایتون
│
└── frontend/            # رابط کاربری
    ├── src/            # کد اصلی فرانت‌اند
    └── package.json    # وابستگی‌های نود
```

## مجوز

این پروژه تحت مجوز MIT منتشر شده است. 