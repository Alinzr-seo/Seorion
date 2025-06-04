import * as path from "path";
import * as fs from "fs/promises";
import { match } from "path-to-regexp";
import { AppRoute, SeorionFilesProps } from "../interface/types";

/**
 * Base URL derived from current window context
 */
const BASE_URL = `${window.location.protocol}//${window.location.host}`;

/**
 * Fetches dynamic paths from an API endpoint to be included in the sitemap.
 * Attaches authorization header if `auth_token` is available in localStorage.
 *
 * @param endpoint API endpoint to fetch from (relative path)
 * @param url Base URL prefix to append to slugs
 * @param modelOpt Property key inside each response object to extract as slug
 * @returns A list of fully resolved route paths
 */
export const dynamicFetch = async (endpoint: string, url: string, modelOpt: string): Promise<string[]> => {
	try {
		const headers: HeadersInit = {};

		if (typeof window !== "undefined" && window.localStorage) {
			const token = localStorage.getItem("auth_token");
			if (token) headers["Authorization"] = `Bearer ${token}`;
		}

		const response = await fetch(`${BASE_URL}${endpoint}`, { headers });

		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

		const data = await response.json();

		if (!Array.isArray(data)) {
			console.warn(`Expected array from ${endpoint}, got:`, data);
			return [];
		}

		return data
			.map((item) => {
				const slug = item?.[modelOpt];
				return slug ? `${url}/${slug}` : null;
			})
			.filter(Boolean) as string[];
	} catch (error) {
		console.error(`Error fetching ${endpoint}:`, error);
		return [];
	}
};

/**
 * Normalizes a given URL to have exactly one leading slash and no trailing slashes.
 */
const normalizePath = (url: string): string => `/${url.replace(/^\/+|\/+$/g, "")}`;

/**
 * Finds the matching `AppRoute` for a given absolute URL.
 *
 * @param url The absolute URL (e.g. https://example.com/about)
 * @param routes All defined routes
 * @param baseUrl The site's base URL to strip from incoming url
 * @returns Matching AppRoute if found
 */
const findMatchingRoute = (url: string, routes: AppRoute[], baseUrl: string): AppRoute | undefined => {
	const relativeUrl = url.replace(baseUrl, "").replace(/\/+$/, "");
	return routes.find((route) => match(route.path, { decode: decodeURIComponent })(relativeUrl));
};

/**
 * Converts a relative route path into an absolute URL string.
 */
const toAbsoluteUrl = (routePath: string, baseUrl: string): string =>
	new URL(normalizePath(routePath), baseUrl).toString();

/**
 * Writes a sitemap.xml file using collected route URLs and their metadata.
 *
 * @param urls Fully qualified URLs to include
 * @param routes Route definitions for metadata reference
 * @param baseUrl Base domain used for route resolution
 * @param outputDir Filesystem directory where sitemap.xml will be written
 */
const writeSitemap = async (urls: string[], routes: AppRoute[], baseUrl: string, outputDir: string): Promise<void> => {
	const date = new Date().toISOString().split("T")[0];

	const entries = urls.map((url) => {
		const route = findMatchingRoute(url, routes, baseUrl);
		return `
  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    ${route?.sitemap?.changeFreq ? `<changefreq>${route.sitemap.changeFreq}</changefreq>` : ""}
    ${route?.sitemap?.priority ? `<priority>${route.sitemap.priority}</priority>` : ""}
  </url>`;
	});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join(
		"\n"
	)}\n</urlset>`;

	await fs.writeFile(path.join(outputDir, "sitemap.xml"), xml.trim(), "utf8");
};

/**
 * Writes a basic robots.txt file that blocks sensitive paths and declares sitemap location.
 *
 * @param baseUrl Site base URL for sitemap reference
 * @param outputDir Output directory where robots.txt will be saved
 */
const writeRobots = async (baseUrl: string, outputDir: string): Promise<void> => {
	const robots = [
		"User-agent: *",
		"Disallow: /admin",
		"Disallow: /dashboard",
		"Disallow: /user",
		"Allow: /",
		`Sitemap: ${new URL("/sitemap.xml", baseUrl).toString()}`,
	].join("\n");

	await fs.writeFile(path.join(outputDir, "robots.txt"), robots, "utf8");
};

/**
 * Main function to generate both sitemap.xml and robots.txt files
 * based on provided route definitions.
 *
 * @param routes Array of route objects (with SEO config)
 * @param outputDir Optional directory to output files to (default: /public)
 */
export async function SeorionFiles({ routes, outputDir }: SeorionFilesProps): Promise<void> {
	const Dir = outputDir ?? "public";
	const urls: string[] = [];

	for (const route of routes) {
		if (!route.sitemap?.include) continue;

		// If route is dynamic and has a data-fetching mechanism
		if (route.sitemap.dynamic && route.sitemap.fetchDynamicPaths) {
			try {
				const dynamicPaths = await route.sitemap.fetchDynamicPaths(
					route.sitemap.dynamicPathProps?.endpoint ?? "",
					route.sitemap.dynamicPathProps?.path ?? "",
					route.sitemap.dynamicPathProps?.modelOpt ?? ""
				);
				dynamicPaths.map(normalizePath).forEach((p) => urls.push(toAbsoluteUrl(p, BASE_URL)));
			} catch (error) {
				// If fetch fails, fallback to base dynamic path
				urls.push(toAbsoluteUrl(route.sitemap.dynamicPathProps?.path ?? "", BASE_URL));
			}
		}
	}

	await fs.mkdir(Dir, { recursive: true });

	await writeSitemap(urls, routes, BASE_URL, Dir);
	await writeRobots(BASE_URL, Dir);

	console.log("✅ Seorion Files generated successfully");
}
