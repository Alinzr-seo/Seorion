import { QueryClient } from "@tanstack/react-query";

/**
 * The central instance of `QueryClient` used throughout the application.
 *
 * It manages caching, background updates, retries, garbage collection, etc.
 */
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			/**
			 * Duration (in ms) for which query data is considered fresh.
			 * After this time, a new fetch **can** be triggered depending on other settings.
			 * @default 5 minutes
			 */
			staleTime: 1000 * 60 * 5,

			/**
			 * Duration (in ms) to keep inactive (unused) query data in cache before GC removes it.
			 * Helps optimize memory usage.
			 * @default 5 minutes
			 */
			gcTime: 1000 * 60 * 5,

			/**
			 * Custom retry logic for failed queries.
			 * - Retries up to 2 times.
			 * - Always retries if error is related to network failure.
			 *
			 * @param failureCount Number of retry attempts so far.
			 * @param error The error thrown by the query function.
			 * @returns Whether to retry the query.
			 */
			retry: (failureCount, error) => {
				if (error instanceof Error && error.message.includes("Network")) {
					return true;
				}
				return failureCount < 2;
			},

			/**
			 * Disable refetching query when window regains focus.
			 * Useful to reduce unnecessary refetches in single-page apps.
			 */
			refetchOnWindowFocus: false,

			/**
			 * Automatically refetch queries when browser reconnects to internet.
			 * Good for offline-first support.
			 */
			refetchOnReconnect: true,
		},
		mutations: {
			/**
			 * Retry failed mutations once before failing.
			 * Helps with transient server errors.
			 */
			retry: 1,
		},
	},
});
