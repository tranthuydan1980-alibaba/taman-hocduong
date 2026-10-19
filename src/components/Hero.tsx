import React, { useState } from 'react';
import { 
  GraduationCap, 
  Home, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Smile,
  Frown,
  Meh,
  HeartHandshake
} from 'lucide-react';
import { CategoryType } from '../types';

interface HeroProps {
  onSelectCategory: (category: CategoryType) => void;
  onOpenMailbox: () => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectCategory,
  onOpenMailbox,
  onOpenChat
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: 'anxious', label: 'Căng thẳng thi cử', emoji: '😰', note: 'Hãy để Tâm An gánh bớt áp lực bài vở cùng bạn nhé.', target: 'school' as CategoryType },
    { id: 'family_trouble', label: 'Bố mẹ không hiểu', emoji: '🥺', note: 'Khoảng cách thế hệ là khó khăn có thể gỡ rối từng chút một.', target: 'family' as CategoryType },
    { id: 'peer_sad', label: 'Buồn vì bạn bè', emoji: '💔', note: 'Bạn luôn xứng đáng với những tình bạn chân thành và bình yên.', target: 'social' as CategoryType },
    { id: 'exhausted', label: 'Kiệt sức / Trống rỗng', emoji: '🌧️', note: 'Hôm nay bạn đã rất vất vả rồi, nghỉ ngơi một chút nhé.', target: 'school' as CategoryType },
    { id: 'calm', label: 'Muốn tìm người trò chuyện', emoji: '✨', note: 'Trợ lý AI 24/7 và các chuyên gia luôn ở đây vì bạn.', target: null },
  ];

  const currentMoodObj = moods.find(m => m.id === selectedMood);

  return (
    <div className="relative overflow-hidden pt-6 pb-14 bg-gradient-to-b from-sky-100/60 via-sky-50/40 to-transparent">
      
      {/* Decorative background blurs and clouds */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Tag */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/90 border border-sky-200 text-sky-800 text-xs sm:text-sm font-semibold mb-5 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-ping" />
            <span>Không gian tâm lý an toàn dành riêng cho học sinh THCS & THPT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight sm:leading-snug">
            Nơi Lắng Nghe & Thấu Hiểu <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mọi Nỗi Niềm Tuổi Học Trò
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Áp lực điểm số? Xung đột với cha mẹ? Hay bối rối trước bạn bè? 
            Hãy trút bỏ muộn phiền tại đây. Mọi tâm sự của bạn đều được{' '}
            <span className="text-sky-700 font-bold underline decoration-sky-300 underline-offset-4">
              bảo mật 100%, ẩn danh và nhận lời khuyên chân thành
            </span>.
          </p>

          {/* Quick Mood Check-in */}
          <div className="mt-8 p-4 sm:p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-sky-100 shadow-sm max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-bold text-slate-700 mb-3 flex items-center justify-center gap-1.5">
              <span>💭 Hôm nay bạn đang cảm thấy thế nào?</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {moods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id === selectedMood ? null : m.id)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    selectedMood === m.id
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-200 scale-105'
                      : 'bg-sky-50/70 hover:bg-sky-100 text-slate-700 border border-sky-100'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {currentMoodObj && (
              <div className="mt-3 pt-3 border-t border-sky-100 text-xs sm:text-sm text-sky-800 flex flex-col sm:flex-row items-center justify-between gap-2 animate-fadeIn">
                <span>{currentMoodObj.note}</span>
                {currentMoodObj.target ? (
                  <button
                    onClick={() => onSelectCategory(currentMoodObj.target!)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 underline underline-offset-2"
                  >
                    Tâm sự mục này ngay <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onOpenChat}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 underline underline-offset-2"
                  >
                    Chat với Tâm An 24/7 <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Hero Banner: Sharp Realistic Photo with Smooth Gradual Fade Transition */}
          <div className="mt-8 relative rounded-3xl overflow-hidden border border-sky-100 shadow-md group">
            {/* Crisp, clear realistic photo of Vietnamese students */}
            <img
              src="/src/assets/images/hero_students_real_1792402160495.jpg"
              alt="Học sinh THPT Việt Nam vui vẻ gắn kết trong sân trường rợp bóng cây"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 md:h-[420px] object-cover object-[50%_25%] group-hover:scale-[1.01] transition-transform duration-700"
            />
            
            {/* Gradual Feathered Fade: multi-stop smooth gradient without any sharp blur line */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 via-slate-900/30 via-slate-900/5 to-transparent pointer-events-none" />

            {/* Content seamlessly emerging from the gradual fade */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 md:p-10 flex justify-center text-center">
              <div className="max-w-2xl text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-white border border-white/25 mb-2.5 shadow-2xs">
                  🌸 Bạn không hề đơn độc trên hành trình này
                </span>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-xs">
                  "Dù là áp lực bài thi hay cô đơn trước bạn bè, luôn có người lắng nghe bạn"
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-sky-100 max-w-xl mx-auto leading-relaxed drop-shadow-2xs">
                  Mọi chia sẻ của học sinh đều được tiếp nhận với sự tôn trọng, ân cần và bảo mật 100%. Hãy để tâm trí bạn được thở nhẹ nhàng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Main Pillars Display Cards: Clear Photos with Gradual Dissolve Transition */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: School */}
          <div 
            onClick={() => onSelectCategory('school')}
            className="group relative rounded-3xl bg-white border border-sky-100/90 shadow-sm hover:shadow-xl hover:shadow-sky-100 hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Realistic photo with gradual dissolve fade into the white card */}
            <div className="relative h-52 w-full overflow-hidden bg-sky-50">
              <img
                src="/src/assets/images/real_student_study_1792402161478.jpg"
                alt="Học sinh học tập bên bàn sách"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center [mask-image:linear-gradient(to_bottom,black_45%,rgba(0,0,0,0.85)_65%,rgba(0,0,0,0.3)_85%,transparent_100%)] group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Ultra-smooth multi-stop gradual fade overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 via-white/10 to-transparent pointer-events-none" />
              
              {/* Foreground badges with delicate frosted styling */}
              <div className="absolute top-3.5 left-3.5 z-10 w-11 h-11 rounded-2xl bg-white/85 backdrop-blur-xs text-sky-600 flex items-center justify-center shadow-sm border border-white/60">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/85 backdrop-blur-xs text-sky-700 border border-white/60 shadow-xs">
                Mục 01 • Thi cử
              </div>
            </div>

            <div className="p-5 sm:p-6 -mt-3 relative z-10 bg-white">
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                Tâm Lý Học Đường
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Giải tỏa áp lực bài thi chuyển cấp, nỗi sợ không đạt kỳ vọng của thầy cô và phương pháp cân bằng tâm trí khi ôn tập quá tải.
              </p>
              
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
                <span>Viết tâm sự & Nhận lời khuyên</span>
                <div className="w-7 h-7 rounded-full bg-sky-50 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-sky-500 group-hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Family */}
          <div 
            onClick={() => onSelectCategory('family')}
            className="group relative rounded-3xl bg-white border border-blue-100/90 shadow-sm hover:shadow-xl hover:shadow-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Realistic photo with gradual dissolve fade into the white card */}
            <div className="relative h-52 w-full overflow-hidden bg-blue-50">
              <img
                src="/src/assets/images/real_family_talk_1792402161957.jpg"
                alt="Học sinh và cha mẹ trò chuyện trong phòng khách"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center [mask-image:linear-gradient(to_bottom,black_45%,rgba(0,0,0,0.85)_65%,rgba(0,0,0,0.3)_85%,transparent_100%)] group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Ultra-smooth multi-stop gradual fade overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 via-white/10 to-transparent pointer-events-none" />
              
              {/* Foreground badges with delicate frosted styling */}
              <div className="absolute top-3.5 left-3.5 z-10 w-11 h-11 rounded-2xl bg-white/85 backdrop-blur-xs text-blue-600 flex items-center justify-center shadow-sm border border-white/60">
                <Home className="w-6 h-6" />
              </div>
              <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/85 backdrop-blur-xs text-blue-700 border border-white/60 shadow-xs">
                Mục 02 • Gia đình
              </div>
            </div>

            <div className="p-5 sm:p-6 -mt-3 relative z-10 bg-white">
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Tâm Lý Gia Đình
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Khi bị so sánh với "con nhà người ta", phụ huynh kiểm soát khắt khe, áp đặt ước mơ hoặc không khí gia đình bất hòa khiến bạn thấy nghẹt thở.
              </p>
              
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Viết tâm sự & Nhận lời khuyên</span>
                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Social & Friends */}
          <div 
            onClick={() => onSelectCategory('social')}
            className="group relative rounded-3xl bg-white border border-teal-100/90 shadow-sm hover:shadow-xl hover:shadow-teal-100 hover:border-teal-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Realistic photo with gradual dissolve fade into the white card */}
            <div className="relative h-52 w-full overflow-hidden bg-teal-50">
              <img
                src="/src/assets/images/real_student_friends_1792402161964.jpg"
                alt="Nhóm bạn học sinh chia sẻ và đồng cảm"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center [mask-image:linear-gradient(to_bottom,black_45%,rgba(0,0,0,0.85)_65%,rgba(0,0,0,0.3)_85%,transparent_100%)] group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Ultra-smooth multi-stop gradual fade overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 via-white/10 to-transparent pointer-events-none" />
              
              {/* Foreground badges with delicate frosted styling */}
              <div className="absolute top-3.5 left-3.5 z-10 w-11 h-11 rounded-2xl bg-white/85 backdrop-blur-xs text-teal-600 flex items-center justify-center shadow-sm border border-white/60">
                <Users className="w-6 h-6" />
              </div>
              <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/85 backdrop-blur-xs text-teal-700 border border-white/60 shadow-xs">
                Mục 03 • Bạn bè
              </div>
            </div>

            <div className="p-5 sm:p-6 -mt-3 relative z-10 bg-white">
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                Tâm Lý Xã Hội & Bạn Bè
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Tình bạn rạn nứt, bị cô lập hay nói xấu sau lưng, rung động tuổi học trò, tự ti ngoại hình và áp lực "đồng trang lứa" trên mạng xã hội.
              </p>
              
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
                <span>Viết tâm sự & Nhận lời khuyên</span>
                <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <span>Bảo mật danh tính 100%</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            <span>Chatbot AI phản hồi 24/7 tức thì</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <span>Hòm thư gửi chuyên viên tâm lý</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-sky-600" />
            <span>Đồng hành cùng học sinh toàn quốc</span>
          </div>
        </div>

      </div>
    </div>
  );
};
