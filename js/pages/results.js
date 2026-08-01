import { qs, renderErrorState } from "../utils/domHelpers.js";
import { renderSearchResults } from "../ui/renderSearchResults.js";

const LAST_QUERY_KEY = "bookfinder:lastQuery";
const DEBOUNCE_DELAY = 450;

const searchManager = new SearchManager();

function getQueryFromUrl() {
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

function updateUrl(query) {
  const url = new URL(window.location.href);
  if (query) {
    url.searchParams.set("q", query);
  } else {
    url.searchParams.delete("q");
  }
  window.history.replaceState({}, "", url);
}

async function runSearch(query, { grid, heading }) {
  updateUrl(query);
  sessionStorage.setItem(LAST_QUERY_KEY, query);

  if (heading) {
    heading.textContent = query ? `Results for "${query}"` : "Search results";
  }

  if (!query) {
    renderSearchResults(grid, [], "");
    return;
  }

  showLoading(grid, "Searching books…");

  try {
    const { books } = await searchManager.search(query);
    renderSearchResults(grid, books, query);
  } catch (error) {
    renderErrorState(grid, {
      title: "Something went wrong",
      message: "We couldn't reach Google Books right now. Please try again in a moment.",
    });
    console.error(error);
  }
}

function initResultsPage() {
  const grid = qs("#results-grid");
  const heading = qs("#results-heading");
  const form = qs("#results-search-form");
  const input = qs("#results-search-input");
  if (!grid || !form || !input) return;

  const initialQuery = getQueryFromUrl() || sessionStorage.getItem(LAST_QUERY_KEY) || "";
  input.value = initialQuery;
  runSearch(initialQuery, { grid, heading });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(input.value.trim(), { grid, heading });
  });

  const debouncedSearch = debounce(() => {
    runSearch(input.value.trim(), { grid, heading });
  }, DEBOUNCE_DELAY);

  input.addEventListener("input", debouncedSearch);
}

document.addEventListener("DOMContentLoaded", () => {
  initResultsPage();
  initNavToggle();
});
