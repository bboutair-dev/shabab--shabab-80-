/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Heart,
  Plus,
  FileText,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Users,
  Briefcase,
  GraduationCap,
  Sliders,
  Settings,
} from 'lucide-react';
import { JobCompetition, DegreeType, SectorType } from './types';
import { INITIAL_JOBS } from './data/jobsData';
import { getJobStatus } from './utils/dateUtils';
import { JobCard } from './components/JobCard';
import { JobDetailsModal } from './components/JobDetailsModal';
import { DemandeGeneratorModal } from './components/DemandeGeneratorModal';
import { AddJobModal } from './components/AddJobModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { AdminPanelModal } from './components/AdminPanelModal';

export default function App() {
  // State for all jobs (stored in localStorage with fallback to INITIAL_JOBS)
  const [jobs, setJobs] = useState<JobCompetition[]>(() => {
    try {
      const saved = localStorage.getItem('shabab_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_JOBS;
  });

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shabab_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<SectorType>('الكل');
  const [sortBy, setSortBy] = useState<'soonest' | 'newest' | 'positions'>('soonest');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Modals and Admin Panel States
  const [selectedJob, setSelectedJob] = useState<JobCompetition | null>(null);
  const [isDemandeModalOpen, setIsDemandeModalOpen] = useState(false);
  const [demandeJobTarget, setDemandeJobTarget] = useState<JobCompetition | null>(null);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobCompetition | null>(null);
  const [recentlyDeletedJob, setRecentlyDeletedJob] = useState<JobCompetition | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminModeActive, setAdminModeActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('shabab_admin_mode') !== 'false';
    } catch {
      return true;
    }
  });

  // Sync jobs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shabab_jobs', JSON.stringify(jobs));
    } catch (e) {
      console.error(e);
    }
  }, [jobs]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shabab_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  // Show notification toast helper
  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // Delete Job Handler
  const handleConfirmDelete = (job: JobCompetition) => {
    setJobs((prev) => prev.filter((item) => item.id !== job.id));
    setBookmarkedIds((prev) => prev.filter((id) => id !== job.id));
    if (selectedJob?.id === job.id) {
      setSelectedJob(null);
    }
    setRecentlyDeletedJob(job);
    showToast(`تم حذف مباراة "${job.title}" بنجاح 🗑️`);
  };

  // Undo Delete Handler
  const handleUndoDelete = () => {
    if (recentlyDeletedJob) {
      setJobs((prev) => [recentlyDeletedJob, ...prev]);
      showToast(`تمت استعادة مباراة "${recentlyDeletedJob.title}" بنجاح`);
      setRecentlyDeletedJob(null);
    }
  };

  // Restore All Defaults Handler
  const handleRestoreDefaults = () => {
    setJobs(INITIAL_JOBS);
    localStorage.setItem('shabab_jobs', JSON.stringify(INITIAL_JOBS));
    setRecentlyDeletedJob(null);
    showToast('تمت استعادة جميع المباريات الافتراضية بنجاح 🔄');
  };

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'تمت إزالة المباراة من المفضلة' : 'تم حفظ المباراة في المفضلة ❤️');
      return updated;
    });
  };

  // Add new job
  const handleAddJob = (newJob: JobCompetition) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast('تمت إضافة المباراة بنجاح إلى قائمتك!');
  };

  // Open demande generator for specific job
  const handleOpenDemandeGenerator = (job: JobCompetition) => {
    setDemandeJobTarget(job);
    setIsDemandeModalOpen(true);
  };

  // Share handler
  const handleShare = (job: JobCompetition) => {
    const text = `🔥 فرصة توظيف جديدة: ${job.title} لدى ${job.institution}\nالمستوى: ${job.degree}\nآخر أجل: ${job.end}\nالتفاصيل: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('تم نسخ رابط وتفاصيل المباراة للمشاركة!');
    }
  };

  // Calculations for quick stats
  const stats = useMemo(() => {
    let openCount = 0;
    let soonCount = 0;
    let totalPositions = 0;

    jobs.forEach((j) => {
      const st = getJobStatus(j.start, j.end);
      if (st.k === 'open') openCount++;
      if (st.k === 'soon') soonCount++;
      totalPositions += j.positions || 0;
    });

    return {
      all: jobs.length,
      open: openCount,
      soon: soonCount,
      totalPositions,
    };
  }, [jobs]);

  // Filtered and sorted jobs list
  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return jobs
      .filter((j) => {
        const st = getJobStatus(j.start, j.end);

        // Filter chip logic
        let matchesChip = true;
        if (activeFilter === 'all') {
          matchesChip = true;
        } else if (activeFilter === 'open') {
          matchesChip = st.k === 'open';
        } else if (activeFilter === 'soon') {
          matchesChip = st.k === 'soon';
        } else {
          matchesChip = j.degree === activeFilter;
        }

        // Bookmark filter
        if (showOnlyBookmarks && !bookmarkedIds.includes(j.id)) {
          return false;
        }

        // Sector filter
        if (selectedSector !== 'الكل' && j.sector !== selectedSector) {
          return false;
        }

        // Search query filter
        const matchesQuery =
          !q ||
          j.title.toLowerCase().includes(q) ||
          j.institution.toLowerCase().includes(q) ||
          j.degree.toLowerCase().includes(q) ||
          j.city.toLowerCase().includes(q);

        return matchesChip && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'soonest') {
          return new Date(a.end).getTime() - new Date(b.end).getTime();
        } else if (sortBy === 'newest') {
          return new Date(b.start).getTime() - new Date(a.start).getTime();
        } else if (sortBy === 'positions') {
          return (b.positions || 0) - (a.positions || 0);
        }
        return 0;
      });
  }, [jobs, searchQuery, activeFilter, showOnlyBookmarks, bookmarkedIds, selectedSector, sortBy]);

  const resetAllFilters = () => {
    setActiveFilter('all');
    setSelectedSector('الكل');
    setSearchQuery('');
    setShowOnlyBookmarks(false);
    setSortBy('soonest');
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 pb-16 selection:bg-[#ff7a00]/20 selection:text-neutral-900 font-['Cairo',sans-serif]">
      {/* Subtle ambient pastel glow */}
      <div className="bg-ambient-blue" />
      <div className="bg-ambient-orange" />

      {/* Toast Notification with Undo */}
      {notificationToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-up text-sm font-bold border border-neutral-700">
          <CheckCircle2 className="w-5 h-5 text-[#ff7a00] shrink-0" />
          <span>{notificationToast}</span>
          {recentlyDeletedJob && (
            <button
              onClick={handleUndoDelete}
              className="px-2.5 py-1 rounded-lg bg-[#ff7a00]/20 hover:bg-[#ff7a00]/30 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-bold transition mr-2 shrink-0 cursor-pointer"
            >
              تراجع ↩
            </button>
          )}
        </div>
      )}

      {/* Main Container */}
      <div className="w-[min(1180px,94%)] mx-auto relative z-10">
        {/* Navigation Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-neutral-900 via-[#ff7a00] to-[#1e6bff] bg-clip-text text-transparent flex items-center gap-1.5 hover:opacity-95 transition"
            >
              <span>⚡ شباب</span>
            </a>
            <span className="hidden sm:inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              مباريات التوظيف والوظيفة العمومية
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setDemandeJobTarget(null);
                setIsDemandeModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-neutral-800 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#ff7a00]" />
              <span>مولد الطلب الخطي</span>
            </button>

            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`px-3.5 py-2 rounded-full border text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                showOnlyBookmarks
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-neutral-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${bookmarkedIds.length > 0 ? 'text-rose-600' : ''}`} />
              <span>المفضلة</span>
              {bookmarkedIds.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>

            {/* Dedicated Private Admin & Management Panel Button */}
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-md shadow-neutral-900/15 cursor-pointer"
              title="لوحة الإعدادات والتحكم الخاصة بي (إضافة، استرجاع، وحذف المباريات)"
            >
              <Sliders className="w-4 h-4 text-[#ff7a00]" />
              <span>لوحة التحكم الخاصة بي</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>
        </header>

        {/* Hero Section with Group of Youth Image */}
        <section className="pt-8 pb-6 sm:pt-12 sm:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Right text content in RTL */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs sm:text-sm text-neutral-900 font-bold shadow-sm">
                <span className="text-[#ff7a00]">🔥</span>
                <span>فرص عمل ومباريات جديدة للشباب 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 leading-[1.25]">
                لقا{' '}
                <span className="bg-gradient-to-r from-[#1e6bff] via-[#ff7a00] to-neutral-900 bg-clip-text text-transparent">
                  الوظيفة
                </span>{' '}
                لي كتحلم بها
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                مباريات التوظيف والوظيفة العمومية لحاملي الإجازة، الدبلوم، الماستر والباكالوريا. شوف الشروط، الوثائق، الروابط المباشرة وآخر أجل قبل ما تفوتك الفرصة.
              </p>

              {/* Search Bar matching user request with white card and black text */}
              <div className="bg-white p-2 rounded-2xl border border-slate-300 shadow-lg shadow-slate-200/60 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex-1 w-full flex items-center">
                  <Search className="w-5 h-5 text-slate-400 mr-3 ml-2 shrink-0" />
                  <input
                    id="q"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="قلب على وظيفة... (مثال: تقني، مهندس، إداري، جمارك)"
                    className="w-full bg-transparent border-0 outline-none text-neutral-900 text-sm sm:text-base placeholder:text-slate-400 py-2 px-1 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 text-xs text-slate-500 hover:text-neutral-900 rounded-lg cursor-pointer"
                    >
                      مسح
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {}}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] hover:brightness-105 transition shadow-md shadow-[#1e6bff]/20 shrink-0 cursor-pointer"
                >
                  بحث
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-sm">
                  <b className="block text-xl sm:text-2xl font-black text-[#ff7a00]">{stats.all}</b>
                  <small className="text-slate-500 text-xs font-bold">مباراة معلنة</small>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-sm">
                  <b className="block text-xl sm:text-2xl font-black text-emerald-600">{stats.open}</b>
                  <small className="text-slate-500 text-xs font-bold">مفتوحة الآن</small>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-sm">
                  <b className="block text-xl sm:text-2xl font-black text-[#1e6bff]">{stats.soon}</b>
                  <small className="text-slate-500 text-xs font-bold">تبدأ قريباً</small>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-sm">
                  <b className="block text-xl sm:text-2xl font-black text-amber-600">
                    +{stats.totalPositions.toLocaleString('ar-MA')}
                  </b>
                  <small className="text-slate-500 text-xs font-bold">منصب شاغر</small>
                </div>
              </div>
            </div>

            {/* Left Image Showcase of Youth Job Search */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                <img
                  src="/src/assets/images/youth_job_search_1792525391075.jpg"
                  alt="مجموعة من الشباب يبحثون عن العمل ومباريات التوظيف"
                  referrerPolicy="no-referrer"
                  className="w-full h-[280px] sm:h-[360px] lg:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Overlay Badge with youth job counter */}
                <div className="absolute bottom-4 right-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ff7a00] flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">شباب طموح يبحث عن عمل</div>
                      <div className="text-[11px] text-slate-500">منصة رقمية موجهة لجميع الكفاءات</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    مباشر ومجاني
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Chips */}
        <section id="filters" className="my-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => {
                setActiveFilter('all');
                setShowOnlyBookmarks(false);
              }}
              className={`cursor-pointer px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition duration-200 border ${
                activeFilter === 'all' && !showOnlyBookmarks
                  ? 'bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] border-transparent font-bold text-white shadow-md'
                  : 'bg-white border-slate-300 text-neutral-800 hover:border-[#ff7a00] shadow-sm'
              }`}
            >
              الكل
            </button>

            <button
              onClick={() => {
                setActiveFilter('الإجازة');
                setShowOnlyBookmarks(false);
              }}
              className={`cursor-pointer px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition duration-200 border ${
                activeFilter === 'الإجازة' && !showOnlyBookmarks
                  ? 'bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] border-transparent font-bold text-white shadow-md'
                  : 'bg-white border-slate-300 text-neutral-800 hover:border-[#ff7a00] shadow-sm'
              }`}
            >
              الإجازة
            </button>

            <button
              onClick={() => {
                setActiveFilter('الدبلوم');
                setShowOnlyBookmarks(false);
              }}
              className={`cursor-pointer px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition duration-200 border ${
                activeFilter === 'الدبلوم' && !showOnlyBookmarks
                  ? 'bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] border-transparent font-bold text-white shadow-md'
                  : 'bg-white border-slate-300 text-neutral-800 hover:border-[#ff7a00] shadow-sm'
              }`}
            >
              الدبلوم
            </button>

            <button
              onClick={() => {
                setActiveFilter('الماستر');
                setShowOnlyBookmarks(false);
              }}
              className={`cursor-pointer px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition duration-200 border ${
                activeFilter === 'الماستر' && !showOnlyBookmarks
                  ? 'bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] border-transparent font-bold text-white shadow-md'
                  : 'bg-white border-slate-300 text-neutral-800 hover:border-[#ff7a00] shadow-sm'
              }`}
            >
              الماستر
            </button>

            <button
              onClick={() => {
                setActiveFilter('الباكالوريا');
                setShowOnlyBookmarks(false);
              }}
              className={`cursor-pointer px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition duration-200 border ${
                activeFilter === 'الباكالوريا' && !showOnlyBookmarks
                  ? 'bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] border-transparent font-bold text-white shadow-md'
                  : 'bg-white border-slate-300 text-neutral-800 hover:border-[#ff7a00] shadow-sm'
              }`}
            >
              الباكالوريا
            </button>

            <button
              onClick={() => {
                setActiveFilter('open');
                setShowOnlyBookmarks(false);
              }}
              className={`cursor-pointer px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition duration-200 border flex items-center gap-1.5 ${
                activeFilter === 'open' && !showOnlyBookmarks
                  ? 'bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] border-transparent font-bold text-white shadow-md'
                  : 'bg-white border-slate-300 text-neutral-800 hover:border-[#ff7a00] shadow-sm'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              مفتوحة الآن
            </button>

            <button
              onClick={() => {
                setActiveFilter('soon');
                setShowOnlyBookmarks(false);
              }}
              className={`cursor-pointer px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition duration-200 border ${
                activeFilter === 'soon' && !showOnlyBookmarks
                  ? 'bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] border-transparent font-bold text-white shadow-md'
                  : 'bg-white border-slate-300 text-neutral-800 hover:border-[#ff7a00] shadow-sm'
              }`}
            >
              قريباً
            </button>
          </div>

          {/* Secondary Filter controls: Sector + Sorting */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-xs text-slate-600">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-neutral-900 font-bold flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff7a00]" />
                القطاع:
              </span>
              {(['الكل', 'القطاع العام', 'المؤسسات العمومية', 'القطاع الخاص'] as SectorType[]).map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    selectedSector === sec
                      ? 'bg-neutral-900 text-white font-bold'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-900 font-bold">الترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-neutral-900 font-semibold focus:outline-none"
              >
                <option value="soonest">الأقرب انتهاءً ⏳</option>
                <option value="newest">الأحدث نشراً 📅</option>
                <option value="positions">الأكثر مناصب 👥</option>
              </select>

              {(activeFilter !== 'all' || selectedSector !== 'الكل' || searchQuery || showOnlyBookmarks) && (
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-[#ff7a00] hover:underline mr-2 font-bold cursor-pointer"
                  title="إعادة ضبط الفلاتر"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة ضبط</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4 px-1 text-xs sm:text-sm text-slate-500 font-semibold">
          <span>
            عرض <strong className="text-neutral-900 font-bold">{filteredJobs.length}</strong> مباراة
            {showOnlyBookmarks ? ' (المفضلة)' : ''}
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            تحديث تلقائي
          </span>
        </div>

        {/* Jobs Grid */}
        <main id="jobs" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => {
              const statusInfo = getJobStatus(job.start, job.end);
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  statusInfo={statusInfo}
                  index={index}
                  isBookmarked={bookmarkedIds.includes(job.id)}
                  onToggleBookmark={toggleBookmark}
                  onSelectJob={(j) => setSelectedJob(j)}
                  onShare={handleShare}
                  onDeleteJob={(j) => setJobToDelete(j)}
                  showDeleteButton={adminModeActive}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="text-4xl mb-3">😕</div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">
                ما لقينا حتى نتيجة مطابقة لبحثك
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 font-medium">
                جرب كلمة بحث أخرى، أو بدّل تصنيف الدبلوم، أو افتح لوحة التحكم الخاصة بك لإضافة أو استرجاع المباريات.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#1e6bff]/20 cursor-pointer"
                >
                  عرض كل المباريات المتاحة
                </button>
                <button
                  onClick={() => setIsAdminPanelOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sliders className="w-4 h-4 text-[#ff7a00]" />
                  <span>فتح لوحة التحكم الخاصة بي</span>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Value Section: Moroccan Concours Preparation Guide & Tips */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 my-8 relative overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff7a00]" />
                دليل المترشح للمباريات
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                وجّد ملف ترشيحك في دقائق بدون أخطاء إدارية
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                استعمل أداة مولد الطلب الخطي لإنشاء رسالة إدارية رسمية معتمدة، وتأكد من مطابقة شواهدك للدرجة والسلم المطلوب قبل انتهاء الأجل القانوني.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setDemandeJobTarget(null);
                  setIsDemandeModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:brightness-105 shadow-md shadow-[#ff7a00]/20 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                إنشاء طلب خطي الآن
              </button>
            </div>
          </div>
        </section>

        {/* Modals */}
        <JobDetailsModal
          job={selectedJob}
          statusInfo={selectedJob ? getJobStatus(selectedJob.start, selectedJob.end) : null}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          isBookmarked={selectedJob ? bookmarkedIds.includes(selectedJob.id) : false}
          onToggleBookmark={toggleBookmark}
          onOpenDemandeGenerator={handleOpenDemandeGenerator}
          onDeleteJob={(j) => {
            setSelectedJob(null);
            setJobToDelete(j);
          }}
        />

        <ConfirmDeleteModal
          job={jobToDelete}
          isOpen={!!jobToDelete}
          onClose={() => setJobToDelete(null)}
          onConfirm={handleConfirmDelete}
        />

        <DemandeGeneratorModal
          job={demandeJobTarget}
          isOpen={isDemandeModalOpen}
          onClose={() => {
            setIsDemandeModalOpen(false);
            setDemandeJobTarget(null);
          }}
        />

        <AddJobModal
          isOpen={isAddJobModalOpen}
          onClose={() => setIsAddJobModalOpen(false)}
          onAddJob={handleAddJob}
        />

        <AdminPanelModal
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          jobs={jobs}
          onAddJob={handleAddJob}
          onDeleteJob={handleConfirmDelete}
          onRestoreDefaults={handleRestoreDefaults}
          adminModeActive={adminModeActive}
          onToggleAdminMode={(active) => {
            setAdminModeActive(active);
            localStorage.setItem('shabab_admin_mode', active ? 'true' : 'false');
          }}
        />

        {/* Footer */}
        <footer className="text-center text-slate-500 pt-8 pb-4 border-t border-slate-200 text-xs sm:text-sm space-y-2">
          <p className="font-semibold text-neutral-800">© 2026 شباب - منصة مباريات التوظيف والوظيفة العمومية بالمغرب. جميع الحقوق محفوظة.</p>
          <p className="text-[11px] text-slate-500">
            يتم تحديث مواعيد التسجيل والشروط بصفة مستمرة اعتماداً على الإعلانات الرسمية للوزارات والمؤسسات العمومية.
          </p>
        </footer>
      </div>
    </div>
  );
}
