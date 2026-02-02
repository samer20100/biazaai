
export enum View {
  CHAT = 'CHAT',
  SIDEBAR = 'SIDEBAR',
  SETTINGS = 'SETTINGS',
  APPS = 'APPS',
  AUTH = 'AUTH',
  AUTOMATION_CONFIG = 'AUTOMATION_CONFIG',
  AUTOMATION_DASHBOARD = 'AUTOMATION_DASHBOARD',
  ADMIN = 'ADMIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  DONATION = 'DONATION'
}

export interface User {
  email: string;
  name: string;
  isLoggedIn: boolean;
  isSubscribed?: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isImage?: boolean;
  imageUrl?: string;
  fileName?: string;
}

export interface AutomationState {
  platform: 'whatsapp' | 'telegram' | null;
  step: number;
  sessionId?: number;
  config: {
    name: string;
    role: string;
    businessType: string;
    pricing: string;
    instructions: string;
    tone: 'formal' | 'friendly' | 'professional';
    responseSize: 'small' | 'medium' | 'large';
    workingHours: string;
    workingDays: string;
    contactPhone: string;
    contactTikTok: string;
    contactInstagram: string;
    contactFacebook: string;
    contactOther: string;
    language: 'ar' | 'en' | 'auto';
    dialect: 'egyptian' | 'saudi' | 'jordanian' | 'kuwaiti' | 'standard';
    status: 'connected' | 'disconnected';
  };
}

export interface AIChat {
  id: number;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}
