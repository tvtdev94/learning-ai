// Homepage profile: theme toggle, typed role line, avatar ripple, language switch, mouse parallax.
import {greetings} from './season.js';
var root=document.documentElement;
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Theme toggle: the new theme grows out of the button as a circle where View Transitions exist.
var btn=document.getElementById('themeBtn');
btn.addEventListener('click',function(){
  var cur=root.getAttribute('data-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  var next=cur==='dark'?'light':'dark';
  function apply(){root.setAttribute('data-theme',next);try{localStorage.setItem('rag-theme',next)}catch(e){}}
  if(!document.startViewTransition||reduce){apply();return}
  var b=btn.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2,r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  document.startViewTransition(apply).ready.then(function(){
    root.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+r+'px at '+x+'px '+y+'px)']},{duration:650,easing:'cubic-bezier(.22,1,.36,1)',pseudoElement:'::view-transition-new(root)'});
  }).catch(function(){});
});

// Type the role out; the full text stays in a screen-reader copy.
var typed=document.getElementById('typed'),full=typed.textContent,typeTimer=0;
// Roles cycle like a typewriter. Edit ROLES (and the screen-reader copy in .role) to change them.
var ROLES={
  vi:[full,'Xây dựng AgentKit','Giải pháp tăng hiệu quả và năng suất AI','Xây hệ thống AI','Học RAG và agent','Viết Sổ tay học tập'],
  en:['Software developer','Building AgentKit','Solutions for AI efficiency and productivity','Building AI systems','Learning RAG and agents','Writing a learning notebook']
},lang='vi';
// The role list for the current language, led by any occasion greetings.
function roles(l){return greetings(l||lang).concat(ROLES[l||lang])}
// Split into what the eye sees as one character, so emoji such as flags stay whole while typed.
var seg=window.Intl&&Intl.Segmenter?new Intl.Segmenter():null;
function chars(t){return seg?Array.from(seg.segment(t),function(x){return x.segment}):Array.from(t)}
function typeRole(delay){
  clearTimeout(typeTimer);typed.textContent='';var r=0,n=0,back=false;
  function step(){
    var list=roles(),w=chars(list[r%list.length]);
    if(!back){typed.textContent=w.slice(0,++n).join('');if(n<w.length){typeTimer=setTimeout(step,70);return}back=true;typeTimer=setTimeout(step,1900);return}
    typed.textContent=w.slice(0,--n).join('');if(n>0){typeTimer=setTimeout(step,35);return}
    back=false;r=(r+1)%list.length;typeTimer=setTimeout(step,320);
  }
  typeTimer=setTimeout(step,delay);
}

// Tap the avatar for a ripple.
var me=document.getElementById('me'),orbit=document.getElementById('orbit');
function ripple(alarm){
  var r=document.createElement('span');r.className=alarm?'ripple alarm':'ripple';orbit.appendChild(r);
  r.addEventListener('animationend',function(){r.remove()});
}
me.addEventListener('click',function(){if(!reduce)ripple()});

