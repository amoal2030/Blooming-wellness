import React, { useState } from 'react';
import { RegistrationItem } from '../../types';
import { ClipboardList, ExternalLink, Calendar, Check, Copy, AlertCircle } from 'lucide-react';

interface RegistrationsViewProps {
  registrations: RegistrationItem[];
}

export const RegistrationsView: React.FC<RegistrationsViewProps> = ({ registrations }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-emerald-300">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>بوابة التسجيل والمشاركة</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">التسجيل في الأنشطة والبرامج التوعوية</h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            بادر بالتسجيل في ورش العمل والبرامج التطوعية والفحوصات الوقائية الميدانية عبر روابط التسجيل الرسمية المعتمدة لكل نشاط.
          </p>
        </div>
      </div>

      {/* Registrations Grid */}
      {registrations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
          <ClipboardList className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">لا توجد أنشطة مطروحة للتسجيل حالياً</h3>
          <p className="text-xs text-stone-500 mt-1">تابع هذه الصفحة باستمرار لمواكبة البرامج القادمة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registrations.map((item) => {
            const isOpen = item.status === 'open';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group ${
                  isOpen ? 'border-stone-200' : 'border-stone-200/60 opacity-80'
                }`}
              >
                {/* Thumbnail */}
                <div className="h-48 relative bg-stone-100 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3">
                    {isOpen ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>التسجيل مفتوح</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-stone-200 text-stone-700 border border-stone-300">
                        التسجيل مغلق
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs flex items-center gap-2 text-stone-600">
                      <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>آخر موعد للتسجيل: <strong className="text-stone-800">{item.deadline}</strong></span>
                    </div>
                  </div>

                  {/* External Link Action */}
                  <div className="pt-4 border-t border-stone-100 flex items-center gap-2">
                    {isOpen ? (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-center"
                      >
                        <span>التسجيل في النشاط</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 py-3 px-4 bg-stone-200 text-stone-500 text-xs font-bold rounded-xl cursor-not-allowed text-center"
                      >
                        انتهت فترة التسجيل
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyLink(item.id, item.externalUrl)}
                      className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                      title="نسخ رابط التسجيل"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
