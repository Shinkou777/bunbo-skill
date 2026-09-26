import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import type { Runner } from "@/lib/engine/types";

// 卡片生成用访客自己的 Anthropic API key：前端放在请求头 x-anthropic-key 里带来，
// 只在这一次请求里建 provider，不落盘、不写日志，服务器上没有任何 key。
export const MODEL_ID = "claude-sonnet-5";

const KEY_RE = /^sk-ant-[A-Za-z0-9_-]{20,}$/;

export function keyFrom(req: Request): string {
  return (req.headers.get("x-anthropic-key") ?? "").trim();
}

export function hasKey(req: Request): boolean {
  return KEY_RE.test(keyFrom(req));
}

export type Model = ReturnType<ReturnType<typeof createAnthropic>>;

export function modelFor(req: Request): Model | NextResponse {
  const key = keyFrom(req);
  if (!KEY_RE.test(key)) {
    return NextResponse.json(
      { error: "要先填你自己的 Anthropic API key（左栏底部），sk-ant- 开头的那串", code: "NO_KEY" },
      { status: 401 }
    );
  }
  return createAnthropic({ apiKey: key })(MODEL_ID);
}

// 把模型包成引擎要的 Runner：有图走多模态 messages，纯文字走 prompt
export function sdkRunner(model: Model): Runner {
  return async ({ schema, system, prompt, images }) => {
    const input = images?.length
      ? {
          messages: [
            {
              role: "user" as const,
              content: [
                ...images.map((i) => ({ type: "image" as const, image: i })),
                { type: "text" as const, text: prompt },
              ],
            },
          ],
        }
      : { prompt };
    const { object } = await generateObject({ model, schema, system, ...input });
    return object;
  };
}

// 报错文字里万一带出 key，先遮掉再回给前端
export function scrub(s: string): string {
  return s.replace(/sk-ant-[A-Za-z0-9_-]+/g, "sk-ant-***");
}

// 把 Anthropic 的报错翻成人话；只取状态码和简短说明，不回显请求内容
export function aiError(e: unknown): NextResponse {
  const err = e as { statusCode?: number; message?: string; cause?: { statusCode?: number } } | undefined;
  const status = err?.statusCode ?? err?.cause?.statusCode;
  if (status === 401 || status === 403) {
    return NextResponse.json({ error: "Anthropic 拒绝了这个 key（错误或已作废），请换一个", code: "BAD_KEY" }, { status: 401 });
  }
  if (status === 429) {
    return NextResponse.json({ error: "这个 key 的额度或频率到上限了，稍后再试", code: "RATE" }, { status: 429 });
  }
  if (status === 529 || status === 503) {
    return NextResponse.json({ error: "Anthropic 那边暂时过载，等一会儿再点生成", code: "BUSY" }, { status: 503 });
  }
  const msg = err?.message ? scrub(String(err.message)).slice(0, 300) : "生成失败";
  return NextResponse.json({ error: msg }, { status: 500 });
}
