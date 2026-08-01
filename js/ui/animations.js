import { clearElement, createElement } from "../utils/domHelpers.js";

export function showLoading(container, label = "Searching books…") {
  clearElement(container);

  const bookIcon = createElement("div", {
    className: "loading-book",
    attrs: { role: "presentation" },
  });
  bookIcon.innerHTML = `
    <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true">
      <path d="M32 14c-5-3-11-4-16-3v34c5-1 11 0 16 3 5-3 11-4 16-3V11c-5-1-11 0-16 3z"
            fill="#1B263B" />
    </svg>`;

  const panel = createElement("div", {
    className: "loading-panel",
    attrs: { role: "status", "aria-live": "polite" },
    children: [bookIcon, createElement("p", { text: label })],
  });

  container.append(panel);
}

export function clearPanel(container) {
  clearElement(container);
}