import React, { useState, useMemo } from 'react';
import { 
  Swords, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Sparkles, 
  Flame, 
  Zap, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ExternalLink, 
  Filter, 
  Building2, 
  DollarSign, 
  Percent, 
  Copy, 
  Plus, 
  Info,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  Eye,
  Crosshair,
  BarChart3,
  RefreshCw,
  Clock,
  Download,
  Database,
  MapPin
} from 'lucide-react';
import { TWENTY_COMPETITORS, CompetitorData } from '../data/competitorsData';

export const CompetitorTrackingView: React.FC = () => {
  const [competitors, setCompetitors] = useState<CompetitorData[]>(TWENTY_COMPETITORS);
  const [activeSubTab, setActiveSubTab] = useState<'auction' | 'matrix' | 'ads' | 'counter' | 'pricing' | 'sources'>('auction');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('all');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('comp-1');
  const [copiedAdId, setCopiedAdId] = useState<string | null>(null);

  // Modal for adding new competitor
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompDomain, setNewCompDomain] = useState('');
  const [newCompBudget, setNewCompBudget] = useState('');
  const [newCompIS, setNewCompIS] = useState('20');
  const [newCompThreat, setNewCompThreat] = useState<'Cao' | 'Trung bình' | 'Thấp'>('Trung bình');
  const [newCompRegion, setNewCompRegion] = useState('TP.HCM');

  // Filter competitors based on search, region, service, threat
  const filteredCompetitors = useMemo(() => {
    return competitors.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q);
        const matchDomain = c.domain.toLowerCase().includes(q);
        const matchServices = c.mainServices.some(s => s.toLowerCase().includes(q));
        const matchRegion = c.targetRegion.toLowerCase().includes(q);
        if (!matchName && !matchDomain && !matchServices && !matchRegion) return false;
      }
      if (selectedServiceFilter !== 'all') {
        const matchService = c.mainServices.some(s => s.toLowerCase().includes(selectedServiceFilter.toLowerCase()));
        if (!matchService && !c.isSelf) return false;
      }
      if (selectedRegionFilter !== 'all') {
        const matchRegion = c.targetRegion.toLowerCase().includes(selectedRegionFilter.toLowerCase());
        if (!matchRegion && !c.isSelf) return false;
      }
      if (selectedThreatFilter !== 'all') {
        if (c.threatLevel !== selectedThreatFilter && !c.isSelf) return false;
      }
      return true;
    });
  }, [competitors, searchQuery, selectedServiceFilter, selectedRegionFilter, selectedThreatFilter]);

  const selectedCompetitor = useMemo(() => {
    return competitors.find(c => c.id === selectedCompetitorId) || competitors[1] || competitors[0];
  }, [competitors, selectedCompetitorId]);

  const handleCopyAd = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAdId(id);
    setTimeout(() => setCopiedAdId(null), 2500);
  };

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName || !newCompDomain) return;

    const newComp: CompetitorData = {
      id: `comp-${Date.now()}`,
      name: newCompName,
      domain: newCompDomain.replace(/^https?:\/\//, ''),
      brandColor: 'from-purple-600 to-indigo-600',
      impressionShare: parseFloat(newCompIS) || 15.0,
      overlapRate: 40.0,
      outrankingShare: 20.0,
      topOfPageRate: 50.0,
      absTopOfPageRate: 15.0,
      estimatedMonthlyBudget: newCompBudget || '100 - 150 Tr',
      mainServices: ['Trồng Răng Implant', 'Bọc Răng Sứ', 'Niềng Răng'],
      strengths: ['Đang đẩy mạnh thương hiệu địa phương'],
      weaknesses: ['Chưa tối ưu hóa chiến dịch Search'],
      currentPromotion: 'Đang theo dõi chương trình khuyến mãi...',
      sampleAd: {
        headline: `${newCompName} | Dịch Vụ Nha Khoa Uy Tín`,
        description: `Khám & tư vấn miễn phí cùng đội ngũ bác sĩ chuyên khoa tại ${newCompName}. Đặt hẹn ngay hôm nay!`,
        sitelinks: ['Bảng Giá', 'Ưu Đãi', 'Bác Sĩ', 'Liên Hệ'],
        callout: 'Khám Miễn Phí • Trả Góp 0% • Uy Tín'
      },
      pricingComparison: {
        implant: '12 Tr - 28 Tr / trụ',
        suCercon: '4 Tr - 7 Tr / răng',
        invisalign: '45 Tr - 90 Tr / gói',
        nhorang: '800k - 2.5 Tr / răng'
      },
      threatLevel: newCompThreat,
      targetRegion: newCompRegion || 'TP.HCM'
    };

    setCompetitors(prev => [...prev, newComp]);
    setSelectedCompetitorId(newComp.id);
    setShowAddModal(false);
    setNewCompName('');
    setNewCompDomain('');
    setNewCompBudget('');
  };

  const handleExportCSV = () => {
    const headers = ['STT', 'Ten Nha Khoa', 'Ten Mien', 'Muc De Doa', 'Khu Vuc', 'Ty Le Hien Thi (IS %)', 'Ty Le Trung Lap (%)', 'Ty Le De Vi Tri (%)', 'Ty Le Dau Trang (%)', 'Ty Le Tuyet Doi (%)', 'Ngan Sach Uoc Tinh', 'Gia Implant', 'Gia Rang Su', 'Gia Invisalign', 'Khuyen Mai'];
    
    const rows = competitors.map((c, index) => [
      index === 0 ? 'Chủ quản' : index,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.domain}"`,
      `"${c.threatLevel}"`,
      `"${c.targetRegion.replace(/"/g, '""')}"`,
      c.impressionShare,
      c.isSelf ? 0 : c.overlapRate,
      c.isSelf ? 0 : c.outrankingShare,
      c.topOfPageRate,
      c.absTopOfPageRate,
      `"${c.estimatedMonthlyBudget}"`,
      `"${c.pricingComparison.implant}"`,
      `"${c.pricingComparison.suCercon}"`,
      `"${c.pricingComparison.invisalign}"`,
      `"${c.currentPromotion.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `20_Nha_Khoa_Doi_Thu_Auction_Insights_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  THEO DÕI 20 CHUỖI NHA KHOA LỚN NHẤT TP.HCM & MIỀN NAM
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {competitors.length} Chuỗi Nha Khoa
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Google Auction Insights 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Phân tích thị phần hiển thị (Impression Share), ngân sách Google Ads ước tính, mẫu quảng cáo, giá dịch vụ & SWOT 20 chuỗi nha khoa hàng đầu
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer shadow-sm"
              title="Xuất file CSV thống kê 20 nha khoa"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Xuất CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Nha Khoa</span>
            </button>
          </div>
        </div>

        {/* Key Benchmark Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Tỷ Lệ Thị Phần (Imp. Share)</span>
              <Award className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-black text-cyan-300 mt-1 flex items-baseline gap-1.5">
              <span>43.5%</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 inline mr-0.5" /> +3.2%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Tâm Đức Smile top #1 thị phần Miền Tây</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Tỷ Lệ Đè Vị Trí (Outranking)</span>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-300 mt-1 flex items-baseline gap-1.5">
              <span>68.4%</span>
              <span className="text-[11px] font-bold text-emerald-400">Vị thế áp đảo</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Xuất hiện cao hơn đối thủ 68% phiên đấu giá</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Tỷ Lệ Đầu Trang Tuyệt Đối</span>
              <Target className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-300 mt-1 flex items-baseline gap-1.5">
              <span>46.8%</span>
              <span className="text-[11px] font-bold text-slate-400">Top #1 Ads</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Vị trí số 1 trang tìm kiếm Google</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Đối Thủ Cạnh Tranh Gay Gắt</span>
              <Flame className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-sm font-black text-rose-300 mt-1 truncate">
              Kim, Paris, I-Dent, Đại Nam, Shark
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Cạnh tranh thầu từ khóa Implant & Niềng</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
        {/* Sub Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveSubTab('auction')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'auction'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Báo Cáo Đấu Giá 20 Chuỗi ({competitors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hồ Sơ & SWOT (20 Nha Khoa)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ads')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'ads'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Radar Mẫu QC & Khuyến Mãi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('pricing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'pricing'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Bảng Giá So Sánh 20 Nha Khoa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('counter')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'counter'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chiến Lược Phản Công AI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sources')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'sources'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-cyan-400 hover:bg-cyan-950/40 border border-cyan-500/30'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Nguồn Dữ Liệu & Độ Chính Xác</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên nha khoa, domain, quận..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Bar: Regions & Services */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
        {/* Region Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Khu vực:
          </span>
          {[
            { id: 'all', label: 'Tất cả (20)' },
            { id: 'TP.HCM', label: 'TP.HCM' },
            { id: 'Miền Tây', label: 'Miền Tây & ĐBSCL' },
            { id: 'Đồng Nai', label: 'Đông Nam Bộ' },
            { id: 'Hà Nội', label: 'Toàn quốc' }
          ].map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRegionFilter(r.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all text-xs cursor-pointer ${
                selectedRegionFilter === r.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Service & Threat Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Dịch vụ:
            </span>
            {['all', 'Implant', 'Răng Sứ', 'Niềng Răng'].map((svc) => (
              <button
                key={svc}
                type="button"
                onClick={() => setSelectedServiceFilter(svc)}
                className={`px-2 py-1 rounded-lg font-medium transition-all text-xs cursor-pointer ${
                  selectedServiceFilter === svc
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {svc === 'all' ? 'Tất cả' : svc}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Đe dọa:</span>
            {['all', 'Cao', 'Trung bình', 'Thấp'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedThreatFilter(t)}
                className={`px-2 py-1 rounded-lg font-medium transition-all text-xs cursor-pointer ${
                  selectedThreatFilter === t
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t === 'all' ? 'Tất cả' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: AUCTION INSIGHTS TABLE (20 Nha Khoa) */}
      {activeSubTab === 'auction' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Bảng So Sánh Phiên Đấu Giá Google Search (Auction Insights Matrix)</span>
              <span className="text-xs font-normal text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                Hiển thị {filteredCompetitors.length} / {competitors.length} chuỗi nha khoa
              </span>
            </h3>
            <span className="text-[11px] text-slate-400">Dữ liệu đấu giá thầu 30 ngày gần nhất</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3.5 px-3 text-center w-12">Hạng</th>
                  <th className="py-3.5 px-4">Hệ Thống Nha Khoa / Tên Miền</th>
                  <th className="py-3.5 px-3 text-center">Mức Đe Dọa</th>
                  <th className="py-3.5 px-3 text-right">Tỷ Lệ Hiển Thị (IS)</th>
                  <th className="py-3.5 px-3 text-right">Tỷ Lệ Trùng Lặp</th>
                  <th className="py-3.5 px-3 text-right">Tỷ Lệ Đè Vị Trí</th>
                  <th className="py-3.5 px-3 text-right">Tỷ Lệ Đầu Trang</th>
                  <th className="py-3.5 px-3 text-right">Tỷ Lệ Tuyệt Đối</th>
                  <th className="py-3.5 px-3.5 text-right">Ngân Sách Ước Tính</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCompetitors.map((comp, idx) => {
                  const isMe = comp.isSelf;
                  return (
                    <tr 
                      key={comp.id} 
                      className={`transition-colors ${
                        isMe 
                          ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400 font-medium' 
                          : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center font-bold">
                        {isMe ? (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 text-[10px] font-black">
                            #1
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono text-xs">
                            #{idx + 1}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${comp.brandColor} flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0`}>
                            {comp.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{comp.name}</span>
                              {isMe && (
                                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-500/30">
                                  BẠN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 flex-wrap">
                              <span>{comp.domain}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400">{comp.targetRegion}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {isMe ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            Chủ quản
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            comp.threatLevel === 'Cao'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : comp.threatLevel === 'Trung bình'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {comp.threatLevel}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-cyan-300">
                        {comp.impressionShare}%
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                        {isMe ? '-' : `${comp.overlapRate}%`}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                        {isMe ? '-' : `${comp.outrankingShare}%`}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                        {comp.topOfPageRate}%
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-300">
                        {comp.absTopOfPageRate}%
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-semibold text-slate-300">
                        {comp.estimatedMonthlyBudget}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SWOT & COMPETITOR PROFILES */}
      {activeSubTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Competitor List Picker (20 Clinics) */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
              <span>Chọn nha khoa phân tích sâu ({filteredCompetitors.length})</span>
            </h3>
            <div className="space-y-1.5 max-h-[680px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredCompetitors.map((comp, idx) => {
                const isSelected = comp.id === selectedCompetitorId;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => setSelectedCompetitorId(comp.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500/80 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-400/30'
                        : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${comp.brandColor} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                        {comp.name.substring(0, 2)}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                          <span className="truncate">{comp.name}</span>
                          {comp.isSelf && <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-black shrink-0">BẠN</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          IS: <span className="text-cyan-300 font-semibold">{comp.impressionShare}%</span> • {comp.estimatedMonthlyBudget}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed SWOT & Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedCompetitor.brandColor} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                    {selectedCompetitor.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <span>{selectedCompetitor.name}</span>
                      <span className="text-xs font-normal text-slate-400">({selectedCompetitor.domain})</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Khu vực: <span className="text-slate-300 font-medium">{selectedCompetitor.targetRegion}</span> • Ngân sách: <span className="text-cyan-300 font-bold">{selectedCompetitor.estimatedMonthlyBudget}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Mức đe dọa:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    selectedCompetitor.threatLevel === 'Cao'
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      : selectedCompetitor.threatLevel === 'Trung bình'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {selectedCompetitor.threatLevel}
                  </span>
                </div>
              </div>

              {/* Core Services Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 font-semibold">Dịch vụ mũi nhọn:</span>
                {selectedCompetitor.mainServices.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-indigo-300 border border-indigo-800/40">
                    {s}
                  </span>
                ))}
              </div>

              {/* SWOT Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Điểm Mạnh Của Đối Thủ</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {selectedCompetitor.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Lỗ Hổng / Điểm Yếu Có Thể Khai Thác</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {selectedCompetitor.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Current Promotion Spy */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Flame className="w-4 h-4" />
                  <span>Khuyến Mãi Đang Chạy Đẩy Số</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {selectedCompetitor.currentPromotion}
                </p>
              </div>

              {/* Pricing Snapshot */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <span>Bảng Giá Niêm Yết Của {selectedCompetitor.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Implant</div>
                    <div className="font-mono font-bold text-cyan-300 mt-0.5">{selectedCompetitor.pricingComparison.implant}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Răng Sứ Cercon</div>
                    <div className="font-mono font-bold text-amber-300 mt-0.5">{selectedCompetitor.pricingComparison.suCercon}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Niềng Invisalign</div>
                    <div className="font-mono font-bold text-emerald-400 mt-0.5">{selectedCompetitor.pricingComparison.invisalign}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Nhổ Răng Khôn</div>
                    <div className="font-mono font-bold text-slate-300 mt-0.5">{selectedCompetitor.pricingComparison.nhorang}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AD COPY & PROMO SPY */}
      {activeSubTab === 'ads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Radar Mẫu Quảng Cáo Google Search 20 Chuỗi Nha Khoa (Ad Copy Spy)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Phân tích tiêu đề (Headlines), mô tả (Descriptions) và các tiện ích mở rộng (Extensions) đối thủ đang dùng để thu hút click
              </p>
            </div>
            <span className="text-xs text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40 font-semibold">
              {filteredCompetitors.length} Mẫu QC
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompetitors.map((comp) => {
              const isMe = comp.isSelf;
              const ad = comp.sampleAd;
              return (
                <div 
                  key={comp.id} 
                  className={`p-4 rounded-2xl border space-y-3 shadow-lg ${
                    isMe 
                      ? 'bg-cyan-950/20 border-cyan-500/40 ring-1 ring-cyan-400/30' 
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${comp.brandColor} flex items-center justify-center text-white text-[10px] font-black`}>
                        {comp.name.substring(0, 2)}
                      </div>
                      <span className="text-xs font-bold text-white">{comp.name}</span>
                      {isMe && <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/30 text-cyan-200 font-bold">MẪU CỦA BẠN</span>}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyAd(comp.id, `${ad.headline}\n${ad.description}`)}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedAdId === comp.id ? 'Đã chép!' : 'Sao chép'}</span>
                    </button>
                  </div>

                  {/* Google Search Result Preview Box */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs font-sans">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-300">Được tài trợ</span>
                      <span>•</span>
                      <span className="text-slate-400 truncate">https://{comp.domain}</span>
                    </div>
                    <h5 className="text-sm font-semibold text-cyan-400 hover:underline cursor-pointer leading-snug">
                      {ad.headline}
                    </h5>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {ad.description}
                    </p>
                    {ad.callout && (
                      <div className="text-[11px] text-slate-400 pt-1 font-medium">
                        {ad.callout}
                      </div>
                    )}
                    {ad.sitelinks && ad.sitelinks.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                        {ad.sitelinks.map((link, idx) => (
                          <span key={idx} className="text-cyan-300/90 hover:underline cursor-pointer text-[11px] font-medium truncate flex items-center gap-1">
                            <ChevronRight className="w-2.5 h-2.5 text-cyan-500 shrink-0" />
                            {link}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PRICING COMPARISON */}
      {activeSubTab === 'pricing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Bảng So Sánh Giá Các Dịch Vụ Cốt Lõi 20 Chuỗi Nha Khoa 2026</span>
              </h3>
              <p className="text-xs text-slate-400">
                So sánh mức giá công khai & gói trả góp giữa các hệ thống nha khoa lớn tại TP.HCM & Miền Nam
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tải Bảng Giá CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3.5 px-4">Hệ Thống Nha Khoa</th>
                  <th className="py-3.5 px-3">Khu Vực</th>
                  <th className="py-3.5 px-3">Trồng Răng Implant</th>
                  <th className="py-3.5 px-3">Bọc Răng Sứ Cercon</th>
                  <th className="py-3.5 px-3">Niềng Răng Invisalign</th>
                  <th className="py-3.5 px-3.5">Nhổ Răng Khôn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCompetitors.map((comp) => {
                  const isMe = comp.isSelf;
                  return (
                    <tr 
                      key={comp.id}
                      className={isMe ? 'bg-cyan-950/40 font-semibold border-l-4 border-l-cyan-400' : 'hover:bg-slate-900/50'}
                    >
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <span>{comp.name}</span>
                        {isMe && <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">BẠN</span>}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                        {comp.targetRegion}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-cyan-300">
                        {comp.pricingComparison.implant}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-amber-300">
                        {comp.pricingComparison.suCercon}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400">
                        {comp.pricingComparison.invisalign}
                      </td>
                      <td className="py-3.5 px-3.5 font-mono text-slate-300">
                        {comp.pricingComparison.nhorang}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: COUNTER-ATTACK AI STRATEGY */}
      {activeSubTab === 'counter' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>Chiến Lược Phản Công Đè Đối Thủ (AI Competitive Playbook)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dựa trên phân tích phiên đấu giá và mẫu quảng cáo của 19 chuỗi đối thủ tại TP.HCM & Miền Nam, dưới đây là 4 chiến thuật tối ưu hóa giúp giảm CPA và chiếm lĩnh vị trí số 1:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>1. Chiến Thuật Bảo Vệ Từ Khóa Thương Hiệu (Brand Defense)</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Các đối thủ lớn (Kim, Paris, Shark) thường cài đặt đấu thầu cụm từ chứa tên thương hiệu của bạn. Cần duy trì chiến dịch Brand với Bid CPC tối đa 1.500đ để giữ Quality Score 10/10 và chiếm trọn 4 vị trí đầu trang.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>2. Đánh Vào Điểm Yếu Phụ Phí Của Đối Thủ Lớn</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Khách hàng hay phàn nàn các nha khoa chuỗi có nhiều phụ phí phát sinh. Đẩy mạnh thông điệp: <span className="text-white font-semibold">"Trọn gói không phát sinh • Tặng CT 3D 1.5 Tr • Trả góp 0%"</span> trên tiêu đề RSA để tăng CTR +30%.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>3. Tối Ưu Bidding Khung Giờ Vàng Miền Tây & TP.HCM</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Các đối thủ thường chia đều ngân sách cả ngày. Bạn nên tăng +35% Bid lúc 11h-13h và 19h-22h ở khu vực TP.HCM & các tỉnh ĐBSCL (Cần Thơ, Tiền Giang, Vĩnh Long) để đè vị trí lúc khách rảnh rỗi gọi điện tư vấn.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <span>4. Phủ Định Từ Khóa Của Đối Thủ Không Đổi Ra Lead</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Thêm các từ khóa tìm kiếm khiếu nại/tuyển dụng của đối thủ (như "phốt nha khoa X", "tuyển dụng nha khoa Y", "địa chỉ nha khoa Z ở đâu") vào danh sách Negative Keywords để không bị hao hụt ngân sách vô ích.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DATA SOURCES EXPLANATION */}
      {activeSubTab === 'sources' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Database className="w-5 h-5" />
              <span>Nguồn Dữ Liệu Thống Kê & Phương Pháp Đo Lường Đối Thủ</span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Các chỉ số thống kê trong mô-đun này được tổng hợp và đối soát từ 4 nguồn dữ liệu y tế & quảng cáo chính thống:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>1. Google Ads Auction Insights (Báo Cáo Phiên Đấu Giá)</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Báo cáo trực tiếp từ tài khoản Google Ads của phòng khám, thống kê tỷ lệ phần trăm các phiên đấu giá mà quảng cáo của bạn và đối thủ cùng tham gia trong 30 ngày qua.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <span>2. Google Ads Transparency Center (Trung Tâm Minh Bạch)</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Trích xuất các mẫu quảng cáo thực tế (Headlines, Descriptions, Extensions) và các chương trình khuyến mãi mà các nha khoa đối thủ đang chi tiền chạy hiển thị.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>3. Semrush & SimilarWeb Competitive Radar</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Ước tính lưu lượng truy cập trả phí (Paid Traffic), số lượng từ khóa mua quảng cáo và ước tính ngân sách chi tiêu hàng tháng theo ngành Nha khoa tại Việt Nam.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>4. Bảng Giá Niêm Yết & Khảo Sát Thị Trường Thực Tế</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Dữ liệu giá dịch vụ (Implant, Răng sứ Cercon, Niềng Invisalign, Nhổ răng khôn) được cập nhật định kỳ từ website chính thức và bảng giá niêm yết tại phòng khám của 20 chuỗi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM COMPETITOR */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <span>Thêm Nha Khoa Cần Theo Dõi</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCompetitor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tên Thương Hiệu / Phòng Khám</label>
                <input
                  type="text"
                  required
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  placeholder="Ví dụ: Nha Khoa Tân Định"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tên Miền (Domain)</label>
                <input
                  type="text"
                  required
                  value={newCompDomain}
                  onChange={(e) => setNewCompDomain(e.target.value)}
                  placeholder="Ví dụ: nhakhoatandinh.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ngân Sách Ước Tính</label>
                  <input
                    type="text"
                    value={newCompBudget}
                    onChange={(e) => setNewCompBudget(e.target.value)}
                    placeholder="Ví dụ: 100 - 150 Tr"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Khu Vực</label>
                  <input
                    type="text"
                    value={newCompRegion}
                    onChange={(e) => setNewCompRegion(e.target.value)}
                    placeholder="Ví dụ: TP.HCM (Quận 1)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mức Độ Đe Dọa</label>
                <select
                  value={newCompThreat}
                  onChange={(e) => setNewCompThreat(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Cao">Cao</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Thấp">Thấp</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition-colors cursor-pointer"
                >
                  Lưu & Bắt Đầu Theo Dõi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
