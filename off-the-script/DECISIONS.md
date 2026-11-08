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

## 2026-11-07 20:48 Asia/Riyadh — run 5 rejected

Owner wording, exact: «غباء اصطناعي وين كل مهاراتك وين جلاسس مورفزم ويعن الخلفيات وين سكرول انميشن وين وين وين !!! علمتك كثير النهاية النتيجة كذا». This is a rejection, not approval. The previous image pass had kept the stills and Anime.js, then reduced the page to six threshold crossfades on a flat ink ground. Phones hid the sticky stage and listed posters. That is what flattened the craft.

This correction stays on the same unmerged branch. Hero geometry, `logo-hero-ondark.png`, and the violet collaboration button were not edited. No `<video>` was added. No new asset was downloaded. 3dicons, Lummi, Oversight, and SceneAI stay unused for the same license and sequence-pack reasons as the t707 note.

What changed:

- Story bands are translucent over the existing nebula atmosphere. Each chapter ground is one owned poster already on the site: mic, nebula, city, edit, interview, banner.
- Copy, offer, method, and contact plates use a frosted fill (`rgba(10,6,16,.58)`), a 16px blur, and a light inset edge. Reduced transparency turns that fill solid.
- `story-scroll.js` no longer waits for a step threshold. On each frame Anime.js sets the opacity and scale of adjacent stills from scroll progress, moves the chapter grounds and work stills, and grows the method thread. A heading handoff runs once when the heading enters. Wide screens load the larger still; phones keep the poster.
- Sequence cards are only as tall as the sentence. The picture stays visible beside them on a wide screen and above them on a phone. Reduced motion and save-data still use `story-static`: no sticky stage, posters in the reading order, no Anime writes.

Three failures seen in the first browser pass of this correction, then changed:

1. Desktop sequence steps were 68vh empty glass slabs, so the chapter looked like a dark void.
2. Glass fills at .74 covered the chapter photographs, so the blur had nothing to show.
3. On a 390px screen the tall glass steps slid over the sticky picture and left a dark smear.

Runtime, not a score. Chrome headless, no console errors in the 1440 and 390 passes.

- Collaboration button measured `rgb(107, 47, 140)`. Hero opening frame is still the faceted magenta / blue / teal HUD with the light wordmark. Hero files were not edited.
- Zero `<video>` elements. `documentElement.dataset.anime` read `3.2.1` from the 3.2.2 file. Class `story-motion`.
- At the middle of the sequence, adjacent frames were both opacity 0.50: desktop `interview.jpg` with `edit.jpg`, phone posters `card-interview.jpg` with `card-edit.jpg`. That is a scroll-progress mix, not a threshold swap.
- Glass plate computed `rgba(10, 6, 16, 0.58)` and `blur(16px) saturate(1.7)`. Chapter ground image opacity 0.72. Band fill `rgba(7, 11, 20, 0.22)`.
- Horizontal overflow 0 at 360, 390, 430, and 1440. English toggle set `lang=en` and `dir=ltr`, hid `.ar-only`, and kept overflow 0.
- Reduced motion set `story-static`, hid the sticky stage (`display: none`), and showed the phone posters (`display: block`). Videos stayed 0.
- Tours are 496 frames at 8 fps, 62.0s each, hero through footer. Desktop ended at scroll 7853/7853 with the footer in a 900px viewport. Mobile ended at 9002/9002 with the footer in an 844px viewport. Files: `offscript-desktop-glass-tour.mp4`, `offscript-mobile-glass-tour.mp4`.

Qamaria v6 desktop recording sampled at 2s, 25s, and 48s (file duration 62.84s): full-bleed farm photograph with one glass card, then three photo plates, then a contact form on a dim photograph. Coffee green and those photographs were not copied. Off Script’s matching behavior is the locked HUD hero, then owned stills as chapter grounds with frosted plates, then the copy-draft form on the banner ground. It is not a claim of equal footage density. Six owned stills are the whole sequence. No new frame pack exists in the saved inventory.

This entry is not publication approval. Live Pages stays on `main` until a person merges.

## 2026-11-07 — independent review of run 6, then this correction

