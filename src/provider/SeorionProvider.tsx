import { MemoryRouter } from "react-router-dom";
import { queryClient } from "../utils/QueryClient";
import { HelmetProvider } from "react-helmet-async";
import { SeorionContextProps } from "../interface/types";
import { QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";

/**
 * SeorionContext provides runtime access to authentication & route security.
 */
const SeorionContext = createContext<SeorionContextProps | null>(null);

/**
 * Internal function: retrieves token from localStorage
 */
const getToken = (): string | null => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("auth_token");
};

/**
 * Internal function: retrieves user role from localStorage
 */
const getRole = (): string | null => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("user_role");
};

/**
 * Redirect helper that returns route path for common redirect types
 * (used in access control logic)
 *
 * @param type One of: "login", "admin login", "unauthorized", "notfound"
 * @returns Path to redirect user to
 */
const redirect = (type: "login" | "admin login" | "unauthorized" | "notfound"): string => {
	switch (type) {
		case "login":
			return "/login";
		case "admin login":
			return "/admin/login";
		case "unauthorized":
			return "/unauthorized";
		case "notfound":
			return "/404";
		default:
			return "/";
	}
};

/**
 * Top-level SeorionProvider that wraps the app with:
 * - HelmetProvider (for SEO)
 * - MemoryRouter (for internal routing)
 * - QueryClientProvider (for data caching)
 * - Custom SeorionContext (for auth and routing utilities)
 *
 * @param children - React children
 */
export const SeorionProvider = ({ children }: PropsWithChildren): ReactNode => {
	const contextValue = useMemo<SeorionContextProps>(() => {
		return { getToken, getRole, redirect };
	}, []);

	return (
		<HelmetProvider>
			<MemoryRouter>
				<QueryClientProvider client={queryClient}>
					<SeorionContext.Provider value={contextValue}>{children}</SeorionContext.Provider>
				</QueryClientProvider>
			</MemoryRouter>
		</HelmetProvider>
	);
};

/**
 * Custom hook to access SeorionContext.
 * Throws an error if used outside of SeorionProvider.
 *
 * @returns SeorionContextProps
 */
export const useSecurity = (): SeorionContextProps => {
	const context = useContext(SeorionContext);
	if (!context) throw new Error("❌ useSecurity must be used within a <SeorionProvider>");
	return context;
};