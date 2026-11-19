// "What I'm working on lately": the newest commit in each of my three most recently pushed public
// repos, read from the GitHub API in the visitor's browser. Forks and this site's own repo are left out.
// The answer is kept on this device for 30 minutes, which keeps a visitor well inside GitHub's
// limit of 60 unauthenticated requests an hour (each load costs four).
var USER='tvtdev94',SKIP=USER+'.github.io',KEY='home-now',FRESH=30*60e3,root=document.documentElement;
var list=document.getElementById('nowList'),items=null,failed=false;
var TXT={vi:{fail:'Chưa tải được. Xem trên GitHub',ago:'trước'},en:{fail:'Could not load. See GitHub',ago:'ago'}};

function get(path){return fetch('https://api.github.com/'+path,{headers:{Accept:'application/vnd.github+json'}}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
function load(){
  return get('users/'+USER+'/repos?sort=pushed&per_page=20').then(function(repos){
    repos=repos.filter(function(r){return !r.fork&&!r.archived&&r.name!==SKIP}).slice(0,3);
    return Promise.all(repos.map(function(r){
      return get('repos/'+r.full_name+'/commits?per_page=1').then(function(c){
        c=c[0];return c&&{repo:r.name,msg:c.commit.message.split('\n')[0],at:c.commit.committer.date,url:c.html_url};
      });
    }));
  }).then(function(a){return a.filter(Boolean)});
}
// "3 giờ trước" / "3 hours ago" in the page language.
function ago(iso,l){
  var s=(Date.parse(iso)-Date.now())/1e3,f=new Intl.RelativeTimeFormat(l);
  var U=[['year',31536e3],['month',2592e3],['week',604800],['day',86400],['hour',3600],['minute',60]];
  for(var i=0;i<U.length;i++)if(Math.abs(s)>=U[i][1])return f.format(Math.round(s/U[i][1]),U[i][0]);
  return f.format(0,'minute');
}
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
function render(){
  var l=root.lang==='en'?'en':'vi';
  if(!items){
    if(!failed)return;
    var a=el('a','now-fail',TXT[l].fail+' →');a.href='https://github.com/'+USER;a.target='_blank';a.rel='noopener';
    var li=el('li');li.appendChild(a);list.replaceChildren(li);list.removeAttribute('aria-busy');return;
  }
  list.replaceChildren.apply(list,items.map(function(it){
    var li=el('li'),a=el('a');a.href=it.url;a.target='_blank';a.rel='noopener';
    var t=el('time',null,ago(it.at,l));t.dateTime=it.at;
    a.append(el('b',null,it.repo),el('span','msg',it.msg),t);li.appendChild(a);return li;
  }));
  list.removeAttribute('aria-busy');
}
var cache=null;
try{cache=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(cache&&cache.items)items=cache.items;
render();
if(!cache||Date.now()-cache.t>FRESH){
  load().then(function(a){
    if(!a.length)throw new Error('empty');
    items=a;try{localStorage.setItem(KEY,JSON.stringify({t:Date.now(),items:a}))}catch(e){}
  }).catch(function(){failed=true}).then(render);
}
// The language switch sets <html lang>; rewrite the times when it changes.
new MutationObserver(render).observe(root,{attributes:true,attributeFilter:['lang']});
