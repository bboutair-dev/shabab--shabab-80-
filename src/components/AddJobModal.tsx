import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { JobCompetition, DegreeType, SectorType } from '../types';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: JobCompetition) => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onAddJob }) => {
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState<'الإجازة' | 'الدبلوم' | 'الماستر' | 'الباكالوريا' | 'الدكتوراه / مهندس'>('الدبلوم');
  const [sector, setSector] = useState<'القطاع العام' | 'المؤسسات العمومية' | 'القطاع الخاص'>('القطاع العام');
  const [city, setCity] = useState('الرباط');
  const [positions, setPositions] = useState('20');
  const [link, setLink] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !link.trim() || !startDate || !endDate) {
      setError('يرجى ملء جميع الحقول الإلزامية (اسم الوظيفة، الرابط، وتواريخ التسجيل).');
      return;
    }

    const newJob: JobCompetition = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      institution: institution.trim() || 'إدارة عمومية',
      degree,
      sector,
      city: city.trim() || 'جميع الجهات',
      positions: parseInt(positions) || 1,
      link: link.trim(),
      start: startDate,
      end: endDate,
      description: description.trim() || `مباراة توظيف لفائدة ${institution || 'القطاع'} لحاملي شهادة ${degree}.`,
      requirements: [
        'أن يكون المترشح من جنسية مغربية',
        `حاصل على شهادة ${degree} في التخصص المطلوب أو ما يعادلها`,
        'السن القانوني للوظيفة العمومية',
      ],
      documents: [
        'طلب خطي موجه للإدارة المعنية',
        'نسخة من بطاقة التعريف الوطنية الإلكترونية',
        'نسخة مصادق عليها من الدبلوم أو الشهادة المطلوبة',
        'سيرة ذاتية (CV)',
      ],
      selectionStages: [
        'انتقاء أولي بناءً على الملفات المستوفية للشروط',
        'اختبار كتابي تخصصي وموضوع عام',
        'اختبار شفوي ومقابلة مع اللجنة',
      ],
      featured: false,
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#1e6bff] to-[#ff7a00]" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e6bff] flex items-center justify-center border border-blue-200">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">إضافة مباراة توظيف جديدة</h2>
              <p className="text-xs text-slate-500 font-medium">
                شارك إعلاناً جديداً لمباراة أو وظيفة مع شباب المنصة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              اسم الوظيفة / المباراة <span className="text-[#ff7a00]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: متصرف من الدرجة الثانية، تقني في الكهرباء..."
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                المؤسسة / الوزارة / المشغل
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="مثال: وزارة الاقتصاد والمالية"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                المستوى المطلوب <span className="text-[#ff7a00]">*</span>
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
              >
                <option value="الباكالوريا">الباكالوريا</option>
                <option value="الدبلوم">الدبلوم</option>
                <option value="الإجازة">الإجازة</option>
                <option value="الماستر">الماستر</option>
                <option value="الدكتوراه / مهندس">الدكتوراه / مهندس</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">القطاع</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
              >
                <option value="القطاع العام">القطاع العام</option>
                <option value="المؤسسات العمومية">المؤسسات العمومية</option>
                <option value="القطاع الخاص">القطاع الخاص</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">المدينة / الجهة</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="الرباط، البيضاء، جميع الجهات..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">عدد المناصب</label>
              <input
                type="number"
                min="1"
                value={positions}
                onChange={(e) => setPositions(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                تاريخ بداية التسجيل <span className="text-[#ff7a00]">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                آخر أجل لإيداع الترشيحات <span className="text-[#ff7a00]">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              رابط التسجيل أو الإعلان الرسمي <span className="text-[#ff7a00]">*</span>
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات أو تفاصيل إضافية
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شروط إضافية، التخصصات المقبولة، طبيعة الامتحان..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] hover:brightness-105 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-[#1e6bff]/20 cursor-pointer"
            >
              نشر المباراة فوراً
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
