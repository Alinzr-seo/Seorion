import "./style.css";
import { useMemo, useState } from "react";
import type { AppRoute, SeoChecklistItem } from "../interface/types";

/**
 * Calculates the SEO score for a given route based on various quality factors.
 * Returns both total score and checklist for display purposes.
 *
 * @param route - The route object containing SEO metadata
 * @returns An object containing the SEO score and checklist breakdown
 */
function calculateSeoScore(route: AppRoute): {
	score: number;
	checklist: SeoChecklistItem[];
} {
	const focusKeyword = route.keywords?.[0]?.toLowerCase();
	const path = route.path.toLowerCase();
	const title = route.title?.toLowerCase() ?? "";
	const desc = route.metaDescription?.toLowerCase() ?? "";

	const checklist: SeoChecklistItem[] = [
		{
			key: "focusKeywordPresent",
			passed: !!focusKeyword,
			label: "Focus Keyword Defined",
			hint: "Define a main focus keyword.",
			weight: 5,
		},
		{
			key: "keywordInTitle",
			passed: focusKeyword ? title.includes(focusKeyword) : false,
			label: "Keyword in Title",
			hint: "Focus keyword should appear in the page title.",
			weight: 10,
		},
		{
			key: "keywordAtStartOfTitle",
			passed: focusKeyword ? title.startsWith(focusKeyword) : false,
			label: "Keyword at Start of Title",
			hint: "Start the title with the focus keyword.",
			weight: 5,
		},
		{
			key: "keywordInMetaDescription",
			passed: focusKeyword ? desc.includes(focusKeyword) : false,
			label: "Keyword in Meta Description",
			hint: "Mention the focus keyword in meta description.",
			weight: 10,
		},
		{
			key: "keywordInURL",
			passed: focusKeyword ? path.includes(focusKeyword) : false,
			label: "Keyword in URL",
			hint: "Focus keyword should appear in the page path.",
			weight: 10,
		},
		{
			key: "titleLengthOptimal",
			passed: title.length >= 30 && title.length <= 60,
			label: "Optimal Title Length",
			hint: "Title should be 30-60 characters.",
			weight: 5,
		},
		{
			key: "metaDescLengthOptimal",
			passed: desc.length >= 120 && desc.length <= 160,
			label: "Optimal Meta Description Length",
			hint: "Meta description should be 120-160 characters.",
			weight: 5,
		},
		{
			key: "canonicalDefined",
			passed: !!route.canonical && route.canonical.startsWith("https://"),
			label: "Canonical URL",
			hint: "Should be set and start with https://",
			weight: 5,
		},
		{
			key: "openGraphComplete",
			passed: !!route.openGraph?.title && !!route.openGraph?.description && !!route.openGraph?.image,
			label: "OpenGraph Complete",
			hint: "Should include title, description, and image.",
			weight: 5,
		},
		{
			key: "twitterCardComplete",
			passed: !!route.twitterCard?.title && !!route.twitterCard?.description && !!route.twitterCard?.image,
			label: "Twitter Card Complete",
			hint: "Should include title, description, and image.",
			weight: 5,
		},
		{
			key: "schemaValid",
			passed: !!route.schema && !!route.schemaData,
			label: "Schema Defined",
			hint: "Schema and structured data must be defined.",
			weight: 5,
		},
		{
			key: "languageSet",
			passed: !!route.lang,
			label: "Language Defined",
			hint: "Language code should be defined.",
			weight: 5,
		},
	];

	// Calculate the total weighted score
	const totalScore = checklist.reduce((acc, item) => acc + (item.passed ? item.weight : 0), 0);

	return { score: totalScore, checklist };
}

/**
 * SEO scoring panel component that visually shows route SEO health
 * based on a weighted checklist.
 *
 * @param route - The current route object to analyze
 * @returns React component
 */
function SeorionPanel({ route }: { route: AppRoute }) {
	const [isOpen, setIsOpen] = useState(true);

	// Use useMemo to avoid recalculating on every re-render
	const { score, checklist } = useMemo(() => calculateSeoScore(route), [route]);

	return (
		<aside className={`seorion-panel ${isOpen ? "open" : "closed"}`}>
			{/* Toggle Button to Expand/Collapse Panel */}
			<button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
				{isOpen ? (
					<svg
						width="24"
						height="24"
						fill="none"
						stroke="#e2e8f0"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						viewBox="0 0 24 24"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
				) : (
					<svg
						width="24"
						height="24"
						fill="none"
						stroke="#e2e8f0"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						viewBox="0 0 24 24"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				)}
			</button>

			{/* Main Panel Content */}
			<div className="panel-wrapper">
				<div className="panel-header">
					<div
						className={`score-circle ${
							score >= 85 ? "score-good" : score >= 60 ? "score-medium" : "score-bad"
						}`}
					>
						{score}
					</div>
					<h2>SEO Score</h2>
				</div>

				<ul className="seo-checklist">
					{checklist.map((item) => (
						<li key={item.key} className={item.passed ? "passed" : "failed"}>
							<span className="status-icon" aria-hidden="true">
								{item.passed ? (
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#22c55e"
										strokeWidth="2.2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M20 6L9 17l-5-5" />
									</svg>
								) : (
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#ef4444"
										strokeWidth="2.2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<circle cx="12" cy="12" r="10" />
										<line x1="15" y1="9" x2="9" y2="15" />
										<line x1="9" y1="9" x2="15" y2="15" />
									</svg>
								)}
							</span>
							<div className="info">
								<strong>{item.label}</strong>
								<p>{item.hint}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
}

export default SeorionPanel;