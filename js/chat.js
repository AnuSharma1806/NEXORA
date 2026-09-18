const box = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const status = document.getElementById("chatStatus");
const language = document.getElementById("languageSelect");
const micBtn = document.getElementById("micBtn");
const stopVoiceBtn = document.getElementById("stopVoiceBtn");
const speakBtn = document.getElementById("speakBtn");
const voiceSelect = document.getElementById("voiceSelect");
const previewVoiceBtn = document.getElementById("previewVoiceBtn");
const stopSpeakBtn = document.getElementById("stopSpeakBtn");
const autoSpeak = document.getElementById("autoSpeak");
const clearChatBtn = document.getElementById("clearChatBtn");
const exportChatBtn = document.getElementById("exportChatBtn");
const newChatBtn = document.getElementById("newChatBtn");
const aiBadge = document.getElementById("aiBadge");
const aiBadgeTop = document.getElementById("aiBadgeTop");
function syncBadges() {
  if (!aiBadge || !aiBadgeTop) return;
  aiBadgeTop.textContent = aiBadge.textContent;
  aiBadgeTop.classList.toggle("live", aiBadge.classList.contains("live"));
}

const HISTORY = "nexora_chat_history_v4";
const API_TIMEOUT_MS = 30000;
const VOICE_KEY = "nexora_ai_voice";
let lastAI = "";
let recognition = null;
let openAIPlaying = false;

function setStatus(s) { if (status) status.textContent = s; }
function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY) || "[]"); } catch { return []; } }
function setHistory(h) { localStorage.setItem(HISTORY, JSON.stringify(h.slice(-60))); }
function add(text, type, save = true) {
  const d = document.createElement("div");
  d.className = `message ${type}`;
  d.textContent = text;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
  if (type === "ai") lastAI = text;
  if (save) saveMessage(type, text);
}
function saveMessage(type, text) {
  const h = getHistory();
  h.push({ type, text, t: Date.now() });
  setHistory(h);
}
function loadHistory() {
  const h = getHistory();
  if (h.length) h.slice(-18).forEach(x => add(x.text, x.type, false));
  else add("Hey! 👋 I’m NEXORA. What’s up? You can ask me anything — career, study, coding, resume, interviews, ideas, or just chat.", "ai", false);
}
function selectedLang() { return language?.value || "auto"; }
function historyForFirstTurn() {
  return getHistory().slice(-20).map(x => ({ role: x.type === "ai" ? "assistant" : "user", content: x.text }));
}

async function aiReply(q) {
  setStatus("NEXORA is thinking…");
  const body = {
    message: q,
    language: selectedLang(),
    profile: (() => { try { const p = JSON.parse(localStorage.getItem('nexora_profile') || '{}'); return {displayName:p.displayName||'', role:p.role||'', interest:p.interest||'', location:p.location||'', linkedin:p.linkedin||'', instagram:p.instagram||'', github:p.github||'', portfolio:p.portfolio||''}; } catch { return {}; } })(),
    history: historyForFirstTurn().slice(0, -1)
  };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    let r;
    try {
      r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }
  
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.reply) throw new Error(data.error || "OpenAI API unavailable");

    if (aiBadge) { aiBadge.textContent = "● OPENAI LIVE"; aiBadge.classList.add("live"); syncBadges(); }
    return data.reply;
  } catch (e) {
    if (aiBadge) { aiBadge.textContent = "● OPENAI ERROR"; aiBadge.classList.remove("live"); syncBadges(); }
    const msg = e?.name === "AbortError" ? "OpenAI request timed out." : (e?.message || "OpenAI API unavailable.");
    setStatus(msg);
    return localReply(q);
  }
}

