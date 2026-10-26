'use strict';
/* РљР»РёРµРЅС‚ РёРіСЂС‹ В«Р’С‹Р±РёРІР°РЅРёРµ РЅРѕРјРµСЂРѕРІВ» РґР»СЏ СЃР°Р№С‚Р°: СЃРѕСЃС‚РѕСЏРЅРёРµ Р¶РёРІС‘С‚ РЅР° СЃРµСЂРІРµСЂРµ, Р±СЂР°СѓР·РµСЂ С‚РѕР»СЊРєРѕ РїРѕРєР°Р·С‹РІР°РµС‚ Рё РѕС‚РїСЂР°РІР»СЏРµС‚ РґРµР№СЃС‚РІРёСЏ. */
const {TIERS,RARITY,RIDX,RULES3,RULES4,LRULES,KEYN,CARS,CAR_SRC,PACKS,GKEY,FREE,PREM,QUESTS,SEASON,
  BOX_CAP,BONUS,BUYBACK,FEE,MAX_LIST,STUNT_CAP,MIN_ASK,MAX_ASK,
  appraise,genPlate,bestOf,pick,rnd,plateText,num,fmtN,fmt,gem,hashStr,mskDate,toLat,parsePlateInput,
  seasonOn,level,lvlPct,worth,questReady,claimable,rewardText}=L;
const $=id=>document.getElementById(id);
const ALL=['ru','ua','kz'];
const CN={ru:'Р РѕСЃСЃРёСЏ',ua:'РЈРєСЂР°РёРЅР°',kz:'РљР°Р·Р°С…СЃС‚Р°РЅ',mix:'РњРёРєСЃ'};
const CS={ru:'Р Р¤',ua:'РЈРљР ',kz:'РљР—'};
const FL={ru:'<i class="fl fru"></i>',ua:'<i class="fl fua"></i>',kz:'<i class="fl fkz"></i>'};
const xf=m=>'Г—'+String(Math.round(m*100)/100).replace('.',',');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduce=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();
const TABS=['cases','market','stunt','season','garage','shop','admin'];
const TOKEN_KEY='nomera-token';
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function lsDel(k){try{localStorage.removeItem(k)}catch(e){}}
function agoText(t){const s=(Date.now()-t)/1000;if(!(s>=0)||s<60)return'С‚РѕР»СЊРєРѕ С‡С‚Рѕ';if(s<3600)return Math.floor(s/60)+' РјРёРЅ РЅР°Р·Р°Рґ';if(s<86400)return Math.floor(s/3600)+' С‡ РЅР°Р·Р°Рґ';return new Date(t).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}

/* ================= СЃРІСЏР·СЊ СЃ СЃРµСЂРІРµСЂРѕРј (Supabase) ================= */
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
  catch(e){const er=new Error('РќРµС‚ СЃРІСЏР·Рё СЃ СЃРµСЂРІРµСЂРѕРј. РџСЂРѕРІРµСЂСЊС‚Рµ РёРЅС‚РµСЂРЅРµС‚');er.net=true;throw er}
  const j=await res.json().catch(()=>({}));
  if(!res.ok){const er=new Error(j.error||'РЎРµСЂРІРµСЂ РЅРµ РѕС‚РІРµС‚РёР», РїРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘ СЂР°Р·');er.status=res.status;er.relogin=!!j.relogin;throw er}
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
  if(Net.status!=='on')throw new Error(Net.status==='tg'?'РћС‚РєСЂРѕР№С‚Рµ РёРіСЂСѓ С‡РµСЂРµР· Telegram-Р±РѕС‚Р°':'РќРµС‚ СЃРІСЏР·Рё СЃ СЃРµСЂРІРµСЂРѕРј. РџРѕРґРєР»СЋС‡Р°РµРјСЃСЏвЂ¦');
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
    Net.status='off';Net.err=e.net?'':(e.message||'')+(e.status?' (РєРѕРґ '+e.status+')':'');
    render();retryT=setTimeout(connect,e.net?5000:15000);
  }
}
async function refreshState(){
  if(Net.op||busy||Net.status!=='on')return;
  try{const j=await call('state');if(Net.op||busy)return;takeResp(j);render();showInbox()}catch(e){}
}
/* РџСѓР±Р»РёС‡РЅС‹Рµ РґР°РЅРЅС‹Рµ (СЂС‹РЅРѕРє, С‚РѕРї, Р»РµРЅС‚Р°) С‡РёС‚Р°СЋС‚СЃСЏ РЅР°РїСЂСЏРјСѓСЋ РёР· Р±Р°Р·С‹: СЌС‚Рѕ РЅРµ С‚СЂР°С‚РёС‚ Р»РёРјРёС‚ РІС‹Р·РѕРІРѕРІ С„СѓРЅРєС†РёРё. */
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

/* ================= РёРЅС‚РµСЂС„РµР№СЃ ================= */
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
const whereText=pl=>CN[pl.c]+' В· '+appraise(pl).parts[2].t;
const badge=uid=>uid&&Net.cfg.adminUid&&uid===Net.cfg.adminUid?'<span class="adm">РђРґРјРёРЅ</span>':'';
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
function copyText(text){try{navigator.clipboard.writeText(text).then(()=>toast('РЎРєРѕРїРёСЂРѕРІР°РЅРѕ'),()=>toast('Р’С‹РґРµР»РёС‚Рµ С‚РµРєСЃС‚ Рё СЃРєРѕРїРёСЂСѓР№С‚Рµ РІСЂСѓС‡РЅСѓСЋ'))}catch(e){toast('Р’С‹РґРµР»РёС‚Рµ С‚РµРєСЃС‚ Рё СЃРєРѕРїРёСЂСѓР№С‚Рµ РІСЂСѓС‡РЅСѓСЋ')}}

/* ---------- С€Р°РїРєР° ---------- */
function renderTop(){
  $('bal').textContent=fmt(S.bal);
  $('gold').textContent=fmtN(S.gold);const g2=$('gold2');if(g2)g2.textContent=fmtN(S.gold);
  $('lvl-n').textContent=level(S);$('lvlbtn').style.setProperty('--p',lvlPct(S));
  $('lvl-dot').hidden=!(claimable(S)+questReady(S));
  const ol=$('online');if(Net.online>0){ol.hidden=false;$('online-n').textContent=Net.online}else ol.hidden=true;
  $('season-chip').textContent=seasonOn()?'РЎРµР·РѕРЅ 1 В· РІС‹С…РѕРґ РёР· Р±РµС‚С‹':'РЎРµР·РѕРЅ 1 Р·Р°РІРµСЂС€С‘РЅ';
  const rs=$('reset');if(rs){rs.textContent=armed==='reset'?'РўРѕС‡РЅРѕ СЃР±СЂРѕСЃРёС‚СЊ РіР°СЂР°Р¶ Рё Р±Р°Р»Р°РЅСЃ?':'РќР°С‡Р°С‚СЊ Р·Р°РЅРѕРІРѕ';rs.classList.toggle('armed',armed==='reset')}
  const al=$('adm-login');if(al)al.hidden=!!Net.me.admin;
  const bb=$('bonus');if(bb){const left=S.bonusAt-Date.now();if(left>0){bb.disabled=true;bb.textContent='РџРѕРґСЂР°Р±РѕС‚РєР° С‡РµСЂРµР· '+Math.ceil(left/1000)+' СЃ'}else{bb.disabled=false;bb.textContent='РџРѕРґСЂР°Р±РѕС‚РєР° +'+fmt(BONUS)}}
  const cn=$('conn');if(cn){cn.hidden=Net.status==='on';cn.textContent=Net.status==='loading'?'РџРѕРґРєР»СЋС‡Р°РµРјСЃСЏ Рє СЃРµСЂРІРµСЂСѓвЂ¦':Net.status==='tg'?'РРіСЂР° РѕС‚РєСЂС‹РІР°РµС‚СЃСЏ С‡РµСЂРµР· Telegram-Р±РѕС‚Р°. РќР°Р№РґРёС‚Рµ Р±РѕС‚Р° РёРіСЂС‹ Рё РЅР°Р¶РјРёС‚Рµ В«РРіСЂР°С‚СЊВ».':Net.err?'РЎРµСЂРІРµСЂ РѕС‚РІРµС‚РёР» РѕС€РёР±РєРѕР№: '+Net.err:'РќРµС‚ СЃРІСЏР·Рё СЃ СЃРµСЂРІРµСЂРѕРј. РџРµСЂРµРїРѕРґРєР»СЋС‡Р°РµРјСЃСЏвЂ¦'}
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
  el.innerHTML=`<div class="note warn"><p><b>РћР±СЉСЏРІР»РµРЅРёРµ.</b> ${esc(t)}</p><button class="btn sm" data-act="news-hide">РЎРєСЂС‹С‚СЊ</button></div>`;
}

