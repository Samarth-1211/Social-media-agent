# pre-production/: Group 2

From request to a shootable plan.

| Skill | Status | Does | Stages |
|---|---|---|---|
| `research-methods` | in progress (Group 2a) | Market insight sheet per client: competitors, ads, reviews, trends, Instagram outliers. Runs inline or through the `market-researcher` subagent. | `research` |
| `brief` | planned | Turns the request and client profile into an approved brief (`brief.schema.json`). | `brief` |
| `concept` | planned | Creative routes for the brief. | `concept` |
| `hooks` | planned | Opening hooks for video. | `hooks` |
| `script` | planned | Voiceover and on-screen text (`script.schema.json`). | `script` |
| `localise` | planned | Hindi / English / Hinglish versions of the script. | `localise` |
| `style-bible` | planned | Look, palette, references, preset choice for the job. | `style-bible` |
| `casting` | planned | Characters and consistent AI talent. | `casting` |
| `storyboard` | planned | Shot list (`storyboard.schema.json`). Reviewed by the `storyboard-critic` subagent. | `storyboard` |
| `production-plan` | planned | Model choice, shot order, credit estimate per shot. | `production-plan` |

> This folder is registered in `plugin.json` (`"skills"`) only once it contains at least one real skill. Skill folder names must be unique across all groups.
