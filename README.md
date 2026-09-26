# 文房 BUNBO skill

English · [中文](README.zh-CN.md) · [日本語](README.ja.md)

A Claude Code skill that turns one piece of source material (text, a link, or photos) into a ready-to-post social card set:

- **Xiaohongshu long post**: cover, body paginated by measuring real text, optional closing page (1242×1656)
- **Instagram cards**: one Japanese, one English, each written natively (1080×1350)
- **Captions and hashtags** for all three
- **Prompts** for images, music and video, three style branches each

Claude Code writes the copy. A bundled checker holds it to fixed rules (structure, length limits, banned phrasings, no emoji). A bundled renderer lays it out and saves PNGs on your own machine. No cloud API is called.
The layout system is the one that runs [bunbo.shinkolab.app](https://bunbo.shinkolab.app).

Made by [ShinkoLab](https://shinkolab.app).

## Examples

Both sets below were rendered straight from the sample payloads in [`skills/bunbo/samples/`](skills/bunbo/samples/).

**Zine layout · lemon · paper grain** ([sample.json](skills/bunbo/samples/sample.json))

| | | | |
|---|---|---|---|
| ![](docs/gallery/sample/xhs_01_cover.png) | ![](docs/gallery/sample/xhs_02.png) | ![](docs/gallery/sample/ins_ja.png) | ![](docs/gallery/sample/ins_en.png) |

**Spec-sheet layout · copper · brushed metal** ([shinkolab.json](skills/bunbo/samples/shinkolab.json))

| | | | |
|---|---|---|---|
| ![](docs/gallery/shinkolab/xhs_01_cover.png) | ![](docs/gallery/shinkolab/xhs_02.png) | ![](docs/gallery/shinkolab/xhs_04_outro.png) | ![](docs/gallery/shinkolab/ins_en.png) |

Palettes, layouts, surface finishes, cover forms, binding marks, body templates and cover typefaces combine freely. The full list is in [design.md](skills/bunbo/reference/design.md).

## Install

Requirements: Node 20+, Google Chrome (or Chromium / Edge). Chinese and Japanese type looks as intended on macOS; other systems fall back to whatever CJK fonts are installed.

**As a personal skill** (command `/bunbo`):

```bash
git clone https://github.com/Shinkou777/bunbo-skill.git
cd bunbo-skill
bash install.sh
```

The installer links `skills/bunbo` into `~/.claude/skills/bunbo`, installs `puppeteer-core`, checks for Chrome, and renders the samples as a smoke test. `git pull` updates it in place.

**As a plugin** (command `/bunbo:bunbo`):

```
/plugin marketplace add Shinkou777/gento
/plugin install bunbo@shinkolab
```

## Use

Type `/bunbo` in Claude Code, followed by your material and any wishes:

```
/bunbo Turn this into a Xiaohongshu post: <paste text>
/bunbo https://example.com/some-article Xiaohongshu only
/bunbo ~/Pictures/trip/01.jpg ~/Pictures/trip/02.jpg with this note, first photo as a full-bleed cover: <text>
/bunbo Product spec sheet, use the spec layout: <specs>
```

What happens:

1. **Collect**: links are fetched for their article text. If a link only yields a login wall, a share blurb or a JS shell, BUNBO stops and asks you to paste the text; it never guesses from a title
2. **Measure**: links, share codes and emoji don't count as material. Too little left, and it asks for more
3. **Angle**: one sentence on how this set will tell the story
4. **Write**: Chinese, Japanese and English each in their own voice, using only facts from your material
5. **Check**: structure, length limits, banned phrasings, emoji; fixed until it passes
6. **Design**: a layout and palette picked for the material
7. **Render**: every PNG is looked at for overflow, cramped edges and awkward line breaks, and redone if needed
8. **Wrap up**: `captions.md` written, output folder reported

Then just say what to change: "shorter", "new opening", "try another angle", "switch to the editorial layout". Style edits keep the facts; a new angle rewrites from the same material; a design change re-renders without touching the text.

Output goes to `~/Desktop/文房/<date>-<slug>/`:

```
material.txt   payload.json   xhs_01_cover.png   xhs_02.png …   ins_ja.png   ins_en.png   captions.md
```

Optional config at `~/.config/bunbo/config.json`:

```json
{ "inbox": "/path/to/inbox", "output": "/path/to/output", "handle": "@yourname", "credit": true }
```

With `inbox` set, `/bunbo` alone processes everything in it. `credit` adds an optional line at the end of `captions.md` ("Layout: 文房 BUNBO · bunbo.shinkolab.app") that you can keep or drop when posting; set it to `false` to leave it out. Nothing is ever stamped on the images.

## Command line

The skill drives a small CLI you can also run yourself:

```bash
node skills/bunbo/bin/bunbo.mjs fetch <url>                    # article text, or a clear refusal
node skills/bunbo/bin/bunbo.mjs material <file>                # how much usable material there is
node skills/bunbo/bin/bunbo.mjs check <payload.json>           # structure, limits, banned phrasing
node skills/bunbo/bin/bunbo.mjs render <payload.json> <outdir> # PNGs
```

Formats and rules: [payload.md](skills/bunbo/reference/payload.md), [fields.md](skills/bunbo/reference/fields.md), [voice.md](skills/bunbo/reference/voice.md).

## Web version

[bunbo.shinkolab.app](https://bunbo.shinkolab.app) runs the same layout system in the browser, with click-to-edit cards and three more tools (covers, titles, word clouds). The web version asks for your own Anthropic API key; this skill uses Claude Code itself and needs no separate key.

## About ShinkoLab

ShinkoLab is the lab of Isen, who works in AI education, technical training and consulting in Japan and China. It records the courses, products and thoughts along the way.

- Website: [shinkolab.app](https://shinkolab.app)
- Courses: [JISSENJUKU](https://jissenjuku.shinkolab.app), plus AI training for working engineers and company teams (see the website)
- Xiaohongshu: [@先進元素](https://www.xiaohongshu.com/user/profile/5e493a3900000000010079b6)
- note (Japanese): [SenshinYoso](https://note.com/heishinkou)

More open-source tools:

| Tool | What it does |
|---|---|
| [幻燈 GENTO](https://github.com/Shinkou777/gento) | Claude Code skill: a brief in, a code-drawn animated short film with its own soundtrack out |
| [浮子 UKI](https://github.com/Shinkou777/uki) | macOS desktop HUD that shows your Claude usage limits |
| [影幕 KAGEMAKU](https://github.com/Shinkou777/kagemaku) | Frosted-glass bar for macOS that hides subtitles until you want to peek |

## About this repository

Everything here is generated from the BUNBO website's source, so the skill and the site share one set of rules and one layout system. Issues are welcome here; changes are made upstream and republished.

## License

MIT © @先進元素