/* ---------- РєРµР№СЃС‹ ---------- */
function renderCases(){
  renderNews();
  const w=$('welcome');
  w.innerHTML=S.welcome==='new'?`<div class="note gift"><p><b>Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ!</b> РќР° СЃС‚Р°СЂС‚Рµ Сѓ РІР°СЃ 5 000 в‚Ѕ Рё РєР»СЋС‡ РѕС‚ СЃРµР·РѕРЅРЅРѕРіРѕ РєРµР№СЃР°. Р’С‹Р±РёРІР°Р№С‚Рµ РЅРѕРјРµСЂР°, РєР°С‚Р°Р№С‚РµСЃСЊ РІ СЃС‚Р°РЅС‚Рµ Рё С‚РѕСЂРіСѓР№С‚Рµ СЃ РґСЂСѓРіРёРјРё РёРіСЂРѕРєР°РјРё РЅР° СЂС‹РЅРєРµ.</p><button class="btn sm" data-act="welcome-ok">РџРѕРЅСЏС‚РЅРѕ</button></div>`:'';
  $('chips').innerHTML=['ru','ua','kz','mix'].map(c=>`<button class="chip" data-act="country" data-c="${c}" aria-pressed="${sel===c}" ${busy?'disabled':''}>${c==='mix'?FL.ru+FL.ua+FL.kz:FL[c]}<span>${CN[c]}</span></button>`).join('');
  const E=estimate(sel),full=S.box.length>=BOX_CAP,off=Net.status!=='on';
  $('tiers').innerHTML=TIERS.map((t,i)=>{
    if(t.event&&!seasonOn())return'';
    const short=S.bal<t.price,keys=S.keys[t.id]||0;
    return `<article class="tier t-${t.id}"><div class="crate" aria-hidden="true">${t.event?'<em>РРІРµРЅС‚</em>':'<i></i>'}<span>Г—${t.k}</span></div>
      <h3>${t.name}</h3><p class="td">${t.desc}</p>
      <dl class="te"><div><dt>Р РµРґРєРёР№ Рё РІС‹С€Рµ</dt><dd>в‰€ ${Math.round(E[i].rare*100)}%</dd></div><div><dt>РЎСЂРµРґРЅРёР№ РЅРѕРјРµСЂ</dt><dd>в‰€ ${fmt(Math.round(E[i].avg/10)*10)}</dd></div><div><dt>РћРїС‹С‚ СЃРµР·РѕРЅР°</dt><dd>+${t.xp}</dd></div></dl>
      <div class="tb"><button class="btn primary" data-act="open" data-i="${i}" ${busy||short||full||off?'disabled':''}>${short?'РќРµ С…РІР°С‚Р°РµС‚ '+fmt(t.price-S.bal):'РћС‚РєСЂС‹С‚СЊ Р·Р° '+fmt(t.price)}</button>
      ${keys>0?`<button class="btn" data-act="open" data-i="${i}" data-key="1" ${busy||full||off?'disabled':''}>РћС‚РєСЂС‹С‚СЊ РєР»СЋС‡РѕРј В· ${keys} С€С‚.</button>`:''}</div></article>`;
  }).join('');
  const anyKey=Object.values(S.keys).some(v=>v>0);
  let ban='';
  if(full)ban=`<div class="note warn"><p>Р“Р°СЂР°Р¶ РїРѕР»РѕРЅ: ${BOX_CAP} РЅРѕРјРµСЂРѕРІ. РџСЂРѕРґР°Р№С‚Рµ С‡Р°СЃС‚СЊ СЃРєСѓРїС‰РёРєСѓ РёР»Рё РЅР° СЂС‹РЅРєРµ, С‡С‚РѕР±С‹ РѕС‚РєСЂС‹РІР°С‚СЊ РєРµР№СЃС‹.</p><button class="btn sm" data-act="go" data-tab="garage">Р’ РіР°СЂР°Р¶</button></div>`;
  else if(Net.status==='on'&&S.bal<TIERS[0].price&&!anyKey&&!busy)ban=`<div class="note warn"><p>РќРµ С…РІР°С‚Р°РµС‚ РЅР° РєРµР№СЃ. Р—Р°СЂР°Р±РѕС‚Р°Р№С‚Рµ РІ СЃС‚Р°РЅС‚Рµ, СЃРґР°Р№С‚Рµ РЅРѕРјРµСЂР° СЃРєСѓРїС‰РёРєСѓ РёР»Рё РІРѕР·СЊРјРёС‚Рµ РїРѕРґСЂР°Р±РѕС‚РєСѓ.</p><div class="row"><button class="btn sm" id="bonus" data-act="bonus"></button><button class="btn sm primary" data-act="go" data-tab="stunt">Р’ СЃС‚Р°РЅС‚</button></div></div>`;
  $('banner').innerHTML=ban;
  if(!busy){$('cap-a').textContent=lastRes?'Р’С‹РїР°Р» РЅРѕРјРµСЂ':'РљРµР№СЃ В«'+TIERS[curTier].name+'В»';$('cap-b').textContent=CN[sel]}
  renderRes();renderFeed();renderTop();
}
function renderRes(){
  const box=$('res');
  if(!lastRes){box.hidden=true;box.innerHTML='';return}
  const r=lastRes,a=appraise(r.pl),t=TIERS[r.tier];
  const inBox=S.box.some(x=>x.id===r.id);
  const parts=a.parts.map(p=>`<li><span class="k">${p.k}</span><span class="v">${esc(p.v)}<small>${esc(p.t)}</small></span><span class="m">${xf(p.m)}</span></li>`).join('');
  const approx=Math.abs(a.raw-a.price)>.5?'в‰€':'=';
  const formula=`${fmt(a.base)} ${a.parts.map(p=>xf(p.m)).join(' ')} ${approx} ${fmt(a.price)}`;
  const quick=Math.floor(a.price*BUYBACK);
  const act=inBox?`<button class="btn ${armed==='last'?'armed':''}" data-act="quick" data-id="${r.id}" data-k="last">${armed==='last'?'РўРѕС‡РЅРѕ СЃРґР°С‚СЊ?':'РЎРєСѓРїС‰РёРєСѓ Р·Р° '+fmt(quick)}</button>${trade()?`<button class="btn" data-act="list-open" data-id="${r.id}">РќР° СЂС‹РЅРѕРє</button>`:''}`:`<span class="done-l">РќРѕРјРµСЂ СѓР¶Рµ РЅРµ РІ РіР°СЂР°Р¶Рµ</span>`;
  const keys=S.keys[t.id]||0;
  const again=keys>0?`<button class="btn primary" data-act="open" data-i="${r.tier}" data-key="1" ${busy?'disabled':''}>Р•С‰С‘ РєР»СЋС‡РѕРј В· ${keys} С€С‚.</button>`
    :`<button class="btn primary" data-act="open" data-i="${r.tier}" ${busy||S.bal<t.price||(t.event&&!seasonOn())?'disabled':''}>РћС‚РєСЂС‹С‚СЊ РµС‰С‘ В· ${fmt(t.price)}</button>`;
  const fresh=box.dataset.id!==String(r.id);
  box.className='res rar-'+a.rar.k+(fresh&&!reduce?' pop':'');box.dataset.id=r.id;
  box.innerHTML=`<div class="res-head"><span class="pill"><i></i>${a.rar.n}</span><span class="where">${esc(whereText(r.pl))}</span></div>
    <div class="mat">${plateHTML(r.pl)}</div>
    <div class="priceline"><b>${fmt(a.price)}</b><span>РѕС†РµРЅРєР°${inBox?' В· РЅРѕРјРµСЂ СѓР¶Рµ РІ РіР°СЂР°Р¶Рµ':''}</span></div>
    <ul class="parts">${parts}</ul>
    <p class="formula">Р‘Р°Р·Р° ${CS[r.pl.c]}: ${formula}</p>
    <div class="actions">${act}${again}</div>`;
  box.hidden=false;
}
function feedItem(it){
  const ago=agoText(it.t);
  if(it.k==='stunt')return `<li><div class="stunt-ico" aria-hidden="true"></div><div class="who"><b>${esc(it.n)}</b>${badge(it.u)} РїРѕСЃС‚Р°РІРёР» СЂРµРєРѕСЂРґ РІ СЃС‚Р°РЅС‚Рµ<small>${ago}</small></div><div class="pr2">${fmtN(it.sc)} РѕС‡Рє.</div></li>`;
  const a=appraise(it.pl);
  const what=it.k==='sale'?`<b>${esc(it.n)}</b>${badge(it.u)} РєСѓРїРёР» Сѓ <b>${esc(it.s)}</b>${badge(it.su)}`:`<b>${esc(it.n)}</b>${badge(it.u)} РІС‹Р±РёР» ${a.rar.n.toLowerCase()} РЅРѕРјРµСЂ`;
  return `<li class="rar-${a.rar.k}"><div class="mat" style="padding:4px">${plateHTML(it.pl)}</div><div class="who">${what}<small>${ago}</small></div><div class="pr2">${fmt(it.p)}</div></li>`;
}
function renderFeed(){
  const show=Net.status==='on';
  $('feed-cases-wrap').hidden=!show;$('feed-market-wrap').hidden=!show;if(!show)return;
  const feed=(Net.feed||[]).filter(it=>it&&(it.k==='stunt'||(it.pl&&L.cleanPlate(it.pl))));
  $('feed-cases').innerHTML=feed.length?feed.slice(0,8).map(feedItem).join(''):'<li style="display:block;color:var(--muted)">РџРѕРєР° С‚РёС…Рѕ. Р’С‹Р±РµР№С‚Рµ СЂРµРґРєРёР№ РЅРѕРјРµСЂ, Рё РѕРЅ РїРѕСЏРІРёС‚СЃСЏ Р·РґРµСЃСЊ.</li>';
  const sales=feed.filter(x=>x.k==='sale');
  $('feed-market').innerHTML=sales.length?sales.slice(0,10).map(feedItem).join(''):'<li style="display:block;color:var(--muted)">РЎРґРµР»РѕРє РїРѕРєР° РЅРµ Р±С‹Р»Рѕ.</li>';
}
function renderHow(){
  const li=r=>`<li><b>${xf(r.m)}</b><span>${r.t}<br><small>${r.ex}</small></span></li>`;
  $('how').innerHTML=`
    <div><h4>Р¦РёС„СЂС‹, Р Р¤ Рё РљР°Р·Р°С…СЃС‚Р°РЅ</h4><ul>${RULES3.map(li).join('')}</ul></div>
    <div><h4>Р¦РёС„СЂС‹, РЈРєСЂР°РёРЅР°</h4><ul>${RULES4.map(li).join('')}</ul></div>
    <div><h4>Р‘СѓРєРІС‹, Р Р¤</h4><ul>${LRULES.ru.map(li).join('')}</ul><h4 style="margin-top:14px">Р‘СѓРєРІС‹, РЈРєСЂР°РёРЅР°</h4><ul>${LRULES.ua.map(li).join('')}</ul><h4 style="margin-top:14px">Р‘СѓРєРІС‹, РљР°Р·Р°С…СЃС‚Р°РЅ</h4><ul>${LRULES.kz.map(li).join('')}</ul></div>
    <div><h4>Р РµРіРёРѕРЅ</h4><ul>
      <li><b>Г—2вЂ“3,5</b><span>РњРѕСЃРєРІР°<br><small>777 СЃР°РјС‹Р№ РґРѕСЂРѕРіРѕР№</small></span></li>
      <li><b>Г—1,7</b><span>РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі<br><small>78, 98, 178</small></span></li>
      <li><b>Г—1,3</b><span>РџРѕРґРјРѕСЃРєРѕРІСЊРµ, РљСЂР°СЃРЅРѕРґР°СЂСЃРєРёР№ РєСЂР°Р№</span></li>
      <li><b>Г—2,2вЂ“2,5</b><span>РљРёРµРІ</span></li>
      <li><b>Г—1,3вЂ“1,5</b><span>РћРґРµСЃСЃР°, РҐР°СЂСЊРєРѕРІ, Р›СЊРІРѕРІ, Р”РЅРµРїСЂ, РљРёРµРІСЃРєР°СЏ РѕР±Р».</span></li>
      <li><b>Г—2вЂ“2,2</b><span>РђСЃС‚Р°РЅР°, РђР»РјР°С‚С‹</span></li>
      <li><b>Г—1,4</b><span>РЁС‹РјРєРµРЅС‚</span></li></ul>
      <h4 style="margin-top:14px">РС‚РѕРі</h4><p style="margin:0;font-size:14px">Р¦РµРЅР° = Р±Р°Р·Р° Г— С†РёС„СЂС‹ Г— Р±СѓРєРІС‹ Г— СЂРµРіРёРѕРЅ. Р‘Р°Р·Р°: Р Р¤ Рё РљР— ${fmt(160)}, РЈРєСЂР°РёРЅР° ${fmt(200)}. РЎРєСѓРїС‰РёРє РїР»Р°С‚РёС‚ ${Math.round(BUYBACK*100)}% РѕС†РµРЅРєРё.</p></div>`;
}

