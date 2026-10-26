/* Общая логика игры «Выбивание номеров»: работает и в браузере, и на сервере */
(function(root,factory){const L=factory();if(typeof module==='object'&&module.exports)module.exports=L;else root.L=L})(typeof self!=='undefined'?self:this,function(){
'use strict';
// ==CORE==
const RU_LET='АВЕКМНОРСТУХ'.split('');
const UA_LET='ABCEHIKMOPTX'.split('');
const KZ_LET='ABCDEFGHKLMNOPRSTUVXYZ'.split('');
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
const seq=d=>{const a=[...d].map(Number);return a.every((v,i)=>i===0||v===a[i-1]+1)||a.every((v,i)=>i===0||v===a[i-1]-1)};
const same=d=>[...d].every(ch=>ch===d[0]);

// [код, регион, множитель цены, вес выпадения]
const RU_TOP=[['777','Москва',3.5,.5],['977','Москва',2.8,.5],['797','Москва',2.6,.5],['799','Москва',2.6,.5],['199','Москва',2.1,.7],['99','Москва',2.3,.7],['97','Москва',2.2,.7],['197','Москва',2,.7],['177','Москва',2,.7],['77','Москва',2.4,1],['178','Санкт-Петербург',1.7,.6],['98','Санкт-Петербург',1.7,.6],['78','Санкт-Петербург',1.8,.9],['750','Московская область',1.4,.5],['790','Московская область',1.3,.5],['150','Московская область',1.3,.6],['190','Московская область',1.3,.6],['50','Московская область',1.4,.9],['90','Московская область',1.4,.9],['123','Краснодарский край',1.3,.5],['93','Краснодарский край',1.3,.6],['23','Краснодарский край',1.3,.9]];
const RU_PLAIN=[['01','Адыгея'],['02','Башкортостан'],['03','Бурятия'],['04','Алтай'],['05','Дагестан'],['06','Ингушетия'],['07','Кабардино-Балкария'],['08','Калмыкия'],['09','Карачаево-Черкесия'],['10','Карелия'],['11','Коми'],['12','Марий Эл'],['13','Мордовия'],['14','Якутия'],['15','Северная Осетия'],['16','Татарстан'],['17','Тыва'],['18','Удмуртия'],['19','Хакасия'],['21','Чувашия'],['22','Алтайский край'],['24','Красноярский край'],['25','Приморский край'],['26','Ставропольский край'],['27','Хабаровский край'],['28','Амурская область'],['29','Архангельская область'],['30','Астраханская область'],['31','Белгородская область'],['32','Брянская область'],['33','Владимирская область'],['34','Волгоградская область'],['35','Вологодская область'],['36','Воронежская область'],['37','Ивановская область'],['38','Иркутская область'],['39','Калининградская область'],['40','Калужская область'],['41','Камчатский край'],['42','Кемеровская область'],['43','Кировская область'],['44','Костромская область'],['45','Курганская область'],['46','Курская область'],['47','Ленинградская область'],['48','Липецкая область'],['49','Магаданская область'],['51','Мурманская область'],['52','Нижегородская область'],['53','Новгородская область'],['54','Новосибирская область'],['55','Омская область'],['56','Оренбургская область'],['57','Орловская область'],['58','Пензенская область'],['59','Пермский край'],['60','Псковская область'],['61','Ростовская область'],['62','Рязанская область'],['63','Самарская область'],['64','Саратовская область'],['65','Сахалинская область'],['66','Свердловская область'],['67','Смоленская область'],['68','Тамбовская область'],['69','Тверская область'],['70','Томская область'],['71','Тульская область'],['72','Тюменская область'],['73','Ульяновская область'],['74','Челябинская область'],['75','Забайкальский край'],['76','Ярославская область'],['79','Еврейская АО'],['86','Ханты-Мансийский АО'],['89','Ямало-Ненецкий АО'],['95','Чечня']];
const UA_REG=[['AA','Киев',2.5,1.5],['KA','Киев',2.2,1.2],['BH','Одесская область',1.5,1],['AX','Харьковская область',1.4,1],['BC','Львовская область',1.4,1],['AI','Киевская область',1.4,1],['AE','Днепропетровская область',1.3,1],['AB','Винницкая область',1,1],['AC','Волынская область',1,1],['AM','Житомирская область',1,1],['AO','Закарпатская область',1,1],['AP','Запорожская область',1,1],['AT','Ивано-Франковская область',1,1],['BA','Кировоградская область',1,1],['BE','Николаевская область',1,1],['BI','Полтавская область',1,1],['BK','Ровенская область',1,1],['BM','Сумская область',1,1],['BO','Тернопольская область',1,1],['BT','Херсонская область',1,1],['BX','Хмельницкая область',1,1],['CA','Черкасская область',1,1],['CB','Черниговская область',1,1],['CE','Черновицкая область',1,1]];
const KZ_REG=[['01','Астана',2.2,1.3],['02','Алматы',2,1.3],['17','Шымкент',1.4,.9],['03','Акмолинская область',1,1],['04','Актюбинская область',1,1],['05','Алматинская область',1,1],['06','Атырауская область',1,1],['07','Западно-Казахстанская область',1,1],['08','Жамбылская область',1,1],['09','Карагандинская область',1,1],['10','Костанайская область',1,1],['11','Кызылординская область',1,1],['12','Мангистауская область',1,1],['13','Туркестанская область',1,1],['14','Павлодарская область',1,1],['15','Северо-Казахстанская область',1,1],['16','Восточно-Казахстанская область',1,1],['18','область Абай',1,1],['19','область Жетысу',1,1],['20','область Улытау',1,1]];
const topCodes=new Set(RU_TOP.map(r=>r[0]));
const RU_REG=RU_TOP.concat(RU_PLAIN.filter(r=>!topCodes.has(r[0])).map(r=>[r[0],r[1],1,1]));
const REG={ru:RU_REG,ua:UA_REG,kz:KZ_REG};
const RMAP={};for(const c in REG){RMAP[c]={};REG[c].forEach(r=>{RMAP[c][r[0]]=r})}
const wpick=l=>{let t=0;for(const x of l)t+=x[3];let r=Math.random()*t;for(const x of l){r-=x[3];if(r<0)return x}return l[l.length-1]};
const digitsStr=n=>{let s;do{s='';for(let i=0;i<n;i++)s+=rnd(10)}while(/^0+$/.test(s));return s};
const letters=(set,n)=>{let s='';for(let i=0;i<n;i++)s+=pick(set);return s};

// Правила цифр: первое совпавшее правило задаёт множитель
const RULES3=[
 {t:'Три семёрки',m:60,ex:'777',f:d=>d==='777'},
 {t:'Три восьмёрки',m:40,ex:'888',f:d=>d==='888'},
 {t:'Три девятки',m:30,ex:'999',f:d=>d==='999'},
 {t:'Три единицы',m:30,ex:'111',f:d=>d==='111'},
 {t:'Три шестёрки',m:24,ex:'666',f:d=>d==='666'},
 {t:'Агент 007',m:24,ex:'007',f:d=>d==='007'},
 {t:'Три одинаковые',m:20,ex:'333',f:same},
 {t:'Малый номер',m:14,ex:'001–009',f:d=>/^00\d$/.test(d)},
 {t:'Лесенка',m:10,ex:'123, 765',f:seq},
 {t:'Круглая сотня',m:8,ex:'500',f:d=>/^\d00$/.test(d)},
 {t:'Зеркальный',m:4,ex:'282',f:d=>d[0]===d[2]},
 {t:'Пара',m:1.8,ex:'118, 455',f:d=>d[0]===d[1]||d[1]===d[2]}
];
const RULES4=[
 {t:'Номер один',m:90,ex:'0001',f:d=>d==='0001'},
 {t:'Четыре семёрки',m:80,ex:'7777',f:d=>d==='7777'},
 {t:'Агент 007',m:70,ex:'0007',f:d=>d==='0007'},
 {t:'Четыре восьмёрки',m:60,ex:'8888',f:d=>d==='8888'},
 {t:'Четыре девятки',m:50,ex:'9999',f:d=>d==='9999'},
 {t:'Четыре единицы',m:45,ex:'1111',f:d=>d==='1111'},
 {t:'Четыре одинаковые',m:40,ex:'5555',f:same},
 {t:'Малый номер',m:28,ex:'0002–0009',f:d=>/^000\d$/.test(d)},
 {t:'Лесенка',m:25,ex:'1234, 6543',f:seq},
 {t:'Три семёрки',m:14,ex:'0777, 7770',f:d=>d.includes('777')},
 {t:'Круглая тысяча',m:12,ex:'3000',f:d=>/^\d000$/.test(d)},
 {t:'Две пары',m:8,ex:'1122',f:d=>/^(\d)\1(\d)\2$/.test(d)},
 {t:'Повтор',m:8,ex:'1212',f:d=>/^(\d\d)\1$/.test(d)},
 {t:'Зеркальный',m:7,ex:'1221',f:d=>/^(\d)(\d)\2\1$/.test(d)},
 {t:'Тройка',m:6,ex:'5551',f:d=>/(\d)\1\1/.test(d)},
 {t:'Круглая сотня',m:2.5,ex:'3500',f:d=>/^\d\d00$/.test(d)},
 {t:'Пара',m:1.6,ex:'1123',f:d=>/(\d)\1/.test(d)}
];
const lrun=s=>{const c=[...s].map(x=>x.charCodeAt(0));return c.every((v,i)=>i===0||v===c[i-1]+1)||c.every((v,i)=>i===0||v===c[i-1]-1)};
const LRULES={
 ru:[
  {t:'Одинаковые буквы',m:4,ex:'А…АА',f:p=>p.p===p.s[0]&&p.s[0]===p.s[1]},
  {t:'Зеркальные буквы',m:1.6,ex:'В…АВ',f:p=>p.p===p.s[1]},
  {t:'Парные буквы',m:1.5,ex:'В…АА',f:p=>p.s[0]===p.s[1]}
 ],
 ua:[
  {t:'Серия как регион',m:3,ex:'AA 1234 AA',f:p=>p.p===p.s},
  {t:'Парные буквы',m:1.5,ex:'AA 1234 BB',f:p=>p.s[0]===p.s[1]}
 ],
 kz:[
  {t:'Три одинаковые буквы',m:4,ex:'AAA',f:p=>same(p.s)},
  {t:'Алфавит',m:3,ex:'ABC',f:p=>lrun(p.s)},
  {t:'Зеркальные буквы',m:2,ex:'ABA',f:p=>p.s[0]===p.s[2]},
  {t:'Парные буквы',m:1.4,ex:'AAB',f:p=>p.s[0]===p.s[1]||p.s[1]===p.s[2]}
 ]
};
const BASE={ru:160,ua:200,kz:160};
const RARITY=[{k:'common',n:'Обычный',min:0},{k:'good',n:'Хороший',min:350},{k:'rare',n:'Редкий',min:1500},{k:'elite',n:'Элитный',min:6000},{k:'legend',n:'Легендарный',min:25000}];
const RIDX={common:0,good:1,rare:2,elite:3,legend:4};
const TIERS=[
 {id:'std',name:'Стандарт',k:1,price:500,xp:40,desc:'Один случайный номер'},
 {id:'gold',name:'Золотой',k:3,price:900,xp:80,desc:'Лучший из трёх номеров'},
 {id:'elite',name:'Элитный',k:10,price:1900,xp:160,desc:'Лучший из десяти номеров'},
 {id:'season',name:'Сезонный',k:14,floor:1500,price:3500,xp:250,event:true,desc:'Лучший из 14, не ниже «Редкого». Только в сезоне 1'}
];
const rarityOf=p=>{let r=RARITY[0];for(const x of RARITY)if(p>=x.min)r=x;return r};
const niceRound=p=>{const s=p<1000?10:p<10000?50:p<100000?500:1000;return Math.max(50,Math.round(p/s)*s)};
function genPlate(c){
  if(c==='ru')return{c,p:pick(RU_LET),d:digitsStr(3),s:letters(RU_LET,2),r:wpick(RU_REG)[0]};
  if(c==='ua')return{c,p:wpick(UA_REG)[0],d:digitsStr(4),s:letters(UA_LET,2),r:''};
  return{c:'kz',p:'',d:digitsStr(3),s:letters(KZ_LET,3),r:wpick(KZ_REG)[0]};
}
function appraise(pl){
  const dr=(pl.c==='ua'?RULES4:RULES3).find(r=>r.f(pl.d))||{t:'Обычные цифры',m:1};
  const lr=LRULES[pl.c].find(r=>r.f(pl))||{t:'Обычные буквы',m:1};
  const code=pl.c==='ua'?pl.p:pl.r;
  const rg=RMAP[pl.c][code]||[code,'Регион '+code,1,1];
  const base=BASE[pl.c];
  const mult=dr.m*lr.m*rg[2];
  const price=niceRound(base*mult);
  return{price,base,mult,raw:base*mult,rar:rarityOf(price),
    parts:[
      {k:'Цифры',v:pl.d,t:dr.t,m:dr.m},
      {k:'Буквы',v:pl.c==='ua'?pl.s:pl.p?pl.p+pl.s:pl.s,t:lr.t,m:lr.m},
      {k:'Регион',v:code,t:rg[1],m:rg[2]}
    ]};
}
function bestOf(c,k,floor){
  let best=null;
  for(let tries=0;tries<60;tries++){
    for(let i=0;i<k;i++){const pl=genPlate(c);const a=appraise(pl);if(!best||a.price>best.a.price)best={pl,a}}
    if(!floor||best.a.price>=floor)break;
  }
  return best;
}
// Проверка номера, пришедшего из общей базы или старого сохранения
function cleanPlate(o){
  if(!o||typeof o!=='object')return null;
  const c=String(o.c||''),p=String(o.p||''),d=String(o.d||''),s=String(o.s||''),r=String(o.r||'');
  if(/^0+$/.test(d))return null;
  if(c==='ru'){
    if(RU_LET.includes(p)&&/^\d{3}$/.test(d)&&s.length===2&&[...s].every(x=>RU_LET.includes(x))&&RMAP.ru[r])return{c,p,d,s,r};
  }else if(c==='ua'){
    if(RMAP.ua[p]&&/^\d{4}$/.test(d)&&s.length===2&&[...s].every(x=>UA_LET.includes(x))&&r==='')return{c,p,d,s,r:''};
  }else if(c==='kz'){
    if(p===''&&/^\d{3}$/.test(d)&&s.length===3&&[...s].every(x=>KZ_LET.includes(x))&&RMAP.kz[r])return{c,p:'',d,s,r};
  }
  return null;
}
// ==/CORE==

// ==LOGIC==
const ALL=['ru','ua','kz'];
const BOX_CAP=250,BONUS=500,BONUS_CD=120000,BUYBACK=.85,FEE=.05,MAX_LIST=12,STUNT_CAP=6000,MIN_ASK=50,MAX_ASK=5000000;
const SEASON={end:Date.parse('2026-11-30T23:59:59+03:00'),lvlXp:1000,max:30,premium:500};
const CARS={orange:{n:'Оранжевый',c:'#ff7a1a'},mint:{n:'Мята',c:'#3ecfa0'},violet:{n:'Фиолетовый',c:'#8b5cf6'},gold:{n:'Золото',c:'#e6b422'},neon:{n:'Неон',c:'#39ff88'},chrome:{n:'Хром',c:'#c9d3dd'},red:{n:'Красный',c:'#e53935',cost:60},blue:{n:'Синий',c:'#2f6fde',cost:60},black:{n:'Чёрный',c:'#20242b',cost:90},white:{n:'Белый',c:'#f3f5f8',cost:90}};
const CAR_SRC={mint:'пропуск, ур. 6',violet:'пропуск, ур. 20',gold:'премиум, ур. 4',neon:'премиум, ур. 14',chrome:'премиум, ур. 24'};
const KEYN={std:'Стандарт',gold:'Золотой',elite:'Элитный',season:'Сезонный'};
const PACKS=[{g:100,b:'',rub:99},{g:330,b:'+10%',rub:299},{g:700,b:'+18%',rub:590},{g:1500,b:'+25%',rub:1190}];
const GKEY={season:120,elite:70};
const FREE=[null,{m:1000},{k:'std',n:2},{g:15},{m:1500},{k:'gold',n:1},{car:'mint'},{m:2000},{g:20},{k:'gold',n:2},{k:'season',n:1},{m:2500},{g:25},{k:'elite',n:1},{m:3000},{k:'season',n:1},{g:30},{m:3500},{k:'elite',n:1},{m:4000},{car:'violet'},{g:35},{k:'gold',n:3},{m:5000},{k:'elite',n:2},{k:'season',n:2},{g:40},{m:6000},{k:'elite',n:2},{g:50},{plate:{c:'ru',p:'К',d:'123',s:'КК',r:'78'}}];
const PREM=[null,{g:50},{m:3000},{k:'elite',n:1},{car:'gold'},{k:'season',n:2},{m:5000},{g:60},{k:'elite',n:2},{m:6000},{plate:{c:'ua',p:'BC',d:'1221',s:'BC',r:''}},{k:'season',n:2},{g:70},{m:8000},{car:'neon'},{plate:{c:'kz',p:'',d:'001',s:'AAA',r:'02'}},{k:'elite',n:3},{g:80},{m:10000},{k:'season',n:3},{plate:{c:'ru',p:'Е',d:'888',s:'ЕЕ',r:'78'}},{g:100},{m:12000},{k:'elite',n:3},{car:'chrome'},{k:'season',n:4},{g:120},{m:15000},{k:'elite',n:4},{g:150},{plate:{c:'ru',p:'А',d:'777',s:'АА',r:'777'}}];
const QUESTS={
  open5:{t:'Открыть 5 кейсов',g:5},
  gold2:{t:'Открыть 2 кейса дороже «Стандарта»',g:2},
  rare1:{t:'Выбить «Редкий» номер или лучше',g:1},
  stunt10k:{t:'Набрать 10 000 очков за один заезд',g:10000,max:true},
  flips5:{t:'Сделать 5 флипов в станте',g:5},
  runs3:{t:'Проехать 3 заезда',g:3},
  trade1:{t:'Купить или продать номер на рынке',g:1},
  list2:{t:'Выставить 2 номера на рынок',g:2},
  quick3:{t:'Сдать скупщику 3 номера',g:3}
};
const num=(v,d=0)=>Number.isFinite(+v)?+v:d;
const fmtN=n=>Math.round(Number(n)||0).toLocaleString('ru-RU');
const fmt=n=>fmtN(n)+' ₽';
const gem=n=>fmtN(n)+' ◆';
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mskDate(t){return new Date((t||Date.now())+3*3600e3).toISOString().slice(0,10)}
const INVIS=/[\u0000-\u0009\u000b-\u001f\u007f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g;
function cleanNick(s){return String(s==null?'':s).replace(INVIS,'').replace(/\s+/g,' ').trim().slice(0,20)}
function cleanText(s,n){return String(s==null?'':s).replace(INVIS,'').trim().slice(0,n)}
function plateText(pl){return pl.c==='ru'?pl.p+pl.d+pl.s+' '+pl.r:pl.c==='ua'?pl.p+' '+pl.d+' '+pl.s:pl.d+' '+pl.s+' '+pl.r}
const LAT={'А':'A','В':'B','Е':'E','К':'K','М':'M','Н':'H','О':'O','Р':'P','С':'C','Т':'T','У':'Y','Х':'X'};
const CYR={A:'А',B:'В',E:'Е',K:'К',M:'М',H:'Н',O:'О',P:'Р',C:'С',T:'Т',Y:'У',X:'Х'};
const toLat=s=>String(s).toUpperCase().replace(/[АВЕКМНОРСТУХ]/g,c=>LAT[c]).replace(/[^A-Z0-9]/g,'');
function parsePlateInput(c,str){
  let s=String(str||'').toUpperCase().replace(/[\s-]+/g,'');
  if(c==='ru'){s=s.replace(/[ABEKMHOPCTYX]/g,ch=>CYR[ch]);const m=s.match(/^([АВЕКМНОРСТУХ])(\d{3})([АВЕКМНОРСТУХ]{2})(\d{2,3})$/);return m?cleanPlate({c,p:m[1],d:m[2],s:m[3],r:m[4]}):null}
  s=toLat(s);
  if(c==='ua'){const m=s.match(/^([A-Z]{2})(\d{4})([A-Z]{2})$/);return m?cleanPlate({c,p:m[1],d:m[2],s:m[3],r:''}):null}
  const m=s.match(/^(\d{3})([A-Z]{3})(\d{2})$/);return m?cleanPlate({c:'kz',p:'',d:m[1],s:m[2],r:m[3]}):null;
}

/* ---------- состояние игрока ---------- */
function fresh(){return{v:3,bal:5000,gold:0,box:[],opened:0,spent:0,nextId:1,bonusAt:0,best:null,
  keys:{std:0,gold:0,elite:0,season:1},xp:0,premium:false,cf:[],cp:[],
  daily:{d:'',q:[],p:{},done:[]},stunt:{best:0,d:'',earned:0,runs:0},run:null,
  nick:'',car:'orange',cars:['orange'],inbox:[],gifts:[],rd:[],
  stats:{sold:0,bought:0,listed:0,quick:0,flips:0},welcome:'new'}}
function normalize(o){
  const s=fresh();if(!o||typeof o!=='object')return s;
  s.bal=Math.max(0,Math.round(num(o.bal,5000)));
  s.gold=Math.max(0,Math.floor(num(o.gold)));
  s.opened=num(o.opened);s.spent=num(o.spent);s.bonusAt=num(o.bonusAt);s.xp=Math.max(0,num(o.xp));
  s.premium=!!o.premium;s.welcome=typeof o.welcome==='string'?o.welcome:'';
  if(o.keys&&typeof o.keys==='object'){s.keys={std:0,gold:0,elite:0,season:0};for(const k in s.keys)s.keys[k]=Math.max(0,Math.floor(num(o.keys[k])))}
  const arrN=a=>Array.isArray(a)?a.map(Number).filter(Number.isFinite):[];
  const arrS=a=>Array.isArray(a)?a.filter(x=>typeof x==='string'):[];
  s.cf=arrN(o.cf);s.cp=arrN(o.cp);s.gifts=arrS(o.gifts).slice(-300);s.rd=arrN(o.rd).slice(-20);
  s.cars=arrS(o.cars).filter(c=>CARS[c]);if(!s.cars.includes('orange'))s.cars.unshift('orange');
  s.car=CARS[o.car]&&s.cars.includes(o.car)?o.car:'orange';
  s.nick=cleanNick(o.nick);
  s.inbox=Array.isArray(o.inbox)?o.inbox.filter(x=>x&&typeof x.text==='string').slice(-20):[];
  s.run=o.run&&typeof o.run==='object'?{id:String(o.run.id),t:num(o.run.t)}:null;
  if(o.daily&&typeof o.daily==='object')s.daily={d:String(o.daily.d||''),q:arrS(o.daily.q).filter(q=>QUESTS[q]),p:(o.daily.p&&typeof o.daily.p==='object')?o.daily.p:{},done:arrS(o.daily.done)};
  if(o.stunt&&typeof o.stunt==='object')s.stunt={best:num(o.stunt.best),d:String(o.stunt.d||''),earned:num(o.stunt.earned),runs:num(o.stunt.runs)};
  if(o.stats&&typeof o.stats==='object')for(const k in s.stats)s.stats[k]=num(o.stats[k]);
  const seen=new Set();let maxId=0;
  s.box=(Array.isArray(o.box)?o.box:[]).map(x=>{
    const pl=cleanPlate(x&&x.pl);if(!pl)return null;
    let id=Math.floor(num(x.id));if(!id||seen.has(id))id=0;else seen.add(id);
    return{id,pl,price:appraise(pl).price,t:num(x.t,Date.now()),pin:!!x.pin,src:typeof x.src==='string'?x.src:''};
  }).filter(Boolean);
  s.box.forEach(x=>{if(x.id>maxId)maxId=x.id});
  s.nextId=Math.max(num(o.nextId,1),maxId+1);
  s.box.forEach(x=>{if(!x.id)x.id=s.nextId++});
  if(o.best&&cleanPlate(o.best.pl)){const pl=cleanPlate(o.best.pl);s.best={pl,price:appraise(pl).price}}
  s.box.forEach(x=>{if(!s.best||x.price>s.best.price)s.best={pl:x.pl,price:x.price}});
  return s;
}

/* ---------- сезон, задания, награды ---------- */
const seasonOn=now=>(now||Date.now())<SEASON.end;
const level=S=>Math.min(SEASON.max,Math.floor(S.xp/SEASON.lvlXp));
const lvlPct=S=>level(S)>=SEASON.max?100:Math.round((S.xp%SEASON.lvlXp)/SEASON.lvlXp*100);
const worth=S=>S.box.reduce((s,x)=>s+x.price,0);
function addXp(S,n,ctx){
  n=Math.round(n);if(!seasonOn(ctx.now)||!(n>0))return 0;
  const b=level(S);S.xp+=n;const a=level(S);
  if(a>b)ctx.notes.push('Уровень пропуска '+a+'! Награда ждёт во вкладке «Сезон»');
  return n;
}
function ensureDaily(S,now){
  const d=mskDate(now);if(S.daily.d===d&&S.daily.q.length)return;
  let h=hashStr('q'+d);const q=[];const p=Object.keys(QUESTS);
  while(q.length<3&&p.length){h=(Math.imul(h,1103515245)+12345)>>>0;q.push(p.splice(h%p.length,1)[0])}
  S.daily={d,q,p:{},done:[]};
}
function quest(S,id,n,isMax,ctx){
  ensureDaily(S,ctx.now);if(!S.daily.q.includes(id))return;
  const g=QUESTS[id].g,cur=num(S.daily.p[id]);
  const nv=Math.min(g,isMax?Math.max(cur,n):cur+n);S.daily.p[id]=nv;
  if(cur<g&&nv>=g)ctx.notes.push('Задание выполнено: '+QUESTS[id].t);
}
function questReady(S,now){if(S.daily.d!==mskDate(now))return 0;return S.daily.q.filter(q=>num(S.daily.p[q])>=QUESTS[q].g&&!S.daily.done.includes(q)).length}
function claimable(S){const L=level(S);let n=0;for(let i=1;i<=L;i++){if(!S.cf.includes(i))n++;if(S.premium&&!S.cp.includes(i))n++}return n}
function rewardText(r){
  if(r.m)return{a:fmt(r.m),b:'на баланс'};
  if(r.g)return{a:gem(r.g),b:'голда'};
  if(r.k)return{a:'Ключ «'+KEYN[r.k]+'»'+(r.n>1?' ×'+r.n:''),b:'бесплатный кейс'};
  if(r.car)return{a:'Цвет «'+CARS[r.car].n+'»',b:'для машины в станте'};
  if(r.plate){const a=appraise(r.plate);return{a:plateText(r.plate),b:a.rar.n+' · '+fmt(a.price),plate:r.plate}}
  return{a:'',b:''};
}
function addPlate(S,pl,src,now){
  const item={id:S.nextId++,pl,price:appraise(pl).price,t:now||Date.now(),pin:false,src:src||''};
  S.box.push(item);if(!S.best||item.price>S.best.price)S.best={pl:item.pl,price:item.price};
  return item;
}
function grant(S,r,src,now){
  if(r.m)S.bal+=r.m;if(r.g)S.gold+=r.g;if(r.k)S.keys[r.k]=(S.keys[r.k]||0)+r.n;
  if(r.car&&!S.cars.includes(r.car))S.cars.push(r.car);
  if(r.plate){const pl=cleanPlate(r.plate);if(pl)addPlate(S,pl,src||'pass',now)}
}
function claimLevel(S,trk,i){
  if(!(i>=1&&i<=level(S)))return false;
  if(trk==='f'){if(S.cf.includes(i))return false;S.cf.push(i);grant(S,FREE[i],'pass');return FREE[i]}
  if(trk==='p'){if(!S.premium||S.cp.includes(i))return false;S.cp.push(i);grant(S,PREM[i],'pass');return PREM[i]}
  return false;
}
function inbox(S,text,now){S.inbox.push({t:now||Date.now(),text:String(text).slice(0,300)});S.inbox=S.inbox.slice(-20)}
function sellQuick(S,id,ctx){
  const k=S.box.findIndex(x=>x.id===id);if(k<0)return -1;
  const p=Math.floor(S.box[k].price*BUYBACK);S.bal+=p;S.box.splice(k,1);S.stats.quick++;quest(S,'quick3',1,false,ctx);
  return p;
}

/* ---------- действия игрока: одинаково работают на сервере ---------- */
function GameError(msg){const e=new Error(msg);e.game=true;return e}
const fail=msg=>{throw GameError(msg)};
const int=v=>Math.floor(num(v));
const ACTIONS={
  welcome(S){S.welcome='';return{}},
  inboxSeen(S){S.inbox=[];return{}},
  nick(S,p){const v=cleanNick(p.nick);if(v.length<2)fail('Ник от 2 до 20 символов');S.nick=v;return{msg:'Ник сохранён'}},
  open(S,p,ctx){
    const tier=int(p.tier),t=TIERS[tier];if(!t)fail('Нет такого кейса');
    if(t.event&&!seasonOn(ctx.now))fail('Сезон закончился');
    if(S.box.length>=BOX_CAP)fail('Гараж полон. Продайте номера, чтобы открыть кейс');
    let c=['ru','ua','kz','mix'].includes(p.c)?p.c:'ru';
    if(p.key){if(!(S.keys[t.id]>0))fail('Ключей этого кейса нет');S.keys[t.id]--}
    else{if(S.bal<t.price)fail('Не хватает денег на этот кейс');S.bal-=t.price;S.spent+=t.price}
    if(c==='mix')c=pick(ALL);
    const win=bestOf(c,t.k,t.floor);
    const item=addPlate(S,win.pl,'case',ctx.now);S.opened++;
    addXp(S,t.xp,ctx);quest(S,'open5',1,false,ctx);if(tier>0)quest(S,'gold2',1,false,ctx);
    const rare=RIDX[win.a.rar.k]>=2;if(rare)quest(S,'rare1',1,false,ctx);
    return{id:item.id,pl:item.pl,tier,c,rare,price:item.price};
  },
  quick(S,p,ctx){const pay=sellQuick(S,int(p.id),ctx);if(pay<0)fail('Номер не найден');return{msg:'Скупщик заплатил '+fmt(pay),pay}},
  bulk(S,p,ctx){
    const l=p.k==='cheap'?S.box.filter(x=>!x.pin&&x.price<RARITY[1].min):S.box.filter(x=>!x.pin);
    if(!l.length)fail('Нечего сдавать');let sum=0;l.forEach(x=>{sum+=sellQuick(S,x.id,ctx)});
    return{msg:'Сдано '+l.length+' шт. за '+fmt(sum)};
  },
  pin(S,p){const x=S.box.find(v=>v.id===int(p.id));if(!x)fail('Номер не найден');x.pin=!x.pin;return{}},
  bonus(S,p,ctx){
    if(ctx.now<S.bonusAt)fail('Подработка пока недоступна');
    if(S.bal>=TIERS[0].price)fail('Подработка доступна, когда денег меньше '+fmt(TIERS[0].price));
    S.bal+=BONUS;S.bonusAt=ctx.now+BONUS_CD;return{msg:'+'+fmt(BONUS)+' за подработку'};
  },
  claim(S,p){const r=claimLevel(S,p.t==='p'?'p':'f',int(p.l));if(!r)fail('Награда недоступна');return{msg:'Получено: '+rewardText(r).a}},
  claimAll(S){let n=0;for(let i=1;i<=level(S);i++){if(claimLevel(S,'f',i))n++;if(claimLevel(S,'p',i))n++}if(!n)fail('Нечего забирать');return{msg:'Получено наград: '+n}},
  questClaim(S,p,ctx){
    const q=String(p.id);ensureDaily(S,ctx.now);
    if(!S.daily.q.includes(q)||S.daily.done.includes(q)||num(S.daily.p[q])<QUESTS[q].g)fail('Задание ещё не выполнено');
    S.daily.done.push(q);S.bal+=300;addXp(S,350,ctx);return{msg:'+350 опыта и '+fmt(300)};
  },
  premium(S,p,ctx){
    if(S.premium)fail('Премиум уже открыт');if(!seasonOn(ctx.now))fail('Сезон закончился');
    if(S.gold<SEASON.premium)fail('Не хватает '+gem(SEASON.premium-S.gold));
    S.gold-=SEASON.premium;S.premium=true;return{msg:'Премиум-пропуск открыт. Заберите награды за пройденные уровни'};
  },
  buyKey(S,p,ctx){
    const k=String(p.k),c=GKEY[k];if(!c)fail('Нет такого ключа');if(k==='season'&&!seasonOn(ctx.now))fail('Сезон закончился');
    if(S.gold<c)fail('Не хватает '+gem(c-S.gold));S.gold-=c;S.keys[k]=(S.keys[k]||0)+1;return{msg:'Ключ «'+KEYN[k]+'» в гараже'};
  },
  exch(S,p){const n=int(p.n);if(n!==1&&n!==10)fail('Неверный обмен');if(S.gold<10*n)fail('Не хватает голды');S.gold-=10*n;S.bal+=500*n;return{msg:'+'+fmt(500*n)}},
  car(S,p){
    const id=String(p.id),c=CARS[id];if(!c)fail('Нет такого цвета');
    if(S.cars.includes(id)){S.car=id;return{}}
    if(!c.cost)fail('Этот цвет даёт сезонный пропуск: '+(CAR_SRC[id]||''));
    if(S.gold<c.cost)fail('Не хватает '+gem(c.cost-S.gold));
    S.gold-=c.cost;S.cars.push(id);S.car=id;return{msg:'Цвет «'+c.n+'» куплен'};
  },
  stuntStart(S,p,ctx){const id=Math.random().toString(36).slice(2,10);S.run={id,t:ctx.now};return{run:id}},
  stuntEnd(S,p,ctx){
    if(!S.run||S.run.id!==String(p.run))fail('Заезд не найден, начните новый');
    const el=(ctx.now-S.run.t)/1000;S.run=null;
    if(el<1.5)fail('Слишком короткий заезд');
    const score=Math.max(0,Math.min(int(p.score),Math.floor(el*1600),90000));
    const flips=Math.max(0,Math.min(int(p.flips),Math.floor(el)));
    const d=mskDate(ctx.now);if(S.stunt.d!==d){S.stunt.d=d;S.stunt.earned=0;S.stunt.runs=0}
    const money=Math.max(0,Math.min(STUNT_CAP-S.stunt.earned,Math.round(score/20)));
    S.bal+=money;S.stunt.earned+=money;S.stunt.runs++;
    const xp=addXp(S,Math.min(250,Math.round(score/60)),ctx);
    const rec=score>S.stunt.best&&score>0;if(rec)S.stunt.best=score;
    S.stats.flips+=flips;
    quest(S,'runs3',1,false,ctx);if(flips)quest(S,'flips5',flips,false,ctx);quest(S,'stunt10k',score,true,ctx);
    return{money,xp,rec,score,capped:STUNT_CAP-S.stunt.earned<=0};
  },
  reset(S){
    const keep={gold:S.gold,premium:S.premium,xp:S.xp,cf:S.cf,cp:S.cp,cars:S.cars,car:S.car,nick:S.nick,daily:S.daily,stunt:S.stunt,inbox:S.inbox,gifts:S.gifts,rd:S.rd,welcome:''};
    const n=Object.assign(fresh(),keep);n.keys.season=0;
    for(const k in S)delete S[k];Object.assign(S,n);
    return{msg:'Гараж и баланс сброшены. Голда и сезон сохранены'};
  },
  // ----- админ: себе -----
  admRub(S,p,ctx){needAdm(ctx);const n=int(p.n);if(!(n>0&&n<=1e9))fail('Введите сумму до 1 000 000 000');S.bal+=n;return{msg:'+'+fmt(n)}},
  admGold(S,p,ctx){needAdm(ctx);const n=int(p.n);if(!(n>0&&n<=1e6))fail('Введите от 1 до 1 000 000');S.gold+=n;return{msg:'+'+gem(n)}},
  admKey(S,p,ctx){needAdm(ctx);const k=String(p.k),n=int(p.n);if(!KEYN[k]||!(n>=1&&n<=1000))fail('От 1 до 1000 ключей');S.keys[k]=(S.keys[k]||0)+n;return{msg:'Ключ «'+KEYN[k]+'» ×'+n}},
  admLvl(S,p,ctx){needAdm(ctx);const L=Math.max(0,Math.min(30,int(p.l)));S.xp=L*SEASON.lvlXp;return{msg:'Уровень пропуска: '+L}},
  admPrem(S,p,ctx){needAdm(ctx);S.premium=!S.premium;return{msg:S.premium?'Премиум включён':'Премиум выключен'}},
  admPlate(S,p,ctx){needAdm(ctx);const pl=parsePlateInput(String(p.c),p.text);if(!pl)fail('Проверьте номер');addPlate(S,pl,'admin',ctx.now);return{msg:'Номер '+plateText(pl)+' в гараже'}}
};
function needAdm(ctx){if(!ctx.admin)fail('Только для администратора')}
function act(S,a,p,ctx){
  if(!Object.prototype.hasOwnProperty.call(ACTIONS,a))fail('Неизвестное действие');
  ctx.notes=ctx.notes||[];ctx.now=ctx.now||Date.now();
  const r=ACTIONS[a](S,p&&typeof p==='object'?p:{},ctx)||{};
  r.notes=ctx.notes;return r;
}
// ==/LOGIC==

return{RU_LET,UA_LET,KZ_LET,RULES3,RULES4,LRULES,BASE,RARITY,RIDX,TIERS,REG,RMAP,genPlate,appraise,bestOf,cleanPlate,rarityOf,pick,rnd,ALL,BOX_CAP,BONUS,BONUS_CD,BUYBACK,FEE,MAX_LIST,STUNT_CAP,MIN_ASK,MAX_ASK,SEASON,CARS,CAR_SRC,KEYN,PACKS,GKEY,FREE,PREM,QUESTS,num,fmtN,fmt,gem,hashStr,mskDate,cleanNick,cleanText,plateText,toLat,parsePlateInput,fresh,normalize,seasonOn,level,lvlPct,worth,addXp,ensureDaily,quest,questReady,claimable,rewardText,addPlate,grant,claimLevel,inbox,sellQuick,GameError,ACTIONS,act};
});
