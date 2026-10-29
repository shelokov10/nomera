/* \u041c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b 2.1: Rider, \u0421\u0442\u0430\u043d\u0442 (\u0432 \u0434\u0443\u0445\u0435 Wheelie Life), \u00ab\u0413\u0430\u0437 \u0432 \u043f\u043e\u043b\u00bb. \u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u044e\u0442\u0441\u044f \u043a \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044e \u0447\u0435\u0440\u0435\u0437 makeGames(api). */
window.makeGames=function(api){
  const root=document.getElementById('game');
  const TAU=Math.PI*2;
  const esc=api.esc,ic=api.ic,fmtN=api.fmtN,fmt=api.fmt;
  let cur=null; // \u0442\u0435\u043a\u0443\u0449\u0430\u044f \u0438\u0433\u0440\u0430
  const warned=api.limitWarned||{v:false}; // \u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u0435 \u043e \u043b\u0438\u043c\u0438\u0442\u0435 \u2014 \u043e\u0434\u0438\u043d \u0440\u0430\u0437 \u0437\u0430 \u0441\u0435\u0441\u0441\u0438\u044e

  /* ---------- \u043e\u0431\u0449\u0438\u0439 \u043a\u0430\u0440\u043a\u0430\u0441 \u044d\u043a\u0440\u0430\u043d\u0430 ---------- */
  function shell(html){
    root.innerHTML='<canvas id="g-cv"></canvas>'+html;root.classList.add('on');
    document.body.style.overflow='hidden';
    return root.querySelector('#g-cv');
  }
  function close(){
    if(cur&&cur.stop)cur.stop();cur=null;root.classList.remove('on');root.innerHTML='';document.body.style.overflow='';api.Music.stop();api.after();
  }
  function fitCv(cv){const r=cv.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);return{c,W:r.width,H:r.height,dpr}}
  function overlay(html){let o=root.querySelector('.gover');if(html==null){if(o)o.remove();return}if(!o){o=document.createElement('div');o.className='gover';root.appendChild(o)}o.innerHTML='<div class="box">'+html+'</div>'}
  let warnT=0;
  function warn(text,sec){let w=root.querySelector('.gwarn');if(text==null){if(w)w.remove();return}if(!w){w=document.createElement('div');w.className='gwarn';root.appendChild(w)}w.textContent=text;clearTimeout(warnT);if(sec)warnT=setTimeout(()=>warn(null),sec*1000)}
  let popT=0;
  function pop(a,b){const el=root.querySelector('.gpop');if(!el)return;el.innerHTML=esc(a)+(b?'<small>'+esc(b)+'</small>':'');el.classList.add('show');popT=1.4}
  function tickPop(dt){if(popT>0){popT-=dt;if(popT<=0){const el=root.querySelector('.gpop');if(el)el.classList.remove('show')}}}
  // \u043f\u0435\u0434\u0430\u043b\u0438: \u0433\u0430\u0437 \u0441\u043f\u0440\u0430\u0432\u0430, \u0442\u043e\u0440\u043c\u043e\u0437 \u0441\u043b\u0435\u0432\u0430; \u043f\u043b\u044e\u0441 \u043a\u0430\u0441\u0430\u043d\u0438\u044f \u043f\u043e \u043f\u043e\u043b\u043e\u0432\u0438\u043d\u0430\u043c \u044d\u043a\u0440\u0430\u043d\u0430 \u0438 \u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430
  function controls(opt){
    opt=opt||{};
    const inp={g:false,b:false,ptr:new Map(),kg:false,kb:false};
    const gas=()=>inp.g||inp.kg||[...inp.ptr.values()].includes('g');
    const brake=()=>inp.b||inp.kb||[...inp.ptr.values()].includes('b');
    const pg=root.querySelector('#p-gas'),pb=root.querySelector('#p-brake');
    const ui=()=>{if(pg)pg.classList.toggle('on',gas());if(pb)pb.classList.toggle('on',brake())};
    const bind=(el,k)=>{if(!el)return;el.addEventListener('pointerdown',e=>{e.preventDefault();try{el.setPointerCapture(e.pointerId)}catch(_){}inp[k]=true;ui();api.Haptic.tap()});['pointerup','pointercancel','lostpointercapture'].forEach(t=>el.addEventListener(t,()=>{inp[k]=false;ui()}));el.addEventListener('contextmenu',e=>e.preventDefault())};
    bind(pg,'g');bind(pb,'b');
    const cv=root.querySelector('#g-cv');
    if(!opt.noCanvas){
      cv.addEventListener('pointerdown',e=>{e.preventDefault();inp.ptr.set(e.pointerId,e.clientX<window.innerWidth/2?'b':'g');try{cv.setPointerCapture(e.pointerId)}catch(_){}ui()});
      ['pointerup','pointercancel','lostpointercapture'].forEach(t=>cv.addEventListener(t,e=>{inp.ptr.delete(e.pointerId);ui()}));
    }
    const GK=['ArrowRight','KeyD','ArrowUp','KeyW'],BK=['ArrowLeft','KeyA','ArrowDown','KeyS'];
    const kd=e=>{if(GK.includes(e.code)){inp.kg=true;e.preventDefault()}else if(BK.includes(e.code)){inp.kb=true;e.preventDefault()}else if(e.code==='Space'&&opt.onTrick){e.preventDefault();opt.onTrick()}ui()};
    const ku=e=>{if(GK.includes(e.code))inp.kg=false;if(BK.includes(e.code))inp.kb=false;ui()};
    window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
    return{gas,brake,clear(){inp.g=inp.b=inp.kg=inp.kb=false;inp.ptr.clear();ui()},off(){window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku)}};
  }
  const hudHTML=(extra)=>'<div class="hud"><div class="grow"><div class="sc" id="h-sc">0</div><div id="h-sub" style="color:#fff;font:600 14px -apple-system,sans-serif;opacity:.9;text-shadow:0 1px 6px rgba(0,0,0,.5)"></div>'+(extra||'')+'</div><button class="glass" data-g="pause" style="width:44px;height:44px;padding:0;display:grid;place-items:center;border-radius:50%">'+ic('pause')+'</button></div><div class="gpop"></div>';
  const pedalsHTML='<div class="pedals"><button class="pedal glass" id="p-brake" aria-label="\u0422\u043e\u0440\u043c\u043e\u0437">'+ic('brake')+'</button><button class="pedal glass" id="p-gas" aria-label="\u0413\u0430\u0437">'+ic('gas')+'</button></div>';
  root.addEventListener('click',e=>{const b=e.target.closest('[data-g]');if(!b)return;e.preventDefault();const k=b.dataset.g;if(cur&&cur.cmd)cur.cmd(k,b)});

  /* ---------- \u0441\u0435\u0440\u0432\u0435\u0440: \u043d\u0430\u0447\u0430\u043b\u043e \u0438 \u043a\u043e\u043d\u0435\u0446 \u0437\u0430\u0435\u0437\u0434\u0430 ---------- */
  async function serverStart(g){
    if(!api.online())return{run:null,left:0};
    try{const r=await api.act('runStart',{g});return{run:r.run,left:r.left,reset:r.reset,cap:r.cap,paid:r.left>0}}catch(e){api.toast(e.message,'err');return{run:null,left:0}}
  }
  async function serverEnd(run,payload){
    if(!run)return null;
    try{return await api.act('runEnd',Object.assign({run},payload))}catch(e){if(e.pending)return{pending:true};api.toast(e.message,'err');return null}
  }
  // \u041b\u0438\u043c\u0438\u0442: \u0438\u0433\u0440\u0430\u0442\u044c \u043c\u043e\u0436\u043d\u043e \u0438 \u0434\u0430\u043b\u044c\u0448\u0435, \u043d\u043e \u0431\u0435\u0437 \u0432\u044b\u043f\u043b\u0430\u0442\u044b. \u0421\u043e\u043e\u0431\u0449\u0430\u0435\u043c \u043e\u0434\u0438\u043d \u0440\u0430\u0437 \u0437\u0430 \u0441\u0435\u0441\u0441\u0438\u044e.
  function limitCheck(sv,score){
    if(!sv||!sv.run||sv.over)return;
    if(score>=sv.left){sv.over=true;if(!warned.v){warned.v=true;warn('\u041b\u0438\u043c\u0438\u0442 \u043c\u0438\u043d\u0438-\u0438\u0433\u0440 \u043d\u0430 12 \u0447\u0430\u0441\u043e\u0432 \u043d\u0430\u0431\u0440\u0430\u043d. \u0418\u0433\u0440\u0430\u0439\u0442\u0435 \u0434\u0430\u043b\u044c\u0448\u0435 \u2014 \u0431\u0435\u0437 \u0432\u044b\u043f\u043b\u0430\u0442\u044b',4.5);api.Haptic.heavy()}}
  }
  function endHTML(title,sub,score,rows,res,offline){
    let money='';
    if(res&&res.pending)money='<p style="margin-top:8px">\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438. \u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442 \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d \u0438 \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044f, \u043a\u043e\u0433\u0434\u0430 \u0441\u0432\u044f\u0437\u044c \u0432\u0435\u0440\u043d\u0451\u0442\u0441\u044f.</p>';
    else if(res){money='<dl class="kv" style="margin-top:6px"><dt>\u0417\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u043e</dt><dd>'+fmt(res.money)+(res.capped?' \u00b7 \u043b\u0438\u043c\u0438\u0442':'')+'</dd>'+(res.keys?'<dt>\u041a\u043b\u044e\u0447\u0438</dt><dd>+'+res.keys+'</dd>':'')+'<dt>\u041e\u043f\u044b\u0442</dt><dd>+'+fmtN(res.xp)+'</dd><dt>\u0415\u0449\u0451 \u043c\u043e\u0436\u043d\u043e \u0437\u0430 12 \u0447\u0430\u0441\u043e\u0432</dt><dd>'+fmt(res.total!=null?res.total:res.left)+'</dd></dl>'}
    else if(offline)money='<p style="margin-top:8px">\u0411\u0435\u0437 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c \u0437\u0430\u0435\u0437\u0434 \u043d\u0435 \u0437\u0430\u0441\u0447\u0438\u0442\u044b\u0432\u0430\u0435\u0442\u0441\u044f.</p>';
    return'<h3>'+esc(title)+'</h3><p>'+esc(sub)+'</p><div class="big num">'+fmtN(score)+'</div>'+(res&&res.rec?'<span class="badge" style="background:#ffd60a;color:#3a2600">'+ic('star')+'\u041d\u043e\u0432\u044b\u0439 \u0440\u0435\u043a\u043e\u0440\u0434</span>':'')+
      '<dl class="kv">'+rows.map(r=>'<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>').join('')+'</dl>'+money+
      '<div class="acts"><button class="btn pri wide" data-g="again">\u0415\u0449\u0451 \u0437\u0430\u0435\u0437\u0434</button><button class="btn wide" data-g="exit">\u0412\u044b\u0439\u0442\u0438</button></div>';
  }
  function limitIntro(sv,name){
    return'<h3>\u041b\u0438\u043c\u0438\u0442 \u043d\u0430\u0431\u0440\u0430\u043d</h3><p>\u041c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b \u0432\u043c\u0435\u0441\u0442\u0435 \u043f\u043b\u0430\u0442\u044f\u0442 \u0434\u043e '+fmt(60000)+' \u0437\u0430 12 \u0447\u0430\u0441\u043e\u0432. \u0412 \u00ab'+name+'\u00bb \u043c\u043e\u0436\u043d\u043e \u043a\u0430\u0442\u0430\u0442\u044c\u0441\u044f \u0434\u0430\u043b\u044c\u0448\u0435: \u043e\u043f\u044b\u0442, \u0440\u0435\u043a\u043e\u0440\u0434\u044b \u0438 \u0437\u0430\u0434\u0430\u043d\u0438\u044f \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u044e\u0442\u0441\u044f, \u043c\u043e\u043d\u0435\u0442\u044b \u2014 \u043d\u0435\u0442.</p><div class="acts"><button class="btn pri wide" data-g="go">\u041a\u0430\u0442\u0430\u0442\u044c\u0441\u044f</button><button class="btn wide" data-g="exit">\u0412\u044b\u0439\u0442\u0438</button></div>';
  }

  /* =================================================================== */
  /* RIDER: \u0442\u0440\u0430\u043c\u043f\u043b\u0438\u043d\u044b, \u0444\u043b\u0438\u043f\u044b, \u043a\u0430\u043d\u0438\u0441\u0442\u0440\u044b. \u041f\u0440\u0438 \u0430\u0432\u0430\u0440\u0438\u0438 \u043c\u0430\u0448\u0438\u043d\u0430 \u0433\u043e\u0440\u0438\u0442 \u043d\u0430 \u043c\u0435\u0441\u0442\u0435  */
  /* =================================================================== */
  function rider(){
    const cv=shell(hudHTML('<div class="fuel" id="h-fuel"><i style="width:100%"></i></div>')+pedalsHTML);
    let {c,W,H}=fitCv(cv);
    const G=1300,DT=1/120;const scOf=()=>Math.max(.5,Math.min(1,Math.min(W/560,H/620)));let SC=scOf();
    let xs=[],ys=[],kicks=[],cans=[],genX=0,genY=0,segN=0,seed=1,nextCan=1800;
    let run=null,raf=0,last=0,acc=0,camX=0,camY=0,parts=[],flash=0;
    const look=api.look('car');
    const ctl=controls();
    let sv=null;
    const col=api.colors();
    const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
    const addPt=(x,y)=>{xs.push(x);ys.push(y)};
    const clampY=y=>Math.max(-260,Math.min(260,y));
    function flat(len){const n=Math.max(1,Math.round(len/60));const x0=genX;for(let i=1;i<=n;i++)addPt(genX+len*i/n,genY);genX+=len;placeCan(x0,genX)}
    function placeCan(a,b){if(nextCan>a&&nextCan<b-40){cans.push({x:nextCan,got:false});nextCan+=2400+rng()*1900}else if(nextCan<=a)nextCan=a+300}
    function kicker(){
      flat(160+rng()*160);
      const Lk=150+rng()*110,end=.8+rng()*.45,Hh=end*Lk/2,x0=genX,y0=genY;
      for(let i=1;i<=12;i++){const t=i/12;addPt(x0+Lk*t,y0+Hh*t*t)}
      genX=x0+Lk;const drop=rng()<.4?0:40+rng()*120,ny=clampY(y0-drop);
      addPt(genX+22,ny);kicks.push([x0,genX]);genX+=22;genY=ny;flat(500+rng()*260);
    }
    function hill(){const Lh=380+rng()*240,h=50+rng()*80,x0=genX,y0=genY;for(let i=1;i<=18;i++){const t=i/18;addPt(x0+Lh*t,y0+h*(1-Math.cos(TAU*t))/2)}genX+=Lh;flat(120)}
    function slope(dy,Ls){const x0=genX,y0=genY,ny=clampY(y0+dy);for(let i=1;i<=7;i++){const t=i/7;addPt(x0+Ls*t,y0+(ny-y0)*t*t*(3-2*t))}genX+=Ls;genY=ny;flat(160)}
    function gen(until){while(genX<until){const r=rng();segN++;if(segN<=1)flat(700);else if(r<.5)kicker();else if(r<.66)hill();else if(r<.82)slope(-(60+rng()*100),280+rng()*100);else if(r<.93)slope(40+rng()*100,330+rng()*120);else flat(220+rng()*200)}}
    function segAt(x){let lo=0,hi=xs.length-2;if(hi<0)return 0;if(x<=xs[0])return 0;if(x>=xs[hi+1])return hi;while(lo<hi){const m=(lo+hi+1)>>1;if(xs[m]<=x)lo=m;else hi=m-1}return lo}
    const segAng=i=>Math.atan2(ys[i+1]-ys[i],xs[i+1]-xs[i]);
    const segLen=i=>Math.hypot(xs[i+1]-xs[i],ys[i+1]-ys[i]);
    function gy(x){const i=segAt(x);const t=Math.max(0,Math.min(1,(x-xs[i])/(xs[i+1]-xs[i])));return ys[i]+(ys[i+1]-ys[i])*t}
    const wrap=a=>{a=(a+Math.PI)%TAU;if(a<0)a+=TAU;return a-Math.PI};
    function newRun(){
      seed=((Date.now()&0x7fffffff)^Math.floor(Math.random()*1e9))>>>0||7;
      xs=[];ys=[];kicks=[];cans=[];genX=0;genY=0;segN=0;nextCan=1500;
      addPt(-800,0);addPt(0,0);gen(4400);
      run={x:90,y:0,s:0,vx:0,vy:0,ang:0,av:0,ground:true,air:0,rot:0,t:0,score:0,maxX:90,flips:0,combo:0,best:0,perfects:0,state:'ready',endT:0,wheel:0,fuel:100,dry:0,cans:0,why:''};
      parts=[];camX=run.x-W/SC*.3;camY=run.y-H/SC*.4;warn(null);
    }
    // \u0410\u0432\u0430\u0440\u0438\u044f: \u043c\u0430\u0448\u0438\u043d\u0430 \u043e\u0441\u0442\u0430\u0451\u0442\u0441\u044f \u043d\u0430 \u0437\u0435\u043c\u043b\u0435, \u0432\u0437\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0438 \u0433\u043e\u0440\u0438\u0442
    function crash(why){
      const r=run;r.state='crash';r.endT=0;r.why=why;r.ground=true;r.y=gy(r.x);r.vx=(r.ground?r.s:r.vx)*.25;r.av=0;
      explode(r.x,r.y+20);api.Haptic.heavy();api.Snd.bad();pop('\u0410\u0432\u0430\u0440\u0438\u044f!','');flash=1;
    }
    function step(dt){
      const r=run;
      if(r.state==='crash'){
        r.endT+=dt;r.x+=r.vx*dt;r.vx*=Math.max(0,1-3*dt);r.y=gy(r.x);
        if(Math.random()<dt*40)fire(r.x+(Math.random()-.5)*60,r.y+18+Math.random()*20);
        if(r.endT>1.8)finish();return;
      }
      if(r.state!=='run')return;
      r.t+=dt;
      if(xs[xs.length-1]<r.x+3400)gen(r.x+4600);
      const fuelOk=r.fuel>0;
      const gas=ctl.gas()&&fuelOk,brake=ctl.brake();
      r.fuel=Math.max(0,r.fuel-dt*(gas?6.2:3.2));
      if(r.ground){
        const i0=segAt(r.x),th=segAng(i0);let a=0;
        if(gas)a+=r.s<0?1800:980;if(brake)a-=r.s>30?1700:420;
        a-=G*Math.sin(th);a-=.00052*r.s*Math.abs(r.s);
        if(!gas&&!brake)a-=Math.sign(r.s)*Math.min(60,Math.abs(r.s)/dt);
        r.s=Math.max(-260,Math.min(1250,r.s+a*dt));
        const nx=r.x+r.s*Math.cos(th)*dt,i1=segAt(nx);
        if(i1>i0&&r.s>60){
          const thA=segAng(i1-1),thB=segAng(i1);const k=(thA-thB)/((segLen(i1-1)+segLen(i1))/2);
          if(k>0&&r.s*r.s*k>G*Math.cos(thA)){r.ground=false;r.vx=r.s*Math.cos(thA);r.vy=r.s*Math.sin(thA);r.ang=thA;r.av=0;r.air=0;r.rot=0;r.x=nx;r.y=Math.max(r.y+r.vy*dt,gy(nx)+.5);return}
          if(thB>thA)r.s*=Math.sqrt(Math.cos(Math.min(1.2,thB-thA)));
        }
        r.x=nx;r.y=gy(nx);r.ang=segAng(segAt(nx));r.wheel+=r.s*dt/13;
        if(!fuelOk){r.dry+=dt;if(Math.abs(r.s)<25||r.dry>6){r.why='\u0422\u043e\u043f\u043b\u0438\u0432\u043e \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u043e\u0441\u044c';finish()}}
      }else{
        r.vy-=G*dt;r.x+=r.vx*dt;r.y+=r.vy*dt;
        const tq=(ctl.gas()?1:0)-(brake?1:0);
        if(tq)r.av+=tq*26*dt;else r.av*=Math.max(0,1-4.5*dt);
        r.av=Math.max(-11,Math.min(11,r.av));r.ang+=r.av*dt;r.rot+=r.av*dt;r.air+=dt;r.wheel+=(ctl.gas()?30:6)*dt;
        const g=gy(r.x);if(r.y<=g)land(g);
      }
      for(const cn of cans){if(cn.got||Math.abs(cn.x-r.x)>36)continue;const cy=gy(cn.x)+28;if(Math.abs(r.y+24-cy)<46){cn.got=true;r.fuel=Math.min(100,r.fuel+38);r.cans++;r.dry=0;pop('+\u0442\u043e\u043f\u043b\u0438\u0432\u043e','');burst(cn.x,cy,10,'can');api.Snd.coin();api.Haptic.tap()}}
      if(r.x>r.maxX){r.score+=(r.x-r.maxX)*.05;r.maxX=r.x}
      limitCheck(sv,r.score);
    }
    function land(g){
      const r=run,th=segAng(segAt(r.x)),diff=wrap(r.ang-th);
      if(Math.abs(diff)>1.05){r.y=g;r.s=r.vx;crash('\u0410\u0432\u0430\u0440\u0438\u044f');return}
      const flips=Math.floor((Math.abs(r.rot)+1.05)/TAU);const perfect=Math.abs(diff)<.2;let pts=0;const lab=[];
      if(r.air>.5)pts+=Math.round(r.air*250);
      if(flips>0){const front=r.rot<0;pts+=flips*(front?1900:1500);lab.push((flips>1?flips+'\u00d7 ':'')+(front?'\u0444\u0440\u043e\u043d\u0442\u0444\u043b\u0438\u043f':'\u0431\u044d\u043a\u0444\u043b\u0438\u043f'));r.flips+=flips;r.combo++}else if(Math.abs(diff)>.45)r.combo=0;
      let mult=1;if(pts>0&&perfect){mult*=1.5;lab.push('\u0438\u0434\u0435\u0430\u043b\u044c\u043d\u043e');r.perfects++}
      if(flips>0&&r.combo>1){const m=1+.25*(r.combo-1);mult*=m;lab.push('\u043a\u043e\u043c\u0431\u043e \u00d7'+String(+m.toFixed(2)).replace('.',','))}
      pts=Math.round(pts*mult);
      if(pts>0){r.score+=pts;r.best=Math.max(r.best,pts);pop('+'+fmtN(pts),lab.join(', ')||'\u043f\u043e\u043b\u0451\u0442');if(flips)api.Haptic.ok()}
      else if(Math.abs(diff)>.6)pop('\u0416\u0451\u0441\u0442\u043a\u043e!','');
      let s=r.vx*Math.cos(th)+r.vy*Math.sin(th);s*=1-.45*Math.abs(Math.sin(diff));r.s=s;r.y=g;r.ground=true;r.ang=th;r.av=0;
      burst(r.x,g,6+Math.min(16,Math.abs(r.vy)/80),'dust');
    }
    async function finish(){
      const r=run;if(!r||r.state==='done')return;r.state='done';ctl.clear();warn(null);
      const score=Math.round(r.score),pps=r.t>0?Math.round(score/r.t):0;
      overlay('<h3>\u0421\u0447\u0438\u0442\u0430\u0435\u043c\u2026</h3><div class="big num">'+fmtN(score)+'</div>');
      const res=await serverEnd(sv&&sv.run,{score,flips:r.flips,dur:Math.round(r.t*1000)/1000});
      overlay(endHTML(r.why||'\u0424\u0438\u043d\u0438\u0448','',score,[['\u0414\u0438\u0441\u0442\u0430\u043d\u0446\u0438\u044f',fmtN(Math.round(r.maxX/20))+' \u043c'],['\u0424\u043b\u0438\u043f\u044b',fmtN(r.flips)],['\u041b\u0443\u0447\u0448\u0438\u0439 \u0442\u0440\u044e\u043a',fmtN(r.best)],['\u041e\u0447\u043a\u043e\u0432 \u0432 \u0441\u0435\u043a\u0443\u043d\u0434\u0443',fmtN(pps)],['\u041a\u0430\u043d\u0438\u0441\u0442\u0440\u044b',fmtN(r.cans)]],res,!(sv&&sv.run)));
      if(res&&res.rec)api.Snd.win(4);
    }
    function burst(x,y,n,kind){for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.3)*(kind==='spark'?520:260),vy:Math.random()*(kind==='spark'?420:200),life:.6,max:.6,kind,s:1})}
    function explode(x,y){
      for(let i=0;i<46;i++){const a=Math.random()*Math.PI,v=180+Math.random()*520;parts.push({x,y,vx:Math.cos(a)*v*(Math.random()<.5?-1:1),vy:Math.sin(a)*v,life:.5+Math.random()*.5,max:1,kind:'boom',s:1+Math.random()*2})}
      for(let i=0;i<14;i++)parts.push({x:x+(Math.random()-.5)*40,y:y+Math.random()*20,vx:(Math.random()-.5)*90,vy:60+Math.random()*90,life:1.4+Math.random(),max:2.4,kind:'smoke',s:2+Math.random()*2});
      for(let i=0;i<10;i++)parts.push({x,y,vx:(Math.random()-.5)*600,vy:200+Math.random()*400,life:1.2,max:1.2,kind:'debris',s:1});
    }
    function fire(x,y){parts.push({x,y,vx:(Math.random()-.5)*40,vy:80+Math.random()*90,life:.5+Math.random()*.4,max:.9,kind:'fire',s:1+Math.random()*1.4,ng:1});if(Math.random()<.35)parts.push({x,y:y+20,vx:(Math.random()-.5)*30,vy:50+Math.random()*40,life:1.6,max:1.6,kind:'smoke',s:2+Math.random()*2,ng:1})}
    const sx=x=>(x-camX)*SC,sy=y=>H-(y-camY)*SC;
    function hills(par,color,base,amp,freq){c.beginPath();c.moveTo(0,H);for(let px=0;px<=W+24;px+=24){const wx=px/SC+camX*par;c.lineTo(px,base-(Math.sin(wx*freq)*amp+Math.sin(wx*freq*2.3+1.3)*amp*.45)*Math.max(.6,SC))}c.lineTo(W,H);c.closePath();c.fillStyle=color;c.fill()}
    // \u0421\u0434\u0432\u0438\u0433, \u0447\u0442\u043e\u0431\u044b \u043f\u0435\u0440\u0435\u0432\u0451\u0440\u043d\u0443\u0442\u0430\u044f \u043c\u0430\u0448\u0438\u043d\u0430 \u043b\u0435\u0436\u0430\u043b\u0430 \u043d\u0430 \u0437\u0435\u043c\u043b\u0435, \u0430 \u043d\u0435 \u0443\u0445\u043e\u0434\u0438\u043b\u0430 \u043f\u043e\u0434 \u043d\u0435\u0451
    function liftFor(ang){const s=Math.sin(-ang),co=Math.cos(-ang);let m=0;for(const [px,py] of [[-52,0],[52,0],[-52,-58],[52,-58],[0,-58]]){const y=px*s+py*co;if(y>m)m=y}return m}
    function draw(){
      const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,col.sky1);g.addColorStop(1,col.sky2);c.fillStyle=g;c.fillRect(0,0,W,H);
      hills(.2,col.hill1,H*.52,70,.0026);hills(.45,col.hill2,H*.68,48,.0052);
      if(!xs.length)return;
      const x0=camX-60,x1=camX+W/SC+60;let i0=segAt(x0),i1=i0;while(i1<xs.length-1&&xs[i1]<x1)i1++;
      c.beginPath();c.moveTo(sx(xs[i0]),H+20);for(let i=i0;i<=i1;i++)c.lineTo(sx(xs[i]),sy(ys[i]));c.lineTo(sx(xs[i1]),H+20);c.closePath();c.fillStyle=col.ground;c.fill();
      c.beginPath();for(let i=i0;i<=i1;i++){const X=sx(xs[i]),Y=sy(ys[i]);i===i0?c.moveTo(X,Y):c.lineTo(X,Y)}c.lineJoin='round';c.lineWidth=Math.max(3,6*SC);c.strokeStyle=col.groundTop;c.stroke();
      c.save();c.setLineDash([22*SC,26*SC]);c.lineWidth=Math.max(1.5,2.5*SC);c.strokeStyle=col.road;c.globalAlpha=.5;c.beginPath();for(let i=i0;i<=i1;i++){const X=sx(xs[i]),Y=sy(ys[i])+9*SC;i===i0?c.moveTo(X,Y):c.lineTo(X,Y)}c.stroke();c.restore();
      for(const k of kicks){if(k[1]<x0||k[0]>x1)continue;const a=segAt(k[0]),b=segAt(k[1]-1);c.save();c.lineWidth=Math.max(4,8*SC);for(let pass=0;pass<2;pass++){c.setLineDash(pass?[12*SC,12*SC]:[]);c.strokeStyle=pass?'#fff':'#ff8a00';c.beginPath();for(let i=a;i<=b+1;i++){const X=sx(xs[i]),Y=sy(ys[i]);i===a?c.moveTo(X,Y):c.lineTo(X,Y)}c.stroke()}c.restore()}
      for(const cn of cans){if(cn.got||cn.x<x0||cn.x>x1)continue;const X=sx(cn.x),Y=sy(gy(cn.x)+28+Math.sin(performance.now()/300+cn.x)*4);c.save();c.translate(X,Y);c.scale(SC,SC);c.fillStyle='#ff3b30';api.rr(c,-11,-15,22,30,4);c.fill();c.fillStyle='#c4261d';c.fillRect(-11,-4,22,5);c.fillStyle='#ffd60a';c.fillRect(-5,-21,10,6);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=2;c.beginPath();c.moveTo(-6,8);c.lineTo(6,-10);c.stroke();c.restore()}
      c.font='600 '+Math.max(10,13*SC)+'px -apple-system,Arial';c.textAlign='center';
      for(let m=Math.ceil(x0/2000)*2000;m<x1;m+=2000){if(m<=0)continue;const X=sx(m),Y=sy(gy(m));c.fillStyle=col.road;c.fillRect(X-2*SC,Y-46*SC,4*SC,46*SC);c.fillStyle='#ff8a00';api.rr(c,X-18*SC,Y-64*SC,36*SC,20*SC,5*SC);c.fill();c.fillStyle='#fff';c.fillText((m/20)+' \u043c',X,Y-50*SC)}
      if(run){
        const r=run;const crashed=r.state==='crash'||(r.state==='done'&&r.why==='\u0410\u0432\u0430\u0440\u0438\u044f');
        c.save();c.translate(sx(r.x),sy(r.y));c.rotate(-r.ang);
        if(crashed){c.restore();c.save();c.translate(sx(r.x),sy(r.y)-liftFor(r.ang)*SC);c.rotate(-r.ang)}
        api.Draw.car(c,0,0,SC,look,{wheelRot:r.wheel,noShadow:!r.ground||crashed});
        if(crashed){c.globalCompositeOperation='multiply';c.fillStyle='rgba(40,30,25,.55)';api.rr(c,-54*SC,-60*SC,108*SC,62*SC,10*SC);c.fill();c.globalCompositeOperation='source-over'}
        c.restore();
      }
      for(const p of parts){
        const a=Math.max(0,p.life/p.max);const X=sx(p.x),Y=sy(p.y);
        if(p.kind==='fire'||p.kind==='boom'){c.globalAlpha=Math.min(1,a*1.4);const rad=(p.kind==='boom'?6:8)*p.s*SC*(p.kind==='fire'?a+.3:1);const gr=c.createRadialGradient(X,Y,0,X,Y,rad);gr.addColorStop(0,'#fff6b0');gr.addColorStop(.4,'#ffb020');gr.addColorStop(1,'rgba(255,60,0,0)');c.fillStyle=gr;c.beginPath();c.arc(X,Y,rad,0,TAU);c.fill()}
        else if(p.kind==='smoke'){c.globalAlpha=a*.45;c.fillStyle='#3a3a3f';c.beginPath();c.arc(X,Y,(10+(1-a)*26)*p.s*SC,0,TAU);c.fill()}
        else{c.globalAlpha=a;c.fillStyle=p.kind==='spark'?(Math.random()<.5?'#ff8a00':'#ffd23f'):p.kind==='can'?'#ffd60a':p.kind==='debris'?'#22252b':col.road;const s=(p.kind==='spark'?3:p.kind==='debris'?6:5)*SC;c.fillRect(X-s/2,Y-s/2,s,s)}
      }
      c.globalAlpha=1;
      if(flash>0){c.fillStyle='rgba(255,220,150,'+(flash*.55)+')';c.fillRect(0,0,W,H)}
    }
    let lastHud='';
    function hud(){
      if(!run)return;const s=fmtN(Math.round(run.score));const sub=fmtN(Math.round(run.maxX/20))+' \u043c \u00b7 '+fmtN(run.t>1?Math.round(run.score/run.t):0)+' \u043e\u0447\u043a/\u0441'+(sv&&sv.over?' \u00b7 \u0431\u0435\u0437 \u0432\u044b\u043f\u043b\u0430\u0442\u044b':'');
      const k=s+'|'+sub+'|'+Math.round(run.fuel);if(k===lastHud)return;lastHud=k;
      root.querySelector('#h-sc').textContent=s;root.querySelector('#h-sub').textContent=sub;
      const f=root.querySelector('#h-fuel i');if(f)f.style.width=run.fuel.toFixed(0)+'%';
    }
    function loop(ts){
      raf=requestAnimationFrame(loop);const dt=Math.min(.05,Math.max(0,(ts-last)/1000));last=ts;
      if(run&&(run.state==='run'||run.state==='crash')){acc+=dt;let n=0;while(acc>=DT&&n<14){step(DT);acc-=DT;n++}}
      for(const p of parts){if(p.kind==='smoke'||p.kind==='fire'){p.vx*=.98;p.x+=p.vx*dt;p.y+=p.vy*dt}else{p.vy-=900*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.kind==='debris'){const g=gy(p.x);if(p.y<g){p.y=g;p.vy*=-.3;p.vx*=.6}}}p.life-=dt}parts=parts.filter(p=>p.life>0);
      if(flash>0)flash=Math.max(0,flash-dt*3);
      if(run){const r=run;const look2=(r.ground?r.s:r.vx)*.18;const tx=r.x-W/SC*.3+Math.max(-80,Math.min(220,look2)),ty=r.y-H/SC*.42;camX+=(tx-camX)*Math.min(1,dt*6);camY+=(ty-camY)*Math.min(1,dt*4)}
      if(run&&run.x-xs[0]>3000&&run.state==='run'){let cut=0;while(cut<xs.length-4&&xs[cut+1]<run.x-1600)cut++;if(cut>0){xs.splice(0,cut);ys.splice(0,cut);kicks=kicks.filter(k=>k[1]>run.x-1600);cans=cans.filter(k=>k.x>run.x-1600)}}
      draw();hud();tickPop(dt);
    }
    async function start(){
      newRun();overlay('<h3>\u0413\u043e\u0442\u043e\u0432\u0438\u043c\u0441\u044f\u2026</h3>');
      sv=await serverStart('rider');
      if(sv.run&&sv.left<=0){sv.over=true;if(!warned.v){warned.v=true;overlay(limitIntro(sv,'Rider'));return}}
      go();
    }
    function go(){overlay(null);run.state='run';ctl.clear();acc=0;last=performance.now();api.Music.play()}
    function intro(){newRun();overlay('<h3>Rider</h3><p>\u041f\u0440\u0430\u0432\u0430\u044f \u043f\u043e\u043b\u043e\u0432\u0438\u043d\u0430 \u044d\u043a\u0440\u0430\u043d\u0430 \u2014 \u0433\u0430\u0437, \u043b\u0435\u0432\u0430\u044f \u2014 \u0442\u043e\u0440\u043c\u043e\u0437. \u0412 \u0432\u043e\u0437\u0434\u0443\u0445\u0435 \u0433\u0430\u0437 \u043a\u0440\u0443\u0442\u0438\u0442 \u043d\u0430\u0437\u0430\u0434, \u0442\u043e\u0440\u043c\u043e\u0437 \u2014 \u0432\u043f\u0435\u0440\u0451\u0434. \u0421\u043e\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u043a\u0430\u043d\u0438\u0441\u0442\u0440\u044b: \u0442\u043e\u043f\u043b\u0438\u0432\u043e \u043a\u043e\u043d\u0447\u0430\u0435\u0442\u0441\u044f. \u041e\u0434\u043d\u043e \u043e\u0447\u043a\u043e \u2014 \u043e\u0434\u043d\u0430 \u043c\u043e\u043d\u0435\u0442\u0430.</p><div class="acts"><button class="btn pri wide" data-g="start">\u041f\u043e\u0435\u0445\u0430\u043b\u0438</button><button class="btn wide" data-g="exit">\u0412\u044b\u0439\u0442\u0438</button></div>')}
    const onResize=()=>{({c,W,H}=fitCv(cv));SC=scOf()};window.addEventListener('resize',onResize);
    intro();last=performance.now();raf=requestAnimationFrame(loop);
    const vis=()=>{if(document.hidden&&run&&run.state==='run')pause()};document.addEventListener('visibilitychange',vis);
    function pause(){if(run&&run.state==='run'){run.state='pause';ctl.clear();overlay('<h3>\u041f\u0430\u0443\u0437\u0430</h3><p>\u0417\u0430\u0435\u0437\u0434 \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d.</p><div class="acts"><button class="btn pri wide" data-g="resume">\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c</button><button class="btn wide" data-g="quit">\u0417\u0430\u043a\u043e\u043d\u0447\u0438\u0442\u044c \u0437\u0430\u0435\u0437\u0434</button></div>')}}
    return{
      stop(){cancelAnimationFrame(raf);ctl.off();window.removeEventListener('resize',onResize);document.removeEventListener('visibilitychange',vis)},
      cmd(k){
        if(k==='start')start();else if(k==='go')go();else if(k==='pause')pause();
        else if(k==='resume'){if(run&&run.state==='pause'){run.state='run';overlay(null);last=performance.now()}}
        else if(k==='quit'){if(run){run.why='\u0417\u0430\u0435\u0437\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d';run.state='run';finish()}}
        else if(k==='again'){intro()}else if(k==='exit'){if(run&&run.state==='pause'){run.why='\u0417\u0430\u0435\u0437\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d';run.state='run';finish().then(close)}else close()}
      },
      _t:{get r(){return run},crash}
    };
  }

  /* =================================================================== */
  /* \u0421\u0422\u0410\u041d\u0422 \u0432 \u0434\u0443\u0445\u0435 Wheelie Life: \u0441\u043d\u0438\u0437\u0443 \u0422\u041e\u0420\u041c\u041e\u0417 \u0438 \u0413\u0410\u0417, \u0432 \u0446\u0435\u043d\u0442\u0440\u0435 \u0437\u043e\u043d\u0430 \u0422\u0420\u042e\u041a    */
  /* =================================================================== */
  const TRICKS=[['nohands','\u0411\u0435\u0437 \u0440\u0443\u043a'],['stand','\u0421\u0442\u043e\u044f \u043d\u0430 \u043f\u043e\u0434\u043d\u043e\u0436\u043a\u0430\u0445'],['superman','\u0421\u0443\u043f\u0435\u0440\u043c\u0435\u043d'],['seat','\u041d\u0430 \u043a\u0440\u044b\u043b\u0435'],['leg','\u041d\u043e\u0433\u0430 \u0432\u043f\u0435\u0440\u0451\u0434']];
  function stunt(){
    const cv=shell(hudHTML('<div id="h-st" style="margin-top:6px;color:#fff;font:700 15px -apple-system,sans-serif;text-shadow:0 1px 6px rgba(0,0,0,.5)"></div>')+
      '<div class="wl"><button class="wl-trick" id="p-trick" aria-label="\u0422\u0440\u044e\u043a"><span>\u0422\u0420\u042e\u041a</span></button><div class="wl-ped"><button class="wl-btn" id="p-brake" aria-label="\u0422\u043e\u0440\u043c\u043e\u0437">\u0422\u041e\u0420\u041c\u041e\u0417</button><button class="wl-btn gas" id="p-gas" aria-label="\u0413\u0430\u0437">\u0413\u0410\u0417</button></div></div>');
    let {c,W,H}=fitCv(cv);
    const look=api.look('bike');const col=api.colors();
    const ctl=controls({noCanvas:true,onTrick:()=>trick()});
    const VMAX=700,LIFT=13,GRAV=7.6,BRK=11,DAMP=1.7,LOOP=1.9,BAL=[1.12,1.45];
    let b=null,raf=0,last=0,acc=0,sv=null;const DT=1/120;
    const scale=()=>Math.max(1,Math.min(1.6,Math.min(H/480,W/240)));
    function newRun(){b={x:0,v:0,th:0,w:0,t:0,score:0,ground:0,streak:0,best:0,state:'ready',why:'',wt:0,crashT:0,label:'',trick:null,tricks:0,tn:0,trickBest:0};warn(null)}
    function trick(){
      if(!b||b.state!=='run')return;
      if(b.trick){return}
      if(b.th<.55){pop('\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u0438\u043b\u043b\u0438','\u0434\u0435\u0440\u0436\u0438\u0442\u0435 \u0433\u0430\u0437, \u0447\u0442\u043e\u0431\u044b \u043f\u043e\u0434\u043d\u044f\u0442\u044c \u043a\u043e\u043b\u0435\u0441\u043e');return}
      const t=TRICKS[(b.tn+Math.floor(Math.random()*TRICKS.length))%TRICKS.length];b.tn++;
      b.trick={k:t[0],n:t[1],t:0,dur:1.1,wob:(Math.random()<.5?-1:1)*(1.2+Math.random())};api.Haptic.tap();
    }
    const tb=root.querySelector('#p-trick');tb.addEventListener('pointerdown',e=>{e.preventDefault();trick();tb.classList.add('on');setTimeout(()=>tb.classList.remove('on'),120)});
    function step(dt){
      if(b.state==='crash'){b.crashT+=dt;b.v=Math.max(0,b.v-600*dt);b.x+=b.v*dt;b.th+=b.w*dt;b.w*=.96;if(b.crashT>1.2)finish();return}
      if(b.state!=='run')return;
      b.t+=dt;const gas=ctl.gas(),brake=ctl.brake();
      // \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c
      let a=0;if(gas)a+=430*(1-b.v/VMAX);if(brake)a-=520;a-=b.v*.05;
      b.v=Math.max(0,Math.min(VMAX,b.v+a*dt));b.x+=b.v*dt;
      // \u043f\u043e\u0434\u044a\u0451\u043c \u043f\u0435\u0440\u0435\u0434\u043d\u0435\u0433\u043e \u043a\u043e\u043b\u0435\u0441\u0430: \u0433\u0430\u0437 \u043f\u043e\u0434\u043d\u0438\u043c\u0430\u0435\u0442 \u043d\u0430 \u043b\u044e\u0431\u043e\u0439 \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u0438 (\u043f\u043e\u0441\u043b\u0435 \u043f\u0440\u0438\u0437\u0435\u043c\u043b\u0435\u043d\u0438\u044f \u0442\u043e\u0436\u0435)
      const lift=gas?LIFT*(.6+.4*Math.min(1,b.v/220))*(1-.45*Math.min(1,b.th/1.6)):0;
      let al=lift-GRAV*Math.cos(b.th)-(brake&&b.th>0?BRK:0)-DAMP*b.w;
      if(b.trick)al+=b.trick.wob*Math.sin(b.trick.t*9);
      b.w+=al*dt;b.th+=b.w*dt;
      if(b.th<=0){if(b.w<-2.2&&b.streak>.3)api.Haptic.tap();b.th=0;b.w=Math.max(0,b.w);if(b.trick){pop('\u0422\u0440\u044e\u043a \u0441\u043e\u0440\u0432\u0430\u043d','');b.trick=null}}
      if(b.th>LOOP){crash('\u041f\u0435\u0440\u0435\u0432\u0435\u0440\u043d\u0443\u043b\u0441\u044f \u0447\u0435\u0440\u0435\u0437 \u0441\u043f\u0438\u043d\u0443');return}
      // \u043e\u0447\u043a\u0438: \u0431\u044b\u0441\u0442\u0440\u0435\u0435, \u0447\u0435\u043c \u0440\u0430\u043d\u044c\u0448\u0435; \u0431\u0430\u043b\u0430\u043d\u0441 \u00d71,5, \u0441\u0435\u0440\u0438\u044f \u0434\u043e \u00d72, \u0442\u0440\u044e\u043a\u0438 \u0441\u0432\u0435\u0440\u0445\u0443
      const kmh=b.v/20*3.6;let rate=0;b.label='';
      if(b.th>.35){
        b.streak+=dt;b.wt+=dt;
        const sweet=b.th>=BAL[0]&&b.th<=BAL[1];
        const mult=(sweet?1.5:1)*(1+Math.min(b.streak,20)*.05)*(b.trick?2:1);
        rate=(40+kmh*1.6)*mult;b.label=(b.trick?b.trick.n+' \u00d72':sweet?'\u0411\u0430\u043b\u0430\u043d\u0441 \u00d71,5':'\u0412\u0438\u043b\u043b\u0438')+' \u00b7 \u0441\u0435\u0440\u0438\u044f \u00d7'+(1+Math.min(b.streak,20)*.05).toFixed(2).replace('.',',');
        if(b.v<5)rate=0;
      }else{if(b.streak>b.best)b.best=b.streak;b.streak=0}
      b.score+=rate*dt;
      // \u0442\u0440\u044e\u043a
      if(b.trick){b.trick.t+=dt;if(b.trick.t>=b.trick.dur){if(b.th>.35){b.tricks++;const bonus=300+150*Math.min(10,b.tricks);b.score+=bonus;b.trickBest=Math.max(b.trickBest,bonus);pop(b.trick.n+'!','+'+fmtN(bonus));api.Haptic.ok();api.Snd.coin()}b.trick=null}}
      // \u0434\u043e\u043b\u0433\u043e \u043d\u0430 \u0434\u0432\u0443\u0445 \u043a\u043e\u043b\u0451\u0441\u0430\u0445 \u2014 \u043a\u043e\u043d\u0435\u0446 \u0437\u0430\u0435\u0437\u0434\u0430
      if(b.th<.06){b.ground+=dt;if(b.ground>3){b.why='\u0421\u043b\u0438\u0448\u043a\u043e\u043c \u0434\u043e\u043b\u0433\u043e \u043d\u0430 \u0434\u0432\u0443\u0445 \u043a\u043e\u043b\u0451\u0441\u0430\u0445';b.state='crash';b.crashT=.9;finish();return}}else b.ground=0;
      limitCheck(sv,b.score);
    }
    function crash(why){b.why=why;b.state='crash';b.crashT=0;b.w*=.5;b.trick=null;api.Haptic.heavy();api.Snd.bad();pop(why,'')}
    async function finish(){
      if(!b||b.state==='done')return;b.state='done';ctl.clear();warn(null);if(b.streak>b.best)b.best=b.streak;
      const score=Math.round(b.score);
      overlay('<h3>\u0421\u0447\u0438\u0442\u0430\u0435\u043c\u2026</h3><div class="big num">'+fmtN(score)+'</div>');
      const res=await serverEnd(sv&&sv.run,{score,wt:Math.round(b.wt),tricks:b.tricks,dur:Math.round(b.t*1000)/1000});
      const f1=x=>x.toFixed(1).replace('.',',')+' \u0441';
      overlay(endHTML(b.why||'\u0424\u0438\u043d\u0438\u0448','',score,[['\u0414\u0438\u0441\u0442\u0430\u043d\u0446\u0438\u044f',fmtN(Math.round(b.x/20))+' \u043c'],['\u041d\u0430 \u0437\u0430\u0434\u043d\u0435\u043c \u043a\u043e\u043b\u0435\u0441\u0435',f1(b.wt)],['\u041b\u0443\u0447\u0448\u0430\u044f \u0441\u0435\u0440\u0438\u044f',f1(b.best)],['\u0422\u0440\u044e\u043a\u0438',fmtN(b.tricks)],['\u041e\u0447\u043a\u043e\u0432 \u0432 \u0441\u0435\u043a\u0443\u043d\u0434\u0443',fmtN(b.t>0?Math.round(score/b.t):0)]],res,!(sv&&sv.run)));
      if(res&&res.rec)api.Snd.win(4);
    }
    function draw(){
      const s=scale();const gy=H*.64;
      const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,col.sky1);g.addColorStop(1,col.sky2);c.fillStyle=g;c.fillRect(0,0,W,H);
      // \u043c\u043e\u0440\u0435 \u0438 \u043d\u0430\u0431\u0435\u0440\u0435\u0436\u043d\u0430\u044f, \u043a\u0430\u043a \u0432 Wheelie Life
      c.fillStyle='rgba(30,140,200,.55)';c.fillRect(0,gy-70,W,40);
      const off=b?b.x*.15:0;
      for(let i=-1;i<Math.ceil(W/70)+2;i++){const k=Math.floor(off/70)+i;const h=40+((k*7919)%9)*10;const x=i*70-(off%70);c.fillStyle=col.hill1;c.fillRect(x,gy-h-70,62,h)}
      c.fillStyle=col.hill2;c.fillRect(0,gy-30,W,30);
      // \u043e\u0433\u0440\u0430\u0436\u0434\u0435\u043d\u0438\u0435
      const off2=b?b.x*.9:0;c.fillStyle='#c9d0d8';c.fillRect(0,gy-26,W,5);for(let i=-1;i<Math.ceil(W/90)+2;i++){const x=i*90-(off2%90);c.fillRect(x,gy-26,5,26)}
      c.fillStyle=col.ground;c.fillRect(0,gy,W,H-gy);
      c.fillStyle='#ffd60a';c.fillRect(0,gy+4,W,4);
      c.strokeStyle=col.road;c.globalAlpha=.6;c.lineWidth=4;c.setLineDash([36,30]);c.lineDashOffset=b?b.x%66:0;c.beginPath();c.moveTo(0,gy+42);c.lineTo(W,gy+42);c.stroke();c.setLineDash([]);c.globalAlpha=1;
      if(b){c.fillStyle=col.road;c.font='600 12px -apple-system,Arial';c.textAlign='center';for(let m=Math.ceil((b.x-W)/400)*400;m<b.x+W;m+=400){const X=W*.46+(m-b.x);if(X<-20||X>W+20)continue;c.globalAlpha=.7;c.fillRect(X-1,gy+14,2,14);c.fillText((m/20)+' \u043c',X,gy+64);c.globalAlpha=1}}
      if(!b)return;
      const rx=W*.46;
      api.Draw.bike(c,rx,gy,s,look,{pitch:b.th,wheelRot:b.x/12,pose:b.trick?b.trick.k:'ride'});
      // \u0448\u043a\u0430\u043b\u0430 \u043d\u0430\u043a\u043b\u043e\u043d\u0430: \u0437\u0435\u043b\u0451\u043d\u0430\u044f \u0437\u043e\u043d\u0430 \u0431\u0430\u043b\u0430\u043d\u0441\u0430, \u043a\u0440\u0430\u0441\u043d\u0430\u044f \u2014 \u043e\u043f\u0440\u043e\u043a\u0438\u0434\u044b\u0432\u0430\u043d\u0438\u0435
      const bw=Math.min(260,W*.62),bx=(W-bw)/2,by=gy+78;
      c.fillStyle='rgba(0,0,0,.28)';api.rr(c,bx,by,bw,10,5);c.fill();
      const zone=v=>bx+bw*Math.max(0,Math.min(1,v/LOOP));
      c.fillStyle='rgba(48,209,88,.85)';c.fillRect(zone(BAL[0]),by,zone(BAL[1])-zone(BAL[0]),10);
      c.fillStyle='rgba(255,69,58,.85)';c.fillRect(zone(LOOP-.25),by,zone(LOOP)-zone(LOOP-.25),10);
      c.fillStyle='#fff';c.beginPath();c.arc(zone(b.th),by+5,8,0,TAU);c.fill();
      if(b.state==='run'&&b.th<.06&&b.ground>.6){c.fillStyle='rgba(255,69,58,.95)';c.font='700 15px -apple-system,Arial';c.textAlign='center';c.fillText('\u0416\u043c\u0438 \u0413\u0410\u0417 \u2014 \u043f\u043e\u0434\u043d\u0438\u043c\u0430\u0439 \u043a\u043e\u043b\u0435\u0441\u043e! '+(3-b.ground).toFixed(1).replace('.',',')+' \u0441',W/2,by+32)}
    }
    let lastHud='';
    function hud(){if(!b)return;const s=fmtN(Math.round(b.score));const kmh=Math.round(b.v/20*3.6);const sub=kmh+' \u043a\u043c/\u0447'+(sv&&sv.over?' \u00b7 \u0431\u0435\u0437 \u0432\u044b\u043f\u043b\u0430\u0442\u044b':'');const st=b.label||'';const k=s+sub+st;if(k===lastHud)return;lastHud=k;root.querySelector('#h-sc').textContent=s;root.querySelector('#h-sub').textContent=sub;root.querySelector('#h-st').textContent=st}
    function loop(ts){raf=requestAnimationFrame(loop);const dt=Math.min(.05,Math.max(0,(ts-last)/1000));last=ts;if(b&&(b.state==='run'||b.state==='crash')){acc+=dt;let n=0;while(acc>=DT&&n<14){step(DT);acc-=DT;n++}}draw();hud();tickPop(dt)}
    async function start(){newRun();overlay('<h3>\u0413\u043e\u0442\u043e\u0432\u0438\u043c\u0441\u044f\u2026</h3>');sv=await serverStart('stunt');if(sv.run&&sv.left<=0){sv.over=true;if(!warned.v){warned.v=true;overlay(limitIntro(sv,'\u0421\u0442\u0430\u043d\u0442'));return}}go()}
    function go(){overlay(null);b.state='run';ctl.clear();acc=0;last=performance.now();api.Music.play()}
    function intro(){newRun();overlay('<h3>\u0421\u0442\u0430\u043d\u0442</h3><p>\u0414\u0435\u0440\u0436\u0438\u0442\u0435 <b>\u0413\u0410\u0417</b> \u2014 \u043f\u0435\u0440\u0435\u0434\u043d\u0435\u0435 \u043a\u043e\u043b\u0435\u0441\u043e \u043f\u043e\u0434\u043d\u0438\u043c\u0430\u0435\u0442\u0441\u044f. <b>\u0422\u041e\u0420\u041c\u041e\u0417</b> \u043e\u043f\u0443\u0441\u043a\u0430\u0435\u0442 \u0435\u0433\u043e. \u0414\u0435\u0440\u0436\u0438\u0442\u0435 \u0442\u043e\u0447\u043a\u0443 \u0432 \u0437\u0435\u043b\u0451\u043d\u043e\u0439 \u0437\u043e\u043d\u0435 \u2014 \u043e\u0447\u043a\u0438 \u00d71,5, \u0430 \u0447\u0435\u043c \u0434\u043e\u043b\u044c\u0448\u0435 \u0432\u0438\u043b\u043b\u0438, \u0442\u0435\u043c \u0432\u044b\u0448\u0435 \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c \u0441\u0435\u0440\u0438\u0438. \u041d\u0430\u0436\u043c\u0438\u0442\u0435 <b>\u0422\u0420\u042e\u041a</b> \u0432\u043e \u0432\u0440\u0435\u043c\u044f \u0432\u0438\u043b\u043b\u0438 \u2014 \u0433\u043e\u043d\u0449\u0438\u043a \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442 \u0442\u0440\u044e\u043a: \u043e\u0447\u043a\u0438 \u00d72 \u0438 \u0431\u043e\u043d\u0443\u0441. \u041f\u0435\u0440\u0435\u0432\u0435\u0440\u043d\u0443\u043b\u0441\u044f \u0438\u043b\u0438 3 \u0441\u0435\u043a\u0443\u043d\u0434\u044b \u043d\u0430 \u0434\u0432\u0443\u0445 \u043a\u043e\u043b\u0451\u0441\u0430\u0445 \u2014 \u043a\u043e\u043d\u0435\u0446 \u0437\u0430\u0435\u0437\u0434\u0430.</p><div class="acts"><button class="btn pri wide" data-g="start">\u041f\u043e\u0435\u0445\u0430\u043b\u0438</button><button class="btn wide" data-g="exit">\u0412\u044b\u0439\u0442\u0438</button></div>')}
    const onResize=()=>{({c,W,H}=fitCv(cv))};window.addEventListener('resize',onResize);
    intro();last=performance.now();raf=requestAnimationFrame(loop);
    const vis=()=>{if(document.hidden&&b&&b.state==='run')pause()};document.addEventListener('visibilitychange',vis);
    function pause(){if(b&&b.state==='run'){b.state='pause';ctl.clear();overlay('<h3>\u041f\u0430\u0443\u0437\u0430</h3><div class="acts"><button class="btn pri wide" data-g="resume">\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c</button><button class="btn wide" data-g="quit">\u0417\u0430\u043a\u043e\u043d\u0447\u0438\u0442\u044c \u0437\u0430\u0435\u0437\u0434</button></div>')}}
    return{
      stop(){cancelAnimationFrame(raf);ctl.off();window.removeEventListener('resize',onResize);document.removeEventListener('visibilitychange',vis)},
      cmd(k){if(k==='start')start();else if(k==='go')go();else if(k==='pause')pause();else if(k==='resume'){if(b&&b.state==='pause'){b.state='run';overlay(null);last=performance.now()}}else if(k==='quit'){if(b){b.why='\u0417\u0430\u0435\u0437\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d';b.state='run';finish()}}else if(k==='again')intro();else if(k==='exit'){if(b&&b.state==='pause'){b.why='\u0417\u0430\u0435\u0437\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d';b.state='run';finish().then(close)}else close()}},
      _t:{get b(){return b},step,trick}
    };
  }

  /* =================================================================== */
  /* \u0413\u0410\u0417 \u0412 \u041f\u041e\u041b: \u043a\u0442\u043e \u0431\u044b\u0441\u0442\u0440\u0435\u0435 \u0436\u043c\u0451\u0442                                          */
  /* =================================================================== */
  const DIFF=['\u041b\u0435\u0433\u043a\u043e','\u041d\u043e\u0440\u043c\u0430\u043b\u044c\u043d\u043e','\u0421\u043b\u043e\u0436\u043d\u043e'];
  function gas(){
    const COLORS=['#ff453a','#0a84ff','#30d158','#ffd60a'];const GOAL=60;
    let mode=null,n=2,diff=+(sessionStorage.getItem('gas_diff')||0)||0,st=null,raf=0;
    root.innerHTML='';root.classList.add('on');document.body.style.overflow='hidden';
    const setDiff=v=>{diff=Math.max(0,Math.min(2,v));try{sessionStorage.setItem('gas_diff',diff)}catch(e){}};
    function menu(){
      cancelAnimationFrame(raf);st=null;
      root.innerHTML='<div class="gover" style="background:linear-gradient(180deg,#ff5145,#9e1b12)"><div class="box"><h3>\u0413\u0430\u0437 \u0432 \u043f\u043e\u043b</h3><p>\u0416\u043c\u0438\u0442\u0435 \u043d\u0430 \u0441\u0432\u043e\u044e \u0437\u043e\u043d\u0443 \u043a\u0430\u043a \u043c\u043e\u0436\u043d\u043e \u0431\u044b\u0441\u0442\u0440\u0435\u0435. \u041f\u0435\u0440\u0432\u044b\u0439, \u043a\u0442\u043e \u043f\u0440\u043e\u0435\u0434\u0435\u0442 \u0442\u0440\u0430\u0441\u0441\u0443, \u043f\u043e\u0431\u0435\u0436\u0434\u0430\u0435\u0442.</p>'+
        '<div style="text-align:left;font:600 15px -apple-system,sans-serif;margin:14px 2px 8px">\u041f\u0440\u043e\u0442\u0438\u0432 \u0431\u043e\u0442\u0430</div><div class="segbox" style="margin-bottom:10px">'+DIFF.map((t,i)=>'<button class="'+(diff===i?'on':'')+'" data-g="diff" data-v="'+i+'">'+t+'</button>').join('')+'</div><button class="btn pri wide" data-g="bot">\u0418\u0433\u0440\u0430\u0442\u044c \u0441 \u0431\u043e\u0442\u043e\u043c</button>'+
        '<div style="text-align:left;font:600 15px -apple-system,sans-serif;margin:18px 2px 8px">\u041d\u0430 \u043e\u0434\u043d\u043e\u043c \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0435</div><div class="segbox" style="margin-bottom:10px">'+[2,3,4].map(v=>'<button class="'+(n===v?'on':'')+'" data-g="num" data-v="'+v+'">'+v+' \u0438\u0433\u0440\u043e\u043a\u0430</button>').join('')+'</div><button class="btn wide" data-g="local">\u0418\u0433\u0440\u0430\u0442\u044c \u0432\u043c\u0435\u0441\u0442\u0435</button>'+
        '<div class="acts"><button class="btn wide" data-g="exit">\u0412\u044b\u0439\u0442\u0438</button></div></div></div>';
    }
    function startRace(m){
      mode=m;const players=m==='bot'?2:n;
      st={p:Array.from({length:players},(_,i)=>({c:0,t:0,bot:m==='bot'&&i===1})),go:0,state:'count',win:-1,t0:0};
      const grid=players===2?'grid-template-rows:1fr 1fr':players===3?'grid-template-rows:1fr 1fr 1fr':'grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr';
      // \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u043e\u0442\u0430: \u0431\u043e\u0442 \u0441\u0432\u0435\u0440\u0445\u0443, \u0432\u0430\u0448\u0430 \u0437\u043e\u043d\u0430 \u2014 \u0441\u043d\u0438\u0437\u0443, \u043f\u043e\u0434 \u0431\u043e\u043b\u044c\u0448\u0438\u043c \u043f\u0430\u043b\u044c\u0446\u0435\u043c
      const order=m==='bot'?[1,0]:st.p.map((_,i)=>i);
      root.innerHTML='<div class="tap-zones" style="'+grid+'">'+order.map(i=>{const p=st.p[i];const flip=m!=='bot'&&((players===2&&i===0)||(players===4&&i<2));return'<button class="tz" data-z="'+i+'" style="background:linear-gradient(180deg,'+COLORS[i]+','+shade(COLORS[i])+');'+(flip?'transform:rotate(180deg);':'')+(p.bot?'pointer-events:none;filter:saturate(.75);':'')+'"><div class="lane"><canvas></canvas></div><div class="cnt num">0</div><div style="font:600 15px -apple-system,sans-serif;opacity:.85">'+(p.bot?'\u0411\u043e\u0442 \u00b7 '+DIFF[diff]:m==='bot'?'\u0412\u044b \u2014 \u0436\u043c\u0438\u0442\u0435 \u0437\u0434\u0435\u0441\u044c':'\u0418\u0433\u0440\u043e\u043a '+(i+1))+'</div></button>'}).join('')+'</div><div class="gpop" style="top:42%"></div>';
      qsa('.tz').forEach(z=>z.addEventListener('pointerdown',e=>{e.preventDefault();tap(+z.dataset.z,z)}));
      st.go=performance.now()+3000;raf=requestAnimationFrame(loop);
    }
    function shade(h){const nn=parseInt(h.slice(1),16);const f=v=>Math.round(v*.62);return'rgb('+f(nn>>16)+','+f(nn>>8&255)+','+f(nn&255)+')'}
    const qsa=s=>[...root.querySelectorAll(s)];
    function tap(i,z){
      if(!st||st.state!=='race')return;const p=st.p[i];if(p.bot)return;
      p.c++;if(z){z.classList.add('flash');setTimeout(()=>z.classList.remove('flash'),60)}api.Haptic.tick();
      if(p.c>=GOAL)win(i);
    }
    function win(i){if(st.state!=='race')return;st.state='done';st.win=i;const t=((performance.now()-st.t0)/1000).toFixed(2).replace('.',',');const p=st.p[i];api.Snd.win(3);api.Haptic.ok();
      let acts;
      if(mode==='bot'){
        const won=!p.bot;
        // \u0441\u043b\u043e\u0436\u043d\u043e\u0441\u0442\u044c \u043c\u0435\u043d\u044f\u0435\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0438\u0433\u0440\u043e\u043a: \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435\u043c \u043e\u0441\u0442\u0430\u0442\u044c\u0441\u044f \u0438\u043b\u0438 \u043f\u0435\u0440\u0435\u0439\u0442\u0438
        acts=(won&&diff<2?'<button class="btn pri wide" data-g="harder">\u0421\u043b\u043e\u0436\u043d\u0435\u0435: \u00ab'+DIFF[diff+1]+'\u00bb</button><button class="btn wide" data-g="rematch">\u0415\u0449\u0451 \u0440\u0430\u0437 \u043d\u0430 \u00ab'+DIFF[diff]+'\u00bb</button>':
          won?'<button class="btn pri wide" data-g="rematch">\u0415\u0449\u0451 \u0440\u0430\u0437 \u043d\u0430 \u00ab'+DIFF[diff]+'\u00bb</button>':
          '<button class="btn pri wide" data-g="rematch">\u0420\u0435\u0432\u0430\u043d\u0448 \u043d\u0430 \u00ab'+DIFF[diff]+'\u00bb</button>'+(diff>0?'<button class="btn wide" data-g="easier">\u041f\u043e\u043b\u0435\u0433\u0447\u0435: \u00ab'+DIFF[diff-1]+'\u00bb</button>':''));
      }else acts='<button class="btn pri wide" data-g="rematch">\u0415\u0449\u0451 \u0440\u0430\u0437</button>';
      setTimeout(()=>{root.insertAdjacentHTML('beforeend','<div class="gover"><div class="box"><h3>'+(mode==='bot'?(p.bot?'\u0411\u043e\u0442 \u0431\u044b\u0441\u0442\u0440\u0435\u0435':'\u0412\u044b \u043f\u043e\u0431\u0435\u0434\u0438\u043b\u0438!'):'\u041f\u043e\u0431\u0435\u0434\u0438\u043b \u0438\u0433\u0440\u043e\u043a '+(i+1))+'</h3><p>\u0422\u0440\u0430\u0441\u0441\u0430 \u043f\u0440\u043e\u0439\u0434\u0435\u043d\u0430 \u0437\u0430 '+t+' \u0441'+(mode==='bot'?' \u00b7 \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u00ab'+DIFF[diff]+'\u00bb':'')+'</p><div class="acts">'+acts+'<button class="btn wide" data-g="menu">\u0414\u0440\u0443\u0433\u043e\u0439 \u0440\u0435\u0436\u0438\u043c</button><button class="btn wide" data-g="exit">\u0412\u044b\u0439\u0442\u0438</button></div></div></div>')},300)}
    function loop(ts){
      raf=requestAnimationFrame(loop);if(!st)return;
      const pop=root.querySelector('.gpop');
      if(st.state==='count'){const lf=Math.ceil((st.go-ts)/1000);if(pop){pop.innerHTML=lf>0?String(lf):'\u0413\u0430\u0437!';pop.classList.add('show')}if(ts>=st.go){st.state='race';st.t0=ts;api.Haptic.heavy();setTimeout(()=>{if(pop)pop.classList.remove('show')},500)}}
      if(st.state==='race'){for(const p of st.p)if(p.bot){const rate=[5.2,7.2,9.4][diff]*(0.85+Math.random()*.3);p.t+=rate*(1/60);while(p.t>=1){p.t-=1;p.c++;if(p.c>=GOAL){win(st.p.indexOf(p));break}}}}
      qsa('.tz').forEach(z=>{const i=+z.dataset.z;const p=st.p[i];z.querySelector('.cnt').textContent=Math.min(GOAL,p.c);const cv=z.querySelector('canvas');if(!cv._fit){const r=cv.getBoundingClientRect();cv.width=r.width*2;cv.height=r.height*2;cv._fit=1}const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);const W=cv.width/2,H=cv.height/2;c.clearRect(0,0,W,H);
        for(let j=0;j<4;j++){c.fillStyle=j%2?'#111':'#fff';c.fillRect(W-14,j*H/4,7,H/4);c.fillStyle=j%2?'#fff':'#111';c.fillRect(W-7,j*H/4,7,H/4)}
        const x=12+(W-60)*Math.min(1,p.c/GOAL);api.Draw.car(c,x+20,H-6,H/70,{skin:['car:muscle','car:sport','car:coupe','car:buggy'][i],c1:'white',c2:'black',wh:'sport'},{wheelRot:p.c,noShadow:true})});
    }
    menu();
    cur={stop(){cancelAnimationFrame(raf)},cmd(k,el){
      if(k==='diff'){setDiff(+el.dataset.v);menu()}else if(k==='num'){n=+el.dataset.v;menu()}
      else if(k==='bot')startRace('bot');else if(k==='local')startRace('local');else if(k==='rematch')startRace(mode);
      else if(k==='harder'){setDiff(diff+1);startRace('bot')}else if(k==='easier'){setDiff(diff-1);startRace('bot')}
      else if(k==='menu')menu();else if(k==='exit')close();
    },_t:{get st(){return st},get diff(){return diff},tap}};
  }

  return{
    open(g){if(cur)close();cur=g==='stunt'?stunt():rider()},
    gas(){if(cur)close();gas()},
    close,get cur(){return cur}
  };
};
