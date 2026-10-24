import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Lock,
  Unlock,
  Building,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Calendar,
  Layers,
  Settings,
  Search,
  Sliders,
  Eye,
  EyeOff
} from 'lucide-react';
import { JobCompetition, DegreeType, SectorType } from '../types';
import { formatDate, getJobStatus } from '../utils/dateUtils';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobCompetition[];
  onAddJob: (job: JobCompetition) => void;
  onDeleteJob: (job: JobCompetition) => void;
  onRestoreDefaults: () => void;
  adminModeActive: boolean;
  onToggleAdminMode: (active: boolean) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onAddJob,
  onDeleteJob,
  onRestoreDefaults,
  adminModeActive,
  onToggleAdminMode,
}) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'settings'>('manage');
  const [searchFilter, setSearchFilter] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state for adding job
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState<'الإجازة' | 'الدبلوم' | 'الماستر' | 'الباكالوريا' | 'الدكتوراه / مهندس'>('الدبلوم');
  const [sector, setSector] = useState<'القطاع العام' | 'المؤسسات العمومية' | 'القطاع الخاص'>('القطاع العام');
  const [city, setCity] = useState('الرباط');
  const [positions, setPositions] = useState('25');
  const [link, setLink] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !link.trim() || !startDate || !endDate) {
      setFormError('يرجى ملء الحقول الإلزامية (اسم الوظيفة، الرابط، والتواريخ).');
      return;
    }

    const newJob: JobCompetition = {
      id: `admin-${Date.now()}`,
      title: title.trim(),
      institution: institution.trim() || 'إدارة عمومية',
      degree,
      sector,
      city: city.trim() || 'جميع الجهات',
      positions: parseInt(positions) || 1,
      link: link.trim(),
      start: startDate,
      end: endDate,
      description: description.trim() || `مباراة توظيف معلنة لفائدة ${institution || 'القطاع'} لحاملي ${degree}.`,
      requirements: [
        'الجنسية المغربية والتمتع بالحقوق الوطنية',
        `حاصل على شهادة أو دبلوم ${degree} في التخصص المطلوب`,
        'استيفاء شروط السن القانونية للمباراة',
      ],
      documents: [
        'طلب خطي موجه للإدارة المعنية',
        'نسخة من بطاقة التعريف الوطنية الإلكترونية',
        'نسخة مصادق عليها من الدبلوم أو الشهادة المطلوبة',
        'سيرة ذاتية (CV)',
      ],
      selectionStages: [
        'انتقاء أولي بناءً على دراسة الملفات',
        'اختبار كتابي في مادة التخصص والموضوع العام',
        'اختبار شفوي ومقابلة مع اللجنة',
      ],
      featured: false,
    };

    onAddJob(newJob);
    setFormSuccess(true);
    setFormError('');
    // reset form
    setTitle('');
    setInstitution('');
    setLink('');
    setDescription('');
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('manage');
    }, 1200);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      j.institution.toLowerCase().includes(searchFilter.toLowerCase()) ||
      j.degree.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleDeleteClosedJobs = () => {
    const closedJobs = jobs.filter((j) => getJobStatus(j.start, j.end).k === 'closed');
    if (closedJobs.length === 0) {
      alert('لا توجد مباريات منتهية حالياً.');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف ${closedJobs.length} مباراة منتهية التسجيل؟`)) {
      closedJobs.forEach((j) => onDeleteJob(j));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
        {/* Top gradient highlight strip */}
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-neutral-900 via-[#1e6bff] to-[#ff7a00]" />

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-[#ff7a00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950">
                  لوحة الإدارة والتحكم الخاصة بي
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-900 text-white">
                  المشرف
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                مكانك الخاص لإضافة مباريات جديدة، حذف المباريات، واسترجاع القائمة الافتراضية.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-neutral-900 transition cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap gap-2 pb-4 mb-6 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>إدارة وحذف المباريات ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'add'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ إضافة مباراة جديدة</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-[#ff7a00]" />
            <span>إعدادات التحكم والاسترجاع</span>
          </button>
        </div>

        {/* Tab 1: Manage & Delete Jobs */}
        {activeTab === 'manage' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="بحث سريع في المباريات لحذفها..."
                  className="w-full bg-white border border-slate-300 rounded-xl pr-9 pl-3 py-1.5 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDeleteClosedJobs}
                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="حذف جميع المباريات التي انتهى أجلها"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>تنظيف المنتهية</span>
                </button>
                <button
                  onClick={onRestoreDefaults}
                  className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="استرجاع جميع المباريات الرسمية"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>استرجاع الكل</span>
                </button>
              </div>
            </div>

            {/* Jobs Management List */}
            <div className="max-h-[50vh] overflow-y-auto space-y-2.5 pr-1">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const st = getJobStatus(job.start, job.end);
                  return (
                    <div
                      key={job.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition shadow-sm"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              st.k === 'open'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : st.k === 'soon'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                            }`}
                          >
                            {st.label}
                          </span>
                          <span className="text-xs font-bold text-neutral-800">{job.institution}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-600 font-semibold">{job.degree}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{job.positions} منصب</span>
                        </div>
                        <h4 className="font-bold text-sm text-neutral-900 leading-snug">
                          {job.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>بداية: {formatDate(job.start)}</span>
                          <span>آخر أجل: {formatDate(job.end)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {confirmDeleteId === job.id ? (
                          <div className="flex items-center gap-1.5 animate-up">
                            <span className="text-xs text-red-600 font-bold">تأكيد الحذف؟</span>
                            <button
                              onClick={() => {
                                onDeleteJob(job);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                              نعم، حذف
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(job.id)}
                            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            title="حذف هذه المباراة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف المباراة</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                  لا توجد مباريات مطابقة للبحث
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Add New Job Form */}
        {activeTab === 'add' && (
          <form onSubmit={handleCreateJob} className="space-y-4">
            {formSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-up">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>تمت إضافة المباراة بنجاح إلى المنصة!</span>
              </div>
            )}

            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-bold animate-up">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اسم الوظيفة أو المباراة <span className="text-[#ff7a00]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: متصرف من الدرجة الثانية، تقني في الكهرباء..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  المؤسسة / الوزارة / المشغل <span className="text-[#ff7a00]">*</span>
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="مثال: وزارة الاقتصاد والمالية"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  المستوى المطلوب <span className="text-[#ff7a00]">*</span>
                </label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 font-semibold focus:bg-white focus:outline-none"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 font-semibold focus:bg-white focus:outline-none"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">عدد المناصب</label>
                <input
                  type="number"
                  min="1"
                  value={positions}
                  onChange={(e) => setPositions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
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
                placeholder="https://emploi-public.ma..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                تفاصيل وشروط إضافية
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="التخصصات المقبولة، طبيعة الامتحان، سلم الأجور..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-lg shadow-neutral-900/20 transition cursor-pointer"
              >
                حفظ ونشر المباراة
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Settings & Restore Defaults */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            {/* Direct Delete Buttons Toggle */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-neutral-900">
                    إظهار أزرار الحذف المباشرة في البطاقات الرئيسية
                  </h4>
                  {adminModeActive ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      مفعل
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      معطل (للزوار)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  عند تفعيل هذا الخيار، ستظهر أيقونة الحذف 🗑️ مباشرة على بطاقات المباريات أثناء تصفح الموقع لتسهيل الحذف السريع لك.
                </p>
              </div>

              <button
                onClick={() => onToggleAdminMode(!adminModeActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                  adminModeActive
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {adminModeActive ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                <span>{adminModeActive ? 'تعطيل الحذف المباشر' : 'تفعيل الحذف المباشر'}</span>
              </button>
            </div>

            {/* Restore Competitions Section */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#1e6bff]" />
                <h4 className="font-bold text-sm text-neutral-900">
                  استرجاع جميع المباريات الافتراضية
                </h4>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                في حالة قمت بحذف مباريات وترغب في استرجاع جميع مباريات التوظيف الرسمية الأصلية (الجمارك، الأمن، المالية، الصحة، العدل، الفوسفاط...)، اضغط على هذا الزر:
              </p>
              <div>
                <button
                  onClick={() => {
                    onRestoreDefaults();
                    setActiveTab('manage');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#1e6bff]/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>استرجاع جميع المباريات الافتراضية الآن</span>
                </button>
              </div>
            </div>

            {/* Platform Stats & Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block mb-1">المباريات الإجمالية</span>
                <span className="text-xl font-black text-neutral-900">{jobs.length}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block mb-1">المفتوحة حالياً</span>
                <span className="text-xl font-black text-emerald-600">
                  {jobs.filter((j) => getJobStatus(j.start, j.end).k === 'open').length}
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-500 block mb-1">المناصب الشاغرة</span>
                <span className="text-xl font-black text-[#ff7a00]">
                  +{jobs.reduce((acc, j) => acc + (j.positions || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
