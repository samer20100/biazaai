import React, { useState } from 'react';
import { FiBarChart2, FiMessageSquare, FiUsers, FiActivity, FiCalendar, FiDownload } from 'react-icons/fi';
import { AiOutlineWhatsApp, AiOutlineTelegram } from 'react-icons/ai';
import { MdDashboard, MdTrendingUp } from 'react-icons/md';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Sample data for charts
  const lineData = {
    labels: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
    datasets: [
      {
        label: 'الرسائل الواردة',
        data: [120, 190, 300, 500, 200, 300, 450],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'الرسائل الصادرة',
        data: [80, 150, 250, 400, 180, 250, 380],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: ['واتساب', 'تلجرام', 'البريد', 'ويب'],
    datasets: [
      {
        label: 'عدد التفاعلات',
        data: [1200, 800, 300, 450],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
      },
    ],
  };

  const pieData = {
    labels: ['ردود ناجحة', 'ردود معلقة', 'أخطاء', 'غير مقروء'],
    datasets: [
      {
        data: [75, 15, 5, 5],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(156, 163, 175, 0.7)',
        ],
      },
    ],
  };

  const stats = [
    { title: 'إجمالي الرسائل', value: '٥٬٢٤٠', change: '+12%', icon: <FiMessageSquare />, color: 'bg-blue-500' },
    { title: 'المستخدمون النشطون', value: '٣٬١٥٠', change: '+8%', icon: <FiUsers />, color: 'bg-green-500' },
    { title: 'معدل الرد', value: '٩٨٪', change: '+2%', icon: <FiActivity />, color: 'bg-purple-500' },
    { title: 'وقت التشغيل', value: '٩٩٫٩٪', change: '+0.1%', icon: <MdTrendingUp />, color: 'bg-orange-500' },
  ];

  const recentActivities = [
    { channel: 'whatsapp', message: 'رسالة جديدة من +966500123456', time: 'منذ ٥ دقائق', status: 'success' },
    { channel: 'telegram', message: 'بوت تلجرام تم تحديثه', time: 'منذ ٣٠ دقيقة', status: 'info' },
    { channel: 'whatsapp', message: 'رد ذكي تم إرساله تلقائياً', time: 'منذ ساعة', status: 'success' },
    { channel: 'system', message: 'نسخة احتياطية تم إنشاؤها', time: 'منذ ٣ ساعات', status: 'warning' },
    { channel: 'telegram', message: 'مستخدم جديد انضم عبر QR', time: 'منذ ٥ ساعات', status: 'success' },
  ];

  const connectedAccounts = [
    { name: 'واتساب للأعمال', id: 'WA-789123', status: 'connected', icon: <AiOutlineWhatsApp />, messages: '١٬٢٠٠' },
    { name: 'تلجرام بوت دعم', id: 'TG-456789', status: 'connected', icon: <AiOutlineTelegram />, messages: '٨٠٠' },
    { name: 'واتساب تسويق', id: 'WA-321654', status: 'pending', icon: <AiOutlineWhatsApp />, messages: '٠' },
  ];

  const handleExport = () => {
    toast.success('جاري تحميل التقرير...');
    // In real app, would generate and download PDF/CSV
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center">
            <MdDashboard className="ml-2" />
            لوحة التحكم والتحليلات
          </h1>
          <p className="text-gray-600">نظرة شاملة على أداء الأتمتة والتفاعلات.</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse mt-4 md:mt-0">
          <select
            className="input-field w-auto"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="day">آخر 24 ساعة</option>
            <option value="week">آخر أسبوع</option>
            <option value="month">آخر شهر</option>
            <option value="year">آخر سنة</option>
          </select>
          <button onClick={handleExport} className="btn-secondary flex items-center">
            <FiDownload className="ml-2" />
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="card-glass p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} عن الفترة السابقة</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card-glass p-6">
          <h2 className="text-xl font-bold mb-4">حركة الرسائل خلال الأسبوع</h2>
          <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>
        <div className="card-glass p-6">
          <h2 className="text-xl font-bold mb-4">التفاعلات حسب القناة</h2>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="card-glass p-6">
          <h2 className="text-xl font-bold mb-4">توزيع الردود</h2>
          <div className="h-64 flex items-center justify-center">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="card-glass p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">الحسابات المدمجة</h2>
          <div className="space-y-4">
            {connectedAccounts.map((acc, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${acc.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {acc.icon}
                  </div>
                  <div className="mr-4">
                    <div className="font-semibold">{acc.name}</div>
                    <div className="text-sm text-gray-500">{acc.id}</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className={`badge ${acc.status === 'connected' ? 'badge-success' : 'badge-warning'}`}>
                    {acc.status === 'connected' ? 'متصل' : 'قيد الانتظار'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{acc.messages} رسالة</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full mt-6">إضافة قناة جديدة</button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card-glass p-6">
        <h2 className="text-xl font-bold mb-4">النشاطات الحديثة</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3">القناة</th>
                <th className="text-right py-3">الحدث</th>
                <th className="text-right py-3">الوقت</th>
                <th className="text-right py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">
                    <div className="flex items-center">
                      {activity.channel === 'whatsapp' ? (
                        <AiOutlineWhatsApp className="text-green-600 ml-2" />
                      ) : activity.channel === 'telegram' ? (
                        <AiOutlineTelegram className="text-blue-600 ml-2" />
                      ) : (
                        <FiActivity className="text-gray-600 ml-2" />
                      )}
                      <span className="capitalize">{activity.channel}</span>
                    </div>
                  </td>
                  <td className="py-3">{activity.message}</td>
                  <td className="py-3 text-gray-500">{activity.time}</td>
                  <td className="py-3">
                    <span className={`badge ${
                      activity.status === 'success' ? 'badge-success' :
                      activity.status === 'warning' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {activity.status === 'success' ? 'ناجح' : activity.status === 'warning' ? 'تحذير' : 'معلومات'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6">
          <button className="text-primary-600 hover:text-primary-800 font-semibold">
            عرض جميع النشاطات →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="card-glass p-4 text-center hover:shadow-md transition">
          <FiBarChart2 className="text-2xl mx-auto mb-2 text-primary-600" />
          <div className="font-semibold">تقرير أداء</div>
        </button>
        <button className="card-glass p-4 text-center hover:shadow-md transition">
          <FiCalendar className="text-2xl mx-auto mb-2 text-green-600" />
          <div className="font-semibold">جدولة ردود</div>
        </button>
        <button className="card-glass p-4 text-center hover:shadow-md transition">
          <FiMessageSquare className="text-2xl mx-auto mb-2 text-purple-600" />
          <div className="font-semibold">مراجعة محادثات</div>
        </button>
        <button className="card-glass p-4 text-center hover:shadow-md transition">
          <FiActivity className="text-2xl mx-auto mb-2 text-orange-600" />
          <div className="font-semibold">مراقبة النظام</div>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;