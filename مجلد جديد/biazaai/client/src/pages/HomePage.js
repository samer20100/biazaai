import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiMessageSquare, FiBarChart2, FiFileText, FiGlobe, FiShield } from 'react-icons/fi';
import { AiOutlineRobot, AiOutlineCloudUpload } from 'react-icons/ai';
import { MdOutlineIntegrationInstructions } from 'react-icons/md';
import { motion } from 'framer-motion';

const HomePage = () => {
  const features = [
    {
      icon: <AiOutlineRobot />,
      title: 'ذكاء اصطناعي متقدم',
      description: 'بحث ذكي وردود معقدة مدعومة بأحدث نماذج الذكاء الاصطناعي.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FiZap />,
      title: 'أتمتة قنوات التواصل',
      description: 'دمج واتساب وتلجرام للرد الآلي وإدارة المحادثات تلقائياً.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FiFileText />,
      title: 'إنشاء المحتوى',
      description: 'إنشاء نصوص، صور، ومقاطع فيديو بلمسة واحدة باستخدام الذكاء الاصطناعي.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <AiOutlineCloudUpload />,
      title: 'إدارة الملفات',
      description: 'رفع، معالجة، وتنظيم الملفات والصور بسهولة وأمان.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <FiBarChart2 />,
      title: 'تحليلات متقدمة',
      description: 'لوحة تحكم شاملة مع رسوم بيانية تفاعلية لتتبع الأداء.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: <FiShield />,
      title: 'أمان وحماية',
      description: 'تشفير متقدم وحماية للبيانات وفق أعلى المعايير العالمية.',
      color: 'from-gray-700 to-gray-900',
    },
  ];

  const steps = [
    { number: '١', text: 'اختر قناة التواصل (واتساب / تلجرام)' },
    { number: '٢', text: 'خصص إعدادات الرد الآلي' },
    { number: '٣', text: 'امسح رمز الاستجابة السريعة (QR)' },
    { number: '٤', text: 'استمتع بالأتمتة الكاملة!' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-gradient">Biazaai</span> – منصة الذكاء الاصطناعي المتكاملة
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            حلول ذكية تجمع بين قوة الذكاء الاصطناعي وأتمتة قنوات التواصل لتحويل عملك إلى تجربة ذكية بالكامل.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 space-x-reverse">
            <Link to="/automation" className="btn-primary text-lg px-8 py-4">
              <FiZap className="inline ml-2" />
              ابدأ بالأتمتة الآن
            </Link>
            <Link to="/ai" className="btn-secondary text-lg px-8 py-4">
              <AiOutlineRobot className="inline ml-2" />
              استكشف الذكاء الاصطناعي
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">مميزات المنصة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card-glass p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feat.color} text-white text-3xl mb-4`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                <p className="text-gray-600">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Flow */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">أتمتة قنوات التواصل في ٤ خطوات</h2>
              <p className="text-gray-700 mb-8">
                ربط واتساب أو تلجرام بمنصتنا أصبح أسهل من أي وقت مضى. فقط اتبع الخطوات البسيطة وتمتع بالردود الآلية الذكية.
              </p>
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{step.text}</h4>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/automation" className="btn-primary mt-8 inline-flex items-center">
                <MdOutlineIntegrationInstructions className="ml-2" />
                ابدأ عملية الدمج الآن
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-primary-400 to-accent-500 rounded-3xl shadow-2xl flex items-center justify-center">
                  <FiMessageSquare className="text-white text-8xl" />
                </div>
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-700">QR</div>
                    <p className="text-sm text-gray-600">مسح سريع</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-48 h-32 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/30">
                  <div className="flex items-center">
                    <FiBarChart2 className="text-green-600 text-2xl ml-2" />
                    <div>
                      <div className="font-bold">٩٨٪</div>
                      <div className="text-xs text-gray-500">معدل النجاح</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">جاهز لتحويل عملك إلى الذكاء الاصطناعي؟</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            انضم إلى آلاف العملاء الذين يستخدمون Biazaai لتعزيز إنتاجيتهم وأتمتة تواصلهم.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 space-x-reverse">
            <button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition">
              جرب مجاناً لمدة ١٤ يوم
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg text-lg transition">
              طلب عرض خاص
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;