import React, { useState, useMemo } from 'react';
import { Interview } from '../../types';
import { getAssetUrl } from '../../utils/assets';
import { useLanguage } from '../../context/LanguageContext';
import { Mic, Search, Play, UserCheck, Calendar } from 'lucide-react';

interface InterviewsViewProps {
  interviews: Interview[];
  onOpenVideoModal: (title: string, videoUrl?: string) => void;
}

export const InterviewsView: React.FC<InterviewsViewProps> = ({
  interviews,
  onOpenVideoModal,
}) => {
  const { t, isRtl } = useLanguage();
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
      <div className="bg-gradient-to-r from-[#0e3c48] via-[#134e5e] to-[#0e3c48] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className={`relative z-10 max-w-2xl space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 rounded-full text-xs font-bold text-[#84d2ea] border border-white/20">
            <Mic className="w-3.5 h-3.5 text-[#ea8c38]" />
            <span>{t('interviews_title', 'المقابلات واللقاءات الحوارية')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            {isRtl ? 'حوارات وتجارب ملهمة' : 'Inspiring Talks & Journeys'}
          </h1>
          <p className="text-[#d1e6ec] text-xs sm:text-sm leading-relaxed">
            {t('interviews_subtitle', 'حوارات مرئية شيقة مع خبراء الصحة ورياضيين ملهمين حول تغيير نمط الحياة')}
          </p>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white dark:bg-[#122127] p-4 sm:p-6 rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center transition-colors">
        <div className="relative w-full md:w-80">
          <Search className={`w-4 h-4 text-[#526f78] dark:text-stone-400 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-3.5`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('interviews_search_placeholder', 'ابحث في المقابلات أو أسماء الضيوف...')}
            className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-[#f7fbfc] dark:bg-[#0b1519] border border-[#d0e0e6] dark:border-[#1e3842] rounded-xl text-xs text-[#0c2b33] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2e9e66]`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Topic Select */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {topics.map((itemTopic) => (
              <button
                key={itemTopic}
                onClick={() => setSelectedTopic(itemTopic)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTopic === itemTopic
                    ? 'bg-[#134e5e] text-white shadow-xs'
                    : 'bg-[#eaf6fa] dark:bg-[#0e2730] text-[#134e5e] dark:text-[#84d2ea] hover:bg-[#dbeef5] dark:hover:bg-[#163845]'
                }`}
              >
                {itemTopic === 'all' ? t('action_filter_all', 'الكل') : itemTopic}
              </button>
            ))}
          </div>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            aria-label={t('sort_by_date', 'ترتيب المقابلات حسب التاريخ')}
            className="py-2 px-3 bg-[#f7fbfc] dark:bg-[#0b1519] border border-[#d0e0e6] dark:border-[#1e3842] rounded-xl text-xs font-bold text-[#134e5e] dark:text-[#84d2ea] focus:outline-none cursor-pointer"
          >
            <option value="date_desc">{isRtl ? 'الأحدث تاريخاً' : 'Newest First'}</option>
            <option value="date_asc">{isRtl ? 'الأقدم تاريخاً' : 'Oldest First'}</option>
          </select>
        </div>
      </div>

      {/* Interviews Cards */}
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] p-8 transition-colors">
          <Mic className="w-12 h-12 text-[#b0ced8] dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">{t('interviews_no_items', 'لم يتم العثور على مقابلات حوارية مطابقة.')}</h3>
          <p className="text-xs text-[#526f78] dark:text-stone-400 mt-1">
            {isRtl ? 'يرجى تعديل مصطلحات البحث.' : 'Please adjust your search terms.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredInterviews.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group"
            >
              {/* Media Preview */}
              <div 
                onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                className="h-60 relative bg-[#f1f7f9] dark:bg-[#0b1519] overflow-hidden cursor-pointer"
              >
                <img
                  src={getAssetUrl(item.imageUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80')}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0e3c48]/35 group-hover:bg-[#0e3c48]/55 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#2e9e66] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white mr-0.5" />
                  </div>
                </div>

                <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-[#0e3c48]/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg`}>
                  {item.topic}
                </div>
              </div>

              {/* Guest & Interview info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className={`space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center justify-between text-[11px] text-[#526f78] dark:text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#2e9e66]" />
                      <span>{t('card_date', 'التاريخ')}: {item.date}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#0e3c48] dark:text-white group-hover:text-[#2e9e66] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Guest badge */}
                  <div className="p-3.5 bg-[#f7fbfc] dark:bg-[#0b1519] rounded-2xl border border-[#dbe8ed] dark:border-[#1e3842] flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#e8f7ee] dark:bg-[#0e2c22] text-[#2e9e66] flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0e3c48] dark:text-white">{item.guestName}</h4>
                      <p className="text-[11px] text-[#526f78] dark:text-stone-400 mt-0.5">{item.guestTitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#526f78] dark:text-stone-300 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#edf3f5] dark:border-[#1e3842]">
                  <button
                    onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                    className="w-full py-2.5 bg-[#2e9e66] hover:bg-[#248354] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t('action_watch', 'مشاهدة المقابلة كاملة')}</span>
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
