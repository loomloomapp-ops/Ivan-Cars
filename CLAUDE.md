# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **static, single-page marketing website** for a car wash / auto-detailing business ("Ivan Cars"), built from a Webflow Ecommerce template named **Woshico**. There is no build step, no framework, no package manager, and no git repository — the published Webflow site was downloaded with the **SaveWeb2ZIP Website Copier** tool and lives under `assets/SaveWeb2ZIP Website Copier/`.

## Running / previewing

There is nothing to build or compile. To preview, serve the export directory over HTTP (opening `index.html` via `file://` can break relative asset paths and font loading):

```bash
cd "assets/SaveWeb2ZIP Website Copier"
python3 -m http.server 8000
# then open http://localhost:8000
```

## Layout

```
assets/SaveWeb2ZIP Website Copier/
  index.html        # The entire site (~126 KB, all page content + inline Webflow init CSS)
  css/woshico.webflow.shared.d43702c1f.css   # Single compiled Webflow stylesheet (~247 KB)
  js/               # jQuery 3.5.1 + Webflow runtime chunks + WebFont loader
  images/           # All photos, SVG icons, logos
  fonts/            # FontAwesome woff2/ttf (Cal Sans + Poppins load from Google Fonts via webfont.js)
```

## Architecture notes — this is Webflow output, not hand-written code

Treat the files as **generated artifacts**. Edits must respect Webflow conventions or animations and layout will break:

- **Hashed class names are meaningful.** Styling is driven entirely by `css/woshico.webflow.shared.d43702c1f.css`. Classes prefixed `w-` (`w-container`, `w-nav`, `w-dropdown`, `w-tab`, `w-inline-block`) are Webflow framework classes — do not rename them. Custom design classes (`header-two`, `home2-about1-section`, `pricing-table-section`) carry the actual styling.
- **`data-w-id` drives all motion.** There are ~259 `data-w-id` attributes. The large inline `<style>` block in `<head>` sets the *initial* (pre-animation) state for these IDs (opacity/transform), and the Webflow JS chunks (`js/webflow.schunk.*.js`) apply the scroll/load interactions at runtime. If you move or duplicate an animated element, its `data-w-id` and the matching inline-CSS rule must travel together, or the element will be stuck invisible (`opacity:0`) or mis-transformed.
- **Page sections** (in document order): hero/header (`header-two`), about blocks (`home2-about1-section`, `home2-about2-section`), brand marquee (`marquee-one-section`), process steps (`process-section`), vertical-scroll portfolio (`portfolio-vertical-scroll-top`), pricing table (`pricing-table-section`), and a closing CTA/about (`home-one-about2-section`).
- **Asset references are relative** (`images/...`, `css/...`, `js/...`) after the SaveWeb2ZIP rewrite. Some `og:image` / schema URLs still point at the original `cdn.prod.website-files.com` Webflow CDN — update these to local/real paths when rebranding.
- **Template still contains placeholder identity.** Title, meta description, JSON-LD `LocalBusiness` schema, addresses, phone (`+1-234-567-89`), and email (`contact@example.com`) are all "Woshico" demo content. These need to be replaced with the real "Ivan Cars" business details, not just the visible text.

## Design skills in `.claude/rules/`

`.claude/rules/` contains a library of design-direction `SKILL.md` files (taste, redesign, brutalist, minimalist, brandkit, image-to-code, imagegen, etc.) that are loaded as project instructions. They are **design playbooks**, not part of the website. The most relevant one for working on this codebase is **`redesign-skill`** (auditing and upgrading an existing site working within its current stack — here, plain HTML/CSS + Webflow). All skills share hard bans worth remembering when generating any new markup: no emojis, no `Inter` font, no pure `#000000`, no AI copywriting clichés ("Elevate", "Seamless", "Unleash"), no generic placeholder names.
