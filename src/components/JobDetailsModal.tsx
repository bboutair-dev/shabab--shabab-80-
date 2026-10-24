import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Building2,
  Users,
  CheckCircle2,
  ExternalLink,
  Heart,
  Share2,
  FileEdit,
  Award,
  Layers,
  Sparkles,
  Check,
  Trash2,
} from 'lucide-react';
import { JobCompetition, StatusInfo } from '../types';
import { formatDate } from '../utils/dateUtils';

interface JobDetailsModalProps {
  job: JobCompetition | null;
  statusInfo: StatusInfo | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
  onOpenDemandeGenerator: (job: JobCompetition) => void;
  onDeleteJob: (job: JobCompetition) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  statusInfo,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenDemandeGenerator,
  onDeleteJob,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !job || !statusInfo) return null;

  const toggleDoc = (docIndex: number) => {
    const key = `${job.id}-doc-${docIndex}`;
    setCheckedDocs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const docs = job.documents || [
    'طلب خطي يحمل الاسم الكامل والعنوان ورقم الهاتف',
    'نسخة من بطاقة التعريف الوطنية الإلكترونية',
    'نسخة من الدبلوم أو الشهادة المطلوبة',
    'سيرة ذاتية (CV) حديثة',
  ];

  const totalDocs = docs.length;
  const completedDocsCount = docs.filter((_, idx) => checkedDocs[`${job.id}-doc-${idx}`]).length;
  const completionPercentage = Math.round((completedDocsCount / totalDocs) * 100);

  const handleShare = () => {
    const text = `🔥 فرصة توظيف جديدة: ${job.title} لدى ${job.institution}\nالمستوى: ${job.degree} | آخر أجل: ${formatDate(job.end)}\nالتفاصيل: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🔥 مباراة توظيف شباب: ${job.title} لدى ${job.institution}\n🎓 المستوى: ${job.degree}\n⏳ آخر أجل: ${formatDate(job.end)}\nسجل قبل ما تفوتك الفرصة!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const getStatusColor = (k: string) => {
    switch (k) {
      case 'open':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'soon':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xl my-6">
        {/* Top gradient glow bar */}
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#1e6bff] via-[#ff7a00] to-slate-200" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(statusInfo.k)}`}>
                {statusInfo.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#1e6bff]" />
                {job.sector}
              </span>
              {job.grade && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200 flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#ff7a00]" />
                  {job.grade}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 leading-snug">
              {job.title}
            </h2>
            <p className="text-sm text-[#ff7a00] font-bold mt-1 flex items-center gap-1.5">
              <span>{job.institution}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleBookmark(job.id)}
              className={`p-2.5 rounded-2xl border transition cursor-pointer ${
                isBookmarked
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-100 text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title={isBookmarked ? 'إلغاء الحفظ' : 'حفظ في المفضلة'}
            >
              <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current text-rose-600' : ''}`} />
            </button>
            <button
              onClick={() => onDeleteJob(job)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 transition cursor-pointer"
              title="حذف هذه المباراة"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 transition cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-[#1e6bff]" />
              المستوى المطلوب
            </div>
            <div className="font-bold text-neutral-900 text-sm">{job.degree}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-semibold">
              <Users className="w-3.5 h-3.5 text-[#ff7a00]" />
              عدد المناصب
            </div>
            <div className="font-bold text-neutral-900 text-sm">{job.positions} منصب</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              المدينة / الجهة
            </div>
            <div className="font-bold text-neutral-900 text-sm truncate" title={job.city}>
              {job.city}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#ff7a00]" />
              الوقت المتبقي
            </div>
            <div className="font-bold text-[#ff7a00] text-sm">
              {statusInfo.note}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-5 max-h-[56vh] overflow-y-auto pr-1">
          {/* Description */}
          {job.description && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-bold text-neutral-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ff7a00]" />
                نبذة عن المباراة والمهام
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {job.description}
              </p>
            </div>
          )}

          {/* Dates row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">بداية التسجيل ودفع الملفات</span>
                <span className="text-sm font-bold text-neutral-900">{formatDate(job.start)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-[#ff7a00] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">آخر أجل لإيداع الترشيحات</span>
                <span className="text-sm font-bold text-[#ff7a00]">{formatDate(job.end)}</span>
              </div>
            </div>
          </div>

          {/* Requirements (شروط الترشيح) */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                شروط المشاركة في المباراة
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e6bff] mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dossier Checklist (ملف الترشيح التفاعلي) */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ff7a00]" />
                  قائمة وثائق ملف الترشيح (تحقق من أوراقك)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  علّم على كل وثيقة قمت بتجهيزها للتأكد من اكتمال ملفك بنسبة 100%
                </p>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#ff7a00] bg-orange-100 px-2.5 py-1 rounded-full border border-orange-200">
                  {completionPercentage}% جاهز ({completedDocsCount}/{totalDocs})
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="space-y-2">
              {docs.map((doc, idx) => {
                const isChecked = !!checkedDocs[`${job.id}-doc-${idx}`];
                return (
                  <label
                    key={idx}
                    onClick={() => toggleDoc(idx)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'line-through opacity-70' : ''}`}>
                      {doc}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Quick Demande Manuscrite CTA inside dossier */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-600 font-medium">
                خاصك طلب خطي رسمي مصوب لهاد المباراة؟
              </span>
              <button
                onClick={() => onOpenDemandeGenerator(job)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5" />
                توليد طلب خطي جاهز
              </button>
            </div>
          </div>

          {/* Selection Stages */}
          {job.selectionStages && job.selectionStages.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1e6bff]" />
                مراحل الانتقاء والاختبارات
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {job.selectionStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 flex flex-col justify-between"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] text-white font-bold flex items-center justify-center text-xs mb-2 shadow-sm">
                      {idx + 1}
                    </div>
                    <p className="leading-relaxed font-medium">{stage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="pt-4 mt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="نسخ ومشاركة"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink ? 'تم نسخ الرابط!' : 'مشاركة'}
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="مشاركة عبر واتساب"
            >
              واتساب
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenDemandeGenerator(job)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-neutral-900 border border-slate-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileEdit className="w-4 h-4 text-[#ff7a00]" />
              نموذج الطلب الخطي
            </button>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center gap-2 transition shadow-md ${
                statusInfo.k === 'closed'
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none'
                  : 'bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] hover:brightness-105 shadow-[#ff7a00]/20'
              }`}
            >
              {statusInfo.k === 'closed' ? (
                'التسجيل مسدود'
              ) : (
                <>
                  <span>🚀 دفع الملف / بوابة التسجيل</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
