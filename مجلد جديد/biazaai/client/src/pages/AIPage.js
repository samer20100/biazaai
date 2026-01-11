import React, { useState } from 'react';
import { FiSearch, FiFileText, FiImage, FiVideo, FiCode, FiDownload } from 'react-icons/fi';
import { AiOutlineRobot, AiOutlineThunderbolt } from 'react-icons/ai';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AIPage = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState('search');

  const tools = [
    { id: 'search', name: 'بحث ذكي', icon: <FiSearch />, color: 'bg-blue-500' },
    { id: 'content', name: 'إنشاء محتوى', icon: <FiFileText />, color: 'bg-green-500' },
    { id: 'image', name: 'إنشاء صور', icon: <FiImage />, color: 'bg-purple-500' },
    { id: 'video', name: 'إنشاء فيديو', icon: <FiVideo />, color: 'bg-red-500' },
    { id: 'code', name: 'كتابة كود', icon: <FiCode />, color: 'bg-yellow-500' },
    { id: 'analysis', name: 'تحليل بيانات', icon: <AiOutlineThunderbolt />, color: 'bg-indigo-500' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('يرجى إدخال نص للبحث أو الإنشاء');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse(`هذا رد ذكي من الذكاء الاصطناعي بناءً على طلبك: "${query}". يمكن للذكاء الاصطناعي تقديم إجابات معقدة، إنشاء محتوى مخصص، وتحليل البيانات بطرق مبتكرة. هذه مجرد محاكاة للواجهة، وفي النسخة الكاملة ستكون متصلة بنماذج حقيقية مثل GPT-4 أو Claude.`);
      setLoading(false);
      toast.success('تم إنشاء الرد بنجاح!');
    }, 1500);
  };

  const handleClear = () => {
    setQuery('');
    setResponse('');
  };

  const handleDownload = () => {
    toast('سيتم تنزيل الملف في النسخة الكاملة', { icon: '📥' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">الذكاء الاصطناعي المتقدم</h1>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto">
          استخدم أحدث نماذج الذكاء الاصطناعي للبحث، إنشاء المحتوى، معالجة الصور، وأكثر من ذلك.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Tools */}
        <div className="lg:col-span-1">
          <div className="card-glass p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AiOutlineRobot className="ml-2" />
              أدوات الذكاء الاصطناعي
            </h2>
            <div className="space-y-3">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full flex items-center p-4 rounded-xl transition-all ${
                    selectedTool === tool.id
                      ? 'bg-primary-50 border-r-4 border-primary-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`${tool.color} text-white p-3 rounded-lg`}>
                    {tool.icon}
                  </div>
                  <div className="mr-4 text-right">
                    <div className="font-semibold">{tool.name}</div>
                    <div className="text-sm text-gray-500">أداة متقدمة</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-primary-100 to-accent-100 rounded-xl">
              <h3 className="font-bold mb-2">نصائح سريعة</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• استخدم لغة واضحة ومحددة للحصول على نتائج أفضل.</li>
                <li>• يمكنك طلب إنشاء محتوى بطول معين.</li>
                <li>• جرب أدوات متعددة لتحقيق أقصى استفادة.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Panel - Input/Output */}
        <div className="lg:col-span-2">
          <div className="card-glass p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">تفاعل مع الذكاء الاصطناعي</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">أدخل طلبك أو سؤالك</label>
                <textarea
                  className="input-field h-40"
                  placeholder="مثال: اكتب مقالاً عن فوائد الذكاء الاصطناعي في الأعمال الحديثة..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></span>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <AiOutlineRobot className="inline ml-2" />
                      توليد الرد
                    </>
                  )}
                </button>
                <button type="button" onClick={handleClear} className="btn-secondary">
                  مسح الكل
                </button>
                <button type="button" onClick={handleDownload} className="btn-secondary">
                  <FiDownload className="inline ml-2" />
                  تنزيل النتيجة
                </button>
              </div>
            </form>
          </div>

          {/* Response Area */}
          <div className="card-glass p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">النتيجة</h2>
              <div className="badge badge-success">ذكاء اصطناعي</div>
            </div>
            {response ? (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 whitespace-pre-line">
                {response}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <AiOutlineRobot className="text-6xl mx-auto mb-4 text-gray-300" />
                <p>سيظهر رد الذكاء الاصطناعي هنا بعد إدخال طلبك.</p>
              </div>
            )}

            {/* Sample Outputs */}
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4">نماذج من إبداعات الذكاء الاصطناعي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="font-semibold mb-2">نص إنشائي</div>
                  <p className="text-sm text-gray-600">"الذكاء الاصطناعي ليس مجرد تقنية، بل هو ثورة تعيد تشكيل المستقبل..."</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="font-semibold mb-2">كود برمجي</div>
                  <pre className="text-sm bg-gray-900 text-gray-100 p-2 rounded overflow-x-auto">
{`function automateResponse(message) {
  return ai.generate(message);
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="card-glass p-6 text-center">
          <div className="text-3xl font-bold text-primary-600">٩٨٪</div>
          <div className="text-gray-600">دقة النتائج</div>
        </div>
        <div className="card-glass p-6 text-center">
          <div className="text-3xl font-bold text-green-600">٥٠+</div>
          <div className="text-gray-600">نموذج ذكاء اصطناعي</div>
        </div>
        <div className="card-glass p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">١٠٠٠+</div>
          <div className="text-gray-600">مستخدم نشط</div>
        </div>
        <div className="card-glass p-6 text-center">
          <div className="text-3xl font-bold text-accent-600">٢٤/٧</div>
          <div className="text-gray-600">دعم وتطوير</div>
        </div>
      </div>
    </div>
  );
};

export default AIPage;