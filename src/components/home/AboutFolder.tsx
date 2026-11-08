import type { ReactNode } from 'react'
import '@/styles/about-folder.css'

/** A small art-direction wrapper; FolderStack keeps all of its original behavior. */
export function AboutFolder({ children }: { children: ReactNode }) {
  return <div className="home-about-stage home-about-refined">
    {children}
    <div className="home-about-annotation" aria-hidden="true">
      <span>工作之外</span>
      <svg viewBox="0 0 128 92" fill="none">
        <path d="M17 13C1 39 15 69 51 72C73 75 93 68 109 54M96 55L110 52L106 66" />
      </svg>
    </div>
  </div>
}
