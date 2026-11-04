(function(){
 var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
 $('#yr').textContent=new Date().getFullYear();

 /* typing role */
 var roles=['AWS Cloud & DevOps Enthusiast','Terraform · Infrastructure as Code','Linux · Python · SQL'],ri=0,ci=0,del=false,el=$('#role');
 (function type(){
  var t=roles[ri];ci+=del?-1:1;el.textContent=t.slice(0,ci);
  var d=del?35:70;
  if(!del&&ci===t.length){del=true;d=1600}
  else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;d=350}
  setTimeout(type,d);
 })();

 /* theme */
 var root=document.documentElement,tb=$('#theme');
 try{var s=localStorage.getItem('th');if(s){root.dataset.theme=s}}catch(e){}
 function sync(){tb.textContent=root.dataset.theme==='light'?'☀':'☾'}
 sync();
 tb.onclick=function(){root.dataset.theme=root.dataset.theme==='light'?'dark':'light';try{localStorage.setItem('th',root.dataset.theme)}catch(e){}sync()};

 /* mobile menu */
 var links=$('#links');
 $('#burger').onclick=function(){links.classList.toggle('open')};
 $$('a',links).forEach(function(a){a.onclick=function(){links.classList.remove('open')}});

 /* scroll progress + active link */
 var bar=$('#bar'),secs=$$('section,header'),ls=$$('a',links);
 addEventListener('scroll',function(){
  var h=document.documentElement;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
  var cur='home';secs.forEach(function(s){if(s.getBoundingClientRect().top<140)cur=s.id});
  ls.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur)});
 },{passive:true});

 /* reveal, skill bars, counter */
 var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;e.target.classList.add('show');
  $$('.fill',e.target).forEach(function(f){f.style.width=f.dataset.w+'%'});
  $$('[data-count]',e.target).forEach(function(c){
   var end=parseFloat(c.dataset.count),n=0,st=setInterval(function(){n+=end/30;if(n>=end){n=end;clearInterval(st)}c.textContent=n.toFixed(1)},30);
  });
  io.unobserve(e.target);
 })},{threshold:.15});
 $$('.rv').forEach(function(x){io.observe(x)});

 /* skills explorer */
 var SK=[{"i": "☁️", "t": "AWS Cloud", "d": "Core AWS services used to build, connect, secure and operate cloud workloads.", "k": ["EC2", "VPC", "ALB", "NLB", "Auto Scaling", "S3", "CloudFront", "Route 53", "RDS", "Lambda", "API Gateway", "DynamoDB"]}, {"i": "⌘", "t": "Infrastructure as Code", "d": "Repeatable infrastructure, version control and environment provisioning.", "k": ["Terraform", "Terraform Modules", "CloudFormation", "Remote State", "State Locking", "Variables", "Outputs"]}, {"i": "⌨️", "t": "Linux & Automation", "d": "Linux administration, networking commands, permissions, services, troubleshooting and shell-based workflows.", "k": ["Linux", "Shell", "SSH", "Networking"]}, {"i": "🐍", "t": "Programming & Database", "d": "Scripting and data skills used to automate tasks and work with databases.", "k": ["Python", "SQL"]}, {"i": "🤝", "t": "Professional Skills", "d": "Skills that support working in a team and explaining technical ideas.", "k": ["Communication", "Interpersonal Skills", "Problem Solving", "Teamwork"]}],sl=$('#sl'),sp=$('#sp');
 SK.forEach(function(c,i){var b=document.createElement('button');b.className='sb';b.setAttribute('role','tab');
  b.innerHTML='<span>'+c.i+'</span>'+c.t.replace('&','&amp;')+'<span class="n">'+c.k.length+'</span>';
  b.onclick=function(){pick(i)};sl.appendChild(b)});
 function pick(i){var c=SK[i];
  $$('.sb').forEach(function(b,j){b.classList.toggle('on',j===i);b.setAttribute('aria-selected',j===i)});
  sp.innerHTML='<h3>'+c.i+' '+c.t.replace('&','&amp;')+'</h3><p>'+c.d+'</p><div class="tiles">'+
   c.k.map(function(k,j){return '<span class="tile" style="animation-delay:'+(j*45)+'ms">'+k+'</span>'}).join('')+'</div>'}
 pick(0);

 /* project tabs */
 $$('.tab').forEach(function(t){t.onclick=function(){
  $$('.tab').forEach(function(x){x.classList.remove('on')});$$('.proj').forEach(function(x){x.classList.remove('on')});
  t.classList.add('on');$('#'+t.dataset.p).classList.add('on');
 }});

 /* architecture explorer */
 var data=[
  ['Web Server','Sits in the public subnet and receives user requests through the Internet Gateway. A security group allows only the web traffic it needs.'],
  ['Application Server','Runs the application logic from a private subnet, so it is not reachable from the internet. It talks to the web tier and the database internally. A NAT Gateway gives it outbound internet access for updates.'],
  ['Data Server','The RDS database lives in the private database layer. Its security group accepts connections only from the application tier.']
 ];
 function show(i){$$('.node[data-i]').forEach(function(n){n.classList.toggle('on',+n.dataset.i===i)});$('#info').innerHTML='<b>'+data[i][0]+'</b><br>'+data[i][1]}
 $$('.node[data-i]').forEach(function(n){n.onclick=function(){show(+n.dataset.i)}});
 show(0);

 /* background network canvas */
 var cv=$('#bgc'),cx=cv.getContext('2d'),pts=[],W,H,mq=matchMedia('(prefers-reduced-motion:reduce)');
 function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;pts=[];var n=Math.min(60,Math.floor(W*H/22000));for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3})}
 size();addEventListener('resize',size);
 function draw(){
  cx.clearRect(0,0,W,H);
  var col=root.dataset.theme==='light'?'3,105,161':'56,189,248';
  pts.forEach(function(p,i){
   p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
   cx.fillStyle='rgba('+col+',.7)';cx.beginPath();cx.arc(p.x,p.y,1.6,0,6.3);cx.fill();
   for(var j=i+1;j<pts.length;j++){var q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);
    if(d<130){cx.strokeStyle='rgba('+col+','+(.25*(1-d/130))+')';cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
  });
  if(!mq.matches)requestAnimationFrame(draw);
 }
 draw();
})();
