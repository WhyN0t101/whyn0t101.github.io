import { useEffect, useRef, useState } from 'react';
import projectsData from './data/projects.json';
import educationData from './data/education.json';
import experienceData from './data/experience.json';

/* ============================================================
   Data
   ============================================================ */

type CategoryName = 'Security' | 'Networking' | 'Development';
type Category = 'All' | CategoryName;

interface Project {
  title: string;
  slug: string;
  category: CategoryName;
  association?: string;
  description: string;
  skills: string[];
}

interface Experience {
  title: string;
  organisation: string;
  location?: string;
  period: string;
  type: 'primary' | 'secondary';
  bullets: string[];
}

interface Education {
  degree: string;
  field: string;
  school: string;
  period: string;
  focus: string;
}

const projects = projectsData as Project[];
const experience = experienceData as Experience[];
const education = educationData as Education[];

const identity = {
  name: 'Tiago Pereira',
  headline: 'Cybersecurity & Digital Forensics',
  tagline: 'Computer Engineer · MSc, Polytechnic of Leiria',
};

const social = [
  { name: 'github', url: 'https://github.com/WhyN0t101', icon: 'github' as const },
  { name: 'linkedin', url: 'https://www.linkedin.com/in/tiago-pereira-4763ab252/', icon: 'linkedin' as const },
  { name: 'gists', url: 'https://gist.github.com/WhyN0t101', icon: 'globe' as const },
];

const CATMAP: Record<CategoryName, { ext: string; cls: string; owner: string }> = {
  Security: { ext: '.sec', cls: 'ext-s', owner: 'security' },
  Networking: { ext: '.net', cls: 'ext-n', owner: 'network' },
  Development: { ext: '.dev', cls: 'ext-d', owner: 'develop' },
};

const categories: Category[] = ['All', 'Security', 'Networking', 'Development'];

const navItems = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'education', label: 'education' },
  { id: 'projects', label: 'projects' },
];

