import { HL } from './kernel.js';
// Result at the top; process and evidence open only as far as needed.
const {Cam,fit,proj,facing,rings,prism,solid,put,rrect,ringAt,poly,open,seg,mk,
  spring,stepS,register,pointer,disposer,clamp}=HL;
function mount({stage,svg,read},value){
  const bag=disposer(),C=Cam(45,.5,1.8);
  fit(C,[[0,0,0],[98,71,0],[0,0,115],[98,71,115]],200,166);
  const P=proj(C),front=facing(C),g=mk('g',{},svg),R=rings(0,0,98,71,5,1.5);
  const sheets=Array.from({length:3},()=>({el:solid(g),detail:mk('path',{class:'nf lo'},g)}));
  const bars=Array.from({length:3},()=>solid(g));
  const gap=spring(21),pick=spring(-1);let reach=value,last='',active=-1;
  function draw(){
    const key=gap.x.toFixed(3)+','+active;if(key===last)return;last=key;
    sheets.forEach((q,i)=>{
      const z=5+i*gap.x;put(q.el,prism(P,front,...R,z,z+3));
      q.el.sil.classList.toggle('hi',i===(active<0?2:active));
      let d='';
      if(i===0){d=poly(ringAt(P,rrect(13,14,85,57,2,5),z+3));
        d+=seg(P(13,35,z+3),P(85,35,z+3))+seg(P(37,14,z+3),P(37,57,z+3))+seg(P(61,14,z+3),P(61,57,z+3));}
      if(i===1){for(let k=0;k<3;k++)d+=poly(ringAt(P,rrect(12+k*27,23,32+k*27,46,3,5),z+3));
        d+=seg(P(32,34,z+3),P(39,34,z+3))+seg(P(59,34,z+3),P(66,34,z+3));}
      q.detail.setAttribute('d',d);
    });
    // Real chart columns, not a printed chart icon.
    bars.forEach((bar,k)=>{const z=5+2*gap.x+3;put(bar,prism(P,front,...rings(19+k*23,24,31+k*23,51,2,1),z,z+[11,25,17][k]));});
  }
  const B=register(stage,(dt)=>{const moving=stepS(gap,dt);draw();return moving;});bag.add(B.unregister);
  const rests=[0,1,2].map(i=>P(49,35,8+i*21));
  function target(p){
    if(!p){active=-1;gap.t=21;read.textContent='rest';B.wake();return;}
    const [x,y]=p;if(x<65||x>335||y<45||y>280)return target(null);
    let best=0;rests.forEach((q,i)=>{if(Math.abs(y-q[1])<Math.abs(y-rests[best][1]))best=i;});
    active=best;gap.t=clamp(22+(x-100)/200*reach,22,43);read.textContent=['evidence','process','result'][best];B.wake();
  }
  read.textContent='rest';bag.add(pointer(stage,{move:target,leave:()=>target(null)}));
  bag.add(()=>svg.replaceChildren());return {set:v=>{reach=v;},destroy:bag.dispose};
}

export { mount };
