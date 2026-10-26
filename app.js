'use strict';
/* \u041a\u043b\u0438\u0435\u043d\u0442 \u0438\u0433\u0440\u044b \u00ab\u0412\u044b\u0431\u0438\u0432\u0430\u043d\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u043e\u0432\u00bb \u0434\u043b\u044f \u0441\u0430\u0439\u0442\u0430: \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0436\u0438\u0432\u0451\u0442 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435, \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442 \u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f. */
const {TIERS,RARITY,RIDX,RULES3,RULES4,LRULES,KEYN,CARS,CAR_SRC,PACKS,GKEY,FREE,PREM,QUESTS,SEASON,
  BOX_CAP,BONUS,BUYBACK,FEE,MAX_LIST,STUNT_CAP,MIN_ASK,MAX_ASK,
  appraise,genPlate,bestOf,pick,rnd,plateText,num,fmtN,fmt,gem,hashStr,mskDate,toLat,parsePlateInput,
  seasonOn,level,lvlPct,worth,questReady,claimable,rewardText}=L;
const $=id=>document.getElementById(id);
const ALL=['ru','ua','kz'];
const CN={ru:'\u0420\u043e\u0441\u0441\u0438\u044f',ua:'\u0423\u043a\u0440\u0430\u0438\u043d\u0430',kz:'\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d',mix:'\u041c\u0438\u043a\u0441'};
const CS={ru:'\u0420\u0424',ua:'\u0423\u041a\u0420',kz:'\u041a\u0417'};
const FL={ru:'<i class="fl fru"></i>',ua:'<i class="fl fua"></i>',kz:'<i class="fl fkz"></i>'};
const xf=m=>'\u00d7'+String(Math.round(m*100)/100).replace('.',',');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduce=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();
const TABS=['cases','market','stunt','season','garage','shop','admin'];
const TOKEN_KEY='nomera-token';
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function lsDel(k){try{localStorage.removeItem(k)}catch(e){}}
function agoText(t){const s=(Date.now()-t)/1000;if(!(s>=0)||s<60)return'\u0442\u043e\u043b\u044c\u043a\u043e \u0447\u0442\u043e';if(s<3600)return Math.floor(s/60)+' \u043c\u0438\u043d \u043d\u0430\u0437\u0430\u0434';if(s<86400)return Math.floor(s/3600)+' \u0447 \u043d\u0430\u0437\u0430\u0434';return new Date(t).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}

/* ================= \u0441\u0432\u044f\u0437\u044c \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c (Supabase) ================= */
let S=L.fresh();S.welcome='';
const Net={status:'loading',me:{uid:null,admin:false,banned:false,tg:false,h:''},open:[],top:[],feed:[],
  cfg:{news:'',shop:null,adminUid:null},online:0,op:false,codes:[],players:[],playersLoaded:false,lastCode:null,sb:null,ch:null};
const CFG=Object.assign({},window.NOMERA_CONFIG||{});
CFG.supabaseUrl=String(CFG.supabaseUrl||'').trim().replace(/\/(rest|functions|auth)\/v1.*$/,'').replace(/\/+$/,'');
CFG.anonKey=String(CFG.anonKey||'').trim();
const FN=CFG.apiUrl||CFG.supabaseUrl+'/functions/v1/api';
Net.err='';
const TG=window.Telegram&&window.Telegram.WebApp&&window.Telegram.WebApp.initData?window.Telegram.WebApp:null;
let token=lsGet(TOKEN_KEY);
const tgData=(()=>{
  try{
    if(TG)return TG.initData;
    const h=new URLSearchParams((location.hash||'').slice(1));const d=h.get('tgWebAppData');
    if(d){sessionStorage.setItem('tgData',d);return d}
    return sessionStorage.getItem('tgData')||'';
  }catch(e){return''}
})();
if(TG){
  try{TG.ready();TG.expand();if(TG.disableVerticalSwipes)TG.disableVerticalSwipes()}catch(e){}
  const th=()=>{try{document.documentElement.setAttribute('data-theme',TG.colorScheme==='light'?'light':'dark')}catch(e){}};
  th();try{TG.onEvent('themeChanged',th)}catch(e){}
}
function setToken(t){token=t;lsSet(TOKEN_KEY,t)}
async function call(a,p){
  const headers={'Content-Type':'application/json'};
  if(CFG.anonKey)headers.apikey=CFG.anonKey;
  let res;
  try{res=await fetch(FN,{method:'POST',headers,body:JSON.stringify({a,p:p||{},t:token})})}
  catch(e){const er=new Error('\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442');er.net=true;throw er}
  const j=await res.json().catch(()=>({}));
  if(!res.ok){const er=new Error(j.error||'\u0421\u0435\u0440\u0432\u0435\u0440 \u043d\u0435 \u043e\u0442\u0432\u0435\u0442\u0438\u043b, \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437');er.status=res.status;er.relogin=!!j.relogin;throw er}
  return j;
}
function applyDiff(d){
  if(!d)return;
  for(const k in d){
    if(k==='box'){const del=new Set(d.box.del||[]);S.box=S.box.filter(x=>!del.has(x.id));for(const it of d.box.add||[]){const i=S.box.findIndex(x=>x.id===it.id);if(i>=0)S.box[i]=it;else S.box.push(it)}}
    else if(d[k]===null)delete S[k];else S[k]=d[k];
  }
}
function takeResp(j){if(j.S)S=j.S;else if(j.d)applyDiff(j.d);if(j.me)Net.me=j.me}
const trade=()=>Net.status==='on'&&!Net.me.banned;
async function act(a,p){
  if(Net.status!=='on')throw new Error(Net.status==='tg'?'\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0438\u0433\u0440\u0443 \u0447\u0435\u0440\u0435\u0437 Telegram-\u0431\u043e\u0442\u0430':'\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u043c\u0441\u044f\u2026');
  let j;
  try{j=await call(a,p)}
  catch(e){if(e.relogin){token=null;lsDel(TOKEN_KEY);connect()}throw e}
  takeResp(j);return j.r||{};
}
async function run(a,p,opt){
  if(Net.op&&!(opt&&opt.free))return null;
  if(!(opt&&opt.free))Net.op=true;
  try{const r=await act(a,p);if(r.msg&&!(opt&&opt.quiet))toast(r.msg);(r.notes||[]).forEach(toast);render();showInbox();return r}
  catch(e){toast(e.message);render();return null}
  finally{if(!(opt&&opt.free))Net.op=false}
}
let retryT=0;
async function connect(){
  clearTimeout(retryT);
  try{
    let j=null;
    if(tgData){j=await call('auth',{initData:tgData});setToken(j.t)}
    else if(token){try{j=await call('state')}catch(e){if(e.status===401){token=null;lsDel(TOKEN_KEY)}else throw e}}
    if(!j){
      try{j=await call('guest');setToken(j.t)}
      catch(e){if(e.net)throw e;Net.status='tg';render();return}
    }
    takeResp(j);Net.status='on';
    await loadPub();startLive();render();showInbox();
    if(tab==='cases'&&!busy)idleReel();
  }catch(e){
    Net.status='off';Net.err=e.net?'':(e.message||'')+(e.status?' (\u043a\u043e\u0434 '+e.status+')':'');
    render();retryT=setTimeout(connect,e.net?5000:15000);
  }
}
async function refreshState(){
  if(Net.op||busy||Net.status!=='on')return;
  try{const j=await call('state');if(Net.op||busy)return;takeResp(j);render();showInbox()}catch(e){}
}
/* \u041f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 (\u0440\u044b\u043d\u043e\u043a, \u0442\u043e\u043f, \u043b\u0435\u043d\u0442\u0430) \u0447\u0438\u0442\u0430\u044e\u0442\u0441\u044f \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u0438\u0437 \u0431\u0430\u0437\u044b: \u044d\u0442\u043e \u043d\u0435 \u0442\u0440\u0430\u0442\u0438\u0442 \u043b\u0438\u043c\u0438\u0442 \u0432\u044b\u0437\u043e\u0432\u043e\u0432 \u0444\u0443\u043d\u043a\u0446\u0438\u0438. */
function sbClient(){
  if(Net.sb)return Net.sb;
  if(window.supabase&&CFG.supabaseUrl&&CFG.anonKey)Net.sb=window.supabase.createClient(CFG.supabaseUrl,CFG.anonKey,{auth:{persistSession:false}});
  return Net.sb;
}
async function loadPub(what){
  const sb=sbClient();
  try{
    if(!sb){const j=await call('pub');Net.open=j.open||[];Net.top=j.top||[];Net.feed=j.feed||[];Net.cfg=j.cfg||Net.cfg;renderPub();return}
    const need=w=>!what||what===w;
    const jobs=[];
    if(need('market'))jobs.push(sb.from('listings').select('*').order('t',{ascending:false}).limit(400).then(r=>{if(!r.error)Net.open=(r.data||[]).map(l=>Object.assign(l,{t:Number(l.t)}))}));
    if(need('top'))jobs.push(sb.from('top_players').select('*').then(r=>{if(!r.error)Net.top=r.data||[]}));
    if(need('kv'))jobs.push(sb.from('kv').select('key,val').in('key',['feed','cfg']).then(r=>{if(r.error)return;for(const x of r.data||[]){if(x.key==='feed')Net.feed=(x.val&&x.val.items)||[];if(x.key==='cfg')Net.cfg=Object.assign({news:'',shop:null,adminUid:null},x.val||{})}}));
    await Promise.all(jobs);renderPub();
  }catch(e){}
}
function renderPub(){
  renderNews();renderFeed();renderNav();
  if(tab==='market')renderMarket();else if(tab==='season')renderLeaderboard();else if(tab==='shop')renderShop();else if(tab==='admin')renderAdminMarket();
}
const later={};
function soon(key,ms,fn){if(later[key])return;later[key]=setTimeout(()=>{later[key]=null;fn()},ms)}
function startLive(){
  const sb=sbClient();
  if(!sb){setInterval(()=>{if(!document.hidden)loadPub()},20000);setInterval(()=>{if(!document.hidden)refreshState()},45000);return}
  if(Net.ch)return;
  Net.ch=sb.channel('live')
    .on('postgres_changes',{event:'*',schema:'public',table:'listings'},()=>soon('m',600,()=>loadPub('market')))
    .on('postgres_changes',{event:'*',schema:'public',table:'kv'},()=>soon('k',600,()=>loadPub('kv')))
    .on('postgres_changes',{event:'*',schema:'public',table:'pings',filter:'h=eq.'+Net.me.h},()=>soon('s',300,refreshState))
    .subscribe();
  const on=sb.channel('online',{config:{presence:{key:Net.me.uid||String(Math.random())}}});
  on.on('presence',{event:'sync'},()=>{Net.online=Object.keys(on.presenceState()).length;renderTop()})
    .subscribe(st=>{if(st==='SUBSCRIBED')on.track({t:Date.now()}).catch(()=>{})});
  setInterval(()=>{if(!document.hidden&&tab==='season')loadPub('top')},60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshState();loadPub()}});
}
let inboxBusy=false;
async function showInbox(){
  if(inboxBusy||!S.inbox||!S.inbox.length)return;
  inboxBusy=true;S.inbox.forEach(m=>toast(m.text));
  try{await act('inboxSeen')}catch(e){}
  inboxBusy=false;
}

/* ================= \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441 ================= */
let tab='cases',sel='ru',busy=false,curTier=0,lastRes=null,armed='',armT=0,reelDirty=true,packSel=1,stuntRun=null;
let gFilt='all',gSort='price-desc',mFilt='all';
const est={};
function plateHTML(pl){
  const lab=esc(plateText(pl));let inner;
  if(pl.c==='ru')inner=`<div class="pm"><span>${pl.p}</span><span class="dg">${pl.d}</span><span>${pl.s}</span></div><div class="pr"><b class="rn n${pl.r.length}">${pl.r}</b><span class="rc"><em>RUS</em>${FL.ru}</span></div>`;
  else if(pl.c==='ua')inner=`<div class="ps ua">${FL.ua}<em>UA</em></div><div class="pm"><span>${pl.p}</span><span class="dg">${pl.d}</span><span>${pl.s}</span></div>`;
  else inner=`<div class="ps kz">${FL.kz}<em>KZ</em></div><div class="pm"><span class="dg">${pl.d}</span><span>${pl.s}</span></div><div class="pr kzr"><b class="rn n2">${pl.r}</b></div>`;
  return `<div class="plate" role="img" aria-label="${lab}"><div class="pb">${inner}</div></div>`;
}
const whereText=pl=>CN[pl.c]+' \u00b7 '+appraise(pl).parts[2].t;
const badge=uid=>uid&&Net.cfg.adminUid&&uid===Net.cfg.adminUid?'<span class="adm">\u0410\u0434\u043c\u0438\u043d</span>':'';
const toastQ=[];let toastOn=false;
function toast(msg){if(!msg)return;if(toastQ.length>6)toastQ.shift();toastQ.push(String(msg));if(!toastOn)nextToast()}
function nextToast(){
  const t=$('toast');const m=toastQ.shift();
  if(!m||!t){toastOn=false;if(t)t.classList.remove('show');return}
  toastOn=true;t.textContent=m;t.classList.add('show');
  setTimeout(()=>{t.classList.remove('show');setTimeout(nextToast,220)},Math.min(5000,1800+m.length*25));
}
function needArm(key){
  if(armed===key){armed='';clearTimeout(armT);return false}
  armed=key;clearTimeout(armT);armT=setTimeout(()=>{armed='';render()},3500);render();return true;
}
function estimate(c){
  if(est[c])return est[c];
  est[c]=TIERS.map(t=>{const N=t.k>=10?260:600;let rare=0,sum=0;for(let i=0;i<N;i++){const p=bestOf(c==='mix'?pick(ALL):c,t.k,t.floor).a.price;sum+=p;if(p>=RARITY[2].min)rare++}return{rare:rare/N,avg:sum/N}});
  return est[c];
}
function copyText(text){try{navigator.clipboard.writeText(text).then(()=>toast('\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u043e'),()=>toast('\u0412\u044b\u0434\u0435\u043b\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0438 \u0441\u043a\u043e\u043f\u0438\u0440\u0443\u0439\u0442\u0435 \u0432\u0440\u0443\u0447\u043d\u0443\u044e'))}catch(e){toast('\u0412\u044b\u0434\u0435\u043b\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0438 \u0441\u043a\u043e\u043f\u0438\u0440\u0443\u0439\u0442\u0435 \u0432\u0440\u0443\u0447\u043d\u0443\u044e')}}

