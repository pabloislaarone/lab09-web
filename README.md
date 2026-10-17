# Laboratorio 09: Introducción a Next.js

## Requisitos

- Node.js 18.18 o superior
- Una apikey de OMDb (gratis en https://www.omdbapi.com/apikey.aspx)

## Cómo iniciarlo

```bash
git clone https://github.com/pabloislaarone/lab09-web.git
cd lab09-web
npm install
```

Crea el archivo `.env.local` a partir del ejemplo:

```bash
# Windows
copy .env.example .env.local
# macOS / Linux
cp .env.example .env.local
```

Coloca tu apikey en `.env.local`:

```
NEXT_PUBLIC_OMDB_API_KEY=tu_apikey
```

Inicia el servidor y abre http://localhost:3000:

```bash
npm run dev
```

Si cambias el `.env.local`, reinicia el servidor.

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Tarea: Cartelera de películas y series |
| `/pokemon-csr` | Ejercicio 1.1 (CSR) |
| `/pokemon-ssr` | Ejercicio 1.1 (SSR) |
| `/weather` | Ejercicio 2.1 (SSR + CSR) |

## Estructura

```
app/
├── (cine)/                     Tarea: Cartelera (página principal)
│   ├── page.tsx                Página y secciones del servidor (SSR)
│   ├── _lib/
│   │   ├── omdb.ts             URL, apikey y tipos de OMDb
│   │   ├── cartelera.ts        Películas y series que se piden en el servidor
│   │   ├── trailers.ts         Tráileres de YouTube
│   │   └── favoritos.ts        Favoritos guardados en el navegador
│   └── _components/
│       ├── Header.tsx          Menú de secciones
│       ├── Hero.tsx            Portada con títulos destacados
│       ├── Fila.tsx            Filas horizontales de pósters
│       ├── SearchMovies.tsx    Búsqueda en tiempo real (CSR)
│       ├── MovieModal.tsx      Ficha completa
│       ├── TrailerModal.tsx    Reproductor de tráileres
│       ├── Favoritos.tsx       Sección de favoritos
│       └── ...                 Tarjetas y botones
├── pokemon-csr/                Ejercicio 1.1
├── pokemon-ssr/                Ejercicio 1.1
├── weather/                    Ejercicio 2.1
├── layout.tsx
└── globals.css
```
