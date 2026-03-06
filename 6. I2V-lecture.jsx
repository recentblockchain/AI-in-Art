import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  "Welcome",
  "Part 1: Text→Image",
  "Part 2: Image→Video",
  "Pipeline Flowchart",
  "Hands-on Lab",
  "Ethics & Tips",
];

const TIMING = [
  "5 min",
  "30 min",
  "25 min",
  "10 min",
  "15 min",
  "5 min",
];

// ── Reusable Components ──────────────────────────────────
function Card({ children, accent = "#e84393", style = {} }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Tag({ children, color = "#e84393" }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: color + "22",
        color: color,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.5,
        marginRight: 6,
        marginBottom: 4,
      }}
    >
      {children}
    </span>
  );
}

function PromptBox({ prompt, label, note }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      style={{
        background: "rgba(108,92,231,0.1)",
        border: "1px solid rgba(108,92,231,0.25)",
        borderRadius: 10,
        padding: "14px 18px",
        marginBottom: 12,
        position: "relative",
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 11,
            color: "#a29bfe",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          color: "#dfe6e9",
          lineHeight: 1.6,
        }}
      >
        "{prompt}"
      </div>
      {note && (
        <div style={{ fontSize: 12, color: "#74b9ff", marginTop: 8, fontStyle: "italic" }}>
          💡 {note}
        </div>
      )}
      <button
        onClick={() => {
          navigator.clipboard.writeText(prompt).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(255,255,255,0.08)",
          border: "none",
          borderRadius: 6,
          padding: "4px 10px",
          color: "#b2bec3",
          fontSize: 11,
          cursor: "pointer",
        }}
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}

function MathBlock({ children }) {
  return (
    <div
      style={{
        background: "rgba(0,206,209,0.08)",
        border: "1px solid rgba(0,206,209,0.2)",
        borderRadius: 10,
        padding: "16px 20px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        color: "#81ecec",
        lineHeight: 1.8,
        marginBottom: 14,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

function QuizQuestion({ question, options, answer, explanation }) {
  const [selected, setSelected] = useState(null);
  const correct = selected === answer;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 600, marginBottom: 10, color: "#dfe6e9", fontSize: 15 }}>
        🧠 {question}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border:
                selected === i
                  ? correct
                    ? "2px solid #00b894"
                    : "2px solid #d63031"
                  : "1px solid rgba(255,255,255,0.12)",
              background:
                selected === i
                  ? correct
                    ? "rgba(0,184,148,0.15)"
                    : "rgba(214,48,49,0.15)"
                  : "rgba(255,255,255,0.04)",
              color: "#dfe6e9",
              cursor: "pointer",
              fontSize: 13,
              transition: "all 0.2s",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: correct ? "#55efc4" : "#fab1a0",
            padding: "8px 12px",
            background: correct ? "rgba(85,239,196,0.08)" : "rgba(250,177,160,0.08)",
            borderRadius: 8,
          }}
        >
          {correct ? "✅ Correct! " : "❌ Not quite. "}
          {explanation}
        </div>
      )}
    </div>
  );
}

