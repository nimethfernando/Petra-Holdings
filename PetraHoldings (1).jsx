import React, { useState, useEffect, useRef } from 'react';

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function CountUp({ end, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay} ${inView ? 'visible' : ''}`}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════
   SHARED CSS
════════════════════════════════════════ */
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #C9A84C;
    --gold-lt: #e8c96a;
    --gold-glow: rgba(201,168,76,0.25);
    --ink: #0A0A0B;
    --ink-2: #111115;
    --ink-3: #1A1A22;
    --ink-4: #242432;
    --slate: #5A5A72;
    --mist: #9090A8;
    --fog: #C8C8D8;
    --white: #FAFAF8;
    --r: 14px;
    --r-sm: 8px;
    font-family: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--ink); color: var(--fog); overflow-x: hidden; }

  .cursor {
    width: 12px; height: 12px; background: var(--gold); border-radius: 50%;
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
    transform: translate(-50%,-50%);
    transition: transform 0.08s, width 0.25s, height 0.25s;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    width: 36px; height: 36px; border: 1.5px solid var(--gold); border-radius: 50%;
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998;
    transform: translate(-50%,-50%); transition: all 0.18s ease; opacity: 0.6;
  }

  body::before {
    content: ''; position: fixed; inset: 0; z-index: 1; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
  }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3rem; height: 72px;
    transition: all 0.4s ease; border-bottom: 1px solid transparent;
  }
  nav.scrolled {
    background: rgba(10,10,11,0.92); backdrop-filter: blur(18px);
    border-bottom-color: rgba(201,168,76,0.15); height: 60px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  }
  nav.solid {
    background: rgba(10,10,11,0.97); backdrop-filter: blur(18px);
    border-bottom-color: rgba(201,168,76,0.12); height: 64px;
    box-shadow: 0 4px 30px rgba(0,0,0,0.4);
  }
  .nav-logo {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.7rem;
    letter-spacing: 2px; color: var(--white); cursor: pointer;
  }
  .nav-logo span { color: var(--gold); }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: var(--mist); text-decoration: none;
    position: relative; padding-bottom: 4px; transition: color 0.3s;
  }
  .nav-links a::after {
    content: ''; position: absolute; left: 0; bottom: 0;
    width: 100%; height: 1.5px; background: var(--gold);
    transform: scaleX(0); transform-origin: right;
    transition: transform 0.35s cubic-bezier(0.77,0,0.18,1);
  }
  .nav-links a:hover, .nav-links a.active { color: var(--white); }
  .nav-links a:hover::after, .nav-links a.active::after { transform: scaleX(1); transform-origin: left; }
  .nav-links a.active { color: var(--gold-lt); }
  .nav-links a.contact-link { color: var(--gold); }
  .nav-links a.contact-link:hover { color: var(--gold-lt); }
  .nav-cta {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--ink); background: var(--gold);
    padding: 10px 22px; border-radius: 3px; text-decoration: none;
    transition: all 0.3s; border: none; cursor: pointer;
  }
  .nav-cta:hover { background: var(--gold-lt); box-shadow: 0 0 24px var(--gold-glow); transform: translateY(-2px); }
  .nav-cta.active-page { background: var(--ink-3); color: var(--gold); border: 1.5px solid rgba(201,168,76,0.4); }
  .nav-cta.active-page:hover { background: var(--ink-4); }
  .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; z-index: 200; }
  .hamburger span { width: 26px; height: 2px; background: var(--white); border-radius: 2px; transition: all 0.3s; }
  .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }
  .mobile-drawer {
    position: fixed; inset: 0; z-index: 99;
    background: rgba(10,10,11,0.97); backdrop-filter: blur(20px);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
    opacity: 0; pointer-events: none; transform: translateX(100%);
    transition: all 0.45s cubic-bezier(0.77,0,0.18,1);
  }
  .mobile-drawer.open { opacity: 1; pointer-events: all; transform: translateX(0); }
  .mobile-drawer a {
    font-family: 'Bebas Neue', sans-serif; font-size: 3rem; letter-spacing: 4px;
    color: var(--white); text-decoration: none; transition: color 0.3s;
  }
  .mobile-drawer a:hover { color: var(--gold); }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-block; padding: 15px 36px;
    background: var(--gold); color: var(--ink);
    font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    text-decoration: none; border-radius: 3px; border: none; cursor: pointer;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .btn-primary:hover { background: var(--gold-lt); transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 40px var(--gold-glow); }
  .btn-ghost {
    display: inline-block; padding: 14px 36px;
    border: 1.5px solid rgba(201,168,76,0.35); color: var(--fog);
    font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    text-decoration: none; border-radius: 3px; background: transparent; cursor: pointer;
    transition: all 0.3s;
  }
  .btn-ghost:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-glow); transform: translateY(-3px); }

  /* ── SECTION COMMONS ── */
  .section-tag {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold); display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;
  }
  .section-tag::before { content:''; width: 28px; height: 1.5px; background: var(--gold); display: block; }
  .section-h { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1; color: var(--white); margin-bottom: 1.5rem; letter-spacing: 1.5px; }
  .section-sub { color: var(--mist); font-size: 1rem; line-height: 1.7; max-width: 560px; }
  .divider { width: 40px; height: 2px; background: var(--gold); margin: 1.5rem 0; transition: width 0.4s; }
  *:hover > .divider { width: 80px; }

  /* ── REVEAL ── */
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity: 1; transform: none; }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }

  @keyframes fadeUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: none; } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  /* ── FOOTER ── */
  footer {
    background: var(--ink); border-top: 1px solid rgba(201,168,76,0.1);
    padding: 4rem 3rem 2rem;
  }
  .footer-inner { max-width: 1200px; margin: 0 auto; }
  .footer-top { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(201,168,76,0.08); }
  .footer-brand-name { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 2px; color: var(--white); margin-bottom: 0.5rem; cursor: pointer; }
  .footer-brand-name span { color: var(--gold); }
  .footer-tagline { font-size: 0.8rem; color: var(--mist); line-height: 1.6; max-width: 220px; }
  .footer-col-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold); margin-bottom: 1.2rem; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
  .footer-links a, .footer-links span { font-size: 0.85rem; color: var(--mist); text-decoration: none; transition: color 0.3s; cursor: pointer; }
  .footer-links a:hover, .footer-links span:hover { color: var(--white); }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-top: 2rem; }
  .footer-copy { font-size: 0.75rem; color: var(--slate); font-family: 'DM Mono', monospace; }
  .footer-badge { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; color: var(--slate); }
  .badge-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; animation: blink 2s ease-in-out infinite; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    nav { padding: 0 1.5rem; }
    .nav-links, nav > a.nav-cta { display: none; }
    .hamburger { display: flex; }
  }
`;

/* ════════════════════════════════════════
   HOME PAGE CSS
════════════════════════════════════════ */
const HOME_CSS = `
  #home {
    min-height: 100svh; display: grid; place-items: center;
    padding: 140px 3rem 80px; position: relative; overflow: hidden;
    background: var(--ink);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px);
    background-size: 60px 60px; animation: gridPan 20s linear infinite;
  }
  @keyframes gridPan { from { background-position: 0 0; } to { background-position: 60px 60px; } }
  .hero-glow {
    position: absolute; width: 800px; height: 800px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%,-60%);
    animation: glowPulse 6s ease-in-out infinite;
  }
  @keyframes glowPulse { 0%,100% { transform: translate(-50%,-60%) scale(1); } 50% { transform: translate(-50%,-60%) scale(1.12); } }
  .hero-inner { max-width: 900px; position: relative; z-index: 2; }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 2rem;
    opacity: 0; animation: fadeUp 0.8s 0.2s forwards;
  }
  .hero-tag::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--gold); }
  .hero-h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 10vw, 8.5rem); line-height: 0.92; letter-spacing: 2px;
    color: var(--white); margin-bottom: 2rem;
    opacity: 0; animation: fadeUp 0.9s 0.35s forwards;
  }
  .hero-h1 em { font-style: normal; color: var(--gold); display: block; }
  .hero-sub {
    font-size: 1.05rem; line-height: 1.7; color: var(--mist); max-width: 540px; margin-bottom: 3rem;
    opacity: 0; animation: fadeUp 0.9s 0.5s forwards;
  }
  .hero-btns { display: flex; flex-wrap: wrap; gap: 1rem; opacity: 0; animation: fadeUp 0.9s 0.65s forwards; }
  .hero-scroll {
    position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    opacity: 0; animation: fadeIn 1s 1.2s forwards;
    font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase; color: var(--slate);
  }
  .scroll-line {
    width: 1.5px; height: 50px; background: linear-gradient(to bottom, var(--gold), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse { 0%,100% { transform: scaleY(1); opacity: 1; } 50% { transform: scaleY(0.6); opacity: 0.4; } }

  .metrics-band {
    background: var(--ink-3);
    border-top: 1px solid rgba(201,168,76,0.15); border-bottom: 1px solid rgba(201,168,76,0.15);
    padding: 3rem; display: flex; justify-content: center; flex-wrap: wrap;
  }
  .metric-item {
    flex: 1; min-width: 160px; max-width: 260px; padding: 1.5rem 2.5rem; text-align: center;
    border-right: 1px solid rgba(201,168,76,0.1); transition: background 0.3s;
  }
  .metric-item:last-child { border-right: none; }
  .metric-item:hover { background: rgba(201,168,76,0.04); }
  .metric-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 3.5rem; line-height: 1;
    background: linear-gradient(135deg, var(--gold-lt), var(--gold));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .metric-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--slate); margin-top: 6px; }

  /* services */
  #services { background: var(--ink-2); padding: 110px 3rem; }
  .services-inner { max-width: 1200px; margin: 0 auto; }
  .services-header { margin-bottom: 5rem; }
  .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5px; background: rgba(201,168,76,0.08); border-radius: var(--r); overflow: hidden; }
  .service-card { background: var(--ink-2); padding: 3rem 2.5rem; position: relative; overflow: hidden; transition: background 0.4s; cursor: default; }
  .service-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%); opacity: 0; transition: opacity 0.4s; }
  .service-card:hover { background: var(--ink-3); }
  .service-card:hover::before { opacity: 1; }
  .service-num { font-family: 'Bebas Neue', sans-serif; font-size: 5rem; line-height: 1; color: rgba(201,168,76,0.08); transition: color 0.4s; letter-spacing: 2px; position: absolute; top: 1.5rem; right: 2rem; }
  .service-card:hover .service-num { color: rgba(201,168,76,0.18); }
  .service-icon { width: 48px; height: 48px; margin-bottom: 1.5rem; background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.3); border-radius: 10px; display: grid; place-items: center; font-size: 1.4rem; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  .service-card:hover .service-icon { transform: scale(1.1) rotate(-5deg); background: rgba(201,168,76,0.15); border-color: var(--gold); box-shadow: 0 8px 30px var(--gold-glow); }
  .service-title { font-size: 1.2rem; font-weight: 700; color: var(--white); margin-bottom: 0.75rem; line-height: 1.3; }
  .service-desc { font-size: 0.88rem; color: var(--mist); line-height: 1.7; }
  .service-arrow { display: inline-flex; align-items: center; gap: 6px; margin-top: 1.5rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold); opacity: 0; transform: translateX(-8px); transition: all 0.3s; }
  .service-card:hover .service-arrow { opacity: 1; transform: translateX(0); }

  /* projects */
  #projects { background: var(--ink); padding: 110px 3rem; }
  .projects-inner { max-width: 1200px; margin: 0 auto; }
  .projects-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3.5rem; flex-wrap: wrap; gap: 1rem; }
  .projects-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; }
  .proj-card { position: relative; overflow: hidden; border-radius: var(--r-sm); background: var(--ink-3); cursor: pointer; border: 1px solid rgba(201,168,76,0.08); transition: border-color 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s; }
  .proj-card:hover { border-color: rgba(201,168,76,0.35); transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.08); }
  .proj-card:nth-child(1) { grid-column: 1 / 8; grid-row: 1; min-height: 380px; }
  .proj-card:nth-child(2) { grid-column: 8 / 13; grid-row: 1; }
  .proj-card:nth-child(3) { grid-column: 1 / 5; grid-row: 2; min-height: 260px; }
  .proj-card:nth-child(4) { grid-column: 5 / 9; grid-row: 2; }
  .proj-card:nth-child(5) { grid-column: 9 / 13; grid-row: 2; }
  .proj-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.6s ease, filter 0.4s; filter: brightness(0.4) saturate(0.7); }
  .proj-card:hover .proj-bg { transform: scale(1.06); filter: brightness(0.5) saturate(0.8); }
  .proj-bg-1 { background: linear-gradient(135deg, #1a1f2e, #2a3a4a); }
  .proj-bg-2 { background: linear-gradient(135deg, #1e1a2a, #2e2a3e); }
  .proj-bg-3 { background: linear-gradient(135deg, #0e1a1a, #1a2e2e); }
  .proj-bg-4 { background: linear-gradient(135deg, #1a1412, #2e2218); }
  .proj-bg-5 { background: linear-gradient(135deg, #121820, #1e2c38); }
  .proj-pattern { position: absolute; inset: 0; opacity: 0.12; background-image: repeating-linear-gradient(0deg, rgba(201,168,76,0.4) 0, rgba(201,168,76,0.4) 1px, transparent 0, transparent 40px), repeating-linear-gradient(90deg, rgba(201,168,76,0.4) 0, rgba(201,168,76,0.4) 1px, transparent 0, transparent 40px); transition: opacity 0.4s; }
  .proj-card:hover .proj-pattern { opacity: 0.2; }
  .proj-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,11,0.95) 0%, rgba(10,10,11,0.3) 60%, transparent 100%); z-index: 1; }
  .proj-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; z-index: 2; transform: translateY(6px); transition: transform 0.35s; }
  .proj-card:hover .proj-content { transform: translateY(0); }
  .proj-type { font-size: 0.62rem; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
  .proj-title { font-size: 1.2rem; font-weight: 700; color: var(--white); line-height: 1.3; }
  .proj-year { font-size: 0.75rem; color: var(--mist); margin-top: 4px; font-family: 'DM Mono', monospace; }

  /* about */
  #about { background: var(--ink-2); padding: 110px 3rem; }
  .about-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
  .about-visual { position: relative; aspect-ratio: 4/5; border-radius: var(--r); overflow: hidden; background: var(--ink-3); border: 1px solid rgba(201,168,76,0.12); }
  .about-visual-inner { position: absolute; inset: 0; background: linear-gradient(135deg, var(--ink-4) 0%, var(--ink-2) 100%); display: flex; align-items: center; justify-content: center; }
  .about-visual-badge { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--ink); padding: 12px 28px; border-radius: 40px; font-size: 0.72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; white-space: nowrap; box-shadow: 0 8px 30px rgba(201,168,76,0.35); }
  .big-icon { font-size: 6rem; opacity: 0.08; user-select: none; }
  .about-accent { position: absolute; top: 2rem; right: -1.5rem; width: 120px; height: 120px; border: 2px solid rgba(201,168,76,0.2); border-radius: 50%; pointer-events: none; }
  .about-accent-2 { position: absolute; bottom: 3rem; left: -2rem; width: 80px; height: 80px; border: 1.5px solid rgba(201,168,76,0.12); border-radius: 50%; pointer-events: none; }
  .about-features { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2.5rem; }
  .feature-row { display: flex; align-items: flex-start; gap: 1.2rem; padding: 1.2rem 1.5rem; background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.1); border-radius: var(--r-sm); transition: all 0.3s; }
  .feature-row:hover { background: rgba(201,168,76,0.08); border-color: rgba(201,168,76,0.25); transform: translateX(6px); }
  .feature-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 2px; }
  .feature-title { font-size: 0.88rem; font-weight: 700; color: var(--white); margin-bottom: 3px; }
  .feature-text { font-size: 0.8rem; color: var(--mist); line-height: 1.6; }

  /* process */
  #process { background: var(--ink); padding: 110px 3rem; overflow: hidden; }
  .process-inner { max-width: 1200px; margin: 0 auto; }
  .process-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; margin-top: 4rem; position: relative; }
  .process-steps::before { content:''; position: absolute; top: 28px; left: 12.5%; right: 12.5%; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 20%, rgba(201,168,76,0.3) 80%, transparent); z-index: 0; }
  .process-step { text-align: center; padding: 0 1.5rem; position: relative; }
  .step-num { width: 56px; height: 56px; border-radius: 50%; background: var(--ink-3); border: 1.5px solid rgba(201,168,76,0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: var(--gold); position: relative; z-index: 1; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  .process-step:hover .step-num { background: var(--gold); color: var(--ink); transform: scale(1.15); box-shadow: 0 0 30px var(--gold-glow); border-color: var(--gold); }
  .step-title { font-size: 0.95rem; font-weight: 700; color: var(--white); margin-bottom: 0.5rem; }
  .step-text { font-size: 0.8rem; color: var(--mist); line-height: 1.65; }

  @media (max-width: 900px) {
    #home { padding: 120px 1.5rem 80px; }
    .hero-h1 { font-size: clamp(3rem, 14vw, 5rem); }
    .metrics-band { padding: 2rem 1rem; }
    .metric-item { padding: 1.2rem 1.5rem; }
    #services, #projects, #about, #process { padding: 80px 1.5rem; }
    .about-inner { grid-template-columns: 1fr; gap: 3rem; }
    .about-visual { max-height: 300px; }
    .projects-grid { grid-template-columns: 1fr; }
    .proj-card:nth-child(n) { grid-column: auto; grid-row: auto; min-height: 220px; }
    .process-steps { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .process-steps::before { display: none; }
  }
  @media (max-width: 600px) {
    .hero-btns { flex-direction: column; }
    .services-grid { grid-template-columns: 1fr; }
    .process-steps { grid-template-columns: 1fr; }
  }
`;

/* ════════════════════════════════════════
   CONTACT PAGE CSS
════════════════════════════════════════ */
const CONTACT_CSS = `
  .contact-page {
    min-height: 100svh;
    padding-top: 72px;
    background: var(--ink);
    position: relative;
    overflow: hidden;
  }

  /* Animated background */
  .contact-bg-lines {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
    background-size: 80px 80px;
  }
  .contact-bg-glow-1 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    top: -100px; right: -200px; pointer-events: none; z-index: 0;
    animation: floatA 8s ease-in-out infinite;
  }
  .contact-bg-glow-2 {
    position: absolute; width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    bottom: 100px; left: -100px; pointer-events: none; z-index: 0;
    animation: floatB 10s ease-in-out infinite;
  }
  @keyframes floatA { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px, 40px); } }
  @keyframes floatB { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px, -30px); } }

  /* Hero banner */
  .contact-hero {
    position: relative; z-index: 1;
    padding: 80px 3rem 60px;
    border-bottom: 1px solid rgba(201,168,76,0.1);
    display: flex; flex-direction: column; align-items: flex-start;
    max-width: 1200px; margin: 0 auto;
  }
  .contact-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 1.5rem;
    opacity: 0; animation: fadeUp 0.7s 0.1s forwards;
  }
  .contact-hero-eyebrow::before { content: ''; width: 28px; height: 1.5px; background: var(--gold); display: block; }
  .contact-hero-h {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 8vw, 7rem); line-height: 0.9; letter-spacing: 2px;
    color: var(--white); margin-bottom: 1.5rem;
    opacity: 0; animation: fadeUp 0.8s 0.2s forwards;
  }
  .contact-hero-h span { color: var(--gold); display: block; }
  .contact-hero-sub {
    font-size: 1rem; color: var(--mist); line-height: 1.7; max-width: 480px;
    opacity: 0; animation: fadeUp 0.8s 0.35s forwards;
  }

  /* Main grid */
  .contact-body {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1.7fr;
    gap: 4rem; padding: 5rem 3rem 6rem;
    align-items: start;
  }

  /* Left: info column */
  .contact-info { position: sticky; top: 100px; }
  .contact-info-section { margin-bottom: 3rem; }
  .contact-info-label {
    font-size: 0.62rem; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 8px;
  }
  .contact-info-label::before { content: ''; width: 20px; height: 1px; background: var(--gold); display: block; }
  .contact-info-cards { display: flex; flex-direction: column; gap: 0.75rem; }
  .c-card {
    display: flex; align-items: flex-start; gap: 1rem;
    padding: 1.2rem 1.5rem;
    background: var(--ink-3); border: 1px solid rgba(201,168,76,0.1);
    border-radius: var(--r-sm);
    transition: all 0.3s; cursor: default;
  }
  .c-card:hover { border-color: rgba(201,168,76,0.35); background: var(--ink-4); transform: translateX(5px); }
  .c-card-icon {
    width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
    background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.25);
    display: grid; place-items: center; font-size: 1rem;
    transition: all 0.3s;
  }
  .c-card:hover .c-card-icon { background: rgba(201,168,76,0.15); border-color: var(--gold); transform: scale(1.05); }
  .c-card-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--mist); margin-bottom: 3px; }
  .c-card-val { font-size: 0.9rem; color: var(--white); font-weight: 600; }

  /* Availability block */
  .availability-block {
    padding: 1.5rem; background: rgba(74,222,128,0.05);
    border: 1px solid rgba(74,222,128,0.2); border-radius: var(--r-sm);
    margin-top: 0.75rem;
  }
  .avail-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .avail-dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: blink 2s ease-in-out infinite; }
  .avail-title { font-size: 0.8rem; font-weight: 700; color: #4ade80; }
  .avail-text { font-size: 0.78rem; color: var(--mist); line-height: 1.6; }

  /* Right: form */
  .contact-form-wrap {
    background: var(--ink-2);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: var(--r);
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
    opacity: 0; animation: fadeUp 0.9s 0.3s forwards;
  }
  .form-header {
    padding: 2.5rem 3rem 2rem;
    background: var(--ink-3);
    border-bottom: 1px solid rgba(201,168,76,0.1);
    display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;
  }
  .form-header-left {}
  .form-header-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: 1px; color: var(--white); margin-bottom: 4px; }
  .form-header-sub { font-size: 0.82rem; color: var(--mist); }
  .form-response-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px; background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.2); border-radius: 40px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold);
    white-space: nowrap;
  }
  .form-body { padding: 2.5rem 3rem; }

  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
  .form-field { margin-bottom: 1.4rem; }
  .form-field label {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: var(--mist); margin-bottom: 8px;
  }
  .field-required { color: var(--gold); font-size: 0.7rem; }
  .form-field input, .form-field select, .form-field textarea {
    width: 100%; padding: 13px 16px;
    background: var(--ink-3); color: var(--white);
    border: 1.5px solid rgba(201,168,76,0.1);
    border-radius: var(--r-sm);
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: all 0.3s; resize: none;
  }
  .form-field input::placeholder, .form-field textarea::placeholder { color: var(--slate); }
  .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
    border-color: var(--gold); background: rgba(201,168,76,0.04);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
  }
  .form-field select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239090A8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; cursor: pointer; }
  .form-field select option { background: var(--ink-3); color: var(--white); }
  .form-field textarea { min-height: 120px; }

  /* File drop */
  .file-drop {
    width: 100%; padding: 1.5rem;
    background: var(--ink-3); border: 1.5px dashed rgba(201,168,76,0.2);
    border-radius: var(--r-sm); text-align: center; cursor: pointer;
    transition: all 0.3s;
  }
  .file-drop:hover { border-color: rgba(201,168,76,0.5); background: rgba(201,168,76,0.04); }
  .file-drop-icon { font-size: 1.5rem; margin-bottom: 6px; }
  .file-drop-text { font-size: 0.78rem; color: var(--mist); }
  .file-drop-text span { color: var(--gold); font-weight: 700; }

  /* Checkbox */
  .checkbox-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 1.8rem; }
  .checkbox-row input[type="checkbox"] { width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; accent-color: var(--gold); cursor: pointer; }
  .checkbox-row label { font-size: 0.8rem; color: var(--mist); line-height: 1.5; cursor: pointer; }
  .checkbox-row label a { color: var(--gold); text-decoration: none; }

  /* Submit */
  .form-footer { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
  .submit-btn {
    flex: 1; min-width: 200px; padding: 17px 36px;
    background: var(--gold); color: var(--ink);
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
    border: none; border-radius: var(--r-sm); cursor: pointer;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 4px 20px rgba(201,168,76,0.2);
    position: relative; overflow: hidden;
  }
  .submit-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transform: translateX(-100%); transition: transform 0.5s;
  }
  .submit-btn:hover::before { transform: translateX(100%); }
  .submit-btn:hover { background: var(--gold-lt); transform: translateY(-3px); box-shadow: 0 14px 40px rgba(201,168,76,0.35); }
  .submit-btn:active { transform: translateY(0) scale(0.98); }
  .submit-note { font-size: 0.72rem; color: var(--slate); line-height: 1.5; }

  /* Success */
  .success-banner {
    margin-bottom: 2rem; padding: 1.2rem 1.5rem;
    background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.3);
    border-radius: var(--r-sm); color: #4ade80; font-size: 0.88rem; font-weight: 600;
    display: flex; align-items: center; gap: 10px;
    animation: fadeIn 0.5s forwards;
  }

  /* Divider */
  .form-divider { height: 1px; background: rgba(201,168,76,0.08); margin: 1.5rem 0; }

  /* Map / office row */
  .offices-row {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 0 3rem 6rem;
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
  }
  .office-card {
    padding: 2rem; background: var(--ink-3);
    border: 1px solid rgba(201,168,76,0.08); border-radius: var(--r-sm);
    transition: all 0.3s; cursor: default; position: relative; overflow: hidden;
  }
  .office-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent); opacity: 0; transition: opacity 0.4s; }
  .office-card:hover { border-color: rgba(201,168,76,0.25); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
  .office-card:hover::before { opacity: 1; }
  .office-flag { font-size: 1.5rem; margin-bottom: 1rem; }
  .office-city { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: 1px; color: var(--white); margin-bottom: 4px; }
  .office-role { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; }
  .office-addr { font-size: 0.82rem; color: var(--mist); line-height: 1.7; }

  @media (max-width: 900px) {
    .contact-hero { padding: 60px 1.5rem 40px; }
    .contact-body { grid-template-columns: 1fr; gap: 3rem; padding: 3rem 1.5rem 4rem; }
    .contact-info { position: static; }
    .form-body, .form-header { padding: 1.8rem; }
    .form-grid-2 { grid-template-columns: 1fr; }
    .offices-row { grid-template-columns: 1fr; padding: 0 1.5rem 4rem; }
  }
`;

/* ════════════════════════════════════════
   CHATBOT CSS
════════════════════════════════════════ */
const CHATBOT_CSS = `
  /* ── Toggle Button ── */
  .chat-toggle {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 900;
    width: 60px; height: 60px; border-radius: 50%;
    background: var(--gold); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 32px rgba(201,168,76,0.45), 0 0 0 0 rgba(201,168,76,0.3);
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    animation: chatPulse 3s ease-in-out infinite;
  }
  @keyframes chatPulse {
    0%,100% { box-shadow: 0 8px 32px rgba(201,168,76,0.45), 0 0 0 0 rgba(201,168,76,0.3); }
    50% { box-shadow: 0 8px 32px rgba(201,168,76,0.45), 0 0 0 12px rgba(201,168,76,0); }
  }
  .chat-toggle:hover { transform: scale(1.1); background: var(--gold-lt); animation: none; box-shadow: 0 12px 40px rgba(201,168,76,0.6); }
  .chat-toggle svg { width: 26px; height: 26px; fill: var(--ink); transition: all 0.3s; }
  .chat-toggle.open svg { transform: rotate(90deg); }
  .chat-unread {
    position: absolute; top: -2px; right: -2px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #ef4444; color: #fff;
    font-size: 0.65rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--ink);
    animation: badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes badgePop { from { transform: scale(0); } to { transform: scale(1); } }

  /* ── Window ── */
  .chat-window {
    position: fixed; bottom: 6rem; right: 2rem; z-index: 899;
    width: 380px; max-height: 600px;
    background: var(--ink-2); border: 1px solid rgba(201,168,76,0.2);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08);
    display: flex; flex-direction: column;
    transform: scale(0.85) translateY(20px); transform-origin: bottom right;
    opacity: 0; pointer-events: none;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .chat-window.open {
    transform: scale(1) translateY(0);
    opacity: 1; pointer-events: all;
  }

  /* ── Header ── */
  .chat-header {
    padding: 1rem 1.2rem;
    background: var(--ink-3);
    border-bottom: 1px solid rgba(201,168,76,0.12);
    display: flex; align-items: center; gap: 0.75rem;
    flex-shrink: 0;
  }
  .chat-avatar {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--gold), var(--gold-lt));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    box-shadow: 0 0 16px rgba(201,168,76,0.35);
  }
  .chat-header-info { flex: 1; }
  .chat-header-name { font-size: 0.88rem; font-weight: 700; color: var(--white); }
  .chat-header-status { display: flex; align-items: center; gap: 5px; font-size: 0.68rem; color: var(--mist); margin-top: 1px; }
  .chat-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; animation: blink 2s ease-in-out infinite; }
  .chat-close-btn { background: none; border: none; cursor: pointer; color: var(--slate); font-size: 1.2rem; padding: 4px; line-height: 1; transition: color 0.2s; }
  .chat-close-btn:hover { color: var(--white); }

  /* ── Suggestion chips ── */
  .chat-suggestions {
    padding: 0.75rem 1rem 0;
    display: flex; flex-wrap: wrap; gap: 0.4rem;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(201,168,76,0.06);
  }
  .chat-chip {
    padding: 5px 11px;
    background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2);
    border-radius: 20px; font-size: 0.68rem; font-weight: 600; color: var(--gold);
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .chat-chip:hover { background: rgba(201,168,76,0.18); border-color: var(--gold); transform: translateY(-1px); }

  /* ── Messages ── */
  .chat-messages {
    flex: 1; overflow-y: auto; padding: 1rem;
    display: flex; flex-direction: column; gap: 0.75rem;
    scroll-behavior: smooth;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 4px; }

  .chat-msg { display: flex; gap: 8px; align-items: flex-end; animation: msgIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes msgIn { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: none; } }
  .chat-msg.user { flex-direction: row-reverse; }
  .msg-avatar { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; }
  .msg-avatar.bot { background: linear-gradient(135deg, var(--gold), var(--gold-lt)); }
  .msg-avatar.user { background: var(--ink-4); color: var(--mist); }
  .msg-bubble {
    max-width: 82%; padding: 0.65rem 0.9rem;
    border-radius: 12px; font-size: 0.83rem; line-height: 1.55; word-break: break-word;
  }
  .chat-msg.bot .msg-bubble { background: var(--ink-3); color: var(--fog); border-bottom-left-radius: 4px; border: 1px solid rgba(201,168,76,0.08); }
  .chat-msg.user .msg-bubble { background: var(--gold); color: var(--ink); font-weight: 600; border-bottom-right-radius: 4px; }
  .msg-bubble a { color: var(--gold); text-decoration: underline; }
  .chat-msg.bot .msg-bubble a { color: var(--gold-lt); }

  /* typing dots */
  .typing-bubble { padding: 0.7rem 1rem !important; }
  .typing-dots { display: flex; gap: 4px; align-items: center; }
  .typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); opacity: 0.4; animation: typingBounce 1.2s ease-in-out infinite; }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }

  /* lead capture card inside chat */
  .lead-card {
    background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.2);
    border-radius: 10px; padding: 0.9rem; margin-top: 0.5rem;
  }
  .lead-card-title { font-size: 0.78rem; font-weight: 700; color: var(--white); margin-bottom: 0.6rem; }
  .lead-input {
    width: 100%; padding: 8px 10px; margin-bottom: 0.5rem;
    background: var(--ink-2); color: var(--white);
    border: 1px solid rgba(201,168,76,0.2); border-radius: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; outline: none;
    transition: border-color 0.2s;
  }
  .lead-input:focus { border-color: var(--gold); }
  .lead-input::placeholder { color: var(--slate); }
  .lead-submit {
    width: 100%; padding: 8px; background: var(--gold); color: var(--ink);
    border: none; border-radius: 6px; font-size: 0.75rem; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
    transition: all 0.25s;
  }
  .lead-submit:hover { background: var(--gold-lt); transform: translateY(-1px); }

  /* ── Input bar ── */
  .chat-input-bar {
    padding: 0.75rem 1rem;
    border-top: 1px solid rgba(201,168,76,0.1);
    display: flex; gap: 0.5rem; align-items: flex-end;
    background: var(--ink-2); flex-shrink: 0;
  }
  .chat-input {
    flex: 1; padding: 10px 14px; max-height: 100px;
    background: var(--ink-3); color: var(--white);
    border: 1.5px solid rgba(201,168,76,0.12); border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    outline: none; resize: none; line-height: 1.4;
    transition: border-color 0.2s;
    overflow-y: auto;
  }
  .chat-input:focus { border-color: rgba(201,168,76,0.5); }
  .chat-input::placeholder { color: var(--slate); }
  .chat-send {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: var(--gold); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .chat-send:hover { background: var(--gold-lt); transform: scale(1.1); }
  .chat-send:disabled { background: var(--ink-4); cursor: not-allowed; transform: none; }
  .chat-send svg { width: 16px; height: 16px; fill: var(--ink); }

  .chat-footer-note { text-align: center; font-size: 0.6rem; color: var(--slate); padding: 0 1rem 0.6rem; flex-shrink: 0; }

  @media (max-width: 480px) {
    .chat-window { width: calc(100vw - 2rem); right: 1rem; bottom: 5.5rem; max-height: 70vh; }
    .chat-toggle { bottom: 1.5rem; right: 1rem; }
  }
`;

/* ════════════════════════════════════════
   PETRA AI CHATBOT COMPONENT
════════════════════════════════════════ */
const SYSTEM_PROMPT = `You are Petra, an expert AI project consultant for Petra Holdings — a premium construction and infrastructure company. You help potential clients understand what Petra Holdings can build for them, qualify their project needs, and guide them toward booking a consultation.

ABOUT PETRA HOLDINGS:
- Founded 2006, 150+ projects delivered, 25+ senior engineers, 100% safety compliance record
- Services: Commercial Infrastructure, Civil & Structural Engineering, Project Management, Sustainable Development (LEED), Fit-out & Interiors, Safety & Compliance (ISO 45001)
- Key projects: Vertex Logistics Hub, AeroSpace Head Office, Metro Transit Terminal, Harbour Quarter Development, Northgate Energy Plant
- Global offices: New York (HQ), London (European ops), Dubai (MENA)
- Contact: estimates@petraholdings.com | +1 (800) 555 PETRA
- Response time for RFPs: 48 business hours

YOUR JOB:
1. Understand the client's project (type, size, location, timeline, budget range)
2. Match their need to Petra's services confidently
3. Build trust by referencing relevant past projects
4. Qualify the lead: ask about timeline and budget range naturally in conversation
5. End every substantive conversation by offering to connect them with the estimating team or book a call

TONE: Professional but warm. Confident, not salesy. You know construction deeply. Use industry terms naturally (RFP, BIM, LEED, foundation engineering, critical path, etc.) but explain when needed.

LEAD CAPTURE: When a user seems genuinely interested (asking about specific projects, timelines, or budgets), naturally suggest: "I can have our estimating team reach out directly — want to leave your name and email?"

KEEP RESPONSES: Concise (2-4 sentences max per turn). No bullet lists unless the user asks for a breakdown. Conversational.

NEVER: Make up specific prices, guarantee timelines, or claim capabilities Petra doesn't have listed above.`;

function PetraChatbot({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi, I'm Petra — your AI project consultant. Tell me about what you're looking to build and I'll walk you through how we can help. 🏗️",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const [leadCapture, setLeadCapture] = useState(null); // null | 'asking' | 'done'
  const [leadData, setLeadData] = useState({ name: '', email: '' });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const SUGGESTIONS = [
    'What can you build?',
    'Do you work in Dubai?',
    'How long does a project take?',
    'Get me a quote',
  ];

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    // Check if we should trigger lead capture
    const triggerWords = ['quote', 'cost', 'price', 'budget', 'timeline', 'start', 'interested', 'project', 'build', 'contact'];
    const shouldCapture = triggerWords.some(w => userText.toLowerCase().includes(w)) && leadCapture === null && newMessages.length > 3;

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm having trouble connecting right now. Please email us at estimates@petraholdings.com.";

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      if (shouldCapture) {
        setTimeout(() => setLeadCapture('asking'), 800);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having a connection issue. You can reach our team directly at estimates@petraholdings.com or call +1 (800) 555 PETRA."
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const submitLead = () => {
    if (!leadData.name || !leadData.email) return;
    setLeadCapture('done');
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Perfect, thank you ${leadData.name.split(' ')[0]}! I've passed your details to our estimating team at estimates@petraholdings.com — expect a response within 48 hours. You can also submit a full RFP now if you'd like to give them more details.`,
    }]);
  };

  return (
    <>
      {/* Chat Window */}
      <div className={`chat-window ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-avatar">🏗️</div>
          <div className="chat-header-info">
            <div className="chat-header-name">Petra AI Consultant</div>
            <div className="chat-header-status">
              <div className="chat-status-dot"></div>
              Online now · Petra Holdings
            </div>
          </div>
          <button className="chat-close-btn" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Quick suggestion chips */}
        {messages.length <= 2 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="chat-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'bot'}`}>
              <div className={`msg-avatar ${m.role === 'user' ? 'user' : 'bot'}`}>
                {m.role === 'user' ? '👤' : '🏗️'}
              </div>
              <div className="msg-bubble" dangerouslySetInnerHTML={{
                __html: m.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br/>')
              }} />
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="chat-msg bot">
              <div className="msg-avatar bot">🏗️</div>
              <div className="msg-bubble typing-bubble">
                <div className="typing-dots"><span/><span/><span/></div>
              </div>
            </div>
          )}

          {/* Lead capture card */}
          {leadCapture === 'asking' && (
            <div className="chat-msg bot">
              <div className="msg-avatar bot">🏗️</div>
              <div className="msg-bubble" style={{ maxWidth: '100%', width: '100%' }}>
                <div className="lead-card">
                  <div className="lead-card-title">📋 Get a personalised response from our team</div>
                  <input className="lead-input" placeholder="Your name" value={leadData.name} onChange={e => setLeadData(p => ({...p, name: e.target.value}))} />
                  <input className="lead-input" placeholder="Your email" type="email" value={leadData.email} onChange={e => setLeadData(p => ({...p, email: e.target.value}))} />
                  <button className="lead-submit" onClick={submitLead}>Send to Estimating Team →</button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-bar">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask about your project…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button className="chat-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <div className="chat-footer-note">Powered by Claude AI · Petra Holdings © 2026</div>
      </div>

      {/* Toggle Button */}
      <button className={`chat-toggle ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        {unread > 0 && !open && <div className="chat-unread">{unread}</div>}
        {open ? (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
          </svg>
        )}
      </button>
    </>
  );
}

/* ════════════════════════════════════════
   SHARED FOOTER
════════════════════════════════════════ */
function Footer({ onNavigate }) {
  const navLinks = ['home', 'services', 'projects', 'about', 'process', 'contact'];
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name" onClick={() => onNavigate('home')}>PETRA <span>HOLDINGS</span></div>
            <p className="footer-tagline">Architectural & Structural Infrastructure Management since 2006.</p>
          </div>
          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-links">
              {navLinks.map(l => <li key={l}><span onClick={() => l === 'contact' ? onNavigate('contact') : onNavigate('home', l)}>{l.charAt(0).toUpperCase() + l.slice(1)}</span></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <ul className="footer-links">
              {['Commercial', 'Civil & Structural', 'Project Management', 'Sustainable Dev'].map(s => <li key={s}><span onClick={() => onNavigate('home', 'services')}>{s}</span></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:estimates@petraholdings.com">estimates@petraholdings.com</a></li>
              <li><a href="tel:+18005557387">+1 (800) 555 PETRA</a></li>
              <li><span onClick={() => onNavigate('contact')}>Open Contact Page →</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} Petra Holdings. All rights reserved.</div>
          <div className="footer-badge"><div className="badge-dot"></div>All systems operational</div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════
   SHARED NAV
════════════════════════════════════════ */
function Nav({ page, scrolled, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const mainLinks = ['home', 'services', 'projects', 'about', 'process'];

  const handleLink = (section) => {
    setMenuOpen(false);
    onNavigate('home', section);
  };

  return (
    <>
      <nav className={page === 'contact' ? 'solid' : scrolled ? 'scrolled' : ''}>
        <div className="nav-logo" onClick={() => onNavigate('home')}>PETRA <span>HOLDINGS</span></div>
        <ul className="nav-links">
          {mainLinks.map(l => (
            <li key={l}>
              <a href={`#${l}`} onClick={e => { e.preventDefault(); handleLink(l); }}>{l}</a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={e => { e.preventDefault(); setMenuOpen(false); onNavigate('contact'); }}
              className={`contact-link${page === 'contact' ? ' active' : ''}`}
            >
              contact
            </a>
          </li>
        </ul>
        <button
          className="nav-cta"
          onClick={() => { setMenuOpen(false); onNavigate('contact'); }}
        >
          Get a Quote
        </button>
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        {mainLinks.map(l => <a key={l} href={`#${l}`} onClick={e => { e.preventDefault(); handleLink(l); }}>{l}</a>)}
        <a href="#contact" onClick={e => { e.preventDefault(); setMenuOpen(false); onNavigate('contact'); }}>contact</a>
        <button className="btn-primary" onClick={() => { setMenuOpen(false); onNavigate('contact'); }}>Get a Quote</button>
      </div>
    </>
  );
}

/* ════════════════════════════════════════
   CONTACT PAGE
════════════════════════════════════════ */
function ContactPage() {
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', service: '', budget: '', message: '', agree: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', company: '', email: '', phone: '', service: '', budget: '', message: '', agree: false });
    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <div className="contact-page">
      <div className="contact-bg-lines"></div>
      <div className="contact-bg-glow-1"></div>
      <div className="contact-bg-glow-2"></div>

      {/* Hero */}
      <div className="contact-hero">
        <div className="contact-hero-eyebrow">Project Inquiries & RFP Submissions</div>
        <h1 className="contact-hero-h">
          Let's Build
          <span>Something</span>
        </h1>
        <p className="contact-hero-sub">
          Share your project brief and our estimating team will respond within 48 business hours with a tailored proposal.
        </p>
      </div>

      {/* Body */}
      <div className="contact-body">

        {/* Left: info */}
        <Reveal>
          <div className="contact-info">
            <div className="contact-info-section">
              <div className="contact-info-label">Get in Touch</div>
              <div className="contact-info-cards">
                {[
                  { icon: '🏢', label: 'Corporate Headquarters', val: 'Petra Holdings Tower, Level 8, Downtown District' },
                  { icon: '📧', label: 'Estimating & Tenders', val: 'estimates@petraholdings.com' },
                  { icon: '📞', label: 'Direct Line', val: '+1 (800) 555 PETRA' },
                  { icon: '⏰', label: 'Office Hours', val: 'Mon–Fri  ·  8:00 AM – 6:00 PM' },
                ].map((c, i) => (
                  <div className="c-card" key={i}>
                    <div className="c-card-icon">{c.icon}</div>
                    <div>
                      <div className="c-card-label">{c.label}</div>
                      <div className="c-card-val">{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-info-section">
              <div className="contact-info-label">Current Availability</div>
              <div className="availability-block">
                <div className="avail-top">
                  <div className="avail-dot"></div>
                  <div className="avail-title">Accepting New Projects</div>
                </div>
                <div className="avail-text">We are currently onboarding new civil and commercial projects for Q3–Q4 2026. Early submissions are encouraged for priority scheduling.</div>
              </div>
            </div>

            <div className="contact-info-section">
              <div className="contact-info-label">Emergency & Site Support</div>
              <div className="c-card">
                <div className="c-card-icon">🚨</div>
                <div>
                  <div className="c-card-label">24/7 Site Emergency</div>
                  <div className="c-card-val">+1 (800) 555 0911</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: form */}
        <div className="contact-form-wrap">
          <div className="form-header">
            <div className="form-header-left">
              <div className="form-header-title">Request for Proposal</div>
              <div className="form-header-sub">Fill in the details below to receive a tailored quote.</div>
            </div>
            <div className="form-response-badge">⚡ 48hr Response</div>
          </div>

          <div className="form-body">
            {submitted && (
              <div className="success-banner">
                ✓ Your RFP has been received. Our estimating team will be in touch within 48 hours.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name + Company */}
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Full Name <span className="field-required">*</span></label>
                  <input type="text" required placeholder="Jane Smith" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Company Name</label>
                  <input type="text" placeholder="Acme Corp" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Email Address <span className="field-required">*</span></label>
                  <input type="email" required placeholder="jane@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              {/* Service + Budget */}
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Service Required <span className="field-required">*</span></label>
                  <select required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                    <option value="" disabled>Select a service</option>
                    <option>Commercial Infrastructure</option>
                    <option>Civil & Structural Engineering</option>
                    <option>Project Management</option>
                    <option>Sustainable Development</option>
                    <option>Fit-out & Interiors</option>
                    <option>Safety & Compliance</option>
                    <option>Other / Multiple</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Estimated Budget</label>
                  <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}>
                    <option value="">Prefer not to say</option>
                    <option>Under $500K</option>
                    <option>$500K – $2M</option>
                    <option>$2M – $10M</option>
                    <option>$10M – $50M</option>
                    <option>$50M+</option>
                  </select>
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Project overview */}
              <div className="form-field">
                <label>Project Overview <span className="field-required">*</span></label>
                <textarea required placeholder="Describe the project scope, site location, key structural requirements, and timeline constraints. Include any specific certifications or compliance standards required…" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>

              {/* File drop (visual only) */}
              <div className="form-field">
                <label>Attach Documents</label>
                <div className="file-drop">
                  <div className="file-drop-icon">📎</div>
                  <div className="file-drop-text">Drag & drop tender docs, blueprints, or site surveys<br /><span>Browse files</span> · PDF, DWG, DXF, JPG up to 25MB</div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="checkbox-row">
                <input type="checkbox" id="agree" required checked={formData.agree} onChange={e => setFormData({...formData, agree: e.target.checked})} />
                <label htmlFor="agree">I agree that Petra Holdings may use the information provided to prepare and send a proposal. View our <a href="#">Privacy Policy</a>.</label>
              </div>

              {/* Submit */}
              <div className="form-footer">
                <button type="submit" className="submit-btn">Submit RFP →</button>
                <div className="submit-note">Secure submission · No spam · We respond within 48 hrs</div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Office cards */}
      <div className="offices-row">
        {[
          { flag: '🇺🇸', city: 'New York', role: 'HQ & Commercial', addr: 'Petra Holdings Tower, Level 8\n10 Hudson Yards, New York, NY 10001' },
          { flag: '🇬🇧', city: 'London', role: 'European Operations', addr: '22 Bishopsgate, 34th Floor\nLondon, EC2N 4BQ, United Kingdom' },
          { flag: '🇦🇪', city: 'Dubai', role: 'MENA Infrastructure', addr: 'DIFC Gate Building, Suite 412\nDubai International Financial Centre' },
        ].map((o, i) => (
          <Reveal key={i} delay={i + 1}>
            <div className="office-card">
              <div className="office-flag">{o.flag}</div>
              <div className="office-city">{o.city}</div>
              <div className="office-role">{o.role}</div>
              <div className="office-addr">{o.addr}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════ */
function HomePage({ onNavigate }) {
  const services = [
    { icon: '🏗️', title: 'Commercial Infrastructure', desc: 'Design-build delivery for corporate campuses, logistics hubs, and mixed-use developments — from feasibility to final handover.', num: '01' },
    { icon: '⚙️', title: 'Civil & Structural Engineering', desc: 'Precision foundation engineering, heavy-lift structural frames, and complex civil works certified to international safety codes.', num: '02' },
    { icon: '📐', title: 'Project Management', desc: 'Critical-path scheduling, cost control, multi-trade coordination, and live site dashboards — full visibility at every milestone.', num: '03' },
    { icon: '♻️', title: 'Sustainable Development', desc: 'LEED-aligned design integration, green procurement, and lifecycle carbon assessment embedded from day one.', num: '04' },
    { icon: '🔧', title: 'Fit-out & Interiors', desc: 'High-specification fit-out for corporate offices, data centers, and industrial facilities with M&E coordination.', num: '05' },
    { icon: '🛡️', title: 'Safety & Compliance', desc: 'ISO 45001 site management systems, regulatory permit handling, and independent QA audits for zero-incident delivery.', num: '06' },
  ];
  const projects = [
    { type: 'Industrial', title: 'Vertex Logistics Hub', year: '2024', bg: 'proj-bg-1' },
    { type: 'Corporate', title: 'AeroSpace Head Office', year: '2024', bg: 'proj-bg-2' },
    { type: 'Infrastructure', title: 'Metro Transit Terminal', year: '2023', bg: 'proj-bg-3' },
    { type: 'Mixed-Use', title: 'Harbour Quarter Development', year: '2023', bg: 'proj-bg-4' },
    { type: 'Industrial', title: 'Northgate Energy Plant', year: '2022', bg: 'proj-bg-5' },
  ];
  const process = [
    { n: '01', title: 'Discovery', text: 'Site survey, constraints analysis, stakeholder alignment, and feasibility reporting.' },
    { n: '02', title: 'Design & Engineering', text: 'Structural concept, planning submissions, value-engineering, and BIM modelling.' },
    { n: '03', title: 'Procurement', text: 'Tender management, subcontractor vetting, supply-chain logistics and material scheduling.' },
    { n: '04', title: 'Delivery & Handover', text: 'Site mobilisation, quality inspections, commissioning, and O&M documentation.' },
  ];

  return (
    <>
      <section id="home">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-inner">
          <div className="hero-tag">Solid Foundations. Timeless Structures.</div>
          <h1 className="hero-h1">Engineering<em>Excellence</em></h1>
          <p className="hero-sub">From complex industrial complexes to landmark commercial infrastructure — Petra Holdings delivers precision-engineered, sustainably built environments that endure.</p>
          <div className="hero-btns">
            <a href="#projects" className="btn-primary">Explore Portfolio</a>
            <button className="btn-ghost" onClick={() => onNavigate('contact')}>Get a Quote</button>
          </div>
        </div>
        <div className="hero-scroll"><div className="scroll-line"></div>Scroll</div>
      </section>

      <div className="metrics-band">
        {[
          { end: 150, suffix: '+', label: 'Projects Delivered' },
          { end: 18, suffix: ' yrs', label: 'Industry Experience' },
          { end: 100, suffix: '%', label: 'Safety Compliance' },
          { end: 25, suffix: '+', label: 'Senior Engineers' },
        ].map((m, i) => (
          <div className="metric-item" key={i}>
            <div className="metric-num"><CountUp end={m.end} suffix={m.suffix} /></div>
            <div className="metric-label">{m.label}</div>
          </div>
        ))}
      </div>

      <section id="services">
        <div className="services-inner">
          <div className="services-header">
            <Reveal>
              <div className="section-tag">Capabilities</div>
              <h2 className="section-h">Core Infrastructure<br />Services</h2>
              <div className="divider"></div>
              <p className="section-sub">End-to-end construction solutions built around your programme, budget, and quality benchmarks.</p>
            </Reveal>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div className="service-card" key={i}>
                <div className="service-num">{s.num}</div>
                <div className="service-icon">{s.icon}</div>
                <div className="service-title">{s.title}</div>
                <p className="service-desc">{s.desc}</p>
                <div className="service-arrow">Learn more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="projects-inner">
          <div className="projects-header">
            <Reveal>
              <div className="section-tag">Portfolio</div>
              <h2 className="section-h">Recent Landmarks</h2>
              <div className="divider"></div>
            </Reveal>
            <Reveal delay={2}>
              <button className="btn-ghost" style={{ fontSize: '0.72rem' }} onClick={() => onNavigate('contact')}>Start a Project →</button>
            </Reveal>
          </div>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div className="proj-card" key={i}>
                <div className={`proj-bg ${p.bg}`}></div>
                <div className="proj-pattern"></div>
                <div className="proj-overlay"></div>
                <div className="proj-content">
                  <div className="proj-type">{p.type}</div>
                  <div className="proj-title">{p.title}</div>
                  <div className="proj-year">{p.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about">
        <div className="about-inner">
          <Reveal>
            <div className="about-visual">
              <div className="about-visual-inner"><div className="big-icon">🏛️</div></div>
              <div className="about-accent"></div>
              <div className="about-accent-2"></div>
              <div className="about-visual-badge">Est. 2006 · Petra Holdings</div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <div className="section-tag">Corporate Overview</div>
              <h2 className="section-h">Uncompromising Standards.<br />Transparent Execution.</h2>
              <div className="divider"></div>
              <p className="section-sub">At Petra Holdings, we bridge engineered reality with architectural vision. Every project is guided by our commitment to site safety, sustainable material lifecycles, and predictive budget control.</p>
            </Reveal>
            <div className="about-features">
              {[
                { icon: '🔩', title: 'Structural Integrity', text: 'Every foundation is engineered to exceed code — rigorous geotechnical survey, peer-reviewed design.' },
                { icon: '📊', title: 'Budget Transparency', text: 'Live cost dashboards and monthly earned-value reports keep stakeholders fully informed.' },
                { icon: '🌿', title: 'Sustainable Practices', text: 'Circular material procurement and low-carbon construction methods as standard.' },
              ].map((f, i) => (
                <Reveal key={i} delay={i + 1}>
                  <div className="feature-row">
                    <div className="feature-icon">{f.icon}</div>
                    <div>
                      <div className="feature-title">{f.title}</div>
                      <div className="feature-text">{f.text}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="process">
        <div className="process-inner">
          <Reveal>
            <div className="section-tag">Methodology</div>
            <h2 className="section-h">How We Deliver</h2>
            <div className="divider"></div>
            <p className="section-sub">A repeatable four-phase framework refined across 150+ projects to minimise risk and maximise certainty.</p>
          </Reveal>
          <div className="process-steps">
            {process.map((s, i) => (
              <Reveal key={i} delay={i + 1}>
                <div className="process-step">
                  <div className="step-num">{s.n}</div>
                  <div className="step-title">{s.title}</div>
                  <p className="step-text">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div style={{ background: 'var(--ink-3)', borderTop: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <Reveal>
          <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Ready to Build?</div>
            <h2 className="section-h" style={{ textAlign: 'center' }}>Start Your Project Today</h2>
            <p style={{ color: 'var(--mist)', marginBottom: '2.5rem', lineHeight: 1.7 }}>Submit a Request for Proposal and our estimating team will craft a detailed response within 48 hours.</p>
            <button className="btn-primary" onClick={() => onNavigate('contact')}>Open Contact Page →</button>
          </div>
        </Reveal>
      </div>
    </>
  );
}

/* ════════════════════════════════════════
   ROOT APP
════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  const navigate = (dest, anchor) => {
    setPage(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (anchor && dest === 'home') {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) { cursorRef.current.style.left = e.clientX + 'px'; cursorRef.current.style.top = e.clientY + 'px'; }
      if (ringRef.current) { setTimeout(() => { if (ringRef.current) { ringRef.current.style.left = e.clientX + 'px'; ringRef.current.style.top = e.clientY + 'px'; } }, 80); }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <style>{BASE_CSS + HOME_CSS + CONTACT_CSS + CHATBOT_CSS}</style>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>

      <Nav page={page} scrolled={scrolled} onNavigate={navigate} />

      <main style={{ paddingTop: page === 'contact' ? '0' : '0' }}>
        {page === 'home' ? <HomePage onNavigate={navigate} /> : <ContactPage />}
      </main>

      <Footer onNavigate={navigate} />
      <PetraChatbot onNavigate={navigate} />
    </>
  );
}