/* ---------- СЂСѓР»РµС‚РєР° ---------- */
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
  $('cap-a').textContent='Р’С‹Р±РёРІР°РµРј РЅРѕРјРµСЂвЂ¦';$('cap-b').textContent=CN[sel]+' В· В«'+t.name+'В»';
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
  $('cap-a').textContent='Р’С‹РїР°Р» РЅРѕРјРµСЂ';$('cap-b').textContent=CN[sel]+' В· В«'+t.name+'В»';
  try{if(tab==='cases')$('res').scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'})}catch(e){}
}

/* ---------- РіР°СЂР°Р¶ ---------- */
function renderGarage(){
  const best=S.best?`<div><dt>Р›СѓС‡С€РёР№ РЅРѕРјРµСЂ Р·Р° РІСЃС‘ РІСЂРµРјСЏ</dt><dd><div class="bestp">${plateHTML(S.best.pl)}</div>${fmt(S.best.price)}</dd></div>`:'';
  $('g-stats').innerHTML=`<div><dt>РќРѕРјРµСЂРѕРІ</dt><dd>${S.box.length} / ${BOX_CAP}</dd></div><div><dt>РћС†РµРЅРєР° РіР°СЂР°Р¶Р°</dt><dd>${fmt(worth(S))}</dd></div><div><dt>РћС‚РєСЂС‹С‚Рѕ РєРµР№СЃРѕРІ</dt><dd>${fmtN(S.opened)}</dd></div>${best}`;
  const ks=Object.keys(KEYN).filter(k=>S.keys[k]>0);
  $('g-keys').innerHTML=ks.length?`<p class="eyebrow" style="margin:0 0 10px">РљР»СЋС‡Рё РѕС‚ РєРµР№СЃРѕРІ</p><div class="keys">${ks.map(k=>{const i=TIERS.findIndex(t=>t.id===k);return `<span class="key"><span>${KEYN[k]}</span><b>Г—${S.keys[k]}</b><button class="btn sm primary" data-act="open-key" data-i="${i}">РћС‚РєСЂС‹С‚СЊ</button></span>`}).join('')}</div>`:'';
  $('g-filters').innerHTML=['all','ru','ua','kz'].map(f=>`<button class="chip" data-act="g-filter" data-f="${f}" aria-pressed="${gFilt===f}">${f==='all'?'Р’СЃРµ':FL[f]+'<span>'+CS[f]+'</span>'}</button>`).join('');
  const free=S.box.filter(x=>!x.pin),cheap=free.filter(x=>x.price<RARITY[1].min);
  const sum=l=>l.reduce((s,x)=>s+Math.floor(x.price*BUYBACK),0);
  const bt=(k,l,label)=>`<button class="btn sm ${armed===k?'armed':''}" data-act="bulk" data-k="${k}" ${l.length?'':'disabled'}>${armed===k?'РўРѕС‡РЅРѕ СЃРґР°С‚СЊ '+l.length+' С€С‚. Р·Р° '+fmt(sum(l))+'?':label+' В· '+l.length+' С€С‚. В· '+fmt(sum(l))}</button>`;
  $('g-bulk').innerHTML=bt('cheap',cheap,'РЎРґР°С‚СЊ СЃРєСѓРїС‰РёРєСѓ РѕР±С‹С‡РЅС‹Рµ')+bt('free',free,'РЎРґР°С‚СЊ РІСЃС‘, РєСЂРѕРјРµ Р·Р°РєСЂРµРїР»С‘РЅРЅС‹С…');
  const cmp=(a,b)=>gSort==='price-asc'?a.price-b.price:gSort==='new'?b.t-a.t:b.price-a.price;
  const list=S.box.filter(x=>gFilt==='all'||x.pl.c===gFilt).sort(cmp);
  $('g-list').innerHTML=list.length?list.map(gCard).join(''):`<div class="empty" style="grid-column:1/-1"><span>${S.box.length?'Р’ СЌС‚РѕР№ СЃС‚СЂР°РЅРµ РїРѕРєР° РЅРµС‚ РЅРѕРјРµСЂРѕРІ.':'Р“Р°СЂР°Р¶ РїСѓСЃС‚. РћС‚РєСЂРѕР№С‚Рµ РєРµР№СЃ, Рё РЅРѕРјРµСЂ РїРѕСЏРІРёС‚СЃСЏ Р·РґРµСЃСЊ.'}</span><button class="btn primary" data-act="go" data-tab="cases">Рљ РєРµР№СЃР°Рј</button></div>`;
}
function gCard(x){
  const a=appraise(x.pl);
  const tags=a.parts.filter(p=>p.m>1).map(p=>`<span>${esc(p.t)} ${xf(p.m)}</span>`).join('')||'<span>Р‘РµР· Р±РѕРЅСѓСЃРѕРІ</span>';
  const key='q'+x.id,isArm=armed===key,q=Math.floor(x.price*BUYBACK);
  const src=x.src==='pass'?'<span>РќР°РіСЂР°РґР° СЃРµР·РѕРЅР°</span>':x.src==='market'?'<span>РЎ СЂС‹РЅРєР°</span>':x.src==='admin'?'<span>Р’С‹РґР°РЅ Р°РґРјРёРЅРѕРј</span>':'';
  return `<article class="card rar-${a.rar.k}${x.pin?' pinned':''}">
    <div class="meta"><span class="pill"><i></i>${a.rar.n}</span><span class="where">${esc(whereText(x.pl))}</span></div>
    <div class="mat">${plateHTML(x.pl)}</div>
    <div class="tags">${tags}${src}</div>
    <div class="foot2"><div class="price">${fmt(x.price)}<small>РѕС†РµРЅРєР°</small></div>
    <div class="btns"><button class="btn sm" data-act="pin" data-id="${x.id}" aria-pressed="${x.pin}">${x.pin?'РћС‚РєСЂРµРїРёС‚СЊ':'Р—Р°РєСЂРµРїРёС‚СЊ'}</button>
    ${trade()?`<button class="btn sm" data-act="list-open" data-id="${x.id}">РќР° СЂС‹РЅРѕРє</button>`:''}
    <button class="btn sm ${isArm?'armed':''}" data-act="quick" data-id="${x.id}">${isArm?'РўРѕС‡РЅРѕ Р·Р° '+fmt(q)+'?':'РЎРєСѓРїС‰РёРєСѓ'}</button></div></div></article>`;
}

