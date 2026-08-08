import { createElement, clearElement } from "../utils/domHelpers.js";

export function renderBookDetail(container, book, { isFavorite = false, onToggleFavorite } = {}) {
  clearElement(container);

  const coverWrap = createElement("div", {
    className: "detail-panel__cover",
    children: [buildCoverElement(book)],
  });
    const favoriteButton = buildFavoriteButton(book, isFavorite, onToggleFavorite);
    
      const infoChildren = [
        createElement("h1", { text: book.title }),
        createElement("p", { className: "book-card__author", text: book.authorLabel }),
      ];
    
      if (book.averageRating) {
        infoChildren.push(
          createElement("p", {
            className: "book-card__rating",
            text: `★ ${book.averageRating.toFixed(1)} average rating`,
          })
        );
    }
     const metaLine = buildMetaLine(book);
      if (metaLine) infoChildren.push(metaLine);
    
      const tagList = buildTagList(book);
      if (tagList) infoChildren.push(tagList);
    
      infoChildren.push(favoriteButton);
    
      infoChildren.push(
        createElement("p", {
          className: "detail-panel__description",
          text: book.description ? stripHtml(book.description) : "No description available for this book.",
        })
      );
      if (book.previewLink) {
        infoChildren.push(
          createElement("a", {
            className: "btn btn--secondary",
            attrs: { href: book.previewLink, target: "_blank", rel: "noopener noreferrer" },
            text: "Preview on Google Books",
          })
        );
    }
     const authorPanel = createElement("div", {
        className: "author-panel",
        attrs: { id: "author-panel", "aria-live": "polite" },
      });
      infoChildren.push(authorPanel);
    
      const info = createElement("div", { className: "detail-panel__info", children: infoChildren });
      const panel = createElement("div", { className: "detail-panel", children: [coverWrap, info] });
    
      container.append(panel);
    
      return authorPanel;
}
    function buildCoverElement(book) {
      if (!book.coverUrl) {
        return createElement("div", {
          className: "detail-panel__cover-placeholder",
          text: "No cover available",
        });
      }
      return createElement("img", {
        attrs: { src: book.coverUrl, alt: `Cover of ${book.title}` },
      });
    }
    function buildFavoriteButton(book, isFavorite, onToggleFavorite) {
      const button = createElement("button", {
        className: `btn btn--favorite${isFavorite ? " is-favorite" : ""}`,
        attrs: { type: "button", "aria-pressed": String(isFavorite) },
        text: isFavorite ? "♥ Remove from Favorites" : "♡ Add to Favorites",
      });
    
      if (onToggleFavorite) {
        button.addEventListener("click", () => onToggleFavorite(button));
      }
    
      return button;
}
    function buildMetaLine(book) {
      const bits = [];
      if (book.publishedDate) bits.push(`Published ${book.publishedDate}`);
      if (book.pageCount) bits.push(`${book.pageCount} pages`);
      if (!bits.length) return null;
      return createElement("p", { className: "detail-panel__meta-line", text: bits.join(" · ") });
    }
    
    function buildTagList(book) {
      const tags = book.displayTags;
      if (!tags.length) return null;
      return createElement("div", {
        className: "tag-list",
        children: tags.map((tag) => createElement("span", { className: "tag", text: tag })),
      });
}
    function stripHtml(html) {
    const scratch = document.createElement("div");
    scratch.innerHTML = html;
    return scratch.textContent || scratch.innerText || "";
}