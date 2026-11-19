// Homepage seasons: each look recolours the page accents (season.css), adds one signature
// decoration and sends shaped particles across the sky behind the content.
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
var KEY='home-season',layer=document.getElementById('season'),btn=document.getElementById('lookBtn'),panel=document.getElementById('lookPanel');
var ORDER=['auto','spring','summer','autumn','winter','tet','trungthu','noel','off'];
var NAMES={spring:['🌸','Mùa xuân','Spring'],summer:['🌊','Mùa hạ','Summer'],autumn:['🍁','Mùa thu','Autumn'],winter:['❄️','Mùa đông','Winter'],
  tet:['🧧','Tết','Lunar New Year'],trungthu:['🏮','Trung thu','Mid-Autumn'],noel:['🎄','Noel','Christmas'],off:['◯','Mặc định','Default']};
var season,choice;
// A separate seed keeps the star field unchanged and makes every look the same on each visit.
var ps;function pr(a,b){ps=(ps*16807)%2147483647;return a+ps/2147483647*(b-a)}
function f1(n){return n.toFixed(1)}

// Particles per look: [shape classes, count on wide screens, size range px, fall or rise time range s].
// Bigger pieces move faster, which reads as closer.
var PARTS={
  spring:[['petal fall',22,[9,15],[9,15]],['bfly',2,[18,24],[16,22]]],
  summer:[['fly',20,[3,5.5],[6,12]]],
  autumn:[['maple fall',10,[14,22],[7,12]],['oval fall',6,[11,16],[8,13]]],
  winter:[['snow fall',28,[3,7],[10,18]],['flake fall',12,[10,17],[8,13]]],
  noel:[['snow fall',22,[3,7],[10,18]],['flake fall',8,[10,16],[8,13]],['spark',6,[8,12],[12,18]]],
  tet:[['flower fall',26,[11,17],[10,16]]],
  trungthu:[['star rise',9,[18,26],[18,28]]]
};
function particles(){
  var narrow=innerWidth<600,html='';
  PARTS[season].forEach(function(g){
    var n=Math.round(g[1]*(narrow?.8:1.5));
    for(var i=0;i<n;i++){
      var cls=g[0],w=pr(g[2][0],g[2][1])*(cls==='fly'||cls==='snow fall'?1:1.3),k=(w-g[2][0])/(g[2][1]-g[2][0]),t=g[3][1]-k*(g[3][1]-g[3][0])+pr(-1,1),c='',st;
      if(cls==='petal fall')c=i%3?'var(--peach)':'var(--blush)';
      else if(cls==='bfly')c=i%2?'var(--peach)':'var(--mai)';
      else if(/maple|oval/.test(cls))c='var(--leaf'+(1+i%3)+')';
      else if(cls==='star rise')c=i%3?'var(--lamp)':'var(--mai)';
      else if(cls==='flower fall'){c=i%2?'var(--mai)':'var(--peach)';if(i%6===5){cls='lixi fall';w*=.75}}
      st='width:'+f1(w)+'px;height:'+f1(cls==='lixi fall'?w*1.35:cls==='bfly'?w*.8:w)+'px;--t:'+f1(t)+'s;--d:'+f1(-pr(0,t))+'s;--s:'+f1(pr(2.5,5))+'s;';
      if(c)st+='--c:'+c+';--c2:'+(i%2?'#c2410c':'#fff3a0')+';';
      if(cls==='fly'||cls==='bfly'){
        st+='left:'+f1(pr(4,94))+'%;top:'+f1(cls==='bfly'?pr(15,45):pr(25,92))+'%;--dx:'+f1(pr(-14,14))+'vw;--dy:'+f1(pr(-12,12))+'vh;';
      }else{
        // Leaves get blown far sideways; the rest drift gently.
        var wide=/maple|oval/.test(cls);
        st+='left:'+f1(pr(-4,100))+'%;--dx:'+f1(wide?pr(-30,30):pr(-10,10))+'vw;--w:'+pr(10,wide?60:36).toFixed(0)+'px;--r:'+((i%2?1:-1)*pr(240,720)).toFixed(0)+'deg;';
        if(cls==='snow fall')st+='--o:'+pr(.45,.9).toFixed(2)+';';
      }
      html+='<i class="'+cls+'" style="'+st+'"></i>';
    }
  });
  layer.insertAdjacentHTML('beforeend',html);
}