/* ---------- СЂС‹РЅРѕРє ---------- */
let meBuilt=false;
function renderMarket(){
  const st=$('m-status');
  if(Net.status==='loading')st.innerHTML=`<div class="note"><p>РџРѕРґРєР»СЋС‡Р°РµРјСЃСЏ Рє СЂС‹РЅРєСѓвЂ¦</p></div>`;
  else if(Net.status==='off')st.innerHTML=`<div class="note warn"><p>РќРµС‚ СЃРІСЏР·Рё СЃ СЃРµСЂРІРµСЂРѕРј. РљР°Рє С‚РѕР»СЊРєРѕ СЃРІСЏР·СЊ РІРµСЂРЅС‘С‚СЃСЏ, СЂС‹РЅРѕРє РѕР±РЅРѕРІРёС‚СЃСЏ СЃР°Рј.</p></div>`;
  else if(Net.me.banned)st.innerHTML=`<div class="note warn"><p>РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ Р·Р°РєСЂС‹Р» РІР°Рј РґРѕСЃС‚СѓРї Рє СЂС‹РЅРєСѓ. РЎРјРѕС‚СЂРµС‚СЊ Р»РѕС‚С‹ РјРѕР¶РЅРѕ, РїРѕРєСѓРїР°С‚СЊ Рё РїСЂРѕРґР°РІР°С‚СЊ РЅРµР»СЊР·СЏ.</p></div>`;
  else st.innerHTML='';
  const me=$('m-me');
  if(trade()){
    if(!meBuilt){
      me.innerHTML=`<div class="panel" style="padding:14px 16px;display:grid;gap:14px">
        <div class="row"><div class="field grow"><label for="nick">Р’Р°С€ РЅРёРє</label><input class="inp" id="nick" maxlength="20" autocomplete="nickname"></div><button class="btn" data-act="nick-save" style="align-self:end">РЎРѕС…СЂР°РЅРёС‚СЊ</button></div>
        <div id="m-mine"></div></div>`;
      meBuilt=true;
    }
    const ni=$('nick');if(ni&&document.activeElement!==ni)ni.value=S.nick||'';
    renderMine();
  }else{me.innerHTML='';meBuilt=false}
  $('m-filters').innerHTML=['all','ru','ua','kz'].map(f=>`<button class="chip" data-act="m-filter" data-f="${f}" aria-pressed="${mFilt===f}">${f==='all'?'Р’СЃРµ СЃС‚СЂР°РЅС‹':FL[f]+'<span>'+CS[f]+'</span>'}</button>`).join('');
  renderMarketList();renderFeed();
}
function renderMine(){
  const box=$('m-mine');if(!box)return;
  const mine=Net.open.filter(l=>l.seller===Net.me.uid);
  if(!mine.length){box.innerHTML=`<p class="muted" style="margin:0">РЈ РІР°СЃ РЅРµС‚ Р»РѕС‚РѕРІ. Р’С‹СЃС‚Р°РІРёС‚СЊ РЅРѕРјРµСЂ РјРѕР¶РЅРѕ РёР· РіР°СЂР°Р¶Р° РёР»Рё СЃСЂР°Р·Сѓ РїРѕСЃР»Рµ РІС‹РїР°РґРµРЅРёСЏ. РњР°РєСЃРёРјСѓРј ${MAX_LIST} Р»РѕС‚РѕРІ.</p>`;return}
  box.innerHTML=`<p class="eyebrow" style="margin:0 0 8px">РњРѕРё Р»РѕС‚С‹ В· ${mine.length} РёР· ${MAX_LIST}</p><div class="mylist">${mine.map(l=>{const a=appraise(l.pl);return `<div class="myrow rar-${a.rar.k}"><div class="mat" style="padding:4px">${plateHTML(l.pl)}</div><div class="st">РќР° РїСЂРѕРґР°Р¶Рµ Р·Р° <b>${fmt(l.ask)}</b><br>РћС†РµРЅРєР° ${fmt(a.price)} В· РІР°Рј РїСЂРёРґС‘С‚ ${fmt(Math.floor(l.ask*(1-FEE)))}</div><button class="btn sm" data-act="cancel" data-id="${esc(l.id)}">РЎРЅСЏС‚СЊ</button></div>`}).join('')}</div>`;
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
  if(!valid.length){box.innerHTML=`<div class="empty" style="grid-column:1/-1"><span>РќР° СЂС‹РЅРєРµ РїРѕРєР° РЅРµС‚ Р»РѕС‚РѕРІ. Р’С‹СЃС‚Р°РІСЊС‚Рµ СЃРІРѕР№ РЅРѕРјРµСЂ РїРµСЂРІС‹Рј.</span>${trade()?'<button class="btn primary" data-act="go" data-tab="garage">Р’С‹Р±СЂР°С‚СЊ РЅРѕРјРµСЂ РІ РіР°СЂР°Р¶Рµ</button>':''}</div>`;return}
  if(!total){box.innerHTML=`<div class="empty" style="grid-column:1/-1"><span>РџРѕРґ С„РёР»СЊС‚СЂ РЅРёС‡РµРіРѕ РЅРµ РїРѕРґРѕС€Р»Рѕ.</span></div>`;return}
  box.innerHTML=list.map(({l,a})=>mCard(l,a)).join('')+(total>120?`<p class="muted" style="grid-column:1/-1;margin:0">РџРѕРєР°Р·Р°РЅС‹ РїРµСЂРІС‹Рµ 120 РёР· ${total}. РЈС‚РѕС‡РЅРёС‚Рµ РїРѕРёСЃРє.</p>`:'');
}
function mCard(l,a){
  const mine=l.seller===Net.me.uid,d=Math.round((l.ask/a.price-1)*100);
  const delta=d===0?'<span class="delta">РїРѕ РѕС†РµРЅРєРµ</span>':`<span class="delta ${d<0?'down':'up'}">${d>0?'+':'в€’'}${Math.abs(d)}%</span>`;
  const key='b'+l.id,isArm=armed===key;
  let btn='';
  if(mine)btn=`<button class="btn sm" data-act="cancel" data-id="${esc(l.id)}">РЎРЅСЏС‚СЊ</button>`;
  else if(!trade())btn='';
  else if(S.bal<l.ask)btn=`<button class="btn sm" disabled>РќРµ С…РІР°С‚Р°РµС‚ ${fmt(l.ask-S.bal)}</button>`;
  else btn=`<button class="btn sm ${isArm?'armed':'primary'}" data-act="buy" data-id="${esc(l.id)}">${isArm?'РўРѕС‡РЅРѕ РєСѓРїРёС‚СЊ?':'РљСѓРїРёС‚СЊ'}</button>`;
  const mod=Net.me.admin&&!mine?`<button class="btn sm ghost" data-act="mod" data-id="${esc(l.id)}">${armed==='mod'+l.id?'РўРѕС‡РЅРѕ СѓР±СЂР°С‚СЊ?':'РЈР±СЂР°С‚СЊ'}</button>`:'';
  return `<article class="card rar-${a.rar.k}${mine?' mine':''}">
    <div class="meta"><span class="pill"><i></i>${a.rar.n}</span><span class="where">${esc(whereText(l.pl))}</span></div>
    <div class="mat">${plateHTML(l.pl)}</div>
    <div class="seller">РџСЂРѕРґР°РІРµС† <b>${esc(l.nick)}</b>${badge(l.seller)}${mine?' В· СЌС‚Рѕ РІС‹':''} В· ${agoText(l.t)}</div>
    <div class="foot2"><div class="price">${fmt(l.ask)}<small>РћС†РµРЅРєР° ${fmt(a.price)} ${delta}</small></div><div class="btns">${mod}${btn}</div></div></article>`;
}
function openListSheet(id){
  const x=S.box.find(v=>v.id===id);if(!x)return;
  if(!trade())return toast('РўРѕСЂРіРѕРІР»СЏ СЃРµР№С‡Р°СЃ РЅРµРґРѕСЃС‚СѓРїРЅР°');
  const a=appraise(x.pl);
  openSheet(`<div class="sc rar-${a.rar.k}" role="dialog" aria-modal="true" aria-labelledby="sh-t">
    <h3 id="sh-t">Р’С‹СЃС‚Р°РІРёС‚СЊ РЅР° СЂС‹РЅРѕРє</h3>
    <div class="mat">${plateHTML(x.pl)}</div>
    <div class="field"><label for="ask">Р¦РµРЅР°, в‚Ѕ</label><input class="inp num" id="ask" type="number" inputmode="numeric" min="${MIN_ASK}" max="${MAX_ASK}" step="10" value="${a.price}"></div>
    <div class="chips"><button class="chip" data-act="ask-set" data-k=".9">в€’10%</button><button class="chip" data-act="ask-set" data-k="1">РџРѕ РѕС†РµРЅРєРµ</button><button class="chip" data-act="ask-set" data-k="1.25">+25%</button><button class="chip" data-act="ask-set" data-k="1.5">+50%</button></div>
    <dl class="sum"><div><dt>РћС†РµРЅРєР°</dt><dd>${fmt(a.price)}</dd></div><div><dt>РљРѕРјРёСЃСЃРёСЏ СЂС‹РЅРєР° 5%</dt><dd id="sh-fee"></dd></div><div><dt>Р’С‹ РїРѕР»СѓС‡РёС‚Рµ</dt><dd id="sh-pay"></dd></div><div><dt>РЎРєСѓРїС‰РёРє РґР°Р» Р±С‹</dt><dd>${fmt(Math.floor(a.price*BUYBACK))}</dd></div></dl>
    <p class="muted" style="margin:0;font-size:13.5px">РќРѕРјРµСЂ СѓР№РґС‘С‚ РёР· РіР°СЂР°Р¶Р° РЅР° СЂС‹РЅРѕРє. РЎРЅСЏС‚СЊ Р»РѕС‚ РјРѕР¶РЅРѕ РІ Р»СЋР±РѕР№ РјРѕРјРµРЅС‚, РїРѕРєР° РµРіРѕ РЅРµ РєСѓРїРёР»Рё.</p>
    <div class="row"><button class="btn ghost" data-act="sheet-close">РћС‚РјРµРЅР°</button><span style="flex:1"></span><button class="btn primary" data-act="list-confirm" data-id="${id}">Р’С‹СЃС‚Р°РІРёС‚СЊ</button></div></div>`,{base:a.price,focus:'ask'});
  updAsk();
}
function updAsk(){const el=$('ask');if(!el)return;const v=Math.round(num(el.value));const ok=v>=MIN_ASK&&v<=MAX_ASK;$('sh-fee').textContent=ok?fmt(v-Math.floor(v*(1-FEE))):'вЂ”';$('sh-pay').textContent=ok?fmt(Math.floor(v*(1-FEE))):'вЂ”'}
function openSheet(html,opt){const sh=$('sheet');sh.innerHTML=html;sh.hidden=false;if(opt&&opt.base)sh.dataset.base=opt.base;if(opt&&opt.focus)setTimeout(()=>{try{$(opt.focus).focus()}catch(e){}},30)}
function closeSheet(){const sh=$('sheet');sh.hidden=true;sh.innerHTML=''}

/* ---------- СЃС‚Р°РЅС‚ ---------- */
function carColor(){return(CARS[S.car]||CARS.orange).c}
function stuntToday(){const d=mskDate();return S.stunt.d===d?{earned:S.stunt.earned,runs:S.stunt.runs}:{earned:0,runs:0}}
function stuntStartHtml(){
  const td=stuntToday(),left=Math.max(0,STUNT_CAP-td.earned);
  return `<h3>Р—Р°РµР·Рґ РЅР° 45 СЃРµРєСѓРЅРґ</h3>
    <p>Р“Р°Р· СЂР°Р·РіРѕРЅСЏРµС‚ РјР°С€РёРЅСѓ, Р° РІ РІРѕР·РґСѓС…Рµ РєСЂСѓС‚РёС‚ РµС‘ РЅР°Р·Р°Рґ. РўРѕСЂРјРѕР· РІ РІРѕР·РґСѓС…Рµ РєСЂСѓС‚РёС‚ РІРїРµСЂС‘Рґ. РџСЂРёР·РµРјР»СЏР№С‚РµСЃСЊ РЅР° РєРѕР»С‘СЃР°.</p>
    <dl><div><dt>Р‘СЌРєС„Р»РёРї</dt><dd>1 500</dd></div><div><dt>Р¤СЂРѕРЅС‚С„Р»РёРї</dt><dd>1 900</dd></div><div><dt>РРґРµР°Р»СЊРЅРѕРµ РїСЂРёР·РµРјР»РµРЅРёРµ</dt><dd>Г—1,5</dd></div><div><dt>Р¤Р»РёРїС‹ РїРѕРґСЂСЏРґ</dt><dd>+25% Р·Р° РєР°Р¶РґС‹Р№</dd></div><div><dt>РљР°Р¶РґС‹Рµ 10 Рј</dt><dd>10</dd></div></dl>
    <p>${left>0?'РЎРµРіРѕРґРЅСЏ РјРѕР¶РЅРѕ Р·Р°СЂР°Р±РѕС‚Р°С‚СЊ РµС‰С‘ '+fmt(left)+'. 20 РѕС‡РєРѕРІ = 1 в‚Ѕ.':'Р”РЅРµРІРЅРѕР№ Р»РёРјРёС‚ СЂСѓР±Р»РµР№ РёСЃС‡РµСЂРїР°РЅ. РћРїС‹С‚ СЃРµР·РѕРЅР° РЅР°С‡РёСЃР»СЏРµС‚СЃСЏ РєР°Рє РѕР±С‹С‡РЅРѕ.'}</p>
    <button class="btn primary wide" data-act="stunt-start">РџРѕРµС…Р°Р»Рё</button>`;
}
function stuntEndHtml(res,rew){
  return `<h3>${res.crashed?'РђРІР°СЂРёСЏ':'Р¤РёРЅРёС€'}${rew&&rew.rec?' В· СЂРµРєРѕСЂРґ!':''}</h3>
    <dl><div><dt>РћС‡РєРё</dt><dd>${fmtN(res.score)}</dd></div><div><dt>Р¤Р»РёРїС‹</dt><dd>${res.flips}</dd></div><div><dt>Р›СѓС‡С€РёР№ РїСЂС‹Р¶РѕРє</dt><dd>${fmtN(res.best)}</dd></div><div><dt>РџСЂРѕРµС…Р°Р»Рё</dt><dd>${fmtN(res.dist)} Рј</dd></div>
    <div><dt>РќР°РіСЂР°РґР°</dt><dd>${rew?'+'+fmt(rew.money)+(rew.xp?' В· +'+rew.xp+' РѕРїС‹С‚Р°':''):'РЅРµ РЅР°С‡РёСЃР»РµРЅР°'}</dd></div></dl>
    ${rew&&rew.capped?'<p>Р”РЅРµРІРЅРѕР№ Р»РёРјРёС‚ СЂСѓР±Р»РµР№ Р·Р° СЃС‚Р°РЅС‚ РёСЃС‡РµСЂРїР°РЅ. Р—Р°РІС‚СЂР° СЃРЅРѕРІР° РјРѕР¶РЅРѕ Р·Р°СЂР°Р±РѕС‚Р°С‚СЊ РґРѕ '+fmt(STUNT_CAP)+'.</p>':''}
    ${rew?'':'<p>РЎРµСЂРІРµСЂ РЅРµ РїСЂРёРЅСЏР» СЂРµР·СѓР»СЊС‚Р°С‚. РџСЂРѕРІРµСЂСЊС‚Рµ СЃРІСЏР·СЊ Рё РїРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘ Р·Р°РµР·Рґ.</p>'}
    <button class="btn primary wide" data-act="stunt-start">Р•С‰С‘ Р·Р°РµР·Рґ</button>`;
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
    const title=own?c.n:c.cost?c.n+' В· '+c.cost+' в—†':c.n+' В· '+(CAR_SRC[id]||'');
    const isArm=armed==='car'+id;
    return `<button class="sw ${own||c.cost?'':'locked'}" style="background:${c.c}${isArm?';outline:3px solid var(--bad)':''}" data-act="car" data-id="${id}" aria-pressed="${S.car===id}" title="${esc(title)}" aria-label="${esc(title)}"></button>`;
  }).join('');
  const armedCar=Object.keys(CARS).find(id=>armed==='car'+id);
  $('stunt-side').innerHTML=`<dl class="kv"><div><dt>Р РµРєРѕСЂРґ</dt><dd>${fmtN(S.stunt.best)}</dd></div><div><dt>Р—Р°РµР·РґРѕРІ СЃРµРіРѕРґРЅСЏ</dt><dd>${td.runs}</dd></div><div><dt>Р—Р°СЂР°Р±РѕС‚Р°РЅРѕ СЃРµРіРѕРґРЅСЏ</dt><dd>${fmt(td.earned)} <span class="muted" style="font:500 14px var(--f-body)">РёР· ${fmt(STUNT_CAP)}</span></dd><div class="meter"><i style="width:${Math.min(100,td.earned/STUNT_CAP*100)}%"></i></div></div></dl>
    <div><p class="eyebrow" style="margin:0 0 10px">Р¦РІРµС‚ РјР°С€РёРЅС‹</p><div class="colors">${sw}</div>
    <p class="muted" style="margin:10px 0 0;font-size:13.5px">${armedCar?'РќР°Р¶РјРёС‚Рµ РµС‰С‘ СЂР°Р·, С‡С‚РѕР±С‹ РєСѓРїРёС‚СЊ В«'+CARS[armedCar].n+'В» Р·Р° '+CARS[armedCar].cost+' в—†':'РЎРµР№С‡Р°СЃ: В«'+CARS[S.car].n+'В». Р§Р°СЃС‚СЊ С†РІРµС‚РѕРІ РґР°С‘С‚ СЃРµР·РѕРЅРЅС‹Р№ РїСЂРѕРїСѓСЃРє, РѕСЃС‚Р°Р»СЊРЅС‹Рµ РїСЂРѕРґР°СЋС‚СЃСЏ Р·Р° РіРѕР»РґСѓ.'}</p></div>`;
}

