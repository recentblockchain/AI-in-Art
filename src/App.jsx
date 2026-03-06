import React, { useState, Suspense, lazy } from "react";

// Lazy-load each lecture component for performance
const I2VApp             = lazy(() => import("../0.I2V.jsx"));
const DatasetStyleApp    = lazy(() => import("../03. DatasetStyleTransferApp.jsx"));
const VideoLecture       = lazy(() => import("../1. Video.jsx"));
const ImageLecture       = lazy(() => import("../3. Image.jsx"));
const Image2Video        = lazy(() => import("../4.Image-2-Video.jsx"));
const ImageVideoLecture  = lazy(() => import("../6. Image Video Lecture.jsx"));
const I2VLecture         = lazy(() => import("../7. I2V-lecture.jsx"));
const Lecture8           = lazy(() => import("../8. Lecture.jsx"));
const DataStructures     = lazy(() => import("../9. Remixed.tsx"));
const AIMInArt           = lazy(() => import("../10. AIM.jsx"));
const AIModularity       = lazy(() => import("../12. AIModularity.jsx"));
const DatasetExploration = lazy(() => import("../14. Dataset Eexploration.jsx"));
const DataStyleTransfer  = lazy(() => import("../15. Data Style Transfer.jsx"));

// Ordered sequentially by lecture/lab number
const LECTURES = [
  { id: "i2v-app",             num: "00", label: "I2V Interactive App",         tag: "Lab",      Component: I2VApp },
  { id: "video-lecture",       num: "01", label: "Video Lecture",               tag: "Lecture",  Component: VideoLecture },
  { id: "dataset-style-app",   num: "03", label: "Dataset Style Transfer App",  tag: "Lab",      Component: DatasetStyleApp },
  { id: "image-lecture",       num: "03", label: "Image Lecture",               tag: "Lecture",  Component: ImageLecture },
  { id: "image-2-video",       num: "04", label: "Image to Video",              tag: "Lecture",  Component: Image2Video },
  { id: "image-video-lecture", num: "06", label: "Image Video Lecture",         tag: "Lecture",  Component: ImageVideoLecture },
  { id: "i2v-lecture",         num: "07", label: "Image-to-Video Lecture",      tag: "Lecture",  Component: I2VLecture },
  { id: "lecture8",            num: "08", label: "AI Lecture",                  tag: "Lecture",  Component: Lecture8 },
  { id: "data-structures",     num: "09", label: "Data Structures Game",        tag: "Lecture",  Component: DataStructures },
  { id: "aim-in-art",          num: "10", label: "AI Modularity in Art",        tag: "Lecture",  Component: AIMInArt },
  { id: "ai-modularity",       num: "12", label: "AI Modularity",               tag: "Lecture",  Component: AIModularity },
  { id: "dataset-exploration", num: "14", label: "Dataset Exploration",         tag: "Lecture",  Component: DatasetExploration },
  { id: "data-style-transfer", num: "15", label: "Data Style Transfer",         tag: "Lecture",  Component: DataStyleTransfer },
];

/* ── Styles ── */
const ACCENT   = "#7c6af7";
const ACCENT2  = "#5eead4";
const BG       = "#0d0d14";
const BG2      = "#13131f";
const LINE_CLR = "rgba(255,255,255,0.07)";

const styles = {
  root: {
    minHeight: "100vh",
    background: BG,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#fff",
  },
  header: {
    padding: "52px 48px 36px",
    borderBottom: `1px solid ${LINE_CLR}`,
  },
  course: {
    fontSize: "11px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.38)",
    marginBottom: "10px",
  },
  title: {
    fontSize: "clamp(30px,5vw,54px)",
    fontWeight: 800,
    background: `linear-gradient(100deg, ${ACCENT}, ${ACCENT2})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 6px",
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.42)",
    marginTop: "4px",
  },
  list: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "40px 48px 80px",
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  row: {
    display: "flex",
    alignItems: "stretch",
    gap: "0",
  },
  timelineCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "48px",
    flexShrink: 0,
  },
  dot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: ACCENT,
    border: `2px solid ${ACCENT}`,
    flexShrink: 0,
    marginTop: "20px",
    transition: "transform 0.2s, background 0.2s",
    zIndex: 1,
  },
  dotHover: {
    background: ACCENT2,
    border: `2px solid ${ACCENT2}`,
    transform: "scale(1.4)",
  },
  line: {
    width: "2px",
    flex: 1,
    background: LINE_CLR,
    marginTop: "4px",
  },
  lineFirst: {
    width: "2px",
    height: "20px",
    flex: 0,
    background: "transparent",
  },
  item: {
    flex: 1,
    padding: "14px 20px 30px",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "background 0.15s",
    marginLeft: "4px",
  },
  itemHover: {
    background: "rgba(124,106,247,0.08)",
  },
  num: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    color: ACCENT,
    marginBottom: "4px",
    fontVariantNumeric: "tabular-nums",
  },
  label: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#fff",
    margin: 0,
  },
  tagBadge: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    background: "rgba(94,234,212,0.12)",
    color: ACCENT2,
    padding: "2px 8px",
    borderRadius: "4px",
    marginTop: "6px",
  },
  arrowHint: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.2)",
    marginTop: "6px",
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${LINE_CLR}`,
    color: "#fff",
    padding: "9px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    margin: "24px 48px",
    transition: "background 0.15s",
  },
  spinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    fontSize: "15px",
    color: "rgba(255,255,255,0.4)",
    gap: "10px",
  },
};

function TimelineRow({ lecture, index, total, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  const isLast = index === total - 1;

  return (
    <div style={styles.row}>
      {/* Timeline spine */}
      <div style={styles.timelineCol}>
        <div style={{ ...styles.dot, ...(hovered ? styles.dotHover : {}) }} />
        {!isLast && <div style={styles.line} />}
      </div>

      {/* Content */}
      <div
        style={{ ...styles.item, ...(hovered ? styles.itemHover : {}) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onClick(lecture)}
      >
        <div style={styles.num}>#{lecture.num}</div>
        <h2 style={styles.label}>{lecture.label}</h2>
        <div style={styles.tagBadge}>{lecture.tag}</div>
        <div style={styles.arrowHint}>{hovered ? "Open →" : ""}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(null);

  if (active) {
    const { Component } = active;
    return (
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <button style={styles.back} onClick={() => setActive(null)}>
          ← Back
        </button>
        <Suspense
          fallback={
            <div style={styles.spinner}>
              <span>⏳</span> Loading {active.label}…
            </div>
          }
        >
          <Component />
        </Suspense>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <p style={styles.course}>ART-CMPSC 297 · Penn State · Spring 2026</p>
        <h1 style={styles.title}>AI in Art</h1>
        <p style={styles.subtitle}>{LECTURES.length} lectures &amp; labs — in order</p>
      </header>

      <div style={styles.list}>
        {LECTURES.map((lec, i) => (
          <TimelineRow
            key={lec.id}
            lecture={lec}
            index={i}
            total={LECTURES.length}
            onClick={setActive}
          />
        ))}
      </div>
    </div>
  );
}
