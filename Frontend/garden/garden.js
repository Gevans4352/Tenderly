const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (!token) window.location.href = "../login/login.html";

document.getElementById("usernameDisplay").textContent = username || "guest";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "../index.html";
});

document.getElementById("createBtn").addEventListener("click", () => {
  window.location.href = "../create/create.html";
});

const artifactGrid = document.getElementById("artifactGrid");
const emptyState = document.getElementById("emptyState");

async function fetchMyArtifacts() {
  try {
    const res = await fetch(`${API_BASE}/artifacts`);
    const allArtifacts = await res.json();

    // Get current user ID from token
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    const myArtifacts = allArtifacts.filter((a) => a.user_id === userId);

    if (myArtifacts.length === 0) {
      artifactGrid.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    artifactGrid.style.display = "grid";
    emptyState.style.display = "none";

    artifactGrid.innerHTML = myArtifacts
      .map(
        (artifact) => `
            <div class="artifact-card" data-id="${artifact.id}">
                <span class="card-tag">🏷️ ${artifact.mood_tag || "memory"}</span>
                <h3 class="card-title">${escapeHtml(artifact.title)}</h3>
                <p class="card-excerpt">${escapeHtml(artifact.body.substring(0, 120))}${artifact.body.length > 120 ? "..." : ""}</p>
                <div class="card-meta">
                    <span class="author">${artifact.is_anonymous ? "anon" : "you"}</span>
                    <span class="branch-count">🌿 ${artifact.branch_count || 0}</span>
                </div>
                <div class="reactions-row">
                    <span class="reaction">❤️ ${artifact.reaction_count || 0}</span>
                    <button class="delete-btn" data-id="${artifact.id}">🗑️</button>
                </div>
            </div>
        `,
      )
      .join("");
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();

        const id = btn.dataset.id;
        const modal = document.createElement("div");
        modal.className = "delete-modal";
        modal.innerHTML = `
    <p>remove this artifact from the museum?</p>
    <button class="delete-confirm-btn" data-id="${id}">yes</button>
    <button class="delete-cancel-btn">no</button>
`;
        document.body.appendChild(modal);
        const confirmBtn = modal.querySelector(".delete-confirm-btn");
        confirmBtn.addEventListener("click", async () => {
          modal.remove();
          try {
            const res = await fetch(`${API_BASE}/artifacts/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              fetchMyArtifacts();
            } else {
              const errorModal = document.createElement("div");
              errorModal.className = "delete-modal";
              errorModal.innerHTML = `<p>could not delete</p><button class="delete-cancel-btn">ok</button>`;
              document.body.appendChild(errorModal);
              errorModal
                .querySelector("button")
                .addEventListener("click", () => errorModal.remove());
            }
          } catch (err) {
            console.error(err);
            const errorModal = document.createElement("div");
            errorModal.className = "delete-modal";
            errorModal.innerHTML = `<p>something went wrong</p><button class="delete-cancel-btn">ok</button>`;
            document.body.appendChild(errorModal);
            errorModal
              .querySelector("button")
              .addEventListener("click", () => errorModal.remove());
          }
        });
        modal
          .querySelector(".delete-cancel-btn")
          .addEventListener("click", () => {
            modal.remove();
          });

        try {
          const res = await fetch(`${API_BASE}/artifacts/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            fetchMyArtifacts();
          } else {
            alert("Could not delete");
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong");
        }
      });
    });

    document.querySelectorAll(".artifact-card").forEach((card) => {
      card.addEventListener("click", () => {
        window.location.href = `../exhibit/exhibit.html?id=${card.dataset.id}`;
      });
    });
  } catch (err) {
    console.error(err);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

fetchMyArtifacts();
