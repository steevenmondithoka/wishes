import { useState, useEffect, useRef, useCallback } from "react";

import img1 from "./assets/Manasa5.jpeg";
import img2 from "./assets/US1.jpeg";
import img3 from "./assets/Looking at me.jpeg";
import img4 from "./assets/Shoulder.jpeg";
import img5 from "./assets/US4.jpeg";
import img6 from "./assets/US6.jpeg";
import img7 from "./assets/Manasa3.jpeg";
import img8 from "./assets/US2.jpeg"; // check name
import img9 from "./assets/cartoon.jpeg";
import img10 from "./assets/USMAIN.jpeg";
import herImg from "./assets/Manasamain.jpeg";
import music2 from "./assets/Nuvvunte-Chaley-BGM-Humming-Ringtone.mp3";
import music3 from "./assets/Chinni Gundelo Song Bgm.mp3";
import music from "./assets/Mr Majnu Bgm.mp3"
import music4 from "./assets/Nee Raakane Naako Kala Ringtone Download - MobCup.Com.Co.mp3"

/* ══════════════════════════════════════════════════════════
   🎬 CUSTOMISE HERE
══════════════════════════════════════════════════════════ */
const HER_NAME      = "Bangaram";
const SENDER_NAME   = "Yours Steeve ♥";
const BIRTHDAY_DATE = "2026-03-28"; // YYYY-MM-DD

// ── Replace these with your local asset paths, e.g. "/src/assets/photo1.jpg"
const HER_IMAGE = herImg;

const playlist = [music, music2, music3, music4];

const MEMORY_IMAGES = [
  { src: img1, cap: "Okka nee navvu chalu ♥" },
  { src: img2, cap: "The best day 🌸" },
  { src: img3, cap: "Favourite memory ✨" },
  { src: img4, cap: "Always you ♥" },
  { src: img5, cap: "Pure joy 🌻" },
  { src: img6, cap: "Miss this 🌼" },
  { src: img7, cap: "So pretty ✨" },
  { src: img8, cap: "Crazy times 😄" },
  { src: img9, cap: "Comedy moment 🌟" },
  { src: img10, cap: "Us, always ♥" },
];
// Auto-scroll interval in ms (how long each photo is shown)
const AUTO_SCROLL_INTERVAL = 4500;
/* ══════════════════════════════════════════════════════════ */

const SCENES = [
  { type: "msg",     text: `Hi ${HER_NAME} 🙂`,                              hold: 3000 },
  { type: "msg",     text: "Ela unnav...",                         hold: 3200 },
  { type: "msg",     text: `Surprise enti anukuntunnava 🙂`,               hold: 1100 },
  { type: "msg",     text: `Neeku Telusu ga ma....♥ `,               hold: 3100 },
  { type: "card" },
  { type: "msg",     text: "Konni rojulu dull and confused ga unnav...",       hold: 3100 },
   { type: "msg",     text: "Dont worry!...🙂",       hold: 3100 },
  { type: "msg",     text: `Eppudu Navvuthu Undu... 🙂`,                       hold: 3000 },
  { type: "msg",     text: "O ma",                              hold: 3200 },
  { type: "msg",     text: "Niku oka vishayam chepdham anukuntunna ra...", hold: 3600 },
  { type: "big",     lines: ["I Love You", `${HER_NAME} ♥`],                  hold: 3800 },
  { type: "msg",     text: `Nuv na life lo oka special part ${HER_NAME} ♥`,   hold: 3400 },
 

  
  { type: "ask"  },
  { type: "memories" },
    { type: "letters", word: "SPECIAL THING IS COMING",hold: 3200 },
  { type: "final" },

];

/* ── Countdown helpers ─────────────────────────────── */
function getTimeLeft(dateStr) {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const now  = new Date();
  let   diff = target - now;
  if (diff < 0) { target.setFullYear(target.getFullYear() + 1); diff = target - now; }
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
    isToday: Math.floor(diff / 86400000) === 0 && Math.floor((diff % 86400000) / 3600000) === 0,
  };
}

/* ── Typing hook ───────────────────────────────────── */
function useTyping(text, active, speed = 52) {
  const [out,  setOut]  = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setOut(""); setDone(false); return; }
    setOut(""); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return { out, done };
}

const Cursor = () => (
  <span style={{
    display: "inline-block", width: 2, height: "0.85em",
    background: "rgba(160,80,220,0.9)", marginLeft: 3,
    verticalAlign: "middle", animation: "blink 1s step-end infinite",
  }} />
);

