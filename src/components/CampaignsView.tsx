import React from 'react';
import { Megaphone, Play, Pause, TrendingUp, DollarSign, Target, CheckCircle } from 'lucide-react';
import { DisplayUnit } from '../types';

interface CampaignsViewProps {
  displayUnit: DisplayUnit;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ displayUnit }) => {
  const campaigns = [
    {
      id: 1,
      name: 'Google Search - Trồng Răng Implant Toàn Hàm (TP.HCM)',
      status: 'Đang chạy',
      budget: '45.000.000 đ/tháng',
      spent: '38.200.000 đ',
      leads: '185 Leads',
      cpa: '206.000 đ',
      roas: '7.8x',
      type: 'Google Search',
    },
    {
      id: 2,
      name: 'Performance Max - Bọc Răng Sứ Thẩm Mỹ (Miền Tây)',
      status: 'Đang chạy',
      budget: '35.000.000 đ/tháng',
      spent: '29.500.000 đ',
      leads: '210 Leads',
      cpa: '140.000 đ',
      roas: '8.4x',
      type: 'PMax',
    },
    {
      id: 3,
      name: 'Google Ads - Khách Hàng Việt Kiều Hồi Hương Làm Răng',
      status: 'Đang chạy',
      budget: '25.000.000 đ/tháng',
      spent: '22.100.000 đ',
      leads: '92 Leads',
      cpa: '240.000 đ',
      roas: '11.2x',
      type: 'Search & Display',
    },
    {
      id: 4,
      name: 'Youtube Video Ads - Trải Nghiệm Khách Hàng Thực Tế',
      status: 'Đang chạy',
      budget: '20.000.000 đ/tháng',
      spent: '18.400.000 đ',
      leads: '115 Leads',
      cpa: '160.000 đ',
      roas: '5.6x',
      type: 'Video',
    },
    {
      id: 5,
      name: 'Google Search - Niềng Răng Trong Suốt Invisalign',
      status: 'Đang chạy',
      budget: '15.000.000 đ/tháng',
      spent: '12.800.000 đ',
      leads: '78 Leads',
      cpa: '164.000 đ',
      roas: '6.2x',
      type: 'Search',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <Megaphone className="w-3.5 h-3.5 text-amber-400" /> Quản Lý Chiến Dịch
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Chiến Dịch Quảng Cáo Google Đang Chạy</h2>
          <p className="text-slate-400 text-sm mt-1">
            Theo dõi chi tiêu thực tế, số lượng chuyển đổi và hệ số ROAS của từng chiến dịch.
          </p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-3 px-3">Tên Chiến Dịch</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3">Ngân Sách / Chi Tiêu</th>
                <th className="py-3 px-3">Số Lead</th>
                <th className="py-3 px-3">CPA (Chi phí/Lead)</th>
                <th className="py-3 px-3">Hệ số ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{camp.name}</div>
                    <span className="text-[11px] text-slate-400">{camp.type}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-fit">
                      <Play className="w-3 h-3 fill-emerald-400" />
                      {camp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-200">{camp.spent}</div>
                    <div className="text-[11px] text-slate-400">Hạn mức: {camp.budget}</div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-cyan-300">
                    {camp.leads}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-amber-300">
                    {camp.cpa}
                  </td>
                  <td className="py-3.5 px-3 font-black text-emerald-400">
                    {camp.roas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
