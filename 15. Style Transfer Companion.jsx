// Dataset Exploration + Style Transfer Companion
// Art/Media/Design Students — Interactive In-Class Tool
// Self-contained React JSX, no external CSS or chart libraries

import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 0, label: "Goal",        icon: "✦" },
  { id: 1, label: "Curate",      icon: "⬡" },
  { id: 2, label: "Audit",       icon: "◈" },
  { id: 3, label: "Tag",         icon: "◉" },
  { id: 4, label: "Variety",     icon: "▦" },
  { id: 5, label: "Bias",        icon: "⬟" },
  { id: 6, label: "Transfer",    icon: "◈" },
  { id: 7, label: "Critique",    icon: "▣" },
];

const MOODS = ["Serene","Melancholic","Tense","Joyful","Ethereal","Gritty","Nostalgic","Surreal"];
const SUBJECTS = ["Portrait","Landscape","Abstract","Urban","Nature","Architecture","Still Life","Figure"];
const PALETTES = ["Warm","Cool","Monochrome","Earthy","Neon","Pastel","High Contrast","Muted"];
const ERAS = ["Classical","Romantic","Modern","Post-Modern","Contemporary","Digital","Renaissance","Baroque"];

const BIAS_ITEMS = [
  { id:"b1", category:"Selection",       text:"Does the dataset over-represent a single artist, school, or culture?" },
  { id:"b2", category:"Selection",       text:"Are there fewer than 3 distinct stylistic approaches in the set?" },
  { id:"b3", category:"Representation",  text:"Does the dataset exclude any relevant minority traditions?" },
  { id:"b4", category:"Representation",  text:"Are all depicted subjects treated with equal dignity and framing?" },
  { id:"b5", category:"Aesthetic",       text:"Is the dataset skewed toward one dominant colour palette?" },
  { id:"b6", category:"Aesthetic",       text:"Do all images share the same compositional convention (e.g. centre crop)?" },
  { id:"b7", category:"Technical",       text:"Is there significant variation in image resolution or compression artefacts?" },
  { id:"b8", category:"Technical",       text:"Are lighting conditions homogeneous across the dataset?" },
  { id:"b9", category:"Cultural",        text:"Does the dataset risk appropriating or decontextualising sacred imagery?" },
  { id:"b10",category:"Cultural",        text:"Could the style transfer output be mistaken for authentic cultural artefacts?" },
  { id:"b11",category:"Cultural",        text:"Are the provenance and rights status of source images known?" },
  { id:"b12",category:"Ethical",         text:"Have consent and reproduction rights been verified for all images?" },
];

const COLAB_INSTRUCTIONS = `## Neural Style Transfer — Google Colab Walkthrough

### Step 1 — Open Colab
Go to colab.research.google.com → New Notebook.

### Step 2 — Install & Import
\`\`\`python
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import requests
from io import BytesIO

# Load the pre-trained NST model from TF Hub
hub_model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')
\`\`\`

### Step 3 — Helper Functions
\`\`\`python
def load_image(path_or_url, max_dim=512):
    if path_or_url.startswith('http'):
        response = requests.get(path_or_url)
        img = Image.open(BytesIO(response.content)).convert('RGB')
    else:
        img = Image.open(path_or_url).convert('RGB')
    img.thumbnail((max_dim, max_dim))
    return tf.constant(np.array(img)[np.newaxis, ...] / 255.0, dtype=tf.float32)
\`\`\`

### Step 4 — Upload Your Images
\`\`\`python
from google.colab import files
uploaded = files.upload()  # Upload content image + style image
\`\`\`

### Step 5 — Run Style Transfer
\`\`\`python
content_image = load_image('your_content.jpg')
style_image   = load_image('your_style.jpg')

outputs = hub_model(tf.constant(content_image), tf.constant(style_image))
stylized = outputs[0]
\`\`\`

### Step 6 — Display & Save
\`\`\`python
result = np.squeeze(stylized.numpy())
plt.imshow(result); plt.axis('off'); plt.title('Stylized Output'); plt.show()

Image.fromarray((result * 255).astype(np.uint8)).save('stylized_output.png')
files.download('stylized_output.png')
\`\`\`

### Tips
- Increase **max_dim** for higher resolution (uses more RAM).
- Try **style_weight** sliders by blending: \`0.5 * content + 0.5 * stylized\`
- Google Colab free tier works; use GPU runtime for speed.
- Save your notebook to Drive for reproducibility.`;

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:       "#0e0c14",
  surface:  "#16121f",
  card:     "#1e1928",
  border:   "#2e2840",
  accent:   "#c084fc",
  accentDim:"#7c3aed",
  gold:     "#f59e0b",
  green:    "#34d399",
  red:      "#f87171",
  text:     "#e2d9f3",
  muted:    "#7c6e96",
  white:    "#ffffff",
};

// ─── Shared tiny components ───────────────────────────────────────────────────

const Badge = ({ color = C.accent, children }) => (
  <span style={{
    background: color + "22",
    color,
    border: `1px solid ${color}55`,
    borderRadius: 4,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: ".04em",
  }}>{children}</span>
);

