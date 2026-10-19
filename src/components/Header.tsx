import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Bookmark, 
  Menu, 
  X,
  Compass,
  Wind
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenSavedModal: () => void;
  savedAdviceCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  onOpenSavedModal,
  savedAdviceCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundMode, setSoundMode] = useState<'none' | 'rain' | 'waves'>('none');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundCycle = () => {
    if (soundMode === 'none') {
      soundEngine.playRain();
      setSoundMode('rain');
    } else if (soundMode === 'rain') {
      soundEngine.playWaves();
      setSoundMode('waves');
    } else {
      soundEngine.stop();
      setSoundMode('none');
    }
  };

  const navItems = [
    { id: 'counseling', label: 'Tư Vấn 3 Mục', icon: Compass },
    { id: 'mailbox', label: 'Hòm Thư Mật Danh', icon: Sparkles },
    { id: 'community', label: 'Góc Sẻ Chia', icon: Heart },
    { id: 'breathing', label: 'Thở Thư Giãn', icon: Wind },
    { id: 'quiz', label: 'Test Tâm Lý', labelSub: 'DASS' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-sky-100 py-2.5' 
        : 'bg-white/70 backdrop-blur-sm py-3.5 border-b border-sky-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-200 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Tâm An
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-semibold border border-sky-200">
                  Học Đường
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Không gian an toàn lắng nghe tuổi học trò 💙
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-sky-50/80 p-1 rounded-full border border-sky-100">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-white text-sky-700 shadow-sm shadow-sky-200 font-bold' 
                      : 'text-slate-600 hover:text-sky-600 hover:bg-white/60'
                  }`}
                >
                  {item.icon && <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />}
                  {item.label}
                  {item.labelSub && (
                    <span className="text-[9px] px-1 rounded bg-sky-100 text-sky-600">
                      {item.labelSub}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            
            {/* Ambient Soundscape Toggle */}
            <button
              onClick={handleSoundCycle}
              title={soundMode === 'none' ? 'Bật âm thanh mưa tĩnh tâm' : `Đang phát tiếng: ${soundMode === 'rain' ? 'Mưa êm dịu' : 'Sóng biển'}`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                soundMode !== 'none'
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm animate-pulse'
                  : 'bg-white text-slate-600 border-sky-100 hover:border-sky-300'
              }`}
            >
              {soundMode === 'none' ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
              <span className="hidden lg:inline text-[11px]">
                {soundMode === 'none' ? 'Âm thanh tĩnh tâm' : soundMode === 'rain' ? 'Tiếng Mưa 🌧️' : 'Sóng Biển 🌊'}
              </span>
            </button>

            {/* Saved notebook */}
            <button
              onClick={onOpenSavedModal}
              title="Sổ tay lời khuyên đã lưu"
              className="relative p-2 rounded-full bg-white hover:bg-sky-50 border border-sky-100 text-slate-600 hover:text-sky-600 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              {savedAdviceCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {savedAdviceCount}
                </span>
              )}
            </button>

            {/* Emergency SOS hotline */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cần Hỗ Trợ Gấp (111)</span>
              <span className="sm:hidden">111</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-sky-50 border border-sky-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-sky-100 mt-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  activeTab === item.id 
                    ? 'bg-sky-100/70 text-sky-700' 
                    : 'text-slate-600 hover:bg-sky-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4 text-sky-500" />}
                  <span>{item.label}</span>
                </div>
                {item.labelSub && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-200 text-sky-800">
                    {item.labelSub}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
