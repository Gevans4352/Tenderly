const API_BASE = "http://localhost:5000/api";
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorEl = document.getElementById("error");
const eyeBtn = document.getElementById("eyeBtn");
const eyeOpen = document.getElementById("eyeOpen");
const eyeClosed = document.getElementById("eyeClosed");

if (eyeBtn) {
  eyeBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    eyeOpen.style.display = isHidden ? "none" : "block";
    eyeClosed.style.display = isHidden ? "block" : "none";
  });
}

function validateForm(email, password) {
  const errors = {};
  if (email === "") {
    errors.email = "Email is required";
  } else if (email.trim() === "") {
    errors.email = "Email cannot be only spaces.";
  } else if (!email.includes("@") || !email.includes(".")) {
    errors.email = "Email is invalid";
  }
  if (password === "") {
    errors.password = "Password is required.";
  } else if (password.trim() === "") {
    errors.password = "Password cannot be only spaces.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const errors = validateForm(email, password);

  if (errors.email) {
    errorEl.textContent = errors.email;
    return;
  }
  if (errors.password) {
    errorEl.textContent = errors.password;
    return;
  }

  errorEl.textContent = "";

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || "wrong email or password";
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    window.location.href = "museum.html";
  } catch (err) {
    errorEl.textContent = "Can't reach the garden. Server unavailable";
    console.error(err);
  }
});

passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") loginBtn.click();
});
