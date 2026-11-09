import React, { useState, useMemo } from 'react';
import { Lecture } from '../../types';
import { getAssetUrl } from '../../utils/assets';
import { useLanguage } from '../../context/LanguageContext';
import { Video, Search, Play, User, Calendar, Clock } from 'lucide-react';

interface LecturesViewProps {
  lectures: Lecture[];
  onOpenVideoModal: (title: string, videoUrl?: string) => void;
}

export const LecturesView: React.FC<LecturesViewProps> = ({
  lectures,
  onOpenVideoModal,
}) => {
  const { t, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const topics = useMemo(() => {
    const set = new Set<string>();
    lectures.forEach((l) => {
      if (l.topic) set.add(l.topic);
    });
    return ['all', ...Array.from(set)];
  }, [lectures]);

  const filteredLectures = useMemo(() => {
    return lectures.filter((l) => {
      const matchesTopic = selectedTopic === 'all' || l.topic === selectedTopic;
      const matchesQuery =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesQuery;
    });
  }, [lectures, selectedTopic, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e3c48] via-[#134e5e] to-[#0e3c48] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className={`relative z-10 max-w-2xl space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 rounded-full text-xs font-bold text-[#84d2ea] border border-white/20">
            <Video className="w-3.5 h-3.5 text-[#389eb3]" />
            <span>{t('lectures_title', 'المحاضرات التوعوية والتثقيفية')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            {isRtl ? 'محاضرات ولقاءات إثرائية' : 'Enriching Lectures & Sessions'}
          </h1>
          <p className="text-[#d1e6ec] text-xs sm:text-sm leading-relaxed">
            {t('lectures_subtitle', 'محاضرات طبية وتثقيفية متخصصة يلقيها نخبة من الأطباء واستشاريي الرعاية الصحية')}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#122127] p-4 sm:p-6 rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center transition-colors">
        <div className="relative w-full md:w-96">
          <Search className={`w-4 h-4 text-[#526f78] dark:text-stone-400 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-3.5`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('lectures_search_placeholder', 'ابحث عن محاضرة أو طبيب...')}
            className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-[#f7fbfc] dark:bg-[#0b1519] border border-[#d0e0e6] dark:border-[#1e3842] rounded-xl text-xs text-[#0c2b33] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2e9e66]`}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {topics.map((itemTopic) => (
            <button
              key={itemTopic}
              onClick={() => setSelectedTopic(itemTopic)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer min-h-[38px] ${
                selectedTopic === itemTopic
                  ? 'bg-[#134e5e] text-white shadow-xs'
                  : 'bg-[#eaf6fa] dark:bg-[#0e2730] text-[#134e5e] dark:text-[#84d2ea] hover:bg-[#dbeef5] dark:hover:bg-[#163845]'
              }`}
            >
              {itemTopic === 'all' ? t('action_filter_all', 'الكل') : itemTopic}
            </button>
          ))}
        </div>
      </div>

      {/* Lectures Grid */}
      {filteredLectures.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] p-8 transition-colors">
          <Video className="w-12 h-12 text-[#b0ced8] dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">{t('lectures_no_items', 'لم يتم العثور على محاضرات مطابقة.')}</h3>
          <p className="text-xs text-[#526f78] dark:text-stone-400 mt-1">
            {isRtl ? 'جرب كلمات بحث مختلفة أو حدد موضوعاً آخر.' : 'Try adjusting your search terms or selecting another topic.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredLectures.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group"
            >
              {/* Thumbnail with Play Hover */}
              <div 
                onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                className="h-52 relative bg-[#f1f7f9] dark:bg-[#0b1519] overflow-hidden cursor-pointer"
              >
                <img
                  src={getAssetUrl(item.imageUrl || '/assets/images/awareness_lecture_hall_1793901820498.jpg')}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0e3c48]/30 group-hover:bg-[#0e3c48]/55 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#2e9e66] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white mr-0.5" />
                  </div>
                </div>

                <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-[#0e3c48]/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg`}>
                  {item.topic}
                </div>

                {item.duration && (
                  <div className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'} bg-[#0e3c48]/85 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1`}>
                    <Clock className="w-3 h-3 text-[#84d2ea]" />
                    <span>{item.duration}</span>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center gap-2 text-[11px] text-[#526f78] dark:text-stone-400">
                    <Calendar className="w-3.5 h-3.5 text-[#2e9e66]" />
                    <span>{t('card_date', 'التاريخ')}: {item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0e3c48] dark:text-white group-hover:text-[#2e9e66] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#134e5e] dark:text-[#84d2ea] font-semibold bg-[#eaf6fa] dark:bg-[#0e2730] p-2 rounded-xl">
                    <User className="w-3.5 h-3.5 shrink-0 text-[#2e9e66]" />
                    <span className="truncate">{item.speaker}</span>
                  </div>

                  <p className="text-xs text-[#526f78] dark:text-stone-300 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#edf3f5] dark:border-[#1e3842]">
                  <button
                    onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                    className="w-full py-2.5 bg-[#134e5e] hover:bg-[#0e3c48] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t('action_watch', 'مشاهدة المحاضرة الآن')}</span>
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
