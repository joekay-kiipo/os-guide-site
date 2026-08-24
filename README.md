# Designing Inclusive Digital Solutions

An open-source UI/UX guide for context-aware and gender-responsive digital products,
written from three years of field testing with informal micro-entrepreneurs across six
regions of Ghana.

This is the code implementation of the **Designing Inclusive Digital Solutions** design
canvas (claude.ai/design project *OS Documentation Design Guidelines*).

## Running it

Every page is rendered from the Markdown in `docs/`, fetched over HTTP — so the site
needs to be served, not opened from the filesystem.

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Any static host works for deployment (GitHub Pages, Netlify, S3): there is no build step
and no server-side code.

## Layout

```
index.html          page shell — header, layout containers, theme bootstrap
assets/app.css      design tokens and all component styles
assets/app.js       router, Markdown parser/renderer, search index, UI
docs/*.md           the guide content (source of truth)
docs/assets/        figures and field photographs
```

`docs/` is copied from the MkDocs site (`OS Guide Site`) and keeps the same file names,
so content edits stay portable between the two.

## How it works

- **No dependencies, no build.** Plain ES5-era JavaScript and a ~30-line DOM helper.
  Google Fonts (Outfit for titles, DM Sans for body/UI, Geist Mono for the small
  technical labels) and Phosphor Icons load from CDN.
- **Markdown at runtime.** `parseDoc()` handles the subset the guide uses: headings with
  optional `{: #anchor }` ids, paragraphs, lists, tables, blockquotes, figures, and
  MkDocs-style `!!! tip` / `!!! quote` / `!!! warning` admonitions, which map to the three
  tinted box colours in the legend.
- **Cross-references are live.** Prose like "Section 4" or "Sections 6.5 and 6.6" is
  turned into working links, including sub-section numbers that scroll to the right
  heading.
- **Search** (⌘K / Ctrl-K) indexes every heading and paragraph of every Markdown file on
  load, plus the overview's own sections. Arrow keys navigate, Enter opens.
- **Theme** defaults to dark and persists to `localStorage` under `ids-docs-theme`.

## Where this departs from the design canvas

The canvas is a static mockup, so a few things had to be decided in code. All of them are
additive — nothing in the design was dropped.

| | Design canvas | Here |
|---|---|---|
| Routing | in-memory `pageId` | hash routes (`#/s4`, `#/s4/4-2`) so pages are linkable and the back button works |
| Figures | `<image-slot>` placeholders | the real figures from `docs/assets/`, at their natural aspect ratio rather than a fixed 300px box |
| Home hero | heading + a separate rounded photo card + a stats grid | one full-bleed photo hero: `field-shop-couple.jpg` behind a dark gradient, with the kicker, heading, lede, actions and stat strip overlaid on it |
| Home layout | left sidebar beside every page, including home | on **home only**, the hero spans the full page width and the nav menu drops to a left column beneath it; inner pages keep the sidebar beside the content. Driven by a `.is-home` body class; the same nav markup renders in both places (`buildNavGroups`) |
| CTA photo | empty image slot | `field-market-phone.jpg`, as used on the existing site |
| Primary hero button | near-black `--inv`, indigo on hover | green (`--heroGreen`, `#3d9c53`) to match the reference; swap to `var(--accent)` for the indigo brand colour |
| Checklist drawer | drawer only | drawer plus the scrim the design defined but never rendered |
| "Imprint and licence" button | no action | opens the Imprint page |
| GitHub / Contribute | `href="#"` | repository link and Section 9 |
| Page rail | h2 headings only | h2s plus indented h3s — Sections 4 and 6 keep most of their structure at h3, which left a two-item rail on a very long page |
| Breakpoints | desktop only | sidebar collapses to an off-canvas drawer under 1100px; the "On this page" rail hides under 1280px |
| Failed fetch | silent | an inline notice explaining the page needs to be served over HTTP |

The "On this page" rail is hidden on the overview, as the design specifies. Pages with
no `##`/`###` headings (Disclaimer, Acknowledgements) hide it too.

## Licence

© 2026 GIZ GmbH and GFA Consulting Group GmbH. Licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Photographs, logos and
third-party figures excluded.
