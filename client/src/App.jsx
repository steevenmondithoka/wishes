import { useState, useEffect, useRef, useCallback } from "react";

import img1  from "./assets/Manasa5.jpeg";
import img2  from "./assets/US1.jpeg";
import img3  from "./assets/Looking at me.jpeg";
import img4  from "./assets/Shoulder.jpeg";
import img5  from "./assets/US4.jpeg";
import img6  from "./assets/US6.jpeg";
import img7  from "./assets/Manasa3.jpeg";
import img8  from "./assets/US2.jpeg";
import img9  from "./assets/cartoon.jpeg";
import img10 from "./assets/USMAIN.jpeg";
import herImg from "./assets/Manasamain.jpeg";
import music  from "./assets/Mr Majnu Bgm.mp3";
import music2 from "./assets/Nuvvunte-Chaley-BGM-Humming-Ringtone.mp3";
import music3 from "./assets/Chinni Gundelo Song Bgm.mp3";
import music4 from "./assets/Nee Raakane Naako Kala Ringtone Download - MobCup.Com.Co.mp3";

/* ══════════════════════════════════════════════════════════
   🎬 CUSTOMISE
══════════════════════════════════════════════════════════ */
const HER_NAME      = "Bangaram";
const SENDER_NAME   = "Yours Steeve ♥";
const BIRTHDAY_DATE = "2026-03-28";
const HER_IMAGE     = herImg;
const playlist      = [music, music2, music3, music4];
const AUTO_SCROLL_INTERVAL = 4500;

const MEMORY_IMAGES = [
  { src: img1,  cap: "Okka nee navvu chalu ♥" },
  { src: img2,  cap: "The best day 🌸" },
  { src: img3,  cap: "Favourite memory ✨" },
  { src: img4,  cap: "Always you ♥" },
  { src: img5,  cap: "Pure joy 🌻" },
  { src: img6,  cap: "Miss this 🌼" },
  { src: img7,  cap: "So pretty ✨" },
  { src: img8,  cap: "Crazy times 😄" },
  { src: img9,  cap: "Comedy moment 🌟" },
  { src: img10, cap: "Us, always ♥" },
];

// WhatsApp chat messages — feel free to edit these!
const CHAT_MESSAGES = [
  { from: "her", text: "Ma... emaina chesav aa? 👀",           delay: 400  },
  { from: "her", text: "Ento chala happy ga unna today 🥺",        delay: 1400 },
  { from: "me",  text: "Haha nenu emi cheyyale 😇",                delay: 2600 },
  { from: "her", text: "Adhi kaadhu... endhuku ma idantha ♥",   delay: 3800 },
  { from: "me",  text: "Nuvvu special...ma naaku 💜",           delay: 5200 },
  { from: "her", text: "Prove cheyi  😂",                      delay: 6600 },
  { from: "me",  text: "Idi choodhu 👇",                           delay: 7800 },
];

// Love letter lines
const LOVE_LETTER_LINES = [
  "Maa,",
  "",
  "Neeku oka vishayam cheppali anipistundi...",
  "Manam inthaku mundhu la happy ga undochu ga ma.",
  "Manam kalisi unnappude happy ga unnam ma.",
  "Nee matalu vinataniki nenu eppudu ready ga untanu.",
  "Oka pani chestunte — nuvvu naaku thodu untavani maatrame anipistundi.",
  "",
  "Nuvvu dull ga unte em bagodhu.",
  "Nuvvu happy ga unte — naaku baguntundhi.",
  "",
  "Idi love letter kaadu...",
  "Just want confess you let's start the things from your birthday ma.",
  "",
  "I Love You, Bangaram. ♥",
  "",
  `— ${SENDER_NAME}`,
];

// Dynamic final scene endings based on "Yes / No" answer
const ENDINGS = {
  yes: {
    headline: `Always Yours, ${HER_NAME} ♥`,
    sub:      "Nee navvu, nee voice, nee presence — anni naaku chaalu.\nStay happy. Stay you. I'm here. 💜",
  },
  no: {
    headline: `Still Yours, ${HER_NAME} ♥`,
    sub:      "괜찮아 — no pressure ever.\nFeelings don't need permission. I'll be here regardless. 💜",
  },
};

const SCENES = [
  { type: "msg",      text: `Hi ${HER_NAME} 🙂`,                              hold: 2800 },
  { type: "msg",      text: "Ela unnav...",                                    hold: 2800 },
  { type: "msg",      text: "Surprise enti anukuntunnava 🙂",                  hold: 1200 },
  { type: "msg",      text: "Neeku Telusu ga ma... ♥",                         hold: 2800 },
  { type: "card" },
  { type: "chat" },                          // 💬 WhatsApp chat scene
  { type: "msg",      text: "Konni rojulu dull and confused ga unnav...",      hold: 3000 },
  { type: "msg",      text: "Dont worry! 🙂",                                  hold: 2800 },
  { type: "msg",      text: "Eppudu Navvuthu Undu... 🙂",                      hold: 2800 },
  { type: "msg",      text: "O ma... niku oka vishayam chepdham anukuntunna", hold: 3200 },
  { type: "big",      lines: ["I Love You", `${HER_NAME} ♥`],                 hold: 3800 },
  { type: "letter" },                        // 💌 Love letter scroll
  { type: "msg",      text: `Nuv na life lo oka special part ${HER_NAME} ♥`, hold: 3200 },
  { type: "ask" },
  { type: "memories" },
  { type: "letters",  word: "SOMETHING SPECIAL IS COMING",                    hold: 3200 },
  { type: "final" },
];

/* ── helpers ──────────────────────────────────── */
function getTimeLeft(dateStr) {
  const t = new Date(dateStr); t.setHours(0,0,0,0);
  let d = t - new Date();
  if (d < 0) { t.setFullYear(t.getFullYear()+1); d = t - new Date(); }
  return {
    days:    Math.floor(d/86400000),
    hours:   Math.floor((d%86400000)/3600000),
    minutes: Math.floor((d%3600000)/60000),
    seconds: Math.floor((d%60000)/1000),
    isToday: Math.floor(d/86400000)===0 && Math.floor((d%86400000)/3600000)===0,
  };
}

function useTyping(text, active, speed=50) {
  const [out,setOut]   = useState("");
  const [done,setDone] = useState(false);
  useEffect(()=>{
    if (!active){setOut("");setDone(false);return;}
    setOut("");setDone(false);
    let i=0;
    const id=setInterval(()=>{ i++; setOut(text.slice(0,i)); if(i>=text.length){clearInterval(id);setDone(true);} },speed);
    return()=>clearInterval(id);
  },[text,active,speed]);
  return {out,done};
}

