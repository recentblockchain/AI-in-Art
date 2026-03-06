import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Single-file, self-contained classroom companion for Dataset Exploration + Style Transfer.
 * - No external CSS files
 * - Accessible stepper + keyboard-friendly controls
 * - Drag/drop image curation (50–100)
 * - Duplicate detection (filename + size)
 * - Tagging + distributions + simple HTML/CSS bar chart
 * - Bias & risk checklist + reflection
 * - Colab style-transfer instructions + copy button
 * - Gallery plan (before/after placeholders)
 * - Autosave to localStorage + export summary
 */

export default function DatasetExplorationCompanion() {
  const STORAGE_KEY = "dataset_exploration_companion_v1";

  // ---------- Steps ----------
  const steps = useMemo(
    () => [
      { id: 1, title: "Creative Goal" },
      { id: 2, title: "Curate Dataset" },
      { id: 3, title: "Audit" },
      { id: 4, title: "Quick Tagging" },
      { id: 5, title: "Variety Check" },
      { id: 6, title: "Bias & Risk" },
      { id: 7, title: "Style Transfer" },
      { id: 8, title: "Critique Prep" },
    ],
    []
  );

  const [activeStep, setActiveStep] = useState(1);

  // ---------- Goal ----------
  const [goal, setGoal] = useState({
    projectName: "",
    creativeIntent: "",
    targetAudience: "",
    constraints: "",
  });

  // ---------- Dataset ----------
  /**
   * items: [{
   *   id, file, name, size, type, lastModified,
   *   url,
   *   removed: boolean,
   *   tags: { subject: string, mood: string, palette: string, era: string, extras: string[] }
   * }]
   */
  const [items, setItems] = useState([]);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  // ---------- Tag vocab ----------
  const subjectOptions = [
    "Portrait",
    "Architecture",
    "Nature",
    "Product",
    "Typography",
    "Texture",
    "Street",
    "Abstract",
    "Still Life",
    "Other",
  ];
  const moodOptions = [
    "Calm",
    "Energetic",
    "Dark",
    "Playful",
    "Minimal",
    "Dramatic",
    "Nostalgic",
    "Futuristic",
    "Neutral",
  ];
  const paletteOptions = [
    "Warm",
    "Cool",
    "Monochrome",
    "Pastel",
    "High Contrast",
    "Muted",
    "Vibrant",
    "Earth Tones",
    "Mixed",
  ];
  const eraOptions = [
    "Contemporary",
    "1990s",
    "1980s",
    "Mid-century",
    "Victorian",
    "Classical",
    "Futurist",
    "Unknown",
  ];
  const extraTagSuggestions = [
    "High key",
    "Low key",
    "Soft light",
    "Hard light",
    "Wide angle",
    "Close-up",
    "Symmetry",
    "Grain",
    "B&W",
    "Neon",
  ];

  // ---------- Bias & Risk ----------
  const biasChecklistItems = useMemo(
    () => [
      {
        key: "selection_bias",
        label:
          "Selection bias: Did I over-select images from one source/style because it was easiest to find?",
      },
      {
        key: "representation_bias",
        label:
          "Representation bias: Are certain people/groups/places shown more often than others (or missing entirely)?",
      },
      {
        key: "stereotypes",
        label:
          "Stereotypes: Do images reinforce clichés about gender, race, class, age, or culture?",
      },
      {
        key: "aesthetic_dominance",
        label:
          "Aesthetic dominance: Is one lighting/composition/palette dominating and flattening diversity?",
      },
      {
        key: "cultural_context",
        label:
          "Cultural context: Any risk of appropriation or using sacred/sensitive visuals without context?",
      },
      {
        key: "copyright_consent",
        label:
          "Copyright/consent: Are all images original, licensed, public domain, or used with permission?",
      },
      {
        key: "technical_bias",
        label:
          "Technical bias: Are most images the same resolution/camera type/compression level?",
      },
      {
        key: "labeling_bias",
        label:
          "Labeling bias: Did my tags reflect assumptions (e.g., ‘professional’ vs ‘casual’) that could be unfair?",
      },
      {
        key: "missing_edge_cases",
        label:
          "Missing edge cases: Are rare subjects/angles/lighting conditions excluded (outliers that matter)?",
      },
      {
        key: "safety_sensitivity",
        label:
          "Sensitive content: Any images that could be harmful (graphic, private, or personally identifying)?",
      },
    ],
    []
  );
  const [biasChecks, setBiasChecks] = useState(() => {
    const init = {};
    for (const it of biasChecklistItems) init[it.key] = false;
    return init;
  });
  const [reflection, setReflection] = useState("");

  // ---------- Style Transfer ----------
  const [styleTransfer, setStyleTransfer] = useState({
    colabLink:
      "https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/generative/style_transfer.ipynb",
    styleImageName: "",
    notes: "",
  });

  // ---------- UI ----------
  const [toast, setToast] = useState({ show: false, msg: "" });

  // ---------- Autosave / Load ----------
  useEffect(() => {
    // Load
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.activeStep) setActiveStep(parsed.activeStep);
      if (parsed?.goal) setGoal(parsed.goal);
      if (Array.isArray(parsed?.items)) {
        // Rebuild object URLs from saved minimal metadata isn't possible.
        // We only restore non-file metadata; user will need to re-upload after refresh.
        // We'll keep a light placeholder list to retain tagging/reflection if needed.
        const restored = parsed.items.map((x) => ({
          ...x,
          file: null,
          url: x.url || "",
        }));
        setItems(restored);
      }
      if (parsed?.biasChecks) setBiasChecks(parsed.biasChecks);
      if (typeof parsed?.reflection === "string") setReflection(parsed.reflection);
      if (parsed?.styleTransfer) setStyleTransfer(parsed.styleTransfer);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Save (avoid storing File objects)
    const minimalItems = items.map((x) => ({
      id: x.id,
      name: x.name,
      size: x.size,
      type: x.type,
      lastModified: x.lastModified,
      removed: !!x.removed,
      tags: x.tags,
      // Note: we do not persist file; url will be blank after reload
      url: "",
    }));
    const payload = {
      activeStep,
      goal,
      items: minimalItems,
      biasChecks,
      reflection,
      styleTransfer,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [activeStep, goal, items, biasChecks, reflection, styleTransfer]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      for (const it of items) {
        if (it.url?.startsWith("blob:")) URL.revokeObjectURL(it.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Derived data ----------
  const activeItems = useMemo(
    () => items.filter((x) => !x.removed),
    [items]
  );

  const uploadedCount = activeItems.filter((x) => x.file || x.url).length;

  const warnings = useMemo(() => {
    const w = [];
    if (uploadedCount > 0 && uploadedCount < 50) {
      w.push(`You have ${uploadedCount} images. Target is 50–100.`);
    }
    if (uploadedCount > 100) {
      w.push(`You have ${uploadedCount} images. Target is 50–100. Consider removing some.`);
    }
    const missingFiles = items.some((x) => !x.file && !x.url);
    if (missingFiles) {
      w.push(
        "Some items were restored from autosave without files. Re-upload to see thumbnails and run audit accurately."
      );
    }
    return w;
  }, [uploadedCount, items]);

  const duplicates = useMemo(() => {
    // Duplicate key: name + size
    const map = new Map();
    const dups = []; // [{key, ids: []}]
    for (const it of activeItems) {
      const key = `${(it.name || "").toLowerCase()}__${it.size || 0}`;
      if (!it.name) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it.id);
    }
    for (const [key, ids] of map.entries()) {
      if (ids.length > 1) dups.push({ key, ids });
    }
    return dups;
  }, [activeItems]);

  const tagDistributions = useMemo(() => {
    const dist = {
      subject: {},
      mood: {},
      palette: {},
      era: {},
      extras: {},
    };
    const inc = (obj, k) => {
      if (!k) return;
      obj[k] = (obj[k] || 0) + 1;
    };

    for (const it of activeItems) {
      const t = it.tags || {};
      inc(dist.subject, t.subject);
      inc(dist.mood, t.mood);
      inc(dist.palette, t.palette);
      inc(dist.era, t.era);
      if (Array.isArray(t.extras)) {
        for (const e of t.extras) inc(dist.extras, e);
      }
    }

    const toSorted = (obj) =>
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => ({ label: k, count: v }));

    return {
      subject: toSorted(dist.subject),
      mood: toSorted(dist.mood),
      palette: toSorted(dist.palette),
      era: toSorted(dist.era),
      extras: toSorted(dist.extras),
    };
  }, [activeItems]);

  const completion = useMemo(() => {
    // Lightweight completion signals per step
    const s1 =
      goal.projectName.trim().length > 0 ||
      goal.creativeIntent.trim().length > 0;
    const s2 = uploadedCount >= 1; // allow progress even before 50
    const s3 = true; // audit is informative even if not acted on
    const s4 = activeItems.some((x) => x.tags?.subject || x.tags?.mood || x.tags?.palette || x.tags?.era || (x.tags?.extras || []).length);
    const s5 = activeItems.length >= 1;
    const s6 = reflection.trim().length >= 20; // require reflection
    const s7 = styleTransfer.colabLink.trim().length > 0;
    const s8 = activeItems.length >= 1;

    return { s1, s2, s3, s4, s5, s6, s7, s8 };
  }, [goal, uploadedCount, activeItems, reflection, styleTransfer]);

  const stepStatus = useMemo(() => {
    const map = {
      1: completion.s1,
      2: completion.s2,
      3: completion.s3,
      4: completion.s4,
      5: completion.s5,
      6: completion.s6,
      7: completion.s7,
      8: completion.s8,
    };
    return map;
  }, [completion]);

  // ---------- Helpers ----------
  const uid = () => {
    // Simple unique id
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  };

  const showToast = (msg) => {
    setToast({ show: true, msg });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ show: false, msg: "" }), 2200);
  };

  const normalizeFiles = async (fileList) => {
    const incoming = Array.from(fileList || []).filter((f) => f && f.type && f.type.startsWith("image/"));
    if (incoming.length === 0) {
      showToast("No image files detected.");
      return;
    }

    setItems((prev) => {
      const next = [...prev];
      for (const file of incoming) {
        const id = uid();
        const url = URL.createObjectURL(file);
        next.push({
          id,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          url,
          removed: false,
          tags: {
            subject: "",
            mood: "",
            palette: "",
            era: "",
            extras: [],
          },
        });
      }
      return next;
    });

    showToast(`Added ${incoming.length} image(s).`);
  };

  const onPickFiles = async (e) => {
    const files = e.target.files;
    await normalizeFiles(files);
    e.target.value = "";
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    if (!dt?.files) return;
    await normalizeFiles(dt.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) dropRef.current.setAttribute("data-drag", "true");
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) dropRef.current.removeAttribute("data-drag");
  };

  const toggleRemoved = (id) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, removed: !x.removed } : x))
    );
  };

  const removePermanently = (id) => {
    setItems((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target?.url?.startsWith("blob:")) URL.revokeObjectURL(target.url);
      return prev.filter((x) => x.id !== id);
    });
  };

  const removeAllDuplicatesButKeepOne = () => {
    // For each duplicate group, keep first id and remove others (soft remove)
    const idsToRemove = new Set();
    for (const g of duplicates) {
      const keep = g.ids[0];
      for (let i = 1; i < g.ids.length; i++) idsToRemove.add(g.ids[i]);
      // ensure keep not removed
      idsToRemove.delete(keep);
    }
    if (idsToRemove.size === 0) {
      showToast("No duplicates detected.");
      return;
    }
    setItems((prev) => prev.map((x) => (idsToRemove.has(x.id) ? { ...x, removed: true } : x)));
    showToast(`Marked ${idsToRemove.size} duplicate(s) as removed.`);
  };

  const setTagValue = (id, field, value) => {
    setItems((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        const tags = { ...(x.tags || {}) };
        tags[field] = value;
        if (!Array.isArray(tags.extras)) tags.extras = [];
        return { ...x, tags };
      })
    );
  };

  const toggleExtraTag = (id, tag) => {
    setItems((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        const tags = { ...(x.tags || {}) };
        const extras = new Set(Array.isArray(tags.extras) ? tags.extras : []);
        if (extras.has(tag)) extras.delete(tag);
        else extras.add(tag);
        tags.extras = Array.from(extras);
        return { ...x, tags };
      })
    );
  };

  const bulkTag = (field, value) => {
    // Apply tag to all active items
    setItems((prev) =>
      prev.map((x) => {
        if (x.removed) return x;
        const tags = { ...(x.tags || {}) };
        if (!Array.isArray(tags.extras)) tags.extras = [];
        tags[field] = value;
        return { ...x, tags };
      })
    );
    showToast(`Applied ${field} = "${value}" to active images.`);
  };

  const clearAll = () => {
    // revoke blobs
    for (const it of items) {
      if (it.url?.startsWith("blob:")) URL.revokeObjectURL(it.url);
    }
    setItems([]);
    showToast("Cleared dataset.");
  };

  const resetAll = () => {
    clearAll();
    setGoal({ projectName: "", creativeIntent: "", targetAudience: "", constraints: "" });
    const init = {};
    for (const it of biasChecklistItems) init[it.key] = false;
    setBiasChecks(init);
    setReflection("");
    setStyleTransfer({
      colabLink:
        "https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/generative/style_transfer.ipynb",
      styleImageName: "",
      notes: "",
    });
    setActiveStep(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast("Reset everything.");
  };

  const exportSummary = (format) => {
    const total = items.length;
    const active = activeItems.length;
    const removed = items.filter((x) => x.removed).length;

    const summary = {
      exportedAt: new Date().toISOString(),
      goal,
      dataset: {
        totalItems: total,
        activeItems: active,
        removedItems: removed,
        targetRange: "50–100",
        warnings,
        duplicatesDetected: duplicates.length,
        duplicateGroups: duplicates.map((g) => ({ key: g.key, count: g.ids.length })),
      },
      tags: tagDistributions,
      biasChecklist: biasChecks,
      reflection,
      styleTransfer,
      notes: {
        reminder:
          "If you refreshed the page, files are not restored. Re-upload to regenerate thumbnails and audit details.",
      },
    };

    let blob;
    let filename;

    if (format === "txt") {
      const lines = [];
      lines.push("Dataset Exploration + Style Transfer — Summary");
      lines.push(`Exported: ${summary.exportedAt}`);
      lines.push("");
      lines.push("Creative Goal");
      lines.push(`- Project: ${goal.projectName || "(blank)"}`);
      lines.push(`- Intent: ${goal.creativeIntent || "(blank)"}`);
      lines.push(`- Audience: ${goal.targetAudience || "(blank)"}`);
      lines.push(`- Constraints: ${goal.constraints || "(blank)"}`);
      lines.push("");
      lines.push("Dataset");
      lines.push(`- Total items: ${total}`);
      lines.push(`- Active items: ${active}`);
      lines.push(`- Removed items: ${removed}`);
      lines.push(`- Duplicate groups: ${duplicates.length}`);
      if (warnings.length) {
        lines.push("- Warnings:");
        for (const w of warnings) lines.push(`  • ${w}`);
      }
      lines.push("");
      const printDist = (name, arr) => {
        lines.push(`${name} distribution:`);
        if (!arr.length) lines.push("  (no tags yet)");
        for (const r of arr.slice(0, 25)) lines.push(`  - ${r.label}: ${r.count}`);
        lines.push("");
      };
      printDist("Subject", tagDistributions.subject);
      printDist("Mood", tagDistributions.mood);
      printDist("Palette", tagDistributions.palette);
      printDist("Era", tagDistributions.era);
      if (tagDistributions.extras.length) printDist("Extras", tagDistributions.extras);

      lines.push("Bias & Risk checklist");
      for (const it of biasChecklistItems) {
        lines.push(`- [${biasChecks[it.key] ? "x" : " "}] ${it.label}`);
      }
      lines.push("");
      lines.push("Reflection");
      lines.push(reflection || "(blank)");
      lines.push("");
      lines.push("Style Transfer");
      lines.push(`- Colab link: ${styleTransfer.colabLink}`);
      lines.push(`- Style image name: ${styleTransfer.styleImageName || "(blank)"}`);
      lines.push(`- Notes: ${styleTransfer.notes || "(blank)"}`);

      blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
      filename = "dataset-exploration-summary.txt";
    } else {
      blob = new Blob([JSON.stringify(summary, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      filename = "dataset-exploration-summary.json";
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename}`);
  };

  const goStep = (n) => {
    setActiveStep(n);
    // move focus to heading for accessibility
    requestAnimationFrame(() => {
      const el = document.getElementById("stepHeading");
      if (el) el.focus();
    });
  };

  const nextStep = () => {
    setActiveStep((s) => Math.min(steps.length, s + 1));
    requestAnimationFrame(() => {
      const el = document.getElementById("stepHeading");
      if (el) el.focus();
    });
  };

  const prevStep = () => {
    setActiveStep((s) => Math.max(1, s - 1));
    requestAnimationFrame(() => {
      const el = document.getElementById("stepHeading");
      if (el) el.focus();
    });
  };

  const copyInstructions = async () => {
    const text = buildColabInstructions();
    try {
      await navigator.clipboard.writeText(text);
      showToast("Instructions copied to clipboard.");
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Instructions copied.");
    }
  };

  const buildColabInstructions = () => {
    return [
      "TensorFlow Neural Style Transfer (Google Colab) — Quick Steps",
      "",
      `Colab notebook: ${styleTransfer.colabLink}`,
      `Chosen style image: ${styleTransfer.styleImageName || "(set a name)"}`,
      "",
      "1) Open the Colab link in Chrome (recommended).",
      "2) Sign in to Google if prompted.",
      "3) In Colab: Runtime → Change runtime type → Hardware accelerator: GPU (optional but faster).",
      "4) Run cells from top to bottom (Shift+Enter).",
      "5) Upload ONE style image (the reference look) and your content images.",
      "   - For batch: put 50–100 content images in a folder (zip is often easiest).",
      "6) If the notebook uses a single content image, adapt it by looping over your images.",
      "   - You can ask your instructor/AI to help write a small loop to process a folder.",
      "7) Export outputs to a folder and download results as a zip.",
      "8) Back in class: compare before/after, note what changed and what stayed consistent.",
      "",
      "Common fixes:",
      "- If you hit memory errors: reduce image size (e.g., 512–768px), or process in smaller batches.",
      "- If results look muddy: try a cleaner style image, or reduce style strength if available.",
      "",
      "Ethics & licensing:",
      "- Only use images you created or have rights to use (licensed/public domain/permission).",
    ].join("\n");
  };

  // ---------- Keyboard shortcuts ----------
  useEffect(() => {
    const onKey = (e) => {
      // Alt+Left / Alt+Right to navigate steps
      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        nextStep();
      }
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        prevStep();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Styles ----------
  const styles = {
    page: {
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
      lineHeight: 1.35,
      padding: 16,
      maxWidth: 1180,
      margin: "0 auto",
      color: "#111827",
    },
    card: {
      border: "1px solid #E5E7EB",
      borderRadius: 12,
      padding: 16,
      background: "#FFFFFF",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    row: { display: "flex", gap: 12, flexWrap: "wrap" },
    col: { flex: "1 1 320px", minWidth: 280 },
    label: { display: "block", fontSize: 13, marginBottom: 6, color: "#374151" },
    input: {
      width: "100%",
      border: "1px solid #D1D5DB",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      outline: "none",
    },
    textarea: {
      width: "100%",
      border: "1px solid #D1D5DB",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      outline: "none",
      minHeight: 110,
      resize: "vertical",
    },
    btn: {
      border: "1px solid #D1D5DB",
      background: "#FFFFFF",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      cursor: "pointer",
    },
    btnPrimary: {
      border: "1px solid #111827",
      background: "#111827",
      color: "#FFFFFF",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      cursor: "pointer",
    },
    btnDanger: {
      border: "1px solid #B91C1C",
      background: "#B91C1C",
      color: "#FFFFFF",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      cursor: "pointer",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      border: "1px solid #E5E7EB",
      borderRadius: 999,
      padding: "4px 10px",
      fontSize: 12,
      color: "#374151",
      background: "#F9FAFB",
    },
    warn: {
      border: "1px solid #F59E0B",
      background: "#FFFBEB",
      borderRadius: 12,
      padding: 12,
      color: "#92400E",
      fontSize: 13,
    },
    stepperWrap: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      alignItems: "center",
    },
    stepBtn: (isActive) => ({
      border: `1px solid ${isActive ? "#111827" : "#E5E7EB"}`,
      background: isActive ? "#111827" : "#FFFFFF",
      color: isActive ? "#FFFFFF" : "#111827",
      borderRadius: 999,
      padding: "8px 10px",
      fontSize: 13,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    }),
    dot: (ok) => ({
      width: 10,
      height: 10,
      borderRadius: 999,
      background: ok ? "#10B981" : "#D1D5DB",
      display: "inline-block",
    }),
    dropzone: {
      border: "2px dashed #D1D5DB",
      borderRadius: 14,
      padding: 18,
      background: "#F9FAFB",
      textAlign: "center",
      outline: "none",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
      gap: 10,
    },
    thumb: {
      border: "1px solid #E5E7EB",
      borderRadius: 12,
      overflow: "hidden",
      background: "#FFFFFF",
    },
    thumbImg: { width: "100%", height: 90, objectFit: "cover", display: "block" },
    thumbMeta: { padding: 8, fontSize: 12, color: "#374151" },
    barRow: { display: "flex", alignItems: "center", gap: 10, margin: "8px 0" },
    bar: (pct) => ({
      height: 10,
      borderRadius: 999,
      width: `${pct}%`,
      background: "#111827",
    }),
    barTrack: {
      flex: 1,
      height: 10,
      borderRadius: 999,
      background: "#E5E7EB",
      overflow: "hidden",
    },
    small: { fontSize: 12, color: "#6B7280" },
    hr: { border: 0, borderTop: "1px solid #E5E7EB", margin: "14px 0" },
    toast: {
      position: "fixed",
      bottom: 16,
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(17, 24, 39, 0.95)",
      color: "#FFFFFF",
      padding: "10px 14px",
      borderRadius: 999,
      fontSize: 13,
      maxWidth: 520,
      zIndex: 50,
    },
  };

  // ---------- Step content ----------
  const StepHeader = ({ title, subtitle }) => (
    <div style={{ marginBottom: 10 }}>
      <h2
        id="stepHeading"
        tabIndex={-1}
        style={{ margin: 0, fontSize: 20, outline: "none" }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p style={{ margin: "6px 0 0", color: "#4B5563" }}>{subtitle}</p>
      ) : null}
    </div>
  );

  const Stepper = () => (
    <div style={{ ...styles.card, position: "sticky", top: 12, zIndex: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Dataset Exploration + Style Transfer</div>
          <div style={styles.small}>
            Navigate steps with buttons or <strong>Alt + ←/→</strong>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button type="button" style={styles.btn} onClick={() => exportSummary("json")}
            aria-label="Export summary as JSON">
            Export JSON
          </button>
          <button type="button" style={styles.btn} onClick={() => exportSummary("txt")}
            aria-label="Export summary as text">
            Export TXT
          </button>
          <button type="button" style={styles.btnDanger} onClick={resetAll} aria-label="Reset everything">
            Reset
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12, ...styles.stepperWrap }} role="tablist" aria-label="Lesson steps">
        {steps.map((s) => {
          const isActive = s.id === activeStep;
          const ok = !!stepStatus[s.id];
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => goStep(s.id)}
              style={styles.stepBtn(isActive)}
            >
              <span aria-hidden="true" style={styles.dot(ok)} />
              <span style={{ fontWeight: 600 }}>{s.id}</span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", gap: 10 }}>
        <button type="button" style={styles.btn} onClick={prevStep} disabled={activeStep === 1}
          aria-disabled={activeStep === 1}>
          ← Back
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={styles.badge} aria-label="Image count">
            Images (active): <strong>{uploadedCount}</strong>
          </span>
          <span style={styles.badge} aria-label="Duplicates count">
            Duplicate groups: <strong>{duplicates.length}</strong>
          </span>
        </div>
        <button
          type="button"
          style={styles.btnPrimary}
          onClick={nextStep}
          disabled={activeStep === steps.length}
          aria-disabled={activeStep === steps.length}
        >
          Next →
        </button>
      </div>

      {warnings.length ? (
        <div style={{ marginTop: 12, ...styles.warn }} role="status" aria-live="polite">
          <strong>Notes:</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );

  const Step1Goal = () => (
    <div style={styles.card}>
      <StepHeader
        title="1) Define your creative goal"
        subtitle="Treat this like a studio brief: what are you making, for whom, and with what constraints?"
      />

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label} htmlFor="projectName">
            Project name
          </label>
          <input
            id="projectName"
            style={styles.input}
            value={goal.projectName}
            onChange={(e) => setGoal((g) => ({ ...g, projectName: e.target.value }))}
            placeholder="e.g., Urban Texture Study — Style Transfer"
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label} htmlFor="targetAudience">
            Target audience
          </label>
          <input
            id="targetAudience"
            style={styles.input}
            value={goal.targetAudience}
            onChange={(e) => setGoal((g) => ({ ...g, targetAudience: e.target.value }))}
            placeholder="e.g., gallery visitors, brand users, classmates"
          />
        </div>
      </div>

      <div style={{ ...styles.row, marginTop: 12 }}>
        <div style={styles.col}>
          <label style={styles.label} htmlFor="creativeIntent">
            Creative intent (1–3 sentences)
          </label>
          <textarea
            id="creativeIntent"
            style={styles.textarea}
            value={goal.creativeIntent}
            onChange={(e) => setGoal((g) => ({ ...g, creativeIntent: e.target.value }))}
            placeholder="What aesthetic or message do you want? What should stay consistent across images?"
          />
          <div style={styles.small}>Tip: Use “must-have” and “nice-to-have” language.</div>
        </div>
        <div style={styles.col}>
          <label style={styles.label} htmlFor="constraints">
            Constraints (format, ethics, deadlines)
          </label>
          <textarea
            id="constraints"
            style={styles.textarea}
            value={goal.constraints}
            onChange={(e) => setGoal((g) => ({ ...g, constraints: e.target.value }))}
            placeholder="e.g., 50–100 images, licensed sources only, 1024px max, due Friday"
          />
          <div style={styles.small}>Traditional best practice: write constraints before collecting.</div>
        </div>
      </div>

      <hr style={styles.hr} />

      <div style={styles.small}>
        Completion hint: add a project name or intent to mark this step complete.
      </div>
    </div>
  );

  const Step2Curate = () => (
    <div style={styles.card}>
      <StepHeader
        title="2) Curate a dataset (50–100 images)"
        subtitle="Upload or drag-and-drop images. Keep it ethical: original, licensed, public domain, or permission-based."
      />

      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        tabIndex={0}
        role="group"
        aria-label="Drag and drop zone"
        style={styles.dropzone}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700 }}>Drop images here</div>
        <div style={{ marginTop: 6, color: "#4B5563" }}>
          or press <strong>Enter</strong> to browse.
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            style={styles.btnPrimary}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload images
          </button>
          <button type="button" style={styles.btn} onClick={clearAll}>
            Clear dataset
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onPickFiles}
          style={{ display: "none" }}
          aria-label="Upload image files"
        />
        <div style={{ marginTop: 10, ...styles.small }}>
          Target: 50–100 images. Current active: <strong>{uploadedCount}</strong>
        </div>
      </div>

      <hr style={styles.hr} />

      <div style={styles.row}>
        <div style={styles.col}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Theme ideas</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
            <li>Urban textures (rust, concrete, signage, reflections)</li>
            <li>Portrait lighting (softbox vs sunlight vs neon)</li>
            <li>Nature patterns (leaves, bark, water, clouds)</li>
            <li>Product shots (minimal studio background)</li>
            <li>Typography layouts (editorial, posters, packaging)</li>
          </ul>
        </div>
        <div style={styles.col}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Fast quality checklist</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
            <li>Remove watermarks, logos (unless they are the point)</li>
            <li>Prefer consistent aspect ratio (optional)</li>
            <li>Avoid extremely low-resolution images</li>
            <li>Document your sources (copyright / consent)</li>
          </ul>
        </div>
      </div>

      <hr style={styles.hr} />

      {activeItems.length ? (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Preview (active images)</div>
          <div style={styles.grid}>
            {activeItems.slice(0, 24).map((it) => (
              <div key={it.id} style={styles.thumb}>
                {it.url ? (
                  <img alt={it.name} src={it.url} style={styles.thumbImg} />
                ) : (
                  <div
                    style={{
                      ...styles.thumbImg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#F3F4F6",
                      color: "#6B7280",
                      fontSize: 12,
                    }}
                  >
                    Re-upload needed
                  </div>
                )}
                <div style={styles.thumbMeta}>
                  <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {it.name}
                  </div>
                  <div style={styles.small}>{Math.round((it.size || 0) / 1024)} KB</div>
                </div>
              </div>
            ))}
          </div>
          {activeItems.length > 24 ? (
            <div style={{ marginTop: 10, ...styles.small }}>
              Showing 24 of {activeItems.length} active images.
            </div>
          ) : null}
        </div>
      ) : (
        <div style={styles.small}>No images yet. Upload 50–100 to proceed smoothly.</div>
      )}
    </div>
  );

  const Step3Audit = () => (
    <div style={styles.card}>
      <StepHeader
        title="3) Dataset audit"
        subtitle="Spot duplicates and remove off-topic or low-quality images. This is the fastest way to improve outcomes."
      />

      <div style={styles.row}>
        <div style={styles.col}>
          <div style={{ fontWeight: 700 }}>Duplicate detection</div>
          <div style={styles.small}>
            This checks duplicates by <strong>filename + file size</strong>. It’s approximate, but useful.
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" style={styles.btn} onClick={removeAllDuplicatesButKeepOne}>
              Remove duplicates (keep 1)
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            {duplicates.length ? (
              <div>
                <div style={{ ...styles.badge, marginBottom: 8 }}>
                  Duplicate groups found: <strong>{duplicates.length}</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {duplicates.slice(0, 12).map((g) => (
                    <li key={g.key} style={{ marginBottom: 6 }}>
                      <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}>
                        {g.key}
                      </span>
                      <span style={{ marginLeft: 8, ...styles.badge }}>x{g.ids.length}</span>
                    </li>
                  ))}
                </ul>
                {duplicates.length > 12 ? (
                  <div style={{ marginTop: 8, ...styles.small }}>
                    Showing 12 of {duplicates.length} groups.
                  </div>
                ) : null}
              </div>
            ) : (
              <div style={styles.small}>No duplicates detected (by filename+size).</div>
            )}
          </div>
        </div>

        <div style={styles.col}>
          <div style={{ fontWeight: 700 }}>Manual remove list</div>
          <div style={styles.small}>
            Mark images “removed” to exclude them from tagging and charts. You can restore later.
          </div>

          <div style={{ marginTop: 10, maxHeight: 320, overflow: "auto", border: "1px solid #E5E7EB", borderRadius: 12 }}>
            {items.length ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((it) => (
                  <li
                    key={it.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: 10,
                      borderBottom: "1px solid #F3F4F6",
                      background: it.removed ? "#FEF2F2" : "#FFFFFF",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={it.name}
                      >
                        {it.name || "(unnamed)"}
                      </div>
                      <div style={styles.small}>
                        {Math.round((it.size || 0) / 1024)} KB {it.removed ? "• removed" : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        style={styles.btn}
                        onClick={() => toggleRemoved(it.id)}
                        aria-pressed={!!it.removed}
                      >
                        {it.removed ? "Restore" : "Remove"}
                      </button>
                      <button
                        type="button"
                        style={styles.btnDanger}
                        onClick={() => removePermanently(it.id)}
                        aria-label={`Delete ${it.name} permanently`}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ padding: 12, ...styles.small }}>No items yet.</div>
            )}
          </div>

          <div style={{ marginTop: 10, ...styles.small }}>
            Traditional workflow tip: do a quick audit before you do any “serious” AI work.
          </div>
        </div>
      </div>
    </div>
  );

  const TagSelect = ({ id, label, value, options, onChange }) => (
    <div>
      <label style={styles.label} htmlFor={`${id}_${label}`}>
        {label}
      </label>
      <select
        id={`${id}_${label}`}
        style={{ ...styles.input, paddingRight: 28 }}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">(none)</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  const Chip = ({ label, selected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={{
        border: `1px solid ${selected ? "#111827" : "#E5E7EB"}`,
        background: selected ? "#111827" : "#FFFFFF",
        color: selected ? "#FFFFFF" : "#111827",
        borderRadius: 999,
        padding: "6px 10px",
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  const Step4Tagging = () => {
    const [bulkField, setBulkField] = useState("subject");
    const [bulkValue, setBulkValue] = useState("");

    const bulkOptions = useMemo(() => {
      if (bulkField === "subject") return subjectOptions;
      if (bulkField === "mood") return moodOptions;
      if (bulkField === "palette") return paletteOptions;
      return eraOptions;
    }, [bulkField]);

    return (
      <div style={styles.card}>
        <StepHeader
          title="4) Quick tagging"
          subtitle="Tagging helps you see what’s over/under-represented — and makes bias visible."
        />

        <div style={styles.row}>
          <div style={styles.col}>
            <div style={{ fontWeight: 700 }}>Bulk tag (optional)</div>
            <div style={styles.small}>Apply a tag to all active images to save time, then refine a few manually.</div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
              <div style={{ minWidth: 160 }}>
                <label style={styles.label} htmlFor="bulkField">
                  Field
                </label>
                <select
                  id="bulkField"
                  style={{ ...styles.input, paddingRight: 28 }}
                  value={bulkField}
                  onChange={(e) => {
                    setBulkField(e.target.value);
                    setBulkValue("");
                  }}
                >
                  <option value="subject">Subject</option>
                  <option value="mood">Mood</option>
                  <option value="palette">Palette</option>
                  <option value="era">Era</option>
                </select>
              </div>
              <div style={{ flex: "1 1 220px" }}>
                <label style={styles.label} htmlFor="bulkValue">
                  Value
                </label>
                <select
                  id="bulkValue"
                  style={{ ...styles.input, paddingRight: 28 }}
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                >
                  <option value="">(choose)</option>
                  {bulkOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                style={styles.btnPrimary}
                onClick={() => bulkValue && bulkTag(bulkField, bulkValue)}
                disabled={!bulkValue || activeItems.length === 0}
                aria-disabled={!bulkValue || activeItems.length === 0}
              >
                Apply to active
              </button>
            </div>
          </div>

          <div style={styles.col}>
            <div style={{ fontWeight: 700 }}>Live tag counts</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              <span style={styles.badge}>Subjects: {tagDistributions.subject.length}</span>
              <span style={styles.badge}>Moods: {tagDistributions.mood.length}</span>
              <span style={styles.badge}>Palettes: {tagDistributions.palette.length}</span>
              <span style={styles.badge}>Eras: {tagDistributions.era.length}</span>
              <span style={styles.badge}>Extra tags: {tagDistributions.extras.length}</span>
            </div>
            <div style={{ marginTop: 10, ...styles.small }}>
              Corporate reality: what you don’t tag, you can’t manage.
            </div>
          </div>
        </div>

        <hr style={styles.hr} />

        {activeItems.length ? (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Tag your images (active only)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
              {activeItems.slice(0, 18).map((it) => (
                <div key={it.id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 12 }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 96, flex: "0 0 auto" }}>
                      {it.url ? (
                        <img alt={it.name} src={it.url} style={{ width: 96, height: 72, objectFit: "cover", borderRadius: 10, border: "1px solid #E5E7EB" }} />
                      ) : (
                        <div style={{ width: 96, height: 72, borderRadius: 10, border: "1px solid #E5E7EB", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6B7280" }}>
                          Re-upload
                        </div>
                      )}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        title={it.name}
                      >
                        {it.name}
                      </div>
                      <div style={styles.small}>{Math.round((it.size || 0) / 1024)} KB</div>
                    </div>
                  </div>

                  <div style={{ ...styles.row, marginTop: 10 }}>
                    <div style={{ flex: "1 1 140px" }}>
                      <TagSelect
                        id={it.id}
                        label="Subject"
                        value={it.tags?.subject}
                        options={subjectOptions}
                        onChange={(v) => setTagValue(it.id, "subject", v)}
                      />
                    </div>
                    <div style={{ flex: "1 1 140px" }}>
                      <TagSelect
                        id={it.id}
                        label="Mood"
                        value={it.tags?.mood}
                        options={moodOptions}
                        onChange={(v) => setTagValue(it.id, "mood", v)}
                      />
                    </div>
                    <div style={{ flex: "1 1 140px" }}>
                      <TagSelect
                        id={it.id}
                        label="Palette"
                        value={it.tags?.palette}
                        options={paletteOptions}
                        onChange={(v) => setTagValue(it.id, "palette", v)}
                      />
                    </div>
                    <div style={{ flex: "1 1 140px" }}>
                      <TagSelect
                        id={it.id}
                        label="Era"
                        value={it.tags?.era}
                        options={eraOptions}
                        onChange={(v) => setTagValue(it.id, "era", v)}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div style={styles.label}>Extra tags (chips)</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {extraTagSuggestions.map((t) => (
                        <Chip
                          key={t}
                          label={t}
                          selected={!!it.tags?.extras?.includes(t)}
                          onClick={() => toggleExtraTag(it.id, t)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {activeItems.length > 18 ? (
              <div style={{ marginTop: 10, ...styles.small }}>
                Showing 18 of {activeItems.length} active images. Tag a representative sample if time is short.
              </div>
            ) : null}
          </div>
        ) : (
          <div style={styles.small}>Upload images in Step 2 first.</div>
        )}
      </div>
    );
  };

  const DistributionBlock = ({ title, rows }) => {
    const max = Math.max(1, ...rows.map((r) => r.count));
    return (
      <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
        {rows.length ? (
          <div>
            {rows.slice(0, 10).map((r) => {
              const pct = Math.round((r.count / max) * 100);
              return (
                <div key={r.label} style={styles.barRow}>
                  <div style={{ width: 110, fontSize: 12, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.label}>
                    {r.label}
                  </div>
                  <div style={styles.barTrack} aria-label={`${r.label} bar`}>
                    <div style={styles.bar(pct)} />
                  </div>
                  <div style={{ width: 34, textAlign: "right", fontSize: 12, color: "#374151" }}>{r.count}</div>
                </div>
              );
            })}
            {rows.length > 10 ? (
              <div style={{ marginTop: 8, ...styles.small }}>Showing top 10 of {rows.length}.</div>
            ) : null}
          </div>
        ) : (
          <div style={styles.small}>No tags yet. Tag a few images in Step 4.</div>
        )}
      </div>
    );
  };

  const Step5Variety = () => (
    <div style={styles.card}>
      <StepHeader
        title="5) Variety check"
        subtitle="Look for imbalance. If one category dominates, your outputs will likely converge to that ‘default.’"
      />

      <div style={styles.row}>
        <div style={styles.col}>
          <div style={{ fontWeight: 700 }}>Summary table</div>
          <div style={styles.small}>Counts below reflect active images only.</div>
          <div style={{ marginTop: 10, overflow: "auto", border: "1px solid #E5E7EB", borderRadius: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #E5E7EB" }}>Field</th>
                  <th style={{ textAlign: "right", padding: 10, borderBottom: "1px solid #E5E7EB" }}>Unique tags</th>
                  <th style={{ textAlign: "right", padding: 10, borderBottom: "1px solid #E5E7EB" }}>Top tag</th>
                  <th style={{ textAlign: "right", padding: 10, borderBottom: "1px solid #E5E7EB" }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["Subject", tagDistributions.subject],
                  ["Mood", tagDistributions.mood],
                  ["Palette", tagDistributions.palette],
                  ["Era", tagDistributions.era],
                  ["Extras", tagDistributions.extras],
                ]).map(([name, arr]) => {
                  const top = (arr && arr[0]) || null;
                  return (
                    <tr key={name}>
                      <td style={{ padding: 10, borderBottom: "1px solid #F3F4F6" }}>{name}</td>
                      <td style={{ padding: 10, borderBottom: "1px solid #F3F4F6", textAlign: "right" }}>{arr.length}</td>
                      <td style={{ padding: 10, borderBottom: "1px solid #F3F4F6", textAlign: "right" }}>{top ? top.label : "—"}</td>
                      <td style={{ padding: 10, borderBottom: "1px solid #F3F4F6", textAlign: "right" }}>{top ? top.count : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.col}>
          <div style={{ fontWeight: 700 }}>Interpreting the numbers</div>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#374151" }}>
            <li>If one tag is &gt;50% of your dataset, expect a strong “default look.”</li>
            <li>If diversity is low, add missing examples on purpose (don’t rely on chance).</li>
            <li>Track technical consistency (resolution/lighting) separately from content diversity.</li>
          </ul>
          <div style={{ marginTop: 10, ...styles.small }}>
            Strong opinion: variety is a creative control lever, not a nice-to-have.
          </div>
        </div>
      </div>

      <hr style={styles.hr} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        <DistributionBlock title="Subject (bar chart)" rows={tagDistributions.subject} />
        <DistributionBlock title="Mood (bar chart)" rows={tagDistributions.mood} />
        <DistributionBlock title="Palette (bar chart)" rows={tagDistributions.palette} />
        <DistributionBlock title="Era (bar chart)" rows={tagDistributions.era} />
      </div>

      {tagDistributions.extras.length ? (
        <div style={{ marginTop: 12 }}>
          <DistributionBlock title="Extras (bar chart)" rows={tagDistributions.extras} />
        </div>
      ) : null}
    </div>
  );

  const Step6Bias = () => {
    const checkedCount = Object.values(biasChecks).filter(Boolean).length;
    const needsReflection = reflection.trim().length < 20;

    return (
      <div style={styles.card}>
        <StepHeader
          title="6) Bias & risk check"
          subtitle="Datasets create patterns. Patterns can become bias. Make risks visible before you generate." 
        />

        <div style={styles.row}>
          <div style={styles.col}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              Bias spotting checklist <span style={styles.badge}>{checkedCount}/{biasChecklistItems.length} checked</span>
            </div>
            <div role="group" aria-label="Bias checklist">
              {biasChecklistItems.map((it) => (
                <label
                  key={it.key}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 8px", borderBottom: "1px solid #F3F4F6" }}
                >
                  <input
                    type="checkbox"
                    checked={!!biasChecks[it.key]}
                    onChange={(e) => setBiasChecks((b) => ({ ...b, [it.key]: e.target.checked }))}
                    aria-label={it.label}
                    style={{ marginTop: 3 }}
                  />
                  <span style={{ fontSize: 13, color: "#374151" }}>{it.label}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 10, ...styles.small }}>
              Practical rule: if you can’t explain your dataset’s “default,” you don’t control your output.
            </div>
          </div>

          <div style={styles.col}>
            <div style={{ fontWeight: 700 }}>Reflection (required)</div>
            <div style={styles.small}>Write 2–4 sentences about what patterns you noticed and what you’ll change.</div>
            <div style={{ marginTop: 10 }}>
              <label style={styles.label} htmlFor="reflection">
                Reflection (min ~20 characters)
              </label>
              <textarea
                id="reflection"
                style={{ ...styles.textarea, borderColor: needsReflection ? "#F59E0B" : "#D1D5DB" }}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Example: Most images are night street shots with neon, so the model may push everything toward high contrast. I will add daylight scenes and a wider range of skin tones / subjects to reduce a single default."
              />
              {needsReflection ? (
                <div style={{ marginTop: 8, ...styles.warn }} role="status" aria-live="polite">
                  Reflection is required to complete this step.
                </div>
              ) : (
                <div style={{ marginTop: 8, ...styles.small }}>Good — this step is considered complete.</div>
              )}
            </div>

            <hr style={styles.hr} />

            <div style={{ fontWeight: 700 }}>Ethics note</div>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#374151" }}>
              <li>Don’t include private/identifying images without consent.</li>
              <li>Use licensed/public-domain/original images only.</li>
              <li>Be cautious with cultural or sacred imagery; context matters.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const Step7StyleTransfer = () => (
    <div style={styles.card}>
      <StepHeader
        title="7) Style transfer (TensorFlow Neural Style Transfer — Google Colab)"
        subtitle="You’ll apply one style image across your dataset. Use your dataset exploration to predict results."
      />

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label} htmlFor="colabLink">
            Colab notebook link
          </label>
          <input
            id="colabLink"
            style={styles.input}
            value={styleTransfer.colabLink}
            onChange={(e) => setStyleTransfer((s) => ({ ...s, colabLink: e.target.value }))}
          />
          <div style={{ marginTop: 10 }}>
            <label style={styles.label} htmlFor="styleName">
              Chosen style image name (file name or a label)
            </label>
            <input
              id="styleName"
              style={styles.input}
              value={styleTransfer.styleImageName}
              onChange={(e) => setStyleTransfer((s) => ({ ...s, styleImageName: e.target.value }))}
              placeholder="e.g., monet_waterlilies.jpg"
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <label style={styles.label} htmlFor="styleNotes">
              Notes (what you expect the style to change)
            </label>
            <textarea
              id="styleNotes"
              style={styles.textarea}
              value={styleTransfer.notes}
              onChange={(e) => setStyleTransfer((s) => ({ ...s, notes: e.target.value }))}
              placeholder="e.g., Push textures toward brush strokes; preserve silhouettes; watch for faces becoming distorted."
            />
          </div>
        </div>

        <div style={styles.col}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Step-by-step (copyable)</div>
          <div style={{ ...styles.warn, borderColor: "#E5E7EB", background: "#F9FAFB", color: "#111827" }}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
              {buildColabInstructions()}
            </pre>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" style={styles.btnPrimary} onClick={copyInstructions}>
              Copy instructions
            </button>
            <button
              type="button"
              style={styles.btn}
              onClick={() => {
                try {
                  window.open(styleTransfer.colabLink, "_blank", "noopener,noreferrer");
                } catch {
                  // ignore
                }
              }}
              aria-label="Open Colab link in new tab"
            >
              Open Colab
            </button>
          </div>

          <hr style={styles.hr} />

          <div style={{ fontWeight: 700 }}>Batch-processing tip</div>
          <div style={styles.small}>
            Many notebooks demonstrate 1 image. For 50–100 images, you typically:
            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
              <li>Upload a zip of your content images</li>
              <li>Unzip to a folder</li>
              <li>Loop over files and save outputs to an output folder</li>
              <li>Zip outputs to download</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const Step8Critique = () => (
    <div style={styles.card}>
      <StepHeader
        title="8) Critique prep (mini gallery plan)"
        subtitle="Plan a before/after grid and prepare your critique talking points."
      />

      <div style={styles.row}>
        <div style={styles.col}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Gallery grid (content images)</div>
          {activeItems.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
              {activeItems.slice(0, 12).map((it) => (
                <div key={it.id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={it.name}>
                    {it.name}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                    <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
                      {it.url ? (
                        <img alt={`Before: ${it.name}`} src={it.url} style={{ width: "100%", height: 90, objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: 90, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6B7280" }}>
                          Before
                        </div>
                      )}
                      <div style={{ padding: 6, fontSize: 11, color: "#4B5563" }}>Before</div>
                    </div>
                    <div style={{ border: "1px dashed #D1D5DB", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ width: "100%", height: 90, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#92400E" }}>
                        After
                      </div>
                      <div style={{ padding: 6, fontSize: 11, color: "#4B5563" }}>After (paste in)</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {it.tags?.subject ? <span style={styles.badge}>{it.tags.subject}</span> : null}
                    {it.tags?.mood ? <span style={styles.badge}>{it.tags.mood}</span> : null}
                    {it.tags?.palette ? <span style={styles.badge}>{it.tags.palette}</span> : null}
                    {it.tags?.era ? <span style={styles.badge}>{it.tags.era}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.small}>Upload images in Step 2 first.</div>
          )}
          {activeItems.length > 12 ? (
            <div style={{ marginTop: 10, ...styles.small }}>Showing 12 of {activeItems.length}.</div>
          ) : null}
        </div>

        <div style={styles.col}>
          <div style={{ fontWeight: 700 }}>Critique prompts</div>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#374151" }}>
            <li><strong>What changed?</strong> texture, color palette, brush/line quality, contrast, noise/grain</li>
            <li><strong>What stayed consistent?</strong> composition, silhouettes, focal points, brand constraints</li>
            <li><strong>Where did it fail?</strong> faces/hands, text, small details, edges, repeated artifacts</li>
            <li><strong>What did your dataset “push” the AI to do?</strong> (default lighting, default subject, default skin tone)</li>
            <li><strong>What will you fix next?</strong> add missing categories, rebalance, improve audit, refine style image</li>
          </ul>

          <hr style={styles.hr} />

          <div style={{ fontWeight: 700 }}>Exit ticket (quick)</div>
          <ol style={{ margin: "8px 0 0", paddingLeft: 18, color: "#374151" }}>
            <li>What is one dataset pattern you discovered (with evidence)?</li>
            <li>What is one bias risk you mitigated (or will mitigate) and how?</li>
            <li>What is one change you’d make to your dataset before generating again?</li>
          </ol>
        </div>
      </div>
    </div>
  );

  // ---------- Render ----------
  return (
    <div style={styles.page}>
      <Stepper />

      <div style={{ height: 12 }} />

      {activeStep === 1 ? <Step1Goal /> : null}
      {activeStep === 2 ? <Step2Curate /> : null}
      {activeStep === 3 ? <Step3Audit /> : null}
      {activeStep === 4 ? <Step4Tagging /> : null}
      {activeStep === 5 ? <Step5Variety /> : null}
      {activeStep === 6 ? <Step6Bias /> : null}
      {activeStep === 7 ? <Step7StyleTransfer /> : null}
      {activeStep === 8 ? <Step8Critique /> : null}

      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={styles.small}>
          Autosave is on. Files are not restored after a full refresh (browser limitation) — re-upload if needed.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" style={styles.btn} onClick={() => goStep(1)}>
            Start
          </button>
          <button type="button" style={styles.btn} onClick={() => goStep(8)}>
            Jump to Critique
          </button>
        </div>
      </div>

      {toast.show ? (
        <div style={styles.toast} role="status" aria-live="polite">
          {toast.msg}
        </div>
      ) : null}

      {/* Dropzone visual state */}
      <style>{`
        [data-drag="true"] {
          border-color: #111827 !important;
          background: #F3F4F6 !important;
        }
      `}</style>
    </div>
  );
}
