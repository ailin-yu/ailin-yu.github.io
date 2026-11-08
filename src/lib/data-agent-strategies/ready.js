import { HL } from './kernel.js';
// Three reusable analysis applications, held in a tray; one is ready to take.
const {Cam,fit,proj,facing,rrect,ringAt,run,poly,open,hull,seg,rad,mk,place,
  tween,tset,tval,tdone,register,pointer,disposer,clamp}=HL;
function mount({stage,svg,read},value){
  const bag=disposer(), C=Cam(45,.5,1.9);
  fit(C,[[-8,-10,0],[91,60,0],[-8,0,90],[91,60,75]],200,166);
  const P=proj(C),front=facing(C),g=mk('g',{},svg);
  const outer=rrect(-7,-12,91,61,5,6),inner=rrect(-4,-9,88,58,3,6);
  const lr=p=>p[0][0]<p.at(-1)[0]?p:p.slice().reverse();
  mk('path',{d:poly(hull(ringAt(P,outer,0).concat(ringAt(P,outer,17)))),class:'sil'},g);
  mk('path',{d:poly(ringAt(P,inner,17)),class:'nf lo'},g);
  const items=[];
  for(let i=0;i<3;i++){
    const group=mk('g',{},g),back=mk('path',{class:'lo'},group),face=mk('path',{class:'sil'},group);
    const detail=mk('path',{class:'nf lo'},group),crease=mk('path',{class:'nf lo'},group);
    const shape=rrect(0,0,80,55,4,6);
    items.push({back,face,detail,crease,shape,a:tween(i===2?-3:-15),z:tween(i===2?17:1),last:''});
  }
  const it=lr(ringAt(P,run(inner,front),17)),ot=lr(ringAt(P,run(outer,front),17)),ob=lr(ringAt(P,run(outer,front),0));
  mk('path',{d:poly([...it,ot.at(-1),...ob.slice().reverse(),ot[0]]),class:'fo'},g);
  mk('path',{d:open(it),class:'nf lo'},g);
  mk('path',{d:open([ot[0],...ob,ot.at(-1)]),class:'nf sil'},g);
  mk('path',{d:poly(rrect(29,6,52,12,3,6).map(q=>P(q.u,61,q.v))),class:'nf lo'},g);
  let act=-1,stagger=value;
  function draw(i,a,lift){
    const q=items[i],key=a.toFixed(3)+','+lift.toFixed(3);if(key===q.last)return;q.last=key;
    const sn=Math.sin(rad(a)),cs=Math.cos(rad(a)),yb=i*20;
    const w=(u,v)=>P(u,yb+v*sn,v*cs+lift),wb=(u,v)=>P(u,yb+v*sn-1.4*cs,v*cs+lift+1.4*sn);
    q.back.setAttribute('d',poly(q.shape.map(p=>wb(p.u,p.v))));
    q.face.setAttribute('d',poly(q.shape.map(p=>w(p.u,p.v))));
    q.crease.setAttribute('d',seg(w(7,45),w(73,45)));
    // The ready app is a chart; neighbours are a slide and a table.
    let d='';
    if(i===2){for(let k=0;k<3;k++)d+=poly(rrect(17+k*17,10,28+k*17,[24,36,30][k],1.8,5).map(p=>w(p.u,p.v)));}
    else if(i===0){d=poly(rrect(12,12,68,37,2,5).map(p=>w(p.u,p.v)));}
    else {d=poly(rrect(12,10,68,37,2,5).map(p=>w(p.u,p.v)));d+=seg(w(12,23),w(68,23))+seg(w(31,10),w(31,37))+seg(w(49,10),w(49,37));}
    q.detail.setAttribute('d',d);
  }
  const B=register(stage,(_dt,now)=>{let moving=false;items.forEach((q,i)=>{draw(i,tval(q.a,now),tval(q.z,now));moving ||= !tdone(q.a,now)||!tdone(q.z,now);});return moving;});
  bag.add(B.unregister);
  function select(a){
    if(a===act)return;const from=a<0?act:a,now=performance.now();act=a;
    items.forEach((q,i)=>{const delay=Math.abs(i-from)*stagger;
      tset(q.a,a<0?(i===2?-3:-15):(i===a?0:i<a?-23:18),now,delay);
      tset(q.z,a<0?(i===2?17:1):(i===a?31:1),now,delay);
      q.face.classList.toggle('hi',i===(a<0?2:a));});
    read.textContent=a<0?'rest':['slide','table','chart'][a];B.wake();
  }
  items[2].face.classList.add('hi');read.textContent='rest';
  const centres=items.map((_,i)=>P(40,i*20-8,55));
  bag.add(pointer(stage,{move:([x,y])=>{if(x<70||x>335||y<45||y>260)return select(-1);
    let best=0;centres.forEach((p,i)=>{if(Math.hypot(x-p[0],y-p[1])<Math.hypot(x-centres[best][0],y-centres[best][1]))best=i;});select(best);},leave:()=>select(-1)}));
  bag.add(()=>svg.replaceChildren());return {set:v=>{stagger=v;},destroy:bag.dispose};
}

export { mount };
