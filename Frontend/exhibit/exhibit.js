const API_BASE = "https://lostgarden-backend.onrender.com/api";
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

const params = new URLSearchParams(window.location.search);
const artifactId = params.get("id");

if (!artifactId) window.location.href = "../museum/museum.html";
document.querySelectorAll(".reaction-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (!token) return (window.location.href = "../login/login.html");

    const emoji = btn.dataset.emoji;

    await fetch(`${API_BASE}/reactions/${artifactId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ emoji }),
    });

    btn.classList.toggle("reacted");
    await loadReactions();
  });
});
async function loadArtifact() {
  const res = await fetch(`${API_BASE}/artifacts/${artifactId}`);
  const artifact = await res.json();

  if (!res.ok) return (window.location.href = "../museum/museum.html");

  document.title = `Lostgarden — ${artifact.title}`;
  document.getElementById("exhibitNumber").textContent =
    `exhibit · ${String(artifact.id).padStart(4, "0")}`;
  document.getElementById("artifactTitle").textContent = artifact.title;
  document.getElementById("artifactBody").textContent = artifact.body;
  document.getElementById("moodEra").textContent = [
    artifact.mood_tag,
    artifact.era_tag,
  ]
    .filter(Boolean)
    .join(" · ");
  document.getElementById("artifactMeta").textContent =
    `— ${artifact.is_anonymous ? "anon" : artifact.username} · ${new Date(artifact.created_at).getFullYear()}`;
}

async function loadReactions() {
  const res = await fetch(`${API_BASE}/reactions/${artifactId}`);
  const reactions = await res.json();

  const counts = { "🌿": 0, "❤️": 0, "✨": 0 };
  reactions.forEach((r) => {
    if (counts[r.emoji] !== undefined) counts[r.emoji] = parseInt(r.count);
  });

  document.getElementById("count-plant").textContent = counts["🌿"];
  document.getElementById("count-heart").textContent = counts["❤️"];
  document.getElementById("count-spark").textContent = counts["✨"];
}
async function loadBranches() {
  const res = await fetch(`${API_BASE}/branches/${artifactId}`);
  const branches = await res.json();

  const zone = document.getElementById("branchesZone");
  const label = document.getElementById("branchesLabel");

  label.textContent =
    branches.length === 0
      ? "no notes yet"
      : `${branches.length} note${branches.length === 1 ? "" : "s"} left on this wall`;

  zone.innerHTML = branches
    .map(
      (b, i) => `
        <div class="branch-card" data-index="${i}">
            <p class="branch-body" data-text="${escapeAttr(b.body)}"></p>
            <p class="branch-meta">— ${b.is_anonymous ? "anon" : b.username} · ${timeAgo(b.created_at)}</p>
        </div>
    `,
    )
    .join("");

  observeBranches();
}

function typewrite(element, text, speed = 18) {
  let i = 0;
  element.textContent = "";
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

function observeBranches() {
  const cards = document.querySelectorAll(".branch-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add("visible");
          const bodyEl = card.querySelector(".branch-body");
          const text = bodyEl.dataset.text;
          typewrite(bodyEl, text);
          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.2 },
  );

  cards.forEach((card) => observer.observe(card));
}
document.getElementById("pinBtn").addEventListener("click", async () => {
  if (!token) return (window.location.href = "../login/login.html");

  const input = document.getElementById("branchInput");
  const error = document.getElementById("plantError");
  const pinBtn = document.getElementById("pinBtn");
  const body = input.value.trim();

  if (!body) return (error.textContent = "write something first");
  error.textContent = "";

  pinBtn.innerHTML = '<span class="spinner"></span>';
  pinBtn.disabled = true;

  const res = await fetch(`${API_BASE}/branches/${artifactId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body }),
  });

  if (res.ok) {
    input.value = "";
    pinBtn.textContent = "pin it →";
    pinBtn.disabled = false;
    await loadBranches();
  } else {
    error.textContent = "could not pin your note";
    pinBtn.innerHTML = "pin it →";
    pinBtn.disabled = false;
  }
});
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function escapeAttr(str = "") {
  return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

loadArtifact();
loadReactions();
loadBranches();
