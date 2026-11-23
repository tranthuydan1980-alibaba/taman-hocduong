import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Bot, 
  User, 
  RefreshCw, 
  Trash2, 
  PhoneCall,
  Heart,
  Smile,
  ShieldCheck
} from 'lucide-react';
import { ChatMessage } from '../types';
import { soundEngine } from '../utils/audio';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenEmergency: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onOpenChange,
  onOpenEmergency
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const initialGreeting: ChatMessage = {
    id: 'msg-init-1',
    role: 'assistant',
    text: 'Chào bạn! Mình là Tâm An 🌿 - Trợ lý tâm lý túc trực 24/7 dành riêng cho học sinh cấp 2 & cấp 3.\n\nKhông gian này hoàn toàn an toàn và bí mật. Bất kể bạn đang gặp chuyện gì về trường lớp, gia đình hay bạn bè, mình luôn ở đây lắng nghe. Bạn muốn chia sẻ điều gì hôm nay?',
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    suggestedActions: [
      'Áp lực điểm số & thi cử',
      'Cãi nhau với bố mẹ',
      'Bị bạn bè cô lập',
      'Bài tập thở giảm stress'
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    soundEngine.playCalmBell();

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build conversation payload for backend
      const payload = messages.concat(userMsg).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Không thể kết nối tới Tâm An 24/7');
      }
    } catch (e: any) {
      console.error('Chatbot API error:', e);
      const errMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        text: e?.message || 'Kết nối tới Tâm An 24/7 đang tạm gián đoạn. Bạn vui lòng thử gửi lại tin nhắn sau giây lát nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Bạn muốn bắt đầu lại cuộc trò chuyện mới với Tâm An?')) {
      setMessages([initialGreeting]);
    }
  };

  return (
    <>
      {/* Floating Decorative Owl & Label (non-interactive, cannot be clicked or touched) */}
      {!isOpen && (
        <div
          aria-hidden="true"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-3 pointer-events-none select-none"
        >
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-sky-200 text-xs font-bold text-sky-800 relative">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Tâm An 24/7 • Luôn lắng nghe</span>
          </div>

          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-sky-300 flex items-center justify-center relative">
            <span className="text-2xl">🦉</span>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 bg-white shadow-2xl rounded-3xl border border-sky-100 flex flex-col overflow-hidden transition-all duration-300 animate-fadeIn ${
            isExpanded
              ? 'inset-4 sm:inset-10 md:inset-16 w-auto h-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shadow-xs">
                🦉
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm sm:text-base tracking-wide">
                    Tâm An 24/7
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-sky-100 flex items-center gap-1">
                  <span>Trợ lý tâm lý học trò • Phản hồi tức thì</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Làm mới trò chuyện"
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/90 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/90 hover:text-white transition-all hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onOpenChange(false)}
                title="Đóng chat"
                className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Privacy & Safety Notification Banner */}
          <div className="px-3.5 py-1.5 bg-sky-50 border-b border-sky-100 flex items-center justify-between text-[11px] text-sky-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Bảo mật 100% • Không lưu danh tính</span>
            </span>
            <button
              onClick={onOpenEmergency}
              className="text-rose-600 hover:underline font-bold flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>SOS: 111</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xs shrink-0 mb-1">
                        🦉
                      </div>
                    )}
                    
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        isAssistant
                          ? 'bg-white text-slate-800 shadow-sm border border-sky-100 rounded-bl-xs'
                          : 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white rounded-br-xs shadow-sm shadow-sky-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Suggested Quick Prompts */}
                  {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          className="text-[11px] px-2.5 py-1 rounded-xl bg-sky-100/70 hover:bg-sky-200 text-sky-800 border border-sky-200 transition-all text-left font-medium"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-sky-600 bg-white p-2.5 rounded-2xl border border-sky-100 w-fit">
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px] text-slate-500">Tâm An đang gõ lời hồi đáp...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-sky-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhắn tin với Tâm An (Ví dụ: Mình thấy mệt mỏi quá...)"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-sky-50/50 border border-sky-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Luôn tôn trọng, lắng nghe và đồng hành</span>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
