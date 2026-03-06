import { useState, useEffect, useRef } from "react";

// ─── Palette & Constants ────────────────────────────────────────────────
const C = {
  bg: "#0D0D12",
  surface: "#16161E",
  card: "#1C1C28",
  cardHover: "#22222F",
  accent: "#E8A838",
  accentSoft: "rgba(232,168,56,0.12)",
  accentGlow: "rgba(232,168,56,0.25)",
  blue: "#5B8DEF",
  blueSoft: "rgba(91,141,239,0.12)",
  pink: "#E85B93",
  pinkSoft: "rgba(232,91,147,0.12)",
  green: "#4ADE80",
  greenSoft: "rgba(74,222,128,0.12)",
  purple: "#A78BFA",
  purpleSoft: "rgba(167,139,250,0.12)",
  cyan: "#22D3EE",
  cyanSoft: "rgba(34,211,238,0.12)",
  text: "#E8E8ED",
  textMuted: "#9898A8",
  textDim: "#6B6B7B",
  border: "#2A2A38",
  borderLight: "#35354A",
};

const SECTIONS = [
  { id: "intro", label: "Introduction", icon: "🎬", time: "10 min" },
  { id: "part1", label: "Text-to-Image", icon: "🖼️", time: "25 min" },
  { id: "part2", label: "Image-to-Video", icon: "🎥", time: "20 min" },
  { id: "workflow", label: "Full Pipeline", icon: "🔄", time: "10 min" },
  { id: "lab", label: "Hands-on Lab", icon: "🧪", time: "15 min" },
  { id: "ethics", label: "Ethics & Tips", icon: "⚖️", time: "10 min" },
  { id: "activity", label: "Class Activity", icon: "✏️", time: "In-class" },
];

// ─── Shared Components ──────────────────────────────────────────────────
const Badge = ({ children, color = C.accent, bg }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 6,
    fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
    color: color, background: bg || `${color}18`,
    border: `1px solid ${color}30`,
  }}>{children}</span>
);

const SectionTitle = ({ icon, title, subtitle, color = C.accent }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0, fontFamily: "'Playfair Display', serif" }}>{title}</h2>
    </div>
    {subtitle && <p style={{ color: C.textMuted, fontSize: 15, margin: 0, paddingLeft: 42, lineHeight: 1.6 }}>{subtitle}</p>}
    <div style={{ height: 3, width: 60, background: color, borderRadius: 2, marginTop: 12, marginLeft: 42 }} />
  </div>
);

const Card = ({ children, style, accent }) => (
  <div style={{
    background: C.card, borderRadius: 14, padding: 24,
    border: `1px solid ${C.border}`,
    borderLeft: accent ? `3px solid ${accent}` : undefined,
    ...style,
  }}>{children}</div>
);

const InfoBox = ({ title, children, color = C.blue, icon = "💡" }) => (
  <div style={{
    background: `${color}10`, border: `1px solid ${color}25`,
    borderRadius: 12, padding: 18, marginBottom: 16,
  }}>
    <div style={{ fontWeight: 700, color, marginBottom: 6, fontSize: 14 }}>{icon} {title}</div>
    <div style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>{children}</div>
  </div>
);

const CodeBlock = ({ children, label }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>}
    <div style={{
      background: "#111118", borderRadius: 10, padding: 16,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13,
      color: C.green, lineHeight: 1.7, border: `1px solid ${C.border}`,
      whiteSpace: "pre-wrap", wordBreak: "break-word",
    }}>{children}</div>
  </div>
);

const MathBlock = ({ children, label }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <div style={{ fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 6 }}>{label}</div>}
    <div style={{
      background: `${C.purple}08`, borderRadius: 10, padding: 16,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
      color: C.purple, lineHeight: 1.8, border: `1px solid ${C.purple}20`,
      textAlign: "center",
    }}>{children}</div>
  </div>
);

const PromptExample = ({ title, prompt, result, tip }) => (
  <div style={{
    background: C.card, borderRadius: 12, padding: 18, marginBottom: 14,
    border: `1px solid ${C.border}`,
  }}>
    <div style={{ fontWeight: 700, color: C.accent, fontSize: 13, marginBottom: 8 }}>{title}</div>
    <div style={{
      background: "#111118", borderRadius: 8, padding: 12, marginBottom: 10,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
      color: C.cyan, lineHeight: 1.6, border: `1px solid ${C.border}`,
    }}>"{prompt}"</div>
    {result && <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>🎨 <strong style={{ color: C.text }}>Result:</strong> {result}</div>}
    {tip && <div style={{ color: C.green, fontSize: 12, fontStyle: "italic" }}>💡 Tip: {tip}</div>}
  </div>
);

const StepNumber = ({ n, color = C.accent }) => (
  <div style={{
    width: 32, height: 32, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontWeight: 800,
    fontSize: 14, color: C.bg, background: color, flexShrink: 0,
  }}>{n}</div>
);

const RevealButton = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: open ? C.accentSoft : "transparent", border: `1px solid ${C.accent}40`,
        borderRadius: 8, padding: "8px 16px", color: C.accent, cursor: "pointer",
        fontWeight: 600, fontSize: 13, width: "100%", textAlign: "left",
        transition: "all 0.2s",
      }}>
        {open ? "▾" : "▸"} {label}
      </button>
      {open && (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderTop: "none",
          borderRadius: "0 0 8px 8px", padding: 16,
          animation: "fadeIn 0.3s ease",
        }}>{children}</div>
      )}
    </div>
  );
};

const TabGroup = ({ tabs, activeTab, onChange }) => (
  <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
        fontWeight: 600, fontSize: 13,
        background: activeTab === t.id ? C.accent : C.card,
        color: activeTab === t.id ? C.bg : C.textMuted,
        transition: "all 0.2s",
      }}>{t.icon} {t.label}</button>
    ))}
  </div>
);