const footerCols = [
  {
    title: '// connect',
    links: [
      { label: 'GitHub', url: 'https://github.com/WhyN0t101' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/tiago-pereira-4763ab252/' },
      { label: 'Gists', url: 'https://gist.github.com/WhyN0t101' },
    ],
  },
  {
    title: '// toolbox',
    links: [
      { label: 'CyberChef', url: 'https://gchq.github.io/CyberChef/' },
      { label: 'Regexr', url: 'https://regexr.com/' },
      { label: 'Crontab Guru', url: 'https://crontab.guru' },
    ],
  },
  {
    title: '// research',
    links: [
      { label: 'Sploitus', url: 'https://sploitus.com' },
      { label: 'Exploit DB', url: 'https://exploit-db.com' },
      { label: '0day.today', url: 'https://0day.today' },
    ],
  },
];

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   Icons (inline SVG markup, matching the source design)
   ============================================================ */

const ICON_MARKUP: Record<string, string> = {
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0023.5 12C23.5 5.7 18.3.5 12 .5z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.3a1.7 1.7 0 110-3.5 1.7 1.7 0 010 3.5zM19 19h-3v-4.7c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3v-9h2.9v1.2h.05a3.2 3.2 0 012.9-1.6c3 0 3.6 2 3.6 4.6z"/></svg>',
  globe:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.5 2.6 3.9 6 4 9.5-.1 3.5-1.5 6.9-4 9.5-2.5-2.6-3.9-6-4-9.5.1-3.5 1.5-6.9 4-9.5z"/></svg>',
  arrow:
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};

/* ============================================================
   Forensic hex / memory dump background canvas
   ============================================================ */

function HexDump() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const FONT = 13;
    const ROW_H = 22;
    const BYTES = 16;
    const SPEED = prefersReduced ? 0 : 0.6;

    function byteAt(row: number, col: number) {
      let h = (Math.imul(row, 2654435761) + Math.imul(col, 40503) + 0x9e3779b9) >>> 0;
      h ^= h >>> 15;
      h = Math.imul(h, 2246822519) >>> 0;
      h ^= h >>> 13;
      return h & 0xff;
    }
    function isHot(row: number, col: number) {
      let h = (Math.imul(row, 374761393) + Math.imul(col, 668265263) + 0x85ebca6b) >>> 0;
      h ^= h >>> 13;
      return (h & 31) === 0;
    }

    const C_OFFSET = 'rgba(168,85,247,0.55)';
    const C_BYTE = 'rgba(196,186,214,0.30)';
    const C_ZERO = 'rgba(150,140,168,0.15)';
    const C_ASCII = 'rgba(168,158,186,0.26)';
    const C_BAND = 'rgba(168,85,247,0.07)';

    let W = 0,
      H = 0,
      dpr = 1,
      adv = 0,
      scrollPx = 0,
      rows = 0;
    let offsetW = 0,
      hexW = 0,
      panelW = 0,
      panels = 1,
      rowBytes = 16;

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + 'px';
      canvas!.style.height = H + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.font = FONT + "px 'JetBrains Mono', ui-monospace, monospace";
      ctx!.textBaseline = 'alphabetic';
      adv = ctx!.measureText('0').width || FONT * 0.6;
      rows = Math.ceil(H / ROW_H) + 2;

      offsetW = 9 * adv;
      hexW = BYTES * 3 * adv + adv;
      const asciiW = (BYTES + 2) * adv;
      const panelContent = offsetW + hexW + 2 * adv + asciiW;
      panelW = panelContent + 3.5 * adv;
      panels = Math.ceil(W / panelW) + 1;
      rowBytes = BYTES * panels;
    }
    build();

    const hex2 = (b: number) => b.toString(16).padStart(2, '0').toUpperCase();
    const hex8 = (n: number) => (n >>> 0).toString(16).padStart(8, '0').toUpperCase();

    function drawRow(absRow: number, y: number) {
      const centerBand = Math.abs(y - H / 2) < ROW_H * 0.55;
      if (centerBand) {
        ctx!.fillStyle = C_BAND;
        ctx!.fillRect(0, y - ROW_H + 6, W, ROW_H);
      }
      const boost = centerBand;

      for (let pnl = 0; pnl < panels; pnl++) {
        const px = pnl * panelW;
        const addr = absRow * rowBytes + pnl * BYTES;

        ctx!.fillStyle = C_OFFSET;
        ctx!.fillText(hex8(addr), px, y);

        let x = px + offsetW;
        let ascii = '';
        for (let col = 0; col < BYTES; col++) {
          if (col === 8) x += adv;
          const gcol = pnl * BYTES + col;
          const b = byteAt(absRow, gcol);
          if (isHot(absRow, gcol)) {
            const sh = 0.5 + 0.32 * Math.sin(now * 0.0022 + absRow * 7 + gcol * 13);
            ctx!.fillStyle = `rgba(216,180,254,${sh.toFixed(3)})`;
          } else if (b === 0) ctx!.fillStyle = C_ZERO;
          else ctx!.fillStyle = boost ? 'rgba(206,196,224,0.46)' : C_BYTE;
          ctx!.fillText(hex2(b), x, y);
          x += adv * 3;
          ascii += b >= 32 && b < 127 ? String.fromCharCode(b) : '.';
        }

        ctx!.fillStyle = boost ? 'rgba(180,170,198,0.40)' : C_ASCII;
        ctx!.fillText('|' + ascii + '|', px + offsetW + hexW + 2 * adv, y);
      }
    }

    let raf = 0,
      last = 0,
      now = 0;
    const interval = 1000 / 30;
    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      if (t - last < interval) return;
      last = t;
      now = t;

      scrollPx += SPEED;
      ctx!.clearRect(0, 0, W, H);
      ctx!.font = FONT + "px 'JetBrains Mono', ui-monospace, monospace";

      const baseRow = Math.floor(scrollPx / ROW_H);
      const shift = scrollPx % ROW_H;
      for (let i = 0; i < rows; i++) {
        const y = i * ROW_H - shift + FONT;
        drawRow(baseRow + i, y);
      }
    }
    raf = requestAnimationFrame(frame);

    let rt: number;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(build, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas id="matrix" ref={canvasRef} />;
}

/* ============================================================
   Scramble / decode heading
   ============================================================ */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\=+*#$%@!{}[]';

