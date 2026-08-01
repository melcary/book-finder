import { qs } from "../utils/domHelpers.js";
import { initNavToggle } from "../utils/navToggle.js";

function initDetailPage() {
  const meta = qs("#detail-meta");
  if (!meta) return;

  const bookId = new URLSearchParams(window.location.search).get("id");
  if (bookId) {
    meta.textContent = `Requested book id: ${bookId}. Full detail view arrives in Week 6.`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initDetailPage();
  initNavToggle();
});