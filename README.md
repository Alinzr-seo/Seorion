# Seorion

> 🚀 A powerful SEO-first routing system for modern React apps, built with TanStack Router, React Helmet Async, and automated sitemap generation.

![npm](https://img.shields.io/npm/v/seorion?color=blue)
![GitHub stars](https://img.shields.io/github/stars/Alinzr-seo/seorion?style=social)
![MIT License](https://img.shields.io/npm/l/seorion)

## 🧠 What is Seorion?

**Seorion** is a modular, SEO-oriented routing framework for React applications. It combines the capabilities of:

-   🧭 [`TanStack Router`](https://tanstack.com/router)
-   ⚛️ [`React Helmet Async`](https://github.com/staylor/react-helmet-async)
-   📊 [`React Query`](https://tanstack.com/query)

It enables:

-   Structured and typed route configuration
-   Automatic SEO meta injection
-   Role and token-based access control
-   Schema.org (JSON-LD) structured data support
-   Automatic `sitemap.xml` and `robots.txt` generation
-   Development panel for route-level SEO scoring

## ✨ Features

-   ✅ Full SEO metadata support (title, description, canonical, OpenGraph, Twitter)
-   🔐 Powerful route guards (token, roles, custom rules, timed access)
-   📄 Sitemap & Robots.txt generation
-   🧩 Schema.org structured data via JSON-LD
-   ⚛️ React Helmet Async integration
-   💡 SEO score panel in development mode
-   📦 Fully typed with TypeScript
-   🌐 Built for React 18 and TanStack Router v1

## 📦 Installation

```bash
npm install seorion
```

> You must also install required peer dependencies:

```bash
npm install react react-dom react-router-dom react-helmet-async
```

## ⚡ Quick Start Example

### `src/router/routes.ts`

```tsx
import { SeorionFiles, type AppRoute } from "seorion";

export const ROUTES: AppRoute[] = [
	{
		path: "/",
		title: "Home",
		element: <div>Welcome to Seorion</div>,
	},
	{
		path: "/about",
		title: "About Us",
		metaDescription: "Learn more about our company.",
		element: <div>About Page</div>,
	},
];

SeorionFiles({
	routes: ROUTES,
	outputDir: "public",
});
```

### `src/App.tsx`

```tsx
import { SeorionRouter } from "seorion";
import { ROUTES } from "./router/routes";

function App() {
	return SeorionRouter(ROUTES);
}

export default App;
```

### `src/main.tsx`

```tsx
import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SeorionProvider } from "seorion";

createRoot(document.getElementById("root")!).render(
	<SeorionProvider>
		<StrictMode>
			<App />
		</StrictMode>
	</SeorionProvider>
);
```

## 🗺️ SEO File Generation

```ts
import { SeorionFiles } from "seorion";
import { ROUTES } from "./router/routes";

await SeorionFiles({
	routes: ROUTES,
	outputDir: "public",
});
```

Creates:

-   `public/sitemap.xml`
-   `public/robots.txt`

## 🔐 Protected Route Example

```tsx
{
  path: "/admin",
  title: "Admin",
  isProtected: true,
  requiredRole: "admin",
  redirectTo: () => "/login",
  element: () => <AdminDashboard />
}
```

Supports:

-   `isProtected`: require auth
-   `requiredRole`: enforce role
-   `redirectTo`: fallback redirect
-   `customGuard`: return boolean
-   `availableFrom` / `availableUntil`: time-based

## 🧪 DevTool

```tsx
import { SeorionPanel } from "seorion";

<SeorionPanel />;
```

Provides:

-   SEO score (Yoast-style)
-   Focus keyword detection
-   Metadata validation

## 📘 API Reference

| Name              | Description                     |
| ----------------- | ------------------------------- |
| `SeorionProvider` | Context provider                |
| `SeorionRouter`   | Renders a full route system     |
| `SeorionFiles`    | Generates SEO files from routes |
| `SeorionPanel`    | Dev panel for SEO insights      |
| `AppRoute`        | Type-safe route definition      |

## 📁 Folder Structure

```bash
src/
├── components/       # Route + Helmet + Layout
├── devtool/          # Dev SEO analyzer
├── function/         # SEO logic handlers
├── interface/        # All types/interfaces
├── provider/         # Provider component
├── utils/            # Query client and helpers
└── index.ts          # Entry point
```

## 👨‍💻 Author

Made with ❤️ by [Alinzr](https://github.com/Alinzr-seo)

Open to issues, contributions, or feedback.

## 📄 License

MIT © [Alinzr](https://github.com/Alinzr-seo/Seorion)
