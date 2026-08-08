import { qs } from "../utils/domHelpers.js";
import { initNavToggle } from "../utils/navToggle.js";
import { searchBooks } from "../api/googleBooksService.js";

const LAST_QUERY_KEY = "bookfinder:lastQuery";
const SURPRISE_TOPICS = [
  "science fiction",
  "fantasy adventure",
  "mystery thriller",
  "biography",
  "world history",
  "poetry collection",
  "philosophy",
  "travel memoir",
  "cooking",
  "graphic novel",
];
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
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

  
  const lastQuery = sessionStorage.getItem(LAST_QUERY_KEY);
  if (lastQuery) input.value = lastQuery;
}
function initSurpriseMe() {
  const button = qs("#surprise-btn");
  if (!button) return;

  const defaultLabel = button.textContent;

  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Finding a surprise…";

    try {
      const topic = pickRandom(SURPRISE_TOPICS);
      const volumes = await searchBooks(topic, { maxResults: 40 });
      const candidates = volumes.filter((volume) => volume.id && volume.volumeInfo?.title);

      if (!candidates.length) throw new Error("No surprise candidates found");

      const pick = pickRandom(candidates);
      window.location.href = `detail.html?id=${encodeURIComponent(pick.id)}`;
    } catch (error) {
      console.error(error);
      button.disabled = false;
      button.textContent = defaultLabel;
      alert("Couldn't find a surprise right now -- please try again.");
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  initHomeSearch();
  initSurpriseMe();
  initNavToggle();
});