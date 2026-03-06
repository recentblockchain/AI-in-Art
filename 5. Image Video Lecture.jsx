import { useState, useEffect, useRef, useCallback } from "react";

const SECTIONS = [
  { id: 0, title: "Overview", icon: "◈" },
  { id: 1, title: "Text-to-Image Fundamentals", icon: "🎨" },
  { id: 2, title: "Denoising Mathematics", icon: "∿" },
  { id: 3, title: "Prompt Engineering", icon: "✎" },
  { id: 4, title: "Image-to-Video Generation", icon: "▶" },
  { id: 5, title: "Motion & Camera Control", icon: "⤺" },
  { id: 6, title: "Advanced Pipeline Architectures", icon: "⬡" },
  { id: 7, title: "Complete Pipeline Flowchart", icon: "⎔" },
  { id: 8, title: "Hands-on Lab", icon: "⚙" },
  { id: 9, title: "Best Practices & Ethics", icon: "☷" },
  { id: 10, title: "Class Activities & Solutions", icon: "✦" },
];

const TOOL_CATEGORIES = {
  creative: {
    title: "Best Creative Control (Art + Motion)",
    color: "#e07b4c",
    tools: [
      { name: "Runway Gen‑4.5", desc: "Industry-leading creative control with multi-modal conditioning, motion brushes, and style transfer", strength: "Motion precision" },
      { name: "Pika", desc: "Beginner-friendly with strong style consistency and intuitive motion controls", strength: "Ease of use" },
      { name: "Luma Ray 3", desc: "Fast, high-quality generation with excellent camera control and 3D-aware motion", strength: "Speed + quality" },
    ],
  },
  photorealism: {
    title: "Best Photorealism from Images",
    color: "#4ca0e0",
    tools: [
      { name: "Google Gemini Veo 3.1", desc: "State-of-the-art photorealism with native multi-modal understanding and physics-aware motion", strength: "Physics accuracy" },
      { name: "OpenAI Sora 2", desc: "Exceptional world simulation, long-form coherence, and cinematic quality", strength: "World simulation" },
      { name: "Kling 2.6", desc: "Long-form video up to 2 minutes with strong face/body consistency", strength: "Duration + consistency" },
      { name: "Luma Ray 3", desc: "Fast photorealistic output with strong lighting and reflection handling", strength: "Lighting fidelity" },
    ],
  },
  open: {
    title: "Best Open / Quasi-Open Workflows & Labs",
    color: "#5cb85c",
    tools: [
      { name: "Stable Video Diffusion (SVD / SVD‑XT)", desc: "Open-source, customizable, great for research and education. Run locally or in Colab", strength: "Full control + free" },
      { name: "ComfyUI + LTX‑2", desc: "Node-based workflow combining multiple models. NVIDIA RTX accelerated", strength: "Pipeline flexibility" },
      { name: "AnimateDiff", desc: "Attach motion modules to any Stable Diffusion checkpoint for custom animation", strength: "Model mixing" },
    ],
  },
  portrait: {
    title: "Best Portrait / Product Image-to-Video",
    color: "#9b59b6",
    tools: [
      { name: "LetsEnhance", desc: "AI-powered image enhancement + animation for product photography and portraits", strength: "Product shots" },
      { name: "Claid", desc: "Enterprise image-to-video for e-commerce with batch processing and brand consistency", strength: "E-commerce scale" },
      { name: "D-ID / HeyGen", desc: "Specialized portrait animation with lip-sync and expression control", strength: "Face animation" },
    ],
  },
};

/* ───── Reusable Components ───────────────────────────────────────── */

