<!-- 生成文件：来自文房网站源码（lib/voice.ts、lib/engine/schemas.ts、lib/styles.ts…），别手改 -->

# 设计取值

七个维度互相独立，随便组合。拿不准就从「现成预设」里挑一套，按素材选：讲器物走规格书，讲观察走社论，讲情绪走刊物。

## layout 版式

- `editorial` 社论：quiet editorial spread, generous white space
- `zine` 刊物：printed zine, heavy grotesque masthead, justified body, hard-edged color blocks
- `spec` 规格书：CMF spec sheet, material swatches, mono technical labels, drafting rules

## style 配色

- `lemon` 柠檬
- `sozhi` 素纸
- `yeyan` 夜岩
- `baici` 白瓷
- `violet` 紫毫
- `mocha` 抹茶
- `contour` 等高线
- `stranding` 搁浅
- `industrial` 工业
- `cmf` 赤铜

## finish 材质

- `none` 净面：flat matte surface
- `grain` 纸纹：uncoated paper tooth, fine grain
- `halftone` 网点：offset halftone print texture
- `brushed` 拉丝：brushed anodized metal surface
- `cloth` 布纹：book cloth weave, bound cover

## binding 装帧（只占页边，不碰正文）

- `none` 光边
- `dogear` 折角
- `edge` 边线
- `tab` 书口
- `staple` 订钉
- `spine` 书脊
- `head` 天头

## cover 封面

- `auto` 跟版式：用当前版式自带的封面
- `masthead` 刊头：刊头锁定块 + 渐层 + 页位刻度
- `band` 横带：标题反白压在通栏色带上
- `vertical` 竖排：中文标题竖排靠右，外文横排在左下
- `slab` 大字：标题撑满整版，其余压到页脚
- `card` 索引：内框 + 等宽档案条 + 划线
- `editorial` 社论：细线页眉页脚，内容居中
- `spec` 规格：技术标签 + 材质色标条

## body 正文模板

- `auto` 跟版式：用当前版式自带的正文设计
- `book` 书页：两端对齐 + 首行缩进 + 色带编号章节 + 反白强调，刊头锁定块页眉
- `column` 专栏：左对齐不缩进 + 朴素章节标题 + 荧光强调，细线页眉页脚，内容居中
- `spec` 规格：等宽标签页眉 + 方框编号章节 + 下划强调 + 底色块金句
- `plain` 净页：去掉全部页眉页脚，正文吃满整版；编号章节带下划线。一页装得下最多的字

## mark 页位记号

- `auto` 跟版式
- `rule` 刻度
- `dots` 圆点
- `bar` 进度条
- `none` 无

## font 封面标题字体

- `hei` 黑体："PingFang SC", "Hiragino Sans GB", sans-serif
- `song` 宋体："Songti SC", "STSongti-SC", "Noto Serif SC", serif
- `kai` 楷体："Kaiti SC", "STKaiti", serif
- `yuan` 圆体："Yuanti SC", "Yuanti TC", "PingFang SC", sans-serif

## 现成预设

| id | 名字 | layout | style | finish | binding | cover |
|---|---|---|---|---|---|---|
| zine-lemon | 刊物·柠檬 | zine | lemon | none | dogear | masthead |
| zine-violet | 刊物·紫毫 | zine | violet | grain | tab | band |
| zine-ink | 刊物·白瓷 | zine | baici | halftone | edge | slab |
| zine-night | 刊物·夜岩 | zine | yeyan | none | staple | vertical |
| spec-copper | 规格书·赤铜 | spec | cmf | brushed | dogear | spec |
| spec-industrial | 规格书·工业 | spec | industrial | brushed | head | card |
| spec-contour | 规格书·等高线 | spec | contour | grain | dogear | spec |
| ed-paper | 社论·素纸 | editorial | sozhi | grain | none | editorial |
| ed-mocha | 社论·抹茶 | editorial | mocha | cloth | spine | card |
| ed-stranding | 社论·搁浅 | editorial | stranding | none | edge | slab |

## 尾页图标（outro.items[].icon）

`book` `translate` `globe` `device` `users` `star` `calendar` `pen` `mic` `box` `chart` `key` `target` `clock` `mail` `play` `folder` `chat` `infinity` `seal` `none`

## 原文出处（xhs.cite.kind）

- `off` 不加：正文末尾不出现引用
- `src` 原文：有信息源，给原文链接
- `via` 转载译文：没有原始信息源，给译文或转载来源
- `none` 来源不详：固定写「素材源自网络或社交媒体」
