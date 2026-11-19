import {CONS} from './sky.js';
import {lang,ripple,typeRole,showFirstRole} from './profile.js';

var root=document.documentElement;
var me=document.getElementById('me'),orbit=document.getElementById('orbit'),typed=document.getElementById('typed');
var btn=document.getElementById('themeBtn'),langBtn=document.getElementById('langBtn');

// Five cursors assemble the page on open. Each drag moves exactly one small piece:
// a word, a menu link, an icon, a chip. Rings are resized, constellations are drawn.
var layer=document.getElementById('cursors'),replay=document.getElementById('replay'),running=[],timers=[];
// Each cursor is named after its job.
var CUR=[{vi:'Bố cục',en:'Layout',color:'#2f6fe0'},{vi:'Chữ',en:'Typography',color:'#8b4fd8'},{vi:'Nội dung',en:'Content',color:'#0f8a5f'},{vi:'Liên hệ',en:'Contact',color:'#c2410c'},{vi:'Vũ trụ',en:'Cosmos',color:'#be185d'}];
var EASE='cubic-bezier(.22,1,.36,1)',INOUT='cubic-bezier(.65,0,.35,1)',DIVE='cubic-bezier(.5,0,.9,.5)',APPROACH=340,PRESS=90,MOVE=480;
function later(fn,ms){timers.push(setTimeout(fn,ms))}
function stop(){
  clearTimeout(idleT);running.forEach(function(a){a.cancel()});running=[];timers.forEach(clearTimeout);timers=[];layer.textContent='';
  root.classList.remove('building');document.querySelectorAll('.grab,.fallen').forEach(function(e){e.classList.remove('grab','fallen')});
}
// Rings spin, so their client rect wobbles; derive their box from the orbit instead.
function ringBox(k){var o=orbit.getBoundingClientRect();return {left:o.left+o.width*k,top:o.top+o.height*k,width:o.width*(1-2*k),height:o.height*(1-2*k)}}
function pt(el,fx,fy){var r=el.getBoundingClientRect();return {x:r.left+scrollX+r.width*fx,y:r.top+scrollY+r.height*fy}}
function burst(x,y,color,at){
  var b=document.createElement('span');b.className='burst';b.style.cssText='left:'+x+'px;top:'+y+'px;border-color:'+color;layer.appendChild(b);
  running.push(b.animate([{opacity:0,scale:.2,offset:0},{opacity:.9,scale:.3,offset:.05},{opacity:0,scale:2.4}],{duration:520,delay:at,easing:EASE,fill:'both'}));
}
function grabFx(el,c,from,to){
  later(function(){el.style.setProperty('--gc',CUR[c].color);el.classList.add('grab')},from);
  later(function(){el.classList.remove('grab');running.push(el.animate([{scale:1.04},{scale:1}],{duration:260,easing:EASE}))},to);
}
// Box overlap area, used to keep scattered and fallen pieces from landing on each other.
function box(el,pad){var r=el.getBoundingClientRect();pad=pad||0;return {l:r.left+scrollX-pad,t:r.top+scrollY-pad,w:r.width+2*pad,h:r.height+2*pad}}
function overlap(b,occ){var o=0;occ.forEach(function(q){o+=Math.max(0,Math.min(b.l+b.w,q.l+q.w)-Math.max(b.l,q.l))*Math.max(0,Math.min(b.t+b.h,q.t+q.h)-Math.max(b.t,q.t))});return o}
// Try the preferred offset first, then offsets on growing circles; take the first that
// stays on screen and touches nothing, else the one with the least overlap.
function freeSpot(b,cands,occ,vw,top,bottom){
  var best=null,bestO=Infinity;
  for(var i=0;i<cands.length&&bestO>0;i++){
    var c=cands[i],m={l:b.l+c[0],t:b.t+c[1],w:b.w,h:b.h};
    if(m.l<4||m.l+m.w>vw-4||m.t<top+4||m.t+m.h>bottom-4)continue;
    var o=overlap(m,occ);if(o<bestO){bestO=o;best=c}
  }
  return best||cands[0];
}
function ringCands(pref){
  var c=[pref];for(var d=40;d<=200;d+=30)for(var a=0;a<360;a+=30)c.push([Math.round(Math.cos(a*Math.PI/180)*d),Math.round(Math.sin(a*Math.PI/180)*d)]);
  for(d=40;d<=360;d+=40)c.push([0,d],[0,-d]);return c;
}
// Fallback: every spot on screen on a 16px grid, nearest first.
function gridCands(b,vw,top,bottom){
  var c=[];for(var y=top+4;y+b.h<bottom-4;y+=16)for(var x=4;x+b.w<vw-4;x+=16)c.push([Math.round(x-b.l),Math.round(y-b.t)]);
  return c.sort(function(p,q){return p[0]*p[0]+p[1]*p[1]-q[0]*q[0]-q[1]*q[1]});
}
// The box a piece covers when turned by deg, around its centre.
function turned(b,deg,k){k=k||1;var a=Math.abs(deg)*Math.PI/180,w=(b.w*Math.cos(a)+b.h*Math.sin(a))*k,h=(b.w*Math.sin(a)+b.h*Math.cos(a))*k;return {l:b.l+(b.w-w)/2,t:b.t+(b.h-h)/2,w:w,h:h}}
function assemble(){
  stop();replay.hidden=true;typed.textContent='';root.classList.add('building');
  var vw=document.documentElement.clientWidth,vh=innerHeight,Q=function(q){return document.querySelector(q)},QA=function(q){return [].slice.call(document.querySelectorAll(q))};
  var w=QA('h1 .w'),ic=QA('.dock a'),menus=QA('.nav .menu'),chips=QA('.chip'),hs=QA('.handles span'),rings=QA('.ring'),mark=Q('.bio mark');
  var o=orbit.getBoundingClientRect(),OC={x:o.left+scrollX+o.width/2,y:o.top+scrollY+o.height/2},OW=o.width;
  // Task: ['d', el, grab x, grab y, offset x, offset y, rotate] drags one piece;
  // ['r', ring, angle, start inset] resizes a ring; ['s', constellation] draws one; ['h'] highlights the bio.
  var D=function(el,fx,fy,dx,dy,r){return ['d',el,fx,fy,dx,dy,r]};
  var jobs=[
    [D(me,.5,.5,-60,46,-10),D(Q('.mono'),.5,.5,-40,34,-8),D(menus[0],.5,.5,-30,44,-8),D(menus[1],.5,.5,24,52,6),D(menus[2],.5,.5,40,38,-5),D(langBtn,.5,.5,30,44,15),D(btn,.5,.5,-24,48,-20)],
    [D(w[0],.5,.55,-50,70,-12),D(w[1],.5,.55,40,-60,9),D(w[2],.5,.55,60,80,-8),D(Q('.bio'),.12,.3,-30,60,3),['h']],
    [D(Q('.role'),.18,.5,70,-34,-7)].concat(chips.map(function(ch,i){var v=[[-50,-40,-12],[60,-30,10],[-40,50,8],[50,45,-10],[-60,20,14]][i%5];return D(ch,.5,.5,v[0],v[1],v[2])})),
    ic.map(function(a,i){var v=[[-40,90,-20],[30,110,15],[-20,100,-18],[50,80,22]][i];return D(a,.5,.5,v[0],v[1],v[2])}).concat([D(hs[0],.3,.5,40,50,4),D(hs[1],.5,.5,-30,44,-4)]),
    [['r',rings[0],200,28],['r',rings[1],-40,21],['r',rings[2],120,13]].concat(CONS.map(function(cn){return ['s',cn]}))
  ];
  // Work out when each piece is picked up and dropped, before choosing where it scatters.
  jobs.forEach(function(list,c){var t=80+c*140;list.forEach(function(j){
    if(j[0]==='d'){j.ga=t+APPROACH;j.da=j.ga+PRESS+MOVE;t=j.da+80}
    else if(j[0]==='r'){t+=APPROACH+PRESS+MOVE+120+80}
    else if(j[0]==='s'){
      j.p=j[1].stars.map(function(c){var r=c.getBoundingClientRect();return {x:r.left+scrollX+r.width/2,y:r.top+scrollY+r.height/2}});
      // Only draw constellations that are fully on screen; the rest simply stay as they are.
      j.skip=j.p.some(function(q){return q.x<12||q.x>vw-12||q.y<scrollY+12||q.y>scrollY+vh-12});
      if(!j.skip)t+=APPROACH+(j.p.length-1)*380+80+60;
    }else if(j[0]==='h')t+=APPROACH+1000;
  })});
  // Scatter: a piece waits at its spot from the start until it is picked up. That spot must
  // not touch any other waiting piece, nor the home of a piece dropped before this one leaves.
  // Waiting pieces shrink a little (more on narrow screens) so they all find empty room.
  var SK=vw<600?.7:.85;
  var drags=[];jobs.forEach(function(list){list.forEach(function(j){if(j[0]==='d')drags.push(j)})});
  // The role line grows as its text is typed, so it reserves its whole box.
  var homes=drags.map(function(j){return box(j[1].classList.contains('role')?j[1].parentNode:j[1],6)}),waits=[];
  drags.forEach(function(j,i){
    var occ=waits.slice();
    drags.forEach(function(k,n){if(n!==i&&k.da<j.ga)occ.push(homes[n])});
    var tb=turned(homes[i],j[6],SK),c=freeSpot(tb,ringCands([j[4],j[5]]).concat(gridCands(tb,vw,scrollY,scrollY+vh)),occ,vw,scrollY,scrollY+vh);
    j[4]=c[0];j[5]=c[1];waits.push({l:tb.l+c[0],t:tb.t+c[1],w:tb.w,h:tb.h});
  });
  // Measure everything before any piece moves.
  jobs.forEach(function(list){list.forEach(function(j){
    if(j[0]==='d'){
      var el=j[1],r=el.getBoundingClientRect(),cx=r.left+scrollX+r.width/2,cy=r.top+scrollY+r.height/2,g=pt(el,j[2],j[3]);
      var a=j[6]*Math.PI/180,vx=(g.x-cx)*SK,vy=(g.y-cy)*SK;
      j.g=g;j.s={x:cx+j[4]+vx*Math.cos(a)-vy*Math.sin(a),y:cy+j[5]+vx*Math.sin(a)+vy*Math.cos(a)};
    }else if(j[0]==='r'){
      var k1=parseFloat(j[1].style.getPropertyValue('--in'))/100,k0=j[3]/100,ph=j[2]*Math.PI/180;
      j.k1=k1;j.s={x:OC.x+Math.cos(ph)*OW*(.5-k0),y:OC.y+Math.sin(ph)*OW*(.5-k0)};j.g={x:OC.x+Math.cos(ph)*OW*(.5-k1),y:OC.y+Math.sin(ph)*OW*(.5-k1)};
    }
  })});
  var A=pt(me,.5,.5),RAD=me.getBoundingClientRect().width/2;
  var mr=mark.getClientRects(),ma=mr[0],mb=mr[mr.length-1];
  var starts=[{x:-40,y:scrollY+vh*.75},{x:vw+40,y:scrollY+vh*.35},{x:vw*.75,y:scrollY-40},{x:vw*.3,y:scrollY+vh+40},{x:-40,y:scrollY+vh*.12}];
  var paths=starts.map(function(p){return [{t:0,x:p.x,y:p.y,s:1,o:0}]});
  var lastEnd=0;
  jobs.forEach(function(list,c){
    var path=paths[c],t=80+c*140;
    list.forEach(function(j){
      if(j[0]==='d'){
        var el=j[1],grabAt=t+APPROACH,dropAt=grabAt+PRESS+MOVE;
        path.push({t:grabAt,x:j.s.x,y:j.s.y,s:1,o:1,e:INOUT},{t:grabAt+PRESS,x:j.s.x,y:j.s.y,s:.8,o:1},{t:dropAt,x:j.g.x,y:j.g.y,s:.8,o:1,e:EASE},{t:dropAt+80,x:j.g.x,y:j.g.y,s:1,o:1});
        var st='translate('+j[4]+'px,'+j[5]+'px) rotate('+j[6]+'deg) scale('+SK+')';
        running.push(el.animate([{transform:st,offset:0},{transform:st,offset:grabAt/dropAt},{transform:st+' scale(1.05)',offset:(grabAt+PRESS)/dropAt,easing:EASE},{transform:'none',offset:1}],{duration:dropAt}));
        grabFx(el,c,grabAt,dropAt);burst(j.g.x,j.g.y,CUR[c].color,dropAt);
        if(el.classList.contains('role'))later(function(){typeRole(0)},dropAt+120);
        t=dropAt+80;
      }else if(j[0]==='r'){
        var ring=j[1],gA=t+APPROACH,dA=gA+PRESS+MOVE+120,i0=(j[3])+'%';
        path.push({t:gA,x:j.s.x,y:j.s.y,s:1,o:1,e:INOUT},{t:gA+PRESS,x:j.s.x,y:j.s.y,s:.8,o:1},{t:dA,x:j.g.x,y:j.g.y,s:.8,o:1,e:EASE},{t:dA+80,x:j.g.x,y:j.g.y,s:1,o:1});
        running.push(ring.animate([{inset:i0,offset:0},{inset:i0,offset:(gA+PRESS)/dA,easing:EASE},{inset:(j.k1*100)+'%',offset:1}],{duration:dA}));
        grabFx(ring,c,gA,dA);burst(j.g.x,j.g.y,CUR[c].color,dA);
        t=dA+80;
      }else if(j[0]==='s'){
        if(j.skip)return;
        var cn=j[1],q=j.p,at=t+APPROACH,SEG=300,CL=80;
        // Hide the constellation until the cursor reaches each star and line.
        var hits=[at];for(var n=1;n<q.length;n++)hits.push(hits[n-1]+CL+SEG);
        var end=hits[hits.length-1]+CL;
        path.push({t:at,x:q[0].x,y:q[0].y,s:1,o:1,e:INOUT});
        q.forEach(function(p,n){
          if(n>0)path.push({t:hits[n],x:p.x,y:p.y,s:1,o:1,e:INOUT});
          path.push({t:hits[n]+CL/2,x:p.x,y:p.y,s:.8,o:1},{t:hits[n]+CL,x:p.x,y:p.y,s:1,o:1});
          running.push(cn.stars[n].animate([{transform:'scale(0)',offset:0},{transform:'scale(0)',offset:hits[n]/(hits[n]+260)},{transform:'scale(1.9)',offset:(hits[n]+90)/(hits[n]+260)},{transform:'scale(1)'}],{duration:hits[n]+260}));
        });
        cn.lines.forEach(function(ln,n){
          var L=ln.getTotalLength();ln.style.strokeDasharray=L;
          var a0=hits[n]+CL,a1=hits[n+1];
          running.push(ln.animate([{strokeDashoffset:L,offset:0},{strokeDashoffset:L,offset:a0/a1,easing:INOUT},{strokeDashoffset:0}],{duration:a1,fill:'forwards'}));
        });
        t=end+60;
      }else if(j[0]==='h'){
        // The typography cursor highlights the topics in the bio like selecting text.
        var sx=ma.left+scrollX,sy=ma.top+scrollY+ma.height*.6,ex=mb.right+scrollX,ey=mb.top+scrollY+mb.height*.6,S=t+APPROACH;
        path.push({t:S,x:sx,y:sy,s:1,o:1,e:INOUT},{t:S+PRESS,x:sx,y:sy,s:.8,o:1},{t:S+900,x:ex,y:ey,s:.8,o:1,e:INOUT},{t:S+1000,x:ex,y:ey,s:1,o:1});
        running.push(mark.animate([{backgroundSize:'0% 45%'},{backgroundSize:'0% 45%',offset:(S+PRESS)/(S+900)},{backgroundSize:'100% 45%'}],{duration:S+900,fill:'forwards'}));
        t=S+1000;
      }
    });
    lastEnd=Math.max(lastEnd,t);
  });
  // Orbits start turning again once every piece is placed.
  later(function(){root.classList.remove('building')},lastEnd);
  // Finale: each cursor pinches a star, pulls it back, then flings it into the photo.
  // The star stretches into a streak on the way; every hit ripples the photo like a click.
  var order=paths.map(function(p,c){return c}).sort(function(a,b){return paths[a][paths[a].length-1].t-paths[b][paths[b].length-1].t}),done=0;
  function clamp(v,lo,hi){return Math.min(hi,Math.max(lo,v))}
  order.forEach(function(c,k){
    var path=paths[c],l=path[path.length-1],t0=Math.max(l.t+150,lastEnd-700+k*340);
    var ux=l.x-A.x,uy=l.y-A.y,d=Math.hypot(ux,uy)||1,DST=Math.max(d,RAD*2.4);
    var sx=clamp(A.x+ux/d*DST,40,vw-40),sy=clamp(A.y+uy/d*DST,scrollY+40,scrollY+vh-40);
    var vx=A.x-sx,vy=A.y-sy,L=Math.hypot(vx,vy)||1;vx/=L;vy/=L;
    var px=sx-vx*45,py=sy-vy*45,hx=A.x-vx*RAD*.35,hy=A.y-vy*RAD*.35;
    var grab=t0+APPROACH,pull=grab+PRESS+260,hit=pull+420,end=hit+160,th=Math.atan2(vy,vx)*180/Math.PI;
    path.push({t:grab,x:sx,y:sy,s:1,o:1,e:INOUT},{t:grab+PRESS,x:sx,y:sy,s:.8,o:1},{t:pull,x:px,y:py,s:.8,o:1,e:EASE},{t:hit,x:hx,y:hy,s:.8,o:1,e:DIVE},{t:hit+140,x:hx,y:hy,s:.3,o:0});
    function at(x,y){return 'translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+th.toFixed(1)+'deg) translate(-100%,-50%)'}
    var star=document.createElement('span');star.className='comet';layer.appendChild(star);
    running.push(star.animate([
      {offset:0,opacity:0,width:'0px',transform:at(sx,sy)},
      {offset:(t0+150)/end,opacity:0,width:'0px',transform:at(sx,sy)},
      {offset:grab/end,opacity:1,width:'0px',transform:at(sx,sy)},
      {offset:(grab+PRESS)/end,opacity:1,width:'0px',transform:at(sx,sy),easing:EASE},
      {offset:pull/end,opacity:1,width:'14px',transform:at(px,py),easing:DIVE},
      {offset:hit/end,opacity:1,width:'150px',transform:at(hx,hy)},
      {offset:1,opacity:0,width:'0px',transform:at(hx,hy)}
    ],{duration:end,fill:'forwards'}));
    later(function(){ripple();running.push(me.animate([{scale:1},{scale:.93,offset:.35},{scale:1}],{duration:360,easing:EASE}))},hit);
    burst(hx,hy,CUR[c].color,hit);
    done=Math.max(done,end);
  });
  paths.forEach(function(path,c){
    var total=path[path.length-1].t;
    var el=cursorEl(c);
    running.push(el.animate(path.map(function(wp,i){return {offset:wp.t/total,opacity:wp.o,transform:'translate('+wp.x.toFixed(1)+'px,'+wp.y.toFixed(1)+'px) scale('+wp.s+')',easing:(path[i+1]&&path[i+1].e)||'linear'}}),{duration:total,fill:'forwards'}));
  });
  later(function(){layer.textContent='';replay.hidden=false;idleNext()},done+600);
}
// Now and then a few pieces fall off; the cursor that owns them pops out of the photo,
// puts them back one by one, then dives back into the photo.
var idleT=0;
function idleNext(){clearTimeout(idleT);idleT=setTimeout(mischief,9000+Math.random()*9000)}
function cursorEl(c){
  var el=document.createElement('div');el.className='cur';el.style.setProperty('--cc',CUR[c].color);
  el.innerHTML='<svg viewBox="0 0 24 24"><path d="M3 2l17 9.5-7.4 1.9L9 21z"/></svg><span>'+CUR[c][lang]+'</span>';
  layer.appendChild(el);return el;
}
// Every piece that can fall, with the cursor that owns it.
var FALLS=[['.mono,.nav .menu,#langBtn,#themeBtn,.fine,#lookBtn,#replay',0],['h1 .w,.bio',1],['.chip,.role',2],['.dock a,.handles span',3],['.orbit .dot',4]];
// Pieces are drawn from a shuffled bag, so every piece falls once before any falls again.
var bag=[];
function drawPieces(n,vw,vh){
  var all=[];FALLS.forEach(function(o){[].forEach.call(document.querySelectorAll(o[0]),function(el){el.owner=o[1];all.push(el)})});
  var out=[],refills=0;
  while(out.length<n){
    if(!bag.length){if(refills++>1)break;bag=all.slice().sort(function(){return Math.random()-.5})}
    var el=bag.shift(),r=el.getBoundingClientRect();
    if(r.width&&r.top>8&&r.bottom<vh-8&&r.left>4&&r.right<vw-4&&out.indexOf(el)<0)out.push(el);
  }
  return out;
}
function mischief(){
  if(replay.hidden||document.hidden){idleNext();return}
  var vw=document.documentElement.clientWidth,vh=innerHeight,m=me.getBoundingClientRect();
  if(m.bottom<0||m.top>vh){idleNext();return}
  // Two to four pieces fall each time, from anywhere on the page; each piece goes back
  // with the cursor that owns it, so several cursors can come out together.
  var pool=drawPieces(2+Math.floor(Math.random()*3),vw,vh);
  if(pool.length<2){idleNext();return}
  running=running.filter(function(a){return a.playState!=='finished'});
  root.classList.add('building');
  var A={x:m.left+scrollX+m.width/2,y:m.top+scrollY+m.height/2};
  var occ=[].slice.call(document.querySelectorAll('.mono,.nav .menu,#langBtn,#themeBtn,.fine,#lookBtn,#replay,h1 .w,.chip,.role-box,.bio,.dock a,.handles span,.orbit .dot,#me')).map(function(e){return box(e,6)});
  pool.forEach(function(el,i){
    var r=el.getBoundingClientRect(),own=box(el,6),rest=occ.filter(function(q){return q.l!==own.l||q.t!==own.t}),cands=[];
    [50,70,90,110,130,30,150].forEach(function(dy){[0,-30,30,-60,60,-90,90].forEach(function(dx){cands.push([dx+Math.round((Math.random()-.5)*16),dy])})});
    cands=cands.concat(ringCands([0,60]));
    var rot=Math.round((Math.random()-.5)*50),tb=turned(own,rot),fc=freeSpot(tb,cands.concat(gridCands(tb,vw,scrollY,scrollY+vh)),rest,vw,scrollY,scrollY+vh),dx=fc[0],dy=fc[1];
    occ.push({l:tb.l+dx,t:tb.t+dy,w:tb.w,h:tb.h});
    var F='translate('+dx+'px,'+dy+'px) rotate('+rot+'deg)',UP='translate('+dx+'px,'+(dy-12)+'px) rotate('+Math.round(rot*.8)+'deg)';
    el.fallAt={x:r.left+scrollX+r.width/2+dx,y:r.top+scrollY+r.height/2+dy};el.home={x:r.left+scrollX+r.width/2,y:r.top+scrollY+r.height/2};el.F=F;
    el.fall=el.animate([{transform:'none',easing:'cubic-bezier(.55,0,1,.45)'},{transform:F,offset:.72,easing:'ease-out'},{transform:UP,offset:.86,easing:'ease-in'},{transform:F}],{duration:700,delay:i*140,fill:'forwards'});
    running.push(el.fall);
    // Once it lands, the piece shows a red dashed frame and a pulsing "!" badge.
    later(function(){
      el.classList.add('fallen');
      var b=document.createElement('span');b.className='sos';b.textContent='!';
      b.style.cssText='left:'+(el.fallAt.x+r.width/2).toFixed(1)+'px;top:'+(el.fallAt.y-r.height/2).toFixed(1)+'px';
      layer.appendChild(b);el.sos=b;
    },i*140+520);
  });
  // The photo sounds the alarm with red ripples, then the owner cursors burst out of it
  // together, each with its own pieces, and dive back in when done.
  var start=1500+pool.length*140,finish=0,groups={};
  pool.forEach(function(el){(groups[el.owner]=groups[el.owner]||[]).push(el)});
  later(function(){ripple(true)},start-700);later(function(){ripple(true)},start-350);
  Object.keys(groups).forEach(function(key,k){
    var c=+key,t=start+k*180,path=[{t:0,x:A.x,y:A.y,s:.3,o:0}];
    later(ripple,t);
    path.push({t:t,x:A.x,y:A.y,s:.3,o:0},{t:t+260,x:A.x,y:A.y,s:1,o:1,e:EASE});t+=260;
    groups[key].forEach(function(el){
      var grabAt=t+APPROACH,dropAt=grabAt+PRESS+MOVE,f=el.fallAt,h=el.home;
      path.push({t:grabAt,x:f.x,y:f.y,s:1,o:1,e:INOUT},{t:grabAt+PRESS,x:f.x,y:f.y,s:.8,o:1},{t:dropAt,x:h.x,y:h.y,s:.8,o:1,e:EASE},{t:dropAt+80,x:h.x,y:h.y,s:1,o:1});
      later(function(){
        el.classList.remove('fallen');if(el.sos)el.sos.remove();
        el.fall.cancel();
        running.push(el.animate([{transform:el.F},{transform:el.F+' scale(1.05)',offset:PRESS/(PRESS+MOVE),easing:EASE},{transform:'none'}],{duration:PRESS+MOVE}));
      },grabAt);
      grabFx(el,c,grabAt,dropAt);burst(h.x,h.y,CUR[c].color,dropAt);
      t=dropAt+80;
    });
    path.push({t:t+450,x:A.x,y:A.y,s:.8,o:1,e:INOUT},{t:t+600,x:A.x,y:A.y,s:.3,o:0});
    var cur=cursorEl(c),total=t+600;
    running.push(cur.animate(path.map(function(wp,i){return {offset:wp.t/total,opacity:wp.o,transform:'translate('+wp.x.toFixed(1)+'px,'+wp.y.toFixed(1)+'px) scale('+wp.s+')',easing:(path[i+1]&&path[i+1].e)||'linear'}}),{duration:total,fill:'forwards'}));
    later(function(){ripple();running.push(me.animate([{scale:1},{scale:.93,offset:.35},{scale:1}],{duration:360,easing:EASE}))},t+450);
    later(function(){cur.remove()},total+100);
    finish=Math.max(finish,total+100);
  });
  later(function(){root.classList.remove('building');idleNext()},finish);
}
replay.addEventListener('click',function(){scrollTo({top:0});root.classList.add('asm');requestAnimationFrame(assemble)});
// The scene always plays on open (it starts from the top); reduced motion skips it.
if(root.classList.contains('asm')){
  if('scrollRestoration' in history)history.scrollRestoration='manual';
  scrollTo(0,0);requestAnimationFrame(assemble);
}else showFirstRole();
