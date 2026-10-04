# 文房网站怎么处理你的 API key

[bunbo.shinkotera.com](https://bunbo.shinkotera.com/cards) 的卡片页要你填自己的 Anthropic API key 才能生成。
这个目录是网站处理 key 的全部相关代码，每次发布 skill 时从网站源码原样复制过来，对应网站源码的提交 `54ddb41`。

## key 去了哪里

1. 你填的 key 只存在你这台浏览器的 localStorage，键名 `bunbo_anthropic_key`（[lib/aikey.ts](lib/aikey.ts)）。云端草稿和本地版本历史里都没有它。
2. 点「生成」「调文风」、或者素材里有链接要抓正文时，浏览器把 key 放在请求头 `x-anthropic-key` 里，只发给文房自己的 `/api/generate`、`/api/restyle`、`/api/fetchurl`。
3. 服务端（[lib/ai.ts](lib/ai.ts)）在这一次请求里用它建一个 Anthropic 客户端，调用完就丢掉。不写数据库、不写文件、不打日志；报错信息里如果带出 `sk-ant-…`，先遮掉再返回。
4. 这三个接口的响应一律带 `Cache-Control: no-store`（[next.config.mjs](next.config.mjs)），中间的缓存不会留下内容。
5. 服务器上没有站长的 key，也不经过任何第三方网关。

## 自己核对

- 打开浏览器开发者工具的 Network 面板，点一次生成：请求只发往 `bunbo.shinkotera.com/api/…`，key 在请求头里，响应头里有 `no-store`。
- 删掉 key：卡片页左栏底部点「更换」，把输入框清空；或者清掉这个网站的站点数据。

## 不想交出 key

装本仓库的 Claude Code 版文房，在自己电脑上写稿、检查、出图，不需要 API key。

## 文件

- [`lib/aikey.ts`](lib/aikey.ts)
- [`lib/ai.ts`](lib/ai.ts)
- [`app/api/generate/route.ts`](app/api/generate/route.ts)
- [`app/api/restyle/route.ts`](app/api/restyle/route.ts)
- [`app/api/fetchurl/route.ts`](app/api/fetchurl/route.ts)
- [`next.config.mjs`](next.config.mjs)

---

## How the BUNBO website handles your API key

The cards page asks for your own Anthropic API key. This folder is every piece of website code that touches the key, copied verbatim from the site's source (commit `54ddb41`) each time the skill is published.

- The key lives only in your browser's localStorage (`bunbo_anthropic_key`). It is never part of cloud drafts or local version history.
- When you generate, it is sent in the `x-anthropic-key` header to BUNBO's own `/api/generate`, `/api/restyle` and `/api/fetchurl`, and nowhere else.
- The server builds an Anthropic client for that one request and drops it. Nothing is written to a database, a file or a log; any `sk-ant-…` in an error message is masked; responses carry `Cache-Control: no-store`.
- Prefer not to hand over a key at all? Use the Claude Code skill in this repository instead.
