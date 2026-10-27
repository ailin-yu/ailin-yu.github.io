# 点阵文字交互复用说明

确认日期：2026-10-27。用户已确认将当前点阵文字、鼠标挤开与回弹效果用于正式作品集网站。

正式网站沿用这套交互机制，文案、字号、字体和配色作为组件参数。当前 coming soon 页面是可运行的效果基线。

## 已确认的表现

- 字形由规则排列的圆点构成，保留宋体的衬线与笔画结构。
- 标题为一行小写 coming soon，水平、垂直居中；当前桌面文字宽度约为视口的 55%，依据蓝框截图调整。
- 鼠标靠近时，附近的点沿远离鼠标的方向向外滑开，产生局部被挤开的空隙。
- 鼠标停留时保持让位状态，移开后以带阻尼的弹簧运动回到各自原位。
- 字形整体保持稳定，互动发生在鼠标附近；界面没有暂停按钮。

## 当前视觉基线

| 项目 | 参数 |
| --- | --- |
| 字体 | Songti SC → STSong → SimSun → Noto Serif CJK SC → serif，字重 400 |
| 字号 | min(视口宽度 × 0.108, 视口高度 × 0.28)，超宽时按左右各 24px 留白缩小 |
| 点阵颜色 | #636AE7，不透明 |
| 背景 | #DDE1FA，80% 不透明度，白色底层；rgba(221,225,250,0.8) |
| Canvas | 背景透明，每帧 clearRect；背景由容器绘制，避免透明度叠加 |
| 点间距 step | max(1.35, min(2.15, 字号 / 45)) CSS px |
| 点半径 | step × 0.31 |
| 字形取样 | 离屏 Canvas 绘字，alpha > 105 的规则网格位置生成圆点 |

当前使用系统字体；其他系统会按字体栈回退。正式站若要求跨平台字形一致，应使用确定的同一字体资源，字体就绪后重新取样。

## 运动参数

每个粒子保存原位 bx/by、当前位置 x/y、速度 vx/vy。距离从鼠标到粒子的原位计算。

| 参数 | 基线 |
| --- | --- |
| 影响半径 R | max(45, min(100, 字号 × 1.05)) CSS px |
| 距离衰减 | falloff = 1 - distance / R，仅 distance < R 时生效 |
| 向外位移 | R × 1.12 × falloff²，沿原位远离鼠标的方向 |
| 目标位置 | 原位 + 向外位移；移开后恢复为原位 |
| 弹簧强度 | 0.115 |
| 速度阻尼 | 0.73^dt |
| 帧时间 dt | min(帧间隔 / 16.667ms, 2) |
| 收敛阈值 | 最大位移和速度合计 ≤ 0.025 时精确归位并停止循环 |
| 像素比 | min(devicePixelRatio, 2) |

横纵轴分别更新：velocity = (velocity + (target - position) × 0.115 × dt) × 0.73^dt；position += velocity × dt。

## 正式网站接入

1. 将字形取样、粒子排斥、弹簧回弹与绘制封装为独立 DotText 组件，先保留上述基线参数。
2. 容器内使用相对坐标：鼠标 clientX/clientY 减去容器 getBoundingClientRect() 的 left/top。用容器尺寸与 ResizeObserver 适配正式标题区域。
3. 字体就绪、文案变化或容器大小变化时重新生成原位，保留单行约束与宽度测量。
4. 保留真实语义标题，Canvas 设 aria-hidden。无 Canvas 时显示普通宋体标题。
5. prefers-reduced-motion 时显示静态点阵；触屏保留静态效果并允许正常滚动。指针离开、页面失焦或隐藏时复位。
6. 只在互动与回弹阶段运行动画，静止时停止。组件卸载时取消 RAF、移除监听并断开 ResizeObserver。
7. 可配置项：text、fontFamily、fontSize、color、background、dotSpacing、dotRadius、interactionRadius、repulsion、spring、damping。

## 接入验收

- 标题保持一行，字形清楚，不超出容器。
- 鼠标划过、停留、快速往返时局部滑开；移开后完整回到原字形。
- 互动前后背景颜色一致。
- 静止、后台标签页、减少动态效果设置及触屏浏览按接入约定工作。

## 可复用原版

[已确认版本的完整实现](https://github.com/ailin-yu/ailin-yu.github.io/blob/22daaa0eb8e2063b435c823009cc726d52fdeaf9/index.html)。固定版本链接在正式首页替换后仍可找回效果。

项目内参考副本：作品集/交互效果/dot-text/reference.html，可直接用浏览器打开。
