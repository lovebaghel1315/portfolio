import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Stat, StoredFile } from "./types";
import {
  ADMIN_CODE,
  isAdmin as isAdminFn,
  loadFiles,
  loadStats,
  saveStats,
  setAdmin,
} from "./storage";
import FileUploader from "./components/FileUploader";
import EditableStat from "./components/EditableStat";

const DEFAULT_STATS: Stat[] = [
  { id: "exp", label: "Experience", value: "1 Year+" },
  { id: "leads", label: "Leads Generated", value: "6000+" },
  { id: "roas", label: "High ROAS", value: "7x" },
  { id: "followers", label: "Followers Gained / Month", value: "5k+" },
  { id: "budget", label: "Budget Managed", value: "₹4 Lakh+" },
];

const STAT_ACCENTS = [
  "from-indigo-500 to-violet-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-sky-500 to-cyan-500",
];

const SKILLS = [
  {
    icon: "📊",
    title: "Performance Marketing",
    accent: "from-indigo-500 to-violet-500",
    items: ["Meta Ads", "Google Ads", "LinkedIn Ads", "A/B Testing", "Retargeting"],
  },
  {
    icon: "🤖",
    title: "AI & Automation",
    accent: "from-pink-500 to-rose-500",
    items: ["AI Video Gen", "WhatsApp Automation", "Email Automation", "AI Copy"],
  },
  {
    icon: "📈",
    title: "Analytics & Reporting",
    accent: "from-amber-500 to-orange-500",
    items: ["GA4", "Meta Insights", "Search Console", "KPI Tracking"],
  },
  {
    icon: "🎨",
    title: "Design & Creative",
    accent: "from-emerald-500 to-teal-500",
    items: ["Canva", "Static Creatives", "Short-form Video"],
  },
  {
    icon: "🌐",
    title: "Digital Marketing",
    accent: "from-sky-500 to-cyan-500",
    items: ["SEO", "Landing Pages", "Social Media", "Email Marketing"],
  },
  {
    icon: "🧠",
    title: "Strategy & Soft Skills",
    accent: "from-fuchsia-500 to-purple-500",
    items: ["Lead Gen", "Funnel Optimization", "Client Comms", "Leadership"],
  },
];

const EXPERIENCE = [
  {
    period: "Dec 2025 – Present",
    role: "Digital Marketing Trainee",
    org: "MPOnline Limited · Bhopal",
    accent: "from-indigo-500 to-violet-500",
    points: [
     "Managed social media platforms (Instagram, Facebook, LinkedIn) with content planning and growth strategies.",
      "Created and executed content calendars, creatives, and hooks for better engagement and reach.",
      "Ran performance marketing campaigns, achieving 1–1.5% CTR and reducing CPL from ₹110 to ₹37",
      "Managed ₹4L+ ad budget, delivering 7x ROAS through continuous optimization.",
      "Generated quality leads using A/B testing, audience targeting, and funnel strategies.",
      "Tracked and analyzed CTR, CPL, and conversions to make data-driven decisions.",
      "Built AI automation systems for lead nurturing and funnel optimization.",
      "Created AI-based creatives & copy, streamlining content production.",
      "Supported email marketing, basic SEO, and overall digital growth strategies.",
      "Conducted lead counselling to improve conversion rates and customer journey.",
    ],
  },
  
  {
    period: "Dec 2024 – Nov 2025",
    role: "Junior Marketing Executive",
    org: "Krishna Properties & Constructions · Indore",
    accent: "from-amber-500 to-orange-500",
    points: [
      "Managed real estate marketing campaigns for lead generation and project awareness.",
      "Generated high-intent property leads using geo-targeting and audience segmentation.",
      "Optimized campaigns to reduce CPL and improve lead quality for better conversions.",
      "Handled social media platforms, creating property-focused content (posts, reels, site updates).",
      "Planned and executed content calendars highlighting projects, offers, and location benefits.",
      "Tracked and analyzed CTR, CPL, and lead-to-visit conversion rates for performance improvement.",
      "Coordinated lead follow-ups and site visits, ensuring smooth customer journey.",
      "Implemented WhatsApp marketing and automation for faster lead response and nurturing.",
      "Supported landing page optimization and local SEO to improve visibility and inquiries.",
    ],
  },
  {
    period: "Jan 2025 – Ongoing",
    role: "Co-Founder",
    org: "Advertexsis · Digital Solutions",
    accent: "from-pink-500 to-rose-500",
    points: [
      "Delivere end-to-end digital marketing services including social media, performance marketing, and branding.",
      "Manage multi-platform campaigns (Meta, Google) for lead generation and brand growth.",
      "Develope and executed content strategies, calendars, and creatives for consistent engagement.",
      "Generate high-quality leads using audience targeting, funnel strategies, and A/B testing.",
      "Optimize campaigns to improve CTR, CPL, and overall ROI/ROAS.",
      "Tracked and analyzed campaign performance metrics to drive data-backed decisions.",
      "Built AI-driven automation systems for lead nurturing and workflow optimization.",
      "Created high-converting ad creatives, videos, and copy using modern design and AI tools.",
      "Executed email marketing, basic SEO, and landing page optimization strategies.",
      "Collaborated with clients to understand goals and deliver scalable growth solutions.",
    ]
  },
];

