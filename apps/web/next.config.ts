import type { NextConfig } from "next";
import path from "path";
import { createRequire } from "module";

const blocksRoot = path.join(__dirname, "../../blocks");
const blocksRel = "../../blocks";

const requireBlocks = createRequire(path.join(blocksRoot, "package.json"));
const blocksPkg = requireBlocks("./package.json") as {
  exports: Record<string, string>;
};

/** Map gwenui-blocks/<name> → source entry (Turbopack needs relative paths on Windows). */
function buildBlockAliases(relative: boolean): Record<string, string> {
  const aliases: Record<string, string> = {};
  for (const [sub, target] of Object.entries(blocksPkg.exports)) {
    const key = `gwenui-blocks${sub.slice(1)}`;
    const entry = target.replace(/^\.\//, "");
    aliases[key] = relative
      ? `${blocksRel}/${entry}`.replace(/\\/g, "/")
      : path.join(blocksRoot, entry);
  }
  return aliases;
}

const turbopackBlockAliases = buildBlockAliases(true);
const webpackBlockAliases = buildBlockAliases(false);

const nextConfig: NextConfig = {
  transpilePackages: ["gwenui-blocks"],
  experimental: {
    externalDir: true,
  },
  turbopack: {
    resolveAlias: turbopackBlockAliases,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...webpackBlockAliases,
    };
    return config;
  },
};

export default nextConfig;
