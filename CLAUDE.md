# ICE Members - CLAUDE.md

## Proyecto

Sistema de gestión de miembros para "Iglesia de Cristo Centro" (IDC). Dashboard que administra miembros, grupos, grupos pequeños, encargados y consejería.

## Tech Stack

- **Framework:** Vue 3.2 + Vue Router 4.2 (hash history)
- **State:** Pinia 2.1 con `pinia-plugin-persistedstate` (localStorage)
- **UI:** Vuetify 3.6 (tema custom "Claude": primary #D97706)
- **HTTP:** Axios 1.6
- **Fechas:** Luxon 3.4 + @date-io/luxon
- **Build:** Vue CLI 5.0 (webpack)
- **Deploy:** GitHub Pages (`gh-pages`), Render.com (`render.yaml`)
- **Estilos:** Sass

## Comandos

```bash
npm run serve     # Dev server con hot reload
npm run build     # Build de producción
npm run lint      # ESLint con auto-fix
npm run deploy    # Deploy a GitHub Pages (ejecuta build primero)
```

## Estructura del proyecto

```
src/
├── main.js               # Inicialización (Vue, Pinia, Vuetify, Router)
├── App.vue               # Componente raíz
├── MainView.vue          # Layout principal (sidebar + contenido)
├── routes.js             # Configuración de rutas con guards de auth
├── components/
│   ├── Home.vue
│   ├── Login.vue
│   ├── members/           # CRUD de miembros
│   ├── groups/            # CRUD de grupos
│   ├── small-groups/      # Grupos pequeños
│   ├── managers/          # Gestión de encargados
│   └── counseling/        # Historial de consejería
├── services/              # Capa API (Axios)
│   ├── login.js           # Auth: login, logout, token, updatePassword
│   ├── members.js         # GET/POST/PUT /users
│   ├── groups.js          # GET/POST/PUT/DELETE /groups
│   ├── smallGroups.js     # GET/POST/PUT /small-groups
│   ├── managers.js        # GET/PUT /auth/managers
│   └── counseling.js      # GET/POST /history
├── store/                 # Pinia stores
│   ├── member.js          # Miembros + usuario autenticado
│   ├── group.js           # Grupos
│   └── smallGroup.js      # Grupos pequeños
└── utils/
    └── constants.js       # Constantes de tipos de usuario
```

## Arquitectura

### Organización

Componentes organizados por feature/dominio, no por tipo.

### API

- Base URL configurada en `.env` como `VUE_APP_MEMBERS_URL`
- Autenticación: Bearer token en header Authorization (guardado en localStorage como `access_token`)
- Endpoints principales: `/auth/*`, `/users`, `/groups`, `/small-groups`, `/history`

### Flujo de autenticación

1. Login → POST `/auth/login` → token en localStorage
2. Usuario en Pinia store (persistido con plugin)
3. Route guard global verifica `meta.requiresAuth`
4. Redirección a `/` si no autenticado

### Roles

El member store expone getters de rol: `isManager`, `isCounselor`, `isLider`.

### Alias de paths

`@/*` apunta a `src/*` (configurado en jsconfig.json).

## Convenciones

- Componentes Vue usan Options API y Composition API mezclados
- Servicios retornan datos directos (no wrappers)
- Nombres de archivos: camelCase para JS, PascalCase para Vue components
- Rutas: kebab-case (`/small-groups`)
- Git branch principal para PRs: `develop`
