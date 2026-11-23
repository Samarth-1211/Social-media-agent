# Scene writing: storyboard-ready action lines

The storyboard, shot sourcing and generation stages build from `visual_action`. A line they have to guess at is a line that comes back. Write what a camera can see and a phone can shoot.

## 1. The five parts (all required)

| Field | Write | Not |
|---|---|---|
| `shot` | `extreme-close-up`, `close-up`, `medium-close-up`, `medium`, `wide`, `extreme-wide`, `insert` (an object or screen detail), `over-shoulder`, `pov`, `top-down`, `screen` (full-frame card or graphic) | "nice shot", "cinematic" |
| `subject` | One dominant subject, named: "Neha at the counter", "the pickup van", "the RERA board at the gate" | "the brand", "happiness" |
| `action` | One visible action, present tense: "folds the saree into tissue", "a wipe reveals the clean sofa" | feelings ("she feels relieved"), backstory, two actions |
| `camera` | `static`, `push-in`, `pull-out`, `pan`, `tilt`, `tracking`, `handheld`, `whip-pan`, `zoom`, `orbit` | "dynamic camera" |
| `setting` | Place + light/time: "shop counter, morning light", "Napier Town site, evening" | "a nice place" |

Optional `continuity`: a prop, wardrobe or place state to keep across scenes ("same blue curtain as scene 1", "Agrawal sir in the white kurta").

## 2. Rules

- **Filmable or audible, nothing else.** If a beat can't be shot, turn it into an action, a prop, a sound or a card.
- **One subject, one action, one camera move per scene.** A second action is a second scene.
- **Shot purpose decides the shot:** geography → wide, steady; emotion → close, slow; reveal → hold the frame and let the change happen; action → tracking; detail → insert, static or a slow push-in.
- **Real where trust lives.** Any scene showing a real customer, the real shop, the real site or a real result is `must_be_real: true` with `asset_hint` `client-footage` or `phone-shoot`. Never AI or stock for it.
- **Producible by this client.** `asset_hint` comes from the concept's producibility shots. A local business with a phone gets phone-shootable scenes: no drones, crowds or actors unless the brief says so.
- **AI shots are for what can't be filmed** (an unbuilt interior, a symbolic moment). They're labelled on screen ("AI-generated / representative", "Artist's impression" for real estate renders) and never shown as real customers or places.
- **Readable on a phone.** Faces and products big in frame; the subject's eyes in the top third; nothing important in the bottom 20 % (captions) or the right edge (buttons).
- **Continuity:** keep the screen direction (a van leaving left keeps leaving left), the props and the wardrobe. Re-establish the place after a big jump.
- **Sound is part of the scene.** `sfx` is one concrete sound ("van door slide", "steam hiss", "doorbell"); `music_cue` says what the music does here ("drops to a hum", "hit on the reveal", "out on the beat").

## 3. Before / after

| Weak | Storyboard-ready |
|---|---|
| "Show the shop and happy customers" | `wide` · Shubh Laundry counter · Neha hands a pressed shirt across the counter to a customer · `static` · shop, morning light · must_be_real |
| "Beautiful flat interior" | `medium` · 2BHK living room render · slow light change from day to evening · `push-in` · AI interior, "Artist's impression" card · asset ai |
| "Our process is the best" | `insert` · steam iron on curtain fabric · iron glides, steam rises · `handheld` · shop pressing table |
| "Mom is happy with the saree" | `close-up` · a woman's hands · unfolds a saree from tissue paper and holds it to the light · `static` · living room window, afternoon |

## 4. Asset hints

| `asset_hint` | Use for | Costs |
|---|---|---|
| `client-footage` | Existing real clips and photos: before/after, past jobs, the site archive | Nothing, but the client must send them; flag it |
| `phone-shoot` | New real footage the team or client shoots: shop, staff, process, owner to camera | A shoot list, no credits |
| `motion-graphics` | Offer cards, end cards, step numbers, RERA end card | Editor time |
| `ai` | What can't be filmed; labelled | Credits (generation stages decide) |
| `stock` | Generic establishing shots only (city skyline, traffic) | Licence; never for the business itself |
