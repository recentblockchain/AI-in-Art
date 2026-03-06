import { useState, useEffect, useRef, useCallback } from "react";

// ─── Utility Components ───
const RevealBox = ({ title, children, icon = "💡" }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: "1px solid #d4c4a8",
      borderRadius: 10,
      marginBottom: 14,
      overflow: "hidden",
      background: open ? "#fdf8f0" : "#faf5ec",
      transition: "all 0.3s ease"
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "14px 18px", border: "none",
        background: "transparent", cursor: "pointer", display: "flex",
        alignItems: "center", gap: 10, fontSize: 15, fontFamily: "'Crimson Pro', Georgia, serif",
        color: "#3d2b1f", fontWeight: 600, textAlign: "left"
      }}>
        <span>{icon}</span>
        <span style={{ flex: 1 }}>{title}</span>
        <span style={{
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease", fontSize: 12
        }}>▼</span>
      </button>
      {open && <div style={{ padding: "4px 18px 16px", lineHeight: 1.7, fontSize: 15 }}>{children}</div>}
    </div>
  );
};

const QuizBox = ({ question, options, correct, explanation }) => {
  const [selected, setSelected] = useState(null);
  const isCorrect = selected === correct;
  return (
    <div style={{
      background: "#f5efe5", border: "1px solid #d4c4a8", borderRadius: 10,
      padding: 18, marginBottom: 14
    }}>
      <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 15, color: "#3d2b1f" }}>🧠 {question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding: "10px 14px", border: selected === i ? (isCorrect ? "2px solid #5a8f5a" : "2px solid #c0392b") : "1px solid #c9b896",
            borderRadius: 8, background: selected === i ? (isCorrect ? "#e8f5e8" : "#fde8e8") : "#fff",
            cursor: "pointer", textAlign: "left", fontSize: 14, fontFamily: "'Crimson Pro', Georgia, serif",
            color: "#3d2b1f", transition: "all 0.2s ease"
          }}>{opt}</button>
        ))}
      </div>
      {selected !== null && (
        <div style={{
          marginTop: 12, padding: 12, borderRadius: 8,
          background: isCorrect ? "#e8f5e8" : "#fde8e8",
          border: `1px solid ${isCorrect ? "#5a8f5a" : "#c0392b"}`,
          fontSize: 14
        }}>
          {isCorrect ? "✅ " : "❌ "}{explanation}
        </div>
      )}
    </div>
  );
};

const CodeBlock = ({ children }) => (
  <div style={{
    background: "#1a1a2e", color: "#f0c27a", padding: "14px 18px",
    borderRadius: 8, fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 13, lineHeight: 1.6, overflowX: "auto", margin: "10px 0",
    border: "1px solid #2a2a4e"
  }}>
    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{children}</pre>
  </div>
);

const InfoCard = ({ title, icon, color, children }) => (
  <div style={{
    background: "#fff", border: `2px solid ${color}`, borderRadius: 12,
    padding: 18, marginBottom: 14,
    borderTop: `4px solid ${color}`
  }}>
    <div style={{ fontSize: 15, fontWeight: 700, color, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 20 }}>{icon}</span> {title}
    </div>
    <div style={{ fontSize: 14, lineHeight: 1.7 }}>{children}</div>
  </div>
);

const ToolCard = ({ name, tagline, strengths, bestFor, color }) => (
  <div style={{
    background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e0d5c4",
    borderLeft: `4px solid ${color}`, minWidth: 220, flex: "1 1 220px"
  }}>
    <div style={{ fontWeight: 700, fontSize: 15, color, marginBottom: 4 }}>{name}</div>
    <div style={{ fontSize: 12, color: "#8a7a6a", marginBottom: 8, fontStyle: "italic" }}>{tagline}</div>
    <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>
      <strong>Strengths:</strong> {strengths}
    </div>
    <div style={{
      fontSize: 12, background: `${color}15`, color, padding: "4px 10px",
      borderRadius: 20, display: "inline-block", fontWeight: 600
    }}>Best for: {bestFor}</div>
  </div>
);

// ─── Denoising Visualization ───
const DenoisingViz = () => {
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Pure Noise (t=50)", noise: 1.0, desc: "Random TV static — no image yet" },
    { label: "Rough Shapes (t=37)", noise: 0.75, desc: "AI starts finding large blobs of color" },
    { label: "Emerging Form (t=25)", noise: 0.5, desc: "Subject outline becomes visible" },
    { label: "Clear Image (t=12)", noise: 0.25, desc: "Fine details and textures appear" },
    { label: "Final Result (t=0)", noise: 0.0, desc: "Clean, finished AI image" }
  ];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const noiseLevel = steps[step].noise;

    // Draw a simple gradient "image" underneath
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const baseR = 120 + Math.sin(x * 0.03) * 60 + Math.cos(y * 0.02) * 40;
        const baseG = 160 + Math.cos(x * 0.025 + y * 0.015) * 50;
        const baseB = 200 + Math.sin(y * 0.035) * 40;
        // Radial "subject" shape
        const cx = w * 0.5, cy = h * 0.45;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const subjectMask = Math.max(0, 1 - dist / (w * 0.3));
        const sR = baseR * (1 - subjectMask) + (220 + Math.sin(x * 0.05) * 30) * subjectMask;
        const sG = baseG * (1 - subjectMask) + (180 + Math.cos(y * 0.04) * 20) * subjectMask;
        const sB = baseB * (1 - subjectMask) + (140) * subjectMask;
        // Add noise
        const noiseR = (Math.random() - 0.5) * 255 * noiseLevel;
        const noiseG = (Math.random() - 0.5) * 255 * noiseLevel;
        const noiseB = (Math.random() - 0.5) * 255 * noiseLevel;
        const r = Math.max(0, Math.min(255, sR + noiseR));
        const g = Math.max(0, Math.min(255, sG + noiseG));
        const b = Math.max(0, Math.min(255, sB + noiseB));
        ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [step]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  return (
    <div style={{ textAlign: "center", margin: "16px 0" }}>
      <canvas ref={canvasRef} width={280} height={200} style={{
        borderRadius: 10, border: "2px solid #d4c4a8", display: "block",
        margin: "0 auto 12px", maxWidth: "100%"
      }} />
      <div style={{ fontSize: 16, fontWeight: 700, color: "#3d2b1f", marginBottom: 4 }}>
        {steps[step].label}
      </div>
      <div style={{ fontSize: 13, color: "#7a6a5a", marginBottom: 12 }}>{steps[step].desc}</div>
      <input type="range" min={0} max={4} value={step} onChange={e => setStep(+e.target.value)}
        style={{ width: "80%", maxWidth: 300, accentColor: "#b08d57" }} />
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 300, margin: "4px auto 0", fontSize: 11, color: "#999" }}>
        <span>Noisy</span><span>Clean</span>
      </div>
    </div>
  );
};

// ─── Pipeline Flowchart ───
const PipelineFlowchart = () => {
  const steps = [
    { icon: "✏️", label: "Write Text Prompt", detail: "Subject + style + lighting + mood", color: "#e74c3c" },
    { icon: "🎨", label: "AI Generates Image", detail: "Diffusion denoising (25-50 steps)", color: "#e67e22" },
    { icon: "🔍", label: "Review & Refine", detail: "Check quality & composition", color: "#f1c40f" },
    { icon: "📤", label: "Upload to Video Tool", detail: "Runway, Pika, Kling, Luma", color: "#2ecc71" },
    { icon: "🎬", label: "Add Motion Prompt", detail: "Camera + subject animation", color: "#3498db" },
    { icon: "⚙️", label: "Set Parameters", detail: "Duration, FPS, resolution", color: "#9b59b6" },
    { icon: "🎥", label: "Generate & Export", detail: "MP4 / GIF output", color: "#e91e63" }
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, margin: "16px 0" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            background: "#fff", border: `2px solid ${s.color}`, borderRadius: 12,
            padding: "12px 16px", textAlign: "center", minWidth: 110, maxWidth: 140,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#8a7a6a", marginTop: 2 }}>{s.detail}</div>
          </div>
          {i < steps.length - 1 && <span style={{ fontSize: 20, color: "#c9b896" }}>→</span>}
        </div>
      ))}
    </div>
  );
};

// ─── Factorized Pipeline Diagram ───
const FactorizedPipelineDiagram = () => {
  const stages = [
    { icon: "📝", label: "Text Prompt", sub: '"A serene lake at dawn"', color: "#e74c3c", bg: "#fde8e8" },
    { icon: "🎨", label: "Stage 1: T2I", sub: "Text → Keyframe Image", color: "#e67e22", bg: "#fef3e2" },
    { icon: "🔄", label: "Edit / Regenerate", sub: "Refine the keyframe", color: "#27ae60", bg: "#e8f5e8" },
    { icon: "🎬", label: "Stage 2: I2V", sub: "(Text + Image) → Video", color: "#3498db", bg: "#e8f0fe" },
    { icon: "📹", label: "Final Video", sub: "Animated clip output", color: "#9b59b6", bg: "#f3e8fd" }
  ];
  return (
    <div style={{
      background: "#fdf8f0", border: "2px solid #d4c4a8", borderRadius: 14,
      padding: 20, margin: "16px 0"
    }}>
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15, color: "#3d2b1f", marginBottom: 16 }}>
        Factorized Pipeline: text → image → (text + image) → video
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 6 }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              background: s.bg, border: `2px solid ${s.color}`, borderRadius: 12,
              padding: "10px 14px", textAlign: "center", minWidth: 110
            }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "#7a6a5a", marginTop: 2 }}>{s.sub}</div>
            </div>
            {i < stages.length - 1 && <span style={{ fontSize: 18, color: "#c9b896", fontWeight: 700 }}>→</span>}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#8a7a6a", fontStyle: "italic" }}>
        Emu Video pattern: Reuse strong T2I models + wrap with video module
      </div>
    </div>
  );
};

