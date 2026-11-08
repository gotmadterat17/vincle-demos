# designlang measurements — 2026-11-08

Tool actually installed in this VM, project-local only: `/tmp/dl-tool/node_modules/designlang`.

- Package `designlang` version `13.4.0`, license `MIT`, homepage `https://designlang.app`.
- `designlang --help` includes `--width`, `--responsive`, `--motion-runtime`, `--system-chrome`, `--full`.
- `designlang slop --help` does **not** include `--system-chrome`. Slop was run without that flag.
- `designlang verify-ui --help` says it checks 390, 768 and 1280 by default. `--viewports` exists. It was run as `--viewports 390,768,1280`.

## What was run on the local review build `http://127.0.0.1:8765/`

| Command | When | Result |
|---|---|---|
| `designlang http://127.0.0.1:8765/ --system-chrome --responsive --motion-runtime --width 1280 --height 800` | 2026-11-08T04:36:31Z | `offscript-DESIGN.md`. Primary `#1088d0`, secondary `#6b2f8c`, background `#0a0610`, foreground `#f4f7fc`. Sans IBM Plex Sans Arabic, mono IBM Plex Mono, base 16. Motion runtime observed 54 animations, `scrollLinked: true`. Durations include an observed 1200ms and an observed 76000ms (the long atmosphere drift). |
| same tool `--width 390 --height 844` | 2026-11-08T04:41:12Z | `w390-DESIGN.md`. Same primary/secondary/fonts. |
| same tool `--width 768 --height 1024` | 2026-11-08T04:41:16Z | `w768-DESIGN.md`. Same primary/secondary/fonts. |
| `designlang slop http://127.0.0.1:8765/ --json` | 2026-11-08T04:41:07Z | generic score 61, band `mixed`. Tells: indigo/violet gradient (the approved blue bloom `rgba(48,16,208,…)`), “hero then three cards” (it pointed at the existing work row), one sky glow shadow. These tells were **not** used to recolor the violet CTA or the spectrum. |
| `designlang verify-ui … --brand DESIGN.md --viewports 390,768,1280 --json` | after the brand file named `primary: #6B2F8C` | exit 1, `pass: false`, `onBrand: 77`, `generic: 61`. Issues listed are radius warnings (1px, 8px, 12px, 50px versus the 18px card radius in the brand file). Radii were not flattened to chase the score. |

`--responsive` on the first extract did not write separate 390/768/1280 files. The width-specific extracts above are the breakpoint record.

`getAnimations()` does not describe the eight-frame desk sequence. That sequence is measured in the browser gate: one image opacity 1 at each 0/25/50/75/100 step, overflow 0.

## Qamaria

These paths are **not** on this VM:

- `/workspace/sites/qamaria/v6-glass-video/`
- `/workspace/sites/qamaria/v2-haraz/`
- `/workspace/sites/_frames-out/qamaria-v6-smooth-*-FULL.png`

No public Qamaria URL was recovered, so designlang was **not** run on Qamaria. A desktop recording file is present at the uploads path used earlier in this workspace (`qamaria-v6-smooth-desktop-scroll`, duration previously read as 62.84s). Frames taken from that file show a full-bleed farm photograph, three journey cards, and a contact form. That is recording inspection, not a live-site extract. v6 is a positive direction, not approval of every detail. Coffee color was not copied.

## References that were not visually measured

`COVERAGE.md` and `IMPLEMENTATION-REFERENCES.md` are text/source registers. This pass did not open benji.org/stageshow, bencho.dev, appllama.io, Cyanotype, SceneAI Exosia, scrolltide, or the galleries in a browser. Stageshow rules used here are the written ones: one subject, a caused change, no boxed fake screenshot, no extra React engine. The story does not loop back to the opening slips, because the requested ending is what the visitor receives.

The luxury site list in the older inventory is assistant-added, not an owner list, and was not used as a build target.

The corrected e1genqq repository list was not installed.
