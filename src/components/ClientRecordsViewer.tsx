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

/**
 * Client component that handles search, sort, and displays the record cards.
 * All interactivity happens client-side for responsive UX.
 */
export default function ClientRecordsViewer({ initialRecords }: ClientRecordsViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'sensitivity'>('date');

  // Filter and sort records based on user input
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
    <div className="space-y-8">
      {/* Search and sort control panel with glassmorphism effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border p-6 shadow-2xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="mb-3 block text-sm font-medium text-gray-300">
              Search Records
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Search by title, type, or sensitivity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border px-4 py-3.5 pl-12 text-white placeholder:text-gray-500 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="md:w-56">
            <label htmlFor="sort" className="mb-3 block text-sm font-medium text-gray-300">
              Sort By
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'sensitivity')}
                className="w-full appearance-none rounded-xl border px-4 py-3.5 pl-4 pr-10 text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <option value="date" className="bg-gray-900">Date</option>
                <option value="type" className="bg-gray-900">Type</option>
                <option value="sensitivity" className="bg-gray-900">Sensitivity</option>
              </select>
              <svg 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Results Count with Animated Number */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filteredAndSortedRecords.length}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Showing</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-semibold">
                {filteredAndSortedRecords.length}
              </span>
              <span className="text-gray-400">of</span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-semibold">
                {initialRecords.length}
              </span>
              <span className="text-gray-400">records</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

        {/* Responsive card grid: 1 col mobile, 2 tablet, 3 desktop */}
        <AnimatePresence mode="wait">
        {filteredAndSortedRecords.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
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
            className="rounded-2xl border p-16 text-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div 
              className="mx-auto w-24 h-24 mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-medium text-gray-300 mb-2">No records found</p>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
