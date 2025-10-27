'use client';

import { motion } from 'framer-motion';

interface RecordItem {
  id: string;
  title: string;
  type: string;
  sensitivity: string;
  date: string;
}

interface RecordCardProps {
  record: RecordItem;
  index: number; // Used for staggered animation timing
}

// Color scheme for different sensitivity levels
const sensitivityColors: Record<string, { bg: string; text: string; badge: string; glow: string }> = {
  'Confidential': {
    bg: 'from-yellow-500/10 to-orange-500/5',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    glow: 'shadow-yellow-500/20',
  },
  'Private': {
    bg: 'from-orange-500/10 to-red-500/5',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    glow: 'shadow-orange-500/20',
  },
  'Highly Confidential': {
    bg: 'from-red-500/10 to-pink-500/5',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    glow: 'shadow-red-500/20',
  },
};

// Emoji icons for different record types
const typeIcons: Record<string, string> = {
  'Survey': '📋',
  'Record': '📄',
  'Report': '📊',
};

/**
 * Individual record card component with glassmorphism design and smooth animations.
 * Includes hover effects, sensitivity coloring, and animated entrance.
 */
export default function RecordCard({ record, index }: RecordCardProps) {
  const colors = sensitivityColors[record.sensitivity] || {
    bg: 'from-gray-500/10 to-gray-500/5',
    text: 'text-gray-400',
    badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    glow: 'shadow-gray-500/20',
  };

  const icon = typeIcons[record.type] || '📋';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: -100, scale: 0.8, rotate: -10 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        x: 0,
        scale: 1,
        rotate: 0,
      }}
      exit={{ opacity: 0, x: 100, scale: 0.95, rotate: 10 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
        delay: index * 0.08,
      }}
      className="group"
    >
      <div
        className="relative h-full overflow-hidden rounded-2xl border p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
        }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className={`absolute -inset-1 bg-gradient-to-r ${colors.bg} blur-xl opacity-50`} />
        </div>

        <div className="relative z-10">
          {/* Icon and sensitivity badge */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {icon}
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
                  {record.sensitivity}
                </p>
                <p className="text-xs text-gray-500">{record.type}</p>
              </div>
            </div>
          </div>

          {/* Record title with hover color transition */}
          <h3 className="mb-3 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {record.title}
          </h3>

          {/* Date display with calendar icon */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {new Date(record.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Primary action button with gradient and hover glow */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.3)';
            }}
          >
            <span className="flex items-center justify-center gap-2">
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </motion.button>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 h-24 w-24 overflow-hidden">
          <div className={`absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br ${colors.bg} opacity-30 blur-2xl`} />
        </div>
      </div>
    </motion.div>
  );
}