/* ── Canvas particle engine ────────────────────────── */
function ParticleCanvas({ active }) {
  const ref = useRef();
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    const ctx    = canvas.getContext("2d");
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: -(Math.random() * 0.6 + 0.15),
      r: Math.random() * 2.2 + 0.5,
      op: Math.random() * 0.45 + 0.1,
      col: ["#9B30FF","#7B2FBE","#BF5FFF","#D4A0FF","#5B1FA8","#E0BFFF"][i % 6],
      life: Math.random(),
      char: ["♥","·","✦","★","○","◆"][i % 6],
      fontSize: Math.random() * 10 + 7,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.life += 0.004;
        if (p.life > 1) { p.life = 0; p.y = H + 10; p.x = Math.random() * W; }
        p.x += p.vx; p.y += p.vy;
        const alpha = Math.sin(p.life * Math.PI) * p.op;
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = p.col;
        ctx.font        = `${p.fontSize}px serif`;
        ctx.fillText(p.char, p.x, p.y);
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [active]);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}

/* ── Golden burst VFX ──────────────────────────────── */
function GoldenBurst() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 70 }, (_, i) => {
        const angle = Math.random() * 360;
        const dist  = Math.random() * 52 + 20;
        const size  = Math.random() * 6 + 2;
        const dur   = Math.random() * 1.8 + 1.2;
        const del   = Math.random() * 0.8;
        const col   = ["#9B30FF","#7B2FBE","#BF5FFF","#D4A0FF","#E0BFFF","#fff"][i % 6];
        return (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: size, height: size, borderRadius: "50%",
            background: col, boxShadow: `0 0 ${size * 3}px ${col}`,
            transform: `rotate(${angle}deg) translateX(0px)`,
            animation: `burst ${dur}s ${del}s ease-out forwards`,
            "--dist": `${dist}vw`,
          }} />
        );
      })}
    </div>
  );
}

