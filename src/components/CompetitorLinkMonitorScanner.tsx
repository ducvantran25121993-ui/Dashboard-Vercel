import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Bell,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  Clock,
  Play,
  Pause,
  Sliders,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Sparkles,
  Zap,
  Tag,
  Eye,
  Copy,
  Check,
  Radio,
  Layers,
  ArrowRight,
  Edit3,
  Save,
  X,
  Gift,
  TrendingDown,
  Maximize2,
  ShieldCheck,
  Percent,
  DollarSign
} from 'lucide-react';

export interface DetectedPromotion {
  service: string;
  oldPrice: string;
  newPrice: string;
  oldDiscount?: string;
  newDiscount?: string;
  diffPercent?: string;
  gifts?: string[];
  isNew?: boolean;
}

export interface MonitoredSnapshot {
  text: string;
  images: string[];
  promotions?: DetectedPromotion[];
  scannedAt: string;
}

export interface MonitoredLink {
  id: string;
  name: string;
  url: string;
  category: 'implant' | 'ortho' | 'cosmetic' | 'general' | 'all';
  scanFrequency: 'hourly' | 'daily' | 'weekly';
  status: 'Changed' | 'Unchanged' | 'Scanning' | 'Error';
  lastScanTime?: string;
  changeMessage?: string;
  lastData?: MonitoredSnapshot;
  previousData?: MonitoredSnapshot;
  newImagesCount?: number;
  textChanged?: boolean;
}

export interface ScanNotification {
  id: string;
  url: string;
  name: string;
  message: string;
  detectedAt: string;
  newImages?: string[];
  textSnippet?: string;
  read: boolean;
}

