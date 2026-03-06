import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;}
.zy-root{font-family:'Source Serif 4',Georgia,serif;background:#F9F8F5;color:#1C1C1E;min-height:100vh;display:flex;flex-direction:column;}
.zy-fade{animation:zyFade .35s ease;}
@keyframes zyFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.zy-sidebar-link{cursor:pointer;transition:background .15s;border-left:3px solid transparent;}
.zy-sidebar-link:hover{background:rgba(255,255,255,.08)!important;}
.zy-sidebar-link.active{border-left-color:currentColor;background:rgba(255,255,255,.13)!important;}
.zy-opt{cursor:pointer;transition:border-color .15s,background .15s;border:2px solid #E5E7EB;border-radius:8px;padding:12px 14px;margin:6px 0;display:flex;align-items:flex-start;gap:10px;background:white;width:100%;text-align:left;}
.zy-opt:hover:not(.locked){border-color:#2563EB;background:#EFF6FF;}
.zy-opt.correct{border-color:#16A34A!important;background:#F0FDF4!important;}
.zy-opt.wrong{border-color:#DC2626!important;background:#FEF2F2!important;}
.zy-opt.show-correct{border-color:#16A34A!important;background:#F0FDF4!important;opacity:.7;}
.zy-opt.locked{cursor:default;}
.zy-pill{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;font-family:'JetBrains Mono',monospace;}
.zy-btn{cursor:pointer;transition:filter .15s,transform .1s;border:none;}
.zy-btn:hover{filter:brightness(.92);}
.zy-btn:active{transform:scale(.97);}
.zy-sidebar-scroll{overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.2) transparent;}
.zy-content-scroll{overflow-y:auto;scrollbar-width:thin;scrollbar-color:#D1D5DB #F9F8F5;}
.zy-progress{transition:width .6s cubic-bezier(.4,0,.2,1);}
.zy-lab-card{transition:transform .18s,box-shadow .18s;cursor:pointer;}
.zy-lab-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.1);}
.zy-lab-card.selected{transform:translateY(-2px);}
.pipeline-module{transition:all .2s;cursor:pointer;}
.pipeline-module:hover{filter:brightness(.95);}
.zy-mono{font-family:'JetBrains Mono',monospace;}
`;

/* ═══════════════════════════════════════════════════════════════
   COURSE DATA
═══════════════════════════════════════════════════════════════ */
const MODULES = [
  {
    id:"m1",num:"01",title:"AI in Creative Fields",color:"#2563EB",light:"#EFF6FF",
    sections:[
      {
        id:"m1s1",title:"What is AI in Creative Practice?",
        blocks:[
          {type:"text",content:"Artificial intelligence has entered the creative studio not as a replacement for human ingenuity, but as a new category of collaborator. Understanding what AI actually does — and does not do — in creative workflows is the foundation of intelligent use."},
          {type:"text",content:"In creative practice, AI tools fall into three broad categories: **generative tools** that produce new content (images, text, audio, video), **transformative tools** that modify or reformat existing content, and **analytical tools** that interpret and provide feedback on creative work. Each category carries different implications for authorship, workflow, and skill development."},
          {type:"participation",id:"m1s1p1",
            prompt:"A graphic designer uses an AI tool to convert a rough sketch into a polished vector illustration. Which category does this AI tool primarily belong to?",
            options:[
              {id:"a",text:"Generative — it creates original content from scratch"},
              {id:"b",text:"Transformative — it modifies existing content into a new form"},
              {id:"c",text:"Analytical — it interprets the quality of the sketch"},
              {id:"d",text:"None of the above — AI cannot reliably do this task"}
            ],
            correct:"b",
            explanation:"This is a transformative AI tool. It takes existing content (the rough sketch) and converts it into a different form (vector illustration). Generative tools create from a prompt or nothing at all. Transformative tools work with what you give them — refining, converting, or remixing. The distinction matters because it affects what inputs produce good outputs."},
          {type:"text",content:"The creative AI landscape is defined by several landmark model families: diffusion models for images (Stable Diffusion, DALL·E, Midjourney), large language models for text (GPT-4, Claude, Gemini), and multimodal models that bridge multiple domains. Each uses distinct architectures, but all share a common workflow: trained on vast datasets of human-created work, they generate outputs by predicting what fits best given your input."},
          {type:"participation",id:"m1s1p2",
            prompt:"Which statement BEST describes how modern AI creative tools fundamentally work?",
            options:[
              {id:"a",text:"They retrieve existing content from a database and repackage it as new"},
              {id:"b",text:"They simulate human consciousness to make creative decisions"},
              {id:"c",text:"They predict statistically likely outputs based on patterns learned from training data"},
              {id:"d",text:"They follow explicit hand-coded rules written by their engineers"}
            ],
            correct:"c",
            explanation:"Modern AI creative tools are statistical prediction engines. Given an input, they generate outputs statistically consistent with patterns learned from training data. They are not retrieving existing work (A), simulating consciousness (B), or following explicit rules (D). This probabilistic nature is why outputs can be surprising and creative — and also why they can hallucinate or be inconsistent."},
        ]
      },
      {
        id:"m1s2",title:"AI as Creative Collaborator",
        blocks:[
          {type:"text",content:"The most productive mental model for AI in creative work is neither 'autonomous creator' nor 'simple tool.' It is **collaborator** — an entity with its own tendencies, strengths, and blind spots that must be understood and directed deliberately."},
          {type:"callout",variant:"key",title:"The Collaboration Framework",
            content:"Think of AI creative tools along two axes: **Direction** (how specifically you guide the output) and **Curation** (how rigorously you select from what it produces). High Direction + High Curation = professional-grade creative AI use. Low Direction + Low Curation = output that looks generic and unintentional."},
          {type:"text",content:"Effective creative collaboration with AI requires three practices. First, **specificity of prompt** — vague inputs produce vague outputs; precise, contextual prompts produce work that can be refined into something genuinely useful. Second, **iterative refinement** — no professional uses the first AI output; they use it as a starting point. Third, **domain knowledge** — practitioners who get the most from AI tools are those who already know their field well enough to evaluate and direct AI outputs critically."},
          {type:"challenge",id:"m1s2c1",title:"Scenario Analysis",
            scenario:"A music producer uses an AI tool to generate ten chord progressions based on the prompt \"melancholic jazz, late night, introspective.\" She listens to all ten, selects the two that resonate most, combines elements from both by hand in her DAW, then builds a full track around the result. She describes the finished song as \"co-created with AI.\"",
            question:"Evaluate this workflow using the Collaboration Framework. What makes it effective, and what would make it stronger?",
            options:[
              {id:"a",text:"Ineffective — using AI makes the music inauthentic and the co-created label is misleading."},
              {id:"b",text:"Effective: high-direction prompt + high-curation selection. Could be stronger with iterative prompting before curation."},
              {id:"c",text:"Effective, but generating only 10 variations is insufficient — professional use requires hundreds of iterations."},
              {id:"d",text:"The human contribution is too large — true co-creation means letting the AI complete the track autonomously."}
            ],
            correct:"b",
            explanation:"Option B correctly applies the framework. The producer uses a specific, contextual prompt (high direction) and curates rigorously from the output (high curation). The co-created label is honest: she directed, curated, and built upon AI output using her own musical judgment. The workflow could be strengthened by iterative prompting — taking the best initial output and prompting for variations on it before final selection. Option C confuses volume with quality. Option D misunderstands co-creation; it doesn't require reduced human agency."},
          {type:"text",content:"Attribution is an emerging norm in creative AI work. Developing transparent practices around when and how you used AI — in your process notes, client communications, and public-facing descriptions — builds trust and contributes to the professional standards still being formed in every creative industry."}
        ]
      },
      {id:"m1s3",title:"Lab: AI Tool Landscape Explorer",blocks:[{type:"lab",component:"ToolExplorer"}]}
    ]
  },
  {
    id:"m2",num:"02",title:"AI for Visual Art & Design",color:"#D97706",light:"#FFFBEB",
    sections:[
      {
        id:"m2s1",title:"Generative Image Models",
        blocks:[
          {type:"text",content:"Generative image AI transforms text descriptions, rough sketches, or existing images into polished visual output. Understanding the underlying mechanics — even at a conceptual level — makes you a dramatically more effective operator."},
          {type:"text",content:"Most current image generation systems use **diffusion models**: they learn to reverse a process of gradually adding noise to images. Given a text prompt, the model starts with pure noise and iteratively removes noise in the direction that makes the image more consistent with the prompt. This is why image generators produce outputs that look statistically natural — they are sampling from the distribution of all images that match your description."},
          {type:"callout",variant:"technical",title:"Key Parameters to Understand",
            content:"**Steps**: More diffusion steps = higher quality but slower generation. **CFG Scale (Guidance)**: How strictly the model follows your prompt — high = literal, low = creative liberty. **Seed**: The random starting point — same seed + same prompt = reproducible outputs. **Negative prompts**: Tell the model what NOT to include."},
          {type:"participation",id:"m2s1p1",
            prompt:"A designer generates an image that looks too literal and lacks artistic interpretation. Which parameter adjustment is MOST likely to improve this?",
            options:[
              {id:"a",text:"Increase the number of diffusion steps significantly"},
              {id:"b",text:"Lower the CFG (guidance) scale"},
              {id:"c",text:"Use the same seed as a previous successful generation"},
              {id:"d",text:"Add more words to the positive prompt"}
            ],
            correct:"b",
            explanation:"A high CFG scale forces the model to adhere strictly to the prompt, producing literal interpretations. Lowering the CFG scale gives the model more creative latitude to interpret the prompt in unexpected, interesting ways. Steps (A) affects quality and detail, not creative freedom. Same seed (C) reproduces a prior image, not a freer interpretation. More prompt words (D) would make it more literal, not less."},
          {type:"text",content:"The architecture of your text prompt maps directly to output quality. Professional prompt engineering treats the prompt like a brief to a collaborator: specify the subject, style, lighting, mood, medium, and perspective. The more you train yourself to see images in terms of these components, the better you become at generating them intentionally."},
          {type:"participation",id:"m2s1p2",
            prompt:"Compare these two prompts. Which is more likely to produce a consistent, usable result?\n\nPrompt A: \"a woman in a city\"\nPrompt B: \"portrait of a woman, golden hour, Tokyo street, shallow depth of field, Sony A7 35mm, editorial photography style\"",
            options:[
              {id:"a",text:"Prompt A — brevity allows the model more creative freedom"},
              {id:"b",text:"They are equivalent — modern models interpret both equally well"},
              {id:"c",text:"Prompt B — specificity of subject, lighting, location, and style produces more intentional results"},
              {id:"d",text:"Prompt B — but the camera specification is unnecessary and actually degrades output"}
            ],
            correct:"c",
            explanation:"Prompt B is far more likely to produce a usable, intentional result. Each element constrains the model toward a specific visual: location (Tokyo), lighting (golden hour), photographic feel (35mm lens), and style (editorial). Camera and lens specifications actively help — they are common in photography training data and reliably influence rendering style. Option A is a common misconception; vague prompts produce statistically average, forgettable outputs."}
        ]
      },
      {
        id:"m2s2",title:"Practical Design Workflows",
        blocks:[
          {type:"text",content:"AI image tools do not replace design workflows — they transform specific stages of them. Understanding where to introduce AI, and which stages to preserve as human-led, is the core design decision."},
          {type:"callout",variant:"workflow",title:"AI Integration Points in Visual Design",
            content:"**Ideation Phase**: AI generates 50 thumbnail concepts in the time it takes to sketch 3. Use it here for volume. **Moodboarding**: Generate reference images for specific visual directions that don't exist in stock libraries. **Asset Generation**: Create custom textures, backgrounds, supplementary elements. **Variation Testing**: Generate multiple color or composition variants. Preserve as human-led: art direction decisions, client-facing creative rationale, final composition judgment."},
          {type:"challenge",id:"m2s2c1",title:"Workflow Design Challenge",
            scenario:"A brand studio has been commissioned to create a visual identity for a new sustainable architecture firm. The brief: 'timeless modernism, natural materials, human scale.' The team of two designers has two weeks. They have access to Midjourney, Adobe Firefly, and standard design tools (Illustrator, Photoshop).",
            question:"Which workflow strategy best integrates AI tools while preserving creative quality?",
            options:[
              {id:"a",text:"Use Midjourney to generate the final logo, colors, and all visual assets, then present directly to client."},
              {id:"b",text:"Use Midjourney for ideation moodboards and material texture generation; Firefly for logo mark variations; all final refinement in Illustrator with human art direction."},
              {id:"c",text:"Avoid AI tools entirely — clients in architecture expect hand-crafted design."},
              {id:"d",text:"Use Midjourney to generate 500 logo options, select the best one, and deliver without modification."}
            ],
            correct:"b",
            explanation:"Option B applies AI at the highest-leverage stages — volume ideation, material reference, variation generation — while keeping human art direction in control of final creative decisions. AI-generated moodboards rapidly establish visual territory; AI-generated textures reduce production time without sacrificing uniqueness; final mark refinement in Illustrator ensures scalability and craft. Option A outsources creative judgment entirely — AI-generated logos lack the conceptual intentionality clients pay for. Option C misses significant efficiency gains. Option D generates volume without a curation strategy."}
        ]
      },
      {id:"m2s3",title:"Lab: Prompt Architecture Builder",blocks:[{type:"lab",component:"PromptBuilder"}]}
    ]
  },
  {
    id:"m3",num:"03",title:"AI in Media & Communication",color:"#059669",light:"#ECFDF5",
    sections:[
      {
        id:"m3s1",title:"AI-Assisted Writing & Editing",
        blocks:[
          {type:"text",content:"Language models have become the most widely adopted AI tools in professional creative workflows. From drafting to editing to research synthesis, they touch nearly every part of the writing process. Understanding their specific strengths — and their equally specific failure modes — is essential for professional use."},
          {type:"text",content:"AI writing tools excel at: **structure and scaffolding** (outlining, organizing arguments), **register modulation** (adjusting tone), **variation generation** (multiple versions of a sentence), and **first-draft acceleration** (getting unstuck). They consistently struggle with: original analysis, accurate citation, factual grounding across long documents, and anything requiring genuine lived experience or current awareness."},
          {type:"participation",id:"m3s1p1",
            prompt:"A journalist is writing a feature on urban housing policy. Which task is MOST appropriate to delegate to an AI writing assistant?",
            options:[
              {id:"a",text:"Verifying statistics cited from a 2023 government report"},
              {id:"b",text:"Generating five alternative introductory paragraphs in different tones"},
              {id:"c",text:"Conducting original analysis of the housing data"},
              {id:"d",text:"Identifying which local officials to interview"}
            ],
            correct:"b",
            explanation:"Generating variations on existing content is precisely where language models excel and are safe to use. Option B has low hallucination risk and high creative utility. Verifying statistics (A) is dangerous — language models frequently hallucinate numeric data. Original analysis (C) requires genuine reasoning AI cannot reliably perform. Interview sourcing (D) requires current, accurate knowledge of real people the model may not have."},
          {type:"callout",variant:"warning",title:"The Hallucination Problem",
            content:"Language models do not know the difference between what they know and what they are confabulating. They generate plausible-sounding text — meaning false statements are formatted identically to true ones. Academic papers, legal documents, medical content, financial analysis: any domain with real-world consequences requires rigorous human verification of ALL AI-generated factual claims."},
          {type:"participation",id:"m3s1p2",
            prompt:"You ask an AI assistant to summarize a specific academic paper by title. It produces a confident, well-structured summary. What should you do?",
            options:[
              {id:"a",text:"Use the summary directly — the AI was trained on academic content and is reliable here"},
              {id:"b",text:"Verify the summary against the actual paper before using it professionally"},
              {id:"c",text:"Ask the AI to produce a longer summary for added confidence"},
              {id:"d",text:"Cross-check with a second AI tool to confirm accuracy"}
            ],
            correct:"b",
            explanation:"You must verify against the actual paper. Language models frequently hallucinate summaries — including papers that don't exist, authors who didn't write them, and conclusions that were never drawn. The confident presentation is not evidence of accuracy. Asking for a longer summary (C) or cross-checking with another AI (D) would compound the problem — both tools confabulate with equal confidence."}
        ]
      },
      {
        id:"m3s2",title:"Ethics, Attribution & Transparency",
        blocks:[
          {type:"text",content:"The ethical landscape of AI in creative media is evolving rapidly. Practitioners who engage proactively with these questions — rather than waiting for external regulation — build more durable, trustworthy professional practices."},
          {type:"text",content:"Three principles are emerging as professional norms: **Disclosure** — informing clients, editors, and audiences when AI tools substantially contributed to work. **Attribution** — acknowledging when training data from specific creators informed AI outputs. **Accountability** — taking responsibility for AI-assisted work you publish; AI-generated content that you present as your own is still your professional responsibility."},
          {type:"challenge",id:"m3s2c1",title:"Ethical Case Study",
            scenario:"A copywriter uses an AI tool to draft the first version of a campaign script, then extensively rewrites it over three days into the final version. The agency submits to an advertising awards competition whose rules require disclosure of AI use 'in content generation.' The copywriter believes the edits were substantial enough that the final version is predominantly their own work.",
            question:"What is the most professionally sound course of action?",
            options:[
              {id:"a",text:"No disclosure needed — the extensive rewriting means the final work is effectively human-authored."},
              {id:"b",text:"Disclose AI use in the initial draft per the competition rules, regardless of the extent of subsequent human editing."},
              {id:"c",text:"Withdraw from the competition to avoid the disclosure question entirely."},
              {id:"d",text:"Disclose only if asked directly — proactive disclosure could disadvantage the entry."}
            ],
            correct:"b",
            explanation:"Option B is correct. The competition rules require disclosure of AI use 'in content generation' — the initial draft is content generation, regardless of how much was subsequently rewritten. Disclosure here is not a judgment about the quality of the final work; it is compliance with the stated rules. The 'substantially rewritten' argument (A) is a rationalization that doesn't align with the rule's scope. Withdrawal (C) is unnecessary. Reactive disclosure (D) creates an integrity risk if non-disclosure is later discovered."}
        ]
      },
      {id:"m3s3",title:"Lab: Writing Style Transformer",blocks:[{type:"lab",component:"StyleTransformer"}]}
    ]
  },
  {
    id:"m4",num:"04",title:"Tool Chaining & Modular AI",color:"#7C3AED",light:"#F5F3FF",
    sections:[
      {
        id:"m4s1",title:"What is Tool Chaining?",
        blocks:[
          {type:"text",content:"Individual AI tools are powerful. Chained AI tools — where the output of one becomes the input of another — are transformative. Tool chaining is the practice of designing multi-step AI workflows where each step performs a specific transformation, and results accumulate toward a complex creative outcome."},
          {type:"text",content:"A simple example: a filmmaker uses a language model to expand a three-line story concept into a full scene description → feeds that description into an image generator to create a storyboard → uses an audio AI to generate a temp score matching the visual mood → assembles in video editing software. No single tool did all of this. The filmmaker designed the pipeline."},
          {type:"callout",variant:"key",title:"The Pipeline Mental Model",
            content:"Think of tool chaining as a pipeline: INPUT → [Transform 1] → [Transform 2] → ... → OUTPUT. Each transform refines, elaborates, converts, or filters the data passing through it. Your job as the designer: specify what each transform does and verify quality at each handoff point."},
          {type:"participation",id:"m4s1p1",
            prompt:"In a tool chain, what is the PRIMARY risk at each handoff between tools?",
            options:[
              {id:"a",text:"File format incompatibility between different AI tools"},
              {id:"b",text:"Error accumulation — flaws in early outputs compound through later stages"},
              {id:"c",text:"Each additional tool exponentially increases processing time"},
              {id:"d",text:"Later tools override and discard earlier outputs entirely"}
            ],
            correct:"b",
            explanation:"Error accumulation is the defining challenge of tool chaining. A small inaccuracy in Step 1 gets passed to Step 2, which builds on it, passing an amplified distortion to Step 3. This is why quality checkpoints between stages are not optional in professional pipeline design. File format issues (A) are manageable. Processing time (C) scales linearly, not exponentially. Later tools transform (not override) earlier outputs."},
          {type:"text",content:"The design of a good tool chain follows a principle of **minimal sufficient processing at each stage**: each tool does exactly what it's best at, and nothing more. Over-engineering a single stage (asking one tool to do too much) is as problematic as under-engineering (passing insufficient information to the next stage)."}
        ]
      },
      {
        id:"m4s2",title:"Modular Pipeline Design",
        blocks:[
          {type:"text",content:"Modularity in pipeline design means treating each stage as a replaceable component with a defined input specification and output specification. A modular pipeline can swap out any single component — upgrade to a newer model, try a different tool — without redesigning the whole workflow."},
          {type:"callout",variant:"technical",title:"Module Specification Pattern",
            content:"For each module in your pipeline, document: (1) **Input** — what data type, format, and quality is expected. (2) **Transform** — what this module does to the input. (3) **Output** — what data type, format, and quality is produced. (4) **Quality Gate** — how you verify the output before passing to the next stage."},
          {type:"participation",id:"m4s2p1",
            prompt:"A podcaster's AI pipeline has four stages: Script Generation → Voice Synthesis → Background Music → Final Mix. The voice synthesis tool is discontinued. In a well-designed modular pipeline, what is the most accurate description of the impact?",
            options:[
              {id:"a",text:"The entire pipeline must be redesigned from scratch"},
              {id:"b",text:"Only the voice synthesis module needs to be replaced; other modules continue as defined"},
              {id:"c",text:"The script generation module must also be updated to match the new voice tool"},
              {id:"d",text:"The final mix module cannot function without the original voice tool's specific output format"}
            ],
            correct:"b",
            explanation:"This is the defining advantage of modular design. Because each module has a defined input/output specification, replacing Voice Synthesis only requires finding a tool that accepts the same input format and produces the same output format. Script generation and final mix modules continue unchanged. If the new voice tool produces audio in a slightly different format, a small conversion step may be needed — but this is a minor adjustment, not a pipeline redesign."},
          {type:"challenge",id:"m4s2c1",title:"Pipeline Design Challenge",
            scenario:"A social media team produces weekly content: 1 long-form article → 5 social media posts → 3 short videos → 10 image cards. Currently this takes 3 days of manual work. They want a modular AI pipeline that reduces this to 1 day while maintaining quality.",
            question:"Which pipeline architecture best solves this problem?",
            options:[
              {id:"a",text:"One AI tool generates all content types simultaneously from the article to maximize efficiency."},
              {id:"b",text:"Stage 1: AI extracts 10 key insights from article → Stage 2: AI generates post drafts from insights → Stage 3: AI generates video scripts from posts → Stage 4: AI generates image prompts from insights → Human review at each stage."},
              {id:"c",text:"Replace the human team with AI tools entirely — the pipeline handles all content without human review."},
              {id:"d",text:"Use AI only for the article writing stage; then have humans produce all derivative content."}
            ],
            correct:"b",
            explanation:"Option B implements a properly modular pipeline: article → structured insights (reusable) → post drafts → video scripts → image prompts. This is modular (any stage upgradeable independently), efficient (each stage does one well-defined task), and quality-controlled (human review catches errors before they compound). Option A ignores minimal sufficient processing and would produce low-quality outputs. Option C removes the quality gates that make AI output professional-grade. Option D uses AI too narrowly to achieve the efficiency goal."}
        ]
      },
      {id:"m4s3",title:"Lab: Interactive Pipeline Builder",blocks:[{type:"lab",component:"PipelineBuilder"}]}
    ]
  }
];

/* ═══════════════════════════════════════════════════════════════
   LAB: TOOL EXPLORER
═══════════════════════════════════════════════════════════════ */
const TOOLS = [
  {id:"t1",name:"Midjourney",desc:"Text prompt → image",correct:"Generative",example:"Creating a product illustration from a text description"},
  {id:"t2",name:"Adobe Firefly",desc:"Text or image → styled image",correct:"Generative",example:"Generating a background in a brand's visual style"},
  {id:"t3",name:"Runway ML",desc:"Video transformation & generation",correct:"Transformative",example:"Converting a rough video sketch into a polished clip"},
  {id:"t4",name:"Grammarly",desc:"Writing analysis & suggestions",correct:"Analytical",example:"Flagging passive voice and weak word choices in a draft"},
  {id:"t5",name:"DALL·E",desc:"Text → image generation",correct:"Generative",example:"Visualizing a concept that doesn't exist in stock photos"},
  {id:"t6",name:"Stable Diffusion img2img",desc:"Image → transformed image",correct:"Transformative",example:"Applying a painterly style to a photograph"},
  {id:"t7",name:"Hemingway Editor",desc:"Readability scoring & feedback",correct:"Analytical",example:"Identifying overly complex sentences in a marketing piece"},
  {id:"t8",name:"ElevenLabs Voice Clone",desc:"Text → cloned voice audio",correct:"Generative",example:"Generating narration in a brand voice from a script"},
];

function ToolExplorer() {
  const [placed,setPlaced] = useState({});
  const [feedback,setFeedback] = useState(null);
  const CATS = ["Generative","Transformative","Analytical"];
  const CAT_COLORS = {Generative:"#2563EB",Transformative:"#D97706",Analytical:"#059669"};
  const CAT_BG = {Generative:"#EFF6FF",Transformative:"#FFFBEB",Analytical:"#ECFDF5"};

  const unplaced = TOOLS.filter(t=>!placed[t.id]);
  const score = Object.entries(placed).filter(([id,cat])=>TOOLS.find(t=>t.id===id)?.correct===cat).length;
  const done = Object.keys(placed).length === TOOLS.length;

  function place(toolId,cat){
    const t = TOOLS.find(x=>x.id===toolId);
    const correct = t.correct === cat;
    setPlaced(p=>({...p,[toolId]:cat}));
    setFeedback({toolId,correct,msg:correct?`Correct! ${t.name} is a ${cat} tool. ${t.example}.`:`Not quite. ${t.name} is a ${t.correct} tool — ${t.example}.`});
    setTimeout(()=>setFeedback(f=>f?.toolId===toolId?null:f),3500);
  }

  return (
    <div style={{background:"white",borderRadius:12,padding:24,border:"1px solid #E5E7EB"}}>
      <p style={{fontSize:14,color:"#6B7280",marginBottom:16,lineHeight:1.6}}>Classify each AI tool into its primary category by clicking a category button. Use the examples to guide your thinking.</p>
      {feedback && (
        <div style={{padding:"10px 14px",borderRadius:8,marginBottom:16,background:feedback.correct?"#F0FDF4":"#FEF2F2",border:`1px solid ${feedback.correct?"#16A34A":"#DC2626"}`,fontSize:14,color:feedback.correct?"#15803D":"#DC2626",transition:"all .3s"}}>
          {feedback.correct?"✓":"✗"} {feedback.msg}
        </div>
      )}
      {!done && (
        <div style={{marginBottom:20}}>
          <p style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#9CA3AF",marginBottom:10,fontFamily:"'JetBrains Mono',monospace"}}>Unclassified Tools</p>
          {unplaced.map(t=>(
            <div key={t.id} style={{border:"1px solid #E5E7EB",borderRadius:8,padding:"10px 14px",marginBottom:8,background:"#F9F8F5"}}>
              <div style={{fontWeight:600,fontSize:15,marginBottom:2}}>{t.name}</div>
              <div style={{fontSize:13,color:"#6B7280",marginBottom:10}}>{t.desc}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {CATS.map(cat=>(
                  <button key={cat} className="zy-btn" onClick={()=>place(t.id,cat)}
                    style={{padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:700,background:CAT_BG[cat],color:CAT_COLORS[cat],border:`1.5px solid ${CAT_COLORS[cat]}`,cursor:"pointer"}}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {CATS.map(cat=>{
        const inCat = TOOLS.filter(t=>placed[t.id]===cat);
        return (
          <div key={cat} style={{border:`2px solid ${CAT_COLORS[cat]}`,borderRadius:10,padding:14,marginBottom:12,background:CAT_BG[cat]}}>
            <div style={{fontWeight:700,color:CAT_COLORS[cat],marginBottom:8,fontSize:14}}>{cat} Tools ({inCat.length})</div>
            {inCat.length===0 && <div style={{fontSize:13,color:"#9CA3AF",fontStyle:"italic"}}>No tools placed yet</div>}
            {inCat.map(t=>{
              const correct = t.correct===cat;
              return (
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,fontSize:13}}>
                  <span style={{color:correct?"#16A34A":"#DC2626",fontWeight:700}}>{correct?"✓":"✗"}</span>
                  <span style={{color:correct?"#166534":"#DC2626"}}>{t.name}</span>
                </div>
              );
            })}
          </div>
        );
      })}
      {done && (
        <div style={{textAlign:"center",padding:16,background:"#F0FDF4",borderRadius:10,border:"2px solid #16A34A",marginTop:8}}>
          <div style={{fontSize:22,fontWeight:700,color:"#15803D"}}>Score: {score} / {TOOLS.length}</div>
          <div style={{fontSize:14,color:"#166534",marginTop:4}}>{score===TOOLS.length?"Perfect! You understand all three AI tool categories.":score>=6?"Strong work — review any incorrect placements above.":"Keep studying the category definitions and try again."}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LAB: PROMPT BUILDER
═══════════════════════════════════════════════════════════════ */
const PROMPT_PARTS = {
  subject:[{v:"",label:"— choose —"},{v:"portrait of a person",label:"Portrait of a person"},{v:"architectural exterior",label:"Architectural exterior"},{v:"product on surface",label:"Product on a surface"},{v:"abstract composition",label:"Abstract composition"},{v:"natural landscape",label:"Natural landscape"}],
  style:[{v:"",label:"— choose —"},{v:"editorial photography",label:"Editorial photography"},{v:"oil painting",label:"Oil painting"},{v:"isometric illustration",label:"Isometric illustration"},{v:"ink sketch",label:"Ink sketch"},{v:"3D render",label:"3D render"}],
  lighting:[{v:"",label:"— choose —"},{v:"golden hour sunlight",label:"Golden hour sunlight"},{v:"soft studio lighting",label:"Soft studio lighting"},{v:"dramatic side light",label:"Dramatic side light"},{v:"flat overcast",label:"Flat overcast"},{v:"neon-lit night",label:"Neon-lit night"}],
  mood:[{v:"",label:"— choose —"},{v:"serene and contemplative",label:"Serene and contemplative"},{v:"tense and cinematic",label:"Tense and cinematic"},{v:"playful and energetic",label:"Playful and energetic"},{v:"melancholic and quiet",label:"Melancholic and quiet"},{v:"luxurious and refined",label:"Luxurious and refined"}],
  camera:[{v:"",label:"— choose —"},{v:"Sony A7 35mm f/1.8",label:"Sony A7 35mm f/1.8"},{v:"Hasselblad medium format",label:"Hasselblad medium format"},{v:"wide angle 16mm",label:"Wide angle 16mm"},{v:"macro close-up",label:"Macro close-up"},{v:"no camera spec",label:"No camera spec"}],
  negative:[{v:"",label:"— choose —"},{v:"blurry, low quality",label:"Blurry, low quality"},{v:"oversaturated, garish colors",label:"Oversaturated, garish"},{v:"text, watermarks",label:"Text, watermarks"},{v:"cartoon, anime",label:"Cartoon, anime"},{v:"extra limbs, deformed",label:"Extra limbs, deformed"}]
};

function PromptBuilder() {
  const [sel,setSel] = useState({subject:"",style:"",lighting:"",mood:"",camera:"",negative:""});
  const labels = {subject:"Subject",style:"Style",lighting:"Lighting",mood:"Mood",camera:"Camera / Lens",negative:"Negative Prompt"};
  const filled = Object.values(sel).filter(v=>v&&v!=="").length;
  const maxScore = Object.keys(sel).length;
  const score = Math.round((filled/maxScore)*100);
  const scoreColor = score<40?"#DC2626":score<70?"#D97706":"#059669";

  const prompt = [sel.subject,sel.style,sel.lighting,sel.mood,sel.camera].filter(v=>v).join(", ");
  const negPrompt = sel.negative || "";

  return (
    <div style={{background:"white",borderRadius:12,padding:24,border:"1px solid #E5E7EB"}}>
      <p style={{fontSize:14,color:"#6B7280",marginBottom:18,lineHeight:1.6}}>Build a structured image prompt by selecting each component. Watch how each addition increases prompt quality and specificity.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {Object.entries(labels).map(([key,label])=>(
          <div key={key}>
            <label style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,color:"#6B7280",display:"block",marginBottom:4,fontFamily:"'JetBrains Mono',monospace"}}>{label}</label>
            <select value={sel[key]} onChange={e=>setSel(p=>({...p,[key]:e.target.value}))}
              style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1.5px solid #E5E7EB",fontSize:14,background:"#F9F8F5",fontFamily:"'Source Serif 4',serif",outline:"none",cursor:"pointer"}}>
              {PROMPT_PARTS[key].map(o=><option key={o.v} value={o.v}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div style={{background:"#0A0A1A",borderRadius:10,padding:16,marginBottom:16}}>
        <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"#6B7280",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Generated Prompt</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#E2E8F0",lineHeight:1.7,minHeight:44}}>
          {prompt || <span style={{color:"#4B5563",fontStyle:"italic"}}>Select components to build your prompt...</span>}
        </div>
        {negPrompt && <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #1F2937"}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#DC2626",marginRight:8}}>NEGATIVE:</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#FCA5A5"}}>{negPrompt}</span>
        </div>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{flex:1,height:10,background:"#F3F4F6",borderRadius:99,overflow:"hidden"}}>
          <div className="zy-progress" style={{height:"100%",background:scoreColor,borderRadius:99,width:`${score}%`}}/>
        </div>
        <div style={{fontSize:14,fontWeight:700,color:scoreColor,minWidth:72,fontFamily:"'JetBrains Mono',monospace"}}>{score}% quality</div>
      </div>
      <div style={{marginTop:8,fontSize:13,color:"#6B7280"}}>
        {score===0?"Start by choosing a subject.":score<40?"Add more components to improve specificity.":score<70?"Good progress — lighting and mood add significant quality.":score<100?"Nearly complete — a negative prompt helps avoid common artifacts.":"Complete prompt! This level of specificity will produce consistent, intentional results."}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LAB: STYLE TRANSFORMER
═══════════════════════════════════════════════════════════════ */
const ORIGINAL = "The housing market in this city has become increasingly unaffordable over the past decade. Many long-term residents can no longer afford to remain in neighborhoods where they have lived for years. New construction has not kept pace with demand, and policy responses have been inadequate.";

const REGISTERS = {
  academic:{
    label:"Academic",color:"#2563EB",bg:"#EFF6FF",
    text:"A longitudinal analysis of urban housing markets reveals a sustained decline in affordability metrics over the preceding decade. Displacement pressures have disproportionately impacted established resident populations in high-demand neighborhoods. Structural supply deficits, compounded by insufficient policy intervention, have exacerbated socioeconomic stratification.",
    notes:["Passive voice and nominalization ('displacement pressures')", "Hedged but precise language ('sustained decline')", "Technical vocabulary ('longitudinal', 'stratification')", "No emotional language — distance is a stylistic value"]
  },
  journalistic:{
    label:"Journalism",color:"#D97706",bg:"#FFFBEB",
    text:"Long-time residents across the city are being priced out of neighborhoods they've called home for decades. Despite a construction boom, housing experts say supply still falls far short of demand — and city leaders have done little to close the gap.",
    notes:["Active verbs and present tense ('are being priced out')", "Human-centered framing ('residents they've called home')", "Expert attribution without full citation", "One short sentence creates rhythm and punch"]
  },
  marketing:{
    label:"Marketing",color:"#059669",bg:"#ECFDF5",
    text:"Your city is changing. Demand for quality housing has never been higher — and innovative developers are meeting that demand with solutions designed for modern urban living. There's never been a better time to invest in the communities that are shaping tomorrow.",
    notes:["Second person ('Your city') creates immediacy", "Positive reframe of scarcity as opportunity", "Implicit call to action embedded in narrative", "Vague language ('quality', 'innovative') works here — specificity would narrow the audience"]
  },
  conversational:{
    label:"Conversational",color:"#7C3AED",bg:"#F5F3FF",
    text:"The housing situation here has gotten pretty bad — like, people who've lived in the same neighborhood for 20 years can't afford to stay anymore. They keep building new places, but it's never enough, and honestly the city hasn't really done much about it.",
    notes:["Hedging words ('pretty bad', 'honestly') signal authenticity", "Colloquial qualifiers ('like', 'really') reduce authority but increase relatability", "First-person implied perspective builds connection", "Loose sentence structure mirrors spoken thought"]
  }
};

function StyleTransformer() {
  const [active,setActive] = useState(null);
  return (
    <div style={{background:"white",borderRadius:12,padding:24,border:"1px solid #E5E7EB"}}>
      <p style={{fontSize:14,color:"#6B7280",marginBottom:14,lineHeight:1.6}}>The paragraph below describes the same situation in four different communication registers. Select a register to see the transformed version with annotations explaining the stylistic choices.</p>
      <div style={{background:"#F9F8F5",borderRadius:8,padding:14,marginBottom:18,fontSize:15,lineHeight:1.75,color:"#374151",borderLeft:"4px solid #D1D5DB"}}>
        <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"#9CA3AF",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Original Text</div>
        {ORIGINAL}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
        {Object.entries(REGISTERS).map(([k,r])=>(
          <button key={k} className="zy-btn" onClick={()=>setActive(active===k?null:k)}
            style={{padding:"7px 18px",borderRadius:20,fontSize:13,fontWeight:700,background:active===k?r.color:r.bg,color:active===k?"white":r.color,border:`2px solid ${r.color}`,cursor:"pointer",transition:"all .15s"}}>
            {r.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="zy-fade" style={{border:`2px solid ${REGISTERS[active].color}`,borderRadius:10,overflow:"hidden"}}>
          <div style={{background:REGISTERS[active].color,padding:"8px 16px"}}>
            <span style={{fontSize:12,fontWeight:700,color:"white",fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>{REGISTERS[active].label} Register</span>
          </div>
          <div style={{padding:16,background:REGISTERS[active].bg}}>
            <p style={{fontSize:15,lineHeight:1.8,color:"#1C1C1E",marginBottom:16}}>{REGISTERS[active].text}</p>
            <div style={{borderTop:`1px solid ${REGISTERS[active].color}30`,paddingTop:12}}>
              <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:REGISTERS[active].color,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Style Annotations</div>
              {REGISTERS[active].notes.map((n,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,fontSize:13,color:"#374151",alignItems:"flex-start"}}>
                  <span style={{color:REGISTERS[active].color,fontWeight:700,flexShrink:0}}>→</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LAB: PIPELINE BUILDER
═══════════════════════════════════════════════════════════════ */
const PIPELINE_MODULES = [
  {id:"pm1",label:"Concept Input",icon:"✍️",desc:"Human provides the core idea or brief",color:"#6B7280",type:"input"},
  {id:"pm2",label:"Text Generation",icon:"🤖",desc:"LLM expands concept into structured content",color:"#2563EB",type:"ai"},
  {id:"pm3",label:"Quality Gate",icon:"🔍",desc:"Human reviews and edits AI output",color:"#D97706",type:"human"},
  {id:"pm4",label:"Image Generation",icon:"🎨",desc:"Text-to-image model creates visual assets",color:"#7C3AED",type:"ai"},
  {id:"pm5",label:"Audio Generation",icon:"🎵",desc:"AI generates music or voice from text",color:"#059669",type:"ai"},
  {id:"pm6",label:"Final Assembly",icon:"📦",desc:"Human assembles and packages all outputs",color:"#E8503A",type:"output"},
];

const VALID_PIPELINES = [
  ["pm1","pm2","pm3","pm4","pm6"],
  ["pm1","pm2","pm3","pm5","pm6"],
  ["pm1","pm2","pm3","pm4","pm5","pm6"],
  ["pm1","pm2","pm4","pm3","pm6"],
];

function PipelineBuilder() {
  const [pipeline,setPipeline] = useState([]);
  const [result,setResult] = useState(null);

  function toggle(id){
    setResult(null);
    setPipeline(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  }

  function check(){
    if(pipeline.length<3){setResult({ok:false,msg:"A valid pipeline needs at least 3 stages."});return;}
    const hasInput = pipeline[0]==="pm1";
    const hasOutput = pipeline[pipeline.length-1]==="pm6";
    const hasGate = pipeline.includes("pm3");
    const hasAI = pipeline.some(id=>PIPELINE_MODULES.find(m=>m.id===id)?.type==="ai");
    if(!hasInput){setResult({ok:false,msg:"Your pipeline should start with the Concept Input stage."});return;}
    if(!hasOutput){setResult({ok:false,msg:"Your pipeline should end with Final Assembly — a human-led output stage."});return;}
    if(!hasGate){setResult({ok:false,msg:"Missing Quality Gate — every professional pipeline needs human review before final output."});return;}
    if(!hasAI){setResult({ok:false,msg:"Include at least one AI transform module (Text Generation, Image Generation, or Audio Generation)."});return;}
    setResult({ok:true,msg:`Valid pipeline! ${pipeline.length} stages with proper input, AI transforms, quality gate, and human-led output. This is a well-structured modular workflow.`});
  }

  return (
    <div style={{background:"white",borderRadius:12,padding:24,border:"1px solid #E5E7EB"}}>
      <p style={{fontSize:14,color:"#6B7280",marginBottom:18,lineHeight:1.6}}>Build a valid AI pipeline by selecting stages in order. A good pipeline: starts with human input, includes at least one AI transform, has a quality gate, and ends with human assembly. Click stages to add/remove them.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
        {PIPELINE_MODULES.map(m=>{
          const idx = pipeline.indexOf(m.id);
          const selected = idx !== -1;
          return (
            <div key={m.id} onClick={()=>toggle(m.id)} className="pipeline-module"
              style={{border:`2px solid ${selected?m.color:"#E5E7EB"}`,borderRadius:10,padding:"12px 14px",background:selected?m.color+"15":"white",cursor:"pointer",position:"relative"}}>
              {selected && <div style={{position:"absolute",top:8,right:10,width:20,height:20,borderRadius:"50%",background:m.color,color:"white",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace"}}>{idx+1}</div>}
              <div style={{fontSize:20,marginBottom:4}}>{m.icon}</div>
              <div style={{fontWeight:700,fontSize:14,color:m.color,marginBottom:2}}>{m.label}</div>
              <div style={{fontSize:12,color:"#6B7280"}}>{m.desc}</div>
              <div style={{marginTop:6,fontSize:10,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:.8,color:m.type==="ai"?"#2563EB":m.type==="human"?"#D97706":m.type==="input"?"#6B7280":"#E8503A",fontWeight:700}}>
                {m.type==="ai"?"AI Module":m.type==="human"?"Human Gate":m.type==="input"?"Input":"Output"}
              </div>
            </div>
          );
        })}
      </div>
      {pipeline.length>0 && (
        <div style={{background:"#F9F8F5",borderRadius:8,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",flexWrap:"wrap",gap:6}}>
          {pipeline.map((id,i)=>{
            const m = PIPELINE_MODULES.find(x=>x.id===id);
            return (
              <div key={id} style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:13,fontWeight:700,color:m.color}}>{m.icon} {m.label}</span>
                {i<pipeline.length-1 && <span style={{color:"#9CA3AF",fontSize:16}}>→</span>}
              </div>
            );
          })}
        </div>
      )}
      <div style={{display:"flex",gap:10}}>
        <button className="zy-btn" onClick={check}
          style={{padding:"10px 24px",borderRadius:8,background:"#1E2642",color:"white",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Validate Pipeline
        </button>
        <button className="zy-btn" onClick={()=>{setPipeline([]);setResult(null);}}
          style={{padding:"10px 16px",borderRadius:8,background:"#F3F4F6",color:"#374151",fontSize:14,fontWeight:600,cursor:"pointer"}}>
          Clear
        </button>
      </div>
      {result && (
        <div className="zy-fade" style={{marginTop:14,padding:"12px 16px",borderRadius:8,background:result.ok?"#F0FDF4":"#FEF2F2",border:`1.5px solid ${result.ok?"#16A34A":"#DC2626"}`,fontSize:14,color:result.ok?"#15803D":"#DC2626",lineHeight:1.6}}>
          {result.ok?"✓":"✗"} {result.msg}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACTIVITY COMPONENTS
═══════════════════════════════════════════════════════════════ */
function ActivityBlock({block,actState,onAnswer,accentColor}){
  const isChallenge = block.type==="challenge";
  const answered = accentColor && actState?.[block.id]?.answered;
  const selected = actState?.[block.id]?.selected;
  const correct = actState?.[block.id]?.correct;
  const LETTERS = ["A","B","C","D"];

  const borderColor = isChallenge?"#D97706":"#2563EB";
  const bgColor = isChallenge?"#FFFBEB":"#EFF6FF";
  const tagLabel = isChallenge?"Challenge Activity":"Participation Activity";
  const tagColor = isChallenge?"#D97706":"#2563EB";

  return (
    <div style={{borderLeft:`4px solid ${borderColor}`,background:bgColor,borderRadius:"0 10px 10px 0",padding:"18px 20px",margin:"22px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,color:tagColor,fontFamily:"'JetBrains Mono',monospace",background:tagColor+"20",padding:"3px 10px",borderRadius:20}}>{tagLabel}</span>
      </div>
      {isChallenge && block.scenario && (
        <div style={{background:"white",borderRadius:8,padding:"12px 14px",marginBottom:12,fontSize:14,lineHeight:1.75,color:"#374151",border:"1px solid #FDE68A"}}>
          <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#D97706",fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:1}}>Scenario</div>
          {block.scenario}
        </div>
      )}
      <p style={{fontSize:15,fontWeight:600,lineHeight:1.7,color:"#1C1C1E",marginBottom:14}}>{block.prompt||block.question}</p>
      <div>
        {block.options.map((opt,i)=>{
          let cls="zy-opt";
          if(answered){
            cls+=" locked";
            if(opt.id===block.correct) cls+=" correct";
            else if(opt.id===selected && !correct) cls+=" wrong";
          }
          return (
            <button key={opt.id} className={cls} onClick={()=>!answered&&onAnswer(block.id,opt.id,opt.id===block.correct)}>
              <span className="zy-pill" style={{background:answered&&opt.id===block.correct?"#16A34A":answered&&opt.id===selected&&!correct?"#DC2626":"#E5E7EB",color:answered&&(opt.id===block.correct||(opt.id===selected&&!correct))?"white":"#6B7280"}}>{LETTERS[i]}</span>
              <span style={{fontSize:14,lineHeight:1.6,color:"#1C1C1E"}}>{opt.text}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="zy-fade" style={{marginTop:14,padding:"12px 14px",borderRadius:8,background:correct?"#F0FDF4":"#FEF3C7",border:`1.5px solid ${correct?"#16A34A":"#D97706"}`,fontSize:14,lineHeight:1.7,color:"#1C1C1E"}}>
          <span style={{fontWeight:700,color:correct?"#15803D":"#92400E"}}>{correct?"✓ Correct — ":"Review — "}</span>
          {block.explanation}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CALLOUT
═══════════════════════════════════════════════════════════════ */
const CALLOUT_STYLES = {
  key:{border:"#7C3AED",bg:"#F5F3FF",label:"Key Concept",icon:"◆"},
  technical:{border:"#0D9488",bg:"#F0FDFA",label:"Technical Detail",icon:"⚙"},
  workflow:{border:"#059669",bg:"#ECFDF5",label:"Workflow Guide",icon:"→"},
  warning:{border:"#DC2626",bg:"#FEF2F2",label:"Important Warning",icon:"⚠"},
};
function Callout({variant,title,content}){
  const s = CALLOUT_STYLES[variant]||CALLOUT_STYLES.key;
  const parts = content.split(/\*\*(.+?)\*\*/g);
  return (
    <div style={{border:`1.5px solid ${s.border}`,borderRadius:10,padding:"14px 18px",margin:"20px 0",background:s.bg}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
        <span style={{color:s.border,fontSize:12,fontWeight:700}}>{s.icon}</span>
        <span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:s.border,fontFamily:"'JetBrains Mono',monospace"}}>{s.label}</span>
        {title&&<span style={{fontSize:14,fontWeight:700,color:"#1C1C1E",marginLeft:4}}>— {title}</span>}
      </div>
      <div style={{fontSize:14,lineHeight:1.8,color:"#374151"}}>
        {parts.map((p,i)=>i%2===0?<span key={i}>{p}</span>:<strong key={i} style={{color:"#1C1C1E"}}>{p}</strong>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RICH TEXT RENDERER
═══════════════════════════════════════════════════════════════ */
function RichText({text}){
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((p,i)=>i%2===0?<span key={i}>{p}</span>:<strong key={i}>{p}</strong>)}</>;
}

/* ═══════════════════════════════════════════════════════════════
   SECTION RENDERER
═══════════════════════════════════════════════════════════════ */
const LAB_COMPONENTS = {ToolExplorer,PromptBuilder,StyleTransformer,PipelineBuilder};

function SectionContent({section,moduleColor,actState,onAnswer}){
  return (
    <div className="zy-fade">
      {section.blocks.map((block,i)=>{
        if(block.type==="text") return (
          <p key={i} style={{fontSize:16,lineHeight:1.85,color:"#1C1C1E",marginBottom:18}}><RichText text={block.content}/></p>
        );
        if(block.type==="callout") return <Callout key={i} {...block}/>;
        if(block.type==="participation"||block.type==="challenge") return (
          <ActivityBlock key={i} block={block} actState={actState} onAnswer={onAnswer} accentColor={moduleColor}/>
        );
        if(block.type==="lab"){
          const Lab = LAB_COMPONENTS[block.component];
          return (
            <div key={i}>
              <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"#0D9488",fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,background:"#F0FDFA",padding:"5px 12px",borderRadius:20,display:"inline-block",marginBottom:12}}>
                ⬡ Interactive Lab
              </div>
              {Lab?<Lab/>:<div style={{padding:20,background:"#F9F8F5",borderRadius:8,color:"#6B7280"}}>Lab loading...</div>}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function AITextbook(){
  const [currentSection,setCurrentSection] = useState("m1s1");
  const [actState,setActState] = useState({});
  const [completedSections,setCompleted] = useState(new Set());
  const [expanded,setExpanded] = useState(new Set(["m1"]));

  useEffect(()=>{
    const el = document.getElementById("zy-global-style");
    if(!el){const s=document.createElement("style");s.id="zy-global-style";s.textContent=CSS;document.head.appendChild(s);}
  },[]);

  const allSections = MODULES.flatMap(m=>m.sections.map(s=>({...s,moduleId:m.id,moduleColor:m.color,moduleTitle:m.title})));
  const currentIdx = allSections.findIndex(s=>s.id===currentSection);
  const currentSec = allSections[currentIdx];
  const currentMod = MODULES.find(m=>m.id===currentSec?.moduleId);

  function handleAnswer(actId,optId,isCorrect){
    setActState(p=>({...p,[actId]:{answered:true,selected:optId,correct:isCorrect}}));
    // Mark section complete when all activities answered
    const sec = allSections.find(s=>s.id===currentSection);
    const activities = sec?.blocks.filter(b=>b.type==="participation"||b.type==="challenge")||[];
    const newState = {...actState,[actId]:{answered:true,selected:optId,correct:isCorrect}};
    const allDone = activities.every(b=>newState[b.id]?.answered);
    if(allDone) setCompleted(p=>new Set([...p,currentSection]));
  }

  function navigate(secId){
    setCurrentSection(secId);
    const modId = allSections.find(s=>s.id===secId)?.moduleId;
    if(modId) setExpanded(p=>new Set([...p,modId]));
    setTimeout(()=>{document.querySelector(".zy-content-scroll")?.scrollTo({top:0,behavior:"smooth"})},50);
  }

  const totalActivities = allSections.flatMap(s=>s.blocks.filter(b=>b.type==="participation"||b.type==="challenge")).length;
  const answered = Object.keys(actState).length;
  const progress = totalActivities>0?Math.round((answered/totalActivities)*100):0;

  return (
    <div className="zy-root" style={{height:"100vh",overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:"#1E2642",padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700,fontSize:18,color:"white",letterSpacing:-.3}}>AI in Creative Practice</div>
          <div style={{fontSize:11,color:"#94A3B8",fontFamily:"'JetBrains Mono',monospace"}}>Interactive Textbook</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontSize:12,color:"#94A3B8",fontFamily:"'JetBrains Mono',monospace"}}>{progress}% complete</div>
          <div style={{width:140,height:6,background:"rgba(255,255,255,.15)",borderRadius:99,overflow:"hidden"}}>
            <div className="zy-progress" style={{height:"100%",background:"#22C55E",borderRadius:99,width:`${progress}%`}}/>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Sidebar */}
        <div className="zy-sidebar-scroll" style={{width:270,background:"#1E2642",flexShrink:0,padding:"16px 0"}}>
          {MODULES.map(mod=>{
            const isExpanded = expanded.has(mod.id);
            return (
              <div key={mod.id}>
                <div onClick={()=>setExpanded(p=>{const n=new Set(p);n.has(mod.id)?n.delete(mod.id):n.add(mod.id);return n;})}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",cursor:"pointer",transition:"background .15s"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:mod.color,fontWeight:700,minWidth:26}}>{mod.num}</span>
                  <span style={{fontSize:13,fontWeight:600,color:"#E2E8F0",flex:1,lineHeight:1.4}}>{mod.title}</span>
                  <span style={{color:"#475569",fontSize:11,transform:isExpanded?"rotate(180deg)":"",transition:"transform .2s"}}>▼</span>
                </div>
                {isExpanded && mod.sections.map(sec=>{
                  const isCurrent = currentSection===sec.id;
                  const isDone = completedSections.has(sec.id);
                  const isLab = sec.blocks[0]?.type==="lab";
                  return (
                    <div key={sec.id} className={`zy-sidebar-link${isCurrent?" active":""}`} onClick={()=>navigate(sec.id)}
                      style={{padding:"8px 20px 8px 56px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",borderLeftColor:isCurrent?mod.color:"transparent",color:isCurrent?"white":"#94A3B8"}}>
                      <span style={{fontSize:11,flexShrink:0}}>{isDone?"✓":isLab?"⬡":"○"}</span>
                      <span style={{fontSize:13,lineHeight:1.4}}>{sec.title}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="zy-content-scroll" style={{flex:1,padding:"0 0 80px"}}>
          {currentSec && (
            <>
              {/* Section header */}
              <div style={{background:"white",borderBottom:"1px solid #E5E7EB",padding:"24px 48px 20px"}}>
                <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:currentMod?.color,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>
                  Module {currentMod?.num} — {currentMod?.title}
                </div>
                <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:28,fontWeight:700,color:"#1C1C1E",lineHeight:1.3,letterSpacing:-.5}}>{currentSec.title}</h1>
                {completedSections.has(currentSection) && (
                  <div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:6,fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#15803D",background:"#F0FDF4",padding:"4px 12px",borderRadius:20,border:"1px solid #86EFAC"}}>
                    ✓ Section Complete
                  </div>
                )}
              </div>

              {/* Section body */}
              <div style={{maxWidth:760,padding:"32px 48px"}}>
                <SectionContent section={currentSec} moduleColor={currentMod?.color} actState={actState} onAnswer={handleAnswer}/>
              </div>

              {/* Navigation */}
              <div style={{maxWidth:760,padding:"0 48px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <button className="zy-btn" onClick={()=>currentIdx>0&&navigate(allSections[currentIdx-1].id)}
                  disabled={currentIdx===0}
                  style={{padding:"10px 22px",borderRadius:8,background:currentIdx===0?"#F3F4F6":"white",color:currentIdx===0?"#9CA3AF":"#1C1C1E",border:"1.5px solid #E5E7EB",fontSize:14,fontWeight:600,cursor:currentIdx===0?"not-allowed":"pointer"}}>
                  ← Previous
                </button>
                <span style={{fontSize:13,color:"#9CA3AF",fontFamily:"'JetBrains Mono',monospace"}}>{currentIdx+1} / {allSections.length}</span>
                <button className="zy-btn" onClick={()=>currentIdx<allSections.length-1&&navigate(allSections[currentIdx+1].id)}
                  disabled={currentIdx===allSections.length-1}
                  style={{padding:"10px 22px",borderRadius:8,background:currentIdx===allSections.length-1?"#F3F4F6":currentMod?.color,color:currentIdx===allSections.length-1?"#9CA3AF":"white",border:"none",fontSize:14,fontWeight:600,cursor:currentIdx===allSections.length-1?"not-allowed":"pointer"}}>
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
