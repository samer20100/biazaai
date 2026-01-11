import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiZap, FiMessageSquare, FiBarChart2, FiSettings, FiUser } from 'react-icons/fi';
import { AiOutlineRobot } from 'react-icons/ai';
import { MdDashboard } from 'react-icons/md';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: <AiOutlineRobot /> },
    { name: 'الذكاء الاصطناعي', path: '/ai', icon: <AiOutlineRobot /> },
    { name: 'الأتمتة', path: '/automation', icon: <FiZap /> },
    { name: 'لوحة التحكم', path: '/dashboard', icon: <MdDashboard /> },
    { name: 'الملفات', path: '/files', icon: <FiMessageSquare /> },
    { name: 'الإعدادات', path: '/settings', icon: <FiSettings /> },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl">
              <AiOutlineRobot className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">Biazaai</h1>
              <p className="text-xs text-gray-500">منصة الذكاء الاصطناعي المتكاملة</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            <button className="btn-primary flex items-center space-x-1 space-x-reverse">
              <FiUser />
              <span>تسجيل الدخول</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-3 rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              <button className="btn-primary mt-2 py-3">تسجيل الدخول</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;