// ─── SECTION: Introduction ──────────────────────────────────────────────
const IntroSection = () => (
  <div>
    <SectionTitle icon="🎬" title="Welcome: Image-to-Video Pipeline" subtitle="How AI turns your words into moving pictures — a creative toolkit for artists" />
    
    <Card style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>🕐</span>
        <span style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Lecture Duration: 1 Hour 30 Minutes</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
        {SECTIONS.filter(s => s.id !== "activity").map((s, i) => (
          <div key={s.id} style={{
            background: C.surface, borderRadius: 10, padding: 12,
            border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <div>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{s.label}</div>
              <div style={{ color: C.textDim, fontSize: 11 }}>{s.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>

    <InfoBox title="What You'll Learn Today" color={C.accent} icon="🎯">
      <div style={{ lineHeight: 2 }}>
        1. How AI generates images from text descriptions (like a digital artist that reads your instructions)<br/>
        2. How those still images become short video loops (bringing your art to life)<br/>
        3. The complete pipeline from your idea → text → image → video<br/>
        4. Hands-on practice creating your own AI-generated video loops
      </div>
    </InfoBox>

    <Card accent={C.blue} style={{ marginBottom: 20 }}>
      <h3 style={{ color: C.blue, margin: "0 0 12px", fontSize: 16 }}>🧠 The Big Picture — Think of It Like This</h3>
      <div style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.8 }}>
        Imagine you're an art director giving instructions to an assistant. You say: <em style={{ color: C.cyan }}>"Paint me a sunset over a calm ocean with purple clouds."</em> The assistant (the AI) interprets your words, uses its training (having seen millions of images), and creates something new. Then you say: <em style={{ color: C.cyan }}>"Now make the waves gently move and the clouds drift."</em> The AI predicts what each frame should look like to create smooth motion.
      </div>
      <div style={{
        marginTop: 16, padding: 14, borderRadius: 10, background: C.surface,
        textAlign: "center", fontSize: 20, letterSpacing: 4,
      }}>
        <span style={{ color: C.accent }}>Your Words</span>
        <span style={{ color: C.textDim }}> → </span>
        <span style={{ color: C.blue }}>AI Image</span>
        <span style={{ color: C.textDim }}> → </span>
        <span style={{ color: C.pink }}>Video Loop</span>
      </div>
    </Card>

    <InfoBox title="No Coding Required!" color={C.green} icon="✅">
      Everything today uses visual interfaces and text prompts. If you can describe what you want to see, you can create AI art and video. Think of prompts as creative writing for machines.
    </InfoBox>
  </div>
);

// ─── SECTION: Part 1 — Text-to-Image ───────────────────────────────────
const Part1Section = () => {
  const [modelTab, setModelTab] = useState("flux");
  const [denoiseStep, setDenoiseStep] = useState(0);

  const noiseSteps = [
    { label: "Step 0: Pure Noise", desc: "Random static — like TV snow. No image yet.", color: C.textDim, visual: "░░▓░▒░░▓▒░▓░░▒▓░░\n▒░░▓░▓▒░░▓░▒░▓▒░░\n░▓▒░░▓░░▒░▓▒░░▓▒░\n▓░░▒▓░▒░▓░░▒▓░▓▒░\n░▒▓░░▓▒░░▓▒░░▓░▒░" },
    { label: "Step 1: Faint Shapes", desc: "AI starts removing noise. Very blurry shapes appear — like squinting at a foggy window.", color: C.pink, visual: "░░░░▓▓▓░░░░░░░░░░░\n░░▓▓███▓▓░░░░░░░░░\n░▓████████▓░░░░░░░\n░░▓▓████▓▓░░░░░░░░\n░░░░▓▓▓░░░░░░░░░░░" },
    { label: "Step 2: Basic Forms", desc: "Shapes get clearer. You can now see basic composition — sky on top, ground on bottom.", color: C.purple, visual: "░░░░░░░░░░░░░░░░░░\n░░░░░░░░░░░░░░░░░░\n░░░░▓▓▓▓▓▓░░░░░░░░\n▓▓▓▓████████▓▓▓▓▓▓\n████████████████████" },
    { label: "Step 3: Details Form", desc: "Colors, textures, and fine details appear. Almost like watching a Polaroid develop!", color: C.blue, visual: "  ☀️  ~~  ~~  ~~  \n ~~  ☁️  ~~  ☁️  ~~\n~~~~~~🌊~~~~~~~~~\n🌊🌊🌊🌊🌊🌊🌊🌊🌊\n🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️" },
    { label: "Step 4: Final Image", desc: "Noise fully removed. A clean, detailed image matching your text prompt. ✨ Done!", color: C.green, visual: "  ☀️    ☁️    ☁️  \n  ✨   🌅🌅🌅   ✨\n🌊🌊🌊🌊🌊🌊🌊🌊🌊\n🐚 🌊🌊🌊🌊🌊🌊 🐚\n🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️🏖️" },
  ];

  const models = {
    flux: {
      name: "FLUX (by Black Forest Labs)", year: "2024–2026", color: C.accent,
      desc: "Currently one of the most popular models. Known for exceptional photorealism and text rendering. Great at following complex prompts accurately.",
      strength: "Photorealism, text in images, composition",
      best: "Realistic photos, product mockups, detailed scenes",
      free: "Available via free tiers on Replicate, fal.ai",
    },
    dalle: {
      name: "DALL·E 3 (by OpenAI)", year: "2023–2026", color: C.blue,
      desc: "Integrated into ChatGPT. Very user-friendly — ChatGPT helps refine your prompts automatically. Excellent for beginners.",
      strength: "Ease of use, prompt understanding, safety controls",
      best: "Illustrations, concept art, quick ideation",
      free: "Free with ChatGPT account (limited uses)",
    },
    sd: {
      name: "Stable Diffusion 3.5+ (by Stability AI)", year: "2022–2026", color: C.pink,
      desc: "Open-source — you can run it on your own computer! Huge community with thousands of custom styles and fine-tuned versions.",
      strength: "Customization, artistic styles, community models",
      best: "Artistic styles, anime, fine art, custom trained looks",
      free: "Free to download; runs locally or via free services",
    },
  };

  const m = models[modelTab];

  return (
    <div>
      <SectionTitle icon="🖼️" title="Part 1: Text-to-Image Generation" subtitle="How AI creates images from your written descriptions — the magic of diffusion models" />

      {/* What is a Diffusion Model */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.accent, margin: "0 0 14px", fontSize: 17 }}>🎨 What Is a Diffusion Model? (The Art Analogy)</h3>
        <div style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          Imagine you have a beautiful painting. Now imagine slowly adding random paint splatters on top until the painting is completely hidden under messy random colors. A <strong style={{ color: C.accent }}>diffusion model</strong> learns to do the <em>reverse</em> — it learns to remove the random mess step by step until a beautiful image appears.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", textAlign: "center", marginBottom: 16 }}>
          <div style={{ background: C.surface, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.pink, marginBottom: 6 }}>Forward Process</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Clean Image → Add Noise → Pure Static</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>(Used during AI training)</div>
          </div>
          <span style={{ fontSize: 24 }}>🔄</span>
          <div style={{ background: C.surface, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 6 }}>Reverse Process</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Pure Static → Remove Noise → Clean Image</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>(What happens when you generate)</div>
          </div>
        </div>
        <InfoBox title="Simple Analogy" color={C.cyan} icon="🧊">
          Think of an ice sculptor: the block of ice is the "noise" and the sculptor's job is to chip away (denoise) until a beautiful statue (your image) is revealed. Your text prompt tells the sculptor <em>what</em> to carve.
        </InfoBox>
      </Card>

      {/* Interactive Denoising Demo */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.green, margin: "0 0 14px", fontSize: 17 }}>🔬 Interactive: Watch Denoising in Action</h3>
        <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 16 }}>
          Prompt: <span style={{ color: C.cyan, fontFamily: "monospace" }}>"A sunny beach with waves and clouds"</span> — Click through each step:
        </p>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {noiseSteps.map((s, i) => (
            <button key={i} onClick={() => setDenoiseStep(i)} style={{
              padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 12,
              background: denoiseStep === i ? s.color : C.surface,
              color: denoiseStep === i ? C.bg : C.textMuted,
              transition: "all 0.2s",
            }}>Step {i}</button>
          ))}
        </div>
        <div style={{
          background: "#0A0A10", borderRadius: 12, padding: 20,
          border: `1px solid ${noiseSteps[denoiseStep].color}40`,
          textAlign: "center", minHeight: 140, transition: "all 0.3s",
        }}>
          <div style={{ fontWeight: 700, color: noiseSteps[denoiseStep].color, marginBottom: 10, fontSize: 15 }}>
            {noiseSteps[denoiseStep].label}
          </div>
          <pre style={{
            fontFamily: "monospace", fontSize: 14, color: noiseSteps[denoiseStep].color,
            lineHeight: 1.5, margin: "0 0 12px",
          }}>{noiseSteps[denoiseStep].visual}</pre>
          <div style={{ color: C.textMuted, fontSize: 13, fontStyle: "italic" }}>
            {noiseSteps[denoiseStep].desc}
          </div>
        </div>
      </Card>

      {/* Simple Mathematics */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.purple, margin: "0 0 14px", fontSize: 17 }}>📐 The Simple Math Behind It</h3>
        <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 16, lineHeight: 1.7 }}>
          Don't worry — this is simplified for understanding the concept, not for solving equations! Here's the core idea:
        </p>
        
        <MathBlock label="1. Adding Noise (Forward Process)">
          Noisy Image = Original Image + (Noise Amount × Random Noise){"\n\n"}
          x_t = x₀ + σ_t · ε{"\n\n"}
          <span style={{ fontSize: 12, color: C.textMuted }}>
            x₀ = original clean image | ε = random noise | σ_t = how much noise at step t
          </span>
        </MathBlock>

        <MathBlock label="2. Removing Noise (Reverse / Denoising — what the AI learns)">
          Predicted Clean Image = Noisy Image − (Predicted Noise){"\n\n"}
          x̂₀ = x_t − σ_t · ε_θ(x_t, t, prompt){"\n\n"}
          <span style={{ fontSize: 12, color: C.textMuted }}>
            ε_θ = the AI's noise prediction | prompt = your text description
          </span>
        </MathBlock>

        <MathBlock label="3. How Text Guides the Image (Classifier-Free Guidance)">
          Final Prediction = Unconditional + Scale × (Conditional − Unconditional){"\n\n"}
          output = ε_uncond + w · (ε_cond − ε_uncond){"\n\n"}
          <span style={{ fontSize: 12, color: C.textMuted }}>
            w = guidance scale (typically 7–15) | Higher w = follows prompt more strictly
          </span>
        </MathBlock>

        <InfoBox title="What Does This Mean For You?" color={C.accent} icon="🎨">
          <strong>Guidance Scale</strong> is the one number you'll actually use! It controls how closely the AI follows your text prompt. Set it low (3–5) for creative freedom, high (10–15) for strict adherence to your description. Most tools default to 7–8 which is a great middle ground.
        </InfoBox>
      </Card>

      {/* AI Model Descriptions */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.blue, margin: "0 0 14px", fontSize: 17 }}>🤖 Popular 2025–2026 AI Image Models</h3>
        <TabGroup
          tabs={[
            { id: "flux", icon: "⚡", label: "FLUX" },
            { id: "dalle", icon: "🌀", label: "DALL·E 3" },
            { id: "sd", icon: "🎭", label: "Stable Diffusion" },
          ]}
          activeTab={modelTab}
          onChange={setModelTab}
        />
        <div style={{
          background: C.surface, borderRadius: 12, padding: 20,
          border: `1px solid ${m.color}30`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontWeight: 800, color: m.color, fontSize: 18 }}>{m.name}</span>
            <Badge color={m.color}>{m.year}</Badge>
          </div>
          <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{m.desc}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: C.card, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: m.color, marginBottom: 4 }}>STRENGTHS</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{m.strength}</div>
            </div>
            <div style={{ background: C.card, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: m.color, marginBottom: 4 }}>BEST FOR</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{m.best}</div>
            </div>
          </div>
          <div style={{ marginTop: 10, background: C.card, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 4 }}>💰 FREE ACCESS</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>{m.free}</div>
          </div>
        </div>
      </Card>

      {/* How the Model Works - Architecture Description */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.cyan, margin: "0 0 14px", fontSize: 17 }}>🏗️ Inside the AI: How the Model Works</h3>
        <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 16, lineHeight: 1.7 }}>
          Here's a simplified view of the main components inside a diffusion model. Think of it as a team of specialists working together:
        </p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {[
            { icon: "📝", name: "Text Encoder", desc: "Reads your prompt and translates words into numbers the AI understands. Like a translator between English and 'math language.'", color: C.cyan },
            { icon: "🧠", name: "U-Net (The Brain)", desc: "The core neural network that actually removes noise step by step. It looks at the noisy image and predicts what noise to subtract.", color: C.accent },
            { icon: "🔍", name: "VAE Decoder", desc: "Takes the AI's internal compressed representation and expands it into a full-resolution image you can see.", color: C.pink },
            { icon: "📊", name: "Scheduler", desc: "Controls the denoising schedule — how many steps to take and how much noise to remove each time. Like a project timeline.", color: C.green },
          ].map(c => (
            <div key={c.name} style={{
              background: C.surface, borderRadius: 10, padding: 16,
              border: `1px solid ${c.color}25`,
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, color: c.color, fontSize: 14, marginBottom: 6 }}>{c.name}</div>
              <div style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16, padding: 14, background: "#0A0A10", borderRadius: 10,
          textAlign: "center", fontSize: 14, color: C.textMuted, lineHeight: 2,
          fontFamily: "monospace",
        }}>
          <span style={{ color: C.cyan }}>Your Prompt</span> → <span style={{ color: C.cyan }}>Text Encoder</span> → <span style={{ color: C.accent }}>U-Net removes noise (20–50 steps)</span> → <span style={{ color: C.pink }}>VAE Decoder</span> → <span style={{ color: C.green }}>Final Image ✨</span>
        </div>
      </Card>

      {/* Prompt Examples */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.accent, margin: "0 0 14px", fontSize: 17 }}>✍️ Prompt Writing Examples (Text-to-Image)</h3>
        <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 16 }}>
          Good prompts have: <Badge color={C.cyan}>Subject</Badge> <Badge color={C.accent}>Style</Badge> <Badge color={C.pink}>Mood/Lighting</Badge> <Badge color={C.green}>Details</Badge>
        </p>

        <PromptExample
          title="🌅 Example 1: Landscape (Beginner)"
          prompt="A peaceful mountain lake at sunset, golden light reflecting on still water, pine trees silhouetted, photograph style, warm colors"
          result="Photorealistic sunset scene with natural lighting and warm tones"
          tip="Start with the subject, then add style and mood words"
        />
        <PromptExample
          title="🎨 Example 2: Abstract Art (Intermediate)"
          prompt="Abstract fluid art, swirling ribbons of cobalt blue and burnt orange, gold leaf accents, macro photography, dramatic contrast, gallery-quality fine art"
          result="High-end abstract piece with rich color interplay"
          tip="Name specific colors instead of generic ones (cobalt blue > blue)"
        />
        <PromptExample
          title="👤 Example 3: Character Portrait (Advanced)"
          prompt="Portrait of an elderly fisherman, weathered face with deep wrinkles, kind eyes, wearing a worn canvas hat, golden hour light from the left, shallow depth of field, editorial photography style, Hasselblad quality"
          result="Cinematic portrait with professional lighting and detail"
          tip="Camera and lens references help AI understand the 'look' you want"
        />
        <PromptExample
          title="🏛️ Example 4: Architectural (Advanced)"
          prompt="Futuristic art museum interior, organic flowing white walls, natural light streaming through geometric skylights, people walking below for scale, architectural photography, wide angle lens, Zaha Hadid inspired"
          result="Dramatic architectural interior with scale and atmosphere"
          tip="Mentioning a reference artist or architect style helps guide aesthetics"
        />

        <InfoBox title="Prompt Formula For Beginners" color={C.accent} icon="📝">
          <strong style={{ color: C.accent }}>[Subject] + [Style/Medium] + [Mood/Lighting] + [Extra Details]</strong><br/><br/>
          Example using the formula: <span style={{ color: C.cyan, fontFamily: "monospace" }}>"A cat sitting on a windowsill" + "watercolor painting" + "soft afternoon light, cozy" + "flowers in the background, vintage feel"</span>
        </InfoBox>
      </Card>
    </div>
  );
};