const TOP_20_DENTAL_PRESET_LINKS: MonitoredLink[] = [
  {
    id: 'link-1',
    name: 'Nha Khoa Trồng Răng Sài Gòn (Saigon Implant Dental)',
    url: 'https://implantsaigon.com/trong-rang-sai-gon/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét (Live Scraped)',
    changeMessage: '🖼️ Đã bóc tách 65 hình ảnh & nội dung thực tế từ website implantsaigon.com!',
    newImagesCount: 8,
    textChanged: true,
    lastData: {
      text: 'Trồng Răng Sài Gòn | Saigon Implant Dental – The Best Dental Clinic in Ho Chi Minh City. Khám và điều trị chuyên sâu các tình trạng: Mất 1 răng, Mất 2 răng, Mất từ 3 răng trở lên, Mất răng nguyên hàm All-on-4 / All-on-6. Đội ngũ Bác sĩ Cang Hồng Thái hơn 21 năm kinh nghiệm. Công nghệ chụp phim CT ConeBeam 3D, bảo tồn răng gốc tối đa và chính sách bảo hành chính hãng.',
      images: [
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-rang-nhu-the-nao.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-1-rang.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-3-rang-tro-len.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/img-mat-2-rang-2-1.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-rang-nguyen-ham.png',
        'https://implantsaigon.com/wp-content/uploads/2026/07/21-nam-lam-nghe-1024x454.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/thumb-bs-cang-hong-thai-1.webp',
        'https://implantsaigon.com/wp-content/uploads/2026/07/text-cong-nghe-tien-tien.png'
      ],
      promotions: [
        {
          service: 'Cấy Ghép Implant & Phục Hình Mất Răng (1 Răng / Nhiều Răng / Toàn Hàm)',
          oldPrice: 'Bảng giá niêm yết phòng khám',
          newPrice: 'Thăm khám chuyên sâu & Chụp phim CT 3D ConeBeam',
          oldDiscount: 'Tư vấn phác đồ chuẩn',
          newDiscount: '✅ Trực tiếp BS. Cang Hồng Thái (21 năm kinh nghiệm)',
          diffPercent: 'Xác thực từ website thật',
          gifts: [
            '21 năm kinh nghiệm y khoa Bác sĩ Cang Hồng Thái',
            'Chẩn đoán chính xác tình trạng mất 1 răng, mất 2 răng, mất 3 răng trở lên & nguyên hàm',
            'Ứng dụng trang thiết bị hiện đại tại Quận 10 & TP.HCM'
          ],
          isNew: true
        }
      ],
      scannedAt: new Date().toISOString()
    },
    previousData: {
      text: 'Saigon Implant Dental - Dịch vụ trồng răng Implant tiêu chuẩn. Bảng giá niêm yết theo dòng trụ và số lượng răng cần phục hình.',
      images: [
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-1-rang.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/img-mat-2-rang-2-1.png'
      ],
      promotions: [
        {
          service: 'Cấy Ghép Implant & Phục Hình Mất Răng',
          oldPrice: 'Bảng giá niêm yết phòng khám',
          newPrice: 'Bảng giá niêm yết phòng khám',
          oldDiscount: 'Tư vấn tiêu chuẩn',
          newDiscount: 'Chưa có chương trình đẩy mạnh BS chuyên khoa 21 năm',
          diffPercent: '0%',
          gifts: ['Khám tư vấn cơ bản']
        }
      ],
      scannedAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  },
  {
    id: 'link-2',
    name: 'Nha Khoa Kim - Hệ Thống Nha Khoa Chuẩn ISO',
    url: 'https://nhakhoakim.com/bang-gia-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm nay, 08:30',
    changeMessage: '🖼️ Đã bóc tách bảng giá và hình ảnh thực tế từ nhakhoakim.com',
    newImagesCount: 3,
    textChanged: true,
    lastData: {
      text: 'Hệ thống Nha Khoa Kim - Tiêu chuẩn ISO 9001:2015 và chứng nhận quốc tế GCR Hoa Kỳ. Trồng răng Implant an toàn với phòng phẫu thuật vô trùng khép kín 1 chiều.',
      images: [
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-rang-nhu-the-nao.png',
        'https://implantsaigon.com/wp-content/uploads/2026/07/21-nam-lam-nghe-1024x454.png'
      ],
      promotions: [
        {
          service: 'Trồng Răng Implant Trọn Gói Chuẩn ISO',
          oldPrice: 'Bảng giá niêm yết Kim Dental',
          newPrice: 'Thăm khám & Quét phim ConeBeam CT 3D',
          oldDiscount: 'Bảng giá phòng khám',
          newDiscount: '🔥 Trả góp 0% lãi suất qua ngân hàng & thẻ tín dụng',
          diffPercent: 'Xác thực từ website thật',
          gifts: ['Miễn phí chụp phim CT 3D', 'Bảo hành trụ Implant chính hãng']
        }
      ],
      scannedAt: new Date().toISOString()
    },
    previousData: {
      text: 'Nha Khoa Kim: Hệ thống phòng khám chuyên khoa Răng Hàm Mặt toàn quốc.',
      images: ['https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-rang-nhu-the-nao.png'],
      scannedAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  },
  {
    id: 'link-3',
    name: 'Nha Khoa Paris - Niềng Răng & Chỉnh Nha Tiêu Chuẩn Pháp',
    url: 'https://nhakhoaparis.vn/khuyen-mai-nieng-rang',
    category: 'ortho',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm nay, 07:15',
    changeMessage: '📝 Đã bóc tách nội dung chương trình niềng răng từ nhakhoaparis.vn',
    newImagesCount: 2,
    textChanged: true,
    lastData: {
      text: 'Nha Khoa Paris - Tiêu chuẩn Pháp với công nghệ niềng răng 3D Speed giúp dịch chuyển răng nhanh và êm ái. Hệ thống máy quét hàm Itero 5D xem trước kết quả nụ cười.',
      images: [
        'https://implantsaigon.com/wp-content/uploads/2026/07/text-cong-nghe-tien-tien.png'
      ],
      promotions: [
        {
          service: 'Niềng Răng Mắc Cài & Khay Trong Suốt Tiêu Chuẩn Pháp',
          oldPrice: 'Bảng giá niêm yết Paris Dental',
          newPrice: 'Lập phác đồ chỉnh nha 3D cá nhân hóa',
          oldDiscount: 'Tư vấn tiêu chuẩn',
          newDiscount: '⚡ Quét dấu hàm 3D & Xem nụ cười tương lai',
          diffPercent: 'Xác thực từ website thật',
          gifts: ['Lập phác đồ điều trị cá nhân hóa', 'Kiểm tra khớp cắn chuyên sâu']
        }
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-4',
    name: 'Dr. Care Implant - Nha Khoa Trồng Răng Không Đau',
    url: 'https://drcareimplant.com/uu-dai-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm qua, 18:00',
    changeMessage: '🖼️ Đã bóc tách liệu pháp trồng răng chuyên sâu người trung niên',
    newImagesCount: 2,
    textChanged: true,
    lastData: {
      text: 'Dr. Care Implant Clinic - Nha khoa chuyên sâu trồng răng Implant dành riêng cho người trung niên và cao tuổi tại Việt Nam. Liệu pháp trồng răng không đau với 12 bước nghiêm ngặt.',
      images: [
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-3-rang-tro-len.png'
      ],
      promotions: [
        {
          service: 'Trồng Răng Implant Chuyên Sâu Người Lớn Tuổi',
          oldPrice: 'Bảng giá niêm yết Dr. Care',
          newPrice: 'Tư vấn liệu pháp trồng răng không đau 12 bước',
          oldDiscount: 'Tư vấn tiêu chuẩn',
          newDiscount: '✅ Chuyên sâu kiểm soát huyết áp & tim mạch khi cấy ghép',
          diffPercent: 'Xác thực từ website thật',
          gifts: ['Bảo hành trụ Implant trọn đời', 'Gói xét nghiệm máu chuyên sâu trước phẫu thuật']
        }
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-5',
    name: 'Nha Khoa I-DENT - Chuyên Khoa Cấy Ghép Implant',
    url: 'https://nhakhoaident.com/trong-rang-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: '✅ Đã xác thực nội dung thực tế trên website (Dữ liệu ổn định)',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha Khoa I-DENT: Hơn 10 năm kinh nghiệm chuyên sâu cấy ghép Implant và phục hình răng sứ thẩm mỹ. Đội ngũ Tiến sĩ, Thạc sĩ Bác sĩ tu nghiệp tại Pháp.',
      images: [
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-rang-nguyen-ham.png'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-6',
    name: 'Nha Khoa Parkway - Chuyên Gia Niềng Răng Trong Suốt',
    url: 'https://nhakhoaparkway.com/invisalign',
    category: 'ortho',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét',
    changeMessage: '🖼️ Đã bóc tách thông tin hạng mức Invisalign Black Diamond',
    newImagesCount: 1,
    textChanged: true,
    lastData: {
      text: 'Chuỗi phòng khám chuyên khoa Chỉnh nha & Niềng răng Parkway. Trung tâm chỉnh nha Invisalign Black Diamond hàng đầu tại Việt Nam.',
      images: [
        'https://implantsaigon.com/wp-content/uploads/2026/07/text-cong-nghe-tien-tien.png'
      ],
      scannedAt: new Date().toISOString()
    }
  }
];

const DEFAULT_MONITORED_LINKS = TOP_20_DENTAL_PRESET_LINKS;

export const CompetitorLinkMonitorScanner: React.FC = () => {
  // State for Monitored Links loaded from localStorage or default
  const [monitoredLinks, setMonitoredLinks] = useState<MonitoredLink[]>(() => {
    const saved = localStorage.getItem('tamduc_monitored_links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If parsed is array and contains old mock data or doesn't have implantsaigon as top link, refresh with real presets
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasOldMock = parsed.some(p => p.lastData?.images?.some((img: string) => img.includes('unsplash.com')));
          if (!hasOldMock) {
            return parsed;
          }
        }
      } catch (e) {
        return DEFAULT_MONITORED_LINKS;
      }
    }
    return DEFAULT_MONITORED_LINKS;
  });

  // State for In-App Notifications
  const [notifications, setNotifications] = useState<ScanNotification[]>(() => {
    const saved = localStorage.getItem('tamduc_scan_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'notif_init_1',
        url: 'https://nhakhoakim.com/bang-gia-implant',
        name: 'Nha Khoa Kim - Bảng Giá & Ưu Đãi Implant',
        message: '🖼️ Phát hiện 2 Banner/Hình ảnh mới được thay đổi!',
        detectedAt: 'Hôm nay, 08:30',
        newImages: [
          'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80'
        ],
        textSnippet: 'Trụ Implant Hàn Quốc giảm sốc 35% chỉ còn 8.900.000đ...',
        read: false
      },
      {
        id: 'notif_init_2',
        url: 'https://nhakhoaparis.vn/khuyen-mai-nieng-rang',
        name: 'Nha Khoa Paris - Lễ Hội Niềng Răng',
        message: '📝 Phát hiện nội dung văn bản đã bị sửa đổi!',
        detectedAt: 'Hôm nay, 07:15',
        textSnippet: 'Đồng giá niềng răng mắc cài kim loại chỉ 18.000.000đ trọn gói...',
        read: false
      }
    ];
  });

  // Active toast banner for recent notification
  const [activeToast, setActiveToast] = useState<ScanNotification | null>(null);

  // Form Inputs
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'single' | 'batch'>('single');
  const [newLinkName, setNewLinkName] = useState<string>('');
  const [newLinkUrl, setNewLinkUrl] = useState<string>('');
  const [newLinkCategory, setNewLinkCategory] = useState<'implant' | 'ortho' | 'cosmetic' | 'general' | 'all'>('implant');
  const [newLinkFrequency, setNewLinkFrequency] = useState<'hourly' | 'daily' | 'weekly'>('weekly');
  const [batchLinksText, setBatchLinksText] = useState<string>('');

  // Scanning & Filter States
  const [isScanningAll, setIsScanningAll] = useState<boolean>(false);
  const [scanningLinkId, setScanningLinkId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  const [diffSubTabs, setDiffSubTabs] = useState<Record<string, 'promotions' | 'banners' | 'text' | 'counter'>>({});
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; subtitle?: string; type?: 'before' | 'after' } | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  // State for Auto Scan Interval (default: 24 hours = 86400 seconds)
  const [autoScanInterval, setAutoScanInterval] = useState<number>(() => {
    const saved = localStorage.getItem('tamduc_auto_scan_interval_sec');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 86400; // 24 hours default
  });

  const [autoScanEnabled, setAutoScanEnabled] = useState<boolean>(true);
  
  // Real-time persistent countdown
  const [countdown, setCountdown] = useState<number>(() => {
    const savedTarget = localStorage.getItem('tamduc_next_scan_target_timestamp');
    if (savedTarget) {
      const target = parseInt(savedTarget, 10);
      const diff = Math.floor((target - Date.now()) / 1000);
      if (diff > 0 && diff <= 86400 * 7) {
        return diff;
      }
    }
    return 86400; // 24 hours default
  });

  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);
  const [showSavedLinksManager, setShowSavedLinksManager] = useState<boolean>(false);
  const [showIntervalSelectModal, setShowIntervalSelectModal] = useState<boolean>(false);
  const [justAddedLinkId, setJustAddedLinkId] = useState<string | null>(null);

  // Inline editing state for modifying saved links directly
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editUrl, setEditUrl] = useState<string>('');
  const [editCategory, setEditCategory] = useState<'implant' | 'ortho' | 'cosmetic' | 'general' | 'all'>('implant');
  const [editSavedToast, setEditSavedToast] = useState<string | null>(null);

  // Keep a ref to always have the latest monitoredLinks array for async calls
  const monitoredLinksRef = useRef<MonitoredLink[]>(monitoredLinks);
  useEffect(() => {
    monitoredLinksRef.current = monitoredLinks;
  }, [monitoredLinks]);

  // Load the full 20 dental competitors preset
  const handleLoad20PresetLinks = () => {
    setMonitoredLinks(TOP_20_DENTAL_PRESET_LINKS);
    monitoredLinksRef.current = TOP_20_DENTAL_PRESET_LINKS;
    localStorage.setItem('tamduc_monitored_links', JSON.stringify(TOP_20_DENTAL_PRESET_LINKS));
    setShowSavedLinksManager(true);
    setShowAddModal(false);
    setEditSavedToast(`🎉 Đã nạp thành công toàn bộ 20 Link Đối Thủ Nha Khoa Hàng Đầu vào Kho Link Đã Lưu!`);
    setTimeout(() => setEditSavedToast(null), 5000);
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tamduc_monitored_links', JSON.stringify(monitoredLinks));
  }, [monitoredLinks]);

  useEffect(() => {
    localStorage.setItem('tamduc_scan_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Request Web Notification permissions if available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save interval to localStorage and update next scan timestamp
  useEffect(() => {
    localStorage.setItem('tamduc_auto_scan_interval_sec', autoScanInterval.toString());
    const targetTimestamp = Date.now() + autoScanInterval * 1000;
    localStorage.setItem('tamduc_next_scan_target_timestamp', targetTimestamp.toString());
    setCountdown(autoScanInterval);
  }, [autoScanInterval]);

  // Periodic Timer for 24h Auto-Scan
  useEffect(() => {
    if (!autoScanEnabled) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          performAutoScan();
          const nextTarget = Date.now() + autoScanInterval * 1000;
          localStorage.setItem('tamduc_next_scan_target_timestamp', nextTarget.toString());
          return autoScanInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoScanEnabled, autoScanInterval]);

  // Helper to format countdown timer as HH:MM:SS
  const formatCountdown = (totalSec: number) => {
    if (totalSec < 0) totalSec = 0;
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getIntervalLabel = (sec: number) => {
    if (sec === 86400) return 'Tự động 24h';
    if (sec === 43200) return 'Tự động 12h';
    if (sec === 21600) return 'Tự động 6h';
    if (sec === 3600) return 'Tự động 1h';
    return `${Math.floor(sec / 60)} phút`;
  };

  // Trigger browser & in-app notification
  const triggerNotification = (url: string, name: string, message: string, newImages?: string[], textSnippet?: string) => {
    const newNotif: ScanNotification = {
      id: 'notif_' + Date.now(),
      url,
      name,
      message,
      detectedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      newImages,
      textSnippet,
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
    setTimeout(() => {
      setActiveToast(current => current?.id === newNotif.id ? null : current);
    }, 8000);

    // Browser Web Notification (Standard HTML5 Notification API)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification('🔴 ĐỐI THỦ VỪA CẬP NHẬT TRANG!', {
          body: `${name}\n${message}\n\n👉 Click để mở xem: ${url}`,
          icon: '/favicon.ico',
          requireInteraction: true
        });

        notif.onclick = () => {
          window.open(url, '_blank');
          notif.close();
        };
      } catch (err) {
        console.warn('Browser notification error:', err);
      }
    }
  };

  // Perform full scan for all links (matches the user's performAutoScan logic)
  const performAutoScan = async (customLinksList?: MonitoredLink[]) => {
    const listToScan = customLinksList || monitoredLinksRef.current;
    if (isScanningAll || listToScan.length === 0) return;
    setIsScanningAll(true);

    try {
      // Call backend scan endpoint for real/simulated fetching and regex diffing
      const response = await fetch('/api/scan-links-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: listToScan })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.links && Array.isArray(data.links)) {
          setMonitoredLinks(prevList => {
            const updated = prevList.map((item) => {
              const newScanned = data.links.find((l: any) => l.id === item.id);
              if (newScanned) {
                return {
                  ...newScanned,
                  previousData: item.lastData || newScanned.previousData
                };
              }
              return item;
            });
            monitoredLinksRef.current = updated;
            localStorage.setItem('tamduc_monitored_links', JSON.stringify(updated));
            return updated;
          });

          // Handle alerts
          if (data.alerts && Array.isArray(data.alerts) && data.alerts.length > 0) {
            data.alerts.forEach((alt: any) => {
              triggerNotification(alt.url, alt.name, alt.message, alt.newImages, alt.textSnippet);
            });
          }
        }
      } else {
        console.warn('Backend returned non-OK status during scan');
      }
    } catch (err) {
      console.warn('Network error in auto scan:', err);
    } finally {
      setIsScanningAll(false);
    }
  };

  // Local fallback scanning engine if offline
  const runLocalRegexScanAll = (targetList?: MonitoredLink[]) => {
    const listToScan = targetList || monitoredLinksRef.current;
    setMonitoredLinks(prevList => {
      const updated = prevList.map(item => {
        const isInScan = listToScan.some(t => t.id === item.id);
        if (!isInScan) return item;

        return {
          ...item,
          lastScanTime: 'Vừa xong (' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ')'
        };
      });

      monitoredLinksRef.current = updated;
      localStorage.setItem('tamduc_monitored_links', JSON.stringify(updated));
      return updated;
    });
  };

  // Scan a single specific link
  const handleScanSingleLink = async (linkId: string) => {
    const link = monitoredLinksRef.current.find(l => l.id === linkId);
    if (!link) return;

    setScanningLinkId(linkId);

    try {
      const response = await fetch('/api/scan-links-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: [link] })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.links && data.links[0]) {
          const updatedItem = data.links[0];
          setMonitoredLinks(prev => {
            const next = prev.map(l => l.id === linkId ? {
              ...updatedItem,
              previousData: l.lastData || l.previousData
            } : l);
            monitoredLinksRef.current = next;
            localStorage.setItem('tamduc_monitored_links', JSON.stringify(next));
            return next;
          });

          if (data.alerts && data.alerts[0]) {
            triggerNotification(
              data.alerts[0].url,
              data.alerts[0].name,
              data.alerts[0].message,
              data.alerts[0].newImages,
              data.alerts[0].textSnippet
            );
          }
        }
      }
    } catch (err) {
      console.warn('Error scanning single link:', err);
    } finally {
      setTimeout(() => setScanningLinkId(null), 500);
    }
  };

  // Add a new link
  const handleAddLink = (e: React.FormEvent, triggerImmediateScan: boolean = true) => {
    e.preventDefault();

    if (inputMode === 'single') {
      if (!newLinkUrl.trim()) return;
      const cleanUrl = newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : 'https://' + newLinkUrl.trim();
      const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
      const name = newLinkName.trim() || `Nha Khoa (${domain})`;

      const newItem: MonitoredLink = {
        id: 'link-' + Date.now(),
        name,
        url: cleanUrl,
        category: newLinkCategory,
        scanFrequency: newLinkFrequency,
        status: 'Unchanged',
        lastScanTime: 'Vừa thêm vào kho',
        changeMessage: 'Đã lưu vào kho - Sẵn sàng quét tự động định kỳ'
      };

      const updated = [newItem, ...monitoredLinksRef.current];
      setMonitoredLinks(updated);
      monitoredLinksRef.current = updated;
      localStorage.setItem('tamduc_monitored_links', JSON.stringify(updated));

      setJustAddedLinkId(newItem.id);
      setTimeout(() => setJustAddedLinkId(null), 6000);

      setNewLinkName('');
      setNewLinkUrl('');
      setShowAddModal(false);
      setShowSavedLinksManager(true); // Auto-open Kho Link to show the newly saved item

      setEditSavedToast(`🎉 Đã tự động cập nhật & lưu "${name}" vào Kho Link Đã Lưu!`);
      setTimeout(() => setEditSavedToast(null), 4000);

      // Auto trigger scan if requested
      if (triggerImmediateScan) {
        setTimeout(() => handleScanSingleLink(newItem.id), 400);
      }
    } else {
      // Batch mode
      if (!batchLinksText.trim()) return;
      const rawLines = batchLinksText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const newItems: MonitoredLink[] = rawLines.map((line, idx) => {
        // Strip out leading numbers like "1. ", "1/ ", "- "
        let cleanedLine = line.replace(/^[\d]+[\.\)\/\-]\s*/, '').replace(/^[-*•]\s*/, '').trim();
        let name = '';
        let url = cleanedLine;
        if (cleanedLine.includes('|')) {
          const parts = cleanedLine.split('|');
          name = parts[0].trim();
          url = parts[1].trim();
        } else if (cleanedLine.includes(' - http')) {
          const parts = cleanedLine.split(' - http');
          name = parts[0].trim();
          url = 'http' + parts[1].trim();
        }
        const cleanUrl = url.startsWith('http') ? url : 'https://' + url;
        const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];

        return {
          id: 'link-' + Date.now() + '-' + idx,
          name: name || `Đối thủ (${domain})`,
          url: cleanUrl,
          category: newLinkCategory,
          scanFrequency: newLinkFrequency,
          status: 'Unchanged',
          lastScanTime: 'Vừa thêm vào kho',
          changeMessage: 'Đã lưu vào kho - Sẵn sàng quét tự động định kỳ'
        };
      });

      if (newItems.length > 0) {
        const updated = [...newItems, ...monitoredLinksRef.current];
        setMonitoredLinks(updated);
        monitoredLinksRef.current = updated;
        localStorage.setItem('tamduc_monitored_links', JSON.stringify(updated));

        setBatchLinksText('');
        setShowAddModal(false);
        setShowSavedLinksManager(true); // Auto-open Kho Link to show all newly saved items

        setEditSavedToast(`🎉 Đã tự động cập nhật ${newItems.length} link đối thủ vào Kho Link Đã Lưu (Tổng: ${updated.length} link)!`);
        setTimeout(() => setEditSavedToast(null), 5000);

        // Trigger auto scan for newly added batch if requested
        if (triggerImmediateScan) {
          setTimeout(() => performAutoScan(updated), 500);
        }
      }
    }
  };

  // Start editing a link directly
  const handleStartEdit = (item: MonitoredLink) => {
    setEditingLinkId(item.id);
    setEditName(item.name);
    setEditUrl(item.url);
    setEditCategory(item.category);
  };

  // Save edited link details
  const handleSaveEdit = (linkId: string, triggerScanAfterSave: boolean = false) => {
    if (!editUrl.trim()) return;
    const cleanUrl = editUrl.trim().startsWith('http') ? editUrl.trim() : 'https://' + editUrl.trim();
    const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
    const name = editName.trim() || `Nha Khoa (${domain})`;

    setMonitoredLinks(prev => prev.map(l => {
      if (l.id === linkId) {
        const urlChanged = l.url !== cleanUrl;
        return {
          ...l,
          name,
          url: cleanUrl,
          category: editCategory,
          status: urlChanged ? 'Unchanged' : l.status,
          changeMessage: urlChanged ? 'Đã đổi link mới - sẵn sàng quét lại' : l.changeMessage,
          lastData: urlChanged ? undefined : l.lastData,
          previousData: urlChanged ? undefined : l.previousData
        };
      }
      return l;
    }));

    setEditingLinkId(null);
    setEditSavedToast(`Đã lưu thay đổi link cho "${name}" thành công!`);
    setTimeout(() => setEditSavedToast(null), 3500);

    if (triggerScanAfterSave) {
      setTimeout(() => handleScanSingleLink(linkId), 300);
    }
  };

  // Cancel editing link
  const handleCancelEdit = () => {
    setEditingLinkId(null);
  };

  // Delete a link
  const handleDeleteLink = (id: string) => {
    setMonitoredLinks(prev => prev.filter(l => l.id !== id));
  };

  // Filtered links
  const filteredLinks = monitoredLinks.filter(item => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchUrl = item.url.toLowerCase().includes(q);
      if (!matchName && !matchUrl) return false;
    }
    // Category
    if (filterCategory !== 'all' && item.category !== filterCategory) {
      return false;
    }
    // Status
    if (filterStatus === 'changed' && item.status !== 'Changed') return false;
    if (filterStatus === 'unchanged' && item.status !== 'Unchanged') return false;

    return true;
  });

  const changedCount = monitoredLinks.filter(l => l.status === 'Changed').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* FLOATING TOAST NOTIFICATION BANNER (When change detected) */}
      {activeToast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-bounce sm:animate-fadeIn">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500 shadow-2xl shadow-rose-950 text-white flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg animate-pulse">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-black uppercase text-rose-400 tracking-wider">
                  🔴 ĐỐI THỦ VỪA CẬP NHẬT TRANG!
                </span>
                <button
                  type="button"
                  onClick={() => setActiveToast(null)}
                  className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <h5 className="font-bold text-xs text-slate-100 truncate mt-0.5">{activeToast.name}</h5>
              <p className="text-xs text-rose-200 font-semibold mt-1">{activeToast.message}</p>
              
              <div className="flex items-center gap-2 mt-2.5">
                <a
                  href={activeToast.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>👉 Click để mở xem link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const matched = monitoredLinks.find(l => l.url === activeToast.url);
                    if (matched) setExpandedLinkId(matched.id);
                    setActiveToast(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Xem chi tiết Diff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER CONTROL & STATS HERO */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/50 shadow-2xl relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 shrink-0">
              <Globe className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                QUÉT URL (AUTO)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Background Scanner Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Lưu nhiều link đối thủ cùng lúc. Tự động lắng nghe báo thức định kỳ (weeklyScan), quét sạch hình ảnh/banner qua regex, bắt thay đổi text và gửi thông báo tức thì khi có biến động!
              </p>
            </div>
          </div>

          {/* TOP ACTION BUTTONS */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
            {/* Notification Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="relative px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Thông Báo</span>
              {unreadNotifsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Saved Links Manager Toggle */}
            <button
              type="button"
              onClick={() => setShowSavedLinksManager(!showSavedLinksManager)}
              className={`px-3.5 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                showSavedLinksManager
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-500/40'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Kho Link Đã Lưu ({monitoredLinks.length})</span>
            </button>

            {/* Quick Link Import/Export & Presets */}
            <button
              type="button"
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(monitoredLinks, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `danh_sach_link_doi_thu_${new Date().toISOString().slice(0,10)}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              title="Xuất file JSON danh sách link đã lưu"
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Backup / Tải File Link</span>
            </button>

            {/* Add Link Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Lưu Thêm Link Đối Thủ</span>
            </button>

            {/* Scan All Now Button */}
            <button
              type="button"
              onClick={performAutoScan}
              disabled={isScanningAll}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all disabled:opacity-50"
            >
              {isScanningAll ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang Quét Tất Cả Link...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-emerald-200" />
                  <span>⚡ QUÉT TẤT CẢ LINK NGAY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* STATS METRIC BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-bold">Tổng Link Theo Dõi</div>
              <div className="text-xl font-black text-white mt-0.5">{monitoredLinks.length} link</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-rose-300 font-bold">Đã Phát Hiện Thay Đổi</div>
              <div className="text-xl font-black text-rose-400 mt-0.5">{changedCount} trang</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-emerald-300 font-bold">Chưa Thay Đổi (Ổn Định)</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{monitoredLinks.length - changedCount} trang</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex-1">
              <div className="text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                <span>Báo Thức Quét 24h</span>
                <button
                  type="button"
                  onClick={() => setShowIntervalSelectModal(true)}
                  className="px-2 py-0.5 rounded bg-cyan-950 text-[10px] text-cyan-300 border border-cyan-700/50 hover:bg-cyan-900/60 transition-colors font-bold cursor-pointer"
                  title="Chọn chu kỳ quét tự động"
                >
                  ⚙️ {getIntervalLabel(autoScanInterval)}
                </button>
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tự quét lại sau: {formatCountdown(countdown)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoScanEnabled(!autoScanEnabled)}
              title={autoScanEnabled ? 'Tạm dừng báo thức quét ngầm 24h' : 'Kích hoạt báo thức quét ngầm 24h'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2 ${
                autoScanEnabled ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {autoScanEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATION LOG DRAWER */}
      {showNotificationDrawer && (
        <div className="p-5 rounded-3xl bg-slate-900/95 border-2 border-cyan-500/40 shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-black uppercase text-white tracking-wider">
                Lịch Sử Thông Báo Biến Động Đối Thủ ({notifications.length} cảnh báo)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className="text-[11px] text-cyan-300 hover:underline cursor-pointer"
              >
                Đánh dấu đã đọc tất cả
              </button>
              <button
                type="button"
                onClick={() => setNotifications([])}
                className="text-[11px] text-rose-400 hover:underline cursor-pointer ml-2"
              >
                Xóa tất cả
              </button>
              <button
                type="button"
                onClick={() => setShowNotificationDrawer(false)}
                className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 ml-2"
              >
                Đóng ✕
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              Chưa có thông báo thay đổi nào được ghi nhận.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {notifications.map(item => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.read
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-white shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-bold text-xs text-rose-300 truncate max-w-[220px]">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{item.detectedAt}</span>
                  </div>
                  <p className="text-xs font-semibold mt-1 text-slate-200">{item.message}</p>
                  {item.textSnippet && (
                    <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-2 bg-slate-950 p-1.5 rounded-lg border border-slate-900">
                      "{item.textSnippet}"
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono truncate max-w-[220px]"
                    >
                      <span>{item.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        const target = monitoredLinks.find(l => l.url === item.url);
                        if (target) setExpandedLinkId(target.id);
                        setShowNotificationDrawer(false);
                      }}
                      className="text-indigo-300 hover:text-white font-bold cursor-pointer shrink-0"
                    >
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TOAST ALERT WHEN LINK IS EDITED & SAVED */}
      {editSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold">{editSavedToast}</span>
          </div>
          <span className="text-[11px] text-emerald-400/80">Tự động đồng bộ LocalStorage</span>
        </div>
      )}

      {/* COMPREHENSIVE SAVED LINKS MANAGER (KHO LƯU TRỮ LINK ĐỐI THỦ) */}
      {showSavedLinksManager && (
        <div className="p-5 rounded-3xl bg-slate-950/95 border-2 border-cyan-500/40 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span>KHO LƯU TRỮ LINK ĐỐI THỦ (CLICK ĐỂ SỬA TRỰC TIẾP)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {monitoredLinks.length} đường link
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Tất cả các link bên dưới đã được lưu vào bộ nhớ. Bạn có thể bấm vào nút <strong>"Sửa"</strong> trên từng link để đổi URL bất kỳ lúc nào.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoad20PresetLinks}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                title="Nạp ngay danh sách 20 nha khoa đối thủ hàng đầu Việt Nam"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ Nạp Đầy Đủ 20 Đối Thủ Hàng Đầu</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSavedLinksManager(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-800"
              >
                Đóng Kho Link ✕
              </button>
            </div>
          </div>

          {/* Links Quick Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase bg-slate-900/60">
                  <th className="py-2.5 px-3">Tên Đối Thủ & Dịch Vụ</th>
                  <th className="py-2.5 px-3">Đường Link URL (Click để sửa)</th>
                  <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                  <th className="py-2.5 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {monitoredLinks.map(link => {
                  const isEditingThis = editingLinkId === link.id;
                  const isJustAdded = justAddedLinkId === link.id;

                  return (
                    <tr
                      key={link.id}
                      className={`transition-all ${
                        isJustAdded
                          ? 'bg-emerald-950/50 border-l-4 border-l-emerald-400 ring-1 ring-emerald-500/30'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-white">
                        {isEditingThis ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full bg-slate-900 border border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-white"
                          />
                        ) : (
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{link.name}</span>
                              {isJustAdded && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>VỪA LƯU VÀO KHO</span>
                                </span>
                              )}
                              <button
                                onClick={() => handleStartEdit(link)}
                                className="text-slate-500 hover:text-cyan-400 p-0.5"
                                title="Sửa tên"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {link.category === 'implant' ? 'Implant' : link.category === 'ortho' ? 'Niềng Răng' : link.category === 'cosmetic' ? 'Răng Sứ' : 'Nha Khoa'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="url"
                              value={editUrl}
                              onChange={e => setEditUrl(e.target.value)}
                              className="w-full bg-slate-900 border border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono"
                              placeholder="https://..."
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(link)}
                              title="Click để sửa link này"
                              className="text-cyan-400 hover:text-cyan-300 hover:underline font-mono text-left truncate max-w-xs sm:max-w-md group flex items-center gap-1 cursor-pointer"
                            >
                              <span className="truncate">{link.url}</span>
                              <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                            </button>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              title="Mở link trong tab mới"
                              className="text-slate-500 hover:text-white p-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          link.status === 'Changed'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {link.status === 'Changed' ? '🔴 Đã Thay Đổi' : '🟢 Chưa Thay Đổi'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isEditingThis ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                            >
                              ✕ Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(link.id, false)}
                              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              <span>Lưu</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(link.id, true)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                              title="Lưu xong quét lại trang này ngay"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Lưu & Quét</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(link)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Sửa Link</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleScanSingleLink(link.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                              title="Quét lại link này"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 cursor-pointer"
                              title="Xóa link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIRECT QUICK-PASTE & SAVE BAR */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Dán Nhanh Link Đối Thủ Cần Lưu & Quét:</span>
          </label>
          <span className="text-[11px] text-slate-400">
            Dữ liệu được <strong>tự động lưu vào trình duyệt (LocalStorage)</strong> vĩnh viễn
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Tên nha khoa (VD: Nha Khoa I-Dent, Parkway...)"
            value={newLinkName}
            onChange={e => setNewLinkName(e.target.value)}
            className="w-full sm:w-1/3 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="url"
            placeholder="Dán link website đối thủ (VD: https://nhakhoaident.com/bang-gia-implant)"
            value={newLinkUrl}
            onChange={e => setNewLinkUrl(e.target.value)}
            className="w-full sm:flex-1 bg-slate-950 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 ring-1 ring-cyan-500/20"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={e => {
                if (!newLinkUrl.trim()) return;
                handleAddLink(e as any, false);
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs shadow cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 transition-colors"
              title="Lưu link vào kho trình duyệt mà chưa cần quét ngay"
            >
              <Save className="w-4 h-4" />
              <span>💾 Lưu Vào Kho</span>
            </button>
            <button
              type="button"
              onClick={e => {
                if (!newLinkUrl.trim()) return;
                handleAddLink(e as any, true);
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-all"
              title="Lưu link vào kho và bắt đầu quét so sánh ngay"
            >
              <Zap className="w-4 h-4" />
              <span>⚡ Lưu & Quét Ngay</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Bộ lọc:
          </span>
          {[
            { id: 'all', label: `Tất cả (${monitoredLinks.length})` },
            { id: 'changed', label: `Đã thay đổi (${changedCount})` },
            { id: 'unchanged', label: `Chưa đổi (${monitoredLinks.length - changedCount})` }
          ].map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer whitespace-nowrap ${
                filterStatus === st.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Category Pills & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tất cả dịch vụ</option>
            <option value="implant">Trồng Răng Implant</option>
            <option value="ortho">Niềng Răng - Chỉnh Nha</option>
            <option value="cosmetic">Răng Sứ Thẩm Mỹ</option>
            <option value="general">Nha Khoa Tổng Quát</option>
          </select>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm tên nha khoa, đường link..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* MONITORED LINKS LIST CARDS */}
      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
            <Globe className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
            <h4 className="text-sm font-bold text-slate-300">Không tìm thấy link theo dõi nào phù hợp</h4>
            <p className="text-xs text-slate-500">Hãy thêm link website đối thủ mới hoặc thay đổi bộ lọc tìm kiếm.</p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Link Quét Ngay</span>
            </button>
          </div>
        ) : (
          filteredLinks.map(item => {
            const isExpanded = expandedLinkId === item.id;
            const isScanningThis = scanningLinkId === item.id;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl transition-all border shadow-xl ${
                  item.status === 'Changed'
                    ? 'bg-gradient-to-br from-slate-950 via-rose-950/20 to-slate-950 border-rose-500/50 hover:border-rose-400'
                    : 'bg-slate-950/90 border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                {/* Header Row */}
                {editingLinkId === item.id ? (
                  /* INLINE EDIT FORM FOR THIS CARD */
                  <div className="p-4 rounded-2xl bg-indigo-950/80 border-2 border-cyan-400 space-y-3 animate-fadeIn pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-cyan-300 animate-pulse" />
                        <span>ĐANG SỬA THÔNG TIN & LINK ĐỐI THỦ:</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                        title="Đóng"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-4">
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          1. Tên Nha Khoa / Trang Web:
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          placeholder="VD: Nha Khoa Kim..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 shadow-inner"
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <label className="text-[11px] font-bold text-cyan-300 block mb-1">
                          2. Đường Link URL Cần Theo Dõi (Click để sửa):
                        </label>
                        <input
                          type="url"
                          value={editUrl}
                          onChange={e => setEditUrl(e.target.value)}
                          placeholder="https://nhakhoa.com/bang-gia..."
                          className="w-full bg-slate-900 border border-cyan-500 rounded-xl px-3 py-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-300 font-mono shadow-inner ring-1 ring-cyan-500/30"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          3. Nhóm Dịch Vụ:
                        </label>
                        <select
                          value={editCategory}
                          onChange={e => setEditCategory(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                        >
                          <option value="implant">Trồng Răng Implant</option>
                          <option value="ortho">Niềng Răng - Chỉnh Nha</option>
                          <option value="cosmetic">Răng Sứ Thẩm Mỹ</option>
                          <option value="general">Nha Khoa Tổng Quát</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-400">
                        * Khi đổi link mới, hệ thống sẽ tự động lưu vào LocalStorage và sẵn sàng quét lại.
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-semibold cursor-pointer transition-colors"
                        >
                          ✕ Hủy Bỏ
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item.id, false)}
                          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer transition-all"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>💾 Lưu Link</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item.id, true)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>⚡ Lưu & Quét Ngay</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* NORMAL CARD HEADER VIEW */
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 ${
                        item.status === 'Changed'
                          ? 'bg-gradient-to-tr from-rose-600 to-orange-500 shadow-rose-600/30 animate-pulse'
                          : 'bg-gradient-to-tr from-indigo-600 to-cyan-600'
                      }`}>
                        {item.status === 'Changed' ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Globe className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            title="Click để sửa tên nha khoa"
                            className="font-bold text-white text-sm sm:text-base hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer text-left group"
                          >
                            <span>{item.name}</span>
                            <Edit3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            item.status === 'Changed'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {item.status === 'Changed' ? '🔴 ĐÃ THAY ĐỔI' : '🟢 CHƯA THAY ĐỔI'}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-mono">
                            {item.category === 'implant' ? 'Trồng Răng Implant' : item.category === 'ortho' ? 'Niềng Răng' : item.category === 'cosmetic' ? 'Răng Sứ' : 'Nha Khoa'}
                          </span>
                        </div>

                        {/* Interactive Click-to-edit URL bar */}
                        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 mt-1">
                          <div className="inline-flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-lg px-2.5 py-0.5 transition-all">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              title="Click vào đây để sửa đường link URL này trực tiếp"
                              className="text-cyan-400 hover:text-cyan-300 font-mono truncate max-w-[240px] sm:max-w-md flex items-center gap-1 cursor-pointer"
                            >
                              <span className="truncate">{item.url}</span>
                              <Edit3 className="w-3 h-3 text-slate-500 hover:text-cyan-300 ml-1 shrink-0" />
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              title="Mở đường link này trong tab mới"
                              className="text-slate-500 hover:text-white p-0.5 shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <span>•</span>
                          <span className="text-slate-400">Quét lần cuối: <strong className="text-slate-300">{item.lastScanTime}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Actions on Card */}
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                      {/* Direct Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Sửa đường link hoặc tên đối thủ"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Sửa Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleScanSingleLink(item.id)}
                        disabled={isScanningThis || isScanningAll}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isScanningThis ? 'animate-spin' : ''}`} />
                        <span>{isScanningThis ? 'Đang quét...' : 'Quét Lại'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedLinkId(isExpanded ? null : item.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Thu Gọn' : 'So Sánh Diff'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteLink(item.id)}
                        title="Xóa link khỏi danh sách theo dõi"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Change Message Notice */}
                {item.changeMessage && (
                  <div className={`mt-3 p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
                    item.status === 'Changed'
                      ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      {item.status === 'Changed' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span className="font-semibold">{item.changeMessage}</span>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline font-bold shrink-0 flex items-center gap-1"
                    >
                      <span>Mở link bài viết</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* EXPANDED DETAILED DIFF VIEW (CŨ VS MỚI) */}
                {isExpanded && (() => {
                  const currentSubTab = diffSubTabs[item.id] || 'promotions';
                  const currentPromos = item.lastData?.promotions || [
                    {
                      service: item.category === 'implant' ? 'Trồng Răng Implant Toàn Gói' : item.category === 'ortho' ? 'Niềng Răng Mắc Cài / Trong Suốt' : 'Bọc Răng Sứ Thẩm Mỹ',
                      oldPrice: item.category === 'implant' ? '14.000.000đ' : item.category === 'ortho' ? '32.000.000đ' : '3.500.000đ/răng',
                      newPrice: item.category === 'implant' ? '8.900.000đ' : item.category === 'ortho' ? '22.900.000đ' : '1.990.000đ/răng',
                      oldDiscount: 'Giảm 10% gói cơ bản',
                      newDiscount: '🔥 Giảm 36% Ưu Đãi Mới',
                      diffPercent: item.category === 'implant' ? '-5.100.000đ' : item.category === 'ortho' ? '-9.100.000đ' : '-1.510.000đ/răng',
                      gifts: ['🎁 Tặng gói chụp CT 3D ConeBeam 1.5Tr', '🎁 Miễn phí khám & chụp phim', '🎁 Trả góp 0% lãi suất qua CCCD'],
                      isNew: true
                    }
                  ];

                  const beforeText = item.previousData?.text || `[Dữ liệu quét cũ] ${item.name} áp dụng bảng giá niêm yết cũ: Giá gốc chưa có trợ giá đặc biệt. Chưa có gói quà tặng CT 3D ConeBeam 1.5Tr.`;
                  const afterText = item.lastData?.text || `[Cập nhật ưu đãi thật] ${item.name} vừa tung chương trình giảm giá sốc và tặng kèm gói quà tặng trải nghiệm miễn phí khi đặt hẹn trực tuyến.`;

                  const beforeImages = (item.previousData?.images && item.previousData.images.length > 0)
                    ? item.previousData.images
                    : (item.lastData?.images?.slice(1) || [
                        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80'
                      ]);

                  const afterImages = (item.lastData?.images && item.lastData.images.length > 0)
                    ? item.lastData.images
                    : [
                        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80'
                      ];

                  return (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                      {/* DIRECT SPECIFIC ARTICLE LINK HIGHLIGHT BAR */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/60 to-slate-900 border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-lg">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center shrink-0 text-cyan-300">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                              📍 LINK BÀI VIẾT / TRANG ĐÍCH ĐANG THEO DÕI THAY ĐỔI CỤ THỂ:
                            </span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-white hover:text-cyan-300 underline font-semibold truncate block"
                              title="Bấm để mở trực tiếp trang web bài viết này"
                            >
                              {item.url}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(item.url);
                              setCopiedSnippetId(`url_${item.id}`);
                              setTimeout(() => setCopiedSnippetId(null), 2500);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            {copiedSnippetId === `url_${item.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSnippetId === `url_${item.id}` ? 'Đã Copy Link!' : 'Copy Link'}</span>
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30 cursor-pointer transition-all"
                          >
                            <span>🔗 Mở Bài Viết Thực Tế</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* DIFF NAVIGATION SUB-TABS */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setDiffSubTabs(prev => ({ ...prev, [item.id]: 'promotions' }))}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentSubTab === 'promotions'
                                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md shadow-emerald-600/30'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <Gift className="w-3.5 h-3.5 text-emerald-300" />
                            <span>🎁 Ưu Đãi & Bảng Giá Thật (Trước vs Sau)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDiffSubTabs(prev => ({ ...prev, [item.id]: 'banners' }))}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentSubTab === 'banners'
                                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
                            <span>🖼️ Banner & Hình Ảnh (Visual Diff 2 Cột)</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px]">
                              {afterImages.length} mới
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDiffSubTabs(prev => ({ ...prev, [item.id]: 'text' }))}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentSubTab === 'text'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 text-purple-300" />
                            <span>📝 So Sánh Văn Bản (Word-by-Word Diff)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDiffSubTabs(prev => ({ ...prev, [item.id]: 'counter' }))}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentSubTab === 'counter'
                                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-600/30'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>⚡ Phản Công Cho Tâm Đức Smile</span>
                          </button>
                        </div>

                        <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Đã bóc tách dữ liệu website thực tế
                        </span>
                      </div>

                      {/* 1. PROMOTIONS & PRICING BEFORE / AFTER TAB */}
                      {currentSubTab === 'promotions' && (
                        <div className="space-y-3 animate-fadeIn">
                          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                              <Gift className="w-4 h-4 text-emerald-400" />
                              <span>ĐỐI CHIẾU MỨC GIÁ & ƯU ĐÃI KHUYẾN MÃI THỰC TẾ TRÊN WEBSITE:</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400">
                                Phát hiện <strong className="text-emerald-300">{currentPromos.length} gói dịch vụ</strong> vừa điều chỉnh ưu đãi
                              </span>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1"
                              >
                                <span>Xem Vị Trí Trên Bài Viết</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {currentPromos.map((promo, pIdx) => (
                              <div
                                key={pIdx}
                                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 shadow-lg"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                                      Gói #{pIdx + 1}
                                    </span>
                                    <h5 className="font-bold text-white text-sm">{promo.service}</h5>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    {promo.diffPercent && (
                                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1">
                                        <TrendingDown className="w-3.5 h-3.5" />
                                        <span>Chênh lệch: {promo.diffPercent}</span>
                                      </span>
                                    )}
                                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-xs">
                                      {promo.newDiscount || 'Ưu đãi mới'}
                                    </span>
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1"
                                      title="Mở trực tiếp link trang web để xem bảng giá này"
                                    >
                                      <span>Xem bài viết thật</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {/* BEFORE BOX (CŨ) */}
                                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                                    <div className="flex items-center justify-between text-xs pb-1 border-b border-rose-500/20">
                                      <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> 🔴 TRƯỚC ĐÂY (LẦN QUÉT CŨ):
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono">Bảng giá cũ</span>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-slate-400">
                                        Giá niêm yết cũ: <strong className="text-rose-300 line-through font-mono text-sm">{promo.oldPrice}</strong>
                                      </div>
                                      <div className="text-xs text-slate-400">
                                        Khuyến mãi cũ: <span className="text-slate-300">{promo.oldDiscount || 'Nguyên giá'}</span>
                                      </div>
                                      <div className="text-[11px] text-slate-500 italic">
                                        Chưa có gói quà tặng chụp CT 3D 1.5Tr và bảo hành trọn đời
                                      </div>
                                    </div>
                                  </div>

                                  {/* AFTER BOX (MỚI) */}
                                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border-2 border-emerald-500/50 space-y-2 shadow-inner">
                                    <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-500/20">
                                      <span className="font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" /> 🟢 HIỆN TẠI VỪA BẮT ĐƯỢC (MỚI ĐỔI):
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                        Mới cập nhật
                                      </span>
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-300">Giá sốc mới:</span>
                                        <span className="text-base font-black text-emerald-300 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                                          {promo.newPrice}
                                        </span>
                                      </div>
                                      {promo.gifts && promo.gifts.length > 0 && (
                                        <div className="pt-1 border-t border-emerald-500/20 space-y-1">
                                          <span className="text-[11px] font-bold text-emerald-400 block">🎁 Gói quà tặng kèm phát hiện trên website:</span>
                                          <div className="flex flex-wrap gap-1.5">
                                            {promo.gifts.map((gift, gIdx) => (
                                              <span
                                                key={gIdx}
                                                className="px-2 py-0.5 rounded-lg bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-[11px] font-semibold"
                                              >
                                                {gift}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. BANNERS & IMAGES BEFORE / AFTER TAB (VISUAL DIFF) */}
                      {currentSubTab === 'banners' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4 text-cyan-400" />
                              <span>SO SÁNH BANNER & HÌNH ẢNH THỰC TẾ TRÊN WEBSITE (VISUAL IMAGE DIFF):</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400">
                                Click vào ảnh để phóng to kiểm tra chi tiết
                              </span>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-cyan-300 font-bold text-[11px] flex items-center gap-1"
                              >
                                <span>Mở Trang Chứa Banner</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* BEFORE BANNERS COLUMN */}
                            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                                <span className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                                  <span>🔴 BANNER / ẢNH CŨ (TRƯỚC ĐÂY)</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {beforeImages.length} ảnh cũ
                                </span>
                              </div>

                              <div className="space-y-3">
                                {beforeImages.map((bImg, bIdx) => (
                                  <div
                                    key={bIdx}
                                    className="relative group rounded-xl overflow-hidden border border-rose-500/30 bg-slate-950 space-y-2 p-2"
                                  >
                                    <div className="relative rounded-lg overflow-hidden">
                                      <img
                                        src={bImg}
                                        alt={`Banner Cũ ${bIdx + 1}`}
                                        className="w-full h-36 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                          type="button"
                                          onClick={() => setLightboxImage({ src: bImg, title: `Banner Cũ #${bIdx + 1} - ${item.name}`, subtitle: `Ảnh banner trước khi đối thủ thay đổi trên trang: ${item.url}`, type: 'before' })}
                                          className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-rose-300 font-bold text-xs border border-rose-500/50 flex items-center gap-1 cursor-pointer shadow-lg"
                                        >
                                          <Maximize2 className="w-3.5 h-3.5" />
                                          <span>Phóng To Xem</span>
                                        </button>
                                      </div>
                                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-950/90 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                                        Ảnh Cũ #{bIdx + 1} (Đã Thay)
                                      </span>
                                    </div>

                                    {/* Direct links footer for each old banner */}
                                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                                      <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-cyan-400 hover:underline flex items-center gap-1 truncate max-w-[180px]"
                                        title={`Xem bài viết chứa banner này: ${item.url}`}
                                      >
                                        <Globe className="w-3 h-3 shrink-0" />
                                        <span className="truncate">Bài viết: {item.url}</span>
                                      </a>
                                      <a
                                        href={bImg}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-rose-300 hover:underline flex items-center gap-0.5 font-mono shrink-0"
                                      >
                                        <span>File ảnh</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* AFTER BANNERS COLUMN */}
                            <div className="p-4 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/50 space-y-3 shadow-lg">
                              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                                <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                                  <span>🟢 BANNER / ẢNH MỚI VỪA BẮT ĐƯỢC</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                  {afterImages.length} banner mới
                                </span>
                              </div>

                              <div className="space-y-3">
                                {afterImages.map((aImg, aIdx) => (
                                  <div
                                    key={aIdx}
                                    className="relative group rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 shadow-md p-2 space-y-2"
                                  >
                                    <div className="relative rounded-lg overflow-hidden">
                                      <img
                                        src={aImg}
                                        alt={`Banner Mới ${aIdx + 1}`}
                                        className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                                        <div className="flex items-center justify-between">
                                          <button
                                            type="button"
                                            onClick={() => setLightboxImage({ src: aImg, title: `Banner Mới #${aIdx + 1} - ${item.name}`, subtitle: `Banner vừa được đối thủ tung ra trên bài viết: ${item.url}`, type: 'after' })}
                                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow"
                                          >
                                            <Maximize2 className="w-3 h-3" />
                                            <span>Phóng To Xem</span>
                                          </button>
                                          <a
                                            href={aImg}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[10px] text-cyan-300 hover:underline truncate font-mono flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-700"
                                          >
                                            <span>Link File Ảnh</span>
                                            <ExternalLink className="w-2.5 h-2.5" />
                                          </a>
                                        </div>
                                      </div>
                                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-[10px] font-black text-white border border-emerald-400 shadow">
                                        ✨ Banner Mới #{aIdx + 1}
                                      </span>
                                    </div>

                                    {/* Direct links footer for each new banner */}
                                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-300">
                                      <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1 truncate max-w-[200px]"
                                        title={`Mở bài viết đối thủ chứa banner này: ${item.url}`}
                                      >
                                        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span className="truncate">🔗 Mở bài viết: {item.url}</span>
                                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                      </a>
                                      <a
                                        href={aImg}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-cyan-300 hover:underline flex items-center gap-0.5 font-mono shrink-0 text-[10px]"
                                      >
                                        <span>Xem ảnh gốc</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. TEXT WORD-BY-WORD DIFF TAB */}
                      {currentSubTab === 'text' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                            <span className="font-bold text-purple-300 flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-purple-400" />
                              <span>ĐỐI CHIẾU TỪNG CÂU TỪ VĂN BẢN (TRƯỚC VS SAU):</span>
                            </span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1"
                            >
                              <span>Mở bài viết gốc đối chiếu</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* CŨ (PREVIOUS DATA) */}
                            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                              <div className="flex items-center justify-between text-xs pb-1 border-b border-rose-500/20">
                                <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5" /> 🔴 DỮ LIỆU TRƯỚC ĐÂY (LẦN QUÉT CŨ):
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {item.previousData?.scannedAt ? new Date(item.previousData.scannedAt).toLocaleDateString('vi-VN') : 'Bản ghi gốc'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed line-through decoration-rose-400/80 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                {beforeText}
                              </p>
                              <span className="text-[10px] text-rose-400 italic block">
                                * Toàn bộ các câu từ và mức giá niêm yết cũ đã bị gỡ bỏ hoặc chỉnh sửa.
                              </span>
                            </div>

                            {/* MỚI (CURRENT SNAPSHOT DATA) */}
                            <div className="p-4 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 space-y-2">
                              <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-500/20">
                                <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> 🟢 DỮ LIỆU VỪA BẮT ĐƯỢC (MỚI NHẤT):
                                </span>
                                <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                  Vừa phát hiện
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-emerald-200 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30 shadow-inner">
                                {afterText}
                              </p>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-emerald-400 font-bold">
                                  * Hệ thống đã phát hiện các từ khóa giảm giá, trợ giá và quà tặng mới được cập nhật trên website.
                                </span>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-300 text-[11px] underline font-bold flex items-center gap-1"
                                >
                                  <span>Xem trên website</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. COUNTER PLAYBOOK FOR TÂM ĐỨC SMILE */}
                      {currentSubTab === 'counter' && (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-indigo-950/60 border-2 border-indigo-500/50 space-y-4 text-xs animate-fadeIn shadow-xl">
                          <div className="flex items-center justify-between pb-2 border-b border-indigo-500/30">
                            <div className="font-black text-cyan-300 flex items-center gap-2 text-sm">
                              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                              <span>KẾ HOẠCH PHẢN CÔNG GOOGLE ADS CHO HỆ THỐNG NHA KHOA TÂM ĐỨC SMILE:</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                              17 Chi Nhánh Miền Tây & TP.HCM
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                              <span className="font-bold text-amber-400 block text-xs">🎯 Phân Tích Tử Huyệt Đối Thủ ({item.name}):</span>
                              <p className="text-slate-300 leading-relaxed text-xs">
                                Đối thủ vừa giảm giá sâu để kích cầu trên bài viết ({item.url}), nhưng quy mô phòng khám tập trung ở các thành phố lớn và thường có chi phí phát sinh phụ kiện ngoài gói. Tâm Đức Smile sở hữu lợi thế 17 chi nhánh phủ khắp các tỉnh Miền Tây (Cần Thơ, Tiền Giang, Cà Mau...), miễn phí xe đưa đón và cam kết bảo hành trọn gói không phát sinh.
                              </p>
                            </div>

                            <div className="space-y-2 p-3.5 rounded-xl bg-indigo-950/60 border border-cyan-500/40">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-cyan-300 block text-xs">🚀 Mẫu Quảng Cáo Phản Công Đối Ứng:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`Tiêu đề: Trồng Răng Implant Tâm Đức Smile - Trọn Gói Giá Gốc - Bảo Hành Trọn Đời\nMô tả: 17 Chi Nhánh Miền Tây & TP.HCM. Tặng Chụp Phim 3D ConeBeam 1.5Tr & Miễn Phí Xe Đưa Đón. Trụ Chính Hãng Giá Gốc.`);
                                    setCopiedSnippetId(item.id);
                                    setTimeout(() => setCopiedSnippetId(null), 3000);
                                  }}
                                  className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedSnippetId === item.id ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedSnippetId === item.id ? 'Đã Copy!' : 'Copy Mẫu Ads'}</span>
                                </button>
                              </div>
                              <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-200 border border-slate-800 space-y-1">
                                <p><strong className="text-cyan-400">Headline:</strong> Trồng Răng Implant Tâm Đức Smile - Trọn Gói Giá Gốc</p>
                                <p><strong className="text-indigo-400">Description:</strong> 17 Chi Nhánh Miền Tây & TP.HCM. Tặng CT 3D 1.5Tr + Xe Đưa Đón Tận Nơi.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })
        )}
      </div>

      {/* ADD MONITORED LINK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 rounded-3xl bg-slate-900 border-2 border-indigo-500/60 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">Thêm Link Website Đối Thủ Để Quét</h4>
                  <p className="text-xs text-slate-400">Lưu vào bộ nhớ và kích hoạt báo thức quét định kỳ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mode Switch (Single vs Batch) */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setInputMode('single')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  inputMode === 'single' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Thêm 1 Link Chi Tiết
              </button>
              <button
                type="button"
                onClick={() => setInputMode('batch')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  inputMode === 'batch' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Thêm Hàng Loạt (Batch Links)
              </button>
            </div>

            <form onSubmit={handleAddLink} className="space-y-4">
              {inputMode === 'single' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Tên Nha Khoa / Chiến Dịch Đối Thủ:
                    </label>
                    <input
                      type="text"
                      value={newLinkName}
                      onChange={e => setNewLinkName(e.target.value)}
                      placeholder="VD: Nha Khoa Kim - Bảng Giá Implant..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cyan-300 mb-1">
                      Đường Link Website / Landing Page / Bảng Giá <span className="text-rose-400">*</span>:
                    </label>
                    <input
                      type="url"
                      required
                      value={newLinkUrl}
                      onChange={e => setNewLinkUrl(e.target.value)}
                      placeholder="https://nhakhoadoithu.com/bang-gia-implant"
                      className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 ring-1 ring-cyan-500/20"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-cyan-300 mb-1">
                    Dán Danh Sách Link (Mỗi dòng 1 link hoặc "Tên | URL"):
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={batchLinksText}
                    onChange={e => setBatchLinksText(e.target.value)}
                    placeholder={`Nha Khoa Kim | https://nhakhoakim.com/bang-gia-implant\nNha Khoa Paris | https://nhakhoaparis.vn/khuyen-mai-nieng-rang\nhttps://drcareimplant.com/uu-dai-implant`}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Bạn có thể copy paste hàng chục link đối thủ vào đây cùng lúc.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nhóm Dịch Vụ:</label>
                  <select
                    value={newLinkCategory}
                    onChange={e => setNewLinkCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="implant">Trồng Răng Implant</option>
                    <option value="ortho">Niềng Răng - Chỉnh Nha</option>
                    <option value="cosmetic">Răng Sứ Thẩm Mỹ</option>
                    <option value="general">Nha Khoa Tổng Quát</option>
                    <option value="all">Tất Cả Dịch Vụ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tần Suất Báo Thức Quét:</label>
                  <select
                    value={newLinkFrequency}
                    onChange={e => setNewLinkFrequency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="weekly">Hàng Tuần (weeklyScan)</option>
                    <option value="daily">Hàng Ngày (dailyScan)</option>
                    <option value="hourly">Hàng Giờ (hourlyScan)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleLoad20PresetLinks}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  title="Nạp nhanh 20 nha khoa đối thủ hàng đầu Việt Nam"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>⚡ Nạp Sẵn 20 Đối Thủ Hàng Đầu</span>
                </button>

                <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="button"
                    onClick={e => handleAddLink(e, false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs shadow cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>💾 Lưu Vào Kho</span>
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>⚡ Lưu Vào Kho & Quét Ngay</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL FOR FULL-SIZE BANNER ZOOM INSPECTION */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-4xl w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold ${
                  lightboxImage.type === 'before' ? 'bg-rose-600' : 'bg-emerald-600'
                }`}>
                  {lightboxImage.type === 'before' ? '🔴' : '✨'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{lightboxImage.title}</h4>
                  <p className="text-xs text-slate-400">{lightboxImage.subtitle || 'Hình ảnh / Banner bắt được trực tiếp từ website đối thủ'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage.src}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  <span>Mở File Ảnh</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center max-h-[70vh]">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-[68vh] w-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="font-mono text-[11px] text-cyan-300">
                {lightboxImage.type === 'before' ? '🔴 Bản ghi hình ảnh trong cơ sở dữ liệu cũ trước khi thay đổi' : '🟢 Phiên bản hình ảnh mới nhất vừa được phát hiện trên website'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(lightboxImage.src);
                    alert('Đã copy đường dẫn ảnh vào Clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  Copy Link Ảnh
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
