import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
  audioUrl?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  videoUrl,
  audioUrl,
}) => {
  if (!isOpen) return null;

  // Helper to extract YouTube embed URL if applicable
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('watch?v=')) {
          videoId = url.split('watch?v=')[1]?.split('&')[0];
        } else if (url.includes('embed/')) {
          videoId = url.split('embed/')[1]?.split('?')[0];
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
      }
      return url;
    } catch {
      return url;
    }
  };

  const embedSrc = videoUrl ? getEmbedUrl(videoUrl) : '';
  const isYouTube = embedSrc.includes('youtube.com/embed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <h3 className="text-base font-bold text-stone-900 truncate pr-2">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Content */}
        <div className="p-6 bg-stone-900 flex flex-col items-center justify-center min-h-[300px]">
          {videoUrl && isYouTube ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-inner">
              <iframe
                src={embedSrc}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : videoUrl ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                متصفحك لا يدعم تشغيل هذا الفيديو.
              </video>
            </div>
          ) : null}

          {audioUrl && (
            <div className="w-full mt-4 p-4 bg-stone-800 rounded-xl flex flex-col gap-2">
              <span className="text-xs text-stone-300 font-medium">تسجيل البث الصوتي:</span>
              <audio controls className="w-full" src={audioUrl}>
                متصفحك لا يدعم تشغيل الملف الصوتي.
              </audio>
            </div>
          )}

          {videoUrl && !isYouTube && (
            <div className="mt-4 text-xs text-stone-400 flex items-center gap-2">
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-[#84d2ea] hover:text-[#389eb3] underline flex items-center gap-1 font-medium transition-colors"
              >
                <span>فتح الرابط الخارجي مباشرة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 bg-stone-50 border-t border-stone-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