const RevealBox = ({ title, children, accent = "var(--accent)" }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${accent}33`, borderRadius: 12, marginBottom: 16, overflow: "hidden", background: open ? "var(--card-bg)" : "transparent", transition: "all .3s" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "14px 20px", border: "none", background: open ? `${accent}18` : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-heading)", fontSize: 15, color: "var(--text)", fontWeight: 600, transition: "all .3s" }}>
        <span>{title}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .3s", fontSize: 18, color: accent }}>▾</span>
      </button>
      {open && <div style={{ padding: "16px 20px", borderTop: `1px solid ${accent}22`, lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
};

const QuizBox = ({ question, options, correct, explanation }) => {
  const [sel, setSel] = useState(null);
  const ok = sel === correct;
  return (
    <div style={{ background: "var(--card-bg)", borderRadius: 14, padding: 24, marginBottom: 20, border: "1px solid var(--border)" }}>
      <p style={{ fontWeight: 700, marginBottom: 14, fontFamily: "var(--font-heading)", fontSize: 15, color: "var(--text)" }}>{question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((o, i) => (
          <button key={i} onClick={() => setSel(i)} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid", borderColor: sel === i ? (ok ? "#4caf50" : "#e74c3c") : "var(--border)", background: sel === i ? (ok ? "#4caf5018" : "#e74c3c18") : "transparent", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text)", transition: "all .2s" }}>
            <span style={{ fontWeight: 600, marginRight: 8, color: "var(--accent)" }}>{String.fromCharCode(65 + i)}.</span>{o}
          </button>
        ))}
      </div>
      {sel !== null && (
        <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 8, background: ok ? "#4caf5015" : "#e74c3c15", borderLeft: `3px solid ${ok ? "#4caf50" : "#e74c3c"}`, fontSize: 13, lineHeight: 1.6 }}>
          <strong>{ok ? "✓ Correct!" : "✗ Not quite."}</strong> {explanation}
        </div>
      )}
    </div>
  );
};

const CodeBlock = ({ children }) => (
  <div style={{ background: "#0d1117", borderRadius: 10, padding: "16px 20px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#e6d5b8", overflowX: "auto", marginBottom: 16, lineHeight: 1.8, border: "1px solid #21262d" }}>
    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{children}</pre>
  </div>
);

const InfoCard = ({ title, items, color = "var(--accent)" }) => (
  <div style={{ background: "var(--card-bg)", borderRadius: 14, padding: 22, marginBottom: 16, borderLeft: `4px solid ${color}` }}>
    <h4 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", fontSize: 15, color }}>{title}</h4>
    <div style={{ fontSize: 14, lineHeight: 1.7 }}>{items}</div>
  </div>
);

const FlowStep = ({ number, icon, title, desc, color }) => (
  <div style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 20px", background: "var(--card-bg)", borderRadius: 14, marginBottom: 12, border: `1px solid ${color}33`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: color }} />
    <div style={{ minWidth: 48, height: 48, borderRadius: "50%", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ background: color, color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)" }}>STEP {number}</span>
        <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: 15, color: "var(--text)" }}>{title}</h4>
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, opacity: .85 }}>{desc}</p>
    </div>
  </div>
);

const ToolCard = ({ name, desc, strength, color }) => (
  <div style={{ background: "var(--card-bg)", borderRadius: 12, padding: 18, border: `1px solid ${color}33`, flex: "1 1 220px", minWidth: 220 }}>
    <h4 style={{ margin: "0 0 8px", fontFamily: "var(--font-heading)", fontSize: 14, color }}>{name}</h4>
    <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.6, opacity: .85 }}>{desc}</p>
    <span style={{ fontSize: 11, fontWeight: 700, background: `${color}18`, color, padding: "3px 10px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>⚡ {strength}</span>
  </div>
);

const ArchBlock = ({ number, title, subtitle, children, color = "var(--accent)" }) => (
  <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 24, marginBottom: 20, border: `1px solid ${color}33`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `${color}08`, borderRadius: "0 0 0 80px" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <span style={{ background: color, color: "#fff", borderRadius: 10, padding: "4px 12px", fontSize: 12, fontWeight: 800, fontFamily: "var(--font-mono)" }}>{number}</span>
      <div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: 17, color: "var(--text)" }}>{title}</h3>
        {subtitle && <p style={{ margin: 0, fontSize: 12, color, fontStyle: "italic" }}>{subtitle}</p>}
      </div>
    </div>
    <div style={{ fontSize: 14, lineHeight: 1.75 }}>{children}</div>
  </div>
);

const Pipe = ({ steps, color = "var(--accent)" }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", padding: 16, background: "#0d111722", borderRadius: 12, marginBottom: 16 }}>
    {steps.map((s, i) => (
      <React.Fragment key={i}>
        <div style={{ background: `${color}20`, border: `1px solid ${color}44`, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color, textAlign: "center", minWidth: 80 }}>{s}</div>
        {i < steps.length - 1 && <span style={{ color: `${color}66`, fontSize: 18, fontWeight: 700 }}>→</span>}
      </React.Fragment>
    ))}
  </div>
);

/* ───── Denoising Visualization ──────────────────────────────────── */
const DenoisingViz = () => {
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);
  const N = 50;
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height, noise = 1 - step / N;
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const skyR = 240 - y * .8, skyG = 180 - y * .3, skyB = 120 + y * .5;
      const grR = 80 + x * .3, grG = 140 - x * .1, grB = 60;
      const g = y > h * .55;
      let tR = g ? grR : skyR, tG = g ? grG : skyG, tB = g ? grB : skyB;
      const dx = x - w * .7, dy = y - h * .35, d = Math.sqrt(dx * dx + dy * dy), sun = Math.max(0, 1 - d / 60);
      tR += sun * 60; tG += sun * 40; tB += sun * 10;
      const nr = (Math.random() - .5) * 255 * noise;
      img.data[i] = Math.min(255, Math.max(0, tR * (1 - noise) + 128 * noise + nr));
      img.data[i + 1] = Math.min(255, Math.max(0, tG * (1 - noise) + 128 * noise + nr));
      img.data[i + 2] = Math.min(255, Math.max(0, tB * (1 - noise) + 128 * noise + nr));
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [step]);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, fontFamily: "var(--font-mono)" }}>
        <span style={{ color: "var(--accent)" }}>Noise: {Math.round((1 - step / N) * 100)}%</span>
        <span style={{ color: "#5cb85c" }}>Clarity: {Math.round(step / N * 100)}%</span>
      </div>
      <canvas ref={canvasRef} width={320} height={200} style={{ width: "100%", maxWidth: 480, height: "auto", borderRadius: 12, border: "1px solid var(--border)", display: "block", imageRendering: "pixelated" }} />
      <input type="range" min={0} max={N} value={step} onChange={e => setStep(+e.target.value)} style={{ width: "100%", maxWidth: 480, marginTop: 10, accentColor: "var(--accent)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, maxWidth: 480, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
        <span>← Pure Noise (Step 0)</span><span>Clear Image (Step {N}) →</span>
      </div>
    </div>
  );
};

/* ───── Section Content ──────────────────────────────────────────── */

const S = {
  t: { fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 800, color: "var(--text)", margin: "0 0 8px", letterSpacing: -.5, lineHeight: 1.2 },
  intro: { fontSize: 15, lineHeight: 1.8, color: "var(--text)", marginBottom: 24, opacity: .9 },
  h3: { fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "var(--text)", margin: "28px 0 12px" },
  p: { fontSize: 14, lineHeight: 1.75, marginBottom: 16 },
};

const Sec0 = () => (
  <div>
    <h2 style={S.t}>Welcome to the AI Image‑to‑Video Pipeline</h2>
    <p style={S.intro}>This lecture teaches you how to create AI-generated images from text descriptions, then animate them into short video loops — a complete creative pipeline used in modern art, advertising, film pre-visualization, and social media content creation.</p>

    <div style={{ background: "linear-gradient(135deg, #c46d3b12, #8b6d4712)", borderRadius: 16, padding: 28, marginBottom: 24, border: "1px solid #c46d3b33" }}>
      <h3 style={{ ...S.h3, color: "var(--accent)", marginTop: 0 }}>What You Will Learn</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
        {[
          ["🎨", "Text-to-Image", "How diffusion models turn words into images"],
          ["∿", "The Math", "Simple denoising formula anyone can understand"],
          ["✎", "Prompt Craft", "Write prompts that produce stunning results"],
          ["▶", "Image-to-Video", "Animate still images with AI motion"],
          ["⤺", "Motion Control", "Camera moves, subject animation, and style"],
          ["⬡", "Advanced Pipelines", "Factorized, multi-shot, controlled, & unified architectures"],
          ["⎔", "Full Workflow", "Step-by-step pipeline from idea to video"],
          ["⚙", "Hands-on Lab", "Create your own AI video in class"],
          ["☷", "Ethics", "Responsible use of AI creative tools"],
        ].map(([ic, ti, de], i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--card-bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{ic}</span>
            <div>
              <strong style={{ fontSize: 13, fontFamily: "var(--font-heading)" }}>{ti}</strong>
              <p style={{ margin: "2px 0 0", fontSize: 12, opacity: .8 }}>{de}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <InfoCard title="Prerequisites" color="#5cb85c" items={<span>No coding or math background required. You will use free, browser-based tools. All you need is a laptop with internet access and creative curiosity.</span>} />

    <h3 style={S.h3}>2026 AI Video Tool Landscape</h3>
    <p style={S.p}>The AI video generation field has matured rapidly. Here is how the major tools break down by use case:</p>
    {Object.entries(TOOL_CATEGORIES).map(([k, cat]) => (
      <div key={k} style={{ marginBottom: 20 }}>
        <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 15, color: cat.color, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, display: "inline-block" }} />{cat.title}
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {cat.tools.map((t, i) => <ToolCard key={i} {...t} color={cat.color} />)}
        </div>
      </div>
    ))}
  </div>
);

const Sec1 = () => (
  <div>
    <h2 style={S.t}>Text-to-Image: Diffusion Models Explained</h2>
    <h3 style={{ ...S.h3, marginTop: 12 }}>What Is a Diffusion Model?</h3>
    <p style={S.p}>A diffusion model is an AI that creates images by learning to <strong>remove noise</strong>. Imagine TV static — random colored dots. The model has been trained on millions of images, so it knows: "If I see this noise pattern, the underlying image probably looks like this." It removes noise step-by-step, gradually revealing a picture guided by your text prompt.</p>

    <InfoCard title="Simple Analogy: The Sculptor" color="var(--accent)" items={<span>Think of a sculptor starting with rough marble (pure noise). Their tools chip away marble (remove noise) guided by a vision (your text prompt). After many passes, a sculpture emerges. The AI works the same way — your prompt is the "vision" guiding each step.</span>} />

    <h3 style={S.h3}>The Denoising Process</h3>
    <p style={S.p}>The AI starts with pure random noise and refines it through 25–50 steps. At each step, it predicts what noise is present and subtracts it, guided by your text prompt.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
      {[
        { label: "Pure Noise", pct: "100%", color: "#e74c3c", desc: "Random static — TV snow" },
        { label: "Rough Shapes", pct: "70%", color: "#e07b4c", desc: "Blobs of color emerge" },
        { label: "Clear Forms", pct: "35%", color: "#e0c74c", desc: "Objects recognizable" },
        { label: "Fine Details", pct: "5%", color: "#5cb85c", desc: "Sharp, polished image" },
      ].map((s, i) => (
        <div key={i} style={{ background: "var(--card-bg)", borderRadius: 12, padding: 16, textAlign: "center", border: `1px solid ${s.color}44` }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 10px", background: `conic-gradient(${s.color} 0%, ${s.color}33 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "var(--font-mono)" }}>{s.pct}</div>
          <strong style={{ fontSize: 13, display: "block", marginBottom: 4, fontFamily: "var(--font-heading)" }}>{s.label}</strong>
          <span style={{ fontSize: 11, opacity: .7 }}>{s.desc}</span>
        </div>
      ))}
    </div>

    <h3 style={S.h3}>Popular 2026 Text-to-Image Models</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginBottom: 20 }}>
      {[
        { name: "FLUX", desc: "Exceptional photorealism and text rendering. The go-to for realistic images with readable text.", best: "Photorealism, text in images", color: "#e07b4c" },
        { name: "DALL·E 3", desc: "Excellent prompt understanding. Built into Microsoft Copilot — free and accessible.", best: "Prompt accuracy, accessibility", color: "#4ca0e0" },
        { name: "Stable Diffusion 3.5", desc: "Open-source and customizable. Huge community of fine-tuned models and LoRA adapters.", best: "Customization, free", color: "#5cb85c" },
        { name: "Midjourney v7", desc: "Known for stunning artistic quality and aesthetic appeal. Strong default 'look.'", best: "Artistic quality", color: "#9b59b6" },
      ].map((m, i) => (
        <div key={i} style={{ background: "var(--card-bg)", borderRadius: 14, padding: 20, border: `1px solid ${m.color}33`, borderTop: `3px solid ${m.color}` }}>
          <h4 style={{ margin: "0 0 8px", fontFamily: "var(--font-heading)", fontSize: 16, color: m.color }}>{m.name}</h4>
          <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.6 }}>{m.desc}</p>
          <span style={{ fontSize: 11, fontWeight: 700, background: `${m.color}15`, color: m.color, padding: "3px 10px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>Best for: {m.best}</span>
        </div>
      ))}
    </div>

    <h3 style={S.h3}>How CLIP Connects Text to Images</h3>
    <p style={S.p}>CLIP (Contrastive Language-Image Pre-training) acts as a translator between language and visuals. Trained on billions of text-image pairs, it converts your prompt into a numerical "direction" that guides the denoising at every step.</p>
    <Pipe steps={["Your Text", "CLIP Encoder", "Guidance Signal", "Denoiser (×25-50)", "Final Image"]} color="#4ca0e0" />
  </div>
);