/* ── Light rays ────────────────────────────────────── */
function LightRays() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: 3, height: "140vh", transformOrigin: "top center",
          transform: `translate(-50%,-5%) rotate(${i * 45}deg)`,
          background: `linear-gradient(transparent,rgba(155,48,255,0.07) 30%,rgba(123,47,190,0.14) 50%,rgba(155,48,255,0.07) 70%,transparent)`,
          animation: `rayPulse ${2 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ── Countdown screen ──────────────────────────────── */
function CountdownScreen({ onStart }) {
  const [time,  setTime]  = useState(() => getTimeLeft(BIRTHDAY_DATE));
  const [burst, setBurst] = useState(false);
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    setTimeout(() => setEnter(true), 100);
    const id = setInterval(() => setTime(getTimeLeft(BIRTHDAY_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  const handleBegin = () => { setBurst(true); setTimeout(onStart, 1800); };
  const isToday     = time.isToday;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center",
      opacity: enter ? 1 : 0, transform: enter ? "translateY(0)" : "translateY(28px)",
      transition: "opacity 1s ease,transform 1s ease",
      position: "relative", zIndex: 10, padding: "0 24px", width: "100%", maxWidth: 480,
    }}>
      {burst && <GoldenBurst />}

      <div style={{ fontSize: 52, marginBottom: 20, animation: "crownFloat 3s ease-in-out infinite", filter: "drop-shadow(0 0 18px rgba(155,48,255))" }}> M ♥ S</div>

      <p style={{ color: "rgba(155,48,255,0.6)", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Georgia',serif" }}>
        {isToday ? "it's finally here" : "counting down to"}
      </p>
      <h1 style={{
        fontSize: "clamp(26px,7vw,44px)", fontWeight: 200, color: "#fff",
        letterSpacing: "0.08em", margin: "0 0 8px", fontFamily: "'Georgia',serif",
        textShadow: "0 0 40px rgba(155,48,255,0.5)",
      }}>
        {HER_NAME}'s Surprise
      </h1>
      <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, letterSpacing: "0.14em", marginBottom: 40 }}>
        {new Date(BIRTHDAY_DATE).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <button onClick={handleBegin} style={{
        background: "transparent",
        border: "1px solid rgba(155,48,255,0.6)",
        color: "rgba(191,95,255,0.95)",
        fontSize: 14, fontWeight: 300, letterSpacing: "0.14em",
        padding: "14px 56px", borderRadius: 100, cursor: "pointer",
        fontFamily: "'Georgia',serif",
        animation: "purpleGlow 2.5s ease-in-out infinite",
        transition: "all 0.3s ease", position: "relative", zIndex: 11,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,48,255,0.15)"; e.currentTarget.style.transform = "scale(1.05)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        Open Chey Ma ✨
      </button>

      <p style={{ color: "rgba(255,255,255,0.1)", fontSize: 11, letterSpacing: "0.1em", marginTop: 24 }}>🎵 best with headphones</p>
    </div>
  );
}

/* ── Message scene ─────────────────────────────────── */
function MsgScene({ scene, onDone }) {
  const { out, done } = useTyping(scene.text, true, 50);
  const held = useRef(false);
  useEffect(() => {
    if (done && !held.current) {
      held.current = true;
      const t = setTimeout(onDone, scene.hold ?? 3000);
      return () => clearTimeout(t);
    }
  }, [done]);
  return (
    <div style={{ textAlign: "center", padding: "0 8px" }}>
      <p style={{
        fontSize: "clamp(20px,5.5vw,30px)", fontWeight: 200,
        color: "rgba(255,255,255,0.9)", lineHeight: 1.9,
        letterSpacing: "0.03em", minHeight: "2.5em", fontFamily: "'Georgia',serif",
      }}>
        {out}{!done && <Cursor />}
      </p>
    </div>
  );
}

/* ── Big scene ─────────────────────────────────────── */
function BigScene({ scene, onDone }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1700);
    const t3 = setTimeout(onDone, (scene.hold ?? 3800) + 300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div style={{ textAlign: "center", lineHeight: 1.3 }}>
      {scene.lines.map((line, i) => (
        <div key={i} style={{
          fontSize: i === 0 ? "clamp(22px,5.5vw,34px)" : "clamp(38px,10vw,66px)",
          fontWeight: i === 0 ? 200 : 300,
          color: i === 0 ? "rgba(255,255,255,0.5)" : "#BF5FFF",
          letterSpacing: i === 0 ? "0.22em" : "0.06em",
          textTransform: i === 0 ? "uppercase" : "none",
          fontFamily: "'Georgia',serif",
          opacity: step > i ? 1 : 0,
          transform: step > i ? "translateY(0) scale(1)" : "translateY(34px) scale(0.86)",
          transition: "opacity 1.1s ease,transform 1.1s cubic-bezier(.16,1,.3,1)",
          transitionDelay: `${i * 0.18}s`,
          textShadow: i === 1 ? "0 0 40px rgba(155,48,255,0.6)" : "none",
        }}>{line}</div>
      ))}
    </div>
  );
}

/* ── Letters scene ─────────────────────────────────── */
function LettersScene({ scene, onDone }) {
  const [vis, setVis] = useState([]);
  useEffect(() => {
    const letters = scene.word.split("");
    letters.forEach((_, i) => setTimeout(() => setVis(v => [...v, i]), i * 200 + 400));
    setTimeout(onDone, letters.length * 200 + (scene.hold ?? 3200));
  }, []);
  return (
    <div style={{ display: "flex", gap: "clamp(5px,2vw,16px)", justifyContent: "center", flexWrap: "wrap" }}>
      {scene.word.split("").map((l, i) => (
        <span key={i} style={{
          fontSize: "clamp(28px,7vw,54px)", fontWeight: 200,
          color: vis.includes(i) ? "#BF5FFF" : "transparent",
          letterSpacing: "0.02em", fontFamily: "'Georgia',serif",
          opacity: vis.includes(i) ? 1 : 0,
          transform: vis.includes(i) ? "translateY(0) scale(1)" : "translateY(44px) scale(0.55)",
          transition: "opacity 0.65s ease,transform 0.65s cubic-bezier(.16,1,.3,1)",
          textShadow: vis.includes(i) ? "0 0 30px rgba(155,48,255,0.7)" : "none",
        }}>{l}</span>
      ))}
    </div>
  );
}

/* ── Birthday card ─────────────────────────────────── */
function CardScene({ onDone }) {
  const [inn,     setInn]     = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  useEffect(() => { setTimeout(() => setInn(true), 120); setTimeout(() => setShowBtn(true), 2000); });
  return (
    <div style={{
      width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
      opacity: inn ? 1 : 0, transform: inn ? "scale(1)" : "scale(0.9)",
      transition: "opacity 1s ease,transform 1s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{
        width: "min(310px,86vw)", borderRadius: 28, overflow: "hidden", position: "relative",
        boxShadow: "0 0 100px rgba(155,48,255,0.3),0 0 40px rgba(123,47,190,0.25),0 30px 80px rgba(0,0,0,0.7)",
        border: "1px solid rgba(155,48,255,0.25)",
      }}>
        <img src={HER_IMAGE} alt={HER_NAME} style={{
          width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block",
          filter: "brightness(0.78) saturate(1.2) contrast(1.05)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom,rgba(60,0,100,0.2) 0%,transparent 40%,rgba(0,0,0,0.85) 75%,rgba(0,0,0,0.95) 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "60px 24px 30px", textAlign: "center" }}>
          <p style={{ color: "rgba(191,95,255,0.7)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 10 }}>
            🎂 your special day
          </p>
          <h2 style={{
            color: "#fff", fontSize: "clamp(26px,7vw,40px)", fontWeight: 200,
            letterSpacing: "0.07em", margin: "0 0 6px", fontFamily: "'Georgia',serif",
            textShadow: "0 0 30px rgba(255,255,255,0.3)",
          }}>Happy Birthday</h2>
          <p style={{
            color: "#BF5FFF", fontSize: "clamp(22px,5.5vw,30px)", fontWeight: 300,
            margin: 0, fontFamily: "'Georgia',serif",
            textShadow: "0 0 20px rgba(155,48,255,0.7)",
          }}>{HER_NAME} ♥</p>
        </div>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg,rgba(155,48,255,0.08) 0%,transparent 50%,rgba(155,48,255,0.04) 100%)",
          pointerEvents: "none", borderRadius: 28,
        }} />
      </div>
      {showBtn && <SlimBtn onClick={onDone} label="Continue →" color="purple" />}
    </div>
  );
}

/* ── Ask scene ─────────────────────────────────────── */
function AskScene({ onYes, onNo }) {
  const [step, setStep] = useState(0);
  useEffect(() => { setTimeout(() => setStep(1), 600); setTimeout(() => setStep(2), 1700); });
  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
      <div style={{
        opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? "translateY(0)" : "translateY(26px)",
        transition: "opacity 0.9s ease,transform 0.9s ease",
      }}>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 16 }}>one more thing...</p>
        <p style={{
          fontSize: "clamp(20px,5.5vw,30px)", fontWeight: 200,
          color: "rgba(255,255,255,0.9)", lineHeight: 1.8, fontFamily: "'Georgia',serif",
        }}>
          Want to revisit<br />our memories? 🌸
        </p>
      </div>
      {step >= 2 && (
        <div style={{ display: "flex", gap: 14, animation: "fadeUp 0.5s ease" }}>
          <button onClick={onYes} style={{
            background: "rgba(155,48,255,0.15)", border: "1px solid rgba(155,48,255,0.55)",
            color: "#BF5FFF", fontSize: 15, fontWeight: 300, padding: "13px 44px",
            borderRadius: 100, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em",
            animation: "glowPulse 2.5s ease-in-out infinite", transition: "all 0.25s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,48,255,0.28)"; e.currentTarget.style.transform = "scale(1.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(155,48,255,0.15)"; e.currentTarget.style.transform = "scale(1)"; }}
          >Yes ♥</button>
          <button onClick={onNo} style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.28)", fontSize: 15, fontWeight: 300, padding: "13px 44px",
            borderRadius: 100, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em",
            transition: "all 0.25s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.28)"; }}
          >Maybe later</button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   🎠 HORIZONTAL AUTO-SCROLL MEMORIES GALLERY
══════════════════════════════════════════════════════════ */
function MemoriesScene({ onDone }) {
  const [idx,          setIdx]         = useState(0);
  const [prev,         setPrev]        = useState(null);
  const [transitioning,setTr]          = useState(false);
  const [loaded,       setLoaded]      = useState(false);
  const [raysOn,       setRaysOn]      = useState(false);
  const [glowPeak,     setGlowPeak]    = useState(false);
  const [titleIn,      setTitleIn]     = useState(false);
  const [paused,       setPaused]      = useState(false);
  const [progress,     setProgress]    = useState(0);
  const autoRef     = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => { setTimeout(() => setTitleIn(true), 200); startAuto(); return () => clearAll(); }, []);

  const clearAll = () => {
    if (autoRef.current)     clearTimeout(autoRef.current);
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
  };

  const animateProgress = (startVal = 0) => {
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    const startT = performance.now();
    const startPct = startVal;
    const tick = (now) => {
      const elapsed = now - startT;
      const pct = Math.min(startPct + (elapsed / AUTO_SCROLL_INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);
  };

  const startAuto = () => {
    clearAll();
    setProgress(0);
    animateProgress(0);
    autoRef.current = setTimeout(() => goNext(true), AUTO_SCROLL_INTERVAL);
  };

  const goTo = (nextIdx) => {
    if (transitioning) return;
    clearAll();
    setTr(true);
    setRaysOn(true);
    setGlowPeak(true);
    setTimeout(() => setGlowPeak(false), 600);
    setTimeout(() => {
      setPrev(idx);
      setIdx(nextIdx);
      setLoaded(false);
      setTimeout(() => { setTr(false); setRaysOn(false); startAuto(); }, 100);
    }, 350);
  };

  const goNext = (auto = false) => {
    if (!auto && idx === MEMORY_IMAGES.length - 1) { onDone(); return; }
    goTo((idx + 1));
  };

  const goPrev = () => {
    if (idx === 0) return;
    goTo(idx - 1);
  };

  const handleDownload = async () => {
    const imgSrc = MEMORY_IMAGES[idx].src;
    try {
      const response = await fetch(imgSrc);
      const blob     = await response.blob();
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement("a");
      a.href         = url;
      a.download     = `memory_${idx + 1}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      const a    = document.createElement("a");
      a.href     = imgSrc;
      a.target   = "_blank";
      a.download = `memory_${idx + 1}.jpg`;
      a.click();
    }
  };

  const img     = MEMORY_IMAGES[idx];
  const prevImg = prev !== null ? MEMORY_IMAGES[prev] : null;
  const isLast  = idx === MEMORY_IMAGES.length - 1;

  return (
    <div style={{
      width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
      position: "relative",
    }}>
      {raysOn && <LightRays />}

      {/* Header */}
      <div style={{
        textAlign: "center", marginBottom: 18,
        opacity: titleIn ? 1 : 0, transform: titleIn ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease,transform 0.8s ease",
      }}>
        <p style={{ color: "rgba(155,48,255,0.65)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 6 }}>
          our memories
        </p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, letterSpacing: "0.1em", fontFamily: "'Georgia',serif" }}>
          {idx + 1} / {MEMORY_IMAGES.length}
        </p>
      </div>

      {/* Epic photo stage */}
      <div style={{ width: "min(340px,92vw)", position: "relative", borderRadius: 28, overflow: "visible" }}>

        {/* Outer glow rings */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(400px,108vw)", height: "min(520px,135vw)",
          borderRadius: 36, background: "transparent",
          border: `1px solid rgba(155,48,255,${glowPeak ? 0.55 : 0.15})`,
          boxShadow: `0 0 ${glowPeak ? 90 : 35}px rgba(155,48,255,${glowPeak ? 0.3 : 0.08}),
                      0 0 ${glowPeak ? 160 : 70}px rgba(123,47,190,${glowPeak ? 0.22 : 0.05}),
                      inset 0 0 ${glowPeak ? 40 : 12}px rgba(155,48,255,${glowPeak ? 0.1 : 0.03})`,
          transition: "box-shadow 0.5s ease,border-color 0.5s ease",
          pointerEvents: "none", zIndex: 3,
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(370px,100vw)", height: "min(490px,126vw)",
          borderRadius: 32,
          border: `1px solid rgba(191,95,255,${glowPeak ? 0.4 : 0.1})`,
          pointerEvents: "none", zIndex: 3, transition: "border-color 0.5s ease",
        }} />

        {/* Main photo frame */}
        <div style={{
          borderRadius: 28, overflow: "hidden", position: "relative",
          boxShadow: `
            0 0 ${glowPeak ? 130 : 65}px rgba(155,48,255,${glowPeak ? 0.4 : 0.2}),
            0 0 ${glowPeak ? 210 : 90}px rgba(123,47,190,${glowPeak ? 0.22 : 0.07}),
            0 40px 100px rgba(0,0,0,0.75)
          `,
          transition: "box-shadow 0.5s ease",
          border: "1px solid rgba(155,48,255,0.18)",
        }}>

          {/* Fading prev image */}
          {prevImg && transitioning && (
            <img src={prevImg.src} alt="" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              filter: "brightness(0.7) saturate(1.2)", zIndex: 1,
              animation: "imgFadeOut 0.35s ease forwards",
            }} />
          )}

          {/* Current image with slide-in animation */}
          <img
            key={idx}
            src={img.src}
            alt={img.cap}
            onLoad={() => setLoaded(true)}
            style={{
              width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block",
              filter: "brightness(0.78) saturate(1.25) contrast(1.08)",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "scale(1) translateX(0)" : "scale(1.05) translateX(30px)",
              transition: "opacity 0.7s ease,transform 0.7s cubic-bezier(.16,1,.3,1)",
              animation: loaded ? "slowZoom 8s ease-out forwards" : "none",
              zIndex: 2, position: "relative",
            }}
          />

          {/* Transition flash overlay */}
          {transitioning && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
              background: "radial-gradient(circle at 50% 50%,rgba(155,48,255,0.18),transparent 70%)",
              animation: "flashBurst 0.4s ease forwards",
            }} />
          )}

          {/* Bottom gradient + controls */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6,
            padding: "80px 16px 18px",
            background: "linear-gradient(transparent,rgba(10,0,20,0.55) 30%,rgba(5,0,15,0.92) 100%)",
          }}>
            {/* Caption */}
            <p key={`cap-${idx}`} style={{
              color: "rgba(255,255,255,0.92)", fontSize: 14, fontWeight: 300,
              letterSpacing: "0.06em", margin: "0 0 14px", textAlign: "center",
              fontFamily: "'Georgia',serif", animation: "captionIn 0.6s 0.3s ease both",
            }}>{img.cap}</p>

            {/* Nav row — prev | dots | next | download */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>

              {/* ← PREV */}
              <button onClick={goPrev} disabled={idx === 0} style={{
                background: idx === 0 ? "rgba(255,255,255,0.03)" : "rgba(155,48,255,0.12)",
                border: `1px solid ${idx === 0 ? "rgba(255,255,255,0.06)" : "rgba(155,48,255,0.45)"}`,
                color: idx === 0 ? "rgba(255,255,255,0.15)" : "#BF5FFF",
                fontSize: 18, width: 38, height: 38,
                borderRadius: "50%", cursor: idx === 0 ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease", flexShrink: 0,
              }}
                onMouseEnter={e => { if (idx !== 0) e.currentTarget.style.background = "rgba(155,48,255,0.25)"; }}
                onMouseLeave={e => { if (idx !== 0) e.currentTarget.style.background = "rgba(155,48,255,0.12)"; }}
              >‹</button>

              {/* Dot nav */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", flex: 1 }}>
                {MEMORY_IMAGES.map((_, i) => (
                  <div key={i} onClick={() => goTo(i)} style={{
                    width: i === idx ? 16 : 5, height: 5, borderRadius: 5, cursor: "pointer",
                    background: i === idx ? "#9B30FF" : i < idx ? "rgba(155,48,255,0.4)" : "rgba(255,255,255,0.12)",
                    transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
                    boxShadow: i === idx ? "0 0 8px rgba(155,48,255,0.8)" : "none",
                  }} />
                ))}
              </div>

              {/* → NEXT or Finish */}
              <button onClick={() => goNext(false)} style={{
                background: isLast ? "rgba(155,48,255,0.25)" : "rgba(155,48,255,0.12)",
                border: `1px solid ${isLast ? "rgba(155,48,255,0.65)" : "rgba(155,48,255,0.35)"}`,
                color: "#BF5FFF",
                fontSize: isLast ? 11 : 18,
                width: isLast ? 64 : 38, height: 38,
                borderRadius: isLast ? 100 : 50, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                letterSpacing: "0.08em", fontFamily: "inherit",
                transition: "all 0.2s ease", flexShrink: 0,
                animation: isLast ? "glowPulse 2.5s ease-in-out infinite" : "none",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >{isLast ? "Finish ✨" : "›"}</button>

              {/* ⬇ DOWNLOAD */}
              <button onClick={handleDownload} title="Download this photo" style={{
                background: "rgba(155,48,255,0.1)",
                border: "1px solid rgba(155,48,255,0.3)",
                color: "rgba(191,95,255,0.7)",
                fontSize: 15, width: 38, height: 38,
                borderRadius: "50%", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease", flexShrink: 0,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,48,255,0.28)"; e.currentTarget.style.color = "#BF5FFF"; e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(155,48,255,0.1)"; e.currentTarget.style.color = "rgba(191,95,255,0.7)"; e.currentTarget.style.transform = "scale(1)"; }}
              >⬇</button>
            </div>
          </div>

          {/* Top glow bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 80, zIndex: 4,
            background: "linear-gradient(rgba(80,10,130,0.25),transparent)",
            pointerEvents: "none",
          }} />

          {/* Corner VFX marks */}
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v, h], i) => (
            <div key={i} style={{
              position: "absolute",
              [v]: 8, [h]: 8,
              width: 18, height: 18, zIndex: 7, pointerEvents: "none",
              borderTop:    v === "top"    ? "1px solid rgba(155,48,255,0.6)" : "none",
              borderBottom: v === "bottom" ? "1px solid rgba(155,48,255,0.6)" : "none",
              borderLeft:   h === "left"   ? "1px solid rgba(155,48,255,0.6)" : "none",
              borderRight:  h === "right"  ? "1px solid rgba(155,48,255,0.6)" : "none",
              opacity: glowPeak ? 1 : 0.4, transition: "opacity 0.4s ease",
            }} />
          ))}
        </div>

        {/* Auto-progress bar */}
        <div style={{ marginTop: 14, width: "100%", height: 3, background: "rgba(155,48,255,0.1)", borderRadius: 3 }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg,#6A0DAD,#BF5FFF)",
            borderRadius: 3,
            boxShadow: "0 0 10px rgba(155,48,255,0.6)",
            transition: "width 0.1s linear",
          }} />
        </div>

        <p style={{ textAlign: "center", marginTop: 10, color: "rgba(255,255,255,0.14)", fontSize: 10, letterSpacing: "0.14em" }}>
          ↺ auto-scrolling · tap dots to jump · ⬇ to save
        </p>
      </div>
    </div>
  );
}

