import { HL } from './kernel.js';
// Data and knowledge are cartridges that dock into one enterprise backplane.
const {Cam,fit,proj,facing,rings,rrect,prism,solid,put,poly,open,ringAt,run,hull,seg,mk,
  tween,tset,tval,tdone,register,pointer,disposer,clamp}=HL;
function mount({stage,svg,read},value){
  const bag=disposer(),C=Cam(45,.5,1.8);
  fit(C,[[-5,-8,0],[132,77,0],[0,0,105],[132,77,100]],200,166);
  const P=proj(C),front=facing(C),g=mk('g',{},svg);
  const base=solid(g);put(base,prism(P,front,...rings(-7,-8,132,77,6,2),0,9));
  const sockets=[{x:27,y:29},{x:97,y:29}];
  sockets.forEach(({x,y})=>{
    mk('path',{d:poly(ringAt(P,rrect(x-22,y-23,x+22,y+23,4,6),9.4)),class:'nf lo'},g);
    for(let k=0;k<2;k++)mk('path',{d:poly(ringAt(P,rrect(x-11+k*16,y-9,x-6+k*16,y+9,1.8,4),9.6)),class:'nf lo'},g);
  });
  const devices=sockets.map((p,i)=>({p,i,group:mk('g',{},g),lift:tween(i===0?20:5),last:''}));
  devices.forEach(q=>{
    q.pins=[solid(q.group),solid(q.group)];q.foot=solid(q.group);q.body=solid(q.group);q.cover=solid(q.group);
    q.mark=mk('path',{class:'nf lo'},q.group);
  });
  let active=-1,strength=value;
  function draw(q,lift){
    const key=lift.toFixed(3)+','+active;if(key===q.last)return;q.last=key;
    const {x,y}=q.p,z=13+lift;
    q.pins.forEach((pin,k)=>put(pin,prism(P,front,...rings(x-11+k*16,y-8,x-6+k*16,y+8,1.5,.5),z-10,z)));
    put(q.foot,prism(P,front,...rings(x-21,y-22,x+21,y+22,4,1.2),z,z+5));
    if(q.i===0){
      const ring=Array.from({length:65},(_,i)=>{const a=i*Math.PI*2/64;return {u:x+17*Math.cos(a),v:y+17*Math.sin(a),nu:Math.cos(a),nv:Math.sin(a)};});
      const inner=ring.map(p=>({...p,u:x+(p.u-x)*.92,v:y+(p.v-y)*.92}));
      put(q.body,prism(P,front,ring,inner,z+5,z+38));
      q.mark.setAttribute('d',open(ringAt(P,run(ring,front),z+20)));
    }else{
      // The binding sits low; both page edges lift up from the valley.
      const page=(left)=>{
        const ring=rrect(left?-21:0,-23,left?0:21,23,2,8);
        const inner=rrect(left?-20:-0,-22,left?-1:20,22,1,8);
        const at=(p,h)=>P(x+p.u,y+p.v,z+18+7*Math.abs(p.u)/21+h);
        return {sil:poly(hull(ring.map(p=>at(p,0)).concat(ring.map(p=>at(p,-3))))),
          crease:open(inner.filter(p=>p.v>0).map(p=>at(p,0)))};
      };
      put(q.body,page(true));put(q.cover,page(false));
      q.mark.setAttribute('d',seg(P(x,y-20,z+18),P(x,y+20,z+18)));
    }
    q.body.sil.classList.toggle('hi',q.i===(active<0?0:active));
  }
  const B=register(stage,(_dt,now)=>{let moving=false;devices.forEach(q=>{draw(q,tval(q.lift,now));moving ||= !tdone(q.lift,now);});return moving;});bag.add(B.unregister);
  function select(a){
    if(a===active)return;active=a;const now=performance.now();
    devices.forEach((q,i)=>tset(q.lift,a<0?(i===0?20:5):(i===a?0:strength),now,a<0?0:Math.abs(i-a)*40));
    read.textContent=a<0?'rest':a===0?'data':'knowledge';B.wake();
  }
  const targets=sockets.map(p=>P(p.x,p.y,48));
  read.textContent='rest';
  bag.add(pointer(stage,{move:([x,y])=>{if(x<60||x>340||y<50||y>280)return select(-1);
    select(Math.hypot(x-targets[0][0],y-targets[0][1])<Math.hypot(x-targets[1][0],y-targets[1][1])?0:1);},leave:()=>select(-1)}));
  bag.add(()=>svg.replaceChildren());return {set:v=>{strength=v;},destroy:bag.dispose};
}

export { mount };
