<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BiazaAI - الذكاء الاصطناعي العربي المتقدم

نظام ذكاء اصطناعي متكامل يدعم اللغة العربية مع واجهة محادثة ذكية وأتمتة WhatsApp Business.

## الميزات الرئيسية

- **محادثة ذكية بالعربية**: استخدام DeepSeek Chat API لإنشاء ردود ذكية وسياقية.
- **أتمتة WhatsApp Business**: ربط حساب WhatsApp Business مع النظام لإنشاء مساعد ذكي آلي.
- **تخصيص كامل**: إعداد هوية المساعد (الاسم، الدور، نوع المشروع، الأسعار، التعليمات).
- **رمز QR حقيقي**: مسح رمز QR عبر WhatsApp للربط التلقائي.
- **ردود مخصصة**: توليد ردود ذكية بناءً على تكوين المستخدم المخزن في قاعدة البيانات.
- **إخفاء أدوات المطور**: حماية الواجهة من فحص أدوات المطور في المتصفح.
- **خادم خلفي قوي**: Node.js + Express + Socket.io + SQLite.
- **حفظ المحادثات محلياً**: حفظ محادثات الدردشة في localStorage بشكل منفصل لكل مستخدم، مع عرضها في الشريط الجانبي.
- **باقة اشتراك Biaza Pro**: اشتراك لمدة 3 أشهر بسعر 25 دولار يشمل دعم فني مخصص، استخدام غير محدود، WhatsApp Business غير محدود، Telegram Bot غير محدود.

## هيكل المشروع

```
biazaai---advanced-arabic-ai/
├── components/          # مكونات React للواجهة الأمامية
├── services/           # خدمات الواجهة (DeepSeek، Socket، API)
├── server/             # خادم Backend
│   ├── db/            # قاعدة بيانات SQLite
│   └── services/      # خدمات الخادم (WhatsApp، الذكاء الاصطناعي)
├── public/             # أصول ثابتة
└── index.html          # نقطة الدخول
```

## المتطلبات

- Node.js (الإصدار 18 أو أعلى)
- npm أو yarn

## التشغيل محلياً

1. **تثبيت الاعتماديات**:
   ```bash
   npm install
   cd server && npm install
   ```

2. **تكوين المفاتيح**:
   - أنشئ ملف `.env.local` في المجلد الرئيسي وأضف:
     ```
     DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - (اختياري) يمكنك تعديل `server/.env` لإعدادات الخادم.

3. **تشغيل الخادم الخلفي**:
   ```bash
   cd server
   node index.js
   ```
   سيعمل الخادم على `http://localhost:5000`.

4. **تشغيل الواجهة الأمامية**:
   ```bash
   npm run dev
   ```
   ستعمل الواجهة على `http://localhost:3001`.

5. **استخدام النظام**:
   - افتح `http://localhost:3001` في المتصفح.
   - انتقل إلى "إعداد أتمتة BiazaAI" من القائمة الجانبية.
   - اتبع الخطوات لإعداد التكوين وربط WhatsApp.

## تفاصيل تقنية

### الذكاء الاصطناعي
- تم استبدال Google Gemini بـ **DeepSeek Chat** باستخدام مفتاح API المقدم.
- الخدمة: `services/deepseekService.ts` (للويب) و `server/services/aiService.js` (للخادم).

### أتمتة WhatsApp
- استخدام مكتبة `whatsapp-web.js` مع `puppeteer`.
- توليد رمز QR حقيقي وعرضه في الواجهة عبر Socket.io.
- ربط الجلسة بـ `sessionId` لضمان استرجاع التكوين الصحيح لكل مستخدم.

### قاعدة البيانات
- SQLite مع جدول `automation_sessions` لتخزين التكوين وحالة الجلسات.
- جدول `ai_chats` لحفظ محادثات الذكاء الاصطناعي (اختياري، يمكن استخدام localStorage بدلاً منه).

### حفظ المحادثات محلياً (LocalStorage)
- يتم حفظ محادثات الدردشة مع الذكاء الاصطناعي في `localStorage` تحت مفتاح `biazaai_chats_${userEmail}`.
- كل محادثة تحتوي على `id`، `title`، `messages`، `createdAt`، `updatedAt`.
- المحادثات منفصلة لكل مستخدم ولا تشارك بين المستخدمين.
- يتم عرض المحادثات المحفوظة في الشريط الجانبي مع إمكانية تحميلها.
- الوظائف المساعدة موجودة في `services/apiService.ts` (`getLocalChats`، `saveLocalChat`، `deleteLocalChat`).

### الأمان
- إخفاء أدوات المطور في المتصفح (منع النقر الأيمن، F12، Ctrl+Shift+I).
- CORS مضبوط للواجهة الأمامية (`http://localhost:3001`).

## مرجع API

### نقاط نهاية REST (الخادم الخلفي)

جميع المسارات تبدأ بـ `http://localhost:5000/api`.

#### `GET /api/health`
- **الوصف**: التحقق من صحة الخادم.
- **الرد**: `{ "status": "ok", "message": "BiazaAI Backend is running" }`

#### `POST /api/automation/save`
- **الوصف**: حفظ تكوين الأتمتة في قاعدة البيانات.
- **الجسم**:
  ```json
  {
    "userId": "string",
    "platform": "whatsapp",
    "config": {
      "name": "string",
      "role": "string",
      "businessType": "string",
      "pricing": "string",
      "instructions": "string",
      "tone": "formal|friendly|professional"
    }
  }
  ```