const Sec2 = () => (
  <div>
    <h2 style={S.t}>The Math Behind Denoising (Simplified)</h2>
    <p style={S.intro}>You do not need to be a math expert. The core idea is one simple formula that the AI repeats over and over.</p>

    <div style={{ background: "#0d1117", borderRadius: 16, padding: 28, marginBottom: 24, textAlign: "center", border: "1px solid #21262d" }}>
      <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 12, fontFamily: "var(--font-mono)" }}>THE CORE FORMULA</p>
      <div style={{ fontSize: 22, color: "#e6d5b8", fontFamily: "var(--font-mono)", marginBottom: 12, letterSpacing: 1 }}>Cleaner Image = Noisy Image − Predicted Noise</div>
      <div style={{ fontSize: 16, color: "#e07b4c", fontFamily: "var(--font-mono)" }}>x<sub>t−1</sub> = x<sub>t</sub> − ε<sub>θ</sub>(x<sub>t</sub>, t, text)</div>
    </div>

    <h3 style={S.h3}>What Each Symbol Means</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
      {[
        { sym: "x_t", meaning: "Current noisy image", analogy: "A muddy window you're cleaning", color: "#e74c3c" },
        { sym: "ε_θ", meaning: "AI's noise prediction", analogy: "A smart squeegee that knows where the dirt is", color: "#e07b4c" },
        { sym: "x_{t−1}", meaning: "Slightly cleaner result", analogy: "The window after one squeegee pass", color: "#5cb85c" },
        { sym: "t", meaning: "Current step number", analogy: "Which cleaning pass you're on", color: "#4ca0e0" },
        { sym: "text", meaning: "Your text prompt", analogy: "Instructions: 'clean to reveal a sunset'", color: "#9b59b6" },
      ].map((s, i) => (
        <div key={i} style={{ background: "var(--card-bg)", borderRadius: 12, padding: 16, borderLeft: `4px solid ${s.color}` }}>
          <code style={{ fontSize: 15, color: s.color, fontFamily: "var(--font-mono)", fontWeight: 700 }}>{s.sym}</code>
          <p style={{ margin: "6px 0 4px", fontSize: 13, fontWeight: 600 }}>{s.meaning}</p>
          <p style={{ margin: 0, fontSize: 12, opacity: .75, fontStyle: "italic" }}>🪟 {s.analogy}</p>
        </div>
      ))}
    </div>

    <h3 style={S.h3}>Worked Example: 5-Step Denoising</h3>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      {[
        { step: 0, noise: 100, label: "TV static", color: "#e74c3c" },
        { step: 1, noise: 75, label: "Vague blobs", color: "#e07b4c" },
        { step: 2, noise: 45, label: "Shapes emerge", color: "#e0c74c" },
        { step: 3, noise: 20, label: "Clear forms", color: "#8bc34a" },
        { step: 4, noise: 5, label: "Fine details", color: "#4caf50" },
        { step: 5, noise: 0, label: "Done!", color: "#2e7d32" },
      ].map((s, i) => (
        <div key={i} style={{ flex: "1 1 90px", textAlign: "center", padding: "12px 8px", background: `${s.color}12`, borderRadius: 10, border: `1px solid ${s.color}33`, minWidth: 90 }}>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: s.color, fontWeight: 700 }}>Step {s.step}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: "4px 0" }}>{s.noise}%</div>
          <div style={{ fontSize: 11, opacity: .8 }}>{s.label}</div>
        </div>
      ))}
    </div>

    <CodeBlock>{`At each step the AI does:
Step 1: noise_100_image − predicted_noise = noise_75_image
Step 2: noise_75_image  − predicted_noise = noise_45_image
Step 3: noise_45_image  − predicted_noise = noise_20_image
Step 4: noise_20_image  − predicted_noise = noise_5_image
Step 5: noise_5_image   − predicted_noise = final_clear_image

Each "predicted_noise" is guided by your text prompt via CLIP!`}</CodeBlock>

    <h3 style={S.h3}>Interactive: Watch Denoising Happen</h3>
    <p style={S.p}>Drag the slider to simulate denoising — watch a landscape emerge from pure noise:</p>
    <DenoisingViz />

    <QuizBox question="In x_{t-1} = x_t − ε_θ(x_t, t, text), what does ε_θ represent?" options={["The final clean image", "The AI's prediction of what noise is present", "The text prompt", "The random starting noise"]} correct={1} explanation="ε_θ is the neural network that predicts the noise in the current image. The AI subtracts this predicted noise to get a cleaner version." />
  </div>
);

const Sec3 = () => (
  <div>
    <h2 style={S.t}>Prompt Engineering for Art</h2>
    <p style={S.intro}>The quality of your AI image depends enormously on how you write your prompt. A great prompt is specific, vivid, and structured.</p>

    <div style={{ background: "#0d1117", borderRadius: 14, padding: 24, marginBottom: 24, border: "1px solid #21262d" }}>
      <p style={{ color: "#8b949e", fontSize: 12, margin: "0 0 12px", fontFamily: "var(--font-mono)" }}>THE PROMPT FORMULA</p>
      <div style={{ fontSize: 14, color: "#e6d5b8", fontFamily: "var(--font-mono)", lineHeight: 2 }}>
        <span style={{ color: "#e07b4c" }}>[Subject]</span> + <span style={{ color: "#4ca0e0" }}>[Art Style]</span> + <span style={{ color: "#e0c74c" }}>[Lighting]</span> + <span style={{ color: "#5cb85c" }}>[Colors]</span> + <span style={{ color: "#9b59b6" }}>[Mood]</span> + <span style={{ color: "#e74c3c" }}>[Details]</span>
      </div>
    </div>

    <h3 style={S.h3}>Three Levels of Prompt Complexity</h3>
    <RevealBox title="🟢 Beginner: Simple & Direct" accent="#5cb85c">
      <CodeBlock>{"A cat sitting on a windowsill at sunset"}</CodeBlock>
      <p style={{ fontSize: 13, lineHeight: 1.7 }}>Works but gives the AI maximum freedom — you might not get what you envisioned.</p>
    </RevealBox>
    <RevealBox title="🟡 Intermediate: Structured" accent="#e0c74c">
      <CodeBlock>{"A fluffy orange tabby cat sitting on a rustic wooden windowsill,\ngolden hour sunlight streaming in, watercolor painting style,\nwarm amber and honey tones, peaceful and cozy atmosphere"}</CodeBlock>
      <p style={{ fontSize: 13, lineHeight: 1.7 }}>Specifies subject, setting, lighting, style, colors, and mood. Much more control.</p>
    </RevealBox>
    <RevealBox title="🔴 Advanced: Professional Quality" accent="#e07b4c">
      <CodeBlock>{"A fluffy orange tabby cat perched on a weathered oak windowsill,\nrays of warm golden hour light casting long shadows across\nantique lace curtains, watercolor and gouache mixed media style\ninspired by Studio Ghibli backgrounds, palette of burnt sienna,\nraw umber, and cadmium yellow, dreamy nostalgic atmosphere with\nvisible brushstrokes and soft paper texture, highly detailed,\n4K quality, trending on artstation"}</CodeBlock>
      <p style={{ fontSize: 13, lineHeight: 1.7 }}>Specifies exact art references, named paint colors, texture details, and quality keywords for maximum control.</p>
    </RevealBox>

    <h3 style={S.h3}>Style Keywords by Category</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
      {[
        { cat: "Art Styles", words: "watercolor, oil painting, digital art, anime, pixel art, charcoal sketch, art nouveau, ukiyo-e, impressionist, pop art", color: "#e07b4c" },
        { cat: "Lighting", words: "golden hour, blue hour, neon glow, moonlight, dramatic chiaroscuro, soft diffused, backlighting, volumetric rays", color: "#e0c74c" },
        { cat: "Mood", words: "peaceful, dramatic, mysterious, whimsical, melancholic, energetic, ethereal, nostalgic, ominous, joyful", color: "#9b59b6" },
        { cat: "Quality", words: "highly detailed, 4K, 8K, artstation, masterpiece, professional, award-winning, sharp focus, depth of field", color: "#5cb85c" },
      ].map((c, i) => (
        <div key={i} style={{ background: "var(--card-bg)", borderRadius: 12, padding: 16, borderTop: `3px solid ${c.color}` }}>
          <h4 style={{ margin: "0 0 8px", fontSize: 13, color: c.color, fontFamily: "var(--font-heading)" }}>{c.cat}</h4>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.8, opacity: .85 }}>{c.words}</p>
        </div>
      ))}
    </div>

    <h3 style={S.h3}>Negative Prompts</h3>
    <p style={S.p}>Negative prompts tell the AI what to <em>avoid</em>:</p>
    <CodeBlock>{`Negative prompt examples:
"blurry, low quality, distorted, extra fingers, watermark,
 text, signature, cropped, oversaturated, 3D render, plastic"`}</CodeBlock>

    <h3 style={S.h3}>Optimizing for Video: Loop-Friendly Prompts</h3>
    <InfoCard title="Key Tip" color="#e07b4c" items={<span>When your image will become a video, choose subjects with <strong>natural repeating motion</strong>: ocean waves, swaying grass, flickering candles, flowing water, drifting clouds, falling snow.</span>} />
    <CodeBlock>{`Video-optimized prompt:
"Tranquil mountain lake at dawn, mirror-still water with gentle
ripples, wispy clouds drifting across pastel pink and lavender
sky, watercolor style, serene atmosphere, foreground wildflowers
swaying gently in breeze, highly detailed"

✓ Water ripples = natural loop  ✓ Clouds = continuous motion
✓ Flowers swaying = organic loop  ✓ No complex faces to distort`}</CodeBlock>
  </div>
);