/* ---------- СЃРµР·РѕРЅ ---------- */
function countdown(){const ms=SEASON.end-Date.now();if(ms<=0)return'РЎРµР·РѕРЅ Р·Р°РІРµСЂС€С‘РЅ';const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);return'Р”Рѕ РєРѕРЅС†Р° СЃРµР·РѕРЅР°: '+(d?d+' Рґ ':'')+h+' С‡'+(d?'':' '+m+' РјРёРЅ')}
function renderSeason(){
  const Lv=level(S),max=Lv>=SEASON.max;
  const inLvl=max?SEASON.lvlXp:S.xp%SEASON.lvlXp;
  const premBtn=S.premium?'<span class="pill" style="--rc:var(--gold)"><i></i>РџСЂРµРјРёСѓРј Р°РєС‚РёРІРµРЅ</span>'
    :seasonOn()?`<button class="btn goldy" data-act="premium">${armed==='premium'?'РўРѕС‡РЅРѕ? РЎРїРёС€РµС‚СЃСЏ '+gem(SEASON.premium):'РћС‚РєСЂС‹С‚СЊ РїСЂРµРјРёСѓРј В· '+gem(SEASON.premium)}</button>${S.gold<SEASON.premium?'<span class="muted" style="font-size:13.5px">РќРµ С…РІР°С‚Р°РµС‚ '+gem(SEASON.premium-S.gold)+'</span>':''}`:'';
  $('s-hero').innerHTML=`<div class="biglvl" style="--p:${lvlPct(S)}"><div><span><small>РЈСЂРѕРІРµРЅСЊ</small><b>${Lv}</b></span></div></div>
    <div style="min-width:0"><p class="eyebrow" style="margin:0 0 6px" id="s-count">${countdown()}</p><h2 class="h">РЎРµР·РѕРЅ 1 В· Р’С‹С…РѕРґ РёР· Р±РµС‚С‹</h2>
    <div class="bar2" role="progressbar" aria-valuemin="0" aria-valuemax="${SEASON.lvlXp}" aria-valuenow="${inLvl}"><i style="width:${lvlPct(S)}%"></i></div>
    <p class="muted" style="margin:8px 0 0;font-size:14px">${max?'РњР°РєСЃРёРјР°Р»СЊРЅС‹Р№ СѓСЂРѕРІРµРЅСЊ. Р’СЃРµРіРѕ '+fmtN(S.xp)+' РѕРїС‹С‚Р°':fmtN(inLvl)+' / '+fmtN(SEASON.lvlXp)+' РѕРїС‹С‚Р° РґРѕ СѓСЂРѕРІРЅСЏ '+(Lv+1)}. РћРїС‹С‚ РґР°СЋС‚ РєРµР№СЃС‹ (40вЂ“250), СЃС‚Р°РЅС‚ (РґРѕ 250 Р·Р° Р·Р°РµР·Рґ), СЃРґРµР»РєРё РЅР° СЂС‹РЅРєРµ (50вЂ“80) Рё Р·Р°РґР°РЅРёСЏ (350).</p>
    <div class="row">${premBtn}</div></div>`;
  const qb=$('quests');
  if(S.daily.d!==mskDate())qb.innerHTML='<p class="muted" style="margin:0">Р—Р°РґР°РЅРёСЏ РґРЅСЏ РїРѕСЏРІСЏС‚СЃСЏ РїРѕСЃР»Рµ РїРµСЂРІРѕРіРѕ РґРµР№СЃС‚РІРёСЏ РІ РёРіСЂРµ СЃРµРіРѕРґРЅСЏ: РѕС‚РєСЂРѕР№С‚Рµ РєРµР№СЃ РёР»Рё РїСЂРѕРµРґСЊС‚Рµ Р·Р°РµР·Рґ.</p>';
  else qb.innerHTML=S.daily.q.map(id=>{const Q=QUESTS[id],p=num(S.daily.p[id]),done=S.daily.done.includes(id),ready=p>=Q.g&&!done;
      return `<div class="quest${done?' done':''}"><div><div class="q-t">${Q.t}</div><div class="q-r">${fmtN(p)} / ${fmtN(Q.g)} В· РЅР°РіСЂР°РґР° 350 РѕРїС‹С‚Р° Рё 300 в‚Ѕ</div></div>
      ${done?'<span class="ok-mark">РџРѕР»СѓС‡РµРЅРѕ</span>':`<button class="btn sm ${ready?'primary':''}" data-act="quest" data-id="${id}" ${ready?'':'disabled'}>Р—Р°Р±СЂР°С‚СЊ</button>`}
      <div class="bar2"><i style="width:${Math.min(100,p/Q.g*100)}%"></i></div></div>`}).join('');
  const cl=claimable(S);
  $('claimall').innerHTML=cl?`<button class="btn primary sm" data-act="claim-all">Р—Р°Р±СЂР°С‚СЊ РІСЃС‘ В· ${cl}</button>`:'';
  let rows=`<div class="trow head"><span>РЈСЂ.</span><span>Р‘РµСЃРїР»Р°С‚РЅРѕ</span><span>РџСЂРµРјРёСѓРј</span></div>`;
  for(let i=1;i<=SEASON.max;i++){const reached=i<=Lv;rows+=`<div class="trow${reached?' reached':''}"><div class="lv">${i}</div>${rwCell(FREE[i],'f',i,reached,S.cf.includes(i),true)}${rwCell(PREM[i],'p',i,reached,S.cp.includes(i),S.premium)}</div>`}
  $('ptrack').innerHTML=rows;
  renderLeaderboard();
}
function rwCell(r,trk,i,reached,got,unlocked){
  const t=rewardText(r);
  const label=t.plate?`<div class="mini-plate">${plateHTML(t.plate)}<span class="rl"><small>${esc(t.b)}</small></span></div>`:`<span class="rl">${esc(t.a)}<small>${esc(t.b)}</small></span>`;
  let right='';
  if(got)right='<span class="ok-mark" aria-label="РџРѕР»СѓС‡РµРЅРѕ">вњ“</span>';
  else if(reached&&unlocked)right=`<button class="btn sm primary" data-act="claim" data-t="${trk}" data-l="${i}">Р—Р°Р±СЂР°С‚СЊ</button>`;
  else if(trk==='p'&&!unlocked)right='<span class="muted" style="font-size:12px">РїСЂРµРјРёСѓРј</span>';
  return `<div class="${['rw',trk==='p'?'prem':'',got?'got':'',!reached||!unlocked?'lock':''].join(' ')}">${label}${right}</div>`;
}
function renderLeaderboard(){
  const box=$('lb');if(!box)return;
  if(Net.status!=='on'){box.innerHTML='<p class="muted">Р—Р°РіСЂСѓР¶Р°РµРјвЂ¦</p>';return}
  const list=Net.top||[];
  if(!list.length){box.innerHTML='<div class="empty"><span>РџРѕРєР° РІ С‚РѕРїРµ РЅРёРєРѕРіРѕ. РџРѕР»СѓС‡РёС‚Рµ РѕРїС‹С‚, Рё РІС‹ РїРѕСЏРІРёС‚РµСЃСЊ Р·РґРµСЃСЊ РїРµСЂРІС‹Рј.</span></div>';return}
  box.innerHTML=`<div class="tablewrap"><table class="lb"><thead><tr><th>#</th><th>РРіСЂРѕРє</th><th>РЈСЂ.</th><th>Р“Р°СЂР°Р¶</th></tr></thead><tbody>${list.map((p,i)=>`<tr class="${p.uid===Net.me.uid?'me':''}"><td class="rk">${i+1}</td><td class="nick">${esc(p.nick)}${badge(p.uid)}${p.uid===Net.me.uid?' <span class="muted">(РІС‹)</span>':''}</td><td>${p.lvl}</td><td>${fmt(p.worth)}</td></tr>`).join('')}</tbody></table></div>`;
}

