import type { ComponentType, SVGProps } from "react";
import {
  NotepadTextIcon,
  PencilSparklesIcon,
  WandSparklesIcon,
  SparklesIcon,
  SpellCheckIcon,
  LanguagesIcon,
  ChartBarIcon,
  FileChartColumnIcon,
  FileSearchIcon,
  TrendingUpIcon,
  FileDiffIcon,
  ChartLineIcon,
  TagsIcon,
  RouteIcon,
  MessageSquareReplyIcon,
  RepeatIcon,
  LayersIcon,
  UserRoundCheckIcon,
  MessageCircleQuestionMarkIcon,
  MessageSquareTextIcon,
  LmSearchIcon,
  SearchIcon,
  FileCheckIcon,
  LmFilesIcon
} from "../icons/generated";

/**
 * AI Button capability catalog.
 *
 * Category names and action `description`s are sourced verbatim from the
 * Figma "AI Communication Component Library" Capability Catalog section
 * (Lumen-AI-Design-System, node 860:9109 — confirmed via `get_design_context`:
 * "Content & Drafting", "Data Analysis & Insights", "Workflow & Automation",
 * "Search & Knowledge", 6 actions each). `label` is a short form of that same
 * Figma sentence, matched to `AIButton`'s existing short-label convention
 * (e.g. the Capability Catalog story's own "Rewrite"/"Translate" usage).
 *
 * `icon` is NOT Figma-sourced — the Capability Catalog frame itself uses the
 * default `lm-aisymbol` glyph on every instance, with no per-action icon
 * override specified anywhere in that section. These icon assignments are an
 * editorial choice for usability (matching the existing `CustomIcon` story's
 * precedent of swapping in a wand icon for "Rewrite" and a languages icon for
 * "Translate"), not a literal Figma citation — flagged here the same way
 * `AIButton`'s `destructive` prop is flagged as "no distinct color specified,
 * behavioral only."
 *
 * `analyticsEvent` is a documented naming convention only — Lumen has no
 * analytics SDK or action/routing system. It is surfaced on the rendered
 * button via `data-ai-analytics-event` (see `AIButton.tsx`) for a consuming
 * application to read and wire up its own tracking; nothing in this package
 * emits telemetry.
 */
export interface AICapability {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  analyticsEvent: string;
}

