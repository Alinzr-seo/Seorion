import { defineConfig } from "tsup";

/**
 * TSUP configuration for building the Seorion package.
 * Outputs both CommonJS and ESModule formats.
 */
export default defineConfig({
	// Generate .d.ts declaration files
	dts: true,

	// Automatically polyfill Node.js built-ins (e.g., process)
	shims: true,

	// Clean output directory before build
	clean: true,

	// Output both CommonJS and ESM for wider compatibility
	format: ["cjs", "esm"],

	// Main entry point for the library
	entry: ["./src/index.tsx"],

	// Do not bundle node_modules (keep them external)
	skipNodeModulesBundle: true,
});
