const params=new URLSearchParams(location.search);
const career=params.get('career')||'Your Target Career';
const skillMap={
'AI / ML Engineer':['Python','Machine Learning','Statistics','Model evaluation'],
'Data Scientist':['Python','SQL','Statistics','Experimentation'],
'Data Analyst':['SQL','Excel','Dashboards','Data storytelling'],
'Data Engineer':['SQL','Python','Data pipelines','Databases'],
'Machine Learning Engineer':['Python','ML systems','Deployment','MLOps'],
'AI Product Manager':['Product strategy','AI concepts','Research','Communication'],
'Product Manager':['Product strategy','Research','Prioritization','Communication'],
'Product Designer':['UX','Research','Prototyping','Design systems'],
'UX Researcher':['User research','Interviews','Synthesis','Communication'],
'UI Designer':['Visual design','Figma','Design systems','Typography'],
'Frontend Developer':['HTML','CSS','JavaScript','Accessibility'],
'Backend Developer':['Programming','APIs','Databases','System design'],
'Full Stack Developer':['Frontend','Backend','Databases','Deployment'],
'Mobile App Developer':['Mobile UI','Android/iOS','APIs','App architecture'],
'DevOps Engineer':['Linux','CI/CD','Automation','Cloud'],
'Cloud Engineer':['Cloud platforms','Networking','Linux','Infrastructure'],
'Site Reliability Engineer':['Linux','Observability','Automation','Reliability'],
'Cloud Security Engineer':['Cloud','IAM','Security','Monitoring'],
'Cybersecurity Analyst':['Networks','Security','Risk','Incident response'],
'Security Engineer':['Application security','Networks','Threat modeling','Controls'],
'Penetration Tester':['Web security','Networks','Testing','Reporting'],
'Network Engineer':['TCP/IP','Routing','Switching','Troubleshooting'],
'Database Administrator':['SQL','Databases','Backup','Performance'],
'QA Engineer':['Testing','Automation','Debugging','Quality'],
'Automation Engineer':['Python','Scripting','Workflows','Testing'],
'Game Developer':['Programming','Game engines','3D','Game design'],
'AR/VR Developer':['3D','Unity/Unreal','Interaction','Optimization'],
'Blockchain Developer':['Smart contracts','Cryptography','Programming','Testing'],
'Embedded Systems Engineer':['C/C++','Microcontrollers','Embedded Linux','Debugging'],
'Robotics Engineer':['Control systems','Python/C++','Robotics','Sensors'],
'Electronics Engineer':['Circuits','Embedded systems','Testing','Hardware'],
'Technical Writer':['Documentation','Research','Clarity','Information design'],
'Content Strategist':['Writing','Research','Analytics','Planning'],
'Digital Marketing Specialist':['SEO','Analytics','Campaigns','Content'],
'Business Analyst':['Analysis','Requirements','Communication','Problem solving'],
'Financial Analyst':['Excel','Financial modeling','Analysis','Reporting'],
'Management Consultant':['Problem solving','Research','Communication','Strategy'],
'Recruiter / Talent Partner':['Sourcing','Interviewing','Communication','Hiring']};
const skills=skillMap[career]||['Foundations','Core tools','Projects','Communication'];
document.getElementById('studyTitle').textContent=`Study: ${career}`;
document.getElementById('studyIntro').textContent=`Build ${career} skills through focused lessons, practical work and quick checks. Learn at your own pace, then use the AI tutor whenever you get stuck.`;
document.getElementById('skillCount').textContent=String(skills.length).padStart(2,'0');
document.getElementById('tutorLink').href=`chat.html?prompt=${encodeURIComponent(`Teach me ${career} from beginner level. Start with ${skills[0]} and explain it simply.`)}`;
const modules=[
['01','FOUNDATIONS',`Understand what a ${career} does, where the role fits in a team, and the problems professionals solve.`,[`Role and responsibilities`,`Industry vocabulary`,`How real teams work`]],
['02','CORE SKILLS',`Build your first layer of practical ability across the most important skills for ${career}.`,skills.map(s=>`Learn ${s}`)],
['03','TOOLS & WORKFLOW',`Learn the tools and repeatable workflow used to turn knowledge into useful work.`,[`Set up your learning environment`,`Follow a professional workflow`,`Read documentation and debug`]],
['04','PROJECT LAB',`Turn your knowledge into evidence with practical projects that solve realistic problems.`,[`Project 01: guided build`,`Project 02: independent build`,`Document decisions and results`]],
['05','PORTFOLIO & INTERVIEW',`Learn how to explain your work clearly and demonstrate your skills to recruiters and interviewers.`,[`Write strong project stories`,`Practice role-specific questions`,`Improve your resume evidence`]],
['06','NEXT LEVEL',`Move from beginner learning to deliberate practice and continuous improvement.`,[`Choose an advanced topic`,`Get feedback from AI tutor`,`Update your roadmap and build again`]]];
const modulesEl=document.getElementById('modules');
modulesEl.innerHTML=modules.map((m,i)=>`<article class="panel study-module"><div class="module-num">${m[0]} · ${m[1]}</div><h3>${m[2].split('.')[0]}</h3><p class="muted">${m[2]}</p><ul>${m[3].map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn study-complete" data-i="${i}" style="margin-top:18px">Mark module complete ✓</button></article>`).join('');
const key=`nexora_study_${career}`;let completed=JSON.parse(localStorage.getItem(key)||'[]');
function paint(){document.querySelectorAll('.study-complete').forEach((b,i)=>{const done=completed.includes(i);b.textContent=done?'Completed ✓':'Mark module complete ✓';b.classList.toggle('btn-primary',done)});const pct=Math.round(completed.length/modules.length*100);document.getElementById('studyProgress').style.width=pct+'%';document.getElementById('progressText').textContent=`${pct}% complete · ${completed.length}/${modules.length} modules`}
document.querySelectorAll('.study-complete').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.i);completed=completed.includes(i)?completed.filter(x=>x!==i):[...completed,i];localStorage.setItem(key,JSON.stringify(completed));paint()}));paint();
const quiz={q:`Which skill is a useful starting point for learning ${career}?`,options:[skills[0],skills[1],skills[2],skills[3]],answer:0};
document.getElementById('quizQuestion').textContent=quiz.q;
document.getElementById('quizOptions').innerHTML=quiz.options.map((x,i)=>`<button class="quiz-option" data-a="${i}">${x}</button>`).join('');
document.querySelectorAll('.quiz-option').forEach(b=>b.addEventListener('click',()=>{const correct=Number(b.dataset.a)===quiz.answer;document.querySelectorAll('.quiz-option').forEach(x=>x.classList.remove('correct','wrong'));b.classList.add(correct?'correct':'wrong');document.getElementById('quizResult').textContent=correct?'Correct — nice start.':'Not quite. Review the Core Skills module and try again.'}));
