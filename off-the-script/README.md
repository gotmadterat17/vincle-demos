# Off The Script — full mobile static site

Isolated demo inside the existing public repository `gotmadterat17/vincle-demos`. Root index, sitemap, robots, `.nojekyll`, and every other project folder are untouched. Repository visibility is unchanged.

## Direct URL
After this change is merged into `main`, GitHub Pages (already configured: legacy build, branch `main`, path `/`) serves the full site at:

https://gotmadterat17.github.io/vincle-demos/off-the-script/

A pull request does not publish that URL. Pages does not build feature branches. Query `?variant=nebula` is the default atmosphere; `?variant=nonebula` turns the nebula off. The A/B chip appears only with `?compare=1`.

## Local check
From the repository root:

`python3 -m http.server 8767 --bind 127.0.0.1`

http://127.0.0.1:8767/off-the-script/?variant=nebula

## Scope
All existing sections: A faceted hero/HUD, about, work, services, method, gallery, contact and footer. No fabricated case studies, metrics, reviews or client logos added. Original desktop A layout/geometry/material colors are inherited from v4; desktop CSS remains unchanged except loading mobile.css (rules scoped <=960px).
Phones use a compact live faceted stage above readable copy and two actions, then consistent single-column sections. Tablet grids use two columns. Short landscape keeps compact art beside copy. Safe-area padding, 44px controls, 16px form fields, reserved media ratios and min-width:0 grids.

## Motion/performance
Original restrained loop + gentle scroll remain. Phone/tablet WebGL DPR capped at 1, no bloom pass. Reduced-motion and save-data use original mark fallback. Ambient canvas bounded; videos on mobile/reduced-motion/save-data expose native controls and do not autoplay. Media offscreen pauses. No scroll hijack or remote video dependency. A 3D library/fonts still load from CDN; offline-only operation requires separately licensed vendoring (not done).

## Functionality
Navigation anchors, language toggle, mobile disclosure nav (Escape restores toggle focus, outside click/focus closes), optional A/B comparison, existing external X profile link. No work filters existed, so no invented controls added.
Contact form VALIDATES and COPIES a draft only. No backend, email sending, CRM or analytics. Manual editable selection fallback if clipboard blocked. No request/submission leaves the browser. Existing verified contact path: https://x.com/OFFTHESCRIPT_. No address/telephone invented.

## Logo
Corrected transparent PNGs are copied byte-identically from v4. No white background or inverted wordmark reintroduced. Dark supplied wordmark remains dark and can have low contrast over dark stage; mobile headline/nav text carries readable brand name. Further contrast changes require visual/owner approval, not new white lettering.

## Hosting
Paths are relative to index.html (root or /subpath/). No router/build tooling required. Preserve assets/ and media/ hierarchy. Query-string A/B works at both paths. Third parties: see LICENSES.md. Archive excludes backup directories, old screenshots, caches, node_modules, source JPEG master and development artifacts.

## Verification limits
Only syntax/static checks performed here. NO mobile/desktop browser render, touchscreen test, actual contrast measurement, Lighthouse or score claim. Parent must review 360/390/430 widths, tablet and landscape, both languages, reduced motion, navigation focus, copy fallback and original A desktop regression. See QA-CHECKLIST.md.

## Targeted follow-up
Mobile hero is content-height (no viewport min-height tail). Contact placeholders, aria labels, custom validation, statuses and copied-draft labels follow AR/EN; form stays novalidate and local-copy only, avoiding OS-language native validation bubbles. Mocked-DOM flow checks passed; GUI recheck pending.