const Cursor=()=><span style={{display:"inline-block",width:2,height:"0.85em",background:"rgba(160,80,220,0.9)",marginLeft:3,verticalAlign:"middle",animation:"blink 1s step-end infinite"}}/>;

/* ── Particle canvas ──────────────────────────── */
function ParticleCanvas({active}){
  const ref=useRef();
  useEffect(()=>{
    if(!active)return;
    const cv=ref.current,ctx=cv.getContext("2d");
    let W=cv.width=window.innerWidth,H=cv.height=window.innerHeight;
    window.addEventListener("resize",()=>{W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;});
    const pts=Array.from({length:60},(_,i)=>({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-.5)*.35,vy:-(Math.random()*.6+.15),
      col:["#9B30FF","#7B2FBE","#BF5FFF","#D4A0FF","#5B1FA8","#E0BFFF"][i%6],
      life:Math.random(),char:["♥","·","✦","★","○","◆"][i%6],
      op:Math.random()*.45+.1,fontSize:Math.random()*10+7,
    }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{
        p.life+=.004;
        if(p.life>1){p.life=0;p.y=H+10;p.x=Math.random()*W;}
        p.x+=p.vx;p.y+=p.vy;
        ctx.globalAlpha=Math.sin(p.life*Math.PI)*p.op;
        ctx.fillStyle=p.col;ctx.font=`${p.fontSize}px serif`;
        ctx.fillText(p.char,p.x,p.y);
      });
      ctx.globalAlpha=1;raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(raf);
  },[active]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none"}}/>;
}

/* ── Fireworks canvas ─────────────────────────── */
function FireworksCanvas({active}){
  const ref=useRef();
  useEffect(()=>{
    if(!active)return;
    const cv=ref.current,ctx=cv.getContext("2d");
    let W=cv.width=window.innerWidth,H=cv.height=window.innerHeight;
    window.addEventListener("resize",()=>{W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;});
    const particles=[];
    const launch=()=>{
      const x=Math.random()*W*.8+W*.1;
      const y=Math.random()*H*.5+H*.1;
      const hue=Math.random()*60+260; // purple-pink range
      for(let i=0;i<60;i++){
        const angle=Math.random()*Math.PI*2;
        const speed=Math.random()*4+1;
        particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
          life:1,col:`hsl(${hue},90%,65%)`,r:Math.random()*3+1});
      }
    };
    let raf;
    const ids=[setTimeout(launch,200),setTimeout(launch,700),setTimeout(launch,1300),setTimeout(launch,2000),setTimeout(launch,2600)];
    const draw=()=>{
      ctx.fillStyle="rgba(3,0,10,0.18)";ctx.fillRect(0,0,W,H);
      for(let i=particles.length-1;i>=0;i--){
        const p=particles[i];
        p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.life-=.018;
        if(p.life<=0){particles.splice(i,1);continue;}
        ctx.globalAlpha=p.life;ctx.fillStyle=p.col;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);ids.forEach(clearTimeout);};
  },[active]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:2,pointerEvents:"none"}}/>;
}

/* ── Heart burst ──────────────────────────────── */
function HeartBurst(){
  return(
    <div style={{position:"fixed",inset:0,zIndex:3,pointerEvents:"none",overflow:"hidden"}}>
      {Array.from({length:50},(_,i)=>{
        const angle=Math.random()*360,dist=Math.random()*48+18;
        const size=Math.random()*20+10,dur=Math.random()*1.8+1.2,del=Math.random()*.8;
        return(<div key={i} style={{
          position:"absolute",top:"50%",left:"50%",
          fontSize:size,lineHeight:1,
          transform:`rotate(${angle}deg) translateX(0)`,
          animation:`heartBurst ${dur}s ${del}s ease-out forwards`,
          "--dist":`${dist}vw`,opacity:1,
        }}>♥</div>);
      })}
    </div>
  );
}

