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
  { ico: "🏗️", title: "Civil Engineering", desc: "Reinforced concrete (RCC) structures, complex foundations, columns, slabs, masonry, plastering, and professional waterproofing.", n: "01" },
  { ico: "⚙️", title: "Mechanical & Electrical (M&E)", desc: "Comprehensive building services including electrical distribution, plumbing, water/sanitary systems, HVAC, and ventilation coordination.", n: "02" },
  { ico: "🔑", title: "Turnkey Delivery Model", desc: "End-to-end management from concept and first survey to design coordination, interior fit-outs, final handover, and after-care.", n: "03" },
  { ico: "📊", title: "Project & Cost Management", desc: "Rigorous quantity surveying, transparent BOQ preparation, realistic cost estimation, on-site supervision, and strict timeline controls.", n: "04" },
];

/* ── Auto-detect all images from each project folder using Vite glob ── */
const allProjectImages = {
  "lake-road-dehiwala": Object.values(
    import.meta.glob("/src/assets/projects/lake-road-dehiwala/*.{jpg,jpeg,png,webp}", { eager: true })
  ).map(m => m.default),

  "kalutara-hotel": Object.values(
    import.meta.glob("/src/assets/projects/kalutara-hotel/*.{jpg,jpeg,png,webp}", { eager: true })
  ).map(m => m.default),

  "kalawana-ratnapura": Object.values(
    import.meta.glob("/src/assets/projects/kalawana-ratnapura/*.{jpg,jpeg,png,webp}", { eager: true })
  ).map(m => m.default),
};

const projects = [
  {
    type: "Residential (Completed)",
    title: "Lake Road Project, Dehiwala",
    year: "Tropical-modern waterside luxury home",
    bg: "bg1",
    folder: "lake-road-dehiwala",
  },
  {
    type: "Hospitality (Completed)",
    title: "Kalutara Hotel Beachfront Project",
    year: "Robust concrete frame, sea-facing balconies",
    bg: "bg2",
    folder: "kalutara-hotel",
  },
  {
    type: "Residential (Ongoing)",
    title: "Kalawana Luxury Home, Ratnapura",
    year: "Precision concrete and engineered steel roof structures",
    bg: "bg3",
    folder: "kalawana-ratnapura",
  },
].map(p => ({ ...p, photos: allProjectImages[p.folder] ?? [] }));

/* ── Project Card with auto-cycling slideshow ── */
function ProjectCard({ p, index }) {
  const hasPhotos = p.photos.length > 0;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    if (!hasPhotos || p.photos.length < 2) return;
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % p.photos.length);
    }, 2000);
  };

  useEffect(() => {
    if (!paused) startTimer();
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [paused, p.photos.length]);

  const goTo = (i) => {
    setActive(i);
    if (!paused) startTimer();
  };

  return (
    <div
      className="prj-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Photo layers — crossfade, or fallback gradient */}
      {hasPhotos ? p.photos.map((src, i) => (
        <div
          key={i}
          className={`prj-bg ${p.bg}`}
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === active ? 1 : 0,
            transition: "opacity 0.8s ease",
            position: "absolute",
            inset: 0,
          }}
        />
      )) : (
        <div className={`prj-bg ${p.bg}`} />
      )}

      <div className="prj-pat" />
      <div className="prj-ov" />

      {/* Photo selector dots + folder label — only shown when photos exist */}
      {hasPhotos && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.5rem",
            zIndex: 10,
          }}
        >
          {/* Folder label */}
          <div style={{
            fontSize: "0.6rem",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            background: "rgba(0,0,0,0.45)",
            padding: "3px 8px",
            borderRadius: "3px",
            backdropFilter: "blur(4px)",
          }}>
            📁 {p.folder}
          </div>
          {/* Dot selectors */}
          <div style={{ display: "flex", gap: "6px" }}>
            {p.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === active ? "22px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  background: i === active ? "var(--gold, #C9A84C)" : "rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Slide counter */}
      {hasPhotos && (
        <div style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 10,
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.5)",
          background: "rgba(0,0,0,0.4)",
          padding: "3px 8px",
          borderRadius: "3px",
          backdropFilter: "blur(4px)",
          letterSpacing: "1px",
        }}>
          {active + 1} / {p.photos.length}
        </div>
      )}

      <div className="prj-cnt">
        <div className="prj-type">{p.type}</div>
        <div className="prj-title">{p.title}</div>
        <div className="prj-year">{p.year}</div>
      </div>
    </div>
  );
}

