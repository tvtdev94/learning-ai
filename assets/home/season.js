var root=document.documentElement;
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Seasons follow the date in Vietnam (UTC+7): spring Feb–Apr, summer May–Jul, autumn Aug–Oct, winter Nov–Jan.
// Tết, Trung thu and Noel take over for a few days around each holiday. Add ?season=<name> to preview one.
// LUNAR holds [Tết = 1st of month 1, Trung thu = 15th of month 8] as MMDD on the Vietnamese lunar calendar,
// made by _work/lunar-dates.js. Past 2040 the page falls back to the four seasons.
var LUNAR={2026:['0217','0925'],2027:['0206','0915'],2028:['0126','1003'],2029:['0213','0922'],2030:['0202','0912'],
  2031:['0123','1001'],2032:['0211','0919'],2033:['0131','0908'],2034:['0219','0926'],2035:['0208','0916'],
  2036:['0128','1004'],2037:['0215','0924'],2038:['0204','0913'],2039:['0124','1002'],2040:['0212','0920']};
function pickSeason(){
  var vn=new Date(Date.now()+7*36e5),y=vn.getUTCFullYear(),m=vn.getUTCMonth()+1,d=vn.getUTCDate();
  var today=Date.UTC(y,m-1,d)/864e5,L=LUNAR[y];
  function off(mmdd){return today-Date.UTC(y,+mmdd.slice(0,2)-1,+mmdd.slice(2))/864e5}
  if(L){
    var t=off(L[0]);if(t>=-5&&t<=7)return 'tet';
    t=off(L[1]);if(t>=-5&&t<=1)return 'trungthu';
  }
  if(m===12&&d>=20&&d<=26)return 'noel';
  return m>=2&&m<=4?'spring':m>=5&&m<=7?'summer':m>=8&&m<=10?'autumn':'winter';
}
// Visitors pick the look in the footer: auto (follows the calendar), any season or holiday, or the
// default look. The choice is saved on this device; auto saves nothing. ?season=<name> previews one
// season for that page view without touching the saved choice.
var KEY='home-season',layer=document.getElementById('season'),pick=document.getElementById('seasonPick');
var ORDER=['auto','spring','summer','autumn','winter','tet','trungthu','noel','off'];
var NAMES={spring:['🌸','Mùa xuân','Spring'],summer:['☀️','Mùa hạ','Summer'],autumn:['🍂','Mùa thu','Autumn'],winter:['❄️','Mùa đông','Winter'],
  tet:['🧧','Tết','Lunar New Year'],trungthu:['🏮','Trung thu','Mid-Autumn'],noel:['🎄','Noel','Christmas'],off:['◯','Mặc định','Default']};
var season,choice;
function saved(){try{var v=localStorage.getItem(KEY);return NAMES[v]?v:'auto'}catch(e){return 'auto'}}
function apply(next){
  season=next;root.setAttribute('data-season',season);layer.textContent='';
  if(season==='trungthu'){var moon=document.createElement('div');moon.className='moon';layer.appendChild(moon)}
  if(season!=='off'&&!reduce)particles();
}
function choose(c){choice=c;apply(c==='auto'?pickSeason():c);label()}
// Options are rebuilt on each language change; auto names the season the calendar gives today.
function label(){
  var en=root.lang==='en',i=en?2:1;
  pick.innerHTML=ORDER.map(function(k){
    var n=NAMES[k==='auto'?pickSeason():k],text=k==='auto'?n[0]+' '+(en?'Auto':'Tự động')+' · '+n[i]:n[0]+' '+n[i];
    return '<option value="'+k+'">'+text+'</option>';
  }).join('');
  pick.value=ORDER.indexOf(choice)<0?'auto':choice;
  pick.setAttribute('aria-label',en?'Page look':'Giao diện trang');pick.title=pick.getAttribute('aria-label');
  pick.hidden=false;
}
function particles(){
  // A separate seed keeps the star field and constellations unchanged.
  var ps=29;function pr(a,b){ps=(ps*16807)%2147483647;return a+ps/2147483647*(b-a)}
  var narrow=innerWidth<600;
  var KIND={spring:['petal',22],summer:['fly',18],autumn:['leaf',16],winter:['snow',40],tet:['petal',34],trungthu:['lamp',10],noel:['snow',44]}[season];
  var n=Math.round(KIND[1]*(narrow?.55:1)),kind=KIND[0];
  for(var i=0;i<n;i++){
    var p=document.createElement('i'),s=p.style,w,t;
    p.className=kind;
    if(kind==='fly'){
      w=pr(3,5.5);s.left=pr(2,98).toFixed(1)+'%';s.top=pr(25,95).toFixed(1)+'%';
      s.setProperty('--dx',pr(-12,12).toFixed(1)+'vw');s.setProperty('--dy',pr(-10,10).toFixed(1)+'vh');
      t=pr(6,12);s.setProperty('--s',pr(2,4).toFixed(1)+'s');
    }else{
      s.left=pr(-2,100).toFixed(1)+'%';s.setProperty('--dx',pr(-10,10).toFixed(1)+'vw');
      s.setProperty('--w',pr(10,38).toFixed(0)+'px');s.setProperty('--s',pr(2.5,5).toFixed(1)+'s');
      if(kind==='snow'){w=pr(3,7.5);t=pr(9,18);s.setProperty('--o',pr(.45,.9).toFixed(2))}
      else if(kind==='lamp'){w=pr(13,20);t=pr(18,30);s.setProperty('--c',i%3?'var(--lamp)':'var(--lamp2)')}
      else{
        w=kind==='leaf'?pr(10,16):pr(9,14);t=pr(10,16);
        s.setProperty('--r',(i%2?1:-1)*pr(300,720).toFixed(0)+'deg');
        s.setProperty('--c',kind==='leaf'?'var(--leaf'+(1+i%3)+')':i%2?'var(--mai)':'var(--peach)');
      }
    }
    s.width=w.toFixed(1)+'px';s.height=(w*(kind==='lamp'?1.3:kind==='snow'||kind==='fly'?1:.8)).toFixed(1)+'px';
    s.setProperty('--t',t.toFixed(1)+'s');s.setProperty('--d',(-pr(0,t)).toFixed(1)+'s');
    layer.appendChild(p);
  }
}
pick.addEventListener('change',function(){
  try{if(pick.value==='auto')localStorage.removeItem(KEY);else localStorage.setItem(KEY,pick.value)}catch(e){}
  choose(pick.value);
});
// The language switch sets <html lang>; relabel the options when it changes.
new MutationObserver(label).observe(root,{attributes:true,attributeFilter:['lang']});
var preview=/[?&]season=(spring|summer|autumn|winter|tet|trungthu|noel)\b/.exec(location.search);
choose(preview?preview[1]:saved());
