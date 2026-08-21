export interface TransparencyAdItem {
  id: string;
  advertiserName: string;
  legalEntity: string;
  domain: string;
  isVerified: boolean;
  format: 'video' | 'text' | 'image';
  platform: 'Google Search' | 'YouTube' | 'Google Display Network' | 'Performance Max';
  firstSeen: string;
  lastSeen: string;
  category: 'implant' | 'ortho' | 'porcelain' | 'general';
  
  // Media / Visual Ad Configuration
  visual?: {
    theme: 'navy_gold' | 'harvard_gold' | 'clinic_blue' | 'invisalign_cyan' | 'flag_us' | 'white_clean' | 'dark_luxury';
    brandLogoText?: string;
    subBadgeText?: string;
    topBadgeText?: string;
    headlineMain: string;
    subHeadline?: string;
    highlightPill?: string;
    photoType?: 'harvard_group' | 'doctor_guide' | 'aligner_girl' | 'viet_kieu_smile' | 'big4_trust' | 'surgery_room' | 'senior_couple' | 'porcelain_smile';
    duration?: string;
    imageUrl?: string;
  };

  // Search Text Ad Configuration
  searchAd?: {
    displayDomain: string;
    path: string;
    headline: string;
    description: string;
    sitelinks: string[];
    callouts: string[];
  };

  // AI Spy & Counter Strategy for Tâm Đức Smile
  intel: {
    campaignGoal: string;
    psychologicalHook: string;
    targetAudience: string;
    estimatedDailySpend: string;
    competitorWeakness: string;
    counterAdTemplate: {
      headline: string;
      description: string;
      sitelinks: string[];
      biddingAdvice: string;
      uniqueSellingPoint: string;
    };
  };
}

export interface TransparencyDomainProfile {
  domain: string;
  brandName: string;
  legalEntity: string;
  approxActiveAds: number;
  isVerified: boolean;
  description: string;
  primaryServices: string[];
  ads: TransparencyAdItem[];
}