const team = [
  { name: "Gayindu Umesh Perera", role: "Director / Founder Engineer", desc: "BSc in Civil Engineering, RMIT University, Australia. Leads engineering, design, and overall project delivery with international standards." },
  { name: "Chitra Perera", role: "Chief Quantity Surveyor", desc: "City & Guilds (London), AMASI (London), MSST (London). Heads transparent cost planning, accurate BOQs, and quantity surveying." },
  { name: "Yasoda Srimal Abeykoon", role: "Construction Manager", desc: "HND in Quantity Surveying, University of Liverpool. Manages on-the-ground site execution, programming, and schedules." },
  { name: "Nimal Thanthriarachchi", role: "M&E Engineer", desc: "35 years of elite experience in the hospitality industry, specializing in complex air-conditioning, refrigeration, and heating." },
];

const process = [
  { n: "01", t: "First Survey & Estimates", d: "Detailed quantity surveying to keep budgets honest, clear site evaluations, and transparent BOQ estimations." },
  { n: "02", t: "Engineering Coordination", d: "Integration of sound civil structural design with mechanical, electrical, and building services coordination." },
  { n: "03", t: "Rigorous Site Execution", d: "Continuous on-site supervision by qualified engineers with a safety-first discipline to control quality and timelines." },
  { n: "04", t: "Turnkey Handover & After-Care", d: "Premium interior finishing, final structural inspections, seamless keys handover, and long-term asset after-care." },
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
          <img src="/my-logo.png" alt="Petra Logo" style={{ width: '70px', height: '70px' }} />
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
              <h1 className="hero-h1">Engineering<em>Rigour</em></h1>
              <p className="hero-sub">Petra Construction Co. (Pvt.) Ltd. delivers precision-engineered residential, hotel, and commercial civil structures across Sri Lanka with absolute budget transparency and craftsmanship built to endure.</p>
              <div className="hero-btns">
                <a href="#projects" className="btn-p" onClick={e => { e.preventDefault(); go("home","projects"); }}>Explore Portfolio</a>
                <button className="btn-g" onClick={() => go("contact")}>Get a Quote</button>
              </div>
            </div>

            <div className="hero-right">
              <div className="stat-card">
                <div className="stat-num">Rs <CountUp end={500} suffix="M+" /></div>
                <div className="stat-label">Project Value Portfolio</div>
                <div className="stat-desc">Completed and active elite developments</div>
              </div>
              <div className="stat-card">
                <div className="stat-num"><CountUp end={3} suffix="" /></div>
                <div className="stat-label">Signature Case Studies</div>
                <div className="stat-desc">Luxury residential and hospitality structures</div>
              </div>
              <div className="stat-card span2">
                <div className="stat-row">
                  <div>
                    <div className="stat-num"><CountUp end={100} suffix="%" /></div>
                    <div className="stat-label">Client-Led Delivery</div>
                  </div>
                  <div className="stat-div" />
                  <div>
                    <div className="stat-num">100%</div>
                    <div className="stat-label">Engineer-Led Management</div>
                  </div>
                  <div className="stat-div" />
                  <div style={{ flex: 1 }}>
                    <div className="stat-desc">Uncompromising focus on Quality, Safety, and On-time execution at every construction milestone.</div>
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
                <h2 className="sh">Our Core Disciplines</h2>
                <div className="sdiv" />
                <p className="ssub">From complex sub-structures to completely finished luxury spaces, we execute end-to-end structural works under qualified in-house professionals.</p>
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
                <h2 className="sh">Signature Projects</h2>
                <div className="sdiv" />
              </Reveal>
              <Reveal delay={2}>
                <button className="btn-g" style={{ fontSize: "0.72rem" }} onClick={() => go("contact")}>Enquire About Rates →</button>
              </Reveal>
            </div>
            <div className="prj-grid">
              {projects.map((p, i) => (
                <ProjectCard key={i} p={p} index={i} />
              ))}
            </div>
          </section>

          {/* ABOUT & TEAM */}
          <section id="about" className="ph-about">
            <div className="abt-inner">
              <Reveal>
                <div className="abt-vis">
                  <div className="abt-vis-in">
                    <img src="/my-logo.png" alt="Petra Badge Logo" style={{ width: '64px', height: '64px' }} />
                  </div>
                  <div className="abt-acc1" /><div className="abt-acc2" />
                  <div className="abt-badge">Petra Construction Co. (Pvt.) Ltd.</div>
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <div className="stag">Corporate Profile</div>
                  <h2 className="sh">International Engineering Standards.<br />Meticulous Craftsmanship.</h2>
                  <div className="sdiv" />
                  <p className="ssub">Founded by an internationally trained civil engineer, Petra was built with a transparent mission: to raise the standard of engineering quality, reliability, and cost-control across Sri Lanka. We remove the guesswork from construction timelines and costing budgets.</p>
                </Reveal>
                <div className="feat-list">
                  {[
                    { ico: "🔩", t: "Engineering Rigour", d: "Every project stage is managed end-to-end by qualified engineers and chartered-route professionals." },
                    { ico: "📊", t: "Honest Costing & BOQs", d: "Detailed quantity surveying keeps budgets transparent with absolute zero hidden cost surprises." },
                    { ico: "🛡️", t: "Safety First & Luxury Craft", d: "Disciplined site management paired with interior finishes held strictly to high luxury standards." },
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

            {/* TEAM INCLUSION SECTION */}
            <div className="team-section" style={{ marginTop: "5rem" }}>
              <div className="stag" style={{ marginBottom: "1.5rem" }}>Our Technical Leadership</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
                {team.map((t, idx) => (
                  <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontWeight: "bold", color: "#fff", fontSize: "1.1rem" }}>{t.name}</div>
                    <div style={{ color: "var(--gold, #cfa153)", fontSize: "0.85rem", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>{t.role}</div>
                    <p style={{ fontSize: "0.85rem", color: "#ccc", lineHeight: "1.5", margin: 0 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROCESS */}
          <section id="process" className="ph-process">
            <Reveal>
              <div className="stag">Methodology</div>
              <h2 className="sh">Our Professional Framework</h2>
              <div className="sdiv" />
              <p className="ssub">How we combine sound engineering planning with careful construction supervision to protect your project asset.</p>
            </Reveal>
            <div className="proc-steps">
              {process.map((s, i) => (
                <Reveal key={i} delay={i + 1}>
                  <div className="proc-step">
                    <div className="step-n">{s.n}</div>
                    <div className="step-t">{s.t}</div>
                    <p style={{ minHeight: "60px" }} className="step-d">{s.d}</p>
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
                <h2 className="sh" style={{ textAlign: "center" }}>Initiate Your Structural Consult</h2>
                <p style={{ color: "#ccc", marginBottom: "2.5rem", lineHeight: 1.7 }}>
                  Get in touch with our engineering and quantity surveying office to arrange site reviews or coordinate BOQ estimations.
                </p>
                <button className="btn-p" onClick={() => go("contact")}>Open Project Desk Contact →</button>
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
              PETRA <span>CONSTRUCTION</span>
            </div>
            <p className="ft-tag" style={{ color: '#aaa', fontSize: '0.85rem' }}>Petra Construction Co. (Pvt.) Ltd.<br />Solid Foundations. Timeless Structures.</p>
          </div>
          <div>
            <div className="ft-ct">Navigation</div>
            <ul className="ft-links">
              {["home","services","projects","about","process"].map(l => (
                <li key={l}><span style={{ cursor: "pointer" }} onClick={() => go("home", l)}>{l.charAt(0).toUpperCase() + l.slice(1)}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-ct">Services</div>
            <ul className="ft-links">
              {["Civil Engineering","Building M&E Services","Turnkey Solutions","Cost Management"].map(s => (
                <li key={s}><span style={{ cursor: "pointer" }} onClick={() => go("home","services")}>{s}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-ct">Office</div>
            <ul className="ft-links" style={{ fontSize: "0.85rem", color: "#ccc" }}>
              <li>71A Lake Road, Attidiya, Dehiwala</li>
              <li>Phone: 077 735 6371</li>
              <li>Email: <a href="mailto:pcap3@yahoo.com">pcap3@yahoo.com</a></li>
            </ul>
          </div>
        </div>
        <div className="ft-bot">
          <div className="ft-copy">© 2026 Petra Construction Co. (Pvt.) Ltd. All engineering rights reserved.</div>
          <div className="ft-badge"><div className="badge-dot" style={{ backgroundColor: "#55efc4" }} />Site Managed by Nethro Labs</div>
        </div>
      </footer>
    </>
  );
}