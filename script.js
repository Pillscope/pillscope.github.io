// PillScope — live search
// Filters MEDICINES (see data.js) as the user types, no submit needed.

// PillScope — search bar
// No longer searches as you type: results only load once you submit
// (press Enter or tap the magnifying-glass icon), and take you straight
// to the full results page at /search/index.html?q=...

function initLiveSearch() {
  const input = document.getElementById("search-input");
  const clearBtn = document.getElementById("search-clear");
  const searchIcon = document.querySelector(".search-box svg");
  if (!input) return;

  // Goes to the full search results page for whatever is currently typed.
  // Pulled out so both the Enter key and the magnifying-glass icon can use it —
  // some mobile keyboards never send a clean "Enter" keydown for plain text
  // inputs (IME composition reports keyCode 229 instead), so the icon acts as
  // a guaranteed fallback for tapping "search".
  function goToSearchPage() {
    const query = input.value.trim();
    if (query) {
      window.location.href = `/search/index.html?q=${encodeURIComponent(query)}`;
    }
  }

  input.addEventListener("input", () => {
    clearBtn.classList.toggle("visible", input.value.length > 0);
  });

  input.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.keyCode === 13) && !e.isComposing) {
      e.preventDefault();
      goToSearchPage();
    }
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.classList.remove("visible");
    input.focus();
  });

  if (searchIcon) {
    searchIcon.style.cursor = "pointer";
    searchIcon.addEventListener("click", goToSearchPage);
  }
}

function initBrowseGrid() {
  const grid = document.getElementById("med-grid");
  const chipRow = document.getElementById("chip-row");
  if (!grid || !chipRow) return;

  const categories = ["All", ...new Set(MEDICINES.map((m) => m.category))];

  categories.forEach((cat) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (cat === "All" ? " active" : "");
    chip.textContent = cat;
    chip.dataset.cat = cat;
    chip.addEventListener("click", () => {
      chipRow.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderGrid(cat);
    });
    chipRow.appendChild(chip);
  });

  function renderGrid(filter) {
    grid.innerHTML = "";
    const list = filter === "All" ? MEDICINES : MEDICINES.filter((m) => m.category === filter);
    list.forEach((med) => {
      const card = document.createElement("a");
      card.className = "med-card";
      card.href = `/med.html?id=${encodeURIComponent(med.id)}`;

      const bar = document.createElement("div");
      bar.className = "swatch-bar";
      bar.style.background = CATEGORY_COLORS[med.category] || "#DEDEDE";

      const name = document.createElement("div");
      name.className = "card-name";
      name.textContent = med.name;

      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.textContent = `${med.category} · ${med.strength}`;

      card.appendChild(bar);
      card.appendChild(name);
      card.appendChild(meta);
      grid.appendChild(card);
    });
  }

  renderGrid("All");
}

document.addEventListener("DOMContentLoaded", () => {
  initLiveSearch();
  initBrowseGrid();
});
