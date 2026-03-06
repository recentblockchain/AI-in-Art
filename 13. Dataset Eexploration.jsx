import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const AGENDA = [
  { id: "hook",     label: "Hook",            time: "0–5 min",   color: "#FF3D00", icon: "⚡" },
  { id: "lecture",  label: "Lecture",          time: "5–30 min",  color: "#FF9100", icon: "📖" },
  { id: "demo",     label: "Live Demo",        time: "30–40 min", color: "#FFEA00", icon: "🖥️" },
  { id: "activity", label: "Activity",         time: "40–75 min", color: "#00E676", icon: "✂️" },
  { id: "critique", label: "Critique",         time: "75–88 min", color: "#00B0FF", icon: "🗣️" },
  { id: "wrap",     label: "Wrap + Exit",      time: "88–90 min", color: "#D500F9", icon: "🎯" },
];

const SLIDES = [
  {
    num: "01",
    title: "What Is a Dataset?",
    color: "#FF3D00",
    bullets: [
      "A dataset = any curated collection of examples (images, sounds, text, video).",
      "Studio analogy: your reference library, mood board, or sketchbook studies.",
      "AI learns by studying thousands of examples — exactly like you do.",
      "Garbage in → garbage out. Quality of your dataset = quality of your output.",
    ],
    teacherNote: "Ask: 'How many of you have saved a Pinterest board or Behance collection? Congrats — you've built a dataset.'",
  },
  {
    num: "02",
    title: "Dataset Exploration Defined",
    color: "#FF9100",
    bullets: [
      "Understanding what's INSIDE a dataset before you use it.",
      "Size, variety, quality, labels/metadata, distributions.",
      "Missing cases, duplicates, outliers, ethical / copyright risks.",
      "Think of it as a curator's audit before hanging a show.",
    ],
    teacherNote: "Analogy: a museum curator doesn't hang every piece they're given — they study, assess, and select.",
  },
  {
    num: "03",
    title: "Why Artists & Designers Should Care",
    color: "#FFD600",
    bullets: [
      "Creative direction: your data steers the aesthetic of every output.",
      "Consistency: a coherent dataset = coherent results.",
      "Fairness: avoid unintentional stereotypes baked into your work.",
      "Control: better data = better prompting and generation control.",
    ],
    teacherNote: "If time allows, show two outputs: one from a sloppy mixed dataset vs. one from a curated one.",
  },
  {
    num: "04",
    title: "The Studio EDA Pipeline (9 Steps)",
    color: "#00E676",
    bullets: [
      "1 Define creative goal  2 Collect ethically  3 Organize folders",
      "4 Quick audit (dupes, low-res, watermarks)  5 Tag/label",
      "6 Measure variety (counts, distributions)  7 Visual scan",
      "8 Risk/bias check  9 Decide next action",
    ],
    teacherNote: "Hand out the checklist now. Walk through each step with a real folder on screen.",
  },
  {
    num: "05",
    title: "Data in AR / Spatial Media",
    color: "#00B0FF",
    bullets: [
      "Object recognition: training data must match the real environment.",
      "Depth & scene understanding: diverse spatial datasets prevent anchoring failures.",
      "Occlusion realism: AI needs varied lighting + angle data to fake depth.",
      "3D asset libraries: consistency in poly-count and texture scale matters.",
    ],
    teacherNote: "Example: Snapchat face filters trained mostly on lighter skin tones early on → poor tracking on darker skin.",
  },
  {
    num: "06",
    title: "Data in Media Production & Design",
    color: "#7C4DFF",
    bullets: [
      "Media: shot libraries, captions, motion capture, reference footage for editing + personalization.",
      "Design: UI analytics, brand asset libraries, user research → consistency + iteration speed.",
      "Audience engagement data shapes what personalized content gets surfaced.",
      "A well-labeled shot library saves hours in post-production.",
    ],
    teacherNote: "Ask: 'Has anyone ever had a client brand that felt inconsistent? That's a dataset problem.'",
  },
  {
    num: "07",
    title: "How AI Creates Images & Video",
    color: "#F50057",
    bullets: [
      "Training: AI studies millions of examples and learns statistical patterns.",
      "Inference: AI uses those learned patterns to generate NEW images from a prompt.",
      "Style transfer: applies visual 'style' from one image onto another's content.",
      "Diffusion models: start from noise, iteratively refine guided by learned data.",
    ],
    teacherNote: "Keep this HIGH-LEVEL. Students don't need to know backprop — they need the intuition.",
  },
  {
    num: "08",
    title: "Patterns & Bias in Datasets",
    color: "#FF6D00",
    bullets: [
      "Selection bias: what you included or excluded by choice or accident.",
      "Representation bias: who/what appears more — gendered, raced, cultural defaults.",
      "Aesthetic bias: one lighting style, palette, or composition dominates.",
      "Historical/cultural bias: Western-centric references, appropriation risks.",
      "Technical bias: resolution gaps, compression artifacts, camera type skew.",
    ],
    teacherNote: "Show a real example: search 'CEO' in stock photos vs. 'nurse.' Note the demographic defaults.",
  },
  {
    num: "09",
    title: "Activity: Curate → Explore → Stylize → Critique",
    color: "#00BFA5",
    bullets: [
      "A) Pick a theme (urban textures / portrait lighting / nature patterns etc.).",
      "B) Curate 50–100 images using the checklist.",
      "C) Choose 1 style image → run TF Style Transfer in Google Colab.",
      "D) Export a before/after grid.",
      "E) Reflect: What changed? What did your dataset 'push' the AI to do?",
    ],
    teacherNote: "Demo the Colab notebook BEFORE students start. Have a backup Runway/Fotor URL ready.",
  },
  {
    num: "10",
    title: "Critique + Reflection Framework",
    color: "#AEEA00",
    bullets: [
      "'What did you expect vs. what happened?'",
      "'Where did your dataset bias show up in the output?'",
      "'What would you change in your curation?'",
      "Peer feedback: what's one strength and one revision needed?",
    ],
    teacherNote: "Encourage students to treat AI outputs as a mirror of their curation choices, not a magic box.",
  },
];

