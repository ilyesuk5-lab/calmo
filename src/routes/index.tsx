import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles, Leaf, ShieldCheck, Zap, Heart,
  Package, Sun, Check, X, Star, Phone, Facebook, Instagram, MessageCircle,
  Clock, MapPin, Minus, Plus, Loader2, ChevronLeft, ChevronRight,
  AlertTriangle, Truck, Award, Moon, Coffee, Info
} from "lucide-react";
import desertHeroImg from "@/assets/calmo-desert-hero.jpg";
import infographicImg from "@/assets/calmo-infographic.jpg";
import botanicalImg from "@/assets/calmo-botanical.jpg";
import productImg from "@/assets/calmo-product.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";
import { WILAYAS } from "@/lib/wilayas";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

/* ---------- helpers ---------- */
const fmtDZD = (n: number) => `${n.toLocaleString("fr-DZ")} دج`;
const OFFICIAL_WHATSAPP = "+213 796 02 85 88";
const OFFICIAL_WA_NUMBER = "213796028588";
const DELIVERY_FEE = 500;

const SOCIAL_NAMES = [
  { name: "أحمد", city: "قسنطينة" },
  { name: "فاطمة", city: "الجزائر العاصمة" },
  { name: "يوسف", city: "وهران" },
  { name: "نادية", city: "عنابة" },
  { name: "محمد", city: "سطيف" },
  { name: "سارة", city: "تلمسان" },
  { name: "إلياس", city: "باتنة" },
  { name: "مريم", city: "البليدة" },
];

/* ---------- live social proof + visitors ---------- */
function LiveSocialProof() {
  const [idx, setIdx] = useState(0);
  const [visitors, setVisitors] = useState(() => 18 + Math.floor(Math.random() * 14));

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SOCIAL_NAMES.length);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setVisitors(16 + Math.floor(Math.random() * 15));
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const p = SOCIAL_NAMES[idx];
  return (
    <div className="sticky top-0 z-40 w-full bg-sahara-dark text-gold py-2 px-3 text-center text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] border-b border-gold/25 uppercase sahara-pattern">
      <span className="relative inline-flex items-center justify-center gap-1.5 sm:gap-2 z-10">
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gold" />
        </span>
        <span><b>{visitors}</b> زائر يتصفح الآن</span>
        <span className="hidden sm:inline opacity-50 mx-2">•</span>
        <span key={p.name} className="hidden sm:inline opacity-90">{p.name} من {p.city} طلب شاي CALMO</span>
      </span>
    </div>
  );
}

/* ---------- countdown ---------- */
function Countdown() {
  const [secs, setSecs] = useState(12 * 3600);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s <= 0 ? 12 * 3600 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return (
    <div className="bg-sand-dark py-5 md:py-8 px-4 border-y border-gold/20 sahara-pattern sahara-pattern-light">
      <div className="container mx-auto flex items-center justify-between gap-3 max-w-3xl">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="relative z-10 w-9 h-9 md:w-10 md:h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sahara shrink-0 border border-gold/20">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-sahara" />
          </div>
          <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.15em] md:tracking-widest text-ink truncate">
            عرض التوفير ينتهي بعد
          </span>
        </div>
        <div className="flex gap-1.5 md:gap-3 text-lg md:text-3xl font-black text-ink tabular-nums shrink-0">
          <div className="flex flex-col items-center min-w-[2ch]"><span>{h}</span><span className="text-[7px] md:text-[8px] text-muted-foreground font-bold uppercase mt-0.5">ساعة</span></div>
          <span className="text-gold leading-none">:</span>
          <div className="flex flex-col items-center min-w-[2ch]"><span>{m}</span><span className="text-[7px] md:text-[8px] text-muted-foreground font-bold uppercase mt-0.5">دقيقة</span></div>
          <span className="text-gold leading-none">:</span>
          <div className="flex flex-col items-center min-w-[2ch]"><span>{s}</span><span className="text-[7px] md:text-[8px] text-muted-foreground font-bold uppercase mt-0.5">ثانية</span></div>
        </div>
      </div>
    </div>
  );
}

