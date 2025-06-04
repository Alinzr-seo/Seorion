import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { RouteGuardProps } from "../interface/types";
import { useSecurity } from "../provider/SeorionProvider";

/**
 * `RouteGuard` is a versatile access control wrapper for routes.
 * It handles:
 * - auth protection (token check)
 * - role-based access control (RBAC)
 * - custom guards
 * - lifecycle callbacks
 * - time-based availability windows
 * - scroll behavior on entry
 *
 * @param props RouteGuardProps defining access rules and child content
 * @returns Redirect or `children` depending on access evaluation
 */
export const RouteGuard = ({
	children,
	isProtected,
	loggedAccessed,
	requiredRole,
	onEnter,
	scrollToTop,
	customGuard,
	accessRule,
	availableFrom,
	availableUntil,
	redirectTo,
}: RouteGuardProps) => {
	const { getToken, getRole, redirect } = useSecurity();
	const token = getToken();
	const role = getRole();

	// ----------------------------
	// Lifecycle: onEnter + scroll
	// ----------------------------
	useEffect(() => {
		onEnter?.();

		if (scrollToTop === true || scrollToTop === "smooth") {
			setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 150);
		} else if (scrollToTop === "instant") {
			window.scrollTo({ top: 0, behavior: "auto" });
		}
	}, []);

	// ----------------------------
	// Priority: Custom redirect
	// ----------------------------
	if (redirectTo) {
		const destination = redirectTo();
		if (destination) return <Navigate to={destination} />;
	}

	// ----------------------------
	// Custom condition guard
	// ----------------------------
	if (customGuard && !customGuard()) {
		return <Navigate to={redirect("unauthorized")} />;
	}

	// ----------------------------
	// Rule-based access control (e.g., ACL)
	// ----------------------------
	if (accessRule && !accessRule({ token, role })) {
		return <Navigate to={redirect("unauthorized")} />;
	}

	// ----------------------------
	// Time-based access (availability window)
	// ----------------------------
	const now = new Date();

	if (availableFrom && now < new Date(availableFrom)) {
		return <Navigate to={redirect("unauthorized")} />;
	}

	if (availableUntil && now > new Date(availableUntil)) {
		return <Navigate to={redirect("unauthorized")} />;
	}

	// ----------------------------
	// Token-based protection
	// ----------------------------
	if (isProtected && !token) {
		return <Navigate to={redirect("login")} />;
	}

	// ----------------------------
	// Role-based protection
	// ----------------------------
	if (isProtected && token && requiredRole && role !== requiredRole) {
		return <Navigate to={redirect("unauthorized")} />;
	}

	// ----------------------------
	// Logged users not allowed (e.g., login route)
	// ----------------------------
	if (loggedAccessed && role === "admin") {
		return <Navigate to={redirect("notfound")} />;
	}

	// ----------------------------
	// Access granted
	// ----------------------------
	return <>{children}</>;
};
