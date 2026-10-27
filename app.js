/* Vybivanie nomerov 2.0 */
(function(){
"use strict";
/* ================= \u043e\u0441\u043d\u043e\u0432\u0430: \u0443\u0442\u0438\u043b\u0438\u0442\u044b, \u0438\u043a\u043e\u043d\u043a\u0438, \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435, \u043e\u0442\u043a\u043b\u0438\u043a ================= */
const $=id=>document.getElementById(id);
const qs=(s,r)=>(r||document).querySelector(s);
const qsa=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const {fmt,fmtN,gem,keyN,plateText,appraise,MATS,WEARS,FONTS,SKINS,STICKERS,COLORS,WHEELS,KITS,TIERS,COUNTRY,COUNTRIES}=L;
const now=()=>Date.now();
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const lsDel=k=>{try{localStorage.removeItem(k)}catch(e){}};
const TOKEN_KEY='nomera2_token';
const TGW=window.Telegram&&window.Telegram.WebApp;
const TG=TGW&&TGW.initData?TGW:null;
const tgVer=v=>{try{return TG&&TG.isVersionAtLeast&&TG.isVersionAtLeast(v)}catch(e){return false}};

/* ---------- \u0438\u043a\u043e\u043d\u043a\u0438 (\u0441\u0432\u043e\u0438, \u0432 \u0441\u0442\u0438\u043b\u0435 SF Symbols) ---------- */
const P={
  case:'<path d="M12 2.6 20.6 7 12 11.4 3.4 7Z"/><path d="M2.9 8.4 11.2 12.7V21.8L2.9 17.4Z" opacity=".85"/><path d="M21.1 8.4 12.8 12.7V21.8L21.1 17.4Z" opacity=".65"/>',
  games:'<path fill-rule="evenodd" d="M7.6 6h8.8c2.9 0 5 2.3 5.4 5.4l.6 4.8c.3 2.4-1.3 4.1-3.3 4.1-1.2 0-2.1-.6-2.8-1.6l-1-1.5c-.4-.6-1.1-1-1.8-1h-3c-.7 0-1.4.4-1.8 1l-1 1.5c-.7 1-1.6 1.6-2.8 1.6-2 0-3.6-1.7-3.3-4.1l.6-4.8C2.6 8.3 4.7 6 7.6 6Zm-.85 3.4v1.6H5.2v1.6h1.55v1.6h1.6v-1.6H9.9v-1.6H8.35V9.4ZM16.1 9.6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm2.1 2.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z"/>',
  invest:'<rect x="3.5" y="12.5" width="4" height="8" rx="1.3"/><rect x="10" y="8" width="4" height="12.5" rx="1.3"/><rect x="16.5" y="3.5" width="4" height="17" rx="1.3"/>',
  season:'<path d="M7 3.2h10v1.6h3.2v2.6c0 2.6-1.9 4.7-4.4 5.1a5 5 0 0 1-2.9 2.7V18h2.6c.6 0 1 .4 1 1v1.8H7.5V19c0-.6.4-1 1-1h2.6v-2.8a5 5 0 0 1-2.9-2.7C5.7 12.1 3.8 10 3.8 7.4V4.8H7Zm-1.5 3.2v1c0 1.4.8 2.6 1.9 3.2-.2-.6-.4-1.2-.4-1.9V6.4Zm11.5 0v2.3c0 .7-.1 1.3-.4 1.9 1.1-.6 1.9-1.8 1.9-3.2v-1Z"/>',
  account:'<circle cx="12" cy="8" r="4.3"/><path d="M3.8 20.2c0-3.9 3.7-6.6 8.2-6.6s8.2 2.7 8.2 6.6c0 .5-.4.8-.8.8H4.6c-.4 0-.8-.3-.8-.8Z"/>',
  gem:'<path d="M7 3.5h10l4.3 5.4L12 20.8 2.7 8.9Z"/><path d="M2.7 8.9h18.6M9 3.5 7.6 8.9 12 20.8l4.4-11.9L15 3.5" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1.1"/>',
  key:'<path d="M14.5 3a6.5 6.5 0 0 0-6.2 8.5L3 16.8V21h4.2v-2.2h2.2v-2.2h2.2l1.2-1.2A6.5 6.5 0 1 0 14.5 3Zm2 3.2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Z"/>',
  chev:'<path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  back:'<path d="m15 4.5-7.5 7.5 7.5 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  close:'<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  share:'<path d="M12 3v11M7.5 7.5 12 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M16 5.5V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  star:'<path d="M12 2.8l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.7l-5.4 2.9 1.1-6.1-4.5-4.3 6.1-.8Z"/>',
  plus:'<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  lock:'<path d="M7.5 10V8a4.5 4.5 0 0 1 9 0v2h.5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm2.2 0h4.6V8a2.3 2.3 0 0 0-4.6 0Z"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  pin:'<path d="M15.5 3.5 20.5 8.5l-2.2.5-3.4 3.4.3 4.1-1.6 1.6-3.3-3.3L5 20.1 3.9 19l5.3-5.3-3.3-3.3L7.5 8.8l4.1.3L15 5.7Z"/>',
  gear:'<path fill-rule="evenodd" d="M10.3 2.5h3.4l.5 2.6 1.6.9 2.5-.9 1.7 2.9-2 1.8v1.9l2 1.7-1.7 3-2.5-.9-1.6.9-.5 2.6h-3.4l-.5-2.6-1.6-.9-2.5.9-1.7-3 2-1.7v-1.9l-2-1.8 1.7-2.9 2.5.9 1.6-.9ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>',
  music:'<path d="M9 18.2V6.4l11-2.4v11.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="6.5" cy="18.2" r="2.8"/><circle cx="17.5" cy="15.7" r="2.8"/>',
  sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  bank:'<path d="M12 2.8 21 7.6v1.6H3V7.6Z"/><rect x="4.6" y="10.6" width="2.6" height="7"/><rect x="10.7" y="10.6" width="2.6" height="7"/><rect x="16.8" y="10.6" width="2.6" height="7"/><rect x="3" y="18.6" width="18" height="2.6" rx=".6"/>',
  cart:'<path d="M3 4h2.4l2.1 10.2c.1.5.6.8 1.1.8h8.6c.5 0 .9-.3 1-.8L20 7.5H6.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="19.3" r="1.7"/><circle cx="17" cy="19.3" r="1.7"/>',
  tag:'<path d="M3.5 4.8v6.4l9.2 9.2a1.6 1.6 0 0 0 2.3 0l5.4-5.4a1.6 1.6 0 0 0 0-2.3L11.2 3.5H4.8c-.7 0-1.3.6-1.3 1.3Zm4.3 1.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>',
  flag:'<path d="M5 21V4M5 4.5c4-2 6 2 10 0s4 0 4 0v8.5s-1-1.5-4 0-6-2-10 0" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>',
  up:'<path d="M12 20V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>',
  tap:'<path d="M9.5 11V5.5a1.8 1.8 0 0 1 3.6 0V10l4.6.9c1.3.3 2.2 1.5 2 2.8l-.7 4.9a3 3 0 0 1-3 2.6h-4.4c-.9 0-1.7-.4-2.3-1.1l-3.7-4.6a1.6 1.6 0 0 1 2.4-2.1Z"/><path d="M6.3 7.3a5 5 0 0 1 10-1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>',
  swap:'<path d="M7 4 3.5 7.5 7 11M3.5 7.5H17M17 13l3.5 3.5L17 20M20.5 16.5H7" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>',
  bag:'<path d="M5 8h14l-1 12a1.4 1.4 0 0 1-1.4 1.3H7.4A1.4 1.4 0 0 1 6 20Z"/><path d="M8.8 10V7a3.2 3.2 0 0 1 6.4 0v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  userplus:'<circle cx="9.5" cy="8" r="4"/><path d="M2.5 20c0-3.6 3.2-6.2 7-6.2s7 2.6 7 6.2c0 .5-.4.8-.8.8H3.3c-.4 0-.8-.3-.8-.8Z"/><path d="M19 7.5v6M16 10.5h6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  crown:'<path d="M3 7.5 7.5 12 12 5l4.5 7L21 7.5l-1.8 11H4.8Z"/>',
  fire:'<path d="M12 21.5c-4 0-7-2.8-7-6.6 0-3.4 2.5-5.5 3.8-8.2.4 1.7 1.2 2.8 2.2 3.4.2-3.3 1.9-6 4.3-7.6-.4 2.8.7 4.5 2.1 6.3 1.3 1.7 2.6 3.6 2.6 6.1 0 3.8-3 6.6-8 6.6Z"/>',
  eye:'<path d="M12 5.5c5 0 8.6 4.2 9.5 6.5-.9 2.3-4.5 6.5-9.5 6.5S3.4 14.3 2.5 12C3.4 9.7 7 5.5 12 5.5Zm0 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/>',
  trash:'<path d="M9 3.5h6l.6 1.5H20v2H4V5h4.4ZM5.6 8.5h12.8l-.9 11.2a1.6 1.6 0 0 1-1.6 1.5H8.1a1.6 1.6 0 0 1-1.6-1.5Z"/>',
  report:'<path d="M12 3 2.5 20h19Z"/><path d="M12 9.5v5M12 17v.4" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"/>',
  pencil:'<path d="M15.6 4.2a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1 0 2.8L9 19.2l-4.9 1 1-4.9Z"/>',
  car:'<path d="M5.2 10.4 7 6.3A2.2 2.2 0 0 1 9 5h6a2.2 2.2 0 0 1 2 1.3l1.8 4.1A2.6 2.6 0 0 1 21 13v4.2a1 1 0 0 1-1 1h-1.2a2 2 0 0 1-3.6 0H8.8a2 2 0 0 1-3.6 0H4a1 1 0 0 1-1-1V13a2.6 2.6 0 0 1 2.2-2.6Zm2.4-.4h8.8l-1.3-3H8.9Z"/>',
  bike:'<circle cx="5.5" cy="16.5" r="3.6" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="18.5" cy="16.5" r="3.6" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M5.5 16.5 9 10h6l3.5 6.5M9 10 7.5 7h-2M15 10l-1.5-3.5h2.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  sparkle:'<path d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5-4.6.6-6.9 2.9-7.5 7.5-.6-4.6-2.9-6.9-7.5-7.5 4.6-.6 6.9-2.9 7.5-7.5Z"/><path d="M19 15c.3 2 1.2 2.9 3 3.2-1.8.3-2.7 1.2-3 3.2-.3-2-1.2-2.9-3-3.2 1.8-.3 2.7-1.2 3-3.2Z" opacity=".7"/>',
  sun:'<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  gift:'<rect x="3.5" y="8" width="17" height="4.5" rx="1"/><path d="M5 12.5h14V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z"/><path d="M12 8v13M12 8C9.5 8 7 7.5 7 5.6 7 4 9.2 3.4 12 8Zm0 0c2.5 0 5-.5 5-2.4C17 4 14.8 3.4 12 8Z" fill="none" stroke="var(--bg,#000)" stroke-width="1.6"/>',
  mega:'<path d="M3.5 9.5h3l9-5v15l-9-5h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"/><path d="m7 14.5 1.5 5h3l-1.6-5" /><path d="M18.5 9a3.5 3.5 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  shield:'<path d="M12 2.5 20 5.5v6c0 5-3.4 8.8-8 10-4.6-1.2-8-5-8-10v-6Z"/>',
  clock:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  sticker:'<path d="M5 3.5h14A1.5 1.5 0 0 1 20.5 5v8.5l-7 7H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5Z"/><path d="M20.5 13.5h-5.5a1.5 1.5 0 0 0-1.5 1.5v5.5" fill="none" stroke="var(--bg,#000)" stroke-width="1.5" opacity=".5"/>',
  dice:'<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.3" cy="8.3" r="1.6" fill="var(--bg,#000)"/><circle cx="15.7" cy="15.7" r="1.6" fill="var(--bg,#000)"/><circle cx="12" cy="12" r="1.6" fill="var(--bg,#000)"/>',
  bolt:'<path d="M13.5 2 4.5 13.5h6l-1 8.5 9-11.5h-6Z"/>',
  speed:'<path d="M12 4a9 9 0 0 0-9 9c0 1.9.6 3.7 1.6 5.2h14.8A9 9 0 0 0 12 4Zm4.6 4.7-3.3 5.4a1.8 1.8 0 1 1-2.5-2.3Z"/>',
  hourglass:'<path d="M6 2.8h12v2c0 3-2.2 5-4.4 7.2 2.2 2.2 4.4 4.2 4.4 7.2v2H6v-2c0-3 2.2-5 4.4-7.2C8.2 9.8 6 7.8 6 4.8Z"/>',
  info:'<circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.4v.4" stroke="var(--bg,#000)" stroke-width="2.4" stroke-linecap="round"/>',
  person2:'<circle cx="8.5" cy="8" r="3.6"/><circle cx="16.5" cy="9" r="3"/><path d="M1.8 19.5c0-3.3 3-5.6 6.7-5.6s6.7 2.3 6.7 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7Z"/><path d="M16.2 13.6c3.3 0 6 2 6 5 0 .4-.3.7-.7.7h-4.3c0-2.2-.7-4-2.3-5.4.4-.2.9-.3 1.3-.3Z"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="m15.5 15.5 5 5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  chart:'<path d="M3.5 18.5 9 12.5l4 3.5 7.5-9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  ticket:'<path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h14A1.5 1.5 0 0 1 20.5 7v2.5a2.5 2.5 0 0 0 0 5V17a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17v-2.5a2.5 2.5 0 0 0 0-5Z"/>',
  play:'<path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5Z"/>',
  pause:'<rect x="5.5" y="4" width="4.5" height="16" rx="1.4"/><rect x="14" y="4" width="4.5" height="16" rx="1.4"/>',
  brake:'<rect x="4" y="5" width="16" height="14" rx="3.5"/><path d="M8 9h8M8 12h8M8 15h8" stroke="var(--bg,#000)" stroke-width="1.6" opacity=".55"/>',
  gas:'<rect x="6.5" y="2.5" width="11" height="19" rx="3.5"/><path d="M9.5 6.5h5M9.5 10h5M9.5 13.5h5M9.5 17h5" stroke="var(--bg,#000)" stroke-width="1.6" opacity=".55"/>',
  fuel:'<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3h7A1.5 1.5 0 0 1 14 4.5V20H4Zm2.5 1.5v4h5V6Z"/><path d="M14 8h2.2a1.3 1.3 0 0 1 1.3 1.3v7.2a1.5 1.5 0 0 0 3 0V8.5L18 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  medal:'<path d="M7 2.5h4l1 4-3 1.5ZM17 2.5h-4l-1 4 3 1.5Z" opacity=".7"/><circle cx="12" cy="14.5" r="6.5"/><path d="M12 11l1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3Z" fill="var(--bg,#000)" opacity=".5"/>'
};
const ic=(n,cls)=>'<svg class="ic'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'+(P[n]||'')+'</svg>';
const GOLD=n=>'<span class="num">'+fmtN(n)+'</span>'+ic('gem');
const STAR=n=>ic('star')+'<span class="num">'+fmtN(n)+'</span>';

/* ---------- \u043e\u0442\u043a\u043b\u0438\u043a: \u0432\u0438\u0431\u0440\u0430\u0446\u0438\u044f \u0438 \u0437\u0432\u0443\u043a ---------- */
const Haptic={
  tap(){try{TGW&&TGW.HapticFeedback&&TGW.HapticFeedback.impactOccurred('light')}catch(e){}},
  soft(){try{TGW&&TGW.HapticFeedback&&TGW.HapticFeedback.impactOccurred('soft')}catch(e){}},
  heavy(){try{TGW&&TGW.HapticFeedback&&TGW.HapticFeedback.impactOccurred('heavy')}catch(e){}},
  tick(){try{TGW&&TGW.HapticFeedback&&TGW.HapticFeedback.selectionChanged()}catch(e){}},
  ok(){try{TGW&&TGW.HapticFeedback&&TGW.HapticFeedback.notificationOccurred('success')}catch(e){}},
  err(){try{TGW&&TGW.HapticFeedback&&TGW.HapticFeedback.notificationOccurred('error')}catch(e){}}
};
const Snd=(()=>{
  let ac=null;const on=()=>lsGet('nomera2_snd')!=='0';
  function ctx(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){ac=null}}if(ac&&ac.state==='suspended')ac.resume().catch(()=>{});return ac}
  function blip(f,d,type,vol,slide){if(!on())return;const a=ctx();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,a.currentTime);if(slide)o.frequency.exponentialRampToValueAtTime(slide,a.currentTime+d);g.gain.setValueAtTime(vol||.06,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+d);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+d+.02)}
  return{
    on,set(v){lsSet('nomera2_snd',v?'1':'0')},ctx,
    tick(){blip(1800,.03,'square',.025)},
    win(lv){const a=[523,659,784,1047,1319];for(let i=0;i<=Math.min(4,lv+1);i++)setTimeout(()=>blip(a[i],.18,'triangle',.07),i*90)},
    coin(){blip(1320,.08,'square',.04);setTimeout(()=>blip(1760,.12,'square',.04),70)},
    bad(){blip(220,.25,'sawtooth',.05,110)},
    pop(){blip(660,.06,'sine',.06,990)}
  };
})();

/* ---------- \u0432\u0440\u0435\u043c\u044f \u0438 \u0441\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u044f ---------- */
function plural(n,a,b,c){n=Math.abs(n)%100;const m=n%10;return n>10&&n<20?c:m>1&&m<5?b:m===1?a:c}
function ago(t){const s=Math.max(0,(now()-t)/1000);if(s<60)return'\u0442\u043e\u043b\u044c\u043a\u043e \u0447\u0442\u043e';const m=Math.floor(s/60);if(m<60)return m+' \u043c\u0438\u043d \u043d\u0430\u0437\u0430\u0434';const h=Math.floor(m/60);if(h<24)return h+' \u0447 \u043d\u0430\u0437\u0430\u0434';const d=Math.floor(h/24);return d+' '+plural(d,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439')+' \u043d\u0430\u0437\u0430\u0434'}
function left(ms){ms=Math.max(0,ms);const m=Math.ceil(ms/60000);if(m<60)return m+' \u043c\u0438\u043d';const h=Math.floor(m/60);if(h<48)return h+' \u0447 '+(m%60)+' \u043c\u0438\u043d';const d=Math.floor(h/24);return d+' '+plural(d,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439')}
function dateRu(t){return new Date(t).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}

/* ---------- \u0442\u0435\u043c\u0430 ---------- */
const Theme={
  get(){return lsGet('nomera2_theme')||'system'},
  set(v){lsSet('nomera2_theme',v);Theme.apply()},
  resolved(){const v=Theme.get();if(v!=='system')return v;if(TG&&TG.colorScheme)return TG.colorScheme==='light'?'light':'dark';try{return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}catch(e){return'dark'}},
  apply(){
    const t=Theme.resolved();document.documentElement.setAttribute('data-theme',t);
    const bg=t==='light'?'#f2f2f7':'#000000';
    try{const m=qs('meta[name=theme-color]');if(m)m.setAttribute('content',bg)}catch(e){}
    try{if(TG){if(TG.setHeaderColor)TG.setHeaderColor(bg);if(TG.setBackgroundColor)TG.setBackgroundColor(bg);if(TG.setBottomBarColor)TG.setBottomBarColor(bg)}}catch(e){}
    document.dispatchEvent(new Event('themechange'));
  }
};
Theme.apply();
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{if(Theme.get()==='system'&&!TG)Theme.apply()})}catch(e){}
if(TG){
  try{TG.ready();TG.expand();if(TG.disableVerticalSwipes)TG.disableVerticalSwipes();if(TG.enableClosingConfirmation&&false)TG.enableClosingConfirmation()}catch(e){}
  try{TG.onEvent('themeChanged',()=>{if(Theme.get()==='system')Theme.apply()})}catch(e){}
}

/* ---------- \u0442\u0435\u043a\u0441\u0442\u0443\u0440\u0430 \u0438\u0437\u043d\u043e\u0441\u0430 \u0434\u043b\u044f \u043d\u043e\u043c\u0435\u0440\u043e\u0432: \u0433\u0435\u043d\u0435\u0440\u0438\u0440\u0443\u0435\u0442\u0441\u044f \u043e\u0434\u0438\u043d \u0440\u0430\u0437 ---------- */
const WEAR_TEX=(()=>{
  try{
    const cv=document.createElement('canvas');cv.width=256;cv.height=64;const c=cv.getContext('2d');
    let s=12345;const r=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296};
    for(let i=0;i<900;i++){const a=r()*.5;c.fillStyle='rgba(60,50,40,'+a+')';const w=1+r()*2.4;c.fillRect(r()*256,r()*64,w,w)}
    c.strokeStyle='rgba(40,35,30,.55)';c.lineCap='round';
    for(let i=0;i<34;i++){c.lineWidth=.4+r()*1.2;c.beginPath();const x=r()*256,y=r()*64,l=8+r()*46,a=(r()-.5)*.9;c.moveTo(x,y);c.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);c.stroke()}
    for(let i=0;i<10;i++){const g=c.createRadialGradient(0,0,0,0,0,14+r()*20);g.addColorStop(0,'rgba(90,70,50,.35)');g.addColorStop(1,'rgba(90,70,50,0)');c.save();c.translate(r()*256,r()*64);c.fillStyle=g;c.fillRect(-40,-40,80,80);c.restore()}
    return'url('+cv.toDataURL()+')';
  }catch(e){return'none'}
})();
document.documentElement.style.setProperty('--wtex',WEAR_TEX);

/* ================= \u043d\u043e\u043c\u0435\u0440\u0430: \u043e\u0442\u0440\u0438\u0441\u043e\u0432\u043a\u0430, \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b, \u043e\u0441\u043c\u043e\u0442\u0440 2.5D ================= */
const FL={ru:'<i class="fl fru"></i>',ua:'<i class="fl fua"></i>',kz:'<i class="fl fkz"></i>'};
const EU_STARS=(()=>{let s='<svg class="stars12" viewBox="0 0 12 12">';for(let i=0;i<12;i++){const a=i*Math.PI/6;s+='<circle cx="'+(6+Math.cos(a)*4.3).toFixed(2)+'" cy="'+(6+Math.sin(a)*4.3).toFixed(2)+'" r=".85" fill="#ffd200"/>'}return s+'</svg>'})();
const US_FT={NV:'The Silver State',CA:'Golden State',NY:'Empire State',FL:'Sunshine State',HI:'Aloha State',TX:'Lone Star State',IL:'Land of Lincoln',WA:'Evergreen State',AZ:'Grand Canyon State',NJ:'Garden State',MI:'Great Lakes',GA:'Peach State'};
const glitCache={};
function glitter(pt){
  if(glitCache[pt])return glitCache[pt];
  let s=(pt*2654435761)>>>0||1;const r=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296};
  const hues=[0,45,190,280,320];const g=[];
  for(let i=0;i<22;i++){const x=(r()*100).toFixed(1),y=(r()*100).toFixed(1),z=(.6+r()*1.6).toFixed(2),h=hues[Math.floor(r()*hues.length)];g.push('radial-gradient(circle at '+x+'% '+y+'%,hsla('+h+',100%,85%,.95) 0,hsla('+h+',100%,70%,.5) '+z+'%,transparent '+(+z+1.2).toFixed(2)+'%)')}
  g.push('linear-gradient(115deg,hsla('+(pt%360)+',90%,80%,.18),transparent 60%)');
  return glitCache[pt]=g.join(',');
}
function plateVars(it){
  const pt=it.pt|0,f=+it.f||0;
  const v=['--ph:'+((pt*137)%360),'--pa:'+(60+(pt*7)%120)+'deg','--wear:'+Math.min(.95,f*1.05).toFixed(3),'--wpx:'+((pt*13)%100)+'%','--wpy:'+((pt*29)%100)+'%'];
  if(it.m===1)v.push('--glit:'+glitter(pt));
  return v.join(';');
}
function plateInner(pl){
  switch(pl.c){
    case'ru':return'<div class="pm"><span>'+pl.p+'</span><span class="dg">'+pl.d+'</span><span>'+pl.s+'</span></div><div class="pr"><b class="rn n'+pl.r.length+'">'+pl.r+'</b><span class="rc"><em>RUS</em>'+FL.ru+'</span></div>';
    case'ua':return'<div class="ps ua">'+FL.ua+'<em>UA</em></div><div class="pm"><span>'+pl.p+'</span><span class="dg">'+pl.d+'</span><span>'+pl.s+'</span></div>';
    case'kz':return'<div class="ps kz">'+FL.kz+'<em>KZ</em></div><div class="pm"><span class="dg">'+pl.d+'</span><span>'+pl.s+'</span></div><div class="pr kzr"><b class="rn n2">'+pl.r+'</b></div>';
    case'us':{const st=L.RMAP.us[pl.r];return'<div class="us-st">'+esc(st?st[1]:pl.r)+'</div><div class="pm"><span>'+pl.s+'</span><span>'+pl.d+'</span></div><div class="us-ft">'+esc(US_FT[pl.r]||'')+'</div>'}
    case'eu':{
      let m;
      if(pl.r==='D')m='<span>'+pl.p+'</span><span class="de-seal"><i></i><i></i></span><span>'+pl.s+'</span><span class="dg">'+pl.d+'</span>';
      else if(pl.r==='E')m='<span class="dg">'+pl.d+'</span><span>'+pl.s+'</span>';
      else if(pl.r==='F')m='<span>'+pl.p+'-'+pl.d+'-'+pl.s+'</span>';
      else m='<span>'+pl.p+'</span><span class="dg">'+pl.d+'</span><span>'+pl.s+'</span>';
      return'<div class="ps eu">'+EU_STARS+'<b>'+pl.r+'</b></div><div class="pm">'+m+'</div>';
    }
    case'ae':return'<div class="ae-l"><span class="ar">\u062f\u0628\u064a</span><span class="en">DUBAI</span></div><div class="pm"><span class="ae-code">'+pl.p+'</span><span class="dg">'+pl.d+'</span></div>';
    case'sp':return'<div class="pm"><span>'+esc(pl.t)+'</span></div><div class="pr" style="width:15cqw"><span class="sp-star">\u2605</span><span class="rc"><em>RUS</em></span></div>';
  }
  return'';
}
function plateHTML(it,extra){
  if(!it)return'';
  const x=it.pl?it:{pl:it,m:0,f:0,pt:0,w:1};const pl=x.pl;
  let style=plateVars(x);
  if(pl.c==='us'){const lk=L.US_LOOK[pl.r]||['#c8102e','#fff'];style+=';--usc:'+lk[0]+';--usbg:'+lk[1]+';--usc2:'+(pl.r==='NY'?'#f5a400':lk[0]==='#111'?'#111':'#1b2a6b')}
  return'<div class="plate '+pl.c+' m'+(x.m|0)+' w'+(x.w==null?1:x.w)+(extra?' '+extra:'')+'" style="'+style+'" role="img" aria-label="'+esc(plateText(pl))+'"><div class="pb">'+plateInner(pl)+'</div></div>';
}
const matOf=it=>MATS[it.m|0]||MATS[0];
const mc=it=>'--mc:'+matOf(it).c;
const floatStr=f=>(+f).toFixed(f<.01?6:4).replace('.',',');
function itemMeta(it){
  const a=appraise(it);
  return'<span class="matb" style="'+mc(it)+'">'+matOf(it).n+'</span><span class="badge">'+a.wear.k+' '+floatStr(it.f)+'</span><span class="badge">\u041f\u0430\u0442\u0442\u0435\u0440\u043d '+(it.pt|0)+'</span>'+(a.pat.rare?'<span class="badge" style="background:var(--purple);color:#fff">'+esc(a.pat.n)+'</span>':'')+'<span class="badge">'+a.font.n+' \u0448\u0440\u0438\u0444\u0442</span>';
}

/* ---------- \u043e\u0441\u043c\u043e\u0442\u0440 2.5D ---------- */
function inspect(it,opt){
  opt=opt||{};const a=appraise(it);const price=it.price||a.price;
  const parts=a.parts.map(p=>'<dt>'+esc(p.k)+' <b style="color:var(--text)">'+esc(p.v)+'</b></dt><dd>'+esc(p.t)+(p.m!==1?' <span class="muted">\u00d7'+String(+p.m.toFixed(2)).replace('.',',')+'</span>':'')+'</dd>').join('');
  const mult=x=>'\u00d7'+String(+x.toFixed(2)).replace('.',',');
  const html='<div class="inspect" id="insp"><div class="tilt" id="tilt">'+plateHTML(it)+'</div></div>'+
    '<div class="pad" style="display:grid;gap:4px;text-align:center"><div style="font:700 32px/1 var(--f-ui);letter-spacing:-.02em" class="num">'+fmt(price)+'</div><div class="muted" style="font-size:14px">'+esc(COUNTRY[it.pl.c].n)+(it.pl.c!=='sp'?', '+esc(a.parts[2]?a.parts[2].t:''):'')+'</div></div>'+
    '<div class="pad" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:12px 0 4px">'+itemMeta(it)+'</div>'+
    '<div class="card p" style="margin-top:12px"><div style="display:flex;justify-content:space-between;font:600 15px var(--f-ui)"><span>\u0418\u0437\u043d\u043e\u0441: '+a.wear.n+'</span><span class="num">'+floatStr(it.f)+'</span></div><div class="flt"><i style="left:'+(Math.min(1,it.f)*100).toFixed(2)+'%"></i></div><div class="muted" style="font-size:13px">\u0427\u0435\u043c \u043c\u0435\u043d\u044c\u0448\u0435 \u0438\u0437\u043d\u043e\u0441, \u0442\u0435\u043c \u0434\u043e\u0440\u043e\u0436\u0435 \u043d\u043e\u043c\u0435\u0440. \u041d\u0438\u0436\u0435 0,01 \u0438 0,001 \u2014 \u043e\u0441\u043e\u0431\u044b\u0435 \u0440\u0435\u0434\u043a\u043e\u0441\u0442\u0438.</div></div>'+
    '<div class="card p"><dl class="kv" style="margin:0">'+parts+
    '<dt>\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</dt><dd>'+matOf(it).n+' <span class="muted">'+mult(a.mat.m)+'</span></dd>'+
    '<dt>\u0418\u0437\u043d\u043e\u0441</dt><dd>'+a.wear.k+' <span class="muted">'+mult(a.fm)+'</span></dd>'+
    '<dt>\u0428\u0440\u0438\u0444\u0442</dt><dd>'+a.font.n+' <span class="muted">'+mult(a.font.m)+'</span></dd>'+
    '<dt>\u041f\u0430\u0442\u0442\u0435\u0440\u043d</dt><dd>#'+(it.pt|0)+(a.pat.rare?' \u00ab'+esc(a.pat.n)+'\u00bb <span class="muted">'+mult(a.pat.m)+'</span>':'')+'</dd>'+
    '<dt>\u0421\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u0435</dt><dd class="num">'+fmt(a.combo)+'</dd></dl></div>'+
    (opt.actions?'<div class="foot">'+opt.actions+'</div>':'');
  const sh=Sheet.open({title:opt.title||plateText(it.pl),body:html,cls:'insp'});
  tiltOn(sh.querySelector('#insp'),sh.querySelector('#tilt'));
  return sh;
}
function tiltOn(zone,el){
  if(!zone||!el)return;
  let rx=0,ry=0,t0=performance.now(),touching=false,raf=0;
  const plate=el.querySelector('.plate');
  function set(x,y){
    rx=y*-16;ry=x*22;
    el.style.transform='rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg)';
    if(plate){plate.style.setProperty('--hx',(50+x*60).toFixed(1)+'%');plate.style.setProperty('--hy',(50+y*60).toFixed(1)+'%')}
  }
  function idle(ts){if(!document.body.contains(el)){cancelAnimationFrame(raf);return}raf=requestAnimationFrame(idle);if(touching)return;const k=(ts-t0)/1000;set(Math.sin(k*.8)*.55,Math.sin(k*.55+1)*.35)}
  raf=requestAnimationFrame(idle);
  const mv=e=>{const r=zone.getBoundingClientRect();const x=((e.clientX-r.left)/r.width-.5)*2,y=((e.clientY-r.top)/r.height-.5)*2;set(Math.max(-1,Math.min(1,x)),Math.max(-1,Math.min(1,y)))};
  zone.addEventListener('pointerdown',e=>{touching=true;mv(e);try{zone.setPointerCapture(e.pointerId)}catch(_){}});
  zone.addEventListener('pointermove',e=>{if(touching||e.pointerType==='mouse'){touching=true;mv(e)}});
  ['pointerup','pointercancel','pointerleave'].forEach(t=>zone.addEventListener(t,()=>{touching=false;t0=performance.now()}));
}

/* ================= \u0441\u0432\u044f\u0437\u044c \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c ================= */
let S=L.fresh();S.welcome='';
const Net={status:'loading',me:{uid:null,role:'',banned:false,tg:false,h:'',ava:false},open:[],orders:[],top:[],feed:[],
  cfg:{news:'',ov:{},prices:{p:[55,166,328,661],prem:277},mult:{g:10,k:1},promos:[],bot:'',app:'play',rate:1.8},online:0,sb:null,ch:null,err:'',ver:0};
const CFG=Object.assign({},window.NOMERA_CONFIG||{});
CFG.supabaseUrl=String(CFG.supabaseUrl||'').trim().replace(/\/(rest|functions|auth)\/v1.*$/,'').replace(/\/+$/,'');
CFG.anonKey=String(CFG.anonKey||'').trim();
const FN=CFG.apiUrl||CFG.supabaseUrl+'/functions/v1/api';
let token=lsGet(TOKEN_KEY);
const tgData=(()=>{
  try{
    if(TG)return TG.initData;
    const h=new URLSearchParams((location.hash||'').slice(1));const d=h.get('tgWebAppData');
    if(d){sessionStorage.setItem('tgData',d);return d}
    return sessionStorage.getItem('tgData')||'';
  }catch(e){return''}
})();
const refParam=(()=>{try{const q=new URLSearchParams(location.search);const r=q.get('ref')||'';return /^u[0-9a-f]{16}$/.test(r)?r:''}catch(e){return''}})();
function setToken(t){token=t;lsSet(TOKEN_KEY,t)}
function setCfg(c){if(!c)return;Net.cfg=Object.assign({},Net.cfg,c);L.setOv(Net.cfg.ov||{})}

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
    if(k==='box'||k==='inv'){const del=new Set(d[k].del||[]);S[k]=S[k].filter(x=>!del.has(x.id));for(const it of d[k].add||[]){const i=S[k].findIndex(x=>x.id===it.id);if(i>=0)S[k][i]=it;else S[k].push(it)}}
    else if(d[k]===null)delete S[k];else S[k]=d[k];
  }
}
function takeResp(j){
  const before={bal:S.bal,gold:S.gold,keys:S.keys};
  if(j.S)S=j.S;else if(j.d)applyDiff(j.d);
  if(j.me)Net.me=j.me;if(j.cfg)setCfg(j.cfg);
  Net.ver++;
  bumpWallet(before);
}
// \u041e\u0447\u0435\u0440\u0435\u0434\u044c: \u0437\u0430\u043f\u0440\u043e\u0441\u044b \u0443\u0445\u043e\u0434\u044f\u0442 \u043f\u043e \u043e\u0434\u043d\u043e\u043c\u0443, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u0432\u0435\u0442\u044b \u043f\u0440\u0438\u043c\u0435\u043d\u044f\u043b\u0438\u0441\u044c \u0432 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u043c \u043f\u043e\u0440\u044f\u0434\u043a\u0435
let queue=Promise.resolve();
function enqueue(fn){const p=queue.then(fn,fn);queue=p.catch(()=>{});return p}
async function act(a,p,opt){
  opt=opt||{};
  if(Net.status!=='on')throw new Error(Net.status==='tg'?'\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0438\u0433\u0440\u0443 \u0447\u0435\u0440\u0435\u0437 Telegram-\u0431\u043e\u0442\u0430':'\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u043c\u0441\u044f\u2026');
  // \u043e\u043f\u0442\u0438\u043c\u0438\u0441\u0442\u0438\u0447\u043d\u043e: \u043f\u0440\u0438\u043c\u0435\u043d\u044f\u0435\u043c \u0443 \u0441\u0435\u0431\u044f \u0441\u0440\u0430\u0437\u0443, \u0441\u0435\u0440\u0432\u0435\u0440 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u0442 \u0432 \u0444\u043e\u043d\u0435
  if(L.OPTIMISTIC.has(a)&&!opt.noOpt){
    let r;
    try{const ctx={now:now(),admin:!!Net.me.role,notes:[]};r=L.act(S,a,p||{},ctx);Net.ver++}
    catch(e){throw e}
    enqueue(async()=>{
      try{const j=await call(a,p);takeResp(j)}
      catch(e){toast(e.message,'err');Haptic.err();if(e.relogin){token=null;lsDel(TOKEN_KEY);connect()}else await refreshState(true)}
      render();
    });
    return r;
  }
  return enqueue(async()=>{
    let j;
    try{j=await call(a,p)}
    catch(e){if(e.relogin){token=null;lsDel(TOKEN_KEY);connect()}throw e}
    takeResp(j);return j.r||{};
  });
}
// \u0417\u0430\u043f\u0443\u0441\u043a \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u0438\u0437 \u043a\u043d\u043e\u043f\u043a\u0438: \u043c\u0433\u043d\u043e\u0432\u0435\u043d\u043d\u043e\u0435 \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u00ab\u043d\u0430\u0436\u0430\u0442\u043e\u00bb, \u0437\u0430\u0449\u0438\u0442\u0430 \u043e\u0442 \u0434\u0432\u043e\u0439\u043d\u043e\u0433\u043e \u043d\u0430\u0436\u0430\u0442\u0438\u044f
const busyKeys=new Set();
async function run(a,p,opt){
  opt=opt||{};const key=opt.key||a;const btn=opt.btn||null;
  if(busyKeys.has(key))return null;
  busyKeys.add(key);if(btn)btn.classList.add('busy');
  try{
    const r=await act(a,p,opt);
    if(r&&r.msg&&!opt.quiet)toast(r.msg);
    (r&&r.notes||[]).forEach(n=>toast(n));
    if(opt.ok)opt.ok(r);
    render();showInbox();
    return r;
  }catch(e){toast(e.message,'err');Haptic.err();if(opt.fail)opt.fail(e);render();return null}
  finally{busyKeys.delete(key);if(btn)btn.classList.remove('busy')}
}
let retryT=0;
async function connect(){
  clearTimeout(retryT);
  try{
    let j=null;
    if(tgData){j=await call('auth',{initData:tgData,ref:refParam});setToken(j.t)}
    else if(token){try{j=await call('state')}catch(e){if(e.status===401){token=null;lsDel(TOKEN_KEY)}else throw e}}
    if(!j){
      try{j=await call('guest',{ref:refParam});setToken(j.t)}
      catch(e){if(e.net)throw e;Net.status='tg';bootDone();render();return}
    }
    takeResp(j);Net.status='on';Net.err='';
    bootDone();render();showInbox();
    loadPub();startLive();
    if(S.welcome==='new')setTimeout(welcome,400);
  }catch(e){
    Net.status='off';Net.err=e.net?'':(e.message||'')+(e.status?' (\u043a\u043e\u0434 '+e.status+')':'');
    bootDone();render();retryT=setTimeout(connect,e.net?5000:15000);
  }
}
async function refreshState(force){
  if(Net.status!=='on')return;
  if(!force&&(Reel.busy||busyKeys.size))return;
  try{await enqueue(async()=>{const j=await call('state');takeResp(j)});render();showInbox()}catch(e){}
}
/* \u041f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u0447\u0438\u0442\u0430\u044e\u0442\u0441\u044f \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u0438\u0437 \u0431\u0430\u0437\u044b: \u044d\u0442\u043e \u043d\u0435 \u0442\u0440\u0430\u0442\u0438\u0442 \u043b\u0438\u043c\u0438\u0442 \u0432\u044b\u0437\u043e\u0432\u043e\u0432 \u0444\u0443\u043d\u043a\u0446\u0438\u0438 */
function sbClient(){
  if(Net.sb)return Net.sb;
  if(window.supabase&&CFG.supabaseUrl&&CFG.anonKey)Net.sb=window.supabase.createClient(CFG.supabaseUrl,CFG.anonKey,{auth:{persistSession:false}});
  return Net.sb;
}
async function loadPub(what){
  const sb=sbClient();
  try{
    if(!sb){const j=await call('pub');Net.open=j.open||[];Net.orders=j.orders||[];Net.top=j.top||[];Net.feed=j.feed||[];setCfg(j.cfg);renderPub();return}
    const need=w=>!what||what===w;const jobs=[];
    if(need('market'))jobs.push(sb.from('listings').select('*').order('t',{ascending:false}).limit(500).then(r=>{if(!r.error)Net.open=(r.data||[]).map(l=>Object.assign(l,{t:Number(l.t),ask:Number(l.ask),price:Number(l.price)}))}));
    if(need('orders'))jobs.push(sb.from('orders').select('*').order('price',{ascending:false}).limit(400).then(r=>{if(!r.error)Net.orders=(r.data||[]).map(o=>Object.assign(o,{price:Number(o.price)}))}));
    if(need('top'))jobs.push(sb.from('top_xp').select('*').then(r=>{if(!r.error)Net.top=r.data||[]}));
    if(need('kv'))jobs.push(sb.from('kv').select('key,val').in('key',['feed','cfg']).then(r=>{if(r.error)return;for(const x of r.data||[]){if(x.key==='feed')Net.feed=(x.val&&x.val.items)||[];if(x.key==='cfg')setCfg(x.val)}}));
    await Promise.all(jobs);renderPub();
  }catch(e){}
}
async function pubProfile(uid){
  const sb=sbClient();
  if(!sb){const j=await call('pub.profile',{uid});return j}
  const [p,c]=await Promise.all([sb.from('profiles').select('*').eq('uid',uid).maybeSingle(),sb.from('comments').select('id,wall,author,nick,text,t').eq('wall',uid).order('t',{ascending:false}).limit(50)]);
  if(p.error||!p.data)throw new Error('\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');
  return{p:p.data,comments:(c.data||[]).map(x=>Object.assign(x,{t:Number(x.t)}))};
}
const avaCache=new Map();
async function avatarOf(uid){
  if(avaCache.has(uid))return avaCache.get(uid);
  const sb=sbClient();if(!sb){avaCache.set(uid,null);return null}
  const pr=sb.from('avatars').select('data').eq('uid',uid).maybeSingle().then(r=>r.data?r.data.data:null).catch(()=>null);
  avaCache.set(uid,pr);return pr;
}
async function salesOf(key){
  const sb=sbClient();
  if(!sb){const j=await call('pub.sales',{key});return j.list||[]}
  const r=await sb.from('sales').select('price,t').eq('key',key).gte('t',now()-30*864e5).order('t',{ascending:false}).limit(300);
  return(r.data||[]).map(x=>({price:Number(x.price),t:Number(x.t)}));
}
const later={};
function soon(key,ms,fn){if(later[key])return;later[key]=setTimeout(()=>{later[key]=null;fn()},ms)}
function startLive(){
  const sb=sbClient();
  if(!sb){setInterval(()=>{if(!document.hidden)loadPub()},20000);setInterval(()=>{if(!document.hidden)refreshState()},45000);return}
  if(Net.ch)return;
  Net.ch=sb.channel('live')
    .on('postgres_changes',{event:'*',schema:'public',table:'listings'},()=>soon('m',700,()=>loadPub('market')))
    .on('postgres_changes',{event:'*',schema:'public',table:'orders'},()=>soon('o',700,()=>loadPub('orders')))
    .on('postgres_changes',{event:'*',schema:'public',table:'kv'},()=>soon('k',700,()=>loadPub('kv')))
    .on('postgres_changes',{event:'*',schema:'public',table:'pings',filter:'h=eq.'+Net.me.h},()=>soon('s',300,()=>refreshState()))
    .on('postgres_changes',{event:'*',schema:'public',table:'comments'},()=>soon('c',500,()=>{if(Prof.cur)Prof.reload()}))
    .subscribe();
  const on=sb.channel('online',{config:{presence:{key:Net.me.uid||String(Math.random())}}});
  on.on('presence',{event:'sync'},()=>{Net.online=Object.keys(on.presenceState()).length;renderOnline()})
    .subscribe(st=>{if(st==='SUBSCRIBED')on.track({t:now()}).catch(()=>{})});
  setInterval(()=>{if(!document.hidden&&Tabs.cur==='season')loadPub('top')},60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshState();loadPub()}});
}
let inboxBusy=false;
async function showInbox(){
  if(inboxBusy||!S.inbox||!S.inbox.length)return;
  inboxBusy=true;S.inbox.forEach(m=>toast(m.text));
  try{await act('inboxSeen')}catch(e){}
  inboxBusy=false;
}

/* ================= \u043a\u0430\u0440\u043a\u0430\u0441: \u0432\u043a\u043b\u0430\u0434\u043a\u0438, \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b, \u0448\u0442\u043e\u0440\u043a\u0438, \u0442\u043e\u0441\u0442\u044b ================= */
const ACT={};          // \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u0438 data-act
const ON={};           // \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u0438 data-on (input/change)
const TABS=[{id:'cases',n:'\u041a\u0435\u0439\u0441\u044b',i:'case'},{id:'games',n:'\u0418\u0433\u0440\u044b',i:'games'},{id:'invest',n:'\u0412\u043b\u043e\u0436\u0435\u043d\u0438\u044f',i:'invest'},{id:'season',n:'\u0421\u0435\u0437\u043e\u043d',i:'season'},{id:'account',n:'\u0410\u043a\u043a\u0430\u0443\u043d\u0442',i:'account'}];
const RENDER={};       // RENDER[tab]()
const Tabs={
  cur:'cases',
  init(){
    const el=$('tabs');
    el.insertAdjacentHTML('beforeend',TABS.map(t=>'<button role="tab" data-act="tab" data-id="'+t.id+'" id="tb-'+t.id+'" aria-label="'+t.n+'">'+ic(t.i)+'<span>'+t.n+'</span></button>').join(''));
    $('donate-btn').innerHTML=ic('gem');
    Tabs.lens();window.addEventListener('resize',()=>Tabs.lens());
  },
  lens(){
    const b=$('tb-'+Tabs.cur),l=qs('#tabs .lens');if(!b||!l)return;
    l.style.width=b.offsetWidth+'px';l.style.transform='translateX('+(b.offsetLeft-4)+'px)';
    qsa('#tabs button').forEach(x=>x.classList.toggle('on',x===b));
  },
  go(id){
    if(!RENDER[id])return;
    if(Page.stack.length)Page.clear();
    if(Tabs.cur===id){window.scrollTo({top:0,behavior:'smooth'});return}
    Tabs.cur=id;qsa('.tab').forEach(s=>s.classList.toggle('on',s.id==='t-'+id));
    Tabs.lens();window.scrollTo(0,0);RENDER[id]();Haptic.tick();
    if(id!=='cases')Reel.pauseIdle();else Reel.resumeIdle();
  }
};
ACT.tab=el=>Tabs.go(el.dataset.id);

/* ---------- \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u043f\u043e\u0432\u0435\u0440\u0445 \u0432\u043a\u043b\u0430\u0434\u043e\u043a (\u0441\u0442\u0435\u043a) ---------- */
const Page={
  stack:[],
  push(id,title,renderFn,opt){
    opt=opt||{};
    const el=document.createElement('div');el.className='page';el.dataset.pid=id;
    const backTitle=Page.stack.length?Page.stack[Page.stack.length-1].title:(TABS.find(t=>t.id===Tabs.cur)||{}).n;
    el.innerHTML='<div class="inner"><div class="nav"><button class="back glass" data-act="back">'+ic('back')+'<span>'+esc(backTitle||'\u041d\u0430\u0437\u0430\u0434')+'</span></button><div style="flex:1"></div>'+(opt.navRight||'')+'</div>'+(opt.noTitle?'':'<h1>'+esc(title)+'</h1>')+'<div class="pc"></div></div>';
    $('stack').appendChild(el);
    const prev=Page.stack[Page.stack.length-1];
    Page.stack.push({id,title,el,render:renderFn,opt});
    renderFn(el.querySelector('.pc'),el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{el.classList.add('in');if(prev)prev.el.classList.add('under')}));
    Haptic.tap();
    if(TG&&TG.BackButton){try{TG.BackButton.show()}catch(e){}}
    return el;
  },
  pop(){
    const p=Page.stack.pop();if(!p)return;
    p.el.classList.remove('in');setTimeout(()=>p.el.remove(),420);
    const prev=Page.stack[Page.stack.length-1];if(prev){prev.el.classList.remove('under');Page.renderTop()}
    if(p.opt.onClose)p.opt.onClose();
    if(!Page.stack.length){if(TG&&TG.BackButton){try{TG.BackButton.hide()}catch(e){}}render()}
  },
  clear(){while(Page.stack.length){const p=Page.stack.pop();p.el.remove();if(p.opt.onClose)p.opt.onClose()}if(TG&&TG.BackButton){try{TG.BackButton.hide()}catch(e){}}},
  top(){return Page.stack[Page.stack.length-1]},
  renderTop(){const p=Page.top();if(!p)return;const sc=p.el.scrollTop;p.render(p.el.querySelector('.pc'),p.el);p.el.scrollTop=sc},
  is(id){const p=Page.top();return p&&p.id===id}
};
ACT.back=()=>{if(Sheet.cur)Sheet.close();else Page.pop()};
if(TG&&TG.BackButton){try{TG.BackButton.onClick(()=>ACT.back())}catch(e){}}

/* ---------- \u0448\u0442\u043e\u0440\u043a\u0438 ---------- */
const Sheet={
  cur:null,
  open(o){
    Sheet.close(true);
    const root=$('sheets');
    root.innerHTML='<div class="scrim" data-act="sheetx"></div><div class="sheet '+(o.cls||'')+'" role="dialog" aria-modal="true"><div class="grab"></div>'+(o.title?'<h2>'+esc(o.title)+'</h2>':'')+(o.lead?'<p class="lead">'+o.lead+'</p>':'')+'<button class="iconbtn x" data-act="sheetx" aria-label="\u0417\u0430\u043a\u0440\u044b\u0442\u044c">'+ic('close')+'</button><div class="sb">'+o.body+'</div></div>';
    const sh=root.querySelector('.sheet'),sc=root.querySelector('.scrim');
    Sheet.cur={el:sh,o};
    requestAnimationFrame(()=>requestAnimationFrame(()=>{sh.classList.add('in');sc.classList.add('in')}));
    // \u0436\u0435\u0441\u0442: \u0441\u043c\u0430\u0445\u043d\u0443\u0442\u044c \u0432\u043d\u0438\u0437
    let y0=null,dy=0;
    sh.addEventListener('touchstart',e=>{if(sh.scrollTop>0)return;y0=e.touches[0].clientY;dy=0},{passive:true});
    sh.addEventListener('touchmove',e=>{if(y0==null)return;dy=e.touches[0].clientY-y0;if(dy>0){sh.style.transition='none';sh.style.transform='translateY('+dy+'px)'}},{passive:true});
    sh.addEventListener('touchend',()=>{if(y0==null)return;sh.style.transition='';sh.style.transform='';if(dy>110)Sheet.close();y0=null});
    if(TG&&TG.BackButton){try{TG.BackButton.show()}catch(e){}}
    Haptic.soft();
    return sh;
  },
  close(silent){
    const c=Sheet.cur;if(!c)return;Sheet.cur=null;
    const root=$('sheets');const sh=c.el,sc=root.querySelector('.scrim');
    if(silent){root.innerHTML='';if(c.o.onClose)c.o.onClose();return}
    sh.classList.remove('in');if(sc)sc.classList.remove('in');
    setTimeout(()=>{if(!Sheet.cur)root.innerHTML=''},380);
    if(c.o.onClose)c.o.onClose();
    if(!Page.stack.length&&TG&&TG.BackButton){try{TG.BackButton.hide()}catch(e){}}
  },
  body(html){if(Sheet.cur){Sheet.cur.el.querySelector('.sb').innerHTML=html}}
};
ACT.sheetx=()=>Sheet.close();

/* ---------- \u0442\u043e\u0441\u0442\u044b ---------- */
const toastQ=[];
function toast(msg,kind){
  if(!msg)return;const box=$('toasts');
  if(box.children.length>=3)box.firstChild.remove();
  const el=document.createElement('div');el.className='toast'+(kind?' '+kind:'');el.textContent=msg;box.appendChild(el);
  const ms=Math.min(6000,2200+msg.length*35);
  setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),320)},ms);
}

/* ---------- \u0448\u0430\u043f\u043a\u0430 \u0438 \u043a\u043e\u0448\u0435\u043b\u0451\u043a ---------- */
function avaHTML(uid,nick,cls,has){
  const ch=esc((String(nick||'?').trim()[0]||'?').toUpperCase());
  const hue=uid?L.hashStr(uid)%360:30;
  return'<span class="ava '+(cls||'')+'" data-ava="'+(has?esc(uid):'')+'" style="background:linear-gradient(160deg,hsl('+hue+',85%,62%),hsl('+((hue+40)%360)+',80%,46%))">'+ch+'</span>';
}
function hydrateAvas(root){
  qsa('[data-ava]',root).forEach(el=>{
    const uid=el.dataset.ava;if(!uid||el.dataset.done)return;el.dataset.done='1';
    if(uid===Net.me.uid&&Me.avaData){el.innerHTML='<img alt="" src="'+Me.avaData+'">';return}
    Promise.resolve(avatarOf(uid)).then(d=>{if(d)el.innerHTML='<img alt="" src="'+d+'">'});
  });
}
function walletHTML(){
  return'<div class="wallet">'+
    '<button class="chip w-bal" data-act="walletRub"><span class="num">'+fmt(S.bal)+'</span></button>'+
    '<button class="chip gold w-gold" data-act="donate">'+ic('gem')+'<span class="num">'+fmtN(S.gold)+'</span></button>'+
    '<button class="chip key w-keys" data-act="keys">'+ic('key')+'<span class="num">'+fmtN(S.keys)+'</span></button>'+
    (Net.online>1?'<span class="chip w-on" style="background:transparent;color:var(--text2);font-weight:500"><i style="width:8px;height:8px;border-radius:50%;background:var(--green);display:inline-block"></i><span class="num">'+fmtN(Net.online)+'</span> \u043e\u043d\u043b\u0430\u0439\u043d</span>':'')+
  '</div>';
}
function topHTML(title,right){
  return'<div class="top"><h1>'+esc(title)+'</h1>'+(right||'')+'<button data-act="me" aria-label="\u041c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c" style="border-radius:50%">'+avaHTML(Net.me.uid,S.nick,'',Net.me.ava)+'</button></div>'+walletHTML()+netbar();
}
function netbar(){
  if(Net.status==='off')return'<div class="netbar">\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041f\u0435\u0440\u0435\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u043c\u0441\u044f\u2026'+(Net.err?'<br><span style="opacity:.8">'+esc(Net.err)+'</span>':'')+'</div>';
  if(Net.status==='tg')return'<div class="netbar" style="background:var(--fill2);color:var(--text)">\u0418\u0433\u0440\u0430 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 Telegram-\u0431\u043e\u0442\u0430. \u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0431\u043e\u0442\u0430 \u0438 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u0418\u0433\u0440\u0430\u0442\u044c\u00bb.</div>';
  return'';
}
function bumpWallet(b){
  requestAnimationFrame(()=>{
    for(const [k,cls] of [['bal','w-bal'],['gold','w-gold'],['keys','w-keys']]){
      if(b[k]===S[k])continue;
      qsa('.'+cls).forEach(el=>{el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')});
    }
  });
}
function renderWallet(){
  qsa('.w-bal .num').forEach(e=>e.textContent=fmt(S.bal));
  qsa('.w-gold .num').forEach(e=>e.textContent=fmtN(S.gold));
  qsa('.w-keys .num').forEach(e=>e.textContent=fmtN(S.keys));
}
function renderOnline(){qsa('.w-on .num').forEach(e=>e.textContent=fmtN(Net.online))}
ACT.walletRub=()=>toast('\u0420\u0443\u0431\u043b\u0438 \u2014 \u0438\u0433\u0440\u043e\u0432\u0430\u044f \u0432\u0430\u043b\u044e\u0442\u0430. \u0415\u0451 \u0434\u0430\u044e\u0442 \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b, \u0441\u043a\u0443\u043f\u0449\u0438\u043a, \u043f\u0440\u043e\u0434\u0430\u0436\u0438 \u0438 \u043d\u0430\u0433\u0440\u0430\u0434\u044b');
ACT.keys=()=>openKeys();

/* ---------- \u043e\u0431\u0449\u0438\u0439 \u0440\u0435\u043d\u0434\u0435\u0440 ---------- */
function render(){
  if(RENDER[Tabs.cur])RENDER[Tabs.cur]();
  Page.renderTop();
  renderBadges();
}
function renderPub(){
  if(Tabs.cur==='cases')RENDER.casesFeed&&RENDER.casesFeed();
  if(Tabs.cur==='season'&&RENDER.season)RENDER.season();
  if(Page.stack.length)Page.renderTop();
}
function renderBadges(){
  const n=L.claimable(S,now())+L.questReady(S,now())+((S.week&&S.week.xp>=L.WEEK_XP&&S.week.got.length<2)?1:0);
  const b=$('tb-season');if(!b)return;let d=b.querySelector('.dot');
  if(n&&!d){d=document.createElement('i');d.className='dot';b.appendChild(d)}else if(!n&&d)d.remove();
}
function bootDone(){const b=$('boot');if(b&&!b.classList.contains('gone')){b.classList.add('gone');setTimeout(()=>b.remove(),500)}}

/* ---------- \u0434\u0435\u043b\u0435\u0433\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 ---------- */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const f=ACT[el.dataset.act];if(!f)return;
  e.preventDefault();
  try{f(el,e)}catch(err){console.error(err);toast(err.message||'\u041e\u0448\u0438\u0431\u043a\u0430','err')}
});
document.addEventListener('input',e=>{const el=e.target.closest('[data-on]');if(el&&ON[el.dataset.on])ON[el.dataset.on](el,e)});
document.addEventListener('change',e=>{const el=e.target.closest('[data-on]');if(el&&ON[el.dataset.on+'Change'])ON[el.dataset.on+'Change'](el,e)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(Sheet.cur)Sheet.close();else if(Page.stack.length)Page.pop()}});

/* ---------- \u043e\u0431\u0449\u0438\u0435 \u043a\u0443\u0441\u043e\u0447\u043a\u0438 ---------- */
const secH=(t,act,extra)=>act?'<button class="sec" data-act="'+act+'"'+(extra||'')+'>'+esc(t)+ic('chev','chev')+'</button>':'<div class="sec">'+esc(t)+'</div>';
function confirmSheet(title,text,okText,fn,danger){
  Sheet.open({title,lead:text,body:'<div class="foot"><button class="btn '+(danger?'danger':'pri')+' wide" data-act="cfmOk">'+esc(okText)+'</button><button class="btn wide" data-act="sheetx">\u041e\u0442\u043c\u0435\u043d\u0430</button></div>'});
  ACT.cfmOk=()=>{Sheet.close();fn()};
}
function ring(p,color){const r=18,c=2*Math.PI*r;return'<svg class="ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="'+r+'" fill="none" stroke="var(--fill)" stroke-width="5"/><circle cx="22" cy="22" r="'+r+'" fill="none" stroke="'+(color||'var(--accent)')+'" stroke-width="5" stroke-linecap="round" stroke-dasharray="'+(c*Math.max(0,Math.min(1,p))).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 22 22)"/></svg>'}
function copyText(t){
  try{if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t).then(()=>true,()=>fallback())}catch(e){}
  return Promise.resolve(fallback());
  function fallback(){try{const ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok}catch(e){return false}}
}
function openLink(url){try{if(TG&&/^https:\/\/t\.me\//.test(url)&&TG.openTelegramLink){TG.openTelegramLink(url);return}if(TG&&TG.openLink){TG.openLink(url);return}}catch(e){}window.open(url,'_blank','noopener')}

/* ================= \u0432\u043a\u043b\u0430\u0434\u043a\u0430 \u00ab\u041a\u0435\u0439\u0441\u044b\u00bb ================= */
const CN_SHORT={ru:'\u0420\u043e\u0441\u0441\u0438\u044f',ua:'\u0423\u043a\u0440\u0430\u0438\u043d\u0430',kz:'\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d',us:'\u0421\u0428\u0410',eu:'\u0415\u0432\u0440\u043e\u043f\u0430',ae:'\u0414\u0443\u0431\u0430\u0439',mix:'\u041c\u0438\u043a\u0441'};
const TIER_G=['g-grey','g-orange','g-blue','g-red'];
let curC=lsGet('nomera2_c')||'ru';if(!CN_SHORT[curC])curC='ru';
let curTier=+lsGet('nomera2_tier')||0;if(!TIERS[curTier])curTier=0;
let lastDrop=null;

/* ---------- \u0440\u0443\u043b\u0435\u0442\u043a\u0430 ---------- */
const Reel=(()=>{
  const W=196,GAP=10,STEP=W+GAP;
  let strip=null,box=null,x=0,v=0,raf=0,phase='idle',lastT=0,stopT0=0,stopX0=0,stopD=0,stopDur=0,winIdx=-1,lastIdx=-1,lastTick=0,idleOn=true,onDone=null,pending=null,spinT0=0;
  let items=[];
  const rndItem=()=>{let c=curC==='mix'?L.pick(COUNTRIES):curC;return L.caseRoll(c,curTier)};
  const itemHTML=it=>'<div class="ri" style="'+mc(it)+'">'+plateHTML(it)+'</div>';
  function mount(el){
    box=el;box.innerHTML='<div class="strip"></div><div class="fade l"></div><div class="fade r"></div><div class="mark"></div>';
    strip=box.querySelector('.strip');items=[];x=0;fill(40);center(8);draw();
    if(!raf){lastT=performance.now();raf=requestAnimationFrame(loop)}
  }
  function fill(n){let h='';for(let i=0;i<n;i++){const it=rndItem();items.push(it);h+=itemHTML(it)}strip.insertAdjacentHTML('beforeend',h)}
  function cw(){return box?box.clientWidth:360}
  function center(i){x=10+i*STEP+W/2-cw()/2}
  function idxAt(px){return Math.floor((px+cw()/2-10)/STEP)}
  function draw(){if(strip)strip.style.transform='translate3d('+(-x).toFixed(1)+'px,0,0)'}
  function trim(){
    // \u0434\u0435\u0440\u0436\u0438\u043c DOM \u043d\u0435\u0431\u043e\u043b\u044c\u0448\u0438\u043c: \u0443\u0431\u0438\u0440\u0430\u0435\u043c \u0443\u0448\u0435\u0434\u0448\u0438\u0435 \u0432\u043b\u0435\u0432\u043e \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u044b
    const gone=idxAt(x)-12;
    if(gone>20&&phase!=='stop'){for(let i=0;i<gone;i++){strip.firstChild.remove()}items.splice(0,gone);x-=gone*STEP;lastIdx-=gone}
    const need=idxAt(x)+30-items.length;if(need>0)fill(need+10);
  }
  function loop(ts){
    raf=requestAnimationFrame(loop);
    const dt=Math.min(.05,(ts-lastT)/1000);lastT=ts;
    if(!box||!document.body.contains(box))return;
    if(phase==='idle'){if(!idleOn||Tabs.cur!=='cases'||document.hidden)return;x+=18*dt}
    else if(phase==='spin'){v=Math.min(2600,v+5200*dt);x+=v*dt;if(pending&&ts-spinT0>650){const p=pending;pending=null;beginStop(p)}}
    else if(phase==='stop'){
      const t=Math.min(1,(ts-stopT0)/1000/stopDur);const k=1-Math.pow(1-t,3);x=stopX0+stopD*k;
      if(t>=1){phase='idle';x=stopX0+stopD;draw();finish();return}
    }
    trim();draw();
    const i=idxAt(x);if(i!==lastIdx){lastIdx=i;if(phase!=='idle'&&ts-lastTick>45){lastTick=ts;Snd.tick();Haptic.tick()}}
  }
  function beginStop(win){
    if(!win){ // \u043e\u0448\u0438\u0431\u043a\u0430: \u043f\u0440\u043e\u0441\u0442\u043e \u0442\u043e\u0440\u043c\u043e\u0437\u0438\u043c
      phase='stop';stopT0=performance.now();stopX0=x;stopD=v*.5;stopDur=Math.max(.4,3*stopD/Math.max(1,v));winIdx=-1;onDone=null;return;
    }
    const T=3.9;let D=v*T/3;
    let k=idxAt(x+D);if(k<idxAt(x)+8)k=idxAt(x)+8;
    while(items.length<=k+6)fill(10);
    items[k]=win.item;const el=strip.children[k];if(el)el.outerHTML=itemHTML(win.item);
    const jitter=(Math.random()-.5)*W*.62;
    const target=10+k*STEP+W/2-cw()/2+jitter;
    winIdx=k;phase='stop';stopT0=performance.now();stopX0=x;stopD=target-x;stopDur=Math.max(1.6,3*stopD/Math.max(300,v));
    onDone=win.done;
  }
  function finish(){
    const el=strip&&strip.children[winIdx];if(el){el.style.transition='transform .35s';el.style.transform='scale(1.06)';setTimeout(()=>{el.style.transform=''},700)}
    Reel.busy=false;v=0;const f=onDone;onDone=null;if(f)f();
  }
  return{
    get busy(){return phase!=='idle'},set busy(b){},
    mount,
    remount(){if(box&&!Reel.busy){strip.innerHTML='';items=[];x=0;fill(40);center(8);draw()}},
    spin(){phase='spin';v=300;spinT0=performance.now();pending=null},
    land(item,done){pending={item,done}},
    abort(){pending=false;beginStop(null);phase='stop'},
    pauseIdle(){idleOn=false},resumeIdle(){idleOn=true}
  };
})();

/* ---------- \u043e\u0442\u043a\u0440\u044b\u0442\u0438\u0435 \u043a\u0435\u0439\u0441\u0430 ---------- */
function canOpen(tier,key){
  const t=TIERS[tier];
  if(t.event&&!L.seasonOn(now()))return'\u0421\u0435\u0437\u043e\u043d \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0441\u044f';
  if(S.box.length>=L.BOX_CAP)return'\u0413\u0430\u0440\u0430\u0436 \u043f\u043e\u043b\u043e\u043d. \u041f\u0440\u043e\u0434\u0430\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440\u0430, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0435\u0439\u0441';
  if(key&&S.keys<t.keys)return'\u041d\u0443\u0436\u043d\u043e '+keyN(t.keys)+'. \u041a\u043b\u044e\u0447\u0438 \u0434\u0430\u044e\u0442 \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b, \u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0438 \u0434\u043e\u043d\u0430\u0442';
  if(!key&&S.bal<t.price)return'\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+fmt(t.price-S.bal)+'. \u0417\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u0439\u0442\u0435 \u0432 \u00ab\u0418\u0433\u0440\u0430\u0445\u00bb';
  return'';
}
async function openCase(key,btn){
  if(Reel.busy||busyKeys.has('open'))return;
  if(Net.status!=='on'){toast(Net.status==='tg'?'\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0438\u0433\u0440\u0443 \u0447\u0435\u0440\u0435\u0437 Telegram-\u0431\u043e\u0442\u0430':'\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c','err');return}
  const why=canOpen(curTier,key);if(why){toast(why,'err');Haptic.err();return}
  busyKeys.add('open');Haptic.tap();Snd.ctx();
  lastDrop=null;const dr=$('drop');if(dr)dr.innerHTML='';
  Reel.spin();renderOpener();
  try{
    const r=await act('open',{tier:curTier,c:curC,key:!!key});
    renderWallet();
    Reel.land(r.item,()=>{
      busyKeys.delete('open');lastDrop=r.item;
      const lv=r.item.m;Snd.win(lv);if(lv>=2||r.item.price>=10000)Haptic.ok();else Haptic.soft();
      (r.notes||[]).forEach(n=>toast(n));
      render();showInbox();
      const d=$('drop');if(d)d.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  }catch(e){busyKeys.delete('open');Reel.abort();toast(e.message,'err');Haptic.err();renderOpener()}
}
ACT.open=el=>openCase(false,el);
ACT.openKey=el=>openCase(true,el);
ACT.cc=el=>{if(Reel.busy)return;curC=el.dataset.c;lsSet('nomera2_c',curC);Haptic.tick();renderSeg();Reel.remount()};
ACT.tier=el=>{if(Reel.busy)return;curTier=+el.dataset.t;lsSet('nomera2_tier',curTier);Haptic.tick();renderOpener();renderTiers();Reel.remount()};

/* ---------- \u043e\u0442\u0440\u0438\u0441\u043e\u0432\u043a\u0430 \u0432\u043a\u043b\u0430\u0434\u043a\u0438 ---------- */
let casesBuilt=false;
RENDER.cases=()=>{
  const root=$('t-cases');
  if(!casesBuilt){
    root.innerHTML='<div id="cs-top"></div><div id="cs-news"></div><div class="seg" id="cs-seg" style="margin-top:6px"></div><div style="height:10px"></div><div class="reel" id="reel"></div><div class="opener" id="opener"></div><div id="drop"></div>'+
      '<div id="cs-tiers"></div><div id="cs-cos"></div><div id="cs-mine"></div><div id="cs-feed"></div>';
    casesBuilt=true;Reel.mount($('reel'));
  }
  $('cs-top').innerHTML=topHTML('\u041a\u0435\u0439\u0441\u044b');hydrateAvas($('cs-top'));
  renderNews();renderSeg();renderOpener();renderDrop();renderTiers();renderCos();renderMine();RENDER.casesFeed();
};
function renderNews(){
  const n=Net.cfg.news;const el=$('cs-news');if(!el)return;
  el.innerHTML=n?'<div class="row" style="margin:10px var(--g) 0;width:auto;min-height:0"><div class="ico" style="width:36px;height:36px;border-radius:10px;background:var(--blue)">'+ic('mega')+'</div><div class="mid"><div class="ss" style="color:var(--text);white-space:normal;margin:0;font-size:15px">'+esc(n)+'</div></div></div>':'';
}
function renderSeg(){
  const el=$('cs-seg');if(!el)return;
  el.innerHTML=Object.keys(CN_SHORT).map(c=>'<button class="'+(c===curC?'on':'')+'" data-act="cc" data-c="'+c+'">'+CN_SHORT[c]+'</button>').join('');
}
function renderOpener(){
  const el=$('opener');if(!el)return;const t=TIERS[curTier];const spin=Reel.busy||busyKeys.has('open');
  const seasonOff=t.event&&!L.seasonOn(now());
  el.innerHTML='<div class="segbox">'+TIERS.map((x,i)=>'<button class="'+(i===curTier?'on':'')+'" data-act="tier" data-t="'+i+'">'+x.name+'</button>').join('')+'</div>'+
    '<div class="acts"><button class="btn pri'+(spin||seasonOff?' off':'')+'" data-act="open"><span>\u041e\u0442\u043a\u0440\u044b\u0442\u044c</span><small class="num">'+fmt(t.price)+'</small></button>'+
    '<button class="btn'+(spin||seasonOff?' off':'')+'" data-act="openKey">'+ic('key')+'<span class="num">'+t.keys+'</span><small>'+plural(t.keys,'\u043a\u043b\u044e\u0447','\u043a\u043b\u044e\u0447\u0430','\u043a\u043b\u044e\u0447\u0435\u0439')+'</small></button></div>';
}
function renderDrop(){
  const el=$('drop');if(!el)return;
  if(!lastDrop||Reel.busy){el.innerHTML='';return}
  const it=S.box.find(b=>b.id===lastDrop.id)||null;
  if(!it){el.innerHTML='';return}
  const share=(it.m>=2||it.price>=10000)&&S.hint.share!==L.mskDate(now());
  el.innerHTML='<div class="drop popin" style="'+mc(it)+'"><div class="head"><span class="matb" style="'+mc(it)+'">'+matOf(it).n+'</span><span class="muted" style="font-size:14px">'+esc(COUNTRY[it.pl.c].n)+'</span><div style="flex:1"></div><button class="iconbtn" data-act="pin" data-id="'+it.id+'" aria-label="\u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c" style="'+(it.pin?'color:var(--accent)':'')+'">'+ic('pin')+'</button></div>'+
    '<button class="mat" data-act="insp" data-id="'+it.id+'" style="width:100%;padding:14px 12px">'+plateHTML(it)+'</button>'+
    '<div style="display:flex;align-items:baseline;gap:10px;margin-top:14px"><div class="price">'+fmt(it.price)+'</div><div class="muted" style="font-size:14px">\u0441\u043a\u0443\u043f\u0449\u0438\u043a \u0434\u0430\u0441\u0442 '+fmt(Math.floor(it.price*L.BUYBACK))+'</div></div>'+
    '<div class="meta">'+itemMeta(it)+'</div>'+
    '<div class="acts"><button class="btn md" data-act="quick" data-id="'+it.id+'">\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443</button><button class="btn md" data-act="sell" data-id="'+it.id+'" data-k="plate">\u041d\u0430 \u0440\u044b\u043d\u043e\u043a</button><button class="btn md" data-act="insp" data-id="'+it.id+'">'+ic('eye')+'\u041e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c</button></div>'+
    (share?'<div class="row" style="margin-top:12px;background:var(--fill3);min-height:0;padding:10px 12px"><div class="mid"><div class="ss" style="color:var(--text);white-space:normal;margin:0">\u041f\u043e\u043a\u0430\u0436\u0438 \u0434\u0440\u0443\u0437\u044c\u044f\u043c \u2014 \u043f\u043e\u043b\u0443\u0447\u0438\u0448\u044c '+fmt(L.REF_REW[L.plusTier(S.don)+1].m)+' \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e</div></div><button class="pill" data-act="shareRef" data-src="drop">'+ic('share')+'\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f</button></div>':'')+
    '</div>';
}
function renderTiers(){
  const el=$('cs-tiers');if(!el)return;
  el.innerHTML=secH('\u041a\u0435\u0439\u0441\u044b \u0441 \u043d\u043e\u043c\u0435\u0440\u0430\u043c\u0438')+'<div class="grid2 top4">'+TIERS.map((t,i)=>{
    const top=t.mw.slice(2).reduce((a,b)=>a+b,0);
    return'<button class="gc '+TIER_G[i]+'" data-act="odds" data-t="'+i+'" style="text-align:left'+(i===curTier?';box-shadow:inset 0 0 0 3px rgba(255,255,255,.85)':'')+'"><span class="big">'+(i+1)+'</span>'+
      '<span class="art" style="right:12px;top:30px">'+caseArt(i)+'</span>'+
      '<span class="k">'+(t.event?'\u0422\u043e\u043b\u044c\u043a\u043e \u0432 \u0441\u0435\u0437\u043e\u043d\u0435':'\u041a\u0435\u0439\u0441')+'</span><span class="t">'+t.name+'</span><span class="s">\u0413\u043e\u043b\u043e\u0433\u0440\u0430\u0444\u0438\u044f \u0438 \u043b\u0443\u0447\u0448\u0435: '+String(+top.toFixed(1)).replace('.',',')+'%</span>'+
      '<span class="act"><span class="pill on-card">\u0428\u0430\u043d\u0441\u044b</span><span class="k num">'+fmt(t.price)+'</span></span></button>';
  }).join('')+'</div>';
}
function caseArt(i){
  const c=[['#d7dde4','#9aa4b0','#6b7684'],['#fff3b0','#ffc93d','#d98f00'],['#cfe8ff','#5fb0ff','#1d6fd6'],['#ffd0c8','#ff7a6b','#d12b1f']][i];
  return'<svg width="74" height="74" viewBox="0 0 24 24"><path d="M12 2.6 20.6 7 12 11.4 3.4 7Z" fill="'+c[0]+'"/><path d="M2.9 8.4 11.2 12.7V21.8L2.9 17.4Z" fill="'+c[1]+'"/><path d="M21.1 8.4 12.8 12.7V21.8L21.1 17.4Z" fill="'+c[2]+'"/><path d="M7.2 4.8 15.8 9.2v3.2l1.6-.8V8.4L8.8 4Z" fill="rgba(255,255,255,.55)"/></svg>';
}
ACT.odds=el=>{
  const i=+el.dataset.t,t=TIERS[i];const sum=t.mw.reduce((a,b)=>a+b,0);
  const rows=MATS.map((m,k)=>'<div class="li noic"><span class="matb" style="--mc:'+m.c+'">'+m.n+'</span><span class="lt"></span><span class="lv num">'+(t.mw[k]/sum*100).toFixed(t.mw[k]/sum<.01?2:1).replace('.',',')+'%</span></div>').join('');
  const wr=WEARS.map(w=>'<div class="li noic"><span class="lt">'+w.n+' <span class="muted">('+w.k+')</span></span><span class="lv num">'+w.w+'%</span></div>').join('');
  Sheet.open({title:'\u041a\u0435\u0439\u0441 \u00ab'+t.name+'\u00bb',lead:t.desc+'. \u0426\u0435\u043d\u0430 '+fmt(t.price)+' \u0438\u043b\u0438 '+keyN(t.keys)+'.',body:
    '<div class="sec" style="margin-top:6px;font-size:18px">\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</div><div class="group">'+rows+'</div>'+
    '<div class="sec" style="font-size:18px">\u0418\u0437\u043d\u043e\u0441</div><div class="group">'+wr+'</div>'+
    '<p class="note">\u041f\u0430\u0442\u0442\u0435\u0440\u043d \u2014 \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e\u0435 \u0447\u0438\u0441\u043b\u043e \u043e\u0442 0 \u0434\u043e 1000, \u0448\u0440\u0438\u0444\u0442 \u0431\u044b\u0432\u0430\u0435\u0442 \u0442\u043e\u043d\u043a\u0438\u043c, \u043e\u0431\u044b\u0447\u043d\u044b\u043c, \u0436\u0438\u0440\u043d\u044b\u043c \u0438 \u0441\u0432\u0435\u0440\u0445\u0436\u0438\u0440\u043d\u044b\u043c. \u0426\u0435\u043d\u0443 \u043d\u043e\u043c\u0435\u0440\u0430 \u0441\u0447\u0438\u0442\u0430\u0435\u0442 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u0435 \u0446\u0438\u0444\u0440 \u0438 \u0431\u0443\u043a\u0432, \u0440\u0435\u0433\u0438\u043e\u043d, \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b, \u0438\u0437\u043d\u043e\u0441, \u0448\u0440\u0438\u0444\u0442 \u0438 \u043f\u0430\u0442\u0442\u0435\u0440\u043d.</p>'+
    '<div class="foot"><button class="btn pri wide" data-act="pickTier" data-t="'+i+'">\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u044d\u0442\u043e\u0442 \u043a\u0435\u0439\u0441</button></div>'});
};
ACT.pickTier=el=>{Sheet.close();curTier=+el.dataset.t;lsSet('nomera2_tier',curTier);renderOpener();renderTiers();Reel.remount();window.scrollTo({top:0,behavior:'smooth'})};
function renderCos(){
  const el=$('cs-cos');if(!el)return;
  el.innerHTML=secH('\u0421\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438')+'<div class="shelf">'+
    '<div class="gc g-purple" style="width:min(78vw,300px);height:190px"><span class="art" style="right:8px;top:14px"><canvas id="cs-skinart" width="150" height="92" style="width:150px;height:92px"></canvas></span><span class="k">\u041c\u0430\u0448\u0438\u043d\u044b \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0438</span><span class="t">\u041a\u0435\u0439\u0441 \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438</span><span class="s">\u041f\u044f\u0442\u044c \u0440\u0435\u0434\u043a\u043e\u0441\u0442\u0435\u0439, \u043e\u0442 \u043e\u0431\u044b\u0447\u043d\u044b\u0445 \u0434\u043e \u044d\u043f\u0438\u0447\u0435\u0441\u043a\u0438\u0445</span>'+
      '<span class="act">'+(S.free.sc>0?'<button class="pill on-card" data-act="skinCase" data-m="free">\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e \u00d7'+S.free.sc+'</button>':'<button class="pill on-card" data-act="skinCase" data-m="gold">'+GOLD(L.SKIN_CASE.gold)+'</button><button class="pill on-card" data-act="skinCase" data-m="key">'+ic('key')+L.SKIN_CASE.keys+'</button>')+'</span></div>'+
    '<div class="gc g-pink" style="width:min(78vw,300px);height:190px"><span class="art" style="right:14px;top:16px;display:grid;grid-template-columns:repeat(2,40px);gap:4px">'+['crown','bolt','gem','flame'].map(k=>'<img src="'+Draw.stickerURL(k,80)+'" width="40" height="40" alt="">').join('')+'</span><span class="k">\u0414\u043b\u044f \u043c\u0430\u0448\u0438\u043d\u044b \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430</span><span class="t">\u041a\u0435\u0439\u0441 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438</span><span class="s">\u0422\u043e\u043b\u044c\u043a\u043e \u0437\u0430 \u0433\u043e\u043b\u0434\u0443</span>'+
      '<span class="act">'+(S.free.tc>0?'<button class="pill on-card" data-act="stickerCase" data-m="free">\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e \u00d7'+S.free.tc+'</button>':'<button class="pill on-card" data-act="stickerCase" data-m="gold">'+GOLD(L.STICKER_CASE.gold)+'</button>')+'</span></div>'+
  '</div>';
  const cv=$('cs-skinart');if(cv)Draw.preview(cv,'car',{skin:'car:sport',c1:'white',c2:'purple',wh:'chrome',kit:'spoiler'},{floor:false,k:.95});
}
function renderMine(){
  const el=$('cs-mine');if(!el)return;
  const list=S.box.slice().sort((a,b)=>b.t-a.t).slice(0,12);
  el.innerHTML=secH('\u041c\u043e\u0438 \u043d\u043e\u043c\u0435\u0440\u0430','plates')+(list.length?'<div class="shelf">'+list.map(it=>'<button class="mat" data-act="insp" data-id="'+it.id+'" style="width:190px;display:grid;gap:8px;padding:12px;text-align:left;background:var(--card)">'+plateHTML(it)+'<span style="display:flex;justify-content:space-between;align-items:center;font:600 15px var(--f-ui)"><span class="num">'+fmt(it.price)+'</span><span class="matb" style="'+mc(it)+';height:20px;font-size:11px">'+matOf(it).n+'</span></span></button>').join('')+'</div><p class="note">\u0412\u0441\u0435\u0433\u043e '+S.box.length+' \u0438\u0437 '+L.BOX_CAP+' \u043d\u0430 \u0441\u0443\u043c\u043c\u0443 '+fmt(L.worth(S))+'</p>':'<div class="empty">\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043d\u043e\u043c\u0435\u0440\u0430 \u0438\u0437 \u043a\u0435\u0439\u0441\u043e\u0432</div>');
}
RENDER.casesFeed=()=>{
  const el=$('cs-feed');if(!el)return;
  const f=(Net.feed||[]).slice(0,12);
  if(!f.length){el.innerHTML='';return}
  el.innerHTML=secH('\u0421\u0435\u0439\u0447\u0430\u0441 \u0432\u044b\u0431\u0438\u0432\u0430\u044e\u0442')+'<div class="rows">'+f.map(feedRow).join('')+'</div>';
};
function feedRow(x){
  let what='',vis='',val='';
  if(x.k==='drop'||x.k==='up'){vis=plateHTML(x.it);what=(x.k==='up'?'\u0430\u043f\u0433\u0440\u0435\u0439\u0434, ':'')+matOf(x.it).n.toLowerCase();val=fmt(x.p)}
  else if(x.k==='sale'){if(x.kind==='plate'||!x.kind){vis=plateHTML(x.it||{pl:x.pl});what='\u043a\u0443\u043f\u0438\u043b \u0443 '+esc(x.s)}else{vis='<img src="'+Draw.stickerURL(x.kind==='sticker'?x.it.v:'star',64)+'" width="44" height="44" alt="">';what='\u043a\u0443\u043f\u0438\u043b '+(x.kind==='skin'?'\u0441\u043a\u0438\u043d':'\u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0443')+' \u0443 '+esc(x.s)}val=x.cur==='gold'?gem(x.p):fmt(x.p)}
  else if(x.k==='run'){vis='<span class="ico" style="background:'+(x.g==='stunt'?'var(--blue)':'var(--orange)')+'">'+ic(x.g==='stunt'?'bike':'car')+'</span>';what='\u0440\u0435\u043a\u043e\u0440\u0434 \u0432 '+(x.g==='stunt'?'\u0421\u0442\u0430\u043d\u0442\u0435':'Rider');val=fmtN(x.sc)+' \u043e\u0447\u043a\u043e\u0432'}
  else if(x.k==='skin'||x.k==='sticker'){vis='<span class="ico" style="background:var(--purple)">'+ic(x.k==='skin'?'car':'sticker')+'</span>';what='\u0432\u044b\u0431\u0438\u043b '+(x.k==='skin'?'\u0441\u043a\u0438\u043d \u00ab'+esc((SKINS[x.v]||{}).n||'')+'\u00bb':'\u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0443 \u00ab'+esc((STICKERS[x.v]||{}).n||'')+'\u00bb')}
  return'<button class="row" data-act="profile" data-uid="'+esc(x.u||'')+'">'+(x.k==='drop'||x.k==='up'||(x.k==='sale'&&(x.kind==='plate'||!x.kind))?'<div style="width:104px;flex:none">'+vis+'</div>':vis.startsWith('<span')?vis:'<span class="ico" style="background:var(--card2)">'+vis+'</span>')+
    '<div class="mid"><div class="tt">'+esc(x.n||'\u0418\u0433\u0440\u043e\u043a')+'</div><div class="ss" style="white-space:nowrap">'+what+'</div><div class="ey">'+ago(x.t)+'</div></div><div class="end"><span class="val">'+val+'</span></div></button>';
}

/* ---------- \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u0441 \u043d\u043e\u043c\u0435\u0440\u043e\u043c ---------- */
const boxItem=el=>S.box.find(b=>b.id===+el.dataset.id);
ACT.insp=el=>{
  const it=boxItem(el);if(!it)return;
  const mounted=S.veh.car.plate===it.id?'car':S.veh.bike.plate===it.id?'bike':'';
  inspect(it,{actions:
    '<div class="rowf"><button class="btn md" data-act="quick" data-id="'+it.id+'" data-close="1">\u0421\u043a\u0443\u043f\u0449\u0438\u043a\u0443 '+fmt(Math.floor(it.price*L.BUYBACK))+'</button><button class="btn md" data-act="sell" data-id="'+it.id+'" data-k="plate">\u041d\u0430 \u0440\u044b\u043d\u043e\u043a</button></div>'+
    '<div class="rowf"><button class="btn md" data-act="mount" data-id="'+it.id+'" data-v="car">'+ic('car')+(mounted==='car'?'\u0421\u043d\u044f\u0442\u044c':'\u041d\u0430 \u043c\u0430\u0448\u0438\u043d\u0443')+'</button><button class="btn md" data-act="mount" data-id="'+it.id+'" data-v="bike">'+ic('bike')+(mounted==='bike'?'\u0421\u043d\u044f\u0442\u044c':'\u041d\u0430 \u043f\u0438\u0442\u0431\u0430\u0439\u043a')+'</button></div>'+
    '<button class="btn md wide" data-act="pin" data-id="'+it.id+'" data-close="1">'+ic('pin')+(it.pin?'\u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u044c':'\u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c, \u0447\u0442\u043e\u0431\u044b \u043d\u0435 \u043f\u0440\u043e\u0434\u0430\u0442\u044c \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e')+'</button>'});
};
ACT.pin=el=>{run('pin',{id:+el.dataset.id},{quiet:true});if(el.dataset.close)Sheet.close();Haptic.tap()};
ACT.quick=el=>{
  const it=boxItem(el);if(!it)return;
  if(it.pin){toast('\u041d\u043e\u043c\u0435\u0440 \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d. \u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0434\u0430\u0442\u044c','err');return}
  const go=()=>run('quick',{id:it.id},{btn:el,key:'quick'+it.id,ok:()=>{Snd.coin();if(lastDrop&&lastDrop.id===it.id)lastDrop=null;if(el.dataset.close)Sheet.close()}});
  if(it.price>=20000||it.m>=3)confirmSheet('\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443?',esc(plateText(it.pl))+' \u0437\u0430 '+fmt(Math.floor(it.price*L.BUYBACK))+'. \u041d\u0430 \u0440\u044b\u043d\u043a\u0435 \u043c\u043e\u0436\u043d\u043e \u0432\u044b\u0440\u0443\u0447\u0438\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435.','\u041f\u0440\u043e\u0434\u0430\u0442\u044c',go);else go();
};
ACT.mount=el=>{const id=+el.dataset.id,v=el.dataset.v;const cur=S.veh[v].plate===id;run('vset',{v,f:'plate',val:cur?0:id},{quiet:true,ok:()=>{toast(cur?'\u041d\u043e\u043c\u0435\u0440 \u0441\u043d\u044f\u0442':'\u041d\u043e\u043c\u0435\u0440 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d \u043d\u0430 '+(v==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a'));Sheet.close()}})};
ACT.skinCase=el=>openCos('skinCase',el.dataset.m,el);
ACT.stickerCase=el=>openCos('stickerCase',el.dataset.m,el);
async function openCos(a,m,btn){
  if(a==='skinCase'&&m==='gold'&&S.gold<L.SKIN_CASE.gold){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(L.SKIN_CASE.gold-S.gold),'err');return}
  if(a==='skinCase'&&m==='key'&&S.keys<L.SKIN_CASE.keys){toast('\u041d\u0443\u0436\u043d\u043e '+keyN(L.SKIN_CASE.keys),'err');return}
  if(a==='stickerCase'&&m==='gold'&&S.gold<L.STICKER_CASE.gold){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(L.STICKER_CASE.gold-S.gold),'err');return}
  const r=await run(a,{free:m==='free',key:m==='key'},{btn,quiet:true});
  if(!r||!r.inv)return;
  cosReveal(r.inv);
}
function invLook(x){const s=SKINS[x.v],t=STICKERS[x.v];return s?{n:s.n,r:L.SKIN_R[s.r],v:s.v,kind:x.v.startsWith('car')?'car':'bike'}:{n:t.n,r:L.STK_R[t.r],v:t.v,kind:'sticker'}}
function invPreview(x,w,h){
  const lk=invLook(x);
  if(lk.kind==='sticker')return'<img src="'+Draw.stickerURL(x.v,128)+'" width="'+Math.min(w,h)+'" height="'+Math.min(w,h)+'" alt="">';
  return'<canvas data-skin="'+esc(x.v)+'" style="width:'+w+'px;height:'+h+'px"></canvas>';
}
function hydrateSkins(root){qsa('canvas[data-skin]',root).forEach(cv=>{const v=cv.dataset.skin;const k=v.startsWith('car')?'car':'bike';const V=S.veh[k];Draw.preview(cv,k,{skin:v,c1:cv.dataset.c1||V.c1,c2:cv.dataset.c2||V.c2,wh:V.wh,kit:'none'},{floor:false})})}
function cosReveal(x){
  const lk=invLook(x);
  const sh=Sheet.open({title:'',body:'<div style="display:grid;justify-items:center;gap:10px;padding:10px var(--g) 0;text-align:center"><div id="cos-spin" style="height:170px;display:grid;place-items:center"></div><div id="cos-res" style="opacity:0;transition:opacity .4s;display:grid;gap:8px;justify-items:center"><span class="matb" style="--mc:'+lk.r.c+'">'+lk.r.n+'</span><div style="font:700 26px var(--f-ui)">'+esc(lk.n)+'</div><div class="muted">'+(lk.kind==='sticker'?'\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430':lk.kind==='car'?'\u0421\u043a\u0438\u043d \u043c\u0430\u0448\u0438\u043d\u044b':'\u0421\u043a\u0438\u043d \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430')+' \u00b7 \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u044c '+gem(lk.v)+'</div></div></div>'+
    '<div class="foot" id="cos-acts" style="opacity:0;transition:opacity .4s">'+(lk.kind==='sticker'?'<button class="btn pri wide" data-act="garage" data-v="car">\u041d\u0430\u043a\u043b\u0435\u0438\u0442\u044c \u0432 \u0433\u0430\u0440\u0430\u0436\u0435</button>':'<button class="btn pri wide" data-act="equip" data-id="'+x.id+'">\u041f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 '+(lk.kind==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a')+'</button>')+'<button class="btn wide" data-act="sheetx">\u0413\u043e\u0442\u043e\u0432\u043e</button></div>'});
  const box=sh.querySelector('#cos-spin');
  const pool=lk.kind==='sticker'?Object.keys(STICKERS):Object.keys(SKINS).filter(k=>k.startsWith(lk.kind)&&!SKINS[k].free&&!SKINS[k].season);
  let n=0;const steps=14;
  const show=v=>{box.innerHTML=lk.kind==='sticker'?'<img src="'+Draw.stickerURL(v,256)+'" width="150" height="150" alt="">':'<canvas width="260" height="160" style="width:260px;height:160px"></canvas>';const cv=box.querySelector('canvas');if(cv){const V=S.veh[lk.kind];Draw.preview(cv,lk.kind,{skin:v,c1:V.c1,c2:V.c2,wh:V.wh})}};
  const tick=()=>{if(!document.body.contains(box))return;n++;if(n>=steps){show(x.v);box.classList.add('popin');sh.querySelector('#cos-res').style.opacity=1;sh.querySelector('#cos-acts').style.opacity=1;Snd.win(lk.r===L.SKIN_R[3]||lk.r===L.STK_R[3]?4:2);Haptic.ok();return}show(L.pick(pool));Snd.tick();Haptic.tick();setTimeout(tick,50+n*n*2.2)};
  tick();
}
ACT.equip=el=>{const x=S.inv.find(i=>i.id===+el.dataset.id);if(!x)return;const v=x.v.startsWith('car')?'car':'bike';run('vset',{v,f:'skin',val:x.v},{quiet:true,ok:()=>{Sheet.close();toast('\u0421\u043a\u0438\u043d \u00ab'+SKINS[x.v].n+'\u00bb \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d')}})};

/* ================= \u043c\u043e\u0438 \u043d\u043e\u043c\u0435\u0440\u0430 \u0438 \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c ================= */
let pF={c:'all',m:-1,sort:'price'};
ACT.plates=()=>Page.push('plates','\u041c\u043e\u0438 \u043d\u043e\u043c\u0435\u0440\u0430',renderPlates);
function renderPlates(el){
  let list=S.box.slice();
  if(pF.c!=='all')list=list.filter(x=>x.pl.c===pF.c);
  if(pF.m>=0)list=list.filter(x=>x.m===pF.m);
  const so={price:(a,b)=>b.price-a.price,cheap:(a,b)=>a.price-b.price,new:(a,b)=>b.t-a.t,float:(a,b)=>a.f-b.f}[pF.sort];list.sort(so);
  const cs=['all'].concat(COUNTRIES.concat(['sp']).filter(c=>S.box.some(x=>x.pl.c===c)));
  el.innerHTML='<p class="lead">'+S.box.length+' \u0438\u0437 '+L.BOX_CAP+' \u00b7 \u043d\u0430 \u0441\u0443\u043c\u043c\u0443 '+fmt(L.worth(S))+'</p>'+
    '<div class="seg">'+cs.map(c=>'<button class="'+(pF.c===c?'on':'')+'" data-act="pfc" data-c="'+c+'">'+(c==='all'?'\u0412\u0441\u0435':c==='sp'?'\u041e\u0441\u043e\u0431\u044b\u0435':CN_SHORT[c])+'</button>').join('')+'</div>'+
    '<div class="seg"><button class="'+(pF.m<0?'on':'')+'" data-act="pfm" data-m="-1">\u041b\u044e\u0431\u043e\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</button>'+MATS.map((m,i)=>'<button class="'+(pF.m===i?'on':'')+'" data-act="pfm" data-m="'+i+'">'+m.n+'</button>').join('')+'</div>'+
    '<div class="pad" style="margin:8px 0 12px"><div class="segbox">'+[['price','\u0414\u043e\u0440\u043e\u0436\u0435'],['cheap','\u0414\u0435\u0448\u0435\u0432\u043b\u0435'],['new','\u041d\u043e\u0432\u044b\u0435'],['float','\u041c\u0435\u043d\u044c\u0448\u0435 \u0438\u0437\u043d\u043e\u0441']].map(s=>'<button class="'+(pF.sort===s[0]?'on':'')+'" data-act="pfs" data-s="'+s[0]+'">'+s[1]+'</button>').join('')+'</div></div>'+
    (list.length?'<div class="grid2">'+list.map(it=>'<button class="mat" data-act="insp" data-id="'+it.id+'" style="display:grid;gap:8px;padding:12px;text-align:left;background:var(--card);position:relative">'+plateHTML(it)+
      '<span style="display:flex;justify-content:space-between;align-items:center;gap:6px"><span class="num" style="font:600 15px var(--f-ui)">'+fmt(it.price)+'</span>'+(it.pin?'<span style="color:var(--accent);width:16px;height:16px">'+ic('pin')+'</span>':'')+'</span>'+
      '<span style="display:flex;gap:4px;flex-wrap:wrap"><span class="matb" style="'+mc(it)+';height:20px;font-size:11px">'+matOf(it).n+'</span><span class="badge" style="height:20px;font-size:11px">'+appraise(it).wear.k+'</span></span></button>').join('')+'</div>':'<div class="empty">\u041d\u0435\u0442 \u043d\u043e\u043c\u0435\u0440\u043e\u0432 \u0441 \u0442\u0430\u043a\u0438\u043c\u0438 \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u043c\u0438</div>')+
    '<div class="sec">\u0421\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443</div><div class="group">'+
      '<button class="li" data-act="bulk" data-k="paper"><span class="lic" style="background:var(--card3)">'+ic('trash')+'</span><span class="lt">\u0412\u0441\u0435 \u0431\u0443\u043c\u0430\u0436\u043d\u044b\u0435</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="bulk" data-k="cheap"><span class="lic" style="background:var(--orange)">'+ic('tag')+'</span><span class="lt">\u0414\u0435\u0448\u0435\u0432\u043b\u0435 1 000 \u20bd</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="bulk" data-k="all"><span class="lic" style="background:var(--red)">'+ic('trash')+'</span><span class="lt">\u0412\u0441\u0435 \u043d\u0435\u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d\u043d\u044b\u0435</span>'+ic('chev','chev')+'</button></div>'+
    '<p class="note">\u0417\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d\u043d\u044b\u0435 \u0438 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044b\u0435 \u043d\u0430 \u043c\u0430\u0448\u0438\u043d\u0443 \u043d\u043e\u043c\u0435\u0440\u0430 \u043d\u0435 \u043f\u0440\u043e\u0434\u0430\u044e\u0442\u0441\u044f. \u0421\u043a\u0443\u043f\u0449\u0438\u043a \u043f\u043b\u0430\u0442\u0438\u0442 '+Math.round(L.BUYBACK*100)+'% \u043e\u0446\u0435\u043d\u043a\u0438.</p>';
}
ACT.pfc=el=>{pF.c=el.dataset.c;Page.renderTop()};
ACT.pfm=el=>{pF.m=+el.dataset.m;Page.renderTop()};
ACT.pfs=el=>{pF.sort=el.dataset.s;Page.renderTop()};
ACT.bulk=el=>{
  const k=el.dataset.k;const l=S.box.filter(x=>!x.pin&&!L.plateLocked(S,x.id)&&(k==='all'||(k==='paper'?x.m===0:x.price<1000)));
  if(!l.length){toast('\u041d\u0435\u0447\u0435\u0433\u043e \u0441\u0434\u0430\u0432\u0430\u0442\u044c');return}
  const sum=l.reduce((s,x)=>s+Math.floor(x.price*L.BUYBACK),0);
  confirmSheet('\u0421\u0434\u0430\u0442\u044c '+l.length+' \u0448\u0442.?','\u0421\u043a\u0443\u043f\u0449\u0438\u043a \u0437\u0430\u043f\u043b\u0430\u0442\u0438\u0442 '+fmt(sum)+'.','\u0421\u0434\u0430\u0442\u044c',()=>run('bulk',{k},{ok:()=>Snd.coin()}),k==='all');
};

/* ---------- \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c: \u0441\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 ---------- */
let invF='all';
ACT.inventory=()=>Page.push('inv','\u0421\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438',renderInv);
function renderInv(el){
  let list=S.inv.slice();if(invF!=='all')list=list.filter(x=>invF==='sticker'?x.k==='sticker':x.v.startsWith(invF));
  list.sort((a,b)=>invLook(b).v-invLook(a).v||b.t-a.t);
  el.innerHTML='<p class="lead">'+S.inv.length+' \u0438\u0437 '+L.INV_CAP+'</p><div class="seg">'+[['all','\u0412\u0441\u0451'],['car','\u041c\u0430\u0448\u0438\u043d\u044b'],['bike','\u041f\u0438\u0442\u0431\u0430\u0439\u043a\u0438'],['sticker','\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0438']].map(s=>'<button class="'+(invF===s[0]?'on':'')+'" data-act="invf" data-f="'+s[0]+'">'+s[1]+'</button>').join('')+'</div><div style="height:10px"></div>'+
    (list.length?'<div class="grid2">'+list.map(x=>{const lk=invLook(x);return'<button class="mat" data-act="invItem" data-id="'+x.id+'" style="display:grid;gap:6px;justify-items:center;padding:12px;background:var(--card);position:relative"><span style="position:absolute;left:12px;right:12px;top:8px;height:3px;border-radius:3px;background:'+lk.r.c+'"></span>'+invPreview(x,140,80)+'<span style="font:600 15px var(--f-ui)">'+esc(lk.n)+'</span><span class="muted" style="font-size:12px">'+lk.r.n+' \u00b7 '+gem(lk.v)+'</span></button>'}).join('')+'</div>':'<div class="empty">\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043a\u0435\u0439\u0441 \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438 \u0438\u043b\u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438</div>');
  hydrateSkins(el);
}
ACT.invf=el=>{invF=el.dataset.f;Page.renderTop()};
ACT.invItem=el=>{
  const x=S.inv.find(i=>i.id===+el.dataset.id);if(!x)return;const lk=invLook(x);
  const kind=x.k;const on=kind==='skin'&&(S.veh.car.skin===x.v||S.veh.bike.skin===x.v);
  Sheet.open({title:lk.n,lead:lk.r.n+' \u00b7 '+(lk.kind==='sticker'?'\u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430':lk.kind==='car'?'\u0441\u043a\u0438\u043d \u043c\u0430\u0448\u0438\u043d\u044b':'\u0441\u043a\u0438\u043d \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430')+' \u00b7 \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u044c '+gem(lk.v),body:
    '<div style="display:grid;place-items:center;padding:6px 0 10px">'+invPreview(x,280,160)+'</div>'+
    '<div class="foot">'+(kind==='skin'?'<button class="btn pri wide" data-act="equip" data-id="'+x.id+'">'+(on?'\u0423\u0436\u0435 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d':'\u041f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 '+(lk.kind==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a'))+'</button>':'<button class="btn pri wide" data-act="garage" data-v="car">\u041d\u0430\u043a\u043b\u0435\u0438\u0442\u044c \u0432 \u0433\u0430\u0440\u0430\u0436\u0435</button>')+
    '<div class="rowf"><button class="btn md" data-act="sell" data-id="'+x.id+'" data-k="'+kind+'">\u041d\u0430 \u0440\u044b\u043d\u043e\u043a</button><button class="btn md" data-act="sellInv" data-id="'+x.id+'">\u0421\u043a\u0443\u043f\u0449\u0438\u043a\u0443</button></div>'+(kind==='skin'?'<button class="btn md wide" data-act="upFrom" data-k="inv">'+ic('up')+'\u0410\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440</button>':'')+'</div>'});
  hydrateSkins(Sheet.cur.el);
};
ACT.sellInv=async el=>{
  const x=S.inv.find(i=>i.id===+el.dataset.id);if(!x)return;
  el.classList.add('busy');let pay=0;
  try{const r=await act('quote',{v:x.v});pay=r.pay}catch(e){toast(e.message,'err');el.classList.remove('busy');return}
  el.classList.remove('busy');
  confirmSheet('\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443?',esc(invLook(x).n)+' \u0437\u0430 '+gem(pay)+'. \u0426\u0435\u043d\u0430 \u2014 \u043c\u0435\u0434\u0438\u0430\u043d\u0430 \u043d\u0435\u0434\u0430\u0432\u043d\u0438\u0445 \u043f\u0440\u043e\u0434\u0430\u0436 \u043c\u0438\u043d\u0443\u0441 13%.','\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u0437\u0430 '+gem(pay),()=>run('sellInv',{id:x.id},{ok:()=>Snd.coin()}));
};

/* ---------- \u0432\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0440\u044b\u043d\u043e\u043a ---------- */
ACT.sell=el=>{
  const k=el.dataset.k||'plate',id=+el.dataset.id;
  const x=k==='plate'?S.box.find(b=>b.id===id):S.inv.find(b=>b.id===id);if(!x)return;
  if(k==='plate'&&x.pin){toast('\u041d\u043e\u043c\u0435\u0440 \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d. \u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0434\u0430\u0442\u044c','err');return}
  const gold=k!=='plate';const base=gold?invLook(x).v:x.price;
  const best=bestOrderFor(k,x);
  const name=gold?esc(invLook(x).n):esc(plateText(x.pl));
  const sug=gold?[Math.round(base*.9),base,Math.round(base*1.2)]:[L.niceRound(base*.9),base,L.niceRound(base*1.25)];
  Sheet.open({title:'\u0412\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0440\u044b\u043d\u043e\u043a',lead:name+(gold?' \u00b7 \u043f\u0440\u043e\u0434\u0430\u0436\u0430 \u0437\u0430 \u0433\u043e\u043b\u0434\u0443':' \u00b7 \u043f\u0440\u043e\u0434\u0430\u0436\u0430 \u0437\u0430 \u0440\u0443\u0431\u043b\u0438'),body:
    (gold?'<div style="display:grid;place-items:center">'+invPreview(x,240,130)+'</div>':'<div class="pad" style="margin-bottom:12px">'+plateHTML(x)+'</div>')+
    (best?'<div class="row" style="margin:0 var(--g) 12px;width:auto;background:rgba(48,209,88,.14)"><div class="mid"><div class="tt" style="font-size:16px">\u0415\u0441\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 '+(gold?gem(best.price):fmt(best.price))+'</div><div class="ss">\u041f\u043e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0446\u0435\u043d\u0443 \u043d\u0435 \u0432\u044b\u0448\u0435 \u2014 \u043f\u0440\u043e\u0434\u0430\u0441\u0442\u0441\u044f \u0441\u0440\u0430\u0437\u0443</div></div><button class="pill" data-act="sellAt" data-p="'+best.price+'">\u0412\u0437\u044f\u0442\u044c</button></div>':'')+
    '<div class="field"><label for="ask">\u0426\u0435\u043d\u0430, '+(gold?'\u0433\u043e\u043b\u0434\u0430':'\u20bd')+'</label><input class="inp num" id="ask" inputmode="numeric" value="'+base+'" data-on="ask"></div>'+
    '<div class="pad" style="display:flex;gap:8px;flex-wrap:wrap">'+sug.map(v=>'<button class="pill" data-act="sellAt" data-p="'+v+'">'+(gold?gem(v):fmt(v))+'</button>').join('')+'</div>'+
    '<p class="note" id="ask-note"></p>'+
    '<div class="foot"><button class="btn pri wide" data-act="doList" data-k="'+k+'" data-id="'+id+'">\u0412\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c</button></div>'});
  ON.ask();
};
ON.ask=()=>{const i=$('ask');const n=$('ask-note');if(!i||!n)return;const v=Math.max(0,Math.round(+String(i.value).replace(/\D/g,'')||0));const gold=!!qs('[data-act=doList][data-k=skin],[data-act=doList][data-k=sticker]');n.textContent='\u041a\u043e\u043c\u0438\u0441\u0441\u0438\u044f \u0440\u044b\u043d\u043a\u0430 '+Math.round(L.FEE*100)+'%. \u0412\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 '+(gold?gem(Math.floor(v*(1-L.FEE))):fmt(Math.floor(v*(1-L.FEE))))+'.'};
ACT.sellAt=el=>{const i=$('ask');if(i){i.value=el.dataset.p;ON.ask()}};
ACT.doList=el=>{const ask=Math.round(+String($('ask').value).replace(/\D/g,''));run('list',{kind:el.dataset.k,id:+el.dataset.id,ask},{btn:el,ok:()=>{Sheet.close();if(lastDrop&&lastDrop.id===+el.dataset.id)lastDrop=null;loadPub('market')}})};
function bestOrderFor(k,x){
  const l=listingKey(k,x);
  return(Net.orders||[]).filter(o=>o.uid!==Net.me.uid&&o.kind===k&&(k==='plate'?((o.spec.c==='*'||o.spec.c===x.pl.c)&&o.spec.m===x.m&&x.f<WEARS[o.spec.w].max):o.key===l)).sort((a,b)=>b.price-a.price)[0]||null;
}
function listingKey(k,x){return k==='plate'?'p:'+x.pl.c+':'+x.m:x.v}

/* ================= \u0432\u043a\u043b\u0430\u0434\u043a\u0430 \u00ab\u0418\u0433\u0440\u044b\u00bb ================= */
const GAMES=[
  {id:'rider',n:'Rider',s:'\u0424\u043b\u0438\u043f\u044b, \u0442\u0440\u0430\u043c\u043f\u043b\u0438\u043d\u044b \u0438 \u043a\u0430\u043d\u0438\u0441\u0442\u0440\u044b \u0441 \u0442\u043e\u043f\u043b\u0438\u0432\u043e\u043c',fb:'#6b3200',gi:'var(--orange)',i:'car',tint:'#ffd6a8'},
  {id:'stunt',n:'\u0421\u0442\u0430\u043d\u0442',s:'\u0414\u0435\u0440\u0436\u0438 \u0432\u0438\u043b\u043b\u0438 \u043d\u0430 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0435 \u043a\u0430\u043a \u043c\u043e\u0436\u043d\u043e \u0434\u043e\u043b\u044c\u0448\u0435',fb:'#08306e',gi:'var(--blue)',i:'bike',tint:'#b9dcff'},
  {id:'gas',n:'\u0413\u0430\u0437 \u0432 \u043f\u043e\u043b',s:'\u041a\u0442\u043e \u0431\u044b\u0441\u0442\u0440\u0435\u0435 \u0436\u043c\u0451\u0442 \u0433\u0430\u0437: \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u043e\u0442\u0430 \u0438\u043b\u0438 \u0441 \u0434\u0440\u0443\u0437\u044c\u044f\u043c\u0438',fb:'#6e100c',gi:'var(--red)',i:'speed',tint:'#ffc6bf'}
];
RENDER.games=()=>{
  const el=$('t-games');const t=now();
  const lim=g=>{const left=L.gameLeft(S,g,t),rs=L.gameReset(S,g,t);const e=L.GAME_CAP-left;return{left,rs,e}};
  const r=lim('rider'),st=lim('stunt');
  const keyP=S.games.acc/L.KEY_EVERY;
  el.innerHTML=topHTML('\u0418\u0433\u0440\u044b')+
    '<div class="shelf" style="margin-top:14px">'+GAMES.map(g=>'<button class="feature" data-act="play" data-g="'+g.id+'" style="--fb:'+g.fb+';--tint:'+g.tint+';text-align:left"><div class="pic"><canvas data-scene="'+g.id+'"></canvas>'+(g.id!=='gas'?'<span class="lbl badge" style="background:rgba(0,0,0,.35);color:#fff;backdrop-filter:blur(8px)">'+ic('star')+'1 \u043e\u0447\u043a\u043e = 1 \u20bd</span>':'<span class="lbl badge" style="background:rgba(0,0,0,.35);color:#fff">'+ic('person2')+'\u043e\u0442 1 \u0434\u043e 4 \u0438\u0433\u0440\u043e\u043a\u043e\u0432</span>')+'</div>'+
      '<div class="info"><span class="gi" style="background:'+g.gi+'">'+ic(g.i)+'</span><div class="mid"><div class="tt">'+g.n+'</div><div class="ss">'+g.s+'</div></div><span class="pill on-card">\u0418\u0433\u0440\u0430\u0442\u044c</span></div></button>').join('')+'</div>'+
    secH('\u0417\u0430\u0440\u0430\u0431\u043e\u0442\u043e\u043a')+
    '<div class="rows">'+[['rider','Rider',r],['stunt','\u0421\u0442\u0430\u043d\u0442',st]].map(([id,n,x])=>'<div class="row"><span class="ico" style="background:'+(id==='rider'?'var(--orange)':'var(--blue)')+'">'+ic(id==='rider'?'car':'bike')+'</span><div class="mid"><div class="tt">'+n+'</div><div class="ss num">'+fmt(x.e)+' \u0438\u0437 '+fmt(L.GAME_CAP)+(x.rs?' \u00b7 \u0441\u0431\u0440\u043e\u0441 \u0447\u0435\u0440\u0435\u0437 '+left(x.rs-t):' \u0437\u0430 12 \u0447\u0430\u0441\u043e\u0432')+'</div><div class="bar" style="margin-top:8px"><i style="width:'+(x.e/L.GAME_CAP*100).toFixed(1)+'%"></i></div></div></div>').join('')+
      '<div class="row"><span class="ico" style="background:var(--teal)">'+ic('key')+'</span><div class="mid"><div class="tt">\u041a\u043b\u044e\u0447 \u0437\u0430 \u043a\u0430\u0436\u0434\u044b\u0435 '+fmt(L.KEY_EVERY)+'</div><div class="ss num">\u0414\u043e \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0433\u043e \u043a\u043b\u044e\u0447\u0430 '+fmt(L.KEY_EVERY-S.games.acc)+'</div><div class="bar" style="margin-top:8px"><i style="width:'+(keyP*100).toFixed(1)+'%;background:linear-gradient(90deg,#6fe6ef,var(--teal))"></i></div></div></div></div>'+
    '<p class="note">\u0412 Rider \u0438 \u0421\u0442\u0430\u043d\u0442\u0435 \u043e\u0434\u043d\u043e \u043e\u0447\u043a\u043e \u2014 \u043e\u0434\u0438\u043d \u0440\u0443\u0431\u043b\u044c. \u041a\u0430\u0436\u0434\u0430\u044f \u0438\u0433\u0440\u0430 \u043f\u043b\u0430\u0442\u0438\u0442 \u0434\u043e '+fmt(L.GAME_CAP)+' \u0437\u0430 12 \u0447\u0430\u0441\u043e\u0432. \u041a\u043e\u0433\u0434\u0430 \u043b\u0438\u043c\u0438\u0442 \u043d\u0430\u0431\u0440\u0430\u043d, \u0437\u0430\u0435\u0437\u0434 \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 10 \u0441\u0435\u043a\u0443\u043d\u0434.</p>'+
    secH('\u0420\u0435\u043a\u043e\u0440\u0434\u044b')+
    '<div class="grid2">'+[['rider','Rider','g-orange'],['stunt','\u0421\u0442\u0430\u043d\u0442','g-blue']].map(([id,n,g])=>'<div class="gc '+g+'" style="height:120px"><span class="k">'+n+'</span><span class="t num" style="font-size:28px;font-weight:800">'+fmtN(S.games[id].best)+'</span><span class="s">\u043b\u0443\u0447\u0448\u0438\u0439 \u0437\u0430\u0435\u0437\u0434</span></div>').join('')+'</div>'+
    secH('\u0421\u0432\u043e\u044f \u043c\u0443\u0437\u044b\u043a\u0430','music')+
    '<div class="rows"><button class="row" data-act="music"><span class="ico" style="background:var(--pink)">'+ic('music')+'</span><div class="mid"><div class="tt">'+(Music.count()?Music.count()+' '+plural(Music.count(),'\u0442\u0440\u0435\u043a','\u0442\u0440\u0435\u043a\u0430','\u0442\u0440\u0435\u043a\u043e\u0432'):'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0442\u0440\u0435\u043a\u0438')+'</div><div class="ss">\u0418\u0433\u0440\u0430\u0435\u0442 \u0432\u043e \u0432\u0440\u0435\u043c\u044f \u0437\u0430\u0435\u0437\u0434\u043e\u0432. \u0425\u0440\u0430\u043d\u0438\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 \u044d\u0442\u043e\u043c \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435</div></div>'+ic('chev','chev')+'</button></div>';
  hydrateAvas(el);
  requestAnimationFrame(()=>qsa('canvas[data-scene]',el).forEach(cv=>Draw.scene(cv,cv.dataset.scene)));
};
ACT.play=el=>{
  const g=el.dataset.g;
  if(g==='gas'){Games.gas();return}
  if(Net.status!=='on'){toast('\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u0417\u0430\u0435\u0437\u0434 \u043d\u0435 \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044f','err')}
  Games.open(g);
};

/* ---------- \u0441\u0432\u043e\u044f \u043c\u0443\u0437\u044b\u043a\u0430: \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435 (IndexedDB) ---------- */
const Music=(()=>{
  let db=null,list=[],audio=null,cur=-1,ready=null;
  function open(){
    if(ready)return ready;
    ready=new Promise(res=>{try{const r=indexedDB.open('nomera_music',1);r.onupgradeneeded=()=>r.result.createObjectStore('t',{keyPath:'id'});r.onsuccess=()=>{db=r.result;const tx=db.transaction('t').objectStore('t').getAll();tx.onsuccess=()=>{list=(tx.result||[]).map(x=>({id:x.id,name:x.name,size:x.size}));res()};tx.onerror=()=>res()};r.onerror=()=>res()}catch(e){res()}});
    return ready;
  }
  open();
  const on=()=>lsGet('nomera2_music')!=='0';
  return{
    count:()=>list.length,list:()=>list,on,
    set(v){lsSet('nomera2_music',v?'1':'0');if(!v)this.stop()},
    async add(files){
      await open();if(!db)throw new Error('\u0411\u0440\u0430\u0443\u0437\u0435\u0440 \u043d\u0435 \u0434\u0430\u0451\u0442 \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0444\u0430\u0439\u043b\u044b');
      for(const f of files){if(!/^audio\//.test(f.type)&&!/\.(mp3|m4a|aac|ogg|wav|flac)$/i.test(f.name))continue;if(f.size>40e6){toast('\u00ab'+f.name+'\u00bb \u0431\u043e\u043b\u044c\u0448\u0435 40 \u041c\u0411','err');continue}
        const id='m'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
        await new Promise((res,rej)=>{const tx=db.transaction('t','readwrite');tx.objectStore('t').put({id,name:f.name.replace(/\.[^.]+$/,''),size:f.size,blob:f});tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});
        list.push({id,name:f.name.replace(/\.[^.]+$/,''),size:f.size});
      }
    },
    async del(id){await open();if(!db)return;await new Promise(res=>{const tx=db.transaction('t','readwrite');tx.objectStore('t').delete(id);tx.oncomplete=res;tx.onerror=res});list=list.filter(x=>x.id!==id)},
    async play(){
      if(!on()||!list.length)return;await open();if(!db)return;
      cur=(cur+1)%list.length;const id=list[cur].id;
      const rec=await new Promise(res=>{const tx=db.transaction('t').objectStore('t').get(id);tx.onsuccess=()=>res(tx.result);tx.onerror=()=>res(null)});
      if(!rec)return;this.stop();audio=new Audio(URL.createObjectURL(rec.blob));audio.volume=.7;audio.onended=()=>this.play();audio.play().catch(()=>{});
    },
    stop(){if(audio){try{audio.pause();URL.revokeObjectURL(audio.src)}catch(e){}audio=null}},
    playing:()=>!!audio
  };
})();
ACT.music=()=>Page.push('music','\u0421\u0432\u043e\u044f \u043c\u0443\u0437\u044b\u043a\u0430',renderMusic);
function renderMusic(el){
  const l=Music.list();
  el.innerHTML='<p class="lead">\u0422\u0440\u0435\u043a\u0438 \u0438\u0433\u0440\u0430\u044e\u0442 \u043f\u043e \u043a\u0440\u0443\u0433\u0443 \u0432\u043e \u0432\u0440\u0435\u043c\u044f Rider \u0438 \u0421\u0442\u0430\u043d\u0442\u0430. \u0424\u0430\u0439\u043b\u044b \u043e\u0441\u0442\u0430\u044e\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 \u044d\u0442\u043e\u043c \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435, \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u0442\u0441\u044f.</p>'+
    '<div class="group"><div class="li noic"><span class="lt">\u041c\u0443\u0437\u044b\u043a\u0430 \u0432 \u0438\u0433\u0440\u0430\u0445</span><button class="pill" data-act="musicOn">'+(Music.on()?'\u0412\u043a\u043b\u044e\u0447\u0435\u043d\u0430':'\u0412\u044b\u043a\u043b\u044e\u0447\u0435\u043d\u0430')+'</button></div></div>'+
    '<div class="sec">\u0422\u0440\u0435\u043a\u0438</div>'+(l.length?'<div class="group">'+l.map(t=>'<div class="li"><span class="lic" style="background:var(--pink)">'+ic('music')+'</span><span class="lt" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(t.name)+'</span><span class="lv num">'+(t.size/1e6).toFixed(1).replace('.',',')+' \u041c\u0411</span><button class="iconbtn" data-act="musicDel" data-id="'+t.id+'" aria-label="\u0423\u0434\u0430\u043b\u0438\u0442\u044c">'+ic('trash')+'</button></div>').join('')+'</div>':'<div class="empty">\u041f\u043e\u043a\u0430 \u043f\u0443\u0441\u0442\u043e</div>')+
    '<div class="foot" style="padding-inline:var(--g)"><label class="btn pri wide" style="cursor:pointer">'+ic('plus')+'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0442\u0440\u0435\u043a\u0438<input type="file" accept="audio/*" multiple hidden data-on="musicFile"></label></div>';
}
ACT.musicOn=()=>{Music.set(!Music.on());Page.renderTop()};
ACT.musicDel=async el=>{await Music.del(el.dataset.id);Page.renderTop()};
ON.musicFileChange=async el=>{try{await Music.add([...el.files]);toast('\u0422\u0440\u0435\u043a\u0438 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u044b')}catch(e){toast(e.message,'err')}Page.renderTop()};

/* ================= \u0432\u043a\u043b\u0430\u0434\u043a\u0430 \u00ab\u0412\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u00bb ================= */
const INV_TILES=[
  {id:'market',n:'\u0420\u044b\u043d\u043e\u043a',s:'\u041d\u043e\u043c\u0435\u0440\u0430, \u0441\u043a\u0438\u043d\u044b, \u0437\u0430\u044f\u0432\u043a\u0438',g:'g-blue',i:'cart'},
  {id:'buyback',n:'\u0421\u043a\u0443\u043f\u0449\u0438\u043a',s:'\u0411\u044b\u0441\u0442\u0440\u0430\u044f \u043f\u0440\u043e\u0434\u0430\u0436\u0430',g:'g-orange',i:'tag'},
  {id:'shop',n:'\u041c\u0430\u0433\u0430\u0437\u0438\u043d \u0434\u043d\u044f',s:'\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u0432 \u043f\u043e\u043b\u043d\u043e\u0447\u044c',g:'g-red',i:'bag'},
  {id:'tote',n:'\u0422\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440',s:'\u0413\u043e\u043d\u043a\u0438 \u0441\u043a\u0438\u043d\u043e\u0432, \u00d72\u2013\u00d720',g:'g-green',i:'flag'},
  {id:'upgr',n:'\u0410\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440',s:'\u0428\u0430\u043d\u0441 \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u043e\u0439 \u043d\u043e\u043c\u0435\u0440',g:'g-purple',i:'up'},
  {id:'clicker',n:'\u041a\u043b\u0438\u043a\u0435\u0440',s:'\u041c\u0438\u043d\u0443\u0442\u0430 \u0437\u0430 \u043a\u043b\u044e\u0447',g:'g-yellow',i:'tap'},
  {id:'bank',n:'\u0411\u0430\u043d\u043a',s:'1% \u0432 \u0434\u0435\u043d\u044c',g:'g-teal',i:'bank'},
  {id:'exch',n:'\u041e\u0431\u043c\u0435\u043d',s:'\u041a\u043b\u044e\u0447\u0438 \u0438 \u0433\u043e\u043b\u0434\u0430',g:'g-indigo',i:'swap'}
];
RENDER.invest=()=>{
  const el=$('t-invest');
  const myL=Net.open.filter(l=>l.seller===Net.me.uid).length,myO=Net.orders.filter(o=>o.uid===Net.me.uid).length;
  const dep=S.bank.reduce((s,b)=>s+b.a,0);
  el.innerHTML=topHTML('\u0412\u043b\u043e\u0436\u0435\u043d\u0438\u044f')+
    '<div class="tiles" style="margin-top:14px">'+INV_TILES.map(t=>'<button class="tile '+t.g+'" data-act="inv_'+t.id+'"><span class="art">'+ic(t.i)+'</span><span class="t">'+t.n+'</span><span class="s">'+t.s+'</span></button>').join('')+'</div>'+
    secH('\u0421\u0432\u043e\u0434\u043a\u0430')+
    '<div class="rows">'+
      '<button class="row" data-act="inv_market"><span class="ico" style="background:var(--blue)">'+ic('cart')+'</span><div class="mid"><div class="tt">\u041c\u043e\u0438 \u043b\u043e\u0442\u044b \u0438 \u0437\u0430\u044f\u0432\u043a\u0438</div><div class="ss">'+myL+' '+plural(myL,'\u043b\u043e\u0442','\u043b\u043e\u0442\u0430','\u043b\u043e\u0442\u043e\u0432')+', '+myO+' '+plural(myO,'\u0437\u0430\u044f\u0432\u043a\u0430','\u0437\u0430\u044f\u0432\u043a\u0438','\u0437\u0430\u044f\u0432\u043e\u043a')+'</div></div>'+ic('chev','chev')+'</button>'+
      '<button class="row" data-act="inv_bank"><span class="ico" style="background:var(--teal)">'+ic('bank')+'</span><div class="mid"><div class="tt">\u0412\u043e \u0432\u043a\u043b\u0430\u0434\u0430\u0445</div><div class="ss num">'+(dep?fmt(dep)+' \u0432 '+S.bank.length+' '+plural(S.bank.length,'\u0432\u043a\u043b\u0430\u0434\u0435','\u0432\u043a\u043b\u0430\u0434\u0430\u0445','\u0432\u043a\u043b\u0430\u0434\u0430\u0445'):'\u041f\u043e\u043a\u0430 \u043d\u0438\u0447\u0435\u0433\u043e')+'</div></div>'+ic('chev','chev')+'</button>'+
    '</div>';
  hydrateAvas(el);
};
INV_TILES.forEach(t=>{ACT['inv_'+t.id]=()=>OPEN[t.id]()});
const OPEN={};

/* ---------- \u0440\u044b\u043d\u043e\u043a ---------- */
let mk={tab:'plate',c:'all',m:-1,w:4,sort:'cheap',q:''};
OPEN.market=()=>Page.push('market','\u0420\u044b\u043d\u043e\u043a',renderMarket);
function renderMarket(el){
  const tabs=[['plate','\u041d\u043e\u043c\u0435\u0440\u0430'],['skin','\u0421\u043a\u0438\u043d\u044b'],['sticker','\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0438'],['mine','\u041c\u043e\u0438 \u043b\u043e\u0442\u044b'],['orders','\u0417\u0430\u044f\u0432\u043a\u0438']];
  let body='';
  if(mk.tab==='plate')body=marketPlates();
  else if(mk.tab==='skin'||mk.tab==='sticker')body=marketTypes(mk.tab);
  else if(mk.tab==='mine')body=marketMine();
  else body=marketOrders();
  el.innerHTML='<p class="lead">\u041d\u043e\u043c\u0435\u0440\u0430 \u043f\u0440\u043e\u0434\u0430\u044e\u0442\u0441\u044f \u0437\u0430 \u0440\u0443\u0431\u043b\u0438, \u0441\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 \u2014 \u0437\u0430 \u0433\u043e\u043b\u0434\u0443. \u041a\u043e\u043c\u0438\u0441\u0441\u0438\u044f '+Math.round(L.FEE*100)+'%.</p><div class="seg">'+tabs.map(t=>'<button class="'+(mk.tab===t[0]?'on':'')+'" data-act="mkt" data-t="'+t[0]+'">'+t[1]+'</button>').join('')+'</div><div style="height:8px"></div>'+body;
  hydrateSkins(el);
}
ACT.mkt=el=>{mk.tab=el.dataset.t;Page.renderTop()};
function marketPlates(){
  let l=Net.open.filter(x=>x.kind==='plate');
  if(mk.c!=='all')l=l.filter(x=>x.c===mk.c);
  if(mk.m>=0)l=l.filter(x=>x.m===mk.m);
  if(mk.w<4)l=l.filter(x=>x.f<WEARS[mk.w].max);
  if(mk.q){const q=L.toLat(mk.q);l=l.filter(x=>L.toLat(plateText(x.it.pl)).includes(q)||String(x.pt)===mk.q)}
  const so={cheap:(a,b)=>a.ask-b.ask,exp:(a,b)=>b.ask-a.ask,new:(a,b)=>b.t-a.t,float:(a,b)=>a.f-b.f,deal:(a,b)=>a.ask/a.price-b.ask/b.price}[mk.sort];l.sort(so);
  return'<div class="seg">'+['all'].concat(COUNTRIES).map(c=>'<button class="'+(mk.c===c?'on':'')+'" data-act="mkc" data-c="'+c+'">'+(c==='all'?'\u0412\u0441\u0435 \u0441\u0442\u0440\u0430\u043d\u044b':CN_SHORT[c])+'</button>').join('')+'</div>'+
    '<div class="seg"><button class="'+(mk.m<0?'on':'')+'" data-act="mkm" data-m="-1">\u041b\u044e\u0431\u043e\u0439</button>'+MATS.map((m,i)=>'<button class="'+(mk.m===i?'on':'')+'" data-act="mkm" data-m="'+i+'">'+m.n+'</button>').join('')+'</div>'+
    '<div class="pad" style="display:flex;gap:8px;margin:8px 0"><input class="inp" style="height:40px;flex:1" placeholder="\u041d\u043e\u043c\u0435\u0440 \u0438\u043b\u0438 \u043f\u0430\u0442\u0442\u0435\u0440\u043d" value="'+esc(mk.q)+'" data-on="mkq"></div>'+
    '<div class="pad" style="display:flex;gap:8px;margin:0 0 12px"><select class="inp" style="height:40px;flex:1" data-on="mkw">'+WEARS.map((w,i)=>'<option value="'+i+'"'+(mk.w===i?' selected':'')+'>'+(i===4?'\u041b\u044e\u0431\u043e\u0439 \u0438\u0437\u043d\u043e\u0441':'\u0418\u0437\u043d\u043e\u0441 \u0434\u043e '+w.k+' ('+String(w.max).replace('.',',')+')')+'</option>').join('')+'</select><select class="inp" style="height:40px;width:auto" data-on="mks">'+[['cheap','\u0414\u0435\u0448\u0435\u0432\u043b\u0435'],['exp','\u0414\u043e\u0440\u043e\u0436\u0435'],['new','\u041d\u043e\u0432\u044b\u0435'],['float','\u041c\u0435\u043d\u044c\u0448\u0435 \u0438\u0437\u043d\u043e\u0441'],['deal','\u0412\u044b\u0433\u043e\u0434\u043d\u0435\u0435 \u043e\u0446\u0435\u043d\u043a\u0438']].map(s=>'<option value="'+s[0]+'"'+(mk.sort===s[0]?' selected':'')+'>'+s[1]+'</option>').join('')+'</select></div>'+
    (l.length?'<div class="rows">'+l.slice(0,120).map(x=>{const it=Object.assign({},x.it);return'<button class="row" data-act="lot" data-id="'+esc(x.id)+'"><div style="width:118px;flex:none">'+plateHTML(it)+'</div><div class="mid"><div class="tt num">'+fmt(x.ask)+'</div><div class="ss">'+matOf(it).n+' \u00b7 '+appraise(it).wear.k+' '+floatStr(it.f)+' \u00b7 #'+it.pt+'</div><div class="ey">'+esc(x.nick)+(x.seller===Net.me.uid?' (\u0432\u044b)':'')+'</div></div></button>'}).join('')+'</div>':'<div class="empty">\u041b\u043e\u0442\u043e\u0432 \u0441 \u0442\u0430\u043a\u0438\u043c\u0438 \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u043c\u0438 \u043d\u0435\u0442<button class="pill" data-act="newOrder" data-k="plate">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443</button></div>');
}
ACT.mkc=el=>{mk.c=el.dataset.c;Page.renderTop()};ACT.mkm=el=>{mk.m=+el.dataset.m;Page.renderTop()};ACT.mkw=el=>{mk.w=+el.dataset.w;Page.renderTop()};
let mkqT=0;ON.mkq=el=>{clearTimeout(mkqT);mkqT=setTimeout(()=>{mk.q=el.value.trim();const p=Page.top();if(p){const pc=p.el.querySelector('.pc');const ae=document.activeElement;const pos=ae&&ae.selectionStart;Page.renderTop();const inp=qs('[data-on=mkq]',p.el);if(inp){inp.focus();try{inp.setSelectionRange(pos,pos)}catch(e){}}}},350)};
ON.mksChange=el=>{mk.sort=el.value;Page.renderTop()};
ON.mkwChange=el=>{mk.w=+el.value;Page.renderTop()};
function marketTypes(kind){
  const defs=kind==='skin'?SKINS:STICKERS;const R=kind==='skin'?L.SKIN_R:L.STK_R;
  const keys=Object.keys(defs).filter(k=>!(defs[k].free));
  keys.sort((a,b)=>defs[b].r-defs[a].r||defs[b].v-defs[a].v);
  return'<div class="rows">'+keys.map(k=>{
    const lots=Net.open.filter(l=>l.kind===kind&&l.key===k);const min=lots.length?Math.min(...lots.map(l=>l.ask)):0;
    const ord=Net.orders.filter(o=>o.kind===kind&&o.key===k);const best=ord.length?Math.max(...ord.map(o=>o.price)):0;
    const d=defs[k];
    return'<button class="row" data-act="mtype" data-k="'+kind+'" data-v="'+k+'"><span class="ico" style="background:var(--card2);width:76px">'+(kind==='skin'?'<canvas data-skin="'+k+'" style="width:76px;height:52px"></canvas>':'<img src="'+Draw.stickerURL(k,96)+'" width="44" height="44" alt="">')+'</span><div class="mid"><div class="tt">'+esc(d.n)+(kind==='skin'?' <span class="muted" style="font-weight:400;font-size:13px">'+(k.startsWith('car')?'\u043c\u0430\u0448\u0438\u043d\u0430':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a')+'</span>':'')+'</div><div class="ss"><span style="color:'+R[d.r].c+'">'+R[d.r].n+'</span> \u00b7 '+(lots.length?lots.length+' '+plural(lots.length,'\u043b\u043e\u0442','\u043b\u043e\u0442\u0430','\u043b\u043e\u0442\u043e\u0432'):'\u043d\u0435\u0442 \u043b\u043e\u0442\u043e\u0432')+(best?' \u00b7 \u0437\u0430\u044f\u0432\u043a\u0430 '+gem(best):'')+'</div></div><div class="end"><span class="val">'+(min?gem(min):'')+'</span></div></button>';
  }).join('')+'</div>';
}
ACT.mtype=async el=>{
  const kind=el.dataset.k,v=el.dataset.v;const d=(kind==='skin'?SKINS:STICKERS)[v];
  const lots=Net.open.filter(l=>l.kind===kind&&l.key===v).sort((a,b)=>a.ask-b.ask);
  const mine=S.inv.filter(i=>i.v===v);
  const sh=Sheet.open({title:d.n,lead:(kind==='skin'?'\u0421\u043a\u0438\u043d':'\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430')+' \u00b7 \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u044c '+gem(d.v),body:
    '<div style="display:grid;place-items:center">'+invPreview({v,k:kind},260,140)+'</div>'+
    '<div class="sec" style="font-size:18px;margin-top:10px">\u0426\u0435\u043d\u0430 \u0437\u0430 30 \u0434\u043d\u0435\u0439</div><div class="card p" id="chart">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>'+
    '<div class="sec" style="font-size:18px">\u041b\u043e\u0442\u044b</div>'+(lots.length?'<div class="group">'+lots.slice(0,30).map(l=>'<div class="li noic"><span class="lt">'+esc(l.nick)+(l.seller===Net.me.uid?' (\u0432\u044b)':'')+'</span><span class="lv num" style="color:var(--text);font-weight:600">'+gem(l.ask)+'</span>'+(l.seller===Net.me.uid?'<button class="pill" data-act="cancelLot" data-id="'+esc(l.id)+'">\u0421\u043d\u044f\u0442\u044c</button>':'<button class="pill" data-act="buyLot" data-id="'+esc(l.id)+'">\u041a\u0443\u043f\u0438\u0442\u044c</button>')+'</div>').join('')+'</div>':'<div class="empty">\u0421\u0435\u0439\u0447\u0430\u0441 \u043d\u0438\u043a\u0442\u043e \u043d\u0435 \u043f\u0440\u043e\u0434\u0430\u0451\u0442</div>')+
    '<div class="foot"><button class="btn pri wide" data-act="newOrder" data-k="'+kind+'" data-v="'+v+'">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443 \u043d\u0430 \u043f\u043e\u043a\u0443\u043f\u043a\u0443</button>'+(mine.length?'<button class="btn wide" data-act="sell" data-k="'+kind+'" data-id="'+mine[0].id+'">\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u0441\u0432\u043e\u0439 ('+mine.length+')</button>':'')+'</div>'});
  hydrateSkins(sh);
  const sales=await salesOf(v);const c=sh.querySelector('#chart');if(c)c.innerHTML=chartHTML(sales,true,d.v);
};
function median(a){if(!a.length)return 0;const s=a.slice().sort((x,y)=>x-y);return s[Math.floor(s.length/2)]}
function chartHTML(sales,gold,base){
  const f=v=>gold?gem(v):fmt(v);
  if(!sales.length)return'<div class="muted" style="font-size:14px">\u041f\u0440\u043e\u0434\u0430\u0436 \u043f\u043e\u043a\u0430 \u043d\u0435 \u0431\u044b\u043b\u043e. \u041e\u0440\u0438\u0435\u043d\u0442\u0438\u0440: '+f(base)+'</div>';
  const days={};sales.forEach(s=>{const d=Math.floor(s.t/864e5);(days[d]=days[d]||[]).push(s.price)});
  const keys=Object.keys(days).map(Number).sort((a,b)=>a-b);const pts=keys.map(d=>[d,median(days[d])]);
  const W=320,H=90;const x0=pts[0][0],x1=Math.max(x0+1,pts[pts.length-1][0]);const ys=pts.map(p=>p[1]);const y0=Math.min(...ys)*.9,y1=Math.max(...ys)*1.1||1;
  const P=pts.map(p=>[((p[0]-x0)/(x1-x0))*W,H-((p[1]-y0)/(y1-y0||1))*H]);
  const path=P.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const med=median(sales.filter(s=>s.t>now()-14*864e5).map(s=>s.price));
  return'<div style="display:flex;justify-content:space-between;font:600 15px var(--f-ui);margin-bottom:8px"><span>\u041c\u0435\u0434\u0438\u0430\u043d\u0430 14 \u0434\u043d\u0435\u0439</span><span class="num">'+(med?f(med):'\u2014')+'</span></div><svg viewBox="-4 -4 '+(W+8)+' '+(H+8)+'" style="width:100%;height:96px" preserveAspectRatio="none"><path d="'+path+' L'+W+' '+H+' L0 '+H+'Z" fill="rgba(10,132,255,.16)"/><path d="'+path+'" fill="none" stroke="var(--blue)" stroke-width="2.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg><div class="muted" style="font-size:12px;margin-top:4px">'+sales.length+' '+plural(sales.length,'\u043f\u0440\u043e\u0434\u0430\u0436\u0430','\u043f\u0440\u043e\u0434\u0430\u0436\u0438','\u043f\u0440\u043e\u0434\u0430\u0436')+' \u0437\u0430 30 \u0434\u043d\u0435\u0439</div>';
}
ACT.lot=el=>{
  const l=Net.open.find(x=>x.id===el.dataset.id);if(!l)return;const it=Object.assign({},l.it);const a=appraise(it);
  const mine=l.seller===Net.me.uid;
  inspect(it,{title:plateText(it.pl),actions:
    '<div class="row" style="background:var(--fill3);min-height:0;margin:0"><div class="mid"><div class="tt num">'+fmt(l.ask)+'</div><div class="ss">\u041f\u0440\u043e\u0434\u0430\u0432\u0435\u0446 '+esc(l.nick)+' \u00b7 \u043e\u0446\u0435\u043d\u043a\u0430 '+fmt(a.price)+'</div></div></div>'+
    (mine?'<button class="btn wide" data-act="cancelLot" data-id="'+esc(l.id)+'">\u0421\u043d\u044f\u0442\u044c \u0441 \u043f\u0440\u043e\u0434\u0430\u0436\u0438</button>':'<button class="btn pri wide" data-act="buyLot" data-id="'+esc(l.id)+'">\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+fmt(l.ask)+'</button>')+
    '<button class="btn md wide" data-act="profile" data-uid="'+esc(l.seller)+'">\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u043f\u0440\u043e\u0434\u0430\u0432\u0446\u0430</button>'+
    (Net.me.role&&!mine?'<button class="btn md wide danger" data-act="admMod" data-id="'+esc(l.id)+'">\u0421\u043d\u044f\u0442\u044c \u043a\u0430\u043a \u043c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440</button>':'')});
};
ACT.buyLot=el=>{const l=Net.open.find(x=>x.id===el.dataset.id);if(!l)return toast('\u041b\u043e\u0442 \u0443\u0436\u0435 \u043f\u0440\u043e\u0434\u0430\u043d','err');
  const have=l.cur==='gold'?S.gold:S.bal;if(have<l.ask){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+(l.cur==='gold'?gem(l.ask-have):fmt(l.ask-have)),'err');return}
  run('buy',{lid:l.id},{btn:el,key:'buy'+l.id,ok:()=>{Snd.coin();Sheet.close();Net.open=Net.open.filter(x=>x.id!==l.id);loadPub('market')}})};
ACT.cancelLot=el=>run('cancel',{lid:el.dataset.id},{btn:el,ok:()=>{Sheet.close();Net.open=Net.open.filter(x=>x.id!==el.dataset.id);loadPub('market')}});
function marketMine(){
  const l=Net.open.filter(x=>x.seller===Net.me.uid);
  return'<p class="note" style="margin-top:0;margin-bottom:12px">'+l.length+' \u0438\u0437 '+L.MAX_LIST+' \u043b\u043e\u0442\u043e\u0432</p>'+(l.length?'<div class="rows">'+l.map(x=>'<div class="row">'+(x.kind==='plate'?'<div style="width:110px;flex:none">'+plateHTML(x.it)+'</div>':'<span class="ico" style="background:var(--card2);width:76px">'+invPreview({v:x.key,k:x.kind},76,52)+'</span>')+'<div class="mid"><div class="tt num">'+(x.cur==='gold'?gem(x.ask):fmt(x.ask))+'</div><div class="ss">'+ago(x.t)+' \u00b7 \u0432\u0430\u043c '+(x.cur==='gold'?gem(Math.floor(x.ask*(1-L.FEE))):fmt(Math.floor(x.ask*(1-L.FEE))))+'</div></div><button class="pill" data-act="cancelLot" data-id="'+esc(x.id)+'">\u0421\u043d\u044f\u0442\u044c</button></div>').join('')+'</div>':'<div class="empty">\u0412\u044b \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043f\u0440\u043e\u0434\u0430\u0451\u0442\u0435. \u0412\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043c\u043e\u0436\u043d\u043e \u0438\u0437 \u00ab\u041c\u043e\u0438\u0445 \u043d\u043e\u043c\u0435\u0440\u043e\u0432\u00bb \u0438\u043b\u0438 \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044f</div>');
}
function orderTitle(o){if(o.kind!=='plate')return(o.kind==='skin'?'\u0421\u043a\u0438\u043d':'\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430')+' \u00ab'+((o.kind==='skin'?SKINS:STICKERS)[o.key]||{}).n+'\u00bb';const sp=o.spec||{};return(sp.c==='*'?'\u041b\u044e\u0431\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0430':CN_SHORT[sp.c])+', '+MATS[sp.m].n.toLowerCase()+(sp.w<4?', \u0434\u043e '+WEARS[sp.w].k:'')}
function marketOrders(){
  const mine=Net.orders.filter(o=>o.uid===Net.me.uid);const all=Net.orders.filter(o=>o.uid!==Net.me.uid).slice(0,30);
  const row=(o,own)=>'<div class="row"><span class="ico" style="background:'+(o.kind==='plate'?'var(--blue)':'var(--purple)')+'">'+ic(o.kind==='plate'?'tag':o.kind==='skin'?'car':'sticker')+'</span><div class="mid"><div class="tt">'+esc(orderTitle(o))+'</div><div class="ss num">'+(o.cur==='gold'?gem(o.price):fmt(o.price))+' \u00d7 '+o.qty+(own?'':' \u00b7 '+esc(o.nick))+'</div></div>'+(own?'<button class="pill" data-act="cancelOrder" data-id="'+esc(o.id)+'">\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c</button>':'')+'</div>';
  return'<div class="pad" style="margin-bottom:12px"><button class="btn pri wide" data-act="newOrder" data-k="plate">'+ic('plus')+'\u041d\u043e\u0432\u0430\u044f \u0437\u0430\u044f\u0432\u043a\u0430</button></div>'+
    '<p class="note" style="margin:0 var(--g) 12px">\u0417\u0430\u044f\u0432\u043a\u0430 \u2014 \u044d\u0442\u043e \u043e\u0431\u0435\u0449\u0430\u043d\u0438\u0435 \u043a\u0443\u043f\u0438\u0442\u044c \u043f\u043e \u0432\u0430\u0448\u0435\u0439 \u0446\u0435\u043d\u0435. \u0414\u0435\u043d\u044c\u0433\u0438 \u0440\u0435\u0437\u0435\u0440\u0432\u0438\u0440\u0443\u044e\u0442\u0441\u044f \u0441\u0440\u0430\u0437\u0443, \u0430 \u043f\u0440\u0435\u0434\u043c\u0435\u0442 \u043f\u0440\u0438\u0434\u0451\u0442, \u043a\u0430\u043a \u0442\u043e\u043b\u044c\u043a\u043e \u043a\u0442\u043e-\u0442\u043e \u043f\u0440\u043e\u0434\u0430\u0441\u0442 \u043f\u043e\u0434\u0445\u043e\u0434\u044f\u0449\u0438\u0439.</p>'+
    '<div class="sec" style="margin-top:6px">\u041c\u043e\u0438 \u0437\u0430\u044f\u0432\u043a\u0438</div>'+(mine.length?'<div class="rows">'+mine.map(o=>row(o,true)).join('')+'</div>':'<div class="empty">\u0417\u0430\u044f\u0432\u043e\u043a \u043d\u0435\u0442</div>')+
    '<div class="sec">\u0417\u0430\u044f\u0432\u043a\u0438 \u0438\u0433\u0440\u043e\u043a\u043e\u0432</div>'+(all.length?'<div class="rows">'+all.map(o=>row(o,false)).join('')+'</div>':'<div class="empty">\u041f\u043e\u043a\u0430 \u043d\u0438\u043a\u0442\u043e \u043d\u0435 \u043f\u043e\u043a\u0443\u043f\u0430\u0435\u0442</div>');
}
ACT.cancelOrder=el=>run('orderCancel',{id:el.dataset.id},{btn:el,ok:()=>loadPub('orders')});
let ordF={kind:'plate',c:'*',m:1,w:4,v:''};
ACT.newOrder=el=>{ordF.kind=el.dataset.k||'plate';if(el.dataset.v)ordF.v=el.dataset.v;showOrderSheet()};
function showOrderSheet(){
  const k=ordF.kind;const gold=k!=='plate';
  const defs=k==='skin'?SKINS:STICKERS;
  if(gold&&!defs[ordF.v])ordF.v=Object.keys(defs).find(x=>!defs[x].free);
  Sheet.open({title:'\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 \u043f\u043e\u043a\u0443\u043f\u043a\u0443',body:
    '<div class="pad" style="margin-bottom:12px"><div class="segbox">'+[['plate','\u041d\u043e\u043c\u0435\u0440'],['skin','\u0421\u043a\u0438\u043d'],['sticker','\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430']].map(s=>'<button class="'+(k===s[0]?'on':'')+'" data-act="ordKind" data-k="'+s[0]+'">'+s[1]+'</button>').join('')+'</div></div>'+
    (k==='plate'?
      '<div class="field"><label>\u0421\u0442\u0440\u0430\u043d\u0430</label><select class="inp" data-on="ordC"><option value="*">\u041b\u044e\u0431\u0430\u044f</option>'+COUNTRIES.map(c=>'<option value="'+c+'"'+(ordF.c===c?' selected':'')+'>'+CN_SHORT[c]+'</option>').join('')+'</select></div>'+
      '<div class="field"><label>\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</label><select class="inp" data-on="ordM">'+MATS.map((m,i)=>'<option value="'+i+'"'+(ordF.m===i?' selected':'')+'>'+m.n+'</option>').join('')+'</select></div>'+
      '<div class="field"><label>\u0418\u0437\u043d\u043e\u0441 \u043d\u0435 \u0445\u0443\u0436\u0435</label><select class="inp" data-on="ordW">'+WEARS.map((w,i)=>'<option value="'+i+'"'+(ordF.w===i?' selected':'')+'>'+(i===4?'\u041b\u044e\u0431\u043e\u0439':w.n+' ('+w.k+')')+'</option>').join('')+'</select></div>'
    :'<div class="field"><label>\u041f\u0440\u0435\u0434\u043c\u0435\u0442</label><select class="inp" data-on="ordV">'+Object.keys(defs).filter(x=>!defs[x].free).map(x=>'<option value="'+x+'"'+(ordF.v===x?' selected':'')+'>'+esc(defs[x].n)+(k==='skin'?' ('+(x.startsWith('car')?'\u043c\u0430\u0448\u0438\u043d\u0430':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a')+')':'')+'</option>').join('')+'</select></div>')+
    '<div class="rowf" style="margin:0 var(--g)"><div class="field" style="margin:0"><label>\u0426\u0435\u043d\u0430 \u0437\u0430 \u0448\u0442\u0443\u043a\u0443, '+(gold?'\u0433\u043e\u043b\u0434\u0430':'\u20bd')+'</label><input class="inp num" id="ordP" inputmode="numeric" placeholder="'+(gold?'50':'5000')+'"></div><div class="field" style="margin:0;flex:.5"><label>\u0421\u043a\u043e\u043b\u044c\u043a\u043e</label><input class="inp num" id="ordQ" inputmode="numeric" value="1"></div></div>'+
    '<p class="note">\u0421\u0443\u043c\u043c\u0430 \u0440\u0435\u0437\u0435\u0440\u0432\u0438\u0440\u0443\u0435\u0442\u0441\u044f \u0441\u0440\u0430\u0437\u0443. \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443 \u043c\u043e\u0436\u043d\u043e \u0432 \u043b\u044e\u0431\u043e\u0439 \u043c\u043e\u043c\u0435\u043d\u0442, \u0434\u0435\u043d\u044c\u0433\u0438 \u0432\u0435\u0440\u043d\u0443\u0442\u0441\u044f.</p>'+
    '<div class="foot"><button class="btn pri wide" data-act="ordGo">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443</button></div>'});
}
ACT.ordKind=el=>{ordF.kind=el.dataset.k;showOrderSheet()};
ON.ordCChange=el=>ordF.c=el.value;ON.ordMChange=el=>ordF.m=+el.value;ON.ordWChange=el=>ordF.w=+el.value;ON.ordVChange=el=>ordF.v=el.value;
ACT.ordGo=el=>{
  const price=Math.round(+String($('ordP').value).replace(/\D/g,'')),qty=Math.round(+$('ordQ').value||1);
  const p={kind:ordF.kind,price,qty};if(ordF.kind==='plate')Object.assign(p,{c:ordF.c,m:ordF.m,w:ordF.w});else p.v=ordF.v;
  run('order',p,{btn:el,ok:()=>{Sheet.close();loadPub('orders');loadPub('market')}});
};
ACT.admMod=el=>run('adm.mod',{lid:el.dataset.id},{btn:el,ok:()=>{Sheet.close();loadPub('market')}});

/* ---------- \u0441\u043a\u0443\u043f\u0449\u0438\u043a ---------- */
OPEN.buyback=()=>Page.push('buyback','\u0421\u043a\u0443\u043f\u0449\u0438\u043a',renderBuyback);
function renderBuyback(el){
  const top=S.box.filter(x=>!x.pin&&!L.plateLocked(S,x.id)).sort((a,b)=>b.price-a.price).slice(0,20);
  el.innerHTML='<p class="lead">\u041f\u043e\u043a\u0443\u043f\u0430\u0435\u0442 \u0441\u0440\u0430\u0437\u0443, \u0431\u0435\u0437 \u043e\u0436\u0438\u0434\u0430\u043d\u0438\u044f \u043f\u043e\u043a\u0443\u043f\u0430\u0442\u0435\u043b\u044f. \u0417\u0430 \u043d\u043e\u043c\u0435\u0440\u0430 \u043f\u043b\u0430\u0442\u0438\u0442 '+Math.round(L.BUYBACK*100)+'% \u043e\u0446\u0435\u043d\u043a\u0438 \u0432 \u0440\u0443\u0431\u043b\u044f\u0445. \u0417\u0430 \u0441\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 \u2014 \u043c\u0435\u0434\u0438\u0430\u043d\u0443 \u043f\u0440\u043e\u0434\u0430\u0436 \u0437\u0430 14 \u0434\u043d\u0435\u0439 \u043c\u0438\u043d\u0443\u0441 13% \u0432 \u0433\u043e\u043b\u0434\u0435.</p>'+
    '<div class="sec" style="margin-top:4px">\u041d\u043e\u043c\u0435\u0440\u0430</div>'+(top.length?'<div class="rows">'+top.map(it=>'<div class="row"><div style="width:110px;flex:none">'+plateHTML(it)+'</div><div class="mid"><div class="tt num">'+fmt(Math.floor(it.price*L.BUYBACK))+'</div><div class="ss">\u043e\u0446\u0435\u043d\u043a\u0430 '+fmt(it.price)+'</div></div><button class="pill" data-act="quick" data-id="'+it.id+'">\u041f\u0440\u043e\u0434\u0430\u0442\u044c</button></div>').join('')+'</div>':'<div class="empty">\u041d\u043e\u043c\u0435\u0440\u043e\u0432 \u0434\u043b\u044f \u043f\u0440\u043e\u0434\u0430\u0436\u0438 \u043d\u0435\u0442</div>')+
    '<div class="pad" style="margin-top:12px"><button class="btn wide" data-act="plates">\u0412\u0441\u0435 \u043d\u043e\u043c\u0435\u0440\u0430 \u0438 \u043c\u0430\u0441\u0441\u043e\u0432\u0430\u044f \u043f\u0440\u043e\u0434\u0430\u0436\u0430</button></div>'+
    '<div class="sec">\u0421\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438</div>'+(S.inv.length?'<div class="rows">'+S.inv.slice(0,40).map(x=>{const lk=invLook(x);return'<div class="row"><span class="ico" style="background:var(--card2);width:76px">'+invPreview(x,76,52)+'</span><div class="mid"><div class="tt">'+esc(lk.n)+'</div><div class="ss">'+lk.r.n+' \u00b7 \u043e\u0440\u0438\u0435\u043d\u0442\u0438\u0440 '+gem(lk.v)+'</div></div><button class="pill" data-act="sellInv" data-id="'+x.id+'">\u0423\u0437\u043d\u0430\u0442\u044c \u0446\u0435\u043d\u0443</button></div>'}).join('')+'</div>':'<div class="empty">\u0418\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c \u043f\u0443\u0441\u0442</div>');
  hydrateSkins(el);
}

/* ---------- \u043c\u0430\u0433\u0430\u0437\u0438\u043d \u0434\u043d\u044f ---------- */
OPEN.shop=()=>Page.push('shop','\u041c\u0430\u0433\u0430\u0437\u0438\u043d \u0434\u043d\u044f',renderShop);
function renderShop(el){
  const d=L.mskDate(now());const cat=L.dayCatalog(d).shop;const got=S.shop.d===d?S.shop.got:[];
  const midnight=Date.parse(d+'T00:00:00+03:00')+864e5;
  el.innerHTML='<p class="lead">\u041d\u043e\u0432\u044b\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u043a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c \u0432 \u043f\u043e\u043b\u043d\u043e\u0447\u044c \u043f\u043e \u041c\u043e\u0441\u043a\u0432\u0435. \u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u0447\u0435\u0440\u0435\u0437 '+left(midnight-now())+'. \u041a\u0430\u0436\u0434\u043e\u0435 \u043c\u043e\u0436\u043d\u043e \u043a\u0443\u043f\u0438\u0442\u044c \u043e\u0434\u0438\u043d \u0440\u0430\u0437.</p><div class="rows">'+cat.map((o,i)=>{
    const bought=got.includes(i);let vis='',name='',sub='';
    if(o.k==='plate'){vis='<div style="width:120px;flex:none">'+plateHTML(o.it)+'</div>';name=plateText(o.it.pl);sub=matOf(o.it).n+' \u00b7 \u043e\u0446\u0435\u043d\u043a\u0430 '+fmt(o.it.price)}
    else if(o.k==='skin'){vis='<span class="ico" style="background:var(--card2);width:76px">'+invPreview({v:o.v,k:'skin'},76,52)+'</span>';name=SKINS[o.v].n;sub=L.SKIN_R[SKINS[o.v].r].n+' \u0441\u043a\u0438\u043d'}
    else if(o.k==='sticker'){vis='<span class="ico" style="background:var(--card2)"><img src="'+Draw.stickerURL(o.v,96)+'" width="42" height="42" alt=""></span>';name=STICKERS[o.v].n;sub=L.STK_R[STICKERS[o.v].r].n+' \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430'}
    else{vis='<span class="ico" style="background:'+COLORS[o.v].c+'"></span>';name='\u0426\u0432\u0435\u0442 \u00ab'+COLORS[o.v].n+'\u00bb';sub='\u043a\u0440\u0430\u0441\u043a\u0430 \u0434\u043b\u044f \u043c\u0430\u0448\u0438\u043d\u044b \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430'}
    return'<div class="row">'+vis+'<div class="mid"><div class="tt">'+esc(name)+'</div><div class="ss">'+esc(sub)+'</div></div>'+(bought?'<span class="pill" style="opacity:.5">\u041a\u0443\u043f\u043b\u0435\u043d\u043e</span>':'<button class="pill" data-act="shopBuy" data-i="'+i+'">'+(o.cur==='gold'?GOLD(o.price):'<span class="num">'+fmt(o.price)+'</span>')+'</button>')+'</div>';
  }).join('')+'</div>';
  hydrateSkins(el);
}
ACT.shopBuy=el=>run('shopBuy',{i:+el.dataset.i},{btn:el,ok:()=>Snd.coin()});

/* ---------- \u0442\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440 ---------- */
let tote={pick:-1,cur:'rub',amt:1000};
OPEN.tote=()=>{if(!S.tote.card)run('toteNew',{},{quiet:true});Page.push('tote','\u0422\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440',renderTote)};
function renderTote(el){
  const card=S.tote.card;const d=L.mskDate(now());const n=S.tote.d===d?S.tote.n:0;
  if(!card){el.innerHTML='<div class="empty">\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u0437\u0430\u0431\u0435\u0433\u2026</div>';return}
  const pr=L.toteProbs(card.o);
  el.innerHTML='<p class="lead">\u0428\u0435\u0441\u0442\u044c \u043c\u0430\u0448\u0438\u043d, \u0443 \u043a\u0430\u0436\u0434\u043e\u0439 \u0441\u0432\u043e\u0439 \u043a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442. \u0428\u0430\u043d\u0441 \u0447\u0435\u0441\u0442\u043d\u044b\u0439, \u043c\u0430\u0440\u0436\u0430 \u043e\u043a\u043e\u043b\u043e 6%. \u0421\u0435\u0433\u043e\u0434\u043d\u044f \u0441\u0442\u0430\u0432\u043e\u043a: '+n+' \u0438\u0437 '+L.TOTE.perDay+'.</p>'+
    '<div class="card" style="overflow:hidden"><canvas id="tote-cv" style="width:100%;height:230px;display:block"></canvas></div>'+
    '<div class="rows" style="margin-top:12px">'+card.o.map((o,i)=>'<button class="row" data-act="totePick" data-i="'+i+'" style="min-height:62px;'+(tote.pick===i?'box-shadow:inset 0 0 0 2px var(--accent)':'')+'"><span class="ico" style="background:var(--card2);width:70px;height:44px"><canvas data-skin="'+card.sk[i]+'" data-c1="'+['red','blue','yellow','green','purple','orange'][i]+'" data-c2="white" style="width:70px;height:44px"></canvas></span><div class="mid"><div class="tt">'+(i+1)+'. '+esc(SKINS[card.sk[i]].n)+'</div><div class="ss">\u0448\u0430\u043d\u0441 \u2248 '+(pr[i]*100).toFixed(1).replace('.',',')+'%</div></div><span class="val" style="font-size:20px">\u00d7'+String(o).replace('.',',')+'</span></button>').join('')+'</div>'+
    '<div class="pad" style="margin-top:14px"><div class="segbox"><button class="'+(tote.cur==='rub'?'on':'')+'" data-act="toteCur" data-c="rub">\u0420\u0443\u0431\u043b\u0438</button><button class="'+(tote.cur==='gold'?'on':'')+'" data-act="toteCur" data-c="gold">\u0413\u043e\u043b\u0434\u0430</button></div></div>'+
    '<div class="field" style="margin-top:12px"><label>\u0421\u0442\u0430\u0432\u043a\u0430 (\u0434\u043e '+(tote.cur==='gold'?gem(L.TOTE.gold):fmt(L.TOTE.rub))+')</label><input class="inp num" id="tote-amt" inputmode="numeric" value="'+tote.amt+'" data-on="toteAmt"></div>'+
    '<div class="pad" style="display:flex;gap:8px;flex-wrap:wrap">'+(tote.cur==='gold'?[10,50,100,500]:[500,1000,5000,20000]).map(v=>'<button class="pill" data-act="toteSet" data-v="'+v+'">'+(tote.cur==='gold'?gem(v):fmt(v))+'</button>').join('')+'</div>'+
    '<div class="foot" style="padding-inline:var(--g)"><button class="btn pri wide'+(tote.pick<0?' off':'')+'" data-act="toteGo">'+(tote.pick<0?'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u0430\u0448\u0438\u043d\u0443':'\u041f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u2116'+(tote.pick+1)+' \u00b7 \u0432\u044b\u0438\u0433\u0440\u044b\u0448 '+(tote.cur==='gold'?gem(Math.floor(tote.amt*card.o[tote.pick])):fmt(Math.floor(tote.amt*card.o[tote.pick]))))+'</button></div>';
  hydrateSkins(el);ToteRace.idle($('tote-cv'),card);
}
ACT.totePick=el=>{tote.pick=+el.dataset.i;Haptic.tick();Page.renderTop()};
ACT.toteCur=el=>{tote.cur=el.dataset.c;tote.amt=tote.cur==='gold'?50:1000;Page.renderTop()};
ACT.toteSet=el=>{tote.amt=+el.dataset.v;Page.renderTop()};
ON.toteAmt=el=>{tote.amt=Math.max(0,Math.round(+String(el.value).replace(/\D/g,'')||0));const b=qs('[data-act=toteGo]');const card=S.tote.card;if(b&&tote.pick>=0&&card)b.textContent='\u041f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u2116'+(tote.pick+1)+' \u00b7 \u0432\u044b\u0438\u0433\u0440\u044b\u0448 '+(tote.cur==='gold'?gem(Math.floor(tote.amt*card.o[tote.pick])):fmt(Math.floor(tote.amt*card.o[tote.pick])))};
ACT.toteGo=async el=>{
  if(tote.pick<0)return;const card=S.tote.card;
  const r=await run('tote',{card:card.id,pick:tote.pick,amt:tote.amt,cur:tote.cur},{btn:el,quiet:true});
  if(!r)return;
  const cv=$('tote-cv');el.classList.add('off');
  ToteRace.race(cv,{o:r.o,sk:r.sk},r.win,()=>{
    if(r.pay){toast('\u041f\u043e\u0431\u0435\u0434\u0430! \u2116'+(r.win+1)+' \u043f\u0440\u0438\u0448\u0451\u043b \u043f\u0435\u0440\u0432\u044b\u043c: +'+(r.cur==='gold'?gem(r.pay):fmt(r.pay)));Snd.win(3);Haptic.ok()}
    else{toast('\u041f\u0435\u0440\u0432\u044b\u043c \u043f\u0440\u0438\u0448\u0451\u043b \u2116'+(r.win+1)+'. \u0421\u0442\u0430\u0432\u043a\u0430 \u043d\u0435 \u0441\u044b\u0433\u0440\u0430\u043b\u0430');Snd.bad()}
    tote.pick=-1;Page.renderTop();
  });
};
const ToteRace=(()=>{
  let raf=0;
  function lanes(c,W,H,card,pos,win){
    const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#1c3d1f');sky.addColorStop(1,'#123015');c.fillStyle=sky;c.fillRect(0,0,W,H);
    const lh=(H-20)/6;
    for(let i=0;i<6;i++){const y=10+i*lh;c.fillStyle=i%2?'#2a2f36':'#323840';c.fillRect(0,y,W,lh-2);
      c.fillStyle='rgba(255,255,255,.5)';c.font='600 11px -apple-system,Arial';c.fillText(String(i+1),6,y+lh/2+4);}
    const fx=W-40;for(let j=0;j<Math.ceil((H-20)/8);j++){c.fillStyle=j%2?'#fff':'#111';c.fillRect(fx,10+j*8,8,8);c.fillStyle=j%2?'#111':'#fff';c.fillRect(fx+8,10+j*8,8,8)}
    for(let i=0;i<6;i++){const y=10+i*lh+lh-6;const x=20+pos[i]*(fx-80);Draw.car(c,x+30,y,lh/80,{skin:card.sk[i],c1:['red','blue','yellow','green','purple','orange'][i],c2:'white',wh:'sport'},{wheelRot:pos[i]*60})}
  }
  return{
    idle(cv,card){if(!cv)return;const {c,W,H}=Draw.fit(cv);lanes(c,W,H,card,[0,0,0,0,0,0])},
    race(cv,card,win,done){
      if(!cv){done();return}cancelAnimationFrame(raf);const {c,W,H}=Draw.fit(cv);
      const T=4.6;const t0=performance.now();
      const sp=card.o.map((o,i)=>i===win?1:.78+Math.random()*.2);
      const wig=card.o.map(()=>Math.random()*10);
      const step=ts=>{const t=Math.min(1,(ts-t0)/1000/T);
        const pos=sp.map((s,i)=>{const base=i===win?t:Math.min(.985,t*s);return Math.min(1,base+Math.sin(t*9+wig[i])*.012*(1-t))});
        lanes(c,W,H,card,pos,win);
        if(t<1)raf=requestAnimationFrame(step);else done();
      };raf=requestAnimationFrame(step);
    }
  };
})();

/* ---------- \u0430\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440 ---------- */
let upg={kind:'box',ids:[],target:null};
OPEN.upgr=()=>Page.push('upgr','\u0410\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440',renderUpg);
ACT.upFrom=el=>{upg={kind:el.dataset.k==='inv'?'inv':'box',ids:[],target:null};Sheet.close();Page.push('upgr','\u0410\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440',renderUpg)};
function upInV(){return upg.ids.reduce((s,id)=>{if(upg.kind==='box'){const x=S.box.find(b=>b.id===id);return s+(x?x.price:0)}const x=S.inv.find(b=>b.id===id);return s+(x?SKINS[x.v].v:0)},0)}
function upTargets(){
  if(upg.kind==='box')return L.dayCatalog(L.mskDate(now())).plates.map(p=>({id:p.id,v:p.price,it:p}));
  return Object.keys(SKINS).filter(k=>!SKINS[k].free&&!SKINS[k].season).map(k=>({id:k,v:SKINS[k].v})).sort((a,b)=>a.v-b.v);
}
function renderUpg(el){
  const inV=upInV();const tg=upTargets();const t=tg.find(x=>x.id===upg.target)||null;
  const ch=t&&inV?L.upChance(inV,t.v):0;const valid=t&&inV&&t.v>=inV*L.UP.minX;
  const mine=upg.kind==='box'?S.box.filter(x=>!x.pin&&!L.plateLocked(S,x.id)&&x.pl.c!=='sp').sort((a,b)=>b.price-a.price):S.inv.filter(x=>x.k==='skin');
  const f=v=>upg.kind==='box'?fmt(v):gem(v);
  el.innerHTML='<p class="lead">\u041f\u043e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0434\u043e \u043f\u044f\u0442\u0438 \u0441\u0432\u043e\u0438\u0445 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u043e\u0432 \u0438 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0446\u0435\u043b\u044c \u0434\u043e\u0440\u043e\u0436\u0435. \u0428\u0430\u043d\u0441 \u0440\u0430\u0432\u0435\u043d \u043e\u0442\u043d\u043e\u0448\u0435\u043d\u0438\u044e \u0441\u0442\u0430\u0432\u043a\u0438 \u043a \u0446\u0435\u043b\u0438 \u0441 \u043c\u0430\u0440\u0436\u043e\u0439 10%, \u043d\u043e \u043d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 75%. \u041f\u0440\u0438 \u043d\u0435\u0443\u0434\u0430\u0447\u0435 \u0441\u0442\u0430\u0432\u043a\u0430 \u0441\u0433\u043e\u0440\u0430\u0435\u0442.</p>'+
    '<div class="pad" style="margin-bottom:14px"><div class="segbox"><button class="'+(upg.kind==='box'?'on':'')+'" data-act="upKind" data-k="box">\u041d\u043e\u043c\u0435\u0440\u0430</button><button class="'+(upg.kind==='inv'?'on':'')+'" data-act="upKind" data-k="inv">\u0421\u043a\u0438\u043d\u044b</button></div></div>'+
    '<div class="card p" style="display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;text-align:center">'+
      '<div><div class="muted" style="font-size:13px">\u0421\u0442\u0430\u0432\u043a\u0430</div><div style="font:700 20px var(--f-ui)" class="num">'+(inV?f(inV):'\u2014')+'</div><div class="muted" style="font-size:12px">'+upg.ids.length+' \u0438\u0437 5</div></div>'+
      '<div style="position:relative;width:120px;height:120px"><canvas id="up-cv" style="width:120px;height:120px"></canvas><div style="position:absolute;inset:0;display:grid;place-items:center;font:800 24px var(--f-ui)" id="up-pct" class="num">'+(ch?(ch*100).toFixed(1).replace('.',',')+'%':'\u2014')+'</div></div>'+
      '<div><div class="muted" style="font-size:13px">\u0426\u0435\u043b\u044c</div><div style="font:700 20px var(--f-ui)" class="num">'+(t?f(t.v):'\u2014')+'</div><div class="muted" style="font-size:12px">'+(t?'\u00d7'+(t.v/Math.max(1,inV)).toFixed(1).replace('.',','):'\u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0438\u0436\u0435')+'</div></div></div>'+
    '<div class="pad" style="margin-top:12px"><button class="btn pri wide'+(valid?'':' off')+'" data-act="upGo">'+(valid?'\u0410\u043f\u0433\u0440\u0435\u0439\u0434 \u0441 \u0448\u0430\u043d\u0441\u043e\u043c '+(ch*100).toFixed(1).replace('.',',')+'%':t&&inV?'\u0426\u0435\u043b\u044c \u0434\u043e\u043b\u0436\u043d\u0430 \u0431\u044b\u0442\u044c \u0434\u043e\u0440\u043e\u0436\u0435 \u0432 1,2 \u0440\u0430\u0437\u0430':'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0442\u0430\u0432\u043a\u0443 \u0438 \u0446\u0435\u043b\u044c')+'</button></div>'+
    '<div class="sec">\u0426\u0435\u043b\u044c</div><div class="shelf">'+tg.filter(x=>!inV||x.v>=inV*L.UP.minX||x.id===upg.target).map(x=>'<button class="mat" data-act="upT" data-id="'+x.id+'" style="width:'+(upg.kind==='box'?170:130)+'px;display:grid;gap:6px;padding:10px;background:var(--card);'+(upg.target===x.id?'box-shadow:inset 0 0 0 2px var(--accent);':'')+(inV&&x.v<inV*L.UP.minX?'opacity:.4':'')+'">'+(upg.kind==='box'?plateHTML(x.it):invPreview({v:x.id,k:'skin'},110,60)+'<span style="font:600 13px var(--f-ui)">'+esc(SKINS[x.id].n)+'</span>')+'<span class="num" style="font:600 14px var(--f-ui)">'+f(x.v)+'</span></button>').join('')+'</div>'+
    '<div class="sec">\u0412\u0430\u0448\u0430 \u0441\u0442\u0430\u0432\u043a\u0430</div>'+(mine.length?'<div class="'+(upg.kind==='box'?'grid2':'grid2')+'">'+mine.slice(0,60).map(x=>{const on=upg.ids.includes(x.id);return'<button class="mat" data-act="upPick" data-id="'+x.id+'" style="display:grid;gap:6px;padding:10px;background:var(--card);'+(on?'box-shadow:inset 0 0 0 2px var(--accent)':'')+'">'+(upg.kind==='box'?plateHTML(x):invPreview(x,110,60))+'<span class="num" style="font:600 14px var(--f-ui)">'+(upg.kind==='box'?fmt(x.price):gem(SKINS[x.v].v))+'</span></button>'}).join('')+'</div>':'<div class="empty">\u041d\u0435\u0447\u0435\u0433\u043e \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c</div>')+
    (S.up.length?'<div class="sec">\u0418\u0441\u0442\u043e\u0440\u0438\u044f</div><div class="group">'+S.up.slice().reverse().map(h=>'<div class="li noic"><span class="lt">'+(h.win?'\u0423\u0441\u043f\u0435\u0445':'\u041d\u0435\u0443\u0434\u0430\u0447\u0430')+' \u00b7 \u0448\u0430\u043d\u0441 '+String(h.ch).replace('.',',')+'%</span><span class="lv num" style="color:'+(h.win?'var(--green)':'var(--red)')+'">'+(h.k==='box'?fmt(h.win?h.out:-h.in):gem(h.win?h.out:-h.in))+'</span></div>').join('')+'</div>':'');
  hydrateSkins(el);upGauge(ch,null);
}
function upGauge(ch,roll){
  const cv=$('up-cv');if(!cv)return;const {c,W,H}=Draw.fit(cv);const cx=W/2,cy=H/2,r=W/2-8;
  c.lineWidth=10;c.lineCap='round';c.strokeStyle='rgba(118,118,128,.3)';c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.stroke();
  if(ch>0){c.strokeStyle='#30d158';c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+ch*Math.PI*2);c.stroke()}
  if(roll!=null){const a=-Math.PI/2+roll*Math.PI*2;c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--text');c.beginPath();c.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,7,0,Math.PI*2);c.fill()}
}
ACT.upKind=el=>{upg={kind:el.dataset.k,ids:[],target:null};Page.renderTop()};
ACT.upPick=el=>{const id=+el.dataset.id;if(upg.ids.includes(id))upg.ids=upg.ids.filter(x=>x!==id);else if(upg.ids.length<5)upg.ids.push(id);else toast('\u041d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u043f\u044f\u0442\u0438 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u043e\u0432');Haptic.tick();Page.renderTop()};
ACT.upT=el=>{const id=el.dataset.id;upg.target=upg.kind==='box'?+id:id;Haptic.tick();Page.renderTop()};
ACT.upGo=async el=>{
  const r=await run('up',{kind:upg.kind,ids:upg.ids,target:upg.target},{btn:el,quiet:true});if(!r)return;
  const T=2.6,t0=performance.now();const turns=3;
  const step=ts=>{const t=Math.min(1,(ts-t0)/1000/T);const k=1-Math.pow(1-t,3);const v=(turns+r.roll)*k;upGauge(r.ch,v%1);Snd.tick();if(t<1)requestAnimationFrame(step);else{
    if(r.win){toast('\u0410\u043f\u0433\u0440\u0435\u0439\u0434 \u0443\u0434\u0430\u043b\u0441\u044f!');Snd.win(4);Haptic.ok()}else{toast('\u041d\u0435 \u043f\u043e\u0432\u0435\u0437\u043b\u043e. \u0421\u0442\u0430\u0432\u043a\u0430 \u0441\u0433\u043e\u0440\u0435\u043b\u0430');Snd.bad();Haptic.err()}
    upg.ids=[];setTimeout(()=>Page.renderTop(),900);
  }};requestAnimationFrame(step);
};

/* ---------- \u043a\u043b\u0438\u043a\u0435\u0440 ---------- */
let clk=null;
OPEN.clicker=()=>Page.push('clicker','\u041a\u043b\u0438\u043a\u0435\u0440',renderClicker,{onClose:()=>{if(clk&&clk.left>0)toast('\u0421\u0435\u0441\u0441\u0438\u044f \u043a\u043b\u0438\u043a\u0435\u0440\u0430 \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0430\u0435\u0442\u0441\u044f, \u0432\u0435\u0440\u043d\u0438\u0442\u0435\u0441\u044c, \u0447\u0442\u043e\u0431\u044b \u0437\u0430\u0431\u0440\u0430\u0442\u044c \u043d\u0430\u0433\u0440\u0430\u0434\u0443')}});
function renderClicker(el){
  if(clk&&clk.on){
    el.innerHTML='<p class="lead">\u0416\u043c\u0438\u0442\u0435 \u043d\u0430 \u043a\u043d\u043e\u043f\u043a\u0443. \u0417\u0430\u0441\u0447\u0438\u0442\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0434\u043e '+L.CLICK.cps+' \u043d\u0430\u0436\u0430\u0442\u0438\u0439 \u0432 \u0441\u0435\u043a\u0443\u043d\u0434\u0443, \u043a\u0430\u0436\u0434\u043e\u0435 \u2014 '+fmt(L.CLICK.pay)+'.</p><div style="display:grid;justify-items:center;gap:14px;padding:10px 0"><div style="font:800 64px/1 var(--f-ui)" class="num" id="clk-n">'+clk.n+'</div><div class="muted num" id="clk-t">'+Math.ceil(clk.left)+' \u0441</div><button id="clk-btn" style="width:220px;height:220px;border-radius:50%;background:linear-gradient(180deg,#ffd426,#f0a800);box-shadow:0 14px 40px rgba(240,168,0,.45),inset 0 2px 0 rgba(255,255,255,.5);color:#3a2600;font:800 28px var(--f-ui);touch-action:manipulation">\u0416\u041c\u0418</button><div class="muted num" id="clk-m">'+fmt(clk.n*L.CLICK.pay)+'</div></div>';
    const b=$('clk-btn');b.addEventListener('pointerdown',e=>{e.preventDefault();clickTap()});
    return;
  }
  el.innerHTML='<p class="lead">\u041e\u0434\u043d\u0430 \u043c\u0438\u043d\u0443\u0442\u0430 \u043a\u043b\u0438\u043a\u043e\u0432 \u0441\u0442\u043e\u0438\u0442 \u043e\u0434\u0438\u043d \u043a\u043b\u044e\u0447. \u0414\u043e '+L.CLICK.cps+' \u043d\u0430\u0436\u0430\u0442\u0438\u0439 \u0432 \u0441\u0435\u043a\u0443\u043d\u0434\u0443, \u043a\u0430\u0436\u0434\u043e\u0435 \u043f\u0440\u0438\u043d\u043e\u0441\u0438\u0442 '+fmt(L.CLICK.pay)+'. \u041c\u0430\u043a\u0441\u0438\u043c\u0443\u043c \u0437\u0430 \u0441\u0435\u0441\u0441\u0438\u044e \u2014 '+fmt(L.CLICK.sec*L.CLICK.cps*L.CLICK.pay)+'.</p>'+
    '<div class="gc g-yellow" style="margin:0 var(--g);height:200px"><span class="art" style="right:14px;top:14px;width:90px;height:90px;color:rgba(255,255,255,.55)">'+ic('tap')+'</span><span class="k">\u0423 \u0432\u0430\u0441 '+keyN(S.keys)+'</span><span class="t" style="font-size:24px">\u041a\u043b\u0438\u043a\u0435\u0440</span><span class="s">60 \u0441\u0435\u043a\u0443\u043d\u0434, \u0447\u0442\u043e\u0431\u044b \u043d\u0430\u0431\u0440\u0430\u0442\u044c \u043a\u0430\u043a \u043c\u043e\u0436\u043d\u043e \u0431\u043e\u043b\u044c\u0448\u0435</span><span class="act"><button class="pill on-card" data-act="clickStart">'+ic('key')+'\u041d\u0430\u0447\u0430\u0442\u044c \u0437\u0430 1 \u043a\u043b\u044e\u0447</button></span></div>';
}
ACT.clickStart=async el=>{
  if(S.keys<1){toast('\u041d\u0443\u0436\u0435\u043d \u043a\u043b\u044e\u0447. \u041a\u043b\u044e\u0447\u0438 \u0434\u0430\u044e\u0442 \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b \u0438 \u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430','err');return}
  const r=await run('clickStart',{},{btn:el,quiet:true});if(!r)return;
  clk={id:r.click,n:0,t0:performance.now(),left:L.CLICK.sec,on:true,stamps:[]};Page.renderTop();
  const tick=()=>{if(!clk||!clk.on)return;clk.left=L.CLICK.sec-(performance.now()-clk.t0)/1000;const t=$('clk-t');if(t)t.textContent=Math.max(0,Math.ceil(clk.left))+' \u0441';if(clk.left<=0){clickEnd();return}requestAnimationFrame(tick)};requestAnimationFrame(tick);
};
function clickTap(){
  if(!clk||!clk.on)return;const t=performance.now();clk.stamps=clk.stamps.filter(x=>t-x<1000);
  if(clk.stamps.length>=L.CLICK.cps)return;clk.stamps.push(t);clk.n++;
  const n=$('clk-n'),m=$('clk-m'),b=$('clk-btn');if(n)n.textContent=clk.n;if(m)m.textContent=fmt(clk.n*L.CLICK.pay);
  if(b){b.style.transform='scale(.94)';setTimeout(()=>b.style.transform='',70)}
  Haptic.tick();if(clk.n%5===0)Snd.tick();
}
async function clickEnd(){
  if(!clk)return;clk.on=false;const c=clk;
  try{const r=await act('clickEnd',{id:c.id,n:c.n});toast(r.msg);Snd.coin()}catch(e){toast(e.message,'err')}
  clk=null;render();
}

/* ---------- \u0431\u0430\u043d\u043a ---------- */
let bk={a:10000,d:7};
OPEN.bank=()=>Page.push('bank','\u0411\u0430\u043d\u043a',renderBank);
function renderBank(el){
  const t=now();const tot=S.bank.reduce((s,b)=>s+b.a,0);
  el.innerHTML='<p class="lead">1% \u0432 \u0434\u0435\u043d\u044c, \u0441\u0440\u043e\u043a \u0434\u043e '+L.BANK.maxDays+' \u0434\u043d\u0435\u0439, \u0432\u043e \u0432\u043a\u043b\u0430\u0434\u0430\u0445 \u0434\u043e '+fmt(L.BANK.cap)+'. \u0415\u0441\u043b\u0438 \u0437\u0430\u0431\u0440\u0430\u0442\u044c \u0440\u0430\u043d\u044c\u0448\u0435 \u0441\u0440\u043e\u043a\u0430 \u2014 \u0432\u0435\u0440\u043d\u0451\u0442\u0441\u044f \u0441\u0443\u043c\u043c\u0430 \u043c\u0438\u043d\u0443\u0441 '+Math.round(L.BANK.pen*100)+'%, \u0431\u0435\u0437 \u043f\u0440\u043e\u0446\u0435\u043d\u0442\u043e\u0432.</p>'+
    (S.bank.length?'<div class="rows">'+S.bank.map(b=>{const end=b.t+b.d*864e5,ready=t>=end,p=Math.min(1,(t-b.t)/(end-b.t));return'<div class="row"><span class="ico" style="background:var(--teal)">'+ic('bank')+'</span><div class="mid"><div class="tt num">'+fmt(b.a)+' \u2192 '+fmt(Math.floor(b.a*(1+L.BANK.rate*b.d)))+'</div><div class="ss">'+(ready?'\u0413\u043e\u0442\u043e\u0432\u043e \u043a \u0432\u044b\u0434\u0430\u0447\u0435':'\u041e\u0441\u0442\u0430\u043b\u043e\u0441\u044c '+left(end-t))+'</div><div class="bar" style="margin-top:8px"><i style="width:'+(p*100).toFixed(1)+'%;background:linear-gradient(90deg,#6fe6ef,var(--teal))"></i></div></div><button class="pill" data-act="bankTake" data-id="'+b.id+'" data-r="'+(ready?1:0)+'">'+(ready?'\u0417\u0430\u0431\u0440\u0430\u0442\u044c':'\u0414\u043e\u0441\u0440\u043e\u0447\u043d\u043e')+'</button></div>'}).join('')+'</div>':'')+
    '<div class="sec">\u041d\u043e\u0432\u044b\u0439 \u0432\u043a\u043b\u0430\u0434</div>'+
    '<div class="field"><label>\u0421\u0443\u043c\u043c\u0430, \u20bd</label><input class="inp num" id="bk-a" inputmode="numeric" value="'+bk.a+'" data-on="bkA"></div>'+
    '<div class="field"><label>\u0421\u0440\u043e\u043a: <b id="bk-dl">'+bk.d+' '+plural(bk.d,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439')+'</b></label><input type="range" min="1" max="'+L.BANK.maxDays+'" value="'+bk.d+'" data-on="bkD" style="width:100%;accent-color:var(--teal)"></div>'+
    '<div class="card p" style="display:flex;justify-content:space-between"><span class="muted">\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u0435</span><b class="num" id="bk-res">'+fmt(Math.floor(bk.a*(1+L.BANK.rate*bk.d)))+'</b></div>'+
    '<div class="pad" style="margin-top:12px"><button class="btn pri wide'+(S.bank.length>=L.BANK.maxN?' off':'')+'" data-act="bankPut">'+(S.bank.length>=L.BANK.maxN?'\u041d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 '+L.BANK.maxN+' \u0432\u043a\u043b\u0430\u0434\u043e\u0432':'\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0432\u043a\u043b\u0430\u0434')+'</button></div><p class="note">\u0421\u0435\u0439\u0447\u0430\u0441 \u0432\u043e \u0432\u043a\u043b\u0430\u0434\u0430\u0445 '+fmt(tot)+'.</p>';
}
ON.bkA=el=>{bk.a=Math.max(0,Math.round(+String(el.value).replace(/\D/g,'')||0));const r=$('bk-res');if(r)r.textContent=fmt(Math.floor(bk.a*(1+L.BANK.rate*bk.d)))};
ON.bkD=el=>{bk.d=+el.value;const l=$('bk-dl');if(l)l.textContent=bk.d+' '+plural(bk.d,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439');ON.bkA({value:String(bk.a)})};
ACT.bankPut=el=>run('bankPut',{a:bk.a,d:bk.d},{btn:el});
ACT.bankTake=el=>{const go=()=>run('bankTake',{id:el.dataset.id},{btn:el,ok:()=>Snd.coin()});if(el.dataset.r==='1')go();else confirmSheet('\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u0434\u043e\u0441\u0440\u043e\u0447\u043d\u043e?','\u041f\u0440\u043e\u0446\u0435\u043d\u0442\u044b \u0441\u0433\u043e\u0440\u044f\u0442, \u0430 \u0441\u043e \u0432\u043a\u043b\u0430\u0434\u0430 \u0441\u043f\u0438\u0448\u0435\u0442\u0441\u044f '+Math.round(L.BANK.pen*100)+'%.','\u0417\u0430\u0431\u0440\u0430\u0442\u044c',go,true)};

/* ---------- \u043e\u0431\u043c\u0435\u043d \u043a\u043b\u044e\u0447\u0435\u0439 \u0438 \u0433\u043e\u043b\u0434\u044b ---------- */
let ex={dir:'k2g',n:10};
OPEN.exch=()=>Page.push('exch','\u041e\u0431\u043c\u0435\u043d',renderExch);
function renderExch(el){
  const k2g=ex.dir==='k2g';
  el.innerHTML='<p class="lead">1 \u043a\u043b\u044e\u0447 = '+gem(L.KEY_GOLD)+' \u0432 \u043e\u0431\u0435 \u0441\u0442\u043e\u0440\u043e\u043d\u044b, \u0431\u0435\u0437 \u043a\u043e\u043c\u0438\u0441\u0441\u0438\u0438. \u0420\u0443\u0431\u043b\u0438 \u043d\u0435 \u043e\u0431\u043c\u0435\u043d\u0438\u0432\u0430\u044e\u0442\u0441\u044f.</p>'+
    '<div class="pad" style="margin-bottom:14px"><div class="segbox"><button class="'+(k2g?'on':'')+'" data-act="exDir" data-d="k2g">\u041a\u043b\u044e\u0447\u0438 \u2192 \u0433\u043e\u043b\u0434\u0430</button><button class="'+(!k2g?'on':'')+'" data-act="exDir" data-d="g2k">\u0413\u043e\u043b\u0434\u0430 \u2192 \u043a\u043b\u044e\u0447\u0438</button></div></div>'+
    '<div class="card p" style="display:grid;gap:14px"><div style="display:flex;align-items:center;justify-content:space-between"><span class="muted">\u041e\u0442\u0434\u0430\u0451\u0442\u0435</span><b class="num" style="font-size:20px">'+(k2g?keyN(ex.n):gem(ex.n*L.KEY_GOLD))+'</b></div><div style="display:flex;align-items:center;justify-content:space-between"><span class="muted">\u041f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435</span><b class="num" style="font-size:20px">'+(k2g?gem(ex.n*L.KEY_GOLD):keyN(ex.n))+'</b></div>'+
    '<div style="display:flex;gap:8px;align-items:center"><button class="iconbtn" data-act="exN" data-d="-1" aria-label="\u041c\u0435\u043d\u044c\u0448\u0435">\u2212</button><input class="inp num" style="text-align:center" inputmode="numeric" value="'+ex.n+'" data-on="exN"><button class="iconbtn" data-act="exN" data-d="1" aria-label="\u0411\u043e\u043b\u044c\u0448\u0435">'+ic('plus')+'</button></div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap">'+[1,10,50,100].map(v=>'<button class="pill" data-act="exSet" data-v="'+v+'">'+v+'</button>').join('')+'<button class="pill" data-act="exMax">\u0412\u0441\u0435</button></div></div>'+
    '<div class="pad" style="margin-top:12px"><button class="btn pri wide" data-act="exGo">\u041e\u0431\u043c\u0435\u043d\u044f\u0442\u044c</button></div>';
}
ACT.exDir=el=>{ex.dir=el.dataset.d;Page.renderTop()};
ACT.exN=el=>{ex.n=Math.max(1,ex.n+(+el.dataset.d));Page.renderTop()};
ACT.exSet=el=>{ex.n=+el.dataset.v;Page.renderTop()};
ACT.exMax=()=>{ex.n=Math.max(1,ex.dir==='k2g'?S.keys:Math.floor(S.gold/L.KEY_GOLD));Page.renderTop()};
ON.exNChange=el=>{ex.n=Math.max(1,Math.round(+el.value||1));Page.renderTop()};
ACT.exGo=el=>run(ex.dir,{n:ex.n},{btn:el});
function openKeys(){OPEN.exch()}

/* ================= \u0432\u043a\u043b\u0430\u0434\u043a\u0430 \u00ab\u0421\u0435\u0437\u043e\u043d\u00bb ================= */
function rewardIcon(r){
  if(!r)return'';
  if(r.m)return'<span style="font:800 22px var(--f-ui);color:var(--green)">\u20bd</span>';
  if(r.g)return'<span style="color:var(--gold)">'+ic('gem')+'</span>';
  if(r.k)return'<span style="color:var(--teal)">'+ic('key')+'</span>';
  if(r.sc)return'<span style="color:var(--purple)">'+ic('car')+'</span>';
  if(r.tc)return'<span style="color:var(--pink)">'+ic('sticker')+'</span>';
  if(r.skin)return'<canvas data-skin="'+r.skin+'" style="width:76px;height:40px"></canvas>';
  if(r.plate)return plateHTML(L.SPECIAL[r.plate]);
  return'';
}
function rwShort(r){const t=L.rewardText(r);if(r.m)return{a:fmt(r.m),b:'\u0440\u0443\u0431\u043b\u0438'};if(r.g)return{a:fmtN(r.g)+' \u25c6',b:'\u0433\u043e\u043b\u0434\u0430'};if(r.sc)return{a:'\u041a\u0435\u0439\u0441',b:'\u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438'};if(r.tc)return{a:'\u041a\u0435\u0439\u0441',b:'\u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438'};if(r.skin)return{a:SKINS[r.skin].n,b:'\u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u043a\u0438\u043d'};if(r.plate)return{a:'\u041d\u043e\u043c\u0435\u0440',b:'\u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439'};return t}
RENDER.season=()=>{
  const el=$('t-season');const t=now();const lv=L.level(S),pct=L.lvlPct(S),prem=L.isPrem(S,t),on=L.seasonOn(t);
  L.ensureDaily(S,t);L.weekTick(S,t);
  const days=Math.max(0,Math.ceil((L.SEASON.end-t)/864e5));
  const cl=L.claimable(S,t);
  // \u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430
  const W=S.week;const wp=Math.min(1,W.xp/L.WEEK_XP);const wReady=W.xp>=L.WEEK_XP;const wDone=W.got.length>=2;
  const wEnd=L.weekEnd(t);
  const weekCard='<div class="card p" style="margin-top:0"><div style="display:flex;align-items:center;gap:12px">'+ring(wp,'var(--teal)')+'<div style="flex:1"><div style="font:600 17px var(--f-ui)">'+(wDone?'\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043d\u0435\u0434\u0435\u043b\u0438 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430':wReady?'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 2 \u043d\u0430\u0433\u0440\u0430\u0434\u044b \u0438\u0437 4':'\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043d\u0435\u0434\u0435\u043b\u0438')+'</div><div class="muted" style="font-size:14px" class="num">'+(wReady?'\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 '+left(wEnd-t):fmtN(Math.min(W.xp,L.WEEK_XP))+' \u0438\u0437 '+fmtN(L.WEEK_XP)+' \u043e\u043f\u044b\u0442\u0430 \u00b7 '+left(wEnd-t))+'</div></div></div>'+
    '<div class="grid2" style="padding:0;margin-top:14px">'+W.opts.map((o,i)=>{const got=W.got.includes(i);const tx=rwShort(o);return'<button class="rw'+(got?' ready':'')+'" data-act="weekPick" data-i="'+i+'" style="height:96px;background:var(--card2);'+(!wReady||wDone&&!got?'opacity:.55;':'')+(got?'box-shadow:inset 0 0 0 2px var(--green)':'')+'">'+(o.k?'<span style="color:var(--teal)">'+ic('key')+'</span><b>'+o.k+' \u043a\u043b\u044e\u0447\u0435\u0439</b><small>\u0432\u0441\u0435\u0433\u0434\u0430 \u0432 \u0432\u044b\u0431\u043e\u0440\u0435</small>':rewardIcon(o)+'<b>'+esc(tx.a)+'</b><small>'+esc(tx.b)+'</small>')+(got?'<span class="lk" style="position:absolute;top:6px;right:6px;width:16px;height:16px;color:var(--green)">'+ic('check')+'</span>':'')+'</button>'}).join('')+'</div></div>';
  // \u0437\u0430\u0434\u0430\u043d\u0438\u044f
  const quests='<div class="rows">'+S.daily.q.map(q=>{const Q=L.QUESTS[q],p=Math.min(Q.g,+S.daily.p[q]||0),done=S.daily.done.includes(q),ready=p>=Q.g&&!done;
    return'<div class="row">'+ring(p/Q.g,done?'var(--green)':'var(--accent)')+'<div class="mid"><div class="tt" style="white-space:normal;font-size:16px">'+esc(Q.t)+'</div><div class="ss num">'+(done?'\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e':fmtN(p)+' \u0438\u0437 '+fmtN(Q.g))+' \u00b7 350 \u043e\u043f\u044b\u0442\u0430 \u0438 '+fmt(300)+'</div></div>'+(ready?'<button class="pill" data-act="questClaim" data-id="'+q+'" style="background:var(--accent);color:#fff">\u0417\u0430\u0431\u0440\u0430\u0442\u044c</button>':done?'<span style="width:22px;height:22px;color:var(--green)">'+ic('check')+'</span>':'')+'</div>'}).join('')+'</div>';
  // \u0442\u0440\u0435\u043a \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430
  const from=Math.max(1,lv-2),cols=[];
  for(let i=1;i<=L.SEASON.max;i++){
    const f=L.FREE[i],p=L.PREM[i];const fGot=S.cf.includes(i),pGot=S.cp.includes(i);const reach=i<=lv;
    const cell=(r,got,pre)=>{const tx=rwShort(r);const ready=reach&&!got&&(!pre||prem);return'<button class="rw'+(pre?' prem':'')+(ready?' ready':'')+(got?' got':'')+(pre&&!prem?' lock':'')+'" data-act="claim" data-t="'+(pre?'p':'f')+'" data-l="'+i+'">'+rewardIcon(r)+'<b>'+esc(tx.a)+'</b><small>'+esc(tx.b)+'</small>'+(pre&&!prem?'<span class="lk">'+ic('lock')+'</span>':'')+'</button>'};
    cols.push('<div class="lv'+(i===lv+1?' cur':'')+'" id="lv-'+i+'"><div class="n">'+(i===30||i===100?'\u2605 ':'')+i+'</div>'+cell(f,fGot,false)+cell(p,pGot,true)+'</div>');
  }
  const top=(Net.top||[]).slice(0,30);
  el.innerHTML=topHTML('\u0421\u0435\u0437\u043e\u043d')+
    '<div class="hero g-red" style="margin-top:14px;background:var(--gc);min-height:350px"><canvas id="ssn-art"></canvas>'+
      '<div style="position:absolute;left:16px;top:6px;font:800 120px/1 var(--f-ui);letter-spacing:-.06em;color:var(--num);z-index:-1" class="num">'+lv+'</div>'+
      '<p style="margin:0 0 4px;color:var(--tint)">\u0421\u0435\u0437\u043e\u043d 1, '+(on?'\u0435\u0449\u0451 '+days+' '+plural(days,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439'):'\u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d')+'</p><h3>\u00ab'+esc(L.SEASON.name)+'\u00bb</h3><p>\u0423\u0440\u043e\u0432\u0435\u043d\u044c '+lv+' \u0438\u0437 '+L.SEASON.max+(lv<L.SEASON.max?' \u00b7 '+pct+'% \u0434\u043e \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0433\u043e':'')+'</p>'+
      '<div class="bar on-card" style="margin-top:12px"><i style="width:'+(lv>=L.SEASON.max?100:pct)+'%"></i></div>'+
      '<div class="acts">'+(prem?'<span class="badge b-prem" style="height:30px;padding:0 12px;font-size:14px">'+ic('crown')+'Premium \u0434\u043e '+dateRu(S.prem)+'</span>':'<button class="pill on-card" data-act="premInfo">'+ic('crown')+'\u041e\u0442\u043a\u0440\u044b\u0442\u044c Premium</button>')+(cl?'<button class="pill on-card" data-act="claimAll" style="background:#fff;color:#c4261d">\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u0432\u0441\u0451 \u00b7 '+cl+'</button>':'')+'</div></div>'+
    secH('\u041d\u0435\u0434\u0435\u043b\u044f')+weekCard+
    secH('\u0417\u0430\u0434\u0430\u043d\u0438\u044f \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f')+quests+
    secH('\u041f\u0440\u043e\u043f\u0443\u0441\u043a')+'<p class="sub">\u0421\u0432\u0435\u0440\u0445\u0443 \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u0430\u044f \u043b\u0438\u043d\u0438\u044f, \u0441\u043d\u0438\u0437\u0443 Premium. \u0417\u0432\u0430\u043d\u0438\u044f \u00ab\u041c\u043e\u0442\u043e\u0431\u0440\u0430\u0442\u0438\u043a\u00bb \u043d\u0430 30 \u0443\u0440\u043e\u0432\u043d\u0435 \u0438 \u00ab\u041a\u043e\u0440\u043e\u043b\u044c \u0441\u0442\u0430\u043d\u0442\u0430\u00bb \u043d\u0430 100-\u043c.</p><div class="pass" id="pass">'+cols.join('')+'</div>'+
    secH('\u0422\u043e\u043f \u0441\u0435\u0437\u043e\u043d\u0430')+(top.length?'<div class="rows">'+top.map((p,i)=>'<button class="row" data-act="profile" data-uid="'+esc(p.uid)+'"><span style="width:26px;text-align:center;font:800 18px var(--f-ui);color:'+(i<3?['#ffd60a','#c7c7cc','#d0894a'][i]:'var(--text2)')+'">'+(i+1)+'</span>'+avaHTML(p.uid,p.nick,'md',p.ava)+'<div class="mid"><div class="tt">'+esc(p.nick)+(p.uid===Net.me.uid?' <span class="muted" style="font-weight:400">(\u0432\u044b)</span>':'')+'</div><div class="ss">'+(p.title&&L.TITLES[p.title]?L.TITLES[p.title]+' \u00b7 ':'')+'\u0443\u0440\u043e\u0432\u0435\u043d\u044c '+p.lvl+'</div></div><div class="end">'+plusBadge(p.plus,true)+'</div></button>').join('')+'</div>':'<div class="empty">\u0421\u043a\u043e\u0440\u043e \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043b\u0443\u0447\u0448\u0438\u0435 \u0438\u0433\u0440\u043e\u043a\u0438 \u0441\u0435\u0437\u043e\u043d\u0430</div>');
  hydrateAvas(el);hydrateSkins(el);
  const cv=$('ssn-art');if(cv)seasonArt(cv);
  const pass=$('pass'),cur=$('lv-'+Math.max(1,lv));if(pass&&cur&&!pass.dataset.sc){pass.scrollLeft=cur.offsetLeft-40;pass.dataset.sc='1'}
};
function seasonArt(cv){
  const {c,W,H}=Draw.fit(cv);
  for(let i=0;i<26;i++){const x=(i*97)%W,y=(i*53)%H,r=2+((i*7)%5);c.fillStyle='rgba(255,255,255,'+(.05+(i%4)*.03)+')';c.beginPath();c.arc(x,y,r*3,0,Math.PI*2);c.fill()}
  Draw.bike(c,W-150,H*.36,H/400,{skin:'bike:emo',c1:'white',c2:'yellow',wh:'neon'},{pitch:.5,noShadow:true});
}
ACT.claim=el=>{
  const t=el.dataset.t,l=+el.dataset.l;
  if(l>L.level(S)){toast('\u041e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f \u043d\u0430 '+l+' \u0443\u0440\u043e\u0432\u043d\u0435');return}
  if(t==='p'&&!L.isPrem(S,now())){ACT.premInfo();return}
  if((t==='f'?S.cf:S.cp).includes(l))return;
  run('claim',{t,l},{ok:()=>{Snd.coin();Haptic.ok()}});
};
ACT.claimAll=el=>run('claimAll',{},{btn:el,ok:()=>{Snd.win(3);Haptic.ok()}});
ACT.questClaim=el=>run('questClaim',{id:el.dataset.id},{ok:()=>Snd.coin()});
ACT.weekPick=el=>{
  const W=S.week;if(W.xp<L.WEEK_XP){toast('\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f, \u043a\u043e\u0433\u0434\u0430 \u043d\u0430\u0431\u0435\u0440\u0451\u0442\u0435 '+fmtN(L.WEEK_XP)+' \u043e\u043f\u044b\u0442\u0430 \u0437\u0430 \u043d\u0435\u0434\u0435\u043b\u044e');return}
  if(W.got.length>=2||W.got.includes(+el.dataset.i))return;
  const tx=W.opts[+el.dataset.i];
  confirmSheet('\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u00ab'+L.rewardText(tx).a+'\u00bb?',W.got.length?'\u042d\u0442\u043e \u0432\u0442\u043e\u0440\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u043d\u0435\u0434\u0435\u043b\u0438.':'\u041c\u043e\u0436\u043d\u043e \u0432\u044b\u0431\u0440\u0430\u0442\u044c \u0434\u0432\u0435 \u043d\u0430\u0433\u0440\u0430\u0434\u044b \u0438\u0437 \u0447\u0435\u0442\u044b\u0440\u0451\u0445.','\u0417\u0430\u0431\u0440\u0430\u0442\u044c',()=>run('weekPick',{i:+el.dataset.i},{ok:()=>{Snd.win(3);Haptic.ok()}}));
};
function plusBadge(t,short){if(t==null||t<0)return'';return'<span class="badge b-plus">'+ic('star')+(short?'':'Plus \u00b7 ')+L.PLUS[t].n+'</span>'}

/* ================= \u0432\u043a\u043b\u0430\u0434\u043a\u0430 \u00ab\u0410\u043a\u043a\u0430\u0443\u043d\u0442\u00bb ================= */
const Me={avaData:null};
let gV='car';
function myBadges(){
  const t=now();const b=[];
  const pt=L.plusTier(S.don);if(pt>=0)b.push(plusBadge(pt));
  if(L.isPrem(S,t))b.push('<span class="badge b-prem">'+ic('crown')+'Premium</span>');
  if(Net.me.role==='owner')b.push('<span class="badge b-own">'+ic('shield')+'\u0412\u043b\u0430\u0434\u0435\u043b\u0435\u0446</span>');else if(Net.me.role==='admin')b.push('<span class="badge b-adm">'+ic('shield')+'\u0410\u0434\u043c\u0438\u043d</span>');
  if(S.title&&L.TITLES[S.title])b.push('<span class="badge b-title">'+ic('medal')+L.TITLES[S.title]+'</span>');
  L.badges(S).forEach(x=>b.push(seasonBadge(x)));
  return b.join('');
}
function seasonBadge(x){const c={10:'#30d158',30:'#0a84ff',50:'#bf5af2',100:'#ff9f0a'}[x];return'<span class="badge" style="background:'+c+';color:#fff">'+ic('star')+x+'</span>'}
function badgesFor(p){
  const b=[];if(p.plus>=0)b.push(plusBadge(p.plus));if(p.prem>now())b.push('<span class="badge b-prem">'+ic('crown')+'Premium</span>');
  if(p.role==='owner'||p.role==='admin')b.push('<span class="badge b-adm">'+ic('shield')+'\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f</span>');
  if(p.title&&L.TITLES[p.title])b.push('<span class="badge b-title">'+ic('medal')+L.TITLES[p.title]+'</span>');
  [10,30,50,100].filter(x=>p.lvl>=x).forEach(x=>b.push(seasonBadge(x)));return b.join('');
}
function vehLook(k){const V=S.veh[k];const st=V.st.map(id=>{const x=S.inv.find(i=>i.id===id);return x?x.v:null}).filter(Boolean);const pl=V.plate&&S.box.find(b=>b.id===V.plate);return Object.assign({},V,{st,plateText:pl?plateText(pl.pl):''})}
RENDER.account=()=>{
  const el=$('t-account');const t=now();
  const fr=[['\u0410','#ff9f0a'],['\u0414','#0a84ff'],['\u041c','#30d158'],['\u041a','#bf5af2'],['\u0421','#ff375f']];
  el.innerHTML=topHTML('\u0410\u043a\u043a\u0430\u0443\u043d\u0442')+
    '<div class="prof"><button data-act="avaPick" aria-label="\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440" style="border-radius:50%;position:relative">'+avaHTML(Net.me.uid,S.nick,'lg',Net.me.ava)+'<span style="position:absolute;right:0;bottom:0;width:28px;height:28px;border-radius:50%;background:var(--card3);display:grid;place-items:center;box-shadow:0 0 0 3px var(--bg)"><span style="width:15px;height:15px">'+ic('pencil')+'</span></span></button>'+
      '<button class="nick" data-act="nickEdit">'+esc(S.nick||'\u0418\u0433\u0440\u043e\u043a')+'</button>'+
      '<div class="bdg">'+myBadges()+'</div>'+(S.titles.length?'<button class="pill" data-act="titlePick" style="margin-top:4px">'+ic('medal')+(S.title?'\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0432\u0430\u043d\u0438\u0435':'\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0437\u0432\u0430\u043d\u0438\u0435')+'</button>':'')+'</div>'+
    '<div class="stats3" style="margin-top:18px"><div class="stat"><b>'+fmtN(S.opened)+'</b><span>\u043a\u0435\u0439\u0441\u043e\u0432</span></div><div class="stat"><b>'+shortN(L.worth(S))+'</b><span>\u0433\u0430\u0440\u0430\u0436, \u20bd</span></div><div class="stat"><b>'+L.level(S)+'</b><span>\u0443\u0440\u043e\u0432\u0435\u043d\u044c</span></div></div>'+
    secH('\u0413\u0430\u0440\u0430\u0436','garage')+
    '<div class="pad" style="margin-bottom:10px"><div class="segbox"><button class="'+(gV==='car'?'on':'')+'" data-act="gv" data-v="car">'+'\u041c\u0430\u0448\u0438\u043d\u0430</button><button class="'+(gV==='bike'?'on':'')+'" data-act="gv" data-v="bike">\u041f\u0438\u0442\u0431\u0430\u0439\u043a</button></div></div>'+
    '<button class="garage-view" data-act="garage" style="display:block;width:calc(100% - 2*var(--g))"><canvas id="acc-veh"></canvas><span class="pill on-card" style="position:absolute;right:12px;top:12px;background:rgba(0,0,0,.35)">\u041d\u0430\u0441\u0442\u0440\u043e\u0438\u0442\u044c</span>'+(S.veh[gV].plate?'<span style="position:absolute;left:12px;bottom:12px;width:120px">'+plateHTML(S.box.find(b=>b.id===S.veh[gV].plate))+'</span>':'')+'</button>'+
    '<div class="rows" style="margin-top:12px">'+
      '<button class="row" data-act="plates"><span class="ico" style="background:var(--orange)">'+ic('tag')+'</span><div class="mid"><div class="tt">\u041c\u043e\u0438 \u043d\u043e\u043c\u0435\u0440\u0430</div><div class="ss">'+S.box.length+' \u0438\u0437 '+L.BOX_CAP+(S.best?' \u00b7 \u043b\u0443\u0447\u0448\u0438\u0439 '+fmt(S.best.price):'')+'</div></div>'+ic('chev','chev')+'</button>'+
      '<button class="row" data-act="inventory"><span class="ico" style="background:var(--purple)">'+ic('sticker')+'</span><div class="mid"><div class="tt">\u0421\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438</div><div class="ss">'+S.inv.length+' '+plural(S.inv.length,'\u043f\u0440\u0435\u0434\u043c\u0435\u0442','\u043f\u0440\u0435\u0434\u043c\u0435\u0442\u0430','\u043f\u0440\u0435\u0434\u043c\u0435\u0442\u043e\u0432')+'</div></div>'+ic('chev','chev')+'</button></div>'+
    secH('\u0417\u043e\u0432\u0438\u0442\u0435 \u0434\u0440\u0443\u0437\u0435\u0439')+
    '<div class="card p" style="text-align:center"><div class="friends">'+fr.map((f,i)=>{const pos=[[-70,10,44],[-34,-18,40],[0,8,64],[38,-20,42],[72,12,38]][i];return'<span class="f" style="width:'+pos[2]+'px;height:'+pos[2]+'px;left:calc(50% + '+(pos[0]-pos[2]/2)+'px);top:'+(30+pos[1]-pos[2]/2+16)+'px;background:linear-gradient(160deg,'+f[1]+','+Draw.shade(f[1],-.3)+')">'+f[0]+'</span>'}).join('')+'</div>'+
      '<div style="font:500 16px/1.35 var(--f-ui);margin:4px 0 14px">\u041f\u0440\u0438\u0433\u043b\u0430\u0448\u0430\u0439\u0442\u0435 \u0434\u0440\u0443\u0437\u0435\u0439 \u0438 \u043f\u043e\u043b\u0443\u0447\u0430\u0439\u0442\u0435<br>'+fmt(refReward().m)+' \u0438 '+gem(refReward().g)+' \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e</div><button class="btn md" data-act="referral">'+ic('plus')+'\u041f\u0440\u0438\u0433\u043b\u0430\u0441\u0438\u0442\u044c \u0434\u0440\u0443\u0437\u0435\u0439</button></div>'+
    '<div class="rows" style="margin-top:12px"><button class="row" data-act="media"><span class="ico" style="background:var(--red)">'+ic('mega')+'</span><div class="mid"><div class="tt">\u041c\u0435\u0434\u0438\u0430</div><div class="ss">\u041a\u043e\u0434 \u0430\u0432\u0442\u043e\u0440\u0430 \u0438 \u043a\u0430\u0431\u0438\u043d\u0435\u0442 \u0431\u043b\u043e\u0433\u0435\u0440\u0430</div></div>'+ic('chev','chev')+'</button></div>'+
    secH('\u0421\u0442\u0435\u043d\u0430','myWall')+'<div id="acc-wall"><div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div></div>'+
    secH('\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438')+
    '<div class="group">'+
      '<div class="li"><span class="lic" style="background:var(--indigo)">'+ic('sun')+'</span><span class="lt">\u0422\u0435\u043c\u0430</span><select class="inp" style="height:34px;width:auto;padding:0 10px;font-size:15px" data-on="theme">'+[['system','\u041a\u0430\u043a \u0432 Telegram'],['light','\u0421\u0432\u0435\u0442\u043b\u0430\u044f'],['dark','\u0422\u0451\u043c\u043d\u0430\u044f']].map(o=>'<option value="'+o[0]+'"'+(Theme.get()===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>'+
      '<button class="li" data-act="sndToggle"><span class="lic" style="background:var(--green)">'+ic('sound')+'</span><span class="lt">\u0417\u0432\u0443\u043a\u0438</span><span class="lv">'+(Snd.on()?'\u0412\u043a\u043b':'\u0412\u044b\u043a\u043b')+'</span></button>'+
      '<button class="li" data-act="music"><span class="lic" style="background:var(--pink)">'+ic('music')+'</span><span class="lt">\u0421\u0432\u043e\u044f \u043c\u0443\u0437\u044b\u043a\u0430</span><span class="lv">'+Music.count()+'</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="promo"><span class="lic" style="background:var(--orange)">'+ic('ticket')+'</span><span class="lt">\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="history"><span class="lic" style="background:var(--stars)">'+ic('star')+'</span><span class="lt">\u041c\u043e\u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0438</span>'+ic('chev','chev')+'</button>'+
      (Net.me.role?'<button class="li" data-act="admin"><span class="lic" style="background:var(--red)">'+ic('shield')+'</span><span class="lt">\u0410\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c</span>'+ic('chev','chev')+'</button>':'')+
    '</div>'+
    '<div class="pad" style="margin-top:22px;text-align:center"><button class="muted" data-act="ownerLogin" style="font-size:13px">\u0412\u0445\u043e\u0434 \u0434\u043b\u044f \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430</button><div class="muted" style="font-size:12px;margin-top:6px">\u0412\u044b\u0431\u0438\u0432\u0430\u043d\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u043e\u0432 2.0</div></div>';
  hydrateAvas(el);
  requestAnimationFrame(()=>{const cv=$('acc-veh');if(cv)Draw.preview(cv,gV,vehLook(gV),{k:gV==='bike'?.82:.86})});
  loadWall(Net.me.uid,$('acc-wall'));
};
const shortN=n=>n>=1e9?(n/1e9).toFixed(1).replace('.',',')+' \u043c\u043b\u0440\u0434':n>=1e6?(n/1e6).toFixed(1).replace('.',',')+' \u043c\u043b\u043d':n>=1e4?Math.round(n/1e3)+' \u0442\u044b\u0441':fmtN(n);
function refReward(){const r=Object.assign({},L.REF_REW[L.plusTier(S.don)+1]);if(L.isPrem(S,now())){r.m+=L.REF_PREM.m;r.g+=L.REF_PREM.g}return r}
ACT.gv=el=>{gV=el.dataset.v;render()};
ON.themeChange=el=>{Theme.set(el.value);render()};
ACT.sndToggle=()=>{Snd.set(!Snd.on());render()};
ACT.me=()=>Tabs.go('account');

/* ---------- \u043d\u0438\u043a, \u0437\u0432\u0430\u043d\u0438\u0435, \u0430\u0432\u0430\u0442\u0430\u0440 ---------- */
ACT.nickEdit=()=>{
  Sheet.open({title:'\u041d\u0438\u043a',body:'<div class="field"><input class="inp" id="nick-i" maxlength="20" value="'+esc(S.nick)+'"></div><p class="note">\u041e\u0442 2 \u0434\u043e 20 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432. \u0412\u0438\u0434\u0435\u043d \u0432 \u0442\u043e\u043f\u0435, \u043d\u0430 \u0440\u044b\u043d\u043a\u0435 \u0438 \u0432 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f\u0445.</p><div class="foot"><button class="btn pri wide" data-act="nickSave">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c</button></div>'});
  setTimeout(()=>{const i=$('nick-i');if(i)i.focus()},300);
};
ACT.nickSave=el=>run('nick',{nick:$('nick-i').value},{btn:el,ok:()=>Sheet.close()});
ACT.titlePick=()=>Sheet.open({title:'\u0417\u0432\u0430\u043d\u0438\u0435',lead:'\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0432 \u043f\u0440\u043e\u0444\u0438\u043b\u0435, \u043d\u0430 \u0440\u044b\u043d\u043a\u0435 \u0438 \u0432 \u0442\u043e\u043f\u0435.',body:'<div class="group">'+['',...S.titles].map(t=>'<button class="li noic" data-act="titleSet" data-t="'+t+'"><span class="lt">'+(t?L.TITLES[t]:'\u0411\u0435\u0437 \u0437\u0432\u0430\u043d\u0438\u044f')+'</span>'+(S.title===t?'<span style="width:20px;height:20px;color:var(--accent)">'+ic('check')+'</span>':'')+'</button>').join('')+'</div>'});
ACT.titleSet=el=>{run('title',{t:el.dataset.t},{quiet:true});Sheet.close()};
ACT.avaPick=()=>{
  Sheet.open({title:'\u0410\u0432\u0430\u0442\u0430\u0440',body:'<div class="foot"><label class="btn pri wide" style="cursor:pointer">'+ic('plus')+'\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0444\u043e\u0442\u043e<input type="file" accept="image/*" hidden data-on="avaFile"></label>'+(Net.me.ava?'<button class="btn wide danger" data-act="avaDel">\u0423\u0431\u0440\u0430\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440</button>':'')+'</div><p class="note">\u0424\u043e\u0442\u043e \u043e\u0431\u0440\u0435\u0436\u0435\u0442\u0441\u044f \u0434\u043e \u043a\u0432\u0430\u0434\u0440\u0430\u0442\u0430 256 \u00d7 256. \u041d\u0435\u043f\u043e\u0434\u0445\u043e\u0434\u044f\u0449\u0438\u0435 \u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0438 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u0443\u0434\u0430\u043b\u044f\u0435\u0442.</p>'});
};
ON.avaFileChange=async el=>{
  const f=el.files&&el.files[0];if(!f)return;
  try{
    const data=await squareImage(f,256);
    await run('avatar',{data},{ok:()=>{Me.avaData=data;avaCache.set(Net.me.uid,Promise.resolve(data));Sheet.close();qsa('[data-ava="'+Net.me.uid+'"]').forEach(e=>{e.dataset.done='';});render()}});
  }catch(e){toast(e.message||'\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c \u0444\u043e\u0442\u043e','err')}
};
ACT.avaDel=el=>run('avatar',{data:''},{btn:el,ok:()=>{Me.avaData=null;avaCache.delete(Net.me.uid);Sheet.close();render()}});
function squareImage(file,size){
  return new Promise((res,rej)=>{
    const url=URL.createObjectURL(file);const img=new Image();
    img.onload=()=>{const s=Math.min(img.width,img.height);const cv=document.createElement('canvas');cv.width=cv.height=size;const c=cv.getContext('2d');c.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,size,size);URL.revokeObjectURL(url);
      let d=cv.toDataURL('image/webp',.82);if(!/^data:image\/webp/.test(d))d=cv.toDataURL('image/jpeg',.82);
      let q=.75;while(d.length>88000&&q>.3){d=cv.toDataURL('image/jpeg',q);q-=.1}
      if(d.length>88000)return rej(new Error('\u0424\u043e\u0442\u043e \u0441\u043b\u0438\u0448\u043a\u043e\u043c \u0431\u043e\u043b\u044c\u0448\u043e\u0435'));res(d)};
    img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('\u042d\u0442\u043e \u043d\u0435 \u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0430'))};img.src=url;
  });
}

/* ---------- \u0433\u0430\u0440\u0430\u0436 ---------- */
ACT.garage=el=>{if(el&&el.dataset&&el.dataset.v)gV=el.dataset.v;Sheet.close();Page.push('garage','\u0413\u0430\u0440\u0430\u0436',renderGarage)};
function renderGarage(el){
  const V=S.veh[gV];const kinds=gV;
  const skins=Object.keys(SKINS).filter(k=>k.startsWith(kinds+':')&&(SKINS[k].free||S.inv.some(i=>i.k==='skin'&&i.v===k)));
  const pl=V.plate&&S.box.find(b=>b.id===V.plate);
  const sw=(slot)=>Object.keys(COLORS).map(id=>{const own=S.colors.includes(id);return'<button class="sw'+(V[slot]===id?' on':'')+'" data-act="paint" data-s="'+slot+'" data-c="'+id+'" style="background:'+COLORS[id].c+'" aria-label="'+COLORS[id].n+'">'+(own?'':'<span class="lk">'+COLORS[id].cost+'\u25c6</span>')+'</button>'}).join('');
  const stickers=S.inv.filter(i=>i.k==='sticker');
  el.innerHTML='<div class="pad" style="margin-bottom:10px"><div class="segbox"><button class="'+(gV==='car'?'on':'')+'" data-act="gvp" data-v="car">\u041c\u0430\u0448\u0438\u043d\u0430</button><button class="'+(gV==='bike'?'on':'')+'" data-act="gvp" data-v="bike">\u041f\u0438\u0442\u0431\u0430\u0439\u043a</button></div></div>'+
    '<div class="garage-view" style="height:240px"><canvas id="gar-cv"></canvas></div>'+
    '<div class="card p" style="margin-top:12px;display:flex;align-items:center;gap:12px">'+(pl?'<div style="width:130px;flex:none">'+plateHTML(pl)+'</div>':'<span class="ico" style="width:52px;height:52px;border-radius:13px;background:var(--fill);display:grid;place-items:center">'+ic('tag')+'</span>')+'<div style="flex:1"><div style="font:600 16px var(--f-ui)">'+(pl?esc(plateText(pl.pl)):'\u041d\u043e\u043c\u0435\u0440 \u043d\u0435 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d')+'</div><div class="muted" style="font-size:13px">'+(pl?'\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d \u043d\u0430 '+(gV==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a'):'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0438\u0437 \u0433\u0430\u0440\u0430\u0436\u0430')+'</div></div><button class="pill" data-act="platePick">'+(pl?'\u0421\u043c\u0435\u043d\u0438\u0442\u044c':'\u0412\u044b\u0431\u0440\u0430\u0442\u044c')+'</button></div>'+
    '<div class="sec">\u0421\u043a\u0438\u043d</div><div class="opts">'+skins.map(k=>'<button class="opt'+(V.skin===k?' on':'')+'" data-act="vskin" data-v="'+k+'"><span class="rar" style="background:'+L.SKIN_R[SKINS[k].r].c+'"></span><canvas data-skin="'+k+'" style="width:84px;height:46px"></canvas>'+esc(SKINS[k].n)+'</button>').join('')+'<button class="opt" data-act="skinCase" data-m="'+(S.free.sc>0?'free':'gold')+'"><span style="width:46px;height:46px;display:grid;place-items:center;color:var(--purple)">'+ic('plus')+'</span>\u041a\u0435\u0439\u0441<small>'+(S.free.sc>0?'\u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e':gem(L.SKIN_CASE.gold))+'</small></button></div>'+
    '<div class="sec">\u041e\u0441\u043d\u043e\u0432\u043d\u043e\u0439 \u0446\u0432\u0435\u0442</div><div class="swatches">'+sw('c1')+'</div>'+
    '<div class="sec">\u0412\u0442\u043e\u0440\u043e\u0439 \u0446\u0432\u0435\u0442</div><div class="swatches">'+sw('c2')+'</div>'+
    '<div class="sec">\u041a\u043e\u043b\u0451\u0441\u0430</div><div class="opts">'+Object.keys(WHEELS).map(k=>{const own=S.wheels.includes(k);return'<button class="opt'+(V.wh===k?' on':'')+'" data-act="vwh" data-v="'+k+'">'+wheelIcon(k)+WHEELS[k].n+'<small>'+(own?(V.wh===k?'\u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u044b':'\u0435\u0441\u0442\u044c'):gem(WHEELS[k].cost))+'</small></button>'}).join('')+'</div>'+
    '<div class="sec">\u041e\u0431\u0432\u0435\u0441</div><div class="opts">'+Object.keys(KITS[gV]).map(k=>{const own=S.kits.includes(k);return'<button class="opt'+(V.kit===k?' on':'')+'" data-act="vkit" data-v="'+k+'">'+KITS[gV][k].n+'<small>'+(own?(V.kit===k?'\u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d':'\u0435\u0441\u0442\u044c'):gem(KITS[gV][k].cost))+'</small></button>'}).join('')+'</div>'+
    '<div class="sec">\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 <small>'+V.st.length+' \u0438\u0437 3</small></div>'+(stickers.length?'<div class="opts">'+stickers.map(x=>{const on=V.st.includes(x.id);return'<button class="opt'+(on?' on':'')+'" data-act="vst" data-id="'+x.id+'"><img src="'+Draw.stickerURL(x.v,96)+'" width="44" height="44" alt="">'+esc(STICKERS[x.v].n)+'<small>'+(on?'\u043d\u0430\u043a\u043b\u0435\u0435\u043d\u0430':'\u043d\u0430\u043a\u043b\u0435\u0438\u0442\u044c')+'</small></button>'}).join('')+'</div>':'<div class="empty">\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 \u0432\u044b\u043f\u0430\u0434\u0430\u044e\u0442 \u0438\u0437 \u043a\u0435\u0439\u0441\u0430 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438<button class="pill" data-act="stickerCase" data-m="'+(S.free.tc>0?'free':'gold')+'">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0437\u0430 '+(S.free.tc>0?'\u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e':gem(L.STICKER_CASE.gold))+'</button></div>')+
    '<p class="note">\u0421\u043a\u0438\u043d\u044b, \u043a\u0440\u0430\u0441\u043a\u0430, \u043a\u043e\u043b\u0451\u0441\u0430, \u043e\u0431\u0432\u0435\u0441 \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 \u043d\u0435 \u0432\u043b\u0438\u044f\u044e\u0442 \u043d\u0430 \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u2014 \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 \u0432\u043d\u0435\u0448\u043d\u0438\u0439 \u0432\u0438\u0434.</p>';
  hydrateSkins(el);
  requestAnimationFrame(()=>{const cv=$('gar-cv');if(cv)Draw.preview(cv,gV,vehLook(gV),{k:gV==='bike'?.84:.9})});
}
function wheelIcon(k){const cv=document.createElement('canvas');cv.width=cv.height=92;const c=cv.getContext('2d');Draw.wheel(c,46,46,30,k,.3,COLORS[S.veh[gV].c2].c);return'<img src="'+cv.toDataURL()+'" width="46" height="46" alt="">'}
ACT.gvp=el=>{gV=el.dataset.v;Page.renderTop()};
ACT.paint=el=>{
  const id=el.dataset.c,slot=el.dataset.s;
  if(!S.colors.includes(id)){const c=COLORS[id];confirmSheet('\u0426\u0432\u0435\u0442 \u00ab'+c.n+'\u00bb','\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+gem(c.cost)+'? \u0426\u0432\u0435\u0442 \u0441\u0442\u0430\u043d\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u0434\u043b\u044f \u043c\u0430\u0448\u0438\u043d\u044b \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430.','\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+gem(c.cost),()=>run('buyColor',{id},{ok:()=>run('vset',{v:gV,f:slot,val:id},{quiet:true})}));return}
  run('vset',{v:gV,f:slot,val:id},{quiet:true});Haptic.tick();
};
ACT.vskin=el=>{run('vset',{v:gV,f:'skin',val:el.dataset.v},{quiet:true});Haptic.tick()};
ACT.vwh=el=>{const k=el.dataset.v;if(!S.wheels.includes(k)){confirmSheet(WHEELS[k].n+' \u043a\u043e\u043b\u0451\u0441\u0430','\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+gem(WHEELS[k].cost)+'? \u041f\u043e\u0434\u043e\u0439\u0434\u0443\u0442 \u0438 \u043c\u0430\u0448\u0438\u043d\u0435, \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0443.','\u041a\u0443\u043f\u0438\u0442\u044c',()=>run('buyWheel',{id:k},{ok:()=>run('vset',{v:gV,f:'wh',val:k},{quiet:true})}));return}run('vset',{v:gV,f:'wh',val:k},{quiet:true});Haptic.tick()};
ACT.vkit=el=>{const k=el.dataset.v;if(!S.kits.includes(k)){confirmSheet('\u00ab'+KITS[gV][k].n+'\u00bb','\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+gem(KITS[gV][k].cost)+'?','\u041a\u0443\u043f\u0438\u0442\u044c',()=>run('buyKit',{v:gV,id:k},{ok:()=>run('vset',{v:gV,f:'kit',val:k},{quiet:true})}));return}run('vset',{v:gV,f:'kit',val:k},{quiet:true});Haptic.tick()};
ACT.vst=el=>{const id=+el.dataset.id;const cur=S.veh[gV].st.slice();const i=cur.indexOf(id);if(i>=0)cur.splice(i,1);else{if(cur.length>=3){toast('\u041d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u0442\u0440\u0451\u0445 \u043d\u0430\u043a\u043b\u0435\u0435\u043a');return}cur.push(id)}run('vset',{v:gV,f:'st',val:cur},{quiet:true});Haptic.tick()};
ACT.platePick=()=>{
  const l=S.box.slice().sort((a,b)=>b.price-a.price).slice(0,60);
  Sheet.open({title:'\u041d\u043e\u043c\u0435\u0440 \u043d\u0430 '+(gV==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a'),body:(S.veh[gV].plate?'<div class="pad" style="margin-bottom:12px"><button class="btn wide" data-act="plateSet" data-id="0">\u0421\u043d\u044f\u0442\u044c \u043d\u043e\u043c\u0435\u0440</button></div>':'')+(l.length?'<div class="grid2">'+l.map(x=>'<button class="mat" data-act="plateSet" data-id="'+x.id+'" style="display:grid;gap:6px;padding:10px">'+plateHTML(x)+'<span class="num" style="font:600 13px var(--f-ui)">'+fmt(x.price)+'</span></button>').join('')+'</div>':'<div class="empty">\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0432 \u00ab\u041a\u0435\u0439\u0441\u0430\u0445\u00bb</div>')});
};
ACT.plateSet=el=>{run('vset',{v:gV,f:'plate',val:+el.dataset.id},{quiet:true});Sheet.close()};

/* ---------- \u0441\u0442\u0435\u043d\u0430 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432 ---------- */
async function loadWall(uid,box){
  if(!box)return;
  try{const j=await pubProfile(uid);if(!document.body.contains(box))return;box.innerHTML=wallHTML(uid,j.comments);hydrateAvas(box)}
  catch(e){box.innerHTML='<div class="empty">'+esc(e.message)+'</div>'}
}
function wallHTML(uid,list){
  const own=uid===Net.me.uid;const adm=!!Net.me.role;
  return'<div class="card" style="overflow:hidden"><div style="padding:12px 14px;display:flex;gap:8px;align-items:flex-end"><textarea class="inp" id="cm-'+esc(uid)+'" maxlength="200" rows="1" placeholder="\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439" style="min-height:44px;height:44px;resize:none;padding-top:11px" data-on="cmLen"></textarea><button class="btn md blue" data-act="cmSend" data-uid="'+esc(uid)+'" style="height:44px">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c</button></div>'+
    (list.length?list.map(c=>'<div class="cmt"><button data-act="profile" data-uid="'+esc(c.author)+'">'+avaHTML(c.author,c.nick,'sm',true)+'</button><div class="body"><div class="who">'+esc(c.nick)+'<small>'+ago(c.t)+'</small></div><p>'+esc(c.text)+'</p><div class="ops">'+((own||adm||c.author===Net.me.uid)?'<button data-act="cmDel" data-id="'+esc(c.id)+'" data-uid="'+esc(uid)+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button>':'')+(c.author!==Net.me.uid?'<button data-act="cmRep" data-id="'+esc(c.id)+'">\u041f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f</button>':'')+'</div></div></div>').join(''):'<div class="cmt"><div class="body muted" style="font-size:15px">\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442</div></div>')+'</div>'+
    '<p class="note">\u0414\u043e 200 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432, \u043d\u0435 \u0447\u0430\u0449\u0435 \u0440\u0430\u0437\u0430 \u0432 30 \u0441\u0435\u043a\u0443\u043d\u0434. \u041c\u0430\u0442 \u0438 \u0441\u0441\u044b\u043b\u043a\u0438 \u043d\u0435 \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430\u044e\u0442\u0441\u044f.</p>';
}
ON.cmLen=el=>{el.style.height='44px';el.style.height=Math.min(140,el.scrollHeight)+'px'};
ACT.cmSend=el=>{
  const uid=el.dataset.uid;const ta=$('cm-'+uid);const txt=(ta&&ta.value||'').trim();
  const chk=L.checkComment(txt);if(!chk.ok){toast(chk.err,'err');Haptic.err();return}
  run('comment',{wall:uid,text:txt},{btn:el,quiet:true,ok:()=>{ta.value='';toast('\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d');reloadWall(uid)}});
};
ACT.cmDel=el=>confirmSheet('\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439?','','\u0423\u0434\u0430\u043b\u0438\u0442\u044c',()=>run(Net.me.role&&el.dataset.uid!==Net.me.uid?'adm.cdel':'commentDel',{id:el.dataset.id},{quiet:true,ok:()=>{toast('\u0423\u0434\u0430\u043b\u0435\u043d\u043e');reloadWall(el.dataset.uid)}}),true);
ACT.cmRep=el=>confirmSheet('\u041f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f?','\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u0438\u0442 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u0438 \u0443\u0434\u0430\u043b\u0438\u0442 \u0435\u0433\u043e, \u0435\u0441\u043b\u0438 \u043e\u043d \u043d\u0430\u0440\u0443\u0448\u0430\u0435\u0442 \u043f\u0440\u0430\u0432\u0438\u043b\u0430.','\u041f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f',()=>run('report',{id:el.dataset.id}),true);
function reloadWall(uid){if(uid===Net.me.uid&&Tabs.cur==='account'&&!Page.stack.length)loadWall(uid,$('acc-wall'));if(Prof.cur===uid)Prof.reload()}
ACT.myWall=()=>ACT.profile({dataset:{uid:Net.me.uid}});

/* ---------- \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0438\u0433\u0440\u043e\u043a\u0430 ---------- */
const Prof={cur:null,data:null,reload(){if(Page.is('profile'))loadProfile(Prof.cur)}};
ACT.profile=el=>{
  const uid=el.dataset.uid;if(!uid)return;Sheet.close();
  Prof.cur=uid;Prof.data=null;
  Page.push('profile','\u041f\u0440\u043e\u0444\u0438\u043b\u044c',renderProfile,{noTitle:true,onClose:()=>{Prof.cur=null}});
  loadProfile(uid);
};
async function loadProfile(uid){try{Prof.data=await pubProfile(uid);if(Prof.cur===uid&&Page.is('profile'))Page.renderTop()}catch(e){toast(e.message,'err')}}
function renderProfile(el){
  const d=Prof.data;if(!d){el.innerHTML='<div class="empty" style="margin-top:40px">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043f\u0440\u043e\u0444\u0438\u043b\u044c\u2026</div>';return}
  const p=d.p;const veh=p.veh||{};const own=p.uid===Net.me.uid;
  el.innerHTML='<div class="prof">'+avaHTML(p.uid,p.nick,'lg',p.ava)+'<div class="nick">'+esc(p.nick)+'</div><div class="bdg">'+badgesFor(p)+'</div><div class="muted" style="font-size:13px">\u0412 \u0438\u0433\u0440\u0435 \u0441 '+dateRu(Number(p.created))+'</div></div>'+
    '<div class="stats3" style="margin-top:16px"><div class="stat"><b>'+p.lvl+'</b><span>\u0443\u0440\u043e\u0432\u0435\u043d\u044c</span></div><div class="stat"><b>'+shortN(Number(p.worth))+'</b><span>\u0433\u0430\u0440\u0430\u0436, \u20bd</span></div><div class="stat"><b>'+fmtN(p.xp)+'</b><span>\u043e\u043f\u044b\u0442</span></div></div>'+
    (p.best?'<div class="sec">\u041b\u0443\u0447\u0448\u0438\u0439 \u043d\u043e\u043c\u0435\u0440</div><button class="card p" data-act="pinsp" style="display:block;width:calc(100% - 2*var(--g))"><div style="max-width:320px;margin:0 auto">'+plateHTML(p.best)+'</div><div style="display:flex;justify-content:center;gap:6px;margin-top:10px;flex-wrap:wrap">'+itemMeta(p.best)+'</div></button>':'')+
    (veh.car?'<div class="sec">\u0413\u0430\u0440\u0430\u0436</div><div class="grid2"><div class="garage-view" style="margin:0;height:150px"><canvas id="pv-car"></canvas>'+(veh.plates&&veh.plates.car?'<span style="position:absolute;left:8px;bottom:8px;width:84px">'+plateHTML(veh.plates.car)+'</span>':'')+'</div><div class="garage-view" style="margin:0;height:150px"><canvas id="pv-bike"></canvas>'+(veh.plates&&veh.plates.bike?'<span style="position:absolute;left:8px;bottom:8px;width:84px">'+plateHTML(veh.plates.bike)+'</span>':'')+'</div></div>':'')+
    '<div class="sec">\u0421\u0442\u0435\u043d\u0430</div>'+wallHTML(p.uid,d.comments)+
    (Net.me.role&&!own?'<div class="sec">\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f</div><div class="group"><button class="li" data-act="admBanP" data-uid="'+esc(p.uid)+'" data-on="'+(p.banned?0:1)+'"><span class="lic" style="background:var(--red)">'+ic('lock')+'</span><span class="lt">'+(p.banned?'\u0420\u0430\u0437\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c':'\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c')+'</span></button>'+(p.ava?'<button class="li" data-act="admAvaP" data-uid="'+esc(p.uid)+'"><span class="lic" style="background:var(--orange)">'+ic('trash')+'</span><span class="lt">\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440</span></button>':'')+'<button class="li" data-act="admGiftP" data-uid="'+esc(p.uid)+'"><span class="lic" style="background:var(--green)">'+ic('gift')+'</span><span class="lt">\u041f\u043e\u0434\u0430\u0440\u043e\u043a</span></button></div>':'');
  hydrateAvas(el);
  requestAnimationFrame(()=>{
    const mk=k=>{const v=veh[k];if(!v)return null;return Object.assign({},v,{st:(veh.st&&veh.st[k])||[]})};
    const a=$('pv-car'),b=$('pv-bike');if(a&&veh.car)Draw.preview(a,'car',mk('car'),{k:.8});if(b&&veh.bike)Draw.preview(b,'bike',mk('bike'),{k:.76});
  });
}
ACT.pinsp=()=>{const p=Prof.data&&Prof.data.p;if(p&&p.best)inspect(Object.assign({},p.best),{title:plateText(p.best.pl)})};

/* ---------- \u0440\u0435\u0444\u0435\u0440\u0430\u043b\u044b ---------- */
function refLink(){const bot=Net.cfg.bot;if(!bot)return'';return'https://t.me/'+bot+'/'+(Net.cfg.app||'play')+'?startapp=r_'+Net.me.uid}
ACT.referral=()=>{Page.push('ref','\u0414\u0440\u0443\u0437\u044c\u044f',renderRef);loadRefInfo()};
let refInfo=null;
async function loadRefInfo(){try{const r=await act('refInfo');refInfo=r.refs;if(Page.is('ref'))Page.renderTop()}catch(e){}}
function renderRef(el){
  const link=refLink();const t=L.plusTier(S.don);const prem=L.isPrem(S,now());const my=refReward();
  const tiers=[{n:'\u0411\u0435\u0437 Plus',r:L.REF_REW[0]}].concat(L.PLUS.map((p,i)=>({n:'Plus \u00b7 '+p.n,r:L.REF_REW[i+1]})));
  const ri=refInfo||{all:0,active:0,paid:0,queued:0,week:0,last:[]};
  el.innerHTML='<p class="lead">\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043f\u0440\u0438\u0445\u043e\u0434\u0438\u0442, \u043a\u043e\u0433\u0434\u0430 \u0434\u0440\u0443\u0433 \u0434\u043e\u0439\u0434\u0451\u0442 \u0434\u043e '+L.REF_LVL+' \u0443\u0440\u043e\u0432\u043d\u044f \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430. \u0417\u0430 \u043d\u0435\u0434\u0435\u043b\u044e \u0437\u0430\u0441\u0447\u0438\u0442\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0434\u043e '+L.REF_WEEK+' \u0434\u0440\u0443\u0437\u0435\u0439, \u043e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u2014 \u043d\u0430 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0439 \u043d\u0435\u0434\u0435\u043b\u0435.</p>'+
    '<div class="hero g-orange" style="background:var(--gc);min-height:170px"><p style="margin:0;color:var(--tint)">\u0412\u0430\u0448\u0430 \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 \u0434\u0440\u0443\u0433\u0430</p><h3 class="num">'+fmt(my.m)+'<br>'+gem(my.g)+'</h3><p>'+(t>=0?'\u0421\u0442\u0430\u0442\u0443\u0441 Plus \u00b7 '+L.PLUS[t].n:'\u0411\u0435\u0437 Plus')+(prem?' + Premium':'')+'</p></div>'+
    '<div class="card p" style="margin-top:12px;display:grid;gap:10px">'+(link?'<div class="inp num" style="display:flex;align-items:center;font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;height:44px">'+esc(link)+'</div><div class="rowf"><button class="btn md" data-act="copyRef">'+ic('copy')+'\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c</button><button class="btn md pri" data-act="shareRef">'+ic('share')+'\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f</button></div>':'<div class="muted">\u0421\u0441\u044b\u043b\u043a\u0430 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f, \u043a\u043e\u0433\u0434\u0430 \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442 \u0431\u043e\u0442\u0430 \u0432 \u0430\u0434\u043c\u0438\u043d\u043a\u0435.</div>')+'</div>'+
    (S.hint.ref<now()&&t<0?'<div class="row" style="margin:12px var(--g) 0;width:auto;background:rgba(255,200,61,.14)"><div class="mid"><div class="tt" style="font-size:16px;white-space:normal">\u0421 Plus \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 \u0434\u0440\u0443\u0433\u0430 \u0432 10 \u0440\u0430\u0437 \u0432\u044b\u0448\u0435</div><div class="ss" style="white-space:normal">Plus \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u043a\u0430\u0436\u0434\u044b\u0439, \u043a\u0442\u043e \u0445\u043e\u0442\u044c \u0440\u0430\u0437 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0430\u043b \u0438\u0433\u0440\u0443</div></div><button class="iconbtn" data-act="refHintX" aria-label="\u0421\u043a\u0440\u044b\u0442\u044c \u043d\u0430 \u043d\u0435\u0434\u0435\u043b\u044e">'+ic('close')+'</button></div>':'')+
    '<div class="stats3" style="margin-top:12px"><div class="stat"><b>'+ri.all+'</b><span>\u043f\u0440\u0438\u0448\u043b\u0438</span></div><div class="stat"><b>'+ri.active+'</b><span>\u0434\u043e\u0448\u043b\u0438 \u0434\u043e '+L.REF_LVL+' \u0443\u0440.</span></div><div class="stat"><b>'+ri.week+' / '+L.REF_WEEK+'</b><span>\u043d\u0430 \u044d\u0442\u043e\u0439 \u043d\u0435\u0434\u0435\u043b\u0435</span></div></div>'+
    (ri.queued?'<p class="note">'+ri.queued+' '+plural(ri.queued,'\u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0436\u0434\u0451\u0442','\u043d\u0430\u0433\u0440\u0430\u0434\u044b \u0436\u0434\u0443\u0442','\u043d\u0430\u0433\u0440\u0430\u0434 \u0436\u0434\u0443\u0442')+' \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0439 \u043d\u0435\u0434\u0435\u043b\u0438.</p>':'')+
    '<div class="sec">\u0421\u043a\u043e\u043b\u044c\u043a\u043e \u0434\u0430\u044e\u0442 \u0437\u0430 \u0434\u0440\u0443\u0433\u0430</div><div class="group">'+tiers.map((x,i)=>'<div class="li noic" style="'+(i===t+1?'background:var(--fill3)':'')+'"><span class="lt">'+x.n+(i===t+1?' <span class="muted">(\u0432\u044b)</span>':'')+'</span><span class="lv num" style="text-align:right;color:var(--text)">'+shortN(x.r.m)+' \u20bd \u00b7 '+fmtN(x.r.g)+' \u25c6</span></div>').join('')+'<div class="li noic"><span class="lt">Premium \u0441\u0432\u0435\u0440\u0445\u0443</span><span class="lv num" style="color:var(--text)">+'+shortN(L.REF_PREM.m)+' \u20bd \u00b7 +'+fmtN(L.REF_PREM.g)+' \u25c6</span></div></div>'+
    (ri.last.length?'<div class="sec">\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435</div><div class="group">'+ri.last.map(r=>'<div class="li noic"><span class="lt">'+esc(r.nick)+'</span><span class="lv">'+(r.state==='paid'?'\u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430':r.state==='ready'?'\u0436\u0434\u0451\u0442 \u043b\u0438\u043c\u0438\u0442\u0430 \u043d\u0435\u0434\u0435\u043b\u0438':'\u0435\u0449\u0451 \u0438\u0433\u0440\u0430\u0435\u0442')+'</span></div>').join('')+'</div>':'');
}
ACT.copyRef=async()=>{const l=refLink();if(!l)return;await copyText(l);toast('\u0421\u0441\u044b\u043b\u043a\u0430 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0430');Haptic.ok();if(S.hint.ref<now()&&L.plusTier(S.don)<0)setTimeout(()=>toast('\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430: \u0441 Plus \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0434\u0440\u0443\u0433\u0430 \u0434\u0430\u044e\u0442 \u0432 10 \u0440\u0430\u0437 \u0431\u043e\u043b\u044c\u0448\u0435'),900)};
ACT.shareRef=el=>{
  const l=refLink();if(!l){toast('\u0421\u0441\u044b\u043b\u043a\u0430 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f \u0431\u043e\u0442\u0430');return}
  if(el&&el.dataset&&el.dataset.src==='drop')run('hint',{k:'share'},{quiet:true});
  const text='\u0412\u044b\u0431\u0438\u0432\u0430\u044e \u043d\u043e\u043c\u0435\u0440\u0430 \u0432 Telegram. \u0417\u0430\u043b\u0435\u0442\u0430\u0439!';
  openLink('https://t.me/share/url?url='+encodeURIComponent(l)+'&text='+encodeURIComponent(text));
};
ACT.refHintX=()=>{run('hint',{k:'ref'},{quiet:true});Page.renderTop()};

/* ---------- \u043c\u0435\u0434\u0438\u0430 ---------- */
let mediaInfo=null;
ACT.media=()=>{mediaInfo=null;Page.push('media','\u041c\u0435\u0434\u0438\u0430',renderMedia);act('mediaInfo').then(r=>{mediaInfo=r;if(Page.is('media'))Page.renderTop()}).catch(e=>toast(e.message,'err'))};
function renderMedia(el){
  if(!mediaInfo){el.innerHTML='<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>';return}
  const m=mediaInfo.media;
  if(!m||m.status==='rejected'){
    el.innerHTML='<p class="lead">\u0414\u043b\u044f \u0431\u043b\u043e\u0433\u0435\u0440\u043e\u0432 \u0438 \u0430\u0432\u0442\u043e\u0440\u043e\u0432 \u043a\u0430\u043d\u0430\u043b\u043e\u0432. \u041f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 \u0441\u0432\u043e\u0439 \u043a\u043e\u0434 \u0430\u0432\u0442\u043e\u0440\u0430: \u0438\u0433\u0440\u043e\u043a\u0438, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0435\u0433\u043e \u0443\u043a\u0430\u0436\u0443\u0442, \u043f\u043e\u043b\u0443\u0447\u0430\u044e\u0442 +5% \u0433\u043e\u043b\u0434\u044b \u043a \u043f\u043e\u043a\u0443\u043f\u043a\u0430\u043c, \u0430 \u0432\u0430\u043c \u0438\u0434\u0451\u0442 10% \u043e\u0442 \u043a\u0443\u043f\u043b\u0435\u043d\u043d\u043e\u0439 \u0438\u043c\u0438 \u0433\u043e\u043b\u0434\u044b.</p>'+
      (m&&m.status==='rejected'?'<div class="netbar">\u041f\u0440\u043e\u0448\u043b\u0430\u044f \u0437\u0430\u044f\u0432\u043a\u0430 \u043e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u0430. \u041c\u043e\u0436\u043d\u043e \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0441\u043d\u043e\u0432\u0430.</div>':'')+
      '<div class="field" style="margin-top:12px"><label>\u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 \u043a\u0430\u043d\u0430\u043b</label><input class="inp" id="md-ch" placeholder="https://t.me/\u0432\u0430\u0448_\u043a\u0430\u043d\u0430\u043b"></div><div class="field"><label>\u0416\u0435\u043b\u0430\u0435\u043c\u044b\u0439 \u043a\u043e\u0434 (\u043b\u0430\u0442\u0438\u043d\u0438\u0446\u0430 \u0438\u043b\u0438 \u043a\u0438\u0440\u0438\u043b\u043b\u0438\u0446\u0430)</label><input class="inp" id="md-code" maxlength="16" placeholder="\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, NOMERA"></div>'+
      '<div class="pad"><button class="btn pri wide" data-act="mediaApply">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443</button></div><p class="note">\u0417\u0430\u044f\u0432\u043a\u0443 \u043e\u0434\u043e\u0431\u0440\u044f\u0435\u0442 \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446, \u0430 \u043f\u043e\u0441\u043b\u0435 20 \u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0445 \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0451\u043d\u043d\u044b\u0445 \u2014 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438.</p>';
    return;
  }
  if(m.status==='pending'){el.innerHTML='<div class="empty">'+ic('clock')+'\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 \u0440\u0430\u0441\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u0438\u0438<span class="num">\u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0445 \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0451\u043d\u043d\u044b\u0445: '+m.active+' \u0438\u0437 20</span></div>';return}
  el.innerHTML='<div class="hero g-red" style="background:var(--gc);min-height:160px"><p style="margin:0;color:var(--tint)">\u0412\u0430\u0448 \u043a\u043e\u0434 \u0430\u0432\u0442\u043e\u0440\u0430</p><h3 style="font-size:34px">'+esc(m.code)+'</h3><p>\u0414\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 7 \u0434\u043d\u0435\u0439 \u043f\u043e\u0441\u043b\u0435 \u0432\u0432\u043e\u0434\u0430. \u0421\u0432\u043e\u0439 \u043a\u043e\u0434 \u0443\u043a\u0430\u0437\u0430\u0442\u044c \u043d\u0435\u043b\u044c\u0437\u044f.</p></div>'+
    '<div class="stats3" style="margin-top:12px"><div class="stat"><b>'+m.invites+'</b><span>\u043f\u043e \u0441\u0441\u044b\u043b\u043a\u0435</span></div><div class="stat"><b>'+m.active+'</b><span>\u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0435</span></div><div class="stat"><b>'+m.buys+'</b><span>\u043f\u043e\u043a\u0443\u043f\u043e\u043a</span></div></div>'+
    '<div class="card p" style="margin-top:12px;display:flex;align-items:center;gap:12px"><div style="flex:1"><div class="muted" style="font-size:13px">\u041d\u0430\u0447\u0438\u0441\u043b\u0435\u043d\u043e \u043a \u0432\u044b\u0432\u043e\u0434\u0443</div><div style="font:700 26px var(--f-ui)" class="num">'+gem(m.earned)+'</div><div class="muted" style="font-size:13px">\u0412\u0441\u0435\u0433\u043e \u0437\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u043e '+gem(m.total)+'</div></div><button class="btn md pri'+(m.earned>0?'':' off')+'" data-act="mediaClaim">\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u043d\u0430 \u0431\u0430\u043b\u0430\u043d\u0441</button></div>'+
    '<div class="pad" style="margin-top:12px;display:grid;gap:10px"><button class="btn md" data-act="copyCode" data-c="'+esc(m.code)+'">'+ic('copy')+'\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u043e\u0434</button><button class="btn md" data-act="copyRef">'+ic('copy')+'\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443</button></div>';
}
ACT.mediaApply=el=>run('mediaApply',{channel:$('md-ch').value,code:$('md-code').value},{btn:el,ok:()=>ACT.back()});
ACT.mediaClaim=el=>run('mediaClaim',{},{btn:el,ok:()=>{Snd.coin();act('mediaInfo').then(r=>{mediaInfo=r;Page.renderTop()})}});
ACT.copyCode=async el=>{await copyText(el.dataset.c);toast('\u041a\u043e\u0434 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d')};

/* ---------- \u043f\u0440\u043e\u043c\u043e\u043a\u043e\u0434, \u043f\u043e\u043a\u0443\u043f\u043a\u0438, \u0432\u0445\u043e\u0434 \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430 ---------- */
ACT.promo=()=>{Sheet.open({title:'\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434',body:'<div class="field"><input class="inp" id="promo-i" placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0434" autocapitalize="characters" autocomplete="off"></div><div class="foot"><button class="btn pri wide" data-act="promoGo">\u0410\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u0442\u044c</button></div>'});setTimeout(()=>{const i=$('promo-i');if(i)i.focus()},300)};
ACT.promoGo=el=>run('redeem',{code:$('promo-i').value},{btn:el,ok:()=>{Sheet.close();Snd.win(3)}});
ACT.history=async()=>{
  const sh=Sheet.open({title:'\u041c\u043e\u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0438',body:'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>'});
  try{const r=await act('payments');Sheet.body(r.list.length?'<div class="group">'+r.list.map(x=>'<div class="li noic"><span class="lt">'+esc(productName(x.pid))+'<br><span class="muted" style="font-size:13px">'+dateRu(x.t)+'</span></span><span class="lv num">'+STAR(x.stars)+'</span></div>').join('')+'</div>':'<div class="empty">\u041f\u043e\u043a\u0443\u043f\u043e\u043a \u043f\u043e\u043a\u0430 \u043d\u0435 \u0431\u044b\u043b\u043e</div>')}catch(e){Sheet.body('<div class="empty">'+esc(e.message)+'</div>')}
};
ACT.ownerLogin=()=>{Sheet.open({title:'\u0412\u0445\u043e\u0434 \u0434\u043b\u044f \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430',lead:'\u0412\u0432\u0435\u0434\u0438\u0442\u0435 ADMIN_KEY \u0438\u0437 \u0441\u0435\u043a\u0440\u0435\u0442\u043e\u0432 \u0444\u0443\u043d\u043a\u0446\u0438\u0438.',body:'<div class="field"><input class="inp" id="own-k" type="password" autocomplete="off"></div><div class="foot"><button class="btn pri wide" data-act="ownerGo">\u0412\u043e\u0439\u0442\u0438</button></div>'})};
ACT.ownerGo=el=>run('admin',{key:$('own-k').value},{btn:el,ok:()=>{Sheet.close();render()}});

/* ---------- \u043f\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 ---------- */
function welcome(){
  Sheet.open({title:'\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c!',body:'<div class="rows" style="margin-top:6px">'+
    [['case','var(--orange)','\u041e\u0442\u043a\u0440\u044b\u0432\u0430\u0439\u0442\u0435 \u043a\u0435\u0439\u0441\u044b','\u041d\u043e\u043c\u0435\u0440\u0430 \u0448\u0435\u0441\u0442\u0438 \u0441\u0442\u0440\u0430\u043d: \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b, \u0438\u0437\u043d\u043e\u0441 \u0438 \u043f\u0430\u0442\u0442\u0435\u0440\u043d \u0434\u0435\u043b\u0430\u044e\u0442 \u043a\u0430\u0436\u0434\u044b\u0439 \u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u043c'],['games','var(--blue)','\u0417\u0430\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u0439\u0442\u0435 \u0432 \u0438\u0433\u0440\u0430\u0445','\u0412 Rider \u0438 \u0421\u0442\u0430\u043d\u0442\u0435 \u043e\u0434\u043d\u043e \u043e\u0447\u043a\u043e \u2014 \u043e\u0434\u0438\u043d \u0440\u0443\u0431\u043b\u044c, \u043f\u043b\u044e\u0441 \u043a\u043b\u044e\u0447\u0438'],['cart','var(--green)','\u0422\u043e\u0440\u0433\u0443\u0439\u0442\u0435','\u041f\u0440\u043e\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440\u0430 \u0437\u0430 \u0440\u0443\u0431\u043b\u0438, \u0441\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 \u2014 \u0437\u0430 \u0433\u043e\u043b\u0434\u0443'],['car','var(--purple)','\u0421\u043e\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u043c\u0430\u0448\u0438\u043d\u0443','\u0421\u043a\u0438\u043d\u044b, \u0434\u0432\u0435 \u043a\u0440\u0430\u0441\u043a\u0438, \u043a\u043e\u043b\u0451\u0441\u0430, \u043e\u0431\u0432\u0435\u0441, \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 \u0438 \u0432\u0430\u0448 \u043d\u043e\u043c\u0435\u0440']]
    .map(r=>'<div class="row" style="min-height:0"><span class="ico" style="background:'+r[1]+';width:44px;height:44px">'+ic(r[0])+'</span><div class="mid"><div class="tt" style="font-size:16px">'+r[2]+'</div><div class="ss" style="white-space:normal">'+r[3]+'</div></div></div>').join('')+
    '</div><div class="foot"><button class="btn pri wide" data-act="welcomeGo">\u041d\u0430\u0447\u0430\u0442\u044c \u0441 '+fmt(S.bal)+'</button></div>',onClose:()=>{if(S.welcome)run('welcome',{},{quiet:true})}});
}
ACT.welcomeGo=()=>Sheet.close();

/* ================= \u0434\u043e\u043d\u0430\u0442 \u0447\u0435\u0440\u0435\u0437 Telegram Stars ================= */
const PACK_BASE={g:[100,330,700,1500],k:[5,16,35,80]};
const rub=st=>Math.round(st*(Net.cfg.rate||1.8));
function packN(t,i){return PACK_BASE[t][i]*((Net.cfg.mult||{})[t]||1)}
function productName(pid){
  let m=/^([gk])([0-3])$/.exec(pid);if(m)return m[1]==='g'?gem(packN('g',+m[2])):keyN(packN('k',+m[2]));
  if(pid==='prem')return'Premium \u043d\u0430 '+L.PREM_DAYS+' \u0434\u043d\u0435\u0439';
  m=/^promo:(\w+)$/.exec(pid);if(m){const p=(Net.cfg.promos||[]).find(x=>x.id===m[1]);return p?p.title:'\u0410\u043a\u0446\u0438\u044f'}
  return pid;
}
ACT.donate=()=>{if(Page.is('donate'))return;Sheet.close();Page.push('donate','\u0414\u043e\u043d\u0430\u0442',renderDonate,{onClose:()=>$('donate-btn').classList.remove('on')});$('donate-btn').classList.add('on')};
function giveLine(g){const p=[];if(g.g)p.push(gem(g.g));if(g.k)p.push(keyN(g.k));if(g.m)p.push(fmt(g.m));if(g.sc)p.push('\u043a\u0435\u0439\u0441 \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438 \u00d7'+g.sc);if(g.tc)p.push('\u043a\u0435\u0439\u0441 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438 \u00d7'+g.tc);if(g.prem)p.push('Premium '+g.prem+' \u0434\u043d.');return p.join(' + ')}
function renderDonate(el){
  const t=now();const cfg=Net.cfg;const pr=cfg.prices||{p:[55,166,328,661],prem:277};
  const promos=(cfg.promos||[]).filter(p=>!p.until||p.until>t);
  const tier=L.plusTier(S.don);const next=L.PLUS[tier+1];
  const mg=(cfg.mult||{}).g||1,mk=(cfg.mult||{}).k||1;
  const heroes=promos.map((p,i)=>{const lim=p.limit?Math.max(0,p.limit-(S.promo[p.id]||0)):null;const g=['g-purple','g-blue','g-green','g-red'][i%4];
    return'<div class="hero '+g+'" style="background:var(--gc);width:min(86vw,470px);margin:0;flex:none;scroll-snap-align:center"><p style="margin:0;color:var(--tint)">\u0410\u043a\u0446\u0438\u044f'+(p.until?' \u0434\u043e '+dateRu(p.until):'')+'</p><h3>'+esc(p.title)+'</h3><p>'+esc(giveLine(p.give))+(p.desc?'. '+esc(p.desc):'')+'</p><div class="acts">'+(lim===0?'<span class="pill on-card" style="opacity:.6">\u041a\u0443\u043f\u043b\u0435\u043d\u043e</span>':'<button class="pill on-card" data-act="buy" data-pid="promo:'+p.id+'">'+STAR(p.stars)+'</button>')+(lim?'<span class="pill on-card" style="background:transparent">\u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c '+lim+'</span>':'')+'</div></div>'});
  heroes.push('<div class="hero g-purple" style="background:var(--gc);width:min(86vw,470px);margin:0;flex:none;scroll-snap-align:center"><p style="margin:0;color:var(--tint)">'+(L.isPrem(S,t)?'\u0410\u043a\u0442\u0438\u0432\u0435\u043d \u0434\u043e '+dateRu(S.prem):'40 \u0434\u043d\u0435\u0439')+'</p><h3>Premium</h3><p>\u041f\u0440\u0435\u043c\u0438\u0443\u043c-\u043b\u0438\u043d\u0438\u044f \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430 \u0438 +'+shortN(L.REF_PREM.m)+' \u20bd \u0438 +'+fmtN(L.REF_PREM.g)+' \u25c6 \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0434\u0440\u0443\u0433\u0430</p><div class="acts"><button class="pill on-card" data-act="premInfo">\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435</button></div></div>');
  el.innerHTML='<p class="lead">\u041f\u043e\u043a\u0443\u043f\u043a\u0438 \u0438\u0434\u0443\u0442 \u0447\u0435\u0440\u0435\u0437 Telegram Stars. \u0413\u043e\u043b\u0434\u0430 \u0438 \u043a\u043b\u044e\u0447\u0438 \u043e\u0441\u0442\u0430\u044e\u0442\u0441\u044f \u0432 \u0438\u0433\u0440\u0435: \u0438\u0445 \u043d\u0435\u043b\u044c\u0437\u044f \u0432\u044b\u0432\u0435\u0441\u0442\u0438 \u0438\u043b\u0438 \u043e\u0431\u043c\u0435\u043d\u044f\u0442\u044c \u043d\u0430 \u0434\u0435\u043d\u044c\u0433\u0438.</p>'+
    '<div class="shelf" id="dn-hero" style="scroll-snap-type:x mandatory">'+heroes.join('')+'</div>'+(heroes.length>1?'<div class="dots" id="dn-dots">'+heroes.map((h,i)=>'<i class="'+(i?'':'on')+'"></i>').join('')+'</div>':'')+
    secH('\u0413\u043e\u043b\u0434\u0430')+(mg>1?'<p class="sub">\u0410\u043a\u0446\u0438\u044f \u00d7'+mg+' \u043d\u0430 \u0432\u0441\u0435 \u043f\u0430\u043a\u0435\u0442\u044b \u0433\u043e\u043b\u0434\u044b</p>':'')+
    '<div class="grid2">'+[0,1,2,3].map(i=>'<button class="gc '+['g-yellow','g-orange','g-red','g-purple'][i]+'" data-act="buy" data-pid="g'+i+'" style="height:168px;text-align:left"><span class="art" style="right:12px;top:12px;width:'+(46+i*8)+'px;height:'+(46+i*8)+'px;color:rgba(255,255,255,.9)">'+ic('gem')+'</span>'+(mg>1?'<span class="k"><s>'+fmtN(PACK_BASE.g[i])+'</s> \u00d7'+mg+'</span>':'')+'<span class="t num" style="font-size:24px;font-weight:800">'+fmtN(packN('g',i))+' \u25c6</span><span class="s">\u2248 '+fmt(rub(pr.p[i]))+'</span><span class="act"><span class="pill on-card">'+STAR(pr.p[i])+'</span></span></button>').join('')+'</div>'+
    secH('\u041a\u043b\u044e\u0447\u0438')+(mk>1?'<p class="sub">\u0410\u043a\u0446\u0438\u044f \u00d7'+mk+' \u043d\u0430 \u0432\u0441\u0435 \u043f\u0430\u043a\u0435\u0442\u044b \u043a\u043b\u044e\u0447\u0435\u0439</p>':'')+
    '<div class="rows">'+[0,1,2,3].map(i=>'<button class="row" data-act="buy" data-pid="k'+i+'"><span class="ico" style="background:var(--teal)">'+ic('key')+'</span><div class="mid"><div class="tt num">'+keyN(packN('k',i))+'</div><div class="ss">'+(mk>1?'<s>'+PACK_BASE.k[i]+'</s> \u00d7'+mk+' \u00b7 ':'')+'\u2248 '+fmt(rub(pr.p[i]))+'</div></div><span class="pill">'+STAR(pr.p[i])+'</span></button>').join('')+'</div>'+
    secH('\u0421\u0442\u0430\u0442\u0443\u0441 Plus')+
    '<div class="card p"><div style="display:flex;align-items:center;gap:12px"><span class="ico" style="width:52px;height:52px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(180deg,#ffd76a,#f0a800);color:#3a2600">'+ic('star')+'</span><div style="flex:1"><div style="font:600 17px var(--f-ui)">'+(tier>=0?'Plus \u00b7 '+L.PLUS[tier].n:'\u041f\u043e\u043a\u0430 \u0431\u0435\u0437 Plus')+'</div><div class="muted" style="font-size:14px">'+(next?'\u0414\u043e \u00ab'+next.n+'\u00bb \u0435\u0449\u0451 '+STAR(next.min-S.don):'\u0412\u044b\u0441\u0448\u0438\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c')+'</div></div></div>'+
      (next?'<div class="bar" style="margin-top:12px"><i style="width:'+Math.min(100,(S.don-(tier>=0?L.PLUS[tier].min:0))/(next.min-(tier>=0?L.PLUS[tier].min:0))*100).toFixed(1)+'%;background:linear-gradient(90deg,#ffd76a,#f0a800)"></i></div>':'')+
      '<div class="muted" style="font-size:13px;margin-top:10px">Plus \u043f\u043e\u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0432\u043e\u0439 \u043f\u043e\u043a\u0443\u043f\u043a\u0438. \u0423\u0440\u043e\u0432\u0435\u043d\u044c \u0440\u0430\u0441\u0442\u0451\u0442 \u0441 \u043e\u0431\u0449\u0435\u0439 \u0441\u0443\u043c\u043c\u043e\u0439 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438 \u0438 \u043d\u0430\u0432\u0441\u0435\u0433\u0434\u0430 \u043e\u0441\u0442\u0430\u0451\u0442\u0441\u044f \u0441 \u0432\u0430\u043c\u0438.</div></div>'+
    '<div class="row" style="margin:12px var(--g) 0;width:auto;align-items:flex-start;background:linear-gradient(180deg,rgba(255,200,61,.16),rgba(255,200,61,.06))"><span class="ico" style="background:var(--orange);width:44px;height:44px">'+ic('userplus')+'</span><div class="mid"><div class="tt" style="white-space:normal">\u0421 Plus \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 \u0434\u0440\u0443\u0433\u0430 \u0432 10 \u0440\u0430\u0437 \u0432\u044b\u0448\u0435</div><div class="ss" style="white-space:normal;margin-top:6px"><span class="num">\u0411\u0435\u0437 Plus: '+fmt(L.REF_REW[0].m)+' \u0438 '+gem(L.REF_REW[0].g)+'</span><br><span class="num" style="color:var(--text)">Plus \u00b7 \u041d\u043e\u0432\u0438\u0447\u043e\u043a: '+fmt(L.REF_REW[1].m)+' \u0438 '+gem(L.REF_REW[1].g)+'</span><br><span class="num">Plus \u00b7 \u041b\u0435\u0433\u0435\u043d\u0434\u0430: '+fmt(L.REF_REW[5].m)+' \u0438 '+gem(L.REF_REW[5].g)+'</span></div><button class="pill" data-act="referral" style="margin-top:10px">\u041f\u0440\u0438\u0433\u043b\u0430\u0441\u0438\u0442\u044c \u0434\u0440\u0443\u0437\u0435\u0439</button></div></div>'+
    secH('\u041a\u043e\u0434 \u0430\u0432\u0442\u043e\u0440\u0430')+
    '<div class="card p">'+(S.author&&S.author.until>t?'<div style="display:flex;align-items:center;gap:10px"><div style="flex:1"><div style="font:600 17px var(--f-ui)">\u00ab'+esc(S.author.code)+'\u00bb</div><div class="muted" style="font-size:14px">+5% \u0433\u043e\u043b\u0434\u044b \u043a \u043f\u043e\u043a\u0443\u043f\u043a\u0430\u043c \u0435\u0449\u0451 '+left(S.author.until-t)+'</div></div><button class="pill" data-act="authorClear">\u0423\u0431\u0440\u0430\u0442\u044c</button></div>':'<div class="rowf"><input class="inp" id="auth-i" placeholder="\u041a\u043e\u0434 \u0431\u043b\u043e\u0433\u0435\u0440\u0430" autocapitalize="characters" autocomplete="off"><button class="btn md" data-act="authorSet" style="flex:none">\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c</button></div><div class="muted" style="font-size:13px;margin-top:8px">\u041a\u043e\u0434 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 7 \u0434\u043d\u0435\u0439: \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 +5% \u0433\u043e\u043b\u0434\u044b \u043a \u043a\u0430\u0436\u0434\u043e\u0439 \u043f\u043e\u043a\u0443\u043f\u043a\u0435, \u0430\u0432\u0442\u043e\u0440 \u2014 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443 \u043e\u0442 \u0438\u0433\u0440\u044b.</div>')+'</div>'+
    '<div class="group" style="margin-top:22px"><button class="li" data-act="inv_exch"><span class="lic" style="background:var(--indigo)">'+ic('swap')+'</span><span class="lt">\u041e\u0431\u043c\u0435\u043d \u043a\u043b\u044e\u0447\u0435\u0439 \u0438 \u0433\u043e\u043b\u0434\u044b</span>'+ic('chev','chev')+'</button><button class="li" data-act="promo"><span class="lic" style="background:var(--orange)">'+ic('ticket')+'</span><span class="lt">\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434</span>'+ic('chev','chev')+'</button><button class="li" data-act="history"><span class="lic" style="background:var(--stars)">'+ic('star')+'</span><span class="lt">\u041c\u043e\u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0438</span>'+ic('chev','chev')+'</button></div>';
  const h=$('dn-hero'),d=$('dn-dots');
  if(h&&d)h.addEventListener('scroll',()=>{const i=Math.round(h.scrollLeft/(h.firstChild.offsetWidth+12));qsa('i',d).forEach((x,k)=>x.classList.toggle('on',k===i))},{passive:true});
}
ACT.premInfo=()=>{
  const t=now();const prem=L.isPrem(S,t);const st=(Net.cfg.prices||{}).prem||277;
  Sheet.open({title:'Premium',lead:'\u0421\u0442\u0430\u0442\u0443\u0441 \u043d\u0430 '+L.PREM_DAYS+' \u0434\u043d\u0435\u0439. \u0415\u0441\u043b\u0438 \u0443\u0436\u0435 \u0430\u043a\u0442\u0438\u0432\u0435\u043d, \u0441\u0440\u043e\u043a \u043f\u0440\u043e\u0434\u043b\u0438\u0442\u0441\u044f.',body:
    '<div class="rows">'+[['season','var(--purple)','\u041f\u0440\u0435\u043c\u0438\u0443\u043c-\u043b\u0438\u043d\u0438\u044f \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430','\u0412\u0442\u043e\u0440\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u043d\u0430 \u043a\u0430\u0436\u0434\u043e\u043c \u0438\u0437 100 \u0443\u0440\u043e\u0432\u043d\u0435\u0439, \u0432\u043a\u043b\u044e\u0447\u0430\u044f \u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u043a\u0438\u043d \u0438 \u043d\u043e\u043c\u0435\u0440'],['userplus','var(--orange)','\u0411\u043e\u043b\u044c\u0448\u0435 \u0437\u0430 \u0434\u0440\u0443\u0437\u0435\u0439','+'+fmt(L.REF_PREM.m)+' \u0438 +'+gem(L.REF_PREM.g)+' \u0441\u0432\u0435\u0440\u0445\u0443 \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e'],['crown','var(--yellow)','\u0417\u043d\u0430\u0447\u043e\u043a \u0432 \u043f\u0440\u043e\u0444\u0438\u043b\u0435','\u0412\u0438\u0434\u0435\u043d \u0432 \u0442\u043e\u043f\u0435, \u043d\u0430 \u0440\u044b\u043d\u043a\u0435 \u0438 \u043d\u0430 \u0441\u0442\u0435\u043d\u0435']].map(r=>'<div class="row" style="min-height:0"><span class="ico" style="background:'+r[1]+';width:44px;height:44px">'+ic(r[0])+'</span><div class="mid"><div class="tt" style="font-size:16px">'+r[2]+'</div><div class="ss" style="white-space:normal">'+r[3]+'</div></div></div>').join('')+'</div>'+
    (prem?'<p class="note">\u0421\u0435\u0439\u0447\u0430\u0441 \u0430\u043a\u0442\u0438\u0432\u0435\u043d \u0434\u043e '+dateRu(S.prem)+'.</p>':'')+
    '<div class="foot"><button class="btn pri wide" data-act="buy" data-pid="prem">'+STAR(st)+'<span>\u2248 '+fmt(rub(st))+'</span></button><button class="btn wide" data-act="premGold">\u0417\u0430 '+gem(L.PREM_GOLD)+'</button></div>'});
};
ACT.premGold=el=>{if(S.gold<L.PREM_GOLD){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(L.PREM_GOLD-S.gold),'err');return}confirmSheet('Premium \u0437\u0430 \u0433\u043e\u043b\u0434\u0443','\u0421\u043f\u0438\u0441\u0430\u0442\u044c '+gem(L.PREM_GOLD)+' \u0438 \u0432\u043a\u043b\u044e\u0447\u0438\u0442\u044c Premium \u043d\u0430 '+L.PREM_DAYS+' \u0434\u043d\u0435\u0439?','\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c',()=>run('buyPrem',{},{ok:()=>{Snd.win(4);Haptic.ok()}}))};
ACT.authorSet=el=>run('author',{code:$('auth-i').value},{btn:el});
ACT.authorClear=el=>run('author',{code:''},{btn:el});
ACT.buy=async el=>{
  const pid=el.dataset.pid;
  if(!TG||!TG.openInvoice){toast('\u041e\u043f\u043b\u0430\u0442\u0430 Stars \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0432 Telegram. \u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0438\u0433\u0440\u0443 \u0447\u0435\u0440\u0435\u0437 \u0431\u043e\u0442\u0430','err');return}
  const r=await run('pay',{pid},{btn:el,key:'pay',quiet:true});if(!r||!r.link)return;
  try{
    TG.openInvoice(r.link,status=>{
      if(status==='paid'){toast('\u041e\u043f\u043b\u0430\u0442\u0430 \u043f\u0440\u043e\u0448\u043b\u0430. \u041d\u0430\u0447\u0438\u0441\u043b\u044f\u0435\u043c\u2026');Haptic.ok();Snd.win(4);setTimeout(()=>refreshState(true),1500);setTimeout(()=>refreshState(true),5000)}
      else if(status==='failed')toast('\u041e\u043f\u043b\u0430\u0442\u0430 \u043d\u0435 \u043f\u0440\u043e\u0448\u043b\u0430','err');
    });
  }catch(e){toast('\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043e\u043f\u043b\u0430\u0442\u0443','err')}
};

/* ================= \u0430\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c ================= */
let adm={tab:'players',players:null,q:'',reports:null,codes:null,media:null,pay:null,lastCode:''};
const isOwner=()=>Net.me.role==='owner';
ACT.admin=()=>{if(!Net.me.role){toast('\u0422\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430','err');return}Page.push('admin','\u0410\u0434\u043c\u0438\u043d\u043a\u0430',renderAdmin);admLoad()};
async function admLoad(){
  try{
    if(adm.tab==='players'){const r=await act('adm.players',{q:adm.q});adm.players=r.list}
    if(adm.tab==='mod'){const r=await act('adm.reports');adm.reports=r.list}
    if(adm.tab==='codes'){const r=await act('adm.codes');adm.codes=r.list}
    if(adm.tab==='media'){const r=await act('adm.media');adm.media=r.list}
    if(adm.tab==='shop'){const r=await act('adm.pay');adm.pay=r.list}
  }catch(e){toast(e.message,'err')}
  if(Page.is('admin'))Page.renderTop();
}
function renderAdmin(el){
  const tabs=[['players','\u0418\u0433\u0440\u043e\u043a\u0438'],['self','\u0421\u0435\u0431\u0435'],['gift','\u041f\u043e\u0434\u0430\u0440\u043a\u0438'],['mod','\u041c\u043e\u0434\u0435\u0440\u0430\u0446\u0438\u044f'],['news','\u041e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0435']];
  if(isOwner())tabs.push(['shop','\u041c\u0430\u0433\u0430\u0437\u0438\u043d'],['codes','\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434\u044b'],['plates','\u041d\u043e\u043c\u0435\u0440\u0430'],['media','\u041c\u0435\u0434\u0438\u0430'],['bot','\u0411\u043e\u0442']);
  let b='';
  switch(adm.tab){
    case'players':b=admPlayers();break;case'self':b=admSelf();break;case'gift':b=admGift();break;case'mod':b=admMod();break;case'news':b=admNews();break;
    case'shop':b=admShop();break;case'codes':b=admCodes();break;case'plates':b=admPlates();break;case'media':b=admMedia();break;case'bot':b=admBot();break;
  }
  el.innerHTML='<p class="lead">'+(isOwner()?'\u0412\u044b \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446: \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e \u0432\u0441\u0451.':'\u0412\u044b \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440: \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f, \u0431\u0430\u043d\u044b, \u043c\u043e\u0434\u0435\u0440\u0430\u0446\u0438\u044f, \u043f\u043e\u0434\u0430\u0440\u043a\u0438 \u0438 \u0432\u044b\u0434\u0430\u0447\u0430 \u0441\u0435\u0431\u0435.')+'</p><div class="seg">'+tabs.map(t=>'<button class="'+(adm.tab===t[0]?'on':'')+'" data-act="admTab" data-t="'+t[0]+'">'+t[1]+'</button>').join('')+'</div><div style="height:12px"></div>'+b;
}
ACT.admTab=el=>{adm.tab=el.dataset.t;Page.renderTop();admLoad()};
const fld=(id,label,ph,val,type)=>'<div class="field"><label for="'+id+'">'+label+'</label><input class="inp" id="'+id+'" '+(type==='num'?'inputmode="numeric"':'')+' placeholder="'+esc(ph||'')+'" value="'+esc(val==null?'':val)+'" autocomplete="off"></div>';
const val=id=>{const e=$(id);return e?e.value.trim():''};
const nval=id=>Math.round(+String(val(id)).replace(/\s/g,'').replace(',','.'))||0;

function admPlayers(){
  const l=adm.players;
  return'<div class="pad" style="display:flex;gap:8px;margin-bottom:12px"><input class="inp" id="adm-q" placeholder="\u041d\u0438\u043a \u0438\u043b\u0438 ID" value="'+esc(adm.q)+'"><button class="btn md" data-act="admFind" style="flex:none">'+ic('search')+'</button></div>'+
    (!l?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':l.length?'<div class="rows">'+l.map(p=>'<div class="row" style="align-items:flex-start"><button data-act="profile" data-uid="'+esc(p.uid)+'">'+avaHTML(p.uid,p.nick,'md',p.ava)+'</button><div class="mid"><div class="tt">'+esc(p.nick)+(p.role?' <span class="badge '+(p.role==='owner'?'b-own':'b-adm')+'">'+(p.role==='owner'?'\u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446':'\u0430\u0434\u043c\u0438\u043d')+'</span>':'')+(p.banned?' <span class="badge" style="background:var(--red);color:#fff">\u0431\u0430\u043d</span>':'')+'</div><div class="ss">\u0443\u0440. '+p.lvl+' \u00b7 '+shortN(p.worth)+' \u20bd \u00b7 '+ago(p.t)+(p.don?' \u00b7 '+p.don+' \u2605':'')+'</div><div class="ey" style="user-select:all">'+esc(p.uid)+'</div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+(p.uid===Net.me.uid||p.role==='owner'?'':'<button class="pill" data-act="admBanP" data-uid="'+esc(p.uid)+'" data-on="'+(p.banned?0:1)+'">'+(p.banned?'\u0420\u0430\u0437\u0431\u0430\u043d\u0438\u0442\u044c':'\u0411\u0430\u043d')+'</button>')+'<button class="pill" data-act="admGiftP" data-uid="'+esc(p.uid)+'">\u041f\u043e\u0434\u0430\u0440\u043e\u043a</button>'+(p.ava?'<button class="pill" data-act="admAvaP" data-uid="'+esc(p.uid)+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440</button>':'')+
      (isOwner()&&p.role!=='owner'&&p.uid!==Net.me.uid?'<button class="pill" data-act="admRole" data-uid="'+esc(p.uid)+'" data-r="'+(p.role==='admin'?'':'admin')+'" style="'+(p.role==='admin'?'':'background:var(--blue);color:#fff')+'">'+(p.role==='admin'?'\u0421\u043d\u044f\u0442\u044c':'\u0421\u0434\u0435\u043b\u0430\u0442\u044c \u0430\u0434\u043c\u0438\u043d\u043e\u043c')+'</button>':'')+'</div></div></div>').join('')+'</div>':'<div class="empty">\u041d\u0438\u043a\u043e\u0433\u043e \u043d\u0435 \u043d\u0430\u0448\u043b\u0438</div>');
}
ACT.admFind=()=>{adm.q=val('adm-q');adm.players=null;Page.renderTop();admLoad()};
ACT.admBanP=el=>{const on=el.dataset.on==='1';confirmSheet(on?'\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c?':'\u0420\u0430\u0437\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c?',on?'\u0418\u0433\u0440\u043e\u043a \u043f\u043e\u0442\u0435\u0440\u044f\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u0440\u044b\u043d\u043a\u0443 \u0438 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f\u043c, \u0435\u0433\u043e \u043b\u043e\u0442\u044b \u0441\u043d\u0438\u043c\u0443\u0442\u0441\u044f.':'','\u0414\u0430',()=>run('adm.ban',{uid:el.dataset.uid,on},{ok:()=>{admLoad();Prof.reload()}}),on)};
ACT.admAvaP=el=>run('adm.avaDel',{uid:el.dataset.uid},{ok:()=>{avaCache.delete(el.dataset.uid);admLoad();Prof.reload()}});
ACT.admRole=el=>{const r=el.dataset.r;confirmSheet(r?'\u0421\u0434\u0435\u043b\u0430\u0442\u044c \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u043e\u043c?':'\u0421\u043d\u044f\u0442\u044c \u043f\u0440\u0430\u0432\u0430?',r?'\u0410\u0434\u043c\u0438\u043d \u0441\u043c\u043e\u0436\u0435\u0442: \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f, \u0431\u0430\u043d\u044b, \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u043b\u043e\u0442\u043e\u0432, \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432 \u0438 \u0430\u0432\u0430\u0442\u0430\u0440\u043e\u043a, \u043f\u043e\u0434\u0430\u0440\u043a\u0438 \u0438\u0433\u0440\u043e\u043a\u0430\u043c, \u0432\u044b\u0434\u0430\u0447\u0443 \u0441\u0435\u0431\u0435 \u0432\u0430\u043b\u044e\u0442\u044b \u0438 \u043d\u043e\u043c\u0435\u0440\u043e\u0432.':'','\u0414\u0430',()=>run('adm.role',{uid:el.dataset.uid,role:r},{ok:admLoad}))};
ACT.admGiftP=el=>{adm.giftTo=el.dataset.uid;adm.tab='gift';if(!Page.is('admin'))ACT.admin();else{Page.renderTop()}};

function admSelf(){
  return'<div class="card p" style="display:grid;gap:10px">'+
    '<div class="rowf"><input class="inp num" id="as-rub" inputmode="numeric" placeholder="\u0420\u0443\u0431\u043b\u0438"><button class="btn md" data-act="admSelf" data-a="admRub" data-i="as-rub" style="flex:none">\u0412\u044b\u0434\u0430\u0442\u044c</button></div>'+
    '<div class="rowf"><input class="inp num" id="as-gold" inputmode="numeric" placeholder="\u0413\u043e\u043b\u0434\u0430"><button class="btn md" data-act="admSelf" data-a="admGold" data-i="as-gold" style="flex:none">\u0412\u044b\u0434\u0430\u0442\u044c</button></div>'+
    '<div class="rowf"><input class="inp num" id="as-key" inputmode="numeric" placeholder="\u041a\u043b\u044e\u0447\u0438"><button class="btn md" data-act="admSelf" data-a="admKey" data-i="as-key" style="flex:none">\u0412\u044b\u0434\u0430\u0442\u044c</button></div>'+
    '<div class="rowf"><input class="inp num" id="as-lvl" inputmode="numeric" placeholder="\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430 0\u2013100"><button class="btn md" data-act="admLvl" style="flex:none">\u0417\u0430\u0434\u0430\u0442\u044c</button></div>'+
    '<button class="btn md wide" data-act="admPrem">'+(L.isPrem(S,now())?'\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c Premium':'\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c Premium')+'</button></div>'+
    '<div class="sec">\u041d\u043e\u043c\u0435\u0440 \u0441\u0435\u0431\u0435</div><div class="card p" style="display:grid;gap:10px">'+
    '<div class="rowf"><select class="inp" id="ap-c" data-on="apPrev">'+COUNTRIES.map(c=>'<option value="'+c+'">'+CN_SHORT[c]+'</option>').join('')+'<option value="sp">\u041e\u0441\u043e\u0431\u044b\u0439</option></select><input class="inp" id="ap-t" placeholder="\u0410777\u0410\u0410777" data-on="apPrev"></div>'+
    '<input class="inp num hidden" id="ap-b" inputmode="numeric" placeholder="\u0426\u0435\u043d\u0430 \u043e\u0441\u043e\u0431\u043e\u0433\u043e \u043d\u043e\u043c\u0435\u0440\u0430, \u20bd" data-on="apPrev">'+
    '<div class="rowf"><select class="inp" id="ap-m" data-on="apPrev">'+MATS.map((m,i)=>'<option value="'+i+'">'+m.n+'</option>').join('')+'</select><select class="inp" id="ap-w" data-on="apPrev">'+FONTS.map((f,i)=>'<option value="'+i+'"'+(i===1?' selected':'')+'>'+f.n+'</option>').join('')+'</select></div>'+
    '<div class="rowf"><input class="inp num" id="ap-f" inputmode="decimal" placeholder="\u0418\u0437\u043d\u043e\u0441 0\u20131, \u043d\u0430\u043f\u0440. 0,02" data-on="apPrev"><input class="inp num" id="ap-pt" inputmode="numeric" placeholder="\u041f\u0430\u0442\u0442\u0435\u0440\u043d 0\u20131000" data-on="apPrev"></div>'+
    '<div id="ap-prev" class="muted" style="font-size:14px">\u0424\u043e\u0440\u043c\u0430\u0442\u044b: \u0420\u0424 \u0410777\u0410\u0410777 \u00b7 UA AA7777AA \u00b7 KZ 777AAA01 \u00b7 \u0421\u0428\u0410 ABC1234CA \u00b7 EU: D M AB 1234 / F AB123CD / E 1234BCD \u00b7 \u0414\u0443\u0431\u0430\u0439 A12345</div>'+
    '<button class="btn pri md wide" data-act="admPlate">\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 \u0433\u0430\u0440\u0430\u0436</button></div>'+
    '<div class="sec">\u0421\u043a\u0438\u043d \u0438\u043b\u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430 \u0441\u0435\u0431\u0435</div><div class="card p rowf"><select class="inp" id="ask-v">'+Object.keys(SKINS).filter(k=>!SKINS[k].free).map(k=>'<option value="'+k+'">\u0421\u043a\u0438\u043d: '+esc(SKINS[k].n)+' ('+(k.startsWith('car')?'\u043c\u0430\u0448\u0438\u043d\u0430':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a')+')</option>').join('')+Object.keys(STICKERS).map(k=>'<option value="'+k+'">\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430: '+esc(STICKERS[k].n)+'</option>').join('')+'</select><button class="btn md" data-act="admSkin" style="flex:none">\u0412\u044b\u0434\u0430\u0442\u044c</button></div>';
}
ACT.admSelf=el=>run(el.dataset.a,{n:nval(el.dataset.i)},{btn:el});
ACT.admLvl=el=>run('admLvl',{l:nval('as-lvl')},{btn:el});
ACT.admPrem=el=>run('admPrem',{},{btn:el});
ACT.admSkin=el=>run('admSkin',{v:val('ask-v')},{btn:el});
function apItem(){
  const c=val('ap-c');const sp=c==='sp';$('ap-b').classList.toggle('hidden',!sp);
  const pl=sp?L.cleanPlate({c:'sp',t:val('ap-t'),b:nval('ap-b')}):L.parsePlateInput(c,val('ap-t'));if(!pl)return null;
  const f=val('ap-f')===''?.05:+String(val('ap-f')).replace(',','.');
  return Object.assign({pl},L.cleanItemFields({m:+val('ap-m'),f,pt:nval('ap-pt'),w:+val('ap-w')}));
}
ON.apPrev=()=>{const it=apItem();const b=$('ap-prev');if(!b)return;b.innerHTML=it?'<div style="max-width:280px">'+plateHTML(it)+'</div><div style="margin-top:6px;color:var(--text)" class="num">'+fmt(appraise(it).price)+'</div>':'\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043d\u043e\u043c\u0435\u0440'};
ON.apPrevChange=ON.apPrev;
ACT.admPlate=el=>{const c=val('ap-c');run('admPlate',{c,text:val('ap-t'),b:nval('ap-b'),m:+val('ap-m'),w:+val('ap-w'),f:val('ap-f')===''?'':+String(val('ap-f')).replace(',','.'),pt:nval('ap-pt')},{btn:el})};

function admGift(){
  return'<div class="card p" style="display:grid;gap:4px"><div class="field" style="margin:0 0 8px"><label>\u041a\u043e\u043c\u0443 (ID \u0438\u0433\u0440\u043e\u043a\u0430 \u0438\u043b\u0438 * \u2014 \u0432\u0441\u0435\u043c)</label><input class="inp" id="ag-to" value="'+esc(adm.giftTo||'*')+'"></div>'+
    '<div class="rowf"><input class="inp num" id="ag-m" inputmode="numeric" placeholder="\u0420\u0443\u0431\u043b\u0438"><input class="inp num" id="ag-g" inputmode="numeric" placeholder="\u0413\u043e\u043b\u0434\u0430"></div><div style="height:8px"></div>'+
    '<div class="rowf"><input class="inp num" id="ag-k" inputmode="numeric" placeholder="\u041a\u043b\u044e\u0447\u0438"><input class="inp num" id="ag-sc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u0441\u043a\u0438\u043d\u043e\u0432"><input class="inp num" id="ag-tc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u043d\u0430\u043a\u043b\u0435\u0435\u043a"></div><div style="height:8px"></div>'+
    '<input class="inp" id="ag-note" maxlength="80" placeholder="\u041f\u043e\u0434\u043f\u0438\u0441\u044c \u043a \u043f\u043e\u0434\u0430\u0440\u043a\u0443"><div style="height:10px"></div><button class="btn pri md wide" data-act="admGiftGo">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c</button></div><p class="note">\u041f\u043e\u0434\u0430\u0440\u043e\u043a \u00ab\u0432\u0441\u0435\u043c\u00bb \u043f\u043e\u043b\u0443\u0447\u0438\u0442 \u043a\u0430\u0436\u0434\u044b\u0439, \u043a\u0442\u043e \u043e\u0442\u043a\u0440\u043e\u0435\u0442 \u0438\u0433\u0440\u0443 \u0432 \u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435 7 \u0434\u043d\u0435\u0439.</p>';
}
ACT.admGiftGo=el=>run('adm.gift',{to:val('ag-to'),m:nval('ag-m'),g:nval('ag-g'),k:nval('ag-k'),sc:nval('ag-sc'),tc:nval('ag-tc'),note:val('ag-note')},{btn:el,ok:()=>{adm.giftTo=''}});

function admMod(){
  const r=adm.reports;
  return'<div class="sec" style="margin-top:0">\u0416\u0430\u043b\u043e\u0431\u044b \u043d\u0430 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438</div>'+(!r?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':r.length?'<div class="rows">'+r.map(c=>'<div class="row" style="align-items:flex-start"><div class="mid"><div class="tt">'+esc(c.nick)+' <span class="badge" style="background:var(--red);color:#fff">'+c.n+'</span></div><div class="ss" style="white-space:normal;color:var(--text)">'+esc(c.text)+'</div><div class="ey">'+ago(c.t)+'</div><div style="display:flex;gap:6px;margin-top:8px"><button class="pill" data-act="admCDel" data-id="'+esc(c.id)+'" style="background:var(--red);color:#fff">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button><button class="pill" data-act="admCOk" data-id="'+esc(c.id)+'">\u041e\u0441\u0442\u0430\u0432\u0438\u0442\u044c</button><button class="pill" data-act="profile" data-uid="'+esc(c.author)+'">\u0410\u0432\u0442\u043e\u0440</button></div></div></div>').join('')+'</div>':'<div class="empty">\u0416\u0430\u043b\u043e\u0431 \u043d\u0435\u0442</div>')+
    '<div class="sec">\u0420\u044b\u043d\u043e\u043a</div><div class="group"><button class="li" data-act="inv_market"><span class="lic" style="background:var(--blue)">'+ic('cart')+'</span><span class="lt">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0440\u044b\u043d\u043e\u043a: \u0441\u043d\u044f\u0442\u044c \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0439 \u043b\u043e\u0442</span>'+ic('chev','chev')+'</button><button class="li" data-act="admWipe"><span class="lic" style="background:var(--red)">'+ic('trash')+'</span><span class="lt">\u0421\u043d\u044f\u0442\u044c \u0432\u0441\u0435 \u043b\u043e\u0442\u044b ('+Net.open.length+')</span></button></div>';
}
ACT.admCDel=el=>run('adm.cdel',{id:el.dataset.id},{ok:admLoad});
ACT.admCOk=el=>run('adm.clearRep',{id:el.dataset.id},{ok:admLoad});
ACT.admWipe=()=>confirmSheet('\u0421\u043d\u044f\u0442\u044c \u0432\u0441\u0435 \u043b\u043e\u0442\u044b?','\u0412\u0441\u0435 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u044b \u0432\u0435\u0440\u043d\u0443\u0442\u0441\u044f \u043f\u0440\u043e\u0434\u0430\u0432\u0446\u0430\u043c.','\u0421\u043d\u044f\u0442\u044c \u0432\u0441\u0451',()=>run('adm.wipe',{},{ok:()=>loadPub('market')}),true);

function admNews(){return'<div class="field"><label>\u041e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0435 (\u0432\u0438\u0434\u043d\u043e \u0432\u0441\u0435\u043c \u0432 \u00ab\u041a\u0435\u0439\u0441\u0430\u0445\u00bb)</label><textarea class="inp" id="an-t" maxlength="300">'+esc(Net.cfg.news||'')+'</textarea></div><div class="pad rowf"><button class="btn pri md" data-act="admNews">\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c</button><button class="btn md" data-act="admNewsClr">\u0423\u0431\u0440\u0430\u0442\u044c</button></div>'}
ACT.admNews=el=>run('adm.news',{text:val('an-t')},{btn:el,ok:()=>loadPub('kv')});
ACT.admNewsClr=el=>run('adm.news',{text:''},{btn:el,ok:()=>loadPub('kv')});

function admShop(){
  const c=Net.cfg;const p=c.prices||{p:[55,166,328,661],prem:277};const m=c.mult||{g:10,k:1};
  const sel=(id,v)=>'<select class="inp" id="'+id+'">'+[1,10,20,30].map(x=>'<option value="'+x+'"'+(x===v?' selected':'')+'>\u00d7'+x+'</option>').join('')+'</select>';
  return'<div class="sec" style="margin-top:0">\u0426\u0435\u043d\u044b \u0432 Stars</div><div class="card p" style="display:grid;gap:8px">'+[0,1,2,3].map(i=>'<div class="rowf" style="align-items:center"><span style="flex:1.4">\u041f\u0430\u043a\u0435\u0442 '+(i+1)+': '+fmtN(PACK_BASE.g[i])+'\u25c6 / '+PACK_BASE.k[i]+' \u043a\u043b\u044e\u0447\u0435\u0439</span><input class="inp num" id="sp-'+i+'" inputmode="numeric" value="'+p.p[i]+'"></div>').join('')+
    '<div class="rowf" style="align-items:center"><span style="flex:1.4">Premium</span><input class="inp num" id="sp-prem" inputmode="numeric" value="'+p.prem+'"></div>'+
    '<div class="rowf" style="align-items:center"><span style="flex:1.4">\u0410\u043a\u0446\u0438\u044f \u043d\u0430 \u0433\u043e\u043b\u0434\u0443</span>'+sel('sp-mg',m.g)+'</div><div class="rowf" style="align-items:center"><span style="flex:1.4">\u0410\u043a\u0446\u0438\u044f \u043d\u0430 \u043a\u043b\u044e\u0447\u0438</span>'+sel('sp-mk',m.k)+'</div>'+
    '<button class="btn pri md wide" data-act="admPrices">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c</button><div class="muted" style="font-size:13px">\u0421\u0435\u0439\u0447\u0430\u0441: '+[0,1,2,3].map(i=>fmtN(PACK_BASE.g[i]*m.g)+'\u25c6').join(', ')+'. 1 \u2605 \u2248 '+String(c.rate||1.8).replace('.',',')+' \u20bd.</div></div>'+
    '<div class="sec">\u0410\u043a\u0446\u0438\u0438 \u0432 \u043c\u0430\u0433\u0430\u0437\u0438\u043d\u0435</div>'+((c.promos||[]).length?'<div class="rows">'+c.promos.map(x=>'<div class="row"><div class="mid"><div class="tt">'+esc(x.title)+'</div><div class="ss">'+esc(giveLine(x.give))+' \u00b7 '+x.stars+' \u2605'+(x.until?' \u00b7 \u0434\u043e '+dateRu(x.until):'')+(x.limit?' \u00b7 '+x.limit+' \u043d\u0430 \u0430\u043a\u043a\u0430\u0443\u043d\u0442':'')+'</div></div><button class="pill" data-act="admPromoDel" data-id="'+x.id+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button></div>').join('')+'</div>':'<div class="empty">\u0410\u043a\u0446\u0438\u0439 \u043d\u0435\u0442</div>')+
    '<div class="card p" style="margin-top:12px;display:grid;gap:8px"><input class="inp" id="pr-t" maxlength="40" placeholder="\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u00ab\u041d\u043e\u0432\u043e\u0433\u043e\u0434\u043d\u0438\u0439 \u043d\u0430\u0431\u043e\u0440\u00bb"><input class="inp" id="pr-d" maxlength="120" placeholder="\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 (\u043d\u0435\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e)">'+
    '<div class="rowf"><input class="inp num" id="pr-g" inputmode="numeric" placeholder="\u0413\u043e\u043b\u0434\u0430"><input class="inp num" id="pr-k" inputmode="numeric" placeholder="\u041a\u043b\u044e\u0447\u0438"><input class="inp num" id="pr-m" inputmode="numeric" placeholder="\u0420\u0443\u0431\u043b\u0438"></div>'+
    '<div class="rowf"><input class="inp num" id="pr-sc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u0441\u043a\u0438\u043d\u043e\u0432"><input class="inp num" id="pr-tc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u043d\u0430\u043a\u043b\u0435\u0435\u043a"><input class="inp num" id="pr-prem" inputmode="numeric" placeholder="\u0414\u043d\u0438 Premium"></div>'+
    '<div class="rowf"><input class="inp num" id="pr-s" inputmode="numeric" placeholder="\u0426\u0435\u043d\u0430, \u2605"><input class="inp num" id="pr-days" inputmode="numeric" placeholder="\u0414\u043d\u0435\u0439 (0 \u2014 \u0431\u0435\u0441\u0441\u0440\u043e\u0447\u043d\u043e)"><input class="inp num" id="pr-l" inputmode="numeric" placeholder="\u041b\u0438\u043c\u0438\u0442 \u043d\u0430 \u0430\u043a\u043a\u0430\u0443\u043d\u0442"></div>'+
    '<button class="btn pri md wide" data-act="admPromo">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0430\u043a\u0446\u0438\u044e</button></div>'+
    '<div class="sec">\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u043f\u043b\u0430\u0442\u0435\u0436\u0438</div>'+(!adm.pay?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':adm.pay.length?'<div class="group">'+adm.pay.map(x=>'<div class="li noic"><span class="lt">'+esc(productName(x.pid))+'<br><span class="muted" style="font-size:12px">'+esc(x.uid)+' \u00b7 '+ago(x.t)+'</span></span><span class="lv num">'+x.stars+' \u2605</span></div>').join('')+'</div>':'<div class="empty">\u041f\u043b\u0430\u0442\u0435\u0436\u0435\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442</div>');
}
ACT.admPrices=el=>run('adm.prices',{p:[0,1,2,3].map(i=>nval('sp-'+i)),prem:nval('sp-prem'),mg:+val('sp-mg'),mk:+val('sp-mk')},{btn:el,ok:()=>Page.renderTop()});
ACT.admPromo=el=>run('adm.promo',{title:val('pr-t'),desc:val('pr-d'),g:nval('pr-g'),k:nval('pr-k'),m:nval('pr-m'),sc:nval('pr-sc'),tc:nval('pr-tc'),prem:nval('pr-prem'),stars:nval('pr-s'),days:nval('pr-days'),limit:nval('pr-l')},{btn:el,ok:()=>Page.renderTop()});
ACT.admPromoDel=el=>run('adm.promo',{del:el.dataset.id},{btn:el,ok:()=>Page.renderTop()});

function admCodes(){
  const l=adm.codes;
  return'<div class="card p" style="display:grid;gap:8px"><div class="rowf"><input class="inp" id="cd-c" maxlength="24" placeholder="\u041a\u043e\u0434 (\u043f\u0443\u0441\u0442\u043e \u2014 \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u044b\u0439)" autocapitalize="characters"><input class="inp num" id="cd-max" inputmode="numeric" placeholder="\u0410\u043a\u0442\u0438\u0432\u0430\u0446\u0438\u0439" value="100"></div>'+
    '<input class="inp" id="cd-t" maxlength="120" placeholder="\u0422\u0435\u043a\u0441\u0442 \u043f\u0440\u0438 \u0430\u043a\u0442\u0438\u0432\u0430\u0446\u0438\u0438, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u00ab\u0421 \u041d\u043e\u0432\u044b\u043c \u0433\u043e\u0434\u043e\u043c!\u00bb">'+
    '<div class="rowf"><input class="inp num" id="cd-g" inputmode="numeric" placeholder="\u0413\u043e\u043b\u0434\u0430"><input class="inp num" id="cd-k" inputmode="numeric" placeholder="\u041a\u043b\u044e\u0447\u0438"><input class="inp num" id="cd-m" inputmode="numeric" placeholder="\u0420\u0443\u0431\u043b\u0438"></div>'+
    '<div class="rowf"><input class="inp num" id="cd-sc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u0441\u043a\u0438\u043d\u043e\u0432"><input class="inp num" id="cd-tc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u043d\u0430\u043a\u043b\u0435\u0435\u043a"><input class="inp num" id="cd-days" inputmode="numeric" placeholder="\u0414\u043d\u0435\u0439 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442"></div>'+
    '<button class="btn pri md wide" data-act="admCode">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u043c\u043e\u043a\u043e\u0434</button>'+(adm.lastCode?'<button class="btn md wide" data-act="copyCode" data-c="'+esc(adm.lastCode)+'">'+ic('copy')+esc(adm.lastCode)+'</button>':'')+'</div>'+
    '<div class="sec">\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434\u044b</div>'+(!l?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':l.length?'<div class="rows">'+l.map(c=>'<div class="row"><div class="mid"><div class="tt" style="user-select:all">'+esc(c.code)+'</div><div class="ss">'+esc(giveLine(c.give))+' \u00b7 '+c.uses+' \u0438\u0437 '+c.max+(c.until?' \u00b7 \u0434\u043e '+dateRu(c.until):'')+'</div></div><button class="pill" data-act="admCodeDel" data-c="'+esc(c.code)+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button></div>').join('')+'</div>':'<div class="empty">\u041a\u043e\u0434\u043e\u0432 \u043d\u0435\u0442</div>');
}
ACT.admCode=el=>run('adm.code',{code:val('cd-c'),max:nval('cd-max'),text:val('cd-t'),g:nval('cd-g'),k:nval('cd-k'),m:nval('cd-m'),sc:nval('cd-sc'),tc:nval('cd-tc'),days:nval('cd-days')},{btn:el,ok:r=>{adm.lastCode=r.code;admLoad()}});
ACT.admCodeDel=el=>confirmSheet('\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u0434?','','\u0423\u0434\u0430\u043b\u0438\u0442\u044c',()=>run('adm.codeDel',{code:el.dataset.c},{ok:admLoad}),true);

function admPlates(){
  const ov=Net.cfg.ov||{};const pl=Object.entries(ov.plates||{});const se=Object.entries(ov.series||{});const pa=ov.pats||[];
  return'<div class="sec" style="margin-top:0">\u0420\u0443\u0447\u043d\u0430\u044f \u0446\u0435\u043d\u0430 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u044f</div><div class="card p" style="display:grid;gap:8px"><div class="rowf"><select class="inp" id="ov-c">'+COUNTRIES.map(c=>'<option value="'+c+'">'+CN_SHORT[c]+'</option>').join('')+'</select><input class="inp" id="ov-t" placeholder="\u0410001\u0410\u041077"></div><div class="rowf"><input class="inp num" id="ov-p" inputmode="numeric" placeholder="\u0426\u0435\u043d\u0430, \u20bd (0 \u2014 \u0443\u0431\u0440\u0430\u0442\u044c)"><button class="btn md" data-act="admOvPlate" style="flex:none">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c</button></div>'+
    (pl.length?'<div class="group" style="margin:0">'+pl.map(([k,v])=>'<div class="li noic"><span class="lt">'+esc(k.replace(/^\w+:/,'').replace(/\|/g,' '))+'</span><span class="lv num">'+fmt(v)+'</span></div>').join('')+'</div>':'')+'</div>'+
    '<div class="sec">\u0411\u043b\u0430\u0442\u043d\u044b\u0435 \u0441\u0435\u0440\u0438\u0438 \u0420\u0424</div><div class="card p" style="display:grid;gap:8px"><div class="rowf"><input class="inp" id="ov-sl" maxlength="3" placeholder="\u0410\u041c\u0420"><input class="inp num" id="ov-sm" inputmode="decimal" placeholder="\u041c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c (0 \u2014 \u0443\u0431\u0440\u0430\u0442\u044c)"></div><input class="inp" id="ov-sn" maxlength="40" placeholder="\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u00ab\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f \u0410\u041c\u0420\u00bb"><button class="btn md wide" data-act="admOvSeries">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0441\u0435\u0440\u0438\u044e</button>'+
    (se.length?'<div class="group" style="margin:0">'+se.map(([k,v])=>'<div class="li noic"><span class="lt">'+esc(k)+' \u00b7 '+esc(v[1])+'</span><span class="lv">\u00d7'+v[0]+'</span></div>').join('')+'</div>':'')+'<div class="muted" style="font-size:13px">\u0412\u0441\u0442\u0440\u043e\u0435\u043d\u043d\u044b\u0435: '+Object.keys(L.SERIES_RU).join(', ')+'</div></div>'+
    '<div class="sec">\u0420\u0435\u0434\u043a\u0438\u0435 \u043f\u0430\u0442\u0442\u0435\u0440\u043d\u044b</div><div class="card p" style="display:grid;gap:8px"><div class="rowf"><input class="inp num" id="ov-pt" inputmode="numeric" placeholder="\u041f\u0430\u0442\u0442\u0435\u0440\u043d 0\u20131000"><select class="inp" id="ov-pm"><option value="-1">\u041b\u044e\u0431\u043e\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</option>'+MATS.map((m,i)=>'<option value="'+i+'">'+m.n+'</option>').join('')+'</select></div><div class="rowf"><input class="inp" id="ov-pn" maxlength="30" placeholder="\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u00ab\u0421\u0438\u043d\u0438\u0439 \u0433\u0435\u043c\u00bb"><input class="inp num" id="ov-px" inputmode="decimal" placeholder="\u041c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c"></div><button class="btn md wide" data-act="admOvPat">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043f\u0430\u0442\u0442\u0435\u0440\u043d</button>'+
    (pa.length?'<div class="group" style="margin:0">'+pa.map(x=>'<div class="li noic"><span class="lt">#'+x.pt+' '+esc(x.n)+' \u00b7 '+(x.m<0?'\u043b\u044e\u0431\u043e\u0439':MATS[x.m].n.toLowerCase())+'</span><span class="lv">\u00d7'+x.mult+'</span></div>').join('')+'</div>':'')+'</div>'+
    '<div class="sec">\u041e\u0441\u043e\u0431\u044b\u0439 \u043d\u043e\u043c\u0435\u0440</div><div class="card p" style="display:grid;gap:8px"><div class="rowf"><input class="inp" id="sp-t" maxlength="12" placeholder="\u0423\u0410\u0415666"><input class="inp num" id="sp-b" inputmode="numeric" placeholder="\u0426\u0435\u043d\u0430, \u20bd"></div><div class="rowf"><select class="inp" id="sp-m">'+MATS.map((m,i)=>'<option value="'+i+'"'+(i===4?' selected':'')+'>'+m.n+'</option>').join('')+'</select><input class="inp" id="sp-to" placeholder="ID \u0438\u0433\u0440\u043e\u043a\u0430 (\u043f\u0443\u0441\u0442\u043e \u2014 \u0441\u0435\u0431\u0435)"></div><button class="btn pri md wide" data-act="admSpecial">\u0412\u044b\u0434\u0430\u0442\u044c \u043e\u0441\u043e\u0431\u044b\u0439 \u043d\u043e\u043c\u0435\u0440</button></div>';
}
ACT.admOvPlate=el=>run('adm.ov',{k:'plate',c:val('ov-c'),text:val('ov-t'),price:nval('ov-p')},{btn:el,ok:()=>Page.renderTop()});
ACT.admOvSeries=el=>run('adm.ov',{k:'series',letters:val('ov-sl'),mult:+String(val('ov-sm')).replace(',','.'),name:val('ov-sn')},{btn:el,ok:()=>Page.renderTop()});
ACT.admOvPat=el=>run('adm.ov',{k:'pat',pt:nval('ov-pt'),m:+val('ov-pm'),name:val('ov-pn'),mult:+String(val('ov-px')).replace(',','.')},{btn:el,ok:()=>Page.renderTop()});
ACT.admSpecial=el=>run('adm.special',{text:val('sp-t'),b:nval('sp-b'),m:+val('sp-m'),to:val('sp-to')},{btn:el});

function admMedia(){
  const l=adm.media;
  return!l?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':l.length?'<div class="rows">'+l.map(m=>'<div class="row" style="align-items:flex-start"><div class="mid"><div class="tt">'+esc(m.nick||m.uid)+' <span class="badge" style="'+(m.status==='ok'?'background:var(--green);color:#fff':m.status==='pending'?'background:var(--orange);color:#fff':'')+'">'+({ok:'\u043e\u0434\u043e\u0431\u0440\u0435\u043d',pending:'\u0437\u0430\u044f\u0432\u043a\u0430',rejected:'\u043e\u0442\u043a\u043b\u043e\u043d\u0451\u043d'})[m.status]+'</span></div><div class="ss" style="white-space:normal"><a href="#" data-act="openUrl" data-u="'+esc(m.channel||'')+'">'+esc(m.channel||'')+'</a></div><div class="ey">\u041a\u043e\u0434 '+esc(m.code||'\u2014')+' \u00b7 \u043f\u0440\u0438\u0448\u043b\u0438 '+m.invites+' \u00b7 \u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0435 '+m.active+' \u00b7 \u0437\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u043b '+fmtN(m.total)+'\u25c6</div>'+
    '<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">'+(m.status!=='ok'?'<button class="pill" data-act="admMediaOk" data-uid="'+esc(m.uid)+'" data-c="'+esc(m.code||'')+'" style="background:var(--green);color:#fff">\u041e\u0434\u043e\u0431\u0440\u0438\u0442\u044c</button>':'')+(m.status!=='rejected'?'<button class="pill" data-act="admMediaNo" data-uid="'+esc(m.uid)+'">\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c</button>':'')+'<button class="pill" data-act="profile" data-uid="'+esc(m.uid)+'">\u041f\u0440\u043e\u0444\u0438\u043b\u044c</button></div></div></div>').join('')+'</div>':'<div class="empty">\u0417\u0430\u044f\u0432\u043e\u043a \u043d\u0435\u0442</div>';
}
ACT.admMediaOk=el=>run('adm.mediaSet',{uid:el.dataset.uid,status:'ok',code:el.dataset.c},{ok:admLoad});
ACT.admMediaNo=el=>run('adm.mediaSet',{uid:el.dataset.uid,status:'rejected'},{ok:admLoad});
ACT.openUrl=el=>{const u=el.dataset.u;if(/^https:\/\//.test(u))openLink(u)};

function admBot(){return'<div class="card p" style="display:grid;gap:10px"><div>\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u0442 \u0432\u0435\u0431\u0445\u0443\u043a, \u043a\u043d\u043e\u043f\u043a\u0443 \u00ab\u0418\u0433\u0440\u0430\u0442\u044c\u00bb, \u043e\u0442\u0432\u0435\u0442 \u043d\u0430 /start \u0438 \u043f\u0440\u0438\u0451\u043c \u043e\u043f\u043b\u0430\u0442\u044b Stars. \u041d\u0430\u0436\u0438\u043c\u0430\u0439\u0442\u0435 \u043f\u043e\u0441\u043b\u0435 \u0441\u043c\u0435\u043d\u044b BOT_TOKEN, GAME_URL \u0438\u043b\u0438 \u0432\u0435\u0440\u0441\u0438\u0438.</div><div class="muted" style="font-size:14px">\u0411\u043e\u0442: '+(Net.cfg.bot?'@'+esc(Net.cfg.bot):'\u0435\u0449\u0451 \u043d\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0451\u043d')+'</div><button class="btn pri md wide" data-act="admBot">\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0431\u043e\u0442\u0430</button></div>'}
ACT.admBot=el=>run('adm.bot',{},{btn:el,ok:()=>Page.renderTop()});

/* ================= \u0437\u0430\u043f\u0443\u0441\u043a ================= */
function gameColors(){const cs=getComputedStyle(document.documentElement);const g=(n,f)=>(cs.getPropertyValue(n)||'').trim()||f;return{sky1:g('--sky1','#0d1b33'),sky2:g('--sky2','#2b4a78'),hill1:g('--hill1','#16243a'),hill2:g('--hill2','#1d3150'),ground:g('--ground','#1b222c'),groundTop:g('--ground-top','#5d6b80'),road:g('--road','#e9edf2')}}
const Games=window.makeGames({
  esc,ic,fmt,fmtN,Draw,rr:Draw.rr,Music,Haptic,Snd,toast,
  act:(a,p)=>act(a,p),
  online:()=>Net.status==='on',
  look:k=>vehLook(k),
  colors:gameColors,
  after:()=>{render();showInbox()}
});
window.__app={get S(){return S},Net,Games,Reel,render,act,run,L,Page,Sheet,Tabs};
document.addEventListener('themechange',()=>{if(casesBuilt)render()});
Tabs.init();
RENDER.cases();
connect();
setInterval(()=>{if(!document.hidden&&Net.status==='on'&&Tabs.cur==='games'&&!Page.stack.length)RENDER.games()},30000);

})();
