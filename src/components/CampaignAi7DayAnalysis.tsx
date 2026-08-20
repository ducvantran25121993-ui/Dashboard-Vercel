import React, { useState, useMemo } from 'react';
import { 
  Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  DollarSign, Target, MousePointerClick, Zap, RefreshCw, ChevronDown, 
  ChevronUp, ShieldCheck, ArrowRight, Layers, Sliders, Ban, FileText, 
  Copy, Check, Calendar, ArrowUpRight, Search, Globe, Tag, Sparkle,
  Clock, MapPin, BarChart3, Filter, Award, XCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  DailyCampaignRecord, 
  CampaignItem, 
  SearchTermItem, 
  KeywordItem, 
  HourlyItem, 
  LocationItem, 
  normalizeDate, 
  formatVND,
  generateMockSearchTerms,
  generateMockKeywords,
  generateMockHourlyData,
  generateMockLocationData
} from '../services/campaignsSheetService';

interface CampaignAi7DayAnalysisProps {
  dailyRecords: DailyCampaignRecord[];
  campaigns: CampaignItem[];
  searchTerms?: SearchTermItem[];
  keywords?: KeywordItem[];
  hourlyData?: HourlyItem[];
  locationData?: LocationItem[];
  onApply7DayFilter: () => void;
  onOpenDetailedAiModal: () => void;
}