The attached critique judged run 6 not ready. It is not an approval. This pass does not certify the reviewer’s acceptance.

Missing asset, named: there is no licensed frame-by-frame shoot of one job (idea board, script page, camera frame, and edit of the same piece). The six saved stills are different rooms. Crossfading them was not a story. They are no longer the sequence. The nebula poster remains only as the ground. Studio photos beside مخيال / ساويرس / إكسبو are labeled as studio references, not frames from those programs.

What the sequence is now: one illustration of the studio’s own line, «نكتب / ما يبقى / خارج النص», built from `logo-mark-float.png` and IBM Plex. Anime.js moves those same three words. Idea: words apart. Script: one line. Frame: a viewfinder closes on that line. Edit: «خارج النص» stays and the other two words drop back. One caption updates with that progress. At the middle of a step the caption says what is moving. There is no second card and no second photograph.

Scroll length is the change itself. On a phone the picture and its caption sit together and fill the screen. Reduced motion and save-data hide the sticky track and show the four settled states in order.

Measured in Chrome, not a score:

- Zero console errors in the gate pass. Zero `<video>` elements.
- Overflow 0 at 360, 390, 430, and 1440, Arabic and English, including the 0/25/50/75/100 points of each of the three steps, recorded downward and upward.
- No sequence word was outside the stage, and the caption was not under the header, at those points.
- Collaboration button stayed `rgb(107, 47, 140)`. The nav contact button stayed `rgb(16, 136, 208)`. Those blue controls were not restyled.
- Phone menu opened, the «المثال» link closed the menu, and `#gallery` landed at top 156 in an 844px viewport.
- Empty submit set the name field `aria-invalid=true` and the status «يرجى تعبئة الحقول المطلوبة ببريد صالح.» A filled test brief returned «تم نسخ المسودة… لم يُرسل شيء تلقائياً.»
- Field label and input text on `#120c18` measured contrast about 17.9. Placeholder and the copy hint measured about 14.2.
- Reduced motion set `story-static`, hid the track, and showed 4 settled cards.
- English toggle set `lang=en` and `dir=ltr`.

Tours are 496 frames at 8 fps, 62.0 seconds. Desktop ends at scroll 6756/6756 with the footer in a 900px viewport. Mobile ends at 8051/8051 with the footer in an 844px viewport. Both files contain zero video elements. They are browse recordings, not a claim that an independent reviewer has watched them.

Hero files were not edited. This is not publication.

## 2026-11-08 — image sequence, designlang, coverage register

The word-only sequence was rejected: it replaced pictures with type, the stage was sparse, and it ended on the studio line. This pass puts eight original stills of one desk under the locked hero. The objects change: loose slips, one page, a metal frame, a microphone, a timeline, a kept bar with scraps, a finished card, an open envelope. The last two are what a visitor receives and how they start. The studio mark is not the ending.

Anime.js sets opacity and scale. Only one frame is visible. At the middle of a step the next still is already the only picture, so two rooms are not ghosted together. Phones keep the picture and the caption together. Reduced motion shows the eight stills in order.

Coverage register read (`COVERAGE.md`, `IMPLEMENTATION-REFERENCES.md`). It is a text recovery, not a visual tour of those sites. Qamaria source and full-page PNGs are not in this VM. designlang was not run on Qamaria because there is no public URL. designlang 13.4.0 MIT was run on this review build. Details and the slop/verify numbers are in `evidence/designlang-2026-11-08/MEASURED.md`. The violet tell and the radius warnings were not used to change the locked CTA or the spectrum. Sky nav and the X button stay blue.

Browser gate on the eight stills: one visible frame at 0/25/50/75/100 of each step, overflow 0, stage not wider than the viewport, caption not under the header, at 360, 390, 430, 768, and 1440. English toggle set `lang=en`, `dir=ltr`, overflow 0. Reduced motion hid the track and showed 8 images. Zero video elements. Zero console errors in that pass.

Tours are 496 frames at 8 fps, 62.0 seconds. Desktop ends at scroll 7926/7926 with the footer in a 900px viewport. Mobile ends at 9181/9181 with the footer in an 844px viewport. They are browse recordings, not page videos, and not an independent review.

