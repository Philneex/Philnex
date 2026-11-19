# PHILNEX — Design System

**Direction: "Editorial Paper"** — reference: tseily.com (creative director / filmmaker portfolio).
Warm paper ground, real work up front, one confident serif, a quiet sans, and colour used
as *ink on paper* rather than as big painted surfaces. No glass blobs, no orbit rings,
no swooshes: the videos and Phil himself are the decoration.

## Principles

1. **Work first.** Real project stills replace abstract art in the hero; service panels get
   designed scenes that show the craft itself.
2. **Paper, not paint.** One light ground across the page; colour appears in type,
   small chips and a few panels. Dark only for the footer and the video lightbox.
3. **One voice.** Jost only — light (300) at display sizes, regular for body. No italic or
   second typeface to highlight words: emphasis looks exactly like its sentence.
4. **One loud moment per screen.** Big condensed coloured caps are reserved for the
   marquee band and the brand index — never for running headlines.
5. **Playful, springy motion** (after tseily.com) — but never on running text; tilt, skew
   and sideways drifting are gone.

## Colour

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F4EFE6` | Page ground |
| `--paper-2` | `#EAE3D6` | Quiet surface (sand panel, field fills) |
| `--ink` | `#111813` | Text, primary buttons, footer |
| `--ink-2` | `rgba(17,24,19,.64)` | Secondary text (≥ 4.5:1 on paper) |
| `--rule` | `rgba(17,24,19,.14)` | Hairlines |
| `--forest` | `#33402B` | Accent panel, brand colour 1 |
| `--orange` | `#FF7132` | Accent: logo dot, hover, progress, brand colour 2 |
| `--purple` | `#7544B5` | Accent panel, brand colour 3 |
| `--green` | `#35C46B` | Phil's colour — only the puppet's mouth opening |
| `--cream` | `#DCD5C6` | Text on dark surfaces |

Orange is never a large surface. Text on orange is always ink.

## Typography

| Role | Font | Size | Notes |
|---|---|---|---|
| Display (hero, contact) | Jost 300 | clamp(3.1rem, 5.4vw, 6.8rem) / .98 | `-0.045em` |
| H2 | Jost 300 | clamp(2.6rem, 5.6vw, 6rem) / 1.02 | `-0.04em`; `em` has no special style |
| Logo | Jost 400, uppercase | 1.05rem | `0.32em` tracking |
| Index / band | Big Shoulders Display 800, uppercase | clamp(3rem, 9vw, 9rem) / .9 | coloured, the one loud voice |
| Body | Jost 400 | 1–1.12rem / 1.6 | max 62ch |
| Label / nav | Jost 500 | .9rem, normal case | section labels end with a thin rule |
| Meta | Jost 400 | .8rem | categories, brand under titles |

## Spacing, radius, elevation

- Gutter `clamp(1.25rem, 4.5vw, 4rem)`; section padding `clamp(5rem, 11vw, 10rem)`.
- Radius: media `10px`, panels `18px`, chips `6px`, pills `999px`. Nothing organic.
- Shadow only on floating media: `0 18px 40px -18px rgba(17,24,19,.35)`.

## Components

- **Nav**: logo in serif, links in Jost normal case, CTA as ink-outlined pill;
  paper backdrop with blur once scrolled.
- **Buttons**: solid = ink on paper → orange on hover; ghost = ink hairline.
- **Hero**: Phil's B/W paper cut-out portrait (`assets/perfil/phil-puppet.webp`) as a puppet:
  the rectangular chin piece (32.85–67.15 % wide, 77.2–95.6 % high) drops every 2.2 s,
  revealing a mouth opening in Phil's green `#35C46B`, and a project still flies out of the mouth;
  click = three at once. The flying stills are hand-picked strongest frames per video
  (`assets/hero/fly-*.jpg`); food clips keep their posters.
  Static stills + coloured chips float around it (gentle bob + mouse parallax).
- **Phones**: titanium frame (neutral metal), no coloured glow.
- **Brand index**: one name per row, condensed caps, colours rotate
  forest → orange → purple → ink; hairline between rows.
- **Service panels**: rounded 18px, alternating forest / sand / orange / ink / purple,
  each with its own designed, animated scene (no video stills): camera viewfinder,
  story card with 3-second bars, editing timeline, growth curve, comments + hearts,
  plate with steam.
- **Project grid**: uniform 4:5 tiles, 10px radius, 4 columns ≥ 1200px, 3 ≥ 760px, 2 below;
  hover plays the clip and scales it 1.04.
- **Footer**: ink, giant light Jost wordmark in cream with orange dot.

## Motion

- Ease `cubic-bezier(.16,1,.3,1)`; reveals 0.9s, masks 1.1s.
- Spring `cubic-bezier(.3,1.6,.5,1)` for hovers and pops (after tseily.com).
- Hero stills burst out of the portrait on load, then bob.
- Brand rows slide in from the right; hovering a brand dims the others and a 9:16 clip
  (or a colour card) pops up next to the cursor.
- Project cards rise and scale into place; About words spring on hover; cursor pulses on links.
- Kept: loader, heading masks, counters, phone turn-on, horizontal services, lightbox FLIP.
- Removed: WebGL sculptures, orbit rings, connecting line, card tilt, marquee skew,
  sideways drift on stats/brands, grain overlay.
- `prefers-reduced-motion` disables float and scroll choreography.

## Language switch (DE / EN)
`js/i18n.js` (loaded before `main.js`): German lives in the HTML; with EN selected the script swaps every text and project title/description/category before animations start. Choice is stored in `localStorage` (`philnex-lang`); `?lang=en` / `?lang=de` links work too. The switch sits in the nav on desktop and phone.
