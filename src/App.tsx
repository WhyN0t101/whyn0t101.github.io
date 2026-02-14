import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Github, Linkedin, Globe, Terminal, Code2,
  Shield, Network, GraduationCap,
  Menu, X, ChevronUp, Briefcase
} from 'lucide-react';
import projectsData from './data/projects.json';
import educationData from './data/education.json';
import experienceData from './data/experience.json';

// ── Hooks ──

function useInView(options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      options
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return [ref, inView] as const;
}

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return active;
}

// ── Components ──

function FadeInSection({ children, className = "", ...rest }: any) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <section
      ref={ref}
      className={`fade-in-section ${inView ? 'visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let columns: number;
    let drops: number[];
    const fontSize = 14;
    const frameInterval = 1000 / 30;

    const initDrops = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };
    initDrops();

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(138, 43, 226, 0.5)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    let animationFrameId: number;
    let lastTime = 0;
    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      if (time - lastTime < frameInterval) return;
      lastTime = time;
      draw();
    };
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener('resize', initDrops);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', initDrops);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 opacity-40"
    />
  );
}

function Typewriter({ text, speed = 60 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <span className={`inline-block w-[2px] h-[1em] bg-purple-400 ml-0.5 align-middle ${done ? 'animate-blink' : ''}`} />
    </span>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-purple-900/60 border border-purple-500/30
                 hover:bg-purple-800/70 hover:border-purple-500/50 transition-all duration-200 glow
                 backdrop-blur-sm"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5 text-purple-300" />
    </button>
  );
}

// ── Data ──

type Category = "All" | "Security" | "Networking" | "Development";

interface Project {
  title: string;
  category: Exclude<Category, "All">;
  association?: string;
  description: string;
  skills: string[];
}

const categoryConfig: Record<Exclude<Category, "All">, { icon: any; color: string }> = {
  Security:    { icon: Shield,  color: "text-red-400" },
  Networking:  { icon: Network, color: "text-blue-400" },
  Development: { icon: Code2,   color: "text-green-400" },
};

const projects: Project[] = projectsData as Project[];
const education = educationData as { degree: string; field: string; school: string; period: string; focus: string }[];
const experience = experienceData as { title: string; organisation: string; location?: string; period: string; type: 'primary' | 'secondary'; bullets: string[] }[];

const toolLinks = [
  { name: "CyberChef", url: "https://gchq.github.io/CyberChef/" },
  { name: "Regexr", url: "https://regexr.com/" },
  { name: "Crontab Guru", url: "https://crontab.guru" },
];

const haxLinks = [
  { name: "Sploitus", url: "https://sploitus.com" },
  { name: "Exploit DB", url: "https://exploit-db.com" },
  { name: "0day.today", url: "https://0day.today" },
];

const categories: Category[] = ['All', 'Security', 'Networking', 'Development'];

const socialLinks = [
  { href: 'https://github.com/WhyN0t101', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/tiago-pereira-4763ab252/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://gist.github.com/WhyN0t101', icon: Globe, label: 'Gists' },
];

const navItems = ['About', 'Experience', 'Education', 'Projects'];
const sectionIds = ['about', 'experience', 'education', 'projects'];

// ── Header ──

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigation
  const handleNavClick = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-lg shadow-lg shadow-purple-900/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="#hero"
          className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors"
          style={{ fontFamily: "'VT323', monospace" }}
        >
          &gt; WhyN0t_
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:block">
          <ul className="flex gap-6 text-sm tracking-wide uppercase">
            {navItems.map((item) => {
              const id = item.toLowerCase();
              const isActive = activeSection === id;
              return (
                <li key={item}>
                  <a
                    href={`#${id}`}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? 'text-purple-300'
                        : 'text-gray-300 hover:text-purple-300'
                    }`}
                  >
                    {item}
                    {isActive && (
                      <span className="block h-0.5 mt-1 bg-purple-300 rounded-full" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 text-gray-400 hover:text-purple-400 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="sm:hidden bg-black/95 backdrop-blur-lg border-t border-purple-500/10">
          <ul className="flex flex-col px-6 py-4 gap-4 text-sm tracking-wide uppercase">
            {navItems.map((item) => {
              const id = item.toLowerCase();
              const isActive = activeSection === id;
              return (
                <li key={item}>
                  <a
                    href={`#${id}`}
                    onClick={handleNavClick}
                    className={`block py-1 transition-colors duration-200 ${
                      isActive ? 'text-purple-300' : 'text-gray-300'
                    }`}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}