// ─── SECTION: Part 2 — Image-to-Video ──────────────────────────────────
const Part2Section = () => {
  const [paramTab, setParamTab] = useState("frames");
  
  const params = {
    frames: {
      title: "Frames Per Second (FPS)",
      desc: "How many images (frames) play per second. More frames = smoother motion.",
      analogy: "Think of a flipbook — more pages means smoother animation.",
      values: [
        { val: "8 FPS", use: "Dreamy, stop-motion feel", icon: "🐌" },
        { val: "12 FPS", use: "Animated / cartoon feel", icon: "🎞️" },
        { val: "24 FPS", use: "Standard cinematic look", icon: "🎬" },
        { val: "30 FPS", use: "Smooth, modern video", icon: "✨" },
      ],
    },
    duration: {
      title: "Duration (Seconds)",
      desc: "How long the video clip lasts. Most AI tools generate 2–10 second clips.",
      analogy: "Like choosing the length of a GIF or social media story clip.",
      values: [
        { val: "2–3 sec", use: "Seamless loops, Instagram stories", icon: "🔄" },
        { val: "4–5 sec", use: "Short scenes, product showcases", icon: "📱" },
        { val: "6–8 sec", use: "Longer motion, narrative clips", icon: "🎥" },
        { val: "10+ sec", use: "Extended scenes (higher cost)", icon: "🎞️" },
      ],
    },
    motion: {
      title: "Motion Intensity / Amount",
      desc: "How much movement happens in the video. A scale from subtle to dramatic.",
      analogy: "Like the difference between a gentle breeze and a windstorm.",
      values: [
        { val: "Low (1–3)", use: "Subtle — breathing, blinking, slight sway", icon: "🍃" },
        { val: "Medium (4–6)", use: "Moderate — walking, flowing water", icon: "🌊" },
        { val: "High (7–8)", use: "Dynamic — running, waves, fire", icon: "🔥" },
        { val: "Max (9–10)", use: "Dramatic — explosions, fast action", icon: "💥" },
      ],
    },
    resolution: {
      title: "Resolution",
      desc: "The size/quality of each frame in pixels. Higher = sharper but slower.",
      analogy: "Like choosing between a phone photo and a DSLR photo.",
      values: [
        { val: "512×512", use: "Quick drafts, testing ideas", icon: "📋" },
        { val: "768×768", use: "Good quality, balanced speed", icon: "📷" },
        { val: "1024×576", use: "Widescreen (16:9), presentations", icon: "🖥️" },
        { val: "1920×1080", use: "Full HD, final output", icon: "🎬" },
      ],
    },
  };

  const p = params[paramTab];

  return (
    <div>
      <SectionTitle icon="🎥" title="Part 2: Image-to-Video Generation" subtitle="Turning your still AI image into a moving, breathing video loop" />

      {/* How Frame Prediction Works */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.pink, margin: "0 0 14px", fontSize: 17 }}>🎞️ How Does Image-to-Video Work?</h3>
        <div style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          The AI takes your still image as a starting point and <strong style={{ color: C.pink }}>predicts what the next frames should look like</strong>. It's like asking: "If this photo came to life, what would happen in the next 1, 2, 3 seconds?"
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8,
          marginBottom: 16, textAlign: "center",
        }}>
          {["Frame 1\n(Your Image)", "Frame 2\n(Predicted)", "Frame 3\n(Predicted)", "Frame 4\n(Predicted)", "Frame 5\n(Predicted)"].map((f, i) => (
            <div key={i} style={{
              background: i === 0 ? C.accentSoft : C.surface, borderRadius: 10, padding: 12,
              border: `1px solid ${i === 0 ? C.accent : C.border}40`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{i === 0 ? "🖼️" : "🎞️"}</div>
              <div style={{ fontSize: 11, color: i === 0 ? C.accent : C.textMuted, whiteSpace: "pre-line", fontWeight: i === 0 ? 700 : 400 }}>{f}</div>
              {i < 4 && <div style={{ position: "relative" }}>
                <span style={{ color: C.textDim, fontSize: 18, position: "absolute", right: -18, top: -30 }}>→</span>
              </div>}
            </div>
          ))}
        </div>

        <InfoBox title="The Frame Prediction Process" color={C.pink} icon="🧠">
          <strong>Step 1:</strong> AI analyzes your image — finds objects, scenery, lighting, textures<br/>
          <strong>Step 2:</strong> AI uses a motion model to predict natural movement for each element<br/>
          <strong>Step 3:</strong> AI generates each new frame, ensuring smooth transitions<br/>
          <strong>Step 4:</strong> All frames are compiled into a video file at your chosen FPS
        </InfoBox>
      </Card>

      {/* Video Parameters */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.blue, margin: "0 0 14px", fontSize: 17 }}>⚙️ Video Generation Parameters</h3>
        <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 12 }}>
          Click each parameter to learn what it does and how to set it:
        </p>
        <TabGroup
          tabs={[
            { id: "frames", icon: "🎞️", label: "FPS" },
            { id: "duration", icon: "⏱️", label: "Duration" },
            { id: "motion", icon: "💫", label: "Motion" },
            { id: "resolution", icon: "📐", label: "Resolution" },
          ]}
          activeTab={paramTab}
          onChange={setParamTab}
        />
        <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
          <h4 style={{ color: C.text, margin: "0 0 8px", fontSize: 16 }}>{p.title}</h4>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 8, lineHeight: 1.6 }}>{p.desc}</p>
          <p style={{ color: C.cyan, fontSize: 13, marginBottom: 14, fontStyle: "italic" }}>💡 {p.analogy}</p>
          <div style={{ display: "grid", gap: 8 }}>
            {p.values.map((v, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: 10,
                background: C.card, borderRadius: 8, border: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 20 }}>{v.icon}</span>
                <div>
                  <span style={{ fontWeight: 700, color: C.accent, fontSize: 13, marginRight: 8 }}>{v.val}</span>
                  <span style={{ color: C.textMuted, fontSize: 13 }}>— {v.use}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Motion Prompts & Camera Movement */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.green, margin: "0 0 14px", fontSize: 17 }}>🎬 Motion Prompts & Camera Movements</h3>
        <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 16, lineHeight: 1.7 }}>
          Motion prompts tell the AI <em>how</em> things should move. Camera descriptions tell it how the <em>viewpoint</em> should change. Here are examples:
        </p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: C.green, marginBottom: 10, fontSize: 14 }}>🌿 Subject Motion Prompts</div>
          {[
            { prompt: "gentle breeze moving through the leaves", effect: "Subtle, natural foliage movement" },
            { prompt: "waves slowly rolling onto the shore", effect: "Smooth, rhythmic water motion" },
            { prompt: "flames flickering in a fireplace", effect: "Dynamic, organic fire animation" },
            { prompt: "hair flowing softly in the wind", effect: "Graceful, natural hair movement" },
            { prompt: "clouds drifting slowly across the sky", effect: "Slow, atmospheric movement" },
          ].map((m, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "center", padding: "8px 12px",
              background: i % 2 === 0 ? C.surface : "transparent", borderRadius: 6,
            }}>
              <span style={{ color: C.cyan, fontFamily: "monospace", fontSize: 12, flex: 1 }}>"{m.prompt}"</span>
              <span style={{ color: C.textMuted, fontSize: 12, flex: "0 0 200px" }}>→ {m.effect}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontWeight: 700, color: C.blue, marginBottom: 10, fontSize: 14 }}>🎥 Camera Movement Descriptions</div>
          {[
            { prompt: "slow zoom in", effect: "Gradually moves closer — adds focus and intimacy" },
            { prompt: "gentle pan left to right", effect: "Horizontal sweep — reveals a wide scene" },
            { prompt: "camera slowly rising / crane up", effect: "Upward movement — dramatic reveals" },
            { prompt: "orbit around the subject", effect: "360° movement — cinematic product shots" },
            { prompt: "dolly forward through the scene", effect: "Moving through space — immersive" },
            { prompt: "static camera, no movement", effect: "Only the subject moves — clean loops" },
          ].map((m, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "center", padding: "8px 12px",
              background: i % 2 === 0 ? C.surface : "transparent", borderRadius: 6,
            }}>
              <span style={{ color: C.cyan, fontFamily: "monospace", fontSize: 12, flex: 1 }}>"{m.prompt}"</span>
              <span style={{ color: C.textMuted, fontSize: 12, flex: "0 0 260px" }}>→ {m.effect}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── SECTION: Complete Workflow / Flowchart ─────────────────────────────
const WorkflowSection = () => {
  const steps = [
    { icon: "💭", title: "1. Concept & Brainstorm", desc: "Define your artistic vision. What do you want to create? What mood, style, colors?", color: C.purple, details: "Ask: What emotion should the viewer feel? Is it realistic or abstract? What's the movement?" },
    { icon: "✍️", title: "2. Write Your Image Prompt", desc: "Craft a detailed text description using the prompt formula.", color: C.cyan, details: "Use: [Subject] + [Style] + [Mood/Lighting] + [Details]. Be specific with colors, materials, camera angles." },
    { icon: "⚙️", title: "3. Set Image Parameters", desc: "Choose resolution, aspect ratio, guidance scale, and number of variations.", color: C.blue, details: "Recommended start: 1024×1024, guidance scale 7.5, generate 4 variations to pick the best one." },
    { icon: "🖼️", title: "4. Generate & Select Image", desc: "Run the AI image generator. Review outputs. Pick your best result or refine the prompt.", color: C.accent, details: "Iterate 2–3 times. Each generation takes ~10–30 seconds. Save your favorites." },
    { icon: "🎬", title: "5. Write Motion Prompt", desc: "Describe how elements should move and any camera movement.", color: C.pink, details: "Be specific: 'gentle waves lapping at the shore, slow zoom in, clouds drifting left.' Keep motion subtle for loops." },
    { icon: "⚙️", title: "6. Set Video Parameters", desc: "Choose FPS, duration, motion amount, and output format.", color: C.green, details: "For loops: 3–4 seconds, 24 FPS, low–medium motion, MP4 format. Keep it simple for best results." },
    { icon: "🎥", title: "7. Generate Video", desc: "Upload your image + motion prompt to the video AI. Wait for processing.", color: C.blue, details: "Processing takes 1–5 minutes. Some tools offer preview before final render." },
    { icon: "✅", title: "8. Review & Export", desc: "Check the output. If needed, adjust motion or re-generate. Export final video loop.", color: C.accent, details: "Export as MP4 or GIF. Check for artifacts, jumps, or unnatural distortions." },
  ];

  return (
    <div>
      <SectionTitle icon="🔄" title="Complete Workflow: The Full Pipeline" subtitle="From idea to finished video loop — your step-by-step visual guide" />

      {/* Main Flowchart */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.accent, margin: "0 0 16px", fontSize: 17 }}>📋 The 8-Step Pipeline Flowchart</h3>
        <div style={{ position: "relative" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < steps.length - 1 ? 8 : 0, alignItems: "flex-start" }}>
              {/* Vertical line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 18,
                  background: `${s.color}20`, border: `2px solid ${s.color}`,
                  flexShrink: 0, position: "relative", zIndex: 1,
                }}>{s.icon}</div>
                {i < steps.length - 1 && <div style={{ width: 2, height: 40, background: `${C.border}`, margin: "4px 0" }} />}
              </div>
              {/* Content */}
              <div style={{
                flex: 1, background: C.surface, borderRadius: 10, padding: 14,
                border: `1px solid ${s.color}20`, marginBottom: 4,
              }}>
                <div style={{ fontWeight: 700, color: s.color, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
                <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>{s.desc}</div>
                <div style={{ color: C.textDim, fontSize: 12, fontStyle: "italic" }}>{s.details}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Phase Summary */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.cyan, margin: "0 0 14px", fontSize: 17 }}>🗺️ Pipeline Overview Map</h3>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 8,
          alignItems: "center", textAlign: "center",
        }}>
          <div style={{ background: `${C.purple}15`, borderRadius: 12, padding: 16, border: `1px solid ${C.purple}30` }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>💭</div>
            <div style={{ fontWeight: 700, color: C.purple, fontSize: 14, marginBottom: 4 }}>Phase 1: PLAN</div>
            <div style={{ color: C.textMuted, fontSize: 12 }}>Concept, mood, references</div>
            <div style={{ color: C.textDim, fontSize: 11, marginTop: 4 }}>Steps 1–2</div>
          </div>
          <span style={{ fontSize: 22, color: C.textDim }}>→</span>
          <div style={{ background: `${C.accent}15`, borderRadius: 12, padding: 16, border: `1px solid ${C.accent}30` }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
            <div style={{ fontWeight: 700, color: C.accent, fontSize: 14, marginBottom: 4 }}>Phase 2: IMAGE</div>
            <div style={{ color: C.textMuted, fontSize: 12 }}>Generate, iterate, select</div>
            <div style={{ color: C.textDim, fontSize: 11, marginTop: 4 }}>Steps 3–4</div>
          </div>
          <span style={{ fontSize: 22, color: C.textDim }}>→</span>
          <div style={{ background: `${C.pink}15`, borderRadius: 12, padding: 16, border: `1px solid ${C.pink}30` }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🎥</div>
            <div style={{ fontWeight: 700, color: C.pink, fontSize: 14, marginBottom: 4 }}>Phase 3: VIDEO</div>
            <div style={{ color: C.textMuted, fontSize: 12 }}>Animate, review, export</div>
            <div style={{ color: C.textDim, fontSize: 11, marginTop: 4 }}>Steps 5–8</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─── SECTION: Hands-on Lab ─────────────────────────────────────────────
const LabSection = () => (
  <div>
    <SectionTitle icon="🧪" title="Hands-on Lab: 6-Step Exercise" subtitle="Create your own AI video loop from scratch — follow along step by step!" />

    <InfoBox title="What You'll Need" color={C.accent} icon="🛠️">
      A web browser and a free account on one of these platforms:<br/>
      <strong>For Image:</strong> ChatGPT (DALL·E 3), Leonardo.ai, or Playground AI<br/>
      <strong>For Video:</strong> Runway ML (Gen-3), Pika Labs, or Kaiber<br/>
      All offer free tiers — no credit card needed to start!
    </InfoBox>

    {[
      {
        n: 1, title: "Choose Your Theme", color: C.purple,
        time: "2 min",
        instruction: "Pick ONE of these themes for your project. You'll create an image and then animate it.",
        templates: [
          "🌊 Ocean & Waves — A seascape with moving water",
          "🌸 Flowers & Nature — Blooming flowers with gentle breeze",
          "🏙️ Cityscape — Urban scene with subtle activity",
          "🌌 Space & Cosmos — Nebula or galaxy with cosmic motion",
        ],
      },
      {
        n: 2, title: "Write Your Image Prompt", color: C.cyan,
        time: "3 min",
        instruction: "Using the formula [Subject] + [Style] + [Mood/Lighting] + [Details], write your prompt.",
        templates: [
          'Ocean: "Turquoise ocean waves at golden hour, aerial drone view, crystal clear water, foam patterns, cinematic photography, warm sunlight"',
          'Flowers: "Field of lavender flowers stretching to the horizon, soft morning light, dew drops, dreamy shallow depth of field, fine art photography"',
          'City: "Rain-soaked Tokyo street at night, neon reflections on wet pavement, moody cinematic atmosphere, blade runner inspired, wide angle"',
          'Space: "Vibrant nebula with swirling purple and teal gas clouds, scattered stars, deep space, Hubble telescope style, high detail"',
        ],
      },
      {
        n: 3, title: "Generate Your Image", color: C.blue,
        time: "3 min",
        instruction: "Open your chosen image AI tool. Paste your prompt. Generate 4 variations. Pick the best one and download it.",
        templates: [
          "Settings: 1024×1024 resolution, Guidance Scale 7–8",
          "Generate 4 variations — more options means better selection",
          "Don't love any? Adjust the prompt slightly and regenerate",
          "Download your favorite as PNG (highest quality)",
        ],
      },
      {
        n: 4, title: "Write Your Motion Prompt", color: C.pink,
        time: "3 min",
        instruction: "Describe how things should move AND the camera movement. Keep motion subtle for smooth loops.",
        templates: [
          'Ocean: "Waves gently rolling toward shore, sea foam forming and dissolving, slow subtle zoom in, water sparkling"',
          'Flowers: "Gentle breeze swaying the lavender stems, a butterfly fluttering, static camera, subtle depth movement"',
          'City: "Rain drops falling, neon signs flickering, reflections rippling in puddles, slow pan right, people walking"',
          'Space: "Gas clouds slowly swirling and pulsing, stars twinkling, gentle drift to the right, cosmic dust particles floating"',
        ],
      },
      {
        n: 5, title: "Generate Your Video", color: C.green,
        time: "3 min",
        instruction: "Upload your image to the video AI tool. Add your motion prompt. Set parameters and generate!",
        templates: [
          "Duration: 3–4 seconds (best for loops)",
          "Motion Amount: Low to Medium (3–5)",
          "FPS: 24 (cinematic standard)",
          "Wait 1–3 minutes for processing",
        ],
      },
      {
        n: 6, title: "Review, Refine & Present", color: C.accent,
        time: "2 min",
        instruction: "Watch your video loop. Check for: smooth motion, no weird artifacts, and does it match your vision? Export and share!",
        templates: [
          "Does the loop restart smoothly? If not, try shorter duration",
          "Are there any distorted faces, hands, or objects?",
          "Does the motion feel natural and match your prompt?",
          "Export as MP4 and save. Share with the class!",
        ],
      },
    ].map(step => (
      <Card key={step.n} accent={step.color} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <StepNumber n={step.n} color={step.color} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: step.color, fontSize: 15 }}>{step.title}</span>
              <Badge color={C.textDim}>{step.time}</Badge>
            </div>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{step.instruction}</p>
            <div style={{ background: C.surface, borderRadius: 8, padding: 12 }}>
              {step.templates.map((t, i) => (
                <div key={i} style={{
                  padding: "6px 0", fontSize: 13, color: C.textMuted, lineHeight: 1.5,
                  borderBottom: i < step.templates.length - 1 ? `1px solid ${C.border}` : "none",
                }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

// ─── SECTION: Ethics & Best Practices ──────────────────────────────────
const EthicsSection = () => (
  <div>
    <SectionTitle icon="⚖️" title="Best Practices & Ethics" subtitle="Tips for great results and responsible AI art creation" />

    <Card style={{ marginBottom: 24 }}>
      <h3 style={{ color: C.green, margin: "0 0 14px", fontSize: 17 }}>✅ Best Practices for Great Results</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {[
          { icon: "🎯", title: "Be Specific", desc: "The more detail you give, the better the output. 'Red 1965 Mustang convertible on a coastal highway' beats 'a car on a road.'" },
          { icon: "🔄", title: "Iterate Often", desc: "Rarely is the first generation perfect. Generate multiple versions and refine your prompt each time." },
          { icon: "📐", title: "Start Simple", desc: "Begin with basic prompts and add complexity. Don't try to describe everything at once." },
          { icon: "🎨", title: "Use Style References", desc: "Mention art movements (impressionist, art deco) or photography terms (bokeh, wide angle) to guide the look." },
          { icon: "🐌", title: "Keep Motion Subtle", desc: "For video, less is often more. Subtle, natural motion looks professional. Over-motion looks distorted." },
          { icon: "🔁", title: "Plan for Loops", desc: "If you want a looping video, choose scenes with continuous motion (water, fire, clouds) that loop naturally." },
        ].map((tip, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, padding: 12, background: C.surface,
            borderRadius: 10, border: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 22 }}>{tip.icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: C.text, fontSize: 14, marginBottom: 3 }}>{tip.title}</div>
              <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.5 }}>{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Card style={{ marginBottom: 24 }}>
      <h3 style={{ color: C.pink, margin: "0 0 14px", fontSize: 17 }}>❌ Common Mistakes to Avoid</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {[
          { bad: "Using vague prompts like 'make something cool'", fix: "Be specific about subject, style, mood, and details" },
          { bad: "Setting motion intensity too high", fix: "Start at 3–4 and increase only if needed" },
          { bad: "Ignoring aspect ratio for your final use", fix: "16:9 for video, 1:1 for social, 9:16 for stories" },
          { bad: "Generating only one variation", fix: "Always generate 4+ options and pick the best" },
          { bad: "Trying complex scenes with many characters", fix: "AI works best with 1–2 focal subjects" },
          { bad: "Not checking for AI artifacts (extra fingers, melted text)", fix: "Always zoom in and review carefully before sharing" },
        ].map((m, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
            padding: 10, background: i % 2 === 0 ? C.surface : "transparent", borderRadius: 8,
          }}>
            <div style={{ color: C.pink, fontSize: 13 }}>❌ {m.bad}</div>
            <div style={{ color: C.green, fontSize: 13 }}>✅ {m.fix}</div>
          </div>
        ))}
      </div>
    </Card>

    <Card style={{ marginBottom: 24 }}>
      <h3 style={{ color: C.purple, margin: "0 0 14px", fontSize: 17 }}>⚖️ Responsible AI Use in Art</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {[
          { icon: "📣", title: "Always Disclose AI Use", desc: "When sharing your work, be transparent that AI was used in the creation process. Academic and professional integrity requires this.", color: C.accent },
          { icon: "©️", title: "Understand Copyright", desc: "AI-generated images may not be copyrightable in many jurisdictions. You typically can't claim full copyright on AI outputs. Rules are still evolving — stay informed.", color: C.blue },
          { icon: "🚫", title: "Don't Mimic Living Artists", desc: "Avoid prompts like 'in the style of [living artist name].' This raises ethical and potential legal concerns. Reference movements/eras instead.", color: C.pink },
          { icon: "🤝", title: "Respect Consent & Privacy", desc: "Never use AI to generate realistic images of real people without their consent. Don't create deepfakes or misleading content.", color: C.green },
          { icon: "🌍", title: "Consider Bias & Representation", desc: "AI models can reflect biases in their training data. Be aware of stereotypes in outputs and actively work to create diverse, inclusive art.", color: C.purple },
          { icon: "🎓", title: "AI as a Tool, Not a Replacement", desc: "AI enhances your creative vision — it doesn't replace artistic thinking, concept development, or critical evaluation. You are still the artist.", color: C.cyan },
        ].map((item, i) => (
          <div key={i} style={{
            background: `${item.color}08`, borderRadius: 10, padding: 14,
            border: `1px solid ${item.color}20`,
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontWeight: 700, color: item.color, fontSize: 14 }}>{item.title}</span>
            </div>
            <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, paddingLeft: 30 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ─── SECTION: Class Activity ───────────────────────────────────────────
const ActivitySection = () => (
  <div>
    <SectionTitle icon="✏️" title="Class Activity (With Solutions)" subtitle="Test your understanding! Try answering before revealing the solutions." />

    {/* Activity 1 */}
    <Card accent={C.accent} style={{ marginBottom: 20 }}>
      <h3 style={{ color: C.accent, margin: "0 0 10px", fontSize: 16 }}>Activity 1: Fix the Bad Prompt (5 minutes)</h3>
      <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
        Below are poorly written prompts. Rewrite each one to be more effective using the prompt formula.
      </p>

      <RevealButton label="Prompt A: 'A dog'">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: C.pink, fontSize: 13, marginBottom: 6 }}>❌ Original: "A dog"</div>
          <div style={{ fontWeight: 700, color: C.green, fontSize: 13, marginBottom: 6 }}>✅ Improved:</div>
          <CodeBlock>"A golden retriever puppy sitting in a sunlit meadow, wildflowers around, soft bokeh background, warm afternoon light, pet photography style, shallow depth of field, joyful expression"</CodeBlock>
          <div style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.6 }}>
            <strong>Why it's better:</strong> Specifies breed (golden retriever), age (puppy), setting (meadow), lighting (sunlit, warm afternoon), photography style (pet photography, bokeh), and mood (joyful).
          </div>
        </div>
      </RevealButton>

      <RevealButton label="Prompt B: 'Make me a cool painting'">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: C.pink, fontSize: 13, marginBottom: 6 }}>❌ Original: "Make me a cool painting"</div>
          <div style={{ fontWeight: 700, color: C.green, fontSize: 13, marginBottom: 6 }}>✅ Improved:</div>
          <CodeBlock>"An abstract expressionist painting of a stormy sea, thick impasto brushstrokes, navy blue and silver palette, dramatic lighting, inspired by Romantic era seascapes, oil on canvas texture, museum quality"</CodeBlock>
          <div style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.6 }}>
            <strong>Why it's better:</strong> Names a style (abstract expressionist), subject (stormy sea), technique (impasto), specific colors (navy, silver), era reference (Romantic), and medium (oil on canvas).
          </div>
        </div>
      </RevealButton>

      <RevealButton label="Prompt C: 'A house at night'">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: C.pink, fontSize: 13, marginBottom: 6 }}>❌ Original: "A house at night"</div>
          <div style={{ fontWeight: 700, color: C.green, fontSize: 13, marginBottom: 6 }}>✅ Improved:</div>
          <CodeBlock>"A Victorian Gothic mansion on a hilltop at midnight, full moon behind wispy clouds, warm light glowing from stained glass windows, overgrown ivy on stone walls, misty atmosphere, cinematic horror movie aesthetic, wide-angle shot"</CodeBlock>
          <div style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.6 }}>
            <strong>Why it's better:</strong> Specifies architecture (Victorian Gothic), time (midnight), lighting sources (moon, windows), details (ivy, stone, mist), mood (horror), and camera (wide-angle).
          </div>
        </div>
      </RevealButton>
    </Card>

    {/* Activity 2 */}
    <Card accent={C.blue} style={{ marginBottom: 20 }}>
      <h3 style={{ color: C.blue, margin: "0 0 10px", fontSize: 16 }}>Activity 2: Concept Matching Quiz (5 minutes)</h3>
      <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
        Match each concept to its correct description. Try to answer first, then reveal the solution.
      </p>

      {[
        { q: "What does 'denoising' mean in diffusion models?", a: "The process of gradually removing random noise from an image, step by step, until a clean image appears. It's the core mechanism that generates images." },
        { q: "What does 'Guidance Scale' control?", a: "How strictly the AI follows your text prompt. Low values (3–5) = more creative freedom. High values (10–15) = strictly follows the prompt. Default is usually 7–8." },
        { q: "What does 'FPS' mean in video generation?", a: "Frames Per Second — the number of still images shown per second to create the illusion of motion. 24 FPS is the cinematic standard. Higher FPS = smoother motion." },
        { q: "What is the 'Text Encoder' in a diffusion model?", a: "The component that translates your written text prompt into numerical representations (vectors) that the AI can understand and use to guide image generation." },
        { q: "Why should motion intensity be kept low for loops?", a: "High motion creates dramatic changes between frames, making it hard for the end of the video to seamlessly connect back to the beginning. Subtle, natural motion loops smoothly." },
      ].map((item, i) => (
        <RevealButton key={i} label={`Q${i + 1}: ${item.q}`}>
          <div style={{ color: C.green, fontSize: 13, lineHeight: 1.7 }}>
            <strong>Answer:</strong> {item.a}
          </div>
        </RevealButton>
      ))}
    </Card>

    {/* Activity 3 */}
    <Card accent={C.pink} style={{ marginBottom: 20 }}>
      <h3 style={{ color: C.pink, margin: "0 0 10px", fontSize: 16 }}>Activity 3: Build a Complete Pipeline Plan (10 minutes)</h3>
      <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
        Working individually or in pairs, plan a complete image-to-video pipeline for the scenario: <strong style={{ color: C.text }}>"Create a 4-second looping video of a magical forest for a fantasy game intro screen."</strong>
      </p>
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 12 }}>
        Fill in each blank, then check the solution:
      </p>

      <RevealButton label="📝 Show Complete Solution">
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, color: C.cyan, fontSize: 13, marginBottom: 6 }}>Step 1: Image Prompt</div>
            <CodeBlock>"An enchanted forest clearing at twilight, bioluminescent mushrooms glowing blue and purple, ancient twisted oak trees, magical fireflies, volumetric fog, ray-traced light beams through the canopy, fantasy concept art style, highly detailed, 4K quality"</CodeBlock>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: C.blue, fontSize: 13, marginBottom: 6 }}>Step 2: Image Settings</div>
            <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.8 }}>
              Model: FLUX or Stable Diffusion (both excel at fantasy art)<br/>
              Resolution: 1024×576 (16:9 widescreen for game screens)<br/>
              Guidance Scale: 8 (good balance of creativity and accuracy)<br/>
              Variations: Generate 4, pick the most atmospheric one
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: C.pink, fontSize: 13, marginBottom: 6 }}>Step 3: Motion Prompt</div>
            <CodeBlock>"Fireflies gently floating and pulsing with soft light, volumetric fog slowly drifting through the trees, subtle light rays shifting, mushrooms gently pulsing with bioluminescence, static camera, no camera movement"</CodeBlock>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: C.green, fontSize: 13, marginBottom: 6 }}>Step 4: Video Settings</div>
            <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.8 }}>
              Duration: 4 seconds (as specified)<br/>
              FPS: 24 (cinematic standard)<br/>
              Motion Intensity: Low–Medium (3–4) — subtle for smooth looping<br/>
              Camera: Static (no movement — easier to loop)<br/>
              Output: MP4, 1080p
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: C.accent, fontSize: 13, marginBottom: 6 }}>Step 5: Why These Choices?</div>
            <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.8 }}>
              Static camera + low motion = smooth seamless loop. Fireflies and fog are perfect for looping because they have natural, random movement patterns with no clear start/end point. Bioluminescence gives the scene constant gentle motion that's ideal for background animation.
            </div>
          </div>
        </div>
      </RevealButton>
    </Card>

    {/* Activity 4 */}
    <Card accent={C.green} style={{ marginBottom: 20 }}>
      <h3 style={{ color: C.green, margin: "0 0 10px", fontSize: 16 }}>Activity 4: Ethics Scenarios (5 minutes)</h3>
      <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
        For each scenario, decide: Is this ethical, unethical, or a gray area? Discuss, then reveal the answer.
      </p>

      {[
        {
          q: "You create an AI image for your art portfolio and label it as 'AI-assisted artwork.'",
          a: "✅ Ethical — You're being transparent about AI use. Disclosing AI involvement is the responsible approach. Many galleries and competitions now have specific categories for AI-assisted art."
        },
        {
          q: "You prompt the AI with 'in the exact style of [famous living digital artist]' and sell prints without mentioning AI or the artist.",
          a: "❌ Unethical — This raises multiple concerns: mimicking a living artist's distinctive style without credit, not disclosing AI use, and potentially profiting from another artist's creative identity. Reference movements or eras instead."
        },
        {
          q: "You generate an AI image of a fictional politician making a controversial statement and share it on social media as real.",
          a: "❌ Unethical and potentially illegal — This is creating disinformation/deepfake content. It's deceptive, could influence public opinion, and violates most platform policies. Some jurisdictions have laws against AI-generated political misinformation."
        },
        {
          q: "You use AI to generate initial concept sketches, then hand-paint the final piece, and submit it to a traditional art show.",
          a: "🟡 Gray Area → Leaning Ethical — Using AI for ideation/reference is increasingly common. The key question is the show's rules and whether you disclose AI was part of your process. Best practice: mention AI was used in the concept phase."
        },
      ].map((item, i) => (
        <RevealButton key={i} label={`Scenario ${i + 1}: ${item.q}`}>
          <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7 }}>
            {item.a}
          </div>
        </RevealButton>
      ))}
    </Card>

    {/* Activity 5 */}
    <Card accent={C.purple} style={{ marginBottom: 20 }}>
      <h3 style={{ color: C.purple, margin: "0 0 10px", fontSize: 16 }}>Activity 5: Math Spot-Check (3 minutes)</h3>
      <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
        Quick conceptual math questions — no calculator needed!
      </p>

      <RevealButton label="Q1: If a video is 4 seconds at 24 FPS, how many frames does the AI need to generate?">
        <MathBlock>
          4 seconds × 24 frames/second = 96 frames{"\n"}
          <span style={{ fontSize: 12, color: C.textMuted }}>The AI generates 96 individual images that play in sequence!</span>
        </MathBlock>
      </RevealButton>

      <RevealButton label="Q2: If Guidance Scale is set to 1, what happens?">
        <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7 }}>
          <strong style={{ color: C.accent }}>Answer:</strong> The AI basically ignores your text prompt. With guidance scale = 1, the equation becomes: output = ε_uncond + 1 × (ε_cond − ε_uncond) = ε_cond. But at very low values like 1, the model gives minimal weight to text conditioning, producing more random, abstract results. You need values of 7+ for the prompt to have strong influence.
        </div>
      </RevealButton>

      <RevealButton label="Q3: A diffusion model uses 50 denoising steps. If each step takes 0.5 seconds, how long to generate one image?">
        <MathBlock>
          50 steps × 0.5 seconds/step = 25 seconds{"\n"}
          <span style={{ fontSize: 12, color: C.textMuted }}>This is why image generation typically takes 10–30 seconds on most platforms!</span>
        </MathBlock>
      </RevealButton>

      <RevealButton label="Q4: You generate a 3-second video at 24 FPS. The first frame is your image. How many NEW frames does the AI predict?">
        <MathBlock>
          (3 seconds × 24 FPS) − 1 original frame = 72 − 1 = 71 new predicted frames{"\n"}
          <span style={{ fontSize: 12, color: C.textMuted }}>Frame 1 is your uploaded image. The AI predicts frames 2 through 72.</span>
        </MathBlock>
      </RevealButton>
    </Card>

    <InfoBox title="Submission Checklist" color={C.accent} icon="📋">
      Before leaving class, make sure you have:<br/>
      ✅ At least one AI-generated image saved<br/>
      ✅ At least one AI-generated video loop exported<br/>
      ✅ Both your image prompt and motion prompt written down<br/>
      ✅ Completed the activity questions above
    </InfoBox>
  </div>
);

