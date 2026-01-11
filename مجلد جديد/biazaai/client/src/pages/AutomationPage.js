import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiMessageSquare, FiSmartphone, FiSettings, FiCheckCircle } from 'react-icons/fi';
import { AiOutlineWhatsApp, AiOutlineTelegram } from 'react-icons/ai';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';

const AutomationPage = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [customization, setCustomization] = useState({
    welcomeMessage: 'مرحباً! كيف يمكنني مساعدتك؟',
    responseDelay: 5,
    aiEnabled: true,
    language: 'ar',
  });

  const channels = [
    {
      id: 'whatsapp',
      name: 'واتساب للأعمال',
      icon: <AiOutlineWhatsApp />,
      color: 'from-green-500 to-green-700',
      description: 'دمج واتساب للأعمال للرد الآلي على الرسائل.',
      steps: ['إنشاء حساب واتساب للأعمال', 'ربط رقم الهاتف', 'توليد QR', 'بدء الأتمتة'],
    },
    {
      id: 'telegram',
      name: 'تلجرام بوت',
      icon: <AiOutlineTelegram />,
      color: 'from-blue-500 to-cyan-500',
      description: 'إنشاء بوت تلجرام ذكي للتفاعل مع المستخدمين.',
      steps: ['إنشاء بوت عبر BotFather', 'الحصول على التوكن', 'ربط البوت', 'تكوين الردود'],
    },
  ];

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setShowQR(false);
    toast.success(`تم اختيار ${channel.name}`);
  };

  const handleGenerateQR = () => {
    if (!selectedChannel) {
      toast.error('يرجى اختيار قناة أولاً');
      return;
    }
    // Generate a dummy QR value (in real app, this would be a dynamic URL)
    const qrData = `https://biazaai.com/integrate/${selectedChannel.id}?token=${Date.now()}`;
    setQrValue(qrData);
    setShowQR(true);
    toast('تم توليد رمز QR بنجاح!', { icon: '✅' });
  };

  const handleCustomizationChange = (field, value) => {
    setCustomization({ ...customization, [field]: value });
  };

  const handleSaveConfiguration = () => {
    toast.success('تم حفظ التخصيصات بنجاح!');
    // In real app, would send to backend
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
          <FiZap className="inline ml-2" />
          أتمتة قنوات التواصل
        </h1>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto">
          ربط قنوات التواصل مثل واتساب وتلجرام بمنصتنا للرد الآلي الذكي وإدارة المحادثات تلقائياً.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Channel Selection */}
        <div className="lg:col-span-1">
          <div className="card-glass p-6">
            <h2 className="text-2xl font-bold mb-6">اختر قناة التواصل</h2>
            <div className="space-y-4">
              {channels.map((channel) => (
                <motion.button
                  key={channel.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChannelSelect(channel)}
                  className={`w-full text-right p-5 rounded-2xl border-2 transition-all ${
                    selectedChannel?.id === channel.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${channel.color} text-white text-2xl`}>
                      {channel.icon}
                    </div>
                    <div className="mr-4">
                      <div className="font-bold text-lg">{channel.name}</div>
                      <div className="text-sm text-gray-600">{channel.description}</div>
                    </div>
                  </div>
                  {selectedChannel?.id === channel.id && (
                    <div className="mt-4 text-left">
                      <div className="text-sm font-semibold mb-2">خطوات الدمج:</div>
                      <ol className="text-sm text-gray-700 space-y-1 pr-4">
                        {channel.steps.map((step, idx) => (
                          <li key={idx} className="flex items-center">
                            <FiCheckCircle className="text-green-500 ml-2" />
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
              <h3 className="font-bold mb-2 flex items-center">
                <FiSmartphone className="ml-2" />
                نصائح قبل البدء
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• تأكد من امتلاك حساب أعمال نشط على واتساب.</li>
                <li>• بالنسبة لتلجرام، تحتاج إلى إنشاء بوت عبر BotFather أولاً.</li>
                <li>• حفظ التوكنات في مكان آمن.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Panel - Customization */}
        <div className="lg:col-span-2">
          <div className="card-glass p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">تخصيص الردود الآلية</h2>
            {selectedChannel ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">رسالة الترحيب</label>
                    <textarea
                      className="input-field h-32"
                      value={customization.welcomeMessage}
                      onChange={(e) => handleCustomizationChange('welcomeMessage', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">تأخير الرد (ثواني)</label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={customization.responseDelay}
                      onChange={(e) => handleCustomizationChange('responseDelay', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center mt-2">
                      <span className="font-bold">{customization.responseDelay}</span> ثانية
                    </div>

                    <label className="block text-gray-700 mt-6 mb-2">لغة الردود</label>
                    <select
                      className="input-field"
                      value={customization.language}
                      onChange={(e) => handleCustomizationChange('language', e.target.value)}
                    >
                      <option value="ar">العربية</option>
                      <option value="en">الإنجليزية</option>
                      <option value="fr">الفرنسية</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex items-center">
                  <input
                    type="checkbox"
                    id="aiEnabled"
                    checked={customization.aiEnabled}
                    onChange={(e) => handleCustomizationChange('aiEnabled', e.target.checked)}
                    className="w-5 h-5 ml-2"
                  />
                  <label htmlFor="aiEnabled" className="text-gray-700">
                    تفعيل الذكاء الاصطناعي للردود الذكية
                  </label>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button onClick={handleSaveConfiguration} className="btn-primary">
                    <FiSettings className="inline ml-2" />
                    حفظ التخصيصات
                  </button>
                  <button onClick={handleGenerateQR} className="btn-secondary">
                    توليد رمز QR
                  </button>
                  <Link to={`/integration/${selectedChannel.id}`} className="btn-secondary">
                    <FiMessageSquare className="inline ml-2" />
                    تدفق الدمج الكامل
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiZap className="text-6xl mx-auto mb-4 text-gray-300" />
                <p className="text-xl">يرجى اختيار قناة تواصل من اليسار لبدء التخصيص.</p>
              </div>
            )}
          </div>

          {/* QR Code Panel */}
          {showQR && selectedChannel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glass p-6"
            >
              <h2 className="text-2xl font-bold mb-4">رمز الربط السريع (QR Code)</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                  <QRCode value={qrValue} size={200} />
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold mb-2">كيفية الربط:</h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <div className="bg-primary-100 text-primary-800 w-8 h-8 rounded-full flex items-center justify-center ml-3">١</div>
                      <span>افتح تطبيق {selectedChannel.name} على هاتفك.</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-primary-100 text-primary-800 w-8 h-8 rounded-full flex items-center justify-center ml-3">٢</div>
                      <span>اذهب إلى إعدادات الحساب / الأجهزة المرتبطة.</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-primary-100 text-primary-800 w-8 h-8 rounded-full flex items-center justify-center ml-3">٣</div>
                      <span>امسح رمز QR هذا باستخدام الكاميرا.</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-primary-100 text-primary-800 w-8 h-8 rounded-full flex items-center justify-center ml-3">٤</div>
                      <span>ستتم إعادة توجيهك تلقائياً إلى لوحة التحكم.</span>
                    </li>
                  </ol>
                  <div className="mt-6">
                    <button
                      onClick={() => navigator.clipboard.writeText(qrValue).then(() => toast.success('تم نسخ الرابط!'))}
                      className="btn-secondary"
                    >
                      نسخ رابط الربط
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-8 text-center">
          <div className="text-4xl font-bold text-green-600">٥٠٠+</div>
          <div className="text-gray-600">قناة واتساب مدمجة</div>
        </div>
        <div className="card-glass p-8 text-center">
          <div className="text-4xl font-bold text-blue-600">٣٠٠+</div>
          <div className="text-gray-600">بوت تلجرام نشط</div>
        </div>
        <div className="card-glass p-8 text-center">
          <div className="text-4xl font-bold text-accent-600">٩٩٪</div>
          <div className="text-gray-600">رضى العملاء</div>
        </div>
      </div>
    </div>
  );
};

export default AutomationPage;