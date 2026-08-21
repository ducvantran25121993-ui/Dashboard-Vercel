import { TransparencyAdItem } from './transparencyTypes';

// Image asset collections for rich rendering
const IMAGES = {
  surgery: [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
  ],
  doctors: [
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80'
  ],
  smile: [
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
  ]
};

interface BrandAdTemplate {
  category: 'implant' | 'ortho' | 'porcelain' | 'general';
  format: 'video' | 'text' | 'image';
  platform: 'Google Search' | 'YouTube' | 'Google Display Network' | 'Performance Max';
  serviceName: string;
  hook: string;
  theme: 'navy_gold' | 'harvard_gold' | 'clinic_blue' | 'invisalign_cyan' | 'flag_us' | 'white_clean' | 'dark_luxury';
  photoType: 'harvard_group' | 'doctor_guide' | 'aligner_girl' | 'viet_kieu_smile' | 'big4_trust' | 'surgery_room' | 'senior_couple' | 'porcelain_smile';
  badge: string;
  headlineMain: string;
  subHeadline: string;
  highlightPill: string;
  searchHeadline: string;
  searchDesc: string;
  sitelinks: string[];
  callouts: string[];
  intelGoal: string;
  intelHook: string;
  intelAudience: string;
  intelWeakness: string;
  counterHeadline: string;
  counterDesc: string;
  counterSitelinks: string[];
  counterAdvice: string;
  counterUsp: string;
}

export function generateBrandAds(
  brandKey: string,
  brandName: string,
  legalEntity: string,
  domain: string,
  baseAds: TransparencyAdItem[],
  targetCount: number,
  templates: BrandAdTemplate[]
): TransparencyAdItem[] {
  const result: TransparencyAdItem[] = [...baseAds];
  let index = baseAds.length + 1;

  while (result.length < targetCount) {
    for (const t of templates) {
      if (result.length >= targetCount) break;

      const adId = `${brandKey}-gen-${index}`;
      const img = t.category === 'implant'
        ? IMAGES.surgery[index % IMAGES.surgery.length]
        : t.category === 'ortho' || t.category === 'porcelain'
        ? IMAGES.smile[index % IMAGES.smile.length]
        : IMAGES.doctors[index % IMAGES.doctors.length];

      const dayOffset = (index * 3) % 28 + 1;
      const monthOffset = index % 2 === 0 ? '01' : '02';
      const firstSeen = `${dayOffset.toString().padStart(2, '0')}/${monthOffset}/2025`;

      const item: TransparencyAdItem = {
        id: adId,
        advertiserName: brandName,
        legalEntity: legalEntity,
        domain: domain,
        isVerified: true,
        format: t.format,
        platform: t.platform,
        firstSeen: firstSeen,
        lastSeen: 'Đang chạy hôm nay',
        category: t.category,
        intel: {
          campaignGoal: t.intelGoal,
          psychologicalHook: t.intelHook,
          targetAudience: t.intelAudience,
          estimatedDailySpend: `${(8 + (index % 15)).toFixed(1)}.000.000 đ/ngày`,
          competitorWeakness: t.intelWeakness,
          counterAdTemplate: {
            headline: t.counterHeadline,
            description: t.counterDesc,
            sitelinks: t.counterSitelinks,
            biddingAdvice: t.counterAdvice,
            uniqueSellingPoint: t.counterUsp
          }
        }
      };

      if (t.format === 'video' || t.format === 'image') {
        item.visual = {
          theme: t.theme,
          brandLogoText: brandName.toUpperCase(),
          topBadgeText: t.badge,
          headlineMain: t.headlineMain,
          subHeadline: t.subHeadline,
          highlightPill: t.highlightPill,
          photoType: t.photoType,
          duration: t.format === 'video' ? `0:${30 + (index % 25)}` : undefined,
          imageUrl: img
        };
      }

      if (t.format === 'text') {
        item.searchAd = {
          displayDomain: domain,
          path: `${domain}/${t.category}/${index}`,
          headline: t.searchHeadline,
          description: t.searchDesc,
          sitelinks: t.sitelinks,
          callouts: t.callouts
        };
      }

      result.push(item);
      index++;
    }
  }

  return result;
}
