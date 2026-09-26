#!/usr/bin/env node
// 文房 BUNBO skill 安装（macOS / Linux / Windows）
//   node install.mjs
// 把 skills/bunbo 链到 ~/.claude/skills/bunbo（Windows 用目录联接，不要管理员权限），
// 装 puppeteer-core，出一次示例图当冒烟测试。之后 git pull 就是更新。
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, mkdtempSync, rmdirSync, symlinkSync, unlinkSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.join(REPO, "skills", "bunbo");
const DEST = path.join(os.homedir(), ".claude", "skills", "bunbo");
const WIN = process.platform === "win32";
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

console.log("[1/4] 检查 Node");
const major = Number(process.versions.node.split(".")[0]);
if (major < 20) fail(`Node 版本是 ${process.versions.node}，需要 20 以上`);

console.log("[2/4] 安装 puppeteer-core");
execFileSync(WIN ? "npm.cmd" : "npm", ["install", "--prefix", SKILL, "--no-fund", "--no-audit", "--silent"], {
  stdio: "inherit",
  shell: WIN,
});

console.log(`[3/4] 链接 skill → ${DEST}`);
mkdirSync(path.dirname(DEST), { recursive: true });
if (existsSync(DEST) || isLink(DEST)) {
  if (!isLink(DEST)) fail(`${DEST} 已存在且不是链接，先挪走再装`);
  // 只去掉链接本身；Windows 的目录联接要用 rmdir
  try {
    unlinkSync(DEST);
  } catch {
    rmdirSync(DEST);
  }
}
symlinkSync(SKILL, DEST, WIN ? "junction" : "dir");

console.log("[4/4] 冒烟测试：示例稿检查 + 出图");
const cli = path.join(SKILL, "bin", "bunbo.mjs");
const sample = path.join(SKILL, "samples", "sample.json");
execFileSync(process.execPath, [cli, "check", sample], { stdio: "inherit" });
const tmp = mkdtempSync(path.join(os.tmpdir(), "bunbo-"));
execFileSync(process.execPath, [cli, "render", sample, tmp], { stdio: "ignore" });
console.log(`示例图在 ${tmp}`);

console.log(`
装好了。在 Claude Code 里敲：
  /bunbo 你的素材，要求

成品放在桌面的「文房」文件夹里。`);

function isLink(p) {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}
