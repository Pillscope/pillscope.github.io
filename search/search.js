// PillScope — full search results page (/search/index.html?q=...)
//
// Results now come primarily from live sources (openFDA's full label
// database + the NDC Directory, via PillAPI), not a fixed local list —
// so results aren't capped at a small hardcoded set. A query is also
// checked against NDC / RxCUI / CAS / ATC code shapes and routed to the
// matching identifier lookup automatically. The old 14-item MEDICINES
// array (from pillscope-data.js) is used only as an offline fallback if
// every live call fails (e.g. no network).

(function () {
  const input = document.getElementById("search-input");
  const clearBtn = document.getElementById("search-clear");
  const grid = document.getElementById("med-grid");
  const emptyState = document.getElementById("empty-state");
  const emptyHeading = document.getElementById("empty-heading");
  const heading = document.getElementById("search-heading");
  const sub = document.getElementById("search-sub");
  const pageTitle = document.getElementById("page-title");

  if (!input || !grid) return;

  let requestToken = 0;

  function getQueryParam() {
    return new URLSearchParams(window.location.search).get("q") || "";
  }

  function localMatches(query) {
    const q = query.trim().toLowerCase();
    if (!q || typeof MEDICINES === "undefined") return [];
    return MEDICINES.filter((med) => {
      const haystack = [med.name, med.generic, med.category, ...(med.brand || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function makeCard(med, opts = {}) {
    const card = document.createElement("a");
    card.className = "med-card";
    card.href = opts.href || `/med.html?id=${encodeURIComponent(med.id)}`;

    const bar = document.createElement("div");
    bar.className = "swatch-bar";
    bar.style.background =
      (typeof CATEGORY_COLORS !== "undefined" && CATEGORY_COLORS[med.category]) || "#DEDEDE";

    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = med.name;

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.textContent = opts.metaText || `${med.category || "General"} · ${med.strength || "—"}`;

    card.appendChild(bar);
    card.appendChild(name);
    card.appendChild(meta);
    return card;
  }

  function updateHeading(query, count, statusText) {
    const q = query.trim();
    if (q) {
      heading.textContent = `Search results for "${q}"`;
      pageTitle.textContent = `Search: ${q} — PillScope`;
      sub.textContent =
        statusText ||
        (count
          ? `${count} match${count === 1 ? "" : "es"} found from live FDA / NLM sources.`
          : "Searching live sources…");
    } else {
      heading.textContent = "Browse all medicines";
      pageTitle.textContent = "Search — PillScope";
      sub.textContent = "Type a name, NDC, RxCUI, CAS number, or ATC code — or scan a barcode.";
    }
  }

  function showGrid() {
    emptyState.hidden = true;
    grid.style.display = "grid";
  }

  function showEmpty(message) {
    grid.style.display = "none";
    emptyState.hidden = false;
    emptyHeading.textContent = message;
  }

  // Renders a single identifier-lookup result (NDC / RxCUI / CAS / ATC)
  // straight through to the detail page instead of a results grid, since
  // there's normally exactly one right answer for those.
  function goToDetailFor(med, query) {
    if (med.id) {
      window.location.href = `/med.html?id=${encodeURIComponent(med.id)}&src=live`;
    } else {
      window.location.href = `/med.html?q=${encodeURIComponent(query)}`;
    }
  }

  async function render(query) {
    const myToken = ++requestToken;
    const q = query.trim();

    grid.innerHTML = "";
    updateHeading(q, 0);

    if (!q) {
      const all = typeof MEDICINES !== "undefined" ? MEDICINES : [];
      if (all.length) {
        showGrid();
        all.forEach((med) => grid.appendChild(makeCard(med)));
        updateHeading(q, all.length);
      } else {
        showEmpty("No medicines to show");
      }
      return;
    }

    if (typeof PillAPI === "undefined") {
      // No live layer available at all — fall back to local data only.
      const matches = localMatches(q);
      if (matches.length) {
        showGrid();
        matches.forEach((med) => grid.appendChild(makeCard(med)));
        updateHeading(q, matches.length);
      } else {
        showEmpty(`No matches for "${q}"`);
      }
      return;
    }

    const { type } = PillAPI.detectIdentifier(q);

    // Identifier searches (NDC / RxCUI / CAS / ATC) resolve to a single
    // best answer rather than a browsable grid — jump straight there.
    if (type !== "name") {
      updateHeading(q, 0, `Looking up ${type.toUpperCase()} "${q}"…`);
      try {
        const med = await PillAPI.lookupAny(q);
        if (myToken !== requestToken) return;
        if (med) {
          goToDetailFor(med, q);
          return;
        }
      } catch (err) {
        console.warn("Identifier lookup failed:", err);
      }
      if (myToken !== requestToken) return;
      showEmpty(`No result for ${type.toUpperCase()} "${q}"`);
      updateHeading(q, 0, `No match for that ${type.toUpperCase()}.`);
      return;
    }

    // Plain-name search: broad live results from openFDA's full label
    // database, which covers the whole US drug market rather than a
    // hand-picked list.
    let liveResults = [];
    try {
      liveResults = await PillAPI.searchAll(q, 30);
    } catch (err) {
      console.warn("Live search failed:", err);
    }
    if (myToken !== requestToken) return;

    if (liveResults.length) {
      showGrid();
      liveResults.forEach((med) => grid.appendChild(makeCard(med, { href: `/med.html?q=${encodeURIComponent(med.name)}` })));
      updateHeading(q, liveResults.length);
      return;
    }

    // Live search came back empty (rare — usually a genuine typo/no match,
    // occasionally an offline/network issue) — fall back to the local
    // sample list plus RxNorm name suggestions, so the page never just
    // dead-ends.
    const matches = localMatches(q);
    if (matches.length) {
      showGrid();
      matches.forEach((med) => grid.appendChild(makeCard(med)));
      updateHeading(q, matches.length, `${matches.length} offline sample match(es) — live sources found nothing for "${q}".`);
      return;
    }

    try {
      const suggestions = await PillAPI.search(q);
      if (myToken !== requestToken) return;
      if (suggestions.length) {
        showGrid();
        suggestions.forEach((name) =>
          grid.appendChild(
            makeCard(
              { name },
              { href: `/med.html?q=${encodeURIComponent(name)}`, metaText: "Live lookup — click to view" }
            )
          )
        );
        updateHeading(q, suggestions.length, `${suggestions.length} possible match(es) for "${q}".`);
        return;
      }
    } catch (err) {
      console.warn("RxNorm suggestion fallback failed:", err);
    }

    if (myToken !== requestToken) return;
    showEmpty(`No matches for "${q}"`);
  }

  function syncUrl(query) {
    const q = query.trim();
    const url = q ? `/search/index.html?q=${encodeURIComponent(q)}` : `/search/index.html`;
    window.history.replaceState(null, "", url);
  }

  const initialQuery = getQueryParam();
  input.value = initialQuery;
  clearBtn.classList.toggle("visible", initialQuery.length > 0);
  render(initialQuery);

  let debounce = null;
  input.addEventListener("input", () => {
    clearBtn.classList.toggle("visible", input.value.length > 0);
    syncUrl(input.value);
    clearTimeout(debounce);
    debounce = setTimeout(() => render(input.value), 350);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      clearTimeout(debounce);
      syncUrl(input.value);
      render(input.value);
    }
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.classList.remove("visible");
    syncUrl("");
    render("");
    input.focus();
  });
})();