// Signature decorations, drawn as inline SVG in safe zones away from text and controls.
var SLICE=' preserveAspectRatio="xMidYMax slice" aria-hidden="true"';
function drift(){return '<svg class="ground" viewBox="0 0 1200 48"'+SLICE+'><path fill="var(--drift)" d="M0 48V26C90 12 170 30 280 22S470 8 590 20S800 34 920 22S1110 10 1200 24V48Z"/></svg>'}
function flower(x,y,r,fill){
  var g='<g transform="translate('+x+' '+y+') scale('+r/12+')" fill="'+fill+'">';
  for(var a=0;a<360;a+=72)g+='<ellipse cy="-6" rx="4.6" ry="6" transform="rotate('+a+')"/>';
  return g+'<circle r="2.6" fill="#c2410c"/></g>';
}
function maple(x,y,s,rot,fill){return '<path fill="'+fill+'" transform="translate('+x+' '+y+') rotate('+rot+') scale('+s+') translate(-12 -12)" d="M12 1l2 4.5 3-1.5-1 5 4.5-1.5-2 4 3.5 1.5-6 3.5 1 2.5-4.5-1V24h-1v-5.5l-4.5 1 1-2.5-6-3.5 3.5-1.5-2-4L8 9.5l-1-5 3 1.5z"/>'}
function tree(x,h){
  var w=h*.42,y=170-h,s='<rect x="'+(x-3)+'" y="'+(170-h*.14)+'" width="6" height="'+h*.14+'" fill="var(--bark)"/>';
  [0,.28,.52].forEach(function(f,i){var top=y+h*f,base=top+h*.42;s+='<path fill="var(--pine)" d="M'+x+' '+top+'L'+(x+w*(.6+i*.2))+' '+base+'H'+(x-w*(.6+i*.2))+'Z"/>'});
  [[-.3,.45,'#ff6b7a'],[.35,.6,'var(--gold)'],[-.15,.72,'#8fe1ff'],[.2,.32,'#ff6b7a'],[-.4,.8,'var(--gold)']].forEach(function(b,i){
    s+='<circle class="bulb" style="animation-delay:'+(-i*.4)+'s" cx="'+(x+w*b[0]*1.4)+'" cy="'+(y+h*b[1])+'" r="3.2" fill="'+b[2]+'"/>';
  });
  return s+'<path fill="var(--gold)" transform="translate('+x+' '+(y-2)+') scale(.55)" d="M0-10l3 6.2 6.6.9-4.8 4.6 1.2 6.6L0 5.1l-6 3.2 1.2-6.6-4.8-4.6 6.6-.9z"/>';
}
function hang(inner){
  return ['l','r'].map(function(side){return '<svg class="hang '+side+'" viewBox="0 0 44 130" aria-hidden="true"><path d="M22 0V44" stroke="var(--gold)" stroke-width="1.5"/>'+inner+'</svg>'}).join('');
}
var DECO={
  spring:function(){
    var g='',fl='';
    for(var x=0;x<1200;x+=7){var h=pr(10,26);g+='M'+x+' 48L'+f1(x+2+pr(-2,2))+' '+f1(48-h)+'L'+(x+5)+' 48Z'}
    for(var i=0;i<18;i++)fl+='<circle cx="'+f1(pr(10,1190))+'" cy="'+f1(pr(26,36))+'" r="2.6" fill="'+(i%2?'var(--blush)':'var(--peach)')+'"/>';
    return '<svg class="ground" viewBox="0 0 1200 48"'+SLICE+' opacity=".55"><path fill="var(--grass)" d="'+g+'"/>'+fl+'</svg>';
  },
  summer:function(){
    var s='<svg class="ground" viewBox="0 0 1200 48"'+SLICE+'>';
    [[22,.25,9],[30,.18,14],[38,.12,20]].forEach(function(w){
      var d='M-200 '+w[0];for(var i=0;i<8;i++)d+=' q50 -7 100 0 t100 0';
      s+='<path class="wave" style="--t:'+w[2]+'s" fill="var(--sea)" opacity="'+w[1]+'" d="'+d+' V48 H-200Z"/>';
    });
    return s+'</svg>';
  },
  autumn:function(){
    var s='<svg class="corner" viewBox="0 0 220 120" aria-hidden="true">';
    for(var i=0;i<11;i++)s+=maple(f1(pr(40,215)),f1(pr(70,112)),f1(pr(1.2,2.2)),pr(-60,60).toFixed(0),'var(--leaf'+(1+i%3)+')');
    return s+'</svg>';
  },
  winter:drift,
  noel:function(){return drift()+'<svg class="corner" viewBox="0 0 200 170" aria-hidden="true">'+tree(70,110)+tree(150,150)+'</svg>'},
  tet:function(){
    var s='<svg class="corner" viewBox="0 0 220 170" aria-hidden="true"><g fill="none" stroke="var(--bark)" stroke-linecap="round">'+
      '<path stroke-width="5" d="M222 160C170 150 130 128 100 96S48 44 18 34"/><path stroke-width="3" d="M150 136C138 116 142 98 158 82"/><path stroke-width="3" d="M84 78C72 64 74 50 88 40"/></g>';
    [[30,36,9,'var(--mai)'],[62,58,8,'var(--peach)'],[96,94,10,'var(--mai)'],[88,40,7,'var(--mai)'],[124,118,9,'var(--peach)'],[158,82,8,'var(--mai)'],[176,148,10,'var(--mai)'],[146,104,7,'var(--peach)']]
      .forEach(function(f){s+=flower(f[0],f[1],f[2],f[3])});
    return s+'</svg>'+hang('<path d="M14 44h16v6H14z" fill="var(--gold)"/><ellipse cx="22" cy="74" rx="18" ry="24" fill="#d62828"/><path d="M22 50v48M10 56q-4 18 0 36M34 56q4 18 0 36" stroke="#a11d1d" stroke-width="1.2" fill="none"/><path d="M14 98h16v5H14z" fill="var(--gold)"/><path d="M22 103v20M18 103v16M26 103v16" stroke="var(--gold)" stroke-width="1.5"/>');
  },
  trungthu:function(){
    return '<div class="moon"></div>'+hang('<g transform="translate(22 72) scale(1.6)"><circle r="11" fill="none" stroke="var(--gold)" stroke-width="1"/><path fill="#d62828" d="M0-10l3 6.2 6.6.9-4.8 4.6 1.2 6.6L0 5.1l-6 3.2 1.2-6.6-4.8-4.6 6.6-.9z"/><circle r="3" fill="#ffe680"/></g><path d="M22 90v26" stroke="var(--gold)" stroke-width="1.5"/>');
  }
};

