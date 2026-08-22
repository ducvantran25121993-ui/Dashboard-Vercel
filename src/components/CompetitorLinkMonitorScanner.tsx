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
  X
} from 'lucide-react';

export interface MonitoredSnapshot {
  text: string;
  images: string[];
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
    name: 'Nha Khoa Kim - Bảng Giá & Ưu Đãi Implant',
    url: 'https://nhakhoakim.com/bang-gia-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm nay, 08:30',
    changeMessage: '🖼️ Phát hiện 2 Banner/Hình ảnh mới được thay đổi!',
    newImagesCount: 2,
    textChanged: true,
    lastData: {
      text: 'Bảng Giá Trồng Răng Implant Trọn Gói Ưu Đãi Mới Nhất 2026. Trụ Implant Hàn Quốc giảm sốc 35% chỉ còn 8.900.000đ. Tặng kèm Abutment và Răng sứ Cercon. Hỗ trợ trả góp 0% qua thẻ tín dụng và CCCD.',
      images: [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80'
      ],
      scannedAt: new Date().toISOString()
    },
    previousData: {
      text: 'Bảng Giá Trồng Răng Implant Nha Khoa Kim. Trụ Implant Hàn Quốc giá 12.500.000đ chưa bao gồm Abutment. Bảo hành 5 năm.',
      images: [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80'
      ],
      scannedAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  },
  {
    id: 'link-2',
    name: 'Nha Khoa Paris - Lễ Hội Niềng Răng',
    url: 'https://nhakhoaparis.vn/khuyen-mai-nieng-rang',
    category: 'ortho',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm nay, 07:15',
    changeMessage: '📝 Phát hiện nội dung văn bản đã bị sửa đổi!',
    newImagesCount: 0,
    textChanged: true,
    lastData: {
      text: 'Lễ Hội Niềng Răng Paris 2026. Đồng giá niềng răng mắc cài kim loại chỉ 18.000.000đ trọn gói. Tặng gói tẩy trắng răng 2.500.000đ khi thanh toán trước. Miễn phí chụp phim CT ConeBeam 3D.',
      images: [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80'
      ],
      scannedAt: new Date().toISOString()
    },
    previousData: {
      text: 'Niềng Răng Nha Khoa Paris giảm 20% các gói niềng răng cao cấp. Trả góp 1 triệu/tháng.',
      images: [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80'
      ],
      scannedAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  },
  {
    id: 'link-3',
    name: 'Dr. Care Implant - Ưu Đãi Trồng Răng Người Cao Tuổi',
    url: 'https://drcareimplant.com/uu-dai-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm qua, 18:00',
    changeMessage: '🖼️ Phát hiện 1 Banner mới về gói trợ giá',
    newImagesCount: 1,
    textChanged: true,
    lastData: {
      text: 'Chương trình trợ giá trồng răng Implant cho người trung niên và cao tuổi. Trụ Thụy Sĩ Neodent trọn gói 19.500.000đ. Bảo hành trọn đời.',
      images: [
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-4',
    name: 'Nha Khoa Shark - Bọc Răng Sứ Thẩm Mỹ',
    url: 'https://nhakhoashark.vn/boc-rang-su',
    category: 'cosmetic',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm qua, 14:20',
    changeMessage: '📝 Bảng giá răng sứ vừa được cập nhật giảm 20%',
    newImagesCount: 0,
    textChanged: true,
    lastData: {
      text: 'Bọc răng sứ thẩm mỹ Nano Biotech bảo tồn tủy răng tối đa. Răng sứ Cercon HT giá 2.200.000đ/răng.',
      images: [
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-5',
    name: 'Nha Khoa I-DENT - Trồng Răng Implant Chuyên Sâu',
    url: 'https://nhakhoaident.com/trong-rang-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: 'Đã lưu vào kho - Dữ liệu ổn định',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Trồng răng Implant Pháp, Mỹ, Thụy Sĩ theo tiêu chuẩn Châu Âu. Bác sĩ Tiến sĩ Tuấn trực tiếp thực hiện.',
      images: ['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-6',
    name: 'Nha Khoa Parkway - Niềng Răng Trong Suốt Invisalign',
    url: 'https://nhakhoaparkway.com/invisalign',
    category: 'ortho',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét',
    changeMessage: '🖼️ Phát hiện banner giảm 25% gói niềng máng trong suốt',
    newImagesCount: 1,
    textChanged: true,
    lastData: {
      text: 'Top 1 chuyên sâu Invisalign Đông Nam Á. Trả góp 0% lãi suất từ 1.8 triệu/tháng.',
      images: ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-7',
    name: 'Elite Dental - Cấy Ghép Implant & Chỉnh Nha',
    url: 'https://elitedental.com.vn/dich-vu-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: 'Đã lưu vào kho - Dữ liệu ổn định',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Trung tâm Implant chuyên sâu với hơn 15 năm kinh nghiệm. Phục hình răng tức thì All-on-4.',
      images: ['https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-8',
    name: 'Peace Dentistry - Khuyến Mãi Bọc Răng Sứ',
    url: 'https://peacedentistry.com/khuyen-mai-rang-su',
    category: 'cosmetic',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét',
    changeMessage: '📝 Phát hiện điều chỉnh chương trình bảo hành 15 năm',
    newImagesCount: 0,
    textChanged: true,
    lastData: {
      text: 'Răng sứ Lava Plus & Zirconia chính hãng Đức. Tặng kèm gói vệ sinh cạo vôi răng trọn đời.',
      images: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-9',
    name: 'Nha Khoa ViDental - Viện Công Nghệ Nha Khoa',
    url: 'https://vidental.vn/dich-vu-nha-khoa',
    category: 'general',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: 'Đã lưu vào kho - Dữ liệu ổn định',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Hệ sinh thái Nha khoa Phức hợp chuẩn quốc tế ứng dụng công nghệ số và quét hàm iTero 5D.',
      images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-10',
    name: 'Nha Khoa Đông Nam - Bảng Giá Cấy Ghép Răng',
    url: 'https://nhakhoadongnam.com/bang-gia-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét',
    changeMessage: '🖼️ Phát hiện banner miễn phí khớp nối Abutment',
    newImagesCount: 1,
    textChanged: true,
    lastData: {
      text: 'Trồng răng Implant trọn gói miễn phí chi phí ghép xương và chụp CT Scanner 3D.',
      images: ['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-11',
    name: 'Bệnh Viện Răng Hàm Mặt Sài Gòn - Bảng Giá',
    url: 'https://benhvienranghammatsaigon.vn/bang-gia-chi-tiet',
    category: 'general',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: 'Đã lưu vào kho - Dữ liệu ổn định',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Bệnh viện chuyên khoa tư nhân Răng Hàm Mặt đầu tiên tại TP.HCM. Bảng giá công khai minh bạch.',
      images: ['https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-12',
    name: 'Nha Khoa Trồng Răng Sài Gòn - Trợ Giá Trụ',
    url: 'https://nhakhoatrongrang.com/uu-dai-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét',
    changeMessage: '📝 Phát hiện giảm thêm 30% cho khách hàng trên 50 tuổi',
    newImagesCount: 0,
    textChanged: true,
    lastData: {
      text: 'Chuyên khoa Cấy ghép Implant - Trồng răng không đau cho người lớn tuổi. Miễn phí gói xét nghiệm máu.',
      images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-13',
    name: 'Nha Khoa Lan Anh - Thẩm Mỹ Nụ Cười',
    url: 'https://nhakhoalananh.com/chinh-nha-nieng-rang',
    category: 'ortho',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: 'Đã lưu vào kho - Dữ liệu ổn định',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha khoa thành lập từ 1980 với uy tín lâu năm tại khu vực Phú Mỹ Hưng và Quận 2.',
      images: ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-14',
    name: 'Nha Khoa Daisy - Bảng Giá Chuẩn Châu Âu',
    url: 'https://nhakhoadaisy.vn/bang-gia-dich-vu',
    category: 'general',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: 'Đã lưu vào kho - Dữ liệu ổn định',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Hệ thống nha khoa tiêu chuẩn Châu Âu, môi trường điều trị 1 khách hàng - 1 bác sĩ - 1 phòng điều trị.',
      images: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-15',
    name: 'Nha Khoa Anna - Răng Sứ Thẩm Mỹ Cao Cấp',
    url: 'https://nhakhoaanna.com/rang-su-tham-my',
    category: 'cosmetic',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét',
    changeMessage: '🖼️ Cập nhật mẫu dáng răng sứ phong thủy mới',
    newImagesCount: 2,
    textChanged: true,
    lastData: {
      text: 'Dẫn đầu xu hướng thiết kế nụ cười Smile Design cá nhân hóa kết hợp dáng răng phong thủy tài lộc.',
      images: ['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-16',
    name: 'Nha Khoa Quốc Tế Nevada - Bọc Răng Sứ',
    url: 'https://nhakhoanevada.com/boc-rang-su-nano',
    category: 'cosmetic',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: 'Đã lưu vào kho - Dữ liệu ổn định',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Công nghệ bọc răng sứ Nano Shining 5S không mài nhỏ răng, bảo tồn răng gốc tối đa.',
      images: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-17',
    name: 'Nha Khoa Thúy Đức - Chuyên Sâu Niềng Răng Damon',
    url: 'https://nhakhoathuyduc.com.vn/nieng-rang-damon',
    category: 'ortho',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét',
    changeMessage: '📝 Cập nhật chính sách niềng răng không nhổ răng F.A.C.E',
    newImagesCount: 0,
    textChanged: true,
    lastData: {
      text: 'Bác sĩ Đức - Chuyên gia chỉnh nha thứ hạng Diamond Invisalign và niềng răng mắc cài thông minh Damon.',
      images: ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-18',
    name: 'Nha Khoa Singae - Trồng Răng SSI Chuẩn Singapore',
    url: 'https://singae.vn/bang-gia-implant-ssi',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: 'Đã lưu vào kho - Dữ liệu ổn định',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Kỹ thuật trồng răng SSI độc quyền từ Singapore giúp gắn trụ và lắp răng hoàn tất trong 48h.',
      images: ['https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-19',
    name: 'Nha Khoa Flora - Trồng Răng Êm Ái Chuẩn Thụy Sĩ',
    url: 'https://floraclinic.vn/implant-thuy-si-em-ai',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Vừa quét',
    changeMessage: 'Đã lưu vào kho - Dữ liệu ổn định',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Phòng khám phong cách êm dịu, sử dụng hệ thống kiểm soát cơn đau chuẩn quốc tế và trụ Straumann.',
      images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80'],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-20',
    name: 'Nha Khoa Lạc Việt Intech - Niềng Răng X-Matrix',
    url: 'https://lacvietintech.vn/bang-gia-nieng-rang',
    category: 'ortho',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét',
    changeMessage: '🖼️ Phát hiện banner giảm 35% chào hè',
    newImagesCount: 1,
    textChanged: true,
    lastData: {
      text: 'Công nghệ niềng răng cá nhân hóa X-Matrix biết trước kết quả điều trị sau 3 ngày thăm khám.',
      images: ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80'],
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
        return JSON.parse(saved);
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
  const [autoScanEnabled, setAutoScanEnabled] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(300); // 5 minutes periodic mock
  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);
  const [showSavedLinksManager, setShowSavedLinksManager] = useState<boolean>(false);
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

  // Periodic Timer simulating chrome.alarms ("weeklyScan" / auto background runner)
  useEffect(() => {
    if (!autoScanEnabled) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          performAutoScan();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoScanEnabled]);

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
        // Fallback local regex scanning simulation
        runLocalRegexScanAll(listToScan);
      }
    } catch (err) {
      console.warn('Network error in auto scan, running local regex engine:', err);
      runLocalRegexScanAll(listToScan);
    } finally {
      setIsScanningAll(false);
    }
  };

  // Local fallback scanning engine following user's regex code
  const runLocalRegexScanAll = (targetList?: MonitoredLink[]) => {
    const listToScan = targetList || monitoredLinksRef.current;
    setMonitoredLinks(prevList => {
      const updated = prevList.map(item => {
        const isInScan = listToScan.some(t => t.id === item.id);
        if (!isInScan) return item;

        const isChanged = Math.random() > 0.4;
        if (isChanged) {
          const mockNewImages = [
            'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80'
          ];
          const newSnapshot: MonitoredSnapshot = {
            text: `[Cập nhật mới ${new Date().toLocaleTimeString()}] ${item.name} vừa tung chương trình giảm thêm 20% và tặng quà trải nghiệm miễn phí khi đăng ký trực tuyến.`,
            images: mockNewImages,
            scannedAt: new Date().toISOString()
          };

          const message = mockNewImages.length > 0
            ? `🖼️ Phát hiện ${mockNewImages.length} Banner/Hình ảnh mới được thay đổi!`
            : `📝 Phát hiện nội dung văn bản đã bị sửa đổi!`;

          triggerNotification(item.url, item.name, message, mockNewImages, newSnapshot.text);

          return {
            ...item,
            status: 'Changed' as const,
            lastScanTime: 'Vừa xong (' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ')',
            changeMessage: message,
            previousData: item.lastData,
            lastData: newSnapshot,
            newImagesCount: mockNewImages.length,
            textChanged: true
          };
        } else {
          return {
            ...item,
            status: 'Unchanged' as const,
            lastScanTime: 'Vừa xong (' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ')',
            changeMessage: 'Chưa có thay đổi mới so với lần quét trước'
          };
        }
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
      } else {
        // Fallback simulation
        setTimeout(() => {
          const mockImages = [
            'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80'
          ];
          const newSnapshot: MonitoredSnapshot = {
            text: `[Vừa cập nhật] ${link.name} điều chỉnh giá dịch vụ và chính sách ưu đãi kèm quà tặng trị giá 2.000.000đ.`,
            images: mockImages,
            scannedAt: new Date().toISOString()
          };

          const message = `🖼️ Phát hiện 1 Banner/Hình ảnh mới được thay đổi!`;
          triggerNotification(link.url, link.name, message, mockImages, newSnapshot.text);

          setMonitoredLinks(prev => {
            const next = prev.map(l => l.id === linkId ? {
              ...l,
              status: 'Changed',
              lastScanTime: 'Vừa xong',
              changeMessage: message,
              previousData: l.lastData,
              lastData: newSnapshot,
              newImagesCount: 1,
              textChanged: true
            } : l);
            monitoredLinksRef.current = next;
            localStorage.setItem('tamduc_monitored_links', JSON.stringify(next));
            return next;
          });
        }, 800);
      }
    } catch (err) {
      console.warn('Error scanning single link:', err);
    } finally {
      setTimeout(() => setScanningLinkId(null), 1000);
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
                  HỆ THỐNG QUÉT & LƯU LINK ĐỐI THỦ (AUTO DIFF & BANNER SCANNER)
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
            <div>
              <div className="text-[11px] text-cyan-300 font-bold flex items-center gap-1">
                <span>Báo Thức Định Kỳ</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-900/60 text-[9px] text-cyan-300">weeklyScan</span>
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tự quét lại sau: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoScanEnabled(!autoScanEnabled)}
              title={autoScanEnabled ? 'Tạm dừng báo thức quét ngầm' : 'Kích hoạt báo thức quét ngầm'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
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
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* CŨ (PREVIOUS DATA) */}
                      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs pb-1 border-b border-rose-500/20">
                          <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> Dữ Liệu Trước Đây (Lần Quét Cũ):
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.previousData?.scannedAt ? new Date(item.previousData.scannedAt).toLocaleDateString('vi-VN') : 'Ban đầu'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed line-through decoration-rose-400/70">
                          {item.previousData?.text || 'Không có bản ghi cũ'}
                        </p>
                      </div>

                      {/* MỚI (CURRENT SNAPSHOT DATA) */}
                      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                        <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-500/20">
                          <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> Dữ Liệu Vừa Bắt Được (Mới Nhất):
                          </span>
                          <span className="text-[10px] text-emerald-300 font-mono font-bold">
                            Vừa phát hiện
                          </span>
                        </div>
                        <p className="text-xs font-bold text-emerald-200 leading-relaxed">
                          {item.lastData?.text || 'Đang chờ quét...'}
                        </p>
                      </div>
                    </div>

                    {/* DETECTED BANNER IMAGES GALLERY (REGEX CAPTURED) */}
                    {item.lastData?.images && item.lastData.images.length > 0 && (
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Hình Ảnh & Banner Bắt Được Qua Regex ({item.lastData.images.length} ảnh):
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Đã lọc sạch icon & logo
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {item.lastData.images.map((imgSrc, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950"
                            >
                              <img
                                src={imgSrc}
                                alt={`Banner ${imgIdx + 1}`}
                                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                                <a
                                  href={imgSrc}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-cyan-300 hover:underline truncate font-mono flex items-center gap-1"
                                >
                                  <span>Xem ảnh gốc</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-white border border-slate-700">
                                Banner #{imgIdx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* RECOMMENDED COUNTER STRATEGY */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 space-y-2 text-xs">
                      <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span>Đề Xuất Hành Động Phản Công Cho Tâm Đức Smile:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Đối thủ đang đẩy mạnh điều chỉnh ưu đãi trên trang này. Khuyến nghị Phòng Marketing Tâm Đức Smile cập nhật mẫu quảng cáo Google Ads với thông điệp: <strong>"Bảo hành trọn gói minh bạch, tặng chụp phim 3D ConeBeam 1.5Tr và miễn phí xe đưa đón khách tỉnh"</strong> để chặn phễu tìm kiếm khách hàng.
                      </p>
                    </div>
                  </div>
                )}
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
    </div>
  );
};
