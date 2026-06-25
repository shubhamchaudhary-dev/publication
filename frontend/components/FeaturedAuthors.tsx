'use client';
import React, { useState, useEffect, useRef } from 'react';

const authors = [
  {
    id: 1,
    name: 'Dr. Sapna Nehra',
    role: 'Editor-in-Chief',
    institution: 'Nirwan University Jaipur',
    specialization: 'Academic Leadership & Research Publications',
    bio: 'Leading multidisciplinary academic publishing and research excellence initiatives.',
    quote: 'Research is formalized curiosity. It is poking and prying with a purpose.',
    image: '/images/authors/sapna.jpg',
  },
  {
    id: 2,
    name: 'Dr. Anuja Rohilla',
    role: 'Editorial Board Member',
    institution: 'Shri Guru Ram Rai University',
    location: 'Dehradun, Uttarakhand',
    bio: 'Researcher focused on music studies, interdisciplinary arts, and academic innovation.',
    quote: 'Interdisciplinary arts bridge the gap between tradition and modern innovation.',
    image: '/images/authors/anuja.jpg',
  },
  {
    id: 3,
    name: 'Dr. Sandeep Kishanrao Kakade',
    role: 'Editorial Board Member',
    institution: 'Vilasrao Deshmukh Foundation Group of Institutions',
    location: 'Latur, Maharashtra',
    bio: 'Research specialist in electronics, communication systems, and engineering innovation.',
    quote: 'Engineering innovation is the key to sustainable technological advancement.',
    image: '/images/authors/sandeep.png',
  },
  {
    id: 4,
    name: 'Dr. Reshu Gupta Singh',
    role: 'Editorial Board Member',
    institution: 'Central Institute of Petrochemicals Engineering & Technology',
    location: 'Jaipur, Rajasthan',
    bio: 'Expert in petrochemicals engineering, material sciences, and sustainable technologies.',
    quote: 'Material science shapes the future of sustainable engineering and environmental solutions.',
    image: '/images/authors/reshu.jpg',
  }
];

export default function FeaturedAuthors() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % authors.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeIndex]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsPaused(true);
  };

  const handleDragEnd = () => {
    setIsPaused(false);
  };

  return (
    <section className="authors-carousel-section" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="section-inner">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title">Authors & Researchers</h2>
          <p style={{ color: 'var(--ink-muted)', marginTop: '.5rem', fontSize: '14.5px', maxWidth: '600px' }}>
            Meet the distinguished academic minds and editorial leaders driving research excellence on SwapanPublication.
          </p>
        </div>

        <div className="carousel-container" onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onTouchStart={handleDragStart} onTouchEnd={handleDragEnd}>
          {/* Portrait Navigation */}
          <div className="portraits-row">
            {authors.map((author, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={author.id} 
                  className={`portrait-wrapper ${isActive ? 'active' : 'inactive'}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="portrait-circle">
                    {author.image ? (
                      <img 
                        src={author.image} 
                        alt={author.name} 
                        className="portrait-image" 
                        style={author.id === 3 ? { transform: 'scale(0.94)', objectFit: 'contain', backgroundColor: '#eef2f5' } : {}}
                      />
                    ) : (
                      <div className="portrait-initials">{author.name.split(' ').map(n => n[0]).slice(1, 3).join('')}</div>
                    )}
                  </div>
                  {isActive && <div className="portrait-glow"></div>}
                </div>
              );
            })}
          </div>

          {/* Active Profile Info */}
          <div className="profile-display">
            {authors.map((author, index) => (
              <div key={author.id} className={`profile-content ${index === activeIndex ? 'active-profile' : 'hidden-profile'}`}>
                <div className="role-badge">{author.role}</div>
                <h3 className="profile-name">{author.name}</h3>
                <div className="profile-institution">{author.institution}</div>
                
                <div className="profile-bio-card">
                  <p className="profile-bio">{author.bio}</p>
                  <div className="profile-quote">"{author.quote}"</div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Dots */}
          <div className="progress-dots">
            {authors.map((_, index) => (
              <div 
                key={index} 
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                {index === activeIndex && !isPaused && <div className="dot-fill" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
