/* Vybivanie nomerov 2.1 */
(function(){
"use strict";
/* ================= \u043e\u0441\u043d\u043e\u0432\u0430: \u0443\u0442\u0438\u043b\u0438\u0442\u044b, \u0438\u043a\u043e\u043d\u043a\u0438, \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435, \u043e\u0442\u043a\u043b\u0438\u043a ================= */
const $=id=>document.getElementById(id);
const qs=(s,r)=>(r||document).querySelector(s);
const qsa=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const {fmt,fmtN,keyN,plateText,appraise,MATS,WEARS,FONTS,SKINS,STICKERS,COLORS,WHEELS,KITS,TIERS,COUNTRY,COUNTRIES,pad8}=L;
const now=()=>Date.now();
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const lsDel=k=>{try{localStorage.removeItem(k)}catch(e){}};
const TOKEN_KEY='nomera2_token';
const rndId=()=>{let s='';const a='abcdefghijklmnopqrstuvwxyz0123456789';const b=new Uint8Array(16);try{crypto.getRandomValues(b)}catch(e){for(let i=0;i<16;i++)b[i]=Math.random()*256}for(let i=0;i<16;i++)s+=a[b[i]%36];return s};
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
  coin:'<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="6.6" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.4"/><path d="M8.6 15.6V8.4l3.4 4.2 3.4-4.2v7.2" fill="none" stroke="rgba(0,0,0,.42)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
  heart:'<path d="M12 20.3s-7.8-4.6-9.2-9.6C1.9 7.4 4 4.4 7.2 4.4c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.2 0 5.3 3 4.4 6.3-1.4 5-9.2 9.6-9.2 9.6Z"/>',
  heartO:'<path d="M12 19.6s-7.3-4.3-8.6-9C2.6 7.6 4.5 5.1 7.3 5.1c1.9 0 3.5 1.1 4.7 2.9 1.2-1.8 2.8-2.9 4.7-2.9 2.8 0 4.7 2.5 3.9 5.5-1.3 4.7-8.6 9-8.6 9Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  chat:'<path d="M4.5 4h15A2.5 2.5 0 0 1 22 6.5v9a2.5 2.5 0 0 1-2.5 2.5H10l-4.6 3.6c-.5.4-1.4 0-1.4-.7V18h.5A2.5 2.5 0 0 1 2 15.5v-9A2.5 2.5 0 0 1 4.5 4Z"/>',
  filter:'<path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  history:'<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M4 4.5v4h4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v4.5l3 2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  faceid:'<path d="M3.5 8V6a2.5 2.5 0 0 1 2.5-2.5h2M16 3.5h2A2.5 2.5 0 0 1 20.5 6v2M20.5 16v2a2.5 2.5 0 0 1-2.5 2.5h-2M8 20.5H6A2.5 2.5 0 0 1 3.5 18v-2M8.5 9v1.5M15.5 9v1.5M12 9v4.5h-1M9 16c1.7 1.3 4.3 1.3 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  shuffle:'<path d="M3.5 7h3.2c1.4 0 2.7.7 3.5 1.8l3.6 5.4c.8 1.1 2.1 1.8 3.5 1.8h3.2M17.5 4l3 3-3 3M17.5 14l3 3-3 3M3.5 17h3.2c1.4 0 2.7-.7 3.5-1.8M14 8.8c.8-1.1 2.1-1.8 3.5-1.8h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  idc:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M6.5 9.5h3M6.5 12.5h5M14.5 9.5h3v5h-3z" fill="none" stroke="var(--bg,#000)" stroke-width="1.6" stroke-linecap="round"/>',
  medal:'<path d="M7 2.5h4l1 4-3 1.5ZM17 2.5h-4l-1 4 3 1.5Z" opacity=".7"/><circle cx="12" cy="14.5" r="6.5"/><path d="M12 11l1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3Z" fill="var(--bg,#000)" opacity=".5"/>'
};
const ic=(n,cls)=>'<svg class="ic'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'+(P[n]||'')+'</svg>';
// \u043c\u043e\u043d\u0435\u0442\u044b \u0438 \u043a\u043b\u044e\u0447\u0438 \u0432 \u0440\u0430\u0437\u043c\u0435\u0442\u043a\u0435: \u0447\u0438\u0441\u043b\u043e \u0438 \u0437\u043d\u0430\u0447\u043e\u043a
const COIN=n=>'<span class="num">'+fmtN(n)+'</span><i class="coin"></i>';
const KEYS=n=>ic('key','kk')+'<span class="num">'+fmtN(n)+'</span>';
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
    '<div class="pad" style="display:grid;gap:4px;text-align:center"><div style="font:700 32px/1 var(--f-ui);letter-spacing:-.02em" class="num big-coin">'+COIN(price)+'</div><div class="muted" style="font-size:14px">'+esc(COUNTRY[it.pl.c].n)+(it.pl.c!=='sp'?', '+esc(a.parts[2]?a.parts[2].t:''):'')+'</div></div>'+
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

/* ================= \u0441\u0432\u044f\u0437\u044c \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c: \u043f\u043e\u0432\u0442\u043e\u0440\u044b, \u043e\u0447\u0435\u0440\u0435\u0434\u044c \u0431\u0435\u0437 \u0441\u0432\u044f\u0437\u0438, \u0436\u0438\u0432\u044b\u0435 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f ================= */
let S=L.fresh();S.welcome='';
const Net={status:'loading',me:{uid:null,num:0,role:'',banned:false,tg:false,h:'',ava:false,elev:false,mute:{}},open:[],orders:[],top:[],feed:[],
  cfg:{news:'',ov:{},prices:{p:[55,166,328,661],prem:277,s:[99,299,799]},mult:{c:1,k:1},promos:[],bot:'',app:'play',rate:1.8,packs:{c:[100000,350000,800000,1800000],k:[200,700,1600,3600]},sets:[]},online:0,sb:null,ch:null,err:'',ver:0};
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
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// \u041e\u0434\u0438\u043d \u0437\u0430\u043f\u0440\u043e\u0441. \u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0442\u0438 \u043f\u043e\u043c\u0435\u0447\u0430\u0435\u0442\u0441\u044f .net \u2014 \u0442\u0430\u043a\u043e\u0439 \u0437\u0430\u043f\u0440\u043e\u0441 \u043c\u043e\u0436\u043d\u043e \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0441 \u0442\u0435\u043c \u0436\u0435 \u043d\u043e\u043c\u0435\u0440\u043e\u043c (rq).
async function call(a,p,rq){
  const headers={'Content-Type':'application/json'};
  if(CFG.anonKey)headers.apikey=CFG.anonKey;
  let res,ctl=null,tm=0;
  try{ctl=new AbortController();tm=setTimeout(()=>ctl.abort(),20000)}catch(e){}
  try{res=await fetch(FN,{method:'POST',headers,body:JSON.stringify({a,p:p||{},t:token,rq}),signal:ctl?ctl.signal:undefined})}
  catch(e){clearTimeout(tm);const er=new Error('\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442');er.net=true;throw er}
  clearTimeout(tm);
  const j=await res.json().catch(()=>null);
  if(!j){const er=new Error('\u0421\u0435\u0440\u0432\u0435\u0440 \u043d\u0435 \u043e\u0442\u0432\u0435\u0442\u0438\u043b, \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437');er.net=true;throw er}
  if(!res.ok){const er=new Error(j.error||'\u0421\u0435\u0440\u0432\u0435\u0440 \u043d\u0435 \u043e\u0442\u0432\u0435\u0442\u0438\u043b, \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437');er.status=res.status;er.relogin=!!j.relogin;er.code=j.code||'';if(res.status>=500)er.net=true;throw er}
  return j;
}
// \u041f\u043e\u0432\u0442\u043e\u0440\u044b: \u0442\u043e\u0442 \u0436\u0435 rq, \u0441\u0435\u0440\u0432\u0435\u0440 \u043e\u0442\u0434\u0430\u0441\u0442 \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u043d\u044b\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442, \u0435\u0441\u043b\u0438 \u043f\u0435\u0440\u0432\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441 \u0434\u043e\u0448\u0451\u043b
async function callRetry(a,p,rq,tries){
  tries=tries||3;let last;
  for(let i=0;i<tries;i++){
    try{return await call(a,p,rq)}catch(e){last=e;if(!e.net)throw e;await sleep([500,1300,2600][i]||2600)}
  }
  throw last;
}
function applyDiff(d){
  if(!d)return;
  for(const k in d){
    if(k==='box'||k==='inv'){const del=new Set(d[k].del||[]);S[k]=S[k].filter(x=>!del.has(x.id));for(const it of d[k].add||[]){const i=S[k].findIndex(x=>x.id===it.id);if(i>=0)S[k][i]=it;else S[k].push(it)}}
    else if(d[k]===null)delete S[k];else S[k]=d[k];
  }
}
function takeResp(j){
  const before={bal:S.bal,keys:S.keys};
  if(j.S)S=j.S;else if(j.d)applyDiff(j.d);
  if(j.me)Net.me=j.me;if(j.cfg)setCfg(j.cfg);
  Net.ver++;
  bumpWallet(before);
}

/* ---------- \u043e\u0447\u0435\u0440\u0435\u0434\u044c \u0431\u0435\u0437 \u0441\u0432\u044f\u0437\u0438: \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u0441\u044f, \u043a\u043e\u0433\u0434\u0430 \u0441\u0432\u044f\u0437\u044c \u0432\u0435\u0440\u043d\u0451\u0442\u0441\u044f ---------- */
const PEND_KEY='nomera21_pend';
const BAN_OK_C=new Set(['ticketNew','tickets','ticket','ticketMsg','payments']);
const RESEND=new Set(['open','runEnd','clickEnd','skinCase','stickerCase','tote','up','shopBuy','quick','bulk','sellInv','bankTake','bankPut']);
const Pend={
  list(){try{const l=JSON.parse(lsGet(PEND_KEY)||'[]');return Array.isArray(l)?l:[]}catch(e){return[]}},
  save(l){lsSet(PEND_KEY,JSON.stringify(l.slice(-30)))},
  add(a,p,rq){const l=Pend.list();if(!l.some(x=>x.rq===rq))l.push({a,p,rq,t:now()});Pend.save(l);renderNetbar()},
  busy:false,
  async flush(){
    if(Pend.busy||Net.status!=='on')return;const l=Pend.list();if(!l.length)return;
    Pend.busy=true;let changed=false;
    try{
      for(const x of l){
        if(now()-x.t>20*3600e3){Pend.drop(x.rq);continue}
        let j;
        try{j=await call(x.a,x.p,x.rq)}
        catch(e){if(e.net)break;Pend.drop(x.rq);toast(e.message,'err');changed=true;continue}
        Pend.drop(x.rq);takeResp(j);changed=true;
        const r=j.r||{};
        if(x.a==='open'&&r.item)toast('\u0421\u0432\u044f\u0437\u044c \u0432\u0435\u0440\u043d\u0443\u043b\u0430\u0441\u044c: \u043d\u043e\u043c\u0435\u0440 \u0438\u0437 \u043a\u0435\u0439\u0441\u0430 \u2014 '+plateText(r.item.pl)+', '+fmt(r.item.price));
        else if(x.a==='runEnd'&&r.money!=null)toast('\u0417\u0430\u0435\u0437\u0434 \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u043d: +'+fmt(r.money));
        else if(r.msg)toast(r.msg);
      }
    }finally{Pend.busy=false}
    if(changed){render();renderNetbar()}
  },
  drop(rq){Pend.save(Pend.list().filter(x=>x.rq!==rq))}
};

// \u041e\u0447\u0435\u0440\u0435\u0434\u044c: \u0437\u0430\u043f\u0440\u043e\u0441\u044b \u0443\u0445\u043e\u0434\u044f\u0442 \u043f\u043e \u043e\u0434\u043d\u043e\u043c\u0443, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u0432\u0435\u0442\u044b \u043f\u0440\u0438\u043c\u0435\u043d\u044f\u043b\u0438\u0441\u044c \u0432 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u043c \u043f\u043e\u0440\u044f\u0434\u043a\u0435
let queue=Promise.resolve();
function enqueue(fn){const p=queue.then(fn,fn);queue=p.catch(()=>{});return p}
function netLost(){if(Net.status==='on'){Net.status='off';renderNetbar();clearTimeout(retryT);retryT=setTimeout(connect,4000)}}
async function act(a,p,opt){
  opt=opt||{};p=p||{};
  const rq=opt.rq||rndId();
  // \u043e\u043f\u0442\u0438\u043c\u0438\u0441\u0442\u0438\u0447\u043d\u043e: \u043f\u0440\u0438\u043c\u0435\u043d\u044f\u0435\u043c \u0443 \u0441\u0435\u0431\u044f \u0441\u0440\u0430\u0437\u0443, \u0441\u0435\u0440\u0432\u0435\u0440 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u0442 \u0432 \u0444\u043e\u043d\u0435 (\u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0438 \u0431\u0435\u0437 \u0441\u0432\u044f\u0437\u0438)
  if(L.OPTIMISTIC.has(a)&&!opt.noOpt&&(Net.status==='on'||Net.status==='off')){
    const ctx={now:now(),admin:!!Net.me.role,notes:[],srv:false};
    const r=L.act(S,a,p,ctx);Net.ver++;
    if(Net.status!=='on'){Pend.add(a,p,rq);return r}
    enqueue(async()=>{
      try{const j=await callRetry(a,p,rq);takeResp(j)}
      catch(e){
        if(e.net){Pend.add(a,p,rq);netLost();return}
        toast(e.message,'err');Haptic.err();if(e.relogin){token=null;lsDel(TOKEN_KEY);connect()}else await refreshState(true);
      }
      render();
    });
    return r;
  }
  if(Net.status!=='on'&&!(Net.status==='ban'&&BAN_OK_C.has(a))){const er=new Error(Net.status==='tg'?'\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0438\u0433\u0440\u0443 \u0447\u0435\u0440\u0435\u0437 Telegram-\u0431\u043e\u0442\u0430':Net.status==='ban'?'\u0410\u043a\u043a\u0430\u0443\u043d\u0442 \u0437\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d':'\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u043c\u0441\u044f\u2026');er.net=Net.status==='off';throw er}
  return enqueue(async()=>{
    let j;
    try{j=await callRetry(a,p,rq)}
    catch(e){
      if(e.relogin){token=null;lsDel(TOKEN_KEY);connect()}
      if(e.code==='elev'){setTimeout(()=>Owner.unlock(),200)}
      if(e.code==='ban'){refreshState(true)}
      if(e.net&&RESEND.has(a)&&!opt.noPend){Pend.add(a,p,rq);e.pending=true;e.message=pendText(a);netLost()}
      throw e;
    }
    takeResp(j);return j.r||{};
  });
}
function pendText(a){
  if(a==='open'||a==='skinCase'||a==='stickerCase')return'\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438. \u041a\u0435\u0439\u0441 \u043e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f \u0441\u0430\u043c, \u043a\u043e\u0433\u0434\u0430 \u0441\u0432\u044f\u0437\u044c \u0432\u0435\u0440\u043d\u0451\u0442\u0441\u044f \u2014 \u043c\u043e\u043d\u0435\u0442\u044b \u043d\u0435 \u043f\u0440\u043e\u043f\u0430\u0434\u0443\u0442';
  if(a==='runEnd')return'\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438. \u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442 \u0437\u0430\u0435\u0437\u0434\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d \u0438 \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044f, \u043a\u043e\u0433\u0434\u0430 \u0441\u0432\u044f\u0437\u044c \u0432\u0435\u0440\u043d\u0451\u0442\u0441\u044f';
  return'\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438. \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u0441\u044f, \u043a\u043e\u0433\u0434\u0430 \u0441\u0432\u044f\u0437\u044c \u0432\u0435\u0440\u043d\u0451\u0442\u0441\u044f';
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
  }catch(e){toast(e.message,e.pending?'':'err');if(!e.pending)Haptic.err();if(opt.fail)opt.fail(e);render();return null}
  finally{busyKeys.delete(key);if(btn)btn.classList.remove('busy')}
}
let retryT=0;
async function connect(){
  clearTimeout(retryT);
  try{
    let j=null;
    if(tgData){j=await callRetry('auth',{initData:tgData,ref:refParam},undefined,2);setToken(j.t)}
    else if(token){try{j=await callRetry('state',{full:true},undefined,2)}catch(e){if(e.status===401){token=null;lsDel(TOKEN_KEY)}else throw e}}
    if(!j){
      try{j=await call('guest',{ref:refParam});setToken(j.t)}
      catch(e){if(e.net)throw e;Net.status='tg';bootDone();render();return}
    }
    takeResp(j);Net.status=Net.me.banned?'ban':'on';Net.err='';
    bootDone();render();showInbox();
    loadPub();startLive();Pend.flush();
    if(S.welcome==='new')setTimeout(welcome,400);
  }catch(e){
    Net.status='off';Net.err=e.net?'':(e.message||'')+(e.status?' (\u043a\u043e\u0434 '+e.status+')':'');
    bootDone();render();retryT=setTimeout(connect,e.net?5000:15000);
  }
}
async function refreshState(force){
  if(Net.status!=='on'&&Net.status!=='ban')return;
  if(!force&&(Reel.busy||busyKeys.size))return;
  try{await enqueue(async()=>{const j=await call('state');takeResp(j);if(Net.me.banned!==(Net.status==='ban'))Net.status=Net.me.banned?'ban':'on'});render();showInbox()}catch(e){if(e.net)netLost()}
}
window.addEventListener('online',()=>{if(Net.status==='off')connect();else Pend.flush()});
setInterval(()=>{if(!document.hidden)Pend.flush()},20000);

/* ---------- \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u0447\u0438\u0442\u0430\u044e\u0442\u0441\u044f \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u0438\u0437 \u0431\u0430\u0437\u044b: \u044d\u0442\u043e \u043d\u0435 \u0442\u0440\u0430\u0442\u0438\u0442 \u043b\u0438\u043c\u0438\u0442 \u0432\u044b\u0437\u043e\u0432\u043e\u0432 \u0444\u0443\u043d\u043a\u0446\u0438\u0438 ---------- */
function sbClient(){
  if(Net.sb)return Net.sb;
  if(window.supabase&&CFG.supabaseUrl&&CFG.anonKey)Net.sb=window.supabase.createClient(CFG.supabaseUrl,CFG.anonKey,{auth:{persistSession:false}});
  return Net.sb;
}
const CM_COLS='id,num,wall,author,nick,text,t,parent,reply_to,reply_uid,adm';
const fixC=x=>Object.assign(x,{t:Number(x.t),num:Number(x.num)||0});
async function loadPub(what){
  const sb=sbClient();
  try{
    if(!sb){const j=await call('pub');Net.open=j.open||[];Net.orders=j.orders||[];Net.top=j.top||[];Net.feed=j.feed||[];setCfg(j.cfg);renderPub();return}
    const need=w=>!what||what===w;const jobs=[];
    if(need('market'))jobs.push(sb.from('listings').select('*').order('t',{ascending:false}).limit(500).then(r=>{if(!r.error)Net.open=(r.data||[]).map(l=>Object.assign(l,{t:Number(l.t),ask:Number(l.ask),price:Number(l.price),snum:Number(l.snum)||0}))}));
    if(need('orders'))jobs.push(sb.from('orders').select('*').order('price',{ascending:false}).limit(400).then(r=>{if(!r.error)Net.orders=(r.data||[]).map(o=>Object.assign(o,{price:Number(o.price)}))}));
    if(need('top'))jobs.push(sb.from('top_xp').select('*').then(r=>{if(!r.error)Net.top=r.data||[]}));
    if(need('kv'))jobs.push(sb.from('kv').select('key,val').in('key',['feed','cfg']).then(r=>{if(r.error)return;for(const x of r.data||[]){if(x.key==='feed')Net.feed=(x.val&&x.val.items)||[];if(x.key==='cfg')setCfg(x.val)}}));
    await Promise.all(jobs);renderPub();
  }catch(e){}
}
async function pubProfile(uid){
  const sb=sbClient();
  if(!sb){const j=await call('pub.profile',{uid});return j}
  const [p,c]=await Promise.all([sb.from('profiles').select('*').eq('uid',uid).maybeSingle(),sb.from('comments').select(CM_COLS).eq('wall',uid).order('t',{ascending:false}).limit(300)]);
  if(p.error||!p.data)throw new Error('\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');
  return{p:p.data,comments:(c.data||[]).map(fixC)};
}
async function profileByNum(n){
  const sb=sbClient();if(!sb){const j=await call('pub.num',{n});return j.p||null}
  const r=await sb.from('profiles').select('uid,num,nick').eq('num',n).maybeSingle();return r.data||null;
}
async function commentByNum(n){
  const sb=sbClient();if(!sb){const j=await call('pub.cnum',{n});return j.c||null}
  const r=await sb.from('comments').select(CM_COLS).eq('num',n).maybeSingle();return r.data?fixC(r.data):null;
}
async function commentsBy(uid){
  const sb=sbClient();if(!sb){const j=await call('pub.cby',{uid});return(j.list||[]).map(fixC)}
  const r=await sb.from('comments').select(CM_COLS).eq('author',uid).order('t',{ascending:false}).limit(100);return(r.data||[]).map(fixC);
}
async function salesHistory(uid){
  const sb=sbClient();if(!sb){const r=await act('myHist',{});return(r&&r.list)||[]}
  const r=await sb.from('sales').select('id,kind,key,price,t,buyer,seller,bnick,snick,it,fee').or('buyer.eq.'+uid+',seller.eq.'+uid).order('t',{ascending:false}).limit(100);
  return(r.data||[]).map(x=>Object.assign(x,{t:Number(x.t),price:Number(x.price),fee:Number(x.fee)||0}));
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
    .on('postgres_changes',{event:'*',schema:'public',table:'comments'},()=>soon('c',500,()=>{if(Prof.cur)Prof.reload();if(Tabs.cur==='account'&&!Page.stack.length)loadWall(Net.me.uid,$('acc-wall'))}))
    .subscribe();
  const on=sb.channel('online',{config:{presence:{key:Net.me.uid||String(Math.random())}}});
  on.on('presence',{event:'sync'},()=>{Net.online=Object.keys(on.presenceState()).length;renderOnline()})
    .subscribe(st=>{if(st==='SUBSCRIBED')on.track({t:now()}).catch(()=>{})});
  setInterval(()=>{if(!document.hidden&&Tabs.cur==='season')loadPub('top')},60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshState();loadPub();Pend.flush()}});
}
let inboxBusy=false;
async function showInbox(){
  if(inboxBusy||!S.inbox||!S.inbox.length||Net.status!=='on')return;
  inboxBusy=true;S.inbox.forEach(m=>toast(m.text));
  try{await act('inboxSeen')}catch(e){}
  inboxBusy=false;
}

/* ================= \u043a\u0430\u0440\u043a\u0430\u0441: \u0432\u043a\u043b\u0430\u0434\u043a\u0438, \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b, \u0448\u0442\u043e\u0440\u043a\u0438, \u0442\u043e\u0441\u0442\u044b, \u0448\u0430\u043f\u043a\u0430 ================= */
const ACT={};          // \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u0438 data-act
const ON={};           // \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u0438 data-on (input/change)
const TABS=[{id:'shop',n:'\u041c\u0430\u0433\u0430\u0437\u0438\u043d',i:'case'},{id:'games',n:'\u0418\u0433\u0440\u044b',i:'games'},{id:'invest',n:'\u0412\u043b\u043e\u0436\u0435\u043d\u0438\u044f',i:'invest'},{id:'season',n:'\u0421\u0435\u0437\u043e\u043d',i:'season'},{id:'account',n:'\u0410\u043a\u043a\u0430\u0443\u043d\u0442',i:'account'}];
const RENDER={};       // RENDER[tab]()
const Tabs={
  cur:'shop',
  init(){
    const el=$('tabs');
    el.insertAdjacentHTML('beforeend',TABS.map(t=>'<button role="tab" data-act="tab" data-id="'+t.id+'" id="tb-'+t.id+'" aria-label="'+t.n+'">'+ic(t.i)+'<span>'+t.n+'</span></button>').join(''));
    $('donate-btn').innerHTML=ic('star');
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
    Sheet.close(true);
    if(Tabs.cur===id){window.scrollTo({top:0,behavior:'smooth'});return}
    Tabs.cur=id;qsa('.tab').forEach(s=>s.classList.toggle('on',s.id==='t-'+id));
    Tabs.lens();window.scrollTo(0,0);RENDER[id]();Haptic.tick();
    if(id!=='shop')Reel.pauseIdle();else Reel.resumeIdle();
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
    if(sh.querySelector('canvas[data-skin]'))hydrateSkins(sh);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{sh.classList.add('in');sc.classList.add('in')}));
    // \u0436\u0435\u0441\u0442: \u0441\u043c\u0430\u0445\u043d\u0443\u0442\u044c \u0432\u043d\u0438\u0437
    let y0=null,dy=0;
    sh.addEventListener('touchstart',e=>{if(sh.scrollTop>0||e.target.closest('input,textarea,select,.noswipe'))return;y0=e.touches[0].clientY;dy=0},{passive:true});
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
function toast(msg,kind){
  if(!msg)return;const box=$('toasts');
  if(box.children.length>=3)box.firstChild.remove();
  const el=document.createElement('div');el.className='toast'+(kind?' '+kind:'');el.textContent=msg;box.appendChild(el);
  const ms=Math.min(6500,2200+msg.length*35);
  setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),320)},ms);
}

/* ---------- \u0448\u0430\u043f\u043a\u0430: \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0438\u0433\u0440\u044b, ID, \u043a\u043e\u0448\u0435\u043b\u0451\u043a \u0441 (+) ---------- */
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
const idStr=n=>n?pad8(n):'\u2014';
const admBadge=role=>role==='owner'||role==='admin'?'<span class="adm">\u0410\u0434\u043c\u0438\u043d</span>':'';
function walletHTML(){
  return'<div class="wallet">'+
    '<button class="chip w-bal" data-act="topup" data-c="coins" aria-label="\u041c\u043e\u043d\u0435\u0442\u044b, \u043f\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u044c"><i class="coin"></i><span class="num">'+fmtN(S.bal)+'</span><span class="pl">'+ic('plus')+'</span></button>'+
    '<button class="chip key w-keys" data-act="topup" data-c="keys" aria-label="\u041a\u043b\u044e\u0447\u0438, \u043f\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u044c">'+ic('key')+'<span class="num">'+fmtN(S.keys)+'</span><span class="pl">'+ic('plus')+'</span></button>'+
    (Net.online>1?'<span class="chip w-on" style="background:transparent;color:var(--text2);font-weight:500"><i style="width:8px;height:8px;border-radius:50%;background:var(--green);display:inline-block"></i><span class="num">'+fmtN(Net.online)+'</span> \u043e\u043d\u043b\u0430\u0439\u043d</span>':'')+
  '</div>';
}
function appbarHTML(){
  const lv=L.level(S),pct=L.lvlPct(S);
  return'<div class="appbar"><button class="lvlring" data-act="tab" data-id="season" aria-label="\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430 '+lv+'">'+ring(lv>=L.SEASON.max?1:pct/100,'var(--accent)')+'<b class="num">'+lv+'</b></button>'+
    '<div class="appname"><b>\u0412\u044b\u0431\u0438\u0432\u0430\u043d\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u043e\u0432</b><small>\u041f\u0440\u043e\u043f\u0443\u0441\u043a \u00b7 \u0443\u0440\u043e\u0432\u0435\u043d\u044c '+lv+'</small></div>'+
    '<button class="uidchip num" data-act="myId" aria-label="\u0412\u0430\u0448 ID">ID '+idStr(Net.me.num)+'</button>'+
    '<button data-act="me" aria-label="\u041c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c" style="border-radius:50%">'+avaHTML(Net.me.uid,S.nick,'',Net.me.ava)+'</button></div>';
}
function topHTML(title,right){
  return appbarHTML()+walletHTML()+'<div class="top"><h1>'+esc(title)+'</h1>'+(right||'')+'</div>'+netbar();
}
function netbar(){
  const n=Pend.list().length;
  if(Net.status==='off')return'<div class="netbar">\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041f\u0435\u0440\u0435\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u043c\u0441\u044f\u2026'+(n?'<br>\u0416\u0434\u0443\u0442 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438: '+n+'. \u041d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043f\u043e\u0442\u0435\u0440\u044f\u0435\u0442\u0441\u044f.':'')+(Net.err?'<br><span style="opacity:.8">'+esc(Net.err)+'</span>':'')+'</div>';
  if(Net.status==='tg')return'<div class="netbar" style="background:var(--fill2);color:var(--text)">\u0418\u0433\u0440\u0430 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 Telegram-\u0431\u043e\u0442\u0430. \u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0431\u043e\u0442\u0430 \u0438 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u0418\u0433\u0440\u0430\u0442\u044c\u00bb.</div>';
  if(Net.status==='ban')return'<div class="netbar">\u0410\u043a\u043a\u0430\u0443\u043d\u0442 \u0437\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0435\u0439. \u041e\u0431\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u043c\u043e\u0436\u043d\u043e \u0432 \u00ab\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0435\u00bb \u0432\u043e \u0432\u043a\u043b\u0430\u0434\u043a\u0435 \u00ab\u0410\u043a\u043a\u0430\u0443\u043d\u0442\u00bb.</div>';
  if(n)return'<div class="netbar" style="background:rgba(255,159,10,.14);color:var(--orange)">\u041e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c '+n+' '+plural(n,'\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435','\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f','\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439')+', \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u043d\u044b\u0445 \u0431\u0435\u0437 \u0441\u0432\u044f\u0437\u0438\u2026</div>';
  return'';
}
function renderNetbar(){qsa('.netbar').forEach(e=>e.remove());const t=qs('.tab.on .top');if(t)t.insertAdjacentHTML('afterend',netbar())}
function bumpWallet(b){
  requestAnimationFrame(()=>{
    for(const [k,cls] of [['bal','w-bal'],['keys','w-keys']]){
      if(b[k]===S[k])continue;
      qsa('.'+cls).forEach(el=>{el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')});
    }
  });
}
function renderWallet(){
  qsa('.w-bal .num').forEach(e=>e.textContent=fmtN(S.bal));
  qsa('.w-keys .num').forEach(e=>e.textContent=fmtN(S.keys));
}
function renderOnline(){qsa('.w-on .num').forEach(e=>e.textContent=fmtN(Net.online))}
ACT.topup=el=>openDonate(el.dataset.c);
ACT.myId=async()=>{await copyText(idStr(Net.me.num));toast('\u0412\u0430\u0448 ID '+idStr(Net.me.num)+' \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d');Haptic.tick()};

/* ---------- \u043e\u0431\u0449\u0438\u0439 \u0440\u0435\u043d\u0434\u0435\u0440 ---------- */
function render(){
  if(RENDER[Tabs.cur])RENDER[Tabs.cur]();
  Page.renderTop();
  renderBadges();
}
function renderPub(){
  if(Tabs.cur==='shop')RENDER.shopPub&&RENDER.shopPub();
  if(Tabs.cur==='season'&&RENDER.season)RENDER.season();
  if(Page.stack.length)Page.renderTop();
}
function renderBadges(){
  const t=now();
  const n=L.claimable(S,t)+L.questReady(S,t)+((S.week&&S.week.xp>=L.WEEK_XP&&S.week.got.length<2)?1:0)+(L.dayReady(S,t)?1:0)+(L.rbReady(S,t)?1:0);
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
// \u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u0441\u0434\u0435\u043b\u043a\u0438: \u0447\u0442\u043e \u043e\u0442\u0434\u0430\u0451\u0442\u0435 \u0438 \u0447\u0442\u043e \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 \u2014 \u0434\u043e \u043d\u0430\u0436\u0430\u0442\u0438\u044f
function dealSheet(o){
  const rows=o.rows.map(r=>'<div class="li noic"><span class="lt">'+r[0]+'</span><span class="lv num" style="color:'+(r[2]||'var(--text)')+';font-weight:600">'+r[1]+'</span></div>').join('');
  Sheet.open({title:o.title,lead:o.lead||'',body:(o.top||'')+'<div class="group" style="margin-top:6px">'+rows+'</div>'+(o.note?'<p class="note">'+o.note+'</p>':'')+'<div class="foot"><button class="btn pri wide" data-act="cfmOk">'+esc(o.ok)+'</button><button class="btn wide" data-act="sheetx">\u041e\u0442\u043c\u0435\u043d\u0430</button></div>'});
  ACT.cfmOk=el=>{o.go(el)};
}
function ring(p,color){const r=18,c=2*Math.PI*r;return'<svg class="ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="'+r+'" fill="none" stroke="var(--fill)" stroke-width="5"/><circle cx="22" cy="22" r="'+r+'" fill="none" stroke="'+(color||'var(--accent)')+'" stroke-width="5" stroke-linecap="round" stroke-dasharray="'+(c*Math.max(0,Math.min(1,p))).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 22 22)"/></svg>'}
function copyText(t){
  try{if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t).then(()=>true,()=>fallback())}catch(e){}
  return Promise.resolve(fallback());
  function fallback(){try{const ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok}catch(e){return false}}
}
function openLink(url){try{if(TG&&/^https:\/\/t\.me\//.test(url)&&TG.openTelegramLink){TG.openTelegramLink(url);return}if(TG&&TG.openLink){TG.openLink(url);return}}catch(e){}window.open(url,'_blank','noopener')}
const numIn=v=>Math.max(0,Math.round(+String(v==null?'':v).replace(/[^\d]/g,'')||0));
// \u041f\u0440\u043e\u0441\u0442\u043e\u0439 \u0442\u0430\u0439\u043c\u0435\u0440: \u043e\u0431\u043d\u043e\u0432\u043b\u044f\u0435\u0442 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u044b [data-left] \u0440\u0430\u0437 \u0432 20 \u0441\u0435\u043a\u0443\u043d\u0434
setInterval(()=>{qsa('[data-left]').forEach(el=>{const t=+el.dataset.left;el.textContent=(el.dataset.pre||'')+left(t-now())})},20000);

/* ================= \u0432\u043a\u043b\u0430\u0434\u043a\u0430 \u00ab\u041c\u0430\u0433\u0430\u0437\u0438\u043d\u00bb: \u043a\u0435\u0439\u0441\u044b \u0438 \u0440\u044b\u043d\u043e\u043a ================= */
const CN_SHORT={ru:'\u0420\u043e\u0441\u0441\u0438\u044f',ua:'\u0423\u043a\u0440\u0430\u0438\u043d\u0430',kz:'\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d',us:'\u0421\u0428\u0410',eu:'\u0415\u0432\u0440\u043e\u043f\u0430',ae:'\u0414\u0443\u0431\u0430\u0439',mix:'\u041c\u0438\u043a\u0441'};
const TIER_G=['g-grey','g-orange','g-blue','g-red','g-yellow'];
let curC=lsGet('nomera2_c')||'ru';if(!CN_SHORT[curC])curC='ru';
let curTier=+lsGet('nomera2_tier')||0;if(!TIERS[curTier])curTier=0;
let curReg=lsGet('nomera21_reg_'+curC)||'';
let shopSeg=lsGet('nomera21_seg')||'cases';
let lastDrop=null;
const hasReg=c=>['ru','ua','kz','us','eu'].includes(c);
const regRow=(c,r)=>c&&r&&L.RMAP[c]&&L.RMAP[c][r];
function priceNow(){return curReg&&regRow(curC,curReg)?L.regionPrice(curC,curReg,curTier):{price:TIERS[curTier].price,keys:TIERS[curTier].keys}}

/* ---------- \u0440\u0443\u043b\u0435\u0442\u043a\u0430 ---------- */
const Reel=(()=>{
  const W=196,GAP=10,STEP=W+GAP;
  let strip=null,box=null,x=0,v=0,raf=0,phase='idle',lastT=0,stopT0=0,stopX0=0,stopD=0,stopDur=0,winIdx=-1,lastIdx=-1,lastTick=0,idleOn=true,onDone=null,pending=null,spinT0=0;
  let items=[];
  const rndItem=()=>{const c=curC==='mix'?L.pick(COUNTRIES):curC;return L.caseRoll(c,curTier,curC!=='mix'&&curReg?curReg:undefined)};
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
    const gone=idxAt(x)-12;
    if(gone>20&&phase!=='stop'){for(let i=0;i<gone;i++){strip.firstChild.remove()}items.splice(0,gone);x-=gone*STEP;lastIdx-=gone}
    const need=idxAt(x)+30-items.length;if(need>0)fill(need+10);
  }
  function loop(ts){
    raf=requestAnimationFrame(loop);
    const dt=Math.min(.05,(ts-lastT)/1000);lastT=ts;
    if(!box||!document.body.contains(box))return;
    if(phase==='idle'){if(!idleOn||Tabs.cur!=='shop'||shopSeg!=='cases'||document.hidden)return;x+=18*dt}
    else if(phase==='spin'){v=Math.min(2600,v+5200*dt);x+=v*dt;if(pending&&ts-spinT0>650){const p=pending;pending=null;beginStop(p)}}
    else if(phase==='stop'){
      const t=Math.min(1,(ts-stopT0)/1000/stopDur);const k=1-Math.pow(1-t,3);x=stopX0+stopD*k;
      if(t>=1){phase='idle';x=stopX0+stopD;draw();finish();return}
    }
    trim();draw();
    const i=idxAt(x);if(i!==lastIdx){lastIdx=i;if(phase!=='idle'&&ts-lastTick>45){lastTick=ts;Snd.tick();Haptic.tick()}}
  }
  function beginStop(win){
    if(!win){phase='stop';stopT0=performance.now();stopX0=x;stopD=v*.5;stopDur=Math.max(.4,3*stopD/Math.max(1,v));winIdx=-1;onDone=null;return}
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
    v=0;const f=onDone;onDone=null;if(f)f();
  }
  return{
    get busy(){return phase!=='idle'},
    mount,
    remount(){if(box&&phase==='idle'){strip.innerHTML='';items=[];x=0;fill(40);center(8);draw()}},
    spin(){phase='spin';v=300;spinT0=performance.now();pending=null},
    land(item,done){pending={item,done}},
    abort(){pending=null;beginStop(null);phase='stop'},
    pauseIdle(){idleOn=false},resumeIdle(){idleOn=true}
  };
})();

/* ---------- \u043e\u0442\u043a\u0440\u044b\u0442\u0438\u0435 \u043a\u0435\u0439\u0441\u0430 ---------- */
function canOpen(how){
  const t=TIERS[curTier],pr=priceNow();
  if(t.event&&!L.seasonOn(now()))return'\u0421\u0435\u0437\u043e\u043d \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0441\u044f';
  if(S.box.length>=L.BOX_CAP)return'\u0413\u0430\u0440\u0430\u0436 \u043f\u043e\u043b\u043e\u043d. \u041f\u0440\u043e\u0434\u0430\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440\u0430 \u0432 \u00ab\u0418\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u0435\u00bb, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0435\u0439\u0441';
  if(how==='key'&&S.keys<pr.keys)return'\u041d\u0443\u0436\u043d\u043e '+keyN(pr.keys)+'. \u041a\u043b\u044e\u0447\u0438 \u0434\u0430\u044e\u0442 \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b, \u0437\u0430\u0434\u0430\u043d\u0438\u044f, \u043e\u0433\u043e\u043d\u0451\u043a \u0438 \u0434\u043e\u043d\u0430\u0442';
  if(how==='coin'&&S.bal<pr.price)return'\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+fmt(pr.price-S.bal)+'. \u0417\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u0439\u0442\u0435 \u0432 \u00ab\u0418\u0433\u0440\u0430\u0445\u00bb \u0438\u043b\u0438 \u0437\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0435\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u0443\u044e \u043d\u0430\u0433\u0440\u0430\u0434\u0443';
  if(how==='free'&&!(S.free.p[curTier]>0))return'\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0445 \u043a\u0435\u0439\u0441\u043e\u0432 \u043d\u0435\u0442';
  return'';
}
async function openCase(how){
  if(Reel.busy||busyKeys.has('open'))return;
  if(Net.status!=='on'){toast(Net.status==='tg'?'\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0438\u0433\u0440\u0443 \u0447\u0435\u0440\u0435\u0437 Telegram-\u0431\u043e\u0442\u0430':'\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c','err');return}
  const why=canOpen(how);if(why){toast(why,'err');Haptic.err();return}
  busyKeys.add('open');Haptic.tap();Snd.ctx();
  lastDrop=null;const dr=$('drop');if(dr)dr.innerHTML='';
  Reel.spin();renderOpener();
  const p={tier:curTier,c:curC,key:how==='key',free:how==='free'};if(how!=='free'&&curReg&&curC!=='mix'&&curC!=='ae')p.reg=curReg;
  try{
    const r=await act('open',p);
    renderWallet();
    Reel.land(r.item,()=>{
      busyKeys.delete('open');lastDrop=r.item;
      const lv=r.item.m;Snd.win(lv);if(lv>=2||r.item.price>=10000)Haptic.ok();else Haptic.soft();
      (r.notes||[]).forEach(n=>toast(n));
      render();showInbox();
      const d=$('drop');if(d)d.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  }catch(e){busyKeys.delete('open');Reel.abort();toast(e.message,e.pending?'':'err');if(!e.pending)Haptic.err();renderOpener()}
}
ACT.open=()=>openCase('coin');
ACT.openKey=()=>openCase('key');
ACT.openFree=()=>openCase('free');
ACT.cc=el=>{if(Reel.busy)return;curC=el.dataset.c;lsSet('nomera2_c',curC);curReg=hasReg(curC)?(lsGet('nomera21_reg_'+curC)||''):'';if(curReg&&!regRow(curC,curReg))curReg='';Haptic.tick();renderSeg();renderOpener();Reel.remount()};
ACT.tier=el=>{if(Reel.busy)return;curTier=+el.dataset.t;lsSet('nomera2_tier',curTier);Haptic.tick();renderOpener();renderTiers();Reel.remount()};
ACT.shopSeg=el=>{shopSeg=el.dataset.s;lsSet('nomera21_seg',shopSeg);Haptic.tick();window.scrollTo(0,0);RENDER.shop()};

/* ---------- \u0432\u044b\u0431\u043e\u0440 \u0440\u0435\u0433\u0438\u043e\u043d\u0430 ---------- */
ACT.regPick=()=>{
  if(!hasReg(curC))return;
  const list=L.REG[curC].slice().sort((a,b)=>b[2]-a[2]||String(a[0]).localeCompare(String(b[0]),'ru',{numeric:true}));
  const row=r=>{const pr=L.regionPrice(curC,r[0],curTier);return'<button class="li noic" data-act="regSet" data-r="'+esc(r[0])+'" data-q="'+esc((r[0]+' '+r[1]).toLowerCase())+'"><span class="lt"><b class="num">'+esc(r[0])+'</b> '+esc(r[1])+(r[2]!==1?' <span class="muted">\u00d7'+String(r[2]).replace('.',',')+'</span>':'')+'</span><span class="lv num">'+fmtN(pr.price)+' \u00b7 '+pr.keys+' \u043a\u043b.</span>'+(curReg===r[0]?'<span style="width:20px;height:20px;color:var(--accent)">'+ic('check')+'</span>':'')+'</button>'};
  Sheet.open({title:'\u0420\u0435\u0433\u0438\u043e\u043d \u043d\u043e\u043c\u0435\u0440\u0430',lead:'\u041a\u0435\u0439\u0441 \u0432\u044b\u0434\u0430\u0441\u0442 \u043d\u043e\u043c\u0435\u0440 \u0442\u043e\u043b\u044c\u043a\u043e \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e \u0440\u0435\u0433\u0438\u043e\u043d\u0430. \u0420\u0435\u0433\u0438\u043e\u043d \u0441 \u0431\u043e\u043b\u044c\u0448\u0438\u043c \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u0435\u043c \u0434\u043e\u0440\u043e\u0436\u0435, \u043e\u043a\u0443\u043f\u0430\u0435\u043c\u043e\u0441\u0442\u044c \u0442\u0430 \u0436\u0435.',body:
    (list.length>12?'<div class="field"><input class="inp" placeholder="\u041a\u043e\u0434 \u0438\u043b\u0438 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 62" data-on="regQ"></div>':'')+
    '<div class="group" id="reg-list"><button class="li noic" data-act="regSet" data-r=""><span class="lt"><b>\u041b\u044e\u0431\u043e\u0439 \u0440\u0435\u0433\u0438\u043e\u043d</b></span><span class="lv num">'+fmtN(TIERS[curTier].price)+' \u00b7 '+TIERS[curTier].keys+' \u043a\u043b.</span>'+(!curReg?'<span style="width:20px;height:20px;color:var(--accent)">'+ic('check')+'</span>':'')+'</button>'+list.map(row).join('')+'</div>'});
};
ON.regQ=el=>{const q=el.value.trim().toLowerCase();qsa('#reg-list [data-q]').forEach(b=>{b.style.display=!q||b.dataset.q.includes(q)?'':'none'})};
ACT.regSet=el=>{curReg=el.dataset.r||'';lsSet('nomera21_reg_'+curC,curReg);Sheet.close();renderSeg();renderOpener();Reel.remount();Haptic.tick()};

/* ---------- \u043e\u0442\u0440\u0438\u0441\u043e\u0432\u043a\u0430 \u0432\u043a\u043b\u0430\u0434\u043a\u0438 ---------- */
let shopBuilt=false;
RENDER.shop=()=>{
  const root=$('t-shop');
  if(!shopBuilt){
    root.innerHTML='<div id="sh-top"></div><div class="pad" style="margin:4px 0 6px"><div class="segbox big" id="sh-seg"></div></div><div id="sh-cases"><div id="cs-news"></div><div class="seg" id="cs-seg" style="margin-top:6px"></div><div id="cs-reg"></div><div style="height:10px"></div><div class="reel" id="reel"></div><div class="opener" id="opener"></div><div id="drop"></div>'+
      '<div id="cs-tiers"></div><div id="cs-cos"></div><div id="cs-mine"></div><div id="cs-feed"></div></div><div id="sh-market" class="hidden"></div>';
    shopBuilt=true;Reel.mount($('reel'));
  }
  $('sh-top').innerHTML=topHTML('\u041c\u0430\u0433\u0430\u0437\u0438\u043d','<button class="pill" data-act="inventory">'+ic('bag')+'\u0418\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c</button>');hydrateAvas($('sh-top'));
  $('sh-seg').innerHTML=[['cases','\u041a\u0435\u0439\u0441\u044b'],['market','\u0420\u044b\u043d\u043e\u043a']].map(s=>'<button class="'+(shopSeg===s[0]?'on':'')+'" data-act="shopSeg" data-s="'+s[0]+'">'+s[1]+'</button>').join('');
  const mk=shopSeg==='market';$('sh-cases').classList.toggle('hidden',mk);$('sh-market').classList.toggle('hidden',!mk);
  if(mk){Reel.pauseIdle();renderMarketIn($('sh-market'));return}
  Reel.resumeIdle();
  renderNews();renderSeg();renderOpener();renderDrop();renderTiers();renderCos();renderMine();RENDER.shopFeed();
};
RENDER.shopPub=()=>{if(shopSeg==='market')renderMarketIn($('sh-market'));else{RENDER.shopFeed();renderNews()}};
function renderNews(){
  const n=Net.cfg.news;const el=$('cs-news');if(!el)return;
  el.innerHTML=n?'<div class="row" style="margin:10px var(--g) 0;width:auto;min-height:0"><div class="ico" style="width:36px;height:36px;border-radius:10px;background:var(--blue)">'+ic('mega')+'</div><div class="mid"><div class="ss" style="color:var(--text);white-space:normal;margin:0;font-size:15px">'+esc(n)+'</div></div></div>':'';
}
function renderSeg(){
  const el=$('cs-seg');if(!el)return;
  el.innerHTML=Object.keys(CN_SHORT).map(c=>'<button class="'+(c===curC?'on':'')+'" data-act="cc" data-c="'+c+'">'+CN_SHORT[c]+'</button>').join('');
  const rg=$('cs-reg');if(!rg)return;
  if(!hasReg(curC)){rg.innerHTML='';return}
  const r=regRow(curC,curReg);
  rg.innerHTML='<div class="pad" style="margin-top:8px"><button class="regbtn" data-act="regPick"><span class="muted">'+(curC==='us'?'\u0428\u0442\u0430\u0442':curC==='eu'?'\u0421\u0442\u0440\u0430\u043d\u0430':'\u0420\u0435\u0433\u0438\u043e\u043d')+'</span><b>'+(r?esc(r[0]+' \u00b7 '+r[1]):'\u041b\u044e\u0431\u043e\u0439')+'</b>'+(r&&r[2]!==1?'<span class="badge">\u00d7'+String(r[2]).replace('.',',')+'</span>':'')+ic('chev','chev')+'</button></div>';
}
function renderOpener(){
  const el=$('opener');if(!el)return;const t=TIERS[curTier];const spin=Reel.busy||busyKeys.has('open');
  const seasonOff=t.event&&!L.seasonOn(now());const pr=priceNow();const fr=S.free.p[curTier]||0;
  el.innerHTML='<div class="segbox tiers">'+TIERS.map((x,i)=>'<button class="'+(i===curTier?'on':'')+'" data-act="tier" data-t="'+i+'">'+x.name+'</button>').join('')+'</div>'+
    '<div class="acts"><button class="btn pri'+(spin||seasonOff?' off':'')+'" data-act="open"><span>\u041e\u0442\u043a\u0440\u044b\u0442\u044c</span><small class="num">'+fmtN(pr.price)+'</small><i class="coin"></i></button>'+
    '<button class="btn'+(spin||seasonOff?' off':'')+'" data-act="openKey">'+ic('key')+'<span class="num">'+pr.keys+'</span><small>'+plural(pr.keys,'\u043a\u043b\u044e\u0447','\u043a\u043b\u044e\u0447\u0430','\u043a\u043b\u044e\u0447\u0435\u0439')+'</small></button></div>'+
    (fr>0&&!(curReg&&curC!=='mix')?'<button class="btn md wide green'+(spin||seasonOff?' off':'')+'" data-act="openFree">'+ic('gift')+'\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e \u00b7 \u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c '+fr+'</button>':fr>0?'<p class="note" style="margin:0 4px">\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0435 \u043a\u0435\u0439\u0441\u044b \u00ab'+t.name+'\u00bb ('+fr+') \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u044e\u0442\u0441\u044f \u0431\u0435\u0437 \u0432\u044b\u0431\u043e\u0440\u0430 \u0440\u0435\u0433\u0438\u043e\u043d\u0430</p>':'');
}
function renderDrop(){
  const el=$('drop');if(!el)return;
  if(!lastDrop||Reel.busy){el.innerHTML='';return}
  const it=S.box.find(b=>b.id===lastDrop.id)||null;
  if(!it){el.innerHTML='';return}
  const share=(it.m>=2||it.price>=10000)&&S.hint.share!==L.mskDate(now());
  el.innerHTML='<div class="drop popin" style="'+mc(it)+'"><div class="head"><span class="matb" style="'+mc(it)+'">'+matOf(it).n+'</span><span class="muted" style="font-size:14px">'+esc(COUNTRY[it.pl.c].n)+'</span><div style="flex:1"></div><button class="iconbtn" data-act="pin" data-id="'+it.id+'" aria-label="\u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c" style="'+(it.pin?'color:var(--accent)':'')+'">'+ic('pin')+'</button></div>'+
    '<button class="mat" data-act="insp" data-id="'+it.id+'" style="width:100%;padding:14px 12px">'+plateHTML(it)+'</button>'+
    '<div style="display:flex;align-items:baseline;gap:10px;margin-top:14px;flex-wrap:wrap"><div class="price">'+COIN(it.price)+'</div><div class="muted" style="font-size:14px">\u0441\u043a\u0443\u043f\u0449\u0438\u043a \u0434\u0430\u0441\u0442 '+fmt(L.buyback(it))+'</div></div>'+
    '<div class="meta">'+itemMeta(it)+'</div>'+
    '<div class="acts"><button class="btn md" data-act="quick" data-id="'+it.id+'">\u0421\u043a\u0443\u043f\u0449\u0438\u043a\u0443</button><button class="btn md" data-act="sell" data-id="'+it.id+'" data-k="plate">\u041d\u0430 \u0440\u044b\u043d\u043e\u043a</button><button class="btn md" data-act="insp" data-id="'+it.id+'">'+ic('eye')+'\u041e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c</button></div>'+
    (share?'<div class="row" style="margin-top:12px;background:var(--fill3);min-height:0;padding:10px 12px"><div class="mid"><div class="ss" style="color:var(--text);white-space:normal;margin:0">\u041f\u043e\u043a\u0430\u0436\u0438 \u0434\u0440\u0443\u0437\u044c\u044f\u043c \u2014 \u043f\u043e\u043b\u0443\u0447\u0438\u0448\u044c '+fmt(L.refRewardFor(S.don,L.isPrem(S,now())))+' \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e</div></div><button class="pill" data-act="shareRef" data-src="drop">'+ic('share')+'\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f</button></div>':'')+
    '</div>';
}
function renderTiers(){
  const el=$('cs-tiers');if(!el)return;
  el.innerHTML=secH('\u041a\u0435\u0439\u0441\u044b \u0441 \u043d\u043e\u043c\u0435\u0440\u0430\u043c\u0438')+'<div class="grid2 top4">'+TIERS.map((t,i)=>{
    const mw=(t.mwc&&t.mwc[curC])||t.mw;const top=mw.slice(2).reduce((a,b)=>a+b,0)/mw.reduce((a,b)=>a+b,0)*100;
    return'<button class="gc '+TIER_G[i]+'" data-act="odds" data-t="'+i+'" style="text-align:left'+(i===curTier?';box-shadow:inset 0 0 0 3px rgba(255,255,255,.85)':'')+'"><span class="big">'+(i+1)+'</span>'+
      '<span class="art" style="right:12px;top:30px">'+caseArt(i)+'</span>'+
      '<span class="k">'+(t.event?'\u0422\u043e\u043b\u044c\u043a\u043e \u0432 \u0441\u0435\u0437\u043e\u043d\u0435':i===4?'\u041d\u043e\u0432\u044b\u0439':'\u041a\u0435\u0439\u0441')+'</span><span class="t">'+t.name+'</span><span class="s">\u0413\u043e\u043b\u043e\u0433\u0440\u0430\u0444\u0438\u044f \u0438 \u043b\u0443\u0447\u0448\u0435: '+String(+top.toFixed(1)).replace('.',',')+'%</span>'+
      '<span class="act" style="justify-content:space-between"><span class="num" style="display:grid;line-height:1.2;white-space:nowrap;font:700 15px var(--f-ui)">'+fmtN(t.price)+' \u043c\u043e\u043d\u0435\u0442<span style="font:500 12px var(--f-ui);opacity:.8">\u0438\u043b\u0438 '+keyN(t.keys)+'</span></span><span class="pill on-card" style="padding:0 10px" aria-label="\u0428\u0430\u043d\u0441\u044b">'+ic('info')+'</span></span></button>';
  }).join('')+'</div>';
}
function caseArt(i){
  const c=[['#d7dde4','#9aa4b0','#6b7684'],['#fff3b0','#ffc93d','#d98f00'],['#cfe8ff','#5fb0ff','#1d6fd6'],['#ffd0c8','#ff7a6b','#d12b1f'],['#fffbe0','#ffd84a','#b8860b']][i]||['#ddd','#aaa','#777'];
  return'<svg width="74" height="74" viewBox="0 0 24 24"><path d="M12 2.6 20.6 7 12 11.4 3.4 7Z" fill="'+c[0]+'"/><path d="M2.9 8.4 11.2 12.7V21.8L2.9 17.4Z" fill="'+c[1]+'"/><path d="M21.1 8.4 12.8 12.7V21.8L21.1 17.4Z" fill="'+c[2]+'"/><path d="M7.2 4.8 15.8 9.2v3.2l1.6-.8V8.4L8.8 4Z" fill="rgba(255,255,255,.55)"/>'+(i===4?'<path d="M12 13.2l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3Z" fill="#fff8d0"/>':'')+'</svg>';
}
const pctStr=p=>{const v=p*100;return(v>=10?v.toFixed(1):v>=1?v.toFixed(2):v>=.01?v.toFixed(3):v.toFixed(4)).replace('.',',')+'%'};
ACT.odds=el=>{
  const i=+el.dataset.t,t=TIERS[i];const mw=(t.mwc&&t.mwc[curC])||t.mw;const sum=mw.reduce((a,b)=>a+b,0);
  const rows=MATS.map((m,k)=>mw[k]>0?'<div class="li noic"><span class="matb" style="--mc:'+m.c+'">'+m.n+'</span><span class="lt"></span><span class="lv num">'+pctStr(mw[k]/sum)+'</span></div>':'').join('');
  const rp=curReg?L.regionPrice(curC,curReg,i):null;
  const wr=WEARS.map(w=>'<div class="li noic"><span class="lt">'+w.n+' <span class="muted">('+w.k+')</span></span><span class="lv num">'+w.w+'%</span></div>').join('');
  const fr=FONTS.map(f=>'<div class="li noic"><span class="lt">'+f.n+' \u0448\u0440\u0438\u0444\u0442 <span class="muted">\u00d7'+String(f.m).replace('.',',')+'</span></span><span class="lv num">'+f.w+'%</span></div>').join('');
  Sheet.open({title:'\u041a\u0435\u0439\u0441 \u00ab'+t.name+'\u00bb',lead:t.desc+'. \u0426\u0435\u043d\u0430 '+fmt(t.price)+' \u0438\u043b\u0438 '+keyN(t.keys)+(rp?' (\u0441 \u0440\u0435\u0433\u0438\u043e\u043d\u043e\u043c '+curReg+' \u2014 '+fmt(rp.price)+' \u0438\u043b\u0438 '+keyN(rp.keys)+')':'')+'. \u0428\u0430\u043d\u0441\u044b \u0434\u043b\u044f \u0441\u0442\u0440\u0430\u043d\u044b \u00ab'+CN_SHORT[curC]+'\u00bb.',body:
    '<div class="sec" style="margin-top:6px;font-size:18px">\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</div><div class="group">'+rows+'</div>'+
    '<div class="sec" style="font-size:18px">\u0418\u0437\u043d\u043e\u0441</div><div class="group">'+wr+'</div>'+
    '<div class="sec" style="font-size:18px">\u0428\u0440\u0438\u0444\u0442</div><div class="group">'+fr+'</div>'+
    '<p class="note">'+(t.k>1?'\u041a\u0435\u0439\u0441 \u0432\u044b\u0431\u0438\u0440\u0430\u0435\u0442 \u043b\u0443\u0447\u0448\u0435\u0435 \u0438\u0437 '+t.k+' \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u044b\u0445 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u0439 \u0446\u0438\u0444\u0440 \u0438 \u0431\u0443\u043a\u0432. ':'')+'\u041f\u0430\u0442\u0442\u0435\u0440\u043d \u2014 \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e\u0435 \u0447\u0438\u0441\u043b\u043e \u043e\u0442 0 \u0434\u043e 1000. \u0426\u0435\u043d\u0443 \u043d\u043e\u043c\u0435\u0440\u0430 \u0441\u0447\u0438\u0442\u0430\u044e\u0442 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u0435, \u0440\u0435\u0433\u0438\u043e\u043d, \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b, \u0438\u0437\u043d\u043e\u0441, \u0448\u0440\u0438\u0444\u0442 \u0438 \u043f\u0430\u0442\u0442\u0435\u0440\u043d. \u0412 \u0441\u0440\u0435\u0434\u043d\u0435\u043c \u0432\u044b\u043f\u0430\u0434\u0430\u0435\u0442 \u043d\u043e\u043c\u0435\u0440 \u0441 \u043e\u0446\u0435\u043d\u043a\u043e\u0439 \u043e\u043a\u043e\u043b\u043e 65% \u0446\u0435\u043d\u044b \u043a\u0435\u0439\u0441\u0430, \u0441\u043a\u0443\u043f\u0449\u0438\u043a \u043f\u043b\u0430\u0442\u0438\u0442 70% \u043e\u0446\u0435\u043d\u043a\u0438 \u2014 \u0432\u044b\u0433\u043e\u0434\u0430 \u0432 \u0440\u0435\u0434\u043a\u0438\u0445 \u043d\u043e\u043c\u0435\u0440\u0430\u0445 \u0438 \u043f\u0440\u043e\u0434\u0430\u0436\u0435 \u043d\u0430 \u0440\u044b\u043d\u043a\u0435.</p>'+
    '<div class="foot"><button class="btn pri wide" data-act="pickTier" data-t="'+i+'">\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u044d\u0442\u043e\u0442 \u043a\u0435\u0439\u0441</button></div>'});
};
ACT.pickTier=el=>{Sheet.close();curTier=+el.dataset.t;lsSet('nomera2_tier',curTier);renderOpener();renderTiers();Reel.remount();window.scrollTo({top:0,behavior:'smooth'})};
function renderCos(){
  const el=$('cs-cos');if(!el)return;
  const card=(kind)=>{
    const sk=kind==='skin';const C=sk?L.SKIN_CASE:L.STICKER_CASE;const fr=sk?S.free.sc:S.free.tc;const a=sk?'skinCase':'stickerCase';
    return'<div class="gc '+(sk?'g-purple':'g-pink')+'" style="width:min(80vw,310px);height:200px">'+
      (sk?'<span class="art" style="right:8px;top:14px"><canvas id="cs-skinart" width="150" height="92" style="width:150px;height:92px"></canvas></span>':'<span class="art" style="right:14px;top:16px;display:grid;grid-template-columns:repeat(2,40px);gap:4px">'+['crown','bolt','gem','flame'].map(k=>'<img src="'+Draw.stickerURL(k,80)+'" width="40" height="40" alt="">').join('')+'</span>')+
      '<span class="k">'+(sk?'\u041c\u0430\u0448\u0438\u043d\u044b \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0438':'\u0414\u043b\u044f \u043c\u0430\u0448\u0438\u043d\u044b \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430')+'</span><span class="t">'+(sk?'\u041a\u0435\u0439\u0441 \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438':'\u041a\u0435\u0439\u0441 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438')+'</span><span class="s">'+(sk?'\u0427\u0435\u0442\u044b\u0440\u0435 \u0440\u0435\u0434\u043a\u043e\u0441\u0442\u0438, \u043e\u0442 \u043e\u0431\u044b\u0447\u043d\u044b\u0445 \u0434\u043e \u044d\u043f\u0438\u0447\u0435\u0441\u043a\u0438\u0445':'\u0427\u0435\u0442\u044b\u0440\u0435 \u0440\u0435\u0434\u043a\u043e\u0441\u0442\u0438, \u0434\u043e \u043b\u0435\u0433\u0435\u043d\u0434\u0430\u0440\u043d\u043e\u0439')+'</span>'+
      '<span class="act" style="flex-wrap:wrap">'+(fr>0?'<button class="pill on-card" data-act="'+a+'" data-m="free">\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e \u00d7'+fr+'</button>':'<button class="pill on-card" data-act="'+a+'" data-m="coin">'+COIN(C.price)+'</button><button class="pill on-card" data-act="'+a+'" data-m="key">'+ic('key')+C.keys+'</button>')+'<button class="pill on-card" data-act="cosOdds" data-k="'+kind+'" style="background:transparent">\u0428\u0430\u043d\u0441\u044b</button></span></div>';
  };
  el.innerHTML=secH('\u0421\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438')+'<div class="shelf">'+card('skin')+card('sticker')+'</div>';
  const cv=$('cs-skinart');if(cv)Draw.preview(cv,'car',{skin:'car:sport',c1:'white',c2:'purple',wh:'chrome',kit:'spoiler'},{floor:false,k:.95});
}
ACT.cosOdds=el=>{
  const sk=el.dataset.k==='skin';const odds=sk?L.skinOdds():L.stickerOdds();const R=sk?L.SKIN_R:L.STK_R;const D=sk?SKINS:STICKERS;const C=sk?L.SKIN_CASE:L.STICKER_CASE;
  const ev=odds.reduce((s,o)=>s+o.p*D[o.v].v,0);
  Sheet.open({title:sk?'\u041a\u0435\u0439\u0441 \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438':'\u041a\u0435\u0439\u0441 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438',lead:'\u0426\u0435\u043d\u0430 '+fmt(C.price)+' \u0438\u043b\u0438 '+keyN(C.keys)+'. \u0421\u0440\u0435\u0434\u043d\u044f\u044f \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u044c \u0432\u044b\u043f\u0430\u0434\u0435\u043d\u0438\u044f '+fmt(Math.round(ev))+'.',body:
    '<div class="group">'+odds.sort((a,b)=>a.p-b.p||D[b.v].v-D[a.v].v).map(o=>{const d=D[o.v];return'<div class="li noic"><span class="lt"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+R[d.r].c+';margin-right:8px"></span>'+esc(d.n)+(sk?' <span class="muted">'+(o.v.startsWith('car')?'\u043c\u0430\u0448\u0438\u043d\u0430':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a')+'</span>':'')+'<br><span class="muted" style="font-size:13px">'+R[d.r].n+' \u00b7 \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u044c '+fmt(d.v)+'</span></span><span class="lv num">'+pctStr(o.p)+'</span></div>'}).join('')+'</div>'+
    '<p class="note">\u0421\u043a\u0443\u043f\u0449\u0438\u043a \u043f\u043b\u0430\u0442\u0438\u0442 70% \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u0438, \u043d\u0430 \u0440\u044b\u043d\u043a\u0435 \u0446\u0435\u043d\u0443 \u043d\u0430\u0437\u043d\u0430\u0447\u0430\u0435\u0442\u0435 \u0432\u044b.</p>'});
};
function renderMine(){
  const el=$('cs-mine');if(!el)return;
  const list=S.box.slice().sort((a,b)=>b.t-a.t).slice(0,12);
  const fp=S.free.p.map((n,i)=>n>0?'<span class="badge" style="background:var(--green);color:#fff">'+esc(TIERS[i].name)+' \u00d7'+n+'</span>':'').join('')+(S.free.sc?'<span class="badge" style="background:var(--purple);color:#fff">\u0421\u043a\u0438\u043d\u044b \u00d7'+S.free.sc+'</span>':'')+(S.free.tc?'<span class="badge" style="background:var(--pink);color:#fff">\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 \u00d7'+S.free.tc+'</span>':'');
  el.innerHTML=(fp?secH('\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0435 \u043a\u0435\u0439\u0441\u044b')+'<div class="pad" style="display:flex;gap:6px;flex-wrap:wrap">'+fp+'</div><p class="note">\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043a\u0435\u0439\u0441 \u0432\u044b\u0448\u0435 \u0438 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e\u00bb.</p>':'')+
    secH('\u041c\u043e\u0438 \u043d\u043e\u043c\u0435\u0440\u0430','inventory')+(list.length?'<div class="shelf">'+list.map(it=>'<button class="mat" data-act="insp" data-id="'+it.id+'" style="width:190px;display:grid;gap:8px;padding:12px;text-align:left;background:var(--card)">'+plateHTML(it)+'<span style="display:grid;gap:6px;justify-items:start;font:600 15px var(--f-ui)"><span style="white-space:nowrap">'+COIN(it.price)+'</span><span class="matb" style="'+mc(it)+';height:20px;font-size:11px">'+matOf(it).n+'</span></span></button>').join('')+'</div><p class="note">\u0412\u0441\u0435\u0433\u043e '+S.box.length+' \u0438\u0437 '+L.BOX_CAP+' \u043d\u0430 \u0441\u0443\u043c\u043c\u0443 '+fmt(L.worth(S))+'</p>':'<div class="empty">\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043d\u043e\u043c\u0435\u0440\u0430 \u0438\u0437 \u043a\u0435\u0439\u0441\u043e\u0432</div>');
}
RENDER.shopFeed=()=>{
  const el=$('cs-feed');if(!el)return;
  const f=(Net.feed||[]).slice(0,12);
  if(!f.length){el.innerHTML='';return}
  el.innerHTML=secH('\u0421\u0435\u0439\u0447\u0430\u0441 \u0432\u044b\u0431\u0438\u0432\u0430\u044e\u0442')+'<div class="rows">'+f.map(feedRow).join('')+'</div>';
  hydrateSkins(el);
};
function feedRow(x){
  let what='',vis='',val='';const p=x.cur==='gold'?x.p*50:x.p;
  if(x.k==='drop'||x.k==='up'){vis=plateHTML(x.it);what=(x.k==='up'?'\u0430\u043f\u0433\u0440\u0435\u0439\u0434, ':'')+matOf(x.it).n.toLowerCase();val=COIN(p)}
  else if(x.k==='sale'){if(x.kind==='plate'||!x.kind){vis=plateHTML(x.it||{pl:x.pl});what='\u043a\u0443\u043f\u0438\u043b \u0443 '+esc(x.s)}else{vis=x.kind==='sticker'?'<img src="'+Draw.stickerURL(x.it.v,64)+'" width="44" height="44" alt="">':'<canvas data-skin="'+esc(x.it.v)+'" style="width:52px;height:34px"></canvas>';what='\u043a\u0443\u043f\u0438\u043b '+(x.kind==='skin'?'\u0441\u043a\u0438\u043d':'\u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0443')+' \u0443 '+esc(x.s)}val=COIN(p)}
  else if(x.k==='run'){vis='<span class="ico" style="background:'+(x.g==='stunt'?'var(--blue)':'var(--orange)')+'">'+ic(x.g==='stunt'?'bike':'car')+'</span>';what='\u0440\u0435\u043a\u043e\u0440\u0434 \u0432 '+(x.g==='stunt'?'\u0421\u0442\u0430\u043d\u0442\u0435':'Rider');val=fmtN(x.sc)+' \u043e\u0447\u043a\u043e\u0432'}
  else if(x.k==='skin'||x.k==='sticker'){vis='<span class="ico" style="background:var(--purple)">'+ic(x.k==='skin'?'car':'sticker')+'</span>';what='\u0432\u044b\u0431\u0438\u043b '+(x.k==='skin'?'\u0441\u043a\u0438\u043d \u00ab'+esc((SKINS[x.v]||{}).n||'')+'\u00bb':'\u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0443 \u00ab'+esc((STICKERS[x.v]||{}).n||'')+'\u00bb')}
  const plateVis=x.k==='drop'||x.k==='up'||(x.k==='sale'&&(x.kind==='plate'||!x.kind));
  return'<button class="row" data-act="profile" data-uid="'+esc(x.u||'')+'">'+(plateVis?'<div style="width:104px;flex:none">'+vis+'</div>':vis.startsWith('<span')?vis:'<span class="ico" style="background:var(--card2)">'+vis+'</span>')+
    '<div class="mid"><div class="tt">'+esc(x.n||'\u0418\u0433\u0440\u043e\u043a')+'</div><div class="ss" style="white-space:nowrap">'+what+'</div><div class="ey">'+ago(x.t)+'</div></div><div class="end"><span class="val">'+val+'</span></div></button>';
}

/* ---------- \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u0441 \u043d\u043e\u043c\u0435\u0440\u043e\u043c ---------- */
const boxItem=el=>S.box.find(b=>b.id===+el.dataset.id);
ACT.insp=el=>{
  const it=boxItem(el);if(!it)return;
  const mounted=S.veh.car.plate===it.id?'car':S.veh.bike.plate===it.id?'bike':'';const shown=S.show.includes(it.id);
  inspect(it,{actions:
    '<div class="rowf"><button class="btn md" data-act="quick" data-id="'+it.id+'" data-close="1">\u0421\u043a\u0443\u043f\u0449\u0438\u043a\u0443 \u00b7 '+fmtN(L.buyback(it))+'</button><button class="btn md" data-act="sell" data-id="'+it.id+'" data-k="plate">\u041d\u0430 \u0440\u044b\u043d\u043e\u043a</button></div>'+
    '<div class="rowf"><button class="btn md" data-act="mount" data-id="'+it.id+'" data-v="car">'+ic('car')+(mounted==='car'?'\u0421\u043d\u044f\u0442\u044c':'\u041d\u0430 \u043c\u0430\u0448\u0438\u043d\u0443')+'</button><button class="btn md" data-act="mount" data-id="'+it.id+'" data-v="bike">'+ic('bike')+(mounted==='bike'?'\u0421\u043d\u044f\u0442\u044c':'\u041d\u0430 \u043f\u0438\u0442\u0431\u0430\u0439\u043a')+'</button></div>'+
    '<div class="rowf"><button class="btn md" data-act="showTog" data-id="'+it.id+'">'+ic('star')+(shown?'\u0423\u0431\u0440\u0430\u0442\u044c \u0441 \u0432\u0438\u0442\u0440\u0438\u043d\u044b':'\u041d\u0430 \u0432\u0438\u0442\u0440\u0438\u043d\u0443')+'</button><button class="btn md" data-act="upWith" data-id="'+it.id+'">'+ic('up')+'\u0410\u043f\u0433\u0440\u0435\u0439\u0434</button></div>'+
    '<button class="btn md wide" data-act="pin" data-id="'+it.id+'" data-close="1">'+ic('pin')+(it.pin?'\u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u044c':'\u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c, \u0447\u0442\u043e\u0431\u044b \u043d\u0435 \u043f\u0440\u043e\u0434\u0430\u0442\u044c \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e')+'</button>'});
};
ACT.pin=el=>{run('pin',{id:+el.dataset.id},{quiet:true});if(el.dataset.close)Sheet.close();Haptic.tap()};
ACT.quick=el=>{
  const it=boxItem(el);if(!it)return;
  if(it.pin){toast('\u041d\u043e\u043c\u0435\u0440 \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d. \u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0434\u0430\u0442\u044c','err');return}
  const pay=L.buyback(it);
  dealSheet({title:'\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443?',top:'<div class="pad" style="margin-bottom:10px">'+plateHTML(it)+'</div>',rows:[['\u041e\u0446\u0435\u043d\u043a\u0430',fmt(it.price)],['\u0421\u043a\u0443\u043f\u0449\u0438\u043a \u043f\u043b\u0430\u0442\u0438\u0442 70%','+'+fmt(pay),'var(--green)']],note:'\u041d\u0430 \u0440\u044b\u043d\u043a\u0435 \u043c\u043e\u0436\u043d\u043e \u0432\u044b\u0440\u0443\u0447\u0438\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435, \u043d\u043e \u043f\u0440\u0438\u0434\u0451\u0442\u0441\u044f \u0436\u0434\u0430\u0442\u044c \u043f\u043e\u043a\u0443\u043f\u0430\u0442\u0435\u043b\u044f.',ok:'\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u0437\u0430 '+fmt(pay),
    go:b=>run('quick',{id:it.id},{btn:b,key:'quick'+it.id,ok:()=>{Snd.coin();Sheet.close();if(lastDrop&&lastDrop.id===it.id)lastDrop=null}})});
};
ACT.mount=el=>{const id=+el.dataset.id,v=el.dataset.v;const cur=S.veh[v].plate===id;run('vset',{v,f:'plate',val:cur?0:id},{quiet:true,ok:()=>{toast(cur?'\u041d\u043e\u043c\u0435\u0440 \u0441\u043d\u044f\u0442':'\u041d\u043e\u043c\u0435\u0440 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d \u043d\u0430 '+(v==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a'));Sheet.close()}})};
ACT.showTog=el=>{const id=+el.dataset.id;let l=S.show.slice();if(l.includes(id))l=l.filter(x=>x!==id);else{if(l.length>=3){toast('\u041d\u0430 \u0432\u0438\u0442\u0440\u0438\u043d\u0435 \u0434\u043e \u0442\u0440\u0451\u0445 \u043d\u043e\u043c\u0435\u0440\u043e\u0432. \u0423\u0431\u0435\u0440\u0438\u0442\u0435 \u043e\u0434\u0438\u043d \u0432 \u00ab\u0410\u043a\u043a\u0430\u0443\u043d\u0442\u0435\u00bb','err');return}l.push(id)}run('showSet',{ids:l},{quiet:true,ok:()=>{toast(l.includes(id)?'\u041d\u043e\u043c\u0435\u0440 \u043d\u0430 \u0432\u0438\u0442\u0440\u0438\u043d\u0435 \u0432 \u043f\u0440\u043e\u0444\u0438\u043b\u0435':'\u0423\u0431\u0440\u0430\u043d \u0441 \u0432\u0438\u0442\u0440\u0438\u043d\u044b');Sheet.close()}})};
ACT.skinCase=el=>openCos('skinCase',el.dataset.m,el);
ACT.stickerCase=el=>openCos('stickerCase',el.dataset.m,el);
async function openCos(a,m,btn){
  const C=a==='skinCase'?L.SKIN_CASE:L.STICKER_CASE;
  if(m==='coin'&&S.bal<C.price){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+fmt(C.price-S.bal),'err');return}
  if(m==='key'&&S.keys<C.keys){toast('\u041d\u0443\u0436\u043d\u043e '+keyN(C.keys),'err');return}
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
  const sh=Sheet.open({title:'',body:'<div style="display:grid;justify-items:center;gap:10px;padding:10px var(--g) 0;text-align:center"><div id="cos-spin" style="height:170px;display:grid;place-items:center"></div><div id="cos-res" style="opacity:0;transition:opacity .4s;display:grid;gap:8px;justify-items:center"><span class="matb" style="--mc:'+lk.r.c+'">'+lk.r.n+'</span><div style="font:700 26px var(--f-ui)">'+esc(lk.n)+'</div><div class="muted">'+(lk.kind==='sticker'?'\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430':lk.kind==='car'?'\u0421\u043a\u0438\u043d \u043c\u0430\u0448\u0438\u043d\u044b':'\u0421\u043a\u0438\u043d \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430')+' \u00b7 \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u044c '+fmt(lk.v)+'</div></div></div>'+
    '<div class="foot" id="cos-acts" style="opacity:0;transition:opacity .4s">'+(lk.kind==='sticker'?'<button class="btn pri wide" data-act="garage" data-v="car">\u041d\u0430\u043a\u043b\u0435\u0438\u0442\u044c \u0432 \u0433\u0430\u0440\u0430\u0436\u0435</button>':'<button class="btn pri wide" data-act="equip" data-id="'+x.id+'">\u041f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 '+(lk.kind==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a')+'</button>')+'<button class="btn wide" data-act="sheetx">\u0413\u043e\u0442\u043e\u0432\u043e</button></div>'});
  const box=sh.querySelector('#cos-spin');
  const pool=lk.kind==='sticker'?Object.keys(STICKERS):Object.keys(SKINS).filter(k=>k.startsWith(lk.kind)&&!SKINS[k].free&&!SKINS[k].season);
  let n=0;const steps=14;
  const show=v=>{box.innerHTML=lk.kind==='sticker'?'<img src="'+Draw.stickerURL(v,256)+'" width="150" height="150" alt="">':'<canvas width="260" height="160" style="width:260px;height:160px"></canvas>';const cv=box.querySelector('canvas');if(cv){const V=S.veh[lk.kind];Draw.preview(cv,lk.kind,{skin:v,c1:V.c1,c2:V.c2,wh:V.wh})}};
  const tick=()=>{if(!document.body.contains(box))return;n++;if(n>=steps){show(x.v);box.classList.add('popin');sh.querySelector('#cos-res').style.opacity=1;sh.querySelector('#cos-acts').style.opacity=1;Snd.win(lk.r===L.SKIN_R[3]||lk.r===L.STK_R[3]?4:2);Haptic.ok();return}show(L.pick(pool));Snd.tick();Haptic.tick();setTimeout(tick,50+n*n*2.2)};
  tick();
}
ACT.equip=el=>{const x=S.inv.find(i=>i.id===+el.dataset.id);if(!x)return;const v=x.v.startsWith('car')?'car':'bike';run('vset',{v,f:'skin',val:x.v},{quiet:true,ok:()=>{Sheet.close();toast('\u0421\u043a\u0438\u043d \u00ab'+SKINS[x.v].n+'\u00bb \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d')}})};

/* ================= \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c: \u043d\u043e\u043c\u0435\u0440\u0430, \u0441\u043a\u0438\u043d\u044b, \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 ================= */
let invT=lsGet('nomera21_invt')||'plate';if(!['plate','skin','sticker'].includes(invT))invT='plate';
let pF={c:'all',m:-1,sort:'price'},sF='all';
ACT.inventory=el=>{if(el&&el.dataset&&el.dataset.t)invT=el.dataset.t;Sheet.close();if(Page.is('inv'))return Page.renderTop();Page.push('inv','\u0418\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c',renderInv)};
ACT.plates=()=>{invT='plate';ACT.inventory()};
function renderInv(el){
  const nS=S.inv.filter(x=>x.k==='skin').length,nT=S.inv.length-nS;
  let body='';
  if(invT==='plate')body=invPlates();else if(invT==='skin')body=invSkins();else body=invStickers();
  el.innerHTML='<p class="lead">\u041d\u043e\u043c\u0435\u0440\u0430: '+S.box.length+' \u0438\u0437 '+L.BOX_CAP+' \u043d\u0430 '+fmt(L.worth(S))+' \u00b7 \u0441\u043a\u0438\u043d\u044b \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438: '+S.inv.length+' \u0438\u0437 '+L.INV_CAP+'</p>'+
    '<div class="pad" style="margin-bottom:10px"><div class="segbox big">'+[['plate','\u041d\u043e\u043c\u0435\u0440\u0430',S.box.length],['skin','\u0421\u043a\u0438\u043d\u044b',nS],['sticker','\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0438',nT]].map(s=>'<button class="'+(invT===s[0]?'on':'')+'" data-act="invTab" data-t="'+s[0]+'">'+s[1]+' <span class="muted">'+s[2]+'</span></button>').join('')+'</div></div>'+body;
  hydrateSkins(el);
}
ACT.invTab=el=>{invT=el.dataset.t;lsSet('nomera21_invt',invT);Haptic.tick();Page.renderTop()};
function invPlates(){
  let list=S.box.slice();
  if(pF.c!=='all')list=list.filter(x=>x.pl.c===pF.c);
  if(pF.m>=0)list=list.filter(x=>x.m===pF.m);
  const so={price:(a,b)=>b.price-a.price,cheap:(a,b)=>a.price-b.price,new:(a,b)=>b.t-a.t,float:(a,b)=>a.f-b.f}[pF.sort];list.sort(so);
  const cs=['all'].concat(COUNTRIES.concat(['sp']).filter(c=>S.box.some(x=>x.pl.c===c)));
  return'<div class="seg">'+cs.map(c=>'<button class="'+(pF.c===c?'on':'')+'" data-act="pfc" data-c="'+c+'">'+(c==='all'?'\u0412\u0441\u0435':c==='sp'?'\u041e\u0441\u043e\u0431\u044b\u0435':CN_SHORT[c])+'</button>').join('')+'</div>'+
    '<div class="seg"><button class="'+(pF.m<0?'on':'')+'" data-act="pfm" data-m="-1">\u041b\u044e\u0431\u043e\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</button>'+MATS.map((m,i)=>'<button class="'+(pF.m===i?'on':'')+'" data-act="pfm" data-m="'+i+'">'+m.n+'</button>').join('')+'</div>'+
    '<div class="pad" style="margin:8px 0 12px"><div class="segbox">'+[['price','\u0414\u043e\u0440\u043e\u0436\u0435'],['cheap','\u0414\u0435\u0448\u0435\u0432\u043b\u0435'],['new','\u041d\u043e\u0432\u044b\u0435'],['float','\u041c\u0435\u043d\u044c\u0448\u0435 \u0438\u0437\u043d\u043e\u0441']].map(s=>'<button class="'+(pF.sort===s[0]?'on':'')+'" data-act="pfs" data-s="'+s[0]+'">'+s[1]+'</button>').join('')+'</div></div>'+
    (list.length?'<div class="grid2">'+list.map(it=>{
      const on=L.plateLocked(S,it.id),sh=S.show.includes(it.id);
      return'<button class="mat" data-act="insp" data-id="'+it.id+'" style="display:grid;gap:8px;padding:12px;text-align:left;background:var(--card);position:relative">'+plateHTML(it)+
      '<span style="display:flex;justify-content:space-between;align-items:center;gap:6px"><span style="font:600 15px var(--f-ui)">'+COIN(it.price)+'</span><span style="display:flex;gap:4px;color:var(--accent)">'+(it.pin?'<span style="width:16px;height:16px">'+ic('pin')+'</span>':'')+(sh?'<span style="width:16px;height:16px;color:var(--yellow)">'+ic('star')+'</span>':'')+'</span></span>'+
      '<span style="display:flex;gap:4px;flex-wrap:wrap"><span class="matb" style="'+mc(it)+';height:20px;font-size:11px">'+matOf(it).n+'</span><span class="badge" style="height:20px;font-size:11px">'+appraise(it).wear.k+'</span>'+(on?'<span class="badge" style="height:20px;font-size:11px;background:var(--blue);color:#fff">\u043d\u0430 \u043c\u0430\u0448\u0438\u043d\u0435</span>':'')+'</span></button>'}).join('')+'</div>':'<div class="empty">\u041d\u0435\u0442 \u043d\u043e\u043c\u0435\u0440\u043e\u0432 \u0441 \u0442\u0430\u043a\u0438\u043c\u0438 \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u043c\u0438<button class="pill" data-act="tab" data-id="shop">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0435\u0439\u0441</button></div>')+
    '<div class="sec">\u0421\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443</div><div class="group">'+
      '<button class="li" data-act="bulk" data-k="paper"><span class="lic" style="background:var(--card3)">'+ic('trash')+'</span><span class="lt">\u0412\u0441\u0435 \u0431\u0443\u043c\u0430\u0436\u043d\u044b\u0435</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="bulk" data-k="cheap"><span class="lic" style="background:var(--orange)">'+ic('tag')+'</span><span class="lt">\u0414\u0435\u0448\u0435\u0432\u043b\u0435 1 000 \u043c\u043e\u043d\u0435\u0442</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="bulk" data-k="all"><span class="lic" style="background:var(--red)">'+ic('trash')+'</span><span class="lt">\u0412\u0441\u0435 \u043d\u0435\u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d\u043d\u044b\u0435</span>'+ic('chev','chev')+'</button></div>'+
    '<p class="note">\u0417\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d\u043d\u044b\u0435 \u0438 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044b\u0435 \u043d\u0430 \u043c\u0430\u0448\u0438\u043d\u0443 \u043d\u043e\u043c\u0435\u0440\u0430 \u043d\u0435 \u043f\u0440\u043e\u0434\u0430\u044e\u0442\u0441\u044f. \u0421\u043a\u0443\u043f\u0449\u0438\u043a \u043f\u043b\u0430\u0442\u0438\u0442 '+Math.round(L.BUYBACK*100)+'% \u043e\u0446\u0435\u043d\u043a\u0438.</p>';
}
ACT.pfc=el=>{pF.c=el.dataset.c;Page.renderTop()};
ACT.pfm=el=>{pF.m=+el.dataset.m;Page.renderTop()};
ACT.pfs=el=>{pF.sort=el.dataset.s;Page.renderTop()};
ACT.bulk=el=>{
  const k=el.dataset.k;const l=S.box.filter(x=>!x.pin&&!L.plateLocked(S,x.id)&&(k==='all'||(k==='paper'?x.m===0:x.price<1000)));
  if(!l.length){toast('\u041d\u0435\u0447\u0435\u0433\u043e \u0441\u0434\u0430\u0432\u0430\u0442\u044c');return}
  const sum=l.reduce((s,x)=>s+L.buyback(x),0),val=l.reduce((s,x)=>s+x.price,0);
  dealSheet({title:'\u0421\u0434\u0430\u0442\u044c '+l.length+' \u0448\u0442.?',rows:[['\u041d\u043e\u043c\u0435\u0440\u043e\u0432',String(l.length)],['\u041e\u0446\u0435\u043d\u043a\u0430',fmt(val)],['\u0421\u043a\u0443\u043f\u0449\u0438\u043a \u0437\u0430\u043f\u043b\u0430\u0442\u0438\u0442','+'+fmt(sum),'var(--green)']],ok:'\u0421\u0434\u0430\u0442\u044c \u0437\u0430 '+fmt(sum),go:b=>run('bulk',{k},{btn:b,ok:()=>{Snd.coin();Sheet.close()}})});
};
function invSkins(){
  let list=S.inv.filter(x=>x.k==='skin');if(sF!=='all')list=list.filter(x=>x.v.startsWith(sF));
  list.sort((a,b)=>invLook(b).v-invLook(a).v||b.t-a.t);
  return'<div class="seg">'+[['all','\u0412\u0441\u0435'],['car','\u041c\u0430\u0448\u0438\u043d\u044b'],['bike','\u041f\u0438\u0442\u0431\u0430\u0439\u043a\u0438']].map(s=>'<button class="'+(sF===s[0]?'on':'')+'" data-act="invf" data-f="'+s[0]+'">'+s[1]+'</button>').join('')+'</div><div style="height:10px"></div>'+
    (list.length?'<div class="grid2">'+list.map(invCard).join('')+'</div>':'<div class="empty">\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043a\u0435\u0439\u0441 \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438<button class="pill" data-act="tab" data-id="shop">\u0412 \u043c\u0430\u0433\u0430\u0437\u0438\u043d</button></div>');
}
function invStickers(){
  const list=S.inv.filter(x=>x.k==='sticker').sort((a,b)=>invLook(b).v-invLook(a).v||b.t-a.t);
  return list.length?'<div class="grid2">'+list.map(invCard).join('')+'</div>':'<div class="empty">\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043a\u0435\u0439\u0441 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438<button class="pill" data-act="tab" data-id="shop">\u0412 \u043c\u0430\u0433\u0430\u0437\u0438\u043d</button></div>';
}
function invCard(x){
  const lk=invLook(x);const on=x.k==='skin'?(S.veh.car.skin===x.v||S.veh.bike.skin===x.v):(S.veh.car.st.includes(x.id)||S.veh.bike.st.includes(x.id));
  return'<button class="mat" data-act="invItem" data-id="'+x.id+'" style="display:grid;gap:6px;justify-items:center;padding:12px;background:var(--card);position:relative"><span style="position:absolute;left:12px;right:12px;top:8px;height:3px;border-radius:3px;background:'+lk.r.c+'"></span>'+invPreview(x,140,80)+'<span style="font:600 15px var(--f-ui)">'+esc(lk.n)+'</span><span class="muted" style="font-size:12px">'+lk.r.n+' \u00b7 '+fmtN(lk.v)+'</span>'+(on?'<span class="badge" style="background:var(--blue);color:#fff">'+(x.k==='skin'?'\u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d':'\u043d\u0430\u043a\u043b\u0435\u0435\u043d\u0430')+'</span>':'')+'</button>';
}
ACT.invf=el=>{sF=el.dataset.f;Page.renderTop()};
ACT.invItem=el=>{
  const x=S.inv.find(i=>i.id===+el.dataset.id);if(!x)return;const lk=invLook(x);
  const kind=x.k;const on=kind==='skin'&&(S.veh.car.skin===x.v||S.veh.bike.skin===x.v);const locked=L.skinLocked(S,x);
  Sheet.open({title:lk.n,lead:lk.r.n+' \u00b7 '+(lk.kind==='sticker'?'\u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430':lk.kind==='car'?'\u0441\u043a\u0438\u043d \u043c\u0430\u0448\u0438\u043d\u044b':'\u0441\u043a\u0438\u043d \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430')+' \u00b7 \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u044c '+fmt(lk.v),body:
    '<div style="display:grid;place-items:center;padding:6px 0 10px">'+invPreview(x,280,160)+'</div>'+
    (locked?'<p class="note" style="text-align:center;margin-top:0">\u0421\u043a\u0438\u043d \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d. \u0427\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0434\u0430\u0442\u044c \u0438\u043b\u0438 \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0432 \u0430\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440, \u043f\u043e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u043d\u0430 \u043c\u0430\u0448\u0438\u043d\u0443 \u0434\u0440\u0443\u0433\u043e\u0439.</p>':'')+
    '<div class="foot">'+(kind==='skin'?'<button class="btn pri wide'+(on?' off':'')+'" data-act="equip" data-id="'+x.id+'">'+(on?'\u0423\u0436\u0435 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d':'\u041f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 '+(lk.kind==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a'))+'</button>':'<button class="btn pri wide" data-act="garage" data-v="car">\u041d\u0430\u043a\u043b\u0435\u0438\u0442\u044c \u0432 \u0433\u0430\u0440\u0430\u0436\u0435</button>')+
    '<div class="rowf"><button class="btn md'+(locked?' off':'')+'" data-act="sell" data-id="'+x.id+'" data-k="'+kind+'">\u041d\u0430 \u0440\u044b\u043d\u043e\u043a</button><button class="btn md'+(locked?' off':'')+'" data-act="sellInv" data-id="'+x.id+'">\u0421\u043a\u0443\u043f\u0449\u0438\u043a\u0443 \u00b7 '+fmtN(L.invBuyback(x))+'</button></div>'+(kind==='skin'?'<button class="btn md wide'+(locked?' off':'')+'" data-act="upFrom" data-k="inv" data-id="'+x.id+'">'+ic('up')+'\u0410\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440</button>':'')+'</div>'});
  hydrateSkins(Sheet.cur.el);
};
ACT.sellInv=el=>{
  const x=S.inv.find(i=>i.id===+el.dataset.id);if(!x)return;const pay=L.invBuyback(x);
  dealSheet({title:'\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443?',rows:[['\u041f\u0440\u0435\u0434\u043c\u0435\u0442',esc(invLook(x).n)],['\u0426\u0435\u043d\u043d\u043e\u0441\u0442\u044c',fmt(invLook(x).v)],['\u0421\u043a\u0443\u043f\u0449\u0438\u043a \u043f\u043b\u0430\u0442\u0438\u0442 70%','+'+fmt(pay),'var(--green)']],ok:'\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u0437\u0430 '+fmt(pay),go:b=>run('sellInv',{id:x.id},{btn:b,ok:()=>{Snd.coin();Sheet.close()}})});
};

/* ================= \u0440\u044b\u043d\u043e\u043a \u0432 \u0441\u0442\u0438\u043b\u0435 Standoff 2: \u0420\u044b\u043d\u043e\u043a \u00b7 \u041c\u043e\u0438 \u0437\u0430\u043f\u0440\u043e\u0441\u044b \u00b7 \u0418\u0441\u0442\u043e\u0440\u0438\u044f ================= */
let mk={tab:'market',kind:'all',c:'all',m:-1,w:4,sort:'new',q:'',mine:'sell',hist:'sold'};
const MK_SORT=[['new','\u041d\u043e\u0432\u044b\u0435'],['cheap','\u0414\u0435\u0448\u0435\u0432\u043b\u0435'],['exp','\u0414\u043e\u0440\u043e\u0436\u0435'],['deal','\u0412\u044b\u0433\u043e\u0434\u043d\u0435\u0435 \u043e\u0446\u0435\u043d\u043a\u0438'],['float','\u041c\u0435\u043d\u044c\u0448\u0435 \u0438\u0437\u043d\u043e\u0441']];
let histCache={t:0,list:null};
function renderMarketIn(root){
  if(!root)return;
  const myL=Net.open.filter(l=>l.seller===Net.me.uid).length,myO=Net.orders.filter(o=>o.uid===Net.me.uid).length;
  const tabs=[['market','\u0420\u044b\u043d\u043e\u043a'],['mine','\u041c\u043e\u0438 \u0437\u0430\u043f\u0440\u043e\u0441\u044b'+(myL+myO?' \u00b7 '+(myL+myO):'')],['hist','\u0418\u0441\u0442\u043e\u0440\u0438\u044f']];
  let body='';
  if(mk.tab==='market')body=mkList();else if(mk.tab==='mine')body=mkMine();else body=mkHist();
  root.innerHTML='<div class="subtabs pad">'+tabs.map(t=>'<button class="'+(mk.tab===t[0]?'on':'')+'" data-act="mkTab" data-t="'+t[0]+'">'+t[1]+'</button>').join('')+'</div>'+body;
  hydrateSkins(root);hydrateAvas(root);
  if(mk.tab==='hist'&&(!histCache.list||now()-histCache.t>30000))loadHist();
}
const rerenderMk=()=>{if(Tabs.cur==='shop'&&shopSeg==='market'&&!Page.stack.length)renderMarketIn($('sh-market'));else Page.renderTop()};
ACT.mkTab=el=>{mk.tab=el.dataset.t;Haptic.tick();rerenderMk()};
function mkFilters(){let n=0;if(mk.c!=='all')n++;if(mk.m>=0)n++;if(mk.w<4)n++;return n}
function lotVis(l,w,h){
  if(l.kind==='plate')return'<div class="lv-pl">'+plateHTML(l.it)+'</div>';
  if(l.kind==='sticker')return'<img src="'+Draw.stickerURL(l.it.v,128)+'" width="'+h+'" height="'+h+'" alt="">';
  return'<canvas data-skin="'+esc(l.it.v)+'" style="width:'+w+'px;height:'+h+'px"></canvas>';
}
function lotName(l){return l.kind==='plate'?plateText(l.it.pl):l.kind==='skin'?SKINS[l.it.v].n:STICKERS[l.it.v].n}
function lotSub(l){
  if(l.kind==='plate'){const a=appraise(l.it);return matOf(l.it).n+' \u00b7 '+a.wear.k}
  return l.kind==='skin'?L.SKIN_R[SKINS[l.it.v].r].n+' \u0441\u043a\u0438\u043d':L.STK_R[STICKERS[l.it.v].r].n+' \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430';
}
function lotValue(l){return l.kind==='plate'?appraise(l.it).price:(l.kind==='skin'?SKINS[l.it.v].v:STICKERS[l.it.v].v)}
function mkList(){
  let l=Net.open.slice();
  if(mk.kind!=='all')l=l.filter(x=>x.kind===mk.kind);
  if(mk.kind==='plate'||mk.kind==='all'){
    if(mk.c!=='all')l=l.filter(x=>x.kind!=='plate'||x.c===mk.c);
    if(mk.m>=0)l=l.filter(x=>x.kind!=='plate'||x.m===mk.m);
    if(mk.w<4)l=l.filter(x=>x.kind!=='plate'||x.f<WEARS[mk.w].max);
  }
  if(mk.q){const q=L.toLat(mk.q),ql=mk.q.toLowerCase();l=l.filter(x=>x.kind==='plate'?(L.toLat(plateText(x.it.pl)).includes(q)||String(x.pt)===mk.q):lotName(x).toLowerCase().includes(ql))}
  const so={cheap:(a,b)=>a.ask-b.ask,exp:(a,b)=>b.ask-a.ask,new:(a,b)=>b.t-a.t,float:(a,b)=>(a.kind==='plate'?a.f:2)-(b.kind==='plate'?b.f:2),deal:(a,b)=>a.ask/Math.max(1,lotValue(a))-b.ask/Math.max(1,lotValue(b))}[mk.sort];l.sort(so);
  const nf=mkFilters();
  return'<div class="pad mk-tools"><input class="inp" placeholder="\u041f\u043e\u0438\u0441\u043a: \u043d\u043e\u043c\u0435\u0440, \u0441\u043a\u0438\u043d, \u043f\u0430\u0442\u0442\u0435\u0440\u043d" value="'+esc(mk.q)+'" data-on="mkq"><button class="btn md'+(nf?' blue':'')+'" data-act="mkFilter">'+ic('filter')+(nf?nf:'')+'</button></div>'+
    '<div class="seg">'+[['all','\u0412\u0441\u0451'],['plate','\u041d\u043e\u043c\u0435\u0440\u0430'],['skin','\u0421\u043a\u0438\u043d\u044b'],['sticker','\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0438']].map(s=>'<button class="'+(mk.kind===s[0]?'on':'')+'" data-act="mkKind" data-k="'+s[0]+'">'+s[1]+'</button>').join('')+
      '<button data-act="mkSort" style="margin-left:auto">'+ic('chev','chev')+esc(MK_SORT.find(s=>s[0]===mk.sort)[1])+'</button></div>'+
    (l.length?'<div class="lots">'+l.slice(0,150).map(x=>{
      const val=lotValue(x);const d=val?Math.round((x.ask/val-1)*100):0;const mine=x.seller===Net.me.uid;
      return'<button class="lot" data-act="lot" data-id="'+esc(x.id)+'" style="'+(x.kind==='plate'?mc(x.it):'--mc:'+(x.kind==='skin'?L.SKIN_R[SKINS[x.it.v].r].c:L.STK_R[STICKERS[x.it.v].r].c))+'"><span class="lv-bar"></span><span class="lv-vis">'+lotVis(x,120,64)+'</span>'+
        '<span class="lv-n">'+esc(lotName(x))+'</span><span class="lv-s">'+esc(lotSub(x))+'</span>'+
        '<span class="lv-p">'+COIN(x.ask)+(d<=-5?'<span class="deal">\u2212'+Math.abs(d)+'%</span>':'')+'</span>'+
        '<span class="lv-u">'+(mine?'\u0412\u0430\u0448 \u043b\u043e\u0442':esc(x.nick))+admBadge(x.adm?'admin':'')+'</span></button>'}).join('')+'</div>'+(l.length>150?'<p class="note">\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u044b \u043f\u0435\u0440\u0432\u044b\u0435 150. \u0423\u0442\u043e\u0447\u043d\u0438\u0442\u0435 \u043f\u043e\u0438\u0441\u043a \u0438\u043b\u0438 \u0444\u0438\u043b\u044c\u0442\u0440.</p>':''):
      '<div class="empty">\u041b\u043e\u0442\u043e\u0432 \u0441 \u0442\u0430\u043a\u0438\u043c\u0438 \u0443\u0441\u043b\u043e\u0432\u0438\u044f\u043c\u0438 \u043d\u0435\u0442<button class="pill" data-act="newOrder" data-k="'+(mk.kind==='all'?'plate':mk.kind)+'">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u043f\u043e\u043a\u0443\u043f\u043a\u0443</button></div>')+
    '<p class="note">\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u043c\u043e\u0436\u043d\u043e \u0438\u0437 \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044f. \u041a\u043e\u043c\u0438\u0441\u0441\u0438\u044f \u0440\u044b\u043d\u043a\u0430 '+Math.round(L.FEE*100)+'% \u043f\u043b\u0430\u0442\u0438\u0442 \u043f\u0440\u043e\u0434\u0430\u0432\u0435\u0446.</p>';
}
ACT.mkKind=el=>{mk.kind=el.dataset.k;Haptic.tick();rerenderMk()};
ACT.mkSort=()=>Sheet.open({title:'\u0421\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0430',body:'<div class="group">'+MK_SORT.map(s=>'<button class="li noic" data-act="mkSortSet" data-s="'+s[0]+'"><span class="lt">'+s[1]+'</span>'+(mk.sort===s[0]?'<span style="width:20px;height:20px;color:var(--accent)">'+ic('check')+'</span>':'')+'</button>').join('')+'</div>'});
ACT.mkSortSet=el=>{mk.sort=el.dataset.s;Sheet.close();rerenderMk()};
let mkqT=0;ON.mkq=el=>{clearTimeout(mkqT);mkqT=setTimeout(()=>{mk.q=el.value.trim();const ae=document.activeElement;const pos=ae&&ae.selectionStart;rerenderMk();const inp=qs('[data-on=mkq]');if(inp){inp.focus();try{inp.setSelectionRange(pos,pos)}catch(e){}}},350)};
ACT.mkFilter=()=>{
  Sheet.open({title:'\u0424\u0438\u043b\u044c\u0442\u0440',lead:'\u0414\u043b\u044f \u043d\u043e\u043c\u0435\u0440\u043e\u0432: \u0441\u0442\u0440\u0430\u043d\u0430, \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b \u0438 \u0438\u0437\u043d\u043e\u0441.',body:
    '<div class="field"><label>\u0421\u0442\u0440\u0430\u043d\u0430</label><select class="inp" data-on="mfC"><option value="all">\u041b\u044e\u0431\u0430\u044f</option>'+COUNTRIES.map(c=>'<option value="'+c+'"'+(mk.c===c?' selected':'')+'>'+CN_SHORT[c]+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</label><select class="inp" data-on="mfM"><option value="-1">\u041b\u044e\u0431\u043e\u0439</option>'+MATS.map((m,i)=>'<option value="'+i+'"'+(mk.m===i?' selected':'')+'>'+m.n+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>\u0418\u0437\u043d\u043e\u0441 \u043d\u0435 \u0445\u0443\u0436\u0435</label><select class="inp" data-on="mfW">'+WEARS.map((w,i)=>'<option value="'+i+'"'+(mk.w===i?' selected':'')+'>'+(i===4?'\u041b\u044e\u0431\u043e\u0439':w.n+' ('+w.k+')')+'</option>').join('')+'</select></div>'+
    '<div class="foot"><button class="btn pri wide" data-act="mfApply">\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c</button><button class="btn wide" data-act="mfReset">\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c</button></div>'});
};
let mf={};ON.mfCChange=el=>mf.c=el.value;ON.mfMChange=el=>mf.m=+el.value;ON.mfWChange=el=>mf.w=+el.value;
ACT.mfApply=()=>{Object.assign(mk,mf);mf={};if(mk.kind==='skin'||mk.kind==='sticker')mk.kind='plate';Sheet.close();rerenderMk()};
ACT.mfReset=()=>{mf={};mk.c='all';mk.m=-1;mk.w=4;Sheet.close();rerenderMk()};

/* ---------- \u043b\u043e\u0442: \u043e\u0441\u043c\u043e\u0442\u0440 \u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0430 \u0441 \u0438\u0442\u043e\u0433\u043e\u0432\u043e\u0439 \u0441\u0443\u043c\u043c\u043e\u0439 ---------- */
ACT.lot=el=>{
  const l=Net.open.find(x=>x.id===el.dataset.id);if(!l){toast('\u041b\u043e\u0442 \u0443\u0436\u0435 \u043f\u0440\u043e\u0434\u0430\u043d','err');return}
  const mine=l.seller===Net.me.uid;const val=lotValue(l);
  const actions='<div class="row" style="background:var(--fill3);min-height:0;margin:0"><div class="mid"><div class="tt">'+COIN(l.ask)+'</div><div class="ss">\u041f\u0440\u043e\u0434\u0430\u0432\u0435\u0446 '+esc(l.nick)+(l.snum?' \u00b7 ID '+pad8(l.snum):'')+' \u00b7 \u043e\u0446\u0435\u043d\u043a\u0430 '+fmt(val)+'</div></div></div>'+
    (mine?'<button class="btn wide" data-act="cancelLot" data-id="'+esc(l.id)+'">\u0421\u043d\u044f\u0442\u044c \u0441 \u043f\u0440\u043e\u0434\u0430\u0436\u0438</button>':'<button class="btn pri wide" data-act="buyLot" data-id="'+esc(l.id)+'">\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+fmt(l.ask)+'</button>')+
    '<button class="btn md wide" data-act="profile" data-uid="'+esc(l.seller)+'">\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u043f\u0440\u043e\u0434\u0430\u0432\u0446\u0430</button>'+
    (Net.me.role&&!mine?'<button class="btn md wide danger" data-act="admMod" data-id="'+esc(l.id)+'">\u0421\u043d\u044f\u0442\u044c \u043a\u0430\u043a \u043c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440</button>':'');
  if(l.kind==='plate'){inspect(Object.assign({},l.it),{title:plateText(l.it.pl),actions});return}
  const d=(l.kind==='skin'?SKINS:STICKERS)[l.it.v];
  const sh=Sheet.open({title:d.n,lead:lotSub(l)+' \u00b7 \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u044c '+fmt(d.v),body:'<div style="display:grid;place-items:center">'+invPreview({v:l.it.v,k:l.kind},260,140)+'</div><div class="sec" style="font-size:18px;margin-top:10px">\u0426\u0435\u043d\u0430 \u0437\u0430 30 \u0434\u043d\u0435\u0439</div><div class="card p" id="chart">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div><div class="foot">'+actions+'</div>'});
  hydrateSkins(sh);salesOf(l.it.v).then(s=>{const c=sh.querySelector('#chart');if(c)c.innerHTML=chartHTML(s,d.v)});
};
ACT.buyLot=el=>{
  const l=Net.open.find(x=>x.id===el.dataset.id);if(!l)return toast('\u041b\u043e\u0442 \u0443\u0436\u0435 \u043f\u0440\u043e\u0434\u0430\u043d','err');
  if(S.bal<l.ask){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+fmt(l.ask-S.bal),'err');return}
  dealSheet({title:'\u041f\u043e\u043a\u0443\u043f\u043a\u0430',lead:esc(lotName(l))+' \u0443 '+esc(l.nick),top:l.kind==='plate'?'<div class="pad" style="margin-bottom:10px">'+plateHTML(l.it)+'</div>':'',
    rows:[['\u0426\u0435\u043d\u0430 \u043b\u043e\u0442\u0430',fmt(l.ask)],['\u041a\u043e\u043c\u0438\u0441\u0441\u0438\u044f \u0434\u043b\u044f \u043f\u043e\u043a\u0443\u043f\u0430\u0442\u0435\u043b\u044f','\u043d\u0435\u0442'],['\u0418\u0442\u043e\u0433\u043e \u043a \u043e\u043f\u043b\u0430\u0442\u0435',fmt(l.ask),'var(--red)'],['\u041e\u0441\u0442\u0430\u043d\u0435\u0442\u0441\u044f \u043d\u0430 \u0431\u0430\u043b\u0430\u043d\u0441\u0435',fmt(S.bal-l.ask)]],ok:'\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+fmt(l.ask),
    go:b=>run('buy',{lid:l.id,ask:l.ask},{btn:b,key:'buy'+l.id,ok:()=>{Snd.coin();Sheet.close();Net.open=Net.open.filter(x=>x.id!==l.id);histCache.t=0;loadPub('market')}})});
};
ACT.cancelLot=el=>run('cancel',{lid:el.dataset.id},{btn:el,ok:()=>{Sheet.close();Net.open=Net.open.filter(x=>x.id!==el.dataset.id);loadPub('market')}});
ACT.admMod=el=>run('adm.mod',{lid:el.dataset.id},{btn:el,ok:()=>{Sheet.close();loadPub('market')}});
function median(a){if(!a.length)return 0;const s=a.slice().sort((x,y)=>x-y);return s[Math.floor(s.length/2)]}
function chartHTML(sales,base){
  if(!sales.length)return'<div class="muted" style="font-size:14px">\u041f\u0440\u043e\u0434\u0430\u0436 \u043f\u043e\u043a\u0430 \u043d\u0435 \u0431\u044b\u043b\u043e. \u041e\u0440\u0438\u0435\u043d\u0442\u0438\u0440: '+fmt(base)+'</div>';
  const days={};sales.forEach(s=>{const d=Math.floor(s.t/864e5);(days[d]=days[d]||[]).push(s.price)});
  const keys=Object.keys(days).map(Number).sort((a,b)=>a-b);const pts=keys.map(d=>[d,median(days[d])]);
  const W=320,H=90;const x0=pts[0][0],x1=Math.max(x0+1,pts[pts.length-1][0]);const ys=pts.map(p=>p[1]);const y0=Math.min(...ys)*.9,y1=Math.max(...ys)*1.1||1;
  const P=pts.map(p=>[((p[0]-x0)/(x1-x0))*W,H-((p[1]-y0)/(y1-y0||1))*H]);
  const path=P.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const med=median(sales.filter(s=>s.t>now()-14*864e5).map(s=>s.price));
  return'<div style="display:flex;justify-content:space-between;font:600 15px var(--f-ui);margin-bottom:8px"><span>\u041c\u0435\u0434\u0438\u0430\u043d\u0430 14 \u0434\u043d\u0435\u0439</span><span class="num">'+(med?fmt(med):'\u2014')+'</span></div><svg viewBox="-4 -4 '+(W+8)+' '+(H+8)+'" style="width:100%;height:96px" preserveAspectRatio="none"><path d="'+path+' L'+W+' '+H+' L0 '+H+'Z" fill="rgba(10,132,255,.16)"/><path d="'+path+'" fill="none" stroke="var(--blue)" stroke-width="2.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg><div class="muted" style="font-size:12px;margin-top:4px">'+sales.length+' '+plural(sales.length,'\u043f\u0440\u043e\u0434\u0430\u0436\u0430','\u043f\u0440\u043e\u0434\u0430\u0436\u0438','\u043f\u0440\u043e\u0434\u0430\u0436')+' \u0437\u0430 30 \u0434\u043d\u0435\u0439</div>';
}

/* ---------- \u043c\u043e\u0438 \u0437\u0430\u043f\u0440\u043e\u0441\u044b: \u043f\u0440\u043e\u0434\u0430\u0436\u0430 \u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0430 ---------- */
function orderTitle(o){if(o.kind!=='plate')return(o.kind==='skin'?'\u0421\u043a\u0438\u043d':'\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430')+' \u00ab'+(((o.kind==='skin'?SKINS:STICKERS)[o.key])||{}).n+'\u00bb';const sp=o.spec||{};return(sp.c==='*'?'\u041b\u044e\u0431\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0430':CN_SHORT[sp.c])+', '+MATS[sp.m].n.toLowerCase()+(sp.w<4?', \u0434\u043e '+WEARS[sp.w].k:'')}
function mkMine(){
  const myL=Net.open.filter(x=>x.seller===Net.me.uid),myO=Net.orders.filter(o=>o.uid===Net.me.uid);
  let b='<div class="pad" style="margin:4px 0 12px"><div class="segbox"><button class="'+(mk.mine==='sell'?'on':'')+'" data-act="mkMine" data-s="sell">\u0417\u0430\u043f\u0440\u043e\u0441\u044b \u043d\u0430 \u043f\u0440\u043e\u0434\u0430\u0436\u0443 \u00b7 '+myL.length+'</button><button class="'+(mk.mine==='buy'?'on':'')+'" data-act="mkMine" data-s="buy">\u041d\u0430 \u043f\u043e\u043a\u0443\u043f\u043a\u0443 \u00b7 '+myO.length+'</button></div></div>';
  if(mk.mine==='sell'){
    b+='<p class="note" style="margin:0 var(--g) 10px">'+myL.length+' \u0438\u0437 '+L.MAX_LIST+' \u043b\u043e\u0442\u043e\u0432. \u041a\u043e\u043c\u0438\u0441\u0441\u0438\u044f '+Math.round(L.FEE*100)+'% \u0441\u043f\u0438\u0441\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u043e\u0434\u0438\u043d \u0440\u0430\u0437, \u043f\u0440\u0438 \u043f\u0440\u043e\u0434\u0430\u0436\u0435.</p>'+
      (myL.length?'<div class="rows">'+myL.map(x=>'<div class="row">'+(x.kind==='plate'?'<div style="width:110px;flex:none">'+plateHTML(x.it)+'</div>':'<span class="ico" style="background:var(--card2);width:76px">'+lotVis(x,76,52)+'</span>')+'<div class="mid"><div class="tt">'+COIN(x.ask)+'</div><div class="ss">'+ago(x.t)+' \u00b7 \u0432\u0430\u043c '+fmt(Math.floor(x.ask*(1-L.FEE)))+'</div></div><button class="pill" data-act="cancelLot" data-id="'+esc(x.id)+'">\u0421\u043d\u044f\u0442\u044c</button></div>').join('')+'</div>':
        '<div class="empty">\u0412\u044b \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043f\u0440\u043e\u0434\u0430\u0451\u0442\u0435<button class="pill" data-act="inventory">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c</button></div>');
  }else{
    const all=Net.orders.filter(o=>o.uid!==Net.me.uid).slice(0,30);
    const row=(o,own)=>'<div class="row"><span class="ico" style="background:'+(o.kind==='plate'?'var(--blue)':'var(--purple)')+'">'+ic(o.kind==='plate'?'tag':o.kind==='skin'?'car':'sticker')+'</span><div class="mid"><div class="tt" style="white-space:normal">'+esc(orderTitle(o))+'</div><div class="ss num">'+fmtN(o.price)+' \u00d7 '+o.qty+(own?' \u00b7 \u0437\u0430\u0440\u0435\u0437\u0435\u0440\u0432\u0438\u0440\u043e\u0432\u0430\u043d\u043e '+fmtN(o.price*o.qty):' \u00b7 '+esc(o.nick))+'</div></div>'+(own?'<button class="pill" data-act="cancelOrder" data-id="'+esc(o.id)+'">\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c</button>':'')+'</div>';
    b+='<div class="pad" style="margin-bottom:12px"><button class="btn pri wide" data-act="newOrder" data-k="plate">'+ic('plus')+'\u041d\u043e\u0432\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u043f\u043e\u043a\u0443\u043f\u043a\u0443</button></div>'+
      '<p class="note" style="margin:0 var(--g) 12px">\u0417\u0430\u043f\u0440\u043e\u0441 \u2014 \u043e\u0431\u0435\u0449\u0430\u043d\u0438\u0435 \u043a\u0443\u043f\u0438\u0442\u044c \u043f\u043e \u0432\u0430\u0448\u0435\u0439 \u0446\u0435\u043d\u0435. \u041c\u043e\u043d\u0435\u0442\u044b \u0440\u0435\u0437\u0435\u0440\u0432\u0438\u0440\u0443\u044e\u0442\u0441\u044f \u0441\u0440\u0430\u0437\u0443, \u0430 \u043f\u0440\u0435\u0434\u043c\u0435\u0442 \u043f\u0440\u0438\u0434\u0451\u0442, \u043a\u0430\u043a \u0442\u043e\u043b\u044c\u043a\u043e \u043a\u0442\u043e-\u0442\u043e \u043f\u0440\u043e\u0434\u0430\u0441\u0442 \u043f\u043e\u0434\u0445\u043e\u0434\u044f\u0449\u0438\u0439.</p>'+
      (myO.length?'<div class="rows">'+myO.map(o=>row(o,true)).join('')+'</div>':'<div class="empty">\u0417\u0430\u043f\u0440\u043e\u0441\u043e\u0432 \u043d\u0435\u0442</div>')+
      '<div class="sec">\u0417\u0430\u043f\u0440\u043e\u0441\u044b \u0438\u0433\u0440\u043e\u043a\u043e\u0432</div>'+(all.length?'<div class="rows">'+all.map(o=>row(o,false)).join('')+'</div>':'<div class="empty">\u041f\u043e\u043a\u0430 \u043d\u0438\u043a\u0442\u043e \u043d\u0435 \u043f\u043e\u043a\u0443\u043f\u0430\u0435\u0442</div>');
  }
  return b;
}
ACT.mkMine=el=>{mk.mine=el.dataset.s;rerenderMk()};
ACT.cancelOrder=el=>run('orderCancel',{id:el.dataset.id},{btn:el,ok:()=>loadPub('orders')});

/* ---------- \u0438\u0441\u0442\u043e\u0440\u0438\u044f \u0441\u0434\u0435\u043b\u043e\u043a ---------- */
async function loadHist(){try{histCache={t:now(),list:await salesHistory(Net.me.uid)};rerenderMk()}catch(e){}}
function mkHist(){
  const l=histCache.list;const sold=mk.hist==='sold';
  const seg='<div class="pad" style="margin:4px 0 12px"><div class="segbox"><button class="'+(sold?'on':'')+'" data-act="mkHist" data-s="sold">\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u043f\u0440\u043e\u0434\u0430\u0436</button><button class="'+(!sold?'on':'')+'" data-act="mkHist" data-s="bought">\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u043f\u043e\u043a\u0443\u043f\u043e\u043a</button></div></div>';
  if(!l)return seg+'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>';
  const list=l.filter(x=>sold?x.seller===Net.me.uid:x.buyer===Net.me.uid);
  if(!list.length)return seg+'<div class="empty">'+(sold?'\u041f\u0440\u043e\u0434\u0430\u0436 \u043f\u043e\u043a\u0430 \u043d\u0435 \u0431\u044b\u043b\u043e':'\u041f\u043e\u043a\u0443\u043f\u043e\u043a \u043f\u043e\u043a\u0430 \u043d\u0435 \u0431\u044b\u043b\u043e')+'</div>';
  return seg+'<div class="rows">'+list.map(x=>{
    const it=x.it||{};const vis=x.kind==='plate'&&it.pl?'<div style="width:104px;flex:none">'+plateHTML(it)+'</div>':'<span class="ico" style="background:var(--card2);width:64px">'+(it.v?lotVis({kind:x.kind,it},64,44):ic('tag'))+'</span>';
    const name=x.kind==='plate'&&it.pl?plateText(it.pl):it.v?((x.kind==='skin'?SKINS:STICKERS)[it.v]||{}).n||'':'';
    return'<div class="row">'+vis+'<div class="mid"><div class="tt">'+esc(name)+'</div><div class="ss">'+(sold?'\u041a\u0443\u043f\u0438\u043b '+esc(x.bnick||'\u0438\u0433\u0440\u043e\u043a')+' \u00b7 \u0432\u0430\u043c '+fmt(x.price-x.fee)+' (\u043a\u043e\u043c\u0438\u0441\u0441\u0438\u044f '+fmtN(x.fee)+')':'\u041f\u0440\u043e\u0434\u0430\u0432\u0435\u0446 '+esc(x.snick||'\u0438\u0433\u0440\u043e\u043a'))+'</div><div class="ey">'+dateRu(x.t)+'</div></div><div class="end"><span class="val" style="color:'+(sold?'var(--green)':'var(--text)')+'">'+(sold?'+':'\u2212')+fmtN(sold?x.price-x.fee:x.price)+'</span></div></div>'}).join('')+'</div>';
}
ACT.mkHist=el=>{mk.hist=el.dataset.s;rerenderMk()};

/* ---------- \u0432\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0440\u044b\u043d\u043e\u043a (\u0438\u0437 \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044f) ---------- */
ACT.sell=el=>{
  const k=el.dataset.k||'plate',id=+el.dataset.id;
  const x=k==='plate'?S.box.find(b=>b.id===id):S.inv.find(b=>b.id===id);if(!x)return;
  if(k==='plate'&&x.pin){toast('\u041d\u043e\u043c\u0435\u0440 \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d. \u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0434\u0430\u0442\u044c','err');return}
  if(k==='skin'&&L.skinLocked(S,x)){toast('\u042d\u0442\u043e\u0442 \u0441\u043a\u0438\u043d \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d. \u041f\u043e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0439, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0434\u0430\u0442\u044c','err');return}
  if(Net.me.mute&&Net.me.mute.m){toast('\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u043b \u0432\u0430\u043c \u0440\u044b\u043d\u043e\u043a','err');return}
  const inv=k!=='plate';const base=inv?invLook(x).v:x.price;
  const best=bestOrderFor(k,x);
  const name=inv?esc(invLook(x).n):esc(plateText(x.pl));
  const sug=[L.niceRound(base*.9),base,L.niceRound(base*1.25)];
  Sheet.open({title:'\u041f\u0440\u043e\u0434\u0430\u0442\u044c \u043d\u0430 \u0440\u044b\u043d\u043a\u0435',lead:name+' \u00b7 \u043e\u0446\u0435\u043d\u043a\u0430 '+fmt(base),body:
    (inv?'<div style="display:grid;place-items:center">'+invPreview(x,240,130)+'</div>':'<div class="pad" style="margin-bottom:12px">'+plateHTML(x)+'</div>')+
    (best?'<div class="row" style="margin:0 var(--g) 12px;width:auto;background:rgba(48,209,88,.14)"><div class="mid"><div class="tt" style="font-size:16px">\u0415\u0441\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 '+fmt(best.price)+'</div><div class="ss">\u041f\u043e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0446\u0435\u043d\u0443 \u043d\u0435 \u0432\u044b\u0448\u0435 \u2014 \u043f\u0440\u043e\u0434\u0430\u0441\u0442\u0441\u044f \u0441\u0440\u0430\u0437\u0443</div></div><button class="pill" data-act="sellAt" data-p="'+best.price+'">\u0412\u0437\u044f\u0442\u044c</button></div>':'')+
    '<div class="field"><label for="ask">\u0426\u0435\u043d\u0430 \u0434\u043b\u044f \u043f\u043e\u043a\u0443\u043f\u0430\u0442\u0435\u043b\u044f, \u043c\u043e\u043d\u0435\u0442</label><input class="inp num" id="ask" inputmode="numeric" value="'+base+'" data-on="ask"></div>'+
    '<div class="pad" style="display:flex;gap:8px;flex-wrap:wrap">'+sug.map(v=>'<button class="pill" data-act="sellAt" data-p="'+v+'">'+fmtN(v)+'</button>').join('')+'</div>'+
    '<div class="group" style="margin-top:12px" id="ask-sum"></div>'+
    '<div class="foot"><button class="btn pri wide" data-act="doList" data-k="'+k+'" data-id="'+id+'">\u0412\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c</button><button class="btn wide" data-act="sheetx">\u041e\u0442\u043c\u0435\u043d\u0430</button></div>'});
  ON.ask();
};
ON.ask=()=>{const i=$('ask');const n=$('ask-sum');if(!i||!n)return;const v=numIn(i.value);const fee=v-Math.floor(v*(1-L.FEE));
  n.innerHTML='<div class="li noic"><span class="lt">\u041f\u043e\u043a\u0443\u043f\u0430\u0442\u0435\u043b\u044c \u0437\u0430\u043f\u043b\u0430\u0442\u0438\u0442</span><span class="lv num">'+fmt(v)+'</span></div><div class="li noic"><span class="lt">\u041a\u043e\u043c\u0438\u0441\u0441\u0438\u044f \u0440\u044b\u043d\u043a\u0430 '+Math.round(L.FEE*100)+'%</span><span class="lv num">\u2212'+fmtN(fee)+'</span></div><div class="li noic"><span class="lt"><b>\u0412\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435</b></span><span class="lv num" style="color:var(--green);font-weight:700">'+fmt(v-fee)+'</span></div>'};
ACT.sellAt=el=>{const i=$('ask');if(i){i.value=el.dataset.p;ON.ask()}};
ACT.doList=el=>{const ask=numIn($('ask').value);if(!(ask>=L.MIN_ASK)){toast('\u0426\u0435\u043d\u0430 \u043e\u0442 '+fmt(L.MIN_ASK),'err');return}run('list',{kind:el.dataset.k,id:+el.dataset.id,ask},{btn:el,ok:()=>{Sheet.close();if(lastDrop&&lastDrop.id===+el.dataset.id)lastDrop=null;loadPub('market');loadPub('orders')}})};
function bestOrderFor(k,x){
  const key=k==='plate'?'p:'+x.pl.c+':'+x.m:x.v;
  return(Net.orders||[]).filter(o=>o.uid!==Net.me.uid&&o.kind===k&&(k==='plate'?((o.spec.c==='*'||o.spec.c===x.pl.c)&&o.spec.m===x.m&&x.f<WEARS[o.spec.w].max):o.key===key)).sort((a,b)=>b.price-a.price)[0]||null;
}

/* ---------- \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u043f\u043e\u043a\u0443\u043f\u043a\u0443 ---------- */
let ordF={kind:'plate',c:'*',m:1,w:4,v:''};
ACT.newOrder=el=>{ordF.kind=el.dataset.k||'plate';if(el.dataset.v)ordF.v=el.dataset.v;showOrderSheet()};
function showOrderSheet(){
  const k=ordF.kind;const inv=k!=='plate';
  const defs=k==='skin'?SKINS:STICKERS;
  if(inv&&!defs[ordF.v])ordF.v=Object.keys(defs).find(x=>!defs[x].free);
  Sheet.open({title:'\u0417\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u043f\u043e\u043a\u0443\u043f\u043a\u0443',body:
    '<div class="pad" style="margin-bottom:12px"><div class="segbox">'+[['plate','\u041d\u043e\u043c\u0435\u0440'],['skin','\u0421\u043a\u0438\u043d'],['sticker','\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430']].map(s=>'<button class="'+(k===s[0]?'on':'')+'" data-act="ordKind" data-k="'+s[0]+'">'+s[1]+'</button>').join('')+'</div></div>'+
    (k==='plate'?
      '<div class="field"><label>\u0421\u0442\u0440\u0430\u043d\u0430</label><select class="inp" data-on="ordC"><option value="*">\u041b\u044e\u0431\u0430\u044f</option>'+COUNTRIES.map(c=>'<option value="'+c+'"'+(ordF.c===c?' selected':'')+'>'+CN_SHORT[c]+'</option>').join('')+'</select></div>'+
      '<div class="field"><label>\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</label><select class="inp" data-on="ordM">'+MATS.map((m,i)=>'<option value="'+i+'"'+(ordF.m===i?' selected':'')+'>'+m.n+'</option>').join('')+'</select></div>'+
      '<div class="field"><label>\u0418\u0437\u043d\u043e\u0441 \u043d\u0435 \u0445\u0443\u0436\u0435</label><select class="inp" data-on="ordW">'+WEARS.map((w,i)=>'<option value="'+i+'"'+(ordF.w===i?' selected':'')+'>'+(i===4?'\u041b\u044e\u0431\u043e\u0439':w.n+' ('+w.k+')')+'</option>').join('')+'</select></div>'
    :'<div class="field"><label>\u041f\u0440\u0435\u0434\u043c\u0435\u0442</label><select class="inp" data-on="ordV">'+Object.keys(defs).filter(x=>!defs[x].free).map(x=>'<option value="'+x+'"'+(ordF.v===x?' selected':'')+'>'+esc(defs[x].n)+(k==='skin'?' ('+(x.startsWith('car')?'\u043c\u0430\u0448\u0438\u043d\u0430':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a')+')':'')+' \u00b7 '+fmtN(defs[x].v)+'</option>').join('')+'</select></div>')+
    '<div class="rowf" style="margin:0 var(--g)"><div class="field" style="margin:0"><label>\u0426\u0435\u043d\u0430 \u0437\u0430 \u0448\u0442\u0443\u043a\u0443, \u043c\u043e\u043d\u0435\u0442</label><input class="inp num" id="ordP" inputmode="numeric" placeholder="'+(inv?'5000':'5000')+'" data-on="ordSum"></div><div class="field" style="margin:0;flex:.5"><label>\u0421\u043a\u043e\u043b\u044c\u043a\u043e</label><input class="inp num" id="ordQ" inputmode="numeric" value="1" data-on="ordSum"></div></div>'+
    '<p class="note" id="ord-sum">\u0421\u0443\u043c\u043c\u0430 \u0440\u0435\u0437\u0435\u0440\u0432\u0438\u0440\u0443\u0435\u0442\u0441\u044f \u0441\u0440\u0430\u0437\u0443. \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441 \u043c\u043e\u0436\u043d\u043e \u0432 \u043b\u044e\u0431\u043e\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 \u2014 \u043c\u043e\u043d\u0435\u0442\u044b \u0432\u0435\u0440\u043d\u0443\u0442\u0441\u044f.</p>'+
    '<div class="foot"><button class="btn pri wide" data-act="ordGo">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441</button></div>'});
}
ON.ordSum=()=>{const p=numIn(($('ordP')||{}).value),q=Math.max(1,numIn(($('ordQ')||{}).value));const n=$('ord-sum');if(n)n.textContent='\u0411\u0443\u0434\u0435\u0442 \u0437\u0430\u0440\u0435\u0437\u0435\u0440\u0432\u0438\u0440\u043e\u0432\u0430\u043d\u043e '+fmt(p*q)+'. \u041e\u0441\u0442\u0430\u043d\u0435\u0442\u0441\u044f '+fmt(Math.max(0,S.bal-p*q))+'. \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u043c\u043e\u0436\u043d\u043e \u0432 \u043b\u044e\u0431\u043e\u0439 \u043c\u043e\u043c\u0435\u043d\u0442.'};
ACT.ordKind=el=>{ordF.kind=el.dataset.k;showOrderSheet()};
ON.ordCChange=el=>ordF.c=el.value;ON.ordMChange=el=>ordF.m=+el.value;ON.ordWChange=el=>ordF.w=+el.value;ON.ordVChange=el=>ordF.v=el.value;
ACT.ordGo=el=>{
  const price=numIn($('ordP').value),qty=Math.max(1,numIn($('ordQ').value));
  if(price*qty>S.bal){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+fmt(price*qty-S.bal),'err');return}
  const p={kind:ordF.kind,price,qty};if(ordF.kind==='plate')Object.assign(p,{c:ordF.c,m:ordF.m,w:ordF.w});else p.v=ordF.v;
  run('order',p,{btn:el,ok:()=>{Sheet.close();loadPub('orders');loadPub('market')}});
};

/* ================= \u0432\u043a\u043b\u0430\u0434\u043a\u0430 \u00ab\u0418\u0433\u0440\u044b\u00bb ================= */
const GAMES=[
  {id:'rider',n:'Rider',s:'\u0424\u043b\u0438\u043f\u044b, \u0442\u0440\u0430\u043c\u043f\u043b\u0438\u043d\u044b \u0438 \u043a\u0430\u043d\u0438\u0441\u0442\u0440\u044b \u0441 \u0442\u043e\u043f\u043b\u0438\u0432\u043e\u043c',fb:'#6b3200',gi:'var(--orange)',i:'car',tint:'#ffd6a8'},
  {id:'stunt',n:'\u0421\u0442\u0430\u043d\u0442',s:'\u0412\u0438\u043b\u043b\u0438, \u0442\u0440\u044e\u043a\u0438 \u0438 \u043a\u043e\u043c\u0431\u043e \u043d\u0430 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0435',fb:'#08306e',gi:'var(--blue)',i:'bike',tint:'#b9dcff'},
  {id:'gas',n:'\u0413\u0430\u0437 \u0432 \u043f\u043e\u043b',s:'\u041a\u0442\u043e \u0431\u044b\u0441\u0442\u0440\u0435\u0435 \u0436\u043c\u0451\u0442 \u0433\u0430\u0437: \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u043e\u0442\u0430 \u0438\u043b\u0438 \u0441 \u0434\u0440\u0443\u0437\u044c\u044f\u043c\u0438',fb:'#6e100c',gi:'var(--red)',i:'speed',tint:'#ffc6bf'}
];
RENDER.games=()=>{
  const el=$('t-games');const t=now();
  const caps=L.gameCaps(S),earned=L.gameEarned(S,t),rs=L.gameReset(S,t);
  const keyP=S.games.acc/L.KEY_EVERY;
  const ge=g=>L.winFresh(S,t)?0:(+S.games.w.e[g]||0);
  el.innerHTML=topHTML('\u0418\u0433\u0440\u044b')+
    '<div class="shelf" style="margin-top:14px">'+GAMES.map(g=>{const pay=L.PAY_GAMES.includes(g.id);const fav=S.fav.includes(g.id);return'<div class="feature" style="--fb:'+g.fb+';--tint:'+g.tint+'"><button class="pic" data-act="play" data-g="'+g.id+'" aria-label="\u0418\u0433\u0440\u0430\u0442\u044c: '+g.n+'"><canvas data-scene="'+g.id+'"></canvas>'+(pay?'<span class="lbl badge" style="background:rgba(0,0,0,.35);color:#fff;backdrop-filter:blur(8px)">'+ic('star')+'1 \u043e\u0447\u043a\u043e = 1 \u043c\u043e\u043d\u0435\u0442\u0430</span>':'<span class="lbl badge" style="background:rgba(0,0,0,.35);color:#fff">'+ic('person2')+'\u043e\u0442 1 \u0434\u043e 4 \u0438\u0433\u0440\u043e\u043a\u043e\u0432</span>')+'</button>'+
      (pay?'<button class="heart'+(fav?' on':'')+'" data-act="fav" data-g="'+g.id+'" aria-label="'+(fav?'\u0423\u0431\u0440\u0430\u0442\u044c \u0438\u0437 \u043b\u044e\u0431\u0438\u043c\u044b\u0445':'\u0412 \u043b\u044e\u0431\u0438\u043c\u044b\u0435')+'">'+ic(fav?'heart':'heartO')+'</button>':'')+
      '<button class="info" data-act="play" data-g="'+g.id+'" style="width:100%;text-align:left"><span class="gi" style="background:'+g.gi+'">'+ic(g.i)+'</span><div class="mid"><div class="tt">'+g.n+'</div><div class="ss">'+g.s+'</div></div><span class="pill on-card">\u0418\u0433\u0440\u0430\u0442\u044c</span></button></div>'}).join('')+'</div>'+
    secH('\u0417\u0430\u0440\u0430\u0431\u043e\u0442\u043e\u043a')+
    '<div class="rows"><div class="row"><span class="ico" style="background:var(--green)">'+ic('coin')+'</span><div class="mid"><div class="tt num">'+fmtN(earned)+' \u0438\u0437 '+fmtN(L.GAME_TOTAL)+'</div><div class="ss">'+(rs?'\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 <span data-left="'+rs+'">'+left(rs-t)+'</span>':'\u041e\u0431\u0449\u0438\u0439 \u043b\u0438\u043c\u0438\u0442 \u0432\u0441\u0435\u0445 \u043c\u0438\u043d\u0438-\u0438\u0433\u0440 \u043d\u0430 12 \u0447\u0430\u0441\u043e\u0432')+'</div><div class="bar" style="margin-top:8px"><i style="width:'+(earned/L.GAME_TOTAL*100).toFixed(1)+'%;background:linear-gradient(90deg,#7fe26a,var(--green))"></i></div></div></div>'+
      L.PAY_GAMES.map(id=>{const g=GAMES.find(x=>x.id===id);const e=ge(id),c=caps[id];return'<div class="row"><span class="ico" style="background:'+g.gi+'">'+ic(g.i)+'</span><div class="mid"><div class="tt">'+g.n+(S.fav.includes(id)?' <span style="color:var(--pink);width:16px;height:16px;display:inline-block;vertical-align:-2px">'+ic('heart')+'</span>':'')+'</div><div class="ss num">'+fmtN(e)+' \u0438\u0437 '+fmtN(c)+'</div><div class="bar" style="margin-top:8px"><i style="width:'+(c?Math.min(100,e/c*100):0).toFixed(1)+'%"></i></div></div></div>'}).join('')+
      '<div class="row"><span class="ico" style="background:var(--teal)">'+ic('key')+'</span><div class="mid"><div class="tt">\u041a\u043b\u044e\u0447 \u0437\u0430 \u043a\u0430\u0436\u0434\u044b\u0435 '+fmtN(L.KEY_EVERY)+' \u043c\u043e\u043d\u0435\u0442</div><div class="ss num">\u0414\u043e \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0433\u043e \u043a\u043b\u044e\u0447\u0430 '+fmtN(L.KEY_EVERY-S.games.acc)+'</div><div class="bar" style="margin-top:8px"><i style="width:'+(keyP*100).toFixed(1)+'%;background:linear-gradient(90deg,#6fe6ef,var(--teal))"></i></div></div></div></div>'+
    '<p class="note">\u041c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b \u0432\u043c\u0435\u0441\u0442\u0435 \u043f\u043b\u0430\u0442\u044f\u0442 \u0434\u043e '+fmt(L.GAME_TOTAL)+' \u0437\u0430 12 \u0447\u0430\u0441\u043e\u0432. \u041e\u0442\u043c\u0435\u0442\u044c\u0442\u0435 \u0441\u0435\u0440\u0434\u0435\u0447\u043a\u043e\u043c \u0434\u043e \u0434\u0432\u0443\u0445 \u043b\u044e\u0431\u0438\u043c\u044b\u0445 \u0440\u0435\u0436\u0438\u043c\u043e\u0432 \u2014 \u043d\u0430 \u043d\u0438\u0445 \u043b\u0438\u043c\u0438\u0442 \u0432 1,5 \u0440\u0430\u0437\u0430 \u0431\u043e\u043b\u044c\u0448\u0435. \u041a\u043e\u0433\u0434\u0430 \u043b\u0438\u043c\u0438\u0442 \u043d\u0430\u0431\u0440\u0430\u043d, \u0438\u0433\u0440\u0430\u0442\u044c \u043c\u043e\u0436\u043d\u043e \u0434\u0430\u043b\u044c\u0448\u0435, \u043d\u043e \u0431\u0435\u0437 \u0432\u044b\u043f\u043b\u0430\u0442\u044b.</p>'+
    secH('\u0420\u0435\u043a\u043e\u0440\u0434\u044b')+
    '<div class="grid2">'+[['rider','Rider','g-orange'],['stunt','\u0421\u0442\u0430\u043d\u0442','g-blue']].map(([id,n,g])=>'<div class="gc '+g+'" style="height:120px"><span class="k">'+n+'</span><span class="t num" style="font-size:28px;font-weight:800">'+fmtN(S.games[id].best)+'</span><span class="s">\u043b\u0443\u0447\u0448\u0438\u0439 \u0437\u0430\u0435\u0437\u0434</span></div>').join('')+'</div>'+
    secH('\u0421\u0432\u043e\u044f \u043c\u0443\u0437\u044b\u043a\u0430','music')+
    '<div class="rows"><button class="row" data-act="music"><span class="ico" style="background:var(--pink)">'+ic('music')+'</span><div class="mid"><div class="tt">'+(Music.count()?Music.count()+' '+plural(Music.count(),'\u0442\u0440\u0435\u043a','\u0442\u0440\u0435\u043a\u0430','\u0442\u0440\u0435\u043a\u043e\u0432'):'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0442\u0440\u0435\u043a\u0438')+'</div><div class="ss">\u0418\u0433\u0440\u0430\u0435\u0442 \u0432\u043e \u0432\u0440\u0435\u043c\u044f \u0437\u0430\u0435\u0437\u0434\u043e\u0432. \u0425\u0440\u0430\u043d\u0438\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 \u044d\u0442\u043e\u043c \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435</div></div>'+ic('chev','chev')+'</button></div>';
  hydrateAvas(el);
  requestAnimationFrame(()=>qsa('canvas[data-scene]',el).forEach(cv=>Draw.scene(cv,cv.dataset.scene)));
};
ACT.fav=el=>{const g=el.dataset.g;const on=S.fav.includes(g);if(!on&&S.fav.length>=L.FAV_MAX){toast('\u041b\u044e\u0431\u0438\u043c\u044b\u0445 \u0440\u0435\u0436\u0438\u043c\u043e\u0432 \u043d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u0434\u0432\u0443\u0445. \u0421\u043d\u0438\u043c\u0438\u0442\u0435 \u0441\u0435\u0440\u0434\u0435\u0447\u043a\u043e \u0441 \u0434\u0440\u0443\u0433\u043e\u0433\u043e','err');return}run('fav',{g},{quiet:true,ok:()=>{toast(on?'\u0423\u0431\u0440\u0430\u043d\u043e \u0438\u0437 \u043b\u044e\u0431\u0438\u043c\u044b\u0445':'\u041b\u044e\u0431\u0438\u043c\u044b\u0439 \u0440\u0435\u0436\u0438\u043c: \u043b\u0438\u043c\u0438\u0442 \u00d71,5');Haptic.tick()}})};
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
const INV_FEAT=[
  {id:'upgr',n:'\u0410\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440',s:'\u041d\u043e\u043c\u0435\u0440 \u0438\u043b\u0438 \u0441\u043a\u0438\u043d \u0434\u043e\u0440\u043e\u0436\u0435: \u00d72, \u00d75, \u00d710 \u0438\u043b\u0438 \u043d\u0443\u0436\u043d\u044b\u0439 \u0448\u0430\u043d\u0441',fb:'#3d1478',gi:'var(--purple)',i:'up',tint:'#e1c4ff',lbl:'\u0434\u043e \u00d710'},
  {id:'tote',n:'\u0422\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440',s:'\u0428\u0435\u0441\u0442\u044c \u043c\u0430\u0448\u0438\u043d, \u0447\u0435\u0441\u0442\u043d\u044b\u0435 \u043a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442\u044b \u043e\u0442 \u00d72 \u0434\u043e \u00d720',fb:'#0f4a17',gi:'var(--green)',i:'flag',tint:'#c7f5b8',lbl:'\u00d72 \u2013 \u00d720'},
  {id:'clicker',n:'\u041a\u043b\u0438\u043a\u0435\u0440',s:'\u041c\u0438\u043d\u0443\u0442\u0430 \u043a\u043b\u0438\u043a\u043e\u0432: \u043a\u0430\u0436\u0434\u044b\u0439 \u043a\u043b\u0438\u043a \u2014 10 \u043c\u043e\u043d\u0435\u0442',fb:'#6b4b00',gi:'var(--yellow)',i:'tap',tint:'#fff3c0',lbl:'5 \u043a\u043b\u044e\u0447\u0435\u0439'}
];
RENDER.invest=()=>{
  const el=$('t-invest');const t=now();
  const dep=S.bank.reduce((s,b)=>s+b.a,0);const se=L.shopEnds(S);const left2=S.shop.list.length-S.shop.got.length;
  el.innerHTML=topHTML('\u0412\u043b\u043e\u0436\u0435\u043d\u0438\u044f')+
    '<div class="shelf" style="margin-top:14px">'+INV_FEAT.map(g=>'<button class="feature" data-act="inv_'+g.id+'" style="--fb:'+g.fb+';--tint:'+g.tint+';text-align:left"><div class="pic"><canvas data-iart="'+g.id+'"></canvas><span class="lbl badge" style="background:rgba(0,0,0,.35);color:#fff;backdrop-filter:blur(8px)">'+esc(g.lbl)+'</span></div>'+
      '<div class="info"><span class="gi" style="background:'+g.gi+'">'+ic(g.i)+'</span><div class="mid"><div class="tt">'+g.n+'</div><div class="ss">'+g.s+'</div></div><span class="pill on-card">\u041e\u0442\u043a\u0440\u044b\u0442\u044c</span></div></button>').join('')+'</div>'+
    secH('\u041a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c')+
    '<div class="rows">'+
      '<button class="row" data-act="inv_shop"><span class="ico" style="background:var(--red)">'+ic('bag')+'</span><div class="mid"><div class="tt">\u041c\u0430\u0433\u0430\u0437\u0438\u043d \u0434\u043d\u044f</div><div class="ss">'+(S.shop.list.length?left2+' '+plural(left2,'\u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435','\u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f','\u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0439')+' \u00b7 \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 <span data-left="'+se+'">'+left(se-t)+'</span>':'\u041a\u0435\u0439\u0441\u044b \u0441\u043e \u0441\u043a\u0438\u0434\u043a\u043e\u0439 \u0438 \u0440\u0435\u0434\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430')+'</div></div>'+ic('chev','chev')+'</button>'+
      '<button class="row" data-act="inv_bank"><span class="ico" style="background:var(--teal)">'+ic('bank')+'</span><div class="mid"><div class="tt">\u0411\u0430\u043d\u043a</div><div class="ss num">'+(dep?fmt(dep)+' \u0432\u043e \u0432\u043a\u043b\u0430\u0434\u0430\u0445':'1% \u0432 \u0434\u0435\u043d\u044c, \u0441\u0440\u043e\u043a \u0434\u043e 30 \u0434\u043d\u0435\u0439')+'</div></div>'+ic('chev','chev')+'</button>'+
      '<button class="row" data-act="inv_exch"><span class="ico" style="background:var(--indigo)">'+ic('swap')+'</span><div class="mid"><div class="tt">\u041e\u0431\u043c\u0435\u043d \u043a\u043b\u044e\u0447\u0435\u0439</div><div class="ss">1 \u043a\u043b\u044e\u0447 = '+fmt(L.KEY_COINS)+'</div></div>'+ic('chev','chev')+'</button>'+
    '</div>'+
    secH('\u0421\u0432\u043e\u0434\u043a\u0430')+
    '<div class="stats3"><div class="stat"><b>'+fmtN(S.stats.up)+'</b><span>\u0430\u043f\u0433\u0440\u0435\u0439\u0434\u043e\u0432</span></div><div class="stat"><b>'+fmtN(S.stats.tote)+'</b><span>\u0441\u0442\u0430\u0432\u043e\u043a</span></div><div class="stat"><b>'+shortN(dep)+'</b><span>\u0432\u043e \u0432\u043a\u043b\u0430\u0434\u0430\u0445</span></div></div>';
  hydrateAvas(el);
  requestAnimationFrame(()=>qsa('canvas[data-iart]',el).forEach(cv=>investArt(cv,cv.dataset.iart)));
};
function investArt(cv,k){
  const {c,W,H}=Draw.fit(cv);
  const sky=(a,b)=>{const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.fillRect(0,0,W,H)};
  if(k==='upgr'){
    sky('#8f4dff','#4a19a8');
    c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=18;c.beginPath();c.arc(W*.72,H*.52,H*.34,0,Math.PI*2);c.stroke();
    c.strokeStyle='#ffd60a';c.lineCap='round';c.beginPath();c.arc(W*.72,H*.52,H*.34,-Math.PI/2,-Math.PI/2+Math.PI*1.25);c.stroke();
    c.fillStyle='#fff';c.font='800 '+Math.round(H*.16)+'px -apple-system,Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('62%',W*.72,H*.53);
    c.save();c.translate(W*.08,H*.3);c.fillStyle='#fff';c.strokeStyle='#111';c.lineWidth=3;Draw.rr(c,0,0,W*.42,H*.17,8);c.fill();c.stroke();c.fillStyle='#111';c.font='700 '+Math.round(H*.1)+'px "Roboto Condensed",Arial';c.textAlign='left';c.fillText('\u0410777\u0410\u0410',10,H*.09);c.restore();
    c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.moveTo(W*.24,H*.62);c.lineTo(W*.32,H*.52);c.lineTo(W*.4,H*.62);c.lineTo(W*.35,H*.62);c.lineTo(W*.35,H*.78);c.lineTo(W*.29,H*.78);c.lineTo(W*.29,H*.62);c.fill();
  }else if(k==='tote'){
    sky('#36c25a','#13651f');
    for(let i=0;i<4;i++){c.fillStyle=i%2?'rgba(0,0,0,.18)':'rgba(255,255,255,.08)';c.fillRect(0,H*.35+i*H*.15,W,H*.15)}
    for(let j=0;j<8;j++){c.fillStyle=j%2?'#fff':'#111';c.fillRect(W*.86,H*.35+j*H*.075,10,H*.075);c.fillStyle=j%2?'#111':'#fff';c.fillRect(W*.86+10,H*.35+j*H*.075,10,H*.075)}
    const cars=[['car:sport','red',.62],['car:muscle','yellow',.48],['car:coupe','blue',.36],['car:buggy','white',.2]];
    cars.forEach((x,i)=>Draw.car(c,W*x[2]+40,H*.47+i*H*.15,H/230,{skin:x[0],c1:x[1],c2:'black',wh:'sport'},{noShadow:true}));
  }else{
    sky('#ffd426','#d99a00');
    c.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<3;i++){c.beginPath();c.arc(W*.7,H*.5,H*(.18+i*.12),0,Math.PI*2);c.lineWidth=4;c.strokeStyle='rgba(255,255,255,'+(.35-i*.1)+')';c.stroke()}
    c.fillStyle='#fff';c.beginPath();c.arc(W*.7,H*.5,H*.16,0,Math.PI*2);c.fill();c.fillStyle='#a06c00';c.font='800 '+Math.round(H*.1)+'px -apple-system,Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('\u0416\u041c\u0418',W*.7,H*.51);
    c.fillStyle='#fff';c.font='800 '+Math.round(H*.2)+'px -apple-system,Arial';c.textAlign='left';c.fillText('+10',W*.1,H*.4);c.font='700 '+Math.round(H*.1)+'px -apple-system,Arial';c.fillText('\u0437\u0430 \u043a\u043b\u0438\u043a',W*.1,H*.56);
  }
}
const OPEN={};
['upgr','tote','clicker','shop','bank','exch'].forEach(id=>{ACT['inv_'+id]=()=>OPEN[id]()});

/* ---------- \u043c\u0430\u0433\u0430\u0437\u0438\u043d \u0434\u043d\u044f ---------- */
OPEN.shop=()=>{Page.push('shop','\u041c\u0430\u0433\u0430\u0437\u0438\u043d \u0434\u043d\u044f',renderDayShop);refreshState(true)};
function renderDayShop(el){
  const sh=S.shop;const end=L.shopEnds(S);
  if(!sh.list.length){el.innerHTML='<div class="empty">\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u2026</div>';return}
  el.innerHTML='<p class="lead">\u0421\u0432\u043e\u0438 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0434\u043b\u044f \u0432\u0430\u0441, \u043e\u0431\u043d\u043e\u0432\u043b\u044f\u044e\u0442\u0441\u044f \u0440\u0430\u0437 \u0432 24 \u0447\u0430\u0441\u0430. \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u2014 \u0447\u0435\u0440\u0435\u0437 <b data-left="'+end+'">'+left(end-now())+'</b>. \u041a\u0430\u0436\u0434\u043e\u0435 \u043c\u043e\u0436\u043d\u043e \u043a\u0443\u043f\u0438\u0442\u044c \u043e\u0434\u0438\u043d \u0440\u0430\u0437.</p><div class="rows">'+sh.list.map((o,i)=>{
    const bought=sh.got.includes(i);let vis='',name='',sub='',old=0;
    if(o.k==='case'){const t=TIERS[o.t];vis='<span class="ico" style="background:var(--card2)">'+caseArt(o.t).replace('width="74" height="74"','width="44" height="44"')+'</span>';name='\u041a\u0435\u0439\u0441 \u00ab'+t.name+'\u00bb \u00d7'+o.n;sub='\u041e\u0442\u043a\u0440\u043e\u0435\u0442\u0435 \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e, \u043b\u044e\u0431\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0430';old=t.price*o.n}
    else if(o.k==='skinc'){vis='<span class="ico" style="background:var(--purple)">'+ic('car')+'</span>';name='\u041a\u0435\u0439\u0441 \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438 \u00d7'+o.n;sub='\u041e\u0442\u043a\u0440\u043e\u0435\u0442\u0435 \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e';old=L.SKIN_CASE.price*o.n}
    else if(o.k==='stkc'){vis='<span class="ico" style="background:var(--pink)">'+ic('sticker')+'</span>';name='\u041a\u0435\u0439\u0441 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438 \u00d7'+o.n;sub='\u041e\u0442\u043a\u0440\u043e\u0435\u0442\u0435 \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e';old=L.STICKER_CASE.price*o.n}
    else if(o.k==='plate'){const it=Object.assign({id:0},o.it);vis='<div style="width:120px;flex:none">'+plateHTML(it)+'</div>';name=plateText(o.it.pl);sub=matOf(o.it).n+' \u00b7 \u043e\u0446\u0435\u043d\u043a\u0430 '+fmt(appraise(o.it).price)}
    else{vis='<span class="ico" style="background:'+COLORS[o.v].c+'"></span>';name='\u0426\u0432\u0435\u0442 \u00ab'+COLORS[o.v].n+'\u00bb';sub='\u041a\u0440\u0430\u0441\u043a\u0430 \u0434\u043b\u044f \u043c\u0430\u0448\u0438\u043d\u044b \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430';old=COLORS[o.v].cost}
    const off=old>o.price?Math.round((1-o.price/old)*100):0;
    return'<div class="row"'+(o.k==='plate'?' data-act="shopInsp" data-i="'+i+'"':'')+'>'+vis+'<div class="mid"><div class="tt" style="white-space:normal">'+esc(name)+'</div><div class="ss">'+esc(sub)+'</div>'+(off?'<div class="ey"><s class="num">'+fmtN(old)+'</s> <span class="badge" style="background:var(--red);color:#fff">\u2212'+off+'%</span></div>':'')+'</div>'+
      (bought?'<span class="pill" style="opacity:.5">\u041a\u0443\u043f\u043b\u0435\u043d\u043e</span>':'<button class="pill" data-act="shopBuy" data-i="'+i+'">'+COIN(o.price)+'</button>')+'</div>';
  }).join('')+'</div>';
}
ACT.shopInsp=(el,e)=>{if(e&&e.target.closest('[data-act=shopBuy]'))return;const o=S.shop.list[+el.dataset.i];if(o&&o.k==='plate')inspect(Object.assign({id:0},o.it),{title:plateText(o.it.pl)})};
ACT.shopBuy=el=>{const i=+el.dataset.i;const o=S.shop.list[i];if(!o)return;if(S.bal<o.price){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+fmt(o.price-S.bal),'err');return}run('shopBuy',{i},{btn:el,key:'shop'+i,ok:()=>Snd.coin()})};

/* ---------- \u0442\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440 ---------- */
// tote.race \u0434\u0435\u0440\u0436\u0438\u0442 \u0441\u043d\u0438\u043c\u043e\u043a \u0437\u0430\u0431\u0435\u0433\u0430: \u043f\u043e\u043a\u0430 \u0438\u0434\u0451\u0442 \u0430\u043d\u0438\u043c\u0430\u0446\u0438\u044f \u0438 \u043f\u043e\u043a\u0430 \u0438\u0433\u0440\u043e\u043a \u0441\u043c\u043e\u0442\u0440\u0438\u0442 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442, \u044d\u043a\u0440\u0430\u043d \u043d\u0435 \u043f\u0435\u0440\u0435\u0440\u0438\u0441\u043e\u0432\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u043d\u0430 \u043d\u043e\u0432\u044b\u0439 \u0437\u0430\u0431\u0435\u0433
let tote={pick:-1,amt:1000,race:null};
OPEN.tote=()=>{if(!S.tote.card)run('toteNew',{},{quiet:true});Page.push('tote','\u0422\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440',renderTote,{onClose:()=>{tote.race=null;tote.pick=-1}})};
function renderTote(el){
  const R=tote.race;const card=R?R.card:S.tote.card;const d=L.mskDate(now());const n=S.tote.d===d?S.tote.n:0;
  if(!card){el.innerHTML='<div class="empty">\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u0437\u0430\u0431\u0435\u0433\u2026</div>';return}
  const pick=R?R.pick:tote.pick;
  const pr=L.toteProbs(card.o);const win=pick>=0?Math.floor((R?R.amt:tote.amt)*card.o[pick]):0;
  let foot;
  if(R&&!R.done)foot='<button class="btn pri wide off" id="tote-go">\u0417\u0430\u0431\u0435\u0433 \u0438\u0434\u0451\u0442\u2026</button>';
  else if(R)foot='<button class="btn pri wide" data-act="toteNext" id="tote-go">\u041d\u043e\u0432\u044b\u0439 \u0437\u0430\u0431\u0435\u0433</button>';
  else foot='<button class="btn pri wide'+(tote.pick<0?' off':'')+'" data-act="toteGo" id="tote-go">'+(tote.pick<0?'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u0430\u0448\u0438\u043d\u0443':'\u041f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u2116'+(tote.pick+1)+' \u00b7 \u0432\u044b\u0438\u0433\u0440\u044b\u0448 '+fmtN(win))+'</button>';
  const res=R&&R.done?'<div class="card p" style="margin:12px var(--g) 0;display:flex;gap:12px;align-items:center"><span class="ico" style="background:'+(R.pay?'var(--green)':'var(--card2)')+'">'+ic(R.pay?'medal':'flag')+'</span><div style="flex:1;min-width:0"><div style="font:600 16px var(--f-ui)">'+(R.pay?'\u041f\u043e\u0431\u0435\u0434\u0430! +'+fmt(R.pay):'\u041f\u0435\u0440\u0432\u044b\u043c \u043f\u0440\u0438\u0448\u0451\u043b \u2116'+(R.win+1))+'</div><div class="muted" style="font-size:13px">'+(R.pay?'\u2116'+(R.win+1)+' \u00ab'+esc(SKINS[card.sk[R.win]].n)+'\u00bb \u043f\u0440\u0438\u0448\u0451\u043b \u043f\u0435\u0440\u0432\u044b\u043c':'\u0412\u0430\u0448\u0430 \u0441\u0442\u0430\u0432\u043a\u0430 \u043d\u0430 \u2116'+(R.pick+1)+' \u043d\u0435 \u0441\u044b\u0433\u0440\u0430\u043b\u0430')+'</div></div></div>':'';
  el.innerHTML='<p class="lead">\u0428\u0435\u0441\u0442\u044c \u043c\u0430\u0448\u0438\u043d, \u0443 \u043a\u0430\u0436\u0434\u043e\u0439 \u0441\u0432\u043e\u0439 \u043a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442. \u0428\u0430\u043d\u0441 \u043f\u043e\u0431\u0435\u0434\u044b \u0447\u0435\u0441\u0442\u043d\u044b\u0439 \u0438 \u043f\u043e\u043a\u0430\u0437\u0430\u043d \u0443 \u043a\u0430\u0436\u0434\u043e\u0439 \u043c\u0430\u0448\u0438\u043d\u044b, \u043c\u0430\u0440\u0436\u0430 \u043e\u043a\u043e\u043b\u043e 6%. \u0421\u0442\u0430\u0432\u043e\u043a \u0441\u0435\u0433\u043e\u0434\u043d\u044f: '+n+' \u0438\u0437 '+L.TOTE.perDay+'.</p>'+
    '<div class="card" style="overflow:hidden"><canvas id="tote-cv" style="width:100%;height:240px;display:block"></canvas></div>'+res+
    '<div class="rows" style="margin-top:12px">'+card.o.map((o,i)=>{const w=R&&R.done&&R.win===i;return'<button class="row" data-act="totePick" data-i="'+i+'" style="min-height:62px;'+(pick===i?'box-shadow:inset 0 0 0 2px var(--accent)':'')+'"><span class="ico" style="background:var(--card2);width:70px;height:44px"><canvas data-skin="'+card.sk[i]+'" data-c1="'+TOTE_C[i]+'" data-c2="white" style="width:70px;height:44px"></canvas></span><div class="mid"><div class="tt">'+(i+1)+'. '+esc(SKINS[card.sk[i]].n)+(w?' <span class="badge" style="background:var(--yellow);color:#3a2600">1-\u0435 \u043c\u0435\u0441\u0442\u043e</span>':'')+'</div><div class="ss">\u0448\u0430\u043d\u0441 '+(pr[i]*100).toFixed(1).replace('.',',')+'%</div></div><span class="val" style="font-size:20px">\u00d7'+String(o).replace('.',',')+'</span></button>'}).join('')+'</div>'+
    (R?'':'<div class="field" style="margin-top:14px"><label>\u0421\u0442\u0430\u0432\u043a\u0430, \u043c\u043e\u043d\u0435\u0442 (\u043e\u0442 '+fmtN(L.TOTE.min)+' \u0434\u043e '+fmtN(L.TOTE.max)+')</label><input class="inp num" id="tote-amt" inputmode="numeric" value="'+tote.amt+'" data-on="toteAmt"></div>'+
    '<div class="pad" style="display:flex;gap:8px;flex-wrap:wrap">'+[500,1000,5000,20000,50000].map(v=>'<button class="pill" data-act="toteSet" data-v="'+v+'">'+fmtN(v)+'</button>').join('')+'</div>')+
    '<div class="foot" style="padding-inline:var(--g)">'+foot+'</div>';
  hydrateSkins(el);
  if(!R)ToteRace.idle($('tote-cv'),card);else if(R.done)ToteRace.still($('tote-cv'),card,R.pos,R.win);
}
const TOTE_C=['red','blue','yellow','green','purple','orange'];
ACT.totePick=el=>{if(tote.race)return;tote.pick=+el.dataset.i;Haptic.tick();Page.renderTop()};
ACT.toteSet=el=>{if(tote.race)return;tote.amt=+el.dataset.v;Page.renderTop()};
ACT.toteNext=()=>{tote.race=null;tote.pick=-1;if(!S.tote.card)run('toteNew',{},{quiet:true});Page.renderTop();const pg=[...document.querySelectorAll('.page')].pop();if(pg)pg.scrollTop=0};
ON.toteAmt=el=>{tote.amt=numIn(el.value);const b=$('tote-go');const card=S.tote.card;if(b&&tote.pick>=0&&card&&!tote.race)b.textContent='\u041f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u2116'+(tote.pick+1)+' \u00b7 \u0432\u044b\u0438\u0433\u0440\u044b\u0448 '+fmtN(Math.floor(tote.amt*card.o[tote.pick]))};
ACT.toteGo=async el=>{
  if(tote.pick<0||tote.race)return;const card=S.tote.card;if(!card)return;
  if(tote.amt<L.TOTE.min||tote.amt>L.TOTE.max){toast('\u0421\u0442\u0430\u0432\u043a\u0430 \u043e\u0442 '+fmt(L.TOTE.min)+' \u0434\u043e '+fmt(L.TOTE.max),'err');return}
  if(S.bal<tote.amt){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+fmt(tote.amt-S.bal),'err');return}
  const cardSnap={id:card.id,o:card.o.slice(),sk:card.sk.slice()};const pick=tote.pick,amt=tote.amt;
  // \u0441\u043d\u0438\u043c\u043e\u043a \u0441\u0442\u0430\u0432\u0438\u043c \u0434\u043e \u043e\u0442\u0432\u0435\u0442\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430: \u043f\u0435\u0440\u0435\u0440\u0438\u0441\u043e\u0432\u043a\u0430 \u043f\u043e\u0441\u043b\u0435 \u043e\u0442\u0432\u0435\u0442\u0430 \u043f\u043e\u043a\u0430\u0436\u0435\u0442 \u044d\u0442\u043e\u0442 \u0437\u0430\u0431\u0435\u0433, \u0430 \u043d\u0435 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439
  tote.race={card:cardSnap,pick,amt,win:-1,pay:0,done:false,pos:null};
  const r=await run('tote',{card:card.id,pick,amt},{btn:el,quiet:true});
  if(!r){tote.race=null;Page.renderTop();return}
  const R=tote.race;if(!R)return;R.win=r.win;R.pay=r.pay||0;
  Page.renderTop();
  ToteRace.race(()=>$('tote-cv'),cardSnap,r.win,pick,pos=>{
    R.pos=pos;R.done=true;
    if(r.pay){Snd.win(3);Haptic.ok()}else{Snd.bad()}
    if(tote.race===R)Page.renderTop();
    else toast(r.pay?'\u0422\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440: \u043f\u043e\u0431\u0435\u0434\u0430, +'+fmt(r.pay):'\u0422\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440: \u043f\u0435\u0440\u0432\u044b\u043c \u043f\u0440\u0438\u0448\u0451\u043b \u2116'+(r.win+1)+', \u0441\u0442\u0430\u0432\u043a\u0430 \u043d\u0435 \u0441\u044b\u0433\u0440\u0430\u043b\u0430');
  });
};
// \u0410\u043d\u0438\u043c\u0430\u0446\u0438\u044f \u0437\u0430\u0431\u0435\u0433\u0430. \u0418\u0441\u0445\u043e\u0434 \u0443\u0436\u0435 \u0440\u0435\u0448\u0451\u043d \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c \u043f\u043e \u043f\u043e\u043a\u0430\u0437\u0430\u043d\u043d\u044b\u043c \u0448\u0430\u043d\u0441\u0430\u043c \u2014 \u0430\u043d\u0438\u043c\u0430\u0446\u0438\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442 \u0435\u0433\u043e.
// \u0412\u044b\u0431\u0440\u0430\u043d\u043d\u0430\u044f \u043c\u0430\u0448\u0438\u043d\u0430 \u0441\u043d\u0430\u0447\u0430\u043b\u0430 \u043e\u0442\u0441\u0442\u0430\u0451\u0442, \u043f\u043e\u0442\u043e\u043c \u0440\u0435\u0437\u043a\u043e \u0443\u0441\u043a\u043e\u0440\u044f\u0435\u0442\u0441\u044f: \u043f\u0440\u0438 \u043f\u043e\u0431\u0435\u0434\u0435 \u0432\u044b\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0432\u043f\u0435\u0440\u0451\u0434, \u043f\u0440\u0438 \u043f\u0440\u043e\u0438\u0433\u0440\u044b\u0448\u0435 \u0447\u0443\u0442\u044c-\u0447\u0443\u0442\u044c \u043d\u0435 \u0443\u0441\u043f\u0435\u0432\u0430\u0435\u0442.
const ToteRace=(()=>{
  let raf=0;
  function lanes(c,W,H,card,pos,lead){
    const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1c3d1f');g.addColorStop(1,'#123015');c.fillStyle=g;c.fillRect(0,0,W,H);
    const lh=(H-20)/6;
    for(let i=0;i<6;i++){const y=10+i*lh;c.fillStyle=i===lead?'#3b4450':i%2?'#2a2f36':'#323840';c.fillRect(0,y,W,lh-2);c.fillStyle='rgba(255,255,255,.55)';c.font='600 11px -apple-system,Arial';c.fillText(String(i+1),6,y+lh/2+4)}
    const fx=W-40;for(let j=0;j<Math.ceil((H-20)/8);j++){c.fillStyle=j%2?'#fff':'#111';c.fillRect(fx,10+j*8,8,8);c.fillStyle=j%2?'#111':'#fff';c.fillRect(fx+8,10+j*8,8,8)}
    for(let i=0;i<6;i++){const y=10+i*lh+lh-6;const x=20+pos[i]*(fx-80);Draw.car(c,x+30,y,lh/80,{skin:card.sk[i],c1:TOTE_C[i],c2:'white',wh:'sport'},{wheelRot:pos[i]*60});
      if(i===lead){c.fillStyle='rgba(255,214,10,.9)';c.beginPath();c.moveTo(x+4,y-lh*.55);c.lineTo(x+14,y-lh*.55);c.lineTo(x+9,y-lh*.38);c.fill()}}
  }
  const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  return{
    idle(cv,card){if(!cv)return;const {c,W,H}=Draw.fit(cv);lanes(c,W,H,card,[0,0,0,0,0,0],-1)},
    still(cv,card,pos,win){if(!cv||!pos)return;const {c,W,H}=Draw.fit(cv);lanes(c,W,H,card,pos,win)},
    // getCv: \u0445\u043e\u043b\u0441\u0442 \u0438\u0449\u0435\u0442\u0441\u044f \u0437\u0430\u043d\u043e\u0432\u043e \u043a\u0430\u0436\u0434\u044b\u0439 \u043a\u0430\u0434\u0440 \u2014 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u043c\u043e\u0436\u0435\u0442 \u043f\u0435\u0440\u0435\u0440\u0438\u0441\u043e\u0432\u0430\u0442\u044c\u0441\u044f \u0432\u043e \u0432\u0440\u0435\u043c\u044f \u0437\u0430\u0431\u0435\u0433\u0430
    race(getCv,card,win,pick,done){
      cancelAnimationFrame(raf);
      const T=6.2,t0=performance.now();
      const fin=card.o.map((o,i)=>i===win?1:.82+Math.random()*.1);
      if(pick!==win)fin[pick]=.965+Math.random()*.02; // \u043f\u0440\u043e\u0438\u0433\u0440\u044b\u0448 \u00ab\u043d\u0430 \u043d\u043e\u0441\u0443\u00bb
      const pace=card.o.map(()=>.25+Math.random()*.2);
      const wig=card.o.map(()=>Math.random()*10);
      let cv=null,ctx=null,pos=fin.map(()=>0);
      const step=ts=>{
        const t=Math.min(1,(ts-t0)/1000/T);
        pos=fin.map((f,i)=>{
          let p;
          if(i===pick){const slow=Math.min(t,.62)/.62*.38;const surge=t>.62?ease((t-.62)/.38):0;p=slow+(f-.38)*surge}
          else{p=f*((.82-pace[i]*.05)*t+(.18+pace[i]*.05)*ease(t))}
          return Math.max(0,Math.min(1,p+Math.sin(t*10+wig[i])*.008*(1-t)));
        });
        let lead=0;pos.forEach((p,i)=>{if(p>pos[lead])lead=i});
        const now=getCv();if(now&&now!==cv){cv=now;ctx=Draw.fit(cv)}
        if(ctx&&cv.isConnected)lanes(ctx.c,ctx.W,ctx.H,card,pos,t<1?lead:win);
        if(t>.62&&t<.64&&pick>=0){Haptic.heavy()}
        if(t<1)raf=requestAnimationFrame(step);else done(pos);
      };raf=requestAnimationFrame(step);
    }
  };
})();

/* ---------- \u0430\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440: \u043a\u0430\u043a UPGRADER \u2014 \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c \u0438\u043b\u0438 \u0448\u0430\u043d\u0441, \u0446\u0435\u043b\u0438 \u043f\u043e\u0434\u0431\u0438\u0440\u0430\u0435\u0442 \u0441\u0435\u0440\u0432\u0435\u0440 ---------- */
let upg={kind:'box',ids:[],mode:'',target:null,anim:false};
OPEN.upgr=()=>{upg={kind:'box',ids:[],mode:'',target:null,anim:false};Page.push('upgr','\u0410\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440',renderUpg)};
ACT.upFrom=el=>{upg={kind:el.dataset.k==='inv'?'inv':'box',ids:el.dataset.id?[+el.dataset.id]:[],mode:'',target:null,anim:false};Sheet.close();Page.push('upgr','\u0410\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440',renderUpg)};
ACT.upWith=el=>{upg={kind:'box',ids:[+el.dataset.id],mode:'',target:null,anim:false};Sheet.close();Page.push('upgr','\u0410\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440',renderUpg)};
function upInV(){return upg.ids.reduce((s,id)=>{if(upg.kind==='box'){const x=S.box.find(b=>b.id===id);return s+(x?x.price:0)}const x=S.inv.find(b=>b.id===id);return s+(x?SKINS[x.v].v:0)},0)}
function upTargets(inV){
  if(upg.kind==='box'){const o=S.upo;if(!o||o.mode!==upg.mode||o.ids.length!==upg.ids.length||o.ids.some(id=>!upg.ids.includes(id)))return null;return o.list.map(p=>({id:p.id,v:p.price,it:p}))}
  if(!upg.mode)return null;return L.upSkinTargets(inV,upg.mode).slice(0,12).map(k=>({id:k,v:SKINS[k].v}));
}
function renderUpg(el){
  // \u0432\u043e \u0432\u0440\u0435\u043c\u044f \u043f\u0440\u043e\u043a\u0440\u0443\u0442\u043a\u0438 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u043c \u0441\u043d\u0438\u043c\u043e\u043a \u0441\u0442\u0430\u0432\u043a\u0438 \u0438 \u0446\u0435\u043b\u0438: \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u044b \u0443\u0436\u0435 \u0441\u043f\u0438\u0441\u0430\u043d\u044b \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c, \u043d\u043e \u0438\u0433\u0440\u043e\u043a \u0434\u043e\u043b\u0436\u0435\u043d \u0432\u0438\u0434\u0435\u0442\u044c, \u043d\u0430 \u0447\u0442\u043e \u0438\u0433\u0440\u0430\u0435\u0442
  const sp=upg.anim&&upg.spin;
  const inV=sp?sp.inV:upInV();const tg=sp?sp.tg:upTargets(inV);const t=sp?sp.t:(tg&&tg.find(x=>x.id===upg.target)||null);
  const ch=sp?sp.ch:(t&&inV?L.upChance(inV,t.v):0);const valid=t&&inV&&t.v>=inV*L.UP.minX&&!upg.anim;
  const stakeItems=sp?sp.items:upg.ids.map(id=>upg.kind==='box'?S.box.find(b=>b.id===id):S.inv.find(b=>b.id===id)).filter(Boolean);
  const mine=upg.kind==='box'?S.box.slice().sort((a,b)=>b.price-a.price):S.inv.filter(x=>x.k==='skin').sort((a,b)=>SKINS[b.v].v-SKINS[a.v].v);
  const lockWhy=x=>upg.kind==='box'?(x.pin?'\u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d':L.plateLocked(S,x.id)?'\u043d\u0430 \u043c\u0430\u0448\u0438\u043d\u0435':''):(L.skinLocked(S,x)?'\u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d':'');
  el.innerHTML='<p class="lead">\u041f\u043e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0434\u043e \u043f\u044f\u0442\u0438 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u043e\u0432 \u0438 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c \u2014 \u0441\u0435\u0440\u0432\u0435\u0440 \u043f\u043e\u0434\u0431\u0435\u0440\u0451\u0442 \u0446\u0435\u043b\u0438 \u043d\u0443\u0436\u043d\u043e\u0439 \u0446\u0435\u043d\u044b. \u0428\u0430\u043d\u0441 = \u0441\u0442\u0430\u0432\u043a\u0430 / \u0446\u0435\u043b\u044c \u00d7 0,9, \u043d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 75%. \u041f\u0440\u0438 \u043d\u0435\u0443\u0434\u0430\u0447\u0435 \u0441\u0442\u0430\u0432\u043a\u0430 \u0441\u0433\u043e\u0440\u0430\u0435\u0442.</p>'+
    '<div class="pad" style="margin-bottom:12px"><div class="segbox"><button class="'+(upg.kind==='box'?'on':'')+'" data-act="upKind" data-k="box">\u041d\u043e\u043c\u0435\u0440\u0430</button><button class="'+(upg.kind==='inv'?'on':'')+'" data-act="upKind" data-k="inv">\u0421\u043a\u0438\u043d\u044b</button></div></div>'+
    '<div class="upg">'+
      '<div class="upc"><div class="muted">\u0421\u0442\u0430\u0432\u043a\u0430</div><div class="upv">'+(stakeItems.length?(upg.kind==='box'?plateHTML(stakeItems[0]):invPreview(stakeItems[0],110,60))+(stakeItems.length>1?'<span class="badge">+'+(stakeItems.length-1)+'</span>':''):'<span class="muted" style="font-size:13px">\u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0438\u0436\u0435</span>')+'</div><div class="upp">'+(inV?COIN(inV):'\u2014')+'</div></div>'+
      '<div class="upring"><canvas id="up-cv"></canvas><div class="upct"><b class="num" id="up-pct">'+(ch?(ch*100).toFixed(2).replace('.',',')+'%':'\u2014')+'</b><small>\u0448\u0430\u043d\u0441</small></div></div>'+
      '<div class="upc"><div class="muted">\u0426\u0435\u043b\u044c</div><div class="upv">'+(t?(upg.kind==='box'?plateHTML(t.it):invPreview({v:t.id,k:'skin'},110,60)):'<span class="muted" style="font-size:13px">'+(upg.mode?'\u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0438\u0436\u0435':'\u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c')+'</span>')+'</div><div class="upp">'+(t?COIN(t.v)+'<span class="muted" style="font-size:12px"> \u00d7'+(t.v/Math.max(1,inV)).toFixed(1).replace('.',',')+'</span>':'\u2014')+'</div></div>'+
    '</div>'+
    '<div class="pad upmodes">'+Object.keys(L.UP.modes).map(m=>'<button class="'+(upg.mode===m?'on':'')+(inV?'':' off')+'" data-act="upMode" data-m="'+m+'">'+L.UP.modes[m].n+'</button>').join('')+'<button data-act="upShuf" class="'+(tg&&tg.length?'':'off')+'" aria-label="\u0421\u043b\u0443\u0447\u0430\u0439\u043d\u0430\u044f \u0446\u0435\u043b\u044c">'+ic('shuffle')+'</button></div>'+
    '<div class="pad" style="margin-top:12px"><button class="btn pri wide'+(valid?'':' off')+'" data-act="upGo">'+ic('up')+(upg.anim?'\u041a\u0440\u0443\u0442\u0438\u043c\u2026':valid?'\u041f\u0440\u043e\u043a\u0430\u0447\u0430\u0442\u044c \u00b7 \u0448\u0430\u043d\u0441 '+(ch*100).toFixed(1).replace('.',',')+'%':!inV?'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0442\u0430\u0432\u043a\u0443':!upg.mode?'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c':!t?'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0446\u0435\u043b\u044c':'\u041f\u0440\u043e\u043a\u0430\u0447\u0430\u0442\u044c')+'</button></div>'+
    (tg?'<div class="sec">\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0446\u0435\u043b\u044c <small>'+tg.length+'</small></div>'+(tg.length?'<div class="grid2">'+tg.map(x=>'<button class="mat" data-act="upT" data-id="'+x.id+'" style="display:grid;gap:6px;padding:10px;background:var(--card);'+(upg.target===x.id?'box-shadow:inset 0 0 0 2px var(--accent);':'')+'">'+(upg.kind==='box'?plateHTML(x.it):invPreview({v:x.id,k:'skin'},110,60)+'<span style="font:600 13px var(--f-ui)">'+esc(SKINS[x.id].n)+'</span>')+'<span style="display:flex;justify-content:space-between;align-items:center"><span style="font:600 14px var(--f-ui)">'+COIN(x.v)+'</span><span class="badge">'+(L.upChance(inV,x.v)*100).toFixed(1).replace('.',',')+'%</span></span></button>').join('')+'</div>':'<div class="empty">\u0426\u0435\u043b\u0435\u0439 \u0442\u0430\u043a\u043e\u0439 \u0446\u0435\u043d\u044b \u043d\u0435\u0442. \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0439 \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c</div>'):'')+
    '<div class="sec">\u041c\u043e\u0438 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u044b <small>'+upg.ids.length+' \u0438\u0437 '+L.UP.max+'</small></div>'+(mine.length?'<div class="grid2">'+mine.slice(0,80).map(x=>{const on=upg.ids.includes(x.id);const why=lockWhy(x);return'<button class="mat'+(why?' dis':'')+'" data-act="upPick" data-id="'+x.id+'" style="display:grid;gap:6px;padding:10px;background:var(--card);position:relative;'+(on?'box-shadow:inset 0 0 0 2px var(--accent)':'')+'">'+(upg.kind==='box'?plateHTML(x):invPreview(x,110,60))+'<span style="font:600 14px var(--f-ui)">'+COIN(upg.kind==='box'?x.price:SKINS[x.v].v)+'</span>'+(why?'<span class="lockb">'+ic('lock')+'\u043d\u0435\u043b\u044c\u0437\u044f \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c: '+why+'</span>':'')+'</button>'}).join('')+'</div>':'<div class="empty">\u041d\u0435\u0447\u0435\u0433\u043e \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c</div>')+
    (S.up.length?'<div class="sec">\u0418\u0441\u0442\u043e\u0440\u0438\u044f</div><div class="group">'+S.up.slice().reverse().map(h=>'<div class="li noic"><span class="lt">'+(h.win?'\u0423\u0441\u043f\u0435\u0445':'\u041d\u0435\u0443\u0434\u0430\u0447\u0430')+' \u00b7 \u0448\u0430\u043d\u0441 '+String(h.ch).replace('.',',')+'%</span><span class="lv num" style="color:'+(h.win?'var(--green)':'var(--red)')+'">'+(h.win?'+'+fmtN(h.out):'\u2212'+fmtN(h.in))+'</span></div>').join('')+'</div>':'');
  hydrateSkins(el);upGauge(ch,sp?sp.at:null);
}
function upGauge(ch,roll){
  const cv=$('up-cv');if(!cv)return;const {c,W,H}=Draw.fit(cv);const cx=W/2,cy=H/2,r=Math.min(W,H)/2-10;
  c.lineWidth=12;c.lineCap='round';c.strokeStyle='rgba(118,118,128,.3)';c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.stroke();
  if(ch>0){const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#ffd60a');g.addColorStop(1,'#ff8a00');c.strokeStyle=g;c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+ch*Math.PI*2);c.stroke()}
  if(roll!=null){const a=-Math.PI/2+roll*Math.PI*2;c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--text')||'#fff';c.beginPath();c.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,8,0,Math.PI*2);c.fill()}
}
ACT.upKind=el=>{upg={kind:el.dataset.k,ids:[],mode:'',target:null,anim:false};Page.renderTop()};
ACT.upPick=el=>{
  if(upg.anim)return;const id=+el.dataset.id;
  if(el.classList.contains('dis')){toast(upg.kind==='box'?'\u0417\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d\u043d\u044b\u0435 \u0438 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044b\u0435 \u043d\u0430 \u043c\u0430\u0448\u0438\u043d\u0443 \u043d\u043e\u043c\u0435\u0440\u0430 \u043d\u0435\u043b\u044c\u0437\u044f \u0441\u0442\u0430\u0432\u0438\u0442\u044c':'\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044b\u0439 \u0441\u043a\u0438\u043d \u043d\u0435\u043b\u044c\u0437\u044f \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c. \u041f\u043e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u043d\u0430 \u043c\u0430\u0448\u0438\u043d\u0443 \u0434\u0440\u0443\u0433\u043e\u0439','err');return}
  if(upg.ids.includes(id))upg.ids=upg.ids.filter(x=>x!==id);else if(upg.ids.length<L.UP.max)upg.ids.push(id);else{toast('\u041d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u043f\u044f\u0442\u0438 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u043e\u0432');return}
  upg.target=null;Haptic.tick();
  if(upg.mode&&upg.ids.length)upLoad();else Page.renderTop();
};
ACT.upMode=el=>{if(upg.anim)return;if(!upg.ids.length){toast('\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u044b \u0434\u043b\u044f \u0441\u0442\u0430\u0432\u043a\u0438','err');return}upg.mode=el.dataset.m;upg.target=null;Haptic.tick();upLoad()};
async function upLoad(){
  if(upg.kind==='inv'){Page.renderTop();return}
  Page.renderTop();
  const r=await run('upOffer',{kind:'box',ids:upg.ids,mode:upg.mode},{quiet:true,key:'upOffer'});
  if(r&&S.upo&&S.upo.list.length){const inV=upInV();const want=L.upGoal(inV,upg.mode);let best=S.upo.list[0];S.upo.list.forEach(p=>{if(Math.abs(p.price-want)<Math.abs(best.price-want))best=p});upg.target=best.id}
  Page.renderTop();
}
ACT.upT=el=>{if(upg.anim)return;const id=el.dataset.id;upg.target=upg.kind==='box'?+id:id;Haptic.tick();Page.renderTop()};
ACT.upShuf=()=>{const tg=upTargets(upInV());if(!tg||!tg.length)return;upg.target=L.pick(tg).id;Haptic.tick();Page.renderTop()};
ACT.upGo=async el=>{
  if(upg.anim)return;
  const inV=upInV();const tg=upTargets(inV);const tt=tg&&tg.find(x=>x.id===upg.target);if(!tt)return;
  const items=upg.ids.map(id=>upg.kind==='box'?S.box.find(b=>b.id===id):S.inv.find(b=>b.id===id)).filter(Boolean).map(x=>Object.assign({},x));
  upg.spin={inV,tg,t:tt,ch:L.upChance(inV,tt.v),items,at:null};upg.anim=true;
  const r=await run('up',{kind:upg.kind,ids:upg.ids,target:upg.target},{btn:el,quiet:true});
  if(!r){upg.anim=false;upg.spin=null;Page.renderTop();return}
  upg.spin.ch=r.ch;Page.renderTop();
  const T=3.2,t0=performance.now();const turns=4;
  const step=ts=>{const t=Math.min(1,(ts-t0)/1000/T);const k=1-Math.pow(1-t,3.2);const v=(turns+r.roll)*k;if(upg.spin)upg.spin.at=v%1;upGauge(r.ch,v%1);if(Math.floor(v*12)!==Math.floor(((turns+r.roll)*(1-Math.pow(1-Math.max(0,t-.016),3.2)))*12))Snd.tick();
    if(t<1)requestAnimationFrame(step);else{
      upg.anim=false;upg.spin=null;
      if(r.win){toast('\u0410\u043f\u0433\u0440\u0435\u0439\u0434 \u0443\u0434\u0430\u043b\u0441\u044f! +'+fmt(r.tv));Snd.win(4);Haptic.ok()}else{toast('\u041d\u0435 \u043f\u043e\u0432\u0435\u0437\u043b\u043e. \u0421\u0442\u0430\u0432\u043a\u0430 \u0441\u0433\u043e\u0440\u0435\u043b\u0430');Snd.bad();Haptic.err()}
      upg.ids=[];upg.target=null;setTimeout(()=>Page.renderTop(),900);
    }};requestAnimationFrame(step);
};

/* ---------- \u043a\u043b\u0438\u043a\u0435\u0440 ---------- */
let clk=null;
OPEN.clicker=()=>Page.push('clicker','\u041a\u043b\u0438\u043a\u0435\u0440',renderClicker,{onClose:()=>{if(clk&&clk.on)toast('\u0421\u0435\u0441\u0441\u0438\u044f \u043a\u043b\u0438\u043a\u0435\u0440\u0430 \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0430\u0435\u0442\u0441\u044f, \u0432\u0435\u0440\u043d\u0438\u0442\u0435\u0441\u044c, \u0447\u0442\u043e\u0431\u044b \u0437\u0430\u0431\u0440\u0430\u0442\u044c \u043d\u0430\u0433\u0440\u0430\u0434\u0443')}});
function renderClicker(el){
  if(clk&&clk.on){
    el.innerHTML='<p class="lead">\u0416\u043c\u0438\u0442\u0435 \u043d\u0430 \u043a\u043d\u043e\u043f\u043a\u0443. \u0417\u0430\u0441\u0447\u0438\u0442\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0434\u043e '+L.CLICK.cps+' \u043d\u0430\u0436\u0430\u0442\u0438\u0439 \u0432 \u0441\u0435\u043a\u0443\u043d\u0434\u0443, \u043a\u0430\u0436\u0434\u043e\u0435 \u2014 '+fmt(L.CLICK.pay)+'.</p><div style="display:grid;justify-items:center;gap:14px;padding:10px 0"><div style="font:800 64px/1 var(--f-ui)" class="num" id="clk-n">'+clk.n+'</div><div class="muted num" id="clk-t">'+Math.ceil(clk.left)+' \u0441</div><button id="clk-btn" style="width:220px;height:220px;border-radius:50%;background:linear-gradient(180deg,#ffd426,#f0a800);box-shadow:0 14px 40px rgba(240,168,0,.45),inset 0 2px 0 rgba(255,255,255,.5);color:#3a2600;font:800 28px var(--f-ui);touch-action:manipulation">\u0416\u041c\u0418</button><div class="muted num" id="clk-m">'+fmt(clk.n*L.CLICK.pay)+'</div></div>';
    const b=$('clk-btn');b.addEventListener('pointerdown',e=>{e.preventDefault();clickTap()});
    return;
  }
  const max=L.CLICK.sec*L.CLICK.cps*L.CLICK.pay;
  el.innerHTML='<p class="lead">\u041e\u0434\u043d\u0430 \u043c\u0438\u043d\u0443\u0442\u0430 \u043a\u043b\u0438\u043a\u043e\u0432 \u0441\u0442\u043e\u0438\u0442 '+keyN(L.CLICK.keys)+' ('+fmt(L.CLICK.keys*L.KEY_COINS)+'). \u0414\u043e '+L.CLICK.cps+' \u043d\u0430\u0436\u0430\u0442\u0438\u0439 \u0432 \u0441\u0435\u043a\u0443\u043d\u0434\u0443, \u043a\u0430\u0436\u0434\u043e\u0435 \u043f\u0440\u0438\u043d\u043e\u0441\u0438\u0442 '+fmt(L.CLICK.pay)+'. \u041c\u0430\u043a\u0441\u0438\u043c\u0443\u043c \u0437\u0430 \u0441\u0435\u0441\u0441\u0438\u044e \u2014 '+fmt(max)+'.</p>'+
    '<div class="gc g-yellow" style="margin:0 var(--g);height:200px"><span class="art" style="right:14px;top:14px;width:90px;height:90px;color:rgba(255,255,255,.55)">'+ic('tap')+'</span><span class="k">\u0423 \u0432\u0430\u0441 '+keyN(S.keys)+'</span><span class="t" style="font-size:24px">\u041a\u043b\u0438\u043a\u0435\u0440</span><span class="s">60 \u0441\u0435\u043a\u0443\u043d\u0434, \u0447\u0442\u043e\u0431\u044b \u043d\u0430\u0431\u0440\u0430\u0442\u044c \u043a\u0430\u043a \u043c\u043e\u0436\u043d\u043e \u0431\u043e\u043b\u044c\u0448\u0435</span><span class="act"><button class="pill on-card" data-act="clickStart">'+ic('key')+'\u041d\u0430\u0447\u0430\u0442\u044c \u0437\u0430 '+keyN(L.CLICK.keys)+'</button></span></div>';
}
ACT.clickStart=async el=>{
  if(S.keys<L.CLICK.keys){toast('\u041d\u0443\u0436\u043d\u043e '+keyN(L.CLICK.keys)+'. \u041a\u043b\u044e\u0447\u0438 \u0434\u0430\u044e\u0442 \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b, \u0437\u0430\u0434\u0430\u043d\u0438\u044f, \u043e\u0433\u043e\u043d\u0451\u043a \u0438 \u0434\u043e\u043d\u0430\u0442','err');return}
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
  try{const r=await act('clickEnd',{id:c.id,n:c.n});toast(r.msg);Snd.coin()}catch(e){toast(e.message,e.pending?'':'err')}
  clk=null;render();
}

/* ---------- \u0431\u0430\u043d\u043a ---------- */
let bk={a:10000,d:7};
OPEN.bank=()=>Page.push('bank','\u0411\u0430\u043d\u043a',renderBank);
function renderBank(el){
  const t=now();const tot=S.bank.reduce((s,b)=>s+b.a,0);
  el.innerHTML='<p class="lead">1% \u0432 \u0434\u0435\u043d\u044c, \u0441\u0440\u043e\u043a \u0434\u043e '+L.BANK.maxDays+' \u0434\u043d\u0435\u0439, \u0432\u043e \u0432\u043a\u043b\u0430\u0434\u0430\u0445 \u0434\u043e '+fmt(L.BANK.cap)+'. \u0415\u0441\u043b\u0438 \u0437\u0430\u0431\u0440\u0430\u0442\u044c \u0440\u0430\u043d\u044c\u0448\u0435 \u0441\u0440\u043e\u043a\u0430 \u2014 \u0432\u0435\u0440\u043d\u0451\u0442\u0441\u044f \u0441\u0443\u043c\u043c\u0430 \u043c\u0438\u043d\u0443\u0441 '+Math.round(L.BANK.pen*100)+'%, \u0431\u0435\u0437 \u043f\u0440\u043e\u0446\u0435\u043d\u0442\u043e\u0432.</p>'+
    (S.bank.length?'<div class="rows">'+S.bank.map(b=>{const end=b.t+b.d*864e5,ready=t>=end,p=Math.min(1,(t-b.t)/(end-b.t));return'<div class="row"><span class="ico" style="background:var(--teal)">'+ic('bank')+'</span><div class="mid"><div class="tt num">'+fmtN(b.a)+' \u2192 '+fmtN(Math.floor(b.a*(1+L.BANK.rate*b.d)))+'</div><div class="ss">'+(ready?'\u0413\u043e\u0442\u043e\u0432\u043e \u043a \u0432\u044b\u0434\u0430\u0447\u0435':'\u041e\u0441\u0442\u0430\u043b\u043e\u0441\u044c '+left(end-t))+'</div><div class="bar" style="margin-top:8px"><i style="width:'+(p*100).toFixed(1)+'%;background:linear-gradient(90deg,#6fe6ef,var(--teal))"></i></div></div><button class="pill" data-act="bankTake" data-id="'+b.id+'" data-r="'+(ready?1:0)+'">'+(ready?'\u0417\u0430\u0431\u0440\u0430\u0442\u044c':'\u0414\u043e\u0441\u0440\u043e\u0447\u043d\u043e')+'</button></div>'}).join('')+'</div>':'')+
    '<div class="sec">\u041d\u043e\u0432\u044b\u0439 \u0432\u043a\u043b\u0430\u0434</div>'+
    '<div class="field"><label>\u0421\u0443\u043c\u043c\u0430, \u043c\u043e\u043d\u0435\u0442</label><input class="inp num" id="bk-a" inputmode="numeric" value="'+bk.a+'" data-on="bkA"></div>'+
    '<div class="field"><label>\u0421\u0440\u043e\u043a: <b id="bk-dl">'+bk.d+' '+plural(bk.d,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439')+'</b></label><input type="range" min="1" max="'+L.BANK.maxDays+'" value="'+bk.d+'" data-on="bkD" style="width:100%;accent-color:var(--teal)"></div>'+
    '<div class="card p" style="display:flex;justify-content:space-between"><span class="muted">\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u0435</span><b class="num" id="bk-res">'+fmt(Math.floor(bk.a*(1+L.BANK.rate*bk.d)))+'</b></div>'+
    '<div class="pad" style="margin-top:12px"><button class="btn pri wide'+(S.bank.length>=L.BANK.maxN?' off':'')+'" data-act="bankPut">'+(S.bank.length>=L.BANK.maxN?'\u041d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 '+L.BANK.maxN+' \u0432\u043a\u043b\u0430\u0434\u043e\u0432':'\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0432\u043a\u043b\u0430\u0434')+'</button></div><p class="note">\u0421\u0435\u0439\u0447\u0430\u0441 \u0432\u043e \u0432\u043a\u043b\u0430\u0434\u0430\u0445 '+fmt(tot)+'.</p>';
}
ON.bkA=el=>{bk.a=numIn(el.value);const r=$('bk-res');if(r)r.textContent=fmt(Math.floor(bk.a*(1+L.BANK.rate*bk.d)))};
ON.bkD=el=>{bk.d=+el.value;const l=$('bk-dl');if(l)l.textContent=bk.d+' '+plural(bk.d,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439');ON.bkA({value:String(bk.a)})};
ACT.bankPut=el=>run('bankPut',{a:bk.a,d:bk.d},{btn:el});
ACT.bankTake=el=>{const go=()=>run('bankTake',{id:el.dataset.id},{btn:el,ok:()=>Snd.coin()});if(el.dataset.r==='1')go();else confirmSheet('\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u0434\u043e\u0441\u0440\u043e\u0447\u043d\u043e?','\u041f\u0440\u043e\u0446\u0435\u043d\u0442\u044b \u0441\u0433\u043e\u0440\u044f\u0442, \u0430 \u0441\u043e \u0432\u043a\u043b\u0430\u0434\u0430 \u0441\u043f\u0438\u0448\u0435\u0442\u0441\u044f '+Math.round(L.BANK.pen*100)+'%.','\u0417\u0430\u0431\u0440\u0430\u0442\u044c',go,true)};

/* ---------- \u043e\u0431\u043c\u0435\u043d: \u043a\u043b\u044e\u0447\u0438 \u0432 \u043c\u043e\u043d\u0435\u0442\u044b ---------- */
let ex={n:10};
OPEN.exch=()=>Page.push('exch','\u041e\u0431\u043c\u0435\u043d \u043a\u043b\u044e\u0447\u0435\u0439',renderExch);
function renderExch(el){
  ex.n=Math.max(1,Math.min(ex.n,Math.max(1,S.keys)));
  el.innerHTML='<p class="lead">1 \u043a\u043b\u044e\u0447 = '+fmt(L.KEY_COINS)+'. \u041e\u0431\u043c\u0435\u043d \u0432 \u043e\u0434\u043d\u0443 \u0441\u0442\u043e\u0440\u043e\u043d\u0443: \u043c\u043e\u043d\u0435\u0442\u044b \u0432 \u043a\u043b\u044e\u0447\u0438 \u043d\u0435 \u043e\u0431\u043c\u0435\u043d\u0438\u0432\u0430\u044e\u0442\u0441\u044f. \u041a\u043b\u044e\u0447\u0438 \u043c\u043e\u0436\u043d\u043e \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0432 \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u0430\u0445, \u0437\u0430\u0434\u0430\u043d\u0438\u044f\u0445, \u0437\u0430 \u043e\u0433\u043e\u043d\u0451\u043a \u0438 \u0432 \u0434\u043e\u043d\u0430\u0442\u0435.</p>'+
    '<div class="card p" style="display:grid;gap:14px"><div style="display:flex;align-items:center;justify-content:space-between"><span class="muted">\u041e\u0442\u0434\u0430\u0451\u0442\u0435</span><b class="num" style="font-size:20px">'+keyN(ex.n)+'</b></div><div style="display:flex;align-items:center;justify-content:space-between"><span class="muted">\u041f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435</span><b class="num" style="font-size:20px">'+fmt(ex.n*L.KEY_COINS)+'</b></div>'+
    '<div style="display:flex;gap:8px;align-items:center"><button class="iconbtn" data-act="exN" data-d="-1" aria-label="\u041c\u0435\u043d\u044c\u0448\u0435">\u2212</button><input class="inp num" style="text-align:center" inputmode="numeric" value="'+ex.n+'" data-on="exN"><button class="iconbtn" data-act="exN" data-d="1" aria-label="\u0411\u043e\u043b\u044c\u0448\u0435">'+ic('plus')+'</button></div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap">'+[1,10,50,100].map(v=>'<button class="pill" data-act="exSet" data-v="'+v+'">'+v+'</button>').join('')+'<button class="pill" data-act="exMax">\u0412\u0441\u0435 ('+fmtN(S.keys)+')</button></div></div>'+
    '<div class="pad" style="margin-top:12px"><button class="btn pri wide'+(S.keys<1?' off':'')+'" data-act="exGo">\u041e\u0431\u043c\u0435\u043d\u044f\u0442\u044c</button></div>'+
    '<div class="pad" style="margin-top:10px"><button class="btn md wide" data-act="topup" data-c="keys">'+ic('star')+'\u041a\u0443\u043f\u0438\u0442\u044c \u043a\u043b\u044e\u0447\u0438 \u0437\u0430 Stars</button></div>';
}
ACT.exN=el=>{ex.n=Math.max(1,ex.n+(+el.dataset.d));Page.renderTop()};
ACT.exSet=el=>{ex.n=+el.dataset.v;Page.renderTop()};
ACT.exMax=()=>{ex.n=Math.max(1,S.keys);Page.renderTop()};
ON.exNChange=el=>{ex.n=Math.max(1,numIn(el.value)||1);Page.renderTop()};
ACT.exGo=el=>{if(ex.n>S.keys){toast('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043a\u043b\u044e\u0447\u0435\u0439','err');return}confirmSheet('\u041e\u0431\u043c\u0435\u043d\u044f\u0442\u044c?',keyN(ex.n)+' \u2192 '+fmt(ex.n*L.KEY_COINS)+'. \u041e\u0431\u0440\u0430\u0442\u043d\u043e \u043c\u043e\u043d\u0435\u0442\u044b \u0432 \u043a\u043b\u044e\u0447\u0438 \u043d\u0435 \u043e\u0431\u043c\u0435\u043d\u0438\u0432\u0430\u044e\u0442\u0441\u044f.','\u041e\u0431\u043c\u0435\u043d\u044f\u0442\u044c',()=>run('k2c',{n:ex.n},{ok:()=>Snd.coin()}))};
const shortN=n=>n>=1e9?(n/1e9).toFixed(1).replace('.',',')+' \u043c\u043b\u0440\u0434':n>=1e6?(n/1e6).toFixed(1).replace('.',',')+' \u043c\u043b\u043d':n>=1e4?Math.round(n/1e3)+' \u0442\u044b\u0441':fmtN(n);

/* ================= \u0432\u043a\u043b\u0430\u0434\u043a\u0430 \u00ab\u0421\u0435\u0437\u043e\u043d\u00bb: \u0435\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430, \u043e\u0433\u043e\u043d\u0451\u043a, \u043d\u0435\u0434\u0435\u043b\u044f, \u0437\u0430\u0434\u0430\u043d\u0438\u044f, \u043f\u0440\u043e\u043f\u0443\u0441\u043a ================= */
function rewardIcon(r){
  if(!r)return'';
  if(r.m)return'<span style="color:var(--gold);width:30px;height:30px;display:grid;place-items:center"><i class="coin" style="width:26px;height:26px"></i></span>';
  if(r.k)return'<span style="color:var(--teal)">'+ic('key')+'</span>';
  if(r.sc)return'<span style="color:var(--purple)">'+ic('car')+'</span>';
  if(r.tc)return'<span style="color:var(--pink)">'+ic('sticker')+'</span>';
  if(r.pv)return'<span>'+caseArt(r.pv.t).replace('width="74" height="74"','width="32" height="32"')+'</span>';
  if(r.skin)return'<canvas data-skin="'+r.skin+'" style="width:76px;height:40px"></canvas>';
  if(r.plate)return plateHTML(L.SPECIAL[r.plate]);
  return'';
}
function rwShort(r){if(r.m)return{a:shortN(r.m),b:'\u043c\u043e\u043d\u0435\u0442'};if(r.k)return{a:keyN(r.k),b:'\u043a\u043b\u044e\u0447\u0438'};if(r.sc)return{a:'\u041a\u0435\u0439\u0441'+(r.sc>1?' \u00d7'+r.sc:''),b:'\u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438'};if(r.tc)return{a:'\u041a\u0435\u0439\u0441'+(r.tc>1?' \u00d7'+r.tc:''),b:'\u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438'};if(r.pv)return{a:TIERS[r.pv.t].name+' \u00d7'+r.pv.n,b:'\u043a\u0435\u0439\u0441\u044b \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e'};if(r.skin)return{a:SKINS[r.skin].n,b:'\u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u043a\u0438\u043d'};if(r.plate)return{a:'\u041d\u043e\u043c\u0435\u0440',b:'\u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439'};return L.rewardText(r)}
function dailyCard(t){
  const F=S.fire;const ready=L.dayReady(S,t);const alive=L.fireAlive(S,t);const n=alive?F.n:0;
  const mid=L.mskMidnight(t);const toNext=L.FIRE.every-(n%L.FIRE.every);
  const fix=L.fireCanFix(S,t);const fixAt=L.fireFixAt(S);
  return'<div class="card p daily"><div style="display:flex;align-items:center;gap:14px">'+
    '<div class="flame'+(alive&&!ready?' lit':alive?' warm':'')+'">'+ic('fire')+'<b class="num">'+n+'</b></div>'+
    '<div style="flex:1;min-width:0"><div style="font:700 18px var(--f-ui)">'+(ready?'\u0415\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430':'\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430')+'</div>'+
      '<div class="muted" style="font-size:14px">'+(ready?fmt(L.DAILY_M)+(n?' \u00b7 \u043e\u0433\u043e\u043d\u0451\u043a '+n+' '+plural(n,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439'):' \u00b7 \u0437\u0430\u0436\u0433\u0438\u0442\u0435 \u043e\u0433\u043e\u043d\u0451\u043a'):'\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u0447\u0435\u0440\u0435\u0437 <span data-left="'+mid+'">'+left(mid-t)+'</span>')+'</div>'+
      '<div class="muted" style="font-size:13px;margin-top:2px">'+(n?'\u0415\u0449\u0451 '+toNext+' '+plural(toNext,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439')+' \u0434\u043e +'+keyN(L.FIRE.keys)+' \u00b7 \u0440\u0435\u043a\u043e\u0440\u0434 '+F.best:'\u041a\u0430\u0436\u0434\u044b\u0435 '+L.FIRE.every+' \u0434\u043d\u0435\u0439 \u043f\u043e\u0434\u0440\u044f\u0434 \u2014 +'+keyN(L.FIRE.keys))+'</div></div></div>'+
    (ready?'<button class="btn pri wide" style="margin-top:14px" data-act="dayClaim">'+ic('gift')+'\u0417\u0430\u0431\u0440\u0430\u0442\u044c '+fmt(L.DAILY_M)+'</button>':'')+
    (fix?'<div class="row" style="margin-top:12px;background:rgba(10,132,255,.12);min-height:0"><div class="mid"><div class="tt" style="white-space:normal;font-size:16px">\u041e\u0433\u043e\u043d\u0451\u043a \u043f\u043e\u0433\u0430\u0441 \u043f\u043e\u0441\u043b\u0435 '+F.lost.n+' '+plural(F.lost.n,'\u0434\u043d\u044f','\u0434\u043d\u0435\u0439','\u0434\u043d\u0435\u0439')+'</div><div class="ss" style="white-space:normal">\u0420\u0430\u0437\u043c\u043e\u0440\u043e\u0437\u0438\u0442\u044c \u043c\u043e\u0436\u043d\u043e \u0440\u0430\u0437 \u0432 3 \u043c\u0435\u0441\u044f\u0446\u0430 \u2014 \u0441\u0435\u0440\u0438\u044f \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u0441\u044f</div></div><button class="pill" data-act="fireFix" style="background:var(--blue);color:#fff">\u0420\u0430\u0437\u043c\u043e\u0440\u043e\u0437\u0438\u0442\u044c</button></div>':
      F.lost&&F.d===L.mskDate(t)&&fixAt>t?'<p class="note" style="margin:10px 0 0">\u041e\u0433\u043e\u043d\u0451\u043a \u043f\u043e\u0433\u0430\u0441. \u0420\u0430\u0437\u043c\u043e\u0440\u043e\u0437\u043a\u0430 \u0441\u043d\u043e\u0432\u0430 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430 '+dateRu(fixAt)+'.</p>':'')+
  '</div>';
}
function rbCard(t){
  const r=S.rb;if(!r||r.st==='done')return'';
  if(r.st==='wait'){const need=L.REF_LVL*L.SEASON.lvlXp;const p=Math.min(1,S.xp/need);
    return'<div class="card p" style="margin-top:12px"><div style="display:flex;align-items:center;gap:12px">'+ring(p,'var(--orange)')+'<div style="flex:1"><div style="font:600 16px var(--f-ui)">\u041f\u043e\u0434\u0430\u0440\u043e\u043a \u043e\u0442 \u0434\u0440\u0443\u0433\u0430 '+esc(r.by)+'</div><div class="muted" style="font-size:14px">\u0414\u043e\u0439\u0434\u0438\u0442\u0435 \u0434\u043e '+L.REF_LVL+' \u0443\u0440\u043e\u0432\u043d\u044f \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430 \u2014 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 '+fmt(r.tot)+' \u0437\u0430 '+L.INV_DAYS+' \u0434\u043d\u0435\u0439. \u0421\u0435\u0439\u0447\u0430\u0441 \u0443\u0440\u043e\u0432\u0435\u043d\u044c '+L.level(S)+'.</div></div></div></div>'}
  const ready=L.rbReady(S,t);const part=L.rbPart(r);
  return'<div class="card p" style="margin-top:12px"><div style="display:flex;align-items:center;gap:12px">'+ring(r.got/L.INV_DAYS,'var(--orange)')+'<div style="flex:1"><div style="font:600 16px var(--f-ui)">\u0411\u043e\u043d\u0443\u0441 \u043e\u0442 \u0434\u0440\u0443\u0433\u0430 '+esc(r.by)+'</div><div class="muted" style="font-size:14px">\u0414\u0435\u043d\u044c '+Math.min(L.INV_DAYS,r.got+(ready?1:0))+' \u0438\u0437 '+L.INV_DAYS+' \u00b7 \u0432\u0441\u0435\u0433\u043e '+fmt(r.tot)+'</div></div>'+(ready?'<button class="pill" data-act="rbClaim" style="background:var(--accent);color:#fff">+'+fmtN(part)+'</button>':'<span class="muted" style="font-size:13px">\u0437\u0430\u0432\u0442\u0440\u0430</span>')+'</div></div>';
}
RENDER.season=()=>{
  const el=$('t-season');const t=now();const lv=L.level(S),pct=L.lvlPct(S),prem=L.isPrem(S,t),on=L.seasonOn(t);
  L.ensureDaily(S,t);L.weekTick(S,t,false);
  const days=Math.max(0,Math.ceil((L.SEASON.end-t)/864e5));
  const cl=L.claimable(S,t);
  // \u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430
  const W=S.week;const wp=Math.min(1,W.xp/L.WEEK_XP);const wReady=W.xp>=L.WEEK_XP;const wDone=W.got.length>=2;
  const wEnd=L.weekEnd(t);
  const weekCard='<div class="card p" style="margin-top:0"><div style="display:flex;align-items:center;gap:12px">'+ring(wp,'var(--teal)')+'<div style="flex:1"><div style="font:600 17px var(--f-ui)">'+(wDone?'\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043d\u0435\u0434\u0435\u043b\u0438 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430':wReady?'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 2 \u043d\u0430\u0433\u0440\u0430\u0434\u044b \u0438\u0437 4':'\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043d\u0435\u0434\u0435\u043b\u0438')+'</div><div class="muted num" style="font-size:14px">'+(wReady&&!wDone?'\u041c\u043e\u0436\u043d\u043e \u0437\u0430\u0431\u0440\u0430\u0442\u044c \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u043d\u0435\u0434\u0435\u043b\u0438':fmtN(Math.min(W.xp,L.WEEK_XP))+' \u0438\u0437 '+fmtN(L.WEEK_XP)+' \u043e\u043f\u044b\u0442\u0430')+' \u00b7 \u043d\u043e\u0432\u0430\u044f \u043d\u0435\u0434\u0435\u043b\u044f \u0447\u0435\u0440\u0435\u0437 <span data-left="'+wEnd+'">'+left(wEnd-t)+'</span></div></div></div>'+
    '<div class="grid2" style="padding:0;margin-top:14px">'+W.opts.map((o,i)=>{const got=W.got.includes(i);const tx=rwShort(o);return'<button class="rw'+(got?' ready':'')+'" data-act="weekPick" data-i="'+i+'" style="height:96px;background:var(--card2);'+(!wReady||wDone&&!got?'opacity:.55;':'')+(got?'box-shadow:inset 0 0 0 2px var(--green)':'')+'">'+(o.k===100?'<span style="color:var(--teal)">'+ic('key')+'</span><b>100 \u043a\u043b\u044e\u0447\u0435\u0439</b><small>\u0432\u0441\u0435\u0433\u0434\u0430 \u0432 \u0432\u044b\u0431\u043e\u0440\u0435</small>':rewardIcon(o)+'<b>'+esc(tx.a)+'</b><small>'+esc(tx.b)+'</small>')+(got?'<span class="lk" style="position:absolute;top:6px;right:6px;width:16px;height:16px;color:var(--green)">'+ic('check')+'</span>':'')+'</button>'}).join('')+'</div></div>';
  // \u0437\u0430\u0434\u0430\u043d\u0438\u044f
  const quests='<div class="rows">'+S.daily.q.map(q=>{const Q=L.QUESTS[q],p=Math.min(Q.g,+S.daily.p[q]||0),done=S.daily.done.includes(q),ready=p>=Q.g&&!done;
    return'<div class="row">'+ring(p/Q.g,done?'var(--green)':'var(--accent)')+'<div class="mid"><div class="tt" style="white-space:normal;font-size:16px">'+esc(Q.t)+'</div><div class="ss num">'+(done?'\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e':fmtN(p)+' \u0438\u0437 '+fmtN(Q.g))+' \u00b7 \u043d\u0430\u0433\u0440\u0430\u0434\u0430: '+esc(L.rewardText(Q.r).a)+' \u0438 '+L.QUEST_XP+' \u043e\u043f\u044b\u0442\u0430</div></div>'+(ready?'<button class="pill" data-act="questClaim" data-id="'+q+'" style="background:var(--accent);color:#fff">\u0417\u0430\u0431\u0440\u0430\u0442\u044c</button>':done?'<span style="width:22px;height:22px;color:var(--green)">'+ic('check')+'</span>':'')+'</div>'}).join('')+'</div>';
  // \u0442\u0440\u0435\u043a \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430
  const cols=[];
  for(let i=1;i<=L.SEASON.max;i++){
    const f=L.FREE[i],p=L.PREM[i];const fGot=S.cf.includes(i),pGot=S.cp.includes(i);const reach=i<=lv;
    const cell=(r,got,pre)=>{const tx=rwShort(r);const ready=reach&&!got&&(!pre||prem);return'<button class="rw'+(pre?' prem':'')+(ready?' ready':'')+(got?' got':'')+(pre&&!prem?' lock':'')+'" data-act="claim" data-t="'+(pre?'p':'f')+'" data-l="'+i+'">'+rewardIcon(r)+'<b>'+esc(tx.a)+'</b><small>'+esc(tx.b)+'</small>'+(pre&&!prem?'<span class="lk">'+ic('lock')+'</span>':'')+'</button>'};
    cols.push('<div class="pcol'+(i===lv+1?' cur':'')+'" id="lv-'+i+'"><div class="n">'+(i===30||i===100?'\u2605 ':'')+i+'</div>'+cell(f,fGot,false)+cell(p,pGot,true)+'</div>');
  }
  const top=(Net.top||[]).slice(0,30);
  el.innerHTML=topHTML('\u0421\u0435\u0437\u043e\u043d')+
    '<div class="hero g-red" style="margin-top:14px;background:var(--gc);min-height:330px"><canvas id="ssn-art"></canvas>'+
      '<div style="position:absolute;left:16px;top:6px;font:800 120px/1 var(--f-ui);letter-spacing:-.06em;color:var(--num);z-index:-1" class="num">'+lv+'</div>'+
      '<p style="margin:0 0 4px;color:var(--tint)">\u0421\u0435\u0437\u043e\u043d 1, '+(on?'\u0435\u0449\u0451 '+days+' '+plural(days,'\u0434\u0435\u043d\u044c','\u0434\u043d\u044f','\u0434\u043d\u0435\u0439'):'\u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d')+'</p><h3>\u00ab'+esc(L.SEASON.name)+'\u00bb</h3><p>\u0423\u0440\u043e\u0432\u0435\u043d\u044c '+lv+' \u0438\u0437 '+L.SEASON.max+(lv<L.SEASON.max?' \u00b7 '+pct+'% \u0434\u043e \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0433\u043e':'')+'</p>'+
      '<div class="bar on-card" style="margin-top:12px"><i style="width:'+(lv>=L.SEASON.max?100:pct)+'%"></i></div>'+
      '<div class="acts">'+(prem?'<span class="badge b-prem" style="height:30px;padding:0 12px;font-size:14px">'+ic('crown')+'Premium \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u0441\u0435\u0437\u043e\u043d\u0430</span>':'<button class="pill on-card" data-act="premInfo">'+ic('crown')+'\u041e\u0442\u043a\u0440\u044b\u0442\u044c Premium</button>')+(cl?'<button class="pill on-card" data-act="claimAll" style="background:#fff;color:#c4261d">\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u0432\u0441\u0451 \u00b7 '+cl+'</button>':'')+'</div></div>'+
    secH('\u041a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c')+dailyCard(t)+rbCard(t)+
    secH('\u041d\u0435\u0434\u0435\u043b\u044f')+weekCard+
    secH('\u0417\u0430\u0434\u0430\u043d\u0438\u044f \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f')+quests+
    secH('\u041f\u0440\u043e\u043f\u0443\u0441\u043a')+'<p class="sub">\u0421\u0432\u0435\u0440\u0445\u0443 \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u0430\u044f \u043b\u0438\u043d\u0438\u044f, \u0441\u043d\u0438\u0437\u0443 Premium. \u0417\u0432\u0430\u043d\u0438\u044f \u00ab\u041c\u043e\u0442\u043e\u0431\u0440\u0430\u0442\u0438\u043a\u00bb \u043d\u0430 30 \u0443\u0440\u043e\u0432\u043d\u0435 \u0438 \u00ab\u041a\u043e\u0440\u043e\u043b\u044c \u0441\u0442\u0430\u043d\u0442\u0430\u00bb \u043d\u0430 100-\u043c.</p><div class="pass" id="pass">'+cols.join('')+'</div>'+
    secH('\u0422\u043e\u043f \u0441\u0435\u0437\u043e\u043d\u0430')+(top.length?'<div class="rows">'+top.map((p,i)=>'<button class="row" data-act="profile" data-uid="'+esc(p.uid)+'"><span style="width:26px;text-align:center;font:800 18px var(--f-ui);color:'+(i<3?['#ffd60a','#c7c7cc','#d0894a'][i]:'var(--text2)')+'">'+(i+1)+'</span>'+avaHTML(p.uid,p.nick,'md',p.ava)+'<div class="mid"><div class="tt">'+esc(p.nick)+admBadge(p.role)+(p.uid===Net.me.uid?' <span class="muted" style="font-weight:400">(\u0432\u044b)</span>':'')+'</div><div class="ss">'+(p.title&&L.TITLES[p.title]?L.TITLES[p.title]+' \u00b7 ':'')+'\u0443\u0440\u043e\u0432\u0435\u043d\u044c '+p.lvl+(p.num?' \u00b7 ID '+pad8(p.num):'')+'</div></div><div class="end">'+plusBadge(p.plus,true)+'</div></button>').join('')+'</div>':'<div class="empty">\u0421\u043a\u043e\u0440\u043e \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043b\u0443\u0447\u0448\u0438\u0435 \u0438\u0433\u0440\u043e\u043a\u0438 \u0441\u0435\u0437\u043e\u043d\u0430</div>');
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
ACT.dayClaim=el=>run('dayClaim',{},{btn:el,ok:r=>{Snd.win(r.keys?4:2);Haptic.ok();if(r.lost&&L.fireCanFix(S,now()))setTimeout(()=>toast('\u041e\u0433\u043e\u043d\u0451\u043a \u043f\u043e\u0433\u0430\u0441 \u043f\u043e\u0441\u043b\u0435 '+r.lost+' \u0434\u043d. \u0415\u0433\u043e \u043c\u043e\u0436\u043d\u043e \u0440\u0430\u0437\u043c\u043e\u0440\u043e\u0437\u0438\u0442\u044c'),600)}});
ACT.fireFix=el=>confirmSheet('\u0420\u0430\u0437\u043c\u043e\u0440\u043e\u0437\u0438\u0442\u044c \u043e\u0433\u043e\u043d\u0451\u043a?','\u0421\u0435\u0440\u0438\u044f \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u0441\u044f \u0441 '+(S.fire.lost?S.fire.lost.n+S.fire.n:0)+' \u0434\u043d\u0435\u0439. \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u0440\u0430\u0437\u043c\u043e\u0440\u043e\u0437\u043a\u0430 \u2014 \u0447\u0435\u0440\u0435\u0437 3 \u043c\u0435\u0441\u044f\u0446\u0430.','\u0420\u0430\u0437\u043c\u043e\u0440\u043e\u0437\u0438\u0442\u044c',()=>run('fireFix',{},{ok:()=>{Snd.win(3);Haptic.ok()}}));
ACT.rbClaim=el=>run('rbClaim',{},{btn:el,ok:()=>{Snd.coin();Haptic.ok()}});
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
function showcaseHTML(items,own){
  const slots=[0,1,2].map(i=>{const it=items[i];
    if(it)return'<button class="mat sc" data-act="'+(own?'showPick':'pubInsp')+'" data-i="'+i+'" style="padding:10px;background:var(--card);display:grid;gap:6px">'+plateHTML(it)+'<span style="font:600 13px var(--f-ui)">'+COIN(it.price||appraise(it).price)+'</span></button>';
    return own?'<button class="mat sc empty-s" data-act="showPick" data-i="'+i+'">'+ic('plus')+'<span>\u041d\u043e\u043c\u0435\u0440</span></button>':'';
  }).join('');
  return'<div class="showcase">'+slots+'</div>';
}
RENDER.account=()=>{
  const el=$('t-account');
  const fr=[['\u0410','#ff9f0a'],['\u0414','#0a84ff'],['\u041c','#30d158'],['\u041a','#bf5af2'],['\u0421','#ff375f']];
  const showItems=S.show.map(id=>S.box.find(b=>b.id===id)).filter(Boolean);
  el.innerHTML=topHTML('\u0410\u043a\u043a\u0430\u0443\u043d\u0442')+
    '<div class="prof"><button data-act="avaPick" aria-label="\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440" style="border-radius:50%;position:relative">'+avaHTML(Net.me.uid,S.nick,'lg',Net.me.ava)+'<span style="position:absolute;right:0;bottom:0;width:28px;height:28px;border-radius:50%;background:var(--card3);display:grid;place-items:center;box-shadow:0 0 0 3px var(--bg)"><span style="width:15px;height:15px">'+ic('pencil')+'</span></span></button>'+
      '<button class="nick" data-act="nickEdit">'+esc(S.nick||'\u0418\u0433\u0440\u043e\u043a')+admBadge(Net.me.role)+'</button>'+
      '<button class="idline num" data-act="myId">ID '+idStr(Net.me.num)+' '+ic('copy')+'</button>'+
      '<div class="bdg">'+myBadges()+'</div>'+(S.titles.length?'<button class="pill" data-act="titlePick" style="margin-top:4px">'+ic('medal')+(S.title?'\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0432\u0430\u043d\u0438\u0435':'\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0437\u0432\u0430\u043d\u0438\u0435')+'</button>':'')+'</div>'+
    '<div class="stats3" style="margin-top:18px"><div class="stat"><b>'+fmtN(S.opened)+'</b><span>\u043a\u0435\u0439\u0441\u043e\u0432</span></div><div class="stat"><b>'+shortN(L.worth(S))+'</b><span>\u0433\u0430\u0440\u0430\u0436 \u0432 \u043c\u043e\u043d\u0435\u0442\u0430\u0445</span></div><div class="stat"><b>'+(L.fireAlive(S,now())?S.fire.n:0)+'</b><span>\u043e\u0433\u043e\u043d\u0451\u043a</span></div></div>'+
    secH('\u0412\u0438\u0442\u0440\u0438\u043d\u0430')+'<p class="sub">\u0414\u043e \u0442\u0440\u0451\u0445 \u043d\u043e\u043c\u0435\u0440\u043e\u0432, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0432\u0438\u0434\u044f\u0442 \u0432\u0441\u0435 \u0432 \u0432\u0430\u0448\u0435\u043c \u043f\u0440\u043e\u0444\u0438\u043b\u0435. \u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043d\u0430 \u044f\u0447\u0435\u0439\u043a\u0443, \u0447\u0442\u043e\u0431\u044b \u0432\u044b\u0431\u0440\u0430\u0442\u044c.</p>'+showcaseHTML(showItems,true)+
    secH('\u0413\u0430\u0440\u0430\u0436','garage')+
    '<div class="pad" style="margin-bottom:10px"><div class="segbox"><button class="'+(gV==='car'?'on':'')+'" data-act="gv" data-v="car">\u041c\u0430\u0448\u0438\u043d\u0430</button><button class="'+(gV==='bike'?'on':'')+'" data-act="gv" data-v="bike">\u041f\u0438\u0442\u0431\u0430\u0439\u043a</button></div></div>'+
    '<button class="garage-view" data-act="garage" style="display:block;width:calc(100% - 2*var(--g))"><canvas id="acc-veh"></canvas><span class="pill on-card" style="position:absolute;right:12px;top:12px;background:rgba(0,0,0,.35)">\u041d\u0430\u0441\u0442\u0440\u043e\u0438\u0442\u044c</span>'+(S.veh[gV].plate&&S.box.find(b=>b.id===S.veh[gV].plate)?'<span style="position:absolute;left:12px;bottom:12px;width:120px">'+plateHTML(S.box.find(b=>b.id===S.veh[gV].plate))+'</span>':'')+'</button>'+
    '<div class="rows" style="margin-top:12px">'+
      '<button class="row" data-act="inventory"><span class="ico" style="background:var(--orange)">'+ic('bag')+'</span><div class="mid"><div class="tt">\u0418\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c</div><div class="ss">'+S.box.length+' '+plural(S.box.length,'\u043d\u043e\u043c\u0435\u0440','\u043d\u043e\u043c\u0435\u0440\u0430','\u043d\u043e\u043c\u0435\u0440\u043e\u0432')+', '+S.inv.length+' '+plural(S.inv.length,'\u0441\u043a\u0438\u043d \u0438\u043b\u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430','\u0441\u043a\u0438\u043d\u0430 \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438','\u0441\u043a\u0438\u043d\u043e\u0432 \u0438 \u043d\u0430\u043a\u043b\u0435\u0435\u043a')+'</div></div>'+ic('chev','chev')+'</button></div>'+
    secH('\u0417\u043e\u0432\u0438\u0442\u0435 \u0434\u0440\u0443\u0437\u0435\u0439')+
    '<div class="card p" style="text-align:center"><div class="friends">'+fr.map((f,i)=>{const pos=[[-70,10,44],[-34,-18,40],[0,8,64],[38,-20,42],[72,12,38]][i];return'<span class="f" style="width:'+pos[2]+'px;height:'+pos[2]+'px;left:calc(50% + '+(pos[0]-pos[2]/2)+'px);top:'+(30+pos[1]-pos[2]/2+16)+'px;background:linear-gradient(160deg,'+f[1]+','+Draw.shade(f[1],-.3)+')">'+f[0]+'</span>'}).join('')+'</div>'+
      '<div style="font:500 16px/1.35 var(--f-ui);margin:4px 0 14px">\u0412\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 '+fmt(L.refRewardFor(S.don,L.isPrem(S,now())))+' \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0434\u0440\u0443\u0433\u0430,<br>\u0430 \u0434\u0440\u0443\u0433 \u2014 '+fmt(L.invRewardFor(S.don,L.isPrem(S,now())))+' \u0437\u0430 \u043f\u0435\u0440\u0432\u044b\u0435 10 \u0434\u043d\u0435\u0439</div><button class="btn md" data-act="referral">'+ic('plus')+'\u041f\u0440\u0438\u0433\u043b\u0430\u0441\u0438\u0442\u044c \u0434\u0440\u0443\u0437\u0435\u0439</button></div>'+
    '<div class="rows" style="margin-top:12px">'+
      '<button class="row" data-act="media"><span class="ico" style="background:var(--red)">'+ic('mega')+'</span><div class="mid"><div class="tt">\u041c\u0435\u0434\u0438\u0430</div><div class="ss">\u041a\u043e\u0434 \u0430\u0432\u0442\u043e\u0440\u0430 \u0438 \u043a\u0430\u0431\u0438\u043d\u0435\u0442 \u0431\u043b\u043e\u0433\u0435\u0440\u0430</div></div>'+ic('chev','chev')+'</button>'+
      '<button class="row" data-act="support"><span class="ico" style="background:var(--blue)">'+ic('chat')+'</span><div class="mid"><div class="tt">\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u0438 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f</div><div class="ss">\u0412\u043e\u043f\u0440\u043e\u0441\u044b, \u0438\u0434\u0435\u0438, \u043e\u0431\u0436\u0430\u043b\u043e\u0432\u0430\u043d\u0438\u044f \u2014 \u043e\u0442\u0432\u0435\u0442\u0438\u043c \u0437\u0434\u0435\u0441\u044c \u0436\u0435</div></div>'+ic('chev','chev')+'</button>'+
    '</div>'+
    secH('\u0421\u0442\u0435\u043d\u0430','myWall')+'<div id="acc-wall"><div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div></div>'+
    secH('\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438')+
    '<div class="group">'+
      '<button class="li" data-act="findId"><span class="lic" style="background:var(--indigo)">'+ic('search')+'</span><span class="lt">\u041d\u0430\u0439\u0442\u0438 \u043f\u043e ID</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="myComments"><span class="lic" style="background:var(--teal)">'+ic('chat')+'</span><span class="lt">\u041c\u043e\u0438 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="privacy"><span class="lic" style="background:var(--card3)">'+ic('lock')+'</span><span class="lt">\u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c</span>'+ic('chev','chev')+'</button>'+
      '<div class="li"><span class="lic" style="background:var(--indigo)">'+ic('sun')+'</span><span class="lt">\u0422\u0435\u043c\u0430</span><select class="inp" style="height:34px;width:auto;padding:0 10px;font-size:15px" data-on="theme">'+[['system','\u041a\u0430\u043a \u0432 Telegram'],['light','\u0421\u0432\u0435\u0442\u043b\u0430\u044f'],['dark','\u0422\u0451\u043c\u043d\u0430\u044f']].map(o=>'<option value="'+o[0]+'"'+(Theme.get()===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>'+
      '<button class="li" data-act="sndToggle"><span class="lic" style="background:var(--green)">'+ic('sound')+'</span><span class="lt">\u0417\u0432\u0443\u043a\u0438</span><span class="lv">'+(Snd.on()?'\u0412\u043a\u043b':'\u0412\u044b\u043a\u043b')+'</span></button>'+
      '<button class="li" data-act="music"><span class="lic" style="background:var(--pink)">'+ic('music')+'</span><span class="lt">\u0421\u0432\u043e\u044f \u043c\u0443\u0437\u044b\u043a\u0430</span><span class="lv">'+Music.count()+'</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="promo"><span class="lic" style="background:var(--orange)">'+ic('ticket')+'</span><span class="lt">\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434</span>'+ic('chev','chev')+'</button>'+
      '<button class="li" data-act="history"><span class="lic" style="background:var(--stars)">'+ic('star')+'</span><span class="lt">\u041c\u043e\u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0438</span>'+ic('chev','chev')+'</button>'+
      (Net.me.role?'<button class="li" data-act="admin"><span class="lic" style="background:var(--red)">'+ic('shield')+'</span><span class="lt">\u0410\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c</span>'+(Net.me.role==='owner'&&!Net.me.elev?'<span class="lv">'+ic('lock')+'</span>':'')+ic('chev','chev')+'</button>':'')+
    '</div>'+
    '<div class="pad" style="margin-top:22px;text-align:center">'+(Net.me.role==='admin'?'':'<button class="muted" data-act="ownerLogin" style="font-size:13px">'+(Net.me.role==='owner'?'\u0421\u0435\u0441\u0441\u0438\u044f \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430':'\u0412\u0445\u043e\u0434 \u0434\u043b\u044f \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430')+'</button>')+'<div class="muted" style="font-size:12px;margin-top:6px">\u0412\u044b\u0431\u0438\u0432\u0430\u043d\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u043e\u0432 2.1</div></div>';
  hydrateAvas(el);
  requestAnimationFrame(()=>{const cv=$('acc-veh');if(cv)Draw.preview(cv,gV,vehLook(gV),{k:gV==='bike'?.82:.86})});
  loadWall(Net.me.uid,$('acc-wall'));
};
ACT.gv=el=>{gV=el.dataset.v;render()};
ON.themeChange=el=>{Theme.set(el.value);render()};
ACT.sndToggle=()=>{Snd.set(!Snd.on());render()};
ACT.me=()=>Tabs.go('account');

/* ---------- \u0432\u0438\u0442\u0440\u0438\u043d\u0430 \u0438 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c ---------- */
let showSlot=0;
ACT.showPick=el=>{
  showSlot=+el.dataset.i;const cur=S.show[showSlot];
  const l=S.box.slice().sort((a,b)=>b.price-a.price).slice(0,60);
  Sheet.open({title:'\u041d\u043e\u043c\u0435\u0440 \u043d\u0430 \u0432\u0438\u0442\u0440\u0438\u043d\u0443',lead:'\u0412\u0438\u0434\u044f\u0442 \u0432\u0441\u0435, \u043a\u0442\u043e \u043e\u0442\u043a\u0440\u043e\u0435\u0442 \u0432\u0430\u0448 \u043f\u0440\u043e\u0444\u0438\u043b\u044c.',body:(cur?'<div class="pad" style="margin-bottom:12px"><button class="btn wide" data-act="showSet" data-id="0">\u0423\u0431\u0440\u0430\u0442\u044c \u0441 \u0432\u0438\u0442\u0440\u0438\u043d\u044b</button></div>':'')+(l.length?'<div class="grid2">'+l.map(x=>'<button class="mat" data-act="showSet" data-id="'+x.id+'" style="display:grid;gap:6px;padding:10px;'+(S.show.includes(x.id)?'opacity:.45':'')+'">'+plateHTML(x)+'<span class="num" style="font:600 13px var(--f-ui)">'+COIN(x.price)+'</span></button>').join('')+'</div>':'<div class="empty">\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0432 \u00ab\u041c\u0430\u0433\u0430\u0437\u0438\u043d\u0435\u00bb</div>')});
};
ACT.showSet=el=>{
  const id=+el.dataset.id;let l=S.show.slice();
  if(!id)l.splice(showSlot,1);else{l=l.filter(x=>x!==id);if(showSlot<l.length)l.splice(showSlot,1,id);else l.push(id)}
  run('showSet',{ids:l.slice(0,3)},{quiet:true,ok:()=>{Sheet.close();toast('\u0412\u0438\u0442\u0440\u0438\u043d\u0430 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0430')}});
};
ACT.privacy=()=>Page.push('priv','\u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c',el=>{
  const row=(k,n,s)=>'<button class="li" data-act="privTog" data-k="'+k+'"><span class="lt">'+n+'<br><span class="muted" style="font-size:13px">'+s+'</span></span><span class="tgl'+(S.priv[k]?' on':'')+'"><i></i></span></button>';
  el.innerHTML='<p class="lead">\u0427\u0442\u043e \u0441\u043a\u0440\u044b\u0442\u044c \u0432 \u0432\u0430\u0448\u0435\u043c \u043f\u0440\u043e\u0444\u0438\u043b\u0435 \u043e\u0442 \u0434\u0440\u0443\u0433\u0438\u0445 \u0438\u0433\u0440\u043e\u043a\u043e\u0432. \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438 \u043d\u0430 \u0441\u0442\u0435\u043d\u0435 \u0432\u0438\u0434\u043d\u044b \u0432\u0441\u0435\u0433\u0434\u0430 \u2014 \u0438\u0445 \u043d\u0435\u043b\u044c\u0437\u044f \u0441\u043a\u0440\u044b\u0442\u044c.</p><div class="group">'+
    row('worth','\u0421\u043a\u0440\u044b\u0442\u044c \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u0433\u0430\u0440\u0430\u0436\u0430','\u0412\u043c\u0435\u0441\u0442\u043e \u0441\u0443\u043c\u043c\u044b \u0431\u0443\u0434\u0435\u0442 \u00ab\u0441\u043a\u0440\u044b\u0442\u043e\u00bb')+row('best','\u0421\u043a\u0440\u044b\u0442\u044c \u043b\u0443\u0447\u0448\u0438\u0439 \u043d\u043e\u043c\u0435\u0440','\u0412\u0438\u0442\u0440\u0438\u043d\u0443 \u0432\u044b \u043d\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0435\u0442\u0435 \u0441\u0430\u043c\u0438')+row('veh','\u0421\u043a\u0440\u044b\u0442\u044c \u043c\u0430\u0448\u0438\u043d\u0443 \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a','\u0421\u043a\u0438\u043d\u044b, \u043a\u0440\u0430\u0441\u043a\u0443 \u0438 \u043d\u043e\u043c\u0435\u0440\u0430 \u043d\u0430 \u043c\u0430\u0448\u0438\u043d\u0435')+'</div>'+
    '<p class="note">\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u0442 \u043c\u043e\u0448\u0435\u043d\u043d\u0438\u043a\u043e\u0432: \u043d\u0438\u043a\u0442\u043e \u043d\u0435 \u0443\u0437\u043d\u0430\u0435\u0442, \u0441\u043a\u043e\u043b\u044c\u043a\u043e \u0441\u0442\u043e\u0438\u0442 \u0432\u0430\u0448 \u0433\u0430\u0440\u0430\u0436, \u0435\u0441\u043b\u0438 \u0432\u044b \u044d\u0442\u043e\u0433\u043e \u043d\u0435 \u0445\u043e\u0442\u0438\u0442\u0435. \u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u043d\u0438\u043a\u043e\u0433\u0434\u0430 \u043d\u0435 \u043f\u0440\u043e\u0441\u0438\u0442 \u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c \u043d\u043e\u043c\u0435\u0440\u0430 \u0438\u043b\u0438 \u043c\u043e\u043d\u0435\u0442\u044b.</p>';
});
ACT.privTog=el=>{const k=el.dataset.k;run('privSet',{k,on:!S.priv[k]},{quiet:true,ok:()=>Page.renderTop()})};

/* ---------- \u043d\u0438\u043a, \u0437\u0432\u0430\u043d\u0438\u0435, \u0430\u0432\u0430\u0442\u0430\u0440 \u0441 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u043e\u0439 \u0442\u0435\u043a\u0441\u0442\u0430 ---------- */
ACT.nickEdit=()=>{
  Sheet.open({title:'\u041d\u0438\u043a',body:'<div class="field"><input class="inp" id="nick-i" maxlength="20" value="'+esc(S.nick)+'"></div><p class="note">\u041e\u0442 2 \u0434\u043e 20 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432. \u0412\u0438\u0434\u0435\u043d \u0432 \u0442\u043e\u043f\u0435, \u043d\u0430 \u0440\u044b\u043d\u043a\u0435 \u0438 \u0432 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f\u0445.</p><div class="foot"><button class="btn pri wide" data-act="nickSave">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c</button></div>'});
  setTimeout(()=>{const i=$('nick-i');if(i)i.focus()},300);
};
ACT.nickSave=el=>run('nick',{nick:$('nick-i').value},{btn:el,ok:()=>Sheet.close()});
ACT.titlePick=()=>Sheet.open({title:'\u0417\u0432\u0430\u043d\u0438\u0435',lead:'\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0432 \u043f\u0440\u043e\u0444\u0438\u043b\u0435, \u043d\u0430 \u0440\u044b\u043d\u043a\u0435 \u0438 \u0432 \u0442\u043e\u043f\u0435.',body:'<div class="group">'+['',...S.titles].map(t=>'<button class="li noic" data-act="titleSet" data-t="'+t+'"><span class="lt">'+(t?L.TITLES[t]:'\u0411\u0435\u0437 \u0437\u0432\u0430\u043d\u0438\u044f')+'</span>'+(S.title===t?'<span style="width:20px;height:20px;color:var(--accent)">'+ic('check')+'</span>':'')+'</button>').join('')+'</div>'});
ACT.titleSet=el=>{run('title',{t:el.dataset.t},{quiet:true});Sheet.close()};
ACT.avaPick=()=>{
  if(Net.me.mute&&Net.me.mute.a){toast('\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u043b \u0432\u0430\u043c \u0441\u043c\u0435\u043d\u0443 \u0430\u0432\u0430\u0442\u0430\u0440\u0430','err');return}
  Sheet.open({title:'\u0410\u0432\u0430\u0442\u0430\u0440',body:'<div class="foot"><label class="btn pri wide" style="cursor:pointer">'+ic('plus')+'\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0444\u043e\u0442\u043e<input type="file" accept="image/*" hidden data-on="avaFile"></label>'+(Net.me.ava?'<button class="btn wide danger" data-act="avaDel">\u0423\u0431\u0440\u0430\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440</button>':'')+'</div><p class="note">\u0424\u043e\u0442\u043e \u043e\u0431\u0440\u0435\u0436\u0435\u0442\u0441\u044f \u0434\u043e \u043a\u0432\u0430\u0434\u0440\u0430\u0442\u0430 256 \u00d7 256. \u041a\u0430\u0440\u0442\u0438\u043d\u043a\u0438 \u0441 \u0442\u0435\u043a\u0441\u0442\u043e\u043c \u0438 \u0441\u0441\u044b\u043b\u043a\u0430\u043c\u0438 \u043d\u0435 \u043f\u0443\u0431\u043b\u0438\u043a\u0443\u044e\u0442\u0441\u044f \u2014 \u0438\u0445 \u043f\u0440\u043e\u0432\u0435\u0440\u044f\u0435\u0442 \u043c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440.</p>'});
};
let avaPending=null;
ON.avaFileChange=async el=>{
  const f=el.files&&el.files[0];if(!f)return;
  let data;
  try{data=await squareImage(f,256)}catch(e){toast(e.message||'\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c \u0444\u043e\u0442\u043e','err');return}
  Sheet.body('<div style="display:grid;justify-items:center;gap:12px;padding:12px var(--g)"><img src="'+data+'" width="120" height="120" style="border-radius:50%" alt=""><div class="muted" id="ocr-st">\u041f\u0440\u043e\u0432\u0435\u0440\u044f\u0435\u043c \u0444\u043e\u0442\u043e \u043d\u0430 \u0442\u0435\u043a\u0441\u0442 \u0438 \u0441\u0441\u044b\u043b\u043a\u0438\u2026</div></div>');
  const res=await TextCheck.check(data,p=>{const s=$('ocr-st');if(s)s.textContent=p});
  if(res.found){
    avaPending=data;
    Sheet.body('<div style="display:grid;justify-items:center;gap:10px;padding:8px var(--g) 0;text-align:center"><img src="'+data+'" width="110" height="110" style="border-radius:50%" alt=""><div style="font:600 17px var(--f-ui)">\u041d\u0430 \u0444\u043e\u0442\u043e \u043d\u0430\u0439\u0434\u0435\u043d \u0442\u0435\u043a\u0441\u0442</div><div class="muted" style="font-size:14px">\u00ab'+esc(res.text.slice(0,80))+'\u00bb. \u0410\u0432\u0430\u0442\u0430\u0440\u044b \u0441 \u0442\u0435\u043a\u0441\u0442\u043e\u043c \u0438 \u0441\u0441\u044b\u043b\u043a\u0430\u043c\u0438 \u043d\u0435 \u043f\u0443\u0431\u043b\u0438\u043a\u0443\u044e\u0442\u0441\u044f.</div></div><div class="foot"><label class="btn pri wide" style="cursor:pointer">\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0434\u0440\u0443\u0433\u043e\u0435 \u0444\u043e\u0442\u043e<input type="file" accept="image/*" hidden data-on="avaFile"></label><button class="btn wide" data-act="avaAppeal">\u042d\u0442\u043e \u043e\u0448\u0438\u0431\u043a\u0430 \u2014 \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0443</button></div>');
    return;
  }
  await run('avatar',{data,chk:res.ok?'ok':'skip'},{ok:r=>{Me.avaData=data;avaCache.set(Net.me.uid,Promise.resolve(r.ok?data:null));Sheet.close();qsa('[data-ava="'+Net.me.uid+'"]').forEach(e=>{e.dataset.done=''});render()}});
};
ACT.avaAppeal=el=>{if(!avaPending)return;run('ticketNew',{kind:'avatar',text:'\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435, \u043f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u0430\u0432\u0430\u0442\u0430\u0440: \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043d\u0430\u0448\u043b\u0430 \u0442\u0435\u043a\u0441\u0442',data:avaPending},{btn:el,ok:()=>{Sheet.close();avaPending=null}})};
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
// \u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0442\u0435\u043a\u0441\u0442\u0430 \u043d\u0430 \u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0435: \u0440\u0430\u0441\u043f\u043e\u0437\u043d\u0430\u0432\u0430\u043d\u0438\u0435 \u043f\u0440\u044f\u043c\u043e \u0432 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0435 (Tesseract.js \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u0440\u0438 \u0441\u043c\u0435\u043d\u0435 \u0430\u0432\u0430\u0442\u0430\u0440\u0430)
const TextCheck=(()=>{
  let worker=null,loading=null;
  function load(){
    if(loading)return loading;
    loading=new Promise((res,rej)=>{if(window.Tesseract)return res();const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=()=>res();s.onerror=()=>rej(new Error('ocr'));document.head.appendChild(s)})
      .then(()=>window.Tesseract.createWorker('rus+eng')).then(w=>{worker=w;return w});
    loading.catch(()=>{loading=null});
    return loading;
  }
  const LINK=/(https?:|www\.|t\.me|\.(ru|com|net|org|io|me|su|\u0440\u0444)\b|@[a-z0-9_]{4,})/i;
  return{
    async check(data,progress){
      try{
        if(progress)progress('\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0443 \u0442\u0435\u043a\u0441\u0442\u0430\u2026 \u044d\u0442\u043e \u043e\u0434\u0438\u043d \u0440\u0430\u0437');
        const w=await Promise.race([load(),new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),25000))]);
        if(progress)progress('\u0418\u0449\u0435\u043c \u0442\u0435\u043a\u0441\u0442 \u0438 \u0441\u0441\u044b\u043b\u043a\u0438\u2026');
        const r=await Promise.race([w.recognize(data),new Promise((_,rj)=>setTimeout(()=>rj(new Error('timeout')),20000))]);
        const words=((r.data&&r.data.words)||[]).filter(x=>x.confidence>=72&&/[A-Za-z\u0410-\u042f\u0430-\u044f\u0401\u04510-9]{3,}/.test(x.text));
        const letters=words.reduce((n,x)=>n+(x.text.match(/[A-Za-z\u0410-\u042f\u0430-\u044f\u0401\u04510-9]/g)||[]).length,0);
        const all=(r.data&&r.data.text||'').trim();
        const found=letters>=6||(LINK.test(all)&&((r.data&&r.data.confidence)||0)>55);
        return{ok:true,found,text:words.map(x=>x.text).join(' ')||all};
      }catch(e){return{ok:false,found:false,text:''}}
    }
  };
})();

/* ---------- \u0433\u0430\u0440\u0430\u0436 ---------- */
ACT.garage=el=>{if(el&&el.dataset&&el.dataset.v)gV=el.dataset.v;Sheet.close();Page.push('garage','\u0413\u0430\u0440\u0430\u0436',renderGarage)};
function renderGarage(el){
  const V=S.veh[gV];const kinds=gV;
  const skins=Object.keys(SKINS).filter(k=>k.startsWith(kinds+':')&&(SKINS[k].free||S.inv.some(i=>i.k==='skin'&&i.v===k)));
  const pl=V.plate&&S.box.find(b=>b.id===V.plate);
  const sw=(slot)=>Object.keys(COLORS).map(id=>{const own=S.colors.includes(id);return'<button class="sw'+(V[slot]===id?' on':'')+'" data-act="paint" data-s="'+slot+'" data-c="'+id+'" style="background:'+COLORS[id].c+'" aria-label="'+COLORS[id].n+'">'+(own?'':'<span class="lk">'+shortN(COLORS[id].cost)+'</span>')+'</button>'}).join('');
  const stickers=S.inv.filter(i=>i.k==='sticker');
  el.innerHTML='<div class="pad" style="margin-bottom:10px"><div class="segbox"><button class="'+(gV==='car'?'on':'')+'" data-act="gvp" data-v="car">\u041c\u0430\u0448\u0438\u043d\u0430</button><button class="'+(gV==='bike'?'on':'')+'" data-act="gvp" data-v="bike">\u041f\u0438\u0442\u0431\u0430\u0439\u043a</button></div></div>'+
    '<div class="garage-view" style="height:240px"><canvas id="gar-cv"></canvas></div>'+
    '<div class="card p" style="margin-top:12px;display:flex;align-items:center;gap:12px">'+(pl?'<div style="width:130px;flex:none">'+plateHTML(pl)+'</div>':'<span class="ico" style="width:52px;height:52px;border-radius:13px;background:var(--fill);display:grid;place-items:center">'+ic('tag')+'</span>')+'<div style="flex:1"><div style="font:600 16px var(--f-ui)">'+(pl?esc(plateText(pl.pl)):'\u041d\u043e\u043c\u0435\u0440 \u043d\u0435 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d')+'</div><div class="muted" style="font-size:13px">'+(pl?'\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d \u043d\u0430 '+(gV==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a'):'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0438\u0437 \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044f')+'</div></div><button class="pill" data-act="platePick">'+(pl?'\u0421\u043c\u0435\u043d\u0438\u0442\u044c':'\u0412\u044b\u0431\u0440\u0430\u0442\u044c')+'</button></div>'+
    '<div class="sec">\u0421\u043a\u0438\u043d</div><div class="opts">'+skins.map(k=>'<button class="opt'+(V.skin===k?' on':'')+'" data-act="vskin" data-v="'+k+'"><span class="rar" style="background:'+L.SKIN_R[SKINS[k].r].c+'"></span><canvas data-skin="'+k+'" style="width:84px;height:46px"></canvas>'+esc(SKINS[k].n)+'</button>').join('')+'<button class="opt" data-act="skinCase" data-m="'+(S.free.sc>0?'free':'coin')+'"><span style="width:46px;height:46px;display:grid;place-items:center;color:var(--purple)">'+ic('plus')+'</span>\u041a\u0435\u0439\u0441<small>'+(S.free.sc>0?'\u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e':fmtN(L.SKIN_CASE.price))+'</small></button></div>'+
    '<div class="sec">\u041e\u0441\u043d\u043e\u0432\u043d\u043e\u0439 \u0446\u0432\u0435\u0442</div><div class="swatches">'+sw('c1')+'</div>'+
    '<div class="sec">\u0412\u0442\u043e\u0440\u043e\u0439 \u0446\u0432\u0435\u0442</div><div class="swatches">'+sw('c2')+'</div>'+
    '<div class="sec">\u041a\u043e\u043b\u0451\u0441\u0430</div><div class="opts">'+Object.keys(WHEELS).map(k=>{const own=S.wheels.includes(k);return'<button class="opt'+(V.wh===k?' on':'')+'" data-act="vwh" data-v="'+k+'">'+wheelIcon(k)+WHEELS[k].n+'<small>'+(own?(V.wh===k?'\u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u044b':'\u0435\u0441\u0442\u044c'):fmtN(WHEELS[k].cost)+' \u043c\u043e\u043d.')+'</small></button>'}).join('')+'</div>'+
    '<div class="sec">\u041e\u0431\u0432\u0435\u0441</div><div class="opts">'+Object.keys(KITS[gV]).map(k=>{const own=S.kits.includes(k);return'<button class="opt'+(V.kit===k?' on':'')+'" data-act="vkit" data-v="'+k+'">'+KITS[gV][k].n+'<small>'+(own?(V.kit===k?'\u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d':'\u0435\u0441\u0442\u044c'):fmtN(KITS[gV][k].cost)+' \u043c\u043e\u043d.')+'</small></button>'}).join('')+'</div>'+
    '<div class="sec">\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 <small>'+V.st.length+' \u0438\u0437 3</small></div>'+(stickers.length?'<div class="opts">'+stickers.map(x=>{const on=V.st.includes(x.id);return'<button class="opt'+(on?' on':'')+'" data-act="vst" data-id="'+x.id+'"><img src="'+Draw.stickerURL(x.v,96)+'" width="44" height="44" alt="">'+esc(STICKERS[x.v].n)+'<small>'+(on?'\u043d\u0430\u043a\u043b\u0435\u0435\u043d\u0430':'\u043d\u0430\u043a\u043b\u0435\u0438\u0442\u044c')+'</small></button>'}).join('')+'</div>':'<div class="empty">\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 \u0432\u044b\u043f\u0430\u0434\u0430\u044e\u0442 \u0438\u0437 \u043a\u0435\u0439\u0441\u0430 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438<button class="pill" data-act="stickerCase" data-m="'+(S.free.tc>0?'free':'coin')+'">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0437\u0430 '+(S.free.tc>0?'\u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e':fmt(L.STICKER_CASE.price))+'</button></div>')+
    '<p class="note">\u0421\u043a\u0438\u043d\u044b, \u043a\u0440\u0430\u0441\u043a\u0430, \u043a\u043e\u043b\u0451\u0441\u0430, \u043e\u0431\u0432\u0435\u0441 \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0438 \u043d\u0435 \u0432\u043b\u0438\u044f\u044e\u0442 \u043d\u0430 \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u2014 \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 \u0432\u043d\u0435\u0448\u043d\u0438\u0439 \u0432\u0438\u0434.</p>';
  hydrateSkins(el);
  requestAnimationFrame(()=>{const cv=$('gar-cv');if(cv)Draw.preview(cv,gV,vehLook(gV),{k:gV==='bike'?.84:.9})});
}
function wheelIcon(k){const cv=document.createElement('canvas');cv.width=cv.height=92;const c=cv.getContext('2d');Draw.wheel(c,46,46,30,k,.3,COLORS[S.veh[gV].c2].c);return'<img src="'+cv.toDataURL()+'" width="46" height="46" alt="">'}
ACT.gvp=el=>{gV=el.dataset.v;Page.renderTop()};
ACT.paint=el=>{
  const id=el.dataset.c,slot=el.dataset.s;
  if(!S.colors.includes(id)){const c=COLORS[id];confirmSheet('\u0426\u0432\u0435\u0442 \u00ab'+c.n+'\u00bb','\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+fmt(c.cost)+'? \u0426\u0432\u0435\u0442 \u0441\u0442\u0430\u043d\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u0434\u043b\u044f \u043c\u0430\u0448\u0438\u043d\u044b \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430.','\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+fmt(c.cost),()=>run('buyColor',{id},{ok:()=>run('vset',{v:gV,f:slot,val:id},{quiet:true})}));return}
  run('vset',{v:gV,f:slot,val:id},{quiet:true});Haptic.tick();
};
ACT.vskin=el=>{run('vset',{v:gV,f:'skin',val:el.dataset.v},{quiet:true});Haptic.tick()};
ACT.vwh=el=>{const k=el.dataset.v;if(!S.wheels.includes(k)){confirmSheet(WHEELS[k].n+' \u043a\u043e\u043b\u0451\u0441\u0430','\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+fmt(WHEELS[k].cost)+'? \u041f\u043e\u0434\u043e\u0439\u0434\u0443\u0442 \u0438 \u043c\u0430\u0448\u0438\u043d\u0435, \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0443.','\u041a\u0443\u043f\u0438\u0442\u044c',()=>run('buyWheel',{id:k},{ok:()=>run('vset',{v:gV,f:'wh',val:k},{quiet:true})}));return}run('vset',{v:gV,f:'wh',val:k},{quiet:true});Haptic.tick()};
ACT.vkit=el=>{const k=el.dataset.v;if(!S.kits.includes(k)){confirmSheet('\u00ab'+KITS[gV][k].n+'\u00bb','\u041a\u0443\u043f\u0438\u0442\u044c \u0437\u0430 '+fmt(KITS[gV][k].cost)+'?','\u041a\u0443\u043f\u0438\u0442\u044c',()=>run('buyKit',{v:gV,id:k},{ok:()=>run('vset',{v:gV,f:'kit',val:k},{quiet:true})}));return}run('vset',{v:gV,f:'kit',val:k},{quiet:true});Haptic.tick()};
ACT.vst=el=>{const id=+el.dataset.id;const cur=S.veh[gV].st.slice();const i=cur.indexOf(id);if(i>=0)cur.splice(i,1);else{if(cur.length>=3){toast('\u041d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u0442\u0440\u0451\u0445 \u043d\u0430\u043a\u043b\u0435\u0435\u043a');return}cur.push(id)}run('vset',{v:gV,f:'st',val:cur},{quiet:true});Haptic.tick()};
ACT.platePick=()=>{
  const l=S.box.slice().sort((a,b)=>b.price-a.price).slice(0,60);
  Sheet.open({title:'\u041d\u043e\u043c\u0435\u0440 \u043d\u0430 '+(gV==='car'?'\u043c\u0430\u0448\u0438\u043d\u0443':'\u043f\u0438\u0442\u0431\u0430\u0439\u043a'),body:(S.veh[gV].plate?'<div class="pad" style="margin-bottom:12px"><button class="btn wide" data-act="plateSet" data-id="0">\u0421\u043d\u044f\u0442\u044c \u043d\u043e\u043c\u0435\u0440</button></div>':'')+(l.length?'<div class="grid2">'+l.map(x=>'<button class="mat" data-act="plateSet" data-id="'+x.id+'" style="display:grid;gap:6px;padding:10px">'+plateHTML(x)+'<span class="num" style="font:600 13px var(--f-ui)">'+COIN(x.price)+'</span></button>').join('')+'</div>':'<div class="empty">\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0432 \u00ab\u041c\u0430\u0433\u0430\u0437\u0438\u043d\u0435\u00bb</div>')});
};
ACT.plateSet=el=>{run('vset',{v:gV,f:'plate',val:+el.dataset.id},{quiet:true});Sheet.close()};

/* ---------- \u0441\u0442\u0435\u043d\u0430: \u0432\u0435\u0442\u043a\u0438 \u043e\u0442\u0432\u0435\u0442\u043e\u0432 \u043a\u0430\u043a \u0432\u043e \u0412\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u0435 ---------- */
const Wall={reply:{}};
async function loadWall(uid,box){
  if(!box)return;
  try{const j=await pubProfile(uid);if(!document.body.contains(box))return;box.innerHTML=wallHTML(uid,j.comments);hydrateAvas(box)}
  catch(e){box.innerHTML='<div class="empty">'+esc(e.message)+'</div>'}
}
function cmtHTML(c,uid,isReply){
  const own=uid===Net.me.uid;const adm=!!Net.me.role;const mine=c.author===Net.me.uid;
  return'<div class="cmt'+(isReply?' reply':'')+'" id="cm-'+esc(c.id)+'"><button data-act="profile" data-uid="'+esc(c.author)+'">'+avaHTML(c.author,c.nick,'sm',true)+'</button><div class="body"><div class="who">'+esc(c.nick)+(c.adm?'<span class="adm">\u0410\u0434\u043c\u0438\u043d</span>':'')+'<small>'+ago(c.t)+'</small></div>'+
    '<p>'+(c.reply_to&&isReply?'<span class="to">'+esc(c.reply_to)+', </span>':'')+esc(c.text)+'</p><div class="ops"><button data-act="cmReply" data-id="'+esc(c.id)+'" data-uid="'+esc(uid)+'" data-n="'+esc(c.nick)+'">\u041e\u0442\u0432\u0435\u0442\u0438\u0442\u044c</button>'+((own||adm||mine)?'<button data-act="cmDel" data-id="'+esc(c.id)+'" data-uid="'+esc(uid)+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button>':'')+(!mine?'<button data-act="cmRep" data-id="'+esc(c.id)+'">\u041f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f</button>':'')+'<button class="cid num" data-act="cmCopy" data-n="'+c.num+'">C'+pad8(c.num)+'</button></div></div></div>';
}
function wallHTML(uid,list){
  const roots=list.filter(c=>!c.parent).sort((a,b)=>b.t-a.t);
  const reps={};list.filter(c=>c.parent).forEach(c=>{(reps[c.parent]=reps[c.parent]||[]).push(c)});
  const rt=Wall.reply[uid];
  const muted=Net.me.mute&&Net.me.mute.c;
  return'<div class="card" style="overflow:hidden">'+(muted?'<div class="cmt"><div class="body muted" style="font-size:14px">\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u043b \u0432\u0430\u043c \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438</div></div>':'<div style="padding:12px 14px 0">'+(rt?'<div class="replyto">\u041e\u0442\u0432\u0435\u0442 '+esc(rt.n)+'<button data-act="cmReplyX" data-uid="'+esc(uid)+'" aria-label="\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u043e\u0442\u0432\u0435\u0442">'+ic('close')+'</button></div>':'')+'</div><div style="padding:8px 14px 12px;display:flex;gap:8px;align-items:flex-end"><textarea class="inp" id="cm-'+esc(uid)+'-in" maxlength="200" rows="1" placeholder="'+(rt?'\u0412\u0430\u0448 \u043e\u0442\u0432\u0435\u0442':'\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439')+'" style="min-height:44px;height:44px;resize:none;padding-top:11px" data-on="cmLen"></textarea><button class="btn md blue" data-act="cmSend" data-uid="'+esc(uid)+'" style="height:44px">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c</button></div>')+
    (roots.length?roots.map(c=>cmtHTML(c,uid,false)+((reps[c.id]||[]).sort((a,b)=>a.t-b.t).map(r=>cmtHTML(r,uid,true)).join(''))).join(''):'<div class="cmt"><div class="body muted" style="font-size:15px">\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442</div></div>')+'</div>'+
    '<p class="note">\u0414\u043e 200 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432, \u043d\u0435 \u0447\u0430\u0449\u0435 \u0440\u0430\u0437\u0430 \u0432 20 \u0441\u0435\u043a\u0443\u043d\u0434. \u041c\u0430\u0442 \u0438 \u0441\u0441\u044b\u043b\u043a\u0438 \u043d\u0435 \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430\u044e\u0442\u0441\u044f. \u0423 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f \u0441\u0432\u043e\u0439 \u043d\u043e\u043c\u0435\u0440 C00000000 \u2014 \u043f\u043e \u043d\u0435\u043c\u0443 \u0435\u0433\u043e \u043b\u0435\u0433\u043a\u043e \u043d\u0430\u0439\u0442\u0438.</p>';
}
ON.cmLen=el=>{el.style.height='44px';el.style.height=Math.min(140,el.scrollHeight)+'px'};
ACT.cmReply=el=>{const uid=el.dataset.uid;Wall.reply[uid]={id:el.dataset.id,n:el.dataset.n};
  if(!$('cm-'+uid+'-in')){Sheet.close();if(uid===Net.me.uid){Tabs.go('account');setTimeout(()=>{reloadWall(uid);setTimeout(()=>{const i=$('cm-'+uid+'-in');if(i){i.focus();i.scrollIntoView({block:'center'})}},400)},200)}else ACT.profile({dataset:{uid}});return}
  reloadWall(uid);setTimeout(()=>{const i=$('cm-'+uid+'-in');if(i){i.focus();i.scrollIntoView({block:'center',behavior:'smooth'})}},250)};
ACT.cmReplyX=el=>{delete Wall.reply[el.dataset.uid];reloadWall(el.dataset.uid)};
ACT.cmCopy=async el=>{await copyText('C'+pad8(el.dataset.n));toast('ID \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d')};
ACT.cmSend=el=>{
  const uid=el.dataset.uid;const ta=$('cm-'+uid+'-in');const txt=(ta&&ta.value||'').trim();
  const chk=L.checkComment(txt);if(!chk.ok){toast(chk.err,'err');Haptic.err();return}
  const rt=Wall.reply[uid];
  run('comment',{wall:uid,text:txt,parent:rt?rt.id:''},{btn:el,quiet:true,ok:()=>{ta.value='';delete Wall.reply[uid];toast(rt?'\u041e\u0442\u0432\u0435\u0442 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d':'\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d');reloadWall(uid)}});
};
ACT.cmDel=el=>confirmSheet('\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439?','\u041e\u0442\u0432\u0435\u0442\u044b \u043d\u0430 \u043d\u0435\u0433\u043e \u0442\u043e\u0436\u0435 \u0443\u0434\u0430\u043b\u044f\u0442\u0441\u044f.','\u0423\u0434\u0430\u043b\u0438\u0442\u044c',()=>run(Net.me.role&&el.dataset.uid!==Net.me.uid?'adm.cdel':'commentDel',{id:el.dataset.id},{quiet:true,ok:()=>{toast('\u0423\u0434\u0430\u043b\u0435\u043d\u043e');reloadWall(el.dataset.uid)}}),true);
ACT.cmRep=el=>confirmSheet('\u041f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f?','\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u0438\u0442 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u0438 \u0443\u0434\u0430\u043b\u0438\u0442 \u0435\u0433\u043e, \u0435\u0441\u043b\u0438 \u043e\u043d \u043d\u0430\u0440\u0443\u0448\u0430\u0435\u0442 \u043f\u0440\u0430\u0432\u0438\u043b\u0430.','\u041f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f',()=>run('report',{id:el.dataset.id}),true);
function reloadWall(uid){if(uid===Net.me.uid&&Tabs.cur==='account'&&!Page.stack.length)loadWall(uid,$('acc-wall'));if(Prof.cur===uid)Prof.reload()}
ACT.myWall=()=>ACT.profile({dataset:{uid:Net.me.uid}});

/* ---------- \u043c\u043e\u0438 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438 \u0438 \u043f\u043e\u0438\u0441\u043a \u043f\u043e ID ---------- */
let myCm=null;
ACT.myComments=()=>{myCm=null;Page.push('mycm','\u041c\u043e\u0438 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438',renderMyCm);commentsBy(Net.me.uid).then(l=>{myCm=l;if(Page.is('mycm'))Page.renderTop()}).catch(()=>{myCm=[];Page.renderTop()})};
function renderMyCm(el){
  if(!myCm){el.innerHTML='<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>';return}
  el.innerHTML='<p class="lead">\u0412\u0441\u0435 \u0432\u0430\u0448\u0438 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438 \u2014 \u043d\u0430 \u0441\u0432\u043e\u0435\u0439 \u0441\u0442\u0435\u043d\u0435 \u0438 \u0432 \u0447\u0443\u0436\u0438\u0445 \u043f\u0440\u043e\u0444\u0438\u043b\u044f\u0445.</p>'+(myCm.length?'<div class="rows">'+myCm.map(c=>'<button class="row" data-act="profile" data-uid="'+esc(c.wall)+'" data-c="'+esc(c.id)+'" style="align-items:flex-start"><div class="mid"><div class="ss" style="color:var(--text);white-space:normal;margin:0;font-size:15px">'+(c.reply_to?'<span class="muted">'+esc(c.reply_to)+', </span>':'')+esc(c.text)+'</div><div class="ey" style="margin-top:6px">'+(c.wall===Net.me.uid?'\u041d\u0430 \u0432\u0430\u0448\u0435\u0439 \u0441\u0442\u0435\u043d\u0435':'\u0412 \u0447\u0443\u0436\u043e\u043c \u043f\u0440\u043e\u0444\u0438\u043b\u0435')+' \u00b7 '+ago(c.t)+' \u00b7 C'+pad8(c.num)+'</div></div>'+ic('chev','chev')+'</button>').join('')+'</div>':'<div class="empty">\u0412\u044b \u0435\u0449\u0451 \u043d\u0435 \u043f\u0438\u0441\u0430\u043b\u0438 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432</div>');
}
ACT.findId=()=>{
  Sheet.open({title:'\u041d\u0430\u0439\u0442\u0438 \u043f\u043e ID',lead:'\u0418\u0433\u0440\u043e\u043a \u2014 8 \u0446\u0438\u0444\u0440, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 00000001. \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u2014 \u0441 \u0431\u0443\u043a\u0432\u043e\u0439 C, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 C00000012.',body:'<div class="field"><input class="inp num" id="fid" placeholder="00000001 \u0438\u043b\u0438 C00000012" autocomplete="off" autocapitalize="characters"></div><div class="foot"><button class="btn pri wide" data-act="findGo">\u041d\u0430\u0439\u0442\u0438</button></div><div id="fid-res"></div>'});
  setTimeout(()=>{const i=$('fid');if(i)i.focus()},300);
};
ACT.findGo=async el=>{
  const q=String($('fid').value||'').trim().toUpperCase().replace(/\s/g,'');const box=$('fid-res');
  try{
    el.classList.add('busy');
    if(/^[C\u0421]\d{1,9}$/.test(q)){
      const c=await commentByNum(+q.slice(1));if(!c){box.innerHTML='<div class="empty">\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d</div>';return}
      box.innerHTML='<div class="sec" style="font-size:18px">\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 C'+pad8(c.num)+'</div><div class="card">'+cmtHTML(c,c.wall,false)+'</div><div class="foot"><button class="btn wide" data-act="profile" data-uid="'+esc(c.wall)+'">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0442\u0435\u043d\u0443</button></div>';hydrateAvas(box);
    }else if(/^\d{1,9}$/.test(q)){
      const p=await profileByNum(+q);if(!p){box.innerHTML='<div class="empty">\u0418\u0433\u0440\u043e\u043a \u0441 \u0442\u0430\u043a\u0438\u043c ID \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d</div>';return}
      ACT.profile({dataset:{uid:p.uid}});
    }else box.innerHTML='<div class="empty">\u0412\u0432\u0435\u0434\u0438\u0442\u0435 8 \u0446\u0438\u0444\u0440 \u0438\u043b\u0438 C \u0438 \u0446\u0438\u0444\u0440\u044b</div>';
  }catch(e){box.innerHTML='<div class="empty">'+esc(e.message)+'</div>'}
  finally{el.classList.remove('busy')}
};

/* ---------- \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0438\u0433\u0440\u043e\u043a\u0430 ---------- */
const Prof={cur:null,data:null,tab:'wall',theirs:null,reload(){if(Page.is('profile'))loadProfile(Prof.cur)}};
ACT.profile=el=>{
  const uid=el.dataset.uid;if(!uid)return;Sheet.close();
  Prof.cur=uid;Prof.data=null;Prof.tab='wall';Prof.theirs=null;
  Page.push('profile','\u041f\u0440\u043e\u0444\u0438\u043b\u044c',renderProfile,{noTitle:true,onClose:()=>{Prof.cur=null}});
  loadProfile(uid);
};
async function loadProfile(uid){try{Prof.data=await pubProfile(uid);if(Prof.cur===uid&&Page.is('profile'))Page.renderTop()}catch(e){toast(e.message,'err')}}
function renderProfile(el){
  const d=Prof.data;if(!d){el.innerHTML='<div class="empty" style="margin-top:40px">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043f\u0440\u043e\u0444\u0438\u043b\u044c\u2026</div>';return}
  const p=d.p;const veh=p.veh;const own=p.uid===Net.me.uid;const show=Array.isArray(p.show)?p.show:[];
  el.innerHTML='<div class="prof">'+avaHTML(p.uid,p.nick,'lg',p.ava)+'<div class="nick">'+esc(p.nick)+admBadge(p.role)+'</div><button class="idline num" data-act="copyId" data-n="'+p.num+'">ID '+idStr(p.num)+' '+ic('copy')+'</button><div class="bdg">'+badgesFor(p)+'</div><div class="muted" style="font-size:13px">\u0412 \u0438\u0433\u0440\u0435 \u0441 '+dateRu(Number(p.created))+'</div></div>'+
    '<div class="stats3" style="margin-top:16px"><div class="stat"><b>'+p.lvl+'</b><span>\u0443\u0440\u043e\u0432\u0435\u043d\u044c</span></div><div class="stat"><b>'+(p.worth==null?'\u0441\u043a\u0440\u044b\u0442\u043e':shortN(Number(p.worth)))+'</b><span>\u0433\u0430\u0440\u0430\u0436 \u0432 \u043c\u043e\u043d\u0435\u0442\u0430\u0445</span></div><div class="stat"><b>'+fmtN(p.xp)+'</b><span>\u043e\u043f\u044b\u0442</span></div></div>'+
    (show.length?'<div class="sec">\u0412\u0438\u0442\u0440\u0438\u043d\u0430</div>'+showcaseHTML(show,false):'')+
    (p.best?'<div class="sec">\u041b\u0443\u0447\u0448\u0438\u0439 \u043d\u043e\u043c\u0435\u0440</div><button class="card p" data-act="pinsp" style="display:block;width:calc(100% - 2*var(--g))"><div style="max-width:320px;margin:0 auto">'+plateHTML(p.best)+'</div><div style="display:flex;justify-content:center;gap:6px;margin-top:10px;flex-wrap:wrap">'+itemMeta(p.best)+'</div></button>':'')+
    (veh&&veh.car?'<div class="sec">\u0413\u0430\u0440\u0430\u0436</div><div class="grid2"><div class="garage-view" style="margin:0;height:150px"><canvas id="pv-car"></canvas>'+(veh.plates&&veh.plates.car?'<span style="position:absolute;left:8px;bottom:8px;width:84px">'+plateHTML(veh.plates.car)+'</span>':'')+'</div><div class="garage-view" style="margin:0;height:150px"><canvas id="pv-bike"></canvas>'+(veh.plates&&veh.plates.bike?'<span style="position:absolute;left:8px;bottom:8px;width:84px">'+plateHTML(veh.plates.bike)+'</span>':'')+'</div></div>':'')+
    '<div class="pad" style="margin-top:22px"><div class="segbox"><button class="'+(Prof.tab==='wall'?'on':'')+'" data-act="profTab" data-t="wall">\u0421\u0442\u0435\u043d\u0430</button><button class="'+(Prof.tab==='theirs'?'on':'')+'" data-act="profTab" data-t="theirs">\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438 \u0438\u0433\u0440\u043e\u043a\u0430</button></div></div><div style="height:12px"></div>'+
    (Prof.tab==='wall'?wallHTML(p.uid,d.comments):theirsHTML())+
    (Net.me.role&&!own?'<div class="sec">\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f</div><div class="group">'+
      '<button class="li" data-act="admMuteP" data-uid="'+esc(p.uid)+'" data-n="'+esc(p.nick)+'"><span class="lic" style="background:var(--orange)">'+ic('clock')+'</span><span class="lt">\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u0442\u044c</span></button>'+
      '<button class="li" data-act="admBanP" data-uid="'+esc(p.uid)+'" data-on="'+(p.banned?0:1)+'"><span class="lic" style="background:var(--red)">'+ic('lock')+'</span><span class="lt">'+(p.banned?'\u0420\u0430\u0437\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c':'\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442')+'</span></button>'+
      (p.ava?'<button class="li" data-act="admAvaP" data-uid="'+esc(p.uid)+'"><span class="lic" style="background:var(--orange)">'+ic('trash')+'</span><span class="lt">\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440</span></button>':'')+
      '<button class="li" data-act="admGiftP" data-uid="'+esc(String(p.num||p.uid))+'"><span class="lic" style="background:var(--green)">'+ic('gift')+'</span><span class="lt">\u041f\u043e\u0434\u0430\u0440\u043e\u043a</span></button></div>':'');
  hydrateAvas(el);
  requestAnimationFrame(()=>{
    if(!veh)return;const mk=k=>{const v=veh[k];if(!v)return null;return Object.assign({},v,{st:(veh.st&&veh.st[k])||[]})};
    const a=$('pv-car'),b=$('pv-bike');if(a&&veh.car)Draw.preview(a,'car',mk('car'),{k:.8});if(b&&veh.bike)Draw.preview(b,'bike',mk('bike'),{k:.76});
  });
}
function theirsHTML(){
  if(!Prof.theirs)return'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>';
  return Prof.theirs.length?'<div class="rows">'+Prof.theirs.map(c=>'<button class="row" data-act="profile" data-uid="'+esc(c.wall)+'" style="align-items:flex-start"><div class="mid"><div class="ss" style="color:var(--text);white-space:normal;margin:0;font-size:15px">'+(c.reply_to?'<span class="muted">'+esc(c.reply_to)+', </span>':'')+esc(c.text)+'</div><div class="ey" style="margin-top:6px">'+ago(c.t)+' \u00b7 C'+pad8(c.num)+'</div></div></button>').join('')+'</div>':'<div class="empty">\u0418\u0433\u0440\u043e\u043a \u0435\u0449\u0451 \u043d\u0435 \u043f\u0438\u0441\u0430\u043b \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432</div>';
}
ACT.profTab=el=>{Prof.tab=el.dataset.t;if(Prof.tab==='theirs'&&!Prof.theirs){commentsBy(Prof.cur).then(l=>{Prof.theirs=l;Page.renderTop()}).catch(()=>{Prof.theirs=[];Page.renderTop()})}Page.renderTop()};
ACT.copyId=async el=>{await copyText(pad8(el.dataset.n));toast('ID \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d')};
ACT.pinsp=()=>{const p=Prof.data&&Prof.data.p;if(p&&p.best)inspect(Object.assign({},p.best),{title:plateText(p.best.pl)})};
ACT.pubInsp=el=>{const p=Prof.data&&Prof.data.p;const it=p&&p.show&&p.show[+el.dataset.i];if(it)inspect(Object.assign({},it),{title:plateText(it.pl)})};

/* ---------- \u0440\u0435\u0444\u0435\u0440\u0430\u043b\u044b ---------- */
function refLink(){const bot=Net.cfg.bot;if(!bot)return'';return'https://t.me/'+bot+'/'+(Net.cfg.app||'play')+'?startapp=r_'+Net.me.uid}
ACT.referral=()=>{Page.push('ref','\u0414\u0440\u0443\u0437\u044c\u044f',renderRef);loadRefInfo()};
let refInfo=null;
async function loadRefInfo(){try{const r=await act('refInfo');refInfo=r.refs;if(Page.is('ref'))Page.renderTop()}catch(e){}}
function renderRef(el){
  const link=refLink();const t=L.plusTier(S.don);const prem=L.isPrem(S,now());
  const my=L.refRewardFor(S.don,prem),fr=L.invRewardFor(S.don,prem),cap=L.refCapFor(S.don);
  const ri=refInfo||{all:0,active:0,paid:0,queued:0,week:0,cap,last:[]};
  el.innerHTML='<div class="hero g-orange" style="background:var(--gc);min-height:180px"><p style="margin:0;color:var(--tint)">'+(t>=0?'\u0421\u0442\u0430\u0442\u0443\u0441 Plus \u00b7 '+L.PLUS[t].n:'\u0411\u0435\u0437 Plus')+(prem?' + Premium':'')+'</p><h3 class="num">\u0412\u0430\u043c '+fmt(my)+'<br>\u0414\u0440\u0443\u0433\u0443 '+fmt(fr)+'</h3><p>\u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0451\u043d\u043d\u043e\u0433\u043e</p></div>'+
    '<div class="card p" style="margin-top:12px"><div style="font:600 16px var(--f-ui);margin-bottom:6px">\u0423\u0441\u043b\u043e\u0432\u0438\u044f \u0434\u043b\u044f \u043e\u0431\u043e\u0438\u0445</div><div class="muted" style="font-size:14px;line-height:1.45">1. \u0414\u0440\u0443\u0433 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442 \u0438\u0433\u0440\u0443 \u043f\u043e \u0432\u0430\u0448\u0435\u0439 \u0441\u0441\u044b\u043b\u043a\u0435.<br>2. \u0414\u0440\u0443\u0433 \u0434\u043e\u0445\u043e\u0434\u0438\u0442 \u0434\u043e '+L.REF_LVL+' \u0443\u0440\u043e\u0432\u043d\u044f \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430 (\u043a\u0435\u0439\u0441\u044b, \u0437\u0430\u0434\u0430\u043d\u0438\u044f, \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b).<br>3. \u0412\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 '+fmt(my)+', \u0434\u0440\u0443\u0433 \u2014 '+fmt(fr)+' \u0447\u0430\u0441\u0442\u044f\u043c\u0438 \u0437\u0430 '+L.INV_DAYS+' \u0434\u043d\u0435\u0439.<br>\u0412 \u043d\u0435\u0434\u0435\u043b\u044e \u043e\u043f\u043b\u0430\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u0434\u043e '+cap+' \u0434\u0440\u0443\u0437\u0435\u0439. \u041e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u043f\u0435\u0440\u0435\u043d\u043e\u0441\u044f\u0442\u0441\u044f \u043d\u0430 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u043d\u0435\u0434\u0435\u043b\u0438, \u043d\u043e \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 \u043a\u0430\u0436\u0434\u0443\u044e \u043d\u0435\u0434\u0435\u043b\u044e \u043f\u0435\u0440\u0435\u043d\u043e\u0441\u0430 \u0434\u0435\u043b\u0438\u0442\u0441\u044f \u043d\u0430 2. \u0411\u043e\u043d\u0443\u0441 \u0434\u0440\u0443\u0433\u0430 \u043e\u0442 \u043b\u0438\u043c\u0438\u0442\u0430 \u043d\u0435 \u0437\u0430\u0432\u0438\u0441\u0438\u0442.</div></div>'+
    '<div class="card p" style="margin-top:12px;display:grid;gap:10px">'+(link?'<div class="inp num" style="display:flex;align-items:center;font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;height:44px">'+esc(link)+'</div><div class="rowf"><button class="btn md" data-act="copyRef">'+ic('copy')+'\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c</button><button class="btn md pri" data-act="shareRef">'+ic('share')+'\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f</button></div>':'<div class="muted">\u0421\u0441\u044b\u043b\u043a\u0430 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f, \u043a\u043e\u0433\u0434\u0430 \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442 \u0431\u043e\u0442\u0430 \u0432 \u0430\u0434\u043c\u0438\u043d\u043a\u0435.</div>')+'</div>'+
    (S.hint.ref<now()&&t<0?'<div class="row" style="margin:12px var(--g) 0;width:auto;background:rgba(255,200,61,.14)"><div class="mid"><div class="tt" style="font-size:16px;white-space:normal">\u0421 Plus \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 \u0434\u0440\u0443\u0433\u0430 \u0432 10 \u0440\u0430\u0437 \u0432\u044b\u0448\u0435</div><div class="ss" style="white-space:normal">Plus \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u043a\u0430\u0436\u0434\u044b\u0439, \u043a\u0442\u043e \u0445\u043e\u0442\u044c \u0440\u0430\u0437 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0430\u043b \u0438\u0433\u0440\u0443</div></div><button class="iconbtn" data-act="refHintX" aria-label="\u0421\u043a\u0440\u044b\u0442\u044c \u043d\u0430 \u043d\u0435\u0434\u0435\u043b\u044e">'+ic('close')+'</button></div>':'')+
    '<div class="stats3" style="margin-top:12px"><div class="stat"><b>'+ri.all+'</b><span>\u043f\u0440\u0438\u0448\u043b\u0438</span></div><div class="stat"><b>'+ri.active+'</b><span>\u0434\u043e\u0448\u043b\u0438 \u0434\u043e '+L.REF_LVL+' \u0443\u0440.</span></div><div class="stat"><b>'+ri.week+' / '+ri.cap+'</b><span>\u043d\u0430 \u044d\u0442\u043e\u0439 \u043d\u0435\u0434\u0435\u043b\u0435</span></div></div>'+
    (ri.queued?'<p class="note">'+ri.queued+' '+plural(ri.queued,'\u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0436\u0434\u0451\u0442','\u043d\u0430\u0433\u0440\u0430\u0434\u044b \u0436\u0434\u0443\u0442','\u043d\u0430\u0433\u0440\u0430\u0434 \u0436\u0434\u0443\u0442')+' \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0445 \u043d\u0435\u0434\u0435\u043b\u044c.</p>':'')+
    '<div class="sec">\u0421\u043a\u043e\u043b\u044c\u043a\u043e \u0434\u0430\u044e\u0442</div><div class="rtab"><div class="rh"><span>\u0421\u0442\u0430\u0442\u0443\u0441</span><span>\u0412\u0430\u043c</span><span>\u0414\u0440\u0443\u0433\u0443</span><span>\u0412 \u043d\u0435\u0434\u0435\u043b\u044e</span></div>'+L.STATUS_N.map((n,i)=>'<div class="rr'+(i===t+1?' me':'')+'"><span>'+n+(i===t+1?' <small>(\u0432\u044b)</small>':'')+'</span><b class="num">'+shortN(L.REF_REW[i])+'</b><b class="num">'+shortN(L.INV_REW[i])+'</b><b class="num">\u0434\u043e '+L.REF_CAP[i]+'</b></div>').join('')+'<div class="rr"><span>Premium \u0441\u0432\u0435\u0440\u0445\u0443</span><b class="num">+'+shortN(L.REF_PREM)+'</b><b class="num">+'+shortN(L.INV_PREM)+'</b><b></b></div></div><p class="note">\u0421\u0443\u043c\u043c\u044b \u0432 \u043c\u043e\u043d\u0435\u0442\u0430\u0445. \u00ab\u0414\u0440\u0443\u0433\u0443\u00bb \u2014 \u0431\u043e\u043d\u0443\u0441 \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0451\u043d\u043d\u043e\u043c\u0443, \u043e\u043d \u043f\u0440\u0438\u0445\u043e\u0434\u0438\u0442 \u0447\u0430\u0441\u0442\u044f\u043c\u0438 \u0437\u0430 '+L.INV_DAYS+' \u0434\u043d\u0435\u0439.</p>'+
    (ri.last.length?'<div class="sec">\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435</div><div class="group">'+ri.last.map(r=>'<div class="li noic"><span class="lt">'+esc(r.nick)+'</span><span class="lv">'+(r.state==='paid'?'\u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430':r.state==='ready'?(r.dw?'\u043f\u0435\u0440\u0435\u043d\u043e\u0441 \u043d\u0430 '+r.dw+' \u043d\u0435\u0434.':'\u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0432 \u043f\u0443\u0442\u0438'):'\u0435\u0449\u0451 \u043d\u0435 '+L.REF_LVL+' \u0443\u0440\u043e\u0432\u0435\u043d\u044c')+'</span></div>').join('')+'</div>':'');
}
ACT.copyRef=async()=>{const l=refLink();if(!l)return;await copyText(l);toast('\u0421\u0441\u044b\u043b\u043a\u0430 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0430');Haptic.ok();if(S.hint.ref<now()&&L.plusTier(S.don)<0)setTimeout(()=>toast('\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430: \u0441 Plus \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0434\u0440\u0443\u0433\u0430 \u0434\u0430\u044e\u0442 \u0432 10 \u0440\u0430\u0437 \u0431\u043e\u043b\u044c\u0448\u0435'),900)};
ACT.shareRef=el=>{
  const l=refLink();if(!l){toast('\u0421\u0441\u044b\u043b\u043a\u0430 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f \u0431\u043e\u0442\u0430');return}
  if(el&&el.dataset&&el.dataset.src==='drop')run('hint',{k:'share'},{quiet:true});
  const text='\u0412\u044b\u0431\u0438\u0432\u0430\u044e \u043d\u043e\u043c\u0435\u0440\u0430 \u0432 Telegram. \u0417\u0430\u043b\u0435\u0442\u0430\u0439 \u2014 \u043f\u043e \u043c\u043e\u0435\u0439 \u0441\u0441\u044b\u043b\u043a\u0435 \u0434\u0430\u0434\u0443\u0442 '+fmt(L.invRewardFor(S.don,L.isPrem(S,now())))+'!';
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
    el.innerHTML='<p class="lead">\u0414\u043b\u044f \u0431\u043b\u043e\u0433\u0435\u0440\u043e\u0432 \u0438 \u0430\u0432\u0442\u043e\u0440\u043e\u0432 \u043a\u0430\u043d\u0430\u043b\u043e\u0432. \u041f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 \u0441\u0432\u043e\u0439 \u043a\u043e\u0434 \u0430\u0432\u0442\u043e\u0440\u0430: \u0438\u0433\u0440\u043e\u043a\u0438, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0435\u0433\u043e \u0443\u043a\u0430\u0436\u0443\u0442, \u043f\u043e\u043b\u0443\u0447\u0430\u044e\u0442 +5% \u043c\u043e\u043d\u0435\u0442\u0430\u043c\u0438 \u043a \u043f\u043e\u043a\u0443\u043f\u043a\u0430\u043c, \u0430 \u0432\u0430\u043c \u0438\u0434\u0451\u0442 10% \u043e\u0442 \u0441\u0443\u043c\u043c\u044b \u0438\u0445 \u043f\u043e\u043a\u0443\u043f\u043e\u043a \u0432 \u043c\u043e\u043d\u0435\u0442\u0430\u0445.</p>'+
      (m&&m.status==='rejected'?'<div class="netbar">\u041f\u0440\u043e\u0448\u043b\u0430\u044f \u0437\u0430\u044f\u0432\u043a\u0430 \u043e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u0430. \u041c\u043e\u0436\u043d\u043e \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0441\u043d\u043e\u0432\u0430.</div>':'')+
      '<div class="field" style="margin-top:12px"><label>\u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 \u043a\u0430\u043d\u0430\u043b</label><input class="inp" id="md-ch" placeholder="https://t.me/\u0432\u0430\u0448_\u043a\u0430\u043d\u0430\u043b"></div><div class="field"><label>\u0416\u0435\u043b\u0430\u0435\u043c\u044b\u0439 \u043a\u043e\u0434 (\u043b\u0430\u0442\u0438\u043d\u0438\u0446\u0430 \u0438\u043b\u0438 \u043a\u0438\u0440\u0438\u043b\u043b\u0438\u0446\u0430)</label><input class="inp" id="md-code" maxlength="16" placeholder="\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, NOMERA"></div>'+
      '<div class="pad"><button class="btn pri wide" data-act="mediaApply">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443</button></div><p class="note">\u0417\u0430\u044f\u0432\u043a\u0443 \u043e\u0434\u043e\u0431\u0440\u044f\u0435\u0442 \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446, \u0430 \u043f\u043e\u0441\u043b\u0435 20 \u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0445 \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0451\u043d\u043d\u044b\u0445 \u2014 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438.</p>';
    return;
  }
  if(m.status==='pending'){el.innerHTML='<div class="empty">'+ic('clock')+'\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 \u0440\u0430\u0441\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u0438\u0438<span class="num">\u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0445 \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0451\u043d\u043d\u044b\u0445: '+m.active+' \u0438\u0437 20</span></div>';return}
  el.innerHTML='<div class="hero g-red" style="background:var(--gc);min-height:160px"><p style="margin:0;color:var(--tint)">\u0412\u0430\u0448 \u043a\u043e\u0434 \u0430\u0432\u0442\u043e\u0440\u0430</p><h3 style="font-size:34px">'+esc(m.code)+'</h3><p>\u0414\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 7 \u0434\u043d\u0435\u0439 \u043f\u043e\u0441\u043b\u0435 \u0432\u0432\u043e\u0434\u0430. \u0421\u0432\u043e\u0439 \u043a\u043e\u0434 \u0443\u043a\u0430\u0437\u0430\u0442\u044c \u043d\u0435\u043b\u044c\u0437\u044f.</p></div>'+
    '<div class="stats3" style="margin-top:12px"><div class="stat"><b>'+m.invites+'</b><span>\u043f\u043e \u0441\u0441\u044b\u043b\u043a\u0435</span></div><div class="stat"><b>'+m.active+'</b><span>\u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0435</span></div><div class="stat"><b>'+m.buys+'</b><span>\u043f\u043e\u043a\u0443\u043f\u043e\u043a</span></div></div>'+
    '<div class="card p" style="margin-top:12px;display:flex;align-items:center;gap:12px"><div style="flex:1"><div class="muted" style="font-size:13px">\u041d\u0430\u0447\u0438\u0441\u043b\u0435\u043d\u043e</div><div style="font:700 26px var(--f-ui)" class="num">'+COIN(m.earned)+'</div><div class="muted" style="font-size:13px">\u0412\u0441\u0435\u0433\u043e \u0437\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u043e '+fmt(m.total)+'</div></div><button class="btn md pri'+(m.earned>0?'':' off')+'" data-act="mediaClaim">\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u043d\u0430 \u0431\u0430\u043b\u0430\u043d\u0441</button></div>'+
    '<div class="pad" style="margin-top:12px;display:grid;gap:10px"><button class="btn md" data-act="copyCode" data-c="'+esc(m.code)+'">'+ic('copy')+'\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u043e\u0434</button><button class="btn md" data-act="copyRef">'+ic('copy')+'\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443</button></div>';
}
ACT.mediaApply=el=>run('mediaApply',{channel:$('md-ch').value,code:$('md-code').value},{btn:el,ok:()=>ACT.back()});
ACT.mediaClaim=el=>run('mediaClaim',{},{btn:el,ok:()=>{Snd.coin();act('mediaInfo').then(r=>{mediaInfo=r;Page.renderTop()})}});
ACT.copyCode=async el=>{await copyText(el.dataset.c);toast('\u041a\u043e\u0434 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d')};

/* ---------- \u043f\u0440\u043e\u043c\u043e\u043a\u043e\u0434 \u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0438 ---------- */
ACT.promo=()=>{Sheet.open({title:'\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434',body:'<div class="field"><input class="inp" id="promo-i" placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0434" autocapitalize="characters" autocomplete="off"></div><div class="foot"><button class="btn pri wide" data-act="promoGo">\u0410\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u0442\u044c</button></div>'});setTimeout(()=>{const i=$('promo-i');if(i)i.focus()},300)};
ACT.promoGo=el=>run('redeem',{code:$('promo-i').value},{btn:el,ok:()=>{Sheet.close();Snd.win(3)}});
ACT.history=async()=>{
  Sheet.open({title:'\u041c\u043e\u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0438',body:'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>'});
  try{const r=await act('payments');Sheet.body(r.list.length?'<div class="group">'+r.list.map(x=>'<div class="li noic"><span class="lt">'+esc(productName(x.pid))+'<br><span class="muted" style="font-size:13px">'+dateRu(x.t)+(x.status==='refunded'?' \u00b7 \u0432\u043e\u0437\u0432\u0440\u0430\u0442':'')+'</span></span><span class="lv num">'+STAR(x.stars)+'</span></div>').join('')+'</div><p class="note">\u0415\u0441\u043b\u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0430 \u043d\u0435 \u043f\u0440\u0438\u0448\u043b\u0430 \u2014 \u043d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u0432 \u00ab\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443\u00bb, \u043e\u0442\u0432\u0435\u0442\u0438\u043c \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u0441\u0443\u0442\u043e\u043a.</p>':'<div class="empty">\u041f\u043e\u043a\u0443\u043f\u043e\u043a \u043f\u043e\u043a\u0430 \u043d\u0435 \u0431\u044b\u043b\u043e</div>')}catch(e){Sheet.body('<div class="empty">'+esc(e.message)+'</div>')}
};

/* ---------- \u0432\u0445\u043e\u0434 \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430: Telegram + \u043a\u043b\u044e\u0447 \u0438\u043b\u0438 Face ID ---------- */
const Bio=(()=>{
  const BM=()=>TG&&TG.BiometricManager;
  let inited=false;
  function init(){return new Promise(res=>{const bm=BM();if(!bm||!tgVer('7.2'))return res(null);if(inited)return res(bm);try{bm.init(()=>{inited=true;res(bm)})}catch(e){res(null)}})}
  return{
    async available(){const bm=await init();return!!(bm&&bm.isBiometricAvailable)},
    async saved(){const bm=await init();return!!(bm&&bm.isBiometricTokenSaved)},
    async type(){const bm=await init();return bm&&bm.biometricType==='face'?'Face ID':'\u043e\u0442\u043f\u0435\u0447\u0430\u0442\u043e\u043a'},
    async save(ds){const bm=await init();if(!bm)throw new Error('\u0411\u0438\u043e\u043c\u0435\u0442\u0440\u0438\u044f \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430');
      if(!bm.isAccessGranted){const ok=await new Promise(r=>bm.requestAccess({reason:'\u0412\u0445\u043e\u0434 \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430 \u0432 \u00ab\u0412\u044b\u0431\u0438\u0432\u0430\u043d\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u043e\u0432\u00bb'},r));if(!ok)throw new Error('\u0414\u043e\u0441\u0442\u0443\u043f \u043a \u0431\u0438\u043e\u043c\u0435\u0442\u0440\u0438\u0438 \u043d\u0435 \u0432\u044b\u0434\u0430\u043d')}
      const ok=await new Promise(r=>bm.updateBiometricToken(ds,r));if(!ok)throw new Error('\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u043b\u044e\u0447 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430');lsSet('nomera21_bio','1')},
    async read(){const bm=await init();if(!bm)throw new Error('\u0411\u0438\u043e\u043c\u0435\u0442\u0440\u0438\u044f \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430');
      return new Promise((res,rej)=>bm.authenticate({reason:'\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0432\u0445\u043e\u0434 \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430'},(ok,tok)=>ok&&tok?res(tok):rej(new Error('\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d\u0430'))))}
  };
})();
const Owner={
  after:null,
  done(){Sheet.close();render();const f=Owner.after;Owner.after=null;if(f&&Net.me.elev)setTimeout(f,350)},
  async unlock(){
    const canBio=(await Bio.available())&&(await Bio.saved());const tp=await Bio.type();
    Sheet.open({title:'\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0432\u0445\u043e\u0434',lead:'\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b 30 \u043c\u0438\u043d\u0443\u0442 \u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f.',body:
      (canBio?'<div class="foot" style="padding-top:0"><button class="btn pri wide" data-act="bioGo">'+ic('faceid')+'\u0412\u043e\u0439\u0442\u0438: '+tp+'</button></div><div class="sec" style="font-size:16px;margin-top:16px">\u0418\u043b\u0438 \u043a\u043b\u044e\u0447\u043e\u043c</div>':'')+
      '<div class="field"><input class="inp" id="own-k" type="password" autocomplete="off" placeholder="ADMIN_KEY"></div><div class="foot"><button class="btn '+(canBio?'':'pri ')+'wide" data-act="ownerGo">\u0412\u043e\u0439\u0442\u0438 \u043f\u043e \u043a\u043b\u044e\u0447\u0443</button></div>'});
  }
};
ACT.ownerLogin=()=>{if(Net.me.role==='owner'&&Net.me.elev){toast('\u0412\u044b \u0443\u0436\u0435 \u0432\u043e\u0448\u043b\u0438 \u043a\u0430\u043a \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446');return}if(Net.me.role==='owner')return Owner.unlock();Sheet.open({title:'\u0412\u0445\u043e\u0434 \u0434\u043b\u044f \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430',lead:'\u0412\u0432\u0435\u0434\u0438\u0442\u0435 ADMIN_KEY. \u0412\u0445\u043e\u0434 \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0441 Telegram-\u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430 \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430.',body:'<div class="field"><input class="inp" id="own-k" type="password" autocomplete="off"></div><div class="foot"><button class="btn pri wide" data-act="ownerGo">\u0412\u043e\u0439\u0442\u0438</button></div>'})};
ACT.ownerGo=el=>run('admin',{key:$('own-k').value},{btn:el,ok:async r=>{
  if(r&&r.strict){Sheet.close();setTimeout(()=>Owner.unlock(),300);return}
  Owner.done();
  if(await Bio.available()&&!(await Bio.saved()))setTimeout(()=>confirmSheet('\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c '+'Face ID?','\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u0432\u0445\u043e\u0434\u044b \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430 \u2014 \u043f\u043e \u043b\u0438\u0446\u0443 \u0438\u043b\u0438 \u043e\u0442\u043f\u0435\u0447\u0430\u0442\u043a\u0443, \u0431\u0435\u0437 \u0432\u0432\u043e\u0434\u0430 \u043a\u043b\u044e\u0447\u0430. \u041a\u043b\u044e\u0447 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430 \u0445\u0440\u0430\u043d\u0438\u0442\u0441\u044f \u0432 \u0437\u0430\u0449\u0438\u0449\u0451\u043d\u043d\u043e\u043c \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435 Telegram.','\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c',bioSetup),500);
}});
async function bioSetup(){try{const r=await act('bioReg');await Bio.save(r.ds);toast('\u0413\u043e\u0442\u043e\u0432\u043e: \u0432\u0445\u043e\u0434 \u043f\u043e \u0431\u0438\u043e\u043c\u0435\u0442\u0440\u0438\u0438 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0451\u043d');Haptic.ok()}catch(e){toast(e.message,'err')}}
ACT.bioGo=async el=>{try{el.classList.add('busy');const ds=await Bio.read();await run('bioUnlock',{ds},{btn:el,ok:()=>Owner.done()})}catch(e){toast(e.message,'err')}finally{el.classList.remove('busy')}};

/* ---------- \u043f\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 ---------- */
function welcome(){
  Sheet.open({title:'\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c!',body:'<div class="rows" style="margin-top:6px">'+
    [['case','var(--orange)','\u041e\u0442\u043a\u0440\u044b\u0432\u0430\u0439\u0442\u0435 \u043a\u0435\u0439\u0441\u044b','\u041d\u043e\u043c\u0435\u0440\u0430 \u0448\u0435\u0441\u0442\u0438 \u0441\u0442\u0440\u0430\u043d: \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b, \u0438\u0437\u043d\u043e\u0441 \u0438 \u043f\u0430\u0442\u0442\u0435\u0440\u043d \u0434\u0435\u043b\u0430\u044e\u0442 \u043a\u0430\u0436\u0434\u044b\u0439 \u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u043c'],['games','var(--blue)','\u0417\u0430\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u0439\u0442\u0435 \u0432 \u0438\u0433\u0440\u0430\u0445','Rider \u0438 \u0421\u0442\u0430\u043d\u0442: \u043e\u0434\u043d\u043e \u043e\u0447\u043a\u043e \u2014 \u043e\u0434\u043d\u0430 \u043c\u043e\u043d\u0435\u0442\u0430, \u043f\u043b\u044e\u0441 \u043a\u043b\u044e\u0447\u0438'],['fire','var(--red)','\u0417\u0430\u0445\u043e\u0434\u0438\u0442\u0435 \u043a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c','40 000 \u043c\u043e\u043d\u0435\u0442 \u0432 \u0434\u0435\u043d\u044c \u0438 \u043e\u0433\u043e\u043d\u0451\u043a: \u043a\u0430\u0436\u0434\u044b\u0435 7 \u0434\u043d\u0435\u0439 \u043f\u043e\u0434\u0440\u044f\u0434 \u2014 \u043a\u043b\u044e\u0447\u0438'],['cart','var(--green)','\u0422\u043e\u0440\u0433\u0443\u0439\u0442\u0435','\u0420\u044b\u043d\u043e\u043a \u043a\u0430\u043a \u0432 Standoff 2: \u043f\u0440\u043e\u0434\u0430\u0436\u0430, \u0437\u0430\u043f\u0440\u043e\u0441\u044b \u043d\u0430 \u043f\u043e\u043a\u0443\u043f\u043a\u0443 \u0438 \u0438\u0441\u0442\u043e\u0440\u0438\u044f']]
    .map(r=>'<div class="row" style="min-height:0"><span class="ico" style="background:'+r[1]+';width:44px;height:44px">'+ic(r[0])+'</span><div class="mid"><div class="tt" style="font-size:16px">'+r[2]+'</div><div class="ss" style="white-space:normal">'+r[3]+'</div></div></div>').join('')+
    '</div><div class="foot"><button class="btn pri wide" data-act="welcomeGo">\u041d\u0430\u0447\u0430\u0442\u044c \u0441 '+fmt(S.bal)+'</button></div>',onClose:()=>{if(S.welcome)run('welcome',{},{quiet:true})}});
}
ACT.welcomeGo=()=>Sheet.close();

/* ================= \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u0438 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f ================= */
const TK_N={help:'\u0412\u043e\u043f\u0440\u043e\u0441',idea:'\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435',bug:'\u041e\u0448\u0438\u0431\u043a\u0430',avatar:'\u0410\u0432\u0430\u0442\u0430\u0440',appeal:'\u041e\u0431\u0436\u0430\u043b\u043e\u0432\u0430\u043d\u0438\u0435'};
const TK_ST={open:['\u0416\u0434\u0451\u0442 \u043e\u0442\u0432\u0435\u0442\u0430','var(--orange)'],answered:['\u0415\u0441\u0442\u044c \u043e\u0442\u0432\u0435\u0442','var(--green)'],closed:['\u0417\u0430\u043a\u0440\u044b\u0442\u043e','var(--text3)']};
let sup={list:null,kind:'help',cur:null,msgs:null};
ACT.support=()=>{sup.list=null;Page.push('support','\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430',renderSupport);loadTickets()};
async function loadTickets(){try{const r=await act('tickets');sup.list=r.list;if(Page.is('support'))Page.renderTop()}catch(e){toast(e.message,'err')}}
function renderSupport(el){
  const l=sup.list;
  el.innerHTML='<p class="lead">\u0417\u0430\u0434\u0430\u0439\u0442\u0435 \u0432\u043e\u043f\u0440\u043e\u0441, \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0438\u0442\u0435 \u0438\u0434\u0435\u044e \u0438\u043b\u0438 \u043e\u0431\u0436\u0430\u043b\u0443\u0439\u0442\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u043c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440\u0430. \u041e\u0442\u0432\u0435\u0442 \u043f\u0440\u0438\u0434\u0451\u0442 \u0441\u044e\u0434\u0430 \u0438 \u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u0435\u043c \u0432 \u0438\u0433\u0440\u0435.</p>'+
    '<div class="card p"><div class="segbox" style="margin-bottom:12px">'+['help','idea','bug','appeal'].map(k=>'<button class="'+(sup.kind===k?'on':'')+'" data-act="tkKind" data-k="'+k+'">'+TK_N[k]+'</button>').join('')+'</div>'+
      '<textarea class="inp" id="tk-t" maxlength="1000" rows="4" placeholder="'+({help:'\u041e\u043f\u0438\u0448\u0438\u0442\u0435 \u0432\u043e\u043f\u0440\u043e\u0441 \u0438\u043b\u0438 \u043f\u0440\u043e\u0431\u043b\u0435\u043c\u0443',idea:'\u0427\u0442\u043e \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0438\u043b\u0438 \u0443\u043b\u0443\u0447\u0448\u0438\u0442\u044c?',bug:'\u0427\u0442\u043e \u0441\u043b\u043e\u043c\u0430\u043b\u043e\u0441\u044c \u0438 \u043a\u0430\u043a \u044d\u0442\u043e \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c?',appeal:'\u041a\u0430\u043a\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0436\u0430\u043b\u0443\u0435\u0442\u0435 \u0438 \u043f\u043e\u0447\u0435\u043c\u0443?'})[sup.kind]+'"></textarea>'+
      '<button class="btn pri wide" style="margin-top:12px" data-act="tkSend">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c</button></div>'+
    '<div class="sec">\u041c\u043e\u0438 \u043e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u044f</div>'+(!l?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':l.length?'<div class="rows">'+l.map(t=>'<button class="row" data-act="tkOpen" data-id="'+esc(t.id)+'"><span class="ico" style="background:var(--blue)">'+ic('chat')+'</span><div class="mid"><div class="tt">'+esc(TK_N[t.kind]||'\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435')+(t.unread?' <span class="badge" style="background:var(--red);color:#fff">\u043d\u043e\u0432\u043e\u0435</span>':'')+'</div><div class="ss">'+esc(t.subj)+'</div><div class="ey"><span style="color:'+TK_ST[t.status][1]+'">'+TK_ST[t.status][0]+'</span> \u00b7 '+ago(t.upd)+'</div></div>'+ic('chev','chev')+'</button>').join('')+'</div>':'<div class="empty">\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442</div>')+
    '<p class="note">\u041f\u043e \u043e\u043f\u043b\u0430\u0442\u0435 Telegram Stars \u043c\u043e\u0436\u043d\u043e \u0442\u0430\u043a\u0436\u0435 \u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0431\u043e\u0442\u0443 \u043a\u043e\u043c\u0430\u043d\u0434\u0443 /paysupport.</p>';
}
ACT.tkKind=el=>{sup.kind=el.dataset.k;Page.renderTop()};
ACT.tkSend=el=>{const text=$('tk-t').value.trim();if(text.length<3){toast('\u041e\u043f\u0438\u0448\u0438\u0442\u0435 \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435','err');return}run('ticketNew',{kind:sup.kind,text},{btn:el,ok:()=>{$('tk-t').value='';loadTickets()}})};
ACT.tkOpen=el=>{sup.cur=el.dataset.id;sup.msgs=null;Page.push('ticket','\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435',renderTicket);loadTicket()};
async function loadTicket(){try{const r=await act('ticket',{id:sup.cur});sup.msgs=r;if(Page.is('ticket'))Page.renderTop()}catch(e){toast(e.message,'err')}}
function renderTicket(el){
  const d=sup.msgs;if(!d){el.innerHTML='<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>';return}
  const t=d.t;
  el.innerHTML='<p class="lead">'+esc(TK_N[t.kind]||'\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435')+' \u00b7 <span style="color:'+TK_ST[t.status][1]+'">'+TK_ST[t.status][0]+'</span></p>'+
    '<div class="thread">'+d.msgs.map(m=>'<div class="msg'+(m.adm?' adm':' me')+'"><div class="mh">'+(m.adm?'\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430':'\u0412\u044b')+' \u00b7 '+ago(m.t)+'</div><div class="mb">'+esc(m.text).replace(/\n/g,'<br>')+'</div>'+(m.data?'<img src="'+m.data+'" alt="" width="96" height="96" style="border-radius:12px;margin-top:8px">':'')+'</div>').join('')+'</div>'+
    (t.status!=='closed'?'<div class="card p" style="margin-top:12px"><textarea class="inp" id="tk-r" maxlength="1000" rows="3" placeholder="\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435"></textarea><button class="btn pri wide" style="margin-top:10px" data-act="tkReply">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c</button></div>':'<p class="note">\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435 \u0437\u0430\u043a\u0440\u044b\u0442\u043e. \u0415\u0441\u043b\u0438 \u0432\u043e\u043f\u0440\u043e\u0441 \u043e\u0441\u0442\u0430\u043b\u0441\u044f \u2014 \u0441\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u043d\u043e\u0432\u043e\u0435.</p>');
}
ACT.tkReply=el=>{const text=$('tk-r').value.trim();if(!text)return;run('ticketMsg',{id:sup.cur,text},{btn:el,quiet:true,ok:()=>{loadTicket();toast('\u041e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e')}})};

/* ================= \u0434\u043e\u043d\u0430\u0442 \u0447\u0435\u0440\u0435\u0437 Telegram Stars ================= */
const rubOf=st=>Math.round(st*(Net.cfg.rate||1.8));
function packs(){return Net.cfg.packs||{c:[100000,350000,800000,1800000],k:[200,700,1600,3600]}}
function packN(t,i){return packs()[t][i]*((Net.cfg.mult||{})[t]||1)}
function setsCfg(){return Net.cfg.sets&&Net.cfg.sets.length?Net.cfg.sets:[{n:'\u0421\u0442\u0430\u0440\u0442\u043e\u0432\u044b\u0439',give:{k:150,m:150000,sc:1}},{n:'\u0413\u043e\u043d\u0449\u0438\u043a',give:{k:500,m:500000,sc:3,tc:3}},{n:'\u041c\u0438\u043b\u043b\u0438\u0430\u0440\u0434\u0435\u0440',give:{k:1500,m:1500000,p:[0,0,0,0,10]}}]}
function productName(pid){
  let m=/^([ckg])([0-3])$/.exec(pid);if(m)return m[1]==='k'?keyN(packN('k',+m[2])):m[1]==='c'?fmt(packN('c',+m[2])):'\u0413\u043e\u043b\u0434\u0430 (2.0)';
  m=/^s(\d)$/.exec(pid);if(m){const s=setsCfg()[+m[1]];return s?'\u041d\u0430\u0431\u043e\u0440 \u00ab'+s.n+'\u00bb':'\u041d\u0430\u0431\u043e\u0440'}
  if(pid==='prem')return'Premium \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u0441\u0435\u0437\u043e\u043d\u0430';
  m=/^promo:(\w+)$/.exec(pid);if(m){const p=(Net.cfg.promos||[]).find(x=>x.id===m[1]);return p?p.title:'\u0410\u043a\u0446\u0438\u044f'}
  return pid;
}
function giveLine(g){g=g||{};const p=[];if(g.m)p.push(fmt(g.m));if(g.g)p.push(fmt(g.g*50));if(g.k)p.push(keyN(g.k));if(g.sc)p.push('\u043a\u0435\u0439\u0441 \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438 \u00d7'+g.sc);if(g.tc)p.push('\u043a\u0435\u0439\u0441 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438 \u00d7'+g.tc);if(Array.isArray(g.p))g.p.forEach((n,i)=>{if(n>0&&TIERS[i])p.push('\u043a\u0435\u0439\u0441 \u00ab'+TIERS[i].name+'\u00bb \u00d7'+n)});if(g.prem)p.push('Premium \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u0441\u0435\u0437\u043e\u043d\u0430');return p.join(' + ')}
function openDonate(sec){
  if(!Page.is('donate')){Sheet.close();Page.push('donate','\u0414\u043e\u043d\u0430\u0442',renderDonate,{onClose:()=>$('donate-btn').classList.remove('on')});$('donate-btn').classList.add('on')}
  if(sec)setTimeout(()=>{const e=$('dn-'+sec);const pg=Page.top();if(e&&pg)pg.el.scrollTo({top:e.offsetTop-70,behavior:'smooth'})},450);
}
ACT.donate=()=>openDonate();
function renderDonate(el){
  const t=now();const cfg=Net.cfg;const pr=Object.assign({p:[55,166,328,661],prem:277,s:[99,299,799]},cfg.prices||{});
  const promos=(cfg.promos||[]).filter(p=>!p.until||p.until>t);
  const tier=L.plusTier(S.don);const next=L.PLUS[tier+1];
  const mc=(cfg.mult||{}).c||1,mk=(cfg.mult||{}).k||1;
  const prem=L.isPrem(S,t);const premFull=S.prem>=L.SEASON.end;
  const sets=setsCfg();const G=['g-purple','g-blue','g-yellow','g-red','g-green'];
  const heroes=[];
  promos.forEach((p,i)=>{const lim=p.limit?Math.max(0,p.limit-(S.promo[p.id]||0)):null;
    heroes.push('<div class="hero '+G[(i+3)%5]+'" style="background:var(--gc);width:min(86vw,470px);margin:0;flex:none;scroll-snap-align:center"><p style="margin:0;color:var(--tint)">\u0410\u043a\u0446\u0438\u044f'+(p.until?' \u0434\u043e '+dateRu(p.until):'')+'</p><h3>'+esc(p.title)+'</h3><p>'+esc(giveLine(p.give))+(p.desc?'. '+esc(p.desc):'')+'</p><div class="acts">'+(lim===0?'<span class="pill on-card" style="opacity:.6">\u041a\u0443\u043f\u043b\u0435\u043d\u043e</span>':'<button class="pill on-card" data-act="buy" data-pid="promo:'+p.id+'">'+STAR(p.stars)+'</button>')+(lim?'<span class="pill on-card" style="background:transparent">\u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c '+lim+'</span>':'')+'</div></div>')});
  sets.forEach((s,i)=>heroes.push('<div class="hero '+G[i]+'" style="background:var(--gc);width:min(86vw,470px);margin:0;flex:none;scroll-snap-align:center"><p style="margin:0;color:var(--tint)">\u041d\u0430\u0431\u043e\u0440</p><h3>\u00ab'+esc(s.n)+'\u00bb</h3><p>'+esc(giveLine(s.give))+'</p><div class="acts"><button class="pill on-card" data-act="buy" data-pid="s'+i+'">'+STAR(pr.s[i])+'</button><span class="pill on-card" style="background:transparent">\u2248 '+fmtN(rubOf(pr.s[i]))+' \u20bd</span></div></div>'));
  heroes.push('<div class="hero g-purple" style="background:var(--gc);width:min(86vw,470px);margin:0;flex:none;scroll-snap-align:center"><p style="margin:0;color:var(--tint)">'+(prem?'\u0410\u043a\u0442\u0438\u0432\u0435\u043d \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u0441\u0435\u0437\u043e\u043d\u0430':'\u0414\u043e '+dateRu(L.SEASON.end))+'</p><h3>Premium</h3><p>\u041f\u0440\u0435\u043c\u0438\u0443\u043c-\u043b\u0438\u043d\u0438\u044f \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430, +'+shortN(L.REF_PREM)+' \u043c\u043e\u043d\u0435\u0442 \u0432\u0430\u043c \u0438 +'+shortN(L.INV_PREM)+' \u0434\u0440\u0443\u0433\u0443 \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0451\u043d\u043d\u043e\u0433\u043e</p><div class="acts"><button class="pill on-card" data-act="premInfo">\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435</button></div></div>');
  el.innerHTML='<p class="lead">\u041f\u043e\u043a\u0443\u043f\u043a\u0438 \u0438\u0434\u0443\u0442 \u0447\u0435\u0440\u0435\u0437 Telegram Stars. \u041c\u043e\u043d\u0435\u0442\u044b \u0438 \u043a\u043b\u044e\u0447\u0438 \u043e\u0441\u0442\u0430\u044e\u0442\u0441\u044f \u0432 \u0438\u0433\u0440\u0435: \u0438\u0445 \u043d\u0435\u043b\u044c\u0437\u044f \u0432\u044b\u0432\u0435\u0441\u0442\u0438 \u0438\u043b\u0438 \u043e\u0431\u043c\u0435\u043d\u044f\u0442\u044c \u043d\u0430 \u0434\u0435\u043d\u044c\u0433\u0438. \u0421\u043e\u0441\u0442\u0430\u0432 \u043f\u043e\u043a\u0443\u043f\u043a\u0438 \u0432\u0438\u0434\u0435\u043d \u0434\u043e \u043e\u043f\u043b\u0430\u0442\u044b.</p>'+
    '<div class="shelf" id="dn-hero" style="scroll-snap-type:x mandatory">'+heroes.join('')+'</div><div class="dots" id="dn-dots">'+heroes.map((h,i)=>'<i class="'+(i?'':'on')+'"></i>').join('')+'</div>'+
    '<div id="dn-keys"></div>'+secH('\u041a\u043b\u044e\u0447\u0438')+(mk>1?'<p class="sub">\u0410\u043a\u0446\u0438\u044f \u00d7'+mk+' \u043d\u0430 \u0432\u0441\u0435 \u043f\u0430\u043a\u0435\u0442\u044b \u043a\u043b\u044e\u0447\u0435\u0439</p>':'')+'<p class="sub">\u041e\u0442\u043a\u0440\u044b\u0432\u0430\u044e\u0442 \u043b\u044e\u0431\u044b\u0435 \u043a\u0435\u0439\u0441\u044b \u0438 \u043a\u043b\u0438\u043a\u0435\u0440. \u041a\u043b\u044e\u0447 \u043c\u043e\u0436\u043d\u043e \u043e\u0431\u043c\u0435\u043d\u044f\u0442\u044c \u043d\u0430 '+fmt(L.KEY_COINS)+'.</p>'+
    '<div class="rows">'+[0,1,2,3].map(i=>'<button class="row" data-act="buy" data-pid="k'+i+'"><span class="ico" style="background:var(--teal)">'+ic('key')+'</span><div class="mid"><div class="tt num">'+keyN(packN('k',i))+'</div><div class="ss">'+(mk>1?'<s>'+fmtN(packs().k[i])+'</s> \u00d7'+mk+' \u00b7 ':'')+'\u2248 '+fmtN(rubOf(pr.p[i]))+' \u20bd</div></div><span class="pill">'+STAR(pr.p[i])+'</span></button>').join('')+'</div>'+
    '<div id="dn-coins"></div>'+secH('\u041c\u043e\u043d\u0435\u0442\u044b')+(mc>1?'<p class="sub">\u0410\u043a\u0446\u0438\u044f \u00d7'+mc+' \u043d\u0430 \u0432\u0441\u0435 \u043f\u0430\u043a\u0435\u0442\u044b \u043c\u043e\u043d\u0435\u0442</p>':'')+
    '<div class="grid2">'+[0,1,2,3].map(i=>'<button class="gc '+['g-yellow','g-orange','g-red','g-purple'][i]+'" data-act="buy" data-pid="c'+i+'" style="height:168px;text-align:left"><span class="art" style="right:12px;top:12px;width:'+(46+i*8)+'px;height:'+(46+i*8)+'px"><i class="coin" style="width:100%;height:100%"></i></span>'+(mc>1?'<span class="k"><s>'+fmtN(packs().c[i])+'</s> \u00d7'+mc+'</span>':'')+'<span class="t num" style="font-size:22px;font-weight:800">'+fmtN(packN('c',i))+'</span><span class="s">\u043c\u043e\u043d\u0435\u0442 \u00b7 \u2248 '+fmtN(rubOf(pr.p[i]))+' \u20bd</span><span class="act"><span class="pill on-card">'+STAR(pr.p[i])+'</span></span></button>').join('')+'</div>'+
    secH('\u0421\u0442\u0430\u0442\u0443\u0441 Plus')+
    '<div class="card p"><div style="display:flex;align-items:center;gap:12px"><span class="ico" style="width:52px;height:52px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(180deg,#ffd76a,#f0a800);color:#3a2600">'+ic('star')+'</span><div style="flex:1"><div style="font:600 17px var(--f-ui)">'+(tier>=0?'Plus \u00b7 '+L.PLUS[tier].n:'\u041f\u043e\u043a\u0430 \u0431\u0435\u0437 Plus')+'</div><div class="muted" style="font-size:14px">'+(next?'\u0414\u043e \u00ab'+next.n+'\u00bb \u0435\u0449\u0451 '+STAR(next.min-S.don):'\u0412\u044b\u0441\u0448\u0438\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c')+'</div></div></div>'+
      (next?'<div class="bar" style="margin-top:12px"><i style="width:'+Math.min(100,(S.don-(tier>=0?L.PLUS[tier].min:0))/(next.min-(tier>=0?L.PLUS[tier].min:0))*100).toFixed(1)+'%;background:linear-gradient(90deg,#ffd76a,#f0a800)"></i></div>':'')+
      '<div class="muted" style="font-size:13px;margin-top:10px">Plus \u043f\u043e\u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0432\u043e\u0439 \u043f\u043e\u043a\u0443\u043f\u043a\u0438. \u0423\u0440\u043e\u0432\u0435\u043d\u044c \u0440\u0430\u0441\u0442\u0451\u0442 \u0441 \u043e\u0431\u0449\u0435\u0439 \u0441\u0443\u043c\u043c\u043e\u0439 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438 \u0438 \u043e\u0441\u0442\u0430\u0451\u0442\u0441\u044f \u0441 \u0432\u0430\u043c\u0438 \u043d\u0430\u0432\u0441\u0435\u0433\u0434\u0430. \u0427\u0435\u043c \u0432\u044b\u0448\u0435 Plus, \u0442\u0435\u043c \u0431\u043e\u043b\u044c\u0448\u0435 \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 \u0434\u0440\u0443\u0437\u0435\u0439 \u2014 \u0438 \u0432\u0430\u043c, \u0438 \u0438\u043c.</div></div>'+
    secH('\u041a\u043e\u0434 \u0430\u0432\u0442\u043e\u0440\u0430')+
    '<div class="card p">'+(S.author&&S.author.until>t?'<div style="display:flex;align-items:center;gap:10px"><div style="flex:1"><div style="font:600 17px var(--f-ui)">\u00ab'+esc(S.author.code)+'\u00bb</div><div class="muted" style="font-size:14px">+5% \u043c\u043e\u043d\u0435\u0442\u0430\u043c\u0438 \u043a \u043f\u043e\u043a\u0443\u043f\u043a\u0430\u043c \u0435\u0449\u0451 '+left(S.author.until-t)+'</div></div><button class="pill" data-act="authorClear">\u0423\u0431\u0440\u0430\u0442\u044c</button></div>':'<div class="rowf"><input class="inp" id="auth-i" placeholder="\u041a\u043e\u0434 \u0431\u043b\u043e\u0433\u0435\u0440\u0430" autocapitalize="characters" autocomplete="off"><button class="btn md" data-act="authorSet" style="flex:none">\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c</button></div><div class="muted" style="font-size:13px;margin-top:8px">\u041a\u043e\u0434 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 7 \u0434\u043d\u0435\u0439: \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 +5% \u043a \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0438 \u043c\u043e\u043d\u0435\u0442\u0430\u043c\u0438, \u0430\u0432\u0442\u043e\u0440 \u2014 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443 \u043e\u0442 \u0438\u0433\u0440\u044b.</div>')+'</div>'+
    '<div class="group" style="margin-top:22px"><button class="li" data-act="inv_exch"><span class="lic" style="background:var(--indigo)">'+ic('swap')+'</span><span class="lt">\u041e\u0431\u043c\u0435\u043d \u043a\u043b\u044e\u0447\u0435\u0439 \u043d\u0430 \u043c\u043e\u043d\u0435\u0442\u044b</span>'+ic('chev','chev')+'</button><button class="li" data-act="promo"><span class="lic" style="background:var(--orange)">'+ic('ticket')+'</span><span class="lt">\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434</span>'+ic('chev','chev')+'</button><button class="li" data-act="history"><span class="lic" style="background:var(--stars)">'+ic('star')+'</span><span class="lt">\u041c\u043e\u0438 \u043f\u043e\u043a\u0443\u043f\u043a\u0438</span>'+ic('chev','chev')+'</button><button class="li" data-act="support"><span class="lic" style="background:var(--blue)">'+ic('chat')+'</span><span class="lt">\u041f\u043e\u043c\u043e\u0449\u044c \u0441 \u043e\u043f\u043b\u0430\u0442\u043e\u0439</span>'+ic('chev','chev')+'</button></div>';
  const h=$('dn-hero'),d=$('dn-dots');
  if(h&&d)h.addEventListener('scroll',()=>{const i=Math.round(h.scrollLeft/(h.firstChild.offsetWidth+12));qsa('i',d).forEach((x,k)=>x.classList.toggle('on',k===i))},{passive:true});
}
ACT.premInfo=()=>{
  const t=now();const prem=L.isPrem(S,t);const st=(Net.cfg.prices||{}).prem||277;const full=S.prem>=L.SEASON.end;
  Sheet.open({title:'Premium',lead:'\u0414\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u0441\u0435\u0437\u043e\u043d\u0430 \u2014 '+dateRu(L.SEASON.end)+'. \u041f\u043e\u043a\u0443\u043f\u0430\u0435\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u0437\u0430 Telegram Stars.',body:
    '<div class="rows">'+[['season','var(--purple)','\u041f\u0440\u0435\u043c\u0438\u0443\u043c-\u043b\u0438\u043d\u0438\u044f \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430','\u0412\u0442\u043e\u0440\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u043d\u0430 \u043a\u0430\u0436\u0434\u043e\u043c \u0438\u0437 100 \u0443\u0440\u043e\u0432\u043d\u0435\u0439, \u0432\u043a\u043b\u044e\u0447\u0430\u044f \u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u043a\u0438\u043d \u0438 \u043d\u043e\u043c\u0435\u0440'],['userplus','var(--orange)','\u0411\u043e\u043b\u044c\u0448\u0435 \u0437\u0430 \u0434\u0440\u0443\u0437\u0435\u0439','+'+fmt(L.REF_PREM)+' \u0432\u0430\u043c \u0438 +'+fmt(L.INV_PREM)+' \u0434\u0440\u0443\u0433\u0443 \u0437\u0430 \u043a\u0430\u0436\u0434\u043e\u0433\u043e'],['crown','var(--yellow)','\u0417\u043d\u0430\u0447\u043e\u043a \u0432 \u043f\u0440\u043e\u0444\u0438\u043b\u0435','\u0412\u0438\u0434\u0435\u043d \u0432 \u0442\u043e\u043f\u0435, \u043d\u0430 \u0440\u044b\u043d\u043a\u0435 \u0438 \u043d\u0430 \u0441\u0442\u0435\u043d\u0435']].map(r=>'<div class="row" style="min-height:0"><span class="ico" style="background:'+r[1]+';width:44px;height:44px">'+ic(r[0])+'</span><div class="mid"><div class="tt" style="font-size:16px">'+r[2]+'</div><div class="ss" style="white-space:normal">'+r[3]+'</div></div></div>').join('')+'</div>'+
    '<div class="foot">'+(full||!L.seasonOn(t)?'<button class="btn wide off">'+(full?'Premium \u0430\u043a\u0442\u0438\u0432\u0435\u043d \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u0441\u0435\u0437\u043e\u043d\u0430':'\u0421\u0435\u0437\u043e\u043d \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0441\u044f')+'</button>':'<button class="btn pri wide" data-act="buy" data-pid="prem">'+STAR(st)+'<span>\u2248 '+fmtN(rubOf(st))+' \u20bd</span></button>')+'</div>'});
};
ACT.authorSet=el=>run('author',{code:$('auth-i').value},{btn:el});
ACT.authorClear=el=>run('author',{code:''},{btn:el});
ACT.buy=async el=>{
  const pid=el.dataset.pid;
  if(!TG||!TG.openInvoice){toast('\u041e\u043f\u043b\u0430\u0442\u0430 Stars \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0432 Telegram. \u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0438\u0433\u0440\u0443 \u0447\u0435\u0440\u0435\u0437 \u0431\u043e\u0442\u0430','err');return}
  const r=await run('pay',{pid},{btn:el,key:'pay',quiet:true});if(!r||!r.link)return;
  try{
    TG.openInvoice(r.link,status=>{
      if(status==='paid'){toast('\u041e\u043f\u043b\u0430\u0442\u0430 \u043f\u0440\u043e\u0448\u043b\u0430. \u041d\u0430\u0447\u0438\u0441\u043b\u044f\u0435\u043c\u2026');Haptic.ok();Snd.win(4);setTimeout(()=>refreshState(true),1500);setTimeout(()=>refreshState(true),5000)}
      else if(status==='failed')toast('\u041e\u043f\u043b\u0430\u0442\u0430 \u043d\u0435 \u043f\u0440\u043e\u0448\u043b\u0430. \u0417\u0432\u0451\u0437\u0434\u044b \u043d\u0435 \u0441\u043f\u0438\u0441\u0430\u043d\u044b','err');
      else if(status==='cancelled')toast('\u041e\u043f\u043b\u0430\u0442\u0430 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u0430');
    });
  }catch(e){toast('\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043e\u043f\u043b\u0430\u0442\u0443','err')}
};

/* ================= \u0430\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c ================= */
let adm={tab:'players',players:null,q:'',reports:null,codes:null,media:null,pay:null,lastCode:'',tickets:null,tst:'active',tk:null,avas:null,econ:null,sec:null,cfound:null,giftTo:''};
const isOwner=()=>Net.me.role==='owner';
ACT.admin=()=>{if(!Net.me.role){toast('\u0422\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430','err');return}if(isOwner()&&!Net.me.elev){Owner.after=()=>ACT.admin();Owner.unlock();return}Page.push('admin','\u0410\u0434\u043c\u0438\u043d\u043a\u0430',renderAdmin);admLoad()};
async function admLoad(){
  try{
    if(adm.tab==='players'){const r=await act('adm.players',{q:adm.q});adm.players=r.list}
    if(adm.tab==='support'){const r=await act('adm.tickets',{st:adm.tst});adm.tickets=r.list}
    if(adm.tab==='avatars'){const r=await act('adm.avatars');adm.avas=r.list}
    if(adm.tab==='comments'){const r=await act('adm.reports');adm.reports=r.list}
    if(adm.tab==='econ'){const r=await act('adm.econ');adm.econ=r}
    if(adm.tab==='codes'){const r=await act('adm.codes');adm.codes=r.list}
    if(adm.tab==='media'){const r=await act('adm.media');adm.media=r.list}
    if(adm.tab==='shop'){const r=await act('adm.pay');adm.pay=r.list}
    if(adm.tab==='sec'){const r=await act('adm.sec',{});adm.sec=r}
  }catch(e){toast(e.message,'err')}
  if(Page.is('admin'))Page.renderTop();
}
function renderAdmin(el){
  const tabs=[['players','\u0418\u0433\u0440\u043e\u043a\u0438'],['support','\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430'],['avatars','\u0410\u0432\u0430\u0442\u0430\u0440\u044b'],['comments','\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438'],['econ','\u042d\u043a\u043e\u043d\u043e\u043c\u0438\u043a\u0430'],['self','\u0421\u0435\u0431\u0435'],['gift','\u041f\u043e\u0434\u0430\u0440\u043a\u0438'],['news','\u041e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0435']];
  if(isOwner())tabs.push(['shop','\u041c\u0430\u0433\u0430\u0437\u0438\u043d'],['codes','\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434\u044b'],['plates','\u041d\u043e\u043c\u0435\u0440\u0430'],['media','\u041c\u0435\u0434\u0438\u0430'],['bot','\u0411\u043e\u0442'],['sec','\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u044c']);
  let b='';
  switch(adm.tab){
    case'players':b=admPlayers();break;case'support':b=admSupport();break;case'avatars':b=admAvas();break;case'comments':b=admComments();break;case'econ':b=admEcon();break;
    case'self':b=admSelf();break;case'gift':b=admGift();break;case'news':b=admNews();break;
    case'shop':b=admShop();break;case'codes':b=admCodes();break;case'plates':b=admPlates();break;case'media':b=admMedia();break;case'bot':b=admBot();break;case'sec':b=admSec();break;
  }
  el.innerHTML='<p class="lead">'+(isOwner()?'\u0412\u044b \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446'+(Net.me.elevT?' \u00b7 \u0441\u0435\u0441\u0441\u0438\u044f \u0434\u043e '+new Date(Net.me.elevT).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}):'')+'.':'\u0412\u044b \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440: \u0438\u0433\u0440\u043e\u043a\u0438, \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430, \u043c\u043e\u0434\u0435\u0440\u0430\u0446\u0438\u044f, \u043f\u043e\u0434\u0430\u0440\u043a\u0438.')+'</p><div class="seg">'+tabs.map(t=>'<button class="'+(adm.tab===t[0]?'on':'')+'" data-act="admTab" data-t="'+t[0]+'">'+t[1]+'</button>').join('')+'</div><div style="height:12px"></div>'+b;
  hydrateAvas(el);
}
ACT.admTab=el=>{adm.tab=el.dataset.t;Page.renderTop();admLoad()};
const fld=(id,label,ph,v,type)=>'<div class="field"><label for="'+id+'">'+label+'</label><input class="inp" id="'+id+'" '+(type==='num'?'inputmode="numeric"':'')+' placeholder="'+esc(ph||'')+'" value="'+esc(v==null?'':v)+'" autocomplete="off"></div>';
const val=id=>{const e=$(id);return e?e.value.trim():''};
const nval=id=>Math.round(+String(val(id)).replace(/\s/g,'').replace(',','.'))||0;
const muteStr=m=>{const k=Object.keys(m||{}).filter(x=>m[x]>now());return k.length?k.map(x=>({c:'\u043a\u043e\u043c\u043c.',m:'\u0440\u044b\u043d\u043e\u043a',a:'\u0430\u0432\u0430\u0442\u0430\u0440',t:'\u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430'})[x]).join(', '):''};

/* ---------- \u0438\u0433\u0440\u043e\u043a\u0438 ---------- */
function admPlayers(){
  const l=adm.players;
  return'<div class="pad" style="display:flex;gap:8px;margin-bottom:12px"><input class="inp" id="adm-q" placeholder="\u041d\u0438\u043a, ID 00000001 \u0438\u043b\u0438 uid" value="'+esc(adm.q)+'"><button class="btn md" data-act="admFind" style="flex:none">'+ic('search')+'</button></div>'+
    (!l?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':l.length?'<div class="rows">'+l.map(p=>{const ms=muteStr(p.mute);return'<div class="row" style="align-items:flex-start"><button data-act="profile" data-uid="'+esc(p.uid)+'">'+avaHTML(p.uid,p.nick,'md',p.ava)+'</button><div class="mid"><div class="tt">'+esc(p.nick)+(p.role?' <span class="badge '+(p.role==='owner'?'b-own':'b-adm')+'">'+(p.role==='owner'?'\u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446':'\u0430\u0434\u043c\u0438\u043d')+'</span>':'')+(p.banned?' <span class="badge" style="background:var(--red);color:#fff">\u0431\u0430\u043d</span>':'')+'</div><div class="ss">ID '+pad8(p.num)+' \u00b7 \u0443\u0440. '+p.lvl+' \u00b7 '+shortN(p.worth)+' \u00b7 '+ago(p.t)+(p.don?' \u00b7 '+p.don+' \u2605':'')+'</div>'+(ms?'<div class="ey" style="color:var(--orange)">\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u043e: '+ms+'</div>':'')+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+(p.uid===Net.me.uid||p.role==='owner'?'':'<button class="pill" data-act="admMuteP" data-uid="'+esc(p.uid)+'" data-n="'+esc(p.nick)+'">\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u0442\u044c</button><button class="pill" data-act="admBanP" data-uid="'+esc(p.uid)+'" data-on="'+(p.banned?0:1)+'">'+(p.banned?'\u0420\u0430\u0437\u0431\u0430\u043d\u0438\u0442\u044c':'\u0411\u0430\u043d')+'</button>')+'<button class="pill" data-act="admGiftP" data-uid="'+esc(String(p.num))+'">\u041f\u043e\u0434\u0430\u0440\u043e\u043a</button>'+(p.ava?'<button class="pill" data-act="admAvaP" data-uid="'+esc(p.uid)+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440</button>':'')+
      (isOwner()&&p.role!=='owner'&&p.uid!==Net.me.uid?'<button class="pill" data-act="admRole" data-uid="'+esc(p.uid)+'" data-r="'+(p.role==='admin'?'':'admin')+'" style="'+(p.role==='admin'?'':'background:var(--blue);color:#fff')+'">'+(p.role==='admin'?'\u0421\u043d\u044f\u0442\u044c \u0430\u0434\u043c\u0438\u043d\u0430':'\u0421\u0434\u0435\u043b\u0430\u0442\u044c \u0430\u0434\u043c\u0438\u043d\u043e\u043c')+'</button>':'')+'</div></div></div>'}).join('')+'</div>':'<div class="empty">\u041d\u0438\u043a\u043e\u0433\u043e \u043d\u0435 \u043d\u0430\u0448\u043b\u0438</div>');
}
ACT.admFind=()=>{adm.q=val('adm-q');adm.players=null;Page.renderTop();admLoad()};
ACT.admBanP=el=>{const on=el.dataset.on==='1';confirmSheet(on?'\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442?':'\u0421\u043d\u044f\u0442\u044c \u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u043a\u0443?',on?'\u0418\u0433\u0440\u043e\u043a \u043d\u0435 \u0441\u043c\u043e\u0436\u0435\u0442 \u043d\u0438\u0447\u0435\u0433\u043e \u0434\u0435\u043b\u0430\u0442\u044c \u0432 \u0438\u0433\u0440\u0435, \u043a\u0440\u043e\u043c\u0435 \u043e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u044f \u0432 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443. \u0415\u0433\u043e \u043b\u043e\u0442\u044b \u0441\u043d\u0438\u043c\u0443\u0442\u0441\u044f.':'','\u0414\u0430',()=>run('adm.ban',{uid:el.dataset.uid,on},{ok:()=>{admLoad();Prof.reload()}}),on)};
ACT.admAvaP=el=>run('adm.avaDel',{uid:el.dataset.uid},{ok:()=>{avaCache.delete(el.dataset.uid);admLoad();Prof.reload()}});
ACT.admRole=el=>{const r=el.dataset.r;confirmSheet(r?'\u0421\u0434\u0435\u043b\u0430\u0442\u044c \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u043e\u043c?':'\u0421\u043d\u044f\u0442\u044c \u043f\u0440\u0430\u0432\u0430?',r?'\u0410\u0434\u043c\u0438\u043d \u0441\u043c\u043e\u0436\u0435\u0442: \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f, \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u044f \u0438 \u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u043a\u0438, \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u043b\u043e\u0442\u043e\u0432, \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432 \u0438 \u0430\u0432\u0430\u0442\u0430\u0440\u043e\u043a, \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443, \u043f\u043e\u0434\u0430\u0440\u043a\u0438 \u0438\u0433\u0440\u043e\u043a\u0430\u043c \u0438 \u0432\u044b\u0434\u0430\u0447\u0443 \u0441\u0435\u0431\u0435.':'','\u0414\u0430',()=>run('adm.role',{uid:el.dataset.uid,role:r},{ok:admLoad}))};
ACT.admGiftP=el=>{adm.giftTo=el.dataset.uid;adm.tab='gift';if(!Page.is('admin'))ACT.admin();else Page.renderTop()};
let muteF={uid:'',scope:'c'};
ACT.admMuteP=el=>{
  muteF={uid:el.dataset.uid,scope:'c'};
  Sheet.open({title:'\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u0442\u044c '+(el.dataset.n||''),lead:'\u0427\u0442\u043e \u0437\u0430\u043a\u0440\u044b\u0442\u044c \u0438 \u043d\u0430 \u0441\u043a\u043e\u043b\u044c\u043a\u043e. \u0418\u0433\u0440\u043e\u043a \u043f\u043e\u043b\u0443\u0447\u0438\u0442 \u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u0435.',body:
    '<div class="pad" style="margin-bottom:12px"><div class="segbox">'+[['c','\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438'],['m','\u0420\u044b\u043d\u043e\u043a'],['a','\u0410\u0432\u0430\u0442\u0430\u0440'],['t','\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430'],['all','\u0412\u0441\u0451']].map(s=>'<button class="'+(muteF.scope===s[0]?'on':'')+'" data-act="muteScope" data-s="'+s[0]+'">'+s[1]+'</button>').join('')+'</div></div>'+
    '<div class="group">'+[[60,'1 \u0447\u0430\u0441'],[1440,'1 \u0434\u0435\u043d\u044c'],[10080,'7 \u0434\u043d\u0435\u0439'],[43200,'30 \u0434\u043d\u0435\u0439'],[1e7,'\u041d\u0430\u0432\u0441\u0435\u0433\u0434\u0430'],[0,'\u0421\u043d\u044f\u0442\u044c \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u0435']].map(d=>'<button class="li noic" data-act="muteGo" data-m="'+d[0]+'"><span class="lt"'+(d[0]===0?' style="color:var(--green)"':'')+'>'+d[1]+'</span>'+ic('chev','chev')+'</button>').join('')+'</div>'});
};
ACT.muteScope=el=>{muteF.scope=el.dataset.s;qsa('[data-act=muteScope]').forEach(b=>b.classList.toggle('on',b===el))};
ACT.muteGo=el=>run('adm.mute',{uid:muteF.uid,scope:muteF.scope,min:+el.dataset.m},{ok:()=>{Sheet.close();admLoad();Prof.reload()}});

/* ---------- \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 ---------- */
function admSupport(){
  const l=adm.tickets;
  return'<div class="pad" style="margin-bottom:12px"><div class="segbox"><button class="'+(adm.tst==='active'?'on':'')+'" data-act="tkSt" data-s="active">\u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0435</button><button class="'+(adm.tst==='closed'?'on':'')+'" data-act="tkSt" data-s="closed">\u0417\u0430\u043a\u0440\u044b\u0442\u044b\u0435</button></div></div>'+
    (!l?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':l.length?'<div class="rows">'+l.map(t=>'<button class="row" data-act="admTk" data-id="'+esc(t.id)+'"><span class="ico" style="background:'+(t.kind==='idea'?'var(--yellow)':t.kind==='avatar'||t.kind==='appeal'?'var(--orange)':t.kind==='bug'?'var(--red)':'var(--blue)')+'">'+ic(t.kind==='idea'?'sparkle':'chat')+'</span><div class="mid"><div class="tt">'+esc(TK_N[t.kind]||'\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435')+' \u00b7 '+esc(t.nick)+'</div><div class="ss">'+esc(t.subj)+'</div><div class="ey"><span style="color:'+TK_ST[t.status][1]+'">'+TK_ST[t.status][0]+'</span> \u00b7 ID '+pad8(t.num)+' \u00b7 '+ago(t.upd)+'</div></div>'+ic('chev','chev')+'</button>').join('')+'</div>':'<div class="empty">\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0439 \u043d\u0435\u0442</div>');
}
ACT.tkSt=el=>{adm.tst=el.dataset.s;adm.tickets=null;Page.renderTop();admLoad()};
ACT.admTk=async el=>{
  const id=el.dataset.id;Sheet.open({title:'\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435',body:'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>',cls:'tall'});
  try{const r=await act('ticket',{id});adm.tk=r;renderAdmTk()}catch(e){Sheet.body('<div class="empty">'+esc(e.message)+'</div>')}
};
function renderAdmTk(){
  const d=adm.tk;const t=d.t;const img=d.msgs.find(m=>m.data);
  Sheet.body('<p class="lead" style="margin-top:0">'+esc(TK_N[t.kind]||'')+' \u043e\u0442 <button class="muted" data-act="profile" data-uid="'+esc(t.uid)+'" style="text-decoration:underline">'+esc(t.nick)+' \u00b7 ID '+pad8(t.num)+'</button></p>'+
    '<div class="thread">'+d.msgs.map(m=>'<div class="msg'+(m.adm?' adm':' me')+'"><div class="mh">'+(m.adm?'\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430':esc(m.nick))+' \u00b7 '+ago(m.t)+'</div><div class="mb">'+esc(m.text).replace(/\n/g,'<br>')+'</div>'+(m.data?'<img src="'+m.data+'" alt="" width="120" height="120" style="border-radius:12px;margin-top:8px">':'')+'</div>').join('')+'</div>'+
    (img&&t.status!=='closed'?'<div class="foot"><button class="btn green wide" data-act="admAvaAppeal" data-tid="'+esc(t.id)+'">\u041e\u0434\u043e\u0431\u0440\u0438\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440 \u0438 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c</button></div>':'')+
    '<div class="field" style="margin-top:12px"><textarea class="inp" id="adm-tk-r" rows="3" maxlength="1000" placeholder="\u041e\u0442\u0432\u0435\u0442 \u0438\u0433\u0440\u043e\u043a\u0443"></textarea></div>'+
    '<div class="foot"><button class="btn pri wide" data-act="admTkReply" data-id="'+esc(t.id)+'">\u041e\u0442\u0432\u0435\u0442\u0438\u0442\u044c</button><button class="btn wide" data-act="admTkReply" data-id="'+esc(t.id)+'" data-close="1">\u041e\u0442\u0432\u0435\u0442\u0438\u0442\u044c \u0438 \u0437\u0430\u043a\u0440\u044b\u0442\u044c</button>'+(t.status!=='closed'?'<button class="btn wide" data-act="admTkClose" data-id="'+esc(t.id)+'">\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u0431\u0435\u0437 \u043e\u0442\u0432\u0435\u0442\u0430</button>':'')+'</div>');
}
ACT.admTkReply=el=>{const text=val('adm-tk-r');if(!text){toast('\u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043e\u0442\u0432\u0435\u0442','err');return}run('adm.ticketMsg',{id:el.dataset.id,text,close:!!el.dataset.close},{btn:el,ok:()=>{Sheet.close();admLoad()}})};
ACT.admTkClose=el=>run('adm.ticketClose',{id:el.dataset.id},{btn:el,ok:()=>{Sheet.close();admLoad()}});
ACT.admAvaAppeal=el=>run('adm.avaOk',{tid:el.dataset.tid},{btn:el,ok:()=>{Sheet.close();admLoad()}});

/* ---------- \u0430\u0432\u0430\u0442\u0430\u0440\u044b ---------- */
function admAvas(){
  const l=adm.avas;
  return'<p class="note" style="margin:0 var(--g) 12px">\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u2014 \u0436\u0434\u0443\u0449\u0438\u0435 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438 (\u0438\u0445 \u043d\u0435 \u0432\u0438\u0434\u044f\u0442 \u0434\u0440\u0443\u0433\u0438\u0435 \u0438\u0433\u0440\u043e\u043a\u0438), \u043f\u043e\u0442\u043e\u043c \u043d\u043e\u0432\u044b\u0435 \u0437\u0430 3 \u0434\u043d\u044f.</p>'+(!l?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':l.length?'<div class="grid2">'+l.map(a=>'<div class="card p" style="margin:0;display:grid;gap:8px;justify-items:center;text-align:center"><img src="'+a.data+'" alt="" width="96" height="96" style="border-radius:50%"><div style="font:600 14px var(--f-ui)">'+esc(a.nick||'\u0418\u0433\u0440\u043e\u043a')+'</div><div class="muted" style="font-size:12px">ID '+pad8(a.num)+' \u00b7 '+ago(a.t)+'</div>'+(a.ok?'<span class="badge" style="background:var(--green);color:#fff">\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d</span>':'<span class="badge" style="background:var(--orange);color:#fff">\u0436\u0434\u0451\u0442 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438</span>')+'<div style="display:flex;gap:6px">'+(a.ok?'':'<button class="pill" data-act="admAvaOk" data-uid="'+esc(a.uid)+'" style="background:var(--green);color:#fff">\u041e\u0434\u043e\u0431\u0440\u0438\u0442\u044c</button>')+'<button class="pill" data-act="admAvaP" data-uid="'+esc(a.uid)+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button></div></div>').join('')+'</div>':'<div class="empty">\u041e\u0447\u0435\u0440\u0435\u0434\u044c \u043f\u0443\u0441\u0442\u0430</div>');
}
ACT.admAvaOk=el=>run('adm.avaOk',{uid:el.dataset.uid},{ok:admLoad});

/* ---------- \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438: \u043f\u043e\u0438\u0441\u043a \u043f\u043e ID \u0438 \u0436\u0430\u043b\u043e\u0431\u044b ---------- */
function admComments(){
  const r=adm.reports,f=adm.cfound;
  return'<div class="pad" style="display:flex;gap:8px;margin-bottom:12px"><input class="inp" id="adm-cq" placeholder="ID \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 C00000012" autocapitalize="characters"><button class="btn md" data-act="admCFind" style="flex:none">'+ic('search')+'</button></div>'+
    (f?'<div class="card">'+cmtHTML(f,f.wall,!!f.parent)+'</div><div class="pad rowf" style="margin-top:8px"><button class="btn md" data-act="profile" data-uid="'+esc(f.wall)+'">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0442\u0435\u043d\u0443</button><button class="btn md danger" data-act="admCDel" data-id="'+esc(f.id)+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button></div>':'')+
    '<div class="sec">\u0416\u0430\u043b\u043e\u0431\u044b</div>'+(!r?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':r.length?'<div class="rows">'+r.map(c=>'<div class="row" style="align-items:flex-start"><div class="mid"><div class="tt">'+esc(c.nick)+' <span class="badge" style="background:var(--red);color:#fff">'+c.n+'</span></div><div class="ss" style="white-space:normal;color:var(--text)">'+esc(c.text)+'</div><div class="ey">C'+pad8(c.num)+' \u00b7 '+ago(c.t)+'</div><div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap"><button class="pill" data-act="admCDel" data-id="'+esc(c.id)+'" style="background:var(--red);color:#fff">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button><button class="pill" data-act="admCOk" data-id="'+esc(c.id)+'">\u041e\u0441\u0442\u0430\u0432\u0438\u0442\u044c</button><button class="pill" data-act="profile" data-uid="'+esc(c.author)+'">\u0410\u0432\u0442\u043e\u0440</button><button class="pill" data-act="admMuteP" data-uid="'+esc(c.author)+'" data-n="'+esc(c.nick)+'">\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u0442\u044c</button></div></div></div>').join('')+'</div>':'<div class="empty">\u0416\u0430\u043b\u043e\u0431 \u043d\u0435\u0442</div>')+
    '<div class="sec">\u0420\u044b\u043d\u043e\u043a</div><div class="group"><button class="li" data-act="admOpenMk"><span class="lic" style="background:var(--blue)">'+ic('cart')+'</span><span class="lt">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0440\u044b\u043d\u043e\u043a: \u0441\u043d\u044f\u0442\u044c \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0439 \u043b\u043e\u0442</span>'+ic('chev','chev')+'</button>'+(isOwner()?'<button class="li" data-act="admWipe"><span class="lic" style="background:var(--red)">'+ic('trash')+'</span><span class="lt">\u0421\u043d\u044f\u0442\u044c \u0432\u0441\u0435 \u043b\u043e\u0442\u044b ('+Net.open.length+')</span></button>':'')+'</div>';
}
ACT.admCFind=async el=>{try{const r=await act('adm.comment',{q:val('adm-cq')});adm.cfound=Object.assign(r.c,{reply_to:null});Page.renderTop()}catch(e){toast(e.message,'err')}};
ACT.admCDel=el=>run('adm.cdel',{id:el.dataset.id},{ok:()=>{adm.cfound=null;admLoad()}});
ACT.admCOk=el=>run('adm.clearRep',{id:el.dataset.id},{ok:admLoad});
ACT.admOpenMk=()=>{Page.clear();shopSeg='market';mk.tab='market';Tabs.go('shop');RENDER.shop()};
ACT.admWipe=()=>confirmSheet('\u0421\u043d\u044f\u0442\u044c \u0432\u0441\u0435 \u043b\u043e\u0442\u044b?','\u0412\u0441\u0435 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u044b \u0432\u0435\u0440\u043d\u0443\u0442\u0441\u044f \u043f\u0440\u043e\u0434\u0430\u0432\u0446\u0430\u043c.','\u0421\u043d\u044f\u0442\u044c \u0432\u0441\u0451',()=>run('adm.wipe',{},{ok:()=>loadPub('market')}),true);

/* ---------- \u044d\u043a\u043e\u043d\u043e\u043c\u0438\u043a\u0430 ---------- */
const sumK=(v,p)=>Object.keys(v).filter(k=>k.startsWith(p)).reduce((s,k)=>s+v[k],0);
function admEcon(){
  const e=adm.econ;if(!e)return'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>';
  const rows=e.days.map(d=>{const v=d.v;const inT=sumK(v,'in:'),out=sumK(v,'out:'),bb=(v['in:quick']||0)+(v['in:bulk']||0)+(v['in:sellInv']||0);
    return{d:d.d,in:inT,out,fee:v.fee||0,bb,games:v['in:runEnd']||0,daily:v['in:dayClaim']||0,cases:v['out:open']||0,don:v['in:donate']||0,stars:v.stars||0,rare:v.rare||0,kin:sumK(v,'kin:'),kout:sumK(v,'kout:'),tradeN:v['trade:n']||0,tradeV:v['trade:vol']||0,opens:v['n:open']||0}});
  const max=Math.max(1,...rows.map(r=>Math.max(r.in,r.out+r.fee)));
  const W=320,H=120,bw=W/rows.length;
  const svg='<svg viewBox="0 0 '+W+' '+(H+16)+'" style="width:100%;height:150px">'+rows.slice().reverse().map((r,i)=>{const h1=r.in/max*H,h2=(r.out+r.fee)/max*H;return'<rect x="'+(i*bw+2).toFixed(1)+'" y="'+(H-h1).toFixed(1)+'" width="'+(bw/2-3).toFixed(1)+'" height="'+h1.toFixed(1)+'" rx="2" fill="var(--green)"/><rect x="'+(i*bw+bw/2).toFixed(1)+'" y="'+(H-h2).toFixed(1)+'" width="'+(bw/2-3).toFixed(1)+'" height="'+h2.toFixed(1)+'" rx="2" fill="var(--red)"/>'+(i%2?'':'<text x="'+(i*bw+bw/2).toFixed(1)+'" y="'+(H+13)+'" font-size="9" fill="var(--text2)" text-anchor="middle">'+r.d.slice(8)+'</text>')}).join('')+'</svg>';
  const t=rows[0];
  const li=(n,v,c)=>'<div class="li noic"><span class="lt">'+n+'</span><span class="lv num"'+(c?' style="color:'+c+'"':'')+'>'+v+'</span></div>';
  return'<div class="stats3"><div class="stat"><b>'+e.active.day+'</b><span>\u0441\u0435\u0433\u043e\u0434\u043d\u044f</span></div><div class="stat"><b>'+e.active.week+'</b><span>\u0437\u0430 7 \u0434\u043d\u0435\u0439</span></div><div class="stat"><b>'+e.active.all+'</b><span>\u0432\u0441\u0435\u0433\u043e \u0438\u0433\u0440\u043e\u043a\u043e\u0432</span></div></div>'+
    '<div class="sec">\u041c\u043e\u043d\u0435\u0442\u044b \u0437\u0430 14 \u0434\u043d\u0435\u0439</div><div class="card p">'+svg+'<div class="muted" style="font-size:12px"><span style="color:var(--green)">\u25a0</span> \u0441\u043e\u0437\u0434\u0430\u043d\u043e \u00b7 <span style="color:var(--red)">\u25a0</span> \u0441\u043e\u0436\u0436\u0435\u043d\u043e (\u0442\u0440\u0430\u0442\u044b \u0438 \u043a\u043e\u043c\u0438\u0441\u0441\u0438\u0438)</div></div>'+
    '<div class="sec">\u0421\u0435\u0433\u043e\u0434\u043d\u044f</div><div class="group">'+
      li('\u0421\u043e\u0437\u0434\u0430\u043d\u043e \u043c\u043e\u043d\u0435\u0442',fmtN(t.in),'var(--green)')+li('\u0421\u043e\u0436\u0436\u0435\u043d\u043e (\u043f\u043e\u043a\u0443\u043f\u043a\u0438, \u043a\u0435\u0439\u0441\u044b, \u0441\u0442\u0430\u0432\u043a\u0438)',fmtN(t.out),'var(--red)')+li('\u041a\u043e\u043c\u0438\u0441\u0441\u0438\u0438 \u0440\u044b\u043d\u043a\u0430',fmtN(t.fee),'var(--red)')+li('\u0411\u0430\u043b\u0430\u043d\u0441 \u0434\u043d\u044f',(t.in-t.out-t.fee>=0?'+':'')+fmtN(t.in-t.out-t.fee))+
      li('\u0421\u043a\u0443\u043f\u0449\u0438\u043a \u0432\u044b\u043f\u043b\u0430\u0442\u0438\u043b',fmtN(t.bb))+li('\u041c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b \u0432\u044b\u043f\u043b\u0430\u0442\u0438\u043b\u0438',fmtN(t.games))+li('\u0415\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u044b\u0435 \u043d\u0430\u0433\u0440\u0430\u0434\u044b',fmtN(t.daily))+li('\u041f\u043e\u0442\u0440\u0430\u0447\u0435\u043d\u043e \u043d\u0430 \u043a\u0435\u0439\u0441\u044b',fmtN(t.cases))+li('\u041e\u0442\u043a\u0440\u044b\u0442\u043e \u043a\u0435\u0439\u0441\u043e\u0432',fmtN(t.opens))+li('\u0420\u0435\u0434\u043a\u0438\u0435 \u0432\u044b\u043f\u0430\u0434\u0435\u043d\u0438\u044f (\u043c\u0435\u0442\u0430\u043b\u043b, \u0437\u043e\u043b\u043e\u0442\u043e, \u043e\u0442 50 000)',fmtN(t.rare))+
      li('\u0421\u0434\u0435\u043b\u043e\u043a \u043d\u0430 \u0440\u044b\u043d\u043a\u0435',fmtN(t.tradeN)+' \u00b7 '+shortN(t.tradeV))+li('\u0414\u043e\u043d\u0430\u0442: \u043c\u043e\u043d\u0435\u0442\u044b',fmtN(t.don))+li('\u0414\u043e\u043d\u0430\u0442: \u0437\u0432\u0451\u0437\u0434\u044b',fmtN(t.stars))+li('\u041a\u043b\u044e\u0447\u0438: \u0432\u044b\u0434\u0430\u043d\u043e / \u043f\u043e\u0442\u0440\u0430\u0447\u0435\u043d\u043e',fmtN(t.kin)+' / '+fmtN(t.kout))+'</div>'+
    '<div class="sec">\u041f\u043e \u0434\u043d\u044f\u043c</div><div class="group">'+rows.map(r=>li(dateRu(Date.parse(r.d+'T12:00:00+03:00')),'+'+shortN(r.in)+' / \u2212'+shortN(r.out+r.fee)+(r.rare?' \u00b7 \u2605'+r.rare:''))).join('')+'</div>'+
    '<p class="note">\u0421\u043e\u0437\u0434\u0430\u043d\u043e \u2014 \u043c\u043e\u043d\u0435\u0442\u044b, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u043f\u043e\u044f\u0432\u0438\u043b\u0438\u0441\u044c \u0432 \u0438\u0433\u0440\u0435 (\u043d\u0430\u0433\u0440\u0430\u0434\u044b, \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b, \u0441\u043a\u0443\u043f\u0449\u0438\u043a, \u0434\u043e\u043d\u0430\u0442). \u0421\u043e\u0436\u0436\u0435\u043d\u043e \u2014 \u0443\u0448\u043b\u0438 \u0438\u0437 \u0438\u0433\u0440\u044b (\u043a\u0435\u0439\u0441\u044b, \u043a\u043e\u0441\u043c\u0435\u0442\u0438\u043a\u0430, \u0441\u0442\u0430\u0432\u043a\u0438, \u043c\u0430\u0433\u0430\u0437\u0438\u043d \u0434\u043d\u044f). \u0421\u0434\u0435\u043b\u043a\u0438 \u043c\u0435\u0436\u0434\u0443 \u0438\u0433\u0440\u043e\u043a\u0430\u043c\u0438 \u043d\u0435 \u0441\u043e\u0437\u0434\u0430\u044e\u0442 \u0438 \u043d\u0435 \u0441\u0436\u0438\u0433\u0430\u044e\u0442 \u043c\u043e\u043d\u0435\u0442\u044b, \u043a\u0440\u043e\u043c\u0435 \u043a\u043e\u043c\u0438\u0441\u0441\u0438\u0438.</p>';
}

/* ---------- \u0432\u044b\u0434\u0430\u0447\u0430 \u0441\u0435\u0431\u0435 ---------- */
function admSelf(){
  return'<div class="card p" style="display:grid;gap:10px">'+
    '<div class="rowf"><input class="inp num" id="as-coin" inputmode="numeric" placeholder="\u041c\u043e\u043d\u0435\u0442\u044b"><button class="btn md" data-act="admSelf" data-a="admCoin" data-i="as-coin" style="flex:none">\u0412\u044b\u0434\u0430\u0442\u044c</button></div>'+
    '<div class="rowf"><input class="inp num" id="as-key" inputmode="numeric" placeholder="\u041a\u043b\u044e\u0447\u0438"><button class="btn md" data-act="admSelf" data-a="admKey" data-i="as-key" style="flex:none">\u0412\u044b\u0434\u0430\u0442\u044c</button></div>'+
    '<div class="rowf"><input class="inp num" id="as-lvl" inputmode="numeric" placeholder="\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430 0\u2013100"><button class="btn md" data-act="admLvl" style="flex:none">\u0417\u0430\u0434\u0430\u0442\u044c</button></div>'+
    '<button class="btn md wide" data-act="admPrem">'+(L.isPrem(S,now())?'\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c Premium':'\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c Premium \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u0441\u0435\u0437\u043e\u043d\u0430')+'</button></div>'+
    '<div class="sec">\u041d\u043e\u043c\u0435\u0440 \u0441\u0435\u0431\u0435</div><div class="card p" style="display:grid;gap:10px">'+
    '<div class="rowf"><select class="inp" id="ap-c" data-on="apPrev">'+COUNTRIES.map(c=>'<option value="'+c+'">'+CN_SHORT[c]+'</option>').join('')+'<option value="sp">\u041e\u0441\u043e\u0431\u044b\u0439</option></select><input class="inp" id="ap-t" placeholder="\u0410777\u0410\u0410777" data-on="apPrev"></div>'+
    '<input class="inp num hidden" id="ap-b" inputmode="numeric" placeholder="\u0426\u0435\u043d\u0430 \u043e\u0441\u043e\u0431\u043e\u0433\u043e \u043d\u043e\u043c\u0435\u0440\u0430, \u043c\u043e\u043d\u0435\u0442" data-on="apPrev">'+
    '<div class="rowf"><select class="inp" id="ap-m" data-on="apPrev">'+MATS.map((m,i)=>'<option value="'+i+'">'+m.n+'</option>').join('')+'</select><select class="inp" id="ap-w" data-on="apPrev">'+FONTS.map((f,i)=>'<option value="'+i+'"'+(i===1?' selected':'')+'>'+f.n+'</option>').join('')+'</select></div>'+
    '<div class="rowf"><input class="inp num" id="ap-f" inputmode="decimal" placeholder="\u0418\u0437\u043d\u043e\u0441 0\u20131, \u043d\u0430\u043f\u0440. 0,02" data-on="apPrev"><input class="inp num" id="ap-pt" inputmode="numeric" placeholder="\u041f\u0430\u0442\u0442\u0435\u0440\u043d 0\u20131000" data-on="apPrev"></div>'+
    '<div id="ap-prev" class="muted" style="font-size:14px">\u0424\u043e\u0440\u043c\u0430\u0442\u044b: \u0420\u0424 \u0410777\u0410\u0410777 \u00b7 UA AA7777AA \u00b7 KZ 777AAA01 \u00b7 \u0421\u0428\u0410 ABC1234CA \u00b7 EU: D M AB 1234 / F AB123CD / E 1234BCD \u00b7 \u0414\u0443\u0431\u0430\u0439 A12345</div>'+
    '<button class="btn pri md wide" data-act="admPlate">\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 \u0438\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c</button></div>'+
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

/* ---------- \u043f\u043e\u0434\u0430\u0440\u043a\u0438 ---------- */
function admGift(){
  return'<div class="card p" style="display:grid;gap:4px"><div class="field" style="margin:0 0 8px"><label>\u041a\u043e\u043c\u0443: ID \u0438\u0433\u0440\u043e\u043a\u0430 (00000001)'+(isOwner()?' \u0438\u043b\u0438 * \u2014 \u0432\u0441\u0435\u043c':'')+'</label><input class="inp" id="ag-to" value="'+esc(adm.giftTo||(isOwner()?'*':''))+'"></div>'+
    '<div class="rowf"><input class="inp num" id="ag-m" inputmode="numeric" placeholder="\u041c\u043e\u043d\u0435\u0442\u044b"><input class="inp num" id="ag-k" inputmode="numeric" placeholder="\u041a\u043b\u044e\u0447\u0438"></div><div style="height:8px"></div>'+
    '<div class="rowf"><input class="inp num" id="ag-sc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u0441\u043a\u0438\u043d\u043e\u0432"><input class="inp num" id="ag-tc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u043d\u0430\u043a\u043b\u0435\u0435\u043a"></div><div style="height:8px"></div>'+
    '<input class="inp" id="ag-note" maxlength="80" placeholder="\u041f\u043e\u0434\u043f\u0438\u0441\u044c \u043a \u043f\u043e\u0434\u0430\u0440\u043a\u0443"><div style="height:10px"></div><button class="btn pri md wide" data-act="admGiftGo">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c</button></div><p class="note">\u041f\u043e\u0434\u0430\u0440\u043e\u043a \u00ab\u0432\u0441\u0435\u043c\u00bb \u043f\u043e\u043b\u0443\u0447\u0438\u0442 \u043a\u0430\u0436\u0434\u044b\u0439, \u043a\u0442\u043e \u043e\u0442\u043a\u0440\u043e\u0435\u0442 \u0438\u0433\u0440\u0443 \u0432 \u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435 7 \u0434\u043d\u0435\u0439.</p>';
}
ACT.admGiftGo=el=>run('adm.gift',{to:val('ag-to'),m:nval('ag-m'),k:nval('ag-k'),sc:nval('ag-sc'),tc:nval('ag-tc'),note:val('ag-note')},{btn:el,ok:()=>{adm.giftTo=''}});

function admNews(){return'<div class="field"><label>\u041e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0435 (\u0432\u0438\u0434\u043d\u043e \u0432\u0441\u0435\u043c \u0432 \u00ab\u041c\u0430\u0433\u0430\u0437\u0438\u043d\u0435\u00bb)</label><textarea class="inp" id="an-t" maxlength="300">'+esc(Net.cfg.news||'')+'</textarea></div><div class="pad rowf"><button class="btn pri md" data-act="admNews">\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c</button><button class="btn md" data-act="admNewsClr">\u0423\u0431\u0440\u0430\u0442\u044c</button></div>'}
ACT.admNews=el=>run('adm.news',{text:val('an-t')},{btn:el,ok:()=>loadPub('kv')});
ACT.admNewsClr=el=>run('adm.news',{text:''},{btn:el,ok:()=>loadPub('kv')});

/* ---------- \u043c\u0430\u0433\u0430\u0437\u0438\u043d (Stars) ---------- */
function admShop(){
  const c=Net.cfg;const p=Object.assign({p:[55,166,328,661],prem:277,s:[99,299,799]},c.prices||{});const m=c.mult||{c:1,k:1};
  const sel=(id,v)=>'<select class="inp" id="'+id+'">'+[1,10,20,30].map(x=>'<option value="'+x+'"'+(x===v?' selected':'')+'>\u00d7'+x+'</option>').join('')+'</select>';
  const pk=packs();
  return'<div class="sec" style="margin-top:0">\u0426\u0435\u043d\u044b \u0432 Stars</div><div class="card p" style="display:grid;gap:8px">'+[0,1,2,3].map(i=>'<div class="rowf" style="align-items:center"><span style="flex:1.4">\u041f\u0430\u043a\u0435\u0442 '+(i+1)+': '+shortN(pk.c[i])+' \u043c\u043e\u043d\u0435\u0442 / '+fmtN(pk.k[i])+' \u043a\u043b\u044e\u0447\u0435\u0439</span><input class="inp num" id="sp-'+i+'" inputmode="numeric" value="'+p.p[i]+'"></div>').join('')+
    setsCfg().map((s,i)=>'<div class="rowf" style="align-items:center"><span style="flex:1.4">\u041d\u0430\u0431\u043e\u0440 \u00ab'+esc(s.n)+'\u00bb</span><input class="inp num" id="ss-'+i+'" inputmode="numeric" value="'+p.s[i]+'"></div>').join('')+
    '<div class="rowf" style="align-items:center"><span style="flex:1.4">Premium \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u0441\u0435\u0437\u043e\u043d\u0430</span><input class="inp num" id="sp-prem" inputmode="numeric" value="'+p.prem+'"></div>'+
    '<div class="rowf" style="align-items:center"><span style="flex:1.4">\u0410\u043a\u0446\u0438\u044f \u043d\u0430 \u043c\u043e\u043d\u0435\u0442\u044b</span>'+sel('sp-mc',m.c||1)+'</div><div class="rowf" style="align-items:center"><span style="flex:1.4">\u0410\u043a\u0446\u0438\u044f \u043d\u0430 \u043a\u043b\u044e\u0447\u0438</span>'+sel('sp-mk',m.k||1)+'</div>'+
    '<button class="btn pri md wide" data-act="admPrices">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c</button><div class="muted" style="font-size:13px">1 \u2605 \u2248 '+String(c.rate||1.8).replace('.',',')+' \u20bd.</div></div>'+
    '<div class="sec">\u0410\u043a\u0446\u0438\u0438</div>'+((c.promos||[]).length?'<div class="rows">'+c.promos.map(x=>'<div class="row"><div class="mid"><div class="tt">'+esc(x.title)+'</div><div class="ss">'+esc(giveLine(x.give))+' \u00b7 '+x.stars+' \u2605'+(x.until?' \u00b7 \u0434\u043e '+dateRu(x.until):'')+(x.limit?' \u00b7 '+x.limit+' \u043d\u0430 \u0430\u043a\u043a\u0430\u0443\u043d\u0442':'')+'</div></div><button class="pill" data-act="admPromoDel" data-id="'+x.id+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button></div>').join('')+'</div>':'<div class="empty">\u0410\u043a\u0446\u0438\u0439 \u043d\u0435\u0442</div>')+
    '<div class="card p" style="margin-top:12px;display:grid;gap:8px"><input class="inp" id="pr-t" maxlength="40" placeholder="\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u00ab\u041d\u043e\u0432\u043e\u0433\u043e\u0434\u043d\u0438\u0439 \u043d\u0430\u0431\u043e\u0440\u00bb"><input class="inp" id="pr-d" maxlength="120" placeholder="\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 (\u043d\u0435\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e)">'+
    '<div class="rowf"><input class="inp num" id="pr-m" inputmode="numeric" placeholder="\u041c\u043e\u043d\u0435\u0442\u044b"><input class="inp num" id="pr-k" inputmode="numeric" placeholder="\u041a\u043b\u044e\u0447\u0438"></div>'+
    '<div class="rowf"><input class="inp num" id="pr-sc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u0441\u043a\u0438\u043d\u043e\u0432"><input class="inp num" id="pr-tc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u043d\u0430\u043a\u043b\u0435\u0435\u043a"><label class="pill" style="flex:none"><input type="checkbox" id="pr-prem"> Premium</label></div>'+
    '<div class="rowf"><input class="inp num" id="pr-s" inputmode="numeric" placeholder="\u0426\u0435\u043d\u0430, \u2605"><input class="inp num" id="pr-days" inputmode="numeric" placeholder="\u0414\u043d\u0435\u0439 (0 \u2014 \u0431\u0435\u0441\u0441\u0440\u043e\u0447\u043d\u043e)"><input class="inp num" id="pr-l" inputmode="numeric" placeholder="\u041b\u0438\u043c\u0438\u0442 \u043d\u0430 \u0430\u043a\u043a\u0430\u0443\u043d\u0442"></div>'+
    '<button class="btn pri md wide" data-act="admPromo">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0430\u043a\u0446\u0438\u044e</button></div>'+
    '<div class="sec">\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u043f\u043b\u0430\u0442\u0435\u0436\u0438</div>'+(!adm.pay?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':adm.pay.length?'<div class="group">'+adm.pay.map(x=>'<div class="li noic"><span class="lt">'+esc(productName(x.pid))+'<br><span class="muted" style="font-size:12px">'+esc(x.uid)+' \u00b7 '+ago(x.t)+(x.status==='refunded'?' \u00b7 \u0432\u043e\u0437\u0432\u0440\u0430\u0442':x.status==='paying'?' \u00b7 \u043d\u0430\u0447\u0438\u0441\u043b\u044f\u0435\u0442\u0441\u044f':'')+'</span></span><span class="lv num">'+x.stars+' \u2605</span></div>').join('')+'</div>':'<div class="empty">\u041f\u043b\u0430\u0442\u0435\u0436\u0435\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442</div>');
}
ACT.admPrices=el=>run('adm.prices',{p:[0,1,2,3].map(i=>nval('sp-'+i)),s:setsCfg().map((_,i)=>nval('ss-'+i)),prem:nval('sp-prem'),mc:+val('sp-mc'),mk:+val('sp-mk')},{btn:el,ok:()=>Page.renderTop()});
ACT.admPromo=el=>run('adm.promo',{title:val('pr-t'),desc:val('pr-d'),m:nval('pr-m'),k:nval('pr-k'),sc:nval('pr-sc'),tc:nval('pr-tc'),prem:!!($('pr-prem')&&$('pr-prem').checked),stars:nval('pr-s'),days:nval('pr-days'),limit:nval('pr-l')},{btn:el,ok:()=>Page.renderTop()});
ACT.admPromoDel=el=>run('adm.promo',{del:el.dataset.id},{btn:el,ok:()=>Page.renderTop()});

function admCodes(){
  const l=adm.codes;
  return'<div class="card p" style="display:grid;gap:8px"><div class="rowf"><input class="inp" id="cd-c" maxlength="24" placeholder="\u041a\u043e\u0434 (\u043f\u0443\u0441\u0442\u043e \u2014 \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u044b\u0439)" autocapitalize="characters"><input class="inp num" id="cd-max" inputmode="numeric" placeholder="\u0410\u043a\u0442\u0438\u0432\u0430\u0446\u0438\u0439" value="100"></div>'+
    '<input class="inp" id="cd-t" maxlength="120" placeholder="\u0422\u0435\u043a\u0441\u0442 \u043f\u0440\u0438 \u0430\u043a\u0442\u0438\u0432\u0430\u0446\u0438\u0438, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u00ab\u0421 \u041d\u043e\u0432\u044b\u043c \u0433\u043e\u0434\u043e\u043c!\u00bb">'+
    '<div class="rowf"><input class="inp num" id="cd-m" inputmode="numeric" placeholder="\u041c\u043e\u043d\u0435\u0442\u044b"><input class="inp num" id="cd-k" inputmode="numeric" placeholder="\u041a\u043b\u044e\u0447\u0438"></div>'+
    '<div class="rowf"><input class="inp num" id="cd-sc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u0441\u043a\u0438\u043d\u043e\u0432"><input class="inp num" id="cd-tc" inputmode="numeric" placeholder="\u041a\u0435\u0439\u0441\u044b \u043d\u0430\u043a\u043b\u0435\u0435\u043a"><input class="inp num" id="cd-days" inputmode="numeric" placeholder="\u0414\u043d\u0435\u0439 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442"></div>'+
    '<button class="btn pri md wide" data-act="admCode">\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u043c\u043e\u043a\u043e\u0434</button>'+(adm.lastCode?'<button class="btn md wide" data-act="copyCode" data-c="'+esc(adm.lastCode)+'">'+ic('copy')+esc(adm.lastCode)+'</button>':'')+'</div>'+
    '<div class="sec">\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434\u044b</div>'+(!l?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':l.length?'<div class="rows">'+l.map(c=>'<div class="row"><div class="mid"><div class="tt" style="user-select:all">'+esc(c.code)+'</div><div class="ss">'+esc(giveLine(c.give))+' \u00b7 '+c.uses+' \u0438\u0437 '+c.max+(c.until?' \u00b7 \u0434\u043e '+dateRu(c.until):'')+'</div></div><button class="pill" data-act="admCodeDel" data-c="'+esc(c.code)+'">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button></div>').join('')+'</div>':'<div class="empty">\u041a\u043e\u0434\u043e\u0432 \u043d\u0435\u0442</div>');
}
ACT.admCode=el=>run('adm.code',{code:val('cd-c'),max:nval('cd-max'),text:val('cd-t'),m:nval('cd-m'),k:nval('cd-k'),sc:nval('cd-sc'),tc:nval('cd-tc'),days:nval('cd-days')},{btn:el,ok:r=>{adm.lastCode=r.code;admLoad()}});
ACT.admCodeDel=el=>confirmSheet('\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u0434?','','\u0423\u0434\u0430\u043b\u0438\u0442\u044c',()=>run('adm.codeDel',{code:el.dataset.c},{ok:admLoad}),true);

function admPlates(){
  const ov=Net.cfg.ov||{};const pl=Object.entries(ov.plates||{});const se=Object.entries(ov.series||{});const pa=ov.pats||[];
  return'<div class="sec" style="margin-top:0">\u0420\u0443\u0447\u043d\u0430\u044f \u0446\u0435\u043d\u0430 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u044f</div><div class="card p" style="display:grid;gap:8px"><div class="rowf"><select class="inp" id="ov-c">'+COUNTRIES.map(c=>'<option value="'+c+'">'+CN_SHORT[c]+'</option>').join('')+'</select><input class="inp" id="ov-t" placeholder="\u0410001\u0410\u041077"></div><div class="rowf"><input class="inp num" id="ov-p" inputmode="numeric" placeholder="\u0426\u0435\u043d\u0430, \u043c\u043e\u043d\u0435\u0442 (0 \u2014 \u0443\u0431\u0440\u0430\u0442\u044c)"><button class="btn md" data-act="admOvPlate" style="flex:none">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c</button></div>'+
    (pl.length?'<div class="group" style="margin:0">'+pl.map(([k,v])=>'<div class="li noic"><span class="lt">'+esc(k.replace(/^\w+:/,'').replace(/\|/g,' '))+'</span><span class="lv num">'+fmt(v)+'</span></div>').join('')+'</div>':'')+'</div>'+
    '<div class="sec">\u0411\u043b\u0430\u0442\u043d\u044b\u0435 \u0441\u0435\u0440\u0438\u0438 \u0420\u0424</div><div class="card p" style="display:grid;gap:8px"><div class="rowf"><input class="inp" id="ov-sl" maxlength="3" placeholder="\u0410\u041c\u0420"><input class="inp num" id="ov-sm" inputmode="decimal" placeholder="\u041c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c (0 \u2014 \u0443\u0431\u0440\u0430\u0442\u044c)"></div><input class="inp" id="ov-sn" maxlength="40" placeholder="\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u00ab\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f \u0410\u041c\u0420\u00bb"><button class="btn md wide" data-act="admOvSeries">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0441\u0435\u0440\u0438\u044e</button>'+
    (se.length?'<div class="group" style="margin:0">'+se.map(([k,v])=>'<div class="li noic"><span class="lt">'+esc(k)+' \u00b7 '+esc(v[1])+'</span><span class="lv">\u00d7'+v[0]+'</span></div>').join('')+'</div>':'')+'<div class="muted" style="font-size:13px">\u0412\u0441\u0442\u0440\u043e\u0435\u043d\u043d\u044b\u0435: '+Object.keys(L.SERIES_RU).join(', ')+'. \u041a\u0440\u044b\u043b\u0430\u0442\u044b\u0435 \u0446\u0438\u0444\u0440\u044b (911, 707, 1337 \u0438 \u0434\u0440\u0443\u0433\u0438\u0435) \u0438 \u0431\u0443\u043a\u0432\u044b (USA, GTR, AMG\u2026) \u0443\u0436\u0435 \u0441 \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044f\u043c\u0438 \u0432\u043e \u0432\u0441\u0435\u0445 \u0441\u0442\u0440\u0430\u043d\u0430\u0445.</div></div>'+
    '<div class="sec">\u0420\u0435\u0434\u043a\u0438\u0435 \u043f\u0430\u0442\u0442\u0435\u0440\u043d\u044b</div><div class="card p" style="display:grid;gap:8px"><div class="rowf"><input class="inp num" id="ov-pt" inputmode="numeric" placeholder="\u041f\u0430\u0442\u0442\u0435\u0440\u043d 0\u20131000"><select class="inp" id="ov-pm"><option value="-1">\u041b\u044e\u0431\u043e\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</option>'+MATS.map((m,i)=>'<option value="'+i+'">'+m.n+'</option>').join('')+'</select></div><div class="rowf"><input class="inp" id="ov-pn" maxlength="30" placeholder="\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u00ab\u0421\u0438\u043d\u0438\u0439 \u0433\u0435\u043c\u00bb"><input class="inp num" id="ov-px" inputmode="decimal" placeholder="\u041c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c"></div><button class="btn md wide" data-act="admOvPat">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043f\u0430\u0442\u0442\u0435\u0440\u043d</button>'+
    (pa.length?'<div class="group" style="margin:0">'+pa.map(x=>'<div class="li noic"><span class="lt">#'+x.pt+' '+esc(x.n)+' \u00b7 '+(x.m<0?'\u043b\u044e\u0431\u043e\u0439':MATS[x.m].n.toLowerCase())+'</span><span class="lv">\u00d7'+x.mult+'</span></div>').join('')+'</div>':'')+'</div>'+
    '<div class="sec">\u041e\u0441\u043e\u0431\u044b\u0439 \u043d\u043e\u043c\u0435\u0440</div><div class="card p" style="display:grid;gap:8px"><div class="rowf"><input class="inp" id="sp-t" maxlength="12" placeholder="\u042d\u041c\u041e\u0426\u0418\u04181"><input class="inp num" id="sp-b" inputmode="numeric" placeholder="\u0426\u0435\u043d\u0430, \u043c\u043e\u043d\u0435\u0442"></div><div class="rowf"><select class="inp" id="sp-m">'+MATS.map((m,i)=>'<option value="'+i+'"'+(i===4?' selected':'')+'>'+m.n+'</option>').join('')+'</select><input class="inp" id="sp-to" placeholder="ID \u0438\u0433\u0440\u043e\u043a\u0430 (\u043f\u0443\u0441\u0442\u043e \u2014 \u0441\u0435\u0431\u0435)"></div><button class="btn pri md wide" data-act="admSpecial">\u0412\u044b\u0434\u0430\u0442\u044c \u043e\u0441\u043e\u0431\u044b\u0439 \u043d\u043e\u043c\u0435\u0440</button></div>';
}
ACT.admOvPlate=el=>run('adm.ov',{k:'plate',c:val('ov-c'),text:val('ov-t'),price:nval('ov-p')},{btn:el,ok:()=>Page.renderTop()});
ACT.admOvSeries=el=>run('adm.ov',{k:'series',letters:val('ov-sl'),mult:+String(val('ov-sm')).replace(',','.'),name:val('ov-sn')},{btn:el,ok:()=>Page.renderTop()});
ACT.admOvPat=el=>run('adm.ov',{k:'pat',pt:nval('ov-pt'),m:+val('ov-pm'),name:val('ov-pn'),mult:+String(val('ov-px')).replace(',','.')},{btn:el,ok:()=>Page.renderTop()});
ACT.admSpecial=el=>run('adm.special',{text:val('sp-t'),b:nval('sp-b'),m:+val('sp-m'),to:val('sp-to')},{btn:el});

function admMedia(){
  const l=adm.media;
  return!l?'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>':l.length?'<div class="rows">'+l.map(m=>'<div class="row" style="align-items:flex-start"><div class="mid"><div class="tt">'+esc(m.nick||m.uid)+' <span class="badge" style="'+(m.status==='ok'?'background:var(--green);color:#fff':m.status==='pending'?'background:var(--orange);color:#fff':'')+'">'+({ok:'\u043e\u0434\u043e\u0431\u0440\u0435\u043d',pending:'\u0437\u0430\u044f\u0432\u043a\u0430',rejected:'\u043e\u0442\u043a\u043b\u043e\u043d\u0451\u043d'})[m.status]+'</span></div><div class="ss" style="white-space:normal"><a href="#" data-act="openUrl" data-u="'+esc(m.channel||'')+'">'+esc(m.channel||'')+'</a></div><div class="ey">\u041a\u043e\u0434 '+esc(m.code||'\u2014')+' \u00b7 \u043f\u0440\u0438\u0448\u043b\u0438 '+m.invites+' \u00b7 \u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0435 '+m.active+' \u00b7 \u0437\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u043b '+fmtN(m.total)+'</div>'+
    '<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">'+(m.status!=='ok'?'<button class="pill" data-act="admMediaOk" data-uid="'+esc(m.uid)+'" data-c="'+esc(m.code||'')+'" style="background:var(--green);color:#fff">\u041e\u0434\u043e\u0431\u0440\u0438\u0442\u044c</button>':'')+(m.status!=='rejected'?'<button class="pill" data-act="admMediaNo" data-uid="'+esc(m.uid)+'">\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c</button>':'')+'<button class="pill" data-act="profile" data-uid="'+esc(m.uid)+'">\u041f\u0440\u043e\u0444\u0438\u043b\u044c</button></div></div></div>').join('')+'</div>':'<div class="empty">\u0417\u0430\u044f\u0432\u043e\u043a \u043d\u0435\u0442</div>';
}
ACT.admMediaOk=el=>run('adm.mediaSet',{uid:el.dataset.uid,status:'ok',code:el.dataset.c},{ok:admLoad});
ACT.admMediaNo=el=>run('adm.mediaSet',{uid:el.dataset.uid,status:'rejected'},{ok:admLoad});
ACT.openUrl=el=>{const u=el.dataset.u;if(/^https:\/\//.test(u))openLink(u)};

function admBot(){return'<div class="card p" style="display:grid;gap:10px"><div>\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0435\u0442 \u0432\u0435\u0431\u0445\u0443\u043a, \u043a\u043d\u043e\u043f\u043a\u0443 \u00ab\u0418\u0433\u0440\u0430\u0442\u044c\u00bb, \u043e\u0442\u0432\u0435\u0442 \u043d\u0430 /start \u0438 /paysupport, \u043f\u0440\u0438\u0451\u043c \u043e\u043f\u043b\u0430\u0442\u044b \u0438 \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u043e\u0432 Stars. \u041d\u0430\u0436\u0438\u043c\u0430\u0439\u0442\u0435 \u043f\u043e\u0441\u043b\u0435 \u0441\u043c\u0435\u043d\u044b BOT_TOKEN, GAME_URL \u0438\u043b\u0438 \u0432\u0435\u0440\u0441\u0438\u0438.</div><div class="muted" style="font-size:14px">\u0411\u043e\u0442: '+(Net.cfg.bot?'@'+esc(Net.cfg.bot):'\u0435\u0449\u0451 \u043d\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0451\u043d')+'</div><button class="btn pri md wide" data-act="admBot">\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0431\u043e\u0442\u0430</button></div>'}
ACT.admBot=el=>run('adm.bot',{},{btn:el,ok:()=>Page.renderTop()});

/* ---------- \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u044c \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430 ---------- */
function admSec(){
  const s=adm.sec;if(!s)return'<div class="empty">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c\u2026</div>';
  return'<div class="card p" style="display:grid;gap:10px"><div style="font:600 17px var(--f-ui)">\u0412\u0445\u043e\u0434 \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430</div><div class="muted" style="font-size:14px;line-height:1.45">\u041a\u043b\u044e\u0447 ADMIN_KEY \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0441 \u0432\u0430\u0448\u0435\u0433\u043e Telegram-\u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430'+(s.tg?'':' (\u043f\u0440\u0438\u0432\u044f\u0436\u0435\u0442\u0441\u044f \u043f\u0440\u0438 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u043c \u0432\u0445\u043e\u0434\u0435 \u043f\u043e \u043a\u043b\u044e\u0447\u0443)')+'. \u041f\u043e\u0441\u043b\u0435 5 \u043e\u0448\u0438\u0431\u043e\u043a \u0432\u0445\u043e\u0434 \u0431\u043b\u043e\u043a\u0438\u0440\u0443\u0435\u0442\u0441\u044f \u043d\u0430 15 \u043c\u0438\u043d\u0443\u0442, \u0430 \u0432\u0430\u043c \u043f\u0440\u0438\u0445\u043e\u0434\u0438\u0442 \u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u0435.</div>'+
    '<div class="li noic" style="padding:0;display:flex;justify-content:space-between;gap:10px"><span class="lt">\u0423\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432 \u0441 Face ID / \u043e\u0442\u043f\u0435\u0447\u0430\u0442\u043a\u043e\u043c</span><span class="lv num">'+s.devs+'</span></div>'+
    '<button class="btn md wide" data-act="bioAdd">'+ic('faceid')+'\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u044d\u0442\u043e \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e</button>'+
    '<button class="li" data-act="secStrict" style="padding:8px 0;display:flex;align-items:center;gap:12px;width:100%;text-align:left"><span class="lt">\u0422\u043e\u043b\u044c\u043a\u043e \u043f\u043e Face ID<br><span class="muted" style="font-size:13px">\u041a\u043b\u044e\u0447 \u0431\u0435\u0437 \u0431\u0438\u043e\u043c\u0435\u0442\u0440\u0438\u0438 \u043d\u0435 \u0434\u0430\u0441\u0442 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u0430\u0434\u043c\u0438\u043d\u043a\u0435</span></span><span class="tgl'+(s.strict?' on':'')+'"><i></i></span></button>'+
    (s.devs?'<button class="btn md wide danger" data-act="secClear">\u041e\u0442\u0432\u044f\u0437\u0430\u0442\u044c \u0432\u0441\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430</button>':'')+
    '<button class="btn md wide" data-act="ownerLockGo">\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u0441\u0435\u0441\u0441\u0438\u044e \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430</button></div>'+
    '<p class="note">\u0415\u0441\u043b\u0438 \u043f\u043e\u0442\u0435\u0440\u044f\u0435\u0442\u0435 \u0442\u0435\u043b\u0435\u0444\u043e\u043d: \u0437\u0430\u0439\u0434\u0438\u0442\u0435 \u043f\u043e \u043a\u043b\u044e\u0447\u0443 \u0441 Telegram-\u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430 \u0438 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u041e\u0442\u0432\u044f\u0437\u0430\u0442\u044c \u0432\u0441\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430\u00bb. \u0415\u0441\u043b\u0438 \u043f\u043e\u0442\u0435\u0440\u044f\u0435\u0442\u0435 \u0438 Telegram-\u0430\u043a\u043a\u0430\u0443\u043d\u0442 \u2014 \u0432 Supabase \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u0435 SQL: delete from kv where key = \'owner\';</p>';
}
ACT.bioAdd=async()=>{if(!(await Bio.available())){toast('\u041d\u0430 \u044d\u0442\u043e\u043c \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435 \u043d\u0435\u0442 Face ID \u0438\u043b\u0438 \u043e\u0442\u043f\u0435\u0447\u0430\u0442\u043a\u0430 \u0432 Telegram','err');return}await bioSetup();admLoad()};
ACT.secStrict=()=>{if(!adm.sec.devs){toast('\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e \u0441 Face ID','err');return}run('adm.sec',{strict:!adm.sec.strict},{quiet:true,ok:r=>{adm.sec=r;Page.renderTop()}})};
ACT.secClear=()=>confirmSheet('\u041e\u0442\u0432\u044f\u0437\u0430\u0442\u044c \u0432\u0441\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430?','\u0412\u0445\u043e\u0434 \u0431\u0443\u0434\u0435\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u043e \u043a\u043b\u044e\u0447\u0443, \u043f\u043e\u043a\u0430 \u0441\u043d\u043e\u0432\u0430 \u043d\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u0435 Face ID.','\u041e\u0442\u0432\u044f\u0437\u0430\u0442\u044c',()=>run('adm.sec',{clear:true},{quiet:true,ok:r=>{adm.sec=r;lsDel('nomera21_bio');Page.renderTop()}}),true);
ACT.ownerLockGo=()=>run('ownerLock',{},{ok:()=>{Page.clear();render()}});

/* ================= \u0437\u0430\u043f\u0443\u0441\u043a ================= */
function gameColors(){const cs=getComputedStyle(document.documentElement);const g=(n,f)=>(cs.getPropertyValue(n)||'').trim()||f;return{sky1:g('--sky1','#0d1b33'),sky2:g('--sky2','#2b4a78'),hill1:g('--hill1','#16243a'),hill2:g('--hill2','#1d3150'),ground:g('--ground','#1b222c'),groundTop:g('--ground-top','#5d6b80'),road:g('--road','#e9edf2')}}
const Games=window.makeGames({
  esc,ic,fmt,fmtN,Draw,rr:Draw.rr,Music,Haptic,Snd,toast,
  act:(a,p)=>act(a,p),
  online:()=>Net.status==='on',
  look:k=>vehLook(k),
  pending:()=>Pend.list().length,
  limitWarned:{v:false},
  colors:gameColors,
  after:()=>{render();showInbox()}
});
window.__app={get S(){return S},Net,Games,Reel,render,act,run,L,Page,Sheet,Tabs};
document.addEventListener('themechange',()=>{if(shopBuilt)render()});
Tabs.init();
RENDER.shop();
connect();
setInterval(()=>{if(!document.hidden&&Net.status==='on'&&Tabs.cur==='games'&&!Page.stack.length)RENDER.games()},30000);

})();
