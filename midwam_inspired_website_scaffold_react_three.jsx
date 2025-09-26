import { useEffect, useMemo, useRef, useState } from "react";
// Midwam‑inspired scaffold: hero with 3D motif, strong typography, section reveals, bilingual toggle
// Notes:
// • This is an original layout inspired by midwam.com, not a clone. Replace all placeholder text and assets.
// • Tech: React + Tailwind (assumed), Three.js for hero object, GSAP (optional) for scroll reveals.
// • Pages/sections: Home (hero), Experiences, About, News, Contact. Basic routerless anchors.
// • RTL support demo for Arabic titles; expand for full i18n as needed.

// If you use this in a Next.js app, move the component into a page, load Tailwind, and install three + gsap.
// npm i three gsap

export default function MidwamInspiredSite() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = useMemo(() => (lang === 'en' ? en : ar), [lang]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Inject Google Fonts (Inter for body, Outfit for headings)
  useEffect(() => {
    const href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;600;700&display=swap';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-[Inter,system-ui,sans-serif]">
      <TopBar lang={lang} setLang={setLang} />
      <Header t={t} />
      <Hero t={t} />
      <Experiences t={t} />
      <About t={t} />
      <News t={t} />
      <Contact t={t} />
      <SiteFooter t={t} />
    </div>
  );
}

function TopBar({ lang, setLang }: { lang: 'en' | 'ar'; setLang: (l: 'en' | 'ar') => void }) {
  return (
    <div className="bg-slate-900 text-white text-xs md:text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <span className="opacity-90">Immersive Experience Studio — Brand & UX Systems</span>
        <div className="inline-flex items-center gap-2">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-white text-slate-900' : 'bg-white/10'}`}
          >EN</button>
          <button
            onClick={() => setLang('ar')}
            className={`px-2 py-1 rounded ${lang === 'ar' ? 'bg-white text-slate-900' : 'bg-white/10'}`}
          >العربية</button>
        </div>
      </div>
    </div>
  );
}

function Header({ t }: { t: Dict }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 font-semibold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l9 4.5v10L12 22l-9-5.5v-10L12 2z"/></svg>
            <span>Made of Magic</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#experiences" className="hover:text-slate-600">{t.nav.experiences}</a>
            <a href="#about" className="hover:text-slate-600">{t.nav.about}</a>
            <a href="#news" className="hover:text-slate-600">{t.nav.news}</a>
            <a href="#contact" className="hover:text-slate-600">{t.nav.contact}</a>
            <a href="#contact" className="inline-flex items-center px-3 py-2 rounded-xl bg-[#22c55e] text-white hover:bg-[#16a34a]">{t.nav.cta}</a>
          </nav>
          <button onClick={() => setOpen(v=>!v)} className="md:hidden w-10 h-10 rounded-xl border inline-flex items-center justify-center" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <div className="max-w-7xl mx-auto px-4 py-3 grid gap-2 text-sm">
            <a href="#experiences" onClick={()=>setOpen(false)}>{t.nav.experiences}</a>
            <a href="#about" onClick={()=>setOpen(false)}>{t.nav.about}</a>
            <a href="#news" onClick={()=>setOpen(false)}>{t.nav.news}</a>
            <a href="#contact" onClick={()=>setOpen(false)}>{t.nav.contact}</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ t }: { t: Dict }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const THREE = await import('three');
      const { Scene, PerspectiveCamera, WebGLRenderer, Mesh, MeshStandardMaterial, TorusKnotGeometry, DirectionalLight, AmbientLight, Color } = THREE;
      const scene = new Scene();
      scene.background = new Color('#0f172a'); // slate-900

      const sizes = { w: canvasRef.current!.clientWidth, h: canvasRef.current!.clientHeight };
      const camera = new PerspectiveCamera(35, sizes.w / sizes.h, 0.1, 100);
      camera.position.set(0, 0, 8);

      const renderer = new WebGLRenderer({ canvas: canvasRef.current!, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(sizes.w, sizes.h);

      const geometry = new TorusKnotGeometry(1.3, 0.45, 220, 24);
      const material = new MeshStandardMaterial({ metalness: 0.7, roughness: 0.15, color: 0xffffff });
      const knot = new Mesh(geometry, material);
      scene.add(knot);

      const dir = new DirectionalLight(0xffffff, 1.2);
      dir.position.set(2, 3, 4);
      scene.add(dir);
      scene.add(new AmbientLight(0xffffff, 0.25));

      const onResize = () => {
        const { clientWidth: w, clientHeight: h } = canvasRef.current!;
        camera.aspect = w / h; camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      let raf = 0;
      const tick = () => {
        knot.rotation.x += 0.005;
        knot.rotation.y += 0.0075;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();

      cleanup = () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); renderer.dispose(); geometry.dispose(); material.dispose(); };
    })();

    return () => { cleanup && cleanup(); };
  }, []);

  useEffect(() => {
    // Optional: GSAP section reveal
    import('gsap').then(({ gsap }) => {
      gsap.from('[data-reveal]', { opacity: 0, y: 24, duration: 0.8, stagger: 0.08, ease: 'power2.out', delay: 0.15 });
    }).catch(() => {});
  }, []);

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 items-center gap-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-[Outfit,Inter,sans-serif]" data-reveal>
            {t.hero.title}
          </h1>
          <p className="mt-4 text-slate-200 max-w-prose" data-reveal>
            {t.hero.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3" data-reveal>
            <a href="#experiences" className="inline-flex items-center px-4 py-2 rounded-xl bg-[#22c55e] text-white hover:bg-[#16a34a]">{t.hero.ctaPrimary}</a>
            <a href="#contact" className="inline-flex items-center px-4 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10">{t.hero.ctaSecondary}</a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl ring-1 ring-white/10 shadow-2xl overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" aria-label="Animated 3D motif" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Experiences({ t }: { t: Dict }) {
  const cards = t.experiences.items;
  return (
    <section id="experiences" className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-[Outfit,Inter,sans-serif]">{t.experiences.title}</h2>
        <p className="mt-3 text-slate-600 max-w-prose">{t.experiences.copy}</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <article key={c.title} className="rounded-2xl border p-6 bg-white shadow-sm">
              <div className="aspect-[4/3] rounded-xl bg-slate-100 mb-4" />
              <h3 className="text-lg font-semibold font-[Outfit,Inter,sans-serif]">{c.title}</h3>
              <p className="mt-2 text-slate-600">{c.desc}</p>
              <div className="mt-4 text-xs text-slate-500">{c.meta}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About({ t }: { t: Dict }) {
  return (
    <section id="about" className="bg-slate-50 border-y">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-5 gap-10 items-start">
        <div className="md:col-span-2">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-[Outfit,Inter,sans-serif]">{t.about.title}</h2>
          <p className="mt-4 text-slate-600">{t.about.copy}</p>
        </div>
        <div className="md:col-span-3 grid sm:grid-cols-3 gap-4">
          {t.about.stats.map((s) => (
            <div key={s.k} className="rounded-2xl border p-5 bg-white">
              <div className="text-sm text-slate-500">{s.k}</div>
              <div className="text-2xl font-semibold">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function News({ t }: { t: Dict }) {
  return (
    <section id="news" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-[Outfit,Inter,sans-serif]">{t.news.title}</h2>
        <p className="mt-3 text-slate-600 max-w-prose">{t.news.copy}</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {t.news.items.map((n) => (
            <article key={n.title} className="rounded-2xl border p-6 bg-white shadow-sm">
              <div className="text-xs text-slate-500">{n.date}</div>
              <h3 className="mt-2 text-lg font-semibold">{n.title}</h3>
              <p className="mt-2 text-slate-600">{n.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ t }: { t: Dict }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [ok, setOk] = useState(false);
  return (
    <section id="contact" className="bg-slate-50 border-t">
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-[Outfit,Inter,sans-serif]">{t.contact.title}</h2>
          <p className="mt-3 text-slate-600">{t.contact.copy}</p>
        </div>
        <form className="mt-8 grid gap-4 max-w-2xl" onSubmit={(e)=>{e.preventDefault(); setOk(true);}}>
          <label className="grid gap-1">
            <span className="text-sm font-medium">{t.form.name}</span>
            <input className="rounded-xl border px-3 py-2" value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">{t.form.email}</span>
            <input type="email" className="rounded-xl border px-3 py-2" value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">{t.form.message}</span>
            <textarea rows={5} className="rounded-xl border px-3 py-2" value={form.message} onChange={e=>setForm({...form, message: e.target.value})}/>
          </label>
          <button className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#22c55e] text-white hover:bg-[#16a34a]">{t.form.submit}</button>
          {ok && <p className="text-green-700 text-sm" role="status">{t.form.ok}</p>}
        </form>
      </div>
    </section>
  );
}

function SiteFooter({ t }: { t: Dict }) {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-semibold">Made of Magic</div>
          <p className="mt-2 text-slate-600 max-w-prose">{t.footer.copy}</p>
        </div>
        <div>
          <div className="font-semibold">{t.footer.links}</div>
          <ul className="mt-2 grid gap-2 text-slate-600">
            <li><a href="#about" className="hover:text-slate-900">{t.nav.about}</a></li>
            <li><a href="#experiences" className="hover:text-slate-900">{t.nav.experiences}</a></li>
            <li><a href="#news" className="hover:text-slate-900">{t.nav.news}</a></li>
            <li><a href="#contact" className="hover:text-slate-900">{t.nav.contact}</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">{t.footer.contact}</div>
          <ul className="mt-2 grid gap-1 text-slate-600">
            <li>hello@yourbrand.com</li>
            <li>+1 (555) 555‑5555</li>
            <li>Riyadh • Dubai • Remote</li>
          </ul>
        </div>
      </div>
      <div className="border-t text-xs text-slate-500 py-6 text-center">© {new Date().getFullYear()} Made of Magic. {t.footer.rights}</div>
    </footer>
  );
}

// --- Simple i18n dictionaries ---

type Dict = typeof en;

const en = {
  nav: { experiences: 'Experiences', about: 'About', news: 'News', contact: 'Contact', cta: 'Request a Consult' },
  hero: {
    title: 'Creating Unified, Future‑Proofed Brands',
    subtitle: 'One source of truth for your teams and their AI.',
    ctaPrimary: 'See Offerings',
    ctaSecondary: 'Contact Us',
  },
  experiences: {
    title: 'Core offerings',
    copy: 'Systemized brand and UX foundations that unify portfolios today and make them AI‑ready for tomorrow.',
    items: [
      { title: 'Brand Strategy Blueprint', desc: 'Assessment, competitive scan, portfolio architecture, and foundational brand system (mission, vision, positioning, voice, tone, taglines). Executive alignment workshops to define Brand DNA & values; investor‑ready narrative and unification roadmap.', meta: 'Deliverable: Brand Strategy Playbook' },
      { title: 'UX & Journey Architecture', desc: 'Cross‑brand UX audits, information architecture restructuring, persona‑based journeys (Healthcare, SMB, Imaging, Lease→Build), content and messaging direction, and conversion opportunities.', meta: 'Deliverable: UX Architecture Toolkit' },
      { title: 'Integration & Roadmap Layer', desc: 'Cross‑brand connectivity concepts and shared design‑system guardrails (voice, tone, UX patterns). Tactical quick wins now, with a 5‑year brand‑unification roadmap.', meta: 'Deliverable: Integration & Roadmap Deck' },
      { title: 'AI‑Ready Brand & UX Spec', desc: 'Machine‑readable brand rules (taxonomy, metadata, component specs), voice & tone matrices for emotional AI, structured content schema (FAQ/HowTo/Product) and JSON journeys/site maps for direct AI ingest.', meta: 'Deliverable: AI‑Ready Spec Pack' },
    ],
  },
  about: {
    title: 'Brand architecture + AI‑ready systems',
    copy: 'Made of Magic builds the backbone of your brand: a durable source of truth that aligns teams, simplifies decisions, and plugs directly into AI assistants and tools.',
    stats: [ { k: 'Clients aligned', v: '50+' }, { k: 'Brand systems', v: '80+' }, { k: 'Avg. NPS', v: '9.2/10' } ],
  },
  news: {
    title: 'Updates',
    copy: 'Highlights from recent deliverables and platform improvements.',
    items: [
      { title: 'AI‑Ready Spec Pack v2 shipped', date: '2025‑08‑30', desc: 'Expanded JSON schemas for journeys, site maps, and tone matrices.' },
      { title: 'Portfolio unification win', date: '2025‑07‑18', desc: 'Cross‑brand IA reduces duplicate content by 34% while improving findability.' },
      { title: 'R&D note: Conversion heuristics', date: '2025‑06‑10', desc: 'A lightweight checklist to uncover fast wins on legacy pages.' },
    ],
  },
  contact: { title: 'Contact', copy: 'Request a consult or a walkthrough of the AI‑Ready Spec Pack.' },
  form: { name: 'Name', email: 'Email', message: 'Message', submit: 'Send', ok: 'Thanks — we will be in touch shortly.' },
  footer: { copy: 'We create unified, future‑proofed brands — one source of truth for your teams and their AI.', links: 'Links', contact: 'Contact', rights: 'All rights reserved.' },
};

const ar: typeof en = {
  nav: { experiences: 'التجارب', about: 'من نحن', news: 'الأخبار', contact: 'اتصل بنا', cta: 'احجز زيارة' },
  hero: {
    title: 'نتحدى الواقع بتجارب غامرة تتمحور حول الإنسان',
    subtitle: 'نصمم وننفذ بيئات متعددة الحواس تمزج بين العالمين المادي والرقمي واللمسات البشرية.',
    ctaPrimary: 'استكشف التجارب',
    ctaSecondary: 'تواصل معنا',
  },
  experiences: {
    title: 'مختارات من التجارب',
    copy: 'محفظة متعددة التخصصات تشمل الثقافة والطيران والموسيقى والمنشآت العامة.',
    items: [
      { title: 'مناطق مهرجان الموسيقى', desc: 'تصميم وتنفيذ تجارب متعددة المناطق بتدفق يركز على الإنسان.', meta: 'أكثر من 5 مناطق تفاعلية · برنامج لمدة 3 أيام' },
      { title: 'رحلة تراث شركة الطيران', desc: 'سرد متحفي يمزج الأرشيف مع محطات تفاعلية.', meta: 'معارض مادية + تفاعلية' },
      { title: 'إسقاطات ثقافية على المباني', desc: 'حكايات سمعية‑بصرية على نطاق واسع عبر عمارة تاريخية.', meta: 'إسقاط خرائط · فن عام' },
    ],
  },
  about: {
    title: 'تصميم تجارب شمولي',
    copy: 'نحفّز الحواس لتوسيع الانتباه والإبداع والمعنى — ونبحث عن حلول تُحدث قيمة للاقتصادات الناشئة بينما نستمتع بعملنا.',
    stats: [ { k: 'السنوات', v: '٨+' }, { k: 'المشاريع', v: '١٥٠+' }, { k: 'الجوائز', v: 'SOTD × 3' } ],
  },
  news: {
    title: 'الأخبار والتحديثات',
    copy: 'أبرز الإطلاقات وإعلانات الاستوديو الأخيرة.',
    items: [
      { title: 'افتتاح مركز البحث والتطوير للزوار', date: '2025‑05‑12', desc: 'مخبرنا الرقمي يفتح أبوابه للزيارات الموجهة للشركاء والطلاب.' },
      { title: 'تتويج تعاون مهرجاني بتقدير صناعي', date: '2025‑03‑02', desc: 'إنتاج متعدد التخصصات مُحتفى به على نطاقه وشموليته.' },
      { title: 'إطلاق مشروع تراثي غامر في الخارج', date: '2025‑01‑21', desc: 'سرد ثقافي عبر إسقاطات متعددة الأسطح.' },
    ],
  },
  contact: { title: 'اتصل بنا', copy: 'احجز جولة في مركزنا التفاعلي أو ابدأ مشروعاً.' },
  form: { name: 'الاسم', email: 'البريد الإلكتروني', message: 'الرسالة', submit: 'إرسال', ok: 'شكراً — سنتواصل معك قريباً.' },
  footer: { copy: 'نحوّل المساحات بتجارب مُصمّمة ونُضفي الطابع الإنساني على التقنية التفاعلية.', links: 'روابط', contact: 'تواصل', rights: 'جميع الحقوق محفوظة.' },
};
