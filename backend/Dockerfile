FROM python:3.10-slim

WORKDIR /app

# نصب وابستگی‌های سیستم
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# کپی فایل‌های پروژه
COPY requirements.txt .
COPY .env.example .env

# نصب وابستگی‌های پایتون
RUN pip install --no-cache-dir -r requirements.txt

# کپی کل کد
COPY . .

# تنظیم متغیرهای محیطی
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# اجرای سرور
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 