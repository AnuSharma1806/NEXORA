const session=JSON.parse(localStorage.getItem('nexora_session')||'null');
if(!session){location.href='login.html';}
else{
 const profile=JSON.parse(localStorage.getItem('nexora_profile')||'{}');
 const $=id=>document.getElementById(id); const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
 const first=(session.name||profile.displayName||'there').split(' ')[0]; set('name',first);
 const role=$('targetRoleDash'), interest=$('interestDash');
 const fields={displayName:$('profileDisplayName'),location:$('profileLocation'),linkedin:$('linkedinUrl'),instagram:$('instagramUrl'),github:$('githubUrl'),portfolio:$('portfolioUrl')};
 if(role)role.value=profile.role||''; if(interest)interest.value=profile.interest||'Data';
 Object.entries(fields).forEach(([k,e])=>{if(e)e.value=profile[k]||''});
 const avatar=$('profileAvatar'); const photo=$('profilePhoto');
 function initials(){return (profile.displayName||session.name||'N').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'N'}
 function paintAvatar(){if(!avatar)return; if(profile.photo){avatar.src=profile.photo;avatar.classList.add('has-photo')}else{avatar.removeAttribute('src');avatar.dataset.initials=initials();avatar.classList.remove('has-photo')}}
 paintAvatar();
 photo?.addEventListener('change',()=>{const file=photo.files?.[0];if(!file)return;if(file.size>2*1024*1024){set('profileSaved','Photo must be under 2 MB');photo.value='';return;}const r=new FileReader();r.onload=()=>{profile.photo=r.result;paintAvatar();set('profileSaved','Photo attached ✓')};r.readAsDataURL(file)});
 const social=[['linkedin','LinkedIn','in'],['instagram','Instagram','ig'],['github','GitHub','gh'],['portfolio','Portfolio','web']];
 function paintLinks(){const wrap=$('profileLinksPreview');if(!wrap)return;wrap.innerHTML='';social.forEach(([k,label,icon])=>{const url=String(profile[k]||'').trim();if(!url)return;const a=document.createElement('a');a.className='social-chip';a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=`${icon} ${label}`;wrap.appendChild(a)})}
 paintLinks();
 const progress=role?.value?Number(localStorage.getItem(`nexora_progress_${role.value}`)||0):0;
 const study=role?.value?(()=>{try{const a=JSON.parse(localStorage.getItem(`nexora_study_${role.value}`)||'[]');return Math.round(a.length/6*100)}catch{return 0}})():0;
 const signal=Math.min(100,(profile.role?30:0)+(profile.interest?20:0)+(profile.goal?15:0)+(profile.photo?10:0)+(profile.linkedin?10:0)+(profile.github?5:0)+(profile.portfolio?10:0));
 set('profileSignal',signal+'%');set('studySignal',study+'%');set('activePath',profile.role||'—');set('roadmapPct',progress+'%');set('studyModules',Math.round(study/100*6));
 if(role?.value){set('nextTitle',`Keep building ${role.value}`);set('nextText','Continue your roadmap, finish a study module, then turn the work into resume evidence.')}
 $('saveProfile')?.addEventListener('click',()=>{
   const next={...profile,displayName:fields.displayName?.value.trim()||session.name||'',role:role?.value.trim()||'',interest:interest?.value||'Data',location:fields.location?.value.trim()||'',linkedin:fields.linkedin?.value.trim()||'',instagram:fields.instagram?.value.trim()||'',github:fields.github?.value.trim()||'',portfolio:fields.portfolio?.value.trim()||'',goal:profile.goal||'Build job-ready proof'};
   localStorage.setItem('nexora_profile',JSON.stringify(next)); Object.assign(profile,next); paintLinks();paintAvatar();
   const sig=Math.min(100,(next.role?30:0)+(next.interest?20:0)+(next.goal?15:0)+(next.photo?10:0)+(next.linkedin?10:0)+(next.github?5:0)+(next.portfolio?10:0));set('profileSignal',sig+'%');set('activePath',next.role||'—');set('profileSaved','Saved ✓');
 });
 $('logout')?.addEventListener('click',()=>{localStorage.removeItem('nexora_session');location.href='index.html'});
}
