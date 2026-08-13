import { useEffect, useState, useRef } from 'react'
import { profile, summary, education, skills, experience } from './data.js'

// Respect reduced-motion for all entrance animations.
function useReducedMotion() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const onChange = (e) => setReduce(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduce
}

// Light/dark toggle that persists and stays in sync with the pre-paint script.
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined' && document.documentElement.dataset.theme) {
      return document.documentElement.dataset.theme
    }
    return 'dark'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {}
  }, [theme])
  return [theme, setTheme]
}

// Subtle reveal-on-scroll using IntersectionObserver (no scroll listeners).
function Reveal({ children, as: Tag = 'div', className = '', style }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [shown, setShown] = useState(reduce)
  useEffect(() => {
    if (reduce) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduce])
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'reveal-in' : ''} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  )
}

export default function App() {
  const [theme, setTheme] = useTheme()
  const reduce = useReducedMotion()

  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            {profile.initials}
          </span>
          <span className="brand-name">{profile.name}</span>
        </a>
        <nav className="nav" aria-label="Navigasi utama">
          <a href="#tentang">Tentang</a>
          <a href="#pengalaman">Pengalaman</a>
          <a href="#pendidikan">Pendidikan</a>
          <a href="#keahlian">Keahlian</a>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          >
            {theme === 'dark' ? 'Terang' : 'Gelap'}
          </button>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-name">
          <Reveal className="hero-inner">
            <p className="eyebrow">Portofolio</p>
            <h1 id="hero-name" className="hero-name">
              {profile.name}
            </h1>
            <p className="hero-role">{profile.role}</p>
            <p className="hero-loc">{profile.location}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={profile.cvHref}>
                Lihat CV
              </a>
              <a className="btn btn-ghost" href={`#${'pengalaman'}`}>
                Pengalaman
              </a>
            </div>
          </Reveal>
        </section>

        {/* ABOUT / BIOGRAPHY */}
        <section id="tentang" className="section" aria-labelledby="tentang-h">
          <Reveal>
            <h2 id="tentang-h" className="section-title">
              Tentang
            </h2>
          </Reveal>
          <Reveal className="bio">
            {summary.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </Reveal>
        </section>

        {/* EXPERIENCE */}
        <section id="pengalaman" className="section" aria-labelledby="pengalaman-h">
          <Reveal>
            <h2 id="pengalaman-h" className="section-title">
              Pengalaman
            </h2>
          </Reveal>
          <div className="timeline">
            {experience.map((job, i) => (
              <Reveal as="article" className="job" key={i}>
                <div className="job-head">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-meta">
                    {job.company} <span className="dot" aria-hidden="true">·</span> {job.period}
                  </p>
                </div>
                <ul className="job-points">
                  {job.points.map((pt, j) => (
                    <li key={j}>{pt}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* EDUCATION */}
        <section id="pendidikan" className="section" aria-labelledby="pendidikan-h">
          <Reveal>
            <h2 id="pendidikan-h" className="section-title">
              Pendidikan
            </h2>
          </Reveal>
          <div className="edu">
            {education.map((ed, i) => (
              <Reveal as="article" className="edu-card" key={i}>
                <h3 className="edu-degree">{ed.degree}</h3>
                <p className="edu-school">{ed.school}</p>
                <p className="edu-period">{ed.period}</p>
                <p className="edu-note">{ed.note}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="keahlian" className="section" aria-labelledby="keahlian-h">
          <Reveal>
            <h2 id="keahlian-h" className="section-title">
              Keahlian Utama
            </h2>
          </Reveal>
          <Reveal className="skills">
            <ul className="skills-list">
              {skills.map((s, i) => (
                <li className="skill-chip" key={i}>
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="cta" aria-labelledby="cta-h">
          <Reveal>
            <h2 id="cta-h" className="cta-title">
              Tertarik bekerja sama?
            </h2>
            <p className="cta-sub">
              Unduh curriculum vitae lengkap atau hubungi langsung melalui kontak di bawah.
            </p>
            <div className="cta-actions">
              <a className="btn btn-primary" href={profile.cvHref}>
                Unduh CV
              </a>
              <a className="btn btn-ghost" href={profile.contact.emailHref}>
                {profile.contact.email}
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-contact">
          <a href={profile.contact.phoneHref}>{profile.contact.phone}</a>
          <a href={profile.contact.emailHref}>{profile.contact.email}</a>
        </div>
        <p className="footer-note">
          {profile.name} - {profile.location}
        </p>
      </footer>
    </div>
  )
}
