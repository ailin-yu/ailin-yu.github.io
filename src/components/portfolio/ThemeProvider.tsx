import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'light', toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  const [manual, setManual] = useState(() => { try { return ['light', 'dark'].includes(localStorage.getItem('portfolio-theme') || '') } catch { return false } })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const color = getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  }, [theme])
  useEffect(() => {
    if (manual) return
    const system = matchMedia('(prefers-color-scheme: dark)')
    const update = () => { const next = system.matches ? 'dark' : 'light'; document.documentElement.dataset.theme = next; setTheme(next) }
    system.addEventListener('change', update)
    return () => system.removeEventListener('change', update)
  }, [manual])
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== 'portfolio-theme') return
      const value = event.newValue
      const next = value === 'light' || value === 'dark' ? value : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      document.documentElement.dataset.theme = next
      setTheme(next); setManual(value === 'light' || value === 'dark')
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    // Apply before canvas effects redraw from their newly resolved semantic colors.
    document.documentElement.dataset.theme = next
    setTheme(next); setManual(true)
    try { localStorage.setItem('portfolio-theme', next) } catch { /* Theme still works when storage is unavailable. */ }
  }
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return <button className="theme-toggle" type="button" role="switch" aria-checked={theme === 'dark'} aria-label="深色模式" title={theme === 'dark' ? '切换浅色模式' : '切换深色模式'} onClick={toggle}>{theme === 'dark' ? <Moon size={17} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}</button>
}
