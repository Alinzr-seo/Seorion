import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.tsx"],
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	sourcemap: true,
	outDir: "dist",
	shims: true,
	skipNodeModulesBundle: true,
	splitting: false,
	minify: false,
	treeshake: true,
});
