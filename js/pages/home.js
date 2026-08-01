import { qs } from "../utils/domHelpers.js";
import { initNavToggle } from "../utils/navToggle.js";

const LAST_QUERY_KEY = "bookfinder:lastQuery";

function initHomeSearch() {
  const form = qs("#home-search-form");
  const input = qs("#home-search-input");
  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) {
      input.focus();
      return;
    }

    sessionStorage.setItem(LAST_QUERY_KEY, query);
    window.location.href = `results.html?q=${encodeURIComponent(query)}`;
  });

  // Pre-fill with the last search, so returning to Home doesn't feel empty.
  const lastQuery = sessionStorage.getItem(LAST_QUERY_KEY);
  if (lastQuery) input.value = lastQuery;
}

document.addEventListener("DOMContentLoaded", () => {
  initHomeSearch();
  initNavToggle();
});