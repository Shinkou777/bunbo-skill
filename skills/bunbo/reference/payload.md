# payload.json 格式

`bunbo check` 和 `bunbo render` 都吃这一份。设计维度的取值见 `design.md`，文字字段的要求见 `fields.md`。
能直接跑的完整例子：`${CLAUDE_SKILL_DIR}/samples/sample.json`。

## 顶层

| 字段 | 说明 |
|---|---|
| `handle` | 署名，印在封面和页脚 |
| `fontSize` | 小红书正文字号，默认 44。越大每页字越少，38-52 之间好看 |
| `kicker` | 内页页眉的栏目词，一般跟 `xhs.kicker` 一样 |
| `footer` | 页脚左侧文字，留空不显示 |
| `showHeader` / `showFooter` | 内页页眉、页脚开关，默认都开 |
| `date` | Ins 卡上的日期，如 `2026.09.26`，不填用当天 |
| `design` | 见下 |
| `brand` | 品牌锁定块 `{ "latin": "拉丁字标", "zh": "中文名", "tagline": "等宽小字", "reg": false }`，四项都可留空 |
| `outro` | 小红书尾页，见下。不要尾页就不写 |
| `xhs` | 小红书长文 |
| `insJa` / `insEn` | Ins 日文卡 / 英文卡 |
| `prompts` | 配图、BGM、视频提示词，只查不出图，写进 captions.md |

`xhs`、`insJa`、`insEn` 至少给一块。

## design

```json
{ "layout": "zine", "style": "lemon", "finish": "grain", "binding": "dogear",
  "cover": "masthead", "body": "auto", "mark": "auto", "font": "hei" }
```

`body`、`mark`、`cover` 写 `auto` 就跟版式走。`font` 只管封面标题字体。

## xhs

文字字段见 `fields.md`。排版用的额外字段：

| 字段 | 说明 |
|---|---|
| `coverImage` | 封面照片路径（相对 payload 所在目录，或绝对路径） |
| `coverMode` | `text` 纯文字（默认）/ `image` 半图半题 / `full` 全图打底。有 `coverImage` 时默认 `image` |
| `cite` | 正文末尾的原文出处 `{ "kind": "src", "url": "…", "label": "站点名" }`，`kind` 取值见 `design.md` |

`blocks` 里除了 `h2` `h3` `p` `quote`，排版时还能插：

- `{ "type": "img", "img": "photos/1.jpg" }`：正文插图，占一块固定高度
- `{ "type": "pagebreak" }`：手动分页

段落块可选 `"bold": true`（整段加粗，全文一处）和 `"mark": "原文子串"`（高亮）。

## insJa / insEn

`kicker`、`titleLines`、`titleAccent`、`paragraphs`、`sub`、`caption`、`tags`，要求见 `fields.md`。

## outro 尾页

```json
{
  "on": true,
  "title": "关于这个栏目",
  "sub": "",
  "cols": 0,
  "items": [
    { "icon": "book", "l1": "只写见过的", "l2": "不转述" },
    { "icon": "globe", "l1": "在日观察", "l2": "每周一篇" }
  ],
  "foot": ""
}
```

条目 1-8 条，`cols` 0 = 按条数自动、1 = 一栏、2 = 两栏。图标名见 `design.md`。条目全空就不出尾页。

## prompts

```json
{
  "image": [{ "styleName": "写实纪实", "prompt": "…" }, …3 条],
  "bgm":   [{ "styleName": "…", "prompt": "…" }, …3 条],
  "video": [{ "styleName": "…", "prompt": "…" }, …3 条]
}
```

提示词用英文写，场景必须跟素材有关。
