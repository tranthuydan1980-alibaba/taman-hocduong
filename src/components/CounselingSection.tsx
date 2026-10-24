import React, { useState } from 'react';
import { 
  GraduationCap, 
  Home, 
  Users, 
  Send, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  RefreshCw, 
  Heart, 
  Smile, 
  Lightbulb, 
  Wind, 
  Copy, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { CategoryType, AdviceResult, SavedAdviceItem } from '../types';
import { COUNSELING_CATEGORIES, CUTE_STUDENT_NAMES, FEELING_TAGS } from '../data/counselingData';
import { soundEngine } from '../utils/audio';

interface CounselingSectionProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onSaveAdvice: (item: Omit<SavedAdviceItem, 'id' | 'date'>) => void;
  isSaved: (title: string) => boolean;
}

export const CounselingSection: React.FC<CounselingSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onSaveAdvice,
  isSaved
}) => {
  const currentCategory = COUNSELING_CATEGORIES[selectedCategory];

  // Form states
  const [penName, setPenName] = useState('Mèo Con Cần Tâm Sự');
  const [grade, setGrade] = useState('Lớp 11 (THPT)');
  const [selectedFeeling, setSelectedFeeling] = useState<string>('😰 Lo âu, bồn chồn');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [situation, setSituation] = useState('');
  
  // Response states
  const [isLoading, setIsLoading] = useState(false);
  const [adviceResult, setAdviceResult] = useState<AdviceResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const handleRandomizeName = () => {
    const randomName = CUTE_STUDENT_NAMES[Math.floor(Math.random() * CUTE_STUDENT_NAMES.length)];
    setPenName(randomName);
  };

  const handlePickTopic = (topic: { title: string; starterPrompt: string }) => {
    setSelectedTopic(topic.title);
    setSituation(topic.starterPrompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) {
      setErrorMsg('Bạn ơi, hãy viết vài dòng tâm sự để Tâm An có thể hiểu và đưa ra lời khuyên phù hợp nhé!');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      // Play a soft calming chime
      soundEngine.playCalmBell();

      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          topic: selectedTopic || 'Tâm sự tự do',
          feeling: selectedFeeling,
          situation,
          penName: penName || 'Bạn học sinh giấu tên',
          grade
        })
      });

      const data = await response.json();
      if (data.success && data.advice) {
        setAdviceResult(data.advice);
      } else {
        throw new Error(data.error || 'Không nhận được phản hồi');
      }
    } catch (err: any) {
      console.warn('API error, using client-side empathetic fallback:', err);
      // Compassionate client-side fallback if server route had network glitch
      const fallbackAdvice: AdviceResult = {
        empathy: `Gửi ${penName}, cô cảm nhận được sâu sắc nỗi băn khoăn và mệt mỏi mà em đang gánh chịu. Những gì em đang đối mặt không hề dễ dàng, và em hoàn toàn có quyền được buồn hoặc lo âu.`,
        psychologicalInsight: `Ở lứa tuổi học sinh, não bộ đang tái cấu trúc và hormone thay đổi khiến cảm xúc nhạy cảm hơn bình thường. Những vấn đề về ${currentCategory.shortTitle.toLowerCase()} này là thử thách phổ biến, không phải lỗi do em yếu kém.`,
        actionSteps: [
          'Dừng lại mọi suy nghĩ tiêu cực trong 10 phút, uống một ngụm nước ấm và rửa mặt bằng nước mát.',
          'Ghi ra giấy 3 điều em đang kiểm soát được (như việc sắp xếp lại bàn học, làm từng bài tập nhỏ) và buông bớt những điều ngoài tầm kiểm soát.',
          'Chia sẻ cởi mở với một người em tin cậy hoặc tiếp tục trò chuyện với chatbot 24/7 để trút bớt gánh nặng.'
        ],
        soothingQuote: 'Bạn không phải đối mặt với mọi thứ một mình. Từng bước nhỏ một, mọi chuyện rồi sẽ ổn thôi.',
        breathingReminder: 'Hít sâu 4 giây... Giữ hơi 4 giây... Và thở ra nhẹ nhàng 6 giây nhé!'
      };
      setAdviceResult(fallbackAdvice);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!adviceResult) return;
    onSaveAdvice({
      category: selectedCategory,
      title: selectedTopic || `Tâm sự ${currentCategory.shortTitle} của ${penName}`,
      advice: adviceResult
    });
  };

  const handleCopyQuote = () => {
    if (!adviceResult?.soothingQuote) return;
    navigator.clipboard.writeText(adviceResult.soothingQuote);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <section id="counseling-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 3 Main Category Tabs */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          3 Không Gian Tư Vấn Chuyên Sâu
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          Chọn mục tâm sự phù hợp với điều đang đè nặng trong lòng bạn lúc này
        </p>

        {/* Tab switcher buttons */}
        <div className="mt-6 inline-flex p-1.5 rounded-3xl bg-sky-100/70 border border-sky-200/80 shadow-xs max-w-full overflow-x-auto">
          {(['school', 'family', 'social'] as CategoryType[]).map((catId) => {
            const cat = COUNSELING_CATEGORIES[catId];
            const isCurrent = selectedCategory === catId;
            return (
              <button
                key={catId}
                onClick={() => {
                  onSelectCategory(catId);
                  setAdviceResult(null);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-white text-sky-700 shadow-md shadow-sky-200/50 scale-[1.02]'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-white/50'
                }`}
              >
                {catId === 'school' && <GraduationCap className={`w-4 h-4 ${isCurrent ? 'text-sky-600' : 'text-slate-400'}`} />}
                {catId === 'family' && <Home className={`w-4 h-4 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />}
                {catId === 'social' && <Users className={`w-4 h-4 ${isCurrent ? 'text-teal-600' : 'text-slate-400'}`} />}
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace for Selected Category */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm relative overflow-hidden">
          
          {/* Subtle category badge header */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-sky-50">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-100 text-sky-600">
                  {selectedCategory === 'school' && <GraduationCap className="w-5 h-5" />}
                  {selectedCategory === 'family' && <Home className="w-5 h-5" />}
                  {selectedCategory === 'social' && <Users className="w-5 h-5" />}
                </span>
                <h3 className="text-xl font-bold text-slate-800">
                  {currentCategory.title}
                </h3>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {currentCategory.tagline}
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                🔒 Bảo mật 100%
              </span>
            </div>
          </div>

          {/* Quick topic pills */}
          <div className="mt-5">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              💡 Gợi ý chủ đề thường gặp (chạm để chọn nhanh):
            </label>
            <div className="flex flex-wrap gap-2">
              {currentCategory.commonTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handlePickTopic(topic)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left ${
                    selectedTopic === topic.title
                      ? 'bg-sky-500 text-white border-sky-500 font-semibold shadow-xs'
                      : 'bg-sky-50/60 hover:bg-sky-100/70 text-slate-700 border-sky-100'
                  }`}
                >
                  {topic.title}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            
            {/* Meta row: Pen name + Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pen Name */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Bút danh của bạn:
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomizeName}
                    className="text-[11px] text-sky-600 hover:text-sky-800 flex items-center gap-1 font-medium"
                    title="Đổi bút danh ngẫu nhiên"
                  >
                    <RefreshCw className="w-3 h-3" /> Đổi tên ngẫu nhiên
                  </button>
                </div>
                <input
                  type="text"
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                  placeholder="VD: Mây Trắng, Mèo Con..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sky-50/40 border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                />
              </div>

              {/* Grade */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lớp / Độ tuổi của bạn:
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sky-50/40 border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                >
                  <option value="Lớp 6 (THCS)">Lớp 6 (THCS - 11 tuổi)</option>
                  <option value="Lớp 7 (THCS)">Lớp 7 (THCS - 12 tuổi)</option>
                  <option value="Lớp 8 (THCS)">Lớp 8 (THCS - 13 tuổi)</option>
                  <option value="Lớp 9 (Ôn thi vào 10)">Lớp 9 (Ôn thi vào 10 - 14 tuổi)</option>
                  <option value="Lớp 10 (THPT)">Lớp 10 (THPT mới - 15 tuổi)</option>
                  <option value="Lớp 11 (THPT)">Lớp 11 (THPT - 16 tuổi)</option>
                  <option value="Lớp 12 (Ôn thi Đại học)">Lớp 12 (Ôn thi Tốt nghiệp/Đại học - 17 tuổi)</option>
                </select>
              </div>

            </div>

            {/* Feelings Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Cảm xúc hiện tại của bạn:
              </label>
              <div className="flex flex-wrap gap-2">
                {FEELING_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedFeeling(tag.label)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                      selectedFeeling === tag.label
                        ? 'ring-2 ring-sky-500 font-bold bg-white shadow-xs'
                        : `${tag.color} opacity-80 hover:opacity-100`
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Textarea (Khung nhập liệu tâm sự) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Khung tâm sự của bạn:</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Càng chi tiết, lời khuyên sẽ càng sâu sắc
                </span>
              </label>
              <textarea
                rows={6}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Hãy viết ra mọi điều đang chất chứa trong lòng bạn... Không có điều gì là ngốc nghếch hay sai trái cả. Tâm An luôn ở đây sẵn sàng lắng nghe bạn."
                className="w-full p-4 rounded-2xl bg-sky-50/30 border border-sky-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all resize-y"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ✨ Lời khuyên được xây dựng theo chuẩn tâm lý học đường tích cực
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Chuyên gia đang suy nghĩ & lắng nghe...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi tâm sự để nhận lời khuyên</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Right Column: AI / Counselor Advice Card (5 cols) */}
        <div className="lg:col-span-5">
          {adviceResult ? (
            <div className="bg-gradient-to-br from-white via-sky-50/50 to-blue-50/30 rounded-3xl p-6 sm:p-7 border border-sky-200/90 shadow-md relative animate-fadeIn space-y-5">
              
              {/* Header result */}
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800">
                      Lời Khuyên Từ Tâm An
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Dành riêng cho {penName} • {grade}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  title="Lưu vào sổ tay"
                  className={`p-2 rounded-xl border transition-all ${
                    isSaved(selectedTopic || `Tâm sự ${currentCategory.shortTitle} của ${penName}`)
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-600 border-sky-200 hover:bg-sky-50'
                  }`}
                >
                  {isSaved(selectedTopic || `Tâm sự ${currentCategory.shortTitle} của ${penName}`) ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* 1. Empathy Validation */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-slate-700 text-xs sm:text-sm leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-sky-800 text-xs mb-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Vỗ về & Thấu cảm</span>
                </div>
                <p className="whitespace-pre-line italic text-slate-700">
                  "{adviceResult.empathy}"
                </p>
              </div>

              {/* 2. Psychological Insight */}
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Góc nhìn tâm lý học đường:</span>
                </div>
                <p>{adviceResult.psychologicalInsight}</p>
              </div>

              {/* 3. Action Steps */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>3 Bước hành động gợi ý nhẹ nhàng:</span>
                </div>
                <div className="space-y-2">
                  {adviceResult.actionSteps.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-sky-100 shadow-2xs flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Affirmation Quote Card */}
              {adviceResult.soothingQuote && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white relative shadow-sm">
                  <div className="flex items-center justify-between text-[11px] opacity-80 mb-1">
                    <span>🌱 Lời nhắn xoa dịu tâm hồn</span>
                    <button
                      onClick={handleCopyQuote}
                      className="flex items-center gap-1 hover:underline text-[10px]"
                    >
                      {copiedQuote ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedQuote ? 'Đã sao chép' : 'Lưu câu này'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold tracking-wide">
                    "{adviceResult.soothingQuote}"
                  </p>
                </div>
              )}

              {/* 5. Quick Breathing Reminder */}
              {adviceResult.breathingReminder && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
                  <Wind className="w-4 h-4 shrink-0 text-emerald-600 animate-pulse" />
                  <span>{adviceResult.breathingReminder}</span>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-3xl bg-white border border-sky-100/90 shadow-sm p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
              <div>
                {/* Sharp, crisp realistic photo with gradual dissolve fade at bottom */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-sky-50 border border-sky-100/80">
                  <img
                             src={
            selectedCategory === 'school'
              ? '/real_3.jpg'
              : selectedCategory === 'family'
              ? '/real_1.jpg'
              : '/real_2.jpg'
          }
                    alt="Hình ảnh thực tế học sinh và không gian thấu cảm"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,black_45%,rgba(0,0,0,0.85)_65%,rgba(0,0,0,0.3)_85%,transparent_100%)]"
                  />
                  
                  {/* Ultra-smooth gradual multi-stop fade overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 via-white/10 to-transparent pointer-events-none" />

                  {/* Category Pill with delicate frosted glass styling */}
                  <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-xl bg-white/85 backdrop-blur-xs text-sky-800 text-xs font-bold border border-white/60 shadow-xs">
                    🍃 {currentCategory.title}
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-800">
                  Khung Lời Khuyên Đang Chờ Bạn
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hãy viết những điều bạn đang băn khoăn ở khung bên trái và bấm <strong className="text-sky-600 font-bold">"Gửi tâm sự"</strong>. Lời khuyên ân cần, giải pháp tâm lý và bài tập thở xoa dịu sẽ xuất hiện ngay tại đây.
                </p>

                <div className="mt-4 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1.5 text-xs text-slate-600">
                  <div className="font-bold text-sky-800">✨ Những gì bạn sẽ nhận được:</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sky-500">•</span> Thấu hiểu và xoa dịu cảm xúc hiện tại
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sky-500">•</span> 3 bước hành động cụ thể, dễ thực hiện
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sky-500">•</span> Câu trích dẫn tiếp thêm năng lượng tích cực
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-sky-500" />
                  Bạn luôn được tôn trọng và bảo mật
                </span>
                <span className="text-slate-400">24/7</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
