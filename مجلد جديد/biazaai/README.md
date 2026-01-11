# Biazaai - منصة الذكاء الاصطناعي المتكاملة

منصة شاملة تجمع بين قوة الذكاء الاصطناعي وأتمتة قنوات التواصل (واتساب، تلجرام) لتقديم حلول ذكية للأعمال.

## المميزات الرئيسية

- **ذكاء اصطناعي متقدم**: بحث ذكي، إنشاء محتوى، تحليل بيانات، ترجمة، وتلخيص.
- **أتمتة قنوات التواصل**: دمج واتساب للأعمال وتلجرام للرد الآلي الذكي.
- **لوحة تحكم شاملة**: تحليلات تفاعلية، إحصائيات حية، وسجلات محادثات.
- **إدارة ملفات متكاملة**: رفع، معالجة، وتنظيم الملفات والصور.
- **تخصيص متقدم**: تكوين رسائل ترحيب، تأخير ردود، ولغات متعددة.
- **أمان وحماية**: تشفير بيانات، مصادقة متعددة العوامل، وسجلات تدقيق.

## هيكل المشروع

```
biazaai/
├── client/                 # تطبيق React (واجهة المستخدم)
│   ├── public/
│   ├── src/
│   │   ├── components/    # مكونات واجهة مستخدم
│   │   ├── pages/         # صفحات التطبيق
│   │   ├── styles/        # أنماط CSS و Tailwind
│   │   └── utils/         # أدوات مساعدة
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # تطبيق Node.js (الخادم)
│   ├── src/
│   │   ├── controllers/   # منطق التحكم
│   │   ├── models/        # نماذج MongoDB
│   │   ├── routes/        # نقاط النهاية API
│   │   ├── middlewares/   # وسائط المصادقة والتحقق
│   │   └── services/      # خدمات خارجية
│   ├── package.json
│   └── .env.example
├── shared/                 # كود مشترك (مستقبلاً)
└── docs/                  # وثائق المشروع
```

## متطلبات التشغيل

- Node.js 18 أو أعلى
- MongoDB 6.0 أو أعلى
- npm أو yarn

## التثبيت والتشغيل

### 1. تثبيت التبعيات

```bash
# تثبيت تبعيات الخادم
cd server
npm install

# تثبيت تبعيات العميل
cd ../client
npm install
```

### 2. إعداد المتغيرات البيئية

```bash
# نسخ ملف البيئة المثال
cd server
cp .env.example .env

# تعديل ملف .env بإعداداتك
```

### 3. تشغيل قاعدة البيانات (MongoDB)

```bash
# باستخدام Docker
docker run -d -p 27017:27017 --name biazaai-mongo mongo:latest

# أو تشغيل MongoDB محلياً
```

### 4. تشغيل التطبيق

```bash
# تشغيل الخادم (من مجلد server)
npm run dev

# تشغيل العميل (من مجلد client)
npm start
```

سيتم تشغيل الخادم على `http://localhost:5000` والعميل على `http://localhost:3000`.

## نقاط النهاية API الرئيسية

| النقطة | الوصف |
|--------|-------|
| `POST /api/auth/register` | تسجيل مستخدم جديد |
| `POST /api/auth/login` | تسجيل الدخول |
| `POST /api/automation/whatsapp/connect` | ربط واتساب للأعمال |
| `GET /api/automation/whatsapp/qr` | توليد رمز QR للربط |
| `POST /api/ai/generate` | توليد رد ذكي باستخدام الذكاء الاصطناعي |
| `GET /api/dashboard/overview` | نظرة عامة على لوحة التحكم |
| `POST /api/automation/respond` | توليد رد آلي للرسائل الواردة |

## التكامل مع واتساب للأعمال

1. إنشاء حساب واتساب للأعمال عبر [Meta for Developers](https://developers.facebook.com/)
2. الحصول على `Phone Number ID` و `Access Token`
3. استخدام نقطة النهاية `/api/automation/whatsapp/connect` للربط
4. مسح رمز QR المولد لربط الرقم
5. البدء في تلقي الردود الآلية تلقائياً

## التكامل مع تلجرام

1. إنشاء بوت جديد عبر [BotFather](https://t.me/botfather)
2. الحصول على `Bot Token`
3. استخدام نقطة النهاية `/api/automation/telegram/connect` للربط
4. تعيين Webhook تلقائياً
5. البدء في التفاعل مع البوت

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف [LICENSE](LICENSE) للمزيد من التفاصيل.

## فريق التطوير

- **Biazaai Team** - التطوير والتصميم
- **الدعم الفني**: support@biazaai.com
- **الموقع الإلكتروني**: https://biazaai.com

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح طلب دمج (Pull Request)

## الشكر والتقدير

- [React](https://reactjs.org/) - مكتبة واجهة المستخدم
- [Express](https://expressjs.com/) - إطار عمل Node.js
- [MongoDB](https://www.mongodb.com/) - قاعدة البيانات
- [Tailwind CSS](https://tailwindcss.com/) - إطار عمل CSS
- [OpenAI](https://openai.com/) - نماذج الذكاء الاصطناعي