export const aiCapabilities: readonly AICapability[] = [
  // Content & Drafting
  {
    id: "summarize",
    label: "Summarize",
    description: "Summarize long content into key points",
    category: "Content & Drafting",
    icon: NotepadTextIcon,
    analyticsEvent: "ai_button.summarize"
  },
  {
    id: "draft",
    label: "Draft",
    description: "Generate new content",
    category: "Content & Drafting",
    icon: PencilSparklesIcon,
    analyticsEvent: "ai_button.draft"
  },
  {
    id: "rewrite",
    label: "Rewrite",
    description: "Rewrite existing content",
    category: "Content & Drafting",
    icon: WandSparklesIcon,
    analyticsEvent: "ai_button.rewrite"
  },
  {
    id: "improve-clarity",
    label: "Improve Clarity",
    description: "Improve clarity and tone",
    category: "Content & Drafting",
    icon: SparklesIcon,
    analyticsEvent: "ai_button.improve_clarity"
  },
  {
    id: "fix-grammar",
    label: "Fix Grammar",
    description: "Correct grammar and spelling",
    category: "Content & Drafting",
    icon: SpellCheckIcon,
    analyticsEvent: "ai_button.fix_grammar"
  },
  {
    id: "translate",
    label: "Translate",
    description: "Translate content",
    category: "Content & Drafting",
    icon: LanguagesIcon,
    analyticsEvent: "ai_button.translate"
  },

  // Data Analysis & Insights
  {
    id: "explain-data",
    label: "Explain Data",
    description: "Explain charts and metrics",
    category: "Data Analysis & Insights",
    icon: ChartBarIcon,
    analyticsEvent: "ai_button.explain_data"
  },
  {
    id: "generate-report",
    label: "Generate Report",
    description: "Create reports and dashboards",
    category: "Data Analysis & Insights",
    icon: FileChartColumnIcon,
    analyticsEvent: "ai_button.generate_report"
  },
  {
    id: "extract-info",
    label: "Extract Info",
    description: "Extract structured information",
    category: "Data Analysis & Insights",
    icon: FileSearchIcon,
    analyticsEvent: "ai_button.extract_info"
  },
  {
    id: "detect-trends",
    label: "Detect Trends",
    description: "Detect trends and anomalies",
    category: "Data Analysis & Insights",
    icon: TrendingUpIcon,
    analyticsEvent: "ai_button.detect_trends"
  },
  {
    id: "compare-data",
    label: "Compare Data",
    description: "Compare datasets or documents",
    category: "Data Analysis & Insights",
    icon: FileDiffIcon,
    analyticsEvent: "ai_button.compare_data"
  },
  {
    id: "predict-outcomes",
    label: "Predict Outcomes",
    description: "Predict future outcomes",
    category: "Data Analysis & Insights",
    icon: ChartLineIcon,
    analyticsEvent: "ai_button.predict_outcomes"
  },

  // Workflow & Automation
  {
    id: "categorize-work",
    label: "Categorize Work",
    description: "Categorize incoming work",
    category: "Workflow & Automation",
    icon: TagsIcon,
    analyticsEvent: "ai_button.categorize_work"
  },
  {
    id: "recommend-action",
    label: "Recommend Action",
    description: "Recommend the next action",
    category: "Workflow & Automation",
    icon: RouteIcon,
    analyticsEvent: "ai_button.recommend_action"
  },
  {
    id: "draft-reply",
    label: "Draft Reply",
    description: "Draft contextual replies",
    category: "Workflow & Automation",
    icon: MessageSquareReplyIcon,
    analyticsEvent: "ai_button.draft_reply"
  },
  {
    id: "automate-tasks",
    label: "Automate Tasks",
    description: "Automate repetitive tasks",
    category: "Workflow & Automation",
    icon: RepeatIcon,
    analyticsEvent: "ai_button.automate_tasks"
  },
  {
    id: "categorize-records",
    label: "Categorize Records",
    description: "Categorize records",
    category: "Workflow & Automation",
    icon: LayersIcon,
    analyticsEvent: "ai_button.categorize_records"
  },
  {
    id: "recommend-assignee",
    label: "Recommend Assignee",
    description: "Recommend assignee",
    category: "Workflow & Automation",
    icon: UserRoundCheckIcon,
    analyticsEvent: "ai_button.recommend_assignee"
  },

  // Search & Knowledge
  {
    id: "conversational-search",
    label: "Conversational Search",
    description: "Enterprise conversational search",
    category: "Search & Knowledge",
    icon: MessageCircleQuestionMarkIcon,
    analyticsEvent: "ai_button.conversational_search"
  },
  {
    id: "explain-content",
    label: "Explain Content",
    description: "Explain selected content",
    category: "Search & Knowledge",
    icon: MessageSquareTextIcon,
    analyticsEvent: "ai_button.explain_content"
  },
  {
    id: "search-knowledge",
    label: "Search Knowledge",
    description: "Search enterprise knowledge",
    category: "Search & Knowledge",
    icon: LmSearchIcon,
    analyticsEvent: "ai_button.search_knowledge"
  },
  {
    id: "semantic-search",
    label: "Semantic Search",
    description: "Semantic search",
    category: "Search & Knowledge",
    icon: SearchIcon,
    analyticsEvent: "ai_button.semantic_search"
  },
  {
    id: "show-references",
    label: "Show References",
    description: "Show supporting references",
    category: "Search & Knowledge",
    icon: FileCheckIcon,
    analyticsEvent: "ai_button.show_references"
  },
  {
    id: "recommend-documents",
    label: "Recommend Documents",
    description: "Recommend related documents",
    category: "Search & Knowledge",
    icon: LmFilesIcon,
    analyticsEvent: "ai_button.recommend_documents"
  }
] as const;

export type AICapabilityId = (typeof aiCapabilities)[number]["id"];

export function getAICapability(id: string): AICapability | undefined {
  return aiCapabilities.find((capability) => capability.id === id);
}
