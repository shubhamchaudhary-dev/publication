'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';

interface Journal {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  category?: string;
  status: 'active' | 'coming-soon' | 'archived';
  coverImage?: string;
}

export default function FeaturedJournals() {
  const { data, isLoading } = useQuery<{ data: Journal[] }>({
    queryKey: ['public', 'journals'],
    queryFn: async () => {
      const res = await api.get('/api/cms/journals');
      return res.data;
    },
  });

  const [journals, setJournals] = useState<Journal[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (data?.data) {
      let fetched = data.data.filter(j => j.status !== 'archived');
      // If we have less than 5 journals, pad with coming soon
      if (fetched.length < 5) {
        const padding = Array.from({ length: 5 - fetched.length }).map((_, i) => ({
          _id: `coming-soon-${i}`,
          name: 'Coming Soon',
          slug: `coming-soon-${i}`,
          shortDescription: 'A new premium journal is launching soon. Stay tuned.',
          category: 'Upcoming Publication',
          status: 'coming-soon' as const,
        }));
        fetched = [...fetched, ...padding];
      }
      setJournals(fetched);
    } else if (!isLoading) {
      // Fallback if API fails
      setJournals(Array.from({ length: 5 }).map((_, i) => ({
        _id: `coming-soon-${i}`,
        name: 'Coming Soon',
        slug: `coming-soon-${i}`,
        shortDescription: 'A new premium journal is launching soon. Stay tuned.',
        category: 'Upcoming Publication',
        status: 'coming-soon',
      })));
    }
  }, [data, isLoading]);

  useEffect(() => {
    // Auto-rotation disabled so it only changes on click
    // if (journals.length === 0) return;
    // const interval = setInterval(() => {
    //   setActiveIndex((prev) => (prev + 1) % journals.length);
    // }, 6000);
    // return () => clearInterval(interval);
  }, [journals]);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % journals.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + journals.length) % journals.length);
  const handleSelect = (index: number) => setActiveIndex(index);

  if (isLoading || journals.length === 0) {
    return <div className="py-24 text-center text-gray-500">Loading Featured Journals...</div>;
  }

  const activeJournal = journals[activeIndex];

  return (
    <section className="featured-journals-section">
      <div className="section-inner">
        <div className="section-header" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 className="section-title">Featured Journals</h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-muted)', marginTop: '0.5rem', maxWidth: '600px' }}>
            Explore peer-reviewed journals, upcoming publications, and emerging research domains.
          </p>
        </div>

        <div className="journals-interactive-area">
          {/* Active Journal Detail Panel */}
          <div className="journal-detail-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeJournal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="journal-detail-content"
              >
                <div className="journal-badge">
                  {activeJournal.status === 'active' ? 'Active Publication' : 'Launching Soon'}
                </div>
                <h3 className="journal-title">{activeJournal.name}</h3>
                <p className="journal-category">{activeJournal.category}</p>
                <p className="journal-description">{activeJournal.shortDescription}</p>
                
                {activeJournal.status === 'active' && (
                  <Link href="/browse">
                    <button className="view-journal-btn">View Journal →</button>
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Overlapping Circles Carousel */}
          <div className="journals-carousel-container">
            <div className="journals-carousel-track">
              {journals.map((journal, index) => {
                // Calculate position relative to active index
                let offset = index - activeIndex;
                if (offset < 0) offset += journals.length;

                // We want the active (offset=0) to be fully visible, and others to stack behind it to the right
                const isActive = offset === 0;
                
                // If it's the active one or the next 3, we show it. 
                // We'll wrap the logic so the last element in the array shows up on the left (offset = length -1) 
                let visualOffset = offset;
                if (offset > journals.length / 2) {
                  visualOffset = offset - journals.length;
                }

                return (
                  <motion.div
                    key={journal._id + index}
                    className={`journal-circle-wrapper ${isActive ? 'active' : ''} ${journal.status === 'coming-soon' ? 'is-upcoming' : ''}`}
                    onClick={() => handleSelect(index)}
                    animate={{
                      x: visualOffset * 80, // Space them out horizontally
                      scale: isActive ? 1 : 0.85 - (Math.abs(visualOffset) * 0.05),
                      zIndex: 100 - Math.abs(visualOffset),
                      opacity: Math.abs(visualOffset) > 3 ? 0 : 1 - (Math.abs(visualOffset) * 0.15),
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                      mass: 0.8
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = offset.x;
                      if (swipe < -50) {
                        handleNext();
                      } else if (swipe > 50) {
                        handlePrev();
                      }
                    }}
                  >
                    <div className="journal-circle-inner">
                      {journal.status === 'coming-soon' && !journal.coverImage ? (
                        <div className="upcoming-placeholder">
                          <span className="sparkle-icon">✨</span>
                          <span className="lock-text">Coming Soon</span>
                        </div>
                      ) : (
                        journal.coverImage ? (
                          <img src={journal.coverImage} alt={journal.name} className="journal-cover" />
                        ) : (
                          <div className="journal-initials">{journal.name.substring(0, 2).toUpperCase()}</div>
                        )
                      )}
                    </div>
                    {isActive && <div className="journal-circle-glow" />}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
