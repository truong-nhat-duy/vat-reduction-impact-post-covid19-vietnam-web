(function(){
var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var lang=LS.get('lang')||((navigator.language||'vi').toLowerCase().indexOf('vi')===0?'vi':'en');
var done={};
function buildToc(){var t=document.getElementById('toc');t.innerHTML='';(window.TOCS[lang]||[]).forEach(function(i){var a=document.createElement('a');a.href='#'+i.id;a.className=i.lvl==='h3'?'l3':'';a.textContent=(i.n?i.n+' ':'')+i.t.replace(/<[^>]*>/g,'');a.dataset.id=i.id;t.appendChild(a)})}
function math(){if(done[lang]||!window.renderMathInElement)return;var el=document.getElementById(lang+'-root');if(!el)return;try{renderMathInElement(el,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});done[lang]=1}catch(e){}}
function setLang(l){lang=l;LS.set('lang',l);document.documentElement.lang=l;document.getElementById('bvi').classList.toggle('on',l==='vi');document.getElementById('ben').classList.toggle('on',l==='en');buildToc();math();spy()}
function spy(){var hs=document.querySelectorAll('#'+lang+'-root h2, #'+lang+'-root h3'),cur=null,y=80;hs.forEach(function(h){if(h.getBoundingClientRect().top<y)cur=h.id});document.querySelectorAll('#toc a').forEach(function(a){a.classList.toggle('on',a.dataset.id===cur)})}
window.addEventListener('scroll',function(){var d=document.documentElement,p=d.scrollTop/(d.scrollHeight-d.clientHeight||1);document.getElementById('prog').style.width=(p*100)+'%';spy()},{passive:true});
window.zoom=function(im){var d=document.getElementById('dlg');document.getElementById('dimg').src=im.src;if(d.showModal)d.showModal()};
document.getElementById('bvi').onclick=function(){setLang('vi')};document.getElementById('ben').onclick=function(){setLang('en')};
document.getElementById('bth').onclick=function(){var r=document.documentElement,n=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',n);LS.set('theme',n)};
var th=LS.get('theme');if(th)document.documentElement.setAttribute('data-theme',th);
window.addEventListener('load',function(){setLang(lang)});
})();