const Btn = ({ onClick, disabled, variant = "primary", children, style: sx = {}, ...rest }) => {
  const base = {
    border: "none",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: ".03em",
    padding: "8px 18px",
    transition: "opacity .15s, transform .1s",
    opacity: disabled ? 0.45 : 1,
    ...sx,
  };
  const styles = {
    primary:   { background: `linear-gradient(135deg,${C.accentDim},${C.accent})`, color: C.white },
    ghost:     { background: "transparent", color: C.accent, border: `1px solid ${C.border}` },
    danger:    { background: "#7f1d1d", color: C.red },
    success:   { background: "#064e3b", color: C.green },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...styles[variant] }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = ".85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = disabled ? ".45" : "1"; }}
      {...rest}
    >{children}</button>
  );
};

const Label = ({ children, required }) => (
  <label style={{ display:"block", fontSize:12, color:C.muted, marginBottom:6, letterSpacing:".07em", textTransform:"uppercase" }}>
    {children}{required && <span style={{ color:C.accent, marginLeft:3 }}>*</span>}
  </label>
);

const Input = ({ value, onChange, placeholder, multiline, rows = 4, ...rest }) => {
  const shared = {
    width: "100%",
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.text,
    fontFamily: "inherit",
    fontSize: 14,
    padding: "10px 14px",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    transition: "border-color .2s",
  };
  return multiline
    ? <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
        style={shared} onFocus={e=>e.target.style.borderColor=C.accent}
        onBlur={e=>e.target.style.borderColor=C.border} {...rest} />
    : <input value={value} onChange={onChange} placeholder={placeholder}
        style={shared} onFocus={e=>e.target.style.borderColor=C.accent}
        onBlur={e=>e.target.style.borderColor=C.border} {...rest} />;
};

const Card = ({ children, style: sx = {} }) => (
  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, ...sx }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, children }) => (
  <h2 style={{ color:C.accent, fontSize:18, fontWeight:700, margin:"0 0 20px", display:"flex", alignItems:"center", gap:8 }}>
    <span style={{ fontSize:22 }}>{icon}</span>{children}
  </h2>
);

// ─── STEP 0 — Creative Goal ───────────────────────────────────────────────────

function StepGoal({ data, onChange }) {
  return (
    <div style={{ display:"grid", gap:20 }}>
      <SectionTitle icon="✦">Define Your Creative Goal</SectionTitle>
      <Card>
        <div style={{ display:"grid", gap:16 }}>
          <div>
            <Label required>Project Title</Label>
            <Input value={data.title} onChange={e=>onChange("title",e.target.value)}
              placeholder="e.g. Impressionist Urban Landscapes" />
          </div>
          <div>
            <Label required>Creative Intent</Label>
            <Input multiline rows={3} value={data.intent}
              onChange={e=>onChange("intent",e.target.value)}
              placeholder="What aesthetic quality or transformation are you pursuing? What feeling should the final work evoke?" />
          </div>
          <div>
            <Label>Reference Artists / Movements</Label>
            <Input value={data.references} onChange={e=>onChange("references",e.target.value)}
              placeholder="e.g. Monet, Cézanne, Post-Impressionism" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <Label>Medium / Output Format</Label>
              <Input value={data.medium} onChange={e=>onChange("medium",e.target.value)}
                placeholder="e.g. Digital print, screen, zine" />
            </div>
            <div>
              <Label>Audience</Label>
              <Input value={data.audience} onChange={e=>onChange("audience",e.target.value)}
                placeholder="e.g. Gallery visitors, Instagram" />
            </div>
          </div>
          <div>
            <Label>Constraints / Boundaries</Label>
            <Input multiline rows={2} value={data.constraints}
              onChange={e=>onChange("constraints",e.target.value)}
              placeholder="Any subjects to avoid? Cultural or ethical boundaries?" />
          </div>
        </div>
      </Card>
      {data.title && data.intent && (
        <Card style={{ borderColor: C.accentDim, background: C.accentDim + "18" }}>
          <p style={{ color:C.text, fontSize:14, margin:0 }}>
            <strong style={{color:C.accent}}>Goal Summary: </strong>
            {data.title} — {data.intent.slice(0,120)}{data.intent.length>120?"…":""}
          </p>
        </Card>
      )}
    </div>
  );
}

// ─── STEP 1 — Curate Dataset ──────────────────────────────────────────────────

