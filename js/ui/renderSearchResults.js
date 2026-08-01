import { clearElement, createElement, renderEmptyState } from "../utils/domHelpers.js";

export function renderSearchResults(container, books, query = "") {
  clearElement(container);

  if (!books.length) {
    renderEmptyState(container, {
      title: query ? "No books matched that search" : "Search for a book to get started",
      message: query
        ? `We couldn't find anything for "${query}". Try a different title, author, or ISBN.`
        : "Use the search bar above to look up a title, author, or ISBN.",
    });
    return;
  }

  const cards = books.map((book) => buildCard(book));
  container.append(...cards);
}

function buildCard(book) {
  const coverWrap = book.coverUrl
    ? createElement("div", {
        className: "book-card__cover-wrap",
        children: [
          createElement("img", {
            attrs: { src: book.coverUrl, alt: `Cover of ${book.title}`, loading: "lazy" },
          }),
        ],
      })
    : createElement("div", {
        className: "book-card__cover-wrap book-card__cover-wrap--placeholder",
        text: "No cover available",
      });

  const body = createElement("div", {
    className: "book-card__body",
    children: [
      createElement("h3", { className: "book-card__title", text: book.title }),
      createElement("p", { className: "book-card__author", text: book.authorLabel }),
    ],
  });

  if (book.averageRating) {
    body.append(
      createElement("span", {
        className: "book-card__rating",
        text: `★ ${book.averageRating.toFixed(1)}`,
      })
    );
  }

  return createElement("a", {
    className: "book-card",
    attrs: { href: `detail.html?id=${encodeURIComponent(book.id)}` },
    children: [coverWrap, body],
  });
}