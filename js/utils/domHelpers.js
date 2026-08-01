export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

export function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  const { className, text, attrs, children } = options;

  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;

  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) el.setAttribute(key, value);
    });
  }

  if (children) {
    children.forEach((child) => {
      el.append(child instanceof Node ? child : document.createTextNode(child));
    });
  }

  return el;
}

export function clearElement(container) {
  container.replaceChildren();
}

export function renderEmptyState(container, { title, message }) {
  clearElement(container);
  const panel = createElement("div", { className: "state-panel" });
  panel.append(
    createElement("h2", { text: title }),
    createElement("p", { text: message })
  );
  container.append(panel);
}

export function renderErrorState(container, { title, message }) {
  clearElement(container);
  const panel = createElement("div", { className: "state-panel state-panel--error" });
  panel.append(
    createElement("h2", { text: title }),
    createElement("p", { text: message })
  );
  container.append(panel);
}