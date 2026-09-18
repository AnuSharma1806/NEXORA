const USERS_KEY = "nexora_users";
const SESSION_KEY = "nexora_session";

const users = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

function notice(msg, type = "error") {
  const n = document.getElementById("notice");
  if (!n) return;
  n.innerHTML = `<div class="notice ${type === "success" ? "notice-success" : "notice-error"}" role="alert" style="margin-bottom:16px">${msg}</div>`;
}

// SIGN UP
const sf = document.getElementById("signupForm");
if (sf) {
  sf.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const u = users();

    if (password.length < 4) return notice("Password must be at least 4 characters.");
    if (u.some((x) => x.email === email)) {
      return notice("An account with this email already exists. Try logging in.");
    }

    u.push({ name, email, password, created: Date.now() });
    saveUsers(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));
    location.href = "dashboard.html";
  });
}

// LOGIN — wrong passwords NEVER create a session or redirect.
const lf = document.getElementById("loginForm");
if (lf) {
  lf.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const u = users();
    const account = u.find((x) => x.email === email);

    if (!account) {
      localStorage.removeItem(SESSION_KEY);
      return notice("No account found with this email. Create an account first.");
    }

    if (account.password !== password) {
      localStorage.removeItem(SESSION_KEY);
      return notice("Wrong password. Please try again or use Forgot password.");
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: account.name, email: account.email }));
    location.href = "dashboard.html";
  });
}

// FORGOT PASSWORD — browser-local demo reset.
const forgotBtn = document.getElementById("forgotBtn");
if (forgotBtn) {
  forgotBtn.addEventListener("click", () => {
    const card = document.querySelector(".auth-card");
    if (!card || document.getElementById("resetBox")) return;

    const box = document.createElement("div");
    box.id = "resetBox";
    box.className = "reset-box";
    box.innerHTML = `
      <strong>Reset password</strong>
      <p class="muted" style="font-size:12px;margin:7px 0 14px">
        Enter the email used for your NEXORA account and choose a new password.
      </p>
      <div class="form-group">
        <label for="resetEmail">Email</label>
        <input class="input" id="resetEmail" type="email" autocomplete="email" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label for="resetPassword">New password</label>
        <input class="input" id="resetPassword" type="password" minlength="4" autocomplete="new-password" placeholder="New password">
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" id="resetBtn" type="button">Reset password</button>
        <button class="btn" id="cancelReset" type="button">Cancel</button>
      </div>`;

    card.appendChild(box);

    document.getElementById("cancelReset").addEventListener("click", () => box.remove());
    document.getElementById("resetBtn").addEventListener("click", () => {
      const email = document.getElementById("resetEmail").value.trim().toLowerCase();
      const pw = document.getElementById("resetPassword").value;
      const u = users();
      const i = u.findIndex((x) => x.email === email);

      if (i < 0) return notice("No account was found with that email.");
      if (pw.length < 4) return notice("Password must be at least 4 characters.");

      u[i].password = pw;
      saveUsers(u);
      localStorage.removeItem(SESSION_KEY);
      box.remove();
      notice("Password reset successfully. You can now log in with your new password.", "success");
    });
  });
}
