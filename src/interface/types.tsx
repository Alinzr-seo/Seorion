import { dynamicFetch } from "../function/functions";
import type { ComponentType, LazyExoticComponent, ReactElement, ReactNode } from "react";

/**
 * Configuration for sitemap entry generation.
 */
export interface AppSitemap {
	/** Whether the route should be included in the sitemap */
	include: boolean;

	/** Recommended change frequency for search engines */
	changeFreq?: "daily" | "weekly" | "monthly" | "yearly";

	/** Priority of the route in the sitemap (0.0 to 1.0) */
	priority?: number;

	/** Indicates if the route supports dynamic paths */
	dynamic?: boolean;

	/** Endpoint to fetch dynamic paths from (used in dynamic sitemaps) */
	endpoint?: string;

	/** Optional model key for filtering or contextual generation */
	modelOpt?: string;

	/** Custom fetch function for dynamic path resolution */
	fetchDynamicPaths?: typeof dynamicFetch;

	/** Additional props for fetching and generating dynamic paths */
	dynamicPathProps?: {
		endpoint: string;
		path: string;
		modelOpt: string;
	};
}

// -----------------------------------------
// SEO Metadata Types
// -----------------------------------------

/**
 * Open Graph metadata used for social media previews
 */
export interface OpenGraphMeta {
	title?: string;
	description?: string;
	image: string;
}

/**
 * Twitter Card metadata used for Twitter previews
 */
export interface TwitterCardMeta {
	title?: string;
	description?: string;
	image: string;
}

/**
 * Custom meta tags for <head> injection
 */
export interface CustomMetaTag {
	name: string;
	content: string;
}

/**
 * Language alternates for hreflang
 */
export interface AltLangLink {
	lang: string;
	href: string;
}

// -----------------------------------------
// Main Route Interface
// -----------------------------------------

/**
 * Describes a route in the application with full SEO and access control support
 */
export interface AppRoute {
	// Route Info
	path: string;
	title: string;
	element: ReactElement | LazyExoticComponent<ComponentType<any>>;

	// SEO Metadata
	metaDescription?: string;
	keywords?: string[];
	tags?: string[];
	canonical?: string;
	openGraph?: OpenGraphMeta;
	twitterCard?: TwitterCardMeta;
	customMeta?: CustomMetaTag[];

	/** Schema type for structured data (used in SSR or static generation) */
	schema?: false | "WebPage" | "Article" | "Product";

	/** Custom schema data for Google Rich Results */
	schemaData?: Record<string, any>;

	/** Hook for injecting additional <Helmet> elements */
	helmetExtend?: () => ReactNode;

	/** Language of the route (used for i18n SEO) */
	lang?: string;

	/** Alternate URLs for multi-language sites */
	altLinks?: AltLangLink[];

	// Layout & UX
	layout?: ReactElement | LazyExoticComponent<ComponentType<any>>;
	transition?: "fade" | "slide" | "zoom" | "none";
	fallback?: ReactNode;
	scrollToTop?: boolean | "once" | "instant" | "smooth";

	// Lifecycle Hooks
	onEnter?: () => void;
	onView?: () => void;

	// Route Protection
	isProtected?: boolean;
	loggedAccessed?: boolean;
	requiredRole?: "admin" | "user";
	customGuard?: () => boolean;

	/**
	 * Dynamic rule-based access check
	 * @param ctx Token and role information for current session
	 */
	accessRule?: (ctx: { token: string | null; role: string | null }) => boolean;

	/**
	 * Route to redirect to when access is denied or unavailable
	 */
	redirectTo?: () => string | null;

	// Availability Constraints
	availableFrom?: Date;
	availableUntil?: Date;

	// Debugging & DevTools
	debugId?: string;

	// Sitemap Configuration
	sitemap?: AppSitemap;
}

/**
 * Input props for file generation utilities (e.g., sitemap.xml, robots.txt)
 */
export interface SeorionFilesProps {
	/** List of all app routes to generate from */
	routes: AppRoute[];

	/** Output directory (relative or absolute) for generated files */
	outputDir?: string;
}

/**
 * Props to manage route-level guards at runtime (e.g., inside a <RouteGuard>)
 */
export interface RouteGuardProps {
	children: ReactNode;
	isProtected?: boolean;
	loggedAccessed?: boolean;
	requiredRole?: "admin" | "user";
	onEnter?: () => void;
	scrollToTop?: boolean | "once" | "instant" | "smooth";
	customGuard?: () => boolean;

	/**
	 * Rule-based access check
	 * @param ctx Auth data like token and role
	 */
	accessRule?: (ctx: { token: string | null; role: string | null }) => boolean;

	availableFrom?: Date;
	availableUntil?: Date;
	redirectTo?: () => string | null;
}

/**
 * Global context utilities provided by Seorion for route and auth control
 */
export interface SeorionContextProps {
	/** Returns current session token (or null) */
	getToken: () => string | null;

	/** Returns current user role (or null) */
	getRole: () => string | null;

	/**
	 * Returns the path to redirect user to for specific case
	 * @param type One of predefined redirect types
	 */
	redirect: (type: "login" | "admin login" | "unauthorized" | "notfound") => string;
}

/**
 * Represents an individual SEO checklist item.
 */
export interface SeoChecklistItem {
	key: string;
	passed: boolean;
	label: string;
	hint: string;
	weight: number;
}