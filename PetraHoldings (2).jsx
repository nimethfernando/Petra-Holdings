import { useState, useEffect, useRef } from "react";
import ContactPage from './Contact';

/* ── Intersection Observer ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function CountUp({ end, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const step = end / (duration / 16);
    const t = setInterval(() => {
      s += step;
      if (s >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [inView, end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView(0.08);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : "translateY(36px)",
      transition: `opacity 0.8s ${delay * 0.12}s cubic-bezier(0.16,1,0.3,1), transform 0.8s ${delay * 0.12}s cubic-bezier(0.16,1,0.3,1)`
    }}>
      {children}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

html, body, #root {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  overflow-x: hidden !important;
  background: #0A0A0B !important;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold: #C9A84C; --gold-lt: #e8c96a; --gold-glow: rgba(201,168,76,0.22);
  --ink: #0A0A0B; --ink-2: #111115; --ink-3: #1A1A22; --ink-4: #242432;
  --slate: #5A5A72; --mist: #9090A8; --fog: #C8C8D8; --white: #FAFAF8;
  font-family: 'DM Sans', sans-serif;
}

/* NAV */
.ph-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 5vw; height: 72px;
  transition: background 0.4s, border-color 0.4s, height 0.4s, box-shadow 0.4s;
  border-bottom: 1px solid transparent;
  width: 100%;
}
.ph-nav.scrolled {
  background: rgba(10,10,11,0.94); backdrop-filter: blur(20px);
  border-bottom-color: rgba(201,168,76,0.14); height: 60px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.55);
}
.ph-nav.solid {
  background: rgba(10,10,11,0.97); backdrop-filter: blur(20px);
  border-bottom-color: rgba(201,168,76,0.12); height: 64px;
}
.nav-logo { font-family:'Bebas Neue',sans-serif; font-size:1.75rem; letter-spacing:2px; color:var(--white); cursor:pointer; user-select:none; }
.nav-logo span { color:var(--gold); }
.nav-links { display:flex; gap:2.5rem; list-style:none; }
.nav-links a { font-size:0.7rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--mist); text-decoration:none; position:relative; padding-bottom:4px; transition:color 0.3s; }
.nav-links a::after { content:''; position:absolute; left:0; bottom:0; width:100%; height:1.5px; background:var(--gold); transform:scaleX(0); transform-origin:right; transition:transform 0.35s cubic-bezier(0.77,0,0.18,1); }
.nav-links a:hover { color:var(--white); }
.nav-links a:hover::after { transform:scaleX(1); transform-origin:left; }
.nav-cta { font-size:0.7rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--ink); background:var(--gold); padding:10px 24px; border-radius:3px; border:none; cursor:pointer; transition:all 0.3s; }
.nav-cta:hover { background:var(--gold-lt); box-shadow:0 0 24px var(--gold-glow); transform:translateY(-2px); }
.nav-cta.back { background:var(--ink-3); color:var(--gold); border:1.5px solid rgba(201,168,76,0.35); }

.hamburger { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; }
.hamburger span { width:26px; height:2px; background:var(--white); border-radius:2px; transition:all 0.3s; }
.hamburger.open span:nth-child(1) { transform:rotate(45deg) translate(5px,5px); }
.hamburger.open span:nth-child(2) { opacity:0; }
.hamburger.open span:nth-child(3) { transform:rotate(-45deg) translate(5px,-5px); }
.mobile-drawer { position:fixed; inset:0; z-index:999; background:rgba(10,10,11,0.97); backdrop-filter:blur(20px); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem; opacity:0; pointer-events:none; transform:translateX(100%); transition:all 0.45s cubic-bezier(0.77,0,0.18,1); }
.mobile-drawer.open { opacity:1; pointer-events:all; transform:translateX(0); }
.mobile-drawer a { font-family:'Bebas Neue',sans-serif; font-size:3rem; letter-spacing:4px; color:var(--white); text-decoration:none; transition:color 0.3s; }
.mobile-drawer a:hover { color:var(--gold); }

