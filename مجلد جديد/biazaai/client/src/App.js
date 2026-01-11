import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AIPage from './pages/AIPage';
import AutomationPage from './pages/AutomationPage';
import DashboardPage from './pages/DashboardPage';
import IntegrationFlow from './pages/IntegrationFlow';
import FileManagement from './pages/FileManagement';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/automation" element={<AutomationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/integration/:channel" element={<IntegrationFlow />} />
          <Route path="/files" element={<FileManagement />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;