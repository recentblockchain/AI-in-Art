import React, { useState, Suspense, lazy } from "react";

const I2VApp             = lazy(() => import("../0.I2V.jsx"));
const DatasetStyleApp    = lazy(() => import("../2. DatasetStyleTransferApp.jsx"));
const VideoLecture       = lazy(() => import("../1. Video.jsx"));
const ImageLecture       = lazy(() => import("../3. Image.jsx"));
const Image2Video        = lazy(() => import("../4.Image-2-Video.jsx"));
const ImageVideoLecture  = lazy(() => import("../5. Image Video Lecture.jsx"));
const I2VLecture         = lazy(() => import("../6. I2V-lecture.jsx"));
const Lecture8           = lazy(() => import("../7. Lecture.jsx"));
const DataStructures     = lazy(() => import("../8. Remixed.tsx"));
const AIMInArt           = lazy(() => import("../9. AIM.jsx"));
const AIModularity       = lazy(() => import("../11. AIModularity.jsx"));
const DatasetExploration = lazy(() => import("../13. Dataset Eexploration.jsx"));
const DataStyleTransfer  = lazy(() => import("../14. Data Style Transfer.jsx"));

/* ── Course modules — grouped by topic ── */
const MODULES = [
  {
    id: "m1",
    unit: "Unit 1",
    title: "AI & Video",
    color: "#7c6af7",
    bg: "rgba(124,106,247,0.06)",
    border: "rgba(124,106,247,0.2)",
    items: [
      { id: "i2v-app",             num: "00", type: "Lab",     label: "I2V Interactive App",        Component: I2VApp },
      { id: "video-lecture",       num: "01", type: "Lecture", label: "Video Lecture",              Component: VideoLecture },
      { id: "image-lecture",       num: "03", type: "Lecture", label: "Image Lecture",              Component: ImageLecture },
      { id: "image-2-video",       num: "04", type: "Lecture", label: "Image to Video",             Component: Image2Video },
    ],
  },
  {
    id: "m2",
    unit: "Unit 2",
    title: "Image-to-Video Techniques",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.06)",
    border: "rgba(6,182,212,0.2)",
    items: [
      { id: "image-video-lecture", num: "05", type: "Lecture", label: "Image Video Lecture",        Component: ImageVideoLecture },
      { id: "i2v-lecture",         num: "06", type: "Lecture", label: "Image-to-Video Lecture",     Component: I2VLecture },
      { id: "lecture8",            num: "07", type: "Lecture", label: "AI Lecture",                 Component: Lecture8 },
    ],
  },
  {
    id: "m3",
    unit: "Unit 3",
    title: "Data Structures & AI Modularity",
    color: "#10b981",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.2)",
    items: [
      { id: "data-structures",     num: "08", type: "Lecture", label: "Data Structures Game",       Component: DataStructures },
      { id: "aim-in-art",          num: "09", type: "Lecture", label: "AI Modularity in Art",       Component: AIMInArt },
      { id: "ai-modularity",       num: "11", type: "Lecture", label: "AI Modularity",              Component: AIModularity },
    ],
  },
  {
    id: "m4",
    unit: "Unit 4",
    title: "Datasets & Style Transfer",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.2)",
    items: [
      { id: "dataset-exploration", num: "13", type: "Lecture", label: "Dataset Exploration",        Component: DatasetExploration },
      { id: "dataset-style-app",   num: "02", type: "Lab",     label: "Dataset Style Transfer App", Component: DatasetStyleApp },
      { id: "data-style-transfer", num: "14", type: "Lecture", label: "Data Style Transfer",        Component: DataStyleTransfer },
    ],
  },
];

/* ── Design tokens ── */
const FONT   = "'Segoe UI', system-ui, -apple-system, sans-serif";
const BG     = "#f4f5f7";
const WHITE  = "#ffffff";
const INK    = "#111827";
const MUTED  = "#6b7280";
const BORDER = "#e5e7eb";