function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = text;
    if (reducedMotion) return;

    let raf = 0;
    let done = false;
    const run = () => {
      const dur = 620;
      const start = performance.now();
      const chars = text.split('');
      const tick = (nowTs: number) => {
        const t = Math.min(1, (nowTs - start) / dur);
        let out = '';
        for (let i = 0; i < chars.length; i++) {
          if (chars[i] === ' ') {
            out += ' ';
            continue;
          }
          const reveal = i / chars.length;
          if (t >= reveal + 0.15) out += chars[i];
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (t < 1) raf = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done) {
          done = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [text]);

  return <span className="scramble" ref={ref} />;
}

/* ============================================================
   Reveal-on-scroll wrapper
   ============================================================ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in');
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ============================================================
   Hero terminal typing
   ============================================================ */

function HeroTerminal() {
  const termRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const term = termRef.current;
    if (!body || !term) return;

    body.innerHTML = '';

    const socOut = social
      .map(
        (s) =>
          `<a class="soc" href="${s.url}" target="_blank" rel="noopener" data-link>${ICON_MARKUP[s.icon]}<span>${s.name}</span></a>`
      )
      .join('');

    const PROMPT =
      '<span class="prompt-user">visitor</span><span class="prompt-sym">@</span><span class="prompt-host">whyn0t</span><span class="prompt-sym">:</span><span class="prompt-path">~</span><span class="prompt-sym">$</span> ';

    type Step =
      | { type: 'cmd'; text: string }
      | { type: 'html'; html: string }
      | { type: 'final' };

    const steps: Step[] = [
      { type: 'cmd', text: 'whoami' },
      { type: 'html', html: `<div class="hero-name">${identity.name}</div>` },
      { type: 'cmd', text: 'cat role.txt' },
      {
        type: 'html',
        html: `<div class="hero-role">${identity.headline}</div><div class="hero-sub">${identity.tagline}</div>`,
      },
      { type: 'cmd', text: 'ls ./connect' },
      {
        type: 'html',
        html: `<div class="hero-actions">${socOut}<a class="cta" href="#projects" data-link>./view --work ${ICON_MARKUP.arrow}</a></div>`,
      },
      { type: 'final' },
    ];

    const timers: number[] = [];
    let si = 0;

    const addLine = (html: string) => {
      const d = document.createElement('div');
      d.className = 'tline';
      d.innerHTML = html;
      body.appendChild(d);
      return d;
    };

    const nextStep = () => {
      if (si >= steps.length) return;
      const step = steps[si++];
      if (step.type === 'cmd') {
        const lineEl = addLine(PROMPT + '<span class="typed"></span><span class="caret"></span>');
        const typedSpan = lineEl.querySelector('.typed') as HTMLElement;
        const caret = lineEl.querySelector('.caret') as HTMLElement;
        let ci = 0;
        const speed = reducedMotion ? 0 : 42;
        const typeChar = () => {
          if (ci <= step.text.length) {
            typedSpan.textContent = step.text.slice(0, ci);
            ci++;
            if (reducedMotion) {
              typedSpan.textContent = step.text;
              caret.remove();
              timers.push(window.setTimeout(nextStep, 60));
              return;
            }
            timers.push(window.setTimeout(typeChar, speed + Math.random() * 40));
          } else {
            caret.remove();
            timers.push(window.setTimeout(nextStep, 230));
          }
        };
        typeChar();
      } else if (step.type === 'html') {
        const d = addLine(step.html);
        d.style.opacity = '0';
        d.style.transition = 'opacity .35s ease';
        requestAnimationFrame(() => {
          d.style.opacity = '1';
        });
        timers.push(window.setTimeout(nextStep, reducedMotion ? 40 : 360));
      } else {
        addLine(PROMPT + '<span class="caret"></span>');
      }
    };
    nextStep();

    const skip = () => {
      if (si >= steps.length) return;
      timers.forEach(clearTimeout);
      body.innerHTML = '';
      steps
        .filter((s) => s.type !== 'final')
        .forEach((s) => {
          if (s.type === 'cmd') addLine(PROMPT + `<span class="typed">${s.text}</span>`);
          else if (s.type === 'html') addLine(s.html);
        });
      addLine(PROMPT + '<span class="caret"></span>');
      si = steps.length;
    };

    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a')) return;
      if (si < steps.length) skip();
    };
    term.addEventListener('click', onClick);

    return () => {
      timers.forEach(clearTimeout);
      term.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="term hero-term" ref={termRef}>
      <div className="term-bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="term-title">
          <b>tiago</b>@portfolio: ~ — zsh
        </span>
      </div>
      <div className="term-body" ref={bodyRef} />
    </div>
  );
}

/* ============================================================
   Custom cursor
   ============================================================ */

function useCustomCursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('cursor-custom');
    const cursorEl = document.createElement('div');
    cursorEl.className = 'cursor hidden';
    document.body.appendChild(cursorEl);

    let x = innerWidth / 2,
      y = innerHeight / 2,
      tx = x,
      ty = y;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      cursorEl.classList.remove('hidden');
    };
    const onLeave = () => cursorEl.classList.add('hidden');
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    const onOver = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a, button, [data-link]');
      cursorEl.classList.toggle('link', !!link);
    };
    document.addEventListener('mouseover', onOver);

    let raf = 0;
    const loop = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      cursorEl.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onOver);
      cursorEl.remove();
      document.documentElement.classList.remove('cursor-custom');
    };
  }, []);
}