/* ---------- РґРѕРЅР°С‚ ---------- */
let shopBuilt=false;
function renderShop(){
  $('sh-packs').innerHTML=`<div class="packs">${PACKS.map((p,i)=>`<button class="pack" data-act="pack" data-i="${i}" aria-pressed="${packSel===i}">${p.b?`<span class="bonus">${p.b}</span>`:''}<span class="g"><span class="gem">в—†</span>${fmtN(p.g)}</span><span class="rub">${fmt(p.rub)}</span></button>`).join('')}</div>`;
  if(!shopBuilt){
    $('sh-pay').innerHTML=`<div id="sh-info" style="display:grid;gap:12px"></div>
      <div class="row"><div class="field grow"><label for="promo">РџСЂРѕРјРѕРєРѕРґ</label><input class="inp" id="promo" placeholder="XXXX-XXXX-XXXX" autocomplete="off" autocapitalize="characters" spellcheck="false"></div><button class="btn goldy" data-act="promo" style="align-self:end">РђРєС‚РёРІРёСЂРѕРІР°С‚СЊ</button></div>`;
    shopBuilt=true;
  }
  const P=PACKS[packSel],shop=Net.cfg.shop;
  let info=`<h3 class="h3">РљР°Рє РїРѕРїРѕР»РЅРёС‚СЊ РіРѕР»РґСѓ</h3>`;
  if(!shop)info+=`<p class="muted" style="margin:0">Р’Р»Р°РґРµР»РµС† РёРіСЂС‹ РµС‰С‘ РЅРµ СѓРєР°Р·Р°Р», РєСѓРґР° РїРµСЂРµРІРѕРґРёС‚СЊ РѕРїР»Р°С‚Сѓ. РџРѕРєР° РіРѕР»РґСѓ РјРѕР¶РЅРѕ РїРѕР»СѓС‡РёС‚СЊ РІ СЃРµР·РѕРЅРЅРѕРј РїСЂРѕРїСѓСЃРєРµ: РґРѕ 1 080 в—† Р·Р° СЃРµР·РѕРЅ.</p>`;
  else info+=`<ol class="steps">
      <li>РџРµСЂРµРІРµРґРёС‚Рµ <b>${fmt(P.rub)}</b> Р·Р° <b>${gem(P.g)}</b> РІР»Р°РґРµР»СЊС†Сѓ РёРіСЂС‹.${shop.payText?`<div style="white-space:pre-wrap;margin-top:6px;color:var(--muted)">${esc(shop.payText)}</div>`:''}${shop.payLink?`<div style="margin-top:8px"><a class="btn sm" href="${esc(shop.payLink)}" target="_blank" rel="noopener noreferrer">РћС‚РєСЂС‹С‚СЊ СЃС‚СЂР°РЅРёС†Сѓ РѕРїР»Р°С‚С‹</a></div>`:''}</li>
      <li>Р’ РєРѕРјРјРµРЅС‚Р°СЂРёРё Рє РїРµСЂРµРІРѕРґСѓ СѓРєР°Р¶РёС‚Рµ РЅРёРє: <span class="copyline" style="display:inline-flex"><code>${esc(S.nick||'')}</code><button class="btn sm ghost" data-act="copy" data-text="${esc(S.nick||'')}">РљРѕРїРёСЂРѕРІР°С‚СЊ</button></span></li>
      <li>Р’Р»Р°РґРµР»РµС† РїСЂРёС€Р»С‘С‚ РѕРґРЅРѕСЂР°Р·РѕРІС‹Р№ РїСЂРѕРјРѕРєРѕРґ. Р’РІРµРґРёС‚Рµ РµРіРѕ РЅРёР¶Рµ, РіРѕР»РґР° РЅР°С‡РёСЃР»РёС‚СЃСЏ СЃСЂР°Р·Сѓ.</li></ol>
      <p class="muted" style="margin:0;font-size:13px">РћРїР»Р°С‚Р° РёРґС‘С‚ РЅР°РїСЂСЏРјСѓСЋ РІР»Р°РґРµР»СЊС†Сѓ РёРіСЂС‹. РЎР°Р№С‚ РЅРµ РїСЂРёРЅРёРјР°РµС‚ Рё РЅРµ С…СЂР°РЅРёС‚ РґР°РЅРЅС‹Рµ РєР°СЂС‚.</p>`;
  $('sh-info').innerHTML=info;
  const store=[];
  if(seasonOn()||S.premium)store.push(`<div class="item"><h4>РџСЂРµРјРёСѓРј-РїСЂРѕРїСѓСЃРє</h4><p>Р’С‚РѕСЂР°СЏ Р»РёРЅРёСЏ РЅР°РіСЂР°Рґ СЃРµР·РѕРЅР°: 630 в—† РѕР±СЂР°С‚РЅРѕ, РєР»СЋС‡Рё, С†РІРµС‚Р° РјР°С€РёРЅС‹ Рё Р»РµРіРµРЅРґР°СЂРЅС‹Р№ Рђ777РђРђ 777 РЅР° 30 СѓСЂРѕРІРЅРµ.</p>${S.premium?'<span class="ok-mark">РЈР¶Рµ Р°РєС‚РёРІРµРЅ</span>':`<button class="btn goldy" data-act="premium" ${S.gold<SEASON.premium?'disabled':''}>${armed==='premium'?'РўРѕС‡РЅРѕ? РЎРїРёС€РµС‚СЃСЏ '+gem(SEASON.premium):'РљСѓРїРёС‚СЊ В· '+gem(SEASON.premium)}</button>`}</div>`);
  if(seasonOn())store.push(`<div class="item"><h4>РљР»СЋС‡ В«РЎРµР·РѕРЅРЅС‹Р№В»</h4><p>Р‘РµСЃРїР»Р°С‚РЅРѕ РѕС‚РєСЂС‹РІР°РµС‚ СЃРµР·РѕРЅРЅС‹Р№ РєРµР№СЃ: Р»СѓС‡С€РёР№ РёР· 14 РЅРѕРјРµСЂРѕРІ, РЅРµ РЅРёР¶Рµ В«Р РµРґРєРѕРіРѕВ».</p><button class="btn goldy" data-act="buy-key" data-k="season" ${S.gold<GKEY.season?'disabled':''}>РљСѓРїРёС‚СЊ В· ${gem(GKEY.season)}</button></div>`);
  store.push(`<div class="item"><h4>РљР»СЋС‡ В«Р­Р»РёС‚РЅС‹Р№В»</h4><p>Р‘РµСЃРїР»Р°С‚РЅРѕ РѕС‚РєСЂС‹РІР°РµС‚ СЌР»РёС‚РЅС‹Р№ РєРµР№СЃ: Р»СѓС‡С€РёР№ РёР· 10 РЅРѕРјРµСЂРѕРІ.</p><button class="btn goldy" data-act="buy-key" data-k="elite" ${S.gold<GKEY.elite?'disabled':''}>РљСѓРїРёС‚СЊ В· ${gem(GKEY.elite)}</button></div>`);
  store.push(`<div class="item"><h4>РћР±РјРµРЅ РЅР° СЂСѓР±Р»Рё</h4><p>10 в—† = ${fmt(500)}. Р”РµРЅСЊРіРё СЃСЂР°Р·Сѓ РЅР° Р±Р°Р»Р°РЅСЃ.</p><div class="row"><button class="btn goldy" data-act="exch" data-n="1" ${S.gold<10?'disabled':''}>10 в—†</button><button class="btn" data-act="exch" data-n="10" ${S.gold<100?'disabled':''}>100 в—† в†’ ${fmt(5000)}</button></div></div>`);
  store.push(`<div class="item"><h4>Р¦РІРµС‚Р° РјР°С€РёРЅС‹</h4><p>РљСЂР°СЃРЅС‹Р№ Рё СЃРёРЅРёР№ РїРѕ 60 в—†, С‡С‘СЂРЅС‹Р№ Рё Р±РµР»С‹Р№ РїРѕ 90 в—†. Р’С‹Р±РёСЂР°СЋС‚СЃСЏ РІ СЃС‚Р°РЅС‚Рµ.</p><button class="btn" data-act="go" data-tab="stunt">Рљ РјР°С€РёРЅРµ</button></div>`);
  $('sh-store').innerHTML=store.join('');
}

