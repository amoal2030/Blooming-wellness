import React, { useState, useMemo } from 'react';
import { Interview } from '../../types';
import { Mic, Search, Play, UserCheck, Calendar } from 'lucide-react';

interface InterviewsViewProps {
  interviews: Interview[];
  onOpenVideoModal: (title: string, videoUrl?: string) => void;
}

export const InterviewsView: React.FC<InterviewsViewProps> = ({
  interviews,
  onOpenVideoModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc'>('date_desc');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const topics = useMemo(() => {
    const set = new Set<string>();
    interviews.forEach((i) => {
      if (i.topic) set.add(i.topic);
    });
    return ['all', ...Array.from(set)];
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    let result = interviews.filter((i) => {
      const matchesTopic = selectedTopic === 'all' || i.topic === selectedTopic;
      const matchesQuery =
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.guestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesQuery;
    });

    result.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return b.date.localeCompare(a.date);
      } else {
        return a.date.localeCompare(b.date);
      }
    });

    return result;
  }, [interviews, selectedTopic, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-teal-300">
            <Mic className="w-3.5 h-3.5" />
            <span>المقابلات واللقاءات الحوارية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">حوارات ملهمة وتجارب واقعية</h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            لقاءات حصرية مع رواد الصحة والرياضة والناجين من الأمراض المزمنة وأصحاب قصص النجاح في تحويل مسار حياتهم إلى العافية.
          </p>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الضيف أو عنوان المقابلة..."
            className="w-full pr-10 pl-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Topic Select */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedTopic === t
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t === 'all' ? 'جميع الموضوعات' : t}
              </button>
            ))}
          </div>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            aria-label="ترتيب المقابلات حسب التاريخ"
            className="py-1.5 px-3 bg-stone-100 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="date_desc">الأحدث تاريخاً</option>
            <option value="date_asc">الأقدم تاريخاً</option>
          </select>
        </div>
      </div>

      {/* Interviews Cards */}
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
          <Mic className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">لا توجد مقابلات مطابقة للبحث</h3>
          <p className="text-xs text-stone-500 mt-1">يرجى تعديل مصطلحات البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredInterviews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group"
            >
              {/* Media Preview */}
              <div 
                onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                className="h-60 relative bg-stone-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/55 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white mr-0.5" />
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                  {item.topic}
                </div>
              </div>

              {/* Guest & Interview info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تاريخ اللقاء: {item.date}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Guest badge */}
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{item.guestName}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.guestTitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <button
                    onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>مشاهدة المقابلة كاملة</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
