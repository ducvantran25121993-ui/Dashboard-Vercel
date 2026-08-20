import React, { useState, useMemo } from 'react';
import { 
  Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  DollarSign, Target, MousePointerClick, Zap, RefreshCw, ChevronDown, 
  ChevronUp, ShieldCheck, ArrowRight, Layers, Sliders, Ban, FileText, 
  Copy, Check, Calendar, ArrowUpRight, Search, Globe, Tag, Sparkle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DailyCampaignRecord, CampaignItem, normalizeDate, formatVND } from '../services/campaignsSheetService';

interface CampaignAi7DayAnalysisProps {
  dailyRecords: DailyCampaignRecord[];
  campaigns: CampaignItem[];
  onApply7DayFilter: () => void;
  onOpenDetailedAiModal: () => void;
}

export const CampaignAi7DayAnalysis: React.FC<CampaignAi7DayAnalysisProps> = ({
  dailyRecords,
  campaigns,
  onApply7DayFilter,
  onOpenDetailedAiModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'searchAnalysis' | 'aiReport' | 'topPerformers' | 'warnings'>('recommendations');

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
            <div className="space-y-4">
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
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-blue-500/20"
                >
                  <Search className="w-3.5 h-3.5" />
                  Mở Bảng Phân Tích Search Chi Tiết
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Budget Reallocation */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2.5">
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

                {/* Card 2: Search Match Types & Keyword Intent (NEW DEDICATED SEARCH CARD) */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2.5">
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
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Tối ưu: Từ khóa Search</span>
                    <button
                      onClick={() => setActiveTab('searchAnalysis')}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Chi tiết Search <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card 3: Search Impression Share & Bidding */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 transition-all space-y-2.5">
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
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Ban className="w-3 h-3" /> 4. Phủ Định Truy Vấn Search Rác
                    </span>
                    <span className="text-[11px] text-amber-400 font-bold">Tiết Kiệm ~4 Tr/tuần</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Bổ Sung Danh Sách Phủ Định 7 Ngày Qua Cho Mạng Tìm Kiếm</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Loại bỏ ngay các truy vấn tìm kiếm không mang lại khách: <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"miễn phí"</code>, <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"tự làm tại nhà"</code>, <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"sinh viên thực tập"</code>, <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"giá rẻ 50k"</code>, <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded text-[11px]">"kinh nghiệm tự bọc"</code>.
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Tăng CTR Search +1.8%</span>
                    <span className="text-emerald-400 font-semibold text-[11px]">Loại trừ truy vấn rác</span>
                  </div>
                </div>

                {/* Card 5: Search RSA Ad Copy */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> 5. Mẫu RSA & Tiện Ích Mở Rộng
                    </span>
                    <span className="text-[11px] text-purple-400 font-bold">Điểm Chất Lượng 9/10</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Nâng Ad Strength Search Lên "Excellent"</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ghim từ khóa vào Headline 1, chèn thông điệp cam kết ở Headline 2: <strong className="text-purple-300">"Bác sĩ CKI 15 Năm Kinh Nghiệm - Trả Góp 0% - Đưa Đón Sân Bay Việt Kiều"</strong>. Thêm tiện ích Callout và Sitelinks bảng giá minh bạch.
                  </p>
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

                {/* Card 6: Landing Page & Fast Conversion Hook */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> 6. Tối Ưu Tỷ Lệ Chuyển Đổi (CRO)
                    </span>
                    <span className="text-[11px] text-teal-400 font-bold">Tăng CR Form +20%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Đồng Bộ Trang Đích Cho Từng Nhóm Từ Khóa Search</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Từ khóa tìm kiếm về "Bảng giá" phải trỏ thẳng đến bảng giá chi tiết; từ khóa "Trồng răng không đau" phải trỏ đến công nghệ gây tê và video feedback khách hàng thực tế để tăng tỷ lệ để lại số điện thoại ngay từ lần nhấp đầu tiên.
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Trang đích: Nha Khoa</span>
                    <button
                      onClick={onOpenDetailedAiModal}
                      className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 text-[11px]"
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
                        Tổng Quan Hiệu Suất Chiến Dịch Tìm Kiếm (Google Search 7 Ngày)
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
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Chiến dịch đang tiêu ngân sách lớn nhưng CPA cao hoặc chưa có lead trong 7 ngày qua:</span>
                <span className="text-amber-400 font-bold">Khuyến nghị: Hạ giá thầu / Thêm từ khóa phủ định</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {warningCampaigns.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{c.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        Cần Tối Ưu
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500">Chi phí 7 ngày:</span>
                        <p className="font-bold text-slate-200">{formatVND(c.spent)}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Chuyển đổi:</span>
                        <p className="font-bold text-rose-400">{c.leads} leads</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">CPA:</span>
                        <p className="font-bold text-rose-300">{c.cpa > 0 ? `${c.cpa.toLocaleString('vi-VN')} đ` : 'Chưa có lead'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
