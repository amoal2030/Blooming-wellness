import React, { useState, useMemo } from 'react';
import { EventItem } from '../../types';
import { getAssetUrl } from '../../utils/assets';
import { Calendar, Clock, MapPin, Search, CheckCircle, Sparkles } from 'lucide-react';

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
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#e8f7ee] text-[#1e784a] border border-[#c4e9d2] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2e9e66]" />
            <span>فعالية قادمة</span>
          </span>
        );
      case 'ongoing':
        return (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#fef4ea] text-[#c06b1e] border border-[#fbd3b0] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea8c38] animate-ping" />
            <span>جارية الآن</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#f1f7f9] text-[#526f78] border border-[#d0e0e6] flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#526f78]" />
            <span>فعالية سابقة</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e3c48] via-[#134e5e] to-[#0e3c48] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 rounded-full text-xs font-bold text-[#84d2ea] border border-white/20">
            <Calendar className="w-3.5 h-3.5 text-[#2e9e66]" />
            <span>الأنشطة والفعاليات المدرسية والمجتمعية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">فعاليات عافية: نشاط وازدهار</h1>
          <p className="text-[#d1e6ec] text-xs sm:text-sm leading-relaxed">
            ملتقيات توعوية، برامج مشي حركية، ورش عمل لتعزيز العافية في رحاب مدرسة ثانوية الشاطئ والمجتمع المحيط.
          </p>
        </div>
      </div>

      {/* Prominent Featured Event */}
      {featuredEvent && (
        <div className="bg-white rounded-3xl border-2 border-[#389eb3]/40 overflow-hidden shadow-xl ring-4 ring-[#389eb3]/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#fef4ea] text-[#c06b1e] border border-[#fbd3b0] text-xs font-bold rounded-xl flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#ea8c38]" />
                    <span>الفعالية الأبرز</span>
                  </span>
                  {getStatusBadge(featuredEvent.status)}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#0e3c48] leading-snug">
                  {featuredEvent.title}
                </h2>

                <p className="text-[#526f78] text-xs sm:text-sm leading-relaxed">
                  {featuredEvent.description}
                </p>
              </div>

              {/* Event Metas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#f7fbfc] rounded-2xl border border-[#dbe8ed] text-xs text-[#0c2b33]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2e9e66] shrink-0" />
                  <div>
                    <span className="block text-[10px] text-[#526f78] font-bold">التاريخ</span>
                    <span className="font-extrabold">{featuredEvent.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2e9e66] shrink-0" />
                  <div>
                    <span className="block text-[10px] text-[#526f78] font-bold">الوقت</span>
                    <span className="font-extrabold">{featuredEvent.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2e9e66] shrink-0" />
                  <div>
                    <span className="block text-[10px] text-[#526f78] font-bold">الموقع</span>
                    <span className="font-extrabold truncate">{featuredEvent.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-auto relative bg-[#f1f7f9] overflow-hidden">
              <img
                src={getAssetUrl(featuredEvent.imageUrl || '/assets/images/hero_awareness_banner_1793901820998.jpg')}
                alt={featuredEvent.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#dbe8ed] shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#526f78] absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الفعاليات أو الموقع..."
            className="w-full pr-10 pl-4 py-2.5 bg-[#f7fbfc] border border-[#d0e0e6] rounded-xl text-xs text-[#0c2b33] focus:outline-none focus:ring-2 focus:ring-[#2e9e66]"
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
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeStatus === tab.id
                  ? 'bg-[#134e5e] text-white shadow-xs'
                  : 'bg-[#eaf6fa] text-[#134e5e] hover:bg-[#dbeef5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#dbe8ed] p-8">
          <Calendar className="w-12 h-12 text-[#b0ced8] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0e3c48]">لا توجد فعاليات مطابقة في هذا التصنيف</h3>
          <p className="text-xs text-[#526f78] mt-1">يرجى اختيار تبويب آخر أو مسح حقل البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-[#dbe8ed] overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group"
            >
              <div className="h-48 relative bg-[#f1f7f9] overflow-hidden">
                <img
                  src={getAssetUrl(event.imageUrl || '/assets/images/hero_awareness_banner_1793901820998.jpg')}
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
                  <h3 className="text-base font-bold text-[#0e3c48] group-hover:text-[#134e5e] transition-colors leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[#526f78] leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#edf3f5] space-y-2 text-xs text-[#526f78]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#2e9e66] shrink-0" />
                    <span>التاريخ: <strong className="text-[#0c2b33]">{event.date}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#2e9e66] shrink-0" />
                    <span>الوقت: {event.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#2e9e66] shrink-0" />
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
