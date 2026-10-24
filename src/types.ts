export type DegreeType = 'الكل' | 'الإجازة' | 'الدبلوم' | 'الماستر' | 'الباكالوريا' | 'الدكتوراه / مهندس';

export type SectorType = 'الكل' | 'القطاع العام' | 'المؤسسات العمومية' | 'القطاع الخاص';

export interface JobCompetition {
  id: string;
  title: string;
  institution: string;
  degree: 'الإجازة' | 'الدبلوم' | 'الماستر' | 'الباكالوريا' | 'الدكتوراه / مهندس';
  sector: 'القطاع العام' | 'المؤسسات العمومية' | 'القطاع الخاص';
  city: string;
  positions: number;
  grade?: string;
  link: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  description?: string;
  requirements?: string[];
  documents?: string[];
  selectionStages?: string[];
  featured?: boolean;
}

export interface StatusInfo {
  k: 'open' | 'soon' | 'closed';
  label: string;
  note: string;
  daysLeft?: number;
  daysToStart?: number;
}
