/* \u041e\u0431\u0449\u0430\u044f \u043b\u043e\u0433\u0438\u043a\u0430 \u0438\u0433\u0440\u044b \u00ab\u0412\u044b\u0431\u0438\u0432\u0430\u043d\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u043e\u0432\u00bb: \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0438 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435, \u0438 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 */
(function(root,factory){const L=factory();if(typeof module==='object'&&module.exports)module.exports=L;else root.L=L})(typeof self!=='undefined'?self:this,function(){
'use strict';
// ==CORE==
const RU_LET='\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425'.split('');
const UA_LET='ABCEHIKMOPTX'.split('');
const KZ_LET='ABCDEFGHKLMNOPRSTUVXYZ'.split('');
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
const seq=d=>{const a=[...d].map(Number);return a.every((v,i)=>i===0||v===a[i-1]+1)||a.every((v,i)=>i===0||v===a[i-1]-1)};
const same=d=>[...d].every(ch=>ch===d[0]);

// [\u043a\u043e\u0434, \u0440\u0435\u0433\u0438\u043e\u043d, \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c \u0446\u0435\u043d\u044b, \u0432\u0435\u0441 \u0432\u044b\u043f\u0430\u0434\u0435\u043d\u0438\u044f]
const RU_TOP=[['777','\u041c\u043e\u0441\u043a\u0432\u0430',3.5,.5],['977','\u041c\u043e\u0441\u043a\u0432\u0430',2.8,.5],['797','\u041c\u043e\u0441\u043a\u0432\u0430',2.6,.5],['799','\u041c\u043e\u0441\u043a\u0432\u0430',2.6,.5],['199','\u041c\u043e\u0441\u043a\u0432\u0430',2.1,.7],['99','\u041c\u043e\u0441\u043a\u0432\u0430',2.3,.7],['97','\u041c\u043e\u0441\u043a\u0432\u0430',2.2,.7],['197','\u041c\u043e\u0441\u043a\u0432\u0430',2,.7],['177','\u041c\u043e\u0441\u043a\u0432\u0430',2,.7],['77','\u041c\u043e\u0441\u043a\u0432\u0430',2.4,1],['178','\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433',1.7,.6],['98','\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433',1.7,.6],['78','\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433',1.8,.9],['750','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,.5],['790','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.3,.5],['150','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.3,.6],['190','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.3,.6],['50','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,.9],['90','\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,.9],['123','\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439',1.3,.5],['93','\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439',1.3,.6],['23','\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439',1.3,.9]];
const RU_PLAIN=[['01','\u0410\u0434\u044b\u0433\u0435\u044f'],['02','\u0411\u0430\u0448\u043a\u043e\u0440\u0442\u043e\u0441\u0442\u0430\u043d'],['03','\u0411\u0443\u0440\u044f\u0442\u0438\u044f'],['04','\u0410\u043b\u0442\u0430\u0439'],['05','\u0414\u0430\u0433\u0435\u0441\u0442\u0430\u043d'],['06','\u0418\u043d\u0433\u0443\u0448\u0435\u0442\u0438\u044f'],['07','\u041a\u0430\u0431\u0430\u0440\u0434\u0438\u043d\u043e-\u0411\u0430\u043b\u043a\u0430\u0440\u0438\u044f'],['08','\u041a\u0430\u043b\u043c\u044b\u043a\u0438\u044f'],['09','\u041a\u0430\u0440\u0430\u0447\u0430\u0435\u0432\u043e-\u0427\u0435\u0440\u043a\u0435\u0441\u0438\u044f'],['10','\u041a\u0430\u0440\u0435\u043b\u0438\u044f'],['11','\u041a\u043e\u043c\u0438'],['12','\u041c\u0430\u0440\u0438\u0439 \u042d\u043b'],['13','\u041c\u043e\u0440\u0434\u043e\u0432\u0438\u044f'],['14','\u042f\u043a\u0443\u0442\u0438\u044f'],['15','\u0421\u0435\u0432\u0435\u0440\u043d\u0430\u044f \u041e\u0441\u0435\u0442\u0438\u044f'],['16','\u0422\u0430\u0442\u0430\u0440\u0441\u0442\u0430\u043d'],['17','\u0422\u044b\u0432\u0430'],['18','\u0423\u0434\u043c\u0443\u0440\u0442\u0438\u044f'],['19','\u0425\u0430\u043a\u0430\u0441\u0438\u044f'],['21','\u0427\u0443\u0432\u0430\u0448\u0438\u044f'],['22','\u0410\u043b\u0442\u0430\u0439\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['24','\u041a\u0440\u0430\u0441\u043d\u043e\u044f\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['25','\u041f\u0440\u0438\u043c\u043e\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['26','\u0421\u0442\u0430\u0432\u0440\u043e\u043f\u043e\u043b\u044c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['27','\u0425\u0430\u0431\u0430\u0440\u043e\u0432\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['28','\u0410\u043c\u0443\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['29','\u0410\u0440\u0445\u0430\u043d\u0433\u0435\u043b\u044c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['30','\u0410\u0441\u0442\u0440\u0430\u0445\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['31','\u0411\u0435\u043b\u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['32','\u0411\u0440\u044f\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['33','\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['34','\u0412\u043e\u043b\u0433\u043e\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['35','\u0412\u043e\u043b\u043e\u0433\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['36','\u0412\u043e\u0440\u043e\u043d\u0435\u0436\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['37','\u0418\u0432\u0430\u043d\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['38','\u0418\u0440\u043a\u0443\u0442\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['39','\u041a\u0430\u043b\u0438\u043d\u0438\u043d\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['40','\u041a\u0430\u043b\u0443\u0436\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['41','\u041a\u0430\u043c\u0447\u0430\u0442\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['42','\u041a\u0435\u043c\u0435\u0440\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['43','\u041a\u0438\u0440\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['44','\u041a\u043e\u0441\u0442\u0440\u043e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['45','\u041a\u0443\u0440\u0433\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['46','\u041a\u0443\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['47','\u041b\u0435\u043d\u0438\u043d\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['48','\u041b\u0438\u043f\u0435\u0446\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['49','\u041c\u0430\u0433\u0430\u0434\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['51','\u041c\u0443\u0440\u043c\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['52','\u041d\u0438\u0436\u0435\u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['53','\u041d\u043e\u0432\u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['54','\u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['55','\u041e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['56','\u041e\u0440\u0435\u043d\u0431\u0443\u0440\u0433\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['57','\u041e\u0440\u043b\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['58','\u041f\u0435\u043d\u0437\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['59','\u041f\u0435\u0440\u043c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['60','\u041f\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['61','\u0420\u043e\u0441\u0442\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['62','\u0420\u044f\u0437\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['63','\u0421\u0430\u043c\u0430\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['64','\u0421\u0430\u0440\u0430\u0442\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['65','\u0421\u0430\u0445\u0430\u043b\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['66','\u0421\u0432\u0435\u0440\u0434\u043b\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['67','\u0421\u043c\u043e\u043b\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['68','\u0422\u0430\u043c\u0431\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['69','\u0422\u0432\u0435\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['70','\u0422\u043e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['71','\u0422\u0443\u043b\u044c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['72','\u0422\u044e\u043c\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['73','\u0423\u043b\u044c\u044f\u043d\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['74','\u0427\u0435\u043b\u044f\u0431\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['75','\u0417\u0430\u0431\u0430\u0439\u043a\u0430\u043b\u044c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'],['76','\u042f\u0440\u043e\u0441\u043b\u0430\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c'],['79','\u0415\u0432\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u0410\u041e'],['86','\u0425\u0430\u043d\u0442\u044b-\u041c\u0430\u043d\u0441\u0438\u0439\u0441\u043a\u0438\u0439 \u0410\u041e'],['89','\u042f\u043c\u0430\u043b\u043e-\u041d\u0435\u043d\u0435\u0446\u043a\u0438\u0439 \u0410\u041e'],['95','\u0427\u0435\u0447\u043d\u044f']];
const UA_REG=[['AA','\u041a\u0438\u0435\u0432',2.5,1.5],['KA','\u041a\u0438\u0435\u0432',2.2,1.2],['BH','\u041e\u0434\u0435\u0441\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.5,1],['AX','\u0425\u0430\u0440\u044c\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,1],['BC','\u041b\u044c\u0432\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,1],['AI','\u041a\u0438\u0435\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.4,1],['AE','\u0414\u043d\u0435\u043f\u0440\u043e\u043f\u0435\u0442\u0440\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1.3,1],['AB','\u0412\u0438\u043d\u043d\u0438\u0446\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AC','\u0412\u043e\u043b\u044b\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AM','\u0416\u0438\u0442\u043e\u043c\u0438\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AO','\u0417\u0430\u043a\u0430\u0440\u043f\u0430\u0442\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AP','\u0417\u0430\u043f\u043e\u0440\u043e\u0436\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['AT','\u0418\u0432\u0430\u043d\u043e-\u0424\u0440\u0430\u043d\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BA','\u041a\u0438\u0440\u043e\u0432\u043e\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BE','\u041d\u0438\u043a\u043e\u043b\u0430\u0435\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BI','\u041f\u043e\u043b\u0442\u0430\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BK','\u0420\u043e\u0432\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BM','\u0421\u0443\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BO','\u0422\u0435\u0440\u043d\u043e\u043f\u043e\u043b\u044c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BT','\u0425\u0435\u0440\u0441\u043e\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['BX','\u0425\u043c\u0435\u043b\u044c\u043d\u0438\u0446\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['CA','\u0427\u0435\u0440\u043a\u0430\u0441\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['CB','\u0427\u0435\u0440\u043d\u0438\u0433\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['CE','\u0427\u0435\u0440\u043d\u043e\u0432\u0438\u0446\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1]];
const KZ_REG=[['01','\u0410\u0441\u0442\u0430\u043d\u0430',2.2,1.3],['02','\u0410\u043b\u043c\u0430\u0442\u044b',2,1.3],['17','\u0428\u044b\u043c\u043a\u0435\u043d\u0442',1.4,.9],['03','\u0410\u043a\u043c\u043e\u043b\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['04','\u0410\u043a\u0442\u044e\u0431\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['05','\u0410\u043b\u043c\u0430\u0442\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['06','\u0410\u0442\u044b\u0440\u0430\u0443\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['07','\u0417\u0430\u043f\u0430\u0434\u043d\u043e-\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['08','\u0416\u0430\u043c\u0431\u044b\u043b\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['09','\u041a\u0430\u0440\u0430\u0433\u0430\u043d\u0434\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['10','\u041a\u043e\u0441\u0442\u0430\u043d\u0430\u0439\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['11','\u041a\u044b\u0437\u044b\u043b\u043e\u0440\u0434\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['12','\u041c\u0430\u043d\u0433\u0438\u0441\u0442\u0430\u0443\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['13','\u0422\u0443\u0440\u043a\u0435\u0441\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['14','\u041f\u0430\u0432\u043b\u043e\u0434\u0430\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['15','\u0421\u0435\u0432\u0435\u0440\u043e-\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['16','\u0412\u043e\u0441\u0442\u043e\u0447\u043d\u043e-\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',1,1],['18','\u043e\u0431\u043b\u0430\u0441\u0442\u044c \u0410\u0431\u0430\u0439',1,1],['19','\u043e\u0431\u043b\u0430\u0441\u0442\u044c \u0416\u0435\u0442\u044b\u0441\u0443',1,1],['20','\u043e\u0431\u043b\u0430\u0441\u0442\u044c \u0423\u043b\u044b\u0442\u0430\u0443',1,1]];
const topCodes=new Set(RU_TOP.map(r=>r[0]));
const RU_REG=RU_TOP.concat(RU_PLAIN.filter(r=>!topCodes.has(r[0])).map(r=>[r[0],r[1],1,1]));
const REG={ru:RU_REG,ua:UA_REG,kz:KZ_REG};
const RMAP={};for(const c in REG){RMAP[c]={};REG[c].forEach(r=>{RMAP[c][r[0]]=r})}
const wpick=l=>{let t=0;for(const x of l)t+=x[3];let r=Math.random()*t;for(const x of l){r-=x[3];if(r<0)return x}return l[l.length-1]};
const digitsStr=n=>{let s;do{s='';for(let i=0;i<n;i++)s+=rnd(10)}while(/^0+$/.test(s));return s};
const letters=(set,n)=>{let s='';for(let i=0;i<n;i++)s+=pick(set);return s};

// \u041f\u0440\u0430\u0432\u0438\u043b\u0430 \u0446\u0438\u0444\u0440: \u043f\u0435\u0440\u0432\u043e\u0435 \u0441\u043e\u0432\u043f\u0430\u0432\u0448\u0435\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u043e \u0437\u0430\u0434\u0430\u0451\u0442 \u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c
const RULES3=[
 {t:'\u0422\u0440\u0438 \u0441\u0435\u043c\u0451\u0440\u043a\u0438',m:60,ex:'777',f:d=>d==='777'},
 {t:'\u0422\u0440\u0438 \u0432\u043e\u0441\u044c\u043c\u0451\u0440\u043a\u0438',m:40,ex:'888',f:d=>d==='888'},
 {t:'\u0422\u0440\u0438 \u0434\u0435\u0432\u044f\u0442\u043a\u0438',m:30,ex:'999',f:d=>d==='999'},
 {t:'\u0422\u0440\u0438 \u0435\u0434\u0438\u043d\u0438\u0446\u044b',m:30,ex:'111',f:d=>d==='111'},
 {t:'\u0422\u0440\u0438 \u0448\u0435\u0441\u0442\u0451\u0440\u043a\u0438',m:24,ex:'666',f:d=>d==='666'},
 {t:'\u0410\u0433\u0435\u043d\u0442 007',m:24,ex:'007',f:d=>d==='007'},
 {t:'\u0422\u0440\u0438 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435',m:20,ex:'333',f:same},
 {t:'\u041c\u0430\u043b\u044b\u0439 \u043d\u043e\u043c\u0435\u0440',m:14,ex:'001\u2013009',f:d=>/^00\d$/.test(d)},
 {t:'\u041b\u0435\u0441\u0435\u043d\u043a\u0430',m:10,ex:'123, 765',f:seq},
 {t:'\u041a\u0440\u0443\u0433\u043b\u0430\u044f \u0441\u043e\u0442\u043d\u044f',m:8,ex:'500',f:d=>/^\d00$/.test(d)},
 {t:'\u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u044b\u0439',m:4,ex:'282',f:d=>d[0]===d[2]},
 {t:'\u041f\u0430\u0440\u0430',m:1.8,ex:'118, 455',f:d=>d[0]===d[1]||d[1]===d[2]}
];
const RULES4=[
 {t:'\u041d\u043e\u043c\u0435\u0440 \u043e\u0434\u0438\u043d',m:90,ex:'0001',f:d=>d==='0001'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u0441\u0435\u043c\u0451\u0440\u043a\u0438',m:80,ex:'7777',f:d=>d==='7777'},
 {t:'\u0410\u0433\u0435\u043d\u0442 007',m:70,ex:'0007',f:d=>d==='0007'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u0432\u043e\u0441\u044c\u043c\u0451\u0440\u043a\u0438',m:60,ex:'8888',f:d=>d==='8888'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u0434\u0435\u0432\u044f\u0442\u043a\u0438',m:50,ex:'9999',f:d=>d==='9999'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u0435\u0434\u0438\u043d\u0438\u0446\u044b',m:45,ex:'1111',f:d=>d==='1111'},
 {t:'\u0427\u0435\u0442\u044b\u0440\u0435 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435',m:40,ex:'5555',f:same},
 {t:'\u041c\u0430\u043b\u044b\u0439 \u043d\u043e\u043c\u0435\u0440',m:28,ex:'0002\u20130009',f:d=>/^000\d$/.test(d)},
 {t:'\u041b\u0435\u0441\u0435\u043d\u043a\u0430',m:25,ex:'1234, 6543',f:seq},
 {t:'\u0422\u0440\u0438 \u0441\u0435\u043c\u0451\u0440\u043a\u0438',m:14,ex:'0777, 7770',f:d=>d.includes('777')},
 {t:'\u041a\u0440\u0443\u0433\u043b\u0430\u044f \u0442\u044b\u0441\u044f\u0447\u0430',m:12,ex:'3000',f:d=>/^\d000$/.test(d)},
 {t:'\u0414\u0432\u0435 \u043f\u0430\u0440\u044b',m:8,ex:'1122',f:d=>/^(\d)\1(\d)\2$/.test(d)},
 {t:'\u041f\u043e\u0432\u0442\u043e\u0440',m:8,ex:'1212',f:d=>/^(\d\d)\1$/.test(d)},
 {t:'\u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u044b\u0439',m:7,ex:'1221',f:d=>/^(\d)(\d)\2\1$/.test(d)},
 {t:'\u0422\u0440\u043e\u0439\u043a\u0430',m:6,ex:'5551',f:d=>/(\d)\1\1/.test(d)},
 {t:'\u041a\u0440\u0443\u0433\u043b\u0430\u044f \u0441\u043e\u0442\u043d\u044f',m:2.5,ex:'3500',f:d=>/^\d\d00$/.test(d)},
 {t:'\u041f\u0430\u0440\u0430',m:1.6,ex:'1123',f:d=>/(\d)\1/.test(d)}
];
const lrun=s=>{const c=[...s].map(x=>x.charCodeAt(0));return c.every((v,i)=>i===0||v===c[i-1]+1)||c.every((v,i)=>i===0||v===c[i-1]-1)};
const LRULES={
 ru:[
  {t:'\u041e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:4,ex:'\u0410\u2026\u0410\u0410',f:p=>p.p===p.s[0]&&p.s[0]===p.s[1]},
  {t:'\u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.6,ex:'\u0412\u2026\u0410\u0412',f:p=>p.p===p.s[1]},
  {t:'\u041f\u0430\u0440\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.5,ex:'\u0412\u2026\u0410\u0410',f:p=>p.s[0]===p.s[1]}
 ],
 ua:[
  {t:'\u0421\u0435\u0440\u0438\u044f \u043a\u0430\u043a \u0440\u0435\u0433\u0438\u043e\u043d',m:3,ex:'AA 1234 AA',f:p=>p.p===p.s},
  {t:'\u041f\u0430\u0440\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.5,ex:'AA 1234 BB',f:p=>p.s[0]===p.s[1]}
 ],
 kz:[
  {t:'\u0422\u0440\u0438 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:4,ex:'AAA',f:p=>same(p.s)},
  {t:'\u0410\u043b\u0444\u0430\u0432\u0438\u0442',m:3,ex:'ABC',f:p=>lrun(p.s)},
  {t:'\u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:2,ex:'ABA',f:p=>p.s[0]===p.s[2]},
  {t:'\u041f\u0430\u0440\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1.4,ex:'AAB',f:p=>p.s[0]===p.s[1]||p.s[1]===p.s[2]}
 ]
};
const BASE={ru:160,ua:200,kz:160};
const RARITY=[{k:'common',n:'\u041e\u0431\u044b\u0447\u043d\u044b\u0439',min:0},{k:'good',n:'\u0425\u043e\u0440\u043e\u0448\u0438\u0439',min:350},{k:'rare',n:'\u0420\u0435\u0434\u043a\u0438\u0439',min:1500},{k:'elite',n:'\u042d\u043b\u0438\u0442\u043d\u044b\u0439',min:6000},{k:'legend',n:'\u041b\u0435\u0433\u0435\u043d\u0434\u0430\u0440\u043d\u044b\u0439',min:25000}];
const RIDX={common:0,good:1,rare:2,elite:3,legend:4};
const TIERS=[
 {id:'std',name:'\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442',k:1,price:500,xp:40,desc:'\u041e\u0434\u0438\u043d \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440'},
 {id:'gold',name:'\u0417\u043e\u043b\u043e\u0442\u043e\u0439',k:3,price:900,xp:80,desc:'\u041b\u0443\u0447\u0448\u0438\u0439 \u0438\u0437 \u0442\u0440\u0451\u0445 \u043d\u043e\u043c\u0435\u0440\u043e\u0432'},
 {id:'elite',name:'\u042d\u043b\u0438\u0442\u043d\u044b\u0439',k:10,price:1900,xp:160,desc:'\u041b\u0443\u0447\u0448\u0438\u0439 \u0438\u0437 \u0434\u0435\u0441\u044f\u0442\u0438 \u043d\u043e\u043c\u0435\u0440\u043e\u0432'},
 {id:'season',name:'\u0421\u0435\u0437\u043e\u043d\u043d\u044b\u0439',k:14,floor:1500,price:3500,xp:250,event:true,desc:'\u041b\u0443\u0447\u0448\u0438\u0439 \u0438\u0437 14, \u043d\u0435 \u043d\u0438\u0436\u0435 \u00ab\u0420\u0435\u0434\u043a\u043e\u0433\u043e\u00bb. \u0422\u043e\u043b\u044c\u043a\u043e \u0432 \u0441\u0435\u0437\u043e\u043d\u0435 1'}
];
const rarityOf=p=>{let r=RARITY[0];for(const x of RARITY)if(p>=x.min)r=x;return r};
const niceRound=p=>{const s=p<1000?10:p<10000?50:p<100000?500:1000;return Math.max(50,Math.round(p/s)*s)};
function genPlate(c){
  if(c==='ru')return{c,p:pick(RU_LET),d:digitsStr(3),s:letters(RU_LET,2),r:wpick(RU_REG)[0]};
  if(c==='ua')return{c,p:wpick(UA_REG)[0],d:digitsStr(4),s:letters(UA_LET,2),r:''};
  return{c:'kz',p:'',d:digitsStr(3),s:letters(KZ_LET,3),r:wpick(KZ_REG)[0]};
}
function appraise(pl){
  const dr=(pl.c==='ua'?RULES4:RULES3).find(r=>r.f(pl.d))||{t:'\u041e\u0431\u044b\u0447\u043d\u044b\u0435 \u0446\u0438\u0444\u0440\u044b',m:1};
  const lr=LRULES[pl.c].find(r=>r.f(pl))||{t:'\u041e\u0431\u044b\u0447\u043d\u044b\u0435 \u0431\u0443\u043a\u0432\u044b',m:1};
  const code=pl.c==='ua'?pl.p:pl.r;
  const rg=RMAP[pl.c][code]||[code,'\u0420\u0435\u0433\u0438\u043e\u043d '+code,1,1];
  const base=BASE[pl.c];
  const mult=dr.m*lr.m*rg[2];
  const price=niceRound(base*mult);
  return{price,base,mult,raw:base*mult,rar:rarityOf(price),
    parts:[
      {k:'\u0426\u0438\u0444\u0440\u044b',v:pl.d,t:dr.t,m:dr.m},
      {k:'\u0411\u0443\u043a\u0432\u044b',v:pl.c==='ua'?pl.s:pl.p?pl.p+pl.s:pl.s,t:lr.t,m:lr.m},
      {k:'\u0420\u0435\u0433\u0438\u043e\u043d',v:code,t:rg[1],m:rg[2]}
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
// \u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043d\u043e\u043c\u0435\u0440\u0430, \u043f\u0440\u0438\u0448\u0435\u0434\u0448\u0435\u0433\u043e \u0438\u0437 \u043e\u0431\u0449\u0435\u0439 \u0431\u0430\u0437\u044b \u0438\u043b\u0438 \u0441\u0442\u0430\u0440\u043e\u0433\u043e \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044f
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
const CARS={orange:{n:'\u041e\u0440\u0430\u043d\u0436\u0435\u0432\u044b\u0439',c:'#ff7a1a'},mint:{n:'\u041c\u044f\u0442\u0430',c:'#3ecfa0'},violet:{n:'\u0424\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439',c:'#8b5cf6'},gold:{n:'\u0417\u043e\u043b\u043e\u0442\u043e',c:'#e6b422'},neon:{n:'\u041d\u0435\u043e\u043d',c:'#39ff88'},chrome:{n:'\u0425\u0440\u043e\u043c',c:'#c9d3dd'},red:{n:'\u041a\u0440\u0430\u0441\u043d\u044b\u0439',c:'#e53935',cost:60},blue:{n:'\u0421\u0438\u043d\u0438\u0439',c:'#2f6fde',cost:60},black:{n:'\u0427\u0451\u0440\u043d\u044b\u0439',c:'#20242b',cost:90},white:{n:'\u0411\u0435\u043b\u044b\u0439',c:'#f3f5f8',cost:90}};
const CAR_SRC={mint:'\u043f\u0440\u043e\u043f\u0443\u0441\u043a, \u0443\u0440. 6',violet:'\u043f\u0440\u043e\u043f\u0443\u0441\u043a, \u0443\u0440. 20',gold:'\u043f\u0440\u0435\u043c\u0438\u0443\u043c, \u0443\u0440. 4',neon:'\u043f\u0440\u0435\u043c\u0438\u0443\u043c, \u0443\u0440. 14',chrome:'\u043f\u0440\u0435\u043c\u0438\u0443\u043c, \u0443\u0440. 24'};
const KEYN={std:'\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442',gold:'\u0417\u043e\u043b\u043e\u0442\u043e\u0439',elite:'\u042d\u043b\u0438\u0442\u043d\u044b\u0439',season:'\u0421\u0435\u0437\u043e\u043d\u043d\u044b\u0439'};
const PACKS=[{g:100,b:'',rub:99},{g:330,b:'+10%',rub:299},{g:700,b:'+18%',rub:590},{g:1500,b:'+25%',rub:1190}];
const GKEY={season:120,elite:70};
const FREE=[null,{m:1000},{k:'std',n:2},{g:15},{m:1500},{k:'gold',n:1},{car:'mint'},{m:2000},{g:20},{k:'gold',n:2},{k:'season',n:1},{m:2500},{g:25},{k:'elite',n:1},{m:3000},{k:'season',n:1},{g:30},{m:3500},{k:'elite',n:1},{m:4000},{car:'violet'},{g:35},{k:'gold',n:3},{m:5000},{k:'elite',n:2},{k:'season',n:2},{g:40},{m:6000},{k:'elite',n:2},{g:50},{plate:{c:'ru',p:'\u041a',d:'123',s:'\u041a\u041a',r:'78'}}];
const PREM=[null,{g:50},{m:3000},{k:'elite',n:1},{car:'gold'},{k:'season',n:2},{m:5000},{g:60},{k:'elite',n:2},{m:6000},{plate:{c:'ua',p:'BC',d:'1221',s:'BC',r:''}},{k:'season',n:2},{g:70},{m:8000},{car:'neon'},{plate:{c:'kz',p:'',d:'001',s:'AAA',r:'02'}},{k:'elite',n:3},{g:80},{m:10000},{k:'season',n:3},{plate:{c:'ru',p:'\u0415',d:'888',s:'\u0415\u0415',r:'78'}},{g:100},{m:12000},{k:'elite',n:3},{car:'chrome'},{k:'season',n:4},{g:120},{m:15000},{k:'elite',n:4},{g:150},{plate:{c:'ru',p:'\u0410',d:'777',s:'\u0410\u0410',r:'777'}}];
const QUESTS={
  open5:{t:'\u041e\u0442\u043a\u0440\u044b\u0442\u044c 5 \u043a\u0435\u0439\u0441\u043e\u0432',g:5},
  gold2:{t:'\u041e\u0442\u043a\u0440\u044b\u0442\u044c 2 \u043a\u0435\u0439\u0441\u0430 \u0434\u043e\u0440\u043e\u0436\u0435 \u00ab\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u0430\u00bb',g:2},
  rare1:{t:'\u0412\u044b\u0431\u0438\u0442\u044c \u00ab\u0420\u0435\u0434\u043a\u0438\u0439\u00bb \u043d\u043e\u043c\u0435\u0440 \u0438\u043b\u0438 \u043b\u0443\u0447\u0448\u0435',g:1},
  stunt10k:{t:'\u041d\u0430\u0431\u0440\u0430\u0442\u044c 10 000 \u043e\u0447\u043a\u043e\u0432 \u0437\u0430 \u043e\u0434\u0438\u043d \u0437\u0430\u0435\u0437\u0434',g:10000,max:true},
  flips5:{t:'\u0421\u0434\u0435\u043b\u0430\u0442\u044c 5 \u0444\u043b\u0438\u043f\u043e\u0432 \u0432 \u0441\u0442\u0430\u043d\u0442\u0435',g:5},
  runs3:{t:'\u041f\u0440\u043e\u0435\u0445\u0430\u0442\u044c 3 \u0437\u0430\u0435\u0437\u0434\u0430',g:3},
  trade1:{t:'\u041a\u0443\u043f\u0438\u0442\u044c \u0438\u043b\u0438 \u043f\u0440\u043e\u0434\u0430\u0442\u044c \u043d\u043e\u043c\u0435\u0440 \u043d\u0430 \u0440\u044b\u043d\u043a\u0435',g:1},
  list2:{t:'\u0412\u044b\u0441\u0442\u0430\u0432\u0438\u0442\u044c 2 \u043d\u043e\u043c\u0435\u0440\u0430 \u043d\u0430 \u0440\u044b\u043d\u043e\u043a',g:2},
  quick3:{t:'\u0421\u0434\u0430\u0442\u044c \u0441\u043a\u0443\u043f\u0449\u0438\u043a\u0443 3 \u043d\u043e\u043c\u0435\u0440\u0430',g:3}
};
const num=(v,d=0)=>Number.isFinite(+v)?+v:d;
const fmtN=n=>Math.round(Number(n)||0).toLocaleString('ru-RU');
const fmt=n=>fmtN(n)+'\u00a0\u20bd';
const gem=n=>fmtN(n)+'\u00a0\u25c6';
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mskDate(t){return new Date((t||Date.now())+3*3600e3).toISOString().slice(0,10)}
const INVIS=/[\u0000-\u0009\u000b-\u001f\u007f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g;
function cleanNick(s){return String(s==null?'':s).replace(INVIS,'').replace(/\s+/g,' ').trim().slice(0,20)}
function cleanText(s,n){return String(s==null?'':s).replace(INVIS,'').trim().slice(0,n)}
function plateText(pl){return pl.c==='ru'?pl.p+pl.d+pl.s+' '+pl.r:pl.c==='ua'?pl.p+' '+pl.d+' '+pl.s:pl.d+' '+pl.s+' '+pl.r}
const LAT={'\u0410':'A','\u0412':'B','\u0415':'E','\u041a':'K','\u041c':'M','\u041d':'H','\u041e':'O','\u0420':'P','\u0421':'C','\u0422':'T','\u0423':'Y','\u0425':'X'};
const CYR={A:'\u0410',B:'\u0412',E:'\u0415',K:'\u041a',M:'\u041c',H:'\u041d',O:'\u041e',P:'\u0420',C:'\u0421',T:'\u0422',Y:'\u0423',X:'\u0425'};
const toLat=s=>String(s).toUpperCase().replace(/[\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425]/g,c=>LAT[c]).replace(/[^A-Z0-9]/g,'');
function parsePlateInput(c,str){
  let s=String(str||'').toUpperCase().replace(/[\s-]+/g,'');
  if(c==='ru'){s=s.replace(/[ABEKMHOPCTYX]/g,ch=>CYR[ch]);const m=s.match(/^([\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425])(\d{3})([\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425]{2})(\d{2,3})$/);return m?cleanPlate({c,p:m[1],d:m[2],s:m[3],r:m[4]}):null}
  s=toLat(s);
  if(c==='ua'){const m=s.match(/^([A-Z]{2})(\d{4})([A-Z]{2})$/);return m?cleanPlate({c,p:m[1],d:m[2],s:m[3],r:''}):null}
  const m=s.match(/^(\d{3})([A-Z]{3})(\d{2})$/);return m?cleanPlate({c:'kz',p:'',d:m[1],s:m[2],r:m[3]}):null;
}

/* ---------- \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0438\u0433\u0440\u043e\u043a\u0430 ---------- */
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

/* ---------- \u0441\u0435\u0437\u043e\u043d, \u0437\u0430\u0434\u0430\u043d\u0438\u044f, \u043d\u0430\u0433\u0440\u0430\u0434\u044b ---------- */
const seasonOn=now=>(now||Date.now())<SEASON.end;
const level=S=>Math.min(SEASON.max,Math.floor(S.xp/SEASON.lvlXp));
const lvlPct=S=>level(S)>=SEASON.max?100:Math.round((S.xp%SEASON.lvlXp)/SEASON.lvlXp*100);
const worth=S=>S.box.reduce((s,x)=>s+x.price,0);
function addXp(S,n,ctx){
  n=Math.round(n);if(!seasonOn(ctx.now)||!(n>0))return 0;
  const b=level(S);S.xp+=n;const a=level(S);
  if(a>b)ctx.notes.push('\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430 '+a+'! \u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u0436\u0434\u0451\u0442 \u0432\u043e \u0432\u043a\u043b\u0430\u0434\u043a\u0435 \u00ab\u0421\u0435\u0437\u043e\u043d\u00bb');
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
  if(cur<g&&nv>=g)ctx.notes.push('\u0417\u0430\u0434\u0430\u043d\u0438\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e: '+QUESTS[id].t);
}
function questReady(S,now){if(S.daily.d!==mskDate(now))return 0;return S.daily.q.filter(q=>num(S.daily.p[q])>=QUESTS[q].g&&!S.daily.done.includes(q)).length}
function claimable(S){const L=level(S);let n=0;for(let i=1;i<=L;i++){if(!S.cf.includes(i))n++;if(S.premium&&!S.cp.includes(i))n++}return n}
function rewardText(r){
  if(r.m)return{a:fmt(r.m),b:'\u043d\u0430 \u0431\u0430\u043b\u0430\u043d\u0441'};
  if(r.g)return{a:gem(r.g),b:'\u0433\u043e\u043b\u0434\u0430'};
  if(r.k)return{a:'\u041a\u043b\u044e\u0447 \u00ab'+KEYN[r.k]+'\u00bb'+(r.n>1?' \u00d7'+r.n:''),b:'\u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0439 \u043a\u0435\u0439\u0441'};
  if(r.car)return{a:'\u0426\u0432\u0435\u0442 \u00ab'+CARS[r.car].n+'\u00bb',b:'\u0434\u043b\u044f \u043c\u0430\u0448\u0438\u043d\u044b \u0432 \u0441\u0442\u0430\u043d\u0442\u0435'};
  if(r.plate){const a=appraise(r.plate);return{a:plateText(r.plate),b:a.rar.n+' \u00b7 '+fmt(a.price),plate:r.plate}}
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

/* ---------- \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u0438\u0433\u0440\u043e\u043a\u0430: \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e \u0440\u0430\u0431\u043e\u0442\u0430\u044e\u0442 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 ---------- */
function GameError(msg){const e=new Error(msg);e.game=true;return e}
const fail=msg=>{throw GameError(msg)};
const int=v=>Math.floor(num(v));
const ACTIONS={
  welcome(S){S.welcome='';return{}},
  inboxSeen(S){S.inbox=[];return{}},
  nick(S,p){const v=cleanNick(p.nick);if(v.length<2)fail('\u041d\u0438\u043a \u043e\u0442 2 \u0434\u043e 20 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432');S.nick=v;return{msg:'\u041d\u0438\u043a \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d'}},
  open(S,p,ctx){
    const tier=int(p.tier),t=TIERS[tier];if(!t)fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u043a\u0435\u0439\u0441\u0430');
    if(t.event&&!seasonOn(ctx.now))fail('\u0421\u0435\u0437\u043e\u043d \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0441\u044f');
    if(S.box.length>=BOX_CAP)fail('\u0413\u0430\u0440\u0430\u0436 \u043f\u043e\u043b\u043e\u043d. \u041f\u0440\u043e\u0434\u0430\u0439\u0442\u0435 \u043d\u043e\u043c\u0435\u0440\u0430, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0435\u0439\u0441');
    let c=['ru','ua','kz','mix'].includes(p.c)?p.c:'ru';
    if(p.key){if(!(S.keys[t.id]>0))fail('\u041a\u043b\u044e\u0447\u0435\u0439 \u044d\u0442\u043e\u0433\u043e \u043a\u0435\u0439\u0441\u0430 \u043d\u0435\u0442');S.keys[t.id]--}
    else{if(S.bal<t.price)fail('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0434\u0435\u043d\u0435\u0433 \u043d\u0430 \u044d\u0442\u043e\u0442 \u043a\u0435\u0439\u0441');S.bal-=t.price;S.spent+=t.price}
    if(c==='mix')c=pick(ALL);
    const win=bestOf(c,t.k,t.floor);
    const item=addPlate(S,win.pl,'case',ctx.now);S.opened++;
    addXp(S,t.xp,ctx);quest(S,'open5',1,false,ctx);if(tier>0)quest(S,'gold2',1,false,ctx);
    const rare=RIDX[win.a.rar.k]>=2;if(rare)quest(S,'rare1',1,false,ctx);
    return{id:item.id,pl:item.pl,tier,c,rare,price:item.price};
  },
  quick(S,p,ctx){const pay=sellQuick(S,int(p.id),ctx);if(pay<0)fail('\u041d\u043e\u043c\u0435\u0440 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');return{msg:'\u0421\u043a\u0443\u043f\u0449\u0438\u043a \u0437\u0430\u043f\u043b\u0430\u0442\u0438\u043b '+fmt(pay),pay}},
  bulk(S,p,ctx){
    const l=p.k==='cheap'?S.box.filter(x=>!x.pin&&x.price<RARITY[1].min):S.box.filter(x=>!x.pin);
    if(!l.length)fail('\u041d\u0435\u0447\u0435\u0433\u043e \u0441\u0434\u0430\u0432\u0430\u0442\u044c');let sum=0;l.forEach(x=>{sum+=sellQuick(S,x.id,ctx)});
    return{msg:'\u0421\u0434\u0430\u043d\u043e '+l.length+' \u0448\u0442. \u0437\u0430 '+fmt(sum)};
  },
  pin(S,p){const x=S.box.find(v=>v.id===int(p.id));if(!x)fail('\u041d\u043e\u043c\u0435\u0440 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d');x.pin=!x.pin;return{}},
  bonus(S,p,ctx){
    if(ctx.now<S.bonusAt)fail('\u041f\u043e\u0434\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043f\u043e\u043a\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430');
    if(S.bal>=TIERS[0].price)fail('\u041f\u043e\u0434\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430, \u043a\u043e\u0433\u0434\u0430 \u0434\u0435\u043d\u0435\u0433 \u043c\u0435\u043d\u044c\u0448\u0435 '+fmt(TIERS[0].price));
    S.bal+=BONUS;S.bonusAt=ctx.now+BONUS_CD;return{msg:'+'+fmt(BONUS)+' \u0437\u0430 \u043f\u043e\u0434\u0440\u0430\u0431\u043e\u0442\u043a\u0443'};
  },
  claim(S,p){const r=claimLevel(S,p.t==='p'?'p':'f',int(p.l));if(!r)fail('\u041d\u0430\u0433\u0440\u0430\u0434\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430');return{msg:'\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043e: '+rewardText(r).a}},
  claimAll(S){let n=0;for(let i=1;i<=level(S);i++){if(claimLevel(S,'f',i))n++;if(claimLevel(S,'p',i))n++}if(!n)fail('\u041d\u0435\u0447\u0435\u0433\u043e \u0437\u0430\u0431\u0438\u0440\u0430\u0442\u044c');return{msg:'\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043e \u043d\u0430\u0433\u0440\u0430\u0434: '+n}},
  questClaim(S,p,ctx){
    const q=String(p.id);ensureDaily(S,ctx.now);
    if(!S.daily.q.includes(q)||S.daily.done.includes(q)||num(S.daily.p[q])<QUESTS[q].g)fail('\u0417\u0430\u0434\u0430\u043d\u0438\u0435 \u0435\u0449\u0451 \u043d\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e');
    S.daily.done.push(q);S.bal+=300;addXp(S,350,ctx);return{msg:'+350 \u043e\u043f\u044b\u0442\u0430 \u0438 '+fmt(300)};
  },
  premium(S,p,ctx){
    if(S.premium)fail('\u041f\u0440\u0435\u043c\u0438\u0443\u043c \u0443\u0436\u0435 \u043e\u0442\u043a\u0440\u044b\u0442');if(!seasonOn(ctx.now))fail('\u0421\u0435\u0437\u043e\u043d \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0441\u044f');
    if(S.gold<SEASON.premium)fail('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(SEASON.premium-S.gold));
    S.gold-=SEASON.premium;S.premium=true;return{msg:'\u041f\u0440\u0435\u043c\u0438\u0443\u043c-\u043f\u0440\u043e\u043f\u0443\u0441\u043a \u043e\u0442\u043a\u0440\u044b\u0442. \u0417\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0430\u0433\u0440\u0430\u0434\u044b \u0437\u0430 \u043f\u0440\u043e\u0439\u0434\u0435\u043d\u043d\u044b\u0435 \u0443\u0440\u043e\u0432\u043d\u0438'};
  },
  buyKey(S,p,ctx){
    const k=String(p.k),c=GKEY[k];if(!c)fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u043a\u043b\u044e\u0447\u0430');if(k==='season'&&!seasonOn(ctx.now))fail('\u0421\u0435\u0437\u043e\u043d \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0441\u044f');
    if(S.gold<c)fail('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(c-S.gold));S.gold-=c;S.keys[k]=(S.keys[k]||0)+1;return{msg:'\u041a\u043b\u044e\u0447 \u00ab'+KEYN[k]+'\u00bb \u0432 \u0433\u0430\u0440\u0430\u0436\u0435'};
  },
  exch(S,p){const n=int(p.n);if(n!==1&&n!==10)fail('\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043e\u0431\u043c\u0435\u043d');if(S.gold<10*n)fail('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0433\u043e\u043b\u0434\u044b');S.gold-=10*n;S.bal+=500*n;return{msg:'+'+fmt(500*n)}},
  car(S,p){
    const id=String(p.id),c=CARS[id];if(!c)fail('\u041d\u0435\u0442 \u0442\u0430\u043a\u043e\u0433\u043e \u0446\u0432\u0435\u0442\u0430');
    if(S.cars.includes(id)){S.car=id;return{}}
    if(!c.cost)fail('\u042d\u0442\u043e\u0442 \u0446\u0432\u0435\u0442 \u0434\u0430\u0451\u0442 \u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u043f\u0443\u0441\u043a: '+(CAR_SRC[id]||''));
    if(S.gold<c.cost)fail('\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 '+gem(c.cost-S.gold));
    S.gold-=c.cost;S.cars.push(id);S.car=id;return{msg:'\u0426\u0432\u0435\u0442 \u00ab'+c.n+'\u00bb \u043a\u0443\u043f\u043b\u0435\u043d'};
  },
  stuntStart(S,p,ctx){const id=Math.random().toString(36).slice(2,10);S.run={id,t:ctx.now};return{run:id}},
  stuntEnd(S,p,ctx){
    if(!S.run||S.run.id!==String(p.run))fail('\u0417\u0430\u0435\u0437\u0434 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d, \u043d\u0430\u0447\u043d\u0438\u0442\u0435 \u043d\u043e\u0432\u044b\u0439');
    const el=(ctx.now-S.run.t)/1000;S.run=null;
    if(el<1.5)fail('\u0421\u043b\u0438\u0448\u043a\u043e\u043c \u043a\u043e\u0440\u043e\u0442\u043a\u0438\u0439 \u0437\u0430\u0435\u0437\u0434');
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
    return{msg:'\u0413\u0430\u0440\u0430\u0436 \u0438 \u0431\u0430\u043b\u0430\u043d\u0441 \u0441\u0431\u0440\u043e\u0448\u0435\u043d\u044b. \u0413\u043e\u043b\u0434\u0430 \u0438 \u0441\u0435\u0437\u043e\u043d \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u044b'};
  },
  // ----- \u0430\u0434\u043c\u0438\u043d: \u0441\u0435\u0431\u0435 -----
  admRub(S,p,ctx){needAdm(ctx);const n=int(p.n);if(!(n>0&&n<=1e9))fail('\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u0443\u043c\u043c\u0443 \u0434\u043e 1 000 000 000');S.bal+=n;return{msg:'+'+fmt(n)}},
  admGold(S,p,ctx){needAdm(ctx);const n=int(p.n);if(!(n>0&&n<=1e6))fail('\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043e\u0442 1 \u0434\u043e 1 000 000');S.gold+=n;return{msg:'+'+gem(n)}},
  admKey(S,p,ctx){needAdm(ctx);const k=String(p.k),n=int(p.n);if(!KEYN[k]||!(n>=1&&n<=1000))fail('\u041e\u0442 1 \u0434\u043e 1000 \u043a\u043b\u044e\u0447\u0435\u0439');S.keys[k]=(S.keys[k]||0)+n;return{msg:'\u041a\u043b\u044e\u0447 \u00ab'+KEYN[k]+'\u00bb \u00d7'+n}},
  admLvl(S,p,ctx){needAdm(ctx);const L=Math.max(0,Math.min(30,int(p.l)));S.xp=L*SEASON.lvlXp;return{msg:'\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430: '+L}},
  admPrem(S,p,ctx){needAdm(ctx);S.premium=!S.premium;return{msg:S.premium?'\u041f\u0440\u0435\u043c\u0438\u0443\u043c \u0432\u043a\u043b\u044e\u0447\u0451\u043d':'\u041f\u0440\u0435\u043c\u0438\u0443\u043c \u0432\u044b\u043a\u043b\u044e\u0447\u0435\u043d'}},
  admPlate(S,p,ctx){needAdm(ctx);const pl=parsePlateInput(String(p.c),p.text);if(!pl)fail('\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043d\u043e\u043c\u0435\u0440');addPlate(S,pl,'admin',ctx.now);return{msg:'\u041d\u043e\u043c\u0435\u0440 '+plateText(pl)+' \u0432 \u0433\u0430\u0440\u0430\u0436\u0435'}}
};
function needAdm(ctx){if(!ctx.admin)fail('\u0422\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430')}
function act(S,a,p,ctx){
  if(!Object.prototype.hasOwnProperty.call(ACTIONS,a))fail('\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435');
  ctx.notes=ctx.notes||[];ctx.now=ctx.now||Date.now();
  const r=ACTIONS[a](S,p&&typeof p==='object'?p:{},ctx)||{};
  r.notes=ctx.notes;return r;
}
// ==/LOGIC==

return{RU_LET,UA_LET,KZ_LET,RULES3,RULES4,LRULES,BASE,RARITY,RIDX,TIERS,REG,RMAP,genPlate,appraise,bestOf,cleanPlate,rarityOf,pick,rnd,ALL,BOX_CAP,BONUS,BONUS_CD,BUYBACK,FEE,MAX_LIST,STUNT_CAP,MIN_ASK,MAX_ASK,SEASON,CARS,CAR_SRC,KEYN,PACKS,GKEY,FREE,PREM,QUESTS,num,fmtN,fmt,gem,hashStr,mskDate,cleanNick,cleanText,plateText,toLat,parsePlateInput,fresh,normalize,seasonOn,level,lvlPct,worth,addXp,ensureDaily,quest,questReady,claimable,rewardText,addPlate,grant,claimLevel,inbox,sellQuick,GameError,ACTIONS,act};
});
