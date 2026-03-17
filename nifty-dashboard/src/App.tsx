import { useEffect, useMemo, useState } from 'react';
import { useMarketData } from './hooks/useNiftyData';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [strengthSlide, setStrengthSlide] = useState(0);
  const [activePhilo, setActivePhilo] = useState(0);
  const { data, loading } = useMarketData({ symbol: '^NSEI' });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const strengths = useMemo(
    () => [
      {
        id: '1',
        title: 'Discipline',
        description:
          'We operate with strict trading discipline across every market condition. Positions are taken based on predefined rules, controlled risk exposure, and structured execution rather than impulse or speculation. This consistency allows us to navigate volatility, protect capital, and sustain performance over the long term.',
        icon: '🎯',
        image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      },
      {
        id: '2',
        title: 'Risk Management',
        description:
          'We do not trade to be right. We trade to stay in the game. Every position has defined risk, clear exits, and strict limits on exposure. Protecting capital comes first because without it, nothing else matters.',
        icon: '🛡️',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      },
      {
        id: '3',
        title: 'Speed & Execution',
        description:
          'In fast markets, hesitation is expensive. Decisions are made quickly, orders are placed with intent, and positions are managed without second guessing. We focus on clean entries, disciplined exits, and staying aligned with the market rather than fighting it.',
        icon: '⚡',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      },
      {
        id: '4',
        title: 'Technology',
        description:
          'Trading performance is built on dependable infrastructure. We prioritize stability, accurate market data, and an environment that allows traders to focus on decision making rather than technical distractions. In high pressure conditions, simplicity and reliability outperform complexity.',
        icon: '💻',
        image_url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
      },
    ],
    []
  );

  useEffect(() => {
    const t = setInterval(() => setStrengthSlide((s) => (s + 1) % strengths.length), 5000);
    return () => clearInterval(t);
  }, [strengths.length]);

  const strengthStyle = (index: number) => {
    const len = strengths.length;
    const delta = ((index - strengthSlide) % len + len) % len;
    if (delta === 0) return { transform: 'translateX(0%) translateZ(0px) rotateY(0deg) scale(1)', opacity: 1, zIndex: 3 };
    if (delta === 1) return { transform: 'translateX(70%) translateZ(-200px) rotateY(-35deg) scale(0.85)', opacity: 0.6, zIndex: 2 };
    if (delta === len - 1) return { transform: 'translateX(-70%) translateZ(-200px) rotateY(35deg) scale(0.85)', opacity: 0.6, zIndex: 2 };
    return { transform: 'translateX(0%) translateZ(-400px) scale(0.6)', opacity: 0, zIndex: 1 };
  };

  const philo = useMemo(
    () => [
      {
        title: 'Risk-first approach',
        description:
          'Every trade is planned around defined downside before upside is considered. Capital is allocated with restraint, and exposure is adjusted continuously as conditions change. Protecting the firm’s capital is not a defensive posture but a strategic one that enables long-term participation in volatile markets.',
        image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
      },
      {
        title: 'Structured decision-making',
        description:
          'We rely on disciplined evaluation rather than instinct. By following a consistent framework for trade selection and management, we reduce randomness and maintain clarity even during periods of heightened volatility. Structure replaces guesswork.',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      },
      {
        title: 'Consistency over speculation',
        description:
          'Sustainable performance comes from repeatable behaviour, not isolated wins. We favour controlled, methodical trading over attempts to capture every dramatic market move. Stability, not excitement, is what ultimately builds long-term results.',
        image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80',
      },
    ],
    []
  );

  const chart = useMemo(() => {
    const points = (data?.chartData ?? []).slice(-240).filter((p) => typeof p.price === 'number' && !Number.isNaN(p.price));
    if (points.length < 2) return null;

    const w = 1000;
    const h = 220;
    const prices = points.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || 1;
    const x = (i: number) => (i / (points.length - 1)) * w;
    const y = (v: number) => h - ((v - min) / span) * h;

    const d = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(p.price).toFixed(2)}`)
      .join(' ');

    const area = `${d} L ${w} ${h} L 0 ${h} Z`;
    return { line: d, area };
  }, [data]);

  const isPositive = (data?.change ?? 0) >= 0;
  const priceText = data
    ? data.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    : '—';
  const changeAbs = data ? Math.abs(data.change).toFixed(2) : '0.00';
  const changePctAbs = data ? Math.abs(data.changePercent).toFixed(2) : '0.00';

  return (
    <div className="app">
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <div className="logo-text">
              <div className="logo-first">GammaFlow</div>
              <div className="logo-futures">Capital</div>
            </div>
          </div>
          <div className="navbar-menu-wrapper">
            <ul className="navbar-menu">
              <li><a href="#markets">Markets</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#philo">Philosophy</a></li>
            </ul>
            <button className="join-btn" type="button" onClick={() => document.getElementById('philo')?.scrollIntoView({ behavior: 'smooth' })}>
              Join Us
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M8 6L12 10L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <video className="hero-video" autoPlay loop muted playsInline preload="auto">
            <source src="https://gammaflowcaptial.vercel.app/assets/officeview-C4aGUlvs.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1 className="hero-title">Built for Traders Who Take Markets Seriously</h1>
            <p className="hero-subtitle">
              A focused trading firm specializing in Futures &amp; Options, Where discipline, speed, and consistency define performance
            </p>
            <button className="hero-cta" type="button" onClick={() => document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth' })}>
              Join Us
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M8 6L12 10L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div id="markets" className={`da-section visible`}>
          <div className="da-container">
            <div className="da-grid">
              <div className="da-left">
                <div className="da-header fade-in">
                  <div className="da-title-row">
                    <h1 className="da-index-name">NIFTY 50</h1>
                    <span className="da-index-code">INDEXNSE: NIFTY_50</span>
                  </div>
                  <div className="da-live-badge">
                    <span className={`da-live-dot ${loading ? 'loading' : ''}`} />
                    <span className="da-live-text">{loading ? 'Connecting...' : 'LIVE'}</span>
                  </div>
                </div>

                <div className="da-price-block slide-up">
                  <div className="da-current-price">{priceText}</div>
                  <div className={`da-change ${isPositive ? 'positive' : 'negative'}`}>
                    <span className="da-change-arrow">{isPositive ? '▲' : '▼'}</span>
                    <span className="da-change-val">{isPositive ? '+' : ''}{changeAbs}</span>
                    <span className="da-change-pct">({isPositive ? '+' : ''}{changePctAbs}%)</span>
                    <span className="da-change-period">today</span>
                  </div>
                  <div className="da-timestamp">
                    {data ? `${data.timestamp.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${data.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST` : '—'}
                  </div>
                </div>

                <div className="da-chart-wrap">
                  <div className="da-flag-row">
                    {['1D', '1M', '3M', '6M', '1Y'].map((t) => (
                      <button key={t} type="button" className={`da-flag-btn ${t === '1D' ? 'active' : ''} ${isPositive ? 'positive-theme' : 'negative-theme'}`}>
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="da-prev-close-info">
                    <span className="da-prev-close-label">Prev close</span>
                    <span className="da-prev-close-val">{data ? data.previousClose.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '—'}</span>
                  </div>

                  {!chart || loading ? (
                    <div className="da-chart-skeleton">
                      <div className="da-skeleton-shimmer" />
                      <span className="da-loading-text">{loading ? 'Loading market data...' : 'Loading 1D chart...'}</span>
                    </div>
                  ) : (
                    <svg className="da-svg animated" viewBox="0 0 1000 220" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                          <stop offset="70%" stopColor="#22c55e" stopOpacity="0.08" />
                          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                          <stop offset="70%" stopColor="#ef4444" stopOpacity="0.08" />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </linearGradient>
                        <filter id="lineGlow" x="-5%" y="-50%" width="110%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {[0.2, 0.4, 0.6, 0.8].map((p) => (
                        <line key={p} x1="0" y1={220 * p} x2="1000" y2={220 * p} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                      ))}
                      <path d={chart.area} fill={`url(#${isPositive ? 'greenGrad' : 'redGrad'})`} />
                      <path
                        d={chart.line}
                        fill="none"
                        stroke={isPositive ? '#22c55e' : '#ef4444'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#lineGlow)"
                        className="da-chart-line"
                      />
                    </svg>
                  )}

                  <div className="da-time-labels">
                    {['9:15 am', '11:30 am', '1:30 pm', '3:30 pm'].map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>

                <div className="da-stats slide-up-delay">
                  {[
                    { label: 'Open', value: data?.open },
                    { label: 'High', value: data?.high },
                    { label: '52-wk high', value: data?.high },
                    { label: 'Low', value: data?.low },
                    { label: 'Prev close', value: data?.previousClose },
                    { label: '52-wk low', value: data?.low },
                  ].map((s) => (
                    <div key={s.label} className="da-stat">
                      <span className="da-stat-label">{s.label}</span>
                      <span className="da-stat-value">{loading || !data ? '—' : (s.value ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="da-right slide-in">
                <div className="oc-card oc-loading">
                  <div className="da-skeleton-shimmer" />
                  <span className="da-loading-text">Loading option chain...</span>
                </div>

                <div className="da-summary-card fade-in-delay">
                  <h3 className="da-summary-title">Market Pulse</h3>
                  <div className="da-summary-row">
                    <span>Trend</span>
                    <span className={isPositive ? 'positive' : 'negative'}>{isPositive ? '📈 Bullish' : '📉 Bearish'}</span>
                  </div>
                  <div className="da-summary-row">
                    <span>Day Range</span>
                    <span>{loading || !data ? '—' : `${data.low.toLocaleString('en-IN', { maximumFractionDigits: 2 })}– ${data.high.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}</span>
                  </div>
                  <div className="da-summary-row">
                    <span>vs Prev Close</span>
                    <span className={isPositive ? 'positive' : 'negative'}>{loading || !data ? '—' : `${isPositive ? '+' : ''}${data.changePercent.toFixed(2)}%`}</span>
                  </div>
                  <div className="da-summary-row">
                    <span>52W Position</span>
                    <span>{loading || !data ? '—' : '—'}</span>
                  </div>
                  <div className="da-summary-row">
                    <span>Data Source</span>
                    <span style={{ opacity: 0.7, fontSize: '0.85em' }}>🔵 Proxy (Last Close)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="about" className="about-section">
          <canvas className="about-candle-canvas" />
          <div className="about-bg-grid" />
          <div className="about-bg-glow about-bg-glow--1" />
          <div className="about-bg-glow about-bg-glow--2" />
          <div className="about-content">
            <div className="about-text">
              <h2 className="about-title">About GammaFlow Capital</h2>
              <p className="about-description">
                GammaFlow Capital is a proprietary trading firm focused on index and equity derivatives across the Indian markets. We combine disciplined risk management, structured decision-making, and high-speed execution to operate in fast-moving Futures &amp; Options environments. Our approach prioritizes capital preservation, consistency, and professional conduct over speculation, enabling traders to perform at an institutional standard.
              </p>
            </div>
          </div>
        </section>

        <section id="philo" className="company-cards-section">
          <div className="company-cards-container">
            <div className="company-card-left animate">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H21M19 21H14M5 21H3M5 21H10M14 21V16C14 15.4477 13.5523 15 13 15H11C10.4477 15 10 15.4477 10 16V21M14 21H10M9 8H10M9 12H10M14 8H15M14 12H15" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="card-title animate">GammaFlow Capital</h2>
              <p className="card-text animate">
                GammaFlow Capital exists for people who take markets seriously but refuse to treat trading like a lottery ticket. We operate in the chaos of derivatives with discipline, curiosity, and a healthy respect for risk. No hype, no signals, no shortcuts. Just focused execution in environments where one bad decision can erase weeks of work.
              </p>
            </div>

            <div className="company-card-right animate">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M13 10V3L4 14H11L11 21L20 10L13 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="card-title animate">Mission</h2>
              <p className="card-text animate">
                To build a professional trading environment where disciplined individuals can operate at scale, manage risk responsibly, and turn skill into sustainable performance. Profit matters, but how it is achieved matters more.
              </p>
            </div>

            <div className="company-card-right animate">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.45801 12C3.73201 7.943 7.52301 5 12 5C16.478 5 20.268 7.943 21.542 12C20.268 16.057 16.478 19 12 19C7.52301 19 3.73201 16.057 2.45801 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="card-title animate">Vision</h2>
              <p className="card-text animate">
                To grow into a respected proprietary trading firm known for consistency, accountability, and traders who can survive volatility without losing composure. Not the loudest firm in the room, just one of the most effective.
              </p>
            </div>
          </div>
        </section>

        {/* Market We Trade + Key Strengths (carousel) */}
        <div className="what-we-do-wrapper">
          <div className="what-we-do-header">
            <div className="header-content">
              <div className="header-left">
                <h2 className="section-label">Market We Trade</h2>
                <h1 className="main-heading">
                  Index Derivatives
                  <br />
                  Stock Futures &amp; Options
                  <br />
                  Intraday / Positional
                </h1>
              </div>
              <div className="header-right">
                <p className="main-description">
                  GammaFlow Capital is a technology-enabled services firm operating in the domain of global derivatives markets.
                </p>
                <p className="sub-description">
                  We focus on index and equity derivatives in the Indian markets, primarily Futures and Options where liquidity, volatility,
                  and leverage create meaningful opportunities. These instruments demand discipline and precision, not guesswork. By
                  concentrating on a defined segment of the market, we develop familiarity with its behavior, structure, and risk dynamics
                  instead of chasing every moving asset.
                </p>
                <button className="cta-button" type="button" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                  Get to Know Us
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 7L11 10L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="core-values-title">
            <h2>Key Strengths</h2>
          </div>

          <div className="carousel-section">
            <div className="carousel-container">
              <div className="carousel-track">
                {strengths.map((s, idx) => (
                  <div key={s.id} className="carousel-card" style={strengthStyle(idx)} onClick={() => setStrengthSlide(idx)} role="button" tabIndex={0}>
                    <div className="card-background" style={{ backgroundImage: `url(${s.image_url})` }} />
                    <div className="card-overlay" />
                    <div className="card-content">
                      <div className="card-bottom">
                        <h3 className="card-title-1">{s.title}</h3>
                      </div>
                      <div className="card-expanded">
                        <div className="card-icon-expanded">{s.icon}</div>
                        <h3 className="card-title-expanded">{s.title}</h3>
                        <p className="card-description">{s.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="carousel-dots">
              {strengths.map((_, idx) => (
                <button key={idx} type="button" className={`dot ${idx === strengthSlide ? 'active' : ''}`} onClick={() => setStrengthSlide(idx)} aria-label={`Go to slide ${idx + 1}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Trading Philosophies */}
        <section className="philo-section">
          <div className="philo-header">
            <span className="philo-eyebrow">Our Philosophy</span>
            <h2 className="philo-heading">The Principles Behind Every Trade</h2>
          </div>
          <div className="philo-cards-container">
            {philo.map((p, idx) => (
              <div
                key={p.title}
                className={`philo-card ${idx === activePhilo ? 'philo-card--active' : 'philo-card--inactive'}`}
                style={{ backgroundImage: `url(${p.image_url})` }}
                onClick={() => setActivePhilo(idx)}
                role="button"
                tabIndex={0}
              >
                <div className="philo-card__blur-layer" />
                <div className="philo-card__overlay" />
                <div className="philo-card__number">{String(idx + 1).padStart(2, '0')}</div>
                <div className="philo-card__content">
                  <div className="philo-card__accent-line" />
                  <h3 className="philo-card__title">{p.title}</h3>
                  <div className="philo-card__desc-wrap">
                    <p className="philo-card__description">{p.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Our Team */}
        <section className="careers-section">
          <div className="careers-container">
            <div className="careers-header">
              <h2 className="careers-title">Join Our Team</h2>
              <h3 className="careers-subtitle">Be Part of The GammaFlow</h3>
              <p className="careers-description">
                We partner with a small number of serious traders who value discipline, consistency, and accountability. If your approach aligns with these principles, we encourage you to explore opportunities with us.
              </p>
              <button className="cta-button" type="button">
                Join Us
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M8 6L12 10L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="features-grid">
              {[
                {
                  title: 'Real-Time Collaboration',
                  desc: 'Communicate seamlessly and keep everyone in sync with built-in messaging, file sharing, and live updates.',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M7 8h10M7 12h6M21 12a8 8 0 1 1-4.8-7.3" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  title: 'Task & Project Tracking',
                  desc: 'Assign tasks, set deadlines, and visualize progress with boards, lists, and timelines tailored to your team.',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M9 11l3 3L22 4M2 20h20" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  title: 'Performance Insights',
                  desc: 'Make smarter decisions with analytics that show productivity trends, bottlenecks, and workload balance.',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 19V5M4 19h16M8 15l3-3 3 2 4-6" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
              ].map((f, i) => (
                <div key={f.title} className="feature-card animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="contact-card-inline">
              <div className="contact-card-1">
                <div className="contact-card-content-1">
                  <div className="contact-icon-1">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 12L7 12L10 3L14 21L17 12L21 12" stroke="#60c5f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3>Let’s Connect</h3>
                  <p>For inquiries, partnerships, or career-related questions, our team is available to assist.</p>
                  <button className="contact-button-1" type="button">
                    Contact Us
                    <span className="button-glow" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <canvas className="footer-canvas" />
          <div className="footer-content">
            <div className="footer-top">
              <div className="footer-logo-section">
                <div className="footer-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} role="button" tabIndex={0}>
                  <div className="footer-logo-text">
                    <div className="footer-logo-first">GammaFlow</div>
                    <div className="footer-logo-futures">Capital</div>
                  </div>
                </div>
              </div>

              <div className="footer-links">
                {[
                  ['Markets', 'About', 'Careers'],
                  ['Resources', 'FAQ', 'Privacy'],
                  ['Terms', 'CSR Policy', 'Contact'],
                ].map((col, idx) => (
                  <div key={idx} className="footer-column">
                    {col.map((t) => (
                      <button key={t} type="button">
                        {t}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <div className="footer-social">
                <div className="social-icon-row">
                  <button className="social-icon social-linkedin" type="button" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9v12M6 6.5v.1M10 21v-7.2c0-2.3 3-2.5 3 0V21m0-6c0-2.1 3-2.3 3 0V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button className="social-icon social-mail" type="button" aria-label="Email">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                <div className="footer-legal footer-legal--mobile">
                  <button type="button">Privacy</button>
                  <span className="separator">·</span>
                  <button type="button">Terms</button>
                </div>
              </div>
            </div>

            <div className="footer-divider" />
            <div className="footer-bottom">
              <div className="footer-legal footer-legal--desktop">
                <button type="button">Privacy Policy</button>
                <span className="separator">·</span>
                <button type="button">Terms</button>
              </div>
              <div className="footer-copyright">© GammaFlow Capital. All rights reserved 2026</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
