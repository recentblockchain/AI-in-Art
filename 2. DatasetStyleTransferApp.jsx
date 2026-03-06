/**
 * Dataset Exploration + Style Transfer Companion
 * For art/media/design students working with Neural Style Transfer.
 * Self-contained React functional component — no external CSS or chart libs.
 * Autosaves to localStorage. Exports JSON summary.
 */

import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 0, emoji: "🎯", label: "Creative Goal" },
  { id: 1, emoji: "📁", label: "Curate Dataset" },
  { id: 2, emoji: "🔍", label: "Dataset Audit" },
  { id: 3, emoji: "🏷️", label: "Quick Tagging" },
  { id: 4, emoji: "📊", label: "Variety Check" },
  { id: 5, emoji: "⚖️", label: "Bias & Risk" },
  { id: 6, emoji: "🎨", label: "Style Transfer" },
  { id: 7, emoji: "🖼️", label: "Critique Prep" },
];

const BIAS_ITEMS = [
  { id: "selection",    text: "Selection Bias: Does your dataset over-represent one particular style, movement, or artist?" },
  { id: "representation", text: "Representation Bias: Are non-Western, marginalized, or underrepresented aesthetics fairly included?" },
  { id: "aesthetic",    text: "Aesthetic Bias: Do you unconsciously favor certain color palettes or compositional structures?" },
  { id: "technical",    text: "Technical Bias: Are image resolutions and quality levels reasonably consistent across sources?" },
  { id: "cultural",     text: "Cultural Bias: Could any image be culturally insensitive or constitute appropriation?" },
  { id: "gender",       text: "Gender Bias: Are gender representations balanced—or intentionally examined—in your selection?" },
  { id: "temporal",     text: "Temporal Bias: Is there an unintended skew toward a particular era or decade?" },
  { id: "source",       text: "Source Bias: Did the majority of images come from a single platform, archive, or curator?" },
  { id: "copyright",    text: "Copyright / IP: Have you verified licensing for all images in your dataset?" },
  { id: "diversity",    text: "Subject Diversity: Is there sufficient subject-matter variety for robust style learning?" },
  { id: "resolution",   text: "Resolution Consistency: Are image dimensions suitable for your chosen NST pipeline?" },
  { id: "personal",     text: "Personal Preference Bias: Are you critically aware of how your own taste shapes selections?" },
];

const TAG_OPTIONS = {
  subject: ["Portrait","Landscape","Still Life","Abstract","Architecture","Figure","Animal","Urban","Nature","Conceptual"],
  mood:    ["Joyful","Melancholy","Tense","Serene","Dramatic","Mysterious","Energetic","Nostalgic","Ethereal","Gritty"],
  palette: ["Warm","Cool","Monochrome","Pastel","Vibrant","Earthy","Neon","Muted","High-contrast","Neutral"],
  era:     ["Ancient","Renaissance","Baroque","Impressionist","Modernist","Contemporary","Digital","Retro","Art Deco","Minimalist"],
};

const CAT_COLORS = {
  subject: "#38bdf8",
  mood:    "#f472b6",
  palette: "#4ade80",
  era:     "#fb923c",
};

const NST_INSTRUCTIONS = `TF NEURAL STYLE TRANSFER — GOOGLE COLAB STEP-BY-STEP
══════════════════════════════════════════════════════

STEP 1 ▸ Open Colab
  • Visit: colab.research.google.com
  • File → New Notebook
  • (Or open the official TF tutorial):
    tensorflow.org/tutorials/generative/style_transfer

STEP 2 ▸ Set Runtime to GPU
  • Runtime → Change runtime type
  • Hardware accelerator → GPU (T4 recommended)
  • This dramatically reduces processing time.

STEP 3 ▸ Install Dependencies
  !pip install tensorflow tensorflow_hub pillow matplotlib

STEP 4 ▸ Import Libraries
  import tensorflow as tf
  import tensorflow_hub as hub
  import numpy as np
  from PIL import Image
  import matplotlib.pyplot as plt

STEP 5 ▸ Upload Your Images
  • Use the Files panel (folder icon, left sidebar)
  • Upload your content image (your "before" photo)
  • Upload your style image (from your curated dataset)
  • Recommended size: 512×512 px for fastest runs

STEP 6 ▸ Load & Preprocess
  def load_image(path, max_dim=512):
      img = tf.io.read_file(path)
      img = tf.image.decode_image(img, channels=3)
      img = tf.image.convert_image_dtype(img, tf.float32)
      shape = tf.cast(tf.shape(img)[:-1], tf.float32)
      scale = max_dim / max(shape)
      new_shape = tf.cast(shape * scale, tf.int32)
      return tf.image.resize(img, new_shape)[tf.newaxis]

STEP 7 ▸ Load TF Hub Model (Fast Method)
  hub_model = hub.load(
    'https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2'
  )
  stylized = hub_model(
    tf.constant(content_image),
    tf.constant(style_image)
  )[0]

STEP 8 ▸ OR Use Manual NST with Weights
  • content_weight: 1e3–1e4 (higher = preserve content more)
  • style_weight:   1e-2   (higher = stronger style transfer)
  • epochs: 10–50, steps_per_epoch: 100
  • Watch loss values converge — lower = better result

STEP 9 ▸ Save & Download Result
  result = tf.squeeze(stylized)
  tf.keras.utils.save_img('stylized_output.png', result)
  from google.colab import files
  files.download('stylized_output.png')

STEP 10 ▸ Iterate & Document
  • Try 3+ different style images from your dataset
  • Note parameter settings for each run
  • Screenshot loss curves for critique documentation
  • Compare side-by-side using plt.subplot()

──────────────────────────────────────────────────────
PRO TIPS
  → Texturally rich style images (impasto, crosshatch,
    mosaic) transfer most visibly.
  → Keep a "run log" — note weights + style image name
    for every experiment.
  → Higher resolution ≠ better for first iterations.
    Start small, scale up once params are tuned.
  → Save multiple stylized variants before critique.
──────────────────────────────────────────────────────`;