// ── Denoising Animation ──────────────────────────────────
function DenoisingDemo() {
  const [step, setStep] = useState(0);
  const canvasRef = useRef(null);
  const steps = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // seed-based pseudo random for consistency
    const seed = 42;
    const rand = (s) => {
      let x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    ctx.clearRect(0, 0, w, h);

    // background gradient based on step
    const progress = step / steps;
    const skyR = Math.round(40 + progress * 95);
    const skyG = Math.round(40 + progress * 160);
    const skyB = Math.round(60 + progress * 195);
    ctx.fillStyle = `rgb(${skyR},${skyG},${skyB})`;
    ctx.fillRect(0, 0, w, h);

    if (progress > 0.2) {
      // ground
      const groundY = h * 0.65;
      ctx.fillStyle = `rgba(${34 + progress * 80},${120 + progress * 60},${34 + progress * 40},${progress})`;
      ctx.fillRect(0, groundY, w, h - groundY);

      // sun
      if (progress > 0.35) {
        ctx.beginPath();
        ctx.arc(w * 0.75, h * 0.25, 20 + progress * 15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253,203,110,${progress * 0.9})`;
        ctx.fill();
      }

      // flowers
      if (progress > 0.5) {
        const flowerColors = ["#e84393", "#fd79a8", "#a29bfe", "#fdcb6e", "#e17055"];
        for (let i = 0; i < 12; i++) {
          const fx = rand(seed + i * 7) * w;
          const fy = groundY + 10 + rand(seed + i * 13) * (h - groundY - 30);
          // stem
          ctx.strokeStyle = `rgba(0,148,50,${progress * 0.7})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(fx, fy + 15);
          ctx.stroke();
          // petals
          ctx.beginPath();
          ctx.arc(fx, fy, 4 + progress * 3, 0, Math.PI * 2);
          ctx.fillStyle = flowerColors[i % flowerColors.length] + Math.round(progress * 200).toString(16).padStart(2, "0");
          ctx.fill();
        }
      }

      // clouds
      if (progress > 0.6) {
        ctx.fillStyle = `rgba(255,255,255,${(progress - 0.6) * 2})`;
        for (let c = 0; c < 3; c++) {
          const cx = 30 + c * 90;
          const cy = 25 + c * 12;
          ctx.beginPath();
          ctx.ellipse(cx, cy, 25, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx + 15, cy - 5, 18, 10, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // noise overlay that decreases with steps
    const noiseLevel = 1 - progress;
    if (noiseLevel > 0.02) {
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (rand(i + step * 1000) - 0.5) * 255 * noiseLevel;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // step label
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, h - 24, w, 24);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      step === 0 ? "Pure Noise (t=T)" : step === steps ? "Final Image (t=0)" : `Denoising Step ${step}/${steps}`,
      w / 2,
      h - 8
    );
  }, [step]);

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <canvas
          ref={canvasRef}
          width={280}
          height={180}
          style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#b2bec3", marginBottom: 8 }}>
            Drag the slider to see how the AI removes noise step by step to create a "field of flowers" image:
          </div>
          <input
            type="range"
            min={0}
            max={steps}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#e84393" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#636e72" }}>
            <span>🎲 Random Noise</span>
            <span>🌸 Clear Image</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        <button
          onClick={() => {
            let s = 0;
            const interval = setInterval(() => {
              s++;
              setStep(s);
              if (s >= steps) clearInterval(interval);
            }, 400);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "1px solid rgba(232,67,147,0.4)",
            background: "rgba(232,67,147,0.15)",
            color: "#fd79a8",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ▶ Auto Play
        </button>
        <button
          onClick={() => setStep(0)}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "#b2bec3",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}

// ── Flowchart Component ──────────────────────────────────
function FlowchartSVG() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    { id: "idea", x: 400, y: 40, label: "💡 Your Creative Idea", color: "#fdcb6e", w: 180, desc: "Start with what you want to create" },
    { id: "prompt", x: 400, y: 120, label: "✍️ Write Text Prompt", color: "#e84393", w: 180, desc: "Describe scene, style, mood, lighting" },
    { id: "model", x: 400, y: 200, label: "🤖 Choose AI Model", color: "#6c5ce7", w: 180, desc: "FLUX, DALL-E 3, Stable Diffusion" },
    { id: "generate", x: 400, y: 280, label: "🎨 Generate Image", color: "#00cec9", w: 180, desc: "AI denoises random noise into art" },
    { id: "review", x: 400, y: 360, label: "👁️ Review & Refine", color: "#55efc4", w: 180, desc: "Check quality, re-generate if needed" },
    { id: "motion", x: 400, y: 440, label: "🎬 Add Motion Prompt", color: "#fd79a8", w: 200, desc: "Define movement & camera angles" },
    { id: "video", x: 400, y: 520, label: "📹 Generate Video", color: "#a29bfe", w: 180, desc: "AI predicts frames from your image" },
    { id: "export", x: 400, y: 600, label: "✅ Export & Share", color: "#ffeaa7", w: 180, desc: "Download MP4, GIF, or loop" },
  ];

  const sideNotes = [
    { x: 140, y: 155, text: "Prompt Formula:\nSubject + Style +\nMood + Details", color: "#e84393" },
    { x: 660, y: 235, text: "20–50 denoising\nsteps typical", color: "#00cec9" },
    { x: 140, y: 395, text: "Try: 'gentle zoom',\n'slow pan left',\n'camera orbit'", color: "#fd79a8" },
    { x: 660, y: 475, text: "Params: FPS, length,\nmotion strength,\nseed value", color: "#a29bfe" },
  ];

  return (
    <svg viewBox="0 0 800 660" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>

      {/* Connecting arrows */}
      {nodes.slice(0, -1).map((node, i) => (
        <line
          key={i}
          x1={node.x}
          y1={node.y + 22}
          x2={nodes[i + 1].x}
          y2={nodes[i + 1].y - 22}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={2}
          markerEnd="url(#arrowhead)"
          strokeDasharray={hoveredNode === nodes[i + 1].id ? "none" : "4,4"}
        />
      ))}

      {/* Divider line between image and video phases */}
      <line x1={200} y1={400} x2={600} y2={400} stroke="rgba(253,121,168,0.3)" strokeWidth={1} strokeDasharray="8,4" />
      <text x={400} y={393} textAnchor="middle" fill="#fd79a8" fontSize={10} fontWeight={600} opacity={0.7}>
        ─── IMAGE → VIDEO TRANSITION ───
      </text>

      {/* Side notes */}
      {sideNotes.map((note, i) => (
        <g key={`note-${i}`}>
          <rect x={note.x - 70} y={note.y - 20} width={140} height={52} rx={8} fill="rgba(255,255,255,0.03)" stroke={note.color + "44"} strokeWidth={1} />
          {note.text.split("\n").map((line, j) => (
            <text key={j} x={note.x} y={note.y + j * 14} textAnchor="middle" fill={note.color} fontSize={10} fontFamily="JetBrains Mono, monospace">
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <g
          key={node.id}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          style={{ cursor: "pointer" }}
        >
          <rect
            x={node.x - node.w / 2}
            y={node.y - 20}
            width={node.w}
            height={40}
            rx={12}
            fill={hoveredNode === node.id ? node.color + "33" : "rgba(255,255,255,0.05)"}
            stroke={node.color}
            strokeWidth={hoveredNode === node.id ? 2 : 1}
            filter={hoveredNode === node.id ? "url(#glow)" : "none"}
          />
          <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={600} fontFamily="system-ui">
            {node.label}
          </text>
          {hoveredNode === node.id && (
            <text x={node.x} y={node.y + 32} textAnchor="middle" fill={node.color} fontSize={11} fontStyle="italic">
              {node.desc}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ── Frame Prediction Animation ───────────────────────────
function FramePredictionDemo() {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const totalFrames = 24;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const t = frame / totalFrames;

    ctx.clearRect(0, 0, w, h);

    // sky gradient shifts over time
    const grad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    grad.addColorStop(0, `hsl(${210 + t * 20}, 60%, ${25 + t * 10}%)`);
    grad.addColorStop(1, `hsl(${200 + t * 30}, 50%, ${40 + t * 15}%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // water
    const waterY = h * 0.55;
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, h);
    waterGrad.addColorStop(0, `hsl(${200 + t * 20}, 55%, ${30 + t * 8}%)`);
    waterGrad.addColorStop(1, `hsl(${210}, 40%, 20%)`);
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, w, h - waterY);

    // waves
    ctx.strokeStyle = `rgba(255,255,255,${0.1 + t * 0.05})`;
    ctx.lineWidth = 1;
    for (let wave = 0; wave < 5; wave++) {
      ctx.beginPath();
      const baseY = waterY + 15 + wave * 16;
      for (let x = 0; x < w; x += 2) {
        const y = baseY + Math.sin((x + frame * 8 + wave * 40) * 0.03) * (3 + wave);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // sun moving slowly
    const sunX = w * 0.7 + t * 20;
    const sunY = h * 0.2 - t * 15;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 35);
    sunGrad.addColorStop(0, "rgba(253,203,110,0.9)");
    sunGrad.addColorStop(0.5, "rgba(253,203,110,0.3)");
    sunGrad.addColorStop(1, "rgba(253,203,110,0)");
    ctx.fillStyle = sunGrad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(sunX, sunY, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#fdcb6e";
    ctx.fill();

    // sailboat moving
    const boatX = 50 + t * (w - 100);
    const boatY = waterY - 5 + Math.sin(frame * 0.3) * 2;
    // hull
    ctx.fillStyle = "#d63031";
    ctx.beginPath();
    ctx.moveTo(boatX - 18, boatY);
    ctx.lineTo(boatX + 18, boatY);
    ctx.lineTo(boatX + 12, boatY + 8);
    ctx.lineTo(boatX - 12, boatY + 8);
    ctx.fill();
    // mast
    ctx.strokeStyle = "#dfe6e9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boatX, boatY);
    ctx.lineTo(boatX, boatY - 25);
    ctx.stroke();
    // sail
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.moveTo(boatX, boatY - 24);
    ctx.lineTo(boatX + 14, boatY - 5);
    ctx.lineTo(boatX, boatY - 3);
    ctx.fill();

    // Frame counter
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, h - 22, w, 22);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Frame ${frame + 1} / ${totalFrames}  •  ${Math.round((frame / totalFrames) * 100)}% complete`, w / 2, h - 7);
  }, [frame]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setFrame((f) => {
          if (f >= totalFrames - 1) {
            setPlaying(false);
            return 0;
          }
          return f + 1;
        });
      }, 150);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  return (
    <div style={{ marginBottom: 20 }}>
      <canvas
        ref={canvasRef}
        width={320}
        height={200}
        style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", display: "block", margin: "0 auto 10px" }}
      />
      <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
        <button
          onClick={() => {
            setFrame(0);
            setPlaying(true);
          }}
          style={{
            padding: "6px 18px",
            borderRadius: 8,
            border: "1px solid rgba(162,155,254,0.4)",
            background: "rgba(162,155,254,0.15)",
            color: "#a29bfe",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          {playing ? "⏸ Playing..." : "▶ Play Animation"}
        </button>
        <input
          type="range"
          min={0}
          max={totalFrames - 1}
          value={frame}
          onChange={(e) => {
            setPlaying(false);
            setFrame(Number(e.target.value));
          }}
          style={{ width: 140, accentColor: "#a29bfe" }}
        />
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: "#636e72", marginTop: 6 }}>
        Each frame is predicted from the previous one — the boat, waves, and sun all move smoothly
      </div>
    </div>
  );
}

// ── SECTION CONTENT ──────────────────────────────────────

function WelcomeSection() {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ fontSize: 42, marginBottom: 8 }}>🎨 → 🖼️ → 🎬</div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            background: "linear-gradient(135deg, #e84393, #a29bfe, #00cec9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          Image-to-Video Pipeline
        </h1>
        <p style={{ color: "#b2bec3", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
          From text idea → AI image → animated video loop
        </p>
      </div>

      <Card accent="#fdcb6e">
        <div style={{ fontWeight: 700, color: "#fdcb6e", marginBottom: 8, fontSize: 15 }}>📋 Today's Lecture Plan (90 minutes)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {SECTIONS.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "rgba(253,203,110,0.15)",
                  color: "#fdcb6e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <div>
                <div style={{ fontSize: 13, color: "#dfe6e9" }}>{s}</div>
                <div style={{ fontSize: 11, color: "#636e72" }}>{TIMING[i]}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card accent="#e84393">
        <div style={{ fontWeight: 700, color: "#e84393", marginBottom: 8 }}>🎯 What You'll Learn</div>
        <p style={{ color: "#b2bec3", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          By the end of this lecture, you will understand how AI creates images from text descriptions, how those images can be turned into short video loops, and you'll have hands-on experience creating your own AI-generated video art. No coding or math background needed — we'll keep everything visual and intuitive!
        </p>
      </Card>

      <Card accent="#00cec9">
        <div style={{ fontWeight: 700, color: "#00cec9", marginBottom: 8 }}>🧰 Tools We'll Reference</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Tag color="#6c5ce7">FLUX (by Black Forest Labs)</Tag>
          <Tag color="#e84393">DALL·E 3 (by OpenAI)</Tag>
          <Tag color="#00cec9">Stable Diffusion 3.5</Tag>
          <Tag color="#fdcb6e">Runway Gen-3 Alpha</Tag>
          <Tag color="#55efc4">Pika Labs</Tag>
          <Tag color="#fd79a8">Kling AI</Tag>
        </div>
      </Card>
    </div>
  );
}

function Part1Section() {
  const [activeTab, setActiveTab] = useState("concept");
  const tabs = [
    { id: "concept", label: "🧊 Core Concept" },
    { id: "models", label: "🤖 AI Models" },
    { id: "math", label: "📐 Simple Math" },
    { id: "prompts", label: "✍️ Prompt Craft" },
    { id: "quiz", label: "🧠 Check" },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e84393", marginBottom: 4 }}>Part 1: Text → Image</h2>
      <p style={{ color: "#636e72", fontSize: 14, marginBottom: 16 }}>How diffusion models turn words into pictures (30 min)</p>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: activeTab === tab.id ? "1px solid #e84393" : "1px solid rgba(255,255,255,0.08)",
              background: activeTab === tab.id ? "rgba(232,67,147,0.15)" : "rgba(255,255,255,0.03)",
              color: activeTab === tab.id ? "#fd79a8" : "#b2bec3",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "concept" && (
        <div>
          <Card accent="#e84393">
            <div style={{ fontWeight: 700, color: "#e84393", marginBottom: 10, fontSize: 16 }}>
              What is a Diffusion Model?
            </div>
            <p style={{ color: "#dfe6e9", lineHeight: 1.8, fontSize: 14 }}>
              Think of it like a sculptor starting with a block of random marble (noise) and slowly chipping away to reveal a statue (your image). The AI has learned from millions of images what things "should" look like. It starts with pure TV-static noise and gradually removes that noise, step by step, guided by your text description.
            </p>
          </Card>

          <Card accent="#fdcb6e" style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, color: "#fdcb6e", marginBottom: 10 }}>🔬 Simple Analogy: Cleaning a Foggy Window</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                textAlign: "center",
              }}
            >
              {[
                { emoji: "🌫️", label: "Step 1", desc: "Window totally fogged — you see nothing (random noise)" },
                { emoji: "👋", label: "Steps 2–49", desc: "You wipe gradually — shapes start appearing (denoising)" },
                { emoji: "🏔️", label: "Step 50", desc: "Window is clear — beautiful view revealed! (final image)" },
              ].map((s, i) => (
                <div key={i} style={{ padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{s.emoji}</div>
                  <div style={{ fontWeight: 700, color: "#fdcb6e", fontSize: 12 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "#b2bec3", marginTop: 4 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card accent="#6c5ce7">
            <div style={{ fontWeight: 700, color: "#6c5ce7", marginBottom: 10 }}>🎮 Interactive: Watch Denoising in Action</div>
            <DenoisingDemo />
          </Card>
        </div>
      )}

      {activeTab === "models" && (
        <div>
          <Card accent="#6c5ce7">
            <div style={{ fontWeight: 700, color: "#6c5ce7", marginBottom: 10, fontSize: 16 }}>Popular 2025–2026 AI Image Models</div>
            {[
              {
                name: "FLUX (Black Forest Labs)",
                color: "#6c5ce7",
                pros: "Exceptional photorealism, great with text in images, very fast",
                cons: "Fewer artistic styles than some competitors",
                best: "Photorealistic images, marketing visuals, text overlays",
                free: "Yes — via Replicate, Fal.ai, or HuggingFace",
              },
              {
                name: "DALL·E 3 (OpenAI / ChatGPT)",
                color: "#e84393",
                pros: "Easiest to use, best at understanding complex prompts, built into ChatGPT",
                cons: "Less control over fine details, content filters can be restrictive",
                best: "Quick concept art, illustrations, brainstorming",
                free: "Free tier in ChatGPT (limited images/day)",
              },
              {
                name: "Stable Diffusion 3.5 (Stability AI)",
                color: "#00cec9",
                pros: "Open-source, fully customizable, can run on your own computer",
                cons: "Steeper learning curve, needs decent GPU to run locally",
                best: "Full creative control, custom fine-tuning, batch generation",
                free: "Yes — fully free and open-source",
              },
            ].map((model, i) => (
              <div
                key={i}
                style={{
                  padding: 14,
                  marginBottom: 10,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  borderLeft: `3px solid ${model.color}`,
                }}
              >
                <div style={{ fontWeight: 700, color: model.color, fontSize: 15, marginBottom: 8 }}>{model.name}</div>
                <div style={{ fontSize: 13, color: "#dfe6e9", lineHeight: 1.7 }}>
                  <div><strong style={{ color: "#55efc4" }}>✅ Strengths:</strong> {model.pros}</div>
                  <div><strong style={{ color: "#fab1a0" }}>⚠️ Limitations:</strong> {model.cons}</div>
                  <div><strong style={{ color: "#74b9ff" }}>🎯 Best for:</strong> {model.best}</div>
                  <div><strong style={{ color: "#fdcb6e" }}>💰 Free access:</strong> {model.free}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card accent="#fd79a8">
            <div style={{ fontWeight: 700, color: "#fd79a8", marginBottom: 6 }}>⚡ Quick Comparison</div>
            <table style={{ width: "100%", fontSize: 12, color: "#dfe6e9", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Feature", "FLUX", "DALL·E 3", "SD 3.5"].map((h) => (
                    <th key={h} style={{ padding: "8px 6px", textAlign: "left", color: "#b2bec3", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Photorealism", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐"],
                  ["Ease of Use", "⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐"],
                  ["Prompt Follow", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐"],
                  ["Customizable", "⭐⭐⭐", "⭐⭐", "⭐⭐⭐⭐⭐"],
                  ["Speed", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐"],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: "6px", fontWeight: j === 0 ? 600 : 400, color: j === 0 ? "#b2bec3" : "#dfe6e9" }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {activeTab === "math" && (
        <div>
          <Card accent="#00cec9">
            <div style={{ fontWeight: 700, color: "#00cec9", marginBottom: 10, fontSize: 16 }}>
              📐 The Simple Math Behind Diffusion
            </div>
            <p style={{ color: "#b2bec3", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
              Don't worry — this math is just to give you intuition! You won't need to calculate anything.
            </p>

            <div style={{ fontWeight: 600, color: "#fdcb6e", marginBottom: 8 }}>Step 1: Adding Noise (Forward Process)</div>
            <p style={{ color: "#dfe6e9", fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
              The AI first learns by taking real images and gradually adding random noise to them, like making a photo blurrier and blurrier:
            </p>
            <MathBlock>
              <div>noisy_image = original_image + (noise_amount × random_noise)</div>
              <div style={{ fontSize: 12, color: "#b2bec3", marginTop: 6 }}>
                or more formally: x_t = √(α_t) · x_0 + √(1 − α_t) · ε
              </div>
            </MathBlock>
            <p style={{ color: "#b2bec3", fontSize: 13, lineHeight: 1.7 }}>
              Think of it this way: <strong style={{ color: "#81ecec" }}>α_t</strong> controls how much original image remains. When α_t is close to 1, the image is mostly clear. When α_t is close to 0, it's almost pure noise. <strong style={{ color: "#81ecec" }}>ε</strong> is just random TV static.
            </p>

            <div style={{ fontWeight: 600, color: "#fdcb6e", marginBottom: 8, marginTop: 16 }}>Step 2: Removing Noise (Reverse Process — the magic!)</div>
            <p style={{ color: "#dfe6e9", fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
              The AI learns to predict what noise was added, then subtracts it:
            </p>
            <MathBlock>
              <div>cleaner_image = noisy_image − predicted_noise</div>
              <div style={{ fontSize: 12, color: "#b2bec3", marginTop: 6 }}>
                x_(t−1) = (x_t − noise_prediction) / √(α_t)
              </div>
            </MathBlock>
            <p style={{ color: "#b2bec3", fontSize: 13, lineHeight: 1.7 }}>
              The AI does this 20–50 times in a row (each time called a "step"), and each step the image gets a little clearer!
            </p>

            <div style={{ fontWeight: 600, color: "#fdcb6e", marginBottom: 8, marginTop: 16 }}>Step 3: Text Guidance</div>
            <p style={{ color: "#dfe6e9", fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
              Your text prompt steers the denoising. A "guidance scale" (called CFG) controls how strongly the AI follows your words:
            </p>
            <MathBlock>
              <div>guided_prediction = unguided + CFG_scale × (text_guided − unguided)</div>
              <div style={{ fontSize: 12, color: "#b2bec3", marginTop: 6 }}>
                CFG = 1 → AI mostly ignores your prompt
              </div>
              <div style={{ fontSize: 12, color: "#b2bec3" }}>
                CFG = 7 → Good balance (most common)
              </div>
              <div style={{ fontSize: 12, color: "#b2bec3" }}>
                CFG = 20 → AI follows prompt very strictly (can look unnatural)
              </div>
            </MathBlock>
          </Card>

          <Card accent="#a29bfe">
            <div style={{ fontWeight: 700, color: "#a29bfe", marginBottom: 8 }}>🔢 Key Numbers to Remember</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Denoising Steps", value: "20–50", note: "More = better quality, slower" },
                { label: "CFG / Guidance", value: "5–12", note: "How closely AI follows text" },
                { label: "Resolution", value: "1024×1024", note: "Standard square output" },
                { label: "Seed Number", value: "Any integer", note: "Same seed = same image" },
              ].map((item, i) => (
                <div key={i} style={{ padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "#a29bfe", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#dfe6e9", fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 11, color: "#636e72" }}>{item.note}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "prompts" && (
        <div>
          <Card accent="#e84393">
            <div style={{ fontWeight: 700, color: "#e84393", marginBottom: 10, fontSize: 16 }}>
              ✍️ The Prompt Formula
            </div>
            <div
              style={{
                background: "rgba(232,67,147,0.1)",
                border: "1px solid rgba(232,67,147,0.25)",
                borderRadius: 10,
                padding: 16,
                textAlign: "center",
                fontSize: 15,
                color: "#fd79a8",
                fontWeight: 600,
                marginBottom: 14,
                lineHeight: 1.6,
              }}
            >
              [Subject] + [Style/Medium] + [Mood/Atmosphere] + [Lighting] + [Extra Details]
            </div>
            <p style={{ color: "#b2bec3", fontSize: 13, lineHeight: 1.7 }}>
              Think of prompts like giving instructions to an incredibly talented artist who has never seen your imagination. Be specific! Instead of "a cat," try "a fluffy orange tabby cat sitting on a velvet cushion."
            </p>
          </Card>

          <Card accent="#6c5ce7">
            <div style={{ fontWeight: 700, color: "#6c5ce7", marginBottom: 12 }}>🎨 Example Prompts (from simple to detailed)</div>

            <PromptBox
              label="Basic — Good starting point"
              prompt="A serene mountain lake at sunset, oil painting style"
              note="Simple but includes subject + time + medium"
            />
            <PromptBox
              label="Intermediate — Adding mood and details"
              prompt="A cozy coffee shop interior with warm golden light streaming through rain-covered windows, watercolor illustration, soft warm tones, vintage aesthetic"
              note="Now we have mood (cozy), lighting (golden), atmosphere (rain), and style"
            />
            <PromptBox
              label="Advanced — Full control"
              prompt="A bioluminescent jellyfish floating through an underwater crystal cave, ethereal blue and purple glow, cinematic lighting, photorealistic, 8K detail, volumetric light rays, by James Cameron"
              note="Very specific: subject, setting, colors, quality terms, and style reference"
            />
            <PromptBox
              label="Art-Specific — For your projects"
              prompt="Abstract expressionist landscape, bold impasto brushstrokes, cadmium red and ultramarine blue palette, emotional and turbulent sky, inspired by the energy of de Kooning, gallery-quality fine art"
              note="Uses art terminology your professors would love!"
            />
            <PromptBox
              label="Character Design"
              prompt="A whimsical forest spirit character with antlers made of flowering cherry blossoms, soft pastel colors, Studio Ghibli inspired, gentle expression, full body concept art, white background"
              note="Great for illustration and animation concept art"
            />
          </Card>

          <Card accent="#00cec9">
            <div style={{ fontWeight: 700, color: "#00cec9", marginBottom: 8 }}>⚡ Power Words That Improve Results</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[
                { word: "cinematic lighting", cat: "Lighting" },
                { word: "golden hour", cat: "Lighting" },
                { word: "volumetric fog", cat: "Atmosphere" },
                { word: "photorealistic", cat: "Quality" },
                { word: "8K detail", cat: "Quality" },
                { word: "oil painting", cat: "Medium" },
                { word: "watercolor", cat: "Medium" },
                { word: "impasto", cat: "Technique" },
                { word: "bokeh", cat: "Camera" },
                { word: "tilt-shift", cat: "Camera" },
                { word: "award-winning", cat: "Quality" },
                { word: "concept art", cat: "Style" },
                { word: "ethereal", cat: "Mood" },
                { word: "moody", cat: "Mood" },
                { word: "whimsical", cat: "Mood" },
                { word: "dramatic shadows", cat: "Lighting" },
              ].map((w, i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: "rgba(0,206,201,0.1)",
                    border: "1px solid rgba(0,206,201,0.2)",
                    fontSize: 12,
                    color: "#81ecec",
                  }}
                >
                  {w.word}
                  <span style={{ color: "#636e72", marginLeft: 4, fontSize: 10 }}>{w.cat}</span>
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "quiz" && (
        <div>
          <Card accent="#fdcb6e">
            <div style={{ fontWeight: 700, color: "#fdcb6e", marginBottom: 14, fontSize: 16 }}>🧠 Quick Knowledge Check</div>
            <QuizQuestion
              question="What does a diffusion model start with?"
              options={["A blank white canvas", "Random noise (static)", "A sketch outline", "A blurry photo"]}
              answer={1}
              explanation="Diffusion models begin with pure random noise and gradually remove it to create an image."
            />
            <QuizQuestion
              question="What does CFG (guidance scale) control?"
              options={["Image resolution", "How many colors to use", "How closely AI follows your text prompt", "How long generation takes"]}
              answer={2}
              explanation="CFG determines how strongly the AI steers toward your text description. Higher = more literal."
            />
            <QuizQuestion
              question="Which prompt would give the BEST result?"
              options={["A nice picture", "Cat", "A fluffy orange tabby on a velvet cushion, soft studio lighting, oil painting", "Make something cool and artsy"]}
              answer={2}
              explanation="Specific details about subject, setting, lighting, and style give the AI the best guidance."
            />
          </Card>
        </div>
      )}
    </div>
  );
}

function Part2Section() {
  const [activeTab, setActiveTab] = useState("how");
  const tabs = [
    { id: "how", label: "🎬 How It Works" },
    { id: "params", label: "⚙️ Parameters" },
    { id: "motion", label: "🏃 Motion Prompts" },
    { id: "camera", label: "📷 Camera Moves" },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#a29bfe", marginBottom: 4 }}>Part 2: Image → Video</h2>
      <p style={{ color: "#636e72", fontSize: 14, marginBottom: 16 }}>Bringing still images to life with AI (25 min)</p>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: activeTab === tab.id ? "1px solid #a29bfe" : "1px solid rgba(255,255,255,0.08)",
              background: activeTab === tab.id ? "rgba(162,155,254,0.15)" : "rgba(255,255,255,0.03)",
              color: activeTab === tab.id ? "#a29bfe" : "#b2bec3",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "how" && (
        <div>
          <Card accent="#a29bfe">
            <div style={{ fontWeight: 700, color: "#a29bfe", marginBottom: 10, fontSize: 16 }}>
              How Frame Prediction Works
            </div>
            <p style={{ color: "#dfe6e9", lineHeight: 1.8, fontSize: 14, marginBottom: 14 }}>
              Image-to-video AI works like a <strong style={{ color: "#fdcb6e" }}>comic book artist</strong> drawing the next panels. Given your starting image (Frame 1), the AI predicts what Frame 2 would look like if things moved naturally, then Frame 3, and so on. It has learned from millions of real videos how objects move, how light changes, and how cameras pan.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 8,
                marginBottom: 14,
                textAlign: "center",
              }}
            >
              {[
                { label: "Frame 1", desc: "Your image (input)", color: "#6c5ce7" },
                { label: "Frame 2–8", desc: "AI predicts motion", color: "#a29bfe" },
                { label: "Frame 9–16", desc: "Movement continues", color: "#74b9ff" },
                { label: "Frame 17–24", desc: "Loop back smoothly", color: "#00cec9" },
              ].map((f, i) => (
                <div key={i} style={{ padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 40,
                      background: `linear-gradient(135deg, ${f.color}44, ${f.color}11)`,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      marginBottom: 6,
                    }}
                  >
                    {["🖼️", "→ 🎨", "→ 🎨", "→ 🔄"][i]}
                  </div>
                  <div style={{ fontWeight: 700, color: f.color, fontSize: 12 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: "#b2bec3" }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card accent="#fd79a8">
            <div style={{ fontWeight: 700, color: "#fd79a8", marginBottom: 10 }}>🎮 Interactive: See Frame-by-Frame Prediction</div>
            <FramePredictionDemo />
          </Card>

          <Card accent="#00cec9">
            <div style={{ fontWeight: 700, color: "#00cec9", marginBottom: 8 }}>📐 Simple Math: Frame Prediction</div>
            <MathBlock>
              <div>next_frame = current_frame + predicted_motion</div>
              <div style={{ fontSize: 12, color: "#b2bec3", marginTop: 6 }}>
                Frame(t+1) = Frame(t) + MotionModel(Frame(t), text_prompt, t)
              </div>
            </MathBlock>
            <p style={{ color: "#b2bec3", fontSize: 13, lineHeight: 1.7 }}>
              The AI uses a similar noise→denoise approach as image generation, but now it also considers temporal consistency — making sure each frame looks like a natural continuation of the previous one.
            </p>
          </Card>

          <Card accent="#fdcb6e">
            <div style={{ fontWeight: 700, color: "#fdcb6e", marginBottom: 8 }}>🤖 Popular Video AI Models (2025–2026)</div>
            {[
              { name: "Runway Gen-3 Alpha Turbo", desc: "Industry leader. Great cinematic quality, camera control, and motion. Used in professional film & TV.", color: "#fdcb6e" },
              { name: "Kling AI 1.6", desc: "Excellent motion quality, especially for human movement. Long generation (up to 10s). Free tier available.", color: "#55efc4" },
              { name: "Pika 2.0", desc: "Very beginner-friendly interface. Good for quick loops and social media content. Fun editing tools.", color: "#fd79a8" },
              { name: "Stable Video Diffusion", desc: "Open-source option. More technical but fully customizable. Great for learning.", color: "#74b9ff" },
            ].map((m, i) => (
              <div key={i} style={{ padding: 10, marginBottom: 8, background: "rgba(255,255,255,0.03)", borderRadius: 8, borderLeft: `3px solid ${m.color}` }}>
                <div style={{ fontWeight: 700, color: m.color, fontSize: 13 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: "#b2bec3", marginTop: 3 }}>{m.desc}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "params" && (
        <div>
          <Card accent="#6c5ce7">
            <div style={{ fontWeight: 700, color: "#6c5ce7", marginBottom: 12, fontSize: 16 }}>⚙️ Video Generation Parameters</div>
            {[
              {
                param: "Duration / Length",
                range: "2–10 seconds",
                recommend: "3–5 seconds",
                desc: "Shorter = higher quality. Start with 4 seconds for loops.",
                emoji: "⏱️",
              },
              {
                param: "Frames Per Second (FPS)",
                range: "8–30 FPS",
                recommend: "24 FPS",
                desc: "24 FPS = cinema standard. Lower FPS = dreamy/stop-motion feel.",
                emoji: "🎞️",
              },
              {
                param: "Motion Strength / Amount",
                range: "0–100%",
                recommend: "40–60%",
                desc: "How much things move. Too high = distortion. Too low = barely animates.",
                emoji: "💨",
              },
              {
                param: "Resolution",
                range: "512×512 to 1280×720",
                recommend: "1024×576 (16:9)",
                desc: "Higher resolution = more detail but slower generation.",
                emoji: "📐",
              },
              {
                param: "Seed",
                range: "Any number",
                recommend: "Random, then save good ones",
                desc: "Same seed + same prompt = same video. Great for iterating!",
                emoji: "🎲",
              },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 12,
                  padding: 12,
                  marginBottom: 8,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  alignItems: "start",
                }}
              >
                <div style={{ fontSize: 28 }}>{p.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#dfe6e9", fontSize: 14 }}>{p.param}</div>
                  <div style={{ fontSize: 12, color: "#74b9ff" }}>
                    Range: {p.range} · <strong>Recommended: {p.recommend}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: "#b2bec3", marginTop: 2 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "motion" && (
        <div>
          <Card accent="#fd79a8">
            <div style={{ fontWeight: 700, color: "#fd79a8", marginBottom: 12, fontSize: 16 }}>🏃 Motion Prompt Examples</div>
            <p style={{ color: "#b2bec3", fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
              Motion prompts tell the AI <em>what should move</em> and <em>how</em>. Be specific about the action and its quality (speed, direction, intensity).
            </p>

            <PromptBox
              label="Gentle / Ambient Motion"
              prompt="gentle breeze moving through tall grass, flowers swaying softly, floating dust particles in golden sunlight"
              note="Words like 'gentle', 'softly', 'slowly' create subtle, looping motion"
            />
            <PromptBox
              label="Water & Nature"
              prompt="ocean waves crashing against rocky shore, sea foam spreading across dark sand, misty spray rising into the air"
              note="Water movements are great for loops because they're naturally repetitive"
            />
            <PromptBox
              label="Character / Figure"
              prompt="woman turning her head slowly to the left, hair flowing in the wind, slight smile forming, eyes looking toward camera"
              note="Keep human motion simple — complex actions often cause distortion"
            />
            <PromptBox
              label="Abstract / Artistic"
              prompt="swirling paint colors morphing and blending together, fluid art in motion, hypnotic color transitions between deep purple and electric blue"
              note="Abstract motion works extremely well for art loops"
            />
            <PromptBox
              label="Urban / City"
              prompt="busy city street timelapse, car headlights streaking, pedestrians walking, neon signs flickering and reflecting on wet pavement"
              note="Multiple movement elements create dynamic, engaging scenes"
            />
          </Card>
        </div>
      )}

      {activeTab === "camera" && (
        <div>
          <Card accent="#00cec9">
            <div style={{ fontWeight: 700, color: "#00cec9", marginBottom: 12, fontSize: 16 }}>📷 Camera Movement Descriptions</div>
            <p style={{ color: "#b2bec3", fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
              Camera prompts tell the AI to simulate camera movement, just like a filmmaker directing shots. These are the most common and reliable movements:
            </p>

            {[
              { move: "Slow Zoom In", desc: "Camera slowly pushes toward the subject. Creates intimacy and focus.", prompt: "slow zoom in on the subject's face", emoji: "🔎", best: "Portraits, details, dramatic reveals" },
              { move: "Slow Zoom Out", desc: "Camera pulls back to reveal the full scene. Great for establishing shots.", prompt: "slow zoom out revealing the full landscape", emoji: "🔭", best: "Landscapes, context setting, reveals" },
              { move: "Pan Left / Right", desc: "Camera slides horizontally. Feels like turning your head.", prompt: "slow camera pan from left to right across the scene", emoji: "↔️", best: "Panoramas, following movement, environments" },
              { move: "Tilt Up / Down", desc: "Camera tilts vertically. Like looking up at a building.", prompt: "camera tilts upward from ground level to the sky", emoji: "↕️", best: "Architecture, tall subjects, reveals" },
              { move: "Orbit / Arc", desc: "Camera circles around the subject. Very cinematic.", prompt: "camera orbits slowly around the subject, 360 degree rotation", emoji: "🔄", best: "Products, characters, sculptures" },
              { move: "Dolly / Push In", desc: "Camera physically moves forward through the scene.", prompt: "camera pushes forward through the forest path", emoji: "🛤️", best: "Environments, immersive scenes, exploration" },
              { move: "Static / Locked", desc: "Camera doesn't move at all. Only the subject animates.", prompt: "static camera, locked shot, only the subject moves", emoji: "📌", best: "Loops, character animation, ambient" },
            ].map((cam, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  display: "grid",
                  gridTemplateColumns: "36px 1fr",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <div style={{ fontSize: 24, textAlign: "center" }}>{cam.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#00cec9", fontSize: 14 }}>{cam.move}</div>
                  <div style={{ fontSize: 12, color: "#dfe6e9", marginTop: 2 }}>{cam.desc}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#a29bfe", marginTop: 4, padding: "3px 8px", background: "rgba(162,155,254,0.1)", borderRadius: 4, display: "inline-block" }}>
                    "{cam.prompt}"
                  </div>
                  <div style={{ fontSize: 11, color: "#636e72", marginTop: 3 }}>Best for: {cam.best}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

function FlowchartSection() {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#55efc4", marginBottom: 4 }}>Complete Pipeline Flowchart</h2>
      <p style={{ color: "#636e72", fontSize: 14, marginBottom: 16 }}>The full workflow from idea to final video (hover nodes for details)</p>
      <Card accent="#55efc4">
        <FlowchartSVG />
      </Card>
      <Card accent="#fdcb6e">
        <div style={{ fontWeight: 700, color: "#fdcb6e", marginBottom: 8 }}>⚡ Pipeline Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ padding: 12, background: "rgba(232,67,147,0.08)", borderRadius: 8 }}>
            <div style={{ fontWeight: 700, color: "#e84393", fontSize: 13, marginBottom: 4 }}>Phase 1: Text → Image</div>
            <div style={{ fontSize: 12, color: "#b2bec3", lineHeight: 1.6 }}>
              Write a detailed text prompt, choose your AI model, set parameters (steps, CFG, resolution, seed), generate, review, and regenerate if needed.
            </div>
          </div>
          <div style={{ padding: 12, background: "rgba(162,155,254,0.08)", borderRadius: 8 }}>
            <div style={{ fontWeight: 700, color: "#a29bfe", fontSize: 13, marginBottom: 4 }}>Phase 2: Image → Video</div>
            <div style={{ fontSize: 12, color: "#b2bec3", lineHeight: 1.6 }}>
              Upload your best image, write a motion prompt, set video parameters (duration, FPS, motion strength), generate video, and export as MP4 or GIF loop.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LabSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const labSteps = [
    {
      title: "Step 1: Choose Your Theme",
      time: "2 min",
      color: "#fdcb6e",
      emoji: "💡",
      content: (
        <div>
          <p style={{ color: "#dfe6e9", fontSize: 14, lineHeight: 1.7 }}>
            Pick one of these art themes or choose your own. Your theme will guide everything else!
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            {[
              { theme: "🌊 Dreamy Seascape", desc: "Ocean, waves, ethereal mood" },
              { theme: "🌃 Neon Cityscape", desc: "Urban, glowing lights, night" },
              { theme: "🌸 Enchanted Garden", desc: "Flowers, magic, nature" },
              { theme: "🪐 Cosmic Abstract", desc: "Space, nebulas, surreal" },
              { theme: "🏛️ Ancient Ruins", desc: "History, overgrown, mysterious" },
              { theme: "🎭 Your Own Idea!", desc: "Anything you imagine" },
            ].map((t, i) => (
              <div key={i} style={{ padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8, cursor: "pointer", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.theme}</div>
                <div style={{ fontSize: 12, color: "#b2bec3" }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Write Your Image Prompt",
      time: "3 min",
      color: "#e84393",
      emoji: "✍️",
      content: (
        <div>
          <p style={{ color: "#dfe6e9", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
            Use the prompt formula we learned. Fill in each part for your theme:
          </p>
          <div style={{ background: "rgba(232,67,147,0.1)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#fd79a8", lineHeight: 1.8 }}>
              <div><span style={{ color: "#fdcb6e" }}>[Subject]:</span> ________________</div>
              <div><span style={{ color: "#fdcb6e" }}>[Style/Medium]:</span> ________________</div>
              <div><span style={{ color: "#fdcb6e" }}>[Mood]:</span> ________________</div>
              <div><span style={{ color: "#fdcb6e" }}>[Lighting]:</span> ________________</div>
              <div><span style={{ color: "#fdcb6e" }}>[Extra details]:</span> ________________</div>
            </div>
          </div>
          <PromptBox
            label="Example (Dreamy Seascape theme)"
            prompt="A vast turquoise ocean with gentle rolling waves under a pastel pink and lavender sunset sky, impressionist oil painting style, dreamy and peaceful mood, soft diffused golden hour lighting, distant sailboat silhouette, wispy clouds"
          />
        </div>
      ),
    },
    {
      title: "Step 3: Generate Your Image",
      time: "3 min",
      color: "#6c5ce7",
      emoji: "🎨",
      content: (
        <div>
          <p style={{ color: "#dfe6e9", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
            Open one of these free tools and paste your prompt:
          </p>
          {[
            { tool: "ChatGPT (DALL·E 3)", url: "chat.openai.com", tip: "Just type your prompt — it uses DALL·E 3 automatically" },
            { tool: "FLUX via Replicate", url: "replicate.com/black-forest-labs/flux-1.1-pro", tip: "Paste prompt, click Run. Free tier available" },
            { tool: "Stable Diffusion via Clipdrop", url: "clipdrop.co/stable-diffusion", tip: "Free browser-based tool, no account needed" },
          ].map((t, i) => (
            <div key={i} style={{ padding: 10, marginBottom: 8, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: "#6c5ce7", fontSize: 13 }}>{t.tool}</div>
              <div style={{ fontSize: 12, color: "#74b9ff" }}>{t.url}</div>
              <div style={{ fontSize: 12, color: "#b2bec3" }}>💡 {t.tip}</div>
            </div>
          ))}
          <div style={{ background: "rgba(253,203,110,0.1)", borderRadius: 8, padding: 10, marginTop: 8 }}>
            <div style={{ fontWeight: 600, color: "#fdcb6e", fontSize: 12 }}>⚙️ Recommended Settings</div>
            <div style={{ fontSize: 12, color: "#b2bec3" }}>Steps: 30 · CFG: 7 · Resolution: 1024×1024 · Generate 2–3 variations</div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 4: Select & Refine",
      time: "2 min",
      color: "#00cec9",
      emoji: "👁️",
      content: (
        <div>
          <p style={{ color: "#dfe6e9", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
            Review your generated images and pick the best one. Ask yourself:
          </p>
          {[
            "✅ Does the composition look balanced and interesting?",
            "✅ Are the colors and mood what I envisioned?",
            "✅ Are there any weird artifacts (extra fingers, melted faces, distorted text)?",
            "✅ Will this image animate well? (Scenes with depth and motion potential work best)",
            "✅ Is the subject clearly defined with enough detail?",
          ].map((q, i) => (
            <div key={i} style={{ fontSize: 13, color: "#dfe6e9", marginBottom: 6, lineHeight: 1.5 }}>{q}</div>
          ))}
          <div style={{ background: "rgba(0,206,201,0.1)", borderRadius: 8, padding: 10, marginTop: 10 }}>
            <div style={{ fontWeight: 600, color: "#00cec9", fontSize: 12 }}>💡 Pro Tip</div>
            <div style={{ fontSize: 12, color: "#b2bec3" }}>Not happy? Adjust your prompt slightly and regenerate. Small changes in wording can produce very different results. Try changing the lighting, mood, or adding "highly detailed" to improve quality.</div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 5: Create Motion Prompt & Generate Video",
      time: "3 min",
      color: "#a29bfe",
      emoji: "🎬",
      content: (
        <div>
          <p style={{ color: "#dfe6e9", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
            Upload your best image to a video AI tool and write a motion prompt:
          </p>
          {[
            { tool: "Runway Gen-3", url: "app.runwayml.com", tip: "Best quality. 125 free credits to start" },
            { tool: "Pika Labs", url: "pika.art", tip: "Most beginner-friendly. Free daily generations" },
            { tool: "Kling AI", url: "klingai.com", tip: "Excellent motion quality. Free tier available" },
          ].map((t, i) => (
            <div key={i} style={{ padding: 8, marginBottom: 6, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <span style={{ fontWeight: 700, color: "#a29bfe", fontSize: 13 }}>{t.tool}</span>
              <span style={{ fontSize: 12, color: "#b2bec3", marginLeft: 8 }}>💡 {t.tip}</span>
            </div>
          ))}
          <PromptBox
            label="Motion prompt example (for the seascape)"
            prompt="Gentle ocean waves rolling forward, light sparkling on the water surface, clouds slowly drifting across the sky, sailboat gently rocking, static camera with slight slow zoom in"
            note="Combine subject motion + camera movement for best results"
          />
          <div style={{ background: "rgba(162,155,254,0.1)", borderRadius: 8, padding: 10, marginTop: 8 }}>
            <div style={{ fontWeight: 600, color: "#a29bfe", fontSize: 12 }}>⚙️ Recommended Video Settings</div>
            <div style={{ fontSize: 12, color: "#b2bec3" }}>Duration: 4 seconds · Motion Strength: 50% · FPS: 24</div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 6: Export & Present",
      time: "2 min",
      color: "#55efc4",
      emoji: "✅",
      content: (
        <div>
          <p style={{ color: "#dfe6e9", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
            Download your finished video and prepare to share with the class!
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: 12, background: "rgba(85,239,196,0.08)", borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: "#55efc4", fontSize: 13, marginBottom: 4 }}>📦 Export Options</div>
              <div style={{ fontSize: 12, color: "#b2bec3", lineHeight: 1.6 }}>
                MP4 — standard video file, best quality; GIF — looping animation, lower quality but fun for sharing; WebM — smaller file size, web-friendly
              </div>
            </div>
            <div style={{ padding: 12, background: "rgba(253,203,110,0.08)", borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: "#fdcb6e", fontSize: 13, marginBottom: 4 }}>📝 Prepare to Share</div>
              <div style={{ fontSize: 12, color: "#b2bec3", lineHeight: 1.6 }}>
                Be ready to share: your theme, the text prompt you used, what settings worked best, and what you would change next time.
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fd79a8", marginBottom: 4 }}>Hands-on Lab Exercise</h2>
      <p style={{ color: "#636e72", fontSize: 14, marginBottom: 16 }}>Follow these 6 steps to create your own AI video art (15 min)</p>

      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {labSteps.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: currentStep === i ? `1px solid ${s.color}` : "1px solid rgba(255,255,255,0.08)",
              background: currentStep === i ? s.color + "22" : "rgba(255,255,255,0.03)",
              color: currentStep === i ? s.color : "#636e72",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: currentStep === i ? 700 : 400,
            }}
          >
            {s.emoji} {i + 1}
          </button>
        ))}
      </div>

      <Card accent={labSteps[currentStep].color}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: labSteps[currentStep].color, fontSize: 18 }}>
            {labSteps[currentStep].emoji} {labSteps[currentStep].title}
          </div>
          <Tag color={labSteps[currentStep].color}>⏱️ {labSteps[currentStep].time}</Tag>
        </div>
        {labSteps[currentStep].content}
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: currentStep === 0 ? "#636e72" : "#b2bec3",
            cursor: currentStep === 0 ? "default" : "pointer",
            fontSize: 13,
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(labSteps.length - 1, currentStep + 1))}
          disabled={currentStep === labSteps.length - 1}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: `1px solid ${labSteps[Math.min(labSteps.length - 1, currentStep + 1)].color}55`,
            background: labSteps[Math.min(labSteps.length - 1, currentStep + 1)].color + "22",
            color: currentStep === labSteps.length - 1 ? "#636e72" : labSteps[currentStep + 1]?.color || "#b2bec3",
            cursor: currentStep === labSteps.length - 1 ? "default" : "pointer",
            fontSize: 13,
          }}
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}

function EthicsSection() {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fdcb6e", marginBottom: 4 }}>Best Practices & Ethics</h2>
      <p style={{ color: "#636e72", fontSize: 14, marginBottom: 16 }}>Tips, common mistakes, and responsible AI use (5 min)</p>

      <Card accent="#55efc4">
        <div style={{ fontWeight: 700, color: "#55efc4", marginBottom: 10, fontSize: 16 }}>✅ Best Practices</div>
        {[
          { tip: "Always iterate", desc: "Your first generation is rarely your best. Generate 3–5 variations and refine your prompt each time." },
          { tip: "Save your seeds", desc: "When you get a result you love, save the seed number! You can recreate it or make variations." },
          { tip: "Use consistent style words", desc: "Keep your image and video prompts stylistically aligned. If your image is 'oil painting,' your video motion should be 'painterly' too." },
          { tip: "Think about loops", desc: "For video art, plan for seamless loops from the start. Water, fire, clouds, and abstract patterns loop beautifully." },
          { tip: "Experiment boldly", desc: "The best AI art comes from unexpected combinations. Try 'underwater cathedral in the style of Van Gogh' — weird prompts often make amazing art!" },
        ].map((t, i) => (
          <div key={i} style={{ padding: 10, marginBottom: 6, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
            <span style={{ fontWeight: 700, color: "#55efc4", fontSize: 13 }}>{t.tip}:</span>
            <span style={{ fontSize: 13, color: "#b2bec3", marginLeft: 6 }}>{t.desc}</span>
          </div>
        ))}
      </Card>

      <Card accent="#d63031">
        <div style={{ fontWeight: 700, color: "#fab1a0", marginBottom: 10, fontSize: 16 }}>❌ Common Mistakes</div>
        {[
          { mistake: "Vague prompts", fix: "'A nice picture' → 'A serene alpine lake reflecting snow-capped mountains, golden hour, photorealistic'" },
          { mistake: "Too much motion", fix: "Start at 40–50% motion strength. High values cause melting/distortion." },
          { mistake: "Ignoring composition", fix: "Think about where the subject is, rule of thirds, leading lines — just like traditional photography." },
          { mistake: "Mixing too many styles", fix: "'Watercolor AND photorealistic AND pixel art' confuses the AI. Pick one primary style." },
          { mistake: "Not checking for artifacts", fix: "Always zoom in and look for extra fingers, distorted faces, weird text, or blurry patches before animating." },
        ].map((m, i) => (
          <div key={i} style={{ padding: 10, marginBottom: 6, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
            <div style={{ fontWeight: 700, color: "#fab1a0", fontSize: 13 }}>❌ {m.mistake}</div>
            <div style={{ fontSize: 12, color: "#55efc4", marginTop: 2 }}>✅ Fix: {m.fix}</div>
          </div>
        ))}
      </Card>

      <Card accent="#fdcb6e">
        <div style={{ fontWeight: 700, color: "#fdcb6e", marginBottom: 10, fontSize: 16 }}>⚖️ Responsible AI Art Use</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { title: "Always Disclose", desc: "Label AI-generated work as AI-assisted. Academic integrity requires transparency about your tools.", emoji: "🏷️" },
            { title: "Respect Copyright", desc: "Don't try to replicate copyrighted characters or specific artist styles for commercial use. Use AI as inspiration.", emoji: "©️" },
            { title: "Credit Your Tools", desc: "In your portfolio, mention which AI tools you used. It's a skill, not a shortcut — be proud of it!", emoji: "🙏" },
            { title: "Avoid Harmful Content", desc: "Never use AI to create deepfakes, non-consensual imagery, or content that could harm others.", emoji: "🛡️" },
            { title: "AI as Collaborator", desc: "Think of AI as a creative partner, not a replacement. Your artistic vision, curation, and editing skills matter more than ever.", emoji: "🤝" },
            { title: "Stay Informed", desc: "AI ethics and policies evolve quickly. Follow updates from your university and the art community about best practices.", emoji: "📚" },
          ].map((e, i) => (
            <div key={i} style={{ padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{e.emoji}</div>
              <div style={{ fontWeight: 700, color: "#fdcb6e", fontSize: 13, marginBottom: 3 }}>{e.title}</div>
              <div style={{ fontSize: 12, color: "#b2bec3", lineHeight: 1.5 }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card accent="#a29bfe">
        <div style={{ fontWeight: 700, color: "#a29bfe", marginBottom: 8, fontSize: 16 }}>🎓 Key Takeaways</div>
        <div style={{ color: "#dfe6e9", fontSize: 14, lineHeight: 1.8 }}>
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: "#e84393" }}>1.</strong> Diffusion models create images by removing noise step-by-step, guided by your text prompt.
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: "#6c5ce7" }}>2.</strong> Better prompts = better results. Be specific about subject, style, mood, and lighting.
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: "#00cec9" }}>3.</strong> Video AI predicts frames from your image + motion description. Keep motion simple at first.
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: "#fdcb6e" }}>4.</strong> Always iterate, experiment, and save what works. Art is a process!
          </div>
          <div>
            <strong style={{ color: "#55efc4" }}>5.</strong> Use AI responsibly — disclose, credit, and keep creating with your unique artistic voice.
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────
export default function ImageToVideoLecture() {
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(new Set([0]));

  const goTo = (idx) => {
    setActiveSection(idx);
    setProgress((prev) => new Set([...prev, idx]));
  };

  const sectionContent = [
    <WelcomeSection key={0} />,
    <Part1Section key={1} />,
    <Part2Section key={2} />,
    <FlowchartSection key={3} />,
    <LabSection key={4} />,
    <EthicsSection key={5} />,
  ];

  const sectionColors = ["#fdcb6e", "#e84393", "#a29bfe", "#55efc4", "#fd79a8", "#fdcb6e"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a1a",
        color: "#dfe6e9",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Top Progress Bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#0a0a1a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", height: 3 }}>
          {SECTIONS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: progress.has(i) ? sectionColors[i] : "rgba(255,255,255,0.05)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", padding: "8px 16px", gap: 4, overflowX: "auto" }}>
          {SECTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: activeSection === i ? `1px solid ${sectionColors[i]}` : "1px solid transparent",
                background: activeSection === i ? sectionColors[i] + "18" : "transparent",
                color: activeSection === i ? sectionColors[i] : "#636e72",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: activeSection === i ? 700 : 400,
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {progress.has(i) ? "✓ " : ""}{s}
              <span style={{ marginLeft: 4, opacity: 0.5, fontSize: 10 }}>{TIMING[i]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 20px 60px" }}>
        {sectionContent[activeSection]}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => goTo(Math.max(0, activeSection - 1))}
            disabled={activeSection === 0}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: activeSection === 0 ? "#2d3436" : "#b2bec3",
              cursor: activeSection === 0 ? "default" : "pointer",
              fontSize: 14,
            }}
          >
            ← Previous Section
          </button>
          <div style={{ fontSize: 12, color: "#636e72", alignSelf: "center" }}>
            {activeSection + 1} / {SECTIONS.length}
          </div>
          <button
            onClick={() => goTo(Math.min(SECTIONS.length - 1, activeSection + 1))}
            disabled={activeSection === SECTIONS.length - 1}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: `1px solid ${sectionColors[Math.min(SECTIONS.length - 1, activeSection + 1)]}44`,
              background: sectionColors[Math.min(SECTIONS.length - 1, activeSection + 1)] + "18",
              color: activeSection === SECTIONS.length - 1 ? "#2d3436" : sectionColors[activeSection + 1] || "#b2bec3",
              cursor: activeSection === SECTIONS.length - 1 ? "default" : "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Next Section →
          </button>
        </div>
      </div>
    </div>
  );
}
