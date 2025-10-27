'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecordCard from './RecordCard';

interface RecordItem {
  id: string;
  title: string;
  type: string;
  sensitivity: string;
  date: string;
}

interface ClientRecordsViewerProps {
  initialRecords: RecordItem[];
}

export default function ClientRecordsViewer({ initialRecords }: ClientRecordsViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'sensitivity'>('date');

  // Client-side filtering and sorting
  const filteredAndSortedRecords = initialRecords
    .filter(record => {
      const query = searchQuery.toLowerCase();
      return (
        record.title.toLowerCase().includes(query) ||
        record.type.toLowerCase().includes(query) ||
        record.sensitivity.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'sensitivity':
          return a.sensitivity.localeCompare(b.sensitivity);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search Records
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by title, type, or sensitivity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="md:w-48">
            <label htmlFor="sort" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'sensitivity')}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="date">Date</option>
              <option value="type">Type</option>
              <option value="sensitivity">Sensitivity</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedRecords.length} of {initialRecords.length} records
        </p>
      </div>

      {/* Cards Grid */}
      <AnimatePresence mode="wait">
        {filteredAndSortedRecords.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filteredAndSortedRecords.map((record, index) => (
                <RecordCard key={record.id} record={record} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-lg bg-white p-12 text-center shadow-lg dark:bg-gray-800"
          >
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No records found matching your search.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

