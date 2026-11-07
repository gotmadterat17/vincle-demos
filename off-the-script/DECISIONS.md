# Off The Script — decision ledger

Compact copy of the 2026-11-07 cumulative ledger, plus this iteration. Evidence grades: U exact supplied words, D historical local docs, S implementation, I screenshot. This file is not proof that every historical Qamaria detail was owner-approved. Original 2026-11-06 utterances were not recovered.

## Locks kept

- Hero A stays: faceted glass HUD, magenta left, blue center, teal lower, existing camera and nebula. Off Script WebGL is not banned by the older Qamaria WebGL reversal (D).
- Hero wordmark is `logo-hero-ondark.png` (`#F3F5FA` letters, transparent). Header mark stays `logo-mark-float.png`. Original logo files stay.
- Collaboration button stays `--collab: #6B2F8C`, hover `#552570`, pressed `#431C5C`. Nav contact and the X button stay blue.
- Arabic primary, English toggle, mobile menu, copy-draft contact. No invented clients, prices, reviews, or results.
- Phone and tablet video stays user-controlled and does not autoplay (v5 mobile rule). Qamaria desktop autoplay is not ported.
- No coffee palette, collage, tape, circles-as-motif, stripe lens, empty pinned voids, or scroll hijacking.

## Reversals that still apply to Qamaria, not as an Off Script ban

- Collage deleted (D). Early Qamaria “WebGL everywhere” reversed (D). Liquid glass superseded by v6 glassmorphism plus video (D). v7 circle branch rejected (D). v6 smooth is the safest motion baseline and is not a claim that every v6 detail was approved (D).

## Motion lessons used, not transplanted

- One scroll-progress value per chapter, not a page-long pin (S, story-anime / scrub).
- Reveal once. Do not leave copy at opacity 0 (S).
- One transform owner. Story parallax writes `transform` only on `.story-parallax`. It does not write `transform` on the hero canvas, HUD, or logo (D, DESIGN-REPORT-SMOOTH).
- Parallax amplitude is at most 8px on desktop and 0 on phones, in the same range as the repaired ±6px drift (D).
- Overlap between chapters is the existing fog band, not a blank 100vh sticky.
- Existing Ken Burns files are stills in motion, not filmed 3D. They were not re-encoded here. A native `loop` can still snap; that remains a gap.
- Golden-ratio columns (`1.618fr`) and the existing Fibonacci entrance delays are proportional rhythm, not a quality claim.

## Anti-regression matrix

- [x] Ledger read before the edit. Baseline is main `dd271fa` (PR2 + PR3).
- [x] Each chapter has its own copy and media or a distinct list. Heights at 390 Arabic: hero 508, about 565, standard 502, work 1603, offer 848, method 1047, gallery 1730, contact 1270. No horizontal overflow at 360, 390, 430, or 1440.
- [x] Chapters are a proposal: mark → point of view → standard → work → craft → method → plates → invitation. No new client results.
- [x] Hero still uses `logo-hero-ondark.png`. Collaboration button measured `rgb(107, 47, 140)` which is `#6B2F8C`, 48px on phones and 49px at 1440. Nav contact stays blue. Hero geometry was not edited.
- [x] No coffee skin, collage, orb motif, stripe lens, or empty pin in the new CSS.
- [x] 360/390/430 and 1440, Arabic and English: no clipped headings in a range-box check. Phone menu opens. Empty Arabic submit shows the existing validation line. Reduced motion sets `story-static`, hero fallback, and video controls. Ten of ten videos have controls at 390; none do at 1440, which keeps the mobile no-autoplay rule.
- [x] Reduced motion and save-data skip the scroll writer. Mobile video policy unchanged in `main.js`.
- [x] Scroll recordings end with the footer on screen. Desktop last scrollY 7694 of 7694. Mobile last scrollY 7683 of 7683.

## 2026-11-07 tests

Runtime, not a score:

- Chrome at 360, 390, 430, and 1440, Arabic and English. Zero console errors and zero failed responses in that pass.
- Qamaria recordings were sampled, not scored. Desktop file is 62.84s. Frames at the start, middle, and near the end show a landscape hero with a glass card, then farm/prep/cup plates, then a menu, then the contact form with the footer. Mobile file is 56.12s. A frame at 48s shows the contact form and the footer. The coffee green and photographs were not copied. A frame extracted from the last fraction of the mobile file was a bad seek and was not used.
- Off Script recordings, 111 frames each, 13.5s, under 2 MB: `/opt/cursor/artifacts/offscript-desktop-hero-to-footer.mp4` and `/opt/cursor/artifacts/offscript-mobile-hero-to-footer.mp4`. Last frames show the copy-draft form and the footer links.

## Remaining gaps

- Existing Ken Burns files can still snap if the browser loops them. They were not re-encoded.
- The chapter order is a proposal. The unrecovered 2026-11-06 owner quotes are still incomplete.
- v6 smooth is a mechanism reference. This pass does not claim every v6 detail was approved.
- Live Pages still serves `main` until this pull request is merged. It was not merged.

## 2026-11-07 implementation note

Request t703u / t704u (U, via parent): keep Qamaria richness, movement, long meaningful scroll, story, and accumulating craft; apply that to Off The Script. Accepted as structure and motion behavior. Rejected as a skin transplant.

Narrative Scroll Craft skill file was not on disk. The recipe in the parent brief was followed: locks, 8 chapters, alternating media/text/process, native scroll, then browser checks.

Uncertainty kept: historical owner quotes are incomplete; v6 recordings are evidence of mechanism only after they are actually watched; this ledger is not exhaustive.
