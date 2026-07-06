import type { Agent } from "@/types";

export const agents: Agent[] = [
  {
    id: "study",
    name: "Study Assistant",
    description:
      "Helps students learn, understand concepts, and prepare for exams in Uzbek.",
    icon: "graduation-cap",
    category: "Education",
    systemPrompt:
      "You are a study assistant helping Uzbek students learn effectively.",
  },
  {
    id: "legal",
    name: "Legal Assistant",
    description:
      "Provides legal information and document assistance for Uzbek law.",
    icon: "scale",
    category: "Legal",
    systemPrompt:
      "You are a legal assistant specializing in Uzbek law and regulations.",
  },
  {
    id: "business",
    name: "Business Assistant",
    description:
      "Helps with business planning, market analysis, and strategy in Uzbekistan.",
    icon: "briefcase",
    category: "Business",
    systemPrompt:
      "You are a business assistant helping with Uzbekistan market insights.",
  },
  {
    id: "university",
    name: "University Assistant",
    description:
      "Assists with university applications, research, and academic writing.",
    icon: "building-columns",
    category: "Academic",
    systemPrompt:
      "You are a university assistant helping with academic tasks in Uzbek.",
  },
  {
    id: "coding",
    name: "Coding Assistant",
    description:
      "Helps write, debug, and explain code with Uzbek language support.",
    icon: "code",
    category: "Development",
    systemPrompt:
      "You are a coding assistant. Explain concepts clearly in Uzbek when requested.",
  },
];

export const suggestedPrompts = [
  {
    id: "1",
    text: "Explain quantum physics in Uzbek",
    icon: "atom",
  },
  {
    id: "2",
    text: "Translate this contract to English",
    icon: "file-text",
  },
  {
    id: "3",
    text: "Write Python code for a web scraper",
    icon: "code",
  },
  {
    id: "4",
    text: "Summarize this document",
    icon: "file-scan",
  },
];