const Sec4 = () => (
  <div>
    <h2 style={S.t}>Image-to-Video Generation</h2>
    <p style={S.intro}>Once you have a beautiful AI image, bring it to life. Image-to-video AI predicts how your still image would move over time — like an AI-powered flipbook from a single drawing.</p>

    <h3 style={{ ...S.h3, marginTop: 12 }}>How Frame Prediction Works</h3>
    <p style={S.p}>A video is a sequence of images (frames) shown rapidly. The AI takes your image and predicts what the next frame would look like if the scene were moving. Then the next, and so on.</p>
    <Pipe steps={["Your Image", "Frame 1", "Frame 2", "Frame 3", "…", "Frame 96", "Video!"]} />

    <InfoCard title="Analogy: The Flipbook" color="#4ca0e0" items={<span>Remember flipbooks? You draw a slightly different picture on each page, then flip quickly to see animation. AI does the same — it predicts each next page based on your first drawing and motion description.</span>} />

    <h3 style={S.h3}>Video Generation Parameters</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
      {[
        { param: "Duration", range: "3–10 seconds", tip: "Shorter = better quality. Start with 4 seconds.", icon: "⏱", color: "#e07b4c" },
        { param: "Frame Rate (FPS)", range: "24 or 30 fps", tip: "24fps = cinematic, 30fps = smooth", icon: "🎞", color: "#4ca0e0" },
        { param: "Resolution", range: "720p – 1080p", tip: "720p for speed, 1080p for quality", icon: "📐", color: "#5cb85c" },
        { param: "Motion Intensity", range: "Low / Med / High", tip: "Low for faces, Medium for landscapes", icon: "💨", color: "#9b59b6" },
        { param: "Guidance Scale (CFG)", range: "5 – 15", tip: "Higher = follows prompt more, may look stiff", icon: "🎯", color: "#e0c74c" },
        { param: "Seed", range: "Random or fixed", tip: "Fix seed for reproducible results", icon: "🌱", color: "#e74c3c" },
      ].map((p, i) => (
        <div key={i} style={{ background: "var(--card-bg)", borderRadius: 12, padding: 18, border: `1px solid ${p.color}33` }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
          <h4 style={{ margin: "0 0 4px", fontSize: 14, fontFamily: "var(--font-heading)", color: p.color }}>{p.param}</h4>
          <p style={{ margin: "0 0 6px", fontSize: 13, fontFamily: "var(--font-mono)" }}>{p.range}</p>
          <p style={{ margin: 0, fontSize: 12, opacity: .75 }}>{p.tip}</p>
        </div>
      ))}
    </div>

    <h3 style={S.h3}>The Video Math</h3>
    <div style={{ background: "#0d1117", borderRadius: 14, padding: 24, marginBottom: 20, textAlign: "center", border: "1px solid #21262d" }}>
      <div style={{ fontSize: 18, color: "#e6d5b8", fontFamily: "var(--font-mono)", marginBottom: 8 }}>Total Frames = Duration × FPS</div>
      <div style={{ fontSize: 14, color: "#e07b4c", fontFamily: "var(--font-mono)" }}>Example: 4 sec × 24 fps = <strong>96 frames</strong></div>
    </div>

    <h3 style={S.h3}>Tools by Use Case</h3>
    {Object.entries(TOOL_CATEGORIES).map(([k, cat]) => (
      <RevealBox key={k} title={cat.title} accent={cat.color}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{cat.tools.map((t, i) => <ToolCard key={i} {...t} color={cat.color} />)}</div>
      </RevealBox>
    ))}

    <QuizBox question="A 6-second video at 30fps requires how many frames?" options={["120", "150", "180", "200"]} correct={2} explanation="Total Frames = 6 × 30 = 180. Each frame is a separate image the AI generates." />
  </div>
);

const Sec5 = () => (
  <div>
    <h2 style={S.t}>Motion Prompts & Camera Control</h2>
    <p style={S.intro}>Motion prompts tell the AI <em>how</em> to animate your image — camera movements, subject motion, environmental effects.</p>

    <h3 style={{ ...S.h3, marginTop: 12 }}>Camera Movement Types</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 20 }}>
      {[
        { move: "Pan Left / Right", desc: "Camera slides horizontally, revealing a wide scene", prompt: '"slow camera pan right revealing city skyline"', best: "Landscapes, cityscapes", color: "#e07b4c" },
        { move: "Tilt Up / Down", desc: "Camera rotates vertically, showing height", prompt: '"gentle tilt upward to reveal mountain peak"', best: "Waterfalls, architecture", color: "#4ca0e0" },
        { move: "Zoom In / Out", desc: "Camera moves closer or farther", prompt: '"slow cinematic zoom into character\'s eyes"', best: "Portraits, emotional moments", color: "#e0c74c" },
        { move: "Dolly / Track", desc: "Camera physically moves through scene", prompt: '"dolly forward through enchanted forest path"', best: "Immersive environments", color: "#5cb85c" },
        { move: "Orbit", desc: "Camera circles around subject", prompt: '"camera slowly orbits around sculpture"', best: "3D objects, products", color: "#9b59b6" },
        { move: "Static + Subject Motion", desc: "Camera still; subject moves", prompt: '"wind blowing through hair, leaves falling"', best: "Portraits, still life", color: "#e74c3c" },
      ].map((m, i) => (
        <div key={i} style={{ background: "var(--card-bg)", borderRadius: 14, padding: 18, border: `1px solid ${m.color}33`, borderTop: `3px solid ${m.color}` }}>
          <h4 style={{ margin: "0 0 6px", fontSize: 14, fontFamily: "var(--font-heading)", color: m.color }}>{m.move}</h4>
          <p style={{ margin: "0 0 8px", fontSize: 12, lineHeight: 1.6 }}>{m.desc}</p>
          <div style={{ background: "#0d1117", borderRadius: 8, padding: "8px 12px", fontSize: 11, fontFamily: "var(--font-mono)", color: "#e6d5b8", marginBottom: 8, lineHeight: 1.5 }}>{m.prompt}</div>
          <span style={{ fontSize: 10, fontWeight: 700, background: `${m.color}15`, color: m.color, padding: "2px 8px", borderRadius: 5, fontFamily: "var(--font-mono)" }}>Best for: {m.best}</span>
        </div>
      ))}
    </div>

    <h3 style={S.h3}>Complete Motion Prompt Examples</h3>
    <RevealBox title="🌾 Nature Scene" accent="#5cb85c">
      <CodeBlock>{`Camera: "Slow pan right across wheat field"
Subject: "Golden wheat stalks swaying in warm breeze"
Environment: "Soft clouds drifting, butterflies floating"

Combined: "Slow camera pan right across golden wheat field
at magic hour, stalks swaying in breeze, clouds drifting,
butterflies floating, dreamy peaceful motion"`}</CodeBlock>
    </RevealBox>
    <RevealBox title="🏙 Cityscape" accent="#4ca0e0">
      <CodeBlock>{`Camera: "Slow tilt up from street to rooftops"
Subject: "Neon signs flickering, wet pavement reflections"
Environment: "Light rain, car headlights, rising steam"

Combined: "Slow cinematic tilt up from rain-soaked Tokyo
street to neon rooftops, signs flickering with reflections,
light rain, headlights streaking, cyberpunk atmosphere"`}</CodeBlock>
    </RevealBox>
    <RevealBox title="👤 Portrait (CAUTION)" accent="#e74c3c">
      <CodeBlock>{`⚠ IMPORTANT: Portraits need VERY subtle motion!

Camera: "Static, slight push in"
Subject: "Very subtle breathing, gentle hair movement"
Environment: "Soft bokeh lights shifting slightly"

Combined: "Static camera with very slow subtle zoom,
barely perceptible breathing, strands of hair moving,
soft bokeh drifting, extremely subtle movement only"

Keep motion intensity LOW for faces — high = distortion`}</CodeBlock>
    </RevealBox>

    <QuizBox question="Best camera movement for a waterfall's full height?" options={["Pan Right", "Tilt Up", "Orbit", "Dolly Forward"]} correct={1} explanation="Tilt Up rotates the camera vertically, perfect for revealing tall subjects like waterfalls from bottom to top." />
  </div>
);

