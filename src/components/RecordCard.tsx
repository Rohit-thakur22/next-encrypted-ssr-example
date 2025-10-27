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
  index: number;
}

const sensitivityColors: Record<string, { bg: string; text: string; badge: string }> = {
  'Confidential': {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  'Private': {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-800 dark:text-orange-200',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
  'Highly Confidential': {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-200',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
};

export default function RecordCard({ record, index }: RecordCardProps) {
  const colors = sensitivityColors[record.sensitivity] || {
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    text: 'text-gray-800 dark:text-gray-200',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1], // Custom easing for smooth animation
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      className="group"
    >
      <div
        className={`h-full rounded-xl border-2 border-transparent bg-white p-6 shadow-lg transition-all duration-300 hover:border-indigo-300 hover:shadow-xl dark:bg-gray-800 dark:hover:border-indigo-600 ${colors.bg}`}
      >
        {/* Type Badge */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${colors.badge}`}
          >
            {record.type}
          </span>
          <span
            className={`text-xs font-medium ${colors.text}`}
          >
            {record.sensitivity}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
          {record.title}
        </h3>

        {/* Date */}
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          📅 {new Date(record.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
}

