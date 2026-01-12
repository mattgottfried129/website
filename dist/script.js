(function(){
  const year=document.getElementById('year'); if(year) year.textContent=String(new Date().getFullYear());
  const toggle=document.querySelector('.nav-toggle'); const mobile=document.getElementById('mobileNav');
  if(toggle && mobile){
    toggle.addEventListener('click',()=>{const ex=toggle.getAttribute('aria-expanded')==='true'; toggle.setAttribute('aria-expanded',String(!ex)); mobile.hidden=ex;});
    mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false'); mobile.hidden=true;}));
  }
  const form=document.getElementById('contactForm'); const status=document.getElementById('formStatus');
  const setStatus=(m)=>{ if(status) status.textContent=m; };
  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault(); setStatus('Sending…');
      const fd=new FormData(form);
      const payload={name:fd.get('name'),email:fd.get('email'),phone:fd.get('phone'),message:fd.get('message'),turnstileToken:fd.get('cf-turnstile-response')};
      try{
        const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        if(!res.ok){ throw new Error(await res.text()); }
        form.reset(); setStatus('Message sent. You’ll hear back soon.');
      }catch(err){
        console.error(err);
        setStatus('Could not send. Email me directly at matt@mattgottfriedcpa.com.');
      }
    });
  }
})();