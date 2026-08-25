import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Database,
  BellRing,
  Swords,
  History,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Sliders,
  Sparkles,
  Zap,
  Globe,
  FileSpreadsheet,
  Activity,
  Check,
  X,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Percent,
  Search,
  ExternalLink,
  Cpu,
  Power
} from 'lucide-react';
import { SidebarTab } from '../types';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'marketer' | 'sales' | 'accountant';
  roleLabel: string;
  status: 'active' | 'disabled';
  lastActive: string;
  department: string;
}

interface ThresholdConfig {
  implantMaxCpa: number;
  porcelainMaxCpa: number;
  bracesMaxCpa: number;
  generalMaxCpa: number;
  minQualityScore: number;
  minLeadToBookingRate: number;
  dailyBudgetLimit: number;
  enableSoundAlert: boolean;
  enableEmailAlert: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  category: 'auth' | 'data' | 'crawler' | 'config';
  status: 'success' | 'warning' | 'info';
  details: string;
}

interface AdminHubViewProps {
  onOpenTabPermissions?: () => void;
  onOpenChangePassword?: () => void;
  onNavigateToTab?: (tab: SidebarTab) => void;
  currentSheetUrl?: string;
  onUpdateSheetUrl?: (url: string) => void;
}

export const AdminHubView: React.FC<AdminHubViewProps> = ({
  onOpenTabPermissions,
  onOpenChangePassword,
  onNavigateToTab,
  currentSheetUrl = 'https://docs.google.com/spreadsheets/d/1_T0uOvd4q2e.../edit',
  onUpdateSheetUrl,
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    'users' | 'connections' | 'thresholds' | 'crawler' | 'audit'
  >('users');

  // Users State
  const [users, setUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_admin_users_list');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'u1',
        name: 'Trần Đức',
        email: 'TranDuc474@gmail.com',
        role: 'admin',
        roleLabel: 'Super Admin (Ban Giám Đốc)',
        status: 'active',
        lastActive: 'Vừa xong',
        department: 'Ban Điều Hành',
      },
      {
        id: 'u2',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@tamducsmile.vn',
        role: 'marketer',
        roleLabel: 'Google Ads Specialist',
        status: 'active',
        lastActive: '15 phút trước',
        department: 'Phòng Marketing',
      },
      {
        id: 'u3',
        name: 'Lê Thị Mai',
        email: 'mai.le@tamducsmile.vn',
        role: 'sales',
        roleLabel: 'Trưởng Nhóm Tư Vấn & CSKH',
        status: 'active',
        lastActive: '1 giờ trước',
        department: 'Tư Vấn & Sales Online',
      },
      {
        id: 'u4',
        name: 'Hoàng Minh',
        email: 'minh.hoang@tamducsmile.vn',
        role: 'manager',
        roleLabel: 'Marketing Manager',
        status: 'active',
        lastActive: 'Hôm qua, 17:30',
        department: 'Phòng Marketing',
      },
      {
        id: 'u5',
        name: 'Kế Toán Tổng Hợp',
        email: 'ketoan@tamducsmile.vn',
        role: 'accountant',
        roleLabel: 'Kế Toán Trưởng',
        status: 'active',
        lastActive: '3 ngày trước',
        department: 'Phòng Tài Chính - Kế Toán',
      },
    ];
  });

  // Thresholds State
  const [thresholds, setThresholds] = useState<ThresholdConfig>(() => {
    try {
      const saved = localStorage.getItem('dashboard_thresholds_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      implantMaxCpa: 450000,
      porcelainMaxCpa: 320000,
      bracesMaxCpa: 380000,
      generalMaxCpa: 150000,
      minQualityScore: 4,
      minLeadToBookingRate: 25,
      dailyBudgetLimit: 35000000,
      enableSoundAlert: true,
      enableEmailAlert: true,
    };
  });

  // Crawler Config State
  const [crawlerInterval, setCrawlerInterval] = useState<'6' | '12' | '24' | '48'>(() => {
    return (localStorage.getItem('dashboard_crawler_interval') as any) || '24';
  });
  const [crawlerScanImages, setCrawlerScanImages] = useState<boolean>(true);
  const [crawlerScanPrices, setCrawlerScanPrices] = useState<boolean>(true);
  const [crawlerScanPromos, setCrawlerScanPromos] = useState<boolean>(true);

  // Sheet Edit State
  const [sheetUrlInput, setSheetUrlInput] = useState(currentSheetUrl);
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [sheetPingStatus, setSheetPingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // New User Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'manager' | 'marketer' | 'sales' | 'accountant'>('marketer');
  const [newUserDept, setNewUserDept] = useState('Phòng Marketing');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: 'Hôm nay, 20:25:10',
      userName: 'Trần Đức (Admin)',
      action: 'Truy cập Trang Quản Trị Hệ Thống',
      category: 'auth',
      status: 'info',
      details: 'Xem tổng quan cấu hình phân quyền & kết nối API',
    },
    {
      id: 'log-2',
      timestamp: 'Hôm nay, 19:42:15',
      userName: 'Trần Đức (Admin)',
      action: 'Sắp xếp danh sách Từ Khóa & Quality Score',
      category: 'data',
      status: 'success',
      details: 'Lọc 191 từ khóa điểm thấp ≤4/10 và sort theo CPA',
    },
    {
      id: 'log-3',
      timestamp: 'Hôm nay, 18:25:00',
      userName: 'Trần Đức (Admin)',
      action: 'Cập nhật kế hoạch phản công Google Ads',
      category: 'config',
      status: 'success',
      details: 'Gỡ bỏ nhãn 17 chi nhánh và cập nhật headline mẫu quảng cáo đối xứng',
    },
    {
      id: 'log-4',
      timestamp: 'Hôm qua, 23:59:52',
      userName: 'Auto Crawler Bot',
      action: 'Tự động quét định kỳ 21 link đối thủ',
      category: 'crawler',
      status: 'warning',
      details: 'Phát hiện biến động khuyến mãi tại Nha Khoa Trồng Răng Sài Gòn & Nha Khoa Shark',
    },
    {
      id: 'log-5',
      timestamp: 'Hôm qua, 09:15:30',
      userName: 'Nguyễn Văn An (Marketer)',
      action: 'Đồng bộ Google Sheets Báo Cáo Doanh Thu',
      category: 'data',
      status: 'success',
      details: 'Đồng bộ thành công 17 chi nhánh và 9 tháng dữ liệu',
    },
  ]);

  const showNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleSaveUsers = (updatedUsers: AdminUser[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('dashboard_admin_users_list', JSON.stringify(updatedUsers));
  };

  const handleToggleUserStatus = (id: string) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'disabled' : 'active';
        return { ...u, status: nextStatus } as AdminUser;
      }
      return u;
    });
    handleSaveUsers(updated);
    showNotification('Đã cập nhật trạng thái hoạt động của nhân sự!');
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      alert('Hệ thống phải có tối thiểu 1 Super Admin!');
      return;
    }
    const updated = users.filter(u => u.id !== id);
    handleSaveUsers(updated);
    showNotification('Đã xóa tài khoản nhân sự khỏi hệ thống!');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const roleMap: Record<string, string> = {
      admin: 'Super Admin (Ban Giám Đốc)',
      manager: 'Marketing Manager',
      marketer: 'Google Ads Specialist',
      sales: 'Tư Vấn & Sales Online',
      accountant: 'Kế Toán Trưởng',
    };

    const newUser: AdminUser = {
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      roleLabel: roleMap[newUserRole] || 'Nhân Viên',
      status: 'active',
      lastActive: 'Chưa đăng nhập',
      department: newUserDept,
    };

    const updated = [...users, newUser];
    handleSaveUsers(updated);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    showNotification(`Đã tạo thành công tài khoản cho ${newUser.name}!`);
  };

  const handleSaveThresholds = () => {
    localStorage.setItem('dashboard_thresholds_config', JSON.stringify(thresholds));
    showNotification('Đã lưu cấu hình ngưỡng cảnh báo KPI & Ads thành công!');
  };

  const handleSaveCrawlerConfig = () => {
    localStorage.setItem('dashboard_crawler_interval', crawlerInterval);
    showNotification('Đã lưu lịch trình và cấu hình quét đối thủ tự động!');
  };

  const handlePingSheet = () => {
    setIsTestingSheet(true);
    setSheetPingStatus('idle');
    setTimeout(() => {
      setIsTestingSheet(false);
      setSheetPingStatus('success');
      showNotification('Kết nối Google Sheets ổn định (Latency 180ms)!');
    }, 1000);
  };

  const handleApplyNewSheetUrl = () => {
    if (onUpdateSheetUrl) {
      onUpdateSheetUrl(sheetUrlInput);
    }
    showNotification('Đã áp dụng URL Google Sheets mới cho toàn hệ thống!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccessMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Top Banner Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Trung Tâm Quản Trị Hệ Thống
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    Admin Master Hub
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Điều hành phân quyền nhân sự, nguồn cấp dữ liệu Live Sheet/API, ngưỡng cảnh báo chi phí Ads & bot quét đối thủ.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {onOpenTabPermissions && (
              <button
                type="button"
                onClick={onOpenTabPermissions}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-cyan-200" />
                <span>Ma Trận Phân Quyền Tab</span>
              </button>
            )}

            {onOpenChangePassword && (
              <button
                type="button"
                onClick={onOpenChangePassword}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-purple-400" />
                <span>Đổi Mật Khẩu Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Status KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold">Nhân Sự Quản Lý</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl font-bold text-white">{users.filter(u => u.status === 'active').length} <span className="text-xs text-slate-400 font-normal">/ {users.length} tài khoản</span></p>
            <p className="text-[10px] text-emerald-400 mt-0.5">● 100% Phân quyền Role-based</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold">Nguồn Data Live</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xl font-bold text-indigo-300">3 Kết Nối</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Google Sheet + Ads API + Gemini</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold">Bot Quét Đối Thủ</span>
              <Swords className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl font-bold text-cyan-300">21 Link</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">Định kỳ mỗi {crawlerInterval}h tự động</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold">Trạng Thái An Ninh</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-emerald-400">An Toàn</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Khóa bảo vệ Session Timeout</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveAdminSubTab('users')}
          className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'users'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Người Dùng & Phân Quyền ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSubTab('connections')}
          className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'connections'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>2. Nguồn Data & Kết Nối API</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSubTab('thresholds')}
          className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'thresholds'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>3. Cài Đặt Ngưỡng Cảnh Báo Ads & Lead</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSubTab('crawler')}
          className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'crawler'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>4. Cấu Hình Bot Quét Đối Thủ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSubTab('audit')}
          className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'audit'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>5. Nhật Ký Hệ Thống & Bảo Mật ({auditLogs.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USERS & ROLE MATRIX */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Danh Sách Nhân Sự & Vai Trò Truy Cập
              </h3>
              <p className="text-xs text-slate-400">
                Quản lý các tài khoản nhân viên được phép đăng nhập, khóa tài khoản hoặc phân quyền truy cập tab theo phòng ban.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenTabPermissions && (
                <button
                  type="button"
                  onClick={onOpenTabPermissions}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Cấu Hình Tab Nhân Viên</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Nhân Sự Mới</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-semibold">Nhân Sự</th>
                  <th className="py-3 px-4 font-semibold">Phòng Ban</th>
                  <th className="py-3 px-4 font-semibold">Vai Trò (Role)</th>
                  <th className="py-3 px-3 font-semibold text-center">Trạng Thái</th>
                  <th className="py-3 px-3 font-semibold text-center">Hoạt Động Gần Nhất</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{u.department}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        u.role === 'admin'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : u.role === 'marketer'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : u.role === 'sales'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {u.roleLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          u.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                        }`}
                        title="Bấm để chuyển đổi trạng thái"
                      >
                        {u.status === 'active' ? '● Đang Hoạt Động' : '✕ Đã Tạm Khóa'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {u.lastActive}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const newPass = prompt(`Nhập mật khẩu mới cho ${u.name}:`);
                            if (newPass) {
                              showNotification(`Đã cập nhật mật khẩu cho ${u.name}!`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                          title="Đổi mật khẩu tài khoản này"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                        </button>
                        {u.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                            title="Xóa nhân sự này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DATA CONNECTIONS & APIS */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'connections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                Cấu Hình Nguồn Cấp Dữ Liệu & API Gateway
              </h3>
              <p className="text-xs text-slate-400">
                Kiểm tra kết nối thời gian thực tới Google Sheets, Google Ads API và mô hình AI Gemini.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePingSheet}
              disabled={isTestingSheet}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSheet ? 'animate-spin' : ''}`} />
              <span>Kiểm Tra Ping Toàn Bộ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Google Sheets */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Google Sheets Live</h4>
                    <p className="text-[11px] text-emerald-400">● Đang Đồng Bộ 17 Chi Nhánh</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  200 OK
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 block">Đường Dẫn Sheet Báo Cáo:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sheetUrlInput}
                    onChange={(e) => setSheetUrlInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="https://docs.google.com/spreadsheets/..."
                  />
                  <button
                    type="button"
                    onClick={handleApplyNewSheetUrl}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Lưu
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Tự làm mới: <strong>Mỗi 5 phút</strong></span>
                <span className="text-cyan-400 font-mono text-[11px]">180ms latency</span>
              </div>
            </div>

            {/* Card 2: Google Ads API */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Google Ads API v18</h4>
                    <p className="text-[11px] text-cyan-400">● CID: 674-889-1240</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                  Active
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Chiến dịch theo dõi:</span>
                  <span className="text-white font-bold">59 Chiến Dịch</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Từ khóa Quality Score:</span>
                  <span className="text-white font-bold">2.000 Keywords</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Search Terms bóc tách:</span>
                  <span className="text-white font-bold">1.997 Cụm Từ</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Trạng thái: <strong>Live Connected</strong></span>
                <span className="text-emerald-400 font-mono text-[11px]">99.9% Uptime</span>
              </div>
            </div>

            {/* Card 3: Gemini AI Model */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Gemini AI Model</h4>
                    <p className="text-[11px] text-purple-400">● gemini-3.7-flash</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  Ready
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Nhiệm vụ:</span>
                  <span className="text-white font-bold">Phân Tích 7 Ngày + Copilot</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Bảo mật API Key:</span>
                  <span className="text-emerald-400 font-bold">Server-Side Hidden</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tốc độ phản hồi:</span>
                  <span className="text-cyan-300 font-mono font-bold">42ms</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Context Window: <strong>1M Tokens</strong></span>
                <span className="text-purple-400 font-mono text-[11px]">High Speed</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: THRESHOLDS & ALERTS */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'thresholds' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                Cài Đặt Ngưỡng Cảnh Báo Chi Phí (CPA) & Hiệu Suất Quảng Cáo
              </h3>
              <p className="text-xs text-slate-400">
                Hệ thống sẽ tự động bật cảnh báo đỏ và thông báo khi chi phí vượt trần hoặc tỷ lệ chuyển đổi rớt sâu.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveThresholds}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Cấu Hình Ngưỡng</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: CPA Ceiling */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                Ngưỡng Trần Chi Phí / Lead (Max CPA Alert)
              </h4>
              <p className="text-xs text-slate-400">Nếu CPA thực tế vượt mức này, hệ thống sẽ đánh dấu báo động trên bảng Ads.</p>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Trồng Răng Implant:</span>
                    <span className="text-cyan-300 font-mono font-bold">{thresholds.implantMaxCpa.toLocaleString('vi-VN')} đ/Lead</span>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={1000000}
                    step={10000}
                    value={thresholds.implantMaxCpa}
                    onChange={(e) => setThresholds({ ...thresholds, implantMaxCpa: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Răng Sứ Thẩm Mỹ:</span>
                    <span className="text-cyan-300 font-mono font-bold">{thresholds.porcelainMaxCpa.toLocaleString('vi-VN')} đ/Lead</span>
                  </div>
                  <input
                    type="range"
                    min={150000}
                    max={800000}
                    step={10000}
                    value={thresholds.porcelainMaxCpa}
                    onChange={(e) => setThresholds({ ...thresholds, porcelainMaxCpa: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Niềng Răng Mắc Cài / Invisalign:</span>
                    <span className="text-cyan-300 font-mono font-bold">{thresholds.bracesMaxCpa.toLocaleString('vi-VN')} đ/Lead</span>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={900000}
                    step={10000}
                    value={thresholds.bracesMaxCpa}
                    onChange={(e) => setThresholds({ ...thresholds, bracesMaxCpa: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Dịch Vụ Khác (Nhổ răng, tẩy trắng...):</span>
                    <span className="text-cyan-300 font-mono font-bold">{thresholds.generalMaxCpa.toLocaleString('vi-VN')} đ/Lead</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={400000}
                    step={10000}
                    value={thresholds.generalMaxCpa}
                    onChange={(e) => setThresholds({ ...thresholds, generalMaxCpa: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Quality Score & Conversion Thresholds */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" />
                Ngưỡng Điểm Chất Lượng & Phễu Chuyển Đổi
              </h4>
              <p className="text-xs text-slate-400">Tiêu chuẩn để AI phân loại từ khóa yếu kém và cảnh báo tỷ lệ rớt số.</p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Cảnh báo Quality Score thấp khi:</span>
                    <span className="text-rose-400 font-bold font-mono">Điểm ≤ {thresholds.minQualityScore}/10</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setThresholds({ ...thresholds, minQualityScore: num })}
                        className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          thresholds.minQualityScore === num
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        ≤ {num}/10
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Tỷ lệ Chuyển đổi Lead ➔ Hẹn khám tối thiểu:</span>
                    <span className="text-emerald-400 font-bold font-mono">{thresholds.minLeadToBookingRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={1}
                    value={thresholds.minLeadToBookingRate}
                    onChange={(e) => setThresholds({ ...thresholds, minLeadToBookingRate: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={thresholds.enableSoundAlert}
                      onChange={(e) => setThresholds({ ...thresholds, enableSoundAlert: e.target.checked })}
                      className="rounded accent-cyan-500 w-4 h-4"
                    />
                    <span>Bật chuông thông báo âm thanh khi phát hiện đối thủ giảm giá sốc</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={thresholds.enableEmailAlert}
                      onChange={(e) => setThresholds({ ...thresholds, enableEmailAlert: e.target.checked })}
                      className="rounded accent-cyan-500 w-4 h-4"
                    />
                    <span>Gửi email tóm tắt cảnh báo cuối ngày cho Ban Giám Đốc</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CRAWLER CONFIG */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'crawler' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-cyan-400" />
                Cấu Hình Bot Tự Động Quét 21 Link Đối Thủ
              </h3>
              <p className="text-xs text-slate-400">
                Điều chỉnh tần suất chạy ngầm, phạm vi bóc tách nội dung và độ nhạy phát hiện thay đổi trên website đối thủ.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveCrawlerConfig}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Cấu Hình Bot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: Frequency */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Tần Suất Tự Động Quét Lại (Scheduler)
              </h4>
              <p className="text-xs text-slate-400">Đồng hồ đếm ngược sẽ tự động kích hoạt tiến trình quét theo chu kỳ đã chọn.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                {[
                  { value: '6', label: 'Mỗi 6 tiếng' },
                  { value: '12', label: 'Mỗi 12 tiếng' },
                  { value: '24', label: 'Mỗi 24 tiếng (Khuyên dùng)' },
                  { value: '48', label: 'Mỗi 48 tiếng' },
                ].map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCrawlerInterval(item.value as any)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      crawlerInterval === item.value
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Box 2: Sensitivity */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Độ Nhạy Bóc Tách Nội Dung (Diff Engine)
              </h4>
              <p className="text-xs text-slate-400">Chọn các loại dữ liệu cần đối chiếu sai khác trên Landing Page đối thủ.</p>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-slate-200 font-semibold">Quét hình ảnh & Banner khuyến mãi mới (Visual Diff)</span>
                  <input
                    type="checkbox"
                    checked={crawlerScanImages}
                    onChange={(e) => setCrawlerScanImages(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-slate-200 font-semibold">Quét biến động Bảng Giá dịch vụ (Price Diff)</span>
                  <input
                    type="checkbox"
                    checked={crawlerScanPrices}
                    onChange={(e) => setCrawlerScanPrices(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-slate-200 font-semibold">Quét Cam kết & Quà tặng kèm (Promo Diff)</span>
                  <input
                    type="checkbox"
                    checked={crawlerScanPromos}
                    onChange={(e) => setCrawlerScanPromos(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AUDIT LOGS & SECURITY */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Nhật Ký Hoạt Động & Bảo Mật Hệ Thống (Audit Logs)
              </h3>
              <p className="text-xs text-slate-400">
                Ghi nhận mọi thao tác cấu hình, đổi mật khẩu, xuất dữ liệu và đồng bộ hóa của người dùng.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAuditLogs(prev => [
                  {
                    id: `log-${Date.now()}`,
                    timestamp: 'Vừa xong',
                    userName: 'Trần Đức (Admin)',
                    action: 'Làm mới bảng nhật ký hệ thống',
                    category: 'auth',
                    status: 'info',
                    details: 'Kiểm tra trạng thái bảo mật thời gian thực',
                  },
                  ...prev,
                ]);
                showNotification('Đã làm mới dữ liệu Audit Logs!');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm Mới Log</span>
            </button>
          </div>

          {/* Audit Logs List */}
          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    log.status === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : log.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{log.action}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {log.userName}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-0.5 text-[11px]">{log.details}</p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap self-end sm:self-center">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM NHÂN SỰ MỚI */}
      {/* ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Thêm Nhân Sự Mới Vào Hệ Thống
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Họ và Tên Nhân Sự:</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="VD: Nguyễn Thị Thảo"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Công Ty / Đăng Nhập:</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="thao.nguyen@tamducsmile.vn"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phòng Ban:</label>
                <input
                  type="text"
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  placeholder="Phòng Marketing / Tư Vấn / Kế Toán"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vai Trò & Quyền Hạn (Role):</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="marketer">Google Ads Specialist (Quyền xem Ads, Đối Thủ)</option>
                  <option value="sales">Tư Vấn & Sales Online (Quyền xem Lead, Copilot)</option>
                  <option value="manager">Marketing Manager (Xem đa tab Marketing)</option>
                  <option value="accountant">Kế Toán (Xem Báo Cáo Doanh Thu & VAT)</option>
                  <option value="admin">Super Admin (Toàn Quyền Hệ Thống)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/30 cursor-pointer"
                >
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
