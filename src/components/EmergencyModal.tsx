import React from 'react';
import { X, PhoneCall, ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { EMERGENCY_HOTLINES } from '../data/counselingData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800">
              Hỗ Trợ Khẩn Cấp & Bảo Vệ Bạn
            </h3>
            <p className="text-xs text-slate-500">
              Bạn không hề đơn độc, luôn có những người sẵn lòng giúp đỡ bạn 24/7.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-800 leading-relaxed mb-5">
          <strong>Lưu ý quan trọng:</strong> Nếu bạn hoặc bạn bè đang trong tình huống nguy hiểm, bị xâm hại, bạo lực học đường nghiêm trọng hoặc có suy nghĩ tự làm tổn thương bản thân, xin hãy liên hệ ngay với các đường dây nóng dưới đây:
        </div>

        {/* Hotlines List */}
        <div className="space-y-3 mb-6">
          {EMERGENCY_HOTLINES.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 transition-all flex items-center justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {item.note}
                </p>
              </div>

              <a
                href={`tel:${item.number.replace(/\s+/g, '')}`}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm shrink-0 transition-transform active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{item.number}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Supportive Note */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Mọi cuộc gọi đến 111 đều hoàn toàn MIỄN PHÍ và được bảo mật tuyệt đối.</span>
          </p>
        </div>

      </div>
    </div>
  );
};
