import { createElement, clearElement } from "../utils/domHelpers.js";

export function renderAuthorDetail(container, author) {
  if (!container) return;
  clearElement(container);

  if (!author) {
    container.append(
      createElement("p", {
        className: "author-panel__unavailable",
        text: "Author details aren't available for this book yet.",
      })
    );
    return;
    }
    const photo = author.photoUrl
        ? createElement("img", {
            className: "author-panel__photo",
            attrs: { src: author.photoUrl, alt: `Photo of ${author.name}`, loading: "lazy" },
          })
        : null;
     if (photo) {
        photo.addEventListener("error", () => photo.remove());
      }
    
      const heading = createElement("h2", { className: "author-panel__name", text: `About ${author.name}` });
      const header = createElement("div", {
        className: "author-panel__header",
        children: [photo, heading].filter(Boolean),
      });
     container.append(header);
    
      if (author.lifespan) {
        container.append(createElement("p", { className: "author-panel__dates", text: author.lifespan }));
      }
    
      container.append(
        createElement("p", {
          className: "author-panel__bio",
          text: author.bio || "No biography available yet.",
        })
      );
    }