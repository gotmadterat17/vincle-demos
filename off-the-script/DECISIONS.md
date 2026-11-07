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

## 2026-11-07 second craft pass

The first lower page was still mostly the same small rise plus an 8px picture shift. That was not enough for the asked movement. Replaced the type-only standard list with four picture scenes — idea, script, frame, edit — using the nebula, mic, interview, and edit clips already on the site. The lines are the site’s existing sentences, labeled as a way of looking, not as client results. On a wide screen each next picture sticks and fades over the one before it. The four scenes do not share one effect: push-in, side wipe, drift inside the frame, and a top open. The three work rows use push, wipe, and drift. The old 8px page parallax writer was removed so nothing else sets `transform` on those pictures. Fog bands are 28px and 16px. Section padding is the smaller step, not an empty viewport.

Loop seams, mean absolute sample on a 160×90 difference, before → after forward/reverse rewrap of the same frames:

| File | Frames | First vs last before | First vs last after | Turn frames after |
|---|---|---|---|---|
| card-mic.mp4 | 150 → 300 | 11.25 | 0.62 | 0.13 |
| card-city.mp4 | 150 → 300 | 21.61 | 2.27 | 0.20 |
| hero-nebula.mp4 | 200 → 400 | 18.25 | 0.82 | 0.01 |

The six mp4s together are about 5.9 MB. No new pictures.

Slow tours, 478 frames at 8 fps, 59.75s each. Desktop file 2.4 MB. Mobile file 1.1 MB. Both start on the hero and end at max scroll with the footer in view. Desktop end scroll 9288/9288, footer top 727 in a 900px viewport. Mobile end scroll 8921/8921, footer top 649 in an 844px viewport. A desktop frame during the sequence shows the nebula plate with the microphone plate fading in over it. Phone load: 14 of 14 videos expose controls. Desktop load: 0 of 14 expose controls, so wide screens can play in view and phones cannot autoplay. The hero canvas was hidden only after it had left the viewport, so later frames could be captured; the opening frame is the real faceted hero.

## 2026-11-07 t707 — video pass rejected

Owner wording, relayed as exact: “الصيغة نفسها خلها صور متتابعة مو مقاطع حرفيا واخير استفيد من كل نواقع الاسيتس و anime.js”. Also relayed: the plates being videos does not make sense. This supersedes the forward/reverse video pass. Same format stays. Literal clips are not the story. Realtime 3D is not required. The hero WebGL stays.

Inventory read. Nothing downloaded. Not used: 3dicons Bulb (CC0 item, not a sequence), Megaphone (license pending), Lummi (license unverified), Oversight Cyanotype (account-gated), SceneAI (premium reference). No cinematic sequence pack was verified, so none was invented.

Used: `media/stills/` and `media/posters/` already in the site (owner/build). Anime.js package tag 3.2.2 from jsDelivr, MIT, Julian Garnier. The file’s own `anime.version` string is `3.2.1`. It crossfades the ordered stills and rewrites the live label when the scroll step changes, and it reveals phone stills on entry. Six stills: nebula, mic, interview, edit, city, banner. Wide screens set the large `src` only when that frame is reached. Phones use the smaller posters and do not show the sticky stage. No `<video>` remains in the page. The enlarged boomerang files were restored to the previous clips and are not the story.

Runtime check, not a score: at 1440 the scroll step changed the visible still from nebula.jpg to mic.jpg, interview.jpg, edit.jpg, city.jpg, then banner.jpg alone at the bottom, with labels 01 through 06. `anime.version` read `3.2.1` from the 3.2.2 file. Zero video elements. Zero failed responses in that pass. Overflow 0 at 360, 390, and 430. Reduced motion set `story-static`, hid the sticky stage, and showed the phone posters. Collaboration button stayed `rgb(107, 47, 140)`. Hero logo stayed `logo-hero-ondark.png`.

Tours: 562 frames at 8 fps, 70.3s. Desktop ended at scroll 7981/7981 with the footer top at 727 in a 900px viewport. Mobile ended at 7736/7736 with the footer top at 649 in an 844px viewport. Both recordings contain zero video elements. Opening frame is the faceted hero.

## Remaining gaps

- card-city.mp4 still shows a small first/last difference (2.27), much smaller than 21.61, not zero.
- The chapter order is a proposal. The unrecovered 2026-11-06 owner quotes are still incomplete.
- v6 smooth is a mechanism reference. This pass does not claim every v6 detail was approved.
- Live Pages still serves `main` until this pull request is merged. It was not merged.

## 2026-11-07 implementation note

Request t703u / t704u (U, via parent): keep Qamaria richness, movement, long meaningful scroll, story, and accumulating craft; apply that to Off The Script. Accepted as structure and motion behavior. Rejected as a skin transplant.

Narrative Scroll Craft skill file was not on disk. The recipe in the parent brief was followed: locks, 8 chapters, alternating media/text/process, native scroll, then browser checks.

Uncertainty kept: historical owner quotes are incomplete; v6 recordings are evidence of mechanism only after they are actually watched; this ledger is not exhaustive.