const Sec6 = () => (
  <div>
    <h2 style={S.t}>Advanced Pipeline Architectures</h2>
    <p style={S.intro}>The simple "make an image, animate it" pipeline is just the beginning. Modern systems use image-to-video as a core building block inside much more sophisticated architectures.</p>

    <ArchBlock number="1" title="Factorized Text → Image → Video" subtitle="Emu-Style Two-Stage Pipeline" color="#e07b4c">
      <p>State-of-the-art systems split text-to-video into two explicit stages:</p>
      <Pipe steps={["Text Prompt", "T2I Model", "Keyframe", "Img2Vid Model", "Video"]} color="#e07b4c" />
      <p><strong>Stage 1 — Text-to-Image:</strong> Generate a high-quality keyframe from your prompt.</p>
      <p><strong>Stage 2 — Image-to-Video:</strong> Animate the keyframe, still conditioned on the original text.</p>
      <InfoCard title="Why This Matters" color="#e07b4c" items={<span>Reuse powerful T2I models and wrap them with a video module instead of training a monolithic T2V model. You get explicit control: edit the keyframe, then re-run video without touching the text. Factorization: text → image, then (text, image) → video. <strong>Emu Video</strong> by Meta is the canonical example.</span>} />
    </ArchBlock>

    <ArchBlock number="2" title="Multi-Shot & Story-Level Generation" subtitle="From Single Clips to Narratives" color="#4ca0e0">
      <p>Extends simple img2vid to generate connected shots telling a story:</p>
      <Pipe steps={["Story Script", "Shot Descriptions", "Keyframes/Shot", "Img2Vid/Shot", "Transitions", "Sequence"]} color="#4ca0e0" />
      <p>Generate shot descriptions from your story → create consistent character keyframes using reference images → animate each via img2vid → concatenate with transitions.</p>
      <InfoCard title="Technical Detail" color="#4ca0e0" items={<span>Systems add <strong>transition tokens</strong> and <strong>local attention masks</strong> so one diffusion model handles multiple shots and transitions in a single pass. Img2vid becomes a controllable animation engine per shot, keeping characters and style consistent. This extends T2V from "one clip per prompt" to full story-level pipelines.</span>} />
    </ArchBlock>

    <ArchBlock number="3" title="Conditioned / Controlled Video Diffusion" subtitle="Images as Control Signals" color="#5cb85c">
      <p>Instead of just "starting frames," images become structured control conditions:</p>
      <Pipe steps={["Text", "Control Images", "UNet + 3D Branch", "Temporal Consistency", "Video"]} color="#5cb85c" />
      <p><strong>ConditionVideo:</strong> Training-free method using T2I models + control branch for motion guidance. A UNet handles base diffusion; a 3D control branch injects pose, depth, and image conditions over time.</p>
      <p><strong>AnimateDiff:</strong> Attaches motion adapter to any Stable Diffusion checkpoint, converting T2I into T2V.</p>
      <InfoCard title="Key Insight" color="#5cb85c" items={<span>Images become <strong>structured conditions</strong> (identity, layout, pose, depth) that steer the video generator frame-by-frame — much finer control than "animate this image."</span>} />
    </ArchBlock>

    <ArchBlock number="4" title="Unbounded & Controllable Motion Paths" subtitle="User-Specified Trajectories" color="#9b59b6">
      <Pipe steps={["Text (semantics)", "Ref Image (identity)", "Motion Path", "Video Transformer", "Video"]} color="#9b59b6" />
      <p><strong>Frame In-N-Out:</strong> Objects enter/exit along user-specified paths while preserving identity. Uses video diffusion transformer with explicit motion + identity conditioning.</p>
      <InfoCard title="The Pattern" color="#9b59b6" items={<span>Text = what (semantics). Images = who (appearance). Control signals = how (paths, depth, trajectories). Result: <strong>text + reference image + motion spec → controllable longer videos</strong>, not random motion.</span>} />
    </ArchBlock>

    <ArchBlock number="5" title="Autoregressive Extensions & Upsampling" subtitle="Chaining for Length and Quality" color="#e0c74c">
      <Pipe steps={["Base Clip (4s)", "Last Frames →", "Next Clip", "Last Frames →", "Next Clip", "…", "Long Video"]} color="#e0c74c" />
      <p><strong>Temporal extension:</strong> Generate a base clip, condition the next on its last frames, repeat autoregressively.</p>
      <p><strong>Upsampling:</strong> Generate coarse low-fps/low-res video first, then run upsampler models for temporal and spatial super-resolution.</p>
      <InfoCard title="How It Works" color="#e0c74c" items={<span>Img2vid serves as the <strong>base generator</strong> for short segments and a <strong>refinement tool</strong> for inserting motion between keyframes. This is how Kling 2.6 achieves 2-minute videos — chaining short generations seamlessly.</span>} />
    </ArchBlock>

    <ArchBlock number="6" title="Unified Text / Image / Video Conditioning" subtitle="Tri-Modal Systems" color="#e74c3c">
      <p>Some systems accept text, image, or both through one unified backend:</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 14 }}>
        {[
          { mode: "Text Only", input: "Just a prompt", ex: "Sora 2, Runway" },
          { mode: "Image Only", input: "Just an image", ex: "SVD, LetsEnhance" },
          { mode: "Text + Image", input: "Prompt + reference", ex: "Luma Ray 3, Kling" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#0d111722", borderRadius: 10, padding: 14, textAlign: "center", border: "1px solid var(--border)" }}>
            <strong style={{ fontSize: 13, color: "#e74c3c", display: "block", marginBottom: 4 }}>{m.mode}</strong>
            <p style={{ margin: "0 0 4px", fontSize: 12 }}>{m.input}</p>
            <span style={{ fontSize: 10, opacity: .7, fontFamily: "var(--font-mono)" }}>{m.ex}</span>
          </div>
        ))}
      </div>
      <p>LTX-2 in ComfyUI and NVIDIA RTX templates let you use text for motion/style + image for appearance, generating video with both conditions. Img2vid is an <strong>operating mode</strong> of a general system.</p>
    </ArchBlock>

    <ArchBlock number="7" title="Practical Extension Patterns" subtitle="Design Your Own Pipelines" color="#2e7d32">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
        {[
          { p: "Factorized Design", d: "T2I → img2vid → upsampler. Emu Video canonical example.", c: "#e07b4c" },
          { p: "Story Pipelines", d: "Multi-shot plan → keyframes (ref images) → per-shot img2vid → concatenation + transitions.", c: "#4ca0e0" },
          { p: "Controlled Motion", d: "Add pose/depth/path inputs so img2vid is a controlled module, not 'animate however.'", c: "#5cb85c" },
          { p: "Unified UI", d: "'Prompt only / Prompt+Image / Image only' — three faces of one T2V engine.", c: "#e74c3c" },
        ].map((x, i) => (
          <div key={i} style={{ background: `${x.c}10`, borderRadius: 12, padding: 16, border: `1px solid ${x.c}33`, borderLeft: `4px solid ${x.c}` }}>
            <strong style={{ fontSize: 13, color: x.c, display: "block", marginBottom: 6, fontFamily: "var(--font-heading)" }}>{x.p}</strong>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>{x.d}</p>
          </div>
        ))}
      </div>
      <InfoCard title="The Big Picture" color="#2e7d32" items={<span>These extensions turn basic img2vid from a simple animation trick into a <strong>central building block for controllable, text-driven video generation systems</strong> powering Hollywood, advertising, and content creation at scale.</span>} />
    </ArchBlock>

    <QuizBox question="In a factorized (Emu-style) pipeline, what is the main advantage of two stages?" options={["Less computing power", "You can edit the keyframe independently before animating", "Only works with open-source models", "Produces longer videos automatically"]} correct={1} explanation="The factorized approach gives explicit control: generate, review, and edit the keyframe before running the video stage, without regenerating everything." />
  </div>
);

