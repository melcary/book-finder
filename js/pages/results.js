import { qs, renderErrorState } from "../utils/domHelpers.js";
import { debounce } from "../utils/debounce.js";
import { initNavToggle } from "../utils/navToggle.js";
import { showLoading } from "../ui/animations.js";
import { renderSearchResults } from "../ui/renderSearchResults.js";
import { SearchManager } from "../services/SearchManager.js";

const LAST_QUERY_KEY = "bookfinder:lastQuery";
const DEBOUNCE_DELAY = 450;

const searchManager = new SearchManager();
let lastBooks = [];
let lastQuery = "";

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
function populateCategoryOptions(categorySelect, books) {
  const previousValue = categorySelect.value;
  const categories = [...new Set(books.flatMap((book) => book.categories))].sort((a, b) =>
    a.localeCompare(b)
  );

  categorySelect.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All categories";
  categorySelect.append(allOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  });
  if (categories.includes(previousValue)) {
    categorySelect.value = previousValue;
  }
}
function sortBooks(books, sortBy) {
  const sorted = [...books];
  switch (sortBy) {
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "rating-desc":
      return sorted.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
    default:
      return sorted; 
  }
}
function applyControlsAndRender(elements) {
  const { grid, categorySelect, sortSelect } = elements;
  const filtered = filterBooks(lastBooks, categorySelect.value);
  const sorted = sortBooks(filtered, sortSelect.value);
  renderSearchResults(grid, sorted, lastQuery);
}

async function runSearch(query, elements) {
  const { grid, heading, categorySelect } = elements;

  updateUrl(query);
  sessionStorage.setItem(LAST_QUERY_KEY, query);
  lastQuery = query;

  if (heading) {
    heading.textContent = query ? `Results for "${query}"` : "Search results";
  }

  if (!query) {
    lastBooks = [];
    renderSearchResults(grid, [], "");
    populateCategoryOptions(categorySelect, []);
    return;
  }

  showLoading(grid, "Searching books…");

 try {
    const { books } = await searchManager.search(query);
    lastBooks = books;
    populateCategoryOptions(categorySelect, books);
    applyControlsAndRender(elements);
  } catch (error) {
    lastBooks = [];
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
  const sortSelect = qs("#sort-select");
  const categorySelect = qs("#category-select");
  if (!grid || !form || !input || !sortSelect || !categorySelect) return;

  const elements = { grid, heading, form, input, sortSelect, categorySelect };

  const initialQuery = getQueryFromUrl() || sessionStorage.getItem(LAST_QUERY_KEY) || "";
  input.value = initialQuery;
  runSearch(initialQuery, elements);

   form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(input.value.trim(), elements);
  });

 const debouncedSearch = debounce(() => {
    runSearch(input.value.trim(), elements);
  }, DEBOUNCE_DELAY);
  input.addEventListener("input", debouncedSearch);

  sortSelect.addEventListener("change", () => applyControlsAndRender(elements));
  categorySelect.addEventListener("change", () => applyControlsAndRender(elements));
}

document.addEventListener("DOMContentLoaded", () => {
  initResultsPage();
  initNavToggle();
});
