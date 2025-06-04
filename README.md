# Seorion

> 🚀 A powerful SEO-first routing system for modern React apps, built with TanStack Router, React Helmet Async, and automated sitemap generation.

![npm](https://img.shields.io/npm/v/seorion?color=blue)
![GitHub stars](https://img.shields.io/github/stars/Alinzr-seo/seorion?style=social)
![MIT License](https://img.shields.io/npm/l/seorion)


## 🧠 What is Seorion?

**Seorion** is a modular, SEO-oriented routing framework for React applications. It combines the capabilities of:

- 🧭 [`TanStack Router`](https://tanstack.com/router)
- ⚛️ [`React Helmet Async`](https://github.com/staylor/react-helmet-async)
- 📊 [`React Query`](https://tanstack.com/query)

It enables:

- Structured and typed route configuration
- Automatic SEO meta injection
- Role and token-based access control
- Schema.org (JSON-LD) structured data support
- Automatic `sitemap.xml` and `robots.txt` generation
- Development panel for route-level SEO scoring

## ✨ Features

- ✅ Full SEO metadata support (title, description, canonical, OpenGraph, Twitter)
- 🔐 Powerful route guards (token, roles, custom rules, timed access)
- 📄 Sitemap & Robots.txt generation
- 🧩 Schema.org structured data via JSON-LD
- ⚛️ React Helmet Async integration
- 💡 SEO score panel in development mode
- 📦 Fully typed with TypeScript
- 🌐 Built for React 18 and TanStack Router v1


## 📦 Installation

```bash
npm install seorion
````

> You must also install required peer dependencies:

```bash
npm install react react-dom react-router-dom react-helmet-async
```

## 🛠️ Quick Start

### 1. Define Your Routes

```tsx
import type { AppRoute } from "seorion";

export const routes: AppRoute[] = [
  {
    path: "/about",
    title: "About Us",
    metaDescription: "Learn more about our company.",
    keywords: ["about", "company", "info"],
    schema: "WebPage",
    schemaData: {
      name: "About Us",
      description: "Learn more about our company."
    },
    isProtected: false,
    sitemap: {
      include: true,
      changeFreq: "monthly",
      priority: 0.8
    },
    element: () => <AboutPage />
  }
];
```

### 2. Wrap Your App with `SeorionProvider`

```tsx
import { SeorionProvider } from "seorion";

const App = () => (
  <SeorionProvider>
    {/* your router or app */}
  </SeorionProvider>
);
```

### 3. Render Routes with `SeorionRouter`

```tsx
import { SeorionRouter } from "seorion";
import { routes } from "./routes";

function AppRoutes() {
  return routes.map(route => (
    <Route
      key={route.path}
      path={route.path}
      element={SeorionRouter(route)}
    />
  ));
}
```

## 🧪 Developer Tool

Seorion includes a built-in SEO analysis panel (`<SeorionPanel />`) that provides:

* ✅ SEO score (based on industry best practices)
* 🔍 Focus keyword checks
* 📋 Metadata coverage
* 🧠 Structured data validation

> This panel renders automatically within `SeorionRouter`.

## 🗺️ Generate `sitemap.xml` & `robots.txt`

Automatically generate SEO files based on your route configuration:

```ts
import { SeorionFiles } from "seorion";
import { routes } from "./routes";

await SeorionFiles({
  routes,
  outputDir: "public"
});
```

Creates:

* `public/sitemap.xml`
* `public/robots.txt`

Fully metadata-aware per route.

## 🔐 Route Protection Example

```tsx
{
  path: "/admin",
  title: "Admin Dashboard",
  isProtected: true,
  requiredRole: "admin",
  redirectTo: () => "/login",
  element: () => <AdminDashboard />
}
```

Supports:

* `isProtected`: require JWT/token
* `requiredRole`: enforce specific roles (e.g., admin)
* `redirectTo`: conditional redirect
* `customGuard`: custom boolean-based logic
* `accessRule`: function with access context (token + role)
* `availableFrom` / `availableUntil`: time-based access control


## 📁 File Structure

```bash
src/
├── components/
│   └── SeorionRouterSystem.tsx
├── devtool/
│   └── SeorionPanel.tsx
├── function/
│   └── functions.ts
├── interface/
│   └── types.ts
├── provider/
│   └── SeorionProvider.tsx
├── utils/
│   └── QueryClient.ts
└── index.ts
```

## 📘 API Overview

| Function / Component | Description                              |
| -------------------- | ---------------------------------------- |
| `SeorionProvider`    | Provides app-wide context for token/role |
| `SeorionRouter`      | Renders route with layout, SEO, guard    |
| `RouteGuard`         | Internal access logic handler            |
| `SeorionPanel`       | Dev panel for SEO scoring                |
| `SeorionFiles`       | Generates sitemap & robots.txt files     |
| `AppRoute`           | Typed route definition                   |

## 🔗 Related Technologies

* [@tanstack/react-router](https://tanstack.com/router/latest)
* [@tanstack/react-query](https://tanstack.com/query/latest)
* [react-helmet-async](https://github.com/staylor/react-helmet-async)

## 👨‍💻 Author

Made with ❤️ by [Alinzr](https://github.com/Alinzr-seo)

Open to issues, contributions, ideas, or feedback.

## 📄 License

MIT © [Alinzr](https://github.com/Alinzr-seo)