function StepCurate({ images, setImages }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const processFiles = (files) => {
    const validTypes = ["image/jpeg","image/png","image/webp","image/gif"];
    const newImgs = Array.from(files)
      .filter(f => validTypes.includes(f.type))
      .map(f => ({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: f.size,
        type: f.type,
        url: URL.createObjectURL(f),
      }));
    setImages(prev => [...prev, ...newImgs]);
  };

  const onDrop = e => {
    e.preventDefault(); setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const count = images.length;
  const statusColor = count === 0 ? C.muted : count < 50 ? C.gold : count > 100 ? C.red : C.green;
  const statusMsg = count === 0 ? "No images yet"
    : count < 50 ? `${count} images — need at least 50`
    : count > 100 ? `${count} images — try to keep it ≤ 100`
    : `${count} images ✓ — good range`;

  return (
    <div style={{ display:"grid", gap:20 }}>
      <SectionTitle icon="⬡">Curate Your Dataset</SectionTitle>

      {/* Drop zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={onDrop}
        onClick={()=>inputRef.current.click()}
        role="button" tabIndex={0}
        onKeyDown={e=>e.key==="Enter"&&inputRef.current.click()}
        aria-label="Upload images by clicking or dragging"
        style={{
          border: `2px dashed ${dragging ? C.accent : C.border}`,
          borderRadius: 16,
          padding: "48px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? C.accentDim+"22" : C.card,
          transition: "all .2s",
        }}
      >
        <div style={{ fontSize:40, marginBottom:12 }}>⬡</div>
        <p style={{ color:C.accent, fontWeight:700, margin:"0 0 6px" }}>Drop images here</p>
        <p style={{ color:C.muted, fontSize:13, margin:0 }}>or click to browse — JPG, PNG, WEBP, GIF</p>
        <input ref={inputRef} type="file" multiple accept="image/*"
          style={{ display:"none" }} onChange={e=>processFiles(e.target.files)} />
      </div>

      {/* Count status bar */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{
          flex:1, height:8, borderRadius:4,
          background: C.border,
          overflow:"hidden",
        }}>
          <div style={{
            height:"100%",
            width:`${Math.min((count/100)*100,100)}%`,
            background: `linear-gradient(90deg,${C.accentDim},${statusColor})`,
            transition:"width .4s",
          }} />
        </div>
        <span style={{ color:statusColor, fontSize:13, fontWeight:600, minWidth:220 }}>{statusMsg}</span>
      </div>

      {/* Thumbnail grid */}
      {count > 0 && (
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",
          gap:8,
          maxHeight:340,
          overflowY:"auto",
        }}>
          {images.map(img => (
            <div key={img.id} style={{ position:"relative", borderRadius:8, overflow:"hidden", aspectRatio:"1", background:C.border }}>
              <img src={img.url} alt={img.name}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              <button
                onClick={()=>setImages(prev=>prev.filter(i=>i.id!==img.id))}
                aria-label={`Remove ${img.name}`}
                style={{
                  position:"absolute", top:3, right:3,
                  background:"#000000aa", color:C.red,
                  border:"none", borderRadius:"50%", width:20, height:20,
                  cursor:"pointer", fontSize:12, lineHeight:"20px", textAlign:"center",
                }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {count > 0 && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:C.muted, fontSize:12 }}>
            Total size: {(images.reduce((s,i)=>s+i.size,0)/1024/1024).toFixed(1)} MB
          </span>
          <Btn variant="danger" onClick={()=>setImages([])}>Clear All</Btn>
        </div>
      )}
    </div>
  );
}

// ─── STEP 2 — Audit ───────────────────────────────────────────────────────────

function StepAudit({ images, setImages }) {
  // Detect duplicates by name + size
  const { dupes, clean } = useMemo(() => {
    const seen = new Map();
    const dupeIds = new Set();
    images.forEach(img => {
      const key = `${img.name}__${img.size}`;
      if (seen.has(key)) dupeIds.add(img.id);
      else seen.set(key, img.id);
    });
    return {
      dupes: images.filter(i => dupeIds.has(i.id)),
      clean: images.filter(i => !dupeIds.has(i.id)),
    };
  }, [images]);

  const removeDupes = () => setImages(prev => prev.filter(i => !dupes.find(d=>d.id===i.id)));

  return (
    <div style={{ display:"grid", gap:20 }}>
      <SectionTitle icon="◈">Dataset Audit</SectionTitle>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {[
          { label:"Total Images",    value:images.length,  color:C.accent },
          { label:"Unique (by name+size)", value:clean.length, color:C.green },
          { label:"Suspected Dupes", value:dupes.length,   color:dupes.length>0?C.red:C.green },
        ].map(s => (
          <Card key={s.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:32, fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {dupes.length > 0 && (
        <Card style={{ borderColor:C.red }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ color:C.red, fontWeight:700 }}>⚠ {dupes.length} potential duplicate(s) detected</span>
            <Btn variant="danger" onClick={removeDupes}>Remove All Dupes</Btn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))", gap:6 }}>
            {dupes.map(img => (
              <div key={img.id} style={{ position:"relative", borderRadius:6, overflow:"hidden", aspectRatio:"1", border:`2px solid ${C.red}` }}>
                <img src={img.url} alt={img.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"#000000cc", padding:"2px 4px", fontSize:9, color:C.red, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
                  {img.name}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Manual remove list */}
      <Card>
        <h3 style={{ color:C.text, fontSize:14, marginTop:0, marginBottom:12 }}>Manual Review — click any image to remove</h3>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",
          gap:6, maxHeight:320, overflowY:"auto",
        }}>
          {images.map(img => (
            <div
              key={img.id}
              onClick={()=>setImages(prev=>prev.filter(i=>i.id!==img.id))}
              role="button" tabIndex={0}
              onKeyDown={e=>e.key==="Enter"&&setImages(prev=>prev.filter(i=>i.id!==img.id))}
              aria-label={`Remove ${img.name}`}
              title={`${img.name} (${(img.size/1024).toFixed(0)} KB) — click to remove`}
              style={{
                position:"relative", borderRadius:6, overflow:"hidden",
                aspectRatio:"1", cursor:"pointer",
                border:`1px solid ${C.border}`,
                transition:"opacity .15s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.opacity=".5";}}
              onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}
            >
              <img src={img.url} alt={img.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          ))}
        </div>
        {images.length === 0 && <p style={{ color:C.muted, fontSize:13 }}>No images uploaded yet.</p>}
      </Card>
    </div>
  );
}

// ─── STEP 3 — Tagging ─────────────────────────────────────────────────────────

function StepTag({ images, tags, setTags }) {
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({});

  // Initialize drafts when an image is selected
  useEffect(() => {
    if (selected) setDraft(tags[selected] || { subject:[], mood:[], palette:[], era:[] });
  }, [selected]);

  const save = () => {
    if (!selected) return;
    setTags(prev => ({ ...prev, [selected]: draft }));
    setSelected(null);
  };

  const toggle = (field, val) => {
    setDraft(prev => {
      const arr = prev[field] || [];
      return { ...prev, [field]: arr.includes(val) ? arr.filter(v=>v!==val) : [...arr, val] };
    });
  };

  // Aggregate counts
  const counts = useMemo(() => {
    const agg = { subject:{}, mood:{}, palette:{}, era:{} };
    Object.values(tags).forEach(t => {
      ["subject","mood","palette","era"].forEach(f => {
        (t[f]||[]).forEach(v => { agg[f][v] = (agg[f][v]||0)+1; });
      });
    });
    return agg;
  }, [tags]);

  const taggedCount = Object.keys(tags).length;
  const fields = [
    { key:"subject", label:"Subject", options:SUBJECTS },
    { key:"mood",    label:"Mood",    options:MOODS    },
    { key:"palette", label:"Palette", options:PALETTES },
    { key:"era",     label:"Era",     options:ERAS     },
  ];

  return (
    <div style={{ display:"grid", gap:20 }}>
      <SectionTitle icon="◉">Quick Tagging</SectionTitle>

      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <Badge color={C.green}>{taggedCount} / {images.length} tagged</Badge>
        {images.length === 0 && <span style={{ color:C.muted, fontSize:13 }}>Upload images in Step 2 first.</span>}
      </div>

      {/* Live tag counts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {fields.map(f => (
          <Card key={f.key}>
            <h4 style={{ color:C.accent, margin:"0 0 10px", fontSize:13, textTransform:"uppercase", letterSpacing:".07em" }}>{f.label}</h4>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {Object.entries(counts[f.key]).length === 0
                ? <span style={{ color:C.muted, fontSize:12 }}>No tags yet</span>
                : Object.entries(counts[f.key]).sort((a,b)=>b[1]-a[1]).map(([val,n]) => (
                  <Badge key={val} color={C.accent}>{val}: {n}</Badge>
                ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Image grid for tagging */}
      <Card>
        <h3 style={{ color:C.text, fontSize:14, margin:"0 0 12px" }}>Click an image to tag it</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))", gap:8, maxHeight:320, overflowY:"auto" }}>
          {images.map(img => {
            const hasTag = !!tags[img.id];
            return (
              <div
                key={img.id}
                onClick={()=>setSelected(img.id)}
                role="button" tabIndex={0}
                onKeyDown={e=>e.key==="Enter"&&setSelected(img.id)}
                aria-label={`Tag image ${img.name}`}
                style={{
                  position:"relative", borderRadius:8, overflow:"hidden",
                  aspectRatio:"1", cursor:"pointer",
                  border:`2px solid ${hasTag ? C.green : C.border}`,
                  transition:"border-color .15s",
                }}
              >
                <img src={img.url} alt={img.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                {hasTag && (
                  <div style={{ position:"absolute", top:4, right:4, background:C.green, borderRadius:"50%", width:14, height:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>✓</div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tag modal overlay */}
      {selected && (
        <div
          role="dialog" aria-modal="true" aria-label="Tag this image"
          style={{
            position:"fixed", inset:0, background:"#000000cc",
            display:"flex", alignItems:"center", justifyContent:"center",
            zIndex:1000, padding:20,
          }}
          onClick={e=>{ if(e.target===e.currentTarget) setSelected(null); }}
        >
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <h3 style={{ color:C.accent, margin:0 }}>Tag Image</h3>
              <button onClick={()=>setSelected(null)} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer", fontSize:18 }}>✕</button>
            </div>
            <img
              src={images.find(i=>i.id===selected)?.url}
              alt=""
              style={{ width:"100%", borderRadius:8, marginBottom:16, maxHeight:200, objectFit:"contain", background:C.bg }}
            />
            {fields.map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <Label>{f.label}</Label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {f.options.map(opt => {
                    const active = (draft[f.key]||[]).includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={()=>toggle(f.key,opt)}
                        aria-pressed={active}
                        style={{
                          background: active ? C.accentDim : C.surface,
                          color: active ? C.white : C.muted,
                          border: `1px solid ${active ? C.accent : C.border}`,
                          borderRadius: 20,
                          padding: "4px 12px",
                          cursor: "pointer",
                          fontSize: 12,
                          fontFamily: "inherit",
                          transition: "all .15s",
                        }}
                      >{opt}</button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn variant="ghost" onClick={()=>setSelected(null)}>Cancel</Btn>
              <Btn onClick={save}>Save Tags</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP 4 — Variety Check ───────────────────────────────────────────────────

function StepVariety({ images, tags }) {
  const counts = useMemo(() => {
    const agg = { subject:{}, mood:{}, palette:{}, era:{} };
    Object.values(tags).forEach(t => {
      ["subject","mood","palette","era"].forEach(f => {
        (t[f]||[]).forEach(v => { agg[f][v] = (agg[f][v]||0)+1; });
      });
    });
    return agg;
  }, [tags]);

  const taggedCount = Object.keys(tags).length;

  const BarChart = ({ data, color }) => {
    const max = Math.max(1, ...Object.values(data));
    return (
      <div style={{ display:"grid", gap:6 }}>
        {Object.entries(data).sort((a,b)=>b[1]-a[1]).map(([label,val]) => (
          <div key={label} style={{ display:"grid", gridTemplateColumns:"110px 1fr 28px", alignItems:"center", gap:8 }}>
            <span style={{ color:C.text, fontSize:12, textAlign:"right" }}>{label}</span>
            <div style={{ height:18, background:C.border, borderRadius:4, overflow:"hidden" }}>
              <div style={{
                height:"100%",
                width:`${(val/max)*100}%`,
                background:`linear-gradient(90deg,${C.accentDim},${color})`,
                borderRadius:4,
                transition:"width .5s",
              }} />
            </div>
            <span style={{ color:C.muted, fontSize:12 }}>{val}</span>
          </div>
        ))}
        {Object.keys(data).length===0 && <span style={{ color:C.muted, fontSize:12 }}>No tags yet</span>}
      </div>
    );
  };

  const fields = [
    { key:"subject", label:"Subject Distribution",  color:C.accent },
    { key:"mood",    label:"Mood Distribution",      color:C.gold  },
    { key:"palette", label:"Palette Distribution",   color:C.green },
    { key:"era",     label:"Era Distribution",       color:"#60a5fa" },
  ];

  // Calculate diversity score
  const diversityScore = useMemo(() => {
    let total = 0, scored = 0;
    fields.forEach(f => {
      const vals = Object.keys(counts[f.key]);
      if (vals.length > 0) {
        scored++;
        total += Math.min(vals.length / 4, 1); // 4 unique = max score per category
      }
    });
    return scored > 0 ? Math.round((total / scored) * 100) : 0;
  }, [counts]);

  return (
    <div style={{ display:"grid", gap:20 }}>
      <SectionTitle icon="▦">Variety Check</SectionTitle>

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
        <Card style={{ textAlign:"center" }}>
          <div style={{ fontSize:28, fontWeight:700, color:C.accent }}>{images.length}</div>
          <div style={{ color:C.muted, fontSize:12 }}>Total Images</div>
        </Card>
        <Card style={{ textAlign:"center" }}>
          <div style={{ fontSize:28, fontWeight:700, color:C.green }}>{taggedCount}</div>
          <div style={{ color:C.muted, fontSize:12 }}>Tagged</div>
        </Card>
        <Card style={{ textAlign:"center" }}>
          <div style={{ fontSize:28, fontWeight:700, color:diversityScore>=60?C.green:diversityScore>=30?C.gold:C.red }}>
            {diversityScore}%
          </div>
          <div style={{ color:C.muted, fontSize:12 }}>Diversity Score</div>
        </Card>
      </div>

      {diversityScore < 40 && taggedCount > 0 && (
        <Card style={{ borderColor:C.gold }}>
          <p style={{ color:C.gold, margin:0, fontSize:14 }}>
            ⚠ Low variety detected. Consider adding images across more subjects, moods, or eras to improve model generalization.
          </p>
        </Card>
      )}

      {/* Distribution charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {fields.map(f => (
          <Card key={f.key}>
            <h4 style={{ color:f.color, margin:"0 0 14px", fontSize:13, textTransform:"uppercase", letterSpacing:".07em" }}>{f.label}</h4>
            <BarChart data={counts[f.key]} color={f.color} />
          </Card>
        ))}
      </div>

      {/* Table summary */}
      <Card>
        <h3 style={{ color:C.text, margin:"0 0 14px", fontSize:14 }}>Distribution Summary Table</h3>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr>
                {["Category","Top Value","Count","Unique Values","Coverage"].map(h => (
                  <th key={h} style={{ color:C.muted, padding:"6px 12px", textAlign:"left", borderBottom:`1px solid ${C.border}`, fontSize:11, textTransform:"uppercase", letterSpacing:".05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map(f => {
                const entries = Object.entries(counts[f.key]);
                const top = entries.sort((a,b)=>b[1]-a[1])[0];
                const coverage = taggedCount > 0 ? Math.round((entries.reduce((s,[,v])=>s+v,0)/taggedCount)*100) : 0;
                return (
                  <tr key={f.key} style={{ borderBottom:`1px solid ${C.border}22` }}>
                    <td style={{ padding:"8px 12px", color:f.color, fontWeight:600 }}>{f.label.replace(" Distribution","")}</td>
                    <td style={{ padding:"8px 12px", color:C.text }}>{top ? top[0] : "—"}</td>
                    <td style={{ padding:"8px 12px", color:C.text }}>{top ? top[1] : 0}</td>
                    <td style={{ padding:"8px 12px", color:C.text }}>{entries.length}</td>
                    <td style={{ padding:"8px 12px", color:C.muted }}>{coverage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── STEP 5 — Bias & Risk Check ───────────────────────────────────────────────

function StepBias({ biasCheck, setBiasCheck, reflection, setReflection }) {
  const byCategory = useMemo(() => {
    return BIAS_ITEMS.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, []);

  const checked = Object.values(biasCheck).filter(Boolean).length;
  const total = BIAS_ITEMS.length;

  const catColors = {
    Selection:"#60a5fa", Representation:C.gold,
    Aesthetic:C.accent, Technical:C.green,
    Cultural:C.red, Ethical:"#f97316",
  };

  return (
    <div style={{ display:"grid", gap:20 }}>
      <SectionTitle icon="⬟">Bias & Risk Check</SectionTitle>

      <Card style={{ borderColor: checked===total?C.green:C.gold }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:28, fontWeight:700, color: checked===total?C.green:C.gold }}>{checked}/{total}</div>
          <div>
            <div style={{ color:C.text, fontWeight:600, fontSize:14 }}>Checklist Progress</div>
            <div style={{ color:C.muted, fontSize:12 }}>Review each item thoughtfully</div>
          </div>
          <div style={{ flex:1, height:8, background:C.border, borderRadius:4, marginLeft:"auto" }}>
            <div style={{ height:"100%", width:`${(checked/total)*100}%`, background:`linear-gradient(90deg,${C.accentDim},${C.green})`, borderRadius:4, transition:"width .4s" }} />
          </div>
        </div>
      </Card>

      {Object.entries(byCategory).map(([cat, items]) => (
        <Card key={cat}>
          <h4 style={{ color:catColors[cat]||C.accent, margin:"0 0 14px", fontSize:13, textTransform:"uppercase", letterSpacing:".07em" }}>{cat} Bias</h4>
          <div style={{ display:"grid", gap:10 }}>
            {items.map(item => (
              <label key={item.id} style={{ display:"flex", gap:12, cursor:"pointer", alignItems:"flex-start" }}>
                <input
                  type="checkbox"
                  checked={!!biasCheck[item.id]}
                  onChange={e => setBiasCheck(prev => ({ ...prev, [item.id]: e.target.checked }))}
                  style={{ marginTop:2, accentColor:catColors[cat]||C.accent, cursor:"pointer" }}
                />
                <span style={{ color:biasCheck[item.id]?C.text:C.muted, fontSize:14, lineHeight:1.5, transition:"color .2s" }}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </Card>
      ))}

      <Card style={{ borderColor: reflection.length >= 80 ? C.green : C.border }}>
        <Label required>Reflection (min. ~80 characters)</Label>
        <Input
          multiline rows={5}
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          placeholder="Reflect on the biases you've identified. How does your dataset reflect or challenge dominant cultural narratives? What decisions did you make to mitigate risk, and what remains unresolved?"
        />
        <div style={{ textAlign:"right", fontSize:11, color: reflection.length>=80?C.green:C.muted, marginTop:6 }}>
          {reflection.length} chars {reflection.length < 80 ? `(${80-reflection.length} more to go)` : "✓"}
        </div>
      </Card>
    </div>
  );
}

// ─── STEP 6 — Style Transfer Instructions ────────────────────────────────────

function StepTransfer({ transferData, setTransferData }) {
  const [copied, setCopied] = useState(false);

  const copyInstructions = () => {
    navigator.clipboard.writeText(COLAB_INSTRUCTIONS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ display:"grid", gap:20 }}>
      <SectionTitle icon="◈">Style Transfer Activity</SectionTitle>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div>
          <Label>Google Colab Notebook Link</Label>
          <Input
            value={transferData.colabLink}
            onChange={e=>setTransferData(p=>({...p,colabLink:e.target.value}))}
            placeholder="https://colab.research.google.com/..."
          />
        </div>
        <div>
          <Label>Chosen Style Image Name</Label>
          <Input
            value={transferData.styleImageName}
            onChange={e=>setTransferData(p=>({...p,styleImageName:e.target.value}))}
            placeholder="e.g. starry_night.jpg"
          />
        </div>
      </div>

      <div>
        <Label>Notes on Style Choice</Label>
        <Input
          multiline rows={3}
          value={transferData.notes}
          onChange={e=>setTransferData(p=>({...p,notes:e.target.value}))}
          placeholder="Why did you choose this style image? What qualities are you hoping to transfer?"
        />
      </div>

      {/* Instructions box */}
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ color:C.accent, margin:0, fontSize:15 }}>TensorFlow NST — Colab Instructions</h3>
          <Btn
            variant={copied ? "success" : "ghost"}
            onClick={copyInstructions}
          >{copied ? "✓ Copied!" : "Copy Instructions"}</Btn>
        </div>
        <div style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: 16,
          maxHeight: 400,
          overflowY: "auto",
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          color: C.text,
          lineHeight: 1.8,
          whiteSpace: "pre-wrap",
        }}>
          {COLAB_INSTRUCTIONS}
        </div>
      </Card>

      {/* Quick reference */}
      <Card>
        <h4 style={{ color:C.gold, margin:"0 0 12px", fontSize:13, textTransform:"uppercase", letterSpacing:".07em" }}>Quick Reference — Parameters to Experiment With</h4>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { param:"max_dim",         effect:"Controls output resolution (256–1024px)" },
            { param:"style_weight",    effect:"How strongly style dominates content" },
            { param:"content_weight",  effect:"Preserves original image structure" },
            { param:"iterations",      effect:"More = refined result, slower" },
          ].map(r => (
            <div key={r.param} style={{ background:C.bg, borderRadius:6, padding:"8px 12px" }}>
              <code style={{ color:C.accent, fontSize:12 }}>{r.param}</code>
              <p style={{ color:C.muted, fontSize:12, margin:"4px 0 0" }}>{r.effect}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── STEP 7 — Critique Prep ───────────────────────────────────────────────────

function StepCritique({ images, critique, setCritique }) {
  const show = images.slice(0, 12);

  return (
    <div style={{ display:"grid", gap:20 }}>
      <SectionTitle icon="▣">Critique Prep — Gallery Plan</SectionTitle>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div>
          <Label>What Changed After Style Transfer?</Label>
          <Input multiline rows={4} value={critique.changed}
            onChange={e=>setCritique(p=>({...p,changed:e.target.value}))}
            placeholder="Describe the visual transformations: texture, colour, mood, brushwork…" />
        </div>
        <div>
          <Label>What Stayed Consistent?</Label>
          <Input multiline rows={4} value={critique.consistent}
            onChange={e=>setCritique(p=>({...p,consistent:e.target.value}))}
            placeholder="Content structure, composition, subject identity…" />
        </div>
      </div>

      <div>
        <Label>Curatorial Statement (for gallery label)</Label>
        <Input multiline rows={3} value={critique.curatorial}
          onChange={e=>setCritique(p=>({...p,curatorial:e.target.value}))}
          placeholder="Write a brief artist statement that could accompany your work in a critique session…" />
      </div>

      {/* Gallery grid with before/after */}
      <Card>
        <h3 style={{ color:C.text, fontSize:14, margin:"0 0 16px" }}>
          Before / After Gallery — {show.length} images shown (after placeholders ready for your Colab outputs)
        </h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
          {show.map(img => (
            <div key={img.id} style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
                <div style={{ position:"relative" }}>
                  <img src={img.url} alt={`Before: ${img.name}`}
                    style={{ width:"100%", display:"block", aspectRatio:"1", objectFit:"cover" }} />
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"#000000aa", fontSize:10, color:C.muted, padding:"2px 6px" }}>BEFORE</div>
                </div>
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background:C.surface, aspectRatio:"1",
                  fontSize:10, color:C.muted, textAlign:"center", padding:6, lineHeight:1.4,
                }}>
                  Add<br/>stylized<br/>output
                </div>
              </div>
              <div style={{ padding:"8px 10px" }}>
                <p style={{ color:C.muted, fontSize:10, margin:0, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
                  {img.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        {images.length === 0 && <p style={{ color:C.muted, fontSize:13 }}>Upload images in Step 2 to populate the gallery.</p>}
      </Card>

      {/* Critique prompts */}
      <Card style={{ borderColor:C.gold }}>
        <h4 style={{ color:C.gold, margin:"0 0 12px", fontSize:13, textTransform:"uppercase", letterSpacing:".07em" }}>Critique Prompts</h4>
        <ul style={{ color:C.muted, fontSize:13, lineHeight:2, paddingLeft:20, margin:0 }}>
          {[
            "Does the style transfer enhance or obscure the subject's identity?",
            "Is the aesthetic transformation consistent across all dataset images?",
            "How does the chosen style image reflect your original creative intent?",
            "What would change if you used a higher vs lower style weight?",
            "How does this work sit in relation to the original artist's cultural context?",
            "What ethical questions arise from applying a historical style to contemporary content?",
          ].map((q,i) => <li key={i}>{q}</li>)}
        </ul>
      </Card>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "style_transfer_companion_v1";

export default function App() {
  const [step, setStep] = useState(0);

  // All state
  const [goal, setGoal]           = useState({ title:"", intent:"", references:"", medium:"", audience:"", constraints:"" });
  const [images, setImages]       = useState([]);
  const [tags, setTags]           = useState({});
  const [biasCheck, setBiasCheck] = useState({});
  const [reflection, setReflection] = useState("");
  const [transferData, setTransferData] = useState({ colabLink:"", styleImageName:"", notes:"" });
  const [critique, setCritique]   = useState({ changed:"", consistent:"", curatorial:"" });

  // Autosave to localStorage (sans image blob URLs which can't be serialised)
  useEffect(() => {
    const data = { goal, tags, biasCheck, reflection, transferData, critique };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [goal, tags, biasCheck, reflection, transferData, critique]);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.goal)         setGoal(saved.goal);
      if (saved.tags)         setTags(saved.tags);
      if (saved.biasCheck)    setBiasCheck(saved.biasCheck);
      if (saved.reflection)   setReflection(saved.reflection);
      if (saved.transferData) setTransferData(saved.transferData);
      if (saved.critique)     setCritique(saved.critique);
    } catch {}
  }, []);

  // Export summary
  const exportSummary = () => {
    const tagCounts = {};
    ["subject","mood","palette","era"].forEach(f => {
      tagCounts[f] = {};
      Object.values(tags).forEach(t => {
        (t[f]||[]).forEach(v => { tagCounts[f][v] = (tagCounts[f][v]||0)+1; });
      });
    });

    const report = {
      exportedAt: new Date().toISOString(),
      goal,
      dataset: {
        totalImages: images.length,
        taggedImages: Object.keys(tags).length,
      },
      tagDistributions: tagCounts,
      biasChecklist: BIAS_ITEMS.map(i => ({
        id: i.id, category: i.category, text: i.text, checked: !!biasCheck[i.id],
      })),
      biasReflection: reflection,
      styleTransfer: transferData,
      critiquePlan: critique,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `style_transfer_summary_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Completion indicators per step
  const stepStatus = useMemo(() => [
    goal.title && goal.intent,                       // Goal
    images.length >= 50 && images.length <= 100,     // Curate
    true,                                            // Audit (always done)
    Object.keys(tags).length > 0,                   // Tag
    true,                                            // Variety
    Object.values(biasCheck).filter(Boolean).length >= 8 && reflection.length >= 80, // Bias
    transferData.colabLink || transferData.styleImageName, // Transfer
    critique.changed || critique.consistent,         // Critique
  ], [goal, images, tags, biasCheck, reflection, transferData, critique]);

  const STEP_CONTENT = [
    <StepGoal key={0} data={goal} onChange={(k,v)=>setGoal(p=>({...p,[k]:v}))} />,
    <StepCurate key={1} images={images} setImages={setImages} />,
    <StepAudit key={2} images={images} setImages={setImages} />,
    <StepTag key={3} images={images} tags={tags} setTags={setTags} />,
    <StepVariety key={4} images={images} tags={tags} />,
    <StepBias key={5} biasCheck={biasCheck} setBiasCheck={setBiasCheck} reflection={reflection} setReflection={setReflection} />,
    <StepTransfer key={6} transferData={transferData} setTransferData={setTransferData} />,
    <StepCritique key={7} images={images} critique={critique} setCritique={setCritique} />,
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'Georgia', serif",
    }}>
      {/* Import Cormorant & JetBrains Mono via @import style tag trick */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        body { margin: 0; }
        code, pre { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <header style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "'Cormorant Garamond', serif",
            color: C.accent,
            letterSpacing: ".02em",
          }}>
            ◈ Style Transfer Companion
          </h1>
          <p style={{ margin: 0, fontSize: 11, color: C.muted, letterSpacing: ".07em" }}>
            DATASET EXPLORATION · NEURAL STYLE TRANSFER · CRITIQUE PREP
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:11, color:C.muted }}>Autosaved ✓</span>
          <Btn variant="ghost" onClick={exportSummary} style={{ fontSize:12 }}>
            ↓ Export Summary
          </Btn>
        </div>
      </header>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 16px" }}>

        {/* Stepper navigation */}
        <nav aria-label="Workflow steps" style={{ marginBottom:28, overflowX:"auto" }}>
          <div style={{
            display:"flex",
            gap:0,
            borderBottom: `1px solid ${C.border}`,
            minWidth:600,
          }}>
            {STEPS.map((s, i) => {
              const active = step === i;
              const done   = stepStatus[i];
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(i)}
                  aria-current={active ? "step" : undefined}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    borderBottom: `2px solid ${active ? C.accent : "transparent"}`,
                    color: active ? C.accent : done ? C.green : C.muted,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 11,
                    fontWeight: active ? 700 : 500,
                    letterSpacing: ".06em",
                    padding: "12px 6px",
                    textTransform: "uppercase",
                    transition: "color .2s, border-color .2s",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize:16, marginBottom:3 }}>
                    {done ? "✓" : s.icon}
                  </div>
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Progress bar */}
        <div style={{ marginBottom:28, display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ flex:1, height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
            <div style={{
              height:"100%",
              width:`${(step/(STEPS.length-1))*100}%`,
              background:`linear-gradient(90deg,${C.accentDim},${C.accent})`,
              transition:"width .4s",
            }} />
          </div>
          <span style={{ fontSize:11, color:C.muted, whiteSpace:"nowrap" }}>
            Step {step+1} of {STEPS.length}
          </span>
        </div>

        {/* Step content */}
        <main>
          {STEP_CONTENT[step]}
        </main>

        {/* Step nav buttons */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:32, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
          <Btn variant="ghost" disabled={step===0} onClick={()=>setStep(p=>Math.max(0,p-1))}>
            ← Previous
          </Btn>
          {step < STEPS.length - 1
            ? <Btn onClick={()=>setStep(p=>Math.min(STEPS.length-1,p+1))}>Next →</Btn>
            : <Btn variant="success" onClick={exportSummary}>Export Summary ↓</Btn>
          }
        </div>

      </div>

      {/* Footer */}
      <footer style={{
        borderTop:`1px solid ${C.border}`,
        padding:"16px 24px",
        textAlign:"center",
        color:C.muted,
        fontSize:11,
        letterSpacing:".06em",
      }}>
        STYLE TRANSFER COMPANION · ART &amp; MEDIA STUDIO TOOL · DATA AUTOSAVED LOCALLY
      </footer>
    </div>
  );
}
