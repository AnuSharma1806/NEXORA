const careers = [["AI / ML Engineer", "Technology", "Python, ML, statistics", "Build and evaluate intelligent systems."], ["Data Scientist", "Data", "Python, SQL, statistics", "Turn data into models, experiments and decisions."], ["Data Analyst", "Data", "SQL, Excel, dashboards", "Translate business data into useful insights."], ["Data Engineer", "Data", "SQL, Python, pipelines", "Build reliable systems that move and transform data."], ["Machine Learning Engineer", "Technology", "Python, ML, deployment", "Productionize machine-learning models at scale."], ["AI Product Manager", "Product", "Strategy, AI, communication", "Guide AI products from user problem to launch."], ["Product Manager", "Product", "Strategy, research, communication", "Coordinate users, business and technology around outcomes."], ["Product Designer", "Design", "UX, research, prototyping", "Design clear and useful digital experiences."], ["UX Researcher", "Design", "Research, interviews, synthesis", "Understand users and turn evidence into product insight."], ["UI Designer", "Design", "Visual design, Figma, systems", "Create polished interfaces and visual systems."], ["UX Engineer", "Design", "HTML, CSS, JavaScript, UX", "Bridge interaction design and front-end implementation."], ["Frontend Developer", "Technology", "HTML, CSS, JavaScript", "Build fast, accessible interfaces for the web."], ["Backend Developer", "Technology", "APIs, databases, programming", "Build services, business logic and data systems."], ["Full Stack Developer", "Technology", "Frontend, backend, databases", "Build complete web products end to end."], ["Mobile App Developer", "Technology", "Android/iOS, APIs, UI", "Create native or cross-platform mobile experiences."], ["DevOps Engineer", "Cloud", "Linux, CI/CD, automation", "Automate software delivery and reliable operations."], ["Cloud Engineer", "Cloud", "Cloud platforms, networking, Linux", "Design and operate scalable cloud infrastructure."], ["Site Reliability Engineer", "Cloud", "Linux, observability, automation", "Improve reliability, performance and operational systems."], ["Cloud Security Engineer", "Security", "Cloud, IAM, security", "Protect cloud infrastructure and identities."], ["Cybersecurity Analyst", "Security", "Networks, security, risk", "Monitor systems and investigate security events."], ["Security Engineer", "Security", "AppSec, networks, threat modeling", "Design and strengthen technical security controls."], ["Penetration Tester", "Security", "Web security, networks, testing", "Assess authorized systems for security weaknesses."], ["Security Operations Analyst", "Security", "SIEM, incident response", "Detect and respond to security incidents."], ["Network Engineer", "Technology", "TCP/IP, routing, switching", "Design and maintain connected systems."], ["Systems Administrator", "Technology", "Linux/Windows, networking", "Operate and maintain organizational IT systems."], ["Database Administrator", "Data", "SQL, databases, backup", "Keep critical databases secure, available and performant."], ["QA Engineer", "Technology", "Testing, automation, debugging", "Verify software quality through systematic testing."], ["Automation Engineer", "Technology", "Python, scripting, workflows", "Automate repetitive technical and business processes."], ["Game Developer", "Creative Tech", "Game engines, programming, 3D", "Build interactive games and experiences."], ["AR/VR Developer", "Creative Tech", "3D, Unity/Unreal, interaction", "Create immersive augmented and virtual experiences."], ["Blockchain Developer", "Technology", "Smart contracts, cryptography", "Build applications using decentralized technologies."], ["Embedded Systems Engineer", "Engineering", "C/C++, microcontrollers", "Develop software for connected physical devices."], ["Robotics Engineer", "Engineering", "Control, Python/C++, robotics", "Build software and systems for robots."], ["Electronics Engineer", "Engineering", "Circuits, embedded systems", "Design and test electronic hardware systems."], ["Technical Writer", "Content", "Documentation, research, clarity", "Explain technical products and processes clearly."], ["Content Strategist", "Content", "Writing, research, analytics", "Plan content around audiences and business goals."], ["Digital Marketing Specialist", "Marketing", "SEO, analytics, campaigns", "Grow products through measurable digital channels."], ["Business Analyst", "Business", "Analysis, requirements, communication", "Connect business needs with practical solutions."], ["Financial Analyst", "Finance", "Excel, financial modeling, analysis", "Analyze financial performance and support decisions."], ["Management Consultant", "Business", "Problem solving, research, communication", "Structure complex business problems and recommendations."], ["Recruiter / Talent Partner", "People", "Sourcing, interviewing, communication", "Connect organizations with suitable talent."]];

const grid = document.getElementById("careerGrid");
const search = document.getElementById("careerSearch");
const category = document.getElementById("careerCategory");
const count = document.getElementById("careerCount");
const empty = document.getElementById("careerEmpty");

const categories = ["All", ...new Set(careers.map(c => c[1]))];
category.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");

function render() {
  const q = (search.value || "").trim().toLowerCase();
  const cat = category.value;
  const list = careers.filter(c =>
    (cat === "All" || c[1] === cat) &&
    (!q || c.join(" ").toLowerCase().includes(q))
  );

  count.textContent = `${list.length} career${list.length === 1 ? "" : "s"} found`;
  empty.hidden = list.length !== 0;

  // Skills remain searchable, but are no longer dumped as a raw comma-separated
  // line under the career title. This keeps cards clean and premium.
  grid.innerHTML = list.map((c) => `
    <article class="panel career-card" data-career="${c[0]}">
      <div>
        <div class="card-topline">
          <span class="tag">${String(careers.indexOf(c) + 1).padStart(2, "0")}</span>
          <span class="career-category">${c[1]}</span>
        </div>
        <h3>${c[0]}</h3>
        <p class="muted career-description">${c[3]}</p>
      </div>
      <div class="career-card-footer">
        <span class="career-action-label">LEARN + BUILD</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
          <a class="btn study-btn" href="study.html?career=${encodeURIComponent(c[0])}">Study ↗</a>
          <a class="btn" href="roadmap.html?career=${encodeURIComponent(c[0])}">Roadmap ↗</a>
        </div>
      </div>
    </article>`).join("");
}

search.addEventListener("input", render);
category.addEventListener("change", render);
render();
