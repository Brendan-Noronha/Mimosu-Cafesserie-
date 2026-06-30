import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-5";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface AgentInput {
  jobPosting: string;
  candidateBackground: string;
  targetRole: string;
}

export interface CareerPack {
  resume: string;
  coverLetter: string;
  linkedInAbout: string;
  summary: string;
}

async function runAgent(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const message = await getClient().messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: userMessage }],
    system: systemPrompt,
  });
  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

// Agent 1: Researcher — extracts keywords and requirements from the job posting
async function researcher(input: AgentInput): Promise<string> {
  return runAgent(
    `You are a meticulous job analyst. Your job is to extract the most important
keywords, required skills, preferred qualifications, tone, and cultural signals
from a job posting. Be precise and thorough. Output a structured analysis
that a resume writer can use directly to tailor application documents.`,
    `Analyze this job posting for the role of "${input.targetRole}" and extract:
1. Must-have hard skills (technical, tools, certifications)
2. Soft skills emphasized
3. Keywords that should appear in the resume (ATS-critical terms)
4. Company culture / tone signals
5. Key responsibilities to mirror in the resume

JOB POSTING:
${input.jobPosting}`
  );
}

// Agent 2: Writer — drafts resume, cover letter, LinkedIn About from the analysis
async function writer(
  input: AgentInput,
  researchAnalysis: string
): Promise<string> {
  return runAgent(
    `You are an expert career document writer with 10+ years of experience helping
candidates land jobs at top companies. You write in a confident, results-focused
tone. You tailor every document tightly to the specific job and company.
Always use strong action verbs. Quantify achievements where possible.
Format resumes in clean plain text with clear sections.`,
    `Using the job analysis below, write three career documents tailored to "${input.targetRole}":

---RESEARCH ANALYSIS---
${researchAnalysis}

---CANDIDATE BACKGROUND---
${input.candidateBackground}

Write:

## RESUME
(Clean plain-text resume, reverse chronological, tailored to the job. Include: Summary, Experience, Skills, Education. Keep it to one page worth of content.)

## COVER LETTER
(3 short paragraphs: why this role, what they bring, call to action. Warm but professional tone.)

## LINKEDIN ABOUT
(3-4 sentence first-person About section. Engaging, keyword-rich, ends with what the candidate is looking for.)`
  );
}

// Agent 3: ATS Optimizer — checks keyword coverage and suggests fixes
async function atsOptimizer(
  input: AgentInput,
  draftDocuments: string,
  researchAnalysis: string
): Promise<string> {
  return runAgent(
    `You are an ATS (Applicant Tracking System) expert. You know exactly which
keywords recruiters and ATS systems scan for. Your job is to review drafted
career documents against the job posting analysis and improve keyword coverage
without making the text feel stuffed or unnatural. Output the improved versions.`,
    `Review these career documents and improve ATS keyword coverage based on the analysis.
Return the same three documents (RESUME, COVER LETTER, LINKEDIN ABOUT) with improvements.

---JOB ANALYSIS (keywords to target)---
${researchAnalysis}

---DRAFTED DOCUMENTS---
${draftDocuments}

Return the full improved versions of all three documents with the same ## headers.`
  );
}

// Agent 4: Editor — final polish pass for tone, flow, and quality
async function editor(optimizedDocuments: string): Promise<string> {
  return runAgent(
    `You are a senior editor who refines career documents to sound polished,
human, and compelling — never robotic or generic. Fix any awkward phrasing,
clichés ("results-driven team player"), or filler. Ensure consistent tone.
Make every sentence earn its place. Return the final publication-ready versions.`,
    `Do a final editing pass on these career documents. Fix any clichés,
awkward phrasing, or weak language. Make it sound authentic and compelling.
Return the final versions with the same ## headers (RESUME, COVER LETTER, LINKEDIN ABOUT).

${optimizedDocuments}`
  );
}

// Parses final agent output into structured CareerPack
function parseFinalOutput(raw: string): CareerPack {
  const extract = (start: string, end?: string): string => {
    const startIdx = raw.indexOf(start);
    if (startIdx === -1) return "";
    const contentStart = startIdx + start.length;
    const endIdx = end ? raw.indexOf(end, contentStart) : raw.length;
    return raw.slice(contentStart, endIdx === -1 ? raw.length : endIdx).trim();
  };

  return {
    resume: extract("## RESUME", "## COVER LETTER"),
    coverLetter: extract("## COVER LETTER", "## LINKEDIN ABOUT"),
    linkedInAbout: extract("## LINKEDIN ABOUT"),
    summary: `Tailored Career Launch Pack: resume, cover letter, and LinkedIn About section optimized for your target role.`,
  };
}

export async function generateCareerPack(
  input: AgentInput
): Promise<CareerPack> {
  const analysis = await researcher(input);
  const draft = await writer(input, analysis);
  const optimized = await atsOptimizer(input, draft, analysis);
  const final = await editor(optimized);
  return parseFinalOutput(final);
}
