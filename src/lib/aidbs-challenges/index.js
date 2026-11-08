import { HL } from '../data-agent-strategies/kernel.js'

const {Cam,fit,proj,facing,rrect,rings,ringAt,prism,poly,open,mk,solid,put,
  tween,tset,tval,tdone,register,disposer}=HL

// Both figures use the same native geometry as the saved SVGs and the same
// sleeping/reduced-motion-aware Hairline clock as Data Agent's strategy figures.
export function mountChallengeFigure(stage,kind){
  HL.inject(document)
  stage.dataset.hairline=`aidbs-${kind}`
  const svg=mk('svg',{viewBox:'0 0 400 320','aria-hidden':'true'},stage)
  const C=Cam(45,.5,kind==='silos'?1.78:1.72)
  fit(C,kind==='silos'?[[0,0,0],[123,111,0],[0,0,68],[123,111,68]]:[[0,0,0],[174,54,0],[0,0,65],[174,54,65]],200,161)
  C.oy-=kind==='silos'?44:9
  const P=proj(C),front=facing(C),g=mk('g',{},svg),bag=disposer()
  const path=(parent,d,cls='sil')=>mk('path',{d,class:cls},parent)
  const box=(parent,x,y,w,h,z0,z1,r=4)=>{
    const node=solid(parent)
    put(node,prism(P,front,...rings(x,y,x+w,y+h,r,1),z0,z1))
    return node
  }
  const panel=(parent,x,y,w,h,z)=>{
    const shape=rrect(0,0,w,h,4,8),f=(u,v)=>P(x+u,y,z+v)
    path(parent,poly(shape.map(q=>P(x+q.u,y-1.5,z+q.v))),'lo')
    const face=path(parent,poly(shape.map(q=>f(q.u,q.v))))
    return {f,face}
  }
  let active=-1,select,draw,settled,hit
  if(kind==='silos'){
    const modules=[{x:0,y:56,type:'data'},{x:59,y:0,type:'layers'},{x:74,y:68,type:'analysis'}]
      .sort((a,b)=>(a.x+a.y)-(b.x+b.y))
      .map((m,index)=>{
        box(g,m.x,m.y,47,40,0,7,5)
        const body=mk('g',{'data-part':`module-${index}`},g)
        if(m.type==='data'){
          const ring=Array.from({length:81},(_,i)=>{const a=i*2*Math.PI/80;return {u:m.x+23+14*Math.cos(a),v:m.y+19+14*Math.sin(a),nu:Math.cos(a),nv:Math.sin(a)}})
          const inner=ring.map(q=>({...q,u:m.x+23+(q.u-m.x-23)*.92,v:m.y+19+(q.v-m.y-19)*.92}))
          const shape=prism(P,front,ring,inner,9,41)
          path(body,shape.sil);path(body,shape.crease,'nf lo');path(body,open(ringAt(P,ring,41)),'nf lo')
        }else if(m.type==='layers'){
          for(const z of [11,21,31])box(body,m.x+7,m.y+6,33,28,z,z+5,4)
        }else{
          const {f}=panel(body,m.x+5,m.y+24,37,43,8)
          for(let k=0;k<3;k++)path(body,poly(rrect(7+k*9,8,12+k*9,[20,32,25][k],1.5,5).map(q=>f(q.u,q.v))),'nf lo')
        }
        return {...m,body,center:P(m.x+23,m.y+20,22),lift:tween(0),last:NaN}
      })
    select=index=>{
      if(index===active)return
      active=index;stage.dataset.active=String(index)
      const now=performance.now()
      modules.forEach((m,i)=>{
        tset(m.lift,i===index?12:0,now,Math.abs(i-(index<0?0:index))*40)
        m.body.querySelectorAll('.sil').forEach(p=>p.classList.toggle('hi',i===(index<0?2:index)))
      })
    }
    draw=now=>modules.forEach(m=>{
      const lift=tval(m.lift,now)
      if(lift!==m.last){m.last=lift;m.body.setAttribute('transform',`translate(0 ${(-lift*C.S*Math.sqrt(1-C.k*C.k)).toFixed(3)})`)}
    })
    settled=now=>modules.every(m=>tdone(m.lift,now))
    hit=(x,y)=>{
      let index=0
      modules.forEach((m,i)=>{if(Math.hypot(x-m.center[0],y-m.center[1])<Math.hypot(x-modules[index].center[0],y-modules[index].center[1]))index=i})
      return index
    }
  }else{
    box(g,0,5,54,44,0,15,5);box(g,58,8,28,38,9,15,4)
    const missing=path(g,poly(ringAt(P,rrect(91,8,121,46,4,8),15)),'nf lo dash')
    const bridge=solid(g);bridge.g.dataset.part='bridge';bridge.g.setAttribute('opacity','0')
    const destination=box(g,129,5,45,44,0,15,5)
    path(g,poly(ringAt(P,rrect(137,12,166,42,4,8),15.2)),'nf lo')
    const {f}=panel(g,10,28,34,42,16)
    path(g,poly(rrect(7,9,27,29,3,7).map(q=>f(q.u,q.v))),'nf lo')
    const task=box(g,140,18,23,20,16,35,3)
    const progress=tween(0);let last=NaN
    select=index=>{
      index=index<0?-1:0
      if(index===active)return
      active=index;stage.dataset.active=String(index)
      tset(progress,index<0?0:1,performance.now(),0)
      destination.sil.classList.toggle('hi',index>=0)
      task.sil.classList.toggle('hi',index>=0)
    }
    draw=now=>{
      const p=tval(progress,now)
      if(p===last)return
      last=p
      const lift=(1-p)*26
      put(bridge,prism(P,front,...rings(91,8,121,46,4,1),9+lift,15+lift))
      bridge.sil.classList.add('hi')
      bridge.g.setAttribute('opacity',p.toFixed(3))
      missing.setAttribute('opacity',(1-p).toFixed(3))
      task.g.setAttribute('transform',`translate(0 ${(-p*5).toFixed(3)})`)
    }
    settled=now=>tdone(progress,now)
    hit=()=>0
  }
  const board=register(stage,(_dt,now)=>{draw(now);return !settled(now)})
  bag.add(board.unregister)
  // Force the first state through select so rest highlights and data match.
  active=-2;select(-1);board.wake()
  function choose(index){select(index);board.wake()}
  return {
    select:choose,
    move(clientX,clientY){
      // The owning card is the sole pointer boundary. Normalise only against
      // this instance's stage; there are no document/global input listeners.
      const rect=stage.getBoundingClientRect()
      if(!rect.width||!rect.height)return
      choose(hit((clientX-rect.left)/rect.width*400,(clientY-rect.top)/rect.height*320))
    },
    destroy(){bag.dispose();svg.remove();delete stage.dataset.active;delete stage.dataset.hairline},
  }
}