/* ---------- \u0448\u0430\u043f\u043a\u0430 ---------- */
function renderTop(){
  $('bal').textContent=fmt(S.bal);
  $('gold').textContent=fmtN(S.gold);const g2=$('gold2');if(g2)g2.textContent=fmtN(S.gold);
  $('lvl-n').textContent=level(S);$('lvlbtn').style.setProperty('--p',lvlPct(S));
  $('lvl-dot').hidden=!(claimable(S)+questReady(S));
  const ol=$('online');if(Net.online>0){ol.hidden=false;$('online-n').textContent=Net.online}else ol.hidden=true;
  $('season-chip').textContent=seasonOn()?'\u0421\u0435\u0437\u043e\u043d 1 \u00b7 \u0432\u044b\u0445\u043e\u0434 \u0438\u0437 \u0431\u0435\u0442\u044b':'\u0421\u0435\u0437\u043e\u043d 1 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d';
  const rs=$('reset');if(rs){rs.textContent=armed==='reset'?'\u0422\u043e\u0447\u043d\u043e \u0441\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0433\u0430\u0440\u0430\u0436 \u0438 \u0431\u0430\u043b\u0430\u043d\u0441?':'\u041d\u0430\u0447\u0430\u0442\u044c \u0437\u0430\u043d\u043e\u0432\u043e';rs.classList.toggle('armed',armed==='reset')}
  const al=$('adm-login');if(al)al.hidden=!!Net.me.admin;
  const bb=$('bonus');if(bb){const left=S.bonusAt-Date.now();if(left>0){bb.disabled=true;bb.textContent='\u041f\u043e\u0434\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u0447\u0435\u0440\u0435\u0437 '+Math.ceil(left/1000)+' \u0441'}else{bb.disabled=false;bb.textContent='\u041f\u043e\u0434\u0440\u0430\u0431\u043e\u0442\u043a\u0430 +'+fmt(BONUS)}}
  const cn=$('conn');if(cn){cn.hidden=Net.status==='on';cn.textContent=Net.status==='loading'?'\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u043c\u0441\u044f \u043a \u0441\u0435\u0440\u0432\u0435\u0440\u0443\u2026':Net.status==='tg'?'\u0418\u0433\u0440\u0430 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 Telegram-\u0431\u043e\u0442\u0430. \u041d\u0430\u0439\u0434\u0438\u0442\u0435 \u0431\u043e\u0442\u0430 \u0438\u0433\u0440\u044b \u0438 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u0418\u0433\u0440\u0430\u0442\u044c\u00bb.':Net.err?'\u0421\u0435\u0440\u0432\u0435\u0440 \u043e\u0442\u0432\u0435\u0442\u0438\u043b \u043e\u0448\u0438\u0431\u043a\u043e\u0439: '+Net.err:'\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041f\u0435\u0440\u0435\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u043c\u0441\u044f\u2026'}
}
function renderNav(){
  document.querySelectorAll('#nav button').forEach(b=>{if(b.dataset.tab===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  TABS.forEach(t=>{const el=$('tab-'+t);if(el)el.hidden=t!==tab});
  $('s-dot').hidden=!(claimable(S)+questReady(S));
  $('nav-admin').hidden=!Net.me.admin;
}
function render(){
  renderTop();renderNav();
  if(tab==='cases')renderCases();
  else if(tab==='market')renderMarket();
  else if(tab==='stunt')renderStuntSide();
  else if(tab==='season')renderSeason();
  else if(tab==='garage')renderGarage();
  else if(tab==='shop')renderShop();
  else if(tab==='admin')renderAdminTab();
}
function go(t,first){
  if(!TABS.includes(t)||(t==='admin'&&!Net.me.admin))t='cases';
  const prev=tab;tab=t;armed='';
  if(prev==='stunt'&&t!=='stunt')Stunt.hide();
  render();
  if(t==='stunt')Stunt.show();
  if(t==='cases'&&reelDirty&&!busy)idleReel();
  if(t==='admin'){loadPlayers();loadCodes()}
  if(!first){try{history.replaceState(null,'','#'+t)}catch(e){}window.scrollTo({top:0})}
}
function renderNews(){
  const el=$('news');if(!el)return;const t=Net.cfg.news;
  if(!t||lsGet('nomera-news-hide')===String(hashStr(t))){el.innerHTML='';return}
  el.innerHTML=`<div class="note warn"><p><b>\u041e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0435.</b> ${esc(t)}</p><button class="btn sm" data-act="news-hide">\u0421\u043a\u0440\u044b\u0442\u044c</button></div>`;
}

/* ---------- \u043a\u0435\u0439\u0441\u044b ---------- */
function renderCases(){
  renderNews();
  const w=$('welcome');
  w.innerHTML=S.welcome==='new'?`<div class="note gift"><p><b>\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c!</b> \u041d\u0430 \u0441\u0442\u0430\u0440\u0442\u0435 \u0443 \u0432\u0430\u0441 5 000 \u20bd \u0438 \u043a\u043b\u044e\u0447 \u043e\u0442 \u0441\u0435\u0437\u043e\u043d\u043d\u043e\u0433\u043e \u043a\u0435\u0439\u0441\u0430. \u0412\u044b\u0431\u0438\u0432\u0430\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440\u0430, \u043a\u0430\u0442\u0430\u0439\u0442\u0435\u0441\u044c \u0432 \u0441\u0442\u0430\u043d\u0442\u0435 \u0438 \u0442\u043e\u0440\u0433\u0443\u0439\u0442\u0435 \u0441 \u0434\u0440\u0443\u0433\u0438\u043c\u0438 \u0438\u0433\u0440\u043e\u043a\u0430\u043c\u0438 \u043d\u0430 \u0440\u044b\u043d\u043a\u0435.</p><button class="btn sm" data-act="welcome-ok">\u041f\u043e\u043d\u044f\u0442\u043d\u043e</button></div>`:'';
  $('chips').innerHTML=['ru','ua','kz','mix'].map(c=>`<button class="chip" data-act="country" data-c="${c}" aria-pressed="${sel===c}" ${busy?'disabled':''}>${c==='mix'?FL.ru+FL.ua+FL.kz:FL[c]}<span>${CN[c]}</span></button>`).join('');
  const E=estimate(sel),full=S.box.length>=BOX_CAP,off=Net.status!=='on';
  $('tiers').innerHTML=TIERS.map((t,i)=>{
    if(t.event&&!seasonOn())return'';
    const short=S.bal<t.price,keys=S.keys[t.id]||0;
    return `<article class="tier t-${t.id}"><div class="crate" aria-hidden="true">${t.event?'<em>\u0418\u0432\u0435\u043d\u0442</em>':'<i></i>'}<span>\u00d7${t.k}</span></div>
      <h3>${t.name}</h3><p class="td">${t.desc}</p>
      <dl class="te"><div><dt>\u0420\u0435\u0434\u043a\u0438\u0439 \u0438 \u0432\u044b\u0448\u0435</dt><dd>\u2248 ${Math.round(E[i].rare*100)}%</dd></div><div><dt>\u0421\u0440\u0435\u0434\u043d\u0438\u0439 \u043d\u043e\u043c\u0435\u0440</dt><dd>\u2248 ${fmt(Math.round(E[i].avg/10)*10)}</dd></div><div><dt>\u041e\u043f\u044b\u0442 \u0441\u0435\u0437\u043e\u043d\u0430</dt><dd>+${t.xp}</dd></div></dl>
      <div class="tb"><button class="btn primary" data-act="open" data-i="${i}" ${busy||short||full||off?'disabled':''}>${short?'\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+fmt(t.price-S.bal):'\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0437\u0430 '+fmt(t.price)}</button>
      ${keys>0?`<button class="btn" data-act="open" data-i="${i}" data-key="1" ${busy||full||off?'disabled':''}>\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u043b\u044e\u0447\u043e\u043c \u00b7 ${keys} \u0448\u0442.</button>`:''}</div></article>`;
  }).join('');
  const anyKey=Object.values(S.keys).some(v=>v>0);
  let ban='';
  if(full)ban=`<div class="note warn"><p>\u0413\u0430\u0440\u0430\u0436 \u043f\u043e\u043b\u043e\u043d: ${BOX_CAP} \u043d\u043e\u043c\u0435\u0440\u043e\u0432. \u041f\u0440\u043e\u0434\u0430\u0439\u0442\u0435 \u0447\u0430\u0441\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443 \u0438\u043b\u0438 \u043d\u0430 \u0440\u044b\u043d\u043a\u0435, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0442\u044c \u043a\u0435\u0439\u0441\u044b.</p><button class="btn sm" data-act="go" data-tab="garage">\u0412 \u0433\u0430\u0440\u0430\u0436</button></div>`;
  else if(Net.status==='on'&&S.bal<TIERS[0].price&&!anyKey&&!busy)ban=`<div class="note warn"><p>\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043d\u0430 \u043a\u0435\u0439\u0441. \u0417\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u0439\u0442\u0435 \u0432 \u0441\u0442\u0430\u043d\u0442\u0435, \u0441\u0434\u0430\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440\u0430 \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443 \u0438\u043b\u0438 \u0432\u043e\u0437\u044c\u043c\u0438\u0442\u0435 \u043f\u043e\u0434\u0440\u0430\u0431\u043e\u0442\u043a\u0443.</p><div class="row"><button class="btn sm" id="bonus" data-act="bonus"></button><button class="btn sm primary" data-act="go" data-tab="stunt">\u0412 \u0441\u0442\u0430\u043d\u0442</button></div></div>`;
  $('banner').innerHTML=ban;
  if(!busy){$('cap-a').textContent=lastRes?'\u0412\u044b\u043f\u0430\u043b \u043d\u043e\u043c\u0435\u0440':'\u041a\u0435\u0439\u0441 \u00ab'+TIERS[curTier].name+'\u00bb';$('cap-b').textContent=CN[sel]}
  renderRes();renderFeed();renderTop();
}
function renderRes(){
  const box=$('res');
  if(!lastRes){box.hidden=true;box.innerHTML='';return}
  const r=lastRes,a=appraise(r.pl),t=TIERS[r.tier];
  const inBox=S.box.some(x=>x.id===r.id);
  const parts=a.parts.map(p=>`<li><span class="k">${p.k}</span><span class="v">${esc(p.v)}<small>${esc(p.t)}</small></span><span class="m">${xf(p.m)}</span></li>`).join('');
  const approx=Math.abs(a.raw-a.price)>.5?'\u2248':'=';
  const formula=`${fmt(a.base)} ${a.parts.map(p=>xf(p.m)).join(' ')} ${approx} ${fmt(a.price)}`;
  const quick=Math.floor(a.price*BUYBACK);
  const act=inBox?`<button class="btn ${armed==='last'?'armed':''}" data-act="quick" data-id="${r.id}" data-k="last">${armed==='last'?'\u0422\u043e\u0447\u043d\u043e \u0441\u0434\u0430\u0442\u044c?':'\u0421\u043a\u0443\u043f\u0449\u0438\u043a\u0443 \u0437\u0430 '+fmt(quick)}</button>${trade()?`<button class="btn" data-act="list-open" data-id="${r.id}">\u041d\u0430 \u0440\u044b\u043d\u043e\u043a</button>`:''}`:`<span class="done-l">\u041d\u043e\u043c\u0435\u0440 \u0443\u0436\u0435 \u043d\u0435 \u0432 \u0433\u0430\u0440\u0430\u0436\u0435</span>`;
  const keys=S.keys[t.id]||0;
  const again=keys>0?`<button class="btn primary" data-act="open" data-i="${r.tier}" data-key="1" ${busy?'disabled':''}>\u0415\u0449\u0451 \u043a\u043b\u044e\u0447\u043e\u043c \u00b7 ${keys} \u0448\u0442.</button>`
    :`<button class="btn primary" data-act="open" data-i="${r.tier}" ${busy||S.bal<t.price||(t.event&&!seasonOn())?'disabled':''}>\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0435\u0449\u0451 \u00b7 ${fmt(t.price)}</button>`;
  const fresh=box.dataset.id!==String(r.id);
  box.className='res rar-'+a.rar.k+(fresh&&!reduce?' pop':'');box.dataset.id=r.id;
  box.innerHTML=`<div class="res-head"><span class="pill"><i></i>${a.rar.n}</span><span class="where">${esc(whereText(r.pl))}</span></div>
    <div class="mat">${plateHTML(r.pl)}</div>
    <div class="priceline"><b>${fmt(a.price)}</b><span>\u043e\u0446\u0435\u043d\u043a\u0430${inBox?' \u00b7 \u043d\u043e\u043c\u0435\u0440 \u0443\u0436\u0435 \u0432 \u0433\u0430\u0440\u0430\u0436\u0435':''}</span></div>
    <ul class="parts">${parts}</ul>
    <p class="formula">\u0411\u0430\u0437\u0430 ${CS[r.pl.c]}: ${formula}</p>
    <div class="actions">${act}${again}</div>`;
  box.hidden=false;
}
function feedItem(it){
  const ago=agoText(it.t);
  if(it.k==='stunt')return `<li><div class="stunt-ico" aria-hidden="true"></div><div class="who"><b>${esc(it.n)}</b>${badge(it.u)} \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u043b \u0440\u0435\u043a\u043e\u0440\u0434 \u0432 \u0441\u0442\u0430\u043d\u0442\u0435<small>${ago}</small></div><div class="pr2">${fmtN(it.sc)} \u043e\u0447\u043a.</div></li>`;
  const a=appraise(it.pl);
  const what=it.k==='sale'?`<b>${esc(it.n)}</b>${badge(it.u)} \u043a\u0443\u043f\u0438\u043b \u0443 <b>${esc(it.s)}</b>${badge(it.su)}`:`<b>${esc(it.n)}</b>${badge(it.u)} \u0432\u044b\u0431\u0438\u043b ${a.rar.n.toLowerCase()} \u043d\u043e\u043c\u0435\u0440`;
  return `<li class="rar-${a.rar.k}"><div class="mat" style="padding:4px">${plateHTML(it.pl)}</div><div class="who">${what}<small>${ago}</small></div><div class="pr2">${fmt(it.p)}</div></li>`;
}
function renderFeed(){
  const show=Net.status==='on';
  $('feed-cases-wrap').hidden=!show;$('feed-market-wrap').hidden=!show;if(!show)return;
  const feed=(Net.feed||[]).filter(it=>it&&(it.k==='stunt'||(it.pl&&L.cleanPlate(it.pl))));
  $('feed-cases').innerHTML=feed.length?feed.slice(0,8).map(feedItem).join(''):'<li style="display:block;color:var(--muted)">\u041f\u043e\u043a\u0430 \u0442\u0438\u0445\u043e. \u0412\u044b\u0431\u0435\u0439\u0442\u0435 \u0440\u0435\u0434\u043a\u0438\u0439 \u043d\u043e\u043c\u0435\u0440, \u0438 \u043e\u043d \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c.</li>';
  const sales=feed.filter(x=>x.k==='sale');
  $('feed-market').innerHTML=sales.length?sales.slice(0,10).map(feedItem).join(''):'<li style="display:block;color:var(--muted)">\u0421\u0434\u0435\u043b\u043e\u043a \u043f\u043e\u043a\u0430 \u043d\u0435 \u0431\u044b\u043b\u043e.</li>';
}
function renderHow(){
  const li=r=>`<li><b>${xf(r.m)}</b><span>${r.t}<br><small>${r.ex}</small></span></li>`;
  $('how').innerHTML=`
    <div><h4>\u0426\u0438\u0444\u0440\u044b, \u0420\u0424 \u0438 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d</h4><ul>${RULES3.map(li).join('')}</ul></div>
    <div><h4>\u0426\u0438\u0444\u0440\u044b, \u0423\u043a\u0440\u0430\u0438\u043d\u0430</h4><ul>${RULES4.map(li).join('')}</ul></div>
    <div><h4>\u0411\u0443\u043a\u0432\u044b, \u0420\u0424</h4><ul>${LRULES.ru.map(li).join('')}</ul><h4 style="margin-top:14px">\u0411\u0443\u043a\u0432\u044b, \u0423\u043a\u0440\u0430\u0438\u043d\u0430</h4><ul>${LRULES.ua.map(li).join('')}</ul><h4 style="margin-top:14px">\u0411\u0443\u043a\u0432\u044b, \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d</h4><ul>${LRULES.kz.map(li).join('')}</ul></div>
    <div><h4>\u0420\u0435\u0433\u0438\u043e\u043d</h4><ul>
      <li><b>\u00d72\u20133,5</b><span>\u041c\u043e\u0441\u043a\u0432\u0430<br><small>777 \u0441\u0430\u043c\u044b\u0439 \u0434\u043e\u0440\u043e\u0433\u043e\u0439</small></span></li>
      <li><b>\u00d71,7</b><span>\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433<br><small>78, 98, 178</small></span></li>
      <li><b>\u00d71,3</b><span>\u041f\u043e\u0434\u043c\u043e\u0441\u043a\u043e\u0432\u044c\u0435, \u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439</span></li>
      <li><b>\u00d72,2\u20132,5</b><span>\u041a\u0438\u0435\u0432</span></li>
      <li><b>\u00d71,3\u20131,5</b><span>\u041e\u0434\u0435\u0441\u0441\u0430, \u0425\u0430\u0440\u044c\u043a\u043e\u0432, \u041b\u044c\u0432\u043e\u0432, \u0414\u043d\u0435\u043f\u0440, \u041a\u0438\u0435\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b.</span></li>
      <li><b>\u00d72\u20132,2</b><span>\u0410\u0441\u0442\u0430\u043d\u0430, \u0410\u043b\u043c\u0430\u0442\u044b</span></li>
      <li><b>\u00d71,4</b><span>\u0428\u044b\u043c\u043a\u0435\u043d\u0442</span></li></ul>
      <h4 style="margin-top:14px">\u0418\u0442\u043e\u0433</h4><p style="margin:0;font-size:14px">\u0426\u0435\u043d\u0430 = \u0431\u0430\u0437\u0430 \u00d7 \u0446\u0438\u0444\u0440\u044b \u00d7 \u0431\u0443\u043a\u0432\u044b \u00d7 \u0440\u0435\u0433\u0438\u043e\u043d. \u0411\u0430\u0437\u0430: \u0420\u0424 \u0438 \u041a\u0417 ${fmt(160)}, \u0423\u043a\u0440\u0430\u0438\u043d\u0430 ${fmt(200)}. \u0421\u043a\u0443\u043f\u0449\u0438\u043a \u043f\u043b\u0430\u0442\u0438\u0442 ${Math.round(BUYBACK*100)}% \u043e\u0446\u0435\u043d\u043a\u0438.</p></div>`;
}

/* ---------- \u0440\u0443\u043b\u0435\u0442\u043a\u0430 ---------- */
const track=$('track'),reel=$('reel');
const reelItem=pl=>`<div class="ri rar-${appraise(pl).rar.k}">${plateHTML(pl)}</div>`;
function idleReel(){
  if(tab!=='cases'||!reel.clientWidth){reelDirty=true;return}
  const items=Array.from({length:16},()=>genPlate(pick(ALL)));
  track.style.transition='none';track.innerHTML=items.map(reelItem).join('');
  const el=track.children[6];
  track.style.transform=`translateX(${-(el.offsetLeft+el.offsetWidth/2-reel.clientWidth/2)}px)`;
  reelDirty=false;
}
const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
function waitEnd(ms){return new Promise(r=>{let d=false;const f=()=>{if(!d){d=true;r()}};track.addEventListener('transitionend',f,{once:true});setTimeout(f,ms+400)})}
async function openCase(i,useKey){
  const t=TIERS[i];if(busy||!t)return;
  busy=true;curTier=i;lastRes=null;armed='';
  $('cap-a').textContent='\u0412\u044b\u0431\u0438\u0432\u0430\u0435\u043c \u043d\u043e\u043c\u0435\u0440\u2026';$('cap-b').textContent=CN[sel]+' \u00b7 \u00ab'+t.name+'\u00bb';
  render();
  let r;
  try{r=await act('open',{tier:i,key:!!useKey,c:sel})}
  catch(e){busy=false;toast(e.message);render();return}
  const W=38,items=[];
  for(let n=0;n<46;n++)items.push(n===W?r.pl:genPlate(sel==='mix'?pick(ALL):r.c));
  track.style.transition='none';track.style.transform='translateX(0)';
  track.innerHTML=items.map(reelItem).join('');
  await frame();
  const el=track.children[W];
  const x=el.offsetLeft+el.offsetWidth/2-reel.clientWidth/2+(Math.random()-.5)*el.offsetWidth*.5;
  if($('quick').checked||reduce||!reel.clientWidth){track.style.transform=`translateX(${-x}px)`}
  else{const ms=4300+rnd(900);track.style.transition=`transform ${ms}ms cubic-bezier(.1,.6,.1,1)`;track.style.transform=`translateX(${-x}px)`;await waitEnd(ms)}
  el.classList.add('win');
  lastRes={id:r.id,pl:r.pl,tier:i};
  busy=false;render();(r.notes||[]).forEach(toast);showInbox();
  $('cap-a').textContent='\u0412\u044b\u043f\u0430\u043b \u043d\u043e\u043c\u0435\u0440';$('cap-b').textContent=CN[sel]+' \u00b7 \u00ab'+t.name+'\u00bb';
  try{if(tab==='cases')$('res').scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'})}catch(e){}
}

/* ---------- \u0433\u0430\u0440\u0430\u0436 ---------- */
function renderGarage(){
  const best=S.best?`<div><dt>\u041b\u0443\u0447\u0448\u0438\u0439 \u043d\u043e\u043c\u0435\u0440 \u0437\u0430 \u0432\u0441\u0451 \u0432\u0440\u0435\u043c\u044f</dt><dd><div class="bestp">${plateHTML(S.best.pl)}</div>${fmt(S.best.price)}</dd></div>`:'';
  $('g-stats').innerHTML=`<div><dt>\u041d\u043e\u043c\u0435\u0440\u043e\u0432</dt><dd>${S.box.length} / ${BOX_CAP}</dd></div><div><dt>\u041e\u0446\u0435\u043d\u043a\u0430 \u0433\u0430\u0440\u0430\u0436\u0430</dt><dd>${fmt(worth(S))}</dd></div><div><dt>\u041e\u0442\u043a\u0440\u044b\u0442\u043e \u043a\u0435\u0439\u0441\u043e\u0432</dt><dd>${fmtN(S.opened)}</dd></div>${best}`;
  const ks=Object.keys(KEYN).filter(k=>S.keys[k]>0);
  $('g-keys').innerHTML=ks.length?`<p class="eyebrow" style="margin:0 0 10px">\u041a\u043b\u044e\u0447\u0438 \u043e\u0442 \u043a\u0435\u0439\u0441\u043e\u0432</p><div class="keys">${ks.map(k=>{const i=TIERS.findIndex(t=>t.id===k);return `<span class="key"><span>${KEYN[k]}</span><b>\u00d7${S.keys[k]}</b><button class="btn sm primary" data-act="open-key" data-i="${i}">\u041e\u0442\u043a\u0440\u044b\u0442\u044c</button></span>`}).join('')}</div>`:'';
  $('g-filters').innerHTML=['all','ru','ua','kz'].map(f=>`<button class="chip" data-act="g-filter" data-f="${f}" aria-pressed="${gFilt===f}">${f==='all'?'\u0412\u0441\u0435':FL[f]+'<span>'+CS[f]+'</span>'}</button>`).join('');
  const free=S.box.filter(x=>!x.pin),cheap=free.filter(x=>x.price<RARITY[1].min);
  const sum=l=>l.reduce((s,x)=>s+Math.floor(x.price*BUYBACK),0);
  const bt=(k,l,label)=>`<button class="btn sm ${armed===k?'armed':''}" data-act="bulk" data-k="${k}" ${l.length?'':'disabled'}>${armed===k?'\u0422\u043e\u0447\u043d\u043e \u0441\u0434\u0430\u0442\u044c '+l.length+' \u0448\u0442. \u0437\u0430 '+fmt(sum(l))+'?':label+' \u00b7 '+l.length+' \u0448\u0442. \u00b7 '+fmt(sum(l))}</button>`;
  $('g-bulk').innerHTML=bt('cheap',cheap,'\u0421\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443 \u043e\u0431\u044b\u0447\u043d\u044b\u0435')+bt('free',free,'\u0421\u0434\u0430\u0442\u044c \u0432\u0441\u0451, \u043a\u0440\u043e\u043c\u0435 \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d\u043d\u044b\u0445');
  const cmp=(a,b)=>gSort==='price-asc'?a.price-b.price:gSort==='new'?b.t-a.t:b.price-a.price;
  const list=S.box.filter(x=>gFilt==='all'||x.pl.c===gFilt).sort(cmp);
  $('g-list').innerHTML=list.length?list.map(gCard).join(''):`<div class="empty" style="grid-column:1/-1"><span>${S.box.length?'\u0412 \u044d\u0442\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043d\u043e\u043c\u0435\u0440\u043e\u0432.':'\u0413\u0430\u0440\u0430\u0436 \u043f\u0443\u0441\u0442. \u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043a\u0435\u0439\u0441, \u0438 \u043d\u043e\u043c\u0435\u0440 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c.'}</span><button class="btn primary" data-act="go" data-tab="cases">\u041a \u043a\u0435\u0439\u0441\u0430\u043c</button></div>`;
}
function gCard(x){
  const a=appraise(x.pl);
  const tags=a.parts.filter(p=>p.m>1).map(p=>`<span>${esc(p.t)} ${xf(p.m)}</span>`).join('')||'<span>\u0411\u0435\u0437 \u0431\u043e\u043d\u0443\u0441\u043e\u0432</span>';
  const key='q'+x.id,isArm=armed===key,q=Math.floor(x.price*BUYBACK);
  const src=x.src==='pass'?'<span>\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u0441\u0435\u0437\u043e\u043d\u0430</span>':x.src==='market'?'<span>\u0421 \u0440\u044b\u043d\u043a\u0430</span>':x.src==='admin'?'<span>\u0412\u044b\u0434\u0430\u043d \u0430\u0434\u043c\u0438\u043d\u043e\u043c</span>':'';
  return `<article class="card rar-${a.rar.k}${x.pin?' pinned':''}">
    <div class="meta"><span class="pill"><i></i>${a.rar.n}</span><span class="where">${esc(whereText(x.pl))}</span></div>
    <div class="mat">${plateHTML(x.pl)}</div>
    <div class="tags">${tags}${src}</div>
    <div class="foot2"><div class="price">${fmt(x.price)}<small>\u043e\u0446\u0435\u043d\u043a\u0430</small></div>
    <div class="btns"><button class="btn sm" data-act="pin" data-id="${x.id}" aria-pressed="${x.pin}">${x.pin?'\u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u044c':'\u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c'}</button>
    ${trade()?`<button class="btn sm" data-act="list-open" data-id="${x.id}">\u041d\u0430 \u0440\u044b\u043d\u043e\u043a</button>`:''}
    <button class="btn sm ${isArm?'armed':''}" data-act="quick" data-id="${x.id}">${isArm?'\u0422\u043e\u0447\u043d\u043e \u0437\u0430 '+fmt(q)+'?':'\u0421\u043a\u0443\u043f\u0449\u0438\u043a\u0443'}</button></div></div></article>`;
}

/* ---------- \u0440\u044b\u043d\u043e\u043a ---------- */
let meBuilt=false;
function renderMarket(){
  const st=$('m-status');
  if(Net.status==='loading')st.innerHTML=`<div class="note"><p>\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u043c\u0441\u044f \u043a \u0440\u044b\u043d\u043a\u0443\u2026</p></div>`;
  else if(Net.status==='off')st.innerHTML=`<div class="note warn"><p>\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041a\u0430\u043a \u0442\u043e\u043b\u044c\u043a\u043e \u0441\u0432\u044f\u0437\u044c \u0432\u0435\u0440\u043d\u0451\u0442\u0441\u044f, \u0440\u044b\u043d\u043e\u043a \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u0441\u0430\u043c.</p></div>`;
  else if(Net.me.banned)st.innerHTML=`<div class="note warn"><p>\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440 \u0437\u0430\u043a\u0440\u044b\u043b \u0432\u0430\u043c \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u0440\u044b\u043d\u043a\u0443. \u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u043b\u043e\u0442\u044b \u043c\u043e\u0436\u043d\u043e, \u043f\u043e\u043a\u0443\u043f\u0430\u0442\u044c \u0438 \u043f\u0440\u043e\u0434\u0430\u0432\u0430\u0442\u044c \u043d\u0435\u043b\u044c\u0437\u044f.</p></div>`;
  else st.innerHTML='';
  const me=$('m-me');
  if(trade()){
    if(!meBuilt){
      me.innerHTML=`<div class="panel" style="padding:14px 16px;display:grid;gap:14px">
        <div class="row"><div class="field grow"><label for="nick">\u0412\u0430\u0448 \u043d\u0438\u043a</label><input class="inp" id="nick" maxlength="20" autocomplete="nickname"></div><button class="btn" data-act="nick-save" style="align-self:end">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c</button></div>
        <div id="m-mine"></div></div>`;
      meBuilt=true;
    }
    const ni=$('nick');if(ni&&document.activeElement!==ni)ni.value=S.nick||'';
    renderMine();
  }else{me.innerHTML='';meBuilt=false}
  $('m-filters').innerHTML=['all','ru','ua','kz'].map(f=>`<button class="chip" data-act="m-filter" data-f="${f}" aria-pressed="${mFilt===f}">${f==='all'?'\u0412\u0441\u0435 \u0441\u0442\u0440\u0430\u043d\u044b':FL[f]+'<span>'+CS[f]+'</span>'}</button>`).join('');
  renderMarketList();renderFeed();
}
function renderMine(){
  const box=$('m-mine');if(!box)return;
  const mine=Net.open.filter(l=>l.seller===Net.me.uid);
  if(!mine.length){box.innerHTML=`<p class="muted" style="margin:0">\u0423 \u0432\u0430\u0441 \u043d\u0435\u0442 \u043b\u043e\u0442\u043e\u0432. \u0412\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u043c\u0435\u0440 \u043c\u043e\u0436\u043d\u043e \u0438\u0437 \u0433\u0430\u0440\u0430\u0436\u0430 \u0438\u043b\u0438 \u0441\u0440\u0430\u0437\u0443 \u043f\u043e\u0441\u043b\u0435 \u0432\u044b\u043f\u0430\u0434\u0435\u043d\u0438\u044f. \u041c\u0430\u043a\u0441\u0438\u043c\u0443\u043c ${MAX_LIST} \u043b\u043e\u0442\u043e\u0432.</p>`;return}
  box.innerHTML=`<p class="eyebrow" style="margin:0 0 8px">\u041c\u043e\u0438 \u043b\u043e\u0442\u044b \u00b7 ${mine.length} \u0438\u0437 ${MAX_LIST}</p><div class="mylist">${mine.map(l=>{const a=appraise(l.pl);return `<div class="myrow rar-${a.rar.k}"><div class="mat" style="padding:4px">${plateHTML(l.pl)}</div><div class="st">\u041d\u0430 \u043f\u0440\u043e\u0434\u0430\u0436\u0435 \u0437\u0430 <b>${fmt(l.ask)}</b><br>\u041e\u0446\u0435\u043d\u043a\u0430 ${fmt(a.price)} \u00b7 \u0432\u0430\u043c \u043f\u0440\u0438\u0434\u0451\u0442 ${fmt(Math.floor(l.ask*(1-FEE)))}</div><button class="btn sm" data-act="cancel" data-id="${esc(l.id)}">\u0421\u043d\u044f\u0442\u044c</button></div>`}).join('')}</div>`;
}
function renderMarketList(){
  const box=$('m-list');if(!box)return;
  if(Net.status!=='on'){box.innerHTML='';return}
  const rar=$('m-rar').value,sort=$('m-sort').value,q=toLat($('m-q').value);
  const minR=rar==='all'?0:RIDX[rar];
  const valid=Net.open.filter(l=>l&&L.cleanPlate(l.pl));
  let list=valid.map(l=>({l,a:appraise(l.pl)})).filter(({l,a})=>(mFilt==='all'||l.pl.c===mFilt)&&RIDX[a.rar.k]>=minR&&(!q||toLat(plateText(l.pl)).includes(q)));
  const sorters={new:(x,y)=>y.l.t-x.l.t,cheap:(x,y)=>x.l.ask-y.l.ask,exp:(x,y)=>y.l.ask-x.l.ask,deal:(x,y)=>x.l.ask/x.a.price-y.l.ask/y.a.price};
  list.sort(sorters[sort]||sorters.new);
  const total=list.length;list=list.slice(0,120);
  if(!valid.length){box.innerHTML=`<div class="empty" style="grid-column:1/-1"><span>\u041d\u0430 \u0440\u044b\u043d\u043a\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043b\u043e\u0442\u043e\u0432. \u0412\u044b\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0441\u0432\u043e\u0439 \u043d\u043e\u043c\u0435\u0440 \u043f\u0435\u0440\u0432\u044b\u043c.</span>${trade()?'<button class="btn primary" data-act="go" data-tab="garage">\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u043d\u043e\u043c\u0435\u0440 \u0432 \u0433\u0430\u0440\u0430\u0436\u0435</button>':''}</div>`;return}
  if(!total){box.innerHTML=`<div class="empty" style="grid-column:1/-1"><span>\u041f\u043e\u0434 \u0444\u0438\u043b\u044c\u0442\u0440 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043f\u043e\u0434\u043e\u0448\u043b\u043e.</span></div>`;return}
  box.innerHTML=list.map(({l,a})=>mCard(l,a)).join('')+(total>120?`<p class="muted" style="grid-column:1/-1;margin:0">\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u044b \u043f\u0435\u0440\u0432\u044b\u0435 120 \u0438\u0437 ${total}. \u0423\u0442\u043e\u0447\u043d\u0438\u0442\u0435 \u043f\u043e\u0438\u0441\u043a.</p>`:'');
}
function mCard(l,a){
  const mine=l.seller===Net.me.uid,d=Math.round((l.ask/a.price-1)*100);
  const delta=d===0?'<span class="delta">\u043f\u043e \u043e\u0446\u0435\u043d\u043a\u0435</span>':`<span class="delta ${d<0?'down':'up'}">${d>0?'+':'\u2212'}${Math.abs(d)}%</span>`;
  const key='b'+l.id,isArm=armed===key;
  let btn='';
  if(mine)btn=`<button class="btn sm" data-act="cancel" data-id="${esc(l.id)}">\u0421\u043d\u044f\u0442\u044c</button>`;
  else if(!trade())btn='';
  else if(S.bal<l.ask)btn=`<button class="btn sm" disabled>\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 ${fmt(l.ask-S.bal)}</button>`;
  else btn=`<button class="btn sm ${isArm?'armed':'primary'}" data-act="buy" data-id="${esc(l.id)}">${isArm?'\u0422\u043e\u0447\u043d\u043e \u043a\u0443\u043f\u0438\u0442\u044c?':'\u041a\u0443\u043f\u0438\u0442\u044c'}</button>`;
  const mod=Net.me.admin&&!mine?`<button class="btn sm ghost" data-act="mod" data-id="${esc(l.id)}">${armed==='mod'+l.id?'\u0422\u043e\u0447\u043d\u043e \u0443\u0431\u0440\u0430\u0442\u044c?':'\u0423\u0431\u0440\u0430\u0442\u044c'}</button>`:'';
  return `<article class="card rar-${a.rar.k}${mine?' mine':''}">
    <div class="meta"><span class="pill"><i></i>${a.rar.n}</span><span class="where">${esc(whereText(l.pl))}</span></div>
    <div class="mat">${plateHTML(l.pl)}</div>
    <div class="seller">\u041f\u0440\u043e\u0434\u0430\u0432\u0435\u0446 <b>${esc(l.nick)}</b>${badge(l.seller)}${mine?' \u00b7 \u044d\u0442\u043e \u0432\u044b':''} \u00b7 ${agoText(l.t)}</div>
    <div class="foot2"><div class="price">${fmt(l.ask)}<small>\u041e\u0446\u0435\u043d\u043a\u0430 ${fmt(a.price)} ${delta}</small></div><div class="btns">${mod}${btn}</div></div></article>`;
}
function openListSheet(id){
  const x=S.box.find(v=>v.id===id);if(!x)return;
  if(!trade())return toast('\u0422\u043e\u0440\u0433\u043e\u0432\u043b\u044f \u0441\u0435\u0439\u0447\u0430\u0441 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430');
  const a=appraise(x.pl);
  openSheet(`<div class="sc rar-${a.rar.k}" role="dialog" aria-modal="true" aria-labelledby="sh-t">
    <h3 id="sh-t">\u0412\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0440\u044b\u043d\u043e\u043a</h3>
    <div class="mat">${plateHTML(x.pl)}</div>
    <div class="field"><label for="ask">\u0426\u0435\u043d\u0430, \u20bd</label><input class="inp num" id="ask" type="number" inputmode="numeric" min="${MIN_ASK}" max="${MAX_ASK}" step="10" value="${a.price}"></div>
    <div class="chips"><button class="chip" data-act="ask-set" data-k=".9">\u221210%</button><button class="chip" data-act="ask-set" data-k="1">\u041f\u043e \u043e\u0446\u0435\u043d\u043a\u0435</button><button class="chip" data-act="ask-set" data-k="1.25">+25%</button><button class="chip" data-act="ask-set" data-k="1.5">+50%</button></div>
    <dl class="sum"><div><dt>\u041e\u0446\u0435\u043d\u043a\u0430</dt><dd>${fmt(a.price)}</dd></div><div><dt>\u041a\u043e\u043c\u0438\u0441\u0441\u0438\u044f \u0440\u044b\u043d\u043a\u0430 5%</dt><dd id="sh-fee"></dd></div><div><dt>\u0412\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435</dt><dd id="sh-pay"></dd></div><div><dt>\u0421\u043a\u0443\u043f\u0449\u0438\u043a \u0434\u0430\u043b \u0431\u044b</dt><dd>${fmt(Math.floor(a.price*BUYBACK))}</dd></div></dl>
    <p class="muted" style="margin:0;font-size:13.5px">\u041d\u043e\u043c\u0435\u0440 \u0443\u0439\u0434\u0451\u0442 \u0438\u0437 \u0433\u0430\u0440\u0430\u0436\u0430 \u043d\u0430 \u0440\u044b\u043d\u043e\u043a. \u0421\u043d\u044f\u0442\u044c \u043b\u043e\u0442 \u043c\u043e\u0436\u043d\u043e \u0432 \u043b\u044e\u0431\u043e\u0439 \u043c\u043e\u043c\u0435\u043d\u0442, \u043f\u043e\u043a\u0430 \u0435\u0433\u043e \u043d\u0435 \u043a\u0443\u043f\u0438\u043b\u0438.</p>
    <div class="row"><button class="btn ghost" data-act="sheet-close">\u041e\u0442\u043c\u0435\u043d\u0430</button><span style="flex:1"></span><button class="btn primary" data-act="list-confirm" data-id="${id}">\u0412\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c</button></div></div>`,{base:a.price,focus:'ask'});
  updAsk();
}
function updAsk(){const el=$('ask');if(!el)return;const v=Math.round(num(el.value));const ok=v>=MIN_ASK&&v<=MAX_ASK;$('sh-fee').textContent=ok?fmt(v-Math.floor(v*(1-FEE))):'\u2014';$('sh-pay').textContent=ok?fmt(Math.floor(v*(1-FEE))):'\u2014'}
function openSheet(html,opt){const sh=$('sheet');sh.innerHTML=html;sh.hidden=false;if(opt&&opt.base)sh.dataset.base=opt.base;if(opt&&opt.focus)setTimeout(()=>{try{$(opt.focus).focus()}catch(e){}},30)}
function closeSheet(){const sh=$('sheet');sh.hidden=true;sh.innerHTML=''}

/* ---------- \u0441\u0442\u0430\u043d\u0442 ---------- */
function carColor(){return(CARS[S.car]||CARS.orange).c}
function stuntToday(){const d=mskDate();return S.stunt.d===d?{earned:S.stunt.earned,runs:S.stunt.runs}:{earned:0,runs:0}}
function stuntStartHtml(){
  const td=stuntToday(),left=Math.max(0,STUNT_CAP-td.earned);
  return `<h3>\u0417\u0430\u0435\u0437\u0434 \u043d\u0430 45 \u0441\u0435\u043a\u0443\u043d\u0434</h3>
    <p>\u0413\u0430\u0437 \u0440\u0430\u0437\u0433\u043e\u043d\u044f\u0435\u0442 \u043c\u0430\u0448\u0438\u043d\u0443, \u0430 \u0432 \u0432\u043e\u0437\u0434\u0443\u0445\u0435 \u043a\u0440\u0443\u0442\u0438\u0442 \u0435\u0451 \u043d\u0430\u0437\u0430\u0434. \u0422\u043e\u0440\u043c\u043e\u0437 \u0432 \u0432\u043e\u0437\u0434\u0443\u0445\u0435 \u043a\u0440\u0443\u0442\u0438\u0442 \u0432\u043f\u0435\u0440\u0451\u0434. \u041f\u0440\u0438\u0437\u0435\u043c\u043b\u044f\u0439\u0442\u0435\u0441\u044c \u043d\u0430 \u043a\u043e\u043b\u0451\u0441\u0430.</p>
    <dl><div><dt>\u0411\u044d\u043a\u0444\u043b\u0438\u043f</dt><dd>1 500</dd></div><div><dt>\u0424\u0440\u043e\u043d\u0442\u0444\u043b\u0438\u043f</dt><dd>1 900</dd></div><div><dt>\u0418\u0434\u0435\u0430\u043b\u044c\u043d\u043e\u0435 \u043f\u0440\u0438\u0437\u0435\u043c\u043b\u0435\u043d\u0438\u0435</dt><dd>\u00d71,5</dd></div><div><dt>\u0424\u043b\u0438\u043f\u044b \u043f\u043e\u0434\u0440\u044f\u0434</dt><dd>+25% \u0437\u0430 \u043a\u0430\u0436\u0434\u044b\u0439</dd></div><div><dt>\u041a\u0430\u0436\u0434\u044b\u0435 10 \u043c</dt><dd>10</dd></div></dl>
    <p>${left>0?'\u0421\u0435\u0433\u043e\u0434\u043d\u044f \u043c\u043e\u0436\u043d\u043e \u0437\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u0435\u0449\u0451 '+fmt(left)+'. 20 \u043e\u0447\u043a\u043e\u0432 = 1 \u20bd.':'\u0414\u043d\u0435\u0432\u043d\u043e\u0439 \u043b\u0438\u043c\u0438\u0442 \u0440\u0443\u0431\u043b\u0435\u0439 \u0438\u0441\u0447\u0435\u0440\u043f\u0430\u043d. \u041e\u043f\u044b\u0442 \u0441\u0435\u0437\u043e\u043d\u0430 \u043d\u0430\u0447\u0438\u0441\u043b\u044f\u0435\u0442\u0441\u044f \u043a\u0430\u043a \u043e\u0431\u044b\u0447\u043d\u043e.'}</p>
    <button class="btn primary wide" data-act="stunt-start">\u041f\u043e\u0435\u0445\u0430\u043b\u0438</button>`;
}
function stuntEndHtml(res,rew){
  return `<h3>${res.crashed?'\u0410\u0432\u0430\u0440\u0438\u044f':'\u0424\u0438\u043d\u0438\u0448'}${rew&&rew.rec?' \u00b7 \u0440\u0435\u043a\u043e\u0440\u0434!':''}</h3>
    <dl><div><dt>\u041e\u0447\u043a\u0438</dt><dd>${fmtN(res.score)}</dd></div><div><dt>\u0424\u043b\u0438\u043f\u044b</dt><dd>${res.flips}</dd></div><div><dt>\u041b\u0443\u0447\u0448\u0438\u0439 \u043f\u0440\u044b\u0436\u043e\u043a</dt><dd>${fmtN(res.best)}</dd></div><div><dt>\u041f\u0440\u043e\u0435\u0445\u0430\u043b\u0438</dt><dd>${fmtN(res.dist)} \u043c</dd></div>
    <div><dt>\u041d\u0430\u0433\u0440\u0430\u0434\u0430</dt><dd>${rew?'+'+fmt(rew.money)+(rew.xp?' \u00b7 +'+rew.xp+' \u043e\u043f\u044b\u0442\u0430':''):'\u043d\u0435 \u043d\u0430\u0447\u0438\u0441\u043b\u0435\u043d\u0430'}</dd></div></dl>
    ${rew&&rew.capped?'<p>\u0414\u043d\u0435\u0432\u043d\u043e\u0439 \u043b\u0438\u043c\u0438\u0442 \u0440\u0443\u0431\u043b\u0435\u0439 \u0437\u0430 \u0441\u0442\u0430\u043d\u0442 \u0438\u0441\u0447\u0435\u0440\u043f\u0430\u043d. \u0417\u0430\u0432\u0442\u0440\u0430 \u0441\u043d\u043e\u0432\u0430 \u043c\u043e\u0436\u043d\u043e \u0437\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u0434\u043e '+fmt(STUNT_CAP)+'.</p>':''}
    ${rew?'':'<p>\u0421\u0435\u0440\u0432\u0435\u0440 \u043d\u0435 \u043f\u0440\u0438\u043d\u044f\u043b \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u0432\u044f\u0437\u044c \u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0437\u0430\u0435\u0437\u0434.</p>'}
    <button class="btn primary wide" data-act="stunt-start">\u0415\u0449\u0451 \u0437\u0430\u0435\u0437\u0434</button>`;
}
function onStuntEnd(res){
  const runId=stuntRun;stuntRun=null;
  return act('stuntEnd',Object.assign({run:runId},res)).then(r=>{(r.notes||[]).forEach(toast);render();showInbox();return r}).catch(e=>{toast(e.message);return null});
}
async function startStunt(){
  if(Net.op)return;Net.op=true;
  try{const r=await act('stuntStart');stuntRun=r.run;Stunt.start();renderStuntSide()}
  catch(e){toast(e.message)}
  finally{Net.op=false}
}
function renderStuntSide(){
  const td=stuntToday();
  const sw=Object.keys(CARS).map(id=>{
    const c=CARS[id],own=S.cars.includes(id);
    const title=own?c.n:c.cost?c.n+' \u00b7 '+c.cost+' \u25c6':c.n+' \u00b7 '+(CAR_SRC[id]||'');
    const isArm=armed==='car'+id;
    return `<button class="sw ${own||c.cost?'':'locked'}" style="background:${c.c}${isArm?';outline:3px solid var(--bad)':''}" data-act="car" data-id="${id}" aria-pressed="${S.car===id}" title="${esc(title)}" aria-label="${esc(title)}"></button>`;
  }).join('');
  const armedCar=Object.keys(CARS).find(id=>armed==='car'+id);
  $('stunt-side').innerHTML=`<dl class="kv"><div><dt>\u0420\u0435\u043a\u043e\u0440\u0434</dt><dd>${fmtN(S.stunt.best)}</dd></div><div><dt>\u0417\u0430\u0435\u0437\u0434\u043e\u0432 \u0441\u0435\u0433\u043e\u0434\u043d\u044f</dt><dd>${td.runs}</dd></div><div><dt>\u0417\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u043e \u0441\u0435\u0433\u043e\u0434\u043d\u044f</dt><dd>${fmt(td.earned)} <span class="muted" style="font:500 14px var(--f-body)">\u0438\u0437 ${fmt(STUNT_CAP)}</span></dd><div class="meter"><i style="width:${Math.min(100,td.earned/STUNT_CAP*100)}%"></i></div></div></dl>
    <div><p class="eyebrow" style="margin:0 0 10px">\u0426\u0432\u0435\u0442 \u043c\u0430\u0448\u0438\u043d\u044b</p><div class="colors">${sw}</div>
    <p class="muted" style="margin:10px 0 0;font-size:13.5px">${armedCar?'\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437, \u0447\u0442\u043e\u0431\u044b \u043a\u0443\u043f\u0438\u0442\u044c \u00ab'+CARS[armedCar].n+'\u00bb \u0437\u0430 '+CARS[armedCar].cost+' \u25c6':'\u0421\u0435\u0439\u0447\u0430\u0441: \u00ab'+CARS[S.car].n+'\u00bb. \u0427\u0430\u0441\u0442\u044c \u0446\u0432\u0435\u0442\u043e\u0432 \u0434\u0430\u0451\u0442 \u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u043f\u0443\u0441\u043a, \u043e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0434\u0430\u044e\u0442\u0441\u044f \u0437\u0430 \u0433\u043e\u043b\u0434\u0443.'}</p></div>`;
}

/* ---------- \u0441\u0435\u0437\u043e\u043d ---------- */
function countdown(){const ms=SEASON.end-Date.now();if(ms<=0)return'\u0421\u0435\u0437\u043e\u043d \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d';const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);return'\u0414\u043e \u043a\u043e\u043d\u0446\u0430 \u0441\u0435\u0437\u043e\u043d\u0430: '+(d?d+' \u0434 ':'')+h+' \u0447'+(d?'':' '+m+' \u043c\u0438\u043d')}
function renderSeason(){
  const Lv=level(S),max=Lv>=SEASON.max;
  const inLvl=max?SEASON.lvlXp:S.xp%SEASON.lvlXp;
  const premBtn=S.premium?'<span class="pill" style="--rc:var(--gold)"><i></i>\u041f\u0440\u0435\u043c\u0438\u0443\u043c \u0430\u043a\u0442\u0438\u0432\u0435\u043d</span>'
    :seasonOn()?`<button class="btn goldy" data-act="premium">${armed==='premium'?'\u0422\u043e\u0447\u043d\u043e? \u0421\u043f\u0438\u0448\u0435\u0442\u0441\u044f '+gem(SEASON.premium):'\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u0435\u043c\u0438\u0443\u043c \u00b7 '+gem(SEASON.premium)}</button>${S.gold<SEASON.premium?'<span class="muted" style="font-size:13.5px">\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(SEASON.premium-S.gold)+'</span>':''}`:'';
  $('s-hero').innerHTML=`<div class="biglvl" style="--p:${lvlPct(S)}"><div><span><small>\u0423\u0440\u043e\u0432\u0435\u043d\u044c</small><b>${Lv}</b></span></div></div>
    <div style="min-width:0"><p class="eyebrow" style="margin:0 0 6px" id="s-count">${countdown()}</p><h2 class="h">\u0421\u0435\u0437\u043e\u043d 1 \u00b7 \u0412\u044b\u0445\u043e\u0434 \u0438\u0437 \u0431\u0435\u0442\u044b</h2>
    <div class="bar2" role="progressbar" aria-valuemin="0" aria-valuemax="${SEASON.lvlXp}" aria-valuenow="${inLvl}"><i style="width:${lvlPct(S)}%"></i></div>
    <p class="muted" style="margin:8px 0 0;font-size:14px">${max?'\u041c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u044b\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c. \u0412\u0441\u0435\u0433\u043e '+fmtN(S.xp)+' \u043e\u043f\u044b\u0442\u0430':fmtN(inLvl)+' / '+fmtN(SEASON.lvlXp)+' \u043e\u043f\u044b\u0442\u0430 \u0434\u043e \u0443\u0440\u043e\u0432\u043d\u044f '+(Lv+1)}. \u041e\u043f\u044b\u0442 \u0434\u0430\u044e\u0442 \u043a\u0435\u0439\u0441\u044b (40\u2013250), \u0441\u0442\u0430\u043d\u0442 (\u0434\u043e 250 \u0437\u0430 \u0437\u0430\u0435\u0437\u0434), \u0441\u0434\u0435\u043b\u043a\u0438 \u043d\u0430 \u0440\u044b\u043d\u043a\u0435 (50\u201380) \u0438 \u0437\u0430\u0434\u0430\u043d\u0438\u044f (350).</p>
    <div class="row">${premBtn}</div></div>`;
  const qb=$('quests');
  if(S.daily.d!==mskDate())qb.innerHTML='<p class="muted" style="margin:0">\u0417\u0430\u0434\u0430\u043d\u0438\u044f \u0434\u043d\u044f \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0432\u043e\u0433\u043e \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u0432 \u0438\u0433\u0440\u0435 \u0441\u0435\u0433\u043e\u0434\u043d\u044f: \u043e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043a\u0435\u0439\u0441 \u0438\u043b\u0438 \u043f\u0440\u043e\u0435\u0434\u044c\u0442\u0435 \u0437\u0430\u0435\u0437\u0434.</p>';
  else qb.innerHTML=S.daily.q.map(id=>{const Q=QUESTS[id],p=num(S.daily.p[id]),done=S.daily.done.includes(id),ready=p>=Q.g&&!done;
      return `<div class="quest${done?' done':''}"><div><div class="q-t">${Q.t}</div><div class="q-r">${fmtN(p)} / ${fmtN(Q.g)} \u00b7 \u043d\u0430\u0433\u0440\u0430\u0434\u0430 350 \u043e\u043f\u044b\u0442\u0430 \u0438 300 \u20bd</div></div>
      ${done?'<span class="ok-mark">\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043e</span>':`<button class="btn sm ${ready?'primary':''}" data-act="quest" data-id="${id}" ${ready?'':'disabled'}>\u0417\u0430\u0431\u0440\u0430\u0442\u044c</button>`}
      <div class="bar2"><i style="width:${Math.min(100,p/Q.g*100)}%"></i></div></div>`}).join('');
  const cl=claimable(S);
  $('claimall').innerHTML=cl?`<button class="btn primary sm" data-act="claim-all">\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u0432\u0441\u0451 \u00b7 ${cl}</button>`:'';
  let rows=`<div class="trow head"><span>\u0423\u0440.</span><span>\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e</span><span>\u041f\u0440\u0435\u043c\u0438\u0443\u043c</span></div>`;
  for(let i=1;i<=SEASON.max;i++){const reached=i<=Lv;rows+=`<div class="trow${reached?' reached':''}"><div class="lv">${i}</div>${rwCell(FREE[i],'f',i,reached,S.cf.includes(i),true)}${rwCell(PREM[i],'p',i,reached,S.cp.includes(i),S.premium)}</div>`}
  $('ptrack').innerHTML=rows;
  renderLeaderboard();
}
function rwCell(r,trk,i,reached,got,unlocked){
  const t=rewardText(r);
  const label=t.plate?`<div class="mini-plate">${plateHTML(t.plate)}<span class="rl"><small>${esc(t.b)}</small></span></div>`:`<span class="rl">${esc(t.a)}<small>${esc(t.b)}</small></span>`;
  let right='';
  if(got)right='<span class="ok-mark" aria-label="\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043e">\u2713</span>';
  else if(reached&&unlocked)right=`<button class="btn sm primary" data-act="claim" data-t="${trk}" data-l="${i}">\u0417\u0430\u0431\u0440\u0430\u0442\u044c</button>`;
  else if(trk==='p'&&!unlocked)right='<span class="muted" style="font-size:12px">\u043f\u0440\u0435\u043c\u0438\u0443\u043c</span>';
  return `<div class="${['rw',trk==='p'?'prem':'',got?'got':'',!reached||!unlocked?'lock':''].join(' ')}">${label}${right}</div>`;
}
function renderLeaderboard(){
  const box=$('lb');if(!box)return;
  if(Net.status!=='on'){box.innerHTML='<p class="muted">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</p>';return}
  const list=Net.top||[];
  if(!list.length){box.innerHTML='<div class="empty"><span>\u041f\u043e\u043a\u0430 \u0432 \u0442\u043e\u043f\u0435 \u043d\u0438\u043a\u043e\u0433\u043e. \u041f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 \u043e\u043f\u044b\u0442, \u0438 \u0432\u044b \u043f\u043e\u044f\u0432\u0438\u0442\u0435\u0441\u044c \u0437\u0434\u0435\u0441\u044c \u043f\u0435\u0440\u0432\u044b\u043c.</span></div>';return}
  box.innerHTML=`<div class="tablewrap"><table class="lb"><thead><tr><th>#</th><th>\u0418\u0433\u0440\u043e\u043a</th><th>\u0423\u0440.</th><th>\u0413\u0430\u0440\u0430\u0436</th></tr></thead><tbody>${list.map((p,i)=>`<tr class="${p.uid===Net.me.uid?'me':''}"><td class="rk">${i+1}</td><td class="nick">${esc(p.nick)}${badge(p.uid)}${p.uid===Net.me.uid?' <span class="muted">(\u0432\u044b)</span>':''}</td><td>${p.lvl}</td><td>${fmt(p.worth)}</td></tr>`).join('')}</tbody></table></div>`;
}

/* ---------- \u0434\u043e\u043d\u0430\u0442 ---------- */
let shopBuilt=false;
function renderShop(){
  $('sh-packs').innerHTML=`<div class="packs">${PACKS.map((p,i)=>`<button class="pack" data-act="pack" data-i="${i}" aria-pressed="${packSel===i}">${p.b?`<span class="bonus">${p.b}</span>`:''}<span class="g"><span class="gem">\u25c6</span>${fmtN(p.g)}</span><span class="rub">${fmt(p.rub)}</span></button>`).join('')}</div>`;
  if(!shopBuilt){
    $('sh-pay').innerHTML=`<div id="sh-info" style="display:grid;gap:12px"></div>
      <div class="row"><div class="field grow"><label for="promo">\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434</label><input class="inp" id="promo" placeholder="XXXX-XXXX-XXXX" autocomplete="off" autocapitalize="characters" spellcheck="false"></div><button class="btn goldy" data-act="promo" style="align-self:end">\u0410\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u0442\u044c</button></div>`;
    shopBuilt=true;
  }
  const P=PACKS[packSel],shop=Net.cfg.shop;
  let info=`<h3 class="h3">\u041a\u0430\u043a \u043f\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0433\u043e\u043b\u0434\u0443</h3>`;
  if(!shop)info+=`<p class="muted" style="margin:0">\u0412\u043b\u0430\u0434\u0435\u043b\u0435\u0446 \u0438\u0433\u0440\u044b \u0435\u0449\u0451 \u043d\u0435 \u0443\u043a\u0430\u0437\u0430\u043b, \u043a\u0443\u0434\u0430 \u043f\u0435\u0440\u0435\u0432\u043e\u0434\u0438\u0442\u044c \u043e\u043f\u043b\u0430\u0442\u0443. \u041f\u043e\u043a\u0430 \u0433\u043e\u043b\u0434\u0443 \u043c\u043e\u0436\u043d\u043e \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0432 \u0441\u0435\u0437\u043e\u043d\u043d\u043e\u043c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0435: \u0434\u043e 1 080 \u25c6 \u0437\u0430 \u0441\u0435\u0437\u043e\u043d.</p>`;
  else info+=`<ol class="steps">
      <li>\u041f\u0435\u0440\u0435\u0432\u0435\u0434\u0438\u0442\u0435 <b>${fmt(P.rub)}</b> \u0437\u0430 <b>${gem(P.g)}</b> \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0443 \u0438\u0433\u0440\u044b.${shop.payText?`<div style="white-space:pre-wrap;margin-top:6px;color:var(--muted)">${esc(shop.payText)}</div>`:''}${shop.payLink?`<div style="margin-top:8px"><a class="btn sm" href="${esc(shop.payLink)}" target="_blank" rel="noopener noreferrer">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u043e\u043f\u043b\u0430\u0442\u044b</a></div>`:''}</li>
      <li>\u0412 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438 \u043a \u043f\u0435\u0440\u0435\u0432\u043e\u0434\u0443 \u0443\u043a\u0430\u0436\u0438\u0442\u0435 \u043d\u0438\u043a: <span class="copyline" style="display:inline-flex"><code>${esc(S.nick||'')}</code><button class="btn sm ghost" data-act="copy" data-text="${esc(S.nick||'')}">\u041a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c</button></span></li>
      <li>\u0412\u043b\u0430\u0434\u0435\u043b\u0435\u0446 \u043f\u0440\u0438\u0448\u043b\u0451\u0442 \u043e\u0434\u043d\u043e\u0440\u0430\u0437\u043e\u0432\u044b\u0439 \u043f\u0440\u043e\u043c\u043e\u043a\u043e\u0434. \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0435\u0433\u043e \u043d\u0438\u0436\u0435, \u0433\u043e\u043b\u0434\u0430 \u043d\u0430\u0447\u0438\u0441\u043b\u0438\u0442\u0441\u044f \u0441\u0440\u0430\u0437\u0443.</li></ol>
      <p class="muted" style="margin:0;font-size:13px">\u041e\u043f\u043b\u0430\u0442\u0430 \u0438\u0434\u0451\u0442 \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0443 \u0438\u0433\u0440\u044b. \u0421\u0430\u0439\u0442 \u043d\u0435 \u043f\u0440\u0438\u043d\u0438\u043c\u0430\u0435\u0442 \u0438 \u043d\u0435 \u0445\u0440\u0430\u043d\u0438\u0442 \u0434\u0430\u043d\u043d\u044b\u0435 \u043a\u0430\u0440\u0442.</p>`;
  $('sh-info').innerHTML=info;
  const store=[];
  if(seasonOn()||S.premium)store.push(`<div class="item"><h4>\u041f\u0440\u0435\u043c\u0438\u0443\u043c-\u043f\u0440\u043e\u043f\u0443\u0441\u043a</h4><p>\u0412\u0442\u043e\u0440\u0430\u044f \u043b\u0438\u043d\u0438\u044f \u043d\u0430\u0433\u0440\u0430\u0434 \u0441\u0435\u0437\u043e\u043d\u0430: 630 \u25c6 \u043e\u0431\u0440\u0430\u0442\u043d\u043e, \u043a\u043b\u044e\u0447\u0438, \u0446\u0432\u0435\u0442\u0430 \u043c\u0430\u0448\u0438\u043d\u044b \u0438 \u043b\u0435\u0433\u0435\u043d\u0434\u0430\u0440\u043d\u044b\u0439 \u0410777\u0410\u0410 777 \u043d\u0430 30 \u0443\u0440\u043e\u0432\u043d\u0435.</p>${S.premium?'<span class="ok-mark">\u0423\u0436\u0435 \u0430\u043a\u0442\u0438\u0432\u0435\u043d</span>':`<button class="btn goldy" data-act="premium" ${S.gold<SEASON.premium?'disabled':''}>${armed==='premium'?'\u0422\u043e\u0447\u043d\u043e? \u0421\u043f\u0438\u0448\u0435\u0442\u0441\u044f '+gem(SEASON.premium):'\u041a\u0443\u043f\u0438\u0442\u044c \u00b7 '+gem(SEASON.premium)}</button>`}</div>`);
  if(seasonOn())store.push(`<div class="item"><h4>\u041a\u043b\u044e\u0447 \u00ab\u0421\u0435\u0437\u043e\u043d\u043d\u044b\u0439\u00bb</h4><p>\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442 \u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0439 \u043a\u0435\u0439\u0441: \u043b\u0443\u0447\u0448\u0438\u0439 \u0438\u0437 14 \u043d\u043e\u043c\u0435\u0440\u043e\u0432, \u043d\u0435 \u043d\u0438\u0436\u0435 \u00ab\u0420\u0435\u0434\u043a\u043e\u0433\u043e\u00bb.</p><button class="btn goldy" data-act="buy-key" data-k="season" ${S.gold<GKEY.season?'disabled':''}>\u041a\u0443\u043f\u0438\u0442\u044c \u00b7 ${gem(GKEY.season)}</button></div>`);
  store.push(`<div class="item"><h4>\u041a\u043b\u044e\u0447 \u00ab\u042d\u043b\u0438\u0442\u043d\u044b\u0439\u00bb</h4><p>\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442 \u044d\u043b\u0438\u0442\u043d\u044b\u0439 \u043a\u0435\u0439\u0441: \u043b\u0443\u0447\u0448\u0438\u0439 \u0438\u0437 10 \u043d\u043e\u043c\u0435\u0440\u043e\u0432.</p><button class="btn goldy" data-act="buy-key" data-k="elite" ${S.gold<GKEY.elite?'disabled':''}>\u041a\u0443\u043f\u0438\u0442\u044c \u00b7 ${gem(GKEY.elite)}</button></div>`);
  store.push(`<div class="item"><h4>\u041e\u0431\u043c\u0435\u043d \u043d\u0430 \u0440\u0443\u0431\u043b\u0438</h4><p>10 \u25c6 = ${fmt(500)}. \u0414\u0435\u043d\u044c\u0433\u0438 \u0441\u0440\u0430\u0437\u0443 \u043d\u0430 \u0431\u0430\u043b\u0430\u043d\u0441.</p><div class="row"><button class="btn goldy" data-act="exch" data-n="1" ${S.gold<10?'disabled':''}>10 \u25c6</button><button class="btn" data-act="exch" data-n="10" ${S.gold<100?'disabled':''}>100 \u25c6 \u2192 ${fmt(5000)}</button></div></div>`);
  store.push(`<div class="item"><h4>\u0426\u0432\u0435\u0442\u0430 \u043c\u0430\u0448\u0438\u043d\u044b</h4><p>\u041a\u0440\u0430\u0441\u043d\u044b\u0439 \u0438 \u0441\u0438\u043d\u0438\u0439 \u043f\u043e 60 \u25c6, \u0447\u0451\u0440\u043d\u044b\u0439 \u0438 \u0431\u0435\u043b\u044b\u0439 \u043f\u043e 90 \u25c6. \u0412\u044b\u0431\u0438\u0440\u0430\u044e\u0442\u0441\u044f \u0432 \u0441\u0442\u0430\u043d\u0442\u0435.</p><button class="btn" data-act="go" data-tab="stunt">\u041a \u043c\u0430\u0448\u0438\u043d\u0435</button></div>`);
  $('sh-store').innerHTML=store.join('');
}

/* ---------- \u0430\u0434\u043c\u0438\u043d\u043a\u0430 ---------- */
const PLACE={ru:'\u0410777\u0410\u0410 777',ua:'AA 7777 AA',kz:'777 AAA 01'};
let adSelfBuilt=false,adNewsBuilt=false,adShopBuilt=false;
function renderAdminTab(){
  if(!Net.me.admin){go('cases');return}
  if(!adSelfBuilt){
    $('ad-self').innerHTML=`<div><p class="eyebrow" style="margin:0 0 4px">\u0412\u0430\u0448 \u0430\u043a\u043a\u0430\u0443\u043d\u0442</p><h3 class="h3">\u0412\u044b\u0434\u0430\u0442\u044c \u0441\u0435\u0431\u0435</h3></div>
    <div class="row"><div class="field grow"><label for="as-rub">\u0420\u0443\u0431\u043b\u0438</label><input class="inp num" id="as-rub" type="number" min="1" value="100000"></div><button class="btn" data-act="as-rub" style="align-self:end">\u041d\u0430\u0447\u0438\u0441\u043b\u0438\u0442\u044c \u20bd</button></div>
    <div class="row"><div class="field grow"><label for="as-gold">\u0413\u043e\u043b\u0434\u0430</label><input class="inp num" id="as-gold" type="number" min="1" value="1000"></div><button class="btn goldy" data-act="as-gold" style="align-self:end">\u041d\u0430\u0447\u0438\u0441\u043b\u0438\u0442\u044c \u25c6</button></div>
    <div class="row"><div class="field grow"><label for="as-key">\u041a\u043b\u044e\u0447\u0438</label><select class="inp" id="as-key">${Object.keys(KEYN).map(k=>`<option value="${k}">${KEYN[k]}</option>`).join('')}</select></div><div class="field" style="width:90px"><label for="as-keyn">\u0421\u043a\u043e\u043b\u044c\u043a\u043e</label><input class="inp num" id="as-keyn" type="number" min="1" max="1000" value="5"></div><button class="btn" data-act="as-key" style="align-self:end">\u0412\u044b\u0434\u0430\u0442\u044c</button></div>
    <div class="row"><div class="field grow"><label for="as-lvl">\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430</label><select class="inp" id="as-lvl">${Array.from({length:31},(_,i)=>`<option value="${i}">${i}</option>`).join('')}</select></div><button class="btn" data-act="as-lvl" style="align-self:end">\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c</button><button class="btn" data-act="as-prem" id="as-prem" style="align-self:end"></button></div>
    <div class="field"><label for="as-plate">\u041b\u044e\u0431\u043e\u0439 \u043d\u043e\u043c\u0435\u0440 \u0432 \u0433\u0430\u0440\u0430\u0436</label><div class="row"><select class="inp" id="as-pc" style="width:auto" aria-label="\u0421\u0442\u0440\u0430\u043d\u0430 \u043d\u043e\u043c\u0435\u0440\u0430"><option value="ru">\u0420\u0424</option><option value="ua">\u0423\u043a\u0440\u0430\u0438\u043d\u0430</option><option value="kz">\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d</option></select><input class="inp grow" id="as-plate" placeholder="${PLACE.ru}" autocomplete="off" spellcheck="false"></div></div>
    <div id="as-prev"></div>
    <div class="row"><button class="btn primary" data-act="as-plate">\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u043c\u0435\u0440 \u0432 \u0433\u0430\u0440\u0430\u0436</button></div>`;
    adSelfBuilt=true;
  }
  if(document.activeElement!==$('as-lvl'))$('as-lvl').value=String(level(S));
  $('as-prem').textContent=S.premium?'\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043f\u0440\u0435\u043c\u0438\u0443\u043c':'\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043f\u0440\u0435\u043c\u0438\u0443\u043c';
  updPlatePrev();renderAdminNews();renderAdminMarket();renderAdminPlayers();renderAdminShop();
}
function updPlatePrev(){
  const box=$('as-prev');if(!box)return;const c=$('as-pc').value,v=$('as-plate').value;
  $('as-plate').placeholder=PLACE[c];
  if(!v.trim()){box.innerHTML='<p class="muted" style="margin:0;font-size:13.5px">\u0424\u043e\u0440\u043c\u0430\u0442: '+PLACE[c]+'. \u0420\u0435\u0433\u0438\u043e\u043d \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u0432 \u0441\u043f\u0438\u0441\u043a\u0435 \u0438\u0433\u0440\u044b.</p>';return}
  const pl=parsePlateInput(c,v);
  if(!pl){box.innerHTML='<p style="margin:0;font-size:13.5px;color:var(--bad)">\u0422\u0430\u043a\u043e\u0439 \u043d\u043e\u043c\u0435\u0440 \u043d\u0435 \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442. '+(c==='ru'?'\u0411\u0443\u043a\u0432\u044b \u0442\u043e\u043b\u044c\u043a\u043e \u0410 \u0412 \u0415 \u041a \u041c \u041d \u041e \u0420 \u0421 \u0422 \u0423 \u0425, \u0440\u0435\u0433\u0438\u043e\u043d \u0438\u0437 \u0441\u043f\u0438\u0441\u043a\u0430 \u0438\u0433\u0440\u044b.':c==='ua'?'\u041d\u0443\u0436\u043d\u044b \u0434\u0432\u0435 \u0431\u0443\u043a\u0432\u044b \u0440\u0435\u0433\u0438\u043e\u043d\u0430, 4 \u0446\u0438\u0444\u0440\u044b \u0438 \u0434\u0432\u0435 \u0431\u0443\u043a\u0432\u044b \u0441\u0435\u0440\u0438\u0438.':'\u041d\u0443\u0436\u043d\u044b 3 \u0446\u0438\u0444\u0440\u044b, 3 \u043b\u0430\u0442\u0438\u043d\u0441\u043a\u0438\u0435 \u0431\u0443\u043a\u0432\u044b \u0438 \u043a\u043e\u0434 \u0440\u0435\u0433\u0438\u043e\u043d\u0430 01\u201320.')+'</p>';return}
  const a=appraise(pl);
  box.innerHTML=`<div class="prev rar-${a.rar.k}"><div class="mat" style="padding:6px">${plateHTML(pl)}</div><div><span class="pill"><i></i>${a.rar.n}</span><div style="font:600 22px/1.2 var(--f-num);margin-top:6px">${fmt(a.price)}</div></div></div>`;
}
function renderAdminNews(){
  const box=$('ad-news');if(!box)return;
  if(!adNewsBuilt){
    box.innerHTML=`<div><p class="eyebrow" style="margin:0 0 4px">\u0414\u043b\u044f \u0432\u0441\u0435\u0445 \u0438\u0433\u0440\u043e\u043a\u043e\u0432</p><h3 class="h3">\u041e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0435</h3></div>
    <div class="field"><label for="an-text">\u0422\u0435\u043a\u0441\u0442 \u0441\u0432\u0435\u0440\u0445\u0443 \u0432\u043a\u043b\u0430\u0434\u043a\u0438 \u00ab\u041a\u0435\u0439\u0441\u044b\u00bb</label><textarea class="inp" id="an-text" maxlength="300" placeholder="\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440: \u0432 \u0432\u044b\u0445\u043e\u0434\u043d\u044b\u0435 \u0434\u0430\u0440\u0438\u043c \u0432\u0441\u0435\u043c \u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0439 \u043a\u043b\u044e\u0447"></textarea></div>
    <div class="row"><button class="btn primary" data-act="an-pub">\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c</button><button class="btn ghost" data-act="an-clear">\u0423\u0431\u0440\u0430\u0442\u044c</button><span class="muted" id="an-state" style="font-size:13px"></span></div>
    <hr style="border:0;border-top:1px solid var(--line);margin:0">
    <div class="row"><button class="btn" data-act="ad-bot">\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0431\u043e\u0442\u0430</button><span class="muted" style="font-size:13px">\u0421\u0442\u0430\u0432\u0438\u0442 \u043a\u043d\u043e\u043f\u043a\u0443 \u00ab\u0418\u0433\u0440\u0430\u0442\u044c\u00bb \u0432 \u0447\u0430\u0442\u0435 \u0441 \u0431\u043e\u0442\u043e\u043c \u0438 \u043e\u0442\u0432\u0435\u0442 \u043d\u0430 /start. \u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043e\u0434\u0438\u043d \u0440\u0430\u0437 \u043f\u043e\u0441\u043b\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438.</span></div>`;
    adNewsBuilt=true;
  }
  const t=$('an-text');if(t&&!t.dataset.touched)t.value=Net.cfg.news||'';
  $('an-state').textContent=Net.cfg.news?'\u0421\u0435\u0439\u0447\u0430\u0441 \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0435 \u0432\u0438\u0434\u043d\u043e \u0438\u0433\u0440\u043e\u043a\u0430\u043c':'\u041e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f \u043d\u0435\u0442';
}
function renderAdminMarket(){
  const box=$('ad-market');if(!box)return;
  const sellers=new Set(Net.open.map(l=>l.seller)).size,bans=Net.players.filter(p=>p.banned).length;
  box.innerHTML=`<div><p class="eyebrow" style="margin:0 0 4px">\u041c\u043e\u0434\u0435\u0440\u0430\u0446\u0438\u044f</p><h3 class="h3">\u0420\u044b\u043d\u043e\u043a</h3></div>
    <p style="margin:0">\u041b\u043e\u0442\u043e\u0432: <b>${Net.open.length}</b> \u043e\u0442 ${sellers} \u043f\u0440\u043e\u0434\u0430\u0432\u0446\u043e\u0432. \u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u043e \u0438\u0433\u0440\u043e\u043a\u043e\u0432: <b>${bans}</b>.</p>
    <p class="muted" style="margin:0;font-size:13.5px">\u0421\u043d\u044f\u0442\u044b\u0435 \u043b\u043e\u0442\u044b \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u044e\u0442\u0441\u044f \u043f\u0440\u043e\u0434\u0430\u0432\u0446\u0430\u043c \u0432 \u0433\u0430\u0440\u0430\u0436. \u041e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0439 \u043b\u043e\u0442 \u043c\u043e\u0436\u043d\u043e \u0443\u0431\u0440\u0430\u0442\u044c \u043f\u0440\u044f\u043c\u043e \u043d\u0430 \u0440\u044b\u043d\u043a\u0435 \u043a\u043d\u043e\u043f\u043a\u043e\u0439 \u00ab\u0423\u0431\u0440\u0430\u0442\u044c\u00bb.</p>
    <div class="row"><button class="btn ${armed==='ad-wipe'?'armed':''}" data-act="ad-wipe" ${Net.open.length?'':'disabled'}>${armed==='ad-wipe'?'\u0422\u043e\u0447\u043d\u043e \u0441\u043d\u044f\u0442\u044c \u0432\u0441\u0435 '+Net.open.length+'?':'\u0421\u043d\u044f\u0442\u044c \u0432\u0441\u0435 \u043b\u043e\u0442\u044b'}</button></div>`;
}
async function loadPlayers(){const r=await run('adm.players',{},{quiet:true,free:true});if(r){Net.players=r.list||[];Net.playersLoaded=true;if(tab==='admin'){renderAdminPlayers();renderAdminMarket()}}}
async function loadCodes(){const r=await run('adm.codes',{},{quiet:true,free:true});if(r){Net.codes=r.list||[];if(tab==='admin')renderAdminCodes()}}
function renderAdminPlayers(){
  const box=$('ad-players');if(!box)return;
  const head=`<div class="sec-h"><div><p class="eyebrow" style="margin:0 0 4px">\u0418\u0433\u0440\u043e\u043a\u0438 \u00b7 ${Net.players.length}</p><h3 class="h3">\u041f\u043e\u0434\u0430\u0440\u043a\u0438 \u0438 \u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u043a\u0438</h3><p class="lede" style="margin-top:4px;font-size:14px">\u041f\u043e\u0434\u0430\u0440\u043e\u043a \u043f\u0440\u0438\u0445\u043e\u0434\u0438\u0442 \u0441\u0440\u0430\u0437\u0443, \u0438\u0433\u0440\u043e\u043a \u0443\u0432\u0438\u0434\u0438\u0442 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u043f\u0440\u0438 \u0432\u0445\u043e\u0434\u0435. \u0411\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u043a\u0430 \u0437\u0430\u043a\u0440\u044b\u0432\u0430\u0435\u0442 \u0435\u043c\u0443 \u0440\u044b\u043d\u043e\u043a \u0438 \u0443\u0431\u0438\u0440\u0430\u0435\u0442 \u0438\u0437 \u0442\u043e\u043f\u0430.</p></div><div class="row"><button class="btn sm" data-act="ad-pl-load">\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c</button><button class="btn sm primary" data-act="gift-open" data-to="*">\u041f\u043e\u0434\u0430\u0440\u043e\u043a \u0432\u0441\u0435\u043c</button></div></div>`;
  if(!Net.playersLoaded){box.innerHTML=head+'<p class="muted" style="margin:0">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u0441\u043f\u0438\u0441\u043e\u043a\u2026</p>';return}
  const list=Net.players;
  if(!list.length){box.innerHTML=head+'<p class="muted" style="margin:0">\u0418\u0433\u0440\u043e\u043a\u043e\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442.</p>';return}
  box.innerHTML=head+`<div class="tablewrap"><table class="lb"><thead><tr><th>\u0418\u0433\u0440\u043e\u043a</th><th>\u0423\u0440.</th><th>\u0413\u0430\u0440\u0430\u0436</th><th>\u0411\u044b\u043b \u0432 \u0438\u0433\u0440\u0435</th><th></th></tr></thead><tbody>${list.map(p=>{
    const me=p.uid===Net.me.uid,k='ban'+p.uid;
    return `<tr class="${me?'me':''}"><td class="nick">${esc(p.nick)}${badge(p.uid)}${p.banned?'<span class="banned">\u0431\u0430\u043d</span>':''}${p.tg?' <span class="muted">TG</span>':''}${me?' <span class="muted">(\u0432\u044b)</span>':''}</td><td>${p.lvl}</td><td>${fmt(p.worth)}</td><td>${agoText(p.t)}</td>
    <td class="acts"><button class="btn sm" data-act="gift-open" data-to="${esc(p.uid)}">\u041f\u043e\u0434\u0430\u0440\u043e\u043a</button>${me?'':`<button class="btn sm ${armed===k?'armed':''}" data-act="ban" data-id="${esc(p.uid)}">${p.banned?'\u0420\u0430\u0437\u0431\u0430\u043d\u0438\u0442\u044c':armed===k?'\u0422\u043e\u0447\u043d\u043e?':'\u0411\u0430\u043d'}</button>`}</td></tr>`}).join('')}</tbody></table></div>`;
}
function renderAdminShop(){
  const box=$('sh-admin');if(!box)return;
  if(!adShopBuilt){
    box.innerHTML=`<div class="panel admin"><div><p class="eyebrow" style="margin:0 0 4px">\u041f\u0440\u0438\u0451\u043c \u0434\u043e\u043d\u0430\u0442\u0430</p><h3 class="h3">\u0420\u0435\u043a\u0432\u0438\u0437\u0438\u0442\u044b \u0438 \u043f\u0440\u043e\u043c\u043e\u043a\u043e\u0434\u044b</h3></div>
      <div class="field"><label for="ad-text">\u041a\u0443\u0434\u0430 \u043f\u0435\u0440\u0435\u0432\u043e\u0434\u0438\u0442\u044c \u043e\u043f\u043b\u0430\u0442\u0443</label><textarea class="inp" id="ad-text" maxlength="600" placeholder="\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440: \u043f\u0435\u0440\u0435\u0432\u043e\u0434 \u043f\u043e \u043d\u043e\u043c\u0435\u0440\u0443 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430 \u0432 \u0442\u0430\u043a\u043e\u0439-\u0442\u043e \u0431\u0430\u043d\u043a, \u043f\u043e\u043b\u0443\u0447\u0430\u0442\u0435\u043b\u044c \u0442\u0430\u043a\u043e\u0439-\u0442\u043e"></textarea></div>
      <div class="field"><label for="ad-link">\u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u043e\u043f\u043b\u0430\u0442\u044b, \u043d\u0435\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e</label><input class="inp" id="ad-link" type="url" placeholder="https://\u2026" maxlength="300"></div>
      <div class="row"><button class="btn" data-act="ad-save">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0434\u043b\u044f \u0438\u0433\u0440\u043e\u043a\u043e\u0432</button><span class="muted" style="font-size:13px">\u042d\u0442\u043e\u0442 \u0442\u0435\u043a\u0441\u0442 \u0443\u0432\u0438\u0434\u044f\u0442 \u0432\u0441\u0435 \u0438\u0433\u0440\u043e\u043a\u0438 \u0432\u043e \u0432\u043a\u043b\u0430\u0434\u043a\u0435 \u00ab\u0414\u043e\u043d\u0430\u0442\u00bb.</span></div>
      <hr style="border:0;border-top:1px solid var(--line);margin:0">
      <div class="row"><div class="field" style="width:160px"><label for="ad-gold">\u0413\u043e\u043b\u0434\u044b \u0432 \u043a\u043e\u0434\u0435</label><input class="inp num" id="ad-gold" type="number" min="1" max="100000" value="330"></div><div class="chips" style="align-self:end">${PACKS.map(p=>`<button class="chip" data-act="ad-preset" data-g="${p.g}">${fmtN(p.g)}</button>`).join('')}</div><button class="btn goldy" data-act="ad-code" style="align-self:end">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043a\u043e\u0434</button></div>
      <div id="ad-codes"></div></div>`;
    adShopBuilt=true;
  }
  const t=$('ad-text'),l=$('ad-link'),sh=Net.cfg.shop;
  if(t&&!t.dataset.touched){t.value=sh?sh.payText||'':'';l.value=sh?sh.payLink||'':''}
  renderAdminCodes();
}
function renderAdminCodes(){
  const box=$('ad-codes');if(!box)return;
  const last=Net.lastCode?`<div class="note gift"><p>\u041d\u043e\u0432\u044b\u0439 \u043a\u043e\u0434: <code style="font:600 17px ui-monospace,Menlo,monospace;user-select:all">${esc(Net.lastCode)}</code><br><span class="muted" style="font-size:13px">\u041e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0435\u0433\u043e \u0438\u0433\u0440\u043e\u043a\u0443. \u041a\u043e\u0434 \u043e\u0434\u043d\u043e\u0440\u0430\u0437\u043e\u0432\u044b\u0439.</span></p><button class="btn sm" data-act="copy" data-text="${esc(Net.lastCode)}">\u041a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c</button></div>`:'';
  const list=Net.codes.slice(0,40);
  box.innerHTML=last+(list.length?`<p class="eyebrow" style="margin:8px 0">\u0412\u044b\u0434\u0430\u043d\u043d\u044b\u0435 \u043a\u043e\u0434\u044b</p><div class="codes">${list.map(c=>`<div><code>${esc(c.code)}</code><span>${gem(c.gold)}</span><span class="${c.used?'tag-ok':'tag-wait'}">${c.used?'\u0430\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u043d':'\u043d\u0435 \u0430\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u043d'}</span></div>`).join('')}</div>`:'<p class="muted" style="margin:0">\u041a\u043e\u0434\u043e\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442.</p>');
}
function openGiftSheet(to){
  const p=to==='*'?null:Net.players.find(x=>x.uid===to);
  const who=to==='*'?'\u0432\u0441\u0435\u043c \u0438\u0433\u0440\u043e\u043a\u0430\u043c':'\u0438\u0433\u0440\u043e\u043a\u0443 '+(p?p.nick:'');
  openSheet(`<div class="sc" role="dialog" aria-modal="true" aria-labelledby="gf-t"><h3 id="gf-t">\u041f\u043e\u0434\u0430\u0440\u043e\u043a ${esc(who)}</h3>
    <div class="row"><div class="field grow"><label for="gf-m">\u0420\u0443\u0431\u043b\u0438</label><input class="inp num" id="gf-m" type="number" min="0" value="10000"></div><div class="field grow"><label for="gf-g">\u0413\u043e\u043b\u0434\u0430</label><input class="inp num" id="gf-g" type="number" min="0" value="0"></div></div>
    <div class="row"><div class="field grow"><label for="gf-k">\u041a\u043b\u044e\u0447</label><select class="inp" id="gf-k"><option value="">\u0411\u0435\u0437 \u043a\u043b\u044e\u0447\u0430</option>${Object.keys(KEYN).map(k=>`<option value="${k}">${KEYN[k]}</option>`).join('')}</select></div><div class="field" style="width:90px"><label for="gf-kn">\u0421\u043a\u043e\u043b\u044c\u043a\u043e</label><input class="inp num" id="gf-kn" type="number" min="1" max="100" value="1"></div></div>
    <div class="field"><label for="gf-note">\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435, \u043d\u0435\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e</label><input class="inp" id="gf-note" maxlength="80" placeholder="\u0421\u043f\u0430\u0441\u0438\u0431\u043e, \u0447\u0442\u043e \u0438\u0433\u0440\u0430\u0435\u0442\u0435!"></div>
    ${to==='*'?'<p class="muted" style="margin:0;font-size:13.5px">\u041f\u043e\u0434\u0430\u0440\u043e\u043a \u043f\u043e\u043b\u0443\u0447\u0430\u0442 \u0432\u0441\u0435, \u043a\u0442\u043e \u043e\u0442\u043a\u0440\u043e\u0435\u0442 \u0438\u0433\u0440\u0443 \u0432 \u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435 7 \u0434\u043d\u0435\u0439, \u043a\u0430\u0436\u0434\u044b\u0439 \u043f\u043e \u043e\u0434\u043d\u043e\u043c\u0443 \u0440\u0430\u0437\u0443.</p>':''}
    <div class="row"><button class="btn ghost" data-act="sheet-close">\u041e\u0442\u043c\u0435\u043d\u0430</button><span style="flex:1"></span><button class="btn primary" data-act="gift-send" data-to="${esc(to)}">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c</button></div></div>`);
}
function openAdminLogin(){
  openSheet(`<div class="sc" role="dialog" aria-modal="true" aria-labelledby="al-t"><h3 id="al-t">\u0412\u0445\u043e\u0434 \u0434\u043b\u044f \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430</h3>
    <p class="muted" style="margin:0">\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043b\u044e\u0447 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430. \u041e\u043d \u0437\u0430\u0434\u0430\u0451\u0442\u0441\u044f \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u0432 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0435 ADMIN_KEY. \u041f\u043e\u0441\u043b\u0435 \u0432\u0445\u043e\u0434\u0430 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0432\u043a\u043b\u0430\u0434\u043a\u0430 \u00ab\u0410\u0434\u043c\u0438\u043d\u00bb.</p>
    <div class="field"><label for="al-key">\u041a\u043b\u044e\u0447 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430</label><input class="inp" id="al-key" type="password" autocomplete="off"></div>
    <div class="row"><button class="btn ghost" data-act="sheet-close">\u041e\u0442\u043c\u0435\u043d\u0430</button><span style="flex:1"></span><button class="btn primary" data-act="al-go">\u0412\u043e\u0439\u0442\u0438</button></div></div>`,{focus:'al-key'});
}
/* ---------- \u0441\u043e\u0431\u044b\u0442\u0438\u044f ---------- */
document.addEventListener('click',async e=>{
  const sh=$('sheet');
  if(e.target===sh){closeSheet();return}
  const b=e.target.closest('[data-act]');if(!b||b.disabled)return;
  const a=b.dataset.act,id=b.dataset.id;
  if(b.tagName==='A'&&a==='go')e.preventDefault();
  switch(a){
    case'go':go(b.dataset.tab);break;
    case'welcome-ok':S.welcome='';render();run('welcome',{},{quiet:true});break;
    case'country':if(!busy){sel=b.dataset.c;renderCases()}break;
    case'open':openCase(+b.dataset.i,b.dataset.key==='1');break;
    case'open-key':go('cases');openCase(+b.dataset.i,true);break;
    case'bonus':run('bonus');break;
    case'quick':{
      const x=S.box.find(v=>v.id===+id);if(!x)return;
      const k=b.dataset.k==='last'?'last':'q'+x.id;
      if((x.pin||x.price>=RARITY[2].min)&&needArm(k))return;
      armed='';run('quick',{id:x.id});break}
    case'bulk':{const k=b.dataset.k;if(needArm(k))return;run('bulk',{k});break}
    case'pin':run('pin',{id:+id},{quiet:true});break;
    case'g-filter':gFilt=b.dataset.f;renderGarage();break;
    case'm-filter':mFilt=b.dataset.f;renderMarket();break;
    case'list-open':openListSheet(+id);break;
    case'ask-set':{const base=num($('sheet').dataset.base);$('ask').value=Math.max(MIN_ASK,Math.round(base*num(b.dataset.k)/10)*10);updAsk();break}
    case'list-confirm':{const r=await run('list',{id:+id,ask:num($('ask').value)});if(r)closeSheet();break}
    case'sheet-close':closeSheet();break;
    case'buy':if(needArm('b'+id))return;armed='';run('buy',{lid:id});break;
    case'cancel':run('cancel',{lid:id});break;
    case'mod':if(needArm('mod'+id))return;armed='';run('adm.mod',{lid:id});break;
    case'nick-save':run('nick',{nick:$('nick').value});break;
    case'claim':run('claim',{t:b.dataset.t,l:+b.dataset.l});break;
    case'claim-all':run('claimAll');break;
    case'quest':run('questClaim',{id});break;
    case'premium':
      if(S.gold<SEASON.premium){go('shop');return toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(SEASON.premium-S.gold))}
      if(needArm('premium'))return;armed='';run('premium');break;
    case'buy-key':run('buyKey',{k:b.dataset.k});break;
    case'exch':run('exch',{n:+b.dataset.n});break;
    case'car':{
      const c=L.CARS[id];if(!c)return;
      if(!S.cars.includes(id)&&c.cost){if(S.gold<c.cost)return toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(c.cost-S.gold));if(needArm('car'+id))return}
      armed='';run('car',{id});break}
    case'pack':packSel=+b.dataset.i;renderShop();break;
    case'promo':{const r=await run('redeem',{code:$('promo').value});if(r)$('promo').value='';break}
    case'copy':copyText(b.dataset.text||'');break;
    case'stunt-start':startStunt();break;
    case'stunt-resume':Stunt.resume();break;
    case'news-hide':if(Net.cfg.news)lsSet('nomera-news-hide',String(hashStr(Net.cfg.news)));renderNews();break;
    case'reset':if(busy||needArm('reset'))return;armed='';lastRes=null;run('reset');break;
    case'adm-login':openAdminLogin();break;
    case'al-go':{
      if(Net.status!=='on')return toast('\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0434\u043e\u0436\u0434\u0438\u0442\u0435\u0441\u044c \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f \u043a \u0441\u0435\u0440\u0432\u0435\u0440\u0443');
      try{const j=await call('admin',{key:$('al-key').value});Net.me=j.me;closeSheet();toast('\u0412\u044b \u0432\u043e\u0448\u043b\u0438 \u043a\u0430\u043a \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440');go('admin')}
      catch(err){toast(err.message)}break}
    case'ad-bot':run('adm.bot');break;
    // \u0430\u0434\u043c\u0438\u043d\u043a\u0430
    case'as-rub':run('admRub',{n:num($('as-rub').value)});break;
    case'as-gold':run('admGold',{n:num($('as-gold').value)});break;
    case'as-key':run('admKey',{k:$('as-key').value,n:num($('as-keyn').value)});break;
    case'as-lvl':run('admLvl',{l:num($('as-lvl').value)});break;
    case'as-prem':run('admPrem');break;
    case'as-plate':run('admPlate',{c:$('as-pc').value,text:$('as-plate').value});break;
    case'an-pub':{const r=await run('adm.news',{text:$('an-text').value});if(r)$('an-text').dataset.touched='';break}
    case'an-clear':{const r=await run('adm.news',{text:''});if(r){$('an-text').value='';$('an-text').dataset.touched=''}break}
    case'ad-save':{const r=await run('adm.shop',{payText:$('ad-text').value,payLink:$('ad-link').value});if(r)$('ad-text').dataset.touched='';break}
    case'ad-preset':$('ad-gold').value=b.dataset.g;break;
    case'ad-code':{const r=await run('adm.code',{gold:num($('ad-gold').value)});if(r){Net.lastCode=r.code;loadCodes()}break}
    case'ad-wipe':if(needArm('ad-wipe'))return;armed='';run('adm.wipe');break;
    case'ad-pl-load':loadPlayers();break;
    case'gift-open':openGiftSheet(b.dataset.to);break;
    case'gift-send':{
      const k=$('gf-k').value;
      const r=await run('adm.gift',{to:b.dataset.to,m:num($('gf-m').value),g:num($('gf-g').value),k,kn:num($('gf-kn').value),note:$('gf-note').value});
      if(r){closeSheet();loadPlayers()}break}
    case'ban':{
      const p=Net.players.find(x=>x.uid===id);if(!p)return;
      if(!p.banned&&needArm('ban'+id))return;armed='';
      const r=await run('adm.ban',{uid:id,on:!p.banned});if(r)loadPlayers();break}
  }
});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='ask')updAsk();
  else if(t.id==='m-q'){clearTimeout(t._t);t._t=setTimeout(renderMarketList,150)}
  else if(t.id==='ad-text'||t.id==='ad-link'||t.id==='an-text')t.dataset.touched='1';
  else if(t.id==='as-plate')updPlatePrev();
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='g-sort'){gSort=t.value;renderGarage()}
  else if(t.id==='m-rar'||t.id==='m-sort')renderMarketList();
  else if(t.id==='as-pc')updPlatePrev();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!$('sheet').hidden)closeSheet();
  const id=e.target&&e.target.id;if(e.key!=='Enter')return;
  const map={promo:'promo',ask:'list-confirm','al-key':'al-go'};
  if(map[id]){const btn=document.querySelector('[data-act="'+map[id]+'"]');if(btn){e.preventDefault();btn.click()}}
});
let lastDay=mskDate();
setInterval(()=>{
  renderTop();
  const c=$('s-count');if(c&&tab==='season')c.textContent=countdown();
  if(mskDate()!==lastDay){lastDay=mskDate();if(tab==='season'||tab==='stunt')render()}
},1000);

/* ---------- \u0437\u0430\u043f\u0443\u0441\u043a ---------- */
renderHow();
const startTab=(location.hash||'').slice(1);
go(TABS.includes(startTab)?startTab:'cases',true);
idleReel();
connect();
