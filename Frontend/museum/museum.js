const API_BASE = 'https://lostgarden-backend.onrender.com/api'
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (!token) {
  window.location.href = "../login/login.html";
}

const myGardenLink = document.getElementById('myGardenLink')
myGardenLink.textContent = username || 'guest'
myGardenLink.href = '../garden/garden.html'

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "../index.html";
});

const artifactGrid = document.getElementById("artifactGrid");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const moodFilter = document.getElementById("moodFilter");
const eraFilter = document.getElementById("eraFilter");
const searchInput = document.getElementById("searchInput");
const createBtn = document.getElementById("createBtn");

let allArtifacts = [];

async function fetchArtifacts() {
  loadingState.style.display = "block";
  artifactGrid.style.display = "none";
  emptyState.style.display = "none";

  try {
    const res = await fetch(`${API_BASE}/artifacts`);
    const data = await res.json();
    allArtifacts = data;
    renderArtifacts();
  } catch (err) {
    console.error("Failed to fetch:", err);
    artifactGrid.innerHTML =
      '<p class="empty-state">the museum is quiet right now</p>';
  } finally {
    loadingState.style.display = "none";
  }
}

function filterArtifacts() {
  const mood = moodFilter.value;
  const era = eraFilter.value;
  const search = searchInput.value.toLowerCase();

  return allArtifacts.filter((artifact) => {
    if (mood !== "all" && artifact.mood_tag !== mood) return false;
    if (era !== "all" && artifact.era_tag !== era) return false;
    if (
      search &&
      !artifact.title.toLowerCase().includes(search) &&
      !artifact.body.toLowerCase().includes(search)
    )
      return false;
    return true;
  });
}

function renderArtifacts() {
  const filtered = filterArtifacts();

  if (filtered.length === 0) {
    artifactGrid.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  artifactGrid.style.display = "grid";
  emptyState.style.display = "none";

  artifactGrid.innerHTML = filtered
    .map(
      (artifact) => `
        <div class="artifact-card" data-id="${artifact.id}">
            <span class="card-tag">🏷️ ${artifact.mood_tag || "memory"}</span>
            <h3 class="card-title">${escapeHtml(artifact.title)}</h3>
            <p class="card-excerpt">${escapeHtml(artifact.body.substring(0, 120))}${artifact.body.length > 120 ? "..." : ""}</p>
            <div class="card-meta">
                <span class="author">by ${artifact.is_anonymous ? "anon" : artifact.username || "someone"}</span>
                <span class="branch-count">🌿 ${artifact.branch_count || 0}</span>
            </div>
          <div class="reactions-row">
            <span class="reaction">🌿 ${artifact.branch_count || 0}</span>
            <span class="reaction">❤️ ${artifact.reaction_count || 0}</span>
          </div>
        </div>
    `,
    )
    .join("");

  document.querySelectorAll(".artifact-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      window.location.href = `../exhibit/exhibit.html?id=${id}`;
    });
  });
}

const escapeHtml = (str = "") => {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === "&") result += "&amp;";
    else if (char === "<") result += "&lt;";
    else if (char === ">") result += "&gt;";
    else result += char;
  }

  return result;
};

moodFilter.addEventListener("change", renderArtifacts);
eraFilter.addEventListener("change", renderArtifacts);
searchInput.addEventListener("input", renderArtifacts);

createBtn.addEventListener("click", () => {
  window.location.href = "../create/create.html";
});

fetchArtifacts();