/* ---------- Р°РґРјРёРЅРєР° ---------- */
const PLACE={ru:'Рђ777РђРђ 777',ua:'AA 7777 AA',kz:'777 AAA 01'};
let adSelfBuilt=false,adNewsBuilt=false,adShopBuilt=false;
function renderAdminTab(){
  if(!Net.me.admin){go('cases');return}
  if(!adSelfBuilt){
    $('ad-self').innerHTML=`<div><p class="eyebrow" style="margin:0 0 4px">Р’Р°С€ Р°РєРєР°СѓРЅС‚</p><h3 class="h3">Р’С‹РґР°С‚СЊ СЃРµР±Рµ</h3></div>
    <div class="row"><div class="field grow"><label for="as-rub">Р СѓР±Р»Рё</label><input class="inp num" id="as-rub" type="number" min="1" value="100000"></div><button class="btn" data-act="as-rub" style="align-self:end">РќР°С‡РёСЃР»РёС‚СЊ в‚Ѕ</button></div>
    <div class="row"><div class="field grow"><label for="as-gold">Р“РѕР»РґР°</label><input class="inp num" id="as-gold" type="number" min="1" value="1000"></div><button class="btn goldy" data-act="as-gold" style="align-self:end">РќР°С‡РёСЃР»РёС‚СЊ в—†</button></div>
    <div class="row"><div class="field grow"><label for="as-key">РљР»СЋС‡Рё</label><select class="inp" id="as-key">${Object.keys(KEYN).map(k=>`<option value="${k}">${KEYN[k]}</option>`).join('')}</select></div><div class="field" style="width:90px"><label for="as-keyn">РЎРєРѕР»СЊРєРѕ</label><input class="inp num" id="as-keyn" type="number" min="1" max="1000" value="5"></div><button class="btn" data-act="as-key" style="align-self:end">Р’С‹РґР°С‚СЊ</button></div>
    <div class="row"><div class="field grow"><label for="as-lvl">РЈСЂРѕРІРµРЅСЊ РїСЂРѕРїСѓСЃРєР°</label><select class="inp" id="as-lvl">${Array.from({length:31},(_,i)=>`<option value="${i}">${i}</option>`).join('')}</select></div><button class="btn" data-act="as-lvl" style="align-self:end">РЈСЃС‚Р°РЅРѕРІРёС‚СЊ</button><button class="btn" data-act="as-prem" id="as-prem" style="align-self:end"></button></div>
    <div class="field"><label for="as-plate">Р›СЋР±РѕР№ РЅРѕРјРµСЂ РІ РіР°СЂР°Р¶</label><div class="row"><select class="inp" id="as-pc" style="width:auto" aria-label="РЎС‚СЂР°РЅР° РЅРѕРјРµСЂР°"><option value="ru">Р Р¤</option><option value="ua">РЈРєСЂР°РёРЅР°</option><option value="kz">РљР°Р·Р°С…СЃС‚Р°РЅ</option></select><input class="inp grow" id="as-plate" placeholder="${PLACE.ru}" autocomplete="off" spellcheck="false"></div></div>
    <div id="as-prev"></div>
    <div class="row"><button class="btn primary" data-act="as-plate">Р”РѕР±Р°РІРёС‚СЊ РЅРѕРјРµСЂ РІ РіР°СЂР°Р¶</button></div>`;
    adSelfBuilt=true;
  }
  if(document.activeElement!==$('as-lvl'))$('as-lvl').value=String(level(S));
  $('as-prem').textContent=S.premium?'Р’С‹РєР»СЋС‡РёС‚СЊ РїСЂРµРјРёСѓРј':'Р’РєР»СЋС‡РёС‚СЊ РїСЂРµРјРёСѓРј';
  updPlatePrev();renderAdminNews();renderAdminMarket();renderAdminPlayers();renderAdminShop();
}
function updPlatePrev(){
  const box=$('as-prev');if(!box)return;const c=$('as-pc').value,v=$('as-plate').value;
  $('as-plate').placeholder=PLACE[c];
  if(!v.trim()){box.innerHTML='<p class="muted" style="margin:0;font-size:13.5px">Р¤РѕСЂРјР°С‚: '+PLACE[c]+'. Р РµРіРёРѕРЅ РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РІ СЃРїРёСЃРєРµ РёРіСЂС‹.</p>';return}
  const pl=parsePlateInput(c,v);
  if(!pl){box.innerHTML='<p style="margin:0;font-size:13.5px;color:var(--bad)">РўР°РєРѕР№ РЅРѕРјРµСЂ РЅРµ РїРѕРґС…РѕРґРёС‚. '+(c==='ru'?'Р‘СѓРєРІС‹ С‚РѕР»СЊРєРѕ Рђ Р’ Р• Рљ Рњ Рќ Рћ Р  РЎ Рў РЈ РҐ, СЂРµРіРёРѕРЅ РёР· СЃРїРёСЃРєР° РёРіСЂС‹.':c==='ua'?'РќСѓР¶РЅС‹ РґРІРµ Р±СѓРєРІС‹ СЂРµРіРёРѕРЅР°, 4 С†РёС„СЂС‹ Рё РґРІРµ Р±СѓРєРІС‹ СЃРµСЂРёРё.':'РќСѓР¶РЅС‹ 3 С†РёС„СЂС‹, 3 Р»Р°С‚РёРЅСЃРєРёРµ Р±СѓРєРІС‹ Рё РєРѕРґ СЂРµРіРёРѕРЅР° 01вЂ“20.')+'</p>';return}
  const a=appraise(pl);
  box.innerHTML=`<div class="prev rar-${a.rar.k}"><div class="mat" style="padding:6px">${plateHTML(pl)}</div><div><span class="pill"><i></i>${a.rar.n}</span><div style="font:600 22px/1.2 var(--f-num);margin-top:6px">${fmt(a.price)}</div></div></div>`;
}
function renderAdminNews(){
  const box=$('ad-news');if(!box)return;
  if(!adNewsBuilt){
    box.innerHTML=`<div><p class="eyebrow" style="margin:0 0 4px">Р”Р»СЏ РІСЃРµС… РёРіСЂРѕРєРѕРІ</p><h3 class="h3">РћР±СЉСЏРІР»РµРЅРёРµ</h3></div>
    <div class="field"><label for="an-text">РўРµРєСЃС‚ СЃРІРµСЂС…Сѓ РІРєР»Р°РґРєРё В«РљРµР№СЃС‹В»</label><textarea class="inp" id="an-text" maxlength="300" placeholder="РќР°РїСЂРёРјРµСЂ: РІ РІС‹С…РѕРґРЅС‹Рµ РґР°СЂРёРј РІСЃРµРј СЃРµР·РѕРЅРЅС‹Р№ РєР»СЋС‡"></textarea></div>
    <div class="row"><button class="btn primary" data-act="an-pub">РћРїСѓР±Р»РёРєРѕРІР°С‚СЊ</button><button class="btn ghost" data-act="an-clear">РЈР±СЂР°С‚СЊ</button><span class="muted" id="an-state" style="font-size:13px"></span></div>
    <hr style="border:0;border-top:1px solid var(--line);margin:0">
    <div class="row"><button class="btn" data-act="ad-bot">РџРѕРґРєР»СЋС‡РёС‚СЊ Р±РѕС‚Р°</button><span class="muted" style="font-size:13px">РЎС‚Р°РІРёС‚ РєРЅРѕРїРєСѓ В«РРіСЂР°С‚СЊВ» РІ С‡Р°С‚Рµ СЃ Р±РѕС‚РѕРј Рё РѕС‚РІРµС‚ РЅР° /start. РќР°Р¶РјРёС‚Рµ РѕРґРёРЅ СЂР°Р· РїРѕСЃР»Рµ РЅР°СЃС‚СЂРѕР№РєРё.</span></div>`;
    adNewsBuilt=true;
  }
  const t=$('an-text');if(t&&!t.dataset.touched)t.value=Net.cfg.news||'';
  $('an-state').textContent=Net.cfg.news?'РЎРµР№С‡Р°СЃ РѕР±СЉСЏРІР»РµРЅРёРµ РІРёРґРЅРѕ РёРіСЂРѕРєР°Рј':'РћР±СЉСЏРІР»РµРЅРёСЏ РЅРµС‚';
}
function renderAdminMarket(){
  const box=$('ad-market');if(!box)return;
  const sellers=new Set(Net.open.map(l=>l.seller)).size,bans=Net.players.filter(p=>p.banned).length;
  box.innerHTML=`<div><p class="eyebrow" style="margin:0 0 4px">РњРѕРґРµСЂР°С†РёСЏ</p><h3 class="h3">Р С‹РЅРѕРє</h3></div>
    <p style="margin:0">Р›РѕС‚РѕРІ: <b>${Net.open.length}</b> РѕС‚ ${sellers} РїСЂРѕРґР°РІС†РѕРІ. Р—Р°Р±Р»РѕРєРёСЂРѕРІР°РЅРѕ РёРіСЂРѕРєРѕРІ: <b>${bans}</b>.</p>
    <p class="muted" style="margin:0;font-size:13.5px">РЎРЅСЏС‚С‹Рµ Р»РѕС‚С‹ РІРѕР·РІСЂР°С‰Р°СЋС‚СЃСЏ РїСЂРѕРґР°РІС†Р°Рј РІ РіР°СЂР°Р¶. РћС‚РґРµР»СЊРЅС‹Р№ Р»РѕС‚ РјРѕР¶РЅРѕ СѓР±СЂР°С‚СЊ РїСЂСЏРјРѕ РЅР° СЂС‹РЅРєРµ РєРЅРѕРїРєРѕР№ В«РЈР±СЂР°С‚СЊВ».</p>
    <div class="row"><button class="btn ${armed==='ad-wipe'?'armed':''}" data-act="ad-wipe" ${Net.open.length?'':'disabled'}>${armed==='ad-wipe'?'РўРѕС‡РЅРѕ СЃРЅСЏС‚СЊ РІСЃРµ '+Net.open.length+'?':'РЎРЅСЏС‚СЊ РІСЃРµ Р»РѕС‚С‹'}</button></div>`;
}
async function loadPlayers(){const r=await run('adm.players',{},{quiet:true,free:true});if(r){Net.players=r.list||[];Net.playersLoaded=true;if(tab==='admin'){renderAdminPlayers();renderAdminMarket()}}}
async function loadCodes(){const r=await run('adm.codes',{},{quiet:true,free:true});if(r){Net.codes=r.list||[];if(tab==='admin')renderAdminCodes()}}
function renderAdminPlayers(){
  const box=$('ad-players');if(!box)return;
  const head=`<div class="sec-h"><div><p class="eyebrow" style="margin:0 0 4px">РРіСЂРѕРєРё В· ${Net.players.length}</p><h3 class="h3">РџРѕРґР°СЂРєРё Рё Р±Р»РѕРєРёСЂРѕРІРєРё</h3><p class="lede" style="margin-top:4px;font-size:14px">РџРѕРґР°СЂРѕРє РїСЂРёС…РѕРґРёС‚ СЃСЂР°Р·Сѓ, РёРіСЂРѕРє СѓРІРёРґРёС‚ СЃРѕРѕР±С‰РµРЅРёРµ РїСЂРё РІС…РѕРґРµ. Р‘Р»РѕРєРёСЂРѕРІРєР° Р·Р°РєСЂС‹РІР°РµС‚ РµРјСѓ СЂС‹РЅРѕРє Рё СѓР±РёСЂР°РµС‚ РёР· С‚РѕРїР°.</p></div><div class="row"><button class="btn sm" data-act="ad-pl-load">РћР±РЅРѕРІРёС‚СЊ</button><button class="btn sm primary" data-act="gift-open" data-to="*">РџРѕРґР°СЂРѕРє РІСЃРµРј</button></div></div>`;
  if(!Net.playersLoaded){box.innerHTML=head+'<p class="muted" style="margin:0">Р—Р°РіСЂСѓР¶Р°РµРј СЃРїРёСЃРѕРєвЂ¦</p>';return}
  const list=Net.players;
  if(!list.length){box.innerHTML=head+'<p class="muted" style="margin:0">РРіСЂРѕРєРѕРІ РїРѕРєР° РЅРµС‚.</p>';return}
  box.innerHTML=head+`<div class="tablewrap"><table class="lb"><thead><tr><th>РРіСЂРѕРє</th><th>РЈСЂ.</th><th>Р“Р°СЂР°Р¶</th><th>Р‘С‹Р» РІ РёРіСЂРµ</th><th></th></tr></thead><tbody>${list.map(p=>{
    const me=p.uid===Net.me.uid,k='ban'+p.uid;
    return `<tr class="${me?'me':''}"><td class="nick">${esc(p.nick)}${badge(p.uid)}${p.banned?'<span class="banned">Р±Р°РЅ</span>':''}${p.tg?' <span class="muted">TG</span>':''}${me?' <span class="muted">(РІС‹)</span>':''}</td><td>${p.lvl}</td><td>${fmt(p.worth)}</td><td>${agoText(p.t)}</td>
    <td class="acts"><button class="btn sm" data-act="gift-open" data-to="${esc(p.uid)}">РџРѕРґР°СЂРѕРє</button>${me?'':`<button class="btn sm ${armed===k?'armed':''}" data-act="ban" data-id="${esc(p.uid)}">${p.banned?'Р Р°Р·Р±Р°РЅРёС‚СЊ':armed===k?'РўРѕС‡РЅРѕ?':'Р‘Р°РЅ'}</button>`}</td></tr>`}).join('')}</tbody></table></div>`;
}
function renderAdminShop(){
  const box=$('sh-admin');if(!box)return;
  if(!adShopBuilt){
    box.innerHTML=`<div class="panel admin"><div><p class="eyebrow" style="margin:0 0 4px">РџСЂРёС‘Рј РґРѕРЅР°С‚Р°</p><h3 class="h3">Р РµРєРІРёР·РёС‚С‹ Рё РїСЂРѕРјРѕРєРѕРґС‹</h3></div>
      <div class="field"><label for="ad-text">РљСѓРґР° РїРµСЂРµРІРѕРґРёС‚СЊ РѕРїР»Р°С‚Сѓ</label><textarea class="inp" id="ad-text" maxlength="600" placeholder="РќР°РїСЂРёРјРµСЂ: РїРµСЂРµРІРѕРґ РїРѕ РЅРѕРјРµСЂСѓ С‚РµР»РµС„РѕРЅР° РІ С‚Р°РєРѕР№-С‚Рѕ Р±Р°РЅРє, РїРѕР»СѓС‡Р°С‚РµР»СЊ С‚Р°РєРѕР№-С‚Рѕ"></textarea></div>
      <div class="field"><label for="ad-link">РЎСЃС‹Р»РєР° РЅР° СЃС‚СЂР°РЅРёС†Сѓ РѕРїР»Р°С‚С‹, РЅРµРѕР±СЏР·Р°С‚РµР»СЊРЅРѕ</label><input class="inp" id="ad-link" type="url" placeholder="https://вЂ¦" maxlength="300"></div>
      <div class="row"><button class="btn" data-act="ad-save">РЎРѕС…СЂР°РЅРёС‚СЊ РґР»СЏ РёРіСЂРѕРєРѕРІ</button><span class="muted" style="font-size:13px">Р­С‚РѕС‚ С‚РµРєСЃС‚ СѓРІРёРґСЏС‚ РІСЃРµ РёРіСЂРѕРєРё РІРѕ РІРєР»Р°РґРєРµ В«Р”РѕРЅР°С‚В».</span></div>
      <hr style="border:0;border-top:1px solid var(--line);margin:0">
      <div class="row"><div class="field" style="width:160px"><label for="ad-gold">Р“РѕР»РґС‹ РІ РєРѕРґРµ</label><input class="inp num" id="ad-gold" type="number" min="1" max="100000" value="330"></div><div class="chips" style="align-self:end">${PACKS.map(p=>`<button class="chip" data-act="ad-preset" data-g="${p.g}">${fmtN(p.g)}</button>`).join('')}</div><button class="btn goldy" data-act="ad-code" style="align-self:end">РЎРѕР·РґР°С‚СЊ РєРѕРґ</button></div>
      <div id="ad-codes"></div></div>`;
    adShopBuilt=true;
  }
  const t=$('ad-text'),l=$('ad-link'),sh=Net.cfg.shop;
  if(t&&!t.dataset.touched){t.value=sh?sh.payText||'':'';l.value=sh?sh.payLink||'':''}
  renderAdminCodes();
}
function renderAdminCodes(){
  const box=$('ad-codes');if(!box)return;
  const last=Net.lastCode?`<div class="note gift"><p>РќРѕРІС‹Р№ РєРѕРґ: <code style="font:600 17px ui-monospace,Menlo,monospace;user-select:all">${esc(Net.lastCode)}</code><br><span class="muted" style="font-size:13px">РћС‚РїСЂР°РІСЊС‚Рµ РµРіРѕ РёРіСЂРѕРєСѓ. РљРѕРґ РѕРґРЅРѕСЂР°Р·РѕРІС‹Р№.</span></p><button class="btn sm" data-act="copy" data-text="${esc(Net.lastCode)}">РљРѕРїРёСЂРѕРІР°С‚СЊ</button></div>`:'';
  const list=Net.codes.slice(0,40);
  box.innerHTML=last+(list.length?`<p class="eyebrow" style="margin:8px 0">Р’С‹РґР°РЅРЅС‹Рµ РєРѕРґС‹</p><div class="codes">${list.map(c=>`<div><code>${esc(c.code)}</code><span>${gem(c.gold)}</span><span class="${c.used?'tag-ok':'tag-wait'}">${c.used?'Р°РєС‚РёРІРёСЂРѕРІР°РЅ':'РЅРµ Р°РєС‚РёРІРёСЂРѕРІР°РЅ'}</span></div>`).join('')}</div>`:'<p class="muted" style="margin:0">РљРѕРґРѕРІ РїРѕРєР° РЅРµС‚.</p>');
}
function openGiftSheet(to){
  const p=to==='*'?null:Net.players.find(x=>x.uid===to);
  const who=to==='*'?'РІСЃРµРј РёРіСЂРѕРєР°Рј':'РёРіСЂРѕРєСѓ '+(p?p.nick:'');
  openSheet(`<div class="sc" role="dialog" aria-modal="true" aria-labelledby="gf-t"><h3 id="gf-t">РџРѕРґР°СЂРѕРє ${esc(who)}</h3>
    <div class="row"><div class="field grow"><label for="gf-m">Р СѓР±Р»Рё</label><input class="inp num" id="gf-m" type="number" min="0" value="10000"></div><div class="field grow"><label for="gf-g">Р“РѕР»РґР°</label><input class="inp num" id="gf-g" type="number" min="0" value="0"></div></div>
    <div class="row"><div class="field grow"><label for="gf-k">РљР»СЋС‡</label><select class="inp" id="gf-k"><option value="">Р‘РµР· РєР»СЋС‡Р°</option>${Object.keys(KEYN).map(k=>`<option value="${k}">${KEYN[k]}</option>`).join('')}</select></div><div class="field" style="width:90px"><label for="gf-kn">РЎРєРѕР»СЊРєРѕ</label><input class="inp num" id="gf-kn" type="number" min="1" max="100" value="1"></div></div>
    <div class="field"><label for="gf-note">РЎРѕРѕР±С‰РµРЅРёРµ, РЅРµРѕР±СЏР·Р°С‚РµР»СЊРЅРѕ</label><input class="inp" id="gf-note" maxlength="80" placeholder="РЎРїР°СЃРёР±Рѕ, С‡С‚Рѕ РёРіСЂР°РµС‚Рµ!"></div>
    ${to==='*'?'<p class="muted" style="margin:0;font-size:13.5px">РџРѕРґР°СЂРѕРє РїРѕР»СѓС‡Р°С‚ РІСЃРµ, РєС‚Рѕ РѕС‚РєСЂРѕРµС‚ РёРіСЂСѓ РІ Р±Р»РёР¶Р°Р№С€РёРµ 7 РґРЅРµР№, РєР°Р¶РґС‹Р№ РїРѕ РѕРґРЅРѕРјСѓ СЂР°Р·Сѓ.</p>':''}
    <div class="row"><button class="btn ghost" data-act="sheet-close">РћС‚РјРµРЅР°</button><span style="flex:1"></span><button class="btn primary" data-act="gift-send" data-to="${esc(to)}">РћС‚РїСЂР°РІРёС‚СЊ</button></div></div>`);
}
function openAdminLogin(){
  openSheet(`<div class="sc" role="dialog" aria-modal="true" aria-labelledby="al-t"><h3 id="al-t">Р’С…РѕРґ РґР»СЏ РІР»Р°РґРµР»СЊС†Р°</h3>
    <p class="muted" style="margin:0">Р’РІРµРґРёС‚Рµ РєР»СЋС‡ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°. РћРЅ Р·Р°РґР°С‘С‚СЃСЏ РЅР° СЃРµСЂРІРµСЂРµ РІ РЅР°СЃС‚СЂРѕР№РєРµ ADMIN_KEY. РџРѕСЃР»Рµ РІС…РѕРґР° РїРѕСЏРІРёС‚СЃСЏ РІРєР»Р°РґРєР° В«РђРґРјРёРЅВ».</p>
    <div class="field"><label for="al-key">РљР»СЋС‡ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°</label><input class="inp" id="al-key" type="password" autocomplete="off"></div>
    <div class="row"><button class="btn ghost" data-act="sheet-close">РћС‚РјРµРЅР°</button><span style="flex:1"></span><button class="btn primary" data-act="al-go">Р’РѕР№С‚Рё</button></div></div>`,{focus:'al-key'});
}
/* ---------- СЃРѕР±С‹С‚РёСЏ ---------- */
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
      if(S.gold<SEASON.premium){go('shop');return toast('РќРµ С…РІР°С‚Р°РµС‚ '+gem(SEASON.premium-S.gold))}
      if(needArm('premium'))return;armed='';run('premium');break;
    case'buy-key':run('buyKey',{k:b.dataset.k});break;
    case'exch':run('exch',{n:+b.dataset.n});break;
    case'car':{
      const c=L.CARS[id];if(!c)return;
      if(!S.cars.includes(id)&&c.cost){if(S.gold<c.cost)return toast('РќРµ С…РІР°С‚Р°РµС‚ '+gem(c.cost-S.gold));if(needArm('car'+id))return}
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
      if(Net.status!=='on')return toast('РЎРЅР°С‡Р°Р»Р° РґРѕР¶РґРёС‚РµСЃСЊ РїРѕРґРєР»СЋС‡РµРЅРёСЏ Рє СЃРµСЂРІРµСЂСѓ');
      try{const j=await call('admin',{key:$('al-key').value});Net.me=j.me;closeSheet();toast('Р’С‹ РІРѕС€Р»Рё РєР°Рє Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ');go('admin')}
      catch(err){toast(err.message)}break}
    case'ad-bot':run('adm.bot');break;
    // Р°РґРјРёРЅРєР°
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

/* ---------- Р·Р°РїСѓСЃРє ---------- */
renderHow();
const startTab=(location.hash||'').slice(1);
go(TABS.includes(startTab)?startTab:'cases',true);
idleReel();
connect();
