import React, { useState } from 'react';
import { ClipboardCheck, Sparkles, RefreshCw, CheckCircle2, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import { STRESS_QUIZ_QUESTIONS } from '../data/counselingData';
import { soundEngine } from '../utils/audio';

interface StressQuizProps {
  onNavigateToMailbox: () => void;
  onNavigateToChat: () => void;
}

export const StressQuiz: React.FC<StressQuizProps> = ({
  onNavigateToMailbox,
  onNavigateToChat
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = STRESS_QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (points: number) => {
    soundEngine.playCalmBell();
    const newAnswers = [...answers, points];
    setAnswers(newAnswers);

    if (currentQuestionIndex < STRESS_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsFinished(false);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);

  const getResult = () => {
    if (totalScore <= 4) {
      return {
        level: 'Tâm Trạng Ổn Định & Tích Cực 🌱',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn đang quản lý cảm xúc và áp lực việc học tương đối tốt. Hãy tiếp tục duy trì lối sống lành mạnh nhé!',
        tips: [
          'Duy trì giấc ngủ 7-8 tiếng mỗi đêm để não bộ luôn minh mẫn.',
          'Dành ít nhất 30 phút mỗi ngày cho sở thích cá nhân (đọc sách, nghe nhạc, thể thao).',
          'Sẵn sàng trở thành một người bạn biết lắng nghe cho bạn bè xung quanh.'
        ]
      };
    } else if (totalScore <= 8) {
      return {
        level: 'Căng Thẳng Nhẹ / Mệt Mỏi Tạm Thời ⛅',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        summary: 'Bạn đang có một số áp lực từ việc học hoặc các mối quan hệ. Đừng để nó tích tụ thành gánh nặng quá lớn nhé.',
        tips: [
          'Thực hiện bài tập hít thở 4-4-6 mỗi khi thấy nhịp tim đập nhanh.',
          'Học cách nói "Không" với những yêu cầu vượt quá sức chịu đựng.',
          'Chia nhỏ các bài tập khó ra thành từng phần nhỏ 25 phút (kỹ thuật Pomodoro).'
        ]
      };
    } else if (totalScore <= 11) {
      return {
        level: 'Áp Lực Đáng Kể & Quá Tải 🌧️',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Tâm trí bạn đang phải gồng mình chịu đựng khá nhiều mỏi mệt. Đã đến lúc bạn cần ưu tiên nghỉ ngơi và giãi bày rồi.',
        tips: [
          'Viết một lá thư mật danh gửi Chuyên viên Tâm An để được gỡ rối suy nghĩ.',
          'Tâm sự với một người bạn thân hoặc thầy cô chủ nhiệm đáng tin cậy.',
          'Giảm bớt thời gian lướt mạng xã hội vào buổi tối trước khi đi ngủ.'
        ]
      };
    } else {
      return {
        level: 'Báo Động Cảm Xúc / Kiệt Sức Nặng 🚨',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Mức độ căng thẳng của bạn đang ở ngưỡng rất cao. Bạn không nên chịu đựng một mình thêm nữa!',
        tips: [
          'Hãy nhắn tin ngay với Trợ lý AI Tâm An 24/7 ở góc phải màn hình để được hỗ trợ tức thì.',
          'Nếu cần hỗ trợ bảo vệ khẩn cấp, đừng ngần ngại gọi Tổng đài 111 (miễn phí 24/7).',
          'Bạn là điều quý giá nhất. Hãy buông bớt bài vở xuống và chăm sóc chính mình trước tiên!'
        ]
      };
    }
  };

  return (
    <section id="quiz-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Trắc Nghiệm Tâm Lý Học Đường</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800">
            Đo Mức Độ Căng Thẳng & Áp Lực Hiện Tại
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            5 câu hỏi trắc nghiệm nhanh giúp bạn thấu hiểu tình trạng tinh thần của bản thân
          </p>
        </div>

        {!isFinished ? (
          <div>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1.5">
                <span>Câu hỏi {currentQuestionIndex + 1} / {STRESS_QUIZ_QUESTIONS.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / STRESS_QUIZ_QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-sky-100 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / STRESS_QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-sky-50/50 border border-sky-100 mb-6 animate-fadeIn">
              <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.points)}
                  className="w-full p-4 rounded-2xl border border-sky-100 hover:border-sky-400 bg-white hover:bg-sky-50/70 text-left text-xs sm:text-sm font-semibold text-slate-700 hover:text-sky-800 transition-all shadow-xs flex items-center justify-between group cursor-pointer"
                >
                  <span>{opt.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Result Card */
          <div className="space-y-6 animate-fadeIn">
            {(() => {
              const res = getResult();
              return (
                <>
                  <div className="rounded-3xl bg-white border border-sky-200 overflow-hidden shadow-sm">
                    {/* Sharp realistic student photo with gradual dissolve fade at bottom */}
                    <div className="relative aspect-[16/9] w-full max-w-md mx-auto overflow-hidden">
                      <img
                        src="/real_3.jpg"
                        alt="Học sinh nhẹ nhõm sau khi trút bỏ áp lực bài vở"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,black_45%,rgba(0,0,0,0.85)_65%,rgba(0,0,0,0.3)_85%,transparent_100%)]"
                      />
                      {/* Ultra-smooth multi-stop gradual fade overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 via-white/10 to-transparent pointer-events-none" />
                    </div>

                    <div className="p-6 sm:p-7 pt-2 text-center relative z-10 bg-white">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold border mb-3 shadow-xs ${res.badgeColor}`}>
                        {res.level}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-2">
                        Tổng điểm đánh giá: {totalScore}/15
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                        {res.summary}
                      </p>
                    </div>
                  </div>

                  {/* Tips Checklist */}
                  <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>Gợi ý chăm sóc bản thân dành riêng cho bạn:</span>
                    </div>
                    <div className="space-y-2">
                      {res.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      onClick={handleRestart}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Làm lại bài test</span>
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={onNavigateToMailbox}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition-all"
                      >
                        Viết thư mật danh
                      </button>
                      <button
                        onClick={onNavigateToChat}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1"
                      >
                        <span>Chat với Tâm An</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

      </div>
    </section>
  );
};
