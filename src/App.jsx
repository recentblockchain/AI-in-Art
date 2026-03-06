import React, { useState, Suspense, lazy } from "react";

// Lazy-load each lecture component for performance
const I2VApp            = lazy(() => import("../0.I2V.jsx"));
const DatasetStyleApp   = lazy(() => import("../03. DatasetStyleTransferApp.jsx"));
const VideoLecture      = lazy(() => import("../1. Video.jsx"));
const ImageLecture      = lazy(() => import("../3. Image.jsx"));
const Image2Video       = lazy(() => import("../4.Image-2-Video.jsx"));
const ImageVideoLecture = lazy(() => import("../6. Image Video Lecture.jsx"));
const I2VLecture        = lazy(() => import("../7. I2V-lecture.jsx"));
const Lecture8          = lazy(() => import("../8. Lecture.jsx"));
const DataStructures    = lazy(() => import("../9. Remixed.tsx"));
const AIMInArt          = lazy(() => import("../10. AIM.jsx"));
const AIModularity      = lazy(() => import("../12. AIModularity.jsx"));
const DatasetExploration = lazy(() => import("../14. Dataset Eexploration.jsx"));
const DataStyleTransfer  = lazy(() => import("../15. Data Style Transfer.jsx"));

const LECTURES = [
  { id: "aim-in-art",          label: "AI Modularity in Art",        tag: "Lecture 10", Component: AIMInArt },
  { id: "ai-modularity",       label: "AI Modularity",               tag: "Lecture 12", Component: AIModularity },
  { id: "dataset-exploration", label: "Dataset Exploration",         tag: "Lecture 14", Component: DatasetExploration },
  { id: "data-style-transfer", label: "Data Style Transfer",         tag: "Lecture 15", Component: DataStyleTransfer },
  { id: "i2v-lecture",         label: "Image-to-Video Lecture",      tag: "Lecture 7",  Component: I2VLecture },
  { id: "lecture8",            label: "AI Lecture",                  tag: "Lecture 8",  Component: Lecture8 },
  { id: "data-structures",     label: "Data Structures Game",        tag: "Lecture 9",  Component: DataStructures },
  { id: "dataset-style-app",   label: "Dataset Style Transfer App",  tag: "Lab 3",      Component: DatasetStyleApp },
  { id: "i2v-app",             label: "I2V Interactive App",         tag: "Lab 0",      Component: I2VApp },
  { id: "video-lecture",       label: "Video Lecture",               tag: "Lecture 1",  Component: VideoLecture },
  { id: "image-lecture",       label: "Image Lecture",               tag: "Lecture 3",  Component: ImageLecture },
  { id: "image-2-video",       label: "Image to Video",              tag: "Lecture 4",  Component: Image2Video },
  { id: "image-video-lecture", label: "Image Video Lecture",         tag: "Lecture 6",  Component: ImageVideoLecture },
];

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#fff",
  },
  header: {
    padding: "48px 32px 32px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  course: {
    fontSize: "13px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)",
    marginBottom: "12px",
  },
  title: {
    fontSize: "clamp(28px,5vw,52px)",
    fontWeight: 800,
    background: "linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.55)",
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    margin: "20px 32px",
    transition: "background 0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: "20px",
    padding: "40px 32px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "28px",
    cursor: "pointer",
    transition: "transform 0.2s, background 0.2s, border-color 0.2s",
  },
  cardHover: {
    background: "rgba(255,255,255,0.1)",
    borderColor: "rgba(167,139,250,0.5)",
    transform: "translateY(-4px)",
  },
  tag: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    background: "rgba(167,139,250,0.2)",
    color: "#a78bfa",
    padding: "4px 10px",
    borderRadius: "6px",
    marginBottom: "14px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#fff",
    margin: 0,
  },
  arrow: {
    marginTop: "20px",
    color: "rgba(255,255,255,0.35)",
    fontSize: "20px",
  },
  spinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    fontSize: "16px",
    color: "rgba(255,255,255,0.5)",
    gap: "12px",
  },
};

function Card({ lecture, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(lecture)}
    >
      <div style={styles.tag}>{lecture.tag}</div>
      <h2 style={styles.cardTitle}>{lecture.label}</h2>
      <div style={styles.arrow}>→</div>
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
          ← Back to Lectures
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
        <p style={styles.subtitle}>Select a lecture to explore</p>
      </header>
      <div style={styles.grid}>
        {LECTURES.map((lec) => (
          <Card key={lec.id} lecture={lec} onClick={setActive} />
        ))}
      </div>
    </div>
  );
}
