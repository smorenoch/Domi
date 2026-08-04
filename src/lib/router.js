/* ---------------------------------------------------------------
   Router mínimo por hash. Suficiente para 3 rutas y sin dependencias.
   Cada página devuelve { node, destroy? } — destroy se llama al salir,
   para que las lecciones puedan limpiar timers y audio pendiente.
   --------------------------------------------------------------- */

const routes = [];
let mount = null;
let current = null;

export function route(pattern, handler) {
  const names = [];
  const regex = new RegExp('^' + pattern.replace(/:([\w]+)/g, (_, name) => {
    names.push(name);
    return '([^/]+)';
  }) + '$');
  routes.push({ regex, names, handler });
}

export function go(path) {
  const target = '#' + path;
  if (window.location.hash === target) render();
  else window.location.hash = target;
}

function resolve(path) {
  for (const r of routes) {
    const match = path.match(r.regex);
    if (match) {
      const params = {};
      r.names.forEach((name, i) => { params[name] = decodeURIComponent(match[i + 1]); });
      return { handler: r.handler, params };
    }
  }
  return null;
}

function render() {
  const path = window.location.hash.slice(1) || '/';
  const found = resolve(path) || resolve('/');
  if (!found || !mount) return;

  if (current && typeof current.destroy === 'function') current.destroy();
  mount.replaceChildren();

  current = found.handler(found.params) || null;
  if (current && current.node) mount.appendChild(current.node);
}

export function start(mountNode) {
  mount = mountNode;
  window.addEventListener('hashchange', render);
  render();
}