function localReply(q) {
  const x = q.trim().toLowerCase();
  if (/^(hi|hello|hey|heyy|hey bro|hi bro|hello bro|wassup|what'?s up|sup|yo|hlo|hii|hiii)[!.?\s]*$/i.test(x)) return "Hey bro! 👋 I’m here. What’s up? 😄";
  if (x.includes("how are you") || x.includes("how r u")) return "I’m doing great 😄 What are you working on?";
  if (x.includes("thank")) return "Anytime bro! 🤝";
  if (x.includes("resume")) return "Sure. Send your resume or paste the text here and I’ll review the structure, projects, wording and ATS clarity.";
  if (x.includes("interview")) return "Absolutely. Tell me the role and I can run a mock interview one question at a time.";
  if (x.includes("study") || x.includes("learn")) return "Yep. Tell me the subject, your level and your goal. I can teach it step by step with examples and practice.";
  if (x.includes("career")) return "Sure. Tell me what you enjoy, what you’re studying or doing now, and what kind of work you’re curious about. We’ll explore options together.";
  return `Haan bro 😄 samajh gaya — tum bol rahe ho: “${q.trim().slice(0,180)}”. OpenAI abhi connect nahi ho pa raha, isliye main local fallback se reply kar raha hoon. Server/API status check karte hain.`;
}

async function submitQuestion(q) {
  const text = (q || "").trim();
  if (!text) return;
  add(text, "user");
  input.value = "";
  const temp = document.createElement("div");
  temp.className = "message ai typing";
  temp.innerHTML = "<i></i><i></i><i></i>";
  box.appendChild(temp);
  box.scrollTop = box.scrollHeight;
  const reply = await aiReply(text);
  temp.className = "message ai";
  temp.textContent = reply;
  lastAI = reply;
  saveMessage("ai", reply);
  box.scrollTop = box.scrollHeight;
  if (autoSpeak?.checked) await speakText(reply);
  setStatus(aiBadge?.classList.contains("live") ? "OpenAI connected · Ready." : "Demo mode · Ready.");
}

form?.addEventListener("submit", e => { e.preventDefault(); submitQuestion(input.value); });
document.querySelectorAll(".quick-prompts button").forEach(b => b.addEventListener("click", () => submitQuestion(b.textContent)));

document.querySelectorAll(".chat-history button[data-prompt]").forEach(b => b.addEventListener("click", () => submitQuestion(b.dataset.prompt)));

// Browser speech-to-text remains a fast input method. The answer voice below can use OpenAI TTS.
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new R();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onstart = () => { setStatus("Listening… speak now"); if (micBtn) micBtn.hidden = true; if (stopVoiceBtn) stopVoiceBtn.hidden = false; };
  recognition.onresult = e => { let t = ""; for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript; input.value = t; };
  recognition.onerror = () => setStatus("Microphone recognition failed. Check browser permission.");
  recognition.onend = () => { if (micBtn) micBtn.hidden = false; if (stopVoiceBtn) stopVoiceBtn.hidden = true; if (input.value.trim()) form.requestSubmit(); else setStatus("Ready."); };
} else if (micBtn) { micBtn.disabled = true; micBtn.title = "Speech recognition is not supported in this browser"; }

micBtn?.addEventListener("click", () => {
  if (!recognition) return;
  recognition.lang = selectedLang() === "auto" ? "en-US" : selectedLang();
  try { recognition.start(); } catch { setStatus("Microphone is already listening."); }
});
stopVoiceBtn?.addEventListener("click", () => recognition?.stop());

const OPENAI_VOICES = [
  ["marin", "Marin · natural"], ["cedar", "Cedar · warm"], ["coral", "Coral · friendly"],
  ["sage", "Sage · calm"], ["ash", "Ash · clear"], ["verse", "Verse · expressive"],
  ["alloy", "Alloy · balanced"], ["nova", "Nova · bright"], ["echo", "Echo · deep"],
  ["shimmer", "Shimmer · soft"], ["ballad", "Ballad · smooth"], ["fable", "Fable · storytelling"]
];
function setupVoices() {
  if (!voiceSelect) return;
  voiceSelect.innerHTML = OPENAI_VOICES.map(([v, label]) => `<option value="${v}">${label}</option>`).join("");
  voiceSelect.value = localStorage.getItem(VOICE_KEY) || "marin";
  voiceSelect.addEventListener("change", () => localStorage.setItem(VOICE_KEY, voiceSelect.value));
}
async function speakText(text) {
  if (!text) return;
  const voice = voiceSelect?.value || "marin";
  setStatus(`Generating ${voice} voice…`);
  try {
    const r = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 4096), voice, language: selectedLang() })
    });
    if (!r.ok) throw new Error("TTS unavailable");
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    openAIPlaying = true;
    audio.onended = () => { openAIPlaying = false; URL.revokeObjectURL(url); setStatus("OpenAI connected · Ready."); };
    audio.onerror = () => { openAIPlaying = false; URL.revokeObjectURL(url); throw new Error("audio error"); };
    window.__nexoraAudio?.pause();
    window.__nexoraAudio = audio;
    await audio.play();
  } catch {
    // Local/browser fallback if the server is not deployed with an OpenAI key.
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = selectedLang() === "auto" ? "en-US" : selectedLang();
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
    setStatus("Browser voice fallback · Ready.");
  }
}

speakBtn?.addEventListener("click", () => speakText(lastAI));
previewVoiceBtn?.addEventListener("click", () => speakText("Hi! I’m NEXORA. This is a preview of my selected voice."));
stopSpeakBtn?.addEventListener("click", () => {
  window.speechSynthesis.cancel();
  if (window.__nexoraAudio) { window.__nexoraAudio.pause(); window.__nexoraAudio.currentTime = 0; }
  openAIPlaying = false;
  setStatus("Voice stopped · Ready.");
});

function clearConversation() {
  localStorage.removeItem(HISTORY);

  box.innerHTML = "";
  lastAI = "";
  add("Fresh chat started. 👋 What would you like to talk about?", "ai", false);
  if (aiBadge) { aiBadge.textContent = "● OPENAI READY"; aiBadge.classList.remove("live"); syncBadges(); }
  setStatus("New conversation · Ready.");
}
clearChatBtn?.addEventListener("click", clearConversation);
newChatBtn?.addEventListener("click", clearConversation);
exportChatBtn?.addEventListener("click", () => {
  const text = getHistory().map(x => `${x.type === "user" ? "You" : "NEXORA"}: ${x.text}`).join("\n\n");
  const blob = new Blob([text || "NEXORA chat"], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `nexora-chat-${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
});

// Study page can deep-link into chat with ?prompt=...
const deepPrompt = new URLSearchParams(location.search).get("prompt");
setupVoices();
syncBadges();
loadHistory();
if (deepPrompt) setTimeout(() => { input.value = deepPrompt; form.requestSubmit(); }, 250);
