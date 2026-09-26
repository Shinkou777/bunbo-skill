import { NextResponse } from "next/server";
import { hasKey } from "@/lib/ai";
import { owner } from "@/lib/owner";
import { fetchUrl } from "@/lib/engine/fetchurl";

export const maxDuration = 30;

// 抓取逻辑在 lib/engine/fetchurl.ts
export async function POST(req: Request) {
  // 抓回来的正文只喂给生成；带着 Anthropic key 的访客或站长才能用，免得被当成公开代理
  if (!hasKey(req) && !(await owner())) {
    return NextResponse.json({ error: "要先填你自己的 Anthropic API key", code: "NO_KEY" }, { status: 401 });
  }
  const { url } = await req.json();
  const r = await fetchUrl(url);
  return NextResponse.json(r.body, { status: r.status });
}
