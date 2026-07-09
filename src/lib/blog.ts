export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  content: BlogBlock[];
}

export const posts: BlogPost[] = [
  {
    slug: "introducing-tomaris",
    title: "Introducing Tomaris: The First Uzbek-Native AI",
    excerpt:
      "Today we're announcing Tomaris — a 27-billion-parameter language model aligned from the ground up for Uzbek, live at tomaris.ai.",
    date: "July 1, 2026",
    category: "Announcement",
    readTime: "5",
    content: [
      {
        type: "p",
        text: "Thirty-six million people speak Uzbek. Until today, none of them had an AI model built for their language. Global models treat Uzbek as an afterthought: they hallucinate its grammar, miss its cultural context, and switch to Russian or English mid-sentence when they run out of confidence. We built Tomaris to end that.",
      },
      {
        type: "p",
        text: "Tomaris is a 27-billion-parameter language model aligned specifically for Uzbek, and it is live right now at tomaris.ai. You can chat with it in Uzbek, Russian, or English, watch its reasoning unfold token by token, and see for yourself what a model sounds like when Uzbek is its first language rather than its five-hundredth.",
      },
      { type: "h2", text: "What makes it different" },
      {
        type: "p",
        text: "The base capabilities of large models are increasingly commoditized — anyone with GPUs can pre-train. What cannot be commoditized is alignment: the tens of thousands of human-written examples that teach a model to answer, reason, refuse, and sound native. That is where we invested.",
      },
      {
        type: "ul",
        items: [
          "75,000+ lines of human-written Uzbek supervised fine-tuning data — written by native speakers, covering reasoning, coding, translation, safety, and cultural knowledge.",
          "A 227-million-word curated Uzbek text corpus behind the model's language foundation.",
          "A 300-prompt Uzbek evaluation benchmark — including 105 Olympiad-grade math and logic problems — that every Tomaris release must clear.",
          "Visible reasoning: Tomaris thinks before it answers, and the platform shows you that thinking.",
        ],
      },
      { type: "h2", text: "Why it matters" },
      {
        type: "p",
        text: "This is about more than a chatbot. Banks, universities, and government agencies in Uzbekistan currently send sensitive data to foreign APIs because there is no local alternative. Tomaris runs on infrastructure we control — queries can be processed without a single byte leaving the region. Sovereignty is not a feature we added; it is the reason the company exists.",
      },
      {
        type: "quote",
        text: "English AI is saturated. The next billion AI users speak languages nobody is building for. We are building for them — starting with Uzbek.",
      },
      {
        type: "p",
        text: "Tomaris is free to try today. Open tomaris.ai, ask it something in Uzbek, and tell us what you think — every conversation makes the next version better.",
      },
    ],
  },
  {
    slug: "benchmark-results",
    title: "Why We Built Our Own Uzbek Benchmark",
    excerpt:
      "You cannot improve what you cannot measure — and no public benchmark measures Uzbek. So we built a 300-prompt eval, including 105 Olympiad-grade problems.",
    date: "June 18, 2026",
    category: "Research",
    readTime: "6",
    content: [
      {
        type: "p",
        text: "Every serious model release ships with benchmark scores: MMLU, GSM8K, HumanEval. Look closely and you'll notice what they have in common — they are almost entirely in English. For Uzbek, the public evaluation landscape is close to empty. A handful of machine-translated test sets exist, and machine translation is precisely the thing that breaks on Uzbek, so the tests inherit the errors they are supposed to detect.",
      },
      {
        type: "p",
        text: "When we started training Tomaris, we had no honest way to answer the most basic question: is this version better than the last one? So before scaling up training, we built the measuring stick.",
      },
      { type: "h2", text: "The 300-prompt eval" },
      {
        type: "p",
        text: "Our benchmark is 300 human-written prompts across four tracks, each targeting a failure mode we observed in global models:",
      },
      {
        type: "ul",
        items: [
          "Fluency & linguistics — agglutinative morphology, vowel harmony edge cases, register shifts between formal and spoken Uzbek.",
          "Cultural knowledge — history, literature, customs, and everyday context that never appears in web-crawled English data.",
          "Morphology under pressure — long derivational chains where one wrong suffix changes the meaning of the sentence.",
          "Math & logic — 105 Olympiad-grade problems sourced from Uzbekistan Olympiad archives, written natively in Uzbek.",
        ],
      },
      {
        type: "p",
        text: "The Olympiad track deserves explanation. Math problems written natively in Uzbek — with Uzbek phrasing, Uzbek names, Uzbek problem conventions — cannot be solved by pattern-matching against English training data. A model must actually parse the Uzbek and reason. That makes them the hardest and most honest part of the eval.",
      },
      { type: "h2", text: "How we use it" },
      {
        type: "p",
        text: "Every Tomaris checkpoint runs the full 300 prompts before release, and native speakers grade the outputs. We don't publish leaderboard-style victory numbers, because grading long-form Uzbek is partly subjective and we would rather earn trust slowly than lose it fast. What we can say: the benchmark is why Tomaris improves measurably between versions instead of by feel.",
      },
      {
        type: "quote",
        text: "A benchmark nobody else can pass isn't a moat. A benchmark nobody else even has — that's a moat.",
      },
      {
        type: "p",
        text: "We plan to open parts of the benchmark to the research community once the grading rubric is stable. If you work on low-resource language evaluation, we would genuinely like to talk.",
      },
    ],
  },
  {
    slug: "training-corpus",
    title: "Building a 227-Million-Word Uzbek Corpus",
    excerpt:
      "How we collected, cleaned, and curated 227 million words of high-quality Uzbek text — and why the next 16,000 books matter even more.",
    date: "June 4, 2026",
    category: "Engineering",
    readTime: "8",
    content: [
      {
        type: "p",
        text: "Ask any ML engineer what the hardest part of building a low-resource language model is and they will say the same thing: data. Not model architecture, not compute — data. For Uzbek the problem is acute. The language switched scripts twice in a century (Arabic to Cyrillic to Latin), much of its literature exists only on paper, and the web text that does exist is heavily contaminated with machine translation and spam.",
      },
      { type: "h2", text: "What 227 million words actually means" },
      {
        type: "p",
        text: "Our pre-training corpus is 227 million words of curated Uzbek text. 'Curated' is the operative word — the raw material we processed was several times larger. The pipeline that got us from raw to curated:",
      },
      {
        type: "ul",
        items: [
          "Script normalization — unifying Cyrillic and Latin Uzbek into a consistent representation, including the messy in-between conventions real people use online.",
          "Machine-translation detection — filtering out text that was auto-translated into Uzbek, which teaches a model exactly the broken patterns we're trying to fix.",
          "Deduplication — near-duplicate detection across sources, because news syndication makes Uzbek web text extremely repetitive.",
          "Quality scoring — native speakers labeled samples, and we trained lightweight classifiers to scale their judgment across the whole corpus.",
        ],
      },
      { type: "h2", text: "The next frontier: 16,000 books" },
      {
        type: "p",
        text: "Web text has a ceiling. The deepest, richest Uzbek — literary prose, academic writing, technical vocabulary — lives in books that have never been digitized. We have a pipeline of 16,000 digitized books queued for the next training run. Book text is qualitatively different from web text: longer coherence, richer vocabulary, and the kind of formal register that enterprise and government use cases demand.",
      },
      {
        type: "p",
        text: "On top of the pre-training corpus sits the layer we consider our real asset: 75,000+ lines of human-written supervised fine-tuning data. Pre-training data teaches a model what Uzbek looks like; SFT data teaches it what to do. Every line was written by a native speaker — instructions, reasoning chains, refusals, translations, cultural explanations.",
      },
      {
        type: "quote",
        text: "You can rent GPUs. You cannot rent a decade of Uzbek books or a team of native speakers who know why a sentence sounds wrong.",
      },
      {
        type: "p",
        text: "The corpus grows weekly, and each Tomaris conversation generates signal about where the model is still weak. Data is not a phase of this project that ends — it is the project.",
      },
    ],
  },
  {
    slug: "low-resource-languages",
    title: "Why Low-Resource Languages Need Dedicated AI",
    excerpt:
      "Generic AI models fail at Uzbek in predictable, structural ways. Here's why fine-tuning a dedicated model beats waiting for the giants.",
    date: "May 21, 2026",
    category: "Research",
    readTime: "7",
    content: [
      {
        type: "p",
        text: "There is a comforting assumption in the AI industry: as frontier models grow, every language rises with the tide. Give it a year, the thinking goes, and GPT-class models will speak fluent Uzbek, Yoruba, and Khmer for free. The data says otherwise — and the reason is structural, not temporary.",
      },
      { type: "h2", text: "The long tail is long" },
      {
        type: "p",
        text: "Frontier models are trained on web-scale data, and the web is brutally skewed. English dominates; a handful of European and East Asian languages follow; then the curve collapses. Uzbek — spoken by 36 million people — is a rounding error in a frontier training mix. Models learn what they see, and they barely see Uzbek.",
      },
      {
        type: "p",
        text: "The failures this produces are not cosmetic. Uzbek is agglutinative: meaning is assembled by stacking suffixes, and one wrong suffix flips a sentence from 'he did it' to 'he apparently did not do it.' A model that has seen too little Uzbek doesn't make small mistakes — it makes confident, fluent-sounding errors that only a native speaker catches. For casual chat that's annoying. For a bank, a court, or a hospital, it's disqualifying.",
      },
      { type: "h2", text: "Why dedicated beats general" },
      {
        type: "ul",
        items: [
          "Data density: a model fine-tuned on 75,000 lines of native-written Uzbek instruction data sees more high-quality Uzbek alignment signal than a frontier model sees in its entire training run.",
          "Cultural grounding: dedicated data teaches Navro'z, mahalla, Uzbek legal and administrative conventions — things web-crawled English simply doesn't contain.",
          "Evaluation: we measure Uzbek specifically, with a 300-prompt native benchmark. Frontier labs don't — Uzbek regressions ship silently.",
          "Economics: frontier labs allocate effort by market size. A dedicated team allocates all of it to the language that matters.",
        ],
      },
      {
        type: "p",
        text: "None of this means dedicated models must beat frontier models at everything — they don't have to. They have to be excellent at the language, honest about the culture, and deployable inside the country. That bar is both achievable and, for most institutional use cases, the only bar that matters.",
      },
      {
        type: "quote",
        text: "The question isn't whether the giants will eventually speak Uzbek. It's who owns the data that teaches them — and what gets built locally in the meantime.",
      },
      {
        type: "p",
        text: "We believe every major language community will eventually run this playbook: curate the corpus, write the alignment data, build the eval, serve the model. We're running it first for Uzbek — and documenting the path for everyone behind us.",
      },
    ],
  },
  {
    slug: "agentic-ai",
    title: "Agents That Work in Uzbek",
    excerpt:
      "Task-specific agents — study help, legal drafting, business analysis — built on top of Tomaris, with reasoning you can inspect.",
    date: "May 7, 2026",
    category: "Product",
    readTime: "5",
    content: [
      {
        type: "p",
        text: "A raw chat box is a power tool without a handle. Most people don't want to engineer prompts — they want to prepare for an exam, draft a contract clause, or analyze a spreadsheet. That's why the Tomaris platform ships with agents: preconfigured assistants that wrap the model in a role, a tone, and a task.",
      },
      { type: "h2", text: "What's live today" },
      {
        type: "ul",
        items: [
          "Study assistant — explains concepts step by step in Uzbek, generates practice questions, and adapts to school and university curricula.",
          "Legal drafting helper — works through contracts and official letters in the formal register Uzbek documents require.",
          "Business analyst — summarizes reports, drafts plans, and reasons through numbers with its work shown.",
          "Developer assistant — reads and writes code with explanations in Uzbek, English, or Russian.",
        ],
      },
      {
        type: "p",
        text: "Launching an agent creates a focused conversation on the chat surface — same model, same visible reasoning, different specialization. Because Tomaris shows its thinking before it answers, you can audit how the agent reached a conclusion instead of taking it on faith. For professional use, that transparency is the difference between a toy and a tool.",
      },
      { type: "h2", text: "Where this is going" },
      {
        type: "p",
        text: "Today's agents are conversational specialists. The next step is letting them act: searching documents in your workspace, filling templates, chaining steps toward a goal. The hard part of agentic AI in Uzbek isn't the orchestration — it's a model that understands instructions precisely enough to be trusted with multi-step tasks. That's exactly what our alignment data is for, and every agent conversation teaches us where precision still slips.",
      },
      {
        type: "quote",
        text: "An agent is only as good as the model's grasp of intent — and intent lives in language.",
      },
      {
        type: "p",
        text: "Try the agents at tomaris.ai — pick one, give it a real task from your day, and see how far Uzbek-native AI has come.",
      },
    ],
  },
  {
    slug: "data-sovereignty",
    title: "Data Sovereignty and AI in Central Asia",
    excerpt:
      "Every query sent to a foreign AI API is data leaving the country. Why data residency matters, and how Tomaris keeps intelligence local.",
    date: "April 23, 2026",
    category: "Policy",
    readTime: "6",
    content: [
      {
        type: "p",
        text: "When a bank in Tashkent uses a foreign AI API to summarize a loan document, that document — the client's name, the amounts, the terms — travels to servers in another jurisdiction, under another country's laws, subject to another company's policies. Multiply that by every ministry, hospital, and enterprise adopting AI, and you get a quiet, structural transfer of a nation's most sensitive information abroad.",
      },
      { type: "h2", text: "Three risks, one root cause" },
      {
        type: "ul",
        items: [
          "Data residency: sensitive data processed abroad may violate local regulation today and will almost certainly violate it tomorrow, as data-protection law tightens worldwide.",
          "Access risk: a foreign provider can restrict any region at any time — commercial decision, sanctions compliance, or policy change. No provider blocks Uzbekistan today; nothing guarantees tomorrow.",
          "Strategic dependence: if AI becomes core infrastructure — and it is becoming exactly that — renting it from abroad means renting your economy's operating system.",
        ],
      },
      {
        type: "p",
        text: "The root cause is the same in all three: the intelligence lives somewhere else. Filters, contracts, and compliance paperwork treat the symptoms. The cure is a capable model running on infrastructure inside the region.",
      },
      { type: "h2", text: "What sovereign AI looks like in practice" },
      {
        type: "p",
        text: "Tomaris is built for exactly this deployment story. The model is ours end to end — weights, training data, alignment pipeline — which means it can run wherever the customer's requirements demand: on our infrastructure, in a local data center, or fully on-premises inside a bank's own perimeter. No query has to cross a border to get answered.",
      },
      {
        type: "p",
        text: "Sovereignty also shapes what we don't do. The public Tomaris platform stores conversations in your browser, not on our servers — we couldn't read your chats if we wanted to. For enterprise deployments, logging and retention become explicit contractual choices made by the customer, not defaults imposed by a vendor an ocean away.",
      },
      {
        type: "quote",
        text: "A country that rents its intelligence never owns its future. The AI era's most important infrastructure decision is where the model runs.",
      },
      {
        type: "p",
        text: "Central Asia has a narrow window to make that decision deliberately. We're building Tomaris so that when institutions in Uzbekistan — and eventually the wider Turkic world — choose AI, a sovereign option exists.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
