// ==STUNT==
const Stunt=(()=>{
  const cv=document.getElementById('cv');
  let ctx=null;try{ctx=cv&&cv.getContext?cv.getContext('2d'):null}catch(e){ctx=null}
  const G=1300,DT=1/120,TIME=45,TAU=Math.PI*2;
  let W=0,H=0,SC=1,DPR=1;
  let xs=[],ys=[],kicks=[],genX=0,genY=0,segN=0,seed=1;
  let run=null,raf=0,last=0,acc=0,visible=false,camX=0,camY=0,col={},parts=[],popT=0,trimT=0;
  const inp={pg:false,pb:false,kg:false,kb:false,ptr:new Map()};
  const gasOn=()=>inp.pg||inp.kg||[...inp.ptr.values()].includes('gas');
  const brakeOn=()=>inp.pb||inp.kb||[...inp.ptr.values()].includes('brake');

  function readColors(){
    const cs=getComputedStyle(document.documentElement);
    const g=(n,f)=>(cs.getPropertyValue(n)||'').trim()||f;
    col={sky1:g('--sky-1','#0e1a2c'),sky2:g('--sky-2','#2a3c57'),h1:g('--hill-1','#1a283a'),h2:g('--hill-2','#22344a'),gr:g('--ground','#232b37'),gt:g('--ground-top','#55617a'),road:g('--road','#e9edf2'),acc:g('--accent','#ff7a1a')};
  }

  /* ---------- \u0442\u0440\u0430\u0441\u0441\u0430 ---------- */
  const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  const addPt=(x,y)=>{xs.push(x);ys.push(y)};
  const clampY=y=>Math.max(-240,Math.min(240,y));
  function flat(len){const n=Math.max(1,Math.round(len/60));for(let i=1;i<=n;i++)addPt(genX+len*i/n,genY);genX+=len}
  function kicker(){
    flat(160+rng()*160);
    const L=150+rng()*90,end=.75+rng()*.4,H=end*L/2,x0=genX,y0=genY;
    for(let i=1;i<=12;i++){const t=i/12;addPt(x0+L*t,y0+H*t*t)}
    genX=x0+L;
    const drop=rng()<.45?0:40+rng()*110,ny=clampY(y0-drop);
    addPt(genX+22,ny);kicks.push([x0,genX]);genX+=22;genY=ny;
    flat(480+rng()*240);
  }
  function hill(){const L=380+rng()*220,h=50+rng()*70,x0=genX,y0=genY;for(let i=1;i<=18;i++){const t=i/18;addPt(x0+L*t,y0+h*(1-Math.cos(TAU*t))/2)}genX+=L;flat(120)}
  function slope(dy,L){const x0=genX,y0=genY,ny=clampY(y0+dy);for(let i=1;i<=7;i++){const t=i/7;addPt(x0+L*t,y0+(ny-y0)*t*t*(3-2*t))}genX+=L;genY=ny;flat(160)}
  function gen(until){
    while(genX<until){
      const r=rng();segN++;
      if(segN<=1)flat(700);
      else if(r<.46)kicker();
      else if(r<.63)hill();
      else if(r<.8)slope(-(60+rng()*90),280+rng()*90);
      else if(r<.92)slope(40+rng()*90,330+rng()*120);
      else flat(220+rng()*200);
    }
  }
  function segAt(x){let lo=0,hi=xs.length-2;if(hi<0)return 0;if(x<=xs[0])return 0;if(x>=xs[hi+1])return hi;while(lo<hi){const m=(lo+hi+1)>>1;if(xs[m]<=x)lo=m;else hi=m-1}return lo}
  const segAng=i=>Math.atan2(ys[i+1]-ys[i],xs[i+1]-xs[i]);
  const segLen=i=>Math.hypot(xs[i+1]-xs[i],ys[i+1]-ys[i]);
  function gy(x){const i=segAt(x);const t=Math.max(0,Math.min(1,(x-xs[i])/(xs[i+1]-xs[i])));return ys[i]+(ys[i+1]-ys[i])*t}
  const wrap=a=>{a=(a+Math.PI)%TAU;if(a<0)a+=TAU;return a-Math.PI};

  /* ---------- \u0437\u0430\u0435\u0437\u0434 ---------- */
  function newRun(){
    seed=((Date.now()&0x7fffffff)^Math.floor(Math.random()*1e9))>>>0||7;
    xs=[];ys=[];kicks=[];genX=0;genY=0;segN=0;
    addPt(-800,0);addPt(0,0);gen(4200);
    run={x:90,y:0,s:0,vx:0,vy:0,ang:0,av:0,ground:true,air:0,rot:0,t:TIME,score:0,maxX:90,flips:0,combo:0,best:0,perfects:0,state:'ready',endT:0,wheel:0};
    parts=[];
    camX=run.x-viewW()*.3;camY=run.y-viewH()*.36;
  }
  function step(dt){
    const r=run;
    if(r.state==='crash'){
      r.endT+=dt;r.vy-=G*dt;r.x+=r.vx*dt;r.y+=r.vy*dt;r.ang+=r.av*dt;r.vx*=.985;
      const g=gy(r.x);if(r.y<g){r.y=g;r.vy=Math.abs(r.vy)*.3;r.vx*=.7;r.av*=.6}
      if(r.endT>1.2)finish(true);
      return;
    }
    if(r.state!=='run')return;
    if(xs[xs.length-1]<r.x+3200)gen(r.x+4400);
    const gas=gasOn(),brake=brakeOn();
    if(r.ground){
      const i0=segAt(r.x),th=segAng(i0);
      let a=0;
      if(gas)a+=r.s<0?1800:950;
      if(brake)a-=r.s>30?1700:420;
      a-=G*Math.sin(th);
      a-=.00055*r.s*Math.abs(r.s);
      if(!gas&&!brake)a-=Math.sign(r.s)*Math.min(60,Math.abs(r.s)/dt);
      r.s=Math.max(-260,Math.min(1200,r.s+a*dt));
      const nx=r.x+r.s*Math.cos(th)*dt,i1=segAt(nx);
      if(i1>i0&&r.s>60){
        const thA=segAng(i1-1),thB=segAng(i1);
        const k=(thA-thB)/((segLen(i1-1)+segLen(i1))/2);
        if(k>0&&r.s*r.s*k>G*Math.cos(thA)){
          r.ground=false;r.vx=r.s*Math.cos(thA);r.vy=r.s*Math.sin(thA);
          r.ang=thA;r.av=0;r.air=0;r.rot=0;
          r.x=nx;r.y=Math.max(r.y+r.vy*dt,gy(nx)+.5);
          return;
        }
        if(thB>thA)r.s*=Math.sqrt(Math.cos(Math.min(1.2,thB-thA)));
      }
      r.x=nx;r.y=gy(nx);r.ang=segAng(segAt(nx));
      r.wheel+=r.s*dt/13;
    }else{
      r.vy-=G*dt;r.x+=r.vx*dt;r.y+=r.vy*dt;
      const tq=(gas?1:0)-(brake?1:0);
      if(tq)r.av+=tq*26*dt;else r.av*=Math.max(0,1-4.5*dt);
      r.av=Math.max(-11,Math.min(11,r.av));
      r.ang+=r.av*dt;r.rot+=r.av*dt;r.air+=dt;
      r.wheel+=(gas?30:6)*dt;
      const g=gy(r.x);
      if(r.y<=g)land(g);
    }
    if(r.x>r.maxX){r.score+=(r.x-r.maxX)*.05;r.maxX=r.x}
    r.t-=dt;
    if(r.state==='run'&&((r.t<=0&&r.ground)||r.t<=-4))finish(false);
  }
  function land(g){
    const r=run,th=segAng(segAt(r.x)),diff=wrap(r.ang-th);
    if(Math.abs(diff)>1.05){
      r.state='crash';r.endT=0;r.av=(r.av||3)*.8;r.vy*=-.2;r.y=g;
      burst(r.x,g,18,true);pop('\u0410\u0432\u0430\u0440\u0438\u044f!','\u043e\u0447\u043a\u0438 \u0437\u0430 \u044d\u0442\u043e\u0442 \u043f\u0440\u044b\u0436\u043e\u043a \u0441\u0433\u043e\u0440\u0435\u043b\u0438');
      return;
    }
    const flips=Math.floor((Math.abs(r.rot)+1.05)/TAU);
    const perfect=Math.abs(diff)<.2;
    let pts=0;const lab=[];
    if(r.air>.5)pts+=Math.round(r.air*250);
    if(flips>0){
      const front=r.rot<0;
      pts+=flips*(front?1900:1500);
      lab.push((flips>1?flips+'\u00d7 ':'')+(front?'\u0444\u0440\u043e\u043d\u0442\u0444\u043b\u0438\u043f':'\u0431\u044d\u043a\u0444\u043b\u0438\u043f'));
      r.flips+=flips;r.combo++;
    }else if(Math.abs(diff)>.45)r.combo=0;
    let mult=1;
    if(pts>0&&perfect){mult*=1.5;lab.push('\u0438\u0434\u0435\u0430\u043b\u044c\u043d\u043e');r.perfects++}
    if(flips>0&&r.combo>1){const m=1+.25*(r.combo-1);mult*=m;lab.push('\u043a\u043e\u043c\u0431\u043e \u00d7'+String(+m.toFixed(2)).replace('.',','))}
    pts=Math.round(pts*mult);
    if(pts>0){r.score+=pts;r.best=Math.max(r.best,pts);pop('+'+fmtN(pts),lab.join(' \u00b7 ')||'\u043f\u043e\u043b\u0451\u0442')}
    else if(Math.abs(diff)>.6)pop('\u0416\u0451\u0441\u0442\u043a\u043e!','');
    let s=r.vx*Math.cos(th)+r.vy*Math.sin(th);
    s*=1-.45*Math.abs(Math.sin(diff));
    r.s=s;r.y=g;r.ground=true;r.ang=th;r.av=0;
    burst(r.x,g,6+Math.min(16,Math.abs(r.vy)/80),false);
  }
  function finish(crashed){
    const r=run;if(!r||r.state==='done')return;
    r.state='done';clearInput();
    const res={score:Math.round(r.score),flips:r.flips,best:r.best,perfects:r.perfects,dist:Math.round(r.maxX/20),crashed};
    let rew=null;try{rew=onStuntEnd(res)}catch(e){console.error(e)}
    if(rew&&typeof rew.then==='function'){overlay('<h3>'+(crashed?'\u0410\u0432\u0430\u0440\u0438\u044f':'\u0424\u0438\u043d\u0438\u0448')+'</h3><p>\u0421\u0447\u0438\u0442\u0430\u0435\u043c \u043d\u0430\u0433\u0440\u0430\u0434\u0443\u2026</p>');rew.then(v=>{if(run===r)overlay(stuntEndHtml(res,v))},()=>overlay(stuntEndHtml(res,null)))}
    else overlay(stuntEndHtml(res,rew));
  }

  /* ---------- \u0447\u0430\u0441\u0442\u0438\u0446\u044b \u0438 \u043d\u0430\u0434\u043f\u0438\u0441\u0438 ---------- */
  function burst(x,y,n,spark){for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.3)*(spark?520:260),vy:Math.random()*(spark?420:180),life:spark?.7:.55,max:spark?.7:.55,spark})}
  function tickParts(dt){for(const p of parts){p.vy-=900*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}parts=parts.filter(p=>p.life>0)}
  const popEl=document.getElementById('h-pop');
  function pop(a,b){if(!popEl)return;popEl.innerHTML=esc(a)+(b?'<small>'+esc(b)+'</small>':'');popEl.classList.add('show');popT=1.5}

  /* ---------- \u043e\u0442\u0440\u0438\u0441\u043e\u0432\u043a\u0430 ---------- */
  const viewW=()=>(W||900)/SC,viewH=()=>(H||400)/SC;
  const sx=x=>(x-camX)*SC,sy=y=>H-(y-camY)*SC;
  function resize(){
    if(!cv)return;const rc=cv.getBoundingClientRect();if(rc.width<10)return;
    DPR=Math.min(2,window.devicePixelRatio||1);W=rc.width;H=rc.height;
    cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
    SC=Math.max(.42,Math.min(1,W/1000));
  }
  function cam(dt){
    if(!run)return;const r=run;
    const look=(r.ground?r.s:r.vx)*.18;
    const tx=r.x-viewW()*.3+Math.max(-80,Math.min(200,look));
    const ty=r.y-viewH()*.38;
    const k=Math.min(1,dt*6),k2=Math.min(1,dt*4);
    camX+=(tx-camX)*k;camY+=(ty-camY)*k2;
  }
  function hills(par,color,base,amp,freq){
    ctx.beginPath();ctx.moveTo(0,H);
    for(let px=0;px<=W+24;px+=24){const wx=px/SC+camX*par;const y=base-(Math.sin(wx*freq)*amp+Math.sin(wx*freq*2.3+1.3)*amp*.45)*Math.max(.6,SC);ctx.lineTo(px,y)}
    ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle=color;ctx.fill();
  }
  function draw(){
    ctx.setTransform(DPR,0,0,DPR,0,0);
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,col.sky1);g.addColorStop(1,col.sky2);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    hills(.2,col.h1,H*.5,70,.0026);hills(.45,col.h2,H*.66,48,.0052);
    if(!xs.length)return;
    const x0=camX-60,x1=camX+viewW()+60;
    let i0=segAt(x0),i1=i0;while(i1<xs.length-1&&xs[i1]<x1)i1++;
    ctx.beginPath();ctx.moveTo(sx(xs[i0]),H+20);
    for(let i=i0;i<=i1;i++)ctx.lineTo(sx(xs[i]),sy(ys[i]));
    ctx.lineTo(sx(xs[i1]),H+20);ctx.closePath();ctx.fillStyle=col.gr;ctx.fill();
    ctx.beginPath();for(let i=i0;i<=i1;i++){const X=sx(xs[i]),Y=sy(ys[i]);i===i0?ctx.moveTo(X,Y):ctx.lineTo(X,Y)}
    ctx.lineJoin='round';ctx.lineWidth=Math.max(3,6*SC);ctx.strokeStyle=col.gt;ctx.stroke();
    // \u0440\u0430\u0437\u043c\u0435\u0442\u043a\u0430 \u0434\u043e\u0440\u043e\u0433\u0438
    ctx.save();ctx.setLineDash([22*SC,26*SC]);ctx.lineWidth=Math.max(1.5,2.5*SC);ctx.strokeStyle=col.road;ctx.globalAlpha=.55;
    ctx.beginPath();for(let i=i0;i<=i1;i++){const X=sx(xs[i]),Y=sy(ys[i])+9*SC;i===i0?ctx.moveTo(X,Y):ctx.lineTo(X,Y)}ctx.stroke();ctx.restore();
    // \u0442\u0440\u0430\u043c\u043f\u043b\u0438\u043d\u044b \u0432 \u043e\u0440\u0430\u043d\u0436\u0435\u0432\u043e-\u0431\u0435\u043b\u0443\u044e \u043f\u043e\u043b\u043e\u0441\u043a\u0443
    for(const k of kicks){
      if(k[1]<x0||k[0]>x1)continue;
      const a=segAt(k[0]),b=segAt(k[1]-1);
      ctx.save();ctx.lineWidth=Math.max(4,8*SC);ctx.lineCap='butt';
      for(let pass=0;pass<2;pass++){
        ctx.setLineDash(pass?[12*SC,12*SC]:[]);ctx.strokeStyle=pass?col.road:col.acc;
        ctx.beginPath();for(let i=a;i<=b+1;i++){const X=sx(xs[i]),Y=sy(ys[i]);i===a?ctx.moveTo(X,Y):ctx.lineTo(X,Y)}ctx.stroke();
      }
      ctx.restore();
    }
    // \u0441\u0442\u043e\u043b\u0431\u0438\u043a\u0438 \u043a\u0430\u0436\u0434\u044b\u0435 100 \u043c
    ctx.font=`600 ${Math.max(10,13*SC)}px Oswald, 'Arial Narrow', sans-serif`;ctx.textAlign='center';
    for(let m=Math.ceil(x0/2000)*2000;m<x1;m+=2000){
      if(m<=0)continue;const X=sx(m),Y=sy(gy(m));
      ctx.fillStyle=col.road;ctx.fillRect(X-2*SC,Y-46*SC,4*SC,46*SC);
      ctx.fillStyle=col.acc;ctx.fillRect(X-16*SC,Y-62*SC,32*SC,18*SC);
      ctx.fillStyle='#1a0c00';ctx.fillText((m/20)+' \u043c',X,Y-48.5*SC);
    }
    if(run)drawCar(run);
    for(const p of parts){
      const a=Math.max(0,p.life/p.max);ctx.globalAlpha=a;
      ctx.fillStyle=p.spark?(Math.random()<.5?col.acc:'#ffd23f'):col.road;
      const s=(p.spark?3:5)*SC*(p.spark?1:(1.4-a));
      ctx.fillRect(sx(p.x)-s/2,sy(p.y)-s/2,s,s);
    }
    ctx.globalAlpha=1;
  }
  function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
  function wheel(x,y,rot){
    ctx.fillStyle='#14171c';ctx.beginPath();ctx.arc(x,y,13,0,TAU);ctx.fill();
    ctx.fillStyle='#a9b3bf';ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();
    ctx.strokeStyle='#14171c';ctx.lineWidth=2;
    for(let k=0;k<3;k++){const a=rot+k*TAU/3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*7,y+Math.sin(a)*7);ctx.stroke()}
  }
  function drawCar(r){
    const X=sx(r.x),Y=sy(r.y);
    ctx.save();ctx.translate(X,Y);ctx.rotate(-r.ang);ctx.scale(SC,SC);
    const c=carColor();
    ctx.fillStyle='rgba(0,0,0,.22)';rr(-46,-6,92,6,3);if(r.ground)ctx.fill();
    ctx.fillStyle=c;
    ctx.beginPath();ctx.moveTo(-27,-39);ctx.lineTo(-15,-58);ctx.lineTo(15,-58);ctx.lineTo(31,-39);ctx.closePath();ctx.fill();
    rr(-49,-42,98,26,8);ctx.fill();
    ctx.fillStyle='rgba(15,22,34,.86)';
    ctx.beginPath();ctx.moveTo(-21,-40);ctx.lineTo(-12,-54);ctx.lineTo(-2,-54);ctx.lineTo(-2,-40);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(2,-40);ctx.lineTo(2,-54);ctx.lineTo(13,-54);ctx.lineTo(24,-40);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-49,-25,98,4);
    ctx.fillStyle='#fff3c2';ctx.fillRect(43,-37,6,6);
    ctx.fillStyle='#e0262f';ctx.fillRect(-49,-37,4,7);
    ctx.fillStyle='#ffffff';ctx.fillRect(-46,-23,17,6);ctx.fillStyle='#0039a6';ctx.fillRect(-31,-23,2,6);
    wheel(-30,-13,r.wheel);wheel(30,-13,r.wheel);
    ctx.restore();
  }
  const tEl=document.getElementById('h-time'),scEl=document.getElementById('h-score');
  let lastHud='';
  function hud(dt){
    if(popT>0){popT-=dt;if(popT<=0&&popEl)popEl.classList.remove('show')}
    if(!run)return;
    const t=Math.max(0,run.t).toFixed(1).replace('.',','),s=fmtN(run.score);
    const k=t+'|'+s;if(k===lastHud)return;lastHud=k;
    if(tEl)tEl.textContent=t;if(scEl)scEl.textContent=s;
  }

  /* ---------- \u0446\u0438\u043a\u043b ---------- */
  function loop(ts){
    if(!visible){raf=0;return}
    raf=requestAnimationFrame(loop);
    const dt=Math.min(.05,Math.max(0,(ts-last)/1000));last=ts;
    if(run&&(run.state==='run'||run.state==='crash')){
      acc+=dt;let n=0;while(acc>=DT&&n<14){step(DT);acc-=DT;n++}
      trimT+=dt;if(trimT>3){trimT=0;let cut=0;while(cut<xs.length-4&&xs[cut+1]<run.x-1600)cut++;if(cut>0){xs.splice(0,cut);ys.splice(0,cut);kicks=kicks.filter(k=>k[1]>run.x-1600)}}
    }
    tickParts(dt);cam(dt);
    if(ctx&&W>0)draw();
    hud(dt);
  }
  function startLoop(){if(!raf&&visible){last=performance.now();raf=requestAnimationFrame(loop)}}

  /* ---------- \u043e\u0432\u0435\u0440\u043b\u0435\u0439 ---------- */
  const ov=document.getElementById('s-ov');
  function overlay(html){if(!ov)return;if(html==null){ov.hidden=true;ov.innerHTML='';return}ov.innerHTML='<div class="box">'+html+'</div>';ov.hidden=false}

  /* ---------- \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 ---------- */
  const pg=document.getElementById('p-gas'),pb=document.getElementById('p-brake');
  function pedalsUI(){if(pg)pg.classList.toggle('on',gasOn());if(pb)pb.classList.toggle('on',brakeOn())}
  function clearInput(){inp.pg=inp.pb=inp.kg=inp.kb=false;inp.ptr.clear();pedalsUI()}
  function bindPedal(el,key){
    if(!el)return;
    const on=e=>{e.preventDefault();try{el.setPointerCapture(e.pointerId)}catch(_){}inp[key]=true;pedalsUI()};
    const off=()=>{inp[key]=false;pedalsUI()};
    el.addEventListener('pointerdown',on);
    ['pointerup','pointercancel','lostpointercapture'].forEach(t=>el.addEventListener(t,off));
    el.addEventListener('contextmenu',e=>e.preventDefault());
  }
  bindPedal(pg,'pg');bindPedal(pb,'pb');
  if(cv){
    cv.addEventListener('pointerdown',e=>{if(!run||run.state!=='run')return;e.preventDefault();const rc=cv.getBoundingClientRect();inp.ptr.set(e.pointerId,(e.clientX-rc.left)<rc.width/2?'brake':'gas');try{cv.setPointerCapture(e.pointerId)}catch(_){}pedalsUI()});
    ['pointerup','pointercancel','lostpointercapture'].forEach(t=>cv.addEventListener(t,e=>{inp.ptr.delete(e.pointerId);pedalsUI()}));
    cv.addEventListener('contextmenu',e=>e.preventDefault());
  }
  const GK=['ArrowRight','KeyD','ArrowUp','KeyW','Space'],BK=['ArrowLeft','KeyA','ArrowDown','KeyS'];
  window.addEventListener('keydown',e=>{
    if(!visible||!run||run.state!=='run')return;
    const tg=e.target&&e.target.tagName;if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT')return;
    if(GK.includes(e.code)){inp.kg=true;e.preventDefault()}else if(BK.includes(e.code)){inp.kb=true;e.preventDefault()}else if(e.code==='Escape'||e.code==='KeyP'){pause()}
    pedalsUI();
  });
  window.addEventListener('keyup',e=>{if(GK.includes(e.code))inp.kg=false;if(BK.includes(e.code))inp.kb=false;pedalsUI()});
  window.addEventListener('blur',clearInput);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
  if(window.ResizeObserver&&cv)new ResizeObserver(()=>{resize();if(ctx&&W>0&&!raf&&visible){draw()}}).observe(cv);
  try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',readColors)}catch(e){}
  try{new MutationObserver(readColors).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']})}catch(e){}

  function pause(){if(run&&run.state==='run'){run.state='pause';clearInput();overlay('<h3>\u041f\u0430\u0443\u0437\u0430</h3><p>\u0417\u0430\u0435\u0437\u0434 \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d. \u0412\u0440\u0435\u043c\u044f \u043d\u0435 \u0438\u0434\u0451\u0442.</p><button class="btn primary wide" data-act="stunt-resume">\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c</button>')}}

  return{
    show(){visible=true;readColors();resize();if(!run){newRun();overlay(stuntStartHtml())}startLoop()},
    hide(){visible=false;pause();if(raf){cancelAnimationFrame(raf);raf=0}},
    start(){newRun();run.state='run';overlay(null);clearInput();acc=0;last=performance.now();lastHud='';startLoop()},
    resume(){if(run&&run.state==='pause'){run.state='run';overlay(null);last=performance.now()}},
    intro(){if(!run||run.state==='done'||run.state==='ready'){if(!run)newRun();overlay(stuntStartHtml())}},
    state:()=>run?run.state:'none',
    _test:{gy,segAt,step:dt=>step(dt||DT),get run(){return run},newRun,inp,finish}
  };
})();
// ==/STUNT==