const EDA_STEPS = [
  { step: "01", title: "Define Creative Goal",    desc: "What style, mood, or outcome are you targeting? Write it down in one sentence.",                          icon: "🎯" },
  { step: "02", title: "Collect Ethically",        desc: "Use original work, licensed images, or public domain. Note the source and permissions for every image.",   icon: "⚖️" },
  { step: "03", title: "Organize",                 desc: "Create clear folder names, use consistent file naming (e.g., urban_texture_001.jpg), keep one format.",    icon: "📁" },
  { step: "04", title: "Quick Audit",              desc: "Delete duplicates, low-resolution images (<512px), watermarked, blurry, or off-topic files.",              icon: "🔍" },
  { step: "05", title: "Tag & Label",              desc: "For each image note: subject, mood, dominant palette, era, camera angle, medium.",                          icon: "🏷️" },
  { step: "06", title: "Measure Variety",          desc: "Count images per category. Note what's over- or under-represented. Aim for balance.",                      icon: "📊" },
  { step: "07", title: "Visual Scan",              desc: "Lay images out as a contact sheet or mood-board grid. Look for unexpected patterns and outliers.",          icon: "👁️" },
  { step: "08", title: "Risk / Bias Check",        desc: "Apply the Bias Spotting Checklist. Ask: who is missing? What assumptions does this dataset encode?",        icon: "⚠️" },
  { step: "09", title: "Decide Next Action",       desc: "Balance dataset, add missing examples, refine creative goal, or proceed with confidence.",                  icon: "✅" },
];

const BIAS_CHECKLIST = [
  { id: "b1",  label: "Selection Bias",       desc: "Did you unconsciously favor certain images because they were easy to find or already familiar?" },
  { id: "b2",  label: "Representation Bias",  desc: "Are certain people, cultures, body types, or skin tones over- or under-represented?" },
  { id: "b3",  label: "Aesthetic Bias",        desc: "Does one color palette, lighting style, or composition dominate your dataset?" },
  { id: "b4",  label: "Cultural Bias",         desc: "Are references predominantly from one cultural tradition (often Western/Euro-centric)?" },
  { id: "b5",  label: "Technical Bias",        desc: "Do images vary widely in resolution, compression, or camera type in ways that skew results?" },
  { id: "b6",  label: "Gendered Defaults",     desc: "Does your dataset encode assumptions about gender roles, bodies, or occupations?" },
  { id: "b7",  label: "Missing Context",       desc: "Are there subject types, environments, or scenarios completely absent from your data?" },
  { id: "b8",  label: "Era Bias",              desc: "Does your dataset skew toward one historical period, making outputs feel anachronistic?" },
  { id: "b9",  label: "Copyright Risk",        desc: "Have you verified that all images are licensed or public domain for your use case?" },
  { id: "b10", label: "Consent Risk",          desc: "Do any images include people whose consent for AI training was not obtained?" },
  { id: "b11", label: "Output Shift",          desc: "After stylizing, do faces/skin tones/body types look different from your originals?" },
  { id: "b12", label: "Default Beauty",        desc: "Does AI seem to 'improve' faces toward a narrow beauty standard? Flag it." },
];

const COLAB_STEPS = [
  { n: "1", title: "Open the Notebook",       desc: "Go to the link: colab.research.google.com → click Runtime → Run All to initialize." },
  { n: "2", title: "Sign in to Google",       desc: "You need a Google account. The notebook runs entirely in the browser — no installs." },
  { n: "3", title: "Upload Content Images",   desc: "In the left sidebar → Files → Upload. Upload your curated dataset images one at a time or as a zip." },
  { n: "4", title: "Upload Style Image",      desc: "Upload your chosen style reference (a painting, texture, or artwork you own/licensed)." },
  { n: "5", title: "Set File Paths",          desc: "In Cell 2, update content_path and style_path variables to match your uploaded file names." },
  { n: "6", title: "Adjust Parameters",       desc: "style_weight controls intensity (higher = more style). content_weight controls preservation. Start 1e4 / 1e2." },
  { n: "7", title: "Run Style Transfer",      desc: "Run Cell 3 onward. Each image takes ~1–3 min on Colab's free GPU. Watch the loss decrease." },
  { n: "8", title: "Loop Over Dataset",       desc: "For batch: copy the style transfer cell into a for-loop over your image list (instructor will demo this)." },
  { n: "9", title: "Download Outputs",        desc: "Right-click each output image in the Files panel → Download. Or use files.download('name.jpg')." },
];