/* ---------- hero ---------- */
function Hero() {
  const { settings } = useStore();
  const c = settings?.content;
  const scrollOrder = () =>
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="bg-sahara-warm text-ink relative overflow-hidden sahara-pattern">
      <div className="relative z-10 container mx-auto px-5 pt-8 pb-12 md:py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* image */}
          <div className="flex justify-center md:order-2 fade-in-up">
            <div className="relative">
              <div className="absolute -inset-6 md:-inset-10 rounded-full bg-gold/25 blur-3xl dust-shimmer" />
              <img
                src={desertHeroImg}
                alt="CALMO — Thé aux herbes"
                width={650}
                height={650}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="relative rounded-3xl shadow-sahara-lg w-full max-w-[320px] sm:max-w-md md:max-w-lg mx-auto object-cover aspect-square border border-gold/30 glow-sahara"
              />
              <div className="absolute -bottom-3 -right-3 bg-sahara-dark text-gold text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl border border-gold/40 shadow-sahara flex items-center gap-1.5">
                <span>🇩🇿 صنع في الجزائر</span>
              </div>
            </div>
          </div>

          {/* content */}
          <div className="text-center md:text-right fade-in-up md:order-1">
            <span className="inline-block py-1 px-4 rounded-full border border-sahara/40 text-sahara text-[9px] md:text-[10px] font-black tracking-[0.25em] mb-4 md:mb-6 bg-white/80 backdrop-blur shadow-sahara">
              {c?.hero_badge || "CALMO — THÉ AUX HERBES"}
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-3 md:mb-4 text-ink leading-none">
              {c?.hero_title || "CALMO"}
            </h1>
            <p className="text-base md:text-xl font-bold text-gold mb-2 md:mb-3">
              {c?.hero_subtitle || "شاي الأعشاب الفاخر — Thé aux herbes"}
            </p>
            <p className="text-gold/90 font-medium italic text-sm md:text-base mb-4 md:mb-5">
              {c?.hero_tagline || "حليفك الطبيعي للهضم والهدوء — Votre allié naturel pour la digestion & le calme"}
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-md mx-auto md:mx-0 mb-6 md:mb-8">
              {c?.hero_description || "مزيج فاخر ومختار بعناية من الأعشاب الطبيعية 100% صُمم ليمنحك تجربة استرخاء فريدة وراحة تامة للقولون والجهاز الهضمي. خالٍ من الكافيين ومثالي لجميع أوقات اليوم وقبل النوم."}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2 mb-8 md:mb-10">
              {(c?.hero_badges && c.hero_badges.length > 0
                ? c.hero_badges
                : ["طبيعي 100%", "20 كيس شاي", "خالٍ من الكافيين", "صُنع في الجزائر 🇩🇿", "معايير BPF"]
              ).map((t) => (
                <span key={t} className="text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 bg-white/90 border border-gold/20 rounded-lg text-ink shadow-sahara">
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={scrollOrder}
              className="w-full max-w-sm md:w-auto md:px-10 btn-gold py-4 md:py-5 rounded-2xl text-lg active:scale-95 cursor-pointer"
            >
              {c?.hero_cta || "اطلب CALMO الآن"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- gallery carousel ---------- */
const GALLERY = [
  { src: desertHeroImg, caption: "CALMO — شاي الأعشاب الفاخر في قلب الصحراء الجزائرية 🇩🇿" },
  { src: infographicImg, caption: "علبة CALMO الرسمية — 20 كيس شاي طبيعي 100% ومعايير BPF" },
  { src: botanicalImg, caption: "مكونات نباتية منتقاة بعناية لراحة القولون والاسترخاء التام" },
];

function Gallery() {
  const [idx, setIdx] = useState(0);
  const n = GALLERY.length;
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n]);
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-5 max-w-4xl">
        <SectionHeader kicker="معرض الصور" title="اكتشف شاي CALMO" />
        <div className="relative rounded-3xl overflow-hidden shadow-sahara-lg bg-ink aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9] max-h-[70vh] mx-auto border border-gold/25">
          {GALLERY.map((g, i) => (
            <img
              key={i}
              src={g.src}
              alt={g.caption}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-5 md:p-8">
            <p className="text-white text-sm md:text-lg font-bold text-center">{GALLERY[idx].caption}</p>
          </div>
          <button
            type="button"
            aria-label="السابق"
            onClick={() => setIdx((i) => (i - 1 + n) % n)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-ink flex items-center justify-center shadow-lg backdrop-blur cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="التالي"
            onClick={() => setIdx((i) => (i + 1) % n)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-ink flex items-center justify-center shadow-lg backdrop-blur cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {GALLERY.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`صورة ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-gold" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- generic section heading ---------- */
function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center mb-8 md:mb-10">
      <div className="text-gold text-[10px] md:text-xs tracking-widest uppercase mb-2 font-black">{kicker}</div>
      <h2 className="text-2xl md:text-4xl font-black">{title}</h2>
    </div>
  );
}

/* ---------- benefits ---------- */
const BENEFIT_ICONS = [Sparkles, ShieldCheck, Leaf, Heart, Zap, Moon];
const DEFAULT_BENEFITS = [
  { title: "تهدئة الجهاز العصبي", desc: "يساعد على تهدئة الأعصاب وتقليل التوتر والقلق اليومي لصفاء ذهني وراحة تامة." },
  { title: "تهدئة القولون والأمعاء", desc: "يعمل كمهدئ طبيعي للقولون ويخفف من التشنجات والانزعاجات المعوية بلطف." },
  { title: "دعم وتعزيز الهضم", desc: "ينشط عملية الهضم الطبيعية ويمنحك خفة وانتعاشاً وراحة بعد الوجبات." },
  { title: "تقليل الانتفاخ والغازات", desc: "تركيبة عشبية تساعد بفعالية على طرد الغازات ومنح بطنك إحساساً دائماً بالراحة." },
  { title: "خواص طبيعية مضادة للبكتيريا", desc: "غني بمضادات أكسدة طبيعية وخصائص مطهرة لحماية الجهاز الهضمي وتعزيز المناعة." },
  { title: "تعزيز النوم الهادئ والعميق", desc: "خالٍ تماماً من الكافيين؛ كوب دافئ قبل النوم يساعدك على الاستغراق في نوم هادئ ومريح." },
];

function Benefits() {
  const { settings } = useStore();
  const c = settings?.content;
  const items = c?.benefits && c.benefits.length > 0 ? c.benefits : DEFAULT_BENEFITS;
  return (
    <section className="relative py-14 md:py-24 overflow-hidden">
      <img
        src={desertHeroImg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sahara/5 to-transparent" />
      <div className="relative container mx-auto px-5 max-w-5xl">
        <div className="text-center mb-8 md:mb-10">
          <div className="text-gold text-[10px] md:text-xs tracking-widest uppercase mb-2 font-black">المميزات والفوائد</div>
          <h2 className="text-2xl md:text-4xl font-black text-white">{c?.benefits_title || "لماذا تختار شاي CALMO؟"}</h2>
          <p className="text-gold/80 text-xs md:text-sm mt-2 font-medium">فوائد موثوقة ومثبتة ومستوحاة من الطبيعة الجزائرية</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((b, i) => {
            const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <div
                key={b.title + i}
                className={`p-6 md:p-8 rounded-3xl md:rounded-[2rem] border border-gold/20 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-sahara-lg ${
                  i % 2 === 0 ? "bg-cream/95" : "bg-white/95 shadow-sahara"
                }`}
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-sahara/10 rounded-full blur-2xl pointer-events-none dust-shimmer" />
                <div className="relative flex md:block items-start gap-4">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center md:mb-6 shadow-sahara border border-gold/15 shrink-0">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black mb-2 md:mb-3 text-ink">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- ingredients & product specs ---------- */
const INGREDIENT_ICONS = [Sun, Leaf, Sparkles];
const DEFAULT_INGREDIENTS = [
  { name: "أزهار البابونج الذهبية", desc: "معروفة بخصائصها الفائقة في تهدئة الأعصاب ومقاومة التوتر والمساعدة على نوم هادئ." },
  { name: "أوراق النعناع المنعش", desc: "تساعد بفعالية على تهدئة القولون وطرد الغازات وتسهيل عملية الهضم وتسكين المغص." },
  { name: "توليفة الأعشاب المهدئة", desc: "مزيج متناغم ونقي 100% من الأعشاب الطبية الداعمة للراحة الهضمية والعصبية." },
];

function Ingredients() {
  const { settings } = useStore();
  const c = settings?.content;
  const items = c?.ingredients && c.ingredients.length > 0 ? c.ingredients : DEFAULT_INGREDIENTS;
  return (
    <section className="relative py-14 md:py-20 bg-card overflow-hidden">
      <div className="section-divider-sahara absolute top-0 left-0 right-0" />
      <img
        src={botanicalImg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-sahara/8 to-ink/80" />
      <div className="relative container mx-auto px-5 max-w-5xl">
        <div className="text-center mb-8 md:mb-10">
          <div className="text-gold text-[10px] md:text-xs tracking-widest uppercase mb-2 font-black">المكونات والنقاء</div>
          <h2 className="text-2xl md:text-4xl font-black text-white">{c?.ingredients_title || "مكونات طبيعية 100% مختارة بعناية فائقة"}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-10">
          {items.map((it, i) => {
            const Icon = INGREDIENT_ICONS[i % INGREDIENT_ICONS.length];
            return (
              <div key={it.name + i} className="text-center p-5 md:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-gold/25 shadow-sahara">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-sahara/20 text-gold flex items-center justify-center mb-3 md:mb-4 border border-sahara/40">
                  <Icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-2 text-white">{it.name}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{it.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Specs bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {[
            { title: "20 كيس شاي", sub: "الوزن الصافي 50 غ" },
            { title: "خالٍ من الكافيين", sub: "مناسب لجميع الأوقات" },
            { title: "نباتي وبدون GMO", sub: "100% أعشاب طبيعية" },
            { title: "جودة BPF الجزائرية 🇩🇿", sub: "ممارسات تصنيع جيدة" },
          ].map((spec, i) => (
            <div key={i} className="bg-ink/60 border border-sahara/30 rounded-xl p-3 text-center backdrop-blur shadow-sahara">
              <div className="text-gold font-bold text-sm md:text-base">{spec.title}</div>
              <div className="text-white/70 text-[11px] md:text-xs mt-0.5">{spec.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- how to use (preparation) ---------- */
const STEP_ICONS = [Package, Coffee, Clock, Sparkles];
const DEFAULT_STEPS = [
  "1 كيس شاي: ضع كيساً واحداً من CALMO في كوبك المفضل",
  "120 مل ماء ساخن: اسكب 120 مل من الماء الساخن المغلي",
  "انقع 3 إلى 5 دقائق: اترك الكيس ينقع ليستخلص كامل الفوائد والنكهة",
  "تذوق واستمتع: ارتشف الشاي الفاخر واستمتع بالراحة التامة والانتعاش",
];

function HowToUse() {
  const { settings } = useStore();
  const c = settings?.content;
  const items = c?.steps && c.steps.length > 0 ? c.steps : DEFAULT_STEPS;
  return (
    <section className="py-14 md:py-20 bg-sahara-warm sahara-pattern sahara-pattern-light relative">
      <div className="relative z-10 container mx-auto px-5">
        <SectionHeader kicker="طريقة التحضير" title={c?.steps_title || "طريقة التحضير والاستمتاع في 4 خطوات"} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-5xl mx-auto">
          {items.map((text, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <div key={i} className="bg-white/90 border border-gold/15 rounded-2xl p-6 text-center relative shadow-sahara hover:shadow-sahara-lg transition">
                <div className="absolute -top-4 right-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-gold text-ink font-black flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
                <Icon className="w-9 h-9 md:w-10 md:h-10 mx-auto text-gold mt-3 mb-3" />
                <p className="font-semibold text-sm md:text-base leading-relaxed">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- before/after ---------- */
const DEFAULT_BEFORE = [
  "توتر وقلق وصعوبة في الاسترخاء بعد العمل",
  "انتفاخ وغازات مزعجة وشعور دائم بالثقل",
  "تشنجات وألم متكرر بالقولون والأمعاء",
  "أرق وصعوبة في الاستغراق في النوم ليلاً"
];
const DEFAULT_AFTER = [
  "هدوء وراحة نفسية واسترخاء طبيعي تام",
  "بطن خفيف وبدون غازات أو انتفاخ مزعج",
  "قولون هادئ ومستقر وهضم سلس وسريع",
  "نوم عميق ومريح واستيقاظ بكامل النشاط"
];

function BeforeAfter() {
  const { settings } = useStore();
  const c = settings?.content;
  const before = c?.before_list && c.before_list.length > 0 ? c.before_list : DEFAULT_BEFORE;
  const after = c?.after_list && c.after_list.length > 0 ? c.after_list : DEFAULT_AFTER;
  return (
    <section className="py-14 md:py-20 bg-cream">
      <div className="container mx-auto px-5">
        <SectionHeader kicker="النتائج" title="قبل وبعد الانتظام على CALMO" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          <div className="rounded-2xl border-2 border-destructive/30 p-5 md:p-6 bg-destructive/5 shadow-sahara">
            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-destructive">{c?.before_title || "قبل الاستخدام"}</h3>
            <ul className="space-y-2.5 md:space-y-3">
              {before.map((b, i) => (
                <li key={b + i} className="flex items-center gap-2 text-sm">
                  <X className="w-5 h-5 text-destructive shrink-0" /> <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-gold p-5 md:p-6 bg-gold/5 shadow-sahara">
            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-gold">{c?.after_title || "بعد الانتظام على CALMO"}</h3>
            <ul className="space-y-2.5 md:space-y-3">
              {after.map((b, i) => (
                <li key={b + i} className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-gold shrink-0" /> <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warning Notice Box */}
        <div className="mt-8 max-w-3xl mx-auto bg-sand border border-gold/15 rounded-2xl p-5 md:p-6 shadow-sahara">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sahara/15 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4 text-sahara" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-ink mb-1">إرشادات ومحاذير الاستخدام</h4>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>غير موصى به في حال وجود حساسية تجاه أي من المكونات العشبية.</li>
                <li>غير موصى به أثناء فترتي الحمل أو الرضاعة الطبيعية.</li>
                <li>يُرجى استشارة الطبيب قبل الاستخدام في حال تناول أدوية بانتظام أو وجود أمراض مزمنة.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- testimonials ---------- */
const DEFAULT_REVIEWS = [
  { name: "أمينة ب.", city: "الجزائر العاصمة", text: "شاي CALMO رائع جداً! كنت أعاني دائماً من انتفاخ وآلام القولون بعد العشاء، بعد تناوله كل مساء شعرت بفرق هائل وراحة ونوم هادئ." },
  { name: "عبد القادر م.", city: "وهران", text: "طعم رائع ونكهة عشبية فاخرة أصيلة. يهدئ الأعصاب بعد يوم عمل شاق ويساعد كثيراً في الهضم. أنصح به بشدة." },
  { name: "سمية ك.", city: "قسنطينة", text: "منتج جزائري نفتخر به حقاً 🇩🇿. التغليف فخم جداً والأكياس ممتازة الجودة. النتائج تظهر من الأيام الأولى، شكراً على سرعة التوصيل." },
];

function Testimonials() {
  const { settings } = useStore();
  const c = settings?.content;
  const reviews = c?.reviews && c.reviews.length > 0 ? c.reviews : DEFAULT_REVIEWS;
  return (
    <section className="py-14 md:py-20 bg-sahara-warm sahara-pattern sahara-pattern-light relative">
      <div className="relative z-10 container mx-auto px-5">
        <SectionHeader kicker="آراء العملاء" title={c?.reviews_title || "ماذا يقولون عن شاي CALMO"} />
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-4 scrollbar-hide">
          {reviews.map((r, idx) => (
            <div key={r.name + idx} className="bg-white/90 border border-gold/15 rounded-2xl p-5 shadow-sahara shrink-0 w-[85%] snap-center">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{r.name}</span> — {r.city}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:grid grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div key={r.name + idx} className="bg-white/90 border border-gold/15 rounded-2xl p-6 shadow-sahara hover:shadow-sahara-lg transition">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{r.name}</span> — {r.city}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- order section ---------- */
function OrderSection() {
  const { settings } = useStore();
  const [qty, setQty] = useState(1);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; msg: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<{
    id: string;
    product: string;
    quantity: number;
    unitPrice: number;
    deliveryFee: number;
    total: number;
    name: string;
    phone: string;
    wilaya: string;
    waUrl: string;
  } | null>(null);

  // Pricing rules for CALMO:
  // Regular price: 2,500 DZD / box
  // 3 boxes or more: 2,200 DZD / box
  // 5 boxes or more: 2,000 DZD / box
  const getUnitPrice = (q: number) => {
    if (q >= 5) return 2000;
    if (q >= 3) return 2200;
    return settings?.price ?? 2500;
  };

  const unitPrice = getUnitPrice(qty);
  const subtotal = unitPrice * qty;
  const deliveryFee = DELIVERY_FEE;
  const discountAmount = appliedPromo ? Math.round(subtotal * (appliedPromo.discount / 100)) : 0;
  const total = subtotal + deliveryFee - discountAmount;

  const applyPromo = () => {
    if (!settings) return;
    if (!settings.promo_active) {
      setPromoMsg({ ok: false, msg: "كود الخصم غير فعال" });
      return;
    }
    if (promoInput.trim().toUpperCase() === settings.promo_code.toUpperCase()) {
      setAppliedPromo({ code: settings.promo_code, discount: settings.promo_discount });
      setPromoMsg({ ok: true, msg: `تم تطبيق الكود! خصم ${settings.promo_discount}%` });
    } else {
      setAppliedPromo(null);
      setPromoMsg({ ok: false, msg: "كود الخصم غير صحيح" });
    }
  };

  const validPhone = (p: string) => /^(05|06|07)\d{8}$/.test(p.replace(/\s/g, ""));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("الرجاء إدخال الاسم الكامل");
    if (!validPhone(form.phone)) return toast.error("رقم هاتف جزائري غير صالح (مثال: 0555000000 أو 0666000000 أو 0777000000)");
    if (!form.wilaya) return toast.error("الرجاء اختيار الولاية");

    setSubmitting(true);
    const cleanPhone = form.phone.replace(/\s/g, "");
    const orderNotes = `المنتج: CALMO — Thé aux herbes (${qty} علبة) | توصيل: ${deliveryFee} دج${form.notes.trim() ? ` — ${form.notes.trim()}` : ""}`;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: form.name.trim(),
        customer_phone: cleanPhone,
        wilaya: form.wilaya,
        quantity: qty,
        unit_price: unitPrice,
        total_price: total,
        promo_code_used: appliedPromo?.code ?? null,
        discount_applied: discountAmount,
        notes: orderNotes,
      })
      .select("id")
      .single();

    setSubmitting(false);
    if (error) {
      toast.error("فشل إرسال الطلب: " + error.message);
      return;
    }

    const orderId = data.id.slice(0, 8).toUpperCase();

    // Prepare WhatsApp Message
    const waText = 
`🌿 *طلب جديد — CALMO*
━━━━━━━━━━━━━━━━━━
📦 *المنتج:* CALMO — Thé aux herbes
🔢 *الكمية:* ${qty} علبة (20 كيس شاي / 50 غ)
🏷️ *سعر الوحدة:* ${fmtDZD(unitPrice)}
🚚 *مصاريف التوصيل:* ${fmtDZD(deliveryFee)} (توصيل لـ 58 ولاية)
💰 *المبلغ الإجمالي:* ${fmtDZD(total)}
━━━━━━━━━━━━━━━━━━
👤 *الاسم الكامل:* ${form.name.trim()}
📞 *رقم الهاتف:* ${cleanPhone}
📍 *الولاية:* ${form.wilaya}
${form.notes.trim() ? `📝 *ملاحظات:* ${form.notes.trim()}\n` : ""}🤝 *طريقة الدفع:* الدفع عند الاستلام
🆔 *رقم الطلب:* #${orderId}`;

    const waUrl = `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent(waText)}`;

    setOrderReceipt({
      id: orderId,
      product: "CALMO — Thé aux herbes",
      quantity: qty,
      unitPrice,
      deliveryFee,
      total,
      name: form.name.trim(),
      phone: cleanPhone,
      wilaya: form.wilaya,
      waUrl,
    });

    // Reset form
    setForm({ name: "", phone: "", wilaya: "", notes: "" });
    setAppliedPromo(null);
    setPromoInput("");
    setPromoMsg(null);
  };

  const c = settings?.content;
  return (
    <section id="order" className="py-14 md:py-24 bg-sahara-dark text-cream rounded-t-[2.5rem] md:rounded-t-[3rem] pb-28 md:pb-24 sahara-pattern relative">
      <div className="relative z-10 container mx-auto px-5">
        <div className="text-center mb-8 md:mb-12">
          <div className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2 md:mb-3 font-black">اطلب الآن</div>
          <h2 className="text-2xl md:text-4xl font-black text-white">{c?.order_title || "احصل على CALMO الأصلي إلى باب منزلك"}</h2>
          <p className="text-gold text-sm font-bold mt-2 md:mt-3">{c?.order_subtitle || "توصيل سريع لـ 58 ولاية — الدفع عند الاستلام"}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {/* product card */}
          <div className="bg-card text-foreground rounded-3xl p-5 md:p-6 shadow-sahara-lg border border-gold/10">
            <div className="flex md:block gap-4 items-center">
              <div className="md:w-full overflow-hidden rounded-2xl shrink-0 group border border-gold/25 shadow-sahara">
                <img
                  src={desertHeroImg}
                  alt="CALMO — Thé aux herbes"
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="w-28 h-28 md:w-full md:h-64 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex-1 md:mt-4">
                <span className="hidden md:inline-block text-[10px] text-gold font-bold px-2 py-0.5 bg-gold/10 rounded-md mb-1">
                  شاي أعشاب فاخر • 20 كيس شاي
                </span>
                <h3 className="text-xl md:text-2xl font-black">{c?.product_name || "CALMO — Thé aux herbes"}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{c?.product_short_desc || "للهضم والاسترخاء التام"} — 50 غرام</p>
                <div className="mt-1 md:mt-3 text-2xl md:text-3xl font-black text-gold">{fmtDZD(unitPrice)} <span className="text-xs text-muted-foreground font-normal">/ للعلبة</span></div>
              </div>
            </div>

            {/* Pack offer selector */}
            <div className="mt-5">
              <span className="text-sm font-semibold text-ink">عروض التوفير الخاصة:</span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { q: 1, label: "علبة واحدة", badge: "تجربة", unit: 2500, save: null },
                  { q: 3, label: "3 علب", badge: "الأكثر طلباً ⭐", unit: 2200, save: "وفر 900 دج" },
                  { q: 5, label: "5 علب", badge: "عرض العائلة 🔥", unit: 2000, save: "وفر 2,500 دج" },
                ].map((item) => {
                  const active = qty === item.q;
                  return (
                    <button
                      key={item.q}
                      type="button"
                      onClick={() => setQty(item.q)}
                      className={`rounded-2xl border-2 p-2.5 text-center transition cursor-pointer active:scale-95 flex flex-col justify-between ${
                        active ? "border-gold bg-gold/10 shadow-sm" : "border-border bg-background hover:border-gold/50"
                      }`}
                    >
                      <div className="text-[10px] font-bold text-gold">{item.badge}</div>
                      <div className="font-black text-sm md:text-base mt-1">{item.label}</div>
                      <div className={`text-xs font-bold mt-0.5 ${active ? "text-gold" : "text-muted-foreground"}`}>
                        {fmtDZD(item.unit)}
                      </div>
                      {item.save && (
                        <div className="text-[9px] font-black text-green-700 bg-green-100 rounded-md px-1 py-0.5 mt-1">
                          {item.save}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">تعديل الكمية:</span>
              <div className="flex items-center border rounded-full bg-background">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full active:scale-95 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-4">
              <label className="text-sm font-semibold">كود الخصم</label>
              <div className="flex gap-2 mt-1.5">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="CALMO10"
                  className="flex-1 border rounded-xl px-4 py-3 bg-background text-base"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="btn-gold rounded-xl px-5 text-sm font-bold cursor-pointer"
                >
                  تطبيق
                </button>
              </div>
              {promoMsg && (
                <p className={`text-xs mt-2 ${promoMsg.ok ? "text-green-600 font-bold" : "text-destructive"}`}>
                  {promoMsg.msg}
                </p>
              )}
            </div>

            {/* Live calculation breakdown */}
            <div className="mt-5 pt-4 border-t space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>سعر العلبة</span>
                <span>{fmtDZD(unitPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>المجموع الجزئي ({qty} علبة)</span>
                <span>{fmtDZD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>مصاريف التوصيل (لكافة 58 ولاية)</span>
                <span>{fmtDZD(deliveryFee)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>الخصم</span>
                  <span>- {fmtDZD(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black pt-2 border-t border-border/50">
                <span>المبلغ الإجمالي</span>
                <span className="text-gold">{fmtDZD(total)}</span>
              </div>
              <div className="text-[11px] text-muted-foreground text-center pt-1">
                الدفع عند الاستلام بعد تفحص الطرد 🤝
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={submit} className="bg-card text-foreground rounded-3xl p-5 md:p-6 shadow-sahara-lg border border-gold/10 space-y-4">
            <div className="border-b pb-3">
              <h3 className="text-lg md:text-xl font-black">معلومات استلام الطلب</h3>
              <p className="text-xs text-muted-foreground mt-0.5">يرجى إدخال معلومات صحيحة للتوصيل السريع لعنوانك</p>
            </div>
            <div>
              <label className="text-sm font-semibold">الاسم الكامل *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: يوسف بلحاج"
                className="w-full mt-1.5 border rounded-xl px-4 py-3 bg-background text-base"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">رقم الهاتف *</label>
              <input
                required
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0555000000 أو 0666000000 أو 0777000000"
                className="w-full mt-1.5 border rounded-xl px-4 py-3 bg-background text-base"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">الولاية (متوفر لجميع الـ 58 ولاية) *</label>
              <select
                required
                value={form.wilaya}
                onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
                className="w-full mt-1.5 border rounded-xl px-4 py-3 bg-background text-base"
              >
                <option value="">اختر ولايتك</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">ملاحظات أو العنوان بالتفصيل (اختياري)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                placeholder="البلدية أو الحي أو أي تعليمات خاصة بالتوصيل..."
                className="w-full mt-1.5 border rounded-xl px-4 py-3 bg-background text-base resize-none"
              />
            </div>

            <div className="bg-sahara/10 border border-sahara/30 rounded-xl p-3 text-xs text-ink space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-gold">
                <Truck className="w-4 h-4" /> توصيل سريع لجميع الـ 58 ولاية (500 دج)
              </div>
              <p className="text-muted-foreground">الدفع نقداً عند استلام طلبك ومعاينته في باب منزلك.</p>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="btn-gold w-full rounded-2xl py-4 text-base md:text-lg font-black disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              تأكيد الطلب — {fmtDZD(total)}
            </button>
          </form>
        </div>
      </div>

      {/* Rich Order Confirmation Modal */}
      {orderReceipt && (
        <div
          className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setOrderReceipt(null)}
        >
          <div
            className="bg-card text-foreground rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-sahara-lg border border-gold/30 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-sahara/15 text-gold mx-auto flex items-center justify-center mb-3 glow-sahara">
              <Check className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black mb-1">تم تسجيل طلبك بنجاح!</h3>
            <p className="text-xs text-muted-foreground mb-4">
              رقم الطلب: <span className="font-black text-gold font-mono">#{orderReceipt.id}</span>
            </p>

            {/* Official Order Summary Box */}
            <div className="bg-muted/60 border rounded-2xl p-4 text-right text-sm space-y-2 mb-5">
              <div className="font-black text-base text-ink border-b pb-2 flex justify-between items-center">
                <span>تفاصيل الفاتورة:</span>
                <span className="text-xs font-normal text-muted-foreground">🇩🇿 الدفع عند الاستلام</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المنتج:</span>
                <span className="font-bold">{orderReceipt.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الكمية:</span>
                <span className="font-bold">{orderReceipt.quantity} علبة (20 كيس / 50غ)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">سعر العلبة:</span>
                <span className="font-bold">{fmtDZD(orderReceipt.unitPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مصاريف التوصيل:</span>
                <span className="font-bold">{fmtDZD(orderReceipt.deliveryFee)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center text-base font-black">
                <span>المبلغ الإجمالي:</span>
                <span className="text-gold text-lg">{fmtDZD(orderReceipt.total)}</span>
              </div>
              <div className="border-t pt-2 text-xs text-muted-foreground">
                المستلم: {orderReceipt.name} • {orderReceipt.phone} • {orderReceipt.wilaya}
              </div>
            </div>

            {/* WhatsApp Dispatch Button */}
            <a
              href={orderReceipt.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1EBE5B] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] text-sm md:text-base mb-3"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              إرسال وتأكيد الطلب عبر واتساب
            </a>

            <button
              onClick={() => setOrderReceipt(null)}
              className="btn-gold w-full rounded-2xl py-3 text-sm font-bold cursor-pointer"
            >
              تم، شكراً لكم
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- contact ---------- */
function Contact() {
  const { settings } = useStore();
  const phone = settings?.phone || "0796028588";
  const trackWA = async () => {
    if (settings?.id) {
      await supabase
        .from("settings")
        .update({ whatsapp_clicks: (settings.whatsapp_clicks ?? 0) + 1 })
        .eq("id", 1);
    }
  };
  const waUrl = `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent("مرحباً، أود الاستفسار عن شاي CALMO — Thé aux herbes")}`;
  return (
    <section id="contact" className="py-20 bg-sahara-warm sahara-pattern sahara-pattern-light relative">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <SectionHeader kicker="خدمة الزبائن" title="تواصل معنا" />
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          فريق خدمة العملاء متواجد للإجابة عن كافة استفساراتكم ومتابعة طلبياتكم عبر الهاتف والواتساب
        </p>
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-3 text-2xl md:text-3xl font-black text-gold mb-8 hover:opacity-80 transition"
        >
          <Phone className="w-6 h-6" /> {OFFICIAL_WHATSAPP}
        </a>
        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href={settings?.facebook_url || "https://facebook.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition shadow-md"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href={settings?.instagram_url || "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-12 h-12 rounded-full text-white flex items-center justify-center hover:scale-110 transition shadow-md"
            style={{ background: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)" }}
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            onClick={trackWA}
            className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition shadow-md"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */
function Footer() {
  const { settings } = useStore();
  const c = settings?.content;
  return (
    <footer className="relative bg-ink text-cream py-14 border-t border-gold/15 overflow-hidden">
      <div className="section-divider-sahara absolute top-0 left-0 right-0" />
      <img
        src={desertHeroImg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/88" />
      <div className="absolute inset-0 bg-gradient-to-b from-sahara/5 via-transparent to-ink/30" />
      <div className="relative container mx-auto px-4 text-center">
        <div className="text-3xl font-black text-gold tracking-wider font-amiri">CALMO</div>
        <p className="text-sm text-cream/80 italic mt-1 font-medium font-amiri">
          {c?.footer_tagline || "حليفك الطبيعي للهضم والهدوء — Thé aux herbes"}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-cream/70">
          <span>🇩🇿 صُنع بكل فخر في الجزائر</span>
          <span>•</span>
          <span>معايير تصنيع BPF</span>
          <span>•</span>
          <span>طبيعي 100%</span>
        </div>
        <p className="text-xs text-cream/50 mt-6">
          {c?.footer_copyright || "© 2026 CALMO. جميع الحقوق محفوظة."}
        </p>
      </div>
    </footer>
  );
}

/* ---------- page ---------- */
function LandingPage() {
  const { loading } = useStore();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }
  const scrollOrder = () =>
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  return (
    <main className="min-h-screen">
      <LiveSocialProof />
      <Hero />
      <Countdown />
      <Gallery />
      <Benefits />
      <Ingredients />
      <HowToUse />
      <BeforeAfter />
      <Testimonials />
      <OrderSection />
      <Contact />
      <Footer />

      {/* sticky mobile bottom CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-sahara-dark backdrop-blur border-t border-gold/25 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          onClick={scrollOrder}
          className="btn-gold w-full rounded-2xl py-3.5 text-base font-black flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <Package className="w-5 h-5" />
          اطلب CALMO الآن — 2,500 دج
        </button>
      </div>
    </main>
  );
}

function MapPinHidden() {
  return <MapPin className="hidden" />;
}
export { MapPinHidden };
