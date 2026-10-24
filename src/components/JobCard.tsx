import React from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  Heart,
  Share2,
  ExternalLink,
  Info,
  Building2,
  Users,
  MapPin,
  Flame,
  Trash2,
} from 'lucide-react';
import { JobCompetition, StatusInfo } from '../types';
import { formatDate } from '../utils/dateUtils';

interface JobCardProps {
  job: JobCompetition;
  statusInfo: StatusInfo;
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectJob: (job: JobCompetition) => void;
  onShare: (job: JobCompetition) => void;
  onDeleteJob: (job: JobCompetition) => void;
  showDeleteButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  statusInfo,
  index,
  isBookmarked,
  onToggleBookmark,
  onSelectJob,
  onShare,
  onDeleteJob,
  showDeleteButton = true,
}) => {
  const getStatusBadge = () => {
    switch (statusInfo.k) {
      case 'open':
        return (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            {statusInfo.label}
          </span>
        );
      case 'soon':
        return (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {statusInfo.label}
          </span>
        );
      case 'closed':
      default:
        return (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
            {statusInfo.label}
          </span>
        );
    }
  };

  return (
    <article
      className="group relative bg-white border border-slate-200 hover:border-[#ff7a00]/70 rounded-[22px] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] flex flex-col justify-between overflow-hidden animate-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top gradient highlight strip */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e6bff] via-[#ff7a00] to-slate-200 group-hover:h-1.5 transition-all" />

      <div>
        {/* Top bar: Title + Status + Action buttons */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {job.featured && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#ff7a00]" />
                  مطلوبة بكثرة
                </span>
              )}
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#1e6bff]" />
                {job.institution}
              </span>
            </div>
            <h3
              onClick={() => onSelectJob(job)}
              className="font-bold text-base sm:text-lg text-neutral-900 leading-snug cursor-pointer group-hover:text-[#ff7a00] transition line-clamp-2"
              title={job.title}
            >
              {job.title}
            </h3>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {getStatusBadge()}
            <button
              onClick={() => onToggleBookmark(job.id)}
              className={`p-1.5 rounded-xl border transition cursor-pointer ${
                isBookmarked
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-50 text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title={isBookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current text-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 my-4 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2.5">
            <i className="w-7 h-7 not-italic rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <GraduationCap className="w-4 h-4 text-[#1e6bff]" />
            </i>
            <span className="truncate">
              المستوى المطلوب: <b className="text-neutral-900 font-bold">{job.degree}</b>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <i className="w-7 h-7 not-italic rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Calendar className="w-4 h-4 text-emerald-600" />
            </i>
            <span className="truncate">
              بداية التسجيل: <b className="text-neutral-900 font-bold">{formatDate(job.start)}</b>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <i className="w-7 h-7 not-italic rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff7a00] shrink-0">
              <Clock className="w-4 h-4 text-[#ff7a00]" />
            </i>
            <span className="truncate">
              آخر أجل: <b className="text-neutral-900 font-bold">{formatDate(job.end)}</b>
            </span>
          </div>

          {job.positions > 0 && (
            <div className="flex items-center gap-2.5">
              <i className="w-7 h-7 not-italic rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Users className="w-4 h-4 text-sky-600" />
              </i>
              <span className="truncate">
                المناصب الشاغرة: <b className="text-neutral-900 font-bold">{job.positions} منصب</b>
              </span>
            </div>
          )}

          {job.city && (
            <div className="flex items-center gap-2.5">
              <i className="w-7 h-7 not-italic rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                <MapPin className="w-4 h-4 text-slate-600" />
              </i>
              <span className="truncate">
                الجهة / المدينة: <b className="text-neutral-900 font-bold">{job.city}</b>
              </span>
            </div>
          )}
        </div>
      </div>

      <div>
        {/* Left note (Moroccan darija remaining days) */}
        <div className="mt-2 text-xs sm:text-sm font-bold text-[#ff7a00] flex items-center justify-between">
          <span>{statusInfo.note}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onShare(job)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition cursor-pointer"
              title="مشاركة المباراة"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {showDeleteButton && (
              <button
                onClick={() => onDeleteJob(job)}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                title="حذف هذه المباراة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 grid grid-cols-5 gap-2">
          <button
            onClick={() => onSelectJob(job)}
            className="col-span-2 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200/90 border border-slate-200 text-neutral-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Info className="w-4 h-4 text-[#1e6bff]" />
            <span>الشروط</span>
          </button>

          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`col-span-3 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 transition text-center shadow-md ${
              statusInfo.k === 'closed'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none'
                : 'bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] hover:brightness-105 shadow-[#1e6bff]/15'
            }`}
          >
            {statusInfo.k === 'closed' ? (
              <span>التسجيل مسدود</span>
            ) : (
              <>
                <span>🚀 دفع الملف</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </>
            )}
          </a>
        </div>
      </div>
    </article>
  );
};
