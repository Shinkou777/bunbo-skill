#!/bin/bash
# 文房 BUNBO skill 安装（macOS / Linux）
# 把 skills/bunbo 链到 ~/.claude/skills/bunbo，装 puppeteer-core，检查 Chrome，出一次示例图当冒烟测试。
# 之后 git pull 就是更新，skill 直接跟着仓库走。
set -euo pipefail

REPO="$(cd "$(dirname "$0")" && pwd)"
SKILL="$REPO/skills/bunbo"
DEST="$HOME/.claude/skills/bunbo"

echo "[1/4] 检查 Node、Chrome"
command -v node >/dev/null 2>&1 || { echo "缺 Node 20+（brew install node）" >&2; exit 1; }
CHROME="${CHROME_PATH:-}"
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "/Applications/Chromium.app/Contents/MacOS/Chromium" "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" /usr/bin/google-chrome /usr/bin/google-chrome-stable /usr/bin/chromium /usr/bin/chromium-browser; do
  [ -z "$CHROME" ] && [ -x "$c" ] && CHROME="$c"
done
[ -n "$CHROME" ] || { echo "缺 Chrome：装 Google Chrome，或设 CHROME_PATH" >&2; exit 1; }

echo "[2/4] 安装 puppeteer-core"
npm install --prefix "$SKILL" --no-fund --no-audit --silent

echo "[3/4] 链接 skill → $DEST"
mkdir -p "$HOME/.claude/skills"
if [ -e "$DEST" ] && [ ! -L "$DEST" ]; then
  echo "$DEST 已存在且不是链接，先挪走再装" >&2; exit 1
fi
ln -sfn "$SKILL" "$DEST"

echo "[4/4] 冒烟测试：示例稿检查 + 出图"
TMP="$(mktemp -d)"
node "$SKILL/bin/bunbo.mjs" check "$SKILL/samples/sample.json"
node "$SKILL/bin/bunbo.mjs" render "$SKILL/samples/sample.json" "$TMP" >/dev/null
echo "示例图在 $TMP"

cat <<TIP

装好了。在 Claude Code 里敲：
  /bunbo 你的素材，要求

成品放在 ~/Desktop/文房/。
TIP