export const CampaignAi7DayAnalysis: React.FC<CampaignAi7DayAnalysisProps> = ({
  dailyRecords,
  campaigns,
  searchTerms: propSearchTerms,
  keywords: propKeywords,
  hourlyData: propHourlyData,
  locationData: propLocationData,
  onApply7DayFilter,
  onOpenDetailedAiModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedNegatives, setCopiedNegatives] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'searchAnalysis' | 'aiReport' | 'topPerformers' | 'warnings'>('recommendations');
  const [searchSubTab, setSearchSubTab] = useState<'overview' | 'searchTerms' | 'keywords' | 'hourly' | 'locations'>('overview');
  const [termFilter, setTermFilter] = useState<'all' | 'winning' | 'negative'>('all');
  const [termSearchQuery, setTermSearchQuery] = useState('');

  const searchTerms = useMemo(() => {
    return (propSearchTerms && propSearchTerms.length > 0) ? propSearchTerms : generateMockSearchTerms();
  }, [propSearchTerms]);

  const keywords = useMemo(() => {
    return (propKeywords && propKeywords.length > 0) ? propKeywords : generateMockKeywords();
  }, [propKeywords]);

  const hourlyData = useMemo(() => {
    return (propHourlyData && propHourlyData.length > 0) ? propHourlyData : generateMockHourlyData();
  }, [propHourlyData]);

  const locationData = useMemo(() => {
    return (propLocationData && propLocationData.length > 0) ? propLocationData : generateMockLocationData();
  }, [propLocationData]);

  // Compute 7-day date window (last 7 completed days ending yesterday)
  const dateWindows = useMemo(() => {
    const now = new Date();
    const endCurrent = new Date(now);
    endCurrent.setDate(endCurrent.getDate() - 1);
    endCurrent.setHours(23, 59, 59, 999);

    const startCurrent = new Date(endCurrent);
    startCurrent.setDate(startCurrent.getDate() - 6);
    startCurrent.setHours(0, 0, 0, 0);

    const endPrev = new Date(startCurrent);
    endPrev.setDate(endPrev.getDate() - 1);
    endPrev.setHours(23, 59, 59, 999);

    const startPrev = new Date(endPrev);
    startPrev.setDate(startPrev.getDate() - 6);
    startPrev.setHours(0, 0, 0, 0);

    const formatShort = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}`;
    };

    return {
      currentStart: startCurrent,
      currentEnd: endCurrent,
      currentLabel: `${formatShort(startCurrent)} - ${formatShort(endCurrent)}`,
      prevStart: startPrev,
      prevEnd: endPrev,
      prevLabel: `${formatShort(startPrev)} - ${formatShort(endPrev)}`,
    };
  }, []);

  // Filter daily records for current 7 days vs previous 7 days
  const { current7DaysRecords, prev7DaysRecords } = useMemo(() => {
    const currentList: DailyCampaignRecord[] = [];
    const prevList: DailyCampaignRecord[] = [];

    dailyRecords.forEach((rec) => {
      const { dateObj } = normalizeDate(rec.date || rec.dateFormatted);
      if (!dateObj) return;

      if (dateObj >= dateWindows.currentStart && dateObj <= dateWindows.currentEnd) {
        currentList.push(rec);
      } else if (dateObj >= dateWindows.prevStart && dateObj <= dateWindows.prevEnd) {
        prevList.push(rec);
      }
    });

    return {
      current7DaysRecords: currentList,
      prev7DaysRecords: prevList,
    };
  }, [dailyRecords, dateWindows]);

  // Aggregate metrics for Current 7 days
  const currentMetrics = useMemo(() => {
    const totalSpent = current7DaysRecords.reduce((s, r) => s + r.spent, 0);
    const totalConversions = Math.round(current7DaysRecords.reduce((s, r) => s + r.leads, 0));
    const totalClicks = current7DaysRecords.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = current7DaysRecords.reduce((s, r) => s + r.impressions, 0);
    const avgCpa = totalConversions > 0 ? Math.round(totalSpent / totalConversions) : 0;
    const avgCpc = totalClicks > 0 ? Math.round(totalSpent / totalClicks) : 0;
    const avgCtr = totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : '0.00%';
    const avgConvRate = totalClicks > 0 ? `${((totalConversions / totalClicks) * 100).toFixed(2)}%` : '0.00%';

    return {
      totalSpent,
      totalConversions,
      totalClicks,
      totalImpressions,
      avgCpa,
      avgCpc,
      avgCtr,
      avgConvRate,
    };
  }, [current7DaysRecords]);

  // Aggregate metrics for Previous 7 days
  const prevMetrics = useMemo(() => {
    const totalSpent = prev7DaysRecords.reduce((s, r) => s + r.spent, 0);
    const totalConversions = Math.round(prev7DaysRecords.reduce((s, r) => s + r.leads, 0));
    const totalClicks = prev7DaysRecords.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = prev7DaysRecords.reduce((s, r) => s + r.impressions, 0);
    const avgCpa = totalConversions > 0 ? Math.round(totalSpent / totalConversions) : 0;

    return {
      totalSpent,
      totalConversions,
      totalClicks,
      totalImpressions,
      avgCpa,
    };
  }, [prev7DaysRecords]);

  // Group current 7 days by campaign
  const campaign7DayStats = useMemo(() => {
    const map = new Map<string, {
      name: string;
      spent: number;
      leads: number;
      clicks: number;
      impressions: number;
      type: string;
      status: string;
    }>();

    // Map existing campaign types
    const typeMap = new Map<string, string>();
    campaigns.forEach((c) => {
      typeMap.set(c.name, c.type || 'Google Search');
      map.set(c.name, {
        name: c.name,
        spent: 0,
        leads: 0,
        clicks: 0,
        impressions: 0,
        type: c.type || 'Google Search',
        status: c.status,
      });
    });

    current7DaysRecords.forEach((r) => {
      const campName = r.campaignName?.trim();
      if (!campName) return;

      const detectedType = typeMap.get(campName) || (
        campName.toLowerCase().includes('pmax') || campName.toLowerCase().includes('performance max') ? 'PMax' :
        campName.toLowerCase().includes('display') ? 'Google Display' :
        campName.toLowerCase().includes('video') || campName.toLowerCase().includes('youtube') ? 'Video' : 'Google Search'
      );

      const existing = map.get(campName) || {
        name: campName,
        spent: 0,
        leads: 0,
        clicks: 0,
        impressions: 0,
        type: detectedType,
        status: 'Đang chạy',
      };

      existing.spent += r.spent || 0;
      existing.leads += r.leads || 0;
      existing.clicks += r.clicks || 0;
      existing.impressions += r.impressions || 0;
      map.set(campName, existing);
    });

    return Array.from(map.values()).map((c) => {
      const cpa = c.leads > 0 ? Math.round(c.spent / c.leads) : 0;
      const ctr = c.impressions > 0 ? `${((c.clicks / c.impressions) * 100).toFixed(2)}%` : '0.00%';
      const convRate = c.clicks > 0 ? `${((c.leads / c.clicks) * 100).toFixed(2)}%` : '0.00%';

      return {
        ...c,
        leads: Math.round(c.leads),
        cpa,
        ctr,
        convRate,
      };
    });
  }, [campaigns, current7DaysRecords]);

  // Dedicated Google Search Campaigns Stats (7 Days)
  const searchCampaignsStats = useMemo(() => {
    // Only include search campaigns that actually have activity (impressions, clicks, or spend > 0) in the 7-day period
    const searchOnly = campaign7DayStats.filter((c) => {
      const isSearchType = c.type === 'Google Search' || 
        c.type === 'Search' || 
        c.name.toLowerCase().includes('search') ||
        (!c.type?.includes('Display') && !c.type?.includes('Video') && !c.type?.includes('PMax'));
      
      const has7DayActivity = c.spent > 0 || c.clicks > 0 || c.impressions > 0 || c.leads > 0;
      return isSearchType && has7DayActivity;
    });

    const totalSpent = searchOnly.reduce((s, c) => s + c.spent, 0);
    const totalLeads = searchOnly.reduce((s, c) => s + c.leads, 0);
    const totalClicks = searchOnly.reduce((s, c) => s + c.clicks, 0);
    const totalImpressions = searchOnly.reduce((s, c) => s + c.impressions, 0);
    const avgCpa = totalLeads > 0 ? Math.round(totalSpent / totalLeads) : 0;
    const avgCpc = totalClicks > 0 ? Math.round(totalSpent / totalClicks) : 0;
    const avgCtr = totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : '0.00%';
    const avgConvRate = totalClicks > 0 ? `${((totalLeads / totalClicks) * 100).toFixed(2)}%` : '0.00%';

    // Top Search Winners & Warnings
    const searchWinners = [...searchOnly]
      .filter((c) => c.leads > 0)
      .sort((a, b) => a.cpa - b.cpa)
      .slice(0, 3);

    const searchNeedsOptimization = [...searchOnly]
      .filter((c) => (c.spent > 500000 && c.leads === 0) || (c.leads > 0 && c.cpa > (avgCpa * 1.25)))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 3);

    return {
      list: searchOnly,
      count: searchOnly.length,
      totalSpent,
      totalLeads,
      totalClicks,
      totalImpressions,
      avgCpa,
      avgCpc,
      avgCtr,
      avgConvRate,
      searchWinners,
      searchNeedsOptimization,
    };
  }, [campaign7DayStats]);

  // Identify Top Performers and Warning campaigns overall
  const { topPerformers, warningCampaigns } = useMemo(() => {
    const activeStats = campaign7DayStats.filter((c) => c.status === 'Đang chạy' || c.spent > 0);

    // Top performers: Leads > 0 and CPA <= average CPA or lowest CPA with good lead volume
    const top = [...activeStats]
      .filter((c) => c.leads > 0)
      .sort((a, b) => {
        if (a.cpa !== b.cpa) return a.cpa - b.cpa;
        return b.leads - a.leads;
      })
      .slice(0, 4);

    // Warning campaigns: High spent with 0 leads OR CPA significantly higher than avg
    const avgThreshold = currentMetrics.avgCpa > 0 ? currentMetrics.avgCpa * 1.3 : 300000;
    const warnings = [...activeStats]
      .filter((c) => (c.spent > 1000000 && c.leads === 0) || (c.leads > 0 && c.cpa > avgThreshold))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 4);

    return {
      topPerformers: top,
      warningCampaigns: warnings,
    };
  }, [campaign7DayStats, currentMetrics.avgCpa]);

  // Dynamic Rule-Based Smart Warnings & Critical Alerts
  const smartAlerts = useMemo(() => {
    const alerts: Array<{
      id: string;
      level: 'critical' | 'warning' | 'info' | 'success';
      title: string;
      description: string;
      actionText?: string;
      actionType?: 'filter' | 'tab' | 'ai';
      targetTab?: 'recommendations' | 'searchAnalysis' | 'warnings' | 'topPerformers';
      searchSubTab?: 'overview' | 'searchTerms' | 'keywords' | 'hourly' | 'locations';
    }> = [];

    // 1. Budget Bleed / 0 Lead alert
    const zeroLeadHeavySpend = campaign7DayStats.filter(c => c.spent > 1500000 && c.leads === 0);
    if (zeroLeadHeavySpend.length > 0) {
      const names = zeroLeadHeavySpend.map(c => `"${c.name}"`).slice(0, 2).join(', ');
      const totalLost = zeroLeadHeavySpend.reduce((sum, c) => sum + c.spent, 0);
      alerts.push({
        id: 'zero_lead_drain',
        level: 'critical',
        title: `Phát hiện ${zeroLeadHeavySpend.length} chiến dịch rò rỉ ngân sách (${formatVND(totalLost)})`,
        description: `Chiến dịch ${names} đã tiêu hơn ${formatVND(totalLost)} trong 7 ngày qua nhưng chưa ghi nhận bất kỳ lượt chuyển đổi nào. Cần hạ bid trần hoặc tạm dừng ngay.`,
        actionText: 'Xem chiến dịch cần xử lý',
        actionType: 'tab',
        targetTab: 'warnings',
      });
    }

    // 2. High CPA Surge alert (>30% avg)
    const cpaSpikeCampaigns = campaign7DayStats.filter(c => c.leads > 0 && c.cpa > (currentMetrics.avgCpa * 1.35) && c.spent > 1000000);
    if (cpaSpikeCampaigns.length > 0) {
      alerts.push({
        id: 'cpa_spike',
        level: 'warning',
        title: `${cpaSpikeCampaigns.length} chiến dịch bị đội CPA cao hơn 35% so với mức trung bình`,
        description: `CPA trung bình của nhóm này lên tới ${Math.round(cpaSpikeCampaigns.reduce((s, c) => s + c.cpa, 0) / cpaSpikeCampaigns.length).toLocaleString('vi-VN')} đ/lead. Khuyên bạn nên rà soát lại cụm từ tìm kiếm và thu hẹp vị trí bán kính hiển thị.`,
        actionText: 'Kiểm tra cảnh báo',
        actionType: 'tab',
        targetTab: 'warnings',
      });
    }

    // 3. Search Negative Keywords alert
    const negativeTriggerCount = searchTerms.filter(t => t.isNegativeTrigger).length;
    if (negativeTriggerCount > 0) {
      alerts.push({
        id: 'negative_keywords',
        level: 'warning',
        title: `Phát hiện ${negativeTriggerCount} cụm từ tìm kiếm rác / sai Intent cần phủ định`,
        description: `Các truy vấn như "miễn phí", "tự làm", "học nghề" đang cắn ngân sách hàng ngày. Bổ sung ngay vào danh sách phủ định giúp tiết kiệm ước tính 15-20% ngân sách tìm kiếm.`,
        actionText: 'Rà soát cụm từ rác',
        actionType: 'tab',
        targetTab: 'searchAnalysis',
        searchSubTab: 'searchTerms',
      });
    }

    // 4. Low Quality Score keywords alert
    const lowQsKeywords = keywords.filter(k => Number(k.qualityScore) <= 4);
    if (lowQsKeywords.length > 0) {
      alerts.push({
        id: 'low_qs',
        level: 'warning',
        title: `${lowQsKeywords.length} từ khóa có Quality Score thấp (≤4/10) làm tăng giá CPC`,
        description: `Điểm chất lượng thấp chủ yếu do trải nghiệm trang đích hoặc độ liên quan mẫu quảng cáo chưa đạt chuẩn. Tách Ad Group nhỏ hoặc đổi URL đích để giảm giá click.`,
        actionText: 'Xem từ khóa điểm thấp',
        actionType: 'tab',
        targetTab: 'searchAnalysis',
        searchSubTab: 'keywords',
      });
    }

    // 5. Golden Hour Bidding Opportunity
    const nightWasteHours = hourlyData.filter(h => h.hourNum <= 5 && h.cost > 0 && h.leads === 0);
    if (nightWasteHours.length >= 3) {
      alerts.push({
        id: 'night_hours',
        level: 'info',
        title: 'Khung giờ đêm (0h - 5h) tiêu ngân sách nhưng chuyển đổi = 0',
        description: 'Đề xuất đặt lịch quảng cáo (Ad Schedule) giảm 50% giá thầu hoặc tắt hoàn toàn lúc đêm khuya để dồn ngân sách vào các khung giờ vàng (8h-11h & 14h-16h).',
        actionText: 'Xem biểu đồ giờ',
        actionType: 'tab',
        targetTab: 'searchAnalysis',
        searchSubTab: 'hourly',
      });
    }

    // 6. Scale Winning Opportunity
    if (topPerformers.length >= 2) {
      const topWins = topPerformers.slice(0, 2);
      alerts.push({
        id: 'scale_winners',
        level: 'success',
        title: `Cơ hội Scale: 2 chiến dịch Top Thắng Lớn CPA chỉ ${topWins[0].cpa.toLocaleString('vi-VN')} đ`,
        description: `${topWins.map(c => `"${c.name}"`).join(' và ')} mang lại ${topWins.reduce((s, c) => s + c.leads, 0)} leads với chi phí rất rẻ. Hãy tăng ngay 15-25% ngân sách để tối đa hóa số khách trong tuần.`,
        actionText: 'Xem Top Thắng Lớn',
        actionType: 'tab',
        targetTab: 'topPerformers',
      });
    }

    return alerts;
  }, [campaign7DayStats, currentMetrics.avgCpa, searchTerms, keywords, hourlyData, topPerformers]);

  // Delta calculations
  const spendDiffPct = prevMetrics.totalSpent > 0 
    ? ((currentMetrics.totalSpent - prevMetrics.totalSpent) / prevMetrics.totalSpent) * 100 
    : 0;

  const leadsDiffPct = prevMetrics.totalConversions > 0 
    ? ((currentMetrics.totalConversions - prevMetrics.totalConversions) / prevMetrics.totalConversions) * 100 
    : 0;

  const cpaDiffPct = prevMetrics.avgCpa > 0 
    ? ((currentMetrics.avgCpa - prevMetrics.avgCpa) / prevMetrics.avgCpa) * 100 
    : 0;

  // Run deep 7-day AI Analysis
  const runAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/analyze-7days-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current7DaysMetrics: currentMetrics,
          previous7DaysMetrics: prevMetrics,
          topCampaigns: topPerformers,
          warningCampaigns,
          allCampaignsSample: campaign7DayStats.slice(0, 25),
          searchCampaignsMetrics: searchCampaignsStats,
          searchTerms: searchTerms.slice(0, 20),
          keywords: keywords.slice(0, 20),
          hourlyData: hourlyData.slice(0, 24),
          locationData: locationData.slice(0, 10),
          dateRangeLabel: `7 ngày qua (${dateWindows.currentLabel}) so với (${dateWindows.prevLabel})`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi khi máy chủ phân tích 7 ngày');
      }

      setAiReport(data.analysis);
      setActiveTab('aiReport');
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Không thể tạo báo cáo AI lúc này. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 shadow-2xl overflow-hidden text-slate-100 transition-all">
      {/* HEADER BAR */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-white">
                ⚡ AI Tự Động Phân Tích Chu Kỳ 7 Ngày & Gợi Ý Tối Ưu Chiến Dịch
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Gemini 3.7 Flash Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Chu kỳ phân tích: <strong className="text-cyan-300">{dateWindows.currentLabel}</strong> (kết thúc hôm qua) so với <strong className="text-slate-300">{dateWindows.prevLabel}</strong></span>
              <span className="text-slate-600">•</span>
              <span>Theo chuẩn Google Ads</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onApply7DayFilter}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            title="Lọc bảng chiến dịch đúng 7 ngày qua"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lọc 7 Ngày Trên Bảng</span>
          </button>

          <button
            onClick={runAiAnalysis}
            disabled={isAiLoading}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Đang phân tích 7 ngày...' : 'Chạy AI Phân Tích Sâu'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* EXPANDABLE BODY */}
      {isExpanded && (
        <div className="p-5 space-y-6">
          {/* 7-DAY EXECUTIVE KPI STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* KPI 1: 7-Day Spend */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>Chi phí 7 ngày</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                  spendDiffPct <= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {spendDiffPct > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(spendDiffPct).toFixed(1)}%
                </span>
              </div>
              <p className="text-lg font-black text-white">{formatVND(currentMetrics.totalSpent)}</p>
              <p className="text-[10px] text-slate-500">7 ngày trước: {formatVND(prevMetrics.totalSpent)}</p>
            </div>

            {/* KPI 2: 7-Day Conversions */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>Lượt Chuyển Đổi</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                  leadsDiffPct >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {leadsDiffPct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(leadsDiffPct).toFixed(1)}%
                </span>
              </div>
              <p className="text-lg font-black text-emerald-400">{currentMetrics.totalConversions.toLocaleString('vi-VN')} leads</p>
              <p className="text-[10px] text-slate-500">7 ngày trước: {prevMetrics.totalConversions.toLocaleString('vi-VN')} leads</p>
            </div>

            {/* KPI 3: 7-Day CPA */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>CPA Trung Bình</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                  cpaDiffPct <= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {cpaDiffPct <= 0 ? 'Tối ưu hơn' : 'Tăng giá'}
                </span>
              </div>
              <p className="text-lg font-black text-amber-300">{currentMetrics.avgCpa.toLocaleString('vi-VN')} đ</p>
              <p className="text-[10px] text-slate-500">7 ngày trước: {prevMetrics.avgCpa.toLocaleString('vi-VN')} đ</p>
            </div>

            {/* KPI 4: 7-Day CTR & Clicks */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>CTR & CPC</span>
                <span className="text-[10px] text-cyan-400 font-bold">{currentMetrics.avgConvRate} CR</span>
              </div>
              <p className="text-lg font-black text-purple-300">{currentMetrics.avgCtr} • {currentMetrics.avgCpc.toLocaleString('vi-VN')} đ</p>
              <p className="text-[10px] text-slate-500">{currentMetrics.totalClicks.toLocaleString('vi-VN')} clicks ({currentMetrics.totalImpressions.toLocaleString('vi-VN')} hiển thị)</p>
            </div>
          </div>

          {/* SUB-TABS NAVIGATION */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'recommendations'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Gợi Ý Hành Động Thông Minh</span>
            </button>

            {/* DEDICATED SEARCH TAB */}
            <button
              onClick={() => setActiveTab('searchAnalysis')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'searchAnalysis'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/20'
                  : 'text-cyan-400 hover:text-white hover:bg-slate-800 border border-cyan-500/30'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-cyan-300" />
              <span>🔍 Phân Tích Chuyên Sâu Chiến Dịch Search ({searchCampaignsStats.count})</span>
            </button>

            <button
              onClick={() => setActiveTab('topPerformers')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'topPerformers'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Top Thắng Lớn ({topPerformers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('warnings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'warnings'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Cảnh Báo CPA Cao ({warningCampaigns.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('aiReport')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'aiReport'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Báo Cáo AI Chuyên Sâu {aiReport ? '✓' : ''}</span>
            </button>
          </div>

          {/* TAB 1: SMART ACTION RECOMMENDATIONS (ENRICHED WITH DEDICATED SEARCH ACTIONS) */}
          {activeTab === 'recommendations' && (
            <div className="space-y-5">
              {/* DYNAMIC SMART ALERTS / NOTIFICATION STRIP */}
              {smartAlerts.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      Hệ Thống Cảnh Báo Sớm & Phát Hiện Bất Thường (7 Ngày Qua)
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {smartAlerts.length} Thông Báo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {smartAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 shadow-md ${
                          alert.level === 'critical'
                            ? 'bg-rose-950/40 border-rose-500/50 shadow-rose-950/30'
                            : alert.level === 'warning'
                            ? 'bg-amber-950/30 border-amber-500/40 shadow-amber-950/20'
                            : alert.level === 'success'
                            ? 'bg-emerald-950/30 border-emerald-500/40 shadow-emerald-950/20'
                            : 'bg-cyan-950/30 border-cyan-500/40 shadow-cyan-950/20'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {alert.level === 'critical' ? (
                              <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                                <XCircle className="w-4 h-4" />
                              </span>
                            ) : alert.level === 'warning' ? (
                              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                                <AlertTriangle className="w-4 h-4" />
                              </span>
                            ) : alert.level === 'success' ? (
                              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                                <Zap className="w-4 h-4" />
                              </span>
                            )}
                            <h5 className={`text-xs font-bold ${
                              alert.level === 'critical' ? 'text-rose-300' :
                              alert.level === 'warning' ? 'text-amber-300' :
                              alert.level === 'success' ? 'text-emerald-300' : 'text-cyan-300'
                            }`}>
                              {alert.title}
                            </h5>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed pl-7">
                            {alert.description}
                          </p>
                        </div>

                        {alert.actionText && (
                          <div className="pl-7 pt-1 flex items-center justify-between border-t border-slate-800/60">
                            <span className="text-[10px] text-slate-400 font-medium">Hành động đề xuất:</span>
                            <button
                              onClick={() => {
                                if (alert.targetTab) {
                                  setActiveTab(alert.targetTab);
                                  if (alert.searchSubTab) {
                                    setSearchSubTab(alert.searchSubTab);
                                  }
                                }
                              }}
                              className={`text-[11px] font-bold flex items-center gap-1 hover:underline ${
                                alert.level === 'critical' ? 'text-rose-400' :
                                alert.level === 'warning' ? 'text-amber-400' :
                                alert.level === 'success' ? 'text-emerald-400' : 'text-cyan-400'
                              }`}
                            >
                              {alert.actionText} <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlight Banner for Search Strategy */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-950/80 to-cyan-950/60 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      Gợi ý Chiến Lược Tìm Kiếm (Google Search 7 Ngày)
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {searchCampaignsStats.count} Chiến Dịch Search
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      CPA trung bình Search: <strong className="text-amber-300">{searchCampaignsStats.avgCpa.toLocaleString('vi-VN')} đ</strong> • CTR: <strong className="text-cyan-300">{searchCampaignsStats.avgCtr}</strong> • Leads: <strong className="text-emerald-400">{searchCampaignsStats.totalLeads}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('searchAnalysis')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  Mở Bảng Phân Tích Search Chi Tiết
                </button>
              </div>

              {/* 8 COMPREHENSIVE SMART RECOMMENDATIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Budget Reallocation */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Sliders className="w-3 h-3" /> 1. Điều Chỉnh Ngân Sách
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold">+15% đến +25% Lead</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {topPerformers.length > 0 
                        ? `Tăng Ngân Sách Cho ${topPerformers.slice(0, 2).map(c => `"${c.name}"`).join(' & ')}`
                        : 'Tăng 15-25% Ngân Sách Cho Các Chiến Dịch CPA Thấp'}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {topPerformers.length > 0 ? (
                        <>
                          Trong 7 ngày qua, {topPerformers.slice(0, 2).map(c => `chiến dịch "${c.name}" (CPA: ${c.cpa.toLocaleString('vi-VN')} đ, ${c.leads} leads)`).join(' và ')} đang đạt hiệu quả tốt nhất. Hãy tăng ngân sách từ 15-25% để kéo thêm khách hàng tiềm năng.
                        </>
                      ) : (
                        <>
                          Rà soát các chiến dịch có CPA ổn định dưới mức trung bình ({currentMetrics.avgCpa.toLocaleString('vi-VN')} đ) để tăng thêm 15-25% ngân sách.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Media Team</span>
                    <button
                      onClick={onApply7DayFilter}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Xem số liệu 7 ngày <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card 2: Search Match Types & Keyword Intent */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                        <Search className="w-3 h-3" /> 2. Từ Khóa Search (Match Types)
                      </span>
                      <span className="text-[11px] text-cyan-400 font-bold">Tăng Đúng Intent 90%</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Chuyển Đối Sánh Cụm Từ "Phrase" & Chính Xác [Exact]</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tập trung 80% ngân sách tìm kiếm vào cụm từ mang ý định đặt lịch khám: <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"trồng răng implant uy tín"</code>, <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"bọc răng sứ ở đâu tốt"</code>, <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">[giá cấy ghép implant hcm]</code> để chặn click tò mò.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Tối ưu: Từ khóa Search</span>
                    <button
                      onClick={() => {
                        setActiveTab('searchAnalysis');
                        setSearchSubTab('keywords');
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Bảng từ khóa <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card 3: Search Impression Share & Bidding */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 transition-all space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        <Target className="w-3 h-3" /> 3. Đấu Thầu & Top 1 Search
                      </span>
                      <span className="text-[11px] text-blue-400 font-bold">Chiếm Vị Trí #1</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Target CPA & Tỷ Lệ Hiển Thị Đầu Trang (Abs. Top IS)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Đặt mục tiêu Target CPA ở mức <strong className="text-amber-300">{Math.round(searchCampaignsStats.avgCpa * 0.9).toLocaleString('vi-VN')} đ</strong> cho các chiến dịch Search đã có trên 25 chuyển đổi để giữ tỷ lệ hiển thị đầu trang trên 75% cho các từ khóa cốt lõi.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Bidding: Target CPA</span>
                    <button
                      onClick={() => setActiveTab('searchAnalysis')}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Xem chiến dịch <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card 4: Negative Keywords */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Ban className="w-3 h-3" /> 4. Phủ Định Truy Vấn Search Rác
                      </span>
                      <span className="text-[11px] text-amber-400 font-bold">Tiết Kiệm ~4 Tr/tuần</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Bổ Sung Danh Sách Phủ Định 7 Ngày Qua Cho Mạng Tìm Kiếm</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Loại bỏ ngay các truy vấn tìm kiếm không mang lại khách: <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"miễn phí"</code>, <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"tự làm tại nhà"</code>, <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"sinh viên thực tập"</code>, <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"giá rẻ 50k"</code>.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Tăng CTR Search +1.8%</span>
                    <button
                      onClick={() => {
                        setActiveTab('searchAnalysis');
                        setSearchSubTab('searchTerms');
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Xem cụm từ tìm kiếm <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card 5: Hourly Peak Scheduling */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 5. Lịch Bidding Khung Giờ Vàng
                      </span>
                      <span className="text-[11px] text-indigo-400 font-bold">+25% Lead Khung Giờ Đỉnh</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Tăng +25% Thầu Lúc 8h-11h & 14h-16h, Giảm 50% Ban Đêm</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Dữ liệu 7 ngày qua cho thấy 68% khách gọi điện và điền form trong 2 khung giờ sáng và đầu giờ chiều. Đêm khuya (0h-5h) lượt click không ra lead, nên giảm giá thầu để tránh rò rỉ ngân sách.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Tối ưu Ad Schedule</span>
                    <button
                      onClick={() => {
                        setActiveTab('searchAnalysis');
                        setSearchSubTab('hourly');
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Xem giờ vàng <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card 6: Geographic Location Radius */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 transition-all space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> 6. Bán Kính Chi Nhánh Trọng Điểm
                      </span>
                      <span className="text-[11px] text-teal-400 font-bold">Tối Ưu 30+ Phòng Khám</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Tăng Giá Thầu Bán Kính 7km Quanh TP.HCM & Bình Dương</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      TP.HCM và Bình Dương đang có tỷ lệ chuyển đổi form khám cao gấp 2.2 lần so với các tỉnh xa. Tăng +15% bid cho vị trí bán kính 5-7km quanh các chi nhánh lớn của Tâm Đức Smile.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Phân bổ vị trí địa lý</span>
                    <button
                      onClick={() => {
                        setActiveTab('searchAnalysis');
                        setSearchSubTab('locations');
                      }}
                      className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Bảng vị trí <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card 7: Search RSA Ad Copy */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-all space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> 7. Mẫu RSA & Tiện Ích Mở Rộng
                      </span>
                      <span className="text-[11px] text-purple-400 font-bold">Điểm Chất Lượng 9/10</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Nâng Ad Strength Search Lên "Excellent"</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ghim từ khóa vào Headline 1, chèn thông điệp cam kết ở Headline 2: <strong className="text-purple-300">"Bác sĩ CKI 15 Năm Kinh Nghiệm - Trả Góp 0% - Đưa Đón Sân Bay Việt Kiều"</strong>. Thêm tiện ích Callout và Sitelinks bảng giá minh bạch.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">CTR kỳ vọng: 8-12%</span>
                    <button
                      onClick={onOpenDetailedAiModal}
                      className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Hỏi AI viết mẫu <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card 8: Landing Page CRO */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> 8. Tối Ưu Tỷ Lệ Chuyển Đổi (CRO)
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold">Tăng CR Form +20%</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Đồng Bộ Trang Đích Cho Từng Nhóm Từ Khóa Search</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Từ khóa tìm kiếm về "Bảng giá" phải trỏ thẳng đến bảng giá chi tiết; từ khóa "Trồng răng không đau" phải trỏ đến công nghệ gây tê và video feedback khách hàng thực tế để tăng tỷ lệ để lại số điện thoại ngay từ lần nhấp đầu tiên.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Trang đích: Nha Khoa</span>
                    <button
                      onClick={onOpenDetailedAiModal}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Tối ưu Form <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEDICATED SEARCH CAMPAIGNS ANALYSIS & RECOMMENDATIONS */}
          {activeTab === 'searchAnalysis' && (
            <div className="space-y-5">
              {/* Top Search KPI Summary */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        Phân Tích Chuyên Sâu Mạng Tìm Kiếm (Google Search 7 Ngày)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Bao gồm {searchCampaignsStats.count} chiến dịch tìm kiếm có phát sinh lượt hiển thị / chi phí
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 self-start sm:self-auto">
                    Chiếm {currentMetrics.totalSpent > 0 ? Math.round((searchCampaignsStats.totalSpent / currentMetrics.totalSpent) * 100) : 0}% Tổng Ngân Sách
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Chi phí Search 7 ngày</span>
                    <p className="text-base font-black text-white mt-0.5">{formatVND(searchCampaignsStats.totalSpent)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Lượt Chuyển Đổi (Leads)</span>
                    <p className="text-base font-black text-emerald-400 mt-0.5">{searchCampaignsStats.totalLeads} leads</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[11px] text-slate-400">CPA Trung Bình Search</span>
                    <p className="text-base font-black text-amber-300 mt-0.5">{searchCampaignsStats.avgCpa.toLocaleString('vi-VN')} đ</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[11px] text-slate-400">CTR & CPC Trung Bình</span>
                    <p className="text-base font-black text-cyan-300 mt-0.5">{searchCampaignsStats.avgCtr} • {searchCampaignsStats.avgCpc.toLocaleString('vi-VN')} đ</p>
                  </div>
                </div>
              </div>

              {/* SEARCH SUB-NAVIGATION TABS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80">
                <button
                  onClick={() => setSearchSubTab('overview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    searchSubTab === 'overview'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Chiến Lược Tổng Quan</span>
                </button>

                <button
                  onClick={() => setSearchSubTab('searchTerms')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    searchSubTab === 'searchTerms'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Cụm Từ Tìm Kiếm Thực Tế ({searchTerms.length})</span>
                </button>

                <button
                  onClick={() => setSearchSubTab('keywords')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    searchSubTab === 'keywords'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Từ Khóa & Quality Score ({keywords.length})</span>
                </button>

                <button
                  onClick={() => setSearchSubTab('hourly')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    searchSubTab === 'hourly'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Khung Giờ Vàng (Peak Hours)</span>
                </button>

                <button
                  onClick={() => setSearchSubTab('locations')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    searchSubTab === 'locations'
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Vị Trí Khu Vực ({locationData.length})</span>
                </button>
              </div>

              {/* SUB-TAB 1: STRATEGY OVERVIEW */}
              {searchSubTab === 'overview' && (
                <div className="space-y-4">
                  {/* 3 Core Search Strategy Pillars */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* Pillar 1: Match Types */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                        <Tag className="w-4 h-4" />
                        <span>1. Cấu Trúc Đối Sánh Từ Khóa (Match Types)</span>
                      </div>
                      <h5 className="text-xs font-bold text-white">Chuyển Dần Sang Cụm Từ "Phrase" & Chính Xác [Exact]</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Đối sánh mở rộng (Broad Match) trong ngành nha khoa dễ dẫn tới các click rác hỏi bài tập, tra từ điển. Nên cô lập 80% ngân sách cho cụm từ <code className="text-cyan-300">"trồng răng implant"</code>, <code className="text-cyan-300">"bọc răng sứ uy tín"</code> và chính xác <code className="text-emerald-300">[bảng giá trồng răng implant tphcm]</code>.
                      </p>
                    </div>

                    {/* Pillar 2: Search Impression Share */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                        <Globe className="w-4 h-4" />
                        <span>2. Tỷ Lệ Hiển Thị Đầu Trang (Abs. Top IS)</span>
                      </div>
                      <h5 className="text-xs font-bold text-white">Chiếm Vị Trí #1 Cho Từ Khóa Ý Định Cao (High Intent)</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Khách hàng đau răng hoặc cần bọc sứ gấp thường chỉ nhấp vào 2 vị trí đầu tiên. Đối với các chiến dịch có CPA thấp, hãy tăng giá thầu để đạt trên 75% Tỷ lệ hiển thị đầu trang tuyệt đối (Absolute Top Impression Share).
                      </p>
                    </div>

                    {/* Pillar 3: RSA & Quality Score */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                        <Sparkle className="w-4 h-4" />
                        <span>3. Điểm Chất Lượng & Mẫu Quảng Cáo (RSA)</span>
                      </div>
                      <h5 className="text-xs font-bold text-white">Đạt Ad Strength "Excellent" & Giảm 20% Giá Click</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Điểm chất lượng (Quality Score) 8-10/10 giúp giảm đáng kể CPC cạnh tranh. Cần đảm bảo từ khóa xuất hiện ngay trong Headline 1 và dòng mô tả 1, kết nối đồng nhất với Landing Page có tải trang nhanh dưới 1.8 giây.
                      </p>
                    </div>
                  </div>

                  {/* Specific Search Winners & Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search Winners */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Top Chiến Dịch Search Hiệu Quả Nhất 7 Ngày
                        </h5>
                        <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">Khuyên: Tăng Budget +20%</span>
                      </div>
                      <div className="space-y-2">
                        {searchCampaignsStats.searchWinners.map((c, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                            <div className="truncate max-w-[200px]">
                              <p className="font-bold text-white truncate">{c.name}</p>
                              <p className="text-[10px] text-slate-400">CTR: {c.ctr} • CR: {c.convRate}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-400">{c.leads} leads</p>
                              <p className="text-[10px] text-amber-300">CPA: {c.cpa.toLocaleString('vi-VN')} đ</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Search Needs Optimization */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> Chiến Dịch Search Cần Rà Soát Từ Khóa
                        </h5>
                        <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded">Khuyên: Thêm Phủ Định</span>
                      </div>
                      <div className="space-y-2">
                        {searchCampaignsStats.searchNeedsOptimization.map((c, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                            <div className="truncate max-w-[200px]">
                              <p className="font-bold text-white truncate">{c.name}</p>
                              <p className="text-[10px] text-slate-400">Chi phí: {formatVND(c.spent)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-rose-400">{c.leads} leads</p>
                              <p className="text-[10px] text-rose-300">{c.cpa > 0 ? `CPA: ${c.cpa.toLocaleString('vi-VN')} đ` : 'Chưa có lead'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: SEARCH TERMS (CỤM TỪ TÌM KIẾM THỰC TẾ & TỪ KHÓA PHỦ ĐỊNH) */}
              {searchSubTab === 'searchTerms' && (() => {
                const filteredTerms = searchTerms.filter(t => {
                  if (termFilter === 'winning' && t.leads <= 0) return false;
                  if (termFilter === 'negative' && !t.isNegativeTrigger) return false;
                  if (termSearchQuery) {
                    const q = termSearchQuery.toLowerCase();
                    return t.searchTerm.toLowerCase().includes(q) || t.campaign.toLowerCase().includes(q);
                  }
                  return true;
                });

                const negativeTermsList = searchTerms.filter(t => t.isNegativeTrigger).map(t => t.searchTerm);

                const handleCopyNegatives = () => {
                  navigator.clipboard.writeText(negativeTermsList.join('\n'));
                  setCopiedNegatives(true);
                  setTimeout(() => setCopiedNegatives(false), 2000);
                };

                return (
                  <div className="space-y-4">
                    {/* Filter & Action Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={termSearchQuery}
                            onChange={(e) => setTermSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm cụm từ..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                          <button
                            onClick={() => setTermFilter('all')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                              termFilter === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Tất cả ({searchTerms.length})
                          </button>
                          <button
                            onClick={() => setTermFilter('winning')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                              termFilter === 'winning' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Sinh Lead Tốt ({searchTerms.filter(t => t.leads > 0).length})
                          </button>
                          <button
                            onClick={() => setTermFilter('negative')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                              termFilter === 'negative' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Cảnh Báo Phủ Định ({negativeTermsList.length})
                          </button>
                        </div>
                      </div>

                      {negativeTermsList.length > 0 && (
                        <button
                          onClick={handleCopyNegatives}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 transition-all whitespace-nowrap"
                        >
                          {copiedNegatives ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedNegatives ? 'Đã sao chép!' : `Sao chép ${negativeTermsList.length} từ khóa phủ định`}</span>
                        </button>
                      )}
                    </div>

                    {/* Search Terms Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 shadow-xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400">
                            <th className="py-3 px-3.5 font-semibold">Cụm Từ Người Dùng Tìm Kiếm</th>
                            <th className="py-3 px-3 font-semibold">Chiến Dịch / Nhóm</th>
                            <th className="py-3 px-2.5 font-semibold text-center">Đối Sánh</th>
                            <th className="py-3 px-3 font-semibold text-right">Lượt Nhấp</th>
                            <th className="py-3 px-3 font-semibold text-right">Chi Phí</th>
                            <th className="py-3 px-3 font-semibold text-right">Leads</th>
                            <th className="py-3 px-3 font-semibold text-right">CPA</th>
                            <th className="py-3 px-3.5 font-semibold text-center">Khuyến Nghị</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredTerms.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                              <td className="py-3 px-3.5 font-bold text-white max-w-xs">
                                <span className="font-mono text-cyan-200">{t.searchTerm}</span>
                              </td>
                              <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={t.campaign}>
                                <div className="truncate">{t.campaign}</div>
                                <div className="text-[10px] text-slate-500">{t.adGroup}</div>
                              </td>
                              <td className="py-3 px-2.5 text-center">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                  {t.matchType}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right text-slate-300">
                                {t.clicks} <span className="text-[10px] text-slate-500">({t.ctr})</span>
                              </td>
                              <td className="py-3 px-3 text-right font-medium text-slate-300">
                                {formatVND(t.cost)}
                              </td>
                              <td className="py-3 px-3 text-right font-bold text-emerald-400">
                                {t.leads}
                              </td>
                              <td className="py-3 px-3 text-right font-bold text-amber-300">
                                {t.cpa > 0 ? `${t.cpa.toLocaleString('vi-VN')} đ` : '-'}
                              </td>
                              <td className="py-3 px-3.5 text-center">
                                {t.isNegativeTrigger ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                    <XCircle className="w-3 h-3 text-rose-400" /> Phủ định ngay
                                  </span>
                                ) : t.leads >= 10 ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    <Award className="w-3 h-3 text-emerald-400" /> Cụm từ vàng
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                    <CheckCircle2 className="w-3 h-3 text-blue-400" /> Giữ & Scale
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* SUB-TAB 3: KEYWORDS & QUALITY SCORE */}
              {searchSubTab === 'keywords' && (
                <div className="space-y-4">
                  {/* Quality Score Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Điểm Chất Lượng Tốt (8-10/10)</span>
                        <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400"><Award className="w-3.5 h-3.5" /></span>
                      </div>
                      <div className="text-xl font-black text-emerald-300">
                        {keywords.filter(k => Number(k.qualityScore) >= 8).length} / {keywords.length} Từ Khóa
                      </div>
                      <p className="text-[11px] text-emerald-400/80">Giúp giảm ~20-30% chi phí giá thầu CPC cạnh tranh</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Điểm Trung Bình (5-7/10)</span>
                        <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400"><Zap className="w-3.5 h-3.5" /></span>
                      </div>
                      <div className="text-xl font-black text-amber-300">
                        {keywords.filter(k => Number(k.qualityScore) >= 5 && Number(k.qualityScore) < 8).length} Từ Khóa
                      </div>
                      <p className="text-[11px] text-amber-400/80">Cần nâng cấp tiêu đề RSA & tốc độ trang đích</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Cần Tối Ưu Gấp (1-4/10)</span>
                        <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400"><AlertTriangle className="w-3.5 h-3.5" /></span>
                      </div>
                      <div className="text-xl font-black text-rose-300">
                        {keywords.filter(k => Number(k.qualityScore) < 5).length} Từ Khóa
                      </div>
                      <p className="text-[11px] text-rose-400/80">Bị đội giá thầu cao; nên tách ad group hoặc thay URL</p>
                    </div>
                  </div>

                  {/* Keywords Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 shadow-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400">
                          <th className="py-3 px-3.5 font-semibold">Từ Khóa (Keyword)</th>
                          <th className="py-3 px-3 font-semibold">Nhóm & Chiến Dịch</th>
                          <th className="py-3 px-2.5 font-semibold text-center">Quality Score</th>
                          <th className="py-3 px-3 font-semibold">Trang Đích (Landing Exp)</th>
                          <th className="py-3 px-3 font-semibold">Độ Liên Quan Mẫu QC</th>
                          <th className="py-3 px-3 font-semibold text-right">Chi Phí</th>
                          <th className="py-3 px-3 font-semibold text-right">Leads</th>
                          <th className="py-3 px-3 font-semibold text-right">CPA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {keywords.map((k) => (
                          <tr key={k.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-3 px-3.5 font-bold text-white">
                              <span className="font-mono text-cyan-300">{k.keyword}</span>
                              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                                {k.matchType}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                              <div className="font-medium text-slate-300 truncate">{k.adGroup}</div>
                              <div className="text-[10px] text-slate-500 truncate">{k.campaign}</div>
                            </td>
                            <td className="py-3 px-2.5 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                                Number(k.qualityScore) >= 8 
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                  : Number(k.qualityScore) >= 5 
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              }`}>
                                {k.qualityScore}/10
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              <span className={`text-[11px] ${k.landingExp.includes('Trên') ? 'text-emerald-400' : k.landingExp.includes('Dưới') ? 'text-rose-400' : 'text-amber-400'}`}>
                                {k.landingExp}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              <span className={`text-[11px] ${k.adRelevance.includes('Trên') ? 'text-emerald-400' : k.adRelevance.includes('Dưới') ? 'text-rose-400' : 'text-amber-400'}`}>
                                {k.adRelevance}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right font-medium text-slate-300">
                              {formatVND(k.cost)}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-emerald-400">
                              {k.leads}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-amber-300">
                              {k.cpa > 0 ? `${k.cpa.toLocaleString('vi-VN')} đ` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: HOURLY PEAK PERFORMANCE */}
              {searchSubTab === 'hourly' && (
                <div className="space-y-4">
                  {/* Recommended Hourly Action Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <Clock className="w-4 h-4" />
                        <span>Khung Giờ Vàng (8h-11h, 14h-16h, 19h-21h)</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Tập trung hơn <strong>70% lượng Lead</strong> trong ngày với CPA rẻ nhất.
                      </p>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Khuyến nghị Lịch Quảng Cáo:</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                          Tăng Giá Thầu +20% đến +30%
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-rose-400 font-bold">
                        <Ban className="w-4 h-4" />
                        <span>Khung Giờ Đêm Khuya (0h - 6h Sáng)</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Chỉ phát sinh click tò mò, tỷ lệ chuyển đổi form/gọi điện gần như <strong>bằng 0</strong>.
                      </p>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Khuyến nghị Lịch Quảng Cáo:</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                          Giảm Giá Thầu -50% hoặc Tắt
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hourly Distribution Grid */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      Phân Bố Chi Phí & Lượt Chuyển Đổi Theo Khung Giờ Trong Ngày
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
                      {hourlyData.map((h, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border transition-all ${
                            h.isGoldenHour
                              ? 'bg-emerald-950/40 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                              : h.hourNum <= 5
                              ? 'bg-rose-950/20 border-rose-500/20 opacity-70'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-black text-white">{h.hour}</span>
                            {h.isGoldenHour && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300">
                                Giờ vàng
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 space-y-0.5">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">Leads:</span>
                              <strong className={h.leads > 0 ? 'text-emerald-400' : 'text-slate-500'}>{h.leads}</strong>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">Chi phí:</span>
                              <span className="text-slate-300">{formatVND(h.cost)}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">CPA:</span>
                              <span className="text-amber-300 font-bold">{h.cpa > 0 ? `${Math.round(h.cpa / 1000)}k` : '-'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: LOCATIONS */}
              {searchSubTab === 'locations' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h5 className="text-xs font-bold text-white flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-teal-400" />
                          Hiệu Suất Tìm Kiếm Theo Khu Vực & Tỉnh Thành (Hệ Thống Chi Nhánh)
                        </h5>
                        <p className="text-[11px] text-slate-400">Tối ưu giá thầu theo bán kính quanh 30+ chi nhánh Nha Khoa Tâm Đức Smile</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                        {locationData.length} Khu Vực Trọng Điểm
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                            <th className="py-2.5 px-3 font-semibold">Tỉnh Thành / Khu Vực</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Lượt Hiển Thị</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Lượt Nhấp</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Chi Phí</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Lượt Chuyển Đổi</th>
                            <th className="py-2.5 px-3 font-semibold text-right">CPA</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Điều Chỉnh Thầu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {locationData.map((loc, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                              <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                                <span>{loc.location}</span>
                              </td>
                              <td className="py-2.5 px-3 text-right text-slate-300">{loc.impressions.toLocaleString('vi-VN')}</td>
                              <td className="py-2.5 px-3 text-right text-slate-300">{loc.clicks.toLocaleString('vi-VN')}</td>
                              <td className="py-2.5 px-3 text-right font-medium text-slate-200">{formatVND(loc.cost)}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{loc.leads} leads</td>
                              <td className="py-2.5 px-3 text-right font-bold text-amber-300">{loc.cpa.toLocaleString('vi-VN')} đ</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  loc.cpa <= 145000 
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                    : loc.cpa > 155000 
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                                    : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                }`}>
                                  {loc.cpa <= 145000 ? '+15% Thầu' : loc.cpa > 155000 ? '-10% Thầu' : 'Giữ Chuẩn'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TOP PERFORMERS */}
          {activeTab === 'topPerformers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Các chiến dịch có CPA tối ưu nhất và số lượng lead cao trong 7 ngày qua:</span>
                <span className="text-emerald-400 font-bold">Khuyến nghị: Scale ngân sách +15% đến +30%</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topPerformers.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{c.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        Top {idx + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500">Chi phí 7 ngày:</span>
                        <p className="font-bold text-slate-200">{formatVND(c.spent)}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Chuyển đổi:</span>
                        <p className="font-bold text-emerald-400">{c.leads} leads</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">CPA:</span>
                        <p className="font-bold text-amber-300">{c.cpa.toLocaleString('vi-VN')} đ</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WARNING CAMPAIGNS */}
          {activeTab === 'warnings' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">Danh Sách Cảnh Báo Chiến Dịch Cần Tối Ưu Khẩn Cấp</h4>
                    <p className="text-[11px] text-slate-400">Đang tiêu ngân sách lớn nhưng CPA vượt ngưỡng an toàn hoặc chưa ghi nhận chuyển đổi trong 7 ngày</p>
                  </div>
                </div>
                <span className="text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 shrink-0">
                  Khuyến nghị: Hạ trần giá thầu / Thêm phủ định / Tách Ad Group
                </span>
              </div>

              {warningCampaigns.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Tuyệt Vời! Không Có Chiến Dịch Nào Bị Cảnh Báo</h4>
                  <p className="text-xs text-slate-400">Tất cả các chiến dịch đang hoạt động trong 7 ngày qua đều duy trì CPA trong ngưỡng an toàn.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {warningCampaigns.map((c, idx) => {
                    const isZeroLead = c.leads === 0 && c.spent > 0;
                    const isVeryHighCpa = c.cpa > (currentMetrics.avgCpa * 1.4);
                    const isLowCtr = parseFloat(c.ctr) < 2.0;

                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/40 hover:border-rose-500/70 transition-all space-y-3 shadow-lg shadow-rose-950/20">
                        <div className="flex items-center justify-between gap-2">
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-xs font-bold text-white truncate block">{c.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{c.type}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${
                            isZeroLead 
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {isZeroLead ? '🚨 Rò Rỉ: 0 Lead' : '⚠️ CPA Quá Cao'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-800/80">
                          <div>
                            <span className="text-[10px] text-slate-500">Chi phí 7 ngày:</span>
                            <p className="font-bold text-slate-200">{formatVND(c.spent)}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500">Chuyển đổi:</span>
                            <p className={`font-bold ${c.leads > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                              {c.leads} leads
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500">CPA thực tế:</span>
                            <p className="font-bold text-rose-300">
                              {c.cpa > 0 ? `${c.cpa.toLocaleString('vi-VN')} đ` : 'Chưa có lead'}
                            </p>
                          </div>
                        </div>

                        {/* Diagnostic Root Cause & Recommendation */}
                        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1.5">
                          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>Chẩn đoán nguyên nhân & Giải pháp:</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed text-[11px]">
                            {isZeroLead 
                              ? 'Chiến dịch tiêu tiền nhưng không phát sinh lead. Hãy kiểm tra ngay lại link trang đích (URL), biểu mẫu đăng ký có bị lỗi submit không, và bổ sung ngay từ khóa phủ định.'
                              : isVeryHighCpa
                              ? `CPA đang cao hơn trung bình ngành (+${Math.round(((c.cpa - currentMetrics.avgCpa) / currentMetrics.avgCpa) * 100)}%). Nên giảm giá thầu trần Max CPC xuống 20% và tắt khung giờ ban đêm.`
                              : isLowCtr
                              ? 'Tỷ lệ CTR thấp (<2%). Cần viết lại tiêu đề RSA thu hút hơn và thêm tiện ích mở rộng (Sitelinks, Callouts).'
                              : 'Khuyên bạn thu hẹp bán kính vị trí và chỉ giữ lại các cụm từ tìm kiếm chính xác [Exact].'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DEEP AI REPORT */}
          {activeTab === 'aiReport' && (
            <div className="space-y-4">
              {!aiReport && !isAiLoading && (
                <div className="py-8 px-4 text-center rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-sm font-bold text-white">Khởi Động Phân Tích Chuyên Sâu Sau 7 Ngày</h4>
                    <p className="text-xs text-slate-400">
                      Gemini 3.7 Flash sẽ tự động so sánh số liệu từng chiến dịch Tìm Kiếm (Search) & PMax, đánh giá chỉ số CTR/CPA, tính điểm sức khỏe tài khoản và lập kế hoạch hành động 7 ngày tới.
                    </p>
                  </div>
                  <button
                    onClick={runAiAnalysis}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Bắt Đầu Phân Tích Bằng Gemini
                  </button>
                </div>
              )}

              {isAiLoading && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-spin">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white">Gemini đang phân tích số liệu 7 ngày qua của 59 chiến dịch...</p>
                  <p className="text-[11px] text-slate-400">Đang tính toán biến động CPA, phân loại nhóm dịch vụ và lập kế hoạch tối ưu...</p>
                </div>
              )}

              {aiError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                  <button
                    onClick={runAiAnalysis}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-500 text-[11px]"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {aiReport && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Báo Cáo Tối Ưu Chiến Dịch 7 Ngày Hoàn Tất
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyReport}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                      </button>
                      <button
                        onClick={runAiAnalysis}
                        disabled={isAiLoading}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                        <span>Phân tích lại</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed prose prose-invert max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-strong:text-amber-300 max-h-[500px] overflow-y-auto">
                    <ReactMarkdown>{aiReport}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
