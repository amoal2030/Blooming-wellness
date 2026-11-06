import React, { useState, useMemo } from 'react';
import { EventItem } from '../../types';
import { Calendar, Clock, MapPin, Search, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface EventsViewProps {
  events: EventItem[];
}

export const EventsView: React.FC<EventsViewProps> = ({ events }) => {
  const [activeStatus, setActiveStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesStatus = activeStatus === 'all' || e.status === activeStatus;
      const matchesQuery =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [events, activeStatus, searchQuery]);

  const featuredEvent = useMemo(() => {
    return events.find((e) => e.isFeatured && e.status !== 'completed') || events.find((e) => e.status === 'upcoming');
  }, [events]);

  const getStatusBadge = (status: EventItem['status']) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>فعالية قادمة</span>
          </span>
        );
      case 'ongoing':
        return (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
            <span>جارية الآن</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-stone-200 text-stone-700 border border-stone-300 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-stone-500" />
            <span>فعالية سابقة</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-emerald-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>الأنشطة والفعاليات الميدانية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">فعاليات مجتمعية لتعزيز الحيوية</h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            انضم إلى ملتقياتنا الميدانية، وماراثونات المشي، وورش العمل التدريبية المصممة لتمكين مختلف أفراد العائلة من ممارسة نمط حياة مفعم بالصحة.
          </p>
        </div>
      </div>

      {/* Prominent Featured Event */}
      {featuredEvent && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/30 overflow-hidden shadow-xl ring-4 ring-emerald-500/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>الفعالية الأبرز</span>
                  </span>
                  {getStatusBadge(featuredEvent.status)}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-snug">
                  {featuredEvent.title}
                </h2>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {featuredEvent.description}
                </p>
              </div>

              {/* Event Metas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-semibold">التاريخ</span>
                    <span className="font-bold">{featuredEvent.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-semibold">الوقت</span>
                    <span className="font-bold">{featuredEvent.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-semibold">الموقع</span>
                    <span className="font-bold truncate">{featuredEvent.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-auto relative bg-stone-100 overflow-hidden">
              <img
                src={featuredEvent.imageUrl || '/src/assets/images/hero_awareness_banner_1793901820998.jpg'}
                alt={featuredEvent.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الفعاليات أو الموقع..."
            className="w-full pr-10 pl-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'جميع الفعاليات' },
            { id: 'upcoming', label: 'الفعاليات القادمة' },
            { id: 'ongoing', label: 'الجارية الآن' },
            { id: 'completed', label: 'الفعاليات السابقة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeStatus === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">لا توجد فعاليات مطابقة في هذا التصنيف</h3>
          <p className="text-xs text-stone-500 mt-1">يرجى اختيار تبويب آخر أو مسح حقل البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group"
            >
              <div className="h-48 relative bg-stone-100 overflow-hidden">
                <img
                  src={event.imageUrl || '/src/assets/images/hero_awareness_banner_1793901820998.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(event.status)}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>التاريخ: <strong className="text-stone-800">{event.date}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>الوقت: {event.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
