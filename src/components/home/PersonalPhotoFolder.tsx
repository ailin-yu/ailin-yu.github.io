import { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PaperCutout } from '@/components/home/PaperCutout'
import { FolderStack } from '@/components/home/FolderStack'
import { AboutFolder } from '@/components/home/AboutFolder'

const photographs = [
  { id: 'backstage', title: '活动现场的我', caption: '活动现场' },
  { id: 'hiking', title: '徒步途中的我', caption: '徒步途中' },
  { id: 'xuegao', title: '这是雪糕', caption: '雪糕' },
] as const
export default function PersonalPhotoFolder() {
  const [photo, setPhoto] = useState<(typeof photographs)[number] | null>(null)
  const photoTrigger = useRef<HTMLButtonElement | null>(null)
  return <>
    <AboutFolder><FolderStack className="about-folder" title="About me" tab="Ailin Yu" caption="徒步 · 活动现场 · 雪糕"
      sheets={['hiking','backstage','xuegao'].map(id=>{ const item=photographs.find(photo=>photo.id===id)!; return {id:item.id,label:item.caption,alt:item.title,content:<PaperCutout id={item.id} title={item.title}/>}})}
      onSelect={(id,trigger)=>{ const item=photographs.find(photo=>photo.id===id); if(item){photoTrigger.current=trigger;setPhoto(item)} }} /></AboutFolder>
    <Dialog open={!!photo} onOpenChange={open => { if (!open) setPhoto(null) }}><DialogContent className="home-photo-dialog" onCloseAutoFocus={event => { event.preventDefault(); photoTrigger.current?.focus() }}><DialogHeader><DialogTitle className="type-heading-h4">{photo?.title}</DialogTitle><DialogDescription>生活里的一个小片段。</DialogDescription></DialogHeader>{photo && <img src={`/home/photos/${photo.id}.webp`} alt={photo.title} />}</DialogContent></Dialog>
  </>
}
