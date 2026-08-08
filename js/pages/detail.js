import { qs, renderEmptyState, renderErrorState } from "../utils/domHelpers.js";
import { initNavToggle } from "../utils/navToggle.js";
import { showLoading } from "../ui/animations.js";
import { getVolumeById } from "../api/googleBooksService.js";
import { findBestMatch, getWorkById, getAuthorByKey } from "../api/openLibraryService.js";
import { Book } from "../models/Book.js";
import { Author } from "../models/Author.js";
import { renderBookDetail } from "../ui/renderBookDetail.js";
import { renderAuthorDetail } from "../ui/renderAuthorDetail.js";
import { FavoritesManager } from "../services/FavoritesManager.js";


const favoritesManager = new FavoritesManager();

async function enrichFromOpenLibrary(book) {
  try {
    const match = await findBestMatch(book.title, book.authorLabel);
    if (!match) return null;

    const work = match.key ? await getWorkById(match.key).catch(() => null) : null;
    book.enrichWithOpenLibrary(match, work);

    const authorKey = match.author_key?.[0];
    if (!authorKey) return null;

    const rawAuthor = await getAuthorByKey(authorKey).catch(() => null);
    return rawAuthor ? Author.fromOpenLibrary(rawAuthor) : null;
  } catch (error) {
    console.error("Open Library enrichment failed:", error);
    return null;
  }
}
async function loadBook(bookId, content) {
  showLoading(content, "Loading book details…");

  let book;
  try {
    const volume = await getVolumeById(bookId);
    book = Book.fromGoogleBooks(volume);
  } catch (error) {
    renderErrorState(content, {
      title: "We couldn't load this book",
      message: "Something went wrong reaching Google Books. Please try again in a moment.",
    });
    console.error(error);
    return;
  }

  const authorPanel = renderBookDetail(content, book, {
    isFavorite: favoritesManager.isFavorite(book.id),
    onToggleFavorite: (button) => {
      const nowFavorite = favoritesManager.toggle(book);
      button.classList.toggle("is-favorite", nowFavorite);
      button.setAttribute("aria-pressed", String(nowFavorite));
      button.textContent = nowFavorite ? "♥ Remove from Favorites" : "♡ Add to Favorites";
    },
  });
  const author = await enrichFromOpenLibrary(book);
    renderAuthorDetail(authorPanel, author);
  }

function initDetailPage() {
  const content = qs("#detail-content");
   const meta = qs("#detail-meta");
   if (!content) return;
 
   const bookId = new URLSearchParams(window.location.search).get("id");
 
   if (!bookId) {
     if (meta) meta.textContent = "Select a book from the search results to see its full detail view.";
     renderEmptyState(content, {
       title: "No book selected yet",
       message: "Go to Results and click on a book cover or title to open its detail page here.",
     });
     return;
   }
 
   if (meta) meta.textContent = "";
   loadBook(bookId, content);
 }

document.addEventListener("DOMContentLoaded", () => {
  initDetailPage();
  initNavToggle();
});