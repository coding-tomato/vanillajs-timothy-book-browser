import { QueryStoreError } from "./exceptions";

/*
  Usage:
  - In a component, you should during component initialization,
    create a Query and pass parameters to it. By default, the values
    you set in your key array, will be passed down to the queryFn.
    Example: 
      queryStore.query(
        ['books', page, searchTerms],
        (_, page, searchTerms) => asyncFunction(page, searchTerms)
      )
  - Now, other components can subscribe to this key and receive the
    exact same data, as long as they use the exact same key.
    Example:
      queryStore.subscribe(
      ['books', ...searchTerms],
      () => handlerToUseData()
    )

  Notes:
  - Ideally, a state manager would streamline the sharing of these
  search terms.
*/

class QueryStore {
  constructor() {
    this.cache = new Map();
    this.listeners = new Map();
    this.cleanupFunctions = new Map();

    this.loadPersistedCache();

    window.addEventListener("beforeunload", () => {
      this.savePersistedCache();
    });
  }

  loadPersistedCache() {
    const persistedState = localStorage.getItem("query-cache");

    if (persistedState) {
      this.cache = new Map(JSON.parse(persistedState));
    }
  }
  savePersistedCache() {
    localStorage.setItem(
      "query-cache",
      JSON.stringify(Array.from(this.cache.entries()))
    );
  }

  async query({ queryKey, queryFn, options = {} }) {
    const stringKey = JSON.stringify(queryKey);
    const defaultOptions = {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    };
    const mergedOptions = { ...defaultOptions, ...options };

    let cacheEntry = this.cache.get(stringKey);

    if (cacheEntry && !this.isStale(cacheEntry, mergedOptions.staleTime)) {
      this.notifyListeners(stringKey, cacheEntry);
      return cacheEntry;
    }

    // Clean up any existing query for this key
    this.cleanup(stringKey);

    try {
      this.notifyListeners(stringKey, { status: "loading" });

      const data = await queryFn(...queryKey);

      cacheEntry = {
        data,
        lastUpdated: Date.now(),
        status: "success",
      };

      this.cache.set(stringKey, cacheEntry);
      this.notifyListeners(stringKey, { status: "success", data });

      const timeoutId = setTimeout(
        () => this.removeFromCache(stringKey),
        mergedOptions.cacheTime
      );
      this.cleanupFunctions.set(stringKey, () => {
        clearTimeout(timeoutId);
      });

      return cacheEntry;
    } catch (e) {
      const error = new QueryStoreError(e);

      cacheEntry = {
        error,
        lastUpdated: Date.now(),
        status: "error",
      };

      this.cache.set(stringKey, cacheEntry);
      this.notifyListeners(stringKey, { status: "error", error });

      throw error;
    }
  }

  cleanup(stringKey) {
    const cleanupFn = this.cleanupFunctions.get(stringKey);

    if (cleanupFn) {
      cleanupFn();
      this.cleanupFunctions.delete(stringKey);
    }
  }

  isStale(cacheEntry, staleTime) {
    return Date.now() - cacheEntry.lastUpdated > staleTime;
  }

  removeFromCache(stringKey) {
    this.cache.delete(stringKey);
    this.notifyListeners(stringKey, { status: "removed" });
  }

  subscribe(key, listener) {
    const stringKey = JSON.stringify(key);
    const cacheEntry = this.cache.get(stringKey);

    if (!this.listeners.has(stringKey)) {
      this.listeners.set(stringKey, new Set());
    }
    this.listeners.get(stringKey).add(listener);

    return [
      cacheEntry,
      () => {
        const keyListeners = this.listeners.get(stringKey);
        keyListeners.delete(listener);
        if (keyListeners.size === 0) {
          this.listeners.delete(stringKey);
        }
      },
    ];
  }

  notifyListeners(stringKey, data) {
    const keyListeners = this.listeners.get(stringKey);
    if (keyListeners) {
      keyListeners.forEach((listener) => listener(data));
    }
  }

  invalidate(key) {
    const stringKey = JSON.stringify(key);

    const cacheEntry = this.cache.get(stringKey);
    if (cacheEntry) {
      cacheEntry.lastUpdated = 0;
    }
  }
}

export const queryStore = new QueryStore();
