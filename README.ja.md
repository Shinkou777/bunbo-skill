# 文房 BUNBO skill

[English](README.md) · [中文](README.zh-CN.md) · 日本語

素材ひとつ（文章、リンク、写真）から、そのまま投稿できる SNS 画像一式を作る Claude Code スキルです。

- 小紅書（RED）の長文画像：表紙、実際のフォントで測って自動改ページする本文、任意の最終ページ（1242×1656）
- Instagram カード：日本語と英語を1枚ずつ、それぞれの言語で書き下ろし（1080×1350）
- 3プラットフォーム分の投稿文とハッシュタグ
- 画像・BGM・動画の生成プロンプト、各3スタイル

文章は Claude Code が書き、決まったルール（構成、文字数、禁止表現、絵文字）で確認してから、自分のマシンでレイアウトして PNG にします。クラウド API は呼びません。
レイアウトは Web 版 [bunbo.shinkolab.app](https://bunbo.shinkolab.app) と同じものです。

制作：[ShinkoLab](https://shinkolab.app)

## サンプル

どちらも [`skills/bunbo/samples/`](skills/bunbo/samples/) のサンプル原稿からそのまま書き出したものです。

**ジン · レモン · 紙の質感**（[sample.json](skills/bunbo/samples/sample.json)）

| | | | |
|---|---|---|---|
| ![](docs/gallery/sample/xhs_01_cover.png) | ![](docs/gallery/sample/xhs_02.png) | ![](docs/gallery/sample/ins_ja.png) | ![](docs/gallery/sample/ins_en.png) |

**仕様書 · 赤銅 · ヘアライン**（[shinkolab.json](skills/bunbo/samples/shinkolab.json)）

| | | | |
|---|---|---|---|
| ![](docs/gallery/shinkolab/xhs_01_cover.png) | ![](docs/gallery/shinkolab/xhs_02.png) | ![](docs/gallery/shinkolab/xhs_04_outro.png) | ![](docs/gallery/shinkolab/ins_ja.png) |

配色、レイアウト、質感、表紙、装丁、本文テンプレート、表紙の書体は自由に組み合わせられます。一覧は [design.md](skills/bunbo/reference/design.md)。

## インストール

必要なもの：Claude Code、Node 20 以上、Git、Chrome・Chromium・Edge のどれか（Windows 標準の Edge で可）。書体は macOS ではヒラギノ・苹方など、Windows では游ゴシック・Microsoft YaHei などを使います。改ページは実際のフォントで測るので、はみ出しません。

**個人スキルとして**（コマンドは `/bunbo`）

macOS / Linux：

```bash
git clone https://github.com/Shinkou777/bunbo-skill.git
cd bunbo-skill
bash install.sh
```

Windows（PowerShell またはコマンドプロンプト）：

```powershell
git clone https://github.com/Shinkou777/bunbo-skill.git
cd bunbo-skill
node install.mjs
```

**プラグインとして**（コマンドは `/bunbo:bunbo`）：

```
/plugin marketplace add Shinkou777/gento
/plugin install bunbo@shinkolab
```

## 使い方

Claude Code で `/bunbo` のあとに素材と希望を書きます。

```
/bunbo この文章を小紅書の長文画像に：<文章>
/bunbo https://example.com/some-article Instagram の日本語カードだけ
/bunbo ~/Pictures/trip/01.jpg この写真を全面の表紙にして、次の文章で：<文章>
```

リンクは本文を取得し、ログイン画面や共有文しか取れないときは止まって原文を求めます。素材が少なすぎるときも先に確認します。書いたあとはルールで確認し、画像を1枚ずつ見てはみ出しや不自然な改行がないか確かめてから渡します。

仕上がったら「短く」「書き出しを変えて」「別の切り口で」「社説レイアウトに」のように頼めば直します。

出力先は `~/Desktop/文房/<日付>-<テーマ>/`。任意の設定は `~/.config/bunbo/config.json`（`inbox`、`output`、`handle`、`credit`）。`credit` は `captions.md` の最後に任意のクレジット行を付けるかどうかで、画像には何も入れません。

## Web 版と API キー

[bunbo.shinkolab.app](https://bunbo.shinkolab.app) は同じレイアウトの Web 版です。文章の生成には自分の Anthropic API キーが要ります。キーはブラウザにだけ保存され、サーバーはそのリクエストの間だけ使い、保存もログもしません。キーを扱うコードは [web/](web/) にそのまま置いてあります。このスキルは Claude Code そのものを使うので、キーは要りません。

## 文字動画

動画がほしいとき（「Reels にして」）は、書き上げた原稿から台本を作ります。1 行 1 フレーズ、`/` でカットを切り、`*…*` で大事な数行を強調、`~…~` で締めの一行を弱めます。台本も禁止表現と emoji のチェックを通してから、`bunbo video` がローカルの Chrome でカットを組み、カードと同じ配色で MP4 を書き出します。

```bash
node skills/bunbo/bin/bunbo.mjs video video.txt <outdir> --aspect 9:16 --palette lemon --music track.mp3
```

`--bg photo.jpg` で写真を背景に、同じ写真から切り抜いた `--fg subject.png` を足すと、文字が人物の後ろを通ります。カットを組むエンジンは [字面一 JIZURA](https://github.com/852wa/JIZURA)（[ONE STOP EDITION](https://github.com/hirazisora/JIZURA)、MIT）で、文房は中国語 UI と文房の配色を足しています。同じツールは Web の [bunbo.shinkolab.app/jizura](https://bunbo.shinkolab.app/jizura) でも使えます。

## コマンドライン

```bash
node skills/bunbo/bin/bunbo.mjs fetch <url>
node skills/bunbo/bin/bunbo.mjs material <file>
node skills/bunbo/bin/bunbo.mjs check <payload.json>
node skills/bunbo/bin/bunbo.mjs render <payload.json> <outdir>
node skills/bunbo/bin/bunbo.mjs video <script.txt> <outdir>
```

## ShinkoLab について

ShinkoLab は Isen の実験室です。Isen は日本と中国で AI 教育、技術研修、コンサルティングに携わり、ShinkoLab ではその講座とプロダクト、感じたことや考えたことを記録しています。

- Web サイト：[shinkolab.app](https://shinkolab.app/ja)
- 講座：[実戦塾](https://jissenjuku.shinkolab.app)、エンジニア向け・企業向けの AI 研修（詳しくは Web サイト）
- note：[SenshinYoso](https://note.com/heishinkou)
- 小紅書：[@先進元素](https://www.xiaohongshu.com/user/profile/5e493a3900000000010079b6)

ほかのオープンソース：

| ツール | 内容 |
|---|---|
| [幻燈 GENTO](https://github.com/Shinkou777/gento) | Claude Code スキル：素材からコードで描く BGM 付きショート動画 |
| [浮子 UKI](https://github.com/Shinkou777/uki) | Claude の使用量上限を表示する macOS のデスクトップ HUD |
| [影幕 KAGEMAKU](https://github.com/Shinkou777/kagemaku) | 字幕を隠す macOS のすりガラスバー。見たいときだけのぞける |

## ライセンス

MIT © @先進元素

`skills/bunbo/renderer/jizura.html` は 字面一 JIZURA ONE STOP EDITION（MIT。オリジナル版 © 2026 hakoniwa、ONE STOP EDITION © 2026 hirazisora）に文房の変更を加えたものです。ライセンスと第三者表記は [JIZURA-NOTICE.txt](skills/bunbo/renderer/JIZURA-NOTICE.txt)。
