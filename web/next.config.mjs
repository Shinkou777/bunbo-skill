/** @type {import('next').NextConfig} */
const nextConfig = {
  // 见出し组版、言の葉雲 是单文件应用，原样放在 public/tools/ 下，由 /title、/kotonoha 两页装进框里，页顶带文房导航
  async headers() {
    return [
      // 不许别的网站内嵌（shinkolab-ops/docs/CRAWL-SEO.md 第五节）；/title、/kotonoha 装的是本站 /tools/ 下的页面，'self' 就够
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      { source: "/tools/:tool(title|kotonoha)/index.html", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
      // 带访客 key 的三个接口：响应一律不缓存
      { source: "/api/:route(generate|restyle|fetchurl)", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};
export default nextConfig;