// ─── MAIN APP ──────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("intro");
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const sectionComponents = {
    intro: <IntroSection />,
    part1: <Part1Section />,
    part2: <Part2Section />,
    workflow: <WorkflowSection />,
    lab: <LabSection />,
    ethics: <EthicsSection />,
    activity: <ActivitySection />,
  };

  const currentIdx = SECTIONS.findIndex(s => s.id === activeSection);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.surface}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.textDim}; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <header style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "14px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🎬</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.text, fontFamily: "'Playfair Display', serif" }}>
              Image-to-Video AI Pipeline
            </div>
            <div style={{ fontSize: 11, color: C.textDim }}>ART Freshman Lecture — 1h 30min</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Badge color={C.accent}>Lecture {currentIdx + 1}/{SECTIONS.length}</Badge>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "6px 12px", color: C.textMuted, cursor: "pointer", fontSize: 13,
              display: "none",
            }}
          >☰</button>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <nav style={{
          width: 240, background: C.surface, borderRight: `1px solid ${C.border}`,
          padding: "16px 12px", flexShrink: 0, overflowY: "auto",
          position: "sticky", top: 56, height: "calc(100vh - 56px)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase", paddingLeft: 8 }}>
            Sections
          </div>
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              marginBottom: 4, textAlign: "left",
              background: activeSection === s.id ? C.accentSoft : "transparent",
              color: activeSection === s.id ? C.accent : C.textMuted,
              fontWeight: activeSection === s.id ? 700 : 400,
              fontSize: 13, transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <div>
                <div>{s.label}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>{s.time}</div>
              </div>
            </button>
          ))}
          
          {/* Progress bar */}
          <div style={{ marginTop: 20, padding: "0 8px" }}>
            <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>Progress</div>
            <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
              <div style={{
                height: "100%", borderRadius: 2, background: C.accent,
                width: `${((currentIdx + 1) / SECTIONS.length) * 100}%`,
                transition: "width 0.3s",
              }} />
            </div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>
              {currentIdx + 1} of {SECTIONS.length} sections
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main ref={contentRef} style={{
          flex: 1, padding: "32px 40px", maxWidth: 860, overflowY: "auto",
          height: "calc(100vh - 56px)",
        }}>
          <div style={{ animation: "fadeIn 0.4s ease" }} key={activeSection}>
            {sectionComponents[activeSection]}
          </div>

          {/* Navigation buttons */}
          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 32,
            paddingTop: 20, borderTop: `1px solid ${C.border}`,
          }}>
            <button
              onClick={() => currentIdx > 0 && setActiveSection(SECTIONS[currentIdx - 1].id)}
              disabled={currentIdx === 0}
              style={{
                padding: "10px 20px", borderRadius: 10, border: `1px solid ${C.border}`,
                background: currentIdx > 0 ? C.card : "transparent", cursor: currentIdx > 0 ? "pointer" : "default",
                color: currentIdx > 0 ? C.text : C.textDim, fontWeight: 600, fontSize: 13,
                opacity: currentIdx === 0 ? 0.4 : 1,
              }}
            >
              ← {currentIdx > 0 ? SECTIONS[currentIdx - 1].label : "Previous"}
            </button>
            <button
              onClick={() => currentIdx < SECTIONS.length - 1 && setActiveSection(SECTIONS[currentIdx + 1].id)}
              disabled={currentIdx === SECTIONS.length - 1}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "none",
                background: currentIdx < SECTIONS.length - 1 ? C.accent : C.textDim,
                cursor: currentIdx < SECTIONS.length - 1 ? "pointer" : "default",
                color: C.bg, fontWeight: 700, fontSize: 13,
                opacity: currentIdx === SECTIONS.length - 1 ? 0.4 : 1,
              }}
            >
              {currentIdx < SECTIONS.length - 1 ? SECTIONS[currentIdx + 1].label : "Complete"} →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
