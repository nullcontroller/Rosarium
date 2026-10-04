import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import directive from "remark-directive";
import math from "remark-math";
import katex from "rehype-katex";
import {
  semanticDirectives,
  localUrls,
} from "./src/lib/markdown.mjs";
export default defineConfig({
  site: "https://nullcontroller.github.io",
  base: "/Rosarium",
  trailingSlash: "always",
  markdown: {
    processor: unified({
      remarkPlugins: [directive, semanticDirectives, math],
      rehypePlugins: [localUrls, katex],
      syntaxHighlight: "shiki",
      shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
    }),
  },
});