const CERTIFICATES = [
  {
    id: "cert-google",
    issuer: "Google",
    title: "Digital Marketing & E-commerce",
    year: "2024",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    id: "cert-techxonic",
    issuer: "Techxonic Innovation",
    title: "Digital Marketing Certification",
    year: "2024",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    id: "cert-award",
    issuer: "People's Institute · Bhopal",
    title: "Management Student of the Year",
    year: "2023–2024",
    accent: "from-amber-500 to-orange-500",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function App() {
  const [admin, setAdminState] = useState<boolean>(isAdminFn());
  const [stats, setStats] = useState<Stat[]>(loadStats(DEFAULT_STATS));
  const [files, setFiles] = useState<StoredFile[]>(loadFiles());
  const [showLogin, setShowLogin] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  function updateStat(s: Stat) {
    setStats((prev) => prev.map((x) => (x.id === s.id ? s : x)));
  }

  function tryLogin() {
    if (code.trim() === ADMIN_CODE) {
      setAdmin(true);
      setAdminState(true);
      setShowLogin(false);
      setCode("");
    } else {
      alert("❌ Wrong access code");
    }
  }

  function logout() {
    setAdmin(false);
    setAdminState(false);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-zinc-800">
      {/* animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-300 to-violet-300 opacity-30 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-pink-300 to-rose-300 opacity-25 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-amber-200 to-emerald-200 opacity-25 blur-3xl"
        />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-200">
              LB
            </div>
            <div className="text-sm font-semibold">Lovkush Baghel</div>
            <span className="hidden items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Open to Work
            </span>
          </motion.div>
          <nav className="hidden items-center gap-5 text-xs font-medium text-zinc-600 md:flex">
            {["About", "Skills", "Experience", "Portfolio", "Certificates"].map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                className="relative transition-colors hover:text-indigo-600"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {admin ? (
              <>
                <span className="rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                  ✦ Admin Mode
                </span>
                <button
                  onClick={logout}
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-indigo-600"
                title="Owner login"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-4 pt-10 pb-6">
        <div className="grid gap-6 md:grid-cols-5">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="md:col-span-3"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl"
            >
              Lovkush{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                Baghel
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-[15px]"
            >
              Driving brand growth through{" "}
              <b className="text-zinc-800">performance campaigns</b>,{" "}
              <b className="text-zinc-800">AI-powered automation</b>, and data-backed
              creative strategy.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-4 flex flex-wrap gap-2">
              <a
                href="#portfolio"
                className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                View Work
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="mailto:lovebaghel1315@gmail.com"
                className="rounded-lg border border-zinc-300 bg-white/80 px-4 py-2 text-xs font-semibold text-zinc-700 backdrop-blur hover:bg-white"
              >
                ✉ lovebaghel1315@gmail.com
              </a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="md:col-span-2"
          >
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map((s, i) => (
                <motion.div key={s.id} variants={fadeUp} className={i === 4 ? "col-span-2" : ""}>
                  <EditableStat
                    stat={s}
                    isAdmin={admin}
                    accent={STAT_ACCENTS[i % STAT_ACCENTS.length]}
                    onChange={updateStat}
                  />
                </motion.div>
              ))}
            </div>
            {admin && (
              <p className="mt-1.5 text-center text-[10px] text-zinc-400">
                ✎ Click any stat to edit
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* About */}
      <Section id="about" eyebrow="Who I Am" title="Performance meets creativity">
        <div className="grid gap-3 md:grid-cols-3">
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/60 bg-white/70 p-5 text-sm leading-relaxed text-zinc-600 shadow-sm backdrop-blur md:col-span-2"
          >
            <p>
              I'm a Digital Marketing Specialist currently pursuing my BBA at{" "}
              <b className="text-zinc-800">People's Institute of Management & Research, Bhopal</b>.
              I combine analytical thinking with creative execution to run campaigns that
              actually move the needle.
            </p>
            <p className="mt-2">
              At <b className="text-zinc-800">MPOnline Limited</b>, I manage Meta Ads
              end-to-end. I also co-founded <b className="text-zinc-800">Advertexsis</b>,
              a digital advertising agency where I build automated marketing systems for clients.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                "Meta Ads",
                "Google Ads",
                "AI Automation",
                "WhatsApp Marketing",
                "Email Marketing",
                "Graphic Design",
                "SEO",
              ].map((t) => (
                <motion.span
                  key={t}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-100"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger} className="space-y-2">
            <InfoRow icon="💼" label="Current Role" value="Performance Marketing Intern · MPOnline" />
            <InfoRow icon="🚀" label="Agency" value="Co-Founder · Advertexsis" />
            <InfoRow icon="🎓" label="Education" value="BBA · 2023–2026 · Bhopal" />
            <InfoRow icon="📍" label="Location" value="Bhopal, Madhya Pradesh 🇮🇳" />
          </motion.div>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" eyebrow="What I Do" title="Skills & Expertise">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur"
            >
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${s.accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
              />
              <div className="relative mb-2 flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} text-base shadow-md`}
                >
                  {s.icon}
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">{s.title}</h3>
              </div>
              <div className="relative flex flex-wrap gap-1">
                {s.items.map((i) => (
                  <span
                    key={i}
                    className="rounded-md bg-white/80 px-1.5 py-0.5 text-[10.5px] font-medium text-zinc-600 ring-1 ring-zinc-200/60"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Experience timeline */}
      <Section id="experience" eyebrow="My Journey" title="Work Experience">
        <div className="relative">
          {/* timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-300 via-violet-300 to-pink-300 sm:left-[130px]" />
          <div className="space-y-4">
            {EXPERIENCE.map((e, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="relative grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"
              >
                {/* period */}
                <div className="relative pl-10 sm:pl-0 sm:pr-6 sm:text-right">
                  <motion.span
                    whileHover={{ scale: 1.4 }}
                    className={`absolute left-2 top-1.5 h-4 w-4 rounded-full border-[3px] border-white bg-gradient-to-br ${e.accent} shadow-md sm:left-auto sm:right-[-8px]`}
                  />
                  <div className="inline-block rounded-md bg-white/80 px-2 py-0.5 text-[10.5px] font-semibold text-indigo-600 ring-1 ring-indigo-100 backdrop-blur">
                    {e.period}
                  </div>
                </div>
                {/* card */}
                <motion.div
                  whileHover={{ x: 3 }}
                  className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur sm:ml-4"
                >
                  <div className="text-base font-semibold text-zinc-900">{e.role}</div>
                  <div className="mt-0.5 text-xs text-zinc-500">{e.org}</div>
                  <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-zinc-600">
                    {e.points.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br ${e.accent}`}
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Portfolio uploads */}
      <Section id="portfolio" eyebrow="My Work" title="Portfolio & Reports">
        <p className="mb-3 text-xs text-zinc-500">
          {admin
            ? "✦ Admin mode — drop or click to upload your reports, decks, designs & docs."
            : "Browse uploaded reports, decks, and creatives. Click any file to preview."}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <motion.div variants={fadeUp}>
            <FileUploader
              isAdmin={admin}
              files={files}
              onChange={setFiles}
              category="reports"
              label="Reports & Sheets"
              hint="Excel · CSV · PDF"
              icon="📊"
              accent="from-emerald-500 to-teal-500"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FileUploader
              isAdmin={admin}
              files={files}
              onChange={setFiles}
              category="decks"
              label="Decks & Presentations"
              hint="PPT · PPTX · PDF"
              icon="📽️"
              accent="from-amber-500 to-orange-500"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FileUploader
              isAdmin={admin}
              files={files}
              onChange={setFiles}
              category="docs"
              label="Documents"
              hint="DOC · DOCX · PDF"
              icon="📄"
              accent="from-sky-500 to-cyan-500"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FileUploader
              isAdmin={admin}
              files={files}
              onChange={setFiles}
              category="creatives"
              label="Ad Creatives & Designs"
              hint="JPG · PNG · PDF"
              icon="🖼️"
              accent="from-pink-500 to-rose-500"
            />
          </motion.div>
        </div>
      </Section>

      {/* Certificates */}
      <Section id="certificates" eyebrow="Credentials" title="Certificates & Achievements">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATES.map((c) => (
            <motion.div
              key={c.id}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur"
            >
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${c.accent} opacity-25 blur-2xl`}
              />
              <div className="relative">
                <div
                  className={`mb-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${c.accent} px-2 py-0.5 text-[10px] font-semibold text-white shadow`}
                >
                  🏅 {c.issuer}
                </div>
                <div className="text-sm font-semibold text-zinc-900">{c.title}</div>
                <div className="text-[11px] text-zinc-500">{c.year}</div>
                <div className="mt-3">
                  <FileUploader
                    isAdmin={admin}
                    files={files}
                    onChange={setFiles}
                    category={c.id}
                    label="Attached file"
                    hint="PDF · Image"
                    icon="📎"
                    accent={c.accent}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="relative mx-auto mt-8 max-w-5xl border-t border-white/40 px-4 py-6 text-center text-[11px] text-zinc-500">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div>© {new Date().getFullYear()} Lovkush Baghel · All rights reserved</div>
          <div className="flex gap-3">
            <a href="mailto:lovebaghel1315@gmail.com" className="hover:text-indigo-600">
              ✉ Email
            </a>
            <span>·</span>
            <span>Bhopal, India 🇮🇳</span>
          </div>
        </div>
      </footer>

      {/* Admin login modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white">
                <div className="text-2xl">🔐</div>
                <h3 className="mt-2 text-lg font-semibold">Owner Login</h3>
                <p className="mt-0.5 text-xs text-indigo-100">
                  Only the site owner can upload or edit content.
                </p>
              </div>
              <div className="p-5">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && tryLogin()}
                  placeholder="Enter access code"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  autoFocus
                />
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowLogin(false);
                      setCode("");
                    }}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={tryLogin}
                    className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:shadow-lg"
                  >
                    Unlock →
                  </button>
                </div>
                <p className="mt-3 rounded-md bg-amber-50 px-2 py-1.5 text-[10px] text-amber-700 ring-1 ring-amber-200">
                  💡 Default code: <code className="font-bold">{ADMIN_CODE}</code> — change it
                  in <code>src/storage.ts</code>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="relative mx-auto max-w-5xl px-4 py-6"
    >
      <motion.div variants={fadeUp} className="mb-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-600">
          {eyebrow}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {title}
        </h2>
      </motion.div>
      {children}
    </motion.section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 3 }}
      className="flex items-start gap-2.5 rounded-xl border border-white/60 bg-white/70 px-3 py-2 backdrop-blur"
    >
      <span className="text-base">{icon}</span>
      <div className="min-w-0">
        <div className="text-[9.5px] font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </div>
        <div className="text-xs font-medium text-zinc-800">{value}</div>
      </div>
    </motion.div>
  );
}
