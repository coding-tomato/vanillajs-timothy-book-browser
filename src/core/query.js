import { QueryStoreError } from "./exceptions";

export class QueryStore {
  constructor() {
    this.cache = new Map();
  }

  createQuery(key, queryCallback) {
    this.cache.set(key, {
      queryCallback,
      subscribers: [],
    });
  }

  subscribe(key, callback) {
    const query = this.cache.get(key);

    if (!query) {
      throw QueryStoreError(`The suministered key ${key} has no data`);
    }

    this.cache.set(key, {
      ...query,
      subscribers: [...query.subscribers, callback],
    });
  }

  async notify(key) {
    const query = this.cache.get(key);

    if (!query) {
      throw QueryStoreError(`The suministered key ${key} has no data`);
    }

    const response = await query.queryCallback();
    query.subscribers.forEach((callback) => {
      callback(response);
    });
  }
}
