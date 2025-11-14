# Contribution Report UI

This project is a React + TypeScript single-page application for exploring contribution
reports by squad and developer. It consumes the REST endpoints documented in
`api-docs.yaml` (served by the backend service) and visualises story points, bugs, and
commits over a configurable period.

## Getting started

```bash
npm install
npm run dev
```

The development server expects the backend API to be reachable under the same host
(using the `/api` prefix). You can configure a proxy in `vite.config.ts` if the API is
served from a different origin.

## Available scripts

- `npm run dev` – start the Vite development server.
- `npm run build` – type-check and produce a production build.
- `npm run preview` – preview the production build locally.
- `npm run test` – run unit tests (uses Vitest).

## Tech stack

- React 18
- Redux Toolkit with React Redux
- TypeScript
- Tailwind CSS
- Recharts for data visualisations
- Vite for tooling and bundling
