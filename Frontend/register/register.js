const API_BASE = 'https://lostgarden-backend.onrender.com/api'
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");
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

function validateForm(username, email, password) {
  const errors = {};
  if (!username || username.length === 0) {
    errors.username = "Username is required.";
  } else {
    let isValid = true;
    for (let i = 0; i < username.length; i++) {
      const char = username[i];
      const isLetter =
        (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
      const isNumber = char >= "0" && char <= "9";
      if (!isLetter && !isNumber) {
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      errors.username = "Username must only contain letters and numbers.";
    }
    if (username.length > 20) {
      errors.username = "Username cannot exceed 20 characters.";
    }
  }
  if (email.trim().length === 0) {
    errors.email = "Email address is required.";
  }
  if (!email.includes("@") || !email.includes(".")) {
    errors.email = "Please enter a valid email address";
  }
  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }
  let hasNumber = false;
  for (let i = 0; i < password.length; i++) {
    if (password[i] >= "0" && password[i] <= "9") {
      hasNumber = true;
      break;
    }
  }
  if (!hasNumber) {
    errors.password = "Password must contain at least one number.";
  }
  let hasLetter = false;
  for (let i = 0; i < password.length; i++) {
    if (
      (password[i] >= "a" && password[i] <= "z") ||
      (password[i] >= "A" && password[i] <= "Z")
    ) {
      hasLetter = true;
      break;
    }
  }
  if (!hasLetter) {
    errors.password = "Password must contain at least one letter.";
  }
  return errors;
}

registerBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const errors = validateForm(username, email, password);
  if (errors.username) {
    errorEl.textContent = errors.username;
    return;
  }
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
    const registerRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const registerData = await registerRes.json();
    if (!registerRes.ok) {
      errorEl.textContent = registerData.error || "Something went wrong";
      return;
    }
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      errorEl.textContent = "Account created! Please login";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      return;
    }
    localStorage.setItem("token", loginData.token);
    localStorage.setItem("username", loginData.username);
    window.location.href = "../museum/museum.html";
  } catch (err) {
    errorEl.textContent = "Can't reach the garden. Server Unavailable";
    console.error(err);
  }
});

const inputs = [usernameInput, emailInput, passwordInput];
inputs.forEach((input) => {
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") registerBtn.click();
    });
  }
});
