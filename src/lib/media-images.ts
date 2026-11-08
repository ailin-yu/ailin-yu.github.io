import generated from '@/content/media-images.generated.json'

type ImageAsset = { width: number; height: number; preview: string; variants: { src: string; width: number }[] }
const images: Record<string, ImageAsset> = generated
export const imageAsset = (src: string) => images[src]
export const imageSrcSet = (src: string) => imageAsset(src)?.variants.map(v => `${v.src} ${v.width}w`).join(', ')
export const mobileImage = (src: string) => imageAsset(src)?.variants.at(-1)?.src || src

