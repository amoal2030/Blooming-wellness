import React, { useState, useMemo } from 'react';
import { Broadcast } from '../../types';
import { Radio, Search, Play, Volume2, Calendar, Tag, ExternalLink } from 'lucide-react';

interface BroadcastsViewProps {
  broadcasts: Broadcast[];
  onOpenVideoModal: (title: string, videoUrl?: string, audioUrl?: string) => void;
}

export const BroadcastsView: React.FC<BroadcastsViewProps> = ({
  broadcasts,
  onOpenVideoModal,
}) => {
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
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-emerald-300">
            <Radio className="w-3.5 h-3.5" />
            <span>الإذاعات الصباحية التوعوية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">إذاعات الصباح: طاقة ووعي يومي</h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            استمع وشارك حلقاتنا الإذاعية اليومية الموجهة للمدارس وبيئات العمل والأسر لنشر ثقافة الصحة والنشاط الإيجابي في مستهل كل صباح.
          </p>
        </div>
        <div className="absolute left-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <img
            src="/src/assets/images/morning_broadcast_mic_1793901821444.jpg"
            alt="إذاعات"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في عنوان الإذاعة أو الوصف..."
            className="w-full pr-10 pl-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Topic Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedTopic === t
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {t === 'all' ? 'جميع الموضوعات' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Broadcasts Grid */}
      {filteredBroadcasts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
          <Radio className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">لا توجد إذاعات مطابقة للبحث</h3>
          <p className="text-xs text-stone-500 mt-1">جرب تغيير كلمات البحث أو اختيار موضوع آخر.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBroadcasts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Card Image */}
              <div className="h-48 relative bg-stone-100 overflow-hidden">
                <img
                  src={item.imageUrl || '/src/assets/images/morning_broadcast_mic_1793901821444.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                  {item.topic}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تاريخ البث: {item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Actions & Links */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenVideoModal(item.title, item.videoUrl, item.audioUrl)}
                    className="flex-1 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {item.videoUrl ? <Play className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>تشغيل المحتوى التوعوي</span>
                  </button>

                  {item.audioUrl && (
                    <a
                      href={item.audioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                      title="تحميل أو فتح الرابط الصوتي المباشر"
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
