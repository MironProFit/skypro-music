// jest.setup.ts
import '@testing-library/jest-dom';

declare global {
  interface Window {
    localStorage?: LocalStorageMock;
  }

  interface LocalStorageMock {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
  }
}

let storage: Record<string, string> = {}; // Здесь определяем объект для хранения данных

Object.defineProperty(global.window, 'localStorage', {
  writable: true,
  configurable: true,
  value: {
    getItem(key: string) {
      return storage[key] || null;
    },
    setItem(key: string, value: string) {
      storage[key] = value;
    },
    removeItem(key: string) {
      delete storage[key];
    },
    clear() {
      storage = {};
    },
  },
});

// Если хотите проверить наличие localStorage, добавьте проверку:
if (!global.window.localStorage) {
  throw new Error("LocalStorage не доступен");
}
