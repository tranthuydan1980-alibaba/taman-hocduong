import React from 'react';
import { X, Bookmark, Trash2, Heart, Lightbulb, CheckCircle2, Wind } from 'lucide-react';
import { SavedAdviceItem } from '../types';

interface SavedAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedAdviceItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const SavedAdviceModal: React.FC<SavedAdviceModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  onRemoveItem,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 sm:p-7 shadow-2xl border border-sky-100 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Sổ Tay Lời Khuyên Của Bạn ({savedItems.length})
              </h3>
              <p className="text-xs text-slate-500">
                Những lời nhắn nhủ và giải pháp chữa lành bạn đã lưu lại
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedItems.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-rose-600 transition-colors px-2 py-1"
                title="Xóa tất cả"
              >
                Xóa hết
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {savedItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-4xl mb-3">📖</div>
              <p className="text-sm font-semibold text-slate-600">Sổ tay của bạn hiện đang trống</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Khi nhận được lời khuyên từ mục tư vấn, hãy bấm vào biểu tượng chiếc dấu trang (Bookmark) để lưu lại đây nhé!
              </p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-sky-50/40 border border-sky-100 relative space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-sky-700 border border-sky-100">
                      {item.category === 'school' ? '🏫 Học đường' : item.category === 'family' ? '🏡 Gia đình' : '👥 Xã hội'} • {item.date}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1.5">
                      {item.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Xóa lời khuyên này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Empathy */}
                <p className="text-xs italic text-slate-600 bg-white/70 p-3 rounded-xl border border-sky-50">
                  "{item.advice.empathy}"
                </p>

                {/* Action steps summary */}
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="font-bold text-[11px] text-sky-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Các bước hành động:</span>
                  </div>
                  {item.advice.actionSteps.map((step, sIdx) => (
                    <div key={sIdx} className="pl-4 relative text-[11px] text-slate-600">
                      <span className="absolute left-1 top-0.5">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                {item.advice.soothingQuote && (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-medium">
                    "{item.advice.soothingQuote}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-sky-100 text-center shrink-0">
          <p className="text-[11px] text-slate-500">
            Dữ liệu được lưu trữ riêng tư trên thiết bị của bạn.
          </p>
        </div>

      </div>
    </div>
  );
};
