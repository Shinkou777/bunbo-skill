<!-- 生成文件：来自文房网站源码（lib/voice.ts、lib/engine/schemas.ts、lib/styles.ts…），别手改 -->

# 成稿字段

文房网站让模型按这些结构出稿，`bunbo check` 也按这些查。描述原样取自网站的 schema。

素材门槛：剔掉链接、平台分享口令、分享码、emoji 之后，自己写的字少于 60 个就不写（`bunbo material` 数给你看）。一次最多用 5 条链接。

## xhs（小红书长文）

| 字段 | 类型 | 要求 |
|---|---|---|
| `kicker` | string | 栏目词，2-4个字，必须来自素材本身的主题，例如素材讲便利店就写「在日观察」这类；不要套用示例 |
| `titleLines` | string[] | 封面标题，手动断行成 2-3 行，每行不超过 7 个字，绝不留 1-2 字的孤行 |
| `titleAccent` | string | 标题里要用强调色的那个词，必须是标题的原文子串 |
| `titleEn` | string | 英文副标题，一句话陈述本文在讲什么，不超过 16 个词，句末带句号，不用 slogan 腔，不加引号。素材撑不起就写短，实在没什么可说就返回空字符串 |
| `lede` | string | 封面引言，一两句，40 字以内 |
| `blocks` | object[] | 整篇长文的块序列，不用考虑分页（前端会按字号自动切页）。要求：全文**不超过** 1100 字，这是上限不是下限——素材撑得起多少就写多少，撑不起就写短，绝不为凑字数编内容；h2 是章节标题（前端会自动编号 01/02/03，所以标题里不要自己写序号，12 字以内），每 3-5 个段落配一个，全文短的话一个都不用也行；h3 是章节内的小标题，可不用；p 是短段落（每段 40-90 字）；quote 是金句（最多 2-3 处，没有值得拎出来的就一处都不要）；正文里用 **…** 标出一句话里最该被记住的那半句，每个章节最多 1 处 |
| `blocks[].type` | h2 / h3 / p / quote |  |
| `blocks[].text` | string |  |
| `blocks[].bold` | boolean（可省） | 仅 p 段落用：整段加粗。全文只允许 1 处，放在开篇提出核心问题的那一段 |
| `blocks[].mark` | string（可省） | 仅 p 段落用：要重点强调的短语，必须是 text 的原文子串，且不能和 text 里 **…** 标出的部分有任何重叠 |
| `caption` | string | 发帖文案，写成一段内容提要，不超过 260 字。素材里如果有明确的人物、时间、来源，就交代清楚；**素材里没有的就一律不写，绝不编造出处**。整段连贯，不分小标题，不用 emoji，不写「点击查看」这类召唤 |
| `tags` | string[] | 话题标签，最多 8 个，不带#号。只写素材真的涉及的话题，宁可少也不要凑 |

## insJa / insEn（Ins 单张卡）

| 字段 | 类型 | 要求 |
|---|---|---|
| `kicker` | string | 栏目词，英文或短词，例如 Tokyo Notes |
| `titleLines` | string[] | 标题手动断行，最多 2 行，每行简短有力 |
| `titleAccent` | string | 标题里用强调色的词，必须是标题原文子串 |
| `paragraphs` | string[] | 正文最多 2 段短段落。硬限制：日文全部段落合计不超过 130 字，英文合计不超过 240 字符。卡片空间有限，超了会被裁掉 |
| `sub` | string | 收尾一句弱化文字，20 字/40 字符以内 |
| `caption` | string | 发帖 caption 正文，不要包含 hashtag |
| `tags` | string[] | hashtag 最多 5 个，用目标语言写，不带#号。只写素材真的涉及的，宁可少 |

## prompts（配图、BGM、视频提示词，写进 captions.md，不进卡片）

| 字段 | 类型 | 要求 |
|---|---|---|
| `image` | object[] | 3 个风格差异明显的分支（如写实/插画/抽象氛围），不许只换措辞 |
| `image[].styleName` | string | 风格分支名，2-6 个中文字 |
| `image[].prompt` | string | English image-generation prompt: concrete scene, mood, lighting, style. No text in image, no cyberpunk cliches |
| `bgm` | object[] | 3 个风格差异明显的分支（如写实/插画/抽象氛围），不许只换措辞 |
| `bgm[].styleName` | string | 风格分支名，2-6 个中文字 |
| `bgm[].prompt` | string | English music-generation prompt (Suno style): genre, mood, tempo/BPM, instrumentation, with or without vocals |
| `video` | object[] | 3 个风格差异明显的分支（如写实/插画/抽象氛围），不许只换措辞 |
| `video[].styleName` | string | 风格分支名，2-6 个中文字 |
| `video[].prompt` | string | English text-to-video prompt: scene, subject motion, camera movement, lighting, duration feel. One shot, concrete |

## bunbo check 的硬性检查

- 小红书：标题 2-3 行、每行 ≤7 字、最后一行不能只有 1-2 个字；引言 ≤40 字；正文合计 ≤1100 字；章节标题 ≤12 字且不自己写序号；金句 ≤3 处；整段加粗 ≤1 处；文案 ≤260 字；标签 ≤8 个；英文副标题 ≤16 个词
- Ins：标题 ≤2 行；正文 ≤2 段，日文合计 ≤130 字、英文合计 ≤240 字符；收尾句日文 ≤20 字、英文 ≤40 字符；标签 ≤5 个；caption 里不放 hashtag
- 全部：强调词必须是标题原文子串；mark 必须是段落原文子串且不和 **…** 重叠；标签不带 #；没有 emoji；中日英三套禁句都不许命中
- 提醒（不拦）：段落 40-90 字、栏目词 2-4 字

## 正文里能用的内联标记

`**粗**` 一句话里最该记住的半句 / `==高亮==` / `!!反白!!` / 段首 `【大】` `【小】` 调字号 / 段首 `【粗】` 整段加粗
