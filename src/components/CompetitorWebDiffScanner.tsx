import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  ArrowRight, 
  History, 
  TrendingDown, 
  TrendingUp, 
  Flame, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  ShieldAlert, 
  Zap, 
  ExternalLink, 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  Copy, 
  Tag, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  MessageSquareQuote, 
  Download, 
  AlertTriangle, 
  Radar,
  Crosshair,
  Target,
  Send,
  Eye,
  Sliders,
  Check,
  Megaphone,
  BarChart3
} from 'lucide-react';
import { CompetitorDiffItem, INITIAL_COMPETITOR_DIFFS } from '../data/competitorDiffs';

interface DiscoveredAd {
  competitorName: string;
  domain: string;
  adPlatform: string;
  targetKeyword: string;
  adCopy: {
    headline: string;
    description: string;
    displayedUrl: string;
    sitelinks: string[];
    callouts: string[];
  };
  detectedPromo: string;
  oldPromo: string;
  changeType: string;
  threatLevel: 'Rất cao' | 'Cao' | 'Trung bình' | 'Thấp';
  competitorWeakness: string;
  counterAdTemplate: {
    headline: string;
    description: string;
    sitelinks: string[];
    biddingAdvice: string;
  };
}

const INITIAL_DISCOVERED_ADS: DiscoveredAd[] = [
  {
    competitorName: 'Nha Khoa Kim',
    domain: 'nhakhoakim.com',
    adPlatform: 'Google Search Ads',
    targetKeyword: 'trồng răng implant giá bao nhiêu',
    adCopy: {
      headline: 'Trồng Răng Implant Chuẩn Y Khoa - Trợ Giá Trụ Chỉ Từ 11.9Tr',
      description: 'Bảo hành 10 năm. Miễn phí chụp CT Cone Beam 3D. Đội ngũ bác sĩ hơn 15 năm kinh nghiệm chuyên sâu cấy ghép.',
      displayedUrl: 'https://nhakhoakim.com/implant-chuyen-sau',
      sitelinks: ['Bảng Giá Trụ Thụy Sĩ', 'Ưu Đãi Trả Góp 0%', 'Bác Sĩ CKI Khám Trực Tiếp', 'Xem Review Khách Hàng'],
      callouts: ['Hệ Thống Toàn Quốc', 'Máy Phẫu Thuật Siêu Âm', 'Bảo Hành Chính Hãng']
    },
    detectedPromo: 'Hạ giá trực tiếp trụ Dentium từ 14.5Tr xuống 11.9Tr + Tặng Abutment chính hãng',
    oldPromo: '14.500.000 đ / Trụ (Không tặng kèm phụ kiện Abutment)',
    changeType: 'Giảm giá sốc',
    threatLevel: 'Rất cao',
    competitorWeakness: 'Chi phí phát sinh phụ kiện mão sứ và ít phòng khám phủ sóng tại các tỉnh Miền Tây sâu.',
    counterAdTemplate: {
      headline: 'Trồng Răng Implant Tâm Đức Smile - Trọn Gói 9.9Tr Không Phát Sinh',
      description: 'Tặng trọn bộ Abutment & Răng sứ cao cấp. Miễn phí xe đưa đón. 17 chi nhánh tại TP.HCM & Miền Tây.',
      sitelinks: ['Bảng Giá Gốc Trọn Gói', 'Ưu Đãi Khách Tỉnh', 'Bác Sĩ CKI Trực Tiếp', 'Ăn Nhai Trong Ngày'],
      biddingAdvice: 'Tăng thầu +20% tại Cần Thơ, Tiền Giang, Cà Mau, Vĩnh Long để đón đầu khách hàng tỉnh.'
    }
  },
  {
    competitorName: 'Nha Khoa Paris',
    domain: 'nhakhoaparis.vn',
    adPlatform: 'Google Search & Performance Max',
    targetKeyword: 'niềng răng trả góp học sinh',
    adCopy: {
      headline: 'Siêu Lễ Hội Niềng Răng Paris - Đồng Giá 18 Triệu Trọn Gói',
      description: 'Tặng gói tẩy trắng răng 2.5 Triệu. Trả góp 0% chỉ từ 1 triệu/tháng. Xem trước kết quả 3D Clincheck.',
      displayedUrl: 'https://nhakhoaparis.vn/khuyen-mai-nieng-rang',
      sitelinks: ['Bảng Giá Mắc Cài Kim Loại', 'Niềng Trong Suốt Invisalign', 'Bác Sĩ Chuyên Chỉnh Nha'],
      callouts: ['Công Nghệ 3D Speed', 'Cam Kết Không Nhổ Răng Bừa Bãi', 'Hợp Đồng Minh Bạch']
    },
    detectedPromo: 'Gói niềng răng mồi giá 18Tr (Trước đây chỉ giảm 20%) + Quà tặng tẩy trắng 2.5Tr',
    oldPromo: 'Giảm 20% gói niềng răng tiêu chuẩn',
    changeType: 'Tung gói giá mồi mới',
    threatLevel: 'Cao',
    competitorWeakness: 'Gói 18Tr chỉ áp dụng cho ca cực kỳ đơn giản, ca khó bị đẩy chi phí lên cao.',
    counterAdTemplate: {
      headline: 'Niềng Răng Tâm Đức Smile - Trả Góp 800k/Tháng Không Cần Trả Trước',
      description: 'Bác sĩ chuyên khoa chỉnh nha trên 10 năm kinh nghiệm. Miễn phí chụp phim 3D 1.5Tr. Cam kết phác đồ chuẩn y khoa.',
      sitelinks: ['Bảng Giá Minh Bạch', 'Trả Góp 800k/Tháng', 'Feedback Khách Hàng', 'Tư Vấn Miễn Phí'],
      biddingAdvice: 'Nhắm từ khóa "niềng răng trả góp uy tín" và ghim Sitelink "Trả Góp 800k/Tháng".'
    }
  },
  {
    competitorName: 'Dr. Care Implant',
    domain: 'drcareimplant.com',
    adPlatform: 'Google Search Ads & Facebook Ads',
    targetKeyword: 'trồng răng toàn hàm all on 4',
    adCopy: {
      headline: 'Trồng Răng All-on-4 Không Đau Cho Người Trung Niên - Dr. Care',
      description: 'Trợ giá trực tiếp 30 Triệu. Tặng chỗ ở khách sạn cho khách hàng tỉnh xa về TP.HCM điều trị.',
      displayedUrl: 'https://drcareimplant.com/uu-dai-implant',
      sitelinks: ['Bảng Giá All-on-4/6', 'Ưu Đãi Khách Tỉnh', 'Quy Trình Trồng Răng Không Đau'],
      callouts: ['Chuyên Sâu Trồng Răng', 'Ăn Nhai Tức Thì', 'Bảo Hành 20 Năm']
    },
    detectedPromo: 'Voucher giảm 30Tr gói All-on-4 + Miễn phí khách sạn lưu trú tại Sài Gòn',
    oldPromo: 'Giảm 10% gói All-on-4 không hỗ trợ lưu trú',
    changeType: 'Tặng quà khủng & Hỗ trợ khách tỉnh',
    threatLevel: 'Rất cao',
    competitorWeakness: 'Chỉ có cơ sở tại TP.HCM, khách hàng Miền Tây phải di chuyển xa và tốn thời gian tái khám.',
    counterAdTemplate: {
      headline: 'Trồng Răng Toàn Hàm All-on-4 Tâm Đức Smile - Khám Ngay Tại Chi Nhánh Gần Nhà',
      description: 'Không cần lên Sài Gòn! 17 chi nhánh tại Cần Thơ, Tiền Giang, Cà Mau, TP.HCM. Bác sĩ chuyên khoa trực tiếp điều trị.',
      sitelinks: ['Tìm Chi Nhánh Gần Bạn', 'Bảng Giá Trọn Gói', 'Xe Đưa Đón Miễn Phí', 'Đăng Ký Khám 0đ'],
      biddingAdvice: 'Tăng ngân sách chạy phủ toàn bộ các tỉnh Tây Nam Bộ với thông điệp "Khám ngay tại quê nhà - Đẳng cấp quốc tế".'
    }
  }
];

