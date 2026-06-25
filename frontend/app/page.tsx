'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import AntigravityBackground from '@/components/AntigravityBackground';
import FeaturedAuthors from '@/components/FeaturedAuthors';
import FeaturedJournals from '@/components/FeaturedJournals';
import { Eye, Download, Calendar } from 'lucide-react';

interface Paper {
  _id: string;
  title: string;
  abstract: string;
  authors: string[];
  views: number;
  downloads: number;
  slug: string;
  subject?: { name: string };
  coverImage?: string;
  keywords?: string[];
  status?: string;
  publishedAt?: string;
  createdAt?: string;
}

export default function HomePage() {
  const router = useRouter();

  // Newsletter state
  const [email, setEmail] = React.useState('');
  const [isSubscribing, setIsSubscribing] = React.useState(false);
  const [subscribeMessage, setSubscribeMessage] = React.useState('');
  const [subscribeError, setSubscribeError] = React.useState(false);

  const { data: popularPapers } = useQuery<{ data: Paper[] }>({
    queryKey: ['papers', 'home'],
    queryFn: async () => (await api.get('/api/papers?limit=6')).data,
  });

  const { data: cmsDataRaw } = useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: async () => (await api.get('/api/cms')).data,
  });

  const papers = popularPapers?.data || [];
  const cmsConfig = cmsDataRaw?.data?.value || {};
  const stats = cmsConfig.stats || { papers: 19, authors: 5, institutions: 3 };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    setSubscribeMessage('');
    setSubscribeError(false);

    try {
      const res = await api.post('/api/subscribers', { email });
      setSubscribeMessage(res.data.message || 'Successfully subscribed!');
      setEmail('');
    } catch (err: any) {
      setSubscribeError(true);
      setSubscribeMessage(err.response?.data?.error || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      <div className="swarn-home-override">

        {/* NAV */}
        <Navbar />

        {/* HERO */}
        <section className="hero">
          <AntigravityBackground />
          <div className="hero-inner flex flex-col items-center justify-center text-center">

            {/* SWAPANSPACE BANNER */}
            <div className="swarnspace-banner" style={{ justifyContent: 'center', textAlign: 'center' }}>
              <div className="swarnspace-banner-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="swarnspace-kicker" style={{ justifyContent: 'center', display: 'flex' }}><div className="swarnspace-kicker-dot"></div>SwapanSpace</div>
                <h2 style={{ fontSize: '2.5rem', lineHeight: '1.2', margin: '1rem 0', color: '#19344f' }}>{cmsConfig.heroHeadline || 'Advancing Knowledge Through Open Research'}</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>{cmsConfig.heroSubheadline || 'Discover, share, and explore peer-reviewed academic papers across all disciplines on a single open platform.'}</p>
                <div className="banner-btns" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="banner-btn-outline" onClick={() => router.push('/browse')}>Browse Papers →</button>
                  <button className="banner-btn-primary" onClick={() => router.push('/submit')}>Submit Research</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-section">
          <div className="stats-inner">
            <div className="stat-item"><span className="stat-number">{stats.papers != null ? stats.papers.toLocaleString() : '52,400'}</span><span className="stat-label">Papers</span></div>
            <div className="stat-item"><span className="stat-number">{stats.authors != null ? stats.authors.toLocaleString() : '18,730'}</span><span className="stat-label">Authors</span></div>
            <div className="stat-item"><span className="stat-number">{stats.institutions != null ? stats.institutions.toLocaleString() : '340'}</span><span className="stat-label">Journals</span></div>
          </div>
        </div>

        {/* FEATURED AUTHORS & RESEARCHERS */}
        <FeaturedAuthors />

        {/* FEATURED PAPERS */}
        <section className="section section-bg-white">
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">Trending Papers</h2>
              <Link href="/browse" className="view-all">View all →</Link>
            </div>
            <div className="papers-list">
              {cmsConfig.featuredPaperIds?.length > 0 ? cmsConfig.featuredPaperIds.map((paper: any) => (
                <div className="acm-paper-card" key={paper._id} onClick={() => router.push(`/paper/${paper.slug}`)}>
                  <div className="acm-paper-left">
                    {paper.coverImage && (
                      <img 
                        src={paper.coverImage} 
                        alt="Cover" 
                        className="acm-paper-cover" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextEl = e.currentTarget.nextElementSibling;
                          if (nextEl) (nextEl as HTMLElement).style.display = 'flex';
                        }} 
                      />
                    )}
                    <div className="acm-paper-cover-placeholder" style={{ display: paper.coverImage ? 'none' : 'flex' }}>
                      <span>{paper.subject?.name?.[0] || 'R'}</span>
                    </div>
                  </div>
                  <div className="acm-paper-center">
                    <div className="acm-paper-meta-top">
                      <span className="acm-paper-type">{paper.subject?.name || 'Research'}</span>
                      <span className="acm-paper-status">{paper.status === 'published' ? 'Published' : 'Under Review'}</span>
                    </div>
                    <div className="acm-paper-title">{paper.title}</div>
                    <div className="acm-paper-authors">{Array.isArray(paper.authors) ? paper.authors.map((a: string) => a.split(' | ')[0].trim()).filter(Boolean).join(', ') : 'Unknown'}</div>
                    <div className="acm-paper-abstract">{paper.abstract?.replace(/\[Corresponding Email:.*?\]\s*/gi, '').trim()}</div>
                    {paper.keywords && paper.keywords.length > 0 && (
                      <div className="acm-paper-keywords">
                        {paper.keywords.map((kw: string, i: number) => (
                          <span key={i} className="acm-paper-keyword">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="acm-paper-right">
                    <div className="acm-paper-stats-list">
                      <div className="acm-stat-item">
                        <div className="acm-stat-icon view-icon"><Eye className="w-4 h-4"/></div>
                        <div className="acm-stat-info">
                          <span className="acm-stat-val">{paper.views >= 1000 ? (paper.views/1000).toFixed(1) + 'K' : (paper.views || 0)}</span>
                          <span className="acm-stat-lbl">Views</span>
                        </div>
                      </div>
                      <div className="acm-stat-item">
                        <div className="acm-stat-icon download-icon"><Download className="w-4 h-4"/></div>
                        <div className="acm-stat-info">
                          <span className="acm-stat-val">{paper.downloads >= 1000 ? (paper.downloads/1000).toFixed(1) + 'K' : (paper.downloads || 0)}</span>
                          <span className="acm-stat-lbl">Downloads</span>
                        </div>
                      </div>
                      <div className="acm-stat-item">
                        <div className="acm-stat-icon date-icon"><Calendar className="w-4 h-4"/></div>
                        <div className="acm-stat-info">
                          <span className="acm-stat-val">{paper.publishedAt ? new Date(paper.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : new Date(paper.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          <span className="acm-stat-lbl">Published</span>
                        </div>
                      </div>
                    </div>
                    <div className="acm-paper-actions">
                      <Link
                        href={`/paper/${paper.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="acm-view-btn"
                      >
                        <Eye className="w-3.5 h-3.5" /> Read Paper
                      </Link>
                    </div>
                  </div>
                </div>
              )) : papers.length > 0 ? papers.map((paper: any) => (
                <div className="acm-paper-card" key={paper._id} onClick={() => router.push(`/paper/${paper.slug}`)}>
                  <div className="acm-paper-left">
                    {paper.coverImage ? (
                      <img src={paper.coverImage} alt="Cover" className="acm-paper-cover" />
                    ) : (
                      <div className="acm-paper-cover-placeholder">
                        <span>{paper.subject?.name?.[0] || 'R'}</span>
                      </div>
                    )}
                  </div>
                  <div className="acm-paper-center">
                    <div className="acm-paper-meta-top">
                      <span className="acm-paper-type">{paper.subject?.name || 'Research'}</span>
                      <span className="acm-paper-status">Published</span>
                    </div>
                    <div className="acm-paper-title">{paper.title}</div>
                    <div className="acm-paper-authors">{Array.isArray(paper.authors) ? paper.authors.map((a: string) => a.split(' | ')[0].trim()).filter(Boolean).join(', ') : 'Unknown'}</div>
                    <div className="acm-paper-abstract">{paper.abstract?.replace(/\[Corresponding Email:.*?\]\s*/gi, '').trim()}</div>
                    {paper.keywords && paper.keywords.length > 0 && (
                      <div className="acm-paper-keywords">
                        {paper.keywords.map((kw: string, i: number) => (
                          <span key={i} className="acm-paper-keyword">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="acm-paper-right">
                    <div className="acm-paper-stats-list">
                      <div className="acm-stat-item">
                        <div className="acm-stat-icon view-icon"><Eye className="w-4 h-4"/></div>
                        <div className="acm-stat-info">
                          <span className="acm-stat-val">{paper.views >= 1000 ? (paper.views/1000).toFixed(1) + 'K' : (paper.views || 0)}</span>
                          <span className="acm-stat-lbl">Views</span>
                        </div>
                      </div>
                      <div className="acm-stat-item">
                        <div className="acm-stat-icon download-icon"><Download className="w-4 h-4"/></div>
                        <div className="acm-stat-info">
                          <span className="acm-stat-val">{paper.downloads >= 1000 ? (paper.downloads/1000).toFixed(1) + 'K' : (paper.downloads || 0)}</span>
                          <span className="acm-stat-lbl">Downloads</span>
                        </div>
                      </div>
                      <div className="acm-stat-item">
                        <div className="acm-stat-icon date-icon"><Calendar className="w-4 h-4"/></div>
                        <div className="acm-stat-info">
                          <span className="acm-stat-val">{paper.publishedAt ? new Date(paper.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : new Date(paper.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          <span className="acm-stat-lbl">Published</span>
                        </div>
                      </div>
                    </div>
                    <div className="acm-paper-actions">
                      <Link
                        href={`/paper/${paper.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="acm-view-btn"
                      >
                        <Eye className="w-3.5 h-3.5" /> Read Paper
                      </Link>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-faint)' }}>No papers found.</div>
              )}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section className="section section-bg-sand">
          <div className="section-inner">
            <div className="section-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <h2 className="section-title">Why Researchers Choose SwapanPublication</h2>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-muted)', marginTop: '0.25rem' }}>
                Built for academic excellence — every feature designed around research integrity and global visibility.
              </p>
            </div>
            <div className="features-grid">

              {/* 1 Peer Reviewed */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <div className="feature-title">Peer Reviewed</div>
                <div className="feature-desc">Rigorous expert review process ensuring research quality.</div>
              </div>

              {/* 2 Open Access */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div className="feature-title">Open Access</div>
                <div className="feature-desc">Research accessible globally without restrictions.</div>
              </div>

              {/* 3 Fast Publishing */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div className="feature-title">Fast Publishing</div>
                <div className="feature-desc">Streamlined workflow for quicker publication timelines.</div>
              </div>

              {/* 4 DOI Support */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </div>
                <div className="feature-title">DOI Support</div>
                <div className="feature-desc">Permanent digital identifiers for every publication.</div>
              </div>

              {/* 5 Global Reach */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div className="feature-title">Global Reach</div>
                <div className="feature-desc">Connect with researchers and institutions worldwide.</div>
              </div>

              {/* 6 Ethical Standards */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="feature-title">Ethical Standards</div>
                <div className="feature-desc">Publication practices aligned with academic integrity.</div>
              </div>

              {/* 7 Expert Editors */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="feature-title">Expert Editors</div>
                <div className="feature-desc">Experienced editorial board across multiple disciplines.</div>
              </div>

              {/* 8 Digital Archive */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                  </svg>
                </div>
                <div className="feature-title">Digital Archive</div>
                <div className="feature-desc">Secure long-term preservation of published research.</div>
              </div>

            </div>
          </div>
        </section>


        {/* HOW IT WORKS */}
        <section className="section section-bg-sand">
          <div className="section-inner">
            <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', display: 'block', marginBottom: '3rem' }}>
              <h2 className="section-title">How SwapanPublication Works</h2>
              <p style={{ color: 'var(--ink-muted)', marginTop: '.5rem', fontSize: '14.5px' }}>From submission to global discovery in four simple steps.</p>
            </div>
            <div className="steps-grid">
              <div className="step-item">
                <div className="step-num">1</div>
                <div className="step-title">Create Account</div>
                <div className="step-desc">Register as an author or reader in under 2 minutes. Free for all researchers.</div>
              </div>
              <div className="step-item">
                <div className="step-num">2</div>
                <div className="step-title">Submit Research</div>
                <div className="step-desc">Upload your manuscript. Our editorial system guides you through formatting and metadata.</div>
              </div>
              <div className="step-item">
                <div className="step-num">3</div>
                <div className="step-title">Peer Review</div>
                <div className="step-desc">Qualified reviewers evaluate your work. Track status in real time on your dashboard.</div>
              </div>
              <div className="step-item">
                <div className="step-num">4</div>
                <div className="step-title">Publish &amp; Share</div>
                <div className="step-desc">Accepted papers are indexed globally and shared with thousands of researchers.</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED JOURNALS */}
        <FeaturedJournals />

        {/* NEWSLETTER */}
        <section className="newsletter-section">
          <h2 className="!text-white">Stay Updated with New Research</h2>
          <p>Get weekly digests of the most-downloaded papers in your field, plus calls for submissions and journal announcements.</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubscribing}
            />
            <button type="submit" disabled={isSubscribing} className="disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
              {isSubscribing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Subscribe'}
            </button>
          </form>
          {subscribeMessage && (
            <div className={`mt-4 text-sm font-medium ${subscribeError ? 'text-red-400' : 'text-green-400'}`}>
              {subscribeMessage}
            </div>
          )}
          <p className="newsletter-note">No spam. Unsubscribe at any time. We respect your privacy.</p>
        </section>





        {/* FOOTER */}
        <Footer />

      </div>
    </>
  );
}
