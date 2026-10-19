import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Search, 
  Heart, 
  Sparkles, 
  Shield, 
  Lock, 
  CheckCircle, 
  Clock, 
  User, 
  Tag, 
  Share2, 
  MessageCircle, 
  RefreshCw,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { AnonymousLetter, CategoryType } from '../types';
import { CUTE_STUDENT_NAMES } from '../data/counselingData';
import { soundEngine } from '../utils/audio';

interface AnonymousMailboxProps {
  onOpenDirectChat?: () => void;
}

export const AnonymousMailbox: React.FC<AnonymousMailboxProps> = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'lookup' | 'community'>('send');

  // Send form states
  const [penName, setPenName] = useState('Chiếc Lá Nhỏ');
  const [category, setCategory] = useState<CategoryType>('school');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);

  // Local storage saved codes
  const [mySavedCodes, setMySavedCodes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('taman_my_letter_codes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Lookup states
  const [searchCode, setSearchCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedLetter, setSearchedLetter] = useState<AnonymousLetter | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Community letters states
  const [communityLetters, setCommunityLetters] = useState<AnonymousLetter[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);

  // Fetch community letters on mount or tab change
  useEffect(() => {
    if (activeTab === 'community') {
      fetchCommunityLetters();
    }
  }, [activeTab]);

  const fetchCommunityLetters = async () => {
    setIsLoadingCommunity(true);
    try {
      const res = await fetch('/api/community-letters');
      const data = await res.json();
      if (data.success && data.letters) {
        setCommunityLetters(data.letters);
      }
    } catch (e) {
      console.error('Error fetching community letters:', e);
    } finally {
      setIsLoadingCommunity(false);
    }
  };

  const handleRandomizeName = () => {
    const random = CUTE_STUDENT_NAMES[Math.floor(Math.random() * CUTE_STUDENT_NAMES.length)];
    setPenName(random);
  };

  const handleSendLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung bức thư bạn nhé!');
      return;
    }

    setIsSending(true);
    try {
      soundEngine.playCalmBell();
      const res = await fetch('/api/anonymous-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          penName: penName || 'Bạn học sinh giấu tên',
          category,
          urgency,
          title,
          content,
          isPublic
        })
      });

      const data = await res.json();
      if (data.success && data.code) {
        setSentCode(data.code);
        const updatedCodes = [data.code, ...mySavedCodes.filter(c => c !== data.code)];
        setMySavedCodes(updatedCodes);
        try {
          localStorage.setItem('taman_my_letter_codes', JSON.stringify(updatedCodes));
        } catch (e) {
          // ignore
        }
        // Reset inputs
        setTitle('');
        setContent('');
      } else {
        alert(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (e) {
      console.error('Send letter error:', e);
      alert('Không thể gửi thư lúc này. Hãy kiểm tra kết nối mạng nhé!');
    } finally {
      setIsSending(false);
    }
  };

  const handleLookupCode = async (codeToSearch?: string) => {
    const target = (codeToSearch || searchCode).trim();
    if (!target) {
      setLookupError('Vui lòng nhập mã tra cứu (VD: TAM-AN-1024)');
      return;
    }

    setLookupError(null);
    setIsSearching(true);
    setSearchedLetter(null);

    try {
      const res = await fetch(`/api/anonymous-letter/${encodeURIComponent(target)}`);
      const data = await res.json();
      if (data.success && data.letter) {
        setSearchedLetter(data.letter);
      } else {
        setLookupError(data.error || 'Không tìm thấy bức thư này. Bạn kiểm tra lại mã đã nhập nhé!');
      }
    } catch (e) {
      console.error('Lookup error:', e);
      setLookupError('Không thể tra cứu lúc này. Hãy thử lại sau ít phút.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCheer = async (letterId: string, type: 'heart' | 'hug') => {
    try {
      soundEngine.playCalmBell();
      const res = await fetch('/api/cheer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: letterId, type })
      });
      const data = await res.json();
      if (data.success && data.letter) {
        // Update in state
        setCommunityLetters(prev => prev.map(l => l.id === letterId ? data.letter : l));
        if (searchedLetter && searchedLetter.id === letterId) {
          setSearchedLetter(data.letter);
        }
      }
    } catch (e) {
      console.error('Cheer error:', e);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopyCodeSuccess(true);
    setTimeout(() => setCopyCodeSuccess(false), 2500);
  };

  const urgencyLabels = {
    low: { label: 'Tâm sự nhẹ nhàng', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    medium: { label: 'Đang bối rối & cần lời khuyên', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    high: { label: 'Rất căng thẳng / Khủng hoảng', color: 'bg-rose-50 text-rose-700 border-rose-200' }
  };

  return (
    <section id="mailbox-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Hòm Thư Mật Danh Tuổi Học Trò</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          Gửi Thư Bí Mật Đến Chuyên Gia Tâm Lý
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Nơi bạn có thể trút hết tâm can vào một bức thư dài mà không ai biết bạn là ai. Chuyên viên tâm lý trường học sẽ trực tiếp đọc và gửi thư hồi âm chu đáo riêng cho bạn.
        </p>

        {/* Realistic Student Community Banner with gradual fade */}
        <div className="mt-6 relative rounded-3xl overflow-hidden border border-sky-100 shadow-sm max-w-2xl mx-auto h-48 sm:h-56 group bg-sky-50 flex items-end p-5 sm:p-6">
          {/* Sharp, clear realistic photo */}
          <img
            src="/src/assets/images/real_student_friends_1792402161964.jpg"
            alt="Các bạn học sinh cùng ngồi trò chuyện và đồng cảm dưới bóng cây trường học"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-[50%_35%] group-hover:scale-[1.02] transition-transform duration-700"
          />
          {/* Smooth multi-stop gradual fade from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 via-slate-900/25 to-transparent pointer-events-none" />

          {/* Text seamlessly emerging from the gradual fade */}
          <div className="relative z-10 w-full flex items-center gap-3.5 text-left text-white">
            <span className="text-xl p-2.5 rounded-2xl bg-white/20 backdrop-blur-xs text-white border border-white/25 shrink-0 shadow-2xs">
              💌
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white drop-shadow-xs">
                Mỗi bức thư là một niềm tin được trao gửi
              </h4>
              <p className="text-[11px] sm:text-xs text-sky-100/90 mt-0.5 leading-relaxed drop-shadow-2xs">
                Chuyên viên tư vấn tâm lý học đường trực tiếp phản hồi và bảo vệ thông tin cá nhân của bạn tuyệt đối.
              </p>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('send')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'send'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-200 scale-105'
                : 'bg-white text-slate-600 border border-sky-100 hover:bg-sky-50'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Viết Thư Mật Danh</span>
          </button>

          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'lookup'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-200 scale-105'
                : 'bg-white text-slate-600 border border-sky-100 hover:bg-sky-50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Tra Cứu Hồi Âm ({mySavedCodes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-200 scale-105'
                : 'bg-white text-slate-600 border border-sky-100 hover:bg-sky-50'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Góc Sẻ Chia Ẩn Danh</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SEND ANONYMOUS LETTER */}
      {activeTab === 'send' && (
        <div className="max-w-3xl mx-auto">
          {sentCode ? (
            <div className="bg-white rounded-3xl p-8 border border-sky-200 shadow-md text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                ✉️
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Thư của bạn đã được niêm phong & gửi an toàn!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Chuyên viên tư vấn tâm lý đã nhận được thư của bạn. Để đảm bảo tính bảo mật và sự riêng tư tuyệt đối, hãy lưu lại mã bí mật bên dưới để xem thư hồi âm nhé:
              </p>

              {/* Secret code card */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 max-w-md mx-auto flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Mã tra cứu hồi âm của bạn:</span>
                  <span className="text-xl font-extrabold text-sky-700 tracking-wider">
                    {sentCode}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(sentCode)}
                  className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {copyCodeSuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copyCodeSuccess ? 'Đã chép' : 'Sao chép mã'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    setSearchCode(sentCode);
                    setActiveTab('lookup');
                    handleLookupCode(sentCode);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-sm hover:shadow transition-all"
                >
                  Xem ngay phản hồi từ Chuyên viên
                </button>
                <button
                  onClick={() => setSentCode(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                >
                  Viết thêm một lá thư khác
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6 text-xs text-sky-800 bg-sky-50/80 p-3 rounded-2xl border border-sky-200">
                <Shield className="w-4 h-4 shrink-0 text-sky-600" />
                <span>
                  Bức thư hoàn toàn không thu thập tên thật, IP, email hay bất cứ dấu vết nào. Chỉ người cầm mã bí mật mới có thể mở xem hồi âm.
                </span>
              </div>

              <form onSubmit={handleSendLetter} className="space-y-5">
                
                {/* Pen name & random */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Bút danh của bạn:
                      </label>
                      <button
                        type="button"
                        onClick={handleRandomizeName}
                        className="text-[11px] text-sky-600 hover:text-sky-800 flex items-center gap-1 font-medium"
                      >
                        <RefreshCw className="w-3 h-3" /> Đổi tên ngẫu nhiên
                      </button>
                    </div>
                    <input
                      type="text"
                      value={penName}
                      onChange={(e) => setPenName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-sky-50/40 border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white"
                      placeholder="VD: Chiếc Lá Mùa Thu..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Chủ đề tâm sự:
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryType)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-sky-50/40 border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white"
                    >
                      <option value="school">Tâm lý Học đường (Thi cử, điểm số, thầy cô)</option>
                      <option value="family">Tâm lý Gia đình (Bố mẹ, mâu thuẫn thế hệ)</option>
                      <option value="social">Tâm lý Xã hội (Bạn bè, tẩy chay, tình cảm)</option>
                    </select>
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mức độ tâm trạng lúc này:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((urg) => (
                      <button
                        key={urg}
                        type="button"
                        onClick={() => setUrgency(urg)}
                        className={`p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all ${
                          urgency === urg
                            ? `${urgencyLabels[urg].color} ring-2 ring-sky-500 font-bold shadow-xs`
                            : 'bg-white text-slate-600 border-sky-100 hover:bg-sky-50'
                        }`}
                      >
                        {urgencyLabels[urg].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tiêu đề bức thư:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Em cảm thấy kiệt sức vì kỳ thi sắp tới mà bố mẹ không hiểu..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-sky-50/40 border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nội dung thư gửi chuyên gia tâm lý:
                  </label>
                  <textarea
                    rows={7}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Gửi cô/thầy tư vấn tâm lý... Em đang gặp phải chuyện này và đã giữ trong lòng rất lâu..."
                    className="w-full p-4 rounded-2xl bg-sky-50/30 border border-sky-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white resize-y"
                  />
                </div>

                {/* Public sharing checkbox */}
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-sky-600 focus:ring-sky-400 border-sky-300 cursor-pointer"
                  />
                  <label htmlFor="isPublic" className="cursor-pointer">
                    <span className="font-bold text-sky-800">Cho phép chia sẻ ẩn danh vào "Góc Sẻ Chia":</span>{' '}
                    Bức thư và lời hồi đáp của chuyên viên sẽ được đăng ẩn danh để tiếp thêm động lực cho các bạn học sinh có cùng hoàn cảnh.
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang niêm phong thư...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Niêm phong & Gửi thư mật danh</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LOOKUP LETTER BY CODE */}
      {activeTab === 'lookup' && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Lookup Input Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-500" />
              <span>Tra cứu thư hồi âm bằng Mã bí mật</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhập mã bạn đã nhận được khi gửi thư (VD: TAM-AN-1024, TAM-AN-2048, TAM-AN-3096)
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã bí mật (VD: TAM-AN-1024)"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-sky-50/40 border border-sky-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white uppercase tracking-wider"
              />
              <button
                onClick={() => handleLookupCode()}
                disabled={isSearching}
                className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Kiểm tra thư</span>
              </button>
            </div>

            {/* Quick click on user's saved codes */}
            {mySavedCodes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-sky-50">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Các mã thư đã gửi trên thiết bị này:
                </span>
                <div className="flex flex-wrap gap-2">
                  {mySavedCodes.map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setSearchCode(code);
                        handleLookupCode(code);
                      }}
                      className="text-xs px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-200 transition-all"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {lookupError && (
              <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}
          </div>

          {/* Searched Letter Display */}
          {searchedLetter && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-md space-y-6 animate-fadeIn">
              
              {/* Letter Header */}
              <div className="pb-4 border-b border-sky-100">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 font-bold">
                    Mã thư: {searchedLetter.code}
                  </span>
                  <span className="text-xs text-slate-400">
                    Gửi lúc: {new Date(searchedLetter.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-800">
                  {searchedLetter.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span>Người gửi: <strong className="text-sky-700">{searchedLetter.penName}</strong></span>
                  <span>•</span>
                  <span>Chủ đề: {searchedLetter.category === 'school' ? 'Học đường' : searchedLetter.category === 'family' ? 'Gia đình' : 'Xã hội & Bạn bè'}</span>
                </div>
              </div>

              {/* Student's Letter Content */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                <div className="text-[11px] font-bold text-sky-700 mb-1.5">
                  📝 Tâm sự của bạn:
                </div>
                {searchedLetter.content}
              </div>

              {/* Counselor Reply Section */}
              {searchedLetter.reply ? (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-sky-50/80 to-white border border-blue-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-base font-bold shadow-xs">
                      👩‍🏫
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800">
                        {searchedLetter.reply.counselorName}
                      </h5>
                      <p className="text-[11px] text-sky-700">
                        {searchedLetter.reply.counselorTitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-2">
                    {searchedLetter.reply.content}
                  </div>

                  <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Đã hồi đáp vào {new Date(searchedLetter.reply.repliedAt).toLocaleDateString('vi-VN')}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCheer(searchedLetter.id, 'heart')}
                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-slate-700 hover:text-rose-600 flex items-center gap-1 transition-all"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>{searchedLetter.hearts} Cảm ơn cô</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-center text-xs space-y-2">
                  <Clock className="w-6 h-6 mx-auto text-amber-600 animate-spin" />
                  <p className="font-bold">Chuyên viên đang đọc và soạn thư phản hồi cho bạn...</p>
                  <p className="text-[11px] text-amber-700">
                    Mỗi bức thư đều được đọc bằng sự nâng niu. Hãy quay lại tra cứu sau ít phút hoặc lưu lại mã này nhé!
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* TAB 3: COMMUNITY SHARED LETTERS */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <p className="text-xs sm:text-sm text-slate-600">
              Những bức thư ẩn danh đã nhận được hồi đáp từ chuyên gia. Đọc để biết rằng <strong className="text-sky-700">bạn không hề đơn độc</strong> trên hành trình trưởng thành 💙
            </p>
          </div>

          {isLoadingCommunity ? (
            <div className="text-center py-12 text-sky-600 text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Đang tải các lá thư ấm áp...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header meta */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="font-bold text-sky-600 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100">
                        {letter.category === 'school' ? '🏫 Học đường' : letter.category === 'family' ? '🏡 Gia đình' : '👥 Bạn bè'}
                      </span>
                      <span>{new Date(letter.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-800 line-clamp-2 mb-2">
                      {letter.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 italic">
                      "{letter.content}"
                    </p>

                    {/* Counselor summary */}
                    {letter.reply && (
                      <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-slate-700 mb-4">
                        <div className="flex items-center gap-1.5 font-bold text-sky-800 text-[11px] mb-1">
                          <Sparkles className="w-3 h-3 text-sky-600" />
                          <span>Hồi âm từ {letter.reply.counselorName}:</span>
                        </div>
                        <p className="line-clamp-3 text-slate-600">
                          {letter.reply.content}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer actions: Hearts & Hugs */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Từ: {letter.penName}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCheer(letter.id, 'heart')}
                        className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-sky-100 text-xs flex items-center gap-1 transition-all"
                        title="Thả tim động viên"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>{letter.hearts}</span>
                      </button>

                      <button
                        onClick={() => handleCheer(letter.id, 'hug')}
                        className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-blue-100 text-slate-600 hover:text-blue-700 border border-sky-100 text-xs flex items-center gap-1 transition-all"
                        title="Gửi cái ôm ấm áp"
                      >
                        <span>🫂</span>
                        <span>{letter.hugs}</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </section>
  );
};
