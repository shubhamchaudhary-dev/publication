'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import Navbar from '@/components/Navbar';
import { Eye } from 'lucide-react';

interface Paper {
  _id: string;
  title: string;
  abstract: string;
  authors: string[];
  views: number;
  downloads: number;
  slug: string;
  subject?: { name: string };
}

export default function HomePage() {
  const router = useRouter();
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
  const stats = cmsConfig.stats || { papers: 52400, authors: 18730, institutions: 1200 };

  return (
    <>
      <div className="swarn-home-override">

        {/* NAV */}
        <Navbar />

        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">
            <p className="hero-search-label">Search 50,000+ peer-reviewed articles</p>
            <div className="hero-search-bar">
              <input type="text" placeholder="Find articles, authors, journals…" />
              <select>
                <option>All Fields</option>
                <option>Title</option>
                <option>Author</option>
                <option>Abstract</option>
                <option>DOI</option>
              </select>
              <button onClick={() => router.push('/search')}>Search</button>
            </div>
            <div className="hero-tags">
              <span style={{ fontSize: '12.5px', color: 'var(--ink-faint)' }}>Popular:</span>
              <a className="hero-tag" href="#">Machine Learning</a>
              <a className="hero-tag" href="#">Climate Science</a>
              <a className="hero-tag" href="#">Quantum Computing</a>
              <a className="hero-tag" href="#">Neuroscience</a>
              <a className="hero-tag" href="#">Genomics</a>
              <a className="hero-tag" href="#">Blockchain</a>
            </div>
            <Link href="/search" className="hero-adv">Advanced search options →</Link>

            {/* SWARNSPACE BANNER */}
            <div className="swarnspace-banner" style={{ marginTop: '0.5rem' }}>
              <div className="swarnspace-banner-left">
                <div className="swarnspace-kicker"><div className="swarnspace-kicker-dot"></div>SwarnSpace</div>
                <h2>{cmsConfig.heroHeadline || 'Advancing Knowledge Through Open Research'}</h2>
                <p>{cmsConfig.heroSubheadline || 'Discover, share, and explore peer-reviewed academic papers across all disciplines on a single open platform.'}</p>
                <div className="banner-btns">
                  <button className="banner-btn-outline" onClick={() => router.push('/browse')}>Browse Papers →</button>
                  <button className="banner-btn-primary" onClick={() => router.push('/submit')}>Submit Research</button>
                </div>
              </div>
              <div className="swarnspace-banner-right">
                <p>Want a personal research feed?</p>
                <button className="banner-try-btn">Try SwarnSpace ↗</button>
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

        {/* FEATURED PAPERS */}
        <section className="section section-bg-white">
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">Featured Papers</h2>
              <Link href="/browse" className="view-all">View all →</Link>
            </div>
            <div className="papers-list">
              {cmsConfig.featuredPaperIds?.length > 0 ? cmsConfig.featuredPaperIds.map((paper: any) => (
                <div className="acm-paper-card" key={paper._id} onClick={() => router.push(`/paper/${paper.slug}`)}>
                  <div className="acm-paper-meta">
                    <span className="acm-paper-type">{paper.subject?.name || 'Research'}</span>
                    <span className="acm-paper-date">{paper.publishedAt ? new Date(paper.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : new Date(paper.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    <span className="acm-paper-status">{paper.status === 'published' ? 'Published' : 'Under Review'}</span>
                  </div>
                  <div className="acm-paper-body">
                    <div className="acm-paper-title">{paper.title}</div>
                    <div className="acm-paper-authors">{Array.isArray(paper.authors) ? paper.authors.join(', ') : 'Unknown'}</div>
                    <div className="acm-paper-abstract">{paper.abstract?.replace(/\[Corresponding Email:.*?\]\s*/gi, '').trim()}</div>
                    <div className="acm-paper-footer">
                      <span className="acm-stat">👁 {paper.views || 0} views</span>
                      <span className="acm-stat">⬇ {paper.downloads || 0} downloads</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Link
                          href={`/paper/${paper.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="acm-view-btn"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )) : papers.length > 0 ? papers.map((paper: any) => (
                <div className="acm-paper-card" key={paper._id} onClick={() => router.push(`/paper/${paper.slug}`)}>
                  <div className="acm-paper-meta">
                    <span className="acm-paper-type">{paper.subject?.name || 'Research'}</span>
                    <span className="acm-paper-date">{paper.publishedAt ? new Date(paper.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : new Date(paper.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    <span className="acm-paper-status">Published</span>
                  </div>
                  <div className="acm-paper-body">
                    <div className="acm-paper-title">{paper.title}</div>
                    <div className="acm-paper-authors">{Array.isArray(paper.authors) ? paper.authors.join(', ') : 'Unknown'}</div>
                    <div className="acm-paper-abstract">{paper.abstract?.replace(/\[Corresponding Email:.*?\]\s*/gi, '').trim()}</div>
                    <div className="acm-paper-footer">
                      <span className="acm-stat">👁 {paper.views || 0} views</span>
                      <span className="acm-stat">⬇ {paper.downloads || 0} downloads</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Link
                          href={`/paper/${paper.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="acm-view-btn"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-faint)' }}>No papers found.</div>
              )}
            </div>
          </div>
        </section>

        {/* SUBJECT AREAS */}
        <section className="section section-bg-sand">
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">Browse by Subject</h2>
              <Link href="/browse" className="view-all">All subjects →</Link>
            </div>
            <div className="subjects-grid">
              <a className="subject-card" href="#">
                <div className="subject-icon">🧬</div>
                <div className="subject-name">Life Sciences</div>
                <div className="subject-count">8,420 papers</div>
              </a>
              <a className="subject-card" href="#">
                <div className="subject-icon">💻</div>
                <div className="subject-name">Computer Science</div>
                <div className="subject-count">12,105 papers</div>
              </a>
              <a className="subject-card" href="#">
                <div className="subject-icon">⚗️</div>
                <div className="subject-name">Chemistry</div>
                <div className="subject-count">5,680 papers</div>
              </a>
              <a className="subject-card" href="#">
                <div className="subject-icon">🏥</div>
                <div className="subject-name">Medicine &amp; Health</div>
                <div className="subject-count">9,340 papers</div>
              </a>
              <a className="subject-card" href="#">
                <div className="subject-icon">⚡</div>
                <div className="subject-name">Engineering</div>
                <div className="subject-count">7,890 papers</div>
              </a>
              <a className="subject-card" href="#">
                <div className="subject-icon">🌍</div>
                <div className="subject-name">Environmental Science</div>
                <div className="subject-count">4,210 papers</div>
              </a>
              <a className="subject-card" href="#">
                <div className="subject-icon">📐</div>
                <div className="subject-name">Mathematics</div>
                <div className="subject-count">3,540 papers</div>
              </a>
              <a className="subject-card" href="#">
                <div className="subject-icon">🔭</div>
                <div className="subject-name">Physics &amp; Astronomy</div>
                <div className="subject-count">4,970 papers</div>
              </a>
            </div>
          </div>
        </section>

        {/* TRENDING */}
        <section className="section section-bg-white">
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">Trending This Week</h2>
              <a href="#" className="view-all">See all trends →</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div className="trending-list">
                <a className="trending-item" href="#">
                  <div className="trending-rank">01</div>
                  <div className="trending-content">
                    <div className="trending-title">GPT-4 and Educational Assessment: A Systematic Review</div>
                    <div className="trending-meta"><span>Priya Nair et al.</span><span>May 2025</span></div>
                  </div>
                  <span className="trending-downloads">↓ 892</span>
                </a>
                <a className="trending-item" href="#">
                  <div className="trending-rank">02</div>
                  <div className="trending-content">
                    <div className="trending-title">CRISPR-Cas9 Gene Editing in Rare Disease Therapy</div>
                    <div className="trending-meta"><span>Dr. Ramesh Kumar</span><span>Apr 2025</span></div>
                  </div>
                  <span className="trending-downloads">↓ 741</span>
                </a>
                <a className="trending-item" href="#">
                  <div className="trending-rank">03</div>
                  <div className="trending-content">
                    <div className="trending-title">Quantum Error Correction in Superconducting Qubits</div>
                    <div className="trending-meta"><span>Anika Shah, D. Verma</span><span>Mar 2025</span></div>
                  </div>
                  <span className="trending-downloads">↓ 634</span>
                </a>
                <a className="trending-item" href="#">
                  <div className="trending-rank">04</div>
                  <div className="trending-content">
                    <div className="trending-title">Solar Panel Efficiency with Perovskite Coating</div>
                    <div className="trending-meta"><span>Sunita Rao, Ajay Mehta</span><span>Feb 2025</span></div>
                  </div>
                  <span className="trending-downloads">↓ 518</span>
                </a>
              </div>
              <div className="trending-list">
                <a className="trending-item" href="#">
                  <div className="trending-rank">05</div>
                  <div className="trending-content">
                    <div className="trending-title">Urban Air Quality Monitoring via IoT Sensor Networks</div>
                    <div className="trending-meta"><span>Kiran Joshi</span><span>May 2025</span></div>
                  </div>
                  <span className="trending-downloads">↓ 487</span>
                </a>
                <a className="trending-item" href="#">
                  <div className="trending-rank">06</div>
                  <div className="trending-content">
                    <div className="trending-title">Multi-Modal Federated Learning for Privacy Preservation</div>
                    <div className="trending-meta"><span>Tanvi Desai et al.</span><span>Apr 2025</span></div>
                  </div>
                  <span className="trending-downloads">↓ 402</span>
                </a>
                <a className="trending-item" href="#">
                  <div className="trending-rank">07</div>
                  <div className="trending-content">
                    <div className="trending-title">Gut Microbiome Dysbiosis and Type-2 Diabetes</div>
                    <div className="trending-meta"><span>Dr. S. Iyer, P. Nanda</span><span>Mar 2025</span></div>
                  </div>
                  <span className="trending-downloads">↓ 376</span>
                </a>
                <a className="trending-item" href="#">
                  <div className="trending-rank">08</div>
                  <div className="trending-content">
                    <div className="trending-title">Structural Analysis of Graphene-based Nanocomposites</div>
                    <div className="trending-meta"><span>Rohit Bansal</span><span>Jan 2025</span></div>
                  </div>
                  <span className="trending-downloads">↓ 318</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section section-bg-sand">
          <div className="section-inner">
            <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', display: 'block', marginBottom: '3rem' }}>
              <h2 className="section-title">How SwarnPublication Works</h2>
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

        {/* JOURNALS SPOTLIGHT */}
        <section className="section section-bg-white">
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">Top Journals</h2>
              <a href="#" className="view-all">All journals →</a>
            </div>
            <div className="journals-grid">
              <a className="journal-card" href="#">
                <div className="journal-icon" style={{ background: '#E1F5EE' }}>📗</div>
                <div>
                  <div className="journal-name">SwarnJournal of Engineering</div>
                  <div className="journal-desc">Covers civil, mechanical, electrical, and computer engineering disciplines with rigorous peer review.</div>
                  <div className="journal-articles">3,240 articles</div>
                </div>
              </a>
              <a className="journal-card" href="#">
                <div className="journal-icon" style={{ background: '#FEF3C7' }}>🔬</div>
                <div>
                  <div className="journal-name">SwarnMed Research Letters</div>
                  <div className="journal-desc">Rapid communication of significant findings in clinical and basic medical sciences.</div>
                  <div className="journal-articles">2,890 articles</div>
                </div>
              </a>
              <a className="journal-card" href="#">
                <div className="journal-icon" style={{ background: '#EDE9FE' }}>💡</div>
                <div>
                  <div className="journal-name">SwarnAI &amp; Computation</div>
                  <div className="journal-desc">Focused on artificial intelligence, machine learning, algorithms, and computational theory.</div>
                  <div className="journal-articles">4,110 articles</div>
                </div>
              </a>
              <a className="journal-card" href="#">
                <div className="journal-icon" style={{ background: '#FEE2E2' }}>🌱</div>
                <div>
                  <div className="journal-name">SwarnEnvironmental Studies</div>
                  <div className="journal-desc">Interdisciplinary research on ecology, climate change, sustainability, and environmental policy.</div>
                  <div className="journal-articles">1,780 articles</div>
                </div>
              </a>
              <a className="journal-card" href="#">
                <div className="journal-icon" style={{ background: '#DBEAFE' }}>⚗️</div>
                <div>
                  <div className="journal-name">SwarnPhysics &amp; Materials</div>
                  <div className="journal-desc">Leading publications on condensed matter physics, nanomaterials, and photonics research.</div>
                  <div className="journal-articles">2,340 articles</div>
                </div>
              </a>
              <a className="journal-card" href="#">
                <div className="journal-icon" style={{ background: '#FAECE7' }}>📊</div>
                <div>
                  <div className="journal-name">SwarnSocial Sciences Quarterly</div>
                  <div className="journal-desc">Peer-reviewed research in economics, sociology, psychology, and public policy.</div>
                  <div className="journal-articles">1,540 articles</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section section-bg-sand">
          <div className="section-inner">
            <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', display: 'block', marginBottom: '2rem' }}>
              <h2 className="section-title">What Researchers Say</h2>
              <p style={{ color: 'var(--ink-muted)', marginTop: '.5rem', fontSize: '14px' }}>Trusted by academics and scientists worldwide.</p>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <div className="testimonial-text">&quot;SwarnPublication made it incredibly easy to submit my thesis research. The peer review process was transparent and the feedback was genuinely helpful.&quot;</div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: 'var(--teal)' }}>PS</div>
                  <div>
                    <div className="testimonial-name">Prof. Priya Sharma</div>
                    <div className="testimonial-role">IIT Delhi — Computer Science</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <div className="testimonial-text">&quot;The search functionality is outstanding. I can find relevant papers within seconds, filter by subject and year, and download PDFs instantly. Highly recommended.&quot;</div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: 'var(--orange)' }}>RK</div>
                  <div>
                    <div className="testimonial-name">Dr. Rajesh Kumar</div>
                    <div className="testimonial-role">AIIMS Mumbai — Pathology</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">★★★★☆</div>
                <div className="testimonial-text">&quot;As an independent researcher without institutional affiliation, having free open-access papers has been a game changer for my work in climate modeling.&quot;</div>
                  <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: '#7C3AED' }}>AM</div>
                  <div>
                    <div className="testimonial-name">Aisha Mansoor</div>
                    <div className="testimonial-role">Independent Researcher — Climate Science</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="newsletter-section">
          <h2>Stay Updated with New Research</h2>
          <p>Get weekly digests of the most-downloaded papers in your field, plus calls for submissions and journal announcements.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="your@email.com" />
            <button>Subscribe</button>
          </div>
          <p className="newsletter-note">No spam. Unsubscribe at any time. We respect your privacy.</p>
        </section>


        {/* TRUSTED PARTNERS */}
        <section className="section section-bg-sand">
          <div className="section-inner">
            <div className="divider-label">Trusted by institutions worldwide</div>
            <div className="partners-row">
              <div className="partner-pill">IIT Bombay</div>
              <div className="partner-pill">University of Delhi</div>
              <div className="partner-pill">AIIMS</div>
              <div className="partner-pill">NIT Trichy</div>
              <div className="partner-pill">TIFR</div>
              <div className="partner-pill">IISc Bangalore</div>
              <div className="partner-pill">Jadavpur University</div>
              <div className="partner-pill">Panjab University</div>
              <div className="partner-pill">Anna University</div>
            </div>
          </div>
        </section>

        {/* SUBMIT CTA */}
        <div className="submit-cta">
          <div className="submit-cta-inner">
            <div>
              <h2>Ready to Share Your Research?</h2>
              <p>Join 18,000+ authors who have published on SwarnPublication. Fast submission, rigorous peer review, global visibility.</p>
            </div>
            <div className="submit-cta-actions">
              <button className="cta-btn-sec">Learn About Submission</button>
              <button className="cta-btn-main" onClick={() => router.push('/submit')}>Submit Your Paper →</button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer>
          <div className="footer-inner">
            <div className="footer-grid">
              <div>
                <div className="footer-brand-name">SwarnPublication</div>
                <div className="footer-tagline">Advancing knowledge through open, peer-reviewed research across all scientific disciplines.</div>
                <div className="footer-social">
                  <a href="#">𝕏</a>
                  <a href="#">in</a>
                  <a href="#">fb</a>
                  <a href="#">yt</a>
                </div>
              </div>
              <div className="footer-col">
                <h4>About SwarnPublication</h4>
                <a href="#">Help</a>
                <a href="#">Online video tutorials</a>
                <a href="#">Our mission</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
              </div>
              <div className="footer-col">
                <h4>Explore SwarnPublication</h4>
                <a href="#">Content syndication</a>
                <a href="#">Create and manage alerts</a>
                <a href="#">SwarnSpace</a>
                <a href="#">Open Access policy</a>
                <Link href="/submit">Submit Research</Link>
              </div>
              <div className="footer-col">
                <h4>Explore Our Network</h4>
                <a href="#">Swarn Connect</a>
                <a href="#">Publish with Swarn</a>
                <a href="#">Institutional access</a>
                <a href="#">Author guidelines</a>
                <a href="#">Reviewer portal</a>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="footer-bottom-text">© 2025 SwarnPublication. All rights reserved.</div>
              <div className="footer-bottom-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
                <a href="#">Cookie Settings</a>
                <a href="#">Accessibility</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
