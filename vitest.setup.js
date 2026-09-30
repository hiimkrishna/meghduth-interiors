import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }) => 
    React.createElement("img", { src, alt, ...props }),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement("div", props, children),
    ul: ({ children, ...props }) => React.createElement("ul", props, children),
    li: ({ children, ...props }) => React.createElement("li", props, children),
    button: ({ children, ...props }) => React.createElement("button", props, children),
    span: ({ children, ...props }) => React.createElement("span", props, children),
    p: ({ children, ...props }) => React.createElement("p", props, children),
  },
  AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
  useScroll: () => ({ scrollY: { current: 0 } }),
  useTransform: () => 0,
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));