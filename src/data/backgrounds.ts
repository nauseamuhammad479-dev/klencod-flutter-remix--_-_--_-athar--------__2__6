import bgBlackGold from '../assets/images/bg_black_gold_1792678705277.jpg';
import bgMountains from '../assets/images/bg_mountains_nature_1792678706842.jpg';
import bgNightStars from '../assets/images/bg_night_stars_1792678706730.jpg';
import bgWarmEmber from '../assets/images/bg_warm_ember_1792678706720.jpg';

export interface AppBackground {
  id: 'black_gold' | 'mountains' | 'night_stars' | 'warm_ember';
  name: string;
  description: string;
  url: string;
  tint: string;
}

export const APP_BACKGROUNDS: AppBackground[] = [
  {
    id: 'black_gold',
    name: 'الذهب الأسود الفاخر',
    description: 'زخارف إسلامية هندسية مع بريق ذهبي هادئ',
    url: bgBlackGold,
    tint: '#0c0a09',
  },
  {
    id: 'mountains',
    name: 'سكينة الجبال والطبيعة',
    description: 'قمم شاهقة وأودية ضبابية مع إشراقة الفجر',
    url: bgMountains,
    tint: '#070a0e',
  },
  {
    id: 'night_stars',
    name: 'سماء الليل والهلال',
    description: 'نجوم ساطعة ومجرة هادئة تعزز الخشوع والتأمل',
    url: bgNightStars,
    tint: '#04060c',
  },
  {
    id: 'warm_ember',
    name: 'وهج الدفء والسكينة',
    description: 'جمرات ذهبية متطايرة بوهج دافئ ومريح للعين',
    url: bgWarmEmber,
    tint: '#110904',
  },
];
