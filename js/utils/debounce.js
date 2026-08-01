export function debounce(fn, delay = 400) {
  let timerId;

  return function debounced(...args) {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
