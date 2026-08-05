/* Helpers mínimos de DOM y azar, compartidos por toda la app. */

/**
 * Crea un elemento.
 * @param {string} tag  'div', 'button.big-btn.display', 'span#id'
 * @param {object} [props]  { text, html, attrs, style, on:{click:fn} }
 * @param {Array<Node|string>} [children]
 */
export function el(tag, props = {}, children = []) {
  const [name, ...classes] = tag.split('.');
  const [tagName, id] = name.split('#');
  const node = document.createElement(tagName || 'div');
  if (id) node.id = id;
  if (classes.length) node.className = classes.join(' ');

  if (props.text != null) node.textContent = props.text;
  if (props.html != null) node.innerHTML = props.html;
  if (props.attrs) for (const [k, v] of Object.entries(props.attrs)) node.setAttribute(k, v);
  if (props.style) Object.assign(node.style, props.style);
  if (props.dataset) Object.assign(node.dataset, props.dataset);
  if (props.on) for (const [evt, fn] of Object.entries(props.on)) node.addEventListener(evt, fn);

  for (const child of children) {
    if (child == null || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

/** Fisher-Yates sobre una copia. */
export function shuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function range(n) {
  return Array.from({ length: n }, (_, i) => i);
}

/** Reinicia una animación CSS que ya se aplicó una vez. */
export function restartAnimation(node, className) {
  node.classList.remove(className);
  void node.offsetWidth;
  node.classList.add(className);
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
