/** @type {import('next').NextConfig} */
const nextConfig = {
  // 见出し组版、言の葉雲 是单文件应用，原样放在 public/tools/ 下，由 /title、/kotonoha 两页装进框里，页顶带文房导航
  async headers() {
    return [
      { source: "/tools/:tool(title|kotonoha)/index.html", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
      // 带访客 key 的三个接口：响应一律不缓存
      { source: "/api/:route(generate|restyle|fetchurl)", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};
export default nextConfig;