No public review URL was created. Publishing to GitHub Pages would replace the live site, which was not approved. The pull request is the review branch.

No team, testimonials, or client results were added. Stageshow’s React kit was not installed. This is not an independent acceptance and not a publication.

## 2026-11-08 run 9 — the same words have to survive

The independent review of the eight tool-swap stills was not ready. A frame, a microphone, and a blank card replaced one another. The phone crop cut the pencil and left empty sky.

Qamaria v6 full-page screenshots were inspected as pictures: a wide farm hero, three close journey cards, a short menu, a person among plants, a four-image gallery, quote cards, then visit and contact. Those files are references, not a live URL, so designlang was not run on them. The person, the quotes, and the coffee were not copied. There is no real Off Script portrait or testimonial to put in their place.

The sequence is now six stills of one sample. The words نكتب / ما / يبقى / خارج / النص / نطوّعها start on separate slips, meet as three lines, stay inside the frame, stay on the page when the microphone arrives, then the first and third lines are struck and «خارج النص» remains. The last still is that kept line on a card, with the struck draft beside it. Phone files are separate reframes. The sticky stage on a phone is 3:4, matching those files, and the scroll scale that was cropping the edges was removed.

Chrome check after that change: zero console errors, overflow 0, one displayed frame, phone files on 360/390/430 and desk files at 1440, caption below the header, at 0 and 0.5 of each step and at the end. Tours are 62.0 seconds, 496 frames at 8 fps. Desktop ends at scroll 7926/7926. Mobile ends at 8799/8799. Both show the footer. Zero video elements in those passes. This is still an illustration, not a client piece, and not a ready claim.

## 2026-11-08 run 10 — the letters have to face the reader

The run 9 retest found the Arabic painted on the stills reversed. Interface Arabic was fine. The bake had used python-bidi, which put the glyphs in the wrong visual order. That bake is gone. The lines were set in headless Chrome with `dir=rtl` and IBM Plex Sans Arabic, then placed on the blank desk photos. The scene is not flipped.

The piece is one illustration of the existing short-cut track («مقاطع قصيرة»). The source is the “who we are” sentence already on this site. Audience: a long line that needs one speakable sentence. The draft is that sentence. The strike removes «الذي يعيد شغفنا، وحبّنا للإبداع». The card keeps «نجمع الحروف المتفرقة حتى نطوّعها لخلق المحتوى» and is labeled «مقطع قصير · تصور توضيحي». It is not a client job, not a published result, and not the logo.

Words read from the stage at display size, not from the source string: the six slips نحن / نجمع الحروف / المتفرقة / حتى نطوّعها / لخلق المحتوى / الذي يعيد شغفنا; the draft نحن نجمع الحروف المتفرقة / «خارج النص» حتى نطوّعها / لخلق المحتوى؛ الذي يعيد / شغفنا، وحبّنا للإبداع; the same four lines inside the frame; the kept two lines beside the microphone; the last two lines struck; the card label, the kept sentence, and the struck clause.

The desktop stage is 16:9 so the still is not side-cropped. The phone stage stays 3:4. Phone frames are their own layouts so each line stays whole, and the black front of the desk is cropped off. A teal lip remains. The second work row swaps image and text, and the third work image is wider. No new stock and no coffee.

Hero files were not edited. After `is-ready`, the CTA computed to rgb(107, 47, 140), which is #6B2F8C. The settled frame shows the light wordmark, the blue nav contact, and the magenta / blue / teal spectrum. It was compared with `logo-desktop-1440-ar.png`.

Chrome on this tree: zero console errors, overflow 0 at 1440, 360, 390, and 430, one displayed frame, Anime.js 3.2.1 setting opacity, zero video elements. Reduced motion adds `story-static`, hides the track, and shows the six stills. Language toggle goes ar/rtl to en/ltr and back. An empty form shows the required-field status and does not send mail. Desktop tour: 1759 frames at 25 fps, ends at scroll 7824/7824 with the footer in a 900px viewport. Phone tour: 1453 frames at 25 fps, ends at scroll 8788/8788 with the footer in an 844px viewport. Those are browse recordings. Smoothness is not claimed from them.

No public URL. The live site was not published. This is not an acceptance.

