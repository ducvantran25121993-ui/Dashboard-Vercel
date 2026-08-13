import React, { useState, useEffect, useCallback } from 'react';
import { MONTHLY_DATA, MonthDataset } from './data/revenueData';
import { MonthTab, DisplayUnit } from './types';
import { Header } from './components/Header';
import { KPISummary } from './components/KPISummary';
import { CostChart } from './components/CostChart';
import { RevenueChart } from './components/RevenueChart';
import { RegionDataChart } from './components/RegionDataChart';
import { ServiceDataChart } from './components/ServiceDataChart';
import { DailyDataChart } from './components/DailyDataChart';
import { CombinedChart } from './components/CombinedChart';
import { VietKieuChart } from './components/VietKieuChart';
import { RegionalDetailTable } from './components/RegionalDetailTable';
import { SixMonthOverview } from './components/SixMonthOverview';
import { SheetStatusBanner } from './components/SheetStatusBanner';
import { LoginModal } from './components/LoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import {
  fetchGoogleSheetData,
  DEFAULT_SHEET_URL,
  DailyRecord,
} from './services/googleSheetsService';

export default function App() {
  const [activeTab, setActiveTab] = useState<MonthTab>(1);
  const [displayUnit, setDisplayUnit] = useState<DisplayUnit>('full');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('dashboard_authenticated') === 'true' ||
        sessionStorage.getItem('dashboard_authenticated') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [userRole, setUserRole] = useState<'admin' | 'staff' | null>(() => {
    try {
      return (
        (localStorage.getItem('dashboard_user_role') as 'admin' | 'staff') ||
        (sessionStorage.getItem('dashboard_user_role') as 'admin' | 'staff') ||
        'admin'
      );
    } catch {
      return 'admin';
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('dashboard_password') || '123456';
    } catch {
      return '123456';
    }
  });

  const [staffPassword, setStaffPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('dashboard_staff_password') || '123@!';
    } catch {
      return '123@!';
    }
  });

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);

  const handleLoginSuccess = (role: 'admin' | 'staff') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('dashboard_authenticated');
      localStorage.removeItem('dashboard_user_role');
      sessionStorage.removeItem('dashboard_authenticated');
      sessionStorage.removeItem('dashboard_user_role');
    } catch {
      // ignore
    }
    setUserRole(null);
    setIsAuthenticated(false);
  };

  const handleSaveAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    try {
      localStorage.setItem('dashboard_password', newPass);
    } catch {
      // ignore
    }
  };

  const handleSaveStaffPassword = (newPass: string) => {
    setStaffPassword(newPass);
    try {
      localStorage.setItem('dashboard_staff_password', newPass);
    } catch {
      // ignore
    }
  };

  // Google Sheet live synchronization state
  const [sheetUrl, setSheetUrl] = useState<string>(DEFAULT_SHEET_URL);
  const [monthlyDatasets, setMonthlyDatasets] = useState<MonthDataset[]>(() => {
    try {
      localStorage.removeItem('monthly_sheet_datasets');
      localStorage.removeItem('monthly_sheet_datasets_v2');
      localStorage.removeItem('monthly_sheet_datasets_v3');
      localStorage.removeItem('monthly_sheet_datasets_v4');
      const cached = localStorage.getItem('monthly_sheet_datasets_v5');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return MONTHLY_DATA;
  });
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);

  // Fetch live Google Sheet data
  const loadSheetData = useCallback(async (url: string = sheetUrl) => {
    setIsFetching(true);
    const result = await fetchGoogleSheetData(url);
    if (result.monthlyData && result.monthlyData.length > 0) {
      setMonthlyDatasets(result.monthlyData);
      try {
        localStorage.setItem('monthly_sheet_datasets_v5', JSON.stringify(result.monthlyData));
      } catch {
        // ignore storage error
      }
    }
    setDailyRecords(result.dailyData);
    setLastUpdated(result.lastUpdated);
    setIsLive(result.isLive);
    setIsFetching(false);
  }, [sheetUrl]);

  // Initial load
  useEffect(() => {
    document.title = "Dashboard Báo Cáo Doanh Thu Tâm Đức Smile";
    loadSheetData(sheetUrl);
  }, [sheetUrl, loadSheetData]);

  // Periodic Auto Refresh (every 30 seconds for live updates when Google Sheet changes)
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const interval = setInterval(() => {
      loadSheetData(sheetUrl);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, sheetUrl, loadSheetData]);

  // Find dataset for active month
  const currentMonthNum = typeof activeTab === 'number' ? activeTab : 1;
  const currentMonthData = monthlyDatasets.find((m) => m.month === currentMonthNum) || monthlyDatasets[0] || MONTHLY_DATA[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white pb-12">
      {/* Login Authentication Modal Gate */}
      {!isAuthenticated && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          adminPassword={adminPassword}
          staffPassword={staffPassword}
          onResetToDefaultPassword={() => {
            handleSaveAdminPassword('123456');
            handleSaveStaffPassword('123@!');
          }}
        />
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <ChangePasswordModal
          adminPassword={adminPassword}
          staffPassword={staffPassword}
          onSaveAdminPassword={handleSaveAdminPassword}
          onSaveStaffPassword={handleSaveStaffPassword}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}

      {/* Top sticky header & month tabs navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        displayUnit={displayUnit}
        onSelectUnit={setDisplayUnit}
        userRole={userRole}
        onLockDashboard={handleLogout}
        onChangePassword={() => setIsChangePasswordOpen(true)}
      />

      {/* Main Content Container */}
      <main className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Live Google Sheet Status Banner */}
        <SheetStatusBanner
          isLive={isLive}
          isFetching={isFetching}
          lastUpdated={lastUpdated}
          sheetUrl={sheetUrl}
          onRefresh={() => loadSheetData(sheetUrl)}
          onUpdateSheetUrl={(newUrl) => {
            setSheetUrl(newUrl);
            loadSheetData(newUrl);
          }}
          autoRefreshEnabled={autoRefreshEnabled}
          onToggleAutoRefresh={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
          userRole={userRole}
        />

        {activeTab === 'overview' ? (
          /* 6-Month Combined Overview View */
          <SixMonthOverview
            displayUnit={displayUnit}
            monthlyData={monthlyDatasets}
            dailyRecords={dailyRecords}
          />
        ) : currentMonthData ? (
          /* Individual Month View (Tháng 1 - Tháng 6) */
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <KPISummary
              monthData={currentMonthData}
              displayUnit={displayUnit}
            />

            {/* Grid 1: Chi Phí (VAT) & Doanh Thu */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Chi Phí (VAT) Theo Khu Vực */}
              <CostChart
                regions={currentMonthData.regions}
                monthLabel={currentMonthData.label}
                displayUnit={displayUnit}
              />

              {/* Chart 2: Doanh Thu Theo Khu Vực */}
              <RevenueChart
                regions={currentMonthData.regions}
                monthLabel={currentMonthData.label}
                displayUnit={displayUnit}
              />
            </div>

            {/* Grid 2: Data Tháng Theo Khu Vực & Data Tháng Theo Dịch Vụ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 3: Data Tháng Theo Từng Khu Vực (Cột Data) */}
              <RegionDataChart
                regions={currentMonthData.regions}
                monthLabel={currentMonthData.label}
              />

              {/* Chart 4: Data Tháng Theo Từng Dịch Vụ (Cột Data Dịch Vụ) */}
              <ServiceDataChart
                regions={currentMonthData.regions}
                monthLabel={currentMonthData.label}
                displayUnit={displayUnit}
              />
            </div>

            {/* Chart 5: Data Ngày Theo Từng Dịch Vụ & Từng Tháng (từ sheet Data Ngày) */}
            <DailyDataChart
              dailyRecords={dailyRecords}
              activeMonth={currentMonthNum}
              monthLabel={currentMonthData.label}
              regions={currentMonthData?.regions}
            />

            {/* Combined Comparison Chart: Revenue vs Cost VAT side-by-side */}
            <CombinedChart
              regions={currentMonthData.regions}
              monthLabel={currentMonthData.label}
              displayUnit={displayUnit}
            />

            {/* Dedicated Viet Kieu Revenue & Cost Chart (Tách biệt từng tháng) */}
            <VietKieuChart
              monthlyData={monthlyDatasets}
              activeMonth={currentMonthNum}
              displayUnit={displayUnit}
            />

            {/* Detailed Data Table */}
            <RegionalDetailTable
              regions={currentMonthData.regions}
              monthLabel={currentMonthData.label}
              displayUnit={displayUnit}
            />
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-[1650px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Báo Cáo Doanh Thu Theo Tháng, Chi Phí (VAT) & Data Dịch Vụ Theo Ngày</p>
          <p className="text-slate-600">
            © 2026 Team Google Ads. Tài Liệu Bảo Mật - Lưu Hành Nội Bộ
          </p>
        </div>
      </footer>
    </div>
  );
}
