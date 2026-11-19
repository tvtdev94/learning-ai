// Homepage night sky: seeded star field, shooting stars, and the constellations the cosmos cursor draws.
// Star field: seeded so it looks the same on every visit.
var NS='http://www.w3.org/2000/svg',seed=11;
function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
function el(tag,a,p){var n=document.createElementNS(NS,tag);for(var k in a)n.setAttribute(k,a[k]);p.appendChild(n);return n}
var svg=el('svg',{viewBox:'0 0 1000 1000',preserveAspectRatio:'xMidYMid slice'},document.getElementById('sky'));
for(var i=0;i<140;i++){
  var c=el('circle',{'class':'d',cx:(rnd()*1000).toFixed(0),cy:(rnd()*1000).toFixed(0),r:(0.8+rnd()*1.6).toFixed(1),opacity:(0.15+rnd()*0.45).toFixed(2)},svg);
  if(i%6===0){c.setAttribute('class','d tw');c.style.animationDelay=(rnd()*5).toFixed(2)+'s'}
}
// Shooting stars: several streaks on staggered loops so one falls every second or two.
var sky0=document.getElementById('sky');
for(i=0;i<9;i++){
  var sh=document.createElement('span'),ang=12+rnd()*22,dist=40+rnd()*35,rad=ang*Math.PI/180;
  sh.className='shoot';
  sh.style.cssText='top:'+(rnd()*55).toFixed(1)+'%;left:'+(-10+rnd()*65).toFixed(1)+'%;width:'+(70+rnd()*100).toFixed(0)+'px;rotate:'+ang.toFixed(1)+'deg;'+
    '--tx:'+(dist*Math.cos(rad)).toFixed(1)+'vw;--ty:'+(dist*Math.sin(rad)).toFixed(1)+'vw;--dur:'+(6+rnd()*5).toFixed(1)+'s;--delay:'+(0.6+i*1.1+rnd()*0.8).toFixed(2)+'s';
  sky0.appendChild(sh);
}
// Constellations are kept so the cosmos cursor can draw them star by star.
var CONS=[];
[[90,120],[760,80],[820,640],[120,760]].forEach(function(o){
  var pts=[],x=o[0],y=o[1],cn={lines:[],stars:[]};
  for(var k=0;k<5;k++){pts.push([x,y]);x+=40+rnd()*70;y+=(rnd()-.4)*90}
  for(k=1;k<pts.length;k++)cn.lines.push(el('line',{x1:pts[k-1][0],y1:pts[k-1][1],x2:pts[k][0],y2:pts[k][1]},svg));
  pts.forEach(function(p){cn.stars.push(el('circle',{'class':'c',cx:p[0],cy:p[1],r:3},svg))});
  CONS.push(cn);
});

// Time of day in Vietnam (UTC+7) tints the sky: morning 05:00, afternoon 11:00, evening 16:30, night 19:00.
// The top glow moves with the sun, stars fade by day, shooting stars fall only after 16:30, and a small
// sun (06:00–18:00) or moon crosses the top of the sky. ?tod=<band> previews one band at a fixed hour.
// Only the sky changes; the page colours stay with the theme and the look.
var root=document.documentElement,orb=document.createElement('span');orb.className='orb';sky0.appendChild(orb);
var BAND={morning:8,afternoon:14,evening:17.5,night:22},fixed=new URLSearchParams(location.search).get('tod');
function vnHour(){var d=new Date(Date.now()+7*36e5);return d.getUTCHours()+d.getUTCMinutes()/60}
function tod(){
  var h=BAND[fixed]?BAND[fixed]:vnHour();
  root.setAttribute('data-tod',h>=5&&h<11?'morning':h>=11&&h<16.5?'afternoon':h>=16.5&&h<19?'evening':'night');
  // Left to right across 12 hours, highest at the middle of the arc.
  var sun=h>=6&&h<18,f=((sun?h-6:h+6)%24)/12;
  orb.classList.toggle('moon',!sun);
  orb.style.left=(6+f*88).toFixed(1)+'%';orb.style.top='calc(92px + '+((1-Math.sin(Math.PI*f))*16).toFixed(1)+'vh)';
}
tod();setInterval(tod,6e4);
document.addEventListener('visibilitychange',function(){if(!document.hidden)tod()});

export {CONS};
