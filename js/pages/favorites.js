import { qs, createElement, clearElement, renderEmptyState } from "../utils/domHelpers.js";
import { initNavToggle } from "../utils/navToggle.js";
import { FavoritesManager } from "../services/FavoritesManager.js";

const favoritesManager = new FavoritesManager();

function buildFavoriteCard(favorite, onRemove) {
  const coverWrap = favorite.coverUrl
    ? createElement("div", {
        className: "book-card__cover-wrap",
        children: [createElement("img", { attrs: { src: favorite.coverUrl, alt: `Cover of ${favorite.title}` } })],
      })
    : createElement("div", {
        className: "book-card__cover-wrap book-card__cover-wrap--placeholder",
        text: "No cover available",
      });

  const body = createElement("div", {
    className: "book-card__body",
    children: [
      createElement("h3", { className: "book-card__title", text: favorite.title }),
      createElement("p", { className: "book-card__author", text: favorite.author }),
    ],
  });

  const link = createElement("a", {
    className: "book-card",
    attrs: { href: `detail.html?id=${encodeURIComponent(favorite.id)}` },
    children: [coverWrap, body],
  });

  const removeButton = createElement("button", {
    className: "favorite-toggle is-favorite",
    attrs: { type: "button", "aria-label": `Remove ${favorite.title} from favorites` },
    text: "♥",
  });

  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onRemove(favorite.id, link);
  });

  link.append(removeButton);
  return link;
}

function renderFavorites(grid) {
  clearElement(grid);
  const favorites = favoritesManager.getAll();

  if (!favorites.length) {
    renderEmptyState(grid, {
      title: "No favorites yet",
      message: "Tap the heart on any book in Results or its Detail page to save it here.",
    });
    return;
  }

  const cards = favorites.map((favorite) =>
    buildFavoriteCard(favorite, (bookId, cardEl) => {
      favoritesManager.remove(bookId);
      cardEl.classList.add("book-card--removing");
      cardEl.addEventListener(
        "animationend",
        () => {

          renderFavorites(grid);
        },
        { once: true }
      );
    })
  );

  grid.append(...cards);
}

function initFavoritesPage() {
  const grid = qs("#favorites-grid");
  if (!grid) return;
  renderFavorites(grid);
}

document.addEventListener("DOMContentLoaded", () => {
  initFavoritesPage();
  initNavToggle();
});
