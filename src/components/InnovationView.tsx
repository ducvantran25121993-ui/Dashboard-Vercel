import React, { useState } from 'react';
import {
  Lightbulb,
  Rocket,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Target,
  Plus,
  CheckCircle2,
  ListFilter,
  Wand2,
  Layers,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export interface InitiativeItem {
  id: number | string;
  title: string;
  target: string;
  description: string;
  status: string;
  statusColor?: string;
  owner: string;
  impact: string;
  leadsEstimate?: string;
  keyActions?: string[];
}

const DEFAULT_CARDS: InitiativeItem[] = [
  {
    id: 1,
    title: 'Gói Implant Kiều Bào "3 Ngày Hoàn Tất Trước Khi Bay"',
    target: 'Tối ưu phễu khách Việt Kiều về nước thăm thân / nghỉ hè',
    description: 'Ứng dụng công nghệ máng hướng dẫn phẫu thuật định vị 3D giúp cấy ghép Implant tức thì, rút ngắn thời gian điều trị an toàn cho kiều bào Mỹ, Úc, Canada.',
    status: 'Đang test',
    statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    owner: 'Team Bác Sĩ & CSKH Kiều Bào',
    impact: '+35% Doanh thu Việt Kiều',
    leadsEstimate: '180+ case/tháng',
    keyActions: [
      'Gửi phác đồ điều trị ảo & dự toán viện phí chi tiết qua Zalo / WhatsApp trước 30 ngày',
      'Miễn phí dịch vụ đưa đón xe riêng từ sân bay Tân Sơn Nhất về phòng khám',
      'Cấp thẻ bảo hành điện tử quốc tế truy xuất mã vạch trụ Implant chính hãng',
    ],
  },
  {
    id: 2,
    title: 'Chiến Dịch Google Ads "Thẩm Mỹ Nụ Cười Công Sở — Trả Góp 0%"',
    target: 'Thu hút tệp khách hàng văn phòng, kinh doanh làm Răng Sứ thẩm mỹ',
    description: 'Chạy nhóm từ khóa bọc răng sứ, dán sứ veneer không mài nhỏ với chính sách trả góp qua thẻ tín dụng 0% lãi suất, liên kết 25 ngân hàng.',
    status: 'Đã triển khai',
    statusColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    owner: 'Team Google Ads Performance',
    impact: '+28% Tỷ lệ chốt hợp đồng',
    leadsEstimate: '450+ lead chất lượng/tháng',
    keyActions: [
      'Tập trung quảng cáo Search & Performance Max vào bán kính 15km quanh phòng khám',
      'Gắn bảng tính số tiền trả góp hàng tháng (chỉ từ 990k/tháng) ngay trên landing page',
      'Remarketing tệp khách hàng đã xem bảng giá nhưng chưa để lại số điện thoại',
    ],
  },
  {
    id: 3,
    title: 'Landing Page VIP Cá Nhân Hóa Theo Dịch Vụ Cấp Cao',
    target: 'Hạ chi phí CPA Google Ads xuống dưới 12% tổng doanh thu dịch vụ',
    description: 'Tách biệt trang đích dành riêng cho Trồng Răng Implant Toàn Hàm All-on-4 / All-on-6 với giao diện sang trọng, video chứng thực người thật việc thật.',
    status: 'Tối ưu A/B',
    statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    owner: 'Team Tech & CRO',
    impact: '-15% Chi phí VAT Google Ads',
    leadsEstimate: 'Tối ưu chi phí ra lead',
    keyActions: [
      'Tối ưu tốc độ tải trang Mobile đạt dưới 1.5s và trải nghiệm form đăng ký 1 chạm',
      'Tích hợp nút gọi hotline cấp cứu / tư vấn chuyên môn trực tiếp cùng Bác sĩ Trưởng',
      'A/B Testing tiêu đề cam kết: "Không Đau — Bền Trọn Đời" vs "Ăn Nhai Tức Thì Sau 48h"',
    ],
  },
  {
    id: 4,
    title: 'Hệ Thống Phân Bổ Ngân Sách Smart-Bidding Theo "Giờ Vàng Đặt Hẹn"',
    target: 'Tối đa hóa số ca đăng ký vào khung giờ khách rảnh rỗi lướt web',
    description: 'Cấu hình tự động tăng 25% giá thầu từ khóa vào các khung giờ vàng (11h30 - 13h30 trưa và 19h30 - 22h30 tối) khi tỷ lệ gọi điện tư vấn đạt đỉnh.',
    status: 'Đang test',
    statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    owner: 'Team Quảng Cáo Số',
    impact: '+16% Lượng chuyển đổi đặt lịch',
    leadsEstimate: 'Tiết kiệm 10% ngân sách thừa',
    keyActions: [
      'Giảm 40% ngân sách vào khung giờ đêm muộn (0h - 6h) do tỷ lệ phản hồi thấp',
      'Đồng bộ dữ liệu thời gian thực giữa CRM phòng khám và Google Ads Conversion API',
      'Tập trung từ khóa có ý định chuyển đổi cao như "địa chỉ trồng răng uy tín gần đây"',
    ],
  },
  {
    id: 5,
    title: 'Trợ Lý Ảo AI Phân Loại & Đề Xuất Kịch Bản Telesales Tức Thì',
    target: 'Nâng tỷ lệ khách đến phòng khám thực tế sau khi để lại số điện thoại',
    description: 'AI tự động quét nhu cầu khách hàng từ form quảng cáo (loại răng, mức ngân sách, tình trạng mất răng) để gợi ý kịch bản tư vấn phù hợp nhất cho nhân viên telesales.',
    status: 'Đang phát triển',
    statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    owner: 'Team Chuyển Đổi Số & Sales',
    impact: '+22% Tỉ lệ đến phòng khám (Show-up Rate)',
    leadsEstimate: 'Tự động hóa 100% phễu',
    keyActions: [
      'Nhắc lịch tự động trước 24h và 2h qua Zalo ZNS có kèm định vị chỉ đường Google Map',
      'Cung cấp bảng so sánh ưu nhược điểm các dòng trụ Thụy Sĩ, Mỹ, Hàn Quốc cho Sales',
      'Gửi voucher khám tổng quát & chụp phim CT Cone Beam 3D miễn phí trị giá 1.500.000đ',
    ],
  },
  {
    id: 6,
    title: 'Chuỗi Video Thực Tế Bác Sĩ Tháo Gỡ Nỗi Sợ "Trồng Răng Đau"',
    target: 'Xóa bỏ rào cản tâm lý sợ đau cho khách hàng lớn tuổi trồng Implant',
    description: 'Sản xuất video ngắn chia sẻ quy trình gây tê vi điểm không đau, phỏng vấn trực tiếp cảm nghĩ của bệnh nhân 60-70 tuổi ngay sau khi cấy trụ.',
    status: 'Đã triển khai',
    statusColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    owner: 'Team Truyền Thông & Studio',
    impact: '+30% Lòng tin & Tỷ lệ ra quyết định',
    leadsEstimate: '300+ tương tác/video',
    keyActions: [
      'Quảng cáo định dạng Youtube Video Action & Reels tiếp cận người nhà bệnh nhân',
      'Chia sẻ quy trình kiểm soát vô trùng chuẩn quốc tế tại phòng mổ chuyên biệt',
      'Tặng gói chăm sóc răng định kỳ trọn đời cho người thân đi cùng',
    ],
  },
];

const FOCUS_PRESETS = [
  'Đẩy mạnh Trồng Răng Implant & Toàn Hàm',
  'Tăng tốc Thu Khách Việt Kiều Về Nước',
  'Bứt phá Doanh Thu Răng Sứ Thẩm Mỹ',
  'Tối ưu Chi Phí Google Ads & Giảm CPA',
  'Tăng Tỉ Lệ Chuyển Đổi Lead Thành Lịch Khám',
];

export const InnovationView: React.FC = () => {
  const [cards, setCards] = useState<InitiativeItem[]>(DEFAULT_CARDS);
  const [selectedPreset, setSelectedPreset] = useState<string>(FOCUS_PRESETS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Form state for manual new initiative
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOwner, setNewOwner] = useState('Team Ads & Growth');
  const [newImpact, setNewImpact] = useState('+15% Tăng trưởng');
  const [newStatus, setNewStatus] = useState('Đang test');

  const handleGenerateAI = async (focusText?: string) => {
    setIsGenerating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const topicToUse = focusText || customPrompt || selectedPreset;

    try {
      const res = await fetch('/api/generate-initiatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          focusTopic: topicToUse,
          currentMetrics: {
            goal: 'Tăng trưởng doanh thu & Giữ tỷ lệ Chi phí/Doanh thu <= 15%',
            currentServices: ['Implant', 'Răng Sứ', 'Việt Kiều', 'Tẩy Trắng', 'Chỉnh Nha'],
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Có lỗi xảy ra khi gọi AI');
      }

      if (Array.isArray(data.initiatives) && data.initiatives.length > 0) {
        const mappedList: InitiativeItem[] = data.initiatives.map((item: any, idx: number) => {
          let statusColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
          if (item.status?.includes('test') || item.status?.includes('Đang')) {
            statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
          } else if (item.status?.includes('triển khai') || item.status?.includes('Đã')) {
            statusColor = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
          } else if (item.status?.includes('A/B') || item.status?.includes('Tối ưu')) {
            statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
          }

          return {
            id: Date.now() + idx,
            title: item.title,
            target: item.target,
            description: item.description,
            status: item.status || 'Đề xuất mới',
            statusColor,
            owner: item.owner || 'Team Growth & Ads',
            impact: item.impact || '+20% Hiệu quả',
            leadsEstimate: item.leadsEstimate || 'Đột phá mới',
            keyActions: item.keyActions || [],
          };
        });

        setCards(mappedList);
        setSuccessMsg(`Đã tạo thành công ${mappedList.length} sáng kiến mới từ AI cho chủ đề: "${topicToUse}"`);
      } else {
        throw new Error('Dữ liệu AI trả về không đúng định dạng');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Không thể kết nối với hệ thống AI. Vui lòng kiểm tra lại cấu hình.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetDefault = () => {
    setCards(DEFAULT_CARDS);
    setSuccessMsg('Đã khôi phục về danh sách 6 sáng kiến tiêu chuẩn.');
    setErrorMsg(null);
  };

  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (newStatus === 'Đã triển khai') statusColor = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
    if (newStatus === 'Tối ưu A/B') statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';

    const newItem: InitiativeItem = {
      id: Date.now(),
      title: newTitle,
      target: newTarget || 'Tăng trưởng doanh thu & tối ưu khách hàng',
      description: newDesc || 'Kế hoạch thử nghiệm nội bộ phòng khám.',
      owner: newOwner,
      status: newStatus,
      statusColor,
      impact: newImpact,
      leadsEstimate: 'Thử nghiệm',
    };

    setCards([newItem, ...cards]);
    setNewTitle('');
    setNewTarget('');
    setNewDesc('');
    setShowAddForm(false);
    setSuccessMsg('Đã thêm thành công sáng kiến mới vào danh sách!');
  };

  const filteredCards = cards.filter((card) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'test') return card.status.toLowerCase().includes('test');
    if (activeFilter === 'deployed') return card.status.toLowerCase().includes('triển khai');
    if (activeFilter === 'ab') return card.status.toLowerCase().includes('a/b') || card.status.toLowerCase().includes('tối ưu');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Sáng Tạo & Đổi Mới
            </span>
            <span className="text-xs text-slate-400 font-medium">Đi tìm cái CHƯA CÓ — sinh động</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Growth Lab — Phòng Thử Nghiệm Sáng Kiến Đổi Mới
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Sử dụng trí tuệ nhân tạo (Gemini AI) để tự động phân tích bối cảnh, đề xuất ý tưởng thử nghiệm mới, tối ưu chi phí Google Ads và tăng tỷ lệ chuyển đổi khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-center">
            <span className="text-2xl font-black text-indigo-300">{cards.length}</span>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Sáng Kiến Đang Quản Lý</p>
          </div>
        </div>
      </div>

      {/* 2. AI Generator Control Center */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Tính Năng AI Gợi Ý Sáng Kiến Tự Động</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Gemini 3.7 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400">Chọn chủ đề hoặc nhập bài toán bạn muốn AI đề xuất giải pháp</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showAddForm ? 'Đóng Form' : 'Tự Viết Sáng Kiến'}</span>
            </button>
            <button
              onClick={handleResetDefault}
              title="Khôi phục về 6 sáng kiến chuẩn ban đầu"
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Mặc Định</span>
            </button>
          </div>
        </div>

        {/* Preset quick buttons */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Chọn mục tiêu trọng tâm để AI tạo ý tưởng đột phá:</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {FOCUS_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset;
              return (
                <button
                  key={preset}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setCustomPrompt('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/70 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom prompt input & action button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Hoặc nhập yêu cầu riêng (Ví dụ: Đẩy mạnh khách hàng Răng Sứ khu vực Miền Tây, tối ưu chi phí Ads dưới 10%)..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={() => handleGenerateAI()}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI Đang Phân Tích & Đề Xuất...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-cyan-200" />
                <span>Tạo Sáng Kiến Mới Với AI</span>
              </>
            )}
          </button>
        </div>

        {/* Notification alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Manual Add Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddNewCard} className="p-4 rounded-xl bg-slate-800/90 border border-indigo-500/30 space-y-3 mt-3 animate-in fade-in duration-200">
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              ✍️ Thêm Sáng Kiến Thủ Công
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Tên sáng kiến / dự án thử nghiệm..."
                required
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Mục tiêu (Ví dụ: Tăng 20% lượng khách VK đặt lịch)..."
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="Bộ phận phụ trách (Ví dụ: Team Ads)..."
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  placeholder="Hiệu quả kỳ vọng (+15% Doanh thu)..."
                  className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Đang test">Đang test</option>
                  <option value="Đã triển khai">Đã triển khai</option>
                  <option value="Tối ưu A/B">Tối ưu A/B</option>
                  <option value="Đề xuất mới">Đề xuất mới</option>
                </select>
              </div>
            </div>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Mô tả chi tiết cách thức thực hiện..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
              >
                Lưu Sáng Kiến
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Filter and Listing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Lọc theo trạng thái:</span>
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'test', label: 'Đang Test' },
              { id: 'deployed', label: 'Đã Triển Khai' },
              { id: 'ab', label: 'Tối Ưu A/B' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === f.id
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Hiển thị <span className="text-white font-bold">{filteredCards.length}</span> sáng kiến
        </div>
      </div>

      {/* 4. Grid of Innovation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg flex flex-col justify-between hover:border-indigo-500/40 hover:bg-slate-850/80 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                  #{index + 1}
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                    item.statusColor || 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                💡 {item.title}
              </h3>

              <div className="text-xs text-slate-300 space-y-1.5">
                <p className="text-rose-300 font-semibold flex items-start gap-1.5">
                  <span className="shrink-0">🎯</span>
                  <span>{item.target}</span>
                </p>
                <p className="text-slate-400 text-xs leading-relaxed pt-0.5">{item.description}</p>
              </div>

              {/* Key Action steps if generated by AI */}
              {item.keyActions && item.keyActions.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5 mt-2">
                  <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <Rocket className="w-3 h-3 text-indigo-400" /> Các bước hành động:
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {item.keyActions.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">{item.owner}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {item.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
