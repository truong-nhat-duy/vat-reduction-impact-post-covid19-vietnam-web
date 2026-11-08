(function(){
var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var lang=LS.get('lang')||((navigator.language||'vi').toLowerCase().indexOf('vi')===0?'vi':'en');
function B(en,vi){return lang==='vi'?vi:en}
var groups={all:['Tất cả','All'],baseline:['Baseline','Baseline'],robust:['Kiểm định','Robustness'],hetero:['Dị biệt','Heterogeneity'],ddd:['DDD','DDD'],labor:['Lao động','Labor'],unsettled:['Chưa chốt','Unresolved']};
var figs=[['raw_profit_trend','Xu hướng lợi nhuận thô','Raw profit trend'],['sdid_plot','Synthetic DiD','Synthetic DiD'],['forest_plot_hetero','Forest plot dị biệt','Heterogeneity forest plot'],['fig_forest_heterogeneity','Forest plot dị biệt (bản 2)','Heterogeneity forest plot (v2)'],['fig_psm_balance','Cân bằng covariate (PSM)','PSM covariate balance'],['operating_leverage_dist','Phân phối đòn bẩy hoạt động','Operating leverage distribution'],['policy_labor_hoarding','Kênh lao động','Labor channel'],['kaplan_meier_curve','Kaplan–Meier','Kaplan–Meier'],['exit_trend_plot','Xu hướng thoát thị trường','Exit trend']];
var data=[],cur='all',sel=null,NS='http://www.w3.org/2000/svg';
function fmt(x){return (x>0?'+':'')+String(x).replace('.',lang==='vi'?',':'.')}
function setLang(l){lang=l;LS.set('lang',l);document.documentElement.lang=l;document.getElementById('bvi').classList.toggle('on',l==='vi');document.getElementById('ben').classList.toggle('on',l==='en');render()}
function chips(){var c=document.getElementById('chips');c.innerHTML='';Object.keys(groups).forEach(function(g){var b=document.createElement('button');b.type='button';b.textContent=lang==='vi'?groups[g][0]:groups[g][1];if(g===cur)b.className='on';b.onclick=function(){cur=g;sel=null;render()};c.appendChild(b)})}
function rows(){return data.filter(function(d){return cur==='all'||d.group===cur})}
function chart(){var r=rows(),svg=document.getElementById('chart');svg.innerHTML='';var W=720,L=190,R=20,T=10,rowH=30,H=T+r.length*rowH+30;svg.setAttribute('viewBox','0 0 '+W+' '+H);
var mn=Math.min(0,Math.min.apply(null,r.map(function(d){return d.est}))),mx=Math.max(0,Math.max.apply(null,r.map(function(d){return d.est})));if(mx===mn){mx=mn+1}
var pad=(mx-mn)*.08;mn-=pad;mx+=pad;function X(v){return L+(v-mn)/(mx-mn)*(W-L-R)}
function el(n,a,t){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(t!==undefined)e.textContent=t;svg.appendChild(e);return e}
el('line',{x1:X(0),x2:X(0),y1:T,y2:H-24,class:'ax'});
r.forEach(function(d,i){var y=T+i*rowH,x0=X(0),x1=X(d.est);var rc=el('rect',{x:Math.min(x0,x1),y:y+4,width:Math.max(2,Math.abs(x1-x0)),height:rowH-10,rx:3,class:'bar'+(sel===d.id?' sel':''),fill:d.status==='unresolved'?'#d98a1b':(d.est<0?'#b3382c':'#1f7a4d')});rc.addEventListener('click',function(){sel=d.id;render()});
el('text',{x:L-8,y:y+rowH/2+4,'text-anchor':'end'},B(d.en,d.vi).slice(0,30));
el('text',{x:d.est<0?x1-4:x1+4,y:y+rowH/2+4,'text-anchor':d.est<0?'end':'start'},fmt(d.est)+(d.stars||''))});
el('text',{x:X(0),y:H-8,'text-anchor':'middle'},'0')}
function detail(){var d=document.getElementById('detail'),it=data.filter(function(x){return x.id===sel})[0];if(!it){d.textContent=B('Click a bar for details.','Bấm một thanh để xem chi tiết.');return}
d.innerHTML='';var s=document.createElement('div');s.innerHTML='<strong></strong> ';s.firstChild.textContent=B(it.en,it.vi);d.appendChild(s);
var t=document.createElement('div');t.textContent=B('Estimate','Hệ số')+': '+fmt(it.est)+(it.stars||'')+(it.se!=null?'  (SE '+it.se+')':'')+(it.n?'  N='+it.n.toLocaleString(lang==='vi'?'vi-VN':'en-US'):'')+'. '+B(it.note_en,it.note_vi);d.appendChild(t)}
function table(){var t=document.getElementById('tbl'),h='<tr><th>'+B('Specification','Đặc tả')+'</th><th>'+B('Estimate','Hệ số')+'</th><th>SE</th><th>N</th><th>'+B('Status','Trạng thái')+'</th></tr>';
rows().forEach(function(d){h+='<tr><td></td><td class="num">'+fmt(d.est)+(d.stars||'')+'</td><td class="num">'+(d.se!=null?d.se:'—')+'</td><td class="num">'+(d.n?d.n.toLocaleString(lang==='vi'?'vi-VN':'en-US'):'—')+'</td><td><span class="tag '+(d.status==='unresolved'?'unres':'rep')+'">'+(d.status==='unresolved'?B('UNVERIFIED','CHƯA XÁC MINH'):B('author-reported','tác giả báo cáo'))+'</span></td></tr>'});
t.innerHTML=h;var tds=t.querySelectorAll('tr');rows().forEach(function(d,i){tds[i+1].firstChild.textContent=B(d.en,d.vi)})}
function gal(){var g=document.getElementById('gal');g.innerHTML='';figs.forEach(function(f){var fg=document.createElement('figure'),im=document.createElement('img');im.src='assets/fig/'+f[0]+'.png?v=1108115000';im.loading='lazy';im.alt=B(f[2],f[1]);im.onclick=function(){var d=document.getElementById('dlg');document.getElementById('dimg').src=im.src;if(d.showModal)d.showModal()};var c=document.createElement('figcaption');c.textContent=B(f[2],f[1]);fg.appendChild(im);fg.appendChild(c);g.appendChild(fg)})}
function render(){chips();chart();detail();table();gal()}
document.getElementById('bvi').onclick=function(){setLang('vi')};document.getElementById('ben').onclick=function(){setLang('en')};
document.getElementById('bth').onclick=function(){var r=document.documentElement,n=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',n);LS.set('theme',n)};
var th=LS.get('theme');if(th)document.documentElement.setAttribute('data-theme',th);
fetch('data/results.json?v=1108115000').then(function(r){return r.json()}).then(function(j){data=j;setLang(lang)}).catch(function(){document.getElementById('detail').textContent='Không tải được dữ liệu / Could not load data.'});
})();
