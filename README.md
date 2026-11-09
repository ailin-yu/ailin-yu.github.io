# 余艾琳作品集

React + TypeScript + Vite 静态网站，目标仓库为 `ailin-yu/ailin-yu.github.io`。首页与案例使用 hash 路由，刷新详情无需服务器重写。Vite `base` 为 `/`。

## 本地开发

使用 Node.js 24 与 pnpm 11.25.0：

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm preview
```

`pnpm build` 会校验设计 token、画廊行为、TypeScript 和发布资源，输出到 `dist/`。设计数值主稿为 `设计规范/`，生成的 `src/styles/tokens.generated.css` 不手动修改。

## 准备上传 GitHub

```sh
pnpm prepare:deploy
```

生成 `.local/deploy/repository/`，这是按明确清单导出的 GitHub 源码。包含 `src/`、网页资源 `public/`、设计 token、必要脚本、锁文件与 Pages 工作流。不会复制本地原材料、Spec、审阅记录、缓存、依赖或构建产物。导出不提交、不推送、不部署。

已有远端仓库时，先在单独目录克隆，再将导出目录的内容（包括 `.github/` 等隐藏文件）合并到该克隆中，保留 `.git/` 与远端提交历史。不要把整个「2026工作」工作区上传，也不要把源码文件夹嵌套放到仓库下一层。核对差异后再提交和推送。

## 发布到 GitHub Pages

1. GitHub 仓库 Settings → Pages → Source 选择 GitHub Actions。
2. 源码上传后，在 Actions 中选择 `Publish portfolio to GitHub Pages`，点击 Run workflow。
3. 工作流检查并构建，仅上传 `dist/`，随后发布到 `https://ailin-yu.github.io/`。

工作流只有手动触发入口，上传源码不会自动覆盖当前站点。当前 `index.html` 保留 `noindex, nofollow` 设置，上线后网站可访问，但不主动进入搜索索引；需要被搜索收录时再调整。

## 资源与性能

- 动图使用 H.264 MP4，滚动进入视口才请求，离屏或标签进入后台暂停；保留循环、点击放大和减少动态静帧。
- 完整项目视频保留完整时序和声音，使用网页转码与 faststart，不用短片替代完整演示。
- 首页封面按显示尺寸优化，PNG 转换保留透明通道；案例图片继续懒加载、异步解码。
- 图片点击直接展开，展开后支持图片内双指缩放（1–5 倍）与拖动，点击周围空白或 Escape 还原；无弹窗面板、工具栏和角落图标，鼠标为手形。手机各项目多图区域统一单列，目录入口在右侧留白内，页面隐藏滚动条外观并保留滑动。
- 展开演示视频时，整个画面接收网页手势，播放／暂停和进度条独立固定在底部；实时校正触点，避免抬指事件中断后无法继续平移。
- 详情图片带内嵌低清预览，手机按需加载 640／960px WebP，桌面与放大查看保留清晰源图。动图在视频真正播放前始终显示独立静帧；手机双图区域采用单列。
- `scripts/prepare-responsive-media.py` 使用 Pillow（SVG 可配合 @resvg/resvg-js）重建手机副本，必须指定资料库归档目录；发布检查验证全部派生图片存在。
- 手机完整项目视频显示封面、点击后播放；首页 ASCII 背景以最高 12fps 流动，离开首屏或切入后台时暂停，减少动态偏好下静态显示；离屏花朵不请求遮罩。
- 中文使用本地宋体，并提供自托管 Noto Serif SC 400／700 子集后备（SIL OFL 1.1，授权随字体发布）；首页和案例字符按需下载。修改中文后若发布检查提示缺字，使用 `fonttools[woff]` 运行 `python scripts/prepare-chinese-fonts.py /path/to/NotoSerifSC-wght.ttf` 重新生成。源字体与同目录 OFL.txt 由本地资料库管理。
- 案例页面按路由拆分，仅在访问或导航意图出现时加载。
- `pnpm release:check` 检查资源引用、禁止原始 GIF / HEIC / Blender 等进入发布目录，并限制总产物 200 MiB、单文件 50 MiB。

本机所有被处理的原件与 SHA-256 清单保存在「2026工作/资料库/作品集部署整理/2026-11-08/」。历史参考文件继续由本地文档管理，不作为公开网站资源。

部署说明参考：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
