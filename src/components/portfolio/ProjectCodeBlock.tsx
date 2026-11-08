import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function ProjectCodeBlock({ code, label }: { code: string; label: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = window.setTimeout(() => setStatus('idle'), 2400)
    return () => window.clearTimeout(timer)
  }, [status])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }

  return <div className="project-code-block">
    <div className="project-code-toolbar">
      <span>{label}</span>
      <button type="button" onClick={copy} aria-label="复制命令">
        {status === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {status === 'copied' ? '已复制' : '复制'}
      </button>
    </div>
    <pre tabIndex={0} aria-label={label}><code>{code}</code></pre>
    <span className="sr-only" role="status">{status === 'copied' ? '命令已复制' : status === 'error' ? '复制失败，请手动选择并复制命令。' : ''}</span>
  </div>
}