/* HERO — full bleed two-column */
.ph-hero {
  width: 100%; min-height: 100vh;
  display: grid; grid-template-columns: 1fr 1fr;
  align-items: center; gap: 0;
  padding: 100px 5vw 80px;
  position: relative; overflow: hidden;
  background: var(--ink);
}
.hero-grid { position:absolute; inset:0; background-size:60px 60px; background-image:linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px); animation:gridPan 20s linear infinite; }
@keyframes gridPan { from{background-position:0 0} to{background-position:60px 60px} }
.hero-glow { position:absolute; width:900px; height:900px; border-radius:50%; background:radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 65%); top:50%; left:30%; transform:translate(-50%,-55%); animation:gPulse 6s ease-in-out infinite; pointer-events:none; }
@keyframes gPulse { 0%,100%{transform:translate(-50%,-55%) scale(1)} 50%{transform:translate(-50%,-55%) scale(1.1)} }

.hero-left { position:relative; z-index:2; padding-right: 3rem; }
.hero-tag { display:inline-flex; align-items:center; gap:10px; font-size:0.68rem; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:2rem; opacity:0; animation:fadeUp 0.8s 0.2s forwards; }
.hero-tag::before { content:''; display:block; width:28px; height:1.5px; background:var(--gold); }
.hero-h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(4rem,8vw,9rem); line-height:0.9; letter-spacing:2px; color:var(--white); margin-bottom:1.8rem; opacity:0; animation:fadeUp 0.9s 0.35s forwards; }
.hero-h1 em { font-style:normal; color:var(--gold); display:block; }
.hero-sub { font-size:1rem; line-height:1.75; color:var(--mist); max-width:480px; margin-bottom:2.8rem; opacity:0; animation:fadeUp 0.9s 0.5s forwards; }
.hero-btns { display:flex; flex-wrap:wrap; gap:1rem; opacity:0; animation:fadeUp 0.9s 0.65s forwards; }

/* RIGHT: stat cards grid */
.hero-right { position:relative; z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:1rem; opacity:0; animation:fadeUp 1s 0.55s forwards; }
.stat-card { background:var(--ink-3); border:1px solid rgba(201,168,76,0.12); border-radius:14px; padding:2rem 1.8rem; position:relative; overflow:hidden; transition:border-color 0.3s, transform 0.35s; }
.stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--gold),transparent); opacity:0; transition:opacity 0.3s; }
.stat-card:hover { border-color:rgba(201,168,76,0.35); transform:translateY(-5px); }
.stat-card:hover::before { opacity:1; }
.stat-card.span2 { grid-column:1/3; }
.stat-num { font-family:'Bebas Neue',sans-serif; font-size:3rem; line-height:1; background:linear-gradient(135deg,var(--gold-lt),var(--gold)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.stat-label { font-size:0.62rem; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--slate); margin-top:5px; }
.stat-desc { font-size:0.78rem; color:var(--mist); margin-top:8px; line-height:1.55; }
.stat-row { display:flex; align-items:center; gap:2.5rem; }
.stat-div { width:1px; height:55px; background:rgba(201,168,76,0.15); flex-shrink:0; }

.hero-scroll { position:absolute; bottom:2.5rem; left:5vw; display:flex; align-items:center; gap:12px; opacity:0; animation:fadeIn 1s 1.3s forwards; font-size:0.62rem; letter-spacing:3px; text-transform:uppercase; color:var(--slate); }
.scroll-line { width:50px; height:1.5px; background:linear-gradient(to right,var(--gold),transparent); animation:sPulse 2s ease-in-out infinite; }
@keyframes sPulse { 0%,100%{transform:scaleX(1);opacity:1} 50%{transform:scaleX(0.6);opacity:0.4} }

/* BUTTONS */
.btn-p { display:inline-block; padding:14px 34px; background:var(--gold); color:var(--ink); font-size:0.74rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; text-decoration:none; border-radius:3px; border:none; cursor:pointer; transition:all 0.35s; }
.btn-p:hover { background:var(--gold-lt); transform:translateY(-3px); box-shadow:0 12px 40px var(--gold-glow); }
.btn-g { display:inline-block; padding:13px 34px; border:1.5px solid rgba(201,168,76,0.35); color:var(--fog); font-size:0.74rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; text-decoration:none; border-radius:3px; background:transparent; cursor:pointer; transition:all 0.3s; }
.btn-g:hover { border-color:var(--gold); color:var(--gold); background:var(--gold-glow); transform:translateY(-3px); }

/* SECTION COMMONS */
.stag { font-size:0.67rem; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--gold); display:flex; align-items:center; gap:10px; margin-bottom:0.9rem; }
.stag::before { content:''; width:28px; height:1.5px; background:var(--gold); display:block; }
.sh { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.4rem,4vw,3.8rem); line-height:1; color:var(--white); margin-bottom:1.4rem; letter-spacing:1.5px; }
.ssub { color:var(--mist); font-size:0.98rem; line-height:1.72; max-width:560px; }
.sdiv { width:38px; height:2px; background:var(--gold); margin:1.4rem 0; transition:width 0.4s; }

