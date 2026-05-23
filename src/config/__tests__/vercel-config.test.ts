import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  IMMUTABLE_CACHE_HEADERS,
  SECURITY_HEADERS,
} from "../security-headers";

type VercelHeaderRule = {
  source: string;
  headers: { key: string; value: string }[];
};

type VercelConfig = {
  headers?: VercelHeaderRule[];
};

function readVercelConfig(): VercelConfig {
  const configPath = resolve(process.cwd(), "vercel.json");
  return JSON.parse(readFileSync(configPath, "utf8")) as VercelConfig;
}

function findHeaders(source: string): { key: string; value: string }[] {
  const rule = readVercelConfig().headers?.find((entry) => entry.source === source);
  return rule?.headers ?? [];
}

describe("vercel.json", () => {
  it("keeps global security headers in sync with security-headers.ts", () => {
    expect(findHeaders("/(.*)")).toEqual([...SECURITY_HEADERS]);
  });

  it("keeps font cache headers in sync with security-headers.ts", () => {
    expect(findHeaders("/fonts/(.*)")).toEqual([...IMMUTABLE_CACHE_HEADERS]);
  });

  it("keeps hashed asset cache headers in sync with security-headers.ts", () => {
    expect(findHeaders("/assets/(.*)")).toEqual([...IMMUTABLE_CACHE_HEADERS]);
  });

  it("keeps SPA rewrites for client-side routing", () => {
    const config = readVercelConfig();
    expect(config).toMatchObject({
      rewrites: [{ source: "/(.*)", destination: "/index.html" }],
    });
  });
});
