import { NextResponse } from "next/server";
import { modelFor, aiError, sdkRunner } from "@/lib/ai";
import { runRestyle } from "@/lib/engine/restyle";

export const maxDuration = 120;

// 约束全在 lib/engine/restyle.ts，这里只负责拿访客的 key 建模型
export async function POST(req: Request) {
  const model = modelFor(req);
  if (model instanceof NextResponse) return model;
  try {
    const r = await runRestyle(sdkRunner(model), await req.json());
    return NextResponse.json(r.body, { status: r.status });
  } catch (e: unknown) {
    return aiError(e);
  }
}
