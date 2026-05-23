import {
  FONT_CACHE_HEADERS,
  SECURITY_HEADERS,
} from "../security-headers";

describe("Security Headers", () => {
  const requiredSecurityKeys = [
    "Content-Security-Policy",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "X-Frame-Options",
    "Permissions-Policy",
  ] as const;

  describe("SECURITY_HEADERS", () => {
    it("includes all required security headers", () => {
      const keys = SECURITY_HEADERS.map((header) => header.key);
      for (const required of requiredSecurityKeys) {
        expect(keys).toContain(required);
      }
    });

    it("uses a strict default-src and self-hosted fonts", () => {
      const csp = SECURITY_HEADERS.find(
        (header) => header.key === "Content-Security-Policy",
      );
      expect(csp?.value).toContain("default-src 'self'");
      expect(csp?.value).toContain("font-src 'self'");
      expect(csp?.value).not.toContain("fonts.googleapis.com");
    });

    it("denies framing", () => {
      const xfo = SECURITY_HEADERS.find(
        (header) => header.key === "X-Frame-Options",
      );
      expect(xfo?.value).toBe("DENY");
    });

    it("restricts sensitive browser capabilities", () => {
      const permissions = SECURITY_HEADERS.find(
        (header) => header.key === "Permissions-Policy",
      );
      expect(permissions?.value).toContain("camera=()");
      expect(permissions?.value).toContain("microphone=()");
      expect(permissions?.value).toContain("geolocation=()");
    });
  });

  describe("FONT_CACHE_HEADERS", () => {
    it("sets long-lived immutable cache for fonts", () => {
      expect(FONT_CACHE_HEADERS).toEqual([
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ]);
    });
  });
});
