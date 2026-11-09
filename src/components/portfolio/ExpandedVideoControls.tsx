import { useEffect, useState, type RefObject } from 'react'
import { Pause, Play } from 'lucide-react'

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

/** HTML controls stay outside the scaled video, so no native player can take
 * over pinch/pan or move its controls out of reach when the image is enlarged. */
export function ExpandedVideoControls({ videoRef }: { videoRef: RefObject<HTMLVideoElement | null> }) {
  const [state, setState] = useState({ paused: true, time: 0, duration: 0 })
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const sync = () => setState({ paused: video.paused, time: video.currentTime || 0, duration: Number.isFinite(video.duration) ? video.duration : 0 })
    const events = ['play', 'pause', 'timeupdate', 'loadedmetadata', 'durationchange', 'ended', 'error']
    for (const event of events) video.addEventListener(event, sync)
    sync()
    return () => { for (const event of events) video.removeEventListener(event, sync) }
  }, [videoRef])
  return <div className="case-image-video-controls" data-media-controls role="group" aria-label="演示播放控制">
    <button type="button" aria-label={state.paused ? '播放演示' : '暂停演示'} onClick={() => {
      const video = videoRef.current
      if (!video) return
      if (video.paused) void video.play().catch(() => setState(value => ({ ...value, paused: true })))
      else video.pause()
    }}>{state.paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}</button>
    <input type="range" aria-label="演示播放进度" min="0" max={state.duration || 1} step="0.1" value={Math.min(state.time, state.duration || 1)} disabled={!state.duration}
      onChange={event => {
        const time = Number(event.currentTarget.value)
        if (videoRef.current) videoRef.current.currentTime = time
        setState(value => ({ ...value, time }))
      }} />
    <span aria-hidden="true">{clock(state.time)} / {clock(state.duration)}</span>
  </div>
}