- **الرد**: `{ "success": true, "sessionId": number }` أو `{ "success": false, "error": "string" }`

#### `POST /api/automation/start`
- **الوصف**: بدء جلسة WhatsApp (تحديث حالة الجلسة إلى `connecting`).
- **الجسم**: `{ "sessionId": number }`
- **الرد**: `{ "success": true, "message": "Session started" }`

#### `GET /api/automation/status/:sessionId`
- **الوصف**: الحصول على حالة الجلسة وتفاصيلها.
- **الرد**: `{ "success": true, "session": { ... } }`

### أحداث Socket.io

الخادم يستخدم Socket.io للاتصال في الوقت الحقيقي مع الواجهة الأمامية.

- **الاتصال**: `io.connect('http://localhost:5000')`
- **الأحداث الصادرة من الخادم**:
  - `whatsapp_qr`: يحتوي على `{ qr: "string" }` عند توليد رمز QR.
  - `whatsapp_loading`: `{ percent: number, message: string }` أثناء تحميل جلسة WhatsApp.
  - `whatsapp_ready`: `{ message: "..." }` عند جاهزية العميل.
  - `whatsapp_error`: `{ error: "..." }` عند حدوث خطأ.
  - `whatsapp_message`: `{ from: string, body: string, timestamp: number }` عند استلام رسالة.
- **الأحداث الواردة إلى الخادم**:
  - `start_whatsapp_session`: `{ userId: string, sessionId: string }` لبدء جلسة جديدة.
  - `whatsapp_qr_scanned`: `{ sessionId: string }` عند مسح رمز QR.

### خدمات الواجهة الأمامية

- `services/deepseekService.ts`: خدمة DeepSeek مع دفق الردود.
- `services/socketService.ts`: إدارة اتصال Socket.io.
- `services/apiService.ts`: وظائف مساعدة للاتصال بـ REST API.

## لوحة التحكم الإدارية (للمشرفين فقط)

تم إضافة لوحة تحكم إدارية متكاملة وآمنة حصرياً للمشرفين مع الميزات التالية:

### الميزات
- **نظام مصادقة آمن**: تسجيل دخول المشرفين عبر اسم مستخدم وكلمة مرور (افتراضي: `admin` / `admin123`).
- **إدارة مفاتيح API**: تعديل مفتاح DeepSeek API وتخزينه في `localStorage` للتطبيق على النظام بأكمله.
- **لوحة تحكم تفاعلية في الوقت الحقيقي**:
  - إحصائيات الزيارات (زيادة عشوائية كل 10 ثوانٍ).
  - تسجيلات دخول اليوم.
  - عدد المعاملات المكتملة.
  - قائمة آخر تسجيلات الدخول.
- **إدارة المستخدمين**: عرض جدول المستخدمين مع حالة الاشتراك وإجراءات التعديل.
- **سجل المعاملات**: عرض جميع المعاملات المالية من بوابة الدفع المخصصة مع تفاصيل (المبلغ، الحالة، التاريخ).
- **بوابة دفع مخصصة (yadfe‑yad sandbox)**:
  - معالجة بطاقات الائتمان (اختبارية).
  - تخزين المعاملات في جدول `transactions` في قاعدة البيانات.
  - إرسال بيانات المعاملة إلى لوحة التحكم الإدارية.

### طريقة الوصول
1. **تسجيل دخول المشرفين**:
   - انتقل إلى الإعدادات (Settings) → قسم "الإدارة" → انقر على "لوحة التحكم الإدارية".
   - إذا لم يكن لديك token، سيتم توجيهك إلى صفحة تسجيل دخول المشرفين.
   - أدخل بيانات الدخول الافتراضية:
     - **اسم المستخدم**: `admin`
     - **كلمة المرور**: `admin123`
   - بعد المصادقة الناجحة، سيتم حفظ token في `localStorage` وتوجيهك إلى لوحة التحكم.

2. **الرابط المباشر**:
   - يمكن الوصول إلى صفحة تسجيل دخول المشرفين عبر `http://localhost:3001/#admin-login` (إذا تم دعمه).
   - يمكن الوصول إلى لوحة التحكم مباشرة عبر `http://localhost:3001/#admin` (بعد تسجيل الدخول).

### نقاط نهاية API الجديدة
- `POST /api/admin/login` – تسجيل دخول المشرفين (يرجع token).
- `GET /api/transactions` – جلب قائمة المعاملات (يتطلب token مشرف).
- `POST /api/transactions` – إنشاء معاملة جديدة (من بوابة الدفع).

### الأمان
- جميع نقاط نهاية المشرفين محمية بـ middleware `authenticateAdmin` الذي يتحقق من `x-admin-token` في رؤوس الطلب.
- يتم تخزين token في `localStorage` ولا يتم إرساله عبر قنوات غير آمنة.
- تم تشفير البيانات الحساسة (مثل أرقام البطاقات) قبل التخزين.

## التطوير المستقبلي

- إضافة دعم لمنصات أخرى (Telegram، Messenger).
- تحسين واجهة إدارة الجلسات.
- إضافة تحليلات وإحصائيات.
- دعم multi‑tenant.
- إضافة webhooks للدفع وإشعارات البريد الإلكتروني.

## الرخصة

هذا المشروع مرخص تحت رخصة MIT.