/* ── Final scene ───────────────────────────────────── */
function FinalScene() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setP(1), 400),
      setTimeout(() => setP(2), 1300),
      setTimeout(() => setP(3), 2200),
      setTimeout(() => setP(4), 3100),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);
  const fade = (n) => ({
    opacity: p >= n ? 1 : 0,
    transform: p >= n ? "translateY(0)" : "translateY(18px)",
    transition: "opacity 0.9s ease,transform 0.9s ease",
  });
  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={fade(1)}>
        <div style={{ fontSize: 54, animation: "heartBeat 1.8s ease-in-out infinite", filter: "drop-shadow(0 0 22px rgba(155,48,255,0.8))" }}>♥</div>
      </div>
      <div style={fade(2)}>
        <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 14 }}>
          always & forever
        </p>
        <h1 style={{
          fontSize: "clamp(30px,8vw,52px)", fontWeight: 200,
          letterSpacing: "0.06em", margin: 0, fontFamily: "'Georgia',serif",
          background: "linear-gradient(135deg,#fff 15%,#9B30FF 40%,#D4A0FF 65%,#BF5FFF)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          filter: "drop-shadow(0 0 20px rgba(155,48,255,0.4))",
        }}>
          Happy Birthday {HER_NAME} ♥
        </h1>
      </div>
      <div style={{ ...fade(3), maxWidth: 300 }}>
        <p style={{
          color: "rgba(255,255,255,0.35)", fontSize: 14, fontWeight: 300,
          lineHeight: 2, letterSpacing: "0.05em", margin: 0, fontFamily: "'Georgia',serif",
        }}>
          These moments are ours to keep.<br />Stay happy
        </p>
      </div>
      <div style={fade(4)}>
        <p style={{ color: "rgba(155,48,255,0.6)", fontSize: 13, letterSpacing: "0.16em" }}>— {SENDER_NAME}</p>
      </div>
    </div>
  );
}