/* ── Type badge colours ── */
const TYPE_STYLE = {
  Lecture: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Lab:     { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
};

/* ── RowItem ── */
function RowItem({ item, accentColor, onClick }) {
  const [hov, setHov] = React.useState(false);
  const ts = TYPE_STYLE[item.type] || TYPE_STYLE.Lecture;
  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "13px 20px",
        borderBottom: `1px solid ${BORDER}`,
        cursor: "pointer",
        background: hov ? "#f9fafb" : WHITE,
        transition: "background 0.12s",
      }}
    >
      {/* number chip */}
      <span style={{
        minWidth: "36px",
        textAlign: "center",
        fontSize: "11px",
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        color: accentColor,
        background: `${accentColor}15`,
        border: `1px solid ${accentColor}40`,
        borderRadius: "6px",
        padding: "3px 7px",
        letterSpacing: "0.05em",
      }}>
        {item.num}
      </span>

      {/* title */}
      <span style={{ flex: 1, fontSize: "15px", fontWeight: 500, color: INK }}>
        {item.label}
      </span>

      {/* type badge */}
      <span style={{
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.09em",
        padding: "3px 9px",
        borderRadius: "20px",
        background: ts.bg,
        color: ts.color,
        border: `1px solid ${ts.border}`,
      }}>
        {item.type}
      </span>

      {/* arrow */}
      <span style={{ color: hov ? accentColor : "#d1d5db", fontSize: "16px", transition: "color 0.12s" }}>›</span>
    </div>
  );
}

/* ── ModuleCard ── */
function ModuleCard({ mod, onClick }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{
      background: WHITE,
      border: `1px solid ${BORDER}`,
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      {/* Module header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "18px 24px",
          cursor: "pointer",
          background: mod.bg,
          borderBottom: open ? `1px solid ${mod.border}` : "none",
          transition: "background 0.15s",
          userSelect: "none",
        }}
      >
        {/* colour pill */}
        <span style={{
          width: "10px", height: "10px",
          borderRadius: "50%",
          background: mod.color,
          flexShrink: 0,
        }} />

        <span style={{
          fontSize: "10px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.16em",
          color: mod.color,
          background: `${mod.color}18`,
          border: `1px solid ${mod.color}40`,
          borderRadius: "4px",
          padding: "2px 8px",
          flexShrink: 0,
        }}>
          {mod.unit}
        </span>

        <span style={{ flex: 1, fontSize: "16px", fontWeight: 700, color: INK }}>
          {mod.title}
        </span>

        <span style={{ fontSize: "12px", color: MUTED }}>
          {mod.items.length} {mod.items.length === 1 ? "item" : "items"}
        </span>

        <span style={{
          color: MUTED, fontSize: "14px",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          display: "inline-block",
        }}>›</span>
      </div>

      {/* Items */}
      {open && (
        <div>
          {mod.items.map((item, i) => (
            <RowItem
              key={item.id}
              item={item}
              accentColor={mod.color}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── App ── */
export default function App() {
  const [active, setActive] = useState(null);

  if (active) {
    const { Component } = active;
    return (
      <div style={{ minHeight: "100vh", background: WHITE, fontFamily: FONT }}>
        {/* Back bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "14px 32px",
          borderBottom: `1px solid ${BORDER}`,
          background: WHITE,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <button
            onClick={() => setActive(null)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "none", border: `1px solid ${BORDER}`,
              color: INK, padding: "7px 16px",
              borderRadius: "8px", cursor: "pointer",
              fontSize: "13px", fontWeight: 500,
            }}
          >
            ← Back to Course
          </button>
          <span style={{ fontSize: "14px", color: MUTED }}>{active.label}</span>
        </div>

        <Suspense fallback={
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", color: MUTED, fontFamily: FONT, gap: "10px" }}>
            Loading {active.label}…
          </div>
        }>
          <Component />
        </Suspense>
      </div>
    );
  }

  const totalItems = MODULES.reduce((n, m) => n + m.items.length, 0);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: FONT }}>

      {/* ── Top header bar ── */}
      <div style={{ background: WHITE, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "36px 32px 28px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, margin: "0 0 8px" }}>
            ART-CMPSC 297 · Penn State · Spring 2026
          </p>
          <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: INK, margin: "0 0 6px", lineHeight: 1.15 }}>
            AI in Art
          </h1>
          <p style={{ fontSize: "14px", color: MUTED, margin: 0 }}>
            {MODULES.length} modules &nbsp;·&nbsp; {totalItems} lectures &amp; labs
          </p>
        </div>
      </div>

      {/* ── Module / stat strip ── */}
      <div style={{ background: WHITE, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{
          maxWidth: "820px", margin: "0 auto",
          padding: "0 32px",
          display: "flex", gap: "0",
          overflowX: "auto",
        }}>
          {MODULES.map(m => (
            <div key={m.id} style={{
              padding: "12px 20px 12px 0",
              marginRight: "28px",
              borderBottom: `3px solid ${m.color}`,
              whiteSpace: "nowrap",
            }}>
              <div style={{ fontSize: "11px", color: MUTED, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{m.unit}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: INK, marginTop: "2px" }}>{m.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Module cards ── */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 32px 80px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {MODULES.map(mod => (
          <ModuleCard key={mod.id} mod={mod} onClick={setActive} />
        ))}
      </div>

    </div>
  );
}
