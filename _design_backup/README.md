# Saved background designs

This folder starts with `_`, so Jekyll never publishes it. Each subfolder is a
complete, restorable background design.

| Name | What it is | Files |
|------|------------|-------|
| **Constellation** | The original particles.js network: 130 navy-teal dots, slow drift, links between nearby dots, hover "grab". Dark mode brightens the dots. | `constellation/` — `particles.html`, `particles-config.json` |
| **Constellation + Light Shoots** | Constellation plus a transparent overlay that sends bursts of light hopping node-to-node along the links, with a ripple where each hop lands. | `constellation-light-shoots/` — `particles.html`, `particles-config.json`, `lightshoots.js` |
| **Latent World** (experiment) | Custom canvas: drifting latent-state graph with token pulses and ripple rings. | `latent-world/` — `particles.html`, `worldbg.js` |
| **Event Horizon** (ACTIVE) | Constellation + Light Shoots + click-triggered Incidents (described below). | `event-horizon/` — `particles.html`, `particles-config.json`, `lightshoots.js`, `incidents.js` |

## Active design: Event Horizon

Constellation + Light Shoots, plus `assets/js/incidents.js`: clicking the empty background
(outside the content card, menu and links) triggers a random incident:

- **Neural Avalanche** — light cascades outward through the network from the nearest node
- **Singularity** — nearby nodes spiral into a small black hole, then burst out
- **Shockwave** — a ring of force scatters nodes and fires rays
- **Oracle** — a cryptic line generates token by token where you clicked
- **Dimension Shift** (every 7th click) — the network glitches into another palette, then snaps back

## How to switch

Copy the files from a design's folder back to their live locations:

| File in backup folder | Live location |
|---|---|
| `particles.html` | `_includes/particles.html` |
| `particles-config.json` | `assets/js/particles-config.json` |
| `lightshoots.js` | `assets/js/lightshoots.js` |
| `worldbg.js` | `assets/js/worldbg.js` |

Scripts that the restored `particles.html` no longer references (for example
`incidents.js` when going back to Light Shoots) can be left in place or deleted.
