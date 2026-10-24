import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { JobCompetition } from '../types';

interface ConfirmDeleteModalProps {
  job: JobCompetition | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (job: JobCompetition) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  job,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl animate-up">
        {/* Red accent strip */}
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          تأكيد حذف المباراة
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          هل أنت متأكد من رغبتك في حذف مباراة <strong className="text-neutral-900">"{job.title}"</strong> الخاصة بـ <span className="text-[#ff7a00] font-bold">{job.institution}</span> من قائمتك؟
        </p>

        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 mb-5 flex items-center gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>يمكنك دائماً استرجاع المباريات الافتراضية بضغطة زر واحدة.</span>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              onConfirm(job);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>نعم، حذف المباراة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
