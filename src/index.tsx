// ------------------------------
// 🔹 Public Types
// ------------------------------

/**
 * `AppRoute` defines the shape of a route used by Seorion system.
 */
export { type AppRoute } from "./interface/types";

// ------------------------------
// 🔹 Core Utilities
// ------------------------------

/**
 * Global React Query instance configured with caching and retry logic.
 */
export { queryClient } from "./utils/QueryClient";

/**
 * Generates `sitemap.xml` and `robots.txt` files based on route configs.
 */
export { SeorionFiles } from "./function/functions";

// ------------------------------
// 🔹 Core Components & Context
// ------------------------------

/**
 * SEO and access context provider.
 * Should wrap your app's root component.
 */
export { SeorionProvider } from "./provider/SeorionProvider";

/**
 * Route-level access guard.
 * Supports token, role, rule-based and time-based protection.
 */
export { RouteGuard } from "./components/SeorionRouteGuard";

/**
 * Smart router system that:
 * - renders protected route
 * - injects SEO metadata
 * - handles layout + suspense
 * - displays dev panel
 */
export { SeorionRouter } from "./components/SeorionRouterSystem";

// ------------------------------
// 🔹 Dev Tools
// ------------------------------

/**
 * Devtool panel that displays SEO score & checklist.
 * Only for development/debugging purposes.
 */
export { default as SeorionPanel } from "./devtool/SeorionPanel";
