# Light Theme audit — 2026-10-08

## Scope
Light palette only. No content, layout, typography, navigation structure or Dark palette changes.

| Token | Before | After |
| --- | --- | --- |
| bg | #f4f5f0 | #e9eee7 |
| surface | #ffffff | #f5f7f1 |
| muted | #596c70 | #4a6057 |
| line | #d4ddda | #9eafa4 |
| accent | #17675a | #145b4f |
| soft | #e8f0ec | #d8e6dc |
| aux-surface | #edf4f5 | #dce8e3 |

Light role tokens: elevated-surface #e6eee4, nav-surface #e0e9df, nav-hover-surface #d5e3d7, nav-current-surface #c3d8c9, career-surface #e9efe5. Root aliases retain previous Dark values. Both OS preference and saved theme preference are supported.

Garden Notes and content history reuse elevated-surface. Home entry separators are background strokes, adding no layout size. Scroll fade uses 18% accent in Light and the previous 16% muted in Dark.

## Verification
- check passed; 45 tests passed; build passed, including SEO/analytics/updated-date/TOC audits.
- 12 representative routes × 4 viewports × 2 themes = 96 screenshot checks.
- Viewports: 1920×1080, 1440×900, 375×812, 430×932.
- Selected element geometry and font size exactly unchanged in all comparisons.
- All 48 Dark screenshots byte-identical to baseline; computed colors and tokens unchanged.
- Rendered representative text/link/button/badge/breadcrumb samples meet 4.5:1; minimum 4.51:1 (baseline 4.76:1). These are sampled rendered pages, not an exhaustive claim about every interaction on every route.
- Six OS/saved-theme combinations checked; hover differs from current state in Light; focus outline and keyboard scrolling work.
- No horizontal overflow at all checked viewports. Home Career remains visible at 1920×1080.
- Screenshots visually checked for Home desktop/mobile and article history. No real-device Safari/Android test performed.