// ─── Styles (design tokens) ───────────────────────────────────────────────────

const T = {
  bg:       "#0c0b10",
  surface:  "#141219",
  raised:   "#1a1823",
  border:   "#252233",
  borderBr: "#302d42",
  accent:   "#a78bfa",
  accentDk: "#7c3aed",
  accentLt: "#c4b5fd",
  neon:     "#b8ff57",      // acid-green highlight
  text:     "#e4e0f0",
  muted:    "#6e6a82",
  dim:      "#3d3a50",
  danger:   "#f87171",
  success:  "#4ade80",
  warn:     "#fbbf24",
  info:     "#38bdf8",
};

const input = {
  width: "100%", boxSizing: "border-box",
  padding: "10px 14px", borderRadius: 10,
  border: `1px solid ${T.border}`,
  background: T.bg, color: T.text,
  fontSize: "0.875rem", outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

const card = {
  background: T.surface, borderRadius: 16,
  border: `1px solid ${T.border}`, padding: 24,
};

const btn = (variant = "primary") => ({
  padding: "10px 22px", borderRadius: 10,
  border: variant === "ghost" ? `1px solid ${T.borderBr}` : "none",
  background:
    variant === "primary" ? `linear-gradient(135deg, ${T.accentDk}, #4f46e5)` :
    variant === "neon"    ? T.neon :
    variant === "ghost"   ? "transparent" : T.raised,
  color:
    variant === "neon" ? "#0c0b10" :
    variant === "ghost" ? T.accent : "#fff",
  fontWeight: 700, fontSize: "0.85rem",
  cursor: "pointer", transition: "all 0.2s",
  fontFamily: "inherit",
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, required, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: T.accentLt, letterSpacing: "0.04em" }}>
        {label.toUpperCase()} {required && <span style={{ color: T.danger }}>*</span>}
      </label>
      {hint && <p style={{ margin: 0, fontSize: "0.75rem", color: T.muted }}>{hint}</p>}
      {children}
    </div>
  );
}

