import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind, Heart, Sparkles, Volume2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // 4-7-8 Breathing Technique for calming nervous system
  // Inhale: 4s, Hold: 7s (or 4s for beginners), Exhale: 8s (or 6s)
  const PHASES = {
    inhale: { label: 'Hít vào nhẹ nhàng bằng mũi', duration: 4, next: 'hold' as const, color: 'text-sky-600', ring: 'scale-125 border-sky-400 bg-sky-100/60' },
    hold: { label: 'Giữ hơi và thả lỏng hai vai', duration: 4, next: 'exhale' as const, color: 'text-blue-600', ring: 'scale-125 border-blue-400 bg-blue-100/60' },
    exhale: { label: 'Thở ra chậm rãi qua miệng', duration: 6, next: 'pause' as const, color: 'text-teal-600', ring: 'scale-90 border-teal-300 bg-teal-50/40' },
    pause: { label: 'Nghỉ ngơi và cảm nhận lồng ngực', duration: 2, next: 'inhale' as const, color: 'text-indigo-600', ring: 'scale-100 border-indigo-200 bg-indigo-50/30' },
  };

  useEffect(() => {
    let timer: any = null;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            const nextPhase = PHASES[phase].next;
            setPhase(nextPhase);
            if (nextPhase === 'inhale') {
              setCyclesCompleted((c) => c + 1);
            }
            soundEngine.playCalmBell();
            return PHASES[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(PHASES.inhale.duration);
    setCyclesCompleted(0);
  };

  const currentPhaseInfo = PHASES[phase];

  return (
    <section id="breathing-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-100 shadow-sm text-center relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 mb-3">
          <Wind className="w-3.5 h-3.5" />
          <span>Kỹ Thuật Thở 4-4-6 Xoa Dịu Hệ Thần Kinh</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          Góc Thở Bình Yên
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Khi cảm thấy tim đập nhanh, hoảng sợ trước giờ thi hoặc nghẹn ngào vì buồn tủi, hãy dành 2 phút cùng bài tập thở này nhé.
        </p>

        {/* Visual Breathing Ring */}
        <div className="my-10 flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            
            {/* Outer animated ripple */}
            <div 
              className={`absolute inset-0 rounded-full border-4 border-dashed transition-all duration-1000 ${
                isActive ? currentPhaseInfo.ring : 'scale-100 border-sky-200 bg-sky-50/30'
              }`}
            />

            {/* Inner Content Bubble */}
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-white shadow-xl shadow-sky-100 border border-sky-100 flex flex-col items-center justify-center p-4 transition-all duration-700">
              <span className="text-3xl mb-1">
                {phase === 'inhale' ? '🌸' : phase === 'hold' ? '✨' : phase === 'exhale' ? '🍃' : '💙'}
              </span>
              <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${currentPhaseInfo.color}`}>
                {isActive ? `${secondsLeft}s` : 'Bắt đầu'}
              </span>
              <span className="text-xs font-bold text-slate-700 mt-1 max-w-[140px] leading-tight">
                {isActive ? currentPhaseInfo.label : 'Nhấn nút phía dưới'}
              </span>
            </div>

          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              if (!isActive) soundEngine.playCalmBell();
              setIsActive(!isActive);
            }}
            className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
              isActive 
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' 
                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sky-200'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Tạm dừng thở' : 'Bắt đầu bài tập thở'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            title="Làm lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Counter of cycles */}
        {cyclesCompleted > 0 && (
          <div className="mt-5 text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1.5 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Tuyệt vời! Bạn đã hoàn thành {cyclesCompleted} chu kỳ thở rồi. Cơ thể bạn đang thư giãn hơn đấy!</span>
          </div>
        )}

      </div>
    </section>
  );
};
