import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Wind, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/audio';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

const PHASES: Record<
  BreathingPhase,
  {
    label: string;
    duration: number;
    next: BreathingPhase;
    color: string;
    ring: string;
  }
> = {
  inhale: {
    label: 'Hít vào nhẹ nhàng bằng mũi',
    duration: 4,
    next: 'hold',
    color: 'text-sky-600',
    ring: 'scale-125 border-sky-400 bg-sky-100/60',
  },
  hold: {
    label: 'Giữ hơi và thả lỏng hai vai',
    duration: 4,
    next: 'exhale',
    color: 'text-blue-600',
    ring: 'scale-125 border-blue-400 bg-blue-100/60',
  },
  exhale: {
    label: 'Thở ra chậm rãi qua miệng',
    duration: 6,
    next: 'pause',
    color: 'text-teal-600',
    ring: 'scale-90 border-teal-300 bg-teal-50/40',
  },
  pause: {
    label: 'Nghỉ ngơi và cảm nhận lồng ngực',
    duration: 2,
    next: 'inhale',
    color: 'text-indigo-600',
    ring: 'scale-100 border-indigo-200 bg-indigo-50/30',
  },
};

export const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(PHASES.inhale.duration);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [justCelebrated, setJustCelebrated] = useState(false);

  const phaseRef = useRef<BreathingPhase>(phase);
  const secondsRef = useRef<number>(secondsLeft);
  phaseRef.current = phase;
  secondsRef.current = secondsLeft;

  // Manage gentle cheerful background music based on active & musicEnabled state
  useEffect(() => {
    if (isActive && musicEnabled) {
      soundEngine.startBreathingMusic();
    } else {
      soundEngine.stopBreathingMusic();
    }
    return () => {
      soundEngine.stopBreathingMusic();
    };
  }, [isActive, musicEnabled]);

  // Breathing timer loop (side-effects safely outside React state updaters)
  useEffect(() => {
    if (!isActive) return;

    const timer = window.setInterval(() => {
      if (secondsRef.current <= 1) {
        const nextPhase = PHASES[phaseRef.current].next;
        const nextDuration = PHASES[nextPhase].duration;

        phaseRef.current = nextPhase;
        secondsRef.current = nextDuration;
        setPhase(nextPhase);
        setSecondsLeft(nextDuration);

        if (nextPhase === 'inhale') {
          // Completed 1 full breathing cycle!
          setCyclesCompleted((c) => c + 1);
          setJustCelebrated(true);
          soundEngine.playCelebrationChime();
          window.setTimeout(() => setJustCelebrated(false), 3000);
        } else {
          soundEngine.playSoftPhaseCue(nextPhase);
        }
      } else {
        const nextSec = secondsRef.current - 1;
        secondsRef.current = nextSec;
        setSecondsLeft(nextSec);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isActive]);

  const handleTogglePlay = () => {
    if (!isActive) {
      soundEngine.playSoftPhaseCue(phase);
    }
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    soundEngine.stopBreathingMusic();
    phaseRef.current = 'inhale';
    secondsRef.current = PHASES.inhale.duration;
    setPhase('inhale');
    setSecondsLeft(PHASES.inhale.duration);
    setCyclesCompleted(0);
    setJustCelebrated(false);
  };

  const currentPhaseInfo = PHASES[phase];

  return (
    <section id="breathing-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-100 shadow-sm text-center relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 mb-3">
          <Wind className="w-3.5 h-3.5" />
          <span>Kỹ Thuật Thở 4-4-6 Kết Hợp Nhạc Thư Giãn Nhẹ Nhàng</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          Góc Thở Bình Yên
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Khi cảm thấy tim đập nhanh, hoảng sợ trước giờ thi hoặc nghẹn ngào vì buồn tủi, hãy dành 2 phút cùng bài tập thở và giai điệu nhẹ nhàng, vui tươi này nhé.
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
            <div className={`relative w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-white shadow-xl border flex flex-col items-center justify-center p-4 transition-all duration-700 ${
              justCelebrated ? 'border-emerald-300 shadow-emerald-100 scale-105' : 'border-sky-100 shadow-sky-100'
            }`}>
              <span className="text-3xl mb-1">
                {justCelebrated ? '🎉' : phase === 'inhale' ? '🌸' : phase === 'hold' ? '✨' : phase === 'exhale' ? '🍃' : '💙'}
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
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleTogglePlay}
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
            onClick={() => setMusicEnabled((prev) => !prev)}
            className={`px-4 py-3 rounded-2xl font-semibold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
              musicEnabled
                ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
            title={musicEnabled ? 'Tắt nhạc nền vui tươi' : 'Bật nhạc nền nhẹ nhàng, vui tươi'}
          >
            {musicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{musicEnabled ? 'Nhạc nhẹ nhàng: Bật' : 'Nhạc nền: Tắt'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            title="Làm lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Counter of cycles with celebration feedback */}
        {cyclesCompleted > 0 && (
          <div className={`mt-5 text-xs font-semibold flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl mx-auto w-fit transition-all ${
            justCelebrated
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 scale-105 shadow-xs'
              : 'text-emerald-700'
          }`}>
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Chúc mừng! Bạn đã hoàn thành {cyclesCompleted} chu kỳ thở rồi. Cơ thể và tâm trí bạn đang nhẹ nhàng, thư thái hơn đấy!
            </span>
          </div>
        )}

      </div>
    </section>
  );
};