function Badge({ label, value, color = T.accent }) {
  return (
    <div style={{ padding: "12px 18px", borderRadius: 12, background: T.raised, border: `1px solid ${color}44`, textAlign: "center", minWidth: 90 }}>
      <div style={{ fontSize: "1.8rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.68rem", color: T.muted, marginTop: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function Nav({ onPrev, onNext, nextLabel = "Next →", nextDisabled }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
      {onPrev
        ? <button onClick={onPrev} style={btn("ghost")}>← Back</button>
        : <div />}
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          style={{ ...btn("primary"), opacity: nextDisabled ? 0.35 : 1, cursor: nextDisabled ? "not-allowed" : "pointer" }}
          aria-disabled={nextDisabled}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function DatasetStyleTransferApp() {
  const [step, setStep]   = useState(0);
  const [goal, setGoal]   = useState({ title: "", desc: "", inspo: "", medium: "" });
  const [images, setImages] = useState([]);           // {id, name, size, src}
  const [removed, setRemoved] = useState([]);          // array of ids
  const [tags, setTags]   = useState({});              // imageId → {subject:[],mood:[],palette:[],era:[]}
  const [bias, setBias]   = useState({});              // itemId → bool
  const [reflection, setReflection] = useState("");
  const [colab, setColab] = useState({ link: "", styleName: "" });
  const [critiqueNotes, setCritiqueNotes] = useState({}); // imageId → {changed:"",stayed:""}
  const [dragOn, setDragOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tagPage, setTagPage] = useState(0);          // pagination for tagging step
  const fileRef = useRef();

  // ── Autosave to localStorage ──
  useEffect(() => {
    const data = { step, goal, removed, tags, bias, reflection, colab, critiqueNotes };
    try { localStorage.setItem("nst_studio_v2", JSON.stringify(data)); } catch {}
  }, [step, goal, removed, tags, bias, reflection, colab, critiqueNotes]);

  // ── Restore on mount (text state only — images not persisted for size reasons) ──
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("nst_studio_v2") || "{}");
      if (s.goal)       setGoal(s.goal);
      if (s.removed)    setRemoved(s.removed);
      if (s.tags)       setTags(s.tags);
      if (s.bias)       setBias(s.bias);
      if (s.reflection) setReflection(s.reflection);
      if (s.colab)      setColab(s.colab);
      if (s.critiqueNotes) setCritiqueNotes(s.critiqueNotes);
      if (typeof s.step === "number") setStep(s.step);
    } catch {}
  }, []);

  // ── Derived state ──
  const activeImages = useMemo(() => images.filter(i => !removed.includes(i.id)), [images, removed]);

  // Duplicate detection by filename + size
  const dupeIds = useMemo(() => {
    const seen = {};
    const dupes = new Set();
    images.forEach(img => {
      const key = `${img.name}__${img.size}`;
      if (seen[key]) dupes.add(img.id);
      else seen[key] = img.id;
    });
    return dupes;
  }, [images]);

  // Tag distribution across active images
  const tagDist = useMemo(() => {
    const d = { subject: {}, mood: {}, palette: {}, era: {} };
    activeImages.forEach(img => {
      const t = tags[img.id] || {};
      Object.keys(d).forEach(cat => {
        (t[cat] || []).forEach(v => { d[cat][v] = (d[cat][v] || 0) + 1; });
      });
    });
    return d;
  }, [activeImages, tags]);

  // ── File handling ──
  const addFiles = useCallback((files) => {
    const ok = ["image/jpeg","image/png","image/webp","image/gif","image/avif"];
    Array.from(files).forEach(f => {
      if (!ok.includes(f.type)) return;
      const id = `${f.name}_${f.size}_${Math.random().toString(36).slice(2)}`;
      const reader = new FileReader();
      reader.onload = e => setImages(prev => [...prev, { id, name: f.name, size: f.size, src: e.target.result }]);
      reader.readAsDataURL(f);
    });
  }, []);

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragOn(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  // ── Tag toggle ──
  const toggleTag = (imgId, cat, val) => {
    setTags(prev => {
      const cur = (prev[imgId] || {})[cat] || [];
      const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
      return { ...prev, [imgId]: { ...(prev[imgId] || {}), [cat]: next } };
    });
  };

  // ── Export ──
  const exportSummary = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      creativeGoal: goal,
      datasetStats: {
        totalUploaded: images.length,
        activeImages: activeImages.length,
        removed: removed.length,
        duplicatesFound: dupeIds.size,
        imageNames: activeImages.map(i => i.name),
      },
      tagDistributions: tagDist,
      biasChecklist: BIAS_ITEMS.map(it => ({ item: it.text, reviewed: !!bias[it.id] })),
      reflection,
      styleTransfer: colab,
      critiquePrep: activeImages.map(img => ({
        name: img.name,
        tags: tags[img.id] || {},
        notes: critiqueNotes[img.id] || {},
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "nst_dataset_summary.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const copyInstructions = () => {
    navigator.clipboard.writeText(NST_INSTRUCTIONS).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2200);
    });
  };

  // Word count helper
  const wordCount = str => str.split(/\s+/).filter(Boolean).length;

  // Tags-per-page (show 8 images at a time in tagging step)
  const PAGE_SIZE = 8;
  const tagPages = Math.ceil(activeImages.length / PAGE_SIZE);
  const taggedImages = activeImages.slice(tagPage * PAGE_SIZE, (tagPage + 1) * PAGE_SIZE);

  // Progress
  const progressPct = Math.round((step / (STEPS.length - 1)) * 100);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", fontSize: "15px" }}>

      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(180deg, #110e1a 0%, ${T.bg} 100%)`,
        borderBottom: `1px solid ${T.border}`,
        padding: "0 24px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 8, height: 36, borderRadius: 4, background: `linear-gradient(180deg, ${T.neon}, ${T.accentDk})` }} />
            <div>
              <h1 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em", color: T.text }}>
                Dataset Studio
              </h1>
              <p style={{ margin: 0, fontSize: "0.68rem", color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Style Transfer Companion · Autosaved
              </p>
            </div>
          </div>
          <button onClick={exportSummary} style={{ ...btn("neon"), display: "flex", alignItems: "center", gap: 8, padding: "8px 18px" }}>
            <span>↓</span> Export Summary
          </button>
        </div>
      </header>

      {/* ── Step nav ── */}
      <nav aria-label="Workflow steps" style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, overflowX: "auto" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", padding: "0 24px", minWidth: 720 }}>
          {STEPS.map(s => {
            const active = s.id === step;
            const done   = s.id < step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                aria-current={active ? "step" : undefined}
                style={{
                  flex: 1, padding: "14px 6px",
                  border: "none",
                  borderBottom: active ? `2px solid ${T.neon}` : `2px solid transparent`,
                  background: "transparent",
                  color: active ? T.neon : done ? T.accent : T.dim,
                  cursor: "pointer", fontSize: "0.7rem", fontWeight: 700,
                  letterSpacing: "0.03em", textTransform: "uppercase",
                  transition: "all 0.2s", fontFamily: "inherit",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}
              >
                <span style={{ fontSize: "1rem" }}>{s.emoji}</span>
                <span style={{ whiteSpace: "nowrap" }}>{s.label}</span>
                {done && <span style={{ fontSize: "0.55rem", color: T.success }}>✓</span>}
              </button>
            );
          })}
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, background: T.border }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg, ${T.accentDk}, ${T.neon})`, transition: "width 0.4s ease" }} />
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "36px 24px 80px" }} role="main">

        {/* ────────── STEP 0: Creative Goal ────────── */}
        {step === 0 && (
          <section aria-labelledby="s0-title">
            <StepHead id="s0-title" title="Define Your Creative Goal" sub="Articulate your intent before shaping your dataset — clarity here guides every decision downstream." />
            <div style={{ display: "grid", gap: 20 }}>
              <Field label="Project Title" required>
                <input value={goal.title} onChange={e => setGoal(g => ({...g, title: e.target.value}))}
                  placeholder="e.g., Expressionist Street Photography Series"
                  style={input} aria-required="true" />
              </Field>
              <Field label="Creative Description" required hint="What visual language, concept, or emotional register are you exploring?">
                <textarea value={goal.desc} onChange={e => setGoal(g => ({...g, desc: e.target.value}))}
                  placeholder="Describe your intent in 2–4 sentences. What do you want the final stylized images to feel like?"
                  rows={4} style={{...input, resize:"vertical"}} aria-required="true" />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Field label="Key Inspirations & References" hint="Artists, movements, films, or specific works.">
                  <textarea value={goal.inspo} onChange={e => setGoal(g => ({...g, inspo: e.target.value}))}
                    placeholder="e.g., Egon Schiele, German Expressionism, Wong Kar-wai..." rows={3}
                    style={{...input, resize:"vertical"}} />
                </Field>
                <Field label="Target Medium / Output Format" hint="Where will the final work be seen?">
                  <textarea value={goal.medium} onChange={e => setGoal(g => ({...g, medium: e.target.value}))}
                    placeholder="e.g., Large-format digital print, Instagram editorial series, projected installation..."
                    rows={3} style={{...input, resize:"vertical"}} />
                </Field>
              </div>
            </div>
            <Nav onNext={() => setStep(1)} nextDisabled={!goal.title.trim() || !goal.desc.trim()} />
          </section>
        )}

        {/* ────────── STEP 1: Curate Dataset ────────── */}
        {step === 1 && (
          <section aria-labelledby="s1-title">
            <StepHead id="s1-title" title="Curate Your Dataset" sub="Upload 50–100 images that represent the visual style you want to transfer. Quality and diversity both matter." />

            {/* Drop zone */}
            <div
              role="button" tabIndex={0} aria-label="Upload images by clicking or dragging and dropping"
              onClick={() => fileRef.current?.click()}
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragOn(true); }}
              onDragLeave={() => setDragOn(false)}
              style={{
                border: `2px dashed ${dragOn ? T.neon : T.borderBr}`,
                borderRadius: 20, padding: "52px 24px", textAlign: "center",
                background: dragOn ? "rgba(184,255,87,0.05)" : T.surface,
                cursor: "pointer", transition: "all 0.2s", marginBottom: 20,
              }}
            >
              <div style={{ fontSize: "3.2rem", marginBottom: 12 }}>🖼️</div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: "1rem", color: dragOn ? T.neon : T.accentLt }}>
                {dragOn ? "Drop to add images" : "Click or drag & drop images"}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: "0.78rem", color: T.muted }}>
                JPEG · PNG · WebP · GIF · AVIF — multiple files accepted
              </p>
              <input ref={fileRef} type="file" multiple accept="image/*"
                onChange={e => addFiles(e.target.files)} style={{ display: "none" }}
                aria-hidden="true" />
            </div>

            {/* Count feedback */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
              <Badge label="Uploaded" value={images.length}
                color={images.length >= 50 && images.length <= 100 ? T.success : images.length === 0 ? T.muted : T.danger} />
              {images.length > 0 && images.length < 50 && (
                <Notice type="warn">⚠️ Add at least {50 - images.length} more images for a robust dataset (minimum 50).</Notice>
              )}
              {images.length > 100 && (
                <Notice type="warn">⚠️ {images.length - 100} images over the recommended 100 limit. Consider pruning in the Audit step.</Notice>
              )}
              {images.length >= 50 && images.length <= 100 && (
                <Notice type="success">✓ Dataset size is within the ideal range (50–100).</Notice>
              )}
            </div>

            {/* Thumbnail grid preview */}
            {images.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 6 }}>
                {images.slice(0, 24).map(img => (
                  <div key={img.id} style={{ paddingBottom: "100%", position: "relative", borderRadius: 8, overflow: "hidden", background: T.raised }}>
                    <img src={img.src} alt={img.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
                  </div>
                ))}
                {images.length > 24 && (
                  <div style={{ paddingBottom:"100%", position:"relative", borderRadius:8, background:T.raised }}>
                    <div style={{ position:"absolute", inset:0, display:"grid", placeItems:"center", color:T.muted, fontWeight:800 }}>
                      +{images.length - 24}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Nav onPrev={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={images.length < 1} />
          </section>
        )}

        {/* ────────── STEP 2: Dataset Audit ────────── */}
        {step === 2 && (
          <section aria-labelledby="s2-title">
            <StepHead id="s2-title" title="Dataset Audit" sub="Remove duplicates and unwanted images to improve dataset quality before tagging." />

            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              <Badge label="Total"      value={images.length}       color={T.accent} />
              <Badge label="Active"     value={activeImages.length} color={T.success} />
              <Badge label="Removed"    value={removed.length}      color={T.danger} />
              <Badge label="Duplicates" value={dupeIds.size}        color={T.warn} />
            </div>

            {dupeIds.size > 0 && (
              <div style={{ ...card, background: "#1a1100", border: `1px solid ${T.warn}55`, marginBottom: 20 }}>
                <p style={{ margin: "0 0 6px", fontWeight: 700, color: T.warn }}>⚠️ {dupeIds.size} potential duplicate{dupeIds.size > 1 ? "s" : ""} detected (same filename + size)</p>
                <p style={{ margin: "0 0 12px", fontSize: "0.8rem", color: "#d97706" }}>Duplicates are highlighted with an amber border below. Consider removing them to improve variety.</p>
                <button onClick={() => setRemoved(p => [...new Set([...p, ...dupeIds])])}
                  style={{ ...btn("ghost"), fontSize: "0.78rem", borderColor: T.warn, color: T.warn }}>
                  Remove All Duplicates
                </button>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
              {images.map(img => {
                const isRemoved = removed.includes(img.id);
                const isDupe    = dupeIds.has(img.id);
                return (
                  <div key={img.id} style={{
                    borderRadius: 14, overflow: "hidden", background: T.surface,
                    border: `2px solid ${isDupe ? T.warn : isRemoved ? T.danger + "77" : T.border}`,
                    opacity: isRemoved ? 0.38 : 1, transition: "all 0.2s",
                  }}>
                    <div style={{ position: "relative", paddingBottom: "70%" }}>
                      <img src={img.src} alt={img.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
                      {isDupe && <span style={{ position:"absolute", top:6, right:6, background:T.warn, color:"#000", fontSize:"0.58rem", padding:"2px 7px", borderRadius:4, fontWeight:800, letterSpacing:"0.05em" }}>DUPE</span>}
                    </div>
                    <div style={{ padding: "8px 10px" }}>
                      <p style={{ margin:"0 0 7px", fontSize:"0.63rem", color:T.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={img.name}>{img.name}</p>
                      <button
                        onClick={() => setRemoved(p => isRemoved ? p.filter(id => id !== img.id) : [...p, img.id])}
                        aria-label={isRemoved ? `Restore ${img.name}` : `Remove ${img.name}`}
                        style={{
                          width: "100%", padding: "5px 0", borderRadius: 7, border: "none",
                          background: isRemoved ? "#052e16" : "#3f0a0a",
                          color: isRemoved ? T.success : T.danger,
                          cursor: "pointer", fontSize: "0.7rem", fontWeight: 700, fontFamily: "inherit",
                        }}
                      >
                        {isRemoved ? "↩ Restore" : "✕ Remove"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Nav onPrev={() => setStep(1)} onNext={() => setStep(3)} />
          </section>
        )}

        {/* ────────── STEP 3: Quick Tagging ────────── */}
        {step === 3 && (
          <section aria-labelledby="s3-title">
            <StepHead id="s3-title" title="Quick Tagging" sub="Assign subject, mood, palette, and era tags to each image. These drive the distribution analysis in the next step." />

            {/* Live count chips */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
              {Object.entries(tagDist).map(([cat, dist]) => {
                const sorted = Object.entries(dist).sort((a,b) => b[1]-a[1]);
                return (
                  <div key={cat} style={{...card, padding: 16}}>
                    <p style={{ margin:"0 0 10px", fontWeight:800, fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:"0.08em", color: CAT_COLORS[cat] }}>{cat}</p>
                    {sorted.length === 0
                      ? <p style={{ margin:0, fontSize:"0.72rem", color:T.dim }}>No tags yet</p>
                      : sorted.slice(0,5).map(([tag, n]) => (
                          <div key={tag} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.73rem", marginBottom:4 }}>
                            <span style={{ color:T.text }}>{tag}</span>
                            <span style={{ fontWeight:800, color: CAT_COLORS[cat] }}>{n}</span>
                          </div>
                        ))
                    }
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {activeImages.length === 0 && (
              <Notice type="warn">No active images. Go back to add and activate images first.</Notice>
            )}

            {tagPages > 1 && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <span style={{ fontSize:"0.78rem", color:T.muted }}>Showing {tagPage * PAGE_SIZE + 1}–{Math.min((tagPage+1)*PAGE_SIZE, activeImages.length)} of {activeImages.length} images</span>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => setTagPage(p => Math.max(0, p-1))} disabled={tagPage === 0}
                    style={{ ...btn("ghost"), padding:"6px 14px", opacity: tagPage===0 ? 0.3:1, fontSize:"0.78rem" }}>‹ Prev</button>
                  <button onClick={() => setTagPage(p => Math.min(tagPages-1, p+1))} disabled={tagPage === tagPages-1}
                    style={{ ...btn("ghost"), padding:"6px 14px", opacity: tagPage===tagPages-1 ? 0.3:1, fontSize:"0.78rem" }}>Next ›</button>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gap: 14 }}>
              {taggedImages.map(img => {
                const imgTags = tags[img.id] || {};
                return (
                  <div key={img.id} style={{ display:"grid", gridTemplateColumns:"96px 1fr", gap:18, ...card, padding:16, alignItems:"start" }}>
                    <img src={img.src} alt={img.name} style={{ width:"100%", aspectRatio:"1", objectFit:"cover", borderRadius:10 }} />
                    <div>
                      <p style={{ margin:"0 0 12px", fontSize:"0.75rem", color:T.muted, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{img.name}</p>
                      {Object.entries(TAG_OPTIONS).map(([cat, opts]) => (
                        <div key={cat} style={{ marginBottom: 10 }}>
                          <p style={{ margin:"0 0 5px", fontSize:"0.65rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", color: CAT_COLORS[cat] }}>{cat}</p>
                          <div role="group" aria-label={`${cat} tags for ${img.name}`} style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                            {opts.map(opt => {
                              const active = (imgTags[cat] || []).includes(opt);
                              return (
                                <button key={opt} onClick={() => toggleTag(img.id, cat, opt)}
                                  aria-pressed={active}
                                  style={{
                                    padding:"3px 11px", borderRadius:20, fontSize:"0.68rem", fontFamily:"inherit",
                                    border:`1px solid ${active ? CAT_COLORS[cat] : T.dim}`,
                                    background: active ? CAT_COLORS[cat] + "30" : "transparent",
                                    color: active ? CAT_COLORS[cat] : T.muted,
                                    cursor:"pointer", fontWeight: active ? 700 : 400, transition:"all 0.15s",
                                  }}>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <Nav onPrev={() => setStep(2)} onNext={() => setStep(4)} />
          </section>
        )}

        {/* ────────── STEP 4: Variety Check ────────── */}
        {step === 4 && (
          <section aria-labelledby="s4-title">
            <StepHead id="s4-title" title="Variety Check" sub="Review tag distributions to spot imbalances before you proceed to bias analysis." />

            {Object.entries(tagDist).map(([cat, dist]) => {
              const sorted  = Object.entries(dist).sort((a,b) => b[1]-a[1]);
              const total   = Object.values(dist).reduce((a,b)=>a+b, 0);
              const maxVal  = sorted[0]?.[1] || 1;
              const topPct  = total > 0 ? sorted[0]?.[1] / total : 0;
              const col     = CAT_COLORS[cat];
              return (
                <div key={cat} style={{ ...card, marginBottom: 20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
                    <h3 style={{ margin:0, fontSize:"0.95rem", fontWeight:800, textTransform:"capitalize", color:col }}>{cat}</h3>
                    <span style={{ fontSize:"0.72rem", color:T.muted }}>
                      {total} assignment{total!==1?"s":""} · {Object.keys(dist).length} unique values · {activeImages.length} images
                    </span>
                  </div>
                  {sorted.length === 0 ? (
                    <p style={{ color:T.dim, fontSize:"0.8rem", margin:0 }}>No tags assigned yet for this category.</p>
                  ) : (
                    <div style={{ display:"grid", gap:7 }}>
                      {sorted.map(([tag, n]) => {
                        const pct = Math.round((n / maxVal) * 100);
                        const ofTotal = Math.round((n / activeImages.length) * 100);
                        return (
                          <div key={tag} style={{ display:"grid", gridTemplateColumns:"120px 1fr 48px", gap:10, alignItems:"center" }}>
                            <span style={{ fontSize:"0.75rem", color:T.text, textAlign:"right", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{tag}</span>
                            <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
                              aria-label={`${tag} ${pct}%`}
                              style={{ height:22, background:T.raised, borderRadius:5, overflow:"hidden" }}>
                              <div style={{
                                height:"100%", width:`${pct}%`,
                                background:`linear-gradient(90deg, ${col}88, ${col})`,
                                borderRadius:5, transition:"width 0.6s ease",
                                display:"flex", alignItems:"center", paddingLeft:8,
                              }}>
                                <span style={{ fontSize:"0.62rem", color:"#fff", fontWeight:800, whiteSpace:"nowrap" }}>
                                  {ofTotal}% of images
                                </span>
                              </div>
                            </div>
                            <span style={{ fontSize:"0.78rem", fontWeight:800, color:col }}>{n}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {topPct > 0.6 && (
                    <div style={{ marginTop:14, padding:"10px 14px", borderRadius:10, background:"#1a1100", border:`1px solid ${T.warn}66`, fontSize:"0.75rem", color:T.warn }}>
                      ⚠️ "{sorted[0][0]}" accounts for {Math.round(topPct*100)}% of {cat} tags — consider diversifying for richer style transfer.
                    </div>
                  )}
                </div>
              );
            })}

            {/* Summary table */}
            <div style={card}>
              <h3 style={{ margin:"0 0 14px", fontSize:"0.85rem", fontWeight:800, color:T.accentLt, textTransform:"uppercase", letterSpacing:"0.06em" }}>Distribution Summary</h3>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.8rem" }} aria-label="Tag distribution summary">
                  <thead>
                    <tr>
                      {["Category","Unique Values","Total Tags","Top Tag","Coverage"].map(h => (
                        <th key={h} style={{ textAlign:"left", padding:"8px 14px", borderBottom:`1px solid ${T.border}`, color:T.muted, fontWeight:700, fontSize:"0.72rem", letterSpacing:"0.04em", textTransform:"uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(tagDist).map(([cat, dist]) => {
                      const sorted = Object.entries(dist).sort((a,b)=>b[1]-a[1]);
                      const total = Object.values(dist).reduce((a,b)=>a+b,0);
                      return (
                        <tr key={cat}>
                          <td style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}99`, color:CAT_COLORS[cat], fontWeight:800, textTransform:"capitalize" }}>{cat}</td>
                          <td style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}99`, color:T.text }}>{Object.keys(dist).length}</td>
                          <td style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}99`, color:T.text }}>{total}</td>
                          <td style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}99`, color:T.accentLt }}>{sorted[0] ? `${sorted[0][0]} (${sorted[0][1]})` : "—"}</td>
                          <td style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}99`, color:total > 0 ? T.success : T.dim }}>
                            {activeImages.length > 0 ? `${Math.round((Object.keys(dist).length / TAG_OPTIONS[cat].length)*100)}%` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <Nav onPrev={() => setStep(3)} onNext={() => setStep(5)} />
          </section>
        )}

        {/* ────────── STEP 5: Bias & Risk ────────── */}
        {step === 5 && (
          <section aria-labelledby="s5-title">
            <StepHead id="s5-title" title="Bias & Risk Check" sub="Every dataset reflects the choices of its curator. Examine your selection critically before proceeding." />

            <div style={{ padding:16, borderRadius:12, background:"#0a111f", border:`1px solid ${T.info}44`, marginBottom:24, fontSize:"0.83rem", color:"#93c5fd", lineHeight:1.65 }}>
              <strong>Why this matters:</strong> Neural Style Transfer amplifies the biases embedded in your dataset. Understanding those biases doesn't require perfection — it requires intentionality. The goal is awareness, not paralysis.
            </div>

            {/* Checklist */}
            <fieldset style={{ border:"none", margin:0, padding:0, marginBottom:28 }}>
              <legend style={{ display:"none" }}>Bias checklist</legend>
              <div style={{ display:"grid", gap:8 }}>
                {BIAS_ITEMS.map((item, i) => (
                  <label key={item.id} style={{
                    display:"flex", gap:14, padding:"14px 16px", borderRadius:12, cursor:"pointer",
                    background: bias[item.id] ? "rgba(167,139,250,0.08)" : T.surface,
                    border:`1px solid ${bias[item.id] ? T.accent + "88" : T.border}`,
                    transition:"all 0.2s", alignItems:"flex-start",
                  }}>
                    <input type="checkbox" checked={!!bias[item.id]}
                      onChange={e => setBias(p => ({...p, [item.id]: e.target.checked}))}
                      style={{ marginTop:2, width:16, height:16, accentColor:T.accent, flexShrink:0 }} />
                    <div>
                      <span style={{ fontSize:"0.65rem", fontWeight:800, color:T.accent, letterSpacing:"0.06em", display:"block", marginBottom:3 }}>#{i+1}</span>
                      <span style={{ fontSize:"0.84rem", color:T.text, lineHeight:1.55 }}>{item.text}</span>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Reflection */}
            <div style={card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                <label htmlFor="reflection" style={{ fontWeight:800, fontSize:"0.85rem", color:T.accentLt }}>
                  Critical Reflection <span style={{ color:T.danger }}>*</span>
                </label>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <span style={{ fontSize:"0.72rem", color: Object.values(bias).filter(Boolean).length === BIAS_ITEMS.length ? T.success : T.muted }}>
                    {Object.values(bias).filter(Boolean).length}/{BIAS_ITEMS.length} items reviewed
                  </span>
                  <span style={{ fontSize:"0.72rem", color: wordCount(reflection) >= 100 ? T.success : T.muted }}>
                    {wordCount(reflection)} words {wordCount(reflection) < 100 ? `(${100 - wordCount(reflection)} to minimum)` : "✓"}
                  </span>
                </div>
              </div>
              <p style={{ margin:"0 0 12px", fontSize:"0.78rem", color:T.muted, lineHeight:1.6 }}>
                Write 100–300 words: What biases did you find? What choices were conscious vs. unconscious? How might these shape your style transfer outputs?
              </p>
              <textarea id="reflection" value={reflection} onChange={e => setReflection(e.target.value)}
                placeholder="I noticed that my dataset primarily features... The choices I made consciously include... An unintended skew I found was... The potential impact on my style transfer is..."
                rows={8} style={{...input, resize:"vertical"}} aria-required="true" />
            </div>

            <Nav onPrev={() => setStep(4)} onNext={() => setStep(6)} nextDisabled={reflection.trim().length < 30} />
          </section>
        )}

        {/* ────────── STEP 6: Style Transfer ────────── */}
        {step === 6 && (
          <section aria-labelledby="s6-title">
            <StepHead id="s6-title" title="Style Transfer Activity" sub="Run Neural Style Transfer in Google Colab using the instructions below. Document your setup details here." />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              <Field label="Your Google Colab Link" hint="Paste the shareable link to your notebook.">
                <input value={colab.link} onChange={e => setColab(c => ({...c, link:e.target.value}))}
                  placeholder="https://colab.research.google.com/drive/..." style={input} />
              </Field>
              <Field label="Chosen Style Image Filename" hint="Which image from your dataset are you using as the style source?">
                <input value={colab.styleName} onChange={e => setColab(c => ({...c, styleName:e.target.value}))}
                  placeholder="e.g., kirchner_street_berlin_1913.jpg" style={input} />
              </Field>
            </div>

            {/* Instructions panel */}
            <div style={{ borderRadius:16, background:"#09080f", border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px", background:T.surface, borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontWeight:800, fontSize:"0.82rem", color:T.accentLt, letterSpacing:"0.04em", textTransform:"uppercase" }}>Colab Instructions</span>
                <button onClick={copyInstructions}
                  style={{ ...btn("neon"), padding:"6px 18px", fontSize:"0.75rem", background: copied ? T.success : T.neon, color: copied ? "#fff" : "#0c0b10" }}>
                  {copied ? "✓ Copied!" : "Copy Instructions"}
                </button>
              </div>
              <pre style={{ margin:0, padding:24, fontSize:"0.75rem", lineHeight:1.75, color:"#b8c8d8", overflowX:"auto", whiteSpace:"pre-wrap", fontFamily:"'Fira Code', 'JetBrains Mono', 'Consolas', monospace" }}>
                {NST_INSTRUCTIONS}
              </pre>
            </div>

            {/* Quick links */}
            <div style={{ ...card, background:"#051a0e", border:`1px solid ${T.success}44` }}>
              <p style={{ margin:"0 0 10px", fontWeight:800, fontSize:"0.8rem", color:T.success }}>📎 Resource Links</p>
              <div style={{ display:"grid", gap:6 }}>
                {[
                  ["TensorFlow Official NST Tutorial", "https://www.tensorflow.org/tutorials/generative/style_transfer"],
                  ["TF Hub: Arbitrary Image Stylization (faster)", "https://www.tensorflow.org/hub/tutorials/tf2_arbitrary_image_stylization"],
                  ["Google Colab", "https://colab.research.google.com"],
                  ["Magenta NST Examples", "https://magenta.tensorflow.org/blog/2017/07/12/style-transfer-part-1/"],
                ].map(([label, url]) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                    style={{ color:"#4ade80", fontSize:"0.8rem", textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                    <span>→</span> {label}
                  </a>
                ))}
              </div>
            </div>

            <Nav onPrev={() => setStep(5)} onNext={() => setStep(7)} />
          </section>
        )}

        {/* ────────── STEP 7: Critique Prep ────────── */}
        {step === 7 && (
          <section aria-labelledby="s7-title">
            <StepHead id="s7-title" title="Critique Prep — Gallery Plan" sub="Document before/after observations for each image. These become your talking points during class critique." />

            <div style={{ padding:16, borderRadius:12, background:"#0a111f", border:`1px solid ${T.info}44`, marginBottom:28, fontSize:"0.82rem", color:"#93c5fd", lineHeight:1.65 }}>
              For each content image you ran through your NST pipeline, document what visual properties changed and what remained consistent. This builds your analytical vocabulary for critique.
            </div>

            {activeImages.length === 0 && (
              <Notice type="warn">No active images in your dataset. Return to the Audit step to restore images.</Notice>
            )}

            <div style={{ display:"grid", gap:24 }}>
              {activeImages.map(img => {
                const notes = critiqueNotes[img.id] || {};
                const imgTagList = Object.entries(tags[img.id] || {})
                  .flatMap(([cat, vals]) => vals.map(v => ({ cat, v })));
                return (
                  <article key={img.id} aria-label={`Critique card for ${img.name}`}
                    style={{ ...card, padding:0, overflow:"hidden" }}>
                    <div style={{ padding:"12px 18px", background:T.raised, borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                      <p style={{ margin:0, fontWeight:700, fontSize:"0.82rem", color:T.accentLt }}>{img.name}</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                        {imgTagList.map(({cat, v}) => (
                          <span key={`${cat}-${v}`} style={{ fontSize:"0.63rem", padding:"2px 9px", borderRadius:20, background:CAT_COLORS[cat]+"22", color:CAT_COLORS[cat], fontWeight:700 }}>{v}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:0 }}>
                      {/* Before */}
                      <div style={{ padding:18, borderRight:`1px solid ${T.border}` }}>
                        <p style={{ margin:"0 0 10px", fontSize:"0.7rem", fontWeight:800, letterSpacing:"0.06em", textTransform:"uppercase", color:T.muted }}>Before (Content)</p>
                        <div style={{ borderRadius:12, overflow:"hidden", background:T.raised }}>
                          <img src={img.src} alt={`Before: ${img.name}`} style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", display:"block" }} />
                        </div>
                      </div>

                      {/* After placeholder */}
                      <div style={{ padding:18, borderRight:`1px solid ${T.border}` }}>
                        <p style={{ margin:"0 0 10px", fontSize:"0.7rem", fontWeight:800, letterSpacing:"0.06em", textTransform:"uppercase", color:T.muted }}>After (Stylized)</p>
                        <div style={{ borderRadius:12, background:T.raised, border:`2px dashed ${T.dim}`, aspectRatio:"4/3", display:"grid", placeItems:"center" }}>
                          <div style={{ textAlign:"center", color:T.dim, padding:16 }}>
                            <div style={{ fontSize:"2rem", marginBottom:8 }}>🎨</div>
                            <p style={{ margin:0, fontSize:"0.7rem", lineHeight:1.5 }}>Upload your Colab<br/>output here after running</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, borderTop:`1px solid ${T.border}` }}>
                      <div style={{ padding:18, borderRight:`1px solid ${T.border}` }}>
                        <label htmlFor={`changed-${img.id}`} style={{ display:"block", marginBottom:8, fontSize:"0.72rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", color:"#f472b6" }}>
                          What Changed?
                        </label>
                        <textarea id={`changed-${img.id}`} value={notes.changed||""} rows={3}
                          onChange={e => setCritiqueNotes(p => ({...p, [img.id]: {...(p[img.id]||{}), changed: e.target.value}}))}
                          placeholder="Color palette, texture, brushwork, edge quality, surface treatment, mood, contrast..."
                          style={{...input, fontSize:"0.8rem", resize:"vertical"}} />
                      </div>
                      <div style={{ padding:18 }}>
                        <label htmlFor={`stayed-${img.id}`} style={{ display:"block", marginBottom:8, fontSize:"0.72rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", color:"#38bdf8" }}>
                          What Stayed Consistent?
                        </label>
                        <textarea id={`stayed-${img.id}`} value={notes.stayed||""} rows={3}
                          onChange={e => setCritiqueNotes(p => ({...p, [img.id]: {...(p[img.id]||{}), stayed: e.target.value}}))}
                          placeholder="Composition, subject identity, spatial relationships, depth cues, focal point..."
                          style={{...input, fontSize:"0.8rem", resize:"vertical"}} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Final summary panel */}
            <div style={{ marginTop:40, padding:28, borderRadius:20, background:`linear-gradient(135deg, #120823, #0a1828)`, border:`1px solid ${T.accent}55` }}>
              <h3 style={{ margin:"0 0 18px", color:T.neon, fontSize:"1.05rem", fontWeight:800 }}>🎓 Critique Readiness Summary</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:12, marginBottom:24 }}>
                <Badge label="Active Images"  value={activeImages.length} color={T.accent} />
                <Badge label="Bias Items Reviewed" value={Object.values(bias).filter(Boolean).length} color="#f472b6" />
                <Badge label="Tagged Images"  value={Object.keys(tags).filter(id => activeImages.find(i => i.id === id)).length} color={T.success} />
                <Badge label="Notes Added"    value={Object.keys(critiqueNotes).filter(id => (critiqueNotes[id]?.changed || critiqueNotes[id]?.stayed)).length} color={T.warn} />
                <Badge label="Reflection Words" value={wordCount(reflection)} color={T.info} />
              </div>
              <button onClick={exportSummary} style={{ ...btn("neon"), width:"100%", padding:"14px 0", fontSize:"0.95rem", display:"flex", justifyContent:"center", gap:8 }}>
                <span>📄</span> Export Complete Summary (JSON)
              </button>
              <p style={{ margin:"12px 0 0", fontSize:"0.75rem", color:T.muted, textAlign:"center" }}>
                Exports creative goal · dataset stats · tag distributions · bias checklist · reflection · style transfer config · critique notes
              </p>
            </div>

            <Nav onPrev={() => setStep(6)} />
          </section>
        )}

      </main>
    </div>
  );
}

// ─── Shared sub-components ─────────────────────────────────────────────────────

function StepHead({ id, title, sub }) {
  return (
    <header style={{ marginBottom: 28 }}>
      <h2 id={id} style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", color: T.text }}>
        {title}
      </h2>
      <p style={{ margin: 0, color: T.muted, fontSize: "0.88rem", lineHeight: 1.6 }}>{sub}</p>
    </header>
  );
}

function Notice({ type = "info", children }) {
  const colors = {
    warn:    { bg: "#1a1100", border: T.warn + "55",    text: "#fcd34d" },
    success: { bg: "#051a0e", border: T.success + "55", text: "#86efac" },
    info:    { bg: "#0a111f", border: T.info + "55",    text: "#93c5fd" },
    danger:  { bg: "#1a0505", border: T.danger + "55",  text: "#fca5a5" },
  };
  const c = colors[type] || colors.info;
  return (
    <div style={{ flex:1, padding:"10px 16px", borderRadius:10, background:c.bg, border:`1px solid ${c.border}`, fontSize:"0.8rem", color:c.text, lineHeight:1.55 }}>
      {children}
    </div>
  );
}