// ─── Multi-Shot Story Diagram ───
const MultiShotDiagram = () => {
  const shots = [
    { num: 1, desc: "Character enters garden", icon: "🚶" },
    { num: 2, desc: "Discovers glowing flower", icon: "🌸" },
    { num: 3, desc: "Picks up the flower", icon: "✋" },
    { num: 4, desc: "Garden transforms", icon: "✨" }
  ];
  return (
    <div style={{
      background: "#f0f4ff", border: "2px solid #7aa2d4", borderRadius: 14,
      padding: 20, margin: "16px 0"
    }}>
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15, color: "#2c5282", marginBottom: 14 }}>
        Multi-Shot Story Pipeline
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
        {shots.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              background: "#fff", border: "2px solid #7aa2d4", borderRadius: 12,
              padding: 12, textAlign: "center", width: 120
            }}>
              <div style={{ fontSize: 10, color: "#5a7fb5", fontWeight: 700 }}>SHOT {s.num}</div>
              <div style={{ fontSize: 24, margin: "4px 0" }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: "#4a5568" }}>{s.desc}</div>
              <div style={{
                fontSize: 9, background: "#e8f0fe", borderRadius: 4,
                padding: "2px 6px", marginTop: 6, color: "#5a7fb5"
              }}>Keyframe → I2V</div>
            </div>
            {i < shots.length - 1 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#7aa2d4", fontWeight: 600 }}>transition</div>
                <span style={{ fontSize: 18, color: "#7aa2d4" }}>→</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{
        textAlign: "center", marginTop: 14, fontSize: 12, color: "#5a7fb5",
        background: "#e8f0fe", borderRadius: 8, padding: 8
      }}>
        Each shot: Reference Image → Consistent Character → I2V Animation → Concatenate with transitions
      </div>
    </div>
  );
};

