import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users2,
  Megaphone,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  Flame,
  Award,
  Bot,
  Zap,
} from 'lucide-react';
import { MonthDataset } from '../data/revenueData';
import { DisplayUnit, SidebarTab } from '../types';
import { isVietKieuRegion, formatVND, formatPercent } from '../utils/formatters';
import { getActiveAIModelBadge } from '../utils/aiBadgeHelper';

interface WorkOverviewProps {
  monthlyDatasets: MonthDataset[];
  displayUnit: DisplayUnit;
  onNavigateToTab: (tab: SidebarTab) => void;
  isLive: boolean;
  lastUpdated: Date | null;
}

export const WorkOverview: React.FC<WorkOverviewProps> = ({
  monthlyDatasets,
  displayUnit,
  onNavigateToTab,
  isLive,
  lastUpdated,
}) => {
  const [currentAiBadge, setCurrentAiBadge] = useState(() => getActiveAIModelBadge());

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentAiBadge(getActiveAIModelBadge());
    };
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);
  // Aggregate revenue (excluding Việt Kiều) & costs across all loaded months
  const totalRevenue = monthlyDatasets.reduce(
    (sum, m) =>
      sum +
      m.regions.reduce(
        (rSum, r) => rSum + (isVietKieuRegion(r.name) ? 0 : (r.revenue || 0)),
        0
      ),
    0
  );

  const totalVietKieuRevenue = monthlyDatasets.reduce(
    (sum, m) =>
      sum +
      m.regions.reduce(
        (rSum, r) => rSum + (isVietKieuRegion(r.name) ? (r.revenue || 0) : 0),
        0
      ),
    0
  );

  const totalCostVAT = monthlyDatasets.reduce(
    (sum, m) => sum + m.regions.reduce((rSum, r) => rSum + (r.costVAT || 0), 0),
    0
  );

  // Calculate Data Thô across all months
  const totalDataTho = monthlyDatasets.reduce((sum, m) => {
    return (
      sum +
      m.regions.reduce((rSum, r) => {
        const svcSum = r.services?.reduce((sSum, s) => sSum + (s.dataCount || 0), 0) || 0;
        return rSum + (svcSum > 0 ? svcSum : (r.totalData || 0));
      }, 0)
    );
  }, 0);

  // Calculate Data CL (Chất Lượng) across all months
  const totalDataCL = monthlyDatasets.reduce((sum, m) => {
    return (
      sum +
      m.regions.reduce((rSum, r) => rSum + (r.dataChatLuong || 0), 0)
    );
  }, 0);

  // Total Leads = Data Thô + Data CL tất cả các tháng
  const totalLeads = totalDataTho + totalDataCL;

  const overallProfit = totalRevenue - totalCostVAT;
  const roas = totalCostVAT > 0 ? (totalRevenue / totalCostVAT).toFixed(1) : '0';
  const costRatio = totalRevenue > 0 ? ((totalCostVAT / totalRevenue) * 100).toFixed(1) : '0';
  const grandRatio = totalRevenue > 0 ? (totalCostVAT / totalRevenue) * 100 : 0;
  const isGrandKpiMet = grandRatio <= 15.0;

  // Aggregate list by month for Bảng Aggregate Tổng Quan
  const monthlyAggregateList = monthlyDatasets.map((m) => {
    const dataDichVu = m.regions.reduce((sum, r) => {
      const svcSum = r.services?.reduce((sSum, s) => sSum + (s.dataCount || 0), 0) || 0;
      return sum + (svcSum > 0 ? svcSum : (r.totalData || 0));
    }, 0);

    const dataChatLuong = m.regions.reduce((sum, r) => sum + (r.dataChatLuong || 0), 0);
    const tyLeCL = dataDichVu > 0 ? (dataChatLuong / dataDichVu) * 100 : 0;

    const revenue = m.regions.reduce(
      (s, r) => s + (isVietKieuRegion(r.name) ? 0 : (r.revenue || 0)),
      0
    );
    const costVAT = m.regions.reduce((s, r) => s + (r.costVAT || 0), 0);
    const profit = revenue - costVAT;
    const hasData = revenue > 0 || costVAT > 0 || dataDichVu > 0;
    const ratio = revenue > 0 ? (costVAT / revenue) * 100 : 0;
    const isKpiMet = hasData && ratio <= 15.0;

    return {
      monthLabel: m.label,
      monthNum: m.month,
      dataDichVu,
      dataChatLuong,
      tyLeCL,
      revenue,
      costVAT,
      profit,
      hasData,
      ratio,
      isKpiMet,
    };
  });

  const formatCurrency = (val: number) => {
    if (displayUnit === 'billion') {
      return (val / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' Tỷ';
    }
    if (displayUnit === 'million') {
      return (val / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' Tr';
    }
    return val.toLocaleString('vi-VN') + ' đ';
  };

  const initiatives = [
    {
      id: 1,
      title: 'Gói Implant Kiều Bào "3 Ngày Hoàn Tất Trước Khi Bay"',
      target: 'Tối ưu phễu khách Việt Kiều về nước thăm thân / nghỉ hè',
      status: 'Đang test',
      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      expectedImpact: '+35% Doanh thu Việt Kiều',
      leadsEstimate: '180+ case/tháng',
    },
    {
      id: 2,
      title: 'Chiến Dịch Google Ads "Thẩm Mỹ Nụ Cười — Trả Góp 0%"',
      target: 'Thu hút tệp khách hàng văn phòng làm Răng Sứ thẩm mỹ',
      status: 'Đã triển khai',
      statusColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      expectedImpact: '+28% Tỷ lệ chốt',
      leadsEstimate: '450+ leads/tháng',
    },
    {
      id: 3,
      title: 'Landing Page VIP Cá Nhân Hóa Theo Dịch Vụ Cấp Cao',
      target: 'Hạ chi phí CPA Google Ads xuống dưới 12% doanh thu',
      status: 'Tối ưu A/B',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      expectedImpact: '-15% Chi phí VAT',
      leadsEstimate: 'Tối ưu chi phí CPA',
    },
    {
      id: 4,
      title: 'Trợ Lý Ảo AI Phân Loại & Đề Xuất Kịch Bản Telesales',
      target: 'Nâng tỷ lệ khách đến phòng khám thực tế sau khi để lại SĐT',
      status: 'Đang phát triển',
      statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      expectedImpact: '+22% Show-up Rate',
      leadsEstimate: '100% tự động',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Overview Mission & Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/70 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Trung Tâm Quản Trị Hiệu Suất
              </span>
              {isLive && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Đồng bộ Real-time
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tổng Quan Chiến Dịch & Hiệu Quả Toàn Hệ Thống
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl">
              Theo dõi nhịp độ tăng trưởng, phân bổ ngân sách Google Ads, năng suất phễu chuyển đổi và các sáng kiến đổi mới tăng tốc doanh thu.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab('google_ads')}
              className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Xem Báo Cáo Google Ads</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Revenue */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Doanh Thu</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> ROAS {roas}x
              </span>
              <span className="text-slate-500">• (Đã trừ Việt Kiều)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Cost VAT */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Chi Phí VAT</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatCurrency(totalCostVAT)}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-rose-400 font-bold">
                Tỷ lệ chi phí: {costRatio}%
              </span>
              <span className="text-slate-500">• Mức an toàn</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Lợi Nhuận Gộp */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lợi Nhuận Chênh Lệch</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {formatCurrency(overallProfit)}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">Tăng trưởng dương</span>
              <span>• Sau trừ chi phí Ads</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Total Leads / Data */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Data Khách Hàng</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1.5">
              <span>{totalLeads.toLocaleString('vi-VN')}</span>
              <span className="text-sm font-semibold text-purple-300">leads</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium">
                Thô: <strong className="font-bold text-white">{totalDataTho.toLocaleString('vi-VN')}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-medium">
                CL: <strong className="font-bold text-white">{totalDataCL.toLocaleString('vi-VN')}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Quick Work Category Cards */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Phân Chia Tab Công Việc</h3>
              <p className="text-xs text-slate-400">Chọn nhanh luồng làm việc chuyên biệt</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          {/* Card 1: Google Ads */}
          <div
            onClick={() => onNavigateToTab('google_ads')}
            className="group p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-400/60 cursor-pointer transition-all shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Live Sheet
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                Google Ads Dashboard
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Báo cáo chi phí (VAT), doanh thu từng tháng, data dịch vụ ngày và thống kê Việt Kiều.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Mở bảng dữ liệu chi tiết</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Lead & Phễu */}
          <div
            onClick={() => onNavigateToTab('leads_funnel')}
            className="group p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-400/60 cursor-pointer transition-all shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Users2 className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Phễu Sales
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-3 group-hover:text-blue-300 transition-colors">
                Lead & Phễu Chuyển Đổi
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Theo dõi hành trình khách hàng từ lúc bấm quảng cáo đến khi tư vấn và đặt lịch khám.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Xem phân tích phễu</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Chiến dịch */}
          <div
            onClick={() => onNavigateToTab('campaigns')}
            className="group p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-400/60 cursor-pointer transition-all shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  6 Đang chạy
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-3 group-hover:text-amber-300 transition-colors">
                Chiến Dịch Quảng Cáo
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Chiến dịch Google Search, Performance Max, Youtube & Mạng hiển thị theo khu vực.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Quản lý chiến dịch</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 4: Sáng kiến & Sáng Tạo */}
          <div
            onClick={() => onNavigateToTab('innovation')}
            className="group p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-400/60 cursor-pointer transition-all shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  AI Gợi Ý
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-3 group-hover:text-indigo-300 transition-colors">
               Sáng Tạo & Đổi Mới
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Khám phá và tự động tạo các ý tưởng thử nghiệm mới cùng AI: Livestream, mini-tool nụ cười, tối ưu Google Ads.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Mở phòng thử nghiệm</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 5: AI Agent Copilot */}
          <div
            onClick={() => onNavigateToTab('ai_agent')}
            className="group p-4 rounded-xl bg-gradient-to-b from-slate-800/80 to-indigo-950/40 hover:bg-slate-800 border border-indigo-500/30 hover:border-cyan-400/60 cursor-pointer transition-all shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  <Bot className="w-5 h-5 text-cyan-300" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${currentAiBadge.color}`}>
                  {currentAiBadge.shortName}
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                AI Agent Trợ Lý
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Chat trực tiếp với AI thông minh phân tích số liệu thực tế, tối ưu chi phí Ads & kịch bản Telesales.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Trò chuyện cùng AI Agent</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bảng Aggregate Tổng Quan matching screenshot */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Bảng Aggregate Tổng Quan</span>
          </h3>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="font-medium">Chỉ tiêu KPI % CP/DT:</span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              ≤ 15.0%
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800 text-slate-400 uppercase tracking-wider font-semibold whitespace-nowrap">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Tháng</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Data Dịch Vụ</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Data CL</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Tỷ Lệ CL</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Doanh Thu</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Chi Phí (VAT)</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Lợi Nhuận</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">% CP/DT</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Đạt KPI (≤15%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {monthlyAggregateList.map((m) => (
                <tr key={m.monthNum} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white text-sm whitespace-nowrap">{m.monthLabel}</td>
                  <td className="py-3 px-4 text-right font-bold text-cyan-400 text-sm whitespace-nowrap">
                    {m.dataDichVu.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white text-sm whitespace-nowrap">
                    {m.dataChatLuong.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-300 text-sm whitespace-nowrap">
                    {formatPercent(m.tyLeCL)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400 text-sm whitespace-nowrap">
                    {formatVND(m.revenue, displayUnit)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-amber-400 text-sm whitespace-nowrap">
                    {formatVND(m.costVAT, displayUnit)}
                  </td>
                  <td className={`py-3 px-4 text-right font-bold text-sm whitespace-nowrap ${m.profit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                    {formatVND(m.profit, displayUnit)}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-300 whitespace-nowrap">
                    {m.hasData ? formatPercent(m.ratio) : '-'}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {!m.hasData ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        Chưa có số liệu
                      </span>
                    ) : m.isKpiMet ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đạt KPI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        Chưa Đạt
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-800 font-bold text-white border-t-2 border-slate-700 whitespace-nowrap">
              <tr>
                <td className="py-3.5 px-4 text-sm whitespace-nowrap">TỔNG QUAN</td>
                <td className="py-3.5 px-4 text-right text-cyan-400 text-base whitespace-nowrap">
                  {totalDataTho.toLocaleString('vi-VN')}
                </td>
                <td className="py-3.5 px-4 text-right text-white text-base whitespace-nowrap">
                  {totalDataCL.toLocaleString('vi-VN')}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-200 text-sm font-semibold whitespace-nowrap">
                  {formatPercent(totalDataTho > 0 ? (totalDataCL / totalDataTho) * 100 : 0)}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-400 text-base whitespace-nowrap">
                  {formatVND(totalRevenue, displayUnit)}
                </td>
                <td className="py-3.5 px-4 text-right text-amber-400 text-base whitespace-nowrap">
                  {formatVND(totalCostVAT, displayUnit)}
                </td>
                <td className={`py-3.5 px-4 text-right text-base whitespace-nowrap ${overallProfit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                  {formatVND(overallProfit, displayUnit)}
                </td>
                <td className="py-3.5 px-4 text-center text-slate-200 text-sm whitespace-nowrap">
                  {formatPercent(grandRatio)}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  {isGrandKpiMet ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đạt KPI
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      <XCircle className="w-3.5 h-3.5" />
                      Chưa Đạt
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3. Sáng Kiến / Tháng - Nằm ngay dưới Bảng Aggregate */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Sáng Kiến / Tháng</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Tham Khảo Test
                </span>
              </h3>
              <p className="text-xs text-slate-400">Đi tìm cái CHƯA CÓ — sinh động & tăng tốc tăng trưởng</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('innovation')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Xem Toàn Bộ Sáng Tạo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {initiatives.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-3 hover:bg-slate-800"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>{item.title}</span>
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${item.statusColor}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  <span className="text-rose-400 font-semibold mr-1">🎯 Mục tiêu:</span>
                  {item.target}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 text-slate-400 border-t border-slate-700/50">
                <span className="text-emerald-400 font-bold">{item.expectedImpact}</span>
                <span className="text-slate-300 text-[11px] font-medium">{item.leadsEstimate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Notice Card */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-850 to-slate-900 border border-emerald-500/30 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-emerald-300">Tiến Độ Tháng Này Vượt Chỉ Tiêu</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chi phí VAT được tối ưu ổn định ở mức dưới 15% tổng doanh thu. Data dịch vụ Implant & Răng Sứ tăng trưởng mạnh tại khu vực miền Tây & TP.HCM.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('google_ads')}
            className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all self-start sm:self-auto"
          >
            Xem Google Ads
          </button>
        </div>
      </div>
    </div>
  );
};
