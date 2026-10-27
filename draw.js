/* \u0420\u0438\u0441\u043e\u0432\u0430\u043d\u0438\u0435 \u043c\u0430\u0448\u0438\u043d \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u043e\u0432: \u0441\u043a\u0438\u043d\u044b, \u0434\u0432\u0435 \u043a\u0440\u0430\u0441\u043a\u0438, \u043a\u043e\u043b\u0451\u0441\u0430, \u043e\u0431\u0432\u0435\u0441, \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438. \u041e\u0431\u0449\u0435\u0435 \u0434\u043b\u044f \u0433\u0430\u0440\u0430\u0436\u0430, \u043f\u0440\u043e\u0444\u0438\u043b\u0435\u0439 \u0438 \u0438\u0433\u0440. */
const Draw=(()=>{
  const TAU=Math.PI*2;
  const col=id=>(L.COLORS[id]||L.COLORS.orange).c;
  function shade(hex,k){
    const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
    if(k<0){r*=1+k;g*=1+k;b*=1+k}else{r+=(255-r)*k;g+=(255-g)*k;b+=(255-b)*k}
    return'rgb('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+')';
  }
  function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
  function poly(c,pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath()}

  /* ---------- \u043a\u043e\u043b\u0451\u0441\u0430 ---------- */
  function wheel(c,x,y,r,type,rot,glow){
    const off=type==='off';const R=off?r+2:r;
    c.save();c.translate(x,y);
    c.fillStyle='#16181c';c.beginPath();c.arc(0,0,R,0,TAU);c.fill();
    if(off){c.fillStyle='#24272d';for(let i=0;i<12;i++){c.save();c.rotate(rot+i*TAU/12);c.fillRect(-2,-R-1.2,4,3);c.restore()}}
    const ri=R*.58;
    if(type==='chrome'){const g=c.createLinearGradient(-ri,-ri,ri,ri);g.addColorStop(0,'#fff');g.addColorStop(.5,'#9aa4b0');g.addColorStop(1,'#eef2f6');c.fillStyle=g}
    else if(type==='neon'){c.fillStyle='#0d0f12'}
    else if(type==='sport'){c.fillStyle='#c9d0d8'}
    else c.fillStyle='#8e98a4';
    c.beginPath();c.arc(0,0,ri,0,TAU);c.fill();
    if(type==='neon'){c.strokeStyle=glow||'#39ff88';c.lineWidth=2.4;c.shadowColor=glow||'#39ff88';c.shadowBlur=10;c.beginPath();c.arc(0,0,ri-1,0,TAU);c.stroke();c.shadowBlur=0}
    const n=type==='sport'||type==='chrome'?5:type==='off'?6:3;
    c.strokeStyle=type==='neon'?(glow||'#39ff88'):'#2a2f36';c.lineWidth=type==='sport'?2.2:1.8;
    for(let k=0;k<n;k++){const a=rot+k*TAU/n;c.beginPath();c.moveTo(Math.cos(a)*2,Math.sin(a)*2);c.lineTo(Math.cos(a)*(ri-1),Math.sin(a)*(ri-1));c.stroke()}
    c.fillStyle='#3a4048';c.beginPath();c.arc(0,0,2.4,0,TAU);c.fill();
    c.restore();
  }

  /* ---------- \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 ---------- */
  function sticker(c,k,x,y,s){
    c.save();c.translate(x,y);c.scale(s/20,s/20);
    c.lineJoin='round';
    switch(k){
      case'bolt':c.fillStyle='#ffd60a';poly(c,[[2,-10],[-6,1],[0,1],[-3,10],[7,-2],[1,-2],[5,-10]]);c.fill();c.strokeStyle='#8a6a00';c.lineWidth=1;c.stroke();break;
      case'flame':{const g=c.createLinearGradient(0,10,0,-10);g.addColorStop(0,'#ff3b30');g.addColorStop(.6,'#ff9f0a');g.addColorStop(1,'#ffd60a');c.fillStyle=g;c.beginPath();c.moveTo(0,10);c.bezierCurveTo(-9,8,-8,-2,-2,-10);c.bezierCurveTo(-1,-4,4,-6,3,-10);c.bezierCurveTo(10,-2,9,8,0,10);c.fill();break}
      case'star':c.fillStyle='#ffd60a';c.beginPath();for(let i=0;i<10;i++){const r=i%2?4.2:10,a=-Math.PI/2+i*Math.PI/5;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill();c.strokeStyle='#9a7a00';c.lineWidth=1;c.stroke();break;
      case'check':for(let i=0;i<4;i++)for(let j=0;j<4;j++){c.fillStyle=(i+j)%2?'#111':'#fff';c.fillRect(-8+i*4,-8+j*4,4,4)}c.strokeStyle='#888';c.lineWidth=.8;c.strokeRect(-8,-8,16,16);break;
      case'heart':c.fillStyle='#ff375f';c.beginPath();c.moveTo(0,9);c.bezierCurveTo(-12,0,-8,-11,0,-4);c.bezierCurveTo(8,-11,12,0,0,9);c.fill();break;
      case'one':c.fillStyle='#0a84ff';c.beginPath();c.arc(0,0,10,0,TAU);c.fill();c.fillStyle='#fff';c.font='800 13px -apple-system,Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('#1',0,1);break;
      case'clover':c.fillStyle='#30d158';for(let i=0;i<4;i++){c.save();c.rotate(i*Math.PI/2+Math.PI/4);c.beginPath();c.arc(0,-5,4.6,0,TAU);c.fill();c.restore()}c.strokeStyle='#1c7a22';c.lineWidth=1.6;c.beginPath();c.moveTo(0,0);c.lineTo(3,10);c.stroke();break;
      case'wing':c.fillStyle='#f5f5f7';for(const sg of [-1,1]){c.save();c.scale(sg,1);c.beginPath();c.moveTo(1,2);c.bezierCurveTo(5,-8,10,-9,11,-6);c.bezierCurveTo(9,-4,9,-2,10,0);c.bezierCurveTo(8,1,8,3,8,4);c.bezierCurveTo(5,5,3,4,1,2);c.fill();c.restore()}c.fillStyle='#ffd60a';c.beginPath();c.arc(0,1,2.4,0,TAU);c.fill();break;
      case'crown':{const g=c.createLinearGradient(0,-8,0,8);g.addColorStop(0,'#fff1a6');g.addColorStop(1,'#d99a00');c.fillStyle=g;poly(c,[[-10,7],[-10,-6],[-5,0],[0,-9],[5,0],[10,-6],[10,7]]);c.fill();c.strokeStyle='#8a5a00';c.lineWidth=1;c.stroke();c.fillStyle='#ff375f';c.beginPath();c.arc(0,3,1.8,0,TAU);c.fill();break}
      case'rocket':c.fillStyle='#f5f5f7';c.beginPath();c.moveTo(0,-11);c.bezierCurveTo(5,-6,5,2,4,6);c.lineTo(-4,6);c.bezierCurveTo(-5,2,-5,-6,0,-11);c.fill();c.fillStyle='#ff3b30';poly(c,[[-4,2],[-8,8],[-3,6]]);c.fill();poly(c,[[4,2],[8,8],[3,6]]);c.fill();c.fillStyle='#0a84ff';c.beginPath();c.arc(0,-3,2.2,0,TAU);c.fill();c.fillStyle='#ff9f0a';poly(c,[[-2,6],[0,11],[2,6]]);c.fill();break;
      case'gem':{const g=c.createLinearGradient(-8,-8,8,8);g.addColorStop(0,'#c9fbff');g.addColorStop(.5,'#40c8e0');g.addColorStop(1,'#0a6f9e');c.fillStyle=g;poly(c,[[-9,-3],[-5,-8],[5,-8],[9,-3],[0,9]]);c.fill();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.8;c.beginPath();c.moveTo(-9,-3);c.lineTo(9,-3);c.moveTo(-3,-8);c.lineTo(0,9);c.lineTo(3,-8);c.stroke();break}
    }
    c.restore();
  }
  const stCache={};
  function stickerURL(k,size){
    const key=k+'|'+(size||64);if(stCache[key])return stCache[key];
    const cv=document.createElement('canvas');const n=size||64;cv.width=cv.height=n;const c=cv.getContext('2d');sticker(c,k,n/2,n/2,n*.82);
    return stCache[key]=cv.toDataURL();
  }

  /* ---------- \u043c\u0430\u0448\u0438\u043d\u0430 ---------- */
  // \u041d\u0430\u0447\u0430\u043b\u043e \u043a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0442: \u0441\u0435\u0440\u0435\u0434\u0438\u043d\u0430 \u043c\u0435\u0436\u0434\u0443 \u043a\u043e\u043b\u0451\u0441\u0430\u043c\u0438 \u043d\u0430 \u0443\u0440\u043e\u0432\u043d\u0435 \u0437\u0435\u043c\u043b\u0438. \u041e\u0441\u044c y \u0432\u0432\u0435\u0440\u0445 \u043e\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043b\u044c\u043d\u0430\u044f. \u0414\u043b\u0438\u043d\u0430 ~100.
  const CAR={
    sedan:{wb:31,r:13,body:[[-50,-14],[-50,-30],[-44,-37],[-28,-38],[-16,-56],[16,-56],[30,-38],[46,-35],[51,-28],[51,-14]],win:[[-24,-39],[-14,-53],[-1,-53],[-1,-39]],win2:[[2,-39],[2,-53],[14,-53],[25,-39]],stripe:[-50,-22,101,4],roof:[[-16,-56],[16,-56],[14,-53],[-14,-53]]},
    hatch:{wb:29,r:13,body:[[-46,-14],[-47,-36],[-42,-38],[-38,-58],[12,-58],[28,-38],[44,-35],[48,-28],[48,-14]],win:[[-36,-40],[-33,-55],[-6,-55],[-6,-40]],win2:[[-3,-40],[-3,-55],[10,-55],[23,-40]],stripe:[-46,-22,94,4],roof:[[-38,-58],[12,-58],[10,-55],[-36,-55]]},
    pickup:{wb:33,r:15,lift:4,body:[[-52,-16],[-52,-40],[-6,-40],[-4,-62],[24,-62],[34,-42],[50,-38],[53,-30],[53,-16]],win:[[-1,-43],[1,-58],[22,-58],[30,-43]],stripe:[-52,-24,105,4],roof:[[-4,-62],[24,-62],[22,-59],[-2,-59]],bed:true},
    wagon:{wb:33,r:13,body:[[-50,-14],[-50,-36],[-46,-38],[-44,-57],[16,-57],[31,-38],[47,-35],[51,-28],[51,-14]],win:[[-42,-40],[-41,-54],[-12,-54],[-12,-40]],win2:[[-9,-40],[-9,-54],[14,-54],[26,-40]],stripe:[-50,-22,101,4],roof:[[-44,-57],[16,-57],[15,-54],[-43,-54]]},
    van:{wb:34,r:14,body:[[-50,-14],[-50,-70],[22,-70],[34,-50],[48,-42],[51,-30],[51,-14]],win:[[-46,-46],[-46,-64],[-12,-64],[-12,-46]],win2:[[-8,-46],[-8,-64],[20,-64],[30,-48]],stripe:[-50,-26,101,6],roof:[[-50,-70],[22,-70],[21,-67],[-50,-67]]},
    coupe:{wb:30,r:13,body:[[-49,-14],[-49,-28],[-42,-35],[-24,-37],[-8,-52],[12,-52],[32,-36],[48,-31],[50,-24],[50,-14]],win:[[-20,-38],[-7,-49],[10,-49],[26,-38]],stripe:[-49,-21,99,3],roof:[[-8,-52],[12,-52],[11,-49],[-7,-49]]},
    buggy:{wb:30,r:16,lift:6,frame:true},
    retro:{wb:28,r:13,round:true},
    muscle:{wb:33,r:14,body:[[-52,-14],[-52,-32],[-46,-38],[-26,-39],[-14,-55],[10,-55],[26,-40],[50,-37],[53,-30],[53,-14]],win:[[-22,-40],[-12,-52],[-1,-52],[-1,-40]],win2:[[2,-40],[2,-52],[9,-52],[21,-40]],racing:true,roof:[[-14,-55],[10,-55],[9,-52],[-12,-52]]},
    sport:{wb:31,r:13,body:[[-50,-13],[-50,-29],[-40,-33],[-20,-35],[-6,-48],[14,-48],[34,-32],[50,-26],[52,-20],[52,-13]],win:[[-16,-36],[-5,-45],[12,-45],[28,-33]],stripe:[-50,-19,102,3],roof:[[-6,-48],[14,-48],[13,-45],[-5,-45]],vents:true},
    emo:{wb:32,r:13,body:[[-51,-13],[-51,-30],[-36,-36],[-12,-52],[18,-50],[38,-34],[52,-27],[53,-13]],win:[[-30,-37],[-11,-49],[16,-47],[30,-36]],stripe:[-51,-20,104,3],neon:true}
  };
  function car(c,x,y,s,look,o){
    o=o||{};const sk=String(look.skin||'car:sedan').split(':')[1];const d=CAR[sk]||CAR.sedan;
    const c1=col(look.c1),c2=col(look.c2),wh=look.wh||'std',kit=look.kit||'none';
    const lift=(d.lift||0)+(wh==='off'?3:0);
    c.save();c.translate(x,y);c.scale(s*(o.flip?-1:1),s);
    const r=d.r+(wh==='off'?1:0);
    if(!o.noShadow){c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(0,0,52,4,0,0,TAU);c.fill()}
    c.save();c.translate(0,-lift);
    if(d.frame){ // \u0431\u0430\u0433\u0433\u0438: \u043e\u0442\u043a\u0440\u044b\u0442\u0430\u044f \u0440\u0430\u043c\u0430
      c.fillStyle=c1;poly(c,[[-46,-16],[-48,-30],[-30,-34],[36,-30],[50,-22],[48,-14]]);c.fill();
      c.fillStyle=shade(c1,-.25);poly(c,[[-46,-16],[-40,-14],[44,-14],[48,-18]]);c.fill();
      c.strokeStyle=c2;c.lineWidth=3.2;c.lineCap='round';c.lineJoin='round';
      c.beginPath();c.moveTo(-34,-32);c.lineTo(-24,-58);c.lineTo(10,-58);c.lineTo(28,-32);c.moveTo(-8,-58);c.lineTo(-12,-32);c.stroke();
      c.fillStyle='#22262c';rr(c,-26,-44,16,12,4);c.fill();
      c.fillStyle='rgba(20,24,30,.9)';c.beginPath();c.arc(-16,-48,6,0,TAU);c.fill();c.fillStyle=c2;c.beginPath();c.arc(-16,-50,6,Math.PI,0);c.fill();
    }else if(d.round){ // \u0440\u0435\u0442\u0440\u043e
      c.fillStyle=c1;c.beginPath();c.moveTo(-48,-14);c.bezierCurveTo(-50,-40,-30,-62,0,-62);c.bezierCurveTo(30,-62,48,-42,50,-14);c.closePath();c.fill();
      c.fillStyle=c2;for(const fx of [-d.wb,d.wb]){c.beginPath();c.arc(fx,-14,r+6,Math.PI,0);c.lineTo(fx+r+6,-12);c.lineTo(fx-r-6,-12);c.fill()}
      c.fillStyle='rgba(15,22,34,.86)';c.beginPath();c.moveTo(-26,-40);c.bezierCurveTo(-24,-52,-12,-57,-2,-57);c.lineTo(-2,-40);c.closePath();c.fill();
      c.beginPath();c.moveTo(2,-40);c.lineTo(2,-57);c.bezierCurveTo(14,-57,24,-50,28,-40);c.closePath();c.fill();
      c.fillStyle='#fff3c2';c.beginPath();c.arc(44,-30,4,0,TAU);c.fill();
      c.fillStyle='rgba(255,255,255,.5)';c.fillRect(-46,-24,92,2);
    }else{
      c.fillStyle=c1;poly(c,d.body);c.fill();
      // \u043d\u0438\u0436\u043d\u044f\u044f \u0447\u0430\u0441\u0442\u044c \u043a\u0443\u0437\u043e\u0432\u0430 \u0432\u0442\u043e\u0440\u044b\u043c \u0446\u0432\u0435\u0442\u043e\u043c
      c.save();poly(c,d.body);c.clip();
      c.fillStyle=c2;if(d.stripe){c.fillRect(d.stripe[0],d.stripe[1],d.stripe[2],d.stripe[3])}
      if(d.racing){c.fillRect(-52,-36,106,3);c.fillRect(-52,-31,106,3)}
      c.fillStyle=shade(c1,-.22);c.fillRect(-60,-17,120,4);
      if(d.roof){c.fillStyle=c2;poly(c,d.roof);c.fill()}
      if(d.bed){c.fillStyle=shade(c1,-.3);c.fillRect(-50,-40,42,3)}
      if(d.neon){c.strokeStyle=c2;c.lineWidth=2;c.shadowColor=c2;c.shadowBlur=12;poly(c,d.body);c.stroke();c.shadowBlur=0}
      c.restore();
      c.fillStyle='rgba(15,22,34,.86)';poly(c,d.win);c.fill();if(d.win2){poly(c,d.win2);c.fill()}
      c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.moveTo(d.win[1][0]+3,d.win[1][1]+2);c.lineTo(d.win[1][0]+9,d.win[1][1]+2);c.lineTo(d.win[0][0]+12,d.win[0][1]);c.lineTo(d.win[0][0]+6,d.win[0][1]);c.fill();
      c.fillStyle='#fff3c2';const fr=d.body.reduce((m,p)=>Math.max(m,p[0]),0);c.fillRect(fr-5,-32,5,5);
      c.fillStyle='#e0262f';const bk=d.body.reduce((m,p)=>Math.min(m,p[0]),0);c.fillRect(bk,-32,4,6);
      if(d.vents){c.fillStyle='rgba(0,0,0,.35)';for(let i=0;i<3;i++)c.fillRect(-10+i*5,-28,3,8)}
      c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=1;c.beginPath();c.moveTo(0,-38);c.lineTo(0,-16);c.stroke();
    }
    // \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438
    const st=(look.st||[]).slice(0,3);const slots=[[-2,-26],[-32,-26],[30,-25]];
    st.forEach((k,i)=>sticker(c,k,slots[i][0],slots[i][1],12));
    // \u043d\u043e\u043c\u0435\u0440 \u0441\u0437\u0430\u0434\u0438
    if(look.plateText){const bk=-50;c.fillStyle='#fff';c.fillRect(bk-1,-24,4,9);c.fillStyle='#111';c.fillRect(bk-1,-24,1,9)}
    // \u043e\u0431\u0432\u0435\u0441
    if(kit==='spoiler'){c.fillStyle=c2;c.fillRect(-52,-48,18,3);c.fillStyle='#22262c';c.fillRect(-46,-45,2,8);c.fillRect(-40,-45,2,8)}
    if(kit==='wide'){c.fillStyle=shade(c1,-.35);for(const fx of [-d.wb,d.wb]){c.beginPath();c.arc(fx,-14,r+5,Math.PI,0);c.lineTo(fx+r+5,-14);c.lineTo(fx+r+2,-14);c.arc(fx,-14,r+2,0,Math.PI,true);c.closePath();c.fill()}}
    if(kit==='rack'){const top=d.roof?d.roof[0][1]:-56;c.fillStyle='#2a2f36';c.fillRect(-26,top-5,44,2.5);c.fillRect(-22,top-5,2,5);c.fillRect(12,top-5,2,5)}
    if(kit==='lights'){const top=d.roof?d.roof[0][1]:-56;c.fillStyle='#2a2f36';c.fillRect(-14,top-6,28,4);c.fillStyle='#fff7c2';for(let i=0;i<4;i++){c.beginPath();c.arc(-10+i*7,top-4,2,0,TAU);c.fill()}}
    c.restore();
    const rot=o.wheelRot||0;
    wheel(c,-d.wb,-r-(wh==='off'?2:0),r,wh,rot,c2);wheel(c,d.wb,-r-(wh==='off'?2:0),r,wh,rot,c2);
    c.restore();
  }

  /* ---------- \u043f\u0438\u0442\u0431\u0430\u0439\u043a ---------- */
  // \u041d\u0430\u0447\u0430\u043b\u043e \u043a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0442: \u0442\u043e\u0447\u043a\u0430 \u043a\u0430\u0441\u0430\u043d\u0438\u044f \u0437\u0430\u0434\u043d\u0435\u0433\u043e \u043a\u043e\u043b\u0435\u0441\u0430. pitch \u2014 \u043f\u043e\u0434\u044a\u0451\u043c \u043f\u0435\u0440\u0435\u0434\u043d\u0435\u0433\u043e \u043a\u043e\u043b\u0435\u0441\u0430 (\u0440\u0430\u0434), \u043f\u043e\u043b\u043e\u0436\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0439 = \u0432\u0438\u043b\u043b\u0438.
  const BIKE={std:{wb:62,r:12,h:1},mini:{wb:54,r:10,h:.86},cross:{wb:66,r:13,h:1.1},enduro:{wb:66,r:13,h:1.08,lamp:true},moto:{wb:64,r:12,h:.98,road:true},chopper:{wb:74,r:13,h:.84,chop:true},emo:{wb:64,r:12,h:1.02,neon:true}};
  function bike(c,x,y,s,look,o){
    o=o||{};const sk=String(look.skin||'bike:std').split(':')[1];const d=BIKE[sk]||BIKE.std;
    const c1=col(look.c1),c2=col(look.c2),wh=look.wh||'std',kit=look.kit||'none';
    const r=d.r+(wh==='off'?1:0),kx=d.wb/62,ky=d.h;
    const P=(px,py)=>[px*kx,(py)*ky];
    const pl=pts=>poly(c,pts.map(q=>P(q[0],q[1])));
    c.save();c.translate(x,y);c.scale(s*(o.flip?-1:1),s);
    if(!o.noShadow){c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(d.wb/2,0,46,3.5,0,0,TAU);c.fill()}
    c.rotate(-(o.pitch||0));
    const fx=d.wb,fy=-r;
    c.lineCap='round';c.lineJoin='round';
    // \u043c\u0430\u044f\u0442\u043d\u0438\u043a
    c.strokeStyle='#2b3038';c.lineWidth=4.5;c.beginPath();c.moveTo(0,-r);c.lineTo(...P(24,-22));c.stroke();
    // \u0440\u0430\u043c\u0430
    c.strokeStyle=shade(c1,-.35);c.lineWidth=3.6;c.beginPath();c.moveTo(...P(24,-22));c.lineTo(...P(48,-46));c.moveTo(...P(24,-22));c.lineTo(...P(10,-40));c.stroke();
    // \u0432\u0438\u043b\u043a\u0430
    const top=d.chop?P(40,-50):P(49,-50);
    c.strokeStyle=d.road?'#d0d6dd':'#aab3bd';c.lineWidth=4;c.beginPath();c.moveTo(fx,fy);c.lineTo(top[0],top[1]);c.stroke();
    c.strokeStyle='#2b3038';c.lineWidth=2;c.beginPath();c.moveTo(fx,fy);c.lineTo(fx-(fx-top[0])*.45,fy-(fy-top[1])*.45);c.stroke();
    // \u0434\u0432\u0438\u0433\u0430\u0442\u0435\u043b\u044c
    c.fillStyle='#4f5761';c.beginPath();const e=P(19,-31);rr(c,e[0],e[1],18*kx,15*ky,4);c.fill();
    c.fillStyle='#363c44';const e2=P(25,-38);rr(c,e2[0],e2[1],9*kx,9*ky,2);c.fill();
    c.fillStyle='#2b3038';c.beginPath();c.arc(...P(26,-22),4,0,TAU);c.fill();
    // \u0432\u044b\u0445\u043b\u043e\u043f
    c.strokeStyle=kit==='exhaust'?'#e3e8ee':'#8a939e';c.lineWidth=kit==='exhaust'?4.5:3.2;c.beginPath();c.moveTo(...P(33,-27));c.quadraticCurveTo(...P(20,-20),...P(2,-34));c.lineTo(...P(-6,-38));c.stroke();
    if(kit==='exhaust'){c.fillStyle='#f0f3f6';const q=P(-14,-41);rr(c,q[0],q[1],14*kx,7,3.5);c.fill();c.fillStyle='#2b3038';c.beginPath();c.arc(...P(-14,-37.5),2,0,TAU);c.fill()}
    if(d.chop){
      c.fillStyle=c2;c.beginPath();c.arc(0,-r,r+4,Math.PI*1.05,Math.PI*1.9);c.lineTo(...P(10,-28));c.closePath();c.fill();
      c.fillStyle=c1;pl([[16,-40],[34,-46],[42,-40],[36,-32],[20,-32]]);c.fill();
      c.fillStyle='#1b1e23';pl([[2,-34],[18,-36],[20,-31],[4,-29]]);c.fill();
    }else{
      // \u0437\u0430\u0434\u043d\u0435\u0435 \u043a\u0440\u044b\u043b\u043e
      c.fillStyle=c2;pl([[-18,-49],[0,-44],[22,-44],[22,-39],[2,-39],[-16,-45]]);c.fill();
      // \u0431\u043e\u043a\u043e\u0432\u0438\u043d\u0430 \u043f\u043e\u0434 \u0441\u0438\u0434\u0435\u043d\u044c\u0435\u043c
      pl([[4,-40],[22,-40],[19,-27],[8,-30]]);c.fill();
      // \u0431\u0430\u043a \u0438 \u0431\u043e\u043a\u043e\u0432\u0438\u043d\u044b
      c.fillStyle=c1;pl([[24,-43],[44,-49],[50,-46],[46,-36],[36,-27],[27,-30]]);c.fill();
      c.fillStyle=shade(c1,.18);pl([[26,-42],[44,-48],[46,-46],[30,-40]]);c.fill();
      // \u0441\u0438\u0434\u0435\u043d\u044c\u0435
      c.fillStyle='#1b1e23';pl([[0,-46],[34,-48],[35,-44],[2,-42]]);c.fill();
      // \u043f\u0435\u0440\u0435\u0434\u043d\u0435\u0435 \u043a\u0440\u044b\u043b\u043e \u0438 \u043d\u043e\u043c\u0435\u0440
      c.fillStyle=c2;const ff=kit==='fender'?-8:0;
      if(d.road)pl([[fx/kx-12,-r*2/ky-4],[fx/kx+6,-r*2/ky-3],[fx/kx+2,-r*2/ky+1]]);
      else pl([[50,-31+ff],[69,-33+ff],[73,-30+ff],[55,-28+ff]]);
      c.fill();
      if(!d.road){pl([[47,-58],[54,-56],[54,-45],[47,-47]]);c.fill()}
      if(d.lamp){c.fillStyle='#fff7c2';c.beginPath();c.arc(...P(52,-51),2.6,0,TAU);c.fill()}
    }
    if(d.neon){c.strokeStyle=c2;c.lineWidth=1.6;c.shadowColor=c2;c.shadowBlur=10;c.beginPath();c.moveTo(...P(-18,-49));c.lineTo(...P(22,-44));c.lineTo(...P(50,-46));c.stroke();c.shadowBlur=0}
    // \u0440\u0443\u043b\u044c
    const hb=d.chop?P(38,-58):P(47,-56);
    c.strokeStyle='#22262c';c.lineWidth=3;c.beginPath();c.moveTo(top[0],top[1]);c.lineTo(hb[0],hb[1]);c.lineTo(hb[0]-4,hb[1]-2);c.stroke();
    if(kit==='guard'){c.fillStyle=c2;poly(c,[[hb[0]-1,hb[1]-5],[hb[0]+8,hb[1]-6],[hb[0]+6,hb[1]+2]]);c.fill()}
    // \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438
    (look.st||[]).slice(0,3).forEach((k,i)=>{const q=i===0?P(13,-34):i===1?P(36,-40):P(60,-28);sticker(c,k,q[0],q[1],i===0?9:7)});
    if(look.plateText){c.fillStyle='#fff';const q=P(-18,-46);c.fillRect(q[0],q[1],6,4)}
    // \u0433\u043e\u043d\u0449\u0438\u043a
    if(o.rider!==false){
      const hip=P(14,-52),knee=P(31,-43),ank=P(25,-23),sh=P(25,-72),el=P(36,-63);
      c.strokeStyle='#2a2f36';c.lineWidth=7;c.beginPath();c.moveTo(...hip);c.lineTo(...knee);c.lineTo(...ank);c.stroke();
      c.fillStyle='#e8ebef';c.beginPath();c.ellipse(ank[0]+2,ank[1]+1,5,3.4,0,0,TAU);c.fill();
      c.strokeStyle=c1;c.lineWidth=9;c.beginPath();c.moveTo(...hip);c.lineTo(...sh);c.stroke();
      c.strokeStyle=shade(c1,-.15);c.lineWidth=4.5;c.beginPath();c.moveTo(...sh);c.lineTo(...el);c.lineTo(hb[0]-1,hb[1]+1);c.stroke();
      c.fillStyle='#1b1e23';c.beginPath();c.arc(hb[0]-1,hb[1]+1,2.4,0,TAU);c.fill();
      const hc=P(29,-81);const hg=c.createLinearGradient(hc[0]-8,hc[1]-8,hc[0]+8,hc[1]+8);hg.addColorStop(0,shade(c2,.3));hg.addColorStop(1,c2);
      c.fillStyle=hg;c.beginPath();c.arc(hc[0],hc[1],8.5,0,TAU);c.fill();
      c.beginPath();c.moveTo(hc[0]+4,hc[1]+3);c.lineTo(hc[0]+12,hc[1]+6);c.lineTo(hc[0]+6,hc[1]+9);c.fill();
      c.fillStyle='rgba(15,22,34,.92)';c.beginPath();c.moveTo(hc[0]+2,hc[1]-3);c.lineTo(hc[0]+9,hc[1]-2);c.lineTo(hc[0]+8.5,hc[1]+3);c.lineTo(hc[0]+2,hc[1]+2);c.fill();
      c.fillStyle=c2;c.beginPath();c.moveTo(hc[0]+1,hc[1]-7);c.lineTo(hc[0]+12,hc[1]-6);c.lineTo(hc[0]+10,hc[1]-3.5);c.lineTo(hc[0]+2,hc[1]-4.5);c.fill();
    }
    const rot=o.wheelRot||0;
    wheel(c,0,-r,r,wh,rot,c2);wheel(c,fx,fy,r,wh,rot,c2);
    c.restore();
  }

  /* ---------- \u043f\u0440\u0435\u0432\u044c\u044e \u0434\u043b\u044f \u0433\u0430\u0440\u0430\u0436\u0430 \u0438 \u043f\u0440\u043e\u0444\u0438\u043b\u0435\u0439 ---------- */
  function fit(cv){
    const r=cv.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);
    const W=Math.max(10,r.width||cv.width),H=Math.max(10,r.height||cv.height);
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);return{c,W,H};
  }
  function preview(cv,kind,look,opt){
    if(!cv||!cv.getContext)return;const {c,W,H}=fit(cv);c.clearRect(0,0,W,H);opt=opt||{};
    if(opt.floor!==false){const g=c.createRadialGradient(W/2,H*.86,4,W/2,H*.86,W*.45);g.addColorStop(0,'rgba(0,0,0,.35)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H)}
    if(kind==='bike'){const s=Math.min(W/112,H/104)*(opt.k||.92);bike(c,W/2-34*s,H*.88,s,look,{wheelRot:opt.rot||0,rider:opt.rider!==false,pitch:opt.pitch||0})}
    else{const s=Math.min(W/120,H/78)*(opt.k||.92);car(c,W/2,H*.86,s,look,{wheelRot:opt.rot||0})}
  }

  /* ---------- \u043e\u0431\u043b\u043e\u0436\u043a\u0438 \u0438\u0433\u0440 ---------- */
  function scene(cv,kind){
    if(!cv||!cv.getContext)return;const {c,W,H}=fit(cv);
    const sky=(a,b)=>{const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.fillRect(0,0,W,H)};
    const hills=(color,base,amp,f,ph)=>{c.fillStyle=color;c.beginPath();c.moveTo(0,H);for(let x=0;x<=W+10;x+=10)c.lineTo(x,base-Math.sin(x*f+ph)*amp-Math.sin(x*f*2.3+ph*2)*amp*.4);c.lineTo(W,H);c.fill()};
    if(kind==='rider'){
      sky('#ffb84a','#ff7a00');
      c.fillStyle='rgba(255,240,200,.55)';c.beginPath();c.arc(W*.78,H*.3,H*.16,0,TAU);c.fill();
      hills('rgba(190,80,0,.45)',H*.66,18,.012,1);hills('rgba(150,55,0,.6)',H*.78,12,.02,2);
      c.fillStyle='#3d1d00';c.beginPath();c.moveTo(0,H*.86);c.lineTo(W*.42,H*.86);c.quadraticCurveTo(W*.56,H*.84,W*.62,H*.62);c.lineTo(W*.64,H*.86);c.lineTo(W,H*.86);c.lineTo(W,H);c.lineTo(0,H);c.fill();
      c.strokeStyle='#fff';c.lineWidth=3;c.setLineDash([10,10]);c.beginPath();c.moveTo(W*.42,H*.86);c.quadraticCurveTo(W*.56,H*.84,W*.62,H*.62);c.stroke();c.setLineDash([]);
      c.save();c.translate(W*.74,H*.36);c.rotate(-.7);car(c,0,0,H/150,{skin:'car:sport',c1:'white',c2:'orange',wh:'sport'},{noShadow:true});c.restore();
    }else if(kind==='stunt'){
      sky('#38a3ff','#0a5bd6');
      for(let i=0;i<9;i++){const bx=i*W/8-10,bh=H*(.18+((i*37)%7)/24);c.fillStyle='rgba(5,40,110,.55)';c.fillRect(bx,H*.78-bh,W/9,bh)}
      c.fillStyle='#0b2c66';c.fillRect(0,H*.78,W,H*.22);
      c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=3;c.setLineDash([22,18]);c.beginPath();c.moveTo(0,H*.89);c.lineTo(W,H*.89);c.stroke();c.setLineDash([]);
      bike(c,W*.4,H*.84,H/128,{skin:'bike:cross',c1:'white',c2:'blue',wh:'off'},{pitch:.55});
    }else{
      sky('#ff5a4e','#b51f1a');
      for(let i=0;i<14;i++){c.fillStyle='rgba(255,255,255,'+(.08+(i%3)*.05)+')';c.fillRect(0,H*.2+i*H*.05,W*((i*53)%100)/100,2)}
      c.fillStyle='#5a0e0b';c.fillRect(0,H*.7,W,H*.3);
      c.fillStyle='#fff';for(let i=0;i<8;i++)for(let j=0;j<2;j++){if((i+j)%2)c.fillRect(W*.86+j*8,H*.7+i*8,8,8)}
      car(c,W*.3,H*.82,H/170,{skin:'car:muscle',c1:'red',c2:'white',wh:'sport'},{});
      car(c,W*.62,H*.97,H/170,{skin:'car:coupe',c1:'yellow',c2:'black',wh:'std'},{});
    }
  }
  return{car,bike,wheel,sticker,stickerURL,preview,scene,col,shade,fit,rr,CAR,BIKE};
})();
