# Entrance Hero scale — 2026-10-08

Cases is the baseline. Home now uses PageHeader rather than its larger standalone Hero. AI, DX and Cases already used PageHeader; their rendered output is unchanged.

Shared `.page-heading.entrance-hero` tokens control title size, title margin, top padding, bottom margin and summary width. Optional default-slot actions stay after the summary. Detail page headers do not opt into this policy.

| Value | Desktop 1920 | Mobile 375 / 430 |
| --- | --- | --- |
| h1 | 43.2px | 28px |
| icon | 48px | 40px |
| title column gap | 16px | 11.2px |
| top padding | 0px | 12px |
| title block margin | 4px | 4px |
| bottom margin | 20.8px | 20.8px |
| summary font | 19.2px | 16.8px |

Summary maximum width is 74rem, close to Cases' 1175.2px available reading column at 1920. Home keeps its full-width page container and its other sections untouched.

The total Hero height follows its actual content. Home retains its About link and DX retains its subtitle/longer description, so neither is forced into a fixed height. At 1920, Home is 168.2px; AI/Cases 118.2px; DX 175px. Icon/title start positions are equal across all four routes. Summary starts match except DX's retained subtitle.

Verification: check passes, 45 tests pass, build passes including link/SEO/analytics/TOC audits. Before/after screenshots cover 4 routes × 3 sizes × 2 themes (24 per phase). All 18 AI/DX/Cases screenshots byte-identical. Home visually checked desktop/mobile; no horizontal overflow, preserved colors and content, Career introduction still visible at 1920. No physical mobile-device test performed.