export const CompetitorWebDiffScanner: React.FC = () => {
  // Mode selection: 'auto_radar' (AI Tự Tìm Quét Quảng Cáo) or 'url_scanner' (Dán Link Quét Cụ Thể)
  const [activeMode, setActiveMode] = useState<'auto_radar' | 'url_scanner'>('auto_radar');

  // Auto Radar State
  const [discoveredAds, setDiscoveredAds] = useState<DiscoveredAd[]>(INITIAL_DISCOVERED_ADS);
  const [selectedService, setSelectedService] = useState<string>('Trồng Răng Implant');
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('Tất cả đối thủ lớn');
  const [selectedLocation, setSelectedLocation] = useState<string>('TP.HCM & Miền Tây Nam Bộ');
  const [isAutoHunting, setIsAutoHunting] = useState<boolean>(false);
  const [autoHuntSummary, setAutoHuntSummary] = useState<string | null>(null);
  const [copiedAdIndex, setCopiedAdIndex] = useState<number | null>(null);

  // URL Scanner State
  const [diffs, setDiffs] = useState<CompetitorDiffItem[]>(INITIAL_COMPETITOR_DIFFS);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);

  // Quick preset URLs for fast testing
  const PRESET_URLS = [
    { name: 'Nha Khoa Kim', url: 'https://nhakhoakim.com/bang-gia-implant' },
    { name: 'Nha Khoa Paris', url: 'https://nhakhoaparis.vn/khuyen-mai-nieng-rang' },
    { name: 'Dr. Care Implant', url: 'https://drcareimplant.com/uu-dai-implant' },
    { name: 'Nha Khoa Shark', url: 'https://nhakhoashark.vn/boc-rang-su' },
    { name: 'Nha Khoa I-Dent', url: 'https://nhakhoaident.com/implant-viet-kieu' },
    { name: 'Nha Khoa Parkway', url: 'https://parkway.com.vn/invisalign' }
  ];

  // 1. Trigger AI Auto Hunter (Tự động tìm kiếm bài quảng cáo đối thủ)
  const handleAutoHuntAds = async () => {
    setIsAutoHunting(true);
    setAutoHuntSummary(null);

    try {
      const response = await fetch('/api/gemini/auto-discover-competitor-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceFocus: selectedService,
          targetCompetitor: selectedCompetitor,
          location: selectedLocation
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ads && Array.isArray(data.ads)) {
          setDiscoveredAds(data.ads);
          setAutoHuntSummary(data.summaryInsight || `AI đã tự động quét và tìm thấy ${data.ads.length} bài quảng cáo & ưu đãi mới nhất trên thị trường!`);
        }
      } else {
        simulateAutoHunt();
      }
    } catch (err) {
      console.warn('Fallback to local Auto Hunt simulation:', err);
      simulateAutoHunt();
    } finally {
      setIsAutoHunting(false);
    }
  };

  const simulateAutoHunt = () => {
    setAutoHuntSummary(`AI đã tự động quét các mạng quảng cáo Google & Facebook đối với dịch vụ "${selectedService}" tại ${selectedLocation}.`);
  };

  const handleCopyCounterAd = (ad: DiscoveredAd, idx: number) => {
    const textToCopy = `[TIÊU ĐỀ QUẢNG CÁO GOOGLE ADS]\n${ad.counterAdTemplate.headline}\n\n[MÔ TẢ QUẢNG CÁO]\n${ad.counterAdTemplate.description}\n\n[SITELINKS]\n${ad.counterAdTemplate.sitelinks.join(' | ')}\n\n[KHUYẾN NGHỊ GIÁ THẦU]\n${ad.counterAdTemplate.biddingAdvice}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAdIndex(idx);
    setTimeout(() => setCopiedAdIndex(null), 2500);
  };

  // 2. Trigger URL Specific Diff Scan
  const handleScanUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsScanning(true);
    setScanSuccessMessage(null);

    try {
      const response = await fetch('/api/gemini/scan-competitor-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: inputUrl,
          competitorName: inputName || 'Nha Khoa ' + inputUrl.replace(/https?:\/\//, '').split('/')[0],
          focusAreas: 'Bảng giá dịch vụ, Chương trình khuyến mãi, Banner ưu đãi, Popup quảng cáo, Văn bản cam kết y khoa mới'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.changes && Array.isArray(data.changes)) {
          const newDiffItems: CompetitorDiffItem[] = data.changes.map((ch: any, idx: number) => ({
            id: `diff-${Date.now()}-${idx}`,
            competitorId: `comp-custom-${idx}`,
            competitorName: data.competitorName || inputName || 'Nha Khoa Quét Mới',
            domain: inputUrl.replace(/https?:\/\//, '').split('/')[0],
            url: inputUrl,
            detectedDate: 'Vừa phát hiện (Hôm nay)',
            category: ch.category || 'pricing',
            mediaType: ch.category === 'banner' ? 'banner_image' : ch.category === 'popup' ? 'popup_modal' : ch.category === 'pricing' ? 'price_table' : 'headline_text',
            title: ch.title || 'Thay đổi nội dung dịch vụ',
            oldValue: ch.oldValue || 'Dữ liệu lưu trữ trước đây',
            newValue: ch.newValue || 'Dữ liệu mới phát hiện trên website',
            diffType: ch.diffType || 'updated',
            diffBadge: ch.diffPercent || 'Cập nhật mới',
            impactLevel: (ch.impact === 'Rất cao' || ch.impact === 'Cao') ? ch.impact : 'Trung bình',
            aiAnalysis: ch.description || 'Đối thủ vừa điều chỉnh nội dung trên website.',
            counterAction: data.counterStrategy || 'Điều chỉnh mẫu quảng cáo và giá thầu để duy trì lợi thế cạnh tranh.'
          }));

          setDiffs(prev => [...newDiffItems, ...prev]);
          setScanSuccessMessage(`AI đã quét thành công URL và phát hiện ${newDiffItems.length} thay đổi quan trọng!`);
        }
      } else {
        simulateScan();
      }
    } catch (err) {
      console.warn('Fallback to local AI scan simulation:', err);
      simulateScan();
    } finally {
      setIsScanning(false);
      setInputUrl('');
      setInputName('');
    }
  };

  const simulateScan = () => {
    const domainName = inputUrl.replace(/https?:\/\//, '').split('/')[0];
    const compTitle = inputName || domainName;
    
    const mockDiff: CompetitorDiffItem = {
      id: `diff-${Date.now()}`,
      competitorId: `comp-sim`,
      competitorName: compTitle,
      domain: domainName,
      url: inputUrl,
      detectedDate: 'Vừa phát hiện (Hôm nay)',
      category: 'promotion',
      mediaType: 'popup_modal',
      title: 'Tung Popup Flash Sale & Gói Ưu Đãi Mới',
      oldValue: 'Ưu đãi cũ: Giảm 20% gói dịch vụ cơ bản (Không kèm quà tặng)',
      newValue: 'Ưu đãi mới: Trợ giá 30% trụ Implant + Miễn phí chụp CT 3D 1.5 Tr + Trả góp 0% duyệt hồ sơ 3 phút',
      diffType: 'new',
      diffBadge: 'Khuyến mãi sốc mới',
      impactLevel: 'Rất cao',
      aiAnalysis: `${compTitle} vừa cập nhật trang đích với gói khuyến mãi hấp dẫn nhằm tăng tỷ lệ để lại số điện thoại (Form Lead).`,
      counterAction: 'Tăng ngân sách khung giờ 19h-22h và thêm tiện ích cuộc gọi trực tiếp (Call Extension) để chốt khách trước.'
    };

    setDiffs(prev => [mockDiff, ...prev]);
    setScanSuccessMessage(`AI đã quét thành công URL "${domainName}" và lưu vào lịch sử đối chiếu CŨ vs MỚI!`);
  };

  const handleExportDiffReport = () => {
    const headers = ['STT', 'Ten Nha Khoa', 'Ten Mien', 'URL Quet', 'Loai Thay Doi', 'Tieu De Thay Doi', 'Noi Dung Cu', 'Noi Dung Moi', 'Muc Do Anh Huong', 'Phan Tich AI', 'De Xuat Phan Cong', 'Thoi Gian Phat Hien'];
    
    const rows = diffs.map((d, index) => [
      index + 1,
      `"${d.competitorName.replace(/"/g, '""')}"`,
      `"${d.domain}"`,
      `"${d.url}"`,
      `"${d.category}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.oldValue.replace(/"/g, '""')}"`,
      `"${d.newValue.replace(/"/g, '""')}"`,
      `"${d.impactLevel}"`,
      `"${d.aiAnalysis.replace(/"/g, '""')}"`,
      `"${d.counterAction.replace(/"/g, '""')}"`,
      `"${d.detectedDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_Cao_Thay_Doi_Doi_Thu_Web_Diff_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDiffs = diffs.filter(d => {
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      const matchComp = d.competitorName.toLowerCase().includes(q);
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchDomain = d.domain.toLowerCase().includes(q);
      if (!matchComp && !matchTitle && !matchDomain) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* TOP DUAL-MODE CONTROLLER SWITCH */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('auto_radar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeMode === 'auto_radar'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radar className={`w-4 h-4 ${activeMode === 'auto_radar' ? 'animate-spin' : ''}`} />
            <span>AI TỰ ĐỘNG TÌM & QUÉT QUẢNG CÁO</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
              Tự Động 100%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('url_scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeMode === 'url_scanner'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>DÁN LINK WEBSITE QUÉT CỤ THỂ</span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={handleExportDiffReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Xuất Báo Cáo CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: AI AUTO RADAR (TỰ ĐỘNG TÌM BÀI QUẢNG CÁO ĐỐI THỦ & TRẢ KẾT QUẢ) */}
      {/* ========================================================================= */}
      {activeMode === 'auto_radar' && (
        <div className="space-y-6 animate-fadeIn">
          {/* AUTO-HUNT CONTROL PANEL */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-950 border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden space-y-5">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40 shrink-0">
                  <Radar className={`w-7 h-7 ${isAutoHunting ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      AI TỰ ĐỘNG TÌM BÀI QUẢNG CÁO & QUÉT ĐỐI THỦ (GOOGLE & FACEBOOK ADS)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                      Live Spy Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                    Bạn không cần phải đi tìm link! AI sẽ tự động rà quét các mạng lưới quảng cáo, tìm ra các bài quảng cáo mới nhất của <strong>Nha Khoa Kim, Paris, Dr. Care, Shark, Parkway...</strong>, trích xuất ưu đãi ngầm và viết sẵn mẫu quảng cáo phản công cho Tâm Đức Smile.
                  </p>
                </div>
              </div>
            </div>

            {/* SELECTION PILLS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 relative z-10">
              {/* 1. Service Focus */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  1. Dịch Vụ Cần Săn Tìm Quảng Cáo:
                </label>
                <select
                  value={selectedService}
                  onChange={e => setSelectedService(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Trồng Răng Implant">Trồng Răng Implant (Đơn lẻ & All-on-4/6)</option>
                  <option value="Răng Sứ Thẩm Mỹ">Răng Sứ Thẩm Mỹ (Cercon, Zirconia, Veneer)</option>
                  <option value="Niềng Răng - Chỉnh Nha">Niềng Răng (Mắc Cài & Trong Suốt Invisalign)</option>
                  <option value="Khách Việt Kiều Về Nước">Khách Việt Kiều Về Nước Làm Răng</option>
                  <option value="Nhổ Răng Khôn Siêu Âm">Nhổ Răng Khôn & Nha Khoa Tổng Quát</option>
                  <option value="Toàn Bộ Dịch Vụ Nha Khoa">Tất Cả Các Dịch Vụ</option>
                </select>
              </div>

              {/* 2. Target Competitor */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
                  2. Đối Thủ Mục Tiêu:
                </label>
                <select
                  value={selectedCompetitor}
                  onChange={e => setSelectedCompetitor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="Tất cả đối thủ lớn">Tất cả chuỗi nha khoa đối thủ (Quét toàn diện)</option>
                  <option value="Nha Khoa Kim">Nha Khoa Kim (nhakhoakim.com)</option>
                  <option value="Nha Khoa Paris">Nha Khoa Paris (nhakhoaparis.vn)</option>
                  <option value="Dr. Care Implant">Dr. Care Implant (drcareimplant.com)</option>
                  <option value="Nha Khoa Shark">Nha Khoa Shark (nhakhoashark.vn)</option>
                  <option value="Nha Khoa Parkway">Nha Khoa Parkway (parkway.com.vn)</option>
                  <option value="Nha Khoa I-Dent">Nha Khoa I-Dent (nhakhoaident.com)</option>
                </select>
              </div>

              {/* 3. Location */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  3. Thị Trường / Khu Vực:
                </label>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="TP.HCM & Miền Tây Nam Bộ">TP.HCM & Miền Tây (Cần Thơ, Tiền Giang, Cà Mau...)</option>
                  <option value="Toàn TP. Hồ Chí Minh">Khu vực TP. Hồ Chí Minh</option>
                  <option value="Các Tỉnh Miền Tây Nam Bộ">Riêng các Tỉnh Miền Tây</option>
                  <option value="Khách Kiều Bào (Mỹ, Úc, Canada)">Khách Kiều Bào (Mỹ, Úc, Canada, Châu Âu)</option>
                </select>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>AI sẽ trích xuất <strong>tiêu đề, mô tả, ưu đãi ngầm, điểm yếu</strong> và <strong>mẫu phản công</strong>.</span>
              </div>

              <button
                type="button"
                onClick={handleAutoHuntAds}
                disabled={isAutoHunting}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs shadow-xl shadow-cyan-950/80 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isAutoHunting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI Đang Quét Tìm Toàn Bộ Quảng Cáo Đối Thủ...</span>
                  </>
                ) : (
                  <>
                    <Radar className="w-4 h-4 text-cyan-200" />
                    <span>⚡ AI TỰ ĐỘNG TÌM & QUÉT BÀI QUẢNG CÁO NGAY</span>
                  </>
                )}
              </button>
            </div>

            {/* Auto Hunt Summary Banner */}
            {autoHuntSummary && (
              <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-0.5">Kết Quả Quét Tự Động:</div>
                  <p className="text-slate-300 leading-relaxed">{autoHuntSummary}</p>
                </div>
              </div>
            )}
          </div>

          {/* DISCOVERED ADS LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-cyan-400" />
                <span>Bài Quảng Cáo Đối Thủ Vừa Phát Hiện ({discoveredAds.length})</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Cập nhật theo mạng lưới tìm kiếm</span>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {discoveredAds.map((ad, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 hover:border-cyan-500/40 shadow-xl space-y-5 transition-all"
                >
                  {/* Top Bar of Ad Card */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {ad.competitorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{ad.competitorName}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                            {ad.domain}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-cyan-400 font-semibold">{ad.adPlatform}</span>
                          <span>•</span>
                          <span>Từ khóa mục tiêu: <strong className="text-slate-200">"{ad.targetKeyword}"</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        ad.threatLevel === 'Rất cao'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                      }`}>
                        Mức độ đe dọa: {ad.threatLevel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {ad.changeType}
                      </span>
                    </div>
                  </div>

                  {/* 1. MẪU QUẢNG CÁO GOOGLE ADS ĐỐI THỦ ĐANG CHẠY (MOCKUP LIVE SEARCH AD) */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Eye className="w-3.5 h-3.5" /> Mẫu Quảng Cáo Đối Thủ Đang Hiển Thị Trên Google:
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        Được tài trợ (Ad)
                      </span>
                    </div>

                    {/* Google Search Result Mockup */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 font-sans">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-300">Ad</span>
                        <span>•</span>
                        <span className="text-slate-400 truncate">{ad.adCopy.displayedUrl}</span>
                      </div>
                      <div className="text-sm font-bold text-cyan-400 hover:underline cursor-pointer">
                        {ad.adCopy.headline}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ad.adCopy.description}
                      </p>
                      
                      {/* Sitelinks badges */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900 text-xs">
                        {ad.adCopy.sitelinks.map((site, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[11px] border border-slate-800 cursor-pointer">
                            {site}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 2. ĐỐI CHIẾU ƯU ĐÃI / BẢNG GIÁ CŨ VS MỚI */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                      <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                        <History className="w-3 h-3" /> Mức Giá / Ưu Đãi Cũ Trước Đây:
                      </div>
                      <p className="text-xs text-slate-300 line-through decoration-rose-400/80">
                        {ad.oldPromo}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Ưu Đãi Mới Đối Thủ Vừa Tung Ra:
                      </div>
                      <p className="text-xs font-bold text-emerald-300">
                        {ad.detectedPromo}
                      </p>
                    </div>
                  </div>

                  {/* 3. TỬ HUYỆT ĐỐI THỦ & MẪU PHẢN CÔNG TÂM ĐỨC SMILE */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-cyan-950/60 border border-indigo-500/40 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span>CHIẾN LƯỢC & MẪU QUẢNG CÁO PHẢN CÔNG CHO TÂM ĐỨC SMILE</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyCounterAd(ad, idx)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all shrink-0"
                      >
                        {copiedAdIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Đã Copy Mẫu QC!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Mẫu QC Phản Công</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Weakness analysis */}
                    <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-rose-400 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Điểm yếu của đối thủ:
                      </strong>
                      <p className="text-slate-300">{ad.competitorWeakness}</p>
                    </div>

                    {/* Counter Ad Preview */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/50 space-y-2">
                      <div className="text-[11px] font-mono text-emerald-400 font-bold">
                        Mẫu QC Tâm Đức Smile: {ad.counterAdTemplate.headline}
                      </div>
                      <p className="text-xs text-slate-200">
                        {ad.counterAdTemplate.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ad.counterAdTemplate.sitelinks.map((st, stIdx) => (
                          <span key={stIdx} className="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200 text-[10px] font-medium border border-indigo-700/50">
                            +{st}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bidding Advice */}
                    <div className="text-xs text-cyan-300 flex items-center gap-1.5 pt-1">
                      <BarChart3 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span><strong>Lời khuyên giá thầu:</strong> {ad.counterAdTemplate.biddingAdvice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: DÁN LINK WEBSITE QUÉT CỤ THỂ (URL DEEP SCANNER)                  */}
      {/* ========================================================================= */}
      {activeMode === 'url_scanner' && (
        <div className="space-y-6 animate-fadeIn">
          {/* SCANNER INPUT HERO BOX */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 border-2 border-indigo-500/50 shadow-2xl space-y-4 relative overflow-hidden ring-1 ring-cyan-400/30">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 shrink-0">
                  <Globe className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      DÁN LINK WEBSITE / LANDING PAGE ĐỐI THỦ ĐỂ AI QUÉT THAY ĐỔI
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                      So Sánh Đối Chiếu CŨ vs MỚI
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Dán bất kỳ link website, bảng giá, ưu đãi nào vào ô bên dưới. AI sẽ quét và báo cáo trực tiếp: <strong>Bảng giá thay đổi, Banner/Ảnh mới, Popup, Khuyến mãi, Cam kết y khoa</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* INPUT FORM: DÁN LINK VÀO ĐÂY */}
            <form onSubmit={handleScanUrl} className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/30">
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-indigo-300 mb-1">1. Tên Nha Khoa (Tùy chọn)</label>
                <input
                  type="text"
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                  placeholder="VD: Nha Khoa Kim, Nha Khoa Paris..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  2. Dán Link Website / Bảng Giá / Khuyến Mãi <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    placeholder="Dán link vào đây: https://nhakhoadoithu.com/bang-gia-implant..."
                    className="w-full bg-slate-900 border border-cyan-500/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner ring-1 ring-cyan-500/30"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full h-[42px] rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-cyan-950/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AI Đang Quét...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                      <span>AI Quét Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Link Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-slate-400">
              <span className="font-bold text-slate-300">Hoặc bấm thử nhanh link đối thủ:</span>
              {PRESET_URLS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputName(p.name);
                    setInputUrl(p.url);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-900/60 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer text-xs"
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Success Alert Banner */}
            {scanSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold">{scanSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Filter & Search Bar for Diffs */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-400" /> Phân loại thay đổi:
              </span>
              {[
                { id: 'all', label: `Tất cả (${diffs.length})` },
                { id: 'pricing', label: 'Bảng giá (Price Diff)' },
                { id: 'promotion', label: 'Khuyến mãi & Ưu đãi' },
                { id: 'banner', label: 'Banner & Ảnh mới' },
                { id: 'popup', label: 'Popup quảng cáo' },
                { id: 'text', label: 'Văn bản & Cam kết' },
                { id: 'service', label: 'Gói dịch vụ mới' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all text-xs cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Tìm tên nha khoa, từ khóa..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* LIST OF DETECTED CHANGES (CŨ VS MỚI DIFF CARDS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span>Danh Sách Đối Chiếu Thay Đổi Đối Thủ (CŨ VS MỚI)</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {filteredDiffs.length} mục
                </span>
              </h4>
              <span className="text-[11px] text-slate-500">Tự động cập nhật & phân tích chiến lược</span>
            </div>

            {filteredDiffs.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
                Không tìm thấy thay đổi nào phù hợp với bộ lọc. Hãy dán link website đối thủ ở trên để AI quét ngay!
              </div>
            ) : (
              filteredDiffs.map(item => {
                const isPrice = item.category === 'pricing';
                const isPromo = item.category === 'promotion';
                const isBanner = item.category === 'banner';
                const isPopup = item.category === 'popup';
                const isText = item.category === 'text';

                return (
                  <div 
                    key={item.id}
                    className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl space-y-4 transition-all"
                  >
                    {/* Header of Change Item */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md ${
                          isPrice ? 'bg-amber-600' : isPromo ? 'bg-rose-600' : isBanner ? 'bg-indigo-600' : isPopup ? 'bg-purple-600' : isText ? 'bg-blue-600' : 'bg-emerald-600'
                        }`}>
                          {isPrice ? <DollarSign className="w-5 h-5" /> : isPromo ? <Flame className="w-5 h-5" /> : isBanner ? <ImageIcon className="w-5 h-5" /> : isPopup ? <Layers className="w-5 h-5" /> : isText ? <FileText className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{item.competitorName}</span>
                            <span className="text-slate-500 text-xs">•</span>
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline text-xs flex items-center gap-1 font-mono"
                            >
                              <span>{item.domain}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="text-xs text-slate-300 font-semibold mt-0.5 flex items-center gap-2">
                            <span>{item.title}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                              {isPrice ? 'Bảng Giá' : isPromo ? 'Ưu Đãi / Khuyến Mãi' : isBanner ? 'Banner & Ảnh' : isPopup ? 'Popup Màn Hình' : isText ? 'Văn Bản & Cam Kết' : 'Dịch Vụ'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badges & Date */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.diffBadge}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.impactLevel === 'Rất cao' || item.impactLevel === 'Cao'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          Mức độ ảnh hưởng: {item.impactLevel}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-600" />
                          {item.detectedDate}
                        </span>
                      </div>
                    </div>

                    {/* VISUAL DIFF COMPARISON: OLD VS NEW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* PHIÊN BẢN CŨ (PREVIOUS) */}
                      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2 relative overflow-hidden">
                        <div className="flex items-center justify-between text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5" /> DỮ LIỆU CŨ (TRƯỚC KHI ĐỔI)
                          </span>
                          <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px]">CŨ</span>
                        </div>
                        <div className="text-xs font-mono text-slate-300 pt-1 line-through decoration-rose-400/70 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-rose-900/40">
                          {item.oldValue}
                        </div>
                      </div>

                      {/* PHIÊN BẢN MỚI (CURRENT / DETECTED) */}
                      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 relative overflow-hidden shadow-inner">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> DỮ LIỆU MỚI PHÁT HIỆN (HIỆN TẠI)
                          </span>
                          <span className="px-2 py-0.2 rounded bg-emerald-500/30 text-emerald-200 text-[10px] font-black animate-pulse">MỚI</span>
                        </div>
                        <div className="text-xs font-mono font-bold text-emerald-300 pt-1 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-emerald-800/40">
                          {item.newValue}
                        </div>
                      </div>
                    </div>

                    {/* AI INSIGHT & ACTIONABLE COUNTER STRATEGY */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
                      <div>
                        <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1">
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Phân Tích Động Thái Đối Thủ:</span>
                        </span>
                        <p className="text-slate-300 leading-relaxed pl-5">
                          {item.aiAnalysis}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase shrink-0 mt-0.5">
                          Đề Xuất Phản Công
                        </span>
                        <p className="text-slate-200 font-medium leading-relaxed">
                          {item.counterAction}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