export const TRANSPARENCY_DOMAINS_DATA: Record<string, TransparencyDomainProfile> = {
  'nhakhoakim.com': {
    domain: 'nhakhoakim.com',
    brandName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    approxActiveAds: 200,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Trồng Răng Implant Máng Định Vị', 'Niềng Răng Invisalign', 'Bọc Răng Sứ Thẩm Mỹ', 'Tẩy Trắng Răng Laser'],
    ads: [
      // 1. BIG 4 KIỂM CHỨNG (Video Card 1 in screenshot)
      {
        id: 'kim-ad-1',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '10/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'general',
        visual: {
          theme: 'navy_gold',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'CHUẨN QUỐC TẾ',
          headlineMain: 'BIG 4 KIỂM CHỨNG QUẢN TRỊ NHA KHOA KIM',
          subBadgeText: 'Deloitte • EY • PwC • KPMG',
          highlightPill: 'Quản Trị Minh Bạch',
          photoType: 'big4_trust',
          duration: '0:30',
          imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Xây dựng uy tín tối thượng, khẳng định vị thế chuỗi nha khoa đạt chuẩn kiểm toán quốc tế.',
          psychologicalHook: 'Đòn bẩy tâm lý "Big 4" - tạo cảm giác an tâm tuyệt đối về chất lượng và tính minh bạch tài chính/vận hành.',
          targetAudience: 'Khách hàng trung lưu, người có thu nhập cao và khách hàng kỹ tính tại TP.HCM & Hà Nội.',
          estimatedDailySpend: '15.000.000 đ/ngày (YouTube & PMax)',
          competitorWeakness: 'Đánh bóng thương hiệu quá mức nhưng chi phí vận hành lớn khiến bảng giá dịch vụ luôn cao hơn 25-40% so với thị trường.',
          counterAdTemplate: {
            headline: 'Nha Khoa Tâm Đức Smile - Trực Tiếp Bác Sĩ CKI Điều Trị Không Qua Trung Gian',
            description: '17 chi nhánh TP.HCM & Miền Tây. Cam kết bảng giá niêm yết trọn gói 100%, không phụ phí. Hơn 100.000 nụ cười tin chọn.',
            sitelinks: ['Bảng Giá Gốc 2026', '17 Chi Nhánh Gần Bạn', 'Bác Sĩ CKI Khám 0đ', 'Xem Khách Hàng Thực Tế'],
            biddingAdvice: 'Nhắm từ khóa thương hiệu "nha khoa kim uy tín" và nhấn mạnh "Giá Gốc Trọn Gói - Bác Sĩ Trực Tiếp".',
            uniqueSellingPoint: 'Chi phí hợp lý, tiết kiệm hơn 30% với chất lượng điều trị tương đương và phủ rộng khắp miền Tây.'
          }
        }
      },

      // 2. HARVARD BUSINESS SCHOOL (Video Card 2 in screenshot)
      {
        id: 'kim-ad-2',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '15/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'general',
        visual: {
          theme: 'harvard_gold',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'ĐẠI HỌC HARVARD',
          headlineMain: 'NHA KHOA KIM & HARVARD - NÂNG CHUẨN ĐIỀU TRỊ NHA KHOA',
          subHeadline: 'Case Study Được Giảng Dạy Tại Harvard Business School',
          highlightPill: 'Harvard Business School',
          photoType: 'harvard_group',
          duration: '0:45',
          imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Định vị Nha Khoa Kim là nha khoa duy nhất tại VN được Harvard đưa vào tài liệu giảng dạy nghiên cứu điển hình.',
          psychologicalHook: 'Hiệu ứng hào quang (Halo Effect) từ thương hiệu Harvard để bán các gói dịch vụ giá cao.',
          targetAudience: 'Giới trí thức, doanh nhân, kiều bào và người có yêu cầu khắt khe về tiêu chuẩn điều trị.',
          estimatedDailySpend: '18.000.000 đ/ngày',
          competitorWeakness: 'Harvard chỉ nghiên cứu về mô hình kinh doanh chuỗi (chuỗi nhượng quyền / nhân bản), không phản ánh tay nghề từng bác sĩ tại chi nhánh lẻ.',
          counterAdTemplate: {
            headline: 'Tâm Đức Smile - Đội Ngũ Bác Sĩ CKI Tốt Nghiệp ĐH Y Dược Hơn 15 Năm Kinh Nghiệm',
            description: 'Điều trị tận tâm, 1 Bác sĩ theo sát 1 Bệnh nhân từ đầu đến cuối. Trang thiết bị Đức & Thụy Sĩ chuẩn y khoa.',
            sitelinks: ['Hồ Sơ Bác Sĩ CKI', 'Bảng Giá Trọn Gói', 'Cam Kết Bằng Văn Bản', 'Tư Vấn Miễn Phí'],
            biddingAdvice: 'Đánh mạnh vào yếu tố "Bác sĩ trực tiếp làm từ A-Z, không chuyển giao cho phụ tá".',
            uniqueSellingPoint: 'Chăm sóc 1:1 tận tụy, cam kết chất lượng trực tiếp từ bác sĩ chuyên khoa I.'
          }
        }
      },

      // 3. QUY TRÌNH IMPLANT 2 LẦN HẸN (Video Card 3 in screenshot)
      {
        id: 'kim-ad-3',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '05/02/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'clinic_blue',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'CÔNG NGHỆ MÁNG ĐỊNH VỊ',
          headlineMain: 'QUY TRÌNH TRỒNG IMPLANT CHỈ 2 LẦN HẸN - MÁNG ĐỊNH VỊ',
          subHeadline: 'Lần 1: Chụp CT 3D & Scan răng • Lần 2: Cắm trụ & Phục hình',
          highlightPill: 'Không Đau - Nhanh Chóng',
          photoType: 'doctor_guide',
          duration: '0:40',
          imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Giải tỏa nỗi sợ tốn thời gian và đau đớn cho người bận rộn khi trồng răng Implant.',
          psychologicalHook: 'Cam kết cụ thể về số lần hẹn "Chỉ 2 lần" giúp khách hàng cảm thấy việc trồng răng rất nhanh và nhẹ nhàng.',
          targetAudience: 'Người trung niên mất răng, doanh nhân bận rộn, khách hàng ở xa hoặc Việt kiều về nước ngắn ngày.',
          estimatedDailySpend: '20.000.000 đ/ngày',
          competitorWeakness: 'Máng định vị bị tính thêm phí từ 3-5 triệu ngoài tiền trụ, ca tiêu xương nặng vẫn phải ghép xương nhiều lần.',
          counterAdTemplate: {
            headline: 'Trồng Răng Implant Tâm Đức Smile - Ăn Nhai Sau 48H Miễn Phí Máng Phẫu Thuật 3D',
            description: 'Tặng trọn bộ Chụp CT ConeBeam 3D + Máng định vị 3.5Tr. Trụ Implant chính hãng chỉ từ 9.9Tr trọn gói.',
            sitelinks: ['Trọn Gói 9.9Tr', 'Miễn Phí Máng 3D', 'Bảo Hành Trọn Đời', 'Đưa Đón Miễn Phí'],
            biddingAdvice: 'Đấu thầu từ khóa "trồng răng implant nhanh không đau" và đẩy mạnh sitelink "Miễn Phí Máng Định Vị".',
            uniqueSellingPoint: 'Tặng kèm miễn phí máng hướng dẫn phẫu thuật 3D và bảo hành chính hãng trọn đời.'
          }
        }
      },

      // 4. BẢNG GIÁ NHA KHOA 2025 / 2026 (Search Text Ad Card 4 in screenshot)
      {
        id: 'kim-ad-4',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'text',
        platform: 'Google Search',
        firstSeen: '01/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'general',
        searchAd: {
          displayDomain: 'nhakhoakim.com',
          path: 'www.nhakhoakim.com/',
          headline: 'Bảng Giá Nha Khoa 2025 - Nha Khoa Quận Đống Đa Uy Tín',
          description: '100% KH được điều trị bởi Bác sĩ có chuyên môn và năng lực, đầy đủ bằng cấp, chứng chỉ. Đối tác toàn cầu của Đại học Harvard, đạt chất lượng ISO 9001:2015 Anh Quốc và...',
          sitelinks: [
            'Bảng Giá Nha Khoa 2025',
            'Đội Ngũ 200+ Bác Sĩ Giỏi',
            'Dịch Vụ Chăm Sóc Chu Đáo',
            'An Toàn Trong Điều Trị'
          ],
          callouts: ['ISO 9001:2015', 'Đối Tác Harvard', 'Bác Sĩ Giỏi']
        },
        intel: {
          campaignGoal: 'Đón trọn lưu lượng tìm kiếm từ khóa "bảng giá nha khoa" và định hướng người dùng vào trang danh mục.',
          psychologicalHook: 'Từ khóa "Bảng giá 2025/2026" đánh trúng tâm lý so sánh chi phí trước khi đến khám.',
          targetAudience: 'Người dùng Google Search đang trong giai đoạn so sánh giá và tìm phòng khám uy tín.',
          estimatedDailySpend: '12.000.000 đ/ngày',
          competitorWeakness: 'Bảng giá trên web của Kim thường là "giá từ" chưa gồm chi phí phát sinh phụ kiện.',
          counterAdTemplate: {
            headline: 'Bảng Giá Nha Khoa Tâm Đức Smile 2026 - Niêm Yết Trọn Gói Cam Kết Không Phát Sinh',
            description: 'Trồng răng Implant từ 9.9Tr, Răng sứ chỉ 1.2Tr/răng, Niềng răng trả góp 800k/tháng. Miễn phí khám & chụp phim 3D.',
            sitelinks: ['Bảng Giá Chi Tiết 2026', 'Ưu Đãi Hôm Nay', '17 Chi Nhánh', 'Đặt Hẹn Giảm Thêm 10%'],
            biddingAdvice: 'Đặt Top 1 Google Search cho các từ khóa "bảng giá nha khoa tâm đức smile" và "bảng giá nha khoa tphcm".',
            uniqueSellingPoint: 'Bảng giá cam kết trọn gói minh bạch 100%, không phí ẩn.'
          }
        }
      },

      // 5. INVISALIGN ĐỪNG CHỈ NHẬN KHAY (Video Card 5 in screenshot)
      {
        id: 'kim-ad-5',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '12/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'ortho',
        visual: {
          theme: 'invisalign_cyan',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'INVISALIGN TOP TIER',
          headlineMain: 'INVISALIGN - ĐỪNG CHỈ NHẬN KHAY HÃY NHẬN KẾT QUẢ',
          subHeadline: 'Bác Sĩ Chuyên Chỉnh Nha Lên Phác Đồ 3D ClinCheck Chuẩn Xác',
          highlightPill: 'Kết Quả Thật',
          photoType: 'aligner_girl',
          duration: '0:35',
          imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Tập trung vào giá trị phác đồ bác sĩ thay vì chỉ bán khay niềng, nhằm chốt hợp đồng Invisalign giá cao (80-120Tr).',
          psychologicalHook: 'Nhắc nhở khách hàng rằng khay chỉ là công cụ, tay nghề bác sĩ mới quyết định kết quả gương mặt.',
          targetAudience: 'Nữ giới 20-35 tuổi, nhân viên văn phòng, người làm nghề giao tiếp nhiều tại TP.HCM & Hà Nội.',
          estimatedDailySpend: '16.000.000 đ/ngày',
          competitorWeakness: 'Giá gói Invisalign tại Kim thường cao hơn 15-20 triệu so với các nha khoa khác cùng hạng khay.',
          counterAdTemplate: {
            headline: 'Niềng Răng Trong Suốt Invisalign Tâm Đức Smile - Trả Góp 0% Tặng Gói Tẩy Trắng 3Tr',
            description: 'Bác sĩ hạng Platinum Invisalign trực tiếp điều trị. Quét dấu răng iTero 5D thấy trước nụ cười sau 60 giây.',
            sitelinks: ['Gói Invisalign Ưu Đãi', 'Quét iTero 5D Miễn Phí', 'Trả Góp 2Tr/Tháng', 'Hình Ảnh Khách Hàng'],
            biddingAdvice: 'Nhắm từ khóa "niềng răng invisalign trả góp" và hiển thị ưu đãi tặng tẩy trắng răng 3 triệu.',
            uniqueSellingPoint: 'Bác sĩ hạng Platinum, miễn phí quét 3D iTero 5D và hỗ trợ trả góp 0% lãi suất.'
          }
        }
      },

      // 6. TỪ MỸ TRỞ VỀ TRỒNG RĂNG TOÀN HÀM (Video Card 6 in screenshot)
      {
        id: 'kim-ad-6',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '20/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'flag_us',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'VIỆT KIỀU MỸ TIN CHỌN',
          headlineMain: 'TỪ MỸ TRỞ VỀ TRỒNG RĂNG TOÀN HÀM - 2 NGÀY CÓ HÀM TẠM',
          subHeadline: 'Khách Hàng Việt Kiều Mỹ Chia Sẻ Hành Trình Lấy Lại Nụ Cười',
          highlightPill: '2 Ngày Có Hàm Tạm',
          photoType: 'viet_kieu_smile',
          duration: '0:50',
          imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Thu hút kiều bào Mỹ, Úc, Canada về nước làm răng với dịch vụ toàn hàm All-on-4 / All-on-6.',
          psychologicalHook: 'Đánh vào yếu tố tốc độ "2 ngày có hàm tạm" để kiều bào tranh thủ kỳ nghỉ ngắn ngày tại Việt Nam.',
          targetAudience: 'Việt kiều Mỹ, Úc, Châu Âu về thăm quê hương và người thân ở Việt Nam giới thiệu.',
          estimatedDailySpend: '22.000.000 đ/ngày',
          competitorWeakness: 'Chi phí toàn hàm tại Kim vẫn ở mức cao so với mặt bằng chung và không có chính sách hỗ trợ đưa đón sân bay tận nơi.',
          counterAdTemplate: {
            headline: 'Trồng Răng Toàn Hàm Cho Việt Kiều Tâm Đức Smile - Trọn Gói Tiết Kiệm Đến 70% So Với Mỹ',
            description: 'Có răng tạm sau 24h. Bảo hành quốc tế trọn đời. Hỗ trợ xe đưa đón sân bay Tân Sơn Nhất & khách sạn nghỉ dưỡng.',
            sitelinks: ['Gói Kiều Bào Trọn Gói', 'Xe Đưa Đón Sân Bay', 'Ăn Nhai Trong 24H', 'Tư Vấn Online 24/7'],
            biddingAdvice: 'Chạy chiến dịch nhắm đối tượng có người thân ở nước ngoài hoặc truy cập từ IP US/AU/CA.',
            uniqueSellingPoint: 'Dịch vụ chuẩn VIP đưa đón sân bay, khách sạn, hoàn tất phục hình trong thời gian ngắn nhất.'
          }
        }
      },

      // 7. BẢNG GIÁ NHA KHOA KIM 2026 (Search Text Ad Card 7 in screenshot)
      {
        id: 'kim-ad-7',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'text',
        platform: 'Google Search',
        firstSeen: '15/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'general',
        searchAd: {
          displayDomain: 'nhakhoakim.com',
          path: 'www.nhakhoakim.com/dia-chi/phong-kham',
          headline: 'Bảng Giá Nha Khoa Kim 2026 - An Toàn-Tận Tâm-Thẩm Mỹ Cao',
          description: '100% KH được điều trị bởi Bác sĩ giỏi chuyên môn và năng lực, đầy đủ bằng cấp, chứng chỉ. Chuỗi Nha khoa chiếm trọn 14 vị trí đầu...',
          sitelinks: [
            'Bảng Giá Nha Khoa 2026',
            'An Toàn Trong Điều Trị',
            'Chi Nhánh Gần Bạn Nhất'
          ],
          callouts: ['14 Chi Nhánh', 'Bác Sĩ Giỏi', 'Bảo Hành Uy Tín']
        },
        intel: {
          campaignGoal: 'Bảo vệ thương hiệu và đón đầu khách hàng tìm kiếm bảng giá năm mới 2026.',
          psychologicalHook: 'Cam kết An Toàn - Tận Tâm - Thẩm Mỹ Cao để xóa bỏ sự e ngại về chất lượng dịch vụ.',
          targetAudience: 'Khách hàng có nhu cầu chăm sóc răng miệng tổng quát và thẩm mỹ.',
          estimatedDailySpend: '10.000.000 đ/ngày',
          competitorWeakness: 'Độ phủ tại các tỉnh Tây Nam Bộ còn hạn chế so với chuỗi 17 chi nhánh của Tâm Đức Smile.',
          counterAdTemplate: {
            headline: 'Nha Khoa Tâm Đức Smile 2026 - Hệ Thống 17 Chi Nhánh Uy Tín TP.HCM & Miền Tây',
            description: 'Khám & Chụp X-Quang 3D miễn phí 100%. Trợ giá Implant & Răng sứ lên đến 40%. Đội ngũ bác sĩ CKI hàng đầu.',
            sitelinks: ['Bảng Giá Mới 2026', 'Chi Nhánh Gần Bạn', 'Nhận Ưu Đãi 40%', 'Đặt Lịch Khám 0đ'],
            biddingAdvice: 'Tối ưu thầu cho các khu vực TP.HCM, Cần Thơ, Tiền Giang, Bến Tre, Vĩnh Long.',
            uniqueSellingPoint: 'Hệ thống 17 phòng khám hiện đại phủ khắp miền Nam, thuận tiện đi lại và bảo hành trọn đời.'
          }
        }
      },

      // 8. TRỒNG IMPLANT 15 PHÚT (Video Card 8 in screenshot)
      {
        id: 'kim-ad-8',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '25/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'white_clean',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'CÔNG NGHỆ SIÊU ÂM',
          headlineMain: 'TRỒNG IMPLANT CHỈ TRONG 15 PHÚT - KHÔNG SƯNG ĐAU',
          subHeadline: 'Nhẹ Nhàng Như Nhổ Một Chiếc Răng - Ăn Nhai Vững Chắc',
          highlightPill: '15 Phút Cấy Xong Trụ',
          photoType: 'surgery_room',
          duration: '0:30',
          imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Đánh sập rào cản sợ đau của khách hàng mất răng bằng con số "15 phút".',
          psychologicalHook: 'Thời gian thực hiện cực ngắn tạo cảm giác phẫu thuật rất nhẹ nhàng và an toàn.',
          targetAudience: 'Khách hàng sợ đau, người lớn tuổi ngần ngại làm phẫu thuật.',
          estimatedDailySpend: '14.000.000 đ/ngày',
          competitorWeakness: '15 phút chỉ áp dụng cho xương chuẩn, nếu cần nâng xoang/ghép xương thời gian sẽ kéo dài hơn.',
          counterAdTemplate: {
            headline: 'Cấy Ghép Implant Không Đau Tâm Đức Smile - Công Nghệ Siêu Âm Piezotome Thế Hệ Mới',
            description: 'Phục hồi nhanh gấp 3 lần, lành thương ngay sau 24h. Bác sĩ CKI cấy ghép êm ái, nhẹ nhàng. Tặng gói chụp phim 3D.',
            sitelinks: ['Quy Trình Không Đau', 'Bác Sĩ CKI Trực Tiếp', 'Ưu Đãi Implant 9.9Tr', 'Feedback Bệnh Nhân'],
            biddingAdvice: 'Đẩy mạnh mẫu quảng cáo tập trung vào "Công nghệ Piezotome không đau - Lành thương 24h".',
            uniqueSellingPoint: 'Công nghệ sóng siêu âm lành thương nhanh, bảo tồn tối đa cấu trúc xương hàm.'
          }
        }
      },

      // 9. MÔI TRƯỜNG VÔ TRÙNG KHÉP KÍN (Video Card 9 in screenshot)
      {
        id: 'kim-ad-9',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '18/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'general',
        visual: {
          theme: 'clinic_blue',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'CHUẨN BỘ Y TẾ',
          headlineMain: 'MÔI TRƯỜNG VÔ TRÙNG KHÉP KÍN ĐẠT CHUẨN ISO & BỘ Y TẾ',
          subHeadline: '1 Bệnh Nhân - 1 Bộ Dụng Cụ Riêng Biệt - 1 Phòng Điều Trị',
          highlightPill: 'Vô Trùng Tuyệt Đối',
          photoType: 'surgery_room',
          duration: '0:25',
          imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Tạo dựng niềm tin về an toàn vệ sinh dịch tễ và tránh lây nhiễm chéo.',
          psychologicalHook: 'Yếu tố vô trùng luôn là tiêu chí hàng đầu của người tiêu dùng sau các mùa dịch bệnh.',
          targetAudience: 'Người tiêu dùng kỹ tính, người già và gia đình.',
          estimatedDailySpend: '8.000.000 đ/ngày',
          competitorWeakness: 'Các nha khoa chuyên sâu khác đều đạt tiêu chuẩn vô trùng này nhưng Kim biến nó thành công cụ PR độc quyền.',
          counterAdTemplate: {
            headline: 'Hệ Thống Vô Trùng Chuẩn Châu Âu Tâm Đức Smile - 1 Bộ Khay Dụng Cụ Riêng Biệt',
            description: 'Phòng phẫu thuật cấy ghép áp lực dương. Đảm bảo an toàn 100% không lây nhiễm chéo. Cam kết sức khỏe trọn đời.',
            sitelinks: ['Chuẩn Vô Trùng Đức', 'Phòng Phẫu Thuật VIP', 'Bác Sĩ CKI', 'Đặt Hẹn Khám'],
            biddingAdvice: 'Nhắm từ khóa "nha khoa an toàn vô trùng tphcm".',
            uniqueSellingPoint: 'Phòng mổ áp lực dương và hệ thống tiệt trùng Autoclave Class B chuẩn Đức.'
          }
        }
      },

      // 10. IMPLANT TOÀN HÀM ALL ON 4 / 6 (Video Card 10 in screenshot)
      {
        id: 'kim-ad-10',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '22/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'dark_luxury',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'CHUYÊN GIA PHỤC HÌNH',
          headlineMain: 'IMPLANT TOÀN HÀM ALL-ON-4 / ALL-ON-6 - ĂN NHAI TRỌN VẸN',
          subHeadline: 'Giải Pháp Tối Ưu Cho Người Mất Răng Toàn Bộ Cả 2 Hàm',
          highlightPill: 'Ăn Nhai Chắc Khỏe',
          photoType: 'senior_couple',
          duration: '0:45',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Đẩy mạnh gói dịch vụ có giá trị đơn hàng cao nhất (100 - 250 triệu).',
          psychologicalHook: 'Khôi phục khả năng ăn nhai và cải thiện khuôn mặt trẻ lại 10 tuổi cho người cao tuổi.',
          targetAudience: 'Người mất răng toàn hàm trên 50 tuổi và con cái tìm giải pháp cho bố mẹ.',
          estimatedDailySpend: '25.000.000 đ/ngày',
          competitorWeakness: 'Chi phí trọn gói All-on-4 tại Kim dao động 130-180Tr/hàm, trong khi Tâm Đức Smile có thể cung cấp mức 90-120Tr với chất lượng tương đương.',
          counterAdTemplate: {
            headline: 'Trồng Răng Toàn Hàm All-on-4 Tâm Đức Smile - Trợ Giá Đến 35 Triệu Tặng Hàm Tạm 15Tr',
            description: 'Ăn nhai vững chắc sau 48h. Bác sĩ CKI trên 15 năm kinh nghiệm. Miễn phí xe đưa đón khách hàng tận nhà.',
            sitelinks: ['Gói Toàn Hàm All-on-4', 'Trợ Giá 35 Triệu', 'Xe Đưa Đón Miễn Phí', 'Xem Video Bệnh Nhân'],
            biddingAdvice: 'Tăng thầu cho các tìm kiếm về "trồng răng toàn hàm giá bao nhiêu" và "trồng răng all on 4 giá rẻ".',
            uniqueSellingPoint: 'Mức trợ giá lớn nhất miền Nam (35 triệu) và hỗ trợ đưa đón khách hàng tận nơi.'
          }
        }
      },

      // 11. ĐẠI TIỆC RĂNG SỨ CERCON HT (Image Card 11)
      {
        id: 'kim-ad-11',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'image',
        platform: 'Google Display Network',
        firstSeen: '14/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'porcelain',
        visual: {
          theme: 'navy_gold',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'RĂNG SỨ CHÍNH HÃNG ĐỨC',
          headlineMain: 'ĐẠI TIỆC RĂNG SỨ CERCON HT - ĐỒNG GIÁ 2.499K',
          subHeadline: 'Bảo Tồn Răng Thật Tối Đa - Bảo Hành Chính Hãng 10 Năm',
          highlightPill: 'Đồng Giá 2.499K',
          photoType: 'porcelain_smile',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Cạnh tranh trực tiếp với phân khúc răng sứ thẩm mỹ giá tầm trung.',
          psychologicalHook: 'Mức giá 2.499K cho dòng sứ Cercon nổi tiếng của Đức.',
          targetAudience: 'Người có răng ố vàng, mẻ, lệch lạc nhẹ cần thẩm mỹ nhanh chóng trong 3 ngày.',
          estimatedDailySpend: '11.000.000 đ/ngày',
          competitorWeakness: 'Chỉ áp dụng khi làm combo từ 16 răng trở lên, nếu làm lẻ 1-4 răng giá bị nâng lên 4.5 triệu/răng.',
          counterAdTemplate: {
            headline: 'Bọc Răng Sứ Cercon HT Tâm Đức Smile - Chỉ Từ 1.8Tr/Răng Không Cần Làm Cả Hàm',
            description: 'Công nghệ CAD/CAM 3D chính xác từng micromet. Không mài nhỏ răng, không đen viền nướu. Bảo hành 15 năm.',
            sitelinks: ['Sứ Cercon 1.8Tr', 'Làm Lẻ Từng Răng', 'Xem Màu Răng Thực Tế', 'Tư Vấn Miễn Phí'],
            biddingAdvice: 'Tấn công vào điểm yếu làm lẻ: "Áp dụng cho mọi số lượng răng - không ép làm cả hàm".',
            uniqueSellingPoint: 'Giá 1.8Tr cho dòng Cercon chính hãng, linh hoạt làm lẻ và bảo hành dài hạn 15 năm.'
          }
        }
      },

      // 12. NIỀNG RĂNG MẮC CÀI TRẢ GÓP (Image Card 12)
      {
        id: 'kim-ad-12',
        advertiserName: 'Nha Khoa Kim',
        legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
        domain: 'nhakhoakim.com',
        isVerified: true,
        format: 'image',
        platform: 'Performance Max',
        firstSeen: '08/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'ortho',
        visual: {
          theme: 'clinic_blue',
          brandLogoText: 'NHA KHOA KIM',
          topBadgeText: 'ƯU ĐÃI HỌC SINH SINH VIÊN',
          headlineMain: 'NIỀNG RĂNG MẮC CÀI TRẢ GÓP CHỈ 1 TRIỆU/THÁNG',
          subHeadline: '0% Lãi Suất - Tặng Máy Tăm Nước & Gói Chăm Sóc Răng 3.5Tr',
          highlightPill: 'Trả Góp 1Tr/Tháng',
          photoType: 'aligner_girl',
          imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Hút khách hàng trẻ tuổi, học sinh sinh viên niềng răng mắc cài kim loại và sứ.',
          psychologicalHook: 'Chia nhỏ chi phí 1 triệu/tháng và quà tặng phụ kiện tăm nước.',
          targetAudience: 'Học sinh, sinh viên, người mới đi làm tại các thành phố lớn.',
          estimatedDailySpend: '12.000.000 đ/ngày',
          competitorWeakness: 'Yêu cầu trả trước 30-40% mới được trả góp phần còn lại.',
          counterAdTemplate: {
            headline: 'Niềng Răng Tâm Đức Smile - Trả Góp Chỉ 800k/Tháng Không Cần Trả Trước',
            description: 'Miễn phí chụp phim 3D & phác đồ ClinCheck 2.5Tr. Hợp đồng cam kết hiệu quả rõ ràng. 17 chi nhánh tiện tái khám.',
            sitelinks: ['Trả Góp 800k/Tháng', 'Không Trả Trước', '17 Chi Nhánh Gần Nhà', 'Đặt Hẹn Khám 0đ'],
            biddingAdvice: 'Nhắm từ khóa "niềng răng học sinh sinh viên trả góp" và ghim sitelink "Không Cần Trả Trước".',
            uniqueSellingPoint: 'Chính sách trả góp 800k/tháng không cần thanh toán trước tiền cọc lớn.'
          }
        }
      }
    ]
  },

  'nhakhoaparis.vn': {
    domain: 'nhakhoaparis.vn',
    brandName: 'Nha Khoa Paris',
    legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA PARIS',
    approxActiveAds: 145,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Niềng Răng Mắc Cài 3D Speed', 'Trồng Răng Implant 4S', 'Bọc Răng Sứ Nano Shining', 'Tẩy Trắng Răng WhiteMax'],
    ads: [
      {
        id: 'paris-ad-1',
        advertiserName: 'Nha Khoa Paris',
        legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA PARIS',
        domain: 'nhakhoaparis.vn',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '12/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'ortho',
        visual: {
          theme: 'navy_gold',
          brandLogoText: 'NHA KHOA PARIS',
          topBadgeText: 'CÔNG NGHỆ PHÁP',
          headlineMain: 'SIÊU LỄ HỘI NIỀNG RĂNG PARIS - ĐỒNG GIÁ 18 TRIỆU TRỌN GÓI',
          subHeadline: 'Rút Ngắn 6 Tháng Điều Trị Cùng Công Nghệ 3D Speed',
          highlightPill: 'Đồng Giá 18 Triệu',
          photoType: 'aligner_girl',
          duration: '0:35',
          imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Đánh sập giá thị trường niềng răng bằng con số mồi 18 triệu.',
          psychologicalHook: 'Mức giá 18 triệu cực sốc tạo phễu thu hút lượng lớn khách hàng trẻ đăng ký.',
          targetAudience: 'Sinh viên, học sinh và nhân viên trẻ.',
          estimatedDailySpend: '16.000.000 đ/ngày',
          competitorWeakness: 'Gói 18 triệu chỉ dành cho ca răng thưa nhẹ, khi đến khám thực tế ca lệch lạc sẽ bị tư vấn gói 35-45 triệu.',
          counterAdTemplate: {
            headline: 'Niềng Răng Minh Bạch Tâm Đức Smile - Báo Giá Chuẩn Y Khoa Không Mồi Chài',
            description: 'Trả góp chỉ 800k/tháng. Bác sĩ chuyên khoa chỉnh nha trên 10 năm kinh nghiệm. Miễn phí chụp phim 3D 1.5Tr.',
            sitelinks: ['Bảng Giá Thật 100%', 'Trả Góp 800k', 'Bác Sĩ CKI', 'Đánh Giá Khách Hàng'],
            biddingAdvice: 'Đánh vào tâm lý "báo giá thật, không phát sinh chi phí sau khi khám".',
            uniqueSellingPoint: 'Cam kết báo giá trọn gói minh bạch ngay từ đầu, không nâng giá sau khám.'
          }
        }
      },
      {
        id: 'paris-ad-2',
        advertiserName: 'Nha Khoa Paris',
        legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA PARIS',
        domain: 'nhakhoaparis.vn',
        isVerified: true,
        format: 'text',
        platform: 'Google Search',
        firstSeen: '10/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        searchAd: {
          displayDomain: 'nhakhoaparis.vn',
          path: 'www.nhakhoaparis.vn/trong-rang-implant-4s',
          headline: 'Trồng Răng Implant 4S Pháp - Không Đau, Tích Hợp Xương Sau 3 Tuần',
          description: 'Công nghệ độc quyền từ Pháp. Bác sĩ Hiệp hội Implant Quốc tế ICOI trực tiếp thực hiện. Giảm 30% khi đặt lịch online.',
          sitelinks: ['Bảng Giá Trụ Pháp', 'Bác Sĩ ICOI', 'Bảo Hành 20 Năm', 'Đặt Lịch Giảm 30%'],
          callouts: ['Chuẩn Pháp', 'Bảo Hành 20 Năm', 'Tích Hợp Nhanh']
        },
        intel: {
          campaignGoal: 'Định vị cấy ghép Implant theo chuẩn y khoa Pháp sang trọng.',
          psychologicalHook: 'Thương hiệu Pháp và công nghệ 4S độc quyền.',
          targetAudience: 'Người mất răng muốn tìm công nghệ cao cấp.',
          estimatedDailySpend: '12.000.000 đ/ngày',
          competitorWeakness: 'Hệ thống phòng khám tại miền Nam còn ít chi nhánh hơn Tâm Đức Smile.',
          counterAdTemplate: {
            headline: 'Trồng Răng Implant Tâm Đức Smile - 17 Chi Nhánh TP.HCM & Miền Tây Trọn Gói 9.9Tr',
            description: 'Tặng trọn bộ Abutment & Răng sứ cao cấp. Miễn phí xe đưa đón tận nhà. Bác sĩ CKI trên 15 năm kinh nghiệm.',
            sitelinks: ['Trọn Gói 9.9Tr', 'Xe Đưa Đón Miễn Phí', '17 Chi Nhánh Gần Bạn', 'Khám & Chụp Phim 0đ'],
            biddingAdvice: 'Đẩy mạnh thế mạnh mạng lưới 17 chi nhánh thuận tiện chăm sóc và bảo hành tại miền Nam.',
            uniqueSellingPoint: 'Gần nhà, tiện tái khám và bảo hành trọn đời tại 17 chi nhánh.'
          }
        }
      }
    ]
  },

  'drcareimplant.com': {
    domain: 'drcareimplant.com',
    brandName: 'Dr. Care Implant',
    legalEntity: 'CÔNG TY TNHH NHA KHOA DR. CARE',
    approxActiveAds: 90,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Trồng Răng Toàn Hàm All-on-4', 'Trồng Răng Implant Không Đau', 'Điều Trị Mất Răng Trung Niên'],
    ads: [
      {
        id: 'drcare-ad-1',
        advertiserName: 'Dr. Care Implant',
        legalEntity: 'CÔNG TY TNHH NHA KHOA DR. CARE',
        domain: 'drcareimplant.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '05/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'navy_gold',
          brandLogoText: 'DR. CARE IMPLANT',
          topBadgeText: 'CHUYÊN SÂU TRUNG NIÊN',
          headlineMain: 'TRỒNG RĂNG ALL-ON-4 KHÔNG ĐAU CHO NGƯỜI TRUNG NIÊN',
          subHeadline: '12 Liệu Pháp Giảm Đau Độc Quyền - Ăn Nhai Trọn Vẹn Tuổi 50+',
          highlightPill: '12 Liệu Pháp Giảm Đau',
          photoType: 'senior_couple',
          duration: '0:45',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Định vị là nha khoa chuyên sâu dành riêng cho người trung niên đầu tiên tại Việt Nam.',
          psychologicalHook: 'Đánh trúng nỗi sợ đau và sự lão hóa răng miệng của người trung niên tuổi 50+.',
          targetAudience: 'Người trung niên 45-70 tuổi mất nhiều răng tại TP.HCM.',
          estimatedDailySpend: '20.000.000 đ/ngày',
          competitorWeakness: 'Chỉ có duy nhất 1 cơ sở tại Quận Bình Thạnh, TP.HCM. Bảng giá thuộc hàng cao nhất thị trường.',
          counterAdTemplate: {
            headline: 'Trồng Răng Implant Không Đau Tâm Đức Smile - Trợ Giá Đến 35 Triệu 17 Chi Nhánh Gần Nhà',
            description: 'Công nghệ sóng siêu âm không đau. Bác sĩ CKI chuyên sâu cấy ghép. Tiết kiệm 40% chi phí so với các nha khoa khác.',
            sitelinks: ['Gói Toàn Hàm Trợ Giá', '17 Chi Nhánh Gần Bạn', 'Bác Sĩ CKI Khám 0đ', 'Xe Đưa Đón Tận Nhà'],
            biddingAdvice: 'Nhắm đối tượng tìm kiếm Dr. Care với thông điệp "Chất lượng tương đương - Tiết kiệm 40% - Có 17 chi nhánh gần bạn".',
            uniqueSellingPoint: 'Chi phí tối ưu hơn 40%, mạng lưới rộng khắp không phải di chuyển xa.'
          }
        }
      }
    ]
  },

  'nhakhoashark.vn': {
    domain: 'nhakhoashark.vn',
    brandName: 'Nha Khoa Shark',
    legalEntity: 'CÔNG TY TNHH NHA KHOA SHARK',
    approxActiveAds: 110,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Bọc Răng Sứ Thẩm Mỹ', 'Trồng Răng Implant Trợ Giá', 'Tẩy Trắng Răng'],
    ads: [
      {
        id: 'shark-ad-1',
        advertiserName: 'Nha Khoa Shark',
        legalEntity: 'CÔNG TY TNHH NHA KHOA SHARK',
        domain: 'nhakhoashark.vn',
        isVerified: true,
        format: 'image',
        platform: 'Google Display Network',
        firstSeen: '08/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'porcelain',
        visual: {
          theme: 'navy_gold',
          brandLogoText: 'NHA KHOA SHARK',
          topBadgeText: 'ĐẠI TIỆC RĂNG SỨ',
          headlineMain: 'ĐẠI TIỆC RĂNG SỨ SHARK DENTAL - BỌC RĂNG SỨ CHỈ TỪ 899K/RĂNG',
          subHeadline: 'Răng Sứ Chính Hãng Nhập Khẩu - Bảo Hành 10 Năm',
          highlightPill: 'Chỉ Từ 899K/Răng',
          photoType: 'porcelain_smile',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Đánh vào phân khúc giá rẻ cực độ để quét sạch khách hàng trẻ muốn làm răng sứ.',
          psychologicalHook: 'Mức giá 899k/răng đánh trúng tâm lý ham rẻ.',
          targetAudience: 'Người trẻ, sinh viên, công nhân.',
          estimatedDailySpend: '14.000.000 đ/ngày',
          competitorWeakness: 'Giá 899k là răng sứ kim loại dễ đen viền nướu sau 1-2 năm, khách đến thường bị chê và chuyển sang gói 3-5 triệu.',
          counterAdTemplate: {
            headline: 'Răng Toàn Sứ Đức Cao Cấp Tâm Đức Smile - Không Đen Viền Nướu Chỉ Từ 1.2Tr',
            description: '100% Phôi sứ Zirconia & Cercon chính hãng Đức. Bảo hành 10-15 năm. Không mài nhỏ răng thật.',
            sitelinks: ['Sứ Không Đen Viền', 'Bảo Hành 15 Năm', 'Hình Ảnh Khách Hàng', 'Khám Miễn Phí'],
            biddingAdvice: 'Nhấn mạnh "Răng Toàn Sứ Đức chính hãng - không dùng sứ kim loại dễ hỏng răng".',
            uniqueSellingPoint: 'Răng toàn sứ chính hãng bảo tồn răng thật, không gây đen viền nướu.'
          }
        }
      }
    ]
  },

  'nhakhoaviethan04.com': {
    domain: 'nhakhoaviethan04.com',
    brandName: 'Nha Khoa Việt Hàn 04',
    legalEntity: 'CÔNG TY TNHH NHA KHOA QUỐC TẾ VIỆT HÀN (HỆ THỐNG VIỆT HÀN 04)',
    approxActiveAds: 68,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Trồng Răng Implant Giá Rẻ 5.9Tr', 'Bọc Răng Sứ Thẩm Mỹ 990K', 'Niềng Răng Mắc Cài Trả Góp 0%'],
    ads: [
      {
        id: 'viethan-ad-1',
        advertiserName: 'Nha Khoa Việt Hàn 04',
        legalEntity: 'CÔNG TY TNHH NHA KHOA QUỐC TẾ VIỆT HÀN (HỆ THỐNG VIỆT HÀN 04)',
        domain: 'nhakhoaviethan04.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '12/02/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'clinic_blue',
          brandLogoText: 'VIỆT HÀN 04 DENTAL',
          topBadgeText: 'GIÁ RẺ ĐỘT PHÁ',
          headlineMain: 'TRỒNG RĂNG IMPLANT VIỆT HÀN 04 - CHỈ 5.9TR/TRỤ TRỌN GÓI',
          subHeadline: 'Bác Sĩ Chuyên Khoa Tu Nghiệp Hàn Quốc • Trả Góp 0% Lãi Suất',
          highlightPill: 'Chỉ Từ 5.9Tr/Trụ',
          photoType: 'doctor_guide',
          duration: '0:35',
          imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Đánh thẳng vào phân khúc khách hàng nhạy cảm về giá với con số 5.9 triệu để chiếm lĩnh thị phần khu vực ven TP.HCM.',
          psychologicalHook: 'Mức giá 5.9 triệu tạo cú sốc giá cực mạnh cho người tìm kiếm giải pháp trồng răng tiết kiệm.',
          targetAudience: 'Người trung niên, người lao động thu nhập phổ thông tại TP.HCM, Bình Dương.',
          estimatedDailySpend: '18.000.000 đ/ngày',
          competitorWeakness: 'Giá 5.9 triệu thường là trụ cơ bản chưa kèm khớp nối Abutment hoặc răng sứ, phát sinh thêm khi lên ghế điều trị.',
          counterAdTemplate: {
            headline: 'Trồng Răng Implant Trọn Gói 100% Không Phát Sinh - Bác Sĩ CKI Khám Trực Tiếp',
            description: 'Cam kết minh bạch: Đã bao gồm Trụ + Khớp Abutment + Răng Sứ + Chụp CT ConeBeam 3D. Bảo hành chính hãng.',
            sitelinks: ['Bảng Giá Trọn Gói Thật', 'So Sánh Chi Phí', 'Đội Ngũ Bác Sĩ CKI', 'Khám & Chụp Phim 0đ'],
            biddingAdvice: 'Đấu thầu đối kháng từ khóa "implant việt hàn 04", thông điệp đánh vào "Trọn gói minh bạch 100% không chi phí ẩn".',
            uniqueSellingPoint: 'Trọn gói thực tế không phát sinh phụ phí ghế nha.'
          }
        }
      },
      {
        id: 'viethan-ad-2',
        advertiserName: 'Nha Khoa Việt Hàn 04',
        legalEntity: 'CÔNG TY TNHH NHA KHOA QUỐC TẾ VIỆT HÀN (HỆ THỐNG VIỆT HÀN 04)',
        domain: 'nhakhoaviethan04.com',
        isVerified: true,
        format: 'text',
        platform: 'Google Search',
        firstSeen: '18/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        searchAd: {
          displayDomain: 'nhakhoaviethan04.com',
          path: 'nhakhoaviethan04.com/cay-ghep-implant-gia-re',
          headline: 'Trồng Răng Implant Việt Hàn 04 - Trụ Hàn Quốc Chỉ 5.9 Triệu',
          description: 'Khuyến mãi đặc biệt tháng này: Giảm 50% chi phí trồng răng Implant. Bác sĩ 10 năm kinh nghiệm, ăn nhai chắc khỏe như răng thật. Đặt lịch ngay!',
          sitelinks: [
            'Bảng Giá Ưu Đãi 5.9Tr',
            'Quy Trình Cấy Ghép 15 Phút',
            'Trả Góp 0% Lãi Suất',
            'Đặt Hẹn Nhận Quà 1 Triệu'
          ],
          callouts: ['Giảm 50% Hôm Nay', 'Trụ Hàn Quốc Chính Hãng', 'Bảo Hành 10 Năm']
        },
        intel: {
          campaignGoal: 'Đón đầu các từ khóa Search "trồng răng giá rẻ", "implant giá rẻ tphcm".',
          psychologicalHook: 'Khuyến mãi 50% tạo cảm giác được hời lớn.',
          targetAudience: 'Người tìm kiếm giải pháp trồng răng chi phí thấp.',
          estimatedDailySpend: '12.000.000 đ/ngày',
          competitorWeakness: 'Độ phủ thương hiệu hẹp hơn các chuỗi lớn, uy tín kiểm định chưa toàn diện.',
          counterAdTemplate: {
            headline: 'Cấy Ghép Răng Implant Chuẩn Y Khoa - Đầy Đủ Giấy Tờ Kiểm Định Quốc Tế',
            description: 'Đừng đánh đổi chất lượng lấy giá rẻ! 100% trụ Implant nhập khẩu chính ngạch Thụy Sĩ/Mỹ/Hàn. Bảo hành trọn đời.',
            sitelinks: ['Cam Kết Không Chi Phí Ẩn', 'Bảng Giá Niêm Yết', 'Bác Sĩ CKI Khám'],
            biddingAdvice: 'Tăng bid từ khóa ngách địa phương TP.HCM và vùng ven.',
            uniqueSellingPoint: 'Chất lượng chính hãng, minh bạch và an toàn y khoa tuyệt đối.'
          }
        }
      },
      {
        id: 'viethan-ad-3',
        advertiserName: 'Nha Khoa Việt Hàn 04',
        legalEntity: 'CÔNG TY TNHH NHA KHOA QUỐC TẾ VIỆT HÀN (HỆ THỐNG VIỆT HÀN 04)',
        domain: 'nhakhoaviethan04.com',
        isVerified: true,
        format: 'image',
        platform: 'Google Display Network',
        firstSeen: '25/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'porcelain',
        visual: {
          theme: 'invisalign_cyan',
          brandLogoText: 'NHA KHOA VIỆT HÀN 04',
          topBadgeText: 'ĐẠI HỘI RĂNG SỨ',
          headlineMain: 'RĂNG SỨ CERCON & ZIRCONIA ĐỨC - CHỈ 990K/RĂNG',
          subHeadline: 'Bảo Hành Chính Hãng 15 Năm • Tặng Gói Cạo Vôi & Đánh Bóng',
          highlightPill: '990K/Răng',
          photoType: 'porcelain_smile',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Thu hút khách thẩm mỹ răng sứ trẻ và trung niên bằng mức giá dưới 1 triệu.',
          psychologicalHook: 'Số tiền 990k khiến khách hàng cảm giác chi phí cực kỳ nhẹ nhàng.',
          targetAudience: 'Phụ nữ 22 - 45 tuổi.',
          estimatedDailySpend: '10.000.000 đ/ngày',
          competitorWeakness: 'Bảo tồn tủy và kỹ thuật mài răng cần được kiểm chứng cẩn thận.',
          counterAdTemplate: {
            headline: 'Bọc Răng Sứ Công Nghệ CAD/CAM 3D - Bảo Tồn Răng Thật Tối Đa',
            description: 'Phôi sứ nguyên khối chính hãng Đức 100%. Không hôi miệng, không đen viền nướu. Thẻ bảo hành điện tử chính hãng.',
            sitelinks: ['Thẻ Bảo Hành Hãng', 'Hình Ảnh Trước Sau', 'Ưu Đãi Trả Góp 0%'],
            biddingAdvice: 'Đánh vào tệp GDN Remarketing với cam kết "Không mài nhỏ răng thật".',
            uniqueSellingPoint: 'Bảo tồn răng thật tối đa với công nghệ phục hình kỹ thuật số.'
          }
        }
      }
    ]
  },

  'nhakhoasaigonbh.com': {
    domain: 'nhakhoasaigonbh.com',
    brandName: 'Nha Khoa Sài Gòn B.H',
    legalEntity: 'CÔNG TY TNHH NHA KHOA SÀI GÒN B.H',
    approxActiveAds: 85,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Cấy Ghép Implant Kỹ Thuật Số', 'Chỉnh Nha Niềng Răng Chuyên Sâu', 'Răng Sứ Thẩm Mỹ Cao Cấp'],
    ads: [
      {
        id: 'saigonbh-ad-1',
        advertiserName: 'Nha Khoa Sài Gòn B.H',
        legalEntity: 'CÔNG TY TNHH NHA KHOA SÀI GÒN B.H',
        domain: 'nhakhoasaigonbh.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '05/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'navy_gold',
          brandLogoText: 'SÀI GÒN B.H DENTAL',
          topBadgeText: '20 NĂM ĐỒNG HÀNH',
          headlineMain: '20 NĂM ĐỒNG HÀNH CHĂM SÓC NỤ CƯỜI ĐÔNG NAM BỘ',
          subHeadline: 'Đội Ngũ Bác Sĩ Tốt Nghiệp ĐH Y Dược TP.HCM • Hệ Thống Cơ Sở Biên Hòa & TP.HCM',
          highlightPill: 'Uy Tín 20 Năm',
          photoType: 'harvard_group',
          duration: '0:45',
          imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Củng cố vị thế chuỗi nha khoa uy tín lâu năm số 1 tại Đồng Nai (Biên Hòa) và mở rộng sang TP.HCM.',
          psychologicalHook: '20 năm kinh nghiệm và bằng cấp chính quy ĐH Y Dược tạo sự tín nhiệm cao.',
          targetAudience: 'Người dân Biên Hòa, Đồng Nai, Bình Dương và TP.HCM.',
          estimatedDailySpend: '22.000.000 đ/ngày',
          competitorWeakness: 'Giá dịch vụ ở phân khúc trung cao, ít chương trình khuyến mãi giảm sốc so với đối thủ.',
          counterAdTemplate: {
            headline: 'Cấy Ghép Implant Chuyên Sâu - Đội Ngũ Bác Sĩ CKI Hơn 15 Năm Kinh Nghiệm',
            description: 'Trang thiết bị hiện đại chuẩn Châu Âu. Hỗ trợ xe đưa đón miễn phí tận nhà. Trả góp 0% linh hoạt.',
            sitelinks: ['Bảng Giá Khuyến Mãi', 'Xe Đưa Đón 0đ', 'Bác Sĩ CKI Khám'],
            biddingAdvice: 'Target địa lý Đồng Nai, TP.HCM với ưu đãi tặng gói đưa đón và chụp phim CT 3D miễn phí.',
            uniqueSellingPoint: 'Dịch vụ chăm sóc tận tâm, xe đưa đón tận cửa và giá trọn gói cạnh tranh hơn.'
          }
        }
      },
      {
        id: 'saigonbh-ad-2',
        advertiserName: 'Nha Khoa Sài Gòn B.H',
        legalEntity: 'CÔNG TY TNHH NHA KHOA SÀI GÒN B.H',
        domain: 'nhakhoasaigonbh.com',
        isVerified: true,
        format: 'text',
        platform: 'Google Search',
        firstSeen: '10/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        searchAd: {
          displayDomain: 'nhakhoasaigonbh.com',
          path: 'nhakhoasaigonbh.com/trong-rang-implant-bien-hoa',
          headline: 'Trồng Răng Implant Sài Gòn B.H - Bác Sĩ ĐH Y Dược Trực Tiếp Khám',
          description: 'Cấy ghép Implant kỹ thuật số không đau, tích hợp xương nhanh. Bảo hành chính hãng trọn đời. Cơ sở hiện đại tại Biên Hòa & TP.HCM.',
          sitelinks: [
            'Bảng Giá Trồng Răng 2026',
            'Đội Ngũ Bác Sĩ Y Dược',
            'Địa Chỉ Chi Nhánh',
            'Đặt Lịch Khám Miễn Phí'
          ],
          callouts: ['20 Năm Kinh Nghiệm', 'Bảo Hành Trọn Đời', 'Máy Chụp CT ConeBeam']
        },
        intel: {
          campaignGoal: 'Thống lĩnh các lượt tìm kiếm về cấy ghép răng Implant tại khu vực Đồng Nai và lân cận.',
          psychologicalHook: 'Đội ngũ bác sĩ ĐH Y Dược bảo đảm tay nghề cao.',
          targetAudience: 'Người mất răng tại Biên Hòa và TP.HCM.',
          estimatedDailySpend: '16.000.000 đ/ngày',
          competitorWeakness: 'Ít phủ sóng chi nhánh tại các tỉnh Tây Nam Bộ.',
          counterAdTemplate: {
            headline: 'Trồng Răng Implant Trọn Gói Tiết Kiệm - Xe Đưa Đón Khách Tỉnh Miễn Phí',
            description: '17 chi nhánh phủ khắp miền Nam. Miễn phí chụp CT 3D & xét nghiệm máu. Bác sĩ CKI trên 15 năm kinh nghiệm.',
            sitelinks: ['Bảng Giá Trọn Gói', 'Hệ Thống 17 Chi Nhánh', 'Hỗ Trợ Khách Tỉnh'],
            biddingAdvice: 'Đẩy mạnh từ khóa địa phương kèm ưu đãi hỗ trợ đi lại.',
            uniqueSellingPoint: 'Mạng lưới chi nhánh rộng lớn và chính sách hỗ trợ đi lại vượt trội.'
          }
        }
      }
    ]
  },

  'nhakhoatrongrang.com': {
    domain: 'nhakhoatrongrang.com',
    brandName: 'Nha Khoa Trồng Răng',
    legalEntity: 'CÔNG TY TNHH NHA KHOA TRỒNG RĂNG SÀI GÒN',
    approxActiveAds: 72,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Chuyên Khoa Cấy Ghép Răng Implant', 'Trồng Răng Toàn Hàm All-on-4 / All-on-6', 'Trồng Răng Không Đau Bác Sĩ CKI'],
    ads: [
      {
        id: 'trongrang-ad-1',
        advertiserName: 'Nha Khoa Trồng Răng',
        legalEntity: 'CÔNG TY TNHH NHA KHOA TRỒNG RĂNG SÀI GÒN',
        domain: 'nhakhoatrongrang.com',
        isVerified: true,
        format: 'text',
        platform: 'Google Search',
        firstSeen: '02/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        searchAd: {
          displayDomain: 'nhakhoatrongrang.com',
          path: 'nhakhoatrongrang.com/trong-rang-implant-tphcm',
          headline: 'Nha Khoa Trồng Răng - Chuyên Sâu Cấy Ghép Implant Chuẩn Y Khoa',
          description: 'Trọn gói Trụ + Khớp Nối Abutment + Răng Sứ. Bác sĩ CKI Răng Hàm Mặt hơn 15 năm kinh nghiệm trực tiếp cấy ghép. Không đau, ăn nhai tức thì!',
          sitelinks: [
            'Bảng Giá Trọn Gói Implant',
            'Trồng Răng All On 4 / All On 6',
            'Quy Trình Cấy Ghép Chuẩn',
            'Ưu Đãi Người Lớn Tuổi'
          ],
          callouts: ['Chuyên Sâu Implant', 'Bác Sĩ CKI Khám', 'Bảo Hành Trọn Đời', 'Trả Góp 0%']
        },
        intel: {
          campaignGoal: 'Chiếm lĩnh vị trí Top 1-2 Google Search cho các từ khóa exact match: "trồng răng", "trồng răng implant", "trồng răng bao nhiêu tiền".',
          psychologicalHook: 'Tên thương hiệu "Nha Khoa Trồng Răng" tạo độ liên kết tuyệt đối và độ tin cậy tự nhiên về chuyên môn ngách.',
          targetAudience: 'Người mất 1 hoặc nhiều răng, người cao tuổi tại TP.HCM.',
          estimatedDailySpend: '25.000.000 đ/ngày',
          competitorWeakness: 'Quy mô chỉ 1-2 phòng khám trung tâm, khách hàng ở xa phải di chuyển nhiều.',
          counterAdTemplate: {
            headline: 'Hệ Thống Trồng Răng Implant 17 Chi Nhánh - Đưa Đón Tận Nơi Miễn Phí',
            description: 'Đội ngũ Bác sĩ CKI đầu ngành. Cấy ghép nhẹ nhàng không đau với máng định vị 3D. Tặng trọn bộ Abutment & răng sứ.',
            sitelinks: ['Chi Nhánh Gần Bạn', 'Bảng Giá Trọn Gói', 'Xem Khách Hàng Thực Tế'],
            biddingAdvice: 'Chạy đối đầu từ khóa "nha khoa trồng răng", nhấn mạnh sự tiện lợi gần nhà và mạng lưới lớn.',
            uniqueSellingPoint: 'Chi nhánh gần nhà, có xe đưa đón riêng, giải quyết nỗi ngại di chuyển của người lớn tuổi.'
          }
        }
      },
      {
        id: 'trongrang-ad-2',
        advertiserName: 'Nha Khoa Trồng Răng',
        legalEntity: 'CÔNG TY TNHH NHA KHOA TRỒNG RĂNG SÀI GÒN',
        domain: 'nhakhoatrongrang.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '15/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'navy_gold',
          brandLogoText: 'NHA KHOA TRỒNG RĂNG',
          topBadgeText: 'CHUYÊN SÂU IMPLANT',
          headlineMain: 'TRỒNG RĂNG TOÀN HÀM ALL ON 4 / ALL ON 6 - ĂN NHAI TỨC THÌ',
          subHeadline: 'Giải Pháp Tối Ưu Cho Người Mất Toàn Bộ Răng • Tiết Kiệm Chi Phí Tối Đa',
          highlightPill: 'Toàn Hàm Ăn Nhai 48h',
          photoType: 'senior_couple',
          duration: '0:40',
          imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Đánh vào các ca phục hình toàn hàm giá trị cao (All-on-4 / All-on-6 từ 80 - 150 triệu).',
          psychologicalHook: 'Hình ảnh cặp vợ chồng lớn tuổi ăn uống ngon miệng sau khi trồng răng khơi dậy khao khát hồi phục chất lượng sống.',
          targetAudience: 'Người trên 50 tuổi mất nhiều răng và con cái tìm nha khoa cho cha mẹ.',
          estimatedDailySpend: '15.000.000 đ/ngày',
          competitorWeakness: 'Chi phí toàn hàm cao, ít chính sách chia nhỏ đợt thanh toán.',
          counterAdTemplate: {
            headline: 'Trồng Răng Toàn Hàm All-on-4 Trả Góp 0% - Bác Sĩ CKI Khám Trực Tiếp',
            description: 'Chỉ cần 4-6 trụ phục hồi nguyên hàm răng chắc khỏe. Cam kết bảo hành trọn đời. Tặng vé xe / đưa đón miễn phí.',
            sitelinks: ['Gói Toàn Hàm Tiết Kiệm', 'Hình Ảnh Ca Phẫu Thuật', 'Đăng Ký Khám 0đ'],
            biddingAdvice: 'Đẩy mạnh YouTube TrueView và Display Remarketing nhắm tệp 45+.',
            uniqueSellingPoint: 'Chính sách tài chính trả góp linh hoạt và chăm sóc hậu phẫu chu đáo.'
          }
        }
      }
    ]
  },

  'saigonimplant.com': {
    domain: 'saigonimplant.com',
    brandName: 'Sài Gòn Implant',
    legalEntity: 'HỆ THỐNG NHA KHOA SÀI GÒN IMPLANT',
    approxActiveAds: 54,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Cấy Ghép Trụ Implant Chuẩn Y Khoa', 'Nâng Xoang Ghép Xương Nhân Tạo', 'Phục Hình Răng Mất Lâu Năm'],
    ads: [
      {
        id: 'saigonimplant-ad-1',
        advertiserName: 'Sài Gòn Implant',
        legalEntity: 'HỆ THỐNG NHA KHOA SÀI GÒN IMPLANT',
        domain: 'saigonimplant.com',
        isVerified: true,
        format: 'text',
        platform: 'Google Search',
        firstSeen: '20/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        searchAd: {
          displayDomain: 'saigonimplant.com',
          path: 'saigonimplant.com/bang-gia-implant-chinh-hang',
          headline: 'Sài Gòn Implant - Cấy Ghép Răng Implant Chuẩn Quốc Tế',
          description: 'Trụ Implant Mỹ, Thụy Sĩ, Hàn Quốc chính hãng 100%. Công nghệ định vị 3D không rạch nướu, không đau sưng. Đặt hẹn nhận ưu đãi 30%!',
          sitelinks: [
            'Bảng Giá Trụ Chính Hãng',
            'Công Nghệ Không Đau 3D',
            'Đội Ngũ Bác Sĩ CKI',
            'Chính Sách Bảo Hành'
          ],
          callouts: ['Trụ Mỹ - Thụy Sĩ', 'Không Rạch Nướu', 'Bảo Hành Trọn Đời', 'Giảm 30%']
        },
        intel: {
          campaignGoal: 'Tập trung vào phân khúc cấy ghép Implant chất lượng cao với công nghệ phẫu thuật ít xâm lấn.',
          psychologicalHook: 'Thông điệp "Không rạch nướu, không đau sưng" đánh trúng nỗi sợ đau của người muốn trồng răng.',
          targetAudience: 'Người mất răng sợ đau, người muốn dùng trụ cao cấp Âu Mỹ.',
          estimatedDailySpend: '14.000.000 đ/ngày',
          competitorWeakness: 'Thương hiệu tương đối mới, số lượng phòng khám ít.',
          counterAdTemplate: {
            headline: 'Cấy Ghép Implant Không Đau Bằng Máng Hướng Dẫn 3D - Chuỗi 17 Chi Nhánh',
            description: 'Ứng dụng công nghệ Navigation 3D chuẩn xác đến 0.1mm. Không đau, lành thương trong 24h. Bác sĩ CKI trên 15 năm kinh nghiệm.',
            sitelinks: ['Công Nghệ Không Đau', 'Bảng Giá Trọn Gói', 'Hệ Thống Chi Nhánh'],
            biddingAdvice: 'Đánh vào từ khóa "implant không đau", "trồng răng không sưng".',
            uniqueSellingPoint: 'Kinh nghiệm lâm sàng trên 100.000 ca và hệ thống công nghệ số hàng đầu.'
          }
        }
      },
      {
        id: 'saigonimplant-ad-2',
        advertiserName: 'Sài Gòn Implant',
        legalEntity: 'HỆ THỐNG NHA KHOA SÀI GÒN IMPLANT',
        domain: 'saigonimplant.com',
        isVerified: true,
        format: 'image',
        platform: 'Google Display Network',
        firstSeen: '28/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'dark_luxury',
          brandLogoText: 'SÀI GÒN IMPLANT',
          topBadgeText: 'CÔNG NGHỆ MỸ',
          headlineMain: 'TRỒNG RĂNG 1 LẦN DÙNG TRỌN ĐỜI - TRỢ GIÁ ĐẾN 40%',
          subHeadline: 'Bảo Hành Chính Hãng Trọn Đời Bằng Mã QR Điện Tử • Cam Kết Không Đau',
          highlightPill: 'Trợ Giá Đến 40%',
          photoType: 'surgery_room',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Quảng bá gói Implant trợ giá trên mạng lưới GDN và báo chí trực tuyến.',
          psychologicalHook: '"Dùng trọn đời" + "Trợ giá 40%" tạo động lực quyết định nhanh.',
          targetAudience: 'Người đọc báo điện tử tuổi 35-65.',
          estimatedDailySpend: '9.000.000 đ/ngày',
          competitorWeakness: 'Ngân sách GDN còn mỏng so với các tập đoàn nha khoa lớn.',
          counterAdTemplate: {
            headline: 'Trồng Răng Implant Đạt Chuẩn Quốc Tế - Bảo Hành Điện Tử Toàn Cầu',
            description: '100% Khách hàng được quét CT 3D & lập phác đồ kỹ thuật số miễn phí. Cam kết không phát sinh phụ phí.',
            sitelinks: ['Nhận Ưu Đãi Trọn Gói', 'Xem Video Trực Tiếp', 'Tư Vấn Online 24/7'],
            biddingAdvice: 'Tập trung GDN theo vị trí đặt (Placement) trên các trang tin sức khỏe.',
            uniqueSellingPoint: 'Thương hiệu uy tín, quy trình chuẩn y khoa và bảo hành an tâm tuyệt đối.'
          }
        }
      }
    ]
  }
};
