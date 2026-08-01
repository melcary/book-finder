import { qs, qsa } from "./domHelpers.js";

export function initNavToggle() {
  const toggleButton = qs(".hamburger");
  const nav = qs("#primary-navigation");
  if (!toggleButton || !nav) return;

  function closeMenu() {
    toggleButton.classList.remove("show");
    nav.classList.remove("show");
    toggleButton.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    toggleButton.classList.add("show");
    nav.classList.add("show");
    toggleButton.setAttribute("aria-expanded", "true");
  }

  toggleButton.addEventListener("click", () => {
    const isOpen = nav.classList.contains("show");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
 qsa("a", nav).forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}