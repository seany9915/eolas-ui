---
name: easy-read
description: Convert content into UK Easy Read format — one idea per line, one image per idea, literal non-figurative language, and a fixed document structure — for readers with learning disabilities, cognitive impairments, or very low literacy. Use when asked for an "easy read" version, an accessible/plain-language version for people with learning disabilities, or content meeting the Mencap/GOV.UK Easy Read standard. Distinct from general plain-English/GOV.UK style — Easy Read is a specific, stricter, image-paired format, not just "simpler writing".
user-invokable: true
args:
  - name: target
    description: The document or content to convert into Easy Read format (optional)
    required: false
---

Easy Read is a distinct, standardised UK accessible-information format — not a synonym for "plain English" or "GOV.UK style". It is designed for people with learning disabilities, people with some cognitive impairments (including some dementia and acquired brain injury), and people with very low literacy or English as an additional language. It follows the Accessible Information Standard and the Mencap/GOV.UK Easy Read conventions. If the reader only needs clearer prose (not this stricter format), use the `govuk-style` or `patient-communication` skill instead — do not default to Easy Read for general plain-language requests.

## When to reach for this vs. the other content skills

- **`easy-read` (this skill):** the deliverable must be genuinely Easy Read — one idea per line, an image beside every idea, explicitly requested or aimed at a learning-disability/cognitive-impairment audience.
- **`govuk-style`:** reports, guidance, documentation — plain English, but normal prose/paragraph structure.
- **`patient-communication`:** patient letters/leaflets in plain English, but still ordinary sentence/paragraph prose, not the image-paired Easy Read layout.
These three are deliberately separate skills, not one merged "copy style" skill — they produce structurally different output, and merging them would blunt how each gets triggered.

## Document structure

Every Easy Read document follows the same shape:

1. **Title** — short, in plain words, describes what the document is about.
2. **Introduction** — 1-2 lines explaining what this document is and who it is for.
3. **Body** — the content itself, broken into the smallest sensible chunks (see below).
4. **"Hard words" box (if needed)** — if a technical/clinical term is unavoidable, explain it once in a clearly marked box near first use, in plain words.
5. **Contact / "more information" section** — who to contact, how, and what happens next. Every Easy Read document should end with a clear next step or a way to ask for help, not just trail off.

## Writing rules (stricter than plain English)

- **One idea per line, one line per sentence.** Do not wrap two clauses into one line even if both are short. If a sentence needs "and" or "but" to join two ideas, split it into two lines.
- **Very short sentences.** Aim for well under 15 words; many good Easy Read sentences are 5-10 words.
- **Write positively and directly.** Prefer "Do this" over "Do not do this" — negative/prohibitive phrasing is harder to process. Where a "do not" is unavoidable, make the word **not** visually distinct (bold) and keep the sentence otherwise as short as possible.
- **No metaphor, idiom, or figurative language.** Nothing like "keep an eye on", "under the weather", "reach out" — these are frequently taken literally and cause confusion. Say exactly what you mean.
- **No abbreviations, acronyms, or initialisms** unless spelled out in full every time, or explained in the hard-words box. Never assume the reader already knows what "GP", "NHS", or an internal product acronym means.
- **Avoid numbers where possible; if unavoidable, use figures, not words** ("3", not "three"), and avoid percentages, ratios, or statistics that require calculation.
- **Avoid punctuation that adds cognitive load:** no semicolons, colons mid-sentence, brackets, or long dashes splitting a thought. Full stops and simple commas only.
- **Use the person's own name or "you" — never a case number or depersonalised reference.**
- **Never use sarcasm, rhetorical questions, or humour that relies on inference.**

## Layout rules

- **One image per idea**, placed directly beside (not below, not in a separate gallery) the line or short paragraph it illustrates. Images are load-bearing content, not decoration — do not treat them as optional flourishes the way decorative icons are treated elsewhere in this design system.
- **Images must be literal, concrete, and consistent.** The same symbol must always mean the same thing throughout the document and, ideally, across the product. Avoid abstract or metaphorical imagery (no icons standing in for a feeling or concept).
- **Left-aligned text, never fully justified** — justified text creates uneven word spacing that is much harder to track for this audience.
- **Large, clear sans-serif type, minimum ~14pt equivalent (do not go below this platform's existing 1rem/16px body-text floor).** This product already defaults to Atkinson Hyperlegible Next/Lexend for exactly this kind of legibility need — reuse those tokens rather than introducing a separate font for Easy Read content.
- **Generous line spacing and generous space between chunks** — at least as roomy as this design system's `.typeset-guide` prose preset (see `DESIGN.md`'s Long-Form Content Rhythm section); Easy Read content should never use the tighter `.typeset-chat` rhythm.
- **No dense walls of text.** If a body section runs longer than 3-4 short lines without a break, split it with another image and a sub-heading rather than letting it run on.
- **Page/section breaks are meaningful.** Do not split a single idea across a page or scroll boundary — keep an idea and its image together as one unit.

## Process

1. Identify the core ideas in the source content — usually far fewer than the source implies. Cut anything that is not essential for the reader to understand or act on.
2. Rewrite each idea as its own short, positive, literal sentence.
3. Assign one concrete image concept per idea (describe the image needed if you cannot generate/source it yourself — do not leave an idea without a paired image placeholder).
4. Assemble using the document structure above, ending with a clear contact/next-step section.
5. **Where possible, this should be checked by or co-produced with people with lived experience of learning disabilities** — flag in your output that computer-generated Easy Read content is a starting draft and real-world Easy Read guidance strongly recommends user testing with the target audience before publishing.
