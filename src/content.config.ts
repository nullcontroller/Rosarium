import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
const section = z.enum([
  "foundations",
  "architecture",
  "knowledge-context",
  "evaluation-hitl",
  "software-engineering",
  "practices",
  "cases",
  "essays",
]);
const pages = defineCollection({
  loader: glob({
    pattern: ["**/*.md", "!career/**/*.md"],
    base: "./src/content",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z
    .object({
      public: z.boolean().default(true),
      title: z.string().min(1),
      summary: z.string().trim().min(1),
      layer: z.enum([
        "ai-design",
        "ai-mathematics",
        "practice",
        "case",
        "publication",
        "reference",
      ]),
      design_topic: z
        .enum([
          "applicability",
          "responsibility-control",
          "architecture",
          "knowledge-context",
          "evaluation-hitl",
          "software-engineering",
          "lifecycle-operations",
        ])
        .optional(),
      publication_format: z
        .enum(["article", "book", "series", "essay"])
        .optional(),
      kind: z.enum(["principle", "architecture", "guide", "case", "essay"]),
      section,
      status: z.enum(["draft", "published", "stable", "archived"]),
      last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      order: z.number().int().nonnegative().optional(),
      tags: z.array(z.string()).default([]),
      entry_points: z.array(z.enum(["ai", "dx"])).min(1).default(["ai"]),
      dx_topic: z
        .enum([
          "value-business",
          "business-transformation",
          "system-planning",
          "organization-adoption",
          "case-study",
        ])
        .optional(),
      dx_topics: z
        .array(
          z.enum([
            "value-design",
            "business-transformation",
            "selection-retirement",
            "system-transformation",
            "continuous-value",
          ]),
        )
        .min(1)
        .optional(),
      published_at: z.string().nullable().optional(),
      updated_at: z.string().nullable().optional(),
      update_type: z
        .enum(["new", "updated", "expanded", "revised", "connected", "reframed"])
        .optional(),
      update_note: z.string().trim().min(1).optional(),
      publication_status: z.enum(["ongoing", "published"]).optional(),
      canonical: z.url().optional(),
      series: z
        .string()
        .regex(/^[a-z0-9-]+$/)
        .optional(),
      series_title: z.string().optional(),
      cover: z.string().optional(),
      show_cover: z.boolean().default(true),
      cover_alt: z.string().trim().min(1).optional(),
      source: z
        .object({
          type: z.enum(["zenn", "wiki", "repository"]),
          url: z.url(),
          slug: z.string().optional(),
          original_type: z.string().optional(),
          book_slug: z.string().nullable().optional(),
          chapter_slug: z.string().nullable().optional(),
          published_at: z.string().nullable().optional(),
          publication_month: z.string().nullable().optional(),
          topics: z.array(z.string()).default([]),
          zenn_type: z.string().nullable().optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.layer === "ai-design" && !data.design_topic)
        ctx.addIssue({
          code: "custom",
          message: "AI Design requires design_topic",
          path: ["design_topic"],
        });
      if (data.layer === "ai-design" && data.source?.type === "zenn")
        ctx.addIssue({
          code: "custom",
          message:
            "Keep Zenn publications in related publications, not the AI Design canonical index",
          path: ["layer"],
        });
      if (
        data.entry_points.includes("dx") &&
        !data.dx_topic &&
        !data.dx_topics?.length
      )
        ctx.addIssue({
          code: "custom",
          message: "DX entry point requires dx_topic or dx_topics",
          path: ["dx_topic"],
        });
      if (
        (data.dx_topic || data.dx_topics?.length) &&
        !data.entry_points.includes("dx")
      )
        ctx.addIssue({
          code: "custom",
          message: "DX topics require the DX entry point",
          path: ["entry_points"],
        });
    }),
});
const career = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/career" }),
  schema: z.object({
    public: z.boolean().default(true),
    title: z.string().min(1),
    seo_title: z.string().min(1).optional(),
    summary: z.string().min(1),
    layer: z.literal("career"),
    status: z.enum(["draft", "published", "stable"]),
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    source: z.object({
      type: z.literal("repository"),
      url: z.url(),
      commit: z.string(),
    }),
  }),
});
export const collections = { pages, career };
