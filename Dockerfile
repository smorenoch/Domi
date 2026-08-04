# ---------------------------------------------------------------
# Build en dos etapas: Node compila, nginx sirve.
# La imagen final no lleva Node ni node_modules — son ~50 MB de nginx
# más los ~60 KB del build. La app es estática: no hay servidor propio,
# no hay backend, no hay proceso que mantener vivo.
# ---------------------------------------------------------------

# ---------- etapa 1: build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Playwright es devDependency y sólo se usa para el smoke test local.
# Sin esto, su postinstall se baja ~150 MB de navegadores que en el
# despliegue no se usan nunca.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Las dependencias se copian primero para que Docker reutilice la capa
# mientras el package-lock no cambie.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- etapa 2: servir ----------
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