// ─── Controlled Diffusion Architecture ───
const ControlledDiffusionDiagram = () => (
  <div style={{
    background: "#f5f0ff", border: "2px solid #9b7fc4", borderRadius: 14,
    padding: 20, margin: "16px 0"
  }}>
    <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15, color: "#6b46c1", marginBottom: 16 }}>
      Controlled Video Diffusion Architecture
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, alignItems: "start" }}>
      {/* Input signals */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#6b46c1", marginBottom: 8 }}>INPUT SIGNALS</div>
        {[
          { icon: "📝", label: "Text Prompt", sub: "Scene semantics" },
          { icon: "🖼️", label: "Reference Image", sub: "Identity / appearance" },
          { icon: "🦴", label: "Pose / Depth", sub: "Structure control" },
          { icon: "↗️", label: "Motion Paths", sub: "Trajectory specification" }
        ].map((item, i) => (
          <div key={i} style={{
            background: "#fff", border: "1px solid #c4b5dc", borderRadius: 8,
            padding: "6px 12px", marginBottom: 6, fontSize: 12
          }}>
            {item.icon} <strong>{item.label}</strong>
            <div style={{ fontSize: 10, color: "#8a7a9a" }}>{item.sub}</div>
          </div>
        ))}
      </div>
      {/* Arrow */}
      <div style={{ display: "flex", alignItems: "center", fontSize: 28, color: "#9b7fc4" }}>→</div>
      {/* Core engine */}
      <div style={{
        background: "#fff", border: "3px solid #6b46c1", borderRadius: 14,
        padding: 16, textAlign: "center", minWidth: 180
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#6b46c1" }}>VIDEO DIFFUSION ENGINE</div>
        <div style={{
          margin: "10px 0", padding: 8, background: "#f5f0ff", borderRadius: 8
        }}>
          <div style={{ fontSize: 11, fontWeight: 600 }}>UNet Base Branch</div>
          <div style={{ fontSize: 10, color: "#8a7a9a" }}>Core denoising backbone</div>
        </div>
        <div style={{ fontSize: 11, color: "#9b7fc4" }}>+</div>
        <div style={{
          padding: 8, background: "#f0f5ff", borderRadius: 8
        }}>
          <div style={{ fontSize: 11, fontWeight: 600 }}>3D Control Branch</div>
          <div style={{ fontSize: 10, color: "#8a7a9a" }}>Temporal consistency</div>
        </div>
        <div style={{ fontSize: 11, color: "#9b7fc4", marginTop: 6 }}>+</div>
        <div style={{
          padding: 8, background: "#f0fff5", borderRadius: 8, marginTop: 4
        }}>
          <div style={{ fontSize: 11, fontWeight: 600 }}>Motion Module</div>
          <div style={{ fontSize: 10, color: "#8a7a9a" }}>AnimateDiff-style adapter</div>
        </div>
      </div>
      {/* Arrow */}
      <div style={{ display: "flex", alignItems: "center", fontSize: 28, color: "#9b7fc4" }}>→</div>
      {/* Output */}
      <div style={{
        background: "#fff", border: "2px solid #27ae60", borderRadius: 14,
        padding: 16, textAlign: "center"
      }}>
        <div style={{ fontSize: 28 }}>🎥</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#27ae60" }}>Controlled Video</div>
        <div style={{ fontSize: 11, color: "#7a9a7a", marginTop: 4 }}>
          Frame-by-frame<br />structured generation
        </div>
      </div>
    </div>
    <div style={{
      textAlign: "center", marginTop: 14, fontSize: 12, color: "#6b46c1",
      fontStyle: "italic"
    }}>
      Images become structured conditions (ID, layout, pose, depth) steering the text-driven generator
    </div>
  </div>
);

// ─── Unified Tri-Modal Diagram ───
const UnifiedTriModalDiagram = () => (
  <div style={{
    background: "#f0faf5", border: "2px solid #38a169", borderRadius: 14,
    padding: 20, margin: "16px 0"
  }}>
    <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15, color: "#276749", marginBottom: 16 }}>
      Unified Text / Image / Video System
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 14 }}>
      {[
        { mode: "Text Only", icon: "📝", desc: "T2V: text → video", color: "#e74c3c" },
        { mode: "Image Only", icon: "🖼️", desc: "I2V: image → video", color: "#3498db" },
        { mode: "Text + Image", icon: "📝🖼️", desc: "Mixed: both → video", color: "#9b59b6" }
      ].map((m, i) => (
        <div key={i} style={{
          background: "#fff", border: `2px solid ${m.color}`, borderRadius: 12,
          padding: 14, textAlign: "center", flex: "1 1 140px", maxWidth: 180
        }}>
          <div style={{ fontSize: 22 }}>{m.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: m.color, marginTop: 4 }}>{m.mode}</div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{m.desc}</div>
        </div>
      ))}
    </div>
    <div style={{
      textAlign: "center", fontSize: 20, color: "#38a169", margin: "4px 0"
    }}>↓ ↓ ↓</div>
    <div style={{
      background: "#fff", border: "3px solid #38a169", borderRadius: 14,
      padding: 14, textAlign: "center", maxWidth: 300, margin: "0 auto"
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#276749" }}>🎬 SINGLE UNIFIED BACKEND</div>
      <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
        Same architecture handles all three modes — I2V is an operating mode, not a separate system
      </div>
    </div>
  </div>
);

// ─── Main Lecture Component ───
const SECTIONS = [
  "Welcome", "Text-to-Image", "Denoising Math", "Prompt Engineering",
  "Image-to-Video", "Motion & Camera", "Advanced Extensions", "2026 AI Tools",
  "Full Pipeline", "Hands-on Lab", "Ethics & Best Practices", "Class Activities"
];

export default function ImageToVideoLecture() {
  const [section, setSection] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [timer, setTimer] = useState(90 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRunning && timer > 0) {
      timerRef.current = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timer]);

  const goTo = (i) => {
    setSection(i);
    setVisited(prev => new Set([...prev, i]));
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const progress = Math.round((visited.size / SECTIONS.length) * 100);

  const bodyStyle = {
    fontFamily: "'Crimson Pro', Georgia, serif",
    fontSize: 15,
    lineHeight: 1.75,
    color: "#3d2b1f"
  };

  const h2Style = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 24, fontWeight: 800, color: "#3d2b1f",
    marginBottom: 16, borderBottom: "2px solid #d4c4a8", paddingBottom: 8
  };

  const h3Style = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 18, fontWeight: 700, color: "#5a4030", marginTop: 20, marginBottom: 10
  };

  // ── Section Renderers ──
  const renderSection = () => {
    switch (section) {
      case 0: return renderWelcome();
      case 1: return renderTextToImage();
      case 2: return renderDenoisingMath();
      case 3: return renderPromptEngineering();
      case 4: return renderImageToVideo();
      case 5: return renderMotionCamera();
      case 6: return renderAdvancedExtensions();
      case 7: return renderToolsComparison();
      case 8: return renderFullPipeline();
      case 9: return renderHandsOnLab();
      case 10: return renderEthics();
      case 11: return renderActivities();
      default: return null;
    }
  };

  // ── 0: Welcome ──
  const renderWelcome = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>🎬 Image-to-Video AI Pipeline</h2>
      <InfoCard title="What You'll Learn Today" icon="🎯" color="#e67e22">
        <p>How to go from a <strong>text idea</strong> → <strong>AI-generated image</strong> → <strong>animated video loop</strong> using free tools — no coding required!</p>
      </InfoCard>

      <h3 style={h3Style}>Lecture Roadmap (90 minutes)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, margin: "12px 0" }}>
        {[
          { time: "25 min", title: "Part 1: Text → Image", desc: "Diffusion models, denoising, prompts", icon: "🎨" },
          { time: "20 min", title: "Part 2: Image → Video", desc: "Frame prediction, motion, cameras", icon: "🎬" },
          { time: "15 min", title: "Advanced & Tools", desc: "Extensions, 2026 AI tool landscape", icon: "🔬" },
          { time: "10 min", title: "Full Pipeline", desc: "Step-by-step flowchart", icon: "🗺️" },
          { time: "25 min", title: "Hands-on Lab", desc: "Create your own video!", icon: "🧪" },
          { time: "10 min", title: "Ethics & Activities", desc: "Responsible use + exercises", icon: "⚖️" }
        ].map((m, i) => (
          <div key={i} style={{
            background: "#fff", border: "1px solid #e0d5c4", borderRadius: 10,
            padding: 14, textAlign: "center"
          }}>
            <div style={{ fontSize: 24 }}>{m.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#5a4030", marginTop: 4 }}>{m.title}</div>
            <div style={{ fontSize: 12, color: "#8a7a6a" }}>{m.desc}</div>
            <div style={{
              fontSize: 11, background: "#f0e8d8", borderRadius: 20, padding: "2px 10px",
              display: "inline-block", marginTop: 6, fontWeight: 600, color: "#b08d57"
            }}>{m.time}</div>
          </div>
        ))}
      </div>

      <InfoCard title="Prerequisites" icon="📋" color="#27ae60">
        <p>No coding skills needed! You just need a web browser and curiosity. All tools we'll use today are free or have free tiers.</p>
      </InfoCard>

      <InfoCard title="The Big Picture" icon="💡" color="#3498db">
        <p>Modern AI video generation uses a <strong>factorized pipeline</strong> — instead of one giant model doing everything, the process splits into clean stages:</p>
        <p style={{ textAlign: "center", fontSize: 16, fontWeight: 700, color: "#3498db", margin: "10px 0" }}>
          Text → Image → (Text + Image) → Video
        </p>
        <p>This is called the <strong>Emu-style factorization</strong>. It gives you control at every stage — you can regenerate the image without changing your text, or try different motion styles on the same image.</p>
      </InfoCard>
    </div>
  );

  // ── 1: Text-to-Image ──
  const renderTextToImage = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>🎨 Part 1: Text-to-Image Fundamentals</h2>

      <h3 style={h3Style}>What Are Diffusion Models?</h3>
      <p>Imagine a sculptor starting with a block of marble. They chip away material step by step until a beautiful statue emerges. <strong>AI diffusion models work the same way</strong> — but instead of marble, they start with random noise (like TV static), and instead of a chisel, your text prompt guides the removal process.</p>

      <InfoCard title="The Core Idea" icon="💡" color="#e67e22">
        <p><strong>Forward process:</strong> Take a real image and gradually add noise until it becomes pure static.</p>
        <p><strong>Reverse process:</strong> Start from pure static and gradually remove noise, guided by your text prompt, until a clean image emerges.</p>
        <p>The AI learns the reverse process by studying millions of images. It learns: "Given this noisy mess and the text 'sunset over ocean,' what should the slightly-less-noisy version look like?"</p>
      </InfoCard>

      <h3 style={h3Style}>The Denoising Process</h3>
      <p>Drag the slider below to see how AI removes noise step by step:</p>
      <DenoisingViz />

      <h3 style={h3Style}>Popular 2026 AI Image Models</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "12px 0" }}>
        <ToolCard name="FLUX" tagline="By Black Forest Labs" strengths="Photorealism, accurate text rendering in images, consistent faces" bestFor="Photorealistic images" color="#e74c3c" />
        <ToolCard name="DALL·E 3" tagline="By OpenAI (via Copilot)" strengths="Excellent prompt understanding, creative compositions, free via Bing/Copilot" bestFor="Beginners, creative concepts" color="#3498db" />
        <ToolCard name="Stable Diffusion 3" tagline="By Stability AI (Open Source)" strengths="Fully customizable, fine-tunable, runs locally, huge community" bestFor="Custom workflows, artists wanting control" color="#27ae60" />
      </div>

      <RevealBox title="How CLIP Connects Text to Images" icon="🔗">
        <p><strong>CLIP</strong> (Contrastive Language-Image Pre-training) is the "translator" between words and pictures. It was trained on billions of image-text pairs from the internet, learning that certain words correspond to certain visual features.</p>
        <p>During image generation, CLIP converts your text prompt into a mathematical "direction" that guides each denoising step. Think of it as a GPS that tells the AI: "Turn this noise more toward 'sunset' and less toward 'anything else'."</p>
      </RevealBox>

      <QuizBox
        question="What does a diffusion model start with when creating an image?"
        options={["A blank white canvas", "Random noise (TV static)", "A low-resolution photo", "An outline sketch"]}
        correct={1}
        explanation="Diffusion models start from pure random noise and progressively remove it, guided by the text prompt, until a clean image emerges."
      />
    </div>
  );

  // ── 2: Denoising Math ──
  const renderDenoisingMath = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>🔢 Denoising Mathematics (Simplified)</h2>

      <InfoCard title="The Core Formula" icon="📐" color="#9b59b6">
        <p style={{ textAlign: "center", fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", margin: "10px 0" }}>
          Cleaner Image = Current Noisy Image − Predicted Noise
        </p>
        <p style={{ textAlign: "center", fontSize: 16, fontFamily: "'JetBrains Mono', monospace", color: "#9b59b6" }}>
          x<sub>t−1</sub> = x<sub>t</sub> − ε<sub>θ</sub>(x<sub>t</sub>, t)
        </p>
      </InfoCard>

      <h3 style={h3Style}>🍳 Kitchen Analogy</h3>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12, margin: "12px 0"
      }}>
        {[
          { sym: "x_t", label: "Muddy Window", desc: "Current noisy image — you can barely see through it", icon: "🪟" },
          { sym: "ε_θ", label: "Smart Squeegee", desc: "AI's trained noise predictor — it knows what's dirt vs. real image", icon: "🧽" },
          { sym: "x_{t-1}", label: "Clearer View", desc: "Result after one cleaning pass — a bit better!", icon: "✨" }
        ].map((item, i) => (
          <div key={i} style={{
            background: "#fff", border: "1px solid #d4c4a8", borderRadius: 10,
            padding: 14, textAlign: "center"
          }}>
            <div style={{ fontSize: 28 }}>{item.icon}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#9b59b6", marginTop: 4 }}>{item.sym}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: "#8a7a6a", marginTop: 4 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={h3Style}>Worked Example: 5-Step Denoising</h3>
      <p>Imagine noise level goes from 100 (pure chaos) to 0 (clean image):</p>
      <div style={{
        background: "#1a1a2e", borderRadius: 10, padding: 16, margin: "12px 0",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#f0c27a", lineHeight: 1.8
      }}>
        <div>Step 1: Noise 100 → 80 &nbsp; <span style={{color:"#888"}}>// AI sees: "There might be shapes here"</span></div>
        <div>Step 2: Noise 80 → 55 &nbsp;&nbsp; <span style={{color:"#888"}}>// AI sees: "I think that's a landscape"</span></div>
        <div>Step 3: Noise 55 → 30 &nbsp;&nbsp; <span style={{color:"#888"}}>// AI sees: "There's a lake and mountains"</span></div>
        <div>Step 4: Noise 30 → 10 &nbsp;&nbsp; <span style={{color:"#888"}}>// AI sees: "Adding sunset reflections"</span></div>
        <div>Step 5: Noise 10 → 0 &nbsp;&nbsp;&nbsp; <span style={{color:"#888"}}>// AI sees: "Polishing final details"</span></div>
      </div>

      <RevealBox title="What the θ (theta) Means" icon="🔬">
        <p>The symbol θ represents the AI model's <strong>learned parameters</strong> — essentially all the knowledge the model gained from studying millions of images during training. When we write ε<sub>θ</sub>, we mean "the noise prediction function that uses the model's trained knowledge."</p>
        <p>Real models like Stable Diffusion have billions of these parameters — numbers fine-tuned during training so the model can accurately predict what's noise and what's real image at each step.</p>
      </RevealBox>

      <h3 style={h3Style}>How Text Guides Each Step</h3>
      <InfoCard title="CLIP Guidance at Every Step" icon="🧭" color="#3498db">
        <p>At each denoising step, CLIP compares the partially-cleaned image against your text prompt and calculates: "How well does this match 'serene lake at sunset'?"</p>
        <p>If the match is low, it pushes the denoising in a direction that better matches the text. This happens at <strong>every single step</strong>, gradually steering the random noise toward your desired image.</p>
        <p>The <strong>guidance scale</strong> (CFG) controls how strongly text guides each step. Higher values = more literal interpretation of your prompt but can look artificial. Lower values = more creative freedom but might drift from your prompt.</p>
      </InfoCard>

      <QuizBox
        question="In the formula x_{t-1} = x_t − ε_θ(x_t, t), what does ε_θ predict?"
        options={["The final clean image", "The noise to remove at this step", "The text prompt embedding", "The image resolution"]}
        correct={1}
        explanation="ε_θ is the noise predictor — it estimates what part of the current noisy image is noise so it can be subtracted, leaving a slightly cleaner result."
      />
    </div>
  );

  // ── 3: Prompt Engineering ──
  const renderPromptEngineering = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>✍️ Prompt Engineering for Art</h2>

      <InfoCard title="The Prompt Formula" icon="📝" color="#e67e22">
        <p style={{ fontSize: 14, fontWeight: 700, textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>
          [Subject] + [Art Style] + [Lighting] + [Colors] + [Mood] + [Details] + [Quality]
        </p>
      </InfoCard>

      <h3 style={h3Style}>Three Levels of Prompts</h3>

      <div style={{ margin: "12px 0" }}>
        <div style={{ background: "#e8f5e8", border: "2px solid #5a8f5a", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: "#5a8f5a", marginBottom: 6 }}>🟢 Beginner</div>
          <CodeBlock>A cat sitting on a windowsill at sunset</CodeBlock>
          <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0" }}>Simple but vague — AI has to guess art style, mood, and details.</p>
        </div>

        <div style={{ background: "#fef3e2", border: "2px solid #e67e22", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: "#e67e22", marginBottom: 6 }}>🟡 Intermediate</div>
          <CodeBlock>A fluffy orange tabby cat sitting on a rustic wooden windowsill, warm golden sunset light streaming in, watercolor painting style, soft warm amber and cream color palette, cozy peaceful atmosphere</CodeBlock>
          <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0" }}>Adds style, specific colors, mood, and lighting direction.</p>
        </div>

        <div style={{ background: "#f3e8fd", border: "2px solid #9b59b6", borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 700, color: "#9b59b6", marginBottom: 6 }}>🟣 Advanced</div>
          <CodeBlock>A fluffy orange tabby cat sitting on an aged wooden windowsill in a cottage, warm golden hour sunlight casting long shadows, dust motes floating in light beams, watercolor and ink illustration in the style of Studio Ghibli backgrounds, soft amber and cream palette with touches of sage green from window plants, serene contemplative atmosphere, highly detailed fur texture, depth of field, artstation quality</CodeBlock>
          <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0" }}>Maximum control — specific art references, textures, atmospheric details, and quality keywords.</p>
        </div>
      </div>

      <h3 style={h3Style}>Style Keywords Cheat Sheet</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, margin: "12px 0" }}>
        {[
          { cat: "Art Styles", keywords: "watercolor, oil painting, anime, digital art, pencil sketch, art nouveau, pixel art, ukiyo-e, impressionist", color: "#e74c3c" },
          { cat: "Lighting", keywords: "golden hour, neon glow, moonlit, dramatic rim lighting, volumetric light, soft diffused, chiaroscuro, backlit", color: "#e67e22" },
          { cat: "Mood", keywords: "peaceful, dramatic, mysterious, ethereal, melancholic, vibrant, whimsical, dark fantasy, dreamlike", color: "#3498db" },
          { cat: "Quality", keywords: "highly detailed, 4K, artstation, trending, masterpiece, professional, photorealistic, cinematic composition", color: "#27ae60" }
        ].map((c, i) => (
          <div key={i} style={{
            background: "#fff", border: `1px solid ${c.color}40`, borderRadius: 10,
            padding: 14, borderTop: `3px solid ${c.color}`
          }}>
            <div style={{ fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.cat}</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{c.keywords}</div>
          </div>
        ))}
      </div>

      <h3 style={h3Style}>Negative Prompts</h3>
      <InfoCard title="Tell the AI What NOT to Generate" icon="🚫" color="#c0392b">
        <CodeBlock>Negative: blurry, low quality, distorted, extra fingers, watermark, text, deformed, ugly, oversaturated, cropped</CodeBlock>
        <p>Negative prompts push the AI away from common artifacts. Always include them for better results!</p>
      </InfoCard>

      <RevealBox title="Pro Tip: Designing Prompts for Video Loops" icon="🔄">
        <p>When you know your image will become a video, design for <strong>natural repeating motion</strong>:</p>
        <p><strong>Good subjects for looping:</strong> water (waves, rivers, rain), wind (grass, hair, flags), fire (campfire, candles), clouds, floating particles, breathing/subtle body movement.</p>
        <p><strong>Avoid:</strong> Static subjects with no natural motion (buildings alone, still objects), complex scenes with too many moving parts.</p>
        <CodeBlock>Example: Tranquil mountain lake at golden hour, gentle ripples on water surface, tall grass swaying on shoreline, soft clouds drifting, watercolor style, warm amber and teal palette, peaceful meditative atmosphere, highly detailed</CodeBlock>
      </RevealBox>

      <QuizBox
        question="Which prompt will give you the most control over the AI output?"
        options={[
          '"A pretty forest"',
          '"Forest at dawn, watercolor style, ethereal mood"',
          '"Ancient misty redwood forest at dawn, golden sunlight rays through towering trees, watercolor and ink style, emerald and amber palette, magical atmosphere, morning dew, artstation quality"'
        ]}
        correct={2}
        explanation="More specific prompts with art style, lighting, colors, mood, and quality keywords give the AI much clearer guidance and produce more consistent results."
      />
    </div>
  );

  // ── 4: Image-to-Video ──
  const renderImageToVideo = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>🎬 Part 2: Image-to-Video Generation</h2>

      <h3 style={h3Style}>How Frame Prediction Works</h3>
      <InfoCard title="From Still Image to Moving Video" icon="📽️" color="#3498db">
        <p>Think of an AI-powered flipbook. You give the AI a single drawing (your image), and it predicts what the <strong>next pages</strong> would look like if time moved forward.</p>
        <p>The AI has studied millions of videos, so it understands: "If I see ocean waves at position A, the next frame should show them moving slightly to position B." It generates frames one by one (or in batches) to create the illusion of movement.</p>
      </InfoCard>

      <h3 style={h3Style}>Key Video Parameters</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, margin: "12px 0" }}>
        {[
          { param: "Duration", range: "3–10 seconds", tip: "Shorter = better quality. Start with 4 seconds.", icon: "⏱️" },
          { param: "Frame Rate (FPS)", range: "24 fps (cinematic) or 30 fps (smooth)", tip: "24fps is standard for a film look.", icon: "🎞️" },
          { param: "Resolution", range: "720p – 1080p", tip: "720p is faster to generate; 1080p for final output.", icon: "📐" },
          { param: "Motion Intensity", range: "Low / Medium / High", tip: "LOW for portraits, MEDIUM for landscapes, HIGH for action.", icon: "💨" },
          { param: "Guidance Scale (CFG)", range: "5 – 15", tip: "Higher = more literal but can look stiff.", icon: "🎚️" }
        ].map((p, i) => (
          <div key={i} style={{
            background: "#fff", border: "1px solid #d4c4a8", borderRadius: 10, padding: 14
          }}>
            <div style={{ fontSize: 20 }}>{p.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{p.param}</div>
            <div style={{ fontSize: 13, color: "#3498db", fontWeight: 600 }}>{p.range}</div>
            <div style={{ fontSize: 12, color: "#8a7a6a", marginTop: 4 }}>{p.tip}</div>
          </div>
        ))}
      </div>

      <h3 style={h3Style}>Video Frame Math</h3>
      <InfoCard title="Simple Calculation" icon="🧮" color="#9b59b6">
        <p style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700 }}>
          Total Frames = Duration × FPS
        </p>
        <p style={{ textAlign: "center", fontSize: 14 }}>
          Example: 4 seconds × 24 fps = <strong>96 frames</strong> the AI must generate
        </p>
      </InfoCard>

      <h3 style={h3Style}>The Two-Stage Approach</h3>
      <p>Most modern systems use the <strong>factorized approach</strong> (Emu-style):</p>
      <FactorizedPipelineDiagram />
      <p>Why this is powerful: You can edit or regenerate the keyframe image <strong>without</strong> touching the text prompt, then re-run only the video stage. This gives you explicit control at each step rather than relying on one monolithic text-to-video model.</p>

      <QuizBox
        question="If you generate a 5-second video at 30 fps, how many frames does the AI create?"
        options={["120 frames", "150 frames", "180 frames", "90 frames"]}
        correct={1}
        explanation="5 seconds × 30 fps = 150 frames. Each frame is predicted by the AI to create smooth motion."
      />
    </div>
  );

  // ── 5: Motion & Camera ──
  const renderMotionCamera = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>🎥 Motion Prompts & Camera Movements</h2>

      <h3 style={h3Style}>Camera Movement Types</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, margin: "12px 0" }}>
        {[
          { move: "Pan Left/Right", desc: "Camera slides horizontally", example: '"slow camera pan right revealing city skyline"', best: "Landscapes, panoramas", icon: "↔️" },
          { move: "Tilt Up/Down", desc: "Camera looks up or down", example: '"gentle camera tilt upward to reveal mountain peak"', best: "Tall subjects, reveals", icon: "↕️" },
          { move: "Zoom In/Out", desc: "Closer or farther", example: '"slow cinematic zoom into subject\'s eyes"', best: "Emotional close-ups, drama", icon: "🔍" },
          { move: "Dolly / Track", desc: "Camera physically moves through space", example: '"dolly forward through enchanted forest path"', best: "Immersive depth, exploration", icon: "🛤️" },
          { move: "Orbit", desc: "Camera circles the subject", example: '"camera slowly orbits around sculpture"', best: "3D objects, architecture", icon: "🔄" },
          { move: "Static + Subject Motion", desc: "Camera stays still, things move", example: '"wind gently blowing through hair, leaves falling"', best: "Portraits, nature, cinemagraphs", icon: "🌿" }
        ].map((m, i) => (
          <div key={i} style={{
            background: "#fff", border: "1px solid #d4c4a8", borderRadius: 10, padding: 14
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#3d2b1f" }}>{m.move}</div>
            <div style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>{m.desc}</div>
            <div style={{
              fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              background: "#f5efe5", padding: "4px 8px", borderRadius: 4, margin: "6px 0"
            }}>{m.example}</div>
            <div style={{ fontSize: 11, color: "#b08d57", fontWeight: 600 }}>Best for: {m.best}</div>
          </div>
        ))}
      </div>

      <h3 style={h3Style}>Motion Prompt Examples</h3>
      <RevealBox title="🌾 Nature Scene" icon="🌿">
        <CodeBlock>Golden wheat field swaying gently in the breeze, slow camera pan right, scattered wildflowers bobbing, warm sunlight with floating pollen particles, clouds drifting slowly overhead, peaceful cinematic movement</CodeBlock>
      </RevealBox>
      <RevealBox title="🏙️ Cityscape" icon="🌃">
        <CodeBlock>Neon-lit cyberpunk street at night, slow dolly forward, steam rising from grates, holographic signs flickering, pedestrians walking, rain puddles reflecting neon, cinematic shallow depth of field</CodeBlock>
      </RevealBox>
      <RevealBox title="👤 Portrait" icon="🧑‍🎨">
        <CodeBlock>Portrait subject with very subtle breathing motion, slight hair movement from gentle breeze, soft blinking, ambient light particles floating, extremely subtle and slow motion, keep face stable</CodeBlock>
        <p style={{ color: "#c0392b", fontWeight: 600, fontSize: 13 }}>⚠️ Portraits need VERY subtle motion — high motion = face distortion!</p>
      </RevealBox>

      <QuizBox
        question="Which camera movement is best for showing a tall waterfall from bottom to top?"
        options={["Pan Right", "Tilt Up", "Zoom In", "Orbit"]}
        correct={1}
        explanation="Tilt Up moves the camera's gaze upward, perfect for revealing the full height of a waterfall from base to top."
      />
    </div>
  );

  // ── 6: Advanced Extensions ──
  const renderAdvancedExtensions = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>🔬 Advanced Extensions: Beyond Basic I2V</h2>
      <p>Basic image-to-video is just the beginning. Here's how modern systems extend this into <strong>fully controllable, story-level video generation</strong>.</p>

      <h3 style={h3Style}>1. Factorized Text → Image → Video (Emu-Style)</h3>
      <FactorizedPipelineDiagram />
      <InfoCard title="Why Factorize?" icon="🧩" color="#e67e22">
        <p><strong>Reuse strong T2I models</strong> and wrap them with a video module — no need to train a massive monolithic text-to-video model from scratch.</p>
        <p><strong>Explicit control:</strong> Edit or regenerate the keyframe, then re-run video stage without touching the text. The factorization: text → image, then (text, image) → video makes I2V a <strong>central building block</strong> inside larger T2V pipelines.</p>
      </InfoCard>

      <h3 style={h3Style}>2. Multi-Shot & Story-Level Generation</h3>
      <MultiShotDiagram />
      <InfoCard title="How It Works" icon="📖" color="#2c5282">
        <p>Instead of "one prompt = one short clip," modern systems generate <strong>sequences of shots</strong>, each with its own text description:</p>
        <p>1. Generate consistent character keyframes per shot (using reference images).</p>
        <p>2. Animate those images via I2V for each shot.</p>
        <p>3. Concatenate shots with <strong>transition tokens</strong> and <strong>local attention masks</strong> so a single diffusion model handles multiple shots and transitions in one pass.</p>
        <p>I2V becomes the <strong>workhorse for each shot</strong> — a controllable animation engine keeping characters and style consistent once a reference frame exists.</p>
      </InfoCard>

      <h3 style={h3Style}>3. Controlled Video Diffusion</h3>
      <ControlledDiffusionDiagram />
      <RevealBox title="Key Architectures" icon="🏗️">
        <p><strong>ConditionVideo:</strong> Training-free method using off-the-shelf T2I models + a control branch for motion and scenery. A UNet branch handles base diffusion while a 3D control branch injects conditional information (image, pose, depth) over time for temporal consistency.</p>
        <p><strong>AnimateDiff:</strong> Attaches a motion adapter to a T2I backbone, effectively turning it into a T2V or image-conditioned video model. Images aren't just "starting frames" — they become <strong>structured conditions</strong> (ID, layout, pose, depth) that steer frame-by-frame generation.</p>
      </RevealBox>

      <h3 style={h3Style}>4. Unbounded & Controllable Motion Paths</h3>
      <InfoCard title="Fine Motion Control" icon="↗️" color="#e91e63">
        <p><strong>Frame In-N-Out</strong> and similar systems support objects entering/exiting along user-specified paths while preserving identity and style.</p>
        <p>The pattern: <strong>Text</strong> describes scene semantics + <strong>Images</strong> pin down identity/appearance + <strong>Extra control signals</strong> (paths, depth, trajectories) define motion. Result: controllable, longer videos rather than purely stochastic motion.</p>
      </InfoCard>

      <h3 style={h3Style}>5. Autoregressive Extensions & Upsampling</h3>
      <InfoCard title="Extending Length & Quality" icon="🔗" color="#27ae60">
        <p><strong>Temporal extension:</strong> Generate a base clip, then condition the next clip on the last frames to extend length autoregressively — like writing a story one paragraph at a time, each following from the last.</p>
        <p><strong>Frame-rate / resolution extension:</strong> First generate a coarse, low-fps or low-res video, then run specialized "uppers" to add intermediate frames or upscale spatially.</p>
        <p>I2V fits as both the <strong>base generator</strong> for short segments and a <strong>refinement tool</strong> to insert intermediate motion between sparse keyframes.</p>
      </InfoCard>

      <h3 style={h3Style}>6. Unified Text / Image / Video Systems</h3>
      <UnifiedTriModalDiagram />
      <p>Modern systems like LTX-2 are explicitly <strong>tri-modal</strong> — accepting text, image, or both, routing through the same backend. I2V becomes an <strong>operating mode</strong> of a more general system, not a separate stage.</p>

      <h3 style={h3Style}>7. Practical Extension Patterns (Summary)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, margin: "12px 0" }}>
        {[
          { pattern: "Factorized Design", desc: "T2I for composition → I2V for motion → optional upsampling (spatial/temporal). Emu Video is the canonical example.", icon: "🧱", color: "#e67e22" },
          { pattern: "Story Pipelines", desc: "Multi-shot text plan → per-shot keyframes (with reference images) → per-shot I2V → shot concatenation with transition control.", icon: "📚", color: "#3498db" },
          { pattern: "Controlled Motion", desc: "Add pose/depth/motion-path inputs so I2V is a controlled module inside a T2V graph, not just 'animate however you like.'", icon: "🎮", color: "#9b59b6" },
          { pattern: "Unified UI", desc: "Expose 'Prompt only / Prompt + Image / Image only' as three faces of the same T2V engine, with I2V paths under the hood.", icon: "🔄", color: "#27ae60" }
        ].map((p, i) => (
          <div key={i} style={{
            background: "#fff", border: `2px solid ${p.color}`, borderRadius: 12,
            padding: 16, borderTop: `4px solid ${p.color}`
          }}>
            <div style={{ fontSize: 22 }}>{p.icon}</div>
            <div style={{ fontWeight: 700, color: p.color, marginTop: 4 }}>{p.pattern}</div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 6, lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <InfoCard title="The Big Takeaway" icon="🎯" color="#e74c3c">
        <p>These extensions turn basic I2V from a simple animation trick into a <strong>central building block</strong> for fully-fledged, controllable, text-driven video generation systems. Every major advance in AI video uses I2V somewhere in its pipeline.</p>
      </InfoCard>

      <QuizBox
        question="In a factorized (Emu-style) pipeline, what is the main advantage of splitting text-to-video into two stages?"
        options={[
          "It's faster to generate",
          "You can edit the keyframe image independently and re-run only the video stage",
          "It requires less training data",
          "It only works with one specific AI model"
        ]}
        correct={1}
        explanation="The factorized approach gives explicit control at each stage — you can regenerate or edit the keyframe image without changing your text prompt, then re-run just the video animation stage."
      />
    </div>
  );

  // ── 7: 2026 AI Tools ──
  const renderToolsComparison = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>🛠️ 2026 AI Video Tools Landscape</h2>

      <h3 style={h3Style}>🎨 Best Creative Control (Art + Motion)</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "12px 0" }}>
        <ToolCard name="Runway Gen-4.5" tagline="Industry leader for creative professionals" strengths="Fine-grained motion control, camera presets, style consistency, long-form support, multi-shot editing" bestFor="Art students, filmmakers, creative projects" color="#e74c3c" />
        <ToolCard name="Pika" tagline="Beginner-friendly with powerful features" strengths="Intuitive UI, good motion quality, fun effects, text-to-video and image-to-video, fast generation" bestFor="Quick creative experiments, beginners" color="#e67e22" />
        <ToolCard name="Luma Ray 3" tagline="Fast and physically realistic" strengths="Realistic physics simulation, fast generation, good lighting/shadows, supports complex camera moves" bestFor="Realistic art + motion, architectural viz" color="#9b59b6" />
      </div>

      <h3 style={h3Style}>📸 Best Photorealism from Images</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "12px 0" }}>
        <ToolCard name="Google Gemini Veo 3.1" tagline="Google's latest video model" strengths="Exceptional photorealism, physics understanding, long duration, integrated with Google ecosystem" bestFor="Photorealistic video from photos" color="#4285f4" />
        <ToolCard name="OpenAI Sora 2" tagline="OpenAI's flagship video model" strengths="Complex scene understanding, consistent characters, long coherent videos, excellent prompt following" bestFor="Story-driven photorealistic videos" color="#10a37f" />
        <ToolCard name="Kling 2.6" tagline="By Kuaishou Technology" strengths="Excellent long-form video (up to 2 min), strong motion quality, good facial expressions, competitive pricing" bestFor="Long-form photorealistic video" color="#ff6b35" />
        <ToolCard name="Luma Ray 3" tagline="Also excels at photorealism" strengths="Realistic light, shadows, and physics, fast inference, good camera control" bestFor="Physically-accurate realistic scenes" color="#9b59b6" />
      </div>

      <h3 style={h3Style}>🔓 Best Open / Quasi-Open Workflows & Labs</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "12px 0" }}>
        <ToolCard name="Stable Video Diffusion (SVD / SVD-XT)" tagline="Open-source by Stability AI" strengths="Fully open weights, customizable, fine-tunable, integrates with ComfyUI/A1111, huge community, local GPU support" bestFor="Research, custom workflows, students learning internals" color="#27ae60" />
        <ToolCard name="All-in-One Platforms" tagline="Platforms exposing multiple models" strengths="Access multiple models (SVD, AnimateDiff, Kling) from one interface, community workflows, ComfyUI integration, free tiers available" bestFor="Comparing models, lab exercises, experimentation" color="#3498db" />
      </div>

      <h3 style={h3Style}>👤 Best Portrait / Product Image-to-Video</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "12px 0" }}>
        <ToolCard name="LetsEnhance" tagline="AI image & video enhancement" strengths="Specialized portrait animation, face consistency, product turntables, batch processing, API access" bestFor="E-commerce product videos, headshots" color="#ff4081" />
        <ToolCard name="Claid" tagline="Enterprise AI media" strengths="Product photography animation, consistent branding, batch workflows, API-first design" bestFor="Product catalogs, commercial content" color="#7c4dff" />
        <ToolCard name="Enterprise SaaS Tools" tagline="Specialized commercial solutions" strengths="Industry-specific templates, brand consistency, team collaboration, compliance features" bestFor="Marketing teams, corporate content" color="#607d8b" />
      </div>

      <h3 style={h3Style}>Quick Comparison: Which Tool for Which Task?</h3>
      <div style={{
        background: "#fff", border: "1px solid #d4c4a8", borderRadius: 10,
        overflow: "auto", margin: "12px 0"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f5efe5" }}>
              {["Task", "Best Tool(s)", "Why"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #d4c4a8", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Art class project (this lab!)", "Pika, Runway Gen-4.5", "Free tier, intuitive, great creative control"],
              ["Photorealistic nature video", "Veo 3.1, Sora 2, Luma Ray 3", "Best physics, lighting, and realism"],
              ["Long character-driven story", "Kling 2.6, Sora 2", "Long duration, character consistency"],
              ["Learning how AI works inside", "SVD / SVD-XT, ComfyUI", "Open-source, can inspect every step"],
              ["Product photography animation", "LetsEnhance, Claid", "Specialized for product shots"],
              ["Portrait / talking head", "LetsEnhance, Runway (low motion)", "Face stability features"],
              ["Experimental / research", "SVD, AnimateDiff", "Full control, open weights"]
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e8e0d4" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RevealBox title="Free Tools for Today's Lab" icon="🆓">
        <p><strong>Image Generation (free):</strong> Microsoft Copilot Designer (DALL·E 3), Playground AI, Leonardo AI</p>
        <p><strong>Video Generation (free tier):</strong> Pika (free tier: several generations/day), Runway (free trial), Luma Dream Machine (free tier)</p>
        <p>For open-source experiments: Stable Video Diffusion via Google Colab or Hugging Face Spaces — completely free!</p>
      </RevealBox>

      <QuizBox
        question="Which tool category would you choose for a class project where you want to understand how the AI works internally?"
        options={[
          "Runway Gen-4.5 (creative control)",
          "Stable Video Diffusion / SVD-XT (open-source)",
          "LetsEnhance (portrait specialist)",
          "Google Veo 3.1 (photorealism)"
        ]}
        correct={1}
        explanation="SVD / SVD-XT is open-source with inspectable weights and customizable pipelines — perfect for learning how the AI actually works under the hood."
      />
    </div>
  );

  // ── 8: Full Pipeline ──
  const renderFullPipeline = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>🗺️ Complete Pipeline Flowchart</h2>
      <PipelineFlowchart />

      <h3 style={h3Style}>Step-by-Step Breakdown</h3>
      {[
        { step: 1, icon: "✏️", title: "Write Your Text Prompt", detail: "Include subject, art style, lighting, color palette, mood, and quality keywords. Think about what motion will work well for video." },
        { step: 2, icon: "🎨", title: "Generate Your AI Image", detail: "Use DALL·E 3 (via Copilot), FLUX, or Stable Diffusion. Generate 4-8 variations and choose the best one for animation." },
        { step: 3, icon: "🔍", title: "Review & Refine the Image", detail: "Check: Is the composition clear? Is there a focal point? Are there motion-friendly elements (water, wind, clouds)? No text or fine details that might distort?" },
        { step: 4, icon: "📤", title: "Upload to Your Video Tool", detail: "Choose based on your goal: Pika for easy experimentation, Runway for creative control, SVD for learning, Veo/Sora for photorealism." },
        { step: 5, icon: "🎬", title: "Write Your Motion Prompt", detail: "Describe camera movement (pan, tilt, zoom, orbit) and subject animation (swaying, flowing, breathing). Be specific about speed and intensity." },
        { step: 6, icon: "⚙️", title: "Set Video Parameters", detail: "Start with: 4 seconds, 24 fps, 720p, LOW motion intensity. You can increase later. Lower settings = faster generation and fewer artifacts." },
        { step: 7, icon: "🎥", title: "Generate & Export", detail: "Generate, review for artifacts (face distortion, flickering, unnatural motion). Iterate if needed. Export as MP4 (universal) or GIF (for sharing)." }
      ].map((s) => (
        <div key={s.step} style={{
          display: "flex", gap: 14, marginBottom: 12, padding: 14,
          background: "#fff", borderRadius: 10, border: "1px solid #e0d5c4"
        }}>
          <div style={{
            minWidth: 44, height: 44, borderRadius: "50%", background: "#f0e8d8",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
          }}>{s.icon}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Step {s.step}: {s.title}</div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{s.detail}</div>
          </div>
        </div>
      ))}

      <RevealBox title="Pro Tips for the Full Pipeline" icon="⭐">
        <p><strong>Generate many variations:</strong> Create 4-8 image versions before picking one for video. The best image makes the best video.</p>
        <p><strong>Match resolutions:</strong> If your video tool expects 1024×576, generate your image at that size or crop it.</p>
        <p><strong>Design for loops:</strong> Choose subjects with naturally repeating motion (water, wind, fire, breathing).</p>
        <p><strong>Start simple:</strong> Begin with low motion intensity and short duration. You can always increase later.</p>
        <p><strong>Save your prompts:</strong> Build a prompt library! Good prompts are reusable and refinable.</p>
      </RevealBox>
    </div>
  );

  // ── 9: Hands-on Lab ──
  const renderHandsOnLab = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>🧪 Hands-on Lab: Create Your Video!</h2>

      <InfoCard title="Lab Overview" icon="⏱️" color="#e67e22">
        <p>25 minutes total. You'll go from an idea to a finished video loop. Follow each step and use the templates provided!</p>
      </InfoCard>

      {[
        {
          step: 1, time: "2 min", title: "Choose Your Theme",
          content: (
            <div>
              <p>Pick one theme that excites you:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["🌅 Dreamy Landscape", "🏛️ Surreal Architecture", "🍎 Living Still Life", "🌊 Ocean / Water", "🌃 Neon Cityscape", "🎭 Abstract Portrait"].map((t, i) => (
                  <span key={i} style={{
                    background: "#f5efe5", border: "1px solid #d4c4a8", borderRadius: 20,
                    padding: "6px 14px", fontSize: 13
                  }}>{t}</span>
                ))}
              </div>
            </div>
          )
        },
        {
          step: 2, time: "5 min", title: "Write Your Image Prompt",
          content: (
            <div>
              <p>Fill in this template:</p>
              <CodeBlock>{`[Your subject and setting],
[Art style] style,
[Lighting description],
[Color palette],
[Mood / atmosphere],
[Quality keywords: highly detailed, artstation quality]

Negative: blurry, low quality, distorted, watermark, text`}</CodeBlock>
              <p style={{ fontSize: 13, color: "#5a8f5a" }}>💡 Remember: choose subjects with natural motion for better video (water, wind, clouds, fire).</p>
            </div>
          )
        },
        {
          step: 3, time: "5 min", title: "Generate Your Image",
          content: (
            <div>
              <p>Use one of these free tools:</p>
              <p><strong>Option A:</strong> Microsoft Copilot Designer — <em>copilot.microsoft.com</em> (uses DALL·E 3, free)</p>
              <p><strong>Option B:</strong> Playground AI — <em>playgroundai.com</em> (free tier, multiple models)</p>
              <p><strong>Option C:</strong> Leonardo AI — <em>leonardo.ai</em> (free tier, great quality)</p>
              <p style={{ fontSize: 13, color: "#3498db", fontWeight: 600 }}>Generate 3-4 variations and pick the best one!</p>
            </div>
          )
        },
        {
          step: 4, time: "3 min", title: "Write Your Motion Prompt",
          content: (
            <div>
              <p>Describe the motion you want:</p>
              <CodeBlock>{`Camera movement: [pan/tilt/zoom/orbit/static]
Subject motion: [what moves and how]
Environment motion: [wind/water/particles/clouds]
Speed: [slow/medium — avoid fast!]
Intensity: [low/medium — avoid high for first try!]`}</CodeBlock>
            </div>
          )
        },
        {
          step: 5, time: "5 min", title: "Generate Your Video",
          content: (
            <div>
              <p>Upload your image to a video tool:</p>
              <p><strong>Option A:</strong> Pika — <em>pika.art</em> (free tier, beginner-friendly)</p>
              <p><strong>Option B:</strong> Runway — <em>runwayml.com</em> (free trial, best creative control)</p>
              <p><strong>Option C:</strong> Luma Dream Machine — <em>lumalabs.ai</em> (free tier, fast)</p>
              <p><strong>Recommended settings:</strong> 4 seconds, low-medium motion, 720p resolution</p>
            </div>
          )
        },
        {
          step: 6, time: "5 min", title: "Review, Iterate & Export",
          content: (
            <div>
              <p>Check your video for:</p>
              <p>✅ Smooth, natural motion  ✅ No face/body distortion  ✅ Good loop quality  ✅ Mood matches your original vision</p>
              <p>If something's off, try: reducing motion intensity, simplifying the motion prompt, or trying a different camera movement.</p>
              <p><strong>Export as:</strong> MP4 (universal) or GIF (easy sharing)</p>
            </div>
          )
        }
      ].map((s) => (
        <div key={s.step} style={{
          background: "#fff", border: "1px solid #d4c4a8", borderRadius: 12,
          padding: 18, marginBottom: 14, borderLeft: "4px solid #b08d57"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#3d2b1f" }}>Step {s.step}: {s.title}</div>
            <span style={{
              background: "#f0e8d8", borderRadius: 20, padding: "3px 12px",
              fontSize: 12, fontWeight: 600, color: "#b08d57"
            }}>{s.time}</span>
          </div>
          {s.content}
        </div>
      ))}
    </div>
  );

  // ── 10: Ethics ──
  const renderEthics = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>⚖️ Best Practices & Ethics</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "12px 0" }}>
        <div style={{ background: "#e8f5e8", borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, color: "#5a8f5a", fontSize: 16, marginBottom: 10 }}>✅ DO</div>
          {["Disclose AI generation clearly", "Credit the tools you used", "Experiment with many variations", "Use AI as a creative starting point", "Start with short clips (3-4 sec)", "Build a prompt library", "Design for natural looping motion", "Match resolutions between stages"].map((item, i) => (
            <div key={i} style={{ fontSize: 13, padding: "4px 0", borderBottom: "1px solid #c8e6c8" }}>✓ {item}</div>
          ))}
        </div>
        <div style={{ background: "#fde8e8", borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, color: "#c0392b", fontSize: 16, marginBottom: 10 }}>❌ DON'T</div>
          {["Claim AI art as hand-made", "Create deepfakes of real people", "Copy a living artist's style without credit", "Ignore tool licensing terms", "Use maximum motion intensity", "Generate harmful or deceptive content", "Skip negative prompts", "Submit AI work without disclosure in class"].map((item, i) => (
            <div key={i} style={{ fontSize: 13, padding: "4px 0", borderBottom: "1px solid #f0c8c8" }}>✗ {item}</div>
          ))}
        </div>
      </div>

      <h3 style={h3Style}>Ethics Discussion Questions</h3>
      {[
        { q: "Authorship: Who is the 'artist'?", a: "The human is the creative director — they chose the concept, wrote the prompts, selected the output, and directed the motion. But transparency about AI involvement is essential." },
        { q: "Training Data: Is it fair to train on artists' work?", a: "This is an ongoing legal and ethical debate. AI models were trained on billions of images, many by human artists who didn't explicitly consent. Some artists oppose this; others see AI as a new tool." },
        { q: "Impact on Creative Jobs", a: "AI will change creative industries. Some traditional roles may shrink, but new roles (AI art director, prompt engineer, AI workflow designer) are emerging. The key is adaptation and honest disclosure." },
        { q: "Misinformation Potential", a: "AI-generated videos can be mistaken for real footage. Always label AI content clearly, especially on social media. Deepfakes of real people without consent are unethical and increasingly illegal." }
      ].map((item, i) => (
        <RevealBox key={i} title={item.q} icon="💭">
          <p>{item.a}</p>
        </RevealBox>
      ))}

      <h3 style={h3Style}>Common Mistakes & Quick Fixes</h3>
      <div style={{
        background: "#fff", border: "1px solid #d4c4a8", borderRadius: 10,
        overflow: "auto", margin: "12px 0"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f5efe5" }}>
              {["Problem", "Cause", "Fix"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #d4c4a8" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Generic/boring image", "Vague prompt", "Add specific style, lighting, mood, color details"],
              ["Face distortion in video", "Too much motion", "Use LOW motion intensity for portraits"],
              ["Video doesn't loop well", "Wrong subject choice", "Choose water, wind, fire — natural repetition"],
              ["Wrong colors in video", "Color profile mismatch", "Match color settings between image & video tools"],
              ["Text in image is garbled", "Most models struggle with text", "Use FLUX model; keep text very short"],
              ["Flickering/artifacts", "High CFG or motion", "Lower guidance scale to 7-10, reduce motion"]
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e8e0d4" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── 11: Class Activities ──
  const renderActivities = () => (
    <div style={bodyStyle}>
      <h2 style={h2Style}>📝 Class Activities & Solutions</h2>

      {/* Activity 1 */}
      <div style={{ background: "#fff", border: "2px solid #e67e22", borderRadius: 12, padding: 18, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#e67e22", marginBottom: 10 }}>Activity 1: Fix the Bad Prompt</div>
        <p>This prompt produces boring, generic results. <strong>Rewrite it</strong> using the prompt formula:</p>
        <CodeBlock>A pretty picture of a forest</CodeBlock>
        <RevealBox title="Show Solution" icon="✅">
          <CodeBlock>Ancient misty redwood forest at dawn, rays of golden sunlight streaming through towering trees, watercolor and ink illustration style, emerald green and warm amber palette, magical ethereal atmosphere, morning dew on fern leaves, depth of field, highly detailed, artstation quality</CodeBlock>
          <p><strong>Why it's better:</strong> Specifies forest type (redwood), time (dawn), lighting (golden rays), art style (watercolor/ink), colors (emerald/amber), mood (magical/ethereal), specific details (dew, fern), and quality keywords.</p>
        </RevealBox>
      </div>

      {/* Activity 2 */}
      <div style={{ background: "#fff", border: "2px solid #3498db", borderRadius: 12, padding: 18, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#3498db", marginBottom: 10 }}>Activity 2: Match the Camera Movement</div>
        <p>Match each scene to its best camera movement:</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "10px 0", fontSize: 14 }}>
          <div><strong>1.</strong> Vast mountain landscape</div><div>A) Slow Zoom In</div>
          <div><strong>2.</strong> Dramatic portrait close-up</div><div>B) Tilt Up</div>
          <div><strong>3.</strong> Tall waterfall</div><div>C) Orbit</div>
          <div><strong>4.</strong> 3D sculpture display</div><div>D) Pan Right</div>
        </div>
        <RevealBox title="Show Solution" icon="✅">
          <p><strong>1 → D) Pan Right</strong> — horizontal sweep reveals the full landscape width.</p>
          <p><strong>2 → A) Slow Zoom In</strong> — creates emotional connection and dramatic intensity.</p>
          <p><strong>3 → B) Tilt Up</strong> — shows the full vertical height of the waterfall.</p>
          <p><strong>4 → C) Orbit</strong> — reveals all angles of a 3D object, like walking around it.</p>
        </RevealBox>
      </div>

      {/* Activity 3 */}
      <div style={{ background: "#fff", border: "2px solid #9b59b6", borderRadius: 12, padding: 18, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#9b59b6", marginBottom: 10 }}>Activity 3: Calculate Video Frames</div>
        <p><strong>A)</strong> A 5-second video at 24 fps = ? frames</p>
        <p><strong>B)</strong> You have a video with 180 frames at 30 fps. How many seconds long is it?</p>
        <p><strong>C)</strong> Compare: Which is smoother — 12 fps or 24 fps? How many frames for a 4-second clip at each?</p>
        <RevealBox title="Show Solutions" icon="✅">
          <p><strong>A)</strong> 5 × 24 = <strong>120 frames</strong></p>
          <p><strong>B)</strong> 180 ÷ 30 = <strong>6 seconds</strong></p>
          <p><strong>C)</strong> 24 fps is smoother (more frames per second = smoother motion). At 12 fps: 4 × 12 = 48 frames. At 24 fps: 4 × 24 = 96 frames — twice as many frames means twice as smooth.</p>
        </RevealBox>
      </div>

      {/* Activity 4 */}
      <div style={{ background: "#fff", border: "2px solid #27ae60", borderRadius: 12, padding: 18, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#27ae60", marginBottom: 10 }}>Activity 4: Plan a Complete Pipeline</div>
        <p>Design a full pipeline for: <strong>"Japanese koi pond viewed from above."</strong></p>
        <p>Write: (1) Image prompt, (2) Motion prompt, (3) Parameter choices with reasoning.</p>
        <RevealBox title="Show Solution" icon="✅">
          <p><strong>Image Prompt:</strong></p>
          <CodeBlock>Serene koi pond viewed from directly above, three orange and white koi fish gliding through crystal clear water, green lily pads floating, smooth river stones visible on pond bottom, traditional Japanese garden setting, watercolor and ukiyo-e illustration style, jade green and coral orange palette, zen peaceful atmosphere, highly detailed, artstation quality</CodeBlock>
          <p><strong>Motion Prompt:</strong></p>
          <CodeBlock>Koi fish gliding slowly through water creating gentle ripples, lily pads bobbing subtly, dappled sunlight shifting on water surface, very slow camera zoom in, peaceful slow-motion feel, low motion intensity</CodeBlock>
          <p><strong>Parameters:</strong> 4 sec duration, 24 fps (96 frames), 1080p, low-medium motion intensity, Tool: Runway Gen-4.5 or Pika</p>
          <p><strong>Rationale:</strong> Overhead view avoids depth/perspective issues. Water and fish provide natural looping motion. Low motion prevents distortion of fine details. Ukiyo-e style is forgiving of slight AI artifacts.</p>
        </RevealBox>
      </div>

      {/* Activity 5 */}
      <div style={{ background: "#fff", border: "2px solid #e74c3c", borderRadius: 12, padding: 18, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#e74c3c", marginBottom: 10 }}>Activity 5: Ethics Scenario</div>
        <p>A student uses Runway Gen-4.5 to generate a video that closely mimics a famous living artist's distinctive style. They submit it to a class exhibition as "original digital artwork" and receive an A. <strong>Is this ethical? Why or why not? What should they have done?</strong></p>
        <RevealBox title="Show Solution" icon="✅">
          <p><strong>NOT ethical</strong> for three reasons:</p>
          <p>1. <strong>No disclosure:</strong> Submitting AI-generated work without disclosing the tools used is dishonest.</p>
          <p>2. <strong>Style copying:</strong> Deliberately mimicking a living artist's distinctive style without credit raises serious attribution concerns.</p>
          <p>3. <strong>Misrepresentation:</strong> Calling it "original digital artwork" implies hand-crafted work, misleading the instructor and audience.</p>
          <p><strong>What they should have done:</strong> (1) Disclose all AI tools used, (2) Credit the artist whose style influenced the work, (3) Describe their own creative decisions in artist statement, (4) Follow class/university AI use policies.</p>
        </RevealBox>
      </div>

      {/* Activity 6 - Tool Selection */}
      <div style={{ background: "#fff", border: "2px solid #ff6b35", borderRadius: 12, padding: 18, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#ff6b35", marginBottom: 10 }}>Activity 6: Choose the Right Tool</div>
        <p>Match each project to the best tool category:</p>
        <div style={{ fontSize: 14, lineHeight: 2 }}>
          <p><strong>1.</strong> A photo-real commercial showing a product rotating 360°</p>
          <p><strong>2.</strong> An artistic music video with painterly style and creative camera movements</p>
          <p><strong>3.</strong> A research project studying how diffusion models generate motion</p>
          <p><strong>4.</strong> A realistic nature documentary-style clip of waves crashing</p>
        </div>
        <RevealBox title="Show Solution" icon="✅">
          <p><strong>1 → Portrait/Product tools (LetsEnhance, Claid)</strong> — specialized for product turntables with consistent lighting and no distortion.</p>
          <p><strong>2 → Creative Control tools (Runway Gen-4.5, Pika)</strong> — best artistic style control and camera movement presets for creative expression.</p>
          <p><strong>3 → Open/Quasi-Open tools (SVD, AnimateDiff)</strong> — open weights let you inspect every step of the diffusion process for research.</p>
          <p><strong>4 → Photorealism tools (Veo 3.1, Sora 2, Luma Ray 3)</strong> — best at realistic physics simulation for natural scenes like water.</p>
        </RevealBox>
      </div>

      {/* Final Review Quizzes */}
      <h3 style={h3Style}>Final Review</h3>
      <QuizBox
        question="In a factorized (Emu-style) pipeline, what does Stage 2 receive as inputs?"
        options={["Only the text prompt", "Only the generated image", "Both the text prompt AND the generated image", "A random noise vector"]}
        correct={2}
        explanation="In the factorized pipeline, Stage 2 (Image-to-Video) receives BOTH the original text prompt AND the keyframe image from Stage 1. This is the key insight: (text, image) → video."
      />
      <QuizBox
        question="What type of subject works BEST for a looping video?"
        options={["A person standing still", "Ocean waves rolling and receding", "A static building exterior", "Text on a sign"]}
        correct={1}
        explanation="Ocean waves have naturally repetitive motion that loops seamlessly. Static subjects have nothing to animate, and text/fine details often distort."
      />
      <QuizBox
        question="Your portrait video has face distortion. What's the FIRST thing to try?"
        options={["Increase resolution to 4K", "Reduce motion intensity to low/subtle", "Add more text to the prompt", "Change the art style to photorealistic"]}
        correct={1}
        explanation="Face distortion is almost always caused by too much motion. Reducing motion intensity to low/subtle is the most effective fix for portrait videos."
      />
      <QuizBox
        question="What makes multi-shot story generation different from basic I2V?"
        options={[
          "It uses a different AI model entirely",
          "It generates multiple shots with consistent characters and transitions in one pipeline",
          "It only works with photographs",
          "It doesn't use any text prompts"
        ]}
        correct={1}
        explanation="Multi-shot generation extends I2V from 'one clip per prompt' to creating sequences of shots with consistent characters, using reference images for identity and transition tokens for smooth connections between shots."
      />
    </div>
  );

  // ── Main Layout ──
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9f3ea",
      fontFamily: "'Crimson Pro', Georgia, serif"
    }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Crimson+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b3d 30%, #3d2b1f 70%, #1a0a2e 100%)",
        padding: "28px 24px 20px", color: "#fff", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, #fff 20px, #fff 21px)"
        }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ fontSize: 13, color: "#f0c27a", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
            ART 101 · Interactive Lecture
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, margin: "8px 0",
            lineHeight: 1.2
          }}>
            🎬 Image-to-Video AI Pipeline
          </h1>
          <p style={{ fontSize: 14, color: "#d4c4a8", margin: "4px 0 14px" }}>
            From text idea → AI image → animated video loop • Complete guide with hands-on lab
          </p>

          {/* Timer & Progress */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
            <div style={{
              background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px",
              display: "flex", alignItems: "center", gap: 10
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: timer < 300 ? "#e74c3c" : "#f0c27a" }}>
                {formatTime(timer)}
              </span>
              <button onClick={() => setTimerRunning(!timerRunning)} style={{
                background: timerRunning ? "#c0392b" : "#27ae60", color: "#fff",
                border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer",
                fontSize: 12, fontWeight: 600
              }}>{timerRunning ? "Pause" : "Start"}</button>
              <button onClick={() => { setTimer(90 * 60); setTimerRunning(false); }} style={{
                background: "rgba(255,255,255,0.15)", color: "#fff", border: "none",
                borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: 12
              }}>Reset</button>
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <div style={{ fontSize: 11, color: "#d4c4a8", marginBottom: 4 }}>Progress: {progress}%</div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, height: 8, overflow: "hidden" }}>
                <div style={{
                  width: `${progress}%`, height: "100%",
                  background: "linear-gradient(90deg, #f0c27a, #fc5c7d)",
                  borderRadius: 10, transition: "width 0.4s ease"
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: "#fff", borderBottom: "2px solid #e0d5c4",
        overflowX: "auto", whiteSpace: "nowrap",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
          {SECTIONS.map((name, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              display: "inline-block", padding: "12px 14px", border: "none",
              background: "transparent", cursor: "pointer",
              borderBottom: section === i ? "3px solid #b08d57" : "3px solid transparent",
              color: section === i ? "#3d2b1f" : "#8a7a6a",
              fontWeight: section === i ? 700 : 500,
              fontSize: 13, fontFamily: "'Crimson Pro', Georgia, serif",
              transition: "all 0.2s ease",
              opacity: visited.has(i) ? 1 : 0.6
            }}>
              {visited.has(i) && i !== section ? "✓ " : ""}{name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 60px" }}>
        {renderSection()}

        {/* Navigation Buttons */}
        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: 30,
          paddingTop: 20, borderTop: "1px solid #e0d5c4"
        }}>
          <button
            onClick={() => goTo(Math.max(0, section - 1))}
            disabled={section === 0}
            style={{
              padding: "10px 20px", border: "1px solid #d4c4a8", borderRadius: 8,
              background: section === 0 ? "#f0e8d8" : "#fff", cursor: section === 0 ? "default" : "pointer",
              fontSize: 14, fontFamily: "'Crimson Pro', Georgia, serif",
              color: section === 0 ? "#c9b896" : "#3d2b1f", fontWeight: 600
            }}
          >← Previous</button>
          <span style={{ fontSize: 13, color: "#8a7a6a", alignSelf: "center" }}>
            {section + 1} / {SECTIONS.length}
          </span>
          <button
            onClick={() => goTo(Math.min(SECTIONS.length - 1, section + 1))}
            disabled={section === SECTIONS.length - 1}
            style={{
              padding: "10px 20px", border: "none", borderRadius: 8,
              background: section === SECTIONS.length - 1 ? "#d4c4a8" : "linear-gradient(135deg, #b08d57, #d4a567)",
              cursor: section === SECTIONS.length - 1 ? "default" : "pointer",
              fontSize: 14, fontFamily: "'Crimson Pro', Georgia, serif",
              color: "#fff", fontWeight: 600
            }}
          >Next →</button>
        </div>
      </div>
    </div>
  );
}