// ── Project Card ──

function ProjectCard({ project }: { project: Project }) {
  const config = categoryConfig[project.category];
  const Icon = config.icon;

  return (
    <div
      className="group bg-gray-900/50 border border-purple-500/10 rounded-xl p-6
                 hover:border-purple-500/30 hover:bg-gray-900/70 transition-all duration-300
                 card-glow backdrop-blur-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-xs font-medium ${config.color} uppercase tracking-wider`}>
            {project.category}
          </span>
        </div>
        {project.association && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            {project.association}
          </span>
        )}
      </div>

      <h3
        className="text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight"
        style={{ fontFamily: "'VT323', monospace", fontSize: '1.4rem' }}
      >
        {project.title}
      </h3>

      <p className="text-sm text-gray-400 leading-relaxed mb-4">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.skills.map((skill, i) => (
          <span
            key={i}
            className="px-2.5 py-1 text-xs font-medium bg-purple-500/15 text-purple-200 border border-purple-500/30 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredProjects = useMemo(() =>
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const handleCategoryChange = useCallback((cat: Category) => setActiveCategory(cat), []);

  return (
    <div className="min-h-screen relative bg-black text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-black to-black" />
        <MatrixRain />
      </div>

      <Header />
      <ScrollToTop />

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section id="hero" className="min-h-screen flex items-center justify-center pt-16">
          <FadeInSection className="text-center px-6">
            <h1
              className="text-6xl md:text-8xl font-bold mb-4 py-2 tracking-tight leading-none bg-gradient-to-r from-white via-purple-200 to-purple-400 text-transparent bg-clip-text"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Tiago Pereira
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto">
              <Typewriter text="Computer Engineer · Cybersecurity & Digital Forensics" speed={45} />
            </p>
            <div className="flex justify-center gap-3 mb-8">
              {socialLinks.map(({ href, icon: SocialIcon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-purple-900/40 border border-purple-500/20
                             hover:bg-purple-800/50 hover:border-purple-500/40 hover:scale-110
                             transition-all duration-200 glow"
                  title={label}
                >
                  <SocialIcon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-purple-300
                         border border-purple-500/30 rounded-full hover:bg-purple-900/40
                         hover:border-purple-500/50 transition-all duration-200"
            >
              View my work
              <ChevronUp className="w-4 h-4 rotate-180" />
            </a>
          </FadeInSection>
        </section>

        {/* ── About ── */}
        <FadeInSection id="about" className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto bg-gray-900/50 border border-purple-500/10 backdrop-blur-sm rounded-xl p-8">
            <h2
              className="text-2xl font-semibold mb-4 flex items-center gap-2"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              <Terminal className="w-5 h-5 text-purple-400" />
              About Me
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Computer Engineer entering the second year of an MSc in Cybersecurity &amp; Digital
              Forensics. My work so far has focused on malware development and analysis, forensic
              investigation, secure network design, and penetration testing, all through hands-on
              projects that replicate real-world attack and defence scenarios.
            </p>
          </div>
        </FadeInSection>

        {/* ── Experience ── */}
        <FadeInSection id="experience" className="container mx-auto px-6 py-20">
          <h2
            className="text-2xl font-semibold mb-10 flex items-center gap-2"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            <Briefcase className="w-5 h-5 text-purple-400" />
            Experience
          </h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-[15px] top-[20px] bottom-[20px] w-px bg-purple-500/20" />

            <div className="space-y-6">
              {experience.map((exp, i) => {
                const isSecondary = exp.type === 'secondary';
                return (
                  <div key={i} className="flex gap-6">
                    <div className="relative flex-shrink-0">
                      {isSecondary ? (
                        <div className="w-[31px] h-[31px] rounded-full border-2 border-purple-500/25 border-dashed flex items-center justify-center z-10 relative mt-1">
                          <div className="w-2 h-2 rounded-full bg-purple-500/40" />
                        </div>
                      ) : (
                        <div className="w-[31px] h-[31px] rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center z-10 relative mt-1">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                        </div>
                      )}
                    </div>
                    <div className={`bg-gray-900/50 border border-purple-500/10 rounded-xl flex-1 hover:border-purple-500/30 transition-all duration-300 ${isSecondary ? 'p-5' : 'p-6'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1">
                        <h3
                          className={`font-semibold ${isSecondary ? 'text-gray-300 text-base' : 'text-white text-lg'}`}
                          style={{ fontFamily: "'VT323', monospace", fontSize: isSecondary ? '1.15rem' : '1.3rem' }}
                        >
                          {exp.title}
                        </h3>
                        <span className={`text-sm font-medium whitespace-nowrap sm:ml-4 ${isSecondary ? 'text-purple-400/70' : 'text-purple-400'}`}>{exp.period}</span>
                      </div>
                      <p className={`text-sm ${isSecondary ? 'text-purple-300/70' : 'text-purple-300'}`}>{exp.organisation}</p>
                      {exp.location && (
                        <p className="text-gray-500 text-sm mt-0.5">{exp.location}</p>
                      )}
                      <ul className="mt-3 space-y-2">
                        {exp.bullets.map((bullet, j) => (
                          <li key={j} className={`text-sm leading-relaxed flex gap-2 ${isSecondary ? 'text-gray-500' : 'text-gray-400'}`}>
                            <span className="text-purple-500/60 mt-1.5 flex-shrink-0">&#8226;</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInSection>

        {/* ── Education ── */}
        <FadeInSection id="education" className="container mx-auto px-6 py-20">
          <h2
            className="text-2xl font-semibold mb-10 flex items-center gap-2"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            <GraduationCap className="w-5 h-5 text-purple-400" />
            Education
          </h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-[15px] top-[20px] bottom-[20px] w-px bg-purple-500/20" />

            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={i} className="flex gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-[31px] h-[31px] rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center z-10 relative mt-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                    </div>
                  </div>
                  <div className="bg-gray-900/50 border border-purple-500/10 rounded-xl p-6 flex-1 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                      <h3
                        className="text-lg font-semibold text-white"
                        style={{ fontFamily: "'VT323', monospace", fontSize: '1.3rem' }}
                      >
                        {edu.degree}
                      </h3>
                      <span className="text-sm text-purple-400 font-medium">{edu.period}</span>
                    </div>
                    <p className="text-purple-300 text-sm">{edu.field}</p>
                    <p className="text-gray-500 text-sm mt-1">{edu.school}</p>
                    <p className="text-gray-500 text-sm mt-2">Focus areas: {edu.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* ── Projects ── */}
        <FadeInSection id="projects" className="container mx-auto px-6 py-20">
          <h2
            className="text-2xl font-semibold mb-8"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            Projects
          </h2>

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                  activeCategory === cat
                    ? 'bg-purple-600/30 border-purple-500/50 text-purple-300'
                    : 'bg-transparent border-gray-700/50 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    {projects.filter((p) => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </FadeInSection>

        {/* ── Footer ── */}
        <footer className="py-8 mt-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-gray-500 mb-4">
              {[...toolLinks, ...haxLinks].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-300 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              {socialLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-300 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Tiago Pereira
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
