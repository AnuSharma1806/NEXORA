export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  try{
    const {text,voice="marin",language="auto"}=req.body||{};
    if(!text?.trim()) return res.status(400).json({error:"Text required"});
    if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:"OPENAI_API_KEY is not configured"});
    const allowed=["alloy","ash","ballad","coral","echo","fable","nova","onyx","sage","shimmer","verse","marin","cedar"];
    const chosen=allowed.includes(voice)?voice:"marin";
    const lang=language && language!=="auto" ? `Speak naturally in ${language}.` : "Speak naturally in the language of the text.";
    const r=await fetch("https://api.openai.com/v1/audio/speech",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify({model:"gpt-4o-mini-tts",voice:chosen,input:text.trim().slice(0,4096),instructions:`${lang} Use a warm, clear, natural conversational delivery.`,response_format:"mp3"})
    });
    if(!r.ok){const d=await r.text();return res.status(r.status).json({error:d||"OpenAI TTS request failed"});}
    const audio=Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type","audio/mpeg");
    res.setHeader("Cache-Control","no-store");
    return res.status(200).send(audio);
  }catch(e){console.error(e);return res.status(500).json({error:"TTS server error"});}
}
