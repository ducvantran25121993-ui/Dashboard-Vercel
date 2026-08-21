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

  'tamducsmile.com': {
    domain: 'nhakhoatamducsmile.com',
    brandName: 'Nha Khoa Tâm Đức Smile (Của Bạn)',
    legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA TÂM ĐỨC SMILE',
    approxActiveAds: 165,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Trồng Răng Implant Kỹ Thuật Số', 'Trồng Răng Toàn Hàm All-on-4', 'Răng Toàn Sứ Thẩm Mỹ', 'Niềng Răng Trả Góp 0%'],
    ads: [
      {
        id: 'tamduc-ad-1',
        advertiserName: 'Tâm Đức Smile',
        legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA TÂM ĐỨC SMILE',
        domain: 'nhakhoatamducsmile.com',
        isVerified: true,
        format: 'video',
        platform: 'YouTube',
        firstSeen: '01/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        visual: {
          theme: 'navy_gold',
          brandLogoText: 'TÂM ĐỨC SMILE',
          topBadgeText: 'HỆ THỐNG 17 CHI NHÁNH',
          headlineMain: 'TRỒNG RĂNG IMPLANT TRỌN GÓI 9.9TR - KHÔNG PHÁT SINH',
          subHeadline: 'Bác Sĩ CKI Trực Tiếp Thực Hiện - Miễn Phí Chụp CT 3D & Xe Đưa Đón',
          highlightPill: 'Trọn Gói 9.9Tr',
          photoType: 'doctor_guide',
          duration: '0:45',
          imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
        },
        intel: {
          campaignGoal: 'Khẳng định vị thế số 1 về cấy ghép Implant trọn gói minh bạch tại miền Nam.',
          psychologicalHook: 'Mức giá 9.9 triệu trọn gói thực sự kèm bảo hành chính hãng và đưa đón miễn phí.',
          targetAudience: 'Khách hàng tại TP.HCM, Cần Thơ, Tiền Giang, Cà Mau, Vĩnh Long, Đồng Nai.',
          estimatedDailySpend: '28.000.000 đ/ngày',
          competitorWeakness: 'Đang dẫn đầu về số lượng chi nhánh và chính sách giá trọn gói cạnh tranh.',
          counterAdTemplate: {
            headline: 'Tâm Đức Smile - Đỉnh Cao Công Nghệ Cấy Ghép Răng Implant Miền Nam',
            description: 'Đội ngũ Bác sĩ CKI trên 15 năm kinh nghiệm. 17 chi nhánh hiện đại. Cam kết bảo hành chính hãng trọn đời.',
            sitelinks: ['Bảng Giá Trọn Gói', '17 Chi Nhánh', 'Xem Ca Điều Trị', 'Đặt Lịch Nhận Quà'],
            biddingAdvice: 'Duy trì vị trí Top 1 tìm kiếm cho các từ khóa cốt lõi.',
            uniqueSellingPoint: 'Hệ thống 17 chi nhánh phủ rộng, bác sĩ CKI trực tiếp làm từ đầu đến cuối.'
          }
        }
      },
      {
        id: 'tamduc-ad-2',
        advertiserName: 'Tâm Đức Smile',
        legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA TÂM ĐỨC SMILE',
        domain: 'nhakhoatamducsmile.com',
        isVerified: true,
        format: 'text',
        platform: 'Google Search',
        firstSeen: '01/01/2025',
        lastSeen: 'Đang chạy hôm nay',
        category: 'implant',
        searchAd: {
          displayDomain: 'nhakhoatamducsmile.com',
          path: 'www.nhakhoatamducsmile.com/trong-rang-implant',
          headline: 'Trồng Răng Implant Tâm Đức Smile - Trọn Gói 9.9Tr 17 Chi Nhánh',
          description: 'Tặng trọn bộ Abutment & Răng sứ cao cấp. Miễn phí xe đưa đón tận nhà. Bác sĩ CKI trên 15 năm kinh nghiệm. Đặt hẹn ngay hôm nay!',
          sitelinks: [
            'Bảng Giá Trọn Gói 9.9Tr',
            '17 Chi Nhánh Gần Bạn',
            'Bác Sĩ CKI Khám Trực Tiếp',
            'Ưu Đãi Khách Hàng Tỉnh'
          ],
          callouts: ['17 Chi Nhánh', 'Bảo Hành Trọn Đời', 'Xe Đưa Đón 0đ']
        },
        intel: {
          campaignGoal: 'Đón đầu tất cả khách hàng tìm kiếm nha khoa cấy ghép Implant tại TP.HCM và miền Tây.',
          psychologicalHook: 'Trọn gói không phát sinh + Đưa đón miễn phí.',
          targetAudience: 'Người mất răng tại khu vực miền Nam.',
          estimatedDailySpend: '20.000.000 đ/ngày',
          competitorWeakness: 'Vị thế dẫn đầu.',
          counterAdTemplate: {
            headline: 'Tâm Đức Smile - Trồng Răng Implant Uy Tín Hàng Đầu',
            description: '17 chi nhánh chuẩn quốc tế. Hơn 100.000 khách hàng tin chọn.',
            sitelinks: ['Bảng Giá 2026', 'Chi Nhánh', 'Tư Vấn Miễn Phí'],
            biddingAdvice: 'Duy trì ngân sách ổn định.',
            uniqueSellingPoint: 'Thương hiệu uy tín lâu năm.'
          }
        }
      }
    ]
  }
};
