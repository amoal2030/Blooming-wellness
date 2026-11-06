import React, { useState, useMemo } from 'react';
import { Lecture } from '../../types';
import { Video, Search, Play, User, Calendar, Clock } from 'lucide-react';

interface LecturesViewProps {
  lectures: Lecture[];
  onOpenVideoModal: (title: string, videoUrl?: string) => void;
}

export const LecturesView: React.FC<LecturesViewProps> = ({
  lectures,
  onOpenVideoModal,
}) => {
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
      <div className="bg-gradient-to-r from-teal-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-teal-300">
            <Video className="w-3.5 h-3.5" />
            <span>المحاضرات التوعوية والعلمية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">محاضرات نخبة الأطباء والخبراء</h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            محتوى مرئي تثقيفي يقدمه نخبة من الأطباء وأساتذة الطب الوقائي والتغذية السريرية لنشر المعرفة الطبية الموثوقة بلغة مبسطة ومؤثرة.
          </p>
        </div>
      </div>

      {/* Search & Topic Filter */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المحاضر أو موضوع المحاضرة..."
            className="w-full pr-10 pl-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

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

      {/* Lectures Grid */}
      {filteredLectures.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
          <Video className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">لا توجد محاضرات مطابقة</h3>
          <p className="text-xs text-stone-500 mt-1">جرب كلمات بحث مختلفة أو حدد موضوعاً آخر.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLectures.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group"
            >
              {/* Thumbnail with Play Hover */}
              <div 
                onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                className="h-52 relative bg-stone-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.imageUrl || '/src/assets/images/awareness_lecture_hall_1793901820498.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white mr-0.5" />
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                  {item.topic}
                </div>

                {item.duration && (
                  <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{item.duration}</span>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50/70 p-2 rounded-xl">
                    <User className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                    <span className="truncate">{item.speaker}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <button
                    onClick={() => onOpenVideoModal(item.title, item.videoUrl)}
                    className="w-full py-2.5 bg-stone-900 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>مشاهدة المحاضرة الآن</span>
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