const Sec7 = () => (
  <div>
    <h2 style={S.t}>Complete Pipeline Flowchart</h2>
    <p style={S.intro}>The full step-by-step workflow from creative idea to finished AI video:</p>

    {[
      { n: 1, icon: "💭", title: "Write Your Text Prompt", desc: "Subject + Art Style + Lighting + Colors + Mood + Details. Include negative prompts.", color: "#e07b4c" },
      { n: 2, icon: "🎨", title: "Generate AI Image", desc: "Feed prompt into T2I model (FLUX, DALL·E 3, SD). Denoise 25–50 steps. Generate 4–8 variations.", color: "#4ca0e0" },
      { n: 3, icon: "👁", title: "Review & Refine", desc: "Check composition, colors, artifacts. Regenerate if needed. Choose clearest focal point.", color: "#e0c74c" },
      { n: 4, icon: "📤", title: "Upload to Video Tool", desc: "Choose: Runway Gen-4.5 (creative), Veo 3.1 (photorealism), Pika (simple), SVD (open).", color: "#5cb85c" },
      { n: 5, icon: "🎬", title: "Write Motion Prompt", desc: "Camera movement + subject motion + environment + speed. Keep portraits subtle.", color: "#9b59b6" },
      { n: 6, icon: "⚙️", title: "Set Parameters", desc: "Duration (4s), FPS (24), resolution (720p–1080p), motion intensity, guidance scale.", color: "#e74c3c" },
      { n: 7, icon: "✨", title: "Generate & Export", desc: "Run generation. Review for smooth motion and no distortions. Export MP4 or GIF.", color: "#2e7d32" },
    ].map((s, i) => <FlowStep key={i} number={s.n} icon={s.icon} title={s.title} desc={s.desc} color={s.color} />)}

    <h3 style={{ ...S.h3, marginTop: 28 }}>Pro Tips</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
      {[
        ["🎯", "Generate 4–8 image variations and pick the best before video"],
        ["👁", "Choose images with clear focal points — busy images = confusing videos"],
        ["🔄", "Design for loopability: water, wind, fire, and clouds loop naturally"],
        ["📐", "Match resolutions between image and video output"],
        ["📚", "Save successful prompts — build a personal prompt library"],
        ["🧩", "Use factorized approach: perfect image first, then animate"],
      ].map(([ic, t], i) => (
        <div key={i} style={{ background: "var(--card-bg)", borderRadius: 10, padding: 14, border: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{ic}</span>
          <span style={{ fontSize: 12, lineHeight: 1.6 }}>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

const Sec8 = () => (
  <div>
    <h2 style={S.t}>Hands-on Lab: Create Your AI Video</h2>
    <p style={S.intro}>Follow these six steps to create your own AI video. All tools are free.</p>

    <FlowStep number={1} icon="🎯" title="Choose Your Theme" color="#e07b4c" desc="Pick one: Dreamy Landscape (mountain lake, sunset valley), Surreal Architecture (floating structures), Living Still Life (flowers blooming, candle flickering), Ocean / Water (waves, underwater), Neon Cityscape (futuristic, rainy street), Abstract Portrait (stylized, geometric)." />
    <FlowStep number={2} icon="✎" title="Write Your Image Prompt" color="#4ca0e0" desc="Use the template: [Subject + setting], [art style] style, [lighting], [2-3 named colors] palette, [mood], [quality keywords]. Be specific with every element." />
    <FlowStep number={3} icon="🎨" title="Generate Your Image" color="#e0c74c" desc="Free tools: Microsoft Copilot Designer (DALL·E 3), Playground AI (multiple models), Leonardo AI (free daily credits). Generate 3-4 variations. Pick the best composition." />
    <FlowStep number={4} icon="🎬" title="Write Your Motion Prompt" color="#5cb85c" desc="Describe: Camera movement (e.g., 'slow pan right'), Subject motion (e.g., 'water flowing'), Environment (e.g., 'clouds drifting'). Add speed: 'slow, gentle.' Avoid fast motion and complex face movement." />
    <FlowStep number={5} icon="⚙️" title="Generate Your Video" color="#9b59b6" desc="Upload to: Pika (beginner-friendly, free), Runway Gen-4.5 (best quality, limited free), Luma Dream Machine (fast, free tier). Settings: 4 seconds, Low-Medium motion, 720p." />
    <FlowStep number={6} icon="✨" title="Review & Export" color="#e74c3c" desc="Check: Smooth motion (no jerky jumps), no distortions, good loop quality, mood matches vision. Fix: reduce intensity, simplify motion prompt, try different image. Export as MP4 or GIF." />

    <h3 style={{ ...S.h3, marginTop: 24 }}>Lab Prompt Template</h3>
    <CodeBlock>{`IMAGE PROMPT TEMPLATE:
"[Subject + setting in vivid detail],
 [art style] style, [lighting description],
 [2-3 named colors] palette,
 [mood] atmosphere, highly detailed"

MOTION PROMPT TEMPLATE:
"[Camera movement], [subject motion],
 [environment motion], [speed/intensity]"

EXAMPLE (Enchanted Forest):
Image: "Ancient moss-covered stone bridge over crystal
 stream in enchanted forest, watercolor and ink, dappled
 golden sunlight through canopy, emerald green and warm
 amber palette, magical peaceful atmosphere, highly detailed"

Motion: "Very slow push forward toward bridge, gentle water
 flowing with small ripples, light particles floating,
 leaves slowly drifting down, slow dreamy movement"

Parameters: 4 seconds | Low-Medium motion | 720p`}</CodeBlock>
  </div>
);

const Sec9 = () => (
  <div>
    <h2 style={S.t}>Best Practices & Ethics</h2>

    <h3 style={{ ...S.h3, marginTop: 12 }}>Do's and Don'ts</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
      <div style={{ background: "#4caf5010", borderRadius: 14, padding: 20, border: "1px solid #4caf5033" }}>
        <h4 style={{ color: "#4caf50", margin: "0 0 12px", fontFamily: "var(--font-heading)", fontSize: 15 }}>✓ DO</h4>
        {["Always disclose AI-generated content", "Credit tools used (e.g., 'Made with Runway Gen-4.5')", "Experiment with multiple variations", "Use AI as creative starting point, add your vision", "Start with short clips (3–4s), work up", "Save your prompt library", "Learn factorized workflows for maximum control", "Match tools to use cases"].map((x, i) => (
          <p key={i} style={{ margin: "0 0 8px", fontSize: 13, lineHeight: 1.6 }}>• {x}</p>
        ))}
      </div>
      <div style={{ background: "#e74c3c10", borderRadius: 14, padding: 20, border: "1px solid #e74c3c33" }}>
        <h4 style={{ color: "#e74c3c", margin: "0 0 12px", fontFamily: "var(--font-heading)", fontSize: 15 }}>✗ DON'T</h4>
        {["Claim AI work as entirely hand-made", "Create deepfakes of real people", "Copy a living artist's style without credit", "Ignore tool licensing terms", "Use maximum motion intensity (always distorts)", "Generate harmful or misleading content", "Submit AI work without following class AI policy", "Assume one tool fits all needs"].map((x, i) => (
          <p key={i} style={{ margin: "0 0 8px", fontSize: 13, lineHeight: 1.6 }}>• {x}</p>
        ))}
      </div>
    </div>

    <h3 style={S.h3}>Ethics Deep Dive</h3>
    <RevealBox title="🎨 Who Is the Author?" accent="#e07b4c">
      <p style={{ fontSize: 13, lineHeight: 1.7 }}>When you write a prompt and curate output, you act as <strong>creative director</strong>. The AI is a tool like a camera. But transparency is essential — always disclose AI involvement. Your value: conceptual vision, prompt crafting, curation, combination of outputs.</p>
    </RevealBox>
    <RevealBox title="📊 Training Data Concerns" accent="#4ca0e0">
      <p style={{ fontSize: 13, lineHeight: 1.7 }}>AI models train on billions of internet images, including copyrighted work. This is an ongoing legal/ethical debate. Some artists have sued; others embrace the tech. Be aware of this tension and respect artists' wishes.</p>
    </RevealBox>
    <RevealBox title="💼 Impact on Creative Jobs" accent="#5cb85c">
      <p style={{ fontSize: 13, lineHeight: 1.7 }}>Some roles (stock photography, simple motion graphics) face automation. New roles emerge: AI prompt engineers, AI art directors, pipeline designers. Learning both technology AND ethics makes you more valuable.</p>
    </RevealBox>
    <RevealBox title="⚠️ Misinformation & Deepfakes" accent="#e74c3c">
      <p style={{ fontSize: 13, lineHeight: 1.7 }}>AI video is realistic enough to fool people. Always label AI content. Many platforms require disclosure. Some tools add invisible watermarks. As a creator, be transparent about what's real vs generated.</p>
    </RevealBox>

    <h3 style={S.h3}>Common Mistakes & Fixes</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
      {[
        { m: "Generic, boring images", f: "Add specific style, lighting, mood, color details", i: "🖼" },
        { m: "Face/hand distortion", f: "Use LOW motion intensity for faces/hands", i: "👤" },
        { m: "Poor looping", f: "Choose natural repeating motion (water, wind)", i: "🔄" },
        { m: "Wrong colors in video", f: "Match color profiles; avoid extreme saturation", i: "🎨" },
        { m: "Garbled text in image", f: "Use FLUX model; keep text short and large", i: "🔤" },
        { m: "Jerky motion", f: "Reduce intensity; simplify motion prompt; try 24fps", i: "💨" },
      ].map((x, i) => (
        <div key={i} style={{ background: "var(--card-bg)", borderRadius: 12, padding: 16, border: "1px solid var(--border)" }}>
          <span style={{ fontSize: 20, display: "block", marginBottom: 6 }}>{x.i}</span>
          <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#e74c3c" }}>Problem: {x.m}</p>
          <p style={{ margin: 0, fontSize: 13, color: "#5cb85c" }}>Fix: {x.f}</p>
        </div>
      ))}
    </div>
  </div>
);

const Sec10 = () => (
  <div>
    <h2 style={S.t}>Class Activities & Solutions</h2>

    <ArchBlock number="Activity 1" title="Fix the Bad Prompt" subtitle="Prompt Engineering Practice" color="#e07b4c">
      <p><strong>Bad Prompt:</strong></p>
      <CodeBlock>{"\"A pretty picture of a forest\""}</CodeBlock>
      <p>What's wrong? Rewrite using the prompt formula.</p>
      <RevealBox title="Show Solution" accent="#e07b4c">
        <CodeBlock>{"\"Ancient misty redwood forest at dawn, rays of golden\nsunlight streaming through towering trees, watercolor and\nink illustration style, emerald green and warm amber palette,\nmagical ethereal atmosphere, morning dew on fern leaves,\ndepth of field, highly detailed, artstation quality\""}</CodeBlock>
        <p style={{ fontSize: 13, lineHeight: 1.7 }}><strong>Why better:</strong> Specifies forest type (redwood), time (dawn), lighting (golden sunlight rays), style (watercolor/ink), colors (emerald green, amber), mood (magical, ethereal), details (dew, fern leaves), quality keywords. Each detail = more creative control.</p>
      </RevealBox>
    </ArchBlock>

    <ArchBlock number="Activity 2" title="Match the Camera Movement" subtitle="Motion Prompt Practice" color="#4ca0e0">
      <p>For each scene, choose the best camera movement:</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 14 }}>
        {["A. Vast mountain landscape", "B. Dramatic close-up portrait", "C. Tall waterfall in jungle", "D. Detailed 3D sculpture"].map((s, i) => (
          <div key={i} style={{ background: "var(--card-bg)", borderRadius: 10, padding: 14, border: "1px solid var(--border)", fontSize: 13, fontWeight: 600 }}>{s}</div>
        ))}
      </div>
      <RevealBox title="Show Solutions" accent="#4ca0e0">
        <p style={{ fontSize: 13, lineHeight: 1.8 }}><strong>A → Pan Right</strong> — horizontal sweep reveals panoramic width and scale.</p>
        <p style={{ fontSize: 13, lineHeight: 1.8 }}><strong>B → Slow Zoom In</strong> — creates emotional intensity and intimacy.</p>
        <p style={{ fontSize: 13, lineHeight: 1.8 }}><strong>C → Tilt Up</strong> — vertical rotation reveals full height and power.</p>
        <p style={{ fontSize: 13, lineHeight: 1.8 }}><strong>D → Orbit</strong> — circling reveals all angles and 3D dimensionality.</p>
      </RevealBox>
    </ArchBlock>

    <ArchBlock number="Activity 3" title="Calculate Video Frames" subtitle="Video Math Practice" color="#5cb85c">
      <p>Using <strong>Total Frames = Duration × FPS</strong>:</p>
      <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 16, marginBottom: 14, border: "1px solid var(--border)", fontSize: 13, lineHeight: 1.8 }}>
        <p style={{ margin: "0 0 6px" }}><strong>A.</strong> 5-second video at 24fps = ? frames</p>
        <p style={{ margin: "0 0 6px" }}><strong>B.</strong> 180 frames at 30fps = ? seconds</p>
        <p style={{ margin: 0 }}><strong>C.</strong> 12fps vs 24fps — which smoother? 4s at each rate = ? frames?</p>
      </div>
      <RevealBox title="Show Solutions" accent="#5cb85c">
        <CodeBlock>{`A. 5 × 24 = 120 frames (AI generates 120 images)
B. 180 ÷ 30 = 6 seconds (Duration = Frames ÷ FPS)
C. 24fps is smoother (more frames/second)
   12fps: 4 × 12 = 48 frames
   24fps: 4 × 24 = 96 frames (double, but much smoother)`}</CodeBlock>
      </RevealBox>
    </ArchBlock>

    <ArchBlock number="Activity 4" title="Design a Complete Pipeline" subtitle="Full Workflow Practice" color="#9b59b6">
      <InfoCard title="Scenario" color="#9b59b6" items={<span>Create a short looping video of a <strong>Japanese koi pond seen from above</strong> for a meditation app. Calm, peaceful, loops seamlessly.</span>} />
      <RevealBox title="Show Complete Solution" accent="#9b59b6">
        <p style={{ fontSize: 13 }}><strong>Image Prompt:</strong></p>
        <CodeBlock>{"\"Serene koi pond viewed from above, three orange and white\nkoi swimming in crystal water, green lily pads floating,\ntraditional garden stones, watercolor ukiyo-e style, jade\ngreen and coral orange palette, zen atmosphere, highly detailed\""}</CodeBlock>
        <p style={{ fontSize: 13 }}><strong>Tool:</strong> DALL·E 3 via Copilot (free, good composition)</p>
        <p style={{ fontSize: 13 }}><strong>Motion Prompt:</strong></p>
        <CodeBlock>{"\"Koi gliding in gentle circular paths, subtle ripples\nexpanding, lily pads bobbing gently, dappled sunlight\nshifting on water, very slow camera zoom, peaceful motion\""}</CodeBlock>
        <p style={{ fontSize: 13 }}><strong>Video Tool:</strong> Runway Gen-4.5 (best creative control for art-style + subtle motion)</p>
        <CodeBlock>{`Duration: 4s | FPS: 24 (96 frames) | 1080p
Motion intensity: Low-Medium | Guidance: 10`}</CodeBlock>
        <p style={{ fontSize: 13, lineHeight: 1.7 }}><strong>Why it works:</strong> Overhead avoids depth distortion. Water/fish = natural looping. Low motion prevents koi distortion. Watercolor style forgives small artifacts. Circular paths loop naturally.</p>
      </RevealBox>
    </ArchBlock>

    <ArchBlock number="Activity 5" title="Ethics Scenario Analysis" subtitle="Responsible AI Use" color="#e74c3c">
      <InfoCard title="Scenario" color="#e74c3c" items={<span>A student uses Runway Gen-4.5 to mimic a famous living artist's style, submits it to a class competition as "original digital artwork," wins first place, never mentions AI.</span>} />
      <RevealBox title="Show Analysis" accent="#e74c3c">
        <p style={{ fontSize: 13, lineHeight: 1.7 }}><strong>NOT ethical.</strong> Three violations:</p>
        <p style={{ fontSize: 13, lineHeight: 1.7 }}><strong>1. No AI disclosure:</strong> Passed off AI content as hand-made work. Academic honesty requires disclosure.</p>
        <p style={{ fontSize: 13, lineHeight: 1.7 }}><strong>2. Copying living artist:</strong> Deliberately replicating a specific artist's style via AI without credit exploits their creative identity.</p>
        <p style={{ fontSize: 13, lineHeight: 1.7 }}><strong>3. Misrepresentation:</strong> "Original digital artwork" implies personal artistic skill/labor. AI changes the creative process — this matters for fair competition.</p>
        <p style={{ fontSize: 13, lineHeight: 1.7 }}><strong>Correct approach:</strong> Disclose "Created using Runway Gen-4.5." Credit the artist's influence. Describe your own creative decisions. Follow class AI policy.</p>
      </RevealBox>
    </ArchBlock>

    <ArchBlock number="Activity 6" title="Identify the Pipeline Architecture" subtitle="Advanced Concepts Review" color="#2e7d32">
      <p>Name the architecture for each description:</p>
      <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 16, marginBottom: 14, border: "1px solid var(--border)", fontSize: 13, lineHeight: 2 }}>
        <p style={{ margin: "0 0 6px" }}><strong>A.</strong> A filmmaker generates a portrait, feeds it + depth map + text into a video model using pose info to animate frame-by-frame.</p>
        <p style={{ margin: "0 0 6px" }}><strong>B.</strong> An agency writes a story, breaks into 5 shots, generates keyframes with character refs, animates each, stitches with transitions.</p>
        <p style={{ margin: "0 0 6px" }}><strong>C.</strong> A creator types a prompt into a tool that optionally accepts a reference image — same AI handles both text-only and text+image.</p>
        <p style={{ margin: 0 }}><strong>D.</strong> An artist generates a 4s clip, uses last frames as start of next 4s clip, repeats 5× for 20 seconds.</p>
      </div>
      <RevealBox title="Show Solutions" accent="#2e7d32">
        <p style={{ fontSize: 13, lineHeight: 1.8 }}><strong>A → Conditioned/Controlled Video Diffusion (#3).</strong> Depth + pose = structured control conditions steering frame-by-frame generation.</p>
        <p style={{ fontSize: 13, lineHeight: 1.8 }}><strong>B → Multi-Shot & Story-Level (#2).</strong> Story → shots → keyframes → per-shot img2vid → concatenation with transitions.</p>
        <p style={{ fontSize: 13, lineHeight: 1.8 }}><strong>C → Unified Text/Image/Video Conditioning (#6).</strong> Same backend accepts text-only, image-only, or both — three modes of one engine.</p>
        <p style={{ fontSize: 13, lineHeight: 1.8 }}><strong>D → Autoregressive Extensions (#5).</strong> Chaining clips by conditioning on last frames — temporal extension through autoregressive generation.</p>
      </RevealBox>
    </ArchBlock>

    <h3 style={S.h3}>Final Review Quizzes</h3>

    <QuizBox question="What does image-to-video AI fundamentally predict?" options={["New colors for the image", "Next frames of movement over time", "Higher-resolution version", "Which parts to delete"]} correct={1} explanation="The AI predicts next frames — how the scene would look if moving — building a sequence that creates the illusion of motion." />
    <QuizBox question="Which subject creates the best seamless loop?" options={["Person walking across room", "Ocean waves rolling and receding", "Car driving down road", "Someone typing on keyboard"]} correct={1} explanation="Waves have natural cyclical motion — roll in and pull back continuously. Walking, driving, typing have start/stop points that break loops." />
    <QuizBox question="In Emu-style factorized pipeline, what is the correct sequence?" options={["Video → Image → Text", "Text → Video → Image", "Text → Image → (Text + Image) → Video", "Image → Text → Video → Image"]} correct={2} explanation="First generate image from text (T2I), then use text AND image together for video: text → image, then (text, image) → video." />
    <QuizBox question="Portrait video shows severe face distortion. First fix?" options={["Increase resolution to 4K", "Reduce motion intensity to Low", "Add more prompt detail", "Switch art style"]} correct={1} explanation="Face distortion = too much motion intensity. Faces have subtle features AI struggles to animate at high motion. Low/Subtle intensity is the #1 fix." />
  </div>
);

/* ───── Main App ─────────────────────────────────────────────────── */
const SEC_MAP = { 0: Sec0, 1: Sec1, 2: Sec2, 3: Sec3, 4: Sec4, 5: Sec5, 6: Sec6, 7: Sec7, 8: Sec8, 9: Sec9, 10: Sec10 };

export default function App() {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [sideOpen, setSideOpen] = useState(false);

  const goTo = useCallback((id) => {
    setActive(id);
    setVisited(p => new Set([...p, id]));
    setSideOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const Content = SEC_MAP[active] || Sec0;
  const progress = Math.round((visited.size / SECTIONS.length) * 100);

  return (
    <div style={{
      "--font-heading": "'Bitter', Georgia, serif",
      "--font-body": "'Source Serif 4', 'Crimson Pro', serif",
      "--font-mono": "'Fira Code', 'JetBrains Mono', monospace",
      "--bg": "#faf6f0", "--text": "#2c1810", "--accent": "#c46d3b",
      "--highlight": "#8b6d47", "--card-bg": "#f5ede3", "--border": "#e0d5c7", "--muted": "#8b7d6b",
      fontFamily: "var(--font-body)", color: "var(--text)", background: "var(--bg)",
      minHeight: "100vh", fontSize: 14, lineHeight: 1.6,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bitter:wght@400;600;700;800&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Fira+Code:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2c1810 0%, #4a2c1a 40%, #6b3d2e 100%)", padding: "36px 24px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: .06, backgroundImage: "radial-gradient(circle at 20% 80%, #c46d3b 1px, transparent 1px), radial-gradient(circle at 80% 20%, #c46d3b 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ fontSize: 11, color: "#c46d3b", fontFamily: "var(--font-mono)", fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>ART 101 — AI CREATIVE TOOLS</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 800, color: "#faf6f0", margin: "0 0 10px", lineHeight: 1.15 }}>The AI Image‑to‑Video Pipeline</h1>
          <p style={{ color: "#d4c4b0", fontSize: 14, margin: 0, maxWidth: 600, lineHeight: 1.6 }}>From text prompt to animated artwork — a complete guide to AI video generation for artists and designers.</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: "#e8ddd0", height: 4 }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg, #c46d3b, #e0a06b)", width: `${progress}%`, transition: "width .4s" }} />
      </div>

      {/* Mobile toggle */}
      <button onClick={() => setSideOpen(!sideOpen)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000, width: 52, height: 52, borderRadius: "50%", background: "#c46d3b", color: "#fff", border: "none", cursor: "pointer", fontSize: 20, boxShadow: "0 4px 16px rgba(196,109,59,.4)", display: "none" }}>☰</button>

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", position: "relative" }}>
        {/* Sidebar */}
        <nav style={{ width: 260, minWidth: 260, padding: "24px 16px", position: "sticky", top: 0, height: "100vh", overflowY: "auto", borderRight: "1px solid var(--border)", background: "var(--bg)" }}>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: 6, fontWeight: 600 }}>PROGRESS: {progress}%</div>
          <div style={{ height: 3, background: "var(--border)", borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--accent)", width: `${progress}%`, borderRadius: 2, transition: "width .4s" }} />
          </div>
          {SECTIONS.map(sec => (
            <button key={sec.id} onClick={() => goTo(sec.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", marginBottom: 3, borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left",
              background: active === sec.id ? "var(--accent)" : "transparent", color: active === sec.id ? "#fff" : "var(--text)",
              fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 600, opacity: visited.has(sec.id) ? 1 : .6, transition: "all .2s",
            }}>
              <span style={{ fontSize: 16, width: 24, textAlign: "center", flexShrink: 0 }}>{sec.icon}</span>
              <span style={{ lineHeight: 1.3 }}>{sec.title}</span>
              {visited.has(sec.id) && active !== sec.id && <span style={{ marginLeft: "auto", fontSize: 10, color: "#5cb85c" }}>✓</span>}
            </button>
          ))}
        </nav>

        {/* Main */}
        <main style={{ flex: 1, padding: "32px 36px 60px", maxWidth: 760, minWidth: 0 }}>
          <Content />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <button onClick={() => active > 0 && goTo(active - 1)} disabled={active === 0} style={{
              padding: "10px 20px", borderRadius: 8, border: "1px solid var(--border)", background: active === 0 ? "transparent" : "var(--card-bg)",
              cursor: active === 0 ? "default" : "pointer", opacity: active === 0 ? .3 : 1, fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 600, color: "var(--text)", transition: "all .2s",
            }}>← Previous</button>
            <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)", alignSelf: "center" }}>{active + 1} / {SECTIONS.length}</span>
            <button onClick={() => active < SECTIONS.length - 1 && goTo(active + 1)} disabled={active === SECTIONS.length - 1} style={{
              padding: "10px 20px", borderRadius: 8, border: "none",
              background: active === SECTIONS.length - 1 ? "var(--card-bg)" : "var(--accent)", color: active === SECTIONS.length - 1 ? "var(--muted)" : "#fff",
              cursor: active === SECTIONS.length - 1 ? "default" : "pointer", opacity: active === SECTIONS.length - 1 ? .5 : 1,
              fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 600, transition: "all .2s",
            }}>Next →</button>
          </div>
        </main>
      </div>
    </div>
  );
}