// Language: the Vietnamese text lives in the HTML, English strings live here.
// ?lang=en links straight to the English profile; the choice is remembered on this device.
var EN={
  title:'Trần Văn Tuấn · Software developer',nav:'Pages',notebook:'Notebook',products:'Products',theme:'Toggle light/dark theme',
  alt:'Photo of Trần Văn Tuấn',chipCode:'Programming',chipLife:'Life',contact:'Contact',replay:'Replay the build',now:'What I’m working on lately',
  bio:'This is where I write down what I learn: <mark>AI, programming and life</mark>.'
};
var VI={title:document.title},langBtn=document.getElementById('langBtn'),roleSr=document.getElementById('roleSr');
var nodes=document.querySelectorAll('[data-t],[data-t-html],[data-t-aria],[data-t-alt]');
[].forEach.call(nodes,function(e){
  if(e.dataset.t)VI[e.dataset.t]=e.textContent;
  if(e.dataset.tHtml)VI[e.dataset.tHtml]=e.innerHTML;
  if(e.dataset.tAria)VI[e.dataset.tAria]=e.getAttribute('aria-label');
  if(e.dataset.tAlt)VI[e.dataset.tAlt]=e.getAttribute('alt');
});
// The role line keeps the height of its longest role at the current width, so the name
// and bio above and below never jump when a long role is typed or erased.
var roleBox=document.querySelector('.role-box'),rolePill=document.querySelector('.role');
function fitRole(){
  var save=typed.textContent,max=0;
  roles().forEach(function(w){typed.textContent=w;max=Math.max(max,rolePill.offsetHeight)});
  typed.textContent=save;roleBox.style.minHeight=max+'px';
}
var fitQueued=false;
addEventListener('resize',function(){if(fitQueued)return;fitQueued=true;requestAnimationFrame(function(){fitQueued=false;fitRole()})});
function setLang(l){
  lang=l;var D=l==='en'?EN:VI;
  root.lang=l;document.title=D.title;
  [].forEach.call(nodes,function(e){
    if(e.dataset.t)e.textContent=D[e.dataset.t];
    if(e.dataset.tHtml)e.innerHTML=D[e.dataset.tHtml];
    if(e.dataset.tAria)e.setAttribute('aria-label',D[e.dataset.tAria]);
    if(e.dataset.tAlt)e.setAttribute('alt',D[e.dataset.tAlt]);
  });
  roleSr.textContent=roles(l).join('. ')+'.';
  fitRole();
  langBtn.textContent=l==='en'?'VI':'EN';langBtn.lang=l==='en'?'vi':'en';
  langBtn.setAttribute('aria-label',l==='en'?'Chuyển sang tiếng Việt':'Switch to English');
}
var q=/[?&]lang=(en|vi)\b/.exec(location.search),saved=null;
try{saved=localStorage.getItem('profile-lang')}catch(e){}
setLang(q?q[1]:(saved==='en'?'en':'vi'));
langBtn.addEventListener('click',function(){
  var next=lang==='en'?'vi':'en';
  function apply(){
    setLang(next);
    var m=document.querySelector('.bio mark');if(m)m.style.backgroundSize='100% 45%';
    typed.textContent=roles()[0];if(!reduce)typeRole(900);
  }
  try{localStorage.setItem('profile-lang',next)}catch(e){}
  history.replaceState(null,'',next==='en'?'?lang=en':location.pathname);
  if(document.startViewTransition&&!reduce)document.startViewTransition(apply);else apply();
});
// Shown at once when the build scene does not play.
function showFirstRole(){typed.textContent=roles()[0]}
// A new look can add or drop a greeting: refresh the screen-reader copy and the reserved height.
new MutationObserver(function(){roleSr.textContent=roles().join('. ')+'.';fitRole()}).observe(root,{attributes:true,attributeFilter:['data-season']});

// Mouse parallax: sky drifts one way, orbit the other, avatar tilts toward the pointer.
if(!reduce&&window.matchMedia('(pointer: fine)').matches){
  var sky=document.getElementById('sky'),px=0,py=0,queued=false;
  addEventListener('pointermove',function(e){
    px=e.clientX/innerWidth*2-1;py=e.clientY/innerHeight*2-1;
    if(queued)return;queued=true;
    requestAnimationFrame(function(){
      queued=false;
      sky.style.setProperty('--sx',(-px*14).toFixed(1)+'px');sky.style.setProperty('--sy',(-py*14).toFixed(1)+'px');
      orbit.style.setProperty('--ox',(px*10).toFixed(1)+'px');orbit.style.setProperty('--oy',(py*10).toFixed(1)+'px');
      me.style.setProperty('--ry',(px*14).toFixed(1)+'deg');me.style.setProperty('--rx',(-py*14).toFixed(1)+'deg');
    });
  });
}

export {lang,ripple,typeRole,showFirstRole};
