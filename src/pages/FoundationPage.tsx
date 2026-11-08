import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import colors from '../../设计规范/color.tokens.json'

export function FoundationPage() {
  const [replay, setReplay] = useState(0)
  const reducedMotion = useReducedMotion()

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 md:px-12 md:py-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <p className="type-label-default" lang="en">AILIN YU</p>
        <p className="type-label-default text-muted-foreground">本地样式预览</p>
      </header>

      <section className="py-12 md:py-16" aria-labelledby="preview-title">
        <p className="type-display-section break-words text-brand" lang="en" aria-hidden="true">TYPE & FORM</p>
        <h1 id="preview-title" className="type-heading-h1 mt-6">从清晰的基础开始</h1>
        <p className="type-body-default mt-5 max-w-2xl text-muted-foreground">
          这里用于核对作品集的字体、色板和基础交互。首页构图、项目封面与花束转场将在这套基础上继续设计。
        </p>
      </section>

      <Tabs defaultValue="type" className="pb-12">
        <TabsList aria-label="样式预览类别" className="mb-8">
          <TabsTrigger value="type">字体与排版</TabsTrigger>
          <TabsTrigger value="color">品牌与冷灰</TabsTrigger>
          <TabsTrigger value="components">基础交互</TabsTrigger>
        </TabsList>

        <TabsContent value="type" className="space-y-10">
          <section className="grid gap-4 border-t pt-6 md:grid-cols-[12rem_1fr]">
            <p className="type-label-default text-muted-foreground">中文标题 · 宋体</p>
            <div><h2 className="type-heading-h2">把复杂问题，变成清晰体验。</h2></div>
          </section>
          <section className="grid gap-4 border-t pt-6 md:grid-cols-[12rem_1fr]">
            <p className="type-label-default text-muted-foreground">英文阅读 · Georgia</p>
            <div>
              <p className="type-heading-h3" lang="en">Thoughtful products, made tangible.</p>
              <p className="type-body-default mt-4 max-w-2xl" lang="en">Product thinking, experience design, and engineering. A clear path from understanding a problem to making something that works.</p>
            </div>
          </section>
          <section className="grid gap-4 border-t pt-6 md:grid-cols-[12rem_1fr]">
            <p className="type-label-default text-muted-foreground">中文正文 · 宋体</p>
            <div className="max-w-2xl">
              <p className="type-body-default">从用户问题出发，定义产品形态，设计人与 AI 的协作方式，并通过代码推动实现。正文以 16px 为基准，用清楚的层级和适当留白组织阅读。</p>
              <p className="type-body-small mt-4 text-muted-foreground">这行用于核对 14px 的辅助文字。案例长段正文与普通正文共用基准。</p>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="color" className="space-y-10">
          {[
            { title: '蓝紫品牌色', values: colors.brand },
            { title: '配套冷灰', values: colors.coolGray },
          ].map(({ title, values }) => (
            <section key={title} aria-label={title}>
              <h2 className="type-heading-h3 mb-6">{title}</h2>
              <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                {values.map(({ step, hex }) => (
                  <div key={step}>
                    <div className="h-16" style={{ backgroundColor: hex }} aria-hidden="true" />
                    <p className="type-label-default mt-2">{step.toString().padStart(2, '0')}</p>
                    <p className="type-body-small text-muted-foreground">{hex}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </TabsContent>

        <TabsContent value="components" className="space-y-10">
          <section className="border-t pt-6">
            <h2 className="type-heading-h3 mb-6">按钮与对话框</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Dialog>
                <DialogTrigger asChild><Button>查看说明 <ArrowUpRight aria-hidden="true" /></Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="type-heading-h4">基础样式已连接</DialogTitle>
                    <DialogDescription className="type-body-default">按钮、标签页和对话框使用同一套品牌色、冷灰和字体。关闭后，焦点会返回触发按钮。</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={() => setReplay((value) => value + 1)}><RotateCcw aria-hidden="true" />重放动效</Button>
              <Button disabled>禁用状态</Button>
            </div>
          </section>
          <section className="border-t pt-6" aria-label="动效预览">
            <h2 className="type-heading-h3 mb-6">轻微移动与回弹</h2>
            <div className="flex min-h-20 items-center pl-4">
              <motion.div
                key={replay}
                className="size-5 rounded-full bg-brand"
                aria-hidden="true"
                animate={replay > 0 && !reducedMotion ? { x: [0, 80, 0] } : { x: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              />
            </div>
            <p className="type-body-small text-muted-foreground">点击“重放动效”查看变化。开启系统“减少动态效果”时保留静态状态。</p>
          </section>
        </TabsContent>
      </Tabs>

      <footer className="type-body-small border-t pt-6 text-muted-foreground">本地制作中 · 字体与颜色从设计规范同步</footer>
    </main>
  )
}