/* ── Light rays ───────────────────────────────── */
function LightRays(){
  return(
    <div style={{position:"fixed",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden"}}>
      {Array.from({length:8},(_,i)=>(
        <div key={i} style={{
          position:"absolute",top:"50%",left:"50%",width:3,height:"140vh",
          transformOrigin:"top center",
          transform:`translate(-50%,-5%) rotate(${i*45}deg)`,
          background:`linear-gradient(transparent,rgba(155,48,255,0.07) 30%,rgba(123,47,190,0.14) 50%,rgba(155,48,255,0.07) 70%,transparent)`,
          animation:`rayPulse ${2+i*.3}s ${i*.2}s ease-in-out infinite`,
        }}/>
      ))}
    </div>
  );
}

/* ── Purple burst ─────────────────────────────── */
function PurpleBurst(){
  return(
    <div style={{position:"fixed",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden"}}>
      {Array.from({length:70},(_,i)=>{
        const angle=Math.random()*360,dist=Math.random()*52+20;
        const size=Math.random()*6+2,dur=Math.random()*1.8+1.2,del=Math.random()*.8;
        const col=["#9B30FF","#7B2FBE","#BF5FFF","#D4A0FF","#E0BFFF","#fff"][i%6];
        return(<div key={i} style={{
          position:"absolute",top:"50%",left:"50%",
          width:size,height:size,borderRadius:"50%",
          background:col,boxShadow:`0 0 ${size*3}px ${col}`,
          transform:`rotate(${angle}deg) translateX(0)`,
          animation:`burst ${dur}s ${del}s ease-out forwards`,
          "--dist":`${dist}vw`,
        }}/>);
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   COUNTDOWN SCREEN
══════════════════════════════════════════════ */
function CountdownScreen({onStart}){
  const [time,setTime]=useState(()=>getTimeLeft(BIRTHDAY_DATE));
  const [burst,setBurst]=useState(false);
  const [enter,setEnter]=useState(false);
  useEffect(()=>{
    setTimeout(()=>setEnter(true),100);
    const id=setInterval(()=>setTime(getTimeLeft(BIRTHDAY_DATE)),1000);
    return()=>clearInterval(id);
  },[]);
  const handleBegin=()=>{setBurst(true);setTimeout(onStart,1800);};
  const isToday=time.isToday;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",
      opacity:enter?1:0,transform:enter?"translateY(0)":"translateY(28px)",
      transition:"opacity 1s ease,transform 1s ease",
      position:"relative",zIndex:10,padding:"0 24px",width:"100%",maxWidth:480}}>
      {burst&&<PurpleBurst/>}
      <div style={{fontSize:46,marginBottom:20,animation:"crownFloat 3s ease-in-out infinite",
        filter:"drop-shadow(0 0 18px rgba(155,48,255,0.9))"}}>M ♥ S</div>
      <p style={{color:"rgba(155,48,255,0.65)",fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:12,fontFamily:"'Georgia',serif"}}>
        {isToday?"it's finally here":"counting down to"}
      </p>
      <h1 style={{fontSize:"clamp(26px,7vw,44px)",fontWeight:200,color:"#fff",letterSpacing:"0.08em",
        margin:"0 0 8px",fontFamily:"'Georgia',serif",textShadow:"0 0 40px rgba(155,48,255,0.5)"}}>
        {HER_NAME}'s Surprise ✨
      </h1>
      <p style={{color:"rgba(255,255,255,0.22)",fontSize:12,letterSpacing:"0.14em",marginBottom:40}}>
        {new Date(BIRTHDAY_DATE).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
      </p>
      {!isToday&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,width:"100%",marginBottom:44}}>
          {[["days",time.days],["hours",time.hours],["mins",time.minutes],["secs",time.seconds]].map(([lbl,val])=>(
            <div key={lbl} style={{background:"rgba(155,48,255,0.07)",border:"1px solid rgba(155,48,255,0.28)",
              borderRadius:16,padding:"18px 8px 14px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 0%,rgba(155,48,255,0.12),transparent 70%)",borderRadius:16}}/>
              <div style={{fontSize:"clamp(28px,7vw,42px)",fontWeight:200,color:"#BF5FFF",fontFamily:"'Georgia',serif",
                textShadow:"0 0 20px rgba(155,48,255,0.7)",lineHeight:1}}>
                {String(val).padStart(2,"0")}
              </div>
              <div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginTop:8}}>{lbl}</div>
            </div>
          ))}
        </div>
      )}
      {isToday&&<div style={{fontSize:42,marginBottom:44,animation:"heartBeat 1.4s ease-in-out infinite"}}>🎂</div>}
      <button onClick={handleBegin} style={{
        background:"transparent",border:"1px solid rgba(155,48,255,0.6)",
        color:"rgba(191,95,255,0.95)",fontSize:14,fontWeight:300,letterSpacing:"0.14em",
        padding:"14px 56px",borderRadius:100,cursor:"pointer",fontFamily:"'Georgia',serif",
        animation:"purpleGlow 2.5s ease-in-out infinite",transition:"all 0.3s ease",position:"relative",zIndex:11}}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(155,48,255,0.15)";e.currentTarget.style.transform="scale(1.05)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.transform="scale(1)";}}
      >Open Chey Ma ✨</button>
      <p style={{color:"rgba(255,255,255,0.1)",fontSize:11,letterSpacing:"0.1em",marginTop:24}}>🎵 best with headphones</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MSG SCENE
══════════════════════════════════════════════ */
function MsgScene({scene,onDone}){
  const {out,done}=useTyping(scene.text,true,50);
  const held=useRef(false);
  useEffect(()=>{
    if(done&&!held.current){held.current=true;const t=setTimeout(onDone,scene.hold??3000);return()=>clearTimeout(t);}
  },[done]);
  return(
    <div style={{textAlign:"center",padding:"0 8px"}}>
      <p style={{fontSize:"clamp(20px,5.5vw,30px)",fontWeight:200,color:"rgba(255,255,255,0.9)",
        lineHeight:1.9,letterSpacing:"0.03em",minHeight:"2.5em",fontFamily:"'Georgia',serif"}}>
        {out}{!done&&<Cursor/>}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   💬 WHATSAPP CHAT SCENE
══════════════════════════════════════════════ */
function ChatScene({onDone}){
  const [visible,setVisible]=useState([]);
  const [typing,setTyping]=useState(null);
  const [done,setDone]=useState(false);
  const scrollRef=useRef();

  useEffect(()=>{
    let timers=[];
    CHAT_MESSAGES.forEach((msg,i)=>{
      // show "typing..." 800ms before message
      timers.push(setTimeout(()=>setTyping(msg.from),msg.delay-600));
      timers.push(setTimeout(()=>{
        setTyping(null);
        setVisible(v=>[...v,i]);
        setTimeout(()=>{
          if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight;
        },80);
      },msg.delay));
    });
    const last=CHAT_MESSAGES[CHAT_MESSAGES.length-1].delay+2200;
    timers.push(setTimeout(()=>setDone(true),last));
    return()=>timers.forEach(clearTimeout);
  },[]);

  return(
    <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      {/* Phone frame */}
      <div style={{
        width:"min(320px,90vw)",borderRadius:28,overflow:"hidden",
        border:"1px solid rgba(155,48,255,0.3)",
        boxShadow:"0 0 60px rgba(155,48,255,0.2),0 20px 60px rgba(0,0,0,0.6)",
        background:"#0a0010",
      }}>
        {/* WhatsApp top bar */}
        <div style={{
          background:"linear-gradient(135deg,#1a0030,#2d0050)",
          padding:"12px 16px",
          display:"flex",alignItems:"center",gap:10,
          borderBottom:"1px solid rgba(155,48,255,0.2)",
        }}>
          <div style={{width:38,height:38,borderRadius:"50%",overflow:"hidden",
            border:"2px solid rgba(155,48,255,0.5)",flexShrink:0}}>
            <img src={HER_IMAGE} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div>
            <p style={{color:"#fff",fontSize:14,fontWeight:400,margin:0,fontFamily:"sans-serif"}}>Mini</p>
            <p style={{color:"rgba(155,48,255,0.8)",fontSize:11,margin:0,fontFamily:"sans-serif"}}>
              {typing?"typing...":"online"}
            </p>
          </div>
          <div style={{marginLeft:"auto",fontSize:18,opacity:0.4}}>📞</div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{
          height:280,overflowY:"auto",padding:"12px 10px",
          display:"flex",flexDirection:"column",gap:8,
          background:"linear-gradient(to bottom,#06000f,#030008)",
          scrollbarWidth:"none",
        }}>
          {CHAT_MESSAGES.map((msg,i)=>visible.includes(i)&&(
            <div key={i} style={{
              display:"flex",
              justifyContent:msg.from==="me"?"flex-end":"flex-start",
              animation:"msgPop .35s cubic-bezier(.16,1,.3,1) both",
            }}>
              <div style={{
                maxWidth:"72%",padding:"9px 13px",
                borderRadius:msg.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                background:msg.from==="me"
                  ?"linear-gradient(135deg,#5B1FA8,#9B30FF)"
                  :"rgba(255,255,255,0.06)",
                border:msg.from==="me"?"none":"1px solid rgba(155,48,255,0.2)",
                boxShadow:msg.from==="me"?"0 4px 20px rgba(155,48,255,0.35)":"none",
              }}>
                <p style={{color:"rgba(255,255,255,0.92)",fontSize:13,margin:0,
                  fontFamily:"sans-serif",lineHeight:1.5}}>{msg.text}</p>
                <p style={{color:"rgba(255,255,255,0.2)",fontSize:9,margin:"4px 0 0",
                  textAlign:"right",fontFamily:"sans-serif"}}>
                  {msg.from==="me"?"✓✓ ":""}
                  {new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}
                </p>
              </div>
            </div>
          ))}
          {typing&&(
            <div style={{display:"flex",justifyContent:typing==="me"?"flex-end":"flex-start"}}>
              <div style={{padding:"10px 14px",borderRadius:18,
                background:"rgba(255,255,255,0.05)",border:"1px solid rgba(155,48,255,0.15)"}}>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  {[0,1,2].map(d=>(
                    <div key={d} style={{width:5,height:5,borderRadius:"50%",background:"#9B30FF",
                      animation:`typingDot 1.2s ${d*.2}s ease-in-out infinite`}}/>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {done&&(
        <SlimBtn onClick={onDone} label="Continue →" color="purple"
          extraStyle={{animation:"fadeUp .5s ease"}}/>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   💌 LOVE LETTER SCROLL SCENE
══════════════════════════════════════════════ */
function LetterScene({onDone}){
  const [visLines,setVisLines]=useState([]);
  const [showBtn,setShowBtn]=useState(false);
  const scrollRef=useRef();

  useEffect(()=>{
    let timers=[];
    LOVE_LETTER_LINES.forEach((_,i)=>{
      timers.push(setTimeout(()=>{
        setVisLines(v=>[...v,i]);
        setTimeout(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},80);
      },600+i*350));
    });
    timers.push(setTimeout(()=>setShowBtn(true),600+LOVE_LETTER_LINES.length*350+600));
    return()=>timers.forEach(clearTimeout);
  },[]);

  return(
    <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      {/* Envelope header */}
      <div style={{textAlign:"center",marginBottom:4}}>
        <div style={{fontSize:32,animation:"floatY 3s ease-in-out infinite",
          filter:"drop-shadow(0 0 16px rgba(155,48,255,0.7))"}}>💌</div>
        <p style={{color:"rgba(155,48,255,0.55)",fontSize:9,letterSpacing:"0.3em",
          textTransform:"uppercase",marginTop:8}}>a letter for you</p>
      </div>

      {/* Paper */}
      <div ref={scrollRef} style={{
        width:"min(340px,90vw)",maxHeight:340,overflowY:"auto",
        background:"linear-gradient(135deg,rgba(30,5,55,0.95),rgba(20,0,40,0.98))",
        border:"1px solid rgba(155,48,255,0.25)",
        borderRadius:20,padding:"24px 22px",
        boxShadow:"0 0 60px rgba(155,48,255,0.15),0 20px 60px rgba(0,0,0,0.5)",
        scrollbarWidth:"none",position:"relative",
      }}>
        {/* decorative corner */}
        <div style={{position:"absolute",top:12,right:14,opacity:.25,fontSize:18}}>✦</div>
        <div style={{position:"absolute",bottom:12,left:14,opacity:.2,fontSize:14}}>✦</div>

        {LOVE_LETTER_LINES.map((line,i)=>(
          <p key={i} style={{
            color:line===`— ${SENDER_NAME}`?"rgba(155,48,255,0.8)":"rgba(255,255,255,0.85)",
            fontSize:line==="Bangaram,"?18:line.startsWith("I Love You")?20:14,
            fontWeight:line==="Bangaram,"||line.startsWith("I Love You")?300:200,
            fontFamily:"'Georgia',serif",
            lineHeight:1.9,margin:line===""?"6px 0":"0 0 2px",
            letterSpacing:"0.03em",
            opacity:visLines.includes(i)?1:0,
            transform:visLines.includes(i)?"translateY(0)":"translateY(12px)",
            transition:"opacity .5s ease,transform .5s ease",
            textShadow:line.startsWith("I Love You")?"0 0 20px rgba(155,48,255,0.5)":"none",
          }}>{line||"\u00a0"}</p>
        ))}
      </div>

      {showBtn&&<SlimBtn onClick={onDone} label="Continue →" color="purple"/>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   BIG SCENE
══════════════════════════════════════════════ */
function BigScene({scene,onDone}){
  const [step,setStep]=useState(0);
  const [fireworks,setFireworks]=useState(false);
  useEffect(()=>{
    const t1=setTimeout(()=>setStep(1),500);
    const t2=setTimeout(()=>{setStep(2);setFireworks(true);},1700);
    const t3=setTimeout(()=>setFireworks(false),4500);
    const t4=setTimeout(onDone,(scene.hold??3800)+300);
    return()=>{[t1,t2,t3,t4].forEach(clearTimeout);};
  },[]);
  return(
    <>
      {fireworks&&<FireworksCanvas active/>}
      <div style={{textAlign:"center",lineHeight:1.3,position:"relative",zIndex:5}}>
        {scene.lines.map((line,i)=>(
          <div key={i} style={{
            fontSize:i===0?"clamp(22px,5.5vw,34px)":"clamp(38px,10vw,66px)",
            fontWeight:i===0?200:300,
            color:i===0?"rgba(255,255,255,0.5)":"#BF5FFF",
            letterSpacing:i===0?"0.22em":"0.06em",
            textTransform:i===0?"uppercase":"none",
            fontFamily:"'Georgia',serif",
            opacity:step>i?1:0,
            transform:step>i?"translateY(0) scale(1)":"translateY(34px) scale(0.86)",
            transition:"opacity 1.1s ease,transform 1.1s cubic-bezier(.16,1,.3,1)",
            transitionDelay:`${i*.18}s`,
            textShadow:i===1?"0 0 40px rgba(155,48,255,0.7)":"none",
          }}>{line}</div>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════
   LETTERS SCENE
══════════════════════════════════════════════ */
function LettersScene({scene,onDone}){
  const [vis,setVis]=useState([]);
  useEffect(()=>{
    const letters=scene.word.split("");
    letters.forEach((_,i)=>setTimeout(()=>setVis(v=>[...v,i]),i*160+400));
    setTimeout(onDone,letters.length*160+(scene.hold??3200));
  },[]);
  return(
    <div style={{display:"flex",gap:"clamp(3px,1.5vw,10px)",justifyContent:"center",flexWrap:"wrap",maxWidth:360}}>
      {scene.word.split("").map((l,i)=>(
        <span key={i} style={{
          fontSize:l===" "?"0.5em":"clamp(20px,5vw,38px)",
          fontWeight:200,color:vis.includes(i)?"#BF5FFF":"transparent",
          fontFamily:"'Georgia',serif",
          opacity:vis.includes(i)?1:0,
          transform:vis.includes(i)?"translateY(0) scale(1)":"translateY(44px) scale(0.55)",
          transition:"opacity .6s ease,transform .6s cubic-bezier(.16,1,.3,1)",
          textShadow:vis.includes(i)?"0 0 25px rgba(155,48,255,0.7)":"none",
          minWidth:l===" "?8:undefined,
        }}>{l}</span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   BIRTHDAY CARD
══════════════════════════════════════════════ */
function CardScene({onDone}){
  const [inn,setInn]=useState(false);
  const [showBtn,setShowBtn]=useState(false);
  useEffect(()=>{setTimeout(()=>setInn(true),120);setTimeout(()=>setShowBtn(true),2000);});
  return(
    <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:20,
      opacity:inn?1:0,transform:inn?"scale(1)":"scale(0.9)",
      transition:"opacity 1s ease,transform 1s cubic-bezier(.16,1,.3,1)"}}>
      <div style={{width:"min(310px,86vw)",borderRadius:28,overflow:"hidden",position:"relative",
        boxShadow:"0 0 100px rgba(155,48,255,0.3),0 0 40px rgba(123,47,190,0.25),0 30px 80px rgba(0,0,0,0.7)",
        border:"1px solid rgba(155,48,255,0.25)"}}>
        <img src={HER_IMAGE} alt={HER_NAME} style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",display:"block",
          filter:"brightness(0.78) saturate(1.2) contrast(1.05)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(60,0,100,0.2) 0%,transparent 40%,rgba(0,0,0,0.85) 75%,rgba(0,0,0,0.95) 100%)"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"60px 24px 30px",textAlign:"center"}}>
          <p style={{color:"rgba(191,95,255,0.7)",fontSize:10,letterSpacing:"0.28em",textTransform:"uppercase",marginBottom:10}}>
            🎂 your special day
          </p>
          <h2 style={{color:"#fff",fontSize:"clamp(26px,7vw,40px)",fontWeight:200,letterSpacing:"0.07em",
            margin:"0 0 6px",fontFamily:"'Georgia',serif",textShadow:"0 0 30px rgba(255,255,255,0.3)"}}>
            Happy Birthday
          </h2>
          <p style={{color:"#BF5FFF",fontSize:"clamp(22px,5.5vw,30px)",fontWeight:300,margin:0,
            fontFamily:"'Georgia',serif",textShadow:"0 0 20px rgba(155,48,255,0.7)"}}>{HER_NAME} ♥</p>
        </div>
      </div>
      {showBtn&&<SlimBtn onClick={onDone} label="Continue →" color="purple"/>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ASK SCENE — stores answer in global ref
══════════════════════════════════════════════ */
function AskScene({onYes,onNo}){
  const [step,setStep]=useState(0);
  useEffect(()=>{setTimeout(()=>setStep(1),600);setTimeout(()=>setStep(2),1700);});
  return(
    <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:38}}>
      <div style={{opacity:step>=1?1:0,transform:step>=1?"translateY(0)":"translateY(26px)",
        transition:"opacity 0.9s ease,transform 0.9s ease"}}>
        <div style={{fontSize:36,marginBottom:16,animation:"floatY 3s ease-in-out infinite",
          filter:"drop-shadow(0 0 16px rgba(155,48,255,0.6))"}}>💜</div>
        <p style={{color:"rgba(255,255,255,0.25)",fontSize:10,letterSpacing:"0.24em",
          textTransform:"uppercase",marginBottom:16}}>one question...</p>
        <p style={{fontSize:"clamp(18px,5vw,28px)",fontWeight:200,color:"rgba(255,255,255,0.9)",
          lineHeight:1.8,fontFamily:"'Georgia',serif"}}>
          Nenu neeku "special" antava? 
        </p>
      </div>
      {step>=2&&(
        <div style={{display:"flex",gap:14,animation:"fadeUp 0.5s ease"}}>
          <button onClick={onYes} style={{
            background:"rgba(155,48,255,0.15)",border:"1px solid rgba(155,48,255,0.55)",
            color:"#BF5FFF",fontSize:15,fontWeight:300,padding:"13px 44px",
            borderRadius:100,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.1em",
            animation:"glowPulse 2.5s ease-in-out infinite",transition:"all .25s ease"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(155,48,255,0.28)";e.currentTarget.style.transform="scale(1.06)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(155,48,255,0.15)";e.currentTarget.style.transform="scale(1)";}}
          >Avunu ♥</button>
          <button onClick={onNo} style={{
            background:"transparent",border:"1px solid rgba(255,255,255,0.1)",
            color:"rgba(255,255,255,0.28)",fontSize:15,fontWeight:300,padding:"13px 44px",
            borderRadius:100,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.1em",
            transition:"all .25s ease"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.28)";e.currentTarget.style.color="rgba(255,255,255,0.55)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.28)";}}
          >Telidhu 🙂</button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MEMORIES GALLERY
══════════════════════════════════════════════ */
function MemoriesScene({onDone}){
  const [idx,setIdx]=useState(0);
  const [prev,setPrev]=useState(null);
  const [transitioning,setTr]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const [raysOn,setRaysOn]=useState(false);
  const [glowPeak,setGlowPeak]=useState(false);
  const [titleIn,setTitleIn]=useState(false);
  const [progress,setProgress]=useState(0);
  const autoRef=useRef(null);
  const progressRef=useRef(null);

  useEffect(()=>{setTimeout(()=>setTitleIn(true),200);startAuto();return()=>clearAll();;},[]);

  const clearAll=()=>{if(autoRef.current)clearTimeout(autoRef.current);if(progressRef.current)cancelAnimationFrame(progressRef.current);};

  const animateProgress=(startVal=0)=>{
    if(progressRef.current)cancelAnimationFrame(progressRef.current);
    const startT=performance.now();
    const tick=(now)=>{
      const pct=Math.min(startVal+(now-startT)/AUTO_SCROLL_INTERVAL*100,100);
      setProgress(pct);
      if(pct<100)progressRef.current=requestAnimationFrame(tick);
    };
    progressRef.current=requestAnimationFrame(tick);
  };

  const startAuto=()=>{clearAll();setProgress(0);animateProgress(0);autoRef.current=setTimeout(()=>goNext(true),AUTO_SCROLL_INTERVAL);};

  const goTo=(nextIdx)=>{
    if(transitioning)return;
    clearAll();setTr(true);setRaysOn(true);setGlowPeak(true);
    setTimeout(()=>setGlowPeak(false),600);
    setTimeout(()=>{setPrev(idx);setIdx(nextIdx);setLoaded(false);setTimeout(()=>{setTr(false);setRaysOn(false);startAuto();},100);},350);
  };

  const goNext=(auto=false)=>{
    if(!auto&&idx===MEMORY_IMAGES.length-1){onDone();return;}
    if(idx<MEMORY_IMAGES.length-1)goTo(idx+1);
    else if(auto)onDone();
  };
  const goPrev=()=>{if(idx>0)goTo(idx-1);};

  const handleDownload=async()=>{
    const src=MEMORY_IMAGES[idx].src;
    try{
      const blob=await(await fetch(src)).blob();
      const a=document.createElement("a");a.href=URL.createObjectURL(blob);
      a.download=`memory_${idx+1}.jpg`;a.click();URL.revokeObjectURL(a.href);
    }catch{const a=document.createElement("a");a.href=src;a.target="_blank";a.download=`memory_${idx+1}.jpg`;a.click();}
  };

  const img=MEMORY_IMAGES[idx];
  const prevImg=prev!==null?MEMORY_IMAGES[prev]:null;
  const isLast=idx===MEMORY_IMAGES.length-1;

  return(
    <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:0,position:"relative"}}>
      {raysOn&&<LightRays/>}
      <div style={{textAlign:"center",marginBottom:18,
        opacity:titleIn?1:0,transform:titleIn?"translateY(0)":"translateY(20px)",
        transition:"opacity 0.8s ease,transform 0.8s ease"}}>
        <p style={{color:"rgba(155,48,255,0.65)",fontSize:9,letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:6}}>our memories</p>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:12,letterSpacing:"0.1em",fontFamily:"'Georgia',serif"}}>
          {idx+1} / {MEMORY_IMAGES.length}
        </p>
      </div>
      <div style={{width:"min(340px,92vw)",position:"relative",borderRadius:28,overflow:"visible"}}>
        {/* outer rings */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
          width:"min(400px,108vw)",height:"min(520px,135vw)",borderRadius:36,
          border:`1px solid rgba(155,48,255,${glowPeak?.55:.15})`,
          boxShadow:`0 0 ${glowPeak?90:35}px rgba(155,48,255,${glowPeak?.3:.08})`,
          transition:"box-shadow .5s ease,border-color .5s ease",pointerEvents:"none",zIndex:3}}/>
        {/* photo frame */}
        <div style={{borderRadius:28,overflow:"hidden",position:"relative",
          boxShadow:`0 0 ${glowPeak?130:65}px rgba(155,48,255,${glowPeak?.4:.2}),0 40px 100px rgba(0,0,0,0.75)`,
          transition:"box-shadow .5s ease",border:"1px solid rgba(155,48,255,0.18)"}}>
          {prevImg&&transitioning&&<img src={prevImg.src} alt="" style={{
            position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",
            filter:"brightness(0.7)",zIndex:1,animation:"imgFadeOut .35s ease forwards"}}/>}
          <img key={idx} src={img.src} alt={img.cap} onLoad={()=>setLoaded(true)} style={{
            width:"100%",aspectRatio:"3/4",objectFit:"cover",display:"block",
            filter:"brightness(0.78) saturate(1.25) contrast(1.08)",
            opacity:loaded?1:0,
            transform:loaded?"scale(1) translateX(0)":"scale(1.05) translateX(30px)",
            transition:"opacity .7s ease,transform .7s cubic-bezier(.16,1,.3,1)",
            animation:loaded?"slowZoom 8s ease-out forwards":"none",
            zIndex:2,position:"relative"}}/>
          {transitioning&&<div style={{position:"absolute",inset:0,zIndex:5,
            background:"radial-gradient(circle at 50% 50%,rgba(155,48,255,0.18),transparent 70%)",
            animation:"flashBurst .4s ease forwards"}}/>}
          {/* bottom controls */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:6,
            padding:"80px 16px 18px",
            background:"linear-gradient(transparent,rgba(10,0,20,.55) 30%,rgba(5,0,15,.92) 100%)"}}>
            <p key={`cap-${idx}`} style={{color:"rgba(255,255,255,0.92)",fontSize:14,fontWeight:300,
              letterSpacing:"0.06em",margin:"0 0 14px",textAlign:"center",
              fontFamily:"'Georgia',serif",animation:"captionIn .6s .3s ease both"}}>{img.cap}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
              <Btn onClick={goPrev} disabled={idx===0} label="‹" size={38}/>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center",flex:1}}>
                {MEMORY_IMAGES.map((_,i)=>(
                  <div key={i} onClick={()=>goTo(i)} style={{
                    width:i===idx?16:5,height:5,borderRadius:5,cursor:"pointer",
                    background:i===idx?"#9B30FF":i<idx?"rgba(155,48,255,0.4)":"rgba(255,255,255,0.12)",
                    transition:"all .4s cubic-bezier(.4,0,.2,1)",
                    boxShadow:i===idx?"0 0 8px rgba(155,48,255,0.8)":"none"}}/>
                ))}
              </div>
              <Btn onClick={()=>goNext(false)} label={isLast?"Finish ✨":"›"} size={isLast?64:38} wide={isLast} pulse={isLast}/>
              <Btn onClick={handleDownload} label="⬇" size={38} title="Download"/>
            </div>
          </div>
          {/* top glow */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:80,zIndex:4,
            background:"linear-gradient(rgba(80,10,130,0.25),transparent)",pointerEvents:"none"}}/>
          {/* corner marks */}
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
            <div key={i} style={{position:"absolute",[v]:8,[h]:8,width:18,height:18,zIndex:7,pointerEvents:"none",
              borderTop:v==="top"?"1px solid rgba(155,48,255,0.6)":"none",
              borderBottom:v==="bottom"?"1px solid rgba(155,48,255,0.6)":"none",
              borderLeft:h==="left"?"1px solid rgba(155,48,255,0.6)":"none",
              borderRight:h==="right"?"1px solid rgba(155,48,255,0.6)":"none",
              opacity:glowPeak?1:.4,transition:"opacity .4s ease"}}/>
          ))}
        </div>
        {/* progress bar */}
        <div style={{marginTop:14,width:"100%",height:3,background:"rgba(155,48,255,0.1)",borderRadius:3}}>
          <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#6A0DAD,#BF5FFF)",
            borderRadius:3,boxShadow:"0 0 10px rgba(155,48,255,0.6)",transition:"width .1s linear"}}/>
        </div>
        <p style={{textAlign:"center",marginTop:10,color:"rgba(255,255,255,0.14)",fontSize:10,letterSpacing:"0.14em"}}>
          ↺ auto-scrolling · tap dots to jump · ⬇ to save
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DYNAMIC FINAL SCENE
══════════════════════════════════════════════ */
function FinalScene({answer,onReplay}){
  const [p,setP]=useState(0);
  const [hearts,setHearts]=useState(false);
  const [fireworks,setFireworks]=useState(false);
  const ending=ENDINGS[answer]||ENDINGS.yes;

  useEffect(()=>{
    const ts=[
      setTimeout(()=>setP(1),400),
      setTimeout(()=>{setP(2);setFireworks(true);},1200),
      setTimeout(()=>setP(3),2200),
      setTimeout(()=>setP(4),3100),
      setTimeout(()=>{setP(5);setHearts(true);},4000),
      setTimeout(()=>setFireworks(false),5500),
    ];
    return()=>ts.forEach(clearTimeout);
  },[]);

  const fade=(n)=>({
    opacity:p>=n?1:0,transform:p>=n?"translateY(0)":"translateY(18px)",
    transition:"opacity .9s ease,transform .9s ease",
  });

  return(
    <>
      {fireworks&&<FireworksCanvas active/>}
      {hearts&&<HeartBurst/>}
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:20,position:"relative",zIndex:5}}>
        <div style={fade(1)}>
          <div style={{fontSize:54,animation:"heartBeat 1.8s ease-in-out infinite",
            filter:"drop-shadow(0 0 22px rgba(155,48,255,0.8))"}}>♥</div>
        </div>
        <div style={fade(2)}>
          <p style={{color:"rgba(255,255,255,0.22)",fontSize:10,letterSpacing:"0.3em",
            textTransform:"uppercase",marginBottom:14}}>always & forever</p>
          <h1 style={{fontSize:"clamp(24px,6.5vw,46px)",fontWeight:200,letterSpacing:"0.06em",
            margin:0,fontFamily:"'Georgia',serif",
            background:"linear-gradient(135deg,#fff 15%,#9B30FF 40%,#D4A0FF 65%,#BF5FFF)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
            filter:"drop-shadow(0 0 20px rgba(155,48,255,0.4))"}}>
            {ending.headline}
          </h1>
        </div>
        <div style={{...fade(3),maxWidth:300}}>
          <p style={{color:"rgba(255,255,255,0.35)",fontSize:14,fontWeight:300,
            lineHeight:2,letterSpacing:"0.05em",margin:0,fontFamily:"'Georgia',serif",
            whiteSpace:"pre-line"}}>{ending.sub}</p>
        </div>
        <div style={fade(4)}>
          <p style={{color:"rgba(155,48,255,0.6)",fontSize:13,letterSpacing:"0.16em"}}>— {SENDER_NAME}</p>
        </div>
        {/* Replay button */}
        {p>=5&&(
          <div style={{...fade(5),marginTop:8}}>
            <button onClick={onReplay} style={{
              background:"rgba(155,48,255,0.12)",border:"1px solid rgba(155,48,255,0.4)",
              color:"rgba(191,95,255,0.8)",fontSize:13,fontWeight:300,letterSpacing:"0.14em",
              padding:"12px 36px",borderRadius:100,cursor:"pointer",fontFamily:"inherit",
              display:"flex",alignItems:"center",gap:8,transition:"all .25s ease",
              animation:"fadeUp .5s ease",}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(155,48,255,0.25)";e.currentTarget.style.transform="scale(1.05)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(155,48,255,0.12)";e.currentTarget.style.transform="scale(1)";}}
            >↺ Replay from start</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Reusable icon button ─────────────────────── */
function Btn({onClick,label,disabled,size=38,wide=false,pulse=false,title}){
  return(
    <button onClick={onClick} disabled={disabled} title={title} style={{
      background:disabled?"rgba(255,255,255,0.03)":"rgba(155,48,255,0.12)",
      border:`1px solid ${disabled?"rgba(255,255,255,0.06)":"rgba(155,48,255,0.45)"}`,
      color:disabled?"rgba(255,255,255,0.15)":"#BF5FFF",
      fontSize:wide?11:18,width:wide?size:size,height:size,
      borderRadius:wide?100:50,cursor:disabled?"default":"pointer",
      display:"flex",alignItems:"center",justifyContent:"center",letterSpacing:"0.08em",
      fontFamily:"inherit",transition:"all .2s ease",flexShrink:0,
      animation:pulse?"glowPulse 2.5s ease-in-out infinite":"none"}}
      onMouseEnter={e=>{ if(!disabled){e.currentTarget.style.background="rgba(155,48,255,0.25)";e.currentTarget.style.transform="scale(1.08)";} }}
      onMouseLeave={e=>{ if(!disabled){e.currentTarget.style.background="rgba(155,48,255,0.12)";e.currentTarget.style.transform="scale(1)";} }}
    >{label}</button>
  );
}

/* ── Slim button ──────────────────────────────── */
function SlimBtn({onClick,label,extraStyle={}}){
  return(
    <button onClick={onClick} style={{
      background:"transparent",border:"1px solid rgba(155,48,255,0.45)",
      color:"rgba(191,95,255,0.9)",fontSize:13,fontWeight:300,letterSpacing:"0.12em",
      padding:"12px 38px",borderRadius:100,cursor:"pointer",fontFamily:"inherit",
      animation:"glowPulse 2.8s ease-in-out infinite",transition:"all .25s ease",...extraStyle}}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(155,48,255,0.12)";e.currentTarget.style.transform="scale(1.04)";}}
      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.transform="scale(1)";}}
    >{label}</button>
  );
}

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App(){
  const [phase,   setPhase]   = useState("countdown");
  const [sceneIdx,setSceneIdx]= useState(0);
  const [fadeIn,  setFadeIn]  = useState(false);
  const [sceneKey,setSceneKey]= useState(0);
  const [answer,  setAnswer]  = useState(null); // "yes" | "no"
  const audioRef   = useRef(null);
  const [songIndex,setSongIndex]=useState(0);

  // Playlist cycling
  useEffect(()=>{
    const audio=audioRef.current; if(!audio)return;
    const onEnd=()=>setSongIndex(p=>(p+1)%playlist.length);
    audio.addEventListener("ended",onEnd);
    return()=>audio.removeEventListener("ended",onEnd);
  },[songIndex]);
  useEffect(()=>{
    if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0;audioRef.current.play().catch(()=>{});}
  },[songIndex]);

  const goto=(idx)=>{
    setFadeIn(false);
    setTimeout(()=>{ setSceneIdx(idx);setSceneKey(k=>k+1);setTimeout(()=>setFadeIn(true),80); },480);
  };
  const advance=useCallback(()=>goto(s=>s+1),[]);
  // advance using functional update
  const advanceFn=useCallback(()=>{
    setFadeIn(false);
    setTimeout(()=>{ setSceneIdx(i=>i+1);setSceneKey(k=>k+1);setTimeout(()=>setFadeIn(true),80); },480);
  },[]);

  const handleStart=()=>{
    if(audioRef.current){audioRef.current.volume=0.15;audioRef.current.play().catch(()=>{});}
    setPhase("scenes");setTimeout(()=>setFadeIn(true),120);
  };

  const handleYes=()=>{ setAnswer("yes"); advanceFn(); };
  const handleNo =()=>{ setAnswer("no");  advanceFn(); };

  const handleNoMemories=()=>{
    setFadeIn(false);
    setTimeout(()=>{
      setSceneIdx(SCENES.findIndex(s=>s.type==="letters"));
      setSceneKey(k=>k+1);setTimeout(()=>setFadeIn(true),80);
    },480);
  };

  const handleReplay=()=>{
    setAnswer(null);setSceneIdx(0);setSceneKey(k=>k+1);setFadeIn(false);
    setPhase("countdown");
  };

  const scene=SCENES[Math.min(sceneIdx,SCENES.length-1)];
  const showDots=phase==="scenes"&&["msg","big","letters"].includes(scene?.type);

  return(
    <div style={{minHeight:"100dvh",width:"100%",background:"#03000A",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      fontFamily:"'Georgia','Times New Roman',serif",position:"relative",overflow:"hidden"}}>

      {/* Ambient bg */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:`
        radial-gradient(ellipse 80% 60% at 20% 15%,rgba(80,10,130,0.22) 0%,transparent 55%),
        radial-gradient(ellipse 70% 50% at 85% 80%,rgba(60,5,100,0.18) 0%,transparent 50%),
        radial-gradient(ellipse 50% 40% at 50% 50%,rgba(155,48,255,0.04) 0%,transparent 60%)`}}/>

      <ParticleCanvas active={phase==="scenes"}/>

      <audio ref={audioRef} src={playlist[songIndex]} key={songIndex}/>

      {phase==="countdown"&&<CountdownScreen onStart={handleStart}/>}

      {phase==="scenes"&&(
        <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:460,
          padding:"80px 24px 60px",display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",minHeight:"100dvh",
          opacity:fadeIn?1:0,transform:fadeIn?"translateY(0)":"translateY(20px)",
          transition:"opacity .6s ease,transform .6s cubic-bezier(.16,1,.3,1)"}}>

          {showDots&&(
            <div style={{position:"absolute",top:32,left:0,right:0,display:"flex",gap:5,justifyContent:"center"}}>
              {SCENES.filter(s=>["msg","big","letters"].includes(s.type)).map((_,i)=>(
                <div key={i} style={{width:4,height:4,borderRadius:"50%",
                  background:i<sceneIdx?"rgba(155,48,255,0.55)":i===sceneIdx?"rgba(191,95,255,1)":"rgba(255,255,255,0.1)",
                  transition:"background .4s ease"}}/>
              ))}
            </div>
          )}

          <div key={sceneKey} style={{width:"100%",display:"flex",justifyContent:"center"}}>
            {scene.type==="msg"      &&<MsgScene      key={sceneKey} scene={scene} onDone={advanceFn}/>}
            {scene.type==="big"      &&<BigScene      key={sceneKey} scene={scene} onDone={advanceFn}/>}
            {scene.type==="letters"  &&<LettersScene  key={sceneKey} scene={scene} onDone={advanceFn}/>}
            {scene.type==="card"     &&<CardScene     key={sceneKey} onDone={advanceFn}/>}
            {scene.type==="chat"     &&<ChatScene     key={sceneKey} onDone={advanceFn}/>}
            {scene.type==="letter"   &&<LetterScene   key={sceneKey} onDone={advanceFn}/>}
            {scene.type==="ask"      &&<AskScene      key={sceneKey} onYes={handleYes} onNo={handleNo}/>}
            {scene.type==="memories" &&<MemoriesScene key={sceneKey} onDone={advanceFn}/>}
            {scene.type==="final"    &&<FinalScene    key={sceneKey} answer={answer} onReplay={handleReplay}/>}
          </div>

          {!["card","memories","ask","final","chat","letter"].includes(scene?.type)&&(
            <p style={{position:"absolute",bottom:24,left:0,right:0,textAlign:"center",
              color:"rgba(155,48,255,0.1)",fontSize:10,letterSpacing:"0.28em"}}>♥ ♥ ♥</p>
          )}
        </div>
      )}

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:#03000A;overflow:hidden;}
        ::-webkit-scrollbar{display:none;}

        @keyframes fadeUp     {from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
        @keyframes blink      {0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes heartBeat  {0%,100%{transform:scale(1);}14%{transform:scale(1.38);}28%{transform:scale(1);}42%{transform:scale(1.2);}70%{transform:scale(1);}}
        @keyframes glowPulse  {0%,100%{box-shadow:0 0 0 0 rgba(155,48,255,0.35);}50%{box-shadow:0 0 0 14px rgba(155,48,255,0);}}
        @keyframes purpleGlow {0%,100%{box-shadow:0 0 0 0 rgba(155,48,255,0.45);}50%{box-shadow:0 0 0 14px rgba(155,48,255,0);}}
        @keyframes crownFloat {0%,100%{transform:translateY(0) rotate(-3deg);}50%{transform:translateY(-10px) rotate(3deg);}}
        @keyframes burst      {0%{transform:rotate(var(--a,0deg)) translateX(0);opacity:1;}100%{transform:rotate(var(--a,0deg)) translateX(var(--dist,30vw));opacity:0;}}
        @keyframes heartBurst {0%{transform:rotate(var(--a,0deg)) translateX(0);opacity:1;}100%{transform:rotate(var(--a,0deg)) translateX(var(--dist,35vw)) scale(0.3);opacity:0;}}
        @keyframes rayPulse   {0%,100%{opacity:0.3;}50%{opacity:0.85;}}
        @keyframes slowZoom   {from{transform:scale(1);}to{transform:scale(1.06);}}
        @keyframes imgFadeOut {from{opacity:1;}to{opacity:0;}}
        @keyframes flashBurst {0%{opacity:0;}30%{opacity:1;}100%{opacity:0;}}
        @keyframes captionIn  {from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes msgPop     {from{opacity:0;transform:scale(0.85) translateY(10px);}to{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes typingDot  {0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes floatY     {0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
      `}</style>
    </div>
  );
}