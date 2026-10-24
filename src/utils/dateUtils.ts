import { StatusInfo } from '../types';

export const getToday = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr + 'T00:00:00');
};

export const formatDate = (dateStr: string): string => {
  try {
    return parseDate(dateStr).toLocaleDateString('ar-MA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const getJobStatus = (startStr: string, endStr: string): StatusInfo => {
  const t = getToday();
  const s = parseDate(startStr);
  const e = parseDate(endStr);

  if (t < s) {
    const daysToStart = Math.ceil((s.getTime() - t.getTime()) / 86400000);
    return {
      k: 'soon',
      label: 'قريباً',
      note: `كتبدا من ${daysToStart} يوم`,
      daysToStart,
    };
  }

  if (t > e) {
    return {
      k: 'closed',
      label: 'سالات',
      note: 'التسجيل تسالا',
    };
  }

  const daysLeft = Math.ceil((e.getTime() - t.getTime()) / 86400000);
  return {
    k: 'open',
    label: 'مفتوحة',
    note: daysLeft === 0 ? 'آخر يوم اليوم! ⏰' : `بقاو ${daysLeft} يوم`,
    daysLeft,
  };
};
