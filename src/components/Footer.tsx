import React from 'react';
import { Heart, ShieldCheck, PhoneCall, Sparkles, GraduationCap, Home, Users, Mail } from 'lucide-react';
import { CategoryType } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryType) => void;
  onOpenMailbox: () => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenMailbox,
  onOpenEmergency
}) => {
  return (
    <footer className="bg-white border-t border-sky-100 pt-12 pb-8 mt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-sky-50">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xs">
                <span>🌿</span>
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                Tâm An Học Đường
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trang web tư vấn tâm lý phi lợi nhuận dành riêng cho học sinh cấp trung học cơ sở và trung học phổ thông. Nơi lắng nghe, thấu cảm và chắp cánh ước mơ.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Ẩn danh & Bảo mật</span>
            </div>
          </div>

          {/* 3 Main Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              3 Trục Tư Vấn Chính
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('school')}
                  className="hover:text-sky-600 flex items-center gap-1.5 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
                  <span>Tâm lý Học đường & Thi cử</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('family')}
                  className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                >
                  <Home className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tâm lý Gia đình & Cha mẹ</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('social')}
                  className="hover:text-teal-600 flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-teal-500" />
                  <span>Tâm lý Xã hội & Bạn bè</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMailbox}
                  className="hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Hòm thư mật danh chuyên gia</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Hotline & Safety */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Đường Dây Nóng Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="block font-bold text-slate-700">Tổng đài 111 (Quốc gia):</span>
                <span className="text-slate-500 text-[11px]">Bảo vệ trẻ em, bạo lực học đường (24/7)</span>
              </li>
              <li>
                <span className="block font-bold text-slate-700">Tổng đài Ngày Mai:</span>
                <span className="text-slate-500 text-[11px]">096 306 1414 (Tư vấn khủng hoảng)</span>
              </li>
              <li className="pt-1">
                <button
                  onClick={onOpenEmergency}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Xem số tổng đài khẩn cấp</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Supportive note */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Thông Điệp Gửi Bạn
            </h4>
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 leading-relaxed">
              <p className="italic">
                "Dù hôm nay có khó khăn đến thế nào, hãy nhớ rằng bạn luôn có giá trị và xứng đáng được yêu thương. Cứ tiến lên từng bước nhỏ một nhé!"
              </p>
              <div className="mt-2 text-right font-bold text-[11px] text-sky-700">
                — Đội ngũ Tâm An 💙
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>
            © 2026 Tâm An Học Đường. Dự án tâm lý đồng hành cùng thanh thiếu niên Việt Nam.
          </p>
          <p className="text-center sm:text-right">
            Trang web hỗ trợ tham vấn tâm lý học đường, không thay thế chẩn đoán y khoa tâm thần.
          </p>
        </div>

      </div>
    </footer>
  );
};
