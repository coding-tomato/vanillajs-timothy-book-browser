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

/**
 * @typedef {Object} CacheEntry
 * @property {never} data - The main data payload. Can be of any type.
 * @property {number} lastUpdated - The timestamp of when the data was last updated, in milliseconds since the Unix epoch.
 * @property {('success'|'error'|'pending')} status - The status of the response.
 */

/**
 * @typedef {string[]} QueryKey - Unique identifier for the query.
 * @typedef {string} QueryKeyString - Stringified version of the QueryKey array.
 */

class QueryStore {
  constructor() {
    this.cache = new Map();
    this.listeners = new Map();
    this.cleanupFunctions = new Map();
  }

  /**
   * Register query within the store
   * @param {QueryKey} key - Unique query key to identify the query
   * @param {function(): Promise<void>} queryFn - Async function to fire
   */
  async query({ key, queryFn, options = {} }) {
    const stringKey = JSON.stringify(key);
    const defaultOptions = {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    };
    const mergedOptions = { ...defaultOptions, ...options };

    let cacheEntry = this.cache.get(key);

    if (cacheEntry && !this.isStale(cacheEntry, mergedOptions.staleTime)) {
      return cacheEntry.data;
    }

    // Clean up any existing query for this key
    this.cleanup(stringKey);

    try {
      this.notifyListeners(stringKey, { status: "loading" });

      const data = await queryFn(...key);

      cacheEntry = {
        data,
        lastUpdated: Date.now(),
        status: "success",
      };

      this.cache.set(key, cacheEntry);
      this.notifyListeners(stringKey, { status: "success", data });

      const timeoutId = setTimeout(
        () => this.removeFromCache(stringKey),
        mergedOptions.cacheTime
      );
      this.cleanupFunctions.set(stringKey, () => {
        clearTimeout(timeoutId);
      });

      return data;
    } catch (e) {
      const error = new QueryStoreError(e);
      cacheEntry = {
        error,
        lastUpdated: Date.now(),
        status: "error",
      };

      this.cache.set(key, cacheEntry);
      this.notifyListeners(stringKey, { status: "error", error });

      throw error;
    }
  }

  /**
   * Remove all cleanup functions for a query key (as there's a new request coming through)
   * @param {QueryKeyString} stringKey - Unique identifier to clean the query key when re-declared
   */
  cleanup(stringKey) {
    const cleanupFn = this.cleanupFunctions.get(stringKey);

    if (cleanupFn) {
      cleanupFn();
      this.cleanupFunctions.delete(stringKey);
    }
  }

  /**
   * Register query within the store
   * @param {CacheEntry} cacheEntry - Entry stored in the cache
   * @param {Number} staleTime - time in milliseconds to make query data stale
   */
  isStale(cacheEntry, staleTime) {
    return Date.now() - cacheEntry.lastUpdated > staleTime;
  }

  /**
   * Remove query from the store's cache
   * @param {QueryKeyString} stringKey
   */
  removeFromCache(stringKey) {
    this.cache.delete(stringKey);
    this.notifyListeners(stringKey, { status: "removed" });
  }

  /**
   * Subscribe to specific query key
   * @param {QueryKey} key
   * @param {function(): Promise<void>} listener - Function callback
   */
  subscribe(key, listener) {
    const stringKey = JSON.stringify(key);

    if (!this.listeners.has(stringKey)) {
      this.listeners.set(stringKey, new Set());
    }
    this.listeners.get(stringKey).add(listener);

    return () => {
      const keyListeners = this.listeners.get(stringKey);
      keyListeners.delete(listener);
      if (keyListeners.size === 0) {
        this.listeners.delete(stringKey);
      }
    };
  }

  /**
   * Subscribe to specific query key
   * @param {QueryKeyString} stringKey
   * @param {Object} data - Function callback
   */
  notifyListeners(stringKey, data) {
    const keyListeners = this.listeners.get(stringKey);
    if (keyListeners) {
      keyListeners.forEach((listener) => listener(data));
    }
  }

  /**
   * Subscribe to specific query key
   * @param {QueryKey} key
   */
  invalidate(key) {
    const stringKey = JSON.stringify(key);

    const cacheEntry = this.cache.get(stringKey);
    if (cacheEntry) {
      cacheEntry.lastUpdated = 0;
    }
  }
}

export const queryStore = new QueryStore();
