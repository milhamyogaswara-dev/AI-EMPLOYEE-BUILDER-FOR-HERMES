import React from 'react';
import { BookOpen, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { GuideTopic } from '../../data/userGuide';

interface GuideCardProps {
  topic: GuideTopic;
  isCompleted?: boolean;
  onSelect: (topic: GuideTopic) => void;
  onToggleComplete?: (topicId: string) => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  topic,
  isCompleted = false,
  onSelect,
  onToggleComplete,
}) => {
  const difficultyColors = {
    Pemula: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Menengah: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Lanjutan: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div
      onClick={() => onSelect(topic)}
      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 group ${
        isCompleted
          ? 'bg-[#131613] border-emerald-500/20 hover:border-emerald-500/35'
          : 'bg-[#141414] border-white/5 hover:border-white/20 hover:bg-[#181818]'
      }`}
    >
      {/* Top Meta */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {topic.badge && (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/5 text-[#AAA] border border-white/10">
                {topic.badge}
              </span>
            )}
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${difficultyColors[topic.difficulty]}`}
            >
              {topic.difficulty}
            </span>
          </div>

          {onToggleComplete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(topic.id);
              }}
              className="p-1 text-[#666] hover:text-white transition"
              title={isCompleted ? 'Tandai belum' : 'Tandai selesai'}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-[#555] hover:text-[#AAA]" />
              )}
            </button>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-serif italic text-white group-hover:text-[#FF5F1F] transition">
          {topic.title}
        </h4>

        {/* Short description */}
        <p className="text-xs text-[#888] font-light leading-relaxed line-clamp-3">
          {topic.shortDescription}
        </p>
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-[#888] group-hover:text-[#FF5F1F] transition">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#FF5F1F]" />
          <span>Baca Panduan</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