/* SERVICES */
.ph-services { width:100%; background:var(--ink-2); padding:100px 5vw; }
.srv-header { margin-bottom:4.5rem; }
.srv-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5px; background:rgba(201,168,76,0.08); border-radius:14px; overflow:hidden; }
.srv-card { background:var(--ink-2); padding:2.8rem 2.5rem; position:relative; overflow:hidden; transition:background 0.4s; cursor:default; }
.srv-card:hover { background:var(--ink-3); }
.srv-n { font-family:'Bebas Neue',sans-serif; font-size:5rem; color:rgba(201,168,76,0.07); position:absolute; top:1.2rem; right:1.8rem; transition:color 0.4s; letter-spacing:2px; line-height:1; }
.srv-card:hover .srv-n { color:rgba(201,168,76,0.18); }
.srv-ico { width:48px; height:48px; margin-bottom:1.4rem; background:var(--gold-glow); border:1px solid rgba(201,168,76,0.28); border-radius:10px; display:grid; place-items:center; font-size:1.4rem; transition:all 0.4s; }
.srv-card:hover .srv-ico { transform:scale(1.1) rotate(-5deg); border-color:var(--gold); }
.srv-title { font-size:1.15rem; font-weight:700; color:var(--white); margin-bottom:0.7rem; }
.srv-desc { font-size:0.86rem; color:var(--mist); line-height:1.72; }
.srv-arr { display:inline-flex; align-items:center; gap:6px; margin-top:1.4rem; font-size:0.7rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--gold); opacity:0; transform:translateX(-8px); transition:all 0.3s; }
.srv-card:hover .srv-arr { opacity:1; transform:translateX(0); }

