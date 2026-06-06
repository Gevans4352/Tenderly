const API_BASE = 'https://lostgarden-backend.onrender.com/api'
const token = localStorage.getItem("token");

if (!token) window.location.href = "../login/login.html";

const wanderBtn = document.getElementById("wanderBtn");
const wanderNote = document.getElementById("wanderNote");

wanderBtn.addEventListener("click", async () => {
  wanderBtn.textContent = "finding something...";
  wanderBtn.disabled = true;
  wanderNote.textContent = "";

  try {
    const res = await fetch(`${API_BASE}/artifacts`);
    const artifacts = await res.json();

    if (artifacts.length === 0) {
      wanderNote.textContent =
        "the museum is empty. be the first to leave something.";
      wanderBtn.textContent = "take me somewhere";
      wanderBtn.disabled = false;
      return;
    }

    const random = artifacts[Math.floor(Math.random() * artifacts.length)];

    wanderNote.textContent = `taking you to — ${random.title}`;

    setTimeout(() => {
      window.location.href = `../exhibit/exhibit.html?id=${random.id}`;
    }, 1000);
  } catch (err) {
    wanderNote.textContent = "the museum is unreachable right now";
    wanderBtn.textContent = "take me somewhere";
    wanderBtn.disabled = false;
  }
});
