import { Helmet } from "react-helmet-async";
import { AppRoute } from "../interface/types";
import { RouteGuard } from "./SeorionRouteGuard";
import SeorionPanel from "../devtool/SeorionPanel";
import { useEffect, ReactNode, Suspense, isValidElement, createElement, type ComponentType } from "react";

/**
 * Main router renderer for a given AppRoute.
 * Applies route guards, metadata injection, layout rendering, SEO panel, and suspense handling.
 *
 * @param route - The route configuration object to render
 * @param fallbackOverride - Optional fallback element during lazy loading
 * @returns A ReactNode wrapped in all necessary logic for SEO & access control
 */
export const SeorionRouter = (route: AppRoute, fallbackOverride?: ReactNode): ReactNode => {
	// -------------------------
	// Fallback content for Suspense
	// -------------------------
	const Fallback = fallbackOverride ?? route.fallback ?? <div>Loading...</div>;

	// -------------------------
	// Lifecycle Hook: onView
	// -------------------------
	useEffect(() => {
		route.onView?.();
	}, []);

	/**
	 * Dynamically renders the route inside an optional layout.
	 * Handles both lazy and static React components.
	 */
	const renderLayout = (): ReactNode => {
		const content = typeof route.element === "function" ? createElement(route.element) : route.element;

		if (!route.layout) return <>{content}</>;

		if (isValidElement(route.layout)) return route.layout;

		const Layout = route.layout as ComponentType<{ children: ReactNode }>;
		return createElement(Layout, null, content);
	};

	return (
		<RouteGuard
			isProtected={route.isProtected}
			loggedAccessed={route.loggedAccessed}
			requiredRole={route.requiredRole}
			onEnter={route.onEnter}
			scrollToTop={route.scrollToTop}
			customGuard={route.customGuard}
			accessRule={route.accessRule}
			availableFrom={route.availableFrom}
			availableUntil={route.availableUntil}
			redirectTo={route.redirectTo}
		>
			<Helmet>
				{/* Basic SEO meta tags */}
				<title>{route.title}</title>
				{route.metaDescription && <meta name="description" content={route.metaDescription} />}
				{route.keywords && <meta name="keywords" content={route.keywords.join(", ")} />}
				{route.tags?.map((tag, i) => (
					<meta key={i} name="tag" content={tag} />
				))}

				{/* Canonical and language alternatives */}
				{route.canonical && <link rel="canonical" href={route.canonical} />}
				{route.lang && <html lang={route.lang} />}
				{route.altLinks?.map((alt, i) => (
					<link key={i} rel="alternate" hrefLang={alt.lang} href={alt.href} />
				))}

				{/* OpenGraph (Facebook, LinkedIn, etc.) */}
				{route.openGraph && (
					<>
						<meta property="og:title" content={route.openGraph.title || route.title} />
						<meta
							property="og:description"
							content={route.openGraph.description || route.metaDescription}
						/>
						<meta property="og:image" content={route.openGraph.image} />
					</>
				)}

				{/* Twitter Card SEO */}
				{route.twitterCard && (
					<>
						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:title" content={route.twitterCard.title || route.title} />
						<meta
							name="twitter:description"
							content={route.twitterCard.description || route.metaDescription}
						/>
						<meta name="twitter:image" content={route.twitterCard.image} />
					</>
				)}

				{/* Custom meta tags */}
				{route.customMeta?.map((meta, i) => (
					<meta key={i} name={meta.name} content={meta.content} />
				))}

				{/* JSON-LD structured data */}
				{route.schema && (
					<script type="application/ld+json">
						{JSON.stringify({
							"@context": "https://schema.org",
							"@type": route.schema,
							...route.schemaData,
						})}
					</script>
				)}

				{/* User-defined meta injection */}
				{route.helmetExtend?.()}
			</Helmet>

			{/* Render content inside Suspense and optional debug wrapper */}
			<div data-debug-id={route.debugId}>
				<Suspense fallback={Fallback}>
					{/* DevTool Panel */}
					<SeorionPanel route={route} />

					{/* Layout + Page Component */}
					{renderLayout()}
				</Suspense>
			</div>
		</RouteGuard>
	);
};