// Tết fireworks: every few seconds a rocket climbs to a random spot in the upper sky and bursts.
// They run only while the page is visible, and never with reduced motion.
var fwTimer=0,FW=['var(--fw1)','var(--fw2)','var(--fw3)','var(--fw4)'];
function fireworks(){
  clearTimeout(fwTimer);
  if(season!=='tet'||reduce)return;
  if(!document.hidden){launch();if(Math.random()<.35)setTimeout(launch,250+Math.random()*400)}
  fwTimer=setTimeout(fireworks,1300+Math.random()*1900);
}
function launch(){
  var x=6+Math.random()*88,y=5+Math.random()*23,c=FW[Math.floor(Math.random()*FW.length)],climb=Math.min(innerHeight*.45,280);
  var r=document.createElement('b');r.className='rocket';r.style.cssText='left:'+x+'%;top:'+y+'%;--c:'+c;layer.appendChild(r);
  r.animate([{translate:'0 '+climb+'px',opacity:0},{opacity:1,offset:.25},{translate:'0 0',opacity:.9}],{duration:750,easing:'cubic-bezier(.2,.7,.4,1)'})
    .onfinish=function(){r.remove();burst(x+'%',y+'%',c,layer)};
}
// Sparks fly out from (left, top), CSS lengths inside host, then fall away.
function burst(x,y,c,host){
  var n=innerWidth<600?24:40,R=innerWidth<600?60+Math.random()*40:100+Math.random()*80,two=Math.random()<.4?FW[Math.floor(Math.random()*FW.length)]:c;
  var fl=document.createElement('b');fl.className='flash';fl.style.cssText='left:'+x+';top:'+y+';--c:'+c;host.appendChild(fl);
  fl.animate([{opacity:.9,scale:.3},{opacity:0,scale:1.6}],{duration:500,easing:'ease-out'}).onfinish=function(){fl.remove()};
  for(var i=0;i<n;i++){
    var a=i/n*Math.PI*2+Math.random()*.2,d=R*(.7+Math.random()*.3),s=document.createElement('b');
    s.style.cssText='left:'+x+';top:'+y+';--c:'+(i%2?two:c);host.appendChild(s);
    s.animate([{translate:'0 0',opacity:1,scale:1.2},{translate:f1(Math.cos(a)*d)+'px '+f1(Math.sin(a)*d)+'px',opacity:.9,scale:1,offset:.55},{translate:f1(Math.cos(a)*d*1.08)+'px '+f1(Math.sin(a)*d*1.08+36)+'px',opacity:0,scale:.4}],
      {duration:1300+Math.random()*500,easing:'cubic-bezier(.15,.7,.3,1)'}).onfinish=function(){this.effect.target.remove()};
  }
}
// Tapping the photo sets off the current look's effect at the tap point, above the page.
var fx=document.createElement('div');fx.className='fx';fx.setAttribute('aria-hidden','true');document.body.appendChild(fx);
function gone(){this.effect.target.remove()}
function piece(cls,x,y,w,h,c){
  var e=document.createElement('i');e.className=cls;
  e.style.cssText='left:'+f1(x-w/2)+'px;top:'+f1(y-h/2)+'px;width:'+f1(w)+'px;height:'+f1(h)+'px'+(c?';--c:'+c:'');
  fx.appendChild(e);return e;
}
// Pieces pop out around (x, y), drift, then fall (or float up when fall is negative) and fade.
function spray(cls,colors,n,x,y,size,spread,fall,spin){
  for(var i=0;i<n;i++){
    var k=cls[i%cls.length],w=size*(.8+Math.random()*.5),e=piece(k,x,y,w,k==='lixi'?w*1.35:w,colors&&colors[i%colors.length]);
    var a=Math.random()*Math.PI*2,d=spread*(.4+Math.random()*.6),dx=Math.cos(a)*d,dy=Math.sin(a)*d*.8,r=(Math.random()<.5?-1:1)*spin;
    e.animate([{translate:'0 0',rotate:'0deg',opacity:1,scale:.4},{translate:f1(dx)+'px '+f1(dy)+'px',rotate:f1(r*.4)+'deg',opacity:1,scale:1,offset:.3},
      {translate:f1(dx*1.3)+'px '+f1(dy+fall*(.7+Math.random()*.6))+'px',rotate:f1(r)+'deg',opacity:0,scale:.9}],
      {duration:1500+Math.random()*700,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=gone;
  }
}
function lantern(x,y,size,delay){
  var e=piece('star',x,y,size,size,Math.random()<.7?'var(--lamp)':'var(--mai)'),up=innerHeight*(.45+Math.random()*.2),sw=20+Math.random()*25;
  e.animate([{translate:'0 0',opacity:0,scale:.5},{translate:sw+'px '+(-up*.35)+'px',opacity:1,scale:1,offset:.3},{translate:(-sw)+'px '+(-up*.7)+'px',opacity:1,offset:.65},{translate:'0 '+(-up)+'px',opacity:0}],
    {duration:4200,delay:delay,easing:'ease-out',fill:'backwards'}).onfinish=gone;
}
var TAP={
  spring:function(x,y){spray(['petal'],['var(--peach)','var(--blush)'],16,x,y,14,110,150,540)},
  summer:function(x,y){spray(['fly'],null,16,x,y,5,120,-60,0)},
  autumn:function(x,y){spray(['maple','oval'],['var(--leaf1)','var(--leaf2)','var(--leaf3)'],14,x,y,18,110,170,600)},
  winter:function(x,y){spray(['flake','snow'],null,18,x,y,12,120,130,360)},
  noel:function(x,y){spray(['flake','snow','spark'],null,20,x,y,12,120,130,360)},
  tet:function(x,y){burst(x+'px',y+'px',FW[Math.floor(Math.random()*FW.length)],fx);spray(['flower','lixi'],['var(--mai)','var(--peach)'],8,x,y,14,90,160,360)},
  trungthu:function(x,y){lantern(x,y,30,0);lantern(x-40,y+10,20,350);lantern(x+40,y+10,22,700)}
};
document.getElementById('me').addEventListener('click',function(e){
  if(reduce||!TAP[season])return;
  TAP[season](e.clientX,e.clientY);
});
// Occasion greetings lead the typed role line while that look is on.
var GREET={tet:['Chúc mừng năm mới 🧧','Happy Lunar New Year 🧧'],trungthu:['Trung thu vui vẻ 🏮','Happy Mid-Autumn Festival 🏮'],
  noel:['Giáng sinh an lành 🎄','Merry Christmas 🎄']};
function greeting(lang){var g=GREET[season];return g?g[lang==='en'?1:0]:''}
function saved(){try{var v=localStorage.getItem(KEY);return NAMES[v]?v:'auto'}catch(e){return 'auto'}}
function apply(next){
  season=next;root.setAttribute('data-season',season);layer.textContent='';
  if(season==='off')return;
  ps=29;layer.innerHTML=DECO[season]();
  if(!reduce)particles();
}
function choose(c){choice=c;apply(c==='auto'?pickSeason():c);fireworks();render()}
// The button names the look on screen; the panel lists every look, with the current choice pressed.
function render(){
  var en=root.lang==='en',i=en?2:1,cal=NAMES[pickSeason()],cur=NAMES[season];
  btn.innerHTML='<span aria-hidden="true">'+cur[0]+'</span>'+cur[i];
  btn.setAttribute('aria-label',(en?'Page look: ':'Giao diện: ')+cur[i]+(choice==='auto'?(en?' (auto)':' (tự động)'):''));
  panel.setAttribute('aria-label',en?'Page look':'Giao diện trang');
  panel.innerHTML=ORDER.map(function(k){
    var n=k==='auto'?cal:NAMES[k],name=k==='auto'?(en?'Auto':'Tự động'):n[i];
    var tip=k==='auto'?' title="'+(en?'Follows the calendar: ':'Theo lịch: ')+cal[i]+'"':'';
    return '<button type="button" data-k="'+k+'" aria-pressed="'+(k===choice)+'"'+tip+'><span aria-hidden="true">'+n[0]+'</span>'+name+'</button>';
  }).join('');
  btn.hidden=false;
}
function openPanel(open){
  panel.hidden=!open;btn.setAttribute('aria-expanded',String(open));
  if(open)(panel.querySelector('[aria-pressed="true"]')||panel.firstChild).focus();
}
btn.addEventListener('click',function(){openPanel(panel.hidden)});
panel.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  try{if(b.dataset.k==='auto')localStorage.removeItem(KEY);else localStorage.setItem(KEY,b.dataset.k)}catch(err){}
  choose(b.dataset.k);openPanel(false);btn.focus();
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){openPanel(false);btn.focus()}});
document.addEventListener('click',function(e){if(!panel.hidden&&!e.target.closest('.look'))openPanel(false)});
// The language switch sets <html lang>; relabel when it changes.
new MutationObserver(render).observe(root,{attributes:true,attributeFilter:['lang']});
var preview=/[?&]season=(spring|summer|autumn|winter|tet|trungthu|noel)\b/.exec(location.search);
choose(preview?preview[1]:saved());

export {greeting};
