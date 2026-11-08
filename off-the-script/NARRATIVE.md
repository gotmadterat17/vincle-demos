# Narrative scroll spec — 2026-11-07

Proposal for the lower page. The hero is not part of the redesign. Chapter order is a design proposal, not a recovered owner outline.

| # | Chapter | Learns | Entry | While scrolling | Settled | Handoff | Phone / reduced motion |
|---|---|---|---|---|---|---|---|
| 1 | Mark `#top` | The studio’s glass emblem | Existing load | Existing ambient loop and drag | Approved A frame | Fog band | Compact stage. Reduced motion: static mark |
| 2 | Point of view `#about` | Why the letters are gathered | Copy rises once | Interview plate shifts at most 8px | Text beside the set | Fog | Stack. No shift. Video has controls |
| 3 | Sequence `#gallery` | Idea, script, frame, edit, city, identity — editorial stills, not client results | Six owned stills | Anime.js 3.2.2 fades the previous still out and the next one in as the step reaches the middle | One still fills the stage | Next still | Phones show each poster in order. Reduced motion shows every poster, no crossfade |
| 4 | Work `#work` | Mikhyal, Sawiris, Expo as public facts | Each beat rises once | Media plate shifts; current beat is marked | Alternating picture and fact | Fog | Picture then words. No autoplay |
| 5 | Craft `#offer` | Three tracks, price after a brief | Lead row, then the pair | No shared fade | Wide track, then two | Fog | One column |
| 6 | Method `#method` | Brief, select, produce, publish | Steps stay readable | Sticky label only inside the section on desktop; thread follows `--p` | Four steps | Fog | No sticky |
| 7 | Plates `#gallery` | The grade: studio, edit, city | Mosaic, not six identical fades | In-view playback on desktop only | Large plate plus grid | Fog | One column, controls |
| 8 | Invitation `#contact` | How to send a brief | Existing form | None | Violet hero CTA unchanged; this form still only copies | Footer | Same form |

Motion is `transform` and `opacity` on dedicated nodes. No scroll hijack, no empty `min-height`, no second WebGL scene.
