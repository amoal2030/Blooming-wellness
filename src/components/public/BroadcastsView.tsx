import React, { useState, useMemo } from 'react';
import { Broadcast } from '../../types';
import { getAssetUrl } from '../../utils/assets';
import { useLanguage } from '../../context/LanguageContext';
import { Radio, Search, Play, Volume2, Calendar, ExternalLink } from 'lucide-react';

interface BroadcastsViewProps {
  broadcasts: Broadcast[];
  onOpenVideoModal: (title: string, videoUrl?: string, audioUrl?: string) => void;
}

export const BroadcastsView: React.FC<BroadcastsViewProps> = ({
  broadcasts,
  onOpenVideoModal,
}) => {
  const { t, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const topics = useMemo(() => {
    const set = new Set<string>();
    broadcasts.forEach((b) => {
      if (b.topic) set.add(b.topic);
    });
    return ['all', ...Array.from(set)];
  }, [broadcasts]);

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((b) => {
      const matchesTopic = selectedTopic === 'all' || b.topic === selectedTopic;
      const matchesQuery = 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesQuery;
    });
  }, [broadcasts, selectedTopic, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e3c48] via-[#134e5e] to-[#0e3c48] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className={`relative z-10 max-w-2xl space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 rounded-full text-xs font-bold text-[#84d2ea] border border-white/20">
            <Radio className="w-3.5 h-3.5 text-[#2e9e66]" />
            <span>{t('broadcasts_title', 'الإذاعات الصباحية المدرسية')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            {isRtl ? 'صوت الصباح: طاقة ووعي يومي' : 'Morning Voice: Daily Energy & Vitality'}
          </h1>
          <p className="text-[#d1e6ec] text-xs sm:text-sm leading-relaxed">
            {t('broadcasts_subtitle', 'فقرات إذاعية صباحية تفاعلية وملهمة تبث الوعي الصحي بين الطلاب ومنسوبي التعليم')}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#122127] p-4 sm:p-6 rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center transition-colors">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className={`w-4 h-4 text-[#526f78] dark:text-stone-400 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-3.5`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('broadcasts_search_placeholder', 'ابحث في موضوعات الإذاعات المدرسية...')}
            className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-[#f7fbfc] dark:bg-[#0b1519] border border-[#d0e0e6] dark:border-[#1e3842] rounded-xl text-xs text-[#0c2b33] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2e9e66]`}
          />
        </div>

        {/* Topic Filter Tabs */}
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

      {/* Broadcasts Grid */}
      {filteredBroadcasts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] p-8 transition-colors">
          <Radio className="w-12 h-12 text-[#b0ced8] dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0e3c48] dark:text-white">{t('broadcasts_no_items', 'لم يتم العثور على إذاعات مطابقة لبحثك.')}</h3>
          <p className="text-xs text-[#526f78] dark:text-stone-400 mt-1">
            {isRtl ? 'جرب تغيير كلمات البحث أو اختيار موضوع آخر.' : 'Try adjusting your search terms or selecting another topic.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredBroadcasts.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#122127] rounded-3xl border border-[#dbe8ed] dark:border-[#1e3842] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Card Image */}
              <div className="h-48 relative bg-[#f1f7f9] dark:bg-[#0b1519] overflow-hidden">
                <img
                  src={getAssetUrl(item.imageUrl || '/assets/images/morning_broadcast_mic_1793901821444.jpg')}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-[#0e3c48]/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg`}>
                  {item.topic}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center gap-2 text-[11px] text-[#526f78] dark:text-stone-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#2e9e66]" />
                    <span>{t('card_date', 'التاريخ')}: {item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0e3c48] dark:text-white group-hover:text-[#2e9e66] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#526f78] dark:text-stone-300 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Actions & Links */}
                <div className="pt-4 border-t border-[#edf3f5] dark:border-[#1e3842] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenVideoModal(item.title, item.videoUrl, item.audioUrl)}
                    className="flex-1 py-2.5 px-4 bg-[#e8f7ee] dark:bg-[#0e2c22] hover:bg-[#d5f0e0] dark:hover:bg-[#153f31] text-[#1e784a] dark:text-[#42df98] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {item.videoUrl ? <Play className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{t('action_listen', 'استماع / مشاهدة')}</span>
                  </button>

                  {item.audioUrl && (
                    <a
                      href={item.audioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-[#eaf6fa] dark:bg-[#0e2730] hover:bg-[#d8eff7] text-[#134e5e] dark:text-[#84d2ea] rounded-xl transition-colors"
                      title={t('action_listen', 'فتح الرابط الصوتي')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