/* ── Slim button ───────────────────────────────────── */
function SlimBtn({ onClick, label, color = "purple" }) {
  const c  = "rgba(155,48,255,0.45)";
  const tc = "rgba(191,95,255,0.9)";
  return (
    <button onClick={onClick} style={{
      background: "transparent", border: `1px solid ${c}`,
      color: tc, fontSize: 13, fontWeight: 300, letterSpacing: "0.12em",
      padding: "12px 38px", borderRadius: 100, cursor: "pointer", fontFamily: "inherit",
      animation: "fadeUp 0.5s ease,glowPulse 2.8s ease-in-out infinite",
      transition: "all 0.25s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,48,255,0.12)"; e.currentTarget.style.transform = "scale(1.04)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}
    >{label}</button>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */
export default function App() {
  const [phase,    setPhase]    = useState("countdown");
  const [sceneIdx, setSceneIdx] = useState(0);
  const [fadeIn,   setFadeIn]   = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const audioRef = useRef(null);

  
const [songIndex, setSongIndex] = useState(0);

useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const handleEnded = () => {
    setSongIndex((prev) => (prev + 1) % playlist.length);
  };

  audio.addEventListener("ended", handleEnded);

  // fallback timer
  const fallback = setTimeout(() => {
    if (!audio.paused) return;
    setSongIndex((prev) => (prev + 1) % playlist.length);
  }, 30000); // 30s

  return () => {
    audio.removeEventListener("ended", handleEnded);
    clearTimeout(fallback);
  };
}, [songIndex]);

useEffect(() => {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }
}, [songIndex]);

  const advance = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setSceneIdx(i => i + 1);
      setSceneKey(k => k + 1);
      setTimeout(() => setFadeIn(true), 80);
    }, 480);
  }, []);

  const handleStart = () => {
    if (audioRef.current) { audioRef.current.volume = 0.14; audioRef.current.play().catch(() => {}); }
    setPhase("scenes");
    setTimeout(() => setFadeIn(true), 120);
  };

  const handleNo = () => {
    setFadeIn(false);
    setTimeout(() => {
      setSceneIdx(SCENES.findIndex(s => s.type === "final"));
      setSceneKey(k => k + 1);
      setTimeout(() => setFadeIn(true), 80);
    }, 480);
  };

  const scene    = SCENES[Math.min(sceneIdx, SCENES.length - 1)];
  const showDots = phase === "scenes" && ["msg","big","letters"].includes(scene?.type);

  return (
    <div style={{
      minHeight: "100dvh", width: "100%",
      background: "#03000A",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia','Times New Roman',serif",
      position: "relative", overflow: "hidden",
    }}>

      {/* Deep space bg — purple tones */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 80% 60% at 20% 15%, rgba(80,10,130,0.22) 0%, transparent 55%),
          radial-gradient(ellipse 70% 50% at 85% 80%, rgba(60,5,100,0.18) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(155,48,255,0.04) 0%, transparent 60%)
        `,
      }} />

      <ParticleCanvas active={phase === "scenes"} />

    <audio
  ref={audioRef}
  src={playlist[songIndex]}
  key={songIndex}
/>

      {phase === "countdown" && <CountdownScreen onStart={handleStart} />}

      {phase === "scenes" && (
        <div style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: 460,
          padding: "80px 24px 60px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          minHeight: "100dvh",
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease,transform 0.6s cubic-bezier(.16,1,.3,1)",
        }}>
          {showDots && (
            <div style={{ position: "absolute", top: 32, left: 0, right: 0, display: "flex", gap: 5, justifyContent: "center" }}>
              {SCENES.filter(s => ["msg","big","letters"].includes(s.type)).map((_, i) => (
                <div key={i} style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: i < sceneIdx ? "rgba(155,48,255,0.55)" : i === sceneIdx ? "rgba(191,95,255,1)" : "rgba(255,255,255,0.1)",
                  transition: "background 0.4s ease",
                }} />
              ))}
            </div>
          )}

          <div key={sceneKey} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            {scene.type === "msg"      && <MsgScene      key={sceneKey} scene={scene} onDone={advance} />}
            {scene.type === "big"      && <BigScene      key={sceneKey} scene={scene} onDone={advance} />}
            {scene.type === "letters"  && <LettersScene  key={sceneKey} scene={scene} onDone={advance} />}
            {scene.type === "card"     && <CardScene     key={sceneKey} onDone={advance} />}
            {scene.type === "ask"      && <AskScene      key={sceneKey} onYes={advance} onNo={handleNo} />}
            {scene.type === "memories" && <MemoriesScene key={sceneKey} onDone={advance} />}
            {scene.type === "final"    && <FinalScene    key={sceneKey} />}
          </div>

          {!["card","memories","ask","final"].includes(scene?.type) && (
            <p style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center", color: "rgba(155,48,255,0.1)", fontSize: 10, letterSpacing: "0.28em" }}>♥ ♥ ♥</p>
          )}
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #03000A; overflow: hidden; }

        @keyframes fadeUp     { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink      { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes heartBeat  { 0%,100%{transform:scale(1);} 14%{transform:scale(1.38);} 28%{transform:scale(1);} 42%{transform:scale(1.2);} 70%{transform:scale(1);} }
        @keyframes glowPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(155,48,255,0.35);} 50%{box-shadow:0 0 0 14px rgba(155,48,255,0);} }
        @keyframes purpleGlow { 0%,100%{box-shadow:0 0 0 0 rgba(155,48,255,0.45);} 50%{box-shadow:0 0 0 14px rgba(155,48,255,0);} }
        @keyframes crownFloat { 0%,100%{transform:translateY(0) rotate(-3deg);} 50%{transform:translateY(-10px) rotate(3deg);} }
        @keyframes burst      { 0%{transform:rotate(var(--a,0deg)) translateX(0);opacity:1;} 100%{transform:rotate(var(--a,0deg)) translateX(var(--dist,30vw));opacity:0;} }
        @keyframes rayPulse   { 0%,100%{opacity:0.3;} 50%{opacity:0.85;} }
        @keyframes slowZoom   { from{transform:scale(1);} to{transform:scale(1.06);} }
        @keyframes imgFadeOut { from{opacity:1;} to{opacity:0;} }
        @keyframes flashBurst { 0%{opacity:0;} 30%{opacity:1;} 100%{opacity:0;} }
        @keyframes captionIn  { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
      `}</style>
    </div>
  );
}