(function(){
 var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
 $('#yr').textContent=new Date().getFullYear();

 /* typing role */
 var roles=['AWS Cloud & DevOps Enthusiast','Terraform · Docker · Kubernetes','CI/CD Pipelines · Linux · Python · SQL'],ri=0,ci=0,del=false,el=$('#role');
 (function type(){
  var t=roles[ri];ci+=del?-1:1;el.textContent=t.slice(0,ci);
  var d=del?35:70;
  if(!del&&ci===t.length){del=true;d=1600}
  else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;d=350}
  setTimeout(type,d);
 })();

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
 var SK=[{"i": "☁️", "t": "AWS Cloud", "d": "Core AWS services used to build, connect, secure and operate cloud workloads.", "k": ["EC2", "VPC", "ALB", "NLB", "Auto Scaling", "S3", "CloudFront", "Route 53", "RDS", "WAF", "Cognito", "Lambda", "API Gateway", "DynamoDB"]}, {"i": "⌘", "t": "Infrastructure as Code", "d": "Repeatable infrastructure, version control and environment provisioning.", "k": ["Terraform", "Terraform Modules", "CloudFormation", "Remote State", "State Locking", "Variables", "Outputs"]}, {"i": "🐳", "t": "Containers & CI/CD", "d": "Packaging applications into containers, orchestrating them and automating delivery.", "k": ["Docker", "Kubernetes", "CI/CD Pipelines"]}, {"i": "⌨️", "t": "Linux & Automation", "d": "Linux administration, networking commands, permissions, services, troubleshooting and shell-based workflows.", "k": ["Linux", "Shell", "SSH", "Networking"]}, {"i": "🐍", "t": "Programming & Database", "d": "Scripting and data skills used to automate tasks and work with databases.", "k": ["Python", "SQL"]}, {"i": "🤝", "t": "Professional Skills", "d": "Skills that support working in a team and explaining technical ideas.", "k": ["Communication", "Interpersonal Skills", "Problem Solving", "Teamwork"]}],sl=$('#sl'),sp=$('#sp');
 SK.forEach(function(c,i){var b=document.createElement('button');b.className='sb';b.setAttribute('role','tab');
  b.innerHTML='<span>'+c.i+'</span>'+c.t.replace('&','&amp;')+'<span class="n">'+c.k.length+'</span>';
  b.onclick=function(){pick(i)};sl.appendChild(b)});
 function pick(i){var c=SK[i];
  $$('.sb').forEach(function(b,j){b.classList.toggle('on',j===i);b.setAttribute('aria-selected',j===i)});
  sp.innerHTML='<h3>'+c.i+' '+c.t.replace('&','&amp;')+'</h3><p>'+c.d+'</p><div class="tiles">'+
   c.k.map(function(k,j){return '<span class="tile" style="animation-delay:'+(j*45)+'ms">'+k+'</span>'}).join('')+'</div>'}
 pick(0);

 /* project tabs */
 $$('.tabs:not(#at) .tab').forEach(function(t){t.onclick=function(){
  $$('.tabs:not(#at) .tab').forEach(function(x){x.classList.remove('on')});$$('.proj').forEach(function(x){x.classList.remove('on')});
  t.classList.add('on');$('#'+t.dataset.p).classList.add('on');
 }});

 /* architecture explorer */
 var AR={
  multi:[['🌐 Internet'],['Internet Gateway'],
   ['Web Server','Public subnet · EC2','Sits in the public subnet and receives user requests through the Internet Gateway. A security group allows only the web traffic it needs.'],
   ['Application Server','Private subnet · EC2','Runs the application logic from a private subnet, so it is not reachable from the internet. It talks to the web tier and the database internally. A NAT Gateway gives it outbound internet access for updates.'],
   ['Data Server','Database subnet · RDS','The RDS database lives in the private database layer. Its security group accepts connections only from the application tier.']],
  sms:[['👤 Users'],
   ['Amazon Cognito','Authentication · roles','Handles user sign-in and identity, so only authenticated users can reach the student records and each user type gets the access it needs.'],
   ['AWS WAF','Web application firewall','Sits in front of the load balancer and filters malicious web requests before they reach the application.'],
   ['Application Load Balancer','Public subnets','Receives traffic from the internet and distributes it across the EC2 application servers.'],
   ['EC2 Application Servers','Private subnets','Run the Python backend and web interface that manage student records such as name, roll number, class, CGPA and attendance.'],
   ['Amazon RDS','Private database subnets','Stores all student data. Its security group accepts connections only from the application servers.']]
 },fl=$('#flow');
 function show(a,i){$$('.node[data-i]',fl).forEach(function(n){n.classList.toggle('on',+n.dataset.i===i)});var d=AR[a][i];$('#info').innerHTML='<b>'+d[0]+'</b><br>'+d[2]}
 function build(a){fl.innerHTML='';AR[a].forEach(function(d,i){
  if(i)fl.insertAdjacentHTML('beforeend','<div class="arr"></div>');
  var e=document.createElement(d[1]?'button':'div');e.className='node'+(d[1]?'':' net');
  e.innerHTML='<b>'+d[0]+'</b>'+(d[1]?'<small>'+d[1]+'</small>':'');
  if(d[1]){e.dataset.i=i;e.onclick=function(){show(a,i)}}fl.appendChild(e)});
  var f=AR[a].findIndex(function(d){return d[1]});show(a,f)}
 $$('#at .tab').forEach(function(t){t.onclick=function(){$$('#at .tab').forEach(function(x){x.classList.remove('on')});t.classList.add('on');build(t.dataset.a)}});
 build('multi');


 /* background network canvas */
 var cv=$('#bgc'),cx=cv.getContext('2d'),pts=[],W,H,mq=matchMedia('(prefers-reduced-motion:reduce)');
 function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;pts=[];var n=Math.min(60,Math.floor(W*H/22000));for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3})}
 size();addEventListener('resize',size);
 function draw(){
  cx.clearRect(0,0,W,H);
  var col='70,125,255';
  pts.forEach(function(p,i){
   p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
   cx.fillStyle=i%5===0?'rgba(182,255,60,.85)':'rgba('+col+',.7)';cx.beginPath();cx.arc(p.x,p.y,1.6,0,6.3);cx.fill();
   for(var j=i+1;j<pts.length;j++){var q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);
    if(d<130){cx.strokeStyle='rgba('+col+','+(.25*(1-d/130))+')';cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
  });
  if(!mq.matches)requestAnimationFrame(draw);
 }
 draw();

 /* effects */
 var pre=$('#pre');function hide(){pre.classList.add('done')}
 addEventListener('load',function(){setTimeout(hide,500)});setTimeout(hide,2500);
 var gl=$('#glow');
 addEventListener('mousemove',function(e){gl.style.opacity=1;gl.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)';
  var g=e.target.closest&&e.target.closest('.glass');if(g){var r=g.getBoundingClientRect();g.style.setProperty('--mx',(e.clientX-r.left)+'px');g.style.setProperty('--my',(e.clientY-r.top)+'px')}},{passive:true});
 $$('.cd,.ti,.stats').forEach(function(t){
  t.addEventListener('mousemove',function(e){var r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   t.style.transform='perspective(700px) rotateX('+(-y*8)+'deg) rotateY('+(x*10)+'deg) translateY(-4px)'});
  t.addEventListener('mouseleave',function(){t.style.transform=''})});
 $$('.btn').forEach(function(b){
  b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28-2)+'px)'});
  b.addEventListener('mouseleave',function(){b.style.transform=''})});
 var CH='01<>/{}#$%';
 function scr(el){var t=el.textContent,f=0;var iv=setInterval(function(){el.textContent=t.split('').map(function(ch,i){return ch===' '||i<f?ch:CH[Math.floor(Math.random()*CH.length)]}).join('');f+=.6;if(f>=t.length){el.textContent=t;clearInterval(iv)}},30)}
 var hio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!mq.matches)scr(e.target);hio.unobserve(e.target)}})},{threshold:.6});
 $$('section h2').forEach(function(h){hio.observe(h)});
})();
