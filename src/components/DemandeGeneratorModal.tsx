import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Printer, FileText, Sparkles } from 'lucide-react';
import { JobCompetition } from '../types';

interface DemandeGeneratorModalProps {
  job: JobCompetition | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DemandeGeneratorModal: React.FC<DemandeGeneratorModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState('يوسف العلوي');
  const [cin, setCin] = useState('AB123456');
  const [phone, setPhone] = useState('0612345678');
  const [email, setEmail] = useState('youssef.alaoui@gmail.com');
  const [address, setAddress] = useState('حي الرياض، زنقة 15، رقم 24، الرباط');
  const [targetRecipient, setTargetRecipient] = useState(
    job ? `السيد(ة) وزير / مدير ${job.institution}` : 'السيد وزير الشؤون الإدارية'
  );
  const [degreeSpecialty, setDegreeSpecialty] = useState(
    job ? `${job.degree} في التخصص المطلوب` : 'الإجازة في الدراسات القانونية'
  );
  const [competitionName, setCompetitionName] = useState(
    job ? job.title : 'مباراة التوظيف'
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (job) {
      setCompetitionName(job.title);
      setTargetRecipient(`السيد(ة) وزير / مدير ${job.institution}`);
      setDegreeSpecialty(`شهادة ${job.degree} في التخصص المطلوب`);
    }
  }, [job]);

  if (!isOpen) return null;

  const generatedLetter = `الاسم الكامل: ${fullName}
رقم البطاقة الوطنية (CNIE): ${cin}
العنوان: ${address}
رقم الهاتف: ${phone}
البريد الإلكتروني: ${email}

إلى السيد(ة) المحترم(ة):
${targetRecipient}

الموضوع: طلب المشاركة في ${competitionName}

سلام تام بوجود مولانا الإمام المؤيد بالله،

وبعد،
يشرفني بكل احترام وإجلال أن أتقدم إلى سيادتكم الموقرة بطلبي هذا من أجل اجتياز مباراة: ${competitionName} المعلن عنها من طرف مؤسستكم المحترمة.

وأحيطكم علماً سيدي المحترم، أنني مواطن(ة) مغربي(ة)، حاصل(ة) على ${degreeSpecialty}، وتتوفر في كافة الشروط النظامية والمؤهلات العلمية والعملية المطلوبة لخوض غمار هذه المباراة والمساهمة بكفاءة في خدمة إدارتكم الموقرة.

وتجدون رفقة طلبي هذا كافة الوثائق والمستندات المطلوبة والمكونة لملف ترشيحي.

وفي انتظار تفضلكم بقبول ترشيحي لاجتياز الاختبارات المقررة، تفضلوا سيدي المحترم، بقبول فائق عبارات التقدير والاحترام وخالص عبارات الولاء والإخلاص.

والسلام.

حرر بتاريخ: ${new Date().toLocaleDateString('ar-MA')}

إمضاء المترشح(ة):
${fullName}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl" lang="ar">
          <head>
            <title>طلب خطي - ${fullName}</title>
            <style>
              body { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; padding: 40px; line-height: 2; font-size: 14pt; color: #000; }
              .header { margin-bottom: 30px; font-weight: bold; }
              .to { text-align: center; margin: 30px 0; font-size: 16pt; font-weight: bold; }
              .subject { margin-bottom: 25px; font-weight: bold; text-decoration: underline; }
              .body { text-align: justify; text-indent: 30px; }
              .footer { margin-top: 50px; display: flex; justify-content: space-between; font-weight: bold; }
            </style>
          </head>
          <body>
            <pre style="white-space: pre-wrap; font-family: inherit;">${generatedLetter}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Header decoration */}
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#1e6bff] via-[#ff7a00] to-slate-200" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff7a00] flex items-center justify-center text-xl border border-orange-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                مولد الطلب الخطي الإداري
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  معتمد للمباريات المغربية
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                صيغة رسمية مطابقة للمواصفات الإدارية، جاهزة للطباعة أو النسخ والتقديم.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff7a00]" />
              المعلومات الشخصية للمترشح(ة)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم الكامل</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
                placeholder="مثال: يوسف العلوي"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم البطاقة الوطنية (CNIE)</label>
                <input
                  type="text"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
                  placeholder="مثال: AB123456"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
                  placeholder="0612345678"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
                placeholder="example@mail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">العنوان الشخصي والمدينة</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
                placeholder="الحي، الشارع، المدينة"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الجهة الموجه إليها الطلب</label>
              <input
                type="text"
                value={targetRecipient}
                onChange={(e) => setTargetRecipient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
                placeholder="مثلاً: السيد وزير الاقتصاد والمالية"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">المباراة والمنصب</label>
                <input
                  type="text"
                  value={competitionName}
                  onChange={(e) => setCompetitionName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
                  placeholder="مباراة توظيف..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الشهادة / الدبلوم والتخصص</label>
                <input
                  type="text"
                  value={degreeSpecialty}
                  onChange={(e) => setDegreeSpecialty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#ff7a00]"
                  placeholder="شهادة الإجازة في القانون"
                />
              </div>
            </div>
          </div>

          {/* Letter Preview Section */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                معاينة الطلب الرسمي
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    copied
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'تم النسخ بنجاح!' : 'نسخ الطلب'}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1e6bff] to-[#ff7a00] text-white hover:opacity-95 transition shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  طباعة / PDF
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-y-auto max-h-[380px] text-xs leading-relaxed font-sans text-neutral-800 whitespace-pre-wrap select-all">
              {generatedLetter}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center font-medium">
              💡 نصيحة: يمكنك نسخ النص أو طباعته مباشرة وتقديمه مع توقيعك اليدوي في أسفل الورقة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
