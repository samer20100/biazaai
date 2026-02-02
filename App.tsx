
import React, { useState, useEffect } from 'react';
import { View, Message, User, AutomationState, AIChat } from './types';
import { sendMessageStream, generateImage } from './services/deepseekService';
import { saveAIChat, getUserAIChats, getLocalChats, saveLocalChat } from './services/apiService';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import SettingsView from './components/SettingsView';
import AppsView from './components/AppsView';
import AuthView from './components/AuthView';
import AutomationConfigView from './components/AutomationConfigView';
import AutomationDashboardView from './components/AutomationDashboardView';
import AdminLoginView from './components/AdminLoginView';
import AdminView from './components/AdminView';
import DonationView from './components/DonationView';
import { adminLogin } from './services/apiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ email: 'samer@gmail.com', name: 'Samer', isLoggedIn: true, isSubscribed: false });
  const [currentView, setCurrentView] = useState<View>(View.CHAT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  const [automation, setAutomation] = useState<AutomationState>({
    platform: null,
    step: 1,
    config: {
      name: '',
      role: 'customer_service',
      businessType: '',
      pricing: '',
      instructions: '',
      tone: 'friendly',
      status: 'disconnected'
    }
  });
  const [chats, setChats] = useState<AIChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // استعادة الحالة من localStorage عند التحميل الأول
  useEffect(() => {
    const savedUser = localStorage.getItem('biazaai_user');
    const savedView = localStorage.getItem('biazaai_currentView');
    const savedMessages = localStorage.getItem('biazaai_messages');
    const savedLanguage = localStorage.getItem('biazaai_language');
    const savedTheme = localStorage.getItem('biazaai_theme');
    const savedAutomation = localStorage.getItem('biazaai_automation');
    const savedCurrentChatId = localStorage.getItem('biazaai_currentChatId');
    const savedAdminToken = localStorage.getItem('admin_token');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // التأكد من وجود isSubscribed
        if (parsedUser.isSubscribed === undefined) parsedUser.isSubscribed = false;
        setUser(parsedUser);
      } catch (e) {}
    }
    if (savedView && Object.values(View).includes(savedView as View)) {
      setCurrentView(savedView as View);
    }
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {}
    }
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguage(savedLanguage as 'ar' | 'en');
    }
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
      setTheme(savedTheme as 'light' | 'dark' | 'system');
    }
    if (savedAutomation) {
      try {
        const parsed = JSON.parse(savedAutomation);
        // التأكد من أن الحقول المطلوبة موجودة
        if (parsed.platform !== undefined) {
          setAutomation(parsed);
        }
      } catch (e) {}
    }
    if (savedCurrentChatId) {
      try {
        const parsed = JSON.parse(savedCurrentChatId);
        if (typeof parsed === 'number') {
          setCurrentChatId(parsed);
        }
      } catch (e) {}
    }
    if (savedAdminToken) {
      setAdminToken(savedAdminToken);
    }
  }, []);

  // جلب محادثات المستخدم من localStorage عند تغيير البريد الإلكتروني
  useEffect(() => {
    if (user.isLoggedIn && user.email) {
      const result = getLocalChats(user.email);
      if (result.success && result.chats) {
        setChats(result.chats);
      } else {
        console.error('Failed to load local chats:', result.error);
      }
    }
  }, [user.email, user.isLoggedIn]);

  // حفظ الحالة في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem('biazaai_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('biazaai_currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('biazaai_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('biazaai_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('biazaai_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('biazaai_automation', JSON.stringify(automation));
  }, [automation]);

  useEffect(() => {
    localStorage.setItem('biazaai_currentChatId', JSON.stringify(currentChatId));
  }, [currentChatId]);

  useEffect(() => {
    const root = window.document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && systemDark);
    
    root.classList.toggle('dark', isDark);
    root.style.backgroundColor = isDark ? '#000' : '#fff';
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('lang', language);
  }, [theme, language]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newUserMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    if (isImageMode) {
      const imageUrl = await generateImage(text);
      setMessages(prev => [...prev, { role: 'model', text: language === 'ar' ? "تفضل، صورتك جاهزة" : "Your image is ready", isImage: true, imageUrl: imageUrl || "" }]);
      setIsTyping(false);
    } else {
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]);
      
      await sendMessageStream(text, messages, (chunk) => {
        fullResponse = chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullResponse;
          return updated;
        });
        setIsTyping(false);
      }, undefined);

      // بعد اكتمال الرد، حفظ المحادثة في localStorage
      const allMessages = [...messages, newUserMessage, { role: 'model', text: fullResponse }];
      // إذا كان هناك currentChatId، نستخدمه لتحديث المحادثة الحالية، وإلا ننشئ محادثة جديدة
      const result = saveLocalChat(user.email, automation.sessionId?.toString() || null, allMessages, undefined, currentChatId || undefined);
      if (result.success) {
        console.log('AI chat saved locally');
        // إذا كان currentChatId فارغاً، نضبطه على chatId الجديد
        if (!currentChatId && result.chatId) {
          setCurrentChatId(result.chatId);
        }
        // إعادة تحميل قائمة المحادثات من localStorage
        const loadResult = getLocalChats(user.email);
        if (loadResult.success && loadResult.chats) {
          setChats(loadResult.chats);
        }
      } else {
        console.error('Failed to save local chat:', result.error);
      }
    }
  };

  const handleLoadChat = (chat: AIChat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setCurrentView(View.CHAT);
    setIsImageMode(false);
  };

  const handleAdminLogin = async (username: string, password: string) => {
    const result = await adminLogin(username, password);
    if (result.success && result.token) {
      setAdminToken(result.token);
      localStorage.setItem('admin_token', result.token);
      setCurrentView(View.ADMIN);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('admin_token');
    setCurrentView(View.CHAT);
  };

  const handleSubscribe = () => {
    // تحديث حالة المستخدم إلى مشترك
    const updatedUser = { ...user, isSubscribed: true };
    setUser(updatedUser);
    // حفظ في localStorage
    localStorage.setItem('biazaai_user', JSON.stringify(updatedUser));
  };

  return (
    <div className={`flex h-screen w-full transition-colors duration-500 ${theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'} overflow-hidden font-sans`}>
      {/* Sidebar - Mobile Responsive */}
      <div className={`fixed inset-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-72 ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="relative h-full w-72 lg:w-full">
          <Sidebar
            user={user}
            onClose={() => setIsSidebarOpen(false)}
            onNavigate={(v) => { setCurrentView(v); setIsSidebarOpen(false); }}
            onNewChat={() => { setMessages([]); setCurrentChatId(null); setIsImageMode(false); setCurrentView(View.CHAT); setIsSidebarOpen(false); }}
            onImageMode={() => { setMessages([]); setCurrentChatId(null); setIsImageMode(true); setCurrentView(View.CHAT); setIsSidebarOpen(false); }}
            onAppsMode={() => { setCurrentView(View.APPS); setIsSidebarOpen(false); }}
            lang={language}
            chats={chats}
            onLoadChat={handleLoadChat}
          />
        </div>
      </div>

      <div className={`flex-1 flex flex-col relative h-full ${currentView === View.DONATION ? 'overflow-y-auto' : ''}`}>
        {currentView === View.CHAT && (
          <ChatView 
            user={user} messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping}
            onOpenSidebar={() => setIsSidebarOpen(true)} onOpenUpgrade={() => setCurrentView(View.DONATION)}
            onAuthRequired={() => setCurrentView(View.AUTH)} isImageMode={isImageMode} lang={language}
          />
        )}
        {currentView === View.APPS && (
          <AppsView
            onBack={() => setCurrentView(View.CHAT)}
            onStartAutomation={(p) => {
              setAutomation({...automation, platform: p, step: 1});
              setCurrentView(View.AUTOMATION_CONFIG);
            }}
            onOpenDashboard={() => {
              // استعادة sessionId من localStorage
              const savedSessionId = localStorage.getItem('whatsappSessionId');
              const savedStatus = localStorage.getItem('whatsappSessionStatus');
              if (savedSessionId) {
                setAutomation(prev => ({
                  ...prev,
                  platform: 'whatsapp',
                  sessionId: parseInt(savedSessionId, 10),
                  config: { ...prev.config, status: savedStatus === 'connected' ? 'connected' : 'disconnected' }
                }));
              }
              setCurrentView(View.AUTOMATION_DASHBOARD);
            }}
            lang={language}
          />
        )}
        {currentView === View.AUTOMATION_CONFIG && (
          <AutomationConfigView
            state={automation}
            onUpdate={(u) => setAutomation({...automation, ...u})}
            onComplete={() => {
              setAutomation(prev => ({...prev, config: {...prev.config, status: 'connected'}}));
              // حفظ sessionId في localStorage للاستخدام لاحقاً
              if (automation.sessionId) {
                localStorage.setItem('whatsappSessionId', automation.sessionId.toString());
                localStorage.setItem('whatsappSessionStatus', 'connected');
              }
              setCurrentView(View.AUTOMATION_DASHBOARD);
            }}
            onBack={() => setCurrentView(View.APPS)}
          />
        )}
        {currentView === View.AUTOMATION_DASHBOARD && (
          <AutomationDashboardView 
            state={automation} 
            onBack={() => setCurrentView(View.APPS)} 
            onEdit={() => {
              setAutomation(prev => ({...prev, step: 1}));
              setCurrentView(View.AUTOMATION_CONFIG);
            }}
            onPause={() => setAutomation(prev => ({
              ...prev, 
              config: {...prev.config, status: prev.config.status === 'connected' ? 'disconnected' : 'connected'}
            }))}
          />
        )}
        {currentView === View.SETTINGS && (
          <SettingsView
            user={user}
            theme={theme}
            lang={language}
            onUpdateUser={(u) => setUser({...user, ...u})}
            onSetTheme={setTheme}
            onSetLang={setLanguage}
            onLogout={() => { setUser({email:'', name:'', isLoggedIn:false}); setCurrentView(View.CHAT); }}
            onBack={() => setCurrentView(View.CHAT)}
            onNavigate={setCurrentView}
          />
        )}
        {currentView === View.AUTH && <AuthView onLogin={(e, n) => { setUser({email: e, name: n, isLoggedIn: true}); setCurrentView(View.CHAT); }} onBack={() => setCurrentView(View.CHAT)} />}
        {currentView === View.ADMIN_LOGIN && (
          <AdminLoginView
            onLogin={handleAdminLogin}
            onBack={() => setCurrentView(View.CHAT)}
            lang={language}
          />
        )}
        {currentView === View.ADMIN && (
          <AdminView
            onLogout={handleAdminLogout}
            onBack={() => setCurrentView(View.CHAT)}
            lang={language}
          />
        )}
        {currentView === View.DONATION && (
          <DonationView
            onBack={() => setCurrentView(View.CHAT)}
            lang={language}
            userEmail={user.email}
          />
        )}
      </div>
    </div>
  );
};

export default App;
