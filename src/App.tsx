import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CounselingSection } from './components/CounselingSection';
import { AnonymousMailbox } from './components/AnonymousMailbox';
import { BreathingExercise } from './components/BreathingExercise';
import { StressQuiz } from './components/StressQuiz';
import { ChatbotWidget } from './components/ChatbotWidget';
import { EmergencyModal } from './components/EmergencyModal';
import { SavedAdviceModal } from './components/SavedAdviceModal';
import { Footer } from './components/Footer';
import { CategoryType, SavedAdviceItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('counseling');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('school');
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);

  // Saved Advice in LocalStorage
  const [savedAdviceList, setSavedAdviceList] = useState<SavedAdviceItem[]>(() => {
    try {
      const stored = localStorage.getItem('taman_saved_advices');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('taman_saved_advices', JSON.stringify(savedAdviceList));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [savedAdviceList]);

  const handleSelectCategory = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setActiveTab('counseling');
    const elem = document.getElementById('counseling-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveAdvice = (item: Omit<SavedAdviceItem, 'id' | 'date'>) => {
    const newItem: SavedAdviceItem = {
      ...item,
      id: `saved-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN')
    };
    setSavedAdviceList((prev) => [newItem, ...prev.filter(i => i.title !== item.title)]);
  };

  const handleRemoveSaved = (id: string) => {
    setSavedAdviceList((prev) => prev.filter(i => i.id !== id));
  };

  const handleClearAllSaved = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả lời khuyên đã lưu trong sổ tay?')) {
      setSavedAdviceList([]);
    }
  };

  const isAdviceSaved = (title: string) => {
    return savedAdviceList.some(i => i.title === title);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/30 text-slate-800">
      
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setEmergencyOpen(true)}
        onOpenSavedModal={() => setSavedModalOpen(true)}
        savedAdviceCount={savedAdviceList.length}
      />

      <main className="flex-1">
        {/* Hero is shown at top of the page */}
        <Hero
          onSelectCategory={handleSelectCategory}
          onOpenMailbox={() => {
            setActiveTab('mailbox');
            const elem = document.getElementById('mailbox-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenChat={() => {
            // Trigger chat if needed
            const chatTrigger = document.querySelector('[aria-label="Mở khung chat tư vấn 24/7"]') as HTMLButtonElement;
            chatTrigger?.click();
          }}
        />

        {/* Dynamic Main Workspace depending on Tab or Full Flow */}
        {activeTab === 'counseling' && (
          <CounselingSection
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSaveAdvice={handleSaveAdvice}
            isSaved={isAdviceSaved}
          />
        )}

        {activeTab === 'mailbox' && (
          <AnonymousMailbox />
        )}

        {activeTab === 'community' && (
          <AnonymousMailbox />
        )}

        {activeTab === 'breathing' && (
          <BreathingExercise />
        )}

        {activeTab === 'quiz' && (
          <StressQuiz
            onNavigateToMailbox={() => setActiveTab('mailbox')}
            onNavigateToChat={() => {
              const chatTrigger = document.querySelector('[aria-label="Mở khung chat tư vấn 24/7"]') as HTMLButtonElement;
              chatTrigger?.click();
            }}
          />
        )}

        {/* If user clicks Home, show counseling section followed by mailbox */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            <CounselingSection
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSaveAdvice={handleSaveAdvice}
              isSaved={isAdviceSaved}
            />
            <BreathingExercise />
            <AnonymousMailbox />
          </div>
        )}
      </main>

      {/* Floating 24/7 Chatbot */}
      <ChatbotWidget onOpenEmergency={() => setEmergencyOpen(true)} />

      {/* Modals */}
      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />

      <SavedAdviceModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedItems={savedAdviceList}
        onRemoveItem={handleRemoveSaved}
        onClearAll={handleClearAllSaved}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenMailbox={() => setActiveTab('mailbox')}
        onOpenEmergency={() => setEmergencyOpen(true)}
      />

    </div>
  );
}
