#!/bin/bash
# 文房 BUNBO skill 安装（macOS / Linux）。实际步骤在 install.mjs，Windows 直接跑 node install.mjs。
set -euo pipefail
command -v node >/dev/null 2>&1 || { echo "缺 Node 20+（brew install node）" >&2; exit 1; }
exec node "$(cd "$(dirname "$0")" && pwd)/install.mjs"
