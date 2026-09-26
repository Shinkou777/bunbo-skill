// 访客自己的 Anthropic API key，在浏览器这一侧的全部处理都在这个文件里。
//
// - 只存在这台浏览器的 localStorage（键名 bunbo_anthropic_key），不进云端草稿、不进本地版本历史
// - 生成、调文风、抓链接时放进请求头 x-anthropic-key，发给文房自己的 /api/*，由服务端转给 Anthropic
//   （服务端怎么用它见 lib/ai.ts：每次请求现建、不落盘、不写日志、报错里遮掉）
// - 清空输入框就是删掉

export const KEY_RE = /^sk-ant-[A-Za-z0-9_-]{20,}$/;

const STORE = "bunbo_anthropic_key";

export function loadKey(): string {
  try {
    return localStorage.getItem(STORE) ?? "";
  } catch {
    return "";
  }
}

export function storeKey(key: string): void {
  try {
    if (key) localStorage.setItem(STORE, key);
    else localStorage.removeItem(STORE);
  } catch {}
}

export function keyHeaders(key: string): Record<string, string> {
  return { "Content-Type": "application/json", "x-anthropic-key": key };
}
