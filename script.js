const $=id=>document.getElementById(id), NS='http://www.w3.org/2000/svg';
const scene=$('scene'),tika=$('tika'),card=$('card'),hint=$('hint'),smile=$('smile');
// garland
(()=>{const g=$('garland');for(let i=0;i<=16;i++){const x=i*25,t=x/400;const y=18+ (Math.sin(t*Math.PI*2)<0?0:0);
 const yy=[18,29,38,43,40,43,38,29,18][i%8===0?0:0]; }
 const pts=[];for(let i=0;i<=20;i++){const x=i*20;const y=(x<=200)?18+37*Math.sin(Math.PI*x/200):18+37*Math.sin(Math.PI*(x-200)/200);
  const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y+3);c.setAttribute('r',5);c.setAttribute('fill',i%2?'#ff9d00':'#ffc400');g.appendChild(c);}})();
// 2-link arm
const S={x:168,y:208},L1=88,L2=92;
function pose(hx,hy){
 let dx=hx-S.x,dy=hy-S.y,d=Math.hypot(dx,dy);d=Math.min(d,L1+L2-1);
 const a=Math.atan2(dy,dx),cosA=(L1*L1+d*d-L2*L2)/(2*L1*d),A=Math.acos(Math.max(-1,Math.min(1,cosA)));
 const ang=a+A; // elbow bends downward
 const ex=S.x+L1*Math.cos(ang),ey=S.y+L1*Math.sin(ang);
 const fx=hx-ex,fy=hy-ey,fl=Math.hypot(fx,fy),ux=fx/fl,uy=fy/fl;
 const wx=hx-ux*20,wy=hy-uy*20;
 const set=(id,o)=>{const e=$(id);for(const k in o)e.setAttribute(k,o[k]);};
 set('upper',{x1:S.x,y1:S.y,x2:ex,y2:ey});
 set('fore',{x1:ex,y1:ey,x2:wx,y2:wy});
 set('wrist',{x1:wx,y1:wy,x2:hx,y2:hy});
 set('bangle1',{cx:wx,cy:wy});
 set('hand',{cx:hx,cy:hy});
 set('dot',{cx:hx+ux*5,cy:hy+uy*5});
}
const REST={x:236,y:196},TOUCH={x:299,y:122},LIFT={x:262,y:168};
const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const lerp=(a,b,k)=>a+(b-a)*k;
function move(pts,ms){return new Promise(res=>{const t0=performance.now();
 (function f(t){const k=Math.min(1,(t-t0)/ms),e=ease(k);
  // curved path through lift point
  const m=e<.5?{x:lerp(pts[0].x,pts[1].x,e*2),y:lerp(pts[0].y,pts[1].y,e*2)}:{x:lerp(pts[1].x,pts[2].x,(e-.5)*2),y:lerp(pts[1].y,pts[2].y,(e-.5)*2)};
  pose(m.x,m.y);k<1?requestAnimationFrame(f):res();})(t0);});}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function petals(){const g=$('petals');for(let i=0;i<22;i++){const p=document.createElementNS(NS,'ellipse');
 p.setAttribute('rx',4);p.setAttribute('ry',2.2);p.setAttribute('fill',i%2?'#ff9d00':'#ffc400');
 const x=Math.random()*400,t0=performance.now()+Math.random()*600,dur=1800+Math.random()*1200,sw=Math.random()*20+10;
 g.appendChild(p);(function f(t){const k=(t-t0)/dur;if(k<0){requestAnimationFrame(f);return;}
  if(k>=1){p.remove();return;}p.setAttribute('transform',`translate(${x+Math.sin(k*6)*sw} ${-10+k*290}) rotate(${k*360})`);requestAnimationFrame(f);})(performance.now());}}
pose(REST.x,REST.y);
let busy=false;
scene.addEventListener('click',async()=>{
 if(busy)return;busy=true;hint.textContent='';scene.classList.add('go');
 await move([REST,LIFT,TOUCH],1300);
 tika.setAttribute('rx','6.5');tika.setAttribute('ry','10');
 smile.setAttribute('d','M298 158 Q315 176 332 158');
 scene.classList.add('stamp');petals();
 await wait(700);
 await move([TOUCH,LIFT,REST],1000);
 await wait(300);
 card.hidden=false;card.scrollIntoView({behavior:'smooth',block:'nearest'});
 window.__done=true;
});
