import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  BrainCircuit,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  User,
  Flame,
  FileText
} from 'lucide-react';
import { MonthDataset } from '../data/revenueData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentTask?: string;
  suggestions?: string[];
}

interface AIAgentViewProps {
  monthlyDatasets: MonthDataset[];
}

export const AIAgentView: React.FC<AIAgentViewProps> = ({ monthlyDatasets }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Xin chào! Tôi là **Tâm Đức Smile AI Agent** 🤖 — Trợ lý điều hành & Tăng trưởng Performance Marketing thông minh của phòng khám.

Tôi có thể hỗ trợ bạn trực tiếp các nhiệm vụ thực chiến:
* 📊 **Phân tích hiệu suất doanh thu & chi phí Google Ads** theo từng tháng và khu vực.
* 🎯 **Tối ưu chiến dịch Ads**: Giảm chi phí CPA, phân bổ ngân sách giờ vàng, nâng cao chất lượng Lead.
* 🦷 **Chiến lược dịch vụ mũi nhọn**: Phễu khách Răng Sứ, Trồng Răng Implant Toàn Hàm & Khách Kiều Bào.
* 📞 **Soạn kịch bản Telesales & Xử lý từ chối**: Tăng tỷ lệ khách đến phòng khám (Show-up Rate).

*Bạn muốn phân tích số liệu nào hay cần tôi lên kế hoạch gì hôm nay?*`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '📊 Phân tích hiệu quả chi phí Ads Tháng 9 & đề xuất cắt giảm lãng phí',
        '🦷 Lên kế hoạch kéo khách Việt Kiều về nước làm Implant dịp hè/tết',
        '🎯 Kịch bản Telesales xử lý khách chê giá Răng Sứ cao',
        '💡 Đề xuất 3 chiến dịch Google Ads tăng đột phá doanh thu',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPresetMode, setSelectedPresetMode] = useState<'growth' | 'ads' | 'telesales' | 'audit'>('growth');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Copy text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Build context summaries from actual loaded datasets
  const getPreparedContextData = () => {
    const summaryList = (monthlyDatasets || []).map((ds) => {
      const totalRev = ds.regions.reduce((s, r) => s + (r.revenue || 0), 0);
      const totalCost = ds.regions.reduce((s, r) => s + (r.costVAT || 0), 0);
      const totalData = ds.regions.reduce((s, r) => s + (r.customerData || 0), 0);
      const ratio = totalRev > 0 ? ((totalCost / totalRev) * 100).toFixed(1) : '0';
      return {
        month: ds.label,
        totalRevenue: totalRev,
        totalCostVAT: totalCost,
        costRatioPercent: `${ratio}%`,
        totalCustomerLeads: totalData,
        regionCount: ds.regions.length,
      };
    });

    return {
      monthlySummaries: summaryList,
      note: 'Dữ liệu trực tiếp từ bảng số liệu doanh thu & chi phí hệ thống Nha khoa Tâm Đức Smile.',
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const historyPayload = messages.concat(userMessage).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const contextData = getPreparedContextData();

      const response = await fetch('/api/ai-agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          contextData,
          agentPersona: selectedPresetMode,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Lỗi xử lý phản hồi từ AI Agent');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        agentTask: 'Tự động tổng hợp số liệu & đề xuất kế hoạch thực thi',
        suggestions: [
          'Chi tiết hóa bước hành động tiếp theo',
          'Soạn thông điệp quảng cáo (Ad Copy) cho ý tưởng trên',
          'Ước tính ngân sách và tỷ lệ ROI dự kiến',
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Không thể kết nối đến AI Agent lúc này.**\n\n*Chi tiết:* ${err.message || 'Lỗi mạng hoặc hệ thống đang bận.'}\n\n*Vui lòng thử lại hoặc chọn câu hỏi gợi ý khác.*`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Đã làm mới phiên làm việc. Tôi sẵn sàng nhận lệnh mới từ bạn!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '📊 Đánh giá tổng quan hiệu suất các tháng',
          '🦷 Chiến lược đẩy mạnh Trồng Răng Implant Toàn Hàm All-on-4',
          '💰 Phân tích tỷ lệ chi phí Ads / Doanh thu',
        ],
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* 1. Header of AI Agent Tab */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-cyan-400/40">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 ring-2 ring-emerald-500/30 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Tâm Đức Smile AI Agent
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/30">
                  Gemini 3.7 Pro Agent
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Trợ lý Điều hành Tăng trưởng & Phân tích Dữ liệu Marketing Thời gian thực
            </p>
          </div>
        </div>

        {/* Quick Mode Filters & Action buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setSelectedPresetMode('growth')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPresetMode === 'growth'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Growth
            </button>
            <button
              onClick={() => setSelectedPresetMode('ads')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPresetMode === 'ads'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎯 Google Ads
            </button>
            <button
              onClick={() => setSelectedPresetMode('telesales')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPresetMode === 'telesales'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📞 Telesales
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
            title="Làm mới đoạn hội thoại"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md ring-1 ring-cyan-400/30 mt-1">
                  <BrainCircuit className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 shadow-lg relative group ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Agent Header Tag */}
                {!isUser && message.agentTask && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 mb-2 pb-2 border-b border-slate-800">
                    <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                    <span>{message.agentTask}</span>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                  {message.content}
                </div>

                {/* Bottom Metadata & Copy */}
                <div className="flex items-center justify-between mt-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/40">
                  <span>{message.timestamp}</span>

                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    title="Sao chép nội dung"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-medium">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px] hidden sm:inline">Sao chép</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Follow-up Quick Chips */}
                {!isUser && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/70">
                    <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Gợi ý tiếp theo:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sug)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all text-left flex items-center gap-1"
                        >
                          <span>{sug}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md ring-1 ring-cyan-400/30 animate-pulse">
              <BrainCircuit className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-lg text-slate-300 text-sm flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-400 font-medium">
                AI Agent đang phân tích số liệu phòng khám & tạo giải pháp tối ưu...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input & Action Bar */}
      <div className="p-4 bg-slate-900/95 border-t border-slate-800 shrink-0 space-y-3">
        {/* Quick Question Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Hỏi nhanh:
          </span>
          <button
            onClick={() => handleSendMessage('Đánh giá chi phí VAT / Doanh thu từng tháng có an toàn không?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all shrink-0 whitespace-nowrap"
          >
            📊 Đánh giá tỷ lệ chi phí Ads
          </button>
          <button
            onClick={() => handleSendMessage('Lên phác đồ kéo khách Việt Kiều về làm Răng Sứ & Implant All-on-4')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all shrink-0 whitespace-nowrap"
          >
            🦷 Chiến lược Khách Việt Kiều
          </button>
          <button
            onClick={() => handleSendMessage('Kịch bản telesales tư vấn xử lý khi khách hàng so sánh giá với phòng khám khác')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all shrink-0 whitespace-nowrap"
          >
            📞 Xử lý từ chối giá Telesales
          </button>
        </div>

        {/* Text Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Nhập câu hỏi, yêu cầu phân tích số liệu hoặc nhờ AI soạn chiến lược..."
            className="flex-1 px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0"
          >
            <span>Gửi Lệnh</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
