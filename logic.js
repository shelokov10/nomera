/* Vybivanie nomerov 2.0: shared game logic */
(function(root){
root.L=(function(){
'use strict';
// ==CORE== \u041d\u043e\u043c\u0435\u0440\u0430 2.0: \u0433\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u044f, \u043e\u0446\u0435\u043d\u043a\u0430, \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b, \u0438\u0437\u043d\u043e\u0441, \u043f\u0430\u0442\u0442\u0435\u0440\u043d\u044b, \u0442\u043e\u043b\u0449\u0438\u043d\u0430 \u0448\u0440\u0438\u0444\u0442\u0430.
let RNG=Math.random;
const rnd=n=>Math.floor(RNG()*n);
const pick=a=>a[rnd(a.length)];
function seeded(seed){let s=(seed>>>0)||1;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
function withRng(seed,fn){const old=RNG;RNG=seeded(seed);try{return fn()}finally{RNG=old}}
const seq=d=>{const a=[...d].map(Number);return a.length>1&&(a.every((v,i)=>i===0||v===a[i-1]+1)||a.every((v,i)=>i===0||v===a[i-1]-1))};
const same=d=>d.length>1&&[...d].every(ch=>ch===d[0]);
const wpick=l=>{let t=0;for(const x of l)t+=x[3];let r=RNG()*t;for(const x of l){r-=x[3];if(r<0)return x}return l[l.length-1]};
const wIdx=w=>{let t=0;for(const x of w)t+=x;let r=RNG()*t;for(let i=0;i<w.length;i++){r-=w[i];if(r<0)return i}return w.length-1};

const RU_LET='\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425'.split('');
const UA_LET='ABCEHIKMOPTX'.split('');
const KZ_LET='ABCDEFGHKLMNOPRSTUVXYZ'.split('');
const US_LET='ABCDEFGHJKLMNPRSTUVWXYZ'.split('');
const DE_LET='ABCDEFGHIJKLMNOPRSTUVWXYZ'.split('');
const FR_LET='ABCDEFGHJKLMNPQRSTVWXYZ'.split('');
const ES_LET='BCDFGHJKLMNPRSTVWXYZ'.split('');
const AE_LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const COUNTRY={
  ru:{n:'\u0420\u043e\u0441\u0441\u0438\u044f',sh:'\u0420\u0424'},ua:{n:'\u0423\u043a\u0440\u0430\u0438\u043d\u0430',sh:'UA'},kz:{n:'\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d',sh:'KZ'},
  us:{n:'\u0421\u0428\u0410',sh:'USA'},eu:{n:'\u0415\u0432\u0440\u043e\u0441\u043e\u044e\u0437',sh:'EU'},ae:{n:'\u0414\u0443\u0431\u0430\u0439',sh:'Dubai'},sp:{n:'\u041e\u0441\u043e\u0431\u044b\u0439',sh:'\u041e\u0441\u043e\u0431\u044b\u0439'}
};
const COUNTRIES=['ru','ua','kz','us','eu','ae'];

// [\u043a\u043e\u0434, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c, \u0432\u0435\u0441]
const RU_TOP=[['777','\u041c\u043e\u0441\u043a\u0432\u0430',3.5,.5],['977','\u041c\u043e\u0441\u043a\u0432\u0430',2.8,.5],['797','\u041c\u043e\u0441\u043a\u0432\u0430',2.6,.5],['799','\u041c\u043e\u0441\u043a\u0432\u0430',2.6,.5],['199','\u041c\u043e\u0441\u043a\u0432\u0430',2.1,.7],['99','\u041c\u043e\u0441\u043a\u0432\u0430',2.3,.7],['97','\u041c\u043e\u0441\u043a\u0432\u0430',2.2,.7],['197','\u041c\u043e\u0441\u043a\u0432\u0430',2,.7],['177','\u041c\u043e\u0441\u043a\u0432\u0430',2,.7],['77','\u041c\u043e\u0441\u043a\u0432\u0430',2.4,1],['178','\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433',1.7,.6],['98','\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433',1.7,.6],['78','\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433',1.8,.9],['750','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,.5],['790','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.3,.5],['150','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.3,.6],['190','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.3,.6],['50','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,.9],['90','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,.9],['123','\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439',1.3,.5],['93','\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439',1.3,.6],['23','\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439',1.3,.9]];
const RU_PLAIN=[['01','\u0410\u0434\u044b\u0433\u0435\u044f'],['02','\u0411\u0430\u0448\u043a\u043e\u0440\u0442\u043e\u0441\u0442\u0430\u043d'],['03','\u0411\u0443\u0440\u044f\u0442\u0438\u044f'],['04','\u0410\u043b\u0442\u0430\u0439'],['05','\u0414\u0430\u0433\u0435\u0441\u0442\u0430\u043d'],['06','\u0418\u043d\u0433\u0443\u0448\u0435\u0442\u0438\u044f'],['07','\u041a\u0430\u0431\u0430\u0440\u0434\u0438\u043d\u043e-\u0411\u0430\u043b\u043a\u0430\u0440\u0438\u044f'],['08','\u041a\u0430\u043b\u043c\u044b\u043a\u0438\u044f'],['09','\u041a\u0430\u0440\u0430\u0447\u0430\u0435\u0432\u043e-\u0427\u0435\u0440\u043a\u0435\u0441\u0438\u044f'],['10','\u041a\u0430\u0440\u0435\u043b\u0438\u044f'],['11','\u041a\u043e\u043c\u0438'],['12','\u041c\u0430\u0440\u0438\u0439 \u042d\u043b'],['13','\u041c\u043e\u0440\u0434\u043e\u0432\u0438\u044f'],['14','\u042f\u043a\u0443\u0442\u0438\u044f'],['15','\u0421\u0435\u0432\u0435\u0440\u043d\u0430\u044f \u041e\u0441\u0435\u0442\u0438\u044f'],['16','\u0422\u0430\u0442\u0430\u0440\u0441\u0442\u0430\u043d'],['17','\u0422\u044b\u0432\u0430'],['18','\u0423\u0434\u043c\u0443\u0440\u0442\u0438\u044f'],['19','\u0425\u0430\u043a\u0430\u0441\u0438\u044f'],['21','\u0427\u0443\u0432\u0430\u0448\u0438\u044f'],['22','\u0410\u043b\u0442\u0430\u0439\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['24','\u041a\u0440\u0430\u0441\u043d\u043e\u044f\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['25','\u041f\u0440\u0438\u043c\u043e\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['26','\u0421\u0442\u0430\u0432\u0440\u043e\u043f\u043e\u043b\u044c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['27','\u0425\u0430\u0431\u0430\u0440\u043e\u0432\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['28','\u0410\u043c\u0443\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['29','\u0410\u0440\u0445\u0430\u043d\u0433\u0435\u043b\u044c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['30','\u0410\u0441\u0442\u0440\u0430\u0445\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['31','\u0411\u0435\u043b\u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['32','\u0411\u0440\u044f\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['33','\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['34','\u0412\u043e\u043b\u0433\u043e\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['35','\u0412\u043e\u043b\u043e\u0433\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['36','\u0412\u043e\u0440\u043e\u043d\u0435\u0436\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['37','\u0418\u0432\u0430\u043d\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['38','\u0418\u0440\u043a\u0443\u0442\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['39','\u041a\u0430\u043b\u0438\u043d\u0438\u043d\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['40','\u041a\u0430\u043b\u0443\u0436\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['41','\u041a\u0430\u043c\u0447\u0430\u0442\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['42','\u041a\u0435\u043c\u0435\u0440\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['43','\u041a\u0438\u0440\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['44','\u041a\u043e\u0441\u0442\u0440\u043e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['45','\u041a\u0443\u0440\u0433\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['46','\u041a\u0443\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['47','\u041b\u0435\u043d\u0438\u043d\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['48','\u041b\u0438\u043f\u0435\u0446\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['49','\u041c\u0430\u0433\u0430\u0434\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['51','\u041c\u0443\u0440\u043c\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['52','\u041d\u0438\u0436\u0435\u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['53','\u041d\u043e\u0432\u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['54','\u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['55','\u041e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['56','\u041e\u0440\u0435\u043d\u0431\u0443\u0440\u0433\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['57','\u041e\u0440\u043b\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['58','\u041f\u0435\u043d\u0437\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['59','\u041f\u0435\u0440\u043c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['60','\u041f\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['61','\u0420\u043e\u0441\u0442\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['62','\u0420\u044f\u0437\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['63','\u0421\u0430\u043c\u0430\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['64','\u0421\u0430\u0440\u0430\u0442\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['65','\u0421\u0430\u0445\u0430\u043b\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['66','\u0421\u0432\u0435\u0440\u0434\u043b\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['67','\u0421\u043c\u043e\u043b\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['68','\u0422\u0430\u043c\u0431\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['69','\u0422\u0432\u0435\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['70','\u0422\u043e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['71','\u0422\u0443\u043b\u044c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['72','\u0422\u044e\u043c\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['73','\u0423\u043b\u044c\u044f\u043d\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['74','\u0427\u0435\u043b\u044f\u0431\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['75','\u0417\u0430\u0431\u0430\u0439\u043a\u0430\u043b\u044c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['76','\u042f\u0440\u043e\u0441\u043b\u0430\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['79','\u0415\u0432\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u0410\u041e'],['86','\u0425\u0430\u043d\u0442\u044b-\u041c\u0430\u043d\u0441\u0438\u0439\u0441\u043a\u0438\u0439 \u0410\u041e'],['89','\u042f\u043c\u0430\u043b\u043e-\u041d\u0435\u043d\u0435\u0446\u043a\u0438\u0439 \u0410\u041e'],['95','\u0427\u0435\u0447\u043d\u044f']];
const UA_REG=[['AA','\u041a\u0438\u0435\u0432',2.5,1.5],['KA','\u041a\u0438\u0435\u0432',2.2,1.2],['BH','\u041e\u0434\u0435\u0441\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.5,1],['AX','\u0425\u0430\u0440\u044c\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,1],['BC','\u041b\u044c\u0432\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,1],['AI','\u041a\u0438\u0435\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,1],['AE','\u0414\u043d\u0435\u043f\u0440\u043e\u043f\u0435\u0442\u0440\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.3,1],['AB','\u0412\u0438\u043d\u043d\u0438\u0446\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AC','\u0412\u043e\u043b\u044b\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AM','\u0416\u0438\u0442\u043e\u043c\u0438\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AO','\u0417\u0430\u043a\u0430\u0440\u043f\u0430\u0442\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AP','\u0417\u0430\u043f\u043e\u0440\u043e\u0436\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AT','\u0418\u0432\u0430\u043d\u043e-\u0424\u0440\u0430\u043d\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BA','\u041a\u0438\u0440\u043e\u0432\u043e\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BE','\u041d\u0438\u043a\u043e\u043b\u0430\u0435\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BI','\u041f\u043e\u043b\u0442\u0430\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BK','\u0420\u043e\u0432\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BM','\u0421\u0443\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BO','\u0422\u0435\u0440\u043d\u043e\u043f\u043e\u043b\u044c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BT','\u0425\u0435\u0440\u0441\u043e\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BX','\u0425\u043c\u0435\u043b\u044c\u043d\u0438\u0446\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['CA','\u0427\u0435\u0440\u043a\u0430\u0441\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['CB','\u0427\u0435\u0440\u043d\u0438\u0433\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['CE','\u0427\u0435\u0440\u043d\u043e\u0432\u0438\u0446\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1]];
const KZ_REG=[['01','\u0410\u0441\u0442\u0430\u043d\u0430',2.2,1.3],['02','\u0410\u043b\u043c\u0430\u0442\u044b',2,1.3],['17','\u0428\u044b\u043c\u043a\u0435\u043d\u0442',1.4,.9],['03','\u0410\u043a\u043c\u043e\u043b\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['04','\u0410\u043a\u0442\u044e\u0431\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['05','\u0410\u043b\u043c\u0430\u0442\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['06','\u0410\u0442\u044b\u0440\u0430\u0443\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['07','\u0417\u0430\u043f\u0430\u0434\u043d\u043e-\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['08','\u0416\u0430\u043c\u0431\u044b\u043b\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['09','\u041a\u0430\u0440\u0430\u0433\u0430\u043d\u0434\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['10','\u041a\u043e\u0441\u0442\u0430\u043d\u0430\u0439\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['11','\u041a\u044b\u0437\u044b\u043b\u043e\u0440\u0434\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['12','\u041c\u0430\u043d\u0433\u0438\u0441\u0442\u0430\u0443\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['13','\u0422\u0443\u0440\u043a\u0435\u0441\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['14','\u041f\u0430\u0432\u043b\u043e\u0434\u0430\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['15','\u0421\u0435\u0432\u0435\u0440\u043e-\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['16','\u0412\u043e\u0441\u0442\u043e\u0447\u043d\u043e-\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['18','\u043e\u0431\u043b\u0430\u0441\u0442\u044c \u0410\u0431\u0430\u0439',1,1],['19','\u043e\u0431\u043b\u0430\u0441\u0442\u044c \u0416\u0435\u0442\u044b\u0441\u0443',1,1],['20','\u043e\u0431\u043b\u0430\u0441\u0442\u044c \u0423\u043b\u044b\u0442\u0430\u0443',1,1]];
// \u0428\u0442\u0430\u0442\u044b \u0421\u0428\u0410: [\u043a\u043e\u0434, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c, \u0432\u0435\u0441, \u0446\u0432\u0435\u0442 \u043d\u0430\u0434\u043f\u0438\u0441\u0438, \u0444\u043e\u043d]
const US_REG=[['NV','Nevada',1.5,.8],['CA','California',1.4,1.4],['NY','New York',1.4,1.2],['FL','Florida',1.3,1.1],['HI','Hawaii',1.3,.5],['TX','Texas',1.2,1.2],['IL','Illinois',1,1],['WA','Washington',1,1],['AZ','Arizona',1,1],['NJ','New Jersey',1,1],['MI','Michigan',1,1],['GA','Georgia',1,1]];
const US_LOOK={NV:['#0b3d91','linear-gradient(180deg,#bfe3ff 0%,#fff 55%,#ffe7b8 100%)'],CA:['#c8102e','#fff'],NY:['#0b3d91','linear-gradient(180deg,#fff 0 78%,#0b3d91 78%)'],FL:['#f47b20','#fff'],HI:['#1b6f2c','linear-gradient(180deg,#fff 0%,#e8f6ff 100%)'],TX:['#111','#fff'],IL:['#c8102e','#fff'],WA:['#1d4f91','linear-gradient(180deg,#e9f1fb 0%,#fff 60%)'],AZ:['#9a2a12','linear-gradient(180deg,#fff 0 70%,#f5c999 100%)'],NJ:['#111','#fff6d0'],MI:['#0b3d91','#fff'],GA:['#111','#fff']};
// \u0415\u0432\u0440\u043e\u043f\u0430: \u0441\u0442\u0440\u0430\u043d\u044b
const EU_REG=[['D','\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f',1.2,1.3],['F','\u0424\u0440\u0430\u043d\u0446\u0438\u044f',1,1],['I','\u0418\u0442\u0430\u043b\u0438\u044f',1.1,1],['E','\u0418\u0441\u043f\u0430\u043d\u0438\u044f',1,1]];
// \u041d\u0435\u043c\u0435\u0446\u043a\u0438\u0435 \u0433\u043e\u0440\u043e\u0434\u0430: [\u043a\u043e\u0434, \u0433\u043e\u0440\u043e\u0434, \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c, \u0432\u0435\u0441]
const DE_CITY=[['B','\u0411\u0435\u0440\u043b\u0438\u043d',1.6,1.2],['M','\u041c\u044e\u043d\u0445\u0435\u043d',1.5,1.1],['HH','\u0413\u0430\u043c\u0431\u0443\u0440\u0433',1.4,1],['F','\u0424\u0440\u0430\u043d\u043a\u0444\u0443\u0440\u0442',1.3,.9],['S','\u0428\u0442\u0443\u0442\u0433\u0430\u0440\u0442',1.3,.9],['K','\u041a\u0451\u043b\u044c\u043d',1.2,1],['D','\u0414\u044e\u0441\u0441\u0435\u043b\u044c\u0434\u043e\u0440\u0444',1.1,.9],['DO','\u0414\u043e\u0440\u0442\u043c\u0443\u043d\u0434',1,.8],['E','\u042d\u0441\u0441\u0435\u043d',1,.8],['L','\u041b\u0435\u0439\u043f\u0446\u0438\u0433',1,.8],['DD','\u0414\u0440\u0435\u0437\u0434\u0435\u043d',1,.8],['H','\u0413\u0430\u043d\u043d\u043e\u0432\u0435\u0440',1,.8],['N','\u041d\u044e\u0440\u043d\u0431\u0435\u0440\u0433',1,.8],['HB','\u0411\u0440\u0435\u043c\u0435\u043d',1,.7],['KA','\u041a\u0430\u0440\u043b\u0441\u0440\u0443\u044d',1,.6],['WOB','\u0412\u043e\u043b\u044c\u0444\u0441\u0431\u0443\u0440\u0433',1.1,.5]];
const AE_REG=[['DXB','\u0414\u0443\u0431\u0430\u0439',1,1]];
const topCodes=new Set(RU_TOP.map(r=>r[0]));
const RU_REG=RU_TOP.concat(RU_PLAIN.filter(r=>!topCodes.has(r[0])).map(r=>[r[0],r[1],1,1]));
const REG={ru:RU_REG,ua:UA_REG,kz:KZ_REG,us:US_REG,eu:EU_REG,ae:AE_REG};
const RMAP={};for(const c in REG){RMAP[c]={};REG[c].forEach(r=>{RMAP[c][r[0]]=r})}
const DEMAP={};DE_CITY.forEach(r=>{DEMAP[r[0]]=r});

const digitsStr=(n,noLead)=>{let s;do{s='';for(let i=0;i<n;i++)s+=(i===0&&noLead)?1+rnd(9):rnd(10)}while(/^0+$/.test(s));return s};
const letters=(set,n)=>{let s='';for(let i=0;i<n;i++)s+=pick(set);return s};

/* ---------- \u043f\u0440\u0430\u0432\u0438\u043b\u0430 \u0446\u0438\u0444\u0440 ---------- */
const RULES3=[
 {t:'\u0422\u0440\u0438 \u0441\u0435\u043c\u0451\u0440\u043a\u0438',m:60,f:d=>d==='777'},
 {t:'\u0422\u0440\u0438 \u0432\u043e\u0441\u044c\u043c\u0451\u0440\u043a\u0438',m:40,f:d=>d==='888'},
 {t:'\u0422\u0440\u0438 \u0434\u0435\u0432\u044f\u0442\u043a\u0438',m:30,f:d=>d==='999'},
 {t:'\u0422\u0440\u0438 \u0435\u0434\u0438\u043d\u0438\u0446\u044b',m:30,f:d=>d==='111'},
 {t:'\u0422\u0440\u0438 \u0448\u0435\u0441\u0442\u0451\u0440\u043a\u0438',m:24,f:d=>d==='666'},
 {t:'\u0410\u0433\u0435\u043d\u0442 007',m:24,f:d=>d==='007'},
 {t:'\u0422\u0440\u0438 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435',m:20,f:same},
 {t:'\u041c\u0430\u043b\u044b\u0439 \u043d\u043e\u043c\u0435\u0440',m:14,f:d=>/^00\d$/.test(d)},
 {t:'\u041b\u0435\u0441\u0435\u043d\u043a\u0430',m:10,f:seq},
 {t:'\u041a\u0440\u0443\u0433\u043b\u0430\u044f \u0441\u043e\u0442\u043d\u044f',m:8,f:d=>/^\d00$/.test(d)},
 {t:'\u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u044b\u0439',m:4,f:d=>d[0]===d[2]},
 {t:'\u041f\u0430\u0440\u0430',m:1.8,f:d=>d[0]===d[1]||d[1]===d[2]}
];
const RULES4=[
 {t:'\u041d\u043e\u043c\u0435\u0440 \u043e\u0434\u0438\u043d',m:90,f:d=>d==='0001'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u0441\u0435\u043c\u0451\u0440\u043a\u0438',m:80,f:d=>d==='7777'},
 {t:'\u0410\u0433\u0435\u043d\u0442 007',m:70,f:d=>d==='0007'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u0432\u043e\u0441\u044c\u043c\u0451\u0440\u043a\u0438',m:60,f:d=>d==='8888'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u0434\u0435\u0432\u044f\u0442\u043a\u0438',m:50,f:d=>d==='9999'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u0435\u0434\u0438\u043d\u0438\u0446\u044b',m:45,f:d=>d==='1111'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435',m:40,f:same},
 {t:'\u041c\u0430\u043b\u044b\u0439 \u043d\u043e\u043c\u0435\u0440',m:28,f:d=>/^000\d$/.test(d)},
 {t:'\u041b\u0435\u0441\u0435\u043d\u043a\u0430',m:25,f:seq},
 {t:'\u0422\u0440\u0438 \u0441\u0435\u043c\u0451\u0440\u043a\u0438',m:14,f:d=>d.includes('777')},
 {t:'\u041a\u0440\u0443\u0433\u043b\u0430\u044f \u0442\u044b\u0441\u044f\u0447\u0430',m:12,f:d=>/^\d000$/.test(d)},
 {t:'\u0414\u0432\u0435 \u043f\u0430\u0440\u044b',m:8,f:d=>/^(\d)\1(\d)\2$/.test(d)},
 {t:'\u041f\u043e\u0432\u0442\u043e\u0440',m:8,f:d=>/^(\d\d)\1$/.test(d)},
 {t:'\u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u044b\u0439',m:7,f:d=>/^(\d)(\d)\2\1$/.test(d)},
 {t:'\u0422\u0440\u043e\u0439\u043a\u0430',m:6,f:d=>/(\d)\1\1/.test(d)},
 {t:'\u041a\u0440\u0443\u0433\u043b\u0430\u044f \u0441\u043e\u0442\u043d\u044f',m:2.5,f:d=>/^\d\d00$/.test(d)},
 {t:'\u041f\u0430\u0440\u0430',m:1.6,f:d=>/(\d)\1/.test(d)}
];
// \u041a\u043e\u0440\u043e\u0442\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430 (\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f, \u0414\u0443\u0431\u0430\u0439): \u0447\u0435\u043c \u043c\u0435\u043d\u044c\u0448\u0435 \u0446\u0438\u0444\u0440, \u0442\u0435\u043c \u0434\u043e\u0440\u043e\u0436\u0435
const RULES_SHORT={
 de:[null,{t:'\u041e\u0434\u043d\u0430 \u0446\u0438\u0444\u0440\u0430',m:20},{t:'\u0414\u0432\u0435 \u0446\u0438\u0444\u0440\u044b',m:5}],
 ae:[null,{t:'\u041e\u0434\u043d\u0430 \u0446\u0438\u0444\u0440\u0430',m:400},{t:'\u0414\u0432\u0435 \u0446\u0438\u0444\u0440\u044b',m:60},{t:'\u0422\u0440\u0438 \u0446\u0438\u0444\u0440\u044b',m:10},{t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u0446\u0438\u0444\u0440\u044b',m:2.2}]
};
const RULES_AE=[
 {t:'\u0412\u0441\u0435 \u0446\u0438\u0444\u0440\u044b \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435',m:12,f:same},
 {t:'\u041b\u0435\u0441\u0435\u043d\u043a\u0430',m:4,f:seq},
 {t:'\u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u044b\u0439',m:2,f:d=>d.length>2&&d===[...d].reverse().join('')},
 {t:'\u041a\u0440\u0443\u0433\u043b\u044b\u0439',m:2,f:d=>d.length>1&&/^\d0+$/.test(d)},
 {t:'\u041f\u0430\u0440\u0430',m:1.3,f:d=>/(\d)\1/.test(d)}
];
const lrun=s=>{const c=[...s].map(x=>x.charCodeAt(0));return c.length>1&&(c.every((v,i)=>i===0||v===c[i-1]+1)||c.every((v,i)=>i===0||v===c[i-1]-1))};
const L3=[
 {t:'\u0422\u0440\u0438 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:4,f:s=>same(s)},
 {t:'\u0410\u043b\u0444\u0430\u0432\u0438\u0442',m:3,f:s=>lrun(s)},
 {t:'\u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:2,f:s=>s[0]===s[2]},
 {t:'\u041f\u0430\u0440\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.4,f:s=>s[0]===s[1]||s[1]===s[2]}
];
// \u0411\u043b\u0430\u0442\u043d\u044b\u0435 \u0441\u0435\u0440\u0438\u0438 \u0420\u0424: \u0431\u0443\u043a\u0432\u044b \u043d\u043e\u043c\u0435\u0440\u0430 \u0446\u0435\u043b\u0438\u043a\u043e\u043c (\u043f\u0435\u0440\u0432\u0430\u044f + \u0434\u0432\u0435 \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435)
const SERIES_RU={'\u0415\u041a\u0425':[6,'\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f \u00ab\u0415\u041a\u0425\u00bb'],'\u0410\u041c\u0420':[5,'\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f \u00ab\u0410\u041c\u0420\u00bb'],'\u041c\u041c\u0420':[3.5,'\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f \u00ab\u041c\u041c\u0420\u00bb'],'\u0412\u041e\u0420':[3,'\u0421\u0435\u0440\u0438\u044f \u00ab\u0412\u041e\u0420\u00bb'],'\u041a\u041c\u0420':[3,'\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f \u00ab\u041a\u041c\u0420\u00bb'],'\u041e\u041e\u041e':[4,'\u0421\u0435\u0440\u0438\u044f \u00ab\u041e\u041e\u041e\u00bb'],'\u0425\u041a\u0425':[3,'\u0421\u0435\u0440\u0438\u044f \u00ab\u0425\u041a\u0425\u00bb'],'\u0421\u0410\u0421':[2.5,'\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f \u00ab\u0421\u0410\u0421\u00bb'],'\u0410\u041e\u041e':[2.5,'\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f \u00ab\u0410\u041e\u041e\u00bb'],'\u0422\u041c\u0420':[2.5,'\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f \u00ab\u0422\u041c\u0420\u00bb']};
const LRULES={
 ru:[
  {t:'\u041e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:4,f:p=>p.p===p.s[0]&&p.s[0]===p.s[1]},
  {t:'\u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.6,f:p=>p.p===p.s[1]},
  {t:'\u041f\u0430\u0440\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.5,f:p=>p.s[0]===p.s[1]}
 ],
 ua:[
  {t:'\u0421\u0435\u0440\u0438\u044f \u043a\u0430\u043a \u0440\u0435\u0433\u0438\u043e\u043d',m:3,f:p=>p.p===p.s},
  {t:'\u041f\u0430\u0440\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.5,f:p=>p.s[0]===p.s[1]}
 ]
};
const BASE={ru:100,ua:123,kz:99,us:127,eu:97,ae:33,sp:1};

/* ---------- \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b, \u0438\u0437\u043d\u043e\u0441, \u0448\u0440\u0438\u0444\u0442 ---------- */
const MATS=[
 {k:'paper',n:'\u0411\u0443\u043c\u0430\u0436\u043d\u044b\u0439',m:1,c:'#8e8e93'},
 {k:'glitter',n:'\u0421 \u0431\u043b\u0451\u0441\u0442\u043a\u0430\u043c\u0438',m:2.5,c:'#40c8e0'},
 {k:'holo',n:'\u0413\u043e\u043b\u043e\u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043a\u0438\u0439',m:6,c:'#bf5af2'},
 {k:'metal',n:'\u041c\u0435\u0442\u0430\u043b\u043b\u0438\u0447\u0435\u0441\u043a\u0438\u0439',m:15,c:'#0a84ff'},
 {k:'gold',n:'\u0417\u043e\u043b\u043e\u0442\u043e\u0439',m:40,c:'#ffd60a'}
];
const WEARS=[
 {k:'FN',n:'\u041f\u0440\u044f\u043c\u043e \u0441 \u0437\u0430\u0432\u043e\u0434\u0430',min:0,max:.07,m:1.35,w:8},
 {k:'MW',n:'\u041d\u0435\u043c\u043d\u043e\u0433\u043e \u043f\u043e\u043d\u043e\u0448\u0435\u043d\u043d\u044b\u0439',min:.07,max:.15,m:1.15,w:22},
 {k:'FT',n:'\u041f\u043e\u0441\u043b\u0435 \u043f\u043e\u043b\u0435\u0432\u044b\u0445 \u0438\u0441\u043f\u044b\u0442\u0430\u043d\u0438\u0439',min:.15,max:.38,m:1,w:40},
 {k:'WW',n:'\u041f\u043e\u043d\u043e\u0448\u0435\u043d\u043d\u044b\u0439',min:.38,max:.45,m:.9,w:10},
 {k:'BS',n:'\u0417\u0430\u043a\u0430\u043b\u0451\u043d\u043d\u044b\u0439 \u0432 \u0431\u043e\u044f\u0445',min:.45,max:1,m:.8,w:20}
];
const FONTS=[
 {k:'thin',n:'\u0422\u043e\u043d\u043a\u0438\u0439',m:.9,wt:300,w:25},
 {k:'normal',n:'\u041e\u0431\u044b\u0447\u043d\u044b\u0439',m:1,wt:500,w:50},
 {k:'bold',n:'\u0416\u0438\u0440\u043d\u044b\u0439',m:1.2,wt:700,w:20},
 {k:'black',n:'\u0421\u0432\u0435\u0440\u0445\u0436\u0438\u0440\u043d\u044b\u0439',m:1.6,wt:800,w:5}
];
const wearOf=f=>{for(const w of WEARS)if(f<w.max)return w;return WEARS[4]};
function floatMult(f){let m=wearOf(f).m;if(f<.001)m*=5;else if(f<.01)m*=2;return m}
const BUILTIN_PAT={0:['\u041d\u0443\u043b\u0435\u0432\u043e\u0439',1.5],1000:['\u0422\u044b\u0441\u044f\u0447\u043d\u044b\u0439',1.5],7:['\u0421\u0435\u043c\u0451\u0440\u043a\u0430',1.3],77:['\u0414\u0432\u0435 \u0441\u0435\u043c\u0451\u0440\u043a\u0438',1.3],777:['\u0422\u0440\u0438 \u0441\u0435\u043c\u0451\u0440\u043a\u0438',1.6],666:['\u0414\u044c\u044f\u0432\u043e\u043b\u044c\u0441\u043a\u0438\u0439',1.3]};

/* ---------- \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430: \u0440\u0443\u0447\u043d\u044b\u0435 \u0446\u0435\u043d\u044b, \u0441\u0435\u0440\u0438\u0438, \u0440\u0435\u0434\u043a\u0438\u0435 \u043f\u0430\u0442\u0442\u0435\u0440\u043d\u044b ---------- */
let OV={plates:{},series:{},pats:[]};
function setOv(o){
  const x=o&&typeof o==='object'?o:{};
  OV={plates:x.plates&&typeof x.plates==='object'?x.plates:{},series:x.series&&typeof x.series==='object'?x.series:{},pats:Array.isArray(x.pats)?x.pats:[]};
  APC.clear();
}
const getOv=()=>OV;
function patInfo(m,pt){
  for(const p of OV.pats)if(p&&+p.pt===pt&&(p.m==null||+p.m===-1||+p.m===m))return{n:String(p.n||'\u0420\u0435\u0434\u043a\u0438\u0439 \u043f\u0430\u0442\u0442\u0435\u0440\u043d'),m:Math.max(.1,+p.mult||1),rare:true};
  const b=BUILTIN_PAT[pt];return b?{n:b[0],m:b[1],rare:true}:{n:'',m:1,rare:false};
}

/* ---------- \u0433\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u044f ---------- */
function genPlate(c,boost){
  if(c==='ru')return{c,p:pick(RU_LET),d:digitsStr(3),s:letters(RU_LET,2),r:wpick(RU_REG)[0]};
  if(c==='ua')return{c,p:wpick(UA_REG)[0],d:digitsStr(4),s:letters(UA_LET,2),r:''};
  if(c==='kz')return{c,p:'',d:digitsStr(3),s:letters(KZ_LET,3),r:wpick(KZ_REG)[0]};
  if(c==='us')return{c,p:'',d:digitsStr(4),s:letters(US_LET,3),r:wpick(US_REG)[0]};
  if(c==='eu'){
    const r=wpick(EU_REG)[0];
    if(r==='D'){const n=[1,2,3,4][wIdx([2,8,20,70])];return{c,p:wpick(DE_CITY)[0],d:digitsStr(n,true),s:letters(DE_LET,RNG()<.35?1:2),r}}
    if(r==='E')return{c,p:'',d:digitsStr(4),s:letters(ES_LET,3),r};
    return{c,p:letters(FR_LET,2),d:digitsStr(3),s:letters(FR_LET,2),r};
  }
  if(c==='ae'){const b=boost||1;const n=[1,2,3,4,5][wIdx([.3*b*b*b*b,1.7*b*b*b,6*b*b,22*b,70])];return{c,p:RNG()<.12?letters(AE_LET,2):pick(AE_LET),d:digitsStr(n,true),s:'',r:'DXB'}}
  return genPlate('ru');
}
function plateKey(pl){return pl.c==='sp'?'sp:'+pl.t:pl.c+':'+pl.p+'|'+pl.d+'|'+pl.s+'|'+pl.r}
function plateText(pl){
  if(!pl)return'';
  switch(pl.c){
    case'ru':return pl.p+pl.d+pl.s+' '+pl.r;
    case'ua':return pl.p+' '+pl.d+' '+pl.s;
    case'kz':return pl.d+' '+pl.s+' '+pl.r;
    case'us':return pl.s+' '+pl.d+' '+pl.r;
    case'eu':return pl.r==='D'?pl.p+' '+pl.s+' '+pl.d:pl.r==='E'?pl.d+' '+pl.s:pl.r==='F'?pl.p+'-'+pl.d+'-'+pl.s:pl.p+' '+pl.d+' '+pl.s;
    case'ae':return pl.p+' '+pl.d+' Dubai';
    case'sp':return pl.t;
  }
  return'';
}
const niceRound=p=>{const s=p<1000?10:p<10000?50:p<100000?500:p<1e6?1000:10000;return Math.max(10,Math.round(p/s)*s)};

/* ---------- \u043e\u0446\u0435\u043d\u043a\u0430 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u044f (\u0431\u0435\u0437 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0430 \u0438 \u0438\u0437\u043d\u043e\u0441\u0430) ---------- */
function comboOf(pl){
  const one={t:'\u041e\u0431\u044b\u0447\u043d\u044b\u0435 \u0446\u0438\u0444\u0440\u044b',m:1};
  let dr=one,lr={t:'\u041e\u0431\u044b\u0447\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1},rg=[pl.r,'',1,1],extra=null;
  const c=pl.c;
  if(c==='sp'){return{price:Math.max(1,Math.round(+pl.b||1)),parts:[{k:'\u041d\u043e\u043c\u0435\u0440',v:pl.t,t:'\u041e\u0441\u043e\u0431\u044b\u0439 \u043d\u043e\u043c\u0435\u0440',m:1}]}}
  if(c==='ru'){
    dr=RULES3.find(r=>r.f(pl.d))||one;
    const ser=OV.series[pl.p+pl.s]||SERIES_RU[pl.p+pl.s];
    lr=ser?{t:ser[1]||'\u0411\u043b\u0430\u0442\u043d\u0430\u044f \u0441\u0435\u0440\u0438\u044f',m:+ser[0]||1}:(LRULES.ru.find(r=>r.f(pl))||lr);
    rg=RMAP.ru[pl.r]||rg;
  }else if(c==='ua'){dr=RULES4.find(r=>r.f(pl.d))||one;lr=LRULES.ua.find(r=>r.f(pl))||lr;rg=RMAP.ua[pl.p]||rg}
  else if(c==='kz'){dr=RULES3.find(r=>r.f(pl.d))||one;lr=L3.find(r=>r.f(pl.s))||lr;rg=RMAP.kz[pl.r]||rg}
  else if(c==='us'){dr=RULES4.find(r=>r.f(pl.d))||one;lr=L3.find(r=>r.f(pl.s))||lr;rg=RMAP.us[pl.r]||rg}
  else if(c==='eu'){
    rg=RMAP.eu[pl.r]||rg;
    if(pl.r==='D'){
      const n=pl.d.length;dr=n<3?RULES_SHORT.de[n]:n===3?(RULES3.find(r=>r.f(pl.d))||{t:'\u0422\u0440\u0438 \u0446\u0438\u0444\u0440\u044b',m:1.5}):(RULES4.find(r=>r.f(pl.d))||one);
      lr=pl.s.length===1?{t:'\u041e\u0434\u043d\u0430 \u0431\u0443\u043a\u0432\u0430',m:1.5}:pl.s[0]===pl.s[1]?{t:'\u041f\u0430\u0440\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.4}:lr;
      const city=DEMAP[pl.p];if(city)extra={k:'\u0413\u043e\u0440\u043e\u0434',v:pl.p,t:city[1],m:city[2]};
    }else if(pl.r==='E'){dr=RULES4.find(r=>r.f(pl.d))||one;lr=L3.find(r=>r.f(pl.s))||lr}
    else{dr=RULES3.find(r=>r.f(pl.d))||one;lr=pl.p===pl.s?{t:'\u0411\u0443\u043a\u0432\u044b \u0441\u043e\u0432\u043f\u0430\u0434\u0430\u044e\u0442',m:3}:(same(pl.p)||same(pl.s))?{t:'\u041f\u0430\u0440\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.5}:lr}
  }else if(c==='ae'){
    const n=pl.d.length;const sh=RULES_SHORT.ae[n];const pr=RULES_AE.find(r=>r.f(pl.d));
    dr=sh&&pr?{t:sh.t+', '+pr.t.toLowerCase(),m:sh.m*pr.m}:sh||pr||one;
    lr=pl.p.length===1?{t:'\u041e\u0434\u043d\u0430 \u0431\u0443\u043a\u0432\u0430',m:1.3}:pl.p[0]===pl.p[1]?{t:'\u041f\u0430\u0440\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.4}:{t:'\u0414\u0432\u0435 \u0431\u0443\u043a\u0432\u044b',m:1};
  }
  const base=BASE[c]||150;
  let mult=dr.m*lr.m*rg[2]*(extra?extra.m:1);
  let price=base*mult,manual=false;
  const k=plateKey(pl);
  if(OV.plates[k]>0){price=+OV.plates[k];manual=true}
  const lv=c==='ae'?pl.p:c==='ru'?pl.p+pl.s:c==='ua'?pl.s:c==='eu'&&pl.r==='D'?pl.s:pl.s||pl.p;
  const rv=c==='ua'?pl.p:c==='eu'?pl.r:pl.r;
  const parts=[{k:'\u0426\u0438\u0444\u0440\u044b',v:pl.d,t:dr.t,m:dr.m},{k:'\u0411\u0443\u043a\u0432\u044b',v:lv,t:lr.t,m:lr.m},{k:c==='eu'?'\u0421\u0442\u0440\u0430\u043d\u0430':c==='us'?'\u0428\u0442\u0430\u0442':'\u0420\u0435\u0433\u0438\u043e\u043d',v:rv,t:rg[1]||rv,m:rg[2]}];
  if(extra)parts.push(extra);
  if(manual)parts.push({k:'\u0426\u0435\u043d\u0430',v:'',t:'\u041d\u0430\u0437\u043d\u0430\u0447\u0435\u043d\u0430 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0435\u0439',m:1});
  return{price,parts};
}

/* ---------- \u043f\u043e\u043b\u043d\u0430\u044f \u043e\u0446\u0435\u043d\u043a\u0430 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u0430-\u043d\u043e\u043c\u0435\u0440\u0430 ---------- */
const APC=new Map();
function appraise(it){
  // it: {pl,m,f,pt,w}
  const key=plateKey(it.pl)+'#'+it.m+'#'+it.f+'#'+it.pt+'#'+it.w;
  const hit=APC.get(key);if(hit)return hit;
  const cb=comboOf(it.pl);
  const mat=MATS[it.m]||MATS[0],wear=wearOf(it.f),font=FONTS[it.w]||FONTS[1],pat=patInfo(it.m|0,it.pt|0);
  const fm=floatMult(it.f);
  const price=niceRound(cb.price*mat.m*fm*font.m*pat.m);
  const r={price,combo:Math.round(cb.price),parts:cb.parts,mat,wear,font,pat,fm};
  if(APC.size>4000)APC.clear();APC.set(key,r);return r;
}
function rollItem(pl,matW){
  const m=wIdx(matW||MAT_W);
  const wi=wIdx(WEARS.map(w=>w.w));const w=WEARS[wi];
  let f=w.min+RNG()*(w.max-w.min);
  f=Math.round(f*1e6)/1e6;
  return{pl,m,f,pt:rnd(1001),w:wIdx(FONTS.map(x=>x.w))};
}
const MAT_W=[79.92,15.98,3.2,.64,.26];
const AE_B=[1.18,1.18];

/* ---------- \u043a\u0435\u0439\u0441\u044b \u0441 \u043d\u043e\u043c\u0435\u0440\u0430\u043c\u0438 ---------- */
const TIERS=[
 {id:'std',name:'\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442',k:1,price:500,keys:1,xp:40,mw:[79.92,15.98,3.2,.64,.26],ae:1,desc:'\u041e\u0434\u0438\u043d \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440'},
 {id:'gold',name:'\u0417\u043e\u043b\u043e\u0442\u043e\u0439',k:1,price:1000,keys:2,xp:80,mw:[62.666,23.181,8.588,3.177,2.388],ae:1,desc:'\u0420\u0435\u0434\u043a\u0438\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0432\u044b\u043f\u0430\u0434\u0430\u044e\u0442 \u0432 2\u20139 \u0440\u0430\u0437 \u0447\u0430\u0449\u0435'},
 {id:'elite',name:'\u042d\u043b\u0438\u0442\u043d\u044b\u0439',k:2,price:2000,keys:4,xp:160,mw:[54.729,24.622,11.094,4.992,4.563],ae:AE_B[0],desc:'\u041b\u0443\u0447\u0448\u0435\u0435 \u0438\u0437 \u0434\u0432\u0443\u0445 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u0439, \u043c\u0435\u0442\u0430\u043b\u043b \u0438 \u0437\u043e\u043b\u043e\u0442\u043e \u0447\u0430\u0449\u0435'},
 {id:'season',name:'\u0421\u0435\u0437\u043e\u043d\u043d\u044b\u0439',k:2,price:3500,keys:7,xp:250,event:true,mw:[0,58.174,23.881,9.791,8.154],ae:AE_B[1],desc:'\u041b\u0443\u0447\u0448\u0435\u0435 \u0438\u0437 \u0434\u0432\u0443\u0445 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u0439, \u0431\u0435\u0437 \u0431\u0443\u043c\u0430\u0436\u043d\u044b\u0445. \u0422\u043e\u043b\u044c\u043a\u043e \u0432 \u0441\u0435\u0437\u043e\u043d\u0435'}
];
function caseRoll(c,tier){
  const t=TIERS[tier];let best=null;const k=c==='ae'?1:t.k;
  for(let i=0;i<k;i++){const pl=genPlate(c,c==='ae'?t.ae:1);const cp=comboOf(pl).price;if(!best||cp>best.cp)best={pl,cp}}
  return rollItem(best.pl,t.mw);
}

/* ---------- \u0432\u0432\u043e\u0434 \u043d\u043e\u043c\u0435\u0440\u0430 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u043e\u043c ---------- */
const LAT={'\u0410':'A','\u0412':'B','\u0415':'E','\u041a':'K','\u041c':'M','\u041d':'H','\u041e':'O','\u0420':'P','\u0421':'C','\u0422':'T','\u0423':'Y','\u0425':'X'};
const CYR={A:'\u0410',B:'\u0412',E:'\u0415',K:'\u041a',M:'\u041c',H:'\u041d',O:'\u041e',P:'\u0420',C:'\u0421',T:'\u0422',Y:'\u0423',X:'\u0425'};
const toLat=s=>String(s).toUpperCase().replace(/[\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425]/g,c=>LAT[c]).replace(/[^A-Z0-9]/g,'');
const has=(set,s)=>[...s].every(x=>set.includes(x));
function cleanPlate(o){
  if(!o||typeof o!=='object')return null;
  const c=String(o.c||''),p=String(o.p||''),d=String(o.d||''),s=String(o.s||''),r=String(o.r||'');
  if(c==='sp'){const t=String(o.t||'').replace(/[^0-9A-Z\u0410-\u042f\u0401\- ]/gi,'').toUpperCase().trim().slice(0,12);const b=Math.round(+o.b||0);return t&&b>0&&b<=1e10?{c,t,b}:null}
  if(!/^\d+$/.test(d)||/^0+$/.test(d))return null;
  if(c==='ru'){if(RU_LET.includes(p)&&d.length===3&&s.length===2&&has(RU_LET,s)&&RMAP.ru[r])return{c,p,d,s,r}}
  else if(c==='ua'){if(RMAP.ua[p]&&d.length===4&&s.length===2&&has(UA_LET,s)&&r==='')return{c,p,d,s,r:''}}
  else if(c==='kz'){if(p===''&&d.length===3&&s.length===3&&has(KZ_LET,s)&&RMAP.kz[r])return{c,p:'',d,s,r}}
  else if(c==='us'){if(p===''&&d.length===4&&s.length===3&&has(US_LET,s)&&RMAP.us[r])return{c,p:'',d,s,r}}
  else if(c==='eu'){
    if(r==='D'&&DEMAP[p]&&d.length>=1&&d.length<=4&&d[0]!=='0'&&s.length>=1&&s.length<=2&&has(DE_LET,s))return{c,p,d,s,r};
    if(r==='E'&&p===''&&d.length===4&&s.length===3&&has(ES_LET,s))return{c,p:'',d,s,r};
    if((r==='F'||r==='I')&&p.length===2&&has(FR_LET,p)&&d.length===3&&s.length===2&&has(FR_LET,s))return{c,p,d,s,r};
  }
  else if(c==='ae'){if((p.length===1||p.length===2)&&has(AE_LET,p)&&d.length>=1&&d.length<=5&&d[0]!=='0'&&s===''&&r==='DXB')return{c,p,d,s:'',r}}
  return null;
}
function cleanItemFields(x){
  const m=Math.max(0,Math.min(4,Math.floor(+x.m||0)));
  let f=+x.f;if(!(f>=0&&f<=1))f=.25;f=Math.round(f*1e6)/1e6;
  const pt=Math.max(0,Math.min(1000,Math.floor(+x.pt||0)));
  const w=Math.max(0,Math.min(3,Math.floor(x.w==null?1:+x.w)));
  return{m,f,pt,w};
}
function parsePlateInput(c,str){
  let s=String(str||'').toUpperCase().replace(/[\s\-\u00b7.]+/g,'');
  if(c==='ru'){s=s.replace(/[ABEKMHOPCTYX]/g,ch=>CYR[ch]);const m=s.match(/^([\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425])(\d{3})([\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425]{2})(\d{2,3})$/);return m?cleanPlate({c,p:m[1],d:m[2],s:m[3],r:m[4]}):null}
  s=toLat(s);
  if(c==='ua'){const m=s.match(/^([A-Z]{2})(\d{4})([A-Z]{2})$/);return m?cleanPlate({c,p:m[1],d:m[2],s:m[3],r:''}):null}
  if(c==='kz'){const m=s.match(/^(\d{3})([A-Z]{3})(\d{2})$/);return m?cleanPlate({c:'kz',p:'',d:m[1],s:m[2],r:m[3]}):null}
  if(c==='us'){const m=s.match(/^([A-Z]{3})(\d{4})([A-Z]{2})$/);return m?cleanPlate({c,p:'',d:m[2],s:m[1],r:m[3]}):null}
  if(c==='ae'){const m=s.match(/^([A-Z]{1,2})(\d{1,5})(DUBAI)?$/);return m?cleanPlate({c,p:m[1],d:m[2],s:'',r:'DXB'}):null}
  if(c==='eu'){
    // \u0444\u043e\u0440\u043c\u0430\u0442 \u0432\u0432\u043e\u0434\u0430: \u0441\u0442\u0440\u0430\u043d\u0430 \u043f\u0435\u0440\u0432\u043e\u0439 \u0431\u0443\u043a\u0432\u043e\u0439: D M AB 1234 / F AB123CD / I AB123CD / E 1234BCD
    let m=s.match(/^E(\d{4})([A-Z]{3})$/);if(m)return cleanPlate({c,p:'',d:m[1],s:m[2],r:'E'});
    m=s.match(/^([FI])([A-Z]{2})(\d{3})([A-Z]{2})$/);if(m)return cleanPlate({c,p:m[2],d:m[3],s:m[4],r:m[1]});
    const raw=String(str||'').toUpperCase().trim().split(/[\s\-]+/);
    if(raw[0]==='D'&&raw.length===4)return cleanPlate({c,p:raw[1],s:raw[2],d:raw[3],r:'D'});
    return null;
  }
  return null;
}
// ==/CORE==

// ==LOGIC== \u041e\u0431\u0449\u0430\u044f \u043b\u043e\u0433\u0438\u043a\u0430 \u0438\u0433\u0440\u044b 2.0: \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u0438 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435.
const BOX_CAP=250,INV_CAP=300,BUYBACK=.85,FEE=.05,MAX_LIST=12,MIN_ASK=10,MAX_ASK=1e9,START_BAL=5000;
const KEY_GOLD=10;               // 1 \u043a\u043b\u044e\u0447 = 10 \u0433\u043e\u043b\u0434\u044b, \u0432 \u043e\u0431\u0435 \u0441\u0442\u043e\u0440\u043e\u043d\u044b
const GAME_CAP=30000,GAME_WIN=12*3600e3,KEY_EVERY=3000;
const PREM_DAYS=40,PREM_GOLD=5000;
const SEASON={name:'\u042d\u043c\u043e\u0446\u0438\u0438 \u043b\u0443\u0447\u0448\u0435 \u041f\u041a',end:Date.parse('2026-12-31T23:59:59+03:00'),lvlXp:1000,max:100};
const WEEK_XP=5000;
const BANK={rate:.01,maxDays:30,cap:1000000,maxN:3,pen:.05};
const TOTE={rub:50000,gold:500,perDay:30,margin:1.06};
const CLICK={sec:60,cps:10,pay:2};

/* ---------- \u043a\u043e\u0441\u043c\u0435\u0442\u0438\u043a\u0430 ---------- */
// \u0421\u043a\u0438\u043d\u044b \u043c\u0430\u0448\u0438\u043d \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u043e\u0432. r: 0 \u043e\u0431\u044b\u0447\u043d\u044b\u0439, 1 \u043d\u0435\u043e\u0431\u044b\u0447\u043d\u044b\u0439, 2 \u0440\u0435\u0434\u043a\u0438\u0439, 3 \u044d\u043f\u0438\u0447\u0435\u0441\u043a\u0438\u0439, 4 \u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439; v: \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u044c \u0432 \u0433\u043e\u043b\u0434\u0435
const SKINS={
  'car:sedan':{n:'\u0421\u0435\u0434\u0430\u043d',v:0,r:0,free:true},
  'car:hatch':{n:'\u0425\u044d\u0442\u0447\u0431\u0435\u043a',v:35,r:0},'car:pickup':{n:'\u041f\u0438\u043a\u0430\u043f',v:35,r:0},'car:wagon':{n:'\u0423\u043d\u0438\u0432\u0435\u0440\u0441\u0430\u043b',v:35,r:0},'car:van':{n:'\u0424\u0443\u0440\u0433\u043e\u043d',v:35,r:0},
  'car:coupe':{n:'\u041a\u0443\u043f\u0435',v:75,r:1},'car:buggy':{n:'\u0411\u0430\u0433\u0433\u0438',v:75,r:1},
  'car:retro':{n:'\u0420\u0435\u0442\u0440\u043e',v:180,r:2},'car:muscle':{n:'\u041c\u0430\u0441\u043b\u043a\u0430\u0440',v:180,r:2},
  'car:sport':{n:'\u0421\u043f\u043e\u0440\u0442\u043a\u0430\u0440',v:450,r:3},
  'car:emo':{n:'\u00ab\u042d\u043c\u043e\u0446\u0438\u0438\u00bb',v:1500,r:4,season:true},
  'bike:std':{n:'\u041f\u0438\u0442\u0431\u0430\u0439\u043a',v:0,r:0,free:true},
  'bike:mini':{n:'\u041c\u0438\u043d\u0438',v:35,r:0},'bike:cross':{n:'\u041a\u0440\u043e\u0441\u0441',v:35,r:0},
  'bike:enduro':{n:'\u042d\u043d\u0434\u0443\u0440\u043e',v:75,r:1},
  'bike:moto':{n:'\u0421\u0443\u043f\u0435\u0440\u043c\u043e\u0442\u043e',v:180,r:2},
  'bike:chopper':{n:'\u0427\u043e\u043f\u043f\u0435\u0440',v:450,r:3},
  'bike:emo':{n:'\u00ab\u042d\u043c\u043e\u0446\u0438\u0438\u00bb',v:1500,r:4,season:true}
};
const STICKERS={
  bolt:{n:'\u041c\u043e\u043b\u043d\u0438\u044f',v:40,r:0},flame:{n:'\u041f\u043b\u0430\u043c\u044f',v:40,r:0},star:{n:'\u0417\u0432\u0435\u0437\u0434\u0430',v:40,r:0},check:{n:'\u0428\u0430\u0448\u043a\u0438',v:40,r:0},heart:{n:'\u0421\u0435\u0440\u0434\u0446\u0435',v:40,r:0},
  one:{n:'\u041d\u043e\u043c\u0435\u0440 \u043e\u0434\u0438\u043d',v:100,r:1},clover:{n:'\u041a\u043b\u0435\u0432\u0435\u0440',v:100,r:1},wing:{n:'\u041a\u0440\u044b\u043b\u044c\u044f',v:100,r:1},
  crown:{n:'\u041a\u043e\u0440\u043e\u043d\u0430',v:300,r:2},rocket:{n:'\u0420\u0430\u043a\u0435\u0442\u0430',v:300,r:2},
  gem:{n:'\u0411\u0440\u0438\u043b\u043b\u0438\u0430\u043d\u0442',v:1000,r:3}
};
const SKIN_R=[{n:'\u041e\u0431\u044b\u0447\u043d\u044b\u0439',c:'#8e8e93',w:70},{n:'\u041d\u0435\u043e\u0431\u044b\u0447\u043d\u044b\u0439',c:'#30d158',w:22},{n:'\u0420\u0435\u0434\u043a\u0438\u0439',c:'#0a84ff',w:6.5},{n:'\u042d\u043f\u0438\u0447\u0435\u0441\u043a\u0438\u0439',c:'#bf5af2',w:1.5},{n:'\u0423\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439',c:'#ff9f0a',w:0}];
const STK_R=[{n:'\u041e\u0431\u044b\u0447\u043d\u0430\u044f',c:'#8e8e93',w:70},{n:'\u0420\u0435\u0434\u043a\u0430\u044f',c:'#0a84ff',w:22},{n:'\u042d\u043f\u0438\u0447\u0435\u0441\u043a\u0430\u044f',c:'#bf5af2',w:6.5},{n:'\u041b\u0435\u0433\u0435\u043d\u0434\u0430\u0440\u043d\u0430\u044f',c:'#ffd60a',w:1.5}];
const SKIN_CASE={gold:70,keys:7},STICKER_CASE={gold:100};
// \u041a\u0440\u0430\u0441\u043a\u0430: \u0434\u0432\u0430 \u0446\u0432\u0435\u0442\u0430, \u043a\u0430\u043a \u0432 Geometry Dash
const COLORS={
  white:{n:'\u0411\u0435\u043b\u044b\u0439',c:'#f5f5f7',cost:0},black:{n:'\u0427\u0451\u0440\u043d\u044b\u0439',c:'#1c1c1e',cost:0},orange:{n:'\u041e\u0440\u0430\u043d\u0436\u0435\u0432\u044b\u0439',c:'#ff7a1a',cost:0},grey:{n:'\u0421\u0435\u0440\u044b\u0439',c:'#8e8e93',cost:0},
  red:{n:'\u041a\u0440\u0430\u0441\u043d\u044b\u0439',c:'#ff3b30',cost:60},blue:{n:'\u0421\u0438\u043d\u0438\u0439',c:'#0a84ff',cost:60},green:{n:'\u0417\u0435\u043b\u0451\u043d\u044b\u0439',c:'#30d158',cost:60},yellow:{n:'\u0416\u0451\u043b\u0442\u044b\u0439',c:'#ffd60a',cost:60},
  sky:{n:'\u0413\u043e\u043b\u0443\u0431\u043e\u0439',c:'#64d2ff',cost:60},purple:{n:'\u0424\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439',c:'#bf5af2',cost:70},pink:{n:'\u0420\u043e\u0437\u043e\u0432\u044b\u0439',c:'#ff375f',cost:70},mint:{n:'\u041c\u044f\u0442\u0430',c:'#63e6be',cost:70},
  teal:{n:'\u0411\u0438\u0440\u044e\u0437\u043e\u0432\u044b\u0439',c:'#40c8e0',cost:70},indigo:{n:'\u0418\u043d\u0434\u0438\u0433\u043e',c:'#5e5ce6',cost:70},brown:{n:'\u041a\u043e\u0440\u0438\u0447\u043d\u0435\u0432\u044b\u0439',c:'#a2845e',cost:70},olive:{n:'\u0425\u0430\u043a\u0438',c:'#7d8b4a',cost:70},
  navy:{n:'\u0422\u0451\u043c\u043d\u043e-\u0441\u0438\u043d\u0438\u0439',c:'#1d3a7a',cost:80},wine:{n:'\u0411\u043e\u0440\u0434\u043e\u0432\u044b\u0439',c:'#8e1b2f',cost:80},lime:{n:'\u041b\u0430\u0439\u043c',c:'#b6f23a',cost:80},sand:{n:'\u041f\u0435\u0441\u043e\u0447\u043d\u044b\u0439',c:'#e3c58f',cost:80},
  neon:{n:'\u041d\u0435\u043e\u043d',c:'#39ff88',cost:90},chrome:{n:'\u0425\u0440\u043e\u043c',c:'#cfd8e3',cost:90},gold:{n:'\u0417\u043e\u043b\u043e\u0442\u043e',c:'#e6b422',cost:90},coral:{n:'\u041a\u043e\u0440\u0430\u043b\u043b',c:'#ff7f6e',cost:90}
};
const WHEELS={std:{n:'\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0435',cost:0},sport:{n:'\u0421\u043f\u043e\u0440\u0442\u0438\u0432\u043d\u044b\u0435',cost:120},off:{n:'\u0412\u043d\u0435\u0434\u043e\u0440\u043e\u0436\u043d\u044b\u0435',cost:120},chrome:{n:'\u0425\u0440\u043e\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435',cost:180},neon:{n:'\u041d\u0435\u043e\u043d\u043e\u0432\u044b\u0435',cost:220}};
const KITS={
  car:{none:{n:'\u0411\u0435\u0437 \u043e\u0431\u0432\u0435\u0441\u0430',cost:0},spoiler:{n:'\u0421\u043f\u043e\u0439\u043b\u0435\u0440',cost:150},wide:{n:'\u0428\u0438\u0440\u043e\u043a\u0438\u0439 \u043a\u0443\u0437\u043e\u0432',cost:200},rack:{n:'\u0411\u0430\u0433\u0430\u0436\u043d\u0438\u043a \u043d\u0430 \u043a\u0440\u044b\u0448\u0435',cost:120},lights:{n:'\u041b\u044e\u0441\u0442\u0440\u0430 \u043d\u0430 \u043a\u0440\u044b\u0448\u0443',cost:160}},
  bike:{none:{n:'\u0411\u0435\u0437 \u043e\u0431\u0432\u0435\u0441\u0430',cost:0},exhaust:{n:'\u041f\u0440\u044f\u043c\u043e\u0442\u043e\u043a',cost:120},fender:{n:'\u0412\u044b\u0441\u043e\u043a\u043e\u0435 \u043a\u0440\u044b\u043b\u043e',cost:120},guard:{n:'\u0417\u0430\u0449\u0438\u0442\u0430 \u0440\u0443\u043a',cost:150}}
};
const TITLES={moto:'\u041c\u043e\u0442\u043e\u0431\u0440\u0430\u0442\u0438\u043a',king:'\u041a\u043e\u0440\u043e\u043b\u044c \u0441\u0442\u0430\u043d\u0442\u0430'};
// \u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 \u0434\u0440\u0443\u0433\u0430 (\u043f\u043e \u0441\u0442\u0430\u0442\u0443\u0441\u0443 \u043f\u0440\u0438\u0433\u043b\u0430\u0441\u0438\u0432\u0448\u0435\u0433\u043e): \u0431\u0435\u0437 Plus, \u0437\u0430\u0442\u0435\u043c \u0443\u0440\u043e\u0432\u043d\u0438 Plus. Premium \u0434\u043e\u0431\u0430\u0432\u043b\u044f\u0435\u0442 \u0441\u0432\u0435\u0440\u0445\u0443.
const REF_REW=[{m:10000,g:210},{m:100000,g:2100},{m:300000,g:6250},{m:500000,g:10400},{m:1000000,g:20750},{m:2500000,g:52000}];
const REF_PREM={m:1000000,g:20800},REF_WEEK=7,REF_LVL=3;
const PLUS=[{n:'\u041d\u043e\u0432\u0438\u0447\u043e\u043a',min:1},{n:'\u0412\u043e\u0434\u0438\u0442\u0435\u043b\u044c',min:56},{n:'\u0413\u043e\u043d\u0449\u0438\u043a',min:168},{n:'\u041f\u0438\u043b\u043e\u0442',min:557},{n:'\u041b\u0435\u0433\u0435\u043d\u0434\u0430',min:2779}];
function plusTier(stars){let t=-1;PLUS.forEach((x,i)=>{if(stars>=x.min)t=i});return t}

/* ---------- \u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u043f\u0443\u0441\u043a: 100 \u0443\u0440\u043e\u0432\u043d\u0435\u0439 ---------- */
const SPECIAL={
  emo50:{pl:{c:'sp',t:'\u042d\u041c\u041e\u0426\u0418\u0418',b:12000},m:2,f:.012,pt:50,w:2},
  emo100:{pl:{c:'sp',t:'\u041b\u0423\u0427\u0428\u0415 \u041f\u041a',b:30000},m:4,f:.0009,pt:100,w:3}
};
function buildPass(){
  const F=[null],P=[null];
  for(let i=1;i<=100;i++){
    let f;
    if(i===50)f={plate:'emo50'};else if(i===100)f={skin:'car:emo'};
    else if(i===30)f={g:100};
    else if([10,25,40,60,75,90].includes(i))f={sc:1};
    else if([15,35,55,70,85,95].includes(i))f={tc:1};
    else if(i%5===0)f={g:20+i};
    else f={m:Math.round((800+i*60)/50)*50};
    F.push(f);
    let p;
    if(i===50)p={skin:'bike:emo'};else if(i===100)p={plate:'emo100'};
    else if(i%10===5)p={sc:1};
    else if(i%10===0)p={tc:1};
    else if(i%4===0)p={g:60+i*2};
    else if(i%3===0)p={m:Math.round((2000+i*120)/50)*50};
    else p={g:40+i};
    P.push(p);
  }
  return{F,P};
}
const PASS=buildPass(),FREE=PASS.F,PREM=PASS.P;
const QUESTS={
  open5:{t:'\u041e\u0442\u043a\u0440\u044b\u0442\u044c 5 \u043a\u0435\u0439\u0441\u043e\u0432',g:5},
  gold2:{t:'\u041e\u0442\u043a\u0440\u044b\u0442\u044c 2 \u043a\u0435\u0439\u0441\u0430 \u0434\u043e\u0440\u043e\u0436\u0435 \u00ab\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u0430\u00bb',g:2},
  rare1:{t:'\u0412\u044b\u0431\u0438\u0442\u044c \u043d\u043e\u043c\u0435\u0440 \u0441 \u0431\u043b\u0451\u0441\u0442\u043a\u0430\u043c\u0438 \u0438\u043b\u0438 \u043b\u0443\u0447\u0448\u0435',g:1},
  rider5k:{t:'\u041d\u0430\u0431\u0440\u0430\u0442\u044c 5 000 \u043e\u0447\u043a\u043e\u0432 \u0432 Rider \u0437\u0430 \u0437\u0430\u0435\u0437\u0434',g:5000,max:true},
  stunt3k:{t:'\u041d\u0430\u0431\u0440\u0430\u0442\u044c 3 000 \u043e\u0447\u043a\u043e\u0432 \u0432 \u0421\u0442\u0430\u043d\u0442\u0435 \u0437\u0430 \u0437\u0430\u0435\u0437\u0434',g:3000,max:true},
  runs3:{t:'\u0421\u044b\u0433\u0440\u0430\u0442\u044c 3 \u0437\u0430\u0435\u0437\u0434\u0430',g:3},
  trade1:{t:'\u041a\u0443\u043f\u0438\u0442\u044c \u0438\u043b\u0438 \u043f\u0440\u043e\u0434\u0430\u0442\u044c \u043d\u0430 \u0440\u044b\u043d\u043a\u0435',g:1},
  list2:{t:'\u0412\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c 2 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u0430 \u043d\u0430 \u0440\u044b\u043d\u043e\u043a',g:2},
  quick3:{t:'\u0421\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443 3 \u043d\u043e\u043c\u0435\u0440\u0430',g:3},
  bank1:{t:'\u041f\u043e\u043b\u043e\u0436\u0438\u0442\u044c \u0434\u0435\u043d\u044c\u0433\u0438 \u0432 \u0431\u0430\u043d\u043a',g:1}
};

/* ---------- \u0444\u043e\u0440\u043c\u0430\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 ---------- */
const num=(v,d=0)=>Number.isFinite(+v)?+v:d;
const fmtN=n=>{n=Math.round(Number(n)||0);const s=String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');return(n<0?'\u2212':'')+s};
const fmt=n=>fmtN(n)+' \u20bd';
const gem=n=>fmtN(n)+' \u25c6';
const keyN=n=>{n=Math.abs(Math.round(n));const a=n%10,b=n%100;return fmtN(n)+' '+(a===1&&b!==11?'\u043a\u043b\u044e\u0447':a>=2&&a<=4&&(b<12||b>14)?'\u043a\u043b\u044e\u0447\u0430':'\u043a\u043b\u044e\u0447\u0435\u0439')};
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const MSK=3*3600e3,DAY=864e5,WEEK=7*DAY;
function mskDate(t){return new Date((t||Date.now())+MSK).toISOString().slice(0,10)}
function weekId(t){return Math.floor(((t||Date.now())+MSK-4*DAY)/WEEK)}
function weekEnd(t){return (weekId(t)+1)*WEEK+4*DAY-MSK}
const INVIS=/[\u0000-\u0009\u000b-\u001f\u007f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g;
function cleanNick(s){return String(s==null?'':s).replace(INVIS,'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,20)}
function cleanText(s,n){return String(s==null?'':s).replace(INVIS,'').trim().slice(0,n)}

/* ---------- \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0438\u0433\u0440\u043e\u043a\u0430 ---------- */
function newVeh(k){return k==='car'?{skin:'car:sedan',c1:'orange',c2:'white',wh:'std',kit:'none',st:[],plate:0}:{skin:'bike:std',c1:'orange',c2:'black',wh:'std',kit:'none',st:[],plate:0}}
function fresh(){return{v:20,bal:START_BAL,gold:0,keys:0,box:[],inv:[],nextId:1,opened:0,spent:0,best:null,
  xp:0,prem:0,don:0,cf:[],cp:[],titles:[],title:'',
  daily:{d:'',q:[],p:{},done:[]},week:{w:-1,xp:0,opts:[],got:[]},
  games:{rider:{best:0,t0:0,e:0},stunt:{best:0,t0:0,e:0},acc:0,runs:0},run:null,click:null,
  bank:[],tote:{d:'',n:0,card:null},up:[],shop:{d:'',got:[]},promo:{},free:{sc:0,tc:0},
  veh:{car:newVeh('car'),bike:newVeh('bike')},colors:['white','black','orange','grey'],wheels:['std'],kits:['none'],
  author:null,hint:{ref:0,share:''},cmt:0,nick:'',inbox:[],gifts:[],rd:[],
  stats:{sold:0,bought:0,listed:0,quick:0,flips:0,wheelie:0,up:0,tote:0},welcome:'new'}}

function cleanItem(x){
  if(!x||typeof x!=='object')return null;
  const pl=cleanPlate(x.pl);if(!pl)return null;
  const f=cleanItemFields(x);
  return Object.assign({id:Math.floor(num(x.id)),pl},f,{t:num(x.t,Date.now()),pin:!!x.pin,src:typeof x.src==='string'?x.src.slice(0,12):''});
}
function priceItem(x){x.price=appraise(x).price;return x}
function normalize(o){
  const s=fresh();if(!o||typeof o!=='object')return s;
  s.bal=Math.max(0,Math.round(num(o.bal,START_BAL)));
  s.gold=Math.max(0,Math.floor(num(o.gold)));
  s.keys=Math.max(0,Math.floor(num(o.keys)));
  s.opened=num(o.opened);s.spent=num(o.spent);s.xp=Math.max(0,num(o.xp));
  s.prem=num(o.prem);s.don=Math.max(0,num(o.don));s.welcome=typeof o.welcome==='string'?o.welcome:'';
  const arrN=a=>Array.isArray(a)?a.map(Number).filter(Number.isFinite):[];
  const arrS=a=>Array.isArray(a)?a.filter(x=>typeof x==='string'):[];
  s.cf=arrN(o.cf);s.cp=arrN(o.cp);s.gifts=arrS(o.gifts).slice(-300);s.rd=arrN(o.rd).slice(-20);
  s.titles=arrS(o.titles).filter(t=>TITLES[t]);s.title=s.titles.includes(o.title)?o.title:'';
  s.colors=[...new Set(['white','black','orange','grey'].concat(arrS(o.colors).filter(c=>COLORS[c])))];
  s.wheels=[...new Set(['std'].concat(arrS(o.wheels).filter(c=>WHEELS[c])))];
  s.kits=[...new Set(['none'].concat(arrS(o.kits).filter(c=>KITS.car[c]||KITS.bike[c])))];
  s.nick=cleanNick(o.nick);
  s.inbox=Array.isArray(o.inbox)?o.inbox.filter(x=>x&&typeof x.text==='string').slice(-20):[];
  s.run=o.run&&typeof o.run==='object'?{id:String(o.run.id),g:String(o.run.g),t:num(o.run.t)}:null;
  s.click=o.click&&typeof o.click==='object'?{id:String(o.click.id),t:num(o.click.t)}:null;
  if(o.daily&&typeof o.daily==='object')s.daily={d:String(o.daily.d||''),q:arrS(o.daily.q).filter(q=>QUESTS[q]),p:(o.daily.p&&typeof o.daily.p==='object')?o.daily.p:{},done:arrS(o.daily.done)};
  if(o.week&&typeof o.week==='object')s.week={w:num(o.week.w,-1),xp:num(o.week.xp),opts:Array.isArray(o.week.opts)?o.week.opts.slice(0,4):[],got:arrN(o.week.got).slice(0,2)};
  if(o.games&&typeof o.games==='object'){
    for(const g of ['rider','stunt'])if(o.games[g])s.games[g]={best:num(o.games[g].best),t0:num(o.games[g].t0),e:num(o.games[g].e)};
    s.games.acc=num(o.games.acc);s.games.runs=num(o.games.runs);
  }
  s.bank=Array.isArray(o.bank)?o.bank.filter(b=>b&&b.a>0).map(b=>({id:String(b.id),a:Math.floor(num(b.a)),t:num(b.t),d:Math.max(1,Math.min(30,Math.floor(num(b.d))))})).slice(0,BANK.maxN):[];
  if(o.tote&&typeof o.tote==='object')s.tote={d:String(o.tote.d||''),n:num(o.tote.n),card:o.tote.card&&Array.isArray(o.tote.card.o)?{id:String(o.tote.card.id),o:o.tote.card.o.map(Number).slice(0,6),sk:arrS(o.tote.card.sk).slice(0,6)}:null};
  s.up=Array.isArray(o.up)?o.up.slice(-20):[];
  if(o.shop&&typeof o.shop==='object')s.shop={d:String(o.shop.d||''),got:arrN(o.shop.got)};
  if(o.promo&&typeof o.promo==='object')for(const k in o.promo)s.promo[k]=num(o.promo[k]);
  if(o.free&&typeof o.free==='object')s.free={sc:Math.max(0,num(o.free.sc)),tc:Math.max(0,num(o.free.tc))};
  if(o.author&&typeof o.author==='object'&&o.author.code)s.author={code:String(o.author.code).slice(0,24),until:num(o.author.until)};
  if(o.hint&&typeof o.hint==='object')s.hint={ref:num(o.hint.ref),share:String(o.hint.share||'')};
  if(o.stats&&typeof o.stats==='object')for(const k in s.stats)s.stats[k]=num(o.stats[k]);
  s.cmt=num(o.cmt);
  // \u043d\u043e\u043c\u0435\u0440\u0430
  const seen=new Set();let maxId=0;
  const fix=x=>{let id=Math.floor(num(x.id));if(!id||seen.has(id))x.id=0;else{seen.add(id);x.id=id;if(id>maxId)maxId=id}return x};
  s.box=(Array.isArray(o.box)?o.box:[]).map(cleanItem).filter(Boolean).map(fix).map(priceItem);
  s.inv=(Array.isArray(o.inv)?o.inv:[]).map(x=>{
    if(!x||typeof x!=='object')return null;
    if(x.k==='skin'&&SKINS[x.v]&&!SKINS[x.v].free)return fix({id:x.id,k:'skin',v:x.v,t:num(x.t),src:String(x.src||'').slice(0,12)});
    if(x.k==='sticker'&&STICKERS[x.v])return fix({id:x.id,k:'sticker',v:x.v,t:num(x.t),src:String(x.src||'').slice(0,12)});
    return null;
  }).filter(Boolean);
  s.nextId=Math.max(num(o.nextId,1),maxId+1);
  s.box.forEach(x=>{if(!x.id)x.id=s.nextId++});s.inv.forEach(x=>{if(!x.id)x.id=s.nextId++});
  // \u043c\u0430\u0448\u0438\u043d\u0430 \u0438 \u043f\u0438\u0442\u0431\u0430\u0439\u043a
  if(o.veh&&typeof o.veh==='object')for(const k of ['car','bike']){
    const v=o.veh[k];if(!v||typeof v!=='object')continue;const d=s.veh[k];
    if(typeof v.skin==='string'&&v.skin.startsWith(k+':')&&(SKINS[v.skin]&&(SKINS[v.skin].free||s.inv.some(i=>i.k==='skin'&&i.v===v.skin))))d.skin=v.skin;
    if(s.colors.includes(v.c1))d.c1=v.c1;if(s.colors.includes(v.c2))d.c2=v.c2;
    if(s.wheels.includes(v.wh))d.wh=v.wh;if(s.kits.includes(v.kit)&&KITS[k][v.kit])d.kit=v.kit;
    d.st=arrN(v.st).filter(id=>s.inv.some(i=>i.id===id&&i.k==='sticker')).slice(0,3);
    d.plate=s.box.some(b=>b.id===num(v.plate))?num(v.plate):0;
  }
  if(o.best&&o.best.pl){const b=cleanItem(Object.assign({id:1},o.best));if(b)s.best=priceItem(b)}
  s.box.forEach(x=>{if(!s.best||x.price>s.best.price)s.best=Object.assign({},x)});
  return s;
}

/* ---------- \u0441\u0435\u0437\u043e\u043d \u0438 \u0437\u0430\u0434\u0430\u043d\u0438\u044f ---------- */
const seasonOn=now=>(now||Date.now())<SEASON.end;
const level=S=>Math.min(SEASON.max,Math.floor(S.xp/SEASON.lvlXp));
const lvlPct=S=>level(S)>=SEASON.max?100:Math.round((S.xp%SEASON.lvlXp)/SEASON.lvlXp*100);
const isPrem=(S,now)=>S.prem>(now||Date.now());
const worth=S=>S.box.reduce((s,x)=>s+x.price,0);
function badges(S){const L=level(S);return[10,30,50,100].filter(x=>L>=x)}
function addXp(S,n,ctx){
  n=Math.round(n);if(!seasonOn(ctx.now)||!(n>0))return 0;
  const b=level(S);S.xp+=n;const a=level(S);
  weekTick(S,ctx.now);S.week.xp+=n;
  if(a>b){
    ctx.notes.push('\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430 '+a+'! \u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u0436\u0434\u0451\u0442 \u0432 \u00ab\u0421\u0435\u0437\u043e\u043d\u0435\u00bb');
    if(a>=30&&!S.titles.includes('moto')){S.titles.push('moto');ctx.notes.push('\u041d\u043e\u0432\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435: \u00ab\u041c\u043e\u0442\u043e\u0431\u0440\u0430\u0442\u0438\u043a\u00bb')}
    if(a>=100&&!S.titles.includes('king')){S.titles.push('king');ctx.notes.push('\u041d\u043e\u0432\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435: \u00ab\u041a\u043e\u0440\u043e\u043b\u044c \u0441\u0442\u0430\u043d\u0442\u0430\u00bb')}
    ctx.lvlUp=a;
  }
  return n;
}
function ensureDaily(S,now){
  const d=mskDate(now);if(S.daily.d===d&&S.daily.q.length)return;
  let h=hashStr('q2'+d);const q=[];const p=Object.keys(QUESTS);
  while(q.length<3&&p.length){h=(Math.imul(h,1103515245)+12345)>>>0;q.push(p.splice(h%p.length,1)[0])}
  S.daily={d,q,p:{},done:[]};
}
function quest(S,id,n,isMax,ctx){
  ensureDaily(S,ctx.now);if(!S.daily.q.includes(id))return;
  const g=QUESTS[id].g,cur=num(S.daily.p[id]);
  const nv=Math.min(g,isMax?Math.max(cur,n):cur+n);S.daily.p[id]=nv;
  if(cur<g&&nv>=g)ctx.notes.push('\u0417\u0430\u0434\u0430\u043d\u0438\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e: '+QUESTS[id].t);
}
function questReady(S,now){if(S.daily.d!==mskDate(now))return 0;return S.daily.q.filter(q=>num(S.daily.p[q])>=QUESTS[q].g&&!S.daily.done.includes(q)).length}
function claimable(S,now){const L=level(S);let n=0;for(let i=1;i<=L;i++){if(!S.cf.includes(i))n++;if(isPrem(S,now)&&!S.cp.includes(i))n++}return n}

/* ---------- \u0435\u0436\u0435\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430 ---------- */
function weekOpts(){
  const pool=[()=>({m:(20+rnd(31))*1000}),()=>({g:(10+rnd(21))*10}),()=>({sc:1}),()=>({tc:1}),()=>({m:(30+rnd(41))*1000}),()=>({g:(15+rnd(26))*10})];
  const o=[{k:100}];const used=new Set();
  while(o.length<4){const i=rnd(pool.length);if(used.has(i%4))continue;used.add(i%4);o.push(pool[i]())}
  for(let i=o.length-1;i>0;i--){const j=rnd(i+1);[o[i],o[j]]=[o[j],o[i]]}
  return o;
}
function weekTick(S,now){const w=weekId(now);if(S.week.w!==w)S.week={w,xp:0,opts:weekOpts(),got:[]}}

/* ---------- \u043d\u0430\u0433\u0440\u0430\u0434\u044b ---------- */
function rewardText(r){
  if(!r)return{a:'',b:''};
  if(r.m)return{a:fmt(r.m),b:'\u0440\u0443\u0431\u043b\u0438'};
  if(r.g)return{a:gem(r.g),b:'\u0433\u043e\u043b\u0434\u0430'};
  if(r.k)return{a:keyN(r.k),b:'\u043a\u043b\u044e\u0447\u0438'};
  if(r.sc)return{a:'\u041a\u0435\u0439\u0441 \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438',b:r.sc>1?'\u00d7'+r.sc:'\u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e'};
  if(r.tc)return{a:'\u041a\u0435\u0439\u0441 \u0441 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438',b:r.tc>1?'\u00d7'+r.tc:'\u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e'};
  if(r.skin)return{a:SKINS[r.skin].n,b:r.skin.startsWith('car')?'\u0441\u043a\u0438\u043d \u043c\u0430\u0448\u0438\u043d\u044b':'\u0441\u043a\u0438\u043d \u043f\u0438\u0442\u0431\u0430\u0439\u043a\u0430',skin:r.skin};
  if(r.sticker)return{a:STICKERS[r.sticker].n,b:'\u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430',sticker:r.sticker};
  if(r.plate){const sp=SPECIAL[r.plate];return{a:plateText(sp.pl),b:MATS[sp.m].n+' \u043d\u043e\u043c\u0435\u0440',item:Object.assign({id:0},sp)}}
  if(r.color)return{a:'\u0426\u0432\u0435\u0442 \u00ab'+COLORS[r.color].n+'\u00bb',b:'\u043a\u0440\u0430\u0441\u043a\u0430'};
  return{a:'',b:''};
}
function addPlate(S,it,src,now){
  const item=priceItem({id:S.nextId++,pl:it.pl,m:it.m,f:it.f,pt:it.pt,w:it.w,t:now||Date.now(),pin:false,src:src||''});
  S.box.push(item);if(!S.best||item.price>S.best.price)S.best=Object.assign({},item);
  return item;
}
function addInv(S,k,v,src,now){const it={id:S.nextId++,k,v,t:now||Date.now(),src:src||''};S.inv.push(it);return it}
function grant(S,r,src,now){
  if(!r)return;
  if(r.m)S.bal+=r.m;if(r.g)S.gold+=r.g;if(r.k)S.keys+=r.k;
  if(r.sc)S.free.sc+=r.sc;if(r.tc)S.free.tc+=r.tc;
  if(r.skin&&SKINS[r.skin])addInv(S,'skin',r.skin,src,now);
  if(r.sticker&&STICKERS[r.sticker])addInv(S,'sticker',r.sticker,src,now);
  if(r.color&&COLORS[r.color]&&!S.colors.includes(r.color))S.colors.push(r.color);
  if(r.plate&&SPECIAL[r.plate])addPlate(S,SPECIAL[r.plate],src||'pass',now);
}
function claimLevel(S,trk,i,now){
  if(!(i>=1&&i<=level(S)))return false;
  if(trk==='f'){if(S.cf.includes(i))return false;S.cf.push(i);grant(S,FREE[i],'pass',now);return FREE[i]}
  if(trk==='p'){if(!isPrem(S,now)||S.cp.includes(i))return false;S.cp.push(i);grant(S,PREM[i],'pass',now);return PREM[i]}
  return false;
}
function inbox(S,text,now){S.inbox.push({t:now||Date.now(),text:String(text).slice(0,300)});S.inbox=S.inbox.slice(-20)}
function sellQuick(S,id,ctx){
  const k=S.box.findIndex(x=>x.id===id);if(k<0)return -1;
  const x=S.box[k];if(x.pin)return -2;
  const p=Math.floor(x.price*BUYBACK);S.bal+=p;S.box.splice(k,1);unmount(S,x.id);S.stats.quick++;quest(S,'quick3',1,false,ctx);
  return p;
}
function unmount(S,id){for(const k of ['car','bike']){const v=S.veh[k];if(v.plate===id)v.plate=0;v.st=v.st.filter(x=>x!==id)}}
function plateLocked(S,id){return S.veh.car.plate===id||S.veh.bike.plate===id}

/* ---------- \u043a\u0435\u0439\u0441\u044b \u0441\u043e \u0441\u043a\u0438\u043d\u0430\u043c\u0438 \u0438 \u043d\u0430\u043a\u043b\u0435\u0439\u043a\u0430\u043c\u0438 ---------- */
function rollSkin(){
  const r=wIdx(SKIN_R.map(x=>x.w));const l=Object.keys(SKINS).filter(k=>SKINS[k].r===r&&!SKINS[k].free&&!SKINS[k].season);return pick(l);
}
function rollSticker(){const r=wIdx(STK_R.map(x=>x.w));const l=Object.keys(STICKERS).filter(k=>STICKERS[k].r===r);return pick(l)}

/* ---------- \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b: \u0432\u044b\u043f\u043b\u0430\u0442\u044b \u0438 \u043b\u0438\u043c\u0438\u0442 ---------- */
function gameWin(S,g,now){const w=S.games[g];if(!w.t0||now-w.t0>=GAME_WIN){w.t0=now;w.e=0}return w}
function gameLeft(S,g,now){const w=S.games[g];if(!w.t0||now-w.t0>=GAME_WIN)return GAME_CAP;return Math.max(0,GAME_CAP-w.e)}
function gameReset(S,g,now){const w=S.games[g];return w.t0&&now-w.t0<GAME_WIN?w.t0+GAME_WIN:0}
const RATE={rider:2600,stunt:900};

/* ---------- \u0442\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440 ---------- */
const TOTE_SKINS=['car:sedan','car:hatch','car:coupe','car:muscle','car:sport','car:buggy','car:retro','car:pickup','car:van','car:wagon'];
function toteCard(){
  const w=[];for(let i=0;i<6;i++)w.push(Math.pow(RNG(),1.6)+.05);
  const sw=w.reduce((a,b)=>a+b);let p=w.map(x=>x/sw);
  const lo=1/(20*TOTE.margin),hi=1/(2*TOTE.margin);
  for(let k=0;k<5;k++){p=p.map(x=>Math.max(lo,Math.min(hi,x)));const s=p.reduce((a,b)=>a+b);p=p.map(x=>x/s)}
  const o=p.map(x=>Math.max(2,Math.min(20,Math.floor(10/(x*TOTE.margin))/10)));
  const sk=TOTE_SKINS.slice();for(let i=sk.length-1;i>0;i--){const j=rnd(i+1);[sk[i],sk[j]]=[sk[j],sk[i]]}
  return{id:Math.floor(RNG()*1e9).toString(36),o,sk:sk.slice(0,6)};
}
function toteProbs(o){const inv=o.map(x=>1/x);const s=inv.reduce((a,b)=>a+b);return inv.map(x=>x/s)}

/* ---------- \u0430\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440 \u0438 \u043c\u0430\u0433\u0430\u0437\u0438\u043d \u0434\u043d\u044f: \u043e\u0431\u0449\u0438\u0439 \u043a\u0430\u0442\u0430\u043b\u043e\u0433 \u043d\u0430 \u0434\u0435\u043d\u044c ---------- */
function dayCatalog(d){
  return withRng(hashStr('cat'+d),()=>{
    const plates=[];
    for(let i=0;i<14;i++){const c=COUNTRIES[i%COUNTRIES.length];const it=caseRoll(c,Math.min(3,i%4));it.id=-(i+1);plates.push(priceItem(it))}
    plates.sort((a,b)=>a.price-b.price);
    const shop=[];
    const p1=priceItem(Object.assign(caseRoll(pick(COUNTRIES),2),{id:-101}));
    const p2=priceItem(Object.assign(caseRoll(pick(COUNTRIES),3),{id:-102}));
    shop.push({k:'plate',it:p1,cur:'rub',price:niceRound(p1.price*1.15)});
    shop.push({k:'plate',it:p2,cur:'rub',price:niceRound(p2.price*1.15)});
    const sk=pick(Object.keys(SKINS).filter(k=>!SKINS[k].free&&!SKINS[k].season&&SKINS[k].r>=1));
    shop.push({k:'skin',v:sk,cur:'gold',price:Math.round(SKINS[sk].v*1.2)});
    const st=pick(Object.keys(STICKERS).filter(k=>STICKERS[k].r>=1));
    shop.push({k:'sticker',v:st,cur:'gold',price:Math.round(STICKERS[st].v*1.2)});
    const cl=pick(Object.keys(COLORS).filter(k=>COLORS[k].cost>=80));
    shop.push({k:'color',v:cl,cur:'rub',price:25000});
    return{plates,shop};
  });
}
const UP={edge:.9,maxP:.75,minX:1.2};
function upChance(inV,target){return Math.min(UP.maxP,inV/target*UP.edge)}
function invValue(x){return x.k==='skin'?SKINS[x.v].v:STICKERS[x.v].v}

/* ---------- \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u0438\u0433\u0440\u043e\u043a\u0430 ---------- */
function GameError(msg){const e=new Error(msg);e.game=true;return e}
const fail=msg=>{throw GameError(msg)};
const int=v=>Math.floor(num(v));
const rid=()=>Math.floor(RNG()*36**8).toString(36);
function needGold(S,n){if(S.gold<n)fail('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(n-S.gold))}
function needRub(S,n){if(S.bal<n)fail('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+fmt(n-S.bal))}
function needKeys(S,n){if(S.keys<n)fail('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043a\u043b\u044e\u0447\u0435\u0439: \u043d\u0443\u0436\u043d\u043e '+keyN(n))}
const ACTIONS={
  welcome(S){S.welcome='';return{}},
  inboxSeen(S){S.inbox=[];return{}},
  nick(S,p){const v=cleanNick(p.nick);if(v.length<2)fail('\u041d\u0438\u043a \u043e\u0442 2 \u0434\u043e 20 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432');S.nick=v;return{msg:'\u041d\u0438\u043a \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d'}},
  title(S,p){const t=String(p.t||'');if(t&&!S.titles.includes(t))fail('\u042d\u0442\u043e \u0437\u0432\u0430\u043d\u0438\u0435 \u0435\u0449\u0451 \u043d\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u043e');S.title=t;return{}},
  hint(S,p,ctx){if(p.k==='ref')S.hint.ref=ctx.now+WEEK;if(p.k==='share')S.hint.share=mskDate(ctx.now);return{}},
  open(S,p,ctx){
    const tier=int(p.tier),t=TIERS[tier];if(!t)fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u043a\u0435\u0439\u0441\u0430');
    if(t.event&&!seasonOn(ctx.now))fail('\u0421\u0435\u0437\u043e\u043d \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0441\u044f');
    if(S.box.length>=BOX_CAP)fail('\u0413\u0430\u0440\u0430\u0436 \u043f\u043e\u043b\u043e\u043d. \u041f\u0440\u043e\u0434\u0430\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440\u0430, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0435\u0439\u0441');
    let c=COUNTRIES.includes(p.c)||p.c==='mix'?p.c:'ru';
    if(p.key){needKeys(S,t.keys);S.keys-=t.keys}
    else{needRub(S,t.price);S.bal-=t.price;S.spent+=t.price}
    if(c==='mix')c=pick(COUNTRIES);
    const it=caseRoll(c,tier);
    const item=addPlate(S,it,'case',ctx.now);S.opened++;
    addXp(S,t.xp,ctx);quest(S,'open5',1,false,ctx);if(tier>0)quest(S,'gold2',1,false,ctx);
    if(item.m>=1)quest(S,'rare1',1,false,ctx);
    const rare=item.m>=2||item.price>=25000;
    return{item,tier,c,rare};
  },
  quick(S,p,ctx){const pay=sellQuick(S,int(p.id),ctx);if(pay===-1)fail('\u041d\u043e\u043c\u0435\u0440 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');if(pay===-2)fail('\u041d\u043e\u043c\u0435\u0440 \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d. \u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0434\u0430\u0442\u044c');return{msg:'\u0421\u043a\u0443\u043f\u0449\u0438\u043a \u0437\u0430\u043f\u043b\u0430\u0442\u0438\u043b '+fmt(pay),pay}},
  bulk(S,p,ctx){
    const l=S.box.filter(x=>!x.pin&&!plateLocked(S,x.id)&&(p.k==='all'||(p.k==='paper'?x.m===0:x.price<1000)));
    if(!l.length)fail('\u041d\u0435\u0447\u0435\u0433\u043e \u0441\u0434\u0430\u0432\u0430\u0442\u044c');let sum=0;l.forEach(x=>{sum+=Math.max(0,sellQuick(S,x.id,ctx))});
    return{msg:'\u0421\u0434\u0430\u043d\u043e '+l.length+' \u0448\u0442. \u0437\u0430 '+fmt(sum)};
  },
  pin(S,p){const x=S.box.find(v=>v.id===int(p.id));if(!x)fail('\u041d\u043e\u043c\u0435\u0440 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');x.pin=!x.pin;return{}},
  claim(S,p,ctx){const r=claimLevel(S,p.t==='p'?'p':'f',int(p.l),ctx.now);if(!r)fail('\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430');return{msg:'\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043e: '+rewardText(r).a}},
  claimAll(S,p,ctx){let n=0;for(let i=1;i<=level(S);i++){if(claimLevel(S,'f',i,ctx.now))n++;if(claimLevel(S,'p',i,ctx.now))n++}if(!n)fail('\u041d\u0435\u0447\u0435\u0433\u043e \u0437\u0430\u0431\u0438\u0440\u0430\u0442\u044c');return{msg:'\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043e \u043d\u0430\u0433\u0440\u0430\u0434: '+n}},
  questClaim(S,p,ctx){
    const q=String(p.id);ensureDaily(S,ctx.now);
    if(!S.daily.q.includes(q)||S.daily.done.includes(q)||num(S.daily.p[q])<QUESTS[q].g)fail('\u0417\u0430\u0434\u0430\u043d\u0438\u0435 \u0435\u0449\u0451 \u043d\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e');
    S.daily.done.push(q);S.bal+=300;addXp(S,350,ctx);return{msg:'+350 \u043e\u043f\u044b\u0442\u0430 \u0438 '+fmt(300)};
  },
  weekPick(S,p,ctx){
    weekTick(S,ctx.now);const i=int(p.i);
    if(S.week.xp<WEEK_XP)fail('\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f, \u043a\u043e\u0433\u0434\u0430 \u0448\u043a\u0430\u043b\u0430 \u043d\u0435\u0434\u0435\u043b\u0438 \u0437\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0441\u044f');
    if(S.week.got.length>=2)fail('\u0412\u044b \u0443\u0436\u0435 \u0437\u0430\u0431\u0440\u0430\u043b\u0438 \u043d\u0430\u0433\u0440\u0430\u0434\u0443 \u044d\u0442\u043e\u0439 \u043d\u0435\u0434\u0435\u043b\u0438');
    if(!(i>=0&&i<S.week.opts.length)||S.week.got.includes(i))fail('\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u0443\u044e \u043d\u0430\u0433\u0440\u0430\u0434\u0443');
    S.week.got.push(i);grant(S,S.week.opts[i],'week',ctx.now);
    return{msg:'\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043e: '+rewardText(S.week.opts[i]).a};
  },
  buyPrem(S,p,ctx){
    needGold(S,PREM_GOLD);S.gold-=PREM_GOLD;S.prem=Math.max(S.prem,ctx.now)+PREM_DAYS*DAY;
    return{msg:'Premium \u0430\u043a\u0442\u0438\u0432\u0435\u043d \u043d\u0430 '+PREM_DAYS+' \u0434\u043d\u0435\u0439'};
  },
  k2g(S,p){const n=int(p.n);if(!(n>=1&&n<=100000))fail('\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u043a\u043b\u044e\u0447\u0435\u0439');needKeys(S,n);S.keys-=n;S.gold+=n*KEY_GOLD;return{msg:keyN(n)+' \u2192 '+gem(n*KEY_GOLD)}},
  g2k(S,p){const n=int(p.n);if(!(n>=1&&n<=100000))fail('\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u043a\u043b\u044e\u0447\u0435\u0439');needGold(S,n*KEY_GOLD);S.gold-=n*KEY_GOLD;S.keys+=n;return{msg:gem(n*KEY_GOLD)+' \u2192 '+keyN(n)}},
  // ----- \u043a\u043e\u0441\u043c\u0435\u0442\u0438\u043a\u0430 -----
  buyColor(S,p){const id=String(p.id),c=COLORS[id];if(!c)fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u0446\u0432\u0435\u0442\u0430');if(S.colors.includes(id))fail('\u0426\u0432\u0435\u0442 \u0443\u0436\u0435 \u043a\u0443\u043f\u043b\u0435\u043d');needGold(S,c.cost);S.gold-=c.cost;S.colors.push(id);return{msg:'\u0426\u0432\u0435\u0442 \u00ab'+c.n+'\u00bb \u043a\u0443\u043f\u043b\u0435\u043d'}},
  buyWheel(S,p){const id=String(p.id),c=WHEELS[id];if(!c)fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u0438\u0445 \u043a\u043e\u043b\u0451\u0441');if(S.wheels.includes(id))fail('\u0423\u0436\u0435 \u043a\u0443\u043f\u043b\u0435\u043d\u043e');needGold(S,c.cost);S.gold-=c.cost;S.wheels.push(id);return{msg:c.n+' \u043a\u043e\u043b\u0451\u0441\u0430 \u043a\u0443\u043f\u043b\u0435\u043d\u044b'}},
  buyKit(S,p){const v=p.v==='bike'?'bike':'car',id=String(p.id),c=KITS[v][id];if(!c)fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u043e\u0431\u0432\u0435\u0441\u0430');if(S.kits.includes(id))fail('\u0423\u0436\u0435 \u043a\u0443\u043f\u043b\u0435\u043d\u043e');needGold(S,c.cost);S.gold-=c.cost;S.kits.push(id);return{msg:'\u00ab'+c.n+'\u00bb \u043a\u0443\u043f\u043b\u0435\u043d'}},
  vset(S,p){
    const v=p.v==='bike'?'bike':'car',V=S.veh[v],f=String(p.f),val=p.val;
    if(f==='c1'||f==='c2'){if(!S.colors.includes(val))fail('\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043a\u0443\u043f\u0438\u0442\u0435 \u044d\u0442\u043e\u0442 \u0446\u0432\u0435\u0442');V[f]=val}
    else if(f==='wh'){if(!S.wheels.includes(val))fail('\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043a\u0443\u043f\u0438\u0442\u0435 \u044d\u0442\u0438 \u043a\u043e\u043b\u0451\u0441\u0430');V.wh=val}
    else if(f==='kit'){if(!S.kits.includes(val)||!KITS[v][val])fail('\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043a\u0443\u043f\u0438\u0442\u0435 \u044d\u0442\u043e\u0442 \u043e\u0431\u0432\u0435\u0441');V.kit=val}
    else if(f==='skin'){const s=String(val);if(!SKINS[s]||!s.startsWith(v+':'))fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u0441\u043a\u0438\u043d\u0430');if(!SKINS[s].free&&!S.inv.some(i=>i.k==='skin'&&i.v===s))fail('\u042d\u0442\u043e\u0433\u043e \u0441\u043a\u0438\u043d\u0430 \u043d\u0435\u0442 \u0432 \u0433\u0430\u0440\u0430\u0436\u0435');V.skin=s}
    else if(f==='plate'){const id=int(val);if(id&&!S.box.some(b=>b.id===id))fail('\u041d\u043e\u043c\u0435\u0440 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');for(const k of ['car','bike'])if(S.veh[k].plate===id)S.veh[k].plate=0;V.plate=id}
    else if(f==='st'){
      const ids=(Array.isArray(val)?val:[]).map(int).slice(0,3);
      for(const id of ids)if(!S.inv.some(i=>i.id===id&&i.k==='sticker'))fail('\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430');
      const other=S.veh[v==='car'?'bike':'car'];other.st=other.st.filter(x=>!ids.includes(x));V.st=[...new Set(ids)];
    }else fail('\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u0430\u044f \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430');
    return{};
  },
  skinCase(S,p,ctx){
    if(S.inv.length>=INV_CAP)fail('\u0418\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c \u043f\u043e\u043b\u043e\u043d');
    if(p.free){if(!(S.free.sc>0))fail('\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0445 \u043a\u0435\u0439\u0441\u043e\u0432 \u043d\u0435\u0442');S.free.sc--}
    else if(p.key){needKeys(S,SKIN_CASE.keys);S.keys-=SKIN_CASE.keys}
    else{needGold(S,SKIN_CASE.gold);S.gold-=SKIN_CASE.gold}
    const v=rollSkin();const it=addInv(S,'skin',v,'case',ctx.now);addXp(S,60,ctx);
    return{inv:it,rare:SKINS[v].r>=2};
  },
  stickerCase(S,p,ctx){
    if(S.inv.length>=INV_CAP)fail('\u0418\u043d\u0432\u0435\u043d\u0442\u0430\u0440\u044c \u043f\u043e\u043b\u043e\u043d');
    if(p.free){if(!(S.free.tc>0))fail('\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0445 \u043a\u0435\u0439\u0441\u043e\u0432 \u043d\u0435\u0442');S.free.tc--}
    else{needGold(S,STICKER_CASE.gold);S.gold-=STICKER_CASE.gold}
    const v=rollSticker();const it=addInv(S,'sticker',v,'case',ctx.now);addXp(S,60,ctx);
    return{inv:it,rare:STICKERS[v].r>=2};
  },
  // ----- \u043c\u0438\u043d\u0438-\u0438\u0433\u0440\u044b -----
  runStart(S,p,ctx){const g=p.g==='stunt'?'stunt':'rider';const id=rid()+rid();S.run={id,g,t:ctx.now};return{run:id,left:gameLeft(S,g,ctx.now),reset:gameReset(S,g,ctx.now)}},
  runEnd(S,p,ctx){
    if(!S.run||S.run.id!==String(p.run))fail('\u0417\u0430\u0435\u0437\u0434 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d, \u043d\u0430\u0447\u043d\u0438\u0442\u0435 \u043d\u043e\u0432\u044b\u0439');
    const g=S.run.g,el=(ctx.now-S.run.t)/1000;S.run=null;
    if(el<1.5)fail('\u0421\u043b\u0438\u0448\u043a\u043e\u043c \u043a\u043e\u0440\u043e\u0442\u043a\u0438\u0439 \u0437\u0430\u0435\u0437\u0434');
    const score=Math.max(0,Math.min(int(p.score),Math.floor(el*RATE[g]),200000));
    const w=gameWin(S,g,ctx.now);
    const money=Math.max(0,Math.min(GAME_CAP-w.e,score));
    S.bal+=money;w.e+=money;S.games.runs++;
    let keys=0;S.games.acc+=money;while(S.games.acc>=KEY_EVERY){S.games.acc-=KEY_EVERY;S.keys++;keys++}
    const xp=addXp(S,Math.min(300,Math.round(score/50)),ctx);
    const gs=S.games[g];const rec=score>gs.best&&score>0;if(rec)gs.best=score;
    if(g==='rider'){const fl=Math.max(0,Math.min(int(p.flips),Math.floor(el)));S.stats.flips+=fl;quest(S,'rider5k',score,true,ctx)}
    else{S.stats.wheelie+=Math.max(0,Math.min(num(p.wt),el));quest(S,'stunt3k',score,true,ctx)}
    quest(S,'runs3',1,false,ctx);
    return{money,keys,xp,rec,score,g,left:GAME_CAP-w.e,reset:w.t0+GAME_WIN};
  },
  clickStart(S,p,ctx){needKeys(S,1);S.keys--;const id=rid()+rid();S.click={id,t:ctx.now};return{click:id}},
  clickEnd(S,p,ctx){
    if(!S.click||S.click.id!==String(p.id))fail('\u0421\u0435\u0441\u0441\u0438\u044f \u043a\u043b\u0438\u043a\u0435\u0440\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430');
    const el=Math.min(CLICK.sec+1,(ctx.now-S.click.t)/1000);S.click=null;
    const n=Math.max(0,Math.min(int(p.n),Math.floor(el*CLICK.cps),CLICK.sec*CLICK.cps));
    const m=n*CLICK.pay;S.bal+=m;return{msg:n+' \u043a\u043b\u0438\u043a\u043e\u0432 \u2192 '+fmt(m),n,m};
  },
  // ----- \u0431\u0430\u043d\u043a -----
  bankPut(S,p,ctx){
    const a=int(p.a),d=int(p.d);
    if(!(d>=1&&d<=BANK.maxDays))fail('\u0421\u0440\u043e\u043a \u043e\u0442 1 \u0434\u043e '+BANK.maxDays+' \u0434\u043d\u0435\u0439');
    if(!(a>=1000))fail('\u041c\u0438\u043d\u0438\u043c\u0430\u043b\u044c\u043d\u044b\u0439 \u0432\u043a\u043b\u0430\u0434 '+fmt(1000));
    if(S.bank.length>=BANK.maxN)fail('\u041c\u043e\u0436\u043d\u043e \u0434\u0435\u0440\u0436\u0430\u0442\u044c \u043d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 '+BANK.maxN+' \u0432\u043a\u043b\u0430\u0434\u043e\u0432');
    const tot=S.bank.reduce((s,b)=>s+b.a,0);if(tot+a>BANK.cap)fail('\u0412\u043e \u0432\u043a\u043b\u0430\u0434\u0430\u0445 \u043c\u043e\u0436\u043d\u043e \u0434\u0435\u0440\u0436\u0430\u0442\u044c \u0434\u043e '+fmt(BANK.cap));
    needRub(S,a);S.bal-=a;S.bank.push({id:rid(),a,t:ctx.now,d});quest(S,'bank1',1,false,ctx);
    return{msg:'\u0412\u043a\u043b\u0430\u0434 \u043e\u0442\u043a\u0440\u044b\u0442: \u0447\u0435\u0440\u0435\u0437 '+d+' \u0434\u043d. \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 '+fmt(Math.floor(a*(1+BANK.rate*d)))};
  },
  bankTake(S,p,ctx){
    const i=S.bank.findIndex(b=>b.id===String(p.id));if(i<0)fail('\u0412\u043a\u043b\u0430\u0434 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');
    const b=S.bank[i];const ready=ctx.now>=b.t+b.d*DAY;
    const pay=ready?Math.floor(b.a*(1+BANK.rate*b.d)):Math.floor(b.a*(1-BANK.pen));
    S.bank.splice(i,1);S.bal+=pay;
    return{msg:ready?'\u0412\u043a\u043b\u0430\u0434 \u0437\u0430\u043a\u0440\u044b\u0442: +'+fmt(pay):'\u0414\u043e\u0441\u0440\u043e\u0447\u043d\u043e: \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0435\u043d\u043e '+fmt(pay)+' (\u0448\u0442\u0440\u0430\u0444 '+Math.round(BANK.pen*100)+'%)'};
  },
  // ----- \u0442\u043e\u0442\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440 -----
  toteNew(S,p,ctx){const d=mskDate(ctx.now);if(S.tote.d!==d){S.tote.d=d;S.tote.n=0}if(!S.tote.card)S.tote.card=toteCard();return{}},
  tote(S,p,ctx){
    const d=mskDate(ctx.now);if(S.tote.d!==d){S.tote.d=d;S.tote.n=0}
    if(S.tote.n>=TOTE.perDay)fail('\u041d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f \u0441\u0442\u0430\u0432\u043a\u0438 \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0438\u0441\u044c: \u0434\u043e '+TOTE.perDay+' \u0432 \u0434\u0435\u043d\u044c');
    const card=S.tote.card;if(!card||card.id!==String(p.card))fail('\u0417\u0430\u0431\u0435\u0433 \u043e\u0431\u043d\u043e\u0432\u0438\u043b\u0441\u044f, \u043f\u043e\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u043d\u043e\u0432\u044b\u0435 \u043a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442\u044b');
    const pick=int(p.pick),amt=int(p.amt),cur=p.cur==='gold'?'gold':'rub';
    if(!(pick>=0&&pick<6))fail('\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u0430\u0448\u0438\u043d\u0443');
    const max=cur==='gold'?TOTE.gold:TOTE.rub,min=cur==='gold'?1:100;
    if(!(amt>=min&&amt<=max))fail('\u0421\u0442\u0430\u0432\u043a\u0430 \u043e\u0442 '+(cur==='gold'?gem(min):fmt(min))+' \u0434\u043e '+(cur==='gold'?gem(max):fmt(max)));
    if(cur==='gold'){needGold(S,amt);S.gold-=amt}else{needRub(S,amt);S.bal-=amt}
    const pr=toteProbs(card.o);let r=RNG(),win=5;for(let i=0;i<6;i++){r-=pr[i];if(r<0){win=i;break}}
    const pay=win===pick?Math.floor(amt*card.o[pick]):0;
    if(pay){if(cur==='gold')S.gold+=pay;else S.bal+=pay}
    S.tote.n++;S.stats.tote++;const res={win,pick,pay,amt,cur,o:card.o,sk:card.sk};S.tote.card=toteCard();
    return res;
  },
  // ----- \u0430\u043f\u0433\u0440\u0435\u0439\u0434\u0435\u0440 -----
  up(S,p,ctx){
    const ids=(Array.isArray(p.ids)?p.ids:[]).map(int).slice(0,5);if(!ids.length)fail('\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u044b');
    if(new Set(ids).size!==ids.length)fail('\u041f\u0440\u0435\u0434\u043c\u0435\u0442 \u0432\u044b\u0431\u0440\u0430\u043d \u0434\u0432\u0430\u0436\u0434\u044b');
    const kind=p.kind==='inv'?'inv':'box';
    let inV=0;const items=[];
    for(const id of ids){
      if(kind==='box'){const x=S.box.find(b=>b.id===id);if(!x)fail('\u041d\u043e\u043c\u0435\u0440 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');if(x.pin||plateLocked(S,id))fail('\u0417\u0430\u043a\u0440\u0435\u043f\u043b\u0451\u043d\u043d\u044b\u0435 \u0438 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044b\u0435 \u043d\u043e\u043c\u0435\u0440\u0430 \u043d\u0435\u043b\u044c\u0437\u044f \u0441\u0442\u0430\u0432\u0438\u0442\u044c');items.push(x);inV+=x.price}
      else{const x=S.inv.find(b=>b.id===id&&b.k==='skin');if(!x)fail('\u0421\u043a\u0438\u043d \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');if(S.veh.car.skin===x.v||S.veh.bike.skin===x.v){if(S.inv.filter(i=>i.v===x.v).length<2)fail('\u042d\u0442\u043e\u0442 \u0441\u043a\u0438\u043d \u0441\u0435\u0439\u0447\u0430\u0441 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d')}items.push(x);inV+=invValue(x)}
    }
    let target,tv;
    if(kind==='box'){
      const cat=dayCatalog(mskDate(ctx.now)).plates;target=cat.find(x=>x.id===int(p.target));if(!target)fail('\u0426\u0435\u043b\u044c \u043e\u0431\u043d\u043e\u0432\u0438\u043b\u0430\u0441\u044c, \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043d\u043e\u0432\u0430');tv=target.price;
    }else{const k=String(p.target);if(!SKINS[k]||SKINS[k].free||SKINS[k].season)fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u0441\u043a\u0438\u043d\u0430');target=k;tv=SKINS[k].v}
    if(tv<inV*UP.minX)fail('\u0426\u0435\u043b\u044c \u0434\u043e\u043b\u0436\u043d\u0430 \u0431\u044b\u0442\u044c \u0434\u043e\u0440\u043e\u0436\u0435 \u0441\u0442\u0430\u0432\u043a\u0438 \u0445\u043e\u0442\u044f \u0431\u044b \u0432 '+String(UP.minX).replace('.',',')+' \u0440\u0430\u0437\u0430');
    const ch=upChance(inV,tv);const roll=RNG();const win=roll<ch;
    if(kind==='box'){S.box=S.box.filter(b=>!ids.includes(b.id));ids.forEach(id=>unmount(S,id))}else S.inv=S.inv.filter(b=>!ids.includes(b.id));
    let got=null;
    if(win){if(kind==='box'){if(S.box.length>=BOX_CAP+10)fail('\u0413\u0430\u0440\u0430\u0436 \u043f\u043e\u043b\u043e\u043d');got=addPlate(S,target,'up',ctx.now)}else got=addInv(S,'skin',target,'up',ctx.now)}
    S.stats.up++;
    S.up.push({t:ctx.now,win,k:kind,in:Math.round(inV),out:Math.round(tv),ch:Math.round(ch*1000)/10});S.up=S.up.slice(-20);
    return{win,ch,roll,got};
  },
  // ----- \u043c\u0430\u0433\u0430\u0437\u0438\u043d \u0434\u043d\u044f -----
  shopBuy(S,p,ctx){
    const d=mskDate(ctx.now);if(S.shop.d!==d)S.shop={d,got:[]};
    const i=int(p.i);const o=dayCatalog(d).shop[i];if(!o)fail('\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u043e\u0431\u043d\u043e\u0432\u0438\u043b\u043e\u0441\u044c');
    if(S.shop.got.includes(i))fail('\u0423\u0436\u0435 \u043a\u0443\u043f\u043b\u0435\u043d\u043e \u0441\u0435\u0433\u043e\u0434\u043d\u044f');
    if(o.k==='color'&&S.colors.includes(o.v))fail('\u042d\u0442\u043e\u0442 \u0446\u0432\u0435\u0442 \u0443 \u0432\u0430\u0441 \u0443\u0436\u0435 \u0435\u0441\u0442\u044c');
    if(o.cur==='gold'){needGold(S,o.price);S.gold-=o.price}else{needRub(S,o.price);S.bal-=o.price}
    if(o.k==='plate'){if(S.box.length>=BOX_CAP)fail('\u0413\u0430\u0440\u0430\u0436 \u043f\u043e\u043b\u043e\u043d');addPlate(S,o.it,'shop',ctx.now)}
    else if(o.k==='skin')addInv(S,'skin',o.v,'shop',ctx.now);
    else if(o.k==='sticker')addInv(S,'sticker',o.v,'shop',ctx.now);
    else if(o.k==='color')S.colors.push(o.v);
    S.shop.got.push(i);return{msg:'\u041a\u0443\u043f\u043b\u0435\u043d\u043e'};
  },
  reset(S){
    const keep={gold:S.gold,keys:S.keys,prem:S.prem,don:S.don,xp:S.xp,cf:S.cf,cp:S.cp,titles:S.titles,title:S.title,colors:S.colors,wheels:S.wheels,kits:S.kits,inv:S.inv,nick:S.nick,daily:S.daily,week:S.week,games:S.games,inbox:S.inbox,gifts:S.gifts,rd:S.rd,promo:S.promo,author:S.author,hint:S.hint,nextId:S.nextId,welcome:''};
    const n=Object.assign(fresh(),keep);n.veh={car:Object.assign({},S.veh.car,{plate:0}),bike:Object.assign({},S.veh.bike,{plate:0})};
    for(const k in S)delete S[k];Object.assign(S,n);
    return{msg:'\u041d\u043e\u043c\u0435\u0440\u0430 \u0438 \u0440\u0443\u0431\u043b\u0438 \u0441\u0431\u0440\u043e\u0448\u0435\u043d\u044b. \u0413\u043e\u043b\u0434\u0430, \u043a\u043b\u044e\u0447\u0438 \u0438 \u043a\u043e\u0441\u043c\u0435\u0442\u0438\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u044b'};
  },
  // ----- \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440: \u0441\u0435\u0431\u0435 (\u0431\u0435\u0437 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u0439 \u043f\u043e \u0441\u0443\u043c\u043c\u0435) -----
  admRub(S,p,ctx){needAdm(ctx);const n=int(p.n);if(!(n>0&&n<=1e15))fail('\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u0443\u043c\u043c\u0443');S.bal+=n;return{msg:'+'+fmt(n)}},
  admGold(S,p,ctx){needAdm(ctx);const n=int(p.n);if(!(n>0&&n<=1e15))fail('\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u0443\u043c\u043c\u0443');S.gold+=n;return{msg:'+'+gem(n)}},
  admKey(S,p,ctx){needAdm(ctx);const n=int(p.n);if(!(n>0&&n<=1e9))fail('\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e');S.keys+=n;return{msg:'+'+keyN(n)}},
  admLvl(S,p,ctx){needAdm(ctx);const L=Math.max(0,Math.min(SEASON.max,int(p.l)));S.xp=L*SEASON.lvlXp;if(L>=30&&!S.titles.includes('moto'))S.titles.push('moto');if(L>=100&&!S.titles.includes('king'))S.titles.push('king');return{msg:'\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430: '+L}},
  admPrem(S,p,ctx){needAdm(ctx);S.prem=isPrem(S,ctx.now)?0:ctx.now+PREM_DAYS*DAY;return{msg:isPrem(S,ctx.now)?'Premium \u0432\u043a\u043b\u044e\u0447\u0451\u043d':'Premium \u0432\u044b\u043a\u043b\u044e\u0447\u0435\u043d'}},
  admPlate(S,p,ctx){
    needAdm(ctx);
    let pl;if(p.c==='sp'){pl=cleanPlate({c:'sp',t:p.text,b:int(p.b)});if(!pl)fail('\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0438 \u0446\u0435\u043d\u0443 \u043e\u0441\u043e\u0431\u043e\u0433\u043e \u043d\u043e\u043c\u0435\u0440\u0430')}
    else{pl=parsePlateInput(String(p.c),p.text);if(!pl)fail('\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043d\u043e\u043c\u0435\u0440')}
    const f=cleanItemFields({m:p.m,f:p.f==null||p.f===''?.05:p.f,pt:p.pt,w:p.w});
    const it=addPlate(S,Object.assign({pl},f),'admin',ctx.now);return{msg:'\u041d\u043e\u043c\u0435\u0440 '+plateText(pl)+' \u0432 \u0433\u0430\u0440\u0430\u0436\u0435',item:it};
  },
  admSkin(S,p,ctx){needAdm(ctx);const v=String(p.v);if(SKINS[v]&&!SKINS[v].free){addInv(S,'skin',v,'admin',ctx.now);return{msg:'\u0421\u043a\u0438\u043d \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d'}}if(STICKERS[v]){addInv(S,'sticker',v,'admin',ctx.now);return{msg:'\u041d\u0430\u043a\u043b\u0435\u0439\u043a\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0430'}}fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u0430')}
};
function needAdm(ctx){if(!ctx.admin)fail('\u0422\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430')}
function act(S,a,p,ctx){
  if(!Object.prototype.hasOwnProperty.call(ACTIONS,a))fail('\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435');
  ctx.notes=ctx.notes||[];ctx.now=ctx.now||Date.now();
  ensureDaily(S,ctx.now);weekTick(S,ctx.now);
  const r=ACTIONS[a](S,p&&typeof p==='object'?p:{},ctx)||{};
  r.notes=ctx.notes;return r;
}
// \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044f, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u043a\u043b\u0438\u0435\u043d\u0442 \u043c\u043e\u0436\u0435\u0442 \u0441\u0440\u0430\u0437\u0443 \u043f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c \u0443 \u0441\u0435\u0431\u044f, \u043d\u0435 \u0434\u043e\u0436\u0438\u0434\u0430\u044f\u0441\u044c \u0441\u0435\u0440\u0432\u0435\u0440\u0430
const OPTIMISTIC=new Set(['welcome','inboxSeen','title','hint','pin','claim','claimAll','questClaim','vset','k2g','g2k','buyColor','buyWheel','buyKit','nick']);
// ==/LOGIC==

// ==FILTER== \u0424\u0438\u043b\u044c\u0442\u0440 \u043c\u0430\u0442\u0430 \u0438 \u0441\u0441\u044b\u043b\u043e\u043a \u0434\u043b\u044f \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432. \u041b\u043e\u0432\u0438\u0442 \u0437\u0430\u043c\u0435\u043d\u044b \u0431\u0443\u043a\u0432, \u0437\u0432\u0451\u0437\u0434\u043e\u0447\u043a\u0438 \u0438 \u043f\u0440\u043e\u0431\u0435\u043b\u044b \u043c\u0435\u0436\u0434\u0443 \u0431\u0443\u043a\u0432\u0430\u043c\u0438.
// \u0414\u0432\u0435 \u0440\u0430\u0441\u043a\u043b\u0430\u0434\u043a\u0438: \u043f\u043e\u0445\u043e\u0436\u0438\u0435 \u043f\u043e \u0432\u0438\u0434\u0443 \u0431\u0443\u043a\u0432\u044b \u0438 \u0442\u0440\u0430\u043d\u0441\u043b\u0438\u0442. \u0422\u0435\u043a\u0441\u0442 \u043f\u0440\u043e\u0432\u0435\u0440\u044f\u0435\u0442\u0441\u044f \u0432 \u043e\u0431\u0435\u0438\u0445.
const LOOK_V={a:'\u0430',b:'\u0432',c:'\u0441',e:'\u0435',h:'\u043d',k:'\u043a',m:'\u043c',o:'\u043e',p:'\u0440',t:'\u0442',x:'\u0445',y:'\u0443',u:'\u0438',r:'\u0433',n:'\u043f',i:'\u0456',
  '0':'\u043e','1':'\u0438','3':'\u0437','4':'\u0447','6':'\u0431','8':'\u0432','@':'\u0430','$':'\u0441','\u0451':'\u0435','\u20ac':'\u0435','\u0456':'\u0438','\u0457':'\u0438','\u0454':'\u0435','\u045e':'\u0443'};
const LOOK_T={a:'\u0430',b:'\u0431',v:'\u0432',g:'\u0433',d:'\u0434',e:'\u0435',z:'\u0437',i:'\u0438',j:'\u0439',k:'\u043a',l:'\u043b',m:'\u043c',n:'\u043d',o:'\u043e',p:'\u043f',r:'\u0440',s:'\u0441',t:'\u0442',u:'\u0443',f:'\u0444',h:'\u0445',x:'\u0445',c:'\u0441',y:'\u0443',w:'\u0432',q:'\u043a',
  '0':'\u043e','1':'\u0438','3':'\u0437','4':'\u0447','6':'\u0431','@':'\u0430','$':'\u0441','\u0451':'\u0435','\u0456':'\u0438','\u0457':'\u0438','\u0454':'\u0435','\u045e':'\u0443'};
const V='[\u0430\u0435\u0438\u043e\u0443\u044b\u044d\u044e\u044f\u0439*]';
// \u041a\u043e\u0440\u043d\u0438. \u00ab*\u00bb \u0432 \u0442\u0435\u043a\u0441\u0442\u0435 \u043c\u043e\u0436\u0435\u0442 \u0437\u0430\u043c\u0435\u043d\u0438\u0442\u044c \u043b\u044e\u0431\u0443\u044e \u0433\u043b\u0430\u0441\u043d\u0443\u044e.
const BAD_ROOTS=[
  // [\u0440\u0435\u0433\u0443\u043b\u044f\u0440\u043a\u0430 \u043f\u043e \u0441\u043b\u043e\u0432\u0443]
  '^(?:\u043d\u0430|\u043f\u043e|\u043d\u0438|\u043e|\u0430|\u043e\u0442|\u0437\u0430|\u0434\u043e|\u0441|\u0443|\u0440\u0430\u0437)?\u0445(?:\u0443|\\*)(?:\u0439|\u0438|\u0435|\u0451|\u044f|\u044e)',
  '\u043f(?:\u0438|\u0435|\\*)\u0437\u0434',
  '(?:^)\u0431\u043b(?:\u044f|\\*)(?:\u0434|\u0442|\u0442\u044c|$)',
  '(?:^)\u0431\u043b(?:\u044f|\\*)$',
  '^(?:\u0437\u0430|\u0443|\u0432\u044b|\u0434\u043e|\u043d\u0430|\u043f\u043e|\u043e\u0442|\u0440\u0430\u0441|\u0440\u0430\u0437|\u0441|\u0441\u044a|\u0432\u044a|\u043f\u0440\u043e|\u043f\u0440\u0438|\u043f\u0435\u0440\u0435|\u043d\u0435\u0434\u043e|\u043e\u0431|\u0440\u0430\u0437\u044a|\u043f\u043e\u0434\u044a|\u043e\u0442\u044a|\u0438\u0437\u044a)?(?:\u0435|\\*)(?:\u0431|\\*)(?:\u0430|\u0443|\u043b|\u043d\u0443|\u0430\u043d|\u0430\u0442|\u0438|\u044b|\u043e\u0448|\u0451\u0442|\u0435\u0442|\u044b\u0440)',
  '^\u0434\u043e\u043b\u0431\u043e(?:\u0435|\u0451|\\*)\u0431',
  '(?:^)(?:\u0435|\\*)\u0431\u043b(?:\u043e|\u0430|\u0430\u043d)',
  '(?:^)\u0441(?:\u0443|\\*)\u043a(?:\u0430|\u0438|\u0435|\u0443|\u0438\u043d|\u043e\u0439)(?:$|[^\u0430-\u044f])',
  '(?:^)\u0441(?:\u0443|\\*)\u0447(?:\u043a\u0430|\u0430\u0440)',
  '\u043c(?:\u0443|\\*)\u0434(?:\u0430|\\*)\u043a','\u043c(?:\u0443|\\*)\u0434\u0438\u043b','\u043c(?:\u0443|\\*)\u0434(?:\u043e|\\*)\u0437',
  '\u043f(?:\u0438|\u0435|\\*)\u0434(?:\u043e|\u0430|\\*)\u0440','\u043f(?:\u0435|\\*)\u0434(?:\u0438|\\*)\u043a',
  '\u0433(?:\u0430|\u043e|\\*)\u043d\u0434(?:\u043e|\\*)\u043d',
  '\u0437(?:\u0430|\\*)\u043b(?:\u0443|\\*)\u043f',
  '\u0448\u043b(?:\u044e|\\*)\u0445',
  '(?:^)\u043c(?:\u0430|\\*)\u043d\u0434(?:\u0430|\u0443|\u0435|\u043e\u0439)',
  '\u0434\u0440(?:\u043e|\\*)\u0447',
  '(?:^)\u0445(?:\u0435|\\*)\u0440(?:\u043d|\u043e|\u0430)',
  '(?:^)\u0448(?:\u0430|\\*)\u043b(?:\u0430|\\*)\u0432',
  '\u0448(?:\u043b|\\*)\u044e(?:\u0448|\u0445)',
  '\u0433(?:\u043e|\\*)\u0432\u043d',
  '\u0436\u043e\u043f',
  '(?:^)\u0442\u0440\u0430\u0445(?:\u0430|\u043d)',
  '\u043c\u0440\u0430\u0437',
  '\u0443\u0431\u043b\u044e\u0434','\u0432\u044b\u0431\u043b\u044f\u0434','\u0435\u0431\u0443\u0447','\u043d\u0430\u0445\u0443\u0439','\u043f\u043e\u0445\u0443\u0439','\u0443\u0435\u0431'
].map(s=>new RegExp(s));
// \u0421\u043f\u043b\u043e\u0448\u043d\u044b\u0435 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438 \u043f\u043e \u0432\u0441\u0435\u043c\u0443 \u0442\u0435\u043a\u0441\u0442\u0443 \u0431\u0435\u0437 \u043f\u0440\u043e\u0431\u0435\u043b\u043e\u0432: \u0442\u043e\u043b\u044c\u043a\u043e \u043a\u043e\u0440\u043d\u0438 \u0431\u0435\u0437 \u043d\u0435\u0432\u0438\u043d\u043d\u044b\u0445 \u0441\u043e\u0432\u043f\u0430\u0434\u0435\u043d\u0438\u0439
const BAD_GLUED=/\u043f\u0438\u0437\u0434|\u0431\u043b\u044f\u0434|\u043d\u0430\u0445\u0443\u0439|\u043f\u043e\u0445\u0443\u0439|\u043d\u0430\u0445\u0443\u044f|\u0437\u0430\u043b\u0443\u043f|\u043f\u0438\u0434\u043e\u0440|\u043f\u0438\u0434\u0430\u0440|\u043c\u0443\u0434\u0430\u043a|\u0433\u0430\u043d\u0434\u043e\u043d|\u0448\u043b\u044e\u0445|\u0432\u044b\u0431\u043b\u044f\u0434|\u0443\u0431\u043b\u044e\u0434|\u0434\u043e\u043b\u0431\u043e\u0435\u0431|\u0434\u043e\u043b\u0431\u0430\u0435\u0431/;
function normFilter(s,map){
  s=String(s||'').toLowerCase().replace(/sh/g,map===LOOK_T?'\u0448':'sh').replace(/ch/g,map===LOOK_T?'\u0447':'ch').replace(/zh/g,map===LOOK_T?'\u0436':'zh').replace(/ya/g,map===LOOK_T?'\u044f':'ya').replace(/yu/g,map===LOOK_T?'\u044e':'yu');
  let out='';
  for(const ch of s){out+=map[ch]||ch}
  return out.replace(/\u0456/g,'\u0438').replace(/(.)\1{2,}/g,'$1$1');
}
function words(s){
  // \u0441\u043b\u043e\u0432\u0430 \u0438\u0437 \u0431\u0443\u043a\u0432 \u0438 \u00ab*\u00bb; \u043e\u0434\u0438\u043d\u043e\u0447\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b, \u0440\u0430\u0437\u0434\u0435\u043b\u0451\u043d\u043d\u044b\u0435 \u043f\u0440\u043e\u0431\u0435\u043b\u0430\u043c\u0438 \u0438\u043b\u0438 \u0437\u043d\u0430\u043a\u0430\u043c\u0438, \u0441\u043a\u043b\u0435\u0438\u0432\u0430\u0435\u043c: \u00ab\u0445 \u0443 \u0439\u00bb \u2192 \u00ab\u0445\u0443\u0439\u00bb
  const t=s.split(/[^\u0430-\u044f\u0451*]+/).filter(Boolean);const out=[];let glue='';
  for(const w of t){if(w.length<=2){glue+=w}else{if(glue){out.push(glue);glue=''}out.push(w)}}
  if(glue)out.push(glue);
  return out;
}
function hasBad(text){return hasBad1(normFilter(text,LOOK_V))||hasBad1(normFilter(text,LOOK_T))}
function hasBad1(n){
  for(const w of words(n)){const ww=w.replace(/(.)\1+/g,'$1');for(const re of BAD_ROOTS)if(re.test(w)||re.test(ww))return true}
  const glued=n.replace(/[^\u0430-\u044f\u0451*]+/g,'');
  if(BAD_GLUED.test(glued)||BAD_GLUED.test(glued.replace(/(.)\1+/g,'$1')))return true;
  return false;
}
const TLD='(?:ru|com|net|org|\u0440\u0444|su|ua|kz|me|io|gg|xyz|info|online|site|shop|app|dev|pro|top|tk|cc|link|club|store|biz|tv|fun|live|space|tech|ly|to|co|us|eu|de|uk|by|uz|am|ge|in|cn|ws|vip)';
const LINK_RES=[
  /(?:https?|ftp|tg)\s*:\s*\/\s*\//i,
  /w\s*w\s*w\s*\./i,
  /t\s*\.\s*m\s*e\b/i,/telegram\s*\.\s*(?:me|org|dog)/i,/(?:^|\s)(?:t|tg)\s*[\/\\]\s*\w/i,
  /@[a-z0-9_]{4,}/i,
  new RegExp('[a-z\u0430-\u044f0-9-]{2,}\\s*[.,]\\s*'+TLD+'(?![a-z\u0430-\u044f])','i'),
  new RegExp('[a-z\u0430-\u044f0-9-]{2,}\\s*\\(\\s*(?:\\.|\u0442\u043e\u0447\u043a\u0430|dot)\\s*\\)\\s*'+TLD,'i'),
  /[a-z\u0430-\u044f0-9-]{2,}\s*[.,]\s*(?:\u0440\u0443|\u043a\u043e\u043c|\u0440\u0444|\u043d\u0435\u0442|\u043e\u0440\u0433|\u0441\u0443|\u0443\u0430|\u043a\u0437)(?![\u0430-\u044f])/i,
  /(?:\u0442\u043e\u0447\u043a\u0430|\u0442\u0447\u043a|dot|\[dot\]|\(dot\))\s*(?:\u0440\u0443|ru|\u043a\u043e\u043c|com|\u0440\u0444|\u043d\u0435\u0442|net|\u043e\u0440\u0433|org|\u043c\u0438|me|\u0438\u043e|io|\u043a\u043e\u043c|\u0441\u0443|su|\u0443\u0430|ua|\u043a\u0437|kz)/i,
  /(?:^|\s)(?:\u0440\u0443|\u0440\u0443\s*\u0448\u043a\u0430)\s*$/i,
  /[a-z0-9-]{3,}\.[a-z]{2,}\/\S*/i
];
function hasLink(text){
  const t=String(text||'').toLowerCase().replace(/[\u200b-\u200f\u2060]/g,'');
  for(const re of LINK_RES)if(re.test(t))return true;
  return false;
}
function checkComment(text){
  const t=cleanText(text,1000).replace(/\s+/g,' ');
  if(t.length<1)return{ok:false,err:'\u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439'};
  if(t.length>200)return{ok:false,err:'\u041d\u0435 \u0434\u043b\u0438\u043d\u043d\u0435\u0435 200 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432'};
  if(hasLink(t))return{ok:false,err:'\u0421\u0441\u044b\u043b\u043a\u0438 \u0432 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f\u0445 \u0437\u0430\u043f\u0440\u0435\u0449\u0435\u043d\u044b'};
  if(hasBad(t))return{ok:false,err:'\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u043d\u0435 \u043f\u0440\u043e\u0448\u0451\u043b \u0444\u0438\u043b\u044c\u0442\u0440: \u0443\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u0431\u044b\u0435 \u0441\u043b\u043e\u0432\u0430'};
  return{ok:true,text:t};
}
// ==/FILTER==

return{get RNG(){return RNG},rnd,pick,seeded,withRng,seq,same,wpick,wIdx,RU_LET,UA_LET,KZ_LET,US_LET,DE_LET,FR_LET,ES_LET,AE_LET,COUNTRY,COUNTRIES,RU_TOP,RU_PLAIN,UA_REG,KZ_REG,US_REG,US_LOOK,EU_REG,DE_CITY,AE_REG,topCodes,RU_REG,REG,RMAP,DEMAP,digitsStr,letters,RULES3,RULES4,RULES_SHORT,RULES_AE,lrun,L3,SERIES_RU,LRULES,BASE,MATS,WEARS,FONTS,wearOf,floatMult,BUILTIN_PAT,OV,setOv,getOv,patInfo,genPlate,plateKey,plateText,niceRound,comboOf,APC,appraise,rollItem,MAT_W,AE_B,TIERS,caseRoll,LAT,CYR,toLat,has,cleanPlate,cleanItemFields,parsePlateInput,BOX_CAP,KEY_GOLD,GAME_CAP,PREM_DAYS,SEASON,WEEK_XP,BANK,TOTE,CLICK,SKINS,STICKERS,SKIN_R,STK_R,SKIN_CASE,COLORS,WHEELS,KITS,TITLES,REF_REW,REF_PREM,PLUS,plusTier,SPECIAL,buildPass,PASS,QUESTS,num,fmtN,fmt,gem,keyN,hashStr,MSK,mskDate,weekId,weekEnd,INVIS,cleanNick,cleanText,newVeh,fresh,cleanItem,priceItem,normalize,seasonOn,level,lvlPct,isPrem,worth,badges,addXp,ensureDaily,quest,questReady,claimable,weekOpts,weekTick,rewardText,addPlate,addInv,grant,claimLevel,inbox,sellQuick,unmount,plateLocked,rollSkin,rollSticker,gameWin,gameLeft,gameReset,RATE,TOTE_SKINS,toteCard,toteProbs,dayCatalog,UP,upChance,invValue,GameError,fail,int,rid,needGold,needRub,needKeys,ACTIONS,needAdm,act,OPTIMISTIC,LOOK_V,LOOK_T,V,BAD_ROOTS,BAD_GLUED,normFilter,words,hasBad,hasBad1,TLD,LINK_RES,hasLink,checkComment,INV_CAP,BUYBACK,FEE,MAX_LIST,MIN_ASK,MAX_ASK,START_BAL,GAME_WIN,KEY_EVERY,PREM_GOLD,STICKER_CASE,REF_WEEK,REF_LVL,FREE,PREM,DAY,WEEK};
})();
})(typeof window!=='undefined'?window:globalThis);
