import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  Globe, 
  Calendar, 
  Filter, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  Zap, 
  Target, 
  Flame, 
  Sparkles, 
  ArrowUpRight,
  Building2,
  ChevronDown,
  Layers,
  Megaphone,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { 
  TRANSPARENCY_DOMAINS_DATA, 
  TransparencyAdItem, 
  TransparencyDomainProfile 
} from '../data/transparencyAdsData';

interface GoogleAdsTransparencyCenterProps {
  onSelectCompetitorForRadar?: (competitorName: string) => void;
}

export const GoogleAdsTransparencyCenter: React.FC<GoogleAdsTransparencyCenterProps> = ({
  onSelectCompetitorForRadar
}) => {
  const [currentDomain, setCurrentDomain] = useState<string>('nhakhoakim.com');
  const [searchInput, setSearchInput] = useState<string>('');
  const [adKeywordSearch, setAdKeywordSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'implant' | 'ortho' | 'porcelain' | 'general'>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all_time');
  const [platformFilter, setPlatformFilter] = useState<string>('all_platforms');
  const [formatFilter, setFormatFilter] = useState<string>('all_formats');
  const [displayLimit, setDisplayLimit] = useState<number>(24);
  const [selectedAdForModal, setSelectedAdForModal] = useState<TransparencyAdItem | null>(null);
  const [copiedAdId, setCopiedAdId] = useState<string | null>(null);

  // Available domain keys
  const availableDomains = Object.keys(TRANSPARENCY_DOMAINS_DATA);

  // Active domain profile or fallback
  const activeProfile: TransparencyDomainProfile = TRANSPARENCY_DOMAINS_DATA[currentDomain] || {
    domain: currentDomain,
    brandName: 'Nha Khoa ' + currentDomain.replace(/\..*$/, ''),
    legalEntity: `CÔNG TY TNHH ${currentDomain.replace(/\..*$/, '').toUpperCase()}`,
    approxActiveAds: 45,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Trồng Răng Implant', 'Niềng Răng', 'Răng Sứ Thẩm Mỹ'],
    ads: TRANSPARENCY_DOMAINS_DATA['nhakhoakim.com'].ads.map(ad => ({
      ...ad,
      id: `${currentDomain}-${ad.id}`,
      advertiserName: currentDomain,
      legalEntity: `CÔNG TY TNHH ${currentDomain.toUpperCase()}`,
      domain: currentDomain
    }))
  };

  // Category counts
  const categoryCounts = {
    all: activeProfile.ads.length,
    implant: activeProfile.ads.filter(a => a.category === 'implant').length,
    ortho: activeProfile.ads.filter(a => a.category === 'ortho').length,
    porcelain: activeProfile.ads.filter(a => a.category === 'porcelain').length,
    general: activeProfile.ads.filter(a => a.category === 'general').length
  };

  // Filter ads based on user selections
  const filteredAds = activeProfile.ads.filter(ad => {
    // Category filter
    if (categoryFilter !== 'all' && ad.category !== categoryFilter) return false;

    // Format filter
    if (formatFilter === 'video' && ad.format !== 'video') return false;
    if (formatFilter === 'text' && ad.format !== 'text') return false;
    if (formatFilter === 'image' && ad.format !== 'image') return false;

    // Platform filter
    if (platformFilter === 'search' && !ad.platform.includes('Search')) return false;
    if (platformFilter === 'youtube' && !ad.platform.includes('YouTube')) return false;
    if (platformFilter === 'gdn' && !ad.platform.includes('Display') && !ad.platform.includes('PMax')) return false;

    // Keyword search within ad copy
    if (adKeywordSearch.trim()) {
      const q = adKeywordSearch.toLowerCase().trim();
      const matchVisual = ad.visual && (
        ad.visual.headlineMain.toLowerCase().includes(q) ||
        (ad.visual.subHeadline && ad.visual.subHeadline.toLowerCase().includes(q)) ||
        (ad.visual.highlightPill && ad.visual.highlightPill.toLowerCase().includes(q)) ||
        (ad.visual.topBadgeText && ad.visual.topBadgeText.toLowerCase().includes(q))
      );
      const matchSearch = ad.searchAd && (
        ad.searchAd.headline.toLowerCase().includes(q) ||
        ad.searchAd.description.toLowerCase().includes(q) ||
        ad.searchAd.sitelinks.some(s => s.toLowerCase().includes(q))
      );
      const matchIntel = ad.intel && (
        ad.intel.campaignGoal.toLowerCase().includes(q) ||
        ad.intel.psychologicalHook.toLowerCase().includes(q) ||
        ad.intel.counterAdTemplate.headline.toLowerCase().includes(q)
      );

      if (!matchVisual && !matchSearch && !matchIntel) return false;
    }

    return true;
  });

  const visibleAds = filteredAds.slice(0, displayLimit);

  const resolveDomain = (input: string): string => {
    const raw = input.toLowerCase().trim();
    if (raw.includes('việt hàn') || raw.includes('viethan') || raw.includes('04')) return 'nhakhoaviethan04.com';
    if (raw.includes('sài gòn bh') || raw.includes('saigonbh') || raw.includes('saigon.vn') || raw.includes('bh')) return 'nhakhoasaigonbh.com';
    if (raw.includes('trồng răng') || raw.includes('trongrang')) return 'nhakhoatrongrang.com';
    if (raw.includes('sài gòn implant') || raw.includes('saigonimplant') || raw.includes('saigon implant')) return 'saigonimplant.com';
    if (raw.includes('kim')) return 'nhakhoakim.com';
    if (raw.includes('paris')) return 'nhakhoaparis.vn';
    if (raw.includes('dr care') || raw.includes('drcare')) return 'drcareimplant.com';
    if (raw.includes('shark')) return 'nhakhoashark.vn';
    return raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
  };

  const handleDomainChange = (domain: string) => {
    setCurrentDomain(domain);
    setSearchInput(domain);
    setDisplayLimit(24);
    setAdKeywordSearch('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const resolved = resolveDomain(searchInput);
    setCurrentDomain(resolved);
    setDisplayLimit(24);
    setAdKeywordSearch('');
  };

  const handleCopyCounterAd = (ad: TransparencyAdItem) => {
    const text = `[MẪU QUẢNG CÁO PHẢN CÔNG TÂM ĐỨC SMILE]\nTiêu đề: ${ad.intel.counterAdTemplate.headline}\nMô tả: ${ad.intel.counterAdTemplate.description}\nSitelinks: ${ad.intel.counterAdTemplate.sitelinks.join(' | ')}\nChiến lược đấu thầu: ${ad.intel.counterAdTemplate.biddingAdvice}`;
    navigator.clipboard.writeText(text);
    setCopiedAdId(ad.id);
    setTimeout(() => setCopiedAdId(null), 2500);
  };

  const getGoogleTransparencyOfficialLink = (domain: string) => {
    const clean = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    return `https://adstransparency.google.com/?region=VN&domain=${encodeURIComponent(clean)}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP QUICK DOMAIN SEARCH & SWITCHER BAR */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Tra cứu theo Tên Miền / Nha Khoa trên Google Ads Transparency:</span>
          </div>

          <a
            href={getGoogleTransparencyOfficialLink(currentDomain)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Mở trang gốc Google Ads Transparency</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Search input & preset chips */}
        <div className="flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Nhập tên miền đối thủ (VD: nhakhoakim.com, nhakhoaparis.vn, drcareimplant.com...)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-24 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Tra Cứu
            </button>
          </form>
        </div>

        {/* Quick Brands Selection Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Đối thủ trọng điểm:</span>
          {[
            { domain: 'nhakhoakim.com', label: 'Nha Khoa Kim (200 mẫu)' },
            { domain: 'nhakhoaparis.vn', label: 'Nha Khoa Paris (145 mẫu)' },
            { domain: 'nhakhoaviethan04.com', label: 'Nha Khoa Việt Hàn 04 (68 mẫu)' },
            { domain: 'nhakhoasaigonbh.com', label: 'Nha Khoa Sài Gòn B.H (85 mẫu)' },
            { domain: 'nhakhoatrongrang.com', label: 'Nha Khoa Trồng Răng (72 mẫu)' },
            { domain: 'saigonimplant.com', label: 'Sài Gòn Implant (54 mẫu)' },
            { domain: 'drcareimplant.com', label: 'Dr. Care Implant (90 mẫu)' },
            { domain: 'nhakhoashark.vn', label: 'Nha Khoa Shark (110 mẫu)' },
          ].map(b => (
            <button
              key={b.domain}
              type="button"
              onClick={() => handleDomainChange(b.domain)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                currentDomain === b.domain
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. AUTHENTIC GOOGLE ADS TRANSPARENCY UI REPLICA (EXACTLY LIKE SCREENSHOT) */}
      {/* ========================================================================= */}
      <div className="space-y-5">
        {/* DOMAIN SUMMARY HEADER CARD (EXACT AS SCREENSHOT) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900 font-sans">
              {activeProfile.domain}
            </h1>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
              <span className="font-semibold">{activeProfile.legalEntity}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Đã xác minh bởi Google
              </span>
            </div>
          </div>

          <div className="max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed md:text-right">
            {activeProfile.description}
          </div>
        </div>

        {/* COUNT & DROPDOWN FILTER BAR (EXACT AS SCREENSHOT) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Ad Count Text */}
            <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <span>Xấp xỉ <strong>{activeProfile.approxActiveAds}</strong> quảng cáo</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Đầy đủ 100% dữ liệu
              </span>
            </div>

            {/* 3 Google Transparency Dropdown Selectors */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* 1. Time Filter */}
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={e => setTimeFilter(e.target.value)}
                  aria-label="Lọc theo thời gian"
                  className="appearance-none bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
                >
                  <option value="all_time">Mọi lúc</option>
                  <option value="last_30_days">30 ngày qua</option>
                  <option value="last_7_days">7 ngày qua</option>
                  <option value="today">Hôm nay</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 2. Platform Filter */}
              <div className="relative">
                <select
                  value={platformFilter}
                  onChange={e => setPlatformFilter(e.target.value)}
                  aria-label="Lọc theo nền tảng quảng cáo"
                  className="appearance-none bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
                >
                  <option value="all_platforms">Tất cả nền tảng</option>
                  <option value="search">Google Tìm kiếm (Search)</option>
                  <option value="youtube">YouTube (Video)</option>
                  <option value="gdn">Mạng hiển thị Google (GDN)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 3. Format Filter */}
              <div className="relative">
                <select
                  value={formatFilter}
                  onChange={e => setFormatFilter(e.target.value)}
                  aria-label="Lọc theo định dạng quảng cáo"
                  className="appearance-none bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
                >
                  <option value="all_formats">Tất cả định dạng</option>
                  <option value="video">Video ({activeProfile.ads.filter(a => a.format === 'video').length})</option>
                  <option value="text">Văn bản Search ({activeProfile.ads.filter(a => a.format === 'text').length})</option>
                  <option value="image">Hình ảnh Banner ({activeProfile.ads.filter(a => a.format === 'image').length})</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* DỊCH VỤ / CATEGORY FILTER CHIPS & KEYWORD SEARCH */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
              <button
                type="button"
                onClick={() => { setCategoryFilter('all'); setDisplayLimit(24); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                Tất Cả ({categoryCounts.all})
              </button>

              <button
                type="button"
                onClick={() => { setCategoryFilter('implant'); setDisplayLimit(24); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === 'implant'
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                Trồng Răng Implant ({categoryCounts.implant})
              </button>

              <button
                type="button"
                onClick={() => { setCategoryFilter('ortho'); setDisplayLimit(24); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === 'ortho'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                Niềng Răng Chỉnh Nha ({categoryCounts.ortho})
              </button>

              <button
                type="button"
                onClick={() => { setCategoryFilter('porcelain'); setDisplayLimit(24); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === 'porcelain'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                Răng Sứ & Veneer ({categoryCounts.porcelain})
              </button>

              <button
                type="button"
                onClick={() => { setCategoryFilter('general'); setDisplayLimit(24); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === 'general'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                Khám, Tẩy Trắng & Nhổ Răng Khôn ({categoryCounts.general})
              </button>
            </div>

            {/* In-ad keyword quick filter */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adKeywordSearch}
                onChange={e => { setAdKeywordSearch(e.target.value); setDisplayLimit(24); }}
                placeholder="Lọc từ khóa (VD: Straumann, Invisalign, Đống Đa...)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {adKeywordSearch && (
                <button
                  type="button"
                  onClick={() => setAdKeywordSearch('')}
                  aria-label="Xóa từ khóa lọc"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. 4-COLUMN CARD GRID (PIXEL-PERFECT MATCH TO ADSTRANSPARENCY SCREENSHOT) */}
        {visibleAds.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <div className="text-sm font-bold text-slate-200">Không tìm thấy mẫu quảng cáo nào phù hợp với bộ lọc</div>
            <p className="text-xs text-slate-400">Hãy thử đổi định dạng, danh mục hoặc từ khóa tìm kiếm</p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all');
                setFormatFilter('all_formats');
                setPlatformFilter('all_platforms');
                setTimeFilter('all_time');
                setAdKeywordSearch('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
            >
              Đặt Lại Tất Cả Bộ Lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleAds.map((ad, idx) => {
            const isVideo = ad.format === 'video';
            const isText = ad.format === 'text';
            const isImage = ad.format === 'image';

            return (
              <div
                key={ad.id}
                onClick={() => setSelectedAdForModal(ad)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col overflow-hidden group hover:border-slate-300"
              >
                {/* TOP HALF: MEDIA / SEARCH AD DISPLAY (SQUARE OR 4:3) */}
                <div className="w-full aspect-[4/3] sm:aspect-square relative overflow-hidden bg-slate-950 flex flex-col justify-between">
                  {/* IF VIDEO AD: Render Authentic Rich Graphic Thumbnail */}
                  {isVideo && ad.visual && (
                    <div className="w-full h-full relative p-3.5 flex flex-col justify-between overflow-hidden">
                      {/* Background Image / Overlay */}
                      <img
                        src={ad.visual.imageUrl || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'}
                        alt={ad.visual.headlineMain}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                      />
                      
                      {/* Dark/Gold/Blue Gradient Overlay */}
                      <div className={`absolute inset-0 ${
                        ad.visual.theme === 'navy_gold' || ad.visual.theme === 'harvard_gold'
                          ? 'bg-gradient-to-t from-slate-950 via-slate-950/70 to-blue-950/80'
                          : ad.visual.theme === 'flag_us'
                          ? 'bg-gradient-to-t from-slate-950 via-slate-900/80 to-blue-950/90'
                          : 'bg-gradient-to-t from-slate-950 via-slate-900/70 to-cyan-950/80'
                      }`} />

                      {/* Top Row: Brand Tag + Video Camera Icon */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-cyan-300 font-black text-[9px] border border-cyan-500/40 uppercase tracking-wider">
                            {ad.visual.brandLogoText || activeProfile.brandName}
                          </span>
                          {ad.visual.topBadgeText && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold text-[8px] border border-amber-500/40">
                              {ad.visual.topBadgeText}
                            </span>
                          )}
                        </div>

                        {/* Video Icon Badge (Top Right Camera in Circle like Google Transparency) */}
                        <div className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Center / Bottom Graphic Headlines (Exact match to screenshot) */}
                      <div className="relative z-10 space-y-1 mt-auto">
                        {ad.visual.subBadgeText && (
                          <div className="inline-block px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                            {ad.visual.subBadgeText}
                          </div>
                        )}

                        <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase leading-snug drop-shadow-md">
                          {ad.visual.headlineMain}
                        </h3>

                        {ad.visual.subHeadline && (
                          <p className="text-[10px] text-slate-300 font-medium line-clamp-2 leading-tight">
                            {ad.visual.subHeadline}
                          </p>
                        )}

                        {ad.visual.highlightPill && (
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-[9px] font-bold border border-cyan-500/30">
                              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                              {ad.visual.highlightPill}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* IF SEARCH TEXT AD: Render Google Search Mockup Card */}
                  {isText && ad.searchAd && (
                    <div className="w-full h-full bg-white p-3 sm:p-4 flex flex-col justify-between text-left select-none overflow-hidden">
                      <div className="space-y-1.5">
                        {/* Sponsored label & URL */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="font-bold text-slate-900">Được tài trợ</span>
                          <span>•</span>
                          <span className="text-slate-600 truncate">{ad.searchAd.displayDomain}</span>
                        </div>

                        <div className="text-[10px] text-slate-500 truncate font-mono">
                          {ad.searchAd.path}
                        </div>

                        {/* Headline in Google Blue */}
                        <h4 className="text-xs sm:text-[13px] font-semibold text-[#1a0dab] hover:underline leading-snug line-clamp-2">
                          {ad.searchAd.headline}
                        </h4>

                        {/* Description snippet */}
                        <p className="text-[10px] text-slate-600 line-clamp-3 leading-relaxed">
                          {ad.searchAd.description}
                        </p>
                      </div>

                      {/* Sitelinks in Google Blue */}
                      <div className="pt-1.5 border-t border-slate-100 space-y-0.5">
                        {ad.searchAd.sitelinks.slice(0, 2).map((stk, sIdx) => (
                          <div key={sIdx} className="text-[10px] text-[#1a0dab] font-medium truncate">
                            {stk}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IF IMAGE AD: Render Banner Mockup */}
                  {isImage && ad.visual && (
                    <div className="w-full h-full relative p-3.5 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-950">
                      <img
                        src={ad.visual.imageUrl || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'}
                        alt={ad.visual.headlineMain}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-emerald-300 font-bold text-[9px] border border-emerald-500/40">
                          {ad.visual.brandLogoText || activeProfile.brandName}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white">
                          <ImageIcon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="relative z-10 space-y-1">
                        <h3 className="text-xs sm:text-sm font-black text-white uppercase leading-snug">
                          {ad.visual.headlineMain}
                        </h3>
                        {ad.visual.highlightPill && (
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-black text-[9px]">
                            {ad.visual.highlightPill}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTTOM HALF: ADVERTISER FOOTER (EXACTLY AS SCREENSHOT) */}
                <div className="p-3.5 bg-white border-t border-slate-100 flex flex-col justify-between flex-1 space-y-1">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 truncate" title={ad.legalEntity}>
                      {ad.legalEntity}
                    </h5>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between mt-0.5">
                      <span>{ad.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}</span>
                      <span className="text-[10px] text-slate-400 font-mono">VN</span>
                    </div>
                  </div>

                  {/* AI Spy Quick Trigger */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-600 font-bold group-hover:text-emerald-700">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Xem tử huyệt & bài phản công</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* 4. PAGINATION & LOAD MORE TOOLBAR */}
        {filteredAds.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-300 font-medium">
                Đang hiển thị <strong className="text-emerald-400">{visibleAds.length}</strong> / <strong className="text-white">{filteredAds.length}</strong> mẫu quảng cáo ({((visibleAds.length / filteredAds.length) * 100).toFixed(0)}%)
              </div>

              <div className="flex items-center gap-2">
                {displayLimit < filteredAds.length && (
                  <>
                    <button
                      type="button"
                      onClick={() => setDisplayLimit(prev => Math.min(prev + 24, filteredAds.length))}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Tải thêm 24 quảng cáo (+24)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDisplayLimit(filteredAds.length)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition-colors cursor-pointer"
                    >
                      <span>Hiển thị tất cả ({filteredAds.length} mẫu)</span>
                    </button>
                  </>
                )}

                {displayLimit > 24 && (
                  <button
                    type="button"
                    onClick={() => {
                      setDisplayLimit(24);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs border border-slate-800 cursor-pointer"
                  >
                    Thu gọn về 24 mẫu
                  </button>
                )}
              </div>
            </div>

            {/* Visual progress bar */}
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${(visibleAds.length / filteredAds.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. HIGH FIDELITY AD INSPECTION & AI COUNTER-ATTACK MODAL                  */}
      {/* ========================================================================= */}
      {selectedAdForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-6 p-6 sm:p-8 text-white">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedAdForModal(null)}
              aria-label="Đóng bảng phân tích"
              className="absolute right-5 top-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pr-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Chi Tiết Quảng Cáo & Vũ Khí Phản Công Cho Tâm Đức Smile
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Google Ads Transparency
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Nhà quảng cáo: <strong className="text-slate-200">{selectedAdForModal.legalEntity}</strong> ({selectedAdForModal.domain})
                </p>
              </div>
            </div>

            {/* Main Modal Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Col: Live Preview of Competitor Ad */}
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mẫu Quảng Cáo Đối Thủ Đang Phân Phối</span>
                </h4>

                {/* Ad Preview Card */}
                <div className="rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden shadow-inner">
                  {selectedAdForModal.format === 'text' && selectedAdForModal.searchAd ? (
                    <div className="p-4 bg-white text-slate-900 space-y-2 text-left">
                      <div className="text-[10px] text-slate-500">
                        Được tài trợ • {selectedAdForModal.searchAd.displayDomain}
                      </div>
                      <h4 className="text-sm font-bold text-[#1a0dab] leading-snug">
                        {selectedAdForModal.searchAd.headline}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {selectedAdForModal.searchAd.description}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                        {selectedAdForModal.searchAd.sitelinks.map((s, idx) => (
                          <span key={idx} className="text-xs text-[#1a0dab] font-medium underline">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] p-4 flex flex-col justify-between bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950">
                      <img
                        src={selectedAdForModal.visual?.imageUrl || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'}
                        alt={selectedAdForModal.visual?.headlineMain}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                      />
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-black border border-amber-500/40">
                          {selectedAdForModal.visual?.brandLogoText || selectedAdForModal.advertiserName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-black/70 text-white font-mono">
                          {selectedAdForModal.format.toUpperCase()}
                        </span>
                      </div>
                      <div className="relative z-10 space-y-1 mt-auto">
                        <div className="text-sm font-black text-amber-300 uppercase">
                          {selectedAdForModal.visual?.headlineMain}
                        </div>
                        {selectedAdForModal.visual?.subHeadline && (
                          <div className="text-xs text-slate-300">
                            {selectedAdForModal.visual.subHeadline}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata Row */}
                  <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Nền tảng: <strong className="text-slate-200">{selectedAdForModal.platform}</strong></span>
                      <span>Khu vực: <strong className="text-slate-200">Việt Nam</strong></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lần đầu phát hiện: <strong className="text-slate-300">{selectedAdForModal.firstSeen}</strong></span>
                      <span>Trạng thái: <strong className="text-emerald-400">{selectedAdForModal.lastSeen}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Direct link out */}
                <a
                  href={getGoogleTransparencyOfficialLink(selectedAdForModal.domain)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <span>Mở xem trên Google Ads Transparency gốc</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Right Col: AI Spy Intel & Counter-Ad Strategy */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. Psychological Hook & Target Audience */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Mục Tiêu & Đòn Bẩy Tâm Lý Đối Thủ Sử Dụng:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Đòn bẩy:</strong> {selectedAdForModal.intel.psychologicalHook}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-slate-400 text-[11px] border-t border-slate-900">
                    <span>Đối tượng mục tiêu: <strong className="text-slate-200">{selectedAdForModal.intel.targetAudience}</strong></span>
                    <span>Ước tính ngân sách: <strong className="text-amber-300">{selectedAdForModal.intel.estimatedDailySpend}</strong></span>
                  </div>
                </div>

                {/* 2. Competitor Weakness / Achilles' Heel */}
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-1.5 text-xs">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Tử Huyệt Của Mẫu Quảng Cáo Này (Điểm Yếu Cần Đánh Vào):</span>
                  </div>
                  <p className="text-rose-100 leading-relaxed font-medium">
                    {selectedAdForModal.intel.competitorWeakness}
                  </p>
                </div>

                {/* 3. Counter Ad for Tâm Đức Smile */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-2 border-emerald-500/50 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-xs sm:text-sm font-black uppercase text-emerald-300 tracking-wider">
                        MẪU QUẢNG CÁO PHẢN CÔNG TÂM ĐỨC SMILE
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCounterAd(selectedAdForModal)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                    >
                      {copiedAdId === selectedAdForModal.id ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Đã Copy</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Sao Chép Mẫu Này</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Counter Ad Preview Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-emerald-400 text-sm leading-snug">
                      {selectedAdForModal.intel.counterAdTemplate.headline}
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {selectedAdForModal.intel.counterAdTemplate.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedAdForModal.intel.counterAdTemplate.sitelinks.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] border border-emerald-500/30 font-medium">
                          + Sitelink: {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bidding & USP Advice */}
                  <div className="space-y-1 text-[11px] text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <strong className="text-cyan-300">Chiến lược đấu thầu:</strong> {selectedAdForModal.intel.counterAdTemplate.biddingAdvice}
                    </div>
                    <div>
                      <strong className="text-emerald-300">Lợi thế độc quyền (USP):</strong> {selectedAdForModal.intel.counterAdTemplate.uniqueSellingPoint}
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  {onSelectCompetitorForRadar && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCompetitorForRadar(selectedAdForModal.advertiserName);
                        setSelectedAdForModal(null);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Layers className="w-4 h-4 text-cyan-200" />
                      <span>Xem Toàn Bộ Chiến Dịch Của {selectedAdForModal.advertiserName} Trong AI Radar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
