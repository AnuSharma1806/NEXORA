export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  try{
    if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:"OPENAI_API_KEY is not configured."});
    const {resumeText,targetRole="general"}=req.body||{};
    if(!resumeText?.trim()) return res.status(400).json({error:"Resume text required"});
    const instructions=`You are NEXORA Resume Intelligence. Analyze the user's resume text for a target role. Return concise JSON with keys: score (0-100), summary, strengths (array), gaps (array), ats_fixes (array), suggested_projects (array), rewritten_bullets (array). Do not invent experience. Make rewritten bullets truthful and use placeholders where facts are missing. Target role: ${String(targetRole).slice(0,120)}.`;
    const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5.6-luna",instructions,input:resumeText.slice(0,18000),text:{format:{type:"json_object"}},max_output_tokens:1800})});
    const d=await r.json(); if(!r.ok) return res.status(r.status).json({error:d.error?.message||"Analysis failed"});
    let result; try{result=JSON.parse(d.output_text||"{}")}catch{result={score:0,summary:d.output_text||"Could not parse analysis",strengths:[],gaps:[],ats_fixes:[],suggested_projects:[],rewritten_bullets:[]};}
    res.status(200).json(result);
  }catch(e){res.status(500).json({error:e.message||"Server error"});}
}
