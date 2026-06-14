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

export default function PetraConstruction() {
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
      {/* NAV */}
      <nav className={`ph-nav ${page === "contact" ? "solid" : scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => go("home")} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <img src="/my-logo.png" alt="Petra Logo" style={{ width: '120px', height: '120px' }} />
          PETRA <span>CONSTRUCTION</span>
        </div>
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
              <p className="hero-sub">From complex industrial complexes to landmark commercial infrastructure — Petra Construction delivers precision-engineered, sustainably built environments that endure.</p>
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
                  <div className="abt-vis-in">
                    <img src="/apple-touch-icon.png" alt="Petra Badge Logo" style={{ width: '64px', height: '64px', borderRadius: '12px' }} />
                  </div>
                  <div className="abt-acc1" /><div className="abt-acc2" />
                  <div className="abt-badge">Est. 2006 · Petra Construction</div>
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <div className="stag">Corporate Overview</div>
                  <h2 className="sh">Uncompromising Standards.<br />Transparent Execution.</h2>
                  <div className="sdiv" />
                  <p className="ssub">At Petra Construction, we bridge engineered reality with architectural vision. Every project is guided by our commitment to site safety, sustainable material lifecycles, and predictive budget control.</p>
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
            <div className="ft-brand" onClick={() => go("home")} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <img src="/favicon-16x16.png" alt="Petra Footer Logo" />
              PETRA <span>CONSTRUCTION</span>
            </div>
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
              <li><a href="mailto:estimates@petraconstruction.com">estimates@petraconstruction.com</a></li>
              <li><a href="tel:+18005557387">+1 (800) 555 PETRA</a></li>
              <li><span onClick={() => go("contact")}>Open Contact Page →</span></li>
            </ul>
          </div>
        </div>
        <div className="ft-bot">
          <div className="ft-copy">© {new Date().getFullYear()} Petra Construction. All rights reserved.</div>
          <div className="ft-badge"><div className="badge-dot" />All systems operational</div>
        </div>
      </footer>
    </>
  );
}