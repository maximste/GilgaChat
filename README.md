<h1 align="center">GilgaChat</h1>

Modern messenger UI built with TypeScript, Handlebars, and Vite.  
This repository contains the front‑end for GilgaChat, starting with an authentication screen and a small reusable component library that can be extended into a full messenger interface.

---

## Overview

GilgaChat is an educational/front‑end project that demonstrates how to build a small component system without a heavy framework.  
Instead of React/Vue, it uses:

- **TypeScript** for type safety.
- **Handlebars** for templating and partials.
- **Vite** as the build and dev server.
- **SCSS** for styling.

The current version focuses on the **auth page** (login form) and a set of UI primitives (button, input, label, link, form field) that can be reused across other screens.

## Features

- **Authentication layout**
  - Centered auth window with title and subtitle.
  - Email/password form and submit button.
  - “Forgot password?” link.

- **Reusable UI components**
  - `Button` – semantic `<button>` with configurable text, type, and classes.
  - `Input` – typed text/email/password inputs with validation flags.
  - `Label` – accessible labels bound to inputs via `for`/`id`.
  - `Link` – styled navigation links.
  - `FormField` – composition component that renders a label + input pair.

- **Component templates**
  - Each component has:
    - a TypeScript class (`src/components/*/*.ts`),
    - a Handlebars template (`.hbs`),
    - and a SCSS file for styles.

- **Fast local development**
  - Vite dev server with hot reload.
  - TypeScript compilation and bundling.

- **Ready for CI and deployment**
  - GitHub Actions workflow for sprint tests.
  - Netlify configuration publishing `dist/`.

## Tech Stack

- **Language:** TypeScript
- **Bundler/Dev server:** Vite
- **Templating:** Handlebars
- **Styles:** SCSS
- **Env management:** dotenv (for future configuration)
- **CI:** GitHub Actions (`.github/workflows/tests.yml`)
- **Deployment:** Netlify (`https://gilgachat.netlify.app/`, `dist/` as publish directory)

## Design & Prototypes

- Main design and interactive prototypes are in Figma: [GilgaChat UI](https://www.figma.com/design/sbXZfnJcFjbmh9L6nxRv7W/GilgaChat?node-id=13-9452&t=vIzquu2G5jxpVV9o-1)

## Getting Started

### Prerequisites

- **Node.js**: 22.x (recommended, matches CI configuration)
- **npm**: comes with Node.js

### Installation

```bash
git clone https://github.com/maximste/GilgaChat.git
cd GilgaChat
npm install
```

### Available Scripts

Run a local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Build and then preview in one command:

```bash
npm run start
```

## Project Structure

```text
.
├── index.html               # Root HTML shell used by Vite
├── src
│   ├── main.ts              # App entry, mounts AuthForm into #app
│   ├── style.scss           # Global styles
│   ├── components
│   │   ├── AuthForm/        # Auth page layout and form
│   │   ├── Button/          # Button component (TS + HBS + SCSS)
│   │   ├── Input/           # Input component (TS + HBS + SCSS)
│   │   ├── Label/           # Label component (TS + HBS + SCSS)
│   │   ├── Link/            # Link component (TS + HBS + SCSS)
│   │   └── FormField/       # Composite label+input field
│   ├── layout
│   │   └── main/            # Main layout templates/styles (WIP)
│   ├── types/               # Shared TypeScript types for components
│   └── utils/mydash/        # Utility helpers (e.g., first/last)
├── vite.config.ts           # Vite configuration
├── netlify.toml             # Netlify deploy configuration
└── .github/workflows/       # CI pipeline for tests
```

## How It Works

- `src/main.ts` listens for `DOMContentLoaded`, finds the `#app` container, and renders an `AuthForm` instance into it.
- `AuthForm`:
  - instantiates `Label`, `Input`, `Button`, `Link`, and `FormField` components,
  - registers Handlebars partials for all component templates,
  - compiles `AuthForm.hbs` and injects the resulting HTML into the container.
- `FormField` receives `label` and `input` props, and its Handlebars template includes the `Label` and `Input` partials inside a single wrapper `<div>`.

This architecture keeps UI logic in TypeScript classes, while markup remains in declarative Handlebars templates.

## Development & Conventions

- The project originated as a sprint‑based educational assignment, so you may see references to branches like `sprint_1`, `sprint_2`, etc.
- The existing GitHub Actions workflow runs automated tests for these sprint branches when pull requests target `main`.
- For personal or open‑source development, you can keep this workflow or adjust it to your own branching strategy.

## Deployment

The repository includes Netlify configuration:

- Build the project locally:

  ```bash
  npm run build
  ```

- The production assets will be generated in the `dist/` directory.
- On Netlify, set the **publish directory** to `dist` (matching `netlify.toml`).

You can also host the contents of `dist/` on any static hosting service (GitHub Pages, Vercel static export, nginx, etc.).

## Roadmap / Ideas

- Implement registration and password‑recovery screens.
- Build the main messenger interface (chat list, conversation view, message input).
- Add form validation and error states.
- Integrate with a real back‑end API for authentication and chat data.

## License

This project is currently provided for educational purposes and does not yet include an explicit open‑source license.  
If you plan to use it in production or as a base for an open‑source project, please add a license file (for example, MIT) that matches your needs.