import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineRobot } from 'react-icons/ai';
import { FiFacebook, FiTwitter, FiLinkedin, FiGithub, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <AiOutlineRobot className="text-3xl text-accent-400" />
              <h2 className="text-2xl font-bold">Biazaai</h2>
            </div>
            <p className="text-gray-300">
              منصة ذكاء اصطناعي متكاملة تقدم حلولاً مبتكرة للأتمتة، إنشاء المحتوى، وإدارة قنوات التواصل.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiGithub size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition">الرئيسية</Link></li>
              <li><Link to="/ai" className="text-gray-300 hover:text-white transition">الذكاء الاصطناعي</Link></li>
              <li><Link to="/automation" className="text-gray-300 hover:text-white transition">الأتمتة</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-white transition">لوحة التحكم</Link></li>
              <li><Link to="/files" className="text-gray-300 hover:text-white transition">إدارة الملفات</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الخدمات</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition">أتمتة واتساب</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">أتمتة تلجرام</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">إنشاء المحتوى</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">تحليل البيانات</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">إدارة الملفات</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">اتصل بنا</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">الرياض، المملكة العربية السعودية</li>
              <li className="text-gray-300">info@biazaai.com</li>
              <li className="text-gray-300">+966 12 345 6789</li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">اشترك في النشرة البريدية</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-grow px-4 py-2 rounded-r-lg text-gray-900 outline-none"
                />
                <button className="bg-accent-600 hover:bg-accent-700 px-4 py-2 rounded-l-lg font-semibold transition">
                  اشتراك
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>© {currentYear} Biazaai. جميع الحقوق محفوظة. | <a href="#" className="hover:text-white transition">سياسة الخصوصية</a> | <a href="#" className="hover:text-white transition">شروط الاستخدام</a></p>
          <p className="mt-2 text-sm">تم التطوير بكل ❤️ لفريق Biazaai</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;