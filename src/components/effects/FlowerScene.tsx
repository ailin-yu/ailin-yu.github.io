import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Color, Group, Mesh, ShaderMaterial, Vector3 } from 'three'

function Plant({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF('/flowers/living-plant.glb')
  const { viewport, gl, invalidate } = useThree()
  const group = useRef<Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const data = useMemo(() => {
    const model = scene.clone(true)
    const box = new Box3().setFromObject(model)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())
    const color = new Color(getComputedStyle(document.documentElement).getPropertyValue('--brand').trim())
    const materials: ShaderMaterial[] = []
    model.traverse(object => {
      if (!(object instanceof Mesh)) return
      const boost = Number(object.userData.inkBoost ?? (object.name.includes('center') ? .38 : object.name.includes('foliage') ? .12 : 0))
      const material = new ShaderMaterial({
        uniforms: { uInk: { value: color }, uPitch: { value: 3.2 * gl.getPixelRatio() }, uBoost: { value: boost } },
        vertexShader: `varying vec3 vN; varying vec3 vP;
          void main(){ vec4 world=modelMatrix*vec4(position,1.);vP=world.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*world; }`,
        fragmentShader: `uniform vec3 uInk;uniform float uPitch;uniform float uBoost;varying vec3 vN;varying vec3 vP;
          void main(){vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;
          float light=clamp(dot(n,normalize(vec3(-.45,.66,.60)))*.8+.20,0.,1.);
          float shade=clamp(1.-smoothstep(.18,.84,light)+uBoost,0.,1.);
          float radius=pow(shade,.76)*.70;vec2 cell=fract(gl_FragCoord.xy/uPitch)-.5;
          float dots=1.-smoothstep(radius-.035,radius+.035,length(cell));
          float rim=1.-smoothstep(.04,.11,abs(dot(n,normalize(cameraPosition-vP))));
          gl_FragColor=vec4(mix(vec3(1.),uInk,max(dots,rim*.70)),1.);
          #include <colorspace_fragment>
          }`,
        side: 2,
      })
      object.material = material
      materials.push(material)
    })
    model.position.sub(center)
    return { model, size, materials }
  }, [scene, gl])
  const fit = Math.min(viewport.width / (data.size.x * 1.12), viewport.height / (data.size.y * 1.12))
  useEffect(() => {
    onReady()
    const move = (e: PointerEvent) => { pointer.current = { x: e.clientX / window.innerWidth - .5, y: e.clientY / window.innerHeight - .5 }; invalidate() }
    const reset = () => { pointer.current = { x: 0, y: 0 }; invalidate() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', reset)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('blur', reset); data.materials.forEach(m => m.dispose()) }
  }, [data, invalidate, onReady])
  useFrame(() => {
    if (!group.current) return
    const ry = pointer.current.x * .20, rx = pointer.current.y * .07
    group.current.rotation.y += (ry - group.current.rotation.y) * .08
    group.current.rotation.x += (rx - group.current.rotation.x) * .08
    if (Math.abs(ry - group.current.rotation.y) + Math.abs(rx - group.current.rotation.x) > .0001) invalidate()
  })
  return <group ref={group} scale={fit}><primitive object={data.model} /></group>
}

export default function FlowerScene({ onReady }: { onReady: () => void }) {
  return <Canvas orthographic frameloop="demand" resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 10], zoom: 100, near: .1, far: 30 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}><Plant onReady={onReady} /></Canvas>
}