/* PROJECTS */
.ph-projects { width:100%; background:var(--ink); padding:100px 5vw; }
.prj-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:3rem; flex-wrap:wrap; gap:1rem; }
.prj-grid { display:grid; grid-template-columns:repeat(12,1fr); gap:1rem; }
.prj-card { position:relative; overflow:hidden; border-radius:8px; background:var(--ink-3); cursor:pointer; border:1px solid rgba(201,168,76,0.08); transition:border-color 0.3s, transform 0.4s, box-shadow 0.4s; }
.prj-card:hover { border-color:rgba(201,168,76,0.35); transform:translateY(-6px); box-shadow:0 24px 60px rgba(0,0,0,0.5),0 0 40px rgba(201,168,76,0.06); }
.prj-card:nth-child(1) { grid-column:1/8; min-height:380px; }
.prj-card:nth-child(2) { grid-column:8/13; }
.prj-card:nth-child(3) { grid-column:1/5; min-height:260px; }
.prj-card:nth-child(4) { grid-column:5/9; }
.prj-card:nth-child(5) { grid-column:9/13; }
.prj-bg { position:absolute; inset:0; background-size:cover; background-position:center; transition:transform 0.6s, filter 0.4s; filter:brightness(0.4) saturate(0.7); }
.prj-card:hover .prj-bg { transform:scale(1.06); filter:brightness(0.5) saturate(0.8); }
.bg1{background:linear-gradient(135deg,#1a1f2e,#2a3a4a);} .bg2{background:linear-gradient(135deg,#1e1a2a,#2e2a3e);} .bg3{background:linear-gradient(135deg,#0e1a1a,#1a2e2e);} .bg4{background:linear-gradient(135deg,#1a1412,#2e2218);} .bg5{background:linear-gradient(135deg,#121820,#1e2c38);}
.prj-pat { position:absolute; inset:0; opacity:0.12; background-image:repeating-linear-gradient(0deg,rgba(201,168,76,0.4) 0,rgba(201,168,76,0.4) 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,rgba(201,168,76,0.4) 0,rgba(201,168,76,0.4) 1px,transparent 0,transparent 40px); transition:opacity 0.4s; }
.prj-card:hover .prj-pat { opacity:0.2; }
.prj-ov { position:absolute; inset:0; background:linear-gradient(to top,rgba(10,10,11,0.95) 0%,rgba(10,10,11,0.3) 60%,transparent 100%); z-index:1; }
.prj-cnt { position:absolute; bottom:0; left:0; right:0; padding:2rem; z-index:2; transform:translateY(6px); transition:transform 0.35s; }
.prj-card:hover .prj-cnt { transform:translateY(0); }
.prj-type { font-size:0.6rem; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); margin-bottom:5px; }
.prj-title { font-size:1.15rem; font-weight:700; color:var(--white); line-height:1.3; }
.prj-year { font-size:0.72rem; color:var(--mist); margin-top:4px; font-family:'DM Mono',monospace; }

/* ABOUT */
.ph-about { width:100%; background:var(--ink-2); padding:100px 5vw; }
.abt-inner { display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:center; }
.abt-vis { position:relative; aspect-ratio:4/5; border-radius:14px; overflow:hidden; background:var(--ink-3); border:1px solid rgba(201,168,76,0.12); }
.abt-vis-in { position:absolute; inset:0; background:linear-gradient(135deg,var(--ink-4),var(--ink-2)); display:flex; align-items:center; justify-content:center; }
.abt-badge { position:absolute; bottom:2rem; left:50%; transform:translateX(-50%); background:var(--gold); color:var(--ink); padding:12px 28px; border-radius:40px; font-size:0.7rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; white-space:nowrap; box-shadow:0 8px 30px rgba(201,168,76,0.35); }
.abt-acc1 { position:absolute; top:2rem; right:-1.5rem; width:120px; height:120px; border:2px solid rgba(201,168,76,0.18); border-radius:50%; pointer-events:none; }
.abt-acc2 { position:absolute; bottom:3rem; left:-2rem; width:80px; height:80px; border:1.5px solid rgba(201,168,76,0.1); border-radius:50%; pointer-events:none; }
.big-ico { font-size:6rem; opacity:0.07; user-select:none; }
.feat-list { display:flex; flex-direction:column; gap:1.3rem; margin-top:2.5rem; }
.feat-row { display:flex; align-items:flex-start; gap:1.2rem; padding:1.2rem 1.5rem; background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:8px; transition:all 0.3s; }
.feat-row:hover { background:rgba(201,168,76,0.08); border-color:rgba(201,168,76,0.25); transform:translateX(6px); }
.feat-ico { font-size:1.2rem; flex-shrink:0; margin-top:2px; }
.feat-t { font-size:0.86rem; font-weight:700; color:var(--white); margin-bottom:3px; }
.feat-d { font-size:0.78rem; color:var(--mist); line-height:1.6; }

/* PROCESS */
.ph-process { width:100%; background:var(--ink); padding:100px 5vw; overflow:hidden; }
.proc-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:0; margin-top:4rem; position:relative; }
.proc-steps::before { content:''; position:absolute; top:28px; left:12.5%; right:12.5%; height:1px; background:linear-gradient(90deg,transparent,rgba(201,168,76,0.3) 20%,rgba(201,168,76,0.3) 80%,transparent); z-index:0; }
.proc-step { text-align:center; padding:0 1.5rem; }
.step-n { width:56px; height:56px; border-radius:50%; background:var(--ink-3); border:1.5px solid rgba(201,168,76,0.3); display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; font-family:'Bebas Neue',sans-serif; font-size:1.4rem; color:var(--gold); position:relative; z-index:1; transition:all 0.4s; }
.proc-step:hover .step-n { background:var(--gold); color:var(--ink); transform:scale(1.15); box-shadow:0 0 30px var(--gold-glow); border-color:var(--gold); }
.step-t { font-size:0.93rem; font-weight:700; color:var(--white); margin-bottom:0.5rem; }
.step-d { font-size:0.78rem; color:var(--mist); line-height:1.65; }

/* CTA BAND */
.ph-cta { width:100%; background:var(--ink-3); border-top:1px solid rgba(201,168,76,0.1); border-bottom:1px solid rgba(201,168,76,0.1); padding:5rem 5vw; text-align:center; position:relative; overflow:hidden; }
.ph-cta::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 50%,rgba(201,168,76,0.05) 0%,transparent 70%); pointer-events:none; }

