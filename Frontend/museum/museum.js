const API_BASE = 'http://localhost:5000/api'
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (!token) {
  window.location.href = "../login/login.html";
}

const myGardenLink = document.getElementById("myGardenLink");
myGardenLink.textContent = username || "guest";
myGardenLink.href = "../garden/garden.html";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "../index.html";
});

const artifactGrid = document.getElementById("artifactGrid");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const createBtn = document.getElementById("createBtn");

let allArtifacts = [];
let selectedSort = "newest";

async function fetchArtifacts() {
  loadingState.style.display = "block";
  artifactGrid.style.display = "none";
  emptyState.style.display = "none";

  try {
    const res = await fetch(`${API_BASE}/artifacts?sort=${selectedSort}`);
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
  const search = searchInput.value.toLowerCase();

  return allArtifacts.filter((artifact) => {
    if (selectedMood !== "all" && artifact.mood_tag !== selectedMood)
      return false;
    if (selectedEra !== "all" && artifact.era_tag !== selectedEra) return false;
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

searchInput.addEventListener("input", renderArtifacts);

createBtn.addEventListener("click", () => {
  window.location.href = "../create/create.html";
});

function initDropdown(selectId, onChange) {
  const container = document.getElementById(selectId);
  const trigger = container.querySelector(".select-trigger");
  const dropdown = container.querySelector(".select-dropdown");
  const valueEl = container.querySelector(".select-value");
  const options = container.querySelectorAll(".select-option");

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains("open");
    document
      .querySelectorAll(".select-dropdown")
      .forEach((d) => d.classList.remove("open"));
    document
      .querySelectorAll(".select-trigger")
      .forEach((t) => t.classList.remove("open"));
    if (!isOpen) {
      dropdown.classList.add("open");
      trigger.classList.add("open");
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("selected"));
      option.classList.add("selected");
      valueEl.textContent = option.textContent;
      dropdown.classList.remove("open");
      trigger.classList.remove("open");
      onChange(option.dataset.value);
    });
  });
}

document.addEventListener("click", () => {
  document
    .querySelectorAll(".select-dropdown")
    .forEach((d) => d.classList.remove("open"));
  document
    .querySelectorAll(".select-trigger")
    .forEach((t) => t.classList.remove("open"));
});

let selectedMood = "all";
let selectedEra = "all";

fetchArtifacts();

initDropdown("moodSelect", (value) => {
  selectedMood = value;
  renderArtifacts();
});

initDropdown("eraSelect", (value) => {
  selectedEra = value;
  renderArtifacts();
});

initDropdown("sortSelect", (value) => {
  selectedSort = value;
  fetchArtifacts();
});