const RUBRIC = [
  { criterion: "Curation Craft",     max: 25, desc: "50–100 images collected; organized with consistent naming; ethical sourcing documented." },
  { criterion: "Dataset Exploration",max: 25, desc: "Checklist fully completed; variety counted; visual scan documented with notes." },
  { criterion: "Bias Documentation", max: 25, desc: "Bias checklist applied; at least 3 biases identified and reflected on in writing." },
  { criterion: "Output + Reflection",max: 25, desc: "Before/after grid assembled; written reflection addresses dataset influence on outputs." },
];

const EXIT_TICKET = [
  { q: "1", text: "Name ONE bias type you found in your dataset and describe how it appeared in your stylized outputs." },
  { q: "2", text: "What is ONE thing you would change about your curation process if you ran this activity again?" },
  { q: "3", text: "In your own words: why does dataset exploration matter before using AI tools in a design project?" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const Tag = ({ text, color }) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: "2px",
    background: color + "22", border: `1px solid ${color}66`,
    color, fontSize: "11px", fontFamily: "'Space Mono', monospace", fontWeight: 700,
    letterSpacing: "0.08em", textTransform: "uppercase",
  }}>{text}</span>
);

const SectionHeader = ({ number, title, accent }) => (
  <div style={{ marginBottom: "28px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      <span style={{
        fontFamily: "'Space Mono', monospace", fontSize: "11px",
        color: accent, letterSpacing: "0.2em", opacity: 0.7,
      }}>§{number}</span>
      <div style={{ flex: 1, height: "1px", background: `${accent}33` }} />
    </div>
    <h2 style={{
      margin: "8px 0 0 0", fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900,
      color: "#F0EAD6", letterSpacing: "-0.02em", lineHeight: 1.1,
    }}>{title}</h2>
  </div>
);

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function LessonPlan() {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeSlide, setActiveSlide] = useState(0);
  const [checkedBias, setCheckedBias] = useState({});
  const [checkedEDA, setCheckedEDA] = useState({});
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeAgenda, setActiveAgenda] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const navItems = [
    { id: "overview",  label: "Overview" },
    { id: "agenda",    label: "Agenda" },
    { id: "slides",    label: "Slides" },
    { id: "eda",       label: "EDA Pipeline" },
    { id: "colab",     label: "Colab Guide" },
    { id: "bias",      label: "Bias Checklist" },
    { id: "rubric",    label: "Rubric" },
    { id: "exit",      label: "Exit Ticket" },
  ];

  const accent = "#FF3D00";

  const styles = {
    root: {
      minHeight: "100vh",
      background: "#0D0B07",
      color: "#F0EAD6",
      fontFamily: "'Georgia', serif",
      position: "relative",
    },
    header: {
      borderBottom: "1px solid #2A2620",
      padding: "0 32px",
      background: "#0D0B07",
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", gap: "40px",
      backdropFilter: "blur(12px)",
    },
    logo: {
      fontFamily: "'Space Mono', monospace", fontSize: "11px",
      color: accent, letterSpacing: "0.2em", textTransform: "uppercase",
      padding: "18px 0", borderRight: "1px solid #2A2620", paddingRight: "32px",
      whiteSpace: "nowrap",
    },
    nav: { display: "flex", gap: "0", overflowX: "auto", flex: 1 },
    navBtn: (active) => ({
      padding: "18px 20px", background: "none", border: "none",
      cursor: "pointer", color: active ? "#F0EAD6" : "#6B6560",
      fontFamily: "'Space Mono', monospace", fontSize: "11px",
      letterSpacing: "0.1em", textTransform: "uppercase",
      borderBottom: active ? `2px solid ${accent}` : "2px solid transparent",
      transition: "all 0.15s", whiteSpace: "nowrap",
    }),
    main: { maxWidth: "1100px", margin: "0 auto", padding: "48px 32px" },
    card: (bg = "#161310") => ({
      background: bg, border: "1px solid #2A2620",
      borderRadius: "4px", padding: "28px",
      marginBottom: "20px",
    }),
    accentCard: (color) => ({
      background: color + "08",
      border: `1px solid ${color}33`,
      borderLeft: `3px solid ${color}`,
      borderRadius: "0 4px 4px 0",
      padding: "20px 24px", marginBottom: "16px",
    }),
  };

  // ── OVERVIEW ──
  const renderOverview = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "Duration", value: "90 Minutes", icon: "⏱" },
          { label: "Audience", value: "Beginner → Intermediate", icon: "👥" },
          { label: "Primary Tool", value: "TF Style Transfer (Colab)", icon: "🔧" },
          { label: "Activity", value: "Curate → Explore → Stylize → Critique", icon: "✂️" },
        ].map(({ label, value, icon }) => (
          <div key={label} style={styles.card()}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#6B6560", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>{icon} {label}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#F0EAD6" }}>{value}</div>
          </div>
        ))}
      </div>

      <SectionHeader number="1" title="Lesson Goals" accent={accent} />
      <div style={{ display: "grid", gap: "12px", marginBottom: "40px" }}>
        {[
          ["Analogy-first definition", "Explain dataset exploration using studio language — reference library, mood board, sketchbook."],
          ["Repeatable process", "Teach a 9-step Studio EDA pipeline students can apply to any future project."],
          ["Cross-discipline context", "Concrete examples of why data matters in AR, media, and design."],
          ["AI mechanics", "How training vs. inference works; style transfer vs. diffusion — no math required."],
          ["Hands-on output", "Students batch-stylize 50–100 images using TensorFlow Colab and reflect critically."],
          ["Bias literacy", "Students identify and document at least 3 types of bias in their own dataset."],
        ].map(([title, desc], i) => (
          <div key={i} style={styles.accentCard(accent)}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: accent, minWidth: "24px", paddingTop: "2px" }}>G{i + 1}</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: "3px", fontSize: "14px" }}>{title}</div>
                <div style={{ color: "#A09890", fontSize: "13px", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionHeader number="2" title="Materials Required" accent="#00B0FF" />
      <div style={styles.card()}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            ["🖥️ Hardware", "Laptops (1 per student or per pair), stable internet connection, projector or screen share for demo."],
            ["📁 Shared Folder", "Google Drive or class server folder for image uploads and output collection."],
            ["🖼️ Image Sources", "Unsplash, Wikimedia Commons, student's own photos, Library of Congress (public domain)."],
            ["🔗 Primary Tool", "Google Colab — tensorflow.org style transfer notebook (free, no install)."],
            ["🔧 Fallback Tools", "Runway (app.runwayml.com) or Fotor (fotor.com/features/ai-art-generator) if Colab fails."],
            ["📋 Handouts", "EDA Checklist + Bias Checklist (included in this plan — print or share digitally)."],
          ].map(([title, desc]) => (
            <div key={title} style={{ borderTop: "1px solid #2A2620", paddingTop: "14px" }}>
              <div style={{ fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>{title}</div>
              <div style={{ color: "#A09890", fontSize: "12px", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionHeader number="3" title="Setup Instructions" accent="#00E676" />
      <div style={styles.card()}>
        <div style={{ display: "grid", gap: "10px" }}>
          {[
            "Create folders: /content_images/ and /style_images/ and /outputs/ before class.",
            "Suggested image resolution: 512px × 512px to 1024px × 1024px. Avoid mixing very large with very small.",
            "File format: .jpg or .png only. Rename files before upload (e.g., urban_001.jpg).",
            "Instructor should pre-run the Colab notebook and confirm GPU allocation (Runtime → Change runtime type → GPU).",
            "Have a backup zip of 20 demo images ready in case student internet is slow.",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid #1E1C18", fontSize: "13px", color: "#C8C0B0", lineHeight: 1.6 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", color: "#00E676", minWidth: "20px", fontSize: "10px", paddingTop: "3px" }}>{String(i + 1).padStart(2, "0")}</span>
              {tip}
            </div>
          ))}
        </div>
      </div>

      <SectionHeader number="4" title="Safety & Ethics Note" accent="#F50057" />
      <div style={{ ...styles.accentCard("#F50057"), padding: "24px 28px" }}>
        <div style={{ fontSize: "13px", lineHeight: 1.8, color: "#D0C8B8" }}>
          <p style={{ margin: "0 0 12px 0" }}><strong style={{ color: "#F0EAD6" }}>Copyright:</strong> Only use images you created, licensed (Creative Commons, CC0), or confirmed public domain. Never use watermarked, rights-reserved, or scraped commercial images without permission.</p>
          <p style={{ margin: "0 0 12px 0" }}><strong style={{ color: "#F0EAD6" }}>Consent:</strong> Do not include photographs of real, identifiable people without their knowledge. Avoid images scraped from social media without consent. Do not use images of minors.</p>
          <p style={{ margin: "0 0 12px 0" }}><strong style={{ color: "#F0EAD6" }}>Sensitive imagery:</strong> Avoid images depicting violence, nudity, or culturally sacred objects as training material without appropriate context and expertise.</p>
          <p style={{ margin: "0" }}><strong style={{ color: "#F0EAD6" }}>Bias accountability:</strong> Students should document and disclose when their outputs exhibit biased tendencies — this is not failure, it is critical data literacy.</p>
        </div>
      </div>
    </div>
  );

  // ── AGENDA ──
  const renderAgenda = () => (
    <div>
      <SectionHeader number="2" title="Minute-by-Minute Agenda" accent={accent} />
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "28px", color: accent, letterSpacing: "0.05em" }}>{fmt(timerSeconds)}</div>
        <button onClick={() => setTimerRunning(r => !r)} style={{ background: timerRunning ? "#FF3D0020" : "#00E67620", border: `1px solid ${timerRunning ? "#FF3D00" : "#00E676"}`, color: timerRunning ? "#FF3D00" : "#00E676", padding: "8px 20px", borderRadius: "2px", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em" }}>
          {timerRunning ? "PAUSE" : "START"}
        </button>
        <button onClick={() => { setTimerRunning(false); setTimerSeconds(0); }} style={{ background: "none", border: "1px solid #2A2620", color: "#6B6560", padding: "8px 20px", borderRadius: "2px", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em" }}>RESET</button>
      </div>

      {AGENDA.map((item, i) => (
        <div key={item.id} onClick={() => setActiveAgenda(i)} style={{ cursor: "pointer", marginBottom: "12px" }}>
          <div style={{ ...styles.card(activeAgenda === i ? item.color + "12" : "#161310"), borderColor: activeAgenda === i ? item.color + "55" : "#2A2620", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
              <div style={{ background: item.color + "20", border: `1px solid ${item.color}44`, borderRadius: "3px", padding: "10px 16px", textAlign: "center", minWidth: "80px" }}>
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>{item.icon}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: item.color, letterSpacing: "0.1em" }}>{item.time}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: "#F0EAD6", marginBottom: "8px" }}>{item.label}</div>
                {activeAgenda === i && <AgendaDetail id={item.id} color={item.color} />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const AgendaDetail = ({ id, color }) => {
    const details = {
      hook: {
        script: "Hold up your phone. 'How many photos do you have on here right now? 500? 3,000? 10,000? Congratulations — you've built a dataset. The question isn't whether you have data. The question is: do you know what's in it — and what it's quietly teaching an AI to do?'",
        activities: ["Show a side-by-side: a generative image made from a sloppy dataset vs. a curated one.", "Ask students to guess which is which and why."],
        tip: "Energy matters here. Speak fast, make eye contact. The goal is curiosity, not information yet.",
      },
      lecture: {
        script: "Walk through Slides 01–08 using the talk track. Pause after Slide 04 to distribute handouts. Use the studio analogy throughout: your reference library is your dataset. The curator's eye is your EDA process.",
        activities: ["10 min: Slides 01–04 (definition + process)", "8 min: Slides 05–06 (AR, media, design)", "7 min: Slides 07–08 (AI mechanics + bias intro)"],
        tip: "If students seem lost on AI mechanics, skip the diffusion explanation and focus on the 'pattern recognition' analogy.",
      },
      demo: {
        script: "Screen share the Colab notebook. Walk through opening, running cells, uploading 3 demo images, setting style image, running style transfer on one image, downloading the output. Narrate each step.",
        activities: ["Open: colab.research.google.com → search 'Neural Style Transfer TensorFlow'", "Show runtime setup (GPU), cell execution order, file upload sidebar.", "Run one image live — students watch the optimization steps."],
        tip: "Have the notebook already loaded and GPU connected before class. Colab can take 2–3 min to spin up.",
      },
      activity: {
        script: "Students work independently or in pairs. Circulate and check: Are they completing the EDA checklist? Do they have enough variety in their dataset? Is their style image appropriate quality?",
        activities: ["0–10 min: Curate 50–100 images to a theme (urban textures, portrait lighting, nature patterns, editorial typography, product shots).", "10–20 min: Complete EDA checklist. Count categories. Note biases.", "20–35 min: Upload to Colab, run style transfer on at least 10–20 images, download outputs.", "Export a before/after grid (Canva, Figma, or simple screenshot grid)."],
        tip: "Remind students: quality over quantity. 50 well-chosen images beat 200 random ones.",
      },
      critique: {
        script: "3–4 students share their before/after grids. Use the critique questions: What changed? What stayed consistent? What did the dataset push the AI to do? Where do you see bias showing up?",
        activities: ["Each presenter gets 2 min to show work + 1 min peer feedback.", "Class discussion: What patterns emerged across all the datasets?"],
        tip: "Celebrate the failures and surprises — they're the most instructive moments.",
      },
      wrap: {
        script: "Summarize the key takeaway: your data is your creative voice. Before you use any AI tool, audit what you're feeding it. Hand out (or post) the exit ticket.",
        activities: ["60-second recap of the 9-step EDA pipeline.", "Exit ticket: 3 written questions (see Exit Ticket section)."],
        tip: "If time is short, do the exit ticket verbally as a quick-fire round.",
      },
    };
    const d = details[id];
    return (
      <div style={{ borderTop: `1px solid ${color}22`, paddingTop: "14px", marginTop: "4px" }}>
        <div style={{ background: color + "0A", border: `1px solid ${color}22`, borderRadius: "3px", padding: "14px 16px", marginBottom: "12px" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color, letterSpacing: "0.15em", marginBottom: "6px" }}>TEACHER SCRIPT</div>
          <div style={{ fontSize: "13px", color: "#C8C0B0", lineHeight: 1.7, fontStyle: "italic" }}>{d.script}</div>
        </div>
        <div style={{ marginBottom: "10px" }}>
          {d.activities.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", fontSize: "13px", color: "#A09890", lineHeight: 1.6, padding: "4px 0" }}>
              <span style={{ color, fontFamily: "'Space Mono', monospace", fontSize: "10px", paddingTop: "2px" }}>→</span> {a}
            </div>
          ))}
        </div>
        <div style={{ background: "#1E1C18", borderRadius: "2px", padding: "10px 14px", fontSize: "12px", color: "#FFD600", fontStyle: "italic" }}>
          💡 Teacher note: {d.tip}
        </div>
      </div>
    );
  };

  // ── SLIDES ──
  const renderSlides = () => (
    <div>
      <SectionHeader number="3" title="Slide Deck Outline" accent={accent} />
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => setActiveSlide(i)} style={{ background: activeSlide === i ? s.color + "20" : "none", border: `1px solid ${activeSlide === i ? s.color : "#2A2620"}`, color: activeSlide === i ? s.color : "#6B6560", padding: "6px 14px", borderRadius: "2px", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.1em" }}>
            {s.num}
          </button>
        ))}
      </div>
      {SLIDES.map((slide, i) => (
        <div key={i} style={{ display: activeSlide === i ? "block" : "none" }}>
          <div style={{ ...styles.card(), borderColor: slide.color + "44", borderTop: `3px solid ${slide.color}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: slide.color, letterSpacing: "0.2em", marginBottom: "6px" }}>SLIDE {slide.num} / {SLIDES.length.toString().padStart(2, "0")}</div>
                <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 900, color: "#F0EAD6" }}>{slide.title}</h3>
              </div>
              <Tag text="Talk Track" color={slide.color} />
            </div>
            <div style={{ display: "grid", gap: "8px", marginBottom: "20px" }}>
              {slide.bullets.map((b, j) => (
                <div key={j} style={{ display: "flex", gap: "12px", padding: "12px 14px", background: "#0D0B07", borderRadius: "2px", fontSize: "13px", color: "#C8C0B0", lineHeight: 1.7 }}>
                  <span style={{ color: slide.color, fontFamily: "'Space Mono', monospace", fontSize: "10px", paddingTop: "3px", minWidth: "16px" }}>•</span>
                  {b}
                </div>
              ))}
            </div>
            <div style={{ background: "#FFD60010", border: "1px solid #FFD60033", borderRadius: "2px", padding: "12px 16px", fontSize: "12px", color: "#FFD600", fontStyle: "italic" }}>
              💡 {slide.teacherNote}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
            <button onClick={() => setActiveSlide(i => Math.max(0, i - 1))} disabled={i === 0} style={{ background: "none", border: "1px solid #2A2620", color: i === 0 ? "#3A3630" : "#6B6560", padding: "8px 20px", borderRadius: "2px", cursor: i === 0 ? "default" : "pointer", fontFamily: "'Space Mono', monospace", fontSize: "10px" }}>← PREV</button>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#6B6560", padding: "8px 0" }}>{i + 1} of {SLIDES.length}</span>
            <button onClick={() => setActiveSlide(i => Math.min(SLIDES.length - 1, i + 1))} disabled={i === SLIDES.length - 1} style={{ background: "none", border: "1px solid #2A2620", color: i === SLIDES.length - 1 ? "#3A3630" : "#6B6560", padding: "8px 20px", borderRadius: "2px", cursor: i === SLIDES.length - 1 ? "default" : "pointer", fontFamily: "'Space Mono', monospace", fontSize: "10px" }}>NEXT →</button>
          </div>
        </div>
      ))}
    </div>
  );

  // ── EDA ──
  const renderEDA = () => (
    <div>
      <SectionHeader number="4" title="Studio EDA Pipeline — 9 Steps" accent="#00E676" />
      <div style={{ marginBottom: "16px", color: "#A09890", fontSize: "13px", lineHeight: 1.7 }}>
        EDA = Exploratory Data Analysis. In a studio context, think of it as your curatorial process — the methodical study of your materials before you begin making. Check off each step as you complete it.
      </div>
      {EDA_STEPS.map((step) => (
        <div key={step.step} onClick={() => setCheckedEDA(c => ({ ...c, [step.step]: !c[step.step] }))} style={{ cursor: "pointer", marginBottom: "10px" }}>
          <div style={{ ...styles.card(checkedEDA[step.step] ? "#00E67608" : "#161310"), borderColor: checkedEDA[step.step] ? "#00E67644" : "#2A2620", transition: "all 0.15s" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "2px", border: `2px solid ${checkedEDA[step.step] ? "#00E676" : "#3A3630"}`, background: checkedEDA[step.step] ? "#00E676" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px", transition: "all 0.15s" }}>
                {checkedEDA[step.step] && <span style={{ color: "#0D0B07", fontSize: "13px", fontWeight: 900 }}>✓</span>}
              </div>
              <div style={{ fontSize: "22px", marginTop: "-2px" }}>{step.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#00E676", letterSpacing: "0.1em" }}>STEP {step.step}</span>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: checkedEDA[step.step] ? "#00E676" : "#F0EAD6", textDecoration: checkedEDA[step.step] ? "line-through" : "none", opacity: checkedEDA[step.step] ? 0.7 : 1 }}>{step.title}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#A09890", lineHeight: 1.7 }}>{step.desc}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "right", fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#00E676", marginTop: "8px" }}>
        {Object.values(checkedEDA).filter(Boolean).length} / {EDA_STEPS.length} steps complete
      </div>
    </div>
  );

  // ── COLAB ──
  const renderColab = () => (
    <div>
      <SectionHeader number="5" title="TensorFlow Style Transfer — Colab Guide" accent="#00B0FF" />
      <div style={styles.card()}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#00B0FF", letterSpacing: "0.15em", marginBottom: "10px" }}>WHAT IT IS</div>
        <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#C8C0B0", lineHeight: 1.7 }}>
          Google Colab is a free, browser-based coding environment that runs entirely in the cloud. You don't install anything — you just open a link and run code cells. TensorFlow's Neural Style Transfer notebook uses a pre-trained AI model to blend the visual style of one image (e.g., a Van Gogh painting) into the content of another (your photo).
        </p>
        <a href="https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/generative/style_transfer.ipynb" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#00B0FF15", border: "1px solid #00B0FF44", color: "#00B0FF", padding: "10px 20px", borderRadius: "2px", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textDecoration: "none" }}>
          → OPEN NOTEBOOK IN COLAB
        </a>
      </div>

      <div style={{ marginTop: "24px" }}>
        {COLAB_STEPS.map((step) => (
          <div key={step.n} style={{ ...styles.accentCard("#00B0FF"), display: "flex", gap: "18px" }}>
            <div style={{ background: "#00B0FF15", border: "1px solid #00B0FF33", borderRadius: "2px", minWidth: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: "14px", fontWeight: 700, color: "#00B0FF", flexShrink: 0 }}>{step.n}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px", color: "#F0EAD6" }}>{step.title}</div>
              <div style={{ fontSize: "13px", color: "#A09890", lineHeight: 1.7 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...styles.card("#1A0505"), borderColor: "#F5005733", marginTop: "20px" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#F50057", letterSpacing: "0.15em", marginBottom: "10px" }}>⚠️ NO-CODE FALLBACK OPTIONS</div>
        <div style={{ fontSize: "13px", color: "#C8C0B0", lineHeight: 1.8 }}>
          If Colab fails or is too technically challenging for some students, use these alternatives — they require no code:
          <div style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
            {[
              ["Runway", "app.runwayml.com", "Free tier. Upload image + style → instant stylized output. Very beginner-friendly."],
              ["Fotor AI Art", "fotor.com", "Web-based, no account required. Limited fine-grained control but fast for demos."],
            ].map(([name, url, desc]) => (
              <div key={name} style={{ background: "#0D0B07", borderRadius: "2px", padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "3px" }}>
                  <strong style={{ color: "#F0EAD6", fontSize: "13px" }}>{name}</strong>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#F50057", alignSelf: "center" }}>{url}</span>
                </div>
                <div style={{ color: "#7A7060", fontSize: "12px" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── BIAS ──
  const renderBias = () => (
    <div>
      <SectionHeader number="6" title="Bias Spotting Checklist" accent="#FF9100" />
      <div style={{ ...styles.card(), marginBottom: "24px", fontSize: "13px", color: "#A09890", lineHeight: 1.7 }}>
        Bias doesn't mean your dataset is bad — it means it reflects a perspective. The goal is to <em style={{ color: "#F0EAD6" }}>know</em> that perspective and make conscious choices about it. Work through this checklist after completing your EDA pipeline. Check items you have reviewed; note findings in your documentation.
      </div>
      {BIAS_CHECKLIST.map((item) => (
        <div key={item.id} onClick={() => setCheckedBias(c => ({ ...c, [item.id]: !c[item.id] }))} style={{ cursor: "pointer", marginBottom: "8px" }}>
          <div style={{ ...styles.card(checkedBias[item.id] ? "#FF910008" : "#161310"), borderColor: checkedBias[item.id] ? "#FF910044" : "#2A2620", transition: "all 0.15s" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "1px", border: `2px solid ${checkedBias[item.id] ? "#FF9100" : "#3A3630"}`, background: checkedBias[item.id] ? "#FF9100" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px", transition: "all 0.15s" }}>
                {checkedBias[item.id] && <span style={{ color: "#0D0B07", fontSize: "11px", fontWeight: 900 }}>✓</span>}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: checkedBias[item.id] ? "#FF9100" : "#F0EAD6", marginBottom: "3px" }}>{item.label}</div>
                <div style={{ fontSize: "12px", color: "#8A8070", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "right", fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#FF9100", marginTop: "8px" }}>
        {Object.values(checkedBias).filter(Boolean).length} / {BIAS_CHECKLIST.length} items reviewed
      </div>

      <div style={{ marginTop: "32px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: "#F0EAD6", marginBottom: "16px" }}>Bias Examples in Outputs</div>
        {[
          ["Face Transformation", "Style transfer on portrait datasets trained on lighter skin tones may desaturate or alter darker skin tones. Watch for this carefully."],
          ["Default Beauty Standards", "AI models often 'resolve' ambiguous features toward a narrow, Eurocentric beauty standard. Asymmetry and distinctiveness can be erased."],
          ["Gendered Occupation Defaults", "If your reference dataset contains stock photos, 'doctor' images may skew male and 'nurse' female. This gets baked into outputs."],
          ["Western Aesthetic Dominance", "Art history datasets are heavily weighted toward Western European painting traditions. Non-Western aesthetics may be flattened or misrepresented."],
          ["Technical Noise Propagation", "Low-res or heavily compressed images in your dataset introduce artifacts that the style transfer amplifies, creating inconsistent outputs."],
        ].map(([title, desc]) => (
          <div key={title} style={{ ...styles.accentCard("#FF9100"), marginBottom: "10px" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#F0EAD6", marginBottom: "4px" }}>{title}</div>
            <div style={{ fontSize: "12px", color: "#9A9080", lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RUBRIC ──
  const renderRubric = () => (
    <div>
      <SectionHeader number="7" title="Activity Rubric" accent="#7C4DFF" />
      <div style={{ marginBottom: "20px", color: "#A09890", fontSize: "13px", lineHeight: 1.7 }}>
        Activity: <strong style={{ color: "#F0EAD6" }}>Curate → Explore → Stylize → Critique</strong> — Total: 100 points
      </div>
      <div style={{ display: "grid", gap: "14px" }}>
        {RUBRIC.map((r) => (
          <div key={r.criterion} style={styles.card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#F0EAD6" }}>{r.criterion}</div>
              <div style={{ background: "#7C4DFF20", border: "1px solid #7C4DFF44", borderRadius: "2px", padding: "4px 14px", fontFamily: "'Space Mono', monospace", fontSize: "13px", color: "#7C4DFF", fontWeight: 700 }}>{r.max} pts</div>
            </div>
            <div style={{ fontSize: "13px", color: "#A09890", lineHeight: 1.7, borderTop: "1px solid #2A2620", paddingTop: "10px" }}>{r.desc}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "14px" }}>
              {[["Excellent", r.max, "#00E676"], ["Satisfactory", Math.round(r.max * 0.75), "#FF9100"], ["Needs Work", Math.round(r.max * 0.5), "#F50057"]].map(([label, pts, col]) => (
                <div key={label} style={{ background: col + "08", border: `1px solid ${col}22`, borderRadius: "2px", padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: col, letterSpacing: "0.1em", marginBottom: "2px" }}>{label}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "14px", color: col, fontWeight: 700 }}>{pts}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── EXIT TICKET ──
  const renderExit = () => (
    <div>
      <SectionHeader number="8" title="Exit Ticket" accent="#D500F9" />
      <div style={{ marginBottom: "20px", color: "#A09890", fontSize: "13px", lineHeight: 1.7 }}>
        Students complete this in the final 5 minutes. Can be written on paper, submitted via Google Form, or answered verbally in a quick-fire round if time is short.
      </div>
      {EXIT_TICKET.map((q, i) => (
        <div key={i} style={{ ...styles.card(), borderTop: i === 0 ? `3px solid #D500F9` : "1px solid #2A2620", marginBottom: "14px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ background: "#D500F920", border: "1px solid #D500F944", borderRadius: "2px", minWidth: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: "16px", fontWeight: 700, color: "#D500F9", flexShrink: 0 }}>Q{q.q}</div>
            <div>
              <div style={{ fontSize: "15px", color: "#F0EAD6", lineHeight: 1.7 }}>{q.text}</div>
              <div style={{ marginTop: "14px", border: "1px dashed #2A2620", borderRadius: "2px", padding: "12px 14px", minHeight: "60px", color: "#3A3630", fontSize: "12px", fontStyle: "italic" }}>Student response space</div>
            </div>
          </div>
        </div>
      ))}
      <div style={{ ...styles.card("#0D0B07"), border: "1px solid #D500F933", marginTop: "8px" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#D500F9", letterSpacing: "0.15em", marginBottom: "10px" }}>TEACHER NOTE</div>
        <div style={{ fontSize: "13px", color: "#A09890", lineHeight: 1.7 }}>
          Use responses to gauge: (1) Did students internalize the connection between dataset quality and output quality? (2) Can they name specific bias types? (3) Is there residual confusion about what EDA means vs. just "collecting images"? Address gaps in the next session.
        </div>
      </div>
    </div>
  );

  const sections = { overview: renderOverview, agenda: renderAgenda, slides: renderSlides, eda: renderEDA, colab: renderColab, bias: renderBias, rubric: renderRubric, exit: renderExit };

  return (
    <div style={styles.root}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>DATASET<br />EXPLORATION</div>
        <nav style={styles.nav}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} style={styles.navBtn(activeSection === item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#3A3630", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>90 MIN · ART / MEDIA / DESIGN</div>
      </div>

      {/* Hero */}
      {activeSection === "overview" && (
        <div style={{ borderBottom: "1px solid #2A2620", padding: "56px 32px", background: "linear-gradient(135deg, #0D0B07 0%, #1A100A 50%, #0D0B07 100%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "20px", right: "40px", fontFamily: "'Space Mono', monospace", fontSize: "120px", fontWeight: 700, color: "#FF3D00", opacity: "0.04", lineHeight: 1, userSelect: "none" }}>EDA</div>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: accent, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>Lesson Plan · Art / Media / Design</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, color: "#F0EAD6", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "0 0 20px 0", maxWidth: "720px" }}>
              Dataset Exploration in Art, Media & Design
            </h1>
            <p style={{ fontFamily: "'Georgia', serif", fontSize: "16px", color: "#8A8070", lineHeight: 1.7, margin: "0 0 32px 0", maxWidth: "560px", fontStyle: "italic" }}>
              And why it matters for AI, AR, and generative video — a 90-minute studio session for beginner to intermediate students.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {["90 Minutes", "Studio EDA Pipeline", "TF Style Transfer", "Bias Literacy", "Hands-On Activity"].map(tag => (
                <Tag key={tag} text={tag} color={accent} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main style={styles.main}>{sections[activeSection]()}</main>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1E1C18", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#3A3630", letterSpacing: "0.15em" }}>DATASET EXPLORATION · ART / MEDIA / DESIGN</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#3A3630" }}>90-MINUTE LESSON PLAN</div>
      </div>
    </div>
  );
}
