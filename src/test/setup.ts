import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

globalThis.IntersectionObserver = MockIntersectionObserver;

afterEach(() => {
  localStorage.clear();
});
