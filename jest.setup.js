// jest.setup.js

// Polyfill window.matchMedia for next-themes
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},    // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill URL.createObjectURL for CSV-export tests
if (typeof URL.createObjectURL !== "function") {
  URL.createObjectURL = function (blob) {
    // you can return anything here; tests will inspect the blob itself
    return "blob:fake-url";
  };
}

// Optional: stub revokeObjectURL to avoid errors
if (typeof URL.revokeObjectURL !== "function") {
  URL.revokeObjectURL = function () {};
}