/* FOOTER */
.ph-footer { width:100%; background:var(--ink); border-top:1px solid rgba(201,168,76,0.1); padding:4rem 5vw 2rem; }
.ft-top { display:flex; justify-content:space-between; flex-wrap:wrap; gap:3rem; padding-bottom:3rem; border-bottom:1px solid rgba(201,168,76,0.08); }
.ft-brand { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:2px; color:var(--white); margin-bottom:0.5rem; cursor:pointer; }
.ft-brand span { color:var(--gold); }
.ft-tag { font-size:0.78rem; color:var(--mist); line-height:1.6; max-width:220px; }
.ft-ct { font-size:0.63rem; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); margin-bottom:1.1rem; }
.ft-links { list-style:none; display:flex; flex-direction:column; gap:0.55rem; }
.ft-links a, .ft-links span { font-size:0.83rem; color:var(--mist); text-decoration:none; transition:color 0.3s; cursor:pointer; }
.ft-links a:hover, .ft-links span:hover { color:var(--white); }
.ft-bot { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; padding-top:2rem; }
.ft-copy { font-size:0.73rem; color:var(--slate); font-family:'DM Mono',monospace; }
.ft-badge { display:flex; align-items:center; gap:8px; font-size:0.68rem; color:var(--slate); }
.badge-dot { width:6px; height:6px; background:#4ade80; border-radius:50%; animation:blink 2s ease-in-out infinite; }

@keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* RESPONSIVE */
@media (max-width:1024px) {
  .ph-hero { grid-template-columns:1fr; padding:110px 5vw 80px; }
  .hero-left { padding-right:0; }
  .hero-right { margin-top:3rem; }
  .srv-grid { grid-template-columns:repeat(2,1fr); }
  .abt-inner { grid-template-columns:1fr; gap:3rem; }
  .proc-steps { grid-template-columns:1fr 1fr; gap:2.5rem; }
  .proc-steps::before { display:none; }
}
@media (max-width:768px) {
  .ph-nav .nav-links, .ph-nav .nav-cta { display:none; }
  .hamburger { display:flex; }
  .srv-grid { grid-template-columns:1fr; }
  .prj-grid { grid-template-columns:1fr; }
  .prj-card:nth-child(n) { grid-column:auto; min-height:220px; }
  .proc-steps { grid-template-columns:1fr; }
  .hero-right { grid-template-columns:1fr 1fr; }
  .stat-card.span2 .stat-row { flex-wrap:wrap; gap:1.5rem; }
}
`;

const services = [
  { ico: "🏗️", title: "Commercial Infrastructure", desc: "Design-build delivery for corporate campuses, logistics hubs, and mixed-use developments — from feasibility to final handover.", n: "01" },
  { ico: "⚙️", title: "Civil & Structural Engineering", desc: "Precision foundation engineering, heavy-lift structural frames, and complex civil works certified to international safety codes.", n: "02" },
  { ico: "📐", title: "Project Management", desc: "Critical-path scheduling, cost control, multi-trade coordination, and live site dashboards — full visibility at every milestone.", n: "03" },
  { ico: "♻️", title: "Sustainable Development", desc: "LEED-aligned design integration, green procurement, and lifecycle carbon assessment embedded from day one.", n: "04" },
  { ico: "🔧", title: "Fit-out & Interiors", desc: "High-specification fit-out for corporate offices, data centers, and industrial facilities with M&E coordination.", n: "05" },
  { ico: "🛡️", title: "Safety & Compliance", desc: "ISO 45001 site management systems, regulatory permit handling, and independent QA audits for zero-incident delivery.", n: "06" },
];

const projects = [
  { type: "Industrial", title: "Vertex Logistics Hub", year: "2024", bg: "bg1" },
  { type: "Corporate", title: "AeroSpace Head Office", year: "2024", bg: "bg2" },
  { type: "Infrastructure", title: "Metro Transit Terminal", year: "2023", bg: "bg3" },
  { type: "Mixed-Use", title: "Harbour Quarter Development", year: "2023", bg: "bg4" },
  { type: "Industrial", title: "Northgate Energy Plant", year: "2022", bg: "bg5" },
];

const process = [
  { n: "01", t: "Discovery", d: "Site survey, constraints analysis, stakeholder alignment, and feasibility reporting." },
  { n: "02", t: "Design & Engineering", d: "Structural concept, planning submissions, value-engineering, and BIM modelling." },
  { n: "03", t: "Procurement", d: "Tender management, subcontractor vetting, supply-chain logistics and material scheduling." },
  { n: "04", t: "Delivery & Handover", d: "Site mobilisation, quality inspections, commissioning, and O&M documentation." },
];

export default function PetraHoldings() {
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (dest, anchor) => {
    setPage(dest);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (anchor && dest === "home") {
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  };

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className={`ph-nav ${page === "contact" ? "solid" : scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => go("home")}>PETRA <span>HOLDINGS</span></div>
        <ul className="nav-links">
          {["home","services","projects","about","process"].map(l => (
            <li key={l}><a href={`#${l}`} onClick={e => { e.preventDefault(); go("home", l); }}>{l}</a></li>
          ))}
        </ul>
        <button className={`nav-cta ${page === "contact" ? "back" : ""}`}
          onClick={() => go(page === "contact" ? "home" : "contact")}>
          {page === "contact" ? "← Back" : "Get a Quote"}
        </button>
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span/><span/><span/>
        </button>
      </nav>

      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        {["home","services","projects","about","process"].map(l => (
          <a key={l} href={`#${l}`} onClick={e => { e.preventDefault(); go("home", l); }}>{l}</a>
        ))}
        <button className="btn-p" onClick={() => go("contact")}>Get a Quote</button>
      </div>

      {page === "home" && (
        <>
          {/* HERO */}
          <section id="home" className="ph-hero">
            <div className="hero-grid" />
            <div className="hero-glow" />

            <div className="hero-left">
              <div className="hero-tag">Solid Foundations. Timeless Structures.</div>
              <h1 className="hero-h1">Engineering<em>Excellence</em></h1>
              <p className="hero-sub">From complex industrial complexes to landmark commercial infrastructure — Petra Holdings delivers precision-engineered, sustainably built environments that endure.</p>
              <div className="hero-btns">
                <a href="#projects" className="btn-p" onClick={e => { e.preventDefault(); go("home","projects"); }}>Explore Portfolio</a>
                <button className="btn-g" onClick={() => go("contact")}>Get a Quote</button>
              </div>
            </div>

            <div className="hero-right">
              <div className="stat-card">
                <div className="stat-num"><CountUp end={150} suffix="+" /></div>
                <div className="stat-label">Projects Delivered</div>
                <div className="stat-desc">Across industrial, commercial &amp; civil sectors</div>
              </div>
              <div className="stat-card">
                <div className="stat-num"><CountUp end={18} suffix="yr" /></div>
                <div className="stat-label">Industry Experience</div>
                <div className="stat-desc">Established 2006, operating internationally</div>
              </div>
              <div className="stat-card span2">
                <div className="stat-row">
                  <div>
                    <div className="stat-num"><CountUp end={100} suffix="%" /></div>
                    <div className="stat-label">Safety Compliance</div>
                  </div>
                  <div className="stat-div" />
                  <div>
                    <div className="stat-num"><CountUp end={25} suffix="+" /></div>
                    <div className="stat-label">Senior Engineers</div>
                  </div>
                  <div className="stat-div" />
                  <div style={{ flex: 1 }}>
                    <div className="stat-desc">ISO 45001 certified · zero lost-time incidents across all active sites</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-scroll"><div className="scroll-line" />Scroll</div>
          </section>

          {/* SERVICES */}
          <section id="services" className="ph-services">
            <div className="srv-header">
              <Reveal>
                <div className="stag">Capabilities</div>
                <h2 className="sh">Core Infrastructure Services</h2>
                <div className="sdiv" />
                <p className="ssub">End-to-end construction solutions built around your programme, budget, and quality benchmarks.</p>
              </Reveal>
            </div>
            <div className="srv-grid">
              {services.map((s, i) => (
                <Reveal key={i} delay={i}>
                  <div className="srv-card">
                    <div className="srv-n">{s.n}</div>
                    <div className="srv-ico">{s.ico}</div>
                    <div className="srv-title">{s.title}</div>
                    <p className="srv-desc">{s.desc}</p>
                    <div className="srv-arr">Learn more →</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* PROJECTS */}
          <section id="projects" className="ph-projects">
            <div className="prj-header">
              <Reveal>
                <div className="stag">Portfolio</div>
                <h2 className="sh">Recent Landmarks</h2>
                <div className="sdiv" />
              </Reveal>
              <Reveal delay={2}>
                <button className="btn-g" style={{ fontSize: "0.72rem" }} onClick={() => go("contact")}>Start a Project →</button>
              </Reveal>
            </div>
            <div className="prj-grid">
              {projects.map((p, i) => (
                <div className="prj-card" key={i}>
                  <div className={`prj-bg ${p.bg}`} />
                  <div className="prj-pat" />
                  <div className="prj-ov" />
                  <div className="prj-cnt">
                    <div className="prj-type">{p.type}</div>
                    <div className="prj-title">{p.title}</div>
                    <div className="prj-year">{p.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="ph-about">
            <div className="abt-inner">
              <Reveal>
                <div className="abt-vis">
                  <div className="abt-vis-in"><div className="big-ico">🏛️</div></div>
                  <div className="abt-acc1" /><div className="abt-acc2" />
                  <div className="abt-badge">Est. 2006 · Petra Holdings</div>
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <div className="stag">Corporate Overview</div>
                  <h2 className="sh">Uncompromising Standards.<br />Transparent Execution.</h2>
                  <div className="sdiv" />
                  <p className="ssub">At Petra Holdings, we bridge engineered reality with architectural vision. Every project is guided by our commitment to site safety, sustainable material lifecycles, and predictive budget control.</p>
                </Reveal>
                <div className="feat-list">
                  {[
                    { ico: "🔩", t: "Structural Integrity", d: "Every foundation is engineered to exceed code — rigorous geotechnical survey, peer-reviewed design." },
                    { ico: "📊", t: "Budget Transparency", d: "Live cost dashboards and monthly earned-value reports keep stakeholders fully informed." },
                    { ico: "🌿", t: "Sustainable Practices", d: "Circular material procurement and low-carbon construction methods as standard." },
                  ].map((f, i) => (
                    <Reveal key={i} delay={i + 1}>
                      <div className="feat-row">
                        <div className="feat-ico">{f.ico}</div>
                        <div><div className="feat-t">{f.t}</div><div className="feat-d">{f.d}</div></div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* PROCESS */}
          <section id="process" className="ph-process">
            <Reveal>
              <div className="stag">Methodology</div>
              <h2 className="sh">How We Deliver</h2>
              <div className="sdiv" />
              <p className="ssub">A repeatable four-phase framework refined across 150+ projects to minimise risk and maximise certainty.</p>
            </Reveal>
            <div className="proc-steps">
              {process.map((s, i) => (
                <Reveal key={i} delay={i + 1}>
                  <div className="proc-step">
                    <div className="step-n">{s.n}</div>
                    <div className="step-t">{s.t}</div>
                    <p className="step-d">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="ph-cta">
            <Reveal>
              <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                <div className="stag" style={{ justifyContent: "center" }}>Ready to Build?</div>
                <h2 className="sh" style={{ textAlign: "center" }}>Start Your Project Today</h2>
                <p style={{ color: "var(--mist)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
                  Submit a Request for Proposal and our estimating team will craft a detailed response within 48 hours.
                </p>
                <button className="btn-p" onClick={() => go("contact")}>Open Contact Page →</button>
              </div>
            </Reveal>
          </div>
        </>
      )}

      {page === "contact" && <ContactPage />}

      {/* FOOTER */}
      <footer className="ph-footer">
        <div className="ft-top">
          <div>
            <div className="ft-brand" onClick={() => go("home")}>PETRA <span>HOLDINGS</span></div>
            <p className="ft-tag">Architectural &amp; Structural Infrastructure Management since 2006.</p>
          </div>
          <div>
            <div className="ft-ct">Navigation</div>
            <ul className="ft-links">
              {["home","services","projects","about","process"].map(l => (
                <li key={l}><span onClick={() => go("home", l)}>{l.charAt(0).toUpperCase() + l.slice(1)}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-ct">Services</div>
            <ul className="ft-links">
              {["Commercial","Civil & Structural","Project Management","Sustainable Dev"].map(s => (
                <li key={s}><span onClick={() => go("home","services")}>{s}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-ct">Contact</div>
            <ul className="ft-links">
              <li><a href="mailto:estimates@petraholdings.com">estimates@petraholdings.com</a></li>
              <li><a href="tel:+18005557387">+1 (800) 555 PETRA</a></li>
              <li><span onClick={() => go("contact")}>Open Contact Page →</span></li>
            </ul>
          </div>
        </div>
        <div className="ft-bot">
          <div className="ft-copy">© {new Date().getFullYear()} Petra Holdings. All rights reserved.</div>
          <div className="ft-badge"><div className="badge-dot" />All systems operational</div>
        </div>
      </footer>
    </>
  );
}