/* ============================================================
   Header / navigation
   ============================================================ */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const observers: IntersectionObserver[] = [];
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActive(id);
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      io.observe(el);
      observers.push(io);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="wrap nav">
        <a className="logo" href="#hero" data-link>
          &gt;&nbsp;WhyN0t<span className="b" />
        </a>
        <nav className="nav-desktop">
          <ul>
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a
                  className={`lnk ${active === id ? 'active' : ''}`}
                  href={`#${id}`}
                  data-sec={id}
                  data-link
                >
                  <span className="slash">~/</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="status">
          <span className="led" />
          Leiria · Portugal
        </div>
        <button
          className="burger"
          aria-label="Toggle menu"
          data-link
          onClick={() => setMobileOpen((o) => !o)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <ul>
          {navItems.map(({ id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                data-sec={id}
                className={active === id ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                ~/{id}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

/* ============================================================
   Projects — ls -la file browser
   ============================================================ */

function ProjectsSection() {
  const [activeCat, setActiveCat] = useState<Category>('All');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const ref = useReveal<HTMLElement>();

  const items = activeCat === 'All' ? projects : projects.filter((p) => p.category === activeCat);
  const filterFlag = activeCat === 'All' ? '' : ` --filter=${CATMAP[activeCat as CategoryName].owner}`;

  return (
    <section className="block reveal" id="projects" ref={ref}>
      <div className="wrap">
        <h2 className="sec-head">
          <span className="p">visitor@whyn0t:~$</span>
          <span className="cmd">cd</span>
          <ScrambleText text="~/projects" />
        </h2>
        <div className="term proj-term">
          <div className="term-bar">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span className="term-title">
              <b>tiago</b>@portfolio: ~/projects
            </span>
          </div>
          <div className="proj-cmd">
            <span className="prompt-user" style={{ color: 'var(--dev)' }}>
              tiago@portfolio
            </span>
            :<span className="prompt-path">~/projects</span>$&nbsp;
            <span>ls</span>&nbsp;<span className="flag">-la</span>
            <span className="flag">{filterFlag}</span>
            <span className="total">total {items.length}</span>
          </div>
          <div className="filters">
            {categories.map((c) => {
              const cnt = c === 'All' ? projects.length : projects.filter((p) => p.category === c).length;
              return (
                <button
                  key={c}
                  className={`filter ${c === activeCat ? 'active' : ''}`}
                  data-cat={c}
                  data-link
                  onClick={() => setActiveCat(c)}
                >
                  <span className="dot" />
                  {c.toLowerCase()}
                  <span className="cnt">{cnt}</span>
                </button>
              );
            })}
          </div>
          <div className="file-list">
            {items.map((p) => {
              const cm = CATMAP[p.category];
              const isOpen = !!open[p.slug];
              return (
                <div className={`file ${isOpen ? 'open' : ''}`} data-cat={p.category} key={p.slug}>
                  <button
                    className="file-row"
                    data-link
                    aria-expanded={isOpen}
                    onClick={() => setOpen((o) => ({ ...o, [p.slug]: !o[p.slug] }))}
                  >
                    <span className="f-perm">
                      -rwx<span className="x">r-x</span>r--
                    </span>
                    <span className="f-cat">{cm.owner}</span>
                    <span className="f-tags">{p.skills.length} tags</span>
                    <span className="f-name">
                      {p.slug}
                      <span className={cm.cls}>{cm.ext}</span>
                    </span>
                    <span className="f-chevron">
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                  <div className="file-detail" style={{ height: isOpen ? 'auto' : 0 }}>
                    <div className="file-detail-inner">
                      <h3 className="fd-title">{p.title}</h3>
                      {p.association && <p className="fd-assoc"># {p.association}</p>}
                      <p className="fd-desc">{p.description}</p>
                      <div className="fd-skills">
                        {p.skills.map((s) => (
                          <span className="fd-skill" key={s}>
                            {s.replace(/\s+/g, '_').replace(/[.#]/g, '')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   App
   ============================================================ */

function App() {
  const [showTop, setShowTop] = useState(false);
  const aboutRef = useReveal<HTMLElement>();
  const expRef = useReveal<HTMLElement>();
  const eduRef = useReveal<HTMLElement>();

  useCustomCursor();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <HexDump />
      <div className="bg-veil" />
      <div className="bg-scan" />

      <Header />

      <main>
        {/* HERO */}
        <section id="hero">
          <div className="wrap hero-grid">
            <HeroTerminal />
          </div>
          <div className="scroll-hint">
            <span>scroll</span>
            <span className="line" />
          </div>
        </section>

        <div className="below">
          {/* ABOUT */}
          <section className="block reveal" id="about" ref={aboutRef}>
            <div className="wrap">
              <h2 className="sec-head">
                <span className="p">visitor@whyn0t:~$</span>
                <span className="cmd">cat</span>
                <ScrambleText text="about.md" />
              </h2>
              <div className="about-card">
                <p className="eyebrow">// readme</p>
                <p className="about-body">
                  <strong>Computer Engineer</strong> with an MSc in{' '}
                  <strong>Cybersecurity &amp; Digital Forensics</strong>. My work has focused on
                  malware development and analysis, forensic investigation, secure network design,
                  and penetration testing, all through hands-on projects that replicate real-world
                  attack and defence scenarios.
                </p>
                <div className="about-tags">
                  <span className="about-tag">
                    <span className="h">domain:</span> malware-analysis
                  </span>
                  <span className="about-tag">
                    <span className="h">domain:</span> digital-forensics
                  </span>
                  <span className="about-tag">
                    <span className="h">domain:</span> network-security
                  </span>
                  <span className="about-tag">
                    <span className="h">domain:</span> pentesting
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section className="block reveal" id="experience" ref={expRef}>
            <div className="wrap">
              <h2 className="sec-head">
                <span className="p">visitor@whyn0t:~$</span>
                <span className="cmd">cd</span>
                <ScrambleText text="~/experience" />
              </h2>
              <div className="term section-term">
                <div className="term-bar">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="term-title">
                    <b>tiago</b>@portfolio: ~/experience
                  </span>
                </div>
                <div className="section-cmd">
                  <span className="prompt-user">tiago@portfolio</span>
                  <span className="prompt-sym">:</span>
                  <span className="prompt-path">~/experience</span>
                  <span className="prompt-sym">$</span>
                  <span>cat</span>
                  <span className="flag">experience.log</span>
                </div>
                <div className="term-pad">
                  <div className="timeline">
                    {experience.map((e, i) => (
                      <div className={`tl-item ${e.type === 'secondary' ? 'secondary' : ''}`} key={i}>
                        <div className="tl-dot">
                          <i />
                        </div>
                        <div className="tl-card">
                          <div className="tl-top">
                            <h3 className="tl-title">{e.title}</h3>
                            <span className="tl-period">{e.period}</span>
                          </div>
                          <p className="tl-org">{e.organisation}</p>
                          {e.location && <p className="tl-loc">{e.location}</p>}
                          <ul className="tl-bullets">
                            {e.bullets.map((b, j) => (
                              <li key={j}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* EDUCATION */}
          <section className="block reveal" id="education" ref={eduRef}>
            <div className="wrap">
              <h2 className="sec-head">
                <span className="p">visitor@whyn0t:~$</span>
                <span className="cmd">cd</span>
                <ScrambleText text="~/education" />
              </h2>
              <div className="term section-term">
                <div className="term-bar">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="term-title">
                    <b>tiago</b>@portfolio: ~/education
                  </span>
                </div>
                <div className="section-cmd">
                  <span className="prompt-user">tiago@portfolio</span>
                  <span className="prompt-sym">:</span>
                  <span className="prompt-path">~/education</span>
                  <span className="prompt-sym">$</span>
                  <span>cat</span>
                  <span className="flag">education.json</span>
                </div>
                <div className="term-pad">
                  <div className="edu-grid">
                    {education.map((e, i) => (
                      <div className="edu-card" key={i}>
                        <span className="edu-badge">{e.degree}</span>
                        <h3 className="edu-degree">{e.field}</h3>
                        <p className="edu-school">{e.school}</p>
                        <p className="edu-period">{e.period}</p>
                        <p className="edu-focus">
                          <b>Focus:</b> {e.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <ProjectsSection />

          {/* FOOTER */}
          <footer>
            <div className="wrap foot-term">
              <p className="foot-line">
                <span className="c">visitor@whyn0t</span>:~$ cat ~/.bookmarks
              </p>
              <div className="foot-cols">
                {footerCols.map((col) => (
                  <div className="foot-col" key={col.title}>
                    <h4>{col.title}</h4>
                    {col.links.map((l) => (
                      <a key={l.label} href={l.url} target="_blank" rel="noopener" data-link>
                        {l.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
              <div className="foot-bottom">
                <span># © {new Date().getFullYear()} Tiago Pereira</span>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <button
        className={`totop ${showTop ? 'show' : ''}`}
        aria-label="Scroll to top"
        data-link
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </>
  );
}

export default App;
