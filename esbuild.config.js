const path = require("path");
const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const aliasPlugin = require("esbuild-plugin-alias");

esbuild
  .build({
    entryPoints: [
      "src/index.ts",
      "src/database/entities/*.ts",
      "src/database/migrations/*.ts",
    ], // Your app entry point
    bundle: true,
    platform: "node",
    target: "node20", // Match your Node.js version
    outdir: "dist",
    format: "cjs",
    sourcemap: true,
    plugins: [
      // Exclude node_modules from bundle (but still require them at runtime)
      nodeExternalsPlugin(),

      // Handle @/* paths from tsconfig.json
      aliasPlugin({
        "@": path.resolve(__dirname, "src"),
      }),
    ],
    loader: {
      ".ts": "ts",
      ".json": "json",
    },
    // external: [
    //   'pg',
    //   'bcrypt',
    //   'pg-native',
    //   '@mapbox/node-pre-gyp',
    //   'aws-sdk',
    //   'mock-aws-s3',
    //   'nock',
    // ],
    logLevel: "info",
  })
  .catch(() => process.exit(1));
