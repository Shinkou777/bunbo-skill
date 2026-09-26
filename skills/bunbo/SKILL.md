---
name: bunbo
description: 文房 BUNBO：把素材（文字、链接、照片）做成成套的社交图文，在本机出 PNG。小红书多页长图（封面 + 自动分页正文 + 可选尾页）、Ins 日文卡、Ins 英文卡，附三语发帖文案、hashtag、配图/BGM/视频提示词。配色、版式、材质、封面、装帧自由组合，排版系统和 bunbo.shinkolab.app 网站同一套。文案由 Claude Code 自己写，写完用网站同一套规则校验（结构、字数、禁句、emoji），不调任何云端 API。触发：/bunbo、「做成卡片」「做成小红书长图」「出一套图文」「处理 inbox」。
argument-hint: "<素材文字 / 链接 / 图片路径>，<可选：平台 / 风格 / 角度>"
---

# 文房 BUNBO

用户敲 `/bunbo 素材，要求`。素材在 `$ARGUMENTS` 里。

下文的 `${CLAUDE_SKILL_DIR}` 是本 skill 的目录；取不到时本机是 `~/.claude/skills/bunbo`，插件安装时在插件缓存里。命令行是 `node "${CLAUDE_SKILL_DIR}/bin/bunbo.mjs" <子命令>`，每次都写全（别存成 shell 变量，zsh 不拆分带空格的变量）。

第一次用先确认依赖（出图要用 puppeteer-core 驱动本机的 Chrome）：

```bash
test -d "${CLAUDE_SKILL_DIR}/node_modules/puppeteer-core" || npm install --prefix "${CLAUDE_SKILL_DIR}" --no-fund --no-audit
```

参考文档都在 `${CLAUDE_SKILL_DIR}/reference/`：

| 文件 | 内容 |
|---|---|
| `voice.md` | 口吻规则（中日英三套）、调文风规则、重生成规则 |
| `fields.md` | 每个字段的要求、字数条数上限、`bunbo check` 查什么 |
| `design.md` | 配色、版式、材质、装帧、封面、正文模板、页位记号、封面字体、预设的全部取值 |
| `payload.md` | payload.json 的完整格式，含封面照片、正文插图、品牌、尾页、原文出处 |

## 输出位置

- 读 `~/.config/bunbo/config.json`（可以没有）：`{ "inbox": "素材收件箱目录", "output": "成品根目录", "handle": "@你的署名" }`
- 成品目录：`<output>/YYYY-MM-DD-<slug>/`，没配 output 时用 `~/Desktop/文房/YYYY-MM-DD-<slug>/`
- slug 用素材主题的两三个英文词或拼音，小写连字符

## 流程

### 1. 收素材

按优先级：命令带的参数 → 配置里的 inbox 目录（图片用 Read 看，`.txt` `.md` 是文字，跳过 `processed/`）。
两边都没有就说没有素材，结束。

- **链接**：每条都跑 `node "${CLAUDE_SKILL_DIR}/bin/bunbo.mjs" fetch <url>`，一次最多 5 条。任何一条没抓到（退出码非 0），就停下来，把哪条、为什么告诉用户，请用户把原文贴过来。不许凭链接标题或网址去猜内容。
- **图片**：用 Read 看图，图里的细节算素材。要放进卡片的图记下路径（封面照片、正文插图）。

### 2. 查素材量

把素材文字（链接抓回的正文也算）写进成品目录的 `material.txt`，跑：

```bash
node "${CLAUDE_SKILL_DIR}/bin/bunbo.mjs" material <成品目录>/material.txt
```

`enough` 是 false 就停下，告诉用户可用字数和门槛，请用户补料。只有一句「帮我写一篇关于 X 的」不算素材，写出来只能是编的。

### 3. 定角度

一句话写给用户看：这一套从哪个切入点讲。角度定不下来就别往下写。

### 4. 写稿

先读 `reference/voice.md` 和 `reference/fields.md`，再写。默认三个平台都写（小红书长文 + Ins 日文 + Ins 英文），用户点名只要哪几个就只写那几个。

- 中文、日文、英文各按对应口吻单独写，日文和英文按当地 SNS 的习惯重新组织句子
- **每一个事实都必须来自素材**：素材里没写的人名、机构、年份、数字、研究、出处，一个都不许添。素材少就写短
- 小红书封面标题手动断行，每行不超过 7 个字，最后一行不能只剩一两个字
- 三类提示词（配图、BGM、视频）各写 3 个风格明显不同的分支，放在 payload 的 `prompts` 里

稿子直接写成 `<成品目录>/payload.json`，格式见 `reference/payload.md`。署名用配置里的 `handle`，没配就问用户要，或者留空。

### 5. 校验

```bash
node "${CLAUDE_SKILL_DIR}/bin/bunbo.mjs" check <成品目录>/payload.json
```

有 ERROR 就改到没有；WARN 逐条看，有理由可以不改。禁句命中时照 voice.md 的改法：把被否定的那半句整段删掉，只留正面陈述。

### 6. 选设计

读 `reference/design.md`，按素材挑一套预设，或者自己组 layout / style / finish / binding / cover，写进 payload 的 `design`。
讲器物、参数走规格书，讲观察走社论，讲情绪、生活走刊物。别每次都用同一套。
有合适的照片可以做封面：`xhs.coverImage` 填图片路径，`xhs.coverMode` 选 `image`（半图半题）或 `full`（全图打底）。

### 7. 出图

```bash
node "${CLAUDE_SKILL_DIR}/bin/bunbo.mjs" render <成品目录>/payload.json <成品目录>
```

输出 `xhs_01_cover.png`、`xhs_02.png`…、`ins_ja.png`、`ins_en.png`，小红书 1242×1656，Ins 1080×1350。分页由浏览器按真实字体实测，页数事先不知道。

**出完用 Read 逐张看**：字有没有溢出、挤压、贴边，标题断行难不难看，有没有孤行。有问题就改稿子或换设计重出。

### 8. 收尾

- 成品目录里写 `captions.md`：小红书、Ins 日文、Ins 英文三节，每节是可以直接复制的发帖文案和 hashtag（带 #）；后面接配图、BGM、视频三类提示词
- payload.json 留在成品目录，回头改字直接重出
- 处理过的 inbox 素材移到 `inbox/processed/`（移动，不删）
- 每条素材汇报一行：角度 + 成品目录

## 改稿

- **调文风**（「短一点」「口语一点」「开头换一个」）：照 voice.md 的调文风规则改 payload 里对应的字段，只改说法，不加事实。改完 check、重出
- **重生成**（「换个角度」「再来一版」）：同一份素材换切入点重写，照 voice.md 的重生成规则
- **只换设计**：改 `design` 直接重出，不动文字

## 规则

- 文案是核心，排版是现成的。力气花在角度和句子上
- 不用 emoji；中日英三套禁句都不许命中
- 数字、规格、条数只写素材里